"use client";

import ArticleCard from "./ArticleCard";

export default function ArticleList({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section id="article-list" className="space-y-4 w-full">
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider px-1 font-heading">
        {articles.length} article{articles.length !== 1 ? "s" : ""} found
      </h2>
      <div className="grid gap-4">
        {articles.map((article, i) => (
          <div key={article.url || i} style={{ animationDelay: `${i * 60}ms` }}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
