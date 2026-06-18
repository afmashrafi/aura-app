-- Add avatar_url for Ready Player Me 3D avatars
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL;
