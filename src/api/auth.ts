import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { Bindings } from '../lib/types'
import { generateOTPCode, createJWT, verifyJWT } from '../lib/utils'

const JWT_SECRET_DEFAULT = 'revuq-dev-secret-change-in-production'

const auth = new Hono<{ Bindings: Bindings }>()

/**
 * POST /api/auth/send-code
 * Send OTP code to email (in prototype: just stores in DB, no actual email sent)
 */
auth.post('/send-code', async (c) => {
  const { email } = await c.req.json<{ email: string }>()
  if (!email || !email.includes('@')) {
    return c.json({ error: 'メールアドレスが無効です' }, 400)
  }

  const code = generateOTPCode()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 min

  // Invalidate previous codes
  await c.env.DB.prepare('UPDATE otps SET used = 1 WHERE email = ? AND used = 0')
    .bind(email).run()

  // Insert new code
  await c.env.DB.prepare('INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)')
    .bind(email, code, expiresAt).run()

  // TODO: Send email via Resend/SendGrid
  // For prototype, return the code in response (remove in production!)
  console.log(`[OTP] ${email} -> ${code}`)

  return c.json({
    success: true,
    message: 'コードを送信しました',
    // Remove this in production - only for prototype
    _debug_code: code,
  })
})

/**
 * POST /api/auth/verify
 * Verify OTP code and return JWT
 */
auth.post('/verify', async (c) => {
  const { email, code } = await c.req.json<{ email: string; code: string }>()
  if (!email || !code) {
    return c.json({ error: 'メールとコードを入力してください' }, 400)
  }

  // Find valid OTP
  const otp = await c.env.DB.prepare(
    'SELECT * FROM otps WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime(\'now\') ORDER BY id DESC LIMIT 1'
  ).bind(email, code).first()

  if (!otp) {
    return c.json({ error: 'コードが無効または期限切れです' }, 401)
  }

  // Mark OTP as used
  await c.env.DB.prepare('UPDATE otps SET used = 1 WHERE id = ?').bind(otp.id).run()

  // Upsert user
  let user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
  if (!user) {
    await c.env.DB.prepare('INSERT INTO users (email) VALUES (?)').bind(email).run()
    user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
  }

  // Update last login
  await c.env.DB.prepare('UPDATE users SET last_login_at = datetime(\'now\') WHERE id = ?')
    .bind(user!.id).run()

  // Create JWT
  const secret = c.env.JWT_SECRET || JWT_SECRET_DEFAULT
  const token = await createJWT({ userId: user!.id, email }, secret)

  // Set cookie
  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return c.json({
    success: true,
    user: { id: user!.id, email: user!.email, name: user!.name, plan: user!.plan },
  })
})

/**
 * GET /api/auth/me
 * Get current user from JWT cookie
 */
auth.get('/me', async (c) => {
  const token = getCookie(c, 'token')
  if (!token) {
    return c.json({ user: null })
  }

  const secret = c.env.JWT_SECRET || JWT_SECRET_DEFAULT
  const payload = await verifyJWT(token, secret)
  if (!payload || !payload.userId) {
    return c.json({ user: null })
  }

  const user = await c.env.DB.prepare('SELECT id, email, name, plan FROM users WHERE id = ?')
    .bind(payload.userId).first()

  return c.json({ user: user || null })
})

/**
 * POST /api/auth/logout
 */
auth.post('/logout', async (c) => {
  deleteCookie(c, 'token', { path: '/' })
  return c.json({ success: true })
})

export default auth
