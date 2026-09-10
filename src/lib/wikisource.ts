// A second, independent source of classic detective fiction: Wikisource,
// via the core MediaWiki API. Unlike Project Gutenberg, MediaWiki's API
// supports anonymous cross-origin requests natively (the `origin=*` param),
// so this path needs no CORS proxy at all — if the Gutenberg/Gutendex path
// is failing because a proxy is down, this gives it an independent way to
// still find something.

import { fetchTextWithProxy } from './feeds'
import type { NewStory } from './stories'

interface WikisourceQuery {
  query: string
  author: string
}

const WIKISOURCE_QUERIES: WikisourceQuery[] = [
  { query: 'Adventures of Sherlock Holmes Scandal in Bohemia', author: 'Arthur Conan Doyle' },
  { query: 'Adventures of Sherlock Holmes Red-Headed League', author: 'Arthur Conan Doyle' },
  { query: 'Murders in the Rue Morgue Poe', author: 'Edgar Allan Poe' },
  { query: 'Purloined Letter Poe', author: 'Edgar Allan Poe' },
  { query: 'Innocence of Father Brown Blue Cross', author: 'G. K. Chesterton' },
  { query: 'Old Man in the Corner Orczy', author: 'Baroness Orczy' },
]

const MIN_WIKISOURCE_TEXT_LENGTH = 800

async function searchWikisource(query: string): Promise<string[]> {
  const url = `https://en.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    query
  )}&srnamespace=0&srlimit=5&format=json&origin=*`
  const text = await fetchTextWithProxy(url, 'application/json')
  const data = JSON.parse(text)
  const hits = data?.query?.search
  return Array.isArray(hits) ? hits.map((h: { title: string }) => h.title) : []
}

async function fetchWikisourcePageHtml(title: string): Promise<string> {
  const url = `https://en.wikisource.org/api/rest_v1/page/html/${encodeURIComponent(title)}`
  return fetchTextWithProxy(url, 'text/html')
}

/** Wikisource pages render with header/navigation chrome (title/author
 * template tables, "sister projects" boxes, footnote markers, edit-section
 * links) around the actual prose. This strips the obvious chrome and keeps
 * paragraph text, joined with blank lines to match the app's paragraph
 * splitting elsewhere. */
function htmlToStoryText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('table, sup, style, script, .mw-editsection, .reference, .noprint, .mw-empty-elt').forEach((el) => el.remove())
  const paragraphs = Array.from(doc.querySelectorAll('p'))
    .map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 0)
  return paragraphs.join('\n\n')
}

async function storyFromWikisourceQuery(q: WikisourceQuery, existingSources: Set<string>): Promise<NewStory> {
  const titles = await searchWikisource(q.query)
  if (titles.length === 0) throw new Error('No matching Wikisource page found')

  const fresh = titles.find((t) => !existingSources.has(`${t} — wikisource`.toLowerCase()))
  const title = fresh ?? titles[0]
  const html = await fetchWikisourcePageHtml(title)
  const text = htmlToStoryText(html)
  if (text.length < MIN_WIKISOURCE_TEXT_LENGTH) throw new Error('Wikisource page had too little text (likely not the full story)')

  return {
    title: title.includes('/') ? title.split('/').pop()!.trim() : title,
    author: q.author,
    source: `${title} — Wikisource`,
    url: `https://en.wikisource.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    text,
  }
}

/** Tries every curated Wikisource query in parallel and returns whichever
 * succeed. Each is independent, so one bad search or a missing page doesn't
 * affect the others. */
export async function fetchWikisourceStories(existingSources: Set<string>): Promise<{ items: NewStory[]; errors: string[] }> {
  const results = await Promise.allSettled(WIKISOURCE_QUERIES.map((q) => storyFromWikisourceQuery(q, existingSources)))
  const items: NewStory[] = []
  const errors: string[] = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') items.push(r.value)
    else errors.push(`${WIKISOURCE_QUERIES[i].author} (Wikisource)`)
  })
  return { items, errors }
}
