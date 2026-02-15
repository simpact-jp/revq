import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { Bindings } from '../lib/types'
import { generateOTPCode, createJWT, verifyJWT } from '../lib/utils'

const JWT_SECRET_DEFAULT = 'revq-dev-secret-change-in-production'

const auth = new Hono<{ Bindings: Bindings }>()

/**
 * Send OTP email via Resend API
 */
async function sendOTPEmail(
  email: string,
  code: string,
  apiKey: string | undefined,
  fromEmail: string | undefined,
  isRegistration: boolean = false
): Promise<boolean> {
  if (!apiKey) return false

  const from = fromEmail || 'RevQ <noreply@revq.jp>'
  const subject = isRegistration
    ? `[RevQ] 新規登録コード: ${code}`
    : `[RevQ] ログインコード: ${code}`
  const purpose = isRegistration ? '新規登録用ワンタイムコード' : 'ログイン用ワンタイムコード'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject,
        html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
    <div style="background:#2563eb;padding:24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">RevQ</h1>
    </div>
    <div style="padding:32px 24px;text-align:center;">
      <p style="color:#475569;font-size:15px;margin:0 0 24px;">${purpose}</p>
      <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:0 auto 24px;display:inline-block;">
        <p style="margin:0;font-size:36px;font-weight:800;letter-spacing:0.3em;color:#1e293b;font-family:monospace;">${code}</p>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin:0;">このコードは<strong>5分間</strong>有効です</p>
      <p style="color:#94a3b8;font-size:13px;margin:8px 0 0;">心当たりがない場合は無視してください</p>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:11px;">&copy; 2026 RevQ — Googleレビュー依頼カード作成ツール</p>
    </div>
  </div>
</body>
</html>`,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[OTP Email] Resend API error:', res.status, err)
      return false
    }
    return true
  } catch (e) {
    console.error('[OTP Email] Failed to send:', e)
    return false
  }
}

/**
 * Common: rate limit check + OTP generation + email send
 */
async function generateAndSendOTP(
  c: any,
  email: string,
  isRegistration: boolean
): Promise<Response | { code: string }> {
  // Rate limiting: max 1 OTP per email per 60 seconds
  const recentOtp = await c.env.DB.prepare(
    "SELECT id FROM otps WHERE email = ? AND used = 0 AND created_at > datetime('now', '-60 seconds') LIMIT 1"
  ).bind(email).first()
  if (recentOtp) {
    return c.json({ error: '前回の送信から60秒経過してから再送信してください' }, 429)
  }

  const code = generateOTPCode()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  // Invalidate previous codes
  await c.env.DB.prepare('UPDATE otps SET used = 1 WHERE email = ? AND used = 0')
    .bind(email).run()

  // Insert new code
  await c.env.DB.prepare('INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)')
    .bind(email, code, expiresAt).run()

  // Send OTP via Resend
  const emailSent = await sendOTPEmail(email, code, c.env.RESEND_API_KEY, c.env.OTP_FROM_EMAIL, isRegistration)
  console.log(`[OTP] ${email} (registration: ${isRegistration}, email_sent: ${emailSent})`)

  if (!emailSent) {
    return c.json({
      error: 'メールの送信に失敗しました。しばらく時間をおいてから再度お試しください。'
    }, 500)
  }

  return { code }
}

/**
 * POST /api/auth/send-code
 * Send OTP code to EXISTING user only (login flow)
 */
auth.post('/send-code', async (c) => {
  const { email } = await c.req.json<{ email: string }>()
  if (!email || !email.includes('@')) {
    return c.json({ error: 'メールアドレスが無効です' }, 400)
  }

  // Check if user exists
  const user = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (!user) {
    return c.json({ error: 'このメールアドレスは登録されていません。新規登録をお願いします。', code: 'NOT_REGISTERED' }, 404)
  }

  const result = await generateAndSendOTP(c, email, false)
  if (result instanceof Response) return result

  return c.json({
    success: true,
    message: 'ワンタイムコードをメールで送信しました',
    email_sent: true,
  })
})

/**
 * POST /api/auth/register
 * Send OTP code for NEW user registration
 * Accepts optional pending_card_ids to claim after verification
 */
auth.post('/register', async (c) => {
  const { email } = await c.req.json<{ email: string }>()
  if (!email || !email.includes('@')) {
    return c.json({ error: 'メールアドレスが無効です' }, 400)
  }

  // Check if user already exists
  const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existingUser) {
    return c.json({ error: 'このメールアドレスは既に登録されています。ログインしてください。', code: 'ALREADY_REGISTERED' }, 409)
  }

  const result = await generateAndSendOTP(c, email, true)
  if (result instanceof Response) return result

  return c.json({
    success: true,
    message: '登録用ワンタイムコードをメールで送信しました',
    email_sent: true,
  })
})

/**
 * POST /api/auth/verify
 * Verify OTP code and return JWT
 * For login: user must already exist
 * For registration (mode=register): creates user + claims pending cards
 */
auth.post('/verify', async (c) => {
  const { email, code, mode, pending_card_ids } = await c.req.json<{
    email: string
    code: string
    mode?: 'login' | 'register'
    pending_card_ids?: number[]
  }>()
  if (!email || !code) {
    return c.json({ error: 'メールとコードを入力してください' }, 400)
  }

  // Find valid OTP
  const otp = await c.env.DB.prepare(
    "SELECT * FROM otps WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now') ORDER BY id DESC LIMIT 1"
  ).bind(email, code).first()

  if (!otp) {
    return c.json({ error: 'コードが無効または期限切れです' }, 401)
  }

  // Mark OTP as used
  await c.env.DB.prepare('UPDATE otps SET used = 1 WHERE id = ?').bind(otp.id).run()

  let user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
  let isNewUser = false

  if (mode === 'register') {
    // Registration flow — create user if not exists
    if (!user) {
      await c.env.DB.prepare('INSERT INTO users (email) VALUES (?)').bind(email).run()
      user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
      isNewUser = true
    }
  } else {
    // Login flow — user must already exist
    if (!user) {
      return c.json({ error: 'このメールアドレスは登録されていません' }, 404)
    }
  }

  // Update last login
  await c.env.DB.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?")
    .bind(user!.id).run()

  // Claim pending cards (created before login/registration)
  const claimedCards: number[] = []
  if (pending_card_ids && pending_card_ids.length > 0) {
    for (const cardId of pending_card_ids) {
      // Only claim cards that have no owner yet
      const card = await c.env.DB.prepare(
        'SELECT id, google_url, store_name FROM cards WHERE id = ? AND user_id IS NULL'
      ).bind(cardId).first()
      if (card) {
        // Find or create a store for this card
        let store = await c.env.DB.prepare(
          'SELECT id FROM stores WHERE user_id = ? AND google_url = ?'
        ).bind(user!.id, card.google_url).first()

        if (!store) {
          // Check store limit
          const storeCount = await c.env.DB.prepare(
            'SELECT COUNT(*) as count FROM stores WHERE user_id = ?'
          ).bind(user!.id).first()
          const maxStores = (user!.max_stores as number) || 3
          const currentStoreCount = (storeCount?.count as number) || 0

          if (currentStoreCount < maxStores) {
            const storeName = (card.store_name as string) || '(店名なし)'
            await c.env.DB.prepare(
              'INSERT INTO stores (user_id, name, google_url) VALUES (?, ?, ?)'
            ).bind(user!.id, storeName, card.google_url).run()
            store = await c.env.DB.prepare(
              'SELECT id FROM stores WHERE user_id = ? AND google_url = ?'
            ).bind(user!.id, card.google_url).first()
          }
        }

        // Assign card to user + store
        await c.env.DB.prepare(
          'UPDATE cards SET user_id = ?, store_id = ? WHERE id = ?'
        ).bind(user!.id, store?.id || null, cardId).run()

        claimedCards.push(cardId)
      }
    }
  }

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
    is_new_user: isNewUser,
    claimed_cards: claimedCards,
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

  const user = await c.env.DB.prepare('SELECT id, email, name, plan, weekly_email FROM users WHERE id = ?')
    .bind(payload.userId).first()

  return c.json({ user: user || null })
})

/**
 * GET /api/auth/preferences
 */
auth.get('/preferences', async (c) => {
  const token = getCookie(c, 'token')
  if (!token) return c.json({ error: 'ログインが必要です' }, 401)

  const secret = c.env.JWT_SECRET || JWT_SECRET_DEFAULT
  const payload = await verifyJWT(token, secret)
  if (!payload?.userId) return c.json({ error: 'ログインが必要です' }, 401)

  const user = await c.env.DB.prepare('SELECT weekly_email FROM users WHERE id = ?')
    .bind(payload.userId).first()
  if (!user) return c.json({ error: 'ユーザーが見つかりません' }, 404)

  return c.json({ weekly_email: user.weekly_email })
})

/**
 * PUT /api/auth/preferences
 */
auth.put('/preferences', async (c) => {
  const token = getCookie(c, 'token')
  if (!token) return c.json({ error: 'ログインが必要です' }, 401)

  const secret = c.env.JWT_SECRET || JWT_SECRET_DEFAULT
  const payload = await verifyJWT(token, secret)
  if (!payload?.userId) return c.json({ error: 'ログインが必要です' }, 401)

  const body = await c.req.json<{ weekly_email?: number }>()

  if (body.weekly_email !== undefined) {
    const val = body.weekly_email ? 1 : 0
    await c.env.DB.prepare('UPDATE users SET weekly_email = ? WHERE id = ?')
      .bind(val, payload.userId).run()
  }

  return c.json({ success: true })
})

/**
 * POST /api/auth/logout
 */
auth.post('/logout', async (c) => {
  deleteCookie(c, 'token', { path: '/' })
  return c.json({ success: true })
})

export default auth
