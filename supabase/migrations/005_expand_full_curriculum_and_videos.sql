-- TradeLab Academy — Migration 005: Expand Full 18-Lesson Categorized Curriculum & 27 New Verified YouTube Videos
-- PostgreSQL / Supabase Migration (100% idempotent)
-- Adds market_category & learning_stage columns + CHECK constraints + targeted indexes to public.lessons,
-- upserts all 18 curriculum modules (preserving original 6 UUIDs 0001–0006), and seeds 27 additional
-- live-verified public YouTube educational videos (0117–0143; 43 total across all 18 lessons).
-- Zero fabricated timestamps (no resource_segments seeded).
--
-- Rollback Reference (execute in reverse dependency order if reverting):
--   DELETE FROM public.lesson_resources
--   WHERE id BETWEEN '30000000-0000-4000-8000-000000000117'::uuid
--                AND '30000000-0000-4000-8000-000000000143'::uuid;
--   DELETE FROM public.educational_resources
--   WHERE id BETWEEN '40000000-0000-4000-8000-000000000117'::uuid
--                AND '40000000-0000-4000-8000-000000000143'::uuid;
--   DELETE FROM public.lessons
--   WHERE id BETWEEN '20000000-0000-4000-8000-000000000007'::uuid
--                AND '20000000-0000-4000-8000-000000000018'::uuid;
--   DROP INDEX IF EXISTS public.idx_lessons_stage_order;
--   DROP INDEX IF EXISTS public.idx_lessons_learning_stage;
--   DROP INDEX IF EXISTS public.idx_lessons_market_category;
--   ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS chk_lessons_learning_stage;
--   ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS chk_lessons_market_category;
--   ALTER TABLE public.lessons DROP COLUMN IF EXISTS learning_stage;
--   ALTER TABLE public.lessons DROP COLUMN IF EXISTS market_category;

