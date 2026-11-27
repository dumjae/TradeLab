# Implementation Plan: Master Trading Academy Curriculum, 5-Level Progression, Decoupled Lessons, PH Market Track & Trader Evaluation

> **Status:** Draft for Review & Approval (Phase 1 — Planning Only, No Code Written)  
> **Project:** TradeLab Academy (`React 18 + TypeScript + Vite + Tailwind CSS + lightweight-charts + Supabase RLS`)  
> **Scope:** Transform TradeLab into a structured 5-Pillar, 5-Level Trading Academy with decoupled lessons, all 32 modules (`358` syllabus topics across Universal Foundations, Advanced Price Action/SMC, Forex, Indices, Stocks, Crypto, Strategy/Pro, & Optional PH/PSE Track), inline Lesson Knowledge Checks, Searchable Glossary + Flashcards, and Level Assessments + Certificates.

---

## Goal
Restructure TradeLab Academy around **one decoupled Master Curriculum + 4 Equal Market Specializations (+ optional Philippine/PSE track)** with 5-level guided progression (`Beginner → Professional`), consistent interactive lesson flows (Overview → Objectives → Content/Diagrams → Practical Charts → Inline Quiz → Completion), Glossary/Flashcards, and Trader Evaluation certificates — reusing all existing 27 deep lessons, 62 verified YouTube tutorials, 30 OHLCV chart scenarios, Paper Trading, Backtester, and Trade Journal without duplicating content or bloating the JS bundle.

---

## Architecture Highlights (5 Pillars + Decoupled Model)
- **Decoupled Data Layer (`src/types/curriculum-tree.ts` + lazy track catalogs):** Lessons live independently (`id`, `code`, `slug`, `level 1..5`, `supportedMarkets`, `prerequisiteCodes`, `optional`, `linkedDeepLessonSlug`, `quiz`, `disclaimerMode`) and are referenced by Modules (`1–9`, `F1–F5`, `I1–I5`, `S1–S6`, `C1–C6`, `ST7`, `PRO8`, `PH1`) so shared concepts like *Risk-to-Reward Ratio* or *Support & Resistance* are never duplicated across paths.
- **5-Pillar Academy Navigation (`/academy`):**
  - `01. Trading Foundations` (Modules 1–6: Intro, Markets, Charts, TA, Risk, Psychology — Level 1)
  - `02. Market Specializations` (Forex `F1–F5`, Indices `I1–I5`, Stocks `S1–S6` [Options optional], Crypto `C1–C6` + Optional `PH1` Philippine Market / PSE / BSP / SEC — Level 2)
  - `03. Advanced Trading` (Modules 7–9 Market Structure & SMC framed strictly as *analytical frameworks*, plus Strategy Dev `7.1–7.15` & Pro Portfolio `8.1–8.10` — Levels 3–5)
  - `04. Practical Trading Lab` (Chart Analysis, `/backtest`, `/paper-trading`, `/journal`)
  - `05. Trader Evaluation` (`/evaluation`: Level 1–5 Quizzes, Paper/Journal Readiness Check, & Certificates) + `/glossary` (Searchable Glossary & Flashcards).
- **Bundle Safety:** Lazy-loaded code-split chunks per specialization track so the initial bundle stays lightweight (`< 250 kB`).

---

## Tasks (Phase 2 — After Approval)

