'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [banReason, setBanReason] = useState<string | null>(null)

  useEffect(() => {
    if (document.cookie.split(';').some(c => c.trim().startsWith('loggedIn='))) router.replace('/')
  }, [router])

  async function handleSubmit(formData: FormData) {
    setError('')
    setBanReason(null)

    const body = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      window.location.href = '/'
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
      setBanReason(data.banReason ?? null)
    }
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
        <h1>Log In</h1>

        <input name="username" type="text" placeholder="Username" required />
        <input name="password" type="password" placeholder="Password" required />

        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        {banReason && (
          <p style={{ color: 'red', margin: 0, fontSize: '0.9em' }}>Reason: {banReason}</p>
        )}

        <button type="submit">Log in</button>
        <p style={{ margin: 0 }}>Don&apos;t have an account? <Link href="/register">Sign up</Link></p>
      </form>
    </main>
  )
}
