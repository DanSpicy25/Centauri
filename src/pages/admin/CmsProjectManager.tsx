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
} from 'lucide-react';
import { projectRepository } from '../../repositories/projectRepository';
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

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={handleCreateDraft} className="gap-2">
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
    </div>
  );
};
