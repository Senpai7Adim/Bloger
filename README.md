# Blog API – Documentation

API REST pour la gestion des articles d'un blog, développée avec **Node.js / Express / MongoDB**.

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js ≥ 18
- MongoDB (local ou Atlas)

### 1. Cloner le dépôt & installer les dépendances

```bash
git clone <url-du-repo>
cd Articles
npm install
```

### 2. Configurer les variables d'environnement

Créez (ou modifiez) le fichier `.env` à la racine :

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blogdb
```

> Pour MongoDB Atlas, remplacez `MONGO_URI` par votre URI de connexion Atlas.

### 3. Démarrer le serveur

```bash
# Mode développement (rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur **http://localhost:5000**.

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
├── backend/
│   ├── config/
│   │   ├── db.js           # Connexion MongoDB
│   │   └── swagger.js      # Configuration Swagger/OpenAPI
│   ├── controllers/
│   │   └── articleController.js  # Logique métier
│   ├── middleware/
│   │   └── validate.js     # Validation des entrées
│   ├── models/
│   │   └── Article.js      # Schéma Mongoose
│   ├── routes/
│   │   └── articleRoutes.js  # Définition des routes + annotations Swagger
│   └── server.js           # Point d'entrée
├── .env                    # Variables d'environnement
├── package.json
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
