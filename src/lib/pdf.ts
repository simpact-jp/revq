import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { generateQRMatrix } from './qr'
import type { GeneratePDFRequest, PDFLayout } from './types'

// Template color definitions
const TEMPLATE_COLORS: Record<string, { r: number; g: number; b: number }> = {
  simple:    { r: 0.22, g: 0.25, b: 0.32 },
  natural:   { r: 0.02, g: 0.59, b: 0.40 },
  luxury:    { r: 0.57, g: 0.25, b: 0.05 },
  pop:       { r: 0.88, g: 0.11, b: 0.29 },
  cafe:      { r: 0.70, g: 0.33, b: 0.04 },
  japanese:  { r: 0.60, g: 0.11, b: 0.11 },
  clean:     { r: 0.01, g: 0.41, b: 0.63 },
  minimal:   { r: 0.20, g: 0.25, b: 0.33 },
  vivid:     { r: 0.49, g: 0.23, b: 0.93 },
  photo:     { r: 0.05, g: 0.58, b: 0.53 },
}

/**
 * Check if a string contains only ASCII-safe characters for WinAnsi encoding
 */
function isWinAnsiSafe(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) return false
  }
  return true
}

// Google Fonts CDN URL for Noto Sans JP
const NOTO_SANS_JP_URL_ALT = 'https://fonts.gstatic.com/s/notosansjp/v53/Kk3Fid6YPZ9YDA1hASNBIebIMNxwb4-DWQ.ttf'

/**
 * Load Japanese font (cached per invocation)
 */
async function loadJapaneseFont(doc: PDFDocument): Promise<any> {
  try {
    const fontRes = await fetch(NOTO_SANS_JP_URL_ALT)
    if (fontRes.ok) {
      const fontData = await fontRes.arrayBuffer()
      return await doc.embedFont(fontData)
    }
  } catch (e) {
    console.error('Failed to load Japanese font:', e)
  }
  return null
}

/**
 * Draw a single card on a PDF page at specified position and scale
 */
