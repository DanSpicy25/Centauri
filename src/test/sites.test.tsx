import { describe, it, expect, beforeEach } from 'vitest';
import { siteRepository } from '../repositories/siteRepository';

describe('Sites Hub & Monitoring Engine (Phase 05)', () => {
  beforeEach(() => {
    siteRepository.resetToDefault();
  });

  it('debe inicializar el repositorio con los 5 sitios verificados de la auditoría técnica', () => {
    const sites = siteRepository.getAllSites();
    expect(sites.length).toBe(5);

    const orgemac = sites.find((s) => s.canonicalUrl === 'https://orgemac.com/');
    expect(orgemac).toBeDefined();
    expect(orgemac?.status).toBe('online');
    expect(orgemac?.statusCode).toBe(200);
    expect(orgemac?.environment).toBe('production');
    expect(orgemac?.analyticsStatus).toBe('not_connected'); // Honestidad de métricas
  });

  it('debe registrar un nuevo sitio siempre como borrador y validar protocolo seguro', () => {
    // 1. URL con protocolo inválido debe fallar
    expect(() => {
      siteRepository.createSite({
        canonicalUrl: 'ftp://servidor-inseguro.com',
      });
    }).toThrow('no es válida o contiene un protocolo no permitido');

    // 2. URL con credenciales incrustadas debe fallar por seguridad
    expect(() => {
      siteRepository.createSite({
        canonicalUrl: 'https://admin:password123@servidor.com',
      });
    }).toThrow('no es válida');

    // 3. URL válida debe registrarse con isDraft: true y status: unmonitored
    const newSite = siteRepository.createSite({
      name: 'Nuevo Portal Cliente',
      canonicalUrl: 'https://nuevo-cliente.org/',
      relationship: 'client',
      environment: 'production',
    });

    expect(newSite.id).toBeDefined();
    expect(newSite.isDraft).toBe(true);
    expect(newSite.status).toBe('unmonitored');
    expect(newSite.lastCheckedAt).toBe('Nunca comprobado');
  });

  it('debe ejecutar importación masiva filtrando duplicados y URLs inválidas', () => {
    const batch = [
      { url: 'https://cliente-alpha.com' },
      { url: 'cliente-beta.com' }, // Sin esquema https (debe auto-normalizarse)
      { url: 'https://orgemac.com/' }, // Duplicado de fixture (debe reportar error)
      { url: 'not-a-valid-domain' }, // Inválido sintáctico
    ];

    const result = siteRepository.bulkImportSites(batch);
    expect(result.imported.length).toBe(2); // alpha y beta importados
    expect(result.errors.length).toBe(2); // duplicado orgemac y dominio inválido

    const allSites = siteRepository.getAllSites();
    expect(allSites.length).toBe(7); // 5 iniciales + 2 importados
  });

  it('debe ejecutar comprobación de salud y registrar el log de latencia', async () => {
    const newSite = siteRepository.createSite({
      name: 'Sitio de Prueba Ping',
      canonicalUrl: 'https://prueba-ping.lyberate.com/',
    });

    const log = await siteRepository.runHealthCheck(newSite.id);
    expect(log.statusCode).toBe(200);
    expect(log.latencyMs).toBeGreaterThan(0);
    expect(log.status).toBe('online');

    // Verificar que el sitio se actualizó con la latencia
    const updated = siteRepository.getSiteById(newSite.id);
    expect(updated?.lastLatencyMs).toBe(log.latencyMs);
    expect(updated?.lastCheckedAt).not.toBe('Nunca comprobado');
    expect(updated?.isDraft).toBe(false); // Confirmado tras chequeo

    // Historial debe tener la entrada
    const history = siteRepository.getSiteCheckHistory(newSite.id);
    expect(history.length).toBe(1);
    expect(history[0].id).toBe(log.id);
  });

  it('debe filtrar sitios por entorno, relación y término de búsqueda', () => {
    const prodSites = siteRepository.filterSites({ environment: 'production' });
    expect(prodSites.length).toBe(4);

    const stagingSites = siteRepository.filterSites({ environment: 'staging' });
    expect(stagingSites.length).toBe(1);
    expect(stagingSites[0].name).toContain('Sagitta');

    const searchResult = siteRepository.filterSites({ searchTerm: 'Cloudflare' });
    expect(searchResult.length).toBeGreaterThan(0);
  });

  it('debe eliminar sitios del inventario y limpiar su historial', () => {
    const site = siteRepository.createSite({
      name: 'Sitio a Borrar',
      canonicalUrl: 'https://borrar.com/',
    });

    const deleted = siteRepository.deleteSite(site.id);
    expect(deleted).toBe(true);
    expect(siteRepository.getSiteById(site.id)).toBeUndefined();
    expect(siteRepository.getSiteCheckHistory(site.id).length).toBe(0);
  });
});

