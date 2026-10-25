import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toUpperCase();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  let colors = 'bg-slate-800 text-slate-300 border-slate-700';

  if (s === 'OPEN') {
    colors = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
  } else if (s === 'CLOSED') {
    colors = 'bg-slate-900 text-slate-400 border-slate-800';
  } else if (s === 'SUBMITTED') {
    colors = 'bg-sky-950/80 text-sky-300 border-sky-700/60';
  } else if (s === 'SHORTLISTED') {
    colors = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
  } else if (s === 'ACCEPTED') {
    colors = 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80 font-bold';
  } else if (s === 'REJECTED') {
    colors = 'bg-rose-950/80 text-rose-300 border-rose-800/60';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colors}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {s}
    </span>
  );
};
