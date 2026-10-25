import React from 'react';
import { Opportunity } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, Users, Clapperboard, ArrowRight } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect }) => {
  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const isExpired = new Date(opportunity.deadline).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="group bg-cinema-900/70 hover:bg-cinema-850/90 border border-cinema-800 hover:border-cinema-gold/50 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-lg shadow-black/20 hover:shadow-cinema-gold/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cinema-gold/5 rounded-full blur-2xl group-hover:bg-cinema-gold/10 transition-all pointer-events-none" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-cinema-800 text-cinema-gold border border-cinema-700/60">
              {opportunity.roleNeeded}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-cinema-850 text-slate-300 border border-cinema-750">
              {formatType(opportunity.opportunityType)}
            </span>
          </div>
          <StatusBadge status={isExpired ? 'CLOSED' : opportunity.status} size="sm" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-cinema-gold transition-colors leading-snug mb-2 font-serif">
          {opportunity.title}
        </h3>

        {/* Description snippet */}
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {opportunity.description}
        </p>
      </div>

      <div>
        {/* Meta details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 py-3 border-t border-cinema-800/80 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className={isExpired ? 'text-rose-400 font-medium' : ''}>
              Deadline: {opportunity.deadline}
            </span>
          </div>
        </div>

        {/* Footer with Creator and CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-5 h-5 rounded-full bg-cinema-800 border border-cinema-700 flex items-center justify-center text-[10px] text-cinema-gold font-bold">
              {(opportunity.creatorName || 'C').charAt(0).toUpperCase()}
            </div>
            <span className="truncate max-w-[120px]">{opportunity.creatorName || 'Production'}</span>
            {opportunity.applicantCount !== undefined && (
              <span className="flex items-center gap-1 text-slate-500 border-l border-cinema-800 pl-2">
                <Users className="w-3 h-3" />
                <span>{opportunity.applicantCount}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-cinema-gold group-hover:translate-x-0.5 transition-transform">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
