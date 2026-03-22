import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contenu: {
      type: String,
      required: [true, "Le contenu du commentaire est obligatoire"],
      trim: true,
      maxlength: [1000, "Le commentaire ne peut pas dépasser 1000 caractères"],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
