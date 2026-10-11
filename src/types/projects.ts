export type CentauriProjectStatus =
  | 'planning'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'paused';

export type DeliverableStatus =
  | 'planned'
  | 'in_progress'
  | 'ready_for_review'
  | 'delivered'
  | 'accepted';

export type ProjectPaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';

export interface ProjectDeliverableDTO {
  id: string;
  title: string;
  description: string;
  status: DeliverableStatus;
  targetDueDate: string;
  deliveredAt?: string;
  reviewNotes?: string;
}

export interface ProjectTaskDTO {
  id: string;
  title: string;
  assignedTo: string; // 'Valdez' | 'Socio Fundador'
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  completedAt?: string;
}

export interface ProjectMilestoneDTO {
  id: string;
  title: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'completed' | 'delayed';
  paymentTriggerAmountUsd?: number;
}

export interface ProjectDocumentSnapshotDTO {
  id: string;
  documentNumber: string;
  templateType: 'institutional' | 'project_agreement' | 'commercial_proposal';
  title: string;
  generatedAt: string;
  generatedBy: string;
  versionLabel: string;
  parties: {
    providerName: string;
    providerRepresentative: string;
    clientName: string;
    clientRepresentative: string;
    clientEmail: string;
    clientPhone?: string;
  };
  financialTerms: {
    totalAmount: number;
    currency: 'USD' | 'VES' | 'USDT';
    paymentMethodTerms: string;
    milestoneBreakdown?: string;
  };
  scopeSnapshot: {
    scopeSummary: string;
    deliverables: string[];
    exclusions: string[];
    timelineWeeks: number;
  };
  legalNotice: string;
}

export interface PartnerDistributionHistoryEntry {
  id: string;
  recordedAt: string;
  recordedBy: string;
  valdezPercent: number;
  socioPercent: number;
  notes: string;
}

export interface PartnerDistributionDTO {
  projectId: string;
  valdezPercent: number;
  socioPercent: number;
  valdezAmountUsd?: number;
  socioAmountUsd?: number;
  description: string;
  effectiveDate: string;
  history: PartnerDistributionHistoryEntry[];
}

export interface ProjectActivityEntryDTO {
  id: string;
  timestamp: string;
  author: string;
  title: string;
  detail: string;
  type: 'status_change' | 'delivery' | 'payment' | 'document' | 'task';
}

export interface CentauriProjectDTO {
  id: string;
  code: string; // e.g. 'PRJ-2026-001'
  name: string;
  companyId: string;
  companyName: string;
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
  };
  assignedPartner: 'Valdez' | 'Socio Fundador';
  status: CentauriProjectStatus;
  proposalId?: string;
  scopeSummary: string;
  deliverables: ProjectDeliverableDTO[];
  tasks: ProjectTaskDTO[];
  milestones: ProjectMilestoneDTO[];
  startDate: string;
  targetDeliveryDate: string;
  actualDeliveryDate?: string;
  // Estado de entrega separado del estado de pago:
  paymentStatus: ProjectPaymentStatus;
  totalAgreedAmount: number;
  currency: 'USD' | 'VES' | 'USDT';
  documents: ProjectDocumentSnapshotDTO[];
  partnerDistribution: PartnerDistributionDTO;
  activityHistory: ProjectActivityEntryDTO[];
  createdAt: string;
  updatedAt: string;
}

