import React, { useState, useEffect } from 'react';
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
  Check,
  X,
  ArrowRightLeft,
  AlertTriangle,
} from 'lucide-react';
import { financeRepository } from '../../repositories/financeRepository';
import { paymentMovementRepository } from '../../repositories/paymentMovementRepository';
import {
  SubscriptionPlanDTO,
  ClientSubscriptionDTO,
  InvoiceDTO,
  ProductPricingDTO,
} from '../../types/finance';
import {
  PaymentMovementDTO,
  PaymentMethod,
  PaymentCurrency,
} from '../../types/payments';
import { crmRepository } from '../../repositories/crmRepository';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import { Dialog } from '../../components/ui/Dialog';

export const FinanceHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'movements' | 'plans' | 'subscriptions' | 'services' | 'invoices'>('movements');

  // Listas reactivas
  const [summary, setSummary] = useState(() => financeRepository.getFinancialSummary());
  const [plans, setPlans] = useState<SubscriptionPlanDTO[]>(() => financeRepository.getPlans());
  const [subscriptions, setSubscriptions] = useState<ClientSubscriptionDTO[]>(() =>
    financeRepository.getSubscriptions()
  );
  const [services, setServices] = useState<ProductPricingDTO[]>(() => financeRepository.getProducts());
  const [invoices, setInvoices] = useState<InvoiceDTO[]>(() => financeRepository.getInvoices());
  const [movements, setMovements] = useState<PaymentMovementDTO[]>(() => paymentMovementRepository.getAll());

  // Búsquedas y filtros de Facturas
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('todos');

  // Filtros de Tesorería Multimoneda
  const [movementSearch, setMovementSearch] = useState('');
  const [movementCurrencyFilter, setMovementCurrencyFilter] = useState('todos');
  const [movementStatusFilter, setMovementStatusFilter] = useState('todos');
  const [movementMethodFilter, setMovementMethodFilter] = useState('todos');

  // Modales
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [newMovementClient, setNewMovementClient] = useState('');
  const [newMovementConcept, setNewMovementConcept] = useState('');
  const [newMovementAmount, setNewMovementAmount] = useState('1500');
  const [newMovementCurrency, setNewMovementCurrency] = useState<PaymentCurrency>('USD');
  const [newMovementMethod, setNewMovementMethod] = useState<PaymentMethod>('zelle');
  const [newMovementRef, setNewMovementRef] = useState('');
  const [newMovementRate, setNewMovementRate] = useState('');

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
    setMovements(paymentMovementRepository.getAll());
  };

  useEffect(() => {
    const handleUpdate = () => refreshAll();
    window.addEventListener('lyberate-payments-update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('lyberate-payments-update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Acciones de Movimientos Multimoneda
  const handleVerifyMovement = (id: string) => {
    try {
      paymentMovementRepository.verifyMovement(id, 'Valdez');
      refreshAll();
      showNotification('Movimiento de pago verificado y conciliado en tesorería.');
    } catch {
      showNotification('Error al verificar el movimiento.');
    }
  };

  const handleRejectMovement = (id: string) => {
    try {
      paymentMovementRepository.rejectMovement(id, 'Comprobante no coincide con extracto bancario', 'Valdez');
      refreshAll();
      showNotification('Movimiento marcado como rechazado.');
    } catch {
      showNotification('Error al rechazar el movimiento.');
    }
  };

  const handleCreateMovement = () => {
    if (!newMovementConcept.trim() || !newMovementClient) return;
    const client = clients.find((c) => c.id === newMovementClient);
    try {
      paymentMovementRepository.recordMovement({
        clientName: client?.name || 'Cliente',
        concept: newMovementConcept.trim(),
        amountOriginal: Number(newMovementAmount) || 0,
        currencyOriginal: newMovementCurrency,
        method: newMovementMethod,
        referenceNumber: newMovementRef.trim() || undefined,
        exchangeRate: newMovementRate ? Number(newMovementRate) : undefined,
        exchangeRateDate: newMovementRate ? new Date().toISOString().split('T')[0] : undefined,
        status: 'reported',
      });
      refreshAll();
      setMovementModalOpen(false);
      setNewMovementConcept('');
      setNewMovementRef('');
      setNewMovementRate('');
      showNotification('Nuevo movimiento de pago registrado en estado reportado.');
    } catch {
      showNotification('Error al registrar el movimiento.');
    }
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

  const movSummary = paymentMovementRepository.getMovementsSummary();

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.description.toLowerCase().includes(movementSearch.toLowerCase()) ||
      m.companyName.toLowerCase().includes(movementSearch.toLowerCase()) ||
      (m.projectName && m.projectName.toLowerCase().includes(movementSearch.toLowerCase())) ||
      m.referenceNumber.toLowerCase().includes(movementSearch.toLowerCase()) ||
      m.receiptNumber.toLowerCase().includes(movementSearch.toLowerCase());
    const matchesCurrency =
      movementCurrencyFilter === 'todos' || m.currencyOriginal === movementCurrencyFilter;
    const matchesStatus =
      movementStatusFilter === 'todos' || m.status === movementStatusFilter;
    const matchesMethod =
      movementMethodFilter === 'todos' || m.method === movementMethodFilter;
    return matchesSearch && matchesCurrency && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FAF5FF] border border-[#E9D5FF] text-[11px] font-bold text-[#7C3AED] mb-2">
            <CreditCard className="w-3 h-3" />
            <span>Fase 07 — Tesorería Multimoneda, Planes & Cobros</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Gestión Financiera & Tesorería Multimoneda
          </h1>
          <p className="text-sm text-[#5C5B56] mt-1 font-editorial-body">
            Control de tesorería multimoneda (VES, USD, USDT), verificación de comprobantes, ingresos recurrentes (MRR) y acuerdos entre socios.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInvoiceModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Factura Clásica</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setMovementModalOpen(true)}
            className="gap-1.5 text-xs bg-[#7C3AED] hover:bg-[#6D28D9]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Pago / Comprobante</span>
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
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
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
          { id: 'movements', label: `Tesorería Multimoneda (${movements.length})` },
          { id: 'plans', label: `Planes de Suscripción (${plans.length})` },
          { id: 'subscriptions', label: `Suscripciones Activas (${subscriptions.length})` },
          { id: 'services', label: `Catálogo de Precios (${services.length})` },
          { id: 'invoices', label: `Facturas Clásicas (${invoices.length})` },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* TAB 0: TESORERÍA MULTIMONEDA */}
      {activeTab === 'movements' && (
        <div className="space-y-6">
          {/* Sub-KPIs de Tesorería */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#8A8881] uppercase tracking-wider mb-1">
                <span>Caja USD Verificada</span>
                <span className="text-emerald-700 font-mono font-bold">Zelle / Wire</span>
              </div>
              <div className="text-2xl font-black text-[#141413]">
                ${movSummary.totalUsdVerified.toLocaleString()} USD
              </div>
              <p className="text-[11px] text-[#5C5B56] mt-1">Conciliado en cuentas bancarias en USD</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#8A8881] uppercase tracking-wider mb-1">
                <span>Caja VES Verificada</span>
                <span className="text-blue-700 font-mono font-bold">Pago Móvil</span>
              </div>
              <div className="text-2xl font-black text-blue-800">
                Bs. {movSummary.totalVesVerified.toLocaleString()} VES
              </div>
              <p className="text-[11px] text-[#5C5B56] mt-1">Valuación a tasa BCV archivada por hito</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#8A8881] uppercase tracking-wider mb-1">
                <span>Caja Cripto USDT</span>
                <span className="text-[#7C3AED] font-mono font-bold">Binance Pay</span>
              </div>
              <div className="text-2xl font-black text-[#7C3AED]">
                {movSummary.totalUsdtVerified.toLocaleString()} USDT
              </div>
              <p className="text-[11px] text-[#5C5B56] mt-1">Cobros criptográficos sin fricción transfronteriza</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                <span>Por Verificar</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-900">
                {movSummary.pendingReportedCount} comprobante{movSummary.pendingReportedCount === 1 ? '' : 's'}
              </div>
              <p className="text-[11px] text-amber-700 font-medium mt-1">
                ${movSummary.pendingReportedUsdEquivalent.toLocaleString()} USD eq. pendiente de revisión
              </p>
            </div>
          </div>

          {/* Banner de transparencia */}
          <div className="bg-gradient-to-r from-[#FAF5FF] to-white p-4 rounded-2xl border border-[#E9D5FF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5C5B56]">
            <div className="flex items-start sm:items-center gap-2.5">
              <ArrowRightLeft className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-bold text-[#141413]">Bitácora de Conciliación Operativa: </span>
                Cada movimiento conserva su moneda original, comprobante de pago, tasa de cambio histórica hacia USD y el socio que auditó la transacción.
              </div>
            </div>
            <div className="text-[11px] font-semibold text-[#7C3AED] shrink-0 bg-white px-2.5 py-1 rounded-lg border border-[#E9D5FF]">
              Eq. Total Verificado: ${movSummary.totalUsdEquivalentVerified.toLocaleString()} USD
            </div>
          </div>

          {/* Toolbar de Búsqueda y Filtros */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A8881]" />
              <Input
                value={movementSearch}
                onChange={(e) => setMovementSearch(e.target.value)}
                placeholder="Buscar por cliente, proyecto, referencia o recibo..."
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select
                value={movementStatusFilter}
                onChange={(e) => setMovementStatusFilter(e.target.value)}
                className="text-xs w-36"
                options={[
                  { value: 'todos', label: 'Todos los estados' },
                  { value: 'reported', label: 'Reportados' },
                  { value: 'verified', label: 'Verificados' },
                  { value: 'rejected', label: 'Rechazados' },
                ]}
              />
              <Select
                value={movementCurrencyFilter}
                onChange={(e) => setMovementCurrencyFilter(e.target.value)}
                className="text-xs w-32"
                options={[
                  { value: 'todos', label: 'Monedas' },
                  { value: 'USD', label: 'USD' },
                  { value: 'VES', label: 'VES' },
                  { value: 'USDT', label: 'USDT' },
                ]}
              />
              <Select
                value={movementMethodFilter}
                onChange={(e) => setMovementMethodFilter(e.target.value)}
                className="text-xs w-36"
                options={[
                  { value: 'todos', label: 'Métodos' },
                  { value: 'zelle', label: 'Zelle' },
                  { value: 'pago_movil', label: 'Pago Móvil' },
                  { value: 'binance_usdt', label: 'Binance USDT' },
                  { value: 'transferencia_bancaria', label: 'Transferencia' },
                ]}
              />
            </div>
          </div>

          {/* Tabla de Movimientos */}
          <div className="bg-white rounded-3xl border border-[#E5E3DC] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FBFBF9] border-b border-[#E5E3DC] text-[#5C5B56] font-semibold">
                    <th className="py-3 px-6">Recibo / Fecha</th>
                    <th className="py-3 px-6">Cliente & Proyecto</th>
                    <th className="py-3 px-6">Concepto / Hito</th>
                    <th className="py-3 px-6">Monto Original</th>
                    <th className="py-3 px-6">Equiv. USD & Tasa</th>
                    <th className="py-3 px-6">Método & Ref.</th>
                    <th className="py-3 px-6">Estado</th>
                    <th className="py-3 px-6 text-right">Auditoría / Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  {filteredMovements.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No se encontraron movimientos con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredMovements.map((mov) => {
                      const isVerified = mov.status === 'verified';
                      const isReported = mov.status === 'reported';

                      return (
                        <tr key={mov.id} className="hover:bg-[#FBFBF9] transition-colors">
                          <td className="py-3.5 px-6">
                            <span className="font-mono font-bold text-[#141413] block">
                              {mov.receiptNumber}
                            </span>
                            <span className="text-[11px] text-[#8A8881]">{mov.paymentDate}</span>
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="font-semibold text-[#141413] block">
                              {mov.companyName}
                            </span>
                            {mov.projectName && (
                              <span className="text-[11px] text-[#7C3AED] line-clamp-1">
                                {mov.projectName}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-[#5C5B56] max-w-xs">
                            <span className="line-clamp-2">{mov.description}</span>
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="font-mono font-black text-[#141413] block">
                              {mov.currencyOriginal === 'VES' && 'Bs. '}
                              {mov.amountOriginal.toLocaleString()}{' '}
                              <span className="text-[10px] font-bold text-[#8A8881]">
                                {mov.currencyOriginal}
                              </span>
                            </span>
                          </td>
                          <td className="py-3.5 px-6 font-mono">
                            <span className="font-extrabold text-emerald-700 block">
                              ${mov.amountUsdEquivalent.toLocaleString()} USD
                            </span>
                            {mov.exchangeRateToUsd && (
                              <span className="text-[10px] text-[#8A8881]">
                                Tasa: {mov.exchangeRateToUsd} {mov.currencyOriginal}/USD
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="font-medium text-[#141413] uppercase text-[11px] block">
                              {mov.method.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] font-mono text-[#8A8881] truncate block max-w-[140px]">
                              {mov.referenceNumber}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <Badge
                              variant={isVerified ? 'success' : isReported ? 'warning' : 'error'}
                              size="sm"
                            >
                              {isVerified ? 'Verificado' : isReported ? 'Reportado' : 'Rechazado'}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            {isReported ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  className="text-[11px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => handleVerifyMovement(mov.id)}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Verificar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-[11px] py-1 px-2 text-rose-600 hover:bg-rose-50 border-rose-200"
                                  onClick={() => handleRejectMovement(mov.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="text-[11px] text-[#8A8881]">
                                {mov.verifiedBy ? (
                                  <span>Auditado por <strong className="text-[#141413]">{mov.verifiedBy}</strong></span>
                                ) : (
                                  <span>Registrado por {mov.recordedBy}</span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED]">
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
                      <span className="text-[11px] text-[#7C3AED] font-medium">{sub.planName}</span>
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
                <p className="text-xs font-semibold text-[#7C3AED] mt-0.5">{srv.tagline}</p>
                <p className="text-xs text-[#5C5B56] mt-2 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-4 border-t border-[#F0EFEA] space-y-1.5">
                <span className="text-[11px] font-bold text-[#8A8881] uppercase tracking-wider block">
                  Entregables incluidos:
                </span>
                <ul className="space-y-1 text-xs text-[#5C5B56]">
                  {srv.deliverables.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
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

      {/* MODAL: REGISTRAR PAGO / COMPROBANTE MULTIMONEDA */}
      {movementModalOpen && (
        <Dialog
          isOpen={true}
          onClose={() => setMovementModalOpen(false)}
          title="Registrar Movimiento de Pago / Comprobante"
          description="Añade un abono o anticipo reportado por un cliente en USD, VES o USDT para su conciliación."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setMovementModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateMovement}
                className="bg-[#7C3AED] hover:bg-[#6D28D9]"
              >
                Guardar Comprobante
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Select
              label="Cliente Pagador"
              value={newMovementClient}
              onChange={(e) => setNewMovementClient(e.target.value)}
              options={[
                { value: '', label: 'Seleccionar cliente...' },
                ...clients.map((c) => ({ value: c.id, label: c.name })),
              ]}
              required
            />

            <Input
              label="Concepto del Cobro / Hito"
              value={newMovementConcept}
              onChange={(e) => setNewMovementConcept(e.target.value)}
              placeholder="Ej. Anticipo 40% inicio de desarrollo"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Moneda Original"
                value={newMovementCurrency}
                onChange={(e) => setNewMovementCurrency(e.target.value as PaymentCurrency)}
                options={[
                  { value: 'USD', label: 'USD — Dólares Americanos' },
                  { value: 'VES', label: 'VES — Bolívares' },
                  { value: 'USDT', label: 'USDT — Tether Cripto' },
                ]}
              />

              <Input
                label={`Monto Original (${newMovementCurrency})`}
                type="number"
                value={newMovementAmount}
                onChange={(e) => setNewMovementAmount(e.target.value)}
                required
              />
            </div>

            {newMovementCurrency === 'VES' && (
              <Input
                label="Tasa de Cambio Oficial (VES / USD)"
                type="number"
                step="0.01"
                value={newMovementRate}
                onChange={(e) => setNewMovementRate(e.target.value)}
                placeholder="Ej. 42.50 (tasa BCV en la fecha del pago)"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Canal / Método de Pago"
                value={newMovementMethod}
                onChange={(e) => setNewMovementMethod(e.target.value as PaymentMethod)}
                options={[
                  { value: 'zelle', label: 'Zelle' },
                  { value: 'pago_movil', label: 'Pago Móvil Interbancario' },
                  { value: 'binance_usdt', label: 'Binance Pay (USDT)' },
                  { value: 'transferencia_bancaria', label: 'Transferencia Bancaria' },
                  { value: 'efectivo', label: 'Efectivo en Custodia' },
                ]}
              />

              <Input
                label="Nº de Referencia / Comprobante"
                value={newMovementRef}
                onChange={(e) => setNewMovementRef(e.target.value)}
                placeholder="Ej. #849102 o TXID"
              />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
