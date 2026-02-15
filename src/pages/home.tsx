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
            src="/static/images/hero-reviews.png"
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
          3 KEY FEATURES — QR + Analytics + GATE (highlight)
      ============================================================ */}
      <section class="bg-white border-b border-gray-100">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div class="text-center mb-14">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">かんたん3つの機能</h2>
            <p class="text-gray-500 mt-2 max-w-xl mx-auto">QR作成 × レビュー振り分け × データ分析。これだけでGoogleレビュー戦略が完成します。</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Card 1: 30sec QR Creation */}
            <div class="group relative bg-gradient-to-br from-brand-50 to-blue-50 rounded-2xl p-8 border border-brand-100 hover:shadow-lg transition-all">
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <i class="fas fa-qrcode text-white text-2xl"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-xl font-bold text-gray-900">30秒でQR作成</h3>
                    <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">FAST</span>
                  </div>
                  <p class="text-gray-600 leading-relaxed mb-4">
                    GoogleマップのURLを貼り付けるだけ。QRコード付きのレビュー依頼カードを即座に生成し、PDFで印刷。
                  </p>
                  <ul class="space-y-2">
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-brand-500 text-xs"></i>
                      10種のデザインテンプレート
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-brand-500 text-xs"></i>
                      A4用紙に1～8分割レイアウト
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-brand-500 text-xs"></i>
                      設置場所ごとにラベル管理
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 2: Satisfaction Gate — FEATURED */}
            <div class="group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-300 hover:shadow-xl transition-all ring-2 ring-amber-200/50">
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <i class="fas fa-shield-alt text-white text-2xl"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-xl font-bold text-gray-900">満足/不満ゲート</h3>
                  </div>
                  <p class="text-gray-600 leading-relaxed mb-4">
                    QR読み取り後に「満足」か「不満」を事前に聞くことで、<strong class="text-amber-800">ネガティブレビューがGoogleに投稿されるのを防ぎます。</strong>
                  </p>
                  <ul class="space-y-2">
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-smile text-green-500 text-xs"></i>
                      満足 → Googleレビュー画面へ
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-frown text-gray-400 text-xs"></i>
                      不満 → 店舗に直接フィードバック
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-toggle-on text-amber-500 text-xs"></i>
                      管理画面でワンタッチON/OFF
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 3: Analytics Dashboard */}
            <div class="group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 hover:shadow-lg transition-all">
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <i class="fas fa-chart-bar text-white text-2xl"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-xl font-bold text-gray-900">数値分析＋レポート</h3>
                    <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">DATA</span>
                  </div>
                  <p class="text-gray-600 leading-relaxed mb-4">
                    QRの読み取り回数・日時・フィードバック内容をリアルタイムで管理画面に表示。週次レポートメールも受け取れます。
                  </p>
                  <ul class="space-y-2">
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-emerald-500 text-xs"></i>
                      QRスキャン回数・日時を記録
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-emerald-500 text-xs"></i>
                      フィードバック一覧・未読通知
                    </li>
                    <li class="flex items-center gap-2 text-sm text-gray-600">
                      <i class="fas fa-check-circle text-emerald-500 text-xs"></i>
                      毎週月曜に週次レポートメール
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          GATE FEATURE DEEP DIVE — Large visual section
      ============================================================ */}
      <section id="gate-feature" class="relative text-white border-b border-gray-100 overflow-hidden">
        {/* Background image */}
        <div class="absolute inset-0">
          <img src="/static/images/gate-bg.png" alt="" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/80 to-brand-900/85"></div>
        </div>
        <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <i class="fas fa-shield-alt"></i>
              満足/不満ゲート機能
            </div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
              ネガティブレビューを<br class="sm:hidden" />
              <span class="text-amber-300">公開前にキャッチ</span>
            </h2>
            <p class="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              お客様がQRコードを読み取ると、まず「満足ですか？」と確認。<br class="hidden md:block" />
              満足ならGoogleレビューへ、不満なら店舗に直接フィードバック。<br class="hidden md:block" />
              低評価レビューが公開される前に、問題を把握し改善できます。
            </p>
          </div>

          {/* Flow diagram */}
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 items-start max-w-5xl mx-auto mb-16">
            {/* Step 1: QR Scan */}
            <div class="text-center">
              <div class="w-20 h-20 bg-brand-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-500/30">
                <i class="fas fa-qrcode text-brand-300 text-3xl"></i>
              </div>
              <h4 class="text-white font-bold mb-1">QR読み取り</h4>
              <p class="text-sm text-gray-400">お客様がスマホで<br />QRコードをスキャン</p>
            </div>

            {/* Arrow */}
            <div class="hidden lg:flex items-center justify-center pt-8">
              <i class="fas fa-chevron-right text-gray-600 text-xl"></i>
            </div>
            <div class="lg:hidden flex justify-center">
              <i class="fas fa-chevron-down text-gray-600 text-xl"></i>
            </div>

            {/* Step 2: Gate Question */}
            <div class="text-center">
              <div class="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-amber-400/40 ring-4 ring-amber-400/10">
                <span class="text-4xl">🤔</span>
              </div>
              <h4 class="text-amber-300 font-bold mb-1">「いかがでしたか？」</h4>
              <p class="text-sm text-gray-400">満足 or 不満を選択<br />（ゲート画面）</p>
            </div>

            {/* Arrow */}
            <div class="hidden lg:flex items-center justify-center pt-8">
              <i class="fas fa-chevron-right text-gray-600 text-xl"></i>
            </div>
            <div class="lg:hidden flex justify-center">
              <i class="fas fa-chevron-down text-gray-600 text-xl"></i>
            </div>

            {/* Step 3: Result */}
            <div class="text-center">
              <div class="space-y-3">
                <div class="bg-green-500/20 rounded-xl p-3 border border-green-400/30">
                  <div class="flex items-center gap-2 justify-center">
                    <span class="text-lg">😊</span>
                    <span class="text-green-300 font-bold text-sm">満足</span>
                  </div>
                  <p class="text-xs text-green-400 mt-1">→ Googleレビュー画面へ</p>
                </div>
                <div class="bg-gray-700/50 rounded-xl p-3 border border-gray-600/30">
                  <div class="flex items-center gap-2 justify-center">
                    <span class="text-lg">😔</span>
                    <span class="text-gray-300 font-bold text-sm">不満</span>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">→ 店舗へ直接フォーム送信</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits grid */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-star text-green-400 text-xl"></i>
              </div>
              <h4 class="text-white font-bold mb-2">高評価レビューが増える</h4>
              <p class="text-sm text-gray-400 leading-relaxed">
                満足したお客様だけをGoogleレビューへ誘導するため、自然と高評価が集まります。
              </p>
            </div>
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-comment-dots text-amber-400 text-xl"></i>
              </div>
              <h4 class="text-white font-bold mb-2">不満を直接キャッチ</h4>
              <p class="text-sm text-gray-400 leading-relaxed">
                不満があるお客様からは、公開される前に直接フィードバックを受け取り、迅速に対応できます。
              </p>
            </div>
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-envelope-open-text text-brand-400 text-xl"></i>
              </div>
              <h4 class="text-white font-bold mb-2">メールで即時通知</h4>
              <p class="text-sm text-gray-400 leading-relaxed">
                フィードバックが届くと店舗オーナーにメール通知。素早い対応で顧客満足度を改善できます。
              </p>
            </div>
          </div>

          {/* Toggle note */}
          <div class="mt-12 text-center">
            <div class="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-6 py-3">
              <div class="relative w-11 h-6 rounded-full bg-green-500 flex-shrink-0">
                <span class="absolute top-0.5 left-[calc(100%-1.375rem)] w-5 h-5 bg-white rounded-full shadow-sm"></span>
              </div>
              <p class="text-sm text-gray-300">
                管理画面のカードごとに<strong class="text-white">ワンタッチでON/OFF</strong>。使い方に合わせて柔軟に切り替えできます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY RevQ — 6 features
      ============================================================ */}
      <section class="bg-gray-50 border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 class="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-3">RevQ が選ばれる理由</h2>
          <p class="text-center text-gray-500 mb-12 max-w-xl mx-auto">手間なし・無料・すぐ使える。店舗オーナーに最適化されたレビュー管理ツールです。</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-qrcode text-brand-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">QR＋短縮URLを自動生成</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                URLを貼るだけでQRコードと短縮URLを自動作成。お客様はスマホで読み取るだけ。
              </p>
            </div>
            {/* Feature 2 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-shield-alt text-amber-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">低評価レビューを事前ブロック</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                満足/不満ゲートで、不満を持つお客様を直接フィードバックに誘導。低評価の公開を防ぎます。
              </p>
            </div>
            {/* Feature 3 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-comment-dots text-green-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">フィードバックを直接受信</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                不満のお客様からのフィードバックはダッシュボードに一覧表示。メール通知でリアルタイム把握。
              </p>
            </div>
            {/* Feature 4 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-palette text-violet-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">10種のデザインテンプレート</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                カフェ風・和風・ミニマルなど、業種や雰囲気に合わせて選べるデザインを用意。
              </p>
            </div>
            {/* Feature 5 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-chart-line text-sky-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">読み取りデータの分析</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                いつ・何回読み取られたかをカードごとにリアルタイム計測。設置場所の効果比較も簡単。
              </p>
            </div>
            {/* Feature 6 */}
            <div class="text-center">
              <div class="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-envelope text-rose-600 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2">週次レポートメール</h3>
              <p class="text-sm text-gray-500 leading-relaxed">
                毎週月曜9:00にQR読み取り状況のサマリーをメール配信。管理画面を見なくても現状把握。
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
            <p class="text-gray-500 max-w-xl mx-auto">お客様と直接触れ合うすべてのビジネスで、Googleレビュー戦略を強化します。</p>
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
          HOW IT WORKS — 4 steps visual (with gate)
      ============================================================ */}
      <section class="bg-gray-50">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 class="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-4">かんたん 4 ステップ</h2>
          <p class="text-center text-gray-500 mb-12 max-w-lg mx-auto">カード作成からレビュー獲得まで、すべてがスムーズに</p>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <h3 class="font-bold text-gray-900 mb-1">デザイン選択＋印刷</h3>
              <p class="text-sm text-gray-500">テンプレートを選んでPDF出力</p>
            </div>

            <div class="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm text-center relative bg-amber-50/30">
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">3</div>
              <div class="mt-4 mb-4">
                <div class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="fas fa-shield-alt text-amber-500 text-2xl"></i>
                </div>
              </div>
              <h3 class="font-bold text-gray-900 mb-1">ゲートで振り分け</h3>
              <p class="text-sm text-gray-500">満足→レビュー、不満→FB</p>
            </div>

            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center relative">
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">4</div>
              <div class="mt-4 mb-4">
                <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="fas fa-chart-line text-green-500 text-2xl"></i>
                </div>
              </div>
              <h3 class="font-bold text-gray-900 mb-1">データ分析</h3>
              <p class="text-sm text-gray-500">管理画面で効果を確認</p>
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

      {/* ============================================================
          BOTTOM CTA — with gate feature highlight
      ============================================================ */}
      <section class="bg-gradient-to-r from-brand-700 to-brand-800">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-white mb-6">
            <i class="fas fa-shield-alt text-amber-300"></i>
            満足/不満ゲート付きQRコード
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            ネガティブレビューが投稿される前に<br class="hidden sm:block" />改善のチャンスを掴みませんか？
          </h2>
          <p class="text-blue-200 mb-8 max-w-lg mx-auto leading-relaxed">
            QRコード作成は30秒。ゲート機能のON/OFFは管理画面からワンタッチ。<br class="hidden sm:block" />
            いますぐ無料でお試しください。
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#create"
              class="inline-flex items-center justify-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all no-underline"
            >
              <i class="fas fa-bolt"></i>
              無料でカードを作成
            </a>
            <a
              href="/login"
              class="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-white/10 transition-all no-underline backdrop-blur-sm"
            >
              <i class="fas fa-sign-in-alt text-sm"></i>
              管理画面にログイン
            </a>
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
