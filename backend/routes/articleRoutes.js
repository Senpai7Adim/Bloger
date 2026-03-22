import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
  toggleLike,
} from "../controllers/articleController.js";
import {
  validateArticle,
  validateArticleUpdate,
  handleValidation,
} from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import commentRouter from "./commentRoutes.js";
import { protect as authProtect } from "../middleware/auth.js";
import { deleteComment } from "./commentRoutes.js";

const router = express.Router();

// Re-route comments to comment router
router.use("/:id/comments", commentRouter);

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Gestion des articles du blog
 */

// ── Search (before /:id) ─────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         example: Node.js
 *     responses:
 *       200:
 *         description: Articles correspondants
 *       400:
 *         description: Paramètre query manquant
 */
router.get("/search", searchArticles);

// ── Create ───────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un article (authentifié)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post("/", protect, validateArticle, handleValidation, createArticle);

// ── List all ─────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get("/", getArticles);

// ── Like toggle ───────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles/{id}/like:
 *   post:
 *     summary: Liker / unliker un article (authentifié)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du like mis à jour
 *       401:
 *         description: Non autorisé
 */
router.post("/:id/like", protect, toggleLike);

// ── Single ───────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 */
router.get("/:id", getArticleById);

// ── Update ────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article (auteur seulement)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Non trouvé
 */
router.put("/:id", protect, validateArticleUpdate, handleValidation, updateArticle);

// ── Delete ────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article (auteur seulement)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article supprimé
 *       403:
 *         description: Non autorisé
 */
router.delete("/:id", protect, deleteArticle);

export default router;
