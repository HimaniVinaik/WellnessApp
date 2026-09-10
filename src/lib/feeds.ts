export interface FeedItem {
  title: string
  url: string
  source: string
  summary: string
  publishedAt: string | null
}

export interface FeedSource {
  name: string
  feedUrl: string
  homepage: string
}

export const FEED_SOURCES: FeedSource[] = [
  { name: 'Aeon', feedUrl: 'https://aeon.co/feed.rss', homepage: 'https://aeon.co/essays' },
  { name: 'The Marginalian', feedUrl: 'https://www.themarginalian.org/feed/', homepage: 'https://www.themarginalian.org/' },
  { name: 'Nautilus', feedUrl: 'https://nautil.us/feed/', homepage: 'https://nautil.us/' },
  { name: 'Longreads', feedUrl: 'https://longreads.com/feed/', homepage: 'https://longreads.com/' },
]

// Curated starting points so the reading list isn't empty before the first
// live refresh (and still useful if the network/proxy is unavailable).
export const SEED_READING_ITEMS: FeedItem[] = [
  {
    title: 'Aeon — Essays on philosophy, culture and the mind',
    url: 'https://aeon.co/essays',
    source: 'Aeon',
    summary:
      'Aeon publishes in-depth essays, argument and observation exploring the ideas that make sense of life, from philosophy and psychology to science and culture.',
    publishedAt: null,
  },
  {
    title: 'The Marginalian — Figuring out how to live',
    url: 'https://www.themarginalian.org/',
    source: 'The Marginalian',
    summary:
      "Maria Popova's long-running exploration of art, science, philosophy and the search for meaning, drawn from letters, biographies and poetry.",
    publishedAt: null,
  },
  {
    title: 'Nautilus — Science, Illuminated',
    url: 'https://nautil.us/',
    source: 'Nautilus',
    summary: 'Essays connecting science to culture, philosophy and the humanities, written for the intellectually curious.',
    publishedAt: null,
  },
  {
    title: 'Longreads — Thoughtful, deeply reported stories',
    url: 'https://longreads.com/',
    source: 'Longreads',
    summary: 'A home for the best long-form, narrative journalism and essays on the open web.',
    publishedAt: null,
  },
]

function stripHtml(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
  } catch {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }
}

function textOf(el: Element | null | undefined): string {
  return el?.textContent?.trim() ?? ''
}

function parseFeedXml(xml: string, sourceName: string): FeedItem[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  if (doc.querySelector('parsererror')) return []

  let entries = Array.from(doc.querySelectorAll('item'))
  let isAtom = false
  if (entries.length === 0) {
    entries = Array.from(doc.querySelectorAll('entry'))
    isAtom = true
  }

  return entries
    .map((entry) => {
      const title = textOf(entry.querySelector('title')) || 'Untitled'
      let link = ''
      if (isAtom) {
        const linkEl = entry.querySelector('link[href]')
        link = linkEl?.getAttribute('href') ?? ''
      } else {
        link = textOf(entry.querySelector('link'))
      }
      const rawSummary =
        textOf(entry.querySelector('encoded')) ||
        textOf(entry.querySelector('description')) ||
        textOf(entry.querySelector('summary')) ||
        textOf(entry.querySelector('content'))
      const summary = stripHtml(rawSummary).slice(0, 500)
      const pub = textOf(entry.querySelector('pubDate')) || textOf(entry.querySelector('published')) || textOf(entry.querySelector('updated'))
      const publishedAt = pub ? new Date(pub).toISOString() : null

      return { title, url: link, source: sourceName, summary, publishedAt }
    })
    .filter((item) => item.url)
}

// Two independent public CORS proxies, tried in order — free proxies like
// these are prone to being slow, rate-limited or briefly down, so relying on
// only one means a single bad day for that service hangs the whole feature.
const PROXIES = [
  (url: string) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url),
  (url: string) => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url),
]

/** fetch() has no built-in timeout — a stalled connection (common with free
 * CORS proxies under load) leaves the returned promise pending forever,
 * which is indistinguishable from the UI just hanging. This aborts and
 * rejects after `timeoutMs` so a stuck request always fails fast enough to
 * fall back to the next option instead of stalling the whole operation. */
async function fetchWithTimeout(url: string, init: RequestInit | undefined, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    window.clearTimeout(timer)
  }
}

/** Fetches a URL directly first (works when the source sends CORS headers),
 * falling back through a couple of public CORS proxies when the browser
 * blocks the direct request. Every attempt has a hard timeout, so a stalled
 * proxy always fails over to the next one instead of hanging indefinitely.
 * Shared by the essay feed reader and the detective-story fetcher. */
export async function fetchTextWithProxy(url: string, accept?: string): Promise<string> {
  try {
    const direct = await fetchWithTimeout(url, accept ? { headers: { Accept: accept } } : undefined, 8000)
    if (direct.ok) return await direct.text()
  } catch {
    // CORS or network failure (or timeout) — fall back to a proxy below.
  }

  let lastErr: unknown
  for (const makeProxyUrl of PROXIES) {
    try {
      const res = await fetchWithTimeout(makeProxyUrl(url), undefined, 15000)
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`)
      return await res.text()
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Fetch failed')
}

export async function fetchOneFeed(source: FeedSource): Promise<FeedItem[]> {
  const xml = await fetchTextWithProxy(source.feedUrl, 'application/rss+xml, application/xml, text/xml')
  return parseFeedXml(xml, source.name)
}

export async function fetchAllFeeds(sources: FeedSource[] = FEED_SOURCES): Promise<{ items: FeedItem[]; errors: string[] }> {
  const results = await Promise.allSettled(sources.map((s) => fetchOneFeed(s)))
  const items: FeedItem[] = []
  const errors: string[] = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') items.push(...r.value)
    else errors.push(sources[i].name)
  })
  return { items, errors }
}
