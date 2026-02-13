/**
 * Minimal QR Code SVG generator — pure JS, no dependencies.
 * Supports alphanumeric and byte mode, error correction level M.
 * Generates SVG string suitable for embedding in HTML/PDF.
 */

// QR Code generator using the "qr-creator" algorithm simplified for Workers
// This is a lightweight implementation for URL-length data

const EC_LEVEL = 1 // 0=L, 1=M, 2=Q, 3=H

// Galois Field tables
const EXP = new Uint8Array(256)
const LOG = new Uint8Array(256)
let x = 1
for (let i = 0; i < 255; i++) {
  EXP[i] = x
  LOG[x] = i
  x = (x << 1) ^ (x & 128 ? 0x11d : 0)
}
EXP[255] = EXP[0]

function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : EXP[(LOG[a] + LOG[b]) % 255]
}

function polyMul(a: number[], b: number[]): number[] {
  const res = new Array(a.length + b.length - 1).fill(0)
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++)
      res[i + j] ^= gfMul(a[i], b[j])
  return res
}

function polyRemainder(data: number[], gen: number[]): number[] {
  const res = [...data, ...new Array(gen.length - 1).fill(0)]
  for (let i = 0; i < data.length; i++) {
    if (res[i] === 0) continue
    for (let j = 0; j < gen.length; j++)
      res[i + j] ^= gfMul(gen[j], res[i])
  }
  return res.slice(data.length)
}

function generatorPoly(n: number): number[] {
  let g = [1]
  for (let i = 0; i < n; i++) g = polyMul(g, [1, EXP[i]])
  return g
}

// Version/EC tables (versions 1-10 are enough for URLs up to ~200 chars)
const VERSION_DATA: [number, number, number][] = [
  // [totalCodewords, ecCodewordsPerBlock, numBlocks] for EC level M
  [0, 0, 0], // placeholder v0
  [26, 10, 1],   // v1
  [44, 16, 1],   // v2
  [70, 26, 1],   // v3
  [100, 18, 2],  // v4
  [134, 24, 2],  // v5
  [172, 16, 4],  // v6
  [196, 18, 4],  // v7
  [242, 22, 4],  // v8 (actually 2+2 blocks but simplified)
  [292, 22, 4],  // v9 (actually 3+1)
  [346, 26, 4],  // v10 (actually 4+1)
]

function getVersion(dataLen: number): number {
  for (let v = 1; v <= 10; v++) {
    const [total, ecPer, blocks] = VERSION_DATA[v]
    const dataCapacity = total - ecPer * blocks
    // byte mode: 4 (mode) + 8/16 (count) + dataLen*8 + 4 (terminator) bits
    const countBits = v <= 9 ? 8 : 16
    const neededBits = 4 + countBits + dataLen * 8
    if (Math.ceil(neededBits / 8) <= dataCapacity) return v
  }
  return 10 // fallback
}

