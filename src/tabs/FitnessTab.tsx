import { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { todayKey } from '../lib/points'
import { computeWellnessScore, scoreLabel } from '../lib/wellnessScore'
import { ActivityType, MealType, SLEEP_BONUS_THRESHOLD } from '../types'
import Icon, { IconName } from '../components/Icon'

type SubTab = 'activities' | 'sleep' | 'nutrition' | 'analytics'

const ACTIVITY_ICONS: IconName[] = ['activity', 'dumbbell', 'bike', 'target', 'waves', 'mountain', 'sun', 'flag', 'anchor', 'star']

function AddActivityTypeSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string, icon: string, pts: number) => void }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<IconName>(ACTIVITY_ICONS[0])
  const [points, setPoints] = useState(20)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>New Activity</h2>
        <div className="field">
          <label className="field-label">Activity name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Swimming" />
        </div>
        <div className="field">
          <label className="field-label">Icon</label>
          <div className="emoji-picker">
            {ACTIVITY_ICONS.map((i) => (
              <button key={i} className={icon === i ? 'active' : ''} onClick={() => setIcon(i)} type="button">
                <Icon name={i} size={18} />
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="field-label">Points per session: {points}</label>
          <input type="range" min={5} max={100} step={5} value={points} onChange={(e) => setPoints(Number(e.target.value))} style={{ width: '100%' }} />
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
          Add activity
        </button>
      </div>
    </div>
  )
}

function LogActivitySheet({ type, onClose }: { type: ActivityType; onClose: () => void }) {
  const { logActivity } = useAppData()
  const [duration, setDuration] = useState(30)
  const [calories, setCalories] = useState(200)
  const [distance, setDistance] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>Log {type.name}</h2>
        <div className="field">
          <label className="field-label">Duration: {duration} min</label>
          <input type="range" min={5} max={180} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div className="field">
          <label className="field-label">Calories burned: {calories}</label>
          <input type="range" min={0} max={1000} step={10} value={calories} onChange={(e) => setCalories(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div className="field">
          <label className="field-label">Distance (km, optional)</label>
          <input className="input" type="number" inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="5.0" />
        </div>
        <div className="field">
          <label className="field-label">Notes (optional)</label>
          <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Felt great!" />
        </div>
        <button
          className="btn btn-primary btn-block"
          onClick={() => {
            logActivity(type.id, duration, calories, distance ? Number(distance) : null, notes.trim())
            onClose()
          }}
        >
          Log {type.pointsPerCompletion} pts
        </button>
      </div>
    </div>
  )
}

function ActivitiesSection() {
  const { state, addActivityType, archiveActivityType, deleteActivityLog } = useAppData()
  const [showAddType, setShowAddType] = useState(false)
  const [loggingType, setLoggingType] = useState<ActivityType | null>(null)

  const activeTypes = state.activityTypes.filter((a) => !a.archived)
  const archivedTypes = state.activityTypes.filter((a) => a.archived)
  const recentLogs = state.activityLogs.slice(0, 10)
  const typeById = (id: string) => state.activityTypes.find((a) => a.id === id)

  return (
    <div>
      <div className="section-title">Log an Activity</div>
      {activeTypes.map((t) => (
        <div className="card" key={t.id}>
          <div className="habit-top">
            <div className="habit-emoji">
              <Icon name={(t.icon as IconName) || 'activity'} size={22} />
            </div>
            <div className="habit-info">
              <h3>{t.name}</h3>
              <div className="meta">{t.pointsPerCompletion} pts / session</div>
            </div>
            <button className="btn btn-secondary" onClick={() => setLoggingType(t)}>
              Log
            </button>
          </div>
          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="icon-btn" onClick={() => archiveActivityType(t.id)}>
              Archive
            </button>
          </div>
        </div>
      ))}
      <button className="btn btn-secondary btn-block" onClick={() => setShowAddType(true)}>
        + Add Activity
      </button>

      {archivedTypes.length > 0 && (
        <>
          <div className="section-title">Archived</div>
          {archivedTypes.map((t) => (
            <div className="row-between card" key={t.id} style={{ padding: 12 }}>
              <span className="hint" style={{ margin: 0 }}>
                {t.name}
              </span>
              <button className="icon-btn" onClick={() => archiveActivityType(t.id)}>
                Unarchive
              </button>
            </div>
          ))}
        </>
      )}

      <div className="section-title">Recent Activity</div>
      <div className="card">
        {recentLogs.length === 0 ? (
          <div className="hint">Log your first session above to start tracking.</div>
        ) : (
          recentLogs.map((log) => {
            const type = typeById(log.activityTypeId)
            return (
              <div className="row-between" key={log.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{type?.name ?? 'Activity'}</div>
                  <div className="hint" style={{ margin: 0 }}>
                    {log.durationMinutes} min · {log.calories} cal{log.distanceKm ? ` · ${log.distanceKm} km` : ''} · {log.date}
                  </div>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  <span className="pill">{log.points} pts</span>
                  <button className="icon-btn" onClick={() => deleteActivityLog(log.id)}>
                    ✕
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {showAddType && <AddActivityTypeSheet onClose={() => setShowAddType(false)} onAdd={addActivityType} />}
      {loggingType && <LogActivitySheet type={loggingType} onClose={() => setLoggingType(null)} />}
    </div>
  )
}

function qualityTag(quality: number): string {
  if (quality >= SLEEP_BONUS_THRESHOLD) return 'Excellent'
  if (quality >= 75) return 'Good'
  if (quality >= 50) return 'Fair'
  return 'Poor'
}

function SleepSection() {
  const { state, logSleep, deleteSleepLog } = useAppData()
  const [quality, setQuality] = useState(80)
  const [hours, setHours] = useState('')
  const loggedToday = state.sleepLogs.some((l) => l.date === todayKey())
  const recent = state.sleepLogs.slice(0, 10)

  return (
    <div>
      <div className="section-title">Last Night's Sleep</div>
      <div className="card">
        <div className="field">
          <label className="field-label">
            Sleep quality: {quality} · {qualityTag(quality)}
          </label>
          <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div className="field">
          <label className="field-label">Hours slept (optional)</label>
          <input className="input" type="number" inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="7.5" />
        </div>
        <div className="hint" style={{ marginBottom: 14 }}>
          A score of {SLEEP_BONUS_THRESHOLD}+ earns bonus points, same scale as your Apple Watch sleep quality.
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={loggedToday}
          onClick={() => {
            logSleep(quality, hours ? Number(hours) : null)
            setHours('')
          }}
        >
          {loggedToday ? "Logged for today ✓" : 'Log Sleep'}
        </button>
      </div>

      <div className="section-title">Recent Sleep</div>
      <div className="card">
        {recent.length === 0 ? (
          <div className="hint">Log tonight's sleep to start tracking.</div>
        ) : (
          recent.map((log) => (
            <div className="row-between" key={log.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {log.quality} · {qualityTag(log.quality)}
                </div>
                <div className="hint" style={{ margin: 0 }}>
                  {log.date}
                  {log.hours ? ` · ${log.hours}h` : ''}
                </div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                {log.points > 0 && <span className="pill">{log.points} pts</span>}
                <button className="icon-btn" onClick={() => deleteSleepLog(log.id)}>
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="row" style={{ gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} className="icon-btn" style={{ padding: 2, color: n <= value ? '#e0a83c' : 'var(--border)' }} onClick={() => onChange(n)}>
          <Icon name="star" size={22} />
        </button>
      ))}
    </div>
  )
}

function NutritionSection() {
  const { state, logMeal, deleteMealLog } = useAppData()
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [description, setDescription] = useState('')
  const [quality, setQuality] = useState(3)
  const [calories, setCalories] = useState('')
  const recent = state.mealLogs.slice(0, 10)

  return (
    <div>
      <div className="section-title">Log a Meal</div>
      <div className="card">
        <div className="row" style={{ marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          {MEAL_TYPES.map((m) => (
            <button key={m} className={`duration-chip ${mealType === m ? 'active' : ''}`} onClick={() => setMealType(m)} style={{ textTransform: 'capitalize' }}>
              {m}
            </button>
          ))}
        </div>
        <div className="field">
          <label className="field-label">What did you eat?</label>
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Grilled chicken salad" />
        </div>
        <div className="field">
          <label className="field-label">How healthy did it feel?</label>
          <StarPicker value={quality} onChange={setQuality} />
        </div>
        <div className="field">
          <label className="field-label">Calories (optional)</label>
          <input className="input" type="number" inputMode="numeric" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="450" />
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={!description.trim()}
          onClick={() => {
            logMeal(mealType, description.trim(), quality, calories ? Number(calories) : null)
            setDescription('')
            setCalories('')
            setQuality(3)
          }}
        >
          Log Meal
        </button>
      </div>

      <div className="section-title">Recent Meals</div>
      <div className="card">
        {recent.length === 0 ? (
          <div className="hint">Log a meal above to start tracking your eating habits.</div>
        ) : (
          recent.map((log) => (
            <div className="row-between" key={log.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>
                  {log.mealType} · {log.description}
                </div>
                <div className="hint" style={{ margin: 0 }}>
                  {'★'.repeat(log.quality)}
                  {'☆'.repeat(5 - log.quality)} {log.calories ? `· ${log.calories} cal` : ''} · {log.date}
                </div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <span className="pill">{log.points} pts</span>
                <button className="icon-btn" onClick={() => deleteMealLog(log.id)}>
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function AnalyticsSection() {
  const { state } = useAppData()
  const { overall, categories } = useMemo(() => computeWellnessScore(state), [state])
  const circumference = 2 * Math.PI * 46
  const pct = overall ?? 0

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="timer-ring-wrap" style={{ maxWidth: 180 }}>
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
            />
          </svg>
          <div className="center">
            <div className="time">{overall ?? '—'}</div>
            <div className="sub">wellness score</div>
          </div>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          {scoreLabel(overall)}
        </p>
      </div>

      <div className="section-title">By Category</div>
      <div className="card">
        {categories.map((c) => (
          <div key={c.key} style={{ marginBottom: 14 }}>
            <div className="row-between" style={{ marginBottom: 6 }}>
              <div className="row" style={{ gap: 8 }}>
                <Icon name={c.icon} size={16} strokeWidth={1.8} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</span>
              </div>
              <span className="hint" style={{ margin: 0 }}>
                {c.value === null ? 'No data' : `${c.value}%`}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${c.value ?? 0}%` }} />
            </div>
          </div>
        ))}
        <div className="hint" style={{ marginTop: 4 }}>
          A simple 7-day consistency heuristic — not a medical assessment. Categories you haven't used yet are left
          out of your overall score.
        </div>
      </div>
    </div>
  )
}

export default function FitnessTab() {
  const [sub, setSub] = useState<SubTab>('activities')

  return (
    <div>
      <div className="tabs-inline">
        {(['activities', 'sleep', 'nutrition', 'analytics'] as SubTab[]).map((s) => (
          <button key={s} className={sub === s ? 'active' : ''} onClick={() => setSub(s)} style={{ textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>
      {sub === 'activities' && <ActivitiesSection />}
      {sub === 'sleep' && <SleepSection />}
      {sub === 'nutrition' && <NutritionSection />}
      {sub === 'analytics' && <AnalyticsSection />}
    </div>
  )
}
