import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// POST /api/recipes/[slug]/save  — toggles saved on/off
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const recipe = await prisma.recipe.findUnique({ where: { slug }, select: { id: true } });
    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    // Check if already saved
    const existing = await prisma.recipe.findFirst({
        where: {
            id: recipe.id,
            savedByUsers: { some: { id: authUser.id } },
        },
        select: { id: true },
    });

    if (existing) {
        // Unsave
        await prisma.recipe.update({
            where: { id: recipe.id },
            data: { savedByUsers: { disconnect: { id: authUser.id } } },
        });
        return NextResponse.json({ saved: false });
    } else {
        // Save
        await prisma.recipe.update({
            where: { id: recipe.id },
            data: { savedByUsers: { connect: { id: authUser.id } } },
        });
        return NextResponse.json({ saved: true });
    }
}
