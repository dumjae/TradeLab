-- TradeLab Academy — Migration 008: Balanced 27-Lesson Curriculum & 19 Live-Verified YouTube Tutorials
-- PostgreSQL / Supabase Migration (100% idempotent)
-- Rebalances curriculum into:
--   - 15 Universal Core ('general') lessons (module_order 1..15), starting with Lesson 01: Chart Reading Fundamentals
--   - 3 Crypto lessons (module_order 16..18)
--   - 3 Forex lessons (module_order 19..21)
--   - 3 Stocks lessons (module_order 22..24)
--   - 3 Indices lessons (module_order 25..27)
-- Seeds 9 new lessons (0019–0027) and 19 live-verified public YouTube educational videos (0901–0919).
-- Zero fabricated timestamps (no resource_segments seeded).
--
-- Rollback Reference (execute in reverse dependency order if reverting):
--   DELETE FROM public.lesson_resources
--   WHERE id BETWEEN '30000000-0000-4000-8000-000000000901'::uuid
--                AND '30000000-0000-4000-8000-000000000919'::uuid;
--   DELETE FROM public.educational_resources
--   WHERE id BETWEEN '40000000-0000-4000-8000-000000000901'::uuid
--                AND '40000000-0000-4000-8000-000000000919'::uuid;
--   DELETE FROM public.lessons
--   WHERE id BETWEEN '20000000-0000-4000-8000-000000000019'::uuid
--                AND '20000000-0000-4000-8000-000000000027'::uuid;
--   DROP INDEX IF EXISTS public.idx_lessons_market_order;

-- ============================================================================
-- 1. Targeted Composite Index for Market Track Queries
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_lessons_market_order
  ON public.lessons(market_category, module_order ASC);

-- ============================================================================
-- 2. Re-Order Existing 18 Lessons into Balanced 27-Lesson Sequence
-- ============================================================================

UPDATE public.lessons
SET
  module_order = 2,
  prerequisites = ARRAY['Lesson 01: Chart Reading Fundamentals'],
  updated_at = now()
WHERE id = '20000000-0000-4000-8000-000000000007'; -- candlestick-anatomy

UPDATE public.lessons
SET
  module_order = 3,
  prerequisites = ARRAY[
    'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
    'Candlestick Anatomy & Reading Price Action'
  ],
  updated_at = now()
WHERE id = '20000000-0000-4000-8000-000000000001'; -- market-structure

UPDATE public.lessons SET module_order = 4,  updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000008'; -- support-resistance-supply-demand
UPDATE public.lessons SET module_order = 5,  updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000002'; -- market-liquidity
UPDATE public.lessons SET module_order = 6,  updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000003'; -- equal-highs-lows
UPDATE public.lessons SET module_order = 7,  updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000004'; -- liquidity-sweeps
UPDATE public.lessons SET module_order = 8,  updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000005'; -- fair-value-gaps
UPDATE public.lessons SET module_order = 9,  updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000009'; -- order-blocks-bos-choch
UPDATE public.lessons SET module_order = 10, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000010'; -- multi-timeframe-alignment
UPDATE public.lessons SET module_order = 11, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000015'; -- confluence-a-plus-setups
UPDATE public.lessons SET module_order = 12, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000016'; -- trade-management-partials-be
UPDATE public.lessons SET module_order = 13, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000006'; -- risk-psychology
UPDATE public.lessons SET module_order = 14, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000017'; -- trading-journal-expectancy
UPDATE public.lessons SET module_order = 15, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000018'; -- drawdown-scaling-consistency
UPDATE public.lessons SET module_order = 17, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000013'; -- crypto-247-liquidity-playbook
UPDATE public.lessons SET module_order = 20, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000011'; -- forex-sessions-killzones
UPDATE public.lessons SET module_order = 23, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000014'; -- stocks-gaps-rvol-playbook
UPDATE public.lessons SET module_order = 26, updated_at = now() WHERE id = '20000000-0000-4000-8000-000000000012'; -- indices-ny-open-playbook

-- ============================================================================
-- 3. Upsert 9 New Curriculum Modules (0019–0027)
-- ============================================================================

