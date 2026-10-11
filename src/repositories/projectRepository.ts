import { ProjectDTO, ProjectRelationship } from '../types';
import { FIXTURE_PROJECTS } from '../data/fixtures';

const LEGACY_PUBLIC_COPY: Record<string, {
  tagline?: string;
  summary?: string;
  category?: string;
  thumbnailCredit?: string;
  gallery?: Array<{ alt?: string; caption?: string }>;
}> = {
  'proj-01': {
    tagline: 'Plataforma componible para gestión operativa y comercial multi-vertical',
    summary: 'Sistema empresarial modular con punto de venta (POS), control de inventario, recetas BOM, CRM dinámico y motor de marca blanca con terminología adaptable.',
    thumbnailCredit: 'Captura autorizada de la suite de software propio',
    gallery: [
      {
        alt: 'Módulo de control de inventario y recetas BOM de Sagitta',
        caption: 'Control de inventario en tiempo real con alertas de stock mínimo.',
      },
      {
        alt: 'Vista de Punto de Venta (POS) en Sagitta',
        caption: 'Interfaz rápida de cobro y asignación de comisiones profesionales.',
      },
    ],
  },
  'proj-02': {
    tagline: 'Portal periodístico digital de alto rendimiento y sala de redacción editorial',
    summary: 'Plataforma CMS multi-tenant diseñada para publicación de noticias en tiempo real con capacidades PWA sin conexión, variantes multimedia optimizadas y distribución de contenidos.',
    gallery: [
      {},
      {
        alt: 'Soporte PWA sin conexión y caché de artículos',
        caption: 'Lectura offline garantizada mediante Service Workers dedicados.',
      },
    ],
  },
  'proj-03': {
    summary: 'Plataforma que integra pasajeros, conductores y administradores mediante aplicación móvil nativa unificada, panel web centralizado y API con WebSockets.',
  },
  'proj-05': {
    tagline: 'Centro SaaS unificado de atención y mensajería multicanal para ventas',
    summary: 'Plataforma para gestionar conversaciones de WhatsApp, Telegram y chat web en una sola bandeja de entrada, con respuestas automatizadas y control de agentes.',
    category: 'SaaS & Mensajería',
  },
};

export interface ProjectFilterCriteria {
  category?: string;
  relationship?: ProjectRelationship | 'todos';
  searchTerm?: string;
}

export class ProjectRepository {
  private projects: ProjectDTO[];

