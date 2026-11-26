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
];

export const VERIFIED_YOUTUBE_RESOURCES: LessonResourceWithDetails[] =
  VERIFIED_YOUTUBE_SPECS.map(buildVerifiedYouTubeResource);
