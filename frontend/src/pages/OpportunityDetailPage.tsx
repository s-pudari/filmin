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
  CheckCircle2,
  Sparkles,
  Clapperboard,
  Video,
  Award,
  ChevronRight
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
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-white/[0.05] rounded-xl" />
        <div className="h-12 w-3/4 bg-white/[0.05] rounded-2xl" />
        <div className="h-80 bg-white/[0.02] rounded-3xl border border-white/[0.05]" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
          <Film className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Production Listing Not Found</h2>
        <p className="text-sm text-zinc-400">The listing may have been completed, closed, or removed.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider"
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL CASTINGS & CREW</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={isExpired ? 'CLOSED' : opportunity.status} />
        </div>
      </div>

      {/* Hero Header Box */}
      <div className="relative rounded-[32px] bg-gradient-to-b from-[#11131e] via-[#0c0d15] to-[#07080d] border border-white/[0.1] p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold font-display bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Role: {opportunity.roleNeeded}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] text-zinc-300 border border-white/10">
              {formatType(opportunity.opportunityType)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] text-zinc-300 border border-white/10 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{opportunity.location}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            {opportunity.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Submission Deadline: <strong className="text-white">{opportunity.deadline}</strong></span>
            </div>
            {opportunity.applicantCount !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">{opportunity.applicantCount}</strong> Auditions Submitted</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Production Requirement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Specs (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Production Brief Card */}
          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              <Clapperboard className="w-4 h-4" />
              <span>Production Brief & Role Context</span>
            </div>
            <h2 className="text-xl font-bold font-display text-white">About the Project</h2>
            <div className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
              {opportunity.description}
            </div>
          </div>

          {/* Key Evaluation Criteria */}
          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Director Evaluation Criteria</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">What the Director is Looking For</h3>
            <ul className="space-y-3 text-sm text-zinc-300 font-sans">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Verified proof-of-work reels and previous credits matching the narrative tone.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Availability on-location in {opportunity.location} during active shooting schedule.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Strong collaborative communication and responsiveness in review rounds.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Director Card & Action Box */}
        <div className="space-y-6">
          {/* Sticky Action Card */}
          <div className="glass-card rounded-3xl p-7 space-y-6 sticky top-28 border border-white/10">
            {/* Creator / Director Profile */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-white/[0.08]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-extrabold text-lg shadow-md">
                {(opportunity.creatorName || 'D').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">Published By</div>
                <div className="text-base font-bold font-display text-white flex items-center gap-1.5">
                  <span>{opportunity.creatorName || 'Production Director'}</span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs text-zinc-400">Director / Showrunner</div>
              </div>
            </div>

            {/* Application State Logic */}
            <div className="space-y-4">
              {isClosed ? (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-center text-xs space-y-1">
                  <div className="font-bold text-white font-display">Submissions Closed</div>
                  <p>The deadline for this production has concluded or submissions were finalized.</p>
                </div>
              ) : isCreator ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    <p className="font-bold font-display text-white mb-1">Director Control Hub</p>
                    <p className="font-sans leading-relaxed">
                      You are the producer of this call. Review candidate showreels and track candidate pipeline.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToReview(opportunity.id)}
                    className="w-full py-3.5 rounded-2xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Review Applicants ({opportunity.applicantCount || 0})</span>
                  </button>
                </div>
              ) : hasApplied ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <div className="font-bold font-display text-white text-sm">Application Active</div>
                  <p className="text-xs text-emerald-300 font-sans">
                    You have successfully applied for this role. You can track director review progress in My Applications.
                  </p>
                </div>
              ) : user ? (
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full py-4 rounded-2xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Apply for {opportunity.roleNeeded}</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={onNavigateToLogin}
                    className="w-full py-4 rounded-2xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider text-center"
                  >
                    Sign In to Apply
                  </button>
                  <p className="text-[11px] font-mono text-zinc-500 text-center">
                    Requires a verified Filmin profile with showreel links.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Safety / Privacy Note */}
            <div className="pt-4 border-t border-white/[0.08] text-[11px] font-mono text-zinc-500 space-y-1">
              <div>🔒 IDOR Protected Platform</div>
              <div>⚡ Direct candidate-to-creator communication</div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
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
    </div>
  );
};
