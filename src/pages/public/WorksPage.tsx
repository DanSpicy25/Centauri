import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ShieldCheck, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { projectRepository } from '../../repositories/projectRepository';
import { ProjectCard } from '../../components/domain/ProjectCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export const WorksPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const allPublished = useMemo(() => projectRepository.getPublishedProjects(), []);

  const categories = useMemo(
    () => [
      { id: 'todos', label: 'Todas las categorías' },
      { id: 'Plataforma Empresarial', label: 'Plataformas Empresariales' },
      { id: 'SaaS & Mensajería', label: 'SaaS & Mensajería' },
      { id: 'Medios & Editorial', label: 'Medios & Editorial' },
      { id: 'Movilidad & Logística', label: 'Movilidad & Logística' },
      { id: 'Comercio Electrónico', label: 'Comercio Electrónico' },
    ],
    []
  );

  const relationships = useMemo(
    () => [
      { id: 'todos', label: 'Todas las atribuciones' },
      { id: 'own', label: 'Soluciones Propias' },
      { id: 'client', label: 'Proyectos de Clientes & Alianzas' },
    ],
    []
  );

  const filteredProjects = useMemo(() => {
    return projectRepository.filterProjects({
      category: selectedCategory,
      relationship: selectedRelationship as any,
      searchTerm,
    });
  }, [selectedCategory, selectedRelationship, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSelectedRelationship('todos');
    setSearchTerm('');
  };

  const isFiltered =
    selectedCategory !== 'todos' || selectedRelationship !== 'todos' || searchTerm.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* 1. Header Editorial */}
      <section className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-xs font-semibold text-[#C85A32]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Portafolio & Casos de Estudio Verificados</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#141413] leading-[1.12] font-editorial-heading">
          Sistemas en operación real y desarrollos auditados
        </h1>
        <p className="text-base sm:text-lg text-[#5C5B56] leading-relaxed font-editorial-body">
          Cada caso expone con rigor el problema resuelto, las tecnologías comprobadas en código y el alcance preciso de la contribución de Lyberate, distinguiendo soluciones propias de proyectos para clientes.
        </p>
      </section>

      {/* 2. Banner de Atribución Obligatoria (Master Contract Sección 4.5) */}
      <section className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-bold text-[#141413] block">
              Compromiso de atribución transparente:
            </span>
            <span className="text-[#5C5B56]">
              Clasificamos cada trabajo con exactitud (propio, cliente o colaboración). No inflamos métricas ficticias ni presentamos software de terceros adaptado como si hubiera sido creado desde cero.
            </span>
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-mono font-bold text-[#C85A32] bg-white px-2.5 py-1 rounded-full border border-[#E5E3DC]">
          Auditoría de Código Verificada
        </span>
      </section>

      {/* 3. Barra de Búsqueda y Filtros */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E3DC] space-y-6 shadow-[0_12px_40px_rgba(20,20,19,0.04)]">
        {/* Barra de Búsqueda */}
        <div className="relative max-w-lg">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8881]" />
          <input
            type="text"
            placeholder="Buscar por tecnología (React 19, Flutter...), nombre o problema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#FBFBF9] rounded-xl border border-[#D1CEBF] text-[#141413] placeholder:text-[#8A8881] focus:outline-2 focus:outline-[#C85A32] transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8881] hover:text-[#141413] cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros de Categoría y Atribución */}
        <div className="space-y-4 pt-4 border-t border-[#F0EFEA]">
          {/* Categorías */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-[#8A8881] mr-1">Vertical / Sector:</span>
            {categories.map((cat) => {
              const isActive = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer focus-visible:outline-2
                    ${
                      isActive
                        ? 'bg-[#141413] text-white shadow-xs'
                        : 'bg-[#FBFBF9] text-[#5C5B56] border border-[#E5E3DC] hover:border-[#D1CEBF] hover:text-[#141413]'
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Atribución */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-[#8A8881] mr-1">Atribución:</span>
            {relationships.map((rel) => {
              const isActive = rel.id === selectedRelationship;
              return (
                <button
                  key={rel.id}
                  onClick={() => setSelectedRelationship(rel.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer focus-visible:outline-2
                    ${
                      isActive
                        ? 'bg-[#C85A32] text-white shadow-xs'
                        : 'bg-[#F5F4EF] text-[#5C5B56] border border-[#E5E3DC] hover:border-[#D1CEBF] hover:text-[#141413]'
                    }`}
                >
                  {rel.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estado y Limpiar */}
        <div className="pt-4 border-t border-[#F0EFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C5B56]">
          <span>
            Mostrando <strong>{filteredProjects.length}</strong> de <strong>{allPublished.length}</strong> casos publicados y verificados
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#C85A32] hover:underline font-bold cursor-pointer self-start sm:self-auto"
            >
              Restablecer todos los filtros
            </button>
          )}
        </div>
      </div>

      {/* 4. Grid de Proyectos o Estado Vacío */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No se encontraron proyectos"
          description="Ningún caso coincide con la combinación de filtros y término de búsqueda seleccionado."
          action={
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Restablecer todos los filtros
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 5. CTA Final */}
      <section className="text-center pt-8 border-t border-[#E5E3DC]">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] text-[#C85A32] flex items-center justify-center mx-auto">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141413] font-editorial-heading">
            ¿Buscas construir un sistema similar?
          </h2>
          <p className="text-sm text-[#5C5B56] leading-relaxed">
            Podemos diseñar una arquitectura análoga adaptada a la escala y procesos propios de tu organización.
          </p>
          <div className="pt-2">
            <Link to="/contacto">
              <Button size="lg" variant="primary" className="rounded-full shadow-md gap-2">
                <span>Conversar sobre un proyecto a medida</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
