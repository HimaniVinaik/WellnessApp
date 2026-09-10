import { Story } from '../types'

export default function StoryReadingMode({ story, onClose }: { story: Story; onClose: () => void }) {
  const paragraphs = story.text.split(/\n\s*\n/).filter((p) => p.trim())

  return (
    <div className="reading-mode">
      <button className="close-btn" onClick={onClose}>
        ← Back
      </button>
      <div className="r-source">
        {story.author} · {story.source}
      </div>
      <h1>{story.title}</h1>
      <div className="r-body">
        {paragraphs.map((p, i) => (
          <p key={i}>{p.replace(/\s+/g, ' ').trim()}</p>
        ))}
        <a className="r-link" href={story.url} target="_blank" rel="noreferrer">
          View the original on Project Gutenberg →
        </a>
      </div>
    </div>
  )
}