INSERT INTO public.lessons (
  id,
  slug,
  title,
  subtitle,
  level,
  market_category,
  learning_stage,
  module_order,
  concept_key,
  estimated_minutes,
  learning_objectives,
  prerequisites
) VALUES
  -- Module 01: Chart Reading Fundamentals (Universal Core)
  (
    '20000000-0000-4000-8000-000000000019',
    'chart-reading-fundamentals',
    'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
    'Start from absolute zero: learn what 5m, 15m, 1H, 4H, and 1D timeframes mean, read Time vs. Price axes, and master the core tools on every trading platform.',
    'beginner',
    'general',
    'foundations',
    1,
    'chart-reading-fundamentals',
    14,
    ARRAY[
      'Read the X-axis (Bottom = Time) and Y-axis (Right = Price) effortlessly on any asset chart.',
      'Explain exactly what 1m, 5m, 15m, 1H, 4H, 1D, and 1W timeframes mean and how smaller candles combine into bigger ones.',
      'Check essential chart tools before trading: Timeframe Switcher, Candle Countdown Timer, Volume Bars, and Bid/Ask Spread Line.',
      'Use the Crosshair, Zoom, Watchlist, and 3 core drawing tools (Horizontal Line, Ruler, Long/Short Position Tool) cleanly.'
    ],
    ARRAY[
      'Zero prior trading experience required — start right here.'
    ]
  ),
  -- Module 16: Crypto Track 1
  (
    '20000000-0000-4000-8000-000000000020',
    'crypto-spot-perps-orderbook',
    'Crypto Foundations: Spot vs. Perpetual Futures, Leverage & Order Books',
    'Learn how Crypto exchanges work from scratch: owning real coins (Spot) vs. trading Perpetual Futures, how Maker/Taker fees add up, and how to avoid liquidation.',
    'beginner',
    'crypto',
    'market_playbooks',
    16,
    'crypto-spot-perps',
    16,
    ARRAY[
      'Distinguish Spot ownership from Perpetual Futures contracts and know when each tool fits.',
      'Read a live Crypto Order Book (Bids, Asks, Spread, and Depth) and understand Maker vs. Taker fees.',
      'Explain Isolated vs. Cross Margin and why high leverage shrinks your liquidation distance dangerously close.',
      'Size every Crypto trade by fixed account risk % and hard SL (Stop Loss) — never by random 20x–50x leverage sliders.'
    ],
    ARRAY[
      'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
      'Risk Management, Position Sizing & Trading Psychology'
    ]
  ),
  -- Module 18: Crypto Track 3
  (
    '20000000-0000-4000-8000-000000000021',
    'crypto-volatility-altcoin-cycles',
    'Crypto Cycles: BTC Dominance, Altcoin Rotation & Liquidation Heatmaps',
    'Time when capital rotates from Bitcoin into Altcoins using BTC.D (Bitcoin Dominance), read Liquidation Heatmaps, and size down for high-beta volatility.',
    'intermediate',
    'crypto',
    'market_playbooks',
    18,
    'crypto-altcoin-cycles',
    18,
    ARRAY[
      'Read the 4-step Crypto Capital Rotation Matrix combining BTC price direction and BTC.D (Bitcoin Dominance).',
      'Use Liquidation Heatmaps alongside Market Structure to avoid chasing late entries into crowded leverage.',
      'Adapt stop distance and position sizing for high-volatility Altcoins vs. Bitcoin.',
      'Spot when an Alt Season rotation is genuinely healthy vs. a risky late-stage blow-off top.'
    ],
    ARRAY[
      'Crypto Playbook: 24/7 Volatility, BTC Dominance & Funding',
      'Equal Highs & Equal Lows (Resting Stop Clusters)'
    ]
  ),
  -- Module 19: Forex Track 1
  (
    '20000000-0000-4000-8000-000000000022',
    'forex-pairs-pips-lots-spreads',
    'Forex Foundations: Currency Pairs, Pips, Lots & Spreads Explained',
    'Master the building blocks of Forex (FX) trading: Base vs. Quote currencies, how Pips work, Standard/Mini/Micro Lot math, and hidden Spread costs.',
    'beginner',
    'forex',
    'market_playbooks',
    19,
    'forex-pips-lots',
    16,
    ARRAY[
      'Read any Forex pair instantly by separating the Base currency (left) and Quote currency (right).',
      'Measure Pip distance cleanly on both 4-decimal majors (EUR/USD) and 2-decimal Yen pairs (USD/JPY).',
      'Calculate exact Lot Size (Micro 0.01, Mini 0.10, Standard 1.00) from your Risk $ and SL (Stop Loss) pips.',
      'Factor Bid/Ask Spread and 5:00 PM NY rollover spread widening into every stop loss and entry.'
    ],
    ARRAY[
      'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
      'Risk Management, Position Sizing & Trading Psychology'
    ]
  ),
  -- Module 21: Forex Track 3
  (
    '20000000-0000-4000-8000-000000000023',
    'forex-macro-news-rates',
    'Forex Macro: Central Banks, Interest Rates & High-Impact News (CPI / NFP)',
    'Understand why interest rates steer multi-week currency trends, how to read an economic calendar, and how to stay safe around CPI, NFP, and FOMC releases.',
    'intermediate',
    'forex',
    'market_playbooks',
    21,
    'forex-macro-news',
    18,
    ARRAY[
      'Explain how Interest Rate Differentials and Central Bank tone (Hawkish vs. Dovish) drive HTF (Higher Timeframe) Forex trends.',
      'Use an Economic Calendar every morning before trading to flag red-folder news (CPI, NFP, FOMC, ECB, BOE, BOJ).',
      'Protect open trades from news slippage and two-way whipsaw spikes.',
      'Trade cleanly AFTER high-impact news by waiting for post-release sweeps and confirmed BOS (Break of Structure).'
    ],
    ARRAY[
      'Forex Foundations: Currency Pairs, Pips, Lots & Spreads Explained',
      'Forex Playbook: Session Liquidity & London/NY Killzones'
    ]
  ),
  -- Module 22: Stocks Track 1
  (
    '20000000-0000-4000-8000-000000000024',
    'stocks-market-hours-volume-order-types',
    'Stocks Foundations: Market Hours, Share Sizing & Order Types',
    'Learn how US Stock exchanges work: Pre-Market vs. Regular Hours (9:30 AM–4:00 PM ET), Market/Limit/Stop orders, Share Sizing math, and Liquidity checks.',
    'beginner',
    'stocks',
    'market_playbooks',
    22,
    'stocks-hours-orders',
    16,
    ARRAY[
      'Navigate Pre-Market, Regular Trading Hours (9:30 AM–4:00 PM ET), Power Hour, and After-Hours liquidity.',
      'Choose the right order type — Market, Limit, Stop-Loss, and Stop-Limit — without accidental slippage.',
      'Calculate exact Share Count cleanly using Shares = Risk $ ÷ Stop Distance ($).',
      'Filter out illiquid penny stocks by requiring healthy daily volume and tight Bid/Ask spreads.'
    ],
    ARRAY[
      'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
      'Risk Management, Position Sizing & Trading Psychology'
    ]
  ),
  -- Module 24: Stocks Track 3
  (
    '20000000-0000-4000-8000-000000000025',
    'stocks-earnings-relative-strength',
    'Stocks Edge: Earnings Catalysts, Sector Leaders & Relative Strength',
    'Trade institutional Stocks in Play after quarterly earnings using Relative Strength vs. SPY/QQQ so you back market leaders instead of laggards.',
    'intermediate',
    'stocks',
    'market_playbooks',
    24,
    'stocks-earnings-rs',
    18,
    ARRAY[
      'Explain why trading AFTER an Earnings surprise beats gambling on overnight binary gaps.',
      'Spot institutional Relative Strength (RS) and Relative Weakness (RW) by comparing a stock directly against SPY/QQQ.',
      'Combine fresh Catalyst + RVOL (Relative Volume ≥ 2.0) + Leading Sector to pick top equity setups.',
      'Execute disciplined multi-day or intraday pullbacks on post-earnings Stocks in Play.'
    ],
    ARRAY[
      'Stocks Foundations: Market Hours, Share Sizing & Order Types',
      'Stocks Playbook: Pre-Market Gaps, RVOL & Opening Range'
    ]
  ),
  -- Module 25: Indices Track 1
  (
    '20000000-0000-4000-8000-000000000026',
    'indices-nas100-spx500-basics',
    'Indices Foundations: NAS100, SPX500 & US30 Points, Contracts & Volatility',
    'Understand what a Stock Index actually is, compare NAS100 vs. SPX500 vs. US30 personality, and size index Points and Contracts without over-leveraging.',
    'beginner',
    'indices',
    'market_playbooks',
    25,
    'indices-basics',
    15,
    ARRAY[
      'Compare the composition, speed, and personality of SPX500 (S&P 500), NAS100 (Nasdaq 100), and US30 (Dow Jones).',
      'Distinguish Futures (ES/MES, NQ/MNQ) vs. Index CFDs and always verify Dollar-per-Point contract specs.',
      'Calculate exact Index contract/lot size from Risk $, Stop Distance (Points), and Dollar-per-Point.',
      'Explain why Indices carry natural long-term upward drift and concentrate peak action at the 9:30 AM NY Equity Open.'
    ],
    ARRAY[
      'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
      'Risk Management, Position Sizing & Trading Psychology'
    ]
  ),
  -- Module 27: Indices Track 3
  (
    '20000000-0000-4000-8000-000000000027',
    'indices-risk-on-correlations',
    'Indices Edge: VIX (Fear Index), DXY & Risk-On / Risk-Off Correlations',
    'Use VIX volatility regimes, US Dollar Index (DXY), Treasury yields, and SMT (Smart Money Divergence) between SPX500 and NAS100 to filter A+ Index setups.',
    'intermediate',
    'indices',
    'market_playbooks',
    27,
    'indices-correlations',
    18,
    ARRAY[
      'Read VIX volatility regimes to adapt stop distance, profit targets, and position size dynamically.',
      'Check DXY (US Dollar Index) and Treasury Yields as macro tailwinds or headwinds for Risk-On vs. Risk-Off sessions.',
      'Spot bullish and bearish SMT (Smart Money Divergence) between correlated indices (SPX500 vs. NAS100).',
      'Combine macro correlation filters with 9:30 AM NY structure so you never trade blind against a Risk-Off wave.'
    ],
    ARRAY[
      'Indices Foundations: NAS100, SPX500 & US30 Points, Contracts & Volatility',
      'Indices Playbook: NY Open Manipulation & Opening Range Sweeps'
    ]
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  level = EXCLUDED.level,
  market_category = EXCLUDED.market_category,
  learning_stage = EXCLUDED.learning_stage,
  module_order = EXCLUDED.module_order,
  estimated_minutes = EXCLUDED.estimated_minutes,
  learning_objectives = EXCLUDED.learning_objectives,
  prerequisites = EXCLUDED.prerequisites,
  updated_at = now();

-- ============================================================================
-- 4. Seed 19 Live-Verified Public YouTube Educational Resources (0901–0919)
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
  -- Module 01: Chart Reading Fundamentals
  (
    '40000000-0000-4000-8000-000000000901',
    'Which is the best timeframe to trade (for beginners)?',
    'Clear beginner breakdown of how 5m, 15m, 1H, 4H, and 1D timeframes work, how noise increases on lower timeframes, and how to pick a calm starting chart.',
    'youtube',
    'Rayner Teo',
    'https://www.youtube.com/watch?v=POJFoQYVXnM',
    'POJFoQYVXnM',
    'https://i.ytimg.com/vi/POJFoQYVXnM/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Rayner Teo on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    93,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000902',
    'How To Use TradingView For BEGINNERS [Full 2025 Tutorial]',
    'Hands-on walkthrough of essential charting platform controls: Timeframe Switcher, X/Y Axes, Watchlist setup, Crosshair, Volume, and core drawing tools.',
    'youtube',
    'Craig Percoco',
    'https://www.youtube.com/watch?v=rJj4ZbnzEGs',
    'rJj4ZbnzEGs',
    'https://i.ytimg.com/vi/rJj4ZbnzEGs/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Craig Percoco on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 16: Crypto Spot vs. Perpetual Futures
  (
    '40000000-0000-4000-8000-000000000903',
    'Spot vs Futures',
    'Direct comparison between owning real coins on the Spot market versus trading leveraged Crypto Futures contracts, including liquidation safety.',
    'youtube',
    'The Present',
    'https://www.youtube.com/watch?v=gm7RO7-wwuA',
    'gm7RO7-wwuA',
    'https://i.ytimg.com/vi/gm7RO7-wwuA/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by The Present on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000904',
    'What Are Crypto Derivatives? (Perpetual, Futures Contract Explained)',
    'Clear explainer on how Perpetual Futures contracts work without an expiry date, how funding rates anchor contract prices to Spot, and margin mechanics.',
    'youtube',
    'Coingecko',
    'https://www.youtube.com/watch?v=5vW7hX6k5ho',
    '5vW7hX6k5ho',
    'https://i.ytimg.com/vi/5vW7hX6k5ho/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Coingecko on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 18: Crypto Volatility & Altcoin Cycles
  (
    '40000000-0000-4000-8000-000000000905',
    'Bitcoin Dominance Explained For Beginners! How To Spot Alt Season',
    'Beginner-friendly guide to reading BTC.D (Bitcoin Dominance) alongside Bitcoin price action to time capital rotation into high-liquidity Altcoins.',
    'youtube',
    'SolanaFloor',
    'https://www.youtube.com/watch?v=5RyW6jqTplI',
    '5RyW6jqTplI',
    'https://i.ytimg.com/vi/5RyW6jqTplI/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by SolanaFloor on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000906',
    'Liquidation Heatmaps Explained in 5 minutes (Bitcoin Heatmaps for Trading)',
    'Concise 5-minute walkthrough showing how Liquidation Heatmaps highlight dense pockets of leveraged Long and Short stops acting as Crypto liquidity magnets.',
    'youtube',
    'The Blockchain Today',
    'https://www.youtube.com/watch?v=qFwvTRATC-c',
    'qFwvTRATC-c',
    'https://i.ytimg.com/vi/qFwvTRATC-c/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by The Blockchain Today on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 19: Forex Pairs, Pips, Lots & Spreads
  (
    '40000000-0000-4000-8000-000000000907',
    'What Is Forex Trading? (Video 1 of 13)',
    'Foundational introduction to Foreign Exchange (FX) currency pairs, Base vs. Quote pricing, Major vs. Minor pairs, and how Bid/Ask spreads work.',
    'youtube',
    'Rayner Teo',
    'https://www.youtube.com/watch?v=fHGGZ2KBEMg',
    'fHGGZ2KBEMg',
    'https://i.ytimg.com/vi/fHGGZ2KBEMg/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Rayner Teo on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    93,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000908',
    'What is a Pip or Point | Trading Terms',
    'Crystal-clear explanation of Pips (4th decimal on standard pairs, 2nd decimal on JPY pairs), Pipettes, and how Pip values scale across Micro, Mini, and Standard Lots.',
    'youtube',
    'Trading 212',
    'https://www.youtube.com/watch?v=bE0ZlUMmGXo',
    'bE0ZlUMmGXo',
    'https://i.ytimg.com/vi/bE0ZlUMmGXo/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Trading 212 on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 21: Forex Macro News & Interest Rates
  (
    '40000000-0000-4000-8000-000000000909',
    'How Central Banks Influence Forex Prices',
    'Plain-English breakdown of how Federal Reserve, ECB, BOE, and BOJ interest rate decisions and Hawkish vs. Dovish policy guidance drive multi-week Forex trends.',
    'youtube',
    'Trading 212',
    'https://www.youtube.com/watch?v=HBmOBOqVT74',
    'HBmOBOqVT74',
    'https://i.ytimg.com/vi/HBmOBOqVT74/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Trading 212 on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000910',
    'How To Trade CPI & NFP The Right Way',
    'Practical framework for surviving red-folder inflation (CPI) and jobs (NFP) releases by avoiding initial spread whipsaws and executing post-news confirmation.',
    'youtube',
    'Words of Rizdom',
    'https://www.youtube.com/watch?v=bm0sr7mQ5Tk',
    'bm0sr7mQ5Tk',
    'https://i.ytimg.com/vi/bm0sr7mQ5Tk/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Words of Rizdom on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 22: Stocks Market Hours & Order Types
  (
    '40000000-0000-4000-8000-000000000911',
    'Order Types Explained (Limit, Stop, Market) - For Beginner Traders',
    'Beginner-friendly walkthrough of Market Orders, Limit Orders, and Stop Orders so you control exact fill prices and place reliable protective stop losses.',
    'youtube',
    'Matt FXS',
    'https://www.youtube.com/watch?v=t05XBsqgPQU',
    't05XBsqgPQU',
    'https://i.ytimg.com/vi/t05XBsqgPQU/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Matt FXS on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000912',
    'The Definitive Stock Trading Guide (for Beginners)',
    'Prop-desk introduction to US equities covering Regular Trading Hours (9:30 AM–4:00 PM ET), volume selection, liquid stock filtering, and repeatable beginner habits.',
    'youtube',
    'SMB Capital',
    'https://www.youtube.com/watch?v=_qA3yFjdTuA',
    '_qA3yFjdTuA',
    'https://i.ytimg.com/vi/_qA3yFjdTuA/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by SMB Capital on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    94,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 24: Stocks Earnings & Relative Strength
  (
    '40000000-0000-4000-8000-000000000913',
    'How I Trade Earnings (My 4-Step Strategy)',
    'Institutional 4-step post-earnings playbook showing how prop traders react AFTER quarterly numbers drop using RVOL, clean catalyst surprise, and structured risk.',
    'youtube',
    'SMB Capital',
    'https://www.youtube.com/watch?v=FQIH6o18y9g',
    'FQIH6o18y9g',
    'https://i.ytimg.com/vi/FQIH6o18y9g/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by SMB Capital on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    94,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000914',
    'Revealing My Secret Relative Strength Breakout Strategy',
    'Tactical equity breakdown demonstrating how comparing a stock’s pullbacks against SPY reveals institutional Relative Strength right before breakout expansion.',
    'youtube',
    'SMB Capital',
    'https://www.youtube.com/watch?v=l7F9yIf8CeE',
    'l7F9yIf8CeE',
    'https://i.ytimg.com/vi/l7F9yIf8CeE/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by SMB Capital on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    93,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000915',
    'Reading Stock Charts: Relative Strength | Learn How To Invest: IBD',
    'Classic equity chart guide explaining how to read a Relative Strength line on daily and weekly stock charts to isolate institutional leaders.',
    'youtube',
    'Investor''s Business Daily',
    'https://www.youtube.com/watch?v=p5TbI2UnTww',
    'p5TbI2UnTww',
    'https://i.ytimg.com/vi/p5TbI2UnTww/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Investor''s Business Daily on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 25: Indices NAS100 & SPX500 Basics
  (
    '40000000-0000-4000-8000-000000000916',
    'The ULTIMATE Guide to Trading US Indices | NASDAQ, DOW, S&P500',
    'Practical comparison of NAS100 (Nasdaq), SPX500 (S&P 500), and US30 (Dow Jones), covering volatility personality, active NY hours, and point sizing.',
    'youtube',
    'TraderNick',
    'https://www.youtube.com/watch?v=QX1g_NqSfzs',
    'QX1g_NqSfzs',
    'https://i.ytimg.com/vi/QX1g_NqSfzs/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TraderNick on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000917',
    'What''s an Index? The Dow, S&P 500, and Nasdaq Explained',
    'Clear institutional primer explaining what a Stock Index actually measures and how weighting differs across the Dow (US30), S&P 500 (SPX500), and Nasdaq (NAS100).',
    'youtube',
    'Charles Schwab',
    'https://www.youtube.com/watch?v=S77ms4xtmXw',
    'S77ms4xtmXw',
    'https://i.ytimg.com/vi/S77ms4xtmXw/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Charles Schwab on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    93,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 27: Indices Risk-On Correlations
  (
    '40000000-0000-4000-8000-000000000918',
    'What is the Fear Index? VIX Explained Simply',
    'Simple, clear breakdown of the CBOE Volatility Index (VIX), explaining what low vs. spiking VIX readings signal about market fear and candle volatility.',
    'youtube',
    'Brian Feroldi',
    'https://www.youtube.com/watch?v=RV-Ohf418L0',
    'RV-Ohf418L0',
    'https://i.ytimg.com/vi/RV-Ohf418L0/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Brian Feroldi on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000919',
    'What Is The US Dollar Index & Why Is It So Important To Traders?',
    'Clear walkthrough of DXY (US Dollar Index) and how macro Dollar strength or weakness interacts with Risk-On Stock Indices, Forex, and global capital flows.',
    'youtube',
    'UK Trading Academy',
    'https://www.youtube.com/watch?v=MXyfXNcDNKA',
    'MXyfXNcDNKA',
    'https://i.ytimg.com/vi/MXyfXNcDNKA/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by UK Trading Academy on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. Lesson-to-Resource Mappings (19 New Rows: 0901–0919)
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
  -- Module 01: chart-reading-fundamentals
  (
    '30000000-0000-4000-8000-000000000901',
    '20000000-0000-4000-8000-000000000019',
    '40000000-0000-4000-8000-000000000901',
    99,
    1,
    'Focus on how each timeframe represents one candle’s duration and why starting on 15m, 1H, or 1D reduces beginner noise dramatically.',
    ARRAY[
      'Higher timeframes (1H, 4H, 1D) filter out random noise and reveal cleaner structural direction.',
      'Match your timeframe choice to your daily schedule rather than forcing fast 1-minute scalping.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000902',
    '20000000-0000-4000-8000-000000000019',
    '40000000-0000-4000-8000-000000000902',
    97,
    2,
    'Watch how to keep your chart workspace clean using only a Watchlist, Timeframe buttons, Horizontal Lines, Ruler, and Long/Short Position Tool.',
    ARRAY[
      'Organize a compact Watchlist across Crypto, Stocks, Forex, and Indices before marking any levels.',
      'Use the Long/Short Position Tool to visualize Entry, SL (Stop Loss), and TP (Take Profit) before entering.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 16: crypto-spot-perps-orderbook
  (
    '30000000-0000-4000-8000-000000000903',
    '20000000-0000-4000-8000-000000000020',
    '40000000-0000-4000-8000-000000000903',
    98,
    1,
    'Compare Spot asset ownership (zero forced liquidation) against leveraged Futures margin rules so you always pick the right vehicle.',
    ARRAY[
      'Spot ownership carries zero forced liquidation risk and zero funding-rate drag.',
      'Futures allow shorting and leverage but require Isolated Margin and a hard SL (Stop Loss).'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000904',
    '20000000-0000-4000-8000-000000000020',
    '40000000-0000-4000-8000-000000000904',
    96,
    2,
    'Notice how Perpetual Futures differ from expiring contracts and why Funding Rates keep Perps aligned with the Spot order book.',
    ARRAY[
      'Perpetual contracts never expire and stay pegged to Spot via periodic Funding payments.',
      'Always size Crypto positions from your SL (Stop Loss) distance rather than random leverage sliders.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 18: crypto-volatility-altcoin-cycles
  (
    '30000000-0000-4000-8000-000000000905',
    '20000000-0000-4000-8000-000000000021',
    '40000000-0000-4000-8000-000000000905',
    98,
    1,
    'Track the relationship between BTC price stability and falling BTC.D to understand when Altcoin rotation setups have genuine tailwind.',
    ARRAY[
      'Check both BTC/USDT and BTC.D (Bitcoin Dominance) before entering any Altcoin Long.',
      'Cap total combined risk across correlated Altcoins so one Bitcoin flush cannot multiply losses.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000906',
    '20000000-0000-4000-8000-000000000021',
    '40000000-0000-4000-8000-000000000906',
    96,
    2,
    'Connect bright Liquidation Heatmap zones directly to Equal Highs/Lows and Liquidity Sweeps from the Universal Core lessons.',
    ARRAY[
      'Bright Liquidation Heatmap clusters show where forced leveraged orders are stacked as stop-hunt fuel.',
      'Wait for price to sweep the heatmap zone and confirm BOS (Break of Structure) rather than guessing tops or bottoms.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 19: forex-pairs-pips-lots-spreads
  (
    '30000000-0000-4000-8000-000000000907',
    '20000000-0000-4000-8000-000000000022',
    '40000000-0000-4000-8000-000000000907',
    98,
    1,
    'Focus on how Base and Quote currencies interact in pairs like EUR/USD and why Major pairs offer the tightest beginner-friendly spreads.',
    ARRAY[
      'Buying a Forex pair means buying the Base (first) currency while simultaneously selling the Quote (second) currency.',
      'Start with high-liquidity Major pairs (EUR/USD, GBP/USD, USD/JPY) to keep Bid/Ask spread costs minimal.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000908',
    '20000000-0000-4000-8000-000000000022',
    '40000000-0000-4000-8000-000000000908',
    97,
    2,
    'Pay attention to how Pip distance multiplies with Lot size so you can calculate exact 1% risk before every trade.',
    ARRAY[
      'Measure 1 pip at the 4th decimal (0.0001) on EUR/USD and at the 2nd decimal (0.01) on USD/JPY.',
      'Size every Forex trade via Lot Size = Risk $ ÷ (SL Pips × $10) on USD-quoted pairs.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 21: forex-macro-news-rates
  (
    '30000000-0000-4000-8000-000000000909',
    '20000000-0000-4000-8000-000000000023',
    '40000000-0000-4000-8000-000000000909',
    98,
    1,
    'Observe why global yield flows follow rising interest rates and how macro rate divergence aligns with HTF (Higher Timeframe) trends.',
    ARRAY[
      'Hawkish rate-hike expectations attract capital into a currency; Dovish rate-cut expectations weaken it.',
      'Aligning 4H/1D market structure with Central Bank rate bias improves swing trend follow-through.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000910',
    '20000000-0000-4000-8000-000000000023',
    '40000000-0000-4000-8000-000000000910',
    96,
    2,
    'Watch how disciplined traders avoid gambling on the exact 8:30 AM spike and wait for spreads and market structure to stabilize.',
    ARRAY[
      'Check the Economic Calendar every morning before entering any Forex position.',
      'Let initial CPI/NFP spread widening and two-way whipsaws pass, then trade clean post-news structure.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 22: stocks-market-hours-volume-order-types
  (
    '30000000-0000-4000-8000-000000000911',
    '20000000-0000-4000-8000-000000000024',
    '40000000-0000-4000-8000-000000000911',
    98,
    1,
    'Notice exactly when a Limit Order protects you from bad fills versus when a Stop Order ensures you exit cleanly at invalidation.',
    ARRAY[
      'Use Limit orders to cap your entry price and avoid surprise slippage in fast or thin stock books.',
      'Attach a hard SL (Stop Loss) immediately using Shares = Risk $ ÷ Stop Distance ($).'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000912',
    '20000000-0000-4000-8000-000000000024',
    '40000000-0000-4000-8000-000000000912',
    97,
    2,
    'Focus on why professional equity traders concentrate on high-volume Regular Trading Hours and liquid institutional names.',
    ARRAY[
      'Map Pre-Market levels before 9:30 AM ET, but prioritize Regular Hours for tight spreads and real volume.',
      'Focus on liquid stocks trading 2M+ average daily shares rather than choppy illiquid tickers.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 24: stocks-earnings-relative-strength
  (
    '30000000-0000-4000-8000-000000000913',
    '20000000-0000-4000-8000-000000000025',
    '40000000-0000-4000-8000-000000000913',
    99,
    1,
    'Notice why professionals wait for the Earnings surprise to print first instead of gambling on blind overnight gaps.',
    ARRAY[
      'Avoid holding short-term trades blindly through overnight Earnings where gaps jump past your SL (Stop Loss).',
      'Trade post-earnings Stocks in Play with strong Guidance surprises and heavy RVOL (Relative Volume).'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000914',
    '20000000-0000-4000-8000-000000000025',
    '40000000-0000-4000-8000-000000000914',
    97,
    2,
    'Watch how a stock holding Higher Lows while SPY dips signals active institutional accumulation underneath the surface.',
    ARRAY[
      'Keep SPY visible alongside your stock chart to spot Relative Strength (RS) leaders in real time.',
      'Back the #1 RS leader inside today’s strongest sector rather than chasing weak sympathy laggards.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000915',
    '20000000-0000-4000-8000-000000000025',
    '40000000-0000-4000-8000-000000000915',
    94,
    3,
    'Compare how multi-day and swing Relative Strength lines help you filter top-performing stocks before they break out.',
    ARRAY[
      'A rising Relative Strength line confirms your stock is outperforming the S&P 500 benchmark consistently.',
      'Combine HTF Relative Strength with clean structural support and RVOL for Day 1 and Day 2 runners.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 25: indices-nas100-spx500-basics
  (
    '30000000-0000-4000-8000-000000000916',
    '20000000-0000-4000-8000-000000000026',
    '40000000-0000-4000-8000-000000000916',
    98,
    1,
    'Compare how smoothly SPX500 moves versus faster, wider-ranging NAS100 so you pick the right starting index and contract size.',
    ARRAY[
      'Start practicing on smoother SPX500 before moving into faster, wider-swinging NAS100.',
      'Always verify your broker’s Dollar-per-Point multiplier and size via Risk $ ÷ (SL Points × $/Point).'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000917',
    '20000000-0000-4000-8000-000000000026',
    '40000000-0000-4000-8000-000000000917',
    96,
    2,
    'Focus on why mega-cap tech companies move NAS100 so strongly while SPX500 represents 500 diversified US leaders.',
    ARRAY[
      'An Index bundles top companies into one liquid chart, eliminating single-stock earnings shock risk.',
      'Peak Index volume arrives at the 9:30 AM ET US cash equity open when all underlying stocks open.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 27: indices-risk-on-correlations
  (
    '30000000-0000-4000-8000-000000000918',
    '20000000-0000-4000-8000-000000000027',
    '40000000-0000-4000-8000-000000000918',
    98,
    1,
    'Watch how spiking VIX signals wider intraday index swings — telling you to widen structural stops and size contracts down.',
    ARRAY[
      'Use VIX as a volatility speedometer: higher VIX (>24) demands smaller contract size to keep risk at 1R.',
      'Falling, calm VIX supports smoother Risk-On trends while surging VIX warns of fast two-way volatility.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000919',
    '20000000-0000-4000-8000-000000000027',
    '40000000-0000-4000-8000-000000000919',
    96,
    2,
    'Observe how DXY rejecting major resistance often aligns with Risk-On buying across SPX500 and NAS100.',
    ARRAY[
      'Check DXY alongside VIX as a 5-second macro Risk-On / Risk-Off filter before 9:30 AM NY.',
      'Pair cross-market clues (DXY, VIX, SPX/NAS SMT) with a confirmed BOS (Break of Structure) on your traded chart.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  )
ON CONFLICT DO NOTHING;
