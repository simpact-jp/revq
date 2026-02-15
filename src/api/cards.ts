import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import type { Bindings, CreateCardRequest, PDFLayout } from '../lib/types'
import { generateShortCode, verifyJWT } from '../lib/utils'
import { generateQRSvg } from '../lib/qr'
import { generateCardPDF } from '../lib/pdf'

const JWT_SECRET_DEFAULT = 'revq-dev-secret-change-in-production'

const cards = new Hono<{ Bindings: Bindings }>()

/**
 * Helper: build the short URL using the dedicated link domain
 * Always returns https://revq.link/{code} format
 */
function buildShortUrl(c: any, shortCode: string): string {
  const linkDomain = c.env.LINK_DOMAIN || 'revq.link'
  return `https://${linkDomain}/${shortCode}`
}

/**
 * Helper: get current user ID from JWT (optional — null if not logged in)
 */
async function getUserId(c: any): Promise<number | null> {
  const token = getCookie(c, 'token')
  if (!token) return null
  const secret = c.env.JWT_SECRET || JWT_SECRET_DEFAULT
  const payload = await verifyJWT(token, secret)
  return payload?.userId as number | null
}

/**
 * POST /api/cards
 * Create a new review card
 *
 * Flow:
 *   1. If logged in, find or create a store for the given google_url
 *   2. Check store limit (max_stores per user, default 3)
 *   3. Check card limit (max_cards_per_store, default 2)
 *   4. Create the card linked to the store
 */
cards.post('/', async (c) => {
  const body = await c.req.json<CreateCardRequest>()

  if (!body.google_url) {
    return c.json({ error: 'GoogleマップのURLは必須です' }, 400)
  }

  const userId = await getUserId(c)
  let storeId: number | null = null

  if (userId) {
    // Get user limits
    const user = await c.env.DB.prepare(
      'SELECT max_stores, max_cards_per_store, max_cards FROM users WHERE id = ?'
    ).bind(userId).first()
    const maxStores = (user?.max_stores as number) || 2
    const maxCardsPerStore = (user?.max_cards_per_store as number) || 2

    // Try to find existing store for this google_url
    let store = await c.env.DB.prepare(
      'SELECT id FROM stores WHERE user_id = ? AND google_url = ?'
    ).bind(userId, body.google_url).first()

    if (!store) {
      // New store — check store limit
      const storeCount = await c.env.DB.prepare(
        'SELECT COUNT(*) as count FROM stores WHERE user_id = ?'
      ).bind(userId).first()
      const currentStoreCount = (storeCount?.count as number) || 0

      if (currentStoreCount >= maxStores) {
        return c.json({
          error: `店舗の登録上限（${maxStores}件）に達しています。既存の店舗を削除してからお試しください。`
        }, 400)
      }

      // Create new store
      const storeName = body.store_name || '(店名なし)'
      await c.env.DB.prepare(
        'INSERT INTO stores (user_id, name, google_url) VALUES (?, ?, ?)'
      ).bind(userId, storeName, body.google_url).run()

      store = await c.env.DB.prepare(
        'SELECT id FROM stores WHERE user_id = ? AND google_url = ?'
      ).bind(userId, body.google_url).first()
    }

    storeId = store!.id as number

    // Check card limit for this store
    const cardCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM cards WHERE store_id = ?'
    ).bind(storeId).first()
    const currentCardCount = (cardCount?.count as number) || 0

    if (currentCardCount >= maxCardsPerStore) {
      return c.json({
        error: `この店舗のQRコード発行上限（${maxCardsPerStore}枚）に達しています。既存のカードを削除してからお試しください。`
      }, 400)
    }
  }

  // Generate unique short code
  let shortCode: string = ''
  let attempts = 0
  do {
    shortCode = generateShortCode()
    const exists = await c.env.DB.prepare('SELECT id FROM cards WHERE short_code = ?')
      .bind(shortCode).first()
    if (!exists) break
    attempts++
  } while (attempts < 10)

  const template = body.template || 'simple'
  const storeName = body.store_name || null
  const imageData = body.image_data || null
  const ctaText = body.cta_text || null
  const label = body.label || null

  await c.env.DB.prepare(
    'INSERT INTO cards (user_id, store_id, store_name, google_url, short_code, template, image_key, cta_text, label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(userId, storeId, storeName, body.google_url, shortCode, template, imageData, ctaText, label).run()

  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE short_code = ?')
    .bind(shortCode).first()

  return c.json({
    success: true,
    card: {
      id: card!.id,
      store_name: card!.store_name,
      short_code: card!.short_code,
      template: card!.template,
      cta_text: card!.cta_text,
      label: card!.label,
      store_id: card!.store_id,
      short_url: buildShortUrl(c, shortCode),
      created_at: card!.created_at,
    },
  })
})

