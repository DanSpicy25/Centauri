import {
  CentauriProjectDTO,
  ProjectTaskDTO,
  ProjectDocumentSnapshotDTO,
  PartnerDistributionDTO,
  DeliverableStatus,
} from '../types/projects';

const INITIAL_PROJECTS: CentauriProjectDTO[] = [
  {
    id: 'prj-orgemac',
    code: 'PRJ-2026-001',
    name: 'Plataforma Digital & Catálogo Orgemac',
    companyId: 'cli-orgemac',
    companyName: 'Orgemac C.A.',
    primaryContact: {
      name: 'Ing. Carlos Mendoza',
      email: 'contacto@orgemac.com',
      phone: '+58 412 889 0012',
      role: 'Director de Operaciones',
    },
    assignedPartner: 'Valdez',
    status: 'in_progress',
    scopeSummary: 'Desarrollo de catálogo de productos en Vite SPA sobre Cloudflare CDN, integración de pedidos móviles y optimización para baja conectividad.',
    deliverables: [
      {
        id: 'del-01',
        title: 'Arquitectura Frontend & Catálogo Base',
        description: 'Vite SPA con búsqueda reactiva, categorías y fichas técnicas de maquinaria.',
        status: 'accepted',
        targetDueDate: '2026-08-30',
        deliveredAt: '2026-08-28',
      },
      {
        id: 'del-02',
        title: 'Módulo de Pedidos Rápidos a WhatsApp',
        description: 'Generación automática de cotización en formato texto para despacho inmediato.',
        status: 'delivered',
        targetDueDate: '2026-09-20',
        deliveredAt: '2026-09-21',
        reviewNotes: 'Pendiente confirmación de los números de sucursales del interior.',
      },
      {
        id: 'del-03',
        title: 'Integración Edge CDN & Caché Global',
        description: 'Configuración de Cloudflare Pages con tiempos de respuesta menores a 200ms.',
        status: 'ready_for_review',
        targetDueDate: '2026-10-15',
      },
      {
        id: 'del-04',
        title: 'Entrega Final y Manual Operativo',
        description: 'Capacitación al equipo de ventas y traspaso de credenciales.',
        status: 'planned',
        targetDueDate: '2026-10-30',
      },
    ],
    tasks: [
      {
        id: 'tsk-01',
        title: 'Validar catálogo de repuestos con Carlos',
        assignedTo: 'Valdez',
        dueDate: '2026-10-14',
        status: 'pending',
        priority: 'high',
        notes: 'Verificar si agregan línea de compresores de alta potencia.',
      },
      {
        id: 'tsk-02',
        title: 'Revisar certificados SSL y cabeceras de seguridad CSP',
        assignedTo: 'Valdez',
        dueDate: '2026-10-16',
        status: 'in_progress',
        priority: 'medium',
      },
      {
        id: 'tsk-03',
        title: 'Diseñar plantilla imprimible de cotizaciones para clientes',
        assignedTo: 'Socio Fundador',
        dueDate: '2026-10-18',
        status: 'pending',
        priority: 'medium',
      },
    ],
    milestones: [
      {
        id: 'mls-01',
        title: 'Firma de Acuerdo & Anticipo del 40%',
        targetDate: '2026-08-15',
        completedDate: '2026-08-15',
        status: 'completed',
        paymentTriggerAmountUsd: 5800,
      },
      {
        id: 'mls-02',
        title: 'Entrega de Catálogo Interactivo (30%)',
        targetDate: '2026-09-25',
        completedDate: '2026-09-28',
        status: 'completed',
        paymentTriggerAmountUsd: 4350,
      },
      {
        id: 'mls-03',
        title: 'Lanzamiento en Producción & Cierre (30%)',
        targetDate: '2026-10-31',
        status: 'pending',
        paymentTriggerAmountUsd: 4350,
      },
    ],
    startDate: '2026-08-15',
    targetDeliveryDate: '2026-10-31',
    paymentStatus: 'partial',
    totalAgreedAmount: 14500,
    currency: 'USD',
    documents: [
      {
        id: 'doc-01',
        documentNumber: 'LYB-AGR-2026-001',
        templateType: 'project_agreement',
        title: 'Acuerdo de Desarrollo Tecnológico — Orgemac Comercial',
        generatedAt: '2026-08-15T14:30:00Z',
        generatedBy: 'Valdez',
        versionLabel: 'v1.0 (Aprobado)',
        parties: {
          providerName: 'Lyberate Software Labs',
          providerRepresentative: 'Valdez & Socio Fundador',
          clientName: 'Orgemac C.A.',
          clientRepresentative: 'Ing. Carlos Mendoza',
          clientEmail: 'contacto@orgemac.com',
          clientPhone: '+58 412 889 0012',
        },
        financialTerms: {
          totalAmount: 14500,
          currency: 'USD',
          paymentMethodTerms: '40% Anticipo, 30% Hito Intermedio, 30% Entrega Final. Pagos vía Zelle / Transferencia Internacional.',
          milestoneBreakdown: 'Hito 1 ($5,800), Hito 2 ($4,350), Hito 3 ($4,350)',
        },
        scopeSnapshot: {
          scopeSummary: 'Desarrollo integral de plataforma web por catálogo para equipamiento industrial con despliegue en CDN edge.',
          deliverables: [
            'Frontend Vite SPA con catálogo reactivo',
            'Integración de checkout directo a WhatsApp',
            'Optimización CDN Cloudflare Pages',
            'Manual operativo y garantía de soporte por 60 días',
          ],
          exclusions: [
            'Procesamiento de pagos con tarjeta de crédito extranjera no autorizada',
            'Mantenimiento de infraestructura interna de servidores on-premise de Orgemac',
          ],
          timelineWeeks: 10,
        },
        legalNotice: 'Documento generado para fines de control operativo y demostración del acuerdo comercial. Su validez definitiva corresponde a la firma de los representantes autorizados.',
      },
    ],
    partnerDistribution: {
      projectId: 'prj-orgemac',
      valdezPercent: 50,
      socioPercent: 50,
      valdezAmountUsd: 7250,
      socioAmountUsd: 7250,
      description: 'Distribución acordada 50/50 por roles complementarios de arquitectura y dirección de producto.',
      effectiveDate: '2026-08-15',
      history: [
        {
          id: 'dist-01',
          recordedAt: '2026-08-15T15:00:00Z',
          recordedBy: 'Valdez',
          valdezPercent: 50,
          socioPercent: 50,
          notes: 'Acuerdo inicial establecido al aceptar la propuesta comercial.',
        },
      ],
    },
    activityHistory: [
      {
        id: 'act-01',
        timestamp: '2026-08-15T14:30:00Z',
        author: 'Valdez',
        title: 'Proyecto creado desde propuesta aceptada',
        detail: 'Propuesta aprobada por el cliente. Configurados 4 entregables y 3 hitos de pago.',
        type: 'status_change',
      },
      {
        id: 'act-02',
        timestamp: '2026-08-28T16:00:00Z',
        author: 'Valdez',
        title: 'Entregable completado: Arquitectura Frontend',
        detail: 'Revisado y aceptado por Carlos Mendoza.',
        type: 'delivery',
      },
      {
        id: 'act-03',
        timestamp: '2026-09-21T11:20:00Z',
        author: 'Socio Fundador',
        title: 'Entregable en revisión: Módulo WhatsApp',
        detail: 'Enviada versión preliminar para pruebas del equipo comercial.',
        type: 'delivery',
      },
    ],
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-10T09:00:00Z',
  },
  {
    id: 'prj-noticia',
    code: 'PRJ-2026-002',
    name: 'Portal Editorial & PWA Contacto con la Noticia',
    companyId: 'cli-noticia',
    companyName: 'Medios Digitales de Información C.A.',
    primaryContact: {
      name: 'Lcdo. Roberto Santos',
      email: 'redaccion@contactoconlanoticia.com',
      role: 'Director Editorial',
    },
    assignedPartner: 'Valdez',
    status: 'completed',
    scopeSummary: 'Portal periodístico digital de alta concurrencia con capacidad PWA offline, sala de redacción en vivo y backend optimizado en PHP 8 / MySQL.',
    deliverables: [
      {
        id: 'del-n1',
        title: 'Portal Web PWA y Shell Offline',
        description: 'Diseño editorial responsivo con lectura garantizada ante caídas de conexión.',
        status: 'accepted',
        targetDueDate: '2026-07-15',
        deliveredAt: '2026-07-14',
      },
      {
        id: 'del-n2',
        title: 'Sala de Redacción & Editor de Artículos',
        description: 'Interfaz en tiempo real para periodistas con formateo multimedia.',
        status: 'accepted',
        targetDueDate: '2026-08-10',
        deliveredAt: '2026-08-09',
      },
      {
        id: 'del-n3',
        title: 'Optimización de Carga y Core Web Vitals',
        description: 'Imágenes WebP/AVIF automáticas y caché local.',
        status: 'accepted',
        targetDueDate: '2026-08-30',
        deliveredAt: '2026-08-28',
      },
    ],
    tasks: [
      {
        id: 'tsk-n1',
        title: 'Auditoría mensual de consumo de base de datos',
        assignedTo: 'Valdez',
        dueDate: '2026-10-25',
        status: 'pending',
        priority: 'low',
      },
    ],
    milestones: [
      {
        id: 'mls-n1',
        title: 'Entrega Integral y Puesta en Producción',
        targetDate: '2026-08-31',
        completedDate: '2026-08-30',
        status: 'completed',
        paymentTriggerAmountUsd: 11000,
      },
    ],
    startDate: '2026-06-10',
    targetDeliveryDate: '2026-08-31',
    actualDeliveryDate: '2026-08-30',
    paymentStatus: 'paid',
    totalAgreedAmount: 11000,
    currency: 'USD',
    documents: [],
    partnerDistribution: {
      projectId: 'prj-noticia',
      valdezPercent: 60,
      socioPercent: 40,
      valdezAmountUsd: 6600,
      socioAmountUsd: 4400,
      description: 'Acuerdo especial 60/40 debido a la alta carga de arquitectura backend PHP/MySQL y PWA Service Workers.',
      effectiveDate: '2026-06-10',
      history: [
        {
          id: 'dist-n1',
          recordedAt: '2026-06-10T10:00:00Z',
          recordedBy: 'Valdez',
          valdezPercent: 60,
          socioPercent: 40,
          notes: 'Acuerdo convenido por complejidad de desarrollo de la sala de redacción.',
        },
      ],
    },
    activityHistory: [
      {
        id: 'act-n1',
        timestamp: '2026-08-30T18:00:00Z',
        author: 'Valdez',
        title: 'Proyecto culminado exitosamente',
        detail: 'Todas las fases aceptadas y pago 100% verificado.',
        type: 'status_change',
      },
    ],
    createdAt: '2026-06-10T09:00:00Z',
    updatedAt: '2026-08-30T18:00:00Z',
  },
  {
    id: 'prj-motoindy',
    code: 'PRJ-2026-003',
    name: 'Ecosistema de Despacho & Movilidad MotoIndy',
    companyId: 'cli-metropolis',
    companyName: 'MotoIndy Logistics & Despacho',
    primaryContact: {
      name: 'Eduardo Rivas',
      email: 'erivas@metropolis-express.com',
      phone: '+58 424 551 8899',
      role: 'Gerente de Operaciones',
    },
    assignedPartner: 'Valdez',
    status: 'planning',
    scopeSummary: 'Panel web de administración en React, backend en tiempo real con WebSockets y soporte de rutas con mapa para mototaxis.',
    deliverables: [
      {
        id: 'del-m1',
        title: 'Especificación de Arquitectura & Contratos API',
        description: 'Definición de modelos de datos, endpoints REST y canales WebSocket.',
        status: 'ready_for_review',
        targetDueDate: '2026-10-20',
      },
      {
        id: 'del-m2',
        title: 'Panel Web de Monitoreo de Rutas',
        description: 'Supervisión en vivo de despachos y conductores activos en mapa.',
        status: 'in_progress',
        targetDueDate: '2026-11-15',
      },
      {
        id: 'del-m3',
        title: 'Módulo de Tarifas y Liquidación a Conductores',
        description: 'Cálculo automático de comisiones por carrera y kilómetros recorridos.',
        status: 'planned',
        targetDueDate: '2026-12-05',
      },
    ],
    tasks: [
      {
        id: 'tsk-m1',
        title: 'Simular latencia de WebSockets en red móvil 3G/4G',
        assignedTo: 'Valdez',
        dueDate: '2026-10-18',
        status: 'in_progress',
        priority: 'high',
      },
      {
        id: 'tsk-m2',
        title: 'Preparar contrato formal con cláusulas de confidencialidad',
        assignedTo: 'Socio Fundador',
        dueDate: '2026-10-17',
        status: 'pending',
        priority: 'high',
      },
    ],
    milestones: [
      {
        id: 'mls-m1',
        title: 'Anticipo de Inicio (50%)',
        targetDate: '2026-10-22',
        status: 'pending',
        paymentTriggerAmountUsd: 7500,
      },
    ],
    startDate: '2026-10-12',
    targetDeliveryDate: '2026-12-20',
    paymentStatus: 'unpaid',
    totalAgreedAmount: 15000,
    currency: 'USD',
    documents: [],
    partnerDistribution: {
      projectId: 'prj-motoindy',
      valdezPercent: 50,
      socioPercent: 50,
      valdezAmountUsd: 7500,
      socioAmountUsd: 7500,
      description: 'Distribución estándar 50/50 entre los socios.',
      effectiveDate: '2026-10-12',
      history: [
        {
          id: 'dist-m1',
          recordedAt: '2026-10-12T10:00:00Z',
          recordedBy: 'Valdez',
          valdezPercent: 50,
          socioPercent: 50,
          notes: 'Acuerdo inicial registrado para el proyecto.',
        },
      ],
    },
    activityHistory: [
      {
        id: 'act-m1',
        timestamp: '2026-10-12T09:00:00Z',
        author: 'Valdez',
        title: 'Proyecto inicializado en planificación',
        detail: 'Cargados entregables para el sistema de despacho.',
        type: 'status_change',
      },
    ],
    createdAt: '2026-10-12T09:00:00Z',
    updatedAt: '2026-10-12T09:00:00Z',
  },
];

