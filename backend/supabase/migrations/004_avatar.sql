-- Add avatar_config column to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_config JSONB DEFAULT NULL;
