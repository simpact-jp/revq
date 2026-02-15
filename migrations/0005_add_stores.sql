-- Add stores table: each user can register multiple stores (default limit: 3)
-- Each store can have multiple QR cards (default limit: 2 per store)

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  google_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);

-- Add store_id to cards (nullable for backward compat during migration)
ALTER TABLE cards ADD COLUMN store_id INTEGER REFERENCES stores(id);
CREATE INDEX IF NOT EXISTS idx_cards_store_id ON cards(store_id);

-- Replace max_cards with max_stores and max_cards_per_store on users
ALTER TABLE users ADD COLUMN max_stores INTEGER NOT NULL DEFAULT 3;
ALTER TABLE users ADD COLUMN max_cards_per_store INTEGER NOT NULL DEFAULT 2;

-- Migrate existing cards: create a store per unique (user_id, google_url) pair
-- and link cards to the new stores.
-- This is done via application code after migration (see seed-stores migration script).
