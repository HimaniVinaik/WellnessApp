import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  AppState,
  GameKind,
  GithubSyncConfig,
  Habit,
  LevelDef,
  MeditationSession,
  ReadingItem,
  Skill,
  Todo,
  VocabWord,
} from '../types'
import { makeId } from '../lib/id'
import { hasCheckedInToday, todayKey, totalPoints, levelInfo } from '../lib/points'
import { loadState, saveState, loadSyncConfig, saveSyncConfig, clearSyncConfig } from '../lib/storage'
import { csvToState, stateToCsv } from '../lib/csv'
import { decryptText, encryptText } from '../lib/crypto'
import { fetchFile, putFile } from '../lib/github'

interface Ctx {
  state: AppState
  points: number
  level: ReturnType<typeof levelInfo>
  addHabit: (name: string, icon: string, pointsPerCheckIn: number) => void
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

  setLevels: (levels: LevelDef[]) => void

  addReadingItems: (items: Omit<ReadingItem, 'id' | 'savedAt' | 'read' | 'saved'>[]) => void
  toggleReadingRead: (id: string) => void
  toggleReadingSaved: (id: string) => void
  removeReadingItem: (id: string) => void

  logMeditationSession: (durationMinutes: number, soundscape: string) => void
  logGameScore: (game: GameKind, score: number, detail: string) => void

  addVocabWords: (items: Omit<VocabWord, 'id' | 'addedAt'>[]) => void
  markVocabWord: (id: string, learned: boolean) => void
  removeVocabWord: (id: string) => void

  syncConfig: GithubSyncConfig | null
  setSyncConfig: (cfg: GithubSyncConfig | null) => void
  pushToGithub: (passphrase: string) => Promise<string>
  pullFromGithub: (passphrase: string) => Promise<string>

  resetAllData: () => void
}

const AppDataContext = createContext<Ctx | null>(null)

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())
  const [syncConfig, setSyncConfigState] = useState<GithubSyncConfig | null>(() => loadSyncConfig())

  useEffect(() => {
    saveState(state)
  }, [state])

  const setSyncConfig = useCallback((cfg: GithubSyncConfig | null) => {
    setSyncConfigState(cfg)
    if (cfg) saveSyncConfig(cfg)
    else clearSyncConfig()
  }, [])

  const addHabit = useCallback((name: string, icon: string, pointsPerCheckIn: number) => {
    const habit: Habit = {
      id: makeId(),
      name,
      icon,
      pointsPerCheckIn,
      createdAt: new Date().toISOString(),
      checkIns: [],
      archived: false,
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

  const pushToGithub = useCallback(
    async (passphrase: string) => {
      if (!syncConfig) throw new Error('Connect a GitHub repository first.')
      const csv = stateToCsv(state)
      const encrypted = await encryptText(csv, passphrase)
      const existing = await fetchFile(syncConfig).catch(() => null)
      await putFile(syncConfig, encrypted, 'Update Mental Wellness data', existing?.sha)
      return `Saved ${csv.split('\n').length} rows, encrypted, to ${syncConfig.owner}/${syncConfig.repo}.`
    },
    [state, syncConfig]
  )

  const pullFromGithub = useCallback(
    async (passphrase: string) => {
      if (!syncConfig) throw new Error('Connect a GitHub repository first.')
      const file = await fetchFile(syncConfig)
      if (!file) throw new Error('No data file found in that repository yet — try saving first.')
      const csv = await decryptText(file.content, passphrase)
      const restored = csvToState(csv)
      setState(restored)
      return 'Data restored from GitHub.'
    },
    [syncConfig]
  )

  const resetAllData = useCallback(() => {
    setState(loadState())
    localStorage.removeItem('mw.state.v1')
    window.location.reload()
  }, [])

  const points = useMemo(() => totalPoints(state.habits, state.skills), [state.habits, state.skills])
  const level = useMemo(() => levelInfo(points, state.levels), [points, state.levels])

  const value: Ctx = {
    state,
    points,
    level,
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
    setLevels,
    addReadingItems,
    toggleReadingRead,
    toggleReadingSaved,
    removeReadingItem,
    logMeditationSession,
    logGameScore,
    addVocabWords,
    markVocabWord,
    removeVocabWord,
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
