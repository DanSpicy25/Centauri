import type { AdminNotificationDTO } from '../types/backend';
import { profileRepository, type FounderProfileDTO } from './profileRepository';

export interface MockAdminSession {
  userId: string;
  profileId: 'valdez' | 'socio';
  expiresAt: string;
}

interface MockAccount {
  profileId: MockAdminSession['profileId'];
  email: string;
  pin: string;
}

export interface TrustedDevice {
  id: string;
  label: string;
  firstSeenAt: string;
  lastSeenAt: string;
}

interface MockBackendState {
  accounts: MockAccount[];
  trustedDevices: Record<string, TrustedDevice[]>;
  notifications: AdminNotificationDTO[];
}

const STATE_KEY = 'lyberate_mock_backend_v1';
const DEVICE_KEY = 'lyberate_mock_device_id';
const SESSION_KEY = 'lyberate_mock_admin_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const DEFAULT_ACCOUNTS: MockAccount[] = [
  { profileId: 'valdez', email: 'valdez@lyberate.com', pin: '246810' },
  { profileId: 'socio', email: 'socio@lyberate.com', pin: '135790' },
];

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const dispatchBackendUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('lyberate-backend-update'));
  }
};

export class MockBackendRepository {
  private getStorage(): Storage | undefined {
    if (typeof window === 'undefined') return undefined;
    return window.localStorage;
  }

  private readState(): MockBackendState {
    const storage = this.getStorage();
    if (!storage) return this.createDefaultState();

    const raw = storage.getItem(STATE_KEY);
    if (!raw) {
      const state = this.createDefaultState();
      storage.setItem(STATE_KEY, JSON.stringify(state));
      return state;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<MockBackendState>;
      const accounts = Array.isArray(parsed.accounts) ? parsed.accounts : DEFAULT_ACCOUNTS;
      return {
        accounts,
        trustedDevices: parsed.trustedDevices ?? { valdez: [], socio: [] },
        notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      };
    } catch (error) {
      throw new Error('No se pudieron leer los datos del backend local.', { cause: error });
    }
  }

  private createDefaultState(): MockBackendState {
    return {
      accounts: DEFAULT_ACCOUNTS.map((account) => ({ ...account })),
      trustedDevices: { valdez: [], socio: [] },
      notifications: [],
    };
  }

  private writeState(state: MockBackendState): void {
    const storage = this.getStorage();
    if (!storage) throw new Error('El almacenamiento local no está disponible.');
    storage.setItem(STATE_KEY, JSON.stringify(state));
    dispatchBackendUpdate();
  }

  private getDeviceId(): string {
    const storage = this.getStorage();
    if (!storage) throw new Error('El almacenamiento local no está disponible.');
    let id = storage.getItem(DEVICE_KEY);
    if (!id) {
      id = createId();
      storage.setItem(DEVICE_KEY, id);
    }
    return id;
  }

  getDemoAccounts(): Array<Pick<MockAccount, 'profileId' | 'email'>> {
    return this.readState().accounts.map(({ profileId, email }) => ({ profileId, email }));
  }

  isCurrentDeviceTrusted(profileId: MockAdminSession['profileId']): boolean {
    const deviceId = this.getDeviceId();
    return this.readState().trustedDevices[profileId]?.some((device) => device.id === deviceId) ?? false;
  }

  signIn(profileId: MockAdminSession['profileId'], pin: string, rememberDevice: boolean): MockAdminSession {
    const state = this.readState();
    const account = state.accounts.find((item) => item.profileId === profileId);
    if (!account || account.pin !== pin) throw new Error('El PIN no coincide con la cuenta seleccionada.');

    const deviceId = this.getDeviceId();
    if (rememberDevice) {
      const devices = state.trustedDevices[profileId] ?? [];
      const now = new Date().toISOString();
      const existing = devices.find((device) => device.id === deviceId);
      if (existing) {
        existing.lastSeenAt = now;
      } else {
        devices.push({
          id: deviceId,
          label: this.getDeviceLabel(),
          firstSeenAt: now,
          lastSeenAt: now,
        });
      }
      state.trustedDevices[profileId] = devices;
      this.writeState(state);
    }

    const session: MockAdminSession = {
      userId: account.email,
      profileId,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    };
    if (typeof window === 'undefined' || !window.sessionStorage) {
      throw new Error('Las sesiones de demostración requieren almacenamiento de sesión del navegador.');
    }
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    dispatchBackendUpdate();
    return session;
  }

