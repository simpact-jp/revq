-- RevuQ initial schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- OTP codes for email authentication
CREATE TABLE IF NOT EXISTS otps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_otps_email_code ON otps(email, code);

-- Cards (review cards created by users)
CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  store_name TEXT,
  google_url TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  template TEXT NOT NULL DEFAULT 'simple',
  image_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_cards_short_code ON cards(short_code);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);

-- Click tracking
CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  clicked_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_agent TEXT,
  referer TEXT,
  FOREIGN KEY (card_id) REFERENCES cards(id)
);
CREATE INDEX IF NOT EXISTS idx_clicks_card_id ON clicks(card_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);
