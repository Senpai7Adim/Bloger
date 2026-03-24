"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const categories = [
  "All",
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

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {categories.map((category, index) => {
            const isSelected =
              selectedCategory === category ||
              (category === "All" && !selectedCategory);

            return (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={() =>
                  onCategoryChange(category === "All" ? "" : category)
                }
                className="relative"
              >
                <Badge
                  variant={isSelected ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer px-4 py-1.5 text-sm transition-all duration-200 hover:scale-105",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {category}
                </Badge>
              </motion.button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </motion.div>
  );
}
