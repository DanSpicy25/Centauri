import {
  UserRole,
  SystemModule,
  ModuleAction,
  RoleDefinition,
  IntegrationDTO,
  WebhookConfigDTO,
  SecurityAuditLogDTO,
} from '../types/security';

const ROLES_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'superadmin',
    label: 'Superadministrador (Socio Fundador)',
    description: 'Acceso irrestricto y control total de arquitectura, finanzas, despliegues, CMS, integraciones y llaves maestras.',
    badgeVariant: 'brand',
    permissions: [
      { module: 'overview', actions: ['read', 'write', 'export'] },
      { module: 'cms', actions: ['read', 'write', 'publish', 'delete', 'export'] },
      { module: 'portfolio', actions: ['read', 'write', 'publish', 'delete', 'export'] },
      { module: 'sites', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'crm', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'finance', actions: ['read', 'write', 'delete', 'export', 'manage_secrets'] },
      { module: 'automations', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'security', actions: ['read', 'write', 'delete', 'manage_secrets', 'export'] },
    ],
  },
  {
    role: 'manager',
    label: 'Director de Cuentas & Operaciones',
    description: 'Gestión comercial de clientes, oportunidades, facturas y automatizaciones. Sin acceso a credenciales de infraestructura.',
    badgeVariant: 'success',
    permissions: [
      { module: 'overview', actions: ['read'] },
      { module: 'cms', actions: ['read'] },
      { module: 'portfolio', actions: ['read'] },
      { module: 'sites', actions: ['read'] },
      { module: 'crm', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'finance', actions: ['read', 'write', 'export'] },
      { module: 'automations', actions: ['read', 'write', 'export'] },
      { module: 'security', actions: ['read'] },
    ],
  },
  {
    role: 'editor',
    label: 'Redactor Editorial & Portafolio',
    description: 'Gestión exclusiva del catálogo de proyectos y páginas del CMS. Sin acceso a finanzas, clientes o integraciones.',
    badgeVariant: 'warning',
    permissions: [
      { module: 'overview', actions: ['read'] },
      { module: 'cms', actions: ['read', 'write', 'publish'] },
      { module: 'portfolio', actions: ['read', 'write', 'publish'] },
      { module: 'sites', actions: ['read'] },
      { module: 'crm', actions: [] },
      { module: 'finance', actions: [] },
      { module: 'automations', actions: [] },
      { module: 'security', actions: [] },
    ],
  },
  {
    role: 'auditor',
    label: 'Auditor de Seguridad & Cumplimiento',
    description: 'Acceso de solo lectura estricto a registros de auditoría, estados de sitios, contratos y trazabilidad de eventos.',
    badgeVariant: 'neutral',
    permissions: [
      { module: 'overview', actions: ['read', 'export'] },
      { module: 'cms', actions: ['read'] },
      { module: 'portfolio', actions: ['read'] },
      { module: 'sites', actions: ['read', 'export'] },
      { module: 'crm', actions: ['read', 'export'] },
      { module: 'finance', actions: ['read', 'export'] },
      { module: 'automations', actions: ['read', 'export'] },
      { module: 'security', actions: ['read', 'export'] },
    ],
  },
];

