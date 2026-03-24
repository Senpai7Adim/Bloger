"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ArticleEditor } from "@/components/articles/article-editor";
import { useArticle } from "@/hooks/use-articles";

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const { article, isLoading, isError } = useArticle(id);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-16"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </motion.div>
    );
  }

  if (isError || !article) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <h2 className="text-2xl font-bold">Article not found</h2>
        <p className="mt-2 text-muted-foreground">
          The article you&apos;re trying to edit doesn&apos;t exist.
        </p>
      </motion.div>
    );
  }

  return <ArticleEditor article={article} isEditing />;
}
