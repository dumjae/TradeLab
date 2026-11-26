-- TradeLab Academy — Migration 002: Trader Mindset & Quotations System
-- PostgreSQL / Supabase Migration with strict attribution constraints, indexes, RLS, and starter quote seeds
--
-- Rollback Reference (execute in reverse dependency order if reverting):
--   DROP TABLE IF EXISTS public.user_favorite_quotes CASCADE;
--   DROP TABLE IF EXISTS public.trading_quotes CASCADE;

-- ============================================================================
-- 1. Trading Quotes & User Favorites Schema
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.trading_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_text TEXT NOT NULL CHECK (char_length(trim(quote_text)) >= 5),
  author TEXT NOT NULL CHECK (char_length(trim(author)) >= 2),
  author_role TEXT NOT NULL DEFAULT '',
  source_type TEXT NOT NULL CHECK (source_type IN ('verified_trader', 'tradelab_principle', 'user_custom')),
  category TEXT NOT NULL CHECK (category IN ('motivate', 'teach', 'inspire')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'taglish')),
  trading_lesson_note TEXT NOT NULL CHECK (char_length(trim(trading_lesson_note)) >= 10),
  related_concepts TEXT[] NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_trading_quotes_ownership CHECK (
    (source_type = 'user_custom' AND user_id IS NOT NULL AND is_public = false)
    OR (source_type IN ('verified_trader', 'tradelab_principle') AND user_id IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_trading_quotes_public_category
  ON public.trading_quotes(is_public, category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trading_quotes_source_type
  ON public.trading_quotes(source_type);
CREATE INDEX IF NOT EXISTS idx_trading_quotes_user_id
  ON public.trading_quotes(user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trading_quotes_related_concepts
  ON public.trading_quotes USING GIN (related_concepts);

DROP TRIGGER IF EXISTS trg_trading_quotes_updated_at ON public.trading_quotes;
CREATE TRIGGER trg_trading_quotes_updated_at
  BEFORE UPDATE ON public.trading_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.user_favorite_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id UUID NOT NULL REFERENCES public.trading_quotes(id) ON DELETE CASCADE,
  personal_reflection TEXT NOT NULL DEFAULT '',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_favorite_quotes_user_quote UNIQUE (user_id, quote_id)
);

CREATE INDEX IF NOT EXISTS idx_user_favorite_quotes_user_pinned
  ON public.user_favorite_quotes(user_id, is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_favorite_quotes_quote
  ON public.user_favorite_quotes(quote_id);

DROP TRIGGER IF EXISTS trg_user_favorite_quotes_updated_at ON public.user_favorite_quotes;
CREATE TRIGGER trg_user_favorite_quotes_updated_at
  BEFORE UPDATE ON public.user_favorite_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 2. Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.trading_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_quotes ENABLE ROW LEVEL SECURITY;

-- trading_quotes: public read for is_public = true; private custom CRUD for owner; admin manages curated rows
DROP POLICY IF EXISTS "trading_quotes_select_public_or_own" ON public.trading_quotes;
CREATE POLICY trading_quotes_select_public_or_own
  ON public.trading_quotes
  FOR SELECT
  USING (
    is_public = true
    OR (source_type = 'user_custom' AND auth.uid() = user_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "trading_quotes_insert_custom_or_admin" ON public.trading_quotes;
CREATE POLICY trading_quotes_insert_custom_or_admin
  ON public.trading_quotes
  FOR INSERT
  WITH CHECK (
    (source_type = 'user_custom' AND auth.uid() = user_id AND is_public = false)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "trading_quotes_update_custom_or_admin" ON public.trading_quotes;
CREATE POLICY trading_quotes_update_custom_or_admin
  ON public.trading_quotes
  FOR UPDATE
  USING (
    (source_type = 'user_custom' AND auth.uid() = user_id)
    OR public.is_admin()
  )
  WITH CHECK (
    (source_type = 'user_custom' AND auth.uid() = user_id AND is_public = false)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "trading_quotes_delete_custom_or_admin" ON public.trading_quotes;
CREATE POLICY trading_quotes_delete_custom_or_admin
  ON public.trading_quotes
  FOR DELETE
  USING (
    (source_type = 'user_custom' AND auth.uid() = user_id)
    OR public.is_admin()
  );

-- user_favorite_quotes: strictly private to auth.uid() = user_id
DROP POLICY IF EXISTS "user_favorite_quotes_select_own" ON public.user_favorite_quotes;
CREATE POLICY user_favorite_quotes_select_own
  ON public.user_favorite_quotes
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_favorite_quotes_insert_own" ON public.user_favorite_quotes;
CREATE POLICY user_favorite_quotes_insert_own
  ON public.user_favorite_quotes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_favorite_quotes_update_own" ON public.user_favorite_quotes;
CREATE POLICY user_favorite_quotes_update_own
  ON public.user_favorite_quotes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_favorite_quotes_delete_own" ON public.user_favorite_quotes;
CREATE POLICY user_favorite_quotes_delete_own
  ON public.user_favorite_quotes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. Idempotent Starter Quote Seeds (39 Curated Quotes: 13 Motivate / 13 Teach / 13 Inspire)
-- ============================================================================

INSERT INTO public.trading_quotes (
  id, quote_text, author, author_role, source_type, category, language,
  trading_lesson_note, related_concepts, is_public, user_id
) VALUES
  -- MOTIVATE (13)
  (
    '10000000-0000-4000-8000-000000000001',
    'The consistency you seek is in your mind, not in the markets.',
    'Mark Douglas',
    'Author, Trading in the Zone',
    'verified_trader',
    'motivate',
    'en',
    'Markets shift between trending, ranging, and sweeping liquidity every session. Consistency comes from executing the same risk rules and checklist regardless of recent wins or losses.',
    ARRAY['risk-psychology', 'market-structure'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Pain + Reflection = Progress.',
    'Ray Dalio',
    'Founder, Bridgewater Associates (Principles)',
    'verified_trader',
    'motivate',
    'en',
    'A losing trade or missed liquidity sweep only becomes wasted tuition if you close the chart in anger. Log the setup, note whether you followed your rules, and extract one adjustment.',
    ARRAY['risk-psychology', 'liquidity-sweeps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'Learn to take the losses. The most important thing in making money is not letting your losses get out of hand.',
    'Marty Schwartz',
    'Champion Trader, Featured in Market Wizards',
    'verified_trader',
    'motivate',
    'en',
    'Taking a planned 1R stop-loss is a win for your discipline. Moving a stop wider after structure invalidates turns a small routine cost into account damage.',
    ARRAY['risk-psychology', 'market-structure'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'The goal of a successful trader is to make the best trades. Money is secondary.',
    'Alexander Elder',
    'Trader & Author, Trading for a Living',
    'verified_trader',
    'motivate',
    'en',
    'Grade yourself on process execution—waiting for the sweep, confirming displacement, and respecting position size—rather than staring at fluctuating unrealized P&L.',
    ARRAY['risk-psychology', 'liquidity-sweeps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'Win or lose, everybody gets what they want out of the market.',
    'Ed Seykota',
    'Trend-Following Pioneer, Featured in Market Wizards',
    'verified_trader',
    'motivate',
    'en',
    'If you chase excitement and click buttons during mid-range chop, the market gives you thrills—not profits. Decide whether you want adrenaline or a repeatable edge.',
    ARRAY['risk-psychology', 'market-liquidity'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    'Where you want to be is always in control, never wishing, always trading, and always, first and foremost, protecting your butt.',
    'Paul Tudor Jones',
    'Macro Trader & Hedge Fund Founder, Featured in Market Wizards',
    'verified_trader',
    'motivate',
    'en',
    'The moment you catch yourself hoping price bounces back to breakeven, you stopped trading your plan. Define invalidation before entry and obey it without negotiation.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000007',
    'A skipped mediocre trade protects both your capital and your mental clarity for the A+ setup.',
    'TradeLab Academy',
    'TradeLab Execution Principle',
    'tradelab_principle',
    'motivate',
    'en',
    'Standing aside when price sits between equal highs and equal lows with no sweep yet is an active trading decision—flat is a valid position.',
    ARRAY['equal-highs-lows', 'risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000008',
    'One stop-loss does not erase your skill; revenge trading after it does.',
    'TradeLab Academy',
    'TradeLab Execution Principle',
    'tradelab_principle',
    'motivate',
    'en',
    'After any loss, enforce a mandatory 15-minute cooldown away from the order ticket so your next trade comes from market structure, not emotional recovery.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000009',
    'Small daily chart reps compound faster than weekend binge-watching without practice.',
    'TradeLab Academy',
    'TradeLab Study Principle',
    'tradelab_principle',
    'motivate',
    'en',
    'Studying 3 annotated historical scenarios and logging 5 practice identifications each day trains pattern recognition far better than passive scrolling.',
    ARRAY['market-structure', 'liquidity-sweeps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000010',
    'Respect your daily loss limit while your mind is calm, because your future stressed self will argue with it.',
    'TradeLab Academy',
    'TradeLab Risk Principle',
    'tradelab_principle',
    'motivate',
    'en',
    'Pre-commit a hard maximum daily drawdown (for example, 2R) before the session opens and stop trading immediately if it is reached.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000011',
    'Journal the mistake while it is fresh—your future self will thank you for the clean blueprint.',
    'TradeLab Academy',
    'TradeLab Study Principle',
    'tradelab_principle',
    'motivate',
    'en',
    'When a concept lands in MY DIFFICULT CONCEPTS, review both the chart trigger and your emotional state so the same trap stops repeating.',
    ARRAY['risk-psychology', 'liquidity-sweeps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000012',
    'Hindi ka kailangan mag-trade araw-araw para maging consistent; kailangan mo lang sundin ang plano mo tuwing may malinaw na setup.',
    'TradeLab Academy',
    'TradeLab Filipino Trader Principle',
    'tradelab_principle',
    'motivate',
    'taglish',
    'Discipline means skipping low-probability sessions. Only deploy risk when structure, liquidity, and invalidation align with your checklist.',
    ARRAY['risk-psychology', 'market-structure'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000013',
    'Kapag natalo ang isang trade, bawiin mo sa discipline—hindi sa revenge entry o double lot size.',
    'TradeLab Academy',
    'TradeLab Filipino Trader Principle',
    'tradelab_principle',
    'motivate',
    'taglish',
    'Keep your position risk fixed (e.g., 0.5%–1%) after a loss. Increasing lot size to recover faster turns a normal statistical losing streak into an account blowup.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),

  -- TEACH (13)
  (
    '10000000-0000-4000-8000-000000000014',
    'The elements of good trading are: (1) cutting losses, (2) cutting losses, and (3) cutting losses.',
    'Ed Seykota',
    'Trend-Following Pioneer, Featured in Market Wizards',
    'verified_trader',
    'teach',
    'en',
    'Every setup—even a textbook liquidity sweep into an FVG—can fail. Strict stop-loss placement at structural invalidation keeps your capital intact for asymmetric winners.',
    ARRAY['risk-psychology', 'fair-value-gaps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000015',
    'The most important rule of trading is to play great defense, not great offense.',
    'Paul Tudor Jones',
    'Macro Trader & Hedge Fund Founder, Featured in Market Wizards',
    'verified_trader',
    'teach',
    'en',
    'Calculate your stop-loss distance and exact dollar risk first before imagining target profits. Defense determines survival; survival allows compounding.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000016',
    'Whenever I enter a position, I have a predetermined stop. That is the only way I can sleep.',
    'Bruce Kovner',
    'Global Macro Trader, Featured in Market Wizards',
    'verified_trader',
    'teach',
    'en',
    'Never enter a chart setup using a "mental stop." Place your hard stop beyond the sweep wick or swing invalidation point so your maximum loss is known before execution.',
    ARRAY['risk-psychology', 'liquidity-sweeps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000017',
    'Place your stops at a point that, if reached, will reasonably indicate that the trade is wrong.',
    'Bruce Kovner',
    'Global Macro Trader, Featured in Market Wizards',
    'verified_trader',
    'teach',
    'en',
    'Do not place stops right on obvious equal highs or equal lows where liquidity sits. Put your stop beyond the structural point where your thesis is genuinely invalidated.',
    ARRAY['equal-highs-lows', 'market-liquidity', 'risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000018',
    'You don’t need to know what is going to happen next in order to make money.',
    'Mark Douglas',
    'Author, Trading in the Zone',
    'verified_trader',
    'teach',
    'en',
    'Profitability comes from positive expectancy over 30+ trades—for example, a 45% win rate at 1:2.5 risk-to-reward—not from predicting the next single candle with certainty.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000019',
    'You don’t trade the markets; you trade your beliefs about the markets.',
    'Van K. Tharp',
    'Trading Coach & Author, Trade Your Way to Financial Freedom',
    'verified_trader',
    'teach',
    'en',
    'Audit the assumptions behind every click. If you believe every break above resistance must run immediately, you will repeatedly become exit liquidity during sweeps.',
    ARRAY['liquidity-sweeps', 'market-liquidity', 'risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000020',
    'It’s not whether you’re right or wrong that’s important, but how much money you make when you’re right and how much you lose when you’re wrong.',
    'George Soros',
    'Macro Investor & Author, The Alchemy of Finance',
    'verified_trader',
    'teach',
    'en',
    'Asymmetric payoff (R-multiples) beats chasing a 90% win rate. Cutting invalid setups at -1R while holding displacement moves to +2.5R or +3R builds a durable mathematical edge.',
    ARRAY['risk-psychology', 'fair-value-gaps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000021',
    'The stock market is never obvious. It is designed to fool most of the people, most of the time.',
    'Jesse Livermore',
    'Historic Speculator, Reminiscences of a Stock Operator',
    'verified_trader',
    'teach',
    'en',
    'Clean equal highs and textbook horizontal lines attract crowded retail stops and breakout orders. Always wait for candle close confirmation and displacement before committing.',
    ARRAY['equal-highs-lows', 'liquidity-sweeps', 'market-liquidity'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000022',
    'The trend is your friend except at the end where it bends.',
    'Ed Seykota',
    'Trend-Following Pioneer, Featured in Market Wizards',
    'verified_trader',
    'teach',
    'en',
    'Respect higher highs and higher lows until a decisive break of structure (BOS) and opposite displacement actually confirm the trend has shifted.',
    ARRAY['market-structure'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000023',
    'A wick beyond equal highs grabs orders; a strong body close with follow-through confirms acceptance.',
    'TradeLab Academy',
    'TradeLab Price Action Principle',
    'tradelab_principle',
    'teach',
    'en',
    'Use the candle close—not the mid-candle spike—as your primary filter to distinguish a liquidity sweep from a genuine breakout.',
    ARRAY['liquidity-sweeps', 'equal-highs-lows'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000024',
    'If you cannot see where the resting liquidity sits on the chart, you are probably providing it.',
    'TradeLab Academy',
    'TradeLab Liquidity Principle',
    'tradelab_principle',
    'teach',
    'en',
    'Before entering any trade, mark the nearest buy-side liquidity (swing highs / equal highs) and sell-side liquidity (swing lows / equal lows) to know where stops are clustered.',
    ARRAY['market-liquidity', 'equal-highs-lows'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000025',
    'An imbalance without higher-timeframe structure alignment is just noise—context turns a Fair Value Gap into a setup.',
    'TradeLab Academy',
    'TradeLab Structure Principle',
    'tradelab_principle',
    'teach',
    'en',
    'Prioritize Fair Value Gaps that form immediately after a liquidity sweep and a structural shift, rather than clicking every random three-candle gap in a sideways range.',
    ARRAY['fair-value-gaps', 'market-structure', 'liquidity-sweeps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000026',
    'Hintayin magsara ang kandila bago mag-desisyon—maraming breakout na wick lang pala at liquidity sweep sa huli.',
    'TradeLab Academy',
    'TradeLab Filipino Trader Principle',
    'tradelab_principle',
    'teach',
    'taglish',
    'Entering mid-candle because of FOMO traps you at the extreme of a sweep wick. Waiting for candle close gives you objective proof of rejection versus acceptance.',
    ARRAY['liquidity-sweeps', 'equal-highs-lows'],
    true,
    NULL
  ),

  -- INSPIRE (13)
  (
    '10000000-0000-4000-8000-000000000027',
    'The big money is not in the buying and selling, but in the waiting.',
    'Charlie Munger',
    'Former Vice Chairman, Berkshire Hathaway',
    'verified_trader',
    'inspire',
    'en',
    'Patience pays twice in trading: waiting for price to reach your key liquidity level before entering, and letting a valid thesis reach its structural target without early panic.',
    ARRAY['market-liquidity', 'risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000028',
    'It never was my thinking that made the big money for me. It always was my sitting.',
    'Jesse Livermore',
    'Historic Speculator, Reminiscences of a Stock Operator',
    'verified_trader',
    'inspire',
    'en',
    'Once structure confirms your bias and risk is defined, resist micromanaging every lower-timeframe tick. Let your pre-planned trade thesis play out.',
    ARRAY['market-structure', 'risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000029',
    'Every moment in the market is unique.',
    'Mark Douglas',
    'Author, Trading in the Zone',
    'verified_trader',
    'inspire',
    'en',
    'Do not drag emotional scars from your previous trade into the current chart. Evaluate each setup fresh based on objective structure, liquidity, and risk.',
    ARRAY['risk-psychology', 'market-structure'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000030',
    'Don’t focus on making money; focus on protecting what you have.',
    'Paul Tudor Jones',
    'Macro Trader & Hedge Fund Founder, Featured in Market Wizards',
    'verified_trader',
    'inspire',
    'en',
    'Traders who survive their first two years with capital intact give themselves the runway to master execution and benefit from years of compounding.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000031',
    'Mastery begins the day you stop hunting for a secret indicator and start reading price, liquidity, and yourself.',
    'TradeLab Academy',
    'TradeLab Mastery Principle',
    'tradelab_principle',
    'inspire',
    'en',
    'Clean charts with clear swing points, liquidity pools, and written risk rules outperform cluttered indicator templates every single time.',
    ARRAY['market-structure', 'market-liquidity'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000032',
    'The market will still be open tomorrow—never rush a lifetime skill in a single session.',
    'TradeLab Academy',
    'TradeLab Mastery Principle',
    'tradelab_principle',
    'inspire',
    'en',
    'Missing a move costs zero dollars; chasing a missed move after displacement often costs both capital and confidence. Let the next clean cycle come to you.',
    ARRAY['risk-psychology', 'fair-value-gaps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000033',
    'Quiet preparation before the market opens creates calm execution when candles move fast.',
    'TradeLab Academy',
    'TradeLab Mastery Principle',
    'tradelab_principle',
    'inspire',
    'en',
    'Mark your higher-timeframe structure, equal highs/lows, and key Fair Value Gaps before session volatility hits so you react by plan, not impulse.',
    ARRAY['market-structure', 'equal-highs-lows', 'fair-value-gaps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000034',
    'Every skilled trader once stared at the exact same confusing candlesticks you are studying today.',
    'TradeLab Academy',
    'TradeLab Learning Principle',
    'tradelab_principle',
    'inspire',
    'en',
    'Chart clarity is built layer by layer—first structure, then liquidity, then sweeps and imbalances. Keep stacking deliberate visual practice.',
    ARRAY['market-structure', 'liquidity-sweeps'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000035',
    'Protect your confidence like you protect your equity: trade small enough to think clearly and learn deeply.',
    'TradeLab Academy',
    'TradeLab Mastery Principle',
    'tradelab_principle',
    'inspire',
    'en',
    'Oversized positions hijack your rational brain and force premature exits. Keep size modest while building mastery so you can execute objectively.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000036',
    'Real freedom in trading is built on boring, repeatable routines—not viral overnight screenshots.',
    'TradeLab Academy',
    'TradeLab Mastery Principle',
    'tradelab_principle',
    'inspire',
    'en',
    'Ignore social media highlight reels. Focus on your own replay hours, verified setups, and steady execution metrics week after week.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000037',
    'Hindi karera ang trading; mas panalo ang matibay ang proseso at marunong maghintay ng malinaw na pagkakataon.',
    'TradeLab Academy',
    'TradeLab Filipino Trader Principle',
    'tradelab_principle',
    'inspire',
    'taglish',
    'Measure your progress over quarters of disciplined execution, not over one afternoon of candles.',
    ARRAY['risk-psychology', 'market-structure'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000038',
    'Ang kapital mo ang puhunan mo sa pagkatuto—alagaan mo ito para umabot ka sa punto na kabisado mo na ang galaw ng market.',
    'TradeLab Academy',
    'TradeLab Filipino Trader Principle',
    'tradelab_principle',
    'inspire',
    'taglish',
    'Small position sizing while learning buys you hundreds of live lessons without blowing your account before your skill matures.',
    ARRAY['risk-psychology'],
    true,
    NULL
  ),
  (
    '10000000-0000-4000-8000-000000000039',
    'Bawat chart na pinag-aaralan mo ngayon ay dagdag sa kalmadong desisyon mo bukas.',
    'TradeLab Academy',
    'TradeLab Filipino Trader Principle',
    'tradelab_principle',
    'inspire',
    'taglish',
    'Confidence on live charts comes from earned screen time—reviewing before-and-after examples until liquidity sweeps and structural shifts look unmistakable.',
    ARRAY['liquidity-sweeps', 'market-structure', 'fair-value-gaps'],
    true,
    NULL
  )
ON CONFLICT (id) DO NOTHING;
