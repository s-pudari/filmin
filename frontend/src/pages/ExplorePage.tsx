import React, { useState, useEffect } from 'react';
import { Opportunity, PageResponse } from '../types';
import { api } from '../services/api';
import { OpportunityCard } from '../components/OpportunityCard';
import { EmptyState } from '../components/EmptyState';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  Video,
  Award,
  ShieldCheck,
  ChevronDown,
  Film,
  Zap,
  Star
} from 'lucide-react';

interface ExplorePageProps {
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onNavigateToPost: () => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onSelectOpportunity,
  onNavigateToPost
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [pageData, setPageData] = useState<PageResponse<Opportunity> | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(0);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.getOpportunities({
        keyword: keyword || undefined,
        role: role || undefined,
        location: location || undefined,
        type: type || undefined,
        page,
        size: 9
      });
      setOpportunities(res.content);
      setPageData(res);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [role, type, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchOpportunities();
  };

  const handleClearFilters = () => {
    setKeyword('');
    setRole('');
    setLocation('');
    setType('');
    setPage(0);
  };

  const roleShortcuts = [
    'Video Editor',
    'Cinematographer',
    'Lead Actress',
    'Lead Actor',
    'Screenwriter',
    'Sound Designer',
    'Music Composer'
  ];

  const formatPills = [
    { label: 'All Formats', value: '' },
    { label: 'Feature Film', value: 'FEATURE_FILM' },
    { label: 'Web Series / OTT', value: 'WEB_SERIES' },
    { label: 'Short Film', value: 'SHORT_FILM' },
    { label: 'Documentary', value: 'DOCUMENTARY' },
    { label: 'Commercial', value: 'COMMERCIAL' }
  ];

  const faqs = [
    {
      q: 'How does Filmin connect creators directly with directors?',
      a: 'Filmin removes agency gatekeepers and chaotic group chats. Every opportunity is published directly by authenticated directors and production houses. When you apply, the director reviews your verified proof-of-work reels and cover message in an organized candidate pipeline.'
    },
    {
      q: 'Can I link external showreels from Vimeo, YouTube, and IMDb?',
      a: 'Yes! We believe in proof-of-work. In your Filmin profile, you can attach high-resolution external showreel links, IMDb credits, and portfolio URLs that directors can instantly inspect with a single click.'
    },
    {
      q: 'Can I both apply for roles and publish my own production requirements?',
      a: 'Absolutely. Filmin supports dual-role cinema professionals. Independent filmmakers can recruit a video editor or cinematographer for their upcoming project while simultaneously applying as a screenwriter or director for other productions using the same account.'
    },
    {
      q: 'Is there any fee or commission deducted from talent earnings?',
      a: 'No. Filmin is built by and for the cinema community. We believe creators and technicians should keep 100% of their earnings and production contracts without hidden agent cuts.'
    }
  ];

