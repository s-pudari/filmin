import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clapperboard, PlusCircle, Briefcase, FileCheck, User as UserIcon, Menu, X, LogIn, Sparkles, ChevronRight } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItem = (page: string, label: string, icon: React.ReactNode) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => {
          onNavigate(page);
          setMobileMenuOpen(false);
        }}
        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-display tracking-wide transition-all duration-200 ${
          isActive
            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
            : 'text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
        }`}
      >
        {icon}
        <span>{label}</span>
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
        )}
      </button>
    );
  };

  return (
    <nav className="bg-[#07080c]/80 border-b border-white/[0.08] sticky top-[37px] z-40 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('explore')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#07080c] rounded-[14px] flex items-center justify-center">
                <Clapperboard className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold font-display tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  FILMIN
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  PRO
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                Talent Meets Cinema
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            {navItem('explore', 'Explore Cast & Crew', <Clapperboard className="w-4 h-4" />)}
            {user && navItem('create-opportunity', 'Post Opportunity', <PlusCircle className="w-4 h-4" />)}
            {user && navItem('my-applications', 'My Applications', <FileCheck className="w-4 h-4" />)}
            {user && navItem('my-opportunities', 'My Opportunities', <Briefcase className="w-4 h-4" />)}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Indicator pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Auditions Live</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border text-xs font-display font-semibold transition-all duration-200 ${
                    currentPage === 'profile'
                      ? 'border-amber-400/60 bg-amber-500/10 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold text-xs shadow-sm">
                    {(profile?.displayName || user.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {profile?.displayName || user.email.split('@')[0]}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold font-display text-zinc-300 hover:text-white hover:bg-white/[0.06] transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 rounded-xl text-xs font-bold font-display btn-glow-gold tracking-wide transition"
                >
                  Join Filmin
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#07080c]/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navItem('explore', 'Explore Cast & Crew', <Clapperboard className="w-4 h-4" />)}
          {user && navItem('create-opportunity', 'Post Opportunity', <PlusCircle className="w-4 h-4" />)}
          {user && navItem('my-applications', 'My Applications', <FileCheck className="w-4 h-4" />)}
          {user && navItem('my-opportunities', 'My Opportunities', <Briefcase className="w-4 h-4" />)}

          <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  onNavigate('profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-semibold text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-xs">
                    {(profile?.displayName || user.email).charAt(0).toUpperCase()}
                  </div>
                  <span>{profile?.displayName || user.email}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-semibold text-white text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl btn-glow-gold text-xs font-bold text-center"
                >
                  Join Filmin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
