import { useRef, useState } from 'react'
import { spinQuest, completeQuest } from '../api'

// Segment order around the wheel, and the angle (clockwise from 12 o'clock)
// of each segment's center. Must match the conic-gradient stops in styles.css.
const SEGMENT_ANGLES = {
  common: 30,
  uncommon: 90,
  rare: 150,
  epic: 210,
  legendary: 270,
  unique: 330,
}

// Rotation always increases — never jumps backward — so the wheel always
// visually spins forward, however many times it's been spun before.
function getTargetRotation(currentRotation, rarity) {
  const targetAngle = (360 - (SEGMENT_ANGLES[rarity] ?? 30)) % 360
  const currentAngle = ((currentRotation % 360) + 360) % 360
  let delta = targetAngle - currentAngle
  if (delta <= 0) delta += 360
  const extraFullSpins = 3 * 360 // a few extra full turns for a satisfying finish
  return currentRotation + delta + extraFullSpins
}

export default function SpinScreen() {
  const [quest, setQuest] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState(null)
  const [rotation, setRotation] = useState(0)
  const intervalRef = useRef(null)

  async function handleSpin() {
    setSpinning(true)
    setError(null)

    // Spin continuously and fast while waiting for the server — this looks
    // intentional (not broken) even if Render's free tier is cold-starting
    // and takes a while to respond, since it just keeps going either way.
    intervalRef.current = setInterval(() => {
      setRotation((r) => r + 45)
    }, 50)

    try {
      const drawn = await spinQuest()
      clearInterval(intervalRef.current)
      // Decisive final spin: land precisely on the drawn rarity's segment.
      setRotation((r) => getTargetRotation(r, drawn.rarity))
      setQuest(drawn)
    } catch (caught) {
      clearInterval(intervalRef.current)
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

      <div className="gacha-wrap">
        <div className="gacha-pointer" aria-hidden="true" />
        <div
          className="gacha-wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 0.05s linear' : 'transform 1.8s cubic-bezier(0.12, 0.67, 0.25, 1)',
          }}
          aria-hidden="true"
        />
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

