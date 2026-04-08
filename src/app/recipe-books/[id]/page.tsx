'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import RecipeCard, { type RecipeCardRecipe } from '@/components/recipe/RecipeCard'

type BookResponse = {
  id: string
  title: string
  description: string | null
  items: {
    id: string
    recipe: {
      id: string
      slug: string
      title: string
      description: string | null
      featuredImage: string | null
      viewsCount: number
      createdAt: string
      author: { id: string; username: string } | null
      _count: { likes: number; reviews: number }
    }
  }[]
}

export default function RecipeBookPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [book, setBook] = useState<BookResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/users/me').then(r => r.ok ? r.json() : null).then(u => setCurrentUserId(u?.id ?? null)).catch(() => {})
  }, [])

  useEffect(() => {
    async function fetchBook() {
      const res = await fetch(`/api/recipe-books/${params.id}`)
      if (!res.ok) {
        setError('Recipe book not found')
        return
      }
      setBook(await res.json())
    }
    fetchBook()
  }, [params.id])

  if (error || !book) return <main className="container"><p>{error ?? 'Recipe book not found'}</p></main>

  async function removeRecipe(recipeId: string) {
    const res = await fetch('/api/recipe-books/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: params.id, recipeId }),
    })
    if (res.ok && book) {
      setBook({ ...book, items: book.items.filter((item) => item.recipe.id !== recipeId) })
    }
  }

  async function deleteBook() {
    if (!confirm('Are you sure you want to delete this recipe book?')) return
    const res = await fetch(`/api/recipe-books/${params.id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/recipe-books')
    }
  }

  const recipes: RecipeCardRecipe[] = book.items.map((item) => ({
    id: item.recipe.id,
    slug: item.recipe.slug,
    title: item.recipe.title,
    description: item.recipe.description,
    featuredImage: item.recipe.featuredImage,
    author: item.recipe.author
      ? { id: item.recipe.author.id, name: item.recipe.author.username }
      : null,
    viewsCount: item.recipe.viewsCount,
    createdAt: item.recipe.createdAt,
    likesCount: item.recipe._count.likes,
    reviewsCount: item.recipe._count.reviews,
  }))

  return (
    <main className="container">
      <div className="page-header">
        <div>
          <h1>{book.title}</h1>
          {book.description && <p>{book.description}</p>}
        </div>
        <button onClick={deleteBook} className="secondary">
          Delete Recipe Book
        </button>
      </div>

      {recipes.length === 0 ? (
        <p>No recipes in this book yet.</p>
      ) : (
        <div className="featured-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              currentUserId={currentUserId}
              actionSlot={
                <button onClick={() => removeRecipe(recipe.id)} className="secondary" style={{ width: '100%' }}>
                  Remove from book
                </button>
              }
            />
          ))}
        </div>
      )}
    </main>
  )
}
