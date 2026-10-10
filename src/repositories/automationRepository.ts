import { crmRepository } from './crmRepository';
import { securityRepository } from './securityRepository';
import {
  MessageTemplateDTO,
  DispatchLogDTO,
  WorkflowRule,
  WebhookDeliveryLogDTO,
  WorkflowExecutionResult,
} from '../types/automations';

export type {
  MessageTemplateDTO,
  DispatchLogDTO,
  WorkflowRule,
  WebhookDeliveryLogDTO,
  WorkflowExecutionResult,
};

const DEFAULT_TEMPLATES: MessageTemplateDTO[] = [
  {
    id: 'tpl-proposal',
    name: 'Envío de Propuesta & Presupuesto Comercial',
    category: 'proposal',
    labelBadge: 'Propuesta',
    subject: 'Propuesta Técnica y Comercial Lyberate — {{proyecto}}',
    bodyEmail: `Hola {{cliente}},\n\nUn gusto saludarte. Desde el equipo de Lyberate hemos preparado la propuesta de arquitectura y desarrollo a medida para {{empresa}} correspondiente al proyecto "{{proyecto}}".\n\nEl alcance incluye:\n• Arquitectura de alto rendimiento y diseño a medida\n• Seguridad de datos y despliegue en producción\n• Soporte post-lanzamiento garantizado\n\nInversión estimada: $ {{monto_usd}} USD.\n\nPuedes revisar los detalles o coordinar una llamada de ajuste con nosotros cuando gustes.\n\nAtentamente,\n{{socio}}\nLyberate Engineering`,
    bodyWhatsApp: `¡Hola {{cliente}}! 👋 Te saluda {{socio}} de *Lyberate*. Te escribo para comentarte que ya tenemos lista la propuesta técnica para *{{empresa}}* (Proyecto: {{proyecto}}).\n\n💰 Presupuesto estimado: *$ {{monto_usd}} USD*\n\n¿Te parece bien si la revisamos juntos hoy o mañana? Quedo atento a tus comentarios. 🚀`,
    variables: ['{{cliente}}', '{{empresa}}', '{{proyecto}}', '{{monto_usd}}', '{{socio}}'],
  },
  {
    id: 'tpl-onboarding',
    name: 'Bienvenida & Arranque de Proyecto',
    category: 'onboarding',
    labelBadge: 'Bienvenida',
    subject: '¡Bienvenido a Lyberate! Arranque del proyecto {{proyecto}}',
    bodyEmail: `Estimado(a) {{cliente}},\n\nEs un placer comenzar formalmente el desarrollo de "{{proyecto}}" para {{empresa}}.\n\nHemos configurado el entorno de trabajo y nuestro cronograma de entregas. Tu responsable asignado es {{socio}}, quien estará en comunicación continua contigo.\n\nPróximos pasos:\n1. Levantamiento de requerimientos iniciales\n2. Primera demostración de prototipo navegable\n\nCualquier consulta estamos a tu entera disposición.\n\nSaludos cordiales,\n{{socio}} | Lyberate`,
    bodyWhatsApp: `¡Hola {{cliente}}! 🎉 En *Lyberate* estamos muy contentos de iniciar el proyecto *{{proyecto}}* para *{{empresa}}*. \n\nSoy {{socio}} y seré tu punto de contacto directo durante todo el desarrollo. Ya arrancamos la primera fase y pronto te compartiré los primeros avances navegables. ¡Seguimos en contacto! 💻✨`,
    variables: ['{{cliente}}', '{{empresa}}', '{{proyecto}}', '{{socio}}'],
  },
  {
    id: 'tpl-milestone',
    name: 'Reporte de Hito de Desarrollo Completado',
    category: 'milestone',
    labelBadge: 'Avance',
    subject: 'Actualización de Avance: Hito completado en {{proyecto}}',
    bodyEmail: `Hola {{cliente}},\n\nTe escribo para informarte que hemos completado con éxito el nuevo hito de desarrollo para {{empresa}} en el sistema "{{proyecto}}".\n\nLas funcionalidades implementadas han sido probadas y verificadas bajo nuestros estándares de calidad.\n\nPuedes verificar el avance en tu entorno de prueba. Quedamos atentos a tus impresiones.\n\nUn cordial saludo,\n{{socio}}`,
    bodyWhatsApp: `¡Hola {{cliente}}! 👋 Te tengo buenas noticias: acabamos de finalizar un nuevo hito clave en *{{proyecto}}* para *{{empresa}}*. ✅\n\nTodo quedó probado y listo para que le eches un vistazo. Avísame cuando tengas un momento para que lo revisemos juntos. 📱`,
    variables: ['{{cliente}}', '{{empresa}}', '{{proyecto}}', '{{socio}}'],
  },
  {
    id: 'tpl-payment',
    name: 'Recordatorio Amigable de Facturación / Pago',
    category: 'payment',
    labelBadge: 'Cobranza',
    subject: 'Facturación correspondiente a hito — {{proyecto}}',
    bodyEmail: `Hola {{cliente}},\n\nEsperamos que todo vaya excelente. Te hacemos llegar la notificación de cobro correspondiente al hito acordado de "{{proyecto}}" por un importe de $ {{monto_usd}} USD.\n\nAdjuntamos las coordenadas de pago (Zelle, transferencia nacional o USDT). Una vez realizado el desembolso, agradecemos nos compartas el comprobante para emitir tu recibo formal.\n\nSaludos cordiales,\n{{socio}}`,
    bodyWhatsApp: `Hola {{cliente}} 👋 Te escribo cordialmente para compartirte la información del hito culminado de *{{proyecto}}* ($ {{monto_usd}} USD). \n\nAvísame cuando tengas oportunidad para enviarte los datos de pago disponibles. ¡Muchas gracias por tu confianza! 🤝`,
    variables: ['{{cliente}}', '{{empresa}}', '{{proyecto}}', '{{monto_usd}}', '{{socio}}'],
  },
  {
    id: 'tpl-delivery',
    name: 'Entrega Final & Cierre de Proyecto',
    category: 'delivery',
    labelBadge: 'Entrega',
    subject: 'Entrega Final y Despliegue en Producción — {{proyecto}}',
    bodyEmail: `Estimado(a) {{cliente}},\n\nNos complace informarte que hemos desplegado con éxito en el entorno de producción definitivo el sistema "{{proyecto}}" de {{empresa}}.\n\nTodas las verificaciones de rendimiento, seguridad de datos y compatibilidad móvil han sido superadas.\n\nA partir de este momento entra en vigencia tu periodo de garantía y acompañamiento técnico.\n\nHa sido un honor colaborar juntos,\n{{socio}}\nEquipo Lyberate`,
    bodyWhatsApp: `¡Misión cumplida {{cliente}}! 🚀 Acabamos de poner en producción definitiva el sistema *{{proyecto}}* para *{{empresa}}*. Todo el código y los servidores quedaron 100% operativos. ¡Muchísimas gracias por confiar en nosotros! 🥳👏`,
    variables: ['{{cliente}}', '{{empresa}}', '{{proyecto}}', '{{socio}}'],
  },
];

