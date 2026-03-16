'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('sessionId'))
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('sessionId')
    setLoggedIn(false)
    router.refresh()
  }

  return (
    <main>
      <h1>Hello World</h1>
      {loggedIn ? (
        <button onClick={handleLogout}>Log out</button>
      ) : (
        <Link href="/login">Sign in</Link>
      )}
    </main>
  )
}
