import { body, validationResult } from "express-validator";

// Règles de validation pour créer/modifier un article
export const validateArticle = [
  body("titre")
    .notEmpty()
    .withMessage("Le titre ne peut pas être vide")
    .isLength({ max: 200 })
    .withMessage("Le titre ne doit pas dépasser 200 caractères"),

  body("contenu")
    .notEmpty()
    .withMessage("Le contenu ne peut pas être vide"),

  body("categorie")
    .notEmpty()
    .withMessage("La catégorie est obligatoire"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Les tags doivent être un tableau"),
];

// Règles allégées pour la mise à jour partielle (PATCH-style via PUT)
export const validateArticleUpdate = [
  body("titre")
    .optional()
    .notEmpty()
    .withMessage("Le titre ne peut pas être vide")
    .isLength({ max: 200 })
    .withMessage("Le titre ne doit pas dépasser 200 caractères"),

  body("contenu")
    .optional()
    .notEmpty()
    .withMessage("Le contenu ne peut pas être vide"),

  body("categorie")
    .optional()
    .notEmpty()
    .withMessage("La catégorie ne peut pas être vide"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Les tags doivent être un tableau"),
];

// Middleware pour renvoyer les erreurs de validation
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Données invalides",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};
