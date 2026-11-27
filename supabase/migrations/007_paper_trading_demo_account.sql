-- TradeLab Academy — Migration 007: Paper Trading Multi-Wallet Demo Accounts, Positions, and Trade History
-- PostgreSQL / Supabase Migration (100% idempotent) with strict constraints, targeted indexes, and Row Level Security (RLS)
--
-- Rollback Reference (execute in reverse dependency order if reverting):
--   DROP TABLE IF EXISTS public.user_paper_trades CASCADE;
--   DROP TABLE IF EXISTS public.user_paper_positions CASCADE;
--   DROP TABLE IF EXISTS public.user_paper_accounts CASCADE;

-- ============================================================================
-- 1. User-Private Paper Trading Demo Wallets (Multiple Wallets per User)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_paper_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL DEFAULT 'Crypto Demo' CHECK (char_length(trim(account_name)) >= 1),
  market_focus TEXT NOT NULL DEFAULT 'all' CHECK (
    market_focus IN ('all', 'crypto', 'forex', 'indices', 'stocks', 'commodities')
  ),
  starting_balance NUMERIC(18, 2) NOT NULL DEFAULT 10000 CHECK (starting_balance > 0),
  cash_balance NUMERIC(18, 2) NOT NULL DEFAULT 10000,
  daily_loss_limit_pct NUMERIC(5, 2) NOT NULL DEFAULT 3.00 CHECK (
    daily_loss_limit_pct >= 0.5 AND daily_loss_limit_pct <= 25
  ),
  max_risk_per_trade_pct NUMERIC(5, 2) NOT NULL DEFAULT 1.00 CHECK (
    max_risk_per_trade_pct >= 0.1 AND max_risk_per_trade_pct <= 10
  ),
  simulate_fees_spread BOOLEAN NOT NULL DEFAULT true,
  fee_rate_bps NUMERIC(6, 2) NOT NULL DEFAULT 5.00 CHECK (
    fee_rate_bps >= 0 AND fee_rate_bps <= 100
  ),
  spread_bps NUMERIC(6, 2) NOT NULL DEFAULT 2.00 CHECK (
    spread_bps >= 0 AND spread_bps <= 100
  ),
  reset_count INTEGER NOT NULL DEFAULT 0 CHECK (reset_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_paper_accounts_user_created_at
  ON public.user_paper_accounts (user_id, created_at DESC);

DROP TRIGGER IF EXISTS trg_user_paper_accounts_updated_at ON public.user_paper_accounts;
CREATE TRIGGER trg_user_paper_accounts_updated_at
  BEFORE UPDATE ON public.user_paper_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 2. User-Private Paper Trading Active & Pending Positions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_paper_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.user_paper_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL CHECK (char_length(trim(symbol)) >= 1),
  asset_class TEXT NOT NULL CHECK (
    asset_class IN ('crypto', 'forex', 'indices', 'stocks', 'commodities')
  ),
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  order_type TEXT NOT NULL CHECK (order_type IN ('market', 'limit')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'open')),
  entry_price NUMERIC(18, 6) NOT NULL CHECK (entry_price > 0),
  raw_quote_price NUMERIC(18, 6) NOT NULL CHECK (raw_quote_price > 0),
  stop_loss NUMERIC(18, 6) NOT NULL CHECK (stop_loss > 0),
  take_profit NUMERIC(18, 6) CHECK (take_profit IS NULL OR take_profit > 0),
  units NUMERIC(18, 6) NOT NULL CHECK (units > 0),
  risk_amount NUMERIC(18, 2) NOT NULL CHECK (risk_amount > 0),
  entry_fee NUMERIC(18, 4) NOT NULL DEFAULT 0 CHECK (entry_fee >= 0),
  entry_spread_cost NUMERIC(18, 4) NOT NULL DEFAULT 0 CHECK (entry_spread_cost >= 0),
  setup_tag TEXT NOT NULL DEFAULT '',
  moved_to_breakeven BOOLEAN NOT NULL DEFAULT false,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_paper_positions_user_created_at
  ON public.user_paper_positions (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_paper_positions_account_status
  ON public.user_paper_positions (account_id, status);

DROP TRIGGER IF EXISTS trg_user_paper_positions_updated_at ON public.user_paper_positions;
CREATE TRIGGER trg_user_paper_positions_updated_at
  BEFORE UPDATE ON public.user_paper_positions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 3. User-Private Paper Trading Closed Trade History
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_paper_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.user_paper_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL CHECK (char_length(trim(symbol)) >= 1),
  asset_class TEXT NOT NULL CHECK (
    asset_class IN ('crypto', 'forex', 'indices', 'stocks', 'commodities')
  ),
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  entry_price NUMERIC(18, 6) NOT NULL CHECK (entry_price > 0),
  exit_price NUMERIC(18, 6) NOT NULL CHECK (exit_price > 0),
  stop_loss NUMERIC(18, 6) NOT NULL CHECK (stop_loss > 0),
  take_profit NUMERIC(18, 6) CHECK (take_profit IS NULL OR take_profit > 0),
  units NUMERIC(18, 6) NOT NULL CHECK (units > 0),
  risk_amount NUMERIC(18, 2) NOT NULL CHECK (risk_amount > 0),
  gross_pnl NUMERIC(18, 2) NOT NULL DEFAULT 0,
  fee_amount NUMERIC(18, 4) NOT NULL DEFAULT 0 CHECK (fee_amount >= 0),
  spread_cost NUMERIC(18, 4) NOT NULL DEFAULT 0 CHECK (spread_cost >= 0),
  pnl_amount NUMERIC(18, 2) NOT NULL,
  r_multiple NUMERIC(8, 2) NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('win', 'loss', 'breakeven')),
  exit_reason TEXT NOT NULL CHECK (
    exit_reason IN ('take_profit', 'stop_loss', 'breakeven', 'manual_close')
  ),
  setup_tag TEXT NOT NULL DEFAULT '',
  synced_to_journal BOOLEAN NOT NULL DEFAULT false,
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_paper_trades_user_closed_at
  ON public.user_paper_trades (user_id, closed_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_paper_trades_account_closed_at
  ON public.user_paper_trades (account_id, closed_at DESC);

-- ============================================================================
-- 4. Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.user_paper_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_paper_trades ENABLE ROW LEVEL SECURITY;

-- user_paper_accounts (strictly private to auth.uid() = user_id)
DROP POLICY IF EXISTS "user_paper_accounts_select_own" ON public.user_paper_accounts;
CREATE POLICY user_paper_accounts_select_own
  ON public.user_paper_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_paper_accounts_insert_own" ON public.user_paper_accounts;
CREATE POLICY user_paper_accounts_insert_own
  ON public.user_paper_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_paper_accounts_update_own" ON public.user_paper_accounts;
CREATE POLICY user_paper_accounts_update_own
  ON public.user_paper_accounts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_paper_accounts_delete_own" ON public.user_paper_accounts;
CREATE POLICY user_paper_accounts_delete_own
  ON public.user_paper_accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_paper_positions (strictly private to auth.uid() = user_id + owned account)
DROP POLICY IF EXISTS "user_paper_positions_select_own" ON public.user_paper_positions;
CREATE POLICY user_paper_positions_select_own
  ON public.user_paper_positions
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_paper_positions_insert_own" ON public.user_paper_positions;
CREATE POLICY user_paper_positions_insert_own
  ON public.user_paper_positions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.user_paper_accounts a
      WHERE a.id = account_id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "user_paper_positions_update_own" ON public.user_paper_positions;
CREATE POLICY user_paper_positions_update_own
  ON public.user_paper_positions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.user_paper_accounts a
      WHERE a.id = account_id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "user_paper_positions_delete_own" ON public.user_paper_positions;
CREATE POLICY user_paper_positions_delete_own
  ON public.user_paper_positions
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_paper_trades (strictly private to auth.uid() = user_id + owned account)
DROP POLICY IF EXISTS "user_paper_trades_select_own" ON public.user_paper_trades;
CREATE POLICY user_paper_trades_select_own
  ON public.user_paper_trades
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_paper_trades_insert_own" ON public.user_paper_trades;
CREATE POLICY user_paper_trades_insert_own
  ON public.user_paper_trades
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.user_paper_accounts a
      WHERE a.id = account_id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "user_paper_trades_update_own" ON public.user_paper_trades;
CREATE POLICY user_paper_trades_update_own
  ON public.user_paper_trades
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.user_paper_accounts a
      WHERE a.id = account_id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "user_paper_trades_delete_own" ON public.user_paper_trades;
CREATE POLICY user_paper_trades_delete_own
  ON public.user_paper_trades
  FOR DELETE
  USING (auth.uid() = user_id);
