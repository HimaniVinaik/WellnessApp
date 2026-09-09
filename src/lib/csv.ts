import { AppState, CheckIn, GameScore, Habit, LevelDef, MeditationSession, ReadingItem, Skill, Todo, emptyState } from '../types'

// A small multi-table CSV format: sections are separated by a `#SECTION,<name>`
// marker row followed by a header row, then data rows. This keeps the file a
// plain, human-inspectable CSV while holding several related tables.

function csvEscape(value: string | number | boolean | null | undefined): string {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function rowToCsv(fields: (string | number | boolean | null | undefined)[]): string {
  return fields.map(csvEscape).join(',')
}

function section(name: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const lines = [`#SECTION,${name}`, rowToCsv(headers)]
  for (const r of rows) lines.push(rowToCsv(r))
  return lines.join('\n')
}

export function stateToCsv(state: AppState): string {
  const habitRows = state.habits.map((h) => [h.id, h.name, h.icon, h.pointsPerCheckIn, h.createdAt, h.archived])
  const skillRows = state.skills.map((s) => [s.id, s.name, s.icon, s.pointsPerCheckIn, s.createdAt, s.archived, s.masteredAt ?? ''])

  const checkinRows: (string | number)[][] = []
  for (const h of state.habits) for (const c of h.checkIns) checkinRows.push(['habit', h.id, c.date, c.points])
  for (const s of state.skills) for (const c of s.checkIns) checkinRows.push(['skill', s.id, c.date, c.points])

  const todoRows = state.todos.map((t) => [t.id, t.text, t.done, t.createdAt, t.completedAt ?? ''])
  const levelRows = state.levels.map((l) => [l.level, l.name])
  const readingRows = state.readingList.map((r) => [
    r.id,
    r.title,
    r.url,
    r.source,
    r.summary,
    r.publishedAt ?? '',
    r.savedAt,
    r.read,
    r.saved,
  ])
  const meditationRows = state.meditationSessions.map((m) => [m.id, m.date, m.durationMinutes, m.soundscape])
  const gameRows = state.gameScores.map((g) => [g.id, g.game, g.date, g.score, g.detail])

  return [
    section('HABITS', ['id', 'name', 'icon', 'pointsPerCheckIn', 'createdAt', 'archived'], habitRows),
    section('SKILLS', ['id', 'name', 'icon', 'pointsPerCheckIn', 'createdAt', 'archived', 'masteredAt'], skillRows),
    section('CHECKINS', ['ownerType', 'ownerId', 'date', 'points'], checkinRows),
    section('TODOS', ['id', 'text', 'done', 'createdAt', 'completedAt'], todoRows),
    section('LEVELS', ['level', 'name'], levelRows),
    section('READING', ['id', 'title', 'url', 'source', 'summary', 'publishedAt', 'savedAt', 'read', 'saved'], readingRows),
    section('MEDITATION', ['id', 'date', 'durationMinutes', 'soundscape'], meditationRows),
    section('GAMESCORES', ['id', 'game', 'date', 'score', 'detail'], gameRows),
  ].join('\n\n')
}

/** Parses raw CSV text into rows of string fields, honoring quoted fields
 * that may contain commas, quotes (escaped as "") and newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0
  const n = text.length

  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  while (i < n) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += ch
      i++
      continue
    }
    if (ch === '"') {
      inQuotes = true
      i++
      continue
    }
    if (ch === ',') {
      pushField()
      i++
      continue
    }
    if (ch === '\r') {
      i++
      continue
    }
    if (ch === '\n') {
      pushRow()
      i++
      continue
    }
    field += ch
    i++
  }
  if (field.length > 0 || row.length > 0) pushRow()
  return rows.filter((r) => !(r.length === 1 && r[0] === ''))
}

const bool = (v: string) => v === 'true'
const num = (v: string) => Number(v || 0)
const orNull = (v: string) => (v === '' ? null : v)

export function csvToState(csv: string): AppState {
  const state = emptyState()
  state.habits = []
  state.skills = []
  state.todos = []
  state.levels = []
  state.readingList = []
  state.meditationSessions = []
  state.gameScores = []

  const rows = parseCsv(csv)
  const habitCheckIns = new Map<string, CheckIn[]>()
  const skillCheckIns = new Map<string, CheckIn[]>()

  let current = ''
  let sawHeader = false

  for (const r of rows) {
    if (r[0] === '#SECTION') {
      current = r[1]
      sawHeader = false
      continue
    }
    if (!sawHeader) {
      sawHeader = true
      continue // header row, skip
    }
    switch (current) {
      case 'HABITS': {
        const [id, name, icon, pts, createdAt, archived] = r
        state.habits.push({ id, name, icon, pointsPerCheckIn: num(pts), createdAt, archived: bool(archived), checkIns: [] })
        break
      }
      case 'SKILLS': {
        const [id, name, icon, pts, createdAt, archived, masteredAt] = r
        state.skills.push({
          id,
          name,
          icon,
          pointsPerCheckIn: num(pts),
          createdAt,
          archived: bool(archived),
          masteredAt: orNull(masteredAt),
          checkIns: [],
        })
        break
      }
      case 'CHECKINS': {
        const [ownerType, ownerId, date, points] = r
        const entry: CheckIn = { date, points: num(points) }
        const map = ownerType === 'habit' ? habitCheckIns : skillCheckIns
        if (!map.has(ownerId)) map.set(ownerId, [])
        map.get(ownerId)!.push(entry)
        break
      }
      case 'TODOS': {
        const [id, text, done, createdAt, completedAt] = r
        state.todos.push({ id, text, done: bool(done), createdAt, completedAt: orNull(completedAt) })
        break
      }
      case 'LEVELS': {
        const [level, name] = r
        state.levels.push({ level: num(level), name })
        break
      }
      case 'READING': {
        const [id, title, url, source, summary, publishedAt, savedAt, read, saved] = r
        state.readingList.push({
          id,
          title,
          url,
          source,
          summary,
          publishedAt: orNull(publishedAt),
          savedAt,
          read: bool(read),
          saved: bool(saved),
        })
        break
      }
      case 'MEDITATION': {
        const [id, date, durationMinutes, soundscape] = r
        state.meditationSessions.push({ id, date, durationMinutes: num(durationMinutes), soundscape })
        break
      }
      case 'GAMESCORES': {
        const [id, game, date, score, detail] = r
        state.gameScores.push({ id, game: game as GameScore['game'], date, score: num(score), detail })
        break
      }
      default:
        break
    }
  }

  for (const h of state.habits) h.checkIns = habitCheckIns.get(h.id) ?? []
  for (const s of state.skills) s.checkIns = skillCheckIns.get(s.id) ?? []
  if (state.levels.length === 0) state.levels = emptyState().levels

  return state
}
