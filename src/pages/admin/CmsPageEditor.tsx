import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  History,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MoveUp,
  MoveDown,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { cmsRepository } from '../../repositories/cmsRepository';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Dialog } from '../../components/ui/Dialog';
import { Checkbox } from '../../components/ui/Checkbox';
import {
  CmsPageId,
  PageContentConfig,
  PageVersionSnapshot,
  HeroSectionData,
  AboutStorySectionData,
  ProcessStep,
} from '../../types/cms';

export const CmsPageEditor: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const validPageId = (pageId as CmsPageId) || 'home';
  const [content, setContent] = useState<PageContentConfig>(() =>
    cmsRepository.getPageContent(validPageId)
  );
  const [versions, setVersions] = useState<PageVersionSnapshot[]>(() =>
    cmsRepository.getPageVersions(validPageId)
  );

  const [activeTab, setActiveTab] = useState<'sections' | 'seo' | 'preview' | 'versions'>('sections');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [changelogNote, setChangelogNote] = useState('');
  const [rollbackTarget, setRollbackTarget] = useState<PageVersionSnapshot | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Actualizar estado al cambiar la ruta
  useEffect(() => {
    const fresh = cmsRepository.getPageContent(validPageId);
    setContent(fresh);
    setVersions(cmsRepository.getPageVersions(validPageId));
    setStatusMessage(null);
  }, [validPageId]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Guardar borrador
  const handleSaveDraft = () => {
    try {
      const updated = cmsRepository.savePageDraft(validPageId, content, 'Socio Fundador');
      setContent(updated);
      showNotification('success', 'Borrador guardado exitosamente sin alterar la versión pública.');
    } catch {
      showNotification('error', 'Error al guardar el borrador.');
    }
  };

  // Publicar versión formal
  const handlePublish = () => {
    try {
      const newSnapshot = cmsRepository.publishPage(
        validPageId,
        'Socio Fundador',
        changelogNote.trim() || 'Actualización de contenidos y secciones'
      );
      setContent(newSnapshot.data);
      setVersions(cmsRepository.getPageVersions(validPageId));
      setPublishModalOpen(false);
      setChangelogNote('');
      showNotification('success', `¡Versión ${newSnapshot.versionId} publicada exitosamente! Ya está activa en la web.`);
    } catch {
      showNotification('error', 'Error al publicar la nueva versión.');
    }
  };

  // Ejecutar rollback
  const handleRollback = (target: PageVersionSnapshot) => {
    try {
      const restored = cmsRepository.rollbackPage(validPageId, target.versionId, 'Socio Fundador');
      setContent(restored);
      setVersions(cmsRepository.getPageVersions(validPageId));
      setRollbackTarget(null);
      showNotification('success', `Restauración exitosa (Rollback) a la versión ${target.versionId}.`);
    } catch {
      showNotification('error', 'Error al revertir la versión.');
    }
  };

  // Reordenar sección
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...content.sectionsConfig];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Actualizar orden numérico
    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setContent({ ...content, sectionsConfig: newSections });
  };

  // Alternar visibilidad de sección
  const toggleSectionVisibility = (index: number) => {
    const newSections = [...content.sectionsConfig];
    newSections[index].isVisible = !newSections[index].isVisible;
    setContent({ ...content, sectionsConfig: newSections });
  };

  // Manejadores para Hero
  const handleHeroChange = <K extends keyof HeroSectionData>(key: K, value: HeroSectionData[K]) => {
    if (!content.hero) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        [key]: value,
      },
    });
  };

  const handleAddBadge = () => {
    if (!content.hero) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        badges: [...content.hero.badges, 'Nueva capacidad verificada'],
      },
    });
  };

  const handleRemoveBadge = (idx: number) => {
    if (!content.hero) return;
    const newBadges = content.hero.badges.filter((_, i) => i !== idx);
    setContent({
      ...content,
      hero: {
        ...content.hero,
        badges: newBadges,
      },
    });
  };

  // Manejadores para AboutStory
  const handleStoryChange = <K extends keyof AboutStorySectionData>(
    key: K,
    value: AboutStorySectionData[K]
  ) => {
    if (!content.aboutStory) return;
    setContent({
      ...content,
      aboutStory: {
        ...content.aboutStory,
        [key]: value,
      },
    });
  };

  // Manejadores para ProcessSteps
  const handleProcessStepChange = (idx: number, field: keyof ProcessStep, value: string) => {
    if (!content.processSteps) return;
    const updated = [...content.processSteps];
    updated[idx] = { ...updated[idx], [field]: value };
    setContent({ ...content, processSteps: updated });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E3DC]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/cms')}
            className="p-2 text-[#5C5B56]"
            aria-label="Volver al panel CMS"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#141413] tracking-tight">
                Editor: {content.pageName}
              </h1>
              <Badge variant="success">{content.currentVersionId}</Badge>
            </div>
            <p className="text-xs text-[#8A8881] mt-0.5">
              Editado por {content.lastModifiedBy} • {new Date(content.lastModified).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
            <Save className="w-4 h-4 text-[#5C5B56]" />
            <span>Guardar Borrador</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setPublishModalOpen(true)}
            className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Send className="w-4 h-4" />
            <span>Publicar Versión</span>
          </Button>

          <Link
            to={validPageId === 'home' ? '/' : `/${validPageId}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-[#8A8881] hover:text-[#141413] hover:bg-[#F5F4EF] rounded-lg transition-colors"
            title="Ver página pública en vivo"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Descartar
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'sections', label: 'Estructura & Secciones' },
          { id: 'seo', label: 'SEO & Metadatos' },
          { id: 'preview', label: 'Simulador de Vista Previa' },
          { id: 'versions', label: `Historial de Versiones (${versions.length})` },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* Tab 1: Secciones & Estructura */}
      {activeTab === 'sections' && (
        <div className="space-y-8">
          {/* Secciones Manager (Reordenar y visibilidad) */}
          <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#141413]">
                Organización Modular de Secciones
              </h2>
              <p className="text-xs text-[#5C5B56] mt-0.5">
                Reordena o activa/desactiva secciones visuales. Los cambios se reflejarán instantáneamente en la web tras publicar.
              </p>
            </div>

            <div className="space-y-2">
              {content.sectionsConfig.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="flex items-center justify-between p-3.5 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#F0EFEA] flex items-center justify-center font-mono text-xs font-bold text-[#5C5B56]">
                      {sec.order}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#141413]">{sec.name}</span>
                      <span className="text-[10px] font-mono text-[#8A8881] block">
                        id: {sec.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(idx)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        sec.isVisible
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}
                    >
                      {sec.isVisible ? 'Visible' : 'Oculta'}
                    </button>

                    <div className="flex items-center border border-[#E5E3DC] rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'up')}
                        className="p-1.5 hover:bg-[#F5F4EF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Subir sección"
                      >
                        <MoveUp className="w-3.5 h-3.5 text-[#5C5B56]" />
                      </button>
                      <div className="w-[1px] h-4 bg-[#E5E3DC]" />
                      <button
                        type="button"
                        disabled={idx === content.sectionsConfig.length - 1}
                        onClick={() => moveSection(idx, 'down')}
                        className="p-1.5 hover:bg-[#F5F4EF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Bajar sección"
                      >
                        <MoveDown className="w-3.5 h-3.5 text-[#5C5B56]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor de Hero (Si existe) */}
          {content.hero && (
            <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                <div>
                  <h3 className="text-base font-bold text-[#141413]">
                    Contenido del Hero & Propuesta de Valor
                  </h3>
                  <p className="text-xs text-[#5C5B56]">
                    El encabezado principal que ven los visitantes al cargar la página.
                  </p>
                </div>
                <Badge variant="neutral">Sección Hero</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Etiqueta Superior (Eyebrow)"
                    value={content.hero.eyebrow}
                    onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
                    placeholder="Ej: Estudio de Ingeniería & Arquitectura"
                  />
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Titular Principal (Headline Editorial)"
                    value={content.hero.headline}
                    onChange={(e) => handleHeroChange('headline', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Párrafo Explicativo (Lead Description)"
                    value={content.hero.description}
                    onChange={(e) => handleHeroChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Input
                    label="Texto Botón Principal"
                    value={content.hero.primaryCtaText}
                    onChange={(e) => handleHeroChange('primaryCtaText', e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Enlace Botón Principal"
                    value={content.hero.primaryCtaLink}
                    onChange={(e) => handleHeroChange('primaryCtaLink', e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Texto Botón Secundario"
                    value={content.hero.secondaryCtaText}
                    onChange={(e) => handleHeroChange('secondaryCtaText', e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Enlace Botón Secundario"
                    value={content.hero.secondaryCtaLink}
                    onChange={(e) => handleHeroChange('secondaryCtaLink', e.target.value)}
                  />
                </div>
              </div>

              {/* Badges de Confianza Técnica */}
              <div className="space-y-3 pt-4 border-t border-[#F0EFEA]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#141413]">
                      Badges de Confianza Técnica (Strip de Atributos)
                    </h4>
                    <p className="text-[11px] text-[#5C5B56]">
                      Puntos técnicos verificables mostrados bajo los botones del Hero.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleAddBadge} className="gap-1 text-xs">
                    <Plus className="w-3 h-3" />
                    <span>Añadir Badge</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {content.hero.badges.map((badge, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <Input
                        value={badge}
                        onChange={(e) => {
                          const copy = [...content.hero!.badges];
                          copy[bIdx] = e.target.value;
                          handleHeroChange('badges', copy);
                        }}
                        className="text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBadge(bIdx)}
                        className="p-2 text-stone-400 hover:text-red-700 transition-colors"
                        title="Eliminar badge"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Editor de Historia (Sobre nosotros) */}
          {content.aboutStory && (
            <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                <div>
                  <h3 className="text-base font-bold text-[#141413]">
                    Narrativa & Filosofía del Estudio
                  </h3>
                  <p className="text-xs text-[#5C5B56]">
                    Texto institucional de la página Sobre nosotros.
                  </p>
                </div>
                <Badge variant="neutral">Sección Historia</Badge>
              </div>

              <Input
                label="Eyebrow"
                value={content.aboutStory.eyebrow}
                onChange={(e) => handleStoryChange('eyebrow', e.target.value)}
              />

              <Input
                label="Título Principal"
                value={content.aboutStory.title}
                onChange={(e) => handleStoryChange('title', e.target.value)}
              />

              <Textarea
                label="Párrafo Destacado (Lead)"
                value={content.aboutStory.leadParagraph}
                onChange={(e) => handleStoryChange('leadParagraph', e.target.value)}
                rows={3}
              />

              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#141413] block">
                  Párrafos del Cuerpo:
                </span>
                {content.aboutStory.bodyParagraphs.map((para, pIdx) => (
                  <Textarea
                    key={pIdx}
                    label={`Párrafo ${pIdx + 1}`}
                    value={para}
                    onChange={(e) => {
                      const updated = [...content.aboutStory!.bodyParagraphs];
                      updated[pIdx] = e.target.value;
                      handleStoryChange('bodyParagraphs', updated);
                    }}
                    rows={3}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Editor de Metodología / Pasos */}
          {content.processSteps && (
            <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                <div>
                  <h3 className="text-base font-bold text-[#141413]">
                    Pasos de la Metodología de Trabajo
                  </h3>
                  <p className="text-xs text-[#5C5B56]">
                    Fases explicadas en el bloque de proceso.
                  </p>
                </div>
                <Badge variant="neutral">Metodología</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.processSteps.map((step, sIdx) => (
                  <div key={step.step} className="p-4 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#7C3AED]">
                        Paso {step.step}
                      </span>
                    </div>
                    <Input
                      label="Título del paso"
                      value={step.title}
                      onChange={(e) => handleProcessStepChange(sIdx, 'title', e.target.value)}
                    />
                    <Textarea
                      label="Descripción"
                      value={step.description}
                      onChange={(e) => handleProcessStepChange(sIdx, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editor de Llamada a la Acción Final (CTA) */}
          {content.ctaHeadline !== undefined && (
            <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                <div>
                  <h3 className="text-base font-bold text-[#141413]">
                    Llamada a la Acción Final (Bloque de Cierre)
                  </h3>
                  <p className="text-xs text-[#5C5B56]">
                    Sección inferior que invita al contacto.
                  </p>
                </div>
                <Badge variant="neutral">Bloque CTA</Badge>
              </div>

              <Input
                label="Titular del CTA"
                value={content.ctaHeadline || ''}
                onChange={(e) => setContent({ ...content, ctaHeadline: e.target.value })}
              />

              <Textarea
                label="Texto de apoyo"
                value={content.ctaDescription || ''}
                onChange={(e) => setContent({ ...content, ctaDescription: e.target.value })}
                rows={2}
              />

              <Input
                label="Texto del botón"
                value={content.ctaButtonText || ''}
                onChange={(e) => setContent({ ...content, ctaButtonText: e.target.value })}
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SEO & Metadatos */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#141413] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#7C3AED]" />
                <span>Configuración de SEO & Motores de Búsqueda</span>
              </h2>
              <p className="text-xs text-[#5C5B56] mt-0.5">
                Define las etiquetas meta canónicas para asegurar un posicionamiento técnico óptimo.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#141413]">Meta Title (Título en Google)</span>
                  <span className={`font-mono text-[11px] ${
                    content.seo.metaTitle.length > 65 ? 'text-amber-600 font-bold' : 'text-[#8A8881]'
                  }`}>
                    {content.seo.metaTitle.length} / 60 caracteres recomendados
                  </span>
                </div>
                <Input
                  value={content.seo.metaTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, metaTitle: e.target.value },
                    })
                  }
                  placeholder="Título para motores de búsqueda"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#141413]">Meta Description (Descripción en Google)</span>
                  <span className={`font-mono text-[11px] ${
                    content.seo.metaDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-[#8A8881]'
                  }`}>
                    {content.seo.metaDescription.length} / 155 caracteres recomendados
                  </span>
                </div>
                <Textarea
                  value={content.seo.metaDescription}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, metaDescription: e.target.value },
                    })
                  }
                  rows={3}
                  placeholder="Descripción concisa para buscadores y redes sociales"
                />
              </div>

              <Input
                label="URL Canónica (Canonical URL)"
                value={content.seo.canonicalUrl || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    seo: { ...content.seo, canonicalUrl: e.target.value },
                  })
                }
                placeholder="https://lyberate.com/..."
              />

              <div className="pt-2">
                <Checkbox
                  id="robotsIndex"
                  label="Permitir indexación por motores de búsqueda (robots: index, follow)"
                  checked={content.seo.robotsIndex}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, robotsIndex: e.target.checked },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Live Google Search Snippet Preview */}
          <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-3">
            <span className="text-xs font-bold text-[#8A8881] uppercase tracking-wider block">
              Vista Previa en Resultados de Búsqueda de Google (Snippet Simulator)
            </span>

            <div className="p-4 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] max-w-2xl space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-xs text-[#202124]">
                <div className="w-4 h-4 rounded-full bg-[#7C3AED] flex items-center justify-center text-[9px] text-white font-bold">
                  L
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium leading-none">Lyberate</span>
                  <span className="text-[11px] text-[#5f6368] font-mono leading-none mt-0.5">
                    {content.seo.canonicalUrl || 'https://lyberate.com'}
                  </span>
                </div>
              </div>

              <h3 className="text-lg text-[#1a0dab] hover:underline font-normal cursor-pointer leading-snug">
                {content.seo.metaTitle || 'Sin título definido'}
              </h3>

              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {content.seo.metaDescription || 'Sin descripción definida para motores de búsqueda.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Simulador de Vista Previa */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E3DC]">
            <span className="text-xs font-bold text-[#141413]">
              Simulador de Dispositivo en Tiempo Real
            </span>

            <div className="flex items-center gap-1 bg-[#F5F4EF] p-1 rounded-lg border border-[#E5E3DC]">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-white shadow-xs text-[#141413]' : 'text-[#5C5B56]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Escritorio</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  previewDevice === 'tablet' ? 'bg-white shadow-xs text-[#141413]' : 'text-[#5C5B56]'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-white shadow-xs text-[#141413]' : 'text-[#5C5B56]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Móvil</span>
              </button>
            </div>
          </div>

          {/* Frame Container */}
          <div className="bg-[#EFECE6] p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto min-h-[500px]">
            <div
              className={`bg-white rounded-xl shadow-2xl border border-[#D1CEBF] overflow-hidden transition-all duration-300 ${
                previewDevice === 'desktop'
                  ? 'w-full max-w-4xl'
                  : previewDevice === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[375px]'
              }`}
            >
              {/* Fake Browser Bar */}
              <div className="bg-[#F5F4EF] px-4 py-2.5 border-b border-[#E5E3DC] flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 text-center font-mono text-[10px] text-[#8A8881] bg-white py-0.5 rounded border border-[#E5E3DC] truncate px-2">
                  lyberate.com{validPageId === 'home' ? '' : `/${validPageId}`}
                </div>
              </div>

              {/* Contenido renderizado del borrador activo */}
              <div className="p-6 sm:p-10 space-y-8">
                {content.hero && (
                  <div className="space-y-4 text-center max-w-2xl mx-auto py-6">
                    <span className="text-[11px] font-bold text-[#7C3AED] tracking-wider uppercase">
                      {content.hero.eyebrow}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#141413] font-editorial-heading leading-tight">
                      {content.hero.headline}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5C5B56] leading-relaxed">
                      {content.hero.description}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                      <Button size="sm" variant="primary">
                        {content.hero.primaryCtaText}
                      </Button>
                      <Button size="sm" variant="outline">
                        {content.hero.secondaryCtaText}
                      </Button>
                    </div>
                    <div className="pt-4 border-t border-[#F0EFEA] flex flex-wrap justify-center gap-4 text-[10px] text-[#5C5B56]">
                      {content.hero.badges.map((b, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {content.aboutStory && (
                  <div className="space-y-4 max-w-xl mx-auto py-4">
                    <span className="text-[11px] font-bold text-[#7C3AED] uppercase">
                      {content.aboutStory.eyebrow}
                    </span>
                    <h3 className="text-xl font-bold text-[#141413] font-editorial-heading">
                      {content.aboutStory.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#141413]">
                      {content.aboutStory.leadParagraph}
                    </p>
                    {content.aboutStory.bodyParagraphs.map((p, i) => (
                      <p key={i} className="text-xs text-[#5C5B56] leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                {content.ctaHeadline && (
                  <div className="text-center py-6 bg-[#FBFBF9] rounded-xl p-6 border border-[#E5E3DC]">
                    <h4 className="text-lg font-bold text-[#141413] font-editorial-heading">
                      {content.ctaHeadline}
                    </h4>
                    <p className="text-xs text-[#5C5B56] mt-1 mb-3">
                      {content.ctaDescription}
                    </p>
                    <Button size="sm" variant="primary">
                      {content.ctaButtonText || 'Contacto'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Historial de Versiones & Rollback */}
      {activeTab === 'versions' && (
        <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
            <div>
              <h2 className="text-base font-bold text-[#141413] flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <span>Snapshots Históricos Inmutables</span>
              </h2>
              <p className="text-xs text-[#5C5B56] mt-0.5">
                Cada publicación genera una instantánea inalterable. Puedes restaurar cualquier versión histórica al instante.
              </p>
            </div>
            <span className="text-xs font-bold text-[#141413]">
              {versions.length} versiones registradas
            </span>
          </div>

          <div className="space-y-3">
            {versions.map((ver) => {
              const isCurrent = ver.versionId === content.currentVersionId;

              return (
                <div
                  key={ver.versionId}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-[#FBFBF9] border-[#E5E3DC] hover:border-[#D1CEBF]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#141413]">
                          {ver.versionName}
                        </span>
                        <Badge variant={isCurrent ? 'success' : 'neutral'}>
                          {ver.versionId} {isCurrent && '(Activa en vivo)'}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#5C5B56] mt-1 font-editorial-body">
                        {ver.changeLog}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#8A8881] mt-2 font-mono">
                        <span>Autor: {ver.author}</span>
                        <span>•</span>
                        <span>{new Date(ver.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {!isCurrent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRollbackTarget(ver)}
                        className="gap-1.5 text-xs border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Revertir a esta versión</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Publicar Versión */}
      <Dialog
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="Publicar Nueva Versión en Producción"
        description="Esta acción generará un nuevo snapshot inmutable y actualizará el contenido visible públicamente."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setPublishModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublish}
              className="bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirmar y Publicar</span>
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#F5F4EF] rounded-lg border border-[#E5E3DC] text-xs text-[#5C5B56]">
            <strong>Página:</strong> {content.pageName} ({validPageId})
          </div>

          <Textarea
            label="Registro de cambios (Changelog)"
            value={changelogNote}
            onChange={(e) => setChangelogNote(e.target.value)}
            placeholder="Describe qué cambios se hicieron en esta publicación (ej: actualización de propuesta de valor, nuevos badges técnicos)..."
            rows={3}
            required
          />
        </div>
      </Dialog>

      {/* Modal de Confirmación de Rollback */}
      <Dialog
        isOpen={rollbackTarget !== null}
        onClose={() => setRollbackTarget(null)}
        title="Confirmar Restauración de Versión (Rollback)"
        description={`¿Estás seguro de restaurar el estado de la página a la versión ${rollbackTarget?.versionId}?`}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setRollbackTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => rollbackTarget && handleRollback(rollbackTarget)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revertir Ahora</span>
            </Button>
          </div>
        }
      >
        {rollbackTarget && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
              <strong>Atención:</strong> El contenido activo de la página se reemplazará por el snapshot guardado el {new Date(rollbackTarget.createdAt).toLocaleString()}.
            </div>
            <div className="text-[#5C5B56]">
              <strong>Motivo original de la versión:</strong> {rollbackTarget.changeLog}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
