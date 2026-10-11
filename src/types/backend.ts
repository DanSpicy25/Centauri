import type { FounderProfileDTO } from '../repositories/profileRepository';

export interface OtpChallengeRequest {
  email: string;
}

export interface OtpChallengeResponse {
  challengeId: string;
  expiresAt: string;
  maskedDestination: string;
}

export interface OtpVerificationRequest {
  challengeId: string;
  code: string;
  rememberDevice: boolean;
  deviceLabel?: string;
}

export interface AuthSessionDTO {
  userId: string;
  profileId: FounderProfileDTO['id'];
  expiresAt: string;
  csrfToken: string;
}

export interface TrustedDeviceDTO {
  id: string;
  label: string;
  firstSeenAt: string;
  lastSeenAt: string;
  lastSeenIp?: string;
  trusted: boolean;
}

export interface ProfileUpdateRequest {
  profileId: FounderProfileDTO['id'];
  changes: Partial<Pick<
    FounderProfileDTO,
    'name' | 'roleTitle' | 'bio' | 'avatarUrl' | 'email' | 'phone' |
    'whatsappNumber' | 'specialties' | 'themePreference' | 'emailSignature' |
    'githubUrl' | 'portfolioUrl'
  >>;
}

export interface ProposalSubmissionDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  needType: string;
  timeline: string;
  description: string;
  consentAt: string;
  status: 'new' | 'reviewing' | 'replied' | 'archived';
  assignedTo?: FounderProfileDTO['id'];
  createdAt: string;
}

export interface AdminNotificationDTO {
  id: string;
  recipientProfileId: FounderProfileDTO['id'];
  actorProfileId: FounderProfileDTO['id'];
  type: 'profile_updated' | 'proposal_received' | 'proposal_updated' | 'security_event';
  title: string;
  body: string;
  resourceId?: string;
  createdAt: string;
  readAt?: string;
}

export interface RecipientPreferencesDTO {
  profileId: FounderProfileDTO['id'];
  proposalEmail: string;
  whatsappNumber: string;
  updatedAt: string;
}

export interface CentauriBackendApi {
  requestOtp(request: OtpChallengeRequest): Promise<OtpChallengeResponse>;
  verifyOtp(request: OtpVerificationRequest): Promise<AuthSessionDTO>;
  signOut(): Promise<void>;
  getTrustedDevices(): Promise<TrustedDeviceDTO[]>;
  revokeTrustedDevice(deviceId: string): Promise<void>;
  updateOwnProfile(request: ProfileUpdateRequest): Promise<FounderProfileDTO>;
  getProposals(): Promise<ProposalSubmissionDTO[]>;
  updateProposalStatus(
    proposalId: string,
    status: ProposalSubmissionDTO['status']
  ): Promise<ProposalSubmissionDTO>;
  getNotifications(): Promise<AdminNotificationDTO[]>;
  markNotificationRead(notificationId: string): Promise<void>;
  getRecipientPreferences(): Promise<RecipientPreferencesDTO>;
  updateRecipientPreferences(
    preferences: RecipientPreferencesDTO
  ): Promise<RecipientPreferencesDTO>;
}
