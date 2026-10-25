import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Clapperboard, LogIn, Sparkles, AlertCircle } from 'lucide-react';

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
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-cinema-900 border border-cinema-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 via-cinema-gold to-yellow-300 p-0.5 shadow-lg shadow-amber-900/30 mb-3">
            <div className="w-full h-full bg-cinema-950 rounded-[14px] flex items-center justify-center">
              <Clapperboard className="w-6 h-6 text-cinema-gold" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-serif text-white">Sign In to Filmin</h1>
          <p className="text-xs text-slate-400 mt-1">Access your applications, listings, and talent portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. aditi@filmin.demo"
              className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-cinema-950 border border-cinema-800 focus:border-cinema-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cinema-gold hover:bg-amber-400 text-cinema-950 font-bold text-sm transition shadow-lg shadow-amber-950/40 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Autofill Buttons */}
        <div className="mt-6 pt-6 border-t border-cinema-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cinema-gold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cinema-amber" />
            <span>1-Click Demo Credentials:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('aditi@filmin.demo')}
              className="px-2.5 py-1.5 rounded-lg bg-cinema-850 hover:bg-cinema-800 border border-cinema-750 text-left text-xs transition"
            >
              <div className="font-semibold text-white">Aditi (Talent)</div>
              <div className="text-[10px] text-slate-400">aditi@filmin.demo</div>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('vikram@filmin.demo')}
              className="px-2.5 py-1.5 rounded-lg bg-cinema-850 hover:bg-cinema-800 border border-cinema-750 text-left text-xs transition"
            >
              <div className="font-semibold text-white">Vikram (Director)</div>
              <div className="text-[10px] text-slate-400">vikram@filmin.demo</div>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-cinema-gold hover:underline font-semibold"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
