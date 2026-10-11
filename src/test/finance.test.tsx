import { describe, it, expect, beforeEach } from 'vitest';
import { financeRepository } from '../repositories/financeRepository';
import { profileRepository } from '../repositories/profileRepository';
import { automationRepository } from '../repositories/automationRepository';
import { crmRepository } from '../repositories/crmRepository';

describe('Finanzas, Planes SaaS, Perfiles & Automatizaciones (Fase 07)', () => {
  beforeEach(() => {
    financeRepository.resetToDefault();
    profileRepository.resetToDefault();
    crmRepository.resetToDefault();
  });

  describe('Motor Financiero & Facturación (financeRepository)', () => {
    it('debe calcular métricas agregadas de MRR, ARR y facturación histórica', () => {
      const summary = financeRepository.getFinancialSummary();

      // 3 suscripciones activas (Orgemac $129 + Pink Fashion $79 + Noticia $49 = $257 MRR)
      expect(summary.activeSubscriptionsCount).toBe(3);
      expect(summary.mrrUsd).toBe(257);
      expect(summary.arrUsd).toBe(257 * 12);
      expect(summary.totalCollectedUsd).toBeGreaterThan(0);
      expect(summary.pendingCollectionUsd).toBeGreaterThan(0);
    });

    it('debe registrar una nueva factura y vincularla a la bitácora del CRM', () => {
      const invoice = financeRepository.createInvoice({
        clientId: 'cli-metropolis',
        clientName: 'Logística Metrópolis',
        concept: 'Licenciamiento Anual Plataforma TMS & Rastreo',
        amountUsd: 8500,
        status: 'pending',
      });

      expect(invoice.id).toBeDefined();
      expect(invoice.invoiceNumber).toBeDefined();
      expect(invoice.amountUsd).toBe(8500);

      // Verificar que se incrementó la lista de facturas
      expect(financeRepository.getInvoices().length).toBe(7);

      // Verificar que se registró en la bitácora del CRM
      const activities = crmRepository.getActivities();
      const invActivity = activities.find((a) => a.title.includes(invoice.invoiceNumber));
      expect(invActivity).toBeDefined();
    });

    it('debe marcar una factura como pagada y registrar medio de pago', () => {
      const invoiceId = 'inv-5'; // Pink Fashion saldo pendiente
      const paid = financeRepository.markInvoicePaid(invoiceId, 'zelle');

      expect(paid.status).toBe('paid');
      expect(paid.paidDate).toBeDefined();
      expect(paid.paymentMethod).toBe('zelle');

      // Resumen financiero actualizado
      const summary = financeRepository.getFinancialSummary();
      expect(summary.pendingCollectionUsd).toBe(2500); // Sólo queda Metrópolis pendiente
    });

    it('debe crear un nuevo plan de suscripción para LyberateDesk', () => {
      const plan = financeRepository.createPlan({
        planName: 'Agencias & Partners',
        productId: 'prod-saas-chat',
        priceMonthlyUsd: 149,
        features: ['Hasta 10 agentes', 'Multi-tenant WhatsApp', 'Marca blanca'],
      });

      expect(plan.id).toBeDefined();
      expect(plan.planName).toBe('Agencias & Partners');
      expect(financeRepository.getPlans().length).toBe(6);
    });

    it('debe exportar el libro de facturación a formato CSV', () => {
      const csv = financeRepository.exportInvoicesToCsv();
      expect(csv).toContain('Factura,Cliente,Concepto,Monto (USD),Estado');
      expect(csv).toContain('INV-2026-001');
      expect(csv).toContain('Orgemac Comercial');
    });
  });

  describe('Personalización de Perfiles Full-Stack (profileRepository)', () => {
    it('debe proveer los perfiles de los dos socios fundadores', () => {
      const profiles = profileRepository.getProfiles();
      expect(profiles.length).toBe(2);

      const valdez = profileRepository.getProfileById('valdez');
      expect(valdez?.name).toBe('Valdez');
      expect(valdez?.roleTitle).toContain('desarrollo digital');
      expect(valdez?.specialties).toContain('React 19 & TypeScript');

      const socio = profileRepository.getProfileById('socio');
      expect(socio?.name).toBe('Socio Fundador');
      expect(socio?.roleTitle).toContain('diseño de producto');
    });

    it('debe actualizar los datos de un perfil y persistir cambios', () => {
      const updated = profileRepository.updateProfile('valdez', {
        roleTitle: 'Full-Stack Architecture Director & Founder',
        bio: 'Supervisión técnica integral de soluciones empresariales.',
      });

      expect(updated.roleTitle).toBe('Full-Stack Architecture Director & Founder');
      expect(profileRepository.getProfileById('valdez')?.roleTitle).toBe(
        'Full-Stack Architecture Director & Founder'
      );
    });
  });

  describe('Generador y Despachador Automatizado (automationRepository)', () => {
    it('debe cargar las 5 plantillas pre-configuradas', () => {
      const templates = automationRepository.getTemplates();
      expect(templates.length).toBe(5);

      const proposal = templates.find((t) => t.category === 'proposal');
      expect(proposal).toBeDefined();
      expect(proposal?.variables).toContain('{{cliente}}');
      expect(proposal?.variables).toContain('{{monto_usd}}');
    });

    it('debe reemplazar variables dinámicas en texto de Correo y WhatsApp', () => {
      const rendered = automationRepository.renderTemplate('tpl-proposal', {
        cliente: 'Carlos Mendoza',
        empresa: 'Orgemac C.A.',
        proyecto: 'Portal B2B Sagitta',
        monto_usd: '9800',
        socio: 'Valdez',
      });

      expect(rendered.subject).toContain('Portal B2B Sagitta');
      expect(rendered.bodyEmail).toContain('Carlos Mendoza');
      expect(rendered.bodyEmail).toContain('$ 9800 USD');
      expect(rendered.bodyEmail).toContain('Valdez');

      expect(rendered.bodyWhatsApp).toContain('*$ 9800 USD*');
      expect(rendered.bodyWhatsApp).toContain('*Orgemac C.A.*');
    });

    it('debe registrar el despacho en el log y sincronizar en el CRM', () => {
      const log = automationRepository.logDispatch({
        templateId: 'tpl-onboarding',
        templateName: 'Bienvenida',
        channel: 'whatsapp',
        clientId: 'cli-pinkfashion',
        clientName: 'Pink Fashion VE',
        recipientContact: '+58 414 772 3344',
        renderedContent: '¡Bienvenido al sistema!',
      });

      expect(log.id).toBeDefined();
      expect(automationRepository.getLogs().length).toBe(1);

      // Sincronización en bitácora de actividad CRM
      const activities = crmRepository.getActivities();
      const synced = activities.find((a) => a.title.includes('WhatsApp'));
      expect(synced).toBeDefined();
    });
  });
});
