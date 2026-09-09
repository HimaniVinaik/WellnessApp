import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../context/ToastContext'
import { verifyAccess } from '../lib/github'
import { loadRememberedPassphrase, rememberPassphrase, forgetPassphrase } from '../lib/storage'
import { LevelDef, POINTS_PER_LEVEL } from '../types'

function LevelEditor() {
  const { state, setLevels, level } = useAppData()
  const [levels, setLocalLevels] = useState<LevelDef[]>(state.levels)

  function updateName(lvl: number, name: string) {
    const next = levels.some((l) => l.level === lvl)
      ? levels.map((l) => (l.level === lvl ? { ...l, name } : l))
      : [...levels, { level: lvl, name }]
    next.sort((a, b) => a.level - b.level)
    setLocalLevels(next)
    setLevels(next)
  }

  function addLevel() {
    const nextNum = Math.max(0, ...levels.map((l) => l.level)) + 1
    const next = [...levels, { level: nextNum, name: `Level ${nextNum}` }]
    setLocalLevels(next)
    setLevels(next)
  }

  const highestDefined = Math.max(0, ...levels.map((l) => l.level))

  return (
    <div className="card">
      <div className="hint" style={{ marginBottom: 10 }}>
        Every {POINTS_PER_LEVEL} points levels you up. Name each level whatever motivates you — you're currently{' '}
        <b>{level.name}</b>.
      </div>
      {levels
        .sort((a, b) => a.level - b.level)
        .map((l) => (
          <div className="level-editor-row" key={l.level}>
            <span className="lvl-num">Lv {l.level}</span>
            <input className="input" value={l.name} onChange={(e) => updateName(l.level, e.target.value)} />
          </div>
        ))}
      {highestDefined <= level.level + 3 && (
        <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={addLevel}>
          + Add next level name
        </button>
      )}
    </div>
  )
}

function GithubSyncCard() {
  const { syncConfig, setSyncConfig, pushToGithub, pullFromGithub } = useAppData()
  const { showToast } = useToast()
  const [owner, setOwner] = useState(syncConfig?.owner ?? '')
  const [repo, setRepo] = useState(syncConfig?.repo ?? '')
  const [branch, setBranch] = useState(syncConfig?.branch ?? 'main')
  const [path, setPath] = useState(syncConfig?.path ?? 'data/wellness-data.csv')
  const [token, setToken] = useState(syncConfig?.token ?? '')
  const [passphrase, setPassphrase] = useState(loadRememberedPassphrase() ?? '')
  const [remember, setRemember] = useState(!!loadRememberedPassphrase())
  const [busy, setBusy] = useState(false)

  function currentConfig() {
    return { owner: owner.trim(), repo: repo.trim(), branch: branch.trim() || 'main', path: path.trim(), token: token.trim() }
  }

  function persistConfig() {
    const cfg = currentConfig()
    setSyncConfig(cfg)
    if (remember) rememberPassphrase(passphrase)
    else forgetPassphrase()
    return cfg
  }

  async function handleTest() {
    setBusy(true)
    try {
      const cfg = persistConfig()
      const result = await verifyAccess(cfg)
      showToast(result.message)
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Connection failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handlePush() {
    if (!passphrase) {
      showToast('Enter an encryption passphrase first.')
      return
    }
    setBusy(true)
    try {
      persistConfig()
      const msg = await pushToGithub(passphrase)
      showToast(msg)
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handlePull() {
    if (!passphrase) {
      showToast('Enter your encryption passphrase first.')
      return
    }
    setBusy(true)
    try {
      persistConfig()
      const msg = await pullFromGithub(passphrase)
      showToast(msg)
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Load failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card">
      <p className="hint" style={{ marginTop: 0 }}>
        Your data is encrypted (AES-256) with a passphrase only you know, then committed as a CSV file to a GitHub
        repository you control. Your token and passphrase are stored only on this device and sent only to GitHub's
        API.
      </p>
      <div className="field">
        <label className="field-label">Repository owner</label>
        <input className="input" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="yourusername" />
      </div>
      <div className="field">
        <label className="field-label">Repository name</label>
        <input className="input" value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="WellnessApp" />
      </div>
      <div className="row">
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Branch</label>
          <input className="input" value={branch} onChange={(e) => setBranch(e.target.value)} />
        </div>
        <div className="field" style={{ flex: 2 }}>
          <label className="field-label">File path</label>
          <input className="input" value={path} onChange={(e) => setPath(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="field-label">Personal access token (repo scope)</label>
        <input className="input" type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_…" />
      </div>
      <div className="field">
        <label className="field-label">Encryption passphrase</label>
        <input
          className="input"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Only you know this"
        />
        <label className="hint" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember passphrase on this device
        </label>
      </div>
      <div className="row" style={{ marginBottom: 10 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleTest} disabled={busy || !owner || !repo || !token}>
          Test
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePush} disabled={busy || !owner || !repo || !token}>
          Save to GitHub
        </button>
      </div>
      <button className="btn btn-ghost btn-block" onClick={handlePull} disabled={busy || !owner || !repo || !token}>
        Load from GitHub
      </button>
    </div>
  )
}

export default function ProfileTab() {
  const { points, level, state, resetAllData } = useAppData()
  const [confirmReset, setConfirmReset] = useState(false)

  const habitsActive = state.habits.filter((h) => !h.archived).length
  const skillsMastered = state.skills.filter((s) => !!s.masteredAt).length
  const totalCheckIns = state.habits.reduce((n, h) => n + h.checkIns.length, 0) + state.skills.reduce((n, s) => n + s.checkIns.length, 0)

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44 }}>🏔️</div>
        <h2 style={{ margin: '4px 0 0' }}>{level.name}</h2>
        <div className="hint">Level {level.level}</div>
        <div className="progress-track" style={{ margin: '14px 0 6px' }}>
          <div className="progress-fill" style={{ width: `${level.percent}%` }} />
        </div>
        <div className="hint">
          {points} pts total · {level.pointsToNext} to next level
        </div>
      </div>

      <div className="stat-row card">
        <div className="stat">
          <b>{habitsActive}</b>
          <span>Habits</span>
        </div>
        <div className="stat">
          <b>{skillsMastered}</b>
          <span>Mastered</span>
        </div>
        <div className="stat">
          <b>{totalCheckIns}</b>
          <span>Check-ins</span>
        </div>
      </div>

      <div className="section-title">Levels</div>
      <LevelEditor />

      <div className="section-title">Backup to GitHub</div>
      <GithubSyncCard />

      <div className="section-title">Danger zone</div>
      <div className="card">
        {!confirmReset ? (
          <button className="btn btn-danger btn-block" onClick={() => setConfirmReset(true)}>
            Reset all data
          </button>
        ) : (
          <>
            <p className="hint" style={{ marginTop: 0 }}>
              This permanently deletes everything stored on this device. If you've saved to GitHub, you can load it
              back afterward.
            </p>
            <div className="row">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={resetAllData}>
                Confirm reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
