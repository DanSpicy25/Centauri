import { describe, it, expect, beforeEach } from 'vitest';
import { securityRepository } from '../repositories/securityRepository';
import { UserRole } from '../types/security';

describe('Seguridad, Integraciones, RBAC & Hardening (Fase 08)', () => {
  beforeEach(() => {
    securityRepository.resetToDefault();
  });

  describe('Control de Acceso Basado en Roles (RBAC)', () => {
    it('debe contener las 4 definiciones canónicas de roles con sus respectivos privilegios', () => {
      const roles = securityRepository.getRoles();
      expect(roles.length).toBe(4);

      const roleKeys = roles.map((r) => r.role);
      expect(roleKeys).toContain('superadmin');
      expect(roleKeys).toContain('manager');
      expect(roleKeys).toContain('editor');
      expect(roleKeys).toContain('auditor');
    });

    it('superadmin debe tener acceso irrestricto de lectura, escritura y gestión de secretos', () => {
      expect(securityRepository.hasPermission('superadmin', 'security', 'manage_secrets')).toBe(true);
      expect(securityRepository.hasPermission('superadmin', 'finance', 'write')).toBe(true);
      expect(securityRepository.hasPermission('superadmin', 'cms', 'publish')).toBe(true);
      expect(securityRepository.hasPermission('superadmin', 'sites', 'delete')).toBe(true);
    });

    it('manager debe tener acceso a CRM, finanzas y automatizaciones, pero no a gestión de secretos de seguridad', () => {
      expect(securityRepository.hasPermission('manager', 'crm', 'write')).toBe(true);
      expect(securityRepository.hasPermission('manager', 'finance', 'write')).toBe(true);
      expect(securityRepository.hasPermission('manager', 'automations', 'write')).toBe(true);
      // Denegado gestión de secretos perimetrales
      expect(securityRepository.hasPermission('manager', 'security', 'manage_secrets')).toBe(false);
      expect(securityRepository.hasPermission('manager', 'security', 'delete')).toBe(false);
    });

    it('editor debe tener acceso únicamente a CMS y portafolio, denegando acceso a finanzas o secretos', () => {
      expect(securityRepository.hasPermission('editor', 'cms', 'write')).toBe(true);
      expect(securityRepository.hasPermission('editor', 'portfolio', 'publish')).toBe(true);
      // Denegado finanzas y seguridad
      expect(securityRepository.hasPermission('editor', 'finance', 'read')).toBe(false);
      expect(securityRepository.hasPermission('editor', 'security', 'manage_secrets')).toBe(false);
      expect(securityRepository.hasPermission('editor', 'crm', 'write')).toBe(false);
    });

    it('auditor debe tener acceso de solo lectura y exportación, sin facultades de mutación', () => {
      expect(securityRepository.hasPermission('auditor', 'security', 'read')).toBe(true);
      expect(securityRepository.hasPermission('auditor', 'security', 'export')).toBe(true);
      expect(securityRepository.hasPermission('auditor', 'security', 'write')).toBe(false);
      expect(securityRepository.hasPermission('auditor', 'finance', 'delete')).toBe(false);
      expect(securityRepository.hasPermission('auditor', 'cms', 'publish')).toBe(false);
    });

    it('debe permitir cambiar y simular el rol activo en sesión y registrar auditoría', () => {
      expect(securityRepository.getActiveRole()).toBe('superadmin');

      securityRepository.setActiveRole('auditor');
      expect(securityRepository.getActiveRole()).toBe('auditor');

      const logs = securityRepository.getAuditLogs();
      const lastLog = logs[0];
      expect(lastLog.action).toBe('ROLE_SWITCH_SIMULATION');
      expect(lastLog.actorRole).toBe('auditor');
      expect(lastLog.detailsSanitized).toContain('auditor');
    });
  });

  describe('Gestión de Integraciones & Rotación de Credenciales', () => {
    it('debe devolver la lista de integraciones fixture protegidas', () => {
      const integrations = securityRepository.getIntegrations();
      expect(integrations.length).toBe(4);

      const cloudflare = integrations.find((i) => i.id === 'int-cloudflare');
      expect(cloudflare).toBeDefined();
      expect(cloudflare?.status).toBe('connected');
      expect(cloudflare?.maskedSecretKey).toContain('••••');

      const lyberatedesk = integrations.find((i) => i.id === 'int-lyberatedesk');
      expect(lyberatedesk).toBeDefined();
      expect(lyberatedesk?.category).toBe('satellite');
    });

    it('debe permitir desconectar y reconectar una integración de forma segura', () => {
      const updated = securityRepository.toggleIntegrationStatus('int-whatsapp');
      expect(updated.status).toBe('disconnected');

      const reconnected = securityRepository.toggleIntegrationStatus('int-whatsapp');
      expect(reconnected.status).toBe('connected');

      const logs = securityRepository.getAuditLogs();
      expect(logs.some((l) => l.action === 'INTEGRATION_CONNECT')).toBe(true);
    });

    it('debe rotar inmediatamente la clave de API y generar nuevo hash enmascarado', () => {
      const originalKey = securityRepository.getIntegrations().find((i) => i.id === 'int-resend')?.maskedSecretKey;
      expect(originalKey).toBeDefined();

      const rotated = securityRepository.rotateIntegrationSecret('int-resend');
      expect(rotated.maskedSecretKey).not.toBe(originalKey);
      expect(rotated.maskedSecretKey).toContain('_rot_');

      const logs = securityRepository.getAuditLogs();
      const lastLog = logs[0];
      expect(lastLog.action).toBe('KEY_ROTATION');
      expect(lastLog.detailsSanitized).toContain('Resend');
    });
  });

  describe('Webhooks & Firmas Criptográficas HMAC', () => {
    it('debe simular entrega de webhook con firma HMAC SHA-256 válida y medir latencia', () => {
      const res = securityRepository.testWebhookDelivery('wh-deploy');
      expect(res.success).toBe(true);
      expect(res.statusCode).toBe(200);
      expect(res.durationMs).toBeGreaterThan(0);

      const wh = securityRepository.getWebhooks().find((w) => w.id === 'wh-deploy');
      expect(wh?.lastDeliveryStatus).toBe(200);
      expect(wh?.lastDeliveryAt).toBeDefined();

      const logs = securityRepository.getAuditLogs();
      const lastLog = logs[0];
      expect(lastLog.action).toBe('WEBHOOK_DELIVERY_TEST');
      expect(lastLog.detailsSanitized).toContain('HMAC SHA-256');
    });
  });

  describe('Auditoría Inmutable & Sanitizador de Secretos', () => {
    it('debe sanitizar automáticamente credenciales y tokens en los registros de auditoría', () => {
      const logged = securityRepository.logAuditEvent({
        action: 'TEST_SECRET_LEAK',
        module: 'security',
        actor: 'Valdez',
        actorRole: 'superadmin' as UserRole,
        status: 'allowed',
        detailsSanitized: 'Intento de auth con Bearer token_super_secreto_xyz y password=miClaveUltra1234',
      });

      expect(logged.detailsSanitized).not.toContain('token_super_secreto_xyz');
      expect(logged.detailsSanitized).not.toContain('miClaveUltra1234');
      expect(logged.detailsSanitized).toContain('Bearer [REDACTED]');
      expect(logged.detailsSanitized).toContain('password=[REDACTED]');
    });

    it('debe mantener un límite máximo de eventos para prevenir desbordamiento de memoria', () => {
      for (let i = 0; i < 60; i++) {
        securityRepository.logAuditEvent({
          action: `STRESS_TEST_${i}`,
          module: 'security',
          actor: 'Test Bot',
          actorRole: 'auditor' as UserRole,
          status: 'allowed',
          detailsSanitized: `Stress test event #${i}`,
        });
      }

      const logs = securityRepository.getAuditLogs();
      expect(logs.length).toBeLessThanOrEqual(50);
    });
  });
});

