import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    const { slug } = params;
    const recipe = await prisma.recipe.findUnique({
        where: { slug },
    });
    if (!recipe) {
        return new NextResponse(JSON.stringify({ error: "Recipe not found" }), { status: 404 });
    }
    return NextResponse.json(recipe);
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
    const { slug } = params;
    const body = await req.json();
    // Check ownership or permissions here (not implemented)
    try {
        const updated = await prisma.recipe.update({
            where: { slug },
            data: {
                title: body.title,
                description: body.description ?? null,
                visibility: body.visibility ?? "PRIVATE",
                featuredImageUrl: body.featuredImageUrl ?? null,
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
    const { slug } = params;
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