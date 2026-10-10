import {
  ProductPricingDTO,
  SubscriptionPlanDTO,
  ClientSubscriptionDTO,
  InvoiceDTO,
  FinancialSummary,
} from '../types/finance';
import { crmRepository } from './crmRepository';

export type {
  ProductPricingDTO,
  SubscriptionPlanDTO,
  ClientSubscriptionDTO,
  InvoiceDTO,
  FinancialSummary,
};

const FIXTURE_PRODUCTS: ProductPricingDTO[] = [
  {
    id: 'prod-web',
    name: 'Desarrollo Web & Plataformas a Medida',
    category: 'web',
    tagline: 'Arquitectura limpia en React 19 + TypeScript, 0% plantillas',
    basePriceUsd: 4500,
    billingType: 'one_time',
    description: 'Diseño e ingeniería completa de portales corporativos, catálogos y plataformas con velocidad extrema y accesibilidad WCAG.',
    deliverables: ['Código fuente propio 100% independiente', 'Diseño responsivo adaptativo', 'Optimización SEO y Lighthouse 95+', 'Despliegue en Cloudflare'],
    isAvailable: true,
  },
  {
    id: 'prod-mobile',
    name: 'Aplicaciones Móviles Flutter (iOS / Android)',
    category: 'mobile',
    tagline: 'Una sola base de código para App Store y Google Play',
    basePriceUsd: 6800,
    billingType: 'one_time',
    description: 'Apps móviles para clientes o conductores con sincronización en tiempo real, geolocalización, notificaciones push y pasarelas de pago.',
    deliverables: ['App compilada para iOS y Android', 'Panel administrativo backend', 'Publicación en tiendas de aplicaciones', 'Manual de uso'],
    isAvailable: true,
  },
  {
    id: 'prod-saas-chat',
    name: 'LyberateDesk / LyberateChat (SaaS)',
    category: 'saas',
    tagline: 'Bandeja multicanal de WhatsApp, Telegram y chat web para empresas',
    basePriceUsd: 29,
    billingType: 'recurring',
    description: 'Software de atención al cliente centralizado bajo suscripción mensual o anual. Administra agentes, etiquetas y respuestas rápidas.',
    deliverables: ['Bandeja unificada multicanal', 'Configuración de respuestas automáticas', 'Acceso para agentes y supervisores', 'Actualizaciones continuas'],
    isAvailable: true,
  },
  {
    id: 'prod-maintenance',
    name: 'Mantenimiento & Soporte Continuo Cloudflare SLA',
    category: 'maintenance',
    tagline: 'Supervisión de disponibilidad 24/7 y seguridad perimetral',
    basePriceUsd: 49,
    billingType: 'recurring',
    description: 'Servicio recurrente de mantenimiento preventivo, renovación de certificados SSL, backups y optimización de latencia.',
    deliverables: ['Monitoreo continuo de uptime', 'Copias de seguridad semanales', 'Actualizaciones de dependencias', 'SLA de respuesta prioritaria'],
    isAvailable: true,
  },
];

const FIXTURE_PLANS: SubscriptionPlanDTO[] = [
  {
    id: 'plan-desk-starter',
    productId: 'prod-saas-chat',
    productName: 'LyberateDesk / LyberateChat',
    planName: 'Starter',
    priceMonthlyUsd: 29,
    priceYearlyUsd: 290,
    maxUsers: 2,
    features: ['Hasta 2 agentes de atención', 'WhatsApp Web integrado', 'Widget de Webchat en vivo', 'Historial de mensajes de 30 días'],
    isActive: true,
  },
  {
    id: 'plan-desk-business',
    productId: 'prod-saas-chat',
    productName: 'LyberateDesk / LyberateChat',
    planName: 'Business Pro',
    priceMonthlyUsd: 79,
    priceYearlyUsd: 790,
    maxUsers: 5,
    features: ['Hasta 5 agentes simultáneos', 'WhatsApp Cloud API oficial', 'Canal de Telegram + Webchat', 'Respuestas automáticas inteligentes', 'Historial ilimitado'],
    isActive: true,
  },
  {
    id: 'plan-desk-enterprise',
    productId: 'prod-saas-chat',
    productName: 'LyberateDesk / LyberateChat',
    planName: 'Enterprise SLA',
    priceMonthlyUsd: 199,
    priceYearlyUsd: 1990,
    maxUsers: 15,
    features: ['Agentes ilimitados', 'Instancia dedicada de alto rendimiento', 'Integración API con ERP/CRM propio', 'Soporte prioritario 24/7'],
    isActive: true,
  },
  {
    id: 'plan-sla-basic',
    productId: 'prod-maintenance',
    productName: 'Mantenimiento Cloudflare SLA',
    planName: 'Esencial',
    priceMonthlyUsd: 49,
    priceYearlyUsd: 490,
    features: ['Supervisión de uptime 24/7', 'Backups semanales', 'Parches de seguridad', 'Soporte por correo en 24h'],
    isActive: true,
  },
  {
    id: 'plan-sla-business',
    productId: 'prod-maintenance',
    productName: 'Mantenimiento Cloudflare SLA',
    planName: 'Empresarial Prioritario',
    priceMonthlyUsd: 129,
    priceYearlyUsd: 1290,
    features: ['Monitoreo continuo en tiempo real', 'Backups diarios cifrados', 'Optimización de CDN Cloudflare', 'SLA de respuesta < 2 horas', 'Soporte telefónico directo'],
    isActive: true,
  },
];

