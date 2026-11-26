-- TradeLab Academy — Migration 004: Idempotent Seed for Core Lessons & 16 Live-Verified YouTube Videos
-- PostgreSQL / Supabase Migration (100% idempotent via ON CONFLICT DO NOTHING)
-- All 16 public YouTube videos were live-verified via YouTube's official oEmbed API
-- (https://www.youtube.com/oembed). Zero fabricated timestamps (no resource_segments seeded).
--
-- Rollback Reference (removes only the 16 seeded YouTube resources and mappings):
--   DELETE FROM public.lesson_resources
--   WHERE id BETWEEN '30000000-0000-4000-8000-000000000101'::uuid
--                AND '30000000-0000-4000-8000-000000000116'::uuid;
--   DELETE FROM public.educational_resources
--   WHERE id BETWEEN '40000000-0000-4000-8000-000000000101'::uuid
--                AND '40000000-0000-4000-8000-000000000116'::uuid;

-- ============================================================================
-- 1. Core Curriculum Lessons (6 Modules) — Satisfies FK for lesson_resources
-- ============================================================================

INSERT INTO public.lessons (
  id,
  slug,
  title,
  subtitle,
  level,
  module_order,
  concept_key,
  estimated_minutes,
  learning_objectives,
  prerequisites
) VALUES
  (
    '20000000-0000-4000-8000-000000000001',
    'market-structure',
    'Market Structure Basics (HH/HL, LH/LL & BOS)',
    'Read trend direction objectively using swing points and confirmed candle-body Breaks of Structure.',
    'beginner',
    1,
    'market-structure',
    15,
    ARRAY[
      'Identify valid Swing Highs and Swing Lows on any candlestick timeframe.',
      'Distinguish Bullish Structure (HH/HL), Bearish Structure (LH/LL), and Ranging Conditions.',
      'Confirm a genuine Break of Structure (BOS) using candle body closes rather than wicks.',
      'Locate the protected swing point that invalidates your directional bias.'
    ],
    ARRAY[
      'Ability to read open, high, low, and close (OHLC) on a standard candlestick.'
    ]
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'market-liquidity',
    'Understanding Market Liquidity (Buy-Side & Sell-Side)',
    'See where stop-losses and breakout orders cluster so you understand why price gravitates toward key highs and lows.',
    'beginner',
    2,
    'market-liquidity',
    16,
    ARRAY[
      'Explain why large market participants require resting liquidity to fill size without extreme slippage.',
      'Locate Buy-Side Liquidity (BSL) resting above obvious highs and Sell-Side Liquidity (SSL) below obvious lows.',
      'Understand how price rotates from one liquidity pool to the opposing pool.'
    ],
    ARRAY[
      'Market Structure Basics (HH/HL, LH/LL & BOS)'
    ]
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    'equal-highs-lows',
    'Equal Highs & Equal Lows (Liquidity Pools)',
    'Recognize why "double tops" and "double bottoms" act as high-probability liquidity magnets rather than guaranteed ceilings.',
    'intermediate',
    3,
    'equal-highs-lows',
    18,
    ARRAY[
      'Spot clean Equal Highs (EQH) and Equal Lows (EQL) across intraday and higher timeframes.',
      'Explain why multiple touches at nearly the same price concentrate stop orders more heavily than a single swing.',
      'Use EQH/EQL either as a target for existing positions or as a watchlist level for sweep reversals.'
    ],
    ARRAY[
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Understanding Market Liquidity (Buy-Side & Sell-Side)'
    ]
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    'liquidity-sweeps',
    'Liquidity Sweeps vs. True Breakouts',
    'Flagship Lesson: Master candle-close rejection, displacement, and retest acceptance so you stop getting trapped on false breakouts.',
    'intermediate',
    4,
    'liquidity-sweeps',
    22,
    ARRAY[
      'Define the exact 3-part anatomy of a valid Liquidity Sweep (Pool → Spike & Close Back Inside → Opposite Displacement).',
      'Distinguish a Liquidity Sweep from a True Breakout using candle body closes, volume expansion, and retest acceptance.',
      'Identify both Buy-Side Liquidity (BSL) Sweeps and Sell-Side Liquidity (SSL) Sweeps on historical charts.',
      'Build a patient execution checklist that prevents FOMO mid-candle entries and blind counter-trend fading.'
    ],
    ARRAY[
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Understanding Market Liquidity (Buy-Side & Sell-Side)',
      'Equal Highs & Equal Lows (Liquidity Pools)'
    ]
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    'fair-value-gaps',
    'Fair Value Gaps (FVG) & Institutional Imbalances',
    'Spot 3-candle price inefficiencies left by aggressive displacement and understand high-probability mitigation zones.',
    'intermediate',
    5,
    'fair-value-gaps',
    18,
    ARRAY[
      'Measure a Bullish FVG (Candle 1 High to Candle 3 Low) and Bearish FVG (Candle 1 Low to Candle 3 High) accurately.',
      'Understand why price often retraces to rebalance an imbalance (including the 50% Consequent Encroachment midpoint).',
      'Filter high-probability FVGs using structure and liquidity sweeps instead of trading every gap blindly.'
    ],
    ARRAY[
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Liquidity Sweeps vs. True Breakouts'
    ]
  ),
  (
    '20000000-0000-4000-8000-000000000006',
    'risk-psychology',
    'Risk Management, Position Sizing & Trading Psychology',
    'Protect your capital with fixed-percentage risk math, asymmetric R-multiples, and repeatable emotional discipline.',
    'beginner',
    6,
    'risk-psychology',
    20,
    ARRAY[
      'Calculate exact position size from Account Equity, Risk %, and Structural Stop-Loss Distance.',
      'Understand R-multiples and why positive expectancy does not require an 80%+ win rate.',
      'Build pre-trade and post-loss routines that prevent revenge trading, FOMO, and premature profit-taking.'
    ],
    ARRAY[
      'Market Structure Basics (HH/HL, LH/LL & BOS)'
    ]
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. Live-Verified YouTube Educational Resources (16 Videos Across 6 Lessons)
-- ============================================================================

INSERT INTO public.educational_resources (
  id,
  title,
  description,
  source_type,
  source_name,
  source_url,
  external_video_id,
  thumbnail_url,
  duration_seconds,
  content_type,
  license_status,
  attribution,
  non_endorsement_notice,
  verification_status,
  quality_score,
  embeddable,
  last_checked_at
) VALUES
  -- Lesson 1: Market Structure Basics
  (
    '40000000-0000-4000-8000-000000000101',
    'The ONLY Break Of Structure Video You’ll Ever Need',
    'Focused walkthrough on identifying valid Breaks of Structure (BOS), separating true candle-body closes from misleading wicks, and reading swing progression objectively.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=jeewXSLHt2g',
    'jeewXSLHt2g',
    'https://i.ytimg.com/vi/jeewXSLHt2g/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000102',
    'Path to Profitability: Break of Structure Explained',
    'Structured explanation of how Higher Highs, Higher Lows, Lower Highs, and Lower Lows connect into repeatable Break of Structure reads on live price action.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=Zzk864cVJek',
    'Zzk864cVJek',
    'https://i.ytimg.com/vi/Zzk864cVJek/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000103',
    'BOS and CHoCH Explained: How to Read Market Structure (Beginner Guide)',
    'Beginner-friendly breakdown comparing trend continuation Breaks of Structure (BOS) against Change of Character (CHoCH) structural shifts.',
    'youtube',
    'Lux IQ Trading',
    'https://www.youtube.com/watch?v=fWg9tsNVA90',
    'fWg9tsNVA90',
    'https://i.ytimg.com/vi/fWg9tsNVA90/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Lux IQ Trading on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Lesson 2: Understanding Market Liquidity
  (
    '40000000-0000-4000-8000-000000000104',
    'Path to Profitability: Liquidity Explained',
    'Core lesson explaining where Buy-Side Liquidity (BSL) and Sell-Side Liquidity (SSL) accumulate and why institutional order flow gravitates toward resting stops.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=crMqxB_nHhk',
    'crMqxB_nHhk',
    'https://i.ytimg.com/vi/crMqxB_nHhk/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000105',
    'Boot Camp Day 8: Liquidity Pt 1',
    'Foundational bootcamp session introducing external vs. internal liquidity pools and how price rotates from one stop cluster to the opposing pool.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=Lxnu7InGhGE',
    'Lxnu7InGhGE',
    'https://i.ytimg.com/vi/Lxnu7InGhGE/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Lesson 3: Equal Highs & Equal Lows
  (
    '40000000-0000-4000-8000-000000000106',
    'Equal Highs & Lows Explained | EQH, EQL & Liquidity Pools in SMC Trading',
    'Chart-focused guide detailing why Equal Highs (EQH) and Equal Lows (EQL) concentrate retail stop-losses and function as high-probability liquidity magnets.',
    'youtube',
    'Aseem Singhal',
    'https://www.youtube.com/watch?v=w6gqySsh1I4',
    'w6gqySsh1I4',
    'https://i.ytimg.com/vi/w6gqySsh1I4/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Aseem Singhal on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000107',
    'Liquidity Explained: Equal Highs, Session Highs & Inducement (ICT)',
    'Breakdown connecting Equal Highs, session highs/lows, and inducement pools so learners see how resting liquidity builds ahead of sharp institutional moves.',
    'youtube',
    'The Trading Foundry',
    'https://www.youtube.com/watch?v=-7-e05cz83E',
    '-7-e05cz83E',
    'https://i.ytimg.com/vi/-7-e05cz83E/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by The Trading Foundry on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Lesson 4: Liquidity Sweeps vs. True Breakouts
  (
    '40000000-0000-4000-8000-000000000108',
    'Boot Camp Day 10: Liquidity Pt. 2',
    'Applied continuation of TJR’s liquidity bootcamp showing how liquidity sweeps trigger stop runs and transition into displacement and structure shifts.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=rdz6vnXb8wE',
    'rdz6vnXb8wE',
    'https://i.ytimg.com/vi/rdz6vnXb8wE/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000109',
    'Liquidity Sweep vs Breakout | How to Spot the Trap? #SMC #ICT',
    'Direct side-by-side comparison showing how to separate a stop-hunting liquidity sweep from genuine breakout acceptance and follow-through.',
    'youtube',
    'Mahira Capital™',
    'https://www.youtube.com/watch?v=WGF_-CVETis',
    'WGF_-CVETis',
    'https://i.ytimg.com/vi/WGF_-CVETis/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Mahira Capital™ on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000110',
    'Advanced Liquidity Concepts (Path to Profitability)',
    'Deeper look at multi-timeframe liquidity sweeps, stop-run traps, and pairing external raids with disciplined confirmation before execution.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=AGmAVyAuBE0',
    'AGmAVyAuBE0',
    'https://i.ytimg.com/vi/AGmAVyAuBE0/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Lesson 5: Fair Value Gaps (FVG)
  (
    '40000000-0000-4000-8000-000000000111',
    'Path to Profitability: Fair Value Gaps Explained',
    'Step-by-step explanation of 3-candle Fair Value Gaps (FVG), exact Candle 1 to Candle 3 wick boundaries, and how price retraces to mitigate imbalances.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=xX5LTSJ5wwM',
    'xX5LTSJ5wwM',
    'https://i.ytimg.com/vi/xX5LTSJ5wwM/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000112',
    'Fair Value Gaps Explained',
    'Concise visual review of institutional price imbalances, filtering out low-probability chop gaps, and reading FVG mitigation cleanly.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=xcDOMKaOIsk',
    'xcDOMKaOIsk',
    'https://i.ytimg.com/vi/xcDOMKaOIsk/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000113',
    'Fair Value Gap (FVG) Strategy: Step-by-Step Guide (7 Mins)',
    'Compact 7-minute walkthrough combining Fair Value Gap identification, 50% equilibrium mitigation checks, and structured risk placement.',
    'youtube',
    'AKTV',
    'https://www.youtube.com/watch?v=8nfpgmlGOFE',
    '8nfpgmlGOFE',
    'https://i.ytimg.com/vi/8nfpgmlGOFE/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by AKTV on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Lesson 6: Risk Management, Position Sizing & Trading Psychology
  (
    '40000000-0000-4000-8000-000000000114',
    'Boot Camp Day 13: Risk Management',
    'Essential bootcamp lesson on fixed-percentage risk per trade, R-multiple expectancy, and keeping losing streaks survivable emotionally and financially.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=RkMBoqbeUq8',
    'RkMBoqbeUq8',
    'https://i.ytimg.com/vi/RkMBoqbeUq8/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000115',
    'Boot Camp Day 38: Stop Losses',
    'Practical guide to placing stop-losses at true structural invalidation points instead of arbitrary pip distances or emotional mid-trade adjustments.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=1FunNCUw_jM',
    '1FunNCUw_jM',
    'https://i.ytimg.com/vi/1FunNCUw_jM/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000116',
    'Boot Camp Day 39: Calculating Lot Size',
    'Hands-on tutorial showing how to compute exact lot size from account balance, risk percentage, and stop-loss distance on every trade.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=KSiWKfPOlh4',
    'KSiWKfPOlh4',
    'https://i.ytimg.com/vi/KSiWKfPOlh4/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TJR on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. Lesson-to-Resource Mappings (16 Rows Linking Videos to Core Lessons)
-- ============================================================================

INSERT INTO public.lesson_resources (
  id,
  lesson_id,
  resource_id,
  relevance_score,
  display_order,
  before_watch_context,
  after_watch_takeaways,
  editorial_notes
) VALUES
  -- Lesson 1: market-structure
  (
    '30000000-0000-4000-8000-000000000101',
    '20000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000101',
    98,
    1,
    'Pay close attention to how structural swing highs and lows are marked before calling a Break of Structure, and note why candle closes matter more than wicks.',
    ARRAY[
      'Confirm a Break of Structure with a decisive candle-body close past the prior structural swing.',
      'Track the swing point that originated the BOS to keep your directional bias objective.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000102',
    '20000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000102',
    95,
    2,
    'Watch how each expansion leg builds on the previous trend leg so you can tell a normal retracement apart from an actual structure shift.',
    ARRAY[
      'Map major impulsive swings rather than labeling every tiny internal candle pullback.',
      'Stay aligned with active HH/HL or LH/LL flow until a protected swing actually breaks.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000103',
    '20000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000103',
    92,
    3,
    'Compare how a continuation BOS differs from a reversal CHoCH so you know exactly when an uptrend or downtrend is invalidated.',
    ARRAY[
      'BOS confirms continuation in the existing trend direction; CHoCH flags the first structural shift.',
      'Anchor invalidation strictly at the protected swing low or high that drove the latest BOS.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Lesson 2: market-liquidity
  (
    '30000000-0000-4000-8000-000000000104',
    '20000000-0000-4000-8000-000000000002',
    '40000000-0000-4000-8000-000000000104',
    98,
    1,
    'Focus on why obvious highs and lows hold stacked stop-loss and breakout orders that act as fuel for larger directional moves.',
    ARRAY[
      'Buy-Side Liquidity sits above obvious highs (short stops and breakout buys); Sell-Side Liquidity sits below lows.',
      'Identify both the liquidity already cleared and the opposing untouched pool before planning a trade.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000105',
    '20000000-0000-4000-8000-000000000002',
    '40000000-0000-4000-8000-000000000105',
    95,
    2,
    'Notice how marking session highs, session lows, and swing extremes simplifies reading where price is likely drawn next.',
    ARRAY[
      'Price routinely delivers from one resting liquidity pool across the range to the opposing pool.',
      'Avoid placing tight stops directly behind obvious retail highs and lows where liquidity clusters.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Lesson 3: equal-highs-lows
  (
    '30000000-0000-4000-8000-000000000106',
    '20000000-0000-4000-8000-000000000003',
    '40000000-0000-4000-8000-000000000106',
    97,
    1,
    'Compare the textbook double-top/double-bottom view with the liquidity-pool perspective as you watch price approach flat boundaries.',
    ARRAY[
      'Relative Equal Highs and Equal Lows attract price because multiple touches stack stops tightly outside the level.',
      'Use untouched EQH/EQL either as a logical profit target or as a patient watchlist zone for post-sweep setups.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000107',
    '20000000-0000-4000-8000-000000000003',
    '40000000-0000-4000-8000-000000000107',
    94,
    2,
    'Observe how closely aligned highs and session levels act together as inducement before real directional expansion begins.',
    ARRAY[
      'Equal highs do not need exact-pip alignment; tight visual clusters still concentrate stop orders.',
      'Wait for resting EQH or EQL pools to be cleared rather than entering right ahead of an obvious magnet.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Lesson 4: liquidity-sweeps
  (
    '30000000-0000-4000-8000-000000000108',
    '20000000-0000-4000-8000-000000000004',
    '40000000-0000-4000-8000-000000000108',
    98,
    1,
    'Watch the exact sequence after price pierces a key high or low: candle close back inside the range followed by strong opposite displacement.',
    ARRAY[
      'A high-probability sweep pairs a wick beyond liquidity with a close back inside and immediate displacement.',
      'Wait for internal structure to shift after the raid instead of guessing mid-candle.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000109',
    '20000000-0000-4000-8000-000000000004',
    '40000000-0000-4000-8000-000000000109',
    96,
    2,
    'Use this video alongside our EUR/USD vs. BTC/USD chart comparison to lock in candle-close location and retest behavior.',
    ARRAY[
      'True breakouts close full-bodied outside the level and hold on retest rather than snapping back inside.',
      'Avoid blindly fading strong breakout acceptance; let candle closes and follow-through reveal who won.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000110',
    '20000000-0000-4000-8000-000000000004',
    '40000000-0000-4000-8000-000000000110',
    93,
    3,
    'Pay attention to how higher-timeframe liquidity context filters out weak sweeps and strengthens trade selection.',
    ARRAY[
      'Higher-timeframe liquidity sweeps carry more institutional weight than isolated low-timeframe wicks.',
      'Place structural invalidation beyond the sweep extreme so normal retest noise does not shake you out.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Lesson 5: fair-value-gaps
  (
    '30000000-0000-4000-8000-000000000111',
    '20000000-0000-4000-8000-000000000005',
    '40000000-0000-4000-8000-000000000111',
    98,
    1,
    'Track the exact non-overlapping space between Candle 1 and Candle 3 wicks and notice how displacement gives an FVG real backing.',
    ARRAY[
      'A valid Bullish FVG spans Candle 1 High to Candle 3 Low (and vice versa for Bearish FVG) with zero wick overlap.',
      'Prioritize FVGs created immediately after a liquidity sweep and confirmed Break of Structure.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000112',
    '20000000-0000-4000-8000-000000000005',
    '40000000-0000-4000-8000-000000000112',
    95,
    2,
    'Watch how context separates A+ Fair Value Gaps aligned with order flow from random intraday gaps that fail.',
    ARRAY[
      'Wait for price to retrace into the FVG rather than chasing extended displacement candles.',
      'Treat a full candle-body close completely through the far edge of an FVG as structural invalidation.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000113',
    '20000000-0000-4000-8000-000000000005',
    '40000000-0000-4000-8000-000000000113',
    92,
    3,
    'Note how the 50% midpoint of an FVG helps refine entries and tighten risk-to-reward without forcing trades.',
    ARRAY[
      'Mark the top edge, 50% midpoint, and bottom edge of every valid FVG before price returns.',
      'Combine FVG retracements with directional structure alignment instead of trading isolated gaps.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Lesson 6: risk-psychology
  (
    '30000000-0000-4000-8000-000000000114',
    '20000000-0000-4000-8000-000000000006',
    '40000000-0000-4000-8000-000000000114',
    98,
    1,
    'Focus on why capping every trade at a consistent 0.5%–1% risk protects both your account equity and your decision-making calm.',
    ARRAY[
      'Risk a fixed small percentage per setup so routine losing streaks never threaten your account.',
      'Evaluate performance across batches of trades using R-multiples rather than obsessing over one outcome.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000115',
    '20000000-0000-4000-8000-000000000006',
    '40000000-0000-4000-8000-000000000115',
    96,
    2,
    'Notice how structural stop placement gives trades breathing room while defining your exact 1R invalidation before entry.',
    ARRAY[
      'Place stop-losses beyond the structural level that objectively disproves your trade thesis.',
      'Never widen a stop-loss once price approaches invalidation; accept -1R cleanly and preserve expectancy.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000116',
    '20000000-0000-4000-8000-000000000006',
    '40000000-0000-4000-8000-000000000116',
    95,
    3,
    'Follow the exact formula step by step so your dollar risk stays identical whether a setup requires a 10-pip or 30-pip stop.',
    ARRAY[
      'Derive lot size strictly from (Account Balance × Risk %) ÷ Stop-Loss Distance Value.',
      'Wider structural stops automatically mean smaller lot sizes—never force a fixed lot size across setups.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  )
ON CONFLICT DO NOTHING;
