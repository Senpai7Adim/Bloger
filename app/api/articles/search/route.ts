import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Article from "@/lib/models/article";

// GET /api/articles/search?query=xxx - Search articles
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { message: 'The "query" parameter is required' },
        { status: 400 }
      );
    }

    const articles = await Article.find({
      $or: [
        { titre: { $regex: query, $options: "i" } },
        { contenu: { $regex: query, $options: "i" } },
      ],
    })
      .populate("auteur", "name avatar")
      .sort({ date: -1 });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error searching articles:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
