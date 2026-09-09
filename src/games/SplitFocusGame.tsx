import { useEffect, useRef, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import Icon from '../components/Icon'

type Task = 'parity' | 'vowel'
type Answer = 'Odd' | 'Even' | 'Vowel' | 'Consonant'

interface Trial {
  number: number
  letter: string
  task: Task
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeTrial(): Trial {
  return {
    number: randInt(1, 20),
    letter: ALPHABET[randInt(0, ALPHABET.length - 1)],
    task: Math.random() < 0.5 ? 'parity' : 'vowel',
  }
}

function correctAnswer(t: Trial): Answer {
  if (t.task === 'parity') return t.number % 2 === 0 ? 'Even' : 'Odd'
  return VOWELS.has(t.letter) ? 'Vowel' : 'Consonant'
}

const DURATION = 60

export default function SplitFocusGame({ onExit }: { onExit: () => void }) {
  const { logGameScore } = useAppData()
  const [phase, setPhase] = useState<'setup' | 'playing' | 'done'>('setup')
  const [trial, setTrial] = useState<Trial | null>(null)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [feedback, setFeedback] = useState<{ answer: Answer; ok: boolean } | null>(null)
  const timerRef = useRef<number | null>(null)
  const feedbackTimeoutRef = useRef<number | null>(null)
  const lockRef = useRef(false)

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current)
    },
    []
  )

  function start() {
    if (timerRef.current) window.clearInterval(timerRef.current)
    if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current)
    lockRef.current = false
    setCorrect(0)
    setWrong(0)
    setTimeLeft(DURATION)
    setTrial(makeTrial())
    setFeedback(null)
    setPhase('playing')
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!)
          finish()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function finish() {
    setPhase('done')
    setCorrect((c) => {
      setWrong((w) => {
        const score = c * 10 - w * 3
        logGameScore('splitfocus', Math.max(0, score), `${c} correct, ${w} wrong in ${DURATION}s`)
        return w
      })
      return c
    })
  }

  function exitGame() {
    if (timerRef.current) window.clearInterval(timerRef.current)
    if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current)
    onExit()
  }

  function choose(answer: Answer) {
    if (lockRef.current || !trial) return
    lockRef.current = true
    const ok = answer === correctAnswer(trial)
    setFeedback({ answer, ok })
    if (ok) setCorrect((c) => c + 1)
    else setWrong((w) => w + 1)

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedback(null)
      setTrial(makeTrial())
      lockRef.current = false
    }, 320)
  }

  if (phase === 'setup') {
    return (
      <div className="stage">
        <h2 style={{ marginTop: 0 }}>Split Focus</h2>
        <p className="hint">
          Each card shows a number and a letter, like <b>7K</b>. The question below changes every round — sometimes
          you're judging the <b>number</b> (odd or even), sometimes the <b>letter</b> (vowel or consonant). Read the
          question each time.
        </p>
        <button className="btn btn-primary btn-block" onClick={start}>
          Start
        </button>
        <button className="btn btn-ghost btn-block" onClick={onExit}>
          Back to games
        </button>
      </div>
    )
  }

  if (phase === 'playing' && trial) {
    const options: Answer[] = trial.task === 'parity' ? ['Odd', 'Even'] : ['Vowel', 'Consonant']
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
        <div className="stat-row" style={{ marginBottom: 6 }}>
          <div className="stat">
            <b>{timeLeft}s</b>
            <span>Time left</span>
          </div>
          <div className="stat">
            <b>{correct}</b>
            <span>Correct</span>
          </div>
          <div className="stat">
            <b>{wrong}</b>
            <span>Wrong</span>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(timeLeft / DURATION) * 100}%` }} />
        </div>
        <div className="split-stimulus">
          {trial.number}
          {trial.letter}
        </div>
        <div className="split-cue">
          {trial.task === 'parity' ? 'Is the number odd or even?' : 'Is the letter a vowel or consonant?'}
        </div>
        <div className="math-options">
          {options.map((opt) => (
            <div
              key={opt}
              className={`math-option ${feedback?.answer === opt ? (feedback.ok ? 'correct' : 'wrong') : ''}`}
              onClick={() => choose(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="stage">
      <h2 style={{ marginTop: 0 }}>Time's up!</h2>
      <div className="stat-row">
        <div className="stat">
          <b>{correct}</b>
          <span>Correct</span>
        </div>
        <div className="stat">
          <b>{wrong}</b>
          <span>Wrong</span>
        </div>
        <div className="stat">
          <b>{Math.max(0, correct * 10 - wrong * 3)}</b>
          <span>Score</span>
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
