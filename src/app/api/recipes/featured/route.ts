import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const recipes = await prisma.recipe.findMany({
        where: { visibility: "PUBLIC" },
        orderBy: { likes: { _count: "desc" } },
        take: 3,
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            featuredImage: true,
            createdAt: true,
            viewsCount: true,
            author: { select: { id: true, username: true } },
            _count: { select: { likes: true, reviews: true } },
        },
    });
    return NextResponse.json(recipes);
}
