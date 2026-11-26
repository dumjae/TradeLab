import type {
  ExplanationStyle,
  ExplanationStyleMeta,
  Lesson,
} from '../types/academy';
import type { LessonResourceWithDetails } from '../types/visual-learning';

export const EXPLANATION_STYLE_LIST: ExplanationStyleMeta[] = [
  {
    id: 'beginner_friendly',
    label: 'Beginner-Friendly',
    shortLabel: 'Beginner',
    description: 'Plain everyday language with zero intimidating jargon.',
  },
  {
    id: 'step_by_step_visual',
    label: 'Step-by-Step Visual',
    shortLabel: 'Step-by-Step',
    description: 'Numbered visual checklist of what to spot on the chart first.',
  },
  {
    id: 'real_chart_example',
    label: 'Real Chart Example',
    shortLabel: 'Chart Example',
    description: 'Concrete price levels and candle behavior from our scenario charts.',
  },
  {
    id: 'analogy_based',
    label: 'Analogy-Based',
    shortLabel: 'Analogy',
    description: 'Memorable real-world comparison that locks in the mechanics.',
  },
  {
    id: 'comparison',
    label: 'Side-by-Side Comparison',
    shortLabel: 'Comparison',
    description: 'Contrasts this setup directly against what beginners confuse it with.',
  },
  {
    id: 'common_mistakes',
    label: 'Common Mistakes',
    shortLabel: 'Mistakes',
    description: 'Top execution traps and how disciplined traders avoid them.',
  },
];

export const EXPLANATION_STYLE_MAP: Record<
  ExplanationStyle,
  ExplanationStyleMeta
> = Object.fromEntries(
  EXPLANATION_STYLE_LIST.map((item) => [item.id, item]),
) as Record<ExplanationStyle, ExplanationStyleMeta>;

