import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'neutral' | 'success' | 'warning' | 'info' | 'error';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center font-medium rounded-full tracking-wide';
  
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    brand: 'bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]',
    neutral: 'bg-[#F0EFEA] text-[#5C5B56] border border-[#E5E3DC]',
    success: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    warning: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
    info: 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]',
    error: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
  };

  return (
    <span className={`${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

