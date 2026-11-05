import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { ApiError, Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  PlusCircle,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  Film,
  Send,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface CreateOpportunityPageProps {
  onSuccess: (opportunityId: number) => void;
  onCancel: () => void;
}

export const CreateOpportunityPage: React.FC<CreateOpportunityPageProps> = ({
  onSuccess,
  onCancel
}) => {
  const { user, profile } = useAuth();
  const { showToast } = useNotification();

  const [title, setTitle] = useState('');
  const [opportunityType, setOpportunityType] = useState('FEATURE_FILM');
  const [roleNeeded, setRoleNeeded] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const todayStr = new Date().toISOString().split('T')[0];

  const roleSuggestions = [
    'Lead Actress',
    'Lead Actor',
    'Video Editor',
    'Cinematographer',
    'Camera Assistant',
    'Music Composer',
    'Sound Designer',
    'Screenwriter',
    'Colorist',
    'Production Designer'
  ];

  const formatOptions = [
    { label: 'Feature Film', value: 'FEATURE_FILM' },
    { label: 'Web Series / OTT', value: 'WEB_SERIES' },
    { label: 'Short Film', value: 'SHORT_FILM' },
    { label: 'Documentary', value: 'DOCUMENTARY' },
    { label: 'Commercial', value: 'COMMERCIAL' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = 'Title is required.';
    if (!roleNeeded.trim()) errors.roleNeeded = 'Role needed is required.';
    if (!location.trim()) errors.location = 'Location is required.';
    if (!deadline) errors.deadline = 'Deadline date is required.';
    else if (deadline < todayStr) errors.deadline = 'Deadline cannot be in the past.';
    if (!description.trim()) errors.description = 'Description is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast('Please correct the highlighted fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const created = await api.createOpportunity({
        title: title.trim(),
        opportunityType,
        roleNeeded: roleNeeded.trim(),
        location: location.trim(),
        deadline,
        description: description.trim()
      });

      showToast('Production opportunity published live!', 'success', 'Listing Active');
      onSuccess(created.id);
    } catch (err: any) {
      const apiErr = err as ApiError;
      if (apiErr.fieldErrors) {
        setFieldErrors(apiErr.fieldErrors);
      }
      showToast(apiErr.message || 'Failed to publish opportunity.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Virtual opportunity for real-time card preview
  const previewOpportunity: Opportunity = {
    id: 9999,
    creatorId: user?.id || 1,
    creatorName: profile?.displayName || user?.email.split('@')[0] || 'Your Production',
    title: title || 'Untitled Production Project',
    opportunityType,
    roleNeeded: roleNeeded || 'Key Role Needed',
    description: description || 'Detailed brief describing your project vision, shoot schedule, character traits, or editing requirements will appear here...',
    location: location || 'Production Location',
    deadline: deadline || '2026-11-30',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    applicantCount: 0
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CANCEL & RETURN</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Creator Publisher</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-card">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recruit Verified Cinema Talent</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            Publish a Production Requirement
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl">
            Post casting calls or crew requirements. Review candidate showreels and track candidate pipeline in real-time.
          </p>
        </div>
      </div>

      {/* Grid: Form on Left, Live Card Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="feed-card p-8 space-y-6 shadow-card">
            <h2 className="text-xl font-bold font-display text-slate-900 pb-3 border-b border-slate-100">
              Project Specifications
            </h2>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. The Silent Echo (Indie Psychological Thriller)"
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                  fieldErrors.title ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
              />
              {fieldErrors.title && (
                <p className="text-[11px] font-mono text-rose-600 mt-1">{fieldErrors.title}</p>
              )}
            </div>

            {/* Production Format */}
            <div>
              <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                Production Format *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {formatOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOpportunityType(opt.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-display font-semibold transition text-left ${
                      opportunityType === opt.value
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Needed */}
            <div>
              <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                Key Role / Craft Position *
              </label>
              <input
                type="text"
                value={roleNeeded}
                onChange={e => setRoleNeeded(e.target.value)}
                placeholder="e.g. Video Editor / Cinematographer / Lead Actress"
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                  fieldErrors.roleNeeded ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
              />
              {fieldErrors.roleNeeded && (
                <p className="text-[11px] font-mono text-rose-600 mt-1">{fieldErrors.roleNeeded}</p>
              )}

              {/* Quick Role Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">Quick Pick:</span>
                {roleSuggestions.slice(0, 6).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleNeeded(r)}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-emerald-700 transition"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                  Shoot Location / Region *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai / Bangalore / Hybrid"
                  className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                    fieldErrors.location ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                  }`}
                />
                {fieldErrors.location && (
                  <p className="text-[11px] font-mono text-rose-600 mt-1">{fieldErrors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                    fieldErrors.deadline ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                  }`}
                />
                {fieldErrors.deadline && (
                  <p className="text-[11px] font-mono text-rose-600 mt-1">{fieldErrors.deadline}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                Production Brief & Candidate Requirements *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                placeholder="Detail character specs, shooting dates, NLE / camera gear expectations, narrative themes, and compensation details..."
                className={`w-full bg-white border rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition font-sans ${
                  fieldErrors.description ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
              />
              {fieldErrors.description && (
                <p className="text-[11px] font-mono text-rose-600 mt-1">{fieldErrors.description}</p>
              )}
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
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
                  <span>Publishing Listing...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Listing Live</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Real-Time Applicant Preview</span>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            This is how your opportunity will appear to thousands of cinema professionals on the Explore feed.
          </p>

          <OpportunityCard
            opportunity={previewOpportunity}
            onSelect={() => {}}
          />

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant Discovery</span>
            </div>
            <p className="text-slate-600 font-sans text-xs">
              Once published, candidates with matching showreels will immediately receive visibility to apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
