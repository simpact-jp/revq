import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import { HomePage } from './pages/home'
import { DonePage } from './pages/done'
import { LoginPage } from './pages/login'
import { DashboardPage } from './pages/dashboard'
import { AdminPage } from './pages/admin'
import authRoutes from './api/auth'
import cardRoutes from './api/cards'
import adminRoutes from './api/admin'
import type { Bindings } from './lib/types'

const app = new Hono<{ Bindings: Bindings }>()

// CORS for API routes
app.use('/api/*', cors())

// Mount API routes
app.route('/api/auth', authRoutes)
app.route('/api/cards', cardRoutes)
app.route('/api/admin', adminRoutes)

// Short URL redirect + click tracking
app.get('/r/:code', async (c) => {
  const code = c.req.param('code')
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE short_code = ? AND status = ?')
    .bind(code, 'active').first()

  if (!card) {
    return c.html(`
      <!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>リンク切れ — RevuQ</title>
      <script src="https://cdn.tailwindcss.com"></script></head>
      <body class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center p-8">
          <p class="text-6xl mb-4">😕</p>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">リンクが見つかりません</h1>
          <p class="text-gray-500 mb-6">このリンクは無効または削除されています</p>
          <a href="/" class="text-brand-600 hover:underline">RevuQ トップページへ</a>
        </div>
      </body></html>
    `, 404)
  }

  // Record click asynchronously
  const ua = c.req.header('user-agent') || ''
  const referer = c.req.header('referer') || ''
  c.executionCtx.waitUntil(
    c.env.DB.prepare('INSERT INTO clicks (card_id, user_agent, referer) VALUES (?, ?, ?)')
      .bind(card.id, ua, referer).run()
  )

  // Redirect to Google Maps URL
  return c.redirect(card.google_url as string, 302)
})

// ============ Page routes ============
app.use(renderer)

// Landing / Creation Flow
app.get('/', (c) => {
  return c.render(<HomePage />, { title: 'RevuQ — Googleレビュー依頼カードを無料作成' })
})

// Completion / Download — serves as template, JS fills from query params
app.get('/done', (c) => {
  return c.render(<DonePage />, { title: '作成完了 — RevuQ' })
})

// Login
app.get('/login', (c) => {
  return c.render(<LoginPage />, { title: 'ログイン — RevuQ' })
})

// Dashboard (User)
app.get('/dashboard', (c) => {
  return c.render(<DashboardPage />, { title: 'マイページ — RevuQ' })
})

// Admin (Operator)
app.get('/admin', (c) => {
  return c.render(<AdminPage />, { title: '運営管理 — RevuQ' })
})

export default app
