import { useEffect, useRef, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import Icon from '../components/Icon'

const GRID = 9
const INTERVAL = 1800
const STIMULUS_MS = 650

interface Stats {
  hits: number
  misses: number
  falseAlarms: number
  correctRejections: number
}

function buildSequence(n: number, length: number): number[] {
  const seq: number[] = []
  for (let i = 0; i < length; i++) {
    if (i >= n && Math.random() < 0.35) seq.push(seq[i - n])
    else seq.push(Math.floor(Math.random() * GRID))
  }
  return seq
}

export default function NBackGame({ onExit }: { onExit: () => void }) {
  const { logGameScore } = useAppData()
  const [n, setN] = useState(2)
  const [phase, setPhase] = useState<'setup' | 'playing' | 'done'>('setup')
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [lit, setLit] = useState(false)
  const [trialNum, setTrialNum] = useState(0)
  const [total, setTotal] = useState(0)
  const [result, setResult] = useState<Stats | null>(null)
  const [justPressed, setJustPressed] = useState(false)

  const seqRef = useRef<number[]>([])
  const idxRef = useRef(-1)
  const respondedRef = useRef(false)
  const statsRef = useRef<Stats>({ hits: 0, misses: 0, falseAlarms: 0, correctRejections: 0 })
  const stimulusTimer = useRef<number | null>(null)
  const trialTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (stimulusTimer.current) window.clearTimeout(stimulusTimer.current)
      if (trialTimer.current) window.clearTimeout(trialTimer.current)
    },
    []
  )

  function finalizeTrial(i: number, length: number) {
    const seq = seqRef.current
    const s = statsRef.current
    if (i < n) return
    const isMatch = seq[i] === seq[i - n]
    if (isMatch && respondedRef.current) s.hits++
    else if (isMatch && !respondedRef.current) s.misses++
    else if (!isMatch && respondedRef.current) s.falseAlarms++
    else s.correctRejections++
  }

  function runTrial(length: number) {
    if (idxRef.current >= 0) finalizeTrial(idxRef.current, length)
    idxRef.current += 1
    const i = idxRef.current
    setTrialNum(Math.min(i + 1, length))
    if (i >= length) {
      finish()
      return
    }
    respondedRef.current = false
    setJustPressed(false)
    const cell = seqRef.current[i]
    setActiveCell(cell)
    setLit(true)
    stimulusTimer.current = window.setTimeout(() => setLit(false), STIMULUS_MS)
    trialTimer.current = window.setTimeout(() => runTrial(length), INTERVAL)
  }

  function finish() {
    const s = statsRef.current
    setResult({ ...s })
    setPhase('done')
    const totalMatches = s.hits + s.misses
    const accuracy = totalMatches > 0 ? Math.round((s.hits / totalMatches) * 100) : 100
    logGameScore('nback', accuracy, `${n}-back, ${accuracy}% accuracy (${s.hits} hits, ${s.falseAlarms} false alarms)`)
  }

  function start() {
    if (stimulusTimer.current) window.clearTimeout(stimulusTimer.current)
    if (trialTimer.current) window.clearTimeout(trialTimer.current)
    const length = 20 + n * 4
    seqRef.current = buildSequence(n, length)
    idxRef.current = -1
    statsRef.current = { hits: 0, misses: 0, falseAlarms: 0, correctRejections: 0 }
    setTotal(length)
    setResult(null)
    setPhase('playing')
    runTrial(length)
  }

  function pressMatch() {
    respondedRef.current = true
    setJustPressed(true)
  }

  function exitGame() {
    if (stimulusTimer.current) window.clearTimeout(stimulusTimer.current)
    if (trialTimer.current) window.clearTimeout(trialTimer.current)
    onExit()
  }

  if (phase === 'setup') {
    return (
      <div className="stage">
        <h2 style={{ marginTop: 0 }}>N-Back</h2>
        <p className="hint">
          Watch the square light up around the grid. Press <b>Match</b> whenever the current position is the same as
          it was <b>{n}</b> step{n > 1 ? 's' : ''} ago.
        </p>
        <div className="section-title">Difficulty</div>
        <div className="row" style={{ marginBottom: 18 }}>
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              className={`duration-chip ${n === lvl ? 'active' : ''}`}
              onClick={() => setN(lvl)}
              type="button"
            >
              {lvl}-back
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
    return (
      <div className="stage">
        <div className="game-toolbar">
          <button className="game-toolbar-btn" onClick={exitGame}>
            <Icon name="arrowLeft" size={15} strokeWidth={2} />
            Back
          </button>
          <button className="game-toolbar-btn" onClick={start}>
            <Icon name="rotate" size={15} strokeWidth={2} />
            Restart
          </button>
        </div>
        <div className="row-between" style={{ marginBottom: 10 }}>
          <span className="pill">{n}-back</span>
          <span className="hint" style={{ margin: 0 }}>
            Trial {trialNum}/{total}
          </span>
        </div>
        <div className="progress-track" style={{ marginBottom: 14 }}>
          <div className="progress-fill" style={{ width: `${(trialNum / total) * 100}%` }} />
        </div>
        <div className="game-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {Array.from({ length: GRID }).map((_, i) => (
            <div key={i} className={`nback-square ${lit && activeCell === i ? 'lit' : ''}`} style={{ margin: 0 }} />
          ))}
        </div>
        <button
          className={`btn btn-block ${justPressed ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginTop: 18 }}
          onClick={pressMatch}
          disabled={justPressed}
        >
          {justPressed ? 'Marked ✓' : 'Match'}
        </button>
      </div>
    )
  }

  const s = result!
  const totalMatches = s.hits + s.misses
  const accuracy = totalMatches > 0 ? Math.round((s.hits / totalMatches) * 100) : 100

  return (
    <div className="stage">
      <h2 style={{ marginTop: 0 }}>Session complete</h2>
      <div className="stat-row">
        <div className="stat">
          <b>{accuracy}%</b>
          <span>Accuracy</span>
        </div>
        <div className="stat">
          <b>{s.hits}</b>
          <span>Hits</span>
        </div>
        <div className="stat">
          <b>{s.falseAlarms}</b>
          <span>False alarms</span>
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
