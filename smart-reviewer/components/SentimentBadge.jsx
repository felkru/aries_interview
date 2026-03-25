"use client";

export function SentimentBadge({ sentiment, confidence }) {
  const config = {
    positive: {
      bg: "bg-positive-bg",
      text: "text-positive",
      border: "border-positive/30",
      icon: "↑",
    },
    neutral: {
      bg: "bg-neutral-bg",
      text: "text-neutral-sentiment",
      border: "border-neutral-sentiment/30",
      icon: "→",
    },
    negative: {
      bg: "bg-negative-bg",
      text: "text-negative",
      border: "border-negative/30",
      icon: "↓",
    },
  };

  const c = config[sentiment] || config.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className="text-sm">{c.icon}</span>
      {sentiment}
      {confidence !== undefined && (
        <span className="opacity-70 ml-0.5">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
}
