// Simple, real AES-GCM encryption using the browser's Web Crypto API.
// A passphrase is stretched into a key with PBKDF2, and a random salt/IV
// are prepended to the ciphertext so decryption never needs extra state.

const ENC = new TextEncoder()
const DEC = new TextDecoder()

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey('raw', ENC.encode(passphrase), 'PBKDF2', false, [
    'deriveKey',
  ])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 150_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

const MAGIC = 'MWv1'

/** Encrypts plaintext into a self-contained base64 string: MAGIC.salt.iv.ciphertext */
export async function encryptText(plaintext: string, passphrase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, ENC.encode(plaintext))
  const cipher = new Uint8Array(cipherBuf)
  return [MAGIC, toBase64(salt), toBase64(iv), toBase64(cipher)].join('.')
}

export async function decryptText(payload: string, passphrase: string): Promise<string> {
  const parts = payload.trim().split('.')
  if (parts.length !== 4 || parts[0] !== MAGIC) {
    throw new Error('Unrecognized or corrupted encrypted payload.')
  }
  const [, saltB64, ivB64, cipherB64] = parts
  const salt = fromBase64(saltB64)
  const iv = fromBase64(ivB64)
  const cipher = fromBase64(cipherB64)
  const key = await deriveKey(passphrase, salt)
  try {
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, cipher as BufferSource)
    return DEC.decode(plainBuf)
  } catch {
    throw new Error('Could not decrypt — wrong passphrase or corrupted data.')
  }
}
