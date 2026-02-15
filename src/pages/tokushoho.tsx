export const TokushohoPage = () => {
  return (
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">特定商取引法に基づく表記</h1>

      <div class="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">販売事業者名</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">RevQ 運営事務局</dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">運営責任者</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            請求があった場合、遅滞なく開示いたします
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">所在地</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            請求があった場合、遅滞なく開示いたします
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">電話番号</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            請求があった場合、遅滞なく開示いたします
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">メールアドレス</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            support@revq.jp
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">販売URL</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <a href="https://revq.jp" class="text-brand-600 hover:underline">https://revq.jp</a>
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">販売価格</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            Plus プラン: 月額300円（税込）/ 年額2,400円（税込）<br />
            ※ 詳細は<a href="/pricing" class="text-brand-600 hover:underline">料金プラン</a>をご覧ください
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">商品代金以外の必要料金</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            なし（インターネット接続に必要な通信費はお客様のご負担となります）
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">支払方法</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            クレジットカード（Visa, Mastercard, JCB, American Express）<br />
            ※ 決済は Stripe, Inc. を通じて安全に処理されます
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">支払時期</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            月額プラン: 申込時に初回決済、以後毎月自動更新<br />
            年額プラン: 申込時に初回決済、以後毎年自動更新
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">サービス提供時期</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            お支払い完了後、直ちにご利用いただけます
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">返品・キャンセルについて</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            サブスクリプションはいつでもキャンセル可能です。キャンセル後も現在の請求期間の終了まで有料プランの機能をご利用いただけます。デジタルサービスの性質上、日割りでの返金は原則として行いません。
          </dd>
        </div>
        <div class="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-semibold text-gray-500">動作環境</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            Google Chrome, Safari, Firefox, Microsoft Edge の最新バージョン<br />
            ※ インターネット接続が必要です
          </dd>
        </div>
      </div>

      <div class="mt-8 text-center">
        <a href="/" class="text-sm text-brand-600 hover:underline">
          <i class="fas fa-arrow-left mr-1"></i>トップページに戻る
        </a>
      </div>
    </div>
  )
}
