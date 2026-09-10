import { ActivityLog, AppState, Habit, MealLog, MeditationSession, Skill, SleepLog } from '../types'
import { IconName } from '../components/Icon'

// A simple, transparent heuristic — not a medical or clinical assessment.
// Each category scores 0-100 based on 7-day consistency (or, for sleep,
// average logged quality), and the overall score is the plain average of
// whichever categories the user has actually started using. A category
// with no data at all is left out rather than dragging the score to zero,
// so a brand-new profile doesn't read as "failing" at things it hasn't
// tried yet.

function last7Dates(): string[] {
  const out: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }
  return out
}

function checkInConsistency(items: { checkIns: { date: string }[]; archived: boolean }[]): number | null {
  const active = items.filter((i) => !i.archived)
  if (active.length === 0) return null
  const days = last7Dates()
  let total = 0
  for (const item of active) {
    const dates = new Set(item.checkIns.map((c) => c.date))
    total += days.filter((d) => dates.has(d)).length / 7
  }
  return Math.round((total / active.length) * 100)
}

function dayCoverage(dates: string[]): number | null {
  if (dates.length === 0) return null
  const days = last7Dates()
  const set = new Set(dates)
  return Math.round((days.filter((d) => set.has(d)).length / 7) * 100)
}

function averageOf(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length)
}

export interface CategoryScore {
  key: string
  label: string
  value: number | null
  icon: IconName
}

export interface WellnessScore {
  overall: number | null
  categories: CategoryScore[]
}

export function computeWellnessScore(state: AppState): WellnessScore {
  const days = last7Dates()

  const sleepRecent = state.sleepLogs.filter((l) => days.includes(l.date)).map((l) => l.quality)

  const categories: CategoryScore[] = [
    { key: 'habits', label: 'Habits', value: checkInConsistency(state.habits as Habit[]), icon: 'checkSquare' },
    { key: 'skills', label: 'Skills', value: checkInConsistency(state.skills as Skill[]), icon: 'target' },
    {
      key: 'activity',
      label: 'Activity',
      value: dayCoverage((state.activityLogs as ActivityLog[]).map((l) => l.date)),
      icon: 'dumbbell',
    },
    { key: 'sleep', label: 'Sleep', value: averageOf(sleepRecent), icon: 'bed' },
    {
      key: 'nutrition',
      label: 'Nutrition',
      value: dayCoverage((state.mealLogs as MealLog[]).map((l) => l.date)),
      icon: 'utensils',
    },
    {
      key: 'meditation',
      label: 'Meditation',
      value: dayCoverage((state.meditationSessions as MeditationSession[]).map((s) => s.date.slice(0, 10))),
      icon: 'sun',
    },
  ]

  const withData = categories.filter((c): c is CategoryScore & { value: number } => c.value !== null)
  const overall = withData.length > 0 ? Math.round(withData.reduce((s, c) => s + c.value, 0) / withData.length) : null

  return { overall, categories }
}

export function scoreLabel(score: number | null): string {
  if (score === null) return 'Log a few days of activity to see your score'
  if (score >= 85) return 'Thriving'
  if (score >= 70) return 'Doing well'
  if (score >= 50) return 'Steady'
  if (score >= 30) return 'Room to grow'
  return 'Just getting started'
}
