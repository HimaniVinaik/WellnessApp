import { CheckIn, Habit, LevelDef, Skill, POINTS_PER_LEVEL } from '../types'

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function hasCheckedInToday(checkIns: CheckIn[]): boolean {
  const today = todayKey()
  return checkIns.some((c) => c.date === today)
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((db.getTime() - da.getTime()) / 86400000)
}

/** Current streak of consecutive-day check-ins, counting back from the most
 * recent check-in. Returns 0 if the most recent check-in is older than
 * yesterday (streak considered broken). */
export function currentStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0
  const dates = Array.from(new Set(checkIns.map((c) => c.date))).sort()
  const latest = dates[dates.length - 1]
  const gapFromToday = daysBetween(latest, todayKey())
  if (gapFromToday > 1) return 0

  let streak = 1
  for (let i = dates.length - 1; i > 0; i--) {
    const diff = daysBetween(dates[i - 1], dates[i])
    if (diff === 1) streak++
    else if (diff === 0) continue
    else break
  }
  return streak
}

export function longestStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0
  const dates = Array.from(new Set(checkIns.map((c) => c.date))).sort()
  let best = 1
  let run = 1
  for (let i = 1; i < dates.length; i++) {
    const diff = daysBetween(dates[i - 1], dates[i])
    if (diff === 1) run++
    else if (diff === 0) continue
    else run = 1
    if (run > best) best = run
  }
  return best
}

export const SKILL_MASTERY_DAYS = 20

export function skillProgress(skill: Skill): { streak: number; percent: number; mastered: boolean } {
  const streak = currentStreak(skill.checkIns)
  const percent = Math.min(100, Math.round((streak / SKILL_MASTERY_DAYS) * 100))
  return { streak, percent, mastered: !!skill.masteredAt || streak >= SKILL_MASTERY_DAYS }
}

export function totalPointsFor(checkIns: CheckIn[]): number {
  return checkIns.reduce((sum, c) => sum + c.points, 0)
}

interface PointBearing {
  points: number
}

export function totalPoints(state: {
  habits: Habit[]
  skills: Skill[]
  activityLogs: PointBearing[]
  sleepLogs: PointBearing[]
  mealLogs: PointBearing[]
}): number {
  const h = state.habits.reduce((sum, habit) => sum + totalPointsFor(habit.checkIns), 0)
  const s = state.skills.reduce((sum, skill) => sum + totalPointsFor(skill.checkIns), 0)
  const a = state.activityLogs.reduce((sum, l) => sum + l.points, 0)
  const sl = state.sleepLogs.reduce((sum, l) => sum + l.points, 0)
  const m = state.mealLogs.reduce((sum, l) => sum + l.points, 0)
  return h + s + a + sl + m
}

export function levelForPoints(points: number): number {
  return Math.floor(points / POINTS_PER_LEVEL) + 1
}

/** Mandatory habits must be checked in every day to permit leveling up.
 * True (on track) when there are no active mandatory habits, or every
 * active mandatory habit has already been checked in today. */
export function mandatoryHabitsOnTrack(habits: Habit[]): boolean {
  const mandatory = habits.filter((h) => h.mandatory && !h.archived)
  if (mandatory.length === 0) return true
  return mandatory.every((h) => hasCheckedInToday(h.checkIns))
}

export function levelInfo(points: number, levels: LevelDef[], unlockedLevel: number) {
  const rawLevel = levelForPoints(points)
  const level = Math.min(rawLevel, unlockedLevel)
  const name = levels.find((l) => l.level === level)?.name ?? `Level ${level}`
  const pointsIntoLevel = points % POINTS_PER_LEVEL
  const pointsToNext = POINTS_PER_LEVEL - pointsIntoLevel
  const percent = level < rawLevel ? 100 : (pointsIntoLevel / POINTS_PER_LEVEL) * 100
  return { level, name, pointsIntoLevel, pointsToNext, percent, readyToLevelUp: rawLevel > unlockedLevel }
}
