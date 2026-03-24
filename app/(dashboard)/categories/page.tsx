"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/use-articles";

const categoryColors: Record<string, string> = {
  Tech: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Health: "bg-green-500/10 text-green-500 border-green-500/20",
  Lifestyle: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  Business: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Science: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Travel: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  Food: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Sports: "bg-red-500/10 text-red-500 border-red-500/20",
  Entertainment: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
};

export default function CategoriesPage() {
  const { articles, isLoading } = useArticles();

  const categoryStats = useMemo(() => {
    if (!articles) return [];

    const stats = articles.reduce(
      (acc, article) => {
        const category = article.categorie;
        if (!acc[category]) {
          acc[category] = { count: 0, latestDate: article.date };
        }
        acc[category].count++;
        if (new Date(article.date) > new Date(acc[category].latestDate)) {
          acc[category].latestDate = article.date;
        }
        return acc;
      },
      {} as Record<string, { count: number; latestDate: string }>
    );

    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        count: data.count,
        latestDate: data.latestDate,
      }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-2 h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="mt-1 text-muted-foreground">
          Browse articles by category
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">
            {categoryStats.length} Categories
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">
            {articles?.length || 0} Total Articles
          </span>
        </div>
      </motion.div>

      {/* Categories Grid */}
      {categoryStats.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 rounded-full bg-muted p-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No categories yet</h3>
          <p className="text-sm text-muted-foreground">
            Categories will appear here once you publish articles.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryStats.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group card-spotlight border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={categoryColors[category.name] || ""}
                    >
                      {category.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link href={`/articles?category=${category.name}`}>
                        View
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{category.count}</span>
                    <span className="text-sm text-muted-foreground">
                      article{category.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Last updated:{" "}
                    {new Date(category.latestDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
