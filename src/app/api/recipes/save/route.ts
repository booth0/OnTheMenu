import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { recipeId } = body

  if (!recipeId || typeof recipeId !== 'string') {
    return NextResponse.json({ error: 'recipeId is required' }, { status: 400 })
  }

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } })
  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
  }

  await prisma.user.update({
    where: { id: auth.id },
    data: {
      savedRecipes: { connect: { id: recipeId } },
    },
  })

  return NextResponse.json({ saved: true })
}

export async function DELETE(req: Request) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { recipeId } = body

  if (!recipeId || typeof recipeId !== 'string') {
    return NextResponse.json({ error: 'recipeId is required' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: auth.id },
    data: {
      savedRecipes: { disconnect: { id: recipeId } },
    },
  })

  return NextResponse.json({ saved: false })
}
