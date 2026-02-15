export const PricingPage = () => {
  return (
    <div>
      {/* Hero */}
      <section class="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white py-16 md:py-20">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <i class="fas fa-crown text-amber-300"></i>
            シンプルな料金プラン
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            あなたのビジネスに<br class="sm:hidden" />最適なプランを
          </h1>
          <p class="text-lg text-blue-100 max-w-2xl mx-auto">
            まずは無料で始めて、ビジネスの成長に合わせてアップグレード。
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section class="py-16 -mt-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Toggle monthly/yearly */}
          <div class="flex items-center justify-center gap-3 mb-12">
            <span id="label-monthly" class="text-sm font-semibold text-gray-900">月額</span>
            <button type="button" id="toggle-interval" class="relative w-14 h-7 bg-gray-300 rounded-full transition-all" data-interval="monthly">
              <span class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all" id="toggle-knob"></span>
            </button>
            <span id="label-yearly" class="text-sm font-semibold text-gray-400">
              年額 <span class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold ml-1">2ヶ月分お得</span>
            </span>
          </div>

          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 relative">
              <div class="mb-6">
                <h3 class="text-xl font-bold text-gray-900 mb-1">Free プラン</h3>
                <p class="text-sm text-gray-500">まずは無料で試してみましょう</p>
              </div>
              <div class="mb-8">
                <span class="text-4xl font-extrabold text-gray-900">¥0</span>
                <span class="text-sm text-gray-400 ml-1">/ ずっと無料</span>
              </div>
              <ul class="space-y-3 mb-8">
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>店舗登録 <strong>2件</strong>まで</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>各店舗 QRカード <strong>2枚</strong>まで</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>10種のデザインテンプレート</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>満足/不満ゲート機能</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>読み取りデータ分析</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>PDF印刷対応（A4/A6）</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-400">
                  <i class="fas fa-times text-gray-300 mt-0.5 flex-shrink-0"></i>
                  <span>フィードバック通知メール</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-400">
                  <i class="fas fa-times text-gray-300 mt-0.5 flex-shrink-0"></i>
                  <span>RevQロゴ非表示</span>
                </li>
              </ul>
              <a href="/#create" class="block w-full text-center bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all no-underline">
                無料で始める
              </a>
            </div>

            {/* Plus Plan */}
            <div class="bg-white rounded-2xl border-2 border-brand-500 p-8 relative shadow-xl shadow-brand-500/10">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2">
                <span class="bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  <i class="fas fa-crown mr-1"></i>おすすめ
                </span>
              </div>
              <div class="mb-6">
                <h3 class="text-xl font-bold text-gray-900 mb-1">Plus プラン</h3>
                <p class="text-sm text-gray-500">本格運用に必要なすべてが揃う</p>
              </div>
              <div class="mb-8" id="plus-price">
                <span class="text-4xl font-extrabold text-gray-900" id="price-amount">¥300</span>
                <span class="text-sm text-gray-400 ml-1" id="price-interval">/ 月</span>
                <p class="text-xs text-gray-400 mt-1 hidden" id="price-yearly-note">¥2,400/年（月あたり¥200）</p>
              </div>
              <ul class="space-y-3 mb-8">
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-brand-500 mt-0.5 flex-shrink-0"></i>
                  <span>店舗登録 <strong class="text-brand-600">20件</strong>まで</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-brand-500 mt-0.5 flex-shrink-0"></i>
                  <span>QRカード <strong class="text-brand-600">無制限</strong></span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-brand-500 mt-0.5 flex-shrink-0"></i>
                  <span>10種のデザインテンプレート</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-brand-500 mt-0.5 flex-shrink-0"></i>
                  <span>満足/不満ゲート機能</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-brand-500 mt-0.5 flex-shrink-0"></i>
                  <span>読み取りデータ分析</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-gray-600">
                  <i class="fas fa-check text-brand-500 mt-0.5 flex-shrink-0"></i>
                  <span>PDF印刷対応（A4/A6）</span>
                </li>
                <li class="flex items-start gap-3 text-sm font-semibold text-gray-800">
                  <i class="fas fa-check text-brand-500 mt-0.5 flex-shrink-0"></i>
                  <span>フィードバック通知メール <span class="text-xs text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full ml-1">Plus</span></span>
                </li>
                <li class="flex items-start gap-3 text-sm font-semibold text-gray-800">
                  <i class="fas fa-check text-brand-500 mt-0.5 flex-shrink-0"></i>
                  <span>RevQロゴ非表示 <span class="text-xs text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full ml-1">Plus</span></span>
                </li>
              </ul>
              <button type="button" id="btn-subscribe-plus" class="block w-full text-center bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/30">
                <i class="fas fa-crown mr-2"></i>Plus プランに申し込む
              </button>
              <p class="text-[11px] text-gray-400 text-center mt-3">
                <i class="fas fa-shield-alt mr-1"></i>いつでもキャンセル可能
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 class="text-2xl font-bold text-center text-gray-900 mb-10">機能比較</h2>
          <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left text-sm font-semibold text-gray-600 px-6 py-4">機能</th>
                  <th class="text-center text-sm font-semibold text-gray-600 px-4 py-4 w-28">Free</th>
                  <th class="text-center text-sm font-semibold text-brand-600 px-4 py-4 w-28 bg-brand-50/50">Plus</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">店舗登録数</td>
                  <td class="px-4 py-3.5 text-center text-sm text-gray-600">2件</td>
                  <td class="px-4 py-3.5 text-center text-sm font-bold text-brand-600 bg-brand-50/30">20件</td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">QRカード（各店舗）</td>
                  <td class="px-4 py-3.5 text-center text-sm text-gray-600">2枚</td>
                  <td class="px-4 py-3.5 text-center text-sm font-bold text-brand-600 bg-brand-50/30">無制限</td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">デザインテンプレート</td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600"><i class="fas fa-check"></i> 10種</td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600 bg-brand-50/30"><i class="fas fa-check"></i> 10種</td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">満足/不満ゲート</td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600"><i class="fas fa-check"></i></td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600 bg-brand-50/30"><i class="fas fa-check"></i></td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">読み取りデータ分析</td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600"><i class="fas fa-check"></i></td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600 bg-brand-50/30"><i class="fas fa-check"></i></td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">PDF印刷（A4/A6/分割）</td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600"><i class="fas fa-check"></i></td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600 bg-brand-50/30"><i class="fas fa-check"></i></td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">週次レポートメール</td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600"><i class="fas fa-check"></i></td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600 bg-brand-50/30"><i class="fas fa-check"></i></td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">フィードバック通知メール</td>
                  <td class="px-4 py-3.5 text-center text-sm text-gray-300"><i class="fas fa-times"></i></td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600 bg-brand-50/30"><i class="fas fa-check"></i></td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">RevQロゴ非表示</td>
                  <td class="px-4 py-3.5 text-center text-sm text-gray-300"><i class="fas fa-times"></i></td>
                  <td class="px-4 py-3.5 text-center text-sm text-green-600 bg-brand-50/30"><i class="fas fa-check"></i></td>
                </tr>
                <tr>
                  <td class="px-6 py-3.5 text-sm text-gray-700">サポート</td>
                  <td class="px-4 py-3.5 text-center text-sm text-gray-600">メール</td>
                  <td class="px-4 py-3.5 text-center text-sm font-bold text-brand-600 bg-brand-50/30">優先サポート</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section class="py-16">
        <div class="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 class="text-2xl font-bold text-center text-gray-900 mb-10">よくある質問</h2>
          <div class="space-y-4">
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <h3 class="font-bold text-gray-900 mb-2">
                <i class="fas fa-question-circle text-brand-500 mr-2"></i>
                有料プランはいつでもキャンセルできますか？
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                はい、いつでもキャンセル可能です。キャンセル後も現在の請求期間の終了までPlusプランの機能をご利用いただけます。
              </p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <h3 class="font-bold text-gray-900 mb-2">
                <i class="fas fa-question-circle text-brand-500 mr-2"></i>
                支払い方法は何がありますか？
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                クレジットカード（Visa, Mastercard, JCB, American Express）に対応しています。決済はStripeを通じて安全に処理されます。
              </p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <h3 class="font-bold text-gray-900 mb-2">
                <i class="fas fa-question-circle text-brand-500 mr-2"></i>
                無料プランから有料プランへの切り替えは簡単ですか？
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                はい、管理画面から数クリックでアップグレードできます。現在のデータはそのまま引き継がれ、すぐにPlusプランの機能をご利用いただけます。
              </p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <h3 class="font-bold text-gray-900 mb-2">
                <i class="fas fa-question-circle text-brand-500 mr-2"></i>
                Plusプランをキャンセルしたらデータはどうなりますか？
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                キャンセル後もデータは削除されません。無料プランの制限（店舗2件・各2枚のQRコード）に戻りますが、既存のカードやデータはそのまま保持されます。新規作成のみ制限がかかります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="py-16 bg-brand-600 text-white">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 class="text-2xl sm:text-3xl font-extrabold mb-4">さあ、始めましょう</h2>
          <p class="text-blue-100 text-lg mb-8">まずは無料プランで体験。いつでもアップグレードできます。</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#create" class="bg-white text-brand-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg no-underline">
              無料で始める
            </a>
            <a href="/login" class="border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all no-underline">
              ログイン
            </a>
          </div>
        </div>
      </section>

      {/* Stripe badge + 特商法リンク */}
      <div class="text-center py-6 bg-gray-50">
        <p class="text-xs text-gray-400">
          <i class="fas fa-lock mr-1"></i>
          安全な決済は <strong>Stripe</strong> により処理されます
        </p>
        <p class="text-xs text-gray-400 mt-2">
          <a href="/tokushoho" class="text-gray-400 hover:text-gray-600 underline">特定商取引法に基づく表記</a>
        </p>
      </div>
    </div>
  )
}
