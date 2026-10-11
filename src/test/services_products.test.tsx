import { describe, it, expect } from 'vitest';
import { FIXTURE_SERVICES, FIXTURE_PRODUCTS } from '../data/fixtures';
import { ServicesPage } from '../pages/public/ServicesPage';
import { ProductsPage } from '../pages/public/ProductsPage';

describe('Fase 04 — Servicios & Productos (Catálogo & Planes)', () => {
  it('el catálogo de servicios incluye las 5 categorías verificadas con entregables y requisitos de cotización', () => {
    expect(FIXTURE_SERVICES.length).toBe(5);

    const categories = FIXTURE_SERVICES.map((s) => s.category);
    expect(categories).toContain('web');
    expect(categories).toContain('systems');
    expect(categories).toContain('automation');
    expect(categories).toContain('integration');
    expect(categories).toContain('maintenance');

    FIXTURE_SERVICES.forEach((s) => {
      expect(s.title.length).toBeGreaterThan(5);
      expect(s.problemSolved.length).toBeGreaterThan(15);
      expect(s.targetAudience.length).toBeGreaterThan(10);
      expect(s.typicalDeliverables.length).toBeGreaterThanOrEqual(3);
      expect(s.requirementsToQuote?.length).toBeGreaterThanOrEqual(2);
      expect(s.isApproved).toBe(true);
    });
  });

  it('el catálogo de productos distingue plataformas con licencia y SaaS recurrente', () => {
    expect(FIXTURE_PRODUCTS.length).toBeGreaterThanOrEqual(3);

    const sagitta = FIXTURE_PRODUCTS.find((p) => p.slug === 'sagitta');
    expect(sagitta).toBeDefined();
    expect(sagitta?.status).toBe('available');
    expect(sagitta?.pricingModel).toBe('license');
    expect(sagitta?.verifiedFeatures.length).toBeGreaterThanOrEqual(4);

    const desk = FIXTURE_PRODUCTS.find((p) => p.slug === 'lyberatedesk');
    expect(desk).toBeDefined();
    expect(desk?.status).toBe('beta');
    expect(desk?.pricingModel).toBe('saas');
    expect(desk?.plans?.length).toBe(3);

    // Comprobar planes de LyberateDesk
    const planNames = desk?.plans?.map((p) => p.name);
    expect(planNames).toContain('Starter');
    expect(planNames).toContain('Business Pro');
    expect(planNames).toContain('Equipo ampliado');
  });

  it('ServicesPage y ProductsPage se exportan como componentes modulares', () => {
    expect(ServicesPage).toBeDefined();
    expect(ProductsPage).toBeDefined();
  });
});