async function drawCard(
  doc: PDFDocument,
  page: any,
  opts: {
    x: number
    y: number
    w: number
    h: number
    storeName?: string | null
    shortCode: string
    shortUrl: string
    template: string
    imageData?: string | null
    ctaText?: string | null
    font: any
    fontBold: any
    jpFont: any
  }
) {
  const { x, y, w, h, storeName, shortUrl, template, imageData, ctaText, font, fontBold, jpFont } = opts
  const color = TEMPLATE_COLORS[template] || TEMPLATE_COLORS.simple
  const needsJpFont = (storeName && !isWinAnsiSafe(storeName)) || (ctaText && !isWinAnsiSafe(ctaText))

  // Scale ratios based on standard card size 420x298
  const sx = w / 420
  const sy = h / 298

  // ---- Card border ----
  page.drawRectangle({
    x, y, width: w, height: h,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 0.5,
  })

  // ---- Top accent bar ----
  const barH = Math.max(4, 8 * sy)
  page.drawRectangle({ x, y: y + h - barH, width: w, height: barH, color: rgb(color.r, color.g, color.b) })

  // ---- Content area ----
  let currentY = y + h - barH - 30 * sy

  // ---- Store name (if provided) ----
  if (storeName) {
    try {
      const nameSize = Math.max(8, (storeName.length > 15 ? 16 : 20) * Math.min(sx, sy))
      const nameFont = needsJpFont && jpFont ? jpFont : fontBold
      const nameWidth = nameFont.widthOfTextAtSize(storeName, nameSize)
      page.drawText(storeName, {
        x: x + (w - nameWidth) / 2,
        y: currentY,
        size: nameSize,
        font: nameFont,
        color: rgb(0.15, 0.15, 0.15),
      })
      currentY -= 25 * sy
    } catch (e) {
      console.error('Failed to draw store name:', e)
      currentY -= 8 * sy
    }
  }

  // ---- Embed uploaded image if present ----
  if (imageData) {
    try {
      let embeddedImage
      if (imageData.includes('image/png')) {
        const base64 = imageData.split(',')[1]
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
        embeddedImage = await doc.embedPng(bytes)
      } else {
        const base64 = imageData.split(',')[1]
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
        embeddedImage = await doc.embedJpg(bytes)
      }
      
      const maxImgSize = 80 * Math.min(sx, sy)
      const imgDims = embeddedImage.scale(Math.min(maxImgSize / embeddedImage.width, maxImgSize / embeddedImage.height))
      page.drawImage(embeddedImage, {
        x: x + (w - imgDims.width) / 2,
        y: currentY - imgDims.height,
        width: imgDims.width,
        height: imgDims.height,
      })
      currentY -= imgDims.height + 8 * sy
    } catch (e) {
      console.error('Failed to embed image in PDF:', e)
    }
  }

  // ---- CTA text ----
  const defaultCtaAscii = 'Please leave us a Google Review!'
  const defaultCtaJa = 'Googleレビューにご協力ください'
  const displayCta = ctaText || (jpFont ? defaultCtaJa : defaultCtaAscii)
  const ctaNeedsJp = !isWinAnsiSafe(displayCta)
  const ctaFont = (ctaNeedsJp && jpFont) ? jpFont : font
  const ctaSize = Math.max(6, 11 * Math.min(sx, sy))
  
  try {
    const ctaWidth = ctaFont.widthOfTextAtSize(displayCta, ctaSize)
    page.drawText(displayCta, {
      x: x + (w - ctaWidth) / 2,
      y: currentY,
      size: ctaSize,
      font: ctaFont,
      color: rgb(0.35, 0.35, 0.35),
    })
  } catch (e) {
    // fallback to ASCII
    const fallback = 'Please leave us a Google Review!'
    const fbWidth = font.widthOfTextAtSize(fallback, ctaSize)
    page.drawText(fallback, {
      x: x + (w - fbWidth) / 2,
      y: currentY,
      size: ctaSize,
      font,
      color: rgb(0.35, 0.35, 0.35),
    })
  }
  currentY -= 18 * sy

  // ---- QR Code (drawn using matrix data directly) ----
  const { modules, size: moduleCount } = generateQRMatrix(shortUrl)
  
  const qrTargetSize = 120 * Math.min(sx, sy)
  const quietZone = 4
  const totalModules = moduleCount + quietZone * 2
  const moduleSize = qrTargetSize / totalModules
  const qrTotalSize = totalModules * moduleSize
  
  const qrX = x + (w - qrTotalSize) / 2
  const qrY = currentY - qrTotalSize - 8 * sy

  // White background with border for QR
  page.drawRectangle({
    x: qrX - 3, y: qrY - 3,
    width: qrTotalSize + 6, height: qrTotalSize + 6,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 0.5,
  })

  // Draw QR modules from matrix
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row][col]) {
        page.drawRectangle({
          x: qrX + (col + quietZone) * moduleSize,
          y: qrY + (moduleCount - 1 - row + quietZone) * moduleSize,
          width: moduleSize,
          height: moduleSize,
          color: rgb(0, 0, 0),
        })
      }
    }
  }

  // ---- Short URL text ----
  const urlSize = Math.max(5, 10 * Math.min(sx, sy))
  const urlWidth = font.widthOfTextAtSize(shortUrl, urlSize)
  page.drawText(shortUrl, {
    x: x + (w - urlWidth) / 2,
    y: qrY - 16 * sy,
    size: urlSize,
    font,
    color: rgb(0.4, 0.4, 0.4),
  })

  // ---- Footer branding ----
  const brandText = 'Powered by RevuQ'
  const brandSize = Math.max(4, 7 * Math.min(sx, sy))
  const brandWidth = font.widthOfTextAtSize(brandText, brandSize)
  const footerH = Math.max(10, 20 * sy)
  page.drawRectangle({ x, y, width: w, height: footerH, color: rgb(0.97, 0.97, 0.97) })
  page.drawText(brandText, {
    x: x + (w - brandWidth) / 2,
    y: y + footerH * 0.25,
    size: brandSize,
    font,
    color: rgb(0.6, 0.6, 0.6),
  })
}

