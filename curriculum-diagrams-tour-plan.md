# Implementation Plan: Unbiased Multi-Market Curriculum, Chart Fundamentals First, Dual Bullish/Bearish Diagrams & Interactive Webapp Tutorial

> **Status:** Active (Execution)  
> **Project:** TradeLab Academy  
> **Project Type:** WEB (`React + TypeScript + Vite + Tailwind CSS + TradingView lightweight-charts + Supabase RLS`)

---

## 1. User Goals & Requirements
1. **Chart Fundamentals FIRST (`Lesson 01` before Candlesticks):** Teach absolute beginners how to read a chart BEFORE candlestick anatomy — what `5m`, `15m`, `1H`, `4H`, `1D` timeframes mean, X-axis Time vs. Y-axis Price, candle countdown timer, Volume, Bid/Ask spread, crosshair, watchlist, and essential chart tools.
2. **Unbiased Universal General Track + Separate Balanced Market Tracks:**
   - **Universal Core Track (`general` — 15 lessons):** Unbiased concepts applicable to ALL platforms (Crypto, Stocks, Forex, Indices) with balanced cross-market examples.
   - **Dedicated Market Tracks (Equal 3-Lesson Lists Per Market = 12 Market Lessons, 27 Total):**
     - **Crypto (3):** Spot vs. Perps & Order Books; 24/7 Liquidity, Funding & BTC Dominance; Volatility Sizing, Liquidations & Altcoin Cycles.
     - **Forex (3):** Currency Pairs, Pips, Lot Sizes & Spreads; Trading Sessions & London/NY Killzones; Macro Catalysts (Central Banks, CPI/NFP & Interest Rates).
     - **Stocks (3):** Market Hours, Pre-Market, Volume & Order Types; Opening Range Breakout (ORB), Gaps & RVOL; Earnings Catalysts & Relative Strength.
     - **Indices (3):** NAS100, SPX500 & US30 Basics & Point Values; NY Cash Open Volatility & Reversals; Intermarket Flows (Yields, DXY, VIX & Risk-On/Risk-Off).
   - **Top-Teacher Live-Verified Videos + Dedicated Historical Charts** for EVERY single lesson (`27/27` charts, `2+` live-verified YouTube videos per lesson via YouTube oEmbed API) + idempotent SQL migration `008_balanced_curriculum_and_videos.sql`.
3. **Distinct Text Tab vs. Diagram Tab:**
   - **Text Tab:** Removes duplicate full SVG diagram and shows a distinct compact **Quick Blueprint Card** (Core Rule + Bullish vs. Bearish At-a-Glance Comparison + Plain EN/Taglish Summary + Collapsible Breakdown + FAQs + CTA to Diagram Lab).
   - **Diagram Tab:** Dedicated **Interactive Bullish & Bearish Visual Blueprint Lab**.
4. **Bullish AND Bearish Diagrams for EVERY Lesson:**
   - Upgrade `ConceptDiagramSvg.tsx` with a **`Both (Bullish + Bearish)` | `Bullish (Up)` | `Bearish (Down)`** toggle (defaulting to **`Both`**) rendering true Bullish AND true Bearish mirror SVG diagrams for ALL 15 diagram kinds (`chart_fundamentals` + all 14 existing kinds).
5. **Interactive Step-by-Step Webapp Tutorial ("How to Use TradeLab Academy"):**
   - Clean `AppWalkthroughModal.tsx` (6 guided steps with EN/Taglish support, progress dots, and 1-click `"Try It Now →"` route jumps) accessible from the top bar `? Guide` button and Dashboard hero.

---

## 2. Planned File Structure & Agents

| Wave | Agent | Assigned Files | Verification |
|---|---|---|---|
| **Wave 1** | `database-architect` | `src/types/academy.ts` (add `'chart_fundamentals'` DiagramKind), `src/data/marketTrackLessons.ts` (new file with Lesson 01 Chart Fundamentals + 8 new dedicated market lessons = 9 new lessons), `src/data/curriculum.ts` & `src/data/expandedLessons.ts` (re-ordered 01–27, unbiased Core examples), `src/data/verifiedVideos.ts`, `supabase/migrations/008_balanced_curriculum_and_videos.sql` | 27/27 lessons, 100% live-verified oEmbed videos, `schema_validator.py`, `tsc --noEmit` |
| **Wave 1** | `backend-specialist` | `src/data/chartScenarios.ts` (9 new OHLCV scenarios = 30 total, 27/27 lesson chart coverage), `src/data/taglishTranslations.ts` (Taglish summaries & FAQs for all 9 new lessons + walkthrough tour strings) | 27/27 lesson charts & Taglish coverage, `tsc --noEmit` |
| **Wave 2** | `frontend-specialist` (Diagrams & Distinct Tabs) | `src/components/visual-learning/ConceptDiagramSvg.tsx` (new `chart_fundamentals` SVG + true Bullish & Bearish mirror SVGs for ALL 15 diagram kinds with `Both / Bullish / Bearish` switcher), `src/components/visual-learning/VisualExplanationsSection.tsx` (distinct Text Cheat-Card vs. Diagram Bullish/Bearish Lab) | Zero duplicate diagrams, Bullish+Bearish on all lessons, 0 purple, 0 WCAG issues |
| **Wave 2** | `frontend-specialist` (Separate Market Tracks & App Tour) | `src/components/learning/AppWalkthroughModal.tsx` (NEW 6-step EN/Taglish interactive webapp tutorial), `src/components/layout/AppShell.tsx` (`? Guide` tour trigger + clean General vs. Market grouping), `src/pages/AcademyCatalogPage.tsx` (distinct **Universal Core Track** vs. **Separate Market Tracks** cards/tabs), `src/pages/DashboardPage.tsx` (Lesson 01 Chart Fundamentals starter + "1-Min App Tour" CTA) | Clean unbiased UX, EN/Taglish tour works, 0 WCAG issues |
| **Wave 3** | `test-engineer` | `src/__tests__/curriculumAndTour.test.tsx` + update any lesson-count assertions if needed + full Phase X verification (`npm test`, `npm run lint`, `npm run build`, `security_scan.py`, `lint_runner.py`, `accessibility_checker.py`, purple check) | 100% pass across all tests & scripts |

---

## 3. Acceptance Criteria
- [ ] Lesson 01 teaches **Chart Reading Fundamentals** (5m, 15m, 1H, 4H, 1D timeframes, axes, volume, spread, chart tools) BEFORE Lesson 02 Candlestick Anatomy.
- [ ] General Knowledge track (15 lessons) is unbiased across all markets, and each market (`Crypto`, `Forex`, `Stocks`, `Indices`) has its own separate dedicated 3-lesson track (`27` lessons total).
- [ ] Every single lesson (`27/27`) has live-verified top-teacher YouTube videos, a dedicated Historical Chart scenario, and Taglish translation.
- [ ] Text tab and Diagram tab render clearly different visual content (zero duplicated diagram).
- [ ] Every lesson displays BOTH Bullish and Bearish diagrams cleanly.
- [ ] Step-by-step interactive Webapp Tutorial is accessible from the header and Dashboard in both EN and Taglish.
- [ ] All Vitest tests, ESLint, TypeScript, Build, Accessibility, Security, and Purple-ban checks pass cleanly.
