import { ProjectRelationship } from './index';
export type { ProjectRelationship };

export type SiteEnvironment = 'production' | 'staging' | 'development';
export type SiteHealthStatus = 'online' | 'degraded' | 'offline' | 'unmonitored';
export type SslStatus = 'valid' | 'expiring_soon' | 'invalid' | 'unknown';
export type AnalyticsStatus = 'not_connected' | 'connected' | 'error' | 'stale';
export type AnalyticsProvider = 'google_analytics_4' | 'plausible' | 'cloudflare' | 'umami' | 'none';

export interface SiteHealthCheckLog {
  id: string;
  siteId: string;
  timestamp: string;
  statusCode: number;
  latencyMs: number;
  status: SiteHealthStatus;
  message?: string;
}

export interface SiteIncidentEvent {
  id: string;
  siteId: string;
  siteName: string;
  startedAt: string;
  resolvedAt?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'latency_spike' | 'downtime' | 'ssl_warning' | 'dns_failure';
  description: string;
}

export interface ManagedSiteDTO {
  id: string;
  name: string;
  canonicalUrl: string;
  environment: SiteEnvironment;
  relationship: ProjectRelationship;
  technologyStack: string;
  maintainer: string;
  status: SiteHealthStatus;
  statusCode: number;
  lastLatencyMs: number;
  uptimePercentage24h: number;
  sslStatus: SslStatus;
  sslExpiresAt?: string;
  analyticsStatus: AnalyticsStatus;
  analyticsProvider: AnalyticsProvider;
  analyticsLastSyncedAt?: string;
  lastCheckedAt: string;
  notes?: string;
  isDraft: boolean; // Seguridad: Sitios importados o creados inician siempre como borrador
  monitoringFrequencyMinutes: number;
}

export interface SiteFilterCriteria {
  status?: string;
  relationship?: string;
  environment?: string;
  searchTerm?: string;
}
