export const DonePage = () => {
  return (
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Success Card */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
        {/* Success Icon */}
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-check-circle text-green-500 text-4xl"></i>
        </div>

        <h1 id="done-heading" class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
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
                読み込み中…
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

          {/* QR Code — loaded dynamically */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">QRコード</label>
            <div id="qr-container" class="inline-block bg-white p-4 rounded-xl border border-gray-200">
              <div class="w-40 h-40 flex items-center justify-center text-gray-300">
                <i class="fas fa-spinner fa-spin text-3xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Layout Selection */}
        <div class="mb-6">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">印刷レイアウトを選択</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="layout-selector">
            {/* 1枚（A4拡大） */}
            <button
              type="button"
              class="pdf-layout-btn border-2 border-brand-500 ring-2 ring-brand-200 bg-brand-50 rounded-xl p-3 text-center transition-all hover:shadow-md cursor-pointer"
              data-layout="a4-single"
              data-copies="1"
            >
              <div class="w-full aspect-[3/4] bg-white border border-gray-200 rounded-lg mb-2 flex items-center justify-center relative">
                <div class="w-3/4 h-3/4 bg-brand-100 rounded border border-brand-200 flex items-center justify-center">
                  <i class="fas fa-qrcode text-brand-400 text-lg"></i>
                </div>
              </div>
              <p class="text-xs font-bold text-gray-700">1枚（拡大）</p>
              <p class="text-[10px] text-gray-400">A4全面</p>
            </button>

            {/* 2分割 */}
            <button
              type="button"
              class="pdf-layout-btn border-2 border-gray-200 rounded-xl p-3 text-center transition-all hover:shadow-md hover:border-gray-300 cursor-pointer"
              data-layout="a4-multi"
              data-copies="2"
            >
              <div class="w-full aspect-[3/4] bg-white border border-gray-200 rounded-lg mb-2 flex flex-col items-center justify-center gap-1 p-1">
                <div class="w-3/4 flex-1 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <i class="fas fa-qrcode text-gray-300 text-xs"></i>
                </div>
                <div class="w-3/4 flex-1 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <i class="fas fa-qrcode text-gray-300 text-xs"></i>
                </div>
              </div>
              <p class="text-xs font-bold text-gray-700">2分割</p>
              <p class="text-[10px] text-gray-400">A4に2枚</p>
            </button>

            {/* 4分割 */}
            <button
              type="button"
              class="pdf-layout-btn border-2 border-gray-200 rounded-xl p-3 text-center transition-all hover:shadow-md hover:border-gray-300 cursor-pointer"
              data-layout="a4-multi"
              data-copies="4"
            >
              <div class="w-full aspect-[3/4] bg-white border border-gray-200 rounded-lg mb-2 grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
                <div class="bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <i class="fas fa-qrcode text-gray-300 text-[8px]"></i>
                </div>
                <div class="bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <i class="fas fa-qrcode text-gray-300 text-[8px]"></i>
                </div>
                <div class="bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <i class="fas fa-qrcode text-gray-300 text-[8px]"></i>
                </div>
                <div class="bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <i class="fas fa-qrcode text-gray-300 text-[8px]"></i>
                </div>
              </div>
              <p class="text-xs font-bold text-gray-700">4分割</p>
              <p class="text-[10px] text-gray-400">A4に4枚</p>
            </button>

            {/* 8分割 */}
            <button
              type="button"
              class="pdf-layout-btn border-2 border-gray-200 rounded-xl p-3 text-center transition-all hover:shadow-md hover:border-gray-300 cursor-pointer"
              data-layout="a4-multi"
              data-copies="8"
            >
              <div class="w-full aspect-[3/4] bg-white border border-gray-200 rounded-lg mb-2 grid grid-cols-2 grid-rows-4 gap-0.5 p-1">
                {[1,2,3,4,5,6,7,8].map(() => (
                  <div class="bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                    <span class="w-1.5 h-1.5 bg-gray-300 rounded-sm"></span>
                  </div>
                ))}
              </div>
              <p class="text-xs font-bold text-gray-700">8分割</p>
              <p class="text-[10px] text-gray-400">A4に8枚</p>
            </button>
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
          PDF下部に「RevQ」の小さなロゴ表記が入ります
        </p>

        <hr class="border-gray-100 mb-6" />

        {/* Secondary Actions */}
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/#create"
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
            ログインして管理する
          </a>
        </div>
      </div>
    </div>
  )
}
