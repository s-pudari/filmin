import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { PortfolioLink, ApiError } from '../types';
import {
  User,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  ShieldCheck,
  CheckCircle2,
  Film,
  Video,
  Award,
  Sparkles,
  Link as LinkIcon,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useNotification();

  const [displayName, setDisplayName] = useState('');
  const [primaryRole, setPrimaryRole] = useState('Video Editor');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLink[]>([]);

  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPrimaryRole(profile.primaryRole || 'Video Editor');
      setSkills(profile.skills || '');
      setLocation(profile.location || '');
      setBio(profile.bio || '');
      setExperienceYears(profile.experienceYears ?? 0);

      try {
        const parsed = JSON.parse(profile.portfolioLinks);
        if (Array.isArray(parsed)) setPortfolioLinks(parsed);
      } catch {
        setPortfolioLinks([]);
      }
    } else if (user) {
      setDisplayName(user.email.split('@')[0]);
    }
  }, [profile, user]);

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    try {
      const validUrl = new URL(newLinkUrl.trim());
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        showToast('Link must begin with http:// or https://', 'warning');
        return;
      }
    } catch {
      showToast('Please provide a valid URL (e.g. https://vimeo.com/...)', 'warning');
      return;
    }

    setPortfolioLinks(prev => [
      ...prev,
      { label: newLinkLabel.trim() || 'Showreel / Proof-of-Work', url: newLinkUrl.trim() }
    ]);
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (idx: number) => {
    setPortfolioLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!displayName.trim()) errors.displayName = 'Display name is required.';
    if (!primaryRole.trim()) errors.primaryRole = 'Primary role is required.';
    if (experienceYears < 0) errors.experienceYears = 'Experience years cannot be negative.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast('Please correct the highlighted fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.updateMyProfile({
        displayName: displayName.trim(),
        primaryRole: primaryRole.trim(),
        skills: skills.trim(),
        location: location.trim(),
        bio: bio.trim(),
        experienceYears: Number(experienceYears),
        portfolioLinks: JSON.stringify(portfolioLinks)
      });

      await refreshProfile();
      showToast('Creator profile updated successfully!', 'success', 'Profile Saved');
    } catch (err: any) {
      const apiErr = err as ApiError;
      if (apiErr.fieldErrors) {
        setFieldErrors(apiErr.fieldErrors);
      }
      showToast(apiErr.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format platform badge
  const getPlatformIcon = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes('youtube')) return 'YouTube Reel';
    if (u.includes('vimeo')) return 'Vimeo Cut';
    if (u.includes('imdb')) return 'IMDb Verified';
    if (u.includes('fueler')) return 'Fueler Proof';
    if (u.includes('behance')) return 'Behance Portfolio';
    if (u.includes('drive.google')) return 'Google Drive Media';
    return 'External Reel';
  };

  const roleOptions = [
    'Video Editor',
    'Cinematographer',
    'Lead Actress',
    'Lead Actor',
    'Feature Director',
    'Screenwriter',
    'Sound Designer',
    'Music Composer',
    'Colorist & Finishing Artist',
    'Producer'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Hero */}
      <div className="relative rounded-[28px] bg-white border border-slate-200/90 p-8 sm:p-12 overflow-hidden shadow-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-emerald-50 rounded-[14px] flex items-center justify-center text-3xl font-extrabold font-display text-emerald-800">
                {(displayName || 'C').charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                  {displayName || 'Film Professional'}
                </h1>
                <span className="p-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {primaryRole}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {experienceYears} Years Experience
                </span>
                {location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-slate-700">
              <span className="text-emerald-700 font-bold">100%</span> Verified Portfolio
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form & Portfolio Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Professional Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="feed-card rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900">Creator Bio & Background</h2>
                <p className="text-xs text-slate-500 mt-1">Information visible to directors when reviewing your submissions</p>
              </div>
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                  Professional / Screen Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Aditi Rao"
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                    fieldErrors.displayName ? 'border-rose-400 focus:border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                  }`}
                />
                {fieldErrors.displayName && (
                  <p className="text-[11px] font-mono text-rose-500 mt-1">{fieldErrors.displayName}</p>
                )}
              </div>

              {/* Primary Role */}
              <div>
                <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                  Primary Specialization *
                </label>
                <select
                  value={primaryRole}
                  onChange={e => setPrimaryRole(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none transition"
                >
                  {roleOptions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                  Base Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai / Bangalore / Remote"
                  className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition"
                />
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                  Years of Industry Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={experienceYears}
                  onChange={e => setExperienceYears(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                Core Skills & Tools (Comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. DaVinci Resolve, Premiere Pro, Color Grading, Sound Design, Method Acting"
                className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition"
              />
              <p className="text-[11px] font-mono text-slate-500 mt-1.5">
                Tip: Directors filter candidates based on specific NLE suites and equipment expertise.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold font-display text-slate-700 mb-2">
                Filmmaker / Artist Statement & Bio
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                placeholder="Briefly highlight your cinematic background, notable films/commercials worked on, and narrative sensibilities..."
                className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition font-sans"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Proof-of-Work Showreels & Save */}
        <div className="space-y-6">
          <div className="feed-card rounded-2xl p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900">Showreel Proof-of-Work</h3>
                <p className="text-xs text-slate-500">Vimeo, YouTube, IMDb, Fueler links</p>
              </div>
              <Video className="w-5 h-5 text-emerald-600" />
            </div>

            {/* Existing links list */}
            <div className="space-y-3">
              {portfolioLinks.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  No showreels linked yet. Add your Vimeo or YouTube cuts below.
                </div>
              ) : (
                portfolioLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between gap-3 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-display text-slate-900 truncate">
                          {link.label}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {getPlatformIcon(link.url)}
                        </span>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-slate-500 hover:text-emerald-700 truncate flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove Reel Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new link fields */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                Attach New Media Link
              </div>
              <input
                type="text"
                value={newLinkLabel}
                onChange={e => setNewLinkLabel(e.target.value)}
                placeholder="Label (e.g. 2026 Showreel Cut)"
                className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <input
                type="url"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                placeholder="https://vimeo.com/... or https://youtube.com/..."
                className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="btn-brand-outline w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Showreel Link</span>
              </button>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="btn-brand w-full py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Saving Changes...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Creator Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
