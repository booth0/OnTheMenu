'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function BanChecker() {
  const pathname = usePathname()

  useEffect(() => {
    const loggedIn = document.cookie.split(';').some(c => c.trim().startsWith('loggedIn='))
    if (!loggedIn) return

    fetch('/api/users/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.isBanned) {
          window.location.href = '/api/auth/force-logout'
        }
      })
      .catch(() => {})
  }, [pathname])

  return null
}
