import Link from 'next/link'

export default async function BannedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const { reason } = await searchParams

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <h1>Account Banned</h1>
        <p>Your account has been banned and you have been logged out.</p>
        {reason && (
          <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '0.75em 1em', textAlign: 'left' }}>
            <strong>Reason:</strong>
            <p style={{ margin: '0.25em 0 0' }}>{reason}</p>
          </div>
        )}
        <Link href="/login">
          <button className="primary">Back to Login</button>
        </Link>
      </div>
    </main>
  )
}
