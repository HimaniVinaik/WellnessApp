import { useState } from 'react'
import { AppDataProvider } from './context/AppDataContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import TabBar, { TabKey } from './components/TabBar'
import Header from './components/Header'
import HabitsTab from './tabs/HabitsTab'
import SkillsTab from './tabs/SkillsTab'
import GamesTab from './tabs/GamesTab'
import MeditationTab from './tabs/MeditationTab'
import ReadingTab from './tabs/ReadingTab'
import ProfileTab from './tabs/ProfileTab'

function TabContent({ tab }: { tab: TabKey }) {
  switch (tab) {
    case 'habits':
      return <HabitsTab />
    case 'skills':
      return <SkillsTab />
    case 'games':
      return <GamesTab />
    case 'meditate':
      return <MeditationTab />
    case 'reading':
      return <ReadingTab />
    case 'profile':
      return <ProfileTab />
    default:
      return null
  }
}

export default function App() {
  const [tab, setTab] = useState<TabKey>('habits')

  return (
    <ThemeProvider>
      <AppDataProvider>
        <ToastProvider>
          <div className="app-shell">
            <Header tab={tab} />
            <main className="main-content">
              <TabContent tab={tab} />
            </main>
            <TabBar active={tab} onChange={setTab} />
          </div>
        </ToastProvider>
      </AppDataProvider>
    </ThemeProvider>
  )
}
