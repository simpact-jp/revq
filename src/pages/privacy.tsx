export const PrivacyPage = () => {
  return (
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        {/* Header */}
        <div class="mb-10">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
          <p class="text-sm text-gray-400">最終更新日：2026年2月14日</p>
        </div>

        <div class="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed text-gray-700">
          {/* 1 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">1</span>
              はじめに
            </h2>
            <p>
              RevQ（以下「当サービス」）は、お客様の個人情報の保護を重要な責務と認識し、
              以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
              当サービスをご利用いただく際には、本ポリシーの内容をご確認のうえ、ご同意いただいたものとみなします。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">2</span>
              収集する情報
            </h2>
            <p class="mb-3">当サービスでは、以下の情報を収集します。</p>
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 class="font-bold text-gray-800 text-sm mb-2">
                  <i class="fas fa-envelope text-brand-500 mr-1.5"></i>
                  メールアドレス
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>ログイン時のワンタイムパスワード（OTP）認証のために収集します</li>
                  <li>アカウントの識別およびサービス提供に必要な範囲でのみ利用します</li>
                  <li>OTPコードの送信先として利用します</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 class="font-bold text-gray-800 text-sm mb-2">
                  <i class="fas fa-mouse-pointer text-brand-500 mr-1.5"></i>
                  QRコード・短縮URLのクリック計測データ
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>短縮URLがクリックされた日時</li>
                  <li>アクセス元のユーザーエージェント（ブラウザ・OS情報）</li>
                  <li>リファラー情報（アクセス元のページURL）</li>
                </ul>
                <p class="text-xs text-gray-500 mt-2">
                  ※ IPアドレスの保存は行いません。クリック計測データは統計目的で集計され、
                  個人を特定する目的では使用しません。
                </p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 class="font-bold text-gray-800 text-sm mb-2">
                  <i class="fas fa-id-card text-brand-500 mr-1.5"></i>
                  カード作成時に入力された情報
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>店舗名（任意入力）</li>
                  <li>GoogleマップのURL</li>
                  <li>アップロードされた画像データ（任意）</li>
                  <li>カード文言のカスタムテキスト（任意）</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">3</span>
              情報の利用目的
            </h2>
            <p class="mb-3">収集した情報は、以下の目的で利用します。</p>
            <ul class="list-disc list-inside space-y-1.5">
              <li>ユーザー認証（OTPによるログイン処理）</li>
              <li>レビュー依頼カードの作成・管理機能の提供</li>
              <li>QRコード・短縮URLのクリック数の集計とユーザーへの表示</li>
              <li>サービスの改善・品質向上のための統計分析</li>
              <li>サービスに関する重要なお知らせの送信（任意）</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">4</span>
              情報の第三者提供
            </h2>
            <p>
              当サービスは、以下の場合を除き、お客様の個人情報を第三者に提供することはありません。
            </p>
            <ul class="list-disc list-inside space-y-1.5 mt-3">
              <li>お客様の同意がある場合</li>
              <li>法令に基づく開示請求があった場合</li>
              <li>人の生命・身体・財産の保護のために必要がある場合</li>
              <li>サービス提供に必要な業務委託先への提供（メール送信サービス等）</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">5</span>
              外部サービスの利用
            </h2>
            <p class="mb-3">当サービスでは、以下の外部サービスを利用しています。</p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">サービス名</th>
                    <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">利用目的</th>
                    <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">提供元</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr>
                    <td class="px-4 py-2.5 font-medium text-gray-800">Cloudflare</td>
                    <td class="px-4 py-2.5 text-gray-600">ホスティング・データベース・CDN</td>
                    <td class="px-4 py-2.5 text-gray-500">Cloudflare, Inc.</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2.5 font-medium text-gray-800">Resend</td>
                    <td class="px-4 py-2.5 text-gray-600">OTPメールの送信</td>
                    <td class="px-4 py-2.5 text-gray-500">Resend, Inc.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              各外部サービスのプライバシーポリシーについては、それぞれの提供元のウェブサイトをご参照ください。
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">6</span>
              Cookieの使用
            </h2>
            <p>
              当サービスでは、ログイン状態の維持のためにCookie（JWT トークン）を使用します。
              このCookieはHttpOnly属性を持ち、JavaScript から直接アクセスすることはできません。
              ブラウザの設定でCookieを無効にした場合、ログイン機能をご利用いただけなくなります。
            </p>
            <p class="mt-2">
              当サービスでは、広告目的のトラッキングCookieは使用していません。
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">7</span>
              データの保管と安全管理
            </h2>
            <ul class="list-disc list-inside space-y-1.5">
              <li>データはCloudflare D1（分散型SQLiteデータベース）に保存されます</li>
              <li>通信はすべてHTTPS（TLS暗号化）で保護されています</li>
              <li>パスワードの代わりにワンタイムパスワード認証を採用し、パスワード漏洩リスクを低減しています</li>
              <li>管理画面へのアクセスは認証で保護されています</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">8</span>
              ユーザーの権利
            </h2>
            <p class="mb-3">お客様には以下の権利があります。</p>
            <ul class="list-disc list-inside space-y-1.5">
              <li><strong>データの確認</strong> — マイページからご自身のカードデータ・クリック数を確認できます</li>
              <li><strong>データの削除</strong> — マイページからカードを削除できます。アカウントの完全削除をご希望の場合はお問い合わせください</li>
              <li><strong>データの訂正</strong> — カードに登録した店舗名やテキストはマイページから編集できます</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">9</span>
              本ポリシーの変更
            </h2>
            <p>
              当サービスは、必要に応じて本ポリシーを変更することがあります。
              重要な変更がある場合は、サービス上でお知らせします。
              変更後のポリシーは、本ページに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">10</span>
              お問い合わせ
            </h2>
            <p>
              本ポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。
            </p>
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-3">
              <p class="text-sm text-gray-700">
                <strong>RevQ 運営事務局</strong><br />
                メール：<a href="mailto:support@revq.jp" class="text-brand-600 hover:text-brand-700">support@revq.jp</a>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Back link */}
      <div class="text-center mt-6">
        <a href="/" class="text-sm text-gray-400 hover:text-gray-600 transition-colors no-underline">
          <i class="fas fa-arrow-left mr-1"></i>
          トップページに戻る
        </a>
      </div>
    </div>
  )
}
