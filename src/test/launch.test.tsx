import { describe, it, expect, beforeEach } from 'vitest';
import { launchRepository } from '../repositories/launchRepository';

describe('Lanzamiento, Rendimiento, SEO & Auditoría Final (Fase 09)', () => {
  beforeEach(() => {
    launchRepository.resetToDefault();
  });

  describe('Pre-Flight Launch Checklist', () => {
    it('debe contener los 10 puntos de control críticos para go-live', () => {
      const checklist = launchRepository.getChecklist();
      expect(checklist.length).toBe(10);

      const passed = checklist.filter((c) => c.status === 'passed');
      expect(passed.length).toBe(10);

      const categories = checklist.map((c) => c.category);
      expect(categories).toContain('security');
      expect(categories).toContain('performance');
      expect(categories).toContain('seo');
      expect(categories).toContain('infrastructure');
      expect(categories).toContain('accessibility');
    });

    it('los puntos críticos de seguridad, enrutamiento y respaldo deben estar verificados', () => {
      const checklist = launchRepository.getChecklist();

      const csp = checklist.find((c) => c.id === 'chk-csp');
      expect(csp?.status).toBe('passed');
      expect(csp?.impact).toBe('critical');

      const spa = checklist.find((c) => c.id === 'chk-spa-redirects');
      expect(spa?.status).toBe('passed');
      expect(spa?.verificationDetail).toContain('public/_redirects');

      const backup = checklist.find((c) => c.id === 'chk-backup');
      expect(backup?.status).toBe('passed');
    });
  });

  describe('Telemetría Core Web Vitals & Auditoría Lighthouse', () => {
    it('debe devolver métricas iniciales que superen los umbrales de Google', () => {
      const metrics = launchRepository.getMetrics();
      expect(metrics.lighthouseScore).toBeGreaterThanOrEqual(95);
      expect(metrics.ttfbMs).toBeLessThanOrEqual(200);
      expect(metrics.lcpMs).toBeLessThanOrEqual(2500);
      expect(metrics.clsScore).toBeLessThanOrEqual(0.1);
      expect(metrics.inpMs).toBeLessThanOrEqual(200);
    });

    it('debe re-ejecutar auditoría en vivo y registrar evento en auditoría', () => {
      const updated = launchRepository.runPerformanceAudit();
      expect(updated.lighthouseScore).toBeGreaterThanOrEqual(95);
      expect(updated.lastMeasuredAt).toBeDefined();

      const stored = launchRepository.getMetrics();
      expect(stored.lcpMs).toBe(updated.lcpMs);
    });
  });

  describe('Metadatos Sociales & OpenGraph', () => {
    it('debe contener la configuración predeterminada de social preview', () => {
      const social = launchRepository.getSocialPreview();
      expect(social.title).toContain('Lyberate');
      expect(social.url).toBe('https://lyberate.com');
      expect(social.siteName).toBe('Lyberate');
      expect(social.imageUrl).toBeDefined();
    });

    it('debe permitir actualizar metadatos para optimizar compartición en WhatsApp y LinkedIn', () => {
      const updated = launchRepository.updateSocialPreview({
        title: 'Lyberate — Ingeniería de Software Full-Stack',
        description: 'Construimos sistemas a medida para empresas líderes.',
      });

      expect(updated.title).toBe('Lyberate — Ingeniería de Software Full-Stack');
      expect(updated.description).toBe('Construimos sistemas a medida para empresas líderes.');
      expect(launchRepository.getSocialPreview().title).toBe('Lyberate — Ingeniería de Software Full-Stack');
    });
  });

  describe('Copias de Seguridad & Restauración (Disaster Recovery)', () => {
    it('debe generar una instantánea completa del sistema con checksum y contadores', () => {
      const backup = launchRepository.generateSystemBackup();
      expect(backup.version).toBe('1.0.0-lyberate-prod');
      expect(backup.timestamp).toBeDefined();
      expect(backup.checksum).toContain('sha256_');
      expect(backup.data.sitesCount).toBe(5);
      expect(backup.data.clientsCount).toBeGreaterThan(0);
      expect(backup.data.invoicesCount).toBeGreaterThan(0);
      expect(backup.data.rawSnapshot).toBeDefined();
    });

    it('debe restaurar una copia de seguridad válida y rechazar archivos corruptos', () => {
      const backup = launchRepository.generateSystemBackup();
      const restoreResult = launchRepository.restoreSystemBackup(backup);
      expect(restoreResult.success).toBe(true);

      const invalidBackup: any = { version: '', data: null };
      const failedResult = launchRepository.restoreSystemBackup(invalidBackup);
      expect(failedResult.success).toBe(false);
    });
  });

  describe('Infraestructura de Despliegue Cloudflare & Accesibilidad WCAG (Fase 09)', () => {
    it('el checklist de prelanzamiento certifica todos los puntos de infraestructura y seguridad', () => {
      const checklist = launchRepository.getChecklist();
      const criticalItems = checklist.filter((c) => c.impact === 'critical');
      expect(criticalItems.length).toBeGreaterThanOrEqual(4);
      criticalItems.forEach((item) => {
        expect(item.status).toBe('passed');
        expect(item.verificationDetail.length).toBeGreaterThan(10);
      });
    });

    it('las directivas de accesibilidad, SEO y rollback están verificadas para producción', () => {
      const checklist = launchRepository.getChecklist();
      const a11y = checklist.find((c) => c.category === 'accessibility');
      expect(a11y).toBeDefined();
      expect(a11y?.status).toBe('passed');

      const seo = checklist.filter((c) => c.category === 'seo');
      expect(seo.length).toBeGreaterThanOrEqual(2);
      seo.forEach((s) => expect(s.status).toBe('passed'));
    });
  });
});

