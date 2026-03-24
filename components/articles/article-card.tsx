"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getExcerpt } from "@/lib/utils";

export interface Article {
  _id: string;
  titre: string;
  contenu: string;
  auteur: {
    _id: string;
    name: string;
    avatar?: string;
  };
  date: string;
  categorie: string;
  tags: string[];
  coverImage?: string;
  likesCount?: number;
}

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/articles/${article._id}`}>
        <Card className="group card-spotlight h-full cursor-pointer overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.titre}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>
          )}

          <CardHeader className="relative pb-2">
            {/* Category Badge */}
            <Badge
              variant="category"
              className="absolute -top-3 left-4 shadow-sm"
            >
              {article.categorie}
            </Badge>

            {/* Title */}
            <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
              {article.titre}
            </h3>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Excerpt */}
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {getExcerpt(article.contenu)}
            </p>

            {/* Author & Date */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={article.auteur?.avatar} />
                  <AvatarFallback className="text-[10px]">
                    {article.auteur?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{article.auteur?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(article.date)}</span>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{article.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
