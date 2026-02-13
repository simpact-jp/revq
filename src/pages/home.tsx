export const HomePage = () => {
  const templates = [
    { id: 'simple', name: 'シンプル', color: 'from-gray-100 to-gray-200', accent: '#374151', desc: '万能' },
    { id: 'natural', name: 'ナチュラル', color: 'from-green-50 to-emerald-100', accent: '#059669', desc: '自然体' },
    { id: 'luxury', name: 'ラグジュアリー', color: 'from-amber-50 to-yellow-100', accent: '#92400e', desc: '高級感' },
    { id: 'pop', name: 'ポップ', color: 'from-pink-50 to-rose-100', accent: '#e11d48', desc: '明るい' },
    { id: 'cafe', name: 'カフェ風', color: 'from-orange-50 to-amber-100', accent: '#b45309', desc: '温かみ' },
    { id: 'japanese', name: '和風', color: 'from-red-50 to-rose-100', accent: '#991b1b', desc: '伝統的' },
    { id: 'clean', name: 'クリーン', color: 'from-sky-50 to-blue-100', accent: '#0369a1', desc: '清潔感' },
    { id: 'minimal', name: 'ミニマル', color: 'from-slate-50 to-slate-100', accent: '#334155', desc: '最小限' },
    { id: 'vivid', name: 'ビビッド', color: 'from-violet-50 to-purple-100', accent: '#7c3aed', desc: '鮮やか' },
    { id: 'photo', name: '写真強調', color: 'from-teal-50 to-cyan-100', accent: '#0d9488', desc: '写真映え' },
  ]

  return (
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Hero Section */}
      <div class="text-center mb-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Googleレビュー依頼カードを<span class="text-brand-600">無料</span>で作成
        </h1>
        <p class="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
          GoogleマップURLを貼るだけ。店名や写真も任意で追加できます。
        </p>
      </div>

      {/* Steps Indicator */}
      <div class="flex items-center justify-center gap-0 mb-10 max-w-md mx-auto" id="steps-indicator">
        <div class="flex items-center gap-2" id="step-ind-1">
          <div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">1</div>
          <span class="text-sm font-semibold text-brand-600 hidden sm:inline">情報入力</span>
        </div>
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 sm:mx-4" id="step-line-1"></div>
        <div class="flex items-center gap-2" id="step-ind-2">
          <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold">2</div>
          <span class="text-sm font-semibold text-gray-400 hidden sm:inline">テンプレート</span>
        </div>
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 sm:mx-4" id="step-line-2"></div>
        <div class="flex items-center gap-2" id="step-ind-3">
          <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold">3</div>
          <span class="text-sm font-semibold text-gray-400 hidden sm:inline">プレビュー</span>
        </div>
      </div>

      {/* ===== STEP 1: Input Form ===== */}
      <div id="step-1" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fas fa-edit text-brand-500"></i>
            店舗情報を入力
          </h2>

          <form id="card-form" class="space-y-6">
            {/* Google Map URL */}
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="google-url">
                GoogleマップのURL <span class="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="google-url"
                name="google_url"
                required
                placeholder="例）https://maps.app.goo.gl/xxxx"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
              <p class="mt-1.5 text-xs text-gray-400 flex items-start gap-1">
                <i class="fas fa-info-circle mt-0.5 text-gray-300"></i>
                Googleマップで店舗ページを開き、「共有」→「リンクをコピー」して貼り付けてください
              </p>
            </div>

            {/* Store Name */}
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="store-name">
                店名 <span class="text-gray-400 font-normal text-xs">（任意）</span>
              </label>
              <input
                type="text"
                id="store-name"
                name="store_name"
                placeholder="例）カフェ こもれび"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
              <p class="mt-1.5 text-xs text-gray-400">
                未入力の場合、カードに店名は表示されません
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                画像アップロード <span class="text-gray-400 font-normal text-xs">（任意・1枚のみ）</span>
              </label>
              <div
                id="drop-zone"
                class="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all"
              >
                <input type="file" id="image-upload" name="image" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div id="upload-placeholder">
                  <i class="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i>
                  <p class="text-sm text-gray-500">クリックまたはドラッグ&ドロップで画像を追加</p>
                  <p class="text-xs text-gray-400 mt-1">推奨：正方形 ／ 最大5MB ／ JPG, PNG</p>
                </div>
                <div id="upload-preview" class="hidden">
                  <img id="preview-image" class="max-h-32 mx-auto rounded-lg" alt="プレビュー" />
                  <button type="button" id="remove-image" class="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors">
                    <i class="fas fa-times mr-1"></i>削除
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              id="btn-to-step2"
              class="w-full bg-brand-600 text-white py-3.5 rounded-xl text-base font-bold hover:bg-brand-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              テンプレートを選ぶ
              <i class="fas fa-arrow-right text-sm"></i>
            </button>
          </form>
        </div>
      </div>

      {/* ===== STEP 2: Template Selection + Preview ===== */}
      <div id="step-2" class="hidden">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Templates */}
          <div class="lg:col-span-3">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i class="fas fa-palette text-brand-500"></i>
                  テンプレートを選択
                </h2>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">10種</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" id="template-grid">
                {templates.map((tpl, index) => (
                  <button
                    type="button"
                    class={`template-card group relative rounded-xl border-2 p-3 text-center transition-all hover:shadow-md cursor-pointer ${index === 0 ? 'border-brand-500 ring-2 ring-brand-200 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    data-template={tpl.id}
                    data-accent={tpl.accent}
                    data-index={index}
                  >
                    <div class={`w-full aspect-[3/4] rounded-lg bg-gradient-to-br ${tpl.color} mb-2 flex items-center justify-center`}>
                      <div class="w-6 h-6 bg-white/60 rounded" />
                    </div>
                    <p class="text-xs font-semibold text-gray-700 leading-tight">{tpl.name}</p>
                    <p class="text-[10px] text-gray-400">{tpl.desc}</p>
                    {index === 0 && (
                      <div class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center template-check">
                        <i class="fas fa-check text-white text-[10px]"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div class="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  id="btn-back-step1"
                  class="px-5 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <i class="fas fa-arrow-left text-xs"></i>
                  戻る
                </button>
                <button
                  type="button"
                  id="btn-generate"
                  class="flex-1 bg-brand-600 text-white py-3.5 rounded-xl text-base font-bold hover:bg-brand-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <i class="fas fa-file-pdf"></i>
                  PDFを生成する
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div class="lg:col-span-2">
            <div class="sticky top-24">
              <h3 class="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <i class="fas fa-eye text-brand-400"></i>
                リアルタイムプレビュー
              </h3>
              <div id="card-preview" class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Preview Card - Dynamic Content */}
                <div class="p-6" id="preview-content">
                  <div id="preview-template-wrapper" class="rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {/* Top accent bar */}
                    <div id="preview-accent-bar" class="h-2 bg-gray-600"></div>

                    <div class="p-5 space-y-4">
                      {/* Store Image */}
                      <div id="preview-img-section" class="hidden">
                        <img id="preview-card-image" class="w-20 h-20 rounded-lg object-cover mx-auto" alt="" />
                      </div>

                      {/* Store Name */}
                      <div id="preview-store-name-section" class="hidden text-center">
                        <p id="preview-store-name" class="font-bold text-lg text-gray-800"></p>
                      </div>

                      {/* CTA Text */}
                      <p class="text-center text-sm font-semibold text-gray-700">
                        Googleレビューにご協力ください
                      </p>

                      {/* QR Code Placeholder */}
                      <div class="flex justify-center">
                        <div class="w-28 h-28 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                          <svg viewBox="0 0 100 100" width="96" height="96" class="text-gray-800">
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

                      {/* Short URL */}
                      <p class="text-center text-xs text-gray-500 font-mono tracking-wide">
                        https://g-rev.link/abc123
                      </p>
                    </div>

                    {/* Footer branding */}
                    <div class="border-t border-gray-200/50 px-4 py-2 bg-white/40">
                      <p class="text-[9px] text-gray-400 text-center">Googleレビュー無料作成ツール</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div id="generating-overlay" class="hidden fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div class="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
          <div class="animate-spin w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto mb-4"></div>
          <p class="font-bold text-gray-800 text-lg">PDFを生成中…</p>
          <p class="text-sm text-gray-500 mt-1">少々お待ちください</p>
        </div>
      </div>
    </div>
  )
}
