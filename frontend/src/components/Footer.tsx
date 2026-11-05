import React from 'react';
import { Shield, Film, Clapperboard, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-14 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 p-0.5 flex items-center justify-center shadow-xs">
                <Clapperboard className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold font-display tracking-tight text-slate-900">FILMIN</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  NETWORK
                </span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-xs max-w-md font-sans">
              Filmin is the professional network connecting film and entertainment professionals with visionary directors, production companies, and casting teams worldwide.
            </p>

            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Network Status: All Systems Operational (99.98% Uptime)</span>
            </div>
          </div>

          {/* Col 2: Platform Crafts */}
          <div>
            <div className="text-slate-900 font-display font-bold text-sm mb-3">Platform Crafts</div>
            <ul className="space-y-2 text-slate-600 font-sans text-xs">
              <li className="hover:text-emerald-700 transition-colors cursor-pointer">• Video Editing & Post-Production</li>
              <li className="hover:text-emerald-700 transition-colors cursor-pointer">• Cinematography & Camera Crew</li>
              <li className="hover:text-emerald-700 transition-colors cursor-pointer">• Feature & Short Film Direction</li>
              <li className="hover:text-emerald-700 transition-colors cursor-pointer">• Screenwriting & Script Doctoring</li>
              <li className="hover:text-emerald-700 transition-colors cursor-pointer">• Sound Design & Audio Engineering</li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div>
            <div className="text-slate-900 font-display font-bold text-sm mb-3">Integrity & Standards</div>
            <div className="space-y-2.5 text-slate-600 font-sans text-xs">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Strict IDOR & Authorization Verification on all submissions.</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Relational unique constraints protect against duplicate applications.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-mono">
          <div>
            © 2026 Filmin Technologies. Built for the global creative cinema community.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 transition">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-700 transition">Terms of Service</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
