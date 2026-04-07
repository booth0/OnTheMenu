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

    // Compute updated stats and emit via Socket.IO
    const recipe = await prisma.recipe.findUnique({
        where: { id: review.recipeId },
        select: { slug: true },
    });
    if (recipe) {
        const remaining = await prisma.review.findMany({
            where: { recipeId: review.recipeId },
            select: { rating: true },
        });
        const reviewsCount = remaining.length;
        const avgRating = reviewsCount > 0
            ? Math.round((remaining.reduce((s, r) => s + r.rating, 0) / reviewsCount) * 10) / 10
            : 0;
        emitReviewDeleted({
            slug: recipe.slug,
            reviewId: id,
            rating: avgRating,
            reviewsCount,
        });
    }

    return new NextResponse(null, { status: 204 });
}
