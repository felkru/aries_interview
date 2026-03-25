"use client";

import { useState } from "react";

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full" id="search-form">
      {/* Visually-hidden label for screen readers */}
      <label htmlFor="search-input" className="sr-only">Search news topics</label>

      <div className="relative group">
        {/* Glow effect behind */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/12 to-secondary-accent/12 rounded-xl opacity-0 group-focus-within:opacity-100 blur-lg transition-opacity duration-500" />

        <div className="relative flex items-center">
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search topics (e.g. "AI regulation")'
            disabled={isLoading}
            className="w-full py-2.5 pl-4 pr-11 rounded-xl bg-bg-input text-text-primary placeholder:text-text-muted border border-border focus:border-accent focus:ring-2 focus:ring-ring outline-none transition-all duration-300 disabled:opacity-50 font-heading text-sm"
          />

          <button
            id="search-button"
            type="submit"
            disabled={isLoading || !query.trim()}
            aria-label={isLoading ? "Searching…" : "Search"}
            className="absolute right-1.5 p-2 rounded-lg bg-accent hover:bg-accent-hover text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
