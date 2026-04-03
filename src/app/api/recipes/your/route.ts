import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const recipes = await prisma.recipe.findMany({
    where: { authorId: auth.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      featuredImage: true,
      visibility: true,
      viewsCount: true,
      createdAt: true,
      author: { select: { id: true, username: true } },
      _count: { select: { likes: true, reviews: true } },
    },
  })

  return NextResponse.json(recipes)
}
