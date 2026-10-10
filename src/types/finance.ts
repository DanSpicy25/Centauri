export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'draft';
export type BillingFrequency = 'monthly' | 'yearly' | 'one_time';
export type ServiceTier = 'standard' | 'business' | 'enterprise' | 'custom';

export interface ProductPricingDTO {
  id: string;
  name: string;
  category: 'web' | 'mobile' | 'platform' | 'saas' | 'maintenance' | 'consulting';
  tagline: string;
  basePriceUsd: number;
  billingType: 'one_time' | 'recurring';
  description: string;
  deliverables: string[];
  isAvailable: boolean;
}

export interface SubscriptionPlanDTO {
  id: string;
  productId: string; // ej. 'prod-lyberatedesk' o 'prod-sla'
  productName: string;
  planName: string; // ej. 'Starter', 'Business', 'Enterprise'
  priceMonthlyUsd: number;
  priceYearlyUsd: number;
  maxUsers?: number;
  features: string[];
  isActive: boolean;
}

export interface ClientSubscriptionDTO {
  id: string;
  clientId: string;
  clientName: string;
  planId: string;
  planName: string;
  productName: string;
  billingFrequency: BillingFrequency;
  amountUsd: number;
  status: 'active' | 'paused' | 'canceled';
  startDate: string;
  nextRenewalDate: string;
  assignedPartner: string;
}

export interface InvoiceDTO {
  id: string;
  invoiceNumber: string; // ej. 'INV-2026-001'
  clientId: string;
  clientName: string;
  concept: string;
  amountUsd: number;
  status: PaymentStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'zelle' | 'transfer' | 'usdt' | 'stripe';
  notes?: string;
}

export interface FinancialSummary {
  mrrUsd: number;
  arrUsd: number;
  totalInvoicedUsd: number;
  totalCollectedUsd: number;
  pendingCollectionUsd: number;
  activeSubscriptionsCount: number;
  overdueInvoicesCount: number;
}

