import React from 'react';

interface LyberateLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  inverted?: boolean;
}

export const LyberateLogo: React.FC<LyberateLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  inverted = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', subtext: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-lg', subtext: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', subtext: 'text-xs' },
    xl: { icon: 'w-12 h-12', text: 'text-3xl', subtext: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Icono morado característico de Lyberate */}
      <div
        className={`${currentSize.icon} relative shrink-0 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] p-0.5 shadow-[0_4px_14px_rgba(124,58,237,0.35)] transition-transform duration-300 hover:scale-105`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="lyb-grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="lyb-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EDE9FE" />
            </linearGradient>
            <filter id="lyb-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#4C1D95" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Forma geométrica facetada con corte de software */}
          <rect x="3" y="3" width="34" height="34" rx="9" fill="url(#lyb-grad-light)" fillOpacity="0.15" />
          
          {/* Símbolo "L" morado icónico refinado */}
          <path
            d="M13 10C13 8.89543 13.8954 8 15 8H17C18.1046 8 19 8.89543 19 10V24H27C28.1046 24 29 24.8954 29 26V28C29 29.1046 28.1046 30 27 30H15C13.8954 30 13 29.1046 13 28V10Z"
            fill="url(#lyb-grad-dark)"
            filter="url(#lyb-glow)"
          />

          {/* Acento geométrico luminoso característico */}
          <circle cx="28" cy="12" r="3" fill="#A78BFA" />
          <circle cx="28" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold tracking-tight font-editorial-heading ${currentSize.text} ${
              inverted ? 'text-white' : 'text-[#141413]'
            }`}
          >
            Lyberate
          </span>
          <span
            className={`font-semibold tracking-wider uppercase font-editorial-mono ${currentSize.subtext} ${
              inverted ? 'text-purple-300/80' : 'text-[#7C3AED]'
            }`}
          >
            Software Labs
          </span>
        </div>
      )}
    </div>
  );
};

