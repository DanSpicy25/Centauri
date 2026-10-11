import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Inbox,
  Users,
  Briefcase,
  CreditCard,
  Globe,
  Send,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { inquiryRepository } from '../../repositories/inquiryRepository';
import { crmRepository } from '../../repositories/crmRepository';
import { centauriProjectRepository } from '../../repositories/centauriProjectRepository';
import { paymentMovementRepository } from '../../repositories/paymentMovementRepository';
import { siteRepository } from '../../repositories/siteRepository';
import { messagingRepository } from '../../repositories/messagingRepository';

export const ControlRoomOverview: React.FC = () => {
  const navigate = useNavigate();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // States loaded from repositories
  const [inquirySummary, setInquirySummary] = useState(() => inquiryRepository.getSummary());
  const [pipelineSummary, setPipelineSummary] = useState(() => crmRepository.getPipelineSummary());
  const [projectSummary, setProjectSummary] = useState(() => centauriProjectRepository.getSummary());
  const [paymentSummary, setPaymentSummary] = useState(() => paymentMovementRepository.getSummary());
  const [messagingSummary, setMessagingSummary] = useState(() => messagingRepository.getSummary());
  const [sites, setSites] = useState(() => siteRepository.getAllSites());
  const [tasks, setTasks] = useState(() => crmRepository.getTasks());
  const [activities, setActivities] = useState(() => crmRepository.getActivities());
  const [projects, setProjects] = useState(() => centauriProjectRepository.getAll());
  const [pendingPayments, setPendingPayments] = useState(() =>
    paymentMovementRepository.getAll().filter((p) => p.status === 'reported')
  );

  const reloadData = () => {
    setInquirySummary(inquiryRepository.getSummary());
    setPipelineSummary(crmRepository.getPipelineSummary());
    setProjectSummary(centauriProjectRepository.getSummary());
    setPaymentSummary(paymentMovementRepository.getSummary());
    setMessagingSummary(messagingRepository.getSummary());
    setSites(siteRepository.getAllSites());
    setTasks(crmRepository.getTasks());
    setActivities(crmRepository.getActivities());
    setProjects(centauriProjectRepository.getAll());
    setPendingPayments(paymentMovementRepository.getAll().filter((p) => p.status === 'reported'));
  };

  useEffect(() => {
    const handleEvents = () => reloadData();
    window.addEventListener('lyberate-inquiries-update', handleEvents);
    window.addEventListener('lyberate-projects-update', handleEvents);
    window.addEventListener('lyberate-payments-update', handleEvents);
    window.addEventListener('lyberate-messages-update', handleEvents);
    window.addEventListener('lyberate-sites-update', handleEvents);
    window.addEventListener('storage', handleEvents);

    return () => {
      window.removeEventListener('lyberate-inquiries-update', handleEvents);
      window.removeEventListener('lyberate-projects-update', handleEvents);
      window.removeEventListener('lyberate-payments-update', handleEvents);
      window.removeEventListener('lyberate-messages-update', handleEvents);
      window.removeEventListener('lyberate-sites-update', handleEvents);
      window.removeEventListener('storage', handleEvents);
    };
  }, []);

  const handleResetAllDemoData = () => {
    inquiryRepository.resetToDefault();
    centauriProjectRepository.resetToDefault();
    paymentMovementRepository.resetToDefault();
    messagingRepository.resetToDefault();
    siteRepository.resetToDefault();
    crmRepository.resetToDefault();
    reloadData();
    setResetConfirmOpen(false);
    setFeedback('Todos los módulos de demostración se restablecieron a los valores predeterminados de fábrica.');
    setTimeout(() => setFeedback(null), 5000);
  };

  // Derived metrics
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const onlineSitesCount = sites.filter((s) => s.status === 'online').length;
  const avgLatency =
    onlineSitesCount > 0
      ? Math.round(
          sites.filter((s) => s.lastLatencyMs > 0).reduce((acc, s) => acc + s.lastLatencyMs, 0) /
            (sites.filter((s) => s.lastLatencyMs > 0).length || 1)
        )
      : 0;

  // Next deliverables due
  const upcomingDeliverables = projects
    .flatMap((p) =>
      p.deliverables
        .filter((d) => d.status !== 'accepted')
        .map((d) => ({
          ...d,
          projectName: p.name,
          clientName: p.companyName,
          projectId: p.id,
          projectCurrency: p.currency,
        }))
    )
    .sort((a, b) => new Date(a.targetDueDate).getTime() - new Date(b.targetDueDate).getTime())
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header & Executive Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FAF5FF] border border-[#E9D5FF] text-[11px] font-bold text-[#7C3AED] mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Cabina Operativa Privada · Valdez & Socio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141413] font-editorial-heading">
            Resumen Operativo — Centauri
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5B56] mt-1 font-editorial-body max-w-2xl">
            Control de cartera de clientes, entregables en curso, verificación de tesorería multimoneda y estado de servicios en vivo.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetConfirmOpen(true)}
            className="gap-2 text-[#5C5B56] hover:text-[#141413]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer Datos Demo
          </Button>

          <Link to="/admin/proyectos">
            <Button variant="primary" size="sm" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Ver Proyectos & Entregas
            </Button>
          </Link>
        </div>
      </div>

      {feedback && (
        <Alert variant="success" title="Acción completada">
          {feedback}
        </Alert>
      )}

      {/* Confirmation Modal for Reset */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E3DC] space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#141413]">¿Restablecer datos de demostración?</h3>
            </div>
            <p className="text-xs text-[#5C5B56] leading-relaxed">
              Esta acción reiniciará los buzones de consultas, estados de entregables, pagos multimoneda, tareas de CRM y telemetría a los datos predeterminados de fábrica. Ideal para volver a presentar el producto desde cero.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setResetConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleResetAllDemoData}>
                Confirmar y Restablecer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cockpit 6 Clickable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* KPI 1: Bandeja Central & Consultas */}
        <div
          onClick={() => navigate('/admin/crm')}
          className="bg-white p-5 rounded-2xl border border-[#E5E3DC] hover:border-[#A78BFA] hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
              <span className="uppercase tracking-wider">Bandeja de Consultas</span>
              <div className="p-2 rounded-xl bg-[#FAF5FF] text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#141413]">
              {inquirySummary.newInquiries} <span className="text-xs font-normal text-[#5C5B56]">nuevas</span>
            </div>
            <p className="text-xs text-[#5C5B56] mt-1">
              {inquirySummary.inReviewInquiries} en revisión • {inquirySummary.total} consultas totales registradas
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-xs text-[#7C3AED] font-medium">
            <span>Revisar bandeja y propuestas</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 2: CRM & Tareas de Seguimiento */}
        <div
          onClick={() => navigate('/admin/crm')}
          className="bg-white p-5 rounded-2xl border border-[#E5E3DC] hover:border-[#A78BFA] hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
              <span className="uppercase tracking-wider">CRM & Oportunidades</span>
              <div className="p-2 rounded-xl bg-[#FAF5FF] text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#141413]">
              {pipelineSummary.activeDealsCount} <span className="text-xs font-normal text-[#5C5B56]">negociaciones</span>
            </div>
            <p className="text-xs text-[#5C5B56] mt-1">
              ${pipelineSummary.totalPipelineValueUsd.toLocaleString()} USD en pipeline • {pendingTasks.length} tareas pendientes
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-xs text-[#7C3AED] font-medium">
            <span>Abrir pipeline comercial</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 3: Proyectos & Entregables */}
        <div
          onClick={() => navigate('/admin/proyectos')}
          className="bg-white p-5 rounded-2xl border border-[#E5E3DC] hover:border-[#A78BFA] hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
              <span className="uppercase tracking-wider">Proyectos & Entregables</span>
              <div className="p-2 rounded-xl bg-[#FAF5FF] text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#141413]">
              {projectSummary.activeProjects} <span className="text-xs font-normal text-[#5C5B56]">activos</span>
            </div>
            <p className="text-xs text-[#5C5B56] mt-1">
              {projectSummary.readyForReviewDeliverables} listos para revisión • {projectSummary.totalDeliverables} entregables totales
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-xs text-[#7C3AED] font-medium">
            <span>Gestionar entregas & contratos</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 4: Tesorería & Pagos Multimoneda */}
        <div
          onClick={() => navigate('/admin/finanzas')}
          className="bg-white p-5 rounded-2xl border border-[#E5E3DC] hover:border-[#A78BFA] hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
              <span className="uppercase tracking-wider">Cobranza Multimoneda</span>
              <div className="p-2 rounded-xl bg-[#FAF5FF] text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#141413]">
              {paymentSummary.reportedCount} <span className="text-xs font-normal text-amber-700 font-semibold">por verificar</span>
            </div>
            <p className="text-xs text-[#5C5B56] mt-1">
              VES: Bs. {paymentSummary.byCurrency.VES.verified.toLocaleString()} • USD: ${paymentSummary.byCurrency.USD.verified.toLocaleString()} • USDT: {paymentSummary.byCurrency.USDT.verified.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-xs text-[#7C3AED] font-medium">
            <span>Conciliar movimientos y Zelle/Pago Móvil</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 5: Sitios Supervisados */}
        <div
          onClick={() => navigate('/admin/sitios')}
          className="bg-white p-5 rounded-2xl border border-[#E5E3DC] hover:border-[#A78BFA] hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
              <span className="uppercase tracking-wider">Sitios Supervisados</span>
              <div className="p-2 rounded-xl bg-[#FAF5FF] text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#141413]">
              {onlineSitesCount}/{sites.length} <span className="text-xs font-normal text-emerald-700 font-semibold">online</span>
            </div>
            <p className="text-xs text-[#5C5B56] mt-1">
              Latencia promedio: {avgLatency} ms • 0 caídas críticas no mitigadas
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-xs text-[#7C3AED] font-medium">
            <span>Monitorear telemetría y pings</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 6: Mensajería & Despacho Multicanal */}
        <div
          onClick={() => navigate('/admin/automatizaciones')}
          className="bg-white p-5 rounded-2xl border border-[#E5E3DC] hover:border-[#A78BFA] hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
              <span className="uppercase tracking-wider">Mensajería Multicanal</span>
              <div className="p-2 rounded-xl bg-[#FAF5FF] text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#141413]">
              {messagingSummary.total} <span className="text-xs font-normal text-[#5C5B56]">mensajes</span>
            </div>
            <p className="text-xs text-[#5C5B56] mt-1">
              WhatsApp: {messagingSummary.byChannel.whatsapp} • Telegram: {messagingSummary.byChannel.telegram} • Email: {messagingSummary.byChannel.email}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-xs text-[#7C3AED] font-medium">
            <span>Simular envíos y respuestas</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Immediate Deliverables & Unverified Payments (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section: Próximas Entregas de Proyectos */}
          <div className="bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden">
            <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#141413]">Compromisos y Entregas Próximas</h3>
                <p className="text-xs text-[#5C5B56] mt-0.5">
                  Entregables activos desacoplados de la condición de pago.
                </p>
              </div>
              <Link to="/admin/proyectos" className="text-xs text-[#7C3AED] hover:underline font-semibold">
                Ver todos
              </Link>
            </div>

            <div className="divide-y divide-[#F0EFEA]">
              {upcomingDeliverables.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8A8881]">
                  No hay entregables pendientes en este momento.
                </div>
              ) : (
                upcomingDeliverables.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-[#FAF5FF]/30 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[#141413] truncate">{item.title}</span>
                        <Badge
                          variant={
                            item.status === 'ready_for_review'
                              ? 'brand'
                              : item.status === 'in_progress'
                              ? 'warning'
                              : item.status === 'delivered'
                              ? 'success'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {item.status === 'ready_for_review'
                            ? 'Listo p/ Revisión'
                            : item.status === 'in_progress'
                            ? 'En Progreso'
                            : item.status === 'delivered'
                            ? 'Entregado'
                            : 'Planificado'}
                        </Badge>
                      </div>
                      <div className="text-xs text-[#5C5B56] flex items-center gap-2">
                        <span className="font-semibold text-[#141413]">{item.clientName}</span>
                        <span>•</span>
                        <span>{item.projectName}</span>
                        <span>•</span>
                        <span className="text-[#8A8881] flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          {item.targetDueDate}
                        </span>
                      </div>
                    </div>

                    <Link to="/admin/proyectos">
                      <Button variant="outline" size="sm" className="shrink-0 text-xs gap-1.5">
                        <span>Revisar</span>
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Pagos Reportados por Verificar */}
          <div className="bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden">
            <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#141413]">Pagos Reportados Pendientes de Verificación</h3>
                <p className="text-xs text-[#5C5B56] mt-0.5">
                  Comprobantes emitidos por clientes antes de marcarse como verificados en tesorería.
                </p>
              </div>
              <Link to="/admin/finanzas" className="text-xs text-[#7C3AED] hover:underline font-semibold">
                Ir a Finanzas
              </Link>
            </div>

            <div className="divide-y divide-[#F0EFEA]">
              {pendingPayments.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8A8881]">
                  Todos los pagos reportados han sido verificados.
                </div>
              ) : (
                pendingPayments.map((p) => (
                  <div key={p.id} className="p-4 hover:bg-[#FAF5FF]/30 transition-colors flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[#141413] font-mono">
                          {p.currencyOriginal === 'VES' ? `Bs. ${p.amountOriginal.toLocaleString()}` : `${p.currencyOriginal} ${p.amountOriginal.toLocaleString()}`}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold uppercase">
                          {p.method.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-[#5C5B56]">
                        <span>{p.description}</span> • <span className="font-medium text-[#141413]">{p.companyName}</span>
                        {p.referenceNumber && (
                          <span className="text-[#8A8881] font-mono ml-1.5 text-[11px]">
                            (Ref: {p.referenceNumber})
                          </span>
                        )}
                      </div>
                    </div>

                    <Link to="/admin/finanzas">
                      <Button variant="primary" size="sm" className="shrink-0 text-xs">
                        Verificar
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Partners Activity Feed & Demonstration Protocol (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Partner Activity Feed */}
          <div className="bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden">
            <div className="p-5 border-b border-[#E5E3DC]">
              <h3 className="text-base font-bold text-[#141413]">Actividad Reciente de Socios</h3>
              <p className="text-xs text-[#5C5B56] mt-0.5">
                Auditoría cruzada de acciones ejecutadas por Valdez y Socio.
              </p>
            </div>

            <div className="p-5 space-y-4">
              {activities.slice(0, 5).map((act) => {
                const isValdez = act.author.toLowerCase().includes('valdez');
                return (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isValdez ? 'bg-[#7C3AED] text-white' : 'bg-[#141413] text-white'
                      }`}
                    >
                      {isValdez ? 'V' : 'S'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#141413]">{act.author}</span>
                        <span className="text-[10px] text-[#8A8881]">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[#141413] font-medium mt-0.5">{act.title}</p>
                      {act.description && (
                        <p className="text-[#5C5B56] text-[11px] mt-0.5 line-clamp-2">{act.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Demo Note Card */}
          <div className="bg-gradient-to-br from-[#FAF5FF] to-white rounded-2xl border border-[#E9D5FF] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#7C3AED]">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-sm text-[#141413]">Blindaje de Datos & Repositorios Tipados</h4>
            </div>
            <p className="text-xs text-[#5C5B56] leading-relaxed">
              Centauri opera actualmente con repositorios mock reactivos desacoplados (`src/repositories/*`) y contratos tipados en `src/types/backend.ts`. Cualquier cambio en el CRM, finanzas, proyectos o mensajería se persiste en el almacenamiento local de tu navegador y puede sustituirse por endpoints reales de backend sin alterar la interfaz de usuario.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8A8881]">Versión: Centauri v0.2.0 Demo</span>
              <Button
                variant="outline"
                size="sm"
                onClick={reloadData}
                className="gap-1.5 text-xs text-[#7C3AED] border-[#E9D5FF] hover:bg-[#FAF5FF]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Actualizar Vista
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
