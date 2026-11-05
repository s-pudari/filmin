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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#0b0c13] border border-white/[0.12] rounded-3xl max-w-lg w-full p-7 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top edge light */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-semibold mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Audition & Submission</span>
          </div>
          <h3 className="text-2xl font-extrabold font-display text-white mb-1">
            Apply for {opportunity.roleNeeded}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 truncate">
            Production: <strong className="text-zinc-200">{opportunity.title}</strong>
          </p>
        </div>

        {isCreator ? (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3.5 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-1 font-display">Creator Rule Active</p>
              <p className="text-xs text-amber-300 leading-relaxed font-sans">
                You created this production listing. As the director/producer, you review applicant submissions rather than applying to your own call.
              </p>
            </div>
          </div>
        ) : isProfileIncomplete ? (
          <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm flex items-start gap-3.5 mb-4">
            <UserCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-1 font-display">Profile Verification Required</p>
              <p className="text-xs text-cyan-300 leading-relaxed font-sans mb-3">
                Directors evaluate verified portfolios (showreel links, IMDb credits, experience years) when reviewing applicants.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToProfile();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-display text-xs transition"
              >
                Complete Profile Showreel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Applicant Profile Card Preview */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold text-xs shadow-sm">
                  {profile?.displayName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white font-display text-sm">{profile?.displayName}</div>
                  <div className="text-[11px] font-mono text-zinc-400">
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
                className="text-amber-400 hover:text-amber-300 text-xs font-mono underline"
              >
                Edit Reel
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold font-display text-zinc-300">
                  Audition Note / Cover Message
                </label>
                <span className="text-[11px] font-mono text-zinc-500">
                  {coverMessage.length}/500
                </span>
              </div>
              <textarea
                value={coverMessage}
                onChange={e => setCoverMessage(e.target.value.slice(0, 500))}
                rows={4}
                placeholder="Describe your fit for this role, relevant projects, showreel timestamps, or scheduling availability..."
                className="w-full bg-[#07080c] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition resize-none font-sans"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-display font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
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
