/**
 * RevQ — Frontend JavaScript
 * Connects to real backend APIs for authentication, card creation,
 * QR generation, PDF download, and admin management.
 */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname

  if (path === '/' || path === '') initHomePage()
  if (path === '/done') initDonePage()
  if (path === '/login') initLoginPage()
  if (path === '/dashboard') initDashboardPage()
  if (path === '/pricing') initPricingPage()
  if (path === '/admin') initAdminPage()

  updateNav()
})

/* =============================================
   NAV STATE — check real auth
============================================= */
async function updateNav() {
  const navLogin = document.getElementById('nav-login')
  const navDashboard = document.getElementById('nav-dashboard')
  if (!navLogin || !navDashboard) return

  try {
    const res = await fetch('/api/auth/me')
    const data = await res.json()
    if (data.user) {
      navLogin.classList.add('hidden')
      navDashboard.classList.remove('hidden')
    } else {
      navLogin.classList.remove('hidden')
      navDashboard.classList.add('hidden')
    }
  } catch {
    navLogin.classList.remove('hidden')
    navDashboard.classList.add('hidden')
  }
}

/* =============================================
   HOME PAGE — LP + Creation Flow
============================================= */
function initHomePage() {
  const step1 = document.getElementById('step-1')
  const step2 = document.getElementById('step-2')
  const btnToStep2 = document.getElementById('btn-to-step2')
  const btnBackStep1 = document.getElementById('btn-back-step1')
  const btnGenerate = document.getElementById('btn-generate')
  const googleUrlInput = document.getElementById('google-url')
  const storeNameInput = document.getElementById('store-name')
  const imageUpload = document.getElementById('image-upload')
  const dropZone = document.getElementById('drop-zone')
  const uploadPlaceholder = document.getElementById('upload-placeholder')
  const uploadPreview = document.getElementById('upload-preview')
  const previewImage = document.getElementById('preview-image')
  const removeImageBtn = document.getElementById('remove-image')
  const ctaTextInput = document.getElementById('cta-text-input')
  const cardLabelInput = document.getElementById('card-label')

  let selectedTemplate = 0
  let selectedTemplateId = 'simple'
  let uploadedImageData = null

  const templateIds = ['simple','natural','luxury','pop','cafe','japanese','clean','minimal','vivid','photo']

  // --- Step Navigation ---
  if (btnToStep2) {
    btnToStep2.addEventListener('click', () => {
      const url = googleUrlInput.value.trim()
      if (!url) {
        shakeElement(googleUrlInput)
        googleUrlInput.focus()
        return
      }
      if (!isValidUrl(url)) {
        shakeElement(googleUrlInput)
        googleUrlInput.focus()
        return
      }

      step1.classList.add('hidden')
      step2.classList.remove('hidden')
      updateStepIndicator(2)
      updatePreview()

      const createSection = document.getElementById('create')
      if (createSection) {
        createSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  if (btnBackStep1) {
    btnBackStep1.addEventListener('click', () => {
      step2.classList.add('hidden')
      step1.classList.remove('hidden')
      updateStepIndicator(1)
      const createSection = document.getElementById('create')
      if (createSection) {
        createSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  // --- Template Selection ---
  const templateCards = document.querySelectorAll('.template-card')
  templateCards.forEach((card) => {
    card.addEventListener('click', () => {
      templateCards.forEach((c) => {
        c.classList.remove('border-brand-500', 'ring-2', 'ring-brand-200', 'shadow-md')
        c.classList.add('border-gray-200')
        const check = c.querySelector('.template-check')
        if (check) check.remove()
      })

      card.classList.remove('border-gray-200')
      card.classList.add('border-brand-500', 'ring-2', 'ring-brand-200', 'shadow-md')

      const checkDiv = document.createElement('div')
      checkDiv.className = 'absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center template-check'
      checkDiv.innerHTML = '<i class="fas fa-check text-white text-[10px]"></i>'
      card.appendChild(checkDiv)

      selectedTemplate = parseInt(card.dataset.index)
      selectedTemplateId = templateIds[selectedTemplate] || 'simple'
      updatePreview()
    })
  })

  // --- Image Upload ---
  if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
      handleFile(e.target.files[0])
    })
  }

  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      dropZone.classList.add('border-brand-400', 'bg-brand-50/30')
    })
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-brand-400', 'bg-brand-50/30')
    })
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      dropZone.classList.remove('border-brand-400', 'bg-brand-50/30')
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0])
      }
    })
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      uploadedImageData = null
      imageUpload.value = ''
      uploadPlaceholder.classList.remove('hidden')
      uploadPreview.classList.add('hidden')
      updatePreview()
    })
  }

  function handleFile(file) {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください')
      return
    }
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImageData = e.target.result
      previewImage.src = uploadedImageData
      uploadPlaceholder.classList.add('hidden')
      uploadPreview.classList.remove('hidden')
      updatePreview()
    }
    reader.readAsDataURL(file)
  }

  // --- CTA Text Live Update ---
  if (ctaTextInput) {
    ctaTextInput.addEventListener('input', updatePreview)
  }

  // --- Live Preview ---
  function updatePreview() {
    const storeName = storeNameInput ? storeNameInput.value.trim() : ''
    const previewStoreName = document.getElementById('preview-store-name')
    const previewStoreNameSection = document.getElementById('preview-store-name-section')
    const previewImgSection = document.getElementById('preview-img-section')
    const previewCardImage = document.getElementById('preview-card-image')
    const previewAccentBar = document.getElementById('preview-accent-bar')
    const previewWrapper = document.getElementById('preview-template-wrapper')
    const previewCtaText = document.getElementById('preview-cta-text')

    if (storeName) {
      previewStoreNameSection.classList.remove('hidden')
      previewStoreName.textContent = storeName
    } else {
      previewStoreNameSection.classList.add('hidden')
    }

    if (uploadedImageData) {
      previewImgSection.classList.remove('hidden')
      previewCardImage.src = uploadedImageData
    } else {
      previewImgSection.classList.add('hidden')
    }

    // Update CTA text in preview
    if (previewCtaText) {
      const ctaVal = ctaTextInput ? ctaTextInput.value.trim() : ''
      previewCtaText.textContent = ctaVal || 'Googleレビューにご協力ください'
    }

    const templateStyles = [
      { bg: 'from-gray-100 to-gray-200', bar: '#374151' },
      { bg: 'from-green-50 to-emerald-100', bar: '#059669' },
      { bg: 'from-amber-50 to-yellow-100', bar: '#92400e' },
      { bg: 'from-pink-50 to-rose-100', bar: '#e11d48' },
      { bg: 'from-orange-50 to-amber-100', bar: '#b45309' },
      { bg: 'from-red-50 to-rose-100', bar: '#991b1b' },
      { bg: 'from-sky-50 to-blue-100', bar: '#0369a1' },
      { bg: 'from-slate-50 to-slate-100', bar: '#334155' },
      { bg: 'from-violet-50 to-purple-100', bar: '#7c3aed' },
      { bg: 'from-teal-50 to-cyan-100', bar: '#0d9488' },
    ]

    const style = templateStyles[selectedTemplate] || templateStyles[0]
    previewWrapper.className = `rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br ${style.bg}`
    previewAccentBar.style.backgroundColor = style.bar
  }

  if (storeNameInput) {
    storeNameInput.addEventListener('input', updatePreview)
  }

  // --- Step Indicator ---
  function updateStepIndicator(step) {
    const steps = [1, 2, 3]
    steps.forEach((s) => {
      const ind = document.getElementById(`step-ind-${s}`)
      if (!ind) return
      const circle = ind.querySelector('div')
      const label = ind.querySelector('span')

      if (s <= step) {
        circle.className = 'w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold'
        if (label) label.className = 'text-sm font-semibold text-brand-600 hidden sm:inline'
      } else {
        circle.className = 'w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold'
        if (label) label.className = 'text-sm font-semibold text-gray-400 hidden sm:inline'
      }
    })

    const line1 = document.getElementById('step-line-1')
    const line2 = document.getElementById('step-line-2')
    if (line1) line1.className = step >= 2 ? 'flex-1 h-0.5 bg-brand-600 mx-2 sm:mx-4 transition-colors' : 'flex-1 h-0.5 bg-gray-200 mx-2 sm:mx-4 transition-colors'
    if (line2) line2.className = step >= 3 ? 'flex-1 h-0.5 bg-brand-600 mx-2 sm:mx-4 transition-colors' : 'flex-1 h-0.5 bg-gray-200 mx-2 sm:mx-4 transition-colors'
  }

  // --- Generate PDF — calls real API ---
  if (btnGenerate) {
    btnGenerate.addEventListener('click', async () => {
      updateStepIndicator(3)
      const overlay = document.getElementById('generating-overlay')
      overlay.classList.remove('hidden')

      try {
        const ctaText = ctaTextInput ? ctaTextInput.value.trim() : ''
        const cardLabel = cardLabelInput ? cardLabelInput.value.trim() : ''
        const payload = {
          google_url: googleUrlInput.value.trim(),
          store_name: storeNameInput ? storeNameInput.value.trim() : undefined,
          template: selectedTemplateId,
          image_data: uploadedImageData || undefined,
          cta_text: ctaText || undefined,
          label: cardLabel || undefined,
        }

        const res = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'カード作成に失敗しました')
        }

        // Save card ID for later claiming (if not logged in)
        try {
          const pending = JSON.parse(localStorage.getItem('revq_pending_cards') || '[]')
          if (!pending.includes(data.card.id)) {
            pending.push(data.card.id)
            localStorage.setItem('revq_pending_cards', JSON.stringify(pending))
          }
        } catch {}

        // Redirect to done page with card info in URL
        const params = new URLSearchParams({
          id: data.card.id,
          code: data.card.short_code,
          url: data.card.short_url,
          name: data.card.store_name || '',
          label: data.card.label || '',
        })
        window.location.href = `/done?${params.toString()}`
      } catch (err) {
        overlay.classList.add('hidden')
        alert(err.message || 'エラーが発生しました。もう一度お試しください。')
      }
    })
  }
}

