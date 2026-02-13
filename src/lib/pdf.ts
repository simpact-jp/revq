import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { generateQRSvg } from './qr'

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
const NOTO_SANS_JP_URL = 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf'
// Lighter alternative
const NOTO_SANS_JP_URL_ALT = 'https://fonts.gstatic.com/s/notosansjp/v53/Kk3Fid6YPZ9YDA1hASNBIebIMNxwb4-DWQ.ttf'

export async function generateCardPDF(opts: {
  storeName?: string | null
  shortCode: string
  shortUrl: string
  template: string
  imageData?: string | null
}): Promise<Uint8Array> {
  const { storeName, shortCode, shortUrl, template, imageData } = opts
  const color = TEMPLATE_COLORS[template] || TEMPLATE_COLORS.simple

  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  // Try to load Japanese font if store name has non-ASCII chars
  let jpFont = fontBold
  const needsJpFont = storeName && !isWinAnsiSafe(storeName)
  if (needsJpFont) {
    try {
      const fontRes = await fetch(NOTO_SANS_JP_URL_ALT)
      if (fontRes.ok) {
        const fontData = await fontRes.arrayBuffer()
        jpFont = await doc.embedFont(fontData)
      }
    } catch (e) {
      console.error('Failed to load Japanese font:', e)
      // jpFont stays as fontBold — will skip Japanese chars in store name
    }
  }

  // A6 landscape-ish card size (148mm x 105mm = ~420 x 298 pt)
  const W = 420
  const H = 298
  const page = doc.addPage([W, H])

  // ---- Top accent bar ----
  page.drawRectangle({ x: 0, y: H - 8, width: W, height: 8, color: rgb(color.r, color.g, color.b) })

  // ---- Store name (if provided) ----
  let currentY = H - 50
  if (storeName) {
    try {
      const nameSize = storeName.length > 15 ? 16 : 20
      const useFont = needsJpFont ? jpFont : fontBold
      const nameWidth = useFont.widthOfTextAtSize(storeName, nameSize)
      page.drawText(storeName, {
        x: (W - nameWidth) / 2,
        y: currentY,
        size: nameSize,
        font: useFont,
        color: rgb(0.15, 0.15, 0.15),
      })
      currentY -= 30
    } catch (e) {
      console.error('Failed to draw store name:', e)
      currentY -= 10
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
      
      const maxImgSize = 80
      const imgDims = embeddedImage.scale(Math.min(maxImgSize / embeddedImage.width, maxImgSize / embeddedImage.height))
      page.drawImage(embeddedImage, {
        x: (W - imgDims.width) / 2,
        y: currentY - imgDims.height,
        width: imgDims.width,
        height: imgDims.height,
      })
      currentY -= imgDims.height + 10
    } catch (e) {
      console.error('Failed to embed image in PDF:', e)
    }
  }

  // ---- CTA text (ASCII safe) ----
  const ctaText = 'Please leave us a Google Review!'
  const ctaSize = 11
  const ctaWidth = font.widthOfTextAtSize(ctaText, ctaSize)
  page.drawText(ctaText, {
    x: (W - ctaWidth) / 2,
    y: currentY,
    size: ctaSize,
    font,
    color: rgb(0.35, 0.35, 0.35),
  })
  currentY -= 20

  // ---- QR Code (drawn using PDF rectangles) ----
  const qrSvg = generateQRSvg(shortUrl, 1, 0)
  const qrModuleSize = 3.5
  const rectMatches = qrSvg.matchAll(/x="(\d+)" y="(\d+)" width="1" height="1"/g)
  const qrRects: [number, number][] = []
  let maxCoord = 0
  for (const m of rectMatches) {
    const x = parseInt(m[1]), y = parseInt(m[2])
    qrRects.push([x, y])
    if (x > maxCoord) maxCoord = x
    if (y > maxCoord) maxCoord = y
  }
  const qrTotalSize = (maxCoord + 1) * qrModuleSize
  const qrX = (W - qrTotalSize) / 2
  const qrY = currentY - qrTotalSize - 10

  // White background for QR
  page.drawRectangle({
    x: qrX - 8, y: qrY - 8,
    width: qrTotalSize + 16, height: qrTotalSize + 16,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 0.5,
  })

  // Draw QR modules
  for (const [cx, cy] of qrRects) {
    page.drawRectangle({
      x: qrX + cx * qrModuleSize,
      y: qrY + qrTotalSize - (cy + 1) * qrModuleSize,
      width: qrModuleSize,
      height: qrModuleSize,
      color: rgb(0.1, 0.1, 0.1),
    })
  }

  // ---- Short URL text ----
  const urlSize = 10
  const urlWidth = font.widthOfTextAtSize(shortUrl, urlSize)
  page.drawText(shortUrl, {
    x: (W - urlWidth) / 2,
    y: qrY - 20,
    size: urlSize,
    font,
    color: rgb(0.4, 0.4, 0.4),
  })

  // ---- Footer branding ----
  const brandText = 'Powered by RevuQ'
  const brandSize = 7
  const brandWidth = font.widthOfTextAtSize(brandText, brandSize)
  page.drawRectangle({ x: 0, y: 0, width: W, height: 20, color: rgb(0.97, 0.97, 0.97) })
  page.drawText(brandText, {
    x: (W - brandWidth) / 2,
    y: 6,
    size: brandSize,
    font,
    color: rgb(0.6, 0.6, 0.6),
  })

  return await doc.save()
}
