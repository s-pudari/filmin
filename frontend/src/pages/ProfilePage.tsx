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
      <div className="relative rounded-[32px] bg-gradient-to-r from-[#11131e] via-[#0c0d15] to-[#07080d] border border-white/[0.1] p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 p-1 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <div className="w-full h-full bg-[#07080c] rounded-[22px] flex items-center justify-center text-3xl font-extrabold font-display text-white">
                {(displayName || 'C').charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  {displayName || 'Film Professional'}
                </h1>
                <span className="p-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  {primaryRole}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  {experienceYears} Years Experience
                </span>
                {location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
              <span className="text-emerald-400 font-bold">100%</span> Verified Portfolio
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form & Portfolio Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Professional Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Creator Bio & Background</h2>
                <p className="text-xs text-zinc-400 mt-1">Information visible to directors when reviewing your submissions</p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold font-display text-zinc-300 mb-2">
                  Professional / Screen Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Aditi Rao"
                  className={`w-full bg-[#07080c] border rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                    fieldErrors.displayName ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-amber-400'
                  }`}
                />
                {fieldErrors.displayName && (
                  <p className="text-[11px] font-mono text-rose-400 mt-1">{fieldErrors.displayName}</p>
                )}
              </div>

              {/* Primary Role */}
              <div>
                <label className="block text-xs font-semibold font-display text-zinc-300 mb-2">
                  Primary Specialization *
                </label>
                <select
                  value={primaryRole}
                  onChange={e => setPrimaryRole(e.target.value)}
                  className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition"
                >
                  {roleOptions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold font-display text-zinc-300 mb-2">
                  Base Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai / Bangalore / Remote"
                  className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition"
                />
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-xs font-semibold font-display text-zinc-300 mb-2">
                  Years of Industry Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={experienceYears}
                  onChange={e => setExperienceYears(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold font-display text-zinc-300 mb-2">
                Core Skills & Tools (Comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. DaVinci Resolve, Premiere Pro, Color Grading, Sound Design, Method Acting"
                className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition"
              />
              <p className="text-[11px] font-mono text-zinc-500 mt-1.5">
                Tip: Directors filter candidates based on specific NLE suites and equipment expertise.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold font-display text-zinc-300 mb-2">
                Filmmaker / Artist Statement & Bio
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                placeholder="Briefly highlight your cinematic background, notable films/commercials worked on, and narrative sensibilities..."
                className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition font-sans"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Proof-of-Work Showreels & Save */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-7 space-y-6 border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Showreel Proof-of-Work</h3>
                <p className="text-xs text-zinc-400">Vimeo, YouTube, IMDb, Fueler links</p>
              </div>
              <Video className="w-5 h-5 text-amber-400" />
            </div>

            {/* Existing links list */}
            <div className="space-y-3">
              {portfolioLinks.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-zinc-500">
                  No showreels linked yet. Add your Vimeo or YouTube cuts below.
                </div>
              ) : (
                portfolioLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/30 flex items-center justify-between gap-3 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-display text-white truncate">
                          {link.label}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                          {getPlatformIcon(link.url)}
                        </span>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-zinc-400 hover:text-amber-300 truncate flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Remove Reel Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new link fields */}
            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Attach New Media Link
              </div>
              <input
                type="text"
                value={newLinkLabel}
                onChange={e => setNewLinkLabel(e.target.value)}
                placeholder="Label (e.g. 2026 Showreel Cut)"
                className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              <input
                type="url"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                placeholder="https://vimeo.com/... or https://youtube.com/..."
                className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs font-display font-semibold text-white flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Showreel Link</span>
              </button>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
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
