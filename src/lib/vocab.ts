// Word-of-the-day sourcing: a curated, offline-reliable SAT/GRE word bank
// (with hand-written definitions and phonetic respellings) is always the
// baseline, so the game works with zero network access. When online, each
// word is enriched with a live definition/IPA pronunciation/audio clip from
// the Free Dictionary API, and the "refresh" action polls fresh random
// words from a separate public word-list API — a genuinely different
// online source from the curated bank.

export interface WordEntry {
  word: string
  partOfSpeech: string
  phonetic: string
  definition: string
}

export interface VocabWordDraft {
  word: string
  partOfSpeech: string
  phonetic: string
  definition: string
  example: string | null
  audioUrl: string | null
  source: string
}

export const SAT_WORD_BANK: WordEntry[] = [
  { word: 'ephemeral', partOfSpeech: 'adjective', phonetic: 'ih-FEM-er-uhl', definition: 'Lasting for a very short time; fleeting.' },
  { word: 'ubiquitous', partOfSpeech: 'adjective', phonetic: 'yoo-BIK-wi-tuhs', definition: 'Present, appearing, or found everywhere.' },
  { word: 'cogent', partOfSpeech: 'adjective', phonetic: 'KOH-juhnt', definition: 'Clear, logical, and convincing.' },
  { word: 'ameliorate', partOfSpeech: 'verb', phonetic: 'uh-MEEL-yuh-rayt', definition: 'To make something bad or unsatisfactory better.' },
  { word: 'pragmatic', partOfSpeech: 'adjective', phonetic: 'prag-MAT-ik', definition: 'Dealing with things sensibly and realistically.' },
  { word: 'ostentatious', partOfSpeech: 'adjective', phonetic: 'os-ten-TAY-shuhs', definition: 'Characterized by a vulgar or pretentious display designed to impress.' },
  { word: 'vindicate', partOfSpeech: 'verb', phonetic: 'VIN-di-kayt', definition: 'To clear someone of blame or suspicion; to justify.' },
  { word: 'nefarious', partOfSpeech: 'adjective', phonetic: 'ni-FAIR-ee-uhs', definition: 'Wicked or criminal.' },
  { word: 'placate', partOfSpeech: 'verb', phonetic: 'PLAY-kayt', definition: 'To make someone less angry or hostile.' },
  { word: 'zealous', partOfSpeech: 'adjective', phonetic: 'ZEL-uhs', definition: 'Having or showing great energy or enthusiasm in pursuit of a cause.' },
  { word: 'candid', partOfSpeech: 'adjective', phonetic: 'KAN-did', definition: 'Truthful and straightforward; frank.' },
  { word: 'meticulous', partOfSpeech: 'adjective', phonetic: 'muh-TIK-yuh-luhs', definition: 'Showing great attention to detail; very careful and precise.' },
  { word: 'ambivalent', partOfSpeech: 'adjective', phonetic: 'am-BIV-uh-luhnt', definition: 'Having mixed feelings or contradictory ideas about something.' },
  { word: 'enervate', partOfSpeech: 'verb', phonetic: 'EN-er-vayt', definition: 'To weaken or drain someone of energy.' },
  { word: 'garrulous', partOfSpeech: 'adjective', phonetic: 'GAR-uh-luhs', definition: 'Excessively talkative, especially about trivial matters.' },
  { word: 'pernicious', partOfSpeech: 'adjective', phonetic: 'per-NISH-uhs', definition: 'Having a harmful effect, especially in a gradual or subtle way.' },
  { word: 'sanguine', partOfSpeech: 'adjective', phonetic: 'SANG-gwin', definition: 'Optimistic or positive, especially in a difficult situation.' },
  { word: 'taciturn', partOfSpeech: 'adjective', phonetic: 'TAS-i-turn', definition: 'Reserved or uncommunicative in speech; saying little.' },
  { word: 'vex', partOfSpeech: 'verb', phonetic: 'VEKS', definition: 'To make someone feel annoyed, frustrated, or worried.' },
  { word: 'wary', partOfSpeech: 'adjective', phonetic: 'WAIR-ee', definition: 'Feeling or showing caution about possible dangers or problems.' },
  { word: 'austere', partOfSpeech: 'adjective', phonetic: 'aw-STEER', definition: 'Severe or strict in manner; having a plain, simple style with no luxury.' },
  { word: 'belie', partOfSpeech: 'verb', phonetic: 'bih-LY', definition: 'To give a false impression of; to fail to fulfill or justify.' },
  { word: 'capricious', partOfSpeech: 'adjective', phonetic: 'kuh-PRISH-uhs', definition: 'Given to sudden and unaccountable changes of mood or behavior.' },
  { word: 'deference', partOfSpeech: 'noun', phonetic: 'DEF-er-uhns', definition: 'Humble submission and respect.' },
  { word: 'ebullient', partOfSpeech: 'adjective', phonetic: 'ih-BUL-yuhnt', definition: 'Cheerful and full of energy.' },
  { word: 'fastidious', partOfSpeech: 'adjective', phonetic: 'fa-STID-ee-uhs', definition: 'Very attentive to accuracy and detail; hard to please.' },
  { word: 'gregarious', partOfSpeech: 'adjective', phonetic: 'gruh-GAIR-ee-uhs', definition: 'Fond of company; sociable.' },
  { word: 'hackneyed', partOfSpeech: 'adjective', phonetic: 'HAK-need', definition: 'Lacking originality or freshness; overused.' },
  { word: 'impetuous', partOfSpeech: 'adjective', phonetic: 'im-PECH-oo-uhs', definition: 'Acting or done quickly and without thought or care.' },
  { word: 'juxtapose', partOfSpeech: 'verb', phonetic: 'JUHK-stuh-pohz', definition: 'To place close together for the purpose of comparison or contrast.' },
  { word: 'laconic', partOfSpeech: 'adjective', phonetic: 'luh-KON-ik', definition: 'Using very few words; concise to the point of terseness.' },
  { word: 'malleable', partOfSpeech: 'adjective', phonetic: 'MAL-ee-uh-buhl', definition: 'Easily influenced or shaped; able to be pressed into shape without breaking.' },
  { word: 'nostalgia', partOfSpeech: 'noun', phonetic: 'no-STAL-juh', definition: 'A sentimental longing for the past.' },
  { word: 'obsequious', partOfSpeech: 'adjective', phonetic: 'uhb-SEE-kwee-uhs', definition: 'Obedient or attentive to an excessive, servile degree.' },
  { word: 'perfunctory', partOfSpeech: 'adjective', phonetic: 'per-FUHNK-tuh-ree', definition: 'Carried out with minimum effort or reflection; done routinely.' },
  { word: 'quixotic', partOfSpeech: 'adjective', phonetic: 'kwik-SOT-ik', definition: 'Exceedingly idealistic; unrealistic and impractical.' },
  { word: 'recalcitrant', partOfSpeech: 'adjective', phonetic: 'rih-KAL-si-truhnt', definition: 'Having an obstinately uncooperative attitude toward authority.' },
  { word: 'superfluous', partOfSpeech: 'adjective', phonetic: 'soo-PUR-floo-uhs', definition: 'Unnecessary, especially through being more than enough.' },
  { word: 'tenuous', partOfSpeech: 'adjective', phonetic: 'TEN-yoo-uhs', definition: 'Very weak or slight; barely holding together.' },
  { word: 'vociferous', partOfSpeech: 'adjective', phonetic: 'voh-SIF-er-uhs', definition: 'Vehement or clamorous; loud and forceful in expressing opinion.' },
  { word: 'winsome', partOfSpeech: 'adjective', phonetic: 'WIN-suhm', definition: 'Attractive or appealing in appearance or character.' },
  { word: 'aberration', partOfSpeech: 'noun', phonetic: 'ab-uh-RAY-shuhn', definition: 'A departure from what is normal or expected.' },
  { word: 'bolster', partOfSpeech: 'verb', phonetic: 'BOHL-ster', definition: 'To support or strengthen.' },
  { word: 'conundrum', partOfSpeech: 'noun', phonetic: 'kuh-NUHN-druhm', definition: 'A confusing and difficult problem or question.' },
  { word: 'diligent', partOfSpeech: 'adjective', phonetic: 'DIL-i-juhnt', definition: 'Showing care and conscientious effort in one’s work or duties.' },
  { word: 'elusive', partOfSpeech: 'adjective', phonetic: 'ih-LOO-siv', definition: 'Difficult to find, catch, or achieve.' },
  { word: 'frugal', partOfSpeech: 'adjective', phonetic: 'FROO-guhl', definition: 'Sparing or economical with money or resources.' },
  { word: 'gravitate', partOfSpeech: 'verb', phonetic: 'GRAV-i-tayt', definition: 'To move toward or be attracted to something.' },
  { word: 'hyperbole', partOfSpeech: 'noun', phonetic: 'hy-PUR-buh-lee', definition: 'Exaggerated statements or claims not meant to be taken literally.' },
  { word: 'innocuous', partOfSpeech: 'adjective', phonetic: 'ih-NOK-yoo-uhs', definition: 'Not harmful or offensive.' },
  { word: 'lucid', partOfSpeech: 'adjective', phonetic: 'LOO-sid', definition: 'Expressed clearly; easy to understand.' },
]

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').trim()
}

