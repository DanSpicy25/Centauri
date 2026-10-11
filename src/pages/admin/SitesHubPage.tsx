import React, { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
  Activity,
  UploadCloud,
  Clock,
  History,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Info,
} from 'lucide-react';
import { siteRepository } from '../../repositories/siteRepository';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Dialog } from '../../components/ui/Dialog';
import {
  ManagedSiteDTO,
  SiteHealthCheckLog,
  ProjectRelationship,
  SiteEnvironment,
  AnalyticsProvider,
} from '../../types/sites';

export const SitesHubPage: React.FC = () => {
  const [sites, setSites] = useState<ManagedSiteDTO[]>(() => siteRepository.getAllSites());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterRelationship, setFilterRelationship] = useState('todos');
  const [filterEnvironment, setFilterEnvironment] = useState('todos');

  // Estados de modales
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [activeSiteForHistory, setActiveSiteForHistory] = useState<ManagedSiteDTO | null>(null);
  const [historyLogs, setHistoryLogs] = useState<SiteHealthCheckLog[]>([]);
  const [editingSite, setEditingSite] = useState<ManagedSiteDTO | null>(null);
  const [isNewSite, setIsNewSite] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkRelationship, setBulkRelationship] = useState<ProjectRelationship>('managed');
  const [bulkResult, setBulkResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshList = () => {
    setSites(siteRepository.getAllSites());
  };

  useEffect(() => {
    const handleUpdate = () => refreshList();
    window.addEventListener('lyberate-sites-update', handleUpdate);
    return () => window.removeEventListener('lyberate-sites-update', handleUpdate);
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSimulateScenario = (siteId: string, scenario: 'available' | 'slow' | 'error' | 'recovered') => {
    try {
      const log = siteRepository.simulateScenario(siteId, scenario);
      refreshList();
      showFeedback('success', `Escenario simulado aplicado: ${log.message}`);
    } catch {
      showFeedback('error', 'Error al aplicar el escenario de demostración.');
    }
  };

  // Comprobar un sitio individual
  const handleCheckSite = async (siteId: string) => {
    try {
      const log = await siteRepository.runHealthCheck(siteId);
      refreshList();
      showFeedback('success', `Comprobación completada: ${log.statusCode} OK (${log.latencyMs}ms)`);
    } catch {
      showFeedback('error', 'Error al verificar la disponibilidad del sitio.');
    }
  };

  // Comprobar todos los sitios
  const handleCheckAll = async () => {
    setIsCheckingAll(true);
    try {
      await siteRepository.runAllHealthChecks();
      refreshList();
      showFeedback('success', 'Comprobación de salud finalizada para todos los sitios.');
    } catch {
      showFeedback('error', 'Ocurrió un problema durante la comprobación masiva.');
    } finally {
      setIsCheckingAll(false);
    }
  };

  // Abrir historial
  const handleOpenHistory = (site: ManagedSiteDTO) => {
    setActiveSiteForHistory(site);
    setHistoryLogs(siteRepository.getSiteCheckHistory(site.id));
  };

  // Guardar sitio individual
  const handleSaveSite = () => {
    if (!editingSite) return;

    try {
      if (isNewSite) {
        siteRepository.createSite(editingSite);
        showFeedback('success', `Sitio "${editingSite.name}" registrado como borrador.`);
      } else {
        siteRepository.updateSite(editingSite.id, editingSite);
        showFeedback('success', `Sitio "${editingSite.name}" actualizado correctamente.`);
      }
      refreshList();
      setEditingSite(null);
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Error al guardar el sitio.');
    }
  };

  // Importar en lote
  const handleBulkImport = () => {
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      showFeedback('error', 'Ingresa al menos una URL para importar.');
      return;
    }

    const payload = lines.map((url) => ({
      url,
      relationship: bulkRelationship,
    }));

    const result = siteRepository.bulkImportSites(payload);
    refreshList();
    setBulkResult({
      imported: result.imported.length,
      errors: result.errors,
    });
    if (result.imported.length > 0) {
      showFeedback('success', `Se importaron ${result.imported.length} sitios como borradores no auditados.`);
    }
  };

  // Eliminar sitio
  const handleDelete = (id: string) => {
    siteRepository.deleteSite(id);
    refreshList();
    setDeleteConfirmId(null);
    showFeedback('success', 'Sitio eliminado del inventario.');
  };

  // Filtrado reactivo
  const filteredSites = sites.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.canonicalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.technologyStack.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.maintainer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'todos' || s.status === filterStatus;
    const matchesRel = filterRelationship === 'todos' || s.relationship === filterRelationship;
    const matchesEnv = filterEnvironment === 'todos' || s.environment === filterEnvironment;

    return matchesSearch && matchesStatus && matchesRel && matchesEnv;
  });

  // Métricas agregadas reales
  const totalSites = sites.length;
  const productionCount = sites.filter((s) => s.environment === 'production').length;
  const stagingCount = sites.filter((s) => s.environment === 'staging').length;
  const onlineCount = sites.filter((s) => s.status === 'online').length;
  const averageLatency =
    onlineCount > 0
      ? Math.round(
          sites.filter((s) => s.lastLatencyMs > 0).reduce((acc, s) => acc + s.lastLatencyMs, 0) /
            (sites.filter((s) => s.lastLatencyMs > 0).length || 1)
        )
      : 0;
  const connectedAnalyticsCount = sites.filter((s) => s.analyticsStatus === 'connected').length;

  return (
    <div className="sites-hub-page space-y-8 pb-20">
      {/* Header */}
      <div className="sites-hub-heading flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FAF5FF] border border-[#E9D5FF] text-[11px] font-bold text-[#7C3AED] mb-2">
            <Server className="w-3 h-3" />
            <span>Presencia digital · {totalSites} sitios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Tus sitios, de un vistazo
          </h1>
          <p className="text-sm text-[#5C5B56] mt-1 max-w-2xl font-editorial-body">
            Consulta su estado, revisa los tiempos de respuesta y organiza la información de los sitios propios y de tus clientes.
          </p>
        </div>

        <div className="sites-hub-actions flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckAll}
            disabled={isCheckingAll}
            className="gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingAll ? 'animate-spin' : ''}`} />
            <span>{isCheckingAll ? 'Comprobando...' : 'Comprobar Todos'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setBulkText('');
              setBulkResult(null);
              setBulkModalOpen(true);
            }}
            className="gap-2"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Importar en Lote</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingSite({
                id: '',
                name: '',
                canonicalUrl: 'https://',
                environment: 'production',
                relationship: 'managed',
                technologyStack: 'WordPress / Por auditar',
                maintainer: 'Valdez / Socio',
                status: 'unmonitored',
                statusCode: 0,
                lastLatencyMs: 0,
                uptimePercentage24h: 100,
                sslStatus: 'unknown',
                analyticsStatus: 'not_connected',
                analyticsProvider: 'none',
                lastCheckedAt: 'Nunca comprobado',
                isDraft: true,
                monitoringFrequencyMinutes: 15,
                notes: '',
              });
              setIsNewSite(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Añadir Sitio</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-semibold hover:underline cursor-pointer">
            Descartar
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="sites-metrics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-metric-card bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>SITIOS SUPERVISADOS</span>
            <Globe className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-bold text-[#141413]">{totalSites}</div>
          <p className="text-xs text-[#5C5B56] mt-1">
            {productionCount} en Producción • {stagingCount} Staging
          </p>
        </div>

        <div className="admin-metric-card bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>ESTADO DE DISPONIBILIDAD</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {onlineCount} / {totalSites} Online
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">Comprobaciones HTTP de solo lectura</p>
        </div>

        <div className="admin-metric-card bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>LATENCIA PROMEDIO</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#141413]">{averageLatency} ms</div>
          <p className="text-xs text-[#5C5B56] mt-1">Tiempo de respuesta a primer byte (TTFB)</p>
        </div>

        <div className="admin-metric-card bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>HONESTIDAD DE ANALÍTICA</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-[#141413]">
            {connectedAnalyticsCount} Conectada • {totalSites - connectedAnalyticsCount} Sin Conectar
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">Cero métricas de visitas o ingresos inventadas</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="admin-toolbar bg-white p-4 rounded-xl border border-[#E5E3DC] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A8881]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por dominio, nombre o responsable..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            label=""
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'todos', label: 'Todos los estados' },
              { value: 'online', label: 'Online (200 OK)' },
              { value: 'degraded', label: 'Degradado' },
              { value: 'offline', label: 'Offline' },
              { value: 'unmonitored', label: 'Sin Monitorear' },
            ]}
          />

          <Select
            label=""
            value={filterRelationship}
            onChange={(e) => setFilterRelationship(e.target.value)}
            options={[
              { value: 'todos', label: 'Todas las relaciones' },
              { value: 'client', label: 'Cliente' },
              { value: 'own', label: 'Propio' },
              { value: 'collaboration', label: 'Colaboración' },
              { value: 'managed', label: 'Gestionado' },
            ]}
          />

          <Select
            label=""
            value={filterEnvironment}
            onChange={(e) => setFilterEnvironment(e.target.value)}
            options={[
              { value: 'todos', label: 'Todos los entornos' },
              { value: 'production', label: 'Producción' },
              { value: 'staging', label: 'Staging / Pruebas' },
            ]}
          />
        </div>
      </div>

      {/* Demo Telemetry Explanation Banner */}
      <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl p-4 flex items-start gap-3">
        <Activity className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
        <div className="text-xs text-[#581C87] leading-relaxed">
          <p className="font-bold mb-0.5">Entorno de Demostración Frontend · Simulación de Telemetría</p>
          <p className="text-[#6B21A8]">
            La disponibilidad, latencia e incidentes mostrados operan con mocks locales tipados. Utiliza los botones de <span className="font-bold">«Simular Escenario»</span> en cada fila para evaluar en vivo cómo responden las alertas, el gráfico de latencia y el historial antes de enlazar los webhooks definitivos del backend.
          </p>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBF9] text-[#5C5B56] border-b border-[#E5E3DC] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Sitio & Dominio</th>
                <th className="px-6 py-3.5">Entorno & Relación</th>
                <th className="px-6 py-3.5">Estado HTTP & Salud</th>
                <th className="px-6 py-3.5">Latencia</th>
                <th className="px-6 py-3.5">SSL</th>
                <th className="px-6 py-3.5">Analítica</th>
                <th className="px-6 py-3.5">Última Comprobación</th>
                <th className="px-6 py-3.5 text-right">Escenarios & Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEA]">
              {filteredSites.map((site) => {
                let statusBadgeVariant: 'success' | 'warning' | 'error' | 'neutral' = 'neutral';
                if (site.status === 'online') statusBadgeVariant = 'success';
                else if (site.status === 'degraded') statusBadgeVariant = 'warning';
                else if (site.status === 'offline') statusBadgeVariant = 'error';

                return (
                  <tr key={site.id} className="hover:bg-[#FDFDFD] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#141413] text-sm flex items-center gap-1.5">
                        <span>{site.name}</span>
                        {site.isDraft && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Borrador
                          </span>
                        )}
                      </div>
                      <a
                        href={site.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-[#8A8881] hover:text-[#7C3AED] flex items-center gap-1 mt-0.5 w-fit"
                      >
                        <span>{site.canonicalUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <div className="text-[11px] text-[#5C5B56] mt-1 font-mono">
                        {site.technologyStack}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#141413] capitalize block">
                        {site.environment}
                      </span>
                      <span className="text-[10px] text-[#8A8881] uppercase font-mono">
                        {site.relationship}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={statusBadgeVariant}>
                          {site.status === 'online'
                            ? `200 OK`
                            : site.status === 'degraded'
                            ? `Degradado`
                            : site.status === 'offline'
                            ? `Caído`
                            : `Sin chequear`}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-[#8A8881] block mt-1">
                        Uptime 24h: {site.uptimePercentage24h}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {site.lastLatencyMs > 0 ? (
                        <div>
                          <span
                            className={`font-mono font-bold ${
                              site.lastLatencyMs < 400
                                ? 'text-emerald-700'
                                : site.lastLatencyMs < 800
                                ? 'text-amber-700'
                                : 'text-red-700'
                            }`}
                          >
                            {site.lastLatencyMs} ms
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#8A8881] font-mono">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={site.sslStatus === 'valid' ? 'neutral' : 'warning'}>
                        {site.sslStatus === 'valid' ? 'TLS Válido' : 'Pendiente'}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      {site.analyticsStatus === 'connected' ? (
                        <div>
                          <Badge variant="success">Conectado</Badge>
                          <span className="text-[10px] text-[#8A8881] block mt-0.5 capitalize">
                            {site.analyticsProvider}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[11px] text-[#8A8881]">Sin conectar</span>
                          <span className="text-[9px] text-[#A8A69E] block">
                            (Requiere credenciales)
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-[11px] text-[#141413] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8A8881]" />
                        <span>
                          {site.lastCheckedAt.includes('T')
                            ? new Date(site.lastCheckedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : site.lastCheckedAt}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8A8881] block mt-0.5">
                        Resp: {site.maintainer}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* Escenario Demo Trigger Group */}
                        <div className="flex items-center gap-1 bg-[#F5F4EF] p-1 rounded-lg border border-[#E5E3DC]">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-[#8A8881] px-1">Demo:</span>
                          <button
                            type="button"
                            onClick={() => handleSimulateScenario(site.id, 'available')}
                            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
                            title="Simular 200 OK (115ms)"
                          >
                            200 OK
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateScenario(site.id, 'slow')}
                            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors cursor-pointer"
                            title="Simular Latenica Alta (>800ms)"
                          >
                            Lento
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateScenario(site.id, 'error')}
                            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-red-100 hover:bg-red-200 text-red-800 transition-colors cursor-pointer"
                            title="Simular Caída 503"
                          >
                            Caído
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateScenario(site.id, 'recovered')}
                            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-violet-100 hover:bg-violet-200 text-violet-800 transition-colors cursor-pointer"
                            title="Simular Recuperado a 200 OK"
                          >
                            Restablecer
                          </button>
                        </div>

                        {/* Standard Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCheckSite(site.id)}
                            className="p-1.5 text-[#5C5B56] hover:text-[#141413] hover:bg-[#F5F4EF] rounded-lg transition-colors cursor-pointer"
                            title="Comprobar salud HTTP ahora"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenHistory(site)}
                            className="p-1.5 text-[#5C5B56] hover:text-[#141413] hover:bg-[#F5F4EF] rounded-lg transition-colors cursor-pointer"
                            title="Ver historial de pings"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingSite({ ...site });
                              setIsNewSite(false);
                            }}
                            className="p-1.5 text-[#5C5B56] hover:text-[#141413] hover:bg-[#F5F4EF] rounded-lg transition-colors cursor-pointer"
                            title="Editar metadatos"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(site.id)}
                            className="p-1.5 text-[#8A8881] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar del inventario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Historial de Pings & Chequeos */}
      {activeSiteForHistory && (
        <Dialog
          isOpen={true}
          onClose={() => setActiveSiteForHistory(null)}
          title={`Historial de Disponibilidad: ${activeSiteForHistory.name}`}
          description={`Registro de comprobaciones de conectividad para ${activeSiteForHistory.canonicalUrl}`}
          footer={
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setActiveSiteForHistory(null)}>
                Cerrar
              </Button>
            </div>
          }
        >
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {historyLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#8A8881] bg-[#FBFBF9] rounded-xl border border-[#E5E3DC]">
                No hay comprobaciones registradas todavía para este sitio. Haz clic en el botón de actualización en la tabla para ejecutar un ping.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="text-[#8A8881] uppercase font-semibold text-[10px] border-b border-[#F0EFEA]">
                  <tr>
                    <th className="py-2">Código</th>
                    <th className="py-2">Latencia</th>
                    <th className="py-2">Resultado</th>
                    <th className="py-2 text-right">Fecha & Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F4EF]">
                  {historyLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-2.5 font-mono font-bold text-emerald-700">
                        {log.statusCode} OK
                      </td>
                      <td className="py-2.5 font-mono">{log.latencyMs} ms</td>
                      <td className="py-2.5 text-[#5C5B56]">{log.message}</td>
                      <td className="py-2.5 text-right font-mono text-[11px] text-[#8A8881]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Dialog>
      )}

      {/* Modal: Crear / Editar Sitio */}
      {editingSite && (
        <Dialog
          isOpen={true}
          onClose={() => setEditingSite(null)}
          title={isNewSite ? 'Registrar Nuevo Sitio en Supervisión' : `Editar: ${editingSite.name}`}
          description="Los sitios nuevos inician como borrador para garantizar validación previa antes de auditorías."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setEditingSite(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveSite}>
                Guardar Sitio
              </Button>
            </div>
          }
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input
              label="URL Canónica (https://...)"
              value={editingSite.canonicalUrl}
              onChange={(e) => setEditingSite({ ...editingSite, canonicalUrl: e.target.value })}
              placeholder="https://ejemplo.com/"
              required
            />

            <Input
              label="Nombre Descriptivo"
              value={editingSite.name}
              onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
              placeholder="Ej: Tienda Virtual Cliente"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Entorno"
                value={editingSite.environment}
                onChange={(e) =>
                  setEditingSite({
                    ...editingSite,
                    environment: e.target.value as SiteEnvironment,
                  })
                }
                options={[
                  { value: 'production', label: 'Producción' },
                  { value: 'staging', label: 'Staging / Pruebas' },
                  { value: 'development', label: 'Desarrollo' },
                ]}
              />

              <Select
                label="Relación con Lyberate"
                value={editingSite.relationship}
                onChange={(e) =>
                  setEditingSite({
                    ...editingSite,
                    relationship: e.target.value as ProjectRelationship,
                  })
                }
                options={[
                  { value: 'client', label: 'Proyecto de Cliente' },
                  { value: 'own', label: 'Propio de Lyberate' },
                  { value: 'collaboration', label: 'Colaboración' },
                  { value: 'managed', label: 'Sitio Gestionado' },
                ]}
              />
            </div>

            <Input
              label="Stack Tecnológico Verificado"
              value={editingSite.technologyStack}
              onChange={(e) => setEditingSite({ ...editingSite, technologyStack: e.target.value })}
              placeholder="Ej: WordPress 6.x + WooCommerce, Cloudflare"
            />

            <Input
              label="Responsable Técnico Asignado"
              value={editingSite.maintainer}
              onChange={(e) => setEditingSite({ ...editingSite, maintainer: e.target.value })}
              placeholder="Valdez / Socio"
            />

            <Select
              label="Integración Analítica"
              value={editingSite.analyticsProvider}
              onChange={(e) => {
                const prov = e.target.value as AnalyticsProvider;
                setEditingSite({
                  ...editingSite,
                  analyticsProvider: prov,
                  analyticsStatus: prov === 'none' ? 'not_connected' : 'connected',
                });
              }}
              options={[
                { value: 'none', label: 'Sin Conectar (Predeterminado)' },
                { value: 'cloudflare', label: 'Cloudflare Analytics' },
                { value: 'google_analytics_4', label: 'Google Analytics 4' },
                { value: 'plausible', label: 'Plausible Analytics' },
              ]}
            />

            <Textarea
              label="Notas Técnicas y Observaciones"
              value={editingSite.notes || ''}
              onChange={(e) => setEditingSite({ ...editingSite, notes: e.target.value })}
              rows={2}
              placeholder="Detalles sobre hosting, DNS o acuerdos de mantenimiento..."
            />
          </div>
        </Dialog>
      )}

      {/* Modal: Importar Sitios en Lote */}
      <Dialog
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title="Importación Masiva de Sitios Gestionados"
        description="Pega una lista de URLs (una por línea) para registrarlas en el inventario. Se crearán como borradores no auditados de forma segura."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setBulkModalOpen(false)}>
              Cerrar
            </Button>
            <Button variant="primary" size="sm" onClick={handleBulkImport} className="gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Ejecutar Importación</span>
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Tipo de Relación para estos sitios"
            value={bulkRelationship}
            onChange={(e) => setBulkRelationship(e.target.value as ProjectRelationship)}
            options={[
              { value: 'managed', label: 'Sitio Gestionado (Mantenimiento)' },
              { value: 'client', label: 'Proyecto de Cliente' },
              { value: 'collaboration', label: 'Colaboración Técnica' },
            ]}
          />

          <div>
            <label className="block text-xs font-semibold text-[#141413] mb-1">
              URLs a importar (una por línea):
            </label>
            <Textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              placeholder="https://cliente1.com&#10;https://tiendaonline.ve&#10;https://portalnoticias.org..."
              className="font-mono text-xs"
            />
            <p className="text-[11px] text-[#8A8881] mt-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>Las URLs duplicadas o con esquemas inválidos serán filtradas automáticamente.</span>
            </p>
          </div>

          {bulkResult && (
            <div className="p-3 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] text-xs space-y-2">
              <div className="font-bold text-emerald-800">
                ✓ {bulkResult.imported} sitios importados como borradores.
              </div>
              {bulkResult.errors.length > 0 && (
                <div className="space-y-1 text-amber-800">
                  <span className="font-semibold block">Avisos ({bulkResult.errors.length}):</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {bulkResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>

      {/* Modal: Confirmación de Eliminación */}
      <Dialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmar Eliminación del Sitio"
        description="Esta acción eliminará el sitio del inventario de supervisión junto con su historial de pings."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Confirmar Eliminación
            </Button>
          </div>
        }
      >
        <p className="text-xs text-[#5C5B56]">
          El sitio ya no será comprobado en los ciclos de monitoreo.
        </p>
      </Dialog>
    </div>
  );
};
