'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import RecipeCard, { type RecipeCardRecipe } from '@/components/recipe/RecipeCard'
import RecipeSortSelect, { type SortOption, sortRecipes } from '@/components/recipe/RecipeSortSelect'
import type { RecipeApiItem } from '@/types/api'

export default function YourRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeCardRecipe[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')
  const sorted = useMemo(() => sortRecipes(recipes, sort), [recipes, sort])

  useEffect(() => {
    fetch('/api/users/me').then(r => r.ok ? r.json() : null).then(u => setCurrentUserId(u?.id ?? null)).catch(() => {})
  }, [])

  useEffect(() => {
    async function fetchMyRecipes() {
      const res = await fetch('/api/recipes/your')

      const data = await res.json()
      const mapped: RecipeCardRecipe[] = data.map((r: RecipeApiItem) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        description: r.description,
        featuredImage: r.featuredImage,
        author: r.author
          ? { id: r.author.id, name: r.author.username }
          : null,
        viewsCount: r.viewsCount,
        createdAt: r.createdAt,
        likesCount: r._count?.likes ?? 0,
        reviewsCount: r._count?.reviews ?? 0,
      }))
      setRecipes(mapped)
    }

    fetchMyRecipes()
  }, [])

  return (
    <main className="container">
      <h1>Your Recipes</h1>
      <Link href="/recipe/new"><button>Add New Recipe</button></Link>
      {recipes.length > 0 && <RecipeSortSelect value={sort} onChange={setSort} />}

      {recipes.length === 0 ? (
        <p>You haven't created any recipes yet.</p>
      ) : (
        <div>
          {sorted.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </main>
  )
}
