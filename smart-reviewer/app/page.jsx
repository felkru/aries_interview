"use client";

import { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import ArticleList from "@/components/ArticleList";
import ResultsTable from "@/components/ResultsTable";

const QUICK_TOPICS = [
  "AI",
  "Politics",
  "Ukraine",
  "Climate",
  "Tech",
  "Economy",
  "Health",
  "Space",
];

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [resultCount, setResultCount] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);
  const lastQueryRef = useRef("");
  const didAutoSearch = useRef(false);

  // Fetch count for tab badge on mount
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/results?count=1");
        const data = await res.json();
        if (res.ok && data.results) {
          setResultCount(data.results.length);
        }
      } catch {
        setResultCount(0);
      }
    }
    fetchCount();
  }, []);

  // Auto-search a random topic on first load
  useEffect(() => {
    if (didAutoSearch.current) return;
    didAutoSearch.current = true;
    const topic = QUICK_TOPICS[Math.floor(Math.random() * QUICK_TOPICS.length)];
    setActiveTopic(topic);
    handleSearch(topic, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(query, fromTopic = false) {
    lastQueryRef.current = query;
    setSearchLoading(true);
    setSearchError(null);
    setHasSearched(true);
    setHasInteracted(true);
    setActiveTab("search");
    // Track which topic chip is active (clear if manual search)
    if (fromTopic) {
      setActiveTopic(query);
    } else {
      setActiveTopic(null);
    }
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch news");
      setArticles(data.articles || []);
    } catch (e) {
      const userMessage =
        e.message === "Failed to fetch"
          ? "Network error — please check your connection and try again."
          : e.message || "Something went wrong. Please try again.";
      setSearchError(userMessage);
      setArticles([]);
    } finally {
      setSearchLoading(false);
    }
  }

  function handleRetry() {
    if (lastQueryRef.current) {
      handleSearch(lastQueryRef.current);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Compact navbar ───────────────────────────── */}
      <header className="sticky top-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Top row: logo + search + tabs */}
          <div className="flex items-center gap-4 h-16">
            {/* Logo + brand */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 animate-pulse-glow">
                <svg className="w-4.5 h-4.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-text-primary font-heading hidden sm:block leading-tight">
                Smart Reviewer
                <span className="block text-[11px] font-normal text-text-muted tracking-normal">AI-powered sentiment analysis</span>
              </span>
            </div>

            {/* Search bar — grows to fill space */}
            <div className="flex-1 min-w-0 max-w-xl overflow-hidden">
              <SearchBar onSearch={handleSearch} isLoading={searchLoading} />
            </div>

            {/* Tab navigation */}
            <nav
              role="tablist"
              aria-label="App sections"
              className="flex gap-1 p-1 rounded-xl bg-bg-secondary border border-border shrink-0"
              id="tab-nav"
            >
              <button
                id="tab-search"
                role="tab"
                aria-selected={activeTab === "search"}
                aria-controls="panel-search"
                onClick={() => setActiveTab("search")}
                className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 font-heading ${
                  activeTab === "search"
                    ? "bg-accent text-white shadow-md"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-card"
                }`}
              >
                Search
              </button>
              <button
                id="tab-results"
                role="tab"
                aria-selected={activeTab === "results"}
                aria-controls="panel-results"
                onClick={() => {
                  setHasInteracted(true);
                  setActiveTab("results");
                  fetch("/api/results?count=1")
                    .then((r) => r.json())
                    .then((d) => d.results && setResultCount(d.results.length))
                    .catch(() => {});
                }}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 font-heading ${
                  activeTab === "results"
                    ? "bg-accent text-white shadow-md"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-card"
                }`}
              >
                <span className="hidden sm:inline">Past Analyses</span>
                <span className="sm:hidden">History</span>
                {/* Always reserve space for badge — skeleton while loading, invisible when 0 */}
                <span
                  className={`inline-flex items-center justify-center min-w-[1.75rem] h-5 px-1.5 text-xs font-semibold rounded-full transition-colors ${
                    resultCount === null
                      ? "skeleton"
                      : resultCount === 0
                        ? "invisible"
                        : activeTab === "results"
                          ? "bg-white/20 text-white"
                          : "bg-accent/15 text-accent"
                  }`}
                >
                  {resultCount === null ? "\u00A0" : resultCount}
                </span>
              </button>
            </nav>
          </div>

          {/* Quick topic chips — below search, only visible on Search tab */}
          {activeTab === "search" && (
            <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-none">
              <span className="text-xs text-text-muted font-heading shrink-0">Trending:</span>
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleSearch(topic, true)}
                  disabled={searchLoading}
                  className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-heading ${
                    activeTopic === topic
                      ? "bg-accent/15 border-accent/40 text-accent"
                      : "border-border bg-bg-card hover:bg-bg-card-hover hover:border-accent/30 text-text-secondary hover:text-accent"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Content ─────────────────────────────────── */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* Search tab panel */}
        <div
          id="panel-search"
          role="tabpanel"
          aria-labelledby="tab-search"
          hidden={activeTab !== "search"}
        >
          {activeTab === "search" && (
            <div className={`space-y-6${hasInteracted ? ' animate-fade-in' : ''}`}>
              {/* Loading state */}
              {searchLoading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-32 w-full" />
                  ))}
                </div>
              )}

              {/* Error state with retry button */}
              {searchError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-negative-bg border border-negative/20 text-negative text-sm animate-fade-in">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="flex-1">{searchError}</span>
                  <button
                    onClick={handleRetry}
                    className="text-xs underline hover:no-underline whitespace-nowrap font-heading font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Results */}
              {!searchLoading && !searchError && (
                <>
                  <ArticleList articles={articles} />

                  {/* Empty state after search */}
                  {hasSearched && articles.length === 0 && (
                    <div className="text-center py-20 animate-fade-in">
                      <div className="inline-flex flex-col items-center gap-3 text-text-muted">
                        <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-sm">No articles found. Try a different search term.</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Initial state — no animation to avoid CLS on first load */}
              {!hasSearched && (
                <div className="text-center py-20">
                  <div className="inline-flex flex-col items-center gap-4 text-text-muted">
                    <svg className="w-14 h-14 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-base font-heading font-medium text-text-secondary">Search or pick a topic</p>
                      <p className="text-sm">Use the search bar or click a trending topic to get started</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results tab panel */}
        <div
          id="panel-results"
          role="tabpanel"
          aria-labelledby="tab-results"
          hidden={activeTab !== "results"}
        >
          {activeTab === "results" && (
            <div className="animate-fade-in">
              <ResultsTable />
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="py-4 px-6 text-center text-xs text-text-muted border-t border-border font-heading">
        Smart Reviewer — AI-powered news analysis
      </footer>
    </main>
  );
}