/* =============================================
   DONE PAGE — Completion with real data + PDF layout
============================================= */
function initDonePage() {
  const params = new URLSearchParams(window.location.search)
  const cardId = params.get('id')
  const shortCode = params.get('code')
  const shortUrl = params.get('url')
  const storeName = params.get('name')

  // Current layout selection state
  let selectedLayout = 'a4-single'
  let selectedCopies = 1

  // Update displayed short URL
  const shortUrlEl = document.getElementById('short-url')
  if (shortUrlEl && shortUrl) {
    shortUrlEl.textContent = shortUrl
  }

  // Update heading if store name is present
  const headingEl = document.getElementById('done-heading')
  if (headingEl && storeName) {
    headingEl.textContent = `「${storeName}」のカードを作成しました`
  }

  // Load real QR code
  const qrContainer = document.getElementById('qr-container')
  if (qrContainer && cardId) {
    fetch(`/api/cards/${cardId}/qr`)
      .then(res => res.text())
      .then(svg => {
        qrContainer.innerHTML = svg
        // Make SVG responsive
        const svgEl = qrContainer.querySelector('svg')
        if (svgEl) {
          svgEl.setAttribute('width', '160')
          svgEl.setAttribute('height', '160')
        }
      })
      .catch(() => {})
  }

  // Copy URL
  const copyBtn = document.getElementById('copy-url-btn')
  const feedback = document.getElementById('copy-feedback')
  if (copyBtn && shortUrlEl) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(shortUrlEl.textContent.trim())
      feedback.classList.remove('opacity-0')
      feedback.classList.add('opacity-100')
      setTimeout(() => {
        feedback.classList.remove('opacity-100')
        feedback.classList.add('opacity-0')
      }, 2000)
    })
  }

  // --- PDF Layout Selection ---
  const layoutBtns = document.querySelectorAll('.pdf-layout-btn')
  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove selection from all
      layoutBtns.forEach(b => {
        b.classList.remove('border-brand-500', 'ring-2', 'ring-brand-200', 'bg-brand-50')
        b.classList.add('border-gray-200')
      })
      // Select current
      btn.classList.remove('border-gray-200')
      btn.classList.add('border-brand-500', 'ring-2', 'ring-brand-200', 'bg-brand-50')
      
      selectedLayout = btn.dataset.layout
      selectedCopies = parseInt(btn.dataset.copies) || 1
    })
  })

  // Show register CTA or dashboard link based on auth state
  const registerCta = document.getElementById('done-register-cta')
  const dashboardLink = document.getElementById('done-dashboard-link')
  fetch('/api/auth/me').then(r => r.json()).then(data => {
    if (data.user) {
      // Logged in — show dashboard link, hide register CTA
      if (dashboardLink) dashboardLink.classList.remove('hidden')
      if (registerCta) registerCta.classList.add('hidden')
      // Clear pending cards since user is logged in
      localStorage.removeItem('revq_pending_cards')
    } else {
      // Not logged in — show register CTA
      if (registerCta) registerCta.classList.remove('hidden')
      if (dashboardLink) dashboardLink.classList.add('hidden')
    }
  }).catch(() => {
    if (registerCta) registerCta.classList.remove('hidden')
  })

  // PDF Download — real download with layout
  const downloadBtn = document.getElementById('btn-download-pdf')
  if (downloadBtn && cardId) {
    downloadBtn.addEventListener('click', async () => {
      downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中…'
      downloadBtn.disabled = true
      try {
        const layoutParam = `layout=${selectedLayout}&copies=${selectedCopies}`
        const res = await fetch(`/api/cards/${cardId}/pdf?${layoutParam}`)
        if (!res.ok) throw new Error('PDF生成に失敗しました')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const layoutSuffix = selectedLayout !== 'card' ? `_${selectedLayout}_${selectedCopies}` : ''
        a.download = storeName ? `RevQ_${storeName.replace(/\s+/g, '_')}${layoutSuffix}.pdf` : `RevQ_${shortCode}${layoutSuffix}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        downloadBtn.innerHTML = '<i class="fas fa-check"></i> ダウンロード完了'
        downloadBtn.classList.remove('bg-brand-600', 'hover:bg-brand-700')
        downloadBtn.classList.add('bg-green-500')
        setTimeout(() => {
          downloadBtn.innerHTML = '<i class="fas fa-download"></i> PDFをダウンロード'
          downloadBtn.classList.remove('bg-green-500')
          downloadBtn.classList.add('bg-brand-600', 'hover:bg-brand-700')
          downloadBtn.disabled = false
        }, 2500)
      } catch (err) {
        downloadBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> エラー'
        setTimeout(() => {
          downloadBtn.innerHTML = '<i class="fas fa-download"></i> PDFをダウンロード'
          downloadBtn.disabled = false
        }, 2000)
      }
    })
  }
}

/* =============================================
   LOGIN PAGE — Login / Register with OTP
============================================= */
function initLoginPage() {
  const stepEmail = document.getElementById('login-step-email')
  const stepCode = document.getElementById('login-step-code')
  const btnSendCode = document.getElementById('btn-send-code')
  const btnLogin = document.getElementById('btn-login')
  const btnLoginLabel = document.getElementById('btn-login-label')
  const btnBackEmail = document.getElementById('btn-back-email')
  const btnResendCode = document.getElementById('btn-resend-code')
  const emailInput = document.getElementById('login-email')
  const codeInput = document.getElementById('login-code')
  const sentEmailDisplay = document.getElementById('sent-email-display')
  const otpEmailSent = document.getElementById('otp-email-sent')
  const otpError = document.getElementById('otp-error')
  const otpErrorMsg = document.getElementById('otp-error-message')
  const otpErrorDetail = document.getElementById('otp-error-detail')
  const tabLogin = document.getElementById('tab-login')
  const tabRegister = document.getElementById('tab-register')
  const authTitle = document.getElementById('auth-title')
  const authSubtitle = document.getElementById('auth-subtitle')
  const authInfoText = document.getElementById('auth-info-text')
  const authTabs = document.getElementById('auth-tabs')

  // Current mode: 'login' or 'register'
  let authMode = 'login'
  let savedEmail = ''

  // Check URL params for mode (e.g. /login?mode=register)
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('mode') === 'register') {
    authMode = 'register'
  }

  // --- Pending card IDs management ---
  // Saved when user creates cards before logging in
  function getPendingCardIds() {
    try {
      const raw = localStorage.getItem('revq_pending_cards')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  }

  function clearPendingCardIds() {
    localStorage.removeItem('revq_pending_cards')
  }

  // --- Tab switching ---
  function updateTabUI() {
    const isLogin = authMode === 'login'

    // Tab styling
    if (isLogin) {
      tabLogin.classList.add('bg-white', 'text-gray-900', 'shadow-sm')
      tabLogin.classList.remove('text-gray-500')
      tabRegister.classList.remove('bg-white', 'text-gray-900', 'shadow-sm')
      tabRegister.classList.add('text-gray-500')
    } else {
      tabRegister.classList.add('bg-white', 'text-gray-900', 'shadow-sm')
      tabRegister.classList.remove('text-gray-500')
      tabLogin.classList.remove('bg-white', 'text-gray-900', 'shadow-sm')
      tabLogin.classList.add('text-gray-500')
    }

    // Text updates
    authTitle.textContent = isLogin ? 'ログイン' : '新規登録'
    authSubtitle.textContent = isLogin
      ? 'メールアドレスにワンタイムコードを送信します'
      : '無料でアカウントを作成します'
    authInfoText.innerHTML = isLogin
      ? '<i class="fas fa-shield-alt mr-1"></i>パスワード不要。毎回メールで届くコードでログインします。'
      : '<i class="fas fa-gift mr-1"></i>無料プラン: 店舗3件、QRコード各2枚まで。登録後すぐに使えます。'
    if (btnLoginLabel) {
      btnLoginLabel.textContent = isLogin ? 'ログイン' : '登録する'
    }
  }

  if (tabLogin) {
    tabLogin.addEventListener('click', () => {
      authMode = 'login'
      updateTabUI()
      // Reset to email step
      stepCode.classList.add('hidden')
      stepEmail.classList.remove('hidden')
      otpEmailSent.classList.add('hidden')
      otpError.classList.add('hidden')
    })
  }
  if (tabRegister) {
    tabRegister.addEventListener('click', () => {
      authMode = 'register'
      updateTabUI()
      // Reset to email step
      stepCode.classList.add('hidden')
      stepEmail.classList.remove('hidden')
      otpEmailSent.classList.add('hidden')
      otpError.classList.add('hidden')
    })
  }

  // Initial tab state
  updateTabUI()

  // --- Show error in notification area ---
  function showError(message, detail) {
    otpEmailSent.classList.add('hidden')
    otpError.classList.remove('hidden')
    if (otpErrorMsg) otpErrorMsg.textContent = message || 'エラーが発生しました'
    if (otpErrorDetail) otpErrorDetail.textContent = detail || ''
  }

  // --- Send OTP ---
  async function sendOTP(email) {
    otpEmailSent.classList.add('hidden')
    otpError.classList.add('hidden')

    const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/send-code'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()

    if (!res.ok) {
      // If user not registered and on login tab, suggest switching
      if (data.code === 'NOT_REGISTERED') {
        showError('このメールアドレスは登録されていません', '「新規登録」タブからアカウントを作成してください')
        // Stay on email step — don't move to code step
        throw new Error('__handled__')
      }
      // If user already registered and on register tab, suggest switching
      if (data.code === 'ALREADY_REGISTERED') {
        showError('このメールアドレスは既に登録されています', '「ログイン」タブからログインしてください')
        throw new Error('__handled__')
      }
      // Rate limit or other error on resend (code step visible)
      if (!stepCode.classList.contains('hidden')) {
        showError(data.error || 'コード送信に失敗しました', '')
        return
      }
      throw new Error(data.error || 'コード送信に失敗しました')
    }

    savedEmail = email
    sentEmailDisplay.textContent = email
    stepEmail.classList.add('hidden')
    stepCode.classList.remove('hidden')
    authTabs.classList.add('hidden')
    codeInput.focus()

    otpEmailSent.classList.remove('hidden')
    otpError.classList.add('hidden')
  }

  // --- Send button ---
  if (btnSendCode) {
    btnSendCode.addEventListener('click', async () => {
      const email = emailInput.value.trim()
      if (!email || !email.includes('@')) {
        shakeElement(emailInput)
        emailInput.focus()
        return
      }

      btnSendCode.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> 送信中…'
      btnSendCode.disabled = true

      try {
        await sendOTP(email)
        startResendCooldown()
      } catch (err) {
        if (err.message !== '__handled__') {
          showError(err.message, '')
        }
      } finally {
        btnSendCode.innerHTML = '<i class="fas fa-paper-plane text-sm mr-1"></i> ワンタイムコードを送信'
        btnSendCode.disabled = false
      }
    })
  }

  // --- Resend with cooldown ---
  let resendCooldown = false
  function startResendCooldown() {
    resendCooldown = true
    let remaining = 60
    btnResendCode.disabled = true
    btnResendCode.innerHTML = `<i class="fas fa-clock mr-1"></i> 再送信（${remaining}秒）`
    const timer = setInterval(() => {
      remaining--
      if (remaining <= 0) {
        clearInterval(timer)
        resendCooldown = false
        btnResendCode.disabled = false
        btnResendCode.innerHTML = '<i class="fas fa-redo mr-1"></i> 再送信'
      } else {
        btnResendCode.innerHTML = `<i class="fas fa-clock mr-1"></i> 再送信（${remaining}秒）`
      }
    }, 1000)
  }

  if (btnResendCode) {
    btnResendCode.addEventListener('click', async () => {
      if (!savedEmail || resendCooldown) return
      btnResendCode.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> 送信中…'
      btnResendCode.disabled = true
      try {
        await sendOTP(savedEmail)
        startResendCooldown()
      } catch (err) {
        if (err.message !== '__handled__') {
          showError(err.message, '')
        }
        btnResendCode.innerHTML = '<i class="fas fa-redo mr-1"></i> 再送信'
        btnResendCode.disabled = false
      }
    })
  }

  // --- Back to email step ---
  if (btnBackEmail) {
    btnBackEmail.addEventListener('click', () => {
      stepCode.classList.add('hidden')
      stepEmail.classList.remove('hidden')
      authTabs.classList.remove('hidden')
      emailInput.focus()
      otpEmailSent.classList.add('hidden')
      otpError.classList.add('hidden')
    })
  }

  // --- Verify OTP ---
  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      const code = codeInput.value.trim()
      if (!code) {
        shakeElement(codeInput)
        codeInput.focus()
        return
      }

      const label = authMode === 'register' ? '登録中…' : 'ログイン中…'
      btnLogin.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i> ${label}`
      btnLogin.disabled = true

      try {
        const pendingCards = getPendingCardIds()
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: savedEmail,
            code,
            mode: authMode,
            pending_card_ids: pendingCards.length > 0 ? pendingCards : undefined,
          }),
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'ログインに失敗しました')

        // Clear pending cards after successful claim
        if (data.claimed_cards && data.claimed_cards.length > 0) {
          clearPendingCardIds()
        }

        window.location.href = '/dashboard'
      } catch (err) {
        showError(err.message, '')
        const labelText = authMode === 'register' ? '登録する' : 'ログイン'
        btnLogin.innerHTML = `<span id="btn-login-label">${labelText}</span> <i class="fas fa-arrow-right text-sm"></i>`
        btnLogin.disabled = false
      }
    })
  }

  // --- Enter key support ---
  if (emailInput) {
    emailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnSendCode?.click()
    })
  }
  if (codeInput) {
    codeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnLogin?.click()
    })
  }
}

