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

export type GameKind = 'nback' | 'memory' | 'math'

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
  levels: LevelDef[]
  readingList: ReadingItem[]
  meditationSessions: MeditationSession[]
  gameScores: GameScore[]
}

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

export const POINTS_PER_LEVEL = 1000

export function emptyState(): AppState {
  return {
    habits: [],
    skills: [],
    todos: [],
    levels: DEFAULT_LEVELS,
    readingList: [],
    meditationSessions: [],
    gameScores: [],
  }
}
