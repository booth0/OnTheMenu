import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ recipes: [] });
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      visibility: "PUBLIC",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      featuredImage: true,
      viewsCount: true,
      createdAt: true,
      author: {
        select: { id: true, username: true },
      },
      _count: {
        select: { likes: true, reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ recipes });
}