  getSession(): MockAdminSession | null {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw) as MockAdminSession;
      if (Date.parse(session.expiresAt) <= Date.now()) {
        window.sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      if (!['valdez', 'socio'].includes(session.profileId)) return null;
      return session;
    } catch (error) {
      throw new Error('No se pudo validar la sesión de demostración.', { cause: error });
    }
  }

  signOut(): void {
    if (typeof window !== 'undefined') window.sessionStorage?.removeItem(SESSION_KEY);
    dispatchBackendUpdate();
  }

  changePin(profileId: MockAdminSession['profileId'], currentPin: string, nextPin: string): void {
    const session = this.getSession();
    if (!session || session.profileId !== profileId) {
      throw new Error('Solo puedes cambiar el PIN de tu propia cuenta.');
    }
    if (!/^\d{6}$/.test(nextPin)) throw new Error('El nuevo PIN debe tener exactamente 6 dígitos.');

    const state = this.readState();
    const account = state.accounts.find((item) => item.profileId === profileId);
    if (!account || account.pin !== currentPin) throw new Error('El PIN actual no es correcto.');
    account.pin = nextPin;
    this.writeState(state);
  }

  updateOwnProfile(changes: Partial<FounderProfileDTO>): FounderProfileDTO {
    const session = this.getSession();
    if (!session) throw new Error('Inicia sesión antes de actualizar tu perfil.');
    const updated = profileRepository.updateOwnProfile(session.profileId, changes);
    const recipientProfileId = session.profileId === 'valdez' ? 'socio' : 'valdez';
    this.addNotification({
      recipientProfileId,
      actorProfileId: session.profileId,
      type: 'profile_updated',
      title: 'Tu socio actualizó su perfil',
      body: `${updated.name} guardó cambios en sus datos de presentación y contacto.`,
      resourceId: session.profileId,
    });
    return updated;
  }

  getTrustedDevices(profileId: MockAdminSession['profileId']): TrustedDevice[] {
    const session = this.getSession();
    if (!session || session.profileId !== profileId) {
      throw new Error('Solo puedes consultar los dispositivos de tu propia cuenta.');
    }
    return [...(this.readState().trustedDevices[profileId] ?? [])];
  }

  revokeTrustedDevice(profileId: MockAdminSession['profileId'], deviceId: string): void {
    const session = this.getSession();
    if (!session || session.profileId !== profileId) {
      throw new Error('Solo puedes administrar los dispositivos de tu propia cuenta.');
    }
    const state = this.readState();
    state.trustedDevices[profileId] = (state.trustedDevices[profileId] ?? []).filter(
      (device) => device.id !== deviceId
    );
    this.writeState(state);
  }

  addNotification(notification: Omit<AdminNotificationDTO, 'id' | 'createdAt' | 'readAt'>): void {
    const session = this.getSession();
    if (!session || session.profileId !== notification.actorProfileId) {
      throw new Error('La sesión activa no puede crear avisos en nombre de otra cuenta.');
    }
    const state = this.readState();
    state.notifications.unshift({
      ...notification,
      id: createId(),
      createdAt: new Date().toISOString(),
    });
    state.notifications = state.notifications.slice(0, 100);
    this.writeState(state);
  }

  getNotifications(profileId: MockAdminSession['profileId']): AdminNotificationDTO[] {
    const session = this.getSession();
    if (!session || session.profileId !== profileId) {
      throw new Error('Solo puedes consultar las notificaciones de tu propia cuenta.');
    }
    return this.readState().notifications.filter(
      (notification) => notification.recipientProfileId === profileId
    );
  }

  markNotificationRead(profileId: MockAdminSession['profileId'], notificationId: string): void {
    const session = this.getSession();
    if (!session || session.profileId !== profileId) {
      throw new Error('Solo puedes marcar como leídas las notificaciones de tu propia cuenta.');
    }
    const state = this.readState();
    const notification = state.notifications.find(
      (item) => item.id === notificationId && item.recipientProfileId === profileId
    );
    if (!notification) throw new Error('No se encontró la notificación para esta cuenta.');
    notification.readAt = new Date().toISOString();
    this.writeState(state);
  }

  private getDeviceLabel(): string {
    if (typeof navigator === 'undefined') return 'Navegador local';
    const platform =
      (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform ||
      navigator.platform ||
      'Dispositivo';
    return `${platform} · navegador`;
  }

  verifyCredentials(profileId: MockAdminSession['profileId'], pin: string): boolean {
    const state = this.readState();
    const account = state.accounts.find((item) => item.profileId === profileId);
    return Boolean(account && account.pin === pin);
  }

  expireSessionForDemo(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        try {
          const session = JSON.parse(raw) as MockAdminSession;
          session.expiresAt = new Date(Date.now() - 1000).toISOString();
          window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
          dispatchBackendUpdate();
        } catch {
          // ignore parsing error
        }
      }
    }
  }

  generateDemoOtp(profileId: MockAdminSession['profileId']): string {
    return profileId === 'valdez' ? '482910' : '719302';
  }

  resetToDefault(): void {
    this.getStorage()?.removeItem(STATE_KEY);
    if (typeof window !== 'undefined') {
      window.sessionStorage?.removeItem(SESSION_KEY);
    }
  }
}

export const mockBackendRepository = new MockBackendRepository();
