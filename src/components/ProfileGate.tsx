import { useEffect, useState } from 'react'
import {
  Profile,
  clearActiveProfileId,
  clearLegacyData,
  createProfile,
  getActiveProfileId,
  hasLegacyUnencryptedData,
  loadEncryptedBlob,
  loadProfiles,
  loadRememberedPassphrase,
  readLegacyPlainState,
  readLegacySyncConfig,
  rememberPassphrase,
  saveEncryptedBlob,
  saveProfileSyncConfig,
  setActiveProfileId,
} from '../lib/profiles'
import { decryptText, encryptText } from '../lib/crypto'
import { AppState, emptyState } from '../types'
import Icon from '../components/Icon'

type Mode = 'loading' | 'picker' | 'create' | 'unlock' | 'migrate'

export default function ProfileGate({
  onUnlocked,
}: {
  onUnlocked: (profile: Profile, passphrase: string, state: AppState) => void
}) {
  const [mode, setMode] = useState<Mode>('loading')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selected, setSelected] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const list = loadProfiles()
    setProfiles(list)

    if (hasLegacyUnencryptedData()) {
      setMode('migrate')
      return
    }

    const activeId = getActiveProfileId()
    const active = list.find((p) => p.id === activeId) ?? null
    if (active) {
      const remembered = loadRememberedPassphrase(active.id)
      if (remembered) {
        tryUnlock(active, remembered, true)
        return
      }
      setSelected(active)
      setMode('unlock')
      return
    }

    setMode(list.length > 0 ? 'picker' : 'create')
  }, [])

  async function tryUnlock(profile: Profile, passphrase: string, silent = false) {
    setBusy(true)
    setError('')
    try {
      const blob = loadEncryptedBlob(profile.id)
      const state = blob ? { ...emptyState(), ...JSON.parse(await decryptText(blob, passphrase)) } : emptyState()
      setActiveProfileId(profile.id)
      onUnlocked(profile, passphrase, state)
    } catch {
      if (!silent) setError('Incorrect passphrase — try again.')
      setSelected(profile)
      setMode('unlock')
    } finally {
      setBusy(false)
    }
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError('Give your profile a name.')
      return
    }
    if (pass.length < 4) {
      setError('Passphrase must be at least 4 characters.')
      return
    }
    if (pass !== confirmPass) {
      setError('Passphrases do not match.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const profile = createProfile(name.trim())
      const initial = emptyState()
      const ciphertext = await encryptText(JSON.stringify(initial), pass)
      saveEncryptedBlob(profile.id, ciphertext)
      setActiveProfileId(profile.id)
      if (remember) rememberPassphrase(profile.id, pass)
      onUnlocked(profile, pass, initial)
    } catch {
      setError('Something went wrong creating your profile.')
      setBusy(false)
    }
  }

  async function handleUnlockSubmit() {
    if (!selected) return
    if (!pass) {
      setError('Enter your passphrase.')
      return
    }
    await tryUnlock(selected, pass)
    if (remember) rememberPassphrase(selected.id, pass)
  }

  async function handleMigrate() {
    if (!name.trim()) {
      setError('Give your profile a name.')
      return
    }
    if (pass.length < 4) {
      setError('Passphrase must be at least 4 characters.')
      return
    }
    if (pass !== confirmPass) {
      setError('Passphrases do not match.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const legacyRaw = readLegacyPlainState()
      const legacyState: AppState = { ...emptyState(), ...(legacyRaw ? JSON.parse(legacyRaw) : {}) }
      const profile = createProfile(name.trim())
      const ciphertext = await encryptText(JSON.stringify(legacyState), pass)
      saveEncryptedBlob(profile.id, ciphertext)
      const legacySync = readLegacySyncConfig()
      if (legacySync) saveProfileSyncConfig(profile.id, legacySync)
      clearLegacyData()
      setActiveProfileId(profile.id)
      if (remember) rememberPassphrase(profile.id, pass)
      onUnlocked(profile, pass, legacyState)
    } catch {
      setError('Something went wrong securing your data.')
      setBusy(false)
    }
  }

  function backToPicker() {
    clearActiveProfileId()
    setSelected(null)
    setPass('')
    setConfirmPass('')
    setError('')
    setMode(profiles.length > 0 ? 'picker' : 'create')
  }

  const shell = (children: React.ReactNode) => (
    <div className="app-shell">
      <div className="main-content" style={{ paddingTop: 'calc(var(--safe-top) + 60px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ color: 'var(--primary)', display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Icon name="mountain" size={36} strokeWidth={1.4} />
          </div>
          <h1 style={{ margin: 0, fontSize: 21 }}>Mental Wellness</h1>
        </div>
        {children}
      </div>
    </div>
  )

  if (mode === 'loading') return shell(null)

  if (mode === 'migrate') {
    return shell(
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Secure your data</h2>
        <p className="hint">
          We found data on this device from before profiles existed. Give it a name and a passphrase — your data (and
          any GitHub backup) will be encrypted with it from now on.
        </p>
        <div className="field">
          <label className="field-label">Your name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex" />
        </div>
        <div className="field">
          <label className="field-label">Choose a passphrase</label>
          <input className="input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Confirm passphrase</label>
          <input className="input" type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
        </div>
        <label className="hint" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember passphrase on this device
        </label>
        {error && <div className="hint" style={{ color: 'var(--danger)', marginBottom: 10 }}>{error}</div>}
        <button className="btn btn-primary btn-block" onClick={handleMigrate} disabled={busy}>
          {busy ? 'Securing your data…' : 'Secure my data'}
        </button>
      </div>
    )
  }

  if (mode === 'picker') {
    return shell(
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Who's this?</h2>
        {profiles.map((p) => (
          <button
            key={p.id}
            className="btn btn-secondary btn-block"
            style={{ marginBottom: 10, justifyContent: 'flex-start' }}
            onClick={() => {
              setSelected(p)
              setPass('')
              setError('')
              setMode('unlock')
            }}
          >
            {p.name}
          </button>
        ))}
        <button className="btn btn-ghost btn-block" onClick={() => { setName(''); setPass(''); setConfirmPass(''); setError(''); setMode('create') }}>
          + New profile
        </button>
      </div>
    )
  }

  if (mode === 'unlock' && selected) {
    return shell(
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Welcome back, {selected.name}</h2>
        <p className="hint">Enter your passphrase to unlock your data.</p>
        <div className="field">
          <label className="field-label">Passphrase</label>
          <input
            className="input"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlockSubmit()}
            autoFocus
          />
        </div>
        <label className="hint" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember passphrase on this device
        </label>
        {error && <div className="hint" style={{ color: 'var(--danger)', marginBottom: 10 }}>{error}</div>}
        <button className="btn btn-primary btn-block" onClick={handleUnlockSubmit} disabled={busy}>
          {busy ? 'Unlocking…' : 'Unlock'}
        </button>
        {profiles.length > 1 && (
          <button className="btn btn-ghost btn-block" onClick={backToPicker}>
            Switch profile
          </button>
        )}
      </div>
    )
  }

  return shell(
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Create your profile</h2>
      <p className="hint">
        Your passphrase encrypts your data on this device and in any GitHub backup — only you know it, and it can't be
        recovered if lost.
      </p>
      <div className="field">
        <label className="field-label">Your name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex" />
      </div>
      <div className="field">
        <label className="field-label">Choose a passphrase</label>
        <input className="input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
      </div>
      <div className="field">
        <label className="field-label">Confirm passphrase</label>
        <input className="input" type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
      </div>
      <label className="hint" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        Remember passphrase on this device
      </label>
      {error && <div className="hint" style={{ color: 'var(--danger)', marginBottom: 10 }}>{error}</div>}
      <button className="btn btn-primary btn-block" onClick={handleCreate} disabled={busy}>
        {busy ? 'Creating…' : 'Create profile'}
      </button>
      {profiles.length > 0 && (
        <button className="btn btn-ghost btn-block" onClick={backToPicker}>
          Back
        </button>
      )}
    </div>
  )
}
