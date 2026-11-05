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

  // Craft tag coloring in LinkedIn light-green style
  const getRoleBadgeStyle = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('editor')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (r.includes('cinema') || r.includes('camera') || r.includes('dop')) {
      return 'bg-teal-50 text-teal-700 border-teal-200';
    }
    if (r.includes('actor') || r.includes('actress') || r.includes('cast')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
    }
    if (r.includes('sound') || r.includes('music') || r.includes('audio')) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }
    if (r.includes('writer') || r.includes('script')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
  };

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="group relative rounded-2xl bg-white hover:bg-slate-50/50 border border-slate-200/90 hover:border-emerald-400 p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-card hover:shadow-card-hover hover:-translate-y-1"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold font-display border ${getRoleBadgeStyle(opportunity.roleNeeded)}`}>
              {opportunity.roleNeeded}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {formatType(opportunity.opportunityType)}
            </span>
          </div>
          <StatusBadge status={isExpired ? 'CLOSED' : opportunity.status} size="sm" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
          {opportunity.title}
        </h3>

        {/* Description snippet */}
        <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed font-sans">
          {opportunity.description}
        </p>
      </div>

      <div>
        {/* Meta details */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-500 py-3 border-t border-slate-100 mb-3.5">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate justify-end sm:justify-start">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className={isExpired ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
              Due: {opportunity.deadline}
            </span>
          </div>
        </div>

        {/* Footer with Creator and CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              {(opportunity.creatorName || 'C').charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-700 truncate max-w-[130px]">
              <span className="truncate">{opportunity.creatorName || 'Production'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>

            {opportunity.applicantCount !== undefined && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 border-l border-slate-200 pl-2">
                <Users className="w-3 h-3" />
                <span>{opportunity.applicantCount}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold font-display text-emerald-600 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all">
            <span>Apply Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
