# Login Setup Guide & Jargon Cleanup Plan

## Goal & Root Cause
Remove the leftover developer setup accordion (`Supabase Gmail & Admin setup guide`), hardcoded SQL promotion snippet, and Supabase/env-var developer jargon from `/login` so end users see a clean authentication experience without internal database or configuration details.

**Root Cause:** `src/pages/LoginPage.tsx` still renders the collapsible `{/* Quiet Collapsible Supabase Setup Guide */}` block (lines 735–809), its supporting `ADMIN_SQL_SNIPPET` constant/state/copy handler, and developer-facing copy on lines 543, 548, and 711. Existing tests in `src/__tests__/authAndRoles.test.tsx` and `src/__tests__/editorialRedesign.test.tsx` also lock the `"Continue with Google (Gmail)"` label.

## Files Impacted
- `src/pages/LoginPage.tsx` (primary cleanup)
- `src/__tests__/authAndRoles.test.tsx` (button label update + regression assertions)
- `src/__tests__/editorialRedesign.test.tsx` (button label update + regression assertions)
- Read-only audit scope: `src/context/AuthContext.tsx`, `src/components/auth/**`, `README.md` (keep setup docs in developer docs only, never in UI)

## Phase 2 Specialist Agent Ownership

### 1. `frontend-specialist` — Remove Setup Guide & Polish Copy
- [ ] **Strip setup guide state & helpers in `src/pages/LoginPage.tsx`:**
  - Remove `Check` (line 5) and `Copy` (line 8) from `lucide-react` imports.
  - Delete `ADMIN_SQL_SNIPPET` (lines 19–20), `guideOpen` & `copiedSql` state (lines 335–336), and `handleCopySql` (lines 423–431).
  - Delete the entire `{/* Quiet Collapsible Supabase Setup Guide */}` block (lines 735–809).
- [ ] **Clean user-facing copy in `src/pages/LoginPage.tsx`:**
  - Line 543: Change `"Continue with Google (Gmail)"` → `"Continue with Google"`.
  - Line 548 (`!isConfigured`): Replace `"Supabase keys aren't set yet — use Local Preview below to explore immediately."` with user-friendly copy (e.g., `"Cloud sign-in is disabled in preview mode — use Local Preview below to explore immediately."`).
  - Line 711 (`!isConfigured`): Replace `"Preview separated Learner and Admin workspaces locally before connecting Supabase."` with `"Preview separated Learner and Admin workspaces locally in demo mode."`
  - Verify: `rg -n "Supabase|ADMIN_SQL|public\.profiles|VITE_SUPABASE" src/pages/LoginPage.tsx` returns zero matches.

### 2. `security-auditor` — Auth Surface Exposure Audit
- [ ] **Audit client auth files (`src/pages/LoginPage.tsx`, `src/context/AuthContext.tsx`, `src/components/auth/**`):**
  - Confirm zero SQL statements (`UPDATE`, `public.profiles`), internal migration references (`001–003`), env var names (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), or admin-promotion instructions appear in rendered JSX or user-facing error strings.
  - Confirm `README.md` / developer docs retain any legitimate setup instructions offline without leaking into client bundles.
  - Verify: `rg -n "public\.profiles|VITE_SUPABASE_|setup guide|migrations 001" src/` returns zero UI matches (and check `dist/` after build).

### 3. `test-engineer` — Update Tests, Add Regression Guards & Verify
- [ ] **Update existing test assertions:**
  - `src/__tests__/authAndRoles.test.tsx` (lines 64, 97): Update `'Continue with Google (Gmail)'` → `'Continue with Google'`.
  - `src/__tests__/editorialRedesign.test.tsx` (line 35): Update `/continue with google \(gmail\)/i` → `/^continue with google$/i`.
- [ ] **Add regression assertions for `/login`:**
  - Assert `screen.queryByText(/supabase gmail & admin setup guide/i)` is `null` and `screen.queryByText(/update public\.profiles/i)` is `null` on `LoginPage`.
- [ ] **Run full verification suite:**
  - `npm test` (all Vitest specs pass)
  - `npm run lint` (ESLint clean, no unused imports)
  - `npm run build` (TypeScript + Vite production bundle succeeds)
  - `python .agents/skills/vulnerability-scanner/scripts/security_scan.py .`
  - `python .agents/skills/lint-and-validate/scripts/lint_runner.py .`

## Done When
- [ ] `LoginPage.tsx` contains zero setup guide UI, zero SQL/env-var/Supabase jargon, and clean `"Continue with Google"` CTA.
- [ ] `security-auditor` confirms zero internal SQL, table names, or env var strings across auth UI components and built output.
- [ ] All unit tests, lint, production build, `security_scan.py`, and `lint_runner.py` pass with zero errors.