const FIXTURE_INTEGRATIONS: IntegrationDTO[] = [
  {
    id: 'int-cloudflare',
    name: 'Cloudflare Pages & Edge Workers API',
    category: 'cloud',
    provider: 'Cloudflare Inc.',
    status: 'connected',
    description: 'Despliegues automatizados, purga de caché de CDN y administración de registros DNS perimetrales.',
    lastSyncAt: '2026-10-10T08:30:00Z',
    hasWebhook: true,
    webhookUrl: 'https://api.cloudflare.com/client/v4/pages/webhooks',
    maskedSecretKey: 'cf_tok_••••••••••••••••3a9f',
    environment: 'production',
    isCritical: true,
    autoRetryPolicy: {
      maxRetries: 3,
      backoffMs: 1500,
      idempotent: true,
    },
  },
  {
    id: 'int-resend',
    name: 'Resend Transactional Email Engine',
    category: 'email',
    provider: 'Resend',
    status: 'connected',
    description: 'Despacho de notificaciones y correos transaccionales con autenticación SPF/DKIM/DMARC.',
    lastSyncAt: '2026-10-10T08:15:00Z',
    hasWebhook: true,
    maskedSecretKey: 're_live_••••••••••••••••8b2c',
    environment: 'production',
    isCritical: false,
    autoRetryPolicy: {
      maxRetries: 3,
      backoffMs: 2000,
      idempotent: true,
    },
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Cloud API Oficial',
    category: 'messaging',
    provider: 'Meta Business Platform',
    status: 'connected',
    description: 'Envío de plantillas verificadas de atención al cliente y seguimiento de hitos de entrega.',
    lastSyncAt: '2026-10-10T07:45:00Z',
    hasWebhook: true,
    webhookUrl: 'https://graph.facebook.com/v19.0/messages',
    maskedSecretKey: 'waba_sec_••••••••••••••••104d',
    environment: 'production',
    isCritical: false,
    autoRetryPolicy: {
      maxRetries: 2,
      backoffMs: 3000,
      idempotent: true,
    },
  },
  {
    id: 'int-lyberatedesk',
    name: 'Satélite Demo LyberateDesk (Webhook Aislado)',
    category: 'satellite',
    provider: 'LyberateDesk Remote Service',
    status: 'connected',
    description: 'Conector seguro para recepción de eventos de demostración sin acoplamiento de código fuente.',
    lastSyncAt: '2026-10-09T22:00:00Z',
    hasWebhook: true,
    webhookUrl: 'https://demo.lyberatedesk.com/api/v1/webhook',
    maskedSecretKey: 'whsec_••••••••••••••••9e51',
    environment: 'sandbox',
    isCritical: false,
    autoRetryPolicy: {
      maxRetries: 1,
      backoffMs: 5000,
      idempotent: true,
    },
  },
];

const FIXTURE_WEBHOOKS: WebhookConfigDTO[] = [
  {
    id: 'wh-deploy',
    name: 'Notificación de Despliegue Cloudflare',
    targetUrl: 'https://lyberate.com/api/webhooks/deploy-status',
    events: ['deployment.succeeded', 'deployment.failed'],
    secretKeyMasked: 'whsec_••••••••••••2201',
    status: 'active',
    lastDeliveryStatus: 200,
    lastDeliveryAt: '2026-10-10T08:30:00Z',
  },
  {
    id: 'wh-lead',
    name: 'Captura Externa de Leads & Contacto',
    targetUrl: 'https://lyberate.com/api/webhooks/leads-inbound',
    events: ['lead.created', 'contact.submitted'],
    secretKeyMasked: 'whsec_••••••••••••8819',
    status: 'active',
    lastDeliveryStatus: 200,
    lastDeliveryAt: '2026-10-09T18:40:00Z',
  },
];

const FIXTURE_AUDIT_LOGS: SecurityAuditLogDTO[] = [
  {
    id: 'sec-01',
    timestamp: '2026-10-10T09:30:00Z',
    actor: 'Valdez',
    actorRole: 'superadmin',
    action: 'ROTATION_CHECK',
    module: 'security',
    ipAddress: '190.75.12.44',
    status: 'allowed',
    detailsSanitized: 'Comprobación de integridad de tokens perimetrales Cloudflare. Secretos sanitizados.',
  },
  {
    id: 'sec-02',
    timestamp: '2026-10-10T08:45:00Z',
    actor: 'Valdez',
    actorRole: 'superadmin',
    action: 'INVOICE_CREATE',
    module: 'finance',
    ipAddress: '190.75.12.44',
    status: 'executed',
    detailsSanitized: 'Emisión de factura INV-2026-006 por $2,500 USD para Logística Metrópolis.',
  },
  {
    id: 'sec-03',
    timestamp: '2026-10-10T07:20:00Z',
    actor: 'Socio Fundador',
    actorRole: 'superadmin',
    action: 'DISPATCH_AUTOMATION',
    module: 'automations',
    ipAddress: '186.167.33.19',
    status: 'executed',
    detailsSanitized: 'Despacho automatizado vía WhatsApp a Pink Fashion VE. ID de mensaje generado.',
  },
  {
    id: 'sec-04',
    timestamp: '2026-10-09T23:10:00Z',
    actor: 'Editor Invitado',
    actorRole: 'editor',
    action: 'SECRETS_ACCESS_ATTEMPT',
    module: 'security',
    ipAddress: '201.243.88.102',
    status: 'denied',
    detailsSanitized: 'Acceso denegado a visualización de llaves de API por política de permisos mínimos RBAC.',
  },
];

