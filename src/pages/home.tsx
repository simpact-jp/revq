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
    <div>
      {/* ============================================================
          HERO SECTION — Full-bleed Google reviews cover image
      ============================================================ */}
      <section class="relative overflow-hidden text-white min-h-[520px] md:min-h-[600px] flex items-center">
        {/* Full background image */}
        <div class="absolute inset-0">
          <img
            src="/static/images/hero-map.png"
            alt="Google Map レビューイメージ"
            class="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full">
          <div class="max-w-xl">
            <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <i class="fas fa-bolt text-amber-300"></i>
              登録不要・完全無料
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5 drop-shadow-lg">
              Googleレビュー<br />
              依頼カードを<br class="sm:hidden" />
              <span class="text-amber-300">30秒</span>で作成
            </h1>
            <p class="text-lg sm:text-xl text-gray-100 leading-relaxed mb-8 max-w-lg drop-shadow">
              GoogleマップのURLを貼るだけ。<br class="hidden sm:block" />
              QRコード付きカードを即座に生成し、<br class="hidden sm:block" />
              読み取りデータを管理画面で分析できます。
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <a
                href="#create"
                class="inline-flex items-center justify-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all no-underline"
              >
                <i class="fas fa-arrow-down"></i>
                今すぐ無料で作る
              </a>
              <a
                href="/login"
                class="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-white/10 transition-all no-underline backdrop-blur-sm"
              >
                <i class="fas fa-chart-line text-sm"></i>
                管理画面を見る
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          QR CREATION + ANALYTICS SECTION
      ============================================================ */}
      <section class="bg-white border-b border-gray-100">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div class="text-center mb-14">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">かんたん2つの機能</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Card 1: 30sec QR Creation */}
            <div class="group relative bg-gradient-to-br from-brand-50 to-blue-50 rounded-2xl p-8 border border-brand-100 hover:shadow-lg transition-all">
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <i class="fas fa-qrcode text-white text-2xl"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-xl font-bold text-gray-900">30秒でQRコードを作成</h3>
                    <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">FAST</span>
                  </div>
                  <p class="text-gray-600 leading-relaxed mb-4">
                    GoogleマップのURLを貼り付けるだけで、QRコード付きのレビュー依頼カードが自動生成されます。
                    10種類のデザインテンプレートから選んで、そのまま印刷用PDFをダウンロード。
                  </p>
                  <ul class="space-y-2">
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-brand-500 text-xs"></i>
                      URL貼り付け → テンプレート選択 → PDF完成
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-brand-500 text-xs"></i>
                      A4用紙に1枚・2分割・4分割・8分割レイアウト対応
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-brand-500 text-xs"></i>
                      店舗名・画像・文言のカスタマイズ可能
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 2: Analytics Dashboard */}
            <div class="group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 hover:shadow-lg transition-all">
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <i class="fas fa-chart-bar text-white text-2xl"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-xl font-bold text-gray-900">管理画面で数値分析</h3>
                    <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">DATA</span>
                  </div>
                  <p class="text-gray-600 leading-relaxed mb-4">
                    作成したQRコードがいつ・何回読み取られたかをリアルタイムで計測。
                    管理画面のダッシュボードで、カードごとのクリック数やアクセス傾向を一目で確認できます。
                  </p>
                  <ul class="space-y-2">
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-emerald-500 text-xs"></i>
                      QRスキャン回数・日時をリアルタイム記録
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-emerald-500 text-xs"></i>
                      カードごとの効果を比較・分析
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-emerald-500 text-xs"></i>
                      デバイス情報・参照元を自動取得
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES SECTION — Why RevQ
      ============================================================ */}
      <section class="bg-gray-50 border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 class="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-3">RevQ が選ばれる理由</h2>
          <p class="text-center text-gray-500 mb-12 max-w-xl mx-auto">手間なし・無料・すぐ使える。店舗オーナーに最適化されたレビュー依頼ツールです。</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-qrcode text-brand-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">QR＋短縮URLを自動生成</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                URLを貼るだけでQRコードと短縮URLを自動作成。お客様はスマホで読み取るだけでレビュー画面へ。
              </p>
            </div>
            {/* Feature 2 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-palette text-amber-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">10種のデザインテンプレート</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                カフェ風・和風・ミニマルなど、業種や雰囲気に合わせて選べるテンプレートを用意しています。
              </p>
            </div>
            {/* Feature 3 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-print text-green-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">PDFダウンロード → 即印刷</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                生成されたPDFをそのまま印刷。ラミネートしてレジ横やテーブルに置くだけで運用開始。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TARGET INDUSTRIES SECTION
      ============================================================ */}
      <section class="bg-white border-b border-gray-100">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div class="text-center mb-14">
            <div class="inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <i class="fas fa-store"></i>
              こんな業種に最適
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">さまざまな店舗でご活用いただいています</h2>
            <p class="text-gray-500 max-w-xl mx-auto">お客様と直接触れ合うすべてのビジネスで、Googleレビューの獲得を加速します。</p>
          </div>

          {/* Industries grid — 4 cards with background images */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Restaurant / Cafe */}
            <div class="group relative rounded-2xl overflow-hidden h-64 hover:shadow-xl transition-all">
              <img src="/static/images/industry-restaurant.png" alt="飲食店・カフェ" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-orange-500/90 rounded-lg flex items-center justify-center">
                    <i class="fas fa-utensils text-white text-sm"></i>
                  </div>
                  <h3 class="font-bold text-white text-base">飲食店・カフェ</h3>
                </div>
                <p class="text-xs text-gray-200 leading-relaxed">テーブルやレジ横にカードを設置。食後の満足度が高いタイミングでレビューを依頼。</p>
              </div>
            </div>

            {/* Clinic / Dental */}
            <div class="group relative rounded-2xl overflow-hidden h-64 hover:shadow-xl transition-all">
              <img src="/static/images/industry-clinic.png" alt="クリニック・歯科" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-sky-500/90 rounded-lg flex items-center justify-center">
                    <i class="fas fa-stethoscope text-white text-sm"></i>
                  </div>
                  <h3 class="font-bold text-white text-base">クリニック・歯科</h3>
                </div>
                <p class="text-xs text-gray-200 leading-relaxed">待合室や受付に設置。信頼感のある口コミが集まりやすくなります。</p>
              </div>
            </div>

            {/* Hair Salon */}
            <div class="group relative rounded-2xl overflow-hidden h-64 hover:shadow-xl transition-all">
              <img src="/static/images/industry-salon.png" alt="美容室・ヘアサロン" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-pink-500/90 rounded-lg flex items-center justify-center">
                    <i class="fas fa-cut text-white text-sm"></i>
                  </div>
                  <h3 class="font-bold text-white text-base">美容室・ヘアサロン</h3>
                </div>
                <p class="text-xs text-gray-200 leading-relaxed">施術後の仕上がりに満足したお客様から、自然なレビューを獲得。</p>
              </div>
            </div>

            {/* Spa / Esthetic */}
            <div class="group relative rounded-2xl overflow-hidden h-64 hover:shadow-xl transition-all">
              <img src="/static/images/industry-spa.png" alt="エステ・リラクゼーション" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-purple-500/90 rounded-lg flex items-center justify-center">
                    <i class="fas fa-spa text-white text-sm"></i>
                  </div>
                  <h3 class="font-bold text-white text-base">エステ・リラクゼーション</h3>
                </div>
                <p class="text-xs text-gray-200 leading-relaxed">施術後のリラックスした空間で、体験を共有。口コミが集客の要に。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS — 3 steps visual
      ============================================================ */}
      <section class="bg-gray-50">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 class="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-12">かんたん 3 ステップ</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center relative">
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">1</div>
              <div class="mt-4 mb-4">
                <div class="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="fas fa-link text-brand-500 text-2xl"></i>
                </div>
              </div>
              <h3 class="font-bold text-gray-900 mb-1">URLを貼り付け</h3>
              <p class="text-sm text-gray-500">GoogleマップのURLをコピペ</p>
            </div>

            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center relative">
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">2</div>
              <div class="mt-4 mb-4">
                <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="fas fa-swatchbook text-amber-500 text-2xl"></i>
                </div>
              </div>
              <h3 class="font-bold text-gray-900 mb-1">デザインを選択</h3>
              <p class="text-sm text-gray-500">お店の雰囲気に合う一枚を</p>
            </div>

            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center relative">
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">3</div>
              <div class="mt-4 mb-4">
                <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="fas fa-download text-green-500 text-2xl"></i>
                </div>
              </div>
              <h3 class="font-bold text-gray-900 mb-1">PDFをダウンロード</h3>
              <p class="text-sm text-gray-500">印刷して店内に設置するだけ</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CREATION FLOW
      ============================================================ */}
      <section id="create" class="bg-white border-t border-gray-100">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {/* Section title */}
          <div class="text-center mb-10">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">カードを作成する</h2>
            <p class="text-gray-500">3つの入力項目だけ。1分以内に完了します。</p>
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
              <span class="text-sm font-semibold text-gray-400 hidden sm:inline">生成</span>
            </div>
          </div>

          {/* ===== STEP 1: Input Form ===== */}
          <div id="step-1" class="max-w-2xl mx-auto">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="fas fa-edit text-brand-500"></i>
                店舗情報を入力
              </h3>

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
                  <p class="mt-1.5 text-xs text-gray-400">未入力の場合、カードに店名は表示されません</p>
                </div>

                {/* Card Label */}
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="card-label">
                    カードラベル <span class="text-gray-400 font-normal text-xs">（任意）</span>
                  </label>
                  <input
                    type="text"
                    id="card-label"
                    name="label"
                    placeholder="例）レジ横用、壁面掲示用"
                    maxlength={30}
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  />
                  <p class="mt-1.5 text-xs text-gray-400 flex items-start gap-1">
                    <i class="fas fa-info-circle mt-0.5 text-gray-300"></i>
                    設置場所ごとにラベルをつけると、どの導線からの読み取りか管理画面で確認できます
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

          {/* ===== STEP 2: Template Selection + CTA Text + Preview ===== */}
          <div id="step-2" class="hidden">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Templates + CTA Text */}
              <div class="lg:col-span-3">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <i class="fas fa-palette text-brand-500"></i>
                      テンプレートを選択
                    </h3>
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

                  {/* CTA Text Edit */}
                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <i class="fas fa-pen-fancy text-brand-500"></i>
                      カード文言の編集
                    </h3>
                    <div>
                      <label class="block text-xs font-semibold text-gray-500 mb-1.5" for="cta-text-input">
                        カードに表示するメッセージ
                      </label>
                      <input
                        type="text"
                        id="cta-text-input"
                        placeholder="Googleレビューにご協力ください"
                        maxlength={60}
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                      />
                      <p class="mt-1 text-xs text-gray-400">
                        <i class="fas fa-info-circle mr-1"></i>
                        未入力の場合は「Googleレビューにご協力ください」が表示されます
                      </p>
                    </div>
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
                    <div class="p-6" id="preview-content">
                      <div id="preview-template-wrapper" class="rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <div id="preview-accent-bar" class="h-2 bg-gray-600"></div>
                        <div class="p-5 space-y-4">
                          <div id="preview-img-section" class="hidden flex justify-center">
                            <img id="preview-card-image" class="max-w-[8rem] max-h-36 rounded-lg object-contain mx-auto" alt="" />
                          </div>
                          <div id="preview-store-name-section" class="hidden text-center">
                            <p id="preview-store-name" class="font-bold text-lg text-gray-800"></p>
                          </div>
                          <p id="preview-cta-text" class="text-center text-sm font-semibold text-gray-700">Googleレビューにご協力ください</p>
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
                                <rect x="45" y="15" width="5" height="5" fill="currentColor"/>
                                <rect x="55" y="25" width="5" height="5" fill="currentColor"/>
                                <rect x="35" y="35" width="5" height="5" fill="currentColor"/>
                                <rect x="45" y="45" width="5" height="5" fill="currentColor"/>
                                <rect x="70" y="70" width="25" height="25" fill="currentColor" rx="2"/>
                                <rect x="75" y="75" width="15" height="15" fill="white" rx="1"/>
                                <rect x="79" y="79" width="7" height="7" fill="currentColor"/>
                              </svg>
                            </div>
                          </div>
                          <p class="text-center text-xs text-gray-500 font-mono tracking-wide">revq.link/abc123</p>
                        </div>
                        <div class="border-t border-gray-200/50 px-4 py-2 bg-white/40">
                          <p class="text-[9px] text-gray-400 text-center">Powered by RevQ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
