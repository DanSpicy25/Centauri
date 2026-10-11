import { InquirySubmissionDTO, InquiryReplyDTO, InquiryStatus, InquiryPriority } from '../types/inquiries';

const INITIAL_INQUIRIES: InquirySubmissionDTO[] = [
  {
    id: 'inq-01',
    name: 'Distribuidora Monte Carmelo',
    companyName: 'Monte Carmelo Alimentos C.A.',
    email: 'contacto@montecarmelo.ve',
    phone: '+58 412 555 1234',
    needType: 'Sistemas de gestión comercial',
    budgetEstimated: '$2,500 - $5,000',
    timeline: '1-3 meses',
    description: 'Buscamos un sistema para controlar ventas mayoristas, emitir comprobantes de despacho y llevar inventario en 2 almacenes.',
    status: 'new',
    priority: 'high',
    assignedPartner: 'Valdez',
    notes: 'Interés confirmado desde la web pública. Requieren demo de Sagitta.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isLocalDemo: true,
  },
  {
    id: 'inq-02',
    name: 'Dra. Mariana Benítez',
    companyName: 'Clínica Dental Sonrisas',
    email: 'dra.benitez@sonrisas.com',
    phone: '+58 414 888 9900',
    needType: 'Atención y seguimiento por WhatsApp',
    budgetEstimated: '$1,000 - $2,500',
    timeline: 'Inmediato (< 1 mes)',
    description: 'Atendemos pacientes por WhatsApp y se nos pierden citas y presupuestos. Necesitamos organizar la bandeja y automatizar recordatorios.',
    status: 'reviewing',
    priority: 'medium',
    assignedPartner: 'Socio Fundador',
    notes: 'Le enviamos resumen de LyberateDesk. Esperando disponibilidad para llamada.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    isLocalDemo: true,
  },
  {
    id: 'inq-03',
    name: 'Grupo Ferretero Bolívar',
    companyName: 'Ferretería Bolívar Express',
    email: 'gerencia@ferrebolivar.com',
    phone: '+58 424 777 6655',
    needType: 'Sitio web y catálogo digital',
    budgetEstimated: '$1,500 - $3,000',
    timeline: '1-3 meses',
    description: 'Queremos renovar nuestra página con catálogo accesible desde teléfonos móviles y botón de pedido directo a WhatsApp.',
    status: 'replied',
    priority: 'medium',
    assignedPartner: 'Valdez',
    replies: [
      {
        id: 'rep-01',
        author: 'Valdez',
        channel: 'email',
        text: 'Hola estimada gerencia, revisamos su solicitud. Le proponemos una reunión técnica de 20 minutos para definir el volumen de productos.',
        sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
    notes: 'Enviada propuesta preliminar por correo simulado.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isLocalDemo: true,
  },
];

const STORAGE_KEY = 'lyberate_inquiries';

export class InquiryRepository {
  private inquiries: InquirySubmissionDTO[] = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.inquiries = [...INITIAL_INQUIRIES];
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.inquiries = [...INITIAL_INQUIRIES];
      this.saveState();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      this.inquiries = Array.isArray(parsed) ? parsed : [...INITIAL_INQUIRIES];
    } catch {
      this.inquiries = [...INITIAL_INQUIRIES];
    }
  }

  private saveState(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inquiries));
      window.dispatchEvent(new Event('lyberate-inquiries-update'));
    }
  }

  getInquiries(): InquirySubmissionDTO[] {
    return [...this.inquiries];
  }

  getAll(): InquirySubmissionDTO[] {
    return this.getInquiries();
  }

  getSummary() {
    const total = this.inquiries.length;
    const newInquiries = this.inquiries.filter((i) => i.status === 'new').length;
    const inReviewInquiries = this.inquiries.filter((i) => i.status === 'reviewing').length;
    const repliedInquiries = this.inquiries.filter((i) => i.status === 'replied').length;
    const convertedInquiries = this.inquiries.filter((i) => i.status === 'converted').length;
    const archivedInquiries = this.inquiries.filter((i) => i.status === 'archived').length;
    return {
      total,
      newInquiries,
      inReviewInquiries,
      repliedInquiries,
      convertedInquiries,
      archivedInquiries,
    };
  }

  getInquiryById(id: string): InquirySubmissionDTO | undefined {
    return this.inquiries.find((inq) => inq.id === id);
  }

  createInquiry(
    data: Omit<InquirySubmissionDTO, 'id' | 'createdAt' | 'updatedAt' | 'isLocalDemo' | 'status' | 'priority' | 'assignedPartner'> & {
      priority?: InquiryPriority;
      assignedPartner?: 'Valdez' | 'Socio Fundador';
    }
  ): InquirySubmissionDTO {
    const newInquiry: InquirySubmissionDTO = {
      ...data,
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'new',
      priority: data.priority || 'medium',
      assignedPartner: data.assignedPartner || 'Valdez',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLocalDemo: true,
      replies: [],
    };

    this.inquiries.unshift(newInquiry);
    this.saveState();
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: InquiryStatus): InquirySubmissionDTO {
    const item = this.inquiries.find((inq) => inq.id === id);
    if (!item) throw new Error('Consulta no encontrada.');

    item.status = status;
    item.updatedAt = new Date().toISOString();
    this.saveState();
    return item;
  }

  assignPartner(id: string, partner: 'Valdez' | 'Socio Fundador'): InquirySubmissionDTO {
    const item = this.inquiries.find((inq) => inq.id === id);
    if (!item) throw new Error('Consulta no encontrada.');

    item.assignedPartner = partner;
    item.updatedAt = new Date().toISOString();
    this.saveState();
    return item;
  }

  addReply(
    id: string,
    reply: Omit<InquiryReplyDTO, 'id' | 'sentAt'>
  ): InquirySubmissionDTO {
    const item = this.inquiries.find((inq) => inq.id === id);
    if (!item) throw new Error('Consulta no encontrada.');

    const newReply: InquiryReplyDTO = {
      ...reply,
      id: `rep-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };

    item.replies = [...(item.replies || []), newReply];
    item.status = 'replied';
    item.updatedAt = new Date().toISOString();
    this.saveState();
    return item;
  }

  updateNotes(id: string, notes: string): InquirySubmissionDTO {
    const item = this.inquiries.find((inq) => inq.id === id);
    if (!item) throw new Error('Consulta no encontrada.');

    item.notes = notes;
    item.updatedAt = new Date().toISOString();
    this.saveState();
    return item;
  }

  archiveInquiry(id: string): void {
    const item = this.inquiries.find((inq) => inq.id === id);
    if (!item) return;
    item.status = 'archived';
    item.updatedAt = new Date().toISOString();
    this.saveState();
  }

  linkToDealOrProject(id: string, dealId?: string, projectId?: string): void {
    const item = this.inquiries.find((inq) => inq.id === id);
    if (!item) return;
    if (dealId) item.convertedDealId = dealId;
    if (projectId) item.convertedProjectId = projectId;
    item.status = 'converted';
    item.updatedAt = new Date().toISOString();
    this.saveState();
  }

  resetToDefault(): void {
    this.inquiries = [...INITIAL_INQUIRIES];
    this.saveState();
  }
}

export const inquiryRepository = new InquiryRepository();
