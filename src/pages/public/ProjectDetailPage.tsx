import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Copy,
  Check,
  ImageOff,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { projectRepository } from '../../repositories/projectRepository';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Breadcrumb } from '../../components/ui/Breadcrumb';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const project = slug ? projectRepository.getProjectBySlug(slug) : undefined;
  const { prev, next } = slug ? projectRepository.getAdjacentProjects(slug) : {};

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeroImgError(false);
  }, [slug]);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#141413] mb-4 font-editorial-heading">
          Caso de estudio no encontrado
        </h1>
        <p className="text-sm text-[#5C5B56] mb-6">
          El proyecto solicitado no existe en el catálogo publicado o se encuentra en estado de borrador no autorizado.
        </p>
        <Link to="/trabajos">
          <Button variant="primary">Volver al catálogo de trabajos</Button>
        </Link>
      </div>
    );
  }

  const relationshipLabels = {
    own: { label: 'Proyecto Propio', variant: 'brand' as const },
    client: { label: 'Cliente', variant: 'neutral' as const },
    collaboration: { label: 'Colaboración', variant: 'info' as const },
    managed: { label: 'Gestionado', variant: 'warning' as const },
    unknown: { label: 'Por Confirmar', variant: 'neutral' as const },
  };

  const rel = relationshipLabels[project.relationship] || relationshipLabels.unknown;

  const allImages = [
    {
      url: project.thumbnailUrl,
      alt: project.thumbnailAlt || `Vista principal del proyecto ${project.name}`,
      caption: 'Vista principal del sistema',
      credit: project.thumbnailCredit,
    },
    ...(project.gallery || []),
  ];

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allImages.length : null));
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allImages.length]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Trabajos', href: '/trabajos' },
            { label: project.name },
          ]}
        />

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5B56] hover:text-[#141413] py-1 px-2.5 rounded-lg border border-[#E5E3DC] bg-white transition-colors cursor-pointer self-start sm:self-auto focus-visible:outline-2"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Enlace copiado' : 'Compartir caso'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={rel.variant} size="md">
            {rel.label}
          </Badge>
          <Badge variant="neutral" size="md">
            {project.category}
          </Badge>
          <span className="text-xs text-[#8A8881]">
            Actualizado: {new Date(project.updatedAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
          {project.name}
        </h1>

        <p className="text-base sm:text-lg text-[#C85A32] font-medium leading-relaxed">
          {project.tagline}
        </p>

        <p className="text-sm sm:text-base text-[#5C5B56] leading-relaxed max-w-3xl">
          {project.summary}
        </p>

        {project.publicUrl && (
          <div className="pt-2">
            <a
              href={project.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141413] hover:text-[#C85A32] underline"
            >
              <span>Visitar portal oficial en producción</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Hero Showcase Image (con click para ampliar) */}
      <div
        onClick={() => setLightboxIndex(0)}
        className="rounded-3xl overflow-hidden border border-[#E5E3DC] bg-[#F5F4EF] aspect-16/9 shadow-sm relative group cursor-pointer"
        title="Haz clic para ver captura en pantalla completa"
      >
        {!heroImgError ? (
          <img
            src={project.thumbnailUrl}
            alt={project.thumbnailAlt || `Vista principal del proyecto ${project.name}`}
            onError={() => setHeroImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-[#8A8881]">
            <ImageOff className="w-12 h-12 mb-3 opacity-40" />
            <span className="text-sm font-medium">Captura en proceso de acreditación</span>
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#141413] text-xs font-semibold px-3 py-1.5 rounded-full border border-black/5 flex items-center gap-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>Ver pantalla completa</span>
        </div>

        {project.thumbnailCredit && !heroImgError && (
          <div className="absolute bottom-3 right-3 bg-[#141413]/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full">
            Crédito: {project.thumbnailCredit}
          </div>
        )}
      </div>

      {/* Grid of Verified Facts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Main Content (col-span-8) */}
        <div className="md:col-span-8 space-y-8">
          {/* Separación obligatoria: Alcance total vs. Contribución de Lyberate */}
          <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E3DC] space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32] block mb-1">
                Frontera de Trabajo
              </span>
              <h2 className="text-lg font-bold text-[#141413] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C85A32]" />
                <span>Contribución verificada de Lyberate</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#141413] leading-relaxed bg-[#FBFBF9] p-4 rounded-lg border border-[#E5E3DC] font-medium">
              {project.lyberateContribution}
            </p>

            {project.fullScope && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8881] mb-1">
                  Alcance global del sistema:
                </h4>
                <p className="text-xs text-[#5C5B56] leading-relaxed">
                  {project.fullScope}
                </p>
              </div>
            )}
          </section>

          {/* Resultado verificable y Métricas auditadas (si existen) */}
          <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E3DC] space-y-4">
            <h2 className="text-lg font-bold text-[#141413] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Resultado y validación de calidad</span>
            </h2>

            {project.verifiableOutcome ? (
              <p className="text-xs sm:text-sm text-[#5C5B56] leading-relaxed">
                {project.verifiableOutcome}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[#5C5B56] leading-relaxed italic">
                Proyecto verificado a nivel de código fuente y arquitectura sin métricas de rendimiento estimadas.
              </p>
            )}

            {/* Métricas sólo si están verificadas con fuente */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="pt-4 border-t border-[#F0EFEA] grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="p-4 rounded-lg bg-[#FBFBF9] border border-[#E5E3DC]">
                    <span className="text-lg font-extrabold text-[#141413] font-mono block">
                      {metric.value}
                    </span>
                    <span className="text-xs font-semibold text-[#C85A32] block mt-0.5">
                      {metric.label}
                    </span>
                    {metric.source && (
                      <span className="text-[10px] text-[#8A8881] block mt-1">
                        Fuente: {metric.source}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Galería de capturas enriquecida (1 o más imágenes con visor iOS27) */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#141413] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#C85A32]" />
                  <span>Capturas y módulos del sistema ({project.gallery.length + 1} fotos)</span>
                </h2>
                <span className="text-xs text-[#8A8881]">Haz clic en cualquier imagen para ampliar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.gallery.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setLightboxIndex(index + 1)}
                    className="bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="aspect-16/10 bg-[#F5F4EF] overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-[#141413] flex items-center gap-1.5 shadow-sm">
                          <Maximize2 className="w-3.5 h-3.5 text-[#C85A32]" />
                          <span>Ampliar</span>
                        </span>
                      </div>
                    </div>
                    {item.caption && (
                      <div className="p-3.5 bg-white text-xs text-[#5C5B56] border-t border-[#F0EFEA]">
                        <p className="font-semibold text-[#141413]">{item.caption}</p>
                        {item.credit && (
                          <span className="text-[10px] text-[#8A8881] mt-0.5 block">
                            Fuente: {item.credit}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Honestidad técnica */}
          <div className="p-4 rounded-lg bg-[#FBFBF9] border border-[#E5E3DC] text-xs text-[#5C5B56]">
            <strong>Declaración de autoría honesta:</strong> Lyberate documenta exclusivamente los hechos verificables en repositorios y despliegues autorizados. No se publican métricas privadas ni derechos no otorgados.
          </div>
        </div>

        {/* Sidebar Metadata (col-span-4) */}
        <div className="md:col-span-4 bg-white p-6 rounded-xl border border-[#E5E3DC] space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8881] mb-3">
              Tecnologías auditadas
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.verifiedTechnologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium text-[#141413] bg-[#F5F4EF] px-2.5 py-1 rounded-md border border-[#E5E3DC]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0EFEA] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A8881] block">
              Tipo de Relación
            </span>
            <div className="flex items-center gap-2 text-xs text-[#141413] font-medium">
              <Tag className="w-4 h-4 text-[#C85A32]" />
              <span>{rel.label}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0EFEA] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A8881] block">
              Estado Editorial
            </span>
            <Badge variant="success" size="sm">
              Publicación autorizada
            </Badge>
          </div>

          <div className="pt-4 border-t border-[#F0EFEA]">
            <Link to="/contacto">
              <Button variant="primary" size="sm" className="w-full justify-center">
                Consultar sobre este trabajo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contextual Navigation (Prev / Next Project) */}
      <div className="pt-8 border-t border-[#E5E3DC] flex flex-col sm:flex-row justify-between items-center gap-4">
        {prev ? (
          <Link
            to={`/trabajos/${prev.slug}`}
            className="flex items-center gap-2 text-xs font-semibold text-[#5C5B56] hover:text-[#141413] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior: {prev.name}</span>
          </Link>
        ) : (
          <Link
            to="/trabajos"
            className="flex items-center gap-2 text-xs font-semibold text-[#5C5B56] hover:text-[#141413]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al catálogo</span>
          </Link>
        )}

        {next && (
          <Link
            to={`/trabajos/${next.slug}`}
            className="flex items-center gap-2 text-xs font-semibold text-[#5C5B56] hover:text-[#141413] transition-colors"
          >
            <span>Siguiente: {next.name}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Visor Lightbox iOS27 en Pantalla Completa */}
      {lightboxIndex !== null && allImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Barra superior de controles iOS */}
          <div className="flex items-center justify-between text-white pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full">
                {lightboxIndex + 1} / {allImages.length}
              </span>
              <span className="text-sm font-semibold text-white/90 truncate max-w-xs sm:max-w-md">
                {project.name} — {allImages[lightboxIndex].caption || allImages[lightboxIndex].alt}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Cerrar visor"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Imagen central con controles laterales */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Flecha anterior */}
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0))}
              aria-label="Imagen anterior"
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Imagen activa */}
            <div className="max-w-5xl max-h-[75vh] flex flex-col items-center justify-center p-2">
              <img
                src={allImages[lightboxIndex].url}
                alt={allImages[lightboxIndex].alt}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200"
              />
              {allImages[lightboxIndex].caption && (
                <p className="text-xs text-white/80 text-center mt-3 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full">
                  {allImages[lightboxIndex].caption}
                  {allImages[lightboxIndex].credit && ` • ${allImages[lightboxIndex].credit}`}
                </p>
              )}
            </div>

            {/* Flecha siguiente */}
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allImages.length : 0))}
              aria-label="Siguiente imagen"
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Carrusel de miniaturas inferior estilo iOS */}
          <div className="flex justify-center items-center gap-2 overflow-x-auto pt-4 border-t border-white/10">
            {allImages.map((img, idx) => {
              const isSelected = idx === lightboxIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    isSelected ? 'border-[#C85A32] scale-105 opacity-100 shadow-md' : 'border-white/20 opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
};
