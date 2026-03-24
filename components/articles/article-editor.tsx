"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "./tag-input";
import { articlesApi, type Article, type ArticleInput } from "@/lib/api";
import { cn } from "@/lib/utils";

const categories = [
  "Tech",
  "Health",
  "Lifestyle",
  "Business",
  "Science",
  "Travel",
  "Food",
  "Sports",
  "Entertainment",
];

interface ArticleEditorProps {
  article?: Article;
  isEditing?: boolean;
}

interface FormErrors {
  titre?: string;
  contenu?: string;
  categorie?: string;
}

export function ArticleEditor({ article, isEditing = false }: ArticleEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ArticleInput>({
    titre: "",
    contenu: "",
    categorie: "",
    tags: [],
    coverImage: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (article) {
      setFormData({
        titre: article.titre,
        contenu: article.contenu,
        categorie: article.categorie,
        tags: article.tags || [],
        coverImage: article.coverImage || "",
      });
    }
  }, [article]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.titre.trim()) {
      newErrors.titre = "Title is required";
    }
    if (!formData.contenu.trim()) {
      newErrors.contenu = "Content is required";
    }
    if (!formData.categorie) {
      newErrors.categorie = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing && article) {
        await articlesApi.update(article._id, formData);
        router.push(`/articles/${article._id}`);
      } else {
        const result = await articlesApi.create(formData);
        router.push(`/articles/${result.article._id}`);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to save article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof ArticleInput,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={isEditing && article ? `/articles/${article._id}` : "/articles"}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? "Edit Article" : "Create New Article"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Make changes to your article"
                : "Write and publish a new article"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && article && (
            <Button variant="outline" asChild>
              <Link href={`/articles/${article._id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update" : "Publish"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
          <Input
            id="coverImage"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.coverImage}
            onChange={(e) => handleChange("coverImage", e.target.value)}
            className="bg-muted/50"
          />
          {formData.coverImage && (
            <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-border/50">
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter article title..."
            value={formData.titre}
            onChange={(e) => handleChange("titre", e.target.value)}
            className={cn(
              "bg-muted/50 text-lg font-medium",
              errors.titre && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.titre && (
            <p className="text-sm text-destructive">{errors.titre}</p>
          )}
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.categorie}
            onValueChange={(value) => handleChange("categorie", value)}
          >
            <SelectTrigger
              className={cn(
                "bg-muted/50",
                errors.categorie && "border-destructive focus:ring-destructive"
              )}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categorie && (
            <p className="text-sm text-destructive">{errors.categorie}</p>
          )}
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <Label>Tags</Label>
          <TagInput
            value={formData.tags || []}
            onChange={(tags) => handleChange("tags", tags)}
            placeholder="Add tags (press Enter or comma to add)"
            className="bg-muted/50"
          />
          <p className="text-xs text-muted-foreground">
            Press Enter or comma to add a tag. Click the X to remove.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="content">
            Content <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="content"
            placeholder="Write your article content here... You can use HTML for formatting."
            value={formData.contenu}
            onChange={(e) => handleChange("contenu", e.target.value)}
            rows={15}
            className={cn(
              "bg-muted/50 resize-none leading-relaxed",
              errors.contenu && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.contenu && (
            <p className="text-sm text-destructive">{errors.contenu}</p>
          )}
          <p className="text-xs text-muted-foreground">
            You can use HTML tags for formatting (e.g., {"<p>"}, {"<h2>"}, {"<strong>"}, {"<em>"})
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
}
