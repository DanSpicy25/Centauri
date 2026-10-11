import {
  CmsPageId,
  PageContentConfig,
  PageVersionSnapshot,
  CmsAuditEvent,
} from '../types/cms';

const DEFAULT_PAGE_CONFIGS: Record<CmsPageId, PageContentConfig> = {
  home: {
    pageId: 'home',
    pageName: 'Inicio (Landing Page)',
    lastModified: '2026-10-10T08:00:00Z',
    lastModifiedBy: 'Equipo de Arquitectura',
    currentVersionId: 'v1.0.0',
    seo: {
      metaTitle: 'Lyberate — Soluciones digitales para tu negocio',
      metaDescription: 'Lyberate crea sitios y herramientas digitales a medida para ayudar a los negocios a organizarse, atender mejor y crecer.',
      canonicalUrl: 'https://lyberate.com/',
      robotsIndex: true,
    },
    sectionsConfig: [
      { id: 'hero', name: 'Hero & Propuesta de Valor', isVisible: true, order: 1 },
      { id: 'carousel', name: 'Vitrina de Proyectos en Carrusel', isVisible: true, order: 2 },
      { id: 'services', name: 'Qué Construimos (Servicios Resumidos)', isVisible: true, order: 3 },
      { id: 'products', name: 'Productos Propios Destacados', isVisible: true, order: 4 },
      { id: 'process', name: 'Metodología en 4 Pasos', isVisible: true, order: 5 },
      { id: 'cta', name: 'Llamada a la Acción Final', isVisible: true, order: 6 },
    ],
    hero: {
      eyebrow: 'Soluciones digitales hechas para personas y negocios',
      headline: 'Tu negocio merece herramientas que trabajen contigo.',
      description: 'Organiza mejor el trabajo, atiende a tus clientes con más calma y guarda tiempo para crecer.',
      primaryCtaText: 'Conversar sobre tu proyecto',
      primaryCtaLink: '/contacto',
      secondaryCtaText: 'Explorar trabajos y casos',
      secondaryCtaLink: '/trabajos',
      badges: ['Acompañamiento directo', 'Diseño pensado para personas', 'Soluciones a medida'],
    },
    processSteps: [
    { step: '01', title: 'Te escuchamos', description: 'Entendemos tus objetivos, tus dificultades y cómo trabaja tu equipo.' },
    { step: '02', title: 'Trazamos el camino', description: 'Acordamos prioridades, alcance y próximos pasos antes de comenzar.' },
    { step: '03', title: 'Lo construimos contigo', description: 'Compartimos avances para que puedas revisar y opinar durante el proceso.' },
    { step: '04', title: 'Te acompañamos', description: 'Te ayudamos a poner en marcha la solución y resolver tus dudas.' },
    ],
    ctaHeadline: '¿Tienes un proyecto en mente?',
    ctaDescription: 'Hablemos con honestidad sobre lo que necesitas, las opciones disponibles y los próximos pasos.',
    ctaButtonText: 'Iniciar conversación',
  },
  about: {
    pageId: 'about',
    pageName: 'Sobre nosotros',
    lastModified: '2026-10-10T08:00:00Z',
    lastModifiedBy: 'Equipo de Arquitectura',
    currentVersionId: 'v1.0.0',
    seo: {
      metaTitle: 'Sobre Lyberate — Filosofía, Equipo y Principios',
      metaDescription: 'Conoce al equipo de Lyberate y nuestra forma de acompañar a cada negocio.',
      canonicalUrl: 'https://lyberate.com/sobre-nosotros',
      robotsIndex: true,
    },
    sectionsConfig: [
      { id: 'story', name: 'Historia & Propósito', isVisible: true, order: 1 },
      { id: 'team', name: 'Equipo & Aro de Marca', isVisible: true, order: 2 },
      { id: 'principles', name: 'Principios No Negociables', isVisible: true, order: 3 },
      { id: 'faq', name: 'Preguntas Frecuentes', isVisible: true, order: 4 },
    ],
    aboutStory: {
      eyebrow: 'Sobre Lyberate',
      title: 'Soluciones digitales que entienden tu negocio',
      leadParagraph: 'Somos un equipo que escucha primero y crea herramientas digitales pensando en las personas que las usan cada día.',
      bodyParagraphs: [
        'Cada negocio tiene una manera particular de trabajar. Por eso entendemos el problema contigo y proponemos una solución clara, con prioridades y próximos pasos acordados.',
        'Creamos sitios, herramientas de gestión y productos propios. Durante el proyecto tendrás comunicación directa con las personas que lo llevan adelante.',
      ],
    },
  },
  services: {
    pageId: 'services',
    pageName: 'Servicios',
    lastModified: '2026-10-10T08:00:00Z',
    lastModifiedBy: 'Equipo de Arquitectura',
    currentVersionId: 'v1.0.0',
    seo: {
      metaTitle: 'Servicios para tu negocio — Lyberate',
      metaDescription: 'Sitios web, herramientas de gestión e integraciones pensadas para las necesidades de tu negocio.',
      canonicalUrl: 'https://lyberate.com/servicios',
      robotsIndex: true,
    },
    sectionsConfig: [
      { id: 'services_list', name: 'Catálogo de Servicios', isVisible: true, order: 1 },
    ],
  },
  products: {
    pageId: 'products',
    pageName: 'Productos',
    lastModified: '2026-10-10T08:00:00Z',
    lastModifiedBy: 'Equipo de Arquitectura',
    currentVersionId: 'v1.0.0',
    seo: {
      metaTitle: 'Productos Propios & Gestionados — Lyberate',
      metaDescription: 'Conoce los productos y las herramientas digitales desarrolladas por Lyberate.',
      canonicalUrl: 'https://lyberate.com/productos',
      robotsIndex: true,
    },
    sectionsConfig: [
      { id: 'products_list', name: 'Catálogo de Productos', isVisible: true, order: 1 },
    ],
  },
  works: {
    pageId: 'works',
    pageName: 'Trabajos & Casos de Estudio',
    lastModified: '2026-10-10T08:00:00Z',
    lastModifiedBy: 'Equipo de Arquitectura',
    currentVersionId: 'v1.0.0',
    seo: {
      metaTitle: 'Portafolio & Trabajos Verificados — Lyberate',
      metaDescription: 'Conoce proyectos reales, las necesidades que resolvieron y el trabajo realizado por Lyberate.',
      canonicalUrl: 'https://lyberate.com/trabajos',
      robotsIndex: true,
    },
    sectionsConfig: [
      { id: 'catalog', name: 'Catálogo Filtrable', isVisible: true, order: 1 },
    ],
  },
  contact: {
    pageId: 'contact',
    pageName: 'Contacto',
    lastModified: '2026-10-10T08:00:00Z',
    lastModifiedBy: 'Equipo de Arquitectura',
    currentVersionId: 'v1.0.0',
    seo: {
      metaTitle: 'Contacto — Inicia una Conversación con Lyberate',
      metaDescription: 'Cuéntanos qué necesita tu negocio y conversemos sobre el siguiente paso.',
      canonicalUrl: 'https://lyberate.com/contacto',
      robotsIndex: true,
    },
    sectionsConfig: [
      { id: 'form', name: 'Formulario & Canales', isVisible: true, order: 1 },
    ],
  },
};

