// Cloudflare bindings
export type Bindings = {
  DB: D1Database
  R2?: R2Bucket
  JWT_SECRET?: string
  ADMIN_PASSWORD?: string
  RESEND_API_KEY?: string
  OTP_FROM_EMAIL?: string
  LINK_DOMAIN?: string   // Short URL domain (default: revq.link)
  MAIN_DOMAIN?: string   // Main site domain (default: revq.jp)
  STRIPE_SECRET_KEY?: string
  STRIPE_PUBLISHABLE_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
}

// DB row types
export type User = {
  id: number
  email: string
  name: string | null
  plan: string
  max_cards: number
  max_stores: number
  max_cards_per_store: number
  weekly_email: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_interval: string | null
  plan_expires_at: string | null
  created_at: string
  last_login_at: string | null
}

export type Store = {
  id: number
  user_id: number
  name: string
  google_url: string
  created_at: string
}

export type Card = {
  id: number
  user_id: number | null
  store_id: number | null
  store_name: string | null
  google_url: string
  short_code: string
  template: string
  image_key: string | null
  cta_text: string | null
  label: string | null
  gate_enabled: number
  created_at: string
  status: string
}

export type Click = {
  id: number
  card_id: number
  clicked_at: string
  user_agent: string | null
  referer: string | null
}

export type OTP = {
  id: number
  email: string
  code: string
  expires_at: string
  used: number
  created_at: string
}

// API request/response types
export type CreateCardRequest = {
  google_url: string
  store_name?: string
  template?: string
  image_data?: string  // base64 data URI
  cta_text?: string    // custom CTA text for the card
  label?: string       // card label e.g. "レジ横用", "壁面掲示用"
}

export type CardWithClicks = Card & {
  click_count: number
}

export type Feedback = {
  id: number
  card_id: number
  message: string
  created_at: string
  is_read: number
}

// PDF generation options
export type PDFLayout = 'card' | 'a4-single' | 'a4-multi'

export type GeneratePDFRequest = {
  storeName?: string | null
  shortCode: string
  shortUrl: string
  template: string
  imageData?: string | null
  ctaText?: string | null
  layout?: PDFLayout
  copies?: number  // for a4-multi layout: how many cards per page
  hideBranding?: boolean  // Pro plan: hide "Powered by RevQ" footer
}