const FIXTURE_SUBSCRIPTIONS: ClientSubscriptionDTO[] = [
  {
    id: 'sub-orgemac',
    clientId: 'cli-orgemac',
    clientName: 'Orgemac Comercial',
    planId: 'plan-sla-business',
    planName: 'Empresarial Prioritario',
    productName: 'Mantenimiento Cloudflare SLA',
    billingFrequency: 'monthly',
    amountUsd: 129,
    status: 'active',
    startDate: '2026-08-15',
    nextRenewalDate: '2026-11-15',
    assignedPartner: 'Valdez',
  },
  {
    id: 'sub-pinkfashion',
    clientId: 'cli-pinkfashion',
    clientName: 'Pink Fashion VE',
    planId: 'plan-desk-business',
    planName: 'Business Pro',
    productName: 'LyberateDesk / LyberateChat',
    billingFrequency: 'monthly',
    amountUsd: 79,
    status: 'active',
    startDate: '2026-09-01',
    nextRenewalDate: '2026-11-01',
    assignedPartner: 'Socio Fundador',
  },
  {
    id: 'sub-noticia',
    clientId: 'cli-noticia',
    clientName: 'Contacto con la Noticia',
    planId: 'plan-sla-basic',
    planName: 'Esencial',
    productName: 'Mantenimiento Cloudflare SLA',
    billingFrequency: 'monthly',
    amountUsd: 49,
    status: 'active',
    startDate: '2026-07-01',
    nextRenewalDate: '2026-11-01',
    assignedPartner: 'Valdez',
  },
];

const FIXTURE_INVOICES: InvoiceDTO[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    clientId: 'cli-orgemac',
    clientName: 'Orgemac Comercial',
    concept: 'Desarrollo de Plataforma Web por Catálogo & Despliegue Cloudflare',
    amountUsd: 14500,
    status: 'paid',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    paidDate: '2026-08-14',
    paymentMethod: 'transfer',
    notes: 'Pago total del proyecto liquidado conforme al contrato.',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    clientId: 'cli-noticia',
    clientName: 'Contacto con la Noticia',
    concept: 'PWA Periodística & Sala de Redacción Editorial Descentralizada',
    amountUsd: 11000,
    status: 'paid',
    issueDate: '2026-06-15',
    dueDate: '2026-07-01',
    paidDate: '2026-06-30',
    paymentMethod: 'zelle',
    notes: 'Liquidación de entrega de Fase 1.',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    clientId: 'cli-wilanye',
    clientName: 'Inversiones Wilanye',
    concept: 'Sistema Web Comercial con Interfaz Tailwind',
    amountUsd: 6500,
    status: 'paid',
    issueDate: '2026-09-02',
    dueDate: '2026-09-16',
    paidDate: '2026-09-15',
    paymentMethod: 'transfer',
    notes: 'Completado y cerrado.',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-004',
    clientId: 'cli-pinkfashion',
    clientName: 'Pink Fashion VE',
    concept: 'Anticipo 50% — Desarrollo App Móvil iOS/Android de Fidelización',
    amountUsd: 3700,
    status: 'paid',
    issueDate: '2026-09-20',
    dueDate: '2026-10-05',
    paidDate: '2026-10-03',
    paymentMethod: 'zelle',
    notes: 'Anticipo recibido para arranque de desarrollo.',
  },
  {
    id: 'inv-5',
    invoiceNumber: 'INV-2026-005',
    clientId: 'cli-pinkfashion',
    clientName: 'Pink Fashion VE',
    concept: 'Saldo 50% — Entrega Final y Publicación en Tiendas de la App',
    amountUsd: 3700,
    status: 'pending',
    issueDate: '2026-10-08',
    dueDate: '2026-10-25',
    notes: 'Factura emitida pendiente de cobro contra entrega de release en tiendas.',
  },
  {
    id: 'inv-6',
    invoiceNumber: 'INV-2026-006',
    clientId: 'cli-metropolis',
    clientName: 'Logística Metrópolis',
    concept: 'Auditoría Técnica Inicial & Especificación de Plataforma TMS',
    amountUsd: 2500,
    status: 'pending',
    issueDate: '2026-10-09',
    dueDate: '2026-10-23',
    notes: 'Presupuesto de ingeniería inicial para validación de arquitectura Flutter.',
  },
];

