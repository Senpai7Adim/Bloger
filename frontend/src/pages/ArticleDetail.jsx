import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Heart, MessageSquare, Trash2, Edit, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, commentsRes] = await Promise.all([
          api.get(`/articles/${id}`),
          api.get(`/articles/${id}/comments`)
        ]);
        
        setArticle(articleRes.data);
        setComments(commentsRes.data);
        setLikesCount(articleRes.data.likesCount || 0);
        
        if (user && articleRes.data.likes) {
          setIsLiked(articleRes.data.likes.includes(user._id));
        }
      } catch (err) {
        toast.error("Article introuvable");
        navigate('/articles');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Connectez-vous pour aimer cet article");
      return;
    }
    
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const res = await api.post(`/articles/${id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      toast.error("Erreur lors de l'action");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/articles/${id}/comments`, { contenu: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
      toast.success("Commentaire ajouté");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout du commentaire");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success("Commentaire supprimé");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const isAuthor = user && article.auteur && user._id === article.auteur._id;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Image */}
      <div className="w-full h-64 md:h-96 bg-card border-b border-gray-100 dark:border-gray-800 relative">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.titre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-blue-500/20">
             <h1 className="text-6xl md:text-9xl font-black text-foreground/10">{article.titre.substring(0, 3).toUpperCase()}</h1>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-semibold text-sm">
              {article.categorie}
            </span>
            <span className="text-foreground/50 text-sm">
              Publié le {new Date(article.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">{article.titre}</h1>

          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-8 mb-8">
            <div className="flex items-center gap-4">
              {article.auteur?.avatar ? 
                <img src={article.auteur.avatar} className="w-12 h-12 rounded-full object-cover" alt="author avatar" /> : 
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl">{article.auteur?.name?.charAt(0).toUpperCase()}</div>
              }
              <div>
                <p className="font-bold text-lg">{article.auteur?.name}</p>
                {article.auteur?.bio && <p className="text-sm text-foreground/60">{article.auteur.bio}</p>}
              </div>
            </div>

            {isAuthor && (
              <div className="flex gap-2">
                <Link to={`/write/${article._id}`} className="p-2 text-foreground/60 hover:text-primary bg-background rounded-full transition-colors border border-gray-100 dark:border-gray-800">
                  <Edit size={20} />
                </Link>
              </div>
            )}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12 text-foreground/90 whitespace-pre-line">
            {article.contenu}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-background text-foreground/70 rounded-full text-sm font-medium border border-gray-100 dark:border-gray-800 shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions: Likes */}
          <div className="flex items-center gap-6 border-t border-b border-gray-100 dark:border-gray-800 py-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-red-500' : 'text-foreground/60 hover:text-red-500'}`}
            >
              <Heart size={28} className={`${isLiked ? 'fill-current' : 'group-hover:fill-red-500/20'} transition-all`} />
              <span className="text-xl font-bold">{likesCount}</span>
            </button>
            <div className="flex items-center gap-2 text-foreground/60">
              <MessageSquare size={28} />
              <span className="text-xl font-bold">{comments.length}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12" id="comments">
            <h3 className="text-2xl font-bold mb-8">Commentaires ({comments.length})</h3>

            {user ? (
              <form onSubmit={handleAddComment} className="mb-10 relative">
                <textarea
                  className="w-full bg-background border border-gray-200 dark:border-gray-800 rounded-2xl p-4 pr-16 focus:ring-2 focus:ring-primary outline-none transition-all resize-none min-h-[120px]"
                  placeholder="Partagez vos pensées..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="absolute bottom-4 right-4 p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-transform hover:scale-105 shadow-lg disabled:opacity-50"
                  disabled={!newComment.trim()}
                >
                  <Send size={18} />
                </button>
              </form>
            ) : (
              <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-10 text-center">
                <p className="text-foreground/60 mb-4">Connectez-vous pour participer à la discussion.</p>
                <Link to="/login" className="inline-block px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90">
                  Se connecter
                </Link>
              </div>
            )}

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-background rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex gap-4">
                  {comment.auteur?.avatar ? 
                    <img src={comment.auteur.avatar} className="w-10 h-10 flex-shrink-0 rounded-full object-cover" alt="avatar" /> : 
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">{comment.auteur?.name?.charAt(0).toUpperCase()}</div>
                  }
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold mr-2">{comment.auteur?.name}</span>
                        <span className="text-xs text-foreground/40">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      {user && user._id === comment.auteur?._id && (
                        <button 
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-foreground/80 break-words">{comment.contenu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
