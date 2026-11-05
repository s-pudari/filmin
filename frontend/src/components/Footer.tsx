import React from 'react';
import { Shield, Film, Clapperboard, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050609] border-t border-white/[0.08] text-zinc-400 text-xs py-14 mt-20 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-950/40">
                <div className="w-full h-full bg-[#07080c] rounded-[10px] flex items-center justify-center">
                  <Clapperboard className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold font-display tracking-tight text-white">FILMIN</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  NETWORK
                </span>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed text-xs max-w-md font-sans">
              Filmin is the premier proof-of-work platform for modern cinema creators and independent productions.
              Connecting verified directors with actors, cinematographers, editors, and technical crew worldwide.
            </p>

            <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Network Status: All Systems Operational (99.98% Uptime)</span>
            </div>
          </div>

          {/* Col 2: Platform Pillars */}
          <div>
            <div className="text-white font-display font-bold text-sm mb-3">Platform Crafts</div>
            <ul className="space-y-2 text-zinc-400 font-sans text-xs">
              <li className="hover:text-amber-300 transition-colors cursor-pointer">• Video Editing & Post-Production</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">• Cinematography & Camera Crew</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">• Feature & Short Film Direction</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">• Screenwriting & Script Doctoring</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">• Sound Design & Foley Mixing</li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div>
            <div className="text-white font-display font-bold text-sm mb-3">Integrity & Standards</div>
            <div className="space-y-2.5 text-zinc-400 font-sans text-xs">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Strict IDOR & Ownership Verification on all submissions.</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Relational unique constraints protect against duplicate applications.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs font-mono">
          <div>
            © 2026 Filmin Technologies. Inspired by the creator-first ethos of modern cinema.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 transition">Privacy Shield</span>
            <span>•</span>
            <span className="hover:text-zinc-300 transition">Terms of Service</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">MVP v1.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