/**
 * Generate card PDF — routes to correct layout generator
 */
export async function generateCardPDF(opts: GeneratePDFRequest): Promise<Uint8Array> {
  const layout: PDFLayout = opts.layout || 'card'
  const copies = opts.copies || 1

  if (layout === 'a4-single') {
    return generateA4SinglePDF(opts)
  } else if (layout === 'a4-multi') {
    return generateA4MultiPDF(opts)
  }

  // Default: original A6 card
  return generateOriginalCardPDF(opts)
}

/**
 * Generate original A6 landscape card (single card)
 */
async function generateOriginalCardPDF(opts: GeneratePDFRequest): Promise<Uint8Array> {
  const { storeName, shortCode, shortUrl, template, imageData, ctaText } = opts

  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const needsJp = (storeName && !isWinAnsiSafe(storeName)) || (ctaText && !isWinAnsiSafe(ctaText))
  let jpFont = fontBold
  if (needsJp) {
    const loaded = await loadJapaneseFont(doc)
    if (loaded) jpFont = loaded
  }

  const W = 420
  const H = 298
  const page = doc.addPage([W, H])

  await drawCard(doc, page, {
    x: 0, y: 0, w: W, h: H,
    storeName, shortCode, shortUrl, template, imageData, ctaText,
    font, fontBold, jpFont,
  })

  return await doc.save()
}

/**
 * Generate A4 PDF with a single large card centered (fills most of the page)
 */
async function generateA4SinglePDF(opts: GeneratePDFRequest): Promise<Uint8Array> {
  const { storeName, shortCode, shortUrl, template, imageData, ctaText } = opts

  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const needsJp = (storeName && !isWinAnsiSafe(storeName)) || (ctaText && !isWinAnsiSafe(ctaText))
  let jpFont = fontBold
  if (needsJp) {
    const loaded = await loadJapaneseFont(doc)
    if (loaded) jpFont = loaded
  }

  // A4 portrait: 595.28 x 841.89 pt
  const A4W = 595.28
  const A4H = 841.89
  const page = doc.addPage([A4W, A4H])

  // Card fills most of A4 with margins, maintaining aspect ratio (420:298 = ~1.41:1)
  const margin = 40
  const maxW = A4W - margin * 2
  const maxH = A4H - margin * 2 - 30 // 30pt for header
  const cardAspect = 420 / 298

  let cardW: number, cardH: number
  if (maxW / maxH > cardAspect) {
    // Height-limited
    cardH = maxH
    cardW = cardH * cardAspect
  } else {
    // Width-limited
    cardW = maxW
    cardH = cardW / cardAspect
  }

  const cardX = (A4W - cardW) / 2
  const cardY = (A4H - cardH) / 2 - 10

  // Cut lines (dashed marks at corners)
  const markLen = 15
  const markColor = rgb(0.7, 0.7, 0.7)
  const markW = 0.4
  const corners = [
    { cx: cardX, cy: cardY },
    { cx: cardX + cardW, cy: cardY },
    { cx: cardX, cy: cardY + cardH },
    { cx: cardX + cardW, cy: cardY + cardH },
  ]
  for (const { cx, cy } of corners) {
    // horizontal mark as thin rectangle
    page.drawRectangle({ x: cx - markLen, y: cy - markW / 2, width: markLen * 2, height: markW, color: markColor })
    // vertical mark as thin rectangle
    page.drawRectangle({ x: cx - markW / 2, y: cy - markLen, width: markW, height: markLen * 2, color: markColor })
  }

  await drawCard(doc, page, {
    x: cardX, y: cardY, w: cardW, h: cardH,
    storeName, shortCode, shortUrl, template, imageData, ctaText,
    font, fontBold, jpFont,
  })

  // Print info header
  const infoSize = 7
  const infoText = 'RevuQ - A4 Print Layout (Cut along marks)'
  page.drawText(infoText, {
    x: 30, y: A4H - 25,
    size: infoSize, font, color: rgb(0.7, 0.7, 0.7),
  })

  return await doc.save()
}

