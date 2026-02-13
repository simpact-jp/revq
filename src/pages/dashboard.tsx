export const DashboardPage = () => {
  return (
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">マイページ</h1>
          <p class="text-sm text-gray-500 mt-0.5">
            <span id="dashboard-user-email" class="text-brand-600"></span>
            <span id="dashboard-user-name" class="ml-1 text-gray-400"></span>
          </p>
        </div>
        <div class="flex gap-3">
          <a
            href="/#create"
            class="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-sm no-underline"
          >
            <i class="fas fa-plus"></i>
            新しく作る
          </a>
          <button
            type="button"
            id="btn-logout"
            class="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-500 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
            onclick="fetch('/api/auth/logout',{method:'POST'}).then(()=>window.location.href='/login')"
          >
            <i class="fas fa-sign-out-alt"></i>
            ログアウト
          </button>
        </div>
      </div>

      {/* Summary Stats — filled by JS */}
      <div id="dashboard-stats" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 animate-pulse">
          <div class="h-3 w-16 bg-gray-200 rounded mb-2"></div>
          <div class="h-8 w-12 bg-gray-200 rounded"></div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 animate-pulse">
          <div class="h-3 w-16 bg-gray-200 rounded mb-2"></div>
          <div class="h-8 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Cards Grid — filled by JS */}
      <div id="dashboard-cards" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
          <div class="h-5 w-32 bg-gray-200 rounded mb-3"></div>
          <div class="h-3 w-48 bg-gray-200 rounded mb-4"></div>
          <div class="h-10 bg-gray-100 rounded-lg"></div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
          <div class="h-5 w-32 bg-gray-200 rounded mb-3"></div>
          <div class="h-3 w-48 bg-gray-200 rounded mb-4"></div>
          <div class="h-10 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      {/* Empty state */}
      <div id="dashboard-empty" class="hidden text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-inbox text-gray-300 text-3xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-700 mb-2">まだカードがありません</h3>
        <p class="text-sm text-gray-400 mb-6">最初のレビュー依頼カードを作成しましょう</p>
        <a
          href="/#create"
          class="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all no-underline"
        >
          <i class="fas fa-plus"></i>
          カードを作成する
        </a>
      </div>
    </div>
  )
}
