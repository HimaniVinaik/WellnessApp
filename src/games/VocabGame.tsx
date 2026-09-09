import { useEffect, useRef, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { getWordsOfTheDay, pollFreshWords, VocabWordDraft } from '../lib/vocab'
import Icon from '../components/Icon'

type Phase = 'loading' | 'reviewing' | 'done'

export default function VocabGame({ onExit }: { onExit: () => void }) {
  const { state, addVocabWords, removeVocabWord, logGameScore } = useAppData()
  const [phase, setPhase] = useState<Phase>('loading')
  const [words, setWords] = useState<VocabWordDraft[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [gotItCount, setGotItCount] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let cancelled = false
    setPhase('loading')
    getWordsOfTheDay(3).then((today) => {
      if (cancelled) return
      setWords(today)
      setIndex(0)
      setFlipped(false)
      setGotItCount(0)
      setPhase('reviewing')
    })
    return () => {
      cancelled = true
    }
  }, [])

  function restart() {
    setIndex(0)
    setFlipped(false)
    setGotItCount(0)
    setPhase(words.length > 0 ? 'reviewing' : 'loading')
  }

  function playPronunciation() {
    const url = words[index]?.audioUrl
    if (!url) return
    if (audioRef.current) audioRef.current.pause()
    const audio = new Audio(url)
    audioRef.current = audio
    audio.play().catch(() => {})
  }

  function respond(learned: boolean) {
    const w = words[index]
    addVocabWords([
      {
        word: w.word,
        partOfSpeech: w.partOfSpeech,
        phonetic: w.phonetic,
        definition: w.definition,
        example: w.example,
        audioUrl: w.audioUrl,
        source: w.source,
        learned,
      },
    ])
    const nextGotIt = learned ? gotItCount + 1 : gotItCount
    if (learned) setGotItCount(nextGotIt)
    if (index + 1 >= words.length) {
      logGameScore('vocab', nextGotIt * 10, `${nextGotIt}/${words.length} known this session`)
      setPhase('done')
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  async function getMoreWords() {
    setLoadingMore(true)
    try {
      const fresh = await pollFreshWords(2)
      setWords(fresh)
      setIndex(0)
      setFlipped(false)
      setGotItCount(0)
      setPhase('reviewing')
    } finally {
      setLoadingMore(false)
    }
  }

  const recent = state.vocabWords.slice(0, 8)

  if (phase === 'loading') {
    return (
      <div className="stage">
        <div className="game-toolbar">
          <button className="game-toolbar-btn" onClick={onExit}>
            <Icon name="arrowLeft" size={15} strokeWidth={2} />
            Back
          </button>
          <span />
        </div>
        <div className="empty-state">
          <div className="glyph">
            <Icon name="letters" size={34} strokeWidth={1.4} />
          </div>
          <div>Fetching today's words…</div>
        </div>
      </div>
    )
  }

  if (phase === 'reviewing') {
    const w = words[index]
    return (
      <div className="stage">
        <div className="game-toolbar">
          <button className="game-toolbar-btn" onClick={onExit}>
            <Icon name="arrowLeft" size={15} strokeWidth={2} />
            Back
          </button>
          <button className="game-toolbar-btn" onClick={restart}>
            <Icon name="rotate" size={15} strokeWidth={2} />
            Restart
          </button>
        </div>
        <div className="row-between" style={{ marginBottom: 14 }}>
          <span className="pill">Word {index + 1}/{words.length}</span>
          <span className="hint" style={{ margin: 0 }}>{w.source}</span>
        </div>

        <div className="vocab-card">
          <div className="vocab-word">{w.word}</div>
          <div className="row" style={{ justifyContent: 'center', gap: 8, marginBottom: 4 }}>
            <span className="vocab-phonetic">{w.phonetic ? `/${w.phonetic}/` : 'pronunciation unavailable'}</span>
            {w.audioUrl && (
              <button className="icon-btn" onClick={playPronunciation} aria-label="Hear pronunciation">
                <Icon name="volume" size={17} strokeWidth={1.8} />
              </button>
            )}
          </div>

          {!flipped ? (
            <button className="btn btn-secondary btn-block" style={{ marginTop: 16 }} onClick={() => setFlipped(true)}>
              Reveal definition
            </button>
          ) : (
            <>
              <div className="vocab-pos">{w.partOfSpeech}</div>
              <div className="vocab-definition">{w.definition}</div>
              {w.example && <div className="vocab-example">“{w.example}”</div>}
              <div className="math-options" style={{ marginTop: 18 }}>
                <div className="math-option" onClick={() => respond(false)}>
                  Still learning
                </div>
                <div className="math-option" onClick={() => respond(true)} style={{ background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }}>
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
      <h2 style={{ marginTop: 0 }}>Nice work!</h2>
      <div className="stat-row">
        <div className="stat">
          <b>{words.length}</b>
          <span>Reviewed</span>
        </div>
        <div className="stat">
          <b>{gotItCount}</b>
          <span>Got it</span>
        </div>
        <div className="stat">
          <b>{state.vocabWords.length}</b>
          <span>In your bank</span>
        </div>
      </div>
      <button className="btn btn-primary btn-block" onClick={getMoreWords} disabled={loadingMore}>
        {loadingMore ? 'Polling new words…' : 'Poll new words from the web'}
      </button>
      <button className="btn btn-ghost btn-block" onClick={onExit}>
        Back to games
      </button>

      {recent.length > 0 && (
        <>
          <div className="section-title">Your word bank</div>
          {recent.map((v) => (
            <div className="card" key={v.id} style={{ marginBottom: 8, padding: 12 }}>
              <div className="row-between">
                <div>
                  <b style={{ fontSize: 14 }}>{v.word}</b>{' '}
                  <span className="hint" style={{ margin: 0 }}>
                    {v.partOfSpeech}
                  </span>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  <span className={`skill-badge ${v.learned ? 'mastered' : ''}`}>{v.learned ? 'Known' : 'Learning'}</span>
                  <button className="icon-btn" onClick={() => removeVocabWord(v.id)}>
                    ✕
                  </button>
                </div>
              </div>
              <div className="hint" style={{ marginTop: 4 }}>
                {v.definition}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
