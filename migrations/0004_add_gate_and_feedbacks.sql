-- Add satisfaction gate toggle to cards
-- When enabled, QR scan shows satisfaction gate before redirect
ALTER TABLE cards ADD COLUMN gate_enabled INTEGER NOT NULL DEFAULT 0;

-- Add weekly email preference to users (default ON)
ALTER TABLE users ADD COLUMN weekly_email INTEGER NOT NULL DEFAULT 1;

-- Feedbacks table: stores negative feedback from customers
CREATE TABLE IF NOT EXISTS feedbacks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_read INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (card_id) REFERENCES cards(id)
);
CREATE INDEX IF NOT EXISTS idx_feedbacks_card_id ON feedbacks(card_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);
