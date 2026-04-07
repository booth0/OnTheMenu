import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { emitReviewDeleted } from "@/lib/socketServer";

// DELETE /api/reviews/[id]  — delete own review
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const review = await prisma.review.findUnique({
        where: { id },
        select: { authorId: true, recipeId: true },
    });
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    if (review.authorId !== authUser.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete related images first, then the review
    await prisma.image.deleteMany({ where: { reviewId: id } });
    await prisma.review.delete({ where: { id } });

    // Compute updated stats asynchronously to avoid exhausting connection pool
    const recipeId = review.recipeId;
    Promise.all([
        prisma.recipe.findUnique({ where: { id: recipeId }, select: { slug: true } }),
        prisma.review.aggregate({ where: { recipeId }, _avg: { rating: true }, _count: { id: true } }),
    ]).then(([recipeRow, agg]) => {
        if (!recipeRow) return;
        const reviewsCount = agg._count.id;
        const avgRating = Math.round((agg._avg.rating ?? 0) * 10) / 10;
        emitReviewDeleted({
            slug: recipeRow.slug,
            reviewId: id,
            rating: avgRating,
            reviewsCount,
        });
    }).catch(() => {});

    return new NextResponse(null, { status: 204 });
}