async function fetchDictionaryEntry(word: string): Promise<VocabWordDraft | null> {
  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 6000)
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: controller.signal,
    })
    window.clearTimeout(timeout)
    if (!res.ok) return null
    const data = await res.json()
    const entry = Array.isArray(data) ? data[0] : null
    if (!entry) return null

    const phonetic: string =
      entry.phonetic || (entry.phonetics || []).find((p: { text?: string }) => p.text)?.text || ''
    const audioUrl: string | null =
      (entry.phonetics || []).find((p: { audio?: string }) => p.audio)?.audio || null
    const meaning = (entry.meanings || [])[0]
    const def = meaning?.definitions?.[0]
    if (!meaning || !def) return null

    return {
      word: entry.word || word,
      partOfSpeech: meaning.partOfSpeech || '',
      phonetic: stripHtml(phonetic),
      definition: stripHtml(def.definition || ''),
      example: def.example ? stripHtml(def.example) : null,
      audioUrl: audioUrl ? (audioUrl.startsWith('http') ? audioUrl : `https:${audioUrl}`) : null,
      source: 'Free Dictionary API',
    }
  } catch {
    return null
  }
}

function draftFromLocal(entry: WordEntry): VocabWordDraft {
  return {
    word: entry.word,
    partOfSpeech: entry.partOfSpeech,
    phonetic: entry.phonetic,
    definition: entry.definition,
    example: null,
    audioUrl: null,
    source: 'SAT Word List',
  }
}

