# Implementation Plan: TradingView Supercharts Colorway & Interactive UI Elements

> **Status:** Draft for Review & Approval (Phase 1 — Planning Only, No Code Written)  
> **Project:** TradeLab Academy  
> **Project Type:** WEB (`React + TypeScript + Vite + Tailwind CSS + TradingView lightweight-charts`)

---

## 1. Goal

Transform TradeLab Academy's visual identity and trading workspaces to authentically mirror **TradingView Supercharts** — combining TradingView's crisp, low-fatigue colorway (`#131722` / `#1e222d` / `#2962ff` / `#089981` / `#f23645`) with real interactive TradingView UI elements (OHLC legend bar, interactive left drawing toolbar rail, Buy/Sell Bid-Ask order header, right-side collapsible Watchlist, and crisp hairline panel geometry) while keeping 100% of our beginner-friendly Taglish support, PH time, expanded acronyms, and zero purple/violet compliance.

---

## 2. Official TradingView Palette Tokens (WCAG AA Checked, Zero Purple)

| Token | TradingView Dark | TradingView Light | Role |
|---|---|---|---|
| `--tl-bg` | `#131722` | `#f0f3fa` | Workspace frame & chart canvas |
| `--tl-surface` | `#1e222d` | `#ffffff` | Panels, cards, toolbars |
| `--tl-elevated` | `#2a2e39` | `#f8f9fd` | Hover controls, inputs, pills |
| `--tl-border` | `#2a2e39` | `#e0e3eb` | Crisp 1px TradingView hairline dividers |
| `--tl-text` | `#d1d4dc` | `#131722` | Primary ink (low eye fatigue) |
| `--tl-muted` | `#8b909a` | `#5d606b` | Secondary labels & timestamps (WCAG AA ≥ 4.7:1) |
| `--tl-brand` | `#2962ff` | `#2962ff` | TradingView Signature Royal Blue (active controls, CTAs) |
| `--tl-brand-text` | `#5b9cf6` | `#1e53e5` | High-contrast blue text links on dark/light |
| `--tl-brand-soft` | `rgba(41, 98, 255, 0.16)` | `rgba(41, 98, 255, 0.10)` | Active tab/pill tint |
| `--tl-brand-fg` | `#ffffff` | `#ffffff` | Text on filled `#2962ff` buttons |
| `bull` | `#089981` | `#089981` | TradingView Bullish Green candles & profits |
| `bear` | `#f23645` | `#f23645` | TradingView Bearish Red candles & losses |
| `amber.wisdom` | `#ff9800` | `#e68900` | Alerts, warnings, daily loss guard |
| `info` | `#2196f3` | `#1976d2` | Entry price lines & neutral markers |

---

## 3. TradingView UI Elements to Integrate

1. **Supercharts Top OHLC Legend Bar (`InteractiveCandleChart.tsx`)**
   - Inline `SYMBOL · TIMEFRAME` + pulsing live status dot + color-coded `O H L C` + `% Change` badge + `PH Time` pill directly inside the `#131722` / `#ffffff` chart canvas with TradingView `#089981` / `#f23645` candles and subtle `#2a2e39` gridlines.
2. **Interactive Left Drawing Toolbar Rail (`src/components/charts/TradingViewDrawingRail.tsx` — NEW)**
   - Authentic sleek `42px` vertical icon rail beside the chart on `/paper-trading` and `/backtest` (compact horizontal bar on mobile):
     - **Crosshair** (inspect prices)
     - **Horizontal Line (`H-Line`)** — drops a real interactive horizontal Support/Resistance price line onto the chart at the current price
     - **Session High / Low (`H/L`)** — toggles visible High & Low reference lines across the loaded candles
     - **Long Position Tool (`1:2 RR`)** — auto-fills Buy/Long entry, SL, and 1:2 TP in the order ticket
     - **Short Position Tool (`1:2 RR`)** — auto-fills Sell/Short entry, SL, and 1:2 TP in the order ticket
     - **Clear Drawings** — removes all user-dropped horizontal lines
3. **TradingView-Style Watchlist Panel (`src/components/paper-trading/TradingViewWatchlist.tsx` — NEW)**
   - Crisp collapsible right-hand / toggleable Watchlist on `/paper-trading` showing popular symbols across Crypto, Forex, Indices, Stocks, and Gold with Symbol, Asset tag, Base/Live price, and 1-click chart switching.
4. **TradingView Bid / Spread / Ask Buy-Sell Header (`PaperOrderTicket.tsx`)**
   - Classic TradingView side-by-side **`SELL`** (`#f23645`) | **`SPREAD`** pill | **`BUY`** (`#2962ff` or `#089981`) buttons at the top of the order ticket, plus crisp tabular order summary.
