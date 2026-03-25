"use client";

export default function Spinner({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  return (
    <div
      className={`${sizeMap[size]} border-text-muted border-t-accent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
