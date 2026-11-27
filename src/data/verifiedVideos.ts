import type { LessonResourceWithDetails } from '../types/visual-learning';

interface VerifiedYouTubeSeedSpec {
  mappingId: string;
  resourceId: string;
  lessonId: string;
  lessonSlug: string;
  displayOrder: number;
  relevanceScore: number;
  qualityScore: number;
  videoId: string;
  title: string;
  author: string;
  description: string;
  beforeWatchContext: string;
  afterWatchTakeaways: [string, string];
}

const VERIFIED_TIMESTAMP_ISO = '2026-04-01T00:00:00.000Z';

function buildVerifiedYouTubeResource(
  spec: VerifiedYouTubeSeedSpec,
): LessonResourceWithDetails {
  return {
    mapping: {
      id: spec.mappingId,
      lessonId: spec.lessonId,
      lessonSlug: spec.lessonSlug,
      resourceId: spec.resourceId,
      relevanceScore: spec.relevanceScore,
      displayOrder: spec.displayOrder,
      beforeWatchContext: spec.beforeWatchContext,
      afterWatchTakeaways: [...spec.afterWatchTakeaways],
      editorialNotes:
        'Live-verified public YouTube educational video via YouTube oEmbed API. Zero manual timestamps invented.',
    },
    resource: {
      id: spec.resourceId,
      title: spec.title,
      description: spec.description,
      sourceType: 'youtube',
      sourceName: spec.author,
      sourceUrl: `https://www.youtube.com/watch?v=${spec.videoId}`,
      externalVideoId: spec.videoId,
      thumbnailUrl: `https://i.ytimg.com/vi/${spec.videoId}/hqdefault.jpg`,
      durationSeconds: null,
      contentType: 'video',
      licenseStatus: 'youtube_standard_embed',
      attribution: `Created by ${spec.author} on YouTube. Shared as an independent educational reference — not affiliated with or endorsed by the creator.`,
      nonEndorsementNotice: true,
      verificationStatus: 'published',
      qualityScore: spec.qualityScore,
      embeddable: true,
      lastCheckedAt: VERIFIED_TIMESTAMP_ISO,
      createdBy: null,
      createdAt: VERIFIED_TIMESTAMP_ISO,
      updatedAt: VERIFIED_TIMESTAMP_ISO,
    },
    segments: [],
  };
}

