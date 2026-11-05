import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toUpperCase();
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs font-semibold';

  let config = {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    pulse: false,
    label: s
  };

  if (s === 'OPEN') {
    config = {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
      dot: 'bg-emerald-500',
      pulse: true,
      label: 'Open for Applications'
    };
  } else if (s === 'CLOSED') {
    config = {
      badge: 'bg-slate-100 text-slate-500 border-slate-200',
      dot: 'bg-slate-400',
      pulse: false,
      label: 'Closed'
    };
  } else if (s === 'SUBMITTED') {
    config = {
      badge: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
      dot: 'bg-blue-500',
      pulse: true,
      label: 'Submitted'
    };
  } else if (s === 'SHORTLISTED') {
    config = {
      badge: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
      dot: 'bg-amber-500',
      pulse: true,
      label: 'Shortlisted'
    };
  } else if (s === 'ACCEPTED') {
    config = {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      dot: 'bg-emerald-600',
      pulse: false,
      label: 'Accepted'
    };
  } else if (s === 'REJECTED') {
    config = {
      badge: 'bg-rose-50 text-rose-600 border-rose-200',
      dot: 'bg-rose-400',
      pulse: false,
      label: 'Not Selected'
    };
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${config.badge}`}>
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <span className="font-mono tracking-wide">{config.label}</span>
    </span>
  );
};
