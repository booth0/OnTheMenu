'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useMemo, Suspense } from 'react'
import RecipeCard, { type RecipeCardRecipe } from '@/components/recipe/RecipeCard'
import RecipeSortSelect, { type SortOption, sortRecipes } from '@/components/recipe/RecipeSortSelect'
import type { RecipeApiItem } from '@/types/api'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') ?? ''

  const [recipes, setRecipes] = useState<RecipeCardRecipe[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')
  const sorted = useMemo(() => sortRecipes(recipes, sort), [recipes, sort])

  useEffect(() => {
    fetch('/api/users/me').then(r => r.ok ? r.json() : null).then(u => setCurrentUserId(u?.id ?? null)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!query) {
      setRecipes([])
      return
    }

    async function fetchRecipes() {
      const res = await fetch(`/api/recipes/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      const mapped: RecipeCardRecipe[] = (data as { recipes: RecipeApiItem[] }).recipes.map((r: RecipeApiItem) => ({
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

    fetchRecipes()
  }, [query])

  return (
    <main className='container'>
      <h1>Search results for &ldquo;{query}&rdquo;</h1>

      {query && recipes.length === 0 && (
        <p>No recipes found. Try a different search term.</p>
      )}

      {!query && (
        <p>Enter a search term to find recipes.</p>
      )}

      {recipes.length > 0 && <RecipeSortSelect value={sort} onChange={setSort} />}

      <div>
        {sorted.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} currentUserId={currentUserId} />
        ))}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  )
}
