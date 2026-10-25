import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Film, UserCheck, ShieldCheck, LogOut } from 'lucide-react';

export const DemoAccountBar: React.FC = () => {
  const { user, profile, switchDemoUser, logout } = useAuth();
  const { showToast } = useNotification();

  const handleSwitch = async (id: number, email: string, name: string, role: string) => {
    await switchDemoUser(id, email);
    showToast(`Switched active persona to ${name} (${role})`, 'info', 'Persona Active');
  };

  return (
    <aside aria-label="Demo Persona Switcher" className="bg-cinema-900 border-b border-cinema-700/60 text-xs px-4 py-2 sticky top-0 z-50 backdrop-blur shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-cinema-gold font-medium">
          <ShieldCheck className="w-4 h-4 text-cinema-amber" />
          <span className="hidden sm:inline font-bold uppercase tracking-wider text-[11px]">Demo Mode:</span>
          <span className="text-slate-300">
            {user ? (
              <>
                Signed in as <strong className="text-white">{profile?.displayName || user.email}</strong>{' '}
                <span className="text-cinema-amber">({profile?.primaryRole || 'Account'})</span>
              </>
            ) : (
              <span className="text-slate-400">Anonymous Visitor (Browse-only)</span>
            )}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <span className="text-slate-400 hidden md:inline">Quick Switch:</span>

          <button
            onClick={() => handleSwitch(1, 'aditi@filmin.demo', 'Aditi Rao', 'Talent Seeker')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
              user?.id === 1
                ? 'bg-cinema-gold text-cinema-950 font-bold shadow-sm'
                : 'bg-cinema-800 text-slate-200 hover:bg-cinema-700 border border-cinema-700/80'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Aditi (Talent)</span>
          </button>

          <button
            onClick={() => handleSwitch(2, 'vikram@filmin.demo', 'Vikram Malhotra', 'Director & Producer')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
              user?.id === 2
                ? 'bg-cinema-gold text-cinema-950 font-bold shadow-sm'
                : 'bg-cinema-800 text-slate-200 hover:bg-cinema-700 border border-cinema-700/80'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Vikram (Director)</span>
          </button>

          <button
            onClick={() => handleSwitch(3, 'karan@filmin.demo', 'Karan Sharma', 'Cinematographer')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 ${
              user?.id === 3
                ? 'bg-cinema-gold text-cinema-950 font-bold shadow-sm'
                : 'bg-cinema-800 text-slate-200 hover:bg-cinema-700 border border-cinema-700/80'
            }`}
          >
            <span>Karan (Cinematographer)</span>
          </button>

          {user && (
            <button
              onClick={() => logout()}
              className="px-2 py-1 text-slate-400 hover:text-rose-400 transition flex items-center gap-1 ml-1"
              title="Log out to test anonymous experience"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
