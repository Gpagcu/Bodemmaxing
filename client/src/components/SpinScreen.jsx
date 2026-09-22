import { useState } from 'react'
import { spinQuest, completeQuest } from '../api'

// The core loop of the app: spin, get a quest, do it (or don't), mark it done.
//
// The capsule is keyed on the quest's id (or 'idle' when there is none) so
// that React remounts it — and therefore replays its CSS animation — every
// time a new quest is drawn, rather than only on the very first render.

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

  const capsuleClass = [
    'capsule',
    quest ? `rarity-${quest.rarity}` : '',
    spinning ? 'spinning' : '',
    !spinning && quest ? 'landed' : '',
  ].filter(Boolean).join(' ')

  return (
    <section className="card">
      <h2>Spin for a quest</h2>
      <p className="muted">Bored? Push the button and see what you get.</p>

      {error && (
        <p className="error" role="alert">
          {error.message} <button onClick={handleSpin}>Try again</button>
        </p>
      )}

      <div className="capsule-wrap">
        <div key={quest?.id ?? 'idle'} className={capsuleClass} aria-hidden="true" />
      </div>

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

