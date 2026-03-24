import useSWR from "swr";
import { articlesApi, type Article } from "@/lib/api";

interface UseArticlesOptions {
  category?: string;
  search?: string;
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { category, search } = options;

  const { data, error, isLoading, mutate } = useSWR<Article[]>(
    ["articles", category, search],
    async () => {
      if (search) {
        return articlesApi.search(search);
      }
      return articlesApi.getAll(category ? { categorie: category } : undefined);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    articles: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useArticle(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Article>(
    id ? ["article", id] : null,
    () => articlesApi.getById(id!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    article: data,
    isLoading,
    isError: error,
    mutate,
  };
}
