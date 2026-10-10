import { describe, it, expect } from 'vitest';
import { projectRepository } from '../repositories/projectRepository';
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

  it('debe soportar filtrado multi-criterio y búsqueda por tecnología', () => {
    // Búsqueda por tecnología 'TypeScript'
    const tsProjects = projectRepository.filterProjects({ searchTerm: 'TypeScript' });
    expect(tsProjects.length).toBeGreaterThanOrEqual(2);

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

