/**
 * RevuQ — Frontend JavaScript
 * Connects to real backend APIs for authentication, card creation,
 * QR generation, PDF download, and admin management.
 */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname

  if (path === '/' || path === '') initHomePage()
  if (path === '/done') initDonePage()
  if (path === '/login') initLoginPage()
  if (path === '/dashboard') initDashboardPage()
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

  // --- Live Preview ---
  function updatePreview() {
    const storeName = storeNameInput ? storeNameInput.value.trim() : ''
    const previewStoreName = document.getElementById('preview-store-name')
    const previewStoreNameSection = document.getElementById('preview-store-name-section')
    const previewImgSection = document.getElementById('preview-img-section')
    const previewCardImage = document.getElementById('preview-card-image')
    const previewAccentBar = document.getElementById('preview-accent-bar')
    const previewWrapper = document.getElementById('preview-template-wrapper')

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
        const payload = {
          google_url: googleUrlInput.value.trim(),
          store_name: storeNameInput ? storeNameInput.value.trim() : undefined,
          template: selectedTemplateId,
          image_data: uploadedImageData || undefined,
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

        // Redirect to done page with card info in URL
        const params = new URLSearchParams({
          id: data.card.id,
          code: data.card.short_code,
          url: data.card.short_url,
          name: data.card.store_name || '',
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
   DONE PAGE — Completion with real data
============================================= */
function initDonePage() {
  const params = new URLSearchParams(window.location.search)
  const cardId = params.get('id')
  const shortCode = params.get('code')
  const shortUrl = params.get('url')
  const storeName = params.get('name')

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

  // PDF Download — real download
  const downloadBtn = document.getElementById('btn-download-pdf')
  if (downloadBtn && cardId) {
    downloadBtn.addEventListener('click', async () => {
      downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中…'
      downloadBtn.disabled = true
      try {
        const res = await fetch(`/api/cards/${cardId}/pdf`)
        if (!res.ok) throw new Error('PDF生成に失敗しました')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = storeName ? `RevuQ_${storeName.replace(/\s+/g, '_')}.pdf` : `RevuQ_${shortCode}.pdf`
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
   LOGIN PAGE — Real OTP flow
============================================= */
function initLoginPage() {
  const stepEmail = document.getElementById('login-step-email')
  const stepCode = document.getElementById('login-step-code')
  const btnSendCode = document.getElementById('btn-send-code')
  const btnLogin = document.getElementById('btn-login')
  const btnBackEmail = document.getElementById('btn-back-email')
  const emailInput = document.getElementById('login-email')
  const codeInput = document.getElementById('login-code')
  const sentEmailDisplay = document.getElementById('sent-email-display')
  const debugCodeEl = document.getElementById('debug-code-display')

  let savedEmail = ''

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
        const res = await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'コード送信に失敗しました')

        savedEmail = email
        sentEmailDisplay.textContent = email
        stepEmail.classList.add('hidden')
        stepCode.classList.remove('hidden')
        codeInput.focus()

        // Show debug code in prototype
        if (data._debug_code && debugCodeEl) {
          debugCodeEl.textContent = data._debug_code
          debugCodeEl.parentElement.classList.remove('hidden')
        }
      } catch (err) {
        alert(err.message)
      } finally {
        btnSendCode.innerHTML = 'ワンタイムコードを送信 <i class="fas fa-paper-plane text-sm"></i>'
        btnSendCode.disabled = false
      }
    })
  }

  if (btnBackEmail) {
    btnBackEmail.addEventListener('click', () => {
      stepCode.classList.add('hidden')
      stepEmail.classList.remove('hidden')
      emailInput.focus()
    })
  }

  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      const code = codeInput.value.trim()
      if (!code) {
        shakeElement(codeInput)
        codeInput.focus()
        return
      }

      btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> ログイン中…'
      btnLogin.disabled = true

      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: savedEmail, code }),
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'ログインに失敗しました')

        window.location.href = '/dashboard'
      } catch (err) {
        alert(err.message)
        btnLogin.innerHTML = 'ログイン <i class="fas fa-arrow-right text-sm"></i>'
        btnLogin.disabled = false
      }
    })
  }
}

/* =============================================
   DASHBOARD PAGE — Real data
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

    // Update stats
    if (statsContainer) {
      const totalCards = cards.length
      const totalClicks = cards.reduce((sum, c) => sum + (c.click_count || 0), 0)
      statsContainer.innerHTML = `
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">総カード数</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">${totalCards}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">総クリック数</p>
          <p class="text-2xl sm:text-3xl font-bold text-brand-600">${totalClicks}</p>
        </div>
      `
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
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">${escapeHtml(card.template)}</span>
                  <span class="text-xs text-gray-400">${formatDate(card.created_at)}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-brand-600">${card.click_count || 0}</p>
                <p class="text-[10px] text-gray-400 uppercase tracking-wider">クリック</p>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-4">
              <i class="fas fa-link text-gray-400 text-sm"></i>
              <code class="text-sm font-mono text-brand-600 flex-1 truncate">${escapeHtml(card.short_url)}</code>
              <button type="button" class="copy-url-btn p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-all" data-url="${escapeHtml(card.short_url)}" title="URLをコピー">
                <i class="fas fa-copy"></i>
              </button>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-2 qr-mini" data-card-id="${card.id}">
                <div class="w-14 h-14 flex items-center justify-center text-gray-300">
                  <i class="fas fa-qrcode text-2xl"></i>
                </div>
              </div>
              <div class="flex gap-2 flex-1">
                <button type="button" class="btn-download-card-pdf flex-1 text-xs font-semibold text-brand-600 border border-brand-200 hover:bg-brand-50 px-3 py-2 rounded-lg transition-all" data-card-id="${card.id}" data-name="${escapeHtml(card.store_name || card.short_code)}">
                  <i class="fas fa-download mr-1"></i>PDF
                </button>
                <a href="/api/cards/${card.id}/qr" target="_blank" class="flex-1 text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all text-center no-underline">
                  <i class="fas fa-qrcode mr-1"></i>QR画像
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
  // Copy URLs
  container.querySelectorAll('.copy-url-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      copyToClipboard(btn.dataset.url)
      const icon = btn.querySelector('i')
      icon.className = 'fas fa-check text-green-500'
      setTimeout(() => { icon.className = 'fas fa-copy' }, 1500)
    })
  })

  // PDF download
  container.querySelectorAll('.btn-download-card-pdf').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cardId = btn.dataset.cardId
      const name = btn.dataset.name
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
      btn.disabled = true
      try {
        const res = await fetch(`/api/cards/${cardId}/pdf`)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `RevuQ_${name.replace(/\s+/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch { }
      btn.innerHTML = '<i class="fas fa-download mr-1"></i>PDF'
      btn.disabled = false
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

  // --- Load real data ---
  loadAdminStats()
  loadAdminRecentActivity()
  loadAdminUsers()
  loadAdminCards()
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
      usersEl.innerHTML = data.recentUsers.map(u => `
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
      cardsEl.innerHTML = data.recentCards.map(c => `
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
          <td class="px-5 py-3.5"><p class="font-semibold text-gray-800">${escapeHtml(c.store_name || '(店名なし)')}</p></td>
          <td class="px-5 py-3.5"><code class="text-xs font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">${escapeHtml(c.short_url)}</code></td>
          <td class="px-5 py-3.5 text-gray-600">${escapeHtml(c.user_name || '未登録')}</td>
          <td class="px-5 py-3.5"><span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">${escapeHtml(c.template)}</span></td>
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

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  } catch { return dateStr }
}