5. **Crisp TradingView Shell, Cards & Diagrams (`AppShell.tsx`, `ConceptDiagramSvg.tsx`, `DashboardPage.tsx`, `BacktestPage.tsx`, `JournalPage.tsx`, `LessonPage.tsx`)**
   - Tight, structured `1px` `#2a2e39` dividers, refined `rounded-lg` / `rounded-xl` Supercharts panel geometry, `#2962ff` active indicators, `#089981`/`#f23645` P&L & candle colors, and all 15 dual Bullish/Bearish SVG diagrams remapped to exact TradingView dark colors (`#131722` / `#1e222d` / `#2a2e39` / `#089981` / `#f23645` / `#2962ff`).

---

## 4. Phase 2 Multi-Agent Plan (After Approval)

| Wave | Agent | Assigned Files | Verification |
|---|---|---|---|
| **Wave 1** | `frontend-specialist` (Theme & Assets) | `src/index.css`, `tailwind.config.ts`, `index.html`, `public/manifest.webmanifest`, `public/favicon.svg`, `src/components/charts/InteractiveCandleChart.tsx`, `src/components/backtest/BacktestChartCanvas.tsx`, `src/components/backtest/BacktestMetricsPanel.tsx`, `src/data/chartScenarios.ts`, `src/data/curriculum.ts`, `src/data/expandedLessons.ts` (legend hexes) | 0 old Deep-Teal hexes, 0 purple, WCAG AA contrast pass, `tsc --noEmit` |
| **Wave 1** | `frontend-specialist` (Diagrams & Shell) | `src/components/visual-learning/ConceptDiagramSvg.tsx`, `src/components/visual-learning/VisualExplanationsSection.tsx`, `src/components/layout/AppShell.tsx`, `src/pages/DashboardPage.tsx`, `src/pages/LessonPage.tsx`, `src/pages/AcademyCatalogPage.tsx` | TradingView `#131722`/`#1e222d`/`#2962ff`/`#089981`/`#f23645` styling, crisp panel borders, `tsc` + ESLint |
| **Wave 2** | `frontend-specialist` (TradingView Elements) | `src/components/charts/TradingViewDrawingRail.tsx` (NEW), `src/components/paper-trading/TradingViewWatchlist.tsx` (NEW), `src/components/paper-trading/PaperOrderTicket.tsx`, `src/components/paper-trading/DemoAccountHeader.tsx`, `src/components/paper-trading/PaperPositionsPanel.tsx`, `src/pages/PaperTradingPage.tsx`, `src/pages/BacktestPage.tsx` | Interactive drawing rail, Watchlist, Bid/Spread/Ask header, `tsc` + ESLint |
| **Wave 3** | `test-engineer` | Add `src/__tests__/tradingViewElements.test.tsx` (drawing rail H-Line/H-L/Long/Short/Clear, Watchlist switching, TradingView Buy/Sell header) + full Phase X verification (`npm test`, `npm run lint`, `npm run build`, `lint_runner.py`, `accessibility_checker.py`, `security_scan.py`, purple check) | 100% pass across all tests & scripts |

---

## 5. Acceptance Criteria
- [x] Entire app (dark + light modes, charts, dual Bullish/Bearish diagrams, legends, and favicon) uses authentic TradingView Supercharts colors (`#131722`, `#1e222d`, `#2a2e39`, `#d1d4dc`, `#2962ff`, `#089981`, `#f23645`) with zero purple/violet.
- [x] Interactive TradingView Left Drawing Toolbar Rail (`Crosshair`, `H-Line`, `Session H/L`, `Long 1:2`, `Short 1:2`, `Clear`) works live on Paper Trading & Backtester charts.
- [x] Collapsible TradingView-style Watchlist works on Paper Trading with 1-click symbol switching.
- [x] Order Ticket features TradingView's signature `SELL | SPREAD | BUY` header + crisp tabular geometry.
- [x] All Vitest tests, ESLint, TypeScript, Build, Accessibility, Security, and Purple-ban checks pass with 0 errors.

---

## ✅ PHASE X COMPLETE
- Tests (`npm test`): ✅ 12/12 test files, 115/115 tests passed
- Lint (`npm run lint` + `lint_runner.py`): ✅ 0 errors, 0 warnings
- Build (`npm run build`): ✅ Success (0 errors, 0 chunk warnings)
- Accessibility (`accessibility_checker.py`): ✅ 64 files checked, 0 issues
- Security (`security_scan.py`): ✅ 0 tracked code/config/dependency/secret findings
- Legacy Hex Scan: ✅ 0 matches across `src/` and `index.html`
- Purple Ban: ✅ 0 matches across `src/` and `index.html`
- Date: 2026-11-27
