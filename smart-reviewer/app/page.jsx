"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ArticleList from "@/components/ArticleList";
import ResultsTable from "@/components/ResultsTable";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  async function handleSearch(query) {
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
      setSearchError(e.message);
      setArticles([]);
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────────────── */}
      <header className="relative pt-16 pb-12 px-6 text-center overflow-hidden">
        {/* Gradient bg orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl" />
          <div className="absolute top-[-10%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-600/6 blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
          {/* Logo icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 animate-pulse-glow">
            <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
            Smart Reviewer
          </h1>
          <p className="text-lg text-text-secondary max-w-lg mx-auto">
            AI-powered news sentiment analysis. Search, analyze, and track how the media covers any topic.
          </p>

          {/* Search */}
          <div className="pt-4">
            <SearchBar onSearch={handleSearch} isLoading={searchLoading} />
          </div>
        </div>
      </header>

      {/* ── Tab navigation ──────────────────────────── */}
      <div className="max-w-4xl w-full mx-auto px-6">
        <nav className="flex gap-1 p-1 rounded-xl bg-bg-secondary border border-border w-fit" id="tab-nav">
          <button
            id="tab-search"
            onClick={() => setActiveTab("search")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "search"
                ? "bg-accent text-white shadow-md"
                : "text-text-muted hover:text-text-primary hover:bg-bg-card"
            }`}
          >
            Search
          </button>
          <button
            id="tab-results"
            onClick={() => setActiveTab("results")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "results"
                ? "bg-accent text-white shadow-md"
                : "text-text-muted hover:text-text-primary hover:bg-bg-card"
            }`}
          >
            Past Analyses
          </button>
        </nav>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="max-w-4xl w-full mx-auto px-6 py-8 flex-1">
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

            {/* Error state */}
            {searchError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-negative-bg border border-negative/20 text-negative text-sm animate-fade-in">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {searchError}
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

        {activeTab === "results" && (
          <div className="animate-fade-in">
            <ResultsTable />
          </div>
        )}
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="py-6 px-6 text-center text-xs text-text-muted border-t border-border">
        Built with Next.js, Tailwind CSS, MongoDB Atlas & OpenAI
      </footer>
    </main>
  );
}
