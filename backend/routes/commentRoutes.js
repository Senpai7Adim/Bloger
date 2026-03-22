import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Commentaires sur les articles
 */

/**
 * @swagger
 * /api/articles/{id}/comments:
 *   get:
 *     summary: Récupérer les commentaires d'un article
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *   post:
 *     summary: Ajouter un commentaire (authentifié)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contenu]
 *             properties:
 *               contenu:
 *                 type: string
 *                 example: Super article, merci !
 *     responses:
 *       201:
 *         description: Commentaire ajouté
 *       401:
 *         description: Non autorisé
 */
router.route("/").get(getComments).post(protect, addComment);

export default router;

// Separate export for the standalone delete route (mounted at /api/comments)
export { deleteComment };
