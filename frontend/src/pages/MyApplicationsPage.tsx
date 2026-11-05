import React, { useState, useEffect } from 'react';
import { Application, Opportunity } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  FileCheck,
  ArrowRight,
  Calendar,
  Clapperboard,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface MyApplicationsPageProps {
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onNavigateToExplore: () => void;
}

export const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({
  onSelectOpportunity,
  onNavigateToExplore
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getMyApplications();
      setApplications(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load your applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, [user]);

  const handleOpenOpportunity = async (oppId: number) => {
    try {
      const opp = await api.getOpportunity(oppId);
      onSelectOpportunity(opp);
    } catch (err: any) {
      showToast(err.message || 'Could not load opportunity.', 'error');
    }
  };

  // Helper for progress percentage
  const getProgressState = (status: string) => {
    if (status === 'SUBMITTED') return { step: 1, label: 'Submitted & In Queue' };
    if (status === 'SHORTLISTED') return { step: 2, label: 'Shortlisted by Director' };
    if (status === 'ACCEPTED') return { step: 3, label: 'Accepted for Production' };
    if (status === 'REJECTED') return { step: 3, label: 'Decision Concluded' };
    return { step: 1, label: 'Submitted' };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-[32px] bg-gradient-to-r from-[#11131e] via-[#0c0d15] to-[#07080d] border border-white/[0.1] p-8 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Audition & Application Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            My Submitted Applications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl">
            Real-time audit updates. Track director review progress from submission to shortlisting and acceptance.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/[0.02] rounded-3xl border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="Explore open casting calls and production requirements to submit your first verified audition reel."
          icon={<FileCheck className="w-8 h-8 text-amber-400" />}
          action={{
            label: "Explore Castings & Roles",
            onClick: onNavigateToExplore
          }}
        />
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const progress = getProgressState(app.status);

            return (
              <div
                key={app.id}
                className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold font-display text-amber-400 bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/20">
                      {app.opportunityRole || 'Role'}
                    </span>
                    <StatusBadge status={app.status} size="sm" />
                    <span className="text-[11px] font-mono text-zinc-500">
                      {progress.label}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenOpportunity(app.opportunityId)}
                    className="text-lg font-bold font-display text-white hover:text-amber-300 cursor-pointer transition flex items-center gap-2"
                  >
                    <span>{app.opportunityTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  </h3>

                  {app.coverMessage && (
                    <p className="text-xs text-zinc-400 italic font-sans line-clamp-1 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                      "{app.coverMessage}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Applied: {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                  <button
                    onClick={() => handleOpenOpportunity(app.opportunityId)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs font-display font-semibold text-white transition flex items-center gap-2"
                  >
                    <span>View Role</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
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
