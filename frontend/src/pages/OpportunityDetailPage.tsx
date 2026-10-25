import React, { useState, useEffect } from 'react';
import { Opportunity } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ApplyModal } from '../components/ApplyModal';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Film,
  User,
  Users,
  Send,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface OpportunityDetailPageProps {
  opportunityId: number;
  onBack: () => void;
  onNavigateToReview: (oppId: number) => void;
  onNavigateToProfile: () => void;
  onNavigateToLogin: () => void;
}

export const OpportunityDetailPage: React.FC<OpportunityDetailPageProps> = ({
  opportunityId,
  onBack,
  onNavigateToReview,
  onNavigateToProfile,
  onNavigateToLogin
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await api.getOpportunity(opportunityId);
      setOpportunity(data);

      if (user) {
        // Check if user already applied
        try {
          const myApps = await api.getMyApplications();
          setHasApplied(myApps.some(a => a.opportunityId === opportunityId));
        } catch {}
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load opportunity details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [opportunityId, user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-cinema-850 rounded" />
        <div className="h-10 w-3/4 bg-cinema-850 rounded" />
        <div className="h-64 bg-cinema-900 rounded-2xl" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Opportunity Not Found</h2>
        <p className="text-sm text-slate-400">The listing may have been removed or does not exist.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-cinema-800 text-cinema-gold text-sm font-semibold"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const isCreator = user?.id === opportunity.creatorId;
  const isExpired = new Date(opportunity.deadline).getTime() < new Date().setHours(0, 0, 0, 0);
  const isClosed = opportunity.status === 'CLOSED' || isExpired;

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back CTA */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cinema-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Opportunities</span>
      </button>

      {/* Main Listing Header */}
      <div className="bg-cinema-900 border border-cinema-800 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cinema-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-cinema-800 text-cinema-gold border border-cinema-700/60">
              Role: {opportunity.roleNeeded}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-cinema-850 text-slate-300 border border-cinema-750">
              {formatType(opportunity.opportunityType)}
            </span>
          </div>
          <StatusBadge status={isExpired ? 'CLOSED' : opportunity.status} />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white mb-4 leading-tight">
          {opportunity.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 my-4 border-y border-cinema-800/80 text-sm">
          <div className="flex items-center gap-2.5 text-slate-300">
            <MapPin className="w-4 h-4 text-cinema-gold" />
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Location</div>
              <div className="font-semibold">{opportunity.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <Calendar className="w-4 h-4 text-cinema-gold" />
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Deadline</div>
              <div className={`font-semibold ${isExpired ? 'text-rose-400' : ''}`}>
                {opportunity.deadline}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <User className="w-4 h-4 text-cinema-gold" />
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Published By</div>
              <div className="font-semibold truncate">{opportunity.creatorName || 'Production House'}</div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="w-4 h-4 text-slate-500" />
            <span>
              {opportunity.applicantCount !== undefined
                ? `${opportunity.applicantCount} applicants submitted so far`
                : 'Applications being accepted'}
            </span>
          </div>

          <div>
            {isCreator ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToReview(opportunity.id)}
                  className="px-5 py-2.5 rounded-xl bg-cinema-gold hover:bg-amber-400 text-cinema-950 font-bold text-xs transition flex items-center gap-2 shadow-md shadow-amber-950/30"
                >
                  <Users className="w-4 h-4" />
                  <span>Review Applicants ({opportunity.applicantCount || 0})</span>
                </button>
              </div>
            ) : hasApplied ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You have applied to this opportunity</span>
              </div>
            ) : isClosed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cinema-800 text-slate-400 text-xs font-semibold">
                <Clock className="w-4 h-4" />
                <span>Applications Closed</span>
              </div>
            ) : !user ? (
              <button
                onClick={onNavigateToLogin}
                className="px-6 py-2.5 rounded-xl bg-cinema-gold hover:bg-amber-400 text-cinema-950 font-bold text-xs transition shadow-md shadow-amber-950/30 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Sign in to Apply</span>
              </button>
            ) : (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cinema-gold hover:brightness-110 text-cinema-950 font-bold text-xs transition shadow-lg shadow-amber-950/40 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply for this Role</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-cinema-900/60 border border-cinema-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold font-serif text-white">Project Synopsis & Character/Role Scope</h2>
        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line">
          {opportunity.description}
        </div>
      </div>

      {/* Safety & Anti-Scam Notice */}
      <div className="bg-cinema-950 border border-cinema-850 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Filmin Verified Workflow:</strong> Applications are delivered
          directly into the director's applicant review portal. Never pay registration fees or share sensitive banking
          information for casting calls.
        </div>
      </div>

      {/* Apply Modal */}
      {opportunity && (
        <ApplyModal
          opportunity={opportunity}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            setHasApplied(true);
            fetchDetail();
          }}
          onNavigateToProfile={onNavigateToProfile}
        />
      )}
    </div>
  );
};
