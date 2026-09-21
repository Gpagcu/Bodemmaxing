import { useEffect, useState } from 'react'
import { listHistory } from '../api'

export default function HistoryScreen() {
  const [status, setStatus] = useState('loading')   // loading | ready | error
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)

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

  return (
    <section>
      <h2>History</h2>

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
