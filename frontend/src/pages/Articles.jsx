import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Loader2 } from 'lucide-react';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ["Toutes", "Technologie", "Développement", "Design", "Lifestyle"];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let url = '/articles';
        if (searchQuery) {
          url = `/articles/search?query=${searchQuery}`;
        } else if (selectedCategory && selectedCategory !== 'Toutes') {
          url = `/articles?categorie=${selectedCategory}`;
        }
        const res = await api.get(url);
        
        // If we searched but ALSO have a category selected, filter the search results
        if (searchQuery && selectedCategory && selectedCategory !== 'Toutes') {
          setArticles(res.data.filter(a => a.categorie.toLowerCase() === selectedCategory.toLowerCase()));
        } else {
          setArticles(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Explorer les Articles</h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">Découvrez les réflexions de la communauté</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat || (!selectedCategory && cat === 'Toutes')
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-card text-foreground/70 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/40">
              <Search size={20} />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-card border border-gray-100 dark:border-gray-800 rounded-full focus:ring-2 focus:ring-primary outline-none shadow-sm"
              placeholder="Rechercher par mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Article Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link to={`/articles/${article._id}`} key={article._id} className="group flex flex-col bg-card border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-[transform,shadow] duration-300 transform hover:-translate-y-1 will-change-transform">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
                  {article.coverImage ? (
                    <img src={article.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={article.titre} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30 font-bold text-4xl group-hover:scale-110 transition-transform duration-500">
                      {article.titre.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-background/80 px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                    {article.categorie}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.titre}</h3>
                  <p className="text-foreground/70 text-sm mb-4 line-clamp-3 w-full break-words">{article.contenu}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-2">
                       {article.auteur?.avatar ? 
                          <img src={article.auteur.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" alt="avatar" /> : 
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">{article.auteur?.name?.charAt(0).toUpperCase()}</div>
                       }
                      <span className="text-sm font-medium">{article.auteur?.name}</span>
                    </div>
                    <span className="text-xs text-foreground/50">{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-3xl border border-gray-100 dark:border-gray-800">
            <Search className="mx-auto text-foreground/20 mb-4" size={48} />
            <h3 className="text-xl font-bold text-foreground/80">Aucun article trouvé</h3>
            <p className="text-foreground/50 mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
