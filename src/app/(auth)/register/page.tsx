'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    if (document.cookie.split(';').some(c => c.trim().startsWith('loggedIn='))) router.replace('/')
  }, [router])

  async function handleSubmit(formData: FormData) {
    setError('')

    const body = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: body.username, password: body.password }),
      })
      router.push('/')
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
        <h1>Sign Up</h1>

        <input name="username" type="text" placeholder="Username" required />
        <input name="email" type="email" placeholder="Email (optional)" />
        <input name="password" type="password" placeholder="Password" required />

        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}

        <button type="submit">Create account</button>
        <p style={{ margin: 0 }}>Already have an account? <Link href="/login">Log in</Link></p>
      </form>
    </main>
  )
}
