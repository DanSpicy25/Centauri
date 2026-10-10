import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Briefcase,
  Plus,
  Download,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  LayoutGrid,
  List,
  Edit,
  MessageSquare,
} from 'lucide-react';
import { crmRepository } from '../../repositories/crmRepository';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Tabs } from '../../components/ui/Tabs';
import { Dialog } from '../../components/ui/Dialog';
import {
  ClientDTO,
  DealDTO,
  CrmTaskDTO,
  CrmActivityDTO,
  DealStage,
  ClientTier,
} from '../../types/crm';

export const CrmHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'clients' | 'tasks' | 'timeline' | 'chat_satellite'>('pipeline');
  const [pipelineViewMode, setPipelineViewMode] = useState<'kanban' | 'table'>('kanban');

  // Listas de datos reactivas
  const [clients, setClients] = useState<ClientDTO[]>(() => crmRepository.getClients());
  const [deals, setDeals] = useState<DealDTO[]>(() => crmRepository.getDeals());
  const [tasks, setTasks] = useState<CrmTaskDTO[]>(() => crmRepository.getTasks());
  const [activities, setActivities] = useState<CrmActivityDTO[]>(() => crmRepository.getActivities());

  // Búsquedas y filtros
  const [clientSearch, setClientSearch] = useState('');
  const [clientTierFilter, setClientTierFilter] = useState('todos');
  const [dealSearch, setDealSearch] = useState('');
  const [dealStageFilter, setDealStageFilter] = useState('todos');

  // Modales
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Partial<DealDTO> | null>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<ClientDTO> | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskPriority, setNewTaskPriority] = useState<CrmTaskDTO['priority']>('medium');
  const [newTaskClient, setNewTaskClient] = useState('');
  const [activityNoteOpen, setActivityNoteOpen] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityType, setNewActivityType] = useState<CrmActivityDTO['type']>('note');
  const [newActivityClient, setNewActivityClient] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshAll = () => {
    setClients(crmRepository.getClients());
    setDeals(crmRepository.getDeals());
    setTasks(crmRepository.getTasks());
    setActivities(crmRepository.getActivities());
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const summary = crmRepository.getPipelineSummary();

  // Guardar Oportunidad (Deal)
  const handleSaveDeal = () => {
    if (!editingDeal) return;
    try {
      if (editingDeal.id) {
        crmRepository.updateDeal(editingDeal.id, editingDeal);
        showNotification('success', `Oportunidad "${editingDeal.title}" actualizada.`);
      } else {
        crmRepository.createDeal(editingDeal);
        showNotification('success', `Oportunidad creada e incorporada al pipeline.`);
      }
      refreshAll();
      setDealModalOpen(false);
      setEditingDeal(null);
    } catch {
      showNotification('error', 'Error al procesar la oportunidad.');
    }
  };

  // Mover etapa de Deal en Kanban
  const handleMoveDealStage = (dealId: string, newStage: DealStage) => {
    crmRepository.moveDealStage(dealId, newStage, 'Socio Fundador');
    refreshAll();
  };

  // Guardar Cliente
  const handleSaveClient = () => {
    if (!editingClient) return;
    try {
      if (editingClient.id) {
        crmRepository.updateClient(editingClient.id, editingClient);
        showNotification('success', `Cliente "${editingClient.name}" actualizado.`);
      } else {
        crmRepository.createClient(editingClient);
        showNotification('success', `Nuevo cliente registrado en el directorio.`);
      }
      refreshAll();
      setClientModalOpen(false);
      setEditingClient(null);
    } catch {
      showNotification('error', 'Error al procesar el cliente.');
    }
  };

  // Crear Tarea
  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    const selectedCli = clients.find((c) => c.id === newTaskClient);
    crmRepository.createTask({
      title: newTaskTitle.trim(),
      dueDate: newTaskDue,
      priority: newTaskPriority,
      clientId: newTaskClient || undefined,
      clientName: selectedCli?.name,
      assignedTo: 'Valdez',
    });
    refreshAll();
    setTaskModalOpen(false);
    setNewTaskTitle('');
    showNotification('success', 'Tarea asignada correctamente.');
  };

  // Alternar estado de tarea
  const handleToggleTask = (task: CrmTaskDTO) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    crmRepository.updateTaskStatus(task.id, nextStatus);
    refreshAll();
  };

  // Registrar Actividad / Nota
  const handleLogActivity = () => {
    if (!newActivityTitle.trim()) return;
    const selectedCli = clients.find((c) => c.id === newActivityClient);
    crmRepository.logActivity({
      title: newActivityTitle.trim(),
      description: newActivityDesc.trim(),
      type: newActivityType,
      clientId: newActivityClient || undefined,
      clientName: selectedCli?.name,
      author: 'Socio Fundador',
    });
    refreshAll();
    setActivityNoteOpen(false);
    setNewActivityTitle('');
    setNewActivityDesc('');
    showNotification('success', 'Interacción registrada en la línea de tiempo.');
  };

  // Exportar datos
  const handleExportCsv = () => {
    const csvContent = crmRepository.exportClientsToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lyberate_clientes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'Directorio de clientes exportado en formato CSV.');
  };

  // Filtrado de clientes
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.companyName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.industry.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase());
    const matchesTier = clientTierFilter === 'todos' || c.tier === clientTierFilter;
    return matchesSearch && matchesTier;
  });

  // Filtrado de deals
  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(dealSearch.toLowerCase()) ||
      d.clientName.toLowerCase().includes(dealSearch.toLowerCase()) ||
      d.serviceCategory.toLowerCase().includes(dealSearch.toLowerCase());
    const matchesStage = dealStageFilter === 'todos' || d.stage === dealStageFilter;
    return matchesSearch && matchesStage;
  });

  // Definición de etapas Kanban
  const kanbanStages: Array<{ id: DealStage; label: string; color: string }> = [
    { id: 'lead', label: '1. Contacto / Lead', color: 'border-stone-400 text-stone-700' },
    { id: 'discovery', label: '2. Alcance & Auditoría', color: 'border-blue-400 text-blue-700' },
    { id: 'proposal', label: '3. Propuesta Entregada', color: 'border-amber-400 text-amber-700' },
    { id: 'negotiation', label: '4. Negociación / Cierre', color: 'border-purple-400 text-purple-700' },
    { id: 'won', label: '5. Ganada / En Ejecución', color: 'border-emerald-500 text-emerald-800' },
    { id: 'lost', label: '6. Descartada', color: 'border-stone-300 text-stone-400' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-[11px] font-bold text-[#C85A32] mb-2">
            <Briefcase className="w-3 h-3" />
            <span>Fase 06 — CRM Comercial & Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Gestión de Clientes, Ventas & Entregas
          </h1>
          <p className="text-sm text-[#5C5B56] mt-1 max-w-2xl font-editorial-body">
            Centro operativo de relaciones comerciales para los socios fundadores. Supervisión del embudo de ventas, contratos y entregas sin acoplamiento con sistemas de chat externos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingClient({
                name: '',
                companyName: '',
                contactPerson: '',
                email: '',
                phone: '',
                industry: 'Servicios',
                tier: 'standard',
                status: 'lead',
                assignedPartner: 'Valdez',
                totalContractValueUsd: 0,
                notes: '',
              });
              setClientModalOpen(true);
            }}
            className="gap-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nuevo Cliente</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingDeal({
                title: '',
                clientId: clients[0]?.id || '',
                clientName: clients[0]?.name || '',
                stage: 'lead',
                priority: 'medium',
                valueUsd: 5000,
                probabilityPercent: 30,
                assignedPartner: 'Valdez',
                expectedCloseDate: new Date().toISOString().split('T')[0],
                serviceCategory: 'Desarrollo a Medida',
                technicalScopeSummary: '',
                notes: '',
              });
              setDealModalOpen(true);
            }}
            className="gap-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Oportunidad</span>
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
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-semibold hover:underline cursor-pointer">
            Descartar
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>PIPELINE ACTIVO</span>
            <DollarSign className="w-4 h-4 text-[#C85A32]" />
          </div>
          <div className="text-2xl font-bold text-[#141413]">
            ${summary.totalPipelineValueUsd.toLocaleString()} USD
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">
            {summary.activeDealsCount} oportunidades en negociación activa
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>VALOR PONDERADO</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            ${summary.weightedPipelineValueUsd.toLocaleString()} USD
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">Ajustado por probabilidad estimada de cierre</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>CONTRATOS GANADOS</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-[#141413]">
            ${summary.wonValueUsd.toLocaleString()} USD
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">Tasa de cierre (Win Rate): {summary.winRatePercent}%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>CLIENTES & ENTREGAS</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#141413]">{clients.length} Cuentas</div>
          <p className="text-xs text-[#5C5B56] mt-1">
            {tasks.filter((t) => t.status === 'pending').length} tareas de entrega abiertas
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'pipeline', label: `Pipeline Comercial (${deals.length})` },
          { id: 'clients', label: `Directorio de Clientes (${clients.length})` },
          { id: 'tasks', label: `Tareas & Hitos (${tasks.length})` },
          { id: 'timeline', label: `Línea de Tiempo (${activities.length})` },
          { id: 'chat_satellite', label: 'Demo LyberateDesk / LyberateChat' },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* TAB 1: PIPELINE COMERCIAL */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Toolbar de visualización */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A8881]" />
              <Input
                value={dealSearch}
                onChange={(e) => setDealSearch(e.target.value)}
                placeholder="Buscar oportunidad por título, cliente o categoría..."
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={dealStageFilter}
                onChange={(e) => setDealStageFilter(e.target.value)}
                className="text-xs w-44"
                options={[
                  { value: 'todos', label: 'Todas las etapas' },
                  { value: 'lead', label: '1. Contacto / Lead' },
                  { value: 'discovery', label: '2. Auditoría / Alcance' },
                  { value: 'proposal', label: '3. Propuesta Entregada' },
                  { value: 'negotiation', label: '4. Negociación' },
                  { value: 'won', label: '5. Ganada / En Ejecución' },
                  { value: 'lost', label: '6. Descartada' },
                ]}
              />

              <div className="flex items-center bg-[#F5F4EF] p-1 rounded-lg border border-[#E5E3DC]">
                <button
                  type="button"
                  onClick={() => setPipelineViewMode('kanban')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    pipelineViewMode === 'kanban' ? 'bg-white shadow-xs text-[#141413]' : 'text-[#5C5B56]'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPipelineViewMode('table')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    pipelineViewMode === 'table' ? 'bg-white shadow-xs text-[#141413]' : 'text-[#5C5B56]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Tabla</span>
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board View */}
          {pipelineViewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {kanbanStages.map((stage) => {
                const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
                const stageTotal = stageDeals.reduce((acc, d) => acc + d.valueUsd, 0);

                return (
                  <div
                    key={stage.id}
                    className="bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] p-3 flex flex-col min-w-[240px] space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA]">
                      <div>
                        <span className="text-xs font-bold text-[#141413] block">
                          {stage.label}
                        </span>
                        <span className="text-[11px] font-mono text-[#8A8881]">
                          ${stageTotal.toLocaleString()} USD
                        </span>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-white border border-[#E5E3DC] flex items-center justify-center font-mono text-[10px] font-bold text-[#5C5B56]">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {stageDeals.length === 0 ? (
                        <div className="text-[11px] text-[#A8A69E] text-center py-6">
                          Sin oportunidades
                        </div>
                      ) : (
                        stageDeals.map((deal) => (
                          <div
                            key={deal.id}
                            className="bg-white p-3.5 rounded-lg border border-[#E5E3DC] shadow-2xs hover:border-[#D1CEBF] transition-all space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-[#141413] leading-snug line-clamp-2">
                                {deal.title}
                              </h4>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-[#5C5B56]">{deal.clientName}</span>
                              <span className="font-mono font-bold text-[#C85A32]">
                                ${deal.valueUsd.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-[#F5F4EF] text-[10px] text-[#8A8881]">
                              <span>{deal.probabilityPercent}% prob.</span>
                              <span className="font-mono">{deal.assignedPartner}</span>
                            </div>

                            {/* Controles para mover de etapa */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#F5F4EF]">
                              <button
                                type="button"
                                disabled={stage.id === 'lead'}
                                onClick={() => {
                                  const stageIdx = kanbanStages.findIndex((s) => s.id === stage.id);
                                  if (stageIdx > 0) handleMoveDealStage(deal.id, kanbanStages[stageIdx - 1].id);
                                }}
                                className="p-1 hover:bg-[#F5F4EF] rounded text-[#8A8881] hover:text-[#141413] disabled:opacity-20 cursor-pointer"
                                title="Mover a etapa anterior"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDeal({ ...deal });
                                  setDealModalOpen(true);
                                }}
                                className="text-[10px] font-semibold text-[#8A8881] hover:text-[#141413]"
                              >
                                Detalles
                              </button>

                              <button
                                type="button"
                                disabled={stage.id === 'lost'}
                                onClick={() => {
                                  const stageIdx = kanbanStages.findIndex((s) => s.id === stage.id);
                                  if (stageIdx < kanbanStages.length - 1) handleMoveDealStage(deal.id, kanbanStages[stageIdx + 1].id);
                                }}
                                className="p-1 hover:bg-[#F5F4EF] rounded text-[#8A8881] hover:text-[#141413] disabled:opacity-20 cursor-pointer"
                                title="Avanzar de etapa"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table View */}
          {pipelineViewMode === 'table' && (
            <div className="bg-white rounded-xl border border-[#E5E3DC] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FBFBF9] text-[#5C5B56] border-b border-[#E5E3DC] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Oportunidad & Cliente</th>
                    <th className="px-6 py-3.5">Etapa</th>
                    <th className="px-6 py-3.5">Valor & Probabilidad</th>
                    <th className="px-6 py-3.5">Socio Asignado</th>
                    <th className="px-6 py-3.5">Cierre Previsto</th>
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  {filteredDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-[#FDFDFD]">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#141413] text-sm">{deal.title}</div>
                        <div className="text-[11px] text-[#5C5B56] mt-0.5">{deal.clientName}</div>
                      </td>
                      <td className="px-6 py-4 capitalize font-semibold text-[#141413]">
                        <Badge
                          variant={
                            deal.stage === 'won'
                              ? 'success'
                              : deal.stage === 'proposal' || deal.stage === 'negotiation'
                              ? 'brand'
                              : 'neutral'
                          }
                        >
                          {deal.stage}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#141413]">
                          ${deal.valueUsd.toLocaleString()} USD
                        </span>
                        <span className="text-[10px] text-[#8A8881] block">
                          {deal.probabilityPercent}% probabilidad
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#141413]">{deal.assignedPartner}</td>
                      <td className="px-6 py-4 font-mono text-[11px] text-[#5C5B56]">{deal.expectedCloseDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDeal({ ...deal });
                            setDealModalOpen(true);
                          }}
                          className="p-1.5 text-[#5C5B56] hover:text-[#141413] hover:bg-[#F5F4EF] rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DIRECTORIO DE CLIENTES */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A8881]" />
              <Input
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Buscar cliente por empresa, contacto o email..."
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select
                label=""
                value={clientTierFilter}
                onChange={(e) => setClientTierFilter(e.target.value)}
                options={[
                  { value: 'todos', label: 'Todos los segmentos (Tiers)' },
                  { value: 'vip', label: 'VIP' },
                  { value: 'enterprise', label: 'Enterprise' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'lead', label: 'Prospecto (Lead)' },
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E3DC] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FBFBF9] text-[#5C5B56] border-b border-[#E5E3DC] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Empresa & Contacto</th>
                    <th className="px-6 py-3.5">Industria</th>
                    <th className="px-6 py-3.5">Segmento (Tier)</th>
                    <th className="px-6 py-3.5">Estado</th>
                    <th className="px-6 py-3.5">Sitio Gestionado</th>
                    <th className="px-6 py-3.5">Contrato (TCV)</th>
                    <th className="px-6 py-3.5">Socio Asignado</th>
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  {filteredClients.map((cli) => (
                    <tr key={cli.id} className="hover:bg-[#FDFDFD] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#141413] text-sm">{cli.name}</div>
                        <div className="text-[11px] text-[#5C5B56]">{cli.contactPerson}</div>
                        <div className="text-[10px] font-mono text-[#8A8881] mt-0.5">{cli.email}</div>
                      </td>

                      <td className="px-6 py-4 font-medium text-[#141413]">{cli.industry}</td>

                      <td className="px-6 py-4 uppercase font-bold text-[10px]">
                        <Badge
                          variant={
                            cli.tier === 'vip'
                              ? 'brand'
                              : cli.tier === 'enterprise'
                              ? 'success'
                              : 'neutral'
                          }
                        >
                          {cli.tier}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 capitalize font-semibold text-[#141413]">
                        {cli.status === 'active' ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Activo</span>
                          </span>
                        ) : (
                          <span className="text-stone-500">Prospecto</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {cli.managedSiteIds && cli.managedSiteIds.length > 0 ? (
                          <span className="text-[11px] font-mono text-[#C85A32]">
                            {cli.managedSiteIds.join(', ')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8A8881]">Sin sitio asociado</span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-[#141413]">
                        ${cli.totalContractValueUsd.toLocaleString()} USD
                      </td>

                      <td className="px-6 py-4 text-[#5C5B56]">{cli.assignedPartner}</td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingClient({ ...cli });
                              setClientModalOpen(true);
                            }}
                            className="p-1.5 text-[#5C5B56] hover:text-[#141413] hover:bg-[#F5F4EF] rounded-lg transition-colors cursor-pointer"
                            title="Editar cliente"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TAREAS & HITOS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Tareas & Compromisos de Entrega</h2>
              <p className="text-xs text-[#5C5B56]">
                Seguimiento de hitos técnicos y acuerdos con clientes asignados a los socios fundadores.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setNewTaskTitle('');
                setNewTaskClient(clients[0]?.id || '');
                setTaskModalOpen(true);
              }}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nueva Tarea</span>
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E3DC] divide-y divide-[#F0EFEA]">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#FDFDFD] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleToggleTask(task)}
                    className="w-4 h-4 rounded text-[#C85A32] accent-[#C85A32] cursor-pointer"
                  />
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        task.status === 'completed'
                          ? 'line-through text-[#8A8881]'
                          : 'text-[#141413]'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#5C5B56] mt-0.5">
                      {task.clientName && <span>Cliente: {task.clientName}</span>}
                      <span>•</span>
                      <span>Asignado: {task.assignedTo}</span>
                      <span>•</span>
                      <span className="font-mono">Vence: {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant={
                    task.priority === 'high'
                      ? 'warning'
                      : task.status === 'completed'
                      ? 'success'
                      : 'neutral'
                  }
                >
                  {task.status === 'completed' ? 'Completada' : `Prioridad ${task.priority}`}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LÍNEA DE TIEMPO & NOTAS */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Historial de Interacciones & Notas</h2>
              <p className="text-xs text-[#5C5B56]">
                Registro inmutable de acuerdos, llamadas y propuestas comerciales.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewActivityTitle('');
                setNewActivityDesc('');
                setNewActivityClient(clients[0]?.id || '');
                setActivityNoteOpen(true);
              }}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar Interacción</span>
            </Button>
          </div>

          <div className="space-y-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-4 bg-white rounded-xl border border-[#E5E3DC] flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F5F4EF] text-[#C85A32] flex items-center justify-center shrink-0 mt-0.5">
                  {act.type === 'call' && <Phone className="w-4 h-4" />}
                  {act.type === 'meeting' && <Users className="w-4 h-4" />}
                  {act.type === 'proposal' && <FileText className="w-4 h-4" />}
                  {act.type === 'note' && <Briefcase className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#141413]">{act.title}</h4>
                    <span className="font-mono text-[10px] text-[#8A8881]">
                      {new Date(act.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {act.clientName && (
                    <span className="text-[11px] font-semibold text-[#C85A32] block mt-0.5">
                      {act.clientName}
                    </span>
                  )}
                  <p className="text-xs text-[#5C5B56] mt-1 leading-relaxed">{act.description}</p>
                  <span className="text-[10px] text-[#8A8881] block mt-2">
                    Registrado por {act.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SATÉLITE DEMO CRM CHAT */}
      {activeTab === 'chat_satellite' && (
        <div className="bg-white rounded-2xl border border-[#E5E3DC] p-8 max-w-4xl space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F5F4EF] text-[#C85A32] flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#141413] font-editorial-heading">
                  Plataforma Satélite SaaS: LyberateDesk / LyberateChat (Demo Externa)
                </h3>
                <Badge variant="brand">Aislado / SaaS</Badge>
              </div>
              <p className="text-xs text-[#5C5B56] mt-1 font-editorial-body leading-relaxed">
                Conforme a la decisión de arquitectura ADR-002 y la estrategia de producto de los socios fundadores, la plataforma de chat multicanal se mantiene como un servicio desacoplado e independiente (bajo modelo de suscripción / demo pública) protegiendo el núcleo de Centauri de licencias copyleft (AGPLv3).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#F0EFEA] text-xs">
            <div className="p-4 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] space-y-2">
              <span className="font-bold text-[#141413] block">Propósito del Satélite:</span>
              <p className="text-[#5C5B56] leading-relaxed">
                Permitir que clientes y visitantes prueben en vivo la experiencia de mensajería unificada (WhatsApp, Telegram, Webchat) sin comprometer la base de código de Lyberate.
              </p>
            </div>

            <div className="p-4 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] space-y-2">
              <span className="font-bold text-[#141413] block">Estado de Integración:</span>
              <p className="text-[#5C5B56] leading-relaxed">
                Aislado por diseño. Se comunicará con Centauri exclusivamente vía Webhooks autenticados cuando esté desplegado en su servidor propio.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-emerald-900">
              <strong>Entorno Demo Preparado:</strong> Puedes desplegar y conectar la demo pública de chat cuando esté lista sin alterar este panel.
            </div>
            <a
              href="https://github.com/Lyberate-app/CrmChatLyberateSis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline shrink-0"
            >
              <span>Repositorio del Satélite</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* MODAL: CREAR / EDITAR DEAL */}
      {dealModalOpen && editingDeal && (
        <Dialog
          isOpen={true}
          onClose={() => setDealModalOpen(false)}
          title={editingDeal.id ? 'Editar Oportunidad Comercial' : 'Nueva Oportunidad de Venta'}
          description="Configura los detalles comerciales, etapas y probabilidad estimada de cierre."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setDealModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveDeal}>
                Guardar Oportunidad
              </Button>
            </div>
          }
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input
              label="Título de la Oportunidad"
              value={editingDeal.title || ''}
              onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
              placeholder="Ej: Rediseño Web & PWA Periodística"
              required
            />

            <Select
              label="Cliente / Cuenta Asociada"
              value={editingDeal.clientId || ''}
              onChange={(e) => {
                const c = clients.find((cli) => cli.id === e.target.value);
                setEditingDeal({
                  ...editingDeal,
                  clientId: e.target.value,
                  clientName: c?.name || '',
                });
              }}
              options={clients.map((c) => ({ value: c.id, label: `${c.name} (${c.companyName})` }))}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Etapa del Pipeline"
                value={editingDeal.stage || 'lead'}
                onChange={(e) => setEditingDeal({ ...editingDeal, stage: e.target.value as DealStage })}
                options={[
                  { value: 'lead', label: '1. Contacto / Lead' },
                  { value: 'discovery', label: '2. Alcance & Auditoría' },
                  { value: 'proposal', label: '3. Propuesta Entregada' },
                  { value: 'negotiation', label: '4. Negociación' },
                  { value: 'won', label: '5. Ganada' },
                  { value: 'lost', label: '6. Descartada' },
                ]}
              />

              <Input
                label="Valor Estimado ($ USD)"
                type="number"
                value={String(editingDeal.valueUsd || 0)}
                onChange={(e) => setEditingDeal({ ...editingDeal, valueUsd: Number(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Probabilidad de Cierre (%)"
                type="number"
                value={String(editingDeal.probabilityPercent || 20)}
                onChange={(e) => setEditingDeal({ ...editingDeal, probabilityPercent: Number(e.target.value) })}
              />

              <Input
                label="Fecha Prevista de Cierre"
                type="date"
                value={editingDeal.expectedCloseDate || ''}
                onChange={(e) => setEditingDeal({ ...editingDeal, expectedCloseDate: e.target.value })}
              />
            </div>

            <Select
              label="Categoría de Servicio"
              value={editingDeal.serviceCategory || 'Desarrollo a Medida'}
              onChange={(e) => setEditingDeal({ ...editingDeal, serviceCategory: e.target.value })}
              options={[
                { value: 'Desarrollo a Medida', label: 'Desarrollo a Medida' },
                { value: 'Plataforma Componible', label: 'Plataforma Componible' },
                { value: 'Consultoría & Auditoría', label: 'Consultoría & Auditoría' },
                { value: 'Mantenimiento Cloud', label: 'Mantenimiento Cloud' },
              ]}
            />

            <Textarea
              label="Alcance Técnico Resumido"
              value={editingDeal.technicalScopeSummary || ''}
              onChange={(e) => setEditingDeal({ ...editingDeal, technicalScopeSummary: e.target.value })}
              rows={2}
              placeholder="Resumen de tecnologías e integraciones estimadas..."
            />
          </div>
        </Dialog>
      )}

      {/* MODAL: CREAR / EDITAR CLIENTE */}
      {clientModalOpen && editingClient && (
        <Dialog
          isOpen={true}
          onClose={() => setClientModalOpen(false)}
          title={editingClient.id ? 'Editar Cuenta de Cliente' : 'Registrar Nuevo Cliente'}
          description="Datos corporativos y relación de servicio con Lyberate."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setClientModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveClient}>
                Guardar Cliente
              </Button>
            </div>
          }
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input
              label="Nombre Comercial"
              value={editingClient.name || ''}
              onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
              placeholder="Ej: Distribuidora Nacional"
              required
            />

            <Input
              label="Razón Social / Empresa Legal"
              value={editingClient.companyName || ''}
              onChange={(e) => setEditingClient({ ...editingClient, companyName: e.target.value })}
              placeholder="Ej: Distribuidora Nacional C.A."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Persona de Contacto"
                value={editingClient.contactPerson || ''}
                onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                placeholder="Nombre y apellido"
              />

              <Input
                label="Correo Electrónico"
                type="email"
                value={editingClient.email || ''}
                onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                placeholder="contacto@empresa.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Teléfono / WhatsApp"
                value={editingClient.phone || ''}
                onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                placeholder="+58 412..."
              />

              <Input
                label="Industria / Sector"
                value={editingClient.industry || ''}
                onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                placeholder="Retail, Salud, Logística..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Segmento (Tier)"
                value={editingClient.tier || 'standard'}
                onChange={(e) => setEditingClient({ ...editingClient, tier: e.target.value as ClientTier })}
                options={[
                  { value: 'vip', label: 'VIP' },
                  { value: 'enterprise', label: 'Enterprise' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'lead', label: 'Lead' },
                ]}
              />

              <Select
                label="Socio Asignado"
                value={editingClient.assignedPartner || 'Valdez'}
                onChange={(e) => setEditingClient({ ...editingClient, assignedPartner: e.target.value })}
                options={[
                  { value: 'Valdez', label: 'Valdez (Socio Fundador)' },
                  { value: 'Socio Fundador', label: 'Socio Fundador' },
                ]}
              />
            </div>

            <Textarea
              label="Notas y Observaciones"
              value={editingClient.notes || ''}
              onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
              rows={2}
            />
          </div>
        </Dialog>
      )}

      {/* MODAL: NUEVA TAREA */}
      {taskModalOpen && (
        <Dialog
          isOpen={true}
          onClose={() => setTaskModalOpen(false)}
          title="Asignar Nueva Tarea / Hito"
          description="Crea un compromiso operativo o de entrega vinculado a un cliente."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setTaskModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateTask}>
                Asignar Tarea
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Descripción de la tarea"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Ej: Entregar propuesta técnica y arquitectura de base de datos"
              required
            />

            <Select
              label="Cliente Vinculado (Opcional)"
              value={newTaskClient}
              onChange={(e) => setNewTaskClient(e.target.value)}
              options={[{ value: '', label: 'Sin vincular a cliente específico' }, ...clients.map((c) => ({ value: c.id, label: c.name }))]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Fecha Límite"
                type="date"
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
              />

              <Select
                label="Prioridad"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as CrmTaskDTO['priority'])}
                options={[
                  { value: 'high', label: 'Alta' },
                  { value: 'medium', label: 'Media' },
                  { value: 'low', label: 'Baja' },
                ]}
              />
            </div>
          </div>
        </Dialog>
      )}

      {/* MODAL: REGISTRAR INTERACCIÓN */}
      {activityNoteOpen && (
        <Dialog
          isOpen={true}
          onClose={() => setActivityNoteOpen(false)}
          title="Registrar Interacción o Nota"
          description="Añade un hito o resumen de conversación a la línea de tiempo del CRM."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setActivityNoteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleLogActivity}>
                Registrar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Título del evento o reunión"
              value={newActivityTitle}
              onChange={(e) => setNewActivityTitle(e.target.value)}
              placeholder="Ej: Llamada de seguimiento de requerimientos"
              required
            />

            <Select
              label="Tipo de Interacción"
              value={newActivityType}
              onChange={(e) => setNewActivityType(e.target.value as CrmActivityDTO['type'])}
              options={[
                { value: 'call', label: 'Llamada telefónica' },
                { value: 'meeting', label: 'Reunión presencial / virtual' },
                { value: 'proposal', label: 'Envío de propuesta' },
                { value: 'audit', label: 'Auditoría técnica' },
                { value: 'note', label: 'Nota interna' },
              ]}
            />

            <Select
              label="Cliente Vinculado"
              value={newActivityClient}
              onChange={(e) => setNewActivityClient(e.target.value)}
              options={[{ value: '', label: 'General / Sin cliente' }, ...clients.map((c) => ({ value: c.id, label: c.name }))]}
            />

            <Textarea
              label="Detalle de los acuerdos o notas"
              value={newActivityDesc}
              onChange={(e) => setNewActivityDesc(e.target.value)}
              rows={3}
              placeholder="Puntos tratados, compromisos y siguientes pasos..."
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};
