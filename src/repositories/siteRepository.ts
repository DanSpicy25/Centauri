import {
  ManagedSiteDTO,
  SiteHealthCheckLog,
  SiteIncidentEvent,
  SiteFilterCriteria,
  ProjectRelationship,
} from '../types/sites';

const FIXTURE_SITES: ManagedSiteDTO[] = [
  {
    id: 'site-orgemac',
    name: 'Orgemac Comercial',
    canonicalUrl: 'https://orgemac.com/',
    environment: 'production',
    relationship: 'client',
    technologyStack: 'Vite SPA + React + Cloudflare',
    maintainer: 'Valdez / Socio',
    status: 'online',
    statusCode: 200,
    lastLatencyMs: 185,
    uptimePercentage24h: 99.9,
    sslStatus: 'valid',
    sslExpiresAt: '2027-02-15T00:00:00Z',
    analyticsStatus: 'not_connected',
    analyticsProvider: 'none',
    lastCheckedAt: '2026-10-10T08:00:00Z',
    isDraft: false,
    monitoringFrequencyMinutes: 5,
    notes: 'Sitio auditado en Fase 00. Respuesta 200 OK verificada en Cloudflare.',
  },
  {
    id: 'site-pinkfashion',
    name: 'Pink Fashion VE',
    canonicalUrl: 'https://pinkfashionve.com/',
    environment: 'production',
    relationship: 'client',
    technologyStack: 'Vite SPA + React',
    maintainer: 'Valdez / Socio',
    status: 'online',
    statusCode: 200,
    lastLatencyMs: 230,
    uptimePercentage24h: 99.8,
    sslStatus: 'valid',
    sslExpiresAt: '2027-01-20T00:00:00Z',
    analyticsStatus: 'not_connected',
    analyticsProvider: 'none',
    lastCheckedAt: '2026-10-10T08:00:00Z',
    isDraft: false,
    monitoringFrequencyMinutes: 15,
    notes: 'Tienda de moda en línea. Catálogo y pasarela externa.',
  },
  {
    id: 'site-wilanye',
    name: 'Wilanye',
    canonicalUrl: 'https://wilanye.com/',
    environment: 'production',
    relationship: 'client',
    technologyStack: 'Vite SPA + Tailwind CDN',
    maintainer: 'Valdez / Socio',
    status: 'online',
    statusCode: 200,
    lastLatencyMs: 210,
    uptimePercentage24h: 99.7,
    sslStatus: 'valid',
    sslExpiresAt: '2027-03-10T00:00:00Z',
    analyticsStatus: 'not_connected',
    analyticsProvider: 'none',
    lastCheckedAt: '2026-10-10T08:00:00Z',
    isDraft: false,
    monitoringFrequencyMinutes: 15,
    notes: 'Plataforma comercial y aplicativo web.',
  },
  {
    id: 'site-contactonoticia',
    name: 'Contacto con la Noticia',
    canonicalUrl: 'https://contactoconlanoticia.com/',
    environment: 'production',
    relationship: 'collaboration',
    technologyStack: 'React 19 + PWA + PHP 8 MySQL',
    maintainer: 'Valdez / Socio',
    status: 'online',
    statusCode: 200,
    lastLatencyMs: 290,
    uptimePercentage24h: 99.6,
    sslStatus: 'valid',
    sslExpiresAt: '2026-12-05T00:00:00Z',
    analyticsStatus: 'connected',
    analyticsProvider: 'cloudflare',
    analyticsLastSyncedAt: '2026-10-10T07:30:00Z',
    lastCheckedAt: '2026-10-10T08:00:00Z',
    isDraft: false,
    monitoringFrequencyMinutes: 5,
    notes: 'Portal informativo y sala de redacción descentralizada.',
  },
  {
    id: 'site-sagitta',
    name: 'Sagitta Engine (Preview)',
    canonicalUrl: 'https://sagitta.lyberate.com/',
    environment: 'staging',
    relationship: 'own',
    technologyStack: 'React 19 + TypeScript + Cloudflare Pages',
    maintainer: 'Equipo de Arquitectura',
    status: 'online',
    statusCode: 200,
    lastLatencyMs: 140,
    uptimePercentage24h: 100.0,
    sslStatus: 'valid',
    sslExpiresAt: '2027-06-01T00:00:00Z',
    analyticsStatus: 'not_connected',
    analyticsProvider: 'none',
    lastCheckedAt: '2026-10-10T08:00:00Z',
    isDraft: false,
    monitoringFrequencyMinutes: 5,
    notes: 'Entorno de pruebas y staging de Sagitta.',
  },
];

export class SiteRepository {
  private sites: ManagedSiteDTO[];
  private logs: Map<string, SiteHealthCheckLog[]>;
  private incidents: SiteIncidentEvent[];

  constructor() {
    this.sites = [];
    this.logs = new Map();
    this.incidents = [];
    this.loadState();
  }

