-- TradeLab Academy — Migration 001: Core Academy, Visual Learning Library & User Progress
-- PostgreSQL / Supabase Migration with strict constraints, targeted indexes, and Row Level Security (RLS)
--
-- Rollback Reference (execute in reverse dependency order if reverting):
--   DROP TABLE IF EXISTS public.user_difficult_concepts CASCADE;
--   DROP TABLE IF EXISTS public.user_learning_history CASCADE;
--   DROP TABLE IF EXISTS public.user_saved_resources CASCADE;
--   DROP TABLE IF EXISTS public.resource_discovery_cache CASCADE;
--   DROP TABLE IF EXISTS public.lesson_resources CASCADE;
--   DROP TABLE IF EXISTS public.resource_segments CASCADE;
--   DROP TABLE IF EXISTS public.educational_resources CASCADE;
--   DROP TABLE IF EXISTS public.lessons CASCADE;
--   DROP TABLE IF EXISTS public.profiles CASCADE;
--   DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
--   DROP FUNCTION IF EXISTS public.prevent_profile_role_escalation() CASCADE;
--   DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
--   DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. Shared Trigger Functions & Role Helper
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. User Profiles & Admin Authorization
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators may change profile roles';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    'learner'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_profiles_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_escalation();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. Core Curriculum & Visual Resources
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title TEXT NOT NULL CHECK (char_length(trim(title)) >= 3),
  subtitle TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  module_order INTEGER NOT NULL CHECK (module_order > 0),
  concept_key TEXT NOT NULL UNIQUE CHECK (concept_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  estimated_minutes INTEGER NOT NULL DEFAULT 15 CHECK (estimated_minutes > 0),
  learning_objectives TEXT[] NOT NULL DEFAULT '{}',
  terminology JSONB NOT NULL DEFAULT '[]'::jsonb,
  prerequisites TEXT[] NOT NULL DEFAULT '{}',
  text_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  diagram_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  chart_scenarios JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON public.lessons(module_order);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON public.lessons(level);

DROP TRIGGER IF EXISTS trg_lessons_updated_at ON public.lessons;
CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.educational_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(trim(title)) >= 3),
  description TEXT NOT NULL DEFAULT '',
  source_type TEXT NOT NULL CHECK (source_type IN ('youtube', 'tradingview', 'tradelab_original', 'other_educator')),
  source_name TEXT NOT NULL CHECK (char_length(trim(source_name)) >= 2),
  source_url TEXT NOT NULL UNIQUE CHECK (source_url ~ '^https?://'),
  external_video_id TEXT UNIQUE,
  thumbnail_url TEXT CHECK (thumbnail_url IS NULL OR thumbnail_url ~ '^https?://'),
  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'chart_example', 'diagram', 'walkthrough')),
  license_status TEXT NOT NULL DEFAULT 'standard_embed_only',
  attribution TEXT NOT NULL,
  non_endorsement_notice BOOLEAN NOT NULL DEFAULT true,
  verification_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (
    verification_status IN ('pending_review', 'verified', 'published', 'unavailable', 'archived')
  ),
  quality_score INTEGER NOT NULL DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
  embeddable BOOLEAN NOT NULL DEFAULT true,
  last_checked_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_youtube_video_id_format CHECK (
    source_type <> 'youtube' OR (external_video_id IS NOT NULL AND external_video_id ~ '^[A-Za-z0-9_-]{11}$')
  )
);

