import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { ArrowRight, BookOpen, Users, Star, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Fetch latest 3 articles
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        setFeaturedArticles(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
        {/* Spline Background - Only on Desktop */}
        {!isMobile && (
          <div className="absolute inset-0 w-full h-full">
            <Spline scene="https://prod.spline.design/Q2XxUKq-MtlSGp6y/scene.splinecode" />
          </div>
        )}
        
        {/* Stronger Overlay for Light mode readability and Cinematic Depth */}
        {/*<div className="absolute inset-0 bg-white/60 dark:bg-background/70 backdrop-blur-[3px] pointer-events-none"></div>*/}
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pointer-events-none animate-[fadeInUp_1s_ease-out]">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-xl text-slate-900 dark:text-white">
            Plongez dans l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 drop-shadow-lg">Avenir</span>
          </h1>
          <p className="text-black dark:text-gray-400 text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-md font-medium">
  Découvrez des articles fascinants, partagez vos idées et rejoignez une communauté de créateurs passionnés.
</p>

          <div className="flex items-center justify-center gap-4 pointer-events-auto">
            <Link to="/articles" className="px-10 py-5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-bold text-lg hover:-translate-y-1 transition-[transform,shadow,opacity] duration-300 shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.5)] flex items-center justify-center gap-3 group">
              Commencer l'Exploration <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </div>
        
        {/* Cinematic bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </section>

      {/* Storytelling / Why Join Us Section */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Pourquoi rejoindre Blogger ?</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
              Une plateforme conçue pour l'excellence technique et le confort de lecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-3xl bg-background border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-[transform,shadow] duration-300 group will-change-transform">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
                <BookOpen size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Contenus Riches</h3>
              <p className="text-foreground/70 leading-relaxed">
                Découvrez des analyses poussées, des tutoriels exclusifs et des posts passionnants rédigés par des experts.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-[transform,shadow] duration-300 group will-change-transform">
              <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:-rotate-6 transition-transform">
                <Users size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Communauté</h3>
              <p className="text-foreground/70 leading-relaxed">
                Connectez-vous avec d'autres passionnés, échangez en commentaires et faites grandir votre réseau.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-[transform,shadow] duration-300 group will-change-transform">
              <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
                <Star size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Partagez vos Idées</h3>
              <p className="text-foreground/70 leading-relaxed">
                Notre éditeur élégant et minimaliste vous permet de publier vos articles en un rien de temps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Preview */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-extrabold mb-2">À la Une</h2>
              <p className="text-foreground/70">Découvrez les derniers articles publiés.</p>
            </div>
            <Link to="/articles" className="hidden sm:flex items-center text-primary font-medium hover:underline">
              Tout voir <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48 w-full col-span-1 md:col-span-2 lg:col-span-3">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map(article => (
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
                    <p className="text-foreground/70 text-sm mb-4 line-clamp-3 flex-1">{article.contenu}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                      <div className="flex items-center gap-2">
                         {article.auteur?.avatar ? 
                            <img src={article.auteur.avatar} className="w-6 h-6 rounded-full" /> : 
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{article.auteur?.name?.charAt(0)}</div>
                         }
                        <span className="text-sm font-medium">{article.auteur?.name}</span>
                      </div>
                      <span className="text-xs text-foreground/50">{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/articles" className="inline-flex items-center text-primary font-medium hover:underline">
              Voir tous les articles <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
