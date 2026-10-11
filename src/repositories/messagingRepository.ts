import { MessageItemDTO, MessageChannel, MessageStatus } from '../types/messaging';

const INITIAL_MESSAGES: MessageItemDTO[] = [
  {
    id: 'msg-01',
    channel: 'whatsapp',
    recipientName: 'Carlos Mendoza',
    recipientContact: '+58 412 889 0012',
    companyId: 'cli-orgemac',
    companyName: 'Orgemac C.A.',
    projectId: 'prj-orgemac',
    projectName: 'Plataforma Digital & Catálogo Orgemac',
    subject: 'Avance de catálogo y módulo WhatsApp',
    content: 'Hola Carlos, ya desplegamos la previsualización del catálogo en Cloudflare Pages con respuesta inferior a 180ms. Puedes revisarlo desde el enlace compartido.',
    status: 'delivered_simulated',
    preparedBy: 'Valdez',
    preparedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    simulatedSentAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    simulatedDeliveredAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    simulatedReplyText: 'Excelente Valdez, ya el equipo de ventas lo está probando en teléfonos y carga rapidísimo.',
    simulatedReplyAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    notes: 'Cliente satisfecho con la velocidad del despliegue.',
  },
  {
    id: 'msg-02',
    channel: 'email',
    recipientName: 'Eduardo Rivas',
    recipientContact: 'erivas@metropolis-express.com',
    companyId: 'cli-metropolis',
    companyName: 'MotoIndy Logistics & Despacho',
    projectId: 'prj-motoindy',
    projectName: 'Ecosistema de Despacho & Movilidad MotoIndy',
    subject: 'Contrato y cronograma de hitos para desarrollo de despacho',
    content: 'Estimado Eduardo, adjuntamos la propuesta comercial y borrador del acuerdo de desarrollo para el panel y app de conductores. Quedamos atentos a sus comentarios.',
    status: 'simulated',
    preparedBy: 'Socio Fundador',
    preparedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    simulatedSentAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: 'Enviada versión inicial para revisión con directiva.',
  },
  {
    id: 'msg-03',
    channel: 'telegram',
    recipientName: 'Valeria Gómez',
    recipientContact: '@valeriagomez_pink',
    companyId: 'cli-pinkfashion',
    companyName: 'Pink Fashion Tiendas C.A.',
    subject: 'Confirmación de conciliación de pago móvil',
    content: 'Hola Valeria, confirmamos la recepción y verificación del abono en bolívares (Ref #991024). Tu balance comercial ha sido actualizado en Centauri.',
    status: 'delivered_simulated',
    preparedBy: 'Valdez',
    preparedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    simulatedSentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    simulatedDeliveredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Notificación de conciliación enviada por canal preferido de la clienta.',
  },
];

export const MESSAGE_TEMPLATES = [
  {
    id: 'tpl-welcome',
    name: '1. Bienvenida y Requerimientos',
    channel: 'whatsapp' as MessageChannel,
    subject: 'Bienvenido a Lyberate Software Labs',
    templateText: 'Hola {{nombre}}, un gusto saludarte desde Lyberate. Recibimos tu consulta sobre {{proyecto}}. ¿Tienes 15 minutos hoy o mañana para una breve llamada y definir los requerimientos?',
  },
  {
    id: 'tpl-proposal',
    name: '2. Envío de Propuesta Comercial',
    channel: 'email' as MessageChannel,
    subject: 'Propuesta Técnica y Comercial — Lyberate Software Labs',
    templateText: 'Estimado(a) {{nombre}},\n\nHemos preparado la propuesta para {{proyecto}} en {{empresa}}. El alcance contempla {{alcance}}, con una inversión estimada de {{monto}} y un cronograma de {{semanas}} semanas.\n\nQuedamos a su disposición para coordinar los próximos pasos.',
  },
  {
    id: 'tpl-delivery',
    name: '3. Aviso de Entrega de Hito para Revisión',
    channel: 'whatsapp' as MessageChannel,
    subject: 'Nuevo hito listo para revisión',
    templateText: 'Hola {{nombre}}, te informamos que el hito "{{hito}}" del proyecto {{proyecto}} se encuentra completado y listo para tu revisión. Puedes probarlo y darnos tu retroalimentación.',
  },
  {
    id: 'tpl-payment-confirm',
    name: '4. Confirmación de Pago Conciliado',
    channel: 'email' as MessageChannel,
    subject: 'Comprobante de Pago Conciliado — Lyberate Software Labs',
    templateText: 'Estimado(a) {{nombre}},\n\nHemos verificado el pago por {{monto}} correspondiente al proyecto {{proyecto}} (Referencia: {{referencia}}). Su comprobante digital ya ha sido registrado en Centauri.\n\nGracias por su confianza.',
  },
];

