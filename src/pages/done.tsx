export const DonePage = () => {
  return (
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Success Card */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
        {/* Success Icon */}
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-check-circle text-green-500 text-4xl"></i>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          QRコード付きPDFを作成しました
        </h1>
        <p class="text-gray-500 mb-8">カードは印刷してすぐにご利用いただけます</p>

        {/* Result Details */}
        <div class="bg-gray-50 rounded-xl p-6 mb-8 space-y-5">
          {/* Short URL */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">短縮URL</label>
            <div class="flex items-center justify-center gap-2">
              <code id="short-url" class="text-base sm:text-lg font-mono text-brand-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
                revuq.link/abc123
              </code>
              <button
                type="button"
                id="copy-url-btn"
                class="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                title="コピー"
              >
                <i class="fas fa-copy text-lg"></i>
              </button>
            </div>
            <p id="copy-feedback" class="text-xs text-green-500 mt-1 opacity-0 transition-opacity">コピーしました！</p>
          </div>

          {/* QR Code */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">QRコード</label>
            <div class="inline-block bg-white p-4 rounded-xl border border-gray-200">
              <svg viewBox="0 0 100 100" width="140" height="140" class="text-gray-800">
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
                <rect x="45" y="5" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="5" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="15" width="5" height="5" fill="currentColor"/>
                <rect x="50" y="15" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="25" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="25" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="25" width="5" height="5" fill="currentColor"/>
                <rect x="5" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="15" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="5" y="45" width="5" height="5" fill="currentColor"/>
                <rect x="25" y="45" width="5" height="5" fill="currentColor"/>
                <rect x="5" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="15" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="45" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="70" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="80" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="90" y="45" width="5" height="5" fill="currentColor"/>
                <rect x="70" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="80" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="70" y="70" width="25" height="25" fill="currentColor" rx="2"/>
                <rect x="75" y="75" width="15" height="15" fill="white" rx="1"/>
                <rect x="79" y="79" width="7" height="7" fill="currentColor"/>
                <rect x="35" y="70" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="70" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="80" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="90" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="80" width="5" height="5" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          type="button"
          id="btn-download-pdf"
          class="w-full sm:w-auto bg-brand-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-brand-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 mx-auto mb-4"
        >
          <i class="fas fa-download"></i>
          PDFをダウンロード
        </button>

        <p class="text-xs text-gray-400 mb-8">
          <i class="fas fa-info-circle mr-1"></i>
          PDF下部に「RevuQ」の小さなロゴ表記が入ります
        </p>

        <hr class="border-gray-100 mb-6" />

        {/* Secondary Actions */}
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all no-underline"
          >
            <i class="fas fa-plus"></i>
            別デザインで作る
          </a>
          <a
            href="/login"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand-200 text-brand-600 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-all no-underline"
          >
            <i class="fas fa-user"></i>
            ログインして管理する（RevuQ）
          </a>
        </div>
      </div>
    </div>
  )
}
