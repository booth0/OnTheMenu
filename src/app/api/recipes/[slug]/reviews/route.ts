import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/recipes/[slug]/reviews  — fetch all reviews for a recipe
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const recipe = await prisma.recipe.findUnique({ where: { slug }, select: { id: true } });
    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    const reviews = await prisma.review.findMany({
        where: { recipeId: recipe.id },
        orderBy: { createdAt: "desc" },
        include: {
            author: { select: { id: true, username: true } },
            images: { select: { id: true, url: true } },
        },
    });

    return NextResponse.json(reviews);
}

// POST /api/recipes/[slug]/reviews  — create a review
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const recipe = await prisma.recipe.findUnique({ where: { slug }, select: { id: true } });
    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    const body = await req.json();
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const imageUrl: string | null = typeof body.imageUrl === "string" && body.imageUrl.trim().length > 0
        ? body.imageUrl.trim()
        : null;
    const reviewBody: string | null = typeof body.body === "string" && body.body.trim().length > 0
        ? body.body.trim()
        : null;

    const review = await prisma.review.create({
        data: {
            recipeId: recipe.id,
            authorId: authUser.id,
            rating,
            body: reviewBody,
            ...(imageUrl
                ? { images: { create: { url: imageUrl, uploadedById: authUser.id } } }
                : {}),
        },
        include: {
            author: { select: { id: true, username: true } },
            images: { select: { id: true, url: true } },
        },
    });

    return NextResponse.json(review, { status: 201 });
}
