import { AppState, GithubSyncConfig, emptyState } from '../types'

const STATE_KEY = 'mw.state.v1'
const SYNC_CONFIG_KEY = 'mw.syncConfig.v1'
const PASSPHRASE_KEY = 'mw.passphrase.v1'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    return { ...emptyState(), ...parsed }
  } catch {
    return emptyState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STATE_KEY, JSON.stringify(state))
}

export function loadSyncConfig(): GithubSyncConfig | null {
  try {
    const raw = localStorage.getItem(SYNC_CONFIG_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSyncConfig(cfg: GithubSyncConfig): void {
  localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(cfg))
}

export function clearSyncConfig(): void {
  localStorage.removeItem(SYNC_CONFIG_KEY)
}

export function loadRememberedPassphrase(): string | null {
  return localStorage.getItem(PASSPHRASE_KEY)
}

export function rememberPassphrase(passphrase: string): void {
  localStorage.setItem(PASSPHRASE_KEY, passphrase)
}

export function forgetPassphrase(): void {
  localStorage.removeItem(PASSPHRASE_KEY)
}
