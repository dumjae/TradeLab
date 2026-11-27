-- TradeLab Academy — Migration 006: Lesson Progress & Streaks, Trade Journal, and Onboarding Preferences
-- PostgreSQL / Supabase Migration (100% idempotent) with strict constraints, targeted indexes, and Row Level Security (RLS)
--
-- Rollback Reference (execute in reverse dependency order if reverting):
--   DROP TABLE IF EXISTS public.user_journal_entries CASCADE;
--   DROP TABLE IF EXISTS public.user_lesson_progress CASCADE;
--   ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS chk_profiles_preferred_market;
--   ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS chk_profiles_experience_level;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS onboarding_completed;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS preferred_market;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS experience_level;

-- ============================================================================
-- 1. Profiles: First-Login Onboarding Track Preferences
-- ============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS experience_level TEXT NOT NULL DEFAULT 'beginner';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferred_market TEXT NOT NULL DEFAULT 'all';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_profiles_experience_level'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT chk_profiles_experience_level
      CHECK (experience_level IN ('beginner', 'intermediate', 'advanced'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_profiles_preferred_market'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT chk_profiles_preferred_market
      CHECK (preferred_market IN ('all', 'general', 'forex', 'indices', 'crypto', 'stocks'));
  END IF;
END $$;

-- ============================================================================
-- 2. User-Private Lesson Progress & Study Streaks
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL CHECK (char_length(trim(lesson_slug)) >= 1),
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_lesson_progress_user_slug UNIQUE (user_id, lesson_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_completed
  ON public.user_lesson_progress (user_id, completed);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_completed_at
  ON public.user_lesson_progress (user_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson
  ON public.user_lesson_progress (lesson_id);

DROP TRIGGER IF EXISTS trg_user_lesson_progress_updated_at ON public.user_lesson_progress;
CREATE TRIGGER trg_user_lesson_progress_updated_at
  BEFORE UPDATE ON public.user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 3. User-Private Real / Demo Trade Journal
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  traded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  symbol TEXT NOT NULL CHECK (char_length(trim(symbol)) >= 1),
  asset_class TEXT NOT NULL CHECK (
    asset_class IN ('crypto', 'forex', 'indices', 'stocks', 'commodities')
  ),
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  setup_tag TEXT NOT NULL DEFAULT '',
  entry_price NUMERIC(18,6),
  exit_price NUMERIC(18,6),
  pnl_amount NUMERIC(14,2) NOT NULL,
  r_multiple NUMERIC(8,2) NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('win', 'loss', 'breakeven')),
  emotion TEXT NOT NULL CHECK (
    emotion IN ('calm_disciplined', 'fomo', 'revenge', 'hesitant', 'overconfident')
  ),
  followed_plan BOOLEAN NOT NULL DEFAULT true,
  screenshot_url TEXT CHECK (screenshot_url IS NULL OR screenshot_url ~* '^https://'),
  lesson_learned TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_journal_entries_user_traded_at
  ON public.user_journal_entries (user_id, traded_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_journal_entries_user_emotion
  ON public.user_journal_entries (user_id, emotion);

-- ============================================================================
-- 4. Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journal_entries ENABLE ROW LEVEL SECURITY;

-- user_lesson_progress (strictly private to auth.uid() = user_id)
DROP POLICY IF EXISTS "user_lesson_progress_select_own" ON public.user_lesson_progress;
CREATE POLICY user_lesson_progress_select_own
  ON public.user_lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_lesson_progress_insert_own" ON public.user_lesson_progress;
CREATE POLICY user_lesson_progress_insert_own
  ON public.user_lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_lesson_progress_update_own" ON public.user_lesson_progress;
CREATE POLICY user_lesson_progress_update_own
  ON public.user_lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_lesson_progress_delete_own" ON public.user_lesson_progress;
CREATE POLICY user_lesson_progress_delete_own
  ON public.user_lesson_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_journal_entries (strictly private to auth.uid() = user_id)
DROP POLICY IF EXISTS "user_journal_entries_select_own" ON public.user_journal_entries;
CREATE POLICY user_journal_entries_select_own
  ON public.user_journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_journal_entries_insert_own" ON public.user_journal_entries;
CREATE POLICY user_journal_entries_insert_own
  ON public.user_journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_journal_entries_update_own" ON public.user_journal_entries;
CREATE POLICY user_journal_entries_update_own
  ON public.user_journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_journal_entries_delete_own" ON public.user_journal_entries;
CREATE POLICY user_journal_entries_delete_own
  ON public.user_journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);
