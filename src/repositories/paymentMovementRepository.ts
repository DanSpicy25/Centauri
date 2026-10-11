import {
  PaymentMovementDTO,
  PaymentMovementStatus,
  PaymentMethodType,
  CurrencyCode,
} from '../types/payments';

const INITIAL_MOVEMENTS: PaymentMovementDTO[] = [
  {
    id: 'mov-01',
    receiptNumber: 'REC-2026-001',
    projectId: 'prj-orgemac',
    projectName: 'Plataforma Digital & Catálogo Orgemac',
    companyId: 'cli-orgemac',
    companyName: 'Orgemac C.A.',
    amountOriginal: 5800,
    currencyOriginal: 'USD',
    amountUsdEquivalent: 5800,
    paymentDate: '2026-08-15',
    method: 'zelle',
    referenceNumber: 'Zelle Ref #772910 (Carlos M.)',
    status: 'verified',
    description: 'Anticipo del 40% según Hito 1 de acuerdo contractual.',
    recordedBy: 'Valdez',
    verifiedBy: 'Valdez',
    verifiedAt: '2026-08-15T15:30:00Z',
    notes: 'Confirmado en cuenta bancaria asociada.',
    createdAt: '2026-08-15T14:00:00Z',
    updatedAt: '2026-08-15T15:30:00Z',
  },
  {
    id: 'mov-02',
    receiptNumber: 'REC-2026-002',
    projectId: 'prj-orgemac',
    projectName: 'Plataforma Digital & Catálogo Orgemac',
    companyId: 'cli-orgemac',
    companyName: 'Orgemac C.A.',
    amountOriginal: 4350,
    currencyOriginal: 'USD',
    amountUsdEquivalent: 4350,
    paymentDate: '2026-09-28',
    method: 'zelle',
    referenceNumber: 'Zelle Ref #849102 (Orgemac Operaciones)',
    status: 'verified',
    description: 'Segundo hito (30%) por entrega del catálogo de repuestos interactivo.',
    recordedBy: 'Socio Fundador',
    verifiedBy: 'Socio Fundador',
    verifiedAt: '2026-09-28T18:00:00Z',
    notes: 'Verificado satisfactoriamente.',
    createdAt: '2026-09-28T16:30:00Z',
    updatedAt: '2026-09-28T18:00:00Z',
  },
  {
    id: 'mov-03',
    receiptNumber: 'REC-2026-003',
    companyId: 'cli-pinkfashion',
    companyName: 'Pink Fashion Tiendas C.A.',
    amountOriginal: 105000,
    currencyOriginal: 'VES',
    exchangeRateToUsd: 42.0,
    exchangeRateDate: '2026-09-10',
    amountUsdEquivalent: 2500,
    paymentDate: '2026-09-10',
    method: 'pago_movil',
    referenceNumber: 'Pago Móvil Banesco #991024',
    status: 'verified',
    description: 'Abono en bolívares por optimización de pasarela de compra móvil.',
    recordedBy: 'Valdez',
    verifiedBy: 'Valdez',
    verifiedAt: '2026-09-10T11:45:00Z',
    notes: 'Tasa oficial BCV registrada en fecha de abono: 42.00 VES/USD.',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-10T11:45:00Z',
  },
  {
    id: 'mov-04',
    receiptNumber: 'REC-2026-004',
    projectId: 'prj-noticia',
    projectName: 'Portal Editorial & PWA Contacto con la Noticia',
    companyId: 'cli-noticia',
    companyName: 'Medios Digitales de Información C.A.',
    amountOriginal: 3500,
    currencyOriginal: 'USDT',
    exchangeRateToUsd: 1.0,
    exchangeRateDate: '2026-08-30',
    amountUsdEquivalent: 3500,
    paymentDate: '2026-08-30',
    method: 'binance_usdt',
    referenceNumber: 'Binance Pay ID #9928194',
    status: 'verified',
    description: 'Saldo final 100% de la sala de redacción offline y PWA.',
    recordedBy: 'Valdez',
    verifiedBy: 'Valdez',
    verifiedAt: '2026-08-30T17:00:00Z',
    notes: 'Transferencia interna Binance Pay sin comisión de red.',
    createdAt: '2026-08-30T16:15:00Z',
    updatedAt: '2026-08-30T17:00:00Z',
  },
  {
    id: 'mov-05',
    receiptNumber: 'REC-2026-005',
    projectId: 'prj-motoindy',
    projectName: 'Ecosistema de Despacho & Movilidad MotoIndy',
    companyId: 'cli-metropolis',
    companyName: 'MotoIndy Logistics & Despacho',
    amountOriginal: 3750,
    currencyOriginal: 'USD',
    amountUsdEquivalent: 3750,
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'zelle',
    referenceNumber: 'Zelle Ref #902812 (Metrópolis Express)',
    status: 'reported',
    description: 'Reporte del cliente por anticipo inicial del 25% para inicio de sprint.',
    recordedBy: 'Socio Fundador',
    notes: 'Pendiente de verificar conciliación en extracto de cuenta.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'lyberate_payment_movements';

export class PaymentMovementRepository {
  private movements: PaymentMovementDTO[] = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.movements = [...INITIAL_MOVEMENTS];
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.movements = [...INITIAL_MOVEMENTS];
      this.saveState();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      this.movements = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_MOVEMENTS];
    } catch {
      this.movements = [...INITIAL_MOVEMENTS];
    }
  }

  private saveState(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.movements));
      window.dispatchEvent(new Event('lyberate-payments-update'));
    }
  }

  getAllMovements(): PaymentMovementDTO[] {
    return [...this.movements];
  }

  getMovementById(id: string): PaymentMovementDTO | undefined {
    return this.movements.find((m) => m.id === id);
  }

  createMovement(
    data: Omit<PaymentMovementDTO, 'id' | 'receiptNumber' | 'createdAt' | 'updatedAt' | 'amountUsdEquivalent'> & {
      amountUsdEquivalent?: number;
    }
  ): PaymentMovementDTO {
    const nextNum = this.movements.length + 1;
    const receiptNumber = `REC-2026-${String(nextNum).padStart(3, '0')}`;
    const id = `mov-${Date.now()}`;

    // Calcular equivalente en USD si no fue provisto
    let usdEq = data.amountUsdEquivalent;
    if (usdEq === undefined) {
      if (data.currencyOriginal === 'USD' || data.currencyOriginal === 'USDT') {
        usdEq = data.amountOriginal;
      } else if (data.currencyOriginal === 'VES' && data.exchangeRateToUsd && data.exchangeRateToUsd > 0) {
        usdEq = Math.round((data.amountOriginal / data.exchangeRateToUsd) * 100) / 100;
      } else {
        usdEq = data.amountOriginal;
      }
    }

    const newMovement: PaymentMovementDTO = {
      ...data,
      id,
      receiptNumber,
      amountUsdEquivalent: usdEq,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.movements.unshift(newMovement);
    this.saveState();
    return newMovement;
  }

  verifyMovement(id: string, verifiedBy: string): PaymentMovementDTO {
    const movement = this.getMovementById(id);
    if (!movement) throw new Error('Movimiento no encontrado.');

    movement.status = 'verified';
    movement.verifiedBy = verifiedBy;
    movement.verifiedAt = new Date().toISOString();
    movement.updatedAt = new Date().toISOString();

    this.saveState();
    return movement;
  }

  rejectMovement(id: string, reason: string, verifiedBy: string): PaymentMovementDTO {
    const movement = this.getMovementById(id);
    if (!movement) throw new Error('Movimiento no encontrado.');

    movement.status = 'rejected';
    movement.rejectionReason = reason;
    movement.verifiedBy = verifiedBy;
    movement.verifiedAt = new Date().toISOString();
    movement.updatedAt = new Date().toISOString();

    this.saveState();
    return movement;
  }

  getMovementsSummary(): {
    totalUsdVerified: number;
    totalVesVerified: number;
    totalUsdtVerified: number;
    totalUsdEquivalentVerified: number;
    pendingReportedCount: number;
    pendingReportedUsdEquivalent: number;
  } {
    const verified = this.movements.filter((m) => m.status === 'verified');
    const reported = this.movements.filter((m) => m.status === 'reported');

    const totalUsdVerified = verified
      .filter((m) => m.currencyOriginal === 'USD')
      .reduce((sum, m) => sum + m.amountOriginal, 0);

    const totalVesVerified = verified
      .filter((m) => m.currencyOriginal === 'VES')
      .reduce((sum, m) => sum + m.amountOriginal, 0);

    const totalUsdtVerified = verified
      .filter((m) => m.currencyOriginal === 'USDT')
      .reduce((sum, m) => sum + m.amountOriginal, 0);

    const totalUsdEquivalentVerified = verified.reduce(
      (sum, m) => sum + (m.amountUsdEquivalent || 0),
      0
    );

    const pendingReportedCount = reported.length;
    const pendingReportedUsdEquivalent = reported.reduce(
      (sum, m) => sum + (m.amountUsdEquivalent || 0),
      0
    );

    return {
      totalUsdVerified,
      totalVesVerified,
      totalUsdtVerified,
      totalUsdEquivalentVerified,
      pendingReportedCount,
      pendingReportedUsdEquivalent,
    };
  }

  getAll(): PaymentMovementDTO[] {
    return this.getAllMovements();
  }

  recordMovement(data: {
    clientName: string;
    concept: string;
    amountOriginal: number;
    currencyOriginal: CurrencyCode;
    method: PaymentMethodType;
    referenceNumber?: string;
    exchangeRate?: number;
    exchangeRateDate?: string;
    status?: PaymentMovementStatus;
    projectId?: string;
    projectName?: string;
    notes?: string;
    recordedBy?: string;
  }): PaymentMovementDTO {
    return this.createMovement({
      companyId: 'cli-manual',
      companyName: data.clientName,
      description: data.concept,
      amountOriginal: data.amountOriginal,
      currencyOriginal: data.currencyOriginal,
      method: data.method,
      referenceNumber: data.referenceNumber || `REF-${Date.now().toString().slice(-6)}`,
      exchangeRateToUsd: data.exchangeRate,
      exchangeRateDate: data.exchangeRateDate,
      status: data.status || 'reported',
      projectId: data.projectId,
      projectName: data.projectName,
      paymentDate: new Date().toISOString().split('T')[0],
      recordedBy: data.recordedBy || 'Valdez',
      notes: data.notes,
    });
  }

  getSummary() {
    const sum = this.getMovementsSummary();
    return {
      reportedCount: sum.pendingReportedCount,
      byCurrency: {
        VES: { verified: sum.totalVesVerified },
        USD: { verified: sum.totalUsdVerified },
        USDT: { verified: sum.totalUsdtVerified },
      },
      totalUsdEquivalent: sum.totalUsdEquivalentVerified,
    };
  }

  resetToDefault(): void {
    this.movements = [...INITIAL_MOVEMENTS];
    this.saveState();
  }
}

export const paymentMovementRepository = new PaymentMovementRepository();
