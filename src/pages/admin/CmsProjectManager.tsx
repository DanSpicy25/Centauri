import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  Upload,
  FileSpreadsheet,
  Info,
} from 'lucide-react';
import { projectRepository } from '../../repositories/projectRepository';
import { SAMPLE_BATCH_40_PROJECTS } from '../../data/sampleBatchProjects';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { Dialog } from '../../components/ui/Dialog';
import { ProjectDTO, ProjectRelationship, EditorialState } from '../../types';

export const CmsProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDTO[]>(() =>
    projectRepository.getAllProjectsForAdmin()
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<string>('todos');
  const [editingProject, setEditingProject] = useState<ProjectDTO | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados del Importador Masivo (~40 proyectos)
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [importRawInput, setImportRawInput] = useState('');
  const [importStep, setImportStep] = useState<'input' | 'preview' | 'result'>('input');
  const [parsedRows, setParsedRows] = useState<Array<{
    tempId: string;
    name: string;
    slug: string;
    category: string;
    tagline: string;
    summary: string;
    thumbnailUrl: string;
    thumbnailAlt: string;
    thumbnailCredit: string;
    publicUrl?: string;
    relationship: ProjectRelationship;
    verifiedTechnologies: string[];
    isDuplicate: boolean;
    missingFields: string[];
    imageFormat: string;
    imageSuggestions: string[];
    selected: boolean;
  }>>([]);
  const [importStats, setImportStats] = useState<{ imported: number; skipped: number; total: number } | null>(null);

  // Estados para añadir imágenes a la galería
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryAlt, setNewGalleryAlt] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  const handleAddGalleryImage = () => {
    if (!editingProject || !newGalleryUrl.trim()) return;
    const currentGallery = editingProject.gallery || [];
    const updatedGallery = [
      ...currentGallery,
      {
        url: newGalleryUrl.trim(),
        alt: newGalleryAlt.trim() || `Captura de ${editingProject.name}`,
        caption: newGalleryCaption.trim() || undefined,
      },
    ];
    setEditingProject({
      ...editingProject,
      gallery: updatedGallery,
    });
    setNewGalleryUrl('');
    setNewGalleryAlt('');
    setNewGalleryCaption('');
    showFeedback('success', 'Imagen añadida a la galería del proyecto.');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!editingProject) return;
    const currentGallery = editingProject.gallery || [];
    const updatedGallery = currentGallery.filter((_, idx) => idx !== indexToRemove);
    setEditingProject({
      ...editingProject,
      gallery: updatedGallery,
    });
  };

  const refreshList = () => {
    setProjects(projectRepository.getAllProjectsForAdmin());
  };

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // --- MANEJADORES DEL IMPORTADOR MASIVO ---
  const parseRowsFromData = (data: any[]) => {
    const rows = data.map((item, idx) => {
      const name = String(item.name || '').trim();
      const slug = String(item.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `proyecto-${idx + 1}`);
      const category = String(item.category || 'Aplicaciones Web').trim();
      const tagline = String(item.tagline || '').trim();
      const summary = String(item.summary || '').trim();
      const thumbnailUrl = String(item.thumbnailUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80').trim();
      const thumbnailAlt = String(item.thumbnailAlt || '').trim();
      const thumbnailCredit = String(item.thumbnailCredit || '').trim();
      const publicUrl = item.publicUrl ? String(item.publicUrl).trim() : undefined;
      const relationship = (item.relationship === 'own' || item.relationship === 'client' || item.relationship === 'partner' ? item.relationship : 'client') as ProjectRelationship;
      const verifiedTechnologies = Array.isArray(item.verifiedTechnologies) ? item.verifiedTechnologies : ['React 19', 'TypeScript'];

      // Detección de duplicados
      const isDuplicate = projects.some(p => p.slug === slug || p.name.toLowerCase() === name.toLowerCase());
      
      // Detección de campos faltantes
      const missingFields: string[] = [];
      if (!name) missingFields.push('Nombre');
      if (!category) missingFields.push('Categoría');
      if (!summary) missingFields.push('Resumen');

      // Análisis de imagen y sugerencias SEO
      let imageFormat = 'URL Externa';
      if (thumbnailUrl.includes('.webp')) imageFormat = 'WebP';
      else if (thumbnailUrl.includes('.png')) imageFormat = 'PNG';
      else if (thumbnailUrl.includes('.jpg') || thumbnailUrl.includes('.jpeg')) imageFormat = 'JPEG';
      else if (thumbnailUrl.includes('unsplash.com')) imageFormat = 'CDN WebP';

      const imageSuggestions: string[] = [];
      if (!thumbnailUrl.includes('.webp') && !thumbnailUrl.includes('auto=format')) {
        imageSuggestions.push('Sugerencia: Convertir a WebP (1200x630px para vista previa en redes).');
      }
      if (!thumbnailAlt) {
        imageSuggestions.push(`Alt text sugerido: "Captura de pantalla de ${name}"`);
      }
      if (!thumbnailCredit) {
        imageSuggestions.push('Atribución pendiente: Registrar crédito antes de publicar.');
      }

      return {
        tempId: `row-${idx}-${Date.now()}`,
        name,
        slug,
        category,
        tagline,
        summary,
        thumbnailUrl,
        thumbnailAlt,
        thumbnailCredit,
        publicUrl,
        relationship,
        verifiedTechnologies,
        isDuplicate,
        missingFields,
        imageFormat,
        imageSuggestions,
        selected: !isDuplicate && missingFields.length === 0,
      };
    });

    setParsedRows(rows);
    setImportStep('preview');
  };

  const handleLoadSampleBatch = () => {
    setImportRawInput(JSON.stringify(SAMPLE_BATCH_40_PROJECTS, null, 2));
    setImportFormat('json');
    parseRowsFromData(SAMPLE_BATCH_40_PROJECTS);
  };

  const handleParseCustomInput = () => {
    try {
      if (importFormat === 'json') {
        const parsed = JSON.parse(importRawInput);
        if (!Array.isArray(parsed)) throw new Error('El JSON debe ser un arreglo de proyectos.');
        parseRowsFromData(parsed);
      } else {
        const lines = importRawInput.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error('El CSV debe incluir cabeceras y al menos una fila.');
        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h] = values[i] || '';
          });
          return obj;
        });
        parseRowsFromData(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar el archivo.';
      showFeedback('error', msg);
    }
  };

  const handleToggleRow = (tempId: string) => {
    setParsedRows(prev => prev.map(r => r.tempId === tempId ? { ...r, selected: !r.selected } : r));
  };

  const handleSelectAll = (select: boolean) => {
    setParsedRows(prev => prev.map(r => ({ ...r, selected: select })));
  };

  const handleExecuteImport = () => {
    const toImport = parsedRows.filter(r => r.selected);
    if (toImport.length === 0) {
      showFeedback('error', 'Selecciona al menos un proyecto para importar.');
      return;
    }

    let count = 0;
    toImport.forEach(item => {
      projectRepository.createProjectDraft({
        name: item.name,
        slug: item.slug,
        category: item.category,
        tagline: item.tagline,
        summary: item.summary,
        thumbnailUrl: item.thumbnailUrl,
        thumbnailAlt: item.thumbnailAlt || `Captura de pantalla de ${item.name}`,
        thumbnailCredit: item.thumbnailCredit || 'Captura autorizada',
        publicUrl: item.publicUrl,
        relationship: item.relationship,
        verifiedTechnologies: item.verifiedTechnologies,
        editorialState: 'draft',
        published: false,
        attributionApproved: false,
      });
      count++;
    });

    refreshList();
    setImportStats({
      imported: count,
      skipped: parsedRows.length - count,
      total: parsedRows.length,
    });
    setImportStep('result');
    showFeedback('success', `Se han importado ${count} proyectos como borradores listos para revisión.`);
  };

  const handleCloseImportModal = () => {
    setImportModalOpen(false);
    setImportStep('input');
    setParsedRows([]);
    setImportStats(null);
  };

  // Crear nuevo borrador
  const handleCreateDraft = () => {
    const draft = projectRepository.createProjectDraft({
      name: 'Nuevo Proyecto del Portafolio',
      tagline: 'Solución de software desarrollada con arquitectura limpia',
      summary: 'Descripción detallada del sistema, objetivos comerciales y aportes técnicos.',
      category: 'Plataforma Web',
      relationship: 'own',
      lyberateContribution: 'Arquitectura completa y desarrollo frontend/backend',
      verifiedTechnologies: ['React 19', 'TypeScript', 'Tailwind CSS'],
    });
    refreshList();
    setEditingProject(draft);
    setIsNewProject(true);
    showFeedback('success', 'Borrador creado. Configura los detalles y guarda los cambios.');
  };

  // Guardar proyecto editado
  const handleSaveProject = () => {
    if (!editingProject) return;

    try {
      projectRepository.updateProject(editingProject.id, editingProject);
      refreshList();
      setEditingProject(null);
      setIsNewProject(false);
      showFeedback('success', `Proyecto "${editingProject.name}" guardado exitosamente.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el proyecto.';
      showFeedback('error', msg);
    }
  };

  // Eliminar proyecto
  const handleDelete = (id: string) => {
    projectRepository.deleteProject(id);
    refreshList();
    setDeleteConfirmId(null);
    showFeedback('success', 'Proyecto eliminado del catálogo.');
  };

  // Filtrado de proyectos
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState =
      filterState === 'todos' ||
      (filterState === 'published' && p.editorialState === 'published') ||
      (filterState === 'draft' && p.editorialState === 'draft');

    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/admin/cms"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8A8881] hover:text-[#141413]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a CMS</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Gestión del Portafolio & Casos de Estudio
          </h1>
          <p className="text-sm text-[#5C5B56] mt-1 max-w-2xl font-editorial-body">
            Administra el catálogo de trabajos para el portafolio de los socios fundadores. Solo se publican sistemas con atribución verificada.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportModalOpen(true)}
            className="gap-2 border-[#E5E3DC] hover:border-[#7C3AED] hover:text-[#7C3AED]"
          >
            <Upload className="w-4 h-4 text-[#7C3AED]" />
            <span>Importar Lote (~40 Proyectos)</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleCreateDraft} className="gap-2 bg-[#7C3AED] hover:bg-[#6D28D9]">
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Proyecto</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-semibold hover:underline">
            Descartar
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A8881]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, tecnología o resumen..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            label=""
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            options={[
              { value: 'todos', label: 'Todos los estados' },
              { value: 'published', label: 'Solo Publicados' },
              { value: 'draft', label: 'Solo Borradores' },
            ]}
          />
        </div>
      </div>

      {/* Project Table / Directory */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBF9] text-[#5C5B56] border-b border-[#E5E3DC] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Proyecto & Rol</th>
                <th className="px-6 py-3.5">Categoría</th>
                <th className="px-6 py-3.5">Estado Editorial</th>
                <th className="px-6 py-3.5">Vitrina Inicio</th>
                <th className="px-6 py-3.5">Atribución Aprobada</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEA]">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[#FDFDFD] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#141413] text-sm">{p.name}</div>
                    <div className="text-[11px] font-mono text-[#8A8881] mt-0.5">/{p.slug}</div>
                    <div className="text-[11px] text-[#5C5B56] line-clamp-1 mt-1 max-w-xs">
                      {p.tagline}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#141413]">{p.category}</span>
                    <span className="text-[10px] text-[#8A8881] block uppercase">
                      {p.relationship}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={p.editorialState === 'published' ? 'success' : 'neutral'}>
                      {p.editorialState === 'published' ? 'PUBLICADO' : 'BORRADOR'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {p.isFeaturedInHomeCarousel ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>En Carrusel</span>
                      </span>
                    ) : (
                      <span className="text-[#8A8881]">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {p.attributionApproved ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verificada</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Pendiente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProject({ ...p });
                          setIsNewProject(false);
                        }}
                        className="gap-1 text-xs"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Editar</span>
                      </Button>

                      {p.editorialState === 'published' && (
                        <Link
                          to={`/trabajos/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-[#8A8881] hover:text-[#141413] rounded-lg transition-colors"
                          title="Ver en vivo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-1.5 text-[#8A8881] hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar proyecto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal / Dialog */}
      {editingProject && (
        <Dialog
          isOpen={true}
          onClose={() => setEditingProject(null)}
          title={isNewProject ? 'Nuevo Proyecto en el Portafolio' : `Editar: ${editingProject.name}`}
          description="Asegura la precisión del alcance y la estricta honestidad de las contribuciones de Lyberate."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setEditingProject(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveProject} className="gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </Button>
            </div>
          }
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Nombre del Proyecto"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Input
                  label="Slug URL canónico"
                  value={editingProject.slug}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                  required
                />
              </div>

              <div>
                <Input
                  label="Categoría"
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, category: e.target.value })
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Tagline / Frase síntesis"
                  value={editingProject.tagline}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, tagline: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Resumen del Sistema"
                  value={editingProject.summary}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Select
                  label="Relación con Lyberate"
                  value={editingProject.relationship}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      relationship: e.target.value as ProjectRelationship,
                    })
                  }
                  options={[
                    { value: 'own', label: 'Producto Propio' },
                    { value: 'client', label: 'Proyecto para Cliente' },
                    { value: 'collaboration', label: 'Colaboración Técnica' },
                    { value: 'managed', label: 'Sitio Gestionado' },
                  ]}
                />
              </div>

              <div>
                <Input
                  label="URL Pública (Web en vivo)"
                  value={editingProject.publicUrl || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, publicUrl: e.target.value })
                  }
                  placeholder="https://ejemplo.com"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="URL Miniatura Principal (Portada del Proyecto)"
                  value={editingProject.thumbnailUrl}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })
                  }
                />
              </div>

              {/* Sección de Galería de Imágenes (1 o más capturas) */}
              <div className="md:col-span-2 p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#141413] block">
                      Galería de Capturas del Proyecto ({editingProject.gallery?.length || 0} fotos)
                    </span>
                    <p className="text-[11px] text-[#5C5B56]">
                      Agrega una o más capturas reales de pantallas, módulos o interfaces para el portafolio.
                    </p>
                  </div>
                </div>

                {/* Lista de imágenes actuales */}
                {editingProject.gallery && editingProject.gallery.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {editingProject.gallery.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#E5E3DC] justify-between"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.alt}
                            className="w-12 h-10 object-cover rounded-md border border-[#E5E3DC] shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-xs font-semibold text-[#141413] block truncate">
                              {item.caption || item.alt || `Foto #${idx + 1}`}
                            </span>
                            <span className="text-[10px] text-[#8A8881] block truncate font-mono">
                              {item.url}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                          title="Eliminar de la galería"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulario para añadir nueva imagen */}
                <div className="pt-3 border-t border-[#F0EFEA] space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8881] block">
                    + Añadir nueva captura o foto
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      placeholder="URL de la imagen (https://...)"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      placeholder="Descripción corta (ej. Punto de Venta)"
                      value={newGalleryAlt}
                      onChange={(e) => setNewGalleryAlt(e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      placeholder="Pie de foto explicativo"
                      value={newGalleryCaption}
                      onChange={(e) => setNewGalleryCaption(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddGalleryImage}
                      disabled={!newGalleryUrl.trim()}
                      className="gap-1.5 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir a la galería</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Aporte Específico de Lyberate (Obligatorio)"
                  value={editingProject.lyberateContribution}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      lyberateContribution: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Alcance Total del Sistema (Contexto general)"
                  value={editingProject.fullScope || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, fullScope: e.target.value })
                  }
                  rows={2}
                />
              </div>
            </div>

            {/* Vitrina & Publicación */}
            <div className="p-4 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] space-y-3">
              <span className="text-xs font-bold text-[#141413] block">
                Aprobación Editorial & Vitrina
              </span>

              <Checkbox
                id="isFeatured"
                label="Destacar en el carrusel de la página de Inicio"
                checked={editingProject.isFeaturedInHomeCarousel}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, isFeaturedInHomeCarousel: e.target.checked })
                }
              />

              <Checkbox
                id="attributionApproved"
                label="Atribución verificada y aprobada por los socios fundadores"
                checked={editingProject.attributionApproved}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setEditingProject({
                    ...editingProject,
                    attributionApproved: checked,
                    // Si se desmarca, no puede estar publicado
                    editorialState: !checked ? 'draft' : editingProject.editorialState,
                    published: !checked ? false : editingProject.published,
                  });
                }}
              />

              <div className="pt-2">
                <Select
                  label="Estado Editorial"
                  value={editingProject.editorialState}
                  disabled={!editingProject.attributionApproved}
                  onChange={(e) => {
                    const state = e.target.value as EditorialState;
                    setEditingProject({
                      ...editingProject,
                      editorialState: state,
                      published: state === 'published',
                    });
                  }}
                  options={[
                    { value: 'draft', label: 'Borrador (Privado)' },
                    { value: 'in_review', label: 'En Revisión Interna' },
                    { value: 'published', label: 'Publicado (Visible en la web)' },
                  ]}
                />
                {!editingProject.attributionApproved && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    * Debes marcar "Atribución verificada" antes de poder publicar este proyecto.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmar Eliminación del Proyecto"
        description="Esta acción eliminará el proyecto del catálogo. No se podrá recuperar a menos que restablezcas los valores iniciales."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Confirmar Eliminación
            </Button>
          </div>
        }
      >
        <p className="text-xs text-[#5C5B56]">
          El proyecto será removido del repositorio de inmediato.
        </p>
      </Dialog>

      {/* Modal / Dialog de Importación Masiva (~40 proyectos) */}
      {importModalOpen && (
        <Dialog
          isOpen={true}
          onClose={handleCloseImportModal}
          title="Importador Masivo de Proyectos & Páginas (~40 Proyectos)"
          description="Incorpora catálogos estructurados en JSON o CSV. Todos los registros ingresan como borradores no publicados para revisión de los socios."
          footer={
            <div className="flex justify-end gap-3">
              {importStep === 'preview' && (
                <Button variant="outline" size="sm" onClick={() => setImportStep('input')}>
                  Volver a Origen
                </Button>
              )}
              {importStep === 'input' && (
                <Button variant="outline" size="sm" onClick={handleCloseImportModal}>
                  Cancelar
                </Button>
              )}
              {importStep === 'input' && importRawInput.trim() && (
                <Button variant="primary" size="sm" onClick={handleParseCustomInput} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                  Analizar & Auditar
                </Button>
              )}
              {importStep === 'preview' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExecuteImport}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                  disabled={parsedRows.filter((r) => r.selected).length === 0}
                >
                  Importar {parsedRows.filter((r) => r.selected).length} Proyectos como Borradores
                </Button>
              )}
              {importStep === 'result' && (
                <Button variant="primary" size="sm" onClick={handleCloseImportModal} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                  Finalizar
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* PASO 1: ENTRADA DE DATOS */}
            {importStep === 'input' && (
              <div className="space-y-6">
                {/* Banner de carga rápida con 40 proyectos */}
                <div className="bg-gradient-to-r from-[#FAF5FF] to-white p-5 rounded-2xl border border-[#E9D5FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                        Muestra Lista para Demostración
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#141413]">
                      Lote oficial de 40 proyectos diversificados
                    </h4>
                    <p className="text-xs text-[#5C5B56] max-w-xl">
                      Carga instantáneamente un conjunto de 40 sistemas reales (salud, logística, gastronomía, finanzas, ferretería, etc.) con imágenes, etiquetas SEO y autorizaciones simuladas.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleLoadSampleBatch}
                    className="shrink-0 bg-[#7C3AED] hover:bg-[#6D28D9] gap-1.5 text-xs py-2 px-4 shadow-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Cargar los 40 Proyectos</span>
                  </Button>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-[#E5E3DC] w-full" />
                  <span className="bg-white px-3 text-[11px] font-semibold text-[#8A8881] uppercase tracking-wider absolute">
                    O pega tus datos manualmente
                  </span>
                </div>

                {/* Formato y Textarea */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141413]">
                      Formato de Datos:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImportFormat('json')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          importFormat === 'json'
                            ? 'bg-[#141413] text-white border-[#141413]'
                            : 'bg-white text-[#5C5B56] border-[#E5E3DC] hover:text-[#141413]'
                        }`}
                      >
                        JSON Estructurado
                      </button>
                      <button
                        type="button"
                        onClick={() => setImportFormat('csv')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          importFormat === 'csv'
                            ? 'bg-[#141413] text-white border-[#141413]'
                            : 'bg-white text-[#5C5B56] border-[#E5E3DC] hover:text-[#141413]'
                        }`}
                      >
                        CSV Tabular
                      </button>
                    </div>
                  </div>

                  <Textarea
                    value={importRawInput}
                    onChange={(e) => setImportRawInput(e.target.value)}
                    placeholder={
                      importFormat === 'json'
                        ? '[\n  {\n    "name": "Portal Médico Clínico",\n    "category": "Salud",\n    "tagline": "Citas online",\n    "summary": "Plataforma de pacientes",\n    "thumbnailUrl": "https://..."\n  }\n]'
                        : 'name,slug,category,tagline,summary,thumbnailUrl\nPortal Médico Clínico,portal-medico,Salud,Citas online,Plataforma de pacientes,https://...'
                    }
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <p className="text-[11px] text-[#8A8881]">
                    Los campos obligatorios son <strong>name</strong>, <strong>category</strong> y <strong>summary</strong>. El resto se completará con valores predeterminados seguros.
                  </p>
                </div>
              </div>
            )}

            {/* PASO 2: PREVISUALIZACIÓN Y AUDITORÍA FILA A FILA */}
            {importStep === 'preview' && (
              <div className="space-y-5">
                {/* Resumen de Detección */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#FBFBF9] p-3 rounded-xl border border-[#E5E3DC]">
                    <span className="text-[10px] font-bold text-[#8A8881] uppercase block">Filas Detectadas</span>
                    <span className="text-xl font-black text-[#141413]">{parsedRows.length}</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Seleccionadas</span>
                    <span className="text-xl font-black text-emerald-900">
                      {parsedRows.filter((r) => r.selected).length}
                    </span>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Posibles Duplicados</span>
                    <span className="text-xl font-black text-amber-900">
                      {parsedRows.filter((r) => r.isDuplicate).length}
                    </span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">Sugerencias SEO/Img</span>
                    <span className="text-xl font-black text-blue-900">
                      {parsedRows.filter((r) => r.imageSuggestions.length > 0).length}
                    </span>
                  </div>
                </div>

                {/* Aviso Editorial */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Garantía de Aislamiento: </strong>
                    Los proyectos se importarán estrictamente como <strong>BORRADORES NO PUBLICADOS</strong>. La web pública de Lyberate no se alterará hasta que los socios fundadores completen la auditoría de alcance y marquen la atribución como verificada.
                  </div>
                </div>

                {/* Acciones de selección global */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSelectAll(true)} className="text-[11px] py-1 px-2.5">
                      Seleccionar Todos ({parsedRows.length})
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSelectAll(false)} className="text-[11px] py-1 px-2.5">
                      Deseleccionar Todos
                    </Button>
                  </div>
                  <span className="text-[#8A8881]">
                    {parsedRows.filter((r) => r.selected).length} de {parsedRows.length} marcados para importar
                  </span>
                </div>

                {/* Tabla de Filas */}
                <div className="border border-[#E5E3DC] rounded-xl overflow-hidden">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#FBFBF9] sticky top-0 border-b border-[#E5E3DC] text-[#5C5B56] font-semibold">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">✓</th>
                          <th className="py-2.5 px-3">Proyecto & Slug</th>
                          <th className="py-2.5 px-3">Categoría</th>
                          <th className="py-2.5 px-3">Imagen & Formato</th>
                          <th className="py-2.5 px-3">Diagnóstico / SEO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EFEA]">
                        {parsedRows.map((row) => (
                          <tr
                            key={row.tempId}
                            className={`hover:bg-[#FDFDFD] transition-colors ${
                              !row.selected ? 'opacity-50 bg-[#FAF9F5]' : ''
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={() => handleToggleRow(row.tempId)}
                                className="rounded border-[#D1CEBF] text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-[#141413]">{row.name}</div>
                              <div className="font-mono text-[10px] text-[#8A8881]">/{row.slug}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <Badge variant="neutral" size="sm">
                                {row.category}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <img
                                  src={row.thumbnailUrl}
                                  alt={row.thumbnailAlt || row.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-[#E5E3DC] shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=200&q=80';
                                  }}
                                />
                                <div>
                                  <span className="text-[10px] font-mono font-semibold text-[#5C5B56] block">
                                    {row.imageFormat}
                                  </span>
                                  <span className="text-[9px] text-[#8A8881]">
                                    {row.thumbnailAlt ? 'Alt text OK' : 'Sin Alt text'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 max-w-xs">
                              {row.isDuplicate && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Slug ya existe en catálogo
                                </span>
                              )}
                              {row.missingFields.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mb-1">
                                  Faltan: {row.missingFields.join(', ')}
                                </span>
                              )}
                              {row.imageSuggestions.length > 0 && (
                                <div className="text-[10px] text-[#5C5B56] line-clamp-1" title={row.imageSuggestions.join(' | ')}>
                                  💡 {row.imageSuggestions[0]}
                                </div>
                              )}
                              {!row.isDuplicate && row.missingFields.length === 0 && (
                                <span className="text-[10px] text-emerald-700 font-medium">
                                  ✓ Listo para borrador
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: REPORTE DE RESULTADO */}
            {importStep === 'result' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#141413]">
                  ¡Lote importado exitosamente!
                </h4>
                <p className="text-xs text-[#5C5B56] max-w-md mx-auto">
                  Se han agregado <strong>{importStats?.imported}</strong> proyectos en estado <strong>Borrador</strong>. Ninguno se mostrará públicamente hasta que los socios verifiquen el alcance y otorguen la aprobación de atribución.
                </p>

                <div className="flex justify-center gap-3 pt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                    onClick={() => {
                      setFilterState('draft');
                      handleCloseImportModal();
                    }}
                  >
                    Filtrar y Ver Borradores ({importStats?.imported})
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCloseImportModal}>
                    Cerrar Asistente
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
};
