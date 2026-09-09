import { useEffect, useRef, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { SOUNDSCAPES, SoundscapeKind, SoundscapePlayer } from '../lib/soundscape'

const DURATIONS = [3, 5, 10, 15, 20, 30]

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function MeditationTab() {
  const { state, logMeditationSession } = useAppData()
  const [duration, setDuration] = useState(10)
  const [soundscape, setSoundscape] = useState<SoundscapeKind>('rain')
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(duration * 60)
  const playerRef = useRef<SoundscapePlayer | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    playerRef.current = new SoundscapePlayer()
    return () => {
      playerRef.current?.stop()
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (!running) setRemaining(duration * 60)
  }, [duration, running])

  useEffect(() => {
    if (running && playerRef.current) {
      playerRef.current.play(soundscape)
    }
  }, [soundscape, running])

  function finishSession(completedSeconds: number) {
    setRunning(false)
    playerRef.current?.stop()
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    const minutes = Math.max(1, Math.round(completedSeconds / 60))
    logMeditationSession(minutes, soundscape)
  }

  function start() {
    setRemaining(duration * 60)
    setRunning(true)
    playerRef.current?.play(soundscape)
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          finishSession(duration * 60)
          return 0
        }
        return r - 1
      })
    }, 1000)
  }

  function stopEarly() {
    const elapsed = duration * 60 - remaining
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    playerRef.current?.stop()
    setRunning(false)
    if (elapsed >= 30) logMeditationSession(Math.round(elapsed / 60) || 1, soundscape)
    setRemaining(duration * 60)
  }

  const total = duration * 60
  const pct = running ? ((total - remaining) / total) * 100 : 0
  const circumference = 2 * Math.PI * 46

  const totalMinutes = state.meditationSessions.reduce((sum, s) => sum + s.durationMinutes, 0)

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="timer-ring-wrap">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--surface-alt)" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (pct / 100) * circumference}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="center">
            <div className="time">{formatTime(remaining)}</div>
            <div className="sub">{running ? 'breathe…' : `${duration} min session`}</div>
          </div>
        </div>

        {!running ? (
          <>
            <div className="duration-picker">
              {DURATIONS.map((d) => (
                <button key={d} className={`duration-chip ${duration === d ? 'active' : ''}`} onClick={() => setDuration(d)}>
                  {d} min
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-block" onClick={start}>
              Begin Session
            </button>
          </>
        ) : (
          <button className="btn btn-danger btn-block" onClick={stopEarly}>
            End Session
          </button>
        )}
      </div>

      <div className="section-title">Soundscape</div>
      <div className="card">
        <div className="sound-grid">
          {SOUNDSCAPES.map((s) => (
            <div
              key={s.kind}
              className={`sound-tile ${soundscape === s.kind ? 'active' : ''}`}
              onClick={() => setSoundscape(s.kind)}
            >
              <span className="glyph">{s.glyph}</span>
              <span className="name">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">Practice log</div>
      <div className="card">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <span className="hint" style={{ margin: 0 }}>
            Total time meditated
          </span>
          <span className="pill">{totalMinutes} min</span>
        </div>
        {state.meditationSessions.length === 0 ? (
          <div className="hint">Your sessions will appear here once you finish one.</div>
        ) : (
          state.meditationSessions.slice(0, 8).map((s) => (
            <div className="row-between" key={s.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13 }}>{new Date(s.date).toLocaleDateString()}</span>
              <span className="hint" style={{ margin: 0, textTransform: 'capitalize' }}>
                {s.soundscape}
              </span>
              <span className="pill">{s.durationMinutes} min</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
