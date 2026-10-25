import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clapperboard, PlusCircle, Briefcase, FileCheck, User as UserIcon, Menu, X, LogIn } from 'lucide-react';

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
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? 'bg-cinema-800 text-cinema-gold border border-cinema-700/60 shadow-sm'
            : 'text-slate-300 hover:text-white hover:bg-cinema-850'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <nav className="bg-cinema-900/90 border-b border-cinema-800/80 sticky top-[41px] z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('explore')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-cinema-gold to-yellow-300 p-0.5 shadow-lg shadow-amber-900/20">
              <div className="w-full h-full bg-cinema-950 rounded-[10px] flex items-center justify-center">
                <Clapperboard className="w-5 h-5 text-cinema-gold" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold font-serif tracking-wider text-white">FILMIN</span>
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-slate-400 ml-2 font-mono border-l border-cinema-700 pl-2">
                Talent Meets Cinema
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItem('explore', 'Explore', <Clapperboard className="w-4 h-4" />)}
            {user && navItem('create-opportunity', 'Post Opportunity', <PlusCircle className="w-4 h-4" />)}
            {user && navItem('my-applications', 'My Applications', <FileCheck className="w-4 h-4" />)}
            {user && navItem('my-opportunities', 'My Opportunities', <Briefcase className="w-4 h-4" />)}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition ${
                    currentPage === 'profile'
                      ? 'border-cinema-gold bg-cinema-800 text-cinema-gold'
                      : 'border-cinema-700/80 bg-cinema-850 hover:bg-cinema-800 text-slate-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cinema-gold to-amber-500 text-cinema-950 flex items-center justify-center font-bold text-xs">
                    {(profile?.displayName || user.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">
                    {profile?.displayName || user.email.split('@')[0]}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-cinema-800 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-500 to-cinema-gold text-cinema-950 hover:brightness-110 transition shadow-md shadow-amber-950/40"
                >
                  Join Filmin
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-cinema-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cinema-800 bg-cinema-900 px-4 pt-2 pb-4 space-y-1">
          {navItem('explore', 'Explore Opportunities', <Clapperboard className="w-4 h-4" />)}
          {user && navItem('create-opportunity', 'Post Opportunity', <PlusCircle className="w-4 h-4" />)}
          {user && navItem('my-applications', 'My Applications', <FileCheck className="w-4 h-4" />)}
          {user && navItem('my-opportunities', 'My Opportunities', <Briefcase className="w-4 h-4" />)}
          {user && navItem('profile', 'My Profile', <UserIcon className="w-4 h-4" />)}
          {!user && (
            <div className="pt-2 border-t border-cinema-800 flex gap-2">
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 rounded-lg text-sm text-center bg-cinema-800 text-white font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 rounded-lg text-sm text-center bg-cinema-gold text-cinema-950 font-bold"
              >
                Join Filmin
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
