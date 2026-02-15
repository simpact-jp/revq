import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { basicAuth } from 'hono/basic-auth'
import { renderer } from './renderer'
import { HomePage } from './pages/home'
import { DonePage } from './pages/done'
import { LoginPage } from './pages/login'
import { DashboardPage } from './pages/dashboard'
import { AdminPage } from './pages/admin'
import { PrivacyPage } from './pages/privacy'
import { TermsPage } from './pages/terms'
import { PricingPage } from './pages/pricing'
import { TokushohoPage } from './pages/tokushoho'
import authRoutes from './api/auth'
import cardRoutes from './api/cards'
import adminRoutes from './api/admin'
import feedbackRoutes from './api/feedback'
import stripeRoutes from './api/stripe'
import { sendWeeklyReports } from './lib/weekly-report'
import type { Bindings } from './lib/types'

const app = new Hono<{ Bindings: Bindings }>()

/**
 * Helper: check if the request is to the short-link domain (revq.link)
 */
function isLinkDomain(c: any): boolean {
  const host = c.req.header('host') || ''
  const linkDomain = c.env.LINK_DOMAIN || 'revq.link'
  // Match exact domain or www. prefix
  return host === linkDomain || host === `www.${linkDomain}`
}

/**
 * Helper: get the short URL base (always https://revq.link)
 */
function getShortUrlBase(c: any): string {
  const linkDomain = c.env.LINK_DOMAIN || 'revq.link'
  return `https://${linkDomain}`
}

/**
 * Helper: get the main site URL (always https://revq.jp)
 */
function getMainSiteUrl(c: any): string {
  const mainDomain = c.env.MAIN_DOMAIN || 'revq.jp'
  return `https://${mainDomain}`
}

// CORS for API routes
app.use('/api/*', cors())

// Basic Auth middleware for admin routes
// Password can be overridden via ADMIN_PASSWORD environment variable
app.use('/admin', async (c, next) => {
  const pw = c.env.ADMIN_PASSWORD || 'revq2026'
  const auth = basicAuth({ username: 'admin', password: pw, realm: 'RevQ Admin' })
  return auth(c, next)
})
app.use('/api/admin/*', async (c, next) => {
  const pw = c.env.ADMIN_PASSWORD || 'revq2026'
  const auth = basicAuth({ username: 'admin', password: pw, realm: 'RevQ Admin' })
  return auth(c, next)
})

// Mount API routes
app.route('/api/auth', authRoutes)
app.route('/api/cards', cardRoutes)
app.route('/api/feedback', feedbackRoutes)
app.route('/api/stripe', stripeRoutes)

// Admin API — protected by Basic Auth (middleware defined above)
app.route('/api/admin', adminRoutes)

// Admin: manually trigger weekly report (for testing)
app.post('/api/admin/trigger-weekly-report', async (c) => {
  const result = await sendWeeklyReports(
    c.env.DB,
    c.env.RESEND_API_KEY,
    c.env.OTP_FROM_EMAIL
  )
  return c.json({ success: true, ...result })
})

/**
 * Shared handler for short URL redirect + click tracking + satisfaction gate
 * Used by both /r/:code (legacy) and /:code (revq.link direct)
 */