export const CURRICULUM_LESSONS: Lesson[] = [
  // =========================================================================
  // LESSON 1: Market Structure Basics
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000001',
    slug: 'market-structure',
    title: 'Market Structure Basics (HH/HL, LH/LL & BOS)',
    subtitle:
      'Read trend direction objectively using swing points and confirmed candle-body Breaks of Structure.',
    level: 'beginner',
    moduleOrder: 1,
    conceptKey: 'market-structure',
    estimatedMinutes: 15,
    learningObjectives: [
      'Identify valid Swing Highs and Swing Lows on any candlestick timeframe.',
      'Distinguish Bullish Structure (HH/HL), Bearish Structure (LH/LL), and Ranging Conditions.',
      'Confirm a genuine Break of Structure (BOS) using candle body closes rather than wicks.',
      'Locate the protected swing point that invalidates your directional bias.',
    ],
    prerequisites: [
      'Ability to read open, high, low, and close (OHLC) on a standard candlestick.',
    ],
    terminology: [
      {
        term: 'Higher High / Higher Low',
        shortCode: 'HH / HL',
        definition:
          'Ascending swing peaks and pullbacks that define a healthy bullish trend.',
        example:
          'EUR/USD rallies to 1.0844, pulls back to 1.0816 (HL), then climbs to 1.0878 (HH).',
      },
      {
        term: 'Lower High / Lower Low',
        shortCode: 'LH / LL',
        definition:
          'Descending swing peaks and troughs that confirm sellers control market direction.',
        example:
          'Price bounces to 2340, fails below prior resistance, then breaks below 2332.',
      },
      {
        term: 'Break of Structure',
        shortCode: 'BOS',
        definition:
          'A decisive candle-body close beyond the prior structural swing in the direction of the trend.',
        example:
          'A 15-minute bullish candle closes cleanly at 1.0847 above the 1.0844 swing high.',
      },
      {
        term: 'Protected Swing',
        shortCode: 'Invalidation',
        definition:
          'The most recent Higher Low (in an uptrend) or Lower High (in a downtrend) that originated the BOS.',
        example:
          'While EUR/USD holds above HL1 (1.0816), bullish structure remains intact.',
      },
    ],
    sections: [
      {
        id: 'ms-sec-1',
        heading: 'Why Market Structure Comes Before Every Indicator',
        body: 'Market structure is the raw footprint of institutional order flow. Before drawing channels or adding oscillators, professional traders read the sequence of swing highs and swing lows to answer one foundational question: are buyers or sellers making progress?',
        bulletPoints: [
          'Bullish structure prints Higher Highs (HH) and Higher Lows (HL).',
          'Bearish structure prints Lower Highs (LH) and Lower Lows (LL).',
          'Sideways consolidation alternates within equal boundaries with no confirmed BOS.',
        ],
        keyTakeaway:
          'Structure gives you objective directional bias so you stop guessing tops and bottoms.',
      },
      {
        id: 'ms-sec-2',
        heading: 'Body Close vs. Wick: Confirming a Real BOS',
        body: 'Not every spike past an old high represents a true Break of Structure. A wick that pokes above resistance and closes back underneath often signals a liquidity sweep rather than trend continuation.',
        bulletPoints: [
          'Require a full candle body close beyond the previous structural swing to mark a valid BOS.',
          'Strong BOS candles typically show expanded body range and clear follow-through.',
          'Once a BOS prints, immediately update your protected swing low (uptrend) or high (downtrend).',
        ],
        keyTakeaway:
          'Candle closes confirm commitment; thin wicks alone only confirm price tested an area.',
      },
      {
        id: 'ms-sec-3',
        heading: 'Mapping Protected Swings for Trade Invalidation',
        body: 'Every Higher Low that launches a confirmed BOS becomes a structural floor. As long as price respects that protected Higher Low, pullbacks represent potential continuation opportunities rather than reversals.',
        bulletPoints: [
          'Never mark every tiny 2-candle ripple as major structure—focus on swings that caused an impulsive move.',
          'If price closes decisively below the protected Higher Low, bullish structure shifts bearish (Change of Character / MSS).',
        ],
        keyTakeaway:
          'Your protected swing tells you exactly where your directional bias is objectively wrong.',
      },
    ],
    diagramConfig: {
      kind: 'market_structure',
      title: 'Bullish Market Structure Map (HH / HL & BOS)',
      subtitle: 'Step-stair progression of protected lows and body-close breaks',
      caption:
        'Each Higher Low launches an impulsive leg that closes above the prior Swing High (BOS), advancing the bullish trend.',
      legend: [
        { label: 'Impulsive Expansion Leg', colorToken: '#10b981' },
        { label: 'Controlled Retracement', colorToken: '#64748b' },
        { label: 'Confirmed BOS Level', colorToken: '#38bdf8' },
      ],
      annotations: [
        { id: 'a1', label: 'SH1', sublabel: 'Initial Swing High', tone: 'neutral' },
        { id: 'a2', label: 'HL1', sublabel: 'Protected Higher Low', tone: 'bullish' },
        { id: 'a3', label: 'BOS #1', sublabel: 'Body Close Above SH1', tone: 'bullish' },
        { id: 'a4', label: 'HL2 → BOS #2', sublabel: 'Trend Continuation', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Locate the first clear Swing High (SH1) and the pullback low (HL1).',
        'Wait for a bullish candle body to close decisively above SH1 to confirm BOS #1.',
        'Lock HL1 as your structural invalidation floor and look for the next HL2 pullback.',
      ],
    },
    chartScenarioIds: ['ms-bullish-bos'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Think of Market Structure Like Climbing Stairs',
        summary:
          'An uptrend climbs higher steps (Higher Highs) and rests on higher landings (Higher Lows). As long as price never drops below the previous landing, buyers remain in charge.',
        steps: [
          'Find the highest peak price recently reached.',
          'Watch where price pauses when it pulls back—that landing is your Higher Low.',
          'Wait for a candle to close firmly above the prior peak to confirm the next step up.',
        ],
        keyTakeaway:
          'Trade with the staircase direction until a candle closes below the latest landing.',
        practiceSafeHint:
          'Check whether each new pullback stays above the previous low and whether candles close beyond prior peaks.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Step Structure Mapping Checklist',
        summary:
          'Follow this exact sequence every time you open a fresh chart before considering any setup.',
        steps: [
          'Zoom out to see the last 30–50 candles cleanly.',
          'Mark the most obvious Swing High and Swing Low that produced strong impulses.',
          'Draw a dashed horizontal ray across the prior Swing High to watch for a body-close BOS.',
          'Once a candle body closes above it, highlight the low that started that leg as your Protected HL.',
        ],
        keyTakeaway:
          'Consistent mapping removes guesswork and aligns you with active order flow.',
        practiceSafeHint:
          'Trace the most recent confirmed swing high and verify whether a candle body closed above it.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'EUR/USD 15m Bullish BOS Progression',
        summary:
          'In our EUR/USD 15m scenario, price establishes SH1 at 1.0844, forms HL1 at 1.0816, and prints BOS #1 with a body close at 1.0847.',
        steps: [
          'Initial impulse reaches 1.0844 before cooling off.',
          'Pullback holds 1.0816—well above the 1.0798 session low—confirming HL1.',
          'Candle 14 closes cleanly at 1.0847 (above 1.0844), launching the rally to 1.0878 and BOS #2.',
        ],
        keyTakeaway:
          'Notice how both BOS candles close with strong bodies rather than tentative wicks.',
        practiceSafeHint:
          'Compare the closing price of the breakout candle against the exact horizontal price of the previous swing.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Ocean Waves Coming In During High Tide',
        summary:
          'During an incoming tide, every wave pushes slightly farther up the beach (Higher High) and retreats less than the wave before it (Higher Low).',
        steps: [
          'Individual waves pull back temporarily—just like healthy market retracements.',
          'The tide direction (structure) stays bullish until waves fail to reach higher sand and break past prior low-water marks.',
        ],
        keyTakeaway:
          'Do not confuse a normal receding wave (pullback) with a change in tide (structure shift).',
        practiceSafeHint:
          'Ask yourself: is this move just a normal pullback within the tide, or did it break the last protected landing?',
      },
      comparison: {
        style: 'comparison',
        headline: 'Valid BOS vs. Wick Liquidity Sweep',
        summary:
          'Both moves poke past an old swing high, yet they tell opposite stories depending on how the candle closes.',
        steps: [
          'Valid BOS: Full candle body closes cleanly above the prior high with strong follow-through.',
          'Liquidity Sweep: Thin wick stabs above the high and snaps closed back inside the old range.',
          'Action: A BOS favors pullback continuations; a sweep warns of possible reversal.',
        ],
        keyTakeaway:
          'Never mark a BOS until the candle actually closes past the swing level.',
        practiceSafeHint:
          'Look strictly at the candle body close relative to the dashed horizontal swing level.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: 'Top 3 Market Structure Mistakes Beginners Make',
        summary:
          'Most structural confusion comes from zooming in too far or treating single-candle wicks as trend reversals.',
        steps: [
          'Mistake 1: Marking every tiny 1-candle pullback as major structure (causes constant whipsaws).',
          'Mistake 2: Calling a BOS mid-candle before the close completes.',
          'Mistake 3: Fighting a clear HH/HL uptrend by shorting just because price "looks high."',
        ],
        keyTakeaway:
          'Zoom out, require candle-body closes, and respect the trend until structure genuinely breaks.',
        practiceSafeHint:
          'Focus only on prominent swings that launched impulsive legs, not minor internal noise.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ms-1',
        lessonSlug: 'market-structure',
        conceptKey: 'market-structure',
        scenarioId: 'ms-bullish-bos',
        prompt:
          'In the EUR/USD 15m chart, what confirms a valid Bullish Break of Structure (BOS #1) at 1.0844?',
        options: [
          { id: 'a', label: 'A brief upper wick touching 1.0846 that closes back at 1.0839' },
          { id: 'b', label: 'A decisive bullish candle body closing above 1.0844 (at 1.0847)' },
          { id: 'c', label: 'Three small doji candles pausing underneath 1.0844' },
          { id: 'd', label: 'Price touching 1.0816 twice without moving higher' },
        ],
        correctOptionId: 'b',
        hints: [
          'Recall how professional traders filter out false pokes past a swing high.',
          'Compare the difference between a wick high and a candle closing price.',
        ],
        postSubmissionRationale:
          'A valid BOS requires a candle body close beyond the prior structural swing (1.0844 → close at 1.0847), confirming institutional acceptance above resistance.',
        commonTrapNote:
          'Marking a BOS on a wick alone often traps learners into buying right at the top of a liquidity sweep.',
      },
      {
        id: 'pq-ms-2',
        lessonSlug: 'market-structure',
        conceptKey: 'market-structure',
        prompt:
          'During an established bullish trend (HH/HL), which price point serves as the structural invalidation level?',
        options: [
          { id: 'a', label: 'The most recent Higher Low that launched the latest BOS' },
          { id: 'b', label: 'The midpoint of the current forming candle' },
          { id: 'c', label: 'Any round psychological number below current price' },
          { id: 'd', label: 'The very first candle of the trading week' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about which swing point actually caused the trend to make a new Higher High.',
          'Which landing must remain unbroken for the upward staircase to stay intact?',
        ],
        postSubmissionRationale:
          'The protected Higher Low that originated the most recent BOS defines trend integrity. A decisive close below it signals a structural shift.',
        commonTrapNote:
          'Arbitrary fixed-pip stops ignore actual market structure and get tagged during normal pullbacks.',
      },
      {
        id: 'pq-ms-3',
        lessonSlug: 'market-structure',
        conceptKey: 'market-structure',
        prompt:
          'Price prints Lower Highs and Lower Lows across the last 25 candles, then pulls back mildly without closing above the prior Lower High. What is the active structure?',
        options: [
          { id: 'a', label: 'Confirmed bullish reversal' },
          { id: 'b', label: 'Bearish structure remains intact (pullback phase)' },
          { id: 'c', label: 'Invalid chart — no structure exists' },
          { id: 'd', label: 'Guaranteed double bottom' },
        ],
        correctOptionId: 'b',
        hints: [
          'Did price actually close beyond the protected Lower High?',
          'Remember the ocean-wave analogy: temporary retracements do not reverse the tide.',
        ],
        postSubmissionRationale:
          'Until price closes decisively above the protected Lower High, the move upward is simply a retracement inside bearish market structure.',
        commonTrapNote:
          'Calling a reversal on the first green pullback candle is a classic counter-trend mistake.',
      },
      {
        id: 'pq-ms-4',
        lessonSlug: 'market-structure',
        conceptKey: 'market-structure',
        prompt:
          'Why should traders avoid labeling every single tiny 1-candle pause as a major structural swing?',
        options: [
          { id: 'a', label: 'Because candlesticks do not work on lower timeframes' },
          { id: 'b', label: 'Because internal noise creates false BOS signals and frequent whipsaws' },
          { id: 'c', label: 'Because only weekly charts have Breaks of Structure' },
          { id: 'd', label: 'Because swing highs only matter during news releases' },
        ],
        correctOptionId: 'b',
        hints: [
          'Consider what happens if you flip your bias every two candles.',
          'Focus on swings that actually produced meaningful displacement.',
        ],
        postSubmissionRationale:
          'Major structural swings are the turning points that drive genuine expansion legs. Labeling tiny internal candles leads to overtrading and whipsaws.',
        commonTrapNote:
          'Zooming in too tightly hides the higher-timeframe staircase that controls institutional order flow.',
      },
    ],
  },

  // =========================================================================
  // LESSON 2: Understanding Market Liquidity
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000002',
    slug: 'market-liquidity',
    title: 'Understanding Market Liquidity (Buy-Side & Sell-Side)',
    subtitle:
      'See where stop-losses and breakout orders cluster so you understand why price gravitates toward key highs and lows.',
    level: 'beginner',
    moduleOrder: 2,
    conceptKey: 'market-liquidity',
    estimatedMinutes: 16,
    learningObjectives: [
      'Explain why large market participants require resting liquidity to fill size without extreme slippage.',
      'Locate Buy-Side Liquidity (BSL) resting above obvious highs and Sell-Side Liquidity (SSL) below obvious lows.',
      'Understand how price rotates from one liquidity pool to the opposing pool.',
    ],
    prerequisites: [
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
    ],
    terminology: [
      {
        term: 'Liquidity',
        shortCode: 'LIQ',
        definition:
          'Concentrated resting market orders (stop-losses and breakout stops) that allow large positions to execute cleanly.',
        example:
          'Hundreds of short stop-losses stacked 5–10 pips above a multi-touch session high.',
      },
      {
        term: 'Buy-Side Liquidity',
        shortCode: 'BSL',
        definition:
          'Buy-stop orders resting above swing highs—composed of short sellers’ stop-losses and breakout buyers’ entries.',
        example:
          'Buy stops sitting above XAU/USD 2348.5 range resistance.',
      },
      {
        term: 'Sell-Side Liquidity',
        shortCode: 'SSL',
        definition:
          'Sell-stop orders resting below swing lows—composed of long traders’ stop-losses and breakdown sellers’ entries.',
        example:
          'Sell stops clustered beneath XAU/USD 2324.0 range support.',
      },
      {
        term: 'Liquidity Draw',
        shortCode: 'DOL',
        definition:
          'The opposing pool of resting orders that price naturally gravitates toward once one side has been cleared.',
        example:
          'After sweeping BSL above 2348.5, Gold rotates cleanly across the range to take SSL at 2324.0.',
      },
    ],
    sections: [
      {
        id: 'liq-sec-1',
        heading: 'What Liquidity Actually Means on a Price Chart',
        body: 'In retail trading, people often think price bounces off lines like a rubber ball. In reality, financial markets are matching engines: for a large institution to sell massive volume at a favorable price, they need a large pool of eager buyers—and those buyers are sitting right above obvious highs as buy-stop orders.',
        bulletPoints: [
          'Every short trader’s stop-loss above resistance is technically a Buy-Stop order.',
          'Every breakout trader’s entry above resistance is also a Buy-Stop order.',
          'Together, they form a dense pocket of Buy-Side Liquidity (BSL).',
        ],
        keyTakeaway:
          'Obvious highs and lows are not magical walls—they are pools of resting orders.',
      },
      {
        id: 'liq-sec-2',
        heading: 'Buy-Side vs. Sell-Side Liquidity',
        body: 'Mapping liquidity is straightforward once you ask: "If I were a typical retail trader, where would I hide my stop-loss?" Those exact zones highlight where liquidity concentrates.',
        bulletPoints: [
          'Buy-Side Liquidity (BSL) rests above previous day highs, session highs, swing highs, and clean range tops.',
          'Sell-Side Liquidity (SSL) rests below previous day lows, session lows, swing lows, and clean range floors.',
        ],
        keyTakeaway:
          'BSL lives above highs (buy stops); SSL lives below lows (sell stops).',
      },
      {
        id: 'liq-sec-3',
        heading: 'Range Rotation: From Liquidity Pool to Liquidity Pool',
        body: 'Once price taps one side of a range and absorbs the resting stops, the path of least resistance frequently flips toward the opposite untouched pool.',
        bulletPoints: [
          'Watch our XAU/USD 1H chart: repeated bounces between 2348.5 and 2324.0 load both sides with stops.',
          'Price spikes above 2348.5 to harvest BSL, rejects back inside, and delivers directly through SSL at 2324.0.',
        ],
        keyTakeaway:
          'Before entering a trade, identify BOTH the liquidity already taken and the opposing liquidity you are targeting.',
      },
    ],
    diagramConfig: {
      kind: 'liquidity_pools',
      title: 'Buy-Side (BSL) & Sell-Side (SSL) Liquidity Map',
      subtitle: 'How resting stop clusters above highs and below lows fuel price rotation',
      caption:
        'Institutional supply pairs with Buy-Side Liquidity above the range ceiling before driving price toward Sell-Side Liquidity below the floor.',
      legend: [
        { label: 'Buy-Side Liquidity (BSL)', colorToken: '#f59e0b' },
        { label: 'Sell-Side Liquidity (SSL)', colorToken: '#38bdf8' },
        { label: 'Order-Flow Rotation', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'l1', label: 'BSL Pool', sublabel: 'Short Stops + Breakout Buys', tone: 'liquidity' },
        { id: 'l2', label: 'Range Equilibrium', sublabel: 'Mid-Range Chop Zone', tone: 'neutral' },
        { id: 'l3', label: 'SSL Pool', sublabel: 'Long Stops + Breakdown Sells', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Mark clear swing highs (BSL) and swing lows (SSL) bounding the active range.',
        'Avoid entering randomly in the middle of the range where risk-to-reward is poor.',
        'Wait for price to engage one liquidity pool, confirm rejection, and target the opposing pool.',
      ],
    },
    chartScenarioIds: ['liq-bsl-ssl-range'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Liquidity Is Simply Where Everyone Parks Their Stop-Loss',
        summary:
          'Imagine hundreds of traders putting their stop-loss right above the exact same ceiling. Big players know orders are waiting there, so price often visits that ceiling to fill large trades before reversing.',
        steps: [
          'Spot obvious highs where sellers placed stop-losses (Buy-Side Liquidity).',
          'Spot obvious lows where buyers placed stop-losses (Sell-Side Liquidity).',
          'Understand that price loves visiting those pools before making its next big move.',
        ],
        keyTakeaway:
          'Knowing where stops sit helps you stop placing yours in the most predictable spot.',
        practiceSafeHint:
          'Identify which orders rest above resistance (short stops/buy stops) versus below support (long stops/sell stops).',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'How to Map Liquidity in 30 Seconds',
        summary:
          'Add two quick horizontal zones before looking for any entry trigger.',
        steps: [
          'Draw an amber dashed line over prominent swing highs or range ceilings and label it BSL.',
          'Draw a cyan dashed line under prominent swing lows or range floors and label it SSL.',
          'Notice whether price is currently closer to BSL, SSL, or stuck in the messy middle.',
        ],
        keyTakeaway:
          'Always trade away from freshly swept liquidity toward untouched opposing liquidity.',
        practiceSafeHint:
          'Check whether the highlighted level sits above swing highs (BSL) or beneath swing lows (SSL).',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'XAU/USD 1H Rotation from 2348.5 BSL to 2324.0 SSL',
        summary:
          'Gold touched 2348.5 three times and 2324.0 twice, building massive pools on both edges before sweeping 2354.6 and dropping to 2318.6.',
        steps: [
          'Multiple rejections near 2348.5 convinced traders resistance was "unbreakable."',
          'Candle 22 spiked to 2354.6—triggering buy stops—then closed back at 2344.5.',
          'Sellers drove Gold straight through 2324.0 SSL five candles later.',
        ],
        keyTakeaway:
          'The cleanest moves often start right after an obvious boundary gets briefly pierced.',
        practiceSafeHint:
          'Trace what happened immediately after price probed above the multi-touch ceiling.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Wholesale Fruit Market Analogy',
        summary:
          'If a wholesale distributor needs to sell 10,000 crates of mangoes fast, they do not walk down an empty alley—they go to the busiest plaza where buyers are already lined up.',
        steps: [
          'Above a clean swing high is the busiest "buyer plaza" (BSL) on the chart.',
          'Below a clean swing low is the busiest "seller plaza" (SSL) on the chart.',
          'Institutions route price to those crowded plazas to get filled efficiently.',
        ],
        keyTakeaway:
          'Big orders require big counterparties—resting stops provide that counterparty liquidity.',
        practiceSafeHint:
          'Ask yourself which side of the chart holds the crowded counterparty orders needed to fill a large move.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Retail Support/Resistance vs. Institutional Liquidity View',
        summary:
          'The same horizontal line looks completely different depending on whether you view it as a wall or an order pool.',
        steps: [
          'Retail view: "Price bounced here three times, so I will put my stop 2 pips above it."',
          'Institutional view: "Three bounces mean thousands of stops are packed 2 pips above this level."',
          'Smart response: Wait to see if price raids the pool and closes back inside before acting.',
        ],
        keyTakeaway:
          'Treat clean horizontal boundaries as liquidity zones, not razor-thin brick walls.',
        practiceSafeHint:
          'Think about how resting stop orders turn a "safe" boundary into an attractive target.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: 'Common Liquidity Errors That Cost Traders Money',
        summary:
          'Avoid becoming the very liquidity institutions use to enter their positions.',
        steps: [
          'Mistake 1: Parking your stop-loss 1–2 ticks beyond an obvious swing high or low.',
          'Mistake 2: Entering blindly in the dead center of a range with liquidity untouched on both sides.',
          'Mistake 3: Assuming every liquidity grab must reverse immediately without waiting for candle confirmation.',
        ],
        keyTakeaway:
          'Patience at the edges of a range beats frantic trading in the middle.',
        practiceSafeHint:
          'Evaluate whether your stop or entry sits directly inside an obvious retail stop cluster.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-liq-1',
        lessonSlug: 'market-liquidity',
        conceptKey: 'market-liquidity',
        scenarioId: 'liq-bsl-ssl-range',
        prompt:
          'What types of resting orders make up Buy-Side Liquidity (BSL) above 2348.5 on the XAU/USD chart?',
        options: [
          { id: 'a', label: 'Short sellers’ stop-losses and breakout traders’ buy-stop orders' },
          { id: 'b', label: 'Long traders’ stop-losses and panic market sells' },
          { id: 'c', label: 'Only bank limit sell orders below support' },
          { id: 'd', label: 'Zero orders exist above resistance' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about what order type closes a losing short trade when price rises above resistance.',
          'Add what order type a breakout buyer uses to enter above resistance.',
        ],
        postSubmissionRationale:
          'To exit a short position above resistance, a trader must BUY back—so short stop-losses combine with breakout buy-stops to create Buy-Side Liquidity (BSL).',
        commonTrapNote:
          'Beginners often confuse Buy-Side Liquidity with "support." BSL sits ABOVE highs, while SSL sits BELOW lows.',
      },
      {
        id: 'pq-liq-2',
        lessonSlug: 'market-liquidity',
        conceptKey: 'market-liquidity',
        prompt:
          'Why do large institutions frequently execute near major swing highs and swing lows rather than mid-range?',
        options: [
          { id: 'a', label: 'Because charts look cleaner near the edges' },
          { id: 'b', label: 'Because dense resting stop orders allow large size to fill with minimal slippage' },
          { id: 'c', label: 'Because brokers block trades in the middle of a range' },
          { id: 'd', label: 'Because indicators only calculate at swing extremes' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember the wholesale market analogy: where can massive volume find enough counterparties?',
        ],
        postSubmissionRationale:
          'Large orders require deep counterparty volume. Concentrated stop-losses beyond obvious highs and lows supply the immediate liquidity institutions need.',
        commonTrapNote:
          'Thinking markets move randomly ignores the real order-matching mechanics of liquidity pools.',
      },
      {
        id: 'pq-liq-3',
        lessonSlug: 'market-liquidity',
        conceptKey: 'market-liquidity',
        scenarioId: 'liq-bsl-ssl-range',
        prompt:
          'After Gold sweeps BSL above 2348.5 and closes decisively back inside the range, what is the most logical opposing target (Draw on Liquidity)?',
        options: [
          { id: 'a', label: 'Exactly 2348.4 (1 tick below the high)' },
          { id: 'b', label: 'Untouched Sell-Side Liquidity (SSL) resting beneath 2324.0' },
          { id: 'c', label: 'Randomly closing after 2 minutes' },
          { id: 'd', label: 'Re-entering long immediately above 2354.6' },
        ],
        correctOptionId: 'b',
        hints: [
          'Once one side of a range has been harvested, where does the untouched pool of opposing orders sit?',
        ],
        postSubmissionRationale:
          'After clearing Buy-Side Liquidity above 2348.5 and rejecting back inside, opposing Sell-Side Liquidity below 2324.0 becomes the natural institutional target.',
        commonTrapNote:
          'Taking profits too early in mid-range chop destroys asymmetric risk-to-reward.',
      },
      {
        id: 'pq-liq-4',
        lessonSlug: 'market-liquidity',
        conceptKey: 'market-liquidity',
        prompt:
          'Where does Sell-Side Liquidity (SSL) typically accumulate?',
        options: [
          { id: 'a', label: 'Above multi-touch swing highs' },
          { id: 'b', label: 'Below clean swing lows, session lows, and range floors' },
          { id: 'c', label: 'Only at the 200-period moving average' },
          { id: 'd', label: 'In the exact midpoint of every candle' },
        ],
        correctOptionId: 'b',
        hints: [
          'Where do long buyers typically place their protective stop-loss orders?',
        ],
        postSubmissionRationale:
          'Long traders place protective sell-stop orders beneath obvious lows, combining with breakdown sell-stops to form Sell-Side Liquidity (SSL).',
        commonTrapNote:
          'Do not park your long stop right underneath an untouched obvious low without structural confirmation.',
      },
    ],
  },

  // =========================================================================
  // LESSON 3: Equal Highs & Equal Lows (Liquidity Pools)
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000003',
    slug: 'equal-highs-lows',
    title: 'Equal Highs & Equal Lows (Liquidity Pools)',
    subtitle:
      'Recognize why "double tops" and "double bottoms" act as high-probability liquidity magnets rather than guaranteed ceilings.',
    level: 'intermediate',
    moduleOrder: 3,
    conceptKey: 'equal-highs-lows',
    estimatedMinutes: 18,
    learningObjectives: [
      'Spot clean Equal Highs (EQH) and Equal Lows (EQL) across intraday and higher timeframes.',
      'Explain why multiple touches at nearly the same price concentrate stop orders more heavily than a single swing.',
      'Use EQH/EQL either as a target for existing positions or as a watchlist level for sweep reversals.',
    ],
    prerequisites: [
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Understanding Market Liquidity (Buy-Side & Sell-Side)',
    ],
    terminology: [
      {
        term: 'Equal Highs',
        shortCode: 'EQH',
        definition:
          'Two or more consecutive swing highs terminating near the same price level, signaling concentrated Buy-Side Liquidity above.',
        example:
          'NAS100 stalling at 18520.0, 18519.5, and 18518.5 before spiking to 18546.0.',
      },
      {
        term: 'Equal Lows',
        shortCode: 'EQL',
        definition:
          'Two or more consecutive swing lows aligning near the same horizontal price, signaling dense Sell-Side Liquidity below.',
        example:
          'GBP/USD printing twin lows at 1.2640 prior to a sell-side sweep.',
      },
      {
        term: 'Liquidity Magnet',
        shortCode: 'Magnet',
        definition:
          'An untouched cluster of EQH or EQL that attracts price movement before sustained directional expansion.',
        example:
          'Price climbs back to tag Triple EQH at 18520.0 before finally dropping 90 points.',
      },
    ],
    sections: [
      {
        id: 'eqh-sec-1',
        heading: 'Why Textbook Double Tops Become Liquidity Magnets',
        body: 'Traditional charting textbooks teach that two or three rejections at the same level prove "strong resistance." While that looks neat visually, every extra touch invites more retail traders to sell short—and tuck their stop-losses right above that exact line.',
        bulletPoints: [
          'Touch 1 creates a normal swing high.',
          'Touch 2 attracts early double-top sellers and tight stop-losses directly overhead.',
          'Touch 3 creates a crowded pool of resting buy-stops—making a brief stop run above the highs highly attractive for institutional sellers.',
        ],
        keyTakeaway:
          'The cleaner and more "textbook" the Equal Highs look, the stronger the liquidity magnet sitting above them.',
      },
      {
        id: 'eqh-sec-2',
        heading: 'Relative Equal Highs & Lows (No Need for Exact-Pip Perfection)',
        body: 'Equal Highs do not have to match to the exact tenth of a pip. Institutional traders look for "relative" equal highs or lows within a tight tolerance band where retail participants visually perceive a flat ceiling or floor.',
        bulletPoints: [
          'In NAS100, peaks at 18520.0, 18519.5, and 18518.5 function as a single unified EQH pool.',
          'Avoid forcing EQH across completely unrelated price levels far apart in time or structure.',
        ],
        keyTakeaway:
          'Judge EQH/EQL visually as a tight cluster where human traders naturally align stops.',
      },
      {
        id: 'eqh-sec-3',
        heading: 'Two Professional Ways to Trade Around EQH & EQL',
        body: 'Once you mark Equal Highs or Equal Lows, you gain two clear tactical advantages instead of getting stopped out prematurely.',
        bulletPoints: [
          'As a Profit Target: If you are already long in bullish structure, untouched EQH above is an ideal target zone.',
          'As a Reversal Watchlist: Never short blindly right under untouched EQH; wait for price to sweep above the EQH, close back inside, and displace downward.',
        ],
        keyTakeaway:
          'Let the market raid the Equal Highs first—patience turns a crowded trap into a structured edge.',
      },
    ],
    diagramConfig: {
      kind: 'equal_highs_lows',
      title: 'Equal Highs (EQH) Pool Accumulation & Raid',
      subtitle: 'Multiple flat peaks build dense overhead buy-stop clusters',
      caption:
        'Three closely aligned peaks build stacked stop-losses above EQH; a sharp sweep wick absorbs them before bearish displacement breaks structure.',
      legend: [
        { label: 'Equal Highs (EQH) Zone', colorToken: '#f59e0b' },
        { label: 'Sweep Wick Above EQH', colorToken: '#ef4444' },
        { label: 'Bearish Displacement', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'e1', label: 'EQH 1 & 2', sublabel: 'Retail Resistance Perception', tone: 'liquidity' },
        { id: 'e2', label: 'EQH 3', sublabel: 'Peak Stop Density', tone: 'liquidity' },
        { id: 'e3', label: 'Liquidity Raid', sublabel: 'Wick Clears Stops & Closes Inside', tone: 'bearish' },
      ],
      walkthroughSteps: [
        'Spot two or more closely aligned highs (EQH) or lows (EQL).',
        'Mark the resting stop zone immediately beyond the flat boundary.',
        'Wait for a sweep and structure shift before entering opposite the raid.',
      ],
    },
    chartScenarioIds: ['eqh-sweep-reversal'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Equal Highs Are Like a Giant "Stops Parked Here" Sign',
        summary:
          'When price hits the exact same ceiling two or three times, almost everyone puts their stop-loss right above it. Price frequently pops just above that line to clear those stops before dropping.',
        steps: [
          'Look for two or three peaks lined up almost horizontally.',
          'Assume stops are stacked right above those peaks.',
          'Wait for the quick pop above and rejection back inside instead of selling early with a tight stop.',
        ],
        keyTakeaway:
          'Do not park your stop-loss right behind a textbook double top or double bottom.',
        practiceSafeHint:
          'Notice how aligned peaks concentrate resting orders right outside the flat line.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'Visual Checklist for Spotting High-Value EQH/EQL',
        summary:
          'Separate meaningful liquidity pools from random chart squiggles.',
        steps: [
          'Identify at least two clear swing peaks (or troughs) within a narrow horizontal band.',
          'Confirm a visible pullback occurred between each peak so traders had time to place stops.',
          'Mark the line as $$$ EQH (or EQL) and set an alert slightly beyond it.',
          'Wait for price to pierce the line and check the candle close.',
        ],
        keyTakeaway:
          'Alerts just beyond EQH/EQL keep you disciplined until liquidity is actually engaged.',
        practiceSafeHint:
          'Count how many distinct swing touches formed the flat level before price pierced it.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'NAS100 5m Triple Equal Highs Around 18,520',
        summary:
          'NAS100 tapped 18520.0, 18519.5, and 18518.5 before spiking to 18546.0 on candle 20, closing back at 18511.0, and plunging to 18424.0.',
        steps: [
          'Three clean rejections convinced early shorts to place stops at 18525–18535.',
          'Candle 20 ran straight to 18546.0—taking every early stop—and closed back inside.',
          'Bearish displacement broke 18482.0 two candles later, delivering nearly 100 points lower.',
        ],
        keyTakeaway:
          'Early shorts were right about direction but got stopped out before the move began because they ignored EQH liquidity.',
        practiceSafeHint:
          'Compare the timing of the spike above 18520 against the direction of the displacement that followed.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Low-Hanging Piñata Analogy',
        summary:
          'Equal Highs are like a bright piñata hanging just above everyone’s head—price almost always jumps up to whack it open before moving in the real direction.',
        steps: [
          'Each equal touch packs more orders inside the piñata.',
          'Jumping in early risks getting caught in the swing upward.',
          'Waiting for the sweep lets you trade calmly after the crowd has been cleared.',
        ],
        keyTakeaway:
          'Let price hit the liquidity magnet first; then trade the clean aftermath.',
        practiceSafeHint:
          'Ask whether the obvious liquidity pool has already been tapped or is still sitting untouched.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Equal Highs (EQH) vs. Strong Trending Higher Highs (HH)',
        summary:
          'Understanding the visual contrast keeps you aligned with the right strategy.',
        steps: [
          'Equal Highs: Price repeatedly stalls at nearly the same horizontal price—signals liquidity buildup.',
          'Trending Higher Highs: Each new peak closes cleanly above the prior peak with healthy Higher Lows.',
          'Rule: Watch EQH for liquidity raids; trade HH/HL pullbacks for trend continuation.',
        ],
        keyTakeaway:
          'Flat tops signal resting liquidity; stair-stepping tops signal trending momentum.',
        practiceSafeHint:
          'Inspect whether successive peaks are flat/aligned or stair-stepping steadily higher.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: 'Why Traders Lose Money on Double Tops & Bottoms',
        summary:
          'Two opposite mistakes both stem from reacting before the sweep resolves.',
        steps: [
          'Mistake 1: Shorting the 2nd or 3rd touch with a tight stop directly above EQH (prime stop-hunt victim).',
          'Mistake 2: Buying a market order the instant price ticks 1 point above EQH without waiting for the candle close.',
          'Fix: Wait for candle close + displacement to reveal whether EQH was swept or truly broken.',
        ],
        keyTakeaway:
          'Both impatient early shorts and impatient breakout buyers donate liquidity at EQH.',
        practiceSafeHint:
          'Check whether entering before candle close puts you on the wrong side of a sweep wick.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-eqh-1',
        lessonSlug: 'equal-highs-lows',
        conceptKey: 'equal-highs-lows',
        scenarioId: 'eqh-sweep-reversal',
        prompt:
          'In the NAS100 5m scenario, why did the three peaks near 18,520 act as a liquidity magnet?',
        options: [
          { id: 'a', label: 'Because each rejection stacked more short stops and breakout buy orders directly above 18,520' },
          { id: 'b', label: 'Because NAS100 is legally capped at 18,520' },
          { id: 'c', label: 'Because three touches always guarantee zero volatility afterward' },
          { id: 'd', label: 'Because buyers never place orders above resistance' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about where traders who sold touches #1, #2, and #3 placed their protective stops.',
        ],
        postSubmissionRationale:
          'Repeated bounces at nearly the same price concentrate short stop-losses and breakout buy-stops tightly overhead, making a brief raid above 18,520 highly efficient for institutional selling.',
        commonTrapNote:
          'Assuming "triple top = unbreakable wall" invites placing a tight stop exactly where liquidity gets swept.',
      },
      {
        id: 'pq-eqh-2',
        lessonSlug: 'equal-highs-lows',
        conceptKey: 'equal-highs-lows',
        prompt:
          'Do Equal Highs or Equal Lows need to match to the exact last decimal pip to qualify as a liquidity pool?',
        options: [
          { id: 'a', label: 'Yes—even a 0.5-pip difference completely invalidates the pool' },
          { id: 'b', label: 'No—relative equal highs/lows within a tight visual band still concentrate stops' },
          { id: 'c', label: 'Only on monthly charts' },
          { id: 'd', label: 'Only when volume is zero' },
        ],
        correctOptionId: 'b',
        hints: [
          'Consider how human traders visually draw horizontal lines on a chart.',
        ],
        postSubmissionRationale:
          'Relative Equal Highs (like 18520.0, 18519.5, and 18518.5) look flat to human traders, so stops cluster tightly above the whole zone regardless of tiny fractional differences.',
        commonTrapNote:
          'Demanding exact-pip perfection causes you to miss obvious real-world liquidity pools.',
      },
      {
        id: 'pq-eqh-3',
        lessonSlug: 'equal-highs-lows',
        conceptKey: 'equal-highs-lows',
        prompt:
          'You are already in a profitable bullish trade and spot untouched Equal Highs directly ahead. How should you view them?',
        options: [
          { id: 'a', label: 'As a logical profit-taking target / draw on liquidity' },
          { id: 'b', label: 'As a reason to remove your stop-loss completely' },
          { id: 'c', label: 'As proof that the market is closed' },
          { id: 'd', label: 'As a reason to double your leverage right below resistance' },
        ],
        correctOptionId: 'a',
        hints: [
          'If resting orders act like a magnet for price, how does that help an existing trade heading toward them?',
        ],
        postSubmissionRationale:
          'Untouched Equal Highs draw price upward to clear resting buy-stops, making the zone just above EQH an ideal target for long positions.',
        commonTrapNote:
          'Reversing into a blind short before EQH is swept fights the active draw on liquidity.',
      },
      {
        id: 'pq-eqh-4',
        lessonSlug: 'equal-highs-lows',
        conceptKey: 'equal-highs-lows',
        prompt:
          'What is the highest-probability risk when shorting right underneath untouched Equal Highs with a tight stop?',
        options: [
          { id: 'a', label: 'Getting stopped out by a quick sweep wick moments before the real drop begins' },
          { id: 'b', label: 'Price moving straight to zero in one second' },
          { id: 'c', label: 'Your broker converting your short into a long automatically' },
          { id: 'd', label: 'Zero risk exists because double tops never fail' },
        ],
        correctOptionId: 'a',
        hints: [
          'Look at what happened on candle 20 of the NAS100 scenario before the 90-point drop.',
        ],
        postSubmissionRationale:
          'Shorting early with a tight stop above untouched EQH places your stop right inside the liquidity pool that institutions sweep before driving price down.',
        commonTrapNote:
          'Being right on direction but early on timing still produces a stop-loss.',
      },
    ],
  },

  // =========================================================================
  // LESSON 4 (FLAGSHIP): Liquidity Sweeps vs. True Breakouts
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000004',
    slug: 'liquidity-sweeps',
    title: 'Liquidity Sweeps vs. True Breakouts',
    subtitle:
      'Flagship Lesson: Master candle-close rejection, displacement, and retest acceptance so you stop getting trapped on false breakouts.',
    level: 'intermediate',
    moduleOrder: 4,
    conceptKey: 'liquidity-sweeps',
    estimatedMinutes: 22,
    learningObjectives: [
      'Define the exact 3-part anatomy of a valid Liquidity Sweep (Pool → Spike & Close Back Inside → Opposite Displacement).',
      'Distinguish a Liquidity Sweep from a True Breakout using candle body closes, volume expansion, and retest acceptance.',
      'Identify both Buy-Side Liquidity (BSL) Sweeps and Sell-Side Liquidity (SSL) Sweeps on historical charts.',
      'Build a patient execution checklist that prevents FOMO mid-candle entries and blind counter-trend fading.',
    ],
    prerequisites: [
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Understanding Market Liquidity (Buy-Side & Sell-Side)',
      'Equal Highs & Equal Lows (Liquidity Pools)',
    ],
    terminology: [
      {
        term: 'Liquidity Sweep',
        shortCode: 'Sweep / Stop Run',
        definition:
          'A sharp price spike beyond a key swing high/low that absorbs resting stop orders and quickly closes back inside the prior range, followed by opposite displacement.',
        example:
          'EUR/USD wicks to 1.0882 above Equal Highs at 1.0865, closes back at 1.0859, and breaks 1.0846 lower.',
      },
      {
        term: 'True Breakout',
        shortCode: 'Acceptance',
        definition:
          'A decisive full-bodied candle close beyond resistance or support with sustained follow-through and held retests outside the old range.',
        example:
          'BTC/USD closes full-bodied at 65,820 above 65,400 resistance and holds 65,425 on retest before rallying to 67,050.',
      },
      {
        term: 'Displacement',
        shortCode: 'Impulse',
        definition:
          'Fast, energetic, full-bodied candles moving decisively in the opposite direction immediately after a sweep—proving institutional commitment.',
        example:
          'Two consecutive wide-body bearish candles slicing straight through 1.0846 after the 1.0882 sweep.',
      },
      {
        term: 'Market Structure Shift',
        shortCode: 'MSS / CHoCH',
        definition:
          'The first opposite Break of Structure immediately following a liquidity sweep, confirming the reversal thesis.',
        example:
          'Closing below the internal Higher Low (1.0846) right after sweeping Equal Highs (1.0865).',
      },
    ],
    sections: [
      {
        id: 'ls-sec-1',
        heading: 'The 3-Part Anatomy of a Valid Liquidity Sweep',
        body: 'A genuine Liquidity Sweep is not just any random wick on a chart. It follows a repeatable 3-stage institutional sequence that leaves clear visual footprints.',
        bulletPoints: [
          'Stage 1 — Resting Pool (Before): Clear Equal Highs/Lows or prominent swing points concentrate visible stop-losses.',
          'Stage 2 — Spike & Reclaim (Trigger): Price pierces beyond the level on elevated activity, grabs the resting stops, and snaps closed BACK INSIDE the range (leaving a prominent rejection wick).',
          'Stage 3 — Displacement & Shift (After): Strong opposite-direction candles follow immediately and break internal market structure (MSS/BOS).',
        ],
        keyTakeaway:
          'Wick beyond + Close back inside + Opposite Displacement = High-probability Liquidity Sweep.',
      },
      {
        id: 'ls-sec-2',
        heading: 'Anatomy of a True Breakout (Do Not Fade Strength!)',
        body: 'Once traders learn about liquidity sweeps, they often swing to the opposite extreme and try to short EVERY move above resistance. Knowing what a True Breakout looks like protects you from stepping in front of a freight train.',
        bulletPoints: [
          'Full-Body Close Beyond Level: The breakout candle closes decisively outside resistance/support near its extreme, not as a long rejection wick.',
          'Follow-Through Acceptance: The next candle continues expanding in the breakout direction rather than snapping back inside.',
          'Support/Resistance Flip on Retest: When price pulls back to test the broken level, it holds on the outside and launches higher (or lower on a breakdown).',
        ],
        keyTakeaway:
          'Acceptance outside the level + held retest = True Breakout; never blindly fade acceptance.',
      },
      {
        id: 'ls-sec-3',
        heading: 'Side-by-Side Decision Filter at Key Levels',
        body: 'When price arrives at Equal Highs or Equal Lows, pause your finger and run a strict 3-question visual test once the candle closes.',
        bulletPoints: [
          'Question 1 (Close Location): Did the candle close back INSIDE the old range (Sweep clue) or firmly OUTSIDE (Breakout clue)?',
          'Question 2 (Next Candle Response): Did strong opposite displacement appear (Sweep confirmation) or did momentum continue outside (Breakout confirmation)?',
          'Question 3 (Structure): Did internal structure shift opposite the spike (MSS), or did the retest hold the broken boundary?',
        ],
        keyTakeaway:
          'You never have to guess mid-candle—waiting 1–2 candles for close + response reveals who won the battle.',
      },
      {
        id: 'ls-sec-4',
        heading: 'Symmetry: Buy-Side Sweeps vs. Sell-Side Sweeps',
        body: 'The exact same order-flow logic applies upside down beneath Equal Lows. A Sell-Side Liquidity (SSL) Sweep dips quickly under support to trigger long stops, closes back above support, and displaces upward through the prior internal Lower High.',
        bulletPoints: [
          'BSL Sweep: Wick above highs → close below → bearish displacement.',
          'SSL Sweep: Wick below lows → close above → bullish displacement.',
          'Practice both directions in our EUR/USD, BTC/USD, GBP/USD, and XAU/USD scenarios below.',
        ],
        keyTakeaway:
          'Master both BSL and SSL sweeps alongside True Breakouts and True Breakdowns for complete visual fluency.',
      },
    ],
    diagramConfig: {
      kind: 'liquidity_sweep_vs_breakout',
      title: 'Liquidity Sweep vs. True Breakout (Side-by-Side)',
      subtitle: 'Comparing rejection + displacement against full-body acceptance + retest',
      caption:
        'Left: Price wicks above Equal Highs, closes back below, and displaces downward (Sweep). Right: Price closes full-bodied above resistance, holds retest, and expands higher (True Breakout).',
      legend: [
        { label: 'Liquidity / Resistance Line', colorToken: '#f59e0b' },
        { label: 'Sweep Rejection & Bearish Shift', colorToken: '#ef4444' },
        { label: 'Breakout Body Close & Retest Hold', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'ls1', label: 'Sweep Wick', sublabel: 'Grabs Stops & Closes Back Inside', tone: 'bearish' },
        { id: 'ls2', label: 'Displacement', sublabel: 'Fast Shift Through Internal Structure', tone: 'bearish' },
        { id: 'ls3', label: 'Body Close Outside', sublabel: 'Minimal Upper Wick / Acceptance', tone: 'bullish' },
        { id: 'ls4', label: 'Held Retest', sublabel: 'Old Resistance Acts as Support', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Compare where the trigger candle CLOSES relative to the dashed horizontal boundary.',
        'Check whether the immediate next candle shows opposite displacement or continued acceptance.',
        'Confirm structural shift (Sweep) versus successful outside retest (True Breakout).',
      ],
    },
    chartScenarioIds: [
      'sweep-bsl-displacement',
      'true-breakout-retest',
      'sweep-ssl-bullish-shift',
      'true-breakdown-momentum',
    ],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'A Sweep Is a Quick Peek & Snap-Back; a Breakout Stays Outside',
        summary:
          'Imagine price peeking above a ceiling for a few minutes to grab orders and then running straight back downstairs—that is a Liquidity Sweep. If price steps cleanly onto the roof and stays up there, that is a True Breakout.',
        steps: [
          'Wait for the candle to finish closing—never judge while it is still moving.',
          'Long wick outside + close back inside + sharp reversal = Liquidity Sweep.',
          'Solid full body closing outside + staying outside on the retest = True Breakout.',
        ],
        keyTakeaway:
          'The candle close tells the truth that mid-candle spikes hide.',
        practiceSafeHint:
          'Look closely at whether the trigger candle closed back inside the old boundary or firmly outside it.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Check Visual Verification Protocol',
        summary:
          'Use these three objective chart checks before classifying any move past resistance or support.',
        steps: [
          'Check 1 (Wick vs. Body): Is only a thin wick sticking beyond the line, or did a strong candle body close past it?',
          'Check 2 (Follow-Through): Does the very next candle reverse sharply back into the range, or continue beyond the boundary?',
          'Check 3 (Structure / Retest): Do we get an opposite Market Structure Shift (Sweep), or does a pullback bounce cleanly off the broken line (True Breakout)?',
        ],
        keyTakeaway:
          'Three visual checks eliminate 90% of false breakout confusion.',
        practiceSafeHint:
          'Apply Check 1 (body close location) and Check 2 (next-candle follow-through) to the chart in front of you.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'EUR/USD 5m Sweep vs. BTC/USD 15m True Breakout',
        summary:
          'Compare our two flagship charts side by side to lock in the exact visual difference.',
        steps: [
          'EUR/USD Sweep: Equal Highs at 1.0865 → Candle 20 spikes to 1.0882 but closes back below at 1.0859 → Immediate bearish displacement breaks 1.0846.',
          'BTC/USD True Breakout: Resistance at 65,400 → Candle 19 closes full-bodied at 65,820 → Follow-through to 65,990 → Retest holds 65,425 and rallies to 67,050.',
        ],
        keyTakeaway:
          'Rejection wick + displacement = Sweep; full body close + held retest = True Breakout.',
        practiceSafeHint:
          'Compare the trigger candle’s wick-to-body ratio and whether subsequent candles stayed outside or snapped back inside.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Fake Basketball Drive vs. Committing to the Rim',
        summary:
          'A Liquidity Sweep is a sharp jab-step past a defender to make them lunge the wrong way before spinning back into open space. A True Breakout is blowing right past the defender and finishing at the rim.',
        steps: [
          'The jab-step (wick) fools impatient defenders (breakout buyers) into lunging out of position.',
          'A disciplined defender watches the player’s hips (candle close + displacement) instead of reacting to the fake.',
        ],
        keyTakeaway:
          'Watch the candle close and follow-through—do not bite on the first jab-step.',
        practiceSafeHint:
          'Ask yourself: did price just jab past the line and spin back, or did it commit fully through the level?',
      },
      comparison: {
        style: 'comparison',
        headline: 'Direct Comparison: Liquidity Sweep vs. True Breakout',
        summary:
          'Four concrete markers separate a stop-run sweep from genuine expansion.',
        steps: [
          'Candle Close: Sweep closes BACK INSIDE the level; True Breakout closes DECISIVELY OUTSIDE.',
          'Wick Profile: Sweep leaves a long rejection wick; True Breakout prints a strong full body.',
          'Next 2 Candles: Sweep displaces rapidly in the OPPOSITE direction; True Breakout continues or consolidates OUTSIDE.',
          'Retest Behavior: Sweep breaks internal structure opposite the spike; True Breakout bounces off the broken level as new support/resistance.',
        ],
        keyTakeaway:
          'Never rely on one clue alone—combine candle close, next-candle momentum, and structure.',
        practiceSafeHint:
          'Contrast the closing position and the 2 candles immediately following the breach.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '4 Execution Mistakes Around Sweeps & Breakouts',
        summary:
          'Knowing the theory is half the battle—avoiding these four habits protects your account.',
        steps: [
          'Mistake 1: Buying mid-candle out of FOMO as price spikes above Equal Highs (becoming exit liquidity).',
          'Mistake 2: Blindly shorting the second price touches above resistance without waiting for close back inside + displacement (getting run over by a True Breakout).',
          'Mistake 3: Calling a slow sideways drift back inside a "high-energy sweep" when no displacement occurred.',
          'Mistake 4: Placing your stop too tight inside the sweep candle’s noise instead of beyond the sweep wick extreme.',
        ],
        keyTakeaway:
          'Wait for the close, confirm displacement or retest acceptance, and place your stop beyond structural invalidation.',
        practiceSafeHint:
          'Check whether genuine momentum followed the breach or whether price snapped back with opposite force.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ls-1',
        lessonSlug: 'liquidity-sweeps',
        conceptKey: 'liquidity-sweeps',
        scenarioId: 'sweep-bsl-displacement',
        prompt:
          'Inspect the EUR/USD 5m scenario around 1.0865. Is this setup a Valid Liquidity Sweep or a True Breakout?',
        options: [
          { id: 'a', label: 'Valid Buy-Side Liquidity Sweep' },
          { id: 'b', label: 'True Bullish Breakout' },
          { id: 'c', label: 'Sideways No-Event Consolidation' },
          { id: 'd', label: 'Sell-Side Liquidity Sweep' },
        ],
        correctOptionId: 'a',
        hints: [
          'Look closely at Candle 20: it reached 1.0882, but where did its body actually close relative to 1.0865?',
          'Notice what happened to internal structure at 1.0846 on the next two candles.',
        ],
        postSubmissionRationale:
          'This is a textbook Buy-Side Liquidity Sweep: price spiked above Equal Highs (1.0865) to 1.0882, closed back below at 1.0859, and immediately displaced downward through 1.0846.',
        commonTrapNote:
          'Traders who bought mid-candle at 1.0875 without waiting for the close were trapped at the exact top of the sweep wick.',
      },
      {
        id: 'pq-ls-2',
        lessonSlug: 'liquidity-sweeps',
        conceptKey: 'liquidity-sweeps',
        scenarioId: 'true-breakout-retest',
        prompt:
          'Inspect the BTC/USD 15m scenario at 65,400. How should you classify this move?',
        options: [
          { id: 'a', label: 'Buy-Side Liquidity Sweep (short immediately)' },
          { id: 'b', label: 'True Bullish Breakout with Retest Acceptance' },
          { id: 'c', label: 'Sell-Side Liquidity Sweep' },
          { id: 'd', label: 'Failed Bearish Breakdown' },
        ],
        correctOptionId: 'b',
        hints: [
          'Check the candle body close at 65,820—did price snap back below 65,400 or show acceptance above?',
          'Observe how the pullback behaved when it revisited 65,425.',
        ],
        postSubmissionRationale:
          'BTC/USD closed full-bodied at 65,820 with immediate follow-through to 65,990 and held above 65,400 on the retest—every hallmark of a True Breakout.',
        commonTrapNote:
          'Trying to fade every move above resistance as a "sweep" ignores full-body acceptance and causes painful losses.',
      },
      {
        id: 'pq-ls-3',
        lessonSlug: 'liquidity-sweeps',
        conceptKey: 'liquidity-sweeps',
        scenarioId: 'sweep-ssl-bullish-shift',
        prompt:
          'Inspect the GBP/USD 5m scenario around Equal Lows at 1.2640. What price action event occurred?',
        options: [
          { id: 'a', label: 'True Bearish Breakdown' },
          { id: 'b', label: 'Valid Sell-Side Liquidity Sweep into Bullish Shift' },
          { id: 'c', label: 'Buy-Side Liquidity Sweep' },
          { id: 'd', label: 'Bearish Fair Value Gap Continuation' },
        ],
        correctOptionId: 'b',
        hints: [
          'Examine the lower wick at 1.2621 and where that same candle closed relative to 1.2640.',
          'Check whether price subsequently broke above internal structure at 1.2668.',
        ],
        postSubmissionRationale:
          'Price swept Sell-Side Liquidity beneath 1.2640 down to 1.2621, closed firmly back above at 1.2647, and displaced higher through 1.2668 (Bullish BOS).',
        commonTrapNote:
          'Panic-selling a dip below Equal Lows mid-candle puts you short right as institutions absorb sell stops to launch a rally.',
      },
      {
        id: 'pq-ls-4',
        lessonSlug: 'liquidity-sweeps',
        conceptKey: 'liquidity-sweeps',
        scenarioId: 'true-breakdown-momentum',
        prompt:
          'Inspect the XAU/USD 15m scenario around 2332.0 support. Is this a Sell-Side Liquidity Sweep or a True Bearish Breakdown?',
        options: [
          { id: 'a', label: 'Sell-Side Liquidity Sweep (buy the dip)' },
          { id: 'b', label: 'True Bearish Breakdown with Failed Reclaim' },
          { id: 'c', label: 'Buy-Side Liquidity Sweep' },
          { id: 'd', label: 'Bullish Break of Structure' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare the breakdown candle close (2326.2) against the 2332.0 support level.',
          'Did the retest candle manage to close back above 2332.0, or did 2332.0 hold as new resistance?',
        ],
        postSubmissionRationale:
          'Gold closed full-bodied below support at 2326.2 with strong follow-through, and the retest stalled at 2331.4 without reclaiming 2332.0—confirming a True Bearish Breakdown.',
        commonTrapNote:
          'Buying blindly below broken support without a reclaim candle + bullish displacement is catching a falling knife.',
      },
      {
        id: 'pq-ls-5',
        lessonSlug: 'liquidity-sweeps',
        conceptKey: 'liquidity-sweeps',
        prompt:
          'After a valid Buy-Side Liquidity Sweep closes back below Equal Highs and breaks internal structure downward, where is the most logical structural stop-loss for a short trade?',
        options: [
          { id: 'a', label: 'Slightly beyond the extreme high of the sweep wick' },
          { id: 'b', label: 'Right at the old Equal Highs line' },
          { id: 'c', label: 'No stop-loss needed because sweeps always work' },
          { id: 'd', label: 'Exactly 2 pips above your entry price' },
        ],
        correctOptionId: 'a',
        hints: [
          'Which exact price extreme, if broken again, would invalidate the entire liquidity sweep thesis?',
        ],
        postSubmissionRationale:
          'Placing your stop slightly beyond the sweep wick extreme protects your trade at the exact structural invalidation point—if price takes out that extreme, the sweep thesis is wrong.',
        commonTrapNote:
          'Stops placed inside the sweep wick get tagged by routine retests before the trade plays out.',
      },
    ],
  },

  // =========================================================================
  // LESSON 5: Fair Value Gaps (FVG) & Institutional Imbalances
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000005',
    slug: 'fair-value-gaps',
    title: 'Fair Value Gaps (FVG) & Institutional Imbalances',
    subtitle:
      'Spot 3-candle price inefficiencies left by aggressive displacement and understand high-probability mitigation zones.',
    level: 'intermediate',
    moduleOrder: 5,
    conceptKey: 'fair-value-gaps',
    estimatedMinutes: 18,
    learningObjectives: [
      'Measure a Bullish FVG (Candle 1 High to Candle 3 Low) and Bearish FVG (Candle 1 Low to Candle 3 High) accurately.',
      'Understand why price often retraces to rebalance an imbalance (including the 50% Consequent Encroachment midpoint).',
      'Filter high-probability FVGs using structure and liquidity sweeps instead of trading every gap blindly.',
    ],
    prerequisites: [
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Liquidity Sweeps vs. True Breakouts',
    ],
    terminology: [
      {
        term: 'Fair Value Gap',
        shortCode: 'FVG',
        definition:
          'A 3-candle imbalance where Candle 1’s wick and Candle 3’s wick do not overlap, leaving part of Candle 2’s displacement body traded in only one direction.',
        example:
          'EUR/USD Candle 1 High = 1.0830 and Candle 3 Low = 1.0846 → 16-pip Bullish FVG.',
      },
      {
        term: 'Mitigation / Rebalance',
        shortCode: 'Fill',
        definition:
          'Price retracing back into an open Fair Value Gap to fill resting institutional limit orders before resuming the impulse direction.',
        example:
          'EUR/USD pulling back from 1.0872 into 1.0838 before rallying past 1.0890.',
      },
      {
        term: 'Consequent Encroachment',
        shortCode: '50% CE',
        definition:
          'The exact 50% equilibrium midpoint of a Fair Value Gap—frequently a precise reaction zone during retracements.',
        example:
          'Midpoint of 1.0830–1.0846 Bullish FVG = 1.0838.',
      },
    ],
    sections: [
      {
        id: 'fvg-sec-1',
        heading: 'How to Identify a Fair Value Gap Precisely',
        body: 'When aggressive institutional buying or selling overwhelms the order book, price moves so fast in one candle that opposing orders do not get filled evenly. That footprint appears on any candlestick chart as a 3-candle Fair Value Gap.',
        bulletPoints: [
          'Bullish FVG: Candle 2 expands strongly upward, and Candle 3’s LOW stays strictly above Candle 1’s HIGH.',
          'Bearish FVG: Candle 2 drops sharply downward, and Candle 3’s HIGH stays strictly below Candle 1’s LOW.',
          'If Candle 1 and Candle 3 wicks touch or overlap, there is NO Fair Value Gap.',
        ],
        keyTakeaway:
          'Measure strictly from Candle 1’s wick to Candle 3’s wick—never include overlapping wicks.',
      },
      {
        id: 'fvg-sec-2',
        heading: 'Why Context Separates A+ FVGs From Noise',
        body: 'Hundreds of tiny Fair Value Gaps appear on lower timeframes every day, and most fail if traded randomly. High-probability FVGs share three critical contextual filters:',
        bulletPoints: [
          'Formed right after a Liquidity Sweep (SSL sweep for bullish FVG, BSL sweep for bearish FVG).',
          'Accompanied by a Break of Structure (BOS / MSS) confirming institutional displacement.',
          'Aligned with higher-timeframe order flow rather than sitting inside choppy mid-range consolidation.',
        ],
        keyTakeaway:
          'Sweep + Displacement + FVG is a complete narrative; an isolated FVG in chop is just noise.',
      },
      {
        id: 'fvg-sec-3',
        heading: 'Trading the Retracement & 50% Equilibrium',
        body: 'Chasing the top of a big displacement candle forces a terrible stop-loss distance. Waiting patiently for price to retrace into the Fair Value Gap (especially near its 50% midpoint) improves both entry precision and risk-to-reward.',
        bulletPoints: [
          'Mark the top edge, 50% equilibrium, and bottom edge of the FVG.',
          'Wait for price to tap the FVG and show rejection or lower-timeframe confirmation.',
          'If a full candle body closes completely through the far edge of the FVG, treat the gap as invalidated (or inverted).',
        ],
        keyTakeaway:
          'Patience lets price return to your imbalance zone instead of chasing extended candles.',
      },
    ],
    diagramConfig: {
      kind: 'fair_value_gap',
      title: '3-Candle Bullish Fair Value Gap (FVG) & Mitigation',
      subtitle: 'Candle 1 High → Candle 3 Low inefficiency zone with 50% midpoint',
      caption:
        'Strong bullish displacement leaves an unmitigated gap between Candle 1 High and Candle 3 Low; price revisits the 50% midpoint before expanding higher.',
      legend: [
        { label: 'FVG Imbalance Zone', colorToken: '#10b981' },
        { label: '50% Equilibrium Midpoint', colorToken: '#f59e0b' },
        { label: 'Mitigation & Expansion', colorToken: '#38bdf8' },
      ],
      annotations: [
        { id: 'f1', label: 'Candle 1 High', sublabel: 'Lower Boundary of Bullish FVG', tone: 'neutral' },
        { id: 'f2', label: 'Candle 2 Impulse', sublabel: 'Aggressive Institutional Buying', tone: 'bullish' },
        { id: 'f3', label: 'Candle 3 Low', sublabel: 'Upper Boundary of Bullish FVG', tone: 'neutral' },
        { id: 'f4', label: '50% Mitigation', sublabel: 'Retrace Fill → Continuation', tone: 'liquidity' },
      ],
      walkthroughSteps: [
        'Spot an energetic 3-candle displacement move immediately after a liquidity sweep.',
        'Box the gap between Candle 1 High and Candle 3 Low (Bullish FVG) and mark its 50% line.',
        'Wait for orderly retracement into the FVG before executing with structural invalidation.',
      ],
    },
    chartScenarioIds: ['fvg-bullish-mitigation'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'A Fair Value Gap Is an Unfinished Price Zone Left Behind by Speed',
        summary:
          'When price shoots up very fast in one big candle, buyers leave a small empty space between the candle before it and the candle after it. Price often dips back to fill that space before continuing.',
        steps: [
          'Find one big energetic middle candle (Candle 2).',
          'Check if there is open space between Candle 1’s top wick and Candle 3’s bottom wick.',
          'Wait for price to come back and visit that shaded space instead of chasing the top.',
        ],
        keyTakeaway:
          'FVGs give patient traders a second chance to join a strong move at a better price.',
        practiceSafeHint:
          'Verify whether Candle 1’s wick and Candle 3’s wick leave an untouched space between them.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Step FVG Drawing Rule',
        summary:
          'Eliminate messy zones by drawing every FVG with exact wick coordinates.',
        steps: [
          'Locate the strong displacement candle (Candle 2).',
          'For a Bullish FVG: draw a horizontal box from Candle 1 HIGH up to Candle 3 LOW.',
          'Mark the exact halfway line (50% Consequent Encroachment) inside the box.',
          'Verify a prior liquidity grab or BOS gives this FVG real directional backing.',
        ],
        keyTakeaway:
          'Precision in drawing Candle 1 to Candle 3 wicks keeps your zones crisp and objective.',
        practiceSafeHint:
          'Check the exact prices of Candle 1’s high and Candle 3’s low in the displacement sequence.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'EUR/USD 15m Bullish FVG (1.0830 – 1.0846)',
        summary:
          'After grabbing sell-side liquidity at 1.0811, EUR/USD prints a strong 3-candle impulse leaving a 16-pip gap that mitigates cleanly at 1.0838.',
        steps: [
          'Candle 10 high ends at 1.0830; Candle 11 explodes upward; Candle 12 low stays at 1.0846.',
          'Six candles later, price gently retraces to 1.0837 (right at the 1.0838 midpoint).',
          'Buyers step back in immediately, pushing EUR/USD through 1.0872 toward 1.0911.',
        ],
        keyTakeaway:
          'Notice how the SSL grab right before the impulse supercharged the FVG’s reliability.',
        practiceSafeHint:
          'Trace how deep the pullback entered the 1.0830–1.0846 zone before resuming upward.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Painting a Wall Too Fast',
        summary:
          'If you swipe a paintbrush across a wall at top speed, you leave a thin bare streak behind. Before finishing the job, you naturally swipe back over that missed spot.',
        steps: [
          'Aggressive displacement is the fast brushstroke.',
          'The bare streak is the Fair Value Gap (one-sided trading).',
          'Mitigation is the market swiping back to rebalance orders before continuing.',
        ],
        keyTakeaway:
          'Markets dislike unfilled imbalances and frequently revisit them to balance orders.',
        practiceSafeHint:
          'Think of the gap as the untouched space left behind by a fast directional stroke.',
      },
      comparison: {
        style: 'comparison',
        headline: 'High-Probability Context FVG vs. Low-Probability Chop FVG',
        summary:
          'Not all 3-candle gaps deserve your risk capital.',
        steps: [
          'High-Probability FVG: Follows a Liquidity Sweep + breaks structure (BOS/MSS) + aligns with higher-timeframe trend.',
          'Low-Probability FVG: Forms randomly in the middle of a tight sideways range with no sweep or BOS.',
          'Discipline: Skip chop FVGs and wait for narrative alignment.',
        ],
        keyTakeaway:
          'Context is king—only trade FVGs backed by liquidity and structure.',
        practiceSafeHint:
          'Look just before the FVG impulse: did it follow a liquidity sweep or structural shift?',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: 'Top 3 Fair Value Gap Mistakes',
        summary:
          'Avoid turning a clean institutional tool into an overtrading machine.',
        steps: [
          'Mistake 1: Drawing an FVG when Candle 1 and Candle 3 wicks already overlap (not a gap).',
          'Mistake 2: Entering every single 1-minute FVG against the higher-timeframe trend.',
          'Mistake 3: Holding onto a trade after a full candle closes cleanly through the far edge of the FVG.',
        ],
        keyTakeaway:
          'Respect invalidation when price slices straight through an FVG with full bodies.',
        practiceSafeHint:
          'Verify both wick non-overlap and surrounding structural alignment.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-fvg-1',
        lessonSlug: 'fair-value-gaps',
        conceptKey: 'fair-value-gaps',
        scenarioId: 'fvg-bullish-mitigation',
        prompt:
          'Which two exact price points define the boundaries of a Bullish Fair Value Gap?',
        options: [
          { id: 'a', label: 'Candle 1 High and Candle 3 Low (with no overlap between them)' },
          { id: 'b', label: 'Candle 1 Low and Candle 3 High' },
          { id: 'c', label: 'Candle 2 Open and Candle 2 Close only' },
          { id: 'd', label: 'The highest and lowest candles of the entire week' },
        ],
        correctOptionId: 'a',
        hints: [
          'Remember the 3-candle sequence: Candle 2 is the impulse, and Candles 1 and 3 frame the unvisited space.',
        ],
        postSubmissionRationale:
          'A Bullish FVG is strictly the non-overlapping space between Candle 1’s High and Candle 3’s Low around a strong bullish Candle 2.',
        commonTrapNote:
          'Drawing the whole body of Candle 2 ignores wick overlap from Candles 1 and 3 and creates inaccurate entry zones.',
      },
      {
        id: 'pq-fvg-2',
        lessonSlug: 'fair-value-gaps',
        conceptKey: 'fair-value-gaps',
        scenarioId: 'fvg-bullish-mitigation',
        prompt:
          'In the EUR/USD 15m chart (Bullish FVG from 1.0830 to 1.0846), what is the 50% equilibrium (Consequent Encroachment) level?',
        options: [
          { id: 'a', label: '1.0838' },
          { id: 'b', label: '1.0846' },
          { id: 'c', label: '1.0811' },
          { id: 'd', label: '1.0872' },
        ],
        correctOptionId: 'a',
        hints: [
          'Calculate the exact midpoint halfway between 1.0830 and 1.0846.',
        ],
        postSubmissionRationale:
          '(1.0830 + 1.0846) / 2 = 1.0838. Notice how price wicked to 1.0837 and immediately rejected upward from that equilibrium level.',
        commonTrapNote:
          'Chasing above 1.0865 instead of waiting for mitigation into 1.0838–1.0846 ruins your risk-to-reward.',
      },
      {
        id: 'pq-fvg-3',
        lessonSlug: 'fair-value-gaps',
        conceptKey: 'fair-value-gaps',
        prompt:
          'Which condition makes a Fair Value Gap significantly higher probability?',
        options: [
          { id: 'a', label: 'It forms right after a liquidity sweep and confirms a Break of Structure' },
          { id: 'b', label: 'It forms inside dead midday sideways chop with zero direction' },
          { id: 'c', label: 'Candle 1 and Candle 3 wicks completely overlap each other' },
          { id: 'd', label: 'It opposes every higher-timeframe trend' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about how liquidity, structure, and imbalances work together as one story.',
        ],
        postSubmissionRationale:
          'FVGs created by displacement immediately following a liquidity sweep and BOS reflect genuine institutional intent rather than random noise.',
        commonTrapNote:
          'Trading isolated lower-timeframe FVGs without structural context leads to death by a thousand paper cuts.',
      },
      {
        id: 'pq-fvg-4',
        lessonSlug: 'fair-value-gaps',
        conceptKey: 'fair-value-gaps',
        prompt:
          'What typically indicates that a Bullish Fair Value Gap has been invalidated?',
        options: [
          { id: 'a', label: 'Price dips gently into the top 25% and bounces upward' },
          { id: 'b', label: 'A decisive bearish candle body closes completely below Candle 1’s High (far edge)' },
          { id: 'c', label: 'Price touches the 50% midpoint and prints a long lower rejection wick' },
          { id: 'd', label: 'Volume increases while rallying above the FVG' },
        ],
        correctOptionId: 'b',
        hints: [
          'Consider what it means if sellers push full candle bodies completely through the entire bullish imbalance.',
        ],
        postSubmissionRationale:
          'A full bearish candle close completely below the bottom boundary of a Bullish FVG signals sellers overpowered the imbalance, invalidating bullish support there.',
        commonTrapNote:
          'Refusing to accept FVG invalidation turns a small stop into an oversized drawdown.',
      },
    ],
  },

  // =========================================================================
  // LESSON 6: Risk Management, Position Sizing & Trading Psychology
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000006',
    slug: 'risk-psychology',
    title: 'Risk Management, Position Sizing & Trading Psychology',
    subtitle:
      'Protect your capital with fixed-percentage risk math, asymmetric R-multiples, and repeatable emotional discipline.',
    level: 'beginner',
    moduleOrder: 6,
    conceptKey: 'risk-psychology',
    estimatedMinutes: 20,
    learningObjectives: [
      'Calculate exact position size from Account Equity, Risk %, and Structural Stop-Loss Distance.',
      'Understand R-multiples and why positive expectancy does not require an 80%+ win rate.',
      'Build pre-trade and post-loss routines that prevent revenge trading, FOMO, and premature profit-taking.',
    ],
    prerequisites: [
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
    ],
    terminology: [
      {
        term: 'R-Multiple',
        shortCode: '1R',
        definition:
          'Standardized unit of risk defined as the fixed dollar amount risked from entry to stop-loss on a single trade.',
        example:
          'Risking $100 (1R) to target $300 (+3R) gives a 1:3 Risk-to-Reward setup.',
      },
      {
        term: 'Position Sizing Formula',
        shortCode: 'Risk Math',
        definition:
          'Units/Lots = (Account Balance × Risk %) ÷ Stop-Loss Distance Value. Keeps dollar loss constant regardless of stop width.',
        example:
          'On a $10,000 account risking 1% ($100) with a 20-pip EUR/USD stop, trade 0.50 standard lots ($5/pip).',
      },
      {
        term: 'Expectancy',
        shortCode: 'Edge',
        definition:
          'Average R gained per trade over a large sample: (Win Rate × Avg Win R) − (Loss Rate × Avg Loss R).',
        example:
          '40% win rate at +3R wins and -1R losses = (0.4 × 3) − (0.6 × 1) = +0.60R per trade!',
      },
      {
        term: 'Revenge Trading',
        shortCode: 'Tilt',
        definition:
          'Impulsively entering unplanned setups or doubling lot size immediately after a loss to "win it back quickly."',
        example:
          'Jumping into mid-range noise at 2x normal size three minutes after a valid -1R stop-loss.',
      },
    ],
    sections: [
      {
        id: 'rp-sec-1',
        heading: 'The Golden Rule of Survival: Fixed Fractional Risk',
        body: 'No chart pattern—not even the cleanest Liquidity Sweep into a Fair Value Gap—wins 100% of the time. Professional traders survive normal losing streaks by risking a small, fixed fraction of account equity (typically 0.5% to 1.0%) on every single setup.',
        bulletPoints: [
          'At 1% risk per trade, a 5-trade losing streak leaves 95% of your capital intact.',
          'At 10% risk per trade, the exact same 5-trade streak destroys nearly half your account and wrecks your psychology.',
          'Always compute position size FROM your structural stop distance—never pick a random lot size first.',
        ],
        keyTakeaway:
          'Wide stop = smaller position size; tight stop = larger position size; dollar risk stays strictly identical.',
      },
      {
        id: 'rp-sec-2',
        heading: 'Asymmetric Payoff & Thinking in Probabilities',
        body: 'Beginners obsess over being right on the very next trade. Professionals think across batches of 20 to 50 trades using R-multiples.',
        bulletPoints: [
          'At 1:3 Risk-to-Reward, you only need a 26% win rate to beat breakeven—and a 40% win rate produces +0.60R expectancy per trade.',
          'Cutting losing trades cleanly at -1R while letting structured winners reach +2R to +3R creates compounding power.',
          'Never widen a stop-loss once price moves against you; structural invalidation means the trade idea is finished.',
        ],
        keyTakeaway:
          'A single trade’s outcome is random; disciplined execution over 30 trades is consistent.',
      },
      {
        id: 'rp-sec-3',
        heading: 'Emotional Circuit Breakers for Live Sessions',
        body: 'Technical knowledge collapses when fear or greed takes the steering wheel. Install objective rules before the session starts so you do not negotiate with yourself mid-candle.',
        bulletPoints: [
          'Daily Loss Limit: Stop trading for the day if you hit -2R.',
          'Post-Loss Cooldown: Step away from the charts for 15 minutes after any stop-loss.',
          'Mindset Anchor: Open your TradeLab Mindset Vault (Shift + Q) before clicking enter to verify you are trading your checklist, not your mood.',
        ],
        keyTakeaway:
          'Great trading feels calm and structured—never urgent or frantic.',
      },
    ],
    diagramConfig: {
      kind: 'risk_reward_model',
      title: '1:3 Asymmetric Risk-to-Reward & Structural Stop Model',
      subtitle: 'Defining 1R invalidation first to unlock +3R expectancy',
      caption:
        'Position size is scaled to the 20-pip structural stop (1R) so normal noise stays harmless while opposing liquidity delivers +3R.',
      legend: [
        { label: 'Take Profit Zone (+3R)', colorToken: '#10b981' },
        { label: 'Planned Entry Level', colorToken: '#38bdf8' },
        { label: 'Structural Stop Loss (-1R)', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'r1', label: 'Take Profit (+3R)', sublabel: 'Opposing Liquidity Target (+60 pips)', tone: 'bullish' },
        { id: 'r2', label: 'Planned Entry', sublabel: 'Retracement Limit Execution', tone: 'neutral' },
        { id: 'r3', label: 'Stop Loss (-1R)', sublabel: 'Below Protected Higher Low (-20 pips)', tone: 'bearish' },
      ],
      walkthroughSteps: [
        'Locate structural invalidation first (Stop Loss = 1R distance).',
        'Calculate exact position size so hitting 1R loses at most 0.5%–1.0% of equity.',
        'Verify at least 1:2 to 1:3 reward exists before opposing liquidity; otherwise skip the trade.',
      ],
    },
    chartScenarioIds: ['risk-1to3-execution'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Decide Your Maximum Loss Before You Ever Click Buy or Sell',
        summary:
          'Risk management is simply wearing a seatbelt every time you drive. By capping every trade at 1% risk and aiming for 2%–3% reward, you can be wrong half the time and still grow your account steadily.',
        steps: [
          'Find where your chart idea is proven wrong—put your stop-loss there.',
          'Shrink or adjust your lot size so that stop only costs 1% of your account.',
          'Walk away for the day if you take two full losses—protect your calm mind.',
        ],
        keyTakeaway:
          'Protect the downside first and compounding takes care of the upside.',
        practiceSafeHint:
          'Focus on keeping dollar risk fixed per trade and measuring targets in multiples of 1R.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'Pre-Trade 4-Point Risk Checklist',
        summary:
          'Run these four quick numbers before submitting any order.',
        steps: [
          'Step 1: Mark structural Stop-Loss price and measure distance (e.g., 20 pips).',
          'Step 2: Calculate Dollar Risk = Account × 1% (e.g., $10,000 × 1% = $100).',
          'Step 3: Divide Dollar Risk by Stop Distance to get exact Position Size.',
          'Step 4: Confirm target opposing liquidity offers at least 2R–3R potential.',
        ],
        keyTakeaway:
          'If a trade cannot pass this 15-second math check, skip it immediately.',
        practiceSafeHint:
          'Apply the formula: Position Size = (Account × Risk %) ÷ Stop Distance Value.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'GBP/USD 15m 1:3 Execution Plan',
        summary:
          'Entry at 1.2660, Structural Stop at 1.2640 (-20 pips = -1R), Target at 1.2720 (+60 pips = +3R).',
        steps: [
          'Protected Higher Low at 1.2644 gives a logical 1.2640 invalidation stop.',
          'Candle 16 dips 9 pips into normal noise—staying well above 1.2640—rewarding patience.',
          'Holding calmly through the +1R pause allows price to reach the full +3R target at 1.2720.',
        ],
        keyTakeaway:
          'Good structural stop placement stops you from getting shaken out by ordinary candle noise.',
        practiceSafeHint:
          'Compare the 20-pip stop distance against the 60-pip target distance to compute the R-multiple.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Running a Disciplined Casino vs. Being an Emotional Gambler',
        summary:
          'Casinos lose individual hands all night long and never panic, because they enforce strict table limits (risk cap) and let mathematical expectancy play out over thousands of hands.',
        steps: [
          'Your fixed 1% risk rule is your table limit.',
          'Your 1:2.5–1:3 setups are your mathematical edge.',
          'Never let one losing hand convince you to abandon the math.',
        ],
        keyTakeaway:
          'Think like the house: enforce risk limits and trust a large sample of disciplined executions.',
        practiceSafeHint:
          'Evaluate the expectancy across 20+ trades rather than obsessing over one outcome.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Process-Driven Trader vs. Outcome-Driven Trader',
        summary:
          'Both can study the exact same charts yet end up with completely opposite equity curves.',
        steps: [
          'Process-Driven: Risks fixed 1%, logs every trade, respects daily loss limit, accepts -1R calmly.',
          'Outcome-Driven: Changes lot size by emotion, moves stops wider to avoid taking a loss, closes winners early at +0.5R out of fear.',
        ],
        keyTakeaway:
          'You control your process 100%; you control individual trade outcomes 0%.',
        practiceSafeHint:
          'Identify which behavior protects capital and enforces positive mathematical expectancy.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '4 Account-Blowing Risk & Psychology Traps',
        summary:
          'Eliminating these four behaviors immediately puts you ahead of most retail traders.',
        steps: [
          'Trap 1: Using the same fixed lot size regardless of whether the stop is 10 pips or 50 pips.',
          'Trap 2: Moving a stop-loss further away when price approaches it ("just give it room").',
          'Trap 3: Doubling size after a loss to recover quickly (Martingale / revenge tilt).',
          'Trap 4: Closing a clean +3R plan prematurely at +0.6R out of fear of giving back tiny unrealized profits.',
        ],
        keyTakeaway:
          'Small losses are normal business expenses; rule-breaking losses are optional self-sabotage.',
        practiceSafeHint:
          'Check whether the habit preserves fixed fractional risk or exposes the account to emotional escalation.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-rp-1',
        lessonSlug: 'risk-psychology',
        conceptKey: 'risk-psychology',
        scenarioId: 'risk-1to3-execution',
        prompt:
          'You have a $10,000 account and risk strictly 1% ($100) per trade. On GBP/USD, your structural stop-loss is 20 pips ($10/pip per 1.00 standard lot). What is the correct position size?',
        options: [
          { id: 'a', label: '0.50 standard lots ($5/pip × 20 pips = $100)' },
          { id: 'b', label: '2.00 standard lots ($20/pip × 20 pips = $400)' },
          { id: 'c', label: '1.00 standard lot regardless of stop width' },
          { id: 'd', label: '5.00 standard lots to make profit faster' },
        ],
        correctOptionId: 'a',
        hints: [
          'First find your dollar risk: 1% of $10,000 = $100.',
          'Now divide $100 by 20 pips to see how many dollars per pip you should risk.',
        ],
        postSubmissionRationale:
          '$100 maximum risk ÷ 20 pips = $5 per pip. Since 1.00 standard lot on GBP/USD equals $10/pip, 0.50 standard lots equals exactly $5/pip ($100 total risk).',
        commonTrapNote:
          'Trading a fixed 1.00 lot on every setup doubles your dollar risk whenever stops widen.',
      },
      {
        id: 'pq-rp-2',
        lessonSlug: 'risk-psychology',
        conceptKey: 'risk-psychology',
        prompt:
          'A trader has a 40% win rate, averages +3R on winning trades, and strictly cuts losers at -1R. Over 100 trades, what is the expected average outcome per trade?',
        options: [
          { id: 'a', label: 'Negative (-0.60R) because they lose 60% of trades' },
          { id: 'b', label: 'Breakeven (0.00R)' },
          { id: 'c', label: 'Positive (+0.60R per trade, or +60R over 100 trades)' },
          { id: 'd', label: 'Impossible to calculate without a 70% win rate' },
        ],
        correctOptionId: 'c',
        hints: [
          'Plug the numbers into Expectancy = (Win Rate × Avg Win) − (Loss Rate × Avg Loss).',
        ],
        postSubmissionRationale:
          'Expectancy = (0.40 × 3R) − (0.60 × 1R) = 1.20R − 0.60R = +0.60R per trade. Strong R-multiples create a robust edge even with a 40% win rate.',
        commonTrapNote:
          'Obsessing over win rate alone causes traders to cut winners early and let losers run.',
      },
      {
        id: 'pq-rp-3',
        lessonSlug: 'risk-psychology',
        conceptKey: 'risk-psychology',
        prompt:
          'You just took two planned -1R losses in a row, hitting your pre-set -2R daily loss limit. What is the disciplined professional response?',
        options: [
          { id: 'a', label: 'Double your lot size on the next trade to finish green today' },
          { id: 'b', label: 'Stop trading for the session, journal both setups objectively, and return fresh tomorrow' },
          { id: 'c', label: 'Switch to a 1-minute chart and scalp until you break even' },
          { id: 'd', label: 'Remove your stop-loss on trade #3 so it cannot get stopped out' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember why daily loss limits are decided BEFORE the session while your mind is calm.',
        ],
        postSubmissionRationale:
          'Honoring your daily loss limit protects both equity and emotional composure, preventing a routine -2R day from spiraling into an account-damaging tilt.',
        commonTrapNote:
          'Most blown accounts happen in a single afternoon of revenge trading after ignoring a daily limit.',
      },
      {
        id: 'pq-rp-4',
        lessonSlug: 'risk-psychology',
        conceptKey: 'risk-psychology',
        prompt:
          'Why is widening your stop-loss after price approaches invalidation one of the most destructive habits in trading?',
        options: [
          { id: 'a', label: 'Because it breaks your R-multiple math and turns a planned -1R cost into an uncontrolled loss' },
          { id: 'b', label: 'Because brokers charge extra commission for wider stops' },
          { id: 'c', label: 'Because candlesticks freeze when stops move' },
          { id: 'd', label: 'It is actually recommended whenever you feel confident' },
        ],
        correctOptionId: 'a',
        hints: [
          'If your original structural invalidation level was reached, what does that say about your trade thesis?',
        ],
        postSubmissionRationale:
          'If price hits your structural invalidation point, the original trade thesis is already proven wrong. Widening the stop converts a disciplined -1R expense into an uncalculated loss that breaks your expectancy.',
        commonTrapNote:
          'Hoping price bounces back replaces objective risk management with emotional gambling.',
      },
    ],
  },
];

