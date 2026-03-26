'use client'

import { useEffect, useState } from 'react'
import RecipeCard, { type RecipeCardRecipe } from '@/components/recipe/RecipeCard'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeCardRecipe[]>([])

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch('/api/recipes')
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
  }, [])

  return (
    <main>
      <h1>Browse Recipes</h1>

      {recipes.length === 0 && (
        <p>No recipes yet.</p>
      )}

      <div>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </main>
  )
}
