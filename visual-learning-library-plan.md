# Implementation Plan: TradeLab Academy — Visual Learning Library, Contextual Video System & Trader Mindset Quotations

> **Status:** ✅ Implemented & Verified (Phase X Complete)  
> **Project:** TradeLab Academy (Greenfield Build + Composable Open-Source Stack)  
> **Project Type:** WEB (`React + TypeScript + Vite + Tailwind CSS + shadcn/ui + TradingView lightweight-charts + Supabase + Vercel`)  
> **Integration Targets:** Trading Academy, Tutorial Mode, Practice Exercises, AI Mentor, Trading Lab, Mindset Quotations

---

## 1. Strategic Approach: Build Lean Core + Composable Open-Source Libraries

Instead of adopting a heavy monolithic open-source LMS (e.g., Moodle / Open edX) that fights against interactive candlestick charts, Practice Mode guards, and Supabase RLS, we will **scaffold a lean, modern TradeLab Academy core from scratch** and plug in **proven MIT / Apache 2.0 open-source libraries** for the hardest domains:

| Domain | Open-Source Library / Standard | License | Why This Beats Building From Scratch |
|---|---|---|---|
| **Interactive Financial Charts** | `lightweight-charts` (TradingView) | Apache 2.0 | ~45KB institutional candlestick engine, smooth mobile gestures, native price lines (Equal Highs/Lows), series markers (sweeps/BOS), zero paid data feeds needed |
| **UI Primitives & Accessibility** | `shadcn/ui` + Radix UI + `lucide-react` | MIT | Accessible tabs, drawers, dialogs, popovers, keyboard shortcuts, responsive dark/light trading terminal aesthetics |
| **Validation & Type Safety** | `zod` | MIT | Strict schema validation for YouTube URLs, verified timestamps, admin forms, and AI structured outputs |
| **AI Provider Abstraction (Optional)** | Vercel AI SDK (`ai`) or lightweight fetch adapter | Apache 2.0 | Provider-agnostic (Gemini / OpenAI / Groq / local Ollama) with clean deterministic offline fallback when no API key is configured |
| **Auth, DB & Security** | `@supabase/supabase-js` (PostgreSQL + RLS) | MIT | Built-in auth, row-level security for private notes/bookmarks/quotes, plus local fallback adapter for instant zero-config preview |
| **Video Embeds (Zero Bloat)** | Native React Facade + YouTube IFrame API (`youtube-nocookie.com`) | Standard API | Zero third-party player bloat, zero autoplay, lazy-loaded on click, exact timestamp seeking without reload |
| **Testing** | `vitest` + `@testing-library/react` + `playwright` | MIT / Apache 2.0 | Fast unit tests for parsers/RLS/grounding + real browser E2E verification |

---

## 2. Architecture & Solutions for the Hardest Parts ("Mga Mahihirap na Part")

### Hard Part #1: Interactive Historical Charts, Annotated Examples & Before/After Comparisons
- **Challenge:** Teaching concepts like *Liquidity Sweeps vs. Breakouts* with static text fails; building a charting canvas from scratch is slow and fragile on mobile.
- **Solution:**
  - Use **TradingView `lightweight-charts`** fed by deterministic, realistic historical OHLCV scenario datasets (JSON fixtures per lesson — works 100% offline, zero paid market data fees).
  - **Step-by-Step Replay / Before-and-After Mode:** Learners toggle between **Before** (equal highs forming / liquidity resting), **Trigger** (wick sweeps above high), and **After** (displacement & market structure shift) right on the live chart with price lines and annotation callouts.
  - **Interactive Practice Mode:** Learners inspect unlabeled historical scenarios and identify whether the setup is a *Valid Liquidity Sweep* or a *True Breakout* (or click the sweep zone) before getting guided feedback.

