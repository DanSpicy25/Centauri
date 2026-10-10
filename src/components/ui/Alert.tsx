import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const variantStyles = {
    info: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]',
    success: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#064E3B]',
    warning: 'bg-[#FFFBEB] border-[#FDE68A] text-[#78350F]',
    error: 'bg-[#FEF2F2] border-[#FECACA] text-[#7F1D1D]',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-[#2563EB] shrink-0" aria-hidden="true" />,
    success: <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" aria-hidden="true" />,
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-lg border ${variantStyles[variant]} ${className}`}
    >
      {icons[variant]}
      <div className="flex-1 text-sm leading-relaxed">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificación"
          className="text-current opacity-70 hover:opacity-100 p-1 rounded transition-opacity cursor-pointer focus-visible:outline-2"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

