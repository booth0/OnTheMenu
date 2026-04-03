import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { bookId, recipeId } = body

  if (!bookId || typeof bookId !== 'string') {
    return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
  }
  if (!recipeId || typeof recipeId !== 'string') {
    return NextResponse.json({ error: 'recipeId is required' }, { status: 400 })
  }

  const book = await prisma.recipeBook.findUnique({ where: { id: bookId } })
  if (!book || book.ownerId !== auth.id) {
    return NextResponse.json({ error: 'Recipe book not found' }, { status: 404 })
  }

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } })
  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
  }

  const existing = await prisma.recipeBookItem.findUnique({
    where: { bookId_recipeId: { bookId, recipeId } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Recipe already in this book' }, { status: 409 })
  }

  const item = await prisma.recipeBookItem.create({
    data: { bookId, recipeId },
  })

  return NextResponse.json(item, { status: 201 })
}

export async function DELETE(req: Request) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { bookId, recipeId } = body

  if (!bookId || typeof bookId !== 'string') {
    return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
  }
  if (!recipeId || typeof recipeId !== 'string') {
    return NextResponse.json({ error: 'recipeId is required' }, { status: 400 })
  }

  const book = await prisma.recipeBook.findUnique({ where: { id: bookId } })
  if (!book || book.ownerId !== auth.id) {
    return NextResponse.json({ error: 'Recipe book not found' }, { status: 404 })
  }

  await prisma.recipeBookItem.deleteMany({
    where: { bookId, recipeId },
  })

  return NextResponse.json({ removed: true })
}
