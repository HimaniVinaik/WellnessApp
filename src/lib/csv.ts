import {
  AppState,
  CheckIn,
  GameScore,
  Habit,
  LevelDef,
  MealType,
  MeditationSession,
  ReadingItem,
  Skill,
  Todo,
  VocabWord,
  emptyState,
} from '../types'

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
  const habitRows = state.habits.map((h) => [h.id, h.name, h.icon, h.pointsPerCheckIn, h.createdAt, h.archived, h.mandatory])
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
  const vocabRows = state.vocabWords.map((v) => [
    v.id,
    v.word,
    v.partOfSpeech,
    v.phonetic,
    v.definition,
    v.example ?? '',
    v.audioUrl ?? '',
    v.source,
    v.addedAt,
    v.learned,
  ])
  const activityTypeRows = state.activityTypes.map((a) => [a.id, a.name, a.icon, a.pointsPerCompletion, a.createdAt, a.archived])
  const activityLogRows = state.activityLogs.map((a) => [
    a.id,
    a.activityTypeId,
    a.date,
    a.durationMinutes,
    a.calories,
    a.distanceKm ?? '',
    a.notes,
    a.points,
    a.loggedAt,
  ])
  const sleepRows = state.sleepLogs.map((s) => [s.id, s.date, s.quality, s.hours ?? '', s.points])
  const mealRows = state.mealLogs.map((m) => [m.id, m.date, m.mealType, m.description, m.quality, m.calories ?? '', m.points])
  const spanishRows = state.spanishCards.map((c) => [c.id, c.spanish, c.english, c.pronunciation, c.category, c.addedAt, c.learned])
  const codingRows = state.codingSolved.map((c) => [c.id, c.problemId, c.difficulty, c.language, c.solvedAt, c.points])

  const metaRows = [['unlockedLevel', state.unlockedLevel]]

  return [
    section('HABITS', ['id', 'name', 'icon', 'pointsPerCheckIn', 'createdAt', 'archived', 'mandatory'], habitRows),
    section('SKILLS', ['id', 'name', 'icon', 'pointsPerCheckIn', 'createdAt', 'archived', 'masteredAt'], skillRows),
    section('CHECKINS', ['ownerType', 'ownerId', 'date', 'points'], checkinRows),
    section('TODOS', ['id', 'text', 'done', 'createdAt', 'completedAt'], todoRows),
    section('LEVELS', ['level', 'name'], levelRows),
    section('READING', ['id', 'title', 'url', 'source', 'summary', 'publishedAt', 'savedAt', 'read', 'saved'], readingRows),
    section('MEDITATION', ['id', 'date', 'durationMinutes', 'soundscape'], meditationRows),
    section('GAMESCORES', ['id', 'game', 'date', 'score', 'detail'], gameRows),
    section(
      'VOCAB',
      ['id', 'word', 'partOfSpeech', 'phonetic', 'definition', 'example', 'audioUrl', 'source', 'addedAt', 'learned'],
      vocabRows
    ),
    section('ACTIVITYTYPES', ['id', 'name', 'icon', 'pointsPerCompletion', 'createdAt', 'archived'], activityTypeRows),
    section(
      'ACTIVITYLOGS',
      ['id', 'activityTypeId', 'date', 'durationMinutes', 'calories', 'distanceKm', 'notes', 'points', 'loggedAt'],
      activityLogRows
    ),
    section('SLEEPLOGS', ['id', 'date', 'quality', 'hours', 'points'], sleepRows),
    section('MEALLOGS', ['id', 'date', 'mealType', 'description', 'quality', 'calories', 'points'], mealRows),
    section('SPANISH', ['id', 'spanish', 'english', 'pronunciation', 'category', 'addedAt', 'learned'], spanishRows),
    section('CODINGSOLVED', ['id', 'problemId', 'difficulty', 'language', 'solvedAt', 'points'], codingRows),
    section('META', ['key', 'value'], metaRows),
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
  state.vocabWords = []
  state.activityTypes = []
  state.activityLogs = []
  state.sleepLogs = []
  state.mealLogs = []
  state.spanishCards = []
  state.codingSolved = []

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
        const [id, name, icon, pts, createdAt, archived, mandatory] = r
        state.habits.push({
          id,
          name,
          icon,
          pointsPerCheckIn: num(pts),
          createdAt,
          archived: bool(archived),
          mandatory: bool(mandatory),
          checkIns: [],
        })
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
      case 'VOCAB': {
        const [id, word, partOfSpeech, phonetic, definition, example, audioUrl, source, addedAt, learned] = r
        state.vocabWords.push({
          id,
          word,
          partOfSpeech,
          phonetic,
          definition,
          example: orNull(example),
          audioUrl: orNull(audioUrl),
          source,
          addedAt,
          learned: bool(learned),
        })
        break
      }
      case 'ACTIVITYTYPES': {
        const [id, name, icon, pointsPerCompletion, createdAt, archived] = r
        state.activityTypes.push({ id, name, icon, pointsPerCompletion: num(pointsPerCompletion), createdAt, archived: bool(archived) })
        break
      }
      case 'ACTIVITYLOGS': {
        const [id, activityTypeId, date, durationMinutes, calories, distanceKm, notes, points, loggedAt] = r
        state.activityLogs.push({
          id,
          activityTypeId,
          date,
          durationMinutes: num(durationMinutes),
          calories: num(calories),
          distanceKm: distanceKm === '' ? null : Number(distanceKm),
          notes,
          points: num(points),
          loggedAt,
        })
        break
      }
      case 'SLEEPLOGS': {
        const [id, date, quality, hours, points] = r
        state.sleepLogs.push({ id, date, quality: num(quality), hours: hours === '' ? null : Number(hours), points: num(points) })
        break
      }
      case 'MEALLOGS': {
        const [id, date, mealType, description, quality, calories, points] = r
        state.mealLogs.push({
          id,
          date,
          mealType: mealType as MealType,
          description,
          quality: num(quality),
          calories: calories === '' ? null : Number(calories),
          points: num(points),
        })
        break
      }
      case 'SPANISH': {
        const [id, spanish, english, pronunciation, category, addedAt, learned] = r
        state.spanishCards.push({ id, spanish, english, pronunciation, category, addedAt, learned: bool(learned) })
        break
      }
      case 'CODINGSOLVED': {
        const [id, problemId, difficulty, language, solvedAt, points] = r
        state.codingSolved.push({
          id,
          problemId,
          difficulty: difficulty as 'easy' | 'medium' | 'hard',
          language,
          solvedAt,
          points: num(points),
        })
        break
      }
      case 'META': {
        const [key, value] = r
        if (key === 'unlockedLevel') state.unlockedLevel = num(value)
        break
      }
      default:
        break
    }
  }

  for (const h of state.habits) h.checkIns = habitCheckIns.get(h.id) ?? []
  for (const s of state.skills) s.checkIns = skillCheckIns.get(s.id) ?? []
  if (state.levels.length === 0) state.levels = emptyState().levels
  if (state.activityTypes.length === 0) state.activityTypes = emptyState().activityTypes

  return state
}