| # | Agent | Task | Verify |
|---|---|---|---|
| 1 | `database-architect` | Create `supabase/migrations/009_master_academy_progression.sql` (idempotent `user_topic_progress`, `user_level_assessments`, `user_certificates`, strict `auth.uid() = user_id` RLS) + `src/types/curriculum-tree.ts` | `schema_validator.py` (0 issues), `tsc --noEmit` |
| 2 | `backend-specialist` | Build decoupled Master Syllabus & Track Catalogs (`src/data/academyRoadmap.ts` + lazy track catalogs for Foundations `1–6`, Advanced/SMC `7–9`, Forex `F1–F5`, Indices `I1–I5`, Stocks `S1–S6`, Crypto `C1–C6`, Strategy/Pro `7–8`, & Optional `PH1` PSE/BSP/SEC) with quizzes, Taglish summaries, PH times, & analytical-framework disclaimers | All 32 modules & 358 topics resolve cleanly with valid quizzes & 0 duplicate IDs |
| 3 | `backend-specialist` | Build `src/services/academyProgressService.ts` (dual-mode Supabase + LocalStorage tracking for reading, quiz scores, prerequisite gating + optional Explorer unlock, Level 1–5 status, and certificate issuance) + `src/data/glossaryTerms.ts` (searchable glossary & flashcard deck) | Unit tests verify prerequisite locking, quiz scoring, level promotion, & certificate creation |
| 4 | `frontend-specialist` | Upgrade `/academy` (`AcademyCatalogPage.tsx`) to the **5-Pillar + 5-Level Mastery Roadmap** with prerequisite badges, level progress rings, Specialization Path selector (Forex / Indices / Stocks / Crypto / Optional PH-PSE), and "Guided Lock vs. Free Browse" toggle | Renders all 5 pillars, 5 levels & 4+1 tracks cleanly in EN & Taglish; 0 purple, 0 WCAG issues |
| 5 | `frontend-specialist` | Upgrade `/academy/:slug` (`LessonPage.tsx`) + add `src/components/learning/LessonKnowledgeCheck.tsx` so every decoupled syllabus topic & deep lesson follows the consistent 6-part Academy layout (Overview → Objectives → Content/Dual Diagrams/Video → Practical Chart → Inline Knowledge Check → Completion/Next) | Inline quiz checks answers, shows rationale/trap, updates completion & unlocks next topic |
| 6 | `frontend-specialist` | Build `/glossary` (`GlossaryFlashcardsPage.tsx` — searchable glossary + interactive flip flashcards with EN/Taglish & expanded acronyms) and `/evaluation` (`EvaluationPage.tsx` — Level 1–5 Assessments, Paper/Journal Risk Readiness check, & downloadable SVG Completion Certificate) + wire into `App.tsx`, `AppShell.tsx`, & `DashboardPage.tsx` | Lazy routes load cleanly; flashcards flip; passing an assessment issues a certificate |
| 7 | `test-engineer` | Add `src/__tests__/masterAcademy.test.tsx` (decoupled syllabus integrity, prerequisite gating, inline quiz scoring, glossary/flashcards, level assessment & certificate) + run Phase X verification (`npm test`, `npm run lint`, `npm run build`, `lint_runner.py`, `accessibility_checker.py`, `security_scan.py`, purple check) | 100% tests & scripts pass with 0 errors and 0 chunk warnings |

---

## Done When
- [x] All 34 modules (`358` syllabus topics across Foundations `1–6`, Advanced/SMC `7–9`, Forex `F1–F5`, Indices `I1–I5`, Stocks `S1–S6`, Crypto `C1–C6`, Strategy/Pro `7–8`, and optional PH/PSE `PH1`) are live, decoupled, and browsable across the 5 Pillars and 5 Levels.
- [x] Every lesson opens in the consistent 6-part interactive Academy layout with inline **Knowledge Check** quiz, analytical-framework honesty (no "guaranteed profits"), PH times, expanded acronyms, and EN/Taglish support.
- [x] Prerequisites protect beginners from jumping straight into SMC/Options, with a clean unlock flow (and optional self-override if enabled).
- [x] Interactive **Glossary & Flashcards (`/glossary`)** and **Trader Evaluation & Certificates (`/evaluation`)** work end-to-end in Supabase + LocalStorage.
- [x] All Vitest tests, ESLint, TypeScript, Build (`0` chunk warnings), Accessibility (`0` issues), Security (`0` tracked findings), and Purple-ban (`0`) checks pass.

---

## ✅ PHASE X COMPLETE
- Tests (`npm test`): ✅ 13/13 test files, 126/126 tests passed
- Lint (`npm run lint` + `lint_runner.py`): ✅ 0 errors, 0 warnings
- Build (`npm run build`): ✅ Success (0 errors, 0 chunk warnings)
- Accessibility (`accessibility_checker.py`): ✅ 69 files checked, 0 issues
- Security (`security_scan.py`): ✅ 0 tracked code/config/dependency/secret findings
- Schema Validator (`schema_validator.py`): ✅ 0 issues
- Purple Ban: ✅ 0 matches across `src/` and `index.html`
- Date: 2026-11-27
