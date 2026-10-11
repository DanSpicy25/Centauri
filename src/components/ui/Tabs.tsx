import React from 'react';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`border-b border-[#E5E3DC] ${className}`} role="tablist" aria-orientation="horizontal">
      <div className="flex gap-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`pb-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98] relative cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2
                ${isActive ? 'text-[#7C3AED]' : 'text-[#5C5B56] hover:text-[#141413]'}`}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full animate-fade-in"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

