export interface CheckIn {
  date: string // YYYY-MM-DD
  points: number
}

export interface Habit {
  id: string
  name: string
  icon: string
  pointsPerCheckIn: number
  createdAt: string
  checkIns: CheckIn[]
  archived: boolean
  mandatory: boolean
}

export interface Skill {
  id: string
  name: string
  icon: string
  pointsPerCheckIn: number
  createdAt: string
  checkIns: CheckIn[]
  masteredAt: string | null
  archived: boolean
}

export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: string
  completedAt: string | null
}

export interface Goal {
  id: string
  title: string
  description: string
  icon: string
  targetDate: string | null // YYYY-MM-DD
  createdAt: string
  completedAt: string | null
  archived: boolean
  pointsReward: number
}

export interface LevelDef {
  level: number
  name: string
}

export interface ReadingItem {
  id: string
  title: string
  url: string
  source: string
  summary: string
  publishedAt: string | null
  savedAt: string
  read: boolean
  saved: boolean
}

export interface MeditationSession {
  id: string
  date: string
  durationMinutes: number
  soundscape: string
}

export interface VocabWord {
  id: string
  word: string
  partOfSpeech: string
  phonetic: string
  definition: string
  example: string | null
  audioUrl: string | null
  source: string
  addedAt: string
  learned: boolean
}

export interface ActivityType {
  id: string
  name: string
  icon: string
  pointsPerCompletion: number
  createdAt: string
  archived: boolean
}

export interface ActivityLog {
  id: string
  activityTypeId: string
  date: string
  durationMinutes: number
  calories: number
  distanceKm: number | null
  notes: string
  points: number
  loggedAt: string
}

export interface SleepLog {
  id: string
  date: string
  quality: number
  hours: number | null
  points: number
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealLog {
  id: string
  date: string
  mealType: MealType
  description: string
  quality: number
  calories: number | null
  points: number
}

export interface SpanishCard {
  id: string
  spanish: string
  english: string
  pronunciation: string
  category: string
  addedAt: string
  learned: boolean
}

export interface Story {
  id: string
  title: string
  author: string
  source: string
  url: string
  text: string
  addedAt: string
  read: boolean
  saved: boolean
}

export interface CodingSolved {
  id: string
  problemId: string
  difficulty: 'easy' | 'medium' | 'hard'
  language: string
  solvedAt: string
  points: number
}

export type GameKind = 'nback' | 'memory' | 'math' | 'splitfocus' | 'vocab' | 'chess' | 'spanish' | 'coding'

export interface GameScore {
  id: string
  game: GameKind
  date: string
  score: number
  detail: string
}

export interface GithubSyncConfig {
  owner: string
  repo: string
  branch: string
  path: string
  token: string
}

export interface AppState {
  habits: Habit[]
  skills: Skill[]
  todos: Todo[]
  goals: Goal[]
  levels: LevelDef[]
  readingList: ReadingItem[]
  stories: Story[]
  meditationSessions: MeditationSession[]
  gameScores: GameScore[]
  vocabWords: VocabWord[]
  activityTypes: ActivityType[]
  activityLogs: ActivityLog[]
  sleepLogs: SleepLog[]
  mealLogs: MealLog[]
  spanishCards: SpanishCard[]
  codingSolved: CodingSolved[]
  unlockedLevel: number
}

export const SLEEP_BONUS_THRESHOLD = 90
export const SLEEP_BONUS_POINTS = 25
export const MEAL_LOG_POINTS = 5

export const DEFAULT_ACTIVITY_TYPES: ActivityType[] = [
  { id: 'act_run', name: 'Running', icon: 'activity', pointsPerCompletion: 20, createdAt: new Date(0).toISOString(), archived: false },
  { id: 'act_tennis', name: 'Tennis', icon: 'target', pointsPerCompletion: 20, createdAt: new Date(0).toISOString(), archived: false },
  { id: 'act_lifting', name: 'Lifting', icon: 'dumbbell', pointsPerCompletion: 20, createdAt: new Date(0).toISOString(), archived: false },
  { id: 'act_biking', name: 'Biking', icon: 'bike', pointsPerCompletion: 20, createdAt: new Date(0).toISOString(), archived: false },
]

export const DEFAULT_LEVELS: LevelDef[] = [
  { level: 1, name: 'Seedling' },
  { level: 2, name: 'Sprout' },
  { level: 3, name: 'Sapling' },
  { level: 4, name: 'Steady Mind' },
  { level: 5, name: 'Clear Thinker' },
  { level: 6, name: 'Calm Mountain' },
  { level: 7, name: 'Deep Root' },
  { level: 8, name: 'Quiet Master' },
  { level: 9, name: 'Still Water' },
  { level: 10, name: 'Enlightened' },
]

export const POINTS_PER_LEVEL = 2000

export function emptyState(): AppState {
  return {
    habits: [],
    skills: [],
    todos: [],
    goals: [],
    levels: DEFAULT_LEVELS,
    readingList: [],
    stories: [],
    meditationSessions: [],
    gameScores: [],
    vocabWords: [],
    activityTypes: DEFAULT_ACTIVITY_TYPES,
    activityLogs: [],
    sleepLogs: [],
    mealLogs: [],
    spanishCards: [],
    codingSolved: [],
    unlockedLevel: 1,
  }
}