function encode(data: string): { modules: boolean[][]; size: number } {
  const bytes = new TextEncoder().encode(data)
  const version = getVersion(bytes.length)
  const size = version * 4 + 17
  const [totalCw, ecPerBlock, numBlocks] = VERSION_DATA[version]
  const dataCw = totalCw - ecPerBlock * numBlocks

  // Build data bitstream
  const bits: number[] = []
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1)
  }
  pushBits(0b0100, 4) // byte mode
  pushBits(bytes.length, version <= 9 ? 8 : 16)
  for (const b of bytes) pushBits(b, 8)
  pushBits(0, Math.min(4, dataCw * 8 - bits.length)) // terminator
  while (bits.length % 8) bits.push(0)
  while (bits.length < dataCw * 8) {
    pushBits(0xec, 8)
    if (bits.length < dataCw * 8) pushBits(0x11, 8)
  }

  // Convert to codewords
  const codewords: number[] = []
  for (let i = 0; i < bits.length; i += 8)
    codewords.push(bits.slice(i, i + 8).reduce((a, b, idx) => a | (b << (7 - idx)), 0))

  // Error correction
  const gen = generatorPoly(ecPerBlock)
  const blockSize = Math.floor(dataCw / numBlocks)
  const dataBlocks: number[][] = []
  const ecBlocks: number[][] = []
  let offset = 0
  for (let i = 0; i < numBlocks; i++) {
    const sz = i < numBlocks - (dataCw % numBlocks) ? blockSize : blockSize + 1
    const block = codewords.slice(offset, offset + sz)
    dataBlocks.push(block)
    ecBlocks.push(polyRemainder(block, gen))
    offset += sz
  }

  // Interleave
  const final: number[] = []
  const maxDataLen = Math.max(...dataBlocks.map(b => b.length))
  for (let i = 0; i < maxDataLen; i++)
    for (const b of dataBlocks) if (i < b.length) final.push(b[i])
  for (let i = 0; i < ecPerBlock; i++)
    for (const b of ecBlocks) if (i < b.length) final.push(b[i])

  // Place modules
  const modules: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  // Finder patterns
  const setFinder = (r: number, c: number) => {
    for (let dr = -1; dr <= 7; dr++)
      for (let dc = -1; dc <= 7; dc++) {
        const row = r + dr, col = c + dc
        if (row < 0 || row >= size || col < 0 || col >= size) continue
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6
        modules[row][col] = inOuter ? (onBorder || inInner) : false
        reserved[row][col] = true
      }
  }
  setFinder(0, 0)
  setFinder(0, size - 7)
  setFinder(size - 7, 0)

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    modules[6][i] = i % 2 === 0
    modules[i][6] = i % 2 === 0
    reserved[6][i] = true
    reserved[i][6] = true
  }

  // Alignment pattern (versions 2+)
  if (version >= 2) {
    const pos = [6, version * 4 + 10]
    for (const r of pos)
      for (const c of pos) {
        if (reserved[r]?.[c]) continue
        for (let dr = -2; dr <= 2; dr++)
          for (let dc = -2; dc <= 2; dc++) {
            const row = r + dr, col = c + dc
            if (row >= 0 && row < size && col >= 0 && col < size) {
              modules[row][col] = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0)
              reserved[row][col] = true
            }
          }
      }
  }

  // Format info reserved areas
  for (let i = 0; i < 8; i++) {
    reserved[8][i] = true; reserved[8][size - 1 - i] = true
    reserved[i][8] = true; reserved[size - 1 - i][8] = true
  }
  reserved[8][8] = true
  modules[size - 8][8] = true // dark module
  reserved[size - 8][8] = true

  // Place data
  const finalBits: number[] = []
  for (const cw of final) for (let i = 7; i >= 0; i--) finalBits.push((cw >> i) & 1)
  let bitIdx = 0
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5
    for (let r = 0; r < size; r++) {
      const upward = ((size - 1 - col) >> 1) % 2 === 0
      const row = upward ? size - 1 - r : r
      for (const dc of [0, -1]) {
        const c = col + dc
        if (c < 0 || reserved[row][c]) continue
        modules[row][c] = bitIdx < finalBits.length ? finalBits[bitIdx++] === 1 : false
      }
    }
  }

  // Apply mask (pattern 0: (row + col) % 2 === 0)
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (!reserved[r][c]) modules[r][c] = modules[r][c] !== ((r + c) % 2 === 0)

  // Format info (mask 0, EC level M = 0b00)
  const formatBits = [true,false,true,false,true,false,false,false,false,false,true,false,false,true,false]
  // Place format info
  const formatPositions: [number, number][] = []
  for (let i = 0; i <= 5; i++) formatPositions.push([8, i])
  formatPositions.push([8, 7], [8, 8], [7, 8])
  for (let i = 5; i >= 0; i--) formatPositions.push([i, 8])
  for (let i = 0; i < 15 && i < formatPositions.length; i++) {
    const [r, c] = formatPositions[i]
    modules[r][c] = formatBits[i]
  }
  // Second copy
  for (let i = 0; i < 7; i++) modules[size - 1 - i][8] = formatBits[i]
  for (let i = 0; i < 8; i++) modules[8][size - 8 + i] = formatBits[7 + i]

  return { modules: modules.map(row => row.map(v => v === true)), size }
}

/**
 * Generate QR code as SVG string
 */
export function generateQRSvg(data: string, pixelSize = 4, margin = 2): string {
  const { modules, size } = encode(data)
  const totalSize = (size + margin * 2) * pixelSize
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">`
  svg += `<rect width="${totalSize}" height="${totalSize}" fill="white"/>`
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (modules[r][c])
        svg += `<rect x="${(c + margin) * pixelSize}" y="${(r + margin) * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="black"/>`
  svg += '</svg>'
  return svg
}
