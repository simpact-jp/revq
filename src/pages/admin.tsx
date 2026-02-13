export const AdminPage = () => {
  // Mock data
  const mockUsers = [
    { id: 1, email: 'tanaka@example.com', name: '田中 太郎', cards: 5, totalClicks: 312, plan: '無料', registeredAt: '2026-01-15', lastLogin: '2026-02-13' },
    { id: 2, email: 'suzuki@cafe.jp', name: '鈴木 花子', cards: 3, totalClicks: 189, plan: '無料', registeredAt: '2026-01-22', lastLogin: '2026-02-12' },
    { id: 3, email: 'sato@salon.com', name: '佐藤 美咲', cards: 8, totalClicks: 547, plan: '無料', registeredAt: '2026-01-28', lastLogin: '2026-02-11' },
    { id: 4, email: 'yamada@yakiniku.jp', name: '山田 健一', cards: 2, totalClicks: 98, plan: '無料', registeredAt: '2026-02-02', lastLogin: '2026-02-10' },
    { id: 5, email: 'watanabe@seitai.com', name: '渡辺 真司', cards: 1, totalClicks: 23, plan: '無料', registeredAt: '2026-02-08', lastLogin: '2026-02-09' },
    { id: 6, email: 'ito@bakery.jp', name: '伊藤 あゆみ', cards: 4, totalClicks: 201, plan: '無料', registeredAt: '2026-02-10', lastLogin: '2026-02-13' },
  ]

  const mockCards = [
    { id: 101, storeName: 'カフェ こもれび', shortUrl: 'revuq.link/abc123', clicks: 47, user: '鈴木 花子', template: 'カフェ風', createdAt: '2026-02-10', status: 'active' },
    { id: 102, storeName: '焼肉 大将', shortUrl: 'revuq.link/def456', clicks: 123, user: '山田 健一', template: 'ポップ', createdAt: '2026-02-08', status: 'active' },
    { id: 103, storeName: 'Hair Salon BLOOM', shortUrl: 'revuq.link/ghi789', clicks: 31, user: '佐藤 美咲', template: 'ミニマル', createdAt: '2026-02-05', status: 'active' },
    { id: 104, storeName: '整体院 やすらぎ', shortUrl: 'revuq.link/jkl012', clicks: 8, user: '渡辺 真司', template: 'ナチュラル', createdAt: '2026-02-01', status: 'active' },
    { id: 105, storeName: 'ベーカリー ふわり', shortUrl: 'revuq.link/mno345', clicks: 201, user: '伊藤 あゆみ', template: 'ナチュラル', createdAt: '2026-01-28', status: 'active' },
    { id: 106, storeName: 'ラーメン 極', shortUrl: 'revuq.link/pqr678', clicks: 312, user: '田中 太郎', template: 'ビビッド', createdAt: '2026-01-20', status: 'active' },
    { id: 107, storeName: '美容室 LUCE', shortUrl: 'revuq.link/stu901', clicks: 89, user: '佐藤 美咲', template: 'クリーン', createdAt: '2026-01-18', status: 'paused' },
    { id: 108, storeName: '居酒屋 月', shortUrl: 'revuq.link/vwx234', clicks: 56, user: '田中 太郎', template: '和風', createdAt: '2026-01-15', status: 'active' },
  ]

  const totalClicks = mockCards.reduce((sum, c) => sum + c.clicks, 0)
  const activeCards = mockCards.filter(c => c.status === 'active').length

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Page Header */}
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">運営管理ダッシュボード</h1>
        <p class="text-sm text-gray-500 mt-0.5">RevuQ サービス全体の状況を管理します</p>
      </div>

      {/* ====== Tab Navigation ====== */}
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex gap-0" id="admin-tabs">
          <button type="button" class="admin-tab active px-5 py-3 text-sm font-semibold border-b-2 border-brand-600 text-brand-600 transition-colors" data-tab="overview">
            <i class="fas fa-chart-line mr-1.5"></i>概要
          </button>
          <button type="button" class="admin-tab px-5 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors" data-tab="users">
            <i class="fas fa-users mr-1.5"></i>ユーザー
          </button>
          <button type="button" class="admin-tab px-5 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors" data-tab="cards">
            <i class="fas fa-id-card mr-1.5"></i>カード
          </button>
          <button type="button" class="admin-tab px-5 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors" data-tab="settings">
            <i class="fas fa-cog mr-1.5"></i>設定
          </button>
        </nav>
      </div>

      {/* ====== TAB: Overview ====== */}
      <div id="tab-overview" class="admin-tab-content">
        {/* KPI Cards */}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">総ユーザー数</p>
              <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-users text-brand-600 text-sm"></i>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{mockUsers.length}</p>
            <p class="text-xs text-green-500 mt-1"><i class="fas fa-arrow-up mr-0.5"></i>+2 今週</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">総カード数</p>
              <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-id-card text-amber-600 text-sm"></i>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{mockCards.length}</p>
            <p class="text-xs text-green-500 mt-1"><i class="fas fa-arrow-up mr-0.5"></i>+3 今週</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">総クリック数</p>
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-mouse-pointer text-green-600 text-sm"></i>
              </div>
            </div>
            <p class="text-3xl font-bold text-brand-600">{totalClicks.toLocaleString()}</p>
            <p class="text-xs text-green-500 mt-1"><i class="fas fa-arrow-up mr-0.5"></i>+87 今週</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">稼働カード</p>
              <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-check-circle text-violet-600 text-sm"></i>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{activeCards}</p>
            <p class="text-xs text-gray-400 mt-1">/ {mockCards.length} 全体</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-gray-900 text-sm">新規ユーザー（直近）</h3>
              <button type="button" class="admin-tab-link text-xs text-brand-600 hover:text-brand-700 font-semibold" data-target="users">すべて見る →</button>
            </div>
            <div class="divide-y divide-gray-50">
              {mockUsers.slice(0, 4).map((user) => (
                <div class="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p class="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">{user.registeredAt}</p>
                    <p class="text-xs text-gray-400">カード {user.cards}枚</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Cards */}
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-gray-900 text-sm">最近作成されたカード</h3>
              <button type="button" class="admin-tab-link text-xs text-brand-600 hover:text-brand-700 font-semibold" data-target="cards">すべて見る →</button>
            </div>
            <div class="divide-y divide-gray-50">
              {mockCards.slice(0, 4).map((card) => (
                <div class="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{card.storeName}</p>
                    <p class="text-xs text-gray-400">{card.user} ・ {card.template}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-bold text-brand-600">{card.clicks}</p>
                    <p class="text-[10px] text-gray-400">クリック</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== TAB: Users ====== */}
      <div id="tab-users" class="admin-tab-content hidden">
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-900">ユーザー一覧（{mockUsers.length}件）</h3>
            <div class="flex items-center gap-2">
              <div class="relative">
                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
                <input type="text" placeholder="メール・名前で検索" class="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none w-56" />
              </div>
              <button type="button" class="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                <i class="fas fa-download mr-1"></i>CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-left">
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ユーザー</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">カード数</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">総クリック</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">プラン</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">登録日</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">最終ログイン</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {mockUsers.map((user) => (
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-3.5">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p class="font-semibold text-gray-800">{user.name}</p>
                          <p class="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-5 py-3.5 font-semibold text-gray-800">{user.cards}</td>
                    <td class="px-5 py-3.5 font-semibold text-brand-600">{user.totalClicks}</td>
                    <td class="px-5 py-3.5">
                      <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{user.plan}</span>
                    </td>
                    <td class="px-5 py-3.5 text-gray-500">{user.registeredAt}</td>
                    <td class="px-5 py-3.5 text-gray-500">{user.lastLogin}</td>
                    <td class="px-5 py-3.5">
                      <div class="flex items-center gap-1">
                        <button type="button" class="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-all" title="詳細">
                          <i class="fas fa-eye text-sm"></i>
                        </button>
                        <button type="button" class="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all" title="停止">
                          <i class="fas fa-ban text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ====== TAB: Cards ====== */}
      <div id="tab-cards" class="admin-tab-content hidden">
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 class="font-bold text-gray-900">カード一覧（{mockCards.length}件）</h3>
            <div class="flex items-center gap-2">
              <div class="relative">
                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
                <input type="text" placeholder="店名・URLで検索" class="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none w-56" />
              </div>
              <select class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none">
                <option value="">すべてのステータス</option>
                <option value="active">稼働中</option>
                <option value="paused">一時停止</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-left">
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">店名</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">短縮URL</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">作成者</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">テンプレート</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">クリック</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">作成日</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">状態</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {mockCards.map((card) => (
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-3.5">
                      <p class="font-semibold text-gray-800">{card.storeName}</p>
                    </td>
                    <td class="px-5 py-3.5">
                      <code class="text-xs font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{card.shortUrl}</code>
                    </td>
                    <td class="px-5 py-3.5 text-gray-600">{card.user}</td>
                    <td class="px-5 py-3.5">
                      <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{card.template}</span>
                    </td>
                    <td class="px-5 py-3.5 font-bold text-brand-600">{card.clicks}</td>
                    <td class="px-5 py-3.5 text-gray-500">{card.createdAt}</td>
                    <td class="px-5 py-3.5">
                      {card.status === 'active' ? (
                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>稼働中
                        </span>
                      ) : (
                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>一時停止
                        </span>
                      )}
                    </td>
                    <td class="px-5 py-3.5">
                      <div class="flex items-center gap-1">
                        <button type="button" class="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-all" title="詳細">
                          <i class="fas fa-eye text-sm"></i>
                        </button>
                        <button type="button" class="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all" title={card.status === 'active' ? '一時停止' : '再開'}>
                          <i class={`fas ${card.status === 'active' ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                        </button>
                        <button type="button" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all" title="削除">
                          <i class="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ====== TAB: Settings ====== */}
      <div id="tab-settings" class="admin-tab-content hidden">
        <div class="max-w-3xl space-y-6">
          {/* Service Settings */}
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h3 class="font-bold text-gray-900">サービス設定</h3>
            </div>
            <div class="p-6 space-y-5">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-800 text-sm">新規ユーザー登録</p>
                  <p class="text-xs text-gray-400">新規ユーザーの登録を許可します</p>
                </div>
                <button type="button" class="admin-toggle relative w-12 h-7 rounded-full bg-brand-600 transition-colors" data-active="true">
                  <span class="absolute top-0.5 left-[calc(100%-1.625rem)] w-6 h-6 bg-white rounded-full shadow transition-all"></span>
                </button>
              </div>
              <hr class="border-gray-100" />
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-800 text-sm">未ログインでのカード作成</p>
                  <p class="text-xs text-gray-400">ログインなしでも1枚作成を許可</p>
                </div>
                <button type="button" class="admin-toggle relative w-12 h-7 rounded-full bg-brand-600 transition-colors" data-active="true">
                  <span class="absolute top-0.5 left-[calc(100%-1.625rem)] w-6 h-6 bg-white rounded-full shadow transition-all"></span>
                </button>
              </div>
              <hr class="border-gray-100" />
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-800 text-sm">PDF下部にRevuQロゴを表示</p>
                  <p class="text-xs text-gray-400">無料プランではロゴが必ず表示されます</p>
                </div>
                <button type="button" class="admin-toggle relative w-12 h-7 rounded-full bg-brand-600 transition-colors" data-active="true">
                  <span class="absolute top-0.5 left-[calc(100%-1.625rem)] w-6 h-6 bg-white rounded-full shadow transition-all"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Free Plan Limits */}
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h3 class="font-bold text-gray-900">無料プラン制限</h3>
            </div>
            <div class="p-6 space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">カード作成上限（枚/ユーザー）</label>
                <input type="number" value="5" class="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" />
                <p class="text-xs text-gray-400 mt-1">0 = 無制限</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">テンプレート利用可能数</label>
                <input type="number" value="10" class="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" />
                <p class="text-xs text-gray-400 mt-1">無料プランで利用できるテンプレート数</p>
              </div>
            </div>
          </div>

          {/* Short URL Domain */}
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h3 class="font-bold text-gray-900">短縮URLドメイン</h3>
            </div>
            <div class="p-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">現在のドメイン</label>
                <div class="flex items-center gap-2">
                  <input type="text" value="revuq.link" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" readonly />
                  <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-semibold"><i class="fas fa-check mr-0.5"></i>有効</span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div class="bg-white rounded-xl border border-red-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-red-100 bg-red-50">
              <h3 class="font-bold text-red-700 text-sm"><i class="fas fa-exclamation-triangle mr-1"></i>デンジャーゾーン</h3>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-800 text-sm">全データをリセット</p>
                  <p class="text-xs text-gray-400">すべてのユーザー・カードデータを削除します（復元不可）</p>
                </div>
                <button type="button" class="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors">
                  リセット
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <div class="flex justify-end">
            <button type="button" id="btn-save-settings" class="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-sm">
              <i class="fas fa-save mr-1.5"></i>設定を保存
            </button>
          </div>
        </div>
      </div>

      {/* Prototype Notice */}
      <div class="mt-8 text-center text-sm text-gray-400">
        <i class="fas fa-flask mr-1"></i>
        RevuQ 運営管理 — プロトタイプ版（モックデータ）
      </div>
    </div>
  )
}
