import React from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon = <Inbox className="w-10 h-10 text-[#8A8881]" aria-hidden="true" />,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#D1CEBF] bg-[#FBFBF9] ${className}`}>
      <div className="mb-3 p-3 rounded-full bg-[#F5F4EF]">{icon}</div>
      <h4 className="text-base font-semibold text-[#141413] mb-1">{title}</h4>
      <p className="text-xs text-[#5C5B56] max-w-sm mb-4 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

