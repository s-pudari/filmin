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
      <div className="relative rounded-[28px] bg-white border border-slate-200/90 p-8 sm:p-10 overflow-hidden shadow-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-mono font-semibold">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audition & Application Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            My Submitted Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl">
            Real-time audit updates. Track director review progress from submission to shortlisting and acceptance.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="Explore open casting calls and production requirements to submit your first verified audition reel."
          icon={<FileCheck className="w-8 h-8 text-emerald-600" />}
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
                className="feed-card rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-300 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold font-display text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                      {app.opportunityRole || 'Role'}
                    </span>
                    <StatusBadge status={app.status} size="sm" />
                    <span className="text-[11px] font-mono text-slate-500">
                      {progress.label}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenOpportunity(app.opportunityId)}
                    className="text-lg font-bold font-display text-slate-900 hover:text-emerald-700 cursor-pointer transition flex items-center gap-2"
                  >
                    <span>{app.opportunityTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </h3>

                  {app.coverMessage && (
                    <p className="text-xs text-slate-600 italic font-sans line-clamp-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      "{app.coverMessage}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Applied: {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleOpenOpportunity(app.opportunityId)}
                    className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-display font-semibold text-slate-700 hover:text-emerald-800 transition flex items-center gap-2"
                  >
                    <span>View Role</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
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
