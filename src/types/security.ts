export type UserRole = 'superadmin' | 'manager' | 'editor' | 'auditor';

export type SystemModule = 'overview' | 'cms' | 'portfolio' | 'sites' | 'crm' | 'finance' | 'automations' | 'security';

export type ModuleAction = 'read' | 'write' | 'delete' | 'publish' | 'manage_secrets' | 'export';

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  badgeVariant: 'brand' | 'success' | 'warning' | 'neutral';
  permissions: {
    module: SystemModule;
    actions: ModuleAction[];
  }[];
}

export type IntegrationCategory = 'cloud' | 'messaging' | 'email' | 'payments' | 'analytics' | 'satellite';
export type IntegrationStatus = 'connected' | 'disconnected' | 'testing' | 'error';

export interface IntegrationDTO {
  id: string;
  name: string;
  category: IntegrationCategory;
  provider: string;
  status: IntegrationStatus;
  description: string;
  lastSyncAt: string;
  hasWebhook: boolean;
  webhookUrl?: string;
  maskedSecretKey: string; // ej. 'cf_tok_••••••••••••3a9f'
  environment: 'production' | 'staging' | 'sandbox';
  isCritical: boolean;
  autoRetryPolicy: {
    maxRetries: number;
    backoffMs: number;
    idempotent: boolean;
  };
}

export interface WebhookConfigDTO {
  id: string;
  name: string;
  targetUrl: string;
  events: string[];
  secretKeyMasked: string;
  status: 'active' | 'paused' | 'failed';
  lastDeliveryStatus?: 200 | 400 | 500;
  lastDeliveryAt?: string;
}

export interface SecurityAuditLogDTO {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  module: SystemModule;
  ipAddress: string;
  status: 'allowed' | 'denied' | 'executed' | 'error';
  detailsSanitized: string;
}

