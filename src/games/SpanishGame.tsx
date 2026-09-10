import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { pickPracticeDeck, SpanishEntry, SPANISH_CATEGORIES } from '../lib/spanish'
import Icon from '../components/Icon'

type Phase = 'setup' | 'reviewing' | 'done'

const DECK_SIZE = 10

export default function SpanishGame({ onExit }: { onExit: () => void }) {
  const { state, addSpanishCards, removeSpanishCard, logGameScore } = useAppData()
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [phase, setPhase] = useState<Phase>('setup')
  const [deck, setDeck] = useState<SpanishEntry[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [gotItCount, setGotItCount] = useState(0)

  function start() {
    const learned = new Set(state.spanishCards.filter((c) => c.learned).map((c) => c.spanish.toLowerCase()))
    setDeck(pickPracticeDeck(learned, DECK_SIZE, category))
    setIndex(0)
    setFlipped(false)
    setGotItCount(0)
    setPhase('reviewing')
  }

  function respond(learned: boolean) {
    const card = deck[index]
    const nextGotIt = learned ? gotItCount + 1 : gotItCount
    addSpanishCards([{ spanish: card.spanish, english: card.english, pronunciation: card.pronunciation, category: card.category, learned }])
    if (learned) setGotItCount(nextGotIt)
    if (index + 1 >= deck.length) {
      logGameScore('spanish', nextGotIt * 10, `${nextGotIt}/${deck.length} known this session`)
      setPhase('done')
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  const recent = state.spanishCards.slice(0, 8)

  if (phase === 'setup') {
    return (
      <div className="stage">
        <div className="game-toolbar">
          <button className="game-toolbar-btn" onClick={onExit}>
            <Icon name="arrowLeft" size={15} strokeWidth={2} />
            Back
          </button>
          <span />
        </div>
        <h2 style={{ marginTop: 0 }}>Spanish Flashcards</h2>
        <p className="hint">Common Spanish words and phrases with English translations and pronunciations.</p>
        <div className="section-title">Category</div>
        <div className="row" style={{ marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
          <button className={`duration-chip ${!category ? 'active' : ''}`} onClick={() => setCategory(undefined)}>
            All
          </button>
          {SPANISH_CATEGORIES.map((c) => (
            <button key={c} className={`duration-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-block" onClick={start}>
          Start Practice
        </button>
        <button className="btn btn-ghost btn-block" onClick={onExit}>
          Back to games
        </button>

        {recent.length > 0 && (
          <>
            <div className="section-title">Your word bank</div>
            {recent.map((c) => (
              <div className="card" key={c.id} style={{ marginBottom: 8, padding: 12 }}>
                <div className="row-between">
                  <div>
                    <b style={{ fontSize: 14 }}>{c.spanish}</b>{' '}
                    <span className="hint" style={{ margin: 0 }}>
                      {c.english}
                    </span>
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    <span className={`skill-badge ${c.learned ? 'mastered' : ''}`}>{c.learned ? 'Known' : 'Learning'}</span>
                    <button className="icon-btn" onClick={() => removeSpanishCard(c.id)}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    )
  }

  if (phase === 'reviewing') {
    const card = deck[index]
    return (
      <div className="stage">
        <div className="game-toolbar">
          <button className="game-toolbar-btn" onClick={onExit}>
            <Icon name="arrowLeft" size={15} strokeWidth={2} />
            Back
          </button>
          <button className="game-toolbar-btn" onClick={start}>
            <Icon name="rotate" size={15} strokeWidth={2} />
            Restart
          </button>
        </div>
        <div className="row-between" style={{ marginBottom: 14 }}>
          <span className="pill">
            Card {index + 1}/{deck.length}
          </span>
          <span className="hint" style={{ margin: 0 }}>
            {card.category}
          </span>
        </div>

        <div className="vocab-card">
          <div className="vocab-word">{card.spanish}</div>
          {!flipped ? (
            <button className="btn btn-secondary btn-block" style={{ marginTop: 16 }} onClick={() => setFlipped(true)}>
              Reveal translation
            </button>
          ) : (
            <>
              <div className="vocab-pos">{card.pronunciation}</div>
              <div className="vocab-definition" style={{ textAlign: 'center' }}>
                {card.english}
              </div>
              <div className="math-options" style={{ marginTop: 18 }}>
                <div className="math-option" onClick={() => respond(false)}>
                  Still learning
                </div>
                <div
                  className="math-option"
                  onClick={() => respond(true)}
                  style={{ background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }}
                >
                  Got it
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="stage">
      <div className="game-toolbar">
        <button className="game-toolbar-btn" onClick={onExit}>
          <Icon name="arrowLeft" size={15} strokeWidth={2} />
          Back
        </button>
        <span />
      </div>
      <h2 style={{ marginTop: 0 }}>¡Bien hecho!</h2>
      <div className="stat-row">
        <div className="stat">
          <b>{deck.length}</b>
          <span>Reviewed</span>
        </div>
        <div className="stat">
          <b>{gotItCount}</b>
          <span>Got it</span>
        </div>
        <div className="stat">
          <b>{state.spanishCards.length}</b>
          <span>In your bank</span>
        </div>
      </div>
      <button className="btn btn-primary btn-block" onClick={start}>
        Practice again
      </button>
      <button className="btn btn-ghost btn-block" onClick={onExit}>
        Back to games
      </button>
    </div>
  )
}
