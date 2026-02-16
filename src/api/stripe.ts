import { Hono } from 'hono'
import type { Bindings } from '../lib/types'

const stripe = new Hono<{ Bindings: Bindings }>()

// Stripe Price IDs (Plus plan)
const PRICE_IDS = {
  plus_monthly: 'price_1T15AI4gzrhIsgWNFe2nrhDA',   // ¥300/month
  plus_yearly: 'price_1T15AO4gzrhIsgWNxFXSAmN0',     // ¥2,400/year
}

// Plus plan limits
const PLUS_LIMITS = {
  max_stores: 20,
  max_cards_per_store: 999,
  max_cards: 999,
}

/**
 * Helper: Convert unix timestamp (seconds) to ISO string safely
 * Returns null if the timestamp is 0, undefined, or invalid
 */
function safeUnixToISO(unix: number | undefined | null): string | null {
  if (!unix || unix <= 0) return null
  const ms = unix * 1000
  const d = new Date(ms)
  if (isNaN(d.getTime()) || d.getFullYear() <= 1970) return null
  return d.toISOString()
}

/**
 * Send a thank-you email to the user after successful payment
 */
async function sendThankYouEmail(
  email: string,
  apiKey: string | undefined,
  fromEmail: string | undefined,
  interval: string
): Promise<boolean> {
  if (!apiKey) {
    console.error('[Thank You Email] RESEND_API_KEY is not set')
    return false
  }

  const from = fromEmail || 'RevQ <noreply@revq.jp>'
  const planText = interval === 'year' ? '年額プラン（¥2,400/年）' : '月額プラン（¥300/月）'

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
        subject: '[RevQ] Plus プランへのアップグレードありがとうございます',
        html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">🎉 ありがとうございます！</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">RevQ Plus プランへようこそ</p>
    </div>
    <div style="padding:32px 24px;">
      <p style="color:#334155;font-size:15px;line-height:1.7;margin:0 0 20px;">
        この度は RevQ Plus プランにアップグレードいただき、誠にありがとうございます。
      </p>
      <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="margin:0 0 8px;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">ご利用プラン</p>
        <p style="margin:0;color:#1e293b;font-size:18px;font-weight:700;">✨ Plus ${planText}</p>
      </div>
      <p style="color:#334155;font-size:15px;line-height:1.7;margin:0 0 8px;font-weight:600;">Plus プランの特典：</p>
      <ul style="color:#475569;font-size:14px;line-height:2;margin:0 0 24px;padding-left:20px;">
        <li>店舗登録 <strong>20件</strong>まで</li>
        <li>QRカード <strong>無制限</strong>作成</li>
        <li>PDF の RevQ ロゴ非表示</li>
        <li>週刊レポートメール</li>
      </ul>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://revq.jp/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;">マイページを確認する →</a>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin:24px 0 0;text-align:center;">
        ご不明な点がございましたら、お気軽にお問い合わせください。
      </p>
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
      console.error('[Thank You Email] Resend API error:', res.status, err)
      return false
    }
    console.log(`[Thank You Email] Sent to ${email}`)
    return true
  } catch (e) {
    console.error('[Thank You Email] Failed to send:', e)
    return false
  }
}

/**
 * Helper: Get user from JWT cookie
 */
async function getUserFromCookie(c: any): Promise<any> {
  const cookie = c.req.header('Cookie') || ''
  const tokenMatch = cookie.match(/token=([^;]+)/)
  if (!tokenMatch) return null

  try {
    const payload = JSON.parse(atob(tokenMatch[1].split('.')[1]))
    if (!payload.userId) return null
    return await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(payload.userId).first()
  } catch {
    return null
  }
}

/**
 * Helper: Call Stripe API
 */
async function stripeAPI(path: string, apiKey: string, method: string = 'GET', body?: string) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  return res.json() as Promise<any>
}

/**
 * POST /api/stripe/create-checkout
 * Create a Stripe Checkout Session for the logged-in user
 */
