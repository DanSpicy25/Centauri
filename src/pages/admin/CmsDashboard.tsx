import React, { useState, useEffect } from 'react';
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
  Plus,
  Edit2,
  Trash2,
  Smartphone,
  Monitor,
  CheckCircle2,
  Globe,
  User,
  Check,
  ArrowRight,
} from 'lucide-react';
import { cmsRepository } from '../../repositories/cmsRepository';
import { subserviceRepository, SubserviceDTO } from '../../repositories/subserviceRepository';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import { CmsPageId, PageContentConfig, CmsAuditEvent } from '../../types/cms';

export const CmsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pages' | 'subservices' | 'settings' | 'audit'>('pages');

  // Estados de Páginas
  const [pages, setPages] = useState<PageContentConfig[]>(() => cmsRepository.getAllPages());
  const [auditLog, setAuditLog] = useState<CmsAuditEvent[]>(() => cmsRepository.getAuditLog());
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Estados de Subservicios
  const [subservices, setSubservices] = useState<SubserviceDTO[]>(() => subserviceRepository.getAll());
  const [editingSubservice, setEditingSubservice] = useState<SubserviceDTO | null>(null);
  const [isNewSubservice, setIsNewSubservice] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [deleteSubserviceId, setDeleteSubserviceId] = useState<string | null>(null);

  // Estados temporales del editor guiado de subservicio
  const [benefitInput, setBenefitInput] = useState('');
  const [deliverableInput, setDeliverableInput] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Estados de Configuración de Marca & Socio
  const [brandName, setBrandName] = useState('Lyberate');
  const [brandTagline, setBrandTagline] = useState('Soluciones digitales para tu negocio');
  const [brandSupportEmail, setBrandSupportEmail] = useState('contacto@lyberate.com');
  const [brandPhone, setBrandPhone] = useState('+58 412 000 0000');
  const [activePartnerProfile, setActivePartnerProfile] = useState<'Valdez' | 'Socio Fundador'>('Valdez');
  const [partnerNotificationPreference, setPartnerNotificationPreference] = useState(true);
  const [partnerDefaultDashboardView, setPartnerDefaultDashboardView] = useState('overview');

  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const refreshSubservices = () => {
    setSubservices(subserviceRepository.getAll());
  };

  useEffect(() => {
    const handleSubserviceUpdate = () => refreshSubservices();
    window.addEventListener('lyberate-subservices-update', handleSubserviceUpdate);
    return () => {
      window.removeEventListener('lyberate-subservices-update', handleSubserviceUpdate);
    };
  }, []);

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
    subserviceRepository.resetToDefault();
    setPages(cmsRepository.getAllPages());
    setAuditLog(cmsRepository.getAuditLog());
    setSubservices(subserviceRepository.getAll());
    setShowResetDialog(false);
    showNotification('CMS restablecido a los valores predeterminados de fábrica.');
  };

  const totalVersions = pages.reduce((acc, p) => {
    return acc + cmsRepository.getPageVersions(p.pageId).length;
  }, 0);

  // Manejo de Subservicios
  const handleOpenCreateSubservice = () => {
    const newSub: SubserviceDTO = {
      id: '',
      parentServiceId: 'srv-01',
      parentServiceName: 'Sitios web y portales',
      name: '',
      slug: '',
      tagline: '',
      description: '',
      benefits: ['Optimizado para teléfonos y computadoras'],
      deliverables: ['Diseño y arquitectura aprobada'],
      faqs: [],
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Demostración de servicio digital',
      ctaText: 'Solicitar propuesta',
      ctaLink: '/contacto',
      displayOrder: subservices.length + 1,
      status: 'draft',
      createdAt: '',
      updatedAt: '',
    };
    setEditingSubservice(newSub);
    setIsNewSubservice(true);
  };

  const handleSaveSubservice = () => {
    if (!editingSubservice) return;
    if (!editingSubservice.name.trim() || !editingSubservice.description.trim()) {
      showNotification('El nombre y la descripción son obligatorios.');
      return;
    }

    try {
      const slug =
        editingSubservice.slug.trim() ||
        editingSubservice.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      if (isNewSubservice) {
        subserviceRepository.createSubservice({
          ...editingSubservice,
          slug,
        });
        showNotification(`Subservicio "${editingSubservice.name}" creado como borrador.`);
      } else {
        subserviceRepository.updateSubservice(editingSubservice.id, {
          ...editingSubservice,
          slug,
        });
        showNotification(`Subservicio "${editingSubservice.name}" actualizado exitosamente.`);
      }

      refreshSubservices();
      setEditingSubservice(null);
      setIsNewSubservice(false);
    } catch {
      showNotification('Error al guardar el subservicio.');
    }
  };

  const handleDeleteSubservice = (id: string) => {
    subserviceRepository.deleteSubservice(id);
    refreshSubservices();
    setDeleteSubserviceId(null);
    showNotification('Subservicio eliminado del catálogo.');
  };

  // Añadir beneficio guiado
  const handleAddBenefit = () => {
    if (!editingSubservice || !benefitInput.trim()) return;
    setEditingSubservice({
      ...editingSubservice,
      benefits: [...editingSubservice.benefits, benefitInput.trim()],
    });
    setBenefitInput('');
  };

  const handleRemoveBenefit = (index: number) => {
    if (!editingSubservice) return;
    setEditingSubservice({
      ...editingSubservice,
      benefits: editingSubservice.benefits.filter((_, i) => i !== index),
    });
  };

  // Añadir entregable guiado
  const handleAddDeliverable = () => {
    if (!editingSubservice || !deliverableInput.trim()) return;
    setEditingSubservice({
      ...editingSubservice,
      deliverables: [...editingSubservice.deliverables, deliverableInput.trim()],
    });
    setDeliverableInput('');
  };

  const handleRemoveDeliverable = (index: number) => {
    if (!editingSubservice) return;
    setEditingSubservice({
      ...editingSubservice,
      deliverables: editingSubservice.deliverables.filter((_, i) => i !== index),
    });
  };

  // Añadir FAQ guiada
  const handleAddFaq = () => {
    if (!editingSubservice || !faqQuestion.trim() || !faqAnswer.trim()) return;
    setEditingSubservice({
      ...editingSubservice,
      faqs: [...(editingSubservice.faqs || []), { question: faqQuestion.trim(), answer: faqAnswer.trim() }],
    });
    setFaqQuestion('');
    setFaqAnswer('');
  };

  const handleRemoveFaq = (index: number) => {
    if (!editingSubservice) return;
    setEditingSubservice({
      ...editingSubservice,
      faqs: (editingSubservice.faqs || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FAF5FF] border border-[#E9D5FF] text-[11px] font-bold text-[#7C3AED] mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Fase 04 — CMS Editorial de Marca & Subservicios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Gestión Editorial & Personalización
          </h1>
          <p className="text-sm text-[#5C5B56] mt-1 max-w-2xl font-editorial-body">
            Control de páginas, bloques de subservicios guiados, personalización de marca compartida y preferencias privadas de cada socio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/cms/proyectos">
            <Button variant="primary" size="sm" className="gap-2 bg-[#7C3AED] hover:bg-[#6D28D9]">
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

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>PÁGINAS GESTIONADAS</span>
            <FileText className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-black text-[#141413]">{pages.length}</div>
          <p className="text-xs text-[#5C5B56] mt-1">Con soporte para edición modular</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>SUBSERVICIOS ACTIVOS</span>
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-black text-[#7C3AED]">{subservices.length}</div>
          <p className="text-xs text-[#5C5B56] mt-1">Bloques guiados sin código</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>HISTORIAL DE VERSIONES</span>
            <History className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#141413]">{totalVersions}</div>
          <p className="text-xs text-[#5C5B56] mt-1">Snapshots inmutables con rollback</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8A8881] mb-2">
            <span>SEGURIDAD EDITORIAL</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-lg font-black text-emerald-700">Aislamiento Total</div>
          <p className="text-xs text-[#5C5B56] mt-1">Sin exposición de APIs de riesgo</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'pages', label: `Páginas Públicas (${pages.length})` },
          { id: 'subservices', label: `Subservicios Guiados (${subservices.length})` },
          { id: 'settings', label: 'Marca vs Perfil de Socio' },
          { id: 'audit', label: `Historial de Auditoría (${auditLog.length})` },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* PESTAÑA 1: PÁGINAS EDITABLES */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-3xl border border-[#E5E3DC] overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#141413] tracking-tight">
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
                            <Button size="sm" variant="primary" className="gap-1.5 bg-[#7C3AED] hover:bg-[#6D28D9]">
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
      )}

      {/* PESTAÑA 2: SUBSERVICIOS GUIADOS */}
      {activeTab === 'subservices' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E5E3DC] shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#141413]">
                Catálogo de Subservicios Guiados
              </h2>
              <p className="text-xs text-[#5C5B56] mt-0.5 max-w-xl">
                Crea y edita ofertas especializadas con campos protegidos (beneficios, entregables, FAQs y CTA). La estructura no permite alterar el diseño ni romper la plantilla pública.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateSubservice}
              className="gap-1.5 text-xs bg-[#7C3AED] hover:bg-[#6D28D9] shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Subservicio</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subservices.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-3xl border border-[#E5E3DC] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED]">
                      {sub.parentServiceName}
                    </span>
                    <Badge variant={sub.status === 'published' ? 'success' : 'neutral'} size="sm">
                      {sub.status === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-[#141413]">{sub.name}</h3>
                  <p className="text-xs font-semibold text-[#7C3AED] mt-1">{sub.tagline}</p>
                  <p className="text-xs text-[#5C5B56] mt-2 leading-relaxed">{sub.description}</p>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#F0EFEA] text-[11px] text-[#5C5B56]">
                    <div>
                      <strong className="text-[#141413] block font-semibold">Beneficios:</strong>
                      <span>{sub.benefits.length} incluidos</span>
                    </div>
                    <div>
                      <strong className="text-[#141413] block font-semibold">Entregables:</strong>
                      <span>{sub.deliverables.length} definidos</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0EFEA] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#8A8881]">Orden: {sub.displayOrder}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSubservice({ ...sub });
                        setIsNewSubservice(false);
                      }}
                      className="text-xs gap-1 py-1 px-3"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Editar</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDeleteSubserviceId(sub.id)}
                      className="p-1.5 text-[#8A8881] hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: MARCA PÚBLICA VS PANEL PRIVADO */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tarjeta 1: Configuración Compartida de la Marca & Sitio Público */}
          <div className="bg-white rounded-3xl border border-[#E5E3DC] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E3DC]">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#141413]">
                  Configuración Compartida de la Marca & Web Pública
                </h3>
                <p className="text-xs text-[#5C5B56]">
                  Afecta directamente la identidad pública que ven los clientes en Lyberate.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Nombre Comercial de la Marca"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />

              <Input
                label="Lema / Propuesta de Valor Central"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Correo Oficial de Contacto"
                  type="email"
                  value={brandSupportEmail}
                  onChange={(e) => setBrandSupportEmail(e.target.value)}
                />
                <Input
                  label="Teléfono / WhatsApp de Ventas"
                  value={brandPhone}
                  onChange={(e) => setBrandPhone(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] space-y-2 text-xs">
                <span className="font-bold text-[#7C3AED] block">
                  Identidad Visual Histórica Respetada:
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-[#7C3AED]" />
                    <span>#7C3AED (Púrpura Primario)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-[#6D28D9]" />
                    <span>#6D28D9 (Hover)</span>
                  </div>
                </div>
                <p className="text-[#5C5B56] text-[11px] mt-1">
                  Tipografía del sistema: <strong>Newsreader</strong> (títulos editoriales) + <strong>Instrument Sans</strong> (cuerpo y datos).
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-xs"
                onClick={() => showNotification('Configuración de marca compartida guardada.')}
              >
                Guardar Configuración Pública
              </Button>
            </div>
          </div>

          {/* Tarjeta 2: Personalización Privada de Cada Socio */}
          <div className="bg-white rounded-3xl border border-[#E5E3DC] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E3DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] text-[#141413] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#141413]">
                  Personalización Privada del Panel de Trabajo
                </h3>
                <p className="text-xs text-[#5C5B56]">
                  Ajustes exclusivos para tu sesión de socio. No alteran la web pública ni el perfil de tu socio.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Select
                label="Perfil Activo de Socio"
                value={activePartnerProfile}
                onChange={(e) => setActivePartnerProfile(e.target.value as 'Valdez' | 'Socio Fundador')}
                options={[
                  { value: 'Valdez', label: 'Valdez — Dirección Técnica & Arquitectura' },
                  { value: 'Socio Fundador', label: 'Socio Fundador — Operaciones Comerciales' },
                ]}
              />

              <Select
                label="Módulo Inicial al Iniciar Sesión"
                value={partnerDefaultDashboardView}
                onChange={(e) => setPartnerDefaultDashboardView(e.target.value)}
                options={[
                  { value: 'overview', label: 'Cabina Operativa General (/admin)' },
                  { value: 'crm', label: 'Bandeja de Contactos & CRM (/admin/crm)' },
                  { value: 'projects', label: 'Proyectos & Entregas (/admin/proyectos)' },
                  { value: 'finance', label: 'Tesorería Multimoneda (/admin/finanzas)' },
                ]}
              />

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs text-[#141413] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={partnerNotificationPreference}
                    onChange={(e) => setPartnerNotificationPreference(e.target.checked)}
                    className="rounded border-[#D1CEBF] text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <span>Recibir alertas visuales inmediatas de nuevas consultas y comprobantes</span>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] text-xs text-[#5C5B56] space-y-1">
                <strong className="text-[#141413] block">Garantía de Privacidad entre Socios:</strong>
                <p>
                  Las notas de borrador no publicadas, filtros activos y preferencias de vista son aisladas localmente por socio.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => showNotification(`Preferencias privadas guardadas para ${activePartnerProfile}.`)}
              >
                Guardar Preferencias Privadas
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: AUDITORÍA & HISTORIAL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#E5E3DC] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
            <div>
              <h2 className="text-base font-bold text-[#141413] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
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
                  {auditLog.slice(0, 15).map((log) => {
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
      )}

      {/* MODAL: EDITOR GUIADO DE SUBSERVICIO CON PREVISUALIZACIÓN DESKTOP/MÓVIL */}
      {editingSubservice && (
        <Dialog
          isOpen={true}
          onClose={() => setEditingSubservice(null)}
          title={isNewSubservice ? 'Nuevo Subservicio Especializado' : `Editar: ${editingSubservice.name}`}
          description="Estructura guiada para crear ofertas comerciales sin código ni riesgo de deformar el diseño web."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setEditingSubservice(null)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveSubservice}
                className="bg-[#7C3AED] hover:bg-[#6D28D9]"
              >
                Guardar Subservicio
              </Button>
            </div>
          }
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Selector de Dispositivo para la Previsualización */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
              <span className="text-xs font-bold text-[#141413]">Previsualización en Tiempo Real:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                    previewDevice === 'desktop'
                      ? 'bg-[#141413] text-white'
                      : 'bg-white text-[#5C5B56] border border-[#E5E3DC]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Escritorio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                    previewDevice === 'mobile'
                      ? 'bg-[#141413] text-white'
                      : 'bg-white text-[#5C5B56] border border-[#E5E3DC]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Móvil</span>
                </button>
              </div>
            </div>

            {/* Caja de Previsualización Visual */}
            <div className="bg-[#FBFBF9] p-4 rounded-2xl border border-[#E5E3DC] flex justify-center">
              <div
                className={`bg-white rounded-2xl border border-[#E5E3DC] p-5 shadow-xs transition-all ${
                  previewDevice === 'mobile' ? 'max-w-xs w-full' : 'w-full'
                }`}
              >
                <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider block mb-1">
                  {editingSubservice.parentServiceName || 'Servicio'}
                </span>
                <h4 className="text-base font-bold text-[#141413]">
                  {editingSubservice.name || 'Título del Subservicio'}
                </h4>
                <p className="text-xs text-[#7C3AED] font-semibold mt-0.5">
                  {editingSubservice.tagline || 'Frase de impacto clara'}
                </p>
                <p className="text-xs text-[#5C5B56] mt-2 leading-relaxed">
                  {editingSubservice.description || 'Descripción del valor que recibe el cliente...'}
                </p>

                {editingSubservice.benefits.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F0EFEA] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8A8881] block">Beneficios:</span>
                    <ul className="space-y-1 text-[11px] text-[#5C5B56]">
                      {editingSubservice.benefits.map((b, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[#F0EFEA] flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {editingSubservice.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                  <span className="text-xs font-bold text-[#7C3AED] flex items-center gap-1">
                    <span>{editingSubservice.ctaText || 'Solicitar'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* Campos del Formulario Guiado */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Subservicio"
                  value={editingSubservice.name}
                  onChange={(e) => setEditingSubservice({ ...editingSubservice, name: e.target.value })}
                  placeholder="Ej. Catálogos Digitales & Pedidos WhatsApp"
                  required
                />

                <Select
                  label="Servicio Padre Asociado"
                  value={editingSubservice.parentServiceId}
                  onChange={(e) => {
                    const id = e.target.value;
                    let parentName = 'Servicio';
                    if (id === 'srv-01') parentName = 'Sitios web y portales';
                    else if (id === 'srv-02') parentName = 'Ventas y gestión';
                    else if (id === 'srv-03') parentName = 'Atención al cliente';
                    else if (id === 'srv-04') parentName = 'Conectar herramientas';
                    else if (id === 'srv-05') parentName = 'Soporte y mantenimiento';

                    setEditingSubservice({
                      ...editingSubservice,
                      parentServiceId: id,
                      parentServiceName: parentName,
                    });
                  }}
                  options={[
                    { value: 'srv-01', label: 'Sitios web y portales' },
                    { value: 'srv-02', label: 'Ventas y gestión' },
                    { value: 'srv-03', label: 'Atención al cliente' },
                    { value: 'srv-04', label: 'Conectar herramientas' },
                    { value: 'srv-05', label: 'Soporte y mantenimiento' },
                  ]}
                />
              </div>

              <Input
                label="Frase de Impacto (Tagline breve)"
                value={editingSubservice.tagline}
                onChange={(e) => setEditingSubservice({ ...editingSubservice, tagline: e.target.value })}
                placeholder="Ej. Muestra tu inventario y recibe pedidos por WhatsApp"
              />

              <Textarea
                label="Descripción del Valor (Lenguaje Claro, sin Jerga)"
                value={editingSubservice.description}
                onChange={(e) => setEditingSubservice({ ...editingSubservice, description: e.target.value })}
                placeholder="Explica qué problema soluciona y cómo ayuda a trabajar con más tranquilidad."
                rows={3}
                required
              />

              {/* Beneficios Clave (Bloque Guiado) */}
              <div className="space-y-2 pt-2 border-t border-[#E5E3DC]">
                <label className="text-xs font-bold text-[#141413] block">
                  Beneficios para el Cliente (Lista de puntos)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    placeholder="Ej. Búsqueda instantánea en menos de 1 segundo"
                    className="text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddBenefit} className="shrink-0 text-xs">
                    + Añadir
                  </Button>
                </div>
                <div className="space-y-1 mt-2">
                  {editingSubservice.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#FBFBF9] border border-[#E5E3DC] text-xs"
                    >
                      <span className="text-[#141413]">{b}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(i)}
                        className="text-[#8A8881] hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entregables Incluidos (Bloque Guiado) */}
              <div className="space-y-2 pt-2 border-t border-[#E5E3DC]">
                <label className="text-xs font-bold text-[#141413] block">
                  Entregables Concretos (Acuerdos contractuales)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    placeholder="Ej. Formulario protegido contra envíos repetidos"
                    className="text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddDeliverable} className="shrink-0 text-xs">
                    + Añadir
                  </Button>
                </div>
                <div className="space-y-1 mt-2">
                  {editingSubservice.deliverables.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#FBFBF9] border border-[#E5E3DC] text-xs"
                    >
                      <span className="text-[#141413]">{d}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(i)}
                        className="text-[#8A8881] hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preguntas Frecuentes (FAQ Guiadas) */}
              <div className="space-y-2 pt-2 border-t border-[#E5E3DC]">
                <label className="text-xs font-bold text-[#141413] block">
                  Preguntas Frecuentes Guiadas (Opcional)
                </label>
                <div className="space-y-2 bg-[#FBFBF9] p-3 rounded-xl border border-[#E5E3DC]">
                  <Input
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="Pregunta: Ej. ¿Funciona en conexiones lentas?"
                    className="text-xs"
                  />
                  <Textarea
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="Respuesta honesta y comprensible..."
                    rows={2}
                    className="text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddFaq} className="text-xs">
                    + Añadir Pregunta Frecuente
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {(editingSubservice.faqs || []).map((faq, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white border border-[#E5E3DC] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-[#141413]">
                        <span>Q: {faq.question}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(i)}
                          className="text-[#8A8881] hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[#5C5B56]">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E3DC]">
                <Select
                  label="Estado de Publicación"
                  value={editingSubservice.status}
                  onChange={(e) =>
                    setEditingSubservice({
                      ...editingSubservice,
                      status: e.target.value as 'published' | 'draft',
                    })
                  }
                  options={[
                    { value: 'draft', label: 'Borrador (Solo visible en CMS)' },
                    { value: 'published', label: 'Publicado (Visible en la web)' },
                  ]}
                />

                <Input
                  label="Orden de Visualización"
                  type="number"
                  value={String(editingSubservice.displayOrder)}
                  onChange={(e) =>
                    setEditingSubservice({
                      ...editingSubservice,
                      displayOrder: Number(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* DIALOG DE ELIMINAR SUBSERVICIO */}
      <Dialog
        isOpen={deleteSubserviceId !== null}
        onClose={() => setDeleteSubserviceId(null)}
        title="Confirmar Eliminación del Subservicio"
        description="Esta acción eliminará el subservicio del catálogo de ofertas comerciales."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteSubserviceId(null)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => deleteSubserviceId && handleDeleteSubservice(deleteSubserviceId)}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Confirmar Eliminación
            </Button>
          </div>
        }
      >
        <p className="text-xs text-[#5C5B56]">El subservicio no será visible para los clientes.</p>
      </Dialog>

      {/* DIALOG DE RESTABLECER CMS A FÁBRICA */}
      <Dialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        title="Restablecer CMS a valores de fábrica"
        description="Esta acción restaurará el contenido base inicial de todas las páginas, subservicios y versiones."
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
