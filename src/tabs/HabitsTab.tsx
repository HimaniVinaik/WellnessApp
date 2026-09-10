import { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { hasCheckedInToday, currentStreak, skillProgress, SKILL_MASTERY_DAYS } from '../lib/points'
import { Goal, Habit, Skill, POINTS_PER_LEVEL } from '../types'
import Icon, { IconName } from '../components/Icon'

const HABIT_ICONS: IconName[] = [
  'droplet',
  'activity',
  'sun',
  'bookOpen',
  'bowl',
  'moon',
  'pencil',
  'ban',
  'sparkles',
  'target',
  'musicNote',
  'leaf',
  'heart',
  'dumbbell',
  'coffee',
  'clock',
  'flag',
  'shield',
  'waves',
  'wind',
  'mountain',
  'star',
  'camera',
  'sprout',
]

const SKILL_ICONS: IconName[] = [
  'keys',
  'brush',
  'code',
  'message',
  'chefHat',
  'ruler',
  'crown',
  'mic',
  'pencil',
  'camera',
  'sprout',
  'mountain',
  'globe',
  'target',
  'anchor',
  'flag',
  'shield',
  'network',
  'layoutGrid',
  'cards',
  'bookOpen',
  'star',
  'letters',
  'compass',
]

function AddHabitSheet({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (name: string, icon: string, pts: number, mandatory: boolean) => void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<IconName>(HABIT_ICONS[0])
  const [points, setPoints] = useState(10)
  const [mandatory, setMandatory] = useState(false)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>New Habit</h2>
        <div className="field">
          <label className="field-label">Habit name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Drink water" />
        </div>
        <div className="field">
          <label className="field-label">Icon</label>
          <div className="emoji-picker">
            {HABIT_ICONS.map((i) => (
              <button key={i} className={icon === i ? 'active' : ''} onClick={() => setIcon(i)} type="button">
                <Icon name={i} size={18} />
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
          <div className="hint">{POINTS_PER_LEVEL} points levels you up. Weight this habit however you like.</div>
        </div>
        <div className="field">
          <label className="toggle-row">
            <input type="checkbox" checked={mandatory} onChange={(e) => setMandatory(e.target.checked)} />
            <span>Mandatory</span>
          </label>
          <div className="hint">
            Mandatory habits must be checked in every single day, or leveling up pauses until you're caught up.
          </div>
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={!name.trim()}
          onClick={() => {
            if (!name.trim()) return
            onAdd(name.trim(), icon, points, mandatory)
            onClose()
          }}
        >
          Add habit
        </button>
      </div>
    </div>
  )
}

const GOAL_ICONS: IconName[] = [
  'flag',
  'target',
  'mountain',
  'compass',
  'star',
  'crown',
  'sprout',
  'globe',
  'anchor',
  'shield',
  'sparkles',
  'sun',
]

function AddGoalSheet({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (title: string, description: string, icon: string, pts: number, targetDate: string | null) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState<IconName>(GOAL_ICONS[0])
  const [points, setPoints] = useState(100)
  const [targetDate, setTargetDate] = useState('')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>New Goal</h2>
        <div className="field">
          <label className="field-label">Goal</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Run a 10k" />
        </div>
        <div className="field">
          <label className="field-label">Notes (optional)</label>
          <input
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why this matters, or how you'll get there"
          />
        </div>
        <div className="field">
          <label className="field-label">Icon</label>
          <div className="emoji-picker">
            {GOAL_ICONS.map((i) => (
              <button key={i} className={icon === i ? 'active' : ''} onClick={() => setIcon(i)} type="button">
                <Icon name={i} size={18} />
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="field-label">Target date (optional)</label>
          <input className="input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Points on completion: {points}</label>
          <input
            type="range"
            min={25}
            max={500}
            step={25}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div className="hint">A bigger reward for a bigger achievement — awarded once, when you mark it complete.</div>
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={!title.trim()}
          onClick={() => {
            if (!title.trim()) return
            onAdd(title.trim(), description.trim(), icon, points, targetDate || null)
            onClose()
          }}
        >
          Add goal
        </button>
      </div>
    </div>
  )
}

function AddSkillSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string, icon: string, pts: number) => void }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<IconName>(SKILL_ICONS[0])
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
            {SKILL_ICONS.map((i) => (
              <button key={i} className={icon === i ? 'active' : ''} onClick={() => setIcon(i)} type="button">
                <Icon name={i} size={18} />
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
            onAdd(name.trim(), icon, points)
            onClose()
          }}
        >
          Start skill
        </button>
      </div>
    </div>
  )
}

function WeekStrip({ checkIns }: { checkIns: Habit['checkIns'] }) {
  const days = useMemo(() => {
    const dates = new Set(checkIns.map((c) => c.date))
    const out: { label: string; filled: boolean }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      out.push({ label: 'SMTWTFS'[d.getDay()], filled: dates.has(key) })
    }
    return out
  }, [checkIns])

  return (
    <div className="week-strip">
      {days.map((d, i) => (
        <div key={i} className={`checkin-dot ${d.filled ? 'filled' : ''}`}>
          {d.label}
        </div>
      ))}
    </div>
  )
}

function HabitCard({ habit }: { habit: Habit }) {
  const { checkInHabit, archiveHabit, deleteHabit } = useAppData()
  const done = hasCheckedInToday(habit.checkIns)
  const streak = currentStreak(habit.checkIns)

  return (
    <div className="card habit-card">
      <div className="habit-top">
        <div className="habit-emoji">
          <Icon name={(habit.icon as IconName) || 'target'} size={22} />
        </div>
        <div className="habit-info">
          <h3>
            {habit.name}
            {habit.mandatory && <span className="skill-badge mandatory">Mandatory</span>}
          </h3>
          <div className="meta">
            {streak > 0 ? `${streak}-day streak` : 'Start today'} · {habit.pointsPerCheckIn} pts
          </div>
        </div>
        <button className={`check-btn ${done ? 'done' : ''}`} onClick={() => checkInHabit(habit.id)} disabled={done}>
          {done && <Icon name="check" size={18} strokeWidth={2.4} />}
        </button>
      </div>
      <WeekStrip checkIns={habit.checkIns} />
      {habit.mandatory && !done && (
        <div className="hint" style={{ marginTop: 8 }}>
          Check in today to keep leveling up on track.
        </div>
      )}
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="icon-btn" onClick={() => archiveHabit(habit.id)}>
          {habit.archived ? 'Unarchive' : 'Archive'}
        </button>
        <button className="icon-btn" onClick={() => deleteHabit(habit.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

function daysUntil(targetDate: string): number {
  const target = new Date(targetDate + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

function GoalCard({ goal }: { goal: Goal }) {
  const { completeGoal, archiveGoal, deleteGoal } = useAppData()
  const done = !!goal.completedAt

  let dateLabel: string | null = null
  if (goal.targetDate) {
    const days = daysUntil(goal.targetDate)
    dateLabel = days > 0 ? `${days} day${days === 1 ? '' : 's'} left` : days === 0 ? 'Due today' : `${-days} day${days === -1 ? '' : 's'} overdue`
  }

  return (
    <div className="card habit-card">
      <div className="habit-top">
        <div className="habit-emoji">
          <Icon name={(goal.icon as IconName) || 'flag'} size={22} />
        </div>
        <div className="habit-info">
          <h3>{goal.title}</h3>
          <div className="meta">
            {goal.pointsReward} pts{dateLabel ? ` · ${dateLabel}` : ''}
          </div>
        </div>
        {done ? (
          <span className="skill-badge mastered">Done</span>
        ) : (
          <button className="check-btn" onClick={() => completeGoal(goal.id)}>
            <Icon name="check" size={18} strokeWidth={2.4} />
          </button>
        )}
      </div>
      {goal.description && <div className="hint" style={{ marginTop: 8 }}>{goal.description}</div>}
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="icon-btn" onClick={() => archiveGoal(goal.id)}>
          {goal.archived ? 'Unarchive' : 'Archive'}
        </button>
        <button className="icon-btn" onClick={() => deleteGoal(goal.id)}>
          Delete
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
        <div className="habit-emoji">
          <Icon name={(skill.icon as IconName) || 'target'} size={22} />
        </div>
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
            {done && <Icon name="check" size={18} strokeWidth={2.4} />}
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

export default function HabitsTab() {
  const { state, addHabit, addSkill, addGoal, addTodo, toggleTodo, deleteTodo } = useAppData()
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [todoText, setTodoText] = useState('')

  const activeHabits = state.habits.filter((h) => !h.archived)
  const pendingTodos = state.todos.filter((t) => !t.done)
  const doneTodos = state.todos.filter((t) => t.done)

  const activeGoals = state.goals.filter((g) => !g.archived)
  const openGoals = activeGoals.filter((g) => !g.completedAt)
  const completedGoals = activeGoals.filter((g) => g.completedAt)

  const activeSkills = state.skills.filter((s) => !s.archived)
  const masteredSkills = activeSkills.filter((s) => skillProgress(s).mastered)
  const inProgressSkills = activeSkills.filter((s) => !skillProgress(s).mastered)

  return (
    <div>
      <div className="section-title">Today's Habits</div>
      {activeHabits.length === 0 ? (
        <div className="card empty-state">
          <div className="glyph">
            <Icon name="leaf" size={34} strokeWidth={1.4} />
          </div>
          <div>No habits yet. Small steps, repeated daily, build a calm mind.</div>
        </div>
      ) : (
        activeHabits.map((h) => <HabitCard key={h.id} habit={h} />)
      )}
      <button className="btn btn-secondary btn-block" onClick={() => setShowAddHabit(true)}>
        + Add Habit
      </button>

      <div className="section-title">Goals</div>
      {openGoals.length === 0 ? (
        <div className="card empty-state">
          <div className="glyph">
            <Icon name="flag" size={34} strokeWidth={1.4} />
          </div>
          <div>Set a bigger goal to work toward — a race, a project, a milestone.</div>
        </div>
      ) : (
        openGoals.map((g) => <GoalCard key={g.id} goal={g} />)
      )}
      <button className="btn btn-secondary btn-block" onClick={() => setShowAddGoal(true)}>
        + Add Goal
      </button>
      {completedGoals.length > 0 && (
        <>
          <div className="section-title">Completed Goals</div>
          {completedGoals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </>
      )}

      <div className="section-title">To-dos</div>
      <div className="card">
        <div className="row" style={{ marginBottom: pendingTodos.length || doneTodos.length ? 14 : 0 }}>
          <input
            className="input"
            placeholder="Add a to-do…"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && todoText.trim()) {
                addTodo(todoText.trim())
                setTodoText('')
              }
            }}
          />
          <button
            className="btn btn-primary"
            disabled={!todoText.trim()}
            onClick={() => {
              if (!todoText.trim()) return
              addTodo(todoText.trim())
              setTodoText('')
            }}
          >
            Add
          </button>
        </div>
        {pendingTodos.map((t) => (
          <div className="todo-item" key={t.id}>
            <div className="todo-check" onClick={() => toggleTodo(t.id)}>
              <Icon name="check" size={13} strokeWidth={2.6} />
            </div>
            <div className="todo-text">{t.text}</div>
            <button className="icon-btn" onClick={() => deleteTodo(t.id)}>
              ✕
            </button>
          </div>
        ))}
        {doneTodos.map((t) => (
          <div className="todo-item" key={t.id}>
            <div className="todo-check done" onClick={() => toggleTodo(t.id)}>
              <Icon name="check" size={13} strokeWidth={2.6} />
            </div>
            <div className="todo-text done">{t.text}</div>
            <button className="icon-btn" onClick={() => deleteTodo(t.id)}>
              ✕
            </button>
          </div>
        ))}
        {pendingTodos.length === 0 && doneTodos.length === 0 && (
          <div className="hint">Nothing on your list. Add your first task above.</div>
        )}
      </div>

      <div className="section-title">Skills to Master</div>
      {inProgressSkills.length === 0 ? (
        <div className="card empty-state">
          <div className="glyph">
            <Icon name="sprout" size={34} strokeWidth={1.4} />
          </div>
          <div>Pick a skill you want to master and check in daily for 20 days straight.</div>
        </div>
      ) : (
        inProgressSkills.map((s) => <SkillCard key={s.id} skill={s} />)
      )}
      <button className="btn btn-secondary btn-block" onClick={() => setShowAddSkill(true)}>
        + Add Skill
      </button>

      {masteredSkills.length > 0 && (
        <>
          <div className="section-title">Mastered</div>
          {masteredSkills.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </>
      )}

      {showAddHabit && <AddHabitSheet onClose={() => setShowAddHabit(false)} onAdd={addHabit} />}
      {showAddGoal && <AddGoalSheet onClose={() => setShowAddGoal(false)} onAdd={addGoal} />}
      {showAddSkill && <AddSkillSheet onClose={() => setShowAddSkill(false)} onAdd={addSkill} />}
    </div>
  )
}
