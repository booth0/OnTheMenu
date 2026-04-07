'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface HeaderProps {
  isLoggedIn?: boolean
  username?: string
  role?: string
}

export default function Header({ isLoggedIn = false, username, role }: HeaderProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = searchQuery.trim()
      router.push(`/search?query=${encodeURIComponent(trimmed)}`) 
  }

  return (
    <header>
      <style>
        {`
          header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1rem 2rem;
              background-color: var(--secondary-color);
              color: white;
              position: sticky;
              box-shadow: 0 5px 0 var(--secondary-shadow);
              .logo{
                  font-size: 1.5rem;
                  font-weight: bold;
                  color: white;
                  text-decoration: none;
              }
              .search{
                  display: flex;
                  gap: 0.5em;
                  input[type="text"] {
                      padding: 0.5rem;
                      border: none;
                      border-radius: 5px;
                      width: 200px;
                  }
              }
              #toggle{
                  anchor-name: --toggle;
                }
              nav{
                  position-anchor: --toggle;
                  position: absolute;
                  position-area: left bottom;
                  display: flex;
                  flex-direction: column;
                  background: var(--accent-color);
                  padding: 1em;
                  border-radius: 5px;
                  box-shadow: 0 5px 0 var(--accent-shadow);
                  a{
                      color: white;
                      text-decoration: none;
                      padding: 0.2em;
                      }
              }
          }
          `}
      </style>
      {/* LEFT — Logo */}
      <Link href="/" className='logo'>
        <span>OnTheMenu</span>
      </Link>

      {/* CENTER — Search */}
      <form onSubmit={handleSearch} className='search'>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* RIGHT — Hamburger */}
      <div>
        <button onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu" id='toggle'>
          ☰
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <nav>
            {isLoggedIn ? (
              <>
                <span>Hi, {username}!</span>
                <Link href="/recipe/new" onClick={() => setMenuOpen(false)}>
                  New Recipe
                </Link>
                <Link href="/recipes" onClick={() => setMenuOpen(false)}>
                  Browse Recipes
                </Link>
                <Link href="/your-recipes" onClick={() => setMenuOpen(false)}>
                  Your Recipes
                </Link>
                <Link href="/saved-recipes" onClick={() => setMenuOpen(false)}>
                  Saved Recipes
                </Link>
                <Link href="/recipe-books" onClick={() => setMenuOpen(false)}>
                  My Recipe Books
                </Link>
                <Link href="/recipe-books/new" onClick={() => setMenuOpen(false)}>
                  New Recipe Book
                </Link>
                {(role === 'MODERATOR' || role === 'ADMIN') && (
                  <Link href="/moderation" onClick={() => setMenuOpen(false)}>
                    Moderation
                  </Link>
                )}
                <button onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  setMenuOpen(false)
                  router.push('/login')
                  router.refresh()
                }}>Log Out</button>
              </>
            ) : (
              <>
                <Link href="/recipes" onClick={() => setMenuOpen(false)}>
                  Browse Recipes
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Log In
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}