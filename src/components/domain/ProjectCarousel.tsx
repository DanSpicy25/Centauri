import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ImageOff,
  Pause,
  Play,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectDTO } from '../../types';
import { Button } from '../ui/Button';

export interface ProjectCarouselProps {
  projects: ProjectDTO[];
  className?: string;
  autoPlayIntervalMs?: number;
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  className = '',
  autoPlayIntervalMs = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeView, setActiveView] = useState<'business' | 'technical'>('business');
  const [progress, setProgress] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = projects.length;

  const nextSlide = useCallback(() => {
    setImgError(false);
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    setImgError(false);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  // Temporizador automático de 5 segundos con barra de progreso fluida (estilo iOS)
  useEffect(() => {
    if (total <= 1 || isPaused || isHovered) return;

    const tickInterval = 50; // cada 50ms actualiza el progreso
    const step = (tickInterval / autoPlayIntervalMs) * 100;

    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          nextSlide();
          return 0;
        }
        return old + step;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [total, isPaused, isHovered, autoPlayIntervalMs, nextSlide]);

  // Teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  };

  // Touch handlers para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
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
        whatItDoes: 'Punto de venta y control total de inventario en vivo',
        realBenefit: 'Permite cobrar en segundos, evitar pérdidas de mercancía y ver tus ganancias al instante desde cualquier dispositivo.',
        solutionTags: ['Cero errores de caja', 'Inventario al día', 'Facturación rápida'],
      };
    }
    if (p.slug.includes('noticia')) {
      return {
        whatItDoes: 'Periódico digital que nunca se cae y funciona sin internet',
        realBenefit: 'Tus lectores pueden leer noticias aunque tengan mala señal móvil. Carga al instante y tu equipo puede redactar desde el teléfono.',
        solutionTags: ['Carga instantánea', 'Lectura sin señal', 'Fácil de usar'],
      };
    }
    if (p.slug.includes('motoindy') || p.slug.includes('metropolis')) {
      return {
        whatItDoes: 'App para celulares con rastreo GPS y despachos en vivo',
        realBenefit: 'Conecta clientes con conductores en tiempo real, calcula tarifas exactas y gestiona envíos sin llamadas manuales.',
        solutionTags: ['Rastreo en mapa', 'Pagos automáticos', 'App para Android/iOS'],
      };
    }
    // Caso genérico claro y directo
    return {
      whatItDoes: p.tagline || 'Plataforma digital a la medida',
      realBenefit: p.summary || 'Sistema rápido, seguro y adaptado exactamente a las necesidades operativas de tu empresa.',
      solutionTags: ['Hecho a medida', '100% independiente', 'Soporte garantizado'],
    };
  };

  const businessInfo = getDirectBusinessValue(currentProject);

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      aria-label="Carrusel automático de proyectos destacados. Avanza cada 5 segundos. Usa las flechas para navegar o espacio para pausar."
      className={`relative bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E5E3DC]/80 p-6 sm:p-10 shadow-[0_12px_40px_rgba(20,20,19,0.05)] focus-visible:outline-2 focus-visible:outline-[#C85A32] transition-all duration-300 ${className}`}
    >
      {/* Barra de progreso superior automática de 5s estilo iOS */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#F0EFEA] rounded-t-3xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C85A32] to-[#E07A5F] transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header controls of the carousel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EFEA] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C85A32]">
              Sistemas en Operación Real
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Lo que construimos en la práctica
          </h3>
          <p className="text-xs text-[#5C5B56] mt-0.5">
            Software diseñado para resolver problemas de negocio reales, sin complicaciones técnicas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Contador y pausa */}
          <div className="flex items-center gap-2 bg-[#F5F4EF] px-3 py-1.5 rounded-full border border-[#E5E3DC]/60 text-xs font-mono">
            <span className="font-bold text-[#141413]">0{currentIndex + 1}</span>
            <span className="text-[#8A8881]">/</span>
            <span className="text-[#8A8881]">0{total}</span>

            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Reanudar carrusel automático' : 'Pausar carrusel automático'}
              className="ml-1 p-1 hover:text-[#C85A32] transition-colors cursor-pointer text-[#5C5B56]"
              title={isPaused ? 'Reanudar rotación de 5s' : 'Pausar rotación de 5s'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

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

      {/* Main Slide Card with Touch Swipe */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        {/* Visual Showcase (col-span-7) con estilo iOS Liquid Glass */}
        <div className="lg:col-span-7 relative aspect-16/10 rounded-2xl overflow-hidden bg-[#F5F4EF] border border-[#E5E3DC] shadow-sm group">
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

          {/* Badges superiores translúcidos */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="backdrop-blur-md bg-white/90 text-[#141413] text-xs font-semibold px-3 py-1 rounded-full border border-black/5 shadow-xs">
              {rel.label}
            </span>
            <span className="backdrop-blur-md bg-[#141413]/80 text-white text-xs font-medium px-3 py-1 rounded-full shadow-xs">
              {currentProject.category}
            </span>
          </div>

          {/* Indicador inferior de rotación de 5s */}
          <div className="absolute bottom-3 left-4 text-[10px] text-white/90 backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-full font-mono">
            {isPaused || isHovered ? 'Rotación pausada al interactuar' : 'Cambio automático cada 5 seg.'}
          </div>
        </div>

        {/* Content Details (col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Conmutador de modo: Modo Cliente (claro y directo) vs Modo Ficha Técnica */}
          <div className="flex items-center gap-1 bg-[#F5F4EF] p-1 rounded-xl border border-[#E5E3DC] w-fit">
            <button
              type="button"
              onClick={() => setActiveView('business')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'business'
                  ? 'bg-white text-[#C85A32] shadow-xs'
                  : 'text-[#5C5B56] hover:text-[#141413]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Para tu negocio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('technical')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'technical'
                  ? 'bg-white text-[#141413] shadow-xs'
                  : 'text-[#5C5B56] hover:text-[#141413]'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Ficha técnica</span>
            </button>
          </div>

          {/* Título y Tagline */}
          <div>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
              {currentProject.name}
            </h4>
            <p className="text-sm font-semibold text-[#C85A32] mt-1">
              {businessInfo.whatItDoes}
            </p>
          </div>

          {/* VISTA 1: PARA CLIENTES (SIN PALABRAS TÉCNICAS COMPLICADAS) */}
          {activeView === 'business' && (
            <div className="space-y-4 animate-in fade-in duration-200">
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
                  Ventajas comprobadas:
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
          )}

          {/* VISTA 2: FICHA TÉCNICA (PARA INGENIEROS O AUDITORES) */}
          {activeView === 'technical' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                  Aporte verificado de Lyberate:
                </span>
                <p className="text-xs text-[#141413] leading-normal font-mono">
                  {currentProject.lyberateContribution}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#8A8881] uppercase tracking-wider block mb-1.5">
                  Tecnologías auditadas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentProject.verifiedTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono text-[#5C5B56] bg-[#F5F4EF] px-2.5 py-0.5 rounded-md border border-[#E5E3DC]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTAs con estética iOS refinada */}
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
                setImgError(false);
                setCurrentIndex(idx);
                setProgress(0);
              }}
              aria-label={`Ir a proyecto ${idx + 1}: ${proj.name}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-2 ${
                isActive ? 'w-8 bg-[#C85A32]' : 'w-2 bg-[#D1CEBF] hover:bg-[#8A8881]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
