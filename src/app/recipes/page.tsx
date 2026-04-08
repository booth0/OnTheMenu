'use client'

import { useEffect, useState, useMemo } from 'react'
import RecipeCard, { type RecipeCardRecipe } from '@/components/recipe/RecipeCard'
import RecipeSortSelect, { type SortOption, sortRecipes } from '@/components/recipe/RecipeSortSelect'
import { RecipeGridSkeleton } from '@/components/recipe/RecipeCardSkeleton'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeCardRecipe[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')
  const [loading, setLoading] = useState(true)
  const sorted = useMemo(() => sortRecipes(recipes, sort), [recipes, sort])

  useEffect(() => {
    fetch('/api/users/me').then(r => r.ok ? r.json() : null).then(u => setCurrentUserId(u?.id ?? null)).catch(() => {})
  }, [])

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch('/api/recipes')
      const data = await res.json()
      console.log("Fetched recipes:", data); // Debug log
      const mapped: RecipeCardRecipe[] = data.map((r: any) => ({
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
        likesCount: r._count.likes ?? 0,
        reviewsCount: r._count.reviews ?? 0,
      }))
      setRecipes(mapped)
      setLoading(false)
    }

    fetchRecipes()
  }, [])

  return (
    <main className="container">
      <style>
        {`
          select {
            margin-bottom: 1em;
          }
        `}
      </style>
      <h1>Browse Recipes</h1>
      {recipes.length > 0 && <RecipeSortSelect id="recipe-sort" value={sort} onChange={setSort} />}

      {loading ? (
        <RecipeGridSkeleton count={6} />
      ) : recipes.length === 0 ? (
        <p>No recipes yet.</p>
      ) : (
        <div className="featured-grid">
          {sorted.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </main>
  )
}
