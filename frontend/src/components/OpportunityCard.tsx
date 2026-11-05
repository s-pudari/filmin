import React from 'react';
import { Opportunity } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, Users, Clapperboard, ArrowRight, ShieldCheck, Clock, Film } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect }) => {
  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const isExpired = new Date(opportunity.deadline).getTime() < new Date().setHours(0, 0, 0, 0);

  // Craft tag coloring
  const getRoleBadgeStyle = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('editor')) {
      return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    }
    if (r.includes('cinema') || r.includes('camera') || r.includes('dop')) {
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    }
    if (r.includes('actor') || r.includes('actress') || r.includes('cast')) {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    }
    if (r.includes('sound') || r.includes('music') || r.includes('audio')) {
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    }
    if (r.includes('writer') || r.includes('script')) {
      return 'bg-pink-500/10 text-pink-300 border-pink-500/20';
    }
    return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
  };

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="group relative rounded-3xl bg-[#0b0c13]/90 hover:bg-[#11131e] border border-white/[0.08] hover:border-amber-500/40 p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:shadow-[0_16px_40px_-10px_rgba(245,158,11,0.18)] hover:-translate-y-1 overflow-hidden"
    >
      {/* Top ambient glow light */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 group-hover:bg-amber-500/10 rounded-full blur-2xl transition-all pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 group-hover:via-amber-400/30 to-transparent" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold font-display border ${getRoleBadgeStyle(opportunity.roleNeeded)}`}>
              {opportunity.roleNeeded}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {formatType(opportunity.opportunityType)}
            </span>
          </div>
          <StatusBadge status={isExpired ? 'CLOSED' : opportunity.status} size="sm" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold font-display text-white group-hover:text-amber-300 transition-colors leading-snug mb-2.5">
          {opportunity.title}
        </h3>

        {/* Description snippet */}
        <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 mb-5 leading-relaxed font-sans">
          {opportunity.description}
        </p>
      </div>

      <div>
        {/* Meta details */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400 py-3 border-t border-white/[0.06] mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate justify-end sm:justify-start">
            <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className={isExpired ? 'text-rose-400 font-semibold' : 'text-zinc-300'}>
              Due: {opportunity.deadline}
            </span>
          </div>
        </div>

        {/* Footer with Creator and CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center text-[10px] font-extrabold shadow-sm">
              {(opportunity.creatorName || 'C').charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-zinc-300 truncate max-w-[130px]">
              <span className="truncate">{opportunity.creatorName || 'Production'}</span>
              <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
            </div>

            {opportunity.applicantCount !== undefined && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 border-l border-white/10 pl-2">
                <Users className="w-3 h-3" />
                <span>{opportunity.applicantCount}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold font-display text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Apply Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
