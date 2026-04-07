import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (auth.role !== 'MODERATOR' && auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug } = await params
  const { reason } = await req.json()

  if (!reason || reason.trim().length < 10) {
    return NextResponse.json({ error: 'Reason must be at least 10 characters.' }, { status: 400 })
  }

  const recipe = await prisma.recipe.findUnique({ where: { slug } })
  if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })

  const updated = await prisma.recipe.update({
    where: { slug },
    data: { visibility: 'PRIVATE', forcedPrivate: true, forcedPrivateReason: reason.trim() },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (auth.role !== 'MODERATOR' && auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug } = await params

  const recipe = await prisma.recipe.findUnique({ where: { slug } })
  if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })

  const updated = await prisma.recipe.update({
    where: { slug },
    data: { forcedPrivate: false, forcedPrivateReason: null },
  })

  return NextResponse.json(updated)
}