/**
 * Original TradeLab Academy visual materials (strictly tradelab_original — ZERO fabricated YouTube URLs!).
 * Third-party YouTube/TradingView videos are curated legitimately via Admin Console + YouTube Data API.
 */
export const STARTER_ORIGINAL_RESOURCES: LessonResourceWithDetails[] = [
  {
    mapping: {
      id: '30000000-0000-4000-8000-000000000001',
      lessonId: '20000000-0000-4000-8000-000000000001',
      lessonSlug: 'market-structure',
      resourceId: '40000000-0000-4000-8000-000000000001',
      relevanceScore: 98,
      displayOrder: 1,
      beforeWatchContext:
        'Study how each Higher Low launches a body-close Break of Structure on EUR/USD 15m before exploring external video walkthroughs.',
      afterWatchTakeaways: [
        'Require a full candle-body close past the prior swing to confirm BOS.',
        'Lock the swing low that launched the BOS as your protected invalidation point.',
      ],
      editorialNotes: 'Original TradeLab Academy annotated chart walkthrough.',
    },
    resource: {
      id: '40000000-0000-4000-8000-000000000001',
      title: 'TradeLab Visual Guide: Bullish Structure & BOS Confirmation',
      description:
        'Original interactive EUR/USD 15m annotated chart study showing HH/HL progression, protected swings, and body-close Breaks of Structure.',
      sourceType: 'tradelab_original',
      sourceName: 'TradeLab Academy Originals',
      sourceUrl: 'https://tradelab.academy/originals/market-structure-bos-study',
      externalVideoId: null,
      thumbnailUrl: null,
      durationSeconds: null,
      contentType: 'chart_example',
      licenseStatus: 'tradelab_original_cc_internal',
      attribution: 'Created by TradeLab Academy Curriculum Team.',
      nonEndorsementNotice: false,
      verificationStatus: 'published',
      qualityScore: 96,
      embeddable: true,
      lastCheckedAt: '2026-01-01T00:00:00.000Z',
      createdBy: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    segments: [],
  },
  {
    mapping: {
      id: '30000000-0000-4000-8000-000000000002',
      lessonId: '20000000-0000-4000-8000-000000000002',
      lessonSlug: 'market-liquidity',
      resourceId: '40000000-0000-4000-8000-000000000002',
      relevanceScore: 97,
      displayOrder: 1,
      beforeWatchContext:
        'Trace how Gold builds Buy-Side Liquidity above 2348.5 and Sell-Side Liquidity below 2324.0 before rotating pool-to-pool.',
      afterWatchTakeaways: [
        'BSL rests above highs (short stops + breakout buy stops).',
        'SSL rests below lows (long stops + breakdown sell stops).',
      ],
      editorialNotes: 'Original TradeLab Academy liquidity rotation diagram & chart study.',
    },
    resource: {
      id: '40000000-0000-4000-8000-000000000002',
      title: 'TradeLab Visual Guide: Buy-Side & Sell-Side Liquidity Pools',
      description:
        'Original annotated XAU/USD 1H study demonstrating liquidity buildup at range extremes and pool-to-pool delivery.',
      sourceType: 'tradelab_original',
      sourceName: 'TradeLab Academy Originals',
      sourceUrl: 'https://tradelab.academy/originals/bsl-ssl-liquidity-pools',
      externalVideoId: null,
      thumbnailUrl: null,
      durationSeconds: null,
      contentType: 'diagram',
      licenseStatus: 'tradelab_original_cc_internal',
      attribution: 'Created by TradeLab Academy Curriculum Team.',
      nonEndorsementNotice: false,
      verificationStatus: 'published',
      qualityScore: 95,
      embeddable: true,
      lastCheckedAt: '2026-01-01T00:00:00.000Z',
      createdBy: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    segments: [],
  },
  {
    mapping: {
      id: '30000000-0000-4000-8000-000000000003',
      lessonId: '20000000-0000-4000-8000-000000000003',
      lessonSlug: 'equal-highs-lows',
      resourceId: '40000000-0000-4000-8000-000000000003',
      relevanceScore: 97,
      displayOrder: 1,
      beforeWatchContext:
        'Observe how three aligned NAS100 highs around 18,520 concentrate stop orders prior to the sweep reversal.',
      afterWatchTakeaways: [
        'Relative Equal Highs act as order magnets, not guaranteed ceilings.',
        'Wait for the sweep and displacement before opposing the pool.',
      ],
      editorialNotes: 'Original TradeLab Academy Equal Highs diagram & NAS100 study.',
    },
    resource: {
      id: '40000000-0000-4000-8000-000000000003',
      title: 'TradeLab Visual Guide: Equal Highs Liquidity Magnets',
      description:
        'Original NAS100 5m annotated breakdown comparing triple-top perception with resting buy-stop concentration.',
      sourceType: 'tradelab_original',
      sourceName: 'TradeLab Academy Originals',
      sourceUrl: 'https://tradelab.academy/originals/equal-highs-liquidity-magnet',
      externalVideoId: null,
      thumbnailUrl: null,
      durationSeconds: null,
      contentType: 'chart_example',
      licenseStatus: 'tradelab_original_cc_internal',
      attribution: 'Created by TradeLab Academy Curriculum Team.',
      nonEndorsementNotice: false,
      verificationStatus: 'published',
      qualityScore: 96,
      embeddable: true,
      lastCheckedAt: '2026-01-01T00:00:00.000Z',
      createdBy: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    segments: [],
  },
  {
    mapping: {
      id: '30000000-0000-4000-8000-000000000004',
      lessonId: '20000000-0000-4000-8000-000000000004',
      lessonSlug: 'liquidity-sweeps',
      resourceId: '40000000-0000-4000-8000-000000000004',
      relevanceScore: 100,
      displayOrder: 1,
      beforeWatchContext:
        'Flagship comparison: inspect candle close location and follow-through across EUR/USD Sweep vs. BTC/USD True Breakout.',
      afterWatchTakeaways: [
        'Sweep: Wick beyond level + close back inside + opposite displacement.',
        'True Breakout: Full body close outside + follow-through + held retest.',
      ],
      editorialNotes: 'Flagship TradeLab Academy original visual comparison.',
    },
    resource: {
      id: '40000000-0000-4000-8000-000000000004',
      title: 'TradeLab Flagship Study: Liquidity Sweep vs. True Breakout',
      description:
        'Side-by-side original diagram and multi-asset interactive chart studies covering BSL Sweeps, SSL Sweeps, True Breakouts, and True Breakdowns.',
      sourceType: 'tradelab_original',
      sourceName: 'TradeLab Academy Originals',
      sourceUrl: 'https://tradelab.academy/originals/liquidity-sweep-vs-breakout',
      externalVideoId: null,
      thumbnailUrl: null,
      durationSeconds: null,
      contentType: 'diagram',
      licenseStatus: 'tradelab_original_cc_internal',
      attribution: 'Created by TradeLab Academy Curriculum Team.',
      nonEndorsementNotice: false,
      verificationStatus: 'published',
      qualityScore: 99,
      embeddable: true,
      lastCheckedAt: '2026-01-01T00:00:00.000Z',
      createdBy: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    segments: [],
  },
  {
    mapping: {
      id: '30000000-0000-4000-8000-000000000005',
      lessonId: '20000000-0000-4000-8000-000000000005',
      lessonSlug: 'fair-value-gaps',
      resourceId: '40000000-0000-4000-8000-000000000005',
      relevanceScore: 97,
      displayOrder: 1,
      beforeWatchContext:
        'Follow the exact Candle 1 High to Candle 3 Low gap coordinates and watch the 50% equilibrium reaction on EUR/USD 15m.',
      afterWatchTakeaways: [
        'Only non-overlapping 3-candle displacement sequences form valid FVGs.',
        'Pair FVGs with prior liquidity sweeps and structure alignment.',
      ],
      editorialNotes: 'Original TradeLab Academy FVG measurement and mitigation guide.',
    },
    resource: {
      id: '40000000-0000-4000-8000-000000000005',
      title: 'TradeLab Visual Guide: Fair Value Gap Anatomy & 50% Mitigation',
      description:
        'Original EUR/USD 15m chart example highlighting SSL grab, 3-candle bullish displacement, and Consequent Encroachment reaction.',
      sourceType: 'tradelab_original',
      sourceName: 'TradeLab Academy Originals',
      sourceUrl: 'https://tradelab.academy/originals/fair-value-gap-mitigation',
      externalVideoId: null,
      thumbnailUrl: null,
      durationSeconds: null,
      contentType: 'chart_example',
      licenseStatus: 'tradelab_original_cc_internal',
      attribution: 'Created by TradeLab Academy Curriculum Team.',
      nonEndorsementNotice: false,
      verificationStatus: 'published',
      qualityScore: 96,
      embeddable: true,
      lastCheckedAt: '2026-01-01T00:00:00.000Z',
      createdBy: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    segments: [],
  },
  {
    mapping: {
      id: '30000000-0000-4000-8000-000000000006',
      lessonId: '20000000-0000-4000-8000-000000000006',
      lessonSlug: 'risk-psychology',
      resourceId: '40000000-0000-4000-8000-000000000006',
      relevanceScore: 98,
      displayOrder: 1,
      beforeWatchContext:
        'Examine how pre-defined 1R invalidation and fixed position sizing make holding to +3R psychologically manageable.',
      afterWatchTakeaways: [
        'Calculate position size from stop-loss width to cap every loss at 0.5%–1%.',
        'Respect daily loss limits and step back after consecutive stop-outs.',
      ],
      editorialNotes: 'Original TradeLab Academy risk-to-reward execution blueprint.',
    },
    resource: {
      id: '40000000-0000-4000-8000-000000000006',
      title: 'TradeLab Visual Guide: 1:3 R-Multiple & Position Sizing Blueprint',
      description:
        'Original GBP/USD 15m execution study connecting structural invalidation, fixed fractional sizing, and expectancy math.',
      sourceType: 'tradelab_original',
      sourceName: 'TradeLab Academy Originals',
      sourceUrl: 'https://tradelab.academy/originals/risk-management-1to3-blueprint',
      externalVideoId: null,
      thumbnailUrl: null,
      durationSeconds: null,
      contentType: 'diagram',
      licenseStatus: 'tradelab_original_cc_internal',
      attribution: 'Created by TradeLab Academy Curriculum Team.',
      nonEndorsementNotice: false,
      verificationStatus: 'published',
      qualityScore: 97,
      embeddable: true,
      lastCheckedAt: '2026-01-01T00:00:00.000Z',
      createdBy: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    segments: [],
  },
];

export const CURRICULUM_BY_SLUG: Record<string, Lesson> = Object.fromEntries(
  CURRICULUM_LESSONS.map((lesson) => [lesson.slug, lesson]),
);

export function getLessonBySlug(slug: string): Lesson | undefined {
  return CURRICULUM_BY_SLUG[slug];
}

export function getLessonById(id: string): Lesson | undefined {
  return CURRICULUM_LESSONS.find((lesson) => lesson.id === id);
}

export function getLessonByConceptKey(conceptKey: string): Lesson | undefined {
  return CURRICULUM_LESSONS.find((lesson) => lesson.conceptKey === conceptKey);
}
