import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocurrió un error inesperado',
  message = 'No se pudo cargar la información solicitada. Por favor, verifica tu conexión o intenta nuevamente.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-[#FECACA] bg-[#FEF2F2] ${className}`}
    >
      <div className="mb-3 p-3 rounded-full bg-[#FEE2E2]">
        <AlertCircle className="w-8 h-8 text-[#DC2626]" aria-hidden="true" />
      </div>
      <h4 className="text-base font-semibold text-[#7F1D1D] mb-1">{title}</h4>
      <p className="text-xs text-[#991B1B] max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Reintentar
        </Button>
      )}
    </div>
  );
};

