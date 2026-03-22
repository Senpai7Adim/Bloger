import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description:
        "API REST pour la gestion des articles d'un blog — CRUD complet avec recherche et filtrage.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur local",
      },
    ],
    components: {
      schemas: {
        Article: {
          type: "object",
          required: ["titre", "contenu", "auteur", "categorie"],
          properties: {
            _id: {
              type: "string",
              description: "Identifiant MongoDB généré automatiquement",
              example: "660a1b2c3d4e5f6789abcdef",
            },
            titre: {
              type: "string",
              description: "Titre de l'article",
              example: "Introduction à Node.js",
            },
            contenu: {
              type: "string",
              description: "Contenu de l'article",
              example: "Node.js est un environnement JavaScript côté serveur...",
            },
            auteur: {
              type: "string",
              description: "Auteur de l'article",
              example: "Alice",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Date de publication (auto si non fournie)",
              example: "2026-03-22T00:00:00.000Z",
            },
            categorie: {
              type: "string",
              description: "Catégorie de l'article",
              example: "Technologie",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Liste de tags",
              example: ["node", "js", "backend"],
            },
          },
        },
        ArticleInput: {
          type: "object",
          required: ["titre", "contenu", "auteur", "categorie"],
          properties: {
            titre: { type: "string", example: "Introduction à Node.js" },
            contenu: {
              type: "string",
              example: "Node.js est un runtime JavaScript...",
            },
            auteur: { type: "string", example: "Alice" },
            date: { type: "string", format: "date", example: "2026-03-22" },
            categorie: { type: "string", example: "Technologie" },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["node", "js"],
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./backend/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