export class SecurityRepository {
  private roles: RoleDefinition[];
  private integrations: IntegrationDTO[];
  private webhooks: WebhookConfigDTO[];
  private auditLogs: SecurityAuditLogDTO[];
  private currentActiveRole: UserRole;

  constructor() {
    this.roles = [...ROLES_DEFINITIONS];
    this.integrations = [...FIXTURE_INTEGRATIONS];
    this.webhooks = [...FIXTURE_WEBHOOKS];
    this.auditLogs = [...FIXTURE_AUDIT_LOGS];
    this.currentActiveRole = 'superadmin';
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedIntegrations = localStorage.getItem('lyberate_sec_integrations');
      if (storedIntegrations) {
        try { this.integrations = JSON.parse(storedIntegrations); } catch { this.integrations = [...FIXTURE_INTEGRATIONS]; }
      }
      const storedWebhooks = localStorage.getItem('lyberate_sec_webhooks');
      if (storedWebhooks) {
        try { this.webhooks = JSON.parse(storedWebhooks); } catch { this.webhooks = [...FIXTURE_WEBHOOKS]; }
      }
      const storedLogs = localStorage.getItem('lyberate_sec_audit_logs');
      if (storedLogs) {
        try { this.auditLogs = JSON.parse(storedLogs); } catch { this.auditLogs = [...FIXTURE_AUDIT_LOGS]; }
      }
      const storedRole = localStorage.getItem('lyberate_sec_active_role');
      if (storedRole) {
        this.currentActiveRole = storedRole as UserRole;
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('lyberate_sec_integrations', JSON.stringify(this.integrations));
      localStorage.setItem('lyberate_sec_webhooks', JSON.stringify(this.webhooks));
      localStorage.setItem('lyberate_sec_audit_logs', JSON.stringify(this.auditLogs));
      localStorage.setItem('lyberate_sec_active_role', this.currentActiveRole);
    }
  }

  // --- Roles & Permisos (RBAC) ---

  getRoles(): RoleDefinition[] {
    return [...this.roles];
  }

  getActiveRole(): UserRole {
    return this.currentActiveRole;
  }

  setActiveRole(role: UserRole): void {
    this.currentActiveRole = role;
    this.saveState();
    this.logAuditEvent({
      action: 'ROLE_SWITCH_SIMULATION',
      module: 'security',
      actor: 'Valdez',
      actorRole: role,
      status: 'allowed',
      detailsSanitized: `Simulador de permisos cambiado a rol [${role}].`,
    });
  }

  hasPermission(role: UserRole, module: SystemModule, action: ModuleAction): boolean {
    const roleDef = this.roles.find((r) => r.role === role);
    if (!roleDef) return false;
    const modPerm = roleDef.permissions.find((p) => p.module === module);
    if (!modPerm) return false;
    return modPerm.actions.includes(action);
  }

  // --- Integraciones ---

  getIntegrations(): IntegrationDTO[] {
    return [...this.integrations];
  }

