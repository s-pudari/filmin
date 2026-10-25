import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { PortfolioLink, ApiError } from '../types';
import { User, Plus, Trash2, ExternalLink, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useNotification();

  const [displayName, setDisplayName] = useState('');
  const [primaryRole, setPrimaryRole] = useState('Actor');
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
      setPrimaryRole(profile.primaryRole || 'Actor');
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
      { label: newLinkLabel.trim() || 'Portfolio Reel', url: newLinkUrl.trim() }
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
      showToast('Profile updated successfully!', 'success', 'Profile Saved');
    } catch (err: any) {
      const apiErr = err as ApiError;
      if (apiErr.fieldErrors) setFieldErrors(apiErr.fieldErrors);
      showToast(apiErr.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="pb-4 border-b border-cinema-800">
        <h1 className="text-2xl font-bold font-serif text-white">Professional Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Directors and casting agents review this information when assessing your applications
        </p>
      </div>

      <div className="bg-cinema-900 border border-cinema-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Display Name / Screen Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Aditi Rao"
                className={`w-full bg-cinema-950 border ${
                  fieldErrors.displayName ? 'border-rose-500' : 'border-cinema-800 focus:border-cinema-gold'
                } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition`}
              />
              {fieldErrors.displayName && (
                <p className="text-xs text-rose-400 mt-1">{fieldErrors.displayName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Cinema Role <span className="text-rose-400">*</span>
              </label>
              <select
                value={primaryRole}
                onChange={e => setPrimaryRole(e.target.value)}
                className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
              >
                <option value="Lead Actress">Lead Actress</option>
                <option value="Lead Actor">Lead Actor</option>
                <option value="Supporting Actor">Supporting Actor</option>
                <option value="Director & Producer">Director & Producer</option>
                <option value="Cinematographer & Drone Op">Cinematographer & Drone Op</option>
                <option value="Video Editor">Video Editor</option>
                <option value="Camera Assistant">Camera Assistant / 1st AC</option>
                <option value="Screenwriter">Screenwriter</option>
                <option value="Music Composer">Music Composer</option>
                <option value="Sound Designer">Sound Designer</option>
              </select>
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location / Base City
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Years of Industry Experience
              </label>
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={e => setExperienceYears(parseInt(e.target.value || '0', 10))}
                className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Skills, Dialects & Equipment Mastery <span className="text-slate-500">(Comma separated)</span>
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Method Acting, Classical Dance, Hindi, ARRI Alexa, DaVinci Resolve"
              className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Professional Biography / Filmography Background
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Graduate of FTII, National School of Drama, or notable credits..."
              rows={4}
              className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl p-3 text-sm text-white focus:outline-none transition"
            />
          </div>

          {/* Portfolio Links (PRD Section 4 & 9) */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-300">
              Verified External Portfolio & Reel URLs <span className="text-slate-500">(IMDb, Vimeo, Showreel)</span>
            </label>

            <div className="space-y-2">
              {portfolioLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-cinema-850 border border-cinema-800 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-cinema-gold">{link.label}:</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300 hover:text-white truncate underline"
                    >
                      {link.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new link input */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                placeholder="Platform (e.g. IMDb, Showreel)"
                value={newLinkLabel}
                onChange={e => setNewLinkLabel(e.target.value)}
                className="bg-cinema-950 border border-cinema-800 rounded-xl px-3 py-2 text-xs text-white sm:w-44 focus:outline-none focus:border-cinema-gold"
              />
              <input
                type="url"
                placeholder="https://vimeo.com/your-reel"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                className="flex-1 bg-cinema-950 border border-cinema-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cinema-gold"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 rounded-xl bg-cinema-800 hover:bg-cinema-750 text-cinema-gold text-xs font-bold transition flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-cinema-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Visible to opportunity creators</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cinema-gold hover:bg-amber-400 text-cinema-950 transition flex items-center gap-1.5 shadow-md shadow-amber-950/30 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