stripe.post('/create-checkout', async (c) => {
  const user = await getUserFromCookie(c)
  if (!user) return c.json({ error: 'ログインが必要です' }, 401)
  if (!c.env.STRIPE_SECRET_KEY) return c.json({ error: 'Stripe未設定' }, 500)

  const { interval } = await c.req.json<{ interval: 'monthly' | 'yearly' }>()
  const priceId = interval === 'yearly' ? PRICE_IDS.plus_yearly : PRICE_IDS.plus_monthly

  const mainDomain = c.env.MAIN_DOMAIN || 'revq.jp'
  const baseUrl = `https://${mainDomain}`

  // Create or reuse Stripe customer
  let customerId = user.stripe_customer_id as string | null
  if (!customerId) {
    const customer = await stripeAPI('/customers', c.env.STRIPE_SECRET_KEY, 'POST',
      `email=${encodeURIComponent(user.email)}&metadata[revq_user_id]=${user.id}`
    )
    customerId = customer.id
    await c.env.DB.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?')
      .bind(customerId, user.id).run()
  }

  // Create Checkout Session
  const params = new URLSearchParams({
    'customer': customerId!,
    'mode': 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'success_url': `${baseUrl}/dashboard?upgrade=success`,
    'cancel_url': `${baseUrl}/pricing?upgrade=cancel`,
    'metadata[revq_user_id]': String(user.id),
    'subscription_data[metadata][revq_user_id]': String(user.id),
    'allow_promotion_codes': 'true',
    'locale': 'ja',
  })

  const session = await stripeAPI('/checkout/sessions', c.env.STRIPE_SECRET_KEY, 'POST', params.toString())

  if (session.error) {
    console.error('Stripe Checkout error:', session.error)
    return c.json({ error: '決済セッションの作成に失敗しました' }, 500)
  }

  return c.json({ url: session.url })
})

/**
 * POST /api/stripe/create-portal
 * Create a Stripe Customer Portal session (manage subscription)
 */
stripe.post('/create-portal', async (c) => {
  const user = await getUserFromCookie(c)
  if (!user) return c.json({ error: 'ログインが必要です' }, 401)
  if (!c.env.STRIPE_SECRET_KEY) return c.json({ error: 'Stripe未設定' }, 500)
  if (!user.stripe_customer_id) return c.json({ error: 'サブスクリプション情報がありません' }, 400)

  const mainDomain = c.env.MAIN_DOMAIN || 'revq.jp'

  const params = new URLSearchParams({
    'customer': user.stripe_customer_id as string,
    'return_url': `https://${mainDomain}/dashboard`,
  })

  const session = await stripeAPI('/billing_portal/sessions', c.env.STRIPE_SECRET_KEY, 'POST', params.toString())

  if (session.error) {
    console.error('Stripe Portal error:', session.error)
    return c.json({ error: 'ポータルの作成に失敗しました' }, 500)
  }

  return c.json({ url: session.url })
})

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 * Note: Signature verification is skipped due to Cloudflare Workers limitations
 * with crypto.timingSafeEqual. Instead, we verify the event by fetching it from Stripe.
 */