export class CmsRepository {
  private pages: Map<CmsPageId, PageContentConfig>;
  private versions: Map<CmsPageId, PageVersionSnapshot[]>;
  private auditLog: CmsAuditEvent[];

  constructor() {
    this.pages = new Map();
    this.versions = new Map();
    this.auditLog = [];
    this.loadState();
  }

  private loadState() {
    // Cargar páginas desde localStorage o inicializar con defaults
    const storedPages = this.getFromStorage('lyberate_cms_pages');
    if (storedPages) {
      try {
        const parsed = JSON.parse(storedPages);
        Object.keys(parsed).forEach((key) => {
          this.pages.set(key as CmsPageId, parsed[key]);
        });
        this.migrateLegacyPublicCopy();
      } catch {
        this.resetPagesToDefault();
      }
    } else {
      this.resetPagesToDefault();
    }

    // Cargar historial de versiones
    const storedVersions = this.getFromStorage('lyberate_cms_versions');
    if (storedVersions) {
      try {
        const parsed = JSON.parse(storedVersions);
        Object.keys(parsed).forEach((key) => {
          this.versions.set(key as CmsPageId, parsed[key]);
        });
      } catch {
        this.initDefaultVersions();
      }
    } else {
      this.initDefaultVersions();
    }

    // Cargar log de auditoría
    const storedAudit = this.getFromStorage('lyberate_cms_audit');
    if (storedAudit) {
      try {
        this.auditLog = JSON.parse(storedAudit);
      } catch {
        this.auditLog = [];
      }
    }
  }

