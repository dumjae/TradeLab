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
];

export const VERIFIED_YOUTUBE_RESOURCES: LessonResourceWithDetails[] =
  VERIFIED_YOUTUBE_SPECS.map(buildVerifiedYouTubeResource);
