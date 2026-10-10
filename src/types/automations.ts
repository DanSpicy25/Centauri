/**
 * CENTAURI × LYBERATE — TIPOS DE AUTOMATIZACIÓN, CONECTORES Y FLUJOS
 * Definiciones canónicas para flujos de automatización, disparadores,
 * condiciones, confirmaciones humanas y logs de conectores externos.
 */

export type WorkflowTriggerType =
  | 'lead_created'
  | 'deal_won'
  | 'invoice_issued'
  | 'invoice_paid'
  | 'site_incident_reported'
  | 'manual_dispatch';

export type WorkflowActionType =
  | 'send_email'
  | 'send_whatsapp'
  | 'call_webhook'
  | 'create_crm_task'
  | 'log_security_audit';

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'contains' | 'not_empty';
  value: any;
}

export interface WorkflowActionConfig {
  type: WorkflowActionType;
  targetId?: string;
  templateId?: string;
  description: string;
  config?: Record<string, any>;
}

export interface WorkflowExecutionStats {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  lastRunAt?: string;
  lastExecutionLog?: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTriggerType;
  conditions: WorkflowCondition[];
  actions: WorkflowActionConfig[];
  owner: 'Valdez' | 'Socio Fundador';
  status: 'active' | 'paused' | 'disabled';
  requiresHumanConfirmation: boolean;
  rateLimitPerHour: number;
  executionStats: WorkflowExecutionStats;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDeliveryLogDTO {
  id: string;
  webhookId: string;
  webhookName: string;
  event: string;
  targetUrl: string;
  payloadSanitized: Record<string, any>;
  signatureHeader: string; // ej. 'sha256=4f2a71...'
  statusCode: number;
  durationMs: number;
  retryCount: number;
  timestamp: string;
  status: 'delivered' | 'retried' | 'failed';
}

export interface WorkflowExecutionResult {
  workflowId: string;
  workflowName: string;
  status: 'executed' | 'blocked_by_confirmation' | 'rate_limited' | 'condition_unmet' | 'failed';
  executedActionsCount: number;
  message: string;
  logs: string[];
}

export interface MessageTemplateDTO {
  id: string;
  name: string;
  category: 'proposal' | 'onboarding' | 'milestone' | 'payment' | 'delivery';
  labelBadge: string;
  subject: string;
  bodyEmail: string;
  bodyWhatsApp: string;
  variables: string[];
}

export interface DispatchLogDTO {
  id: string;
  templateId: string;
  templateName: string;
  channel: 'email' | 'whatsapp';
  clientId?: string;
  clientName: string;
  recipientContact: string;
  renderedSubject?: string;
  renderedContent: string;
  timestamp: string;
}

