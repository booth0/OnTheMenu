'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type BookSummary = {
  id: string
  title: string
  description: string | null
  createdAt: string
  _count: { items: number }
}

export default function RecipeBooksPage() {
  const [books, setBooks] = useState<BookSummary[]>([])

  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch('/api/recipe-books')
      if (res.ok) {
        setBooks(await res.json())
      }
    }
    fetchBooks()
  }, [])

  return (
    <main className="container">
      <h1>My Recipe Books</h1>
      <Link href="/recipe-books/new"><button className="primary">Create New Recipe Book</button></Link>

      {books.length === 0 ? (
        <p>You don&apos;t have any recipe books yet.</p>
      ) : (
        <div>
          {books.map((book) => (
            <Link href={`/recipe-books/${book.id}`} key={book.id} style={{ textDecoration: 'none' }}>
              <div className="card">
                <h2>{book.title}</h2>
                {book.description && <p>{book.description}</p>}
                <p>{book._count.items} {book._count.items === 1 ? 'recipe' : 'recipes'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
