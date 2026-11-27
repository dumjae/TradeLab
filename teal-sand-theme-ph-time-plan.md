# Implementation Plan: "Deep Teal + Sand" Colorway & Philippine Time (PHT) for All Market Times

> **Status:** Approved by user choices (Phase 2 — Orchestration)  
> **Project:** TradeLab Academy · **Type:** WEB (React + TypeScript + Vite + Tailwind)

## 1. Decisions
1. **Colorway: Deep Teal + Sand** (replaces warm espresso + terracotta). Zero purple/violet/indigo/fuchsia.
2. **Times: PH time only, auto-adjusts for US daylight saving.** NY times become PH times everywhere (lessons, diagrams, Taglish, charts, cheat-cards). Computed with `Intl` (`America/New_York` → `Asia/Manila`) for today's date:
   - US standard time (Nov–Mar): PH = NY **+13h** (NY 9:30 AM open = **10:30 PM PH**)
   - US daylight time (Mar–Nov): PH = NY **+12h** (NY 9:30 AM open = **9:30 PM PH**)

## 2. Palette Tokens (WCAG AA verified by contrast check)

| Token | Dark ("Deep Sea Teal") | Light ("Soft Sand") |
|---|---|---|
| `--tl-bg` | `#0d1a1c` | `#f3ece0` |
| `--tl-surface` | `#132426` | `#fbf7ef` |
| `--tl-elevated` | `#1b3033` | `#ebe2d2` |
| `--tl-border` | `#26413f` | `#d9cdb8` |
| `--tl-text` | `#ecf1ec` | `#14282a` |
| `--tl-muted` | `#8fa7a3` | `#4f6465` |
| `--tl-brand` (coral-orange) | `#ff8a5c` | `#c4461d` |
| `--tl-brand-soft` | `rgba(255,138,92,0.15)` | `rgba(196,70,29,0.12)` |
| `--tl-brand-fg` | `#0d1a1c` | `#ffffff` |
| bull (mint) | `#3ecf9a` | `#14805e` |
| bear (rose) | `#f2677a` | `#c23a55` |
| wisdom gold | `#e5b567` | `#9a6a12` |
| info teal-sky | `#6cc4d6` | `#1c7a8c` |

Old → new hex remap (dark values): `#131110→#0d1a1c`, `#1b1917→#132426`, `#25221f→#1b3033`, `#332e29→#26413f`, `#f3efe9→#ecf1ec`, `#a89f94→#8fa7a3`, `#dd7d3e→#ff8a5c`, `#2e9e75→#3ecf9a`, `#d85a52→#f2677a`, `#d69b38→#e5b567`; light chart `#fcfbf8→#fbf7ef`, `#1d7c59→#14805e`, `#bf3f37→#c23a55`, `#dfd8cc→#d9cdb8`, `#6a6156→#4f6465`. Generic leftovers: `#10b981→#3ecf9a`, `#ef4444→#f2677a`, `#f59e0b→#e5b567`, `#38bdf8→#6cc4d6`.

## 3. PH Time Design
- New `src/lib/marketTime.ts` (pure, DST-aware, no hardcoded offsets): `getNyToPhShiftHours(date?)`, `convertNyClockToPh(...)`, `localizeMarketTimes(text, date?)`, `getMarketSessionsInPh(date?)` (Tokyo, London, New York open/close, US stock hours).
- `localizeMarketTimes` converts only **NY-tagged** times (`ET`, `EST`, `EDT`, `NY`, `New York time`, `New York Open`), including ranges (`2:00 AM–5:00 AM New York time`, `9:30–11:00 AM ET`, `7 PM – 2 AM NY`). Generic clock examples (e.g. "a 15m candle at 9:00 AM") stay untouched.
- Applied **once at data assembly** (lessons, Taglish, chart scenario text) so every consumer (UI, search, AI mentor grounding) is consistent, plus the hardcoded strings inside diagrams and cheat-cards.
- Charts show the time axis and crosshair in **PH time** (`Asia/Manila`) with a small `PH Time` tag.
- New Dashboard **Market Hours (PH Time)** card: Tokyo / London / New York / US stocks, with "Open now" dot, auto DST.

## 4. Task Breakdown

| Wave | Agent | Files | Verify |
|---|---|---|---|
| 1 | `backend-specialist` | `src/lib/marketTime.ts` (new), `src/data/curriculum.ts` (deep-localize assembled lessons), `src/data/taglishTranslations.ts`, `src/data/chartScenarios.ts` text, `src/data/expandedLessons.ts` + `src/data/marketTrackLessons.ts` (tag untagged NY-context times with `ET`) | `tsc`, eslint, runtime check of conversions in EST and EDT |
| 1 | `frontend-specialist` (Theme) | `src/index.css`, `tailwind.config.ts`, `index.html`, `public/manifest.webmanifest`, `public/favicon.svg` (+PNG icons if feasible), `src/components/charts/InteractiveCandleChart.tsx` (palette + PH axis), `src/components/backtest/BacktestChartCanvas.tsx`, every other `src/**` hardcoded hex per remap (except ConceptDiagramSvg) | `tsc`, eslint, contrast check, 0 purple |
| 1 | `frontend-specialist` (Diagrams & strings) | `src/components/visual-learning/ConceptDiagramSvg.tsx` (hex remap + PH labels), `src/components/visual-learning/VisualExplanationsSection.tsx` (cheat-card PH strings) | `tsc`, eslint, 0 NY-time strings left |
| 2 | `frontend-specialist` | `src/components/dashboard/MarketHoursPhCard.tsx` (new), `src/pages/DashboardPage.tsx`, `src/components/layout/AppShell.tsx` (optional PH clock chip) | `tsc`, eslint, a11y |
| 3 | `test-engineer` | `src/__tests__/marketTime.test.ts` (EST + EDT conversions, ranges, no-touch of generic times), fix outdated assertions, full Phase X suite | all green |

## 5. Done When
- [x] App uses the Deep Teal + Sand palette in dark and light modes (no leftover espresso/terracotta hex, zero purple).
- [x] Every NY market time in lessons, diagrams, Taglish, cheat-cards shows as PH time, correct for the current US daylight-saving state.
- [x] Charts display PH time on the axis/crosshair.
- [x] Dashboard shows Market Hours in PH time.
- [x] Tests, lint, build, a11y, security, purple-ban all pass.

---

## ✅ PHASE X COMPLETE
- Tests (`npm test`): ✅ 11/11 test files, 109/109 tests passed
- Lint (`npm run lint` + `lint_runner.py`): ✅ 0 errors, 0 warnings
- Build (`npm run build`): ✅ Success (0 errors, 0 chunk warnings)
- Accessibility (`accessibility_checker.py`): ✅ 61 files checked, 0 issues
- Security (`security_scan.py`): ✅ 0 tracked code/config/dependency/secret findings
- Old-Palette Hex Scan: ✅ 0 matches across `src/` and `index.html`
- Purple Ban: ✅ 0 matches across `src/` and `index.html`
- Date: 2026-11-27