/**
 * GET /api/cards
 * List cards for current user, grouped by store
 */
cards.get('/', async (c) => {
  const userId = await getUserId(c)
  if (!userId) {
    return c.json({ error: 'ログインが必要です' }, 401)
  }

  // Get user limits
  const user = await c.env.DB.prepare(
    'SELECT max_stores, max_cards_per_store, max_cards FROM users WHERE id = ?'
  ).bind(userId).first()
  const maxStores = (user?.max_stores as number) || 2
  const maxCardsPerStore = (user?.max_cards_per_store as number) || 2

  // Get all stores for this user
  const { results: stores } = await c.env.DB.prepare(
    'SELECT * FROM stores WHERE user_id = ? ORDER BY created_at ASC'
  ).bind(userId).all()

  // Get all cards for this user
  const { results } = await c.env.DB.prepare(`
    SELECT c.id, c.store_id, c.store_name, c.google_url, c.short_code, c.template, c.cta_text, c.label, c.gate_enabled, c.created_at, c.status,
           COUNT(cl.id) as click_count
    FROM cards c
    LEFT JOIN clicks cl ON cl.card_id = c.id
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).bind(userId).all()

  // Fetch feedback counts for each card
  const cardIds = (results || []).map((card: any) => card.id)
  let feedbackCountMap: Record<number, number> = {}
  let unreadFeedbackMap: Record<number, number> = {}
  if (cardIds.length > 0) {
    const fbPlaceholders = cardIds.map(() => '?').join(',')
    const { results: fbCounts } = await c.env.DB.prepare(`
      SELECT card_id, COUNT(*) as total, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread
      FROM feedbacks WHERE card_id IN (${fbPlaceholders})
      GROUP BY card_id
    `).bind(...cardIds).all()
    for (const fb of (fbCounts || [])) {
      feedbackCountMap[fb.card_id as number] = fb.total as number
      unreadFeedbackMap[fb.card_id as number] = fb.unread as number
    }
  }

  // Fetch recent clicks (latest 3) for each card
  let recentClicksMap: Record<number, string[]> = {}
  if (cardIds.length > 0) {
    const placeholders = cardIds.map(() => '?').join(',')
    const { results: recentClicks } = await c.env.DB.prepare(`
      SELECT card_id, clicked_at FROM (
        SELECT card_id, clicked_at,
               ROW_NUMBER() OVER (PARTITION BY card_id ORDER BY clicked_at DESC) as rn
        FROM clicks
        WHERE card_id IN (${placeholders})
      ) WHERE rn <= 3
      ORDER BY card_id, clicked_at DESC
    `).bind(...cardIds).all()

    for (const click of (recentClicks || [])) {
      const cid = click.card_id as number
      if (!recentClicksMap[cid]) recentClicksMap[cid] = []
      recentClicksMap[cid].push(click.clicked_at as string)
    }
  }

  const cardsWithUrls = (results || []).map((card: any) => ({
    ...card,
    short_url: buildShortUrl(c, card.short_code),
    recent_clicks: recentClicksMap[card.id] || [],
    feedback_count: feedbackCountMap[card.id] || 0,
    unread_feedback: unreadFeedbackMap[card.id] || 0,
  }))

  return c.json({
    cards: cardsWithUrls,
    stores: stores || [],
    max_stores: maxStores,
    max_cards_per_store: maxCardsPerStore,
    // Keep backward compat
    max_cards: maxCardsPerStore,
  })
})

/**
 * GET /api/cards/qr-preview?url=...
 * Generate QR SVG for any URL (used in preview/done page)
 * IMPORTANT: This must be before /:id routes to avoid being caught by the wildcard
 */
cards.get('/qr-preview', async (c) => {
  const url = c.req.query('url')
  if (!url) return c.json({ error: 'URL is required' }, 400)

  const svg = generateQRSvg(url)
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
  })
})

/**
 * PUT /api/cards/:id
 * Update card (store name, CTA text, template)
 */
cards.put('/:id', async (c) => {
  const userId = await getUserId(c)
  if (!userId) return c.json({ error: 'ログインが必要です' }, 401)

  const id = c.req.param('id')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?')
    .bind(id, userId).first()
  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  const body = await c.req.json<{
    store_name?: string | null
    cta_text?: string | null
    template?: string
    label?: string | null
    gate_enabled?: number
  }>()

  const updates: string[] = []
  const values: any[] = []

  if (body.store_name !== undefined) {
    updates.push('store_name = ?')
    values.push(body.store_name || null)
    // Also update store name if this card has a store
    if (card.store_id && body.store_name) {
      await c.env.DB.prepare('UPDATE stores SET name = ? WHERE id = ?')
        .bind(body.store_name, card.store_id).run()
    }
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
  if (body.gate_enabled !== undefined) {
    updates.push('gate_enabled = ?')
    values.push(body.gate_enabled ? 1 : 0)
  }

  if (updates.length > 0) {
    values.push(id)
    await c.env.DB.prepare(`UPDATE cards SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values).run()
  }

  const updated = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(id).first()

  return c.json({
    success: true,
    card: {
      ...updated,
      short_url: buildShortUrl(c, updated!.short_code as string),
    },
  })
})

