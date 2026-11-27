---
version: "2.0"
name: TradeLab Editorial Fintech
description: Calm, typography-led editorial fintech design system for TradeLab Academy. Restrained dark/light surfaces, architectural 1px hairlines, single signal-blue brand accent, semantic market colors, and purposeful reduced-motion-safe choreography.
colors:
  canvas-dark: "#0f131a"
  surface-dark: "#161b24"
  elevated-dark: "#1e2531"
  border-dark: "#262e3d"
  ink-dark: "#e6e9ef"
  muted-dark: "#8c94a4"
  canvas-light: "#f8f9fb"
  surface-light: "#ffffff"
  elevated-light: "#eef1f6"
  border-light: "#dfe4ec"
  ink-light: "#111621"
  muted-light: "#555e6f"
  primary: "#2962ff"
  primary-text-dark: "#609bff"
  primary-text-light: "#1e53e5"
  primary-fg: "#ffffff"
  bull: "#089981"
  bear: "#f23645"
  caution: "#e59400"
  info: "#2196f3"
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0em
  mono-data:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0em
  mono-micro:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-fg}"
    rounded: "{rounded.md}"
    padding: 10px
  input-field:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.md}"
    padding: 10px
  topbar:
    backgroundColor: "{colors.surface-dark}"
    height: 60px
---

# TradeLab Editorial Fintech

## Overview
TradeLab Academy is a disciplined financial education platform. Its visual identity combines **institutional trading-desk precision** with **modern digital-publication calm**. Every element earns its space: typography, whitespace, and `1px` architectural hairlines do the structural work that generic SaaS templates force onto repetitive boxes, drop shadows, and glowing badges.

- **Design Dials:** `DESIGN_VARIANCE: 6` · `MOTION_INTENSITY: 4` · `VISUAL_DENSITY: 4`
- **Page-Distinct Compositions:** Login (asymmetric editorial folio + minimal auth column), Dashboard (unboxed publication overview + hairline index), Academy Catalog (university syllabus split ledger), Lesson Reader (focused single-column publication with on-demand Mentor drawer), and Trading Tools (high-clarity analytical workstation).

## Colors
- **Dark Surfaces (Default):** Deep slate-charcoal canvas (`#0f131a`), quiet elevated reading surface (`#161b24`), crisp `1px` structural hairline (`#262e3d`), low-fatigue silver ink (`#e6e9ef`), and WCAG-AA muted slate (`#8c94a4`).
- **Light Surfaces:** Cool archival paper canvas (`#f8f9fb`), pure crisp surface (`#ffffff`), refined hairline (`#dfe4ec`), deep ink (`#111621`), and readable secondary slate (`#555e6f`).
- **Single Brand Accent:** Signal Blue (`#2962ff` fill / `#609bff` dark link / `#1e53e5` light link) — reserved exclusively for primary actions, active navigation indicators, and learning progress.
- **Strictly Semantic Financial Colors:** Bullish Green (`#089981`), Bearish Red (`#f23645`), and Caution Amber (`#e59400`) appear ONLY for actual price direction, P&L, quiz correctness, and risk warnings — never as random decorative section colors.
- **Zero Purple Ban:** Purple, violet, indigo, and fuchsia are strictly prohibited.

## Typography
- **Sans (`Plus Jakarta Sans`):** Tight-tracked editorial headings (`-0.025em` to `-0.03em`), `text-wrap: balance` on display titles, comfortable `1.6–1.65` body line-height constrained to `65ch–72ch` in reading flows.
- **Mono (`IBM Plex Mono`):** Strictly for prices, percentages, OHLC readouts, PH timestamps, and lesson codes (`1.1`, `7.3`, `F1.6`, `PH1.1`) with `tabular-nums`.

## Layout
- **No Generic Persistent Icon Sidebar:** Desktop navigation uses a single-line, `60px` (`h-15` / `h-[60px]`) architectural top bar with clean underline active states and a quiet overflow menu for secondary tools. Mobile adapts to a dedicated slide-over navigation sheet plus a clean 5-slot bottom bar with zero horizontal overflow down to `360px`.
- **Anti-Card-Soup:** Group related sections with vertical whitespace (`space-y-10` / `py-8`) and subtle `1px` hairlines (`border-t` / `divide-y`). Reserve bordered surfaces for genuinely interactive controls (auth inputs, charts, order tickets, quizzes).

## Elevation & Depth
- **Flat Architectural Layering:** Depth comes from subtle tonal steps (`canvas → surface → elevated`) and `1px` hairlines rather than heavy drop shadows or frosted glassmorphism.

## Shapes
- **Consistent Tight Geometry:** `rounded-md` (`6–8px`) for buttons, inputs, and controls; `rounded-lg` (`10–12px`) for interactive workspaces (charts, dialogs, drawers). Never mix giant `rounded-3xl` bubbles with sharp data panels.

## Motion
- **Minimalist Editorial Choreography (`src/index.css`):** Pure GPU-accelerated CSS (`transform` & `opacity`, `cubic-bezier(0.22, 1, 0.36, 1)` expo-out easing, zero extra dependencies):
  - Subtle `6px` fade-up route transitions (`.tl-page-enter`)
  - Restrained staggered entrance (`.tl-stagger`) for key reading/hero groups
  - Crisp hairline row hover + subtle arrow translation (`.tl-row-interactive`)
  - Tactile button micro-press (`.tl-press`)
  - Full `@media (prefers-reduced-motion: reduce)` disablement.

## Do's and Don'ts
- **Do** tailor each page's layout composition to its job (Login ≠ Dashboard ≠ Syllabus ≠ Lesson Reader ≠ Simulator).
- **Do** keep navigation single-line on desktop (`1280px` & `1440px`) and overflow-free on mobile (`360px` & `390px`).
- **Do** preserve every route, Supabase Auth flow, PH-time readout, Taglish toggle, acronym expansion, and interactive tool.
- **Don't** wrap every list, stat, or paragraph inside a bordered rounded rectangle.
- **Don't** put an uppercase tracking eyebrow above every section (max 1 per 3 sections).
- **Don't** use glassmorphism, neon glows, random gradients, or purple/violet accents.
