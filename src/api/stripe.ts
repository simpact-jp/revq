import { Hono } from 'hono'
import type { Bindings } from '../lib/types'

const stripe = new Hono<{ Bindings: Bindings }>()

// Stripe Price IDs
const PRICE_IDS = {
  pro_monthly: 'price_1T14md4gzrhIsgWNBdnOnnsd',
  pro_yearly: 'price_1T14me4gzrhIsgWNMRtdcQE5',
}

// Pro plan limits
const PRO_LIMITS = {
  max_stores: 999,
  max_cards_per_store: 999,
  max_cards: 999,
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
  const priceId = interval === 'yearly' ? PRICE_IDS.pro_yearly : PRICE_IDS.pro_monthly

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
        const periodEnd = new Date((sub.current_period_end || 0) * 1000).toISOString()

        await c.env.DB.prepare(`
          UPDATE users SET
            plan = 'pro',
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
          PRO_LIMITS.max_stores,
          PRO_LIMITS.max_cards_per_store,
          PRO_LIMITS.max_cards,
          userId
        ).run()

        console.log(`[Stripe] User ${userId} upgraded to pro (${interval})`)
      }
      break
    }

    case 'invoice.payment_succeeded': {
      // Recurring payment succeeded — extend subscription
      const subscriptionId = data.subscription
      if (subscriptionId) {
        const sub = await stripeAPI(`/subscriptions/${subscriptionId}`, c.env.STRIPE_SECRET_KEY)
        const userId = sub.metadata?.revq_user_id
        const periodEnd = new Date((sub.current_period_end || 0) * 1000).toISOString()

        if (userId) {
          await c.env.DB.prepare(`
            UPDATE users SET plan = 'pro', plan_expires_at = ? WHERE id = ?
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
          const periodEnd = new Date((data.current_period_end || 0) * 1000).toISOString()
          await c.env.DB.prepare(`
            UPDATE users SET plan = 'pro', plan_interval = ?, plan_expires_at = ? WHERE id = ?
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
    plan: user.plan || 'free',
    plan_interval: user.plan_interval || 'none',
    plan_expires_at: user.plan_expires_at || null,
    has_subscription: !!(user.stripe_subscription_id),
    max_stores: user.max_stores,
    max_cards_per_store: user.max_cards_per_store,
  })
})

export default stripe
