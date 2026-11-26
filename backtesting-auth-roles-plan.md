# Implementation Plan: Multi-Asset Market Backtester, Google (Gmail) Auth & Role-Separated Admin/Learner Views

> **Status:** ✅ Implemented & Verified (Phase X Complete)  
> **Project:** TradeLab Academy  
> **Project Type:** WEB (`React + TypeScript + Vite + Tailwind CSS + TradingView lightweight-charts + Supabase Auth/RLS + Vercel Serverless`)  
> **Depends On:** Completed `feature/visual-learning-library` foundation

---

## 1. Goal & Scope

Expand TradeLab Academy with three tightly integrated capabilities:
1. **Multi-Asset Market Backtester (`/backtest` & Trading Lab integration):** Backtest current & historical **Crypto**, **Forex**, **Indices**, **Stocks**, and **Commodities (Gold/Silver)** with bar-by-bar replay, Long/Short simulated execution, automatic SL/TP & 1R position sizing, Equity Curve analytics, Trade Journal, CSV upload, and saved sessions.
2. **Authentication Panel with Google (Gmail) Login (`/login` + `/auth/callback`):** Clean Supabase Auth panel supporting **"Continue with Google (Gmail)"** OAuth (PKCE), email/password fallback, profile sync (`full_name`, `avatar_url`, `email`), and safe Supabase SQL Admin promotion.
3. **Strict Role-Separated Post-Login Views (`Admin Portal` vs. `Learner Workspace`):**
   - **Normal Learner (`role = 'learner'`):** Enters the **Learner Workspace** (`/`). Zero admin links in navigation; direct access to `/admin/*` is blocked and redirected to `/`.
   - **Administrator (`role = 'admin'`):** Automatically lands in a dedicated **Admin Portal (`/admin`)** with its own `AdminShell` (Overview, Visual Library Curation, Quotes Manager), plus an explicit **"Switch to Learner View"** toggle so you can still study and backtest on the same account without logging out.

---

## 2. Architecture & Solutions for Key Challenges

### 2.1 Multi-Asset Market Data Architecture (Zero CORS, Free Tier + Offline Fallback)
Create a server-side Vercel proxy `/api/market/ohlcv` with strict SSRF host allowlisting, query validation (`zod`), and 5-minute response caching:

| Asset Class | Example Symbols | Primary Free Data Source | Fallback |
|---|---|---|---|
| **Crypto** | `BTCUSDT`, `ETHUSDT`, `SOLUSDT`, `XRPUSDT`, `BNBUSDT` | **Binance Public Klines API** (free, zero API key required, real current bars `5m`/`15m`/`1h`/`4h`/`1d`) | Local deterministic historical dataset |
| **Forex** | `EUR/USD`, `GBP/USD`, `USD/JPY`, `AUD/USD` | **Twelve Data API** (optional `TWELVEDATA_API_KEY`, 800 free calls/day) or public Yahoo Finance chart endpoint (`EURUSD=X`) | Local deterministic historical dataset |
| **Indices** | `NAS100` (`^NDX`), `US500` (`^GSPC`), `US30` (`^DJI`) | Twelve Data / Yahoo Finance chart proxy | Local deterministic historical dataset |
| **Stocks** | `AAPL`, `NVDA`, `TSLA`, `MSFT`, `SPY`, `QQQ` | Twelve Data / Yahoo Finance chart proxy | Local deterministic historical dataset |
| **Commodities** | `XAU/USD` (Gold), `XAG/USD` (Silver), `WTI` | Twelve Data / Yahoo Finance chart proxy (`GC=F` / `XAUUSD=X`) | Local deterministic historical dataset |
| **Any Asset (Custom)** | Any TradingView export | **Client-Side CSV OHLCV Importer** (upload `.csv` directly in browser, zero server call) | Built-in CSV format validator |

> **Honest Data Badge:** The backtester always badges whether the active candles are **`Live Market Data`**, **`Uploaded CSV`**, or **`Offline Historical Sample`** — never mislabeling simulated data as live feeds.

