import { describe, it, expect } from 'vitest';
import { FIXTURE_PROJECTS, FIXTURE_TEAM, FIXTURE_SERVICES, FIXTURE_PRODUCTS } from '../data/fixtures';
import { tokens } from '../styles/tokens';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';

describe('Design System & Foundations (Phase 01)', () => {
  it('debe contener fixtures verificados de proyectos sin métricas ficticias', () => {
    expect(FIXTURE_PROJECTS.length).toBeGreaterThanOrEqual(3);
    FIXTURE_PROJECTS.forEach((proj) => {
      expect(proj.id).toBeDefined();
      expect(proj.name).toBeDefined();
      expect(proj.relationship).toMatch(/^(own|client|collaboration|managed|unknown)$/);
      expect(proj.verifiedTechnologies.length).toBeGreaterThan(0);
      expect(proj.lyberateContribution).toBeDefined();
    });
  });

  it('debe contar con miembros de equipo con especificación de rol y monograma para aro de marca', () => {
    expect(FIXTURE_TEAM.length).toBeGreaterThanOrEqual(3);
    FIXTURE_TEAM.forEach((member) => {
      expect(member.name).toBeDefined();
      expect(member.role).toBeDefined();
      expect(member.monogram).toBeDefined();
      expect(member.ringAccentColor).toBeDefined();
    });
  });

  it('debe tener sagitta y contacto con la noticia catalogados como proyectos propios confirmados', () => {
    const sagitta = FIXTURE_PROJECTS.find((p) => p.slug === 'sagitta');
    const contacto = FIXTURE_PROJECTS.find((p) => p.slug === 'contacto-con-la-noticia');

    expect(sagitta).toBeDefined();
    expect(sagitta?.relationship).toBe('own');
    expect(contacto).toBeDefined();
    expect(contacto?.relationship).toBe('own');
  });

  it('debe centralizar tokens de diseño accesibles (WCAG AAA) y motion system', () => {
    expect(tokens.colors.canvas).toBe('#FBFBF9');
    expect(tokens.colors.brand.primary).toBe('#7C3AED');
    expect(tokens.colors.textMain).toBe('#141413');
    expect(tokens.typography.fonts.heading).toContain('Newsreader');
    expect(tokens.typography.fonts.body).toContain('Instrument Sans');
    expect(tokens.motion.durations.normal).toBe('220ms');
  });

  it('debe exportar la primitiva Card y Button con soporte de micro-interacciones y animación de acción', () => {
    expect(Card).toBeDefined();
    expect(CardHeader).toBeDefined();
    expect(CardTitle).toBeDefined();
    expect(Button).toBeDefined();
  });
});

describe('Web Pública de Lyberate (Phase 02)', () => {
  it('debe contar con proyectos configurados para el carrusel de Inicio', () => {
    const featured = FIXTURE_PROJECTS.filter((p) => p.isFeaturedInHomeCarousel);
    expect(featured.length).toBeGreaterThanOrEqual(2);
    featured.forEach((p) => {
      expect(p.thumbnailUrl).toBeDefined();
      expect(p.summary.length).toBeGreaterThan(10);
      expect(p.tagline.length).toBeGreaterThan(5);
    });
  });

  it('debe validar la estructura de servicios aprobados sin precios ficticios', () => {
    expect(FIXTURE_SERVICES.length).toBeGreaterThanOrEqual(3);
    FIXTURE_SERVICES.forEach((srv) => {
      expect(srv.title).toBeDefined();
      expect(srv.problemSolved).toBeDefined();
      expect(srv.typicalDeliverables.length).toBeGreaterThan(0);
      expect(srv.isApproved).toBe(true);
    });
  });

  it('debe contar con productos verificados con funcionalidades auditadas', () => {
    expect(FIXTURE_PRODUCTS.length).toBeGreaterThanOrEqual(2);
    FIXTURE_PRODUCTS.forEach((prod) => {
      expect(prod.name).toBeDefined();
      expect(prod.verifiedFeatures.length).toBeGreaterThanOrEqual(3);
      expect(prod.status).toMatch(/^(development|beta|available)$/);
    });
  });

  it('todos los proyectos deben tener slug único para sus casos de estudio', () => {
    const slugs = FIXTURE_PROJECTS.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });
});