const STORAGE_KEY = 'lyberate_messaging_center';

export class MessagingRepository {
  private messages: MessageItemDTO[] = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.messages = [...INITIAL_MESSAGES];
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.messages = [...INITIAL_MESSAGES];
      this.saveState();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      this.messages = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_MESSAGES];
    } catch {
      this.messages = [...INITIAL_MESSAGES];
    }
  }

  private saveState(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
      window.dispatchEvent(new Event('lyberate-messages-update'));
    }
  }

  getAllMessages(): MessageItemDTO[] {
    return [...this.messages];
  }

  getMessageById(id: string): MessageItemDTO | undefined {
    return this.messages.find((m) => m.id === id);
  }

  createDraft(data: Omit<MessageItemDTO, 'id' | 'preparedAt' | 'status'> & { status?: MessageStatus }): MessageItemDTO {
    const newMessage: MessageItemDTO = {
      ...data,
      id: `msg-${Date.now()}`,
      status: data.status || 'draft',
      preparedAt: new Date().toISOString(),
    };

    this.messages.unshift(newMessage);
    this.saveState();
    return newMessage;
  }

  simulateDispatch(id: string): MessageItemDTO {
    const message = this.getMessageById(id);
    if (!message) throw new Error('Mensaje no encontrado.');

    message.status = 'delivered_simulated';
    message.simulatedSentAt = new Date().toISOString();
    message.simulatedDeliveredAt = new Date().toISOString();
    this.saveState();
    return message;
  }

  simulateReply(id: string, replyText: string): MessageItemDTO {
    const message = this.getMessageById(id);
    if (!message) throw new Error('Mensaje no encontrado.');

    message.status = 'reply_received_simulated';
    message.simulatedReplyText = replyText;
    message.simulatedReplyAt = new Date().toISOString();
    this.saveState();
    return message;
  }

  updateMessageStatus(id: string, status: MessageStatus, errorMessage?: string): MessageItemDTO {
    const message = this.getMessageById(id);
    if (!message) throw new Error('Mensaje no encontrado.');

    message.status = status;
    if (errorMessage) message.errorMessage = errorMessage;
    this.saveState();
    return message;
  }

  deleteMessage(id: string): void {
    this.messages = this.messages.filter((m) => m.id !== id);
    this.saveState();
  }

  getAll(): MessageItemDTO[] {
    return this.getAllMessages();
  }

  getSummary() {
    const total = this.messages.length;
    const byChannel = {
      whatsapp: this.messages.filter((m) => m.channel === 'whatsapp').length,
      telegram: this.messages.filter((m) => m.channel === 'telegram').length,
      email: this.messages.filter((m) => m.channel === 'email').length,
    };
    const delivered = this.messages.filter(
      (m) => m.status === 'delivered_simulated' || m.status === 'reply_received_simulated'
    ).length;
    return {
      total,
      byChannel,
      delivered,
    };
  }

  resetToDefault(): void {
    this.messages = [...INITIAL_MESSAGES];
    this.saveState();
  }
}

export const messagingRepository = new MessagingRepository();
