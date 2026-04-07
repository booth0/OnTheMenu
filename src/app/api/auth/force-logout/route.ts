import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const auth = await getAuthUser()

  let reason: string | null = null
  if (auth) {
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { banReason: true },
    })
    reason = user?.banReason ?? null
  }

  const dest = new URL('/banned', req.url)
  if (reason) dest.searchParams.set('reason', reason)

  const response = NextResponse.redirect(dest)
  response.cookies.set('token', '', { maxAge: 0, httpOnly: true })
  response.cookies.set('loggedIn', '', { maxAge: 0 })
  return response
}
