export type TabKey = 'habits' | 'skills' | 'games' | 'meditate' | 'reading' | 'profile'

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'habits', label: 'Habits', icon: '✅' },
  { key: 'skills', label: 'Skills', icon: '🌱' },
  { key: 'games', label: 'Games', icon: '🧠' },
  { key: 'meditate', label: 'Meditate', icon: '🌤️' },
  { key: 'reading', label: 'Reading', icon: '📖' },
  { key: 'profile', label: 'Profile', icon: '🏔️' },
]

export default function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <nav className="tab-bar">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`tab-btn ${active === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          <span className="icon">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
