import React from 'react';
import { Film } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-card">
      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 shadow-xs">
          {icon || <Film className="w-8 h-8 text-emerald-600" />}
        </div>
        
        <h3 className="text-xl font-bold font-display text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">{description}</p>
        
        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-2.5 rounded-xl btn-brand text-xs font-bold font-display uppercase tracking-wider"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};
