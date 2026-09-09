import { GithubSyncConfig } from '../types'

export interface Profile {
  id: string
  name: string
  createdAt: string
}

const PROFILES_KEY = 'mw.profiles.v1'
const ACTIVE_PROFILE_KEY = 'mw.activeProfile.v1'

const LEGACY_STATE_KEY = 'mw.state.v1'
const LEGACY_SYNC_KEY = 'mw.syncConfig.v1'
const LEGACY_PASSPHRASE_KEY = 'mw.passphrase.v1'

function stateKey(id: string) {
  return `mw.profileState.${id}.v1`
}
function passphraseKey(id: string) {
  return `mw.profilePass.${id}.v1`
}
function syncKey(id: string) {
  return `mw.profileSync.${id}.v1`
}

function makeProfileId(): string {
  const rand = 'randomUUID' in crypto ? crypto.randomUUID().replace(/-/g, '').slice(0, 12) : Math.random().toString(36).slice(2, 14)
  return `p_${rand}`
}

export function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

export function createProfile(name: string): Profile {
  const profile: Profile = { id: makeProfileId(), name: name.trim(), createdAt: new Date().toISOString() }
  saveProfiles([...loadProfiles(), profile])
  return profile
}

export function deleteProfile(id: string) {
  saveProfiles(loadProfiles().filter((p) => p.id !== id))
  localStorage.removeItem(stateKey(id))
  localStorage.removeItem(passphraseKey(id))
  localStorage.removeItem(syncKey(id))
  if (getActiveProfileId() === id) clearActiveProfileId()
}

export function getActiveProfileId(): string | null {
  return localStorage.getItem(ACTIVE_PROFILE_KEY)
}

export function setActiveProfileId(id: string) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id)
}

export function clearActiveProfileId() {
  localStorage.removeItem(ACTIVE_PROFILE_KEY)
}

export function loadEncryptedBlob(id: string): string | null {
  return localStorage.getItem(stateKey(id))
}

export function saveEncryptedBlob(id: string, ciphertext: string) {
  localStorage.setItem(stateKey(id), ciphertext)
}

export function loadRememberedPassphrase(id: string): string | null {
  return localStorage.getItem(passphraseKey(id))
}

export function rememberPassphrase(id: string, passphrase: string) {
  localStorage.setItem(passphraseKey(id), passphrase)
}

export function forgetPassphrase(id: string) {
  localStorage.removeItem(passphraseKey(id))
}

export function loadProfileSyncConfig(id: string): GithubSyncConfig | null {
  try {
    const raw = localStorage.getItem(syncKey(id))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveProfileSyncConfig(id: string, cfg: GithubSyncConfig) {
  localStorage.setItem(syncKey(id), JSON.stringify(cfg))
}

export function defaultSyncPath(profileName: string, profileId: string): string {
  const slug =
    profileName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'profile'
  return `data/${slug}-${profileId.slice(2, 8)}.csv`
}

/** True when this browser has data from before multi-profile encryption
 * existed (a single unencrypted local dataset) and no profiles yet — the
 * one-time migration screen should run instead of the normal picker. */
export function hasLegacyUnencryptedData(): boolean {
  return loadProfiles().length === 0 && localStorage.getItem(LEGACY_STATE_KEY) !== null
}

export function readLegacyPlainState(): string | null {
  return localStorage.getItem(LEGACY_STATE_KEY)
}

export function readLegacySyncConfig(): GithubSyncConfig | null {
  try {
    const raw = localStorage.getItem(LEGACY_SYNC_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearLegacyData() {
  localStorage.removeItem(LEGACY_STATE_KEY)
  localStorage.removeItem(LEGACY_SYNC_KEY)
  localStorage.removeItem(LEGACY_PASSPHRASE_KEY)
}
