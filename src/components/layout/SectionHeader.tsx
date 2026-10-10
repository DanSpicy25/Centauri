import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}) => {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-[#C85A32] mb-2 block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-[#5C5B56] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