  toggleIntegrationStatus(id: string): IntegrationDTO {
    const index = this.integrations.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Integración ${id} no encontrada.`);

    const current = this.integrations[index];
    const newStatus = current.status === 'connected' ? 'disconnected' : 'connected';

    const updated: IntegrationDTO = {
      ...current,
      status: newStatus,
      lastSyncAt: new Date().toISOString(),
    };

    this.integrations[index] = updated;
    this.saveState();

    this.logAuditEvent({
      action: newStatus === 'connected' ? 'INTEGRATION_CONNECT' : 'INTEGRATION_REVOKE',
      module: 'security',
      actor: 'Valdez',
      actorRole: this.currentActiveRole,
      status: 'executed',
      detailsSanitized: `Integración [${current.name}] cambiada a estado [${newStatus}].`,
    });

    return updated;
  }

  rotateIntegrationSecret(id: string): IntegrationDTO {
    const index = this.integrations.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Integración ${id} no encontrada.`);

    const current = this.integrations[index];
    const randSuffix = Math.random().toString(36).substring(2, 6);
    const prefix = current.maskedSecretKey.split('_')[0] || 'sec';
    const updated: IntegrationDTO = {
      ...current,
      maskedSecretKey: `${prefix}_rot_••••••••••••••••${randSuffix}`,
      lastSyncAt: new Date().toISOString(),
    };

    this.integrations[index] = updated;
    this.saveState();

    this.logAuditEvent({
      action: 'KEY_ROTATION',
      module: 'security',
      actor: 'Valdez',
      actorRole: this.currentActiveRole,
      status: 'executed',
      detailsSanitized: `Rotada clave de API para [${current.name}]. Secreto viejo revocado de forma inmediata.`,
    });

    return updated;
  }

  // --- Webhooks ---

  getWebhooks(): WebhookConfigDTO[] {
    return [...this.webhooks];
  }

  testWebhookDelivery(id: string): { success: boolean; statusCode: number; durationMs: number } {
    const wh = this.webhooks.find((w) => w.id === id);
    if (!wh) throw new Error('Webhook no encontrado');

    const durationMs = Math.floor(Math.random() * 120) + 45;
    const success = true;
    const statusCode = 200;

    wh.lastDeliveryStatus = statusCode;
    wh.lastDeliveryAt = new Date().toISOString();
    this.saveState();

    this.logAuditEvent({
      action: 'WEBHOOK_DELIVERY_TEST',
      module: 'security',
      actor: 'Valdez',
      actorRole: this.currentActiveRole,
      status: 'executed',
      detailsSanitized: `Entrega de prueba enviada a [${wh.name}] con firma HMAC SHA-256 válida. Código HTTP ${statusCode} (${durationMs}ms).`,
    });

    return { success, statusCode, durationMs };
  }

  // --- Auditoría & Sanitización ---

  getAuditLogs(): SecurityAuditLogDTO[] {
    return [...this.auditLogs];
  }

  logAuditEvent(event: {
    action: string;
    module: SystemModule;
    actor: string;
    actorRole: UserRole;
    status: SecurityAuditLogDTO['status'];
    detailsSanitized: string;
  }): SecurityAuditLogDTO {
    // Sanitizar detalles para asegurar que no se filtren contraseñas o tokens
    const sanitized = event.detailsSanitized
      .replace(/bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
      .replace(/password[:=]\s*[^\s,]+/gi, 'password=[REDACTED]')
      .replace(/secret[:=]\s*[^\s,]+/gi, 'secret=[REDACTED]');

    const newLog: SecurityAuditLogDTO = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      ipAddress: '190.75.12.44', // IP autenticada
      ...event,
      detailsSanitized: sanitized,
    };

    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 50) this.auditLogs.pop();
    this.saveState();
    return newLog;
  }

  resetToDefault(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('lyberate_sec_integrations');
      localStorage.removeItem('lyberate_sec_webhooks');
      localStorage.removeItem('lyberate_sec_audit_logs');
      localStorage.removeItem('lyberate_sec_active_role');
    }
    this.roles = JSON.parse(JSON.stringify(ROLES_DEFINITIONS));
    this.integrations = JSON.parse(JSON.stringify(FIXTURE_INTEGRATIONS));
    this.webhooks = JSON.parse(JSON.stringify(FIXTURE_WEBHOOKS));
    this.auditLogs = JSON.parse(JSON.stringify(FIXTURE_AUDIT_LOGS));
    this.currentActiveRole = 'superadmin';
  }
}

export const securityRepository = new SecurityRepository();

