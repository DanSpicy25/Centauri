/**
 * CENTAURI × LYBERATE — STORAGE ADAPTER
 * Capa de abstracción y persistencia unificada para el Control Room y la web pública.
 * Soporta almacenamiento local en localStorage con fallback seguro en memoria
 * y arquitectura desacoplada para conexión transparente con backend API remoto.
 */

export type StorageMode = 'local_storage' | 'memory_fallback' | 'remote_api';

export interface StorageStatus {
  mode: StorageMode;
  available: boolean;
  totalKeysCount: number;
  lyberateKeysCount: number;
  estimatedBytesUsed: number;
  estimatedKilobytesUsed: number;
}

export class StorageAdapter {
  private memoryFallback: Map<string, string> = new Map();
  private modeOverride: StorageMode | null = null;
  private readonly defaultPrefix = 'lyberate_';

  /**
   * Determina si localStorage está disponible y tiene permisos de lectura/escritura.
   */
  isPersistenceAvailable(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const testKey = '__lyberate_test_storage__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Devuelve el modo activo de almacenamiento.
   */
  getStorageMode(): StorageMode {
    if (this.modeOverride) {
      return this.modeOverride;
    }
    return this.isPersistenceAvailable() ? 'local_storage' : 'memory_fallback';
  }

  /**
   * Permite alternar explícitamente el modo (p. ej. para pruebas o desarrollo con API remota).
   */
  setModeOverride(mode: StorageMode | null): void {
    this.modeOverride = mode;
  }

  /**
   * Lee un elemento tipado de persistencia con valor de respaldo si no existe o falla el parseo.
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const mode = this.getStorageMode();
      let raw: string | null = null;

      if (mode === 'local_storage' && typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(key);
      } else {
        raw = this.memoryFallback.get(key) || null;
      }

      if (raw === null || raw === undefined) {
        return defaultValue;
      }

      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[StorageAdapter] Error al leer o parsear clave "${key}". Usando valor por defecto.`, err);
      return defaultValue;
    }
  }

  /**
   * Escribe un elemento serializado en JSON en la capa de persistencia activa.
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const mode = this.getStorageMode();
      const serialized = JSON.stringify(value);

      if (mode === 'local_storage' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryFallback.set(key, serialized);
      }
      return true;
    } catch (err) {
      console.warn(`[StorageAdapter] Error al guardar clave "${key}". Guardando en memoria de contingencia.`, err);
      try {
        this.memoryFallback.set(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Elimina una clave específica de la persistencia.
   */
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      this.memoryFallback.delete(key);
    } catch (err) {
      console.warn(`[StorageAdapter] Error al eliminar clave "${key}".`, err);
    }
  }

  /**
   * Obtiene todas las claves almacenadas, opcionalmente filtradas por prefijo.
   */
  getAllKeys(prefix: string = this.defaultPrefix): string[] {
    const keys: string[] = [];
    const mode = this.getStorageMode();

    if (mode === 'local_storage' && typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          keys.push(k);
        }
      }
    } else {
      for (const k of this.memoryFallback.keys()) {
        if (k.startsWith(prefix)) {
          keys.push(k);
        }
      }
    }

    return keys;
  }

  /**
   * Obtiene un mapa con todos los elementos serializados para un prefijo dado.
   */
  getAllItems(prefix: string = this.defaultPrefix): Record<string, string> {
    const snapshot: Record<string, string> = {};
    const keys = this.getAllKeys(prefix);

    keys.forEach((key) => {
      const mode = this.getStorageMode();
      let val: string | null = null;
      if (mode === 'local_storage' && typeof window !== 'undefined' && window.localStorage) {
        val = window.localStorage.getItem(key);
      } else {
        val = this.memoryFallback.get(key) || null;
      }
      if (val !== null) {
        snapshot[key] = val;
      }
    });

    return snapshot;
  }

  /**
   * Elimina todas las claves que comiencen con el prefijo especificado.
   */
  clearNamespace(prefix: string = this.defaultPrefix): void {
    const keys = this.getAllKeys(prefix);
    keys.forEach((k) => this.removeItem(k));
  }

  /**
   * Calcula el estado y métricas de uso de la persistencia local.
   */
  getStatus(): StorageStatus {
    const available = this.isPersistenceAvailable();
    const mode = this.getStorageMode();
    const lyberateKeys = this.getAllKeys(this.defaultPrefix);

    let totalKeys = 0;
    let totalBytes = 0;

    if (mode === 'local_storage' && typeof window !== 'undefined' && window.localStorage) {
      totalKeys = window.localStorage.length;
      lyberateKeys.forEach((k) => {
        const val = window.localStorage.getItem(k) || '';
        totalBytes += k.length + val.length;
      });
    } else {
      totalKeys = this.memoryFallback.size;
      for (const [k, v] of this.memoryFallback.entries()) {
        if (k.startsWith(this.defaultPrefix)) {
          totalBytes += k.length + v.length;
        }
      }
    }

    return {
      mode,
      available,
      totalKeysCount: totalKeys,
      lyberateKeysCount: lyberateKeys.length,
      estimatedBytesUsed: totalBytes,
      estimatedKilobytesUsed: Number((totalBytes / 1024).toFixed(2)),
    };
  }
}

export const storageAdapter = new StorageAdapter();

