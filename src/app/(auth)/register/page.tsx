'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

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
    <main className={styles.page}>
      <div className={`card ${styles.card}`}>
        <form action={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>Sign Up</h1>

          <label className={styles.label} htmlFor="username">Username</label>
          <input className={styles.input} id="username" name="username" type="text" placeholder="Username" required />

          <label className={styles.label} htmlFor="email">Email <span style={{ opacity: 0.7, fontWeight: 400 }}>(optional)</span></label>
          <input className={styles.input} id="email" name="email" type="email" placeholder="Email" />

          <label className={styles.label} htmlFor="password">Password</label>
          <input className={styles.input} id="password" name="password" type="password" placeholder="Password" required />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={`primary ${styles.submitBtn}`}>Create account</button>
          <p className={styles.footer}>Already have an account? <Link href="/login">Log in</Link></p>
        </form>
      </div>
    </main>
  )
}
