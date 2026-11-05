import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toUpperCase();
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs font-semibold';

  let config = {
    badge: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
    dot: 'bg-zinc-400',
    pulse: false,
    label: s
  };

  if (s === 'OPEN') {
    config = {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      dot: 'bg-emerald-400',
      pulse: true,
      label: 'Open for Applications'
    };
  } else if (s === 'CLOSED') {
    config = {
      badge: 'bg-zinc-900/90 text-zinc-400 border-zinc-800',
      dot: 'bg-zinc-500',
      pulse: false,
      label: 'Closed'
    };
  } else if (s === 'SUBMITTED') {
    config = {
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
      dot: 'bg-cyan-400',
      pulse: true,
      label: 'Submitted'
    };
  } else if (s === 'SHORTLISTED') {
    config = {
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
      dot: 'bg-amber-400',
      pulse: true,
      label: 'Shortlisted'
    };
  } else if (s === 'ACCEPTED') {
    config = {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      dot: 'bg-emerald-300',
      pulse: false,
      label: 'Accepted'
    };
  } else if (s === 'REJECTED') {
    config = {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400',
      pulse: false,
      label: 'Not Selected'
    };
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md ${sizeClasses} ${config.badge}`}>
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