  constructor(initialData: ProjectDTO[] = FIXTURE_PROJECTS) {
    this.projects = [...initialData];
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('lyberate_cms_projects');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            let migrated = false;
            this.projects = parsed.map((project: ProjectDTO) => {
              const legacyCopy = LEGACY_PUBLIC_COPY[project.id];
              const currentFixture = FIXTURE_PROJECTS.find((fixture) => fixture.id === project.id);
              if (!legacyCopy || !currentFixture) return project;

              const updated = { ...project };
              (['tagline', 'summary', 'category', 'thumbnailCredit'] as const).forEach((field) => {
                if (project[field] === legacyCopy[field]) {
                  Object.assign(updated, { [field]: currentFixture[field] });
                  migrated = true;
                }
              });

              if (legacyCopy.gallery && updated.gallery && currentFixture.gallery) {
                updated.gallery = updated.gallery.map((item, index) => {
                  const legacyGalleryItem = legacyCopy.gallery?.[index];
                  const currentGalleryItem = currentFixture.gallery?.[index];
                  if (!legacyGalleryItem || !currentGalleryItem) return item;

                  const currentItem = { ...item };
                  (['alt', 'caption'] as const).forEach((field) => {
                    if (
                      item[field] === legacyGalleryItem[field] &&
                      currentGalleryItem[field] !== undefined
                    ) {
                      currentItem[field] = currentGalleryItem[field];
                      migrated = true;
                    }
                  });
                  return currentItem;
                });
              }
              return updated;
            });
            if (migrated) this.saveToStorage();
          }
        } catch {
          // Mantener inicial si falla parseo
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('lyberate_cms_projects', JSON.stringify(this.projects));
    }
  }

  /**
   * Obtiene exclusivamente los proyectos autorizados para publicación pública.
   * Aísla de forma estricta los borradores y proyectos pendientes de aprobación.
   */
  getPublishedProjects(): ProjectDTO[] {
    return this.projects.filter(
      (p) => p.published && p.attributionApproved && p.editorialState === 'published'
    );
  }

  /**
   * Obtiene los proyectos seleccionados para la vitrina del carrusel de Inicio.
   */
  getFeaturedProjects(): ProjectDTO[] {
    return this.getPublishedProjects().filter((p) => p.isFeaturedInHomeCarousel);
  }

  /**
   * Busca un proyecto publicado por su slug canónico.
   */
  getProjectBySlug(slug: string, allowDrafts = false): ProjectDTO | undefined {
    if (allowDrafts) {
      return this.projects.find((p) => p.slug === slug);
    }
    return this.getPublishedProjects().find((p) => p.slug === slug);
  }

  /**
   * Obtiene un proyecto por su ID único (para administración).
   */
  getProjectById(id: string): ProjectDTO | undefined {
    return this.projects.find((p) => p.id === id);
  }

  /**
   * Obtiene proyectos adyacentes (anterior y siguiente) para navegación contextual.
   */
  getAdjacentProjects(slug: string): { prev?: ProjectDTO; next?: ProjectDTO } {
    const published = this.getPublishedProjects();
    const index = published.findIndex((p) => p.slug === slug);

    if (index === -1) return {};

    const prev = index > 0 ? published[index - 1] : undefined;
    const next = index < published.length - 1 ? published[index + 1] : undefined;

    return { prev, next };
  }

  /**
   * Filtra el catálogo publicado por categoría, relación y término de búsqueda.
   */
  filterProjects(criteria: ProjectFilterCriteria): ProjectDTO[] {
    const { category, relationship, searchTerm } = criteria;
    let list = this.getPublishedProjects();

    if (category && category !== 'todos') {
      list = list.filter((p) => p.category === category);
    }

    if (relationship && relationship !== 'todos') {
      list = list.filter((p) => p.relationship === relationship);
    }

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.summary.toLowerCase().includes(term) ||
          p.tagline.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    return list;
  }

  /**
   * Uso exclusivo del panel administrativo: obtiene la totalidad de proyectos incluyendo borradores.
   */
  getAllProjectsForAdmin(): ProjectDTO[] {
    return [...this.projects];
  }

  /**
   * Regla de seguridad: La importación de metadatos o creación produce SIEMPRE un borrador no publicado.
   */
  createProjectDraft(draft: Partial<ProjectDTO>): ProjectDTO {
    const newProject: ProjectDTO = {
      id: `proj-draft-${Date.now()}`,
      slug: draft.slug || `borrador-${Date.now()}`,
      name: draft.name || 'Nuevo Borrador',
      tagline: draft.tagline || '',
      summary: draft.summary || '',
      category: draft.category || 'Sin categoría',
      relationship: draft.relationship || 'unknown',
      status: 'pending',
      editorialState: 'draft', // Siempre borrador
      published: false, // Nunca publicado automáticamente
      attributionApproved: false, // Siempre requiere aprobación humana explícita
      lyberateContribution: draft.lyberateContribution || 'Por definir tras auditoría',
      verifiedTechnologies: draft.verifiedTechnologies || [],
      thumbnailUrl: draft.thumbnailUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      thumbnailAlt: draft.thumbnailAlt || 'Placeholder de borrador',
      isFeaturedInHomeCarousel: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.push(newProject);
    this.saveToStorage();
    return newProject;
  }

  /**
   * Actualiza los datos de un proyecto y persiste los cambios.
   */
  updateProject(id: string, updates: Partial<ProjectDTO>): ProjectDTO {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Proyecto con ID ${id} no encontrado.`);
    }

    const current = this.projects[index];
    const updated: ProjectDTO = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Si se publica, exigir aprobación explícita de atribución
    if (updated.editorialState === 'published' && !updated.attributionApproved) {
      throw new Error('No es posible publicar un proyecto sin aprobación explícita de atribución.');
    }

    // Sincronizar flag published con editorialState
    updated.published = updated.editorialState === 'published';

    this.projects[index] = updated;
    this.saveToStorage();
    return updated;
  }

  /**
   * Elimina un proyecto del catálogo.
   */
  deleteProject(id: string): boolean {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.projects.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  /**
   * Restablece el catálogo a los datos predeterminados.
   */
  resetToDefault(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('lyberate_cms_projects');
    }
    this.projects = [...FIXTURE_PROJECTS];
  }
}

// Instancia singleton del repositorio para la aplicación
export const projectRepository = new ProjectRepository();