export class FinanceRepository {
  private products: ProductPricingDTO[];
  private plans: SubscriptionPlanDTO[];
  private subscriptions: ClientSubscriptionDTO[];
  private invoices: InvoiceDTO[];

  constructor() {
    this.products = [...FIXTURE_PRODUCTS];
    this.plans = [...FIXTURE_PLANS];
    this.subscriptions = [...FIXTURE_SUBSCRIPTIONS];
    this.invoices = [...FIXTURE_INVOICES];
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProds = localStorage.getItem('lyberate_finance_products');
      if (storedProds) {
        try { this.products = JSON.parse(storedProds); } catch { this.products = [...FIXTURE_PRODUCTS]; }
      }
      const storedPlans = localStorage.getItem('lyberate_finance_plans');
      if (storedPlans) {
        try { this.plans = JSON.parse(storedPlans); } catch { this.plans = [...FIXTURE_PLANS]; }
      }
      const storedSubs = localStorage.getItem('lyberate_finance_subscriptions');
      if (storedSubs) {
        try { this.subscriptions = JSON.parse(storedSubs); } catch { this.subscriptions = [...FIXTURE_SUBSCRIPTIONS]; }
      }
      const storedInvoices = localStorage.getItem('lyberate_finance_invoices');
      if (storedInvoices) {
        try { this.invoices = JSON.parse(storedInvoices); } catch { this.invoices = [...FIXTURE_INVOICES]; }
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('lyberate_finance_products', JSON.stringify(this.products));
      localStorage.setItem('lyberate_finance_plans', JSON.stringify(this.plans));
      localStorage.setItem('lyberate_finance_subscriptions', JSON.stringify(this.subscriptions));
      localStorage.setItem('lyberate_finance_invoices', JSON.stringify(this.invoices));
    }
  }

  // --- KPIs y Métricas ---

  getFinancialSummary(): FinancialSummary {
    const activeSubs = this.subscriptions.filter((s) => s.status === 'active');
    const mrrUsd = activeSubs.reduce((acc, s) => {
      return acc + (s.billingFrequency === 'yearly' ? Math.round(s.amountUsd / 12) : s.amountUsd);
    }, 0);
    const arrUsd = mrrUsd * 12;

    const totalInvoicedUsd = this.invoices.reduce((acc, i) => acc + i.amountUsd, 0);
    const totalCollectedUsd = this.invoices
      .filter((i) => i.status === 'paid')
      .reduce((acc, i) => acc + i.amountUsd, 0);
    const pendingCollectionUsd = this.invoices
      .filter((i) => i.status === 'pending')
      .reduce((acc, i) => acc + i.amountUsd, 0);

    const nowIso = new Date().toISOString().split('T')[0];
    const overdueCount = this.invoices.filter(
      (i) => i.status === 'pending' && i.dueDate < nowIso
    ).length;

    return {
      mrrUsd,
      arrUsd,
      totalInvoicedUsd,
      totalCollectedUsd,
      pendingCollectionUsd,
      activeSubscriptionsCount: activeSubs.length,
      overdueInvoicesCount: overdueCount,
    };
  }

  // --- Productos ---
  getProducts(): ProductPricingDTO[] {
    return [...this.products];
  }

