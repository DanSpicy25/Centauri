export interface SubserviceDTO {
  id: string;
  parentServiceId: string;
  parentServiceName: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  benefits: string[];
  deliverables: string[];
  faqs: Array<{ question: string; answer: string }>;
  imageUrl: string;
  imageAlt: string;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

const INITIAL_SUBSERVICES: SubserviceDTO[] = [
  {
    id: 'sub-01',
    parentServiceId: 'srv-01',
    parentServiceName: 'Sitios web y portales',
    name: 'Sitios Web Corporativos & Portafolios Editoriales',
    slug: 'sitios-corporativos',
    tagline: 'Presencia digital sobria, rápida y adaptada al lenguaje de tu negocio',
    description: 'Diseñamos y programamos sitios web que comunican el valor real de tu empresa sin rodeos ni jerga técnica. Optimizados para pantallas móviles y diseñados con tipografía editorial distintiva.',
    benefits: [
      'Carga instantánea sin elementos pesados innecesarios',
      'Identidad visual respetuosa de la marca y memorable para el cliente',
      'Estructura guiada para transformar visitantes en conversaciones comerciales',
      'Cumplimiento de estándares modernos de accesibilidad (WCAG)',
    ],
    deliverables: [
      'Estructura de arquitectura de información y jerarquía de contenidos',
      'Diseño visual adaptable a móviles, tabletas y monitores de alta resolución',
      'Formulario de contacto protegido contra envíos repetidos y spam',
      'Panel de edición para actualizar textos, fotografías y proyectos sin tocar código',
    ],
    faqs: [
      {
        question: '¿Puedo actualizar el contenido por mi cuenta una vez publicado?',
        answer: 'Sí. Diseñamos bloques guiados para que tú y tu equipo puedan editar textos, testimonios y proyectos sin riesgo de romper el diseño.',
      },
      {
        question: '¿Incluyen dominio y hosting?',
        answer: 'Te asesoramos en la contratación de tu dominio y configuramos el despliegue en infraestructura segura (Cloudflare/Vercel) con certificado SSL incluido.',
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Demostración de sitio web corporativo de alta resolución',
    ctaText: 'Solicitar cotización para mi sitio web',
    ctaLink: '/contacto',
    displayOrder: 1,
    status: 'published',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-10-10T00:00:00Z',
  },
  {
    id: 'sub-02',
    parentServiceId: 'srv-01',
    parentServiceName: 'Sitios web y portales',
    name: 'Catálogos Digitales & Vitrinas Interactivas de Productos',
    slug: 'catalogos-digitales',
    tagline: 'Muestra tu inventario o servicios de manera ágil con cotizador directo por WhatsApp',
    description: 'Para empresas comerciales o distribuidores que necesitan que sus clientes exploren productos, descarguen fichas técnicas y soliciten presupuestos en segundos.',
    benefits: [
      'Búsqueda y filtrado instantáneo por categoría, marca o código de producto',
      'Generación automática de solicitud de pedido lista para enviar por WhatsApp',
      'Modo sin conexión parcial para consultas en ferias o visitas a clientes',
    ],
    deliverables: [
      'Módulo de catálogo con fichas técnicas estructuradas y galería fotográfica',
      'Integración con botón de cotización por WhatsApp con mensaje preformateado',
      'Herramienta de importación masiva en CSV/Excel para actualizar precios y existencias',
    ],
    faqs: [
      {
        question: '¿Funciona si tengo cientos o miles de productos?',
        answer: 'Sí. El catálogo cuenta con paginación progresiva y búsqueda indexada que responde en milisegundos.',
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Catálogo de repuestos e inventario digital',
    ctaText: 'Construir catálogo interactivo',
    ctaLink: '/contacto',
    displayOrder: 2,
    status: 'published',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-10-10T00:00:00Z',
  },
  {
    id: 'sub-03',
    parentServiceId: 'srv-02',
    parentServiceName: 'Ventas y gestión',
    name: 'Paneles de Control Operativo & Mini-CRMs a Medida',
    slug: 'paneles-control-crm',
    tagline: 'Sustituye hojas de cálculo dispersas por una herramienta centralizada para tus socios',
    description: 'Desarrollamos aplicaciones de trabajo internas como Centauri: seguimiento de clientes potenciales, registro de comprobantes multimoneda (VES, USD, USDT) y control de entregas por hito.',
    benefits: [
      'Acceso seguro con permisos diferenciados por socio o rol operativo',
      'Historial auditable de cada cliente y acuerdo comercial pactado',
      'Desacople estricto entre avances técnicos y pagos recibidos',
    ],
    deliverables: [
      'Tablero de etapas comerciales adaptado a tu ciclo de ventas real',
      'Módulo de conciliación financiera con registro de tasas oficiales e históricas',
      'Exportación estructurada de datos a CSV y respaldo local cifrado',
    ],
    faqs: [
      {
        question: '¿Por qué un sistema a medida en lugar de un CRM comercial genérico?',
        answer: 'Porque los CRMs comerciales cobran licencias mensuales elevadas por usuario e imponen flujos rígidos. Un panel a medida responde exactamente a tu operación y es propiedad de tu empresa.',
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Panel de control y analítica empresarial',
    ctaText: 'Consultar desarrollo de panel operativo',
    ctaLink: '/contacto',
    displayOrder: 1,
    status: 'published',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-10-10T00:00:00Z',
  },
  {
    id: 'sub-04',
    parentServiceId: 'srv-03',
    parentServiceName: 'Atención al cliente',
    name: 'Bandeja Unificada Multicanal & Respuestas Asistidas',
    slug: 'mensajeria-multicanal',
    tagline: 'Atención centralizada para WhatsApp, Telegram y consultas web en un solo buzón',
    description: 'Implementamos bandejas de entrada para que ningún cliente quede sin respuesta, con plantillas predefinidas y asignación por responsable.',
    benefits: [
      'Responde a prospectos en menos de 5 minutos con plantillas profesionales',
      'Evita que las conversaciones se queden en los teléfonos personales del equipo',
      'Métricas claras de tiempo de respuesta y tasa de conversión',
    ],
    deliverables: [
      'Buzón centralizado con filtrado por canal y estado de conversación',
      'Gestor de plantillas comerciales editables con variables dinámicas',
      'Alertas de seguimiento para consultas pendientes de respuesta',
    ],
    faqs: [
      {
        question: '¿Cómo se conecta con WhatsApp?',
        answer: 'Podemos conectar números existentes mediante API oficial de WhatsApp Cloud o integraciones asistidas según el volumen de tu negocio.',
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Bandeja de mensajería empresarial multicanal',
    ctaText: 'Optimizar atención al cliente',
    ctaLink: '/contacto',
    displayOrder: 1,
    status: 'published',
    createdAt: '2026-09-10T00:00:00Z',
    updatedAt: '2026-10-10T00:00:00Z',
  },
];

const STORAGE_KEY = 'lyberate_cms_subservices';

export class SubserviceRepository {
  private subservices: SubserviceDTO[] = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.subservices = [...INITIAL_SUBSERVICES];
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.subservices = [...INITIAL_SUBSERVICES];
      this.saveState();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      this.subservices = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_SUBSERVICES];
    } catch {
      this.subservices = [...INITIAL_SUBSERVICES];
    }
  }

  private saveState(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.subservices));
      window.dispatchEvent(new Event('lyberate-subservices-update'));
    }
  }

  getAll(): SubserviceDTO[] {
    return [...this.subservices].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getPublished(): SubserviceDTO[] {
    return this.getAll().filter((s) => s.status === 'published');
  }

  getByParentService(serviceId: string): SubserviceDTO[] {
    return this.getAll().filter((s) => s.parentServiceId === serviceId);
  }

  getById(id: string): SubserviceDTO | undefined {
    return this.subservices.find((s) => s.id === id);
  }

  getBySlug(slug: string): SubserviceDTO | undefined {
    return this.subservices.find((s) => s.slug === slug);
  }

  createSubservice(data: Omit<SubserviceDTO, 'id' | 'createdAt' | 'updatedAt'>): SubserviceDTO {
    const id = `sub-${Date.now()}`;
    const newSub: SubserviceDTO = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.subservices.push(newSub);
    this.saveState();
    return newSub;
  }

  updateSubservice(id: string, updates: Partial<SubserviceDTO>): SubserviceDTO {
    const idx = this.subservices.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Subservicio con ID ${id} no encontrado.`);

    const updated: SubserviceDTO = {
      ...this.subservices[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.subservices[idx] = updated;
    this.saveState();
    return updated;
  }

  deleteSubservice(id: string): boolean {
    const idx = this.subservices.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.subservices.splice(idx, 1);
    this.saveState();
    return true;
  }

  resetToDefault(): void {
    this.subservices = [...INITIAL_SUBSERVICES];
    this.saveState();
  }
}

export const subserviceRepository = new SubserviceRepository();