/**
 * GET /api/cards/:id
 * Get single card detail
 */
cards.get('/:id', async (c) => {
  const id = c.req.param('id')
  const card = await c.env.DB.prepare(`
    SELECT c.*, COUNT(cl.id) as click_count
    FROM cards c
    LEFT JOIN clicks cl ON cl.card_id = c.id
    WHERE c.id = ?
    GROUP BY c.id
  `).bind(id).first()

  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  return c.json({
    card: {
      ...card,
      short_url: buildShortUrl(c, card.short_code as string),
    }
  })
})

/**
 * GET /api/cards/:id/qr
 * Get QR code SVG for a card
 */
cards.get('/:id/qr', async (c) => {
  const id = c.req.param('id')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(id).first()
  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  const shortUrl = buildShortUrl(c, card.short_code as string)
  const svg = generateQRSvg(shortUrl)

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  })
})

/**
 * GET /api/cards/:id/pdf?layout=card|a4-single|a4-multi&copies=4
 * Download PDF for a card with layout options
 */
cards.get('/:id/pdf', async (c) => {
  const id = c.req.param('id')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(id).first()
  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  const shortUrl = buildShortUrl(c, card.short_code as string)

  // Get layout options from query params
  const layout = (c.req.query('layout') || 'card') as PDFLayout
  const copies = parseInt(c.req.query('copies') || '4', 10)

  const pdfBytes = await generateCardPDF({
    storeName: card.store_name as string | null,
    shortCode: card.short_code as string,
    shortUrl,
    template: card.template as string,
    imageData: card.image_key as string | null,
    ctaText: card.cta_text as string | null,
    layout,
    copies: Math.min(Math.max(copies, 1), 9),
  })

  // Use short_code for filename to avoid non-ASCII header issues
  const layoutSuffix = layout !== 'card' ? `_${layout}` : ''
  const safeFileName = `RevQ_${card.short_code}${layoutSuffix}.pdf`
  const utf8FileName = card.store_name
    ? `RevQ_${(card.store_name as string).replace(/\s+/g, '_')}${layoutSuffix}.pdf`
    : safeFileName

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(utf8FileName)}`,
    },
  })
})

/**
 * GET /api/cards/:id/feedbacks
 * Get feedbacks for a card (owner only)
 */
cards.get('/:id/feedbacks', async (c) => {
  const userId = await getUserId(c)
  if (!userId) return c.json({ error: 'ログインが必要です' }, 401)

  const id = c.req.param('id')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?')
    .bind(id, userId).first()
  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  const { results } = await c.env.DB.prepare(`
    SELECT id, message, created_at, is_read
    FROM feedbacks
    WHERE card_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `).bind(id).all()

  return c.json({ feedbacks: results || [] })
})

/**
 * PUT /api/cards/:id/feedbacks/read
 * Mark all feedbacks for a card as read
 */
cards.put('/:id/feedbacks/read', async (c) => {
  const userId = await getUserId(c)
  if (!userId) return c.json({ error: 'ログインが必要です' }, 401)

  const id = c.req.param('id')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?')
    .bind(id, userId).first()
  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  await c.env.DB.prepare('UPDATE feedbacks SET is_read = 1 WHERE card_id = ? AND is_read = 0')
    .bind(id).run()

  return c.json({ success: true })
})

/**
 * DELETE /api/cards/:id
 * Delete a card. If it's the last card in a store, also delete the store.
 */
cards.delete('/:id', async (c) => {
  const userId = await getUserId(c)
  if (!userId) return c.json({ error: 'ログインが必要です' }, 401)

  const id = c.req.param('id')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?')
    .bind(id, userId).first()
  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  const storeId = card.store_id as number | null

  await c.env.DB.prepare('DELETE FROM feedbacks WHERE card_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM clicks WHERE card_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM cards WHERE id = ?').bind(id).run()

  // If this was the last card in the store, also delete the store
  if (storeId) {
    const remaining = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM cards WHERE store_id = ?'
    ).bind(storeId).first()
    if ((remaining?.count as number) === 0) {
      await c.env.DB.prepare('DELETE FROM stores WHERE id = ?').bind(storeId).run()
    }
  }

  return c.json({ success: true })
})

/**
 * DELETE /api/cards/stores/:storeId
 * Delete a store and all its cards
 */
cards.delete('/stores/:storeId', async (c) => {
  const userId = await getUserId(c)
  if (!userId) return c.json({ error: 'ログインが必要です' }, 401)

  const storeId = c.req.param('storeId')
  const store = await c.env.DB.prepare('SELECT * FROM stores WHERE id = ? AND user_id = ?')
    .bind(storeId, userId).first()
  if (!store) return c.json({ error: '店舗が見つかりません' }, 404)

  // Get all cards for this store
  const { results: storeCards } = await c.env.DB.prepare(
    'SELECT id FROM cards WHERE store_id = ?'
  ).bind(storeId).all()

  // Delete feedbacks, clicks, and cards for this store
  for (const card of (storeCards || [])) {
    await c.env.DB.prepare('DELETE FROM feedbacks WHERE card_id = ?').bind(card.id).run()
    await c.env.DB.prepare('DELETE FROM clicks WHERE card_id = ?').bind(card.id).run()
  }
  await c.env.DB.prepare('DELETE FROM cards WHERE store_id = ?').bind(storeId).run()
  await c.env.DB.prepare('DELETE FROM stores WHERE id = ?').bind(storeId).run()

  return c.json({ success: true })
})

export default cards