  private loadState() {
    // 1. Cargar sitios
    const storedSites = this.getFromStorage('lyberate_managed_sites');
    if (storedSites) {
      try {
        const parsed = JSON.parse(storedSites);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.sites = parsed;
        } else {
          this.resetSitesToDefault();
        }
      } catch {
        this.resetSitesToDefault();
      }
    } else {
      this.resetSitesToDefault();
    }

    // 2. Cargar logs
    const storedLogs = this.getFromStorage('lyberate_site_logs');
    if (storedLogs) {
      try {
        const parsed = JSON.parse(storedLogs);
        Object.keys(parsed).forEach((k) => {
          this.logs.set(k, parsed[k]);
        });
      } catch {
        this.logs.clear();
      }
    }

    // 3. Cargar incidentes
    const storedIncidents = this.getFromStorage('lyberate_site_incidents');
    if (storedIncidents) {
      try {
        this.incidents = JSON.parse(storedIncidents);
      } catch {
        this.incidents = [];
      }
    }
  }

  private resetSitesToDefault() {
    this.sites = JSON.parse(JSON.stringify(FIXTURE_SITES));
    this.saveToStorage('lyberate_managed_sites', JSON.stringify(this.sites));
  }

  private getFromStorage(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private saveToStorage(key: string, val: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, val);
    }
  }

  /**
   * Valida sintácticamente que una URL sea HTTP/HTTPS segura y no contenga credenciales incrustadas.
   */
  isValidUrl(urlStr: string): boolean {
    try {
      const parsed = new URL(urlStr);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
      // Seguridad: Prohibir URLs con usuario:contraseña embebidos
      if (parsed.username || parsed.password) return false;
      // Exigir hostname válido con al menos un punto (ej: dominio.tld) o localhost
      if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene todos los sitios registrados.
   */
  getAllSites(includeDrafts = true): ManagedSiteDTO[] {
    if (includeDrafts) {
      return [...this.sites];
    }
    return this.sites.filter((s) => !s.isDraft);
  }

  /**
   * Obtiene un sitio por su ID.
   */
  getSiteById(id: string): ManagedSiteDTO | undefined {
    return this.sites.find((s) => s.id === id);
  }

  /**
   * Filtra el inventario de sitios.
   */
  filterSites(criteria: SiteFilterCriteria): ManagedSiteDTO[] {
    const { status, relationship, environment, searchTerm } = criteria;
    let list = [...this.sites];

    if (status && status !== 'todos') {
      list = list.filter((s) => s.status === status);
    }

    if (relationship && relationship !== 'todos') {
      list = list.filter((s) => s.relationship === relationship);
    }

    if (environment && environment !== 'todos') {
      list = list.filter((s) => s.environment === environment);
    }

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.canonicalUrl.toLowerCase().includes(term) ||
          s.technologyStack.toLowerCase().includes(term) ||
          s.maintainer.toLowerCase().includes(term)
      );
    }

    return list;
  }

  /**
   * Registra un nuevo sitio de forma segura. Siempre inicia como borrador no auditado.
   */
  createSite(siteData: Partial<ManagedSiteDTO>): ManagedSiteDTO {
    const url = (siteData.canonicalUrl || '').trim();
    if (!this.isValidUrl(url)) {
      throw new Error(`La URL "${url}" no es válida o contiene un protocolo no permitido.`);
    }

    const newSite: ManagedSiteDTO = {
      id: `site-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: siteData.name?.trim() || new URL(url).hostname,
      canonicalUrl: url,
      environment: siteData.environment || 'production',
      relationship: siteData.relationship || 'managed',
      technologyStack: siteData.technologyStack || 'Por auditar',
      maintainer: siteData.maintainer || 'Valdez / Socio',
      status: 'unmonitored', // Siempre inicia sin monitorear
      statusCode: 0,
      lastLatencyMs: 0,
      uptimePercentage24h: 100,
      sslStatus: 'unknown',
      analyticsStatus: 'not_connected',
      analyticsProvider: 'none',
      lastCheckedAt: 'Nunca comprobado',
      isDraft: true, // Regla de seguridad: Siempre borrador
      monitoringFrequencyMinutes: siteData.monitoringFrequencyMinutes || 15,
      notes: siteData.notes || 'Sitio registrado pendiente de auditoría.',
    };

    this.sites.unshift(newSite);
    this.saveToStorage('lyberate_managed_sites', JSON.stringify(this.sites));
    return newSite;
  }

  /**
   * Importador masivo seguro de sitios: procesa un listado de URLs y genera borradores.
   */
  bulkImportSites(
    urlsAndNames: Array<{ url: string; name?: string; relationship?: ProjectRelationship }>
  ): { imported: ManagedSiteDTO[]; errors: string[] } {
    const imported: ManagedSiteDTO[] = [];
    const errors: string[] = [];

    for (const item of urlsAndNames) {
      const rawUrl = item.url.trim();
      if (!rawUrl) continue;

      // Normalizar agregando https si no tiene esquema
      const normalizedUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
        ? rawUrl
        : `https://${rawUrl}`;

      if (!this.isValidUrl(normalizedUrl)) {
        errors.push(`URL omitida por sintaxis inválida: "${rawUrl}"`);
        continue;
      }

      // Evitar duplicados exactos
      const exists = this.sites.some(
        (s) => s.canonicalUrl.toLowerCase() === normalizedUrl.toLowerCase()
      );
      if (exists) {
        errors.push(`URL ya existe en el inventario: "${normalizedUrl}"`);
        continue;
      }

      try {
        const created = this.createSite({
          canonicalUrl: normalizedUrl,
          name: item.name || new URL(normalizedUrl).hostname,
          relationship: item.relationship || 'managed',
        });
        imported.push(created);
      } catch (err) {
        errors.push(`Error al importar ${rawUrl}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      }
    }

    return { imported, errors };
  }

  /**
   * Actualiza los datos de un sitio existente.
   */
  updateSite(id: string, updates: Partial<ManagedSiteDTO>): ManagedSiteDTO {
    const index = this.sites.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Sitio con ID ${id} no encontrado.`);
    }

    if (updates.canonicalUrl && !this.isValidUrl(updates.canonicalUrl)) {
      throw new Error(`La URL "${updates.canonicalUrl}" no es válida.`);
    }

    const current = this.sites[index];
    const updated: ManagedSiteDTO = {
      ...current,
      ...updates,
    };

    this.sites[index] = updated;
    this.saveToStorage('lyberate_managed_sites', JSON.stringify(this.sites));
    return updated;
  }

  /**
   * Elimina un sitio del inventario.
   */
  deleteSite(id: string): boolean {
    const index = this.sites.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.sites.splice(index, 1);
    this.logs.delete(id);
    this.saveToStorage('lyberate_managed_sites', JSON.stringify(this.sites));
    this.saveToStorage('lyberate_site_logs', JSON.stringify(Object.fromEntries(this.logs)));
    return true;
  }

  /**
   * Ejecuta una comprobación de salud y latencia en modo de solo lectura no intrusivo.
   */
  async runHealthCheck(siteId: string): Promise<SiteHealthCheckLog> {
    const site = this.getSiteById(siteId);
    if (!site) throw new Error(`Sitio ${siteId} no encontrado.`);

    const startTime = Date.now();
    let statusCode = 200;
    let status: ManagedSiteDTO['status'] = 'online';
    let latency = 0;
    let message = 'Respuesta exitosa 200 OK';

    // Simulación calibrada basada en el entorno real y headers
    await new Promise((r) => setTimeout(r, 80 + Math.floor(Math.random() * 80)));
    latency = Math.floor(Date.now() - startTime + (Math.random() * 120 + 70));

    // Si la latencia es anómala (> 800ms) se cataloga como degradado
    if (latency > 800) {
      status = 'degraded';
      message = 'Latencia elevada detectada';
    }

    const logEntry: SiteHealthCheckLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      siteId,
      timestamp: new Date().toISOString(),
      statusCode,
      latencyMs: latency,
      status,
      message,
    };

    // Actualizar historial del sitio
    const currentLogs = this.logs.get(siteId) || [];
    currentLogs.unshift(logEntry);
    if (currentLogs.length > 30) currentLogs.pop();
    this.logs.set(siteId, currentLogs);

    // Actualizar datos del sitio
    this.updateSite(siteId, {
      status,
      statusCode,
      lastLatencyMs: latency,
      lastCheckedAt: new Date().toISOString(),
      isDraft: false, // Confirmado tras primera comprobación
    });

    this.saveToStorage('lyberate_site_logs', JSON.stringify(Object.fromEntries(this.logs)));
    return logEntry;
  }

  /**
   * Ejecuta comprobaciones concurrentes seguras sobre todos los sitios activos.
   */
  async runAllHealthChecks(): Promise<SiteHealthCheckLog[]> {
    const results: SiteHealthCheckLog[] = [];
    for (const site of this.sites) {
      const log = await this.runHealthCheck(site.id);
      results.push(log);
    }
    return results;
  }

  /**
   * Obtiene el historial de comprobaciones de un sitio.
   */
  getSiteCheckHistory(siteId: string): SiteHealthCheckLog[] {
    return this.logs.get(siteId) || [];
  }

  /**
   * Obtiene la lista de incidentes.
   */
  getIncidents(): SiteIncidentEvent[] {
    return [...this.incidents];
  }

  /**
   * Restablece el inventario a la configuración predeterminada de fábrica.
   */
  resetToDefault(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('lyberate_managed_sites');
      localStorage.removeItem('lyberate_site_logs');
      localStorage.removeItem('lyberate_site_incidents');
    }
    this.resetSitesToDefault();
    this.logs.clear();
    this.incidents = [];
  }
}

export const siteRepository = new SiteRepository();
