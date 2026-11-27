import type { DiagramKind } from '../../types/academy';
import type {
  AcademyModule,
  DecoupledLessonNode,
  MasteryLevel,
  SyllabusQuizQuestion,
} from '../../types/curriculum-tree';

const FRAMEWORK_DISCLAIMER =
  'Analytical Framework Notice: Market Structure and Smart Money Concepts (SMC) are visual analytical frameworks for organizing price action—NOT guaranteed explanations of institutional activity or predictors of future price. Always pair them with strict risk management.';

interface AdvancedSeed {
  code: string;
  slug: string;
  title: string;
  level: MasteryLevel;
  overviewEn: string;
  overviewTaglish: string;
  objectives: [string, string, string];
  keyPoints: [string, string, string];
  limitationsNote: string;
  practicalExample: string;
  prerequisiteCodes: string[];
  estimatedMinutes: number;
  linkedDeepLessonSlug?: string;
  diagramKind: DiagramKind;
  quiz: SyllabusQuizQuestion;
}

function buildAdvancedNode(seed: AdvancedSeed): DecoupledLessonNode {
  return {
    id: `topic-${seed.code.replace('.', '-')}`,
    code: seed.code,
    slug: seed.slug,
    title: seed.title,
    overviewEn: seed.overviewEn,
    overviewTaglish: seed.overviewTaglish,
    objectives: seed.objectives,
    keyPoints: seed.keyPoints,
    limitationsNote: seed.limitationsNote,
    practicalExample: seed.practicalExample,
    level: seed.level,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: seed.prerequisiteCodes,
    estimatedMinutes: seed.estimatedMinutes,
    linkedDeepLessonSlug: seed.linkedDeepLessonSlug,
    diagramKind: seed.diagramKind,
    quiz: seed.quiz,
  };
}

export const ADVANCED_MODULES: AcademyModule[] = [
  {
    id: 'mod-7',
    code: 'M7',
    title: 'Module 7 – Market Structure',
    subtitle: 'Swing mapping, BOS (Break of Structure), MSS (Market Structure Shift), CHoCH, internal/external structure, and MTF alignment.',
    pathId: 'advanced_price_action',
    pillar: 'advanced',
    level: 3,
    disclaimer: FRAMEWORK_DISCLAIMER,
    lessonCodes: ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8'],
  },
  {
    id: 'mod-8',
    code: 'M8',
    title: 'Module 8 – Smart Money Concepts',
    subtitle: 'Order-flow framing, BSL/SSL liquidity pools, sweeps, inducement, Order Blocks, FVGs, Premium/Discount, and Dealing Ranges.',
    pathId: 'advanced_price_action',
    pillar: 'advanced',
    level: 4,
    disclaimer: FRAMEWORK_DISCLAIMER,
    lessonCodes: [
      '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8',
      '8.9', '8.10', '8.11', '8.12', '8.13', '8.14', '8.15',
    ],
  },
  {
    id: 'mod-9',
    code: 'M9',
    title: 'Module 9 – Advanced Trading Concepts',
    subtitle: 'Displacement, inefficiencies, liquidity engineering, SMT Divergence, Judas Swing, Power of Three (AMD), OTE, and Confluence.',
    pathId: 'advanced_price_action',
    pillar: 'advanced',
    level: 4,
    disclaimer: FRAMEWORK_DISCLAIMER,
    lessonCodes: ['9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7', '9.8', '9.9', '9.10'],
  },
];

