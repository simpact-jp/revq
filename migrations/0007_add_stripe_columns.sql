-- Add Stripe-related columns to users table
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN plan_interval TEXT DEFAULT 'none';
ALTER TABLE users ADD COLUMN plan_expires_at TEXT;

-- Index for quick lookup by Stripe customer ID
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
