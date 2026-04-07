import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let userData = await prisma.user.findUnique({
        where: { id },
        select: { id: true, username: true}
    });
    return NextResponse.json(userData);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const { role } = await req.json();

    const validRoles = ['USER', 'MODERATOR', 'ADMIN'];
    if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, role: true },
    });

    return NextResponse.json(updated);
}