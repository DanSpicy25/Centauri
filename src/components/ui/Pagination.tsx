import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Navegación de páginas" className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Página anterior"
        className="p-1.5 rounded-lg border border-[#D1CEBF] text-[#141413] hover:bg-[#F5F4EF] disabled:opacity-40 disabled:pointer-events-none cursor-pointer focus-visible:outline-2"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-2
                ${isCurrent ? 'bg-[#141413] text-white' : 'text-[#5C5B56] hover:bg-[#F5F4EF] hover:text-[#141413]'}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Página siguiente"
        className="p-1.5 rounded-lg border border-[#D1CEBF] text-[#141413] hover:bg-[#F5F4EF] disabled:opacity-40 disabled:pointer-events-none cursor-pointer focus-visible:outline-2"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

