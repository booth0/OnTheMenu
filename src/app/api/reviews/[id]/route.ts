import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// DELETE /api/reviews/[id]  — delete own review
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const review = await prisma.review.findUnique({ where: { id }, select: { authorId: true } });
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    if (review.authorId !== authUser.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete related images first, then the review
    await prisma.image.deleteMany({ where: { reviewId: id } });
    await prisma.review.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
}
