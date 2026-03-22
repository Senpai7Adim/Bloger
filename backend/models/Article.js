import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    contenu: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
      trim: true,
    },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'auteur est obligatoire"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    categorie: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    coverImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index texte pour la recherche full-text
articleSchema.index({ titre: "text", contenu: "text" });

// Virtual : nombre de likes
articleSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

articleSchema.set("toJSON", { virtuals: true });
articleSchema.set("toObject", { virtuals: true });

const Article = mongoose.model("Article", articleSchema);
export default Article;
