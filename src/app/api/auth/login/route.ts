import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  if (user.isBanned) {
    return NextResponse.json(
      { error: 'Your account has been banned.', banReason: user.banReason },
      { status: 403 }
    )
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  const cookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('token', token, { ...cookieOptions, httpOnly: true })
  response.cookies.set('loggedIn', 'true', cookieOptions)

  return response
}
