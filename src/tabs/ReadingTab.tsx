import { useEffect, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { fetchAllFeeds, SEED_READING_ITEMS } from '../lib/feeds'
import { refreshStories } from '../lib/stories'
import ReadingMode from '../components/ReadingMode'
import StoryReadingMode from '../components/StoryReadingMode'
import { ReadingItem, Story } from '../types'
import { useToast } from '../context/ToastContext'
import Icon from '../components/Icon'

type Filter = 'all' | 'saved' | 'read'

export default function ReadingTab() {
  const {
    state,
    addReadingItems,
    toggleReadingRead,
    toggleReadingSaved,
    removeReadingItem,
    addStories,
    toggleStoryRead,
    toggleStorySaved,
    removeStory,
  } = useAppData()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(false)
  const [storiesLoading, setStoriesLoading] = useState(false)
  const [opened, setOpened] = useState<ReadingItem | null>(null)
  const [openedStory, setOpenedStory] = useState<Story | null>(null)

  useEffect(() => {
    if (state.readingList.length === 0) {
      addReadingItems(SEED_READING_ITEMS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refresh() {
    setLoading(true)
    try {
      const { items, errors } = await fetchAllFeeds()
      if (items.length > 0) {
        addReadingItems(items)
        showToast(`Added ${items.length} articles${errors.length ? ` (${errors.join(', ')} unavailable)` : ''}`)
      } else {
        showToast('Could not reach reading sources right now — try again later.')
      }
    } catch {
      showToast('Something went wrong fetching articles.')
    } finally {
      setLoading(false)
    }
  }

  async function refreshStoryList() {
    setStoriesLoading(true)
    try {
      const existingSources = new Set(state.stories.map((s) => s.source.toLowerCase()))
      // refreshStories() already times out each network call it makes, but
      // this is a hard backstop: whatever happens underneath, the button
      // stops spinning within 35s instead of possibly hanging forever.
      const watchdog = new Promise<never>((_, reject) =>
        window.setTimeout(() => reject(new Error('Timed out reaching Project Gutenberg')), 35000)
      )
      const { items, errors } = await Promise.race([refreshStories(existingSources), watchdog])
      const uniqueErrors = [...new Set(errors)]
      if (items.length > 0) {
        addStories(items)
        showToast(`Added ${items.length} new stor${items.length === 1 ? 'y' : 'ies'}${uniqueErrors.length ? ` (${uniqueErrors.length} source${uniqueErrors.length === 1 ? '' : 's'} unavailable)` : ''}`)
      } else if (uniqueErrors.length > 0) {
        // Surface that sources actually failed rather than a generic
        // message — without this, a real network/proxy problem is
        // indistinguishable from "you already have everything," which makes
        // it impossible to tell what's actually wrong from a bug report.
        // The full list goes to the console (short, capped toast on screen).
        console.error('Story poll: every source failed:', uniqueErrors)
        showToast(`Couldn't reach any story source right now (${uniqueErrors.length} tried). Try again shortly.`)
      } else {
        showToast('No new stories right now — you may already have them all. Try again in a bit for more.')
      }
    } catch (e) {
      console.error('Story poll failed:', e)
      showToast(`Something went wrong fetching stories${e instanceof Error ? `: ${e.message}` : ''}.`)
    } finally {
      setStoriesLoading(false)
    }
  }

  const list = state.readingList.filter((r) => {
    if (filter === 'saved') return r.saved
    if (filter === 'read') return r.read
    return true
  })

  return (
    <div>
      <div className="tabs-inline">
        {(['all', 'saved', 'read'] as Filter[]).map((f) => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f === 'all' ? 'For You' : f === 'saved' ? 'Saved' : 'Read'}
          </button>
        ))}
      </div>

      <button className="btn btn-secondary btn-block" style={{ marginBottom: 16 }} onClick={refresh} disabled={loading}>
        <Icon name="refresh" size={16} strokeWidth={2} />
        {loading ? 'Fetching new essays…' : 'Refresh from Aeon & friends'}
      </button>

      {list.length === 0 ? (
        <div className="card empty-state">
          <div className="glyph">
            <Icon name="bookOpen" size={34} strokeWidth={1.4} />
          </div>
          <div>Nothing here yet.</div>
        </div>
      ) : (
        list.map((item) => (
          <div className="card reading-card" key={item.id} onClick={() => setOpened(item)}>
            <div className="source">{item.source}</div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <div className="row" style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
              <button
                className="pill"
                style={{ border: 'none', cursor: 'pointer' }}
                onClick={() => toggleReadingSaved(item.id)}
              >
                <Icon name={item.saved ? 'star' : 'starOutline'} size={13} strokeWidth={2} />
                {item.saved ? 'Saved' : 'Save'}
              </button>
              <button
                className="pill"
                style={{ border: 'none', cursor: 'pointer' }}
                onClick={() => toggleReadingRead(item.id)}
              >
                {item.read && <Icon name="check" size={13} strokeWidth={2.4} />}
                {item.read ? 'Read' : 'Mark read'}
              </button>
              <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={() => removeReadingItem(item.id)}>
                ✕
              </button>
            </div>
          </div>
        ))
      )}

      {opened && (
        <ReadingMode
          item={opened}
          onClose={() => {
            if (!opened.read) toggleReadingRead(opened.id)
            setOpened(null)
          }}
        />
      )}

      <div className="section-title">Detective Stories</div>
      <button
        className="btn btn-secondary btn-block"
        style={{ marginBottom: 16 }}
        onClick={refreshStoryList}
        disabled={storiesLoading}
      >
        <Icon name="refresh" size={16} strokeWidth={2} />
        {storiesLoading ? 'Polling Project Gutenberg…' : 'Poll for new stories'}
      </button>

      {state.stories.length === 0 ? (
        <div className="card empty-state">
          <div className="glyph">
            <Icon name="compass" size={34} strokeWidth={1.4} />
          </div>
          <div>
            Classic public-domain detective fiction — Sherlock Holmes, Hercule Poirot and more — fetched live from Project
            Gutenberg. Tap "Poll for new stories" above to get started.
          </div>
        </div>
      ) : (
        state.stories.map((story) => (
          <div className="card reading-card" key={story.id} onClick={() => setOpenedStory(story)}>
            <div className="source">
              {story.author} · {story.source}
            </div>
            <h3>{story.title}</h3>
            <div className="row" style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
              <button className="pill" style={{ border: 'none', cursor: 'pointer' }} onClick={() => toggleStorySaved(story.id)}>
                <Icon name={story.saved ? 'star' : 'starOutline'} size={13} strokeWidth={2} />
                {story.saved ? 'Saved' : 'Save'}
              </button>
              <button className="pill" style={{ border: 'none', cursor: 'pointer' }} onClick={() => toggleStoryRead(story.id)}>
                {story.read && <Icon name="check" size={13} strokeWidth={2.4} />}
                {story.read ? 'Read' : 'Mark read'}
              </button>
              <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={() => removeStory(story.id)}>
                ✕
              </button>
            </div>
          </div>
        ))
      )}

      {openedStory && (
        <StoryReadingMode
          story={openedStory}
          onClose={() => {
            if (!openedStory.read) toggleStoryRead(openedStory.id)
            setOpenedStory(null)
          }}
        />
      )}
    </div>
  )
}
