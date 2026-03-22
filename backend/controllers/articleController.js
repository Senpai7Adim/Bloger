import Article from "../models/Article.js";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── POST /api/articles ──────────────────────────────────────────────────────
export const createArticle = async (req, res) => {
  try {
    const { titre, contenu, date, categorie, tags, coverImage } = req.body;
    const article = await Article.create({
      titre,
      contenu,
      auteur: req.user._id,
      date: date ? new Date(date) : Date.now(),
      categorie,
      tags: tags || [],
      coverImage: coverImage || "",
    });
    const populated = await article.populate("auteur", "name avatar");
    return res.status(201).json({ message: "Article créé avec succès", article: populated });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── GET /api/articles ───────────────────────────────────────────────────────
export const getArticles = async (req, res) => {
  try {
    const { categorie, auteur, date } = req.query;
    const filter = {};
    if (categorie) filter.categorie = { $regex: categorie, $options: "i" };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }
    let query = Article.find(filter).populate("auteur", "name avatar").sort({ date: -1 });

    // Filter by author name (string search)
    if (auteur) {
      const articles = await query;
      const filtered = articles.filter((a) =>
        a.auteur?.name?.toLowerCase().includes(auteur.toLowerCase())
      );
      return res.status(200).json(filtered);
    }
    const articles = await query;
    return res.status(200).json(articles);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── GET /api/articles/search ────────────────────────────────────────────────
export const searchArticles = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: 'Le paramètre "query" est requis' });
    }
    const articles = await Article.find({
      $or: [
        { titre: { $regex: query, $options: "i" } },
        { contenu: { $regex: query, $options: "i" } },
      ],
    })
      .populate("auteur", "name avatar")
      .sort({ date: -1 });
    return res.status(200).json(articles);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── GET /api/articles/:id ───────────────────────────────────────────────────
export const getArticleById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });
    const article = await Article.findById(req.params.id).populate("auteur", "name avatar bio");
    if (!article) return res.status(404).json({ message: "Article non trouvé" });
    return res.status(200).json(article);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── PUT /api/articles/:id ───────────────────────────────────────────────────
export const updateArticle = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });
    if (article.auteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé : vous n'êtes pas l'auteur" });
    }
    const { titre, contenu, categorie, tags, coverImage } = req.body;
    const updateFields = {};
    if (titre !== undefined) updateFields.titre = titre;
    if (contenu !== undefined) updateFields.contenu = contenu;
    if (categorie !== undefined) updateFields.categorie = categorie;
    if (tags !== undefined) updateFields.tags = tags;
    if (coverImage !== undefined) updateFields.coverImage = coverImage;

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("auteur", "name avatar");

    return res.status(200).json({ message: "Article mis à jour", article: updated });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── DELETE /api/articles/:id ────────────────────────────────────────────────
export const deleteArticle = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });
    if (article.auteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé : vous n'êtes pas l'auteur" });
    }
    await article.deleteOne();
    return res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── POST /api/articles/:id/like ─────────────────────────────────────────────
export const toggleLike = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    const userId = req.user._id.toString();
    const alreadyLiked = article.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      article.likes = article.likes.filter((id) => id.toString() !== userId);
    } else {
      article.likes.push(req.user._id);
    }
    await article.save();

    return res.status(200).json({
      liked: !alreadyLiked,
      likesCount: article.likes.length,
      likes: article.likes,
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
