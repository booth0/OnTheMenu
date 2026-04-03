import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// POST /api/recipes/[slug]/like  — toggles like on/off
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const recipe = await prisma.recipe.findUnique({ where: { slug }, select: { id: true } });
    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    const existing = await prisma.like.findUnique({
        where: { recipeId_userId: { recipeId: recipe.id, userId: authUser.id } },
    });

    if (existing) {
        await prisma.like.delete({ where: { id: existing.id } });
        return NextResponse.json({ liked: false });
    } else {
        await prisma.like.create({ data: { recipeId: recipe.id, userId: authUser.id } });
        return NextResponse.json({ liked: true });
    }
}
