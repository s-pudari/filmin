import React, { useState, useEffect } from 'react';
import { Opportunity } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { Briefcase, Users, PlusCircle, ExternalLink, ToggleLeft, ToggleRight, Calendar, MapPin } from 'lucide-react';

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
      showToast(`Listing marked as ${nextStatus}`, 'success');
      fetchMyOpportunities();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status.', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cinema-800">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white">My Created Opportunities</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your project listings, track candidate submissions, and review applicant reels
          </p>
        </div>
        <button
          onClick={onNavigateToPost}
          className="px-4 py-2.5 rounded-xl bg-cinema-gold hover:bg-amber-400 text-cinema-950 font-bold text-xs transition flex items-center gap-2 shadow-md shadow-amber-950/30 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-cinema-900/40 rounded-2xl border border-cinema-800 animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="You haven't posted any opportunities yet"
          description="Post casting calls or crew requirements to begin receiving applications from actors, cinematographers, and editors."
          icon={<Briefcase className="w-7 h-7 text-cinema-gold" />}
          action={{
            label: "Create First Opportunity",
            onClick: onNavigateToPost
          }}
        />
      ) : (
        <div className="space-y-4">
          {opportunities.map(opp => (
            <div
              key={opp.id}
              className="bg-cinema-900 border border-cinema-800 hover:border-cinema-700/80 rounded-2xl p-6 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cinema-800 text-cinema-gold border border-cinema-700/60">
                    {opp.roleNeeded}
                  </span>
                  <StatusBadge status={opp.status} size="sm" />
                  <span className="text-xs text-slate-400 border-l border-cinema-800 pl-2">
                    {opp.opportunityType.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3
                  onClick={() => onSelectOpportunity(opp)}
                  className="text-lg font-bold text-white hover:text-cinema-gold cursor-pointer transition font-serif"
                >
                  {opp.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {opp.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Deadline: {opp.deadline}
                  </span>
                </div>
              </div>

              {/* Actions & Applicant Counter */}
              <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-cinema-800 shrink-0">
                <button
                  onClick={() => onNavigateToReview(opp.id)}
                  className="px-4 py-2 rounded-xl bg-cinema-gold/15 hover:bg-cinema-gold/25 border border-cinema-gold/30 text-cinema-gold font-bold text-xs transition flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Review Applicants ({opp.applicantCount || 0})</span>
                </button>

                <button
                  onClick={() => toggleStatus(opp)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 ${
                    opp.status === 'OPEN'
                      ? 'border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-950/60'
                      : 'border-emerald-900/60 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/60'
                  }`}
                  title={opp.status === 'OPEN' ? 'Close applications' : 'Reopen applications'}
                >
                  {opp.status === 'OPEN' ? 'Close' : 'Reopen'}
                </button>

                <button
                  onClick={() => onSelectOpportunity(opp)}
                  className="p-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-cinema-750 text-slate-300 hover:text-white transition"
                  title="View Public Listing"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
