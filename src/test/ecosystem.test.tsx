import { describe, it, expect } from 'vitest';
import { ecosystemRepository } from '../repositories/ecosystemRepository';
import { EcosystemVisualizer } from '../components/domain/EcosystemVisualizer';
import { HomePage } from '../pages/public/HomePage';

describe('Fase 02 — Ecosistema Tecnológico & Inicio', () => {
  it('el repositorio del ecosistema expone los 8 nodos auditados con datos no simulados', () => {
    const nodes = ecosystemRepository.getNodes();
    expect(nodes.length).toBe(8);

    const sagitta = ecosystemRepository.getNodeById('sagitta');
    expect(sagitta).toBeDefined();
    expect(sagitta?.type).toBe('product');
    expect(sagitta?.isDemoData).toBe(false);
    expect(sagitta?.businessValue).toContain('inventario');
  });

  it('permite consultar nodos por tipo y capa arquitectónica', () => {
    const products = ecosystemRepository.getNodesByType('product');
    expect(products.some((p) => p.id === 'sagitta')).toBe(true);
    expect(products.some((p) => p.id === 'lyberatedesk')).toBe(true);

    const publicLayer = ecosystemRepository.getNodesByLayer('public');
    expect(publicLayer.some((p) => p.id === 'lyberate-core')).toBe(true);
    expect(publicLayer.some((p) => p.id === 'noticia')).toBe(true);
  });

  it('proporciona conexiones verificadas entre sistemas del ecosistema sin relaciones ficticias', () => {
    const connections = ecosystemRepository.getConnections();
    expect(connections.length).toBeGreaterThanOrEqual(8);
    expect(connections.every((c) => c.isVerified)).toBe(true);

    const coreConns = ecosystemRepository.getConnectionsForNode('lyberate-core');
    expect(coreConns.length).toBeGreaterThanOrEqual(2);
  });

  it('todos los nodos poseen entregable claro, tecnologías auditadas y valor de negocio', () => {
    const nodes = ecosystemRepository.getNodes();
    nodes.forEach((n) => {
      expect(n.id).toBeDefined();
      expect(n.name.length).toBeGreaterThan(3);
      expect(n.businessValue.length).toBeGreaterThan(15);
      expect(n.keyDeliverable.length).toBeGreaterThan(10);
      expect(n.verifiedTechnologies.length).toBeGreaterThan(0);
      expect(n.connectedTo.length).toBeGreaterThan(0);
    });
  });

  it('EcosystemVisualizer y HomePage se exportan correctamente como componentes modulares', () => {
    expect(EcosystemVisualizer).toBeDefined();
    expect(HomePage).toBeDefined();
  });
});
