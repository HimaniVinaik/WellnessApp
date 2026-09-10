import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { CODING_PROBLEMS, CodingProblem } from '../lib/codingProblems'
import { runInSandbox, RunResult } from '../lib/codeRunner'
import Icon from '../components/Icon'

function fmt(v: unknown): string {
  return JSON.stringify(v)
}

function ProblemSolver({ problem, onExit }: { problem: CodingProblem; onExit: () => void }) {
  const { state, logCodingSolved } = useAppData()
  const [code, setCode] = useState(problem.starterCode)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)
  const alreadySolved = state.codingSolved.some((c) => c.problemId === problem.id)
  const justSolved = !!result?.allPass

  async function runTests() {
    setRunning(true)
    setResult(null)
    const r = await runInSandbox(code, problem.functionName, problem.tests)
    setResult(r)
    setRunning(false)
    if (r.allPass) logCodingSolved(problem.id, problem.difficulty, 'javascript', problem.points)
  }

  return (
    <div className="stage">
      <div className="game-toolbar">
        <button className="game-toolbar-btn" onClick={onExit}>
          <Icon name="arrowLeft" size={15} strokeWidth={2} />
          All problems
        </button>
        <button className="game-toolbar-btn" onClick={() => { setCode(problem.starterCode); setResult(null) }}>
          <Icon name="rotate" size={15} strokeWidth={2} />
          Reset
        </button>
      </div>

      <div className="row-between" style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>{problem.title}</h2>
        <span className="pill" style={{ textTransform: 'capitalize' }}>
          {problem.difficulty} · {problem.points} pts
        </span>
      </div>
      {(alreadySolved || justSolved) && <span className="skill-badge mastered">Solved</span>}

      <p className="hint" style={{ marginTop: 10 }}>
        {problem.description}
      </p>
      {problem.examples.map((ex, i) => (
        <div className="hint" key={i} style={{ background: 'var(--surface-alt)', padding: 10, borderRadius: 10, marginBottom: 6 }}>
          <b>Input:</b> {ex.input}
          <br />
          <b>Output:</b> {ex.output}
        </div>
      ))}

      <div className="field" style={{ marginTop: 14 }}>
        <label className="field-label">Your solution (JavaScript)</label>
        <textarea
          className="textarea"
          spellCheck={false}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, lineHeight: 1.5, resize: 'vertical' }}
        />
      </div>

      <button className="btn btn-primary btn-block" onClick={runTests} disabled={running}>
        {running ? 'Running…' : 'Run Tests'}
      </button>

      {result?.fatalError && (
        <div className="card" style={{ marginTop: 14, borderColor: 'var(--danger)' }}>
          <b style={{ color: 'var(--danger)' }}>Error</b>
          <div className="hint" style={{ marginTop: 4 }}>
            {result.fatalError}
          </div>
        </div>
      )}

      {result && result.outcomes.length > 0 && (
        <div className="card" style={{ marginTop: 14 }}>
          {result.allPass ? (
            <div style={{ color: 'var(--success)', fontWeight: 700, marginBottom: 10 }}>
              🎉 All {result.outcomes.length} tests passed! +{problem.points} pts
            </div>
          ) : (
            <div style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: 10 }}>
              {result.outcomes.filter((o) => o.pass).length}/{result.outcomes.length} tests passed
            </div>
          )}
          {result.outcomes.map((o, i) => (
            <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12.5 }}>
              <span style={{ color: o.pass ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{o.pass ? '✓' : '✕'}</span>{' '}
              <code>
                {problem.functionName}({o.args.map(fmt).join(', ')})
              </code>{' '}
              → expected <code>{fmt(o.expected)}</code>, got <code>{fmt(o.actual)}</code>
              {o.error && <div style={{ color: 'var(--danger)' }}>{o.error}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CodingGame({ onExit }: { onExit: () => void }) {
  const { state } = useAppData()
  const [active, setActive] = useState<CodingProblem | null>(null)

  if (active) return <ProblemSolver problem={active} onExit={() => setActive(null)} />

  const solvedIds = new Set(state.codingSolved.map((c) => c.problemId))
  const totalPoints = state.codingSolved.reduce((s, c) => s + c.points, 0)

  return (
    <div className="stage">
      <div className="game-toolbar">
        <button className="game-toolbar-btn" onClick={onExit}>
          <Icon name="arrowLeft" size={15} strokeWidth={2} />
          Back
        </button>
        <span />
      </div>
      <h2 style={{ marginTop: 0 }}>Coding Problems</h2>
      <p className="hint">
        Classic algorithm practice problems. Write your solution in JavaScript and run it against real test cases —
        everything executes locally in your browser.
      </p>
      <div className="stat-row" style={{ marginBottom: 14 }}>
        <div className="stat">
          <b>
            {solvedIds.size}/{CODING_PROBLEMS.length}
          </b>
          <span>Solved</span>
        </div>
        <div className="stat">
          <b>{totalPoints}</b>
          <span>Points</span>
        </div>
      </div>

      {CODING_PROBLEMS.map((p) => (
        <button key={p.id} className="card" style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => setActive(p)}>
          <div className="row-between">
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: 15 }}>{p.title}</h3>
              <span className="hint" style={{ margin: 0, textTransform: 'capitalize' }}>
                {p.difficulty} · {p.points} pts
              </span>
            </div>
            {solvedIds.has(p.id) && <Icon name="check" size={18} strokeWidth={2.4} />}
          </div>
        </button>
      ))}
    </div>
  )
}
