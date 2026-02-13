import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Googleレビュー無料作成ツール'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'><rect width='28' height='28' rx='6' fill='%232563eb'/><path d='M7 14L12 19L21 9' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
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
      <body class="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        {/* Header */}
        <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors no-underline">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="6" fill="currentColor"/>
                <path d="M7 14L12 19L21 9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="font-bold text-lg tracking-tight">レビューカード作成</span>
            </a>
            <nav class="flex items-center gap-3">
              <a href="/login" class="text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 no-underline" id="nav-login">ログイン</a>
              <a href="/dashboard" class="text-sm bg-brand-600 text-white hover:bg-brand-700 transition-colors px-4 py-2 rounded-lg no-underline hidden" id="nav-dashboard">管理画面</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main class="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer class="bg-white border-t border-gray-200 mt-auto">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-gray-400">
            <p>© 2026 Googleレビュー無料作成ツール — プロトタイプ版</p>
          </div>
        </footer>

        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
