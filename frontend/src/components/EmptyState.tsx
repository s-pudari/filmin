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
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-12 text-center backdrop-blur-md">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5 shadow-inner">
          {icon || <Film className="w-8 h-8 text-amber-400" />}
        </div>
        
        <h3 className="text-xl font-bold font-display text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">{description}</p>
        
        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-2.5 rounded-xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};