### Hard Part #2: Legitimate Video Discovery, Verified Timestamps & API Quota Limits
- **Challenge:** YouTube Data API v3 `search.list` costs **100 quota units/call** (10,000/day limit), auto-scraping violates ToS, and fake/unverified timestamps destroy learner trust.
- **Solution (3-Tier Zero-Violation Pipeline):**
  1. **Tier 1 (Zero-Quota Manual Curation):** Admin pastes any public YouTube URL → backend calls YouTube's public oEmbed endpoint (no API key needed) for verified title/creator/thumbnail; if `YOUTUBE_API_KEY` is present, calls `videos.list` (only **1 quota unit**) to verify `status.embeddable`, duration, and auto-parse official creator **YouTube Chapters** (`verification_method = 'youtube_chapters'`).
  2. **Tier 2 (Controlled Cached Discovery):** Admin-only `/api/resources/discover` button runs targeted queries, caches results in `resource_discovery_cache` (24–72h TTL), deduplicates by `external_video_id`, scores relevance, and saves candidates strictly as `pending_review` (never auto-published).
  3. **Tier 3 (Health & Graceful Fallback):** Scheduled/manual `/api/resources/check-health` flags private/deleted/non-embeddable videos as `unavailable`. UI falls back cleanly to original diagrams, text, and an external "Watch on YouTube" link.

### Hard Part #3: Stopping AI Mentor Hallucinations & Practice Mode Spoilers
- **Challenge:** LLMs invent convincing fake YouTube URLs/timestamps and immediately blurt out quiz answers in Practice Mode.
- **Solution (Closed-World Grounding Architecture):**
  - Backend fetches only `verification_status = 'published'` rows from `educational_resources` + `resource_segments` for the active lesson and injects them as a strict **Allowed Reference Catalog**.
  - AI responses may cite resources **ONLY by `resource_id` and `segment_id`**; the server/UI hydrates the real title, creator, URL, and timestamp from the database—making fabricated links/timestamps structurally impossible.
  - UI renders distinct badges: **`Verified Source`** vs. **`AI Mentor Explanation`**.
  - When `mode === 'practice'`, the backend enforces a **Socratic Tutor Guard** (hints, visual cues, and concept comparisons only — never reveals the exercise answer before submission).
  - If no AI API key is configured, a built-in **Deterministic Explanation Fallback Engine** serves structured 6-style explanations authored per lesson.