/* =============================================
   DASHBOARD PAGE — Real data with PDF layout
============================================= */
async function initDashboardPage() {
  const cardsContainer = document.getElementById('dashboard-cards')
  const statsContainer = document.getElementById('dashboard-stats')
  const emptyState = document.getElementById('dashboard-empty')

  // Check if logged in
  try {
    const authRes = await fetch('/api/auth/me')
    const authData = await authRes.json()
    if (!authData.user) {
      window.location.href = '/login'
      return
    }
    // Show user name
    const userNameEl = document.getElementById('dashboard-user-name')
    if (userNameEl && authData.user.name) {
      userNameEl.textContent = authData.user.name
    }
    const userEmailEl = document.getElementById('dashboard-user-email')
    if (userEmailEl) {
      userEmailEl.textContent = authData.user.email
    }

    // Setup weekly email preference toggle
    setupWeeklyEmailToggle(authData.user.weekly_email)

    // Render plan status
    renderPlanStatus(authData.user)

    // Handle upgrade=success
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('upgrade') === 'success') {
      // Show success toast
      const toast = document.createElement('div')
      toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 animate-bounce'
      toast.innerHTML = '<i class="fas fa-check-circle"></i>Proプランへのアップグレードが完了しました！'
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 5000)
      // Clean URL
      history.replaceState(null, '', '/dashboard')
    }
  } catch {
    window.location.href = '/login'
    return
  }

  // Load cards
  try {
    const res = await fetch('/api/cards')
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    const cards = data.cards || []
    const stores = data.stores || []
    const maxStores = data.max_stores || 2
    const maxCardsPerStore = data.max_cards_per_store || 2

    // Update stats
    if (statsContainer) {
      const totalCards = cards.length
      const totalClicks = cards.reduce((sum, c) => sum + (c.click_count || 0), 0)
      const totalFeedbacks = cards.reduce((sum, c) => sum + (c.feedback_count || 0), 0)
      const unreadFeedbacks = cards.reduce((sum, c) => sum + (c.unread_feedback || 0), 0)
      statsContainer.innerHTML = `
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">登録店舗</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">${stores.length} <span class="text-sm font-normal text-gray-400">/ ${maxStores}</span></p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">QRカード</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">${totalCards} <span class="text-sm font-normal text-gray-400">(各店舗${maxCardsPerStore}枚まで)</span></p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">総クリック数</p>
          <p class="text-2xl sm:text-3xl font-bold text-brand-600">${totalClicks}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">フィードバック</p>
          <p class="text-2xl sm:text-3xl font-bold text-amber-600">${totalFeedbacks}${unreadFeedbacks > 0 ? ` <span class="text-sm font-normal bg-red-500 text-white px-2 py-0.5 rounded-full">${unreadFeedbacks}件未読</span>` : ''}</p>
        </div>
      `
    }

    // Show/hide "create new" button based on store limit
    const createNewBtn = document.querySelector('a[href="/#create"]')
    if (createNewBtn && stores.length >= maxStores) {
      // Check if ALL stores are also at card limit
      const allStoresFull = stores.every(s => {
        const storeCards = cards.filter(c => c.store_id === s.id)
        return storeCards.length >= maxCardsPerStore
      })
      if (allStoresFull) {
        createNewBtn.classList.add('opacity-50', 'pointer-events-none')
        createNewBtn.title = `店舗上限（${maxStores}件）およびQR上限に達しています`
        createNewBtn.insertAdjacentHTML('afterend', `<span class="text-xs text-gray-400 ml-2">上限到達</span>`)
      }
    }

    if (cards.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden')
      if (cardsContainer) cardsContainer.classList.add('hidden')
      return
    }

    // Render cards
    if (cardsContainer) {
      cardsContainer.innerHTML = cards.map(card => `
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden" data-card-id="${card.id}">
          <div class="p-5 sm:p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-bold text-gray-900 text-lg">${escapeHtml(card.store_name || '(店名なし)')}</h3>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  ${card.label ? `<span class="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium"><i class="fas fa-tag mr-0.5 text-[10px]"></i>${escapeHtml(card.label)}</span>` : ''}
                  <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">${escapeHtml(card.template)}</span>
                  <span class="text-xs text-gray-400">${formatDate(card.created_at)}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-brand-600">${card.click_count || 0}</p>
                <p class="text-[10px] text-gray-400 uppercase tracking-wider">クリック</p>
              </div>
            </div>

            <!-- Gate Toggle -->
            <div class="flex items-center justify-between bg-gradient-to-r ${card.gate_enabled ? 'from-green-50 to-emerald-50 border-green-200' : 'from-gray-50 to-gray-50 border-gray-200'} border rounded-lg p-3 mb-4 transition-all">
              <div class="flex items-center gap-2">
                <i class="fas fa-shield-alt ${card.gate_enabled ? 'text-green-600' : 'text-gray-400'} text-sm"></i>
                <div>
                  <p class="text-xs font-semibold ${card.gate_enabled ? 'text-green-800' : 'text-gray-600'}">満足/不満ゲート</p>
                  <p class="text-[10px] ${card.gate_enabled ? 'text-green-600' : 'text-gray-400'}">
                    ${card.gate_enabled ? 'ON — 満足→Googleレビュー / 不満→フォーム' : 'OFF — 直接Googleレビューへ'}
                  </p>
                </div>
              </div>
              <button type="button" class="btn-toggle-gate relative w-11 h-6 rounded-full transition-all ${card.gate_enabled ? 'bg-green-500' : 'bg-gray-300'}" data-card-id="${card.id}" data-enabled="${card.gate_enabled ? '1' : '0'}">
                <span class="absolute top-0.5 ${card.gate_enabled ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'} w-5 h-5 bg-white rounded-full shadow-sm transition-all"></span>
              </button>
            </div>

            <!-- Feedback Badge + Viewer -->
            ${card.gate_enabled ? `
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <i class="fas fa-comment-dots text-amber-500 text-sm"></i>
                  <span class="text-xs font-semibold text-gray-600">フィードバック</span>
                  ${card.feedback_count > 0 ? `<span class="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">${card.feedback_count}件</span>` : ''}
                  ${card.unread_feedback > 0 ? `<span class="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">${card.unread_feedback}件未読</span>` : ''}
                </div>
                ${card.feedback_count > 0 ? `
                <button type="button" class="btn-view-feedbacks text-xs text-brand-600 hover:text-brand-700 font-semibold" data-card-id="${card.id}">
                  <i class="fas fa-eye mr-0.5"></i>表示
                </button>
                ` : ''}
              </div>
              <div class="feedbacks-container hidden" data-card-id="${card.id}"></div>
            </div>
            ` : ''}

            <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-4">
              <i class="fas fa-link text-gray-400 text-sm"></i>
              <code class="text-sm font-mono text-brand-600 flex-1 truncate">${escapeHtml(card.short_url)}</code>
              <button type="button" class="copy-url-btn p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-all" data-url="${escapeHtml(card.short_url)}" title="URLをコピー">
                <i class="fas fa-copy"></i>
              </button>
            </div>
            ${card.recent_clicks && card.recent_clicks.length > 0 ? `
            <div class="mb-4 bg-blue-50/50 border border-blue-100 rounded-lg p-3">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <i class="fas fa-clock mr-1"></i>直近の読み込み
              </p>
              <div class="space-y-1">
                ${card.recent_clicks.map((dt, i) => `
                  <div class="flex items-center gap-2 text-xs">
                    <span class="w-4 h-4 rounded-full ${i === 0 ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center text-[10px] font-bold flex-shrink-0">${i + 1}</span>
                    <span class="font-mono ${i === 0 ? 'text-gray-800 font-semibold' : 'text-gray-500'}">${formatDateTimeJST(dt)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : `
            <div class="mb-4 bg-gray-50 border border-gray-100 rounded-lg p-3">
              <p class="text-xs text-gray-400 text-center"><i class="fas fa-clock mr-1"></i>まだ読み込みがありません</p>
            </div>
            `}
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-2 qr-mini" data-card-id="${card.id}">
                <div class="w-14 h-14 flex items-center justify-center text-gray-300">
                  <i class="fas fa-qrcode text-2xl"></i>
                </div>
              </div>
              <div class="flex gap-2 flex-1 flex-wrap">
                <div class="relative">
                  <button type="button" class="btn-pdf-menu text-xs font-semibold text-brand-600 border border-brand-200 hover:bg-brand-50 px-3 py-2 rounded-lg transition-all" data-card-id="${card.id}" data-name="${escapeHtml(card.store_name || card.short_code)}">
                    <i class="fas fa-download mr-1"></i>PDF <i class="fas fa-caret-down ml-1"></i>
                  </button>
                  <div class="pdf-menu hidden absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-44" data-card-id="${card.id}">
                    <button type="button" class="btn-dl-pdf w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-t-lg transition-colors" data-layout="a4-single" data-copies="1">
                      <i class="fas fa-expand mr-1.5"></i>A4 1枚（拡大）
                    </button>
                    <button type="button" class="btn-dl-pdf w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors" data-layout="a4-multi" data-copies="2">
                      <i class="fas fa-columns mr-1.5"></i>A4 2分割
                    </button>
                    <button type="button" class="btn-dl-pdf w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors" data-layout="a4-multi" data-copies="4">
                      <i class="fas fa-th-large mr-1.5"></i>A4 4分割
                    </button>
                    <button type="button" class="btn-dl-pdf w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-b-lg transition-colors" data-layout="a4-multi" data-copies="8">
                      <i class="fas fa-th mr-1.5"></i>A4 8分割
                    </button>
                  </div>
                </div>
                <a href="/api/cards/${card.id}/qr" target="_blank" class="text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all text-center no-underline">
                  <i class="fas fa-qrcode mr-1"></i>QR
                </a>
                <button type="button" class="btn-delete-card text-xs font-semibold text-red-400 border border-red-100 hover:bg-red-50 px-3 py-2 rounded-lg transition-all" data-card-id="${card.id}" data-name="${escapeHtml(card.store_name || card.short_code)}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('')

      // Load mini QR codes
      cards.forEach(card => {
        const qrEl = cardsContainer.querySelector(`.qr-mini[data-card-id="${card.id}"]`)
        if (qrEl) {
          fetch(`/api/cards/${card.id}/qr`)
            .then(res => res.text())
            .then(svg => {
              qrEl.innerHTML = svg
              const svgEl = qrEl.querySelector('svg')
              if (svgEl) {
                svgEl.setAttribute('width', '56')
                svgEl.setAttribute('height', '56')
              }
            })
            .catch(() => {})
        }
      })

      // Attach event listeners
      attachDashboardEvents(cardsContainer)
    }
  } catch (err) {
    if (cardsContainer) {
      cardsContainer.innerHTML = `<div class="col-span-2 text-center p-8 text-gray-500"><i class="fas fa-exclamation-triangle mr-2"></i>${err.message || 'データの読み込みに失敗しました'}</div>`
    }
  }
}

function attachDashboardEvents(container) {
  // Gate toggle
  container.querySelectorAll('.btn-toggle-gate').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cardId = btn.dataset.cardId
      const currentlyEnabled = btn.dataset.enabled === '1'
      const newEnabled = currentlyEnabled ? 0 : 1

      // Optimistic UI update
      const knob = btn.querySelector('span')
      if (newEnabled) {
        btn.classList.remove('bg-gray-300')
        btn.classList.add('bg-green-500')
        knob.style.left = 'calc(100% - 1.375rem)'
      } else {
        btn.classList.remove('bg-green-500')
        btn.classList.add('bg-gray-300')
        knob.style.left = '0.125rem'
      }
      btn.dataset.enabled = String(newEnabled)

      try {
        const res = await fetch(`/api/cards/${cardId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gate_enabled: newEnabled })
        })
        if (!res.ok) throw new Error()
        // Reload dashboard to update full UI (gate description, feedback section)
        initDashboardPage()
      } catch {
        // Revert on error
        btn.dataset.enabled = String(currentlyEnabled ? 1 : 0)
        if (currentlyEnabled) {
          btn.classList.remove('bg-gray-300')
          btn.classList.add('bg-green-500')
          knob.style.left = 'calc(100% - 1.375rem)'
        } else {
          btn.classList.remove('bg-green-500')
          btn.classList.add('bg-gray-300')
          knob.style.left = '0.125rem'
        }
      }
    })
  })

  // View feedbacks
  container.querySelectorAll('.btn-view-feedbacks').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cardId = btn.dataset.cardId
      const fbContainer = container.querySelector(`.feedbacks-container[data-card-id="${cardId}"]`)
      if (!fbContainer) return

      // Toggle visibility
      if (!fbContainer.classList.contains('hidden')) {
        fbContainer.classList.add('hidden')
        btn.innerHTML = '<i class="fas fa-eye mr-0.5"></i>表示'
        return
      }

      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-0.5"></i>読み込み中…'
      try {
        const res = await fetch(`/api/cards/${cardId}/feedbacks`)
        const data = await res.json()
        const feedbacks = data.feedbacks || []

        if (feedbacks.length === 0) {
          fbContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">フィードバックはありません</p>'
        } else {
          fbContainer.innerHTML = `
            <div class="space-y-2 max-h-64 overflow-y-auto">
              ${feedbacks.map(fb => `
                <div class="bg-white border ${fb.is_read ? 'border-gray-100' : 'border-amber-200 bg-amber-50/30'} rounded-lg p-3 text-xs">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-gray-700 leading-relaxed flex-1 whitespace-pre-wrap">${escapeHtml(fb.message)}</p>
                    ${!fb.is_read ? '<span class="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1"></span>' : ''}
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1.5">${formatDateTimeJST(fb.created_at)}</p>
                </div>
              `).join('')}
            </div>
            <button type="button" class="btn-mark-all-read w-full text-center text-[11px] text-brand-600 hover:text-brand-700 font-semibold mt-2 py-1" data-card-id="${cardId}">
              <i class="fas fa-check-double mr-0.5"></i>すべて既読にする
            </button>
          `

          // Attach mark-all-read
          const markBtn = fbContainer.querySelector('.btn-mark-all-read')
          if (markBtn) {
            markBtn.addEventListener('click', async () => {
              markBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
              await fetch(`/api/cards/${cardId}/feedbacks/read`, { method: 'PUT' })
              // Reload
              initDashboardPage()
            })
          }
        }

        fbContainer.classList.remove('hidden')
        btn.innerHTML = '<i class="fas fa-eye-slash mr-0.5"></i>閉じる'

        // Auto mark as read
        await fetch(`/api/cards/${cardId}/feedbacks/read`, { method: 'PUT' })
      } catch {
        btn.innerHTML = '<i class="fas fa-eye mr-0.5"></i>表示'
      }
    })
  })

  // Copy URLs
  container.querySelectorAll('.copy-url-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      copyToClipboard(btn.dataset.url)
      const icon = btn.querySelector('i')
      icon.className = 'fas fa-check text-green-500'
      setTimeout(() => { icon.className = 'fas fa-copy' }, 1500)
    })
  })

  // PDF menu toggle
  container.querySelectorAll('.btn-pdf-menu').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const cardId = btn.dataset.cardId
      const menu = container.querySelector(`.pdf-menu[data-card-id="${cardId}"]`)
      if (!menu) return
      
      // Close all other menus first
      container.querySelectorAll('.pdf-menu').forEach(m => {
        if (m !== menu) m.classList.add('hidden')
      })
      menu.classList.toggle('hidden')
    })
  })

  // Close menus on outside click
  document.addEventListener('click', () => {
    container.querySelectorAll('.pdf-menu').forEach(m => m.classList.add('hidden'))
  })

  // PDF download with layout
  container.querySelectorAll('.btn-dl-pdf').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const menu = btn.closest('.pdf-menu')
      const cardId = menu.dataset.cardId
      const layout = btn.dataset.layout
      const copies = btn.dataset.copies
      const menuBtn = container.querySelector(`.btn-pdf-menu[data-card-id="${cardId}"]`)
      const name = menuBtn ? menuBtn.dataset.name : cardId

      // Close menu
      menu.classList.add('hidden')

      // Show loading
      if (menuBtn) {
        menuBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
        menuBtn.disabled = true
      }

      try {
        const res = await fetch(`/api/cards/${cardId}/pdf?layout=${layout}&copies=${copies}`)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const layoutSuffix = `_${layout}_${copies}`
        a.download = `RevQ_${name.replace(/\s+/g, '_')}${layoutSuffix}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch { }

      if (menuBtn) {
        menuBtn.innerHTML = '<i class="fas fa-download mr-1"></i>PDF <i class="fas fa-caret-down ml-1"></i>'
        menuBtn.disabled = false
      }
    })
  })

  // Delete card
  container.querySelectorAll('.btn-delete-card').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cardId = btn.dataset.cardId
      const name = btn.dataset.name
      if (!confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) return
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
      btn.disabled = true
      try {
        const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' })
        if (res.ok) {
          const cardEl = btn.closest('[data-card-id]')
          if (cardEl) cardEl.remove()
        }
      } catch { }
    })
  })
}

/* =============================================
   DASHBOARD: Weekly Email Toggle
============================================= */
function setupWeeklyEmailToggle(initialValue) {
  const settingsSection = document.getElementById('dashboard-settings')
  const checkbox = document.getElementById('chk-weekly-email')
  const statusEl = document.getElementById('weekly-email-status')
  if (!settingsSection || !checkbox) return

  // Show settings section
  settingsSection.classList.remove('hidden')

  // Set initial state
  checkbox.checked = initialValue === 1 || initialValue === true

  // Listen for changes
  checkbox.addEventListener('change', async () => {
    const newVal = checkbox.checked ? 1 : 0
    try {
      const res = await fetch('/api/auth/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekly_email: newVal })
      })
      if (!res.ok) throw new Error()

      // Show saved status
      if (statusEl) {
        statusEl.innerHTML = checkbox.checked
          ? '<i class="fas fa-check-circle text-green-500 mr-0.5"></i>週刊レポートを受け取ります'
          : '<i class="fas fa-times-circle text-gray-400 mr-0.5"></i>週刊レポートを停止しました'
        statusEl.classList.remove('hidden')
        setTimeout(() => statusEl.classList.add('hidden'), 3000)
      }
    } catch {
      // Revert on error
      checkbox.checked = !checkbox.checked
    }
  })
}

/* =============================================
   ADMIN PAGE — Real API data
============================================= */
async function initAdminPage() {
  // --- Tab Navigation ---
  const tabs = document.querySelectorAll('.admin-tab')
  const tabContents = document.querySelectorAll('.admin-tab-content')

  function switchTab(tabName) {
    tabs.forEach((t) => {
      if (t.dataset.tab === tabName) {
        t.classList.add('border-brand-600', 'text-brand-600')
        t.classList.remove('border-transparent', 'text-gray-500')
      } else {
        t.classList.remove('border-brand-600', 'text-brand-600')
        t.classList.add('border-transparent', 'text-gray-500')
      }
    })
    tabContents.forEach((tc) => {
      if (tc.id === `tab-${tabName}`) tc.classList.remove('hidden')
      else tc.classList.add('hidden')
    })
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => switchTab(tab.dataset.tab)))

  // Tab links
  document.querySelectorAll('.admin-tab-link').forEach(link => {
    link.addEventListener('click', () => switchTab(link.dataset.target))
  })

  // --- Toggle Switches ---
  document.querySelectorAll('.admin-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isActive = toggle.dataset.active === 'true'
      const knob = toggle.querySelector('span')
      if (isActive) {
        toggle.dataset.active = 'false'
        toggle.classList.remove('bg-brand-600')
        toggle.classList.add('bg-gray-300')
        knob.style.left = '2px'
      } else {
        toggle.dataset.active = 'true'
        toggle.classList.remove('bg-gray-300')
        toggle.classList.add('bg-brand-600')
        knob.style.left = 'calc(100% - 1.625rem)'
      }
    })
  })

  // --- Save Settings button ---
  const saveBtn = document.getElementById('btn-save-settings')
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i>保存中…'
      saveBtn.disabled = true
      setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-check mr-1.5"></i>保存しました'
        saveBtn.classList.remove('bg-brand-600', 'hover:bg-brand-700')
        saveBtn.classList.add('bg-green-500')
        setTimeout(() => {
          saveBtn.innerHTML = '<i class="fas fa-save mr-1.5"></i>設定を保存'
          saveBtn.classList.remove('bg-green-500')
          saveBtn.classList.add('bg-brand-600', 'hover:bg-brand-700')
          saveBtn.disabled = false
        }, 2000)
      }, 800)
    })
  }

  // --- Reset All Data button ---
  const resetBtn = document.getElementById('btn-reset-all-data')
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      // First confirmation
      const ok1 = confirm('⚠️ 本当にすべてのデータを削除しますか？\n\nこの操作は取り消せません。\n・全ユーザー\n・全カード\n・全店舗\n・全クリック履歴\n・全フィードバック\n・全OTP履歴\nが完全に削除されます。')
      if (!ok1) return

      // Second confirmation with typed input
      const typed = prompt('最終確認: 削除を実行するには「全データ削除」と入力してください。')
      if (typed !== '全データ削除') {
        alert('入力が一致しないため、削除をキャンセルしました。')
        return
      }

      // Execute reset
      resetBtn.disabled = true
      resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>削除中…'
      
      try {
        const res = await fetch('/api/admin/reset-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ confirm: 'DELETE_ALL_DATA' })
        })
        const data = await res.json()
        
        if (res.ok && data.success) {
          alert('✅ 全データを削除しました。ページを再読み込みします。')
          location.reload()
        } else {
          alert('❌ エラー: ' + (data.error || '削除に失敗しました'))
        }
      } catch (e) {
        alert('❌ 通信エラー: データリセットに失敗しました')
      } finally {
        resetBtn.disabled = false
        resetBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i>リセット'
      }
    })
  }

  // --- Load real data ---
  loadAdminStats()
  loadAdminRecentActivity()
  loadAdminUsers()
  loadAdminCards()
  loadAdminFeedbacks()
  loadAdminOtp()
}

async function loadAdminStats() {
  try {
    const res = await fetch('/api/admin/stats')
    const s = await res.json()
    const el = document.getElementById('admin-kpi-grid')
    if (el) {
      el.innerHTML = `
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">総ユーザー数</p>
            <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center"><i class="fas fa-users text-brand-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-gray-900">${s.totalUsers}</p>
          <p class="text-xs text-green-500 mt-1"><i class="fas fa-arrow-up mr-0.5"></i>+${s.weekUsers} 今週</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">総カード数</p>
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><i class="fas fa-id-card text-amber-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-gray-900">${s.totalCards}</p>
          <p class="text-xs text-green-500 mt-1"><i class="fas fa-arrow-up mr-0.5"></i>+${s.weekCards} 今週</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">総クリック数</p>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><i class="fas fa-mouse-pointer text-green-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-brand-600">${s.totalClicks}</p>
          <p class="text-xs text-green-500 mt-1"><i class="fas fa-arrow-up mr-0.5"></i>+${s.weekClicks} 今週</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">稼働カード</p>
            <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center"><i class="fas fa-check-circle text-violet-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-gray-900">${s.activeCards}</p>
          <p class="text-xs text-gray-400 mt-1">/ ${s.totalCards} 全体</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">OTP発行数</p>
            <div class="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center"><i class="fas fa-envelope text-sky-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-gray-900">${s.totalOtps || 0}</p>
          <p class="text-xs ${s.hasResendKey ? 'text-green-500' : 'text-amber-500'} mt-1">
            <i class="fas ${s.hasResendKey ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-0.5"></i>
            ${s.hasResendKey ? 'メール送信有効' : 'メール未設定'}
          </p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">フィードバック</p>
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><i class="fas fa-comment-dots text-amber-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-amber-600">${s.totalFeedbacks || 0}</p>
          <p class="text-xs ${(s.unreadFeedbacks || 0) > 0 ? 'text-red-500' : 'text-gray-400'} mt-1">
            ${(s.unreadFeedbacks || 0) > 0 ? `<i class="fas fa-exclamation-circle mr-0.5"></i>${s.unreadFeedbacks}件未読` : '<i class="fas fa-check-circle mr-0.5"></i>未読なし'}
          </p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">ゲート有効</p>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><i class="fas fa-shield-alt text-green-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-green-600">${s.gateEnabledCards || 0}</p>
          <p class="text-xs text-gray-400 mt-1">/ ${s.activeCards || 0} 稼働中</p>
        </div>
      `
    }
  } catch {}
}

async function loadAdminRecentActivity() {
  try {
    const res = await fetch('/api/admin/recent-activity')
    const data = await res.json()

    const usersEl = document.getElementById('admin-recent-users')
    if (usersEl && data.recentUsers) {
      usersEl.innerHTML = data.recentUsers.length === 0
        ? '<div class="px-5 py-4 text-center text-sm text-gray-400">まだユーザーがいません</div>'
        : data.recentUsers.map(u => `
        <div class="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-bold">${escapeHtml((u.name || u.email).charAt(0))}</div>
            <div>
              <p class="text-sm font-semibold text-gray-800">${escapeHtml(u.name || '(未設定)')}</p>
              <p class="text-xs text-gray-400">${escapeHtml(u.email)}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">${formatDate(u.created_at)}</p>
            <p class="text-xs text-gray-400">カード ${u.card_count}枚</p>
          </div>
        </div>
      `).join('')
    }

    const cardsEl = document.getElementById('admin-recent-cards')
    if (cardsEl && data.recentCards) {
      cardsEl.innerHTML = data.recentCards.length === 0
        ? '<div class="px-5 py-4 text-center text-sm text-gray-400">まだカードがありません</div>'
        : data.recentCards.map(c => `
        <div class="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div>
            <p class="text-sm font-semibold text-gray-800">${escapeHtml(c.store_name || '(店名なし)')}</p>
            <p class="text-xs text-gray-400">${escapeHtml(c.user_name || '未登録')} ・ ${escapeHtml(c.template)}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-brand-600">${c.click_count}</p>
            <p class="text-[10px] text-gray-400">クリック</p>
          </div>
        </div>
      `).join('')
    }
  } catch {}
}

async function loadAdminUsers() {
  try {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    const tbody = document.getElementById('admin-users-tbody')
    const countEl = document.getElementById('admin-users-count')
    if (countEl) countEl.textContent = `${data.users.length}件`
    if (tbody) {
      tbody.innerHTML = data.users.map(u => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-5 py-3.5">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">${escapeHtml((u.name || u.email).charAt(0))}</div>
              <div>
                <p class="font-semibold text-gray-800">${escapeHtml(u.name || '(未設定)')}</p>
                <p class="text-xs text-gray-400">${escapeHtml(u.email)}</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-3.5 font-semibold text-gray-800">${u.card_count}</td>
          <td class="px-5 py-3.5 font-semibold text-brand-600">${u.total_clicks}</td>
          <td class="px-5 py-3.5"><span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">${escapeHtml(u.plan)}</span></td>
          <td class="px-5 py-3.5 text-gray-500">${formatDate(u.created_at)}</td>
          <td class="px-5 py-3.5 text-gray-500">${formatDate(u.last_login_at)}</td>
          <td class="px-5 py-3.5">
            <button type="button" class="btn-admin-delete-user p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all" data-id="${u.id}" data-name="${escapeHtml(u.name || u.email)}" title="削除">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </td>
        </tr>
      `).join('')

      // Delete user
      tbody.querySelectorAll('.btn-admin-delete-user').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm(`ユーザー「${btn.dataset.name}」を削除しますか？`)) return
          await fetch(`/api/admin/users/${btn.dataset.id}`, { method: 'DELETE' })
          btn.closest('tr').remove()
        })
      })
    }
  } catch {}
}

