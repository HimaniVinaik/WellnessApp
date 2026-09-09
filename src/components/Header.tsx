import { useAppData } from '../context/AppDataContext'

const TITLES: Record<string, string> = {
  habits: 'Habits & To-dos',
  skills: 'Skill Mastery',
  games: 'Brain Training',
  meditate: 'Meditation',
  reading: 'Reading Room',
  profile: 'Your Journey',
}

export default function Header({ tab }: { tab: string }) {
  const { points, level } = useAppData()
  return (
    <header className="app-header">
      <h1>{TITLES[tab] ?? 'Mental Wellness'}</h1>
      <div className="level-chip" style={{ ['--pct' as any]: level.percent }}>
        <div className="ring">
          <span>{level.level}</span>
        </div>
        <div>
          <div className="label">{level.name}</div>
          <div className="sub">{points} pts</div>
        </div>
      </div>
    </header>
  )
}
