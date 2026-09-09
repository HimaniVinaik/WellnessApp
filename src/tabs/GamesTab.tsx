import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import NBackGame from '../games/NBackGame'
import MemoryMatchGame from '../games/MemoryMatchGame'
import MentalMathGame from '../games/MentalMathGame'
import { GameKind } from '../types'
import Icon, { IconName } from '../components/Icon'

const GAME_META: Record<GameKind, { title: string; desc: string; glyph: IconName }> = {
  nback: { title: 'N-Back', desc: 'Working memory recall challenge', glyph: 'layoutGrid' },
  memory: { title: 'Memory Match', desc: 'Card pairs, minimal moves', glyph: 'cards' },
  math: { title: 'Mental Math', desc: 'Fast arithmetic under a clock', glyph: 'divide' },
}

function bestScore(scores: { game: GameKind; score: number }[], game: GameKind) {
  const filtered = scores.filter((s) => s.game === game)
  if (filtered.length === 0) return null
  return Math.max(...filtered.map((s) => s.score))
}

export default function GamesTab() {
  const { state } = useAppData()
  const [active, setActive] = useState<GameKind | null>(null)

  if (active === 'nback') return <NBackGame onExit={() => setActive(null)} />
  if (active === 'memory') return <MemoryMatchGame onExit={() => setActive(null)} />
  if (active === 'math') return <MentalMathGame onExit={() => setActive(null)} />

  return (
    <div>
      <div className="section-title">Choose a workout</div>
      <div className="game-grid">
        {(Object.keys(GAME_META) as GameKind[]).map((g) => {
          const meta = GAME_META[g]
          const best = bestScore(state.gameScores, g)
          return (
            <button key={g} className="game-tile" onClick={() => setActive(g)}>
              <div className="glyph">
                <Icon name={meta.glyph} size={26} strokeWidth={1.6} />
              </div>
              <h3>{meta.title}</h3>
              <p>{meta.desc}</p>
              {best !== null && <span className="pill">Best {best}</span>}
            </button>
          )
        })}
      </div>

      <div className="section-title">Recent sessions</div>
      <div className="card">
        {state.gameScores.length === 0 ? (
          <div className="hint">Play a round to start tracking your progress.</div>
        ) : (
          state.gameScores.slice(0, 8).map((g) => (
            <div className="row-between" key={g.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{GAME_META[g.game].title}</div>
                <div className="hint" style={{ margin: 0 }}>
                  {g.detail}
                </div>
              </div>
              <span className="pill">{g.score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
