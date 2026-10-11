export type PaymentMovementStatus =
  | 'pending'
  | 'reported'
  | 'verified'
  | 'rejected'
  | 'refunded';

export type PaymentMethodType =
  | 'pago_movil'
  | 'zelle'
  | 'binance_usdt'
  | 'transferencia_bancaria'
  | 'efectivo'
  | 'stripe';

export type CurrencyCode = 'VES' | 'USD' | 'USDT';

// Type aliases for UI compatibility
export type PaymentStatus = PaymentMovementStatus;
export type PaymentMethod = PaymentMethodType;
export type PaymentCurrency = CurrencyCode;

export interface PaymentMovementDTO {
  id: string;
  receiptNumber: string; // e.g. 'MOV-2026-001'
  projectId?: string;
  projectName?: string;
  companyId: string;
  companyName: string;
  amountOriginal: number;
  currencyOriginal: CurrencyCode;
  exchangeRateToUsd?: number; // e.g. 42.50 VES per USD or 1.00 USDT per USD
  exchangeRateDate?: string;
  amountUsdEquivalent: number;
  paymentDate: string;
  method: PaymentMethodType;
  referenceNumber: string; // e.g. 'Ref Pago Móvil #889102'
  status: PaymentMovementStatus;
  feeAmount?: number;
  feeCurrency?: CurrencyCode;
  description: string;
  recordedBy: string; // 'Valdez' | 'Socio Fundador'
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
