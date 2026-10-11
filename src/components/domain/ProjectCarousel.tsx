import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ImageOff,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectDTO } from '../../types';
import { Button } from '../ui/Button';

export interface ProjectCarouselProps {
  projects: ProjectDTO[];
  className?: string;
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = projects.length;

  const showSlide = (index: number) => {
    setImgError(false);
    setCurrentIndex((index + total) % total);
  };
  const nextSlide = () => showSlide(currentIndex + 1);
  const prevSlide = () => showSlide(currentIndex - 1);

  // Teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  };

  // Touch handlers para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (total === 0) return null;

  const currentProject = projects[currentIndex];

  const relationshipLabels = {
    own: { label: 'Solución Propia', variant: 'brand' as const },
    client: { label: 'Caso de Cliente', variant: 'neutral' as const },
    collaboration: { label: 'Alianza Estratégica', variant: 'info' as const },
    managed: { label: 'Plataforma Gestionada', variant: 'warning' as const },
    unknown: { label: 'Verificado', variant: 'neutral' as const },
  };

  const rel = relationshipLabels[currentProject.relationship] || relationshipLabels.unknown;

  // Resumen no técnico directo para clientes que no saben de computación
  const getDirectBusinessValue = (p: ProjectDTO) => {
    if (p.slug.includes('sagitta')) {
      return {
        whatItDoes: 'Ventas e inventario organizados en un solo lugar',
        realBenefit: 'Ayuda a consultar existencias, registrar ventas y mantener la operación del negocio más ordenada.',
        solutionTags: ['Ventas organizadas', 'Control de existencias', 'Información centralizada'],
      };
    }
    if (p.slug.includes('noticia')) {
      return {
        whatItDoes: 'Un espacio digital para publicar y leer noticias',
        realBenefit: 'Reúne el contenido editorial y facilita que el equipo publique y que los lectores encuentren las noticias.',
        solutionTags: ['Contenido organizado', 'Publicación sencilla', 'Lectura desde el móvil'],
      };
    }
    if (p.slug.includes('motoindy') || p.slug.includes('metropolis')) {
      return {
        whatItDoes: 'Una forma más clara de coordinar servicios y entregas',
        realBenefit: 'Ayuda a reunir solicitudes, personas y seguimiento de operaciones en una misma experiencia.',
        solutionTags: ['Seguimiento más claro', 'Información centralizada', 'Acceso desde el móvil'],
      };
    }
    // Caso genérico claro y directo
    return {
      whatItDoes: p.tagline || 'Plataforma digital a la medida',
      realBenefit: p.summary || 'Una solución digital pensada alrededor de las necesidades de tu negocio.',
      solutionTags: ['A la medida', 'Fácil de consultar', 'Pensada para tu equipo'],
    };
  };

  const businessInfo = getDirectBusinessValue(currentProject);

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Proyectos destacados. Usa las flechas izquierda y derecha para navegar."
      className={`relative overflow-hidden rounded-[2rem] border border-[#E5E3DC]/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(20,20,19,0.08)] transition-all duration-500 focus-visible:outline-2 focus-visible:outline-[#7C3AED] sm:p-10 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EFEA] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7C3AED]">
              Proyectos seleccionados
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Lo que construimos en la práctica
          </h3>
          <p className="text-xs text-[#5C5B56] mt-0.5">
            Soluciones digitales creadas alrededor de necesidades reales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#E5E3DC] bg-[#FBFBF9] px-3 py-1.5 text-xs text-[#5C5B56]" aria-live="polite">
            {currentIndex + 1} de {total}
          </span>

          {/* Flechas táctiles con estética iOS redondeada */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Proyecto anterior"
              className="p-2.5 rounded-full bg-white border border-[#E5E3DC] text-[#141413] hover:bg-[#F5F4EF] hover:border-[#D1CEBF] active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Siguiente proyecto"
              className="p-2.5 rounded-full bg-white border border-[#E5E3DC] text-[#141413] hover:bg-[#F5F4EF] hover:border-[#D1CEBF] active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main project card with touch swipe */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        <div key={currentProject.id} className="carousel-image-enter lg:col-span-7 relative aspect-16/10 overflow-hidden rounded-2xl border border-[#E5E3DC] bg-[#F5F4EF] shadow-lg group">
          {!imgError ? (
            <img
              src={currentProject.thumbnailUrl}
              alt={currentProject.thumbnailAlt || `Captura del proyecto ${currentProject.name}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#8A8881] bg-[#F5F4EF]">
              <ImageOff className="w-8 h-8 mb-2 opacity-50" aria-hidden="true" />
              <span className="text-xs font-medium">Captura de pantalla autorizada</span>
            </div>
          )}

          {/* Project labels */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="backdrop-blur-md bg-white/90 text-[#141413] text-xs font-semibold px-3 py-1 rounded-full border border-black/5 shadow-xs">
              {rel.label}
            </span>
            <span className="backdrop-blur-md bg-[#141413]/80 text-white text-xs font-medium px-3 py-1 rounded-full shadow-xs">
              {currentProject.category}
            </span>
          </div>

          {/* Project credit */}
          <div className="absolute bottom-3 left-4 text-[10px] text-white/90 backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-full">
            {currentProject.thumbnailCredit || 'Proyecto Lyberate'}
          </div>
        </div>

        {/* Content Details (col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="page-enter space-y-5" key={`${currentProject.id}-copy`} aria-live="polite">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
              {currentProject.name}
            </h4>
            <p className="text-sm font-semibold text-[#7C3AED] mt-1">
              {businessInfo.whatItDoes}
            </p>
          </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8881] block">
                  ¿Cómo te beneficia este sistema?
                </span>
                <p className="text-xs sm:text-sm text-[#141413] leading-relaxed font-medium">
                  {businessInfo.realBenefit}
                </p>
              </div>

              {/* Beneficios directos en viñetas claras */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#8A8881] uppercase tracking-wider block">
                  Aspectos destacados:
                </span>
                <div className="flex flex-wrap gap-2">
                  {businessInfo.solutionTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

          <div className="pt-4 border-t border-[#F0EFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link to={`/trabajos/${currentProject.slug}`}>
              <Button variant="primary" size="md" className="gap-2 rounded-full w-full sm:w-auto shadow-sm">
                <span>Ver cómo funciona</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link
              to="/trabajos"
              className="text-xs font-semibold text-[#5C5B56] hover:text-[#141413] hover:underline text-center sm:text-right"
            >
              Explorar todos los proyectos →
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores de píldora estilo iOS abajo */}
      <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-[#F0EFEA]">
        {projects.map((proj, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={proj.id}
              type="button"
              onClick={() => {
                showSlide(idx);
              }}
              aria-label={`Ir a proyecto ${idx + 1}: ${proj.name}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-2 ${
                isActive ? 'w-8 bg-[#7C3AED]' : 'w-2 bg-[#D1CEBF] hover:bg-[#8A8881]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
