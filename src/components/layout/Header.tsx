'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import styles from './Header.module.css'

interface HeaderProps {
  isLoggedIn?: boolean
  username?: string
  role?: string
}

export default function Header({ isLoggedIn = false, username, role }: HeaderProps) {
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    router.push(`/search?query=${encodeURIComponent(trimmed)}`)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <header className={styles.siteHeader}>
      {/* Logo */}
      <Link href="/" className={styles.logo}>OnTheMenu</Link>

      {/* Search */}
      <form onSubmit={handleSearch} className={styles.search}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchSubmit}>Search</button>
      </form>

      {/* Desktop Nav */}
      <nav className={styles.desktopNav}>
        <Link href="/recipes" className={styles.browseBtn}>Browse</Link>

        {isLoggedIn && (
          <Link href="/recipe/new" className={styles.newRecipeBtn}>+ New Recipe</Link>
        )}

        {isLoggedIn ? (
          <div className={styles.profileWrapper}>
            <button
              className={styles.profilePill}
              onClick={() => setProfileOpen((p) => !p)}
              aria-label="Open profile menu"
            >
              👤 {username}
              <ChevronDown
                size={14}
                style={{
                  transition: 'transform 0.2s',
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {profileOpen && (
              <>
                <div className={styles.dropdownOverlay} onClick={() => setProfileOpen(false)} />
                <div className={styles.profileDropdown}>
                  <span className={styles.dropdownGreeting}>Hi, {username}!</span>
                  <Link href="/your-recipes" onClick={() => setProfileOpen(false)}>Your Recipes</Link>
                  <Link href="/saved-recipes" onClick={() => setProfileOpen(false)}>Saved Recipes</Link>
                  <Link href="/recipe-books" onClick={() => setProfileOpen(false)}>Recipe Books</Link>
                  {(role === 'MODERATOR' || role === 'ADMIN') && (
                    <Link href="/moderation" onClick={() => setProfileOpen(false)}>Moderation</Link>
                  )}
                  <div className={styles.dropdownDivider} />
                  <button className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className={styles.navLink}>Log In</Link>
            <Link href="/register" className={styles.signupBtn}>Sign Up</Link>
          </>
        )}
      </nav>

      {/* Mobile hamburger */}
      <button
        className={styles.hamburger}
        onClick={() => setMobileMenuOpen((p) => !p)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          {isLoggedIn ? (
            <>
              <span>Hi, {username}!</span>
              <Link href="/recipe/new" onClick={() => setMobileMenuOpen(false)}>+ New Recipe</Link>
              <Link href="/recipes" onClick={() => setMobileMenuOpen(false)}>Browse Recipes</Link>
              <Link href="/your-recipes" onClick={() => setMobileMenuOpen(false)}>Your Recipes</Link>
              <Link href="/saved-recipes" onClick={() => setMobileMenuOpen(false)}>Saved Recipes</Link>
              <Link href="/recipe-books" onClick={() => setMobileMenuOpen(false)}>Recipe Books</Link>
              {(role === 'MODERATOR' || role === 'ADMIN') && (
                <Link href="/moderation" onClick={() => setMobileMenuOpen(false)}>Moderation</Link>
              )}
              <div className={styles.mobileDivider} />
              <button className={styles.mobileLogout} onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link href="/recipes" onClick={() => setMobileMenuOpen(false)}>Browse Recipes</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
