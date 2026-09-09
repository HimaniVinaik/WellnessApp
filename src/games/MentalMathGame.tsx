import { useEffect, useRef, useState } from 'react'
import { useAppData } from '../context/AppDataContext'

interface Problem {
  question: string
  answer: number
  options: number[]
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateProblem(difficulty: 'Easy' | 'Medium' | 'Hard'): Problem {
  let a: number, b: number, op: string, answer: number

  const opsPool = difficulty === 'Easy' ? ['+', '-'] : difficulty === 'Medium' ? ['+', '-', '×'] : ['+', '-', '×', '÷']
  op = opsPool[randInt(0, opsPool.length - 1)]

  const range = difficulty === 'Easy' ? 20 : difficulty === 'Medium' ? 50 : 100

  switch (op) {
    case '+':
      a = randInt(1, range)
      b = randInt(1, range)
      answer = a + b
      break
    case '-':
      a = randInt(1, range)
      b = randInt(1, a)
      answer = a - b
      break
    case '×': {
      const max = difficulty === 'Medium' ? 12 : 15
      a = randInt(2, max)
      b = randInt(2, max)
      answer = a * b
      break
    }
    default: {
      b = randInt(2, 12)
      answer = randInt(2, 12)
      a = b * answer
    }
  }

  const options = new Set<number>([answer])
  while (options.size < 4) {
    const spread = Math.max(2, Math.round(Math.abs(answer) * 0.2) + randInt(1, 5))
    const candidate = answer + randInt(-spread, spread)
    if (candidate !== answer) options.add(candidate)
  }

  return { question: `${a} ${op} ${b}`, answer, options: shuffle(Array.from(options)) }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DURATION = 60

export default function MentalMathGame({ onExit }: { onExit: () => void }) {
  const { logGameScore } = useAppData()
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const [phase, setPhase] = useState<'setup' | 'playing' | 'done'>('setup')
  const [problem, setProblem] = useState<Problem | null>(null)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [feedback, setFeedback] = useState<{ idx: number; state: 'correct' | 'wrong' } | null>(null)
  const timerRef = useRef<number | null>(null)
  const lockRef = useRef(false)

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    },
    []
  )

  function start() {
    setCorrect(0)
    setWrong(0)
    setTimeLeft(DURATION)
    setProblem(generateProblem(difficulty))
    setFeedback(null)
    setPhase('playing')
    if (timerRef.current) window.clearInterval(timerRef.current)
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
        logGameScore('math', Math.max(0, score), `${difficulty} · ${c} correct, ${w} wrong in ${DURATION}s`)
        return w
      })
      return c
    })
  }

  function choose(idx: number, value: number) {
    if (lockRef.current || !problem) return
    lockRef.current = true
    const isCorrect = value === problem.answer
    setFeedback({ idx, state: isCorrect ? 'correct' : 'wrong' })
    if (isCorrect) setCorrect((c) => c + 1)
    else setWrong((w) => w + 1)

    window.setTimeout(() => {
      setFeedback(null)
      setProblem(generateProblem(difficulty))
      lockRef.current = false
    }, 350)
  }

  if (phase === 'setup') {
    return (
      <div className="stage">
        <h2 style={{ marginTop: 0 }}>Mental Math</h2>
        <p className="hint">Solve as many problems as you can before the {DURATION}-second timer runs out.</p>
        <div className="section-title">Difficulty</div>
        <div className="row" style={{ marginBottom: 18 }}>
          {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              className={`duration-chip ${difficulty === d ? 'active' : ''}`}
              onClick={() => setDifficulty(d)}
              type="button"
            >
              {d}
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

  if (phase === 'playing' && problem) {
    return (
      <div className="stage">
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
        <div className="math-problem">{problem.question}</div>
        <div className="math-options">
          {problem.options.map((opt, i) => (
            <div
              key={i}
              className={`math-option ${feedback?.idx === i ? feedback.state : ''}`}
              onClick={() => choose(i, opt)}
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
