import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  FileText,
  DollarSign,
  Printer,
} from 'lucide-react';
import { centauriProjectRepository } from '../../repositories/centauriProjectRepository';
import { mockBackendRepository } from '../../repositories/mockBackendRepository';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Dialog } from '../../components/ui/Dialog';
import {
  CentauriProjectDTO,
  DeliverableStatus,
  ProjectDocumentSnapshotDTO,
} from '../../types/projects';

export const ProjectsHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filterFromUrl = searchParams.get('status');

  const [projects, setProjects] = useState<CentauriProjectDTO[]>(() =>
    centauriProjectRepository.getAllProjects()
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects[0]?.id || null
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(filterFromUrl || 'todos');

  // Modales
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCompany, setNewProjectCompany] = useState('');
  const [newProjectContactName, setNewProjectContactName] = useState('');
  const [newProjectContactEmail, setNewProjectContactEmail] = useState('');
  const [newProjectScope, setNewProjectScope] = useState('');
  const [newProjectAmount, setNewProjectAmount] = useState('5000');
  const [newProjectPartner, setNewProjectPartner] = useState<'Valdez' | 'Socio Fundador'>('Valdez');
  const [newProjectValdezPct, setNewProjectValdezPct] = useState('50');

  // Modal documento snapshot
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedDocSnapshot, setSelectedDocSnapshot] = useState<ProjectDocumentSnapshotDTO | null>(null);

  // Modal generar nuevo documento
  const [generateDocModalOpen, setGenerateDocModalOpen] = useState(false);
  const [docTemplateType, setDocTemplateType] = useState<'project_agreement' | 'commercial_proposal' | 'institutional'>('project_agreement');
  const [docVersionLabel, setDocVersionLabel] = useState('v1.0 (Borrador de Acuerdo)');

  // Modal entrega
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [activeDeliverableId, setActiveDeliverableId] = useState<string | null>(null);
  const [deliverableStatusInput, setDeliverableStatusInput] = useState<DeliverableStatus>('delivered');
  const [deliverableNotesInput, setDeliverableNotesInput] = useState('');

  // Modal acuerdo socios
  const [distributionModalOpen, setDistributionModalOpen] = useState(false);
  const [distValdezPct, setDistValdezPct] = useState('50');
  const [distNotes, setDistNotes] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const session = mockBackendRepository.getSession();
  const currentPartnerName = session?.profileId === 'valdez' ? 'Valdez' : 'Socio Fundador';

  const refreshProjects = () => {
    setProjects(centauriProjectRepository.getAllProjects());
  };

  useEffect(() => {
    const handleUpdate = () => refreshProjects();
    window.addEventListener('lyberate-projects-update', handleUpdate);
    return () => window.removeEventListener('lyberate-projects-update', handleUpdate);
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !newProjectCompany.trim()) {
      showNotification('error', 'Por favor ingresa nombre del proyecto y de la empresa.');
      return;
    }

    const valdezPct = Number(newProjectValdezPct) || 50;
    const socioPct = 100 - valdezPct;

    const created = centauriProjectRepository.createProject({
      name: newProjectName.trim(),
      companyId: `cli-${Date.now()}`,
      companyName: newProjectCompany.trim(),
      primaryContact: {
        name: newProjectContactName.trim() || 'Contacto Principal',
        email: newProjectContactEmail.trim() || 'contacto@empresa.com',
      },
      assignedPartner: newProjectPartner,
      status: 'planning',
      scopeSummary: newProjectScope.trim() || 'Alcance técnico acordado para desarrollo digital.',
      deliverables: [
        {
          id: `del-${Date.now()}-1`,
          title: 'Arquitectura & Definición de Alcance',
          description: 'Documento técnico con entregables validados y cronograma.',
          status: 'in_progress',
          targetDueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        },
      ],
      tasks: [
        {
          id: `tsk-${Date.now()}-1`,
          title: 'Llamada inicial de alineación técnica',
          assignedTo: newProjectPartner,
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          priority: 'high',
        },
      ],
      milestones: [
        {
          id: `mls-${Date.now()}-1`,
          title: 'Anticipo inicial del 50%',
          targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          paymentTriggerAmountUsd: Number(newProjectAmount) * 0.5,
        },
      ],
      startDate: new Date().toISOString().split('T')[0],
      targetDeliveryDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      paymentStatus: 'unpaid',
      totalAgreedAmount: Number(newProjectAmount) || 5000,
      currency: 'USD',
      valdezPercent: valdezPct,
      socioPercent: socioPct,
    });

    refreshProjects();
    setSelectedProjectId(created.id);
    setNewProjectModalOpen(false);
    showNotification('success', `Proyecto "${created.name}" (${created.code}) inicializado con éxito.`);
  };

  const handleUpdateDeliverable = () => {
    if (!selectedProject || !activeDeliverableId) return;
    try {
      centauriProjectRepository.updateDeliverableStatus(
        selectedProject.id,
        activeDeliverableId,
        deliverableStatusInput,
        deliverableNotesInput.trim() || undefined
      );
      refreshProjects();
      setDeliverableModalOpen(false);
      showNotification('success', 'Estado del entregable actualizado exitosamente.');
    } catch {
      showNotification('error', 'Error al actualizar entregable.');
    }
  };

  const handleGenerateDoc = () => {
    if (!selectedProject) return;
    try {
      const snapshot = centauriProjectRepository.generateDocumentSnapshot(
        selectedProject.id,
        docTemplateType,
        {
          versionLabel: docVersionLabel.trim() || 'v1.0 (Inmutable)',
          author: currentPartnerName,
        }
      );
      refreshProjects();
      setGenerateDocModalOpen(false);
      setSelectedDocSnapshot(snapshot);
      setDocumentModalOpen(true);
      showNotification('success', `Documento ${snapshot.documentNumber} generado con snapshot inmutable.`);
    } catch {
      showNotification('error', 'Error al generar documento.');
    }
  };

  const handleSaveDistribution = () => {
    if (!selectedProject) return;
    const vPct = Number(distValdezPct);
    if (isNaN(vPct) || vPct < 0 || vPct > 100) {
      showNotification('error', 'El porcentaje debe estar entre 0 y 100.');
      return;
    }
    const sPct = 100 - vPct;
    try {
      centauriProjectRepository.updatePartnerDistribution(
        selectedProject.id,
        vPct,
        sPct,
        distNotes.trim() || `Acuerdo fijado en ${vPct}% Valdez / ${sPct}% Socio`,
        currentPartnerName
      );
      refreshProjects();
      setDistributionModalOpen(false);
      showNotification('success', 'Acuerdo de distribución entre socios guardado.');
    } catch (e: any) {
      showNotification('error', e.message || 'Error al guardar distribución.');
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[11px] font-bold text-[#7C3AED] mb-2">
            <Briefcase className="w-3 h-3" />
            <span>Gestión de Proyectos, Entregas y Documentos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Centro de Proyectos & Entregas
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5B56] mt-1 max-w-2xl font-editorial-body">
            Ciclo de ejecución completo: vinculación de empresa y propuesta, entregables, cronograma, hitos de pago, documentos con snapshot inmutable y acuerdos de socios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setNewProjectModalOpen(true)}
            className="gap-2 btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Grid: Projects List + Detailed Selected Project Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Directorio de Proyectos (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-[#E5E3DC] space-y-3 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8A8881]" />
              <input
                type="text"
                placeholder="Buscar por código, nombre o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FBFBF9] border border-[#E5E3DC] text-[#141413] focus:outline-2 focus:outline-[#7C3AED]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#FBFBF9] border border-[#E5E3DC] text-[#5C5B56]"
              >
                <option value="todos">Todos los estados ({projects.length})</option>
                <option value="in_progress">En curso</option>
                <option value="planning">Planificación</option>
                <option value="review">En revisión</option>
                <option value="completed">Completados</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredProjects.map((p) => {
              const isSelected = p.id === selectedProjectId;
              const completedDeliv = p.deliverables.filter(
                (d) => d.status === 'delivered' || d.status === 'accepted'
              ).length;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#7C3AED] shadow-[0_4px_20px_rgba(124,58,237,0.12)] ring-1 ring-[#7C3AED]'
                      : 'bg-white border-[#E5E3DC] hover:border-[#D1CEBF] hover:bg-[#FBFBF9]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-md">
                      {p.code}
                    </span>
                    <Badge
                      variant={
                        p.status === 'completed'
                          ? 'success'
                          : p.status === 'in_progress'
                          ? 'brand'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {p.status === 'in_progress'
                        ? 'En Curso'
                        : p.status === 'planning'
                        ? 'Planificación'
                        : p.status === 'completed'
                        ? 'Completado'
                        : 'Revisión'}
                    </Badge>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-[#141413] leading-snug line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#5C5B56] line-clamp-1">{p.companyName}</p>

                  <div className="mt-3 pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-[11px] text-[#8A8881]">
                    <span>
                      Entregas: {completedDeliv}/{p.deliverables.length}
                    </span>
                    <span
                      className={`font-semibold ${
                        p.paymentStatus === 'paid'
                          ? 'text-emerald-700'
                          : p.paymentStatus === 'partial'
                          ? 'text-amber-700'
                          : 'text-red-700'
                      }`}
                    >
                      {p.paymentStatus === 'paid'
                        ? 'Pago 100%'
                        : p.paymentStatus === 'partial'
                        ? 'Pago Parcial'
                        : 'Pago Pendiente'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Ficha Integral de Proyecto Seleccionado (col-span-8) */}
        {selectedProject ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Header del Proyecto */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E3DC] space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-1 rounded-md border border-[#DDD6FE]">
                      {selectedProject.code}
                    </span>
                    <span className="text-xs text-[#8A8881]">
                      Responsable: <strong>{selectedProject.assignedPartner}</strong>
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-[#141413] font-editorial-heading">
                    {selectedProject.name}
                  </h2>
                  <p className="text-xs text-[#5C5B56] mt-0.5">
                    Empresa: <strong>{selectedProject.companyName}</strong> · Contacto: {selectedProject.primaryContact.name} ({selectedProject.primaryContact.email})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDistValdezPct(String(selectedProject.partnerDistribution?.valdezPercent ?? 50));
                      setDistNotes('');
                      setDistributionModalOpen(true);
                    }}
                    className="text-xs gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Acuerdo Socios ({selectedProject.partnerDistribution?.valdezPercent ?? 50} / {selectedProject.partnerDistribution?.socioPercent ?? 50})</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setGenerateDocModalOpen(true)}
                    className="text-xs gap-1.5 btn-press"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generar Documento</span>
                  </Button>
                </div>
              </div>

              {/* Métricas Separadas: Entrega vs Pago */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC]">
                  <span className="text-[10px] font-bold text-[#8A8881] uppercase block">Estado Proyecto</span>
                  <span className="text-sm font-bold text-[#141413] block mt-1 capitalize">
                    {selectedProject.status === 'in_progress' ? 'En Ejecución' : selectedProject.status}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC]">
                  <span className="text-[10px] font-bold text-[#8A8881] uppercase block">Estado Entrega</span>
                  <span className="text-sm font-bold text-blue-700 block mt-1">
                    {selectedProject.deliverables.filter(d => d.status === 'delivered' || d.status === 'accepted').length} de {selectedProject.deliverables.length} Listos
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC]">
                  <span className="text-[10px] font-bold text-[#8A8881] uppercase block">Estado Pago</span>
                  <span className={`text-sm font-bold block mt-1 ${
                    selectedProject.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {selectedProject.paymentStatus === 'paid' ? '100% Cobrado' : 'Cobro Parcial'} (${selectedProject.totalAgreedAmount} {selectedProject.currency})
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC]">
                  <span className="text-[10px] font-bold text-[#8A8881] uppercase block">Fecha Entrega Meta</span>
                  <span className="text-sm font-bold text-[#141413] block mt-1 font-mono">
                    {selectedProject.targetDeliveryDate}
                  </span>
                </div>
              </div>

              {/* Alcance General */}
              <div className="p-4 rounded-2xl bg-[#F5F4EF]/50 border border-[#E5E3DC] text-xs text-[#5C5B56] space-y-1">
                <span className="font-bold text-[#141413] block">Alcance Acordado:</span>
                <p>{selectedProject.scopeSummary}</p>
              </div>
            </div>

            {/* SECCIÓN 1: ENTREGABLES DEL PROYECTO */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E3DC] space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#141413] font-editorial-heading">
                    Entregables & Compromisos
                  </h3>
                  <p className="text-xs text-[#5C5B56]">
                    Control del avance técnico separado del estado de cobranza.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedProject.deliverables.map((deliv) => {
                  const statusColors: Record<DeliverableStatus, string> = {
                    planned: 'bg-zinc-100 text-zinc-700 border-zinc-200',
                    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
                    ready_for_review: 'bg-amber-50 text-amber-700 border-amber-200',
                    delivered: 'bg-purple-50 text-purple-700 border-purple-200',
                    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  };
                  return (
                    <div
                      key={deliv.id}
                      className="p-4 rounded-2xl border border-[#E5E3DC] bg-[#FBFBF9] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#141413]">{deliv.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[deliv.status]}`}>
                            {deliv.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-[#5C5B56]">{deliv.description}</p>
                        {deliv.reviewNotes && (
                          <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                            Nota de revisión: {deliv.reviewNotes}
                          </p>
                        )}
                        <span className="text-[10px] text-[#8A8881] block">
                          Fecha objetivo: {deliv.targetDueDate} {deliv.deliveredAt && `· Entregado el ${deliv.deliveredAt}`}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveDeliverableId(deliv.id);
                          setDeliverableStatusInput(deliv.status);
                          setDeliverableNotesInput(deliv.reviewNotes || '');
                          setDeliverableModalOpen(true);
                        }}
                        className="text-xs shrink-0"
                      >
                        Actualizar estado
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 2: DOCUMENTOS Y CONTRATOS GENERADOS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E3DC] space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#141413] font-editorial-heading">
                    Documentos & Snapshots Inmutables ({selectedProject.documents?.length || 0})
                  </h3>
                  <p className="text-xs text-[#5C5B56]">
                    Copias estables de los acuerdos generados para evitar mutaciones silenciosas.
                  </p>
                </div>
              </div>

              {selectedProject.documents?.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-[#D1CEBF] bg-[#FBFBF9] space-y-2">
                  <FileText className="w-8 h-8 text-[#8A8881] mx-auto" />
                  <p className="text-xs text-[#5C5B56]">Aún no se han generado documentos formales para este proyecto.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGenerateDocModalOpen(true)}
                  >
                    Generar primer documento
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProject.documents?.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl border border-[#E5E3DC] bg-[#FBFBF9] flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#7C3AED]">{doc.documentNumber}</span>
                          <span className="text-xs font-semibold text-[#141413]">{doc.title}</span>
                          <span className="text-[10px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">{doc.versionLabel}</span>
                        </div>
                        <p className="text-[11px] text-[#8A8881]">
                          Generado por {doc.generatedBy} el {new Date(doc.generatedAt).toLocaleDateString()} · Importe: ${doc.financialTerms.totalAmount} {doc.financialTerms.currency}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDocSnapshot(doc);
                          setDocumentModalOpen(true);
                        }}
                        className="text-xs shrink-0 gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Ver / Imprimir</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECCIÓN 3: TAREAS E HISTORIAL DE ACTIVIDAD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tareas */}
              <div className="bg-white p-6 rounded-3xl border border-[#E5E3DC] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#141413]">Tareas del Proyecto</h4>
                  <span className="text-xs text-[#8A8881] font-mono">{selectedProject.tasks.length}</span>
                </div>
                <div className="space-y-2">
                  {selectedProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-[#E5E3DC] bg-[#FBFBF9] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#141413]">{task.title}</span>
                        <span className="text-[10px] font-mono text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.5 rounded">
                          {task.assignedTo}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#8A8881]">
                        <span>Vence: {task.dueDate}</span>
                        <span className={task.status === 'completed' ? 'text-emerald-700 font-bold' : ''}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bitácora de Actividad */}
              <div className="bg-white p-6 rounded-3xl border border-[#E5E3DC] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#141413]">Bitácora de Cambios</h4>
                  <span className="text-xs text-[#8A8881]">Inmutable</span>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedProject.activityHistory.map((act) => (
                    <div key={act.id} className="text-xs space-y-0.5 pb-2 border-b border-[#F0EFEA] last:border-0">
                      <span className="font-bold text-[#141413] block">{act.title}</span>
                      <p className="text-[#5C5B56] text-[11px]">{act.detail}</p>
                      <span className="text-[10px] text-[#8A8881]">
                        {act.author} · {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white rounded-3xl border border-[#E5E3DC]">
            <p className="text-sm text-[#5C5B56]">Selecciona un proyecto del listado.</p>
          </div>
        )}
      </div>

      {/* MODAL 1: NUEVO PROYECTO */}
      <Dialog
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        title="Crear Nuevo Proyecto en Centauri"
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Nombre del Proyecto"
            placeholder="Ej. Rediseño Web & Plataforma POS"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            required
          />
          <Input
            label="Empresa / Cliente"
            placeholder="Ej. Inversiones La Montaña C.A."
            value={newProjectCompany}
            onChange={(e) => setNewProjectCompany(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contacto Principal"
              placeholder="Nombre del cliente"
              value={newProjectContactName}
              onChange={(e) => setNewProjectContactName(e.target.value)}
            />
            <Input
              label="Correo de Contacto"
              type="email"
              placeholder="correo@empresa.com"
              value={newProjectContactEmail}
              onChange={(e) => setNewProjectContactEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Presupuesto Acordado (USD)"
              type="number"
              value={newProjectAmount}
              onChange={(e) => setNewProjectAmount(e.target.value)}
            />
            <div>
              <label className="block text-xs font-semibold text-[#141413] mb-1">Socio Responsable</label>
              <select
                value={newProjectPartner}
                onChange={(e) => setNewProjectPartner(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBF9] border border-[#E5E3DC] text-xs text-[#141413]"
              >
                <option value="Valdez">Valdez</option>
                <option value="Socio Fundador">Socio Fundador</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#141413] mb-1">
              Reparto Inicial de Honorarios (% Valdez)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={newProjectValdezPct}
              onChange={(e) => setNewProjectValdezPct(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FBFBF9] border border-[#E5E3DC] text-xs"
            />
            <p className="text-[11px] text-[#8A8881] mt-1">
              El {100 - (Number(newProjectValdezPct) || 50)}% restante se asignará al Socio Fundador. Configurable en cualquier momento.
            </p>
          </div>
          <Textarea
            label="Resumen de Alcance Técnico"
            placeholder="Detalla los entregables principales, tecnologías y expectativas del proyecto..."
            value={newProjectScope}
            onChange={(e) => setNewProjectScope(e.target.value)}
            rows={3}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setNewProjectModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateProject}>
              Crear Proyecto
            </Button>
          </div>
        </div>
      </Dialog>

      {/* MODAL 2: ACTUALIZAR ESTADO DE ENTREGABLE */}
      <Dialog
        isOpen={deliverableModalOpen}
        onClose={() => setDeliverableModalOpen(false)}
        title="Actualizar Estado del Entregable"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#141413] mb-1">Estado de Entrega</label>
            <select
              value={deliverableStatusInput}
              onChange={(e) => setDeliverableStatusInput(e.target.value as DeliverableStatus)}
              className="w-full px-3 py-2 rounded-xl bg-[#FBFBF9] border border-[#E5E3DC] text-xs"
            >
              <option value="planned">Planificado</option>
              <option value="in_progress">En ejecución técnica</option>
              <option value="ready_for_review">Listo para revisión interna / cliente</option>
              <option value="delivered">Entregado al cliente</option>
              <option value="accepted">Aceptado formalmente por cliente</option>
            </select>
          </div>
          <Textarea
            label="Notas de Revisión o Retroalimentación"
            placeholder="Observaciones de pruebas, feedback recibido o condiciones de aprobación..."
            value={deliverableNotesInput}
            onChange={(e) => setDeliverableNotesInput(e.target.value)}
            rows={3}
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeliverableModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleUpdateDeliverable}>
              Guardar Cambio
            </Button>
          </div>
        </div>
      </Dialog>

      {/* MODAL 3: GENERAR DOCUMENTO FORMAL CON SNAPSHOT */}
      <Dialog
        isOpen={generateDocModalOpen}
        onClose={() => setGenerateDocModalOpen(false)}
        title="Generar Documento con Snapshot Inmutable"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#141413] mb-1">Plantilla de Documento</label>
            <select
              value={docTemplateType}
              onChange={(e) => setDocTemplateType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#FBFBF9] border border-[#E5E3DC] text-xs"
            >
              <option value="project_agreement">Contrato de Servicios / Acuerdo Específico</option>
              <option value="commercial_proposal">Propuesta Comercial y Alcance Técnico</option>
              <option value="institutional">Presentación Institucional Lyberate Software Labs</option>
            </select>
          </div>

          <Input
            label="Etiqueta de Versión"
            placeholder="Ej. v1.0 (Aprobado para Firma)"
            value={docVersionLabel}
            onChange={(e) => setDocVersionLabel(e.target.value)}
          />

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <span className="font-bold block">Protección de Snapshot Inmutable:</span>
            <p>
              Al generar esta versión, se congelan los datos de partes, alcance, entregables, hitos y montos en un registro permanente. Si el cliente o el proyecto cambian después, esta versión conservará intactos los términos acordados.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setGenerateDocModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleGenerateDoc}>
              Generar y Congelar Snapshot
            </Button>
          </div>
        </div>
      </Dialog>

      {/* MODAL 4: VER / IMPRIMIR DOCUMENTO CON SNAPSHOT */}
      <Dialog
        isOpen={documentModalOpen}
        onClose={() => setDocumentModalOpen(false)}
        title={selectedDocSnapshot ? selectedDocSnapshot.documentNumber : 'Documento Generado'}
      >
        {selectedDocSnapshot && (
          <div className="space-y-6 text-xs max-h-[75vh] overflow-y-auto pr-2">
            {/* Header Impreso */}
            <div className="p-6 rounded-2xl bg-[#141413] text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#A78BFA]">{selectedDocSnapshot.documentNumber}</span>
                <span className="text-[10px] text-zinc-400 font-mono">{selectedDocSnapshot.versionLabel}</span>
              </div>
              <h3 className="text-lg font-bold font-editorial-heading">{selectedDocSnapshot.title}</h3>
              <p className="text-[11px] text-zinc-300">
                Emitido por {selectedDocSnapshot.parties.providerName} · Fecha: {new Date(selectedDocSnapshot.generatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Partes */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl border border-[#E5E3DC] bg-[#FBFBF9]">
              <div>
                <span className="font-bold text-[#141413] block">Prestador del Servicio:</span>
                <p className="text-[#5C5B56]">{selectedDocSnapshot.parties.providerName}</p>
                <p className="text-[#8A8881]">{selectedDocSnapshot.parties.providerRepresentative}</p>
              </div>
              <div>
                <span className="font-bold text-[#141413] block">Cliente / Contratante:</span>
                <p className="text-[#5C5B56]">{selectedDocSnapshot.parties.clientName}</p>
                <p className="text-[#8A8881]">Rep: {selectedDocSnapshot.parties.clientRepresentative} ({selectedDocSnapshot.parties.clientEmail})</p>
              </div>
            </div>

            {/* Alcance y Entregables Congelados */}
            <div className="p-4 rounded-2xl border border-[#E5E3DC] space-y-2">
              <span className="font-bold text-[#141413] block">Alcance & Entregables Acordados:</span>
              <p className="text-[#5C5B56]">{selectedDocSnapshot.scopeSnapshot.scopeSummary}</p>
              <ul className="list-disc pl-4 space-y-1 text-[#5C5B56] mt-2">
                {selectedDocSnapshot.scopeSnapshot.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            {/* Términos Financieros */}
            <div className="p-4 rounded-2xl border border-[#E5E3DC] bg-[#F5F3FF] space-y-1.5">
              <span className="font-bold text-[#141413] block">Condiciones Económicas:</span>
              <p className="text-sm font-bold text-[#7C3AED]">
                Importe Total: ${selectedDocSnapshot.financialTerms.totalAmount} {selectedDocSnapshot.financialTerms.currency}
              </p>
              <p className="text-[#5C5B56]">{selectedDocSnapshot.financialTerms.paymentMethodTerms}</p>
              <p className="text-[11px] text-[#8A8881]">{selectedDocSnapshot.financialTerms.milestoneBreakdown}</p>
            </div>

            {/* Cláusula de Transparencia */}
            <div className="p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E3DC] text-[11px] text-[#8A8881] leading-relaxed">
              {selectedDocSnapshot.legalNotice}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-[#8A8881]">Snapshot criptográfico inmutable verificado</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir comprobante</span>
                </Button>
                <Button variant="primary" size="sm" onClick={() => setDocumentModalOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* MODAL 5: ACUERDO DE DISTRIBUCIÓN ENTRE SOCIOS */}
      <Dialog
        isOpen={distributionModalOpen}
        onClose={() => setDistributionModalOpen(false)}
        title="Acuerdo de Distribución de Ingresos por Proyecto"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#5C5B56]">
            Configura el reparto de honorarios para este proyecto sin suponer repartos fijos ni sobreescribir acuerdos históricos.
          </p>

          <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#141413] mb-1">
                Porcentaje para Valdez (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={distValdezPct}
                onChange={(e) => setDistValdezPct(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E3DC] text-xs font-bold"
              />
            </div>

            <div className="flex justify-between text-xs pt-1">
              <span>Porcentaje Valdez: <strong>{distValdezPct}%</strong></span>
              <span>Porcentaje Socio: <strong>{100 - (Number(distValdezPct) || 0)}%</strong></span>
            </div>

            {selectedProject && (
              <div className="pt-2 border-t border-[#E5E3DC] flex justify-between text-xs font-mono text-[#7C3AED]">
                <span>Valdez: ${((selectedProject.totalAgreedAmount * (Number(distValdezPct) || 0)) / 100).toLocaleString()} USD</span>
                <span>Socio: ${((selectedProject.totalAgreedAmount * (100 - (Number(distValdezPct) || 0))) / 100).toLocaleString()} USD</span>
              </div>
            )}
          </div>

          <Textarea
            label="Justificación o Razón del Acuerdo"
            placeholder="Ej. Valdez asume el 70% de desarrollo backend y base de datos..."
            value={distNotes}
            onChange={(e) => setDistNotes(e.target.value)}
            rows={2}
          />

          {/* Historial de Acuerdos Pasados */}
          {selectedProject?.partnerDistribution?.history && (
            <div className="space-y-2 pt-2 border-t border-[#F0EFEA]">
              <span className="text-[11px] font-bold text-[#141413] block">Historial de Acuerdos Pasados:</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {selectedProject.partnerDistribution.history.map((h) => (
                  <div key={h.id} className="p-2 rounded-lg bg-[#FBFBF9] border border-[#E5E3DC] text-[11px] text-[#5C5B56]">
                    <div className="flex justify-between font-bold text-[#141413]">
                      <span>{h.valdezPercent}% Valdez / {h.socioPercent}% Socio</span>
                      <span className="text-[#8A8881] font-normal">{new Date(h.recordedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] text-[#8A8881] mt-0.5">{h.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDistributionModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveDistribution}>
              Guardar Acuerdo
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

