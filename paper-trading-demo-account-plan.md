# Implementation Plan: Paper Trading (Multi-Wallet Demo), Bespoke Editorial Theme, Compact Beginner UI, Taglish & Full Acronyms

> **Status:** Approved & Active (Phase 2 — Multi-Agent Orchestration)  
> **Project:** TradeLab Academy  
> **Project Type:** WEB (`React + TypeScript + Vite + Tailwind CSS + TradingView lightweight-charts + Supabase RLS + Vercel Serverless`)  
> **Route:** `/paper-trading` + App-Wide Design, Typography, Compact UI, Taglish & Acronym Upgrade

---

## 1. User Decisions & Expanded Scope

1. **Separate Demo Wallets:** Users can manage **multiple separate demo accounts/wallets** (e.g., `Crypto Demo`, `Forex Demo`, `Indices Demo`, `Stocks Demo`, `All-Markets Demo`), switch between them cleanly, create new wallets with custom starting balance & market focus, reset any wallet, or **delete any demo wallet at will** (with confirmation modal; if all wallets are deleted, show a crisp empty state with a 1-click "Create Demo Wallet" button).
2. **Realistic Fee & Spread Simulation:** Built into the deterministic paper trading engine with asset-class defaults (e.g., Crypto `0.05%` fee + `0.02%` spread, Forex/Indices/Stocks/Commodities tight realistic spreads & commissions), transparently showing Gross P&L, Fee, Spread Cost, and Net P&L — plus a per-wallet toggle if a learner wants to compare clean vs. realistic fills.
3. **Bespoke Non-AI-Generic Color Way + Eye-Friendly Typography:**
   - Replace generic cold blue-slate dark mode (`#0b0f17` / `#111722`) and `Inter` with a **Warm Editorial Trading Desk** aesthetic:
     - **Typography:** `Plus Jakarta Sans` (soft, open, low-fatigue body & headings) + `IBM Plex Mono` (crisp tabular numbers & prices).
     - **Dark Mode ("Warm Espresso Obsidian"):** Canvas `#131110`, Surface `#1B1917`, Elevated `#24211E`, Border `#312D28`, Ink `#F4EFEA`, Muted `#A89F94`.
     - **Light Mode ("Warm Archival Ivory"):** Canvas `#F6F3EC`, Surface `#FCFBF8`, Elevated `#EFEAE0`, Border `#DFD8CC`, Ink `#1F1B17`, Muted `#6A6156`.
     - **Signature Accents (Zero Purple/Violet):** Warm Terracotta / Copper (`#D97736` / `#B95B1F`) + Sage Jade (`#2E9E75` / `#1D7C59` for Bull/Profit) + Coral Clay (`#D85A52` / `#BF3F37` for Bear/Loss) + Warm Ochre (`#D69B38` / `#B0781B`).
4. **Simpler, Compact, Low-Overwhelm UI & Shorter Plain Wording:**
   - Tighten padding, shorten verbose paragraphs into crisp 1–2 line scannable points, and collapse secondary details behind lightweight toggles across Dashboard, Academy, Lesson windows, Interactive Diagrams, and Paper Trading.
5. **App-Wide EN / Taglish Toggle:**
   - Persistent `EN | Taglish` switcher in the top bar (and mobile nav) powered by `LanguageContext` + `taglishTranslations.ts`, translating UI labels, navigation, lesson summaries, beginner FAQs, diagram captions, paper trading controls, and mindset quotes.
6. **Full Acronym Expansion Everywhere:**
   - Dedicated `acronymHelper.ts` + UI updates so every trading acronym always shows its full name on screen — e.g., `BOS (Break of Structure)`, `CHoCH (Change of Character)`, `FVG (Fair Value Gap)`, `OB (Order Block)`, `SMC (Smart Money Concepts)`, `SL (Stop Loss)`, `TP (Take Profit)`, `RR (Risk-to-Reward Ratio)`, `P&L (Profit & Loss)`, `FOMO (Fear of Missing Out)`, `HTF (Higher Timeframe)`, `LTF (Lower Timeframe)`, `OHLC (Open, High, Low, Close)`.

---

## 2. Database Schema (`supabase/migrations/007_paper_trading_demo_account.sql`)

All 3 tables are **100% idempotent** (`CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`, `DROP TRIGGER IF EXISTS`) with strict private RLS (`auth.uid() = user_id`), supporting multiple wallets per user and clean `ON DELETE CASCADE` wallet deletion:

