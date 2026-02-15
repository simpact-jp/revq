import { Hono } from 'hono'
import type { Bindings } from '../lib/types'

const admin = new Hono<{ Bindings: Bindings }>()

/**
 * Admin authentication is handled by Basic Auth middleware in index.tsx
 * This file only defines the API endpoints.
 */

/**
 * GET /api/admin/stats
 */
admin.get('/stats', async (c) => {
  const totalUsers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first()
  const totalCards = await c.env.DB.prepare('SELECT COUNT(*) as count FROM cards').first()
  const activeCards = await c.env.DB.prepare("SELECT COUNT(*) as count FROM cards WHERE status = 'active'").first()
  const totalClicks = await c.env.DB.prepare('SELECT COUNT(*) as count FROM clicks').first()

  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
  const weekUsers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users WHERE created_at >= ?').bind(weekAgo).first()
  const weekCards = await c.env.DB.prepare('SELECT COUNT(*) as count FROM cards WHERE created_at >= ?').bind(weekAgo).first()
  const weekClicks = await c.env.DB.prepare('SELECT COUNT(*) as count FROM clicks WHERE clicked_at >= ?').bind(weekAgo).first()

  // OTP stats
  const totalOtps = await c.env.DB.prepare('SELECT COUNT(*) as count FROM otps').first()
  const weekOtps = await c.env.DB.prepare('SELECT COUNT(*) as count FROM otps WHERE created_at >= ?').bind(weekAgo).first()

  // Feedback stats
  const totalFeedbacks = await c.env.DB.prepare('SELECT COUNT(*) as count FROM feedbacks').first()
  const unreadFeedbacks = await c.env.DB.prepare('SELECT COUNT(*) as count FROM feedbacks WHERE is_read = 0').first()
  const weekFeedbacks = await c.env.DB.prepare('SELECT COUNT(*) as count FROM feedbacks WHERE created_at >= ?').bind(weekAgo).first()

  // Gate stats
  const gateEnabledCards = await c.env.DB.prepare('SELECT COUNT(*) as count FROM cards WHERE gate_enabled = 1').first()

  return c.json({
    totalUsers: totalUsers?.count || 0,
    totalCards: totalCards?.count || 0,
    activeCards: activeCards?.count || 0,
    totalClicks: totalClicks?.count || 0,
    weekUsers: weekUsers?.count || 0,
    weekCards: weekCards?.count || 0,
    weekClicks: weekClicks?.count || 0,
    totalOtps: totalOtps?.count || 0,
    weekOtps: weekOtps?.count || 0,
    totalFeedbacks: totalFeedbacks?.count || 0,
    unreadFeedbacks: unreadFeedbacks?.count || 0,
    weekFeedbacks: weekFeedbacks?.count || 0,
    gateEnabledCards: gateEnabledCards?.count || 0,
    hasResendKey: !!c.env.RESEND_API_KEY,
  })
})

/**
 * GET /api/admin/users
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
 */
admin.get('/cards', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT c.id, c.store_name, c.google_url, c.short_code, c.template, c.cta_text, c.label, c.gate_enabled, c.created_at, c.status,
           u.name as user_name, u.email as user_email,
           COUNT(cl.id) as click_count
    FROM cards c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN clicks cl ON cl.card_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).all()

  const linkDomain = c.env.LINK_DOMAIN || 'revq.link'
  const cardsWithUrls = (results || []).map((card: any) => ({
    ...card,
    short_url: `https://${linkDomain}/${card.short_code}`,
  }))

  return c.json({ cards: cardsWithUrls })
})

/**
 * PUT /api/admin/cards/:id/status
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
 * PUT /api/admin/cards/:id
 * Admin update card (store name, CTA, template)
 */
admin.put('/cards/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{
    store_name?: string | null
    cta_text?: string | null
    template?: string
    label?: string | null
  }>()

  const updates: string[] = []
  const values: any[] = []

  if (body.store_name !== undefined) {
    updates.push('store_name = ?')
    values.push(body.store_name || null)
  }
  if (body.cta_text !== undefined) {
    updates.push('cta_text = ?')
    values.push(body.cta_text || null)
  }
  if (body.template !== undefined) {
    updates.push('template = ?')
    values.push(body.template)
  }
  if (body.label !== undefined) {
    updates.push('label = ?')
    values.push(body.label || null)
  }

  if (updates.length > 0) {
    values.push(id)
    await c.env.DB.prepare(`UPDATE cards SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values).run()
  }

  return c.json({ success: true })
})

/**
 * DELETE /api/admin/cards/:id
 */
admin.delete('/cards/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM clicks WHERE card_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM cards WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/users/:id
 */
admin.delete('/users/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(`
    DELETE FROM clicks WHERE card_id IN (SELECT id FROM cards WHERE user_id = ?)
  `).bind(id).run()
  await c.env.DB.prepare('DELETE FROM cards WHERE user_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * GET /api/admin/feedbacks
 * List all feedbacks for admin
 */
admin.get('/feedbacks', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT f.id, f.card_id, f.message, f.created_at, f.is_read,
           c.store_name, c.label, c.short_code,
           u.email as owner_email
    FROM feedbacks f
    JOIN cards c ON f.card_id = c.id
    LEFT JOIN users u ON c.user_id = u.id
    ORDER BY f.created_at DESC
    LIMIT 100
  `).all()

  return c.json({ feedbacks: results || [] })
})

/**
 * PUT /api/admin/feedbacks/:id/read
 * Mark a feedback as read
 */
admin.put('/feedbacks/:id/read', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('UPDATE feedbacks SET is_read = 1 WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * DELETE /api/admin/feedbacks/:id
 * Delete a feedback
 */
admin.delete('/feedbacks/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM feedbacks WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

/**
 * GET /api/admin/recent-activity
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

  // Recent OTP activity
  const recentOtps = await c.env.DB.prepare(`
    SELECT email, created_at, used, expires_at
    FROM otps
    ORDER BY created_at DESC
    LIMIT 10
  `).all()

  return c.json({
    recentUsers: recentUsers.results || [],
    recentCards: recentCards.results || [],
    recentOtps: recentOtps.results || [],
  })
})

export default admin
