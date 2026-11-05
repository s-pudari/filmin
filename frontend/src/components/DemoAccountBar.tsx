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
    <aside aria-label="Demo Persona Switcher" className="border-b border-slate-200 bg-white/95 text-xs px-4 py-2 sticky top-0 z-50 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
            </span>
            <span>Interactive Demo Sandbox</span>
          </div>

          <div className="text-slate-600 text-xs flex items-center gap-1.5">
            {user ? (
              <>
                <span className="text-slate-400 hidden sm:inline">Active as:</span>
                <strong className="text-slate-900 font-semibold">{profile?.displayName || user.email}</strong>
                <span className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                  {profile?.primaryRole || 'Account'}
                </span>
              </>
            ) : (
              <span className="text-slate-500">Anonymous Visitor (Browse Mode)</span>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider hidden md:inline">
            Quick Persona:
          </span>

          {/* Aditi - Talent Persona */}
          <button
            onClick={() => handleSwitch(1, 'aditi@filmin.demo', 'Aditi Rao', 'Talent Seeker')}
            className={`px-3 py-1 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${
              user?.id === 1
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Aditi (Talent / Actress)</span>
          </button>

          {/* Vikram - Director Persona */}
          <button
            onClick={() => handleSwitch(2, 'vikram@filmin.demo', 'Vikram Malhotra', 'Director & Producer')}
            className={`px-3 py-1 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${
              user?.id === 2
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Vikram (Director)</span>
          </button>

          {user && (
            <button
              onClick={logout}
              className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition flex items-center gap-1 text-xs"
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
