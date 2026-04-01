import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const book = await prisma.recipeBook.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { addedAt: 'desc' },
        include: {
          recipe: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              featuredImage: true,
              viewsCount: true,
              createdAt: true,
              author: { select: { id: true, username: true } },
              _count: { select: { likes: true, reviews: true } },
            },
          },
        },
      },
    },
  })

  if (!book || book.ownerId !== auth.id) {
    return NextResponse.json({ error: 'Recipe book not found' }, { status: 404 })
  }

  return NextResponse.json(book)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const book = await prisma.recipeBook.findUnique({ where: { id } })
  if (!book || book.ownerId !== auth.id) {
    return NextResponse.json({ error: 'Recipe book not found' }, { status: 404 })
  }

  // Delete all items in the book first
  await prisma.recipeBookItem.deleteMany({ where: { bookId: id } })
  await prisma.recipeBook.delete({ where: { id } })

  return NextResponse.json({ deleted: true })
}
