import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  const isAdmin = title?.toString().includes('運営管理')
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'RevQ — Googleレビュー依頼カードを無料作成'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
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
                <a href="/privacy" class="text-gray-400 hover:text-gray-600 transition-colors no-underline">プライバシーポリシー</a>
                <span class="text-gray-300">|</span>
                <a href="/terms" class="text-gray-400 hover:text-gray-600 transition-colors no-underline">利用規約</a>
              </div>
            )}
            <p class="text-center">© 2026 RevQ — Googleレビュー依頼カード作成ツール</p>
          </div>
        </footer>

        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
