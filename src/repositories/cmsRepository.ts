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
      metaTitle: 'Lyberate — Software con criterio, arquitectura sólida y presencia memorable',
      metaDescription: 'Estudio de ingeniería y producto digital. Desarrollamos plataformas, sistemas de gestión y aplicaciones web con diseño editorial y código sólido.',
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
      eyebrow: 'Estudio de Ingeniería & Arquitectura de Software',
      headline: 'Software con criterio, arquitectura sólida y presencia memorable.',
      description: 'Construimos plataformas digitales, sistemas de gestión y productos web para organizaciones que valoran la claridad visual, el alto rendimiento y la independencia tecnológica.',
      primaryCtaText: 'Conversar sobre tu proyecto',
      primaryCtaLink: '/contacto',
      secondaryCtaText: 'Explorar trabajos y casos',
      secondaryCtaLink: '/trabajos',
      badges: ['React 19 + TypeScript', 'Accesibilidad WCAG universal', 'Arquitectura desacoplada'],
    },
    processSteps: [
      { step: '01', title: 'Auditoría & Alcance', description: 'Examinamos los requisitos reales, limitaciones y modelos de datos antes de escribir código.' },
      { step: '02', title: 'Arquitectura & Sistema', description: 'Diseñamos tokens, contratos tipados y bases de componentes accesibles.' },
      { step: '03', title: 'Construcción Modular', description: 'Desarrollamos por fases incrementales con pruebas verificables en cada entrega.' },
      { step: '04', title: 'Auditoría & Despliegue', description: 'Revisiones de seguridad, rendimiento y accesibilidad antes de la puesta en marcha.' },
    ],
    ctaHeadline: '¿Tienes un proyecto en mente?',
    ctaDescription: 'Hablemos con honestidad sobre alcance, viabilidad técnica y soluciones prácticas.',
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
      metaDescription: 'Conoce los principios no negociables de Lyberate: cero plantillas genéricas, código auditado y honestidad de atribución.',
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
      title: 'Ingeniería de software con rigor técnico y diseño intencional',
      leadParagraph: 'Lyberate nace con una convicción clara: las mejores herramientas digitales combinan una arquitectura de código indestructible con una experiencia de usuario cuidada hasta el último detalle.',
      bodyParagraphs: [
        'Rechazamos las plantillas genéricas, las soluciones sobrecargadas de dependencias frágiles y las falsas promesas tecnológicas. Cada sistema que diseñamos y construimos responde a necesidades operativas reales, respetando la propiedad intelectual, la accesibilidad universal y la privacidad.',
        'Trabajamos tanto en el desarrollo de productos propios de alta especialización como en proyectos a medida para clientes y organizaciones colaboradoras, siempre con transparencia sobre nuestro rol y aportes concretos.',
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
      metaTitle: 'Servicios de Software & Arquitectura — Lyberate',
      metaDescription: 'Desarrollo web editorial, plataformas de gestión comercial e integraciones de APIs con contratos tipados.',
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
      metaDescription: 'Plataformas como Sagitta y Lyberate CMS diseñadas para alto rendimiento y personalización por vertical.',
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
      metaDescription: 'Casos de estudio reales con tecnologías comprobadas en código fuente y resultados verificables.',
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
      metaDescription: 'Habla directamente con nuestros arquitectos de software sobre alcance, viabilidad y presupuesto.',
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
