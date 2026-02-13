import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import type { Bindings } from '../lib/types'
import { verifyJWT } from '../lib/utils'

const JWT_SECRET_DEFAULT = 'revuq-dev-secret-change-in-production'
const ADMIN_EMAILS = ['admin@revuq.jp'] // Add admin emails here

const admin = new Hono<{ Bindings: Bindings }>()

/**
 * Admin authentication middleware
 * In production: check if user email is in ADMIN_EMAILS
 * In prototype: allow access via admin password header or cookie
 */
admin.use('*', async (c, next) => {
  // Check admin password (simpler for prototype)
  const adminPw = c.req.header('x-admin-key') || c.req.query('admin_key')
  const envPw = c.env.ADMIN_PASSWORD || 'revuq-admin-2026'
  if (adminPw === envPw) {
    return next()
  }

  // Check JWT for admin email
  const token = getCookie(c, 'token')
  if (token) {
    const secret = c.env.JWT_SECRET || JWT_SECRET_DEFAULT
    const payload = await verifyJWT(token, secret)
    if (payload?.email && ADMIN_EMAILS.includes(payload.email as string)) {
      return next()
    }
  }

  // For prototype: allow all access (remove in production!)
  return next()
})

/**
 * GET /api/admin/stats
 * Dashboard overview statistics
 */
admin.get('/stats', async (c) => {
  const totalUsers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first()
  const totalCards = await c.env.DB.prepare('SELECT COUNT(*) as count FROM cards').first()
  const activeCards = await c.env.DB.prepare("SELECT COUNT(*) as count FROM cards WHERE status = 'active'").first()
  const totalClicks = await c.env.DB.prepare('SELECT COUNT(*) as count FROM clicks').first()

  // This week stats
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
  const weekUsers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users WHERE created_at >= ?').bind(weekAgo).first()
  const weekCards = await c.env.DB.prepare('SELECT COUNT(*) as count FROM cards WHERE created_at >= ?').bind(weekAgo).first()
  const weekClicks = await c.env.DB.prepare('SELECT COUNT(*) as count FROM clicks WHERE clicked_at >= ?').bind(weekAgo).first()

  return c.json({
    totalUsers: totalUsers?.count || 0,
    totalCards: totalCards?.count || 0,
    activeCards: activeCards?.count || 0,
    totalClicks: totalClicks?.count || 0,
    weekUsers: weekUsers?.count || 0,
    weekCards: weekCards?.count || 0,
    weekClicks: weekClicks?.count || 0,
  })
})

/**
 * GET /api/admin/users
 * List all users with card/click counts
 */
admin.get('/users', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT u.id, u.email, u.name, u.plan, u.created_at, u.last_login_at,
           COUNT(DISTINCT c.id) as card_count,
           (SELECT COUNT(*) FROM clicks cl JOIN cards ca ON cl.card_id = ca.id WHERE ca.user_id = u.id) as total_clicks
    FROM users u
    LEFT JOIN cards c ON c.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all()

  return c.json({ users: results || [] })
})

/**
 * GET /api/admin/cards
 * List all cards with user info and click counts
 */
admin.get('/cards', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT c.id, c.store_name, c.google_url, c.short_code, c.template, c.created_at, c.status,
           u.name as user_name, u.email as user_email,
           COUNT(cl.id) as click_count
    FROM cards c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN clicks cl ON cl.card_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).all()

  const origin = new URL(c.req.url).origin
  const cardsWithUrls = (results || []).map((card: any) => ({
    ...card,
    short_url: `${origin}/r/${card.short_code}`,
  }))

  return c.json({ cards: cardsWithUrls })
})

/**
 * PUT /api/admin/cards/:id/status
 * Toggle card status (active/paused)
 */
admin.put('/cards/:id/status', async (c) => {
  const id = c.req.param('id')
  const { status } = await c.req.json<{ status: string }>()
  if (!['active', 'paused'].includes(status)) {
    return c.json({ error: '無効なステータスです' }, 400)
  }
  await c.env.DB.prepare('UPDATE cards SET status = ? WHERE id = ?').bind(status, id).run()
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/cards/:id
 * Delete a card (admin)
 */
admin.delete('/cards/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM clicks WHERE card_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM cards WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/users/:id
 * Ban/delete a user (admin)
 */
admin.delete('/users/:id', async (c) => {
  const id = c.req.param('id')
  // Delete user's clicks and cards first
  await c.env.DB.prepare(`
    DELETE FROM clicks WHERE card_id IN (SELECT id FROM cards WHERE user_id = ?)
  `).bind(id).run()
  await c.env.DB.prepare('DELETE FROM cards WHERE user_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * GET /api/admin/recent-activity
 * Recent users and cards
 */
admin.get('/recent-activity', async (c) => {
  const recentUsers = await c.env.DB.prepare(`
    SELECT u.id, u.email, u.name, u.created_at,
           COUNT(c.id) as card_count
    FROM users u
    LEFT JOIN cards c ON c.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT 5
  `).all()

  const recentCards = await c.env.DB.prepare(`
    SELECT c.id, c.store_name, c.template, c.created_at,
           u.name as user_name,
           COUNT(cl.id) as click_count
    FROM cards c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN clicks cl ON cl.card_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
    LIMIT 5
  `).all()

  return c.json({
    recentUsers: recentUsers.results || [],
    recentCards: recentCards.results || [],
  })
})

export default admin
