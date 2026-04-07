'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

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
    <main className={styles.page}>
      <div className={`card ${styles.card}`}>
        <form action={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>Log In</h1>

          <label className={styles.label} htmlFor="username">Username</label>
          <input className={styles.input} id="username" name="username" type="text" placeholder="Username" required />

          <label className={styles.label} htmlFor="password">Password</label>
          <input className={styles.input} id="password" name="password" type="password" placeholder="Password" required />

          {error && <p className={styles.error}>{error}</p>}
          {banReason && <p className={styles.error}>Reason: {banReason}</p>}

          <button type="submit" className={`primary ${styles.submitBtn}`}>Log in</button>
          <p className={styles.footer}>Don&apos;t have an account? <Link href="/register">Sign up</Link></p>
        </form>
      </div>
    </main>
  )
}
