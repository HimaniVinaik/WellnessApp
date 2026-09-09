import { useEffect, useRef, useState } from 'react'
import { useAppData } from '../context/AppDataContext'

const ICON_SETS: Record<string, string[]> = {
  Easy: ['🌿', '🌊', '🌙', '🔥', '🌸', '⭐'],
  Medium: ['🌿', '🌊', '🌙', '🔥', '🌸', '⭐', '🍃', '🌾'],
}

interface Card {
  key: string
  icon: string
  flipped: boolean
  matched: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(icons: string[]): Card[] {
  const pairs = shuffle([...icons, ...icons])
  return pairs.map((icon, i) => ({ key: `${icon}-${i}`, icon, flipped: false, matched: false }))
}

export default function MemoryMatchGame({ onExit }: { onExit: () => void }) {
  const { logGameScore } = useAppData()
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium'>('Easy')
  const [phase, setPhase] = useState<'setup' | 'playing' | 'done'>('setup')
  const [cards, setCards] = useState<Card[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const lockRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    },
    []
  )

  function start() {
    setCards(buildDeck(ICON_SETS[difficulty]))
    setSelected([])
    setMoves(0)
    setSeconds(0)
    setPhase('playing')
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
  }

  function finish(finalMoves: number, finalSeconds: number, pairCount: number) {
    if (timerRef.current) window.clearInterval(timerRef.current)
    setPhase('done')
    const par = pairCount * 2
    const efficiency = Math.max(0, Math.round(((par - finalMoves) / par) * 100 + 100))
    const score = Math.max(10, efficiency - Math.round(finalSeconds / 4))
    logGameScore('memory', score, `${difficulty} · ${finalMoves} moves in ${finalSeconds}s`)
  }

  function flip(idx: number) {
    if (lockRef.current) return
    const card = cards[idx]
    if (card.flipped || card.matched) return
    const nextSelected = [...selected, idx]
    setCards((cs) => cs.map((c, i) => (i === idx ? { ...c, flipped: true } : c)))

    if (nextSelected.length === 1) {
      setSelected(nextSelected)
      return
    }

    lockRef.current = true
    setSelected([])
    setMoves((m) => m + 1)
    const [a, b] = nextSelected

    window.setTimeout(() => {
      setCards((cs) => {
        const cardA = cs[a]
        const cardB = cs[b]
        const isMatch = cardA.icon === cardB.icon
        const updated = cs.map((c, i) => {
          if (i === a || i === b) {
            return isMatch ? { ...c, matched: true, flipped: true } : { ...c, flipped: false }
          }
          return c
        })
        const allMatched = updated.every((c) => c.matched)
        if (allMatched) {
          const totalPairs = updated.length / 2
          setMoves((m) => {
            finish(m, seconds, totalPairs)
            return m
          })
        }
        return updated
      })
      lockRef.current = false
    }, 650)
  }

  if (phase === 'setup') {
    return (
      <div className="stage">
        <h2 style={{ marginTop: 0 }}>Memory Match</h2>
        <p className="hint">Flip two cards at a time and find every matching pair using the fewest moves.</p>
        <div className="section-title">Grid size</div>
        <div className="row" style={{ marginBottom: 18 }}>
          {(['Easy', 'Medium'] as const).map((d) => (
            <button
              key={d}
              className={`duration-chip ${difficulty === d ? 'active' : ''}`}
              onClick={() => setDifficulty(d)}
              type="button"
            >
              {d} ({ICON_SETS[d].length * 2} cards)
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-block" onClick={start}>
          Start
        </button>
        <button className="btn btn-ghost btn-block" onClick={onExit}>
          Back to games
        </button>
      </div>
    )
  }

  if (phase === 'playing') {
    const cols = difficulty === 'Easy' ? 3 : 4
    return (
      <div className="stage">
        <div className="stat-row" style={{ marginBottom: 14 }}>
          <div className="stat">
            <b>{moves}</b>
            <span>Moves</span>
          </div>
          <div className="stat">
            <b>{seconds}s</b>
            <span>Time</span>
          </div>
        </div>
        <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {cards.map((c, i) => (
            <div
              key={c.key}
              className={`memory-card ${c.flipped ? 'flipped' : ''} ${c.matched ? 'matched' : ''}`}
              onClick={() => flip(i)}
            >
              {c.flipped || c.matched ? c.icon : ''}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="stage">
      <h2 style={{ marginTop: 0 }}>Well matched!</h2>
      <div className="stat-row">
        <div className="stat">
          <b>{moves}</b>
          <span>Moves</span>
        </div>
        <div className="stat">
          <b>{seconds}s</b>
          <span>Time</span>
        </div>
      </div>
      <button className="btn btn-primary btn-block" onClick={start}>
        Play again
      </button>
      <button className="btn btn-ghost btn-block" onClick={onExit}>
        Back to games
      </button>
    </div>
  )
}
