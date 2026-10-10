import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { financeRepository } from '../../repositories/financeRepository';
import {
  SubscriptionPlanDTO,
  ClientSubscriptionDTO,
  InvoiceDTO,
  ProductPricingDTO,
} from '../../types/finance';
import { crmRepository } from '../../repositories/crmRepository';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import { Dialog } from '../../components/ui/Dialog';

export const FinanceHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions' | 'services' | 'invoices'>('plans');

  // Listas reactivas
  const [summary, setSummary] = useState(() => financeRepository.getFinancialSummary());
  const [plans, setPlans] = useState<SubscriptionPlanDTO[]>(() => financeRepository.getPlans());
  const [subscriptions, setSubscriptions] = useState<ClientSubscriptionDTO[]>(() =>
    financeRepository.getSubscriptions()
  );
  const [services, setServices] = useState<ProductPricingDTO[]>(() => financeRepository.getProducts());
  const [invoices, setInvoices] = useState<InvoiceDTO[]>(() => financeRepository.getInvoices());

  // Búsquedas y filtros
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('todos');

  // Modales
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [newInvoiceClientId, setNewInvoiceClientId] = useState('');
  const [newInvoiceConcept, setNewInvoiceConcept] = useState('');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState('2500');
  const [newInvoiceDueDate, setNewInvoiceDueDate] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPriceMonthly, setNewPlanPriceMonthly] = useState('49');
  const [newPlanProduct, setNewPlanProduct] = useState('prod-saas-chat');

  const [feedback, setFeedback] = useState<string | null>(null);

  const clients = crmRepository.getClients();

  const refreshAll = () => {
    setSummary(financeRepository.getFinancialSummary());
    setPlans(financeRepository.getPlans());
    setSubscriptions(financeRepository.getSubscriptions());
    setServices(financeRepository.getProducts());
    setInvoices(financeRepository.getInvoices());
  };

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Crear Factura
  const handleCreateInvoice = () => {
    if (!newInvoiceConcept.trim() || !newInvoiceClientId) return;
    const client = clients.find((c) => c.id === newInvoiceClientId);

    financeRepository.createInvoice({
      clientId: newInvoiceClientId,
      clientName: client?.name || 'Cliente',
      concept: newInvoiceConcept.trim(),
      amountUsd: Number(newInvoiceAmount) || 1000,
      dueDate: newInvoiceDueDate,
      status: 'pending',
    });

    refreshAll();
    setInvoiceModalOpen(false);
    setNewInvoiceConcept('');
    showNotification('Nueva factura registrada y añadida a la cuenta del cliente.');
  };

  // Marcar Factura como Pagada
  const handleMarkPaid = (id: string, method: InvoiceDTO['paymentMethod'] = 'transfer') => {
    financeRepository.markInvoicePaid(id, method);
    refreshAll();
    showNotification('Factura marcada como pagada. Cobro registrado en la bitácora financiera.');
  };

  // Crear Plan SaaS
  const handleCreatePlan = () => {
    if (!newPlanName.trim()) return;
    financeRepository.createPlan({
      planName: newPlanName.trim(),
      priceMonthlyUsd: Number(newPlanPriceMonthly) || 49,
      productId: newPlanProduct,
      productName: newPlanProduct === 'prod-saas-chat' ? 'LyberateDesk / LyberateChat' : 'Mantenimiento Cloudflare SLA',
      features: ['Soporte continuo', 'Configuración garantizada', 'Actualizaciones'],
    });

    refreshAll();
    setPlanModalOpen(false);
    setNewPlanName('');
    showNotification('Nuevo plan de suscripción creado.');
  };

  // Exportar Facturación a CSV
  const handleExportCsv = () => {
    const csv = financeRepository.exportInvoicesToCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lyberate_finanzas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Libro financiero exportado en formato CSV.');
  };

  // Filtrado de Facturas
  const filteredInvoices = invoices.filter((i) => {
    const matchesSearch =
      i.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      i.clientName.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      i.concept.toLowerCase().includes(invoiceSearch.toLowerCase());
    const matchesStatus =
      invoiceStatusFilter === 'todos' || i.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-[11px] font-bold text-[#C85A32] mb-2">
            <CreditCard className="w-3 h-3" />
            <span>Fase 07 — Finanzas, Suscripciones & Facturación</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Gestión Financiera, Planes SaaS & Cobros
          </h1>
          <p className="text-sm text-[#5C5B56] mt-1 font-editorial-body">
            Supervisión de ingresos recurrentes (MRR), planes de suscripción para LyberateDesk, catálogo de servicios y facturación de proyectos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setInvoiceModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nueva Factura</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* KPI Cards (Tema iOS27) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: MRR */}
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>MRR (RECURRENTE MENSUAL)</span>
            <Sparkles className="w-4 h-4 text-[#C85A32]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
            ${summary.mrrUsd.toLocaleString()} USD
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">
            {summary.activeSubscriptionsCount} suscripciones activas en LyberateDesk & SLAs
          </p>
        </div>

        {/* Card 2: ARR */}
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>ARR (PROYECCIÓN ANUAL)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
            ${summary.arrUsd.toLocaleString()} USD
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">Proyección de ingresos contractuales a 12 meses</p>
        </div>

        {/* Card 3: Total Cobrado */}
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>TOTAL COBRADO (HISTÓRICO)</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight">
            ${summary.totalCollectedUsd.toLocaleString()} USD
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">Pagos completados por proyectos entregados</p>
        </div>

        {/* Card 4: Pendiente por Cobrar */}
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>SALDOS POR COBRAR</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">
            ${summary.pendingCollectionUsd.toLocaleString()} USD
          </div>
          <p className="text-xs text-[#5C5B56] mt-1">
            {summary.overdueInvoicesCount > 0 ? (
              <span className="text-red-600 font-bold">{summary.overdueInvoicesCount} vencidas</span>
            ) : (
              'Facturas en plazo de vencimiento normal'
            )}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'plans', label: `Planes de Suscripción (${plans.length})` },
          { id: 'subscriptions', label: `Suscripciones Activas (${subscriptions.length})` },
          { id: 'services', label: `Catálogo de Servicios (${services.length})` },
          { id: 'invoices', label: `Facturas & Cobros (${invoices.length})` },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* TAB 1: PLANES DE SUSCRIPCIÓN (LYBERATEDESK & SLAS) */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E3DC]">
            <div>
              <h3 className="text-base font-bold text-[#141413]">
                Planes Recurrentes para Clientes & SaaS
              </h3>
              <p className="text-xs text-[#5C5B56]">
                Estructura comercial para comercializar LyberateDesk y contratos de mantenimiento continuo.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPlanModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Plan</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-3xl border border-[#E5E3DC] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C85A32]">
                      {plan.productName}
                    </span>
                    <Badge variant="brand" size="sm">Activo</Badge>
                  </div>

                  <h4 className="text-xl font-bold text-[#141413] mb-1">{plan.planName}</h4>

                  <div className="my-4 pt-3 border-t border-[#F0EFEA] flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#141413]">
                      ${plan.priceMonthlyUsd}
                    </span>
                    <span className="text-xs text-[#8A8881] font-semibold">USD / mes</span>
                    <span className="text-[10px] text-emerald-700 ml-auto bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ${plan.priceYearlyUsd} / año
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#F0EFEA]">
                    <span className="text-[11px] font-bold text-[#8A8881] uppercase tracking-wider block">
                      Incluye:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#5C5B56]">
                      {plan.features.map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0EFEA]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-xs"
                    onClick={() => {
                      showNotification(`Plan ${plan.planName} seleccionado para cotización.`);
                    }}
                  >
                    Asignar a Cliente
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SUSCRIPCIONES ACTIVAS DE CLIENTES */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-3xl border border-[#E5E3DC] overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[#E5E3DC] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#141413]">
                Clientes con Suscripción Activa
              </h3>
              <p className="text-xs text-[#5C5B56]">
                Cuentas bajo contratos de SLA o licencias activas de LyberateDesk.
              </p>
            </div>
            <span className="text-xs font-mono text-[#8A8881]">
              MRR Total: ${summary.mrrUsd} USD
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FBFBF9] border-b border-[#E5E3DC] text-[#5C5B56] font-semibold">
                  <th className="py-3 px-6">Cliente</th>
                  <th className="py-3 px-6">Producto & Plan</th>
                  <th className="py-3 px-6">Frecuencia</th>
                  <th className="py-3 px-6">Cuota (USD)</th>
                  <th className="py-3 px-6">Estado</th>
                  <th className="py-3 px-6">Próxima Renovación</th>
                  <th className="py-3 px-6">Socio Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#FBFBF9]">
                    <td className="py-3.5 px-6 font-bold text-[#141413]">{sub.clientName}</td>
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-[#141413] block">{sub.productName}</span>
                      <span className="text-[11px] text-[#C85A32]">{sub.planName}</span>
                    </td>
                    <td className="py-3.5 px-6 uppercase text-[#5C5B56] font-mono">
                      {sub.billingFrequency === 'monthly' ? 'Mensual' : 'Anual'}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-emerald-700">
                      ${sub.amountUsd} USD
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant="success" size="sm">Activa</Badge>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[#5C5B56]">{sub.nextRenewalDate}</td>
                    <td className="py-3.5 px-6 text-[#141413] font-medium">{sub.assignedPartner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATÁLOGO DE SERVICIOS & TARIFAS */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-[#E5E3DC] p-6 flex flex-col justify-between shadow-xs space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="brand" size="sm">{srv.category.toUpperCase()}</Badge>
                  <span className="text-xs font-mono font-bold text-[#141413]">
                    Desde ${srv.basePriceUsd} USD
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#141413]">{srv.name}</h4>
                <p className="text-xs font-semibold text-[#C85A32] mt-0.5">{srv.tagline}</p>
                <p className="text-xs text-[#5C5B56] mt-2 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-4 border-t border-[#F0EFEA] space-y-1.5">
                <span className="text-[11px] font-bold text-[#8A8881] uppercase tracking-wider block">
                  Entregables incluidos:
                </span>
                <ul className="space-y-1 text-xs text-[#5C5B56]">
                  {srv.deliverables.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: FACTURAS & COBROS POR HITOS */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* Toolbar de Búsqueda y Filtros */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A8881]" />
              <Input
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="Buscar por factura, cliente o concepto..."
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className="text-xs w-44"
                options={[
                  { value: 'todos', label: 'Todos los estados' },
                  { value: 'paid', label: 'Cobradas / Pagadas' },
                  { value: 'pending', label: 'Pendientes' },
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E3DC] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FBFBF9] border-b border-[#E5E3DC] text-[#5C5B56] font-semibold">
                    <th className="py-3 px-6">Nº Factura</th>
                    <th className="py-3 px-6">Cliente</th>
                    <th className="py-3 px-6">Concepto / Hito</th>
                    <th className="py-3 px-6">Monto (USD)</th>
                    <th className="py-3 px-6">Estado</th>
                    <th className="py-3 px-6">Vencimiento</th>
                    <th className="py-3 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  {filteredInvoices.map((inv) => {
                    const isPaid = inv.status === 'paid';
                    return (
                      <tr key={inv.id} className="hover:bg-[#FBFBF9]">
                        <td className="py-3.5 px-6 font-mono font-bold text-[#141413]">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3.5 px-6 font-semibold text-[#141413]">
                          {inv.clientName}
                        </td>
                        <td className="py-3.5 px-6 text-[#5C5B56] max-w-xs truncate">
                          {inv.concept}
                        </td>
                        <td className="py-3.5 px-6 font-mono font-extrabold text-[#141413]">
                          ${inv.amountUsd.toLocaleString()} USD
                        </td>
                        <td className="py-3.5 px-6">
                          <Badge variant={isPaid ? 'success' : 'warning'} size="sm">
                            {isPaid ? 'Pagada' : 'Pendiente'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-6 font-mono text-[#5C5B56]">
                          {inv.dueDate}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          {!isPaid ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="primary"
                                className="text-[11px] py-1 px-2.5"
                                onClick={() => handleMarkPaid(inv.id, 'zelle')}
                              >
                                Marcar Cobrada
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-medium">
                              Cobrado ({inv.paymentMethod?.toUpperCase()})
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA FACTURA */}
      {invoiceModalOpen && (
        <Dialog
          isOpen={true}
          onClose={() => setInvoiceModalOpen(false)}
          title="Emitir Nueva Factura / Solicitud de Cobro"
          description="Genera una factura vinculada a una cuenta de cliente y regístrala en el CRM."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setInvoiceModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateInvoice}>
                Generar Factura
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Select
              label="Cliente Facturable"
              value={newInvoiceClientId}
              onChange={(e) => setNewInvoiceClientId(e.target.value)}
              options={[
                { value: '', label: 'Seleccionar cliente...' },
                ...clients.map((c) => ({ value: c.id, label: c.name })),
              ]}
              required
            />

            <Input
              label="Concepto de la Factura"
              value={newInvoiceConcept}
              onChange={(e) => setNewInvoiceConcept(e.target.value)}
              placeholder="Ej. Anticipo 50% Desarrollo App Móvil"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Monto Total ($ USD)"
                type="number"
                value={newInvoiceAmount}
                onChange={(e) => setNewInvoiceAmount(e.target.value)}
                required
              />

              <Input
                label="Fecha de Vencimiento"
                type="date"
                value={newInvoiceDueDate}
                onChange={(e) => setNewInvoiceDueDate(e.target.value)}
                required
              />
            </div>
          </div>
        </Dialog>
      )}

      {/* MODAL: NUEVO PLAN SAAS */}
      {planModalOpen && (
        <Dialog
          isOpen={true}
          onClose={() => setPlanModalOpen(false)}
          title="Crear Nuevo Plan de Suscripción"
          description="Define un nivel de precio para LyberateDesk o servicios recurrentes."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setPlanModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreatePlan}>
                Guardar Plan
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Nombre del Plan"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder="Ej. Pro Unlimited"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Precio Mensual ($ USD)"
                type="number"
                value={newPlanPriceMonthly}
                onChange={(e) => setNewPlanPriceMonthly(e.target.value)}
                required
              />

              <Select
                label="Producto Asociado"
                value={newPlanProduct}
                onChange={(e) => setNewPlanProduct(e.target.value)}
                options={[
                  { value: 'prod-saas-chat', label: 'LyberateDesk / LyberateChat' },
                  { value: 'prod-maintenance', label: 'Mantenimiento Cloudflare SLA' },
                ]}
              />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
