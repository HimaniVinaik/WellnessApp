import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { hasCheckedInToday, skillProgress, SKILL_MASTERY_DAYS } from '../lib/points'
import { Skill } from '../types'

const EMOJIS = ['🎹', '🖌️', '💻', '🗣️', '🍳', '📐', '♟️', '🎤', '🧵', '📷', '🪴', '🧗']

function AddSkillSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string, emoji: string, pts: number) => void }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const [points, setPoints] = useState(15)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>New Skill to Master</h2>
        <div className="field">
          <label className="field-label">Skill name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Learn Spanish" />
        </div>
        <div className="field">
          <label className="field-label">Icon</label>
          <div className="emoji-picker">
            {EMOJIS.map((e) => (
              <button key={e} className={emoji === e ? 'active' : ''} onClick={() => setEmoji(e)} type="button">
                {e}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="field-label">Points per check-in: {points}</label>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div className="hint" style={{ marginBottom: 14 }}>
          Check in daily for {SKILL_MASTERY_DAYS} consecutive days to master this skill.
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={!name.trim()}
          onClick={() => {
            if (!name.trim()) return
            onAdd(name.trim(), emoji, points)
            onClose()
          }}
        >
          Start skill
        </button>
      </div>
    </div>
  )
}

function SkillCard({ skill }: { skill: Skill }) {
  const { checkInSkill, archiveSkill, deleteSkill } = useAppData()
  const done = hasCheckedInToday(skill.checkIns)
  const { streak, percent, mastered } = skillProgress(skill)

  return (
    <div className="card skill-card">
      <div className="habit-top">
        <div className="habit-emoji">{skill.emoji}</div>
        <div className="habit-info">
          <h3>{skill.name}</h3>
          <div className="meta">
            {streak}/{SKILL_MASTERY_DAYS} days · {skill.pointsPerCheckIn} pts/day
          </div>
        </div>
        {mastered ? (
          <span className="skill-badge mastered">Mastered</span>
        ) : (
          <button className={`check-btn ${done ? 'done' : ''}`} onClick={() => checkInSkill(skill.id)} disabled={done}>
            {done ? '✓' : ''}
          </button>
        )}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="icon-btn" onClick={() => archiveSkill(skill.id)}>
          {skill.archived ? 'Unarchive' : 'Archive'}
        </button>
        <button className="icon-btn" onClick={() => deleteSkill(skill.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default function SkillsTab() {
  const { state, addSkill } = useAppData()
  const [showAdd, setShowAdd] = useState(false)
  const activeSkills = state.skills.filter((s) => !s.archived)
  const mastered = activeSkills.filter((s) => skillProgress(s).mastered)
  const inProgress = activeSkills.filter((s) => !skillProgress(s).mastered)

  return (
    <div>
      <div className="section-title">In Progress</div>
      {inProgress.length === 0 ? (
        <div className="card empty-state">
          <div className="glyph">🌱</div>
          <div>Pick a skill you want to master and check in daily for 20 days straight.</div>
        </div>
      ) : (
        inProgress.map((s) => <SkillCard key={s.id} skill={s} />)
      )}
      <button className="btn btn-secondary btn-block" onClick={() => setShowAdd(true)}>
        + Add Skill
      </button>

      {mastered.length > 0 && (
        <>
          <div className="section-title">Mastered</div>
          {mastered.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </>
      )}

      {showAdd && <AddSkillSheet onClose={() => setShowAdd(false)} onAdd={addSkill} />}
    </div>
  )
}