1. **`public.user_paper_accounts`**
   - `id` (UUID PK), `user_id` (UUID FK -> `auth.users`), `account_name` (TEXT), `market_focus` (`'all'|'crypto'|'forex'|'indices'|'stocks'|'commodities'`), `starting_balance` (NUMERIC > 0), `cash_balance` (NUMERIC), `daily_loss_limit_pct` (NUMERIC default `3`), `max_risk_per_trade_pct` (NUMERIC default `1`), `simulate_fees_spread` (BOOLEAN default `true`), `fee_rate_bps` (NUMERIC default `5`), `spread_bps` (NUMERIC default `2`), `reset_count` (INT default `0`), `created_at`, `updated_at`.
   - Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` RLS policies scoped to `auth.uid() = user_id`.
2. **`public.user_paper_positions`**
   - `id` (UUID PK), `account_id` (UUID FK -> `user_paper_accounts` ON DELETE CASCADE), `user_id` (UUID FK -> `auth.users`), `symbol`, `asset_class`, `direction`, `order_type`, `status`, `entry_price`, `stop_loss`, `take_profit`, `units`, `risk_amount`, `entry_fee`, `entry_spread_cost`, `setup_tag`, `moved_to_breakeven`, `opened_at`, `created_at`, `updated_at`.
3. **`public.user_paper_trades`**
   - `id` (UUID PK), `account_id` (UUID FK -> `user_paper_accounts` ON DELETE CASCADE), `user_id` (UUID FK -> `auth.users`), `symbol`, `asset_class`, `direction`, `entry_price`, `exit_price`, `stop_loss`, `take_profit`, `units`, `risk_amount`, `gross_pnl`, `fee_amount`, `spread_cost`, `pnl_amount`, `r_multiple`, `outcome`, `exit_reason`, `setup_tag`, `synced_to_journal`, `opened_at`, `closed_at`.

---

## 3. Planned File Changes & Additions

```text
supabase/migrations/
└── 007_paper_trading_demo_account.sql

index.html                                      # Plus Jakarta Sans + IBM Plex Mono + warm theme-color
tailwind.config.ts                              # Warm typography + bespoke accent/bull/bear tokens
src/index.css                                   # Warm Espresso Obsidian (dark) & Warm Ivory Paper (light)
public/manifest.webmanifest                     # Updated warm theme colors

src/
├── context/
│   └── LanguageContext.tsx                     # Persistent EN / Taglish language state & helper hook
├── data/
│   └── taglishTranslations.ts                  # Concise EN/Taglish UI dictionary + 18 lesson Taglish summaries
├── lib/
│   ├── acronymHelper.ts                        # Acronym expansion utility (e.g. BOS (Break of Structure))
│   └── paperTradingEngine.ts                   # Pure deterministic engine with realistic fee & spread simulation
├── types/
│   └── paper-trading.ts                        # Multi-wallet account, position, trade & fee/spread types
├── services/
│   └── paperTradingService.ts                  # Dual-mode Supabase + LocalStorage multi-wallet CRUD, delete, live quotes & Journal sync
├── components/
│   ├── charts/InteractiveCandleChart.tsx       # Warm bespoke candle & canvas colors
│   ├── layout/AppShell.tsx                     # EN/Taglish switcher, Paper Trading nav, warm accents, compact sidebar
│   ├── visual-learning/
│   │   ├── VisualExplanationsSection.tsx       # Compact tabs, Taglish summaries/FAQs, expanded acronyms
│   │   └── ConceptDiagramSvg.tsx               # Compact visual frame + warm colors + expanded acronyms
│   └── paper-trading/
│       ├── DemoAccountHeader.tsx               # Multi-wallet tabs, Create Wallet modal, Reset & Delete Wallet modals, Fee/Spread toggle
│       ├── PaperOrderTicket.tsx                # Compact Market/Limit ticket with Fee/Spread preview & plain EN/Taglish labels
│       └── PaperPositionsPanel.tsx             # Live floating P&L, Breakeven, Close, Pending Limits & Closed Trades + Log to Journal
└── pages/
    ├── PaperTradingPage.tsx                    # Lazy-loaded /paper-trading workspace
    ├── DashboardPage.tsx                       # Compact hero, Paper Trading card, EN/Taglish, expanded acronyms
    ├── AcademyCatalogPage.tsx                  # Compact stage cards, EN/Taglish, expanded acronyms
    └── LessonPage.tsx                          # Compact header & tabs, EN/Taglish, expanded acronyms
