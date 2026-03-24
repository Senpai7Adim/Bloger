"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { ArticleCard, type Article } from "./article-card";
import { ArticleCardSkeleton } from "./article-card-skeleton";

interface ArticleGridProps {
  articles: Article[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ArticleGrid({
  articles,
  isLoading = false,
  emptyMessage = "No articles found",
}: ArticleGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="mb-4 rounded-full bg-muted p-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {articles.map((article, index) => (
          <ArticleCard key={article._id} article={article} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}
