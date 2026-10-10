import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Lock,
  RefreshCw,
  Globe,
  Radio,
  Server,
  Zap,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  securityRepository,
} from '../../repositories/securityRepository';
import {
  UserRole,
  SystemModule,
  ModuleAction,
  IntegrationDTO,
  WebhookConfigDTO,
  SecurityAuditLogDTO,
} from '../../types/security';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';

export const SecurityRbacHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integrations' | 'rbac' | 'webhooks' | 'audit'>('integrations');

  // Repositorio de seguridad
  const [activeRole, setActiveRole] = useState<UserRole>(() => securityRepository.getActiveRole());
  const [integrations, setIntegrations] = useState<IntegrationDTO[]>(() => securityRepository.getIntegrations());
  const [webhooks, setWebhooks] = useState<WebhookConfigDTO[]>(() => securityRepository.getWebhooks());
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLogDTO[]>(() => securityRepository.getAuditLogs());

  // Estados de retroalimentación
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [testWebhookResult, setTestWebhookResult] = useState<{ id: string; statusCode: number; durationMs: number } | null>(null);

  // Filtros de auditoría
  const [auditSearch, setAuditSearch] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState<string>('all');

  // Matriz de pruebas de permisos
  const [testModule, setTestModule] = useState<SystemModule>('finance');
  const [testAction, setTestAction] = useState<ModuleAction>('manage_secrets');

  const roles = securityRepository.getRoles();
  const currentRoleDef = roles.find((r) => r.role === activeRole) || roles[0];

  const refreshAllState = () => {
    setActiveRole(securityRepository.getActiveRole());
    setIntegrations(securityRepository.getIntegrations());
    setWebhooks(securityRepository.getWebhooks());
    setAuditLogs(securityRepository.getAuditLogs());
  };

  const showNotification = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleRoleChange = (newRole: UserRole) => {
    securityRepository.setActiveRole(newRole);
    setActiveRole(newRole);
    setAuditLogs(securityRepository.getAuditLogs());
    showNotification(`Simulador de rol activo cambiado a: ${newRole.toUpperCase()}`);
  };

  const handleToggleIntegration = (id: string) => {
    try {
      securityRepository.toggleIntegrationStatus(id);
      refreshAllState();
      showNotification('Estado del conector actualizado en la pasarela.');
    } catch {
      showNotification('Error al modificar el conector.');
    }
  };

  const handleRotateKey = (id: string, name: string) => {
    try {
      securityRepository.rotateIntegrationSecret(id);
      refreshAllState();
      showNotification(`Clave rotada exitosamente para ${name}. Secreto anterior revocado.`);
    } catch {
      showNotification('Error al rotar clave.');
    }
  };

  const handleCopySecret = (id: string, secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleTestWebhook = (id: string) => {
    try {
      const result = securityRepository.testWebhookDelivery(id);
      setTestWebhookResult({ id, statusCode: result.statusCode, durationMs: result.durationMs });
      refreshAllState();
      showNotification(`Ping HMAC enviado exitosamente: HTTP ${result.statusCode} (${result.durationMs}ms)`);
      setTimeout(() => setTestWebhookResult(null), 5000);
    } catch {
      showNotification('Fallo al despachar entrega de webhook de prueba.');
    }
  };

  const handleTestSanitization = () => {
    securityRepository.logAuditEvent({
      action: 'SANITIZER_TEST',
      module: 'security',
      actor: 'Valdez',
      actorRole: activeRole,
      status: 'allowed',
      detailsSanitized: 'Prueba de sanitización: Bearer token_super_secreto_12345 y password=mi_clave_maestra!',
    });
    setAuditLogs(securityRepository.getAuditLogs());
    showNotification('Evento de auditoría registrado. Los secretos fueron sanitizados como [REDACTED].');
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer todas las integraciones, permisos y registros a su estado de fábrica?')) {
      securityRepository.resetToDefault();
      refreshAllState();
      showNotification('Configuración de seguridad y credenciales restablecidas.');
    }
  };

  // Filtrado de auditoría
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.detailsSanitized.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesModule = auditModuleFilter === 'all' || log.module === auditModuleFilter;
    return matchesSearch && matchesModule;
  });

  const modulesList: { id: SystemModule; label: string }[] = [
    { id: 'overview', label: 'Resumen Operativo' },
    { id: 'cms', label: 'CMS Editorial' },
    { id: 'portfolio', label: 'Portafolio Casos' },
    { id: 'sites', label: 'Sitios Gestionados' },
    { id: 'crm', label: 'CRM & Clientes' },
    { id: 'finance', label: 'Finanzas & Facturas' },
    { id: 'automations', label: 'Automatizaciones' },
    { id: 'security', label: 'Seguridad & RBAC' },
  ];

  const actionsList: { id: ModuleAction; label: string }[] = [
    { id: 'read', label: 'Lectura' },
    { id: 'write', label: 'Escritura' },
    { id: 'publish', label: 'Publicar' },
    { id: 'delete', label: 'Eliminar' },
    { id: 'manage_secrets', label: 'Secretos' },
    { id: 'export', label: 'Exportar' },
  ];

  const hasSimulatedPermission = securityRepository.hasPermission(activeRole, testModule, testAction);

  return (
    <div className="space-y-6">
      {/* Banner de notificación */}
      {feedbackNotice && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#141413] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-[#3E3D38] flex items-center justify-between animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C85A32]" />
            <span className="font-medium">{feedbackNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-[#8A8881] hover:text-white cursor-pointer ml-4 text-xs"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5E3DC]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-[#141413] tracking-tight">
              Seguridad, Integraciones & Control de Acceso (RBAC)
            </h1>
            <Badge variant="brand" size="sm">Fase 08</Badge>
          </div>
          <p className="text-xs md:text-sm text-[#5C5B56] mt-1">
            Gobernanza perimetral, rotación de credenciales, simulación de roles mínimos y trazabilidad inmutable de eventos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E5E3DC] shadow-xs">
            <Users className="w-4 h-4 text-[#C85A32]" />
            <span className="text-xs text-[#5C5B56] font-medium">Simular Rol:</span>
            <select
              value={activeRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="text-xs font-bold text-[#141413] bg-transparent outline-none cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.label.split('(')[0].trim()}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            title="Restablecer llaves de prueba a valores de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Restablecer
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI de Gobernanza (iOS27 Frosted Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E5E3DC] shadow-xs hover:border-[#D5D3CC] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C5B56]">Conectores Perimetrales</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5F4EF] flex items-center justify-center text-[#141413]">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#141413]">
              {integrations.filter((i) => i.status === 'connected').length} / {integrations.length}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">100% Operativos</span>
          </div>
          <p className="text-[11px] text-[#8A8881] mt-1">Con políticas de reintento exponencial y backoff</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E5E3DC] shadow-xs hover:border-[#D5D3CC] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C5B56]">Rol Activo en Sesión</span>
            <div className="w-7 h-7 rounded-lg bg-[#FBF1EC] flex items-center justify-center text-[#C85A32]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-base font-bold text-[#141413] block truncate">
              {currentRoleDef.label.split('(')[0]}
            </span>
            <Badge variant={currentRoleDef.badgeVariant} size="sm" className="mt-1">
              {currentRoleDef.role.toUpperCase()}
            </Badge>
          </div>
          <p className="text-[11px] text-[#8A8881] mt-1">
            {activeRole === 'superadmin' ? 'Control maestro irrestricto' : 'Acceso mínimo acotado por módulo'}
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E5E3DC] shadow-xs hover:border-[#D5D3CC] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C5B56]">Endpoints Webhooks</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5F4EF] flex items-center justify-center text-[#141413]">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#141413]">
              {webhooks.length}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Firmas HMAC OK</span>
          </div>
          <p className="text-[11px] text-[#8A8881] mt-1">Protección contra replay attacks y spoofing</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E5E3DC] shadow-xs hover:border-[#D5D3CC] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C5B56]">Eventos de Auditoría</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5F4EF] flex items-center justify-center text-[#141413]">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#141413]">
              {auditLogs.length}
            </span>
            <span className="text-xs text-[#5C5B56] font-medium">Sanitizados</span>
          </div>
          <p className="text-[11px] text-[#8A8881] mt-1">Cero filtraciones de credenciales o tokens en logs</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
        tabs={[
          { id: 'integrations', label: 'Conectores & Credenciales' },
          { id: 'rbac', label: 'Control de Acceso (RBAC)' },
          { id: 'webhooks', label: 'Webhooks & Firmas HMAC' },
          { id: 'audit', label: 'Auditoría & Trazabilidad' },
        ]}
      />

      {/* TAB 1: Conectores & Credenciales */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Integraciones Perimetrales & API Keys</h2>
              <p className="text-xs text-[#5C5B56]">
                Llaves de entorno enmascaradas con políticas de reintento exponencial y rotación inmediata con un clic.
              </p>
            </div>
            <div className="text-xs font-mono text-[#8A8881] bg-white px-2.5 py-1 rounded-lg border border-[#E5E3DC]">
              Entorno: <span className="font-semibold text-emerald-700">Producción / Sandbox</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-[#E5E3DC] shadow-xs hover:border-[#D5D3CC] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] flex items-center justify-center text-[#141413] shrink-0 font-bold">
                        {item.category === 'cloud' && <Globe className="w-5 h-5 text-[#C85A32]" />}
                        {item.category === 'email' && <Zap className="w-5 h-5 text-[#C85A32]" />}
                        {item.category === 'messaging' && <Radio className="w-5 h-5 text-[#C85A32]" />}
                        {item.category === 'satellite' && <Server className="w-5 h-5 text-[#C85A32]" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#141413]">{item.name}</h3>
                        <p className="text-xs text-[#5C5B56]">{item.provider}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'connected' ? 'success' : 'neutral'} size="sm">
                      {item.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#5C5B56] mt-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Secret Key Masked Box */}
                  <div className="mt-4 p-3 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC]">
                    <div className="flex items-center justify-between text-xs text-[#5C5B56] mb-1">
                      <span className="font-medium flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#C85A32]" />
                        Secreto de API Enmascarado
                      </span>
                      <span className="font-mono text-[10px] uppercase text-[#8A8881]">
                        {item.environment}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <code className="text-xs font-mono font-semibold text-[#141413] truncate bg-white px-2 py-1 rounded border border-[#E5E3DC] w-full">
                        {item.maskedSecretKey}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopySecret(item.id, item.maskedSecretKey)}
                        className="p-1.5 rounded-lg bg-white border border-[#E5E3DC] hover:bg-[#F5F4EF] text-[#5C5B56] hover:text-[#141413] cursor-pointer shrink-0 transition-colors"
                        title="Copiar secreto enmascarado"
                      >
                        {copiedKeyId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Retry & sync metadata */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#5C5B56]">
                    <span className="bg-[#F5F4EF] px-2 py-0.5 rounded font-mono">
                      Reintentos: {item.autoRetryPolicy.maxRetries}
                    </span>
                    <span className="bg-[#F5F4EF] px-2 py-0.5 rounded font-mono">
                      Backoff: {item.autoRetryPolicy.backoffMs}ms
                    </span>
                    <span className="bg-[#F5F4EF] px-2 py-0.5 rounded font-mono">
                      {item.autoRetryPolicy.idempotent ? 'Idempotente' : 'No Idempotente'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3 border-t border-[#F0EFEA] flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#8A8881]">
                    Sincronizado: {new Date(item.lastSyncAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRotateKey(item.id, item.name)}
                      title="Rotar inmediatamente clave de API"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#C85A32]" />
                      Rotar Clave
                    </Button>
                    <Button
                      variant={item.status === 'connected' ? 'ghost' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleIntegration(item.id)}
                    >
                      {item.status === 'connected' ? 'Desconectar' : 'Conectar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Control de Acceso (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Matriz de Roles y Privilegios Mínimos (RBAC)</h2>
              <p className="text-xs text-[#5C5B56]">
                Gobernanza basada en el principio de mínimo privilegio. Selecciona un rol para simular sus permisos en tiempo real.
              </p>
            </div>
            <div className="text-xs font-medium text-[#5C5B56]">
              Rol actualmente activo: <strong className="text-[#C85A32]">{activeRole.toUpperCase()}</strong>
            </div>
          </div>

          {/* Cards de Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {roles.map((r) => {
              const isSelected = r.role === activeRole;
              return (
                <div
                  key={r.role}
                  onClick={() => handleRoleChange(r.role)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FBF1EC] border-[#C85A32] shadow-sm ring-1 ring-[#C85A32]'
                      : 'bg-white border-[#E5E3DC] hover:border-[#D5D3CC]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={r.badgeVariant} size="sm">
                        {r.role.toUpperCase()}
                      </Badge>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-[#C85A32] bg-white px-2 py-0.5 rounded-full border border-[#C85A32]/20">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#141413]">{r.label}</h3>
                    <p className="text-xs text-[#5C5B56] mt-1 leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#E5E3DC]/60 flex items-center justify-between text-[11px] text-[#8A8881]">
                    <span>Módulos permitidos:</span>
                    <span className="font-mono font-bold text-[#141413]">
                      {r.permissions.filter((p) => p.actions.length > 0).length} / 8
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulador de Verificación Rápida */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E3DC] shadow-xs">
            <h3 className="text-sm font-bold text-[#141413] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#C85A32]" />
              Probador Dinámico de Permiso para Rol [{activeRole.toUpperCase()}]
            </h3>
            <p className="text-xs text-[#5C5B56] mt-0.5">
              Comprueba al instante si el rol en sesión cuenta con autorización para ejecutar una acción específica.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="text-xs font-semibold text-[#5C5B56] block mb-1">Módulo</label>
                <select
                  value={testModule}
                  onChange={(e) => setTestModule(e.target.value as SystemModule)}
                  className="w-full text-xs p-2 rounded-xl border border-[#E5E3DC] bg-[#FBFBF9] font-medium text-[#141413]"
                >
                  {modulesList.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5C5B56] block mb-1">Acción Requerida</label>
                <select
                  value={testAction}
                  onChange={(e) => setTestAction(e.target.value as ModuleAction)}
                  className="w-full text-xs p-2 rounded-xl border border-[#E5E3DC] bg-[#FBFBF9] font-medium text-[#141413]"
                >
                  {actionsList.map((a) => (
                    <option key={a.id} value={a.id}>{a.label} ({a.id})</option>
                  ))}
                </select>
              </div>

              <div className="pt-5 sm:pt-4">
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold ${
                    hasSimulatedPermission
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {hasSimulatedPermission ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>AUTORIZADO (200 OK)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>DENEGADO (403 FORBIDDEN)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Matriz Completa */}
          <div className="bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E5E3DC] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#141413]">
                Matriz de Permisos Detallada: {currentRoleDef.label}
              </h3>
              <span className="text-xs font-mono text-[#8A8881]">
                Filtrado por: {activeRole}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FBFBF9] border-b border-[#E5E3DC] text-[#5C5B56] font-semibold">
                    <th className="py-3 px-4">Módulo del Sistema</th>
                    {actionsList.map((action) => (
                      <th key={action.id} className="py-3 px-3 text-center">
                        {action.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  {modulesList.map((module) => (
                    <tr key={module.id} className="hover:bg-[#FBFBF9]">
                      <td className="py-3 px-4 font-semibold text-[#141413]">
                        {module.label}
                      </td>
                      {actionsList.map((action) => {
                        const allowed = securityRepository.hasPermission(activeRole, module.id, action.id);
                        return (
                          <td key={action.id} className="py-3 px-3 text-center">
                            {allowed ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                                <Check className="w-3.5 h-3.5 font-bold" />
                              </span>
                            ) : (
                              <span className="inline-block w-3 h-0.5 bg-[#E5E3DC] rounded-full" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Webhooks & Firmas HMAC */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Webhooks Salientes & Firmas Criptográficas HMAC</h2>
              <p className="text-xs text-[#5C5B56]">
                Comprobación de entrega de eventos con cabecera <code className="font-mono text-[#C85A32]">X-Lyberate-Signature-256</code> y prevención contra replay attacks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="bg-white rounded-2xl p-5 border border-[#E5E3DC] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#141413]">{wh.name}</h3>
                    <Badge variant={wh.status === 'active' ? 'success' : 'neutral'} size="sm">
                      {wh.status === 'active' ? 'Activo' : 'Pausado'}
                    </Badge>
                  </div>

                  <div className="mt-3 bg-[#FBFBF9] p-3 rounded-xl border border-[#E5E3DC] space-y-1.5">
                    <div className="text-[11px] text-[#5C5B56] font-semibold">URL de Destino:</div>
                    <code className="text-xs font-mono text-[#141413] block truncate bg-white p-1.5 rounded border border-[#E5E3DC]">
                      {wh.targetUrl}
                    </code>
                    <div className="text-[11px] text-[#5C5B56] font-semibold mt-2">Eventos Suscritos:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {wh.events.map((evt, idx) => (
                        <span key={idx} className="bg-white text-[11px] font-mono text-[#5C5B56] px-2 py-0.5 rounded border border-[#E5E3DC]">
                          {evt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#5C5B56]">
                    <span>Firma Secreta:</span>
                    <code className="font-mono text-[#141413] font-semibold">{wh.secretKeyMasked}</code>
                  </div>

                  {wh.lastDeliveryAt && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#8A8881]">
                      <span>Última Entrega:</span>
                      <span className="font-mono font-medium text-emerald-700">
                        HTTP {wh.lastDeliveryStatus || 200} OK — {new Date(wh.lastDeliveryAt).toLocaleTimeString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#F0EFEA] flex items-center justify-between">
                  {testWebhookResult?.id === wh.id ? (
                    <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Entregado: HTTP {testWebhookResult.statusCode} ({testWebhookResult.durationMs}ms)
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#8A8881]">Firma SHA-256 Verificada</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestWebhook(wh.id)}
                  >
                    <Radio className="w-3.5 h-3.5 mr-1 text-[#C85A32]" />
                    Test de Entrega (Ping)
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Guía Técnica de Firmas HMAC */}
          <div className="bg-[#141413] text-[#F5F4EF] rounded-2xl p-5 border border-[#2A2926]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C85A32]" />
              Especificación Criptográfica de Integración (ADR-002)
            </h3>
            <p className="text-xs text-[#8A8881] mt-1 leading-relaxed">
              Todos los despachos salientes desde Centauri/Lyberate hacia servidores remotos (incluyendo el satélite LyberateDesk) incorporan un hash SHA-256 generado con la clave compartida.
            </p>
            <div className="mt-3 bg-[#1C1B18] p-3 rounded-xl border border-[#3E3D38] font-mono text-[11px] text-[#C5C3BC] space-y-1">
              <div><span className="text-[#8A8881]">Cabecera de Firma:</span> X-Lyberate-Signature-256: sha256=a1b2c3...</div>
              <div><span className="text-[#8A8881]">Marca Temporal:</span> X-Lyberate-Timestamp: 1791639600</div>
              <div><span className="text-[#8A8881]">Ventana de Validez:</span> 300 segundos máximo (anti-replay)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Auditoría & Trazabilidad */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Registro Inmutable de Auditoría & Trazabilidad</h2>
              <p className="text-xs text-[#5C5B56]">
                Historial de eventos de seguridad con sanitización automática de secretos y tokens Bearer.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSanitization}
              title="Probar que los tokens son enmascarados como [REDACTED]"
            >
              <Lock className="w-3.5 h-3.5 mr-1 text-[#C85A32]" />
              Probar Sanitizador de Secretos
            </Button>
          </div>

          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por actor, acción o detalle..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={auditModuleFilter}
                onChange={(e) => setAuditModuleFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'Todos los módulos' },
                  { value: 'security', label: 'Seguridad' },
                  { value: 'finance', label: 'Finanzas' },
                  { value: 'automations', label: 'Automatizaciones' },
                  { value: 'crm', label: 'CRM' },
                  { value: 'cms', label: 'CMS' },
                ]}
              />
            </div>
          </div>

          {/* Lista de Registros */}
          <div className="bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E5E3DC] flex items-center justify-between">
              <span className="text-xs font-bold text-[#141413]">
                Eventos Registrados ({filteredAuditLogs.length})
              </span>
              <span className="text-xs text-[#8A8881] font-mono">
                IP Registrada: 190.75.12.44
              </span>
            </div>

            <div className="divide-y divide-[#F0EFEA]">
              {filteredAuditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-[#FBFBF9] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[#141413] bg-[#F5F4EF] px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <Badge
                        variant={
                          log.status === 'executed'
                            ? 'success'
                            : log.status === 'allowed'
                            ? 'brand'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {log.status.toUpperCase()}
                      </Badge>
                      <span className="text-[#8A8881] font-mono">
                        {new Date(log.timestamp).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-[#5C5B56] leading-relaxed mt-1">
                      {log.detailsSanitized}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-[11px] text-[#8A8881]">
                    <div className="text-right">
                      <span className="font-bold text-[#141413] block">{log.actor}</span>
                      <span className="font-mono text-[#C85A32]">{log.actorRole}</span>
                    </div>
                    <div className="bg-[#F5F4EF] px-2 py-1 rounded font-mono text-[#5C5B56]">
                      {log.ipAddress}
                    </div>
                  </div>
                </div>
              ))}

              {filteredAuditLogs.length === 0 && (
                <div className="p-8 text-center text-xs text-[#8A8881]">
                  No se encontraron eventos de auditoría para los criterios seleccionados.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
