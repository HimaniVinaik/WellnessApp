import { useState } from 'react'
import { AppDataProvider } from './context/AppDataContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import ProfileGate from './components/ProfileGate'
import { Profile, clearActiveProfileId } from './lib/profiles'
import { AppState } from './types'
import TabBar, { TabKey } from './components/TabBar'
import Header from './components/Header'
import HabitsTab from './tabs/HabitsTab'
import FitnessTab from './tabs/FitnessTab'
import GamesTab from './tabs/GamesTab'
import MeditationTab from './tabs/MeditationTab'
import ReadingTab from './tabs/ReadingTab'
import ProfileTab from './tabs/ProfileTab'

function TabContent({ tab }: { tab: TabKey }) {
  switch (tab) {
    case 'habits':
      return <HabitsTab />
    case 'fitness':
      return <FitnessTab />
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

function MainShell() {
  const [tab, setTab] = useState<TabKey>('habits')
  return (
    <div className="app-shell">
      <Header tab={tab} />
      <main className="main-content">
        <TabContent tab={tab} />
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}

interface Session {
  profile: Profile
  passphrase: string
  initialState: AppState
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  function handleSignOut() {
    clearActiveProfileId()
    setSession(null)
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        {!session ? (
          <ProfileGate onUnlocked={(profile, passphrase, initialState) => setSession({ profile, passphrase, initialState })} />
        ) : (
          <AppDataProvider
            key={session.profile.id}
            profile={session.profile}
            passphrase={session.passphrase}
            initialState={session.initialState}
            onSignOut={handleSignOut}
          >
            <MainShell />
          </AppDataProvider>
        )}
      </ToastProvider>
    </ThemeProvider>
  )
}
