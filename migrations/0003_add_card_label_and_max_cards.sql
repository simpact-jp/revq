-- Add label column to cards for multi-card per store use case
-- e.g. "レジ横用", "壁面掲示用"
ALTER TABLE cards ADD COLUMN label TEXT;

-- Add max_cards to users to control how many cards a user can create
-- Free plan default: 2, paid plans can increase
ALTER TABLE users ADD COLUMN max_cards INTEGER NOT NULL DEFAULT 2;
