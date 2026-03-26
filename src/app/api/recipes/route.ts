import { NextResponse } from "next/server";
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
            id: true, title: true, slug: true, description: true, featuredImage: true, createdAt: true
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
            } catch (err: any) {
                const code = err?.code ?? err?.meta?.target
                if (err?.code === 'P2002' && err?.meta?.target?.includes('slug')) {
                    tries++;
                    slug = `${baseSlug}-${tries}`;
                    continue;
                }

                console.error("Recipe create failed:", {
                    code: err?.code,
                    message: err?.message,
                    meta: err?.meta,
                    authUserId: authUser.id,
                });

                throw err;
            }
        }
    } catch (err: any) {
        return NextResponse.json(
            {
                error: err?.message ?? 'Internal server error',
                code: err?.code ?? null,
                meta: err?.meta ?? null,
            },
            { status: 500 }
        );
    }
}