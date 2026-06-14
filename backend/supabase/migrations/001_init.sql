-- Aura: initial schema + RLS policies
-- Run this against your Supabase project via the SQL editor or supabase db push

-- ----------------------------------------------------------------
-- 1. Profiles (extends auth.users)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name      TEXT        NOT NULL,
  date_of_birth   DATE        NOT NULL,
  gender          TEXT        NOT NULL,
  interested_in   TEXT[]      NOT NULL DEFAULT '{}',
  questionnaire_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- NOTE: profiles_select references matches, so it is added after matches is created (below).
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ----------------------------------------------------------------
-- 2. Questionnaire answers
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS answers (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id   INTEGER     NOT NULL,
  category      TEXT        NOT NULL,
  answer_text   TEXT        NOT NULL,
  answer_index  INTEGER     NOT NULL CHECK (answer_index BETWEEN 0 AND 3),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, question_id)
);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "answers_select" ON answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "answers_insert" ON answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "answers_update" ON answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "answers_delete" ON answers FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_answers_user ON answers(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);

-- ----------------------------------------------------------------
-- 3. Computed matches
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
  id                  UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a              UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b              UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  compatibility_score NUMERIC(5,2) NOT NULL,
  shared_highlights   TEXT[]  NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_a, user_b),
  CONSTRAINT user_a_lt_user_b CHECK (user_a < user_b)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users can only see matches they're part of
CREATE POLICY "matches_select" ON matches FOR SELECT USING (
  auth.uid() = user_a OR auth.uid() = user_b
);

-- Only the backend service role can insert/update matches
CREATE POLICY "matches_insert" ON matches FOR INSERT WITH CHECK (FALSE);
CREATE POLICY "matches_update" ON matches FOR UPDATE USING (FALSE);

CREATE INDEX IF NOT EXISTS idx_matches_user_a ON matches(user_a);
CREATE INDEX IF NOT EXISTS idx_matches_user_b ON matches(user_b);

-- Now safe to add: profiles_select references matches
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM matches
    WHERE (user_a = auth.uid() AND user_b = profiles.id)
       OR (user_b = auth.uid() AND user_a = profiles.id)
  )
);

-- ----------------------------------------------------------------
-- 4. Chat messages
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id    UUID        NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  seen        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read/write messages in matches they belong to
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
      AND (matches.user_a = auth.uid() OR matches.user_b = auth.uid())
  )
);

CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
      AND (matches.user_a = auth.uid() OR matches.user_b = auth.uid())
  )
);

-- Recipients can mark messages as seen
CREATE POLICY "messages_update_seen" ON messages FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
      AND (matches.user_a = auth.uid() OR matches.user_b = auth.uid())
  )
);

CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(match_id, created_at);

-- ----------------------------------------------------------------
-- 5. Push tokens (for FCM notifications)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS push_tokens (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token      TEXT        NOT NULL,
  platform   TEXT        NOT NULL CHECK (platform IN ('web', 'ios', 'android')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, token)
);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_tokens_manage" ON push_tokens USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- 6. Enable Supabase Realtime on messages
-- ----------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
