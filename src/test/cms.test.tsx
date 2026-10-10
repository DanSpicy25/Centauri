import { describe, it, expect, beforeEach } from 'vitest';
import { cmsRepository } from '../repositories/cmsRepository';
import { projectRepository } from '../repositories/projectRepository';

describe('CMS Editorial Engine & Version Control (Phase 04)', () => {
  beforeEach(() => {
    // Reset to factory defaults before each test
    cmsRepository.resetAllToFactory();
    projectRepository.resetToDefault();
  });

  it('debe inicializar las 6 páginas con configuración base y versión v1.0.0', () => {
    const allPages = cmsRepository.getAllPages();
    expect(allPages.length).toBe(6);

    const home = cmsRepository.getPageContent('home');
    expect(home.pageId).toBe('home');
    expect(home.currentVersionId).toBe('v1.0.0');
    expect(home.hero?.headline).toBeDefined();
    expect(home.sectionsConfig.length).toBeGreaterThan(0);
    expect(home.seo.robotsIndex).toBe(true);
  });

  it('debe guardar borradores sin incrementar la versión formal', () => {
    const draftUpdate = {
      hero: {
        eyebrow: 'Borrador de Prueba',
        headline: 'Nuevo Titular en Borrador',
        description: 'Descripción de prueba.',
        primaryCtaText: 'Contacto',
        primaryCtaLink: '/contacto',
        secondaryCtaText: 'Ver Trabajos',
        secondaryCtaLink: '/trabajos',
        badges: ['React 19', 'TypeScript'],
      },
    };

    const saved = cmsRepository.savePageDraft('home', draftUpdate, 'Valdez');
    expect(saved.currentVersionId).toBe('v1.0.0'); // La versión no cambia al ser borrador
    expect(saved.lastModifiedBy).toBe('Valdez');
    expect(saved.hero?.headline).toBe('Nuevo Titular en Borrador');

    // Verificar en log de auditoría
    const audit = cmsRepository.getAuditLog();
    expect(audit.length).toBeGreaterThan(0);
    expect(audit[0].action).toBe('save_draft');
    expect(audit[0].author).toBe('Valdez');
  });

  it('debe publicar una nueva versión generando un snapshot inmutable', () => {
    // Guardar cambio
    cmsRepository.savePageDraft('home', {
      ctaHeadline: '¿Listo para colaborar?',
    }, 'Socio Fundador');

    // Publicar
    const snapshot = cmsRepository.publishPage(
      'home',
      'Valdez (Socio Fundador)',
      'Actualización aprobada para el portafolio'
    );

    expect(snapshot.versionId).toBe('v1.2.0');
    expect(snapshot.status).toBe('published');
    expect(snapshot.changeLog).toBe('Actualización aprobada para el portafolio');

    // Verificar que la página ahora refleja v1.2.0
    const currentHome = cmsRepository.getPageContent('home');
    expect(currentHome.currentVersionId).toBe('v1.2.0');
    expect(currentHome.ctaHeadline).toBe('¿Listo para colaborar?');

    // Historial debe tener 2 versiones
    const versions = cmsRepository.getPageVersions('home');
    expect(versions.length).toBe(2);
    expect(versions[0].versionId).toBe('v1.2.0');
    expect(versions[1].versionId).toBe('v1.0.0');
    expect(versions[1].status).toBe('archived');
  });

  it('debe realizar rollback a una versión anterior con restauración exacta', () => {
    // 1. Guardar y publicar v1.2.0
    cmsRepository.savePageDraft('home', {
      hero: {
        eyebrow: 'Version 2',
        headline: 'Titular Versión 2',
        description: 'Desc v2',
        primaryCtaText: 'CTA',
        primaryCtaLink: '/contacto',
        secondaryCtaText: 'CTA2',
        secondaryCtaLink: '/trabajos',
        badges: [],
      },
    });
    cmsRepository.publishPage('home', 'Admin', 'Segunda versión');

    const v2Content = cmsRepository.getPageContent('home');
    expect(v2Content.currentVersionId).toBe('v1.2.0');
    expect(v2Content.hero?.headline).toBe('Titular Versión 2');

    // 2. Ejecutar Rollback a v1.0.0
    const restored = cmsRepository.rollbackPage('home', 'v1.0.0', 'Valdez');
    expect(restored.currentVersionId).toBe('v1.0.0');
    expect(restored.hero?.headline).toBe(
      'Software con criterio, arquitectura sólida y presencia memorable.'
    );

    // Auditoría debe registrar el evento de rollback
    const audit = cmsRepository.getAuditLog();
    const rollbackEvent = audit.find((a) => a.action === 'rollback');
    expect(rollbackEvent).toBeDefined();
    expect(rollbackEvent?.author).toBe('Valdez');
  });

  it('debe impedir publicación de proyectos en el portafolio sin atribución aprobada', () => {
    const draft = projectRepository.createProjectDraft({
      name: 'Proyecto Confidencial',
      attributionApproved: false,
    });

    // Intentar publicar sin aprobación explícita debe lanzar error
    expect(() => {
      projectRepository.updateProject(draft.id, {
        editorialState: 'published',
      });
    }).toThrow('No es posible publicar un proyecto sin aprobación explícita de atribución.');

    // Con aprobación explícita debe permitir la publicación
    const published = projectRepository.updateProject(draft.id, {
      attributionApproved: true,
      editorialState: 'published',
    });
    expect(published.published).toBe(true);
    expect(published.editorialState).toBe('published');
  });

  it('debe permitir eliminar proyectos y reflejarlo en el repositorio', () => {
    const draft = projectRepository.createProjectDraft({
      name: 'Proyecto Temporal',
    });

    expect(projectRepository.getProjectById(draft.id)).toBeDefined();

    const deleted = projectRepository.deleteProject(draft.id);
    expect(deleted).toBe(true);
    expect(projectRepository.getProjectById(draft.id)).toBeUndefined();
  });
});

