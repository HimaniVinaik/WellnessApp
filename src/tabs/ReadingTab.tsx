import { useEffect, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { fetchAllFeeds, SEED_READING_ITEMS } from '../lib/feeds'
import ReadingMode from '../components/ReadingMode'
import { ReadingItem } from '../types'
import { useToast } from '../context/ToastContext'
import Icon from '../components/Icon'

type Filter = 'all' | 'saved' | 'read'

export default function ReadingTab() {
  const { state, addReadingItems, toggleReadingRead, toggleReadingSaved, removeReadingItem } = useAppData()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(false)
  const [opened, setOpened] = useState<ReadingItem | null>(null)

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
    </div>
  )
}
