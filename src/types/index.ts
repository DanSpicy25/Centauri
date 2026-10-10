export type ProjectRelationship = 'own' | 'client' | 'collaboration' | 'managed' | 'unknown';
export type ProjectStatus = 'development' | 'beta' | 'available' | 'archived' | 'pending';
export type EditorialState = 'draft' | 'in_review' | 'approved' | 'published';

export interface ProjectMediaItem {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  isVerified: boolean;
  source?: string;
}

export interface ProjectDTO {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  category: string;
  relationship: ProjectRelationship;
  status: ProjectStatus;
  editorialState: EditorialState;
  lyberateContribution: string;
  fullScope?: string;
  verifiedTechnologies: string[];
  publicUrl?: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  thumbnailCredit?: string;
  gallery?: ProjectMediaItem[];
  isFeaturedInHomeCarousel: boolean;
  published: boolean;
  attributionApproved: boolean;
  verifiableOutcome?: string;
  metrics?: ProjectMetric[];
  openQuestions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberDTO {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  monogram: string;
  isPlaceholder: boolean;
  ringAccentColor?: string;
}

export interface ServiceDTO {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category?: 'web' | 'systems' | 'automation' | 'integration' | 'maintenance';
  categoryLabel?: string;
  problemSolved: string;
  targetAudience: string;
  typicalDeliverables: string[];
  requirementsToQuote?: string[];
  isApproved: boolean;
  iconName?: string;
}

export interface ProductPlanDTO {
  name: string;
  priceUsd: number;
  interval: string;
  features: string[];
  isHighlighted?: boolean;
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  status: 'development' | 'beta' | 'available';
  relationship: ProjectRelationship;
  verifiedFeatures: string[];
  ctaUrl?: string;
  demoUrl?: string;
  pricingModel?: 'saas' | 'license' | 'hybrid';
  pricingNote?: string;
  plans?: ProductPlanDTO[];
  targetBusiness?: string;
  architectureHighlight?: string;
}

export * from './cms';
export * from './sites';
export * from './crm';
export * from './ecosystem';
