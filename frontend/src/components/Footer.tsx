import React from 'react';
import { Shield, Film } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cinema-950 border-t border-cinema-850 text-slate-400 text-xs py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold font-serif text-base mb-2">
              <Film className="w-4 h-4 text-cinema-gold" />
              <span>FILMIN · MVP v1.0</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              A structured talent platform for independent cinema, connecting actors, crew, and filmmakers
              with casting calls and verified production requirements.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Public Notice</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Public profile details (display name, primary role, skills, bio, location, portfolio URLs) are visible to directors.
              Account credentials, private application history, and personal email remain confidential and protected.
            </p>
          </div>

          <div>
            <div className="text-slate-200 font-semibold mb-2">Technical Foundations</div>
            <ul className="space-y-1 text-slate-400">
              <li>• Spring Boot 3 Modular Monolith & Express Companion</li>
              <li>• PostgreSQL with Flyway Migrations</li>
              <li>• Unique Constraints & Concurrency Protection</li>
              <li>• React 18 + TypeScript + Vite UI</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-cinema-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <div>© 2026 Filmin. Built with pride for the Indian & global cinema community.</div>
          <div className="flex gap-4">
            <span>MVP v1.0 Release</span>
            <span>·</span>
            <span>Interview Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
