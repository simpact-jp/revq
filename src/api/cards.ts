import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import type { Bindings, CreateCardRequest } from '../lib/types'
import { generateShortCode, verifyJWT } from '../lib/utils'
import { generateQRSvg } from '../lib/qr'
import { generateCardPDF } from '../lib/pdf'

const JWT_SECRET_DEFAULT = 'revuq-dev-secret-change-in-production'

const cards = new Hono<{ Bindings: Bindings }>()

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
 */
cards.post('/', async (c) => {
  const body = await c.req.json<CreateCardRequest>()

  if (!body.google_url) {
    return c.json({ error: 'GoogleマップのURLは必須です' }, 400)
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

  const userId = await getUserId(c)
  const template = body.template || 'simple'
  const storeName = body.store_name || null
  const imageData = body.image_data || null

  await c.env.DB.prepare(
    'INSERT INTO cards (user_id, store_name, google_url, short_code, template, image_key) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(userId, storeName, body.google_url, shortCode, template, imageData).run()

  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE short_code = ?')
    .bind(shortCode).first()

  const origin = new URL(c.req.url).origin

  return c.json({
    success: true,
    card: {
      id: card!.id,
      store_name: card!.store_name,
      short_code: card!.short_code,
      template: card!.template,
      short_url: `${origin}/r/${shortCode}`,
      created_at: card!.created_at,
    },
  })
})

/**
 * GET /api/cards
 * List cards for current user
 */
cards.get('/', async (c) => {
  const userId = await getUserId(c)
  if (!userId) {
    return c.json({ error: 'ログインが必要です' }, 401)
  }

  const { results } = await c.env.DB.prepare(`
    SELECT c.id, c.store_name, c.google_url, c.short_code, c.template, c.created_at, c.status,
           COUNT(cl.id) as click_count
    FROM cards c
    LEFT JOIN clicks cl ON cl.card_id = c.id
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).bind(userId).all()

  const origin = new URL(c.req.url).origin
  const cardsWithUrls = (results || []).map((card: any) => ({
    ...card,
    short_url: `${origin}/r/${card.short_code}`,
  }))

  return c.json({ cards: cardsWithUrls })
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

  const origin = new URL(c.req.url).origin
  return c.json({
    card: {
      ...card,
      short_url: `${origin}/r/${card.short_code}`,
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

  const shortUrl = `${new URL(c.req.url).origin}/r/${card.short_code}`
  const svg = generateQRSvg(shortUrl)

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  })
})

/**
 * GET /api/cards/:id/pdf
 * Download PDF for a card
 */
cards.get('/:id/pdf', async (c) => {
  const id = c.req.param('id')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(id).first()
  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  const shortUrl = `${new URL(c.req.url).origin}/r/${card.short_code}`

  const pdfBytes = await generateCardPDF({
    storeName: card.store_name as string | null,
    shortCode: card.short_code as string,
    shortUrl,
    template: card.template as string,
    imageData: card.image_key as string | null,
  })

  // Use short_code for filename to avoid non-ASCII header issues
  const safeFileName = `RevuQ_${card.short_code}.pdf`
  // For browsers that support RFC 5987, also provide UTF-8 encoded filename
  const utf8FileName = card.store_name
    ? `RevuQ_${(card.store_name as string).replace(/\s+/g, '_')}.pdf`
    : safeFileName

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(utf8FileName)}`,
    },
  })
})

/**
 * DELETE /api/cards/:id
 */
cards.delete('/:id', async (c) => {
  const userId = await getUserId(c)
  if (!userId) return c.json({ error: 'ログインが必要です' }, 401)

  const id = c.req.param('id')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?')
    .bind(id, userId).first()
  if (!card) return c.json({ error: 'カードが見つかりません' }, 404)

  await c.env.DB.prepare('DELETE FROM clicks WHERE card_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM cards WHERE id = ?').bind(id).run()

  return c.json({ success: true })
})

export default cards
