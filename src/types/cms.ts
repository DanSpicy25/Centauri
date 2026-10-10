export type CmsPageId = 'home' | 'about' | 'services' | 'products' | 'contact' | 'works';

export interface PageSeoConfig {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  robotsIndex: boolean;
}

export interface HeroSectionData {
  eyebrow: string;
  headline: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  badges: string[];
}

export interface CapabilitiesSectionData {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{ title: string; desc: string }>;
}

export interface AboutStorySectionData {
  eyebrow: string;
  title: string;
  leadParagraph: string;
  bodyParagraphs: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface PrincipleItem {
  title: string;
  description: string;
}

export interface CmsSectionConfig {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
}

export interface PageContentConfig {
  pageId: CmsPageId;
  pageName: string;
  lastModified: string;
  lastModifiedBy: string;
  currentVersionId: string;
  seo: PageSeoConfig;
  sectionsConfig: CmsSectionConfig[];
  hero?: HeroSectionData;
  capabilities?: CapabilitiesSectionData;
  aboutStory?: AboutStorySectionData;
  processSteps?: ProcessStep[];
  principles?: PrincipleItem[];
  faqs?: FaqItem[];
  ctaHeadline?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
}

export interface PageVersionSnapshot {
  versionId: string;
  pageId: CmsPageId;
  versionName: string;
  createdAt: string;
  author: string;
  changeLog: string;
  status: 'published' | 'archived' | 'draft';
  data: PageContentConfig;
}

export interface CmsAuditEvent {
  id: string;
  timestamp: string;
  author: string;
  action: 'save_draft' | 'publish' | 'rollback' | 'create_project' | 'update_project' | 'unpublish_project';
  target: string;
  details: string;
}