CREATE INDEX IF NOT EXISTS idx_educational_resources_status ON public.educational_resources(verification_status);
CREATE INDEX IF NOT EXISTS idx_educational_resources_source_type ON public.educational_resources(source_type);
CREATE INDEX IF NOT EXISTS idx_educational_resources_quality ON public.educational_resources(verification_status, quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_educational_resources_created_by ON public.educational_resources(created_by);

DROP TRIGGER IF EXISTS trg_educational_resources_updated_at ON public.educational_resources;
CREATE TRIGGER trg_educational_resources_updated_at
  BEFORE UPDATE ON public.educational_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.resource_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.educational_resources(id) ON DELETE CASCADE,
  start_seconds INTEGER NOT NULL CHECK (start_seconds >= 0),
  end_seconds INTEGER CHECK (end_seconds IS NULL OR end_seconds > start_seconds),
  segment_title TEXT NOT NULL CHECK (char_length(trim(segment_title)) >= 2),
  explanation TEXT NOT NULL DEFAULT '',
  verification_method TEXT NOT NULL CHECK (
    verification_method IN ('youtube_chapters', 'verified_transcript', 'manual_editorial')
  ),
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resource_segments_resource_start ON public.resource_segments(resource_id, start_seconds ASC);
CREATE INDEX IF NOT EXISTS idx_resource_segments_verified_by ON public.resource_segments(verified_by);

DROP TRIGGER IF EXISTS trg_resource_segments_updated_at ON public.resource_segments;
CREATE TRIGGER trg_resource_segments_updated_at
  BEFORE UPDATE ON public.resource_segments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.lesson_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.educational_resources(id) ON DELETE CASCADE,
  relevance_score INTEGER NOT NULL DEFAULT 80 CHECK (relevance_score BETWEEN 0 AND 100),
  display_order INTEGER NOT NULL DEFAULT 1 CHECK (display_order >= 0),
  before_watch_context TEXT NOT NULL DEFAULT '',
  after_watch_takeaways TEXT[] NOT NULL DEFAULT '{}',
  editorial_notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_lesson_resources_lesson_resource UNIQUE (lesson_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson_order ON public.lesson_resources(lesson_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_resource ON public.lesson_resources(resource_id);

DROP TRIGGER IF EXISTS trg_lesson_resources_updated_at ON public.lesson_resources;
CREATE TRIGGER trg_lesson_resources_updated_at
  BEFORE UPDATE ON public.lesson_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.resource_discovery_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT NOT NULL UNIQUE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('youtube_data_api', 'tradingview_manual', 'other')),
  query_text TEXT NOT NULL,
  results_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discovery_cache_lesson ON public.resource_discovery_cache(lesson_id);
CREATE INDEX IF NOT EXISTS idx_discovery_cache_expires ON public.resource_discovery_cache(expires_at);

DROP TRIGGER IF EXISTS trg_resource_discovery_cache_updated_at ON public.resource_discovery_cache;
CREATE TRIGGER trg_resource_discovery_cache_updated_at
  BEFORE UPDATE ON public.resource_discovery_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 4. User-Private Visual Library & Difficult Concepts
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_saved_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.educational_resources(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  saved_timestamp_seconds INTEGER CHECK (saved_timestamp_seconds IS NULL OR saved_timestamp_seconds >= 0),
  saved_segment_id UUID REFERENCES public.resource_segments(id) ON DELETE SET NULL,
  curriculum_level TEXT NOT NULL DEFAULT 'beginner' CHECK (curriculum_level IN ('beginner', 'intermediate', 'advanced')),
  personal_notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_saved_resources_user_created ON public.user_saved_resources(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_saved_resources_resource ON public.user_saved_resources(resource_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_resources_lesson ON public.user_saved_resources(lesson_id);

DROP TRIGGER IF EXISTS trg_user_saved_resources_updated_at ON public.user_saved_resources;
CREATE TRIGGER trg_user_saved_resources_updated_at
  BEFORE UPDATE ON public.user_saved_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.user_learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.educational_resources(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  last_position_seconds INTEGER NOT NULL DEFAULT 0 CHECK (last_position_seconds >= 0),
  completion_status TEXT NOT NULL DEFAULT 'not_started' CHECK (
    completion_status IN ('not_started', 'in_progress', 'watched')
  ),
  last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_learning_history_user_resource UNIQUE (user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_user_learning_history_user_viewed ON public.user_learning_history(user_id, last_viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_resource ON public.user_learning_history(resource_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_lesson ON public.user_learning_history(lesson_id);

DROP TRIGGER IF EXISTS trg_user_learning_history_updated_at ON public.user_learning_history;
CREATE TRIGGER trg_user_learning_history_updated_at
  BEFORE UPDATE ON public.user_learning_history
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.user_difficult_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  concept_key TEXT NOT NULL,
  concept_label TEXT NOT NULL,
  trigger_sources TEXT[] NOT NULL DEFAULT '{}',
  mistake_count INTEGER NOT NULL DEFAULT 0 CHECK (mistake_count >= 0),
  consecutive_correct INTEGER NOT NULL DEFAULT 0 CHECK (consecutive_correct >= 0),
  is_mastered BOOLEAN NOT NULL DEFAULT false,
  mastered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_difficult_concepts_user_lesson_concept UNIQUE (user_id, lesson_id, concept_key)
);

CREATE INDEX IF NOT EXISTS idx_user_difficult_concepts_user_active
  ON public.user_difficult_concepts(user_id, is_mastered, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_difficult_concepts_lesson ON public.user_difficult_concepts(lesson_id);

DROP TRIGGER IF EXISTS trg_user_difficult_concepts_updated_at ON public.user_difficult_concepts;
CREATE TRIGGER trg_user_difficult_concepts_updated_at
  BEFORE UPDATE ON public.user_difficult_concepts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 5. Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_discovery_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_difficult_concepts ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY profiles_select_own_or_admin
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY profiles_update_own_or_admin
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    public.is_admin()
    OR (auth.uid() = id AND role = 'learner')
  );

-- lessons (publicly readable; admin writes)
CREATE POLICY lessons_select_public
  ON public.lessons
  FOR SELECT
  USING (true);

CREATE POLICY lessons_admin_insert
  ON public.lessons
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY lessons_admin_update
  ON public.lessons
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY lessons_admin_delete
  ON public.lessons
  FOR DELETE
  USING (public.is_admin());

-- educational_resources (learners see ONLY published; admins manage all)
CREATE POLICY educational_resources_select_published_or_admin
  ON public.educational_resources
  FOR SELECT
  USING (verification_status = 'published' OR public.is_admin());

CREATE POLICY educational_resources_admin_insert
  ON public.educational_resources
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY educational_resources_admin_update
  ON public.educational_resources
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY educational_resources_admin_delete
  ON public.educational_resources
  FOR DELETE
  USING (public.is_admin());

-- resource_segments (learners see segments only for published resources)
CREATE POLICY resource_segments_select_published_or_admin
  ON public.resource_segments
  FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.educational_resources r
      WHERE r.id = resource_segments.resource_id
        AND r.verification_status = 'published'
    )
  );

CREATE POLICY resource_segments_admin_insert
  ON public.resource_segments
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY resource_segments_admin_update
  ON public.resource_segments
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY resource_segments_admin_delete
  ON public.resource_segments
  FOR DELETE
  USING (public.is_admin());

-- lesson_resources (learners see mappings only for published resources)
CREATE POLICY lesson_resources_select_published_or_admin
  ON public.lesson_resources
  FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.educational_resources r
      WHERE r.id = lesson_resources.resource_id
        AND r.verification_status = 'published'
    )
  );

CREATE POLICY lesson_resources_admin_insert
  ON public.lesson_resources
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY lesson_resources_admin_update
  ON public.lesson_resources
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY lesson_resources_admin_delete
  ON public.lesson_resources
  FOR DELETE
  USING (public.is_admin());

-- resource_discovery_cache (strictly admin / service-role only)
CREATE POLICY discovery_cache_admin_all
  ON public.resource_discovery_cache
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- user_saved_resources (strictly private to auth.uid() = user_id)
CREATE POLICY user_saved_resources_select_own
  ON public.user_saved_resources
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_saved_resources_insert_own
  ON public.user_saved_resources
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_saved_resources_update_own
  ON public.user_saved_resources
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_saved_resources_delete_own
  ON public.user_saved_resources
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_learning_history (strictly private to auth.uid() = user_id)
CREATE POLICY user_learning_history_select_own
  ON public.user_learning_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_learning_history_insert_own
  ON public.user_learning_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_learning_history_update_own
  ON public.user_learning_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_learning_history_delete_own
  ON public.user_learning_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_difficult_concepts (strictly private to auth.uid() = user_id)
CREATE POLICY user_difficult_concepts_select_own
  ON public.user_difficult_concepts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_difficult_concepts_insert_own
  ON public.user_difficult_concepts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_difficult_concepts_update_own
  ON public.user_difficult_concepts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_difficult_concepts_delete_own
  ON public.user_difficult_concepts
  FOR DELETE
  USING (auth.uid() = user_id);
