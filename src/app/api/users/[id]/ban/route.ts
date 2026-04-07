import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Role = 'USER' | 'MODERATOR' | 'ADMIN'

function canActOnUser(actorRole: Role, targetRole: Role): boolean {
  if (targetRole === 'ADMIN') return false
  if (actorRole === 'ADMIN') return true
  if (actorRole === 'MODERATOR') return targetRole === 'USER'
  return false
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (auth.role !== 'MODERATOR' && auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { reason } = await req.json()

  if (!reason || reason.trim().length < 10) {
    return NextResponse.json({ error: 'Ban reason must be at least 10 characters.' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (!canActOnUser(auth.role as Role, target.role as Role)) {
    return NextResponse.json({ error: 'You do not have permission to ban this user.' }, { status: 403 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isBanned: true, banReason: reason.trim() },
    select: { id: true, isBanned: true, banReason: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (auth.role !== 'MODERATOR' && auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (!canActOnUser(auth.role as Role, target.role as Role)) {
    return NextResponse.json({ error: 'You do not have permission to unban this user.' }, { status: 403 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isBanned: false, banReason: null },
    select: { id: true, isBanned: true },
  })

  return NextResponse.json(updated)
}
