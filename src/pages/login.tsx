export const LoginPage = () => {
  return (
    <div class="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div class="text-center mb-8">
          <div class="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-user text-brand-600 text-xl"></i>
          </div>
          <h1 class="text-xl font-bold text-gray-900">ログイン</h1>
          <p class="text-sm text-gray-500 mt-1">管理画面にアクセスできます</p>
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
              ワンタイムコードを送信
              <i class="fas fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>

        {/* Code Step */}
        <div id="login-step-code" class="hidden">
          <div class="space-y-4">
            <p class="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3">
              <i class="fas fa-envelope text-blue-400 mr-1"></i>
              <span id="sent-email-display">you@example.com</span> にコードを送信しました
            </p>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="login-code">
                ワンタイムコード
              </label>
              <input
                type="text"
                id="login-code"
                placeholder="6桁のコードを入力"
                maxlength={6}
                class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-center tracking-[0.5em] font-mono focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            <button
              type="button"
              id="btn-login"
              class="w-full bg-brand-600 text-white py-3.5 rounded-xl text-base font-bold hover:bg-brand-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              ログイン
              <i class="fas fa-arrow-right text-sm"></i>
            </button>

            <button
              type="button"
              id="btn-back-email"
              class="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
            >
              <i class="fas fa-arrow-left mr-1"></i>
              メールアドレスを変更
            </button>
          </div>
        </div>

        {/* Demo Notice */}
        <div class="mt-6 p-3 bg-amber-50 border border-amber-100 rounded-lg text-center">
          <p class="text-xs text-amber-700">
            <i class="fas fa-flask mr-1"></i>
            プロトタイプではログインはデモです。任意の値で進めます。
          </p>
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
