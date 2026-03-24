import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Article from "@/lib/models/article";

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// GET /api/articles/:id - Get article by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const article = await Article.findById(id).populate(
      "auteur",
      "name avatar bio"
    );

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/articles/:id - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { titre, contenu, categorie, tags, coverImage } = body;

    const updateFields: Record<string, unknown> = {};
    if (titre !== undefined) updateFields.titre = titre;
    if (contenu !== undefined) updateFields.contenu = contenu;
    if (categorie !== undefined) updateFields.categorie = categorie;
    if (tags !== undefined) updateFields.tags = tags;
    if (coverImage !== undefined) updateFields.coverImage = coverImage;

    const updated = await Article.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("auteur", "name avatar");

    return NextResponse.json({
      message: "Article updated",
      article: updated,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/:id - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    await article.deleteOne();

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
