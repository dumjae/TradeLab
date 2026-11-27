# TradeLab Premium Favicon & App Icon Plan

## Goal
Replace TradeLab's current two-candle favicon (`public/favicon.svg`) and stale teal-era raster icons (`public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`) with a bespoke **TradeLab Editorial Fintech** emblem (`DESIGN.md` v2.0: `#0f131a` obsidian canvas, `#161b24` surface bevel, `#262e3d` border hairline, `#e6e9ef` platinum ink, `#2962ff` Signal Blue, `#089981` Bull Emerald — zero purple).

## Agent Orchestration Map
| Agent | Scope & Ownership | Deliverables |
| --- | --- | --- |
| `project-planner` | Plan definition & asset alignment | `favicon-redesign.md` (this plan) |
| `frontend-specialist` | Master SVG mark + metadata sync | `public/favicon.svg`, `index.html`, `public/manifest.webmanifest` |
| `backend-specialist` | High-DPI 4× supersampled raster pipeline (Pillow) | `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`, `public/favicon-32x32.png`, `public/favicon.ico` (+ `public/og-image.png` if approved) |
| `test-engineer` | Asset integrity tests + Phase X verification | `src/__tests__/brand-assets.test.ts` + full test/lint/build/security/UX audit |

## Design Directions (Awaiting Selection)
- **Option A (Recommended) — Signal `TL` Monogram + Breakout Impulse:** Precision obsidian squircle (`#0f131a` -> `#161b24` top-lit depth, crisp `#2b3547` 1px specular rim), sculpted platinum (`#e6e9ef`) architectural **"T"** crossbar paired with an upward `#089981` emerald candle-bar baseline forming `"TL"` + a subtle `#2962ff` Signal Blue node. Engineered for instant legibility at `16×16` tabs, `24×24` navbar (`AppShell.tsx`), and `512×512` PWA splash.
- **Option B — Precision Breakout Axis:** Evolved, ultra-crisp minimal institutional candlestick duo (`#e6e9ef` + `#089981`) piercing a `#2962ff` resistance hairline inside an obsidian architectural bevel.
- **Option C — Editorial Swiss Crest:** Minimal geometric **`TL`** monogram (`#e6e9ef`) with a single `#2962ff` vertical structural tick mark (zero candlestick literalism).

## Verification Criteria
- Visual inspection of rendered `public/favicon.svg` + `public/icon-192.png` / `public/icon-512.png` + `16×16` preview (`read_file`).
- Zero purple/violet/indigo hex codes; consistent `#0f131a` background across SVG, PNGs, ICO, `index.html`, and `manifest.webmanifest`.
- `npm test`, `npm run lint`, `npm run build`, `.agents` `security_scan.py`, `lint_runner.py`, and `accessibility_checker.py` all pass after final edits.