const ADVANCED_SEEDS: AdvancedSeed[] = [
  // =========================================================================
  // MODULE 7 – Market Structure (7.1 – 7.8, Level 3)
  // =========================================================================
  {
    code: '7.1',
    slug: 'understanding-market-structure',
    title: 'Understanding Market Structure',
    level: 3,
    overviewEn:
      'Market structure is the backbone framework for reading directional bias, continuation, and potential transition directly from sequential swing highs and swing lows.',
    overviewTaglish:
      'Ang market structure ang pangunahing framework sa pagbabasa ng direksyon, pagpapatuloy, at posibleng pag-ikot ng merkado gamit ang sunod-sunod na swing highs at swing lows.',
    objectives: [
      'Map raw price action into structured trend phases without relying on lagging indicators.',
      'Use structural landmarks to define objective invalidation levels.',
      'Apply market structure consistently as a visual framework rather than an infallible prediction tool.',
    ],
    keyPoints: [
      'Structure answers two vital questions before any entry: which side controls the current leg, and where is that thesis invalidated?',
      'Mechanical swing-mapping rules prevent redrawing structure in hindsight to fit personal bias.',
      'Always read structure on your Higher Timeframe (HTF) before zooming in for entries.',
    ],
    limitationsNote:
      'Market structure is an analytical framework for organizing price history—not a guaranteed predictor of future institutional orders or price direction.',
    practicalExample:
      'On 4H EUR/USD, clear ascending swings keep the trader focused strictly on bullish pullbacks until the most recent structural low closes broken.',
    prerequisiteCodes: ['4.3', '4.4', '5.3', '6.6'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'What is the primary practical purpose of mapping Market Structure before entering a trade?',
      options: [
        'To guarantee that the next candle will move in your favor.',
        'To establish an objective directional bias and clear structural invalidation level.',
        'To eliminate the need for Stop Losses.',
        'To see exact private bank order tickets.',
      ],
      correctIndex: 1,
      rationale: 'Structure frames who currently holds control and defines where your trade hypothesis is objectively proven wrong.',
      commonTrap: 'Changing swing definitions on every chart so the structure always matches the trade you already want to take.',
    },
  },
  {
    code: '7.2',
    slug: 'swing-highs-and-swing-lows',
    title: 'Swing Highs and Swing Lows',
    level: 3,
    overviewEn:
      'A Swing High is a prominent peak flanked by lower highs on both sides, while a Swing Low is a prominent trough flanked by higher lows—forming the anchor points of every structure map.',
    overviewTaglish:
      'Ang Swing High ay malinaw na tuktok na may mas mababang high sa magkabilang gilid, at ang Swing Low ay malinaw na ilalim na may mas mataas na low sa magkabilang gilid.',
    objectives: [
      'Apply a mechanical 3-bar or pullback-based rule to mark valid Swing Highs and Swing Lows.',
      'Separate major structural pivots from minor single-candle intrabar noise.',
      'Recognize why swing points naturally accumulate resting Stop Loss orders.',
    ],
    keyPoints: [
      'A classic 3-candle fractal marks a Swing High when the middle candle’s high exceeds both neighbors.',
      'Only promote a swing to "major structure" when it leads to a meaningful displacement or break of a prior level.',
      'Consistent swing rules allow fair backtesting and repeatable journaling.',
    ],
    limitationsNote:
      'Swing points are visual landmarks—different timeframes show different swings, so always define which timeframe governs your map.',
    practicalExample:
      'On the 1H chart, minor 1-candle pauses inside a rally are ignored, while the deeper 38% pullback low that launches a new high is marked as the structural Swing Low.',
    prerequisiteCodes: ['7.1'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'Why should traders adopt one consistent mechanical rule for marking Swing Highs and Swing Lows?',
      options: [
        'So every chart reading is objective, repeatable, and testable rather than driven by hindsight bias.',
        'Because brokers require fractal markers to open orders.',
        'To mark every single candle as a major swing.',
        'To guarantee zero losing trades.',
      ],
      correctIndex: 0,
      rationale: 'Consistent rules stop you from moving structural goalposts mid-trade to justify emotional entries.',
      commonTrap: 'Marking every tiny 2-pip hiccup as a structural swing and getting whipsawed by constant false breaks.',
    },
  },
  {
    code: '7.3',
    slug: 'break-of-structure-bos',
    title: 'Break of Structure (BOS)',
    level: 3,
    overviewEn:
      'A BOS (Break of Structure) occurs when price closes decisively beyond a prior swing high in an uptrend or prior swing low in a downtrend—confirming trend continuation.',
    overviewTaglish:
      'Nagaganap ang BOS (Break of Structure) kapag malinaw na nagsara ang kandila lampas sa naunang swing high sa uptrend o swing low sa downtrend—senyales ng pagpapatuloy ng trend.',
    objectives: [
      'Distinguish a valid candle-body close BOS (Break of Structure) from a mere wick sweep.',
      'Update the protected structural low/high immediately after a confirmed BOS.',
      'Wait for a pullback after a BOS rather than chasing the breakout candle.',
    ],
    keyPoints: [
      'BOS confirms continuation in the existing trend direction (unlike reversals).',
      'Requiring a candle body close beyond the prior swing filters out many deceptive liquidity wicks.',
      'Every confirmed bullish BOS shifts the structural focus to the origin low that caused the break.',
    ],
    limitationsNote:
      'A BOS confirms past directional momentum as an analytical framework—it does not guarantee the next pullback will hold.',
    practicalExample:
      'In a 4H uptrend, price closes a solid green candle above the $108.50 swing high (Bullish BOS), confirming the $105.00 origin low as the new protected level.',
    prerequisiteCodes: ['7.2'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'order-blocks-bos-choch',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'What does a confirmed Bullish BOS (Break of Structure) indicate in market-structure analysis?',
      options: [
        'That an uptrend has continued by closing above a prior structural high.',
        'That a bear market has just started.',
        'That liquidity has disappeared permanently.',
        'That you must chase a market buy immediately at the top of the candle.',
      ],
      correctIndex: 0,
      rationale: 'BOS tracks trend continuation; after confirmation, disciplined traders wait for an orderly retracement rather than chasing.',
      commonTrap: 'Treating a 1-pip wick poke above resistance that closes back below as a confirmed BOS.',
    },
  },
  {
    code: '7.4',
    slug: 'market-structure-shift-mss',
    title: 'Market Structure Shift (MSS)',
    level: 3,
    overviewEn:
      'An MSS (Market Structure Shift) occurs when price breaks an opposing structural swing with strong displacement—signaling an assertive shift in short-term directional control.',
    overviewTaglish:
      'Ang MSS (Market Structure Shift) ay malakas at mabilis na pagbasag ng kabilang structural swing na may displacement—nagpapakita ng malinaw na paglipat ng kontrol.',
    objectives: [
      'Identify the two elements of a clean MSS: breaking the key opposing pivot AND energetic displacement.',
      'Look for an MSS specifically after price interacts with a Higher Timeframe (HTF) key zone.',
      'Use an MSS to confirm Lower Timeframe (LTF) reversal entries instead of guessing tops or bottoms.',
    ],
    keyPoints: [
      'An MSS without displacement (slow, overlapping drift past a swing) carries weaker conviction.',
      'MSS works best as an execution confirmation AFTER price taps a major HTF support, resistance, or liquidity pool.',
      'Following a Bearish MSS, traders monitor the origin pullback zone rather than chasing the breakdown.',
    ],
    limitationsNote:
      'MSS is an analytical price-action framework—never treat an isolated Lower Timeframe MSS against a strong Higher Timeframe trend as a guaranteed reversal.',
    practicalExample:
      'After sweeping a Daily high on NAS100, the 5m chart drops sharply through the latest Higher Low with a wide bearish displacement candle (Bearish MSS), leaving a clean retest area.',
    prerequisiteCodes: ['7.3'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'order-blocks-bos-choch',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'Which combination makes a Lower Timeframe MSS (Market Structure Shift) most meaningful?',
      options: [
        'A slow, tiny candle drifting 1 tick past a minor swing in the middle of nowhere.',
        'Strong displacement closing through the opposing swing right after tapping a Higher Timeframe key zone.',
        'Any single red candle inside an uptrend.',
        'An MSS formed during thin 5:00 AM PHT rollover spreads.',
      ],
      correctIndex: 1,
      rationale: 'HTF location provides the strategic reason for reaction, while displacement on the MSS shows committed momentum shift.',
      commonTrap: 'Calling every tiny counter-trend micro-break an MSS while ignoring Higher Timeframe momentum.',
    },
  },
  {
    code: '7.5',
    slug: 'change-of-character-choch',
    title: 'Change of Character (CHoCH)',
    level: 3,
    overviewEn:
      'A CHoCH (Change of Character) marks the very first break of an opposing internal or swing pivot—serving as an early warning that the prevailing trend may be shifting into a pullback or reversal.',
    overviewTaglish:
      'Ang CHoCH (Change of Character) ang pinakaunang pagbasag sa kabilang swing—nagsisilbi itong maagang babala na maaaring humina o umikot ang kasalukuyang trend.',
    objectives: [
      'Compare CHoCH (initial trend-warning crack) against BOS (confirmed trend continuation).',
      'Distinguish a CHoCH that starts a deeper pullback from one that triggers a full reversal.',
      'Wait for a subsequent BOS in the new direction to confirm full structural reversal.',
    ],
    keyPoints: [
      'CHoCH is the first sign of transition—higher reward if right, but lower win rate than trading established BOS continuations.',
      'In a strong Higher Timeframe uptrend, a 15m Bearish CHoCH often just starts the normal HTF pullback.',
      'Pairing CHoCH with a liquidity sweep at a key HTF zone filters out premature counter-trend traps.',
    ],
    limitationsNote:
      'CHoCH is a descriptive structural cue, not proof that institutions have reversed direction—always respect Stop Losses.',
    practicalExample:
      'After printing Higher Highs all morning, 15m GBP/USD closes below its latest internal Higher Low at Daily resistance (Bearish CHoCH), alerting the trader to stop chasing longs.',
    prerequisiteCodes: ['7.4'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'order-blocks-bos-choch',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'How does CHoCH (Change of Character) differ from BOS (Break of Structure)?',
      options: [
        'CHoCH marks the first opposing structural break signaling a potential shift, whereas BOS confirms continuation in the existing trend.',
        'CHoCH only happens in Forex and BOS only happens in Crypto.',
        'CHoCH requires zero candles to close.',
        'They are completely unrelated to swing highs and lows.',
      ],
      correctIndex: 0,
      rationale: 'BOS continues the current trend sequence; CHoCH breaks the opposing pivot for the first time, warning of transition.',
      commonTrap: 'Calling a full bear market reversal on a single 5-minute CHoCH while the Daily chart stays strongly bullish.',
    },
  },
  {
    code: '7.6',
    slug: 'internal-vs-external-structure',
    title: 'Internal vs. External Structure',
    level: 3,
    overviewEn:
      'External structure maps the major swing high and swing low of the primary trading range, while internal structure tracks the smaller sub-waves unfolding inside that range.',
    overviewTaglish:
      'Ang external structure ang malalaking swing high at swing low ng pangunahing galaw, habang ang internal structure ang mas maliliit na alon na gumagalaw sa loob nito.',
    objectives: [
      'Separate major external swing boundaries from internal retracement sub-structure.',
      'Avoid confusing an internal CHoCH with an external trend reversal.',
      'Use internal structure alignment to time entries back in the direction of external structure.',
    ],
    keyPoints: [
      'Between a major Higher Low and Higher High, price routinely prints mini-downtrends internally during a healthy pullback.',
      'External structure remains bullish until the major external Higher Low breaks—regardless of internal bearish swings.',
      'The cleanest continuation setups occur when internal structure shifts back into alignment with external bias.',
    ],
    limitationsNote:
      'Internal/external mapping is an organizational lens—always confirm definitions on one consistent anchor timeframe to prevent confusion.',
    practicalExample:
      '4H external structure is bullish from $100 to $112. Price pulls back internally from $112 to $104 via mini LH/LLs, then flips internal structure bullish at $104—realigning with the 4H uptrend.',
    prerequisiteCodes: ['7.5'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'During a healthy bullish pullback inside a 4H external range, what does internal structure typically look like?',
      options: [
        'A smaller sequence of Lower Highs and Lower Lows pulling price into a discounted zone before realigning bullish.',
        'A flat straight line with zero candles.',
        'An immediate break below the major 4H external Higher Low.',
        'Only green candles with no wicks.',
      ],
      correctIndex: 0,
      rationale: 'Pullbacks unfold as internal counter-trend waves; recognizing them prevents mistaking routine retracements for major reversals.',
      commonTrap: 'Shorting aggressively right into the bottom of an external demand zone just because internal structure looks bearish.',
    },
  },
  {
    code: '7.7',
    slug: 'strong-and-weak-highs-lows',
    title: 'Strong and Weak Highs/Lows',
    level: 3,
    overviewEn:
      'In structural framing, a "Strong" swing is one that successfully caused a Break of Structure (BOS), while a "Weak" swing failed to break the opposing boundary and often gets targeted next.',
    overviewTaglish:
      'Sa structural framing, ang "Strong" swing ay ang nagdulot ng Break of Structure (BOS), habang ang "Weak" swing ay hindi nakabasag ng kabilang hangganan kaya mas madalas itong mabasag.',
    objectives: [
      'Classify Strong Lows/Highs (BOS-producing origins) vs. Weak Highs/Lows (unprotected targets).',
      'Use Weak Highs/Lows as logical Take Profit targets rather than placing Stop Losses behind them.',
      'Recognize that even a "Strong" swing can eventually break—never trade without a hard Stop Loss.',
    ],
    keyPoints: [
      'In an uptrend, the Higher Low that produced a fresh BOS is considered structurally strong; the new high (if it fails to reverse structure) is often weak and targeted on continuation.',
      'Do not place Stop Losses behind a Weak High/Low that failed to shift structure—it is a prime liquidity magnet.',
      'Labels describe relative structural probability, never absolute invincibility.',
    ],
    limitationsNote:
      'No swing high or low is truly unbreakable—strong vs. weak is a probability heuristic, not an institutional guarantee.',
    practicalExample:
      'A Higher Low at 1.0800 launches a bullish BOS past 1.0900 to 1.0940. On the pullback, 1.0800 is the Strong Low (protection reference) while 1.0940 becomes the Weak High target.',
    prerequisiteCodes: ['7.6'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'In an active bullish trend, which swing point is generally classified as a "Strong Low"?',
      options: [
        'A random minor low that failed to produce any new high.',
        'The structural swing low whose rally decisively closed above the prior swing high (BOS).',
        'Any low that touches RSI 30.',
        'A low that has already been broken by a bearish candle.',
      ],
      correctIndex: 1,
      rationale: 'The origin swing responsible for accomplishing a BOS demonstrated committed buying pressure and anchors trend invalidation.',
      commonTrap: 'Assuming a "Strong Low" can never break and therefore risking 5% or omitting a Stop Loss.',
    },
  },
  {
    code: '7.8',
    slug: 'multi-timeframe-market-structure',
    title: 'Multi-Timeframe Market Structure',
    level: 3,
    overviewEn:
      'Multi-Timeframe Market Structure synchronizes HTF (Higher Timeframe) directional maps with LTF (Lower Timeframe) structural shifts so you trade in harmony with dominant flow.',
    overviewTaglish:
      'Pinag-uugnay ng Multi-Timeframe Market Structure ang direksyon ng Higher Timeframe (HTF) at timing ng Lower Timeframe (LTF) para laging tugma ang entry mo sa malaking agos.',
    objectives: [
      'Construct a nested HTF → Mid-TF → LTF structural map cleanly.',
      'Wait for LTF structure to flip in alignment with HTF bias inside a key zone.',
      'Manage targets using HTF weak highs/lows while basing Stop Losses on refined LTF structure.',
    ],
    keyPoints: [
      'Example trio: Daily (narrative & major zones) → 1H (swing structure) → 15m/5m (entry MSS confirmation).',
      'Counter-trend LTF trades against an intact HTF impulse require faster profit-taking and stricter selectivity.',
      'When HTF and LTF both align bullishly after a pullback, follow-through potential improves markedly.',
    ],
    limitationsNote:
      'Multi-timeframe alignment improves organization and risk-reward clarity, but it never removes market uncertainty or news shocks.',
    practicalExample:
      'Daily is bullish into support; 1H prints a pullback low; 15m forms a bullish MSS with displacement—all three timeframes now point upward toward the Daily Weak High.',
    prerequisiteCodes: ['7.7'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'multi-timeframe-alignment',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'When Daily structure is strongly bullish and price taps a Daily demand zone, what LTF structural event provides the cleanest alignment for a Long entry?',
      options: [
        'A 15-minute Bearish BOS crashing straight through the Daily zone.',
        'A 15-minute Bullish MSS/CHoCH with displacement, shifting LTF structure back in sync with the Daily trend.',
        'A random 1-minute Doji before price even reaches the zone.',
        'Ignoring the Daily chart completely.',
      ],
      correctIndex: 1,
      rationale: 'Waiting for LTF structure to turn bullish inside a valid HTF zone confirms buyers are actively stepping in.',
      commonTrap: 'Getting lost in 1-minute structural flips while forgetting that price is sitting directly under major Weekly resistance.',
    },
  },

  // =========================================================================
  // MODULE 8 – Smart Money Concepts (8.1 – 8.15, Level 4)
  // =========================================================================
  {
    code: '8.1',
    slug: 'intro-smart-money-concepts',
    title: 'Introduction to Smart Money Concepts',
    level: 4,
    overviewEn:
      'Smart Money Concepts (SMC) is a popular price-action taxonomy—organizing liquidity, market structure, imbalances, and retracement zones into a structured analytical language.',
    overviewTaglish:
      'Ang Smart Money Concepts (SMC) ay isang tanyag na analytical framework na nag-aayos ng liquidity, market structure, imbalances, at retracement zones para mas malinaw basahin ang chart.',
    objectives: [
      'Understand SMC objectively as a modern re-framing of classic supply/demand, Wyckoff, and market structure.',
      'Separate practical SMC chart mechanics from overhyped marketing narratives about "secret bank algorithms."',
      'Commit to testing every SMC concept with strict risk management and journal data.',
    ],
    keyPoints: [
      'SMC gives consistent names (Liquidity, Order Blocks, FVGs, Premium/Discount) to recurring auction behaviors.',
      'Retail charts only display price and volume—never literal institutional intent or hidden bank order tickets.',
      'SMC is neither magic nor useless: its real value comes from clear invalidation, patience, and disciplined RR (Risk-to-Reward Ratio).',
    ],
    limitationsNote:
      'Mandatory disclaimer: SMC is strictly an analytical framework—NOT a guaranteed explanation of institutional activity or a reliable predictor of future price.',
    practicalExample:
      'Instead of claiming "banks hunted my $50 stop," an objective trader notes: "Price swept obvious equal lows where stops cluster, then displaced upward through 15m structure."',
    prerequisiteCodes: ['7.3', '7.4', '7.8'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'order-blocks-bos-choch',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'What is the most honest, disciplined way to treat Smart Money Concepts (SMC)?',
      options: [
        'As guaranteed insider proof of exactly what central banks are doing every minute.',
        'As a structured visual analytical framework for organizing liquidity, structure, and risk—never a guaranteed predictor.',
        'As a replacement for Stop Losses and Position Sizing.',
        'As a secret formula that guarantees 95% win rates.',
      ],
      correctIndex: 1,
      rationale: 'Treating SMC as a testable analytical framework keeps expectations grounded and prevents overconfidence.',
      commonTrap: 'Falling for marketing claims that SMC reveals "guaranteed algorithmic price targets" without testing edge in a journal.',
    },
  },
  {
    code: '8.2',
    slug: 'institutional-order-flow',
    title: 'Institutional Order Flow',
    level: 4,
    overviewEn:
      'In SMC terminology, "Order Flow" describes the directional rhythm of consecutive impulsive expansions and shallow mitigations as price respects one side of the market.',
    overviewTaglish:
      'Sa SMC terminology, inilalarawan ng "Order Flow" ang sunod-sunod na malalakas na galaw at mababaw na retracement habang patuloy na nirerespeto ng presyo ang isang direksyon.',
    objectives: [
      'Read bullish vs. bearish directional order flow directly from sequential candle expansions and retests.',
      'Recognize when bullish zones keep holding while opposing supply zones keep failing.',
      'Avoid fabricating narratives about unseen institutions when price flow simply turns choppy.',
    ],
    keyPoints: [
      'Bullish order flow shows demand zones holding and supply zones getting sliced through consistently.',
      'Bearish order flow shows supply zones holding while support/demand zones repeatedly break down.',
      'When both demand and supply fail unpredictably, order flow is unclear—stay flat.',
    ],
    limitationsNote:
      'Retail traders cannot see actual institutional order books; "institutional order flow" on candlestick charts is strictly an interpretive price-action lens.',
    practicalExample:
      'Three successive bullish Fair Value Gaps hold on 1H EUR/USD while every bearish zone fails—indicating constructive bullish flow without needing to guess who is buying.',
    prerequisiteCodes: ['8.1'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-liquidity',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'On a candlestick chart, what objective clue best reflects intact bullish "order flow"?',
      options: [
        'Demand/pullback zones consistently holding while opposing resistance zones keep breaking upward.',
        'Both support and resistance failing randomly back and forth.',
        'A social media post claiming banks are buying.',
        'Bearish candles breaking every Higher Low.',
      ],
      correctIndex: 0,
      rationale: 'Consistent respect for one side’s zones paired with failure of opposing zones objectively signals directional dominance.',
      commonTrap: 'Assuming you know actual bank positions rather than reading observable price reactions.',
    },
  },
  {
    code: '8.3',
    slug: 'liquidity-and-market-participants',
    title: 'Liquidity and Market Participants',
    level: 4,
    overviewEn:
      'In price-action frameworks, resting Stop Losses and breakout orders cluster around obvious highs, lows, and equal levels—forming "liquidity pools" where high trading activity concentrates.',
    overviewTaglish:
      'Madalas nagkukumpulan ang mga Stop Loss at breakout order sa paligid ng halatang highs, lows, at equal levels—bumubuo ng "liquidity pools" kung saan mabilis gumalaw ang presyo.',
    objectives: [
      'Locate obvious liquidity pools: prior day/week highs and lows, equal highs/lows, and range edges.',
      'Understand why large orders require opposing resting orders to fill without excessive slippage.',
      'Avoid placing naïve Stop Losses directly on top of obvious clustered pools.',
    ],
    keyPoints: [
      'Every Stop Loss on a Short trade is a resting Buy order above the high; every Stop Loss on a Long is a resting Sell order below the low.',
      'Equal Highs (EQH) and Equal Lows (EQL) attract dense clusters of stops and breakout orders.',
      'Liquidity pools serve both as potential reversal sweep zones and logical Take Profit magnets.',
    ],
    limitationsNote:
      'Liquidity-pool mapping is an analytical hypothesis about where retail/systematic orders cluster—not a guaranteed reversal trigger on every touch.',
    practicalExample:
      'After forming three nearly identical highs at 1.1000 on EUR/USD (EQH), price spikes to 1.1012, triggers clustered buy stops, and either accepts higher or sharply reverses.',
    prerequisiteCodes: ['8.2'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'equal-highs-lows',
    diagramKind: 'equal_highs_lows',
    quiz: {
      prompt: 'What type of orders typically cluster directly above obvious Equal Highs (EQH)?',
      options: [
        'Short-sellers’ Stop Loss buy orders and breakout traders’ Buy Stop orders.',
        'Only dividend payout instructions.',
        'Long traders’ Stop Loss sell orders.',
        'No orders ever sit near obvious highs.',
      ],
      correctIndex: 0,
      rationale: 'Both short stops and breakout entries execute as buy orders above obvious resistance highs, concentrating buy-side liquidity.',
      commonTrap: 'Assuming every touch of Equal Highs must immediately crash downward—sometimes strong trends break straight through.',
    },
  },
  {
    code: '8.4',
    slug: 'buy-side-liquidity-bsl',
    title: 'Buy-Side Liquidity (BSL)',
    level: 4,
    overviewEn:
      'BSL (Buy-Side Liquidity) refers to clusters of resting buy stops positioned above obvious swing highs, Equal Highs (EQH), and previous session/daily highs.',
    overviewTaglish:
      'Ang BSL (Buy-Side Liquidity) ay ang kumpol ng mga nakatambay na buy stop order sa itaas ng malinaw na swing highs, Equal Highs (EQH), at nakaraang daily highs.',
    objectives: [
      'Mark key BSL (Buy-Side Liquidity) reference levels: PDH (Previous Day High), PWH (Previous Week High), and EQH.',
      'Use BSL levels as structured Take Profit targets for Long trades.',
      'Wait for rejection + structure confirmation before considering a Short after a BSL sweep.',
    ],
    keyPoints: [
      'BSL sits ABOVE price—above highs where short sellers hide their Stop Losses.',
      'In a bullish trend, BSL pools are natural upside magnets for taking partial or full profits.',
      'In a bearish or ranging regime, a spike into BSL followed by rapid displacement back inside can frame a Short setup.',
    ],
    limitationsNote:
      'BSL mapping is an analytical framework; during strong macro trends, price can sweep BSL and keep rallying without reversing.',
    practicalExample:
      'A trader long SPX500 takes 75% profit directly into the Previous Day High (BSL) instead of hoping blindly for an extra 50 points.',
    prerequisiteCodes: ['8.3'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'equal-highs-lows',
    diagramKind: 'equal_highs_lows',
    quiz: {
      prompt: 'Where is Buy-Side Liquidity (BSL) typically mapped on a trading chart?',
      options: [
        'Below obvious swing lows and Equal Lows.',
        'Above obvious swing highs, Equal Highs (EQH), and prior session highs.',
        'Exactly at the 50% midpoint of a range.',
        'Only on 1-minute moving averages.',
      ],
      correctIndex: 1,
      rationale: 'Buy-side stops (short stop losses and breakout buy stops) accumulate above prominent chart highs.',
      commonTrap: 'Blindly placing Limit Sells at BSL without waiting for rejection or structure shift during a strong uptrend.',
    },
  },
  {
    code: '8.5',
    slug: 'sell-side-liquidity-ssl',
    title: 'Sell-Side Liquidity (SSL)',
    level: 4,
    overviewEn:
      'SSL (Sell-Side Liquidity) refers to clusters of resting sell stops positioned below obvious swing lows, Equal Lows (EQL), and previous session/daily lows.',
    overviewTaglish:
      'Ang SSL (Sell-Side Liquidity) ay ang kumpol ng mga nakatambay na sell stop order sa ilalim ng malinaw na swing lows, Equal Lows (EQL), at nakaraang daily lows.',
    objectives: [
      'Mark primary SSL (Sell-Side Liquidity) pools: PDL (Previous Day Low), PWL (Previous Week Low), and EQL.',
      'Use SSL pools as realistic Take Profit targets on Short setups.',
      'Evaluate post-sweep candle closes before framing a bullish reversal from SSL.',
    ],
    keyPoints: [
      'SSL sits BELOW price—below lows where long traders place protective Stop Losses.',
      'During bearish trends, SSL pools frequently act as downside targets.',
      'When price pierces SSL and quickly reclaims the level with bullish displacement, it may signal seller exhaustion.',
    ],
    limitationsNote:
      'SSL is an analytical concept—price sweeping SSL in a heavy downtrend can easily continue plunging lower, so confirmation and hard stops are mandatory.',
    practicalExample:
      'On a bullish Daily trend, London session dips briefly beneath the Asian session low (SSL), wicks sharply back above it, and shifts 5m structure upward.',
    prerequisiteCodes: ['8.4'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'equal-highs-lows',
    diagramKind: 'equal_highs_lows',
    quiz: {
      prompt: 'Which chart location is a textbook example of Sell-Side Liquidity (SSL)?',
      options: [
        'Above an all-time high.',
        'Directly below Equal Lows (EQL) or the Previous Day Low (PDL).',
        'At the top of a bullish engulfing candle.',
        'Above a daily resistance ceiling.',
      ],
      correctIndex: 1,
      rationale: 'Long traders’ Stop Losses and breakdown sell stops sit beneath obvious lows, forming Sell-Side Liquidity.',
      commonTrap: 'Buying blindly the moment price touches PDL while heavy red momentum candles are still expanding downward.',
    },
  },
  {
    code: '8.6',
    slug: 'liquidity-sweeps-smc',
    title: 'Liquidity Sweeps',
    level: 4,
    overviewEn:
      'A Liquidity Sweep occurs when price briefly pokes beyond a prominent high (BSL) or low (SSL), triggers clustered stops, and rapidly snaps back inside with opposing displacement.',
    overviewTaglish:
      'Ang Liquidity Sweep ay ang mabilis na pagsilip ng presyo lampas sa mahalagang high o low para kumuha ng stops, bago mabilis na bumalik sa loob na may malakas na kabilang galaw.',
    objectives: [
      'Differentiate a genuine Liquidity Sweep (wick rejection + reclaim + displacement) from a true breakout.',
      'Wait for the candle close back inside the level before labeling a move a sweep.',
      'Pair a sweep with an LTF MSS (Market Structure Shift) to confirm execution.',
    ],
    keyPoints: [
      'A sweep is ONLY confirmed after price reclaims the broken level—never while price is still pushing outside it.',
      'Sweeps aligned with Higher Timeframe trend direction (e.g., sweeping an internal low inside a Daily uptrend) carry stronger probability.',
      'True breakouts close firmly outside and hold; sweeps snap back quickly and trap breakout chasers.',
    ],
    limitationsNote:
      'Liquidity sweeps are an analytical price-action pattern—they fail regularly in news-driven breakouts, so always wait for confirmation and cap risk.',
    practicalExample:
      'GBP/USD dips 8 pips under the Asian low at 3:15 PM PHT (London open), closes back above with a long lower wick, and breaks a 5m Lower High upward.',
    prerequisiteCodes: ['8.5'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'liquidity-sweeps',
    diagramKind: 'liquidity_sweep_vs_breakout',
    quiz: {
      prompt: 'What confirms a Liquidity Sweep rather than an active breakout continuation?',
      options: [
        'Price ticking 1 pip past a level mid-candle.',
        'Price briefly piercing the level, quickly closing back inside the range, and showing opposing displacement.',
        'Three wide candles closing progressively further outside the range.',
        'Checking RSI on a 1-minute chart.',
      ],
      correctIndex: 1,
      rationale: 'Reclaiming the level with opposing momentum separates a failed breakout/sweep from genuine acceptance outside the range.',
      commonTrap: 'Stepping in front of a runaway breakout candle hoping it will turn into a sweep before any rejection actually prints.',
    },
  },
  {
    code: '8.7',
    slug: 'inducement-smc',
    title: 'Inducement',
    level: 4,
    overviewEn:
      'Inducement describes a minor, tempting internal high or low formed just ahead of a deeper Higher Timeframe zone—luring early traders to enter prematurely before price completes its full pullback.',
    overviewTaglish:
      'Ang inducement ay isang mababaw na internal high o low bago ang totoong Higher Timeframe zone—na madalas humihila sa mga nagmamadaling trader bago tuluyang umabot ang presyo sa mas malalim na zone.',
    objectives: [
      'Spot minor internal pullback pivots sitting directly in front of deeper unmitigated zones.',
      'Practice patience by waiting for internal liquidity to clear before entering deeper demand/supply.',
      'Avoid labeling every losing early entry as "intentional manipulation."',
    ],
    keyPoints: [
      'Early buyers entering at the first shallow internal bounce often place stops right underneath it—fueling the dip into the deeper zone.',
      'Waiting for inducement to be swept improves entry location and reduces avoidable early stop-outs.',
      'Sometimes strong trends never sweep inducement and take off without you—accepting missed trades is part of discipline.',
    ],
    limitationsNote:
      'Inducement is an analytical way to avoid impatient early entries—not proof of deliberate retail targeting, and not every pullback will reach the deepest zone.',
    practicalExample:
      'In a 1H uptrend, price pauses shallowly at 25% retracement, bounces briefly, then sweeps beneath that minor bounce into the 61.8% demand zone before resuming higher.',
    prerequisiteCodes: ['8.6'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'liquidity-sweeps',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'How does understanding "Inducement" practically help a pullback trader?',
      options: [
        'It guarantees price will always reach the deepest 78.6% zone.',
        'It reminds you not to chase the very first shallow internal pause when a cleaner, unmitigated structural zone sits just below it.',
        'It eliminates the need for Stop Losses.',
        'It predicts exact news numbers.',
      ],
      correctIndex: 1,
      rationale: 'Recognizing premature internal bounces helps you wait for higher-quality pullback depth and cleaner risk-reward.',
      commonTrap: 'Waiting forever for an ultra-deep inducement sweep during a runaway trend and missing every clean setup.',
    },
  },
  {
    code: '8.8',
    slug: 'order-blocks-ob',
    title: 'Order Blocks (OB)',
    level: 4,
    overviewEn:
      'An OB (Order Block) is typically marked as the last opposing candle (or small base) immediately preceding a strong impulsive displacement that causes a BOS (Break of Structure).',
    overviewTaglish:
      'Ang OB (Order Block) ay ang huling salungat na kandila bago ang malakas na displacement na nagdulot ng Break of Structure (BOS)—ginagamit bilang zone ng posibleng retest.',
    objectives: [
      'Identify valid high-probability Order Blocks: must precede strong displacement and a structural break.',
      'Distinguish fresh (unmitigated) Order Blocks from already-tapped (mitigated) zones.',
      'Combine Order Blocks with Premium/Discount and liquidity sweeps instead of marking every red candle.',
    ],
    keyPoints: [
      'A Bullish OB is the last bearish candle/base before an energetic upward impulse breaking structure.',
      'High-quality OBs leave behind an imbalance (Fair Value Gap) and originate after a liquidity sweep.',
      'Order Blocks are essentially refined supply/demand origin zones—they fail frequently when traded against HTF trend.',
    ],
    limitationsNote:
      'Order Blocks are an analytical zone-marking framework—not literal proof of resting bank limit orders, and price slices straight through invalid OBs routinely.',
    practicalExample:
      'A 1H bearish candle sweeps an internal low, then price rockets upward leaving a Fair Value Gap and Bullish BOS; on retracement, that origin bearish candle forms the Bullish OB to watch.',
    prerequisiteCodes: ['8.7'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'order-blocks-bos-choch',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'Which filter separates a high-quality Order Block (OB) from a random opposing candle?',
      options: [
        'It must be followed by strong displacement that breaks structure (BOS/MSS), ideally leaving an imbalance.',
        'Any red candle anywhere on the chart is a valid Bullish Order Block.',
        'It must be drawn on a 1-second chart.',
        'It must already have been tested five times.',
      ],
      correctIndex: 0,
      rationale: 'Without energetic displacement and a structural break, an opposing candle simply reflects ordinary chop rather than an origin of strong imbalance.',
      commonTrap: 'Drawing ten Order Blocks on one chart and taking blind limit entries on every single one.',
    },
  },
  {
    code: '8.9',
    slug: 'breaker-blocks',
    title: 'Breaker Blocks',
    level: 4,
    overviewEn:
      'A Breaker Block is a failed Order Block that price slices straight through with strong displacement, flipping its analytical role from support to resistance (or vice versa).',
    overviewTaglish:
      'Ang Breaker Block ay isang nabigong Order Block na malakas na nabasag ng presyo, kaya nagpapalit ito ng papel mula support patungong resistance (o kabaligtaran).',
    objectives: [
      'Identify the classic Breaker sequence: sweep of liquidity → displacement breaking through the prior OB → retest of the broken OB.',
      'Recognize Breaker Blocks as SMC’s specific refinement of classic support-resistance polarity flips.',
      'Confirm that the breaking move actually shifted market structure before trusting a Breaker retest.',
    ],
    keyPoints: [
      'A Bearish Breaker forms when a bullish candle/OB that swept a high gets smashed downward through the prior low.',
      'Trapped traders from the failed OB often exit near breakeven on the retest, adding pressure in the new direction.',
      'Breakers work best when aligned with a Fair Value Gap overlapping the broken candle body.',
    ],
    limitationsNote:
      'Breaker Blocks are an interpretive polarity-flip framework—not guaranteed turning points; always place a hard Stop Loss beyond the invalidation swing.',
    practicalExample:
      'Price sweeps a high off a 15m bullish candle, then crashes sharply below the prior swing low; when price bounces back into that failed bullish candle, sellers step in.',
    prerequisiteCodes: ['8.8'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'order-blocks-bos-choch',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'What classic technical-analysis principle does a Breaker Block closely parallel?',
      options: [
        'Moving average golden cross.',
        'Support-turned-resistance (and resistance-turned-support) role reversal after a decisive structural break.',
        'RSI overbought divergence.',
        'Weekend market gaps.',
      ],
      correctIndex: 1,
      rationale: 'A Breaker Block is a failed origin zone that flips polarity once displaced through, trapping prior participants.',
      commonTrap: 'Marking any random broken candle as a Breaker without a preceding sweep and structural shift.',
    },
  },
  {
    code: '8.10',
    slug: 'mitigation-blocks',
    title: 'Mitigation Blocks',
    level: 4,
    overviewEn:
      'A Mitigation Block is a failed structural origin zone similar to a Breaker Block, except it forms WITHOUT first sweeping a prior high or low—indicating immediate directional weakness.',
    overviewTaglish:
      'Ang Mitigation Block ay halos kapareho ng Breaker Block, pero nabubuo ito kahit walang naunang liquidity sweep—senyales na hindi na kaya ng kabilang panig na gumawa ng bagong tuktok o ilalim.',
    objectives: [
      'Distinguish a Mitigation Block (failure to make a new high/low) from a Breaker Block (post-sweep failure).',
      'Spot the classic Head-and-Shoulders or failed-swing geometry behind a Mitigation Block.',
      'Wait for clear structural breakdown before monitoring the retest zone.',
    ],
    keyPoints: [
      'In a Bearish Mitigation Block, price attempts to rally from a Higher Low, fails to make a new Higher High, and breaks down through the low.',
      'The last up-close candle(s) of that failed bounce form the Mitigation Block on a subsequent retest.',
      'Because no sweep occurred first, always check whether resting liquidity just above the failed high could still be swept later.',
    ],
    limitationsNote:
      'Mitigation Blocks are a visual price-action classification—never assume price must stop at the exact candle boundary.',
    practicalExample:
      'In a weakening uptrend, price bounces weakly from $100 to $104 (failing below the $106 high) and drops through $100; the $103–$104 base acts as a Bearish Mitigation Block.',
    prerequisiteCodes: ['8.9'],
    estimatedMinutes: 8,
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'What is the defining structural difference between a Breaker Block and a Mitigation Block?',
      options: [
        'A Breaker Block follows a sweep of a prior high/low, whereas a Mitigation Block forms after price fails to reach a new high/low.',
        'Mitigation Blocks only appear on Monthly charts.',
        'Breaker Blocks cannot be bearish.',
        'There is zero difference between them.',
      ],
      correctIndex: 0,
      rationale: 'Breaker Blocks involve a stop-run/sweep before reversing; Mitigation Blocks reflect failure swings that never clear the prior extreme.',
      commonTrap: 'Placing a razor-tight stop directly at the Mitigation Block when obvious un-swept liquidity sits right above it.',
    },
  },
  {
    code: '8.11',
    slug: 'fair-value-gaps-fvg',
    title: 'Fair Value Gaps (FVG)',
    level: 4,
    overviewEn:
      'An FVG (Fair Value Gap) is a three-candle price imbalance where candle 1’s wick and candle 3’s wick do not overlap—highlighting rapid one-sided displacement across candle 2.',
    overviewTaglish:
      'Ang FVG (Fair Value Gap) ay tatlong-kandilang imbalance kung saan hindi nagtatagpo ang wick ng una at ikatlong kandila—patunay ng sobrang bilis na galaw sa gitnang kandila.',
    objectives: [
      'Draw Bullish FVGs (candle 1 High to candle 3 Low) and Bearish FVGs (candle 1 Low to candle 3 High) accurately.',
      'Use the FVG 50% midpoint (Consequent Encroachment) to gauge equilibrium inside an imbalance.',
      'Filter FVGs by Higher Timeframe trend, displacement quality, and Premium/Discount location.',
    ],
    keyPoints: [
      'An FVG visually marks rapid price repricing where two-way trading briefly thinned out.',
      'Markets often—but NOT always—revisit FVGs to rebalance before continuing in the displacement direction.',
      'A tiny 1-pip gap in choppy noise is meaningless; focus on prominent FVGs aligned with BOS/MSS.',
    ],
    limitationsNote:
      'Fair Value Gaps are an analytical imbalance framework—price is never required to fill every FVG, nor guaranteed to bounce when it does.',
    practicalExample:
      'During the New York open on NAS100, a strong green displacement candle leaves a 25-point Bullish FVG; 20 minutes later, price dips to the FVG 50% midpoint and resumes upward.',
    prerequisiteCodes: ['8.10'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'fair-value-gaps',
    diagramKind: 'fair_value_gap',
    quiz: {
      prompt: 'How is a Bullish FVG (Fair Value Gap) defined across three consecutive candles (C1, C2, C3)?',
      options: [
        'A vertical gap between C1’s High and C3’s Low during a strong upward C2 expansion.',
        'Any single green candle with a long upper wick.',
        'A gap between C1’s Low and C3’s High during a selloff.',
        'Three identical Doji candles side by side.',
      ],
      correctIndex: 0,
      rationale: 'When C3’s Low stays strictly above C1’s High, the middle candle C2 repriced upward so fast that no overlapping sell-side delivery occurred in that zone.',
      commonTrap: 'Assuming every single FVG on a 1-minute chart must fill and bounce automatically.',
    },
  },
  {
    code: '8.12',
    slug: 'inverse-fair-value-gaps-ifvg',
    title: 'Inverse Fair Value Gaps (IFVG)',
    level: 4,
    overviewEn:
      'An IFVG (Inverse Fair Value Gap) occurs when an existing Fair Value Gap fails to hold and price closes decisively through it—turning the failed imbalance into an opposing reference zone.',
    overviewTaglish:
      'Nagaganap ang IFVG (Inverse Fair Value Gap) kapag hindi gumana ang isang Fair Value Gap at tuluyang nagsara ang presyo lampas dito—kaya nagpapalit ito ng direksyon bilang bagong zone.',
    objectives: [
      'Identify when a Bullish FVG invalidates (full candle close below) and flips into a Bearish IFVG.',
      'Use an IFVG as an early confirmation cue after a Higher Timeframe liquidity sweep.',
      'Require decisive body closes—not mere wicks—before treating an FVG as inverted.',
    ],
    keyPoints: [
      'When a Bullish FVG gets violated cleanly on a candle close, it shows opposing sellers overwhelmed buyers in an area buyers should have defended.',
      'IFVGs frequently appear during fast reversals right before or alongside an LTF MSS.',
      'As with all SMC concepts, IFVGs carry highest weight at key HTF zones rather than random mid-range noise.',
    ],
    limitationsNote:
      'IFVGs are a visual confirmation tool within the SMC framework—they still fail in choppy consolidations and always require defined Stop Losses.',
    practicalExample:
      'Price sweeps the Previous Day High, drops decisively through a 5m Bullish FVG with a full red close, then retests the underside of that IFVG before sliding lower.',
    prerequisiteCodes: ['8.11'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'fair-value-gaps',
    diagramKind: 'fair_value_gap',
    quiz: {
      prompt: 'What transforms a Bullish Fair Value Gap into a Bearish Inverse Fair Value Gap (IFVG)?',
      options: [
        'A brief wick dip into the FVG that closes back above it.',
        'A decisive bearish candle body closing completely below the Bullish FVG.',
        'Zooming out to the Weekly chart.',
        'Waiting three days without price touching the zone.',
      ],
      correctIndex: 1,
      rationale: 'A full body close through the imbalance proves the original side failed to defend it, flipping its analytical role.',
      commonTrap: 'Calling a wick dip into an FVG an IFVG before any candle actually closes through it.',
    },
  },
  {
    code: '8.13',
    slug: 'premium-and-discount-zones',
    title: 'Premium and Discount Zones',
    level: 4,
    overviewEn:
      'Premium and Discount divides a defined price swing at its 50% midpoint: prices above 50% sit in Premium (expensive for longs, favorable for shorts) while prices below 50% sit in Discount (favorable for longs).',
    overviewTaglish:
      'Hinahati ng Premium at Discount ang isang swing sa 50% gitna: ang itaas ng 50% ay Premium (mahal para bumili, mas angkop sa short) at ang ilalim ng 50% ay Discount (mas sulit para bumili).',
    objectives: [
      'Anchor a 0%–50%–100% tool cleanly across an active structural swing leg.',
      'Filter Long setups strictly inside Discount (< 50%) and Short setups inside Premium (> 50%).',
      'Improve average RR (Risk-to-Reward Ratio) automatically by refusing to buy expensive Premium extremes.',
    ],
    keyPoints: [
      'Buying inside Discount gives you more room back to the swing high and less distance to the invalidation low.',
      'Selling inside Premium keeps your Stop Loss closer to the swing high while opening generous room toward the swing low.',
      'An Order Block or FVG sitting inside Discount (for a Long) generally outperforms one stuck high in Premium.',
    ],
    limitationsNote:
      'Premium/Discount is a relative location framework—strong news momentum can sometimes resume without dipping below 50%, which simply means passing on poor RR.',
    practicalExample:
      'On a swing from $100 to $120, 50% Equilibrium is $110. A bullish trader ignores an FVG at $116 (Premium) and waits patiently for the $106–$108 Discount demand zone.',
    prerequisiteCodes: ['8.12'],
    estimatedMinutes: 8,
    diagramKind: 'support_demand',
    quiz: {
      prompt: 'In an active bullish swing leg from $50 (Low) to $70 (High), which price area represents the Discount zone for planning Long pullbacks?',
      options: [
        'Above $60 (between $60 and $70).',
        'Below $60 (between $50 and $60).',
        'Only above $72.',
        'Exactly at $69.50.',
      ],
      correctIndex: 1,
      rationale: 'The 50% midpoint is $60; prices below $60 sit in Discount, offering structurally superior Risk-to-Reward for bullish entries.',
      commonTrap: 'Buying a bullish Order Block located at 85% of the range (deep Premium) and wondering why the Risk-to-Reward is poor.',
    },
  },
  {
    code: '8.14',
    slug: 'equilibrium-smc',
    title: 'Equilibrium',
    level: 4,
    overviewEn:
      'Equilibrium is the exact 50% midpoint of a swing leg or range—representing fair short-term balance between the upper Premium half and lower Discount half.',
    overviewTaglish:
      'Ang Equilibrium ay ang eksaktong 50% gitna ng isang swing o range—nagsisilbi itong pantay na punto sa pagitan ng Premium sa itaas at Discount sa ilalim.',
    objectives: [
      'Calculate and plot the 50% Equilibrium line across ranges, impulses, and large Fair Value Gaps.',
      'Understand why entering right at 50% often carries awkward symmetry unless paired with strong confluence.',
      'Use Equilibrium as an objective partial-profit or trade-management checkpoint.',
    ],
    keyPoints: [
      'Equilibrium is the dividing fence: wait for price to cross past 50% into Discount for Longs or Premium for Shorts.',
      'Inside wide sideways consolidations, price frequently chops back and forth around 50%—avoid initiating trades directly in the middle.',
      'On a single large candle or FVG, the 50% midpoint (Consequent Encroachment) acts as a precision reaction reference.',
    ],
    limitationsNote:
      'Equilibrium is a geometric reference point within a range—it has no predictive power on its own without structural context.',
    practicalExample:
      'Inside a $200 range on ETH/USDT ($3,000–$3,200), a trader avoids mid-range chop around $3,100 (Equilibrium) and focuses strictly near the range extremes.',
    prerequisiteCodes: ['8.13'],
    estimatedMinutes: 7,
    diagramKind: 'support_demand',
    quiz: {
      prompt: 'Why do experienced range traders generally avoid opening brand-new positions right at the 50% Equilibrium of a sideways range?',
      options: [
        'Because brokers block orders at the 50% midpoint.',
        'Because mid-range entries suffer maximum directional uncertainty and poor Risk-to-Reward toward both range edges.',
        'Because Equilibrium only exists in uptrends.',
        'Because 50% always triggers an immediate crash.',
      ],
      correctIndex: 1,
      rationale: 'In the middle of a range, price can swing either way equally, offering mediocre reward compared to the distance to clear invalidation.',
      commonTrap: 'Getting bored waiting for price to reach an extreme and clicking buy/sell right in the noisy center.',
    },
  },
  {
    code: '8.15',
    slug: 'dealing-range',
    title: 'Dealing Range',
    level: 4,
    overviewEn:
      'A Dealing Range is the active price box framed between a significant sweep/origin low and sweep/origin high, within which internal liquidity, imbalances, and retracements unfold until broken.',
    overviewTaglish:
      'Ang Dealing Range ay ang aktibong kahon ng presyo sa pagitan ng mahalagang low at high kung saan umiikot ang mga retracement at liquidity hanggang sa mabasag ito.',
    objectives: [
      'Define the current Dealing Range boundaries using external swing liquidity points.',
      'Map internal liquidity pools, FVGs, and Premium/Discount relative to that single active Dealing Range.',
      'Update the Dealing Range cleanly whenever price decisively breaks and closes outside an external boundary.',
    ],
    keyPoints: [
      'Anchoring all analysis to one clear Dealing Range keeps Premium/Discount and targets consistent.',
      'Within a Dealing Range, price often moves from external liquidity (sweep) → internal imbalance → opposing external liquidity.',
      'Once an external boundary breaks cleanly with displacement, a brand-new Dealing Range forms.',
    ],
    limitationsNote:
      'The Dealing Range is an analytical scoping frame to keep charts organized—macro catalysts can expand price abruptly beyond any historical range.',
    practicalExample:
      'EUR/USD sweeps a Weekly low at 1.0720 and rallies to a 4H high at 1.0880; until either edge breaks, 1.0720–1.0880 serves as the active Dealing Range.',
    prerequisiteCodes: ['8.14'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'How does defining a clear Dealing Range improve chart analysis?',
      options: [
        'It locks price inside the range forever.',
        'It anchors Premium/Discount, internal imbalances, and logical opposing liquidity targets to one objective boundary.',
        'It predicts central bank decisions one week early.',
        'It replaces position sizing.',
      ],
      correctIndex: 1,
      rationale: 'A clear Dealing Range gives coherent boundaries so every zone and target is evaluated consistently.',
      commonTrap: 'Constantly shrinking or stretching the range mid-session to force your desired entry into "Discount."',
    },
  },

  // =========================================================================
  // MODULE 9 – Advanced Trading Concepts (9.1 – 9.10, Level 4)
  // =========================================================================
  {
    code: '9.1',
    slug: 'displacement-price-action',
    title: 'Displacement',
    level: 4,
    overviewEn:
      'Displacement is an energetic, wide-bodied directional surge with minimal wick overlap that leaves behind Fair Value Gaps and breaks structure—signaling decisive urgency.',
    overviewTaglish:
      'Ang Displacement ay isang malakas at mabilis na bugso ng malalaking kandila na halos walang overlap at madalas nag-iiwan ng Fair Value Gap—senyales ng matinding momentum.',
    objectives: [
      'Recognize true displacement candles (large real bodies, strong closes, FVG creation) vs. sluggish drift.',
      'Use displacement as a mandatory quality filter for BOS, MSS, Order Blocks, and FVGs.',
      'Avoid chasing the peak of a displacement leg—wait for the subsequent retracement.',
    ],
    keyPoints: [
      'Displacement visually separates committed repricing from aimless low-volume drift.',
      'An MSS backed by clear displacement carries far higher conviction than a weak 1-pip close.',
      'After sharp displacement, patience for a retracement into Discount/Premium protects RR (Risk-to-Reward Ratio).',
    ],
    limitationsNote:
      'Displacement shows aggressive past momentum—it can also appear as a news-driven exhaustion spike, so always check macro calendar context.',
    practicalExample:
      'Right after U.S. CPI cools, two wide consecutive 5m green candles surge 45 points on SPX500, breaking structure and creating a clean FVG—textbook bullish displacement.',
    prerequisiteCodes: ['8.6', '8.8', '8.11'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'fair-value-gaps',
    diagramKind: 'fair_value_gap',
    quiz: {
      prompt: 'Which candle signature best defines true Displacement?',
      options: [
        'Six tiny overlapping Dojis drifting sideways.',
        'Energetic wide-bodied candles closing strongly in one direction, breaking structure and often leaving a Fair Value Gap.',
        'A single long upper wick with a tiny body.',
        'Thin weekend candles with wide spreads.',
      ],
      correctIndex: 1,
      rationale: 'Wide bodies, strong closes, and minimal overlap visually confirm urgent one-sided repricing.',
      commonTrap: 'Entering market orders right at the extended tip of a huge displacement candle instead of waiting for a structured pullback.',
    },
  },
  {
    code: '9.2',
    slug: 'market-inefficiencies',
    title: 'Market Inefficiencies',
    level: 4,
    overviewEn:
      'Market inefficiencies—including Fair Value Gaps, Volume Imbalances (body-to-body gaps), and Opening Gaps—mark areas where price jumped rapidly without balanced two-sided trading.',
    overviewTaglish:
      'Ang market inefficiencies tulad ng Fair Value Gaps, Volume Imbalances, at Opening Gaps ay mga lugar kung saan lumundag nang mabilis ang presyo nang walang balanseng palitan.',
    objectives: [
      'Identify three common visual inefficiencies: Fair Value Gaps, Volume Imbalances, and Session/Weekend Gaps.',
      'Understand why price frequently gravitates back toward nearby inefficiencies to restore two-way price discovery.',
      'Prioritize fresh Higher Timeframe inefficiencies over tiny Lower Timeframe gaps.',
    ],
    keyPoints: [
      'A Volume Imbalance appears when one candle closes and the next opens with a small body gap, even if wicks overlap.',
      'Equity Opening Gaps (and CME futures weekend gaps) often act as powerful magnets or support/resistance shelves.',
      'Inefficiencies are zones of interest—never guaranteed magnets that must fill on the same day.',
    ],
    limitationsNote:
      'Breakaway gaps driven by major fundamental surprises can remain unfilled for months or years—never short or buy blindly expecting an automatic gap fill.',
    practicalExample:
      'NVDA gaps up +4% at the New York open on strong earnings; instead of shorting blindly for a "gap fill," a trader watches whether the gap top holds as support.',
    prerequisiteCodes: ['9.1'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'fair-value-gaps',
    diagramKind: 'fair_value_gap',
    quiz: {
      prompt: 'Why is blindly fading every market gap with the belief that "all gaps must fill immediately" dangerous?',
      options: [
        'Because strong fundamental breakaway gaps can trend away for weeks or months without filling.',
        'Because gaps never appear on stock or futures charts.',
        'Because brokers close gap trades automatically after 5 minutes.',
        'Because Volume Imbalances only happen in uptrends.',
      ],
      correctIndex: 0,
      rationale: 'While routine intraday inefficiencies often rebalance, catalyst-driven breakaway gaps can run far against counter-trend fades.',
      commonTrap: 'Treating "gaps always fill" as a physical law instead of a conditional tendency.',
    },
  },
  {
    code: '9.3',
    slug: 'liquidity-engineering',
    title: 'Liquidity Engineering',
    level: 4,
    overviewEn:
      'In SMC language, "Liquidity Engineering" refers to chart formations—like tidy trendlines, Equal Highs, or Equal Lows—that naturally build dense pools of predictable Stop Losses along an obvious line.',
    overviewTaglish:
      'Sa SMC framework, inilalarawan ng "Liquidity Engineering" ang mga halatang porma tulad ng malinis na trendline o Equal Lows kung saan naiipon ang maraming Stop Loss sa iisang linya.',
    objectives: [
      'Recognize trendline liquidity (multiple neat bounces creating stacked retail stops right underneath).',
      'Spot why overly "textbook" retail support/resistance lines often experience sharp stop-runs before moving.',
      'Avoid viewing natural crowd clustering as a conspiracy—treat it objectively as predictable stop density.',
    ],
    keyPoints: [
      'When three or four clean bounces form a diagonal trendline, thousands of traders tuck Stop Losses just below it.',
      'Once price pierces that crowded line, cascading stop orders create rapid acceleration into deeper structural zones.',
      'Instead of placing your stop inside the crowd, wait for the crowded line to sweep and confirm before entering.',
    ],
    limitationsNote:
      'Mandatory framing: "Liquidity Engineering" is a descriptive metaphor for crowded order clustering—NOT verifiable evidence of coordinated market manipulation.',
    practicalExample:
      'EUR/USD bounces four times along a neat 15m ascending trendline; price snaps cleanly beneath the trendline, clears stacked stops into a 1H demand zone, and then rallies.',
    prerequisiteCodes: ['9.2'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'equal-highs-lows',
    diagramKind: 'equal_highs_lows',
    quiz: {
      prompt: 'Why do neat, heavily watched trendlines with four or five touches often experience sharp sudden breaks?',
      options: [
        'Because dense clusters of Stop Loss orders accumulate just beyond the line, accelerating price once triggered.',
        'Because charting software deletes trendlines after four touches.',
        'Because trendlines are illegal on exchanges.',
        'Because volatility drops to zero on the fifth touch.',
      ],
      correctIndex: 0,
      rationale: 'Crowded stop placement turns a break into a cascade of market orders, often sweeping into deeper liquidity.',
      commonTrap: 'Assuming every sweep of a trendline must reverse back up—sometimes the trendline break starts a genuine downtrend.',
    },
  },
  {
    code: '9.4',
    slug: 'inducement-vs-liquidity-sweep',
    title: 'Inducement vs. Liquidity Sweep',
    level: 4,
    overviewEn:
      'While both clear resting stops, Inducement clears a minor internal pivot on the way INTO a key zone, whereas an external Liquidity Sweep clears a major boundary to frame a potential reversal.',
    overviewTaglish:
      'Parehong kumukuha ng stops ang dalawa, pero ang Inducement ay panloob na pivot na nililinis PAPASOK sa key zone, samantalang ang Liquidity Sweep ay panlabas na boundary na kadalasang simula ng pag-ikot.',
    objectives: [
      'Separate internal inducement sweeps (entry-setup fuel) from external major liquidity sweeps (reversal catalysts).',
      'Read sequence cleanly: external sweep → MSS → internal inducement → deeper zone entry.',
      'Avoid conflating minor internal wicks with major Daily/Weekly liquidity sweeps.',
    ],
    keyPoints: [
      'Inducement sits internally in front of an Order Block or FVG; clearing it validates the deeper entry zone.',
      'Major Liquidity Sweeps occur at external boundaries (PDH/PDL, Asia High/Low, major swing highs/lows).',
      'Always ask: "Did price just clear an internal minor pivot or a major external pool?"',
    ],
    limitationsNote:
      'Both terms are conceptual labels within the SMC toolkit—confirm every setup with actual candle closes, structure, and strict risk limits.',
    practicalExample:
      'Price sweeps the Previous Day Low (major Liquidity Sweep), shifts bullish, pulls back to sweep a minor 5m bounce low (Inducement) into a 15m OB, and expands higher.',
    prerequisiteCodes: ['9.3'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'liquidity-sweeps',
    diagramKind: 'liquidity_sweep_vs_breakout',
    quiz: {
      prompt: 'How do Inducement and a major external Liquidity Sweep typically differ in position on a chart?',
      options: [
        'Inducement clears a minor internal pivot ahead of a deeper entry zone, while a major Liquidity Sweep clears an external boundary like PDH/PDL.',
        'Inducement only happens on Weekly charts.',
        'Liquidity Sweeps never involve Stop Loss orders.',
        'They require completely different asset classes.',
      ],
      correctIndex: 0,
      rationale: 'Distinguishing internal setup fuel from external structural boundaries clarifies whether you are entering a pullback or spotting a macro turn.',
      commonTrap: 'Reversing your entire Higher Timeframe bias just because a tiny internal inducement pivot was swept.',
    },
  },
  {
    code: '9.5',
    slug: 'smt-divergence',
    title: 'SMT Divergence',
    level: 4,
    overviewEn:
      'SMT (Smart Money Technique) Divergence compares two closely correlated instruments (such as EUR/USD vs. GBP/USD, or ES vs. NQ) when one makes a new swing extreme while the correlated peer fails to do so.',
    overviewTaglish:
      'Ikinukumpara ng SMT Divergence ang dalawang magkaugnay na merkado (tulad ng EUR/USD at GBP/USD, o ES at NQ) kapag nakagawa ng bagong high/low ang isa pero hindi nakasabay ang kapareha.',
    objectives: [
      'Pair valid correlated markets: EUR/USD & GBP/USD, SPX500 & NAS100, or BTC & ETH.',
      'Read SMT Divergence strictly as a secondary confluence filter at a Higher Timeframe key zone.',
      'Understand why relative strength/weakness between peers helps select the cleaner instrument to trade.',
    ],
    keyPoints: [
      'Bullish SMT: Asset A sweeps a lower low into support while correlated Asset B holds a Higher Low (showing relative strength).',
      'Bearish SMT: Asset A sweeps a higher high into resistance while Asset B prints a Lower High (showing relative weakness).',
      'SMT Divergence alone is NOT an entry signal—pair it with HTF location, sweep, and MSS.',
    ],
    limitationsNote:
      'Correlations can decouple temporarily due to asset-specific news (e.g., UK inflation moving GBP independently of EUR)—SMT is a confluence tool, not a guarantee.',
    practicalExample:
      'At 9:45 PM PHT (NY Open), SPX500 dips below its London low into Daily demand while NAS100 holds a Higher Low (Bullish SMT); NAS100 then leads the bullish reversal.',
    prerequisiteCodes: ['9.4'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'confluence-a-plus-setups',
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'At a key support zone, EUR/USD prints a slight Lower Low while correlated GBP/USD holds a Higher Low. What does this Bullish SMT Divergence suggest?',
      options: [
        'A guaranteed 500-pip rally with zero risk.',
        'A secondary confluence clue of relative strength/accumulation—worth watching for a confirmed bullish MSS.',
        'That EUR/USD and GBP/USD are no longer currencies.',
        'That you should immediately buy both pairs with 10% risk.',
      ],
      correctIndex: 1,
      rationale: 'SMT highlights subtle relative strength/weakness between correlated peers, best used as supporting confluence alongside structure.',
      commonTrap: 'Using SMT Divergence on random non-correlated pairs or ignoring country-specific news releases causing temporary divergence.',
    },
  },
  {
    code: '9.6',
    slug: 'judas-swing',
    title: 'Judas Swing',
    level: 4,
    overviewEn:
      'The "Judas Swing" is an analytical session pattern describing an initial false directional push near the London or New York open that sweeps short-term liquidity before the true session move unfolds.',
    overviewTaglish:
      'Ang "Judas Swing" ay isang session pattern kung saan may paunang maling galaw pagbukas ng London o New York session para kumuha ng liquidity bago magsimula ang tunay na direksyon ng araw.',
    objectives: [
      'Track session opening windows in PHT (UTC+8): London open (~3:00–4:00 PM PHT) and NY open (~8:30–9:30 PM PHT).',
      'Avoid chasing the very first 15-minute opening spike blindly.',
      'Wait for the initial fakeout sweep to resolve with a clear MSS before committing capital.',
    ],
    keyPoints: [
      'During the first 15–45 minutes of major opens, overlapping overnight orders often cause sharp whipsaws.',
      'In a bullish daily bias, a Judas Swing dips downward into Discount/Asian low first, trapping early shorts before rallying.',
      'Not every session prints a Judas Swing—on strong news days, the initial open push can simply trend straight away.',
    ],
    limitationsNote:
      'Judas Swing is a recurring session-behavior heuristic—never automatically fade every market open without confirmation and a hard Stop Loss.',
    practicalExample:
      'With Daily bias bullish on GBP/USD, London opens at 3:00 PM PHT with a sharp 18-pip drop below the Asian low, immediately reclaims it, shifts 5m bullish, and trends up for 60 pips.',
    prerequisiteCodes: ['9.5'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'forex-sessions-killzones',
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'What practical habit does studying the "Judas Swing" session framework encourage?',
      options: [
        'Automatically fading every market open without a Stop Loss.',
        'Resisting the urge to chase the first chaotic opening spike and waiting for liquidity sweep + structural confirmation.',
        'Trading exclusively during the 5:00 AM PHT rollover.',
        'Ignoring Higher Timeframe daily bias.',
      ],
      correctIndex: 1,
      rationale: 'Patience through the initial opening whipsaw avoids getting trapped on the wrong side of volatile session transitions.',
      commonTrap: 'Assuming every single London or NY open MUST reverse—strong macro catalysts often produce immediate trend days.',
    },
  },
  {
    code: '9.7',
    slug: 'power-of-three-amd',
    title: 'Power of Three (AMD)',
    level: 4,
    overviewEn:
      'Power of Three—AMD (Accumulation, Manipulation, Distribution)—frames a single Daily candle (or session cycle) into three phases: tight range build-up, brief false excursion, and directional expansion.',
    overviewTaglish:
      'Hinahati ng Power of Three — AMD (Accumulation, Manipulation, Distribution) — ang galaw ng isang araw sa tatlong yugto: tahimik na range, mabilis na false move, at malakas na direksyonal na paglawak.',
    objectives: [
      'Map the three AMD phases directly onto the OHLC anatomy of a Daily candlestick.',
      'Connect Accumulation (Asia range), Manipulation (London/NY sweep), and Distribution (main trend leg) in PHT.',
      'Use AMD strictly as a contextual road map—not a rigid schedule that must happen identically every day.',
    ],
    keyPoints: [
      'On a bullish Daily candle: Open → dip below Open (forming lower wick = Manipulation) → rally toward High (Distribution) → Close.',
      'Recognizing the Accumulation range (e.g., tight Asian session) tells you where obvious stops rest heading into London/NY.',
      'If Manipulation never reverses and breaks strongly with news, adapt—do not force an AMD script onto a trend day.',
    ],
    limitationsNote:
      'AMD (Accumulation, Manipulation, Distribution) is an analytical framing of daily OHLC expansion—not a guarantee that every session follows a neat 3-step sequence.',
    practicalExample:
      'Asian session consolidates EUR/USD inside a 22-pip box (Accumulation); London sweeps 10 pips under the box (Manipulation) into 4H demand, then expands +65 pips upward through NY (Distribution).',
    prerequisiteCodes: ['9.6'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'forex-sessions-killzones',
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'On a textbook bullish Daily candle framed by Power of Three (AMD), which part of the candle corresponds to the "Manipulation" phase?',
      options: [
        'The lower wick formed by an initial dip below the Daily open before expanding upward.',
        'The final closing tick at 5:00 AM PHT.',
        'The upper half of the green body.',
        'Only the previous week’s high.',
      ],
      correctIndex: 0,
      rationale: 'An initial dip below the opening price forms the lower wick (sweeping short-term lows) before the main upward expansion unfolds.',
      commonTrap: 'Forcing AMD expectations on choppy consolidation days where Distribution never arrives.',
    },
  },
  {
    code: '9.8',
    slug: 'optimal-trade-entry-ote',
    title: 'Optimal Trade Entry (OTE)',
    level: 4,
    overviewEn:
      'OTE (Optimal Trade Entry) highlights the deep retracement pocket between 61.8% and 78.6% (centered near 70.5%) of a displacement leg—combining favorable Discount/Premium pricing with tight invalidation.',
    overviewTaglish:
      'Tinutukoy ng OTE (Optimal Trade Entry) ang malalim na pullback zone sa pagitan ng 61.8% at 78.6% (gitna sa 70.5%) ng displacement leg para sa mas magandang Risk-to-Reward.',
    objectives: [
      'Anchor OTE retracement levels cleanly from the origin to the extreme of a BOS/MSS displacement leg.',
      'Look for an Order Block or Fair Value Gap overlapping the 61.8%–78.6% OTE pocket.',
      'Accept that fast trends may bounce at 38.2%–50% and miss OTE—never chase if missed.',
    ],
    keyPoints: [
      'OTE sits firmly inside Discount (for Longs) or Premium (for Shorts), naturally elevating RR (Risk-to-Reward Ratio).',
      'Invalidation sits neatly beyond the 100% origin swing—giving clear, objective Stop Loss placement.',
      'Confluence matters: an OTE pocket overlapping a fresh FVG and prior structure beats a bare Fibonacci line.',
    ],
    limitationsNote:
      'OTE is a retracement-zone heuristic—price is never obligated to reverse at 70.5%, so always respect the 100% invalidation Stop Loss.',
    practicalExample:
      'After a 1H Bullish MSS from 1.0800 to 1.0860, price retraces into the 61.8%–78.6% OTE pocket (1.0813–1.0823) overlapping a fresh FVG, offering a tight stop below 1.0800.',
    prerequisiteCodes: ['9.7'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'confluence-a-plus-setups',
    diagramKind: 'support_demand',
    quiz: {
      prompt: 'Which Fibonacci retracement pocket defines the classic OTE (Optimal Trade Entry) zone?',
      options: [
        '10% to 23.6%',
        '61.8% to 78.6% (centered near 70.5%)',
        '100% to 127.2%',
        '0% to 15%',
      ],
      correctIndex: 1,
      rationale: 'The 61.8%–78.6% deep Discount/Premium pocket balances strong entry pricing with clear invalidation beyond the 100% swing origin.',
      commonTrap: 'Entering OTE blindly against a dominant Higher Timeframe trend without checking nearby obstacles.',
    },
  },
  {
    code: '9.9',
    slug: 'confluence-building',
    title: 'Confluence Building',
    level: 4,
    overviewEn:
      'Confluence Building stacks independent, non-redundant clues—HTF bias, key location, liquidity sweep, structural shift, imbalance, and active session—into a concise A+ setup checklist.',
    overviewTaglish:
      'Pinagsasama ng Confluence Building ang mga magkakaibang patunay—HTF bias, key zone, liquidity sweep, MSS, imbalance, at tamang session—para makapili lang ng A+ setups.',
    objectives: [
      'Combine 4–5 distinct pillars (Bias, Location, Timing, Trigger, Risk-Reward) rather than duplicating similar signals.',
      'Grade setups objectively (A+, B, Pass) before entering so selectivity rises naturally.',
      'Prevent "over-confluence paralysis" where 15 rigid conditions leave zero tradable setups.',
    ],
    keyPoints: [
      'True confluence uses independent factors: e.g., Daily uptrend + Discount OB + London sweep + 15m MSS + ≥ 1:2 RR.',
      'Quality beats quantity—two clean A+ confluence trades per week outperform twenty random B-grade clicks.',
      'Log which confluence factors actually correlate with your winning trades in your journal.',
    ],
    limitationsNote:
      'Even a 5-factor A+ confluence trade can hit Stop Loss—confluence improves probability over large samples, never certainty on one trade.',
    practicalExample:
      'A trader checks 5 boxes: (1) Daily bullish, (2) price in Discount 4H FVG, (3) NY open session, (4) 5m SSL sweep + Bullish MSS, (5) 1:2.5 RR with 1% risk—all 5 pass, trade executed.',
    prerequisiteCodes: ['9.8'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'confluence-a-plus-setups',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'Which combination represents genuine, non-redundant Confluence?',
      options: [
        'RSI, Stochastic, and CCI all showing oversold on a 1-minute chart.',
        'Higher Timeframe trend alignment + Discount demand zone + active session liquidity sweep + Lower Timeframe MSS + valid 1:2.5 RR.',
        'Five different moving averages stacked on top of each other.',
        'Three Telegram groups posting the exact same signal.',
      ],
      correctIndex: 1,
      rationale: 'Each factor adds an independent dimension—bias, location, timing, trigger, and risk profile—rather than repeating the same math.',
      commonTrap: 'Assuming an A+ confluence setup cannot lose and therefore doubling or tripling your risk per trade.',
    },
  },
  {
    code: '9.10',
    slug: 'advanced-multi-timeframe-analysis',
    title: 'Advanced Multi-Timeframe Analysis',
    level: 4,
    overviewEn:
      'Advanced Multi-Timeframe Analysis integrates Weekly/Daily narrative, 4H/1H Dealing Ranges, and 15m/5m execution models into a unified end-to-end trading workflow.',
    overviewTaglish:
      'Pinagsasama ng Advanced Multi-Timeframe Analysis ang Weekly/Daily narrative, 4H/1H Dealing Ranges, at 15m/5m execution models sa iisang maayos at sistematikong daloy.',
    objectives: [
      'Execute a complete top-down routine from Weekly/Daily key liquidity down to 15m/5m confirmation.',
      'Maintain strict timeframe discipline—never downgrade a 4H Stop Loss to a 1m micro-stop that gets wicked out.',
      'Translate multi-timeframe analysis into a written daily bias card before every session.',
    ],
    keyPoints: [
      'Step 1 (Daily/4H): Mark Dealing Range, external BSL/SSL, and bias. Step 2 (1H/15m): Mark Discount/Premium POIs. Step 3 (5m): Wait for sweep + MSS inside the POI.',
      'Stop refining once Risk-to-Reward already reaches 1:2 to 1:3—over-refining down to 15-second charts causes missed entries and spread stop-outs.',
      'Your daily bias is a flexible hypothesis: if Daily invalidation breaks, adapt objectively instead of fighting the tape.',
    ],
    limitationsNote:
      'Advanced multi-timeframe frameworks organize complexity cleanly, yet every market remains probabilistic—pair this entire module with your Level 1 Risk & Psychology rules.',
    practicalExample:
      'Before 8:00 PM PHT, a trader writes a 3-line plan: "Daily bullish toward 1.0950 BSL; 1H Discount FVG at 1.0870–1.0880; alert set for 5m SSL sweep + Bullish MSS; max 1% risk."',
    prerequisiteCodes: ['9.9'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'multi-timeframe-alignment',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'What is a common danger of over-refining entries from a Daily setup all the way down to a 15-second chart?',
      options: [
        'Spreads and random micro-noise cause frequent avoidable stop-outs and missed valid Higher Timeframe moves.',
        'Daily charts stop updating when you open a 15-second chart.',
        'It makes Risk-to-Reward worse than 1:1 automatically.',
        'Exchanges prohibit multi-timeframe analysis.',
      ],
      correctIndex: 0,
      rationale: 'Stopping refinement at a clean execution timeframe (such as 15m or 5m) balances tight risk-reward with practical fill reliability.',
      commonTrap: 'Changing your entire Daily narrative every 10 minutes whenever a 1-minute candle flickers red or green.',
    },
  },
];

export const ADVANCED_LESSONS: DecoupledLessonNode[] =
  ADVANCED_SEEDS.map(buildAdvancedNode);
