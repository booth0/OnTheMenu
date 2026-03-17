'use client'

import { useState } from 'react'
import Link from 'next/link'

interface HeaderProps {
  isLoggedIn?: boolean
  username?: string
}

export default function Header({ isLoggedIn = false, username }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    console.log('searching for:', searchQuery)
  }

  return (
    <header>
      {/* LEFT — Logo */}
      <Link href="/">
        <span>OnTheMenu</span>
      </Link>

      {/* CENTER — Search */}
      <form onSubmit={handleSearch}>
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
        <button onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
          ☰
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <nav>
            {isLoggedIn ? (
              <>
                <span>Hi, {username}!</span>
                <Link href="/recipes" onClick={() => setMenuOpen(false)}>
                  Browse Recipes
                </Link>
                <Link href="/recipe-books" onClick={() => setMenuOpen(false)}>
                  My Recipe Books
                </Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button>Log Out</button>
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