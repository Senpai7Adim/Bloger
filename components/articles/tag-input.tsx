"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  className,
  error,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
        error && "border-destructive focus-within:ring-destructive",
        className
      )}
    >
      {value.map((tag, index) => (
        <Badge
          key={tag}
          variant="secondary"
          className="gap-1 pl-2 pr-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="rounded-sm hover:bg-muted-foreground/20 p-0.5"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag}</span>
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ""}
        className="h-auto flex-1 min-w-[120px] border-0 p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
