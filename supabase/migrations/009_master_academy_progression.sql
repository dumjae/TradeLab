-- TradeLab Academy — Migration 009: Master Academy Progression & Level Assessments
-- PostgreSQL / Supabase Migration (100% idempotent) with strict constraints, targeted indexes, and Row Level Security (RLS)
--
-- Rollback Reference (execute in reverse dependency order if reverting):
--   DROP TABLE IF EXISTS public.user_level_assessments CASCADE;
--   DROP TABLE IF EXISTS public.user_topic_progress CASCADE;

-- ============================================================================
-- 1. User-Private Topic Progression (Reading, Quiz, Practical, Completion)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_code TEXT NOT NULL CHECK (char_length(trim(topic_code)) >= 1),
  reading_completed BOOLEAN NOT NULL DEFAULT false,
  quiz_passed BOOLEAN NOT NULL DEFAULT false,
  quiz_score_pct INTEGER NOT NULL DEFAULT 0 CHECK (quiz_score_pct BETWEEN 0 AND 100),
  practical_completed BOOLEAN NOT NULL DEFAULT false,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_topic_progress_user_topic UNIQUE (user_id, topic_code)
);

CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_completed
  ON public.user_topic_progress (user_id, completed, updated_at DESC);

DROP TRIGGER IF EXISTS trg_user_topic_progress_updated_at ON public.user_topic_progress;
CREATE TRIGGER trg_user_topic_progress_updated_at
  BEFORE UPDATE ON public.user_topic_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 2. User-Private Level Assessments & Completion Certificates (Levels 1-5)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_level_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
  score_pct INTEGER NOT NULL CHECK (score_pct BETWEEN 0 AND 100),
  correct_count INTEGER NOT NULL CHECK (correct_count >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0 AND correct_count <= total_questions),
  passed BOOLEAN NOT NULL,
  certificate_code TEXT CHECK (
    certificate_code IS NULL OR char_length(trim(certificate_code)) >= 4
  ),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_level_assessments_user_level UNIQUE (user_id, level)
);

CREATE INDEX IF NOT EXISTS idx_user_level_assessments_user_completed_at
  ON public.user_level_assessments (user_id, completed_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_level_assessments_certificate_code
  ON public.user_level_assessments (certificate_code)
  WHERE certificate_code IS NOT NULL;

-- ============================================================================
-- 3. Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_level_assessments ENABLE ROW LEVEL SECURITY;

-- user_topic_progress (strictly private to auth.uid() = user_id)
DROP POLICY IF EXISTS "user_topic_progress_select_own" ON public.user_topic_progress;
CREATE POLICY user_topic_progress_select_own
  ON public.user_topic_progress
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_topic_progress_insert_own" ON public.user_topic_progress;
CREATE POLICY user_topic_progress_insert_own
  ON public.user_topic_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_topic_progress_update_own" ON public.user_topic_progress;
CREATE POLICY user_topic_progress_update_own
  ON public.user_topic_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_topic_progress_delete_own" ON public.user_topic_progress;
CREATE POLICY user_topic_progress_delete_own
  ON public.user_topic_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_level_assessments (strictly private to auth.uid() = user_id)
DROP POLICY IF EXISTS "user_level_assessments_select_own" ON public.user_level_assessments;
CREATE POLICY user_level_assessments_select_own
  ON public.user_level_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_level_assessments_insert_own" ON public.user_level_assessments;
CREATE POLICY user_level_assessments_insert_own
  ON public.user_level_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_level_assessments_update_own" ON public.user_level_assessments;
CREATE POLICY user_level_assessments_update_own
  ON public.user_level_assessments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_level_assessments_delete_own" ON public.user_level_assessments;
CREATE POLICY user_level_assessments_delete_own
  ON public.user_level_assessments
  FOR DELETE
  USING (auth.uid() = user_id);
