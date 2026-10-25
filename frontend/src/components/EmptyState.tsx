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
    <div className="text-center py-16 px-4 bg-cinema-900/40 rounded-2xl border border-cinema-800/60 max-w-lg mx-auto my-8">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-cinema-800/80 border border-cinema-700/60 flex items-center justify-center text-cinema-gold mb-4 shadow-inner">
        {icon || <Film className="w-7 h-7 opacity-80" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-cinema-800 hover:bg-cinema-750 text-cinema-gold font-semibold text-sm border border-cinema-700/80 transition shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
