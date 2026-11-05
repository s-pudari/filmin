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
  Award,
  Video,
  Sparkles,
  MapPin,
  CheckCircle2
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
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

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
        setForbiddenError('Security Notice: Only the verified creator of this opportunity can review candidate submissions.');
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
        `Are you sure you want to mark this applicant as ${newStatus}? Per production rules, this decision finalizes their application.`
      );
      if (!confirmed) return;
    }

    setUpdatingId(appId);
    try {
      await api.updateApplicationStatus(appId, newStatus);
      showToast(`Applicant status successfully updated to ${newStatus}`, 'success');
      await fetchApplications();
    } catch (err: any) {
      showToast(err.message || 'Failed to update applicant status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const parseLinks = (linksRaw?: string): PortfolioLink[] => {
    if (!linksRaw) return [];
    try {
      const parsed = JSON.parse(linksRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO MY CREATED OPPORTUNITIES</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Director Candidate Pipeline</span>
        </div>
      </div>

      {forbiddenError ? (
        <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 max-w-xl mx-auto text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-xl font-bold font-display text-slate-900">IDOR Privacy Protection Active</h2>
          <p className="text-xs text-rose-700 font-sans leading-relaxed">{forbiddenError}</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl btn-brand text-xs font-bold font-display uppercase tracking-wider"
          >
            Return to Safety
          </button>
        </div>
      ) : (
        <>
          {/* Header Banner */}
          <div className="relative rounded-2xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-card">
            <div className="relative z-10 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-display bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Role: {opportunity?.roleNeeded}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                  {opportunity?.opportunityType.replace(/_/g, ' ')}
                </span>
                {opportunity && <StatusBadge status={opportunity.status} size="sm" />}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
                Review Applicants: {opportunity?.title}
              </h1>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-2">
                <span>Total Applications: <strong className="text-slate-900">{applications.length}</strong></span>
                <span>•</span>
                <span>Location: {opportunity?.location}</span>
              </div>
            </div>
          </div>

          {/* Status Pipeline Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['ALL', 'SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map(st => {
              const count = st === 'ALL' ? applications.length : applications.filter(a => a.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-display font-semibold transition flex items-center gap-2 ${
                    statusFilter === st
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <span>{st === 'ALL' ? 'All Applicants' : st}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${statusFilter === st ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submissions List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <EmptyState
              title={`No applicants found in "${statusFilter}" state`}
              description="Candidates who apply for this casting call will appear in your pipeline with full portfolio access."
              icon={<Users className="w-8 h-8 text-emerald-600" />}
            />
          ) : (
            <div className="space-y-5">
              {filteredApplications.map(app => {
                const links = parseLinks(app.applicantProfile?.portfolioLinks);
                const isFinal = app.status === 'ACCEPTED' || app.status === 'REJECTED';

                return (
                  <div
                    key={app.id}
                    className="feed-card p-7 space-y-5 shadow-card"
                  >
                    {/* Top Row: Applicant Info & Current Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-base shadow-xs">
                          {(app.applicantName || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold font-display text-slate-900">
                              {app.applicantName || `Applicant #${app.applicantId}`}
                            </h3>
                            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                              {app.applicantProfile?.primaryRole || 'Candidate'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mt-1">
                            {app.applicantProfile?.experienceYears !== undefined && (
                              <span>{app.applicantProfile.experienceYears} Years Experience</span>
                            )}
                            {app.applicantProfile?.location && (
                              <>
                                <span>•</span>
                                <span>{app.applicantProfile.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={app.status} />
                      </div>
                    </div>

                    {/* Bio & Skills */}
                    {app.applicantProfile && (
                      <div className="space-y-3 text-xs">
                        {app.applicantProfile.bio && (
                          <p className="text-slate-700 font-sans leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            "{app.applicantProfile.bio}"
                          </p>
                        )}
                        {app.applicantProfile.skills && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-slate-400 uppercase text-[10px]">Skills:</span>
                            {app.applicantProfile.skills.split(',').map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Audition Note / Cover Message */}
                    {app.coverMessage && (
                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-700 font-sans">
                        <div className="font-display font-bold text-emerald-800 text-xs mb-1 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Candidate's Audition Note:</span>
                        </div>
                        <p className="leading-relaxed">{app.coverMessage}</p>
                      </div>
                    )}

                    {/* Showreel / Portfolio Links */}
                    {links.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified Showreel Proofs</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between gap-2 text-xs font-mono text-slate-700 hover:text-emerald-700 transition"
                            >
                              <span className="truncate font-semibold">{link.label}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] font-mono text-slate-400">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">
                        {app.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                            disabled={updatingId === app.id}
                            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-display font-semibold transition"
                          >
                            Mark Shortlisted
                          </button>
                        )}

                        {!isFinal && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                              disabled={updatingId === app.id}
                              className="px-4 py-2 rounded-xl btn-brand text-xs font-display font-bold transition flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Accept Candidate</span>
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                              disabled={updatingId === app.id}
                              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-display font-semibold transition flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        {isFinal && (
                          <span className="text-xs font-mono text-slate-400 italic">
                            Decision Finalized
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
