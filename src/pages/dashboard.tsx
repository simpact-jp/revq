export const DashboardPage = () => {
  const mockCards = [
    {
      id: 1,
      storeName: 'カフェ こもれび',
      shortUrl: 'revuq.link/abc123',
      clicks: 47,
      template: 'カフェ風',
      createdAt: '2026-02-10',
    },
    {
      id: 2,
      storeName: '焼肉 大将',
      shortUrl: 'revuq.link/def456',
      clicks: 123,
      template: 'ポップ',
      createdAt: '2026-02-08',
    },
    {
      id: 3,
      storeName: 'Hair Salon BLOOM',
      shortUrl: 'revuq.link/ghi789',
      clicks: 31,
      template: 'ミニマル',
      createdAt: '2026-02-05',
    },
    {
      id: 4,
      storeName: '整体院 やすらぎ',
      shortUrl: 'revuq.link/jkl012',
      clicks: 8,
      template: 'ナチュラル',
      createdAt: '2026-02-01',
    },
  ]

  return (
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">管理画面</h1>
          <p class="text-sm text-gray-500 mt-0.5">作成したカードの一覧と統計</p>
        </div>
        <a
          href="/"
          class="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-sm no-underline"
        >
          <i class="fas fa-plus"></i>
          新しく作る
        </a>
      </div>

      {/* Summary Stats */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">総カード数</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">4</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">総クリック数</p>
          <p class="text-2xl sm:text-3xl font-bold text-brand-600">209</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">今月のクリック</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">78</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">平均クリック/日</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">6.0</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockCards.map((card) => (
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div class="p-5 sm:p-6">
              {/* Card Header */}
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">{card.storeName}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{card.template}</span>
                    <span class="text-xs text-gray-400">{card.createdAt}</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-brand-600">{card.clicks}</p>
                  <p class="text-[10px] text-gray-400 uppercase tracking-wider">クリック</p>
                </div>
              </div>

              {/* Short URL */}
              <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-4">
                <i class="fas fa-link text-gray-400 text-sm"></i>
                <code class="text-sm font-mono text-brand-600 flex-1 truncate">{card.shortUrl}</code>
                <button
                  type="button"
                  class="copy-url-btn p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-all"
                  data-url={card.shortUrl}
                  title="URLをコピー"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>

              {/* QR Code Mini */}
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-2">
                  <svg viewBox="0 0 100 100" width="56" height="56" class="text-gray-800">
                    <rect x="5" y="5" width="25" height="25" fill="currentColor" rx="2"/>
                    <rect x="70" y="5" width="25" height="25" fill="currentColor" rx="2"/>
                    <rect x="5" y="70" width="25" height="25" fill="currentColor" rx="2"/>
                    <rect x="10" y="10" width="15" height="15" fill="white" rx="1"/>
                    <rect x="75" y="10" width="15" height="15" fill="white" rx="1"/>
                    <rect x="10" y="75" width="15" height="15" fill="white" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" fill="currentColor"/>
                    <rect x="79" y="14" width="7" height="7" fill="currentColor"/>
                    <rect x="14" y="79" width="7" height="7" fill="currentColor"/>
                    <rect x="35" y="5" width="5" height="5" fill="currentColor"/>
                    <rect x="45" y="15" width="5" height="5" fill="currentColor"/>
                    <rect x="55" y="25" width="5" height="5" fill="currentColor"/>
                    <rect x="35" y="35" width="5" height="5" fill="currentColor"/>
                    <rect x="45" y="45" width="5" height="5" fill="currentColor"/>
                    <rect x="70" y="70" width="25" height="25" fill="currentColor" rx="2"/>
                    <rect x="75" y="75" width="15" height="15" fill="white" rx="1"/>
                    <rect x="79" y="79" width="7" height="7" fill="currentColor"/>
                  </svg>
                </div>
                <div class="flex gap-2 flex-1">
                  <button
                    type="button"
                    class="flex-1 text-xs font-semibold text-brand-600 border border-brand-200 hover:bg-brand-50 px-3 py-2 rounded-lg transition-all"
                  >
                    <i class="fas fa-download mr-1"></i>PDF
                  </button>
                  <button
                    type="button"
                    class="flex-1 text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all"
                  >
                    <i class="fas fa-qrcode mr-1"></i>QR画像
                  </button>
                  <button
                    type="button"
                    class="text-xs font-semibold text-red-400 border border-red-100 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state hint */}
      <div class="mt-8 text-center text-sm text-gray-400">
        <i class="fas fa-flask mr-1"></i>
        RevuQ プロトタイプ版 — モックデータを表示しています
      </div>
    </div>
  )
}
