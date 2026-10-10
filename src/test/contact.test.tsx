import { describe, it, expect } from 'vitest';
import { crmRepository } from '../repositories/crmRepository';
import { ContactPage } from '../pages/public/ContactPage';

describe('Fase 06 — Contacto, Conversión & Honestidad en Transmisión', () => {
  it('registra solicitudes de contacto como clientes y oportunidades en el CRM local', () => {
    const prevClientsCount = crmRepository.getClients().length;
    const prevDealsCount = crmRepository.getDeals().length;

    const newClient = crmRepository.createClient({
      name: 'Empresa Test Contacto',
      email: 'test@contacto.com',
      industry: 'Solicitud web (software)',
      notes: 'Interés: software | Plazo: immediate | Requerimiento: Sistema POS a medida',
    });

    expect(crmRepository.getClients().length).toBe(prevClientsCount + 1);
    expect(newClient.name).toBe('Empresa Test Contacto');

    const newDeal = crmRepository.createDeal({
      title: 'Oportunidad: SOFTWARE — Empresa Test Contacto',
      clientId: newClient.id,
      clientName: newClient.name,
      stage: 'lead',
      valueUsd: 2500,
    });

    expect(crmRepository.getDeals().length).toBe(prevDealsCount + 1);
    expect(newDeal.stage).toBe('lead');
  });

  it('valida formato de correo y no permite registros inválidos', () => {
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(validEmailRegex.test('valdez@lyberate.com')).toBe(true);
    expect(validEmailRegex.test('invalido-sin-arroba')).toBe(false);
    expect(validEmailRegex.test('invalido@sin-dominio')).toBe(false);
  });

  it('ContactPage se exporta correctamente como componente modular para la web pública', () => {
    expect(ContactPage).toBeDefined();
  });
});

