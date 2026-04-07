import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { getAuthUser } from "@/lib/auth";

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
            id: true, title: true, slug: true, description: true, featuredImage: true, createdAt: true,
            viewsCount: true,
            author: { select: { id: true, username: true } },
            _count: { select: { likes: true, reviews: true } },
        }
    });
    return NextResponse.json(recipes);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const featuredImage = body?.featuredImage ?? body?.featuredImageUrl ?? null;
        console.log("Received recipe data:", {
            title: body?.title,
            visibility: body?.visibility,
            ingredientsCount: Array.isArray(body?.ingredients) ? body.ingredients.length : null,
            directionsCount: Array.isArray(body?.directions) ? body.directions.length : null,
            hasFeaturedImage: !!featuredImage,
        });

        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!body?.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        if (!Array.isArray(body.ingredients) || !Array.isArray(body.directions)) {
            return NextResponse.json({ error: "Ingredients and directions must be arrays" }, { status: 400 });
        }

        if (body.ingredients.length === 0 || body.directions.length === 0) {
            return NextResponse.json({ error: "Ingredients and directions cannot be empty" }, { status: 400 });
        }

        const visibility = body.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE";

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
                        visibility,
                        featuredImage,
                        ingredients: body.ingredients,
                        directions: body.directions,
                        authorId: authUser.id,
                    }
                })
                return NextResponse.json(created, {status: 201});
            } catch (err: unknown) {
                if (
                    err instanceof Prisma.PrismaClientKnownRequestError &&
                    err.code === 'P2002' &&
                    (err.meta?.target as string[] | undefined)?.includes('slug')
                ) {
                    tries++;
                    slug = `${baseSlug}-${tries}`;
                    continue;
                }

                console.error("Recipe create failed:", {
                    code: err instanceof Prisma.PrismaClientKnownRequestError ? err.code : undefined,
                    message: err instanceof Error ? err.message : undefined,
                    meta: err instanceof Prisma.PrismaClientKnownRequestError ? err.meta : undefined,
                    authUserId: authUser.id,
                });

                throw err;
            }
        }
    } catch (err: unknown) {
        const isPrismaErr = err instanceof Prisma.PrismaClientKnownRequestError;
        return NextResponse.json(
            {
                error: err instanceof Error ? err.message : 'Internal server error',
                code: isPrismaErr ? err.code : null,
                meta: isPrismaErr ? err.meta : null,
            },
            { status: 500 }
        );
    }
}
