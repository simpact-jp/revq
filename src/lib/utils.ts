/**
 * Generate a random short code for URLs
 */
export function generateShortCode(length = 7): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789' // no confusing chars (0/O, 1/l)
  const arr = new Uint8Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => chars[b % chars.length]).join('')
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTPCode(): string {
  const arr = new Uint8Array(3)
  crypto.getRandomValues(arr)
  const num = ((arr[0] << 16) | (arr[1] << 8) | arr[2]) % 1000000
  return num.toString().padStart(6, '0')
}

/**
 * Create a simple JWT (HMAC-SHA256)
 */
export async function createJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const body = btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 * 7 }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${body}`))
  const sigStr = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  return `${header}.${body}.${sigStr}`
}

/**
 * Verify a JWT and return payload
 */
export async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    
    // Restore base64
    const sigB64 = parts[2].replace(/-/g, '+').replace(/_/g, '/')
    const sigPadded = sigB64 + '='.repeat((4 - sigB64.length % 4) % 4)
    const sigBytes = Uint8Array.from(atob(sigPadded), c => c.charCodeAt(0))
    
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(`${parts[0]}.${parts[1]}`))
    if (!valid) return null

    const bodyB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const bodyPadded = bodyB64 + '='.repeat((4 - bodyB64.length % 4) % 4)
    const payload = JSON.parse(atob(bodyPadded))

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}
