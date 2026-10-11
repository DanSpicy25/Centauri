export type MessageChannel = 'whatsapp' | 'telegram' | 'email';

export type MessageStatus =
  | 'draft'
  | 'queued'
  | 'simulated'
  | 'delivered_simulated'
  | 'error'
  | 'retry'
  | 'reply_received_simulated';

export interface MessageItemDTO {
  id: string;
  channel: MessageChannel;
  recipientName: string;
  recipientContact: string; // Phone number with country code, email address, or @telegram
  companyId?: string;
  companyName?: string;
  projectId?: string;
  projectName?: string;
  inquiryId?: string;
  templateId?: string;
  subject?: string;
  content: string;
  status: MessageStatus;
  preparedBy: 'Valdez' | 'Socio Fundador';
  preparedAt: string;
  simulatedSentAt?: string;
  simulatedDeliveredAt?: string;
  simulatedReplyText?: string;
  simulatedReplyAt?: string;
  errorMessage?: string;
  notes?: string;
}