async function handleShortUrl(c: any, code: string) {
  const card = await c.env.DB.prepare('SELECT * FROM cards WHERE short_code = ? AND status = ?')
    .bind(code, 'active').first()

  const mainSiteUrl = getMainSiteUrl(c)

  if (!card) {
    return c.html(`
      <!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>リンク切れ — RevQ</title>
      <script src="https://cdn.tailwindcss.com"></script></head>
      <body class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center p-8">
          <p class="text-6xl mb-4">😕</p>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">リンクが見つかりません</h1>
          <p class="text-gray-500 mb-6">このリンクは無効または削除されています</p>
          <a href="${mainSiteUrl}" class="text-blue-600 hover:underline">RevQ トップページへ</a>
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

  // If gate is enabled, show satisfaction gate page
  if (card.gate_enabled) {
    const storeName = (card.store_name as string) || ''
    const googleUrl = card.google_url as string
    const cardId = card.id as number
    // Check if card owner is Pro (hide branding)
    let hideBranding = false
    if (card.user_id) {
      const owner = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(card.user_id).first()
      if (owner && (owner.plan === 'plus' || owner.plan === 'pro')) hideBranding = true
    }
    return c.html(renderGatePage(storeName, googleUrl, cardId, mainSiteUrl, hideBranding))
  }

  // Otherwise, redirect directly to Google Maps URL
  return c.redirect(card.google_url as string, 302)
}

// Short URL redirect (legacy path — works on both domains)
app.get('/r/:code', async (c) => {
  return handleShortUrl(c, c.req.param('code'))
})

/**
 * Render the satisfaction gate page
 * - "満足" → redirect to Google review
 * - "不満" → show feedback form
 */
function renderGatePage(storeName: string, googleUrl: string, cardId: number, mainSiteUrl: string = 'https://revq.jp', hideBranding: boolean = false): string {
  const displayName = storeName ? `「${escHtml(storeName)}」` : '当店'
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ご感想をお聞かせください — RevQ</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: { extend: { colors: { brand: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' } } } }
    }
  </script>
  <style>
    @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    .fade-in { animation: fadeIn 0.5s ease-out; }
    .fade-in-delay { animation: fadeIn 0.5s ease-out 0.1s both; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">

  <!-- Gate: Satisfaction Question -->
  <div id="gate-view" class="w-full max-w-sm fade-in">
    <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-5 text-center">
        <p class="text-white text-sm font-medium opacity-80">ご来店ありがとうございます</p>
        <h1 class="text-white text-lg font-bold mt-1">${displayName}のサービスは<br>いかがでしたか？</h1>
      </div>
      <div class="p-6 space-y-3">
        <button onclick="handleSatisfied()" class="w-full flex items-center justify-center gap-3 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-400 text-green-800 rounded-2xl py-4 px-6 text-lg font-bold transition-all active:scale-95">
          <span class="text-3xl">😊</span>
          <span>満足</span>
        </button>
        <button onclick="handleDissatisfied()" class="w-full flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-400 text-gray-700 rounded-2xl py-4 px-6 text-lg font-bold transition-all active:scale-95">
          <span class="text-3xl">😔</span>
          <span>不満</span>
        </button>
      </div>
      <div class="px-6 pb-5">
        ${hideBranding ? '' : '<p class="text-[10px] text-gray-300 text-center">Powered by RevQ</p>'}
      </div>
    </div>
  </div>

  <!-- Feedback Form (hidden initially) -->
  <div id="feedback-view" class="w-full max-w-sm hidden">
    <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden fade-in">
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-5 text-center">
        <p class="text-gray-300 text-sm font-medium">ご意見をお聞かせください</p>
        <h2 class="text-white text-lg font-bold mt-1">不満に思われた点を<br>教えてください</h2>
      </div>
      <div class="p-6">
        <textarea id="feedback-message" rows="5" maxlength="2000" placeholder="お気づきの点やご要望をご自由にお書きください…" class="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none transition-all"></textarea>
        <p class="text-xs text-gray-400 mt-1 text-right"><span id="char-count">0</span>/2000</p>
        <button id="btn-submit-feedback" onclick="submitFeedback()" class="w-full mt-4 bg-brand-600 text-white py-3.5 rounded-xl text-base font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2">
          <i class="fas fa-paper-plane text-sm"></i>
          送信する
        </button>
        <button onclick="goBack()" class="w-full mt-2 text-gray-400 hover:text-gray-600 py-2 text-sm transition-colors">
          <i class="fas fa-arrow-left mr-1"></i> 戻る
        </button>
      </div>
    </div>
  </div>

  <!-- Thank You (hidden initially) -->
  <div id="thanks-view" class="w-full max-w-sm hidden">
    <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden fade-in">
      <div class="p-8 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <i class="fas fa-heart text-green-500 text-3xl"></i>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">ご意見ありがとうございました</h2>
        <p class="text-gray-500 text-sm leading-relaxed">いただいたフィードバックは<br>サービス改善に活用させていただきます。</p>
      </div>
      <div class="px-6 pb-6">
        ${hideBranding ? '' : '<p class="text-[10px] text-gray-300 text-center">Powered by RevQ</p>'}
      </div>
    </div>
  </div>

  <script>
    const GOOGLE_URL = ${JSON.stringify(googleUrl)};
    const CARD_ID = ${cardId};

    function handleSatisfied() {
      window.location.href = GOOGLE_URL;
    }

    function handleDissatisfied() {
      document.getElementById('gate-view').classList.add('hidden');
      document.getElementById('feedback-view').classList.remove('hidden');
      document.getElementById('feedback-message').focus();
    }

    function goBack() {
      document.getElementById('feedback-view').classList.add('hidden');
      document.getElementById('gate-view').classList.remove('hidden');
    }

    // Character counter
    document.getElementById('feedback-message').addEventListener('input', function() {
      document.getElementById('char-count').textContent = this.value.length;
    });

    async function submitFeedback() {
      const msg = document.getElementById('feedback-message').value.trim();
      if (!msg) {
        document.getElementById('feedback-message').classList.add('border-red-400', 'ring-2', 'ring-red-200');
        setTimeout(() => {
          document.getElementById('feedback-message').classList.remove('border-red-400', 'ring-2', 'ring-red-200');
        }, 600);
        return;
      }

      const btn = document.getElementById('btn-submit-feedback');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中…';
      btn.disabled = true;

      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ card_id: CARD_ID, message: msg }),
        });
        if (!res.ok) throw new Error();

        document.getElementById('feedback-view').classList.add('hidden');
        document.getElementById('thanks-view').classList.remove('hidden');
      } catch {
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> エラー';
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane text-sm"></i> 送信する';
          btn.disabled = false;
        }, 2000);
      }
    }
  </script>
</body>
</html>`
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ============ Tokushoho SVG image API (anti-crawl) ============
// Personal info is stored as UTF-8 byte arrays (not plain text) and decoded at runtime
// so crawlers/scrapers cannot extract it from HTML source or built JS
app.get('/api/tokushoho/:field', (c) => {
  const field = c.req.param('field')

  // UTF-8 byte arrays — decoded only at request time
  // These are the UTF-8 byte sequences for the personal info strings
  const entries: Record<string, { bytes: number[]; width: number }> = {
    // "深草　智裕" in UTF-8 bytes
    name: {
      bytes: [0xE6,0xB7,0xB1,0xE8,0x8D,0x89,0xE3,0x80,0x80,0xE6,0x99,0xBA,0xE8,0xA3,0x95],
      width: 120,
    },
    // "090-2398-6588" in UTF-8 bytes
    phone: {
      bytes: [0x30,0x39,0x30,0x2D,0x32,0x33,0x39,0x38,0x2D,0x36,0x35,0x38,0x38],
      width: 135,
    },
  }
  const info = entries[field]
  if (!info) return c.notFound()

  // Decode UTF-8 bytes to string at runtime
  const text = new TextDecoder().decode(new Uint8Array(info.bytes))

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="20" viewBox="0 0 ${info.width} 20"><text x="0" y="15" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="14" fill="#111827">${text}</text></svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
    },
  })
})