  createProduct(data: Partial<ProductPricingDTO>): ProductPricingDTO {
    const newProd: ProductPricingDTO = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: data.name?.trim() || 'Nuevo Servicio',
      category: data.category || 'web',
      tagline: data.tagline?.trim() || '',
      basePriceUsd: data.basePriceUsd || 1000,
      billingType: data.billingType || 'one_time',
      description: data.description?.trim() || '',
      deliverables: data.deliverables || [],
      isAvailable: true,
    };
    this.products.push(newProd);
    this.saveState();
    return newProd;
  }

  // --- Planes ---
  getPlans(): SubscriptionPlanDTO[] {
    return [...this.plans];
  }

  createPlan(data: Partial<SubscriptionPlanDTO>): SubscriptionPlanDTO {
    const newPlan: SubscriptionPlanDTO = {
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      productId: data.productId || 'prod-saas-chat',
      productName: data.productName || 'LyberateDesk / LyberateChat',
      planName: data.planName?.trim() || 'Nuevo Plan',
      priceMonthlyUsd: data.priceMonthlyUsd || 49,
      priceYearlyUsd: data.priceYearlyUsd || (data.priceMonthlyUsd ? data.priceMonthlyUsd * 10 : 490),
      features: data.features || [],
      isActive: true,
    };
    this.plans.push(newPlan);
    this.saveState();
    return newPlan;
  }

  // --- Suscripciones ---
  getSubscriptions(): ClientSubscriptionDTO[] {
    return [...this.subscriptions];
  }

  createSubscription(data: Partial<ClientSubscriptionDTO>): ClientSubscriptionDTO {
    const newSub: ClientSubscriptionDTO = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      clientId: data.clientId || '',
      clientName: data.clientName || 'Cliente',
      planId: data.planId || '',
      planName: data.planName || 'Plan Estándar',
      productName: data.productName || 'Servicio Recurrente',
      billingFrequency: data.billingFrequency || 'monthly',
      amountUsd: data.amountUsd || 49,
      status: 'active',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      nextRenewalDate: data.nextRenewalDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      assignedPartner: data.assignedPartner || 'Valdez',
    };
    this.subscriptions.unshift(newSub);
    this.saveState();
    return newSub;
  }

  // --- Facturas ---
  getInvoices(): InvoiceDTO[] {
    return [...this.invoices];
  }

  createInvoice(data: Partial<InvoiceDTO>): InvoiceDTO {
    const nextNum = `INV-2026-00${this.invoices.length + 1}`;
    const newInv: InvoiceDTO = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      invoiceNumber: data.invoiceNumber || nextNum,
      clientId: data.clientId || '',
      clientName: data.clientName || 'Cliente',
      concept: data.concept?.trim() || 'Servicios de Ingeniería de Software',
      amountUsd: data.amountUsd || 1000,
      status: data.status || 'pending',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    };
    this.invoices.unshift(newInv);
    this.saveState();

    // Registrar en el CRM
    crmRepository.logActivity({
      clientId: newInv.clientId,
      clientName: newInv.clientName,
      type: 'proposal',
      title: `Factura generada: ${newInv.invoiceNumber} por $${newInv.amountUsd} USD`,
      description: `Concepto: ${newInv.concept}`,
      author: 'Finanzas Lyberate',
    });

    return newInv;
  }

  markInvoicePaid(id: string, method: InvoiceDTO['paymentMethod'] = 'transfer'): InvoiceDTO {
    const index = this.invoices.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Factura ${id} no encontrada.`);

    const updated: InvoiceDTO = {
      ...this.invoices[index],
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: method,
    };

    this.invoices[index] = updated;
    this.saveState();

    // Registrar cobro en bitácora de actividad
    crmRepository.logActivity({
      clientId: updated.clientId,
      clientName: updated.clientName,
      type: 'note',
      title: `Cobro liquidado: ${updated.invoiceNumber} ($${updated.amountUsd} USD)`,
      description: `Medio de pago registrado: ${(updated.paymentMethod || 'transfer').toUpperCase()}`,
      author: 'Finanzas Lyberate',
    });

    return updated;
  }

  exportInvoicesToCsv(): string {
    const headers = ['Factura', 'Cliente', 'Concepto', 'Monto (USD)', 'Estado', 'Fecha Emisión', 'Fecha Vencimiento', 'Fecha Pago', 'Método'];
    const rows = this.invoices.map((i) => [
      i.invoiceNumber,
      `"${i.clientName}"`,
      `"${i.concept}"`,
      i.amountUsd,
      i.status,
      i.issueDate,
      i.dueDate,
      i.paidDate || '',
      i.paymentMethod || '',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  resetToDefault(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('lyberate_finance_products');
      localStorage.removeItem('lyberate_finance_plans');
      localStorage.removeItem('lyberate_finance_subscriptions');
      localStorage.removeItem('lyberate_finance_invoices');
    }
    this.products = JSON.parse(JSON.stringify(FIXTURE_PRODUCTS));
    this.plans = JSON.parse(JSON.stringify(FIXTURE_PLANS));
    this.subscriptions = JSON.parse(JSON.stringify(FIXTURE_SUBSCRIPTIONS));
    this.invoices = JSON.parse(JSON.stringify(FIXTURE_INVOICES));
  }
}

export const financeRepository = new FinanceRepository();
