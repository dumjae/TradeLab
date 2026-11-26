import type { TradingQuote } from '../types/quotes';

export const STARTER_QUOTES: TradingQuote[] = [
  // =========================================================================
  // MOTIVATE (13 quotes: Discipline, Resilience & Consistency)
  // =========================================================================
  {
    id: '10000000-0000-4000-8000-000000000001',
    quoteText: 'The consistency you seek is in your mind, not in the markets.',
    author: 'Mark Douglas',
    authorRole: 'Author, Trading in the Zone',
    sourceType: 'verified_trader',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'Markets shift between trending, ranging, and sweeping liquidity every session. Consistency comes from executing the same risk rules and checklist regardless of recent wins or losses.',
    relatedConcepts: ['risk-psychology', 'market-structure'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    quoteText: 'Pain + Reflection = Progress.',
    author: 'Ray Dalio',
    authorRole: 'Founder, Bridgewater Associates (Principles)',
    sourceType: 'verified_trader',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'A losing trade or missed liquidity sweep only becomes wasted tuition if you close the chart in anger. Log the setup, note whether you followed your rules, and extract one adjustment.',
    relatedConcepts: ['risk-psychology', 'liquidity-sweeps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    quoteText:
      'Learn to take the losses. The most important thing in making money is not letting your losses get out of hand.',
    author: 'Marty Schwartz',
    authorRole: 'Champion Trader, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'Taking a planned 1R stop-loss is a win for your discipline. Moving a stop wider after structure invalidates turns a small routine cost into account damage.',
    relatedConcepts: ['risk-psychology', 'market-structure'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    quoteText:
      'The goal of a successful trader is to make the best trades. Money is secondary.',
    author: 'Alexander Elder',
    authorRole: 'Trader & Author, Trading for a Living',
    sourceType: 'verified_trader',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'Grade yourself on process execution—waiting for the sweep, confirming displacement, and respecting position size—rather than staring at fluctuating unrealized P&L.',
    relatedConcepts: ['risk-psychology', 'liquidity-sweeps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000005',
    quoteText:
      'Win or lose, everybody gets what they want out of the market.',
    author: 'Ed Seykota',
    authorRole: 'Trend-Following Pioneer, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'If you chase excitement and click buttons during mid-range chop, the market gives you thrills—not profits. Decide whether you want adrenaline or a repeatable edge.',
    relatedConcepts: ['risk-psychology', 'market-liquidity'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000006',
    quoteText:
      'Where you want to be is always in control, never wishing, always trading, and always, first and foremost, protecting your butt.',
    author: 'Paul Tudor Jones',
    authorRole: 'Macro Trader & Hedge Fund Founder, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'The moment you catch yourself hoping price bounces back to breakeven, you stopped trading your plan. Define invalidation before entry and obey it without negotiation.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000007',
    quoteText:
      'A skipped mediocre trade protects both your capital and your mental clarity for the A+ setup.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Execution Principle',
    sourceType: 'tradelab_principle',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'Standing aside when price sits between equal highs and equal lows with no sweep yet is an active trading decision—flat is a valid position.',
    relatedConcepts: ['equal-highs-lows', 'risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000008',
    quoteText:
      'One stop-loss does not erase your skill; revenge trading after it does.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Execution Principle',
    sourceType: 'tradelab_principle',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'After any loss, enforce a mandatory 15-minute cooldown away from the order ticket so your next trade comes from market structure, not emotional recovery.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000009',
    quoteText:
      'Small daily chart reps compound faster than weekend binge-watching without practice.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Study Principle',
    sourceType: 'tradelab_principle',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'Studying 3 annotated historical scenarios and logging 5 practice identifications each day trains pattern recognition far better than passive scrolling.',
    relatedConcepts: ['market-structure', 'liquidity-sweeps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000010',
    quoteText:
      'Respect your daily loss limit while your mind is calm, because your future stressed self will argue with it.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Risk Principle',
    sourceType: 'tradelab_principle',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'Pre-commit a hard maximum daily drawdown (for example, 2R) before the session opens and stop trading immediately if it is reached.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000011',
    quoteText:
      'Journal the mistake while it is fresh—your future self will thank you for the clean blueprint.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Study Principle',
    sourceType: 'tradelab_principle',
    category: 'motivate',
    language: 'en',
    tradingLessonNote:
      'When a concept lands in MY DIFFICULT CONCEPTS, review both the chart trigger and your emotional state so the same trap stops repeating.',
    relatedConcepts: ['risk-psychology', 'liquidity-sweeps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000012',
    quoteText:
      'Hindi ka kailangan mag-trade araw-araw para maging consistent; kailangan mo lang sundin ang plano mo tuwing may malinaw na setup.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Filipino Trader Principle',
    sourceType: 'tradelab_principle',
    category: 'motivate',
    language: 'taglish',
    tradingLessonNote:
      'Discipline means skipping low-probability sessions. Only deploy risk when structure, liquidity, and invalidation align with your checklist.',
    relatedConcepts: ['risk-psychology', 'market-structure'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000013',
    quoteText:
      'Kapag natalo ang isang trade, bawiin mo sa discipline—hindi sa revenge entry o double lot size.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Filipino Trader Principle',
    sourceType: 'tradelab_principle',
    category: 'motivate',
    language: 'taglish',
    tradingLessonNote:
      'Keep your position risk fixed (e.g., 0.5%–1%) after a loss. Increasing lot size to recover faster turns a normal statistical losing streak into an account blowup.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // =========================================================================
  // TEACH (13 quotes: Risk Management, Probability, Structure & Edge)
  // =========================================================================
  {
    id: '10000000-0000-4000-8000-000000000014',
    quoteText:
      'The elements of good trading are: (1) cutting losses, (2) cutting losses, and (3) cutting losses.',
    author: 'Ed Seykota',
    authorRole: 'Trend-Following Pioneer, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Every setup—even a textbook liquidity sweep into an FVG—can fail. Strict stop-loss placement at structural invalidation keeps your capital intact for asymmetric winners.',
    relatedConcepts: ['risk-psychology', 'fair-value-gaps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000015',
    quoteText:
      'The most important rule of trading is to play great defense, not great offense.',
    author: 'Paul Tudor Jones',
    authorRole: 'Macro Trader & Hedge Fund Founder, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Calculate your stop-loss distance and exact dollar risk first before imagining target profits. Defense determines survival; survival allows compounding.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000016',
    quoteText:
      'Whenever I enter a position, I have a predetermined stop. That is the only way I can sleep.',
    author: 'Bruce Kovner',
    authorRole: 'Global Macro Trader, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Never enter a chart setup using a "mental stop." Place your hard stop beyond the sweep wick or swing invalidation point so your maximum loss is known before execution.',
    relatedConcepts: ['risk-psychology', 'liquidity-sweeps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000017',
    quoteText:
      'Place your stops at a point that, if reached, will reasonably indicate that the trade is wrong.',
    author: 'Bruce Kovner',
    authorRole: 'Global Macro Trader, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Do not place stops right on obvious equal highs or equal lows where liquidity sits. Put your stop beyond the structural point where your thesis is genuinely invalidated.',
    relatedConcepts: ['equal-highs-lows', 'market-liquidity', 'risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000018',
    quoteText:
      'You don’t need to know what is going to happen next in order to make money.',
    author: 'Mark Douglas',
    authorRole: 'Author, Trading in the Zone',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Profitability comes from positive expectancy over 30+ trades—for example, a 45% win rate at 1:2.5 risk-to-reward—not from predicting the next single candle with certainty.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000019',
    quoteText:
      'You don’t trade the markets; you trade your beliefs about the markets.',
    author: 'Van K. Tharp',
    authorRole: 'Trading Coach & Author, Trade Your Way to Financial Freedom',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Audit the assumptions behind every click. If you believe every break above resistance must run immediately, you will repeatedly become exit liquidity during sweeps.',
    relatedConcepts: ['liquidity-sweeps', 'market-liquidity', 'risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000020',
    quoteText:
      'It’s not whether you’re right or wrong that’s important, but how much money you make when you’re right and how much you lose when you’re wrong.',
    author: 'George Soros',
    authorRole: 'Macro Investor & Author, The Alchemy of Finance',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Asymmetric payoff (R-multiples) beats chasing a 90% win rate. Cutting invalid setups at -1R while holding displacement moves to +2.5R or +3R builds a durable mathematical edge.',
    relatedConcepts: ['risk-psychology', 'fair-value-gaps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000021',
    quoteText:
      'The stock market is never obvious. It is designed to fool most of the people, most of the time.',
    author: 'Jesse Livermore',
    authorRole: 'Historic Speculator, Reminiscences of a Stock Operator',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Clean equal highs and textbook horizontal lines attract crowded retail stops and breakout orders. Always wait for candle close confirmation and displacement before committing.',
    relatedConcepts: ['equal-highs-lows', 'liquidity-sweeps', 'market-liquidity'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000022',
    quoteText:
      'The trend is your friend except at the end where it bends.',
    author: 'Ed Seykota',
    authorRole: 'Trend-Following Pioneer, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Respect higher highs and higher lows until a decisive break of structure (BOS) and opposite displacement actually confirm the trend has shifted.',
    relatedConcepts: ['market-structure'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000023',
    quoteText:
      'A wick beyond equal highs grabs orders; a strong body close with follow-through confirms acceptance.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Price Action Principle',
    sourceType: 'tradelab_principle',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Use the candle close—not the mid-candle spike—as your primary filter to distinguish a liquidity sweep from a genuine breakout.',
    relatedConcepts: ['liquidity-sweeps', 'equal-highs-lows'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000024',
    quoteText:
      'If you cannot see where the resting liquidity sits on the chart, you are probably providing it.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Liquidity Principle',
    sourceType: 'tradelab_principle',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Before entering any trade, mark the nearest buy-side liquidity (swing highs / equal highs) and sell-side liquidity (swing lows / equal lows) to know where stops are clustered.',
    relatedConcepts: ['market-liquidity', 'equal-highs-lows'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000025',
    quoteText:
      'An imbalance without higher-timeframe structure alignment is just noise—context turns a Fair Value Gap into a setup.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Structure Principle',
    sourceType: 'tradelab_principle',
    category: 'teach',
    language: 'en',
    tradingLessonNote:
      'Prioritize Fair Value Gaps that form immediately after a liquidity sweep and a structural shift, rather than clicking every random three-candle gap in a sideways range.',
    relatedConcepts: ['fair-value-gaps', 'market-structure', 'liquidity-sweeps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000026',
    quoteText:
      'Hintayin magsara ang kandila bago mag-desisyon—maraming breakout na wick lang pala at liquidity sweep sa huli.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Filipino Trader Principle',
    sourceType: 'tradelab_principle',
    category: 'teach',
    language: 'taglish',
    tradingLessonNote:
      'Entering mid-candle because of FOMO traps you at the extreme of a sweep wick. Waiting for candle close gives you objective proof of rejection versus acceptance.',
    relatedConcepts: ['liquidity-sweeps', 'equal-highs-lows'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // =========================================================================
  // INSPIRE (13 quotes: Patience, Perspective & Long-Term Mastery)
  // =========================================================================
  {
    id: '10000000-0000-4000-8000-000000000027',
    quoteText:
      'The big money is not in the buying and selling, but in the waiting.',
    author: 'Charlie Munger',
    authorRole: 'Former Vice Chairman, Berkshire Hathaway',
    sourceType: 'verified_trader',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Patience pays twice in trading: waiting for price to reach your key liquidity level before entering, and letting a valid thesis reach its structural target without early panic.',
    relatedConcepts: ['market-liquidity', 'risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000028',
    quoteText:
      'It never was my thinking that made the big money for me. It always was my sitting.',
    author: 'Jesse Livermore',
    authorRole: 'Historic Speculator, Reminiscences of a Stock Operator',
    sourceType: 'verified_trader',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Once structure confirms your bias and risk is defined, resist micromanaging every lower-timeframe tick. Let your pre-planned trade thesis play out.',
    relatedConcepts: ['market-structure', 'risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000029',
    quoteText: 'Every moment in the market is unique.',
    author: 'Mark Douglas',
    authorRole: 'Author, Trading in the Zone',
    sourceType: 'verified_trader',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Do not drag emotional scars from your previous trade into the current chart. Evaluate each setup fresh based on objective structure, liquidity, and risk.',
    relatedConcepts: ['risk-psychology', 'market-structure'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000030',
    quoteText:
      'Don’t focus on making money; focus on protecting what you have.',
    author: 'Paul Tudor Jones',
    authorRole: 'Macro Trader & Hedge Fund Founder, Featured in Market Wizards',
    sourceType: 'verified_trader',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Traders who survive their first two years with capital intact give themselves the runway to master execution and benefit from years of compounding.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000031',
    quoteText:
      'Mastery begins the day you stop hunting for a secret indicator and start reading price, liquidity, and yourself.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Mastery Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Clean charts with clear swing points, liquidity pools, and written risk rules outperform cluttered indicator templates every single time.',
    relatedConcepts: ['market-structure', 'market-liquidity'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000032',
    quoteText:
      'The market will still be open tomorrow—never rush a lifetime skill in a single session.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Mastery Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Missing a move costs zero dollars; chasing a missed move after displacement often costs both capital and confidence. Let the next clean cycle come to you.',
    relatedConcepts: ['risk-psychology', 'fair-value-gaps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000033',
    quoteText:
      'Quiet preparation before the market opens creates calm execution when candles move fast.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Mastery Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Mark your higher-timeframe structure, equal highs/lows, and key Fair Value Gaps before session volatility hits so you react by plan, not impulse.',
    relatedConcepts: ['market-structure', 'equal-highs-lows', 'fair-value-gaps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000034',
    quoteText:
      'Every skilled trader once stared at the exact same confusing candlesticks you are studying today.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Learning Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Chart clarity is built layer by layer—first structure, then liquidity, then sweeps and imbalances. Keep stacking deliberate visual practice.',
    relatedConcepts: ['market-structure', 'liquidity-sweeps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000035',
    quoteText:
      'Protect your confidence like you protect your equity: trade small enough to think clearly and learn deeply.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Mastery Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Oversized positions hijack your rational brain and force premature exits. Keep size modest while building mastery so you can execute objectively.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000036',
    quoteText:
      'Real freedom in trading is built on boring, repeatable routines—not viral overnight screenshots.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Mastery Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'en',
    tradingLessonNote:
      'Ignore social media highlight reels. Focus on your own replay hours, verified setups, and steady execution metrics week after week.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000037',
    quoteText:
      'Hindi karera ang trading; mas panalo ang matibay ang proseso at marunong maghintay ng malinaw na pagkakataon.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Filipino Trader Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'taglish',
    tradingLessonNote:
      'Measure your progress over quarters of disciplined execution, not over one afternoon of candles.',
    relatedConcepts: ['risk-psychology', 'market-structure'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000038',
    quoteText:
      'Ang kapital mo ang puhunan mo sa pagkatuto—alagaan mo ito para umabot ka sa punto na kabisado mo na ang galaw ng market.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Filipino Trader Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'taglish',
    tradingLessonNote:
      'Small position sizing while learning buys you hundreds of live lessons without blowing your account before your skill matures.',
    relatedConcepts: ['risk-psychology'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000039',
    quoteText:
      'Bawat chart na pinag-aaralan mo ngayon ay dagdag sa kalmadong desisyon mo bukas.',
    author: 'TradeLab Academy',
    authorRole: 'TradeLab Filipino Trader Principle',
    sourceType: 'tradelab_principle',
    category: 'inspire',
    language: 'taglish',
    tradingLessonNote:
      'Confidence on live charts comes from earned screen time—reviewing before-and-after examples until liquidity sweeps and structural shifts look unmistakable.',
    relatedConcepts: ['liquidity-sweeps', 'market-structure', 'fair-value-gaps'],
    isPublic: true,
    userId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];
