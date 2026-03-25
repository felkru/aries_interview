"use client";

import { useState, useEffect } from "react";
import { SentimentBadge } from "./SentimentBadge";

export default function ResultsTable() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchResults() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/results", {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch results");
      setResults(data.results || []);
    } catch (e) {
      const userMessage =
        e.message === "Failed to fetch"
          ? "Network error — please check your connection and try again."
          : e.message || "Something went wrong. Please try again.";
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return (
      <section id="results-section" className="w-full space-y-3">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider px-1 font-heading">
          Past Analyses
        </h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="results-section" className="w-full">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-negative-bg border border-negative/20 text-negative text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex-1">{error}</span>
          <button onClick={fetchResults} className="text-xs underline hover:no-underline font-heading font-medium">
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section id="results-section" className="w-full text-center py-10">
        <div className="inline-flex flex-col items-center gap-3 text-text-muted">
          <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No analyses yet. Search for articles and analyze them!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="results-section" className="w-full space-y-3 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider font-heading">
          Past Analyses ({results.length})
        </h2>
        <button
          onClick={fetchResults}
          className="text-xs text-text-muted hover:text-accent transition-colors font-heading"
          id="refresh-results"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="results-table">
            <thead>
              <tr className="border-b border-border text-text-muted font-heading">
                <th className="text-left py-3 px-4 font-medium">Title</th>
                <th className="text-left py-3 px-4 font-medium">Source</th>
                <th className="text-left py-3 px-4 font-medium">Sentiment</th>
                <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Summary</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr
                  key={r._id || r.url || i}
                  className="border-b border-border/50 last:border-0 hover:bg-bg-card-hover/50 transition-colors"
                >
                  <td className="py-3 px-4 max-w-[200px]">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary hover:text-accent-hover transition-colors line-clamp-2 font-medium font-heading"
                    >
                      {r.title}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-text-secondary whitespace-nowrap">
                    {r.source || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <SentimentBadge
                      sentiment={r.sentiment}
                      confidence={r.confidence}
                    />
                  </td>
                  <td className="py-3 px-4 text-text-secondary max-w-[300px] line-clamp-2 hidden md:table-cell">
                    {r.summary}
                  </td>
                  <td className="py-3 px-4 text-text-muted whitespace-nowrap text-xs">
                    {r.analyzedAt
                      ? new Date(r.analyzedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
