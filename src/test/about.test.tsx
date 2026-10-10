import { describe, it, expect } from 'vitest';
import { profileRepository } from '../repositories/profileRepository';
import { AboutPage } from '../pages/public/AboutPage';

describe('Fase 03 — Sobre Nosotros & Socios Fundadores', () => {
  it('el repositorio de perfiles retorna los 2 socios fundadores auditados', () => {
    const profiles = profileRepository.getProfiles();
    expect(profiles.length).toBe(2);

    const valdez = profileRepository.getProfileById('valdez');
    expect(valdez).toBeDefined();
    expect(valdez?.name).toBe('Valdez');
    expect(valdez?.roleTitle).toContain('Arquitecto de Software');
    expect(valdez?.specialties.length).toBeGreaterThan(3);
    expect(valdez?.email).toContain('valdez@');

    const socio = profileRepository.getProfileById('socio');
    expect(socio).toBeDefined();
    expect(socio?.name).toContain('Socio Fundador');
    expect(socio?.roleTitle).toContain('Operaciones');
    expect(socio?.specialties.length).toBeGreaterThan(3);
  });

  it('permite actualizar y persistir perfiles de fundadores', () => {
    const valdez = profileRepository.getProfileById('valdez');
    expect(valdez).toBeDefined();

    const updated = profileRepository.updateProfile('valdez', {
      phone: '+58 412 889 0012',
    });
    expect(updated.phone).toBe('+58 412 889 0012');
  });

  it('AboutPage se exporta correctamente como componente modular para la web pública', () => {
    expect(AboutPage).toBeDefined();
  });
});
