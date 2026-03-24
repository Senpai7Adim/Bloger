import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Article from "@/lib/models/article";

// GET /api/articles - Get all articles
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categorie = searchParams.get("categorie");
    const auteur = searchParams.get("auteur");
    const date = searchParams.get("date");

    const filter: Record<string, unknown> = {};

    if (categorie) {
      filter.categorie = { $regex: categorie, $options: "i" };
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    let articles = await Article.find(filter)
      .populate("auteur", "name avatar")
      .sort({ date: -1 });

    // Filter by author name if provided
    if (auteur) {
      articles = articles.filter((a) =>
        a.auteur &&
        typeof a.auteur === "object" &&
        "name" in a.auteur &&
        (a.auteur as { name: string }).name
          ?.toLowerCase()
          .includes(auteur.toLowerCase())
      );
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create a new article
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { titre, contenu, date, categorie, tags, coverImage, auteurId } = body;

    // For now, use auteurId from body (in production, get from auth)
    const article = await Article.create({
      titre,
      contenu,
      auteur: auteurId,
      date: date ? new Date(date) : Date.now(),
      categorie,
      tags: tags || [],
      coverImage: coverImage || "",
    });

    const populated = await article.populate("auteur", "name avatar");

    return NextResponse.json(
      { message: "Article created successfully", article: populated },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
