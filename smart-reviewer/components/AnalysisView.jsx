"use client";

import { SentimentBadge } from "./SentimentBadge";

export default function AnalysisView({ review }) {
  if (!review) return null;

  return (
    <div className="animate-fade-in mt-4 p-5 rounded-xl bg-bg-secondary border border-border space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          AI Analysis
        </h4>
        <SentimentBadge
          sentiment={review.sentiment}
          confidence={review.confidence}
        />
      </div>
      <p className="text-sm text-text-primary/90 leading-relaxed">
        {review.summary}
      </p>
    </div>
  );
}
