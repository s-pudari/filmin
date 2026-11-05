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
        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-display tracking-wide transition-all duration-150 ${
          isActive
            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
        }`}
      >
        {icon}
        <span>{label}</span>
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-600 rounded-full" />
        )}
      </button>
    );
  };

  return (
    <nav className="bg-white/95 border-b border-slate-200 sticky top-[37px] z-40 backdrop-blur-md shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('explore')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 p-0.5 shadow-xs group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-white group-hover:rotate-6 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold font-display tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  FILMIN
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  NETWORK
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-mono tracking-widest uppercase text-slate-400">
                Talent Meets Cinema
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            {navItem('explore', 'Explore Cast & Crew', <Clapperboard className="w-4 h-4" />)}
            {user && navItem('create-opportunity', 'Post Opportunity', <PlusCircle className="w-4 h-4" />)}
            {user && navItem('my-applications', 'My Applications', <FileCheck className="w-4 h-4" />)}
            {user && navItem('my-opportunities', 'My Opportunities', <Briefcase className="w-4 h-4" />)}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Indicator pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span>Auditions Live</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border text-xs font-display font-semibold transition-all duration-150 ${
                    currentPage === 'profile'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold font-display text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 rounded-xl text-xs font-bold font-display btn-brand tracking-wide transition shadow-xs"
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
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navItem('explore', 'Explore Cast & Crew', <Clapperboard className="w-4 h-4" />)}
          {user && navItem('create-opportunity', 'Post Opportunity', <PlusCircle className="w-4 h-4" />)}
          {user && navItem('my-applications', 'My Applications', <FileCheck className="w-4 h-4" />)}
          {user && navItem('my-opportunities', 'My Opportunities', <Briefcase className="w-4 h-4" />)}

          <div className="pt-3 mt-3 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  onNavigate('profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {(profile?.displayName || user.email).charAt(0).toUpperCase()}
                  </div>
                  <span>{profile?.displayName || user.email}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl btn-brand text-xs font-bold text-center"
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