-- ============================================================================
-- 1. Schema Evolution on public.lessons (Market Category + Learning Stage)
-- ============================================================================

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS market_category TEXT NOT NULL DEFAULT 'general';

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS learning_stage TEXT NOT NULL DEFAULT 'foundations';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_lessons_market_category'
      AND conrelid = 'public.lessons'::regclass
  ) THEN
    ALTER TABLE public.lessons
      ADD CONSTRAINT chk_lessons_market_category
      CHECK (market_category IN ('general', 'forex', 'indices', 'crypto', 'stocks'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_lessons_learning_stage'
      AND conrelid = 'public.lessons'::regclass
  ) THEN
    ALTER TABLE public.lessons
      ADD CONSTRAINT chk_lessons_learning_stage
      CHECK (
        learning_stage IN (
          'foundations',
          'price_action_smc',
          'market_playbooks',
          'execution_edge',
          'steady_profitability'
        )
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_lessons_market_category
  ON public.lessons(market_category);

CREATE INDEX IF NOT EXISTS idx_lessons_learning_stage
  ON public.lessons(learning_stage);

CREATE INDEX IF NOT EXISTS idx_lessons_stage_order
  ON public.lessons(learning_stage, module_order ASC);

-- ============================================================================
-- 2. Upsert Full 18-Lesson Curriculum Roadmap (Modules 1..18)
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
  -- Module 1: Candlestick Anatomy
  (
    '20000000-0000-4000-8000-000000000007',
    'candlestick-anatomy',
    'Candlestick Anatomy & Reading Price Action',
    'Decode open, high, low, close (OHLC), wick rejection, and body momentum to read buyer vs. seller control on any chart.',
    'beginner',
    'general',
    'foundations',
    1,
    'candlestick-anatomy',
    14,
    ARRAY[
      'Read Open, High, Low, and Close (OHLC) instantly on both bullish and bearish candlesticks.',
      'Interpret body-to-wick ratios to gauge conviction, momentum, and price rejection.',
      'Recognize engulfing displacement candles, rejection pin bars, and indecision dojis in context.',
      'Explain why candle location at key structure matters far more than isolated textbook patterns.'
    ],
    ARRAY[
      'No prior trading experience required — start right here.'
    ]
  ),
  -- Module 2: Market Structure Basics (existing 0001)
  (
    '20000000-0000-4000-8000-000000000001',
    'market-structure',
    'Market Structure Basics (HH/HL, LH/LL & BOS)',
    'Read trend direction objectively using swing points and confirmed candle-body Breaks of Structure.',
    'beginner',
    'general',
    'foundations',
    2,
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
  -- Module 3: Support, Resistance & Supply/Demand
  (
    '20000000-0000-4000-8000-000000000008',
    'support-resistance-supply-demand',
    'Support, Resistance & Institutional Supply/Demand Zones',
    'Upgrade from razor-thin retail lines to institutional supply and demand zones where aggressive displacement actually began.',
    'beginner',
    'general',
    'foundations',
    3,
    'support-resistance-supply-demand',
    16,
    ARRAY[
      'Draw clean horizontal Support and Resistance areas as zones rather than fragile 1-pip lines.',
      'Identify Institutional Supply and Demand zones by locating the base before explosive displacement.',
      'Understand Polarity Flips (broken resistance turning into support and vice versa).',
      'Explain why fresh, unmitigated zones react stronger than levels tested four or five times.'
    ],
    ARRAY[
      'Candlestick Anatomy & Reading Price Action',
      'Market Structure Basics (HH/HL, LH/LL & BOS)'
    ]
  ),
  -- Module 4: Understanding Market Liquidity (existing 0002)
  (
    '20000000-0000-4000-8000-000000000002',
    'market-liquidity',
    'Understanding Market Liquidity (Buy-Side & Sell-Side)',
    'See where stop-losses and breakout orders cluster so you understand why price gravitates toward key highs and lows.',
    'beginner',
    'general',
    'price_action_smc',
    4,
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
  -- Module 5: Equal Highs & Equal Lows (existing 0003)
  (
    '20000000-0000-4000-8000-000000000003',
    'equal-highs-lows',
    'Equal Highs & Equal Lows (Liquidity Pools)',
    'Recognize why "double tops" and "double bottoms" act as high-probability liquidity magnets rather than guaranteed ceilings.',
    'intermediate',
    'general',
    'price_action_smc',
    5,
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
  -- Module 6: Liquidity Sweeps vs. True Breakouts (existing 0004)
  (
    '20000000-0000-4000-8000-000000000004',
    'liquidity-sweeps',
    'Liquidity Sweeps vs. True Breakouts',
    'Flagship Lesson: Master candle-close rejection, displacement, and retest acceptance so you stop getting trapped on false breakouts.',
    'intermediate',
    'general',
    'price_action_smc',
    6,
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
  -- Module 7: Fair Value Gaps (existing 0005)
  (
    '20000000-0000-4000-8000-000000000005',
    'fair-value-gaps',
    'Fair Value Gaps (FVG) & Institutional Imbalances',
    'Spot 3-candle price inefficiencies left by aggressive displacement and understand high-probability mitigation zones.',
    'intermediate',
    'general',
    'price_action_smc',
    7,
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
  -- Module 8: Order Blocks, CHoCH & Institutional Displacement
  (
    '20000000-0000-4000-8000-000000000009',
    'order-blocks-bos-choch',
    'Order Blocks, CHoCH & Institutional Displacement',
    'Pinpoint high-probability institutional Order Blocks, confirm real Change of Character (CHoCH) reversals, and avoid inducement traps.',
    'intermediate',
    'general',
    'price_action_smc',
    8,
    'order-blocks-bos-choch',
    20,
    ARRAY[
      'Identify valid Bullish and Bearish Order Blocks (the last opposing candle before forceful displacement).',
      'Distinguish a genuine Change of Character (CHoCH) from a continuation Break of Structure (BOS).',
      'Filter high-probability Order Blocks using liquidity sweeps, Fair Value Gaps, and unmitigated freshness.',
      'Avoid trading low-probability "inducement" Order Blocks sitting right ahead of resting liquidity.'
    ],
    ARRAY[
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Liquidity Sweeps vs. True Breakouts',
      'Fair Value Gaps (FVG) & Institutional Imbalances'
    ]
  ),
  -- Module 9: Multi-Timeframe Analysis
  (
    '20000000-0000-4000-8000-000000000010',
    'multi-timeframe-alignment',
    'Multi-Timeframe Analysis (HTF Bias to LTF Entry)',
    'Align Higher-Timeframe narrative with Lower-Timeframe precision so you stop getting whipsawed by low-timeframe noise.',
    'intermediate',
    'general',
    'price_action_smc',
    9,
    'multi-timeframe-alignment',
    18,
    ARRAY[
      'Build a clean 3-timeframe top-down stack (Bias → Structure/POI → Execution) tailored to your trading style.',
      'Explain why Higher-Timeframe (HTF) structure and liquidity always override conflicting Lower-Timeframe (LTF) signals.',
      'Spot when an LTF downtrend is simply an HTF pullback into Discount demand.',
      'Execute refined LTF confirmation entries inside HTF Points of Interest to unlock tighter stops and larger R-multiples.'
    ],
    ARRAY[
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Order Blocks, CHoCH & Institutional Displacement'
    ]
  ),
  -- Module 10: Forex Playbook
  (
    '20000000-0000-4000-8000-000000000011',
    'forex-sessions-killzones',
    'Forex Playbook: London & NY Killzones',
    'Trade high-volume institutional sessions (London & New York Killzones) using Asian Range sweeps, Power of 3, and major news filters.',
    'intermediate',
    'forex',
    'market_playbooks',
    10,
    'forex-sessions-killzones',
    18,
    ARRAY[
      'Map the three core Forex liquidity sessions: Asian Range (Accumulation), London Killzone (Manipulation/Expansion), and NY Killzone (Continuation/Reversal).',
      'Apply the Power of 3 (AMD: Accumulation → Manipulation → Distribution) framework to major pairs like EUR/USD and GBP/USD.',
      'Explain why trading dead off-session hours destroys win rate through wide spreads and directionless chop.',
      'Manage high-impact macro catalysts (CPI, NFP, FOMC) without gambling into spread spikes.'
    ],
    ARRAY[
      'Liquidity Sweeps vs. True Breakouts',
      'Multi-Timeframe Analysis (HTF Bias to LTF Entry)'
    ]
  ),
  -- Module 11: Indices Playbook
  (
    '20000000-0000-4000-8000-000000000012',
    'indices-ny-open-playbook',
    'Indices Playbook: NAS100 & US30 NY Open',
    'Navigate the explosive 09:30 EST US equities open on NAS100 and US30 using pre-market sweeps, SMT divergence, and volatility-adjusted sizing.',
    'intermediate',
    'indices',
    'market_playbooks',
    11,
    'indices-ny-open-playbook',
    19,
    ARRAY[
      'Survive and capitalize on the 09:30 EST Opening Bell volatility spike without getting whipsawed in the first 3 minutes.',
      'Use Pre-Market High/Low (PMH/PML) and Previous Day High/Low as primary liquidity magnets on NAS100 and US30.',
      'Spot SMT Divergence between NAS100 (NQ) and US30/SPX500 (ES) to catch high-probability reversals.',
      'Adjust position size to wider index point swings so your fixed 1R risk never blows out on fast NAS100 candles.'
    ],
    ARRAY[
      'Equal Highs & Equal Lows (Liquidity Pools)',
      'Liquidity Sweeps vs. True Breakouts'
    ]
  ),
  -- Module 12: Crypto Playbook
  (
    '20000000-0000-4000-8000-000000000013',
    'crypto-247-liquidity-playbook',
    'Crypto Playbook: 24/7 Volatility, BTC Dominance & Funding',
    'Adapt price action to 24/7 crypto markets using Bitcoin Dominance rotation, perpetual funding rate extremes, and liquidation cascade awareness.',
    'intermediate',
    'crypto',
    'market_playbooks',
    12,
    'crypto-247-liquidity-playbook',
    20,
    ARRAY[
      'Use Bitcoin (BTC) and Bitcoin Dominance (BTC.D) to time when capital favors BTC versus altcoins.',
      'Read Perpetual Futures Funding Rates and Open Interest to spot crowded leverage ripe for liquidation squeezes.',
      'Manage 24/7 weekend liquidity traps, thin order books, and Monday CME/spot range sweeps.',
      'Control leverage strictly so high-volatility crypto wicks never trigger forced account liquidations.'
    ],
    ARRAY[
      'Understanding Market Liquidity (Buy-Side & Sell-Side)',
      'Liquidity Sweeps vs. True Breakouts'
    ]
  ),
  -- Module 13: Stocks Playbook
  (
    '20000000-0000-4000-8000-000000000014',
    'stocks-gaps-rvol-playbook',
    'Stocks Playbook: Pre-Market Gaps, RVOL & Opening Range',
    'Build a focused pre-market equity watchlist using fresh catalysts, Relative Volume (RVOL), VWAP, and Opening Range Breakouts (ORB).',
    'intermediate',
    'stocks',
    'market_playbooks',
    13,
    'stocks-gaps-rvol-playbook',
    18,
    ARRAY[
      'Filter thousands of equities down to 2–4 "Stocks in Play" using pre-market gaps, fresh catalysts, and Relative Volume (RVOL ≥ 2.0).',
      'Execute clean Opening Range Breakouts (ORB) using 2-minute or 5-minute opening highs/lows and volume confirmation.',
      'Use VWAP (Volume Weighted Average Price) alongside market structure to filter institutional trend bias.',
      'Avoid low-volume midday chop and wide-spread illiquid tickers that shred retail stops.'
    ],
    ARRAY[
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Liquidity Sweeps vs. True Breakouts'
    ]
  ),
  -- Module 14: Building an A+ Setup Checklist
  (
    '20000000-0000-4000-8000-000000000015',
    'confluence-a-plus-setups',
    'Building an A+ Setup Checklist & Execution Model',
    'Combine HTF bias, liquidity sweeps, displacement, FVG/OB entry, and asymmetric R-multiple into one repeatable, rule-based execution playbook.',
    'advanced',
    'general',
    'execution_edge',
    14,
    'confluence-a-plus-setups',
    20,
    ARRAY[
      'Assemble a concise 5-point A+ Setup Checklist uniting Narrative, Liquidity, Timing, Trigger, and Risk.',
      'Grade setups objectively into A+, B, and C tiers—and eliminate C-grade boredom trades completely.',
      'Build a repeatable mechanical trigger so you stop hesitating on good setups and stop chasing bad ones.',
      'Recognize when a market condition is "No Trade" and protect mental capital by sitting on your hands.'
    ],
    ARRAY[
      'Order Blocks, CHoCH & Institutional Displacement',
      'Multi-Timeframe Analysis (HTF Bias to LTF Entry)'
    ]
  ),
  -- Module 15: Trade Management
  (
    '20000000-0000-4000-8000-000000000016',
    'trade-management-partials-be',
    'Trade Management: Partials, Breakeven & Runners',
    'Manage live positions mechanically with pre-planned partial take-profits, structural breakeven rules, and trailing stops—so winners reach full potential.',
    'advanced',
    'general',
    'execution_edge',
    15,
    'trade-management-partials-be',
    18,
    ARRAY[
      'Decide when to move your stop to Breakeven (BE) based on real structural breaks rather than premature panic at +0.5R.',
      'Structure systematic partial profit-taking (e.g., 50% at +2R, runner to opposing HTF liquidity) without gutting expectancy.',
      'Trail stops logically behind newly formed Higher Lows or Lower Highs to capture trend-day runners.',
      'Compare Fixed Full-TP management vs. Partial + Runner management using simple R-multiple math.'
    ],
    ARRAY[
      'Building an A+ Setup Checklist & Execution Model',
      'Market Structure Basics (HH/HL, LH/LL & BOS)'
    ]
  ),
  -- Module 16: Risk Management & Psychology (existing 0006)
  (
    '20000000-0000-4000-8000-000000000006',
    'risk-psychology',
    'Risk Management, Position Sizing & Trading Psychology',
    'Protect your capital with fixed-percentage risk math, asymmetric R-multiples, and repeatable emotional discipline.',
    'beginner',
    'general',
    'steady_profitability',
    16,
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
  ),
  -- Module 17: Trading Journal & Expectancy
  (
    '20000000-0000-4000-8000-000000000017',
    'trading-journal-expectancy',
    'Trading Journal, Backtest Data & Positive Expectancy',
    'Turn raw trades into objective feedback using R-multiple expectancy, Profit Factor, MAE/MFE tracking, and structured weekly reviews.',
    'intermediate',
    'general',
    'steady_profitability',
    17,
    'trading-journal-expectancy',
    18,
    ARRAY[
      'Compute Expectancy, Win Rate, Average R, and Profit Factor across a statistically meaningful sample of 30+ trades.',
      'Explain why a 75% win rate can still lose money while a 40% win rate can compound steadily.',
      'Track the exact 6 journal fields that actually improve performance (and ignore vanity metrics).',
      'Run a 20-minute Sunday review using TradeLab’s Backtesting Lab and journal data to cut leaks systematically.'
    ],
    ARRAY[
      'Risk Management, Position Sizing & Trading Psychology',
      'Building an A+ Setup Checklist & Execution Model'
    ]
  ),
  -- Module 18: Handling Drawdowns & Scaling
  (
    '20000000-0000-4000-8000-000000000018',
    'drawdown-scaling-consistency',
    'Handling Drawdowns, Avoiding Tilt & Scaling Steadily',
    'Master drawdown recovery math, dynamic risk throttling, anti-tilt circuit breakers, and milestone-based scaling for long-term profitability.',
    'advanced',
    'general',
    'steady_profitability',
    18,
    'drawdown-scaling-consistency',
    20,
    ARRAY[
      'Understand the asymmetric math of drawdown recovery and why protecting capital always beats chasing fast returns.',
      'Implement a tiered Drawdown Protocol (automatically cutting risk in half at -4% / -5R to flatten losing streaks).',
      'Spot early physical and behavioral signs of emotional Tilt and activate immediate cooldown circuit breakers.',
      'Scale account size and risk gradually using objective sample milestones instead of premature over-leveraging.'
    ],
    ARRAY[
      'Risk Management, Position Sizing & Trading Psychology',
      'Trading Journal, Backtest Data & Positive Expectancy'
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
-- 3. Seed 27 New Live-Verified YouTube Educational Resources (0117–0143)
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
  -- Module 1: Candlestick Anatomy
  (
    '40000000-0000-4000-8000-000000000117',
    'The ONLY Candlestick Video You’ll EVER Need (Step By Step Guide)',
    'Step-by-step walkthrough breaking down candlestick OHLC mechanics, body-to-wick ratios, rejection signals, and reading buyer vs. seller control without memorizing clutter.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=z1STKCnivbM',
    'z1STKCnivbM',
    'https://i.ytimg.com/vi/z1STKCnivbM/hqdefault.jpg',
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
    '40000000-0000-4000-8000-000000000118',
    'Boot Camp Day 2: Candlesticks',
    'Foundational bootcamp lesson explaining open, high, low, close structure and how multi-candle sequences frame real price action momentum.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=bEkbNGUzQME',
    'bEkbNGUzQME',
    'https://i.ytimg.com/vi/bEkbNGUzQME/hqdefault.jpg',
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

  -- Module 3: Support, Resistance & Supply/Demand
  (
    '40000000-0000-4000-8000-000000000119',
    'Order Blocks vs Supply & Demand vs Support & Resistance — The Real Difference Explained!',
    'Clear side-by-side comparison clarifying how classic horizontal Support & Resistance, institutional Supply & Demand bases, and Order Blocks relate on live charts.',
    'youtube',
    'Pro Trading School',
    'https://www.youtube.com/watch?v=FjB8SRc0mi8',
    'FjB8SRc0mi8',
    'https://i.ytimg.com/vi/FjB8SRc0mi8/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Pro Trading School on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000120',
    'Support & Resistance Zones Explained | Premium Trading Course Lesson',
    'Practical lesson demonstrating why Support and Resistance work as shaded price zones rather than single-pip lines, including polarity role reversals.',
    'youtube',
    'BEYOND THE COSMOS',
    'https://www.youtube.com/watch?v=dZaUaUsalNI',
    'dZaUaUsalNI',
    'https://i.ytimg.com/vi/dZaUaUsalNI/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by BEYOND THE COSMOS on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    89,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 8: Order Blocks, CHoCH & Displacement
  (
    '40000000-0000-4000-8000-000000000121',
    'Boot Camp Day 20: Order Blocks',
    'Core institutional lesson introducing Bullish and Bearish Order Blocks, the role of liquidity sweeps prior to displacement, and validating real structural origins.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=qhuFg_OXdmE',
    'qhuFg_OXdmE',
    'https://i.ytimg.com/vi/qhuFg_OXdmE/hqdefault.jpg',
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
    '40000000-0000-4000-8000-000000000122',
    'Boot Camp Day 22: Order Blocks pt.2',
    'Follow-up session detailing Order Block refinement, mitigation rules, breaker invalidation, and combining Order Blocks with Change of Character (CHoCH).',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=RQSVIKddFHI',
    'RQSVIKddFHI',
    'https://i.ytimg.com/vi/RQSVIKddFHI/hqdefault.jpg',
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
    '40000000-0000-4000-8000-000000000123',
    'Order Block Trading Strategy: The Complete 5-Step Guide #trading #SMC #ICT',
    'Structured 5-step Order Block walkthrough connecting CHoCH confirmation, inducement avoidance, and clean mitigation entries.',
    'youtube',
    'Com Lucro Trader',
    'https://www.youtube.com/watch?v=rbdkcDDmneQ',
    'rbdkcDDmneQ',
    'https://i.ytimg.com/vi/rbdkcDDmneQ/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Com Lucro Trader on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 9: Multi-Timeframe Alignment
  (
    '40000000-0000-4000-8000-000000000124',
    'Trading Transformation Day 36: How to Trade on Multiple Timeframes',
    'Practical top-down walkthrough showing how to map Higher-Timeframe bias and liquidity draws before dropping to Lower Timeframes for precise execution.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=60H1AumgjG8',
    '60H1AumgjG8',
    'https://i.ytimg.com/vi/60H1AumgjG8/hqdefault.jpg',
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
    '40000000-0000-4000-8000-000000000125',
    'The Multi-Time Frame Analysis Mistake That Ruins Perfect Scalping Setups',
    'Focused diagnostic highlighting how fighting Higher-Timeframe zones and fractal pullbacks sabotages otherwise clean low-timeframe scalps.',
    'youtube',
    'Com Lucro Trader',
    'https://www.youtube.com/watch?v=JthLtxOPd-Y',
    'JthLtxOPd-Y',
    'https://i.ytimg.com/vi/JthLtxOPd-Y/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Com Lucro Trader on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 10: Forex Playbook
  (
    '40000000-0000-4000-8000-000000000126',
    'Trading Kill Zones Simplified (London ,New York, Tokyo)',
    'Clear session-timing guide showing how Tokyo/Asian consolidation sets up London and New York Killzone liquidity sweeps and directional trends.',
    'youtube',
    'Mind Math Money',
    'https://www.youtube.com/watch?v=mTIvQaRDdZA',
    'mTIvQaRDdZA',
    'https://i.ytimg.com/vi/mTIvQaRDdZA/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Mind Math Money on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000127',
    'ICT Sessions & Kill Zones Explained | Asian, London & New York Copy Title',
    'Step-by-step review of Asian, London, and New York session liquidity mechanics and avoiding off-session Forex chop.',
    'youtube',
    'Syed Izhar Ali Shah',
    'https://www.youtube.com/watch?v=DiQsBv-ItVE',
    'DiQsBv-ItVE',
    'https://i.ytimg.com/vi/DiQsBv-ItVE/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Syed Izhar Ali Shah on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    89,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 11: Indices Playbook
  (
    '40000000-0000-4000-8000-000000000128',
    'NASDAQ & US30 Trading Strategy: Live Webinar',
    'Practical breakdown of NAS100 and US30 NY Open dynamics covering pre-market highs/lows, opening stop runs, and managing high-speed index volatility.',
    'youtube',
    'Precision Synthetic Trades',
    'https://www.youtube.com/watch?v=wYrtRSdAEro',
    'wYrtRSdAEro',
    'https://i.ytimg.com/vi/wYrtRSdAEro/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Precision Synthetic Trades on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000129',
    'Boot Camp Day 36: Daily Bias pt. 3',
    'Applied daily-bias session demonstrating how to frame pre-market draw on liquidity and align NY Open index execution with higher-timeframe order flow.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=Y1lqifylC4s',
    'Y1lqifylC4s',
    'https://i.ytimg.com/vi/Y1lqifylC4s/hqdefault.jpg',
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

  -- Module 12: Crypto Playbook
  (
    '40000000-0000-4000-8000-000000000130',
    'Bitcoin Dominance: Why Crypto Money Flows into Bitcoin FIRST',
    'Official educational breakdown explaining why institutional and retail crypto liquidity rotates into Bitcoin first and how BTC Dominance guides market selection.',
    'youtube',
    'Binance',
    'https://www.youtube.com/watch?v=ruNDNo8ceLE',
    'ruNDNo8ceLE',
    'https://i.ytimg.com/vi/ruNDNo8ceLE/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Binance on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000131',
    'Bitcoin Dominance Explained (And How It Affects Other Coins)',
    'Concise visual explainer covering how shifts in Bitcoin Dominance signal altcoin rotation phases versus risk-off Bitcoin flight.',
    'youtube',
    'Coingecko',
    'https://www.youtube.com/watch?v=kpShnKWJNg8',
    'kpShnKWJNg8',
    'https://i.ytimg.com/vi/kpShnKWJNg8/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Coingecko on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000132',
    'What is FUNDING RATE in Crypto? Explained in 3 minutes',
    'Crisp 3-minute primer on perpetual futures funding rates, who pays whom when markets overheat, and how extreme funding foreshadows liquidation squeezes.',
    'youtube',
    'Coingecko',
    'https://www.youtube.com/watch?v=G3-HjS0ZD6o',
    'G3-HjS0ZD6o',
    'https://i.ytimg.com/vi/G3-HjS0ZD6o/hqdefault.jpg',
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

  -- Module 13: Stocks Playbook
  (
    '40000000-0000-4000-8000-000000000133',
    'Simplest Trading Strategy: 2-Minute Opening Range Breakout (Just Copy This)',
    'Step-by-step equities playbook demonstrating how to execute Opening Range Breakouts (ORB) on high-volume Stocks in Play aligned with VWAP.',
    'youtube',
    'Bear Bull Traders',
    'https://www.youtube.com/watch?v=tJHMj_z_txs',
    'tJHMj_z_txs',
    'https://i.ytimg.com/vi/tJHMj_z_txs/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Bear Bull Traders on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000134',
    'How I Trade Gaps - The Range Breakout Setup',
    'Detailed walkthrough on trading earnings and catalyst gaps using Opening Range levels, volume validation, and structured risk management.',
    'youtube',
    'Richard Moglen',
    'https://www.youtube.com/watch?v=K5QedHcMEQ8',
    'K5QedHcMEQ8',
    'https://i.ytimg.com/vi/K5QedHcMEQ8/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Richard Moglen on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000135',
    'How to Build a Pre-Market Trading Plan: Day Trading Strategy for Beginners!',
    'Practical morning prep routine showing how equity traders filter pre-market gappers, mark key PMH/PML levels, and plan scenarios before 09:30 EST.',
    'youtube',
    'TraderTV Live',
    'https://www.youtube.com/watch?v=9xapY-2w4RY',
    '9xapY-2w4RY',
    'https://i.ytimg.com/vi/9xapY-2w4RY/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TraderTV Live on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 14: Building an A+ Setup Checklist
  (
    '40000000-0000-4000-8000-000000000136',
    'Boot Camp Day 30: Execution',
    'Comprehensive execution walkthrough tying together HTF bias, liquidity sweeps, displacement shifts, and mechanical entry triggers into one repeatable model.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=ESsy0uoFAz4',
    'ESsy0uoFAz4',
    'https://i.ytimg.com/vi/ESsy0uoFAz4/hqdefault.jpg',
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
    '40000000-0000-4000-8000-000000000137',
    'Path to Profitability: Advanced Imbalance Concepts',
    'Advanced confluence lesson demonstrating how high-probability imbalances align with liquidity sweeps and structure to filter out mediocre setups.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=PlsHO33j6B8',
    'PlsHO33j6B8',
    'https://i.ytimg.com/vi/PlsHO33j6B8/hqdefault.jpg',
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

  -- Module 15: Trade Management
  (
    '40000000-0000-4000-8000-000000000138',
    'Boot Camp Day 37: Taking Profits',
    'Targeted lesson on setting logical take-profit targets at opposing liquidity pools, avoiding fearful early exits, and letting structured winners finish.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=FjSiLFrg5fo',
    'FjSiLFrg5fo',
    'https://i.ytimg.com/vi/FjSiLFrg5fo/hqdefault.jpg',
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
    '40000000-0000-4000-8000-000000000139',
    'Boot Camp 2.0 Day 8: How to split positions',
    'Practical guide on splitting positions for systematic partial profit-taking, securing realized R at intermediate milestones, and trailing runners cleanly.',
    'youtube',
    'TJR',
    'https://www.youtube.com/watch?v=5v4G4xJVKIQ',
    '5v4G4xJVKIQ',
    'https://i.ytimg.com/vi/5v4G4xJVKIQ/hqdefault.jpg',
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

  -- Module 17: Trading Journal & Expectancy
  (
    '40000000-0000-4000-8000-000000000140',
    'Why a High Win Rate Can Still Lose You Money (Expectancy Explained)',
    'Eye-opening mathematical breakdown proving why win rate alone misleads traders and how Expectancy and Profit Factor determine true long-term edge.',
    'youtube',
    'The Trading Foundry',
    'https://www.youtube.com/watch?v=nhAvP7LJUoQ',
    'nhAvP7LJUoQ',
    'https://i.ytimg.com/vi/nhAvP7LJUoQ/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by The Trading Foundry on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    92,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000141',
    'How To JOURNAL TRADES Professionally',
    'Actionable guide to building a lean, repeatable trading journal that tracks rule adherence, screenshots, setup grades, and weekly data reviews.',
    'youtube',
    'Jason Graystone',
    'https://www.youtube.com/watch?v=sgO2pCYEY68',
    'sgO2pCYEY68',
    'https://i.ytimg.com/vi/sgO2pCYEY68/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Jason Graystone on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    91,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),

  -- Module 18: Handling Drawdowns & Scaling
  (
    '40000000-0000-4000-8000-000000000142',
    'How to Handle Trading Drawdowns (Step-by-step process)',
    'Professional prop-desk framework for navigating inevitable losing streaks using risk throttling, objective process audits, and anti-tilt circuit breakers.',
    'youtube',
    'TheOneLanceB',
    'https://www.youtube.com/watch?v=o7DfwJTC_Ow',
    'o7DfwJTC_Ow',
    'https://i.ytimg.com/vi/o7DfwJTC_Ow/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by TheOneLanceB on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    93,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  ),
  (
    '40000000-0000-4000-8000-000000000143',
    'What to Track in Your Trading Journal (And What to Ignore)',
    'Focused discipline session distinguishing actionable consistency metrics from vanity stats so traders stay composed through drawdowns and scale steadily.',
    'youtube',
    'Japanese Ichimoku Trader Kei',
    'https://www.youtube.com/watch?v=xs792liucck',
    'xs792liucck',
    'https://i.ytimg.com/vi/xs792liucck/hqdefault.jpg',
    NULL,
    'video',
    'youtube_standard_embed',
    'Created by Japanese Ichimoku Trader Kei on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.',
    true,
    'published',
    90,
    true,
    '2026-04-01T00:00:00Z'::timestamptz
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. Lesson-to-Resource Mappings (27 New Rows: 0117–0143)
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
  -- Module 1: candlestick-anatomy
  (
    '30000000-0000-4000-8000-000000000117',
    '20000000-0000-4000-8000-000000000007',
    '40000000-0000-4000-8000-000000000117',
    98,
    1,
    'Focus on how candle bodies and wicks tell the story of order-flow control rather than memorizing isolated candlestick names.',
    ARRAY[
      'Read body expansion for directional conviction and long wicks for liquidity rejection at key levels.',
      'Always wait for the candle to close before confirming direction on any timeframe.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000118',
    '20000000-0000-4000-8000-000000000007',
    '40000000-0000-4000-8000-000000000118',
    95,
    2,
    'Observe how individual candles link together into impulse legs and pullbacks so you read price action smoothly.',
    ARRAY[
      'Interpret candle behavior in the context of surrounding structure instead of treating single bars in isolation.',
      'Compare closing position relative to the full high-low range to spot momentum shifts early.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 3: support-resistance-supply-demand
  (
    '30000000-0000-4000-8000-000000000119',
    '20000000-0000-4000-8000-000000000008',
    '40000000-0000-4000-8000-000000000119',
    97,
    1,
    'Pay attention to how departure strength and freshness separate high-probability Supply/Demand zones from worn-out S/R lines.',
    ARRAY[
      'Prioritize fresh Supply/Demand origins that launched forceful displacement and broke structure.',
      'Recognize when repeatedly tested horizontal lines are weakening into liquidity targets.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000120',
    '20000000-0000-4000-8000-000000000008',
    '40000000-0000-4000-8000-000000000120',
    94,
    2,
    'Watch how marking clean, prominent zones keeps charts uncluttered and highlights polarity flips after clean breaks.',
    ARRAY[
      'Draw S/R as price areas framing swing turning points rather than fragile 1-tick lines.',
      'Respect polarity flips when broken resistance holds from above as new support.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 8: order-blocks-bos-choch
  (
    '30000000-0000-4000-8000-000000000121',
    '20000000-0000-4000-8000-000000000009',
    '40000000-0000-4000-8000-000000000121',
    98,
    1,
    'Look closely at the exact criteria that turn an ordinary opposing candle into a valid institutional Order Block.',
    ARRAY[
      'Require a liquidity sweep, displacement imbalance (FVG), and structural break to validate an Order Block.',
      'Ignore slow, unvalidated candles in choppy mid-range that fail to break structure.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000122',
    '20000000-0000-4000-8000-000000000009',
    '40000000-0000-4000-8000-000000000122',
    96,
    2,
    'Notice how pairing an unmitigated Order Block with an adjacent Fair Value Gap tightens invalidation and entry timing.',
    ARRAY[
      'Track both the Order Block open and 50% mean threshold while anchoring stops beyond the OB extreme.',
      'Treat a full-body close cleanly through an Order Block as invalidation rather than hoping for a bounce.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000123',
    '20000000-0000-4000-8000-000000000009',
    '40000000-0000-4000-8000-000000000123',
    93,
    3,
    'Watch how identifying inducement liquidity ahead of an extreme Order Block keeps you from getting swept early.',
    ARRAY[
      'Favor unmitigated extreme Order Blocks over shallow mid-leg inducement blocks sitting above resting stops.',
      'Confirm CHoCH with a candle-body close after a liquidity raid before executing.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 9: multi-timeframe-alignment
  (
    '30000000-0000-4000-8000-000000000124',
    '20000000-0000-4000-8000-000000000010',
    '40000000-0000-4000-8000-000000000124',
    98,
    1,
    'Pay attention to how each timeframe in a 3-chart stack has one distinct job: Bias, Point of Interest, and Trigger.',
    ARRAY[
      'Always map Higher-Timeframe directional bias and external targets before opening a 5m or 1m chart.',
      'Wait for price to enter an HTF Point of Interest before hunting for lower-timeframe CHoCH entries.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000125',
    '20000000-0000-4000-8000-000000000010',
    '40000000-0000-4000-8000-000000000125',
    95,
    2,
    'Notice how a clean 5-minute downtrend can simply be a 4H bullish pullback straight into strong HTF demand.',
    ARRAY[
      'Never short an LTF downtrend directly into an untouched HTF demand floor without checking alignment.',
      'Let Higher-Timeframe structure override conflicting Lower-Timeframe micro-signals.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 10: forex-sessions-killzones
  (
    '30000000-0000-4000-8000-000000000126',
    '20000000-0000-4000-8000-000000000011',
    '40000000-0000-4000-8000-000000000126',
    97,
    1,
    'Track the exact EST session windows and notice how Asian High and Asian Low become primary targets for London and NY.',
    ARRAY[
      'Concentrate Forex execution inside London or New York Killzones when institutional volume and spreads are optimal.',
      'Box Asian Range highs and lows daily to anticipate Power of 3 manipulation sweeps.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000127',
    '20000000-0000-4000-8000-000000000011',
    '40000000-0000-4000-8000-000000000127',
    94,
    2,
    'Compare directional expansion during London/NY opens against sluggish off-session price action.',
    ARRAY[
      'Filter out dead late-day sessions to cut unnecessary whipsaw losses immediately.',
      'Pair Killzone sweeps with DXY alignment and high-impact news discipline.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 11: indices-ny-open-playbook
  (
    '30000000-0000-4000-8000-000000000128',
    '20000000-0000-4000-8000-000000000012',
    '40000000-0000-4000-8000-000000000128',
    96,
    1,
    'Observe how patience through the chaotic 09:30 EST opening minutes reveals clean directional structure on NAS100 and US30.',
    ARRAY[
      'Wait for the 09:30 EST opening dust to settle and confirm 5m candle closes around Pre-Market High/Low.',
      'Reduce contract/lot size to match wider NAS100/US30 point swings so 1R risk stays constant.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000129',
    '20000000-0000-4000-8000-000000000012',
    '40000000-0000-4000-8000-000000000129',
    95,
    2,
    'Focus on how establishing daily bias before 09:30 EST stops you from chasing both sides of the opening spike.',
    ARRAY[
      'Anchor NY Open index trades to Previous Day High/Low and Pre-Market liquidity pools.',
      'Use correlated SMT divergence across NAS100, SPX500, and US30 to confirm institutional reversals.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 12: crypto-247-liquidity-playbook
  (
    '30000000-0000-4000-8000-000000000130',
    '20000000-0000-4000-8000-000000000013',
    '40000000-0000-4000-8000-000000000130',
    97,
    1,
    'Note the exact relationship between BTC price trend and BTC.D when deciding whether to focus on Bitcoin or altcoins.',
    ARRAY[
      'Check Bitcoin structure and BTC Dominance first before taking any altcoin setup.',
      'Avoid forcing altcoin longs when capital is concentrating strictly into BTC or exiting risk.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000131',
    '20000000-0000-4000-8000-000000000013',
    '40000000-0000-4000-8000-000000000131',
    95,
    2,
    'Watch how consolidating BTC paired with falling BTC.D creates healthier conditions for altcoin breakouts.',
    ARRAY[
      'Altcoin breakouts hold cleanest when BTC is stable or trending higher while BTC.D drifts lower.',
      'Respect 24/7 weekend thin liquidity and wait for Monday confirmation on major range breaks.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000132',
    '20000000-0000-4000-8000-000000000013',
    '40000000-0000-4000-8000-000000000132',
    96,
    3,
    'Focus on why deeply positive funding near resistance warns of overcrowded longs ripe for a liquidation flush.',
    ARRAY[
      'Extreme positive or negative funding signals overcrowded leverage vulnerable to fast squeeze wicks.',
      'Size every crypto trade strictly to a real structural stop-loss—never your exchange liquidation price.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 13: stocks-gaps-rvol-playbook
  (
    '30000000-0000-4000-8000-000000000133',
    '20000000-0000-4000-8000-000000000014',
    '40000000-0000-4000-8000-000000000133',
    98,
    1,
    'Watch how the opening candle range, volume expansion, and VWAP work together to confirm genuine institutional buying.',
    ARRAY[
      'Focus Opening Range Breakouts strictly on liquid Stocks in Play backed by RVOL ≥ 2.0 and fresh catalysts.',
      'Require stocks to hold above VWAP for long ORBs and size exact share count from Dollar Risk ÷ Stop Distance.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000134',
    '20000000-0000-4000-8000-000000000014',
    '40000000-0000-4000-8000-000000000134',
    96,
    2,
    'Pay attention to how clean range highs separate lasting Gap-and-Go trends from fading opening traps.',
    ARRAY[
      'Wait for opening range validation instead of blindly buying the very first second of a pre-market gap.',
      'Respect failed gaps immediately if price loses VWAP and breaks the Opening Range Low on heavy volume.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000135',
    '20000000-0000-4000-8000-000000000014',
    '40000000-0000-4000-8000-000000000135',
    94,
    3,
    'Follow the exact pre-market checklist so you arrive at the 09:30 bell with 2–3 focused tickers instead of chasing scanners.',
    ARRAY[
      'Mark Pre-Market High, Pre-Market Low, and Yesterday’s Close on your top 2–3 high-RVOL stocks before the bell.',
      'Check SPY/QQQ market tide alignment so you trade stocks showing clear Relative Strength.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 14: confluence-a-plus-setups
  (
    '30000000-0000-4000-8000-000000000136',
    '20000000-0000-4000-8000-000000000015',
    '40000000-0000-4000-8000-000000000136',
    98,
    1,
    'Watch how stacking confluence criteria turns multiple individual concepts into a single decisive A+ execution checklist.',
    ARRAY[
      'Score every trade against a fixed 5-point checklist and refuse to take C-grade boredom trades.',
      'Commit to one written execution model across 50–100 repetitions instead of strategy hopping.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000137',
    '20000000-0000-4000-8000-000000000015',
    '40000000-0000-4000-8000-000000000137',
    95,
    2,
    'Notice how eliminating low-confluence imbalances protects mental capital and raises overall R-multiple consistency.',
    ARRAY[
      'Stack narrative, session timing, liquidity sweep, displacement imbalance, and ≥ 1:2.5 R:R before clicking enter.',
      'Treat "No Trade" as a winning position whenever your checklist boxes are incomplete.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 15: trade-management-partials-be
  (
    '30000000-0000-4000-8000-000000000138',
    '20000000-0000-4000-8000-000000000016',
    '40000000-0000-4000-8000-000000000138',
    98,
    1,
    'Focus on why opposing liquidity pools—not arbitrary dollar amounts—should govern where you bank profits.',
    ARRAY[
      'Define partial and final targets at logical liquidity pools before entering the position.',
      'Avoid choking trades with premature breakeven stops before price breaks structure in your favor.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000139',
    '20000000-0000-4000-8000-000000000016',
    '40000000-0000-4000-8000-000000000139',
    96,
    2,
    'Track how splitting a position cleanly at +2R balances emotional relief with capturing full +3R to +4R runners.',
    ARRAY[
      'Calculate blended R-multiple across partial and runner slices so scaling enhances—never guts—expectancy.',
      'Trail remaining runners behind newly confirmed protected swings rather than live candle noise.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 17: trading-journal-expectancy
  (
    '30000000-0000-4000-8000-000000000140',
    '20000000-0000-4000-8000-000000000017',
    '40000000-0000-4000-8000-000000000140',
    98,
    1,
    'Follow the exact Expectancy formula examples and compare high-win-rate negative-R traps against disciplined asymmetric models.',
    ARRAY[
      'Always evaluate Expectancy = (Win Rate × Avg Win R) − (Loss Rate × Avg Loss R) across 30+ trades.',
      'Protecting -1R maximum loss keeps positive expectancy intact even at a 40%–45% win rate.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000141',
    '20000000-0000-4000-8000-000000000017',
    '40000000-0000-4000-8000-000000000141',
    96,
    2,
    'Focus on the small set of high-signal fields worth logging every session so journaling becomes an effortless habit.',
    ARRAY[
      'Log Setup Grade, Planned vs. Actual R, screenshots, emotional state, and Rule Adherence on every trade.',
      'Run a weekly audit to identify and delete your single most expensive recurring behavioral leak.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),

  -- Module 18: drawdown-scaling-consistency
  (
    '30000000-0000-4000-8000-000000000142',
    '20000000-0000-4000-8000-000000000018',
    '40000000-0000-4000-8000-000000000142',
    98,
    1,
    'Notice how cutting risk in half during drawdowns protects both capital and confidence so you recover cleanly.',
    ARRAY[
      'Pre-commit to daily/weekly loss caps and automatic half-risk throttling when drawdown hits -4% to -5%.',
      'Audit whether losses came from normal variance or Tilt before resuming full risk or scaling capital.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  ),
  (
    '30000000-0000-4000-8000-000000000143',
    '20000000-0000-4000-8000-000000000018',
    '40000000-0000-4000-8000-000000000143',
    94,
    2,
    'Pay attention to which psychological and execution metrics tell you when you are genuinely ready to scale up size.',
    ARRAY[
      'Track Rule-Adherence Percentage and R-multiples rather than obsessing over short-term dollar P&L swings.',
      'Scale risk gradually in modest increments only after new equity highs backed by 30–50 disciplined trades.'
    ],
    'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.'
  )
ON CONFLICT DO NOTHING;
