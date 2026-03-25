"use client";

import { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import ArticleList from "@/components/ArticleList";
import ResultsTable from "@/components/ResultsTable";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [resultCount, setResultCount] = useState(null);
  const lastQueryRef = useRef("");

  // Fix 9: Fetch count for tab badge on mount
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/results?count=1");
        const data = await res.json();
        if (res.ok && data.results) {
          setResultCount(data.results.length);
        }
      } catch {
        // silently ignore — badge just won't show
      }
    }
    fetchCount();
  }, []);

  async function handleSearch(query) {
    lastQueryRef.current = query;
    setSearchLoading(true);
    setSearchError(null);
    setHasSearched(true);
    setActiveTab("search");
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch news");
      setArticles(data.articles || []);
    } catch (e) {
      // Fix C5: User-friendly error message
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

  // Fix 8: Retry handler
  function handleRetry() {
    if (lastQueryRef.current) {
      handleSearch(lastQueryRef.current);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────────────── */}
      <header className="relative pt-16 pb-12 px-6 text-center overflow-hidden">
        {/* Gradient bg orbs — warm anthropic tones */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.06] blur-3xl" />
          <div className="absolute top-[-10%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#6a9bcc]/[0.05] blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
          {/* Logo icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 animate-pulse-glow">
            <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>

          {/* Fix 1: break-words on subtitle */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary font-heading">
            Smart Reviewer
          </h1>
          <p className="text-lg text-text-secondary max-w-lg mx-auto break-words">
            AI-powered news sentiment analysis. Search, analyze, and track how the media covers any topic.
          </p>

          {/* Fix 1: overflow-hidden on search container */}
          <div className="pt-4 overflow-hidden">
            <SearchBar onSearch={handleSearch} isLoading={searchLoading} />
          </div>
        </div>
      </header>

      {/* ── Fix 7: ARIA tab semantics ───────────────── */}
      <div className="max-w-4xl w-full mx-auto px-6">
        <nav
          role="tablist"
          aria-label="App sections"
          className="flex gap-1 p-1 rounded-xl bg-bg-secondary border border-border w-fit"
          id="tab-nav"
        >
          <button
            id="tab-search"
            role="tab"
            aria-selected={activeTab === "search"}
            aria-controls="panel-search"
            onClick={() => setActiveTab("search")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-heading ${
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
              setActiveTab("results");
              // Refresh count when switching to results
              fetch("/api/results?count=1")
                .then((r) => r.json())
                .then((d) => d.results && setResultCount(d.results.length))
                .catch(() => {});
            }}
            className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-heading ${
              activeTab === "results"
                ? "bg-accent text-white shadow-md"
                : "text-text-muted hover:text-text-primary hover:bg-bg-card"
            }`}
          >
            Past Analyses
            {/* Fix 9: Count badge */}
            {resultCount !== null && resultCount > 0 && (
              <span
                className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full transition-colors ${
                  activeTab === "results"
                    ? "bg-white/20 text-white"
                    : "bg-accent/15 text-accent"
                }`}
              >
                {resultCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="max-w-4xl w-full mx-auto px-6 py-8 flex-1">
        {/* Search tab panel */}
        <div
          id="panel-search"
          role="tabpanel"
          aria-labelledby="tab-search"
          hidden={activeTab !== "search"}
        >
          {activeTab === "search" && (
            <div className="space-y-6 animate-fade-in">
              {/* Loading state */}
              {searchLoading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-32 w-full" />
                  ))}
                </div>
              )}

              {/* Fix 8: Error state with retry button */}
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
                    <div className="text-center py-16 animate-fade-in">
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

              {/* Initial state */}
              {!hasSearched && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="inline-flex flex-col items-center gap-3 text-text-muted">
                    <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm">Enter a topic above to get started</p>
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

      {/* ── Footer — Fix C6: Remove tech stack exposure ── */}
      <footer className="py-6 px-6 text-center text-xs text-text-muted border-t border-border font-heading">
        Smart Reviewer — AI-powered news analysis
      </footer>
    </main>
  );
}
