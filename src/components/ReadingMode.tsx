import { ReadingItem } from '../types'

export default function ReadingMode({ item, onClose }: { item: ReadingItem; onClose: () => void }) {
  const paragraphs = item.summary.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean)

  return (
    <div className="reading-mode">
      <button className="close-btn" onClick={onClose}>
        ← Back
      </button>
      <div className="r-source">{item.source}</div>
      <h1>{item.title}</h1>
      <div className="r-body">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>No preview available for this piece yet — read it in full on the source site.</p>
        )}
        <a className="r-link" href={item.url} target="_blank" rel="noreferrer">
          Read the full essay on {item.source} →
        </a>
      </div>
    </div>
  )
}
