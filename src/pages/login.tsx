export const LoginPage = () => {
  return (
    <div class="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div class="text-center mb-6">
          <div class="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-user text-brand-600 text-xl"></i>
          </div>
          <h1 class="text-xl font-bold text-gray-900" id="auth-title">ログイン</h1>
          <p class="text-sm text-gray-500 mt-1" id="auth-subtitle">メールアドレスにワンタイムコードを送信します</p>
        </div>

        {/* Login/Register Tab */}
        <div class="flex bg-gray-100 rounded-xl p-1 mb-6" id="auth-tabs">
          <button
            type="button"
            id="tab-login"
            class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all bg-white text-gray-900 shadow-sm"
          >
            ログイン
          </button>
          <button
            type="button"
            id="tab-register"
            class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all text-gray-500 hover:text-gray-700"
          >
            新規登録
          </button>
        </div>

        {/* Email Step */}
        <div id="login-step-email">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="login-email">
                メールアドレス
              </label>
              <input
                type="email"
                id="login-email"
                placeholder="you@example.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            <button
              type="button"
              id="btn-send-code"
              class="w-full bg-brand-600 text-white py-3.5 rounded-xl text-base font-bold hover:bg-brand-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <i class="fas fa-paper-plane text-sm"></i>
              ワンタイムコードを送信
            </button>

            {/* Info text - changes with tab */}
            <p class="text-xs text-gray-400 text-center" id="auth-info-text">
              <i class="fas fa-shield-alt mr-1"></i>
              パスワード不要。毎回メールで届くコードでログインします。
            </p>
          </div>
        </div>

        {/* Code Step */}
        <div id="login-step-code" class="hidden">
          <div class="space-y-4">
            {/* Email sent notification */}
            <div id="otp-email-sent" class="hidden bg-green-50 border border-green-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-envelope-open-text text-green-600 text-sm"></i>
                </div>
                <div>
                  <p class="text-sm font-semibold text-green-800">
                    <span id="sent-email-display">you@example.com</span> にコードを送信しました
                  </p>
                  <p class="text-xs text-green-600 mt-1">メールを確認して6桁のコードを入力してください（5分間有効）</p>
                  <p class="text-xs text-green-500 mt-1">
                    <i class="fas fa-info-circle mr-0.5"></i>
                    届かない場合は迷惑メールフォルダもご確認ください
                  </p>
                </div>
              </div>
            </div>

            {/* Email send error */}
            <div id="otp-error" class="hidden bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-exclamation-triangle text-red-600 text-sm"></i>
                </div>
                <div>
                  <p class="text-sm font-semibold text-red-800" id="otp-error-message">メールの送信に失敗しました</p>
                  <p class="text-xs text-red-600 mt-1" id="otp-error-detail">しばらく時間をおいてから再度お試しください</p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="login-code">
                ワンタイムコード（6桁）
              </label>
              <input
                type="text"
                id="login-code"
                placeholder="000000"
                maxlength={6}
                inputmode="numeric"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-center tracking-[0.5em] font-mono focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            <button
              type="button"
              id="btn-login"
              class="w-full bg-brand-600 text-white py-3.5 rounded-xl text-base font-bold hover:bg-brand-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span id="btn-login-label">ログイン</span>
              <i class="fas fa-arrow-right text-sm"></i>
            </button>

            <div class="flex items-center justify-between">
              <button
                type="button"
                id="btn-back-email"
                class="text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
              >
                <i class="fas fa-arrow-left mr-1"></i>
                メールアドレスを変更
              </button>
              <button
                type="button"
                id="btn-resend-code"
                class="text-sm text-brand-600 hover:text-brand-700 py-2 transition-colors font-semibold"
              >
                <i class="fas fa-redo mr-1"></i>
                再送信
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div class="text-center mt-6">
        <a href="/" class="text-sm text-gray-400 hover:text-gray-600 transition-colors no-underline">
          <i class="fas fa-arrow-left mr-1"></i>
          カード作成に戻る
        </a>
      </div>
    </div>
  )
}
