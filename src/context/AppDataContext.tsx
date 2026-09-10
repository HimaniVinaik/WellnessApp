import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityType,
  AppState,
  CodingSolved,
  GameKind,
  GithubSyncConfig,
  Goal,
  Habit,
  LevelDef,
  MealType,
  MeditationSession,
  ReadingItem,
  Skill,
  SpanishCard,
  Story,
  Todo,
  VocabWord,
  emptyState,
  SLEEP_BONUS_POINTS,
  SLEEP_BONUS_THRESHOLD,
  MEAL_LOG_POINTS,
} from '../types'
import { makeId } from '../lib/id'
import { hasCheckedInToday, todayKey, totalPoints, levelInfo, levelForPoints, mandatoryHabitsOnTrack } from '../lib/points'
import { Profile, loadProfileSyncConfig, saveEncryptedBlob, saveProfileSyncConfig } from '../lib/profiles'
import { csvToState, stateToCsv } from '../lib/csv'
import { decryptText, encryptText } from '../lib/crypto'
import { fetchFile, putFile } from '../lib/github'

interface Ctx {
  state: AppState
  points: number
  level: ReturnType<typeof levelInfo>
  profile: Profile
  signOut: () => void

  addHabit: (name: string, icon: string, pointsPerCheckIn: number, mandatory: boolean) => void
  checkInHabit: (id: string) => void
  archiveHabit: (id: string) => void
  deleteHabit: (id: string) => void

  addSkill: (name: string, icon: string, pointsPerCheckIn: number) => void
  checkInSkill: (id: string) => void
  archiveSkill: (id: string) => void
  deleteSkill: (id: string) => void

  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void

  addGoal: (title: string, description: string, icon: string, pointsReward: number, targetDate: string | null) => void
  completeGoal: (id: string) => void
  archiveGoal: (id: string) => void
  deleteGoal: (id: string) => void

  setLevels: (levels: LevelDef[]) => void

  addReadingItems: (items: Omit<ReadingItem, 'id' | 'savedAt' | 'read' | 'saved'>[]) => void
  toggleReadingRead: (id: string) => void
  toggleReadingSaved: (id: string) => void
  removeReadingItem: (id: string) => void

  addStories: (items: Omit<Story, 'id' | 'addedAt' | 'read' | 'saved'>[]) => void
  toggleStoryRead: (id: string) => void
  toggleStorySaved: (id: string) => void
  removeStory: (id: string) => void

  logMeditationSession: (durationMinutes: number, soundscape: string) => void
  logGameScore: (game: GameKind, score: number, detail: string) => void

  addVocabWords: (items: Omit<VocabWord, 'id' | 'addedAt'>[]) => void
  markVocabWord: (id: string, learned: boolean) => void
  removeVocabWord: (id: string) => void

  addActivityType: (name: string, icon: string, pointsPerCompletion: number) => void
  archiveActivityType: (id: string) => void
  logActivity: (activityTypeId: string, durationMinutes: number, calories: number, distanceKm: number | null, notes: string) => void
  deleteActivityLog: (id: string) => void

  logSleep: (quality: number, hours: number | null) => void
  deleteSleepLog: (id: string) => void

  logMeal: (mealType: MealType, description: string, quality: number, calories: number | null) => void
  deleteMealLog: (id: string) => void

  addSpanishCards: (items: Omit<SpanishCard, 'id' | 'addedAt'>[]) => void
  markSpanishCard: (id: string, learned: boolean) => void
  removeSpanishCard: (id: string) => void

  logCodingSolved: (problemId: string, difficulty: 'easy' | 'medium' | 'hard', language: string, points: number) => void

  syncConfig: GithubSyncConfig | null
  setSyncConfig: (cfg: GithubSyncConfig | null) => void
  pushToGithub: () => Promise<string>
  pullFromGithub: () => Promise<string>

  resetAllData: () => void
}

const AppDataContext = createContext<Ctx | null>(null)

