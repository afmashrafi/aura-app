-- Add bio, interests, and prompt_responses to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prompt_responses JSONB DEFAULT '[]';