### Hard Part #4: Seamless Dev & Deployment Without Being Blocked by Cloud Setup
- **Challenge:** Setting up Supabase auth/RLS and API keys upfront can stall UI iteration and local testing.
- **Solution (Repository Pattern with Automatic Adapter Switching):**
  - All data services (`visualResourcesService`, `quotesService`, `difficultConceptsService`, `personalLibraryService`) talk to a clean TypeScript repository interface.
  - **Production / Configured Mode:** Uses Supabase PostgreSQL + Auth + strict RLS (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`).
  - **Local Preview Fallback Mode:** Automatically uses LocalStorage + curated in-memory starter data when Supabase env vars are absent, so every feature can be tested locally immediately and promoted to Supabase with zero code rewrites.

### Hard Part #5: Accurate `MY DIFFICULT CONCEPTS` Tracking (Without Noise)
- **Challenge:** Adding a concept on one accidental misclick creates clutter; tracking nothing leaves learners stuck.
- **Solution (Transparent Rule Engine):**
  - Auto-adds a concept to `MY DIFFICULT CONCEPTS` when:
    - Learner explicitly bookmarks it as difficult, **OR**
    - Learner clicks **"Explain This Differently"** on that concept, **OR**
    - Learner gets **2+ wrong answers / failed chart identifications** on that concept.
  - Provides a 1-click **Review Bundle** (Beginner explanation + Verified video segment + Annotated chart + 5-question drill) and allows **manual mastery removal** (or suggests graduation after 3 consecutive correct answers).

### Hard Part #6: Avoiding Scope Creep on Curriculum Content (Vertical Slice Strategy)
- **Challenge:** Writing a 50-lesson academy from scratch would delay launching the platform.
- **Solution (Complete Platform + 6 Flagship Lessons Vertical Slice):**
  - Build the complete reusable Academy + Visual Library + Tutorial + Practice + Trading Lab + AI Mentor + Admin + Quotations system.
  - Ship **6 deep, production-quality foundational lessons** (easily extensible via DB/JSON):
    1. *Market Structure Basics (HH/HL, LH/LL & BOS)*
    2. *Understanding Market Liquidity (Buy-Side & Sell-Side)*
    3. *Equal Highs & Equal Lows (Liquidity Pools)*
    4. *Liquidity Sweeps vs. True Breakouts* *(Flagship showcase lesson matching the spec)*
    5. *Fair Value Gaps (FVG) & Institutional Imbalances*
    6. *Risk Management, Position Sizing & Trading Psychology*
  - Each lesson ships with original text, SVG diagram, interactive `lightweight-charts` historical scenario(s), 6 "Explain This Differently" fallback styles, and a 5-question Practice drill—ready for Admin-curated/verified YouTube & TradingView resources without any fake placeholder links.

---

## 3. Trader Mindset & Quotations System (Motivation, Teaching & Inspiration)

Designed so you can view uplifting, practical trading wisdom **anytime** without cluttering the charts:

- **3 Anytime Touchpoints:**
  1. **Header Mindset Trigger + Keyboard Shortcut (`Shift + Q`):** Opens the **Trader's Mindset Vault** slide-over drawer from anywhere in the app (Lesson, Tutorial, Practice, Trading Lab, Library).
  2. **Academy Dashboard Daily Quote Card:** Displays a daily rotating (or shuffleable) quote with category badges (`Motivate`, `Teach`, `Inspire`), author attribution, and an expandable **"Trading Lesson Takeaway"** explaining how to apply it on real charts.
  3. **Contextual Study Nudges:** Subtle, dismissible mindset reminder during Practice Mode & `MY DIFFICULT CONCEPTS` review (e.g., reinforcing patience and process after a tough drill).
- **Personalization & Authenticity:**
  - Filter by **Motivate** (discipline, resilience, consistency), **Teach** (risk management, probability, edge), **Inspire** (patience, long-term mastery).
  - **Save to Favorites**, **Pin Top Quote** to dashboard, write **Personal Reflections**, and **Add My Own Personal Trading Mantras/Rules** (private via RLS).
  - **Strict Attribution Integrity:** Verified historical trader quotes (`verified_trader` — e.g., Mark Douglas, Ed Seykota, Paul Tudor Jones, Van Tharp, Bruce Kovner, Linda Raschke, Marty Schwartz) are clearly distinguished from original TradeLab principles (`tradelab_principle`) and your personal mantras (`user_custom`).

---

## 4. Database Schema (Supabase PostgreSQL + RLS)

### 4.1 Core Curriculum & Visual Resources
1. **`lessons`** — `id`, `slug` (unique), `title`, `level` (`beginner` | `intermediate` | `advanced`), `module_order`, `concept_key`, `learning_objectives` (text[]), `terminology` (jsonb), `prerequisites` (text[]), `text_content` (markdown/jsonb), `diagram_config` (jsonb), `chart_scenarios` (jsonb), `created_at`
2. **`educational_resources`** — `id`, `title`, `description`, `source_type` (`youtube` | `tradingview` | `tradelab_original` | `other_educator`), `source_name`, `source_url` (unique), `external_video_id` (unique nullable), `thumbnail_url`, `duration_seconds`, `content_type` (`video` | `chart_example` | `diagram` | `walkthrough`), `license_status`, `attribution`, `non_endorsement_notice` (boolean default true), `verification_status` (`pending_review` | `verified` | `published` | `unavailable` | `archived`), `quality_score` (0–100), `embeddable` (boolean), `last_checked_at`, `created_at`, `updated_at`
3. **`resource_segments`** — `id`, `resource_id` (FK), `start_seconds`, `end_seconds`, `segment_title`, `explanation`, `verification_method` (`youtube_chapters` | `verified_transcript` | `manual_editorial`), `verified_by`, `verified_at`
4. **`lesson_resources`** — `id`, `lesson_id` (FK), `resource_id` (FK), `relevance_score`, `display_order`, `before_watch_context`, `after_watch_takeaways` (text[]), `editorial_notes`, `UNIQUE (lesson_id, resource_id)`
5. **`resource_discovery_cache`** — `id`, `query_hash` (unique), `lesson_id`, `provider`, `query_text`, `results_json` (jsonb), `expires_at`, `created_at`

### 4.2 User-Private Tables (Strict RLS: `auth.uid() = user_id`)
6. **`user_saved_resources`** — `id`, `user_id`, `resource_id`, `saved_timestamp_seconds`, `saved_segment_id`, `curriculum_level`, `personal_notes`, `created_at`, `updated_at`
7. **`user_learning_history`** — `id`, `user_id`, `resource_id`, `lesson_id`, `last_position_seconds`, `completion_status` (`not_started` | `in_progress` | `watched`), `last_viewed_at`, `UNIQUE (user_id, resource_id)`
8. **`user_difficult_concepts`** — `id`, `user_id`, `lesson_id`, `concept_key`, `concept_label`, `trigger_sources` (text[]), `mistake_count`, `consecutive_correct`, `is_mastered`, `mastered_at`, `updated_at`, `UNIQUE (user_id, lesson_id, concept_key)`

### 4.3 Mindset & Quotations Tables
9. **`trading_quotes`** — `id`, `quote_text`, `author`, `author_role`, `source_type` (`verified_trader` | `tradelab_principle` | `user_custom`), `category` (`motivate` | `teach` | `inspire`), `trading_lesson_note`, `related_concepts` (text[]), `is_public` (boolean), `user_id` (nullable, set for custom quotes), `created_at`
10. **`user_favorite_quotes`** — `id`, `user_id`, `quote_id` (FK), `personal_reflection`, `is_pinned` (boolean), `created_at`, `UNIQUE (user_id, quote_id)`

### 4.4 RLS Security Summary
- **Learners / Public:** Can `SELECT` only `published` `educational_resources`, segments belonging to `published` resources, `lesson_resources` for `published` resources, and `is_public = true` `trading_quotes`.
- **User Private Records:** `user_saved_resources`, `user_learning_history`, `user_difficult_concepts`, `user_favorite_quotes`, and `user_custom` quotes strictly enforce `auth.uid() = user_id` on `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- **Admin Role (`is_admin()`):** Enforced via `profiles.role = 'admin'` (or JWT `app_metadata.role = 'admin'`) for reading/writing `pending_review` resources, discovery cache, segment verification, and publishing.

---

## 5. Planned Project Directory Structure

```text
TradeLab/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env.example                                # Documents Supabase, YOUTUBE_API_KEY, AI key + fallback behavior
├── supabase/
│   └── migrations/
│       ├── 001_academy_and_visual_library.sql  # Lessons, resources, segments, user library, difficult concepts + RLS
│       └── 002_trading_quotes.sql              # trading_quotes, user_favorite_quotes + RLS + verified seed quotes
├── api/                                        # Vercel Serverless Functions (server-side secrets only)
│   ├── _lib/
│   │   ├── auth.ts                             # Admin JWT verification helper
│   │   ├── youtube.ts                          # oEmbed, YouTube Data API v3, chapter parser, URL sanitizer
│   │   └── mentorGrounding.ts                  # Closed-world citation hydration + Practice Mode guard
│   ├── resources/
│   │   ├── discover.ts                         # Admin-only cached discovery (stages as pending_review)
│   │   ├── metadata.ts                         # Paste-URL metadata + chapter extractor
│   │   └── check-health.ts                     # Batch broken-link / embeddability checker
│   └── mentor/
│       └── explain-differently.ts              # 6-style grounded explanation endpoint + deterministic fallback
└── src/
    ├── main.tsx
    ├── App.tsx                                 # Router: Dashboard, Academy/Lesson, Practice, Trading Lab, Library, Admin
    ├── types/                                  # academy.ts, visual-learning.ts, quotes.ts
    ├── data/
    │   ├── curriculum.ts                       # 6 flagship lessons + SVG diagrams + 6-style fallback explanations
    │   ├── chartScenarios.ts                   # Historical OHLCV scenarios (Liquidity Sweeps, Breakouts, FVGs, etc.)
    │   └── starterQuotes.ts                    # 35+ verified trader quotes & TradeLab principles
    ├── lib/
    │   ├── supabase.ts                         # Supabase client + automatic local fallback detector
    │   └── youtubeUtils.ts                     # URL parsing, timestamp formatting, nocookie embed URL builder
    ├── services/
    │   ├── visualResourcesService.ts
    │   ├── personalLibraryService.ts
    │   ├── difficultConceptsService.ts
    │   ├── adminResourcesService.ts
    │   ├── aiMentorService.ts
    │   └── quotesService.ts
    ├── components/
    │   ├── layout/                             # AppShell, TopNav (with Shift+Q Mindset button), Sidebar
    │   ├── charts/
    │   │   ├── InteractiveCandleChart.tsx      # TradingView lightweight-charts wrapper + price lines & sweep markers
    │   │   └── BeforeAfterChartViewer.tsx      # Step-replay & before/after annotated chart comparison
    │   ├── visual-learning/
    │   │   ├── VisualExplanationsSection.tsx   # 4-mode switcher (Text / Diagram / Video / Historical Chart)
    │   │   ├── LazyVideoPlayer.tsx             # Thumbnail facade -> youtube-nocookie embed (no autoplay + fallback)
    │   │   ├── TimestampNavigator.tsx          # Verified timestamp chips with direct seek & bookmark
    │   │   ├── ResourceAttributionCard.tsx     # Creator attribution, original URL, non-endorsement notice
    │   │   ├── ExplainDifferentlyPanel.tsx     # 6 explanation styles + Practice Mode answer-block guard
    │   │   └── BookmarkNotesDialog.tsx         # Bookmark video/timestamp + personal notes
    │   ├── mentor/
    │   │   └── AIMentorPanel.tsx               # Lesson/history-aware chat with Verified Source vs AI badges
    │   ├── library/
    │   │   ├── PersonalVisualLibrary.tsx       # Saved videos, timestamps, notes, watch history, resume
    │   │   └── DifficultConceptsPanel.tsx      # MY DIFFICULT CONCEPTS queue + review bundle + mastery graduation
    │   ├── quotes/
    │   │   ├── DailyQuoteCard.tsx              # Dashboard card (Motivate / Teach / Inspire + lesson takeaway)
    │   │   ├── MindsetVaultDrawer.tsx          # Anytime global drawer (Shift+Q), filters, favorites, custom mantras
    │   │   └── ContextualQuoteStrip.tsx        # Subtle encouragement strip in Practice & Review modes
    │   └── admin/
    │       ├── AdminResourceManager.tsx        # Manual YouTube URL add, cached discovery, status workflow
    │       └── SegmentVerificationEditor.tsx   # Verified timestamp CRUD + verification method selector
    └── pages/
        ├── DashboardPage.tsx                   # Academy overview + DailyQuoteCard + Difficult Concepts summary
        ├── LessonPage.tsx                      # Lesson + VISUAL EXPLANATIONS + Explain Differently + AI Mentor
        ├── PracticePage.tsx                    # Interactive chart ID drills (Practice Mode answer guard active)
        ├── TradingLabPage.tsx                  # Interactive TradingView lightweight-charts sandbox + replay
        ├── LibraryPage.tsx                     # Personal Visual Library + MY DIFFICULT CONCEPTS
        └── AdminVisualLibraryPage.tsx          # Role-gated Resource Curation & Verification Console
```

---

## 6. Incremental Task Breakdown (Phase 2 — After Approval)

> **Multi-Agent Orchestration Roster (5 Specialists):**
> - **Foundation:** `database-architect` + `security-auditor`
> - **Core:** `backend-specialist` + `frontend-specialist`
> - **Verification:** `test-engineer`

| ID | Task | Agent | Skills | Deps | INPUT -> OUTPUT -> VERIFY |
|---|---|---|---|---|---|
| **T0** | Scaffold Vite + React + TypeScript + Tailwind + shadcn/ui + `lightweight-charts` + `zod` + `@supabase/supabase-js` + Vitest + `.env.example` | `frontend-specialist` | `app-builder`, `clean-code` | Approval | Spec -> Bootable Vite React app with design tokens & routing -> `npm run dev` & `npm run build` succeed |
| **T1** | Create Supabase SQL migrations (`001_academy_and_visual_library.sql`, `002_trading_quotes.sql`) + TypeScript domain types + starter curriculum/chart/quote seeds | `database-architect` | `database-design` | T0 | Schema spec -> Normalized SQL tables, indexes, constraints, seed data -> Run `schema_validator.py` with 0 errors |
| **T2** | Author & audit RLS policies, `is_admin()` helper, YouTube URL SSRF/allowlist validator, and secret-boundary checks | `security-auditor` | `vulnerability-scanner` | T1 | Schema + API design -> Hardened RLS SQL + URL validation helpers -> Run `security_scan.py` & verify zero leaked secrets |
| **T3** | Build Vercel serverless APIs (`/api/resources/discover`, `/api/resources/metadata`, `/api/resources/check-health`, `/api/mentor/explain-differently`) + dual-mode Supabase/LocalStorage service layer | `backend-specialist` | `api-patterns`, `nodejs-best-practices` | T1, T2 | API contracts -> Serverless endpoints + YouTube chapter parser + closed-world AI grounding + offline fallbacks -> Unit tests pass for chapter parsing, caching & zero fabricated URLs |
| **T4** | Build Interactive Chart Engine (`InteractiveCandleChart`, `BeforeAfterChartViewer` via `lightweight-charts`) & Lesson `VISUAL EXPLANATIONS` (4-mode switcher, `LazyVideoPlayer`, `TimestampNavigator`, attribution, bookmarks) | `frontend-specialist` | `frontend-design`, `tailwind-patterns`, `nextjs-react-expert` | T0, T3 | Chart fixtures + services -> Interactive lesson page with zero initial iframes -> Verify thumbnail facade, timestamp seek, before/after toggle & mobile layout |
| **T5** | Build `"Explain This Differently"` (6 modes), Grounded `AIMentorPanel`, Tutorial Mode & `PracticePage` (chart-ID exercises with answer-block guard) + `TradingLabPage` | `frontend-specialist` | `frontend-design`, `frontend-architecture` | T3, T4 | Grounded mentor service -> Interactive Practice & Mentor UI -> Verify `[Verified Source]` vs `[AI Explanation]` badges & no spoiled answers in Practice Mode |
| **T6** | Build Personal Visual Library (`LibraryPage`) & `MY DIFFICULT CONCEPTS` auto-tracking + Review Bundle + Mastery graduation | `frontend-specialist` | `frontend-design`, `frontend-architecture` | T3, T4 | Library & difficult concept services -> Library page + review flow -> Bookmark timestamp, add note, reload, resume position, graduate mastered concept |
| **T7** | Build **Trader Mindset & Quotations System** (`DailyQuoteCard`, global `MindsetVaultDrawer` on `Shift+Q`, category filter Motivate/Teach/Inspire, Favorites, Pin, Personal Mantras, `ContextualQuoteStrip`) | `frontend-specialist` | `frontend-design`, `tailwind-patterns` | T1, T3 | Quotes seed + `quotesService` -> Always-accessible quote experience -> Open `Shift+Q` from any page, filter categories, favorite, pin & add custom rule |
| **T8** | Build Admin Curation Console (`AdminVisualLibraryPage`, `AdminResourceManager`, `SegmentVerificationEditor`) | `frontend-specialist` | `frontend-design`, `frontend-architecture` | T2, T3 | Admin APIs -> Role-gated Admin UI -> Paste YouTube URL, parse/add verified timestamp, transition `Pending Review` -> `Published`, verify live in lesson |
| **T9** | Write unit + integration + Playwright E2E tests and run Phase X verification suite | `test-engineer` | `testing-patterns`, `webapp-testing`, `lint-and-validate` | T4–T8 | Completed app -> Automated test suite + verification report -> All 14 acceptance criteria & scripts pass |

---

## 7. Acceptance Criteria Checklist (Definition of Done)

- [x] 1. Every curriculum lesson displays `VISUAL EXPLANATIONS` with 4-mode switching (Text / Diagram / Video / Historical Chart).
- [x] 2. Video metadata, creator attribution, original URL, and non-endorsement disclaimer are preserved.
- [x] 3. Supported videos play inside the app via lazy-loaded `youtube-nocookie.com` embeds (zero autoplay, zero iframes on initial load).
- [x] 4. Only verified timestamps (`youtube_chapters`, `verified_transcript`, `manual_editorial`) appear and seek to the exact second.
- [x] 5. Users can bookmark videos, exact timestamps, and personal notes, and resume where they left off.
- [x] 6. AI Mentor cites only verified DB resources for the active lesson and distinguishes `[Verified Source]` from `[AI Mentor Explanation]`.
- [x] 7. All 6 "Explain This Differently" styles work across Lesson, Tutorial, and Practice modes without spoiling Practice answers.
- [x] 8. `MY DIFFICULT CONCEPTS` auto-populates from mistakes, bookmarks, and re-explanation requests, and allows mastery removal.
- [x] 9. Admins can manually add YouTube URLs, trigger cached discovery, verify timestamps, and manage statuses (`Pending Review` -> `Verified` -> `Published` | `Unavailable` | `Archived`).
- [x] 10. Unavailable/private/region-blocked videos degrade gracefully with fallback UI.
- [x] 11. Personal bookmarks, notes, watch history, difficult concepts, and custom quotes are strictly private via Supabase RLS.
- [x] 12. Zero unauthorized downloading, scraping, or copyrighted course reproduction occurs.
- [x] 13. Full application remains functional when `YOUTUBE_API_KEY`, AI keys, or Supabase credentials are absent (graceful local fallback).
- [x] 14. **Trader Mindset & Quotations:** Accessible anytime via Dashboard Daily Card, global `Shift + Q` Vault Drawer, and Practice nudges; supports Motivate/Teach/Inspire filters, favorites, pinning, and personal mantras with accurate attribution.

---

## ✅ PHASE X COMPLETE
- **Lint (`npm run lint` + `lint_runner.py`):** ✅ Pass (0 errors, 0 warnings)
- **Typecheck (`npx tsc --noEmit`):** ✅ Pass (0 errors)
- **Security (`security_scan.py`):** ✅ Pass (`[OK] SECURE`, 0 findings)
- **Schema (`schema_validator.py`):** ✅ Pass (0 issues)
- **Accessibility (`accessibility_checker.py`):** ✅ Pass (28 files checked, 0 issues)
- **UX Audit (`ux_audit.py`):** ✅ Pass (29 files checked)
- **Tests (`npm test`):** ✅ Pass (4/4 test files, 26/26 tests passed)
- **Build (`npm run build`):** ✅ Success (`dist/` built cleanly)
- **Date:** 2026-11-26

---

## 8. Phase X: Final Verification Protocol (Mandatory Before Completion)

```bash
npm run lint && npx tsc --noEmit
python .agents/skills/database-design/scripts/schema_validator.py .
python .agents/skills/vulnerability-scanner/scripts/security_scan.py .
python .agents/skills/lint-and-validate/scripts/lint_runner.py .
python .agents/skills/frontend-design/scripts/ux_audit.py .
python .agents/skills/frontend-design/scripts/accessibility_checker.py .
npm test
npm run build
```
