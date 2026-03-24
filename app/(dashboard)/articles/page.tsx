"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArticleGrid } from "@/components/articles/article-grid";
import { CategoryFilter } from "@/components/articles/category-filter";
import { useArticles } from "@/hooks/use-articles";

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState("");
  const { articles, isLoading } = useArticles({
    category: selectedCategory,
    search: searchQuery,
  });

  // Reset category when searching
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory("");
    }
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">All Articles</h1>
        <p className="mt-1 text-muted-foreground">
          {searchQuery ? (
            <>
              Showing results for &quot;<span className="font-medium text-foreground">{searchQuery}</span>&quot;
            </>
          ) : (
            "Browse and manage all your published articles"
          )}
        </p>
      </motion.div>

      {/* Category Filter */}
      {!searchQuery && (
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-muted-foreground"
      >
        {!isLoading && (
          <span>
            {articles.length} article{articles.length !== 1 ? "s" : ""} found
          </span>
        )}
      </motion.div>

      {/* Articles Grid */}
      <ArticleGrid
        articles={articles}
        isLoading={isLoading}
        emptyMessage={
          searchQuery
            ? `No articles found for "${searchQuery}"`
            : "No articles found"
        }
      />
    </div>
  );
}
