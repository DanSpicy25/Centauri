export type ClientTier = 'lead' | 'standard' | 'enterprise' | 'vip';
export type ClientStatus = 'lead' | 'active' | 'past_client' | 'churned';

export type DealStage =
  | 'lead'          // 1. Contacto inicial / Lead cualificado
  | 'discovery'     // 2. Auditoría técnica & levantamiento de alcance
  | 'proposal'      // 3. Propuesta comercial y técnica enviada
  | 'negotiation'   // 4. Negociación de términos y contratos
  | 'won'           // 5. Ganada / En ejecución
  | 'lost';         // 6. Cerrada / Descartada

export type DealPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ActivityType = 'call' | 'meeting' | 'email' | 'proposal' | 'audit' | 'note';

export interface ClientDTO {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  industry: string;
  tier: ClientTier;
  status: ClientStatus;
  assignedPartner: string; // 'Valdez' | 'Socio Fundador'
  managedSiteIds?: string[]; // Enlace a sitios de la Fase 05
  portfolioProjectSlug?: string; // Enlace a casos de estudio de Fase 03
  totalContractValueUsd: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealDTO {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  stage: DealStage;
  priority: DealPriority;
  valueUsd: number;
  probabilityPercent: number;
  assignedPartner: string;
  expectedCloseDate: string;
  serviceCategory: string; // 'Desarrollo a Medida' | 'Plataforma Componible' | 'Consultoría & Auditoría' | 'Mantenimiento Cloud'
  technicalScopeSummary: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmTaskDTO {
  id: string;
  title: string;
  dealId?: string;
  clientId?: string;
  clientName?: string;
  assignedTo: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface CrmActivityDTO {
  id: string;
  clientId?: string;
  clientName?: string;
  dealId?: string;
  type: ActivityType;
  title: string;
  description: string;
  author: string;
  timestamp: string;
}

export interface PipelineSummary {
  totalDeals: number;
  activeDealsCount: number;
  totalPipelineValueUsd: number;
  weightedPipelineValueUsd: number;
  wonValueUsd: number;
  winRatePercent: number;
}