### 2.2 Backtesting Execution Engine (`src/lib/backtestEngine.ts` — Pure Deterministic TypeScript)
- **Bar Replay Controls:** Choose Replay Start Index (hides future bars), `Step +1 Bar`, `Play / Pause` (`1x`, `2x`, `5x`), `Reset`.
- **1R Risk-Based Position Sizing:** Starting Equity (default `$10,000`), Risk per Trade (`0.5%`, `1%`, `2%`, custom), auto-computed units/lots from `|Entry - StopLoss|`.
- **Realistic Bar-by-Bar Fill & Exit Rules:**
  - Market Long / Market Short orders with required Stop Loss and optional Take Profit (auto-calculates Risk:Reward e.g. `1:2`, `1:3`).
  - Price lines for `Entry`, `SL`, and `TP` rendered live on the TradingView `lightweight-charts` chart.
  - **Conservative Tie-Break:** If a single candle's `high` and `low` touch both SL and TP, SL triggers first (never inflates fake win rates).
  - Supports **Move SL to Breakeven**, **Manual Close**, and **Setup Tagging** (`Liquidity Sweep`, `FVG`, `BOS`, `Equal Highs/Lows`, `Custom`).
- **Live Analytics Panel:** Net P&L (`$` & `%`), Win Rate, Profit Factor, Avg R-Multiple, Max Drawdown `%`, Equity Curve chart (`lightweight-charts` AreaSeries), and exportable Trade Journal.

### 2.3 Google (Gmail) Auth & Supabase Admin Promotion
- **Supabase Migration `003_backtesting_and_auth_profiles.sql`:**
  1. Adds `avatar_url TEXT` to `public.profiles` and updates `handle_new_user()` so Google OAuth automatically populates `display_name` (`full_name` / `name`), `email`, and `avatar_url`.
  2. Updates `prevent_profile_role_escalation()` so Supabase Dashboard / SQL Editor (`current_user IN ('postgres', 'supabase_admin', 'service_role')` or `auth.role() = 'service_role'`) can promote your Gmail account via:
     ```sql
     UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@gmail.com';
     ```
     while still strictly blocking any normal client user from self-escalating via the Supabase JS client.
  3. Adds normalized user-private backtesting tables with strict `auth.uid() = user_id` RLS:
     - `public.user_backtest_sessions` (`id`, `user_id`, `symbol`, `asset_class`, `timeframe`, `data_source`, `starting_balance`, `ending_balance`, `risk_percent`, `total_trades`, `win_rate`, `profit_factor`, `max_drawdown_pct`, `notes`, `created_at`, `updated_at`)
     - `public.user_backtest_trades` (`id`, `session_id` FK, `user_id`, `direction` `'long'|'short'`, `entry_time`, `exit_time`, `entry_price`, `stop_loss`, `take_profit`, `exit_price`, `risk_amount`, `pnl_amount`, `r_multiple`, `outcome` `'win'|'loss'|'breakeven'`, `setup_tag`, `notes`, `created_at`)

### 2.4 Separate Admin View vs. Normal Learner View
- **`AuthContext.tsx`** manages session state, Google OAuth (`signInWithOAuth({ provider: 'google' })`), Email/Password auth, profile role fetch (`profiles.role`), and clean sign-out.
- **Route Guards:**
  - `PublicOnlyRoute` (`/login`): Redirects logged-in `admin` -> `/admin`, logged-in `learner` -> `/`.
  - `LearnerRoute` (`/`, `/academy/*`, `/practice/*`, `/lab`, `/backtest`, `/library`): Accessible to authenticated learners (and admins who intentionally click **"Switch to Learner View"**).
  - `AdminRoute` (`/admin`, `/admin/visual-library`, `/admin/quotes`): Strictly requires `role === 'admin'`; non-admins are redirected immediately to `/` and never see admin navigation items.
- **Separate Layouts:**
  - **`AppShell.tsx` (Learner View):** Removes `Admin Console` from the sidebar for normal users. Shows user avatar/email + Sign Out (and a subtle **"Return to Admin Portal"** pill ONLY if `role === 'admin'`).
  - **`AdminShell.tsx` (Admin Portal):** Dedicated dark slate + amber-accented governance layout with sidebar links for **Admin Overview (`/admin`)**, **Visual Library Curation (`/admin/visual-library`)**, **Quotes & Wisdom Manager (`/admin/quotes`)**, plus a **"Switch to Learner View"** button.