export function AppDataProvider({
  profile,
  passphrase,
  initialState,
  onSignOut,
  children,
}: {
  profile: Profile
  passphrase: string
  initialState: AppState
  onSignOut: () => void
  children: React.ReactNode
}) {
  const [state, setState] = useState<AppState>(initialState)
  const [syncConfig, setSyncConfigState] = useState<GithubSyncConfig | null>(() => loadProfileSyncConfig(profile.id))
  const passphraseRef = useRef(passphrase)
  passphraseRef.current = passphrase
  const isFirstSave = useRef(true)

  useEffect(() => {
    // Skip the redundant re-encrypt on mount — initialState was already
    // decrypted from (or just written as) this exact blob by ProfileGate.
    if (isFirstSave.current) {
      isFirstSave.current = false
      return
    }
    encryptText(JSON.stringify(state), passphraseRef.current).then((ciphertext) => {
      saveEncryptedBlob(profile.id, ciphertext)
    })
  }, [state, profile.id])

  const setSyncConfig = useCallback(
    (cfg: GithubSyncConfig | null) => {
      setSyncConfigState(cfg)
      if (cfg) saveProfileSyncConfig(profile.id, cfg)
    },
    [profile.id]
  )

  const addHabit = useCallback((name: string, icon: string, pointsPerCheckIn: number, mandatory: boolean) => {
    const habit: Habit = {
      id: makeId(),
      name,
      icon,
      pointsPerCheckIn,
      createdAt: new Date().toISOString(),
      checkIns: [],
      archived: false,
      mandatory,
    }
    setState((s) => ({ ...s, habits: [...s.habits, habit] }))
  }, [])

  const checkInHabit = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) => {
        if (h.id !== id || hasCheckedInToday(h.checkIns)) return h
        return { ...h, checkIns: [...h.checkIns, { date: todayKey(), points: h.pointsPerCheckIn }] }
      }),
    }))
  }, [])

  const archiveHabit = useCallback((id: string) => {
    setState((s) => ({ ...s, habits: s.habits.map((h) => (h.id === id ? { ...h, archived: !h.archived } : h)) }))
  }, [])

  const deleteHabit = useCallback((id: string) => {
    setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }))
  }, [])

  const addSkill = useCallback((name: string, icon: string, pointsPerCheckIn: number) => {
    const skill: Skill = {
      id: makeId(),
      name,
      icon,
      pointsPerCheckIn,
      createdAt: new Date().toISOString(),
      checkIns: [],
      masteredAt: null,
      archived: false,
    }
    setState((s) => ({ ...s, skills: [...s.skills, skill] }))
  }, [])

  const checkInSkill = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      skills: s.skills.map((sk) => {
        if (sk.id !== id || hasCheckedInToday(sk.checkIns)) return sk
        return { ...sk, checkIns: [...sk.checkIns, { date: todayKey(), points: sk.pointsPerCheckIn }] }
      }),
    }))
  }, [])

  const archiveSkill = useCallback((id: string) => {
    setState((s) => ({ ...s, skills: s.skills.map((sk) => (sk.id === id ? { ...sk, archived: !sk.archived } : sk)) }))
  }, [])

  const deleteSkill = useCallback((id: string) => {
    setState((s) => ({ ...s, skills: s.skills.filter((sk) => sk.id !== id) }))
  }, [])

  const addTodo = useCallback((text: string) => {
    const todo: Todo = { id: makeId(), text, done: false, createdAt: new Date().toISOString(), completedAt: null }
    setState((s) => ({ ...s, todos: [todo, ...s.todos] }))
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      todos: s.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : null } : t
      ),
    }))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setState((s) => ({ ...s, todos: s.todos.filter((t) => t.id !== id) }))
  }, [])

  const addGoal = useCallback((title: string, description: string, icon: string, pointsReward: number, targetDate: string | null) => {
    const goal: Goal = {
      id: makeId(),
      title,
      description,
      icon,
      targetDate,
      createdAt: new Date().toISOString(),
      completedAt: null,
      archived: false,
      pointsReward,
    }
    setState((s) => ({ ...s, goals: [goal, ...s.goals] }))
  }, [])

  const completeGoal = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id && !g.completedAt ? { ...g, completedAt: new Date().toISOString() } : g)),
    }))
  }, [])

  const archiveGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? { ...g, archived: !g.archived } : g)) }))
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }))
  }, [])

  const setLevels = useCallback((levels: LevelDef[]) => {
    setState((s) => ({ ...s, levels }))
  }, [])

  const addReadingItems = useCallback((items: Omit<ReadingItem, 'id' | 'savedAt' | 'read' | 'saved'>[]) => {
    setState((s) => {
      const existingUrls = new Set(s.readingList.map((r) => r.url))
      const fresh = items
        .filter((it) => !existingUrls.has(it.url))
        .map((it) => ({ ...it, id: makeId(), savedAt: new Date().toISOString(), read: false, saved: false }))
      return { ...s, readingList: [...fresh, ...s.readingList] }
    })
  }, [])

  const toggleReadingRead = useCallback((id: string) => {
    setState((s) => ({ ...s, readingList: s.readingList.map((r) => (r.id === id ? { ...r, read: !r.read } : r)) }))
  }, [])

  const toggleReadingSaved = useCallback((id: string) => {
    setState((s) => ({ ...s, readingList: s.readingList.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r)) }))
  }, [])

  const removeReadingItem = useCallback((id: string) => {
    setState((s) => ({ ...s, readingList: s.readingList.filter((r) => r.id !== id) }))
  }, [])

  const addStories = useCallback((items: Omit<Story, 'id' | 'addedAt' | 'read' | 'saved'>[]) => {
    setState((s) => {
      const existingTitles = new Set(s.stories.map((st) => st.title.toLowerCase()))
      const fresh = items
        .filter((it) => !existingTitles.has(it.title.toLowerCase()))
        .map((it) => ({ ...it, id: makeId(), addedAt: new Date().toISOString(), read: false, saved: false }))
      return { ...s, stories: [...fresh, ...s.stories] }
    })
  }, [])

  const toggleStoryRead = useCallback((id: string) => {
    setState((s) => ({ ...s, stories: s.stories.map((st) => (st.id === id ? { ...st, read: !st.read } : st)) }))
  }, [])

  const toggleStorySaved = useCallback((id: string) => {
    setState((s) => ({ ...s, stories: s.stories.map((st) => (st.id === id ? { ...st, saved: !st.saved } : st)) }))
  }, [])

  const removeStory = useCallback((id: string) => {
    setState((s) => ({ ...s, stories: s.stories.filter((st) => st.id !== id) }))
  }, [])

  const logMeditationSession = useCallback((durationMinutes: number, soundscape: string) => {
    const session: MeditationSession = { id: makeId(), date: new Date().toISOString(), durationMinutes, soundscape }
    setState((s) => ({ ...s, meditationSessions: [session, ...s.meditationSessions] }))
  }, [])

  const logGameScore = useCallback((game: GameKind, score: number, detail: string) => {
    setState((s) => ({
      ...s,
      gameScores: [{ id: makeId(), game, date: new Date().toISOString(), score, detail }, ...s.gameScores],
    }))
  }, [])

  const addVocabWords = useCallback((items: Omit<VocabWord, 'id' | 'addedAt'>[]) => {
    setState((s) => {
      const existing = new Set(s.vocabWords.map((v) => v.word.toLowerCase()))
      const fresh = items
        .filter((it) => !existing.has(it.word.toLowerCase()))
        .map((it) => ({ ...it, id: makeId(), addedAt: new Date().toISOString() }))
      return { ...s, vocabWords: [...fresh, ...s.vocabWords] }
    })
  }, [])

  const markVocabWord = useCallback((id: string, learned: boolean) => {
    setState((s) => ({ ...s, vocabWords: s.vocabWords.map((v) => (v.id === id ? { ...v, learned } : v)) }))
  }, [])

  const removeVocabWord = useCallback((id: string) => {
    setState((s) => ({ ...s, vocabWords: s.vocabWords.filter((v) => v.id !== id) }))
  }, [])

  const addActivityType = useCallback((name: string, icon: string, pointsPerCompletion: number) => {
    const activity: ActivityType = { id: makeId(), name, icon, pointsPerCompletion, createdAt: new Date().toISOString(), archived: false }
    setState((s) => ({ ...s, activityTypes: [...s.activityTypes, activity] }))
  }, [])

  const archiveActivityType = useCallback((id: string) => {
    setState((s) => ({ ...s, activityTypes: s.activityTypes.map((a) => (a.id === id ? { ...a, archived: !a.archived } : a)) }))
  }, [])

  const logActivity = useCallback(
    (activityTypeId: string, durationMinutes: number, calories: number, distanceKm: number | null, notes: string) => {
      setState((s) => {
        const type = s.activityTypes.find((a) => a.id === activityTypeId)
        if (!type) return s
        const log = {
          id: makeId(),
          activityTypeId,
          date: todayKey(),
          durationMinutes,
          calories,
          distanceKm,
          notes,
          points: type.pointsPerCompletion,
          loggedAt: new Date().toISOString(),
        }
        return { ...s, activityLogs: [log, ...s.activityLogs] }
      })
    },
    []
  )

  const deleteActivityLog = useCallback((id: string) => {
    setState((s) => ({ ...s, activityLogs: s.activityLogs.filter((a) => a.id !== id) }))
  }, [])

  const logSleep = useCallback((quality: number, hours: number | null) => {
    const points = quality >= SLEEP_BONUS_THRESHOLD ? SLEEP_BONUS_POINTS : 0
    const log = { id: makeId(), date: todayKey(), quality, hours, points }
    setState((s) => ({ ...s, sleepLogs: [log, ...s.sleepLogs] }))
  }, [])

  const deleteSleepLog = useCallback((id: string) => {
    setState((s) => ({ ...s, sleepLogs: s.sleepLogs.filter((l) => l.id !== id) }))
  }, [])

  const logMeal = useCallback((mealType: MealType, description: string, quality: number, calories: number | null) => {
    const log = { id: makeId(), date: todayKey(), mealType, description, quality, calories, points: MEAL_LOG_POINTS }
    setState((s) => ({ ...s, mealLogs: [log, ...s.mealLogs] }))
  }, [])

  const deleteMealLog = useCallback((id: string) => {
    setState((s) => ({ ...s, mealLogs: s.mealLogs.filter((l) => l.id !== id) }))
  }, [])

  const addSpanishCards = useCallback((items: Omit<SpanishCard, 'id' | 'addedAt'>[]) => {
    setState((s) => {
      const existing = new Set(s.spanishCards.map((c) => c.spanish.toLowerCase()))
      const fresh = items
        .filter((it) => !existing.has(it.spanish.toLowerCase()))
        .map((it) => ({ ...it, id: makeId(), addedAt: new Date().toISOString() }))
      return { ...s, spanishCards: [...fresh, ...s.spanishCards] }
    })
  }, [])

  const markSpanishCard = useCallback((id: string, learned: boolean) => {
    setState((s) => ({ ...s, spanishCards: s.spanishCards.map((c) => (c.id === id ? { ...c, learned } : c)) }))
  }, [])

  const removeSpanishCard = useCallback((id: string) => {
    setState((s) => ({ ...s, spanishCards: s.spanishCards.filter((c) => c.id !== id) }))
  }, [])

  const logCodingSolved = useCallback((problemId: string, difficulty: 'easy' | 'medium' | 'hard', language: string, points: number) => {
    setState((s) => {
      if (s.codingSolved.some((c) => c.problemId === problemId)) return s
      const entry: CodingSolved = { id: makeId(), problemId, difficulty, language, solvedAt: new Date().toISOString(), points }
      return { ...s, codingSolved: [entry, ...s.codingSolved] }
    })
  }, [])

  const pushToGithub = useCallback(async () => {
    if (!syncConfig) throw new Error('Connect a GitHub repository first.')
    const csv = stateToCsv(state)
    const encrypted = await encryptText(csv, passphraseRef.current)
    const existing = await fetchFile(syncConfig).catch(() => null)
    await putFile(syncConfig, encrypted, `Update Mental Wellness data for ${profile.name}`, existing?.sha)
    return `Saved ${csv.split('\n').length} rows, encrypted with your profile passphrase, to ${syncConfig.owner}/${syncConfig.repo}.`
  }, [state, syncConfig, profile.name])

  const pullFromGithub = useCallback(async () => {
    if (!syncConfig) throw new Error('Connect a GitHub repository first.')
    const file = await fetchFile(syncConfig)
    if (!file) throw new Error('No data file found in that repository yet — try saving first.')
    const csv = await decryptText(file.content, passphraseRef.current)
    const restored = csvToState(csv)
    setState(restored)
    return 'Data restored from GitHub.'
  }, [syncConfig])

  const resetAllData = useCallback(() => {
    setState(emptyState())
  }, [])

  const points = useMemo(
    () => totalPoints(state),
    [state.habits, state.skills, state.goals, state.activityLogs, state.sleepLogs, state.mealLogs]
  )
  const level = useMemo(() => levelInfo(points, state.levels, state.unlockedLevel), [points, state.levels, state.unlockedLevel])

  // Ratchet unlockedLevel forward whenever the point threshold for a new
  // level is reached and today's mandatory habits are all checked in.
  // unlockedLevel never decreases, so a missed day only pauses leveling up.
  useEffect(() => {
    const rawLevel = levelForPoints(points)
    if (rawLevel > state.unlockedLevel && mandatoryHabitsOnTrack(state.habits)) {
      setState((s) => (rawLevel > s.unlockedLevel ? { ...s, unlockedLevel: rawLevel } : s))
    }
  }, [points, state.habits, state.unlockedLevel])

  const value: Ctx = {
    state,
    points,
    level,
    profile,
    signOut: onSignOut,
    addHabit,
    checkInHabit,
    archiveHabit,
    deleteHabit,
    addSkill,
    checkInSkill,
    archiveSkill,
    deleteSkill,
    addTodo,
    toggleTodo,
    deleteTodo,
    addGoal,
    completeGoal,
    archiveGoal,
    deleteGoal,
    setLevels,
    addReadingItems,
    toggleReadingRead,
    toggleReadingSaved,
    removeReadingItem,
    addStories,
    toggleStoryRead,
    toggleStorySaved,
    removeStory,
    logMeditationSession,
    logGameScore,
    addVocabWords,
    markVocabWord,
    removeVocabWord,
    addActivityType,
    archiveActivityType,
    logActivity,
    deleteActivityLog,
    logSleep,
    deleteSleepLog,
    logMeal,
    deleteMealLog,
    addSpanishCards,
    markSpanishCard,
    removeSpanishCard,
    logCodingSolved,
    syncConfig,
    setSyncConfig,
    pushToGithub,
    pullFromGithub,
    resetAllData,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData(): Ctx {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
