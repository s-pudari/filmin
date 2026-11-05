import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Clapperboard, LogIn, Sparkles, AlertCircle, UserCheck, Film, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister
}) => {
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to Filmin!', 'success', 'Signed In');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      showToast(err.message || 'Sign in failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
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
            Sign In to Filmin
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-sans">
            Access verified film castings, production pipelines, and portfolios
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
              placeholder="e.g. aditi@filmin.demo"
              className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold font-display text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins (Tharun Speaks sandbox style) */}
        <div className="pt-6 mt-6 border-t border-slate-100 relative z-10 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold text-center">
            Instant 1-Click Demo Login:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('aditi@filmin.demo')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-left transition group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold font-display text-slate-900 group-hover:text-emerald-700">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Aditi Rao</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">Talent / Actress</div>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('vikram@filmin.demo')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-left transition group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold font-display text-slate-900 group-hover:text-emerald-700">
                <Film className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vikram M.</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">Director / Producer</div>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="pt-6 mt-4 text-center text-xs text-slate-500 relative z-10">
          <span>New to the network? </span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-emerald-700 hover:text-emerald-800 font-bold font-display underline ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
