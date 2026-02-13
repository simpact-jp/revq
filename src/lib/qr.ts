/**
 * QR Code generator using 'uqr' — a lightweight, spec-compliant library.
 * Works in any runtime (Cloudflare Workers, Node.js, Browser).
 * Error correction level H (highest) for maximum scan reliability.
 */
import { encode as encodeQR, renderSVG } from 'uqr'

/**
 * Generate QR code as SVG string.
 * Uses error correction level H (30% redundancy) for best scanning reliability.
 * Includes 4-module quiet zone per QR spec.
 */
export function generateQRSvg(data: string): string {
  return renderSVG(data, {
    ecc: 'H',
    border: 4,
  })
}

/**
 * Generate QR code matrix data for PDF embedding.
 * Returns the module matrix and size (without border) for drawing rectangles in PDF.
 */
export function generateQRMatrix(data: string): {
  modules: boolean[][]
  size: number
} {
  // border: 0 to get just the QR modules without surrounding whitespace
  const result = encodeQR(data, { ecc: 'H', border: 0 })
  const size = result.size

  // result.data is a 2D boolean[][] array (rows of columns)
  const modules: boolean[][] = []
  for (let row = 0; row < size; row++) {
    const rowData: boolean[] = []
    for (let col = 0; col < size; col++) {
      rowData.push(!!(result.data as any)[row]?.[col])
    }
    modules.push(rowData)
  }

  return { modules, size }
}
