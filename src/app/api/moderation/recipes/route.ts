import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (auth.role !== 'MODERATOR' && auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const recipes = await prisma.recipe.findMany({
    where: { forcedPrivate: true },
    select: {
      id: true,
      slug: true,
      title: true,
      forcedPrivateReason: true,
      author: { select: { username: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(recipes)
}
