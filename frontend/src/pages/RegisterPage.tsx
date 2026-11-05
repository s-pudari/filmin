import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Clapperboard, UserPlus, AlertCircle, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateToLogin
}) => {
  const { register } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      showToast('Account created successfully! Welcome to Filmin.', 'success', 'Welcome');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="relative rounded-[28px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />

        {/* Brand Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 shadow-sm">
            <Clapperboard className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Join the Network
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-sans">
            Connect directly with verified directors, showrunners & indie productions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold font-display text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. yourname@cinema.pro"
              className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold font-display text-slate-700 mb-1.5">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold font-display text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition font-mono"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Creator Account</span>
              </>
            )}
          </button>
        </form>

        {/* Benefits bullets */}
        <div className="pt-6 mt-6 border-t border-slate-100 relative z-10 space-y-2 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Dual-Role: Apply for roles & post requirements</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Link Vimeo, YouTube, & IMDb showreels</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="pt-6 mt-4 text-center text-xs text-slate-500 relative z-10">
          <span>Already registered on Filmin? </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-emerald-700 hover:text-emerald-800 font-bold font-display underline ml-1"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
};
