export interface LaunchChecklistItem {
  id: string;
  category: 'security' | 'performance' | 'seo' | 'accessibility' | 'infrastructure';
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'pending';
  impact: 'critical' | 'high' | 'medium';
  verificationDetail: string;
}

export interface CoreWebVitalsMetrics {
  ttfbMs: number; // Time to First Byte (< 200ms)
  fcpMs: number;  // First Contentful Paint (< 1000ms)
  lcpMs: number;  // Largest Contentful Paint (< 2500ms)
  clsScore: number; // Cumulative Layout Shift (< 0.1)
  inpMs: number;  // Interaction to Next Paint (< 200ms)
  lighthouseScore: number; // 0 - 100
  lastMeasuredAt: string;
}

export interface SocialPreviewConfig {
  title: string;
  description: string;
  url: string;
  siteName: string;
  imageUrl: string;
  type: string;
}

export interface SystemBackupDTO {
  version: string;
  timestamp: string;
  checksum: string;
  data: {
    cmsPagesCount: number;
    projectsCount: number;
    sitesCount: number;
    clientsCount: number;
    invoicesCount: number;
    integrationsCount: number;
    auditLogsCount: number;
    rawSnapshot: Record<string, any>;
  };
}

