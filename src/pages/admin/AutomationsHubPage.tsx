import React, { useState } from 'react';
import {
  Send,
  Mail,
  Smartphone,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  ShieldAlert,
  Zap,
  Radio,
} from 'lucide-react';
import {
  automationRepository,
  DispatchLogDTO,
  WorkflowRule,
  WebhookDeliveryLogDTO,
  WorkflowExecutionResult,
} from '../../repositories/automationRepository';
import { crmRepository } from '../../repositories/crmRepository';
import { profileRepository } from '../../repositories/profileRepository';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';

export const AutomationsHubPage: React.FC = () => {
  const templates = automationRepository.getTemplates();
  const clients = crmRepository.getClients();
  const activeProfile = profileRepository.getActiveProfile();

  const [activeTab, setActiveTab] = useState<'dispatcher' | 'workflows' | 'webhooks' | 'history'>('dispatcher');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0].id);
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [activeChannel, setActiveChannel] = useState<'email' | 'whatsapp'>('email');

  // Workflows & Webhooks
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(() => automationRepository.getWorkflows());
  const [webhookLogs, setWebhookLogs] = useState<WebhookDeliveryLogDTO[]>(() =>
    automationRepository.getWebhookDeliveryLogs()
  );
  const [pendingConfirmationWf, setPendingConfirmationWf] = useState<WorkflowRule | null>(null);
  const [executionFeedback, setExecutionFeedback] = useState<WorkflowExecutionResult | null>(null);

  // Variables editables para personalización en vivo
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const [customProjectName, setCustomProjectName] = useState('Plataforma Web a Medida');
  const [customAmountUsd, setCustomAmountUsd] = useState(
    selectedClient ? String(selectedClient.totalContractValueUsd || 7500) : '7500'
  );

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dispatchLogs, setDispatchLogs] = useState<DispatchLogDTO[]>(() =>
    automationRepository.getLogs()
  );

  const currentTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Renderizar variables
  const variablesMap: Record<string, string> = {
    cliente: selectedClient ? selectedClient.contactPerson || selectedClient.name : 'Cliente',
    empresa: selectedClient ? selectedClient.companyName || selectedClient.name : 'Empresa',
    proyecto: customProjectName,
    monto_usd: customAmountUsd,
    socio: activeProfile.name,
  };

  const rendered = automationRepository.renderTemplate(selectedTemplateId, variablesMap);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Despacho por Correo (Mailto)
  const handleDispatchEmail = () => {
    const toEmail = selectedClient?.email || '';
    const subjectEnc = encodeURIComponent(rendered.subject);
    const bodyEnc = encodeURIComponent(rendered.bodyEmail);
    const mailtoUrl = `mailto:${toEmail}?subject=${subjectEnc}&body=${bodyEnc}`;

    automationRepository.logDispatch({
      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      channel: 'email',
      clientId: selectedClient?.id,
      clientName: selectedClient?.name || 'Cliente',
      recipientContact: toEmail || 'Sin email registrado',
      renderedSubject: rendered.subject,
      renderedContent: rendered.bodyEmail,
    });

    setDispatchLogs(automationRepository.getLogs());
    setFeedback(`Correo preparado y registrado en la bitácora para ${selectedClient?.name}.`);
    setTimeout(() => setFeedback(null), 4000);

    window.open(mailtoUrl, '_blank');
  };

  // Despacho por WhatsApp
  const handleDispatchWhatsApp = () => {
    const rawPhone = (selectedClient?.phone || '').replace(/[^0-9]/g, '');
    const textEnc = encodeURIComponent(rendered.bodyWhatsApp);
    const waUrl = rawPhone
      ? `https://wa.me/${rawPhone}?text=${textEnc}`
      : `https://wa.me/?text=${textEnc}`;

    automationRepository.logDispatch({
      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      channel: 'whatsapp',
      clientId: selectedClient?.id,
      clientName: selectedClient?.name || 'Cliente',
      recipientContact: selectedClient?.phone || 'Sin teléfono registrado',
      renderedContent: rendered.bodyWhatsApp,
    });

    setDispatchLogs(automationRepository.getLogs());
    setFeedback(`Mensaje de WhatsApp despachado y registrado en la bitácora.`);
    setTimeout(() => setFeedback(null), 4000);

    window.open(waUrl, '_blank');
  };

  // Acciones de Workflows
  const handleToggleWorkflow = (id: string) => {
    automationRepository.toggleWorkflowStatus(id);
    setWorkflows(automationRepository.getWorkflows());
  };

  const handleRunWorkflow = (wf: WorkflowRule) => {
    if (wf.requiresHumanConfirmation) {
      setPendingConfirmationWf(wf);
      return;
    }
    executeWorkflowAction(wf, false);
  };

  const executeWorkflowAction = (wf: WorkflowRule, confirmed: boolean) => {
    const samplePayload: Record<string, any> = {
      stage: 'won',
      amountUsd: 8500,
      severity: 'critical',
      clientName: selectedClient?.name || 'Cliente Prueba',
    };

    const res = automationRepository.executeWorkflow(wf.id, samplePayload, confirmed);
    setExecutionFeedback(res);
    setWorkflows(automationRepository.getWorkflows());
    setWebhookLogs(automationRepository.getWebhookDeliveryLogs());
    setPendingConfirmationWf(null);
  };

  const handleTestWebhookDispatch = () => {
    const newLog = automationRepository.dispatchWebhook('wh-deploy', 'test.ping', {
      source: 'Control Room Hub',
      initiatedBy: activeProfile.name,
    });
    setWebhookLogs(automationRepository.getWebhookDeliveryLogs());
    setFeedback(`Webhook despachado a Cloudflare. Código HTTP ${newLog.statusCode} (${newLog.durationMs}ms).`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#141413] tracking-tight">
              Centro de Automatizaciones & Conectores
            </h1>
            <Badge variant="brand" size="sm">Fase 08</Badge>
          </div>
          <p className="text-xs md:text-sm text-[#5C5B56] mt-1">
            Workflows reactivos con compuertas de confirmación humana, protección anti-bucles, webhooks autenticados y despachador directo.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'dispatcher', label: 'Despachador Rápido' },
          { id: 'workflows', label: `Workflows Automáticos (${workflows.length})` },
          { id: 'webhooks', label: `Trazabilidad de Webhooks (${webhookLogs.length})` },
          { id: 'history', label: `Historial de Envíos (${dispatchLogs.length})` },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* TAB 1: DESPACHADOR RÁPIDO */}
      {activeTab === 'dispatcher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Parámetros & Destinatario (col-span-4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E3DC] p-6 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold text-[#141413] uppercase tracking-wider block mb-1">
                1. Selección de Destinatario
              </span>
              <p className="text-[11px] text-[#5C5B56]">
                Selecciona la cuenta para cargar datos automáticamente.
              </p>
            </div>

            <Select
              label="Cliente / Empresa Destino"
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                const cli = clients.find((c) => c.id === e.target.value);
                if (cli) {
                  setCustomAmountUsd(String(cli.totalContractValueUsd || 7500));
                }
              }}
              options={clients.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.companyName || 'Empresa'})`,
              }))}
            />

            <div>
              <span className="text-xs font-bold text-[#141413] uppercase tracking-wider block mb-1">
                2. Plantilla de Comunicación
              </span>
              <p className="text-[11px] text-[#5C5B56]">
                Elige el propósito del mensaje.
              </p>
            </div>

            <div className="space-y-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedTemplateId === tpl.id
                      ? 'bg-[#141413] text-white border-[#141413]'
                      : 'bg-white text-[#141413] border-[#E5E3DC] hover:border-[#C85A32]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{tpl.name}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                        selectedTemplateId === tpl.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F2F1ED] text-[#5C5B56]'
                      }`}
                    >
                      {tpl.labelBadge}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] line-clamp-1 ${
                      selectedTemplateId === tpl.id ? 'text-[#C5C3BC]' : 'text-[#8A8881]'
                    }`}
                  >
                    {tpl.subject}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#F0EFEA] space-y-3">
              <span className="text-xs font-bold text-[#141413] uppercase tracking-wider block">
                3. Ajuste de Variables
              </span>
              <Input
                label="Nombre de Proyecto"
                value={customProjectName}
                onChange={(e) => setCustomProjectName(e.target.value)}
              />
              <Input
                label="Monto Inversión (USD)"
                value={customAmountUsd}
                onChange={(e) => setCustomAmountUsd(e.target.value)}
              />
            </div>
          </div>

          {/* Columna Derecha: Vista Previa y Despacho (col-span-8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E3DC] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEA]">
              <div>
                <span className="text-xs font-bold text-[#141413] uppercase tracking-wider block">
                  Vista Previa & Formato
                </span>
                <p className="text-xs text-[#5C5B56]">
                  Revisa el texto final personalizado con la firma de <strong>{activeProfile.name}</strong>.
                </p>
              </div>

              {/* Selector de Canal */}
              <div className="flex bg-[#F2F1ED] p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setActiveChannel('email')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'email'
                      ? 'bg-white text-[#141413] shadow-xs'
                      : 'text-[#5C5B56] hover:text-[#141413]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Correo (Mailto)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('whatsapp')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'whatsapp'
                      ? 'bg-white text-[#141413] shadow-xs'
                      : 'text-[#5C5B56] hover:text-[#141413]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Directo
                </button>
              </div>
            </div>

            {/* Caja de contenido renderizado */}
            {activeChannel === 'email' ? (
              <div className="space-y-4">
                <div className="p-3 bg-[#FBFBF9] border border-[#E5E3DC] rounded-xl text-xs">
                  <span className="text-[#8A8881] block mb-0.5">Asunto:</span>
                  <span className="font-bold text-[#141413]">{rendered.subject}</span>
                </div>
                <div className="p-5 bg-[#FBFBF9] border border-[#E5E3DC] rounded-2xl font-mono text-xs text-[#2A2926] whitespace-pre-line leading-relaxed min-h-[220px]">
                  {rendered.bodyEmail}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <span>Destinatario: {selectedClient?.phone || 'Sin número registrado'}</span>
                  <span className="text-[11px] font-mono text-emerald-700">Formato: WhatsApp Markdown</span>
                </div>
                <div className="p-5 bg-[#ECE5DD] border border-[#D5CEC7] rounded-2xl text-xs text-[#111B21] whitespace-pre-line leading-relaxed min-h-[220px] font-sans">
                  {rendered.bodyWhatsApp}
                </div>
              </div>
            )}

            {/* Barra de Acciones */}
            <div className="pt-4 border-t border-[#F0EFEA] flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(activeChannel === 'email' ? rendered.bodyEmail : rendered.bodyWhatsApp)}
              >
                {copied ? <Check className="w-4 h-4 mr-1 text-emerald-600" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Copiado' : 'Copiar Texto'}
              </Button>

              <div className="flex items-center gap-2">
                {activeChannel === 'email' ? (
                  <Button variant="primary" size="sm" onClick={handleDispatchEmail}>
                    <Send className="w-4 h-4 mr-1.5" />
                    Abrir Correo (Mailto)
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDispatchWhatsApp}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                  >
                    <Smartphone className="w-4 h-4 mr-1.5" />
                    Abrir en WhatsApp Web / App
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKFLOWS AUTOMÁTICOS */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-[#FAF9F5] border border-[#E5E3DC] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#141413] text-white flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#C85A32]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141413]">Motor de Flujos Reactivos</h3>
                <p className="text-xs text-[#5C5B56]">
                  Automatizaciones con compuertas de seguridad para prevenir bucles infinitos y operaciones externas involuntarias.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="brand" size="sm">
                Anti-Loop Rate Limit: Activo
              </Badge>
              <Badge variant="neutral" size="sm">
                4 Flujos Operativos
              </Badge>
            </div>
          </div>

          {/* Feedback de ejecución */}
          {executionFeedback && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                executionFeedback.status === 'executed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : executionFeedback.status === 'blocked_by_confirmation'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>Resultado: {executionFeedback.workflowName} ({executionFeedback.status})</span>
                <button
                  type="button"
                  onClick={() => setExecutionFeedback(null)}
                  className="text-xs opacity-60 hover:opacity-100"
                >
                  Cerrar
                </button>
              </div>
              <p>{executionFeedback.message}</p>
              {executionFeedback.logs.length > 0 && (
                <div className="font-mono text-[11px] pt-1 opacity-80">
                  {executionFeedback.logs.map((l, i) => (
                    <div key={i}>› {l}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Lista de Workflows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="bg-white rounded-3xl border border-[#E5E3DC] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C85A32] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#141413]">{wf.name}</h4>
                      <p className="text-xs text-[#5C5B56] mt-0.5 leading-relaxed">
                        {wf.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleWorkflow(wf.id)}
                      className={`p-1.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                        wf.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                      }`}
                      title={wf.status === 'active' ? 'Pausar flujo' : 'Activar flujo'}
                    >
                      {wf.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E5E3DC] text-[#141413]">
                      Disparador: {wf.trigger}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E5E3DC] text-[#141413]">
                      Responsable: {wf.owner}
                    </span>
                    {wf.requiresHumanConfirmation ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                        Requiere Aprobación
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                        Ejecución Autónoma
                      </span>
                    )}
                  </div>

                  {/* Acciones configuradas */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881]">
                      Acciones ({wf.actions.length}):
                    </span>
                    <ul className="text-xs text-[#2A2926] space-y-1">
                      {wf.actions.map((act, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
                          <span>{act.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0EFEA] flex items-center justify-between">
                  <div className="text-[11px] font-mono text-[#8A8881]">
                    <span>{wf.executionStats.totalRuns} corridas</span> •{' '}
                    <span>{wf.rateLimitPerHour}/hora máx</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunWorkflow(wf)}
                  >
                    <Play className="w-3.5 h-3.5 mr-1 text-[#C85A32]" />
                    Probar Flujo
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de confirmación para flujos de alto impacto */}
          {pendingConfirmationWf && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#141413]">Confirmación de Operación Externa</h3>
                    <p className="text-xs text-amber-700 font-medium">Compuerta de seguridad humana activa</p>
                  </div>
                </div>

                <p className="text-xs text-[#5C5B56] leading-relaxed">
                  El flujo <strong>"{pendingConfirmationWf.name}"</strong> está configurado con impacto externo (envío de correos o disparo de webhook a infraestructura). Como socio fundador ({pendingConfirmationWf.owner}), ¿autorizas la ejecución inmediata en sandbox?
                </p>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5E3DC]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPendingConfirmationWf(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => executeWorkflowAction(pendingConfirmationWf, true)}
                  >
                    Autorizar & Ejecutar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRAZABILIDAD DE WEBHOOKS */}
      {activeTab === 'webhooks' && (
        <div className="bg-white rounded-3xl border border-[#E5E3DC] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EFEA]">
            <div>
              <h3 className="text-base font-bold text-[#141413]">Trazabilidad de Webhooks & Conectores</h3>
              <p className="text-xs text-[#5C5B56]">
                Registro de eventos HTTP emitidos con firmas HMAC SHA-256 e inspección de cargas útiles sanitizadas.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={handleTestWebhookDispatch}>
              <Radio className="w-3.5 h-3.5 mr-1" />
              Despachar Webhook de Prueba
            </Button>
          </div>

          <div className="space-y-3">
            {webhookLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">HTTP {log.statusCode} OK</Badge>
                    <span className="font-bold text-[#141413]">{log.webhookName}</span>
                    <span className="text-[#8A8881] font-mono text-[11px]">({log.event})</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-[#8A8881]">
                    <span>Latencia: {log.durationMs}ms</span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-[#E5E3DC] text-[#5C5B56] space-y-1">
                  <div><strong>Destino:</strong> {log.targetUrl}</div>
                  <div><strong>Firma HMAC:</strong> <span className="text-[#C85A32]">{log.signatureHeader}</span></div>
                  <div><strong>Payload Sanitizado:</strong> {JSON.stringify(log.payloadSanitized)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HISTORIAL DE DESPACHOS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-[#E5E3DC] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEA]">
            <div>
              <h3 className="text-base font-bold text-[#141413]">Bitácora de Envíos Rápidos</h3>
              <p className="text-xs text-[#5C5B56]">
                Registro de comunicaciones despachadas vinculadas a la bitácora del CRM.
              </p>
            </div>
            <span className="text-xs font-mono text-[#8A8881]">Total: {dispatchLogs.length}</span>
          </div>

          {dispatchLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8A8881]">
              Aún no has generado envíos automáticos. Despacha una cotización o mensaje para comenzar.
            </div>
          ) : (
            <div className="space-y-3">
              {dispatchLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#E5E3DC] flex items-center justify-center text-[#C85A32] shrink-0">
                      {log.channel === 'email' ? <Mail className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div>
                      <span className="font-bold text-[#141413] block">{log.templateName}</span>
                      <span className="text-[#5C5B56]">
                        Para: <strong>{log.clientName}</strong> ({log.recipientContact})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-[11px] text-[#8A8881]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
