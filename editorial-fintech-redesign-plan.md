# Implementation Plan: TradeLab Academy — Editorial Fintech UI/UX Redesign & Responsive Refinement

> **Status:** Active Execution (Phase 1 Audit Complete → Phase 2 Design System Complete → Phase 3 Multi-Agent Implementation)  
> **Source of Truth:** [DESIGN.md](file:///c:/Users/Byron%20Dumaya/Downloads/TradeLab/DESIGN.md)  
> **Project Type:** WEB (`React 18 + TypeScript + Vite + Tailwind CSS + lightweight-charts + Supabase`)

---

## Phase 1 Audit Findings (Codebase + Deployed Note)
- **Live Browser Note:** Chrome remote debugging (`DevToolsActivePort`) was unavailable on the host machine; full audit performed directly across all `17` pages, `35` components, CSS tokens, and routing.
- **Identified "AI-SaaS Template" Anti-Patterns to Eliminate:**
  1. **Generic Left Sidebar (`AppShell.tsx`):** Heavy `256px` left icon-and-link sidebar + cluttered 7-pill top bar eats horizontal reading space and looks like a standard admin dashboard.
  2. **Template Login Box (`LoginPage.tsx` & `AuthCallbackPage.tsx`):** Isolated centered `rounded-3xl` box with leftover `emerald-500` classes, no focal TradeLab editorial identity, and raw SQL setup box stacked directly underneath.
  3. **Card-Inside-Card Dashboard (`DashboardPage.tsx`):** 8 stacked bordered cards with mixed rainbow pill borders (`sky`, `amber`, `teal`, `rose`, `brand`) repeating the same boxed layout everywhere.
  4. **Competing Right Rail in Lesson Reader (`LessonPage.tsx`):** Permanent right sidebar competes visually with lesson content instead of giving readers an unobstructed `65ch–72ch` publication column with an on-demand Mentor drawer.
  5. **Over-Boxed Secondary Pages & Inconsistent Radii:** Mix of `rounded-3xl`, `rounded-2xl`, `rounded-full` pill clutter, and scattered `emerald-*` / `sky-*` accents instead of one cohesive TradingView-calibrated editorial system.
  6. **Leftover Untranslated Time String:** `AcademyCatalogPage.tsx` line 190 (`9:30 AM NY Open`) still needs `localizeMarketTimes` for PH time consistency.

---

## Phase 3–5 Multi-Agent Execution Plan

| Wave | Agent | Assigned Files | Key Deliverables & Verify |
|---|---|---|---|
| **Wave 1** | `frontend-specialist` (System, Motion & Auth) | `src/index.css`, `tailwind.config.ts`, `index.html`, `src/pages/LoginPage.tsx`, `src/pages/AuthCallbackPage.tsx`, `src/components/layout/ErrorBoundary.tsx` | Editorial Fintech tokens (`DESIGN.md`), pure-CSS minimalist animation utilities (`prefers-reduced-motion` safe), asymmetric editorial Login Folio + refined Auth Callback |
| **Wave 1** | `frontend-specialist` (Navigation Shell & Dashboard) | `src/components/layout/AppShell.tsx`, `src/components/auth/UserAccountMenu.tsx`, `src/components/dashboard/MarketHoursPhCard.tsx`, `src/components/quotes/DailyQuoteCard.tsx`, `src/pages/DashboardPage.tsx` | Replace left sidebar with crisp single-line `60px` Editorial Top Nav + clean mobile drawer/bottom nav; unboxed asymmetric Dashboard with 4 distinct section compositions & `1px` hairlines |
| **Wave 2** | `frontend-specialist` (Publication Syllabus & Lesson Reader) | `src/pages/AcademyCatalogPage.tsx`, `src/pages/LessonPage.tsx`, `src/pages/AcademyTopicPage.tsx`, `src/components/visual-learning/VisualExplanationsSection.tsx`, `src/components/learning/LessonKnowledgeCheck.tsx` | University-syllabus split ledger for `/academy` (fixing PH time on line 190 too); unobstructed single-column editorial Lesson Reader (`max-w-3xl`/`max-w-5xl`) with slide-over AI Mentor & Explain Differently drawer |
| **Wave 2** | `frontend-specialist` (Trading Tools & Secondary Pages) | `src/pages/PaperTradingPage.tsx`, `src/pages/BacktestPage.tsx`, `src/pages/JournalPage.tsx`, `src/pages/GlossaryFlashcardsPage.tsx`, `src/pages/EvaluationPage.tsx`, `src/pages/PracticePage.tsx`, `src/pages/LibraryPage.tsx`, `src/pages/TradingLabPage.tsx` | Unify typography, restrained single-accent tokens, remove excessive rounded-card borders/shadows, smooth `.tl-page-enter` transitions, zero overflow on `360px–1440px` |
| **Wave 3** | `test-engineer` | `src/__tests__/*` (verify/update any selector affected by nav/drawer refinement) + run full verification suite (`npm test`, `npm run lint`, `npm run build`, `lint_runner.py`, `accessibility_checker.py`, `security_scan.py`, `ux_audit.py`, purple check) | 100% tests pass, 0 errors, 0 chunk warnings, 0 WCAG issues, 0 purple, 0 horizontal overflow classes |

---

## Done When
- [x] `DESIGN.md` exists and all surfaces conform to its unified Editorial Fintech tokens & tight radius scale (`rounded-md`/`rounded-lg`).
- [x] Login & Auth Callback have an original, unmistakable editorial TradeLab identity with zero template fluff.
- [x] Desktop navigation uses a clean single-line top bar (no generic persistent icon sidebar); mobile has clean drawer + bottom nav with zero overflow at `360px`/`390px`.
- [x] Dashboard, Academy Catalog, Lesson Reader, and Trading Tools each have distinct, intentional compositions (no repetitive boxed card grids).
- [x] Lesson Reader puts content front-and-center with an on-demand AI Mentor / Explain Differently slide-over drawer.
- [x] Minimalist CSS transitions & micro-interactions enhance hierarchy while respecting `prefers-reduced-motion`.
- [x] All Vitest tests, ESLint, TypeScript, Build, Accessibility, UX Audit, Security, and Purple-ban checks pass cleanly.

---

## ✅ PHASE X COMPLETE
- Date: 2026-11-27