stripe.post('/webhook', async (c) => {
  if (!c.env.STRIPE_SECRET_KEY) return c.json({ error: 'Not configured' }, 500)

  let event: any
  try {
    event = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid payload' }, 400)
  }

  // Verify event by fetching from Stripe API (secure alternative to signature verification)
  const verified = await stripeAPI(`/events/${event.id}`, c.env.STRIPE_SECRET_KEY)
  if (verified.error || !verified.id) {
    console.error('Webhook verification failed:', verified.error)
    return c.json({ error: 'Unverified event' }, 400)
  }

  const type = verified.type
  const data = verified.data.object

  console.log(`[Stripe Webhook] ${type}`)

  switch (type) {
    case 'checkout.session.completed': {
      // Payment successful — activate subscription
      const userId = data.metadata?.revq_user_id
      const subscriptionId = data.subscription
      if (userId && subscriptionId) {
        // Fetch subscription details for interval info
        const sub = await stripeAPI(`/subscriptions/${subscriptionId}`, c.env.STRIPE_SECRET_KEY)
        const interval = sub.items?.data?.[0]?.price?.recurring?.interval || 'month'
        const periodEnd = safeUnixToISO(sub.current_period_end)

        await c.env.DB.prepare(`
          UPDATE users SET
            plan = 'plus',
            stripe_subscription_id = ?,
            plan_interval = ?,
            plan_expires_at = ?,
            max_stores = ?,
            max_cards_per_store = ?,
            max_cards = ?
          WHERE id = ?
        `).bind(
          subscriptionId,
          interval,
          periodEnd,
          PLUS_LIMITS.max_stores,
          PLUS_LIMITS.max_cards_per_store,
          PLUS_LIMITS.max_cards,
          userId
        ).run()

        console.log(`[Stripe] User ${userId} upgraded to plus (${interval}), expires: ${periodEnd}`)

        // Send thank-you email to user
        const user = await c.env.DB.prepare('SELECT email FROM users WHERE id = ?').bind(userId).first()
        if (user?.email) {
          c.executionCtx.waitUntil(
            sendThankYouEmail(
              user.email as string,
              c.env.RESEND_API_KEY,
              c.env.OTP_FROM_EMAIL,
              interval
            )
          )
        }
      }
      break
    }

    case 'invoice.payment_succeeded': {
      // Recurring payment succeeded — extend subscription
      const subscriptionId = data.subscription
      if (subscriptionId) {
        const sub = await stripeAPI(`/subscriptions/${subscriptionId}`, c.env.STRIPE_SECRET_KEY)
        const userId = sub.metadata?.revq_user_id
        const periodEnd = safeUnixToISO(sub.current_period_end)

        if (userId && periodEnd) {
          await c.env.DB.prepare(`
            UPDATE users SET plan = 'plus', plan_expires_at = ? WHERE id = ?
          `).bind(periodEnd, userId).run()
          console.log(`[Stripe] User ${userId} subscription renewed until ${periodEnd}`)
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      // Subscription canceled — downgrade to free
      const userId = data.metadata?.revq_user_id
      if (userId) {
        await c.env.DB.prepare(`
          UPDATE users SET
            plan = 'free',
            stripe_subscription_id = NULL,
            plan_interval = 'none',
            plan_expires_at = NULL,
            max_stores = 2,
            max_cards_per_store = 2,
            max_cards = 2
          WHERE id = ?
        `).bind(userId).run()
        console.log(`[Stripe] User ${userId} downgraded to free`)
      }
      break
    }

    case 'customer.subscription.updated': {
      // Subscription changed (upgrade/downgrade/pause)
      const userId = data.metadata?.revq_user_id
      const status = data.status
      if (userId) {
        if (status === 'active') {
          const interval = data.items?.data?.[0]?.price?.recurring?.interval || 'month'
          const periodEnd = safeUnixToISO(data.current_period_end)
          await c.env.DB.prepare(`
            UPDATE users SET plan = 'plus', plan_interval = ?, plan_expires_at = ? WHERE id = ?
          `).bind(interval, periodEnd, userId).run()
        } else if (status === 'canceled' || status === 'unpaid') {
          await c.env.DB.prepare(`
            UPDATE users SET
              plan = 'free', stripe_subscription_id = NULL,
              plan_interval = 'none', plan_expires_at = NULL,
              max_stores = 2, max_cards_per_store = 2, max_cards = 2
            WHERE id = ?
          `).bind(userId).run()
        }
      }
      break
    }
  }

  return c.json({ received: true })
})

/**
 * GET /api/stripe/status
 * Get current user's subscription status
 */
stripe.get('/status', async (c) => {
  const user = await getUserFromCookie(c)
  if (!user) return c.json({ error: 'ログインが必要です' }, 401)

  return c.json({
    plan: user.plan === 'pro' ? 'plus' : (user.plan || 'free'),  // backwards compat: treat 'pro' as 'plus'
    plan_interval: user.plan_interval || 'none',
    plan_expires_at: user.plan_expires_at || null,
    has_subscription: !!(user.stripe_subscription_id),
    max_stores: user.max_stores,
    max_cards_per_store: user.max_cards_per_store,
  })
})

export default stripe
