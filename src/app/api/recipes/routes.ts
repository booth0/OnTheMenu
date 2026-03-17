import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { Prisma, Visibility } from "@prisma/client";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const take = 20, skip = (page - 1) * take;

    const recipes = await prisma.recipe.findMany({
        where: {visibility: 'PUBLIC'},
        orderBy: {createdAt: "desc"},
        take,
        skip,
        select: {
            id: true, title: true, slug: true, description: true, featuredImageUrl: true, createdAt: true
        }
    });
    return NextResponse.json(recipes);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.title) {
            return NextResponse.json({error: "Title is required"}, {status: 400});
        }
        if (!Array.isArray(body.ingredients) || Array.isArray(body.directions)) {
            return new NextResponse('Ingredients and directions must be arrays', {status: 400});
        }

        let baseSlug = slugify(body.title);
        let slug = baseSlug;
        let tries = 0;

        while (true) {
            try {
                const created = await prisma.recipe.create({
                    data: {
                        title: body.title,
                        slug,
                        description: body.description ?? null,
                        visibility: body.visibility ?? "PRIVATE",
                        featuredImageUrl: body.featuredImageUrl ?? null,
                        ingredients: body.ingredients,
                        directions: body.directions,
                        authorId: body.authorId
                    }
                })
                return NextResponse.json(created, {status: 201});
            } catch (err: any) {
                const code = err?.code ?? err?.meta?.target
                if (err?.code === 'P2002' && err?.meta?.target?.includes('slug')) {
                    tries++;
                    slug = `${baseSlug}-${tries}`;
                    continue;
                }
                throw err;
            }
        }
    } catch (err: any) {
        return new NextResponse(err.message, {status: 500});
    }
}