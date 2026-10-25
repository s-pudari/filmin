import React, { useState, useEffect } from 'react';
import { Application, Opportunity, PortfolioLink } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Calendar,
  MessageSquare,
  Award
} from 'lucide-react';

interface ApplicantReviewPageProps {
  opportunityId: number;
  onBack: () => void;
}

export const ApplicantReviewPage: React.FC<ApplicantReviewPageProps> = ({
  opportunityId,
  onBack
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbiddenError, setForbiddenError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setForbiddenError(null);
    try {
      const opp = await api.getOpportunity(opportunityId);
      setOpportunity(opp);

      const apps = await api.getApplicationsForOpportunity(opportunityId);
      setApplications(apps);
    } catch (err: any) {
      if (err.code === 'FORBIDDEN' || err.code === 'HTTP_403') {
        setForbiddenError('Access Denied: Only the opportunity creator can review submissions for this project.');
      } else {
        showToast(err.message || 'Failed to load applicants.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [opportunityId, user]);

  const handleUpdateStatus = async (appId: number, newStatus: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED') => {
    if (newStatus === 'ACCEPTED' || newStatus === 'REJECTED') {
      const confirmed = window.confirm(
        `Are you sure you want to mark this applicant as ${newStatus}? Per production rules, this decision cannot be undone.`
      );
      if (!confirmed) return;
    }

    setUpdatingId(appId);
    try {
      await api.updateApplicationStatus(appId, newStatus);
      showToast(`Applicant status updated to ${newStatus}`, 'success');
      // Update local state
      setApplications(prev =>
        prev.map(a => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const parsePortfolioLinks = (linksStr?: string): PortfolioLink[] => {
    if (!linksStr) return [];
    try {
      const parsed = JSON.parse(linksStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // maybe raw URLs separated by newline or commas
      return linksStr.split('\n').filter(Boolean).map(u => ({ label: 'Portfolio Link', url: u.trim() }));
    }
    return [];
  };

  if (forbiddenError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-white">403 Forbidden · IDOR Protected</h2>
        <p className="text-sm text-slate-300 leading-relaxed">{forbiddenError}</p>
        <p className="text-xs text-slate-500">
          To review applicants, please switch to the creator account in the top Demo Bar.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-cinema-800 text-cinema-gold text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cinema-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Opportunities</span>
      </button>

      <div className="bg-cinema-900 border border-cinema-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-cinema-gold font-semibold mb-1">
            <Users className="w-4 h-4" />
            <span>Applicant Review Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-white">
            {opportunity?.title || 'Review Applicants'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Casting Role: <strong className="text-slate-200">{opportunity?.roleNeeded}</strong> ·{' '}
            {applications.length} Candidate Submissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {opportunity && <StatusBadge status={opportunity.status} />}
        </div>
      </div>

      {/* Applicant Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-cinema-900/40 rounded-2xl border border-cinema-800 animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications received yet"
          description="Candidates will appear here as soon as they discover your listing and apply."
          icon={<Users className="w-7 h-7 text-cinema-gold" />}
        />
      ) : (
        <div className="space-y-5">
          {applications.map(app => {
            const profile = app.applicantProfile;
            const portfolioLinks = parsePortfolioLinks(profile?.portfolioLinks);
            const isTerminal = app.status === 'ACCEPTED' || app.status === 'REJECTED';

            return (
              <div
                key={app.id}
                className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6 shadow-md space-y-4 transition hover:border-cinema-750"
              >
                {/* Applicant Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cinema-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cinema-gold to-amber-500 text-cinema-950 font-bold text-base flex items-center justify-center shadow">
                      {(app.applicantName || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{app.applicantName}</h3>
                        {profile?.primaryRole && (
                          <span className="px-2 py-0.5 rounded text-[11px] bg-cinema-800 text-cinema-gold font-medium">
                            {profile.primaryRole}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {profile?.location && <span>{profile.location} · </span>}
                        <span>{profile?.experienceYears ?? 0} years experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 hidden sm:inline">Status:</span>
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                {/* Cover Message */}
                {app.coverMessage && (
                  <div className="bg-cinema-850/80 rounded-xl p-3.5 border border-cinema-800 text-xs">
                    <div className="flex items-center gap-1.5 text-cinema-gold font-semibold mb-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Applicant Statement / Note:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{app.coverMessage}"
                    </p>
                  </div>
                )}

                {/* Profile Details & Skills */}
                {profile && (
                  <div className="text-xs space-y-2 text-slate-300">
                    {profile.bio && (
                      <p className="text-slate-400 leading-relaxed line-clamp-2">
                        <strong className="text-slate-300">Bio:</strong> {profile.bio}
                      </p>
                    )}

                    {profile.skills && (
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="text-slate-500 font-semibold">Skills & Equipment:</span>
                        {profile.skills.split(',').map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-cinema-800 text-slate-300 border border-cinema-750 text-[11px]"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Portfolio URLs */}
                {portfolioLinks.length > 0 && (
                  <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-slate-500 font-semibold">Verified Links:</span>
                    {portfolioLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cinema-800/80 hover:bg-cinema-750 text-cinema-gold border border-cinema-700/60 transition"
                      >
                        <span>{link.label || link.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Decision Action Toolbar */}
                <div className="pt-4 border-t border-cinema-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Applied on {new Date(app.submittedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isTerminal ? (
                      <span className="text-slate-500 italic text-[11px]">
                        Terminal decision reached ({app.status})
                      </span>
                    ) : (
                      <>
                        {app.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                            disabled={updatingId === app.id}
                            className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 text-amber-300 font-semibold transition"
                          >
                            Shortlist
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                          disabled={updatingId === app.id}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          disabled={updatingId === app.id}
                          className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 font-semibold transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
