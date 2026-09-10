// Classic detective and crime-solving short stories, sourced live from
// Project Gutenberg (public-domain books only) via the Gutendex search API —
// Holmes and Poirot among several other authors, plus a genre-wide query so
// the feature isn't dependent on any single author's search — with a few
// fixed Gutenberg IDs as a fallback if Gutendex itself is unreachable.
// Everything here reads real text fetched over the network — nothing is
// hardcoded fiction.

import { fetchTextWithProxy } from './feeds'

export interface NewStory {
  title: string
  author: string
  source: string
  url: string
  text: string
}

interface GutendexBook {
  id: number
  title: string
  authors?: { name: string }[]
  subjects?: string[]
  bookshelves?: string[]
  formats: Record<string, string>
}

const GUTENDEX_SEARCH = 'https://gutendex.com/books/?search='
const MAX_STORY_TEXT_LENGTH = 200_000
const MAX_NEW_STORIES_PER_REFRESH = 8
const MIN_STORY_LENGTH = 1800

interface StoryQuery {
  query: string
  // A book matches if its title matches titleMatch, OR (when subjectMatch is
  // given instead) if any of its Gutendex subjects/bookshelves do — this
  // makes the last, genre-wide query independent of any one author's exact
  // titles, so the feature isn't reliant on any single query pattern.
  titleMatch?: RegExp
  subjectMatch?: RegExp
  authorLabel: string
}

// A spread of classic, unambiguously public-domain crime/detective authors —
// not just Holmes and Poirot — plus one genre-wide query, so a poll has many
// independent paths to a result instead of depending on two narrow searches.
const QUERIES: StoryQuery[] = [
  { query: 'Arthur Conan Doyle', titleMatch: /sherlock|holmes/i, authorLabel: 'Arthur Conan Doyle' },
  { query: 'Agatha Christie', titleMatch: /poirot|styles|links/i, authorLabel: 'Agatha Christie' },
  { query: 'Edgar Allan Poe', titleMatch: /rue morgue|purloined letter|marie roget|mystery|detective/i, authorLabel: 'Edgar Allan Poe' },
  { query: 'G. K. Chesterton Father Brown', titleMatch: /father brown/i, authorLabel: 'G. K. Chesterton' },
  { query: 'R. Austin Freeman Thorndyke', titleMatch: /thorndyke/i, authorLabel: 'R. Austin Freeman' },
  { query: 'Jacques Futrelle Thinking Machine', titleMatch: /thinking machine/i, authorLabel: 'Jacques Futrelle' },
  { query: 'Baroness Orczy Old Man in the Corner', titleMatch: /old man in the corner/i, authorLabel: 'Baroness Orczy' },
  { query: 'detective mystery stories', subjectMatch: /detective|mystery|crime/i, authorLabel: 'Classic Detective Fiction' },
]

