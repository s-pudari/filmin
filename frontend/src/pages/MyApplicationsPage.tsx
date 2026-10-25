import React, { useState, useEffect } from 'react';
import { Application, Opportunity } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { FileCheck, ArrowRight, Calendar, Clapperboard, ExternalLink } from 'lucide-react';

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-cinema-800">
        <h1 className="text-2xl font-bold font-serif text-white">My Submitted Applications</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track real-time review progress and audition statuses for roles you've applied to
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-cinema-900/40 rounded-2xl border border-cinema-800 animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="Explore open casting calls and production requirements to submit your first application."
          icon={<FileCheck className="w-7 h-7 text-cinema-gold" />}
          action={{
            label: "Explore Opportunities",
            onClick: onNavigateToExplore
          }}
        />
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div
              key={app.id}
              className="bg-cinema-900 border border-cinema-800 hover:border-cinema-750 rounded-2xl p-6 shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cinema-gold font-bold bg-cinema-850 px-2.5 py-0.5 rounded border border-cinema-750">
                    {app.opportunityRole || 'Role'}
                  </span>
                  <StatusBadge status={app.status} size="sm" />
                </div>

                <h3
                  onClick={() => handleOpenOpportunity(app.opportunityId)}
                  className="text-base font-bold text-white hover:text-cinema-gold cursor-pointer transition font-serif"
                >
                  {app.opportunityTitle}
                </h3>

                {app.coverMessage && (
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    "{app.coverMessage}"
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Submitted on {new Date(app.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 md:pt-0 border-t md:border-t-0 border-cinema-800 shrink-0">
                <button
                  onClick={() => handleOpenOpportunity(app.opportunityId)}
                  className="px-4 py-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-cinema-700/80 text-cinema-gold font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <span>View Opportunity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