const VERIFIED_YOUTUBE_SPECS: VerifiedYouTubeSeedSpec[] = [
  // =========================================================================
  // LESSON 1: Market Structure Basics (market-structure)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000101',
    resourceId: '40000000-0000-4000-8000-000000000101',
    lessonId: '20000000-0000-4000-8000-000000000001',
    lessonSlug: 'market-structure',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'jeewXSLHt2g',
    title: 'The ONLY Break Of Structure Video You’ll Ever Need',
    author: 'TJR',
    description:
      'Focused walkthrough on identifying valid Breaks of Structure (BOS), separating true candle-body closes from misleading wicks, and reading swing progression objectively.',
    beforeWatchContext:
      'Pay close attention to how structural swing highs and lows are marked before calling a Break of Structure, and note why candle closes matter more than wicks.',
    afterWatchTakeaways: [
      'Confirm a Break of Structure with a decisive candle-body close past the prior structural swing.',
      'Track the swing point that originated the BOS to keep your directional bias objective.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000102',
    resourceId: '40000000-0000-4000-8000-000000000102',
    lessonId: '20000000-0000-4000-8000-000000000001',
    lessonSlug: 'market-structure',
    displayOrder: 2,
    relevanceScore: 95,
    qualityScore: 92,
    videoId: 'Zzk864cVJek',
    title: 'Path to Profitability: Break of Structure Explained',
    author: 'TJR',
    description:
      'Structured explanation of how Higher Highs, Higher Lows, Lower Highs, and Lower Lows connect into repeatable Break of Structure reads on live price action.',
    beforeWatchContext:
      'Watch how each expansion leg builds on the previous trend leg so you can tell a normal retracement apart from an actual structure shift.',
    afterWatchTakeaways: [
      'Map major impulsive swings rather than labeling every tiny internal candle pullback.',
      'Stay aligned with active HH/HL or LH/LL flow until a protected swing actually breaks.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000103',
    resourceId: '40000000-0000-4000-8000-000000000103',
    lessonId: '20000000-0000-4000-8000-000000000001',
    lessonSlug: 'market-structure',
    displayOrder: 3,
    relevanceScore: 92,
    qualityScore: 90,
    videoId: 'fWg9tsNVA90',
    title:
      'BOS and CHoCH Explained: How to Read Market Structure (Beginner Guide)',
    author: 'Lux IQ Trading',
    description:
      'Beginner-friendly breakdown comparing trend continuation Breaks of Structure (BOS) against Change of Character (CHoCH) structural shifts.',
    beforeWatchContext:
      'Compare how a continuation BOS differs from a reversal CHoCH so you know exactly when an uptrend or downtrend is invalidated.',
    afterWatchTakeaways: [
      'BOS confirms continuation in the existing trend direction; CHoCH flags the first structural shift.',
      'Anchor invalidation strictly at the protected swing low or high that drove the latest BOS.',
    ],
  },

  // =========================================================================
  // LESSON 2: Understanding Market Liquidity (market-liquidity)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000104',
    resourceId: '40000000-0000-4000-8000-000000000104',
    lessonId: '20000000-0000-4000-8000-000000000002',
    lessonSlug: 'market-liquidity',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'crMqxB_nHhk',
    title: 'Path to Profitability: Liquidity Explained',
    author: 'TJR',
    description:
      'Core lesson explaining where Buy-Side Liquidity (BSL) and Sell-Side Liquidity (SSL) accumulate and why institutional order flow gravitates toward resting stops.',
    beforeWatchContext:
      'Focus on why obvious highs and lows hold stacked stop-loss and breakout orders that act as fuel for larger directional moves.',
    afterWatchTakeaways: [
      'Buy-Side Liquidity sits above obvious highs (short stops and breakout buys); Sell-Side Liquidity sits below lows.',
      'Identify both the liquidity already cleared and the opposing untouched pool before planning a trade.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000105',
    resourceId: '40000000-0000-4000-8000-000000000105',
    lessonId: '20000000-0000-4000-8000-000000000002',
    lessonSlug: 'market-liquidity',
    displayOrder: 2,
    relevanceScore: 95,
    qualityScore: 92,
    videoId: 'Lxnu7InGhGE',
    title: 'Boot Camp Day 8: Liquidity Pt 1',
    author: 'TJR',
    description:
      'Foundational bootcamp session introducing external vs. internal liquidity pools and how price rotates from one stop cluster to the opposing pool.',
    beforeWatchContext:
      'Notice how marking session highs, session lows, and swing extremes simplifies reading where price is likely drawn next.',
    afterWatchTakeaways: [
      'Price routinely delivers from one resting liquidity pool across the range to the opposing pool.',
      'Avoid placing tight stops directly behind obvious retail highs and lows where liquidity clusters.',
    ],
  },

  // =========================================================================
  // LESSON 3: Equal Highs & Equal Lows (equal-highs-lows)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000106',
    resourceId: '40000000-0000-4000-8000-000000000106',
    lessonId: '20000000-0000-4000-8000-000000000003',
    lessonSlug: 'equal-highs-lows',
    displayOrder: 1,
    relevanceScore: 97,
    qualityScore: 90,
    videoId: 'w6gqySsh1I4',
    title:
      'Equal Highs & Lows Explained | EQH, EQL & Liquidity Pools in SMC Trading',
    author: 'Aseem Singhal',
    description:
      'Chart-focused guide detailing why Equal Highs (EQH) and Equal Lows (EQL) concentrate retail stop-losses and function as high-probability liquidity magnets.',
    beforeWatchContext:
      'Compare the textbook double-top/double-bottom view with the liquidity-pool perspective as you watch price approach flat boundaries.',
    afterWatchTakeaways: [
      'Relative Equal Highs and Equal Lows attract price because multiple touches stack stops tightly outside the level.',
      'Use untouched EQH/EQL either as a logical profit target or as a patient watchlist zone for post-sweep setups.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000107',
    resourceId: '40000000-0000-4000-8000-000000000107',
    lessonId: '20000000-0000-4000-8000-000000000003',
    lessonSlug: 'equal-highs-lows',
    displayOrder: 2,
    relevanceScore: 94,
    qualityScore: 90,
    videoId: '-7-e05cz83E',
    title: 'Liquidity Explained: Equal Highs, Session Highs & Inducement (ICT)',
    author: 'The Trading Foundry',
    description:
      'Breakdown connecting Equal Highs, session highs/lows, and inducement pools so learners see how resting liquidity builds ahead of sharp institutional moves.',
    beforeWatchContext:
      'Observe how closely aligned highs and session levels act together as inducement before real directional expansion begins.',
    afterWatchTakeaways: [
      'Equal highs do not need exact-pip alignment; tight visual clusters still concentrate stop orders.',
      'Wait for resting EQH or EQL pools to be cleared rather than entering right ahead of an obvious magnet.',
    ],
  },

  // =========================================================================
  // LESSON 4: Liquidity Sweeps vs. True Breakouts (liquidity-sweeps)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000108',
    resourceId: '40000000-0000-4000-8000-000000000108',
    lessonId: '20000000-0000-4000-8000-000000000004',
    lessonSlug: 'liquidity-sweeps',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'rdz6vnXb8wE',
    title: 'Boot Camp Day 10: Liquidity Pt. 2',
    author: 'TJR',
    description:
      'Applied continuation of TJR’s liquidity bootcamp showing how liquidity sweeps trigger stop runs and transition into displacement and structure shifts.',
    beforeWatchContext:
      'Watch the exact sequence after price pierces a key high or low: candle close back inside the range followed by strong opposite displacement.',
    afterWatchTakeaways: [
      'A high-probability sweep pairs a wick beyond liquidity with a close back inside and immediate displacement.',
      'Wait for internal structure to shift after the raid instead of guessing mid-candle.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000109',
    resourceId: '40000000-0000-4000-8000-000000000109',
    lessonId: '20000000-0000-4000-8000-000000000004',
    lessonSlug: 'liquidity-sweeps',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 90,
    videoId: 'WGF_-CVETis',
    title: 'Liquidity Sweep vs Breakout | How to Spot the Trap? #SMC #ICT',
    author: 'Mahira Capital™',
    description:
      'Direct side-by-side comparison showing how to separate a stop-hunting liquidity sweep from genuine breakout acceptance and follow-through.',
    beforeWatchContext:
      'Use this video alongside our EUR/USD vs. BTC/USD chart comparison to lock in candle-close location and retest behavior.',
    afterWatchTakeaways: [
      'True breakouts close full-bodied outside the level and hold on retest rather than snapping back inside.',
      'Avoid blindly fading strong breakout acceptance; let candle closes and follow-through reveal who won.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000110',
    resourceId: '40000000-0000-4000-8000-000000000110',
    lessonId: '20000000-0000-4000-8000-000000000004',
    lessonSlug: 'liquidity-sweeps',
    displayOrder: 3,
    relevanceScore: 93,
    qualityScore: 92,
    videoId: 'AGmAVyAuBE0',
    title: 'Advanced Liquidity Concepts (Path to Profitability)',
    author: 'TJR',
    description:
      'Deeper look at multi-timeframe liquidity sweeps, stop-run traps, and pairing external raids with disciplined confirmation before execution.',
    beforeWatchContext:
      'Pay attention to how higher-timeframe liquidity context filters out weak sweeps and strengthens trade selection.',
    afterWatchTakeaways: [
      'Higher-timeframe liquidity sweeps carry more institutional weight than isolated low-timeframe wicks.',
      'Place structural invalidation beyond the sweep extreme so normal retest noise does not shake you out.',
    ],
  },

  // =========================================================================
  // LESSON 5: Fair Value Gaps (fair-value-gaps)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000111',
    resourceId: '40000000-0000-4000-8000-000000000111',
    lessonId: '20000000-0000-4000-8000-000000000005',
    lessonSlug: 'fair-value-gaps',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'xX5LTSJ5wwM',
    title: 'Path to Profitability: Fair Value Gaps Explained',
    author: 'TJR',
    description:
      'Step-by-step explanation of 3-candle Fair Value Gaps (FVG), exact Candle 1 to Candle 3 wick boundaries, and how price retraces to mitigate imbalances.',
    beforeWatchContext:
      'Track the exact non-overlapping space between Candle 1 and Candle 3 wicks and notice how displacement gives an FVG real backing.',
    afterWatchTakeaways: [
      'A valid Bullish FVG spans Candle 1 High to Candle 3 Low (and vice versa for Bearish FVG) with zero wick overlap.',
      'Prioritize FVGs created immediately after a liquidity sweep and confirmed Break of Structure.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000112',
    resourceId: '40000000-0000-4000-8000-000000000112',
    lessonId: '20000000-0000-4000-8000-000000000005',
    lessonSlug: 'fair-value-gaps',
    displayOrder: 2,
    relevanceScore: 95,
    qualityScore: 92,
    videoId: 'xcDOMKaOIsk',
    title: 'Fair Value Gaps Explained',
    author: 'TJR',
    description:
      'Concise visual review of institutional price imbalances, filtering out low-probability chop gaps, and reading FVG mitigation cleanly.',
    beforeWatchContext:
      'Watch how context separates A+ Fair Value Gaps aligned with order flow from random intraday gaps that fail.',
    afterWatchTakeaways: [
      'Wait for price to retrace into the FVG rather than chasing extended displacement candles.',
      'Treat a full candle-body close completely through the far edge of an FVG as structural invalidation.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000113',
    resourceId: '40000000-0000-4000-8000-000000000113',
    lessonId: '20000000-0000-4000-8000-000000000005',
    lessonSlug: 'fair-value-gaps',
    displayOrder: 3,
    relevanceScore: 92,
    qualityScore: 90,
    videoId: '8nfpgmlGOFE',
    title: 'Fair Value Gap (FVG) Strategy: Step-by-Step Guide (7 Mins)',
    author: 'AKTV',
    description:
      'Compact 7-minute walkthrough combining Fair Value Gap identification, 50% equilibrium mitigation checks, and structured risk placement.',
    beforeWatchContext:
      'Note how the 50% midpoint of an FVG helps refine entries and tighten risk-to-reward without forcing trades.',
    afterWatchTakeaways: [
      'Mark the top edge, 50% midpoint, and bottom edge of every valid FVG before price returns.',
      'Combine FVG retracements with directional structure alignment instead of trading isolated gaps.',
    ],
  },

  // =========================================================================
  // LESSON 6: Risk Management, Position Sizing & Psychology (risk-psychology)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000114',
    resourceId: '40000000-0000-4000-8000-000000000114',
    lessonId: '20000000-0000-4000-8000-000000000006',
    lessonSlug: 'risk-psychology',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'RkMBoqbeUq8',
    title: 'Boot Camp Day 13: Risk Management',
    author: 'TJR',
    description:
      'Essential bootcamp lesson on fixed-percentage risk per trade, R-multiple expectancy, and keeping losing streaks survivable emotionally and financially.',
    beforeWatchContext:
      'Focus on why capping every trade at a consistent 0.5%–1% risk protects both your account equity and your decision-making calm.',
    afterWatchTakeaways: [
      'Risk a fixed small percentage per setup so routine losing streaks never threaten your account.',
      'Evaluate performance across batches of trades using R-multiples rather than obsessing over one outcome.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000115',
    resourceId: '40000000-0000-4000-8000-000000000115',
    lessonId: '20000000-0000-4000-8000-000000000006',
    lessonSlug: 'risk-psychology',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 92,
    videoId: '1FunNCUw_jM',
    title: 'Boot Camp Day 38: Stop Losses',
    author: 'TJR',
    description:
      'Practical guide to placing stop-losses at true structural invalidation points instead of arbitrary pip distances or emotional mid-trade adjustments.',
    beforeWatchContext:
      'Notice how structural stop placement gives trades breathing room while defining your exact 1R invalidation before entry.',
    afterWatchTakeaways: [
      'Place stop-losses beyond the structural level that objectively disproves your trade thesis.',
      'Never widen a stop-loss once price approaches invalidation; accept -1R cleanly and preserve expectancy.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000116',
    resourceId: '40000000-0000-4000-8000-000000000116',
    lessonId: '20000000-0000-4000-8000-000000000006',
    lessonSlug: 'risk-psychology',
    displayOrder: 3,
    relevanceScore: 95,
    qualityScore: 92,
    videoId: 'KSiWKfPOlh4',
    title: 'Boot Camp Day 39: Calculating Lot Size',
    author: 'TJR',
    description:
      'Hands-on tutorial showing how to compute exact lot size from account balance, risk percentage, and stop-loss distance on every trade.',
    beforeWatchContext:
      'Follow the exact formula step by step so your dollar risk stays identical whether a setup requires a 10-pip or 30-pip stop.',
    afterWatchTakeaways: [
      'Derive lot size strictly from (Account Balance × Risk %) ÷ Stop-Loss Distance Value.',
      'Wider structural stops automatically mean smaller lot sizes—never force a fixed lot size across setups.',
    ],
  },

  // =========================================================================
  // MODULE 1: Candlestick Anatomy & Reading Price Action (candlestick-anatomy)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000117',
    resourceId: '40000000-0000-4000-8000-000000000117',
    lessonId: '20000000-0000-4000-8000-000000000007',
    lessonSlug: 'candlestick-anatomy',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'z1STKCnivbM',
    title: 'The ONLY Candlestick Video You’ll EVER Need (Step By Step Guide)',
    author: 'TJR',
    description:
      'Step-by-step walkthrough breaking down candlestick OHLC mechanics, body-to-wick ratios, rejection signals, and reading buyer vs. seller control without memorizing clutter.',
    beforeWatchContext:
      'Focus on how candle bodies and wicks tell the story of order-flow control rather than memorizing isolated candlestick names.',
    afterWatchTakeaways: [
      'Read body expansion for directional conviction and long wicks for liquidity rejection at key levels.',
      'Always wait for the candle to close before confirming direction on any timeframe.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000118',
    resourceId: '40000000-0000-4000-8000-000000000118',
    lessonId: '20000000-0000-4000-8000-000000000007',
    lessonSlug: 'candlestick-anatomy',
    displayOrder: 2,
    relevanceScore: 95,
    qualityScore: 92,
    videoId: 'bEkbNGUzQME',
    title: 'Boot Camp Day 2: Candlesticks',
    author: 'TJR',
    description:
      'Foundational bootcamp lesson explaining open, high, low, close structure and how multi-candle sequences frame real price action momentum.',
    beforeWatchContext:
      'Observe how individual candles link together into impulse legs and pullbacks so you read price action smoothly.',
    afterWatchTakeaways: [
      'Interpret candle behavior in the context of surrounding structure instead of treating single bars in isolation.',
      'Compare closing position relative to the full high-low range to spot momentum shifts early.',
    ],
  },

  // =========================================================================
  // MODULE 3: Support, Resistance & Institutional Supply/Demand Zones
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000119',
    resourceId: '40000000-0000-4000-8000-000000000119',
    lessonId: '20000000-0000-4000-8000-000000000008',
    lessonSlug: 'support-resistance-supply-demand',
    displayOrder: 1,
    relevanceScore: 97,
    qualityScore: 91,
    videoId: 'FjB8SRc0mi8',
    title:
      'Order Blocks vs Supply & Demand vs Support & Resistance — The Real Difference Explained!',
    author: 'Pro Trading School',
    description:
      'Clear side-by-side comparison clarifying how classic horizontal Support & Resistance, institutional Supply & Demand bases, and Order Blocks relate on live charts.',
    beforeWatchContext:
      'Pay attention to how departure strength and freshness separate high-probability Supply/Demand zones from worn-out S/R lines.',
    afterWatchTakeaways: [
      'Prioritize fresh Supply/Demand origins that launched forceful displacement and broke structure.',
      'Recognize when repeatedly tested horizontal lines are weakening into liquidity targets.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000120',
    resourceId: '40000000-0000-4000-8000-000000000120',
    lessonId: '20000000-0000-4000-8000-000000000008',
    lessonSlug: 'support-resistance-supply-demand',
    displayOrder: 2,
    relevanceScore: 94,
    qualityScore: 89,
    videoId: 'dZaUaUsalNI',
    title: 'Support & Resistance Zones Explained | Premium Trading Course Lesson',
    author: 'BEYOND THE COSMOS',
    description:
      'Practical lesson demonstrating why Support and Resistance work as shaded price zones rather than single-pip lines, including polarity role reversals.',
    beforeWatchContext:
      'Watch how marking clean, prominent zones keeps charts uncluttered and highlights polarity flips after clean breaks.',
    afterWatchTakeaways: [
      'Draw S/R as price areas framing swing turning points rather than fragile 1-tick lines.',
      'Respect polarity flips when broken resistance holds from above as new support.',
    ],
  },

  // =========================================================================
  // MODULE 8: Order Blocks, CHoCH & Institutional Displacement
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000121',
    resourceId: '40000000-0000-4000-8000-000000000121',
    lessonId: '20000000-0000-4000-8000-000000000009',
    lessonSlug: 'order-blocks-bos-choch',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'qhuFg_OXdmE',
    title: 'Boot Camp Day 20: Order Blocks',
    author: 'TJR',
    description:
      'Core institutional lesson introducing Bullish and Bearish Order Blocks, the role of liquidity sweeps prior to displacement, and validating real structural origins.',
    beforeWatchContext:
      'Look closely at the exact criteria that turn an ordinary opposing candle into a valid institutional Order Block.',
    afterWatchTakeaways: [
      'Require a liquidity sweep, displacement imbalance (FVG), and structural break to validate an Order Block.',
      'Ignore slow, unvalidated candles in choppy mid-range that fail to break structure.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000122',
    resourceId: '40000000-0000-4000-8000-000000000122',
    lessonId: '20000000-0000-4000-8000-000000000009',
    lessonSlug: 'order-blocks-bos-choch',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 92,
    videoId: 'RQSVIKddFHI',
    title: 'Boot Camp Day 22: Order Blocks pt.2',
    author: 'TJR',
    description:
      'Follow-up session detailing Order Block refinement, mitigation rules, breaker invalidation, and combining Order Blocks with Change of Character (CHoCH).',
    beforeWatchContext:
      'Notice how pairing an unmitigated Order Block with an adjacent Fair Value Gap tightens invalidation and entry timing.',
    afterWatchTakeaways: [
      'Track both the Order Block open and 50% mean threshold while anchoring stops beyond the OB extreme.',
      'Treat a full-body close cleanly through an Order Block as invalidation rather than hoping for a bounce.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000123',
    resourceId: '40000000-0000-4000-8000-000000000123',
    lessonId: '20000000-0000-4000-8000-000000000009',
    lessonSlug: 'order-blocks-bos-choch',
    displayOrder: 3,
    relevanceScore: 93,
    qualityScore: 90,
    videoId: 'rbdkcDDmneQ',
    title: 'Order Block Trading Strategy: The Complete 5-Step Guide #trading #SMC #ICT',
    author: 'Com Lucro Trader',
    description:
      'Structured 5-step Order Block walkthrough connecting CHoCH confirmation, inducement avoidance, and clean mitigation entries.',
    beforeWatchContext:
      'Watch how identifying inducement liquidity ahead of an extreme Order Block keeps you from getting swept early.',
    afterWatchTakeaways: [
      'Favor unmitigated extreme Order Blocks over shallow mid-leg inducement blocks sitting above resting stops.',
      'Confirm CHoCH with a candle-body close after a liquidity raid before executing.',
    ],
  },

  // =========================================================================
  // MODULE 9: Multi-Timeframe Analysis (multi-timeframe-alignment)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000124',
    resourceId: '40000000-0000-4000-8000-000000000124',
    lessonId: '20000000-0000-4000-8000-000000000010',
    lessonSlug: 'multi-timeframe-alignment',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: '60H1AumgjG8',
    title: 'Trading Transformation Day 36: How to Trade on Multiple Timeframes',
    author: 'TJR',
    description:
      'Practical top-down walkthrough showing how to map Higher-Timeframe bias and liquidity draws before dropping to Lower Timeframes for precise execution.',
    beforeWatchContext:
      'Pay attention to how each timeframe in a 3-chart stack has one distinct job: Bias, Point of Interest, and Trigger.',
    afterWatchTakeaways: [
      'Always map Higher-Timeframe directional bias and external targets before opening a 5m or 1m chart.',
      'Wait for price to enter an HTF Point of Interest before hunting for lower-timeframe CHoCH entries.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000125',
    resourceId: '40000000-0000-4000-8000-000000000125',
    lessonId: '20000000-0000-4000-8000-000000000010',
    lessonSlug: 'multi-timeframe-alignment',
    displayOrder: 2,
    relevanceScore: 95,
    qualityScore: 90,
    videoId: 'JthLtxOPd-Y',
    title: 'The Multi-Time Frame Analysis Mistake That Ruins Perfect Scalping Setups',
    author: 'Com Lucro Trader',
    description:
      'Focused diagnostic highlighting how fighting Higher-Timeframe zones and fractal pullbacks sabotages otherwise clean low-timeframe scalps.',
    beforeWatchContext:
      'Notice how a clean 5-minute downtrend can simply be a 4H bullish pullback straight into strong HTF demand.',
    afterWatchTakeaways: [
      'Never short an LTF downtrend directly into an untouched HTF demand floor without checking alignment.',
      'Let Higher-Timeframe structure override conflicting Lower-Timeframe micro-signals.',
    ],
  },

  // =========================================================================
  // MODULE 10: Forex Playbook: London & NY Killzones (forex-sessions-killzones)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000126',
    resourceId: '40000000-0000-4000-8000-000000000126',
    lessonId: '20000000-0000-4000-8000-000000000011',
    lessonSlug: 'forex-sessions-killzones',
    displayOrder: 1,
    relevanceScore: 97,
    qualityScore: 91,
    videoId: 'mTIvQaRDdZA',
    title: 'Trading Kill Zones Simplified (London ,New York, Tokyo)',
    author: 'Mind Math Money',
    description:
      'Clear session-timing guide showing how Tokyo/Asian consolidation sets up London and New York Killzone liquidity sweeps and directional trends.',
    beforeWatchContext:
      'Track the exact EST session windows and notice how Asian High and Asian Low become primary targets for London and NY.',
    afterWatchTakeaways: [
      'Concentrate Forex execution inside London or New York Killzones when institutional volume and spreads are optimal.',
      'Box Asian Range highs and lows daily to anticipate Power of 3 manipulation sweeps.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000127',
    resourceId: '40000000-0000-4000-8000-000000000127',
    lessonId: '20000000-0000-4000-8000-000000000011',
    lessonSlug: 'forex-sessions-killzones',
    displayOrder: 2,
    relevanceScore: 94,
    qualityScore: 89,
    videoId: 'DiQsBv-ItVE',
    title:
      'ICT Sessions & Kill Zones Explained | Asian, London & New York Copy Title',
    author: 'Syed Izhar Ali Shah',
    description:
      'Step-by-step review of Asian, London, and New York session liquidity mechanics and avoiding off-session Forex chop.',
    beforeWatchContext:
      'Compare directional expansion during London/NY opens against sluggish off-session price action.',
    afterWatchTakeaways: [
      'Filter out dead late-day sessions to cut unnecessary whipsaw losses immediately.',
      'Pair Killzone sweeps with DXY alignment and high-impact news discipline.',
    ],
  },

  // =========================================================================
  // MODULE 11: Indices Playbook: NAS100 & US30 NY Open (indices-ny-open-playbook)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000128',
    resourceId: '40000000-0000-4000-8000-000000000128',
    lessonId: '20000000-0000-4000-8000-000000000012',
    lessonSlug: 'indices-ny-open-playbook',
    displayOrder: 1,
    relevanceScore: 96,
    qualityScore: 90,
    videoId: 'wYrtRSdAEro',
    title: 'NASDAQ & US30 Trading Strategy: Live Webinar',
    author: 'Precision Synthetic Trades',
    description:
      'Practical breakdown of NAS100 and US30 NY Open dynamics covering pre-market highs/lows, opening stop runs, and managing high-speed index volatility.',
    beforeWatchContext:
      'Observe how patience through the chaotic 09:30 EST opening minutes reveals clean directional structure on NAS100 and US30.',
    afterWatchTakeaways: [
      'Wait for the 09:30 EST opening dust to settle and confirm 5m candle closes around Pre-Market High/Low.',
      'Reduce contract/lot size to match wider NAS100/US30 point swings so 1R risk stays constant.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000129',
    resourceId: '40000000-0000-4000-8000-000000000129',
    lessonId: '20000000-0000-4000-8000-000000000012',
    lessonSlug: 'indices-ny-open-playbook',
    displayOrder: 2,
    relevanceScore: 95,
    qualityScore: 92,
    videoId: 'Y1lqifylC4s',
    title: 'Boot Camp Day 36: Daily Bias pt. 3',
    author: 'TJR',
    description:
      'Applied daily-bias session demonstrating how to frame pre-market draw on liquidity and align NY Open index execution with higher-timeframe order flow.',
    beforeWatchContext:
      'Focus on how establishing daily bias before 09:30 EST stops you from chasing both sides of the opening spike.',
    afterWatchTakeaways: [
      'Anchor NY Open index trades to Previous Day High/Low and Pre-Market liquidity pools.',
      'Use correlated SMT divergence across NAS100, SPX500, and US30 to confirm institutional reversals.',
    ],
  },

  // =========================================================================
  // MODULE 12: Crypto Playbook (crypto-247-liquidity-playbook)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000130',
    resourceId: '40000000-0000-4000-8000-000000000130',
    lessonId: '20000000-0000-4000-8000-000000000013',
    lessonSlug: 'crypto-247-liquidity-playbook',
    displayOrder: 1,
    relevanceScore: 97,
    qualityScore: 92,
    videoId: 'ruNDNo8ceLE',
    title: 'Bitcoin Dominance: Why Crypto Money Flows into Bitcoin FIRST',
    author: 'Binance',
    description:
      'Official educational breakdown explaining why institutional and retail crypto liquidity rotates into Bitcoin first and how BTC Dominance guides market selection.',
    beforeWatchContext:
      'Note the exact relationship between BTC price trend and BTC.D when deciding whether to focus on Bitcoin or altcoins.',
    afterWatchTakeaways: [
      'Check Bitcoin structure and BTC Dominance first before taking any altcoin setup.',
      'Avoid forcing altcoin longs when capital is concentrating strictly into BTC or exiting risk.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000131',
    resourceId: '40000000-0000-4000-8000-000000000131',
    lessonId: '20000000-0000-4000-8000-000000000013',
    lessonSlug: 'crypto-247-liquidity-playbook',
    displayOrder: 2,
    relevanceScore: 95,
    qualityScore: 91,
    videoId: 'kpShnKWJNg8',
    title: 'Bitcoin Dominance Explained (And How It Affects Other Coins)',
    author: 'Coingecko',
    description:
      'Concise visual explainer covering how shifts in Bitcoin Dominance signal altcoin rotation phases versus risk-off Bitcoin flight.',
    beforeWatchContext:
      'Watch how consolidating BTC paired with falling BTC.D creates healthier conditions for altcoin breakouts.',
    afterWatchTakeaways: [
      'Altcoin breakouts hold cleanest when BTC is stable or trending higher while BTC.D drifts lower.',
      'Respect 24/7 weekend thin liquidity and wait for Monday confirmation on major range breaks.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000132',
    resourceId: '40000000-0000-4000-8000-000000000132',
    lessonId: '20000000-0000-4000-8000-000000000013',
    lessonSlug: 'crypto-247-liquidity-playbook',
    displayOrder: 3,
    relevanceScore: 96,
    qualityScore: 92,
    videoId: 'G3-HjS0ZD6o',
    title: 'What is FUNDING RATE in Crypto? Explained in 3 minutes',
    author: 'Coingecko',
    description:
      'Crisp 3-minute primer on perpetual futures funding rates, who pays whom when markets overheat, and how extreme funding foreshadows liquidation squeezes.',
    beforeWatchContext:
      'Focus on why deeply positive funding near resistance warns of overcrowded longs ripe for a liquidation flush.',
    afterWatchTakeaways: [
      'Extreme positive or negative funding signals overcrowded leverage vulnerable to fast squeeze wicks.',
      'Size every crypto trade strictly to a real structural stop-loss—never your exchange liquidation price.',
    ],
  },

  // =========================================================================
  // MODULE 13: Stocks Playbook (stocks-gaps-rvol-playbook)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000133',
    resourceId: '40000000-0000-4000-8000-000000000133',
    lessonId: '20000000-0000-4000-8000-000000000014',
    lessonSlug: 'stocks-gaps-rvol-playbook',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'tJHMj_z_txs',
    title: 'Simplest Trading Strategy: 2-Minute Opening Range Breakout (Just Copy This)',
    author: 'Bear Bull Traders',
    description:
      'Step-by-step equities playbook demonstrating how to execute Opening Range Breakouts (ORB) on high-volume Stocks in Play aligned with VWAP.',
    beforeWatchContext:
      'Watch how the opening candle range, volume expansion, and VWAP work together to confirm genuine institutional buying.',
    afterWatchTakeaways: [
      'Focus Opening Range Breakouts strictly on liquid Stocks in Play backed by RVOL ≥ 2.0 and fresh catalysts.',
      'Require stocks to hold above VWAP for long ORBs and size exact share count from Dollar Risk ÷ Stop Distance.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000134',
    resourceId: '40000000-0000-4000-8000-000000000134',
    lessonId: '20000000-0000-4000-8000-000000000014',
    lessonSlug: 'stocks-gaps-rvol-playbook',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 91,
    videoId: 'K5QedHcMEQ8',
    title: 'How I Trade Gaps - The Range Breakout Setup',
    author: 'Richard Moglen',
    description:
      'Detailed walkthrough on trading earnings and catalyst gaps using Opening Range levels, volume validation, and structured risk management.',
    beforeWatchContext:
      'Pay attention to how clean range highs separate lasting Gap-and-Go trends from fading opening traps.',
    afterWatchTakeaways: [
      'Wait for opening range validation instead of blindly buying the very first second of a pre-market gap.',
      'Respect failed gaps immediately if price loses VWAP and breaks the Opening Range Low on heavy volume.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000135',
    resourceId: '40000000-0000-4000-8000-000000000135',
    lessonId: '20000000-0000-4000-8000-000000000014',
    lessonSlug: 'stocks-gaps-rvol-playbook',
    displayOrder: 3,
    relevanceScore: 94,
    qualityScore: 90,
    videoId: '9xapY-2w4RY',
    title: 'How to Build a Pre-Market Trading Plan: Day Trading Strategy for Beginners!',
    author: 'TraderTV Live',
    description:
      'Practical morning prep routine showing how equity traders filter pre-market gappers, mark key PMH/PML levels, and plan scenarios before 09:30 EST.',
    beforeWatchContext:
      'Follow the exact pre-market checklist so you arrive at the 09:30 bell with 2–3 focused tickers instead of chasing scanners.',
    afterWatchTakeaways: [
      'Mark Pre-Market High, Pre-Market Low, and Yesterday’s Close on your top 2–3 high-RVOL stocks before the bell.',
      'Check SPY/QQQ market tide alignment so you trade stocks showing clear Relative Strength.',
    ],
  },

  // =========================================================================
  // MODULE 14: Building an A+ Setup Checklist (confluence-a-plus-setups)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000136',
    resourceId: '40000000-0000-4000-8000-000000000136',
    lessonId: '20000000-0000-4000-8000-000000000015',
    lessonSlug: 'confluence-a-plus-setups',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'ESsy0uoFAz4',
    title: 'Boot Camp Day 30: Execution',
    author: 'TJR',
    description:
      'Comprehensive execution walkthrough tying together HTF bias, liquidity sweeps, displacement shifts, and mechanical entry triggers into one repeatable model.',
    beforeWatchContext:
      'Watch how stacking confluence criteria turns multiple individual concepts into a single decisive A+ execution checklist.',
    afterWatchTakeaways: [
      'Score every trade against a fixed 5-point checklist and refuse to take C-grade boredom trades.',
      'Commit to one written execution model across 50–100 repetitions instead of strategy hopping.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000137',
    resourceId: '40000000-0000-4000-8000-000000000137',
    lessonId: '20000000-0000-4000-8000-000000000015',
    lessonSlug: 'confluence-a-plus-setups',
    displayOrder: 2,
    relevanceScore: 95,
    qualityScore: 92,
    videoId: 'PlsHO33j6B8',
    title: 'Path to Profitability: Advanced Imbalance Concepts',
    author: 'TJR',
    description:
      'Advanced confluence lesson demonstrating how high-probability imbalances align with liquidity sweeps and structure to filter out mediocre setups.',
    beforeWatchContext:
      'Notice how eliminating low-confluence imbalances protects mental capital and raises overall R-multiple consistency.',
    afterWatchTakeaways: [
      'Stack narrative, session timing, liquidity sweep, displacement imbalance, and ≥ 1:2.5 R:R before clicking enter.',
      'Treat "No Trade" as a winning position whenever your checklist boxes are incomplete.',
    ],
  },

  // =========================================================================
  // MODULE 15: Trade Management (trade-management-partials-be)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000138',
    resourceId: '40000000-0000-4000-8000-000000000138',
    lessonId: '20000000-0000-4000-8000-000000000016',
    lessonSlug: 'trade-management-partials-be',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'FjSiLFrg5fo',
    title: 'Boot Camp Day 37: Taking Profits',
    author: 'TJR',
    description:
      'Targeted lesson on setting logical take-profit targets at opposing liquidity pools, avoiding fearful early exits, and letting structured winners finish.',
    beforeWatchContext:
      'Focus on why opposing liquidity pools—not arbitrary dollar amounts—should govern where you bank profits.',
    afterWatchTakeaways: [
      'Define partial and final targets at logical liquidity pools before entering the position.',
      'Avoid choking trades with premature breakeven stops before price breaks structure in your favor.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000139',
    resourceId: '40000000-0000-4000-8000-000000000139',
    lessonId: '20000000-0000-4000-8000-000000000016',
    lessonSlug: 'trade-management-partials-be',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 92,
    videoId: '5v4G4xJVKIQ',
    title: 'Boot Camp 2.0 Day 8: How to split positions',
    author: 'TJR',
    description:
      'Practical guide on splitting positions for systematic partial profit-taking, securing realized R at intermediate milestones, and trailing runners cleanly.',
    beforeWatchContext:
      'Track how splitting a position cleanly at +2R balances emotional relief with capturing full +3R to +4R runners.',
    afterWatchTakeaways: [
      'Calculate blended R-multiple across partial and runner slices so scaling enhances—never guts—expectancy.',
      'Trail remaining runners behind newly confirmed protected swings rather than live candle noise.',
    ],
  },

  // =========================================================================
  // MODULE 17: Trading Journal & Expectancy (trading-journal-expectancy)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000140',
    resourceId: '40000000-0000-4000-8000-000000000140',
    lessonId: '20000000-0000-4000-8000-000000000017',
    lessonSlug: 'trading-journal-expectancy',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'nhAvP7LJUoQ',
    title: 'Why a High Win Rate Can Still Lose You Money (Expectancy Explained)',
    author: 'The Trading Foundry',
    description:
      'Eye-opening mathematical breakdown proving why win rate alone misleads traders and how Expectancy and Profit Factor determine true long-term edge.',
    beforeWatchContext:
      'Follow the exact Expectancy formula examples and compare high-win-rate negative-R traps against disciplined asymmetric models.',
    afterWatchTakeaways: [
      'Always evaluate Expectancy = (Win Rate × Avg Win R) − (Loss Rate × Avg Loss R) across 30+ trades.',
      'Protecting -1R maximum loss keeps positive expectancy intact even at a 40%–45% win rate.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000141',
    resourceId: '40000000-0000-4000-8000-000000000141',
    lessonId: '20000000-0000-4000-8000-000000000017',
    lessonSlug: 'trading-journal-expectancy',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 91,
    videoId: 'sgO2pCYEY68',
    title: 'How To JOURNAL TRADES Professionally',
    author: 'Jason Graystone',
    description:
      'Actionable guide to building a lean, repeatable trading journal that tracks rule adherence, screenshots, setup grades, and weekly data reviews.',
    beforeWatchContext:
      'Focus on the small set of high-signal fields worth logging every session so journaling becomes an effortless habit.',
    afterWatchTakeaways: [
      'Log Setup Grade, Planned vs. Actual R, screenshots, emotional state, and Rule Adherence on every trade.',
      'Run a weekly audit to identify and delete your single most expensive recurring behavioral leak.',
    ],
  },

  // =========================================================================
  // MODULE 18: Handling Drawdowns & Scaling (drawdown-scaling-consistency)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000142',
    resourceId: '40000000-0000-4000-8000-000000000142',
    lessonId: '20000000-0000-4000-8000-000000000018',
    lessonSlug: 'drawdown-scaling-consistency',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 93,
    videoId: 'o7DfwJTC_Ow',
    title: 'How to Handle Trading Drawdowns (Step-by-step process)',
    author: 'TheOneLanceB',
    description:
      'Professional prop-desk framework for navigating inevitable losing streaks using risk throttling, objective process audits, and anti-tilt circuit breakers.',
    beforeWatchContext:
      'Notice how cutting risk in half during drawdowns protects both capital and confidence so you recover cleanly.',
    afterWatchTakeaways: [
      'Pre-commit to daily/weekly loss caps and automatic half-risk throttling when drawdown hits -4% to -5%.',
      'Audit whether losses came from normal variance or Tilt before resuming full risk or scaling capital.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000143',
    resourceId: '40000000-0000-4000-8000-000000000143',
    lessonId: '20000000-0000-4000-8000-000000000018',
    lessonSlug: 'drawdown-scaling-consistency',
    displayOrder: 2,
    relevanceScore: 94,
    qualityScore: 90,
    videoId: 'xs792liucck',
    title: 'What to Track in Your Trading Journal (And What to Ignore)',
    author: 'Japanese Ichimoku Trader Kei',
    description:
      'Focused discipline session distinguishing actionable consistency metrics from vanity stats so traders stay composed through drawdowns and scale steadily.',
    beforeWatchContext:
      'Pay attention to which psychological and execution metrics tell you when you are genuinely ready to scale up size.',
    afterWatchTakeaways: [
      'Track Rule-Adherence Percentage and R-multiples rather than obsessing over short-term dollar P&L swings.',
      'Scale risk gradually in modest increments only after new equity highs backed by 30–50 disciplined trades.',
    ],
  },

  // =========================================================================
  // MODULE 01: Chart Reading Fundamentals (chart-reading-fundamentals)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000901',
    resourceId: '40000000-0000-4000-8000-000000000901',
    lessonId: '20000000-0000-4000-8000-000000000019',
    lessonSlug: 'chart-reading-fundamentals',
    displayOrder: 1,
    relevanceScore: 99,
    qualityScore: 93,
    videoId: 'POJFoQYVXnM',
    title: 'Which is the best timeframe to trade (for beginners)?',
    author: 'Rayner Teo',
    description:
      'Clear beginner breakdown of how 5m, 15m, 1H, 4H, and 1D timeframes work, how noise increases on lower timeframes, and how to pick a calm starting chart.',
    beforeWatchContext:
      'Focus on how each timeframe represents one candle’s duration and why starting on 15m, 1H, or 1D reduces beginner noise dramatically.',
    afterWatchTakeaways: [
      'Higher timeframes (1H, 4H, 1D) filter out random noise and reveal cleaner structural direction.',
      'Match your timeframe choice to your daily schedule rather than forcing fast 1-minute scalping.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000902',
    resourceId: '40000000-0000-4000-8000-000000000902',
    lessonId: '20000000-0000-4000-8000-000000000019',
    lessonSlug: 'chart-reading-fundamentals',
    displayOrder: 2,
    relevanceScore: 97,
    qualityScore: 92,
    videoId: 'rJj4ZbnzEGs',
    title: 'How To Use TradingView For BEGINNERS [Full 2025 Tutorial]',
    author: 'Craig Percoco',
    description:
      'Hands-on walkthrough of essential charting platform controls: Timeframe Switcher, X/Y Axes, Watchlist setup, Crosshair, Volume, and core drawing tools.',
    beforeWatchContext:
      'Watch how to keep your chart workspace clean using only a Watchlist, Timeframe buttons, Horizontal Lines, Ruler, and Long/Short Position Tool.',
    afterWatchTakeaways: [
      'Organize a compact Watchlist across Crypto, Stocks, Forex, and Indices before marking any levels.',
      'Use the Long/Short Position Tool to visualize Entry, SL (Stop Loss), and TP (Take Profit) before entering.',
    ],
  },

  // =========================================================================
  // MODULE 16: Crypto Spot vs. Perpetual Futures (crypto-spot-perps-orderbook)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000903',
    resourceId: '40000000-0000-4000-8000-000000000903',
    lessonId: '20000000-0000-4000-8000-000000000020',
    lessonSlug: 'crypto-spot-perps-orderbook',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 91,
    videoId: 'gm7RO7-wwuA',
    title: 'Spot vs Futures',
    author: 'The Present',
    description:
      'Direct comparison between owning real coins on the Spot market versus trading leveraged Crypto Futures contracts, including liquidation safety.',
    beforeWatchContext:
      'Compare Spot asset ownership (zero forced liquidation) against leveraged Futures margin rules so you always pick the right vehicle.',
    afterWatchTakeaways: [
      'Spot ownership carries zero forced liquidation risk and zero funding-rate drag.',
      'Futures allow shorting and leverage but require Isolated Margin and a hard SL (Stop Loss).',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000904',
    resourceId: '40000000-0000-4000-8000-000000000904',
    lessonId: '20000000-0000-4000-8000-000000000020',
    lessonSlug: 'crypto-spot-perps-orderbook',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 92,
    videoId: '5vW7hX6k5ho',
    title: 'What Are Crypto Derivatives? (Perpetual, Futures Contract Explained)',
    author: 'Coingecko',
    description:
      'Clear explainer on how Perpetual Futures contracts work without an expiry date, how funding rates anchor contract prices to Spot, and margin mechanics.',
    beforeWatchContext:
      'Notice how Perpetual Futures differ from expiring contracts and why Funding Rates keep Perps aligned with the Spot order book.',
    afterWatchTakeaways: [
      'Perpetual contracts never expire and stay pegged to Spot via periodic Funding payments.',
      'Always size Crypto positions from your SL (Stop Loss) distance rather than random leverage sliders.',
    ],
  },

  // =========================================================================
  // MODULE 18: Crypto Volatility & Altcoin Cycles (crypto-volatility-altcoin-cycles)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000905',
    resourceId: '40000000-0000-4000-8000-000000000905',
    lessonId: '20000000-0000-4000-8000-000000000021',
    lessonSlug: 'crypto-volatility-altcoin-cycles',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 91,
    videoId: '5RyW6jqTplI',
    title: 'Bitcoin Dominance Explained For Beginners! How To Spot Alt Season',
    author: 'SolanaFloor',
    description:
      'Beginner-friendly guide to reading BTC.D (Bitcoin Dominance) alongside Bitcoin price action to time capital rotation into high-liquidity Altcoins.',
    beforeWatchContext:
      'Track the relationship between BTC price stability and falling BTC.D to understand when Altcoin rotation setups have genuine tailwind.',
    afterWatchTakeaways: [
      'Check both BTC/USDT and BTC.D (Bitcoin Dominance) before entering any Altcoin Long.',
      'Cap total combined risk across correlated Altcoins so one Bitcoin flush cannot multiply losses.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000906',
    resourceId: '40000000-0000-4000-8000-000000000906',
    lessonId: '20000000-0000-4000-8000-000000000021',
    lessonSlug: 'crypto-volatility-altcoin-cycles',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 90,
    videoId: 'qFwvTRATC-c',
    title: 'Liquidation Heatmaps Explained in 5 minutes (Bitcoin Heatmaps for Trading)',
    author: 'The Blockchain Today',
    description:
      'Concise 5-minute walkthrough showing how Liquidation Heatmaps highlight dense pockets of leveraged Long and Short stops acting as Crypto liquidity magnets.',
    beforeWatchContext:
      'Connect bright Liquidation Heatmap zones directly to Equal Highs/Lows and Liquidity Sweeps from the Universal Core lessons.',
    afterWatchTakeaways: [
      'Bright Liquidation Heatmap clusters show where forced leveraged orders are stacked as stop-hunt fuel.',
      'Wait for price to sweep the heatmap zone and confirm BOS (Break of Structure) rather than guessing tops or bottoms.',
    ],
  },

  // =========================================================================
  // MODULE 19: Forex Pairs, Pips, Lots & Spreads (forex-pairs-pips-lots-spreads)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000907',
    resourceId: '40000000-0000-4000-8000-000000000907',
    lessonId: '20000000-0000-4000-8000-000000000022',
    lessonSlug: 'forex-pairs-pips-lots-spreads',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 93,
    videoId: 'fHGGZ2KBEMg',
    title: 'What Is Forex Trading? (Video 1 of 13)',
    author: 'Rayner Teo',
    description:
      'Foundational introduction to Foreign Exchange (FX) currency pairs, Base vs. Quote pricing, Major vs. Minor pairs, and how Bid/Ask spreads work.',
    beforeWatchContext:
      'Focus on how Base and Quote currencies interact in pairs like EUR/USD and why Major pairs offer the tightest beginner-friendly spreads.',
    afterWatchTakeaways: [
      'Buying a Forex pair means buying the Base (first) currency while simultaneously selling the Quote (second) currency.',
      'Start with high-liquidity Major pairs (EUR/USD, GBP/USD, USD/JPY) to keep Bid/Ask spread costs minimal.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000908',
    resourceId: '40000000-0000-4000-8000-000000000908',
    lessonId: '20000000-0000-4000-8000-000000000022',
    lessonSlug: 'forex-pairs-pips-lots-spreads',
    displayOrder: 2,
    relevanceScore: 97,
    qualityScore: 92,
    videoId: 'bE0ZlUMmGXo',
    title: 'What is a Pip or Point | Trading Terms',
    author: 'Trading 212',
    description:
      'Crystal-clear explanation of Pips (4th decimal on standard pairs, 2nd decimal on JPY pairs), Pipettes, and how Pip values scale across Micro, Mini, and Standard Lots.',
    beforeWatchContext:
      'Pay attention to how Pip distance multiplies with Lot size so you can calculate exact 1% risk before every trade.',
    afterWatchTakeaways: [
      'Measure 1 pip at the 4th decimal (0.0001) on EUR/USD and at the 2nd decimal (0.01) on USD/JPY.',
      'Size every Forex trade via Lot Size = Risk $ ÷ (SL Pips × $10) on USD-quoted pairs.',
    ],
  },

  // =========================================================================
  // MODULE 21: Forex Macro News & Interest Rates (forex-macro-news-rates)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000909',
    resourceId: '40000000-0000-4000-8000-000000000909',
    lessonId: '20000000-0000-4000-8000-000000000023',
    lessonSlug: 'forex-macro-news-rates',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'HBmOBOqVT74',
    title: 'How Central Banks Influence Forex Prices',
    author: 'Trading 212',
    description:
      'Plain-English breakdown of how Federal Reserve, ECB, BOE, and BOJ interest rate decisions and Hawkish vs. Dovish policy guidance drive multi-week Forex trends.',
    beforeWatchContext:
      'Observe why global yield flows follow rising interest rates and how macro rate divergence aligns with HTF (Higher Timeframe) trends.',
    afterWatchTakeaways: [
      'Hawkish rate-hike expectations attract capital into a currency; Dovish rate-cut expectations weaken it.',
      'Aligning 4H/1D market structure with Central Bank rate bias improves swing trend follow-through.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000910',
    resourceId: '40000000-0000-4000-8000-000000000910',
    lessonId: '20000000-0000-4000-8000-000000000023',
    lessonSlug: 'forex-macro-news-rates',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 91,
    videoId: 'bm0sr7mQ5Tk',
    title: 'How To Trade CPI & NFP The Right Way',
    author: 'Words of Rizdom',
    description:
      'Practical framework for surviving red-folder inflation (CPI) and jobs (NFP) releases by avoiding initial spread whipsaws and executing post-news confirmation.',
    beforeWatchContext:
      'Watch how disciplined traders avoid gambling on the exact 8:30 AM spike and wait for spreads and market structure to stabilize.',
    afterWatchTakeaways: [
      'Check the Economic Calendar every morning before entering any Forex position.',
      'Let initial CPI/NFP spread widening and two-way whipsaws pass, then trade clean post-news structure.',
    ],
  },

  // =========================================================================
  // MODULE 22: Stocks Market Hours & Order Types (stocks-market-hours-volume-order-types)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000911',
    resourceId: '40000000-0000-4000-8000-000000000911',
    lessonId: '20000000-0000-4000-8000-000000000024',
    lessonSlug: 'stocks-market-hours-volume-order-types',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 91,
    videoId: 't05XBsqgPQU',
    title: 'Order Types Explained (Limit, Stop, Market) - For Beginner Traders',
    author: 'Matt FXS',
    description:
      'Beginner-friendly walkthrough of Market Orders, Limit Orders, and Stop Orders so you control exact fill prices and place reliable protective stop losses.',
    beforeWatchContext:
      'Notice exactly when a Limit Order protects you from bad fills versus when a Stop Order ensures you exit cleanly at invalidation.',
    afterWatchTakeaways: [
      'Use Limit orders to cap your entry price and avoid surprise slippage in fast or thin stock books.',
      'Attach a hard SL (Stop Loss) immediately using Shares = Risk $ ÷ Stop Distance ($).',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000912',
    resourceId: '40000000-0000-4000-8000-000000000912',
    lessonId: '20000000-0000-4000-8000-000000000024',
    lessonSlug: 'stocks-market-hours-volume-order-types',
    displayOrder: 2,
    relevanceScore: 97,
    qualityScore: 94,
    videoId: '_qA3yFjdTuA',
    title: 'The Definitive Stock Trading Guide (for Beginners)',
    author: 'SMB Capital',
    description:
      'Prop-desk introduction to US equities covering Regular Trading Hours (9:30 AM–4:00 PM ET), volume selection, liquid stock filtering, and repeatable beginner habits.',
    beforeWatchContext:
      'Focus on why professional equity traders concentrate on high-volume Regular Trading Hours and liquid institutional names.',
    afterWatchTakeaways: [
      'Map Pre-Market levels before 9:30 AM ET, but prioritize Regular Hours for tight spreads and real volume.',
      'Focus on liquid stocks trading 2M+ average daily shares rather than choppy illiquid tickers.',
    ],
  },

  // =========================================================================
  // MODULE 24: Stocks Earnings & Relative Strength (stocks-earnings-relative-strength)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000913',
    resourceId: '40000000-0000-4000-8000-000000000913',
    lessonId: '20000000-0000-4000-8000-000000000025',
    lessonSlug: 'stocks-earnings-relative-strength',
    displayOrder: 1,
    relevanceScore: 99,
    qualityScore: 94,
    videoId: 'FQIH6o18y9g',
    title: 'How I Trade Earnings (My 4-Step Strategy)',
    author: 'SMB Capital',
    description:
      'Institutional 4-step post-earnings playbook showing how prop traders react AFTER quarterly numbers drop using RVOL, clean catalyst surprise, and structured risk.',
    beforeWatchContext:
      'Notice why professionals wait for the Earnings surprise to print first instead of gambling on blind overnight gaps.',
    afterWatchTakeaways: [
      'Avoid holding short-term trades blindly through overnight Earnings where gaps jump past your SL (Stop Loss).',
      'Trade post-earnings "Stocks in Play" with strong Guidance surprises and heavy RVOL (Relative Volume).',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000914',
    resourceId: '40000000-0000-4000-8000-000000000914',
    lessonId: '20000000-0000-4000-8000-000000000025',
    lessonSlug: 'stocks-earnings-relative-strength',
    displayOrder: 2,
    relevanceScore: 97,
    qualityScore: 93,
    videoId: 'l7F9yIf8CeE',
    title: 'Revealing My Secret Relative Strength Breakout Strategy',
    author: 'SMB Capital',
    description:
      'Tactical equity breakdown demonstrating how comparing a stock’s pullbacks against SPY reveals institutional Relative Strength right before breakout expansion.',
    beforeWatchContext:
      'Watch how a stock holding Higher Lows while SPY dips signals active institutional accumulation underneath the surface.',
    afterWatchTakeaways: [
      'Keep SPY visible alongside your stock chart to spot Relative Strength (RS) leaders in real time.',
      'Back the #1 RS leader inside today’s strongest sector rather than chasing weak sympathy laggards.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000915',
    resourceId: '40000000-0000-4000-8000-000000000915',
    lessonId: '20000000-0000-4000-8000-000000000025',
    lessonSlug: 'stocks-earnings-relative-strength',
    displayOrder: 3,
    relevanceScore: 94,
    qualityScore: 92,
    videoId: 'p5TbI2UnTww',
    title: 'Reading Stock Charts: Relative Strength | Learn How To Invest: IBD',
    author: "Investor's Business Daily",
    description:
      'Classic equity chart guide explaining how to read a Relative Strength line on daily and weekly stock charts to isolate institutional leaders.',
    beforeWatchContext:
      'Compare how multi-day and swing Relative Strength lines help you filter top-performing stocks before they break out.',
    afterWatchTakeaways: [
      'A rising Relative Strength line confirms your stock is outperforming the S&P 500 benchmark consistently.',
      'Combine HTF Relative Strength with clean structural support and RVOL for Day 1 and Day 2 runners.',
    ],
  },

  // =========================================================================
  // MODULE 25: Indices NAS100 & SPX500 Basics (indices-nas100-spx500-basics)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000916',
    resourceId: '40000000-0000-4000-8000-000000000916',
    lessonId: '20000000-0000-4000-8000-000000000026',
    lessonSlug: 'indices-nas100-spx500-basics',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'QX1g_NqSfzs',
    title: 'The ULTIMATE Guide to Trading US Indices | NASDAQ, DOW, S&P500',
    author: 'TraderNick',
    description:
      'Practical comparison of NAS100 (Nasdaq), SPX500 (S&P 500), and US30 (Dow Jones), covering volatility personality, active NY hours, and point sizing.',
    beforeWatchContext:
      'Compare how smoothly SPX500 moves versus faster, wider-ranging NAS100 so you pick the right starting index and contract size.',
    afterWatchTakeaways: [
      'Start practicing on smoother SPX500 before moving into faster, wider-swinging NAS100.',
      'Always verify your broker’s Dollar-per-Point multiplier and size via Risk $ ÷ (SL Points × $/Point).',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000917',
    resourceId: '40000000-0000-4000-8000-000000000917',
    lessonId: '20000000-0000-4000-8000-000000000026',
    lessonSlug: 'indices-nas100-spx500-basics',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 93,
    videoId: 'S77ms4xtmXw',
    title: "What's an Index? The Dow, S&P 500, and Nasdaq Explained",
    author: 'Charles Schwab',
    description:
      'Clear institutional primer explaining what a Stock Index actually measures and how weighting differs across the Dow (US30), S&P 500 (SPX500), and Nasdaq (NAS100).',
    beforeWatchContext:
      'Focus on why mega-cap tech companies move NAS100 so strongly while SPX500 represents 500 diversified US leaders.',
    afterWatchTakeaways: [
      'An Index bundles top companies into one liquid chart, eliminating single-stock earnings shock risk.',
      'Peak Index volume arrives at the 9:30 AM ET US cash equity open when all underlying stocks open.',
    ],
  },

  // =========================================================================
  // MODULE 27: Indices Risk-On Correlations (indices-risk-on-correlations)
  // =========================================================================
  {
    mappingId: '30000000-0000-4000-8000-000000000918',
    resourceId: '40000000-0000-4000-8000-000000000918',
    lessonId: '20000000-0000-4000-8000-000000000027',
    lessonSlug: 'indices-risk-on-correlations',
    displayOrder: 1,
    relevanceScore: 98,
    qualityScore: 92,
    videoId: 'RV-Ohf418L0',
    title: 'What is the Fear Index? VIX Explained Simply',
    author: 'Brian Feroldi',
    description:
      'Simple, clear breakdown of the CBOE Volatility Index (VIX), explaining what low vs. spiking VIX readings signal about market fear and candle volatility.',
    beforeWatchContext:
      'Watch how spiking VIX signals wider intraday index swings — telling you to widen structural stops and size contracts down.',
    afterWatchTakeaways: [
      'Use VIX as a volatility speedometer: higher VIX (>24) demands smaller contract size to keep risk at 1R.',
      'Falling, calm VIX supports smoother Risk-On trends while surging VIX warns of fast two-way volatility.',
    ],
  },
  {
    mappingId: '30000000-0000-4000-8000-000000000919',
    resourceId: '40000000-0000-4000-8000-000000000919',
    lessonId: '20000000-0000-4000-8000-000000000027',
    lessonSlug: 'indices-risk-on-correlations',
    displayOrder: 2,
    relevanceScore: 96,
    qualityScore: 91,
    videoId: 'MXyfXNcDNKA',
    title: 'What Is The US Dollar Index & Why Is It So Important To Traders?',
    author: 'UK Trading Academy',
    description:
      'Clear walkthrough of DXY (US Dollar Index) and how macro Dollar strength or weakness interacts with Risk-On Stock Indices, Forex, and global capital flows.',
    beforeWatchContext:
      'Observe how DXY rejecting major resistance often aligns with Risk-On buying across SPX500 and NAS100.',
    afterWatchTakeaways: [
      'Check DXY alongside VIX as a 5-second macro Risk-On / Risk-Off filter before 9:30 AM NY.',
      'Pair cross-market clues (DXY, VIX, SPX/NAS SMT) with a confirmed BOS (Break of Structure) on your traded chart.',
    ],
  },
];

export const VERIFIED_YOUTUBE_RESOURCES: LessonResourceWithDetails[] =
  VERIFIED_YOUTUBE_SPECS.map(buildVerifiedYouTubeResource);