const DEFAULT_WORKFLOWS: WorkflowRule[] = [
  {
    id: 'wf-lead-welcome',
    name: 'Recepción Automática de Leads & Notificación Interna',
    description: 'Registra el contacto web en bitácora y genera una tarea de seguimiento comercial prioritaria.',
    trigger: 'lead_created',
    conditions: [],
    actions: [
      {
        type: 'create_crm_task',
        description: 'Crear tarea en CRM: Contactar a cliente potencial en menos de 24 horas',
      },
      {
        type: 'log_security_audit',
        description: 'Registrar captura autorizada en bitácora de auditoría',
      },
    ],
    owner: 'Valdez',
    status: 'active',
    requiresHumanConfirmation: false,
    rateLimitPerHour: 30,
    executionStats: {
      totalRuns: 14,
      successfulRuns: 14,
      failedRuns: 0,
      lastRunAt: '2026-10-10T08:00:00Z',
      lastExecutionLog: 'Lead procesado. Tarea asignada en CRM.',
    },
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'wf-deal-won',
    name: 'Onboarding de Cliente & Sincronización de Entorno',
    description: 'Prepara el correo de arranque y notifica al webhook perimetral al cerrar una venta.',
    trigger: 'deal_won',
    conditions: [
      {
        field: 'stage',
        operator: 'equals',
        value: 'won',
      },
    ],
    actions: [
      {
        type: 'send_email',
        templateId: 'tpl-onboarding',
        description: 'Preparar correo de bienvenida y arranque de proyecto',
      },
      {
        type: 'call_webhook',
        targetId: 'wh-deploy',
        description: 'Disparar webhook a Cloudflare para aprovisionamiento perimetral',
      },
      {
        type: 'log_security_audit',
        description: 'Registrar formalización de contrato en auditoría de seguridad',
      },
    ],
    owner: 'Valdez',
    status: 'active',
    requiresHumanConfirmation: true, // Requiere aprobación humana para prevenir disparos accidentales
    rateLimitPerHour: 10,
    executionStats: {
      totalRuns: 6,
      successfulRuns: 6,
      failedRuns: 0,
      lastRunAt: '2026-10-09T18:00:00Z',
      lastExecutionLog: 'Aprobación manual confirmada por Valdez. Webhook despachado (HTTP 200).',
    },
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-09T18:00:00Z',
  },
  {
    id: 'wf-invoice-issued',
    name: 'Notificación de Factura Emitida & Recordatorio de Cobranza',
    description: 'Genera tarea de comprobación de pago al emitir una nueva factura de servicios o hito.',
    trigger: 'invoice_issued',
    conditions: [
      {
        field: 'amountUsd',
        operator: 'greater_than',
        value: 0,
      },
    ],
    actions: [
      {
        type: 'create_crm_task',
        description: 'Crear tarea en CRM: Verificar conciliación bancaria a los 5 días de emitida la factura',
      },
      {
        type: 'log_security_audit',
        description: 'Registrar emisión de documento contable en bitácora',
      },
    ],
    owner: 'Socio Fundador',
    status: 'active',
    requiresHumanConfirmation: false,
    rateLimitPerHour: 20,
    executionStats: {
      totalRuns: 8,
      successfulRuns: 8,
      failedRuns: 0,
      lastRunAt: '2026-10-10T07:30:00Z',
      lastExecutionLog: 'Factura registrada. Tarea de conciliación programada.',
    },
    createdAt: '2026-09-01T11:00:00Z',
    updatedAt: '2026-10-10T07:30:00Z',
  },
  {
    id: 'wf-site-incident',
    name: 'Alerta Perimetral por Incidencia Crítica en Sitio Web',
    description: 'Registra evento de emergencia perimetral y purga caché en CDN ante caídas reportadas.',
    trigger: 'site_incident_reported',
    conditions: [
      {
        field: 'severity',
        operator: 'equals',
        value: 'critical',
      },
    ],
    actions: [
      {
        type: 'call_webhook',
        targetId: 'wh-deploy',
        description: 'Disparar orden perimetral de purga y reinicio de ruta en Cloudflare CDN',
      },
      {
        type: 'log_security_audit',
        description: 'Registrar evento de incidencia crítica de infraestructura en auditoría',
      },
    ],
    owner: 'Valdez',
    status: 'active',
    requiresHumanConfirmation: false,
    rateLimitPerHour: 15,
    executionStats: {
      totalRuns: 2,
      successfulRuns: 2,
      failedRuns: 0,
      lastRunAt: '2026-10-08T14:22:00Z',
      lastExecutionLog: 'Purga de CDN ejecutada exitosamente tras resolución de alerta.',
    },
    createdAt: '2026-09-10T15:00:00Z',
    updatedAt: '2026-10-08T14:22:00Z',
  },
];

