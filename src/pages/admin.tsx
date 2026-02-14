export const AdminPage = () => {
  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Page Header */}
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">運営管理ダッシュボード</h1>
        <p class="text-sm text-gray-500 mt-0.5">RevQ サービス全体の状況を管理します</p>
      </div>

      {/* Tab Navigation */}
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
          <button type="button" class="admin-tab px-5 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors" data-tab="otp">
            <i class="fas fa-envelope mr-1.5"></i>OTP/メール
          </button>
          <button type="button" class="admin-tab px-5 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors" data-tab="settings">
            <i class="fas fa-cog mr-1.5"></i>設定
          </button>
        </nav>
      </div>

      {/* TAB: Overview */}
      <div id="tab-overview" class="admin-tab-content">
        {/* KPI Cards — filled by JS */}
        <div id="admin-kpi-grid" class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[1,2,3,4,5].map(() => (
            <div class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div class="h-3 w-20 bg-gray-200 rounded mb-3"></div>
              <div class="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-gray-900 text-sm">新規ユーザー（直近）</h3>
              <button type="button" class="admin-tab-link text-xs text-brand-600 hover:text-brand-700 font-semibold" data-target="users">すべて見る &rarr;</button>
            </div>
            <div id="admin-recent-users" class="divide-y divide-gray-50">
              <div class="px-5 py-4 text-center text-sm text-gray-400"><i class="fas fa-spinner fa-spin mr-1"></i>読み込み中…</div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-gray-900 text-sm">最近作成されたカード</h3>
              <button type="button" class="admin-tab-link text-xs text-brand-600 hover:text-brand-700 font-semibold" data-target="cards">すべて見る &rarr;</button>
            </div>
            <div id="admin-recent-cards" class="divide-y divide-gray-50">
              <div class="px-5 py-4 text-center text-sm text-gray-400"><i class="fas fa-spinner fa-spin mr-1"></i>読み込み中…</div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB: Users */}
      <div id="tab-users" class="admin-tab-content hidden">
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-900">ユーザー一覧（<span id="admin-users-count">-</span>）</h3>
          </div>
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
              <tbody id="admin-users-tbody" class="divide-y divide-gray-100">
                <tr><td colspan={7} class="px-5 py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-1"></i>読み込み中…</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TAB: Cards */}
      <div id="tab-cards" class="admin-tab-content hidden">
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-900">カード一覧（<span id="admin-cards-count">-</span>）</h3>
          </div>
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
              <tbody id="admin-cards-tbody" class="divide-y divide-gray-100">
                <tr><td colspan={8} class="px-5 py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-1"></i>読み込み中…</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TAB: OTP / Email */}
      <div id="tab-otp" class="admin-tab-content hidden">
        {/* Email Configuration Status */}
        <div id="admin-email-status" class="mb-6">
          <div class="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div class="h-4 w-32 bg-gray-200 rounded mb-3"></div>
            <div class="h-3 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* OTP Stats */}
        <div id="admin-otp-stats" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(() => (
            <div class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div class="h-3 w-20 bg-gray-200 rounded mb-3"></div>
              <div class="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Recent OTP Activity */}
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-900 text-sm">最近のOTPアクティビティ</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-left">
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">メールアドレス</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">送信日時</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">有効期限</th>
                  <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">状態</th>
                </tr>
              </thead>
              <tbody id="admin-otp-tbody" class="divide-y divide-gray-100">
                <tr><td colspan={4} class="px-5 py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-1"></i>読み込み中…</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TAB: Settings */}
      <div id="tab-settings" class="admin-tab-content hidden">
        <div class="max-w-3xl space-y-6">
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
                  <p class="font-semibold text-gray-800 text-sm">PDF下部にRevQロゴを表示</p>
                  <p class="text-xs text-gray-400">無料プランではロゴが必ず表示されます</p>
                </div>
                <button type="button" class="admin-toggle relative w-12 h-7 rounded-full bg-brand-600 transition-colors" data-active="true">
                  <span class="absolute top-0.5 left-[calc(100%-1.625rem)] w-6 h-6 bg-white rounded-full shadow transition-all"></span>
                </button>
              </div>
            </div>
          </div>

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

          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h3 class="font-bold text-gray-900">短縮URLドメイン</h3>
            </div>
            <div class="p-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">現在のドメイン</label>
                <div class="flex items-center gap-2">
                  <input type="text" value="revq.link" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" readonly />
                  <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-semibold"><i class="fas fa-check mr-0.5"></i>有効</span>
                </div>
              </div>
            </div>
          </div>

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

          <div class="flex justify-end">
            <button type="button" id="btn-save-settings" class="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-sm">
              <i class="fas fa-save mr-1.5"></i>設定を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
