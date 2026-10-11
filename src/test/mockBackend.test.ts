import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockBackendRepository } from '../repositories/mockBackendRepository';
import { profileRepository } from '../repositories/profileRepository';

class MemoryStorage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe('Backend simulado para las cuentas administrativas', () => {
  let localStorage: MemoryStorage;
  let sessionStorage: MemoryStorage;

  beforeEach(() => {
    localStorage = new MemoryStorage();
    sessionStorage = new MemoryStorage();
    vi.stubGlobal('window', {
      localStorage,
      sessionStorage,
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal('localStorage', localStorage);
    mockBackendRepository.resetToDefault();
    profileRepository.resetToDefault();
  });

  afterEach(() => {
    mockBackendRepository.resetToDefault();
    profileRepository.resetToDefault();
    vi.unstubAllGlobals();
  });

  it('mantiene dos cuentas independientes y rechaza un PIN incorrecto', () => {
    expect(mockBackendRepository.getDemoAccounts().map((account) => account.profileId)).toEqual([
      'valdez',
      'socio',
    ]);
    expect(() => mockBackendRepository.signIn('socio', '246810', false)).toThrow(
      'El PIN no coincide'
    );
    expect(mockBackendRepository.getSession()).toBeNull();
  });

  it('inicia una sesión individual y registra el navegador solo para esa cuenta', () => {
    const session = mockBackendRepository.signIn('valdez', '246810', true);

    expect(session.profileId).toBe('valdez');
    expect(mockBackendRepository.getSession()?.userId).toBe('valdez@lyberate.com');
    expect(mockBackendRepository.isCurrentDeviceTrusted('valdez')).toBe(true);
    expect(mockBackendRepository.isCurrentDeviceTrusted('socio')).toBe(false);
  });

  it('permite cambiar el PIN propio y bloquea el cambio de la cuenta del socio', () => {
    mockBackendRepository.signIn('valdez', '246810', false);

    expect(() => mockBackendRepository.changePin('socio', '135790', '112233')).toThrow(
      'Solo puedes cambiar el PIN de tu propia cuenta'
    );
    mockBackendRepository.changePin('valdez', '246810', '112233');
    mockBackendRepository.signOut();

    expect(() => mockBackendRepository.signIn('valdez', '246810', false)).toThrow(
      'El PIN no coincide'
    );
    expect(mockBackendRepository.signIn('valdez', '112233', false).profileId).toBe('valdez');
    expect(() => mockBackendRepository.changePin('valdez', '112233', '123')).toThrow(
      'exactamente 6 dígitos'
    );
  });

  it('entrega avisos únicamente a la cuenta destinataria y registra su lectura', () => {
    mockBackendRepository.signIn('valdez', '246810', false);
    mockBackendRepository.addNotification({
      recipientProfileId: 'socio',
      actorProfileId: 'valdez',
      type: 'profile_updated',
      title: 'Perfil actualizado',
      body: 'Valdez guardó cambios.',
      resourceId: 'valdez',
    });
    mockBackendRepository.signOut();
    mockBackendRepository.signIn('socio', '135790', false);

    const [notification] = mockBackendRepository.getNotifications('socio');
    expect(notification.title).toBe('Perfil actualizado');
    expect(() => mockBackendRepository.getNotifications('valdez')).toThrow(
      'Solo puedes consultar las notificaciones'
    );

    mockBackendRepository.markNotificationRead('socio', notification.id);
    expect(mockBackendRepository.getNotifications('socio')[0].readAt).toBeDefined();
  });

  it('permite que el perfil actualice únicamente su propia ficha', () => {
    expect(() =>
      profileRepository.updateOwnProfile('valdez', { id: 'socio', name: 'Cambio no autorizado' })
    ).toThrow('Solo puedes modificar tu propio perfil');

    const updated = profileRepository.updateOwnProfile('valdez', { name: 'Valdez Actualizado' });
    expect(updated.name).toBe('Valdez Actualizado');
    expect(profileRepository.getProfileById('socio')?.name).toBe('Socio Fundador');
  });

  it('guarda el perfil de la sesión y avisa al otro socio sin revelar su cuenta', () => {
    expect(() => mockBackendRepository.updateOwnProfile({ name: 'No autenticado' })).toThrow(
      'Inicia sesión'
    );
    mockBackendRepository.signIn('valdez', '246810', false);
    const updated = mockBackendRepository.updateOwnProfile({ name: 'Valdez Con Sesión' });

    expect(updated.name).toBe('Valdez Con Sesión');
    expect(mockBackendRepository.getNotifications('valdez')).toHaveLength(0);
    mockBackendRepository.signOut();
    mockBackendRepository.signIn('socio', '135790', false);
    expect(mockBackendRepository.getNotifications('socio')[0].body).toContain('Valdez Con Sesión');
  });

  it('valida credenciales PIN y genera códigos 2FA temporales de demostración', () => {
    expect(mockBackendRepository.verifyCredentials('valdez', '246810')).toBe(true);
    expect(mockBackendRepository.verifyCredentials('valdez', '999999')).toBe(false);
    expect(mockBackendRepository.verifyCredentials('socio', '135790')).toBe(true);
    expect(mockBackendRepository.verifyCredentials('socio', '246810')).toBe(false);

    const otpValdez = mockBackendRepository.generateDemoOtp('valdez');
    expect(otpValdez).toMatch(/^\d{6}$/);
    const otpSocio = mockBackendRepository.generateDemoOtp('socio');
    expect(otpSocio).toMatch(/^\d{6}$/);
  });

  it('permite simular la expiración inmediata de sesión para pruebas de seguridad', () => {
    mockBackendRepository.signIn('valdez', '246810', false);
    expect(mockBackendRepository.getSession()).not.toBeNull();

    mockBackendRepository.expireSessionForDemo();
    expect(mockBackendRepository.getSession()).toBeNull();
  });
});
