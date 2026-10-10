import {
  ClientDTO,
  DealDTO,
  CrmTaskDTO,
  CrmActivityDTO,
  PipelineSummary,
  DealStage,
} from '../types/crm';

const FIXTURE_CLIENTS: ClientDTO[] = [
  {
    id: 'cli-orgemac',
    name: 'Orgemac Comercial',
    companyName: 'Orgemac C.A.',
    contactPerson: 'Ing. Carlos Mendoza',
    email: 'contacto@orgemac.com',
    phone: '+58 412 889 0012',
    industry: 'Equipamiento & Retail Industrial',
    tier: 'enterprise',
    status: 'active',
    assignedPartner: 'Valdez',
    managedSiteIds: ['site-orgemac'],
    portfolioProjectSlug: 'orgemac',
    totalContractValueUsd: 14500,
    notes: 'Plataforma web por catálogo Vite SPA sobre Cloudflare. Mantenimiento activo.',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'cli-pinkfashion',
    name: 'Pink Fashion VE',
    companyName: 'Pink Fashion Tiendas C.A.',
    contactPerson: 'Valeria Gómez',
    email: 'ventas@pinkfashionve.com',
    phone: '+58 414 772 3344',
    industry: 'E-commerce & Moda',
    tier: 'standard',
    status: 'active',
    assignedPartner: 'Socio Fundador',
    managedSiteIds: ['site-pinkfashion'],
    portfolioProjectSlug: 'pink-fashion-ve',
    totalContractValueUsd: 8200,
    notes: 'Catálogo de comercio electrónico y pasarela móvil.',
    createdAt: '2026-07-20T11:30:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'cli-wilanye',
    name: 'Inversiones Wilanye',
    companyName: 'Wilanye Servicios C.A.',
    contactPerson: 'Wilmer Arreaza',
    email: 'contacto@wilanye.com',
    industry: 'Servicios Comerciales',
    tier: 'standard',
    status: 'active',
    assignedPartner: 'Valdez',
    managedSiteIds: ['site-wilanye'],
    portfolioProjectSlug: 'wilanye',
    totalContractValueUsd: 6500,
    notes: 'Aplicativo comercial con interfaz Tailwind CDN.',
    createdAt: '2026-09-02T14:15:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'cli-noticia',
    name: 'Contacto con la Noticia',
    companyName: 'Medios Digitales de Información C.A.',
    contactPerson: 'Lcdo. Roberto Santos',
    email: 'redaccion@contactoconlanoticia.com',
    industry: 'Periodismo & Medios Digitales',
    tier: 'enterprise',
    status: 'active',
    assignedPartner: 'Valdez',
    managedSiteIds: ['site-contactonoticia'],
    portfolioProjectSlug: 'contacto-con-la-noticia',
    totalContractValueUsd: 11000,
    notes: 'PWA periodística con sala de redacción offline y backend desacoplado.',
    createdAt: '2026-06-10T09:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'cli-metropolis',
    name: 'Logística Metrópolis',
    companyName: 'Transportes Metrópolis Express S.A.',
    contactPerson: 'Eduardo Rivas',
    email: 'erivas@metropolis-express.com',
    phone: '+58 424 551 8899',
    industry: 'Logística & Transporte',
    tier: 'vip',
    status: 'lead',
    assignedPartner: 'Valdez',
    totalContractValueUsd: 0,
    notes: 'Interesados en sistema de rastreo de flota con app móvil Flutter similar a MotoIndy.',
    createdAt: '2026-10-08T16:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
];

const FIXTURE_DEALS: DealDTO[] = [
  {
    id: 'deal-metropolis-tms',
    title: 'Plataforma TMS & Rastreo de Flota en Tiempo Real',
    clientId: 'cli-metropolis',
    clientName: 'Logística Metrópolis',
    stage: 'discovery',
    priority: 'high',
    valueUsd: 18500,
    probabilityPercent: 60,
    assignedPartner: 'Valdez',
    expectedCloseDate: '2026-11-15',
    serviceCategory: 'Desarrollo a Medida',
    technicalScopeSummary: 'Backend NestJS + Base de datos PostgreSQL + App móvil de choferes en Flutter.',
    notes: 'Reunión de alcance técnico coordinada para el próximo martes.',
    createdAt: '2026-10-08T16:30:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'deal-orgemac-b2b',
    title: 'Portal B2B de Pedidos & Integración ERP Sagitta',
    clientId: 'cli-orgemac',
    clientName: 'Orgemac Comercial',
    stage: 'proposal',
    priority: 'urgent',
    valueUsd: 9800,
    probabilityPercent: 80,
    assignedPartner: 'Valdez',
    expectedCloseDate: '2026-10-28',
    serviceCategory: 'Plataforma Componible',
    technicalScopeSummary: 'Módulo de pedidos mayoristas con autenticación de empresas e integración API con Sagitta.',
    notes: 'Presupuesto formal y documento de arquitectura entregados al cliente.',
    createdAt: '2026-09-25T11:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'deal-pinkfashion-app',
    title: 'App Móvil iOS/Android de Fidelización y Notificaciones',
    clientId: 'cli-pinkfashion',
    clientName: 'Pink Fashion VE',
    stage: 'negotiation',
    priority: 'medium',
    valueUsd: 7400,
    probabilityPercent: 85,
    assignedPartner: 'Socio Fundador',
    expectedCloseDate: '2026-10-22',
    serviceCategory: 'Desarrollo a Medida',
    technicalScopeSummary: 'Aplicación Flutter para clientes con cupones, notificaciones push y pasarela de pago.',
    notes: 'Revisando términos del contrato de mantenimiento y soporte de publicaciones en tiendas.',
    createdAt: '2026-09-18T14:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'deal-noticia-pwa',
    title: 'PWA Periodística & Sala de Redacción Descentralizada (Fase 1)',
    clientId: 'cli-noticia',
    clientName: 'Contacto con la Noticia',
    stage: 'won',
    priority: 'high',
    valueUsd: 11000,
    probabilityPercent: 100,
    assignedPartner: 'Valdez',
    expectedCloseDate: '2026-07-30',
    serviceCategory: 'Desarrollo a Medida',
    technicalScopeSummary: 'PWA offline-first con sincronización automática en React 19 y Tailwind CSS v4.',
    notes: 'Fase completada exitosamente. Sistema publicado y documentado en el portafolio.',
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
];

const FIXTURE_TASKS: CrmTaskDTO[] = [
  {
    id: 'task-1',
    title: 'Preparar documento de arquitectura para Logística Metrópolis',
    dealId: 'deal-metropolis-tms',
    clientId: 'cli-metropolis',
    clientName: 'Logística Metrópolis',
    assignedTo: 'Valdez',
    dueDate: '2026-10-14',
    priority: 'high',
    status: 'in_progress',
    notes: 'Definir modelo de datos para GPS y websockets en tiempo real.',
    createdAt: '2026-10-09T10:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Seguimiento de propuesta comercial con Orgemac',
    dealId: 'deal-orgemac-b2b',
    clientId: 'cli-orgemac',
    clientName: 'Orgemac Comercial',
    assignedTo: 'Valdez',
    dueDate: '2026-10-16',
    priority: 'medium',
    status: 'pending',
    notes: 'Confirmar si aprueban el cronograma de 4 semanas.',
    createdAt: '2026-10-08T15:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Revisión final de contrato con Pink Fashion',
    dealId: 'deal-pinkfashion-app',
    clientId: 'cli-pinkfashion',
    clientName: 'Pink Fashion VE',
    assignedTo: 'Socio Fundador',
    dueDate: '2026-10-12',
    priority: 'high',
    status: 'pending',
    notes: 'Verificar cláusula de soporte post-lanzamiento.',
    createdAt: '2026-10-07T12:00:00Z',
  },
];

const FIXTURE_ACTIVITIES: CrmActivityDTO[] = [
  {
    id: 'act-1',
    clientId: 'cli-metropolis',
    clientName: 'Logística Metrópolis',
    dealId: 'deal-metropolis-tms',
    type: 'meeting',
    title: 'Reunión de exploración técnica',
    description: 'Conversación inicial sobre requerimientos de monitoreo de rutas y requerimientos de conductores.',
    author: 'Valdez',
    timestamp: '2026-10-08T17:00:00Z',
  },
  {
    id: 'act-2',
    clientId: 'cli-orgemac',
    clientName: 'Orgemac Comercial',
    dealId: 'deal-orgemac-b2b',
    type: 'proposal',
    title: 'Envío de propuesta técnica B2B',
    description: 'Enviada propuesta formal con presupuesto de $9,800 USD e hitos de entrega.',
    author: 'Valdez',
    timestamp: '2026-10-05T11:30:00Z',
  },
  {
    id: 'act-3',
    clientId: 'cli-pinkfashion',
    clientName: 'Pink Fashion VE',
    type: 'call',
    title: 'Llamada de acuerdo de términos',
    description: 'Llamada con gerencia para definir esquema de notificaciones push de la app móvil.',
    author: 'Socio Fundador',
    timestamp: '2026-10-02T16:00:00Z',
  },
];

export class CrmRepository {
  private clients: ClientDTO[];
  private deals: DealDTO[];
  private tasks: CrmTaskDTO[];
  private activities: CrmActivityDTO[];

  constructor() {
    this.clients = [];
    this.deals = [];
    this.tasks = [];
    this.activities = [];
    this.loadState();
  }

  private loadState() {
    // Clientes
    const storedClients = this.getFromStorage('lyberate_crm_clients');
    if (storedClients) {
      try {
        const parsed = JSON.parse(storedClients);
        this.clients = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...FIXTURE_CLIENTS];
      } catch {
        this.clients = [...FIXTURE_CLIENTS];
      }
    } else {
      this.clients = [...FIXTURE_CLIENTS];
      this.saveToStorage('lyberate_crm_clients', JSON.stringify(this.clients));
    }

    // Oportunidades
    const storedDeals = this.getFromStorage('lyberate_crm_deals');
    if (storedDeals) {
      try {
        const parsed = JSON.parse(storedDeals);
        this.deals = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...FIXTURE_DEALS];
      } catch {
        this.deals = [...FIXTURE_DEALS];
      }
    } else {
      this.deals = [...FIXTURE_DEALS];
      this.saveToStorage('lyberate_crm_deals', JSON.stringify(this.deals));
    }

    // Tareas
    const storedTasks = this.getFromStorage('lyberate_crm_tasks');
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks);
        this.tasks = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...FIXTURE_TASKS];
      } catch {
        this.tasks = [...FIXTURE_TASKS];
      }
    } else {
      this.tasks = [...FIXTURE_TASKS];
      this.saveToStorage('lyberate_crm_tasks', JSON.stringify(this.tasks));
    }

    // Actividades
    const storedActivities = this.getFromStorage('lyberate_crm_activities');
    if (storedActivities) {
      try {
        const parsed = JSON.parse(storedActivities);
        this.activities = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...FIXTURE_ACTIVITIES];
      } catch {
        this.activities = [...FIXTURE_ACTIVITIES];
      }
    } else {
      this.activities = [...FIXTURE_ACTIVITIES];
      this.saveToStorage('lyberate_crm_activities', JSON.stringify(this.activities));
    }
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

  // --- CLIENTES ---

  getClients(): ClientDTO[] {
    return [...this.clients];
  }

  getClientById(id: string): ClientDTO | undefined {
    return this.clients.find((c) => c.id === id);
  }

  createClient(data: Partial<ClientDTO>): ClientDTO {
    const newClient: ClientDTO = {
      id: `cli-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: data.name?.trim() || 'Nuevo Cliente',
      companyName: data.companyName?.trim() || data.name || '',
      contactPerson: data.contactPerson?.trim() || '',
      email: data.email?.trim() || '',
      phone: data.phone?.trim(),
      industry: data.industry?.trim() || 'General',
      tier: data.tier || 'lead',
      status: data.status || 'lead',
      assignedPartner: data.assignedPartner || 'Valdez',
      managedSiteIds: data.managedSiteIds || [],
      portfolioProjectSlug: data.portfolioProjectSlug,
      totalContractValueUsd: data.totalContractValueUsd || 0,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.clients.unshift(newClient);
    this.saveToStorage('lyberate_crm_clients', JSON.stringify(this.clients));

    this.logActivity({
      clientId: newClient.id,
      clientName: newClient.name,
      type: 'note',
      title: 'Cliente creado en el sistema',
      description: `Registrado en el CRM como ${newClient.tier.toUpperCase()}`,
      author: newClient.assignedPartner,
    });

    return newClient;
  }

  updateClient(id: string, updates: Partial<ClientDTO>): ClientDTO {
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Cliente con ID ${id} no encontrado.`);

    const updated: ClientDTO = {
      ...this.clients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.clients[index] = updated;
    this.saveToStorage('lyberate_crm_clients', JSON.stringify(this.clients));
    return updated;
  }

  deleteClient(id: string): boolean {
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.clients.splice(index, 1);
    this.saveToStorage('lyberate_crm_clients', JSON.stringify(this.clients));
    return true;
  }

  exportClientsToJson(): string {
    return JSON.stringify(this.clients, null, 2);
  }

  exportClientsToCsv(): string {
    const headers = ['ID', 'Nombre', 'Empresa', 'Contacto', 'Email', 'Telefono', 'Industria', 'Tier', 'Estado', 'Socio Asignado', 'Valor Contrato (USD)'];
    const rows = this.clients.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.companyName}"`,
      `"${c.contactPerson}"`,
      c.email,
      c.phone || '',
      `"${c.industry}"`,
      c.tier,
      c.status,
      `"${c.assignedPartner}"`,
      c.totalContractValueUsd,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // --- OPORTUNIDADES / DEALS ---

  getDeals(): DealDTO[] {
    return [...this.deals];
  }

  getDealById(id: string): DealDTO | undefined {
    return this.deals.find((d) => d.id === id);
  }

  createDeal(data: Partial<DealDTO>): DealDTO {
    const client = data.clientId ? this.getClientById(data.clientId) : undefined;
    const clientName = client ? client.name : (data.clientName || 'Cliente Prospecto');

    const newDeal: DealDTO = {
      id: `deal-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: data.title?.trim() || 'Nueva Oportunidad Comercial',
      clientId: data.clientId || '',
      clientName,
      stage: data.stage || 'lead',
      priority: data.priority || 'medium',
      valueUsd: data.valueUsd || 0,
      probabilityPercent: data.probabilityPercent !== undefined ? data.probabilityPercent : 20,
      assignedPartner: data.assignedPartner || 'Valdez',
      expectedCloseDate: data.expectedCloseDate || new Date().toISOString().split('T')[0],
      serviceCategory: data.serviceCategory || 'Desarrollo a Medida',
      technicalScopeSummary: data.technicalScopeSummary || '',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.deals.unshift(newDeal);
    this.saveToStorage('lyberate_crm_deals', JSON.stringify(this.deals));

    this.logActivity({
      dealId: newDeal.id,
      clientId: newDeal.clientId,
      clientName: newDeal.clientName,
      type: 'proposal',
      title: `Oportunidad creada: ${newDeal.title}`,
      description: `Valor estimado: $${newDeal.valueUsd} USD • Probabilidad: ${newDeal.probabilityPercent}%`,
      author: newDeal.assignedPartner,
    });

    return newDeal;
  }

  updateDeal(id: string, updates: Partial<DealDTO>): DealDTO {
    const index = this.deals.findIndex((d) => d.id === id);
    if (index === -1) throw new Error(`Oportunidad con ID ${id} no encontrada.`);

    const current = this.deals[index];
    const updated: DealDTO = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.deals[index] = updated;
    this.saveToStorage('lyberate_crm_deals', JSON.stringify(this.deals));
    return updated;
  }

  moveDealStage(id: string, newStage: DealStage, author = 'Valdez'): DealDTO {
    const deal = this.getDealById(id);
    if (!deal) throw new Error(`Oportunidad ${id} no encontrada.`);

    const oldStage = deal.stage;
    let newProbability = deal.probabilityPercent;

    // Actualizar probabilidad automática según etapa
    switch (newStage) {
      case 'lead':
        newProbability = 20;
        break;
      case 'discovery':
        newProbability = 40;
        break;
      case 'proposal':
        newProbability = 70;
        break;
      case 'negotiation':
        newProbability = 85;
        break;
      case 'won':
        newProbability = 100;
        break;
      case 'lost':
        newProbability = 0;
        break;
    }

    const updated = this.updateDeal(id, {
      stage: newStage,
      probabilityPercent: newProbability,
    });

    this.logActivity({
      dealId: deal.id,
      clientId: deal.clientId,
      clientName: deal.clientName,
      type: 'note',
      title: `Cambio de etapa: ${oldStage.toUpperCase()} ➔ ${newStage.toUpperCase()}`,
      description: `Actualizada probabilidad a ${newProbability}%`,
      author,
    });

    return updated;
  }

  deleteDeal(id: string): boolean {
    const index = this.deals.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.deals.splice(index, 1);
    this.saveToStorage('lyberate_crm_deals', JSON.stringify(this.deals));
    return true;
  }

  getPipelineSummary(): PipelineSummary {
    const activeDeals = this.deals.filter((d) => d.stage !== 'lost' && d.stage !== 'won');
    const wonDeals = this.deals.filter((d) => d.stage === 'won');

    const totalPipelineValueUsd = activeDeals.reduce((acc, d) => acc + d.valueUsd, 0);
    const weightedPipelineValueUsd = Math.round(
      activeDeals.reduce((acc, d) => acc + d.valueUsd * (d.probabilityPercent / 100), 0)
    );
    const wonValueUsd = wonDeals.reduce((acc, d) => acc + d.valueUsd, 0);

    const closedCount = wonDeals.length + this.deals.filter((d) => d.stage === 'lost').length;
    const winRatePercent = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : 100;

    return {
      totalDeals: this.deals.length,
      activeDealsCount: activeDeals.length,
      totalPipelineValueUsd,
      weightedPipelineValueUsd,
      wonValueUsd,
      winRatePercent,
    };
  }

  // --- TAREAS ---

  getTasks(): CrmTaskDTO[] {
    return [...this.tasks];
  }

  createTask(data: Partial<CrmTaskDTO>): CrmTaskDTO {
    const newTask: CrmTaskDTO = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: data.title?.trim() || 'Nueva Tarea',
      dealId: data.dealId,
      clientId: data.clientId,
      clientName: data.clientName,
      assignedTo: data.assignedTo || 'Valdez',
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      priority: data.priority || 'medium',
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    this.saveToStorage('lyberate_crm_tasks', JSON.stringify(this.tasks));
    return newTask;
  }

  updateTaskStatus(id: string, status: CrmTaskDTO['status']): CrmTaskDTO {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Tarea con ID ${id} no encontrada.`);

    const updated: CrmTaskDTO = {
      ...this.tasks[index],
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    };

    this.tasks[index] = updated;
    this.saveToStorage('lyberate_crm_tasks', JSON.stringify(this.tasks));
    return updated;
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    this.saveToStorage('lyberate_crm_tasks', JSON.stringify(this.tasks));
    return true;
  }

  // --- ACTIVIDADES & TIMELINE ---

  getActivities(): CrmActivityDTO[] {
    return [...this.activities];
  }

  logActivity(data: Omit<CrmActivityDTO, 'id' | 'timestamp'>): CrmActivityDTO {
    const newAct: CrmActivityDTO = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...data,
    };

    this.activities.unshift(newAct);
    if (this.activities.length > 50) this.activities.pop();
    this.saveToStorage('lyberate_crm_activities', JSON.stringify(this.activities));
    return newAct;
  }

  resetToDefault(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('lyberate_crm_clients');
      localStorage.removeItem('lyberate_crm_deals');
      localStorage.removeItem('lyberate_crm_tasks');
      localStorage.removeItem('lyberate_crm_activities');
    }
    this.clients = JSON.parse(JSON.stringify(FIXTURE_CLIENTS));
    this.deals = JSON.parse(JSON.stringify(FIXTURE_DEALS));
    this.tasks = JSON.parse(JSON.stringify(FIXTURE_TASKS));
    this.activities = JSON.parse(JSON.stringify(FIXTURE_ACTIVITIES));
  }
}

export const crmRepository = new CrmRepository();

