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
      <div className="relative rounded-[36px] bg-gradient-to-b from-[#11131e] via-[#0c0d15] to-[#07080d] border border-white/[0.1] p-8 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        {/* Brand Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 p-1 shadow-[0_0_25px_rgba(245,158,11,0.35)] mb-4">
            <div className="w-full h-full bg-[#07080c] rounded-[20px] flex items-center justify-center">
              <Clapperboard className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-white tracking-tight">
            Sign In to Filmin
          </h1>
          <p className="text-xs text-zinc-400 mt-1.5 font-sans">
            Access verified film castings, production pipelines, and portfolios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold font-display text-zinc-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. aditi@filmin.demo"
              className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold font-display text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition font-mono"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
        <div className="pt-6 mt-6 border-t border-white/[0.08] relative z-10 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold text-center">
            Instant 1-Click Demo Login:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('aditi@filmin.demo')}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold font-display text-white group-hover:text-amber-400">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Aditi Rao</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">Talent / Actress</div>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('vikram@filmin.demo')}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold font-display text-white group-hover:text-amber-400">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Vikram M.</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">Director / Producer</div>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="pt-6 mt-4 text-center text-xs text-zinc-400 relative z-10">
          <span>New to the network? </span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-amber-400 hover:text-amber-300 font-bold font-display underline ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