/**
 * Generate A4 PDF with multiple cards for efficient printing
 * Supports 2, 4, 8 copies per page
 */
async function generateA4MultiPDF(opts: GeneratePDFRequest): Promise<Uint8Array> {
  const { storeName, shortCode, shortUrl, template, imageData, ctaText } = opts
  const copies = opts.copies || 4

  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const needsJp = (storeName && !isWinAnsiSafe(storeName)) || (ctaText && !isWinAnsiSafe(ctaText))
  let jpFont = fontBold
  if (needsJp) {
    const loaded = await loadJapaneseFont(doc)
    if (loaded) jpFont = loaded
  }

  // A4 portrait: 595.28 x 841.89 pt
  const A4W = 595.28
  const A4H = 841.89
  const margin = 25
  const gap = 8
  const headerSpace = 25

  // Layout configurations: exactly 2, 4, or 8
  let cols: number, rows: number
  if (copies <= 2) {
    cols = 1; rows = 2
  } else if (copies <= 4) {
    cols = 2; rows = 2
  } else {
    cols = 2; rows = 4
  }

  const usableW = A4W - margin * 2 - gap * (cols - 1)
  const usableH = A4H - margin * 2 - gap * (rows - 1) - headerSpace
  const cardAspect = 420 / 298 // width:height

  let cardW = usableW / cols
  let cardH = cardW / cardAspect
  
  // If cards are too tall, shrink to fit
  if (cardH * rows + gap * (rows - 1) > usableH) {
    cardH = (usableH - gap * (rows - 1)) / rows
    cardW = cardH * cardAspect
  }

  const actualGridW = cardW * cols + gap * (cols - 1)
  const actualGridH = cardH * rows + gap * (rows - 1)
  const startX = (A4W - actualGridW) / 2
  const startY = (A4H - actualGridH - headerSpace) / 2

  const page = doc.addPage([A4W, A4H])

  // Layout label
  const layoutLabel = copies <= 2 ? '2-split' : copies <= 4 ? '4-split' : '8-split'

  // Print info header (ASCII only - no Japanese for WinAnsi compatibility)
  const infoSize = 7
  const infoText = `RevuQ - A4 Print Layout (${layoutLabel}, ${copies} cards) - Cut along the marks`
  page.drawText(infoText, {
    x: margin, y: A4H - 20,
    size: infoSize, font, color: rgb(0.7, 0.7, 0.7),
  })

  let cardIdx = 0
  for (let r = 0; r < rows && cardIdx < copies; r++) {
    for (let c = 0; c < cols && cardIdx < copies; c++) {
      const cx = startX + c * (cardW + gap)
      const cy = startY + (rows - 1 - r) * (cardH + gap)

      // Cut lines at each card corner
      const markLen = 10
      const markColor2 = rgb(0.75, 0.75, 0.75)
      const markW2 = 0.3
      const cardCorners = [
        { px: cx, py: cy },
        { px: cx + cardW, py: cy },
        { px: cx, py: cy + cardH },
        { px: cx + cardW, py: cy + cardH },
      ]
      for (const { px, py } of cardCorners) {
        page.drawRectangle({ x: px - markLen, y: py - markW2 / 2, width: markLen * 2, height: markW2, color: markColor2 })
        page.drawRectangle({ x: px - markW2 / 2, y: py - markLen, width: markW2, height: markLen * 2, color: markColor2 })
      }

      await drawCard(doc, page, {
        x: cx, y: cy, w: cardW, h: cardH,
        storeName, shortCode, shortUrl, template, imageData, ctaText,
        font, fontBold, jpFont,
      })

      cardIdx++
    }
  }

  return await doc.save()
}
