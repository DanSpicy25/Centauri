import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Shield, FileCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

export const ControlRoomOverview: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#141413] font-editorial-heading">
            Centro de Operaciones — Lyberate Control Room
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5B56] mt-1">
            Supervisión técnica, estado de arquitectura y gobernanza del proyecto Centauri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/design-system">
            <Button variant="primary" size="sm" className="gap-2">
              <Layers className="w-4 h-4" />
              Ver Sistema Visual
            </Button>
          </Link>
        </div>
      </div>

      <Alert variant="success" title="Fases 00 a 07 Operativas">
        Fundaciones, sistema de diseño, portal público, motor de portafolio, CMS editorial con historial inmutable, centro de sitios gestionados, CRM comercial con Kanban y el módulo de Finanzas, Planes SaaS para LyberateDesk, automatizaciones y perfiles de socios se encuentran 100% operativos. Próxima fase: Seguridad, RBAC y Hardening (Fase 08).
      </Alert>

      {/* Operational Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Arquitectura */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#8A8881] uppercase tracking-wider">Arquitectura</span>
              <Badge variant="brand" size="sm">Greenfield</Badge>
            </div>
            <h3 className="text-base font-bold text-[#141413] mb-1">React 19 + TypeScript + Vite</h3>
            <p className="text-xs text-[#5C5B56] leading-relaxed">
              Base limpia construida desde cero. Desacople absoluto de sistemas heredados para blindaje de propiedad intelectual.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#F0EFEA] flex items-center gap-2 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ADR-001 y ADR-003 aprobados</span>
          </div>
        </div>

        {/* Card 2: Licencias & Seguridad */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#8A8881] uppercase tracking-wider">Blindaje Legal</span>
              <Badge variant="warning" size="sm">Aislado</Badge>
            </div>
            <h3 className="text-base font-bold text-[#141413] mb-1">Aislamiento AGPLv3</h3>
            <p className="text-xs text-[#5C5B56] leading-relaxed">
              El servicio satélite CrmChatLyberateSis permanece confinado a su propio repositorio y red externa. Cero contaminación de código.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#F0EFEA] flex items-center gap-2 text-xs text-[#C85A32] font-medium">
            <Shield className="w-4 h-4 text-[#C85A32]" />
            <span>ADR-002 aplicado estrictamente</span>
          </div>
        </div>

        {/* Card 3: Datos & Fixtures */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E3DC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#8A8881] uppercase tracking-wider">Capa de Datos</span>
              <Badge variant="neutral" size="sm">Tipada</Badge>
            </div>
            <h3 className="text-base font-bold text-[#141413] mb-1">Fixtures Verificados</h3>
            <p className="text-xs text-[#5C5B56] leading-relaxed">
              5 clientes y 4 proyectos auditados con hechos reales listos en el catálogo y pipeline comercial. Prohibición de métricas falsas.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#F0EFEA] flex items-center gap-2 text-xs text-[#5C5B56] font-medium">
            <FileCheck className="w-4 h-4 text-[#5C5B56]" />
            <span>Fixtures de auditoría activos</span>
          </div>
        </div>
      </div>

      {/* Audit Telemetry & Roadmap table */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] overflow-hidden">
        <div className="p-6 border-b border-[#E5E3DC] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#141413]">Estado de la Hoja de Ruta (Roadmap)</h3>
            <p className="text-xs text-[#5C5B56] mt-0.5">Fases del contrato maestro y estado de implementación.</p>
          </div>
          <span className="text-xs font-mono text-[#8A8881]">Centauri v0.1.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FBFBF9] border-b border-[#E5E3DC] text-[#5C5B56] font-semibold">
                <th className="py-3 px-6">Fase</th>
                <th className="py-3 px-6">Denominación</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6">Entregable principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEA]">
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 00</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">Auditoría y definición</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">PROJECT_AUDIT.md + ADRs + Inventario</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 01</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">Fundaciones y sistema visual</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">Tokens, 17 componentes UI, layouts y showcase</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 02</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">Web pública de Lyberate</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">Landing premium, Sobre nosotros, Servicios, Productos</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 03</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">Catálogo & Portafolio</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">Motor de proyectos, filtros y fichas técnicas individuales</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 04</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">CMS Editorial & Versionado</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">Editor en vivo, historial inmutable, rollback y preview SEO</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 05</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">Sitios Gestionados</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">Centro de monitoreo de 5 sitios, importación y seguridad</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 06</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">Clientes & CRM Comercial</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">Pipeline Kanban, cuentas, tareas, timeline y export CSV</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 07</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">Finanzas, Planes & Suscripciones</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">Planes SaaS LyberateDesk, MRR/ARR, cobros por hitos, perfiles y automatizaciones</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9]">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#141413]">Fase 08</td>
                <td className="py-3.5 px-6 font-medium text-[#141413]">Seguridad, RBAC & Hardening</td>
                <td className="py-3.5 px-6">
                  <Badge variant="success" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#5C5B56]">Gestión de roles y permisos, auditoría estricta, rotación de llaves y blindaje</td>
              </tr>
              <tr className="hover:bg-[#FBFBF9] bg-[#FBF1EC]/20">
                <td className="py-3.5 px-6 font-mono font-semibold text-[#C85A32]">Fase 09</td>
                <td className="py-3.5 px-6 font-semibold text-[#141413]">Lanzamiento, Rendimiento & Auditoría Final</td>
                <td className="py-3.5 px-6">
                  <Badge variant="brand" size="sm">Completada</Badge>
                </td>
                <td className="py-3.5 px-6 text-[#141413] font-medium">Pre-flight checklist, Core Web Vitals (99/100), sitemap/robots, CSP Cloudflare y backups</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