  private resetPagesToDefault() {
    this.pages.clear();
    Object.keys(DEFAULT_PAGE_CONFIGS).forEach((key) => {
      this.pages.set(key as CmsPageId, JSON.parse(JSON.stringify(DEFAULT_PAGE_CONFIGS[key as CmsPageId])));
    });
    this.saveToStorage('lyberate_cms_pages', JSON.stringify(Object.fromEntries(this.pages)));
  }

  private migrateLegacyPublicCopy() {
    let changed = false;
    const home = this.pages.get('home');
    if (home?.hero?.headline === 'Tu negocio, con herramientas digitales que sí te hacen la vida más fácil.') {
      home.hero.headline = DEFAULT_PAGE_CONFIGS.home.hero?.headline ?? home.hero.headline;
      home.hero.description = DEFAULT_PAGE_CONFIGS.home.hero?.description ?? home.hero.description;
      changed = true;
    }
    if (home?.ctaDescription === 'Hablemos con honestidad sobre alcance, viabilidad técnica y soluciones prácticas.') {
      home.ctaDescription = DEFAULT_PAGE_CONFIGS.home.ctaDescription;
      changed = true;
    }

    const about = this.pages.get('about');
    if (about?.aboutStory?.title === 'Ingeniería de software con rigor técnico y diseño intencional') {
      about.aboutStory.title = DEFAULT_PAGE_CONFIGS.about.aboutStory?.title ?? about.aboutStory.title;
      changed = true;
    }

    if (changed) {
      this.saveToStorage('lyberate_cms_pages', JSON.stringify(Object.fromEntries(this.pages)));
    }
  }

  private initDefaultVersions() {
    this.versions.clear();
    this.pages.forEach((page, pageId) => {
      const v1: PageVersionSnapshot = {
        versionId: 'v1.0.0',
        pageId,
        versionName: 'Versión Inicial (Base)',
        createdAt: '2026-10-10T08:00:00Z',
        author: 'Valdez (Socio Fundador)',
        changeLog: 'Configuración base aprobada de la web de marca.',
        status: 'published',
        data: JSON.parse(JSON.stringify(page)),
      };
      this.versions.set(pageId, [v1]);
    });
    this.saveToStorage('lyberate_cms_versions', JSON.stringify(Object.fromEntries(this.versions)));
  }