- **Local Preview Behavior (when Supabase keys are not set in `.env`):**
  - The `/login` screen displays a clear **`Local Preview Mode`** banner allowing one-click simulated login as either **Learner** or **Admin** so both separated views can be inspected locally. As soon as `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` are configured, simulated login is completely disabled and real Supabase Google/Email auth is enforced.

---

## 3. Planned File Changes & Additions

```text
supabase/migrations/
└── 003_backtesting_and_auth_profiles.sql       # avatar_url, Google OAuth profile trigger, SQL-Editor admin promotion fix, user_backtest_sessions & user_backtest_trades + RLS

api/
├── _lib/urlSecurity.ts                         # Extend allowlist for api.binance.com, api.twelvedata.com, query1.finance.yahoo.com
└── market/
    └── ohlcv.ts                                # Multi-asset OHLCV proxy (Crypto/Forex/Indices/Stocks) + 5-min cache + graceful fallback

src/
├── types/
│   ├── auth.ts                                 # AuthUserProfile, UserRole ('learner' | 'admin'), AuthSessionState
│   └── backtest.ts                             # AssetClass, MarketSymbol, Timeframe, BacktestOrder, BacktestTrade, BacktestMetrics, BacktestSession
├── context/
│   └── AuthContext.tsx                         # Supabase Google OAuth + Email auth + role loader + Local Preview role switcher
├── lib/
│   └── backtestEngine.ts                       # Pure deterministic replay engine, 1R sizing, conservative SL/TP hit detection, metrics & CSV parser
├── services/
│   ├── marketDataService.ts                    # Calls /api/market/ohlcv with graceful offline historical dataset fallback
│   └── backtestService.ts                      # Save/load backtest sessions & trades (Supabase RLS + LocalStorage fallback)
├── components/
│   ├── auth/
│   │   ├── RouteGuards.tsx                     # RequireAuth, AdminRoute, LearnerRoute
│   │   └── UserAccountMenu.tsx                 # Avatar, role badge, Sign Out, Switch View (admin only)
│   ├── layout/
│   │   ├── AppShell.tsx                        # Updated: Learner-only nav (zero Admin link for learners) + UserAccountMenu
│   │   └── AdminShell.tsx                      # Dedicated Admin Portal shell separated from Learner View
│   ├── backtest/
│   │   ├── AssetSelectorBar.tsx                # Crypto / Forex / Indices / Stocks / Commodities + timeframe + CSV upload
│   │   ├── BacktestChartCanvas.tsx             # lightweight-charts candlestick replay + live Entry/SL/TP price lines & trade markers
│   │   ├── OrderTicketPanel.tsx                # 1R risk sizing, Long/Short execution, SL/TP inputs, Breakeven & Close controls
│   │   ├── ReplayControlsBar.tsx               # Step +1, Play/Pause, Speed (1x/2x/5x), Replay Start slider, Reset
│   │   └── BacktestMetricsPanel.tsx            # Win Rate, Profit Factor, Max DD, Avg R, Equity Curve & Trade Journal
│   └── admin/
│       └── AdminQuotesManager.tsx              # Admin CRUD for curated public quotes
└── pages/
    ├── LoginPage.tsx                           # Institutional Auth Panel with "Continue with Google (Gmail)" + Email/Password + Local Preview switcher
    ├── AuthCallbackPage.tsx                    # OAuth PKCE handler -> role-based redirect (/admin vs /)
    ├── BacktestPage.tsx                        # Full Multi-Asset Market Backtester workspace
    ├── AdminDashboardPage.tsx                  # Dedicated Admin Portal landing page (/admin)
    └── AdminQuotesPage.tsx                     # Admin quotes curation page (/admin/quotes)
```

---

## 4. Task Breakdown (Phase 2 — After Approval)

