import { describe, it, expect, beforeEach } from 'vitest';
import { crmRepository } from '../repositories/crmRepository';

describe('Business CRM & Client Pipeline Engine (Phase 06)', () => {
  beforeEach(() => {
    crmRepository.resetToDefault();
  });

  describe('Directorio de Clientes y Cuentas', () => {
    it('debe inicializar el repositorio con los 5 clientes auditados de Centauri', () => {
      const clients = crmRepository.getClients();
      expect(clients.length).toBe(5);

      const orgemac = clients.find((c) => c.id === 'cli-orgemac');
      expect(orgemac).toBeDefined();
      expect(orgemac?.name).toBe('Orgemac Comercial');
      expect(orgemac?.tier).toBe('enterprise');
      expect(orgemac?.managedSiteIds).toContain('site-orgemac');
      expect(orgemac?.portfolioProjectSlug).toBe('orgemac');
      expect(orgemac?.assignedPartner).toBe('Valdez');

      const metropolis = clients.find((c) => c.id === 'cli-metropolis');
      expect(metropolis).toBeDefined();
      expect(metropolis?.tier).toBe('vip');
      expect(metropolis?.status).toBe('lead');
    });

    it('debe crear un nuevo cliente y generar una entrada de actividad en la bitácora', () => {
      const newClient = crmRepository.createClient({
        name: 'Distribuidora San Juan',
        companyName: 'San Juan Logística C.A.',
        contactPerson: 'Elena Méndez',
        email: 'ventas@sanjuan.com',
        phone: '+58 412 111 2233',
        industry: 'Alimentos & Bebidas',
        tier: 'vip',
        status: 'lead',
        assignedPartner: 'Valdez',
        totalContractValueUsd: 15000,
        notes: 'Cliente interesado en portal de despacho y catálogo de preventa.',
      });

      expect(newClient.id).toBeDefined();
      expect(crmRepository.getClients().length).toBe(6);

      const retrieved = crmRepository.getClientById(newClient.id);
      expect(retrieved?.name).toBe('Distribuidora San Juan');
      expect(retrieved?.companyName).toBe('San Juan Logística C.A.');

      // Verificar que se registró la actividad
      const activities = crmRepository.getActivities();
      const creationActivity = activities.find((a) => a.clientId === newClient.id);
      expect(creationActivity).toBeDefined();
      expect(creationActivity?.title).toContain('Cliente creado');
    });

    it('debe actualizar los datos de un cliente existente', () => {
      const updated = crmRepository.updateClient('cli-metropolis', {
        tier: 'enterprise',
        status: 'active',
        totalContractValueUsd: 12500,
        notes: 'Contrato firmado para sistema de rastreo.',
      });

      expect(updated.tier).toBe('enterprise');
      expect(updated.status).toBe('active');
      expect(updated.totalContractValueUsd).toBe(12500);

      const fromRepo = crmRepository.getClientById('cli-metropolis');
      expect(fromRepo?.status).toBe('active');
    });

    it('debe exportar la lista de clientes a formatos CSV y JSON', () => {
      const jsonStr = crmRepository.exportClientsToJson();
      expect(jsonStr).toContain('Orgemac Comercial');
      const parsed = JSON.parse(jsonStr);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(5);

      const csvStr = crmRepository.exportClientsToCsv();
      expect(csvStr).toContain('ID,Nombre,Empresa,Contacto,Email');
      expect(csvStr).toContain('Orgemac Comercial');
      expect(csvStr).toContain('cli-orgemac');
    });

    it('debe eliminar un cliente correctamente', () => {
      const deleted = crmRepository.deleteClient('cli-wilanye');
      expect(deleted).toBe(true);
      expect(crmRepository.getClients().length).toBe(4);
      expect(crmRepository.getClientById('cli-wilanye')).toBeUndefined();
    });
  });

  describe('Pipeline Comercial & Oportunidades (Deals)', () => {
    it('debe listar los 4 deals iniciales con sus respectivas etapas', () => {
      const deals = crmRepository.getDeals();
      expect(deals.length).toBe(4);

      const wonDeals = deals.filter((d) => d.stage === 'won');
      expect(wonDeals.length).toBe(1); // Contacto con la Noticia finalizado

      const activeDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
      expect(activeDeals.length).toBe(3);
    });

    it('debe crear un deal vinculado a un cliente', () => {
      const deal = crmRepository.createDeal({
        title: 'Mantenimiento Preventivo Anual Orgemac',
        clientId: 'cli-orgemac',
        stage: 'proposal',
        priority: 'high',
        valueUsd: 4800,
        probabilityPercent: 70,
        assignedPartner: 'Valdez',
        serviceCategory: 'Soporte Continuo SLA',
        technicalScopeSummary: 'SLA de respuesta rápida y actualizaciones continuas de Cloudflare.',
      });

      expect(deal.id).toBeDefined();
      expect(deal.clientName).toBe('Orgemac Comercial');
      expect(crmRepository.getDeals().length).toBe(5);

      // Actividad registrada
      const activities = crmRepository.getActivities();
      const dealActivity = activities.find((a) => a.dealId === deal.id);
      expect(dealActivity).toBeDefined();
      expect(dealActivity?.title).toContain('Oportunidad creada');
    });

    it('debe transicionar un deal de etapa y reajustar su probabilidad automáticamente', () => {
      const metropolisDeal = crmRepository.getDealById('deal-metropolis-tms');
      expect(metropolisDeal?.stage).toBe('discovery');
      expect(metropolisDeal?.probabilityPercent).toBe(60);

      // Avanzar a propuesta
      const movedToProposal = crmRepository.moveDealStage('deal-metropolis-tms', 'proposal', 'Valdez');
      expect(movedToProposal.stage).toBe('proposal');
      expect(movedToProposal.probabilityPercent).toBe(70);

      // Avanzar a ganada
      const movedToWon = crmRepository.moveDealStage('deal-metropolis-tms', 'won', 'Valdez');
      expect(movedToWon.stage).toBe('won');
      expect(movedToWon.probabilityPercent).toBe(100);

      // Avanzar a perdida
      const movedToLost = crmRepository.moveDealStage('deal-metropolis-tms', 'lost', 'Valdez');
      expect(movedToLost.stage).toBe('lost');
      expect(movedToLost.probabilityPercent).toBe(0);

      // Verificar registro en la bitácora de actividad
      const activities = crmRepository.getActivities();
      const transitionActivity = activities.find(
        (a) => a.dealId === 'deal-metropolis-tms' && a.title.includes('Cambio de etapa')
      );
      expect(transitionActivity).toBeDefined();
    });

    it('debe calcular métricas del pipeline de ventas correctamente', () => {
      const summary = crmRepository.getPipelineSummary();
      expect(summary.totalDeals).toBe(4);
      expect(summary.activeDealsCount).toBe(3);
      expect(summary.wonValueUsd).toBe(11000); // Deal Noticia cerrado ($11,000)
      expect(summary.totalPipelineValueUsd).toBeGreaterThan(0);
      expect(summary.weightedPipelineValueUsd).toBeGreaterThan(0);
      expect(summary.weightedPipelineValueUsd).toBeLessThan(summary.totalPipelineValueUsd);
      expect(summary.winRatePercent).toBe(100); // 1 won, 0 lost
    });
  });

  describe('Tareas y Compromisos Operativos', () => {
    it('debe listar las tareas iniciales y permitir crear una nueva', () => {
      const tasks = crmRepository.getTasks();
      expect(tasks.length).toBe(3);

      const newTask = crmRepository.createTask({
        title: 'Enviar borrador de arquitectura técnica a Metrópolis',
        dealId: 'deal-metropolis-tms',
        clientId: 'cli-metropolis',
        clientName: 'Logística Metrópolis',
        assignedTo: 'Valdez',
        dueDate: '2026-10-18',
        priority: 'high',
        notes: 'Incluir diagrama de arquitectura Flutter y Supabase/PostgreSQL.',
      });

      expect(newTask.id).toBeDefined();
      expect(newTask.status).toBe('pending');
      expect(crmRepository.getTasks().length).toBe(4);
    });

    it('debe actualizar el estado de una tarea y registrar fecha de completado', () => {
      const updated = crmRepository.updateTaskStatus('task-1', 'completed');
      expect(updated.status).toBe('completed');
      expect(updated.completedAt).toBeDefined();

      const reverted = crmRepository.updateTaskStatus('task-1', 'pending');
      expect(reverted.status).toBe('pending');
      expect(reverted.completedAt).toBeUndefined();
    });

    it('debe eliminar una tarea', () => {
      const result = crmRepository.deleteTask('task-2');
      expect(result).toBe(true);
      expect(crmRepository.getTasks().length).toBe(2);
    });
  });

  describe('Bitácora de Actividades (Timeline Audit Trail)', () => {
    it('debe permitir registrar actividades personalizadas y mantener límite de almacenamiento', () => {
      const initialCount = crmRepository.getActivities().length;
      expect(initialCount).toBe(3);

      const activity = crmRepository.logActivity({
        clientId: 'cli-orgemac',
        clientName: 'Orgemac Comercial',
        type: 'email',
        title: 'Envío de resumen mensual de rendimiento',
        description: 'Enviado informe con 99.98% de disponibilidad en Cloudflare.',
        author: 'Valdez',
      });

      expect(activity.id).toBeDefined();
      expect(activity.timestamp).toBeDefined();
      expect(crmRepository.getActivities().length).toBe(4);
    });
  });
});
