export type InquiryStatus = 'new' | 'reviewing' | 'replied' | 'converted' | 'archived';
export type InquiryPriority = 'low' | 'medium' | 'high';

export interface InquiryReplyDTO {
  id: string;
  author: string; // 'Valdez' | 'Socio Fundador'
  channel: 'email' | 'whatsapp' | 'telegram' | 'internal_note';
  text: string;
  sentAt: string;
}

export interface InquirySubmissionDTO {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  needType: string;
  budgetEstimated?: string;
  timeline: string;
  description: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  assignedPartner: 'Valdez' | 'Socio Fundador';
  notes?: string;
  replies?: InquiryReplyDTO[];
  createdAt: string;
  updatedAt: string;
  convertedDealId?: string;
  convertedProjectId?: string;
  isLocalDemo: boolean;
}