const DEFAULT_WEBHOOK_LOGS: WebhookDeliveryLogDTO[] = [
  {
    id: 'whlog-01',
    webhookId: 'wh-deploy',
    webhookName: 'Notificación de Despliegue Cloudflare',
    event: 'deployment.succeeded',
    targetUrl: 'https://lyberate.com/api/webhooks/deploy-status',
    payloadSanitized: { deploymentId: 'dep-992a', environment: 'production', status: 'ready' },
    signatureHeader: 'sha256=9b81cf2a41d08e5a7b1c3e',
    statusCode: 200,
    durationMs: 78,
    retryCount: 0,
    timestamp: '2026-10-10T08:30:00Z',
    status: 'delivered',
  },
  {
    id: 'whlog-02',
    webhookId: 'wh-lead',
    webhookName: 'Captura Externa de Leads & Contacto',
    event: 'lead.created',
    targetUrl: 'https://lyberate.com/api/webhooks/leads-inbound',
    payloadSanitized: { clientName: 'Orgemac Comercial', source: 'web_contact' },
    signatureHeader: 'sha256=110e543ca78f90bb34e12c',
    statusCode: 200,
    durationMs: 95,
    retryCount: 0,
    timestamp: '2026-10-09T18:40:00Z',
    status: 'delivered',
  },
];

