import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Film, UserCheck, ShieldCheck, Sparkles, LogOut, Info } from 'lucide-react';

export const DemoAccountBar: React.FC = () => {
  const { user, profile, switchDemoUser, logout } = useAuth();
  const { showToast } = useNotification();

  const handleSwitch = async (id: number, email: string, name: string, role: string) => {
    await switchDemoUser(id, email);
    showToast(`Switched active persona to ${name} (${role})`, 'info', 'Persona Active');
  };

  return (
    <aside aria-label="Demo Persona Switcher" className="border-b border-white/[0.08] bg-[#07080c]/90 text-xs px-4 py-2 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
            </span>
            <span>Interactive Sandbox</span>
          </div>

          <div className="text-zinc-300 text-xs flex items-center gap-1.5">
            {user ? (
              <>
                <span className="text-zinc-500 hidden sm:inline">Active as:</span>
                <strong className="text-white font-medium">{profile?.displayName || user.email}</strong>
                <span className="text-amber-400 font-mono text-[11px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {profile?.primaryRole || 'Account'}
                </span>
              </>
            ) : (
              <span className="text-zinc-400">Anonymous Visitor (Browse Mode)</span>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <span className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider hidden md:inline">
            Quick Persona:
          </span>

          {/* Aditi - Talent Persona */}
          <button
            onClick={() => handleSwitch(1, 'aditi@filmin.demo', 'Aditi Rao', 'Talent Seeker')}
            className={`px-3 py-1 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${
              user?.id === 1
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-105'
                : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Aditi (Talent / Actress)</span>
          </button>

          {/* Vikram - Director Persona */}
          <button
            onClick={() => handleSwitch(2, 'vikram@filmin.demo', 'Vikram Malhotra', 'Director & Producer')}
            className={`px-3 py-1 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${
              user?.id === 2
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-105'
                : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Vikram (Director)</span>
          </button>

          {user && (
            <button
              onClick={logout}
              className="px-2.5 py-1 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition flex items-center gap-1 text-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
