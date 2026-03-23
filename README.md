# 🚀 Blogger - Plateforme de Blog Full-Stack

Application de blog complète avec **React (Vite)** au front-end et **Node.js (Express)** au back-end, utilisant **MongoDB** pour la persistance des données.

---

## 🔗GITHUB

https://github.com/Senpai7Adim/Bloger.git

---

## 🚀 Installation & Démarrage Rapide

### Prérequis
- Node.js ≥ 18
- MongoDB (local ou Atlas)

### 1. Cloner le dépôt & installer les dépendances
Installer les dépendances à la racine (gère automatiquement le backend et le frontend) :

```bash
git clone <url-du-repo>
cd Articles
npm install
```

### 2. Configurer les variables d'environnement
Créez un fichier `.env` à la racine :

```env
PORT=5000
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
```

### 3. Lancer l'application
# Pour la production
```bash
# Lancement en mode production (avec proxy unifié)
npm run build 

# en suite
 npm run start
```

Vous n'avez besoin que d' **une seule commande** pour lancer tout le projet (Backend + Frontend) :

```bash
# Lancement en mode développement (avec proxy unifié)
npm run dev 
```

L'application est accessible sur : **http://localhost:5000** 🚀
- Le **Front-end** (React) tourne sur la racine.
- Le **Back-end** (API) tourne sur `/api`.
- La **Documentation Swagger** est sur `/api-docs`.

---

## 🛠️ Commandes Utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le Backend et le Frontend simultanément (Dev) |
| `npm run build` | Compile le Frontend pour la production |
| `npm run start` | Lance le serveur de production (sert les fichiers statiques) |

---

---

## 📚 Documentation Swagger

Une fois le serveur démarré, accédez à la documentation interactive :

**http://localhost:5000/api-docs**

---

## 📋 Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/articles` | Créer un article |
| `GET` | `/api/articles` | Lister tous les articles (+ filtres) |
| `GET` | `/api/articles/search?query=texte` | Rechercher dans titre/contenu |
| `GET` | `/api/articles/:id` | Récupérer un article par ID |
| `PUT` | `/api/articles/:id` | Modifier un article |
| `DELETE` | `/api/articles/:id` | Supprimer un article |

### Paramètres de filtrage pour `GET /api/articles`

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `categorie` | string | Filtre par catégorie | `?categorie=Tech` |
| `auteur` | string | Filtre par auteur | `?auteur=Alice` |
| `date` | date | Filtre par date (YYYY-MM-DD) | `?date=2026-03-22` |

---

## 💡 Exemples d'utilisation

### Créer un article

```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un runtime JavaScript côté serveur...",
    "auteur": "Alice",
    "categorie": "Technologie",
    "tags": ["node", "js", "backend"]
  }'
```

**Réponse (201) :**
```json
{
  "message": "Article créé avec succès",
  "article": {
    "_id": "660a1b2c3d4e5f6789abcdef",
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un runtime JavaScript côté serveur...",
    "auteur": "Alice",
    "date": "2026-03-22T00:00:00.000Z",
    "categorie": "Technologie",
    "tags": ["node", "js", "backend"]
  }
}
```

---

### Lister tous les articles

```bash
curl http://localhost:5000/api/articles
```

### Filtrer par catégorie et date

```bash
curl "http://localhost:5000/api/articles?categorie=Tech&date=2026-03-22"
```

---

### Récupérer un article par ID

```bash
curl http://localhost:5000/api/articles/660a1b2c3d4e5f6789abcdef
```

**Réponse (200) :** l'objet article complet.  
**Réponse (404) :** `{ "message": "Article non trouvé" }`

---

### Rechercher des articles

```bash
curl "http://localhost:5000/api/articles/search?query=Node"
```

**Réponse (200) :** tableau JSON des articles dont le titre ou le contenu contient "Node".

---

### Modifier un article

```bash
curl -X PUT http://localhost:5000/api/articles/660a1b2c3d4e5f6789abcdef \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Titre mis à jour",
    "categorie": "Développement"
  }'
```

**Réponse (200) :**
```json
{
  "message": "Article mis à jour avec succès",
  "article": { ... }
}
```

---

### Supprimer un article

```bash
curl -X DELETE http://localhost:5000/api/articles/660a1b2c3d4e5f6789abcdef
```

**Réponse (200) :** `{ "message": "Article supprimé avec succès" }`

---

## ✅ Codes HTTP utilisés

| Code | Signification |
|------|---------------|
| 200 | OK – Requête réussie |
| 201 | Created – Ressource créée |
| 400 | Bad Request – Données invalides ou ID invalide |
| 404 | Not Found – Article introuvable |
| 500 | Internal Server Error – Erreur serveur |

---

## 🏗️ Structure du projet

```
Articles/
├── api/                    # Entry point for Vercel functions (serverless)
├── backend/                # API Backend (Node.js/Express)
│   ├── config/             # DB & Swagger config
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── server.js           # Express app setup
├── frontend/               # Front-end (React + Vite)
│   ├── src/                # Source code (Components, Pages, etc.)
│   └── dist/               # Compiled site (generated with npm run build)
├── vercel.json             # Vercel deployment configuration
├── package.json            # Root scripts (unified start/dev)
└── README.md
```

---

## 🛠️ Technologies

- **Node.js** – Runtime JavaScript
- **Express.js** – Framework web
- **MongoDB** – Base de données NoSQL
- **Mongoose** – ODM pour MongoDB
- **swagger-jsdoc** + **swagger-ui-express** – Documentation API interactive
- **express-validator** – Validation des données d'entrée
- **cors** – Gestion des CORS
- **dotenv** – Variables d'environnement