export class AutomationRepository {
  private templates: MessageTemplateDTO[];
  private dispatchLogs: DispatchLogDTO[];
  private workflows: WorkflowRule[];
  private webhookLogs: WebhookDeliveryLogDTO[];
  private executionHistoryTimestamps: Map<string, number[]> = new Map();

  constructor() {
    this.templates = [...DEFAULT_TEMPLATES];
    this.dispatchLogs = [];
    this.workflows = JSON.parse(JSON.stringify(DEFAULT_WORKFLOWS));
    this.webhookLogs = JSON.parse(JSON.stringify(DEFAULT_WEBHOOK_LOGS));
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('lyberate_msg_templates');
      if (stored) {
        try {
          this.templates = JSON.parse(stored);
        } catch {
          this.templates = [...DEFAULT_TEMPLATES];
        }
      }
      const logs = localStorage.getItem('lyberate_dispatch_logs');
      if (logs) {
        try {
          this.dispatchLogs = JSON.parse(logs);
        } catch {
          this.dispatchLogs = [];
        }
      }
      const wf = localStorage.getItem('lyberate_workflows');
      if (wf) {
        try {
          this.workflows = JSON.parse(wf);
        } catch {
          this.workflows = JSON.parse(JSON.stringify(DEFAULT_WORKFLOWS));
        }
      }
      const whLogs = localStorage.getItem('lyberate_webhook_logs');
      if (whLogs) {
        try {
          this.webhookLogs = JSON.parse(whLogs);
        } catch {
          this.webhookLogs = JSON.parse(JSON.stringify(DEFAULT_WEBHOOK_LOGS));
        }
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('lyberate_msg_templates', JSON.stringify(this.templates));
      localStorage.setItem('lyberate_dispatch_logs', JSON.stringify(this.dispatchLogs));
      localStorage.setItem('lyberate_workflows', JSON.stringify(this.workflows));
      localStorage.setItem('lyberate_webhook_logs', JSON.stringify(this.webhookLogs));
    }
  }

  // --- Plantillas & Despacho ---

  getTemplates(): MessageTemplateDTO[] {
    return [...this.templates];
  }

  getTemplateById(id: string): MessageTemplateDTO | undefined {
    return this.templates.find((t) => t.id === id);
  }

  renderTemplate(
    templateId: string,
    variables: Record<string, string>
  ): { subject: string; bodyEmail: string; bodyWhatsApp: string } {
    const tpl = this.getTemplateById(templateId);
    if (!tpl) throw new Error('Plantilla no encontrada');

    let renderedSubject = tpl.subject;
    let renderedEmail = tpl.bodyEmail;
    let renderedWA = tpl.bodyWhatsApp;

    Object.entries(variables).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      renderedSubject = renderedSubject.replace(regex, val || '');
      renderedEmail = renderedEmail.replace(regex, val || '');
      renderedWA = renderedWA.replace(regex, val || '');
    });

    return {
      subject: renderedSubject,
      bodyEmail: renderedEmail,
      bodyWhatsApp: renderedWA,
    };
  }

  logDispatch(data: Omit<DispatchLogDTO, 'id' | 'timestamp'>): DispatchLogDTO {
    const newLog: DispatchLogDTO = {
      id: `disp-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...data,
    };

    this.dispatchLogs.unshift(newLog);
    if (this.dispatchLogs.length > 50) this.dispatchLogs.pop();
    this.saveState();

    crmRepository.logActivity({
      clientId: data.clientId,
      clientName: data.clientName,
      type: data.channel === 'email' ? 'email' : 'call',
      title: `Envío automatizado (${data.channel === 'email' ? 'Correo' : 'WhatsApp'}): ${data.templateName}`,
      description: `Mensaje despachado a ${data.recipientContact}`,
      author: 'Lyberate Automations',
    });

    return newLog;
  }

  getLogs(): DispatchLogDTO[] {
    return [...this.dispatchLogs];
  }

  // --- Workflows & Conectores ---

  getWorkflows(): WorkflowRule[] {
    return [...this.workflows];
  }

  getWorkflowById(id: string): WorkflowRule | undefined {
    return this.workflows.find((w) => w.id === id);
  }

  toggleWorkflowStatus(id: string): WorkflowRule {
    const wf = this.workflows.find((w) => w.id === id);
    if (!wf) throw new Error(`Workflow ${id} no encontrado.`);

    wf.status = wf.status === 'active' ? 'paused' : 'active';
    wf.updatedAt = new Date().toISOString();
    this.saveState();

    securityRepository.logAuditEvent({
      action: 'WORKFLOW_STATUS_TOGGLE',
      module: 'automations',
      actor: 'Valdez',
      actorRole: securityRepository.getActiveRole(),
      status: 'executed',
      detailsSanitized: `Flujo [${wf.name}] actualizado a estado [${wf.status}].`,
    });

    return wf;
  }

  /**
   * Ejecuta un flujo automatizado evaluando disparador, condiciones, confirmación humana y límites de tasa.
   */
  executeWorkflow(
    workflowId: string,
    payload: Record<string, any> = {},
    confirmedByHuman = false
  ): WorkflowExecutionResult {
    const wf = this.getWorkflowById(workflowId);
    if (!wf) {
      return {
        workflowId,
        workflowName: 'Desconocido',
        status: 'failed',
        executedActionsCount: 0,
        message: 'Flujo no encontrado.',
        logs: ['Error: Flujo inexistente.'],
      };
    }

    if (wf.status !== 'active') {
      return {
        workflowId: wf.id,
        workflowName: wf.name,
        status: 'failed',
        executedActionsCount: 0,
        message: `El flujo se encuentra en estado "${wf.status}". No se ejecutó.`,
        logs: [`Flujo inactivo (${wf.status}).`],
      };
    }

    // 1. Verificación de tasa (Loop Prevention / Rate Limiting)
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const history = this.executionHistoryTimestamps.get(wf.id) || [];
    const recentRuns = history.filter((t) => t > oneHourAgo);

    if (recentRuns.length >= wf.rateLimitPerHour) {
      return {
        workflowId: wf.id,
        workflowName: wf.name,
        status: 'rate_limited',
        executedActionsCount: 0,
        message: `Límite por hora alcanzado (${wf.rateLimitPerHour}/hora) para prevenir bucles.`,
        logs: ['Ejecución bloqueada por política anti-bucles.'],
      };
    }

    // 2. Verificación de condiciones
    if (wf.conditions && wf.conditions.length > 0) {
      for (const cond of wf.conditions) {
        const val = payload[cond.field];
        if (cond.operator === 'equals' && val !== cond.value) {
          return {
            workflowId: wf.id,
            workflowName: wf.name,
            status: 'condition_unmet',
            executedActionsCount: 0,
            message: `Condición no cumplida: ${cond.field} (${val}) !== ${cond.value}.`,
            logs: [`Condición omitida para el campo ${cond.field}.`],
          };
        }
        if (cond.operator === 'greater_than' && !(Number(val) > Number(cond.value))) {
          return {
            workflowId: wf.id,
            workflowName: wf.name,
            status: 'condition_unmet',
            executedActionsCount: 0,
            message: `Condición no cumplida: ${cond.field} (${val}) no es mayor a ${cond.value}.`,
            logs: [`Condición numérica omitida para ${cond.field}.`],
          };
        }
      }
    }

    // 3. Verificación de compuerta de confirmación humana (Human Confirmation Gate)
    if (wf.requiresHumanConfirmation && !confirmedByHuman) {
      return {
        workflowId: wf.id,
        workflowName: wf.name,
        status: 'blocked_by_confirmation',
        executedActionsCount: 0,
        message: `Esta acción tiene impacto externo crítico y requiere confirmación explícita del socio (${wf.owner}).`,
        logs: ['Esperando autorización humana del administrador.'],
      };
    }

    // 4. Ejecución de acciones
    const logs: string[] = [];
    let executedCount = 0;

    wf.actions.forEach((act) => {
      if (act.type === 'log_security_audit') {
        securityRepository.logAuditEvent({
          action: 'WORKFLOW_ACTION_EXECUTE',
          module: 'automations',
          actor: wf.owner,
          actorRole: securityRepository.getActiveRole(),
          status: 'executed',
          detailsSanitized: `Acción [${act.description}] del flujo [${wf.name}] completada.`,
        });
        logs.push(`Auditoría registrada: ${act.description}`);
        executedCount++;
      } else if (act.type === 'create_crm_task') {
        crmRepository.createTask({
          title: `[Auto-Workflow] ${wf.name}`,
          assignedTo: wf.owner,
          priority: 'high',
          status: 'pending',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          notes: `Generada automáticamente por el flujo ${wf.id}`,
        });
        logs.push(`Tarea generada en CRM: ${act.description}`);
        executedCount++;
      } else if (act.type === 'call_webhook') {
        this.dispatchWebhook(act.targetId || 'wh-deploy', wf.trigger, payload);
        logs.push(`Webhook invocado (${act.targetId}): ${act.description}`);
        executedCount++;
      } else if (act.type === 'send_email' || act.type === 'send_whatsapp') {
        logs.push(`Plantilla preparada para despacho: ${act.description}`);
        executedCount++;
      }
    });

    // Registrar estadísticas
    recentRuns.push(now);
    this.executionHistoryTimestamps.set(wf.id, recentRuns);

    wf.executionStats.totalRuns++;
    wf.executionStats.successfulRuns++;
    wf.executionStats.lastRunAt = new Date().toISOString();
    wf.executionStats.lastExecutionLog = logs.join(' | ');
    this.saveState();

    return {
      workflowId: wf.id,
      workflowName: wf.name,
      status: 'executed',
      executedActionsCount: executedCount,
      message: `Flujo ejecutado exitosamente (${executedCount} acciones completadas).`,
      logs,
    };
  }

  // --- Webhooks & Trazabilidad ---

  getWebhookDeliveryLogs(): WebhookDeliveryLogDTO[] {
    return [...this.webhookLogs];
  }

  dispatchWebhook(
    webhookId: string,
    event: string,
    payload: Record<string, any>
  ): WebhookDeliveryLogDTO {
    // Sanitizar payload eliminando credenciales
    const sanitizedPayload: Record<string, any> = {};
    Object.entries(payload).forEach(([k, v]) => {
      if (/key|secret|token|password|auth/i.test(k)) {
        sanitizedPayload[k] = '[REDACTED]';
      } else {
        sanitizedPayload[k] = v;
      }
    });

    const timestamp = new Date().toISOString();
    const signatureSeed = `${timestamp}_${webhookId}_${event}`;
    const signatureHeader = `sha256=${Math.abs(
      signatureSeed.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ).toString(16)}`;

    const deliveryLog: WebhookDeliveryLogDTO = {
      id: `whlog-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      webhookId,
      webhookName: webhookId === 'wh-deploy' ? 'Cloudflare Deploy Hook' : 'External Webhook',
      event,
      targetUrl: 'https://api.cloudflare.com/client/v4/pages/webhooks',
      payloadSanitized: sanitizedPayload,
      signatureHeader,
      statusCode: 200,
      durationMs: Math.floor(Math.random() * 80) + 40,
      retryCount: 0,
      timestamp,
      status: 'delivered',
    };

    this.webhookLogs.unshift(deliveryLog);
    if (this.webhookLogs.length > 50) this.webhookLogs.pop();
    this.saveState();

    return deliveryLog;
  }

  resetToDefault(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('lyberate_msg_templates');
      localStorage.removeItem('lyberate_dispatch_logs');
      localStorage.removeItem('lyberate_workflows');
      localStorage.removeItem('lyberate_webhook_logs');
    }
    this.templates = [...DEFAULT_TEMPLATES];
    this.dispatchLogs = [];
    this.workflows = JSON.parse(JSON.stringify(DEFAULT_WORKFLOWS));
    this.webhookLogs = JSON.parse(JSON.stringify(DEFAULT_WEBHOOK_LOGS));
    this.executionHistoryTimestamps.clear();
  }
}

export const automationRepository = new AutomationRepository();
