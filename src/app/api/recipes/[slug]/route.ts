import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    const { slug } = params;
    console.log("Fetching recipe with slug:", slug);

    try {
        const recipe = await prisma.recipe.findUnique({
            where: { slug },
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        return NextResponse.json(recipe);
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
            createdAt: legacyRecipe.createdAt,
            updatedAt: legacyRecipe.updatedAt,
        });
    }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
    const { slug } = params;
    const body = await req.json();
    const featuredImage = body?.featuredImage ?? body?.featuredImageUrl ?? null;
    // Check ownership or permissions here (not implemented)
    try {
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

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
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