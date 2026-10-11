import { describe, it, expect, vi } from 'vitest';
import { ProjectRepository, projectRepository } from '../repositories/projectRepository';
import { WorksPage } from '../pages/public/WorksPage';
import { ProjectDetailPage } from '../pages/public/ProjectDetailPage';

describe('FASE 03 — Portafolio, Carrusel y Casos de Estudio', () => {
  it('debe aislar estrictamente los borradores y proyectos no aprobados del catálogo público', () => {
    const published = projectRepository.getPublishedProjects();
    const all = projectRepository.getAllProjectsForAdmin();

    expect(all.length).toBeGreaterThan(published.length);
    published.forEach((p) => {
      expect(p.published).toBe(true);
      expect(p.attributionApproved).toBe(true);
      expect(p.editorialState).toBe('published');
    });

    const draft = all.find((p) => p.slug === 'wilanye-gestion');
    expect(draft).toBeDefined();
    expect(draft?.editorialState).toBe('draft');
    expect(draft?.attributionApproved).toBe(false);
    expect(draft?.published).toBe(false);
  });

  it('actualiza textos públicos de muestra obsoletos guardados y mantiene los datos editados', () => {
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
    const sagitta = projectRepository.getProjectById('proj-01')!;
    storedValues.set(
      'lyberate_cms_projects',
      JSON.stringify([
        {
          ...sagitta,
          name: 'Nombre personalizado',
          tagline: 'Plataforma componible para gestión operativa y comercial multi-vertical',
          summary: 'Sistema empresarial modular con punto de venta (POS), control de inventario, recetas BOM, CRM dinámico y motor de marca blanca con terminología adaptable.',
          thumbnailCredit: 'Captura autorizada de la suite de software propio',
          gallery: [
            {
              ...sagitta.gallery![0],
              alt: 'Módulo de control de inventario y recetas BOM de Sagitta',
              caption: 'Control de inventario en tiempo real con alertas de stock mínimo.',
            },
          ],
        },
      ])
    );

    try {
      const migratedRepository = new ProjectRepository();
      const migratedSagitta = migratedRepository.getProjectById('proj-01');
      expect(migratedSagitta?.tagline).toBe('Ventas, inventario y operación diaria en un solo lugar');
      expect(migratedSagitta?.summary).toContain('herramienta de gestión');
      expect(migratedSagitta?.thumbnailCredit).toBe('Proyecto propio de Lyberate');
      expect(migratedSagitta?.name).toBe('Nombre personalizado');
      expect(migratedSagitta?.gallery?.[0].caption).toBe(
        'Avisos de existencias para ayudar a mantener el inventario al día.'
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('el carrusel de Inicio solo debe recibir proyectos aprobados con flag isFeatured', () => {
    const featured = projectRepository.getFeaturedProjects();
    expect(featured.length).toBeGreaterThanOrEqual(2);
    featured.forEach((p) => {
      expect(p.isFeaturedInHomeCarousel).toBe(true);
      expect(p.published).toBe(true);
      expect(p.attributionApproved).toBe(true);
    });
  });

  it('debe separar estrictamente el alcance total del proyecto de la contribución de Lyberate', () => {
    const motoindy = projectRepository.getProjectBySlug('motoindy');
    expect(motoindy).toBeDefined();
    expect(motoindy?.lyberateContribution).toBeDefined();
    expect(motoindy?.fullScope).toBeDefined();
    expect(motoindy?.lyberateContribution).not.toEqual(motoindy?.fullScope);
  });

  it('los proyectos sin métricas comerciales deben ser válidos y presentables sin datos ficticios', () => {
    const orgemac = projectRepository.getProjectBySlug('orgemac');
    expect(orgemac).toBeDefined();
    expect(orgemac?.metrics).toBeUndefined();
    expect(orgemac?.summary.length).toBeGreaterThan(10);
    expect(orgemac?.lyberateContribution).toBeDefined();
  });

  it('debe soportar filtrado multi-criterio y búsqueda en lenguaje de negocio', () => {
    const inventoryProjects = projectRepository.filterProjects({ searchTerm: 'inventario' });
    expect(inventoryProjects.length).toBeGreaterThanOrEqual(1);

    // Filtro por relación 'own'
    const ownProjects = projectRepository.filterProjects({ relationship: 'own' });
    expect(ownProjects.length).toBeGreaterThanOrEqual(2);
    ownProjects.forEach((p) => expect(p.relationship).toBe('own'));

    // Filtro por relación 'client'
    const clientProjects = projectRepository.filterProjects({ relationship: 'client' });
    expect(clientProjects.length).toBeGreaterThanOrEqual(1);
    clientProjects.forEach((p) => expect(p.relationship).toBe('client'));
  });

  it('la navegación adyacente entre casos de estudio debe ser coherente', () => {
    const { next } = projectRepository.getAdjacentProjects('sagitta');
    expect(next).toBeDefined();
    expect(next?.slug).toBe('contacto-con-la-noticia');
  });

  it('la creación de borradores siempre debe forzar estados no publicados', () => {
    const draft = projectRepository.createProjectDraft({
      name: 'Proyecto Ingestado',
      slug: 'proyecto-ingestado',
    });

    expect(draft.editorialState).toBe('draft');
    expect(draft.published).toBe(false);
    expect(draft.attributionApproved).toBe(false);

    // Debe seguir sin aparecer en el catálogo público
    const inPublic = projectRepository.getProjectBySlug('proyecto-ingestado');
    expect(inPublic).toBeUndefined();
  });

  it('incluye LyberateDesk en el catálogo público con galería de capturas y atribución propia', () => {
    const desk = projectRepository.getProjectBySlug('lyberatedesk');
    expect(desk).toBeDefined();
    expect(desk?.relationship).toBe('own');
    expect(desk?.published).toBe(true);
    expect(desk?.gallery?.length).toBeGreaterThanOrEqual(1);
    expect(desk?.verifiedTechnologies).toContain('React 19');
  });

  it('WorksPage y ProjectDetailPage se exportan como componentes modulares', () => {
    expect(WorksPage).toBeDefined();
    expect(ProjectDetailPage).toBeDefined();
  });
});
