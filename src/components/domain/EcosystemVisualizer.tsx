import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ShieldCheck,
  Layers,
  Newspaper,
  Compass,
  MessageSquare,
  Cpu,
  Lock,
  Network,
  ListFilter,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { ecosystemRepository } from '../../repositories/ecosystemRepository';
import { EcosystemNode, EcosystemNodeType } from '../../types/ecosystem';
import { Button } from '../ui/Button';

interface EcosystemVisualizerProps {
  className?: string;
}

export const EcosystemVisualizer: React.FC<EcosystemVisualizerProps> = ({ className = '' }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('sagitta');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'topology' | 'accessible-list'>('topology');

  const allNodes: EcosystemNode[] = useMemo(() => ecosystemRepository.getNodes(), []);
  const allConnections = useMemo(() => ecosystemRepository.getConnections(), []);

  const filteredNodes: EcosystemNode[] = useMemo(() => {
    if (filterType === 'all') return allNodes;
    if (filterType === 'products') return allNodes.filter((n) => n.type === 'product');
    if (filterType === 'sites') return allNodes.filter((n) => n.type === 'site');
    if (filterType === 'operations') {
      return allNodes.filter(
        (n) => n.type === 'automation' || n.type === 'internal_tool' || n.type === 'system'
      );
    }
    if (filterType === 'infra') return allNodes.filter((n) => n.type === 'integration');
    return allNodes;
  }, [allNodes, filterType]);

  const selectedNode: EcosystemNode = useMemo(
    () => allNodes.find((n) => n.id === selectedNodeId) || allNodes[0],
    [allNodes, selectedNodeId]
  );

  const activeConnectionsForSelected = useMemo(() => {
    if (!selectedNode) return [];
    return ecosystemRepository.getConnectionsForNode(selectedNode.id);
  }, [selectedNode]);

  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    return new Set(selectedNode.connectedTo);
  }, [selectedNode]);

  const getNodeIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Globe':
        return <Globe className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Newspaper':
        return <Newspaper className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Lock':
        return <Lock className={className} />;
      default:
        return <Network className={className} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operativo</span>
          </span>
        );
      case 'beta':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Beta / Demo disponible</span>
          </span>
        );
      case 'development':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>En desarrollo</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F4EF] text-[#5C5B56] border border-[#E5E3DC]">
            <span>Planificado</span>
          </span>
        );
    }
  };

  const getTypeLabel = (type: EcosystemNodeType) => {
    switch (type) {
      case 'product':
        return 'Producto Propio';
      case 'site':
        return 'Portal Web';
      case 'system':
        return 'Sistema & App';
      case 'automation':
        return 'Automatización';
      case 'integration':
        return 'Infraestructura';
      case 'internal_tool':
        return 'Control Room';
      default:
        return 'Módulo';
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-[#E5E3DC] p-6 sm:p-10 shadow-[0_12px_40px_rgba(20,20,19,0.04)] ${className}`}
      aria-label="Visualización interactiva del ecosistema tecnológico de Lyberate"
    >
      {/* Encabezado y Selector de Vistas */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#F0EFEA] mb-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-xs font-semibold text-[#7C3AED]">
            <Network className="w-3.5 h-3.5" />
            <span>Arquitectura Relacional Verificada</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Cómo se conectan nuestras soluciones
          </h3>
          <p className="text-xs sm:text-sm text-[#5C5B56] leading-relaxed">
            Lyberate no es una simple web aislada: es un conjunto estructurado de productos comerciales, portales editoriales, automatizaciones de mensajería e infraestructura segura.
          </p>
        </div>

        {/* Controles: Conmutador de modo accesible */}
        <div className="flex items-center gap-2 bg-[#F5F4EF] p-1.5 rounded-2xl border border-[#E5E3DC] shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('topology')}
            aria-pressed={viewMode === 'topology'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'topology'
                ? 'bg-white text-[#7C3AED] shadow-xs'
                : 'text-[#5C5B56] hover:text-[#141413]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Mapa de Topología</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('accessible-list')}
            aria-pressed={viewMode === 'accessible-list'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'accessible-list'
                ? 'bg-white text-[#141413] shadow-xs'
                : 'text-[#5C5B56] hover:text-[#141413]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Lista Accesible (WCAG)</span>
          </button>
        </div>
      </div>

      {/* Pestañas de Filtrado por Capa */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-semibold text-[#8A8881] mr-1">Filtrar por:</span>
        {[
          { id: 'all', label: `Todos (${allNodes.length})` },
          { id: 'products', label: 'Productos Propios' },
          { id: 'sites', label: 'Portales & Sitios Web' },
          { id: 'operations', label: 'Operaciones & Sistemas' },
          { id: 'infra', label: 'Infraestructura & CDN' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
              filterType === tab.id
                ? 'bg-[#141413] text-white border-[#141413]'
                : 'bg-white text-[#5C5B56] border-[#E5E3DC] hover:bg-[#F5F4EF] hover:text-[#141413]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* VISTA 1: TOPOLOGÍA INTERACTIVA */}
      {viewMode === 'topology' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Matriz de Nodos (col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-[#8A8881] flex items-center justify-between pb-2">
              <span>Selecciona un nodo para inspeccionar sus relaciones:</span>
              <span className="text-[11px] font-mono text-[#7C3AED]">
                {activeConnectionsForSelected.length} conexiones activas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredNodes.map((node) => {
                const isSelected = node.id === selectedNode.id;
                const isConnected = connectedNodeIds.has(node.id);

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    aria-label={`Seleccionar ${node.name}. Estado: ${node.status}`}
                    aria-pressed={isSelected}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#FBFBF9] border-[#7C3AED] shadow-[0_4px_20px_rgba(124,58,237,0.15)] ring-2 ring-[#7C3AED]/20'
                        : isConnected
                        ? 'bg-white border-[#A78BFA]/60 hover:border-[#7C3AED] hover:bg-[#FBFBF9]'
                        : 'bg-white border-[#E5E3DC] hover:border-[#D1CEBF] hover:bg-[#FBFBF9]'
                    }`}
                  >
                    {/* Indicador de relación activa */}
                    {isConnected && !isSelected && (
                      <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-[#7C3AED] bg-[#F5F4EF] px-2 py-0.5 rounded-full border border-[#E5E3DC]">
                        Conectado
                      </span>
                    )}

                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#7C3AED] text-white'
                            : isConnected
                            ? 'bg-[#F5F4EF] text-[#7C3AED]'
                            : 'bg-[#F5F4EF] text-[#5C5B56] group-hover:text-[#141413]'
                        }`}
                      >
                        {getNodeIcon(node.iconName)}
                      </div>

                      <div className="space-y-1 min-w-0 pr-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8881] block truncate">
                          {getTypeLabel(node.type)}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#141413] tracking-tight truncate">
                          {node.name}
                        </h4>
                        <p className="text-xs text-[#5C5B56] line-clamp-2 leading-relaxed">
                          {node.businessValue}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Nota de veracidad técnica honesta */}
            <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] flex items-center gap-2.5 text-xs text-[#5C5B56]">
              <Info className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <span>
                <strong>Garantía de veracidad:</strong> Las conexiones mostradas corresponden a integraciones y flujos existentes en código. No incluimos métricas simuladas ni sistemas que no operen en el entorno.
              </span>
            </div>
          </div>

          {/* Panel de Inspección de Nodo Seleccionado (col-span-5) */}
          <div className="lg:col-span-5 bg-[#FBFBF9] border border-[#E5E3DC] rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#141413] text-white flex items-center justify-center shadow-xs">
                  {getNodeIcon(selectedNode.iconName, 'w-6 h-6 text-[#7C3AED]')}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8881] block">
                    {selectedNode.categoryLabel}
                  </span>
                  <h4 className="text-xl font-extrabold text-[#141413] font-editorial-heading">
                    {selectedNode.name}
                  </h4>
                </div>
              </div>
              {getStatusBadge(selectedNode.status)}
            </div>

            {/* ¿Qué hace para tu negocio? */}
            <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C3AED]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>¿Qué aporta a tu negocio?</span>
              </div>
              <p className="text-xs sm:text-sm text-[#141413] leading-relaxed font-medium">
                {selectedNode.businessValue}
              </p>
            </div>

            {/* Entregable clave */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8881] block mb-1">
                Entregable principal:
              </span>
              <p className="text-xs text-[#141413] font-semibold">{selectedNode.keyDeliverable}</p>
            </div>

            {/* Tecnologías verificadas */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8881] block mb-2">
                Tecnologías auditadas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.verifiedTechnologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono text-[#141413] bg-white px-2.5 py-1 rounded-md border border-[#E5E3DC]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Conexiones directas en el ecosistema */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8881] block mb-2">
                Conexiones activas con otros sistemas:
              </span>
              <div className="space-y-2">
                {activeConnectionsForSelected.map((conn) => {
                  const otherNodeId =
                    conn.fromNodeId === selectedNode.id ? conn.toNodeId : conn.fromNodeId;
                  const otherNode = allNodes.find((n) => n.id === otherNodeId);
                  if (!otherNode) return null;

                  return (
                    <button
                      key={conn.id}
                      type="button"
                      onClick={() => setSelectedNodeId(otherNode.id)}
                      className="w-full text-left p-2.5 rounded-xl bg-white border border-[#E5E3DC] hover:border-[#7C3AED] transition-colors flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold text-[#141413] group-hover:text-[#7C3AED] block">
                            {otherNode.name}
                          </span>
                          <span className="text-[11px] text-[#8A8881] leading-tight block">
                            {conn.relationshipLabel}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8A8881] group-hover:text-[#7C3AED] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Acciones directas */}
            <div className="pt-4 border-t border-[#E5E3DC] flex flex-wrap gap-3">
              {selectedNode.caseStudySlug && (
                <Link to={`/trabajos/${selectedNode.caseStudySlug}`}>
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <span>Ver caso de estudio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
              {selectedNode.publicUrl && (
                <a
                  href={selectedNode.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5B56] hover:text-[#141413] py-2 px-3 rounded-lg border border-[#E5E3DC] bg-white hover:bg-[#F5F4EF] transition-colors"
                >
                  <span>Visitar sitio oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <Link to="/contacto">
                <Button variant="outline" size="sm">
                  Solicitar demostración
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: LISTA ESTRUCTURADA ACCESIBLE (WCAG AAA) */}
      {viewMode === 'accessible-list' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#F5F4EF] border border-[#E5E3DC] text-xs text-[#5C5B56]">
            <strong>Vista de accesibilidad universal:</strong> Esta tabla estructurada presenta todos los módulos del ecosistema, su rol en el negocio y sus relaciones técnicas sin depender de efectos visuales interactivos.
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E5E3DC]">
            <table className="w-full text-left text-xs border-collapse bg-white">
              <thead>
                <tr className="bg-[#F5F4EF] text-[#141413] border-b border-[#E5E3DC] font-bold">
                  <th scope="col" className="p-4">Sistema / Plataforma</th>
                  <th scope="col" className="p-4">Tipo & Capa</th>
                  <th scope="col" className="p-4">Valor para el Negocio</th>
                  <th scope="col" className="p-4">Estado</th>
                  <th scope="col" className="p-4">Conexiones Verificadas</th>
                  <th scope="col" className="p-4">Tecnologías</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {filteredNodes.map((node) => {
                  const connections = allConnections.filter(
                    (c) => c.fromNodeId === node.id || c.toNodeId === node.id
                  );

                  return (
                    <tr key={node.id} className="hover:bg-[#FBFBF9] transition-colors">
                      <td className="p-4 font-bold text-[#141413] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[#7C3AED]">{getNodeIcon(node.iconName, 'w-4 h-4')}</span>
                          <span>{node.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#5C5B56]">
                        <span className="font-semibold block">{getTypeLabel(node.type)}</span>
                        <span className="text-[10px] text-[#8A8881] uppercase">{node.architectureLayer}</span>
                      </td>
                      <td className="p-4 text-[#141413] max-w-sm">
                        {node.businessValue}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getStatusBadge(node.status)}
                      </td>
                      <td className="p-4 text-[#5C5B56]">
                        <ul className="space-y-1">
                          {connections.map((c) => {
                            const otherId = c.fromNodeId === node.id ? c.toNodeId : c.fromNodeId;
                            const other = allNodes.find((n) => n.id === otherId);
                            return (
                              <li key={c.id} className="flex items-center gap-1 text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                                <span className="font-semibold text-[#141413]">{other?.name}:</span>
                                <span>{c.relationshipLabel}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                      <td className="p-4 text-[#8A8881] font-mono text-[11px]">
                        {node.verifiedTechnologies.join(', ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