// Fixed, well-known public-domain Gutenberg IDs used only if the Gutendex
// search API itself can't be reached.
const FALLBACK_BOOKS = [
  { id: 1661, title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle' },
  { id: 834, title: 'The Memoirs of Sherlock Holmes', author: 'Arthur Conan Doyle' },
  { id: 863, title: 'The Mysterious Affair at Styles', author: 'Agatha Christie' },
  { id: 1289, title: 'The Innocence of Father Brown', author: 'G. K. Chesterton' },
]

function bookMatchesQuery(b: GutendexBook, q: StoryQuery): boolean {
  if (q.titleMatch) return q.titleMatch.test(b.title)
  if (q.subjectMatch) return [...(b.subjects ?? []), ...(b.bookshelves ?? [])].some((s) => q.subjectMatch!.test(s))
  return true
}

async function searchGutendex(query: string): Promise<GutendexBook[]> {
  const text = await fetchTextWithProxy(GUTENDEX_SEARCH + encodeURIComponent(query), 'application/json')
  const data = JSON.parse(text)
  return Array.isArray(data?.results) ? data.results : []
}

function pickPlainTextUrl(formats: Record<string, string>): string | null {
  const keys = Object.keys(formats || {})
  const utf8 = keys.find((k) => k.startsWith('text/plain') && /utf-8/i.test(k))
  if (utf8) return formats[utf8]
  const anyPlain = keys.find((k) => k.startsWith('text/plain'))
  return anyPlain ? formats[anyPlain] : null
}

async function fetchFallbackBookText(id: number): Promise<string> {
  const candidates = [`https://www.gutenberg.org/files/${id}/${id}-0.txt`, `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`]
  let lastErr: unknown
  for (const url of candidates) {
    try {
      return await fetchTextWithProxy(url, 'text/plain')
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Could not fetch book text')
}

function stripGutenbergBoilerplate(raw: string): string {
  const startRe = /\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i
  const endRe = /\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i
  const startMatch = startRe.exec(raw)
  const endMatch = endRe.exec(raw)
  const start = startMatch ? startMatch.index + startMatch[0].length : 0
  const end = endMatch ? endMatch.index : raw.length
  return raw.slice(start, end).trim()
}

interface StorySegment {
  heading: string
  text: string
}

/** Splits a Gutenberg collection into its individual stories by looking for
 * short, mostly-uppercase heading lines that are isolated by blank lines
 * (the standard formatting for chapter/story titles in these transcriptions),
 * then discarding any segment too short to be a real story — this filters
 * out a book's own table of contents, which lists the same-looking headings
 * back-to-back with almost no text between them. */
function splitIntoStories(cleanText: string): StorySegment[] {
  const lines = cleanText.replace(/\r\n/g, '\n').split('\n')

  const isHeadingCandidate = (line: string): boolean => {
    const trimmed = line.trim()
    if (trimmed.length < 3 || trimmed.length > 80) return false
    const letters = trimmed.replace(/[^A-Za-z]/g, '')
    if (letters.length < 3) return false
    const upper = trimmed.replace(/[^A-Z]/g, '')
    if (upper.length / letters.length < 0.85) return false
    // A bare "CHAPTER I" / "CHAPTER 1" numbers a section of one continuous
    // story, not a distinct story of its own — only treat it as a story
    // boundary when a real title follows the numeral (e.g. "ADVENTURE I. A
    // SCANDAL IN BOHEMIA"). This keeps whole novels from being shattered
    // into one fake "story" per chapter.
    const numberedMatch = /^(ADVENTURE|CHAPTER)\s+[IVXLC0-9]+\.?\s*(.*)$/i.exec(trimmed)
    if (numberedMatch && numberedMatch[2].trim().length < 3) return false
    return true
  }

  const headingIdxs: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (!isHeadingCandidate(lines[i])) continue
    const prevBlank = i === 0 || lines[i - 1].trim() === ''
    const nextBlank = i === lines.length - 1 || lines[i + 1].trim() === ''
    if (prevBlank && nextBlank) headingIdxs.push(i)
  }
  if (headingIdxs.length === 0) return []

  const segments: StorySegment[] = []
  for (let k = 0; k < headingIdxs.length; k++) {
    const bodyStart = headingIdxs[k] + 1
    const bodyEnd = k + 1 < headingIdxs.length ? headingIdxs[k + 1] : lines.length
    segments.push({ heading: lines[headingIdxs[k]].trim(), text: lines.slice(bodyStart, bodyEnd).join('\n').trim() })
  }
  return segments.filter((seg) => seg.text.length >= MIN_STORY_LENGTH)
}

function cleanHeading(raw: string): string {
  const stripped = raw.replace(/^(ADVENTURE|CHAPTER)\s+[IVXLC0-9]+\.?\s*/i, '').trim() || raw
  return stripped.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase())
}

function truncate(text: string): string {
  if (text.length <= MAX_STORY_TEXT_LENGTH) return text
  return text.slice(0, MAX_STORY_TEXT_LENGTH) + '\n\n[Story truncated for length — read the rest on Project Gutenberg.]'
}

async function storiesFromBook(book: { title: string; author: string; url: string }, rawText: string): Promise<NewStory[]> {
  const clean = stripGutenbergBoilerplate(rawText)
  const segments = splitIntoStories(clean)
  const source = `${book.title} — Project Gutenberg`
  if (segments.length === 0) {
    return [{ title: book.title, author: book.author, source, url: book.url, text: truncate(clean) }]
  }
  return segments.map((seg) => ({
    title: cleanHeading(seg.heading),
    author: book.author,
    source,
    url: book.url,
    text: truncate(seg.text),
  }))
}

async function storiesForQuery(q: StoryQuery, existingSources: Set<string>): Promise<NewStory[]> {
  const results = await searchGutendex(q.query)
  const candidates = results.filter((b) => bookMatchesQuery(b, q) && pickPlainTextUrl(b.formats))
  if (candidates.length === 0) throw new Error('No matching Gutenberg books found')

  const fresh = candidates.find((b) => !existingSources.has(`${b.title} — project gutenberg`.toLowerCase()))
  const picked = fresh ?? candidates[Math.floor(Math.random() * candidates.length)]
  const textUrl = pickPlainTextUrl(picked.formats)!
  const raw = await fetchTextWithProxy(textUrl, 'text/plain')
  return storiesFromBook({ title: picked.title, author: picked.authors?.[0]?.name ?? q.authorLabel, url: textUrl }, raw)
}

async function storiesForFallbackBook(fb: (typeof FALLBACK_BOOKS)[number]): Promise<NewStory[]> {
  const raw = await fetchFallbackBookText(fb.id)
  return storiesFromBook({ title: fb.title, author: fb.author, url: `https://www.gutenberg.org/ebooks/${fb.id}` }, raw)
}

/** Fetches a fresh batch of public-domain detective stories from Project
 * Gutenberg. `existingSources` should be the lowercased `source` field of
 * stories already saved, so a repeat refresh naturally moves on to a
 * different book once one has been fully imported.
 *
 * Every network attempt underneath this has its own timeout (see
 * fetchTextWithProxy), and the queries here run in parallel rather than one
 * after another — otherwise a single slow proxy multiplies across every
 * query and fallback book in turn, which is what made this hang in practice
 * with nothing ever appearing. */
export async function refreshStories(existingSources: Set<string>): Promise<{ items: NewStory[]; errors: string[] }> {
  const items: NewStory[] = []
  const errors: string[] = []

  const queryResults = await Promise.allSettled(QUERIES.map((q) => storiesForQuery(q, existingSources)))
  queryResults.forEach((r, i) => {
    if (r.status === 'fulfilled') items.push(...r.value)
    else errors.push(QUERIES[i].authorLabel)
  })

  if (items.length === 0) {
    const candidateBooks = FALLBACK_BOOKS.filter((fb) => !existingSources.has(`${fb.title} — project gutenberg`.toLowerCase()))
    const fallbackResults = await Promise.allSettled(candidateBooks.map((fb) => storiesForFallbackBook(fb)))
    fallbackResults.forEach((r, i) => {
      if (r.status === 'fulfilled') items.push(...r.value)
      else errors.push(candidateBooks[i].title)
    })
  }

  return { items: items.slice(0, MAX_NEW_STORIES_PER_REFRESH), errors }
}
