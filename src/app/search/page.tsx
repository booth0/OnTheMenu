'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import RecipeCard, { type RecipeCardRecipe } from '@/components/recipe/RecipeCard'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') ?? ''

  const [recipes, setRecipes] = useState<RecipeCardRecipe[]>([])

  useEffect(() => {
    if (!query) {
      setRecipes([])
      return
    }

    async function fetchRecipes() {
      const res = await fetch(`/api/recipes/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      const mapped: RecipeCardRecipe[] = data.recipes.map((r: any) => ({
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

      <div>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
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
