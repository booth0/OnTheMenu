'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/button'

type Role = 'USER' | 'MODERATOR' | 'ADMIN'

type ModerationUser = {
  id: string
  username: string
  email: string | null
  role: Role
  isBanned: boolean
  banReason: string | null
}

type ForcedRecipe = {
  id: string
  slug: string
  title: string
  forcedPrivateReason: string | null
  author: { username: string }
}

export default function ModerationPage() {
  const router = useRouter()
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null)
  const [users, setUsers] = useState<ModerationUser[]>([])
  const [forcedRecipes, setForcedRecipes] = useState<ForcedRecipe[]>([])
  const [tab, setTab] = useState<'users' | 'recipes'>('users')
  const [search, setSearch] = useState('')
  const [pageLoading, setPageLoading] = useState(true)

  // Ban modal state
  const [banTargetId, setBanTargetId] = useState<string | null>(null)
  const [banReason, setBanReason] = useState('')
  const [banSubmitting, setBanSubmitting] = useState(false)
  const [banError, setBanError] = useState<string | null>(null)

  // Unban/unlock loading states
  const [unbanningId, setUnbanningId] = useState<string | null>(null)
  const [unlockingSlug, setUnlockingSlug] = useState<string | null>(null)

  // Role change loading
  const [roleChangingId, setRoleChangingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/users')
      if (res.status === 401 || res.status === 403) {
        router.push('/')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
        setCurrentUserRole(data.currentUserRole)
      }

      const recRes = await fetch('/api/moderation/recipes')
      if (recRes.ok) {
        setForcedRecipes(await recRes.json())
      }

      setPageLoading(false)
    }
    load()
  }, [router])

  function canBan(targetRole: Role): boolean {
    if (targetRole === 'ADMIN') return false
    if (currentUserRole === 'ADMIN') return true
    if (currentUserRole === 'MODERATOR') return targetRole === 'USER'
    return false
  }

  async function handleBanSubmit() {
    if (!banTargetId) return
    if (banReason.trim().length < 10) {
      setBanError('Reason must be at least 10 characters.')
      return
    }
    setBanSubmitting(true)
    setBanError(null)
    const res = await fetch(`/api/users/${banTargetId}/ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: banReason }),
    })
    const data = await res.json()
    if (!res.ok) {
      setBanError(data.error ?? 'Failed to ban user.')
      setBanSubmitting(false)
      return
    }
    setUsers(prev => prev.map(u => u.id === banTargetId ? { ...u, isBanned: true, banReason: banReason } : u))
    setBanTargetId(null)
    setBanReason('')
    setBanSubmitting(false)
  }

  async function handleUnban(userId: string) {
    setUnbanningId(userId)
    const res = await fetch(`/api/users/${userId}/ban`, { method: 'DELETE' })
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: false, banReason: null } : u))
    }
    setUnbanningId(null)
  }

  async function handleRoleChange(userId: string, newRole: Role) {
    setRoleChangingId(userId)
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    }
    setRoleChangingId(null)
  }

  async function handleUnlock(slug: string) {
    setUnlockingSlug(slug)
    const res = await fetch(`/api/recipes/${slug}/force-private`, { method: 'DELETE' })
    if (res.ok) {
      setForcedRecipes(prev => prev.filter(r => r.slug !== slug))
    } else {
      alert('Failed to unlock recipe.')
    }
    setUnlockingSlug(null)
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredRecipes = forcedRecipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.author.username.toLowerCase().includes(search.toLowerCase())
  )

  if (pageLoading) {
    return (
      <main>
        <div className="container">
          <div className="card" style={{ color: 'var(--text-color)' }}><h1>Loading...</h1></div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <style>{`
        .mod-tabs { display: flex; flex-wrap: wrap; gap: 0.5em; margin-bottom: 1em; }
        .mod-tab { padding: 0.5em 1.2em; border-radius: 8px; border: 2px solid var(--secondary-color); background: white; cursor: pointer; font-weight: bold; font-size: 1em; color: var(--secondary-color); }
        .mod-tab.active { background: var(--secondary-color); color: white; }
        .mod-search { width: 100%; padding: 0.5em 0.8em; border-radius: 8px; border: 2px solid var(--primary-color); font-size: 1em; margin-bottom: 1em; box-sizing: border-box; }
        .mod-table { width: 100%; border-collapse: collapse; }
        .mod-table th, .mod-table td { padding: 0.6em 0.8em; text-align: left; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
        .mod-table th { font-weight: bold; opacity: 0.7; font-size: 0.9em; }
        .badge-banned { background: #e53e3e; color: white; border-radius: 6px; padding: 0.1em 0.5em; font-size: 0.8em; font-weight: bold; margin-left: 0.4em; }
        .role-select { padding: 0.3em 0.5em; border-radius: 6px; border: 2px solid var(--secondary-color); font-size: 0.9em; cursor: pointer; }
        .role-select:disabled { opacity: 0.5; cursor: not-allowed; }
        .action-row { display: flex; gap: 0.5em; align-items: center; }
        .btn-ban { background: #e53e3e; color: white; border: none; padding: 0.35em 0.9em; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.9em; }
        .btn-ban:hover { opacity: 0.85; }
        .btn-ban:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-unban { background: #38a169; color: white; border: none; padding: 0.35em 0.9em; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.9em; }
        .btn-unban:hover { opacity: 0.85; }
        .btn-unban:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-unlock { background: #e53e3e; color: white; border: none; padding: 0.35em 0.9em; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.9em; }
        .btn-unlock:hover { opacity: 0.85; }
        .btn-unlock:disabled { opacity: 0.5; cursor: not-allowed; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: white; border-radius: 16px; padding: 1.5em; max-width: 420px; width: 90%; display: flex; flex-direction: column; gap: 1em; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .modal h2 { margin: 0; }
        .modal textarea { width: 100%; min-height: 90px; padding: 0.6em; border-radius: 8px; border: 2px solid #e2e8f0; font-family: inherit; font-size: 1em; resize: vertical; box-sizing: border-box; }
        .modal-actions { display: flex; gap: 0.75em; justify-content: flex-end; }
        .recipe-link { color: var(--secondary-color); font-weight: bold; text-decoration: none; }
        .recipe-link:hover { text-decoration: underline; }
        .reason-cell { max-width: 200px; font-size: 0.9em; opacity: 0.8; }
        @media (max-width: 640px) {
          .mod-table thead { display: none; }
          .mod-table tr { display: block; margin-bottom: 1em; border: 2px solid var(--primary-color); border-radius: 12px; overflow: hidden; }
          .mod-table td { display: flex; justify-content: space-between; align-items: center; padding: 0.6em 0.8em; border-bottom: 1px solid #e2e8f0; }
          .mod-table td:last-child { border-bottom: none; }
          .mod-table td::before { content: attr(data-label); font-weight: bold; opacity: 0.7; font-size: 0.85em; margin-right: 1em; flex-shrink: 0; }
          .reason-cell { max-width: unset; }
        }
      `}</style>

      <div className="container">
        <div className="card" style={{ color: 'var(--text-color)' }}>
          <h1>Moderation</h1>
          <p style={{ opacity: 0.8 }}>
            {currentUserRole === 'ADMIN' ? 'Admin access — full control.' : 'Moderator access.'}
          </p>
        </div>

        <div className="card light">
          <div className="mod-tabs">
            <button
              className={`mod-tab${tab === 'users' ? ' active' : ''}`}
              onClick={() => { setTab('users'); setSearch('') }}
            >
              Users
            </button>
            <button
              className={`mod-tab${tab === 'recipes' ? ' active' : ''}`}
              onClick={() => { setTab('recipes'); setSearch('') }}
            >
              Force-Privated Recipes
            </button>
          </div>

          <input
            className="mod-search"
            type="text"
            placeholder={tab === 'users' ? 'Search by username or email…' : 'Search by title or author…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {tab === 'users' && (
            filteredUsers.length === 0 ? (
              <p style={{ opacity: 0.6 }}>No users found.</p>
            ) : (
              <table className="mod-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td data-label="Username">
                        {user.username}
                        {user.isBanned && <span className="badge-banned">BANNED</span>}
                      </td>
                      <td data-label="Email">{user.email ?? '—'}</td>
                      <td data-label="Role">
                        {currentUserRole === 'ADMIN' ? (
                          <select
                            className="role-select"
                            value={user.role}
                            disabled={roleChangingId === user.id}
                            onChange={e => handleRoleChange(user.id, e.target.value as Role)}
                          >
                            <option value="USER">USER</option>
                            <option value="MODERATOR">MODERATOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        ) : (
                          user.role
                        )}
                      </td>
                      <td data-label="Actions">
                        <div className="action-row">
                          {user.isBanned ? (
                            canBan(user.role) && (
                              <button
                                className="btn-unban"
                                disabled={unbanningId === user.id}
                                onClick={() => handleUnban(user.id)}
                              >
                                {unbanningId === user.id ? 'Unbanning…' : 'Unban'}
                              </button>
                            )
                          ) : (
                            canBan(user.role) && (
                              <button
                                className="btn-ban"
                                onClick={() => { setBanTargetId(user.id); setBanReason(''); setBanError(null) }}
                              >
                                Ban
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {tab === 'recipes' && (
            filteredRecipes.length === 0 ? (
              <p style={{ opacity: 0.6 }}>No force-privated recipes.</p>
            ) : (
              <table className="mod-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecipes.map(recipe => (
                    <tr key={recipe.id}>
                      <td data-label="Title">
                        <Link href={`/recipe/${recipe.slug}`} className="recipe-link">
                          {recipe.title}
                        </Link>
                      </td>
                      <td data-label="Author">{recipe.author.username}</td>
                      <td data-label="Reason" className="reason-cell">{recipe.forcedPrivateReason ?? '—'}</td>
                      <td data-label="Action">
                        <button
                          className="btn-unlock"
                          disabled={unlockingSlug === recipe.slug}
                          onClick={() => handleUnlock(recipe.slug)}
                        >
                          {unlockingSlug === recipe.slug ? 'Unlocking…' : 'Unlock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      {/* Ban Modal */}
      {banTargetId && (
        <div className="modal-overlay" onClick={() => { if (!banSubmitting) setBanTargetId(null) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Ban User</h2>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Please provide a reason for this ban (minimum 10 characters).
            </p>
            <textarea
              placeholder="Enter ban reason…"
              value={banReason}
              onChange={e => { setBanReason(e.target.value); setBanError(null) }}
              disabled={banSubmitting}
            />
            {banError && <p style={{ color: '#e53e3e', margin: 0 }}>{banError}</p>}
            <div className="modal-actions">
              <Button type="secondary" disabled={banSubmitting} onClick={() => setBanTargetId(null)}>
                Cancel
              </Button>
              <Button type="primary" disabled={banSubmitting} onClick={handleBanSubmit}>
                {banSubmitting ? 'Banning…' : 'Confirm Ban'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
