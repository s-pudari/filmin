import React, { useState, useEffect } from 'react';
import { Opportunity } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  Briefcase,
  Users,
  PlusCircle,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Clapperboard,
  ArrowRight
} from 'lucide-react';

interface MyOpportunitiesPageProps {
  onNavigateToPost: () => void;
  onNavigateToReview: (oppId: number) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const MyOpportunitiesPage: React.FC<MyOpportunitiesPageProps> = ({
  onNavigateToPost,
  onNavigateToReview,
  onSelectOpportunity
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOpportunities = async () => {
    setLoading(true);
    try {
      const data = await api.getMyOpportunities();
      setOpportunities(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load your opportunities.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOpportunities();
  }, [user]);

  const toggleStatus = async (opp: Opportunity) => {
    const nextStatus = opp.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await api.updateOpportunityStatus(opp.id, nextStatus);
      showToast(`Listing status updated to ${nextStatus}`, 'success');
      fetchMyOpportunities();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status.', 'error');
    }
  };

  const totalApplicants = opportunities.reduce((acc, curr) => acc + (curr.applicantCount || 0), 0);
  const activeCount = opportunities.filter(o => o.status === 'OPEN').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Stats */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-card">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Director & Producer Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              My Created Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl">
              Manage your casting calls, monitor candidate submissions, and review portfolios in your pipeline.
            </p>
          </div>

          <button
            onClick={onNavigateToPost}
            className="px-6 py-3 rounded-xl btn-brand text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl font-extrabold font-display text-slate-900">{opportunities.length}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Total Listings</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl font-extrabold font-display text-emerald-600">{activeCount}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Open For Auditions</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl font-extrabold font-display text-emerald-600">{totalApplicants}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Total Applications</div>
          </div>
        </div>
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities created yet"
          description="Publish your first casting call or crew requirement to start receiving candidate showreels and applications."
          icon={<Briefcase className="w-8 h-8 text-emerald-600" />}
          action={{
            label: "Create First Opportunity",
            onClick: onNavigateToPost
          }}
        />
      ) : (
        <div className="space-y-4">
          {opportunities.map(opp => {
            const isExpired = new Date(opp.deadline).getTime() < new Date().setHours(0, 0, 0, 0);

            return (
              <div
                key={opp.id}
                className="feed-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all shadow-card"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold font-display bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {opp.roleNeeded}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                      {opp.opportunityType.replace(/_/g, ' ')}
                    </span>
                    <StatusBadge status={isExpired ? 'CLOSED' : opp.status} size="sm" />
                  </div>

                  <h3
                    onClick={() => onSelectOpportunity(opp)}
                    className="text-lg font-bold font-display text-slate-900 hover:text-emerald-700 cursor-pointer transition"
                  >
                    {opp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {opp.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: {opp.deadline}
                    </span>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Status toggle */}
                  <button
                    onClick={() => toggleStatus(opp)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono transition flex items-center gap-2 border border-slate-200"
                  >
                    {opp.status === 'OPEN' ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500">Closed</span>
                      </>
                    )}
                  </button>

                  {/* Review Applicants CTA */}
                  <button
                    onClick={() => onNavigateToReview(opp.id)}
                    className="px-5 py-2.5 rounded-xl btn-brand text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 shadow-xs"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Review Applicants</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-[10px] font-mono text-white">
                      {opp.applicantCount || 0}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
