import { describe, it, expect, beforeEach } from 'vitest';
import { automationRepository } from '../repositories/automationRepository';
import { securityRepository } from '../repositories/securityRepository';
import { crmRepository } from '../repositories/crmRepository';

describe('FASE 08 — Integraciones, Notificaciones y Conectores', () => {
  beforeEach(() => {
    automationRepository.resetToDefault();
    securityRepository.resetToDefault();
    crmRepository.resetToDefault();
  });

  describe('Catálogo de Workflows y Gobernanza', () => {
    it('carga los flujos de automatización por defecto con propietarios asignados', () => {
      const workflows = automationRepository.getWorkflows();
      expect(workflows.length).toBeGreaterThanOrEqual(4);

      workflows.forEach((wf) => {
        expect(['Valdez', 'Socio Fundador']).toContain(wf.owner);
        expect(wf.rateLimitPerHour).toBeGreaterThan(0);
        expect(wf.actions.length).toBeGreaterThan(0);
      });
    });

    it('permite pausar y reanudar flujos de forma controlada', () => {
      const wf = automationRepository.getWorkflowById('wf-lead-welcome');
      expect(wf).toBeDefined();
      expect(wf?.status).toBe('active');

      const toggled = automationRepository.toggleWorkflowStatus('wf-lead-welcome');
      expect(toggled.status).toBe('paused');

      // Intentar ejecutar un flujo pausado debe fallar
      const execRes = automationRepository.executeWorkflow('wf-lead-welcome', {});
      expect(execRes.status).toBe('failed');
      expect(execRes.executedActionsCount).toBe(0);

      // Reanudar
      const resumed = automationRepository.toggleWorkflowStatus('wf-lead-welcome');
      expect(resumed.status).toBe('active');
    });
  });

  describe('Motor de Ejecución y Compuertas de Seguridad', () => {
    it('ejecuta flujos autónomos sin confirmación humana previa si están configurados', () => {
      const prevTasks = crmRepository.getTasks().length;
      const res = automationRepository.executeWorkflow('wf-lead-welcome', {
        clientName: 'Nuevo Prospecto Test',
      });

      expect(res.status).toBe('executed');
      expect(res.executedActionsCount).toBeGreaterThanOrEqual(2);
      expect(crmRepository.getTasks().length).toBe(prevTasks + 1);

      // Verifica incremento en estadísticas
      const updatedWf = automationRepository.getWorkflowById('wf-lead-welcome');
      expect(updatedWf?.executionStats.totalRuns).toBeGreaterThan(0);
    });

    it('bloquea flujos críticos que requieren confirmación humana si no se autorizan', () => {
      const criticalWf = automationRepository.getWorkflowById('wf-deal-won');
      expect(criticalWf?.requiresHumanConfirmation).toBe(true);

      // Ejecución sin confirmación humana
      const resWithoutAuth = automationRepository.executeWorkflow(
        'wf-deal-won',
        { stage: 'won' },
        false
      );
      expect(resWithoutAuth.status).toBe('blocked_by_confirmation');
      expect(resWithoutAuth.executedActionsCount).toBe(0);

      // Ejecución con confirmación humana
      const resWithAuth = automationRepository.executeWorkflow(
        'wf-deal-won',
        { stage: 'won' },
        true
      );
      expect(resWithAuth.status).toBe('executed');
      expect(resWithAuth.executedActionsCount).toBeGreaterThanOrEqual(2);
    });

    it('detiene la ejecución si las condiciones de negocio no se cumplen', () => {
      // El flujo requiere stage === 'won'
      const res = automationRepository.executeWorkflow('wf-deal-won', { stage: 'lost' }, true);
      expect(res.status).toBe('condition_unmet');
      expect(res.executedActionsCount).toBe(0);
    });

    it('aplica protección anti-bucles (Rate Limiting) cuando se excede la tasa por hora', () => {
      const wf = automationRepository.getWorkflowById('wf-lead-welcome')!;
      const limit = wf.rateLimitPerHour;

      // Ejecutar hasta el límite
      for (let i = 0; i < limit; i++) {
        automationRepository.executeWorkflow('wf-lead-welcome', {});
      }

      // La ejecución (limit + 1) debe ser bloqueada por rate limit
      const blockedRes = automationRepository.executeWorkflow('wf-lead-welcome', {});
      expect(blockedRes.status).toBe('rate_limited');
      expect(blockedRes.message).toContain('Límite por hora alcanzado');
    });
  });

  describe('Webhooks, Conectores y Sanitización de Datos', () => {
    it('genera firmas HMAC SHA-256 válidas y sanitiza secretos en la entrega de webhooks', () => {
      const dirtyPayload = {
        deploymentId: 'dep-test-1',
        apiKey: 'sk_live_supersecret_12345',
        dbPassword: 'secretpassword99',
        targetBranch: 'main',
      };

      const log = automationRepository.dispatchWebhook('wh-deploy', 'test.deploy', dirtyPayload);

      expect(log.signatureHeader).toMatch(/^sha256=/);
      expect(log.statusCode).toBe(200);
      expect(log.payloadSanitized.apiKey).toBe('[REDACTED]');
      expect(log.payloadSanitized.dbPassword).toBe('[REDACTED]');
      expect(log.payloadSanitized.targetBranch).toBe('main');
    });

    it('permite alternar el estado de conectores y rotar claves secretas en securityRepository', () => {
      const integrations = securityRepository.getIntegrations();
      expect(integrations.length).toBeGreaterThanOrEqual(4);

      const cf = integrations.find((i) => i.id === 'int-cloudflare');
      expect(cf).toBeDefined();

      const toggled = securityRepository.toggleIntegrationStatus('int-cloudflare');
      expect(toggled.status).toBe('disconnected');

      const reconnected = securityRepository.toggleIntegrationStatus('int-cloudflare');
      expect(reconnected.status).toBe('connected');

      const rotated = securityRepository.rotateIntegrationSecret('int-cloudflare');
      expect(rotated.maskedSecretKey).toContain('rot');

      // Verificar que la auditoría haya registrado el evento sin filtrar secretos
      const audit = securityRepository.getAuditLogs()[0];
      expect(audit.action).toBe('KEY_ROTATION');
      expect(audit.detailsSanitized).not.toContain('supersecret');
    });
  });
});

