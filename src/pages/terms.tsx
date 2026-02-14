export const TermsPage = () => {
  return (
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        {/* Header */}
        <div class="mb-10">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">利用規約</h1>
          <p class="text-sm text-gray-400">最終更新日：2026年2月14日</p>
        </div>

        <div class="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed text-gray-700">
          {/* 1 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">1</span>
              総則
            </h2>
            <p>
              本利用規約（以下「本規約」）は、RevQ（以下「当サービス」）の利用に関する条件を定めるものです。
              ユーザーは、当サービスを利用することにより、本規約のすべての内容に同意したものとみなされます。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">2</span>
              サービスの概要
            </h2>
            <p class="mb-3">
              当サービスは、Google マップの口コミページへのレビュー依頼カード（QRコード付き）を作成・配布するためのツールです。
              主な機能は以下のとおりです。
            </p>
            <ul class="list-disc list-inside space-y-1.5">
              <li>Google マップURLからQRコード付きレビュー依頼カードの自動生成</li>
              <li>短縮URLの発行とクリック計測</li>
              <li>複数デザインテンプレートの提供</li>
              <li>印刷用PDF（A4・各種レイアウト）のダウンロード</li>
              <li>マイページでのカード管理・統計閲覧</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">3</span>
              アカウントと認証
            </h2>
            <div class="space-y-3">
              <p>
                当サービスへのログインには、メールアドレスを使用したワンタイムパスワード（OTP）認証を採用しています。
              </p>
              <ul class="list-disc list-inside space-y-1.5">
                <li>ユーザーは正確かつ有効なメールアドレスを登録する必要があります</li>
                <li>アカウントの管理はユーザー自身の責任において行ってください</li>
                <li>一つのメールアドレスにつき一つのアカウントが作成されます</li>
                <li>他者のメールアドレスを使用したアカウント作成は禁止します</li>
              </ul>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">4</span>
              メールアドレスの収集と利用
            </h2>
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-3">
              <p class="text-sm text-blue-800 font-medium mb-2">
                <i class="fas fa-info-circle mr-1"></i>
                メールアドレス収集に関する重要事項
              </p>
              <p class="text-sm text-blue-700">
                当サービスは、OTP認証のためにメールアドレスを収集します。
                収集されたメールアドレスの取り扱いについては、
                <a href="/privacy" class="text-blue-600 underline font-medium">プライバシーポリシー</a>
                もあわせてご確認ください。
              </p>
            </div>
            <ul class="list-disc list-inside space-y-1.5">
              <li>メールアドレスは、ログイン時のOTPコード送信に使用します</li>
              <li>サービスに関する重要なお知らせの送信に使用する場合があります</li>
              <li>広告・マーケティング目的のメール送信は行いません（ユーザーが明示的に同意した場合を除く）</li>
              <li>メールの送信にはResend（外部メール送信サービス）を使用しています</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">5</span>
              クリック計測（トラッキング）について
            </h2>
            <div class="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-3">
              <p class="text-sm text-amber-800 font-medium mb-2">
                <i class="fas fa-chart-bar mr-1"></i>
                クリック計測に関する説明
              </p>
              <p class="text-sm text-amber-700">
                当サービスが発行する短縮URL（revq.link/xxx 形式）を経由してGoogleマップページにアクセスされた際、
                アクセスデータを計測・記録します。
              </p>
            </div>
            <p class="mb-3 font-medium text-gray-800">記録されるデータ：</p>
            <ul class="list-disc list-inside space-y-1.5 mb-3">
              <li>クリック日時</li>
              <li>ユーザーエージェント情報（ブラウザ種別・OS情報）</li>
              <li>リファラー情報（アクセス元ページのURL）</li>
            </ul>
            <p class="mb-3 font-medium text-gray-800">記録されないデータ：</p>
            <ul class="list-disc list-inside space-y-1.5 mb-3">
              <li>IPアドレス</li>
              <li>個人を特定しうる情報</li>
              <li>Cookie情報（短縮URLリダイレクト時にはCookieを設定しません）</li>
            </ul>
            <p class="text-sm text-gray-600">
              計測データはカード作成者のマイページにて統計情報として表示されます。
              個人を特定する目的では使用しません。
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">6</span>
              禁止事項
            </h2>
            <p class="mb-3">ユーザーは、当サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <div class="space-y-3">
              <div class="bg-red-50 rounded-xl p-4 border border-red-100">
                <h3 class="font-bold text-red-800 text-sm mb-2">
                  <i class="fas fa-ban text-red-500 mr-1.5"></i>
                  不正利用・なりすまし
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li>自身が運営・関与していない店舗・事業のレビュー依頼カードを作成する行為</li>
                  <li>他者のメールアドレスを使用してアカウントを作成する行為</li>
                  <li>他者のアカウントに不正にアクセスする行為</li>
                  <li>虚偽の情報を登録する行為</li>
                </ul>
              </div>
              <div class="bg-red-50 rounded-xl p-4 border border-red-100">
                <h3 class="font-bold text-red-800 text-sm mb-2">
                  <i class="fas fa-exclamation-triangle text-red-500 mr-1.5"></i>
                  Google ポリシー違反
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li>金銭・割引・特典などの対価と引き換えにレビューを依頼する行為</li>
                  <li>虚偽のレビューを投稿させる行為、またはそれを助長する行為</li>
                  <li>Googleの利用規約やポリシーに違反するレビューを誘導する行為</li>
                  <li>ネガティブレビューの投稿を妨害する行為</li>
                </ul>
              </div>
              <div class="bg-red-50 rounded-xl p-4 border border-red-100">
                <h3 class="font-bold text-red-800 text-sm mb-2">
                  <i class="fas fa-shield-alt text-red-500 mr-1.5"></i>
                  技術的な不正行為
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li>当サービスのシステムに対する不正アクセスや攻撃行為</li>
                  <li>自動化ツール（ボット等）を使用した大量のカード作成・クリック</li>
                  <li>サービスの正常な運営を妨げる行為</li>
                  <li>短縮URLを悪意のあるリダイレクト先に変更しようとする行為</li>
                  <li>クリック計測データを改ざんする行為</li>
                </ul>
              </div>
              <div class="bg-red-50 rounded-xl p-4 border border-red-100">
                <h3 class="font-bold text-red-800 text-sm mb-2">
                  <i class="fas fa-gavel text-red-500 mr-1.5"></i>
                  法令違反・公序良俗に反する行為
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li>法令または公序良俗に反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>第三者の権利（知的財産権、プライバシー権等）を侵害する行為</li>
                  <li>カードに不適切な画像やテキストを使用する行為</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">7</span>
              免責事項
            </h2>
            <div class="space-y-3">
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 class="font-bold text-gray-800 text-sm mb-2">サービスの提供について</h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>当サービスは「現状有姿（AS-IS）」で提供されます</li>
                  <li>サービスの完全性、正確性、信頼性、継続性を保証するものではありません</li>
                  <li>メンテナンスやシステム障害等により、予告なくサービスを一時的に中断する場合があります</li>
                  <li>将来のサービス内容の変更・終了を行う場合があります</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 class="font-bold text-gray-800 text-sm mb-2">レビューに関する免責</h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>当サービスはレビュー依頼カードの作成ツールであり、レビューの投稿そのものを保証するものではありません</li>
                  <li>投稿されたレビューの内容について、当サービスは一切の責任を負いません</li>
                  <li>Google マップのサービス仕様変更等による影響について、当サービスは責任を負いません</li>
                  <li>カードの利用により生じたGoogleアカウントやビジネスプロフィールへの影響について、責任を負いません</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 class="font-bold text-gray-800 text-sm mb-2">データに関する免責</h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>クリック計測データの完全性・正確性を保証するものではありません</li>
                  <li>システム障害等によるデータの消失について、賠償責任を負いません</li>
                  <li>ユーザーが作成したカードの内容に起因する損害について、責任を負いません</li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 class="font-bold text-gray-800 text-sm mb-2">損害賠償の制限</h3>
                <p class="text-sm text-gray-600">
                  当サービスの利用により生じた損害について、当サービス運営者の故意または重大な過失による場合を除き、
                  一切の損害賠償責任を負わないものとします。
                  仮に損害賠償義務が発生した場合であっても、その賠償額は当該ユーザーが当サービスに支払った利用料金の総額を上限とします。
                </p>
              </div>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">8</span>
              知的財産権
            </h2>
            <ul class="list-disc list-inside space-y-1.5">
              <li>当サービスのUIデザイン、ロゴ、ソフトウェアに関する知的財産権は運営者に帰属します</li>
              <li>ユーザーがアップロードした画像・テキストの著作権はユーザーに帰属します</li>
              <li>ユーザーは、当サービスで作成したカードを自身の事業活動の範囲内で自由に利用できます</li>
              <li>カードに含まれる「RevQ」のブランドロゴ・表記を不正に改変・除去することは禁止します</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">9</span>
              アカウントの停止・削除
            </h2>
            <p class="mb-3">
              当サービス運営者は、以下の場合にユーザーのアカウントを事前通知なく停止または削除することがあります。
            </p>
            <ul class="list-disc list-inside space-y-1.5">
              <li>本規約に違反した場合</li>
              <li>禁止事項に該当する行為が確認された場合</li>
              <li>長期間にわたりアカウントが利用されていない場合</li>
              <li>その他、運営者が不適切と判断した場合</li>
            </ul>
          </section>

          {/* 10 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">10</span>
              本規約の変更
            </h2>
            <p>
              当サービス運営者は、必要に応じて本規約を変更することがあります。
              変更後の規約は、本ページに掲載した時点で効力を生じるものとします。
              重要な変更がある場合は、サービス上でお知らせするよう努めます。
              変更後も当サービスの利用を継続した場合、変更後の規約に同意したものとみなします。
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">11</span>
              準拠法と管轄裁判所
            </h2>
            <p>
              本規約は日本法に準拠し、日本法に従って解釈されるものとします。
              本規約に関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">12</span>
              お問い合わせ
            </h2>
            <p>
              本規約に関するお問い合わせは、以下の連絡先までお願いいたします。
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

      {/* Related links */}
      <div class="text-center mt-6 space-y-2">
        <div>
          <a href="/privacy" class="text-sm text-brand-600 hover:text-brand-700 transition-colors no-underline">
            <i class="fas fa-shield-alt mr-1"></i>
            プライバシーポリシー
          </a>
        </div>
        <div>
          <a href="/" class="text-sm text-gray-400 hover:text-gray-600 transition-colors no-underline">
            <i class="fas fa-arrow-left mr-1"></i>
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  )
}
