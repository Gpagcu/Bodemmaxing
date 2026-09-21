import { useState } from 'react'
import { spinQuest, completeQuest } from '../api'

// The core loop of the app: spin, get a quest, do it (or don't), mark it done.
// Kept to three states rather than the full loading/ready/error/empty set
// from App.jsx, because there is no list to be empty here — only "nothing
// drawn yet", "drawn", and "something went wrong".

export default function SpinScreen() {
  const [quest, setQuest] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSpin() {
    setSpinning(true)
    setError(null)
    try {
      const drawn = await spinQuest()
      setQuest(drawn)
    } catch (caught) {
      setError(caught)
    } finally {
      setSpinning(false)
    }
  }

  async function handleComplete() {
    if (!quest) return
    setCompleting(true)
    try {
      const updated = await completeQuest(quest.id)
      setQuest(updated)
    } catch (caught) {
      setError(caught)
    } finally {
      setCompleting(false)
    }
  }

  return (
    <section className="card">
      <h2>Spin for a quest</h2>
      <p className="muted">Bored? Pull the lever and see what you get.</p>

      {error && (
        <p className="error" role="alert">
          {error.message} <button onClick={handleSpin}>Try again</button>
        </p>
      )}

      <button onClick={handleSpin} disabled={spinning} className="spin-button">
        {spinning ? 'Spinning...' : quest ? 'Spin again' : 'Spin'}
      </button>

      {quest && (
        <div className={`quest-result rarity-${quest.rarity}`}>
          <span className="rarity-badge">{quest.rarity}</span>
          <p className="quest-text">{quest.text}</p>
          {quest.category && <p className="muted">Category: {quest.category}</p>}

          {quest.is_completed ? (
            <p className="muted">✓ Completed</p>
          ) : (
            <button onClick={handleComplete} disabled={completing}>
              {completing ? 'Marking done...' : 'Mark as done'}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
