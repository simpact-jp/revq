/**
 * Geo-restriction middleware for Cloudflare Workers
 *
 * Blocks requests from outside Japan (or configured allowed countries)
 * while safely exempting external webhooks, short URL redirects,
 * static assets, and public-facing QR code endpoints.
 *
 * Uses Cloudflare's built-in cf.country from the incoming request
 * (populated automatically by Cloudflare's edge network).
 */

/**\n * Hono middleware types are inferred - no explicit import needed\n */

/**
 * Paths that are ALWAYS allowed regardless of country.
 *
 * Rationale for each exemption:
 *   /api/stripe/webhook   — Stripe sends webhooks from US/EU servers
 *   /api/feedback          — QR readers may be foreign tourists in Japan
 *   /r/                    — Short URL redirects (QR scans from any device)
 *   /static/               — CDN-cached static assets
 *   /api/tokushoho/        — Legal-page SVG images
 */
const EXEMPT_PREFIXES = [
  '/api/stripe/webhook',
  '/api/feedback',
  '/r/',
  '/static/',
  '/api/tokushoho/',
]

/**
 * Exact paths that are always allowed.
 */
const EXEMPT_EXACT = [
  '/favicon.ico',
  '/robots.txt',
]

/**
 * Check if a path is exempt from geo-restriction.
 */
function isExemptPath(path: string): boolean {
  // Exact matches
  if (EXEMPT_EXACT.includes(path)) return true

  // Prefix matches
  for (const prefix of EXEMPT_PREFIXES) {
    if (path.startsWith(prefix)) return true
  }

  return false
}

/**
 * Check if the request is to the short-link domain (revq.link).
 * All requests on the link domain are exempt — they're QR redirects.
 */
function isLinkDomainRequest(host: string, linkDomain: string): boolean {
  return host === linkDomain || host === `www.${linkDomain}`
}

/**
 * Render a user-friendly blocked page in Japanese.
 */
function renderBlockedPage(country: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>アクセス制限 — RevQ</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: { extend: { colors: { brand: { 500:'#3b82f6',600:'#2563eb',700:'#1d4ed8' } } } }
    }
  </script>
</head>
<body class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-8 text-center">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-globe-asia text-white text-2xl"></i>
        </div>
        <h1 class="text-white text-xl font-bold">アクセス制限</h1>
        <p class="text-blue-100 text-sm mt-2">Access Restricted</p>
      </div>
      <div class="p-6 text-center">
        <p class="text-gray-700 text-sm leading-relaxed mb-4">
          このサービスは<strong>日本国内</strong>からのみご利用いただけます。
        </p>
        <p class="text-gray-500 text-xs leading-relaxed mb-6">
          This service is available only from Japan.<br>
          If you are using a VPN, please switch to a Japanese server.
        </p>
        <div class="bg-gray-50 rounded-xl p-4 mb-4">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">検出された国コード / Detected Country</p>
          <p class="text-lg font-mono font-bold text-gray-800">${country || 'Unknown'}</p>
        </div>
        <div class="text-xs text-gray-400 space-y-1">
          <p><i class="fas fa-info-circle mr-1"></i>VPNをご利用の場合は日本のサーバーに切り替えてください</p>
          <p><i class="fas fa-envelope mr-1"></i>お問い合わせ: support@revq.jp</p>
        </div>
      </div>
      <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
        <p class="text-[10px] text-gray-400">&copy; 2026 RevQ</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

/**
 * Render a JSON error for blocked API requests.
 */
function renderBlockedJson(country: string) {
  return {
    error: 'このサービスは日本国内からのみご利用いただけます',
    error_en: 'This service is available only from Japan',
    country: country || 'Unknown',
    code: 'GEO_RESTRICTED',
  }
}

/**
 * Hono middleware: Geo-restriction
 *
 * Usage in index.tsx:
 *   import { geoRestrict } from './lib/geo-restrict'
 *   app.use('*', geoRestrict)
 */
export async function geoRestrict(c: any, next: any) {
  // --- Check if geo-restriction is enabled ---
  // Default: enabled ('true'). Set GEO_RESTRICT=false to disable.
  const enabled = (c.env.GEO_RESTRICT ?? 'true') !== 'false'
  if (!enabled) return next()

  // --- Get country code from Cloudflare's cf object ---
  const cfData = (c.req.raw as any).cf as { country?: string } | undefined
  const country = cfData?.country || ''

  // --- Parse allowed countries (default: JP only) ---
  const allowedRaw = c.env.GEO_ALLOWED_COUNTRIES || 'JP'
  const allowed = new Set(allowedRaw.split(',').map(s => s.trim().toUpperCase()))

  // --- If country is allowed, pass through ---
  if (country && allowed.has(country.toUpperCase())) return next()

  // --- Check exemptions ---
  const path = new URL(c.req.url).pathname
  const host = c.req.header('host') || ''
  const linkDomain = c.env.LINK_DOMAIN || 'revq.link'

  // All requests on the link domain (revq.link) are QR redirects — always allow
  if (isLinkDomainRequest(host, linkDomain)) return next()

  // Check path-based exemptions
  if (isExemptPath(path)) return next()

  // --- Development/local: no cf object → allow (wrangler dev) ---
  if (!country) {
    console.log(`[GeoRestrict] No country detected (local dev?) — allowing: ${path}`)
    return next()
  }

  // --- Block the request ---
  console.log(`[GeoRestrict] Blocked: country=${country}, path=${path}, host=${host}`)

  // Return appropriate format
  if (path.startsWith('/api/')) {
    return c.json(renderBlockedJson(country), 403)
  }

  return c.html(renderBlockedPage(country), 403)
}
