import { GithubSyncConfig } from '../types'

const API = 'https://api.github.com'

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function fromBase64Utf8(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export interface GithubFile {
  content: string
  sha: string
}

export async function fetchFile(cfg: GithubSyncConfig): Promise<GithubFile | null> {
  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path)}?ref=${encodeURIComponent(
    cfg.branch
  )}`
  const res = await fetch(url, { headers: authHeaders(cfg.token) })
  if (res.status === 404) return null
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GitHub read failed (${res.status}): ${body || res.statusText}`)
  }
  const json = await res.json()
  return { content: fromBase64Utf8(json.content as string), sha: json.sha as string }
}

export async function putFile(cfg: GithubSyncConfig, content: string, message: string, sha?: string): Promise<void> {
  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path)}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(cfg.token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: toBase64Utf8(content),
      branch: cfg.branch,
      ...(sha ? { sha } : {}),
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GitHub write failed (${res.status}): ${body || res.statusText}`)
  }
}

export async function verifyAccess(cfg: GithubSyncConfig): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${API}/repos/${cfg.owner}/${cfg.repo}`, { headers: authHeaders(cfg.token) })
  if (res.status === 404) return { ok: false, message: 'Repository not found, or token lacks access.' }
  if (res.status === 401) return { ok: false, message: 'Invalid or expired token.' }
  if (!res.ok) return { ok: false, message: `Unexpected error (${res.status}).` }
  const json = await res.json()
  const canPush = json?.permissions?.push
  if (!canPush) return { ok: false, message: 'Token/repo is reachable, but this token cannot push to it.' }
  return { ok: true, message: `Connected to ${cfg.owner}/${cfg.repo}.` }
}
