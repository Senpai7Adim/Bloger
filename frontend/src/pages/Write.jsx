import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { PenTool, Image as ImageIcon, Save, Loader2, List, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const Write = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    categorie: 'Technologie',
    tags: '',
    coverImage: ''
  });

  const categories = ["Technologie", "Développement", "Design", "Lifestyle"];

  useEffect(() => {
    if (isEditing) {
      const fetchArticle = async () => {
        try {
          const res = await api.get(`/articles/${id}`);
          const a = res.data;
          setFormData({
            titre: a.titre || '',
            contenu: a.contenu || '',
            categorie: a.categorie || 'Technologie',
            tags: a.tags ? a.tags.join(', ') : '',
            coverImage: a.coverImage || ''
          });
        } catch (err) {
          toast.error("Article introuvable ou erreur de chargement");
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id, navigate, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titre.trim() || !formData.contenu.trim()) {
      toast.error("Le titre et le contenu sont obligatoires");
      return;
    }

    setSaving(true);
    try {
      // Convert comma separated string to array
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

      const payload = {
        ...formData,
        tags: tagsArray
      };

      if (isEditing) {
        await api.put(`/articles/${id}`, payload);
        toast.success("Article mis à jour avec succès");
      } else {
        await api.post('/articles', payload);
        toast.success("Article publié avec succès !");
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 pl-4 border-l-4 border-primary">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <PenTool className="text-primary" size={32} />
            {isEditing ? 'Modifier l\'Article' : 'Nouvel Article'}
          </h1>
          <p className="text-foreground/60 mt-1">
            {isEditing ? 'Mettez à jour votre contenu et vos idées' : 'Partagez vos connaissances avec le monde'}
          </p>
        </div>

        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Titre de l'article (*)</label>
              <input
                type="text"
                name="titre"
                required
                className="w-full text-2xl md:text-3xl font-bold py-3 bg-transparent border-b-2 border-gray-200 dark:border-gray-800 focus:border-primary outline-none transition-colors placeholder:font-normal"
                placeholder="Un titre très accrocheur..."
                value={formData.titre}
                onChange={handleChange}
              />
            </div>

            {/* Cover Image */}
            <div>
               <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                 <ImageIcon size={18} /> Lier une image de couverture (URL)
               </label>
               <input
                 type="url"
                 name="coverImage"
                 className="w-full px-4 py-3 bg-background border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                 placeholder="https://images.unsplash.com/..."
                 value={formData.coverImage}
                 onChange={handleChange}
               />
               {formData.coverImage && (
                 <div className="mt-4 h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                   <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover preview" />
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Category */}
               <div>
                 <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <List size={18} /> Catégorie (*)
                 </label>
                 <select
                   name="categorie"
                   className="w-full px-4 py-3 bg-background border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                   value={formData.categorie}
                   onChange={handleChange}
                 >
                   {categories.map(cat => (
                     <option key={cat} value={cat}>{cat}</option>
                   ))}
                 </select>
               </div>

               {/* Tags */}
               <div>
                  <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                     <Tag size={18} /> Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    className="w-full px-4 py-3 bg-background border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="react, tailwind, frontend"
                    value={formData.tags}
                    onChange={handleChange}
                  />
               </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Contenu de l'article (*)</label>
              <textarea
                name="contenu"
                required
                className="w-full px-5 py-4 bg-background border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all resize-y min-h-[300px] text-lg leading-relaxed shadow-inner"
                placeholder="Rédigez votre chef-d'œuvre ici..."
                value={formData.contenu}
                onChange={handleChange}
              />
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                type="submit"
                disabled={saving || !formData.titre.trim() || !formData.contenu.trim()}
                className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                <span>{isEditing ? 'Enregistrer les modifications' : 'Publier l\'article'}</span>
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Write;
