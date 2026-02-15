-- Update free plan: max_stores from 3 to 2
-- Existing free users get updated too

-- Update all existing free plan users
UPDATE users SET max_stores = 2 WHERE plan = 'free' AND max_stores = 3;

-- Note: SQLite does not support ALTER COLUMN DEFAULT.
-- New users will get max_stores = 2 via application-level defaults.
