"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, FileText, Users, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleGrid } from "@/components/articles/article-grid";
import { CategoryFilter } from "@/components/articles/category-filter";
import { useArticles } from "@/hooks/use-articles";

const stats = [
  { label: "Total Articles", value: "128", icon: FileText, trend: "+12%" },
  { label: "Total Views", value: "45.2K", icon: Eye, trend: "+8%" },
  { label: "Total Authors", value: "24", icon: Users, trend: "+3" },
  { label: "Engagement", value: "67%", icon: TrendingUp, trend: "+5%" },
];

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { articles, isLoading } = useArticles({ category: selectedCategory });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here&apos;s an overview of your blog.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="card-spotlight border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-emerald-500">{stat.trend} from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Articles Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Articles</h2>
            <p className="text-sm text-muted-foreground">
              Browse and manage your published content
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Articles Grid */}
        <ArticleGrid
          articles={articles}
          isLoading={isLoading}
          emptyMessage="No articles found in this category"
        />
      </motion.div>
    </div>
  );
}
