import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Layers,
  History,
  ShieldCheck,
  Edit3,
  ExternalLink,
  RotateCcw,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { cmsRepository } from '../../repositories/cmsRepository';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Dialog } from '../../components/ui/Dialog';
import { CmsPageId, PageContentConfig, CmsAuditEvent } from '../../types/cms';

export const CmsDashboard: React.FC = () => {
  const [pages, setPages] = useState<PageContentConfig[]>(cmsRepository.getAllPages());
  const [auditLog, setAuditLog] = useState<CmsAuditEvent[]>(cmsRepository.getAuditLog());
  const [showResetDialog, setShowResetDialog] = useState(false);

  const getPageUrl = (pageId: CmsPageId): string => {
    switch (pageId) {
      case 'home':
        return '/';
      case 'about':
        return '/sobre-nosotros';
      case 'services':
        return '/servicios';
      case 'products':
        return '/productos';
      case 'works':
        return '/trabajos';
      case 'contact':
        return '/contacto';
      default:
        return '/';
    }
  };

  const handleFactoryReset = () => {
    cmsRepository.resetAllToFactory();
    setPages(cmsRepository.getAllPages());
    setAuditLog(cmsRepository.getAuditLog());
    setShowResetDialog(false);
  };

  const totalVersions = pages.reduce((acc, p) => {
    return acc + cmsRepository.getPageVersions(p.pageId).length;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-[11px] font-bold text-[#C85A32] mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Fase 04 — CMS Editorial de Marca</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Gestión Editorial & Personalización
          </h1>
          <p className="text-sm text-[#5C5B56] mt-1 max-w-2xl font-editorial-body">
            Control integral de contenidos, secciones dinámicas, metadatos SEO y versiones inmutables con capacidad de rollback para el portafolio de los socios fundadores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/cms/proyectos">
            <Button variant="primary" size="sm" className="gap-2">
              <Layers className="w-4 h-4" />
              <span>Gestión de Portafolio</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetDialog(true)}
            className="gap-2 text-[#8A8881] hover:text-red-700 hover:border-red-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Valores de Fábrica</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>PÁGINAS GESTIONADAS</span>
            <FileText className="w-4 h-4 text-[#C85A32]" />
          </div>
          <div className="text-2xl font-bold text-[#141413]">{pages.length}</div>
          <p className="text-xs text-[#5C5B56] mt-1">Con soporte para edición modular</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>HISTORIAL DE VERSIONES</span>
            <History className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#141413]">{totalVersions}</div>
          <p className="text-xs text-[#5C5B56] mt-1">Snapshots inmutables con 1-click rollback</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>EVENTOS AUDITADOS</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#141413]">{auditLog.length}</div>
          <p className="text-xs text-[#5C5B56] mt-1">Trazabilidad de cambios y publicaciones</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E3DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>SEGURIDAD EDITORIAL</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-lg font-bold text-emerald-700">Aislamiento Total</div>
          <p className="text-xs text-[#5C5B56] mt-1">Sin exposición de credenciales ni APIs de riesgo</p>
        </div>
      </div>

      {/* Page Directory */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] overflow-hidden">
        <div className="p-6 border-b border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#141413] tracking-tight">
              Directorio de Páginas Editables
            </h2>
            <p className="text-xs text-[#5C5B56] mt-0.5">
              Personaliza el texto, orden de secciones, visibilidad y etiquetas SEO de cada página de la web pública.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBF9] text-[#5C5B56] border-b border-[#E5E3DC] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Página & Ruta</th>
                <th className="px-6 py-3.5">Versión Activa</th>
                <th className="px-6 py-3.5">Secciones</th>
                <th className="px-6 py-3.5">Última Modificación</th>
                <th className="px-6 py-3.5">SEO Meta</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEA]">
              {pages.map((p) => {
                const publicUrl = getPageUrl(p.pageId);
                const versionsCount = cmsRepository.getPageVersions(p.pageId).length;

                return (
                  <tr key={p.pageId} className="hover:bg-[#FDFDFD] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#141413] text-sm">{p.pageName}</div>
                      <div className="text-[11px] font-mono text-[#8A8881] mt-0.5">{publicUrl}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="success">{p.currentVersionId}</Badge>
                        <span className="text-[10px] text-[#8A8881]">({versionsCount} rev.)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#141413] font-medium">
                        {p.sectionsConfig.length} secciones
                      </span>
                      <span className="text-[10px] text-[#8A8881] block">
                        {p.sectionsConfig.filter((s) => s.isVisible).length} visibles
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#141413]">{p.lastModifiedBy}</div>
                      <div className="text-[10px] text-[#8A8881] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(p.lastModified).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.seo.robotsIndex ? 'neutral' : 'warning'}>
                        {p.seo.robotsIndex ? 'Indexable' : 'No-Index'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/cms/editor/${p.pageId}`}>
                          <Button size="sm" variant="primary" className="gap-1.5">
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </Button>
                        </Link>
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-[#8A8881] hover:text-[#141413] hover:bg-[#F5F4EF] rounded-lg transition-colors"
                          title="Abrir página pública"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail Section */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
          <div>
            <h2 className="text-base font-bold text-[#141413] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C85A32]" />
              <span>Registro de Auditoría de Cambios (Audit Trail)</span>
            </h2>
            <p className="text-xs text-[#5C5B56] mt-0.5">
              Registro inmutable de publicaciones, guardados de borrador y restauraciones de versiones.
            </p>
          </div>
          <span className="text-xs text-[#8A8881]">Últimas {auditLog.length} operaciones</span>
        </div>

        {auditLog.length === 0 ? (
          <p className="text-xs text-[#8A8881] py-4 text-center">No hay registros de auditoría aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#8A8881] uppercase font-semibold text-[10px] border-b border-[#F0EFEA]">
                <tr>
                  <th className="py-2.5">Acción</th>
                  <th className="py-2.5">Objetivo</th>
                  <th className="py-2.5">Autor</th>
                  <th className="py-2.5">Detalles</th>
                  <th className="py-2.5 text-right">Fecha & Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EF]">
                {auditLog.slice(0, 10).map((log) => {
                  let badgeVariant: 'brand' | 'neutral' | 'success' | 'warning' | 'info' = 'neutral';
                  let label: string = log.action;
                  if (log.action === 'publish') {
                    badgeVariant = 'success';
                    label = 'PUBLICACIÓN';
                  } else if (log.action === 'rollback') {
                    badgeVariant = 'warning';
                    label = 'ROLLBACK';
                  } else if (log.action === 'save_draft') {
                    badgeVariant = 'neutral';
                    label = 'BORRADOR';
                  }

                  return (
                    <tr key={log.id} className="hover:bg-[#FBFBF9]">
                      <td className="py-3">
                        <Badge variant={badgeVariant}>{label}</Badge>
                      </td>
                      <td className="py-3 font-semibold text-[#141413]">{log.target}</td>
                      <td className="py-3 text-[#5C5B56]">{log.author}</td>
                      <td className="py-3 text-[#5C5B56] max-w-xs truncate">{log.details}</td>
                      <td className="py-3 text-right font-mono text-[11px] text-[#8A8881]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        title="Restablecer CMS a valores de fábrica"
        description="Esta acción restaurará el contenido base inicial de todas las páginas y versiones. Se conservará la estructura predeterminada aprobada."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowResetDialog(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleFactoryReset} className="bg-red-700 hover:bg-red-800 text-white">
              Confirmar Restablecimiento
            </Button>
          </div>
        }
      >
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong>Advertencia:</strong> Se perderán los borradores no publicados y el historial volverá a la versión base v1.0.0.
          </div>
        </div>
      </Dialog>
    </div>
  );
};
