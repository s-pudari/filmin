import React, { useState, useEffect } from 'react';
import { Opportunity, PageResponse } from '../types';
import { api } from '../services/api';
import { OpportunityCard } from '../components/OpportunityCard';
import { EmptyState } from '../components/EmptyState';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Clapperboard, Sparkles } from 'lucide-react';

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Cinematic Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-cinema-900 via-cinema-850 to-cinema-950 border border-cinema-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cinema-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-800/80 border border-cinema-700/60 text-cinema-gold text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Film & OTT Casting & Crew Requirements</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight mb-4">
            Where Indie Talent Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cinema-gold to-yellow-200">Visionary Cinema</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Direct access to verified film projects, casting calls, and key technical roles.
            Apply directly with your portfolio reel or recruit crew for your next production.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Search by title or keywords (e.g., Lead Actor, Editor, Thriller)..."
                className="w-full bg-cinema-950/90 border border-cinema-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cinema-gold transition shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cinema-gold hover:bg-amber-400 text-cinema-950 font-bold text-sm transition shadow-lg shadow-amber-950/40 shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-cinema-900/60 border border-cinema-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-cinema-gold" />
          <span>FILTER BY:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-3xl">
          {/* Role Filter */}
          <select
            value={role}
            onChange={e => { setRole(e.target.value); setPage(0); }}
            className="bg-cinema-850 border border-cinema-750 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cinema-gold"
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

          {/* Type Filter */}
          <select
            value={type}
            onChange={e => { setType(e.target.value); setPage(0); }}
            className="bg-cinema-850 border border-cinema-750 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cinema-gold"
          >
            <option value="">All Formats</option>
            <option value="FEATURE_FILM">Feature Film</option>
            <option value="SHORT_FILM">Short Film</option>
            <option value="WEB_SERIES">Web Series / OTT</option>
            <option value="DOCUMENTARY">Documentary</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>

          {/* Location input */}
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { setPage(0); fetchOpportunities(); } }}
              placeholder="City / Region..."
              className="bg-cinema-850 border border-cinema-750 text-slate-200 placeholder-slate-500 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cinema-gold w-36"
            />
          </div>

          {(keyword || role || location || type) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-slate-400 hover:text-white underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{pageData?.totalElements || opportunities.length}</strong> opportunities
        </div>
      </div>

      {/* Grid of Opportunities */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-cinema-900/40 border border-cinema-800 animate-pulse p-6" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities found"
          description="Try adjusting your keywords or clearing the active filters to see all available cinema listings."
          action={{
            label: "Clear All Filters",
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
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-cinema-850">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-2 rounded-lg bg-cinema-900 border border-cinema-800 hover:bg-cinema-800 text-slate-300 disabled:opacity-40 transition flex items-center gap-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs text-slate-400">
            Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{pageData.totalPages}</strong>
          </span>
          <button
            onClick={() => setPage(p => Math.min(pageData.totalPages - 1, p + 1))}
            disabled={pageData.last}
            className="px-3 py-2 rounded-lg bg-cinema-900 border border-cinema-800 hover:bg-cinema-800 text-slate-300 disabled:opacity-40 transition flex items-center gap-1 text-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