async function loadAdminCards() {
  try {
    const res = await fetch('/api/admin/cards')
    const data = await res.json()
    const tbody = document.getElementById('admin-cards-tbody')
    const countEl = document.getElementById('admin-cards-count')
    if (countEl) countEl.textContent = `${data.cards.length}件`
    if (tbody) {
      tbody.innerHTML = data.cards.map(c => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-5 py-3.5">
            <p class="font-semibold text-gray-800">${escapeHtml(c.store_name || '(店名なし)')}</p>
            ${c.label ? `<p class="text-xs text-amber-600 mt-0.5"><i class="fas fa-tag mr-0.5"></i>${escapeHtml(c.label)}</p>` : ''}
          </td>
          <td class="px-5 py-3.5"><code class="text-xs font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">${escapeHtml(c.short_url)}</code></td>
          <td class="px-5 py-3.5 text-gray-600">${escapeHtml(c.user_name || '未登録')}</td>
          <td class="px-5 py-3.5"><span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">${escapeHtml(c.template)}</span></td>
          <td class="px-5 py-3.5">
            ${c.gate_enabled ? '<span class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold"><i class="fas fa-shield-alt mr-0.5"></i>ON</span>' : '<span class="text-xs text-gray-400">OFF</span>'}
          </td>
          <td class="px-5 py-3.5 font-bold text-brand-600">${c.click_count}</td>
          <td class="px-5 py-3.5 text-gray-500">${formatDate(c.created_at)}</td>
          <td class="px-5 py-3.5">
            ${c.status === 'active'
              ? '<span class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>稼働中</span>'
              : '<span class="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>一時停止</span>'
            }
          </td>
          <td class="px-5 py-3.5">
            <div class="flex items-center gap-1">
              <button type="button" class="btn-toggle-card-status p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all" data-id="${c.id}" data-status="${c.status}" title="${c.status === 'active' ? '一時停止' : '再開'}">
                <i class="fas ${c.status === 'active' ? 'fa-pause' : 'fa-play'} text-sm"></i>
              </button>
              <button type="button" class="btn-admin-delete-card p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all" data-id="${c.id}" data-name="${escapeHtml(c.store_name || c.short_code)}" title="削除">
                <i class="fas fa-trash text-sm"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('')

      // Toggle card status
      tbody.querySelectorAll('.btn-toggle-card-status').forEach(btn => {
        btn.addEventListener('click', async () => {
          const newStatus = btn.dataset.status === 'active' ? 'paused' : 'active'
          await fetch(`/api/admin/cards/${btn.dataset.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          })
          loadAdminCards() // Reload
        })
      })

      // Delete card
      tbody.querySelectorAll('.btn-admin-delete-card').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm(`カード「${btn.dataset.name}」を削除しますか？`)) return
          await fetch(`/api/admin/cards/${btn.dataset.id}`, { method: 'DELETE' })
          btn.closest('tr').remove()
        })
      })
    }
  } catch {}
}

/* =============================================
   ADMIN: Feedbacks Tab
============================================= */
async function loadAdminFeedbacks() {
  try {
    const res = await fetch('/api/admin/feedbacks')
    const data = await res.json()
    const listEl = document.getElementById('admin-feedbacks-list')
    const countEl = document.getElementById('admin-feedbacks-count')
    const feedbacks = data.feedbacks || []

    if (countEl) countEl.textContent = `${feedbacks.length}件`

    if (listEl) {
      if (feedbacks.length === 0) {
        listEl.innerHTML = '<div class="px-5 py-12 text-center text-gray-400"><i class="fas fa-comment-slash text-3xl mb-3 block"></i><p>フィードバックはまだありません</p></div>'
      } else {
        listEl.innerHTML = feedbacks.map(fb => `
          <div class="px-5 py-4 hover:bg-gray-50 transition-colors ${fb.is_read ? '' : 'bg-amber-50/40'}" data-fb-id="${fb.id}">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 mt-1">
                ${fb.is_read
                  ? '<div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><i class="fas fa-comment text-gray-400 text-sm"></i></div>'
                  : '<div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center"><i class="fas fa-comment-dots text-amber-600 text-sm"></i></div>'
                }
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="text-sm font-semibold text-gray-800">${escapeHtml(fb.store_name || '(店名なし)')}</span>
                  ${fb.label ? `<span class="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full"><i class="fas fa-tag mr-0.5"></i>${escapeHtml(fb.label)}</span>` : ''}
                  ${!fb.is_read ? '<span class="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">未読</span>' : ''}
                  <span class="text-[10px] text-gray-400">${escapeHtml(fb.owner_email || '')}</span>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-1.5">${escapeHtml(fb.message)}</p>
                <p class="text-[10px] text-gray-400">${formatDateTimeJST(fb.created_at)}</p>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                ${!fb.is_read ? `
                <button type="button" class="btn-admin-mark-read p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all" data-id="${fb.id}" title="既読にする">
                  <i class="fas fa-check text-sm"></i>
                </button>
                ` : ''}
                <button type="button" class="btn-admin-delete-fb p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all" data-id="${fb.id}" title="削除">
                  <i class="fas fa-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')

        // Mark as read
        listEl.querySelectorAll('.btn-admin-mark-read').forEach(btn => {
          btn.addEventListener('click', async () => {
            await fetch(`/api/admin/feedbacks/${btn.dataset.id}/read`, { method: 'PUT' })
            loadAdminFeedbacks()
            loadAdminStats()
          })
        })

        // Delete feedback
        listEl.querySelectorAll('.btn-admin-delete-fb').forEach(btn => {
          btn.addEventListener('click', async () => {
            if (!confirm('このフィードバックを削除しますか？')) return
            await fetch(`/api/admin/feedbacks/${btn.dataset.id}`, { method: 'DELETE' })
            loadAdminFeedbacks()
            loadAdminStats()
          })
        })
      }
    }
  } catch {}
}

/* =============================================
   ADMIN: OTP / Email Tab
============================================= */
async function loadAdminOtp() {
  try {
    // Load stats
    const statsRes = await fetch('/api/admin/stats')
    const stats = await statsRes.json()

    // Email status card
    const emailStatusEl = document.getElementById('admin-email-status')
    if (emailStatusEl) {
      if (stats.hasResendKey) {
        emailStatusEl.innerHTML = `
          <div class="bg-green-50 rounded-xl border border-green-200 p-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-check-circle text-green-600 text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-green-800">メール送信: 有効</h4>
                <p class="text-sm text-green-600">Resend APIキーが設定されています。OTPコードはメールで送信されます。</p>
              </div>
            </div>
          </div>
        `
      } else {
        emailStatusEl.innerHTML = `
          <div class="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-amber-600 text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-amber-800">メール送信: 未設定</h4>
                <p class="text-sm text-amber-600">RESEND_API_KEY が未設定のため、OTPメール送信ができません。</p>
                <p class="text-xs text-amber-500 mt-1">
                  設定方法: <code class="bg-amber-100 px-1 rounded">wrangler pages secret put RESEND_API_KEY</code>
                </p>
              </div>
            </div>
          </div>
        `
      }
    }

    // OTP stats grid
    const otpStatsEl = document.getElementById('admin-otp-stats')
    if (otpStatsEl) {
      otpStatsEl.innerHTML = `
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">OTP総発行数</p>
            <div class="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center"><i class="fas fa-key text-sky-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-gray-900">${stats.totalOtps || 0}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">今週のOTP</p>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><i class="fas fa-chart-bar text-green-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-green-600">${stats.weekOtps || 0}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">登録ユーザー</p>
            <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center"><i class="fas fa-user-check text-brand-600 text-sm"></i></div>
          </div>
          <p class="text-3xl font-bold text-brand-600">${stats.totalUsers || 0}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">メール送信</p>
            <div class="w-8 h-8 ${stats.hasResendKey ? 'bg-green-100' : 'bg-amber-100'} rounded-lg flex items-center justify-center">
              <i class="fas ${stats.hasResendKey ? 'fa-envelope-open text-green-600' : 'fa-envelope text-amber-600'} text-sm"></i>
            </div>
          </div>
          <p class="text-lg font-bold ${stats.hasResendKey ? 'text-green-600' : 'text-amber-600'}">${stats.hasResendKey ? '有効' : '無効'}</p>
          <p class="text-xs text-gray-400 mt-1">Resend API</p>
        </div>
      `
    }

    // Load recent OTP activity
    const actRes = await fetch('/api/admin/recent-activity')
    const actData = await actRes.json()
    const otpTbody = document.getElementById('admin-otp-tbody')
    if (otpTbody && actData.recentOtps) {
      if (actData.recentOtps.length === 0) {
        otpTbody.innerHTML = '<tr><td colspan="4" class="px-5 py-8 text-center text-gray-400">まだOTPの発行がありません</td></tr>'
      } else {
        otpTbody.innerHTML = actData.recentOtps.map(otp => {
          const isExpired = new Date(otp.expires_at) < new Date()
          const status = otp.used
            ? '<span class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><i class="fas fa-check-circle"></i>使用済み</span>'
            : isExpired
              ? '<span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"><i class="fas fa-clock"></i>期限切れ</span>'
              : '<span class="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><i class="fas fa-hourglass-half"></i>有効</span>'
          return `
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3.5 text-gray-800">${escapeHtml(otp.email)}</td>
              <td class="px-5 py-3.5 text-gray-500">${formatDateTime(otp.created_at)}</td>
              <td class="px-5 py-3.5 text-gray-500">${formatDateTime(otp.expires_at)}</td>
              <td class="px-5 py-3.5">${status}</td>
            </tr>
          `
        }).join('')
      }
    }
  } catch {}
}

/* =============================================
   PRICING PAGE
============================================= */
function initPricingPage() {
  let interval = 'monthly'
  const toggleBtn = document.getElementById('toggle-interval')
  const toggleKnob = document.getElementById('toggle-knob')
  const labelMonthly = document.getElementById('label-monthly')
  const labelYearly = document.getElementById('label-yearly')
  const priceAmount = document.getElementById('price-amount')
  const priceInterval = document.getElementById('price-interval')
  const yearlyNote = document.getElementById('price-yearly-note')
  const subscribeBtn = document.getElementById('btn-subscribe-pro')

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      interval = interval === 'monthly' ? 'yearly' : 'monthly'
      updatePriceDisplay()
    })
  }

  function updatePriceDisplay() {
    if (interval === 'yearly') {
      toggleBtn.classList.remove('bg-gray-300')
      toggleBtn.classList.add('bg-brand-600')
      toggleKnob.style.left = 'calc(100% - 1.625rem)'
      labelMonthly.classList.remove('text-gray-900')
      labelMonthly.classList.add('text-gray-400')
      labelYearly.classList.remove('text-gray-400')
      labelYearly.classList.add('text-gray-900')
      if (priceAmount) priceAmount.textContent = '¥19,800'
      if (priceInterval) priceInterval.textContent = '/ 年'
      if (yearlyNote) {
        yearlyNote.textContent = '月あたり¥1,650（2ヶ月分お得）'
        yearlyNote.classList.remove('hidden')
      }
    } else {
      toggleBtn.classList.remove('bg-brand-600')
      toggleBtn.classList.add('bg-gray-300')
      toggleKnob.style.left = '0.125rem'
      labelMonthly.classList.remove('text-gray-400')
      labelMonthly.classList.add('text-gray-900')
      labelYearly.classList.remove('text-gray-900')
      labelYearly.classList.add('text-gray-400')
      if (priceAmount) priceAmount.textContent = '¥1,980'
      if (priceInterval) priceInterval.textContent = '/ 月'
      if (yearlyNote) yearlyNote.classList.add('hidden')
    }
  }

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', async () => {
      // Check login
      try {
        const authRes = await fetch('/api/auth/me')
        const authData = await authRes.json()
        if (!authData.user) {
          // Not logged in — redirect to login
          window.location.href = '/login?redirect=pricing'
          return
        }
        if (authData.user.plan === 'pro') {
          alert('既にProプランをご利用中です。')
          return
        }
      } catch {
        window.location.href = '/login?redirect=pricing'
        return
      }

      subscribeBtn.disabled = true
      subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>決済画面へ移動中…'

      try {
        const res = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interval }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error(data.error || '決済セッションの作成に失敗しました')
        }
      } catch (err) {
        alert(err.message || 'エラーが発生しました')
        subscribeBtn.disabled = false
        subscribeBtn.innerHTML = '<i class="fas fa-crown mr-2"></i>Pro プランに申し込む'
      }
    })
  }

  // Check if user is already pro
  checkProStatus()

  async function checkProStatus() {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user && data.user.plan === 'pro') {
        if (subscribeBtn) {
          subscribeBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Proプラン利用中'
          subscribeBtn.disabled = true
          subscribeBtn.classList.remove('bg-brand-600', 'hover:bg-brand-700', 'shadow-lg')
          subscribeBtn.classList.add('bg-green-500', 'cursor-default')
        }
      }
    } catch {}
  }

  // Handle cancel_url redirect
  const params = new URLSearchParams(window.location.search)
  if (params.get('upgrade') === 'cancel') {
    // Could show a toast message
  }
}

