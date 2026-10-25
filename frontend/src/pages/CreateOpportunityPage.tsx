import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { ApiError } from '../types';
import { PlusCircle, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

interface CreateOpportunityPageProps {
  onSuccess: (opportunityId: number) => void;
  onCancel: () => void;
}

export const CreateOpportunityPage: React.FC<CreateOpportunityPageProps> = ({
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
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

      showToast('Opportunity published successfully!', 'success', 'Listing Active');
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cinema-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Return</span>
      </button>

      <div className="bg-cinema-900 border border-cinema-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cinema-800 border border-cinema-700/80 flex items-center justify-center text-cinema-gold">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-white">Post a Cinema Opportunity</h1>
            <p className="text-xs text-slate-400">
              Publish casting requirements or technical crew calls to the Filmin network
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Opportunity Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Lead Female Protagonist for Indie Drama 'Echoes of Silence'"
              className={`w-full bg-cinema-950 border ${
                fieldErrors.title ? 'border-rose-500' : 'border-cinema-800 focus:border-cinema-gold'
              } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition`}
            />
            {fieldErrors.title && (
              <p className="text-xs text-rose-400 mt-1">{fieldErrors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Opportunity Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Production Format <span className="text-rose-400">*</span>
              </label>
              <select
                value={opportunityType}
                onChange={e => setOpportunityType(e.target.value)}
                className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
              >
                <option value="FEATURE_FILM">Feature Film</option>
                <option value="SHORT_FILM">Short Film</option>
                <option value="WEB_SERIES">Web Series / OTT</option>
                <option value="DOCUMENTARY">Documentary</option>
                <option value="COMMERCIAL">Commercial / Music Video</option>
              </select>
            </div>

            {/* Role Needed */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Role / Specialization Needed <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={roleNeeded}
                onChange={e => setRoleNeeded(e.target.value)}
                placeholder="e.g. Lead Actress, Video Editor, Cinematographer"
                className={`w-full bg-cinema-950 border ${
                  fieldErrors.roleNeeded ? 'border-rose-500' : 'border-cinema-800 focus:border-cinema-gold'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition`}
              />
              {fieldErrors.roleNeeded && (
                <p className="text-xs text-rose-400 mt-1">{fieldErrors.roleNeeded}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location / Shoot Region <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Mumbai / Western Ghats or Remote"
                className={`w-full bg-cinema-950 border ${
                  fieldErrors.location ? 'border-rose-500' : 'border-cinema-800 focus:border-cinema-gold'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition`}
              />
              {fieldErrors.location && (
                <p className="text-xs text-rose-400 mt-1">{fieldErrors.location}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Application Deadline <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className={`w-full bg-cinema-950 border ${
                  fieldErrors.deadline ? 'border-rose-500' : 'border-cinema-800 focus:border-cinema-gold'
                } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition`}
              />
              {fieldErrors.deadline && (
                <p className="text-xs text-rose-400 mt-1">{fieldErrors.deadline}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Role Description, Requirements & Project Synopsis <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Outline character background, age range, technical gear requirements, shooting dates, compensation structure, or language prerequisites..."
              rows={6}
              className={`w-full bg-cinema-950 border ${
                fieldErrors.description ? 'border-rose-500' : 'border-cinema-800 focus:border-cinema-gold'
              } rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none transition`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-rose-400 mt-1">{fieldErrors.description}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cinema-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-cinema-gold hover:brightness-110 text-cinema-950 transition shadow-lg shadow-amber-950/40 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
