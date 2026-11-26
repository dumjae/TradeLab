-- TradeLab Academy — Migration 003: Google OAuth Profiles, Admin Role Guard & Multi-Asset Backtesting
-- PostgreSQL / Supabase Migration with strict constraints, targeted indexes, and Row Level Security (RLS)
--
-- Rollback Reference (execute in reverse dependency order if reverting):
--   DROP TABLE IF EXISTS public.user_backtest_trades CASCADE;
--   DROP TABLE IF EXISTS public.user_backtest_sessions CASCADE;
--   DROP INDEX IF EXISTS public.idx_profiles_email;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar_url;

-- ============================================================================
-- 1. Profiles: Google OAuth Metadata & Safe Admin Role Promotion
-- ============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON public.profiles (lower(email))
  WHERE email IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_display_name TEXT;
  v_avatar_url TEXT;
BEGIN
  v_display_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data ->> 'name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data ->> 'display_name'), ''),
    NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
    'Trader'
  );

  v_avatar_url := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data ->> 'avatar_url'), ''),
    NULLIF(trim(NEW.raw_user_meta_data ->> 'picture'), '')
  );

  INSERT INTO public.profiles (id, email, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    v_display_name,
    v_avatar_url,
    'learner'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = COALESCE(NULLIF(trim(public.profiles.email), ''), EXCLUDED.email),
    display_name = COALESCE(NULLIF(trim(public.profiles.display_name), ''), EXCLUDED.display_name),
    avatar_url = COALESCE(NULLIF(trim(public.profiles.avatar_url), ''), EXCLUDED.avatar_url),
    updated_at = now();

  RETURN NEW;
END;
$$;

-- SECURITY INVOKER is required so current_user reflects the actual calling role
-- (authenticated vs postgres / supabase_admin / service_role) rather than the function owner.
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT (
      current_user IN ('postgres', 'supabase_admin', 'service_role')
      OR COALESCE(auth.role(), '') = 'service_role'
      OR public.is_admin()
    ) THEN
      RAISE EXCEPTION 'Only administrators may change profile roles';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. User-Private Backtesting Sessions & Trades
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_backtest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL CHECK (char_length(trim(symbol)) >= 1),
  asset_class TEXT NOT NULL CHECK (
    asset_class IN ('crypto', 'forex', 'indices', 'stocks', 'commodities', 'custom_csv')
  ),
  timeframe TEXT NOT NULL CHECK (timeframe IN ('5m', '15m', '1h', '4h', '1d')),
  data_source TEXT NOT NULL CHECK (
    data_source IN ('live_binance', 'live_twelvedata', 'live_yahoo', 'uploaded_csv', 'offline_sample')
  ),
  starting_balance NUMERIC(14,2) NOT NULL CHECK (starting_balance > 0),
  ending_balance NUMERIC(14,2) NOT NULL,
  risk_percent NUMERIC(5,2) NOT NULL CHECK (risk_percent > 0 AND risk_percent <= 25),
  total_trades INTEGER NOT NULL DEFAULT 0 CHECK (total_trades >= 0),
  win_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (win_rate >= 0 AND win_rate <= 100),
  profit_factor NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (profit_factor >= 0),
  avg_r_multiple NUMERIC(8,2) NOT NULL DEFAULT 0,
  max_drawdown_pct NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (max_drawdown_pct >= 0),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_backtest_sessions_user_created
  ON public.user_backtest_sessions (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_backtest_sessions_user_symbol
  ON public.user_backtest_sessions (user_id, symbol, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_backtest_sessions_user_asset_class
  ON public.user_backtest_sessions (user_id, asset_class);

DROP TRIGGER IF EXISTS trg_user_backtest_sessions_updated_at ON public.user_backtest_sessions;
CREATE TRIGGER trg_user_backtest_sessions_updated_at
  BEFORE UPDATE ON public.user_backtest_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.user_backtest_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.user_backtest_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  entry_time BIGINT NOT NULL CHECK (entry_time > 0),
  exit_time BIGINT NOT NULL CHECK (exit_time >= entry_time),
  entry_price NUMERIC(18,6) NOT NULL CHECK (entry_price > 0),
  stop_loss NUMERIC(18,6) NOT NULL CHECK (stop_loss > 0),
  take_profit NUMERIC(18,6) CHECK (take_profit IS NULL OR take_profit > 0),
  exit_price NUMERIC(18,6) NOT NULL CHECK (exit_price > 0),
  risk_amount NUMERIC(14,2) NOT NULL CHECK (risk_amount > 0),
  pnl_amount NUMERIC(14,2) NOT NULL,
  r_multiple NUMERIC(8,2) NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('win', 'loss', 'breakeven')),
  setup_tag TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_backtest_trades_session_entry
  ON public.user_backtest_trades (session_id, entry_time ASC);

CREATE INDEX IF NOT EXISTS idx_user_backtest_trades_user_created
  ON public.user_backtest_trades (user_id, created_at DESC);

-- ============================================================================
-- 3. Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.user_backtest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_backtest_trades ENABLE ROW LEVEL SECURITY;

-- user_backtest_sessions (strictly private to auth.uid() = user_id)
DROP POLICY IF EXISTS "user_backtest_sessions_select_own" ON public.user_backtest_sessions;
CREATE POLICY user_backtest_sessions_select_own
  ON public.user_backtest_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_backtest_sessions_insert_own" ON public.user_backtest_sessions;
CREATE POLICY user_backtest_sessions_insert_own
  ON public.user_backtest_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_backtest_sessions_update_own" ON public.user_backtest_sessions;
CREATE POLICY user_backtest_sessions_update_own
  ON public.user_backtest_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_backtest_sessions_delete_own" ON public.user_backtest_sessions;
CREATE POLICY user_backtest_sessions_delete_own
  ON public.user_backtest_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_backtest_trades (strictly private to auth.uid() = user_id and owned session)
DROP POLICY IF EXISTS "user_backtest_trades_select_own" ON public.user_backtest_trades;
CREATE POLICY user_backtest_trades_select_own
  ON public.user_backtest_trades
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_backtest_trades_insert_own" ON public.user_backtest_trades;
CREATE POLICY user_backtest_trades_insert_own
  ON public.user_backtest_trades
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.user_backtest_sessions s
      WHERE s.id = user_backtest_trades.session_id
        AND s.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "user_backtest_trades_update_own" ON public.user_backtest_trades;
CREATE POLICY user_backtest_trades_update_own
  ON public.user_backtest_trades
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.user_backtest_sessions s
      WHERE s.id = user_backtest_trades.session_id
        AND s.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "user_backtest_trades_delete_own" ON public.user_backtest_trades;
CREATE POLICY user_backtest_trades_delete_own
  ON public.user_backtest_trades
  FOR DELETE
  USING (auth.uid() = user_id);