/* =============================================
   DASHBOARD — Plan Status Section
============================================= */
async function renderPlanStatus(user) {
  const planContainer = document.getElementById('dashboard-plan')
  if (!planContainer) return

  const isPro = user.plan === 'pro'

  if (isPro) {
    const intervalText = user.plan_interval === 'year' ? '年額プラン' : '月額プラン'
    const expiresText = user.plan_expires_at ? formatDate(user.plan_expires_at) : '-'
    planContainer.innerHTML = `
      <div class="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <i class="fas fa-crown text-amber-300"></i>
              <span class="text-lg font-bold">Pro プラン</span>
              <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full">${intervalText}</span>
            </div>
            <p class="text-sm text-blue-100">
              次回更新日: ${expiresText}
              <span class="mx-2">•</span>
              店舗数・QR無制限
            </p>
          </div>
          <button type="button" id="btn-manage-subscription" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
            <i class="fas fa-cog mr-1.5"></i>プラン管理
          </button>
        </div>
      </div>
    `
    // Manage subscription button
    const manageBtn = document.getElementById('btn-manage-subscription')
    if (manageBtn) {
      manageBtn.addEventListener('click', async () => {
        manageBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i>読み込み中…'
        manageBtn.disabled = true
        try {
          const res = await fetch('/api/stripe/create-portal', { method: 'POST' })
          const data = await res.json()
          if (data.url) {
            window.location.href = data.url
          } else {
            throw new Error(data.error)
          }
        } catch (err) {
          alert(err.message || 'エラーが発生しました')
          manageBtn.innerHTML = '<i class="fas fa-cog mr-1.5"></i>プラン管理'
          manageBtn.disabled = false
        }
      })
    }
  } else {
    planContainer.innerHTML = `
      <div class="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg font-bold text-gray-900">Free プラン</span>
              <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">現在のプラン</span>
            </div>
            <p class="text-sm text-gray-500">店舗2件・各QR2枚まで</p>
          </div>
          <a href="/pricing" class="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-sm no-underline">
            <i class="fas fa-crown text-amber-300"></i>
            Pro にアップグレード
          </a>
        </div>
      </div>
    `
  }

  planContainer.classList.remove('hidden')
}

/* =============================================
   UTILITIES
============================================= */
function isValidUrl(str) {
  try { new URL(str); return true } catch { return false }
}

function shakeElement(el) {
  el.classList.add('border-red-400', 'ring-2', 'ring-red-200', 'animate-shake')
  setTimeout(() => {
    el.classList.remove('border-red-400', 'ring-2', 'ring-red-200', 'animate-shake')
  }, 600)
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

/**
 * Convert a UTC date string from DB to JST Date object
 */
function toJST(dateStr) {
  if (!dateStr) return null
  try {
    const utc = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z'
    return new Date(new Date(utc).getTime() + 9 * 60 * 60 * 1000)
  } catch { return null }
}

function formatDate(dateStr) {
  const d = toJST(dateStr)
  if (!d) return '-'
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function formatDateTime(dateStr) {
  const d = toJST(dateStr)
  if (!d) return '-'
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

// Alias — all date functions now use JST
function formatDateTimeJST(dateStr) {
  return formatDateTime(dateStr)
}
