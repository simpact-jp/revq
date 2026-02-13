/**
 * RevuQ — Frontend JavaScript
 * Handles: Step navigation, template selection, live preview, form validation,
 *          image upload, login flow, URL copy, PDF download simulation,
 *          admin dashboard tabs & toggles
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
   NAV STATE
============================================= */
function updateNav() {
  const isLoggedIn = localStorage.getItem('demo_logged_in') === 'true'
  const navLogin = document.getElementById('nav-login')
  const navDashboard = document.getElementById('nav-dashboard')
  if (navLogin && navDashboard) {
    if (isLoggedIn) {
      navLogin.classList.add('hidden')
      navDashboard.classList.remove('hidden')
    } else {
      navLogin.classList.remove('hidden')
      navDashboard.classList.add('hidden')
    }
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
  let uploadedImageData = null

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

      // Scroll to the create section top
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

  // --- Generate PDF (simulated) ---
  if (btnGenerate) {
    btnGenerate.addEventListener('click', () => {
      updateStepIndicator(3)
      const overlay = document.getElementById('generating-overlay')
      overlay.classList.remove('hidden')
      setTimeout(() => {
        window.location.href = '/done'
      }, 1800)
    })
  }
}

/* =============================================
   DONE PAGE — Completion
============================================= */
function initDonePage() {
  const copyBtn = document.getElementById('copy-url-btn')
  const feedback = document.getElementById('copy-feedback')
  const shortUrl = document.getElementById('short-url')

  if (copyBtn && shortUrl) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(shortUrl.textContent.trim())
      feedback.classList.remove('opacity-0')
      feedback.classList.add('opacity-100')
      setTimeout(() => {
        feedback.classList.remove('opacity-100')
        feedback.classList.add('opacity-0')
      }, 2000)
    })
  }

  const downloadBtn = document.getElementById('btn-download-pdf')
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 準備中…'
      setTimeout(() => {
        downloadBtn.innerHTML = '<i class="fas fa-check"></i> ダウンロード完了（デモ）'
        downloadBtn.classList.remove('bg-brand-600', 'hover:bg-brand-700')
        downloadBtn.classList.add('bg-green-500')
        setTimeout(() => {
          downloadBtn.innerHTML = '<i class="fas fa-download"></i> PDFをダウンロード'
          downloadBtn.classList.remove('bg-green-500')
          downloadBtn.classList.add('bg-brand-600', 'hover:bg-brand-700')
        }, 2000)
      }, 1000)
    })
  }
}

/* =============================================
   LOGIN PAGE
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

  if (btnSendCode) {
    btnSendCode.addEventListener('click', () => {
      const email = emailInput.value.trim()
      if (!email || !email.includes('@')) {
        shakeElement(emailInput)
        emailInput.focus()
        return
      }
      btnSendCode.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> 送信中…'
      btnSendCode.disabled = true
      setTimeout(() => {
        sentEmailDisplay.textContent = email
        stepEmail.classList.add('hidden')
        stepCode.classList.remove('hidden')
        codeInput.focus()
        btnSendCode.innerHTML = 'ワンタイムコードを送信 <i class="fas fa-paper-plane text-sm"></i>'
        btnSendCode.disabled = false
      }, 800)
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
    btnLogin.addEventListener('click', () => {
      const code = codeInput.value.trim()
      if (!code) {
        shakeElement(codeInput)
        codeInput.focus()
        return
      }
      btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> ログイン中…'
      btnLogin.disabled = true
      setTimeout(() => {
        localStorage.setItem('demo_logged_in', 'true')
        window.location.href = '/dashboard'
      }, 800)
    })
  }
}

/* =============================================
   DASHBOARD PAGE (User)
============================================= */
function initDashboardPage() {
  const copyBtns = document.querySelectorAll('.copy-url-btn')
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url
      copyToClipboard(url)
      const icon = btn.querySelector('i')
      icon.className = 'fas fa-check text-green-500'
      setTimeout(() => {
        icon.className = 'fas fa-copy'
      }, 1500)
    })
  })
}

/* =============================================
   ADMIN PAGE (Operator)
============================================= */
function initAdminPage() {
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
      if (tc.id === `tab-${tabName}`) {
        tc.classList.remove('hidden')
      } else {
        tc.classList.add('hidden')
      }
    })
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab)
    })
  })

  // --- Tab links (in overview "すべて見る" buttons) ---
  const tabLinks = document.querySelectorAll('.admin-tab-link')
  tabLinks.forEach((link) => {
    link.addEventListener('click', () => {
      switchTab(link.dataset.target)
    })
  })

  // --- Toggle Switches ---
  const toggles = document.querySelectorAll('.admin-toggle')
  toggles.forEach((toggle) => {
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

  // --- Save Settings (demo) ---
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
}

/* =============================================
   UTILITIES
============================================= */
function isValidUrl(str) {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

function shakeElement(el) {
  el.classList.add('border-red-400', 'ring-2', 'ring-red-200')
  el.classList.add('animate-shake')
  setTimeout(() => {
    el.classList.remove('border-red-400', 'ring-2', 'ring-red-200')
    el.classList.remove('animate-shake')
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