```

---

## 4. Task Breakdown (Phase 2 — Multi-Agent Orchestration)

| ID | Wave | Task | Agent | Skills | INPUT -> OUTPUT -> VERIFY |
|---|---|---|---|---|---|
| **P1** | Wave 1 | Migration `007_paper_trading_demo_account.sql` (multi-wallet + delete cascade + fee/spread), `src/types/paper-trading.ts`, `src/lib/acronymHelper.ts` | `database-architect` | `database-design`, `clean-code` | Schema spec -> Idempotent SQL + TS types + Acronym helper -> `tsc --noEmit` passes |
| **P2** | Wave 1 | `src/lib/paperTradingEngine.ts` (fee/spread simulation, Market/Limit fills, floating P&L), `src/services/paperTradingService.ts` (multi-wallet CRUD + delete + live quotes + Journal sync), `src/context/LanguageContext.tsx`, `src/data/taglishTranslations.ts` | `backend-specialist` | `clean-code`, `api-patterns` | Types & rules -> Pure engine + dual-mode service + Taglish context -> Unit tests verify fee/spread math, wallet delete & Taglish |
| **P3** | Wave 1 | Warm Editorial Theme & Eye-Friendly Typography (`index.html`, `src/index.css`, `tailwind.config.ts`, `InteractiveCandleChart.tsx`, `public/manifest.webmanifest`) | `frontend-specialist` | `frontend-design`, `tailwind-patterns` | Design tokens -> Zero generic blue-slate, zero purple, warm high-readability palette & fonts -> Build + WCAG contrast pass |
| **P4** | Wave 2 | Paper Trading UI (`DemoAccountHeader`, `PaperOrderTicket`, `PaperPositionsPanel`, `PaperTradingPage`) with multi-wallet creation/deletion, fee/spread breakdown, EN/Taglish, expanded acronyms | `frontend-specialist` | `frontend-design`, `tailwind-patterns` | Service & engine -> Compact beginner-friendly `/paper-trading` workspace -> Zero TS/ESLint/WCAG issues |
| **P5** | Wave 2 | App-Wide EN/Taglish Switcher, Compact Learning Windows & Full Acronym Expansion (`App.tsx`, `AppShell.tsx`, `DashboardPage.tsx`, `LessonPage.tsx`, `VisualExplanationsSection.tsx`, `AcademyCatalogPage.tsx`, `ConceptDiagramSvg.tsx`) | `frontend-specialist` | `frontend-design`, `clean-code` | LanguageContext + AcronymHelper -> Compact scannable UI with EN/Taglish & expanded acronyms everywhere -> Zero TS/ESLint/WCAG issues |
| **P6** | Wave 3 | Write `src/__tests__/paperTrading.test.tsx` (multi-wallet create/delete, realistic fee/spread fills, SL-first auto-close, Journal sync, Taglish toggle, acronym expansion) + Full Phase X verification (`npm test`, `npm run lint`, `npm run build`, `security_scan.py`, `lint_runner.py`, `accessibility_checker.py`) | `test-engineer` | `testing-patterns`, `lint-and-validate` | All modules -> Complete test suite + verification scripts -> 100% pass |

---

## 5. Done When (Acceptance Criteria)
- [x] Separate demo wallets supported (e.g., Crypto Demo, Forex Demo, custom wallets) with full create, switch, reset, and **delete at will** (including clean empty state).
- [x] Realistic fee & spread simulation active and transparently displayed in order preview, floating P&L, and closed trade records (toggleable per wallet).
- [x] Bespoke warm non-AI-generic colorway (Espresso Obsidian dark / Archival Ivory light + Warm Terracotta & Sage Jade accents; zero purple/violet) + eye-friendly `Plus Jakarta Sans` & `IBM Plex Mono` typography.
- [x] Simpler, compact, low-overwhelm UI windows with shorter, clearer wording across Dashboard, Academy, Lessons, Diagrams, and Paper Trading.
- [x] Persistent **EN / Taglish** toggle translates navigation, key UI, lesson summaries, beginner FAQs, diagrams, and Paper Trading controls cleanly.
- [x] All trading acronyms display with full names (e.g., `BOS (Break of Structure)`, `CHoCH (Change of Character)`, `FVG (Fair Value Gap)`, `SL (Stop Loss)`, `TP (Take Profit)`, `RR (Risk-to-Reward Ratio)`).
- [x] All Vitest tests, ESLint, TypeScript, Security Scan, Accessibility Check, and code-split production build pass with 0 errors.

---

## ✅ PHASE X COMPLETE
- Tests (`npm test`): ✅ 9/9 test files, 94/94 tests passed
- Lint (`npm run lint` + `lint_runner.py`): ✅ 0 errors, 0 warnings
- Build (`npm run build`): ✅ Success (0 errors, 0 chunk warnings)
- Accessibility (`accessibility_checker.py`): ✅ 57 files checked, 0 WCAG issues
- Security (`security_scan.py`): ✅ 0 tracked code/config/dependency/secret findings
- Purple Ban: ✅ 0 occurrences across `src/` and `index.html`
- Date: 2026-11-27
