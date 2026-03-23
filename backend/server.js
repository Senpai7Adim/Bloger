import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import connectDB from "./config/db.js";
import swaggerSpec from "./config/swagger.js";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/auth.js";
import { deleteComment } from "./routes/commentRoutes.js";
import path from "path";


// ─── Connexion MongoDB ───────────────────────────────────────────────────────
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();
// ─── Middlewares globaux ─────────────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ─── Documentation Swagger ───────────────────────────────────────────────────
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Blog API – Documentation",
    customCss: ".swagger-ui .topbar { display: none }",
  })
);
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

// Standalone comment delete route
app.delete("/api/comments/:id", protect, deleteComment);

if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.json({
      message: "Bienvenue sur l'API Blog 🚀",
      documentation: `http://localhost:${PORT}/api-docs`,
      endpoints: {
        auth: `http://localhost:${PORT}/api/auth`,
        articles: `http://localhost:${PORT}/api/articles`,
      },
    });
  });
}

// ─── Production Logic (Static Files & SPA) ──────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "dist");
  app.use(express.static(frontendPath));
  
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.originalUrl.startsWith("/api")) {
      return res.sendFile(path.resolve(frontendPath, "index.html"));
    }
    next();
  });
}

// ─── Development Logic (Proxy to Vite) ──────────────────────────────────────
else if (process.env.NODE_ENV !== "test") {
  const { createProxyMiddleware } = await import("http-proxy-middleware");
  app.use(
    "/",
    createProxyMiddleware({
      target: "http://localhost:5173",
      changeOrigin: true,
      ws: true,
      pathFilter: (pathname) => !pathname.startsWith("/api") && !pathname.startsWith("/api-docs"),
    })
  );
}

// ─── 404 (Fallthrough for Local Dev) ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} introuvable` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err.stack);
  res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
});

// ─── Démarrage (Local only) ──────────────────────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Swagger UI disponible sur http://localhost:${PORT}/api-docs`);
  });
}

export default app;