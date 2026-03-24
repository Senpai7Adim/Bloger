import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArticle extends Document {
  _id: mongoose.Types.ObjectId;
  titre: string;
  contenu: string;
  auteur: mongoose.Types.ObjectId;
  date: Date;
  categorie: string;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
}

const articleSchema = new Schema<IArticle>(
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
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
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

articleSchema.index({ titre: "text", contenu: "text" });

articleSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

articleSchema.set("toJSON", { virtuals: true });
articleSchema.set("toObject", { virtuals: true });

const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>("Article", articleSchema);

export default Article;
