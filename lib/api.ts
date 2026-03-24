const API_BASE = "/api";

export interface Article {
  _id: string;
  titre: string;
  contenu: string;
  auteur: {
    _id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  date: string;
  categorie: string;
  tags: string[];
  coverImage?: string;
  likes: string[];
  likesCount: number;
}

export interface ArticleInput {
  titre: string;
  contenu: string;
  categorie: string;
  tags?: string[];
  coverImage?: string;
}

// Get auth token from localStorage (client-side only)
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Fetch wrapper with auth
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Articles API
export const articlesApi = {
  getAll: async (params?: {
    categorie?: string;
    auteur?: string;
    date?: string;
  }): Promise<Article[]> => {
    const searchParams = new URLSearchParams();
    if (params?.categorie) searchParams.set("categorie", params.categorie);
    if (params?.auteur) searchParams.set("auteur", params.auteur);
    if (params?.date) searchParams.set("date", params.date);

    const query = searchParams.toString();
    return fetchWithAuth(`${API_BASE}/articles${query ? `?${query}` : ""}`);
  },

  getById: async (id: string): Promise<Article> => {
    return fetchWithAuth(`${API_BASE}/articles/${id}`);
  },

  search: async (query: string): Promise<Article[]> => {
    return fetchWithAuth(
      `${API_BASE}/articles/search?query=${encodeURIComponent(query)}`
    );
  },

  create: async (data: ArticleInput): Promise<{ article: Article }> => {
    return fetchWithAuth(`${API_BASE}/articles`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<ArticleInput>
  ): Promise<{ article: Article }> => {
    return fetchWithAuth(`${API_BASE}/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return fetchWithAuth(`${API_BASE}/articles/${id}`, {
      method: "DELETE",
    });
  },

  toggleLike: async (
    id: string
  ): Promise<{ liked: boolean; likesCount: number }> => {
    return fetchWithAuth(`${API_BASE}/articles/${id}/like`, {
      method: "POST",
    });
  },
};

// Categories - derived from articles
export const categoriesApi = {
  getAll: async (): Promise<string[]> => {
    const articles = await articlesApi.getAll();
    const categories = [...new Set(articles.map((a) => a.categorie))];
    return categories.sort();
  },
};
