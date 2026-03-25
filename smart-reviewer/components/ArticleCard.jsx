"use client";

import { useState } from "react";
import AnalysisView from "./AnalysisView";

export default function ArticleCard({ article }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setReview(data.review);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="glass-card p-5 space-y-3 transition-all duration-300 hover:translate-y-[-2px] animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-text-primary hover:text-accent-hover transition-colors duration-200 line-clamp-2"
          >
            {article.title}
          </a>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-text-muted">
            {article.source?.name && (
              <span className="px-2 py-0.5 bg-bg-badge rounded-md font-medium">
                {article.source.name}
              </span>
            )}
            {publishedDate && <span>{publishedDate}</span>}
          </div>
        </div>

        {article.image && (
          <img
            src={article.image}
            alt=""
            className="w-20 h-14 rounded-lg object-cover shrink-0 border border-border"
          />
        )}
      </div>

      {/* Description */}
      {article.description && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {article.description}
        </p>
      )}

      {/* Analyze button */}
      {!review && (
        <button
          id={`analyze-${encodeURIComponent(article.url).slice(0, 30)}`}
          onClick={handleAnalyze}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 hover:border-accent/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Analyze
            </>
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="animate-fade-in flex items-center gap-2 px-3 py-2 rounded-lg bg-negative-bg border border-negative/20 text-negative text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Analysis result */}
      <AnalysisView review={review} />
    </article>
  );
}
