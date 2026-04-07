'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewRecipeBookPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const res = await fetch('/api/recipe-books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to create recipe book')
      return
    }

    router.push('/recipe-books')
  }

  return (
    <main className="container">
      <style>
        {`
          label {
            display: block;
            margin-bottom: 1em;
            }
            .card input[type="text"], .card textarea {
              width: 100%;
              padding: 0.5em;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              margin-top: 0.5em;
            }
          `}
      </style>
      <h1>Create a Recipe Book</h1>
      <form onSubmit={handleSubmit} className="card" style={{ color: 'var(--text-color)' }}>
        <label>
          Name
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weeknight Dinners"
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What kind of recipes will you collect here?"
            rows={3}
          />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="primary">
          Create Recipe Book
        </button>
      </form>
    </main>
  )
}
