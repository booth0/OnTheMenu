'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function NewRecipeBookPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recipeId = searchParams.get('recipeId')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
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

      const book = await res.json()

      if (recipeId) {
        const addRes = await fetch('/api/recipe-books/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId: book.id, recipeId }),
        })

        if (addRes.ok) {
          setSuccess(`Recipe book created and recipe added!`)
        } else {
          setSuccess('Recipe book created, but failed to add the recipe.')
        }

        setTimeout(() => router.push(`/recipe-books/${book.id}`), 1500)
      } else {
        router.push('/recipe-books')
      }
    } finally {
      setSubmitting(false)
    }
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
        {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Recipe Book'}
        </button>
      </form>
    </main>
  )
}