const STORAGE_KEY = 'lyberate_centauri_projects';

export class CentauriProjectRepository {
  private projects: CentauriProjectDTO[] = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.projects = [...INITIAL_PROJECTS];
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.projects = [...INITIAL_PROJECTS];
      this.saveState();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      this.projects = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_PROJECTS];
    } catch {
      this.projects = [...INITIAL_PROJECTS];
    }
  }

  private saveState(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects));
      window.dispatchEvent(new Event('lyberate-projects-update'));
    }
  }

  getAllProjects(): CentauriProjectDTO[] {
    return [...this.projects];
  }

  getAll(): CentauriProjectDTO[] {
    return this.getAllProjects();
  }

  getSummary() {
    const totalProjects = this.projects.length;
    const activeProjects = this.projects.filter(
      (p) => p.status === 'in_progress' || p.status === 'planning' || p.status === 'review'
    ).length;
    const completedProjects = this.projects.filter((p) => p.status === 'completed').length;
    const allDeliverables = this.projects.flatMap((p) => p.deliverables);
    const readyForReviewDeliverables = allDeliverables.filter(
      (d) => d.status === 'ready_for_review'
    ).length;
    const totalDeliverables = allDeliverables.length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      readyForReviewDeliverables,
      totalDeliverables,
    };
  }

  getProjectById(id: string): CentauriProjectDTO | undefined {
    return this.projects.find((p) => p.id === id);
  }

  createProject(
    data: Omit<CentauriProjectDTO, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'documents' | 'partnerDistribution' | 'activityHistory'> & {
      valdezPercent?: number;
      socioPercent?: number;
    }
  ): CentauriProjectDTO {
    const nextNum = this.projects.length + 1;
    const code = `PRJ-2026-${String(nextNum).padStart(3, '0')}`;
    const id = `prj-${Date.now()}`;

    const valdezPct = data.valdezPercent ?? 50;
    const socioPct = data.socioPercent ?? 50;

    const newProject: CentauriProjectDTO = {
      ...data,
      id,
      code,
      documents: [],
      partnerDistribution: {
        projectId: id,
        valdezPercent: valdezPct,
        socioPercent: socioPct,
        valdezAmountUsd: (data.totalAgreedAmount * valdezPct) / 100,
        socioAmountUsd: (data.totalAgreedAmount * socioPct) / 100,
        description: `Distribución inicial ${valdezPct}/${socioPct} configurada al crear el proyecto.`,
        effectiveDate: new Date().toISOString().split('T')[0],
        history: [
          {
            id: `dist-${Date.now()}`,
            recordedAt: new Date().toISOString(),
            recordedBy: data.assignedPartner,
            valdezPercent: valdezPct,
            socioPercent: socioPct,
            notes: 'Distribución fijada en la creación del proyecto.',
          },
        ],
      },
      activityHistory: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: data.assignedPartner,
          title: `Proyecto ${data.name} creado`,
          detail: `Alcance: ${data.scopeSummary.slice(0, 100)}...`,
          type: 'status_change',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.unshift(newProject);
    this.saveState();
    return newProject;
  }

  updateProject(id: string, updates: Partial<CentauriProjectDTO>): CentauriProjectDTO {
    const project = this.getProjectById(id);
    if (!project) throw new Error('Proyecto no encontrado.');

    Object.assign(project, updates, { updatedAt: new Date().toISOString() });
    this.saveState();
    return project;
  }

  updateDeliverableStatus(
    projectId: string,
    deliverableId: string,
    status: DeliverableStatus,
    reviewNotes?: string
  ): CentauriProjectDTO {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Proyecto no encontrado.');

    const deliverable = project.deliverables.find((d) => d.id === deliverableId);
    if (!deliverable) throw new Error('Entregable no encontrado.');

    deliverable.status = status;
    if (status === 'delivered' || status === 'accepted') {
      deliverable.deliveredAt = new Date().toISOString().split('T')[0];
    }
    if (reviewNotes !== undefined) {
      deliverable.reviewNotes = reviewNotes;
    }

    project.activityHistory.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: project.assignedPartner,
      title: `Entregable actualizado: ${deliverable.title}`,
      detail: `Nuevo estado: ${status}${reviewNotes ? ` | Nota: ${reviewNotes}` : ''}`,
      type: 'delivery',
    });

    project.updatedAt = new Date().toISOString();
    this.saveState();
    return project;
  }

  addTask(
    projectId: string,
    task: Omit<ProjectTaskDTO, 'id'>
  ): CentauriProjectDTO {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Proyecto no encontrado.');

    const newTask: ProjectTaskDTO = {
      ...task,
      id: `tsk-${Date.now()}`,
    };

    project.tasks.push(newTask);
    project.activityHistory.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: task.assignedTo,
      title: `Tarea asignada: ${task.title}`,
      detail: `Responsable: ${task.assignedTo} | Vencimiento: ${task.dueDate}`,
      type: 'task',
    });

    project.updatedAt = new Date().toISOString();
    this.saveState();
    return project;
  }

  updateTaskStatus(
    projectId: string,
    taskId: string,
    status: ProjectTaskDTO['status']
  ): CentauriProjectDTO {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Proyecto no encontrado.');

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Tarea no encontrada.');

    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date().toISOString();
    }

    project.updatedAt = new Date().toISOString();
    this.saveState();
    return project;
  }

  generateDocumentSnapshot(
    projectId: string,
    templateType: 'institutional' | 'project_agreement' | 'commercial_proposal',
    options?: {
      versionLabel?: string;
      customNotes?: string;
      author?: string;
    }
  ): ProjectDocumentSnapshotDTO {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Proyecto no encontrado.');

    const author = options?.author || project.assignedPartner;
    const docCount = (project.documents?.length || 0) + 1;
    const docNumber = `LYB-DOC-${project.code.slice(4)}-${String(docCount).padStart(2, '0')}`;

    let title = '';
    let scopeSummary = project.scopeSummary;
    let exclusions: string[] = [];

    if (templateType === 'institutional') {
      title = `Documento Institucional y Credenciales de Ingeniería — Lyberate Software Labs`;
      scopeSummary = `Lyberate es un estudio de desarrollo de software integral enfocado en soluciones desacopladas, alto rendimiento y arquitecturas limpias para negocios.`;
      exclusions = ['Garantías no contempladas formalmente en contratos específicos'];
    } else if (templateType === 'project_agreement') {
      title = `Contrato de Prestación de Servicios Tecnológicos — ${project.name}`;
      exclusions = [
        'Desarrollos que excedan la lista explícita de entregables acordados sin orden de cambio firmada',
        'Costos de licencias de APIs de terceros no contratadas directamente por Lyberate',
      ];
    } else {
      title = `Propuesta Comercial y Alcance Técnico — ${project.name}`;
      exclusions = ['Soporte presencial fuera de las ubicaciones convenidas'];
    }

    const snapshot: ProjectDocumentSnapshotDTO = {
      id: `doc-${Date.now()}`,
      documentNumber: docNumber,
      templateType,
      title,
      generatedAt: new Date().toISOString(),
      generatedBy: author,
      versionLabel: options?.versionLabel || `v${docCount}.0 (Inmutable)`,
      parties: {
        providerName: 'Lyberate Software Labs',
        providerRepresentative: 'Valdez & Socio Fundador',
        clientName: project.companyName,
        clientRepresentative: project.primaryContact.name,
        clientEmail: project.primaryContact.email,
        clientPhone: project.primaryContact.phone,
      },
      financialTerms: {
        totalAmount: project.totalAgreedAmount,
        currency: project.currency,
        paymentMethodTerms: `Pagos en ${project.currency} según calendario de entregables acordado. Métodos admitidos: Pago Móvil, Zelle, Binance USDT, Transferencia.`,
        milestoneBreakdown: project.milestones
          .map((m) => `${m.title}: ${m.paymentTriggerAmountUsd ? `$${m.paymentTriggerAmountUsd}` : 'Condición de hito'}`)
          .join(' | '),
      },
      scopeSnapshot: {
        scopeSummary,
        deliverables: project.deliverables.map((d) => `${d.title}: ${d.description}`),
        exclusions,
        timelineWeeks: Math.max(
          4,
          Math.ceil(
            (new Date(project.targetDeliveryDate).getTime() - new Date(project.startDate).getTime()) /
              (7 * 24 * 3600 * 1000)
          ) || 8
        ),
      },
      legalNotice: 'Documento generado localmente con snapshot inmutable de los términos acordados para fines operativos. No constituye asesoría legal ni firma electrónica formal con certificado cualificado.',
    };

    project.documents.unshift(snapshot);
    project.activityHistory.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      title: `Documento generado: ${snapshot.documentNumber}`,
      detail: `Plantilla: ${templateType} | Versión: ${snapshot.versionLabel}`,
      type: 'document',
    });

    project.updatedAt = new Date().toISOString();
    this.saveState();
    return snapshot;
  }

  updatePartnerDistribution(
    projectId: string,
    valdezPercent: number,
    socioPercent: number,
    notes: string,
    author: string
  ): PartnerDistributionDTO {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Proyecto no encontrado.');

    if (valdezPercent + socioPercent !== 100) {
      throw new Error('La suma de los porcentajes de los socios debe ser exactamente 100%.');
    }

    const historyEntry = {
      id: `dist-hist-${Date.now()}`,
      recordedAt: new Date().toISOString(),
      recordedBy: author,
      valdezPercent,
      socioPercent,
      notes,
    };

    project.partnerDistribution = {
      projectId,
      valdezPercent,
      socioPercent,
      valdezAmountUsd: (project.totalAgreedAmount * valdezPercent) / 100,
      socioAmountUsd: (project.totalAgreedAmount * socioPercent) / 100,
      description: `Acuerdo actualizado a ${valdezPercent}% Valdez / ${socioPercent}% Socio: ${notes}`,
      effectiveDate: new Date().toISOString().split('T')[0],
      history: [historyEntry, ...(project.partnerDistribution.history || [])],
    };

    project.activityHistory.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      title: `Acuerdo de distribución actualizado (${valdezPercent}% / ${socioPercent}%)`,
      detail: notes,
      type: 'status_change',
    });

    project.updatedAt = new Date().toISOString();
    this.saveState();
    return project.partnerDistribution;
  }

  resetToDefault(): void {
    this.projects = [...INITIAL_PROJECTS];
    this.saveState();
  }
}

export const centauriProjectRepository = new CentauriProjectRepository();
