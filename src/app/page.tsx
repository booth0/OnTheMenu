'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RecipeCard, { type RecipeCardRecipe } from '@/components/recipe/RecipeCard'
import { RecipeGridSkeleton } from '@/components/recipe/RecipeCardSkeleton'
import type { RecipeApiItem } from '@/types/api'

export default function HomePage() {
  const [featured, setFeatured] = useState<RecipeCardRecipe[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.ok ? r.json() : null)
      .then(u => setCurrentUserId(u?.id ?? null))
      .catch(() => {})

    fetch('/api/recipes/featured')
      .then(r => r.json())
      .then((data: RecipeApiItem[]) => {
        setFeatured(
          data.map(r => ({
            id: r.id,
            slug: r.slug,
            title: r.title,
            description: r.description,
            featuredImage: r.featuredImage,
            author: r.author ? { id: r.author.id, name: r.author.username } : null,
            viewsCount: r.viewsCount,
            createdAt: r.createdAt,
            likesCount: r._count?.likes ?? 0,
            reviewsCount: r._count?.reviews ?? 0,
          }))
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      {/* Hero Banner */}
      <section className="hero">
        <h1>OnTheMenu</h1>
        <p>Discover, create, and share your favorite recipes with the world.</p>
      </section>

      <div className="container">
        {/* Featured Recipes */}
        <section className="home-section">
          <h2>Featured Recipes</h2>
          {loading ? (
            <RecipeGridSkeleton count={3} />
          ) : featured.length === 0 ? (
            <p>No featured recipes yet — be the first to share one!</p>
          ) : (
            <div className="featured-grid">
              {featured.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} currentUserId={currentUserId} priority={i === 0} />
              ))}
            </div>
          )}
          <div className="centered" style={{ marginTop: '1rem' }}>
            <Link href="/recipes">
              <button className="primary">Explore All Recipes</button>
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="home-section">
          <h2>Get Started</h2>
          <div className="action-cards">
            <Link href="/recipe/new" className="action-card primary-card">
              <h3>Upload a Recipe</h3>
              <p>Share your culinary creations with the community.</p>
            </Link>
            <Link href="/recipe-books/new" className="action-card secondary-card">
              <h3>Create a Recipe Book</h3>
              <p>Organize recipes into themed collections.</p>
            </Link>
            <Link href="/your-recipes" className="action-card accent-card">
              <h3>Your Recipes</h3>
              <p>View and manage all the recipes you&apos;ve created.</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
