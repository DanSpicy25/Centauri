import React, { useState } from 'react';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectDTO } from '../../types';
import { Badge } from '../ui/Badge';

export interface ProjectCardProps {
  project: ProjectDTO;
  featured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
  const [imgError, setImgError] = useState(false);

  const relationshipLabels = {
    own: { label: 'Proyecto Propio', variant: 'brand' as const },
    client: { label: 'Cliente', variant: 'neutral' as const },
    collaboration: { label: 'Colaboración', variant: 'info' as const },
    managed: { label: 'Gestionado', variant: 'warning' as const },
    unknown: { label: 'Por Confirmar', variant: 'neutral' as const },
  };

  const rel = relationshipLabels[project.relationship] || relationshipLabels.unknown;

  return (
    <article
      className={`group relative flex flex-col bg-white rounded-xl border border-[#E5E3DC] overflow-hidden transition-all duration-200 hover:border-[#D1CEBF] hover:shadow-md
        ${featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''}`}
    >
      {/* Thumbnail area with graceful fallback */}
      <div className={`relative overflow-hidden bg-[#F5F4EF] ${featured ? 'md:col-span-7 aspect-16/10' : 'aspect-16/10'}`}>
        {!imgError ? (
          <img
            src={project.thumbnailUrl}
            alt={project.thumbnailAlt || `Captura del proyecto ${project.name}`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#8A8881] bg-[#F5F4EF]">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" aria-hidden="true" />
            <span className="text-xs font-medium">Captura en proceso de optimización</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge variant={rel.variant} size="sm">
            {rel.label}
          </Badge>
          <Badge variant="neutral" size="sm">
            {project.category}
          </Badge>
        </div>
        {project.gallery && project.gallery.length > 0 && (
          <div className="absolute bottom-3 right-3 backdrop-blur-md bg-black/60 text-white text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full shadow-xs">
            +{project.gallery.length} capturas
          </div>
        )}
      </div>

      <div className={`p-5 flex flex-col justify-between flex-1 ${featured ? 'md:col-span-5 md:p-6' : ''}`}>
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-bold text-[#141413] tracking-tight group-hover:text-[#7C3AED] transition-colors">
              {project.name}
            </h3>
            {project.publicUrl && (
              <a
                href={project.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar sitio oficial de ${project.name} (se abre en nueva ventana)`}
                className="text-[#8A8881] hover:text-[#141413] transition-colors p-1"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>

          <p className="text-xs font-medium text-[#7C3AED] mb-2">{project.tagline}</p>
          <p className="text-xs text-[#5C5B56] line-clamp-3 leading-relaxed mb-4">{project.summary}</p>

        </div>

        <div>
          <Link
            to={`/trabajos/${project.slug}`}
            className="site-link inline-flex items-center text-xs font-semibold text-[#141413] hover:text-[#7C3AED] transition-colors gap-1 group/link"
          >
            <span>Ver caso de estudio</span>
            <span className="transition-transform group-hover/link:translate-x-0.5" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
