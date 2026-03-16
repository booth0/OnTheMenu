import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, ...(email ? [{ email }] : [])] },
  })

  if (existing) {
    return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { username, email: email || null, password: hashedPassword },
  })

  return NextResponse.json({ id: user.id, username: user.username }, { status: 201 })
}
