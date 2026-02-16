import { jsxRenderer } from 'hono/jsx-renderer'

// Build version for cache busting — changes with each deployment
const BUILD_VERSION = Date.now().toString(36)

export const renderer = jsxRenderer(({ children, title }) => {
  const isAdmin = title?.toString().includes('運営管理')
  const pageTitle = title || 'RevQ — Googleレビュー依頼カード作成ツール｜QRコード付き｜無料'
  const description = 'RevQ（レビューキュー）は、GoogleマップのURLを貼るだけでQRコード付きレビュー依頼カードを30秒で作成できる無料ツールです。満足/不満ゲート機能でネガティブレビューを事前に防止。飲食店・美容室・クリニックなど店舗ビジネスのGoogle口コミ対策に最適。'
  const keywords = 'Googleレビュー,口コミ,QRコード,レビュー依頼,カード作成,無料,店舗,飲食店,美容室,クリニック,歯科,エステ,Google口コミ,レビュー対策,MEO対策,Googleマップ,レビュー管理,ネガティブレビュー防止,満足度調査,顧客フィードバック,RevQ'
  const siteUrl = 'https://revq.jp'
  const ogImage = `${siteUrl}/static/images/hero-reviews.png`

  // JSON-LD structured data for SoftwareApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RevQ',
    description: 'Googleレビュー依頼カードを30秒で作成できる無料ツール。QRコード付きカードを自動生成し、満足/不満ゲート機能でネガティブレビューを防止。',
    url: siteUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'JPY',
        name: 'Freeプラン',
        description: '無料プラン：店舗2件・各店舗QRコード2枚まで'
      },
      {
        '@type': 'Offer',
        price: '300',
        priceCurrency: 'JPY',
        name: 'Plusプラン（月額）',
        description: 'Plusプラン：店舗20件・QR無制限・フィードバック通知メール・RevQロゴ非表示'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '50'
    },
    featureList: 'QRコード作成,レビュー依頼カード,満足不満ゲート,フィードバック管理,読み取りデータ分析,週次レポートメール,10種のデザインテンプレート,PDF印刷対応'
  }

  // JSON-LD for FAQPage
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'RevQは無料で使えますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい、RevQは完全無料でご利用いただけます。無料プランでは店舗3件、各店舗2枚のQRコードを作成できます。'
        }
      },
      {
        '@type': 'Question',
        name: 'Googleレビュー依頼カードはどうやって作りますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GoogleマップのURLを貼り付け、テンプレートを選択するだけで30秒でQRコード付きのレビュー依頼カードが作成できます。PDFでダウンロードして印刷するだけで運用開始できます。'
        }
      },
      {
        '@type': 'Question',
        name: '満足/不満ゲート機能とは何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'QRコードを読み取ったお客様に「満足」か「不満」を聞く機能です。満足の場合はGoogleレビューページへ、不満の場合は店舗に直接フィードバックを送信。これにより、ネガティブレビューがGoogleに公開される前に問題を把握・改善できます。'
        }
      },
      {
        '@type': 'Question',
        name: 'どんな業種で使えますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '飲食店・カフェ、美容室・ヘアサロン、クリニック・歯科、エステ・リラクゼーションなど、お客様と直接接するすべての店舗ビジネスでご活用いただけます。'
        }
      }
    ]
  }

  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>

        {/* SEO Meta Tags */}
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="RevQ" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content="RevQ — Googleレビュー依頼カードを30秒で無料作成" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="RevQ" />
        <meta property="og:locale" content="ja_JP" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RevQ — Googleレビュー依頼カードを30秒で無料作成" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Additional SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="alternate" hreflang="ja" href={siteUrl} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href={`/static/style.css?v=${BUILD_VERSION}`} rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%232563eb'/><text x='16' y='22' font-family='system-ui,sans-serif' font-size='18' font-weight='bold' fill='white' text-anchor='middle'>Q</text></svg>" />
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  brand: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                  }
                }
              }
            }
          }
        `}} />
      </head>
      <body class={`text-gray-800 min-h-screen flex flex-col ${isAdmin ? 'bg-gray-100' : 'bg-gray-50'}`}>
        {/* Header */}
        <header class={`sticky top-0 z-50 ${isAdmin ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
          <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href={isAdmin ? '/admin' : '/'} class={`flex items-center gap-2.5 no-underline ${isAdmin ? 'text-white' : 'text-brand-600 hover:text-brand-700'} transition-colors`}>
              <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-extrabold text-sm">Q</span>
              </div>
              <span class={`font-bold text-lg tracking-tight ${isAdmin ? 'text-white' : ''}`}>RevQ</span>
              {isAdmin && <span class="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold ml-1">Admin</span>}
            </a>
            <nav class="flex items-center gap-3">
              {isAdmin ? (
                <>
                  <a href="/" class="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 no-underline">公開サイト</a>
                  <span class="text-sm text-gray-500 px-2 py-1">admin@revq.jp</span>
                </>
              ) : (
                <>
                  <a href="/pricing" class="text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 no-underline hidden sm:inline" id="nav-pricing">料金</a>
                  <a href="/login" class="text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 no-underline" id="nav-login">ログイン</a>
                  <a href="/dashboard" class="text-sm bg-brand-600 text-white hover:bg-brand-700 transition-colors px-4 py-2 rounded-lg no-underline hidden" id="nav-dashboard">管理画面</a>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main class="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer class={`border-t mt-auto ${isAdmin ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div class={`max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm ${isAdmin ? 'text-gray-500' : 'text-gray-400'}`}>
            {!isAdmin && (
              <div class="flex items-center justify-center gap-4 mb-3">
                <a href="/pricing" class="text-gray-400 hover:text-gray-600 transition-colors no-underline">料金プラン</a>
                <span class="text-gray-300">|</span>
                <a href="/privacy" class="text-gray-400 hover:text-gray-600 transition-colors no-underline">プライバシーポリシー</a>
                <span class="text-gray-300">|</span>
                <a href="/terms" class="text-gray-400 hover:text-gray-600 transition-colors no-underline">利用規約</a>
                <span class="text-gray-300">|</span>
                <a href="/tokushoho" class="text-gray-400 hover:text-gray-600 transition-colors no-underline">特定商取引法</a>
              </div>
            )}
            <p class="text-center">© 2026 RevQ — Googleレビュー依頼カード作成ツール</p>
          </div>
        </footer>

        <script src={`/static/app.js?v=${BUILD_VERSION}`}></script>
      </body>
    </html>
  )
})