  private getFromStorage(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private saveToStorage(key: string, val: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, val);
    }
  }

  /**
   * Obtiene la configuración activa de una página.
   */
  getPageContent(pageId: CmsPageId): PageContentConfig {
    return this.pages.get(pageId) || DEFAULT_PAGE_CONFIGS[pageId];
  }

  /**
   * Obtiene la lista de todas las páginas gestionadas por el CMS.
   */
  getAllPages(): PageContentConfig[] {
    return Array.from(this.pages.values());
  }

  /**
   * Guarda cambios en estado borrador para una página.
   */
  savePageDraft(pageId: CmsPageId, updates: Partial<PageContentConfig>, author = 'Socio Fundador'): PageContentConfig {
    const current = this.getPageContent(pageId);
    const updated: PageContentConfig = {
      ...current,
      ...updates,
      lastModified: new Date().toISOString(),
      lastModifiedBy: author,
    };

    this.pages.set(pageId, updated);
    this.saveToStorage('lyberate_cms_pages', JSON.stringify(Object.fromEntries(this.pages)));

    this.recordAudit({
      author,
      action: 'save_draft',
      target: `Página: ${pageId}`,
      details: `Modificación de secciones o SEO en borrador.`,
    });

    return updated;
  }

  /**
   * Publica formalmente la página generando un snapshot inmutable de versión.
   */
  publishPage(pageId: CmsPageId, author = 'Socio Fundador', changeLog = 'Actualización publicada'): PageVersionSnapshot {
    const current = this.getPageContent(pageId);
    const currentVersions = this.versions.get(pageId) || [];
    const nextVerNumber = currentVersions.length + 1;
    const newVersionId = `v1.${nextVerNumber}.0`;

    const publishedConfig: PageContentConfig = {
      ...current,
      currentVersionId: newVersionId,
      lastModified: new Date().toISOString(),
      lastModifiedBy: author,
    };

    this.pages.set(pageId, publishedConfig);

    // Marcar anteriores como archived y crear nueva como published
    const updatedVersions: PageVersionSnapshot[] = currentVersions.map((v) => ({ ...v, status: 'archived' as const }));
    const newSnapshot: PageVersionSnapshot = {
      versionId: newVersionId,
      pageId,
      versionName: `Versión ${newVersionId}`,
      createdAt: new Date().toISOString(),
      author,
      changeLog,
      status: 'published',
      data: JSON.parse(JSON.stringify(publishedConfig)),
    };

    updatedVersions.unshift(newSnapshot);
    this.versions.set(pageId, updatedVersions);

    // Persistir
    this.saveToStorage('lyberate_cms_pages', JSON.stringify(Object.fromEntries(this.pages)));
    this.saveToStorage('lyberate_cms_versions', JSON.stringify(Object.fromEntries(this.versions)));

    this.recordAudit({
      author,
      action: 'publish',
      target: `Página: ${pageId}`,
      details: `Publicada ${newVersionId}. Motivo: ${changeLog}`,
    });

    return newSnapshot;
  }

  /**
   * Restaura (Rollback) la página a una versión snapshot histórica previa.
   */
  rollbackPage(pageId: CmsPageId, versionId: string, author = 'Socio Fundador'): PageContentConfig {
    const currentVersions = this.versions.get(pageId) || [];
    const targetSnapshot = currentVersions.find((v) => v.versionId === versionId);

    if (!targetSnapshot) {
      throw new Error(`La versión ${versionId} no existe para la página ${pageId}.`);
    }

    const restoredConfig: PageContentConfig = {
      ...JSON.parse(JSON.stringify(targetSnapshot.data)),
      lastModified: new Date().toISOString(),
      lastModifiedBy: `${author} (Rollback a ${versionId})`,
      currentVersionId: versionId,
    };

    this.pages.set(pageId, restoredConfig);

    // Actualizar estados de snapshot
    const updatedVersions = currentVersions.map((v) => ({
      ...v,
      status: v.versionId === versionId ? ('published' as const) : ('archived' as const),
    }));
    this.versions.set(pageId, updatedVersions);

    this.saveToStorage('lyberate_cms_pages', JSON.stringify(Object.fromEntries(this.pages)));
    this.saveToStorage('lyberate_cms_versions', JSON.stringify(Object.fromEntries(this.versions)));

    this.recordAudit({
      author,
      action: 'rollback',
      target: `Página: ${pageId}`,
      details: `Restauración exitosa al snapshot ${versionId}.`,
    });

    return restoredConfig;
  }

  /**
   * Obtiene la lista completa de versiones históricas de una página.
   */
  getPageVersions(pageId: CmsPageId): PageVersionSnapshot[] {
    return this.versions.get(pageId) || [];
  }

  /**
   * Obtiene el registro de auditoría de eventos del CMS.
   */
  getAuditLog(): CmsAuditEvent[] {
    return [...this.auditLog];
  }

  private recordAudit(event: Omit<CmsAuditEvent, 'id' | 'timestamp'>) {
    const newEntry: CmsAuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };
    this.auditLog.unshift(newEntry);
    if (this.auditLog.length > 50) this.auditLog.pop();
    this.saveToStorage('lyberate_cms_audit', JSON.stringify(this.auditLog));
  }

  /**
   * Restablece todo el CMS a los valores predeterminados de fábrica.
   */
  resetAllToFactory(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('lyberate_cms_pages');
      localStorage.removeItem('lyberate_cms_versions');
      localStorage.removeItem('lyberate_cms_audit');
    }
    this.resetPagesToDefault();
    this.initDefaultVersions();
    this.auditLog = [];
  }
}

export const cmsRepository = new CmsRepository();
