import React, { useState } from 'react';
import { Opportunity, ApiError } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { X, Send, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';

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
      showToast('Your application was submitted successfully!', 'success', 'Application Sent');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-cinema-900 border border-cinema-750 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cinema-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold font-serif text-white mb-1">
          Apply for {opportunity.roleNeeded}
        </h3>
        <p className="text-sm text-slate-400 mb-6 truncate">
          Project: <strong className="text-slate-200">{opportunity.title}</strong>
        </p>

        {isCreator ? (
          <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-200 text-sm flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Self-Application Not Permitted</p>
              <p className="text-xs text-amber-300">
                You created this opportunity listing. As the producer/director, you review applications rather than apply.
              </p>
            </div>
          </div>
        ) : isProfileIncomplete ? (
          <div className="p-4 rounded-xl bg-sky-950/60 border border-sky-800/60 text-sky-200 text-sm flex items-start gap-3 mb-4">
            <UserCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Profile Completion Required</p>
              <p className="text-xs text-sky-300 mb-3">
                Directors review your verified profile (roles, skills, portfolio links) when evaluating submissions.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToProfile();
                }}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition"
              >
                Complete Profile Now
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Applicant Profile preview card */}
            <div className="p-3.5 rounded-xl bg-cinema-850 border border-cinema-800 text-xs">
              <div className="text-slate-400 mb-1">Applying as:</div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">{profile?.displayName}</span>
                  <span className="text-cinema-gold ml-2">({profile?.primaryRole})</span>
                </div>
                <span className="text-slate-400">{profile?.experienceYears} yrs exp</span>
              </div>
              {profile?.skills && (
                <div className="text-slate-400 mt-1 truncate">
                  <span className="text-slate-500">Skills:</span> {profile.skills}
                </div>
              )}
            </div>

            {/* Cover message */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cover Message / Statement of Interest <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                value={coverMessage}
                onChange={e => setCoverMessage(e.target.value)}
                placeholder="Highlight relevant projects, reel links, or why you're passionate about this script..."
                rows={4}
                maxLength={2000}
                className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none"
              />
              <div className="text-right text-[11px] text-slate-500 mt-1">
                {coverMessage.length} / 2000
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-cinema-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cinema-gold hover:bg-amber-400 text-cinema-950 transition flex items-center gap-1.5 shadow-md shadow-amber-950/30 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
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