  return (
    <div className="space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative rounded-[36px] bg-gradient-to-b from-[#0f111c] via-[#090b12] to-[#05060a] border border-white/[0.08] p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 -mt-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-amber-300 text-xs font-mono font-semibold mb-6 shadow-inner backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="uppercase tracking-widest text-[11px]">The Definitive Network for Cinema & Creators</span>
          </div>

          {/* Punchy Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-white tracking-tight leading-[1.08] mb-6">
            Stop Waiting For Castings.{' '}
            <span className="text-gradient-gold block sm:inline">Direct Your Future.</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-10 font-sans">
            Direct access to verified film productions, OTT series, and commercial projects.
            Showcase verified proof-of-work showreels, apply without gatekeepers, or recruit crew for your next shoot.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#explore-listings"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-glow-gold text-sm font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore Active Castings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={onNavigateToPost}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-sm font-semibold font-display tracking-wide flex items-center justify-center gap-2 backdrop-blur-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Post a Production Call</span>
            </button>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel p-2 rounded-2xl max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 shadow-2xl border border-white/10 mb-6"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Search by title or craft (e.g., Video Editor, Cinematographer, Thriller)..."
                className="w-full bg-transparent pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl btn-glow-gold text-xs font-bold font-display uppercase tracking-wider shrink-0"
            >
              Search Roles
            </button>
          </form>

          {/* Quick Role Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Trending:</span>
            {roleShortcuts.slice(0, 5).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setPage(0);
                }}
                className={`px-3 py-1 rounded-full text-[11px] transition-all ${
                  role === r
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-zinc-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Live Proof-Points Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 mt-12 border-t border-white/[0.08] text-left">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-1">500+</div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Projects Greenlit</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-1">12K+</div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Verified Creators</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-amber-400 mb-1">48 Hrs</div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Avg Response Time</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400 mb-1">100%</div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Direct Director Leads</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== INFINITE CRAFT MARQUEE TICKER ===================== */}
      <div className="relative w-full overflow-hidden border-y border-white/[0.08] py-4 bg-gradient-to-r from-[#050609] via-[#090b12] to-[#050609]">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050508] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050508] to-transparent z-10 pointer-events-none" />

        <div className="flex whitespace-nowrap animate-marquee items-center gap-10 text-xs sm:text-sm font-mono font-semibold tracking-widest uppercase text-zinc-400">
          <span className="flex items-center gap-3 text-amber-400 font-bold">
            <Film className="w-4 h-4 text-amber-400" /> VIDEO EDITORS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-white">
            <Video className="w-4 h-4 text-emerald-400" /> CINEMATOGRAPHERS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-purple-300">
            <Clapperboard className="w-4 h-4 text-purple-400" /> FEATURE DIRECTORS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-amber-300">
            <Award className="w-4 h-4 text-amber-400" /> LEAD ACTORS & ACTRESSES
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" /> SOUND DESIGNERS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-pink-300">
            <Zap className="w-4 h-4 text-pink-400" /> SCREENWRITERS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-emerald-300">
            <Film className="w-4 h-4 text-emerald-400" /> COLORISTS & VFX
          </span>
          <span>•</span>
          {/* Duplicate set for infinite seamless loop */}
          <span className="flex items-center gap-3 text-amber-400 font-bold">
            <Film className="w-4 h-4 text-amber-400" /> VIDEO EDITORS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-white">
            <Video className="w-4 h-4 text-emerald-400" /> CINEMATOGRAPHERS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-purple-300">
            <Clapperboard className="w-4 h-4 text-purple-400" /> FEATURE DIRECTORS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-amber-300">
            <Award className="w-4 h-4 text-amber-400" /> LEAD ACTORS & ACTRESSES
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" /> SOUND DESIGNERS
          </span>
          <span>•</span>
          <span className="flex items-center gap-3 text-pink-300">
            <Zap className="w-4 h-4 text-pink-400" /> SCREENWRITERS
          </span>
        </div>
      </div>

      {/* ===================== THE FILMIN STANDARD (3 PILLARS) ===================== */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-2 font-bold">
            Why Creators & Directors Choose Filmin
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Built Differently for Modern Cinema
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Engineered to remove friction from discovery, casting, and crew recruitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-2">Pillar 01</div>
            <h3 className="text-xl font-bold font-display text-white mb-3">Proof-of-Work Over Resumes</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Showcase verified Vimeo reels, YouTube showreels, and IMDb filmographies. Directors evaluate real craft and visual storytelling instead of static bullet points.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">Pillar 02</div>
            <h3 className="text-xl font-bold font-display text-white mb-3">Direct Director Pipeline</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every production listing is posted directly by verified directors, producers, or showrunners. Zero agency commissions, zero middleman noise.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold mb-2">Pillar 03</div>
            <h3 className="text-xl font-bold font-display text-white mb-3">Zero-Ghosting Transparency</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Real-time audit statuses let you track your audition from Submitted to Shortlisted, Accepted, or Closed. Complete clarity on every submission.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== LISTINGS BROWSER ===================== */}
      <section id="explore-listings" className="space-y-6 scroll-mt-24">
        {/* Section Heading & Result stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1 font-semibold">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>Production Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Open Castings & Crew Requirements
            </h2>
          </div>

          <div className="text-xs font-mono text-zinc-400">
            Showing <strong className="text-white">{pageData?.totalElements || opportunities.length}</strong> active listings
          </div>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {formatPills.map(f => (
            <button
              key={f.value}
              onClick={() => {
                setType(f.value);
                setPage(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-display font-semibold whitespace-nowrap transition-all ${
                type === f.value
                  ? 'bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                  : 'bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.07] border border-white/[0.08]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono font-semibold">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>FILTER BY:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1 max-w-3xl">
            {/* Role Filter */}
            <select
              value={role}
              onChange={e => { setRole(e.target.value); setPage(0); }}
              className="bg-[#0b0c13] border border-white/10 text-zinc-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400 font-sans"
            >
              <option value="">All Roles</option>
              <option value="Lead Actress">Lead Actress</option>
              <option value="Lead Actor">Lead Actor</option>
              <option value="Video Editor">Video Editor</option>
              <option value="Cinematographer">Cinematographer</option>
              <option value="Camera Assistant">Camera Assistant</option>
              <option value="Music Composer">Music Composer</option>
              <option value="Sound Designer">Sound Designer</option>
              <option value="Screenwriter">Screenwriter</option>
            </select>

            {/* Location input */}
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setPage(0); fetchOpportunities(); } }}
                placeholder="City (e.g. Mumbai, Bangalore)..."
                className="bg-[#0b0c13] border border-white/10 text-zinc-200 placeholder-zinc-500 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400 w-44 font-sans"
              />
            </div>

            {(keyword || role || location || type) && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-mono text-zinc-400 hover:text-amber-400 underline ml-auto transition"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Grid of Opportunities */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse p-6" />
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <EmptyState
            title="No cinema opportunities match your criteria"
            description="Try clearing your filters or exploring different roles to see available director listings."
            action={{
              label: "Clear All Active Filters",
              onClick: handleClearFilters
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map(opp => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pageData && pageData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-8 border-t border-white/[0.08]">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-zinc-300 disabled:opacity-30 transition flex items-center gap-1.5 text-xs font-display font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span className="text-xs font-mono text-zinc-400 px-3">
              Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{pageData.totalPages}</strong>
            </span>
            <button
              onClick={() => setPage(p => Math.min(pageData.totalPages - 1, p + 1))}
              disabled={pageData.last}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-zinc-300 disabled:opacity-30 transition flex items-center gap-1.5 text-xs font-display font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* ===================== CREATOR SPOTLIGHT & TESTIMONIALS ===================== */}
      <section className="space-y-8 pt-8 border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            From Audition to Silver Screen
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Real stories from creators and technicians who landed major projects through Filmin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Story 1 */}
          <div className="glass-card rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic font-sans">
                "As an independent video editor, getting in front of established feature directors was almost impossible. On Filmin, I linked my DaVinci showreel directly to Vikram's posting and got hired for a festival feature within 72 hours."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
                AK
              </div>
              <div>
                <div className="text-sm font-bold font-display text-white">Anand Kulkarni</div>
                <div className="text-xs font-mono text-zinc-500">Lead Video Editor · Mumbai</div>
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div className="glass-card rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic font-sans">
                "No endless casting queues or scam auditions. I submitted my audition reel for 'The Silent Echo' and could see the exact moment my status moved to Shortlisted. The transparency is unlike anything in the industry."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                AR
              </div>
              <div>
                <div className="text-sm font-bold font-display text-white">Aditi Rao</div>
                <div className="text-xs font-mono text-zinc-500">Theatre & Screen Actress · Bangalore</div>
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div className="glass-card rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic font-sans">
                "We had 10 days before production began and desperately needed a gaffer and second camera operator. Within 48 hours of posting on Filmin, we reviewed 14 high-caliber applicants and closed the crew."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                VM
              </div>
              <div>
                <div className="text-sm font-bold font-display text-white">Vikram Malhotra</div>
                <div className="text-xs font-mono text-zinc-500">Director & Producer · Neo Cinema Studios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FREQUENTLY ASKED QUESTIONS ===================== */}
      <section className="space-y-8 pt-8 border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-2 font-bold">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Everything you need to know about publishing and applying on Filmin.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base text-white hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-zinc-300 leading-relaxed font-sans border-t border-white/[0.04] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== CALL TO ACTION BANNER ===================== */}
      <section className="relative rounded-[36px] bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-purple-600/20 border border-amber-500/30 p-10 sm:p-14 text-center overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white mb-4">
            Ready to Take Your Cinema Vision to the Next Level?
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base mb-8 font-sans">
            Join thousands of filmmakers, actors, video editors, and technicians building the future of cinema.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToPost}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-glow-gold text-sm font-bold font-display uppercase tracking-wider"
            >
              Post Production Role
            </button>
            <a
              href="#explore-listings"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-semibold font-display"
            >
              Browse Roles
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
