"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleCardSkeletonProps {
  index?: number;
}

export function ArticleCardSkeleton({ index = 0 }: ArticleCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="h-full overflow-hidden border-border/50 bg-card/80">
        {/* Cover Image Skeleton */}
        <Skeleton className="h-48 w-full rounded-none" />

        <CardHeader className="relative pb-2">
          {/* Category Badge Skeleton */}
          <Skeleton className="absolute -top-3 left-4 h-5 w-16 rounded-full" />

          {/* Title Skeleton */}
          <div className="mt-2 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Excerpt Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Author & Date Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
