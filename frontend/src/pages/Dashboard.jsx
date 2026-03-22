import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Edit3, Trash2, Plus, FileText, Loader2, Eye, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        // Find all articles and filter manually to get current user's, 
        // since we didn't explicitly create an /articles/me endpoint
        // (Alternatively, searching by auteur name or ID could be done on backend)
        const res = await api.get(`/articles`);
        const filtered = res.data.filter(a => a.auteur && a.auteur._id === user._id);
        setMyArticles(filtered);
      } catch (err) {
        toast.error("Erreur lors du chargement de vos articles");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyArticles();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.")) return;
    try {
      await api.delete(`/articles/${id}`);
      setMyArticles(myArticles.filter(a => a._id !== id));
      toast.success("Article supprimé définitivement");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-card rounded-3xl p-8 mb-12 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8">
          {user.avatar ? (
            <img src={user.avatar} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-background" alt="avatar" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-bold text-5xl shadow-lg border-4 border-background">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold mb-2">{user.name}</h1>
            <p className="text-foreground/60 mb-4">{user.email}</p>
            {user.bio && <p className="text-foreground/80 mb-6 max-w-lg mx-auto md:mx-0 border-l-4 border-primary pl-4">{user.bio}</p>}
            
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Link to="/write" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-md">
                <Plus size={18} />
                <span>Nouvel Article</span>
              </Link>
              <button onClick={logout} className="px-5 py-2.5 rounded-full font-medium border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-500/50 transition-colors">
                Déconnexion
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center bg-background px-8 py-6 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="text-4xl font-black text-primary mb-1">{myArticles.length}</div>
            <div className="text-sm font-medium text-foreground/50 uppercase tracking-wider">Publications</div>
          </div>
        </div>

        {/* My Articles List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText size={24} className="text-primary" />
            Mes Articles
          </h2>
          
          {myArticles.length > 0 ? (
            <div className="bg-card rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {myArticles.map(article => (
                  <div key={article._id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center gap-6">
                    {/* Img Thumbnail */}
                    <div className="w-full md:w-32 h-24 bg-background rounded-xl overflow-hidden flex-shrink-0">
                      {article.coverImage ? (
                        <img src={article.coverImage} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                          {article.categorie?.substring(0, 3)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md uppercase tracking-wider">
                          {article.categorie}
                        </span>
                        <span className="text-xs text-foreground/40">
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                      </div>
                      <Link to={`/articles/${article._id}`} className="text-xl font-bold hover:text-primary transition-colors line-clamp-1 mb-2">
                        {article.titre}
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-foreground/60">
                        <span className="flex items-center gap-1"><Heart size={14} className="text-red-400" /> {article.likes?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center md:flex-col gap-2 mt-4 md:mt-0">
                      <Link to={`/articles/${article._id}`} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-background transition-colors text-foreground/70" title="Voir">
                        <Eye size={18} />
                      </Link>
                      <Link to={`/write/${article._id}`} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 hover:border-blue-500/50 transition-colors text-foreground/70" title="Modifier">
                        <Edit3 size={18} />
                      </Link>
                      <button onClick={() => handleDelete(article._id)} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-500/50 transition-colors text-foreground/70" title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 text-foreground/20">
                <FileText size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Aucun article publié</h3>
              <p className="text-foreground/60 mb-8 max-w-sm mx-auto">Vous n'avez pas encore publié d'articles. Lancez-vous et partagez votre première histoire !</p>
              <Link to="/write" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 inline-flex items-center gap-2">
                <Plus size={20} />
                <span>Créer mon premier article</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
