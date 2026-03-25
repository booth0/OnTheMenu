import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const recipes = await prisma.recipe.findMany({
    where: { visibility: "PUBLIC" },
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