/** A word chosen for a given local calendar date is stable for everyone who
 * opens the app that day, using a simple deterministic hash of the date. */
function dailyIndices(count: number, poolSize: number): number[] {
  const d = new Date()
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  let seed = 0
  for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0
  if (seed === 0) seed = 1

  const indices: number[] = []
  let x = seed
  while (indices.length < count && indices.length < poolSize) {
    x = (x * 1103515245 + 12345) >>> 0
    const idx = x % poolSize
    if (!indices.includes(idx)) indices.push(idx)
  }
  return indices
}

/** Today's word set: a stable local pick, enriched with a live dictionary
 * lookup when possible and falling back to the bundled definition/phonetic
 * when offline or the API is unavailable. */
export async function getWordsOfTheDay(count = 3): Promise<VocabWordDraft[]> {
  const indices = dailyIndices(count, SAT_WORD_BANK.length)
  const drafts = await Promise.all(
    indices.map(async (i) => {
      const local = SAT_WORD_BANK[i]
      const live = await fetchDictionaryEntry(local.word)
      if (!live) return draftFromLocal(local)
      return {
        ...live,
        phonetic: live.phonetic || local.phonetic,
        definition: live.definition || local.definition,
      }
    })
  )
  return drafts
}

const RANDOM_WORD_API = 'https://random-word-api.herokuapp.com/word?number=10'

/** Polls a genuinely different online source (a random-word generator) for
 * fresh words, looks each one up in the dictionary API, and tops up from
 * the local bank if the online sources come up short or are unreachable. */
export async function pollFreshWords(count = 2): Promise<VocabWordDraft[]> {
  const results: VocabWordDraft[] = []

  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 6000)
    const res = await fetch(RANDOM_WORD_API, { signal: controller.signal })
    window.clearTimeout(timeout)
    if (res.ok) {
      const words: string[] = await res.json()
      for (const w of words) {
        if (results.length >= count) break
        if (!/^[a-zA-Z]{4,}$/.test(w)) continue
        const live = await fetchDictionaryEntry(w.toLowerCase())
        if (live) results.push({ ...live, source: 'Random Word API' })
      }
    }
  } catch {
    // fall through to the local top-up below
  }

  if (results.length < count) {
    const used = new Set(results.map((r) => r.word.toLowerCase()))
    const pool = SAT_WORD_BANK.filter((w) => !used.has(w.word.toLowerCase()))
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    for (const entry of pool) {
      if (results.length >= count) break
      results.push(draftFromLocal(entry))
    }
  }

  return results
}
