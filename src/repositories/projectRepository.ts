import { ProjectDTO, ProjectRelationship } from '../types';
import { FIXTURE_PROJECTS } from '../data/fixtures';

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
            this.projects = parsed;
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
          p.category.toLowerCase().includes(term) ||
          p.verifiedTechnologies.some((t) => t.toLowerCase().includes(term))
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

