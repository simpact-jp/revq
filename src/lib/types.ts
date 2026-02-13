// Cloudflare bindings
export type Bindings = {
  DB: D1Database
  R2?: R2Bucket
  JWT_SECRET?: string
  ADMIN_PASSWORD?: string
}

// DB row types
export type User = {
  id: number
  email: string
  name: string | null
  plan: string
  created_at: string
  last_login_at: string | null
}

export type Card = {
  id: number
  user_id: number | null
  store_name: string | null
  google_url: string
  short_code: string
  template: string
  image_key: string | null
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
}

export type CardWithClicks = Card & {
  click_count: number
}
