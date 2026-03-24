import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getExcerpt(content: string, maxLength: number = 150): string {
  const stripped = content.replace(/<[^>]*>/g, "");
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).trim() + "...";
}
