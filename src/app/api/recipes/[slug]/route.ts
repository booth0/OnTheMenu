import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const authUser = await getAuthUser();

        const recipe = await prisma.recipe.findUnique({
            where: { slug },
            include: {
                likes: true,
                savedByUsers: true,
                reviews: { select: { rating: true } },
            },
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        const likesCount = recipe.likes.length;
        const savesCount = recipe.savedByUsers.length;
        const reviewsCount = recipe.reviews.length;
        const rating = reviewsCount > 0
            ? recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
            : 0;
        const likedByUser = authUser ? recipe.likes.some(l => l.userId === authUser.id) : false;
        const savedByUser = authUser ? recipe.savedByUsers.some(u => u.id === authUser.id) : false;

        const { likes, savedByUsers, reviews, ...recipeBase } = recipe;

        return NextResponse.json({
            ...recipeBase,
            likes: likesCount,
            saves: savesCount,
            reviews: reviewsCount,
            rating: Math.round(rating * 10) / 10,
            likedByUser,
            savedByUser,
        });
    } catch (err: any) {
        if (err?.code !== "P2022") {
            return NextResponse.json({ error: err?.message ?? "Failed to fetch recipe" }, { status: 500 });
        }

        const legacyRows = await prisma.$queryRaw<Array<{
            id: string;
            slug: string;
            title: string;
            description: string | null;
            body: string;
            visibility: "PUBLIC" | "PRIVATE";
            featuredImage: string | null;
            authorId: string;
            createdAt: Date;
            updatedAt: Date;
        }>>`
            SELECT id, slug, title, description, body, visibility, "featuredImage", "authorId", "createdAt", "updatedAt"
            FROM "Recipe"
            WHERE slug = ${slug}
            LIMIT 1
        `;

        const legacyRecipe = legacyRows[0];

        if (!legacyRecipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: legacyRecipe.id,
            slug: legacyRecipe.slug,
            title: legacyRecipe.title,
            description: legacyRecipe.description,
            visibility: legacyRecipe.visibility,
            featuredImage: legacyRecipe.featuredImage,
            authorId: legacyRecipe.authorId,
            ingredients: [],
            directions: legacyRecipe.body
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            likes: 0,
            saves: 0,
            reviews: 0,
            rating: 0,
            likedByUser: false,
            savedByUser: false,
            createdAt: legacyRecipe.createdAt,
            updatedAt: legacyRecipe.updatedAt,
        });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const body = await req.json();
    const featuredImage = body?.featuredImage ?? body?.featuredImageUrl ?? null;
    // Check ownership or permissions here (not implemented)
    try {
        const existing = await prisma.recipe.findUnique({
            where: { slug },
            select: { forcedPrivate: true },
        });
        if (existing?.forcedPrivate && body.visibility === 'PUBLIC') {
            return NextResponse.json(
                { error: 'This recipe has been locked to private by a moderator.' },
                { status: 403 }
            );
        }

        const updated = await prisma.recipe.update({
            where: { slug },
            data: {
                title: body.title,
                description: body.description ?? null,
                visibility: body.visibility ?? "PRIVATE",
                featuredImage,
                ingredients: body.ingredients,
                directions: body.directions
            }
        });
        return NextResponse.json({data: updated});
    } catch (err: any) {
        return new NextResponse(JSON.stringify({ error: err.message }), { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Check ownership or permissions here (not implemented)
    try {
        await prisma.recipe.delete({
            where: { slug },
        });
        return new NextResponse(null, { status: 204 });
    } catch (err: any) {
        return new NextResponse(JSON.stringify({ error: err.message }), { status: 400 });
    }
}