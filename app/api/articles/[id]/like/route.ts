import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Article from "@/lib/models/article";

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// POST /api/articles/:id/like - Toggle like on article
export async function POST(
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
    const { userId } = body;

    if (!userId || !isValidId(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const alreadyLiked = article.likes.some(
      (likeId) => likeId.toString() === userId
    );

    if (alreadyLiked) {
      article.likes = article.likes.filter(
        (likeId) => likeId.toString() !== userId
      );
    } else {
      article.likes.push(userObjectId);
    }

    await article.save();

    return NextResponse.json({
      liked: !alreadyLiked,
      likesCount: article.likes.length,
      likes: article.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