// ============ Page routes ============
app.use(renderer)

// Landing / Creation Flow
// On revq.link: root redirects to main site
// On revq.jp (or others): show the landing page
app.get('/', (c) => {
  if (isLinkDomain(c)) {
    return c.redirect(getMainSiteUrl(c), 302)
  }
  return c.render(<HomePage />, { title: 'RevQ — Googleレビュー依頼カードを無料作成' })
})

// Completion / Download — serves as template, JS fills from query params
app.get('/done', (c) => {
  if (isLinkDomain(c)) return c.redirect(`${getMainSiteUrl(c)}/done?${c.req.url.split('?')[1] || ''}`, 302)
  return c.render(<DonePage />, { title: '作成完了 — RevQ' })
})

// Login
app.get('/login', (c) => {
  if (isLinkDomain(c)) return c.redirect(`${getMainSiteUrl(c)}/login`, 302)
  return c.render(<LoginPage />, { title: 'ログイン — RevQ' })
})

// Dashboard (User)
app.get('/dashboard', (c) => {
  if (isLinkDomain(c)) return c.redirect(`${getMainSiteUrl(c)}/dashboard`, 302)
  return c.render(<DashboardPage />, { title: 'マイページ — RevQ' })
})

// Legal pages
app.get('/privacy', (c) => {
  if (isLinkDomain(c)) return c.redirect(`${getMainSiteUrl(c)}/privacy`, 302)
  return c.render(<PrivacyPage />, { title: 'プライバシーポリシー — RevQ' })
})

app.get('/terms', (c) => {
  if (isLinkDomain(c)) return c.redirect(`${getMainSiteUrl(c)}/terms`, 302)
  return c.render(<TermsPage />, { title: '利用規約 — RevQ' })
})

// Pricing
app.get('/pricing', (c) => {
  if (isLinkDomain(c)) return c.redirect(`${getMainSiteUrl(c)}/pricing`, 302)
  return c.render(<PricingPage />, { title: '料金プラン — RevQ' })
})

// Tokushoho (特定商取引法に基づく表記)
app.get('/tokushoho', (c) => {
  if (isLinkDomain(c)) return c.redirect(`${getMainSiteUrl(c)}/tokushoho`, 302)
  return c.render(<TokushohoPage />, { title: '特定商取引法に基づく表記 — RevQ' })
})

// Admin (Operator) — protected by Basic Auth (middleware defined above)
app.get('/admin', (c) => {
  if (isLinkDomain(c)) return c.redirect(`${getMainSiteUrl(c)}/admin`, 302)
  return c.render(<AdminPage />, { title: '運営管理 — RevQ' })
})

// ============ revq.link: /:code direct short URL (must be LAST) ============
// This catch-all matches any path on revq.link that wasn't handled above
// e.g. revq.link/abc123 → short URL handler
app.get('/:code', async (c) => {
  // Only activate on the link domain to avoid catching all routes on main site
  if (!isLinkDomain(c)) {
    return c.notFound()
  }
  const code = c.req.param('code')
  // Skip paths that look like file requests
  if (code.includes('.')) {
    return c.notFound()
  }
  return handleShortUrl(c, code)
})

// Cloudflare Workers Cron Trigger handler
// Runs every Monday at 00:00 UTC (= 09:00 JST)
const scheduled: ExportedHandlerScheduledHandler<Bindings> = async (event, env, ctx) => {
  console.log(`[Cron] Triggered at ${new Date().toISOString()} — cron: ${event.cron}`)
  ctx.waitUntil(
    sendWeeklyReports(env.DB, env.RESEND_API_KEY, env.OTP_FROM_EMAIL)
  )
}

// Export both the Hono app (fetch handler) and the scheduled handler
export default {
  fetch: app.fetch,
  scheduled,
}
