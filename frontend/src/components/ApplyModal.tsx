import React, { useState } from 'react';
import { Opportunity, ApiError } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { X, Send, AlertCircle, CheckCircle2, UserCheck, Sparkles, ExternalLink } from 'lucide-react';

interface ApplyModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateToProfile: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onSuccess,
  onNavigateToProfile
}) => {
  const { user, profile } = useAuth();
  const { showToast } = useNotification();
  const [coverMessage, setCoverMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isCreator = user?.id === opportunity.creatorId;
  const isProfileIncomplete = !profile?.displayName || !profile?.primaryRole;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.submitApplication(opportunity.id, coverMessage);
      showToast('Your audition / application was submitted successfully!', 'success', 'Application Sent');
      onSuccess();
      onClose();
    } catch (err: any) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Failed to submit application.');
      showToast(apiErr.message || 'Submission failed.', 'error', apiErr.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-7 sm:p-8 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audition & Submission</span>
          </div>
          <h3 className="text-2xl font-extrabold font-display text-slate-900 mb-1">
            Apply for {opportunity.roleNeeded}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 truncate">
            Production: <strong className="text-slate-800">{opportunity.title}</strong>
          </p>
        </div>

        {isCreator ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1 font-display">Creator Rule Active</p>
              <p className="text-xs text-amber-700 leading-relaxed font-sans">
                You created this production listing. As the director/producer, you review applicant submissions rather than applying to your own call.
              </p>
            </div>
          </div>
        ) : isProfileIncomplete ? (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm flex items-start gap-3 mb-4">
            <UserCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1 font-display">Profile Verification Required</p>
              <p className="text-xs text-blue-700 leading-relaxed font-sans mb-3">
                Directors evaluate verified portfolios (showreel links, IMDb credits, experience years) when reviewing applicants.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToProfile();
                }}
                className="px-4 py-2 rounded-xl btn-brand text-xs font-semibold"
              >
                Complete Profile Showreel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Applicant Profile Card Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {profile?.displayName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 font-display text-sm">{profile?.displayName}</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {profile?.primaryRole} · {profile?.experienceYears || 0} yrs exp
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToProfile();
                }}
                className="text-emerald-700 hover:text-emerald-800 text-xs font-mono font-semibold underline"
              >
                Edit Reel
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold font-display text-slate-700">
                  Audition Note / Cover Message
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {coverMessage.length}/500
                </span>
              </div>
              <textarea
                value={coverMessage}
                onChange={e => setCoverMessage(e.target.value.slice(0, 500))}
                rows={4}
                placeholder="Describe your fit for this role, relevant projects, showreel timestamps, or scheduling availability..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition resize-none font-sans"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-display font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl btn-brand text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Submission</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
