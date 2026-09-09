import Icon, { IconName } from './Icon'

export type TabKey = 'habits' | 'skills' | 'games' | 'meditate' | 'reading' | 'profile'

const TABS: { key: TabKey; label: string; icon: IconName }[] = [
  { key: 'habits', label: 'Habits', icon: 'checkSquare' },
  { key: 'skills', label: 'Skills', icon: 'target' },
  { key: 'games', label: 'Games', icon: 'network' },
  { key: 'meditate', label: 'Meditate', icon: 'sun' },
  { key: 'reading', label: 'Reading', icon: 'bookOpen' },
  { key: 'profile', label: 'Profile', icon: 'compass' },
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
          <Icon name={t.icon} size={22} strokeWidth={active === t.key ? 2.1 : 1.7} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
