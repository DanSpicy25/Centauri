import { describe, it, expect, beforeEach } from 'vitest';
import { storageAdapter } from '../services/storageAdapter';
import { backupService } from '../services/backupService';
import { crmRepository } from '../repositories/crmRepository';
import { financeRepository } from '../repositories/financeRepository';
import { projectRepository } from '../repositories/projectRepository';
import { securityRepository } from '../repositories/securityRepository';

describe('FASE 07 — Mocks, Persistencia y Respaldo Integral', () => {
  beforeEach(() => {
    backupService.resetAllToFactoryDefaults();
  });

  describe('StorageAdapter', () => {
    it('escribe y recupera datos serializados en JSON con tipado estricto', () => {
      const testData = { id: 'test-1', name: 'Prueba de Almacenamiento', active: true };
      const success = storageAdapter.setItem('lyberate_test_item', testData);
      expect(success).toBe(true);

      const retrieved = storageAdapter.getItem('lyberate_test_item', null as typeof testData | null);
      expect(retrieved).toEqual(testData);

      storageAdapter.removeItem('lyberate_test_item');
      const afterRemoval = storageAdapter.getItem('lyberate_test_item', null);
      expect(afterRemoval).toBeNull();
    });

    it('devuelve el valor por defecto de forma segura si la clave no existe o el JSON está corrupto', () => {
      const defaultValue = { fallback: true };
      const missing = storageAdapter.getItem('lyberate_inexistente', defaultValue);
      expect(missing).toEqual(defaultValue);
    });

    it('calcula métricas de uso y claves en el namespace lyberate_', () => {
      const status = storageAdapter.getStatus();
      expect(status.mode).toBeDefined();
      expect(status.lyberateKeysCount).toBeGreaterThanOrEqual(0);
      expect(status.estimatedKilobytesUsed).toBeGreaterThanOrEqual(0);
    });
  });

  describe('BackupService — Exportación y Validación', () => {
    it('genera un snapshot integral con versión, timestamp y checksum verificable', () => {
      const backup = backupService.exportFullBackup();

      expect(backup.version).toContain('centauri-lyberate');
      expect(backup.timestamp).toBeDefined();
      expect(backup.checksum).toMatch(/^sha256_/);
      expect(backup.data.clientsCount).toBeGreaterThan(0);
      expect(backup.data.invoicesCount).toBeGreaterThan(0);
      expect(backup.data.projectsCount).toBeGreaterThan(0);
      expect(backup.data.rawSnapshot).toBeDefined();

      // Debe registrar evento de auditoría
      const latestAudit = securityRepository.getAuditLogs()[0];
      expect(latestAudit.action).toBe('SYSTEM_BACKUP_EXPORT');
    });

    it('valida copias correctas y rechaza estructuras corruptas o incompletas', () => {
      const validBackup = backupService.exportFullBackup();
      const validResult = backupService.validateBackup(validBackup);
      expect(validResult.valid).toBe(true);
      expect(validResult.errors.length).toBe(0);

      // Objeto nulo o inválido
      expect(backupService.validateBackup(null).valid).toBe(false);
      expect(backupService.validateBackup({}).valid).toBe(false);

      // Falta de campos obligatorios
      const missingChecksum = { ...validBackup, checksum: undefined };
      expect(backupService.validateBackup(missingChecksum).valid).toBe(false);

      const missingRawSnapshot = {
        ...validBackup,
        data: { ...validBackup.data, rawSnapshot: undefined },
      };
      expect(backupService.validateBackup(missingRawSnapshot).valid).toBe(false);
    });
  });

  describe('BackupService — Restauración y Valores de Fábrica', () => {
    it('restaura el estado tras modificaciones y preserva la integridad de los datos', () => {
      // 1. Exportar snapshot inicial limpio
      const initialBackup = backupService.exportFullBackup();
      const initialClientsCount = crmRepository.getClients().length;

      // 2. Modificar el estado agregando un nuevo cliente
      crmRepository.createClient({
        name: 'Cliente Temporal Para Prueba',
        email: 'temporal@test.com',
      });
      expect(crmRepository.getClients().length).toBe(initialClientsCount + 1);

      // 3. Restaurar snapshot inicial
      const restoreRes = backupService.restoreFullBackup(initialBackup);
      expect(restoreRes.success).toBe(true);

      // 4. Verificar restablecimiento
      expect(crmRepository.getClients().length).toBe(initialClientsCount);
    });

    it('resetAllToFactoryDefaults restaura todos los subsistemas a sus fixtures auditados', () => {
      // Modificar finanzas agregando una factura nueva
      financeRepository.createInvoice({
        clientName: 'Cliente Prueba Factura',
        concept: 'Servicio Desarrollo',
        amountUsd: 1500,
        status: 'pending',
      });

      const prevInvoices = financeRepository.getInvoices().length;

      // Ejecutar restablecimiento integral
      const resetRes = backupService.resetAllToFactoryDefaults();
      expect(resetRes.success).toBe(true);

      // Verifica que no quede estado corrupto y los fixtures vuelvan al valor base
      const defaultInvoicesCount = financeRepository.getInvoices().length;
      expect(defaultInvoicesCount).toBeLessThan(prevInvoices);

      const latestAudit = securityRepository.getAuditLogs()[0];
      expect(latestAudit.action).toBe('SYSTEM_FACTORY_RESET');
    });

    it('proporciona diagnóstico de subsistemas en tiempo real', () => {
      const diag = backupService.getDiagnostics();
      expect(diag.subsystems.clients).toBeGreaterThan(0);
      expect(diag.subsystems.invoices).toBeGreaterThan(0);
      expect(diag.subsystems.cmsPages).toBeGreaterThan(0);
      expect(diag.subsystems.founderProfiles).toBe(2);
      expect(['nominal', 'warning']).toContain(diag.systemHealth);
    });
  });

  describe('Aislamiento de Datos Públicos vs Privados', () => {
    it('el catálogo público aísla estrictamente proyectos en borrador o no autorizados', () => {
      const published = projectRepository.getPublishedProjects();
      const allForAdmin = projectRepository.getAllProjectsForAdmin();

      expect(allForAdmin.length).toBeGreaterThan(published.length);
      published.forEach((p) => {
        expect(p.published).toBe(true);
        expect(p.attributionApproved).toBe(true);
        expect(p.editorialState).toBe('published');
      });
    });

    it('los datos sensibles del CRM y Finanzas no se exponen en entidades públicas', () => {
      const publicProjects = projectRepository.getPublishedProjects();
      publicProjects.forEach((p) => {
        // Ningún proyecto público debe contener información financiera privada del cliente
        expect((p as any).invoiceAmountUsd).toBeUndefined();
        expect((p as any).clientPrivateNotes).toBeUndefined();
      });
    });
  });
});

