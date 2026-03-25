import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    let userData = await prisma.user.findUnique({
        where: { id },
        select: { id: true, username: true}
    });
    return NextResponse.json(userData);
}