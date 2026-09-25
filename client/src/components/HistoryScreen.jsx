import { useEffect, useState } from 'react'
import { listHistory, resetHistory } from '../api'

export default function HistoryScreen() {
  const [status, setStatus] = useState('loading')   // loading | ready | error
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)
  const [resetting, setResetting] = useState(false)

  async function load() {
    setStatus('loading')
    setError(null)
    try {
      setRows(await listHistory())
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleReset() {
    if (!window.confirm('Reset all history? This clears every completed quest and cannot be undone.')) {
      return
    }
    setResetting(true)
    setError(null)
    try {
      await resetHistory()
      setRows([])
    } catch (caught) {
      setError(caught)
    } finally {
      setResetting(false)
    }
  }

  return (
    <section>
      <div className="row-head">
        <h2>History</h2>
        {rows.length > 0 && (
          <button onClick={handleReset} disabled={resetting} className="secondary">
            {resetting ? 'Resetting...' : 'Reset history'}
          </button>
        )}
      </div>

      {error && (
        <p className="error" role="alert">
          {error.message} <button onClick={load}>Try again</button>
        </p>
      )}

      {status === 'loading' && <p className="muted">Loading your history...</p>}

      {status === 'ready' && rows.length === 0 && (
        <p className="muted">Nothing completed yet. Go spin for a quest.</p>
      )}

      {status === 'ready' && rows.length > 0 && (
        <ul className="list">
          {rows.map((row) => (
            <li key={row.id} className="card">
              <div className="row-head">
                <p className="quest-text">{row.text}</p>
                <span className={`rarity-badge rarity-${row.rarity}`}>{row.rarity}</span>
              </div>
              <footer>
                <time dateTime={row.completed_at}>
                  {new Date(row.completed_at).toLocaleString()}
                </time>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

