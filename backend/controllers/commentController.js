import Comment from "../models/Comment.js";
import Article from "../models/Article.js";

// ─── GET /api/articles/:id/comments ─────────────────────────────────────────
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.id })
      .populate("auteur", "name avatar")
      .sort({ createdAt: 1 });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── POST /api/articles/:id/comments ────────────────────────────────────────
export const addComment = async (req, res) => {
  try {
    const { contenu } = req.body;
    if (!contenu || contenu.trim() === "") {
      return res.status(400).json({ message: "Le contenu est requis" });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    const comment = await Comment.create({
      article: req.params.id,
      auteur: req.user._id,
      contenu,
    });

    const populated = await comment.populate("auteur", "name avatar");
    return res.status(201).json(populated);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── DELETE /api/comments/:id ────────────────────────────────────────────────
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    if (comment.auteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    await comment.deleteOne();
    return res.status(200).json({ message: "Commentaire supprimé" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