| ID | Task | Agent | Skills | Deps | INPUT -> OUTPUT -> VERIFY |
|---|---|---|---|---|---|
| **B1** | Create migration `003_backtesting_and_auth_profiles.sql` + `src/types/auth.ts` + `src/types/backtest.ts` + offline historical multi-asset fallback candles | `database-architect` | `database-design` | Approval | Schema spec -> SQL migration + RLS + TS types -> `schema_validator.py` & `tsc --noEmit` pass |
| **B2** | Extend `api/_lib/urlSecurity.ts` allowlist & build `/api/market/ohlcv.ts` + `src/lib/backtestEngine.ts` + `marketDataService.ts` + `backtestService.ts` | `backend-specialist`, `security-auditor` | `api-patterns`, `vulnerability-scanner` | B1 | Market proxy spec -> Live Binance/TwelveData/Yahoo OHLCV proxy + pure backtest engine + dual-mode persistence -> Unit tests verify conservative SL/TP fills, 1R math, CSV import & SSRF allowlist |
| **B3** | Build `AuthContext.tsx`, `LoginPage.tsx` (Google/Gmail OAuth + Email/Password), `AuthCallbackPage.tsx`, `RouteGuards.tsx`, `AdminShell.tsx`, update `AppShell.tsx` & `App.tsx` for strict role-separated views | `frontend-specialist` | `frontend-design`, `frontend-architecture` | B1 | Auth & role spec -> Separate Learner vs Admin post-login shells -> Verify learner cannot see or open `/admin/*`, admin lands on `/admin` with Switch to Learner toggle |
| **B4** | Build Multi-Asset Backtester UI (`BacktestPage`, `AssetSelectorBar`, `BacktestChartCanvas`, `OrderTicketPanel`, `ReplayControlsBar`, `BacktestMetricsPanel`) + `AdminDashboardPage` + `AdminQuotesPage` | `frontend-specialist` | `frontend-design`, `tailwind-patterns` | B2, B3 | Backtest engine + market service -> Interactive multi-asset bar-replay backtester & equity curve -> Place Long/Short trades on BTC/EURUSD/NAS100/AAPL, step candles, save session |
| **B5** | Write Vitest tests for Backtest Engine, Market Proxy security, Role Route Guards (Admin vs Learner separation), Login UI, and run full Phase X verification suite | `test-engineer` | `testing-patterns`, `lint-and-validate` | B2–B4 | New modules -> Vitest tests + `security_scan.py` + `accessibility_checker.py` + `npm run build` -> All tests & checks pass with 0 errors |

---

## 5. Supabase Google (Gmail) & Admin Setup Steps (Ready for Your Supabase Project)

1. In **Supabase Dashboard -> Authentication -> Providers -> Google**, enable Google and paste your Google Cloud OAuth Client ID & Secret.
2. Add your Redirect URLs in **Authentication -> URL Configuration**:
   - `http://localhost:5173/auth/callback`
   - `https://<your-vercel-domain>/auth/callback`
3. Run migrations `001`, `002`, and `003` in Supabase SQL Editor.
4. Sign in once using your Gmail account, then promote yourself to Admin in Supabase SQL Editor:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-gmail@gmail.com';
   ```
5. Refresh or sign in again — you will automatically land in the **Admin Portal (`/admin`)** while all other Gmail sign-ins land in the **Learner Workspace (`/`)**.

---

## 6. Done When (Acceptance Criteria)
- [x] Users can backtest **Crypto, Forex, Indices, Stocks, and Gold/Commodities** with live/historical candles (plus CSV upload & offline fallback), bar-by-bar replay, Long/Short orders, SL/TP auto-execution, 1R sizing, Equity Curve, and saved sessions.
- [x] Users can sign in via **Google (Gmail) OAuth** (or Email/Password) through a dedicated Auth Panel (`/login` + `/auth/callback`).
- [x] Admin promotion works cleanly in Supabase (`profiles.role = 'admin'`) without client-side privilege escalation.
- [x] **Admin View (`/admin`, `AdminShell`)** and **Learner View (`/`, `AppShell`)** are strictly separated upon login; learners never see or access `/admin/*`, while admins land in `/admin` with an optional "Switch to Learner View" toggle.
- [x] All Vitest tests, ESLint, TypeScript, Security Scan, Accessibility Check, and production build pass with 0 errors.

---

## ✅ PHASE X COMPLETE
- **Security Scan (`security_scan.py`):** ✅ Pass (`[OK] SECURE`, 0 findings)
- **Accessibility (`accessibility_checker.py`):** ✅ Pass (45 files checked, 0 issues)
- **Lint (`npm run lint`):** ✅ Pass (0 errors, 0 warnings)
- **Typecheck (`npx tsc --noEmit`):** ✅ Pass (0 errors)
- **Tests (`npm test`):** ✅ Pass (7/7 test files, 60/60 tests passed)
- **Build (`npm run build`):** ✅ Success (`dist/` built cleanly)
- **Date:** 2026-11-27
