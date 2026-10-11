import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CmsRepository, cmsRepository } from '../repositories/cmsRepository';
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

  it('actualiza el texto público anterior guardado sin modificar contenido personalizado', () => {
    const storedValues = new Map<string, string>();
    const memoryStorage = {
      getItem: (key: string) => storedValues.get(key) ?? null,
      setItem: (key: string, value: string) => storedValues.set(key, value),
      removeItem: (key: string) => storedValues.delete(key),
      clear: () => storedValues.clear(),
      key: (index: number) => [...storedValues.keys()][index] ?? null,
      get length() {
        return storedValues.size;
      },
    };
    vi.stubGlobal('window', { localStorage: memoryStorage });
    vi.stubGlobal('localStorage', memoryStorage);

    const pages = Object.fromEntries(cmsRepository.getAllPages().map((page) => [page.pageId, page]));
    pages.home.ctaDescription =
      'Hablemos con honestidad sobre alcance, viabilidad técnica y soluciones prácticas.';
    pages.about.aboutStory = {
      ...pages.about.aboutStory!,
      title: 'Ingeniería de software con rigor técnico y diseño intencional',
    };
    pages.contact.pageName = 'Mi página de contacto';
    localStorage.setItem('lyberate_cms_pages', JSON.stringify(pages));

    try {
      const migratedRepository = new CmsRepository();
      expect(migratedRepository.getPageContent('home').ctaDescription).toBe(
        'Hablemos con honestidad sobre lo que necesitas, las opciones disponibles y los próximos pasos.'
      );
      expect(migratedRepository.getPageContent('about').aboutStory?.title).toBe(
        'Soluciones digitales que entienden tu negocio'
      );
      expect(migratedRepository.getPageContent('contact').pageName).toBe('Mi página de contacto');
    } finally {
      vi.unstubAllGlobals();
    }
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
      'Tu negocio merece herramientas que trabajen contigo.'
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

  it('debe gestionar el catálogo de subservicios guiados con persistencia y filtrado', async () => {
    const { subserviceRepository } = await import('../repositories/subserviceRepository');
    subserviceRepository.resetToDefault();

    const all = subserviceRepository.getAll();
    expect(all.length).toBeGreaterThanOrEqual(4);

    const published = subserviceRepository.getPublished();
    expect(published.length).toBeGreaterThan(0);

    // Crear nuevo subservicio
    const created = subserviceRepository.createSubservice({
      parentServiceId: 'srv-01',
      parentServiceName: 'Sitios web y portales',
      name: 'Prueba Subservicio',
      slug: 'prueba-subservicio',
      tagline: 'Tagline de prueba',
      description: 'Descripción guiada',
      benefits: ['Beneficio 1'],
      deliverables: ['Entregable 1'],
      faqs: [{ question: '¿P?', answer: 'R' }],
      imageUrl: 'https://example.com/img.webp',
      imageAlt: 'Alt text',
      ctaText: 'Solicitar',
      ctaLink: '/contacto',
      displayOrder: 99,
      status: 'draft',
    });

    expect(created.id).toBeDefined();
    expect(subserviceRepository.getById(created.id)?.name).toBe('Prueba Subservicio');

    // Actualizar
    const updated = subserviceRepository.updateSubservice(created.id, {
      name: 'Prueba Subservicio Actualizado',
      status: 'published',
    });
    expect(updated.name).toBe('Prueba Subservicio Actualizado');
    expect(updated.status).toBe('published');

    // Eliminar
    const deleted = subserviceRepository.deleteSubservice(created.id);
    expect(deleted).toBe(true);
    expect(subserviceRepository.getById(created.id)).toBeUndefined();
  });

  it('debe validar la integridad del lote de 40 proyectos para importación masiva', async () => {
    const { SAMPLE_BATCH_40_PROJECTS } = await import('../data/sampleBatchProjects');
    expect(SAMPLE_BATCH_40_PROJECTS.length).toBe(40);

    const slugs = new Set<string>();
    SAMPLE_BATCH_40_PROJECTS.forEach((p) => {
      expect(p.name).toBeDefined();
      expect(p.slug).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.summary).toBeDefined();
      expect(p.thumbnailUrl).toBeDefined();
      // Asegurar que no hay slugs duplicados en la plantilla
      expect(slugs.has(p.slug)).toBe(false);
      slugs.add(p.slug);
    });
  });
});
