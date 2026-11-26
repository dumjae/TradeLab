import type { Lesson } from '../types/academy';

export const EXPANDED_LESSONS: Lesson[] = [
  // =========================================================================
  // MODULE 1: Candlestick Anatomy & Reading Price Action
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000007',
    slug: 'candlestick-anatomy',
    title: 'Candlestick Anatomy & Reading Price Action',
    subtitle:
      'Decode open, high, low, close (OHLC), wick rejection, and body momentum to read buyer vs. seller control on any chart.',
    level: 'beginner',
    marketCategory: 'general',
    learningStage: 'foundations',
    moduleOrder: 1,
    conceptKey: 'candlestick-anatomy',
    estimatedMinutes: 14,
    learningObjectives: [
      'Read Open, High, Low, and Close (OHLC) instantly on both bullish and bearish candlesticks.',
      'Interpret body-to-wick ratios to gauge conviction, momentum, and price rejection.',
      'Recognize engulfing displacement candles, rejection pin bars, and indecision dojis in context.',
      'Explain why candle location at key structure matters far more than isolated textbook patterns.',
    ],
    prerequisites: ['No prior trading experience required — start right here.'],
    terminology: [
      {
        term: 'OHLC (Open, High, Low, Close)',
        shortCode: 'OHLC',
        definition:
          'The four price points recorded during a single candle period: where trading started, peaked, bottomed, and finished.',
        example:
          'A 15m candle opens at 1.0810, dips to 1.0806, rallies to 1.0825, and closes at 1.0823.',
      },
      {
        term: 'Real Body',
        shortCode: 'Body',
        definition:
          'The filled rectangle between Open and Close showing net directional commitment for that session slice.',
        example:
          'A wide green body closing near its high confirms aggressive buyer dominance.',
      },
      {
        term: 'Wick / Shadow',
        shortCode: 'Wick',
        definition:
          'The thin line extending beyond the body showing prices tested and rejected before the candle closed.',
        example:
          'A long lower wick beneath support signals buyers absorbed selling pressure and pushed price back up.',
      },
      {
        term: 'Candle Close Confirmation',
        shortCode: 'Close',
        definition:
          'Waiting until the timer completes so you act on finalized institutional order flow rather than mid-candle spikes.',
        example:
          'Waiting for the 15m close at 1.0847 instead of chasing a fleeting mid-candle push.',
      },
    ],
    sections: [
      {
        id: 'ca-sec-1',
        heading: 'Anatomy of a Candle: The Story of One Battle',
        body: 'Every candlestick compresses a tug-of-war between buyers and sellers into four numbers. The real body shows who won the round; the wicks show where the losing side tried to push price and got rejected.',
        bulletPoints: [
          'Bullish candle: Close finishes above Open; lower wick shows rejected downside probing.',
          'Bearish candle: Close finishes below Open; upper wick shows rejected upside probing.',
          'Large body + small wicks = strong directional conviction (displacement).',
        ],
        keyTakeaway:
          'Read every candle as a story of auction control—not as a memorized cartoon shape.',
      },
      {
        id: 'ca-sec-2',
        heading: 'Momentum vs. Rejection vs. Indecision',
        body: 'You only need three behavioral families to read live price action cleanly across stocks, forex, indices, or crypto.',
        bulletPoints: [
          'Expansion / Engulfing candles: Full-bodied candles that eclipse prior range and signal active institutional participation.',
          'Rejection candles (Pin Bars / Hammers): Long wick probing past a key level followed by a firm close back away from that extreme.',
          'Indecision candles (Doji / Inside Bars): Tiny bodies with balanced wicks signaling temporary equilibrium before expansion.',
        ],
        keyTakeaway:
          'Compare body size to wick length to instantly distinguish commitment from hesitation.',
      },
      {
        id: 'ca-sec-3',
        heading: 'Why Context Beats Isolated Candlestick Patterns',
        body: 'A textbook bullish pin bar in the dead middle of choppy range noise has almost zero edge. That exact same rejection candle after sweeping a Higher Low or session low carries strong institutional weight.',
        bulletPoints: [
          'Always ask WHERE the candle formed (at swing structure, demand, or liquidity) before reacting.',
          'Wait for the candle timer to finish—a bullish breakout can flip into a bearish sweep wick in the final 10 seconds.',
          'Evaluate 3-to-5 candle sequences together to see whether momentum is accelerating or stalling.',
        ],
        keyTakeaway:
          'Location + candle close turns raw OHLC bars into actionable price action.',
      },
    ],
    diagramConfig: {
      kind: 'market_structure',
      title: 'Reading Candle Conviction Across Swing Legs',
      subtitle: 'How full-body expansion and wick rejections build directional price action',
      caption:
        'Impulsive legs print wide bodies closing near extremes, while pullbacks slow down with smaller bodies and rejection wicks at key lows.',
      legend: [
        { label: 'Bullish Expansion Bodies', colorToken: '#10b981' },
        { label: 'Controlled Pullback Candles', colorToken: '#64748b' },
        { label: 'Key Level Close Confirmation', colorToken: '#38bdf8' },
      ],
      annotations: [
        { id: 'ca1', label: 'Expansion', sublabel: 'Wide Bodies, Minimal Wicks', tone: 'bullish' },
        { id: 'ca2', label: 'Pullback', sublabel: 'Shrinking Bearish Bodies', tone: 'neutral' },
        { id: 'ca3', label: 'Rejection Wick', sublabel: 'Demand Absorbs Sellers', tone: 'liquidity' },
        { id: 'ca4', label: 'Body Close', sublabel: 'Confirmed Breakout Commit', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Compare body size on impulse legs against smaller, overlapping bodies during pullbacks.',
        'Watch for long rejection wicks when price tests a prior low or high.',
        'Confirm directional commitment strictly after the candle closes.',
      ],
    },
    chartScenarioIds: ['ms-bullish-bos'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'A Candlestick Is a Scoreboard for One Round of Buying vs. Selling',
        summary:
          'The thick colored block shows how far price traveled from start to finish, while the thin lines above and below show the furthest points price briefly visited before snapping back.',
        steps: [
          'Green (bullish) means price closed higher than it opened; red (bearish) means it closed lower.',
          'A long tail (wick) poking down means sellers tried to push lower, but buyers shoved price right back up.',
          'Always let the candle finish closing before trusting its final message.',
        ],
        keyTakeaway:
          'Big solid bodies show strength; long wicks show rejection.',
        practiceSafeHint:
          'Look at where the body closed relative to the candle’s full high-to-low range.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Second Candle Reading Routine',
        summary:
          'Scan every closed candle with three quick visual questions.',
        steps: [
          'Check Body Size: Is this candle larger than the previous 3–5 candles (momentum) or tiny (pause)?',
          'Check Close Position: Did it close near its high/low (conviction) or near the middle (rejection/indecision)?',
          'Check Location: Did this close happen at a meaningful swing level or inside random mid-range noise?',
        ],
        keyTakeaway:
          'Size, close location, and chart context tell you 95% of what you need from any candle.',
        practiceSafeHint:
          'Measure whether the candle’s body dominates the bar or whether a long wick signals pushback.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'EUR/USD 15m Impulse vs. Pullback Candles',
        summary:
          'In our EUR/USD 15m chart, pullback candles into 1.0816 shrink in size before Candle 14 prints a decisive bullish close at 1.0847 above 1.0844.',
        steps: [
          'Notice how candles 7–10 drift down with modest bodies and overlapping ranges.',
          'At 1.0816, downside momentum stalls and bullish bodies begin expanding consecutively.',
          'Candle 14 closes strongly near its high at 1.0847—proving buyers committed above resistance.',
        ],
        keyTakeaway:
          'Healthy trends show wide bodies with the trend and shrinking bodies against the trend.',
        practiceSafeHint:
          'Compare the body range of the breakout candle against the smaller retracement candles.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'A Tug-of-War Rope Snapshot',
        summary:
          'Think of each candle as a 15-minute round of tug-of-war. The wicks mark the furthest mud tracks on either side; the body shows where the ribbon actually stood when the whistle blew.',
        steps: [
          'Mid-round pulls do not award points—only where the ribbon sits at the whistle (candle close) counts.',
          'A long upper wick means buyers pulled hard early, then got yanked completely backward before the whistle.',
        ],
        keyTakeaway:
          'Wait for the whistle (candle close) to know who truly won the round.',
        practiceSafeHint:
          'Ask who held control when the candle timer actually ended.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Conviction Close vs. Exhaustion Wick',
        summary:
          'Two candles can reach the exact same high price yet signal completely opposite follow-through.',
        steps: [
          'Conviction Close: Opens low, expands steadily, closes in the top 20% of its range—favors continuation.',
          'Exhaustion Wick: Spikes to the same high, then reverses and closes in the bottom 25%—warns of rejection.',
        ],
        keyTakeaway:
          'Never treat an intraday high touch the same as a strong closing price.',
        practiceSafeHint:
          'Compare the candle’s high/low extremes against its actual closing price.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: 'Top 3 Beginner Candlestick Traps',
        summary:
          'Most candlestick frustration happens when learners treat single bars as standalone buy/sell buttons.',
        steps: [
          'Mistake 1: Entering before the candle closes and watching a green breakout turn into a red shooting star.',
          'Mistake 2: Buying every random hammer in the middle of a downtrend without structural support.',
          'Mistake 3: Memorizing 40 exotic pattern names instead of understanding body conviction and wick rejection.',
        ],
        keyTakeaway:
          'Understand order-flow behavior and always wait for the close at a key level.',
        practiceSafeHint:
          'Verify both candle completion and structural location before drawing a conclusion.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ca-1',
        lessonSlug: 'candlestick-anatomy',
        conceptKey: 'candlestick-anatomy',
        scenarioId: 'ms-bullish-bos',
        prompt:
          'A 15-minute candle spikes far below a key swing low, then closes strongly in the upper 20% of its range leaving a long lower wick. What does this communicate?',
        options: [
          { id: 'a', label: 'Sellers maintained total control through the close' },
          { id: 'b', label: 'Buyers absorbed lower prices and rejected the push beneath the swing low' },
          { id: 'c', label: 'The chart feed froze and the candle is invalid' },
          { id: 'd', label: 'Price is guaranteed to fall on the next bar' },
        ],
        correctOptionId: 'b',
        hints: [
          'Look at what a long lower wick + high closing price tells you about buyer response.',
        ],
        postSubmissionRationale:
          'A long lower wick coupled with a close near the top of the candle shows aggressive buyer demand stepped in below the low and rejected lower prices.',
        commonTrapNote:
          'Panic-selling mid-candle during the dip leaves you trapped short right as buyers reclaim the level.',
      },
      {
        id: 'pq-ca-2',
        lessonSlug: 'candlestick-anatomy',
        conceptKey: 'candlestick-anatomy',
        prompt:
          'Why is waiting for the candle close essential before confirming a breakout or rejection?',
        options: [
          { id: 'a', label: 'Because brokers forbid entering trades while candles are moving' },
          { id: 'b', label: 'Because mid-candle price spikes frequently reverse into rejection wicks before the period ends' },
          { id: 'c', label: 'Because wicks only appear after the close on daily charts' },
          { id: 'd', label: 'Because candle bodies do not move during live sessions' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how a strong-looking green bar with 2 minutes left can finish at the whistle.',
        ],
        postSubmissionRationale:
          'Until the period finishes, a breakout push can snap completely back inside resistance and leave a deceptive rejection wick.',
        commonTrapNote:
          'FOMO mid-candle entries account for a massive share of retail stop-outs at highs and lows.',
      },
      {
        id: 'pq-ca-3',
        lessonSlug: 'candlestick-anatomy',
        conceptKey: 'candlestick-anatomy',
        prompt:
          'Which factor gives a bullish rejection candle the highest probability of follow-through?',
        options: [
          { id: 'a', label: 'Forming at a meaningful Higher Low or demand zone aligned with trend structure' },
          { id: 'b', label: 'Forming randomly in the dead center of tight choppy consolidation' },
          { id: 'c', label: 'Having the smallest possible volume of the day' },
          { id: 'd', label: 'Ignoring higher-timeframe direction completely' },
        ],
        correctOptionId: 'a',
        hints: [
          'Remember: pattern shape alone is weak without structural location.',
        ],
        postSubmissionRationale:
          'Candlestick signals gain institutional edge when they appear at logical structural locations such as Higher Lows, demand zones, or swept liquidity levels.',
        commonTrapNote:
          'Trading isolated pin bars in mid-range chop produces random coin-flip results.',
      },
    ],
  },

  // =========================================================================
  // MODULE 3: Support, Resistance & Institutional Supply/Demand Zones
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000008',
    slug: 'support-resistance-supply-demand',
    title: 'Support, Resistance & Institutional Supply/Demand Zones',
    subtitle:
      'Upgrade from razor-thin retail lines to institutional supply and demand zones where aggressive displacement actually began.',
    level: 'beginner',
    marketCategory: 'general',
    learningStage: 'foundations',
    moduleOrder: 3,
    conceptKey: 'support-resistance-supply-demand',
    estimatedMinutes: 16,
    learningObjectives: [
      'Draw clean horizontal Support and Resistance areas as zones rather than fragile 1-pip lines.',
      'Identify Institutional Supply and Demand zones by locating the base before explosive displacement.',
      'Understand Polarity Flips (broken resistance turning into support and vice versa).',
      'Explain why fresh, unmitigated zones react stronger than levels tested four or five times.',
    ],
    prerequisites: [
      'Candlestick Anatomy & Reading Price Action',
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
    ],
    terminology: [
      {
        term: 'Support & Resistance',
        shortCode: 'S/R',
        definition:
          'Historical horizontal price areas where buying demand repeatedly halted declines (support) or selling supply halted rallies (resistance).',
        example:
          'XAU/USD bouncing cleanly near 2324.0 support and stalling repeatedly near 2348.5 resistance.',
      },
      {
        term: 'Supply / Demand Zone',
        shortCode: 'S&D',
        definition:
          'The compact basing origin where large institutional orders entered and launched a sharp, imbalanced move away.',
        example:
          'A tight 2-candle pause right before Gold plunges $25 lower creates an institutional supply zone.',
      },
      {
        term: 'Role Reversal (S/R Flip)',
        shortCode: 'Polarity',
        definition:
          'When price breaks decisively through prior resistance and later retests that same zone from above as new support.',
        example:
          'BTC/USD breaking above 65,400 and holding 65,425 as a new launchpad.',
      },
      {
        term: 'Zone Freshness',
        shortCode: 'Unmitigated',
        definition:
          'Whether price has returned to absorb resting orders inside a zone; first visits typically produce the sharpest reaction.',
        example:
          'A fresh demand zone untouched since launch holds more unfilled institutional bids than a 4th retest.',
      },
    ],
    sections: [
      {
        id: 'sr-sec-1',
        heading: 'Zones, Not Razor-Thin Lines',
        body: 'Institutional desks scale large positions across price pockets—not at a single decimal tick. Treating Support and Resistance as shaded zones prevents you from getting confused by minor 3-pip overshoots or undershoots.',
        bulletPoints: [
          'Anchor S/R zones using prominent swing turning points where price reversed meaningfully.',
          'Keep charts clean: mark only the 2–3 major zones framing current price, not 20 cluttered lines.',
          'Always note how many times a level has been touched—each extra touch drains resting orders.',
        ],
        keyTakeaway:
          'Think in price areas where orders cluster, not magical 1-pixel walls.',
      },
      {
        id: 'sr-sec-2',
        heading: 'Institutional Supply & Demand vs. Classic S/R',
        body: 'Classic S/R looks for multiple bounces along a horizontal boundary. Institutional Supply and Demand looks for the exact origin candle/base that produced explosive departure and a Break of Structure.',
        bulletPoints: [
          'Demand Zone (Rally-Base-Rally or Drop-Base-Rally): Small base followed by forceful bullish displacement.',
          'Supply Zone (Drop-Base-Drop or Rally-Base-Drop): Small base followed by forceful bearish displacement.',
          'High-quality S&D zones leave behind visible imbalances (FVGs) and break prior market structure.',
        ],
        keyTakeaway:
          'Strength of departure tells you how much institutional money actually sat in the zone.',
      },
      {
        id: 'sr-sec-3',
        heading: 'Freshness, Mitigation & Role Reversal',
        body: 'Every time price revisits a support or demand zone, resting buy orders get filled. Eventually the zone runs dry and breaks—often flipping polarity so broken support becomes future resistance.',
        bulletPoints: [
          'First retest (Fresh/Unmitigated) = highest probability reaction.',
          'Repeated 3rd–4th taps = weakening zone + stacked stops turning into a liquidity target.',
          'When a zone breaks with a full candle body, stop trying to catch bounces and watch for the polarity retest.',
        ],
        keyTakeaway:
          'Trade fresh zones backed by displacement; respect broken zones when polarity flips.',
      },
    ],
    diagramConfig: {
      kind: 'liquidity_pools',
      title: 'Supply Ceiling vs. Demand Floor & Zone Exhaustion',
      subtitle: 'Mapping institutional zones alongside resting order pools',
      caption:
        'Repeated taps weaken static S/R boundaries and stack stops just outside; fresh displacement zones drive cleaner directional delivery.',
      legend: [
        { label: 'Supply / Resistance Zone', colorToken: '#f59e0b' },
        { label: 'Demand / Support Zone', colorToken: '#38bdf8' },
        { label: 'Displacement Delivery', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'sr1', label: 'Supply Zone', sublabel: 'Origin of Bearish Impulse', tone: 'liquidity' },
        { id: 'sr2', label: 'Mid-Range', sublabel: 'No-Trade Equilibrium', tone: 'neutral' },
        { id: 'sr3', label: 'Demand Floor', sublabel: 'Weakens After Multiple Taps', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Mark the nearest fresh Supply zone above price and Demand zone below price.',
        'Check departure strength: did the zone launch a real Break of Structure?',
        'Avoid blind entries in the middle of the range; wait for price to reach an extreme zone.',
      ],
    },
    chartScenarioIds: ['liq-bsl-ssl-range'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Demand Is Where Buyers Rushed In; Supply Is Where Sellers Took Over',
        summary:
          'When price shoots away from a small area very fast, it means big institutions left unfilled orders behind. When price comes back to visit that spot for the first time, those leftover orders often kick in again.',
        steps: [
          'Look for a fast, energetic move away from a tight cluster of candles.',
          'Draw a box around that starting cluster—that is your Supply or Demand zone.',
          'Wait patiently for price to return to the box instead of jumping in late.',
        ],
        keyTakeaway:
          'Fast departures mark institutional footprints; first revisits offer the cleanest reactions.',
        practiceSafeHint:
          'Check how forcefully price left the zone and whether it is being tested for the first time or the fourth time.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Step Supply & Demand Mapping Checklist',
        summary:
          'Filter out weak levels and keep only high-conviction institutional zones on your screen.',
        steps: [
          'Spot a decisive Break of Structure driven by wide-body displacement candles.',
          'Trace back to the compact 1–3 candle base right before that explosive launch.',
          'Confirm the zone is fresh (price has not already tapped and chewed through it).',
          'Wait for price to return to the zone and verify reaction before placing risk.',
        ],
        keyTakeaway:
          'Displacement + BOS + Freshness is the three-part filter for institutional zones.',
        practiceSafeHint:
          'Trace the origin of the strongest impulse leg rather than drawing lines across random minor wicks.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'XAU/USD 1H Range Zones at 2348.5 & 2324.0',
        summary:
          'Gold respects 2348.5 resistance and 2324.0 support twice, weakening both boundaries until an aggressive supply injection above 2348.5 drives straight through the exhausted 2324.0 floor.',
        steps: [
          'First visits to 2348.5 and 2324.0 produce crisp bounces.',
          'By the third approach, repeated taps drain resting support bids and stack stops right outside.',
          'Fresh supply enters above 2348.5 and slices cleanly through 2324.0.',
        ],
        keyTakeaway:
          'Repeated touches weaken S/R floors while fresh displacement zones break through them.',
        practiceSafeHint:
          'Count how many times price already tested the boundary before expecting another bounce.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Ice Cracking Under Repeated Footsteps',
        summary:
          'Fresh support is thick ice that easily holds your weight on the first step. Jumping on the exact same spot four times weakens the ice until the next heavy step breaks straight through.',
        steps: [
          'First tap absorbs a portion of resting orders.',
          'Each subsequent tap thins out the remaining liquidity.',
          'Eventually opposing momentum breaks through and flips the old floor into a ceiling.',
        ],
        keyTakeaway:
          'More touches do not make a level stronger—they gradually exhaust the resting orders.',
        practiceSafeHint:
          'Ask whether a level is freshly unmitigated or already worn down by multiple tests.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Retail Support/Resistance vs. Institutional Supply/Demand',
        summary:
          'Understanding both concepts helps you see why traditional lines fail right when fresh S&D succeeds.',
        steps: [
          'Retail S/R: Horizontal line drawn across 3+ obvious historical touches (often turns into a liquidity target).',
          'Institutional S&D: Fresh basing zone that caused violent displacement and a BOS (unfilled institutional orders).',
        ],
        keyTakeaway:
          'Use retail S/R to see where the crowd sits, and institutional S&D to see where smart money launched moves.',
        practiceSafeHint:
          'Compare a repeatedly tapped horizontal line against a fresh origin of explosive displacement.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Zone-Drawing Errors That Clutter Charts',
        summary:
          'Clean charts produce clear decisions; avoid turning your screen into a rainbow grid.',
        steps: [
          'Mistake 1: Drawing 15 tiny zones so price is "always" hitting a zone.',
          'Mistake 2: Buying a 4th or 5th tap of support blindly without noticing weakening bounces.',
          'Mistake 3: Marking supply zones that failed to break any meaningful market structure.',
        ],
        keyTakeaway:
          'Less is more—only mark fresh zones that actually broke structure.',
        practiceSafeHint:
          'Verify whether the zone actually caused a Break of Structure before trusting it.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-sr-1',
        lessonSlug: 'support-resistance-supply-demand',
        conceptKey: 'support-resistance-supply-demand',
        scenarioId: 'liq-bsl-ssl-range',
        prompt:
          'What is the strongest sign that a Supply or Demand zone holds genuine institutional orders?',
        options: [
          { id: 'a', label: 'Price drifted lazily sideways out of the zone for 20 candles' },
          { id: 'b', label: 'Explosive displacement candles launched out of the zone and printed a Break of Structure' },
          { id: 'c', label: 'Price already bounced off the exact same zone six times' },
          { id: 'd', label: 'It aligns with a random moving average on a 1-minute chart' },
        ],
        correctOptionId: 'b',
        hints: [
          'Recall what departure speed and Break of Structure reveal about order imbalance.',
        ],
        postSubmissionRationale:
          'Violent displacement leaving an imbalance and breaking structure proves large institutional orders overwhelmed opposing flow at that origin zone.',
        commonTrapNote:
          'Weak zones with slow departures fail rapidly because no significant unfilled institutional orders remain.',
      },
      {
        id: 'pq-sr-2',
        lessonSlug: 'support-resistance-supply-demand',
        conceptKey: 'support-resistance-supply-demand',
        prompt:
          'What typically happens to a horizontal support zone after price tests it four times with progressively weaker bounces?',
        options: [
          { id: 'a', label: 'It becomes permanently unbreakable' },
          { id: 'b', label: 'Resting buy orders get exhausted and the level becomes prone to breaking down' },
          { id: 'c', label: 'Market makers double the support bids automatically' },
          { id: 'd', label: 'Support zones cannot break on intraday timeframes' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember the cracking-ice analogy: what happens to resting bids on each visit?',
        ],
        postSubmissionRationale:
          'Each retest consumes resting buy limit orders while stacking tight stop-losses underneath, making repeated taps weaker rather than stronger.',
        commonTrapNote:
          'Textbook beginners assume "more touches = stronger support" and buy right before the breakdown.',
      },
      {
        id: 'pq-sr-3',
        lessonSlug: 'support-resistance-supply-demand',
        conceptKey: 'support-resistance-supply-demand',
        prompt:
          'What is a Polarity Flip (Role Reversal) in price action?',
        options: [
          { id: 'a', label: 'Changing your chart colors from green/red to black/white' },
          { id: 'b', label: 'When prior resistance breaks decisively and holds as new support on the retest' },
          { id: 'c', label: 'Trading both long and short at the exact same second' },
          { id: 'd', label: 'Moving your stop-loss above your entry immediately' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how broken ceilings behave once price accepts above them.',
        ],
        postSubmissionRationale:
          'Once buyers break decisively through resistance, trapped shorts and waiting buyers turn that former ceiling into a new demand/support floor.',
        commonTrapNote:
          'Continuing to sell a broken resistance zone after full-body acceptance fights the new order flow.',
      },
    ],
  },

  // =========================================================================
  // MODULE 8: Order Blocks, CHoCH & Institutional Displacement
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000009',
    slug: 'order-blocks-bos-choch',
    title: 'Order Blocks, CHoCH & Institutional Displacement',
    subtitle:
      'Pinpoint high-probability institutional Order Blocks, confirm real Change of Character (CHoCH) reversals, and avoid inducement traps.',
    level: 'intermediate',
    marketCategory: 'general',
    learningStage: 'price_action_smc',
    moduleOrder: 8,
    conceptKey: 'order-blocks-bos-choch',
    estimatedMinutes: 20,
    learningObjectives: [
      'Identify valid Bullish and Bearish Order Blocks (the last opposing candle before forceful displacement).',
      'Distinguish a genuine Change of Character (CHoCH) from a continuation Break of Structure (BOS).',
      'Filter high-probability Order Blocks using liquidity sweeps, Fair Value Gaps, and unmitigated freshness.',
      'Avoid trading low-probability "inducement" Order Blocks sitting right ahead of resting liquidity.',
    ],
    prerequisites: [
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Liquidity Sweeps vs. True Breakouts',
      'Fair Value Gaps (FVG) & Institutional Imbalances',
    ],
    terminology: [
      {
        term: 'Order Block',
        shortCode: 'OB',
        definition:
          'The last opposing candle (down-close before a bullish impulse, or up-close before a bearish impulse) that swept liquidity and launched displacement breaking structure.',
        example:
          'The final bearish 15m candle sweeping 1.0811 right before EUR/USD rockets upward and leaves an FVG.',
      },
      {
        term: 'Change of Character',
        shortCode: 'CHoCH',
        definition:
          'The first structural break in the OPPOSITE direction of the prevailing trend, warning that order flow has shifted.',
        example:
          'After a bearish sequence of LH/LL, price sweeps a low and closes cleanly above the most recent Lower High.',
      },
      {
        term: 'Displacement',
        shortCode: 'IMP',
        definition:
          'Energetic, wide-body consecutive candles that leave Fair Value Gaps and prove institutional commitment behind an Order Block.',
        example:
          'Two consecutive full-bodied candles cutting through prior structure with zero hesitation.',
      },
      {
        term: 'Inducement',
        shortCode: 'IDM',
        definition:
          'An attractive-looking early Order Block or minor swing placed right in front of the true extreme OB to lure impatient traders in early.',
        example:
          'Price slices through a shallow mid-range OB to tap the deeper unmitigated extreme OB below it.',
      },
    ],
    sections: [
      {
        id: 'ob-sec-1',
        heading: 'What Makes an Order Block Actually Valid?',
        body: 'Not every red candle before a green candle is an Order Block. Institutional Order Blocks must pass a strict three-part validation test before you ever place an alert on them.',
        bulletPoints: [
          'Criteria 1 — Liquidity Sweep: The OB (or its immediate wick) raids resting stops or taps a higher-timeframe POI.',
          'Criteria 2 — Displacement + Imbalance: Price blasts away with wide bodies leaving a visible Fair Value Gap.',
          'Criteria 3 — Structural Break: The move originating from the OB closes decisively past prior structure (BOS or CHoCH).',
        ],
        keyTakeaway:
          'No sweep + no displacement + no BOS/CHoCH = NOT a valid Order Block.',
      },
      {
        id: 'ob-sec-2',
        heading: 'CHoCH vs. BOS: Reading the Exact Shift in Order Flow',
        body: 'Beginners constantly mix up CHoCH and BOS, flipping bias on every minor pullback. Keep the distinction crystal clear:',
        bulletPoints: [
          'BOS (Break of Structure): Continuation break WITH the active trend (e.g., breaking a Higher High in an uptrend).',
          'CHoCH (Change of Character): First reversal break AGAINST the active trend (e.g., closing above the last Lower High after sweeping SSL).',
          'Highest-conviction CHoCH prints immediately after a higher-timeframe liquidity sweep—never in random mid-range.',
        ],
        keyTakeaway:
          'CHoCH signals the first shift; BOS confirms the new trend is continuing.',
      },
      {
        id: 'ob-sec-3',
        heading: 'Avoiding Inducement & Pairing OB + FVG Confluence',
        body: 'When an impulsive leg leaves both a Fair Value Gap and an Order Block directly beneath it, institutional orders often mitigate the FVG and tap the open (or 50% mean threshold) of the Order Block before launching.',
        bulletPoints: [
          'Favor the extreme Order Block that actually swept liquidity over shallow mid-leg blocks that act as inducement.',
          'Mark both the Open of the Order Block and its 50% midpoint (Mean Threshold); structural invalidation sits cleanly beyond the OB wick.',
          'If price closes a full body straight through the Order Block, respect invalidation—broken OBs often flip into Breaker Blocks.',
        ],
        keyTakeaway:
          'Liquidity Sweep + CHoCH + FVG sitting directly over a fresh Order Block is institutional A+ confluence.',
      },
    ],
    diagramConfig: {
      kind: 'fair_value_gap',
      title: 'Order Block + Fair Value Gap Displacement Model',
      subtitle: 'Last opposing candle before displacement creates a high-confluence mitigation zone',
      caption:
        'After sweeping local liquidity, the last down-close candle (Bullish OB) launches an FVG impulse; retracement into the OB/FVG zone fuels continuation.',
      legend: [
        { label: 'FVG + Order Block Confluence', colorToken: '#10b981' },
        { label: '50% Mean Threshold / CE', colorToken: '#f59e0b' },
        { label: 'CHoCH / BOS Expansion', colorToken: '#38bdf8' },
      ],
      annotations: [
        { id: 'ob1', label: 'Bullish OB', sublabel: 'Last Down Candle Sweeping SSL', tone: 'bullish' },
        { id: 'ob2', label: 'Displacement', sublabel: 'Wide Impulse + FVG Imbalance', tone: 'bullish' },
        { id: 'ob3', label: 'CHoCH / BOS', sublabel: 'Body Close Confirms Shift', tone: 'neutral' },
        { id: 'ob4', label: 'Mitigation', sublabel: 'Retrace Into FVG / OB Open', tone: 'liquidity' },
      ],
      walkthroughSteps: [
        'Confirm a liquidity sweep followed by strong displacement and a BOS or CHoCH.',
        'Mark the last opposing candle before the displacement alongside any adjoining FVG.',
        'Wait for controlled retracement into the unmitigated OB/FVG before executing with stops beyond the OB wick.',
      ],
    },
    chartScenarioIds: ['fvg-bullish-mitigation', 'ms-bullish-bos'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'An Order Block Is the Launchpad Candle Before a Rocket Move',
        summary:
          'Right before price shoots upward rapidly, big institutions often push price down for one last red candle to fill buy orders. When price returns to that launchpad candle, leftover orders often propel price upward again.',
        steps: [
          'Wait for a fast rocket move (displacement) that breaks a recent high or low.',
          'Look back at the single opposite-colored candle right at the start of that rocket.',
          'Wait for price to gently revisit that candle before looking for your entry.',
        ],
        keyTakeaway:
          'An Order Block only counts if it actually launched a strong move that broke structure.',
        practiceSafeHint:
          'Verify whether strong displacement and a structural break followed the candidate candle.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'Order Block 3-Box Validation Filter',
        summary:
          'Check off all three boxes before trusting any Order Block on your chart.',
        steps: [
          'Box 1: Did the candle (or adjacent swing) take out resting liquidity?',
          'Box 2: Did the very next candles displace rapidly and leave a Fair Value Gap?',
          'Box 3: Did that move close decisively beyond prior structure (CHoCH or BOS)?',
        ],
        keyTakeaway:
          'If any of the three boxes is missing, downgrade or skip the Order Block.',
        practiceSafeHint:
          'Check for sweep, FVG displacement, and confirmed candle-body structure break.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'EUR/USD 15m SSL Sweep Into Bullish OB + FVG',
        summary:
          'On our EUR/USD 15m FVG chart, Candle 9 sweeps local sell-side liquidity at 1.0811 right before Candles 10–12 explode higher, leaving the 1.0830–1.0846 FVG right above the institutional origin.',
        steps: [
          'Candle 9 dips to 1.0811 to collect resting sell stops.',
          'Immediate bullish displacement prints a 16-pip FVG and drives to 1.0872.',
          'Controlled pullback mitigates the imbalance above the origin and launches to 1.0911.',
        ],
        keyTakeaway:
          'Pairing the liquidity-sweeping OB with the FVG directly above it creates a clear execution zone.',
        practiceSafeHint:
          'Look just beneath the Fair Value Gap to locate the candle that swept liquidity before launching.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'A Sprinter Pulling Back Into the Starting Blocks',
        summary:
          'Before sprinting forward, a runner presses backward firmly against the starting blocks to generate explosive leverage. That backward press is the opposing Order Block candle right before displacement.',
        steps: [
          'The backward press collects liquidity (down-candle into stops).',
          'The explosive sprint forward creates the FVG and breaks structure.',
          'Returning to that footprint later tests whether the same buyers still defend the block.',
        ],
        keyTakeaway:
          'Opposing candles right before explosive impulses reveal institutional positioning.',
        practiceSafeHint:
          'Look for the final opposite-direction candle immediately preceding strong momentum.',
      },
      comparison: {
        style: 'comparison',
        headline: 'CHoCH vs. BOS vs. Fake Internal Shift',
        summary:
          'Know exactly which structural break confirms reversal and which confirms continuation.',
        steps: [
          'CHoCH: First body close against the prior trend right after a higher-timeframe sweep or POI tap.',
          'BOS: Body close continuing in the already established trend direction.',
          'Fake Internal Shift: Tiny 1m micro-break inside mid-range with no higher-timeframe liquidity taken.',
        ],
        keyTakeaway:
          'Anchor CHoCH to higher-timeframe liquidity raids so you do not call reversals prematurely.',
        practiceSafeHint:
          'Check whether the structural break goes WITH the active trend (BOS) or REVERSES it after a sweep (CHoCH).',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Order Block Mistakes That Drain Accounts',
        summary:
          'Most SMC learners fail with Order Blocks because they mark too many unvalidated candles.',
        steps: [
          'Mistake 1: Marking every opposing candle as an OB even when price drifted slowly with no FVG or BOS.',
          'Mistake 2: Buying a shallow mid-leg OB while an untouched extreme OB sits right below it (getting swept as inducement).',
          'Mistake 3: Setting limit orders blindly on mitigated OBs that price already visited earlier.',
        ],
        keyTakeaway:
          'Demand freshness, liquidity sweep, FVG displacement, and structural break on every OB.',
        practiceSafeHint:
          'Check whether the zone is unmitigated and directly preceded a real structural break.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ob-1',
        lessonSlug: 'order-blocks-bos-choch',
        conceptKey: 'order-blocks-bos-choch',
        scenarioId: 'fvg-bullish-mitigation',
        prompt:
          'Which combination validates a high-probability Bullish Order Block?',
        options: [
          { id: 'a', label: 'Any red candle followed by one tiny green doji' },
          { id: 'b', label: 'Last down-close candle that swept liquidity, followed by FVG displacement and a confirmed BOS/CHoCH' },
          { id: 'c', label: 'A green candle that already got mitigated three times inside sideways chop' },
          { id: 'd', label: 'A candle chosen purely because its wick touches a round number' },
        ],
        correctOptionId: 'b',
        hints: [
          'Recall the 3-box filter: liquidity sweep, displacement/imbalance, and structural break.',
        ],
        postSubmissionRationale:
          'A genuine Bullish Order Block sweeps resting liquidity, launches aggressive displacement leaving a Fair Value Gap, and closes decisively past prior structure.',
        commonTrapNote:
          'Marking random opposing candles without displacement turns Order Blocks into guesswork.',
      },
      {
        id: 'pq-ob-2',
        lessonSlug: 'order-blocks-bos-choch',
        conceptKey: 'order-blocks-bos-choch',
        prompt:
          'How does a Change of Character (CHoCH) differ from a Break of Structure (BOS)?',
        options: [
          { id: 'a', label: 'CHoCH is the first opposite break signaling a potential trend shift; BOS confirms continuation in the existing trend' },
          { id: 'b', label: 'BOS only occurs in Forex while CHoCH only occurs in Crypto' },
          { id: 'c', label: 'CHoCH uses wicks while BOS ignores candle closes' },
          { id: 'd', label: 'They are completely identical terms with no distinction' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about continuation WITH the trend versus the FIRST break AGAINST the trend.',
        ],
        postSubmissionRationale:
          'CHoCH marks the initial opposite break warning that order flow may be shifting, whereas BOS confirms ongoing continuation in the established trend direction.',
        commonTrapNote:
          'Calling a CHoCH without any prior liquidity sweep or higher-timeframe zone often traps you in a minor pullback.',
      },
      {
        id: 'pq-ob-3',
        lessonSlug: 'order-blocks-bos-choch',
        conceptKey: 'order-blocks-bos-choch',
        prompt:
          'Why do impatient traders frequently get stopped out on shallow mid-leg Order Blocks?',
        options: [
          { id: 'a', label: 'Because mid-leg blocks often act as inducement liquidity before price sweeps down to the deeper extreme OB' },
          { id: 'b', label: 'Because extreme Order Blocks never get reached' },
          { id: 'c', label: 'Because brokers intentionally block mid-leg entries' },
          { id: 'd', label: 'Because Order Blocks only work on weekly charts' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about what happens when untouched liquidity rests just below an early Order Block.',
        ],
        postSubmissionRationale:
          'Shallow blocks sitting directly above resting liquidity frequently act as inducement; institutions sweep those early stops on the way into the unmitigated extreme OB.',
        commonTrapNote:
          'Always check whether clean liquidity or a deeper unmitigated zone sits right behind your entry.',
      },
    ],
  },

  // =========================================================================
  // MODULE 9: Multi-Timeframe Analysis (HTF Bias to LTF Entry)
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000010',
    slug: 'multi-timeframe-alignment',
    title: 'Multi-Timeframe Analysis (HTF Bias to LTF Entry)',
    subtitle:
      'Align Higher-Timeframe narrative with Lower-Timeframe precision so you stop getting whipsawed by low-timeframe noise.',
    level: 'intermediate',
    marketCategory: 'general',
    learningStage: 'price_action_smc',
    moduleOrder: 9,
    conceptKey: 'multi-timeframe-alignment',
    estimatedMinutes: 18,
    learningObjectives: [
      'Build a clean 3-timeframe top-down stack (Bias → Structure/POI → Execution) tailored to your trading style.',
      'Explain why Higher-Timeframe (HTF) structure and liquidity always override conflicting Lower-Timeframe (LTF) signals.',
      'Spot when an LTF downtrend is simply an HTF pullback into Discount demand.',
      'Execute refined LTF confirmation entries inside HTF Points of Interest to unlock tighter stops and larger R-multiples.',
    ],
    prerequisites: [
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Order Blocks, CHoCH & Institutional Displacement',
    ],
    terminology: [
      {
        term: 'Top-Down Analysis',
        shortCode: 'MTF',
        definition:
          'Analyzing charts strictly from higher timeframes down to lower timeframes so big-picture order flow governs execution.',
        example:
          'Daily/4H defines bullish draw on liquidity → 1H marks demand/FVG → 5m executes after CHoCH.',
      },
      {
        term: 'Point of Interest',
        shortCode: 'POI',
        definition:
          'A pre-marked Higher-Timeframe zone (Order Block, FVG, or liquidity pool) where you drop to lower timeframes to look for entry confirmation.',
        example:
          'Waiting for price to enter a 1H Bullish FVG before even opening the 5m chart.',
      },
      {
        term: 'Fractal Market Structure',
        shortCode: 'Fractal',
        definition:
          'The property that market structure repeats identically across timeframes—an HTF pullback consists of an LTF counter-trend.',
        example:
          'A 15m bearish LH/LL sequence forming simply as the retracement leg of a 4H bullish trend.',
      },
      {
        term: 'Premium & Discount',
        shortCode: 'P/D',
        definition:
          'Dividing an HTF dealing range at its 50% midpoint: buying in Discount (bottom half) and selling in Premium (top half).',
        example:
          'Waiting for EUR/USD to pull below 50% of the 4H impulse leg before taking a 5m long.',
      },
    ],
    sections: [
      {
        id: 'mtf-sec-1',
        heading: 'The 3-Timeframe Stack: Narrative, Setup, Trigger',
        body: 'Flipping randomly across nine different timeframes guarantees analysis paralysis. Professional traders lock into one consistent 3-timeframe stack where each chart has one clear job.',
        bulletPoints: [
          'Intraday / Day Trader Stack: Daily/4H (Bias & Draw on Liquidity) → 1H/15m (Structure & POI) → 5m/1m (Entry Trigger).',
          'Swing Trader Stack: Weekly/Daily (Bias) → 4H (Structure & POI) → 1H/15m (Entry Trigger).',
          'Never skip straight to the 1m or 5m chart before mapping your Higher-Timeframe bias and target.',
        ],
        keyTakeaway:
          'HTF tells you WHERE price wants to go; LTF tells you WHEN to enter with tight risk.',
      },
      {
        id: 'mtf-sec-2',
        heading: 'Understanding Fractal Pullbacks vs. Reversals',
        body: 'One of the biggest breakthroughs in trading is realizing that a bearish trend on the 5-minute chart is often just a routine pullback inside a bullish 4-hour trend.',
        bulletPoints: [
          'During an HTF bullish pullback, 5m charts print clean Lower Highs and Lower Lows down into 1H/4H Discount demand.',
          'Retail scalpers chase 5m shorts right into the 4H demand floor and get immediately reversed.',
          'Aligned traders wait for 5m bearish structure to tap the HTF POI and print a bullish CHoCH—rejoining the 4H wave.',
        ],
        keyTakeaway:
          'When timeframes disagree, respect the Higher Timeframe—it carries orders 10x larger.',
      },
      {
        id: 'mtf-sec-3',
        heading: 'Refining Entries Without Over-Refining Yourself Out of Trades',
        body: 'Dropping to the LTF inside an HTF Point of Interest lets you shrink a 40-pip 4H stop into a crisp 10-pip 5m stop—turning a 1:2 setup into a 1:5 asymmetric runner. Just avoid greedily waiting for microscopic 1-minute perfection that misses the move.',
        bulletPoints: [
          'Set alerts at your 1H or 15m POI so you do not stare at 1m noise for hours.',
          'Once alerted, wait for one clean LTF liquidity sweep + CHoCH/displacement aligned with HTF bias.',
          'Target the HTF opposing liquidity pool rather than closing nervously at the first tiny LTF swing.',
        ],
        keyTakeaway:
          'HTF target + LTF confirmation entry = institutional asymmetry with minimal screen fatigue.',
      },
    ],
    diagramConfig: {
      kind: 'market_structure',
      title: 'Top-Down Alignment: HTF Staircase + LTF Entry Confirmation',
      subtitle: 'Joining Higher-Timeframe expansion right after the pullback ends',
      caption:
        'A Higher-Timeframe Higher Low (HL) holds Discount demand; once LTF structure shifts bullish inside that zone, price expands to the next HTF BOS.',
      legend: [
        { label: 'HTF Bullish Expansion', colorToken: '#10b981' },
        { label: 'LTF Counter-Trend Pullback', colorToken: '#64748b' },
        { label: 'HTF Draw on Liquidity (BOS)', colorToken: '#38bdf8' },
      ],
      annotations: [
        { id: 'mtf1', label: 'HTF Bias', sublabel: '4H/1H Bullish Structure', tone: 'bullish' },
        { id: 'mtf2', label: 'HTF POI', sublabel: 'Discount Demand / FVG', tone: 'liquidity' },
        { id: 'mtf3', label: 'LTF CHoCH', sublabel: '5m Re-Alignment Trigger', tone: 'bullish' },
        { id: 'mtf4', label: 'HTF Target', sublabel: 'External Liquidity Pool', tone: 'neutral' },
      ],
      walkthroughSteps: [
        'Establish directional bias and external target on your Higher Timeframe first.',
        'Mark the nearest Discount/Premium POI and wait patiently for price to arrive.',
        'Drop to your LTF only inside the POI and execute once LTF structure re-aligns with HTF flow.',
      ],
    },
    chartScenarioIds: ['ms-bullish-bos', 'sweep-bsl-displacement'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Zoom Out for the Map, Zoom In for the Turn',
        summary:
          'Using multiple timeframes is just like GPS navigation: the zoomed-out map shows which highway takes you to your city (HTF bias), while street view shows the exact moment to merge safely (LTF entry).',
        steps: [
          'Open the 4H or 1H chart first to see if the overall highway is heading up or down.',
          'Mark a key zone where you expect buyers or sellers to step in.',
          'Switch to the 5m or 15m chart only when price reaches your zone to time your entry.',
        ],
        keyTakeaway:
          'Never drive by staring only at street view—always check the highway map first.',
        practiceSafeHint:
          'Check whether the lower-timeframe move aligns with or fights the larger timeframe trend.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Step Top-Down Routine Every Morning',
        summary:
          'Spend 5 minutes aligning your charts before placing a single order.',
        steps: [
          'Step 1 (Daily/4H): Identify trend direction and mark the nearest untouched external BSL/SSL target.',
          'Step 2 (1H/15m): Highlight the clean FVG or Order Block in Discount (for longs) or Premium (for shorts).',
          'Step 3 (5m): Wait for price to tap that zone, sweep local liquidity, and shift structure back in HTF direction.',
        ],
        keyTakeaway:
          'Alignment across all three timeframes dramatically raises trade quality and cuts overtrading.',
        practiceSafeHint:
          'Verify that bias, POI location, and entry trigger all point in the same direction.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Connecting EUR/USD 15m Trend With 5m Sweep Execution',
        summary:
          'When 15m/1H structure is bullish (HH/HL), a 5m sweep of an internal low into 15m demand produces high-momentum continuation; fighting 1H flow on isolated 5m candles creates quick stop-outs.',
        steps: [
          '15m prints clear HH/HL progression above protected 1.0816.',
          'Pullback into 1.0849 looks bearish on 1m/5m until 5m reclaims structure upward.',
          'Re-alignment drives cleanly through 1.0878 for BOS #2.',
        ],
        keyTakeaway:
          'Let the 5m chart confirm that the 15m/1H pullback has actually finished.',
        practiceSafeHint:
          'Identify which timeframe defines the overall trend and which refines the entry timing.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Surfing With the Swell Instead of Paddling Into Chop',
        summary:
          'The ocean swell is the 4H/Daily trend; surface ripples are the 1m/5m candles. Smart surfers wait for a surface ripple to line up with the main swell rather than fighting the giant wave.',
        steps: [
          'Respect the direction of the main swell first.',
          'Use small ripples only to time your pop-up cleanly.',
        ],
        keyTakeaway:
          'Big waves always win when they collide with small ripples.',
        practiceSafeHint:
          'Determine which timeframe represents the dominant institutional wave.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Aligned MTF Setup vs. Conflicting LTF Scalp',
        summary:
          'See why the exact same 5-minute pattern wins big in one spot and fails instantly in another.',
        steps: [
          'Aligned MTF: 4H bullish + price at 1H Discount OB + 5m SSL sweep & CHoCH → high-R continuation.',
          'Conflicting LTF: 4H bearish + price directly under 1H Supply + random 5m bullish bounce → gets crushed.',
        ],
        keyTakeaway:
          'Higher-timeframe context multiplies or destroys any lower-timeframe setup.',
        practiceSafeHint:
          'Check what Higher-Timeframe zone sits directly in front of your lower-timeframe signal.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Multi-Timeframe Errors That Ruin Scalping Setups',
        summary:
          'Avoid these classic traps when switching between charts.',
        steps: [
          'Mistake 1: Starting on the 1-minute chart and forgetting a massive 4H resistance sits 5 pips ahead.',
          'Mistake 2: Checking 7 different timeframes until you find one that justifies an impulsive trade.',
          'Mistake 3: Taking profits too early at a tiny 5m swing when the 4H draw on liquidity is 4R away.',
        ],
        keyTakeaway:
          'Stick to one fixed 3-timeframe stack and let HTF zones filter your entries.',
        practiceSafeHint:
          'Ensure you are not entering directly into an opposing Higher-Timeframe supply or demand wall.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-mtf-1',
        lessonSlug: 'multi-timeframe-alignment',
        conceptKey: 'multi-timeframe-alignment',
        scenarioId: 'ms-bullish-bos',
        prompt:
          'The 4H chart is strongly bullish and pulling back into a fresh 1H Demand zone, while the 5m chart currently prints Lower Highs and Lower Lows. What is happening?',
        options: [
          { id: 'a', label: 'The 4H uptrend is permanently dead and you should short aggressively into 1H Demand' },
          { id: 'b', label: 'The 5m downtrend is simply the fractal retracement leg of the 4H trend; wait for a 5m bullish CHoCH inside 1H Demand' },
          { id: 'c', label: 'Multi-timeframe analysis does not work when timeframes disagree' },
          { id: 'd', label: 'Buy blindly without waiting for any zone or confirmation' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember how fractal market structure builds Higher-Timeframe pullbacks.',
        ],
        postSubmissionRationale:
          'An HTF pullback always appears as a counter-trend on lower timeframes. Waiting for the 5m chart to tap 1H Demand and shift bullish aligns both timeframes.',
        commonTrapNote:
          'Shorting a 5m downtrend straight into an untouched 4H/1H demand floor is the #1 scalping mistake.',
      },
      {
        id: 'pq-mtf-2',
        lessonSlug: 'multi-timeframe-alignment',
        conceptKey: 'multi-timeframe-alignment',
        prompt:
          'In a clean 3-timeframe stack (e.g., 4H → 1H → 5m), what is the primary job of the Highest Timeframe?',
        options: [
          { id: 'a', label: 'Fine-tuning a 3-pip stop-loss' },
          { id: 'b', label: 'Defining overall directional bias and the external draw on liquidity' },
          { id: 'c', label: 'Replacing risk management calculations' },
          { id: 'd', label: 'Finding 1-minute scalp entries' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think of the GPS highway map versus street view.',
        ],
        postSubmissionRationale:
          'The Higher Timeframe establishes directional bias and major liquidity targets; the Middle Timeframe maps POIs; the Lower Timeframe times entry confirmation.',
        commonTrapNote:
          'Using the 5m chart for macro bias leads to constant emotional flip-flopping.',
      },
      {
        id: 'pq-mtf-3',
        lessonSlug: 'multi-timeframe-alignment',
        conceptKey: 'multi-timeframe-alignment',
        prompt:
          'Why should traders avoid checking 8 or 9 different timeframes before entering a trade?',
        options: [
          { id: 'a', label: 'Because charting apps break if you switch timeframes' },
          { id: 'b', label: 'Because contradictory micro-signals cause analysis paralysis and confirmation bias' },
          { id: 'c', label: 'Because only the 1-hour chart shows candlesticks' },
          { id: 'd', label: 'Because institutions never look at more than one chart' },
        ],
        correctOptionId: 'b',
        hints: [
          'What happens when you hunt across 9 charts looking for permission to click buy?',
        ],
        postSubmissionRationale:
          'Too many timeframes create conflicting signals and encourage cherry-picking whichever chart supports an emotional impulse. Three structured timeframes give total clarity.',
        commonTrapNote:
          'Keep your timeframe stack fixed in your written trading plan so every session is repeatable.',
      },
    ],
  },

  // =========================================================================
  // MODULE 10: Forex Playbook: London & NY Killzones
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000011',
    slug: 'forex-sessions-killzones',
    title: 'Forex Playbook: London & NY Killzones',
    subtitle:
      'Trade high-volume institutional sessions (London & New York Killzones) using Asian Range sweeps, Power of 3, and major news filters.',
    level: 'intermediate',
    marketCategory: 'forex',
    learningStage: 'market_playbooks',
    moduleOrder: 10,
    conceptKey: 'forex-sessions-killzones',
    estimatedMinutes: 18,
    learningObjectives: [
      'Map the three core Forex liquidity sessions: Asian Range (Accumulation), London Killzone (Manipulation/Expansion), and NY Killzone (Continuation/Reversal).',
      'Apply the Power of 3 (AMD: Accumulation → Manipulation → Distribution) framework to major pairs like EUR/USD and GBP/USD.',
      'Explain why trading dead off-session hours destroys win rate through wide spreads and directionless chop.',
      'Manage high-impact macro catalysts (CPI, NFP, FOMC) without gambling into spread spikes.',
    ],
    prerequisites: [
      'Liquidity Sweeps vs. True Breakouts',
      'Multi-Timeframe Analysis (HTF Bias to LTF Entry)',
    ],
    terminology: [
      {
        term: 'Killzone',
        shortCode: 'KZ',
        definition:
          'Specific 2-to-3-hour institutional volume windows (London Open 02:00–05:00 NY time; NY Open 07:00–10:00 NY time) when daily highs, lows, and expansion legs form.',
        example:
          'GBP/USD sweeping Asian Low at 03:15 EST during London Killzone before rallying 70 pips.',
      },
      {
        term: 'Asian Range',
        shortCode: 'ASIA',
        definition:
          'The relatively tight overnight consolidation (typically 20:00–00:00 EST) whose high and low accumulate resting liquidity for London and NY.',
        example:
          'Marking EUR/USD Asian High (1.0865) and Asian Low (1.0840) before London opens.',
      },
      {
        term: 'Power of 3 (AMD)',
        shortCode: 'AMD',
        definition:
          'Intraday delivery cycle: Accumulation (tight Asian range) → Manipulation (Judas sweep of one side) → Distribution (true directional trend).',
        example:
          'Bullish daily bias: Asian consolidates → London dips below Asian Low (Manipulation) → NY expands upward (Distribution).',
      },
      {
        term: 'London–NY Overlap',
        shortCode: 'OVLP',
        definition:
          'The peak liquidity window (08:00–11:00 EST) when European and US bank desks are both active, delivering tightest spreads and fastest expansion.',
        example:
          'EUR/USD executing clean continuation pullbacks during the 08:30–10:00 EST overlap.',
      },
    ],
    sections: [
      {
        id: 'fx-sec-1',
        heading: 'Time + Price: Why Session Timing Matters in Forex',
        body: 'Forex trades 24 hours a day, five days a week—which traps beginners into overtrading during low-liquidity dead zones. Institutional desks concentrate order flow inside specific Killzones where real expansion occurs.',
        bulletPoints: [
          'Asian Session (20:00–00:00 EST): Typically builds tight consolidation on EUR/USD and GBP/USD (higher activity on JPY/AUD pairs).',
          'London Killzone (02:00–05:00 EST): Frequently raids Asian High or Low to establish the high or low of the day.',
          'New York Killzone (07:00–10:00 EST): Delivers either London trend continuation or a sharp reversal after 08:30 EST US data releases.',
        ],
        keyTakeaway:
          'A textbook setup during a Killzone has real volume behind it; the same pattern at 15:00 EST drifts sideways.',
      },
      {
        id: 'fx-sec-2',
        heading: 'The Asian Range Sweep & Power of 3 Playbook',
        body: 'On trending days, major FX pairs follow a repeatable Accumulation → Manipulation → Distribution rhythm around the midnight New York open.',
        bulletPoints: [
          'Step 1 (Accumulation): Mark the exact Asian Session High (BSL) and Asian Session Low (SSL).',
          'Step 2 (Manipulation / Judas Swing): Watch London or early NY sweep the opposing side (e.g., sweeping Asian Low on a bullish HTF bias day).',
          'Step 3 (Distribution): Wait for 5m displacement + CHoCH back inside the range and target the opposite Asian boundary and previous day high/low.',
        ],
        keyTakeaway:
          'Let London or early NY run the fake move first—then ride Distribution toward the opposite liquidity pool.',
      },
      {
        id: 'fx-sec-3',
        heading: 'Spread Hygiene, Correlation & High-Impact News',
        body: 'Major USD pairs move in tight correlation with the US Dollar Index (DXY). Respecting correlation and scheduled macro news prevents avoidable losses.',
        bulletPoints: [
          'Check DXY alignment: Bullish EUR/USD and GBP/USD setups carry much stronger odds when DXY is sweeping resistance and turning bearish.',
          'Never risk full size across EUR/USD and GBP/USD simultaneously—they are heavily correlated, effectively doubling your USD exposure.',
          'Stand aside 15 minutes before red-folder releases (CPI, NFP, FOMC) and trade the post-news displacement once spreads normalize.',
        ],
        keyTakeaway:
          'Focus on 1–2 liquid pairs inside one chosen Killzone instead of chasing 12 charts all day.',
      },
    ],
    diagramConfig: {
      kind: 'liquidity_pools',
      title: 'Forex Session Liquidity Map: Asian Range → Killzone Sweep',
      subtitle: 'Power of 3 (Accumulation, Manipulation, Distribution) across London & NY',
      caption:
        'Asian range builds BSL above its high and SSL below its low; Killzone manipulation sweeps one boundary before delivering to the opposing pool.',
      legend: [
        { label: 'Asian High / BSL Pool', colorToken: '#f59e0b' },
        { label: 'Asian Low / SSL Pool', colorToken: '#38bdf8' },
        { label: 'Killzone Distribution Move', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'fx1', label: 'Asian High', sublabel: 'Overnight BSL Magnet', tone: 'liquidity' },
        { id: 'fx2', label: 'Killzone Sweep', sublabel: 'London/NY Manipulation', tone: 'bearish' },
        { id: 'fx3', label: 'Asian Low', sublabel: 'Distribution Target (SSL)', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Box the Asian Session High and Low before London Killzone opens.',
        'Confirm HTF Daily/4H bias and check DXY inverse alignment.',
        'Wait for Killzone liquidity sweep + 5m shift to trade Distribution cleanly.',
      ],
    },
    chartScenarioIds: ['sweep-ssl-bullish-shift', 'sweep-bsl-displacement'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Only Fish When the Institutional Boats Are Out',
        summary:
          'Even though Forex stays open 24 hours, big banks do most of their heavy trading during London Open and New York Open. Trading inside those 2–3 hour Killzones gives you cleaner, faster moves and fewer frustrating sideways traps.',
        steps: [
          'Box the overnight Asian High and Asian Low on EUR/USD or GBP/USD.',
          'Wait for London or New York Killzone to poke past one side and snap back inside.',
          'Trade back across the range instead of clicking buttons during sleepy afternoon hours.',
        ],
        keyTakeaway:
          'Pick ONE Killzone that fits your schedule and ignore the market outside that window.',
        practiceSafeHint:
          'Focus on session timing (London/NY Killzones) and how Asian highs/lows act as liquidity pools.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'Forex Killzone Pre-Session Routine',
        summary:
          'Execute this 4-step prep 15 minutes before London or NY Killzone opens.',
        steps: [
          'Check the economic calendar for red-folder USD, EUR, or GBP news releases.',
          'Mark Previous Day High/Low and the overnight Asian Range High/Low.',
          'Check DXY on the 1H chart to confirm inverse USD directional alignment.',
          'Wait for a Killzone sweep of an external high/low + 5m CHoCH before entering.',
        ],
        keyTakeaway:
          'Time + Liquidity + Structure turns Forex from 24/5 noise into a focused 2-hour business.',
        practiceSafeHint:
          'Check whether price swept a clear session boundary during an active Killzone window.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'GBP/USD 5m SSL Sweep Under 1.2640 Session Lows',
        summary:
          'In our GBP/USD 5m scenario, flat session lows at 1.2640 build SSL until a sharp Killzone wick dips to 1.2621, reclaims 1.2640, breaks 1.2668 bullish, and expands cleanly to 1.2718.',
        steps: [
          'Twin lows at 1.2640 frame clear sell-side liquidity.',
          'Rapid manipulation wick to 1.2621 harvests stops and closes back above 1.2640.',
          'Bullish BOS above 1.2668 launches smooth Distribution higher.',
        ],
        keyTakeaway:
          'London/NY sweeps of clean session lows offer crisp structural stops and smooth follow-through.',
        practiceSafeHint:
          'Trace how the sweep of session Equal Lows transitioned directly into bullish displacement.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Rush Hour Trains vs. Empty Midnight Stations',
        summary:
          'Trying to catch a big Forex trend during dead late-afternoon hours is like waiting for an express train at 2 a.m. Killzones are rush hour—liquidity is deep, spreads are tight, and express trains leave on schedule.',
        steps: [
          'Asian range loads passengers (resting stops) on both platforms.',
          'London and NY Killzones dispatch the express directional move.',
        ],
        keyTakeaway:
          'Show up during rush hour (Killzones) and close your platform when liquidity dries up.',
        practiceSafeHint:
          'Match your execution window to peak European and US institutional volume.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Killzone Execution vs. Off-Session Overtrading',
        summary:
          'Same trader, same chart pattern—drastically different equity curves.',
        steps: [
          'Killzone Window (London / NY Open): Tight spreads, clean sweeps of Asian H/L, decisive follow-through to 2R–3R.',
          'Dead Zone (NY Afternoon / Pre-Asia): Wide spreads, fake breakouts that stall 5 pips later, slow chop.',
        ],
        keyTakeaway:
          'Filtering out off-session trades is one of the fastest ways to boost Forex profitability.',
        practiceSafeHint:
          'Evaluate whether active bank volume is present to actually carry price to your target.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Classic Forex Playbook Mistakes',
        summary:
          'Protect your FX account by cutting these common habits.',
        steps: [
          'Mistake 1: Taking simultaneous full-risk longs on EUR/USD, GBP/USD, and AUD/USD (3x hidden USD risk).',
          'Mistake 2: Holding tight 10-pip stops straight through an 08:30 EST CPI or NFP release.',
          'Mistake 3: Trading random pairs at 16:00 EST out of boredom after missing the morning Killzone.',
        ],
        keyTakeaway:
          'Respect USD correlation, step aside for red-folder spikes, and trade only your chosen Killzone.',
        practiceSafeHint:
          'Check for correlated exposure and high-impact news timing before placing orders.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-fx-1',
        lessonSlug: 'forex-sessions-killzones',
        conceptKey: 'forex-sessions-killzones',
        scenarioId: 'sweep-ssl-bullish-shift',
        prompt:
          'In the Power of 3 (AMD) Forex framework on a bullish daily bias day, what typically happens during the Manipulation phase?',
        options: [
          { id: 'a', label: 'Price dips briefly below the Asian Low or midnight open to sweep Sell-Side Liquidity before expanding upward' },
          { id: 'b', label: 'Price freezes flat for 12 consecutive hours' },
          { id: 'c', label: 'Spreads disappear completely during NFP' },
          { id: 'd', label: 'Price rallies straight up without ever creating a pullback' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about which side of the Asian range gets raided to fuel a bullish Distribution leg.',
        ],
        postSubmissionRationale:
          'On bullish AMD days, Manipulation sweeps Sell-Side Liquidity below the Asian Low (Judas swing) to fill institutional buys before Distribution drives price higher.',
        commonTrapNote:
          'Selling the initial London dip below Asian Low without checking HTF bullish bias traps you in Manipulation.',
      },
      {
        id: 'pq-fx-2',
        lessonSlug: 'forex-sessions-killzones',
        conceptKey: 'forex-sessions-killzones',
        prompt:
          'You risk 1% long on EUR/USD and simultaneously risk 1% long on GBP/USD ahead of US news. What is the hidden risk issue?',
        options: [
          { id: 'a', label: 'Zero issue—they are totally unrelated markets' },
          { id: 'b', label: 'Strong positive correlation against USD means you effectively doubled exposure to one Dollar move (2% risk)' },
          { id: 'c', label: 'GBP/USD cannot move during NY session' },
          { id: 'd', label: 'Both trades automatically hedge each other to zero risk' },
        ],
        correctOptionId: 'b',
        hints: [
          'Notice both pairs have USD as the quote currency.',
        ],
        postSubmissionRationale:
          'EUR/USD and GBP/USD share strong positive correlation via the US Dollar. Entering full risk on both exposes your account to ~2R loss from a single USD spike.',
        commonTrapNote:
          'Pick the single cleanest pair (or split your 1% risk in half) rather than stacking correlated pairs.',
      },
      {
        id: 'pq-fx-3',
        lessonSlug: 'forex-sessions-killzones',
        conceptKey: 'forex-sessions-killzones',
        prompt:
          'Why do professional Forex traders focus on London Killzone (02:00–05:00 EST) and New York Killzone (07:00–10:00 EST)?',
        options: [
          { id: 'a', label: 'Because brokers shut down charts during other hours' },
          { id: 'b', label: 'Because peak institutional bank volume creates tight spreads, clean sweeps, and reliable directional follow-through' },
          { id: 'c', label: 'Because candles only close on the hour during Killzones' },
          { id: 'd', label: 'Because losses are impossible during the London–NY overlap' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare liquidity depth and spread conditions during major session opens versus late afternoon.',
        ],
        postSubmissionRationale:
          'Institutional order flow peaks during London and New York opens, delivering tighter spreads and the directional momentum needed for asymmetric targets.',
        commonTrapNote:
          'Trading dead late-day sessions exposes you to slow whipsaws and wider spreads.',
      },
    ],
  },

  // =========================================================================
  // MODULE 11: Indices Playbook: NAS100 & US30 NY Open
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000012',
    slug: 'indices-ny-open-playbook',
    title: 'Indices Playbook: NAS100 & US30 NY Open',
    subtitle:
      'Navigate the explosive 09:30 EST US equities open on NAS100 and US30 using pre-market sweeps, SMT divergence, and volatility-adjusted sizing.',
    level: 'intermediate',
    marketCategory: 'indices',
    learningStage: 'market_playbooks',
    moduleOrder: 11,
    conceptKey: 'indices-ny-open-playbook',
    estimatedMinutes: 19,
    learningObjectives: [
      'Survive and capitalize on the 09:30 EST Opening Bell volatility spike without getting whipsawed in the first 3 minutes.',
      'Use Pre-Market High/Low (PMH/PML) and Previous Day High/Low as primary liquidity magnets on NAS100 and US30.',
      'Spot SMT Divergence between NAS100 (NQ) and US30/SPX500 (ES) to catch high-probability reversals.',
      'Adjust position size to wider index point swings so your fixed 1R risk never blows out on fast NAS100 candles.',
    ],
    prerequisites: [
      'Equal Highs & Equal Lows (Liquidity Pools)',
      'Liquidity Sweeps vs. True Breakouts',
    ],
    terminology: [
      {
        term: '09:30 EST Opening Bell',
        shortCode: 'NY Open',
        definition:
          'Cash open of NYSE and NASDAQ when institutional equity order books flood the market, triggering rapid liquidity sweeps and trend legs.',
        example:
          'NAS100 spiking 35 points above Pre-Market High at 09:31 EST before reversing 100 points lower.',
      },
      {
        term: 'SMT Divergence',
        shortCode: 'SMT',
        definition:
          'Smart Money Technique divergence where two correlated indices disagree at a key extreme (e.g., NAS100 sweeps a new high while SPX500/US30 fails to make a higher high).',
        example:
          'NAS100 breaks PMH at 18,546 while US30 prints a Lower High—signaling institutional distribution.',
      },
      {
        term: 'Pre-Market High / Low',
        shortCode: 'PMH / PML',
        definition:
          'The highest and lowest prices printed between 04:00–09:30 EST before the cash bell; prime initial targets at NY Open.',
        example:
          'Waiting for NAS100 to sweep PMH at 09:35 EST before taking a 5m displacement short.',
      },
      {
        term: '10:00 AM Reversal Window',
        shortCode: '10:00 Macro',
        definition:
          'Common inflection point 30 minutes after the bell (often alongside 10:00 EST US economic data) where the initial opening drive either reverses or reloads.',
        example:
          'Morning rally exhausts at 10:00 EST, sweeps London High, and shifts structure bearish.',
      },
    ],
    sections: [
      {
        id: 'idx-sec-1',
        heading: 'Respecting the 09:30 EST Cash Bell (Wait for the Dust)',
        body: 'NAS100 and US30 move with explosive speed at 09:30 EST as billions in market-on-open equity orders match simultaneously. Clicking market orders at 09:30:05 is pure roulette—the first 5 to 15 minutes exist to sweep both sides of retail stops.',
        bulletPoints: [
          'Mark Pre-Market High (PMH), Pre-Market Low (PML), and Previous Day High/Low before 09:15 EST.',
          'Let the 09:30–09:35 initial volatility spike sweep an obvious pre-market level first.',
          'Execute only after a clear 5m candle close confirms either a sweep reversal or accepted breakout.',
        ],
        keyTakeaway:
          'Survive 09:30–09:35 by watching hands-off; the real high-probability move starts right after the opening stop run.',
      },
      {
        id: 'idx-sec-2',
        heading: 'SMT Divergence Between NAS100, SPX500 & US30',
        body: 'Because NAS100, SPX500, and US30 are tightly correlated US equity indices, cracks in their correlation at key highs or lows reveal hidden institutional accumulation or distribution.',
        bulletPoints: [
          'Bearish SMT: NAS100 sweeps a Higher High above resistance while SPX500 or US30 fails to break its matching high.',
          'Bullish SMT: US30 sweeps a Lower Low below support while NAS100 holds a Higher Low.',
          'Never trade SMT in isolation—use it as high-octane confirmation at an HTF liquidity level + displacement.',
        ],
        keyTakeaway:
          'When correlated indices crack at a major high or low, institutional smart money is showing its hand.',
      },
      {
        id: 'idx-sec-3',
        heading: 'Index Speed, Point Value & Volatility Sizing',
        body: 'A 10-point stop on NAS100 can get tagged in four seconds of ordinary opening noise. Successful index traders respect ATR (Average True Range) and size down lots/contracts so wider structural stops still equal exactly 1R.',
        bulletPoints: [
          'Check current 5m candle range before NY Open—if candles are 25 points tall, do not force a tight 8-point stop.',
          'Reduce contract/lot size mathematically so a 30-point structural stop risks the exact same 0.5%–1% as a quiet day.',
          'Cap daily attempts strictly at 1–2 setups during 09:30–11:30 EST; index lunch hours (12:00–13:30 EST) are notorious chop.',
        ],
        keyTakeaway:
          'Wider index volatility demands smaller contract size—never tighter stops.',
      },
    ],
    diagramConfig: {
      kind: 'liquidity_sweep_vs_breakout',
      title: 'NY Open Index Behavior: Opening Sweep Reversal vs. Trend Drive',
      subtitle: 'Reading 09:30–10:15 EST NAS100/US30 price action at Pre-Market extremes',
      caption:
        'Left: 09:30 spike sweeps Pre-Market Equal Highs and snaps back with bearish displacement. Right: Full-bodied opening drive holds retest for trend-day expansion.',
      legend: [
        { label: 'Pre-Market High / Liquidity', colorToken: '#f59e0b' },
        { label: 'NY Open Sweep Reversal', colorToken: '#ef4444' },
        { label: 'Trend-Day Acceptance Drive', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'idx1', label: '09:30 Spike', sublabel: 'Sweeps PMH Stops', tone: 'bearish' },
        { id: 'idx2', label: '5m Shift', sublabel: 'Displacement + SMT Confirms', tone: 'bearish' },
        { id: 'idx3', label: 'Trend Drive', sublabel: 'Full Body Closes Above PMH', tone: 'bullish' },
        { id: 'idx4', label: 'Pullback Hold', sublabel: 'Do Not Fade Trend Days', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Mark PMH, PML, and Previous Day High/Low before 09:30 EST.',
        'Watch the opening 5m–15m response without forcing an instant market order.',
        'Verify SMT divergence or full-body acceptance before committing risk.',
      ],
    },
    chartScenarioIds: ['eqh-sweep-reversal', 'true-breakdown-momentum'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Let the 09:30 Bell Stampede Clear Before Stepping In',
        summary:
          'When the New York stock market bell rings at 09:30 EST, NAS100 and US30 jump wildly in both directions for a few minutes. Waiting 5–15 minutes lets the fake spike clear so you can follow the real morning trend.',
        steps: [
          'Draw lines on the Pre-Market High and Pre-Market Low before 09:30.',
          'Keep your hands off the mouse during the chaotic first 3–5 minutes.',
          'Look for a clear sweep + snap-back or strong hold outside the level once candles stabilize.',
        ],
        keyTakeaway:
          'Patience for just 10 minutes at NY Open saves you from 80% of index whipsaws.',
        practiceSafeHint:
          'Check whether the 5m candle closed back inside the pre-market highs or expanded cleanly outside.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'NAS100 / US30 NY Open 4-Step Playbook',
        summary:
          'A calm checklist for the fastest 90 minutes of the trading day.',
        steps: [
          '09:15 EST: Mark Daily bias, Previous Day H/L, and Pre-Market H/L on both NAS100 and SPX500/US30.',
          '09:30–09:40 EST: Watch which pre-market boundary gets attacked first and check for SMT divergence.',
          '09:40–10:30 EST: Enter only after 5m sweep + displacement + FVG/OB retrace (or held breakout retest).',
          '11:30 EST: Close charts before NY lunch chop degrades price action.',
        ],
        keyTakeaway:
          'One clean 09:40–10:30 setup pays far more than ten frantic 09:31 clicks.',
        practiceSafeHint:
          'Observe how the sweep wick and subsequent 5m displacement candle separate traps from real drives.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'NAS100 5m Triple Equal Highs Sweep at 18,520',
        summary:
          'In our NAS100 5m chart, three pre-open peaks cluster at 18,520 before an opening burst spikes to 18,546, snaps closed at 18,511, and cascades nearly 100 points to 18,424.',
        steps: [
          'Triple EQH at 18,520 loads resting stops directly overhead.',
          'Fast burst to 18,546 triggers breakout longs and short stops simultaneously.',
          'Close back at 18,511 + displacement below 18,482 unlocks a clean short.',
        ],
        keyTakeaway:
          'On indices, waiting for the 5m close after the spike turns chaos into precision.',
        practiceSafeHint:
          'Compare the 18,546 spike wick against the decisive bearish follow-through candle.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Black Friday Store Doors Opening',
        summary:
          'At 09:30 EST, the doors fly open and everyone shoves blindly in the doorway for the first 3 minutes. Smart shoppers step back for a moment, see where the real aisles clear out, and walk straight to the target.',
        steps: [
          'The doorway shove is the 09:30–09:35 stop run.',
          'Once the doorway clears, institutional direction reveals itself cleanly.',
        ],
        keyTakeaway:
          'Never stand in the middle of the 09:30 doorway without a clear candle close.',
        practiceSafeHint:
          'Wait for the initial volatility burst to resolve into clear structure.',
      },
      comparison: {
        style: 'comparison',
        headline: 'NY Open Sweep Reversal vs. Unstoppable Trend Day',
        summary:
          'Knowing when NOT to fade NAS100 protects your account on strong macro days.',
        steps: [
          'Sweep Reversal Day: Spike above PMH + SMT divergence + immediate 5m close back inside + displacement down.',
          'Trend Day: Full-bodied 5m/15m closes above PMH, all three indices moving in lockstep, shallow pullbacks holding.',
        ],
        keyTakeaway:
          'Never keep shorting a trend day when all three US indices are printing full-body higher highs.',
        practiceSafeHint:
          'Check whether correlated indices confirm divergence or show unified full-body expansion.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Account-Killer Mistakes on NAS100 & US30',
        summary:
          'Indices punish sloppy sizing faster than any other asset class.',
        steps: [
          'Mistake 1: Using the same huge lot size from a slow Forex pair on volatile NAS100.',
          'Mistake 2: Entering at 09:30:10 before any candle closes and getting stopped out both ways.',
          'Mistake 3: Overtrading choppy NY lunch hours (12:00–13:30 EST) and giving back morning gains.',
        ],
        keyTakeaway:
          'Respect index volatility with smaller size, post-09:35 confirmation, and a hard 11:30 cutoff.',
        practiceSafeHint:
          'Check stop width against actual index candle volatility and size down accordingly.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-idx-1',
        lessonSlug: 'indices-ny-open-playbook',
        conceptKey: 'indices-ny-open-playbook',
        scenarioId: 'eqh-sweep-reversal',
        prompt:
          'At 09:35 EST, NAS100 sweeps above its Pre-Market High while SPX500 and US30 fail to break their matching Pre-Market Highs. What signal just formed?',
        options: [
          { id: 'a', label: 'Bearish SMT Divergence warning of potential institutional distribution' },
          { id: 'b', label: 'Confirmed trend-day rally across all US equities' },
          { id: 'c', label: 'A broker data glitch that guarantees a long entry' },
          { id: 'd', label: 'Proof that NAS100 cannot reverse below 18,520' },
        ],
        correctOptionId: 'a',
        hints: [
          'Recall what it means when correlated indices crack apart at a major liquidity high.',
        ],
        postSubmissionRationale:
          'When NAS100 sweeps a high while SPX500/US30 print a lower high, Bearish SMT Divergence flags institutional distribution—especially when paired with a close back inside and bearish displacement.',
        commonTrapNote:
          'Still wait for structural confirmation (displacement/BOS) rather than shorting SMT blindly.',
      },
      {
        id: 'pq-idx-2',
        lessonSlug: 'indices-ny-open-playbook',
        conceptKey: 'indices-ny-open-playbook',
        prompt:
          'Normal 5-minute NAS100 candles at NY Open are currently 25 points wide, and your structural stop requires 35 points. How should you handle risk?',
        options: [
          { id: 'a', label: 'Force a tight 8-point stop anyway so you can trade larger contracts' },
          { id: 'b', label: 'Keep the 35-point structural stop and reduce contract/lot size so total loss still equals 0.5%–1%' },
          { id: 'c', label: 'Remove the stop-loss because indices always bounce back' },
          { id: 'd', label: 'Double contract size to make up for the wider stop' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember: never shrink structural stops to fit oversized positions—shrink position size to fit volatility.',
        ],
        postSubmissionRationale:
          'Scaling contract size down to match the 35-point structural stop protects your fixed 1R risk while giving the trade room to survive normal index volatility.',
        commonTrapNote:
          'Arbitrarily tight stops on NAS100 get hit by normal 1-minute bid-ask fluctuations.',
      },
      {
        id: 'pq-idx-3',
        lessonSlug: 'indices-ny-open-playbook',
        conceptKey: 'indices-ny-open-playbook',
        prompt:
          'Why do experienced index traders typically step away from NAS100/US30 between 12:00 and 13:30 EST?',
        options: [
          { id: 'a', label: 'US stock exchanges close for lunch' },
          { id: 'b', label: 'Volume drops sharply during NY lunch, producing choppy false signals that erode morning profits' },
          { id: 'c', label: 'Indices can only trend upward during lunch' },
          { id: 'd', label: 'Charting software pauses candlesticks at noon' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about institutional participation during the New York midday lull.',
        ],
        postSubmissionRationale:
          'NY lunch hours suffer lower institutional volume and erratic mean-reverting chop, making it the easiest time to give back gains earned during 09:30–11:30 EST.',
        commonTrapNote:
          'Protecting morning profits by stepping away during low-probability windows is a core pro habit.',
      },
    ],
  },

  // =========================================================================
  // MODULE 12: Crypto Playbook: 24/7 Volatility, BTC Dominance & Funding
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000013',
    slug: 'crypto-247-liquidity-playbook',
    title: 'Crypto Playbook: 24/7 Volatility, BTC Dominance & Funding',
    subtitle:
      'Adapt price action to 24/7 crypto markets using Bitcoin Dominance rotation, perpetual funding rate extremes, and liquidation cascade awareness.',
    level: 'intermediate',
    marketCategory: 'crypto',
    learningStage: 'market_playbooks',
    moduleOrder: 12,
    conceptKey: 'crypto-247-liquidity-playbook',
    estimatedMinutes: 20,
    learningObjectives: [
      'Use Bitcoin (BTC) and Bitcoin Dominance (BTC.D) to time when capital favors BTC versus altcoins.',
      'Read Perpetual Futures Funding Rates and Open Interest to spot crowded leverage ripe for liquidation squeezes.',
      'Manage 24/7 weekend liquidity traps, thin order books, and Monday CME/spot range sweeps.',
      'Control leverage strictly so high-volatility crypto wicks never trigger forced account liquidations.',
    ],
    prerequisites: [
      'Understanding Market Liquidity (Buy-Side & Sell-Side)',
      'Liquidity Sweeps vs. True Breakouts',
    ],
    terminology: [
      {
        term: 'Bitcoin Dominance',
        shortCode: 'BTC.D',
        definition:
          'Bitcoin’s percentage share of total cryptocurrency market capitalization—tracks whether capital is concentrating in BTC or rotating into altcoins.',
        example:
          'BTC breaks higher while BTC.D climbs steeply → capital favors BTC over lagging altcoins.',
      },
      {
        term: 'Funding Rate',
        shortCode: 'Funding',
        definition:
          'Periodic fee paid between perpetual futures longs and shorts to anchor contract price to spot; extreme positive funding signals overcrowded leveraged longs.',
        example:
          'Funding spiking sharply positive near resistance warns of an impending long liquidation flush.',
      },
      {
        term: 'Liquidation Cascade',
        shortCode: 'Squeeze',
        definition:
          'Forced closing of over-leveraged positions in rapid succession, creating massive sweep wicks that clear clustered stops in seconds.',
        example:
          'A fast 4% flash wick wiping 20x leveraged longs before BTC immediately snaps back up.',
      },
      {
        term: 'Weekend Thin Liquidity',
        shortCode: 'Wknd',
        definition:
          'Reduced institutional order-book depth on Saturdays and Sundays that often produces deceptive fakeouts reversed at Monday’s open.',
        example:
          'A Sunday night breakout above range highs that sweeps stops and retraces cleanly on Monday morning.',
      },
    ],
    sections: [
      {
        id: 'cry-sec-1',
        heading: 'Bitcoin & BTC Dominance: Follow the Capital Flow',
        body: 'In crypto, altcoins rarely move independently—Bitcoin sets the tide and Bitcoin Dominance (BTC.D) tells you where liquidity is flowing first. Ignoring BTC while trading an altcoin chart is trading half-blind.',
        bulletPoints: [
          'BTC Up + BTC.D Up: Money is pouring into Bitcoin first—trade BTC rather than fighting sluggish altcoins.',
          'BTC Consolidating/Up + BTC.D Down: Capital is rotating out of BTC into altcoins—highest-probability window for altcoin breakouts.',
          'BTC Dropping Sharply: Almost all altcoins drop harder; avoid buying "cheap" altcoin dips while BTC is breaking structure downward.',
        ],
        keyTakeaway:
          'Always check BTC structure and BTC.D direction before executing any altcoin setup.',
      },
      {
        id: 'cry-sec-2',
        heading: 'Funding Rates, Open Interest & Leverage Flushes',
        body: 'Unlike spot stocks or Forex, crypto derivatives display real-time leverage crowding via perpetual funding rates and Open Interest. Crowded leverage creates explosive liquidity magnets.',
        bulletPoints: [
          'Extreme positive funding + surging Open Interest at resistance = crowded longs vulnerable to a sharp long squeeze.',
          'Deeply negative funding at higher-timeframe demand = trapped shorts vulnerable to a violent short squeeze.',
          'Healthiest crypto breakouts occur when spot buying leads while funding stays neutral or slightly cool.',
        ],
        keyTakeaway:
          'Extreme funding + stalled price at a key level is a warning flare for a leverage flush.',
      },
      {
        id: 'cry-sec-3',
        heading: 'Surviving 24/7 Markets, Weekends & Leverage Traps',
        body: 'Because crypto never closes, over-leveraged traders get liquidated in their sleep and burn out staring at charts on Sunday nights.',
        bulletPoints: [
          'Treat weekend breakouts with extra skepticism—wait for Monday London/NY liquidity to confirm real acceptance.',
          'Never confuse exchange leverage (e.g., 20x) with position risk: size strictly by fixed 0.5%–1% account risk to your structural stop, never your liquidation price.',
          'Favor clean 15m/1H/4H structure (like our BTC/USD 65,400 breakout retest) over noisy 1m crypto candles prone to scam wicks.',
        ],
        keyTakeaway:
          'In 24/7 crypto, low effective leverage and patience through weekend noise keep you solvent for real trends.',
      },
    ],
    diagramConfig: {
      kind: 'liquidity_sweep_vs_breakout',
      title: 'Crypto Breakout Acceptance vs. Leveraged Liquidation Wick',
      subtitle: 'Separating spot-driven breakouts from overcrowded perpetual stop hunts',
      caption:
        'Left: Crowded leverage gets flushed in a sharp liquidation sweep wick. Right: Spot-backed BTC breakout closes full-bodied above resistance and holds retest.',
      legend: [
        { label: 'Key Range / Liquidation Cluster', colorToken: '#f59e0b' },
        { label: 'Leverage Flush / Sweep', colorToken: '#ef4444' },
        { label: 'Spot-Driven Breakout & Retest', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'cry1', label: 'Crowded Longs', sublabel: 'High Funding + Resistance', tone: 'liquidity' },
        { id: 'cry2', label: 'Flush Wick', sublabel: 'Liquidates High Leverage', tone: 'bearish' },
        { id: 'cry3', label: 'Spot Break', sublabel: 'Full Close + Neutral Funding', tone: 'bullish' },
        { id: 'cry4', label: 'Clean Retest', sublabel: 'Holds Former Ceiling', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Check BTC structure, BTC.D rotation, and perpetual funding before planning entries.',
        'Require full-body acceptance and held retests on breakouts rather than chasing vertical green spikes.',
        'Size positions strictly to structural stops—never anywhere near liquidation levels.',
      ],
    },
    chartScenarioIds: ['true-breakout-retest', 'liq-bsl-ssl-range'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Bitcoin Is the Leader, and Funding Tells You When the Crowd Is Over-Betting',
        summary:
          'In crypto, money almost always flows into Bitcoin first before spilling into altcoins. Meanwhile, extreme funding rates act like a crowded boat leaning too far to one side—making a sudden flip much more likely.',
        steps: [
          'Check Bitcoin’s chart first before trading any smaller coin.',
          'Avoid chasing giant green pumps when funding rates are sky-high.',
          'Trade with small risk and real stop-losses so overnight crypto wicks can never wipe you out.',
        ],
        keyTakeaway:
          'Respect Bitcoin’s direction, fade overcrowded euphoria carefully, and keep leverage disciplined.',
        practiceSafeHint:
          'Consider how BTC dominance and funding crowd positioning interact with clean price structure.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'Crypto 4-Check Pre-Trade Filter',
        summary:
          'Run these four checks before entering any BTC or altcoin setup.',
        steps: [
          'BTC Context: Is BTC bullish, ranging, or breaking down on the 4H/1H?',
          'BTC.D Flow: Does dominance support trading BTC directly or rotating into an altcoin?',
          'Funding Check: Are perpetual funding rates neutral (healthy) or wildly overcrowded?',
          'Structure & Retest: Did price confirm a sweep or clean breakout retest on 15m/1H?',
        ],
        keyTakeaway:
          'Adding BTC.D and funding context eliminates half of crypto’s nastiest fakeouts.',
        practiceSafeHint:
          'Verify clean candle-body acceptance and support retest rather than chasing mid-candle.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'BTC/USD 15m Breakout Acceptance Above 65,400',
        summary:
          'On our BTC/USD 15m chart, higher lows coil tightly beneath 65,400 before Candle 19 closes full-bodied at 65,820, holds 65,425 cleanly on retest, and trends to 67,050.',
        steps: [
          'Tight higher lows under 65,400 show steady spot absorption.',
          'Decisive full-body close at 65,820 confirms genuine acceptance.',
          'Patient traders buying the held retest near 65,425 capture the full expansion cleanly.',
        ],
        keyTakeaway:
          'Waiting for breakout close + held retest lets you ride crypto trends without getting flushed.',
        practiceSafeHint:
          'Look at how the pullback respected 65,400 from above without closing back inside.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'A Crowded Boat Tipping Over',
        summary:
          'When everyone rushes to stand on the exact same side of a small boat (extreme positive funding + high leverage), even a mild ripple tips the whole boat over (liquidation cascade) before the water calms down.',
        steps: [
          'High funding shows too many traders leaning aggressively in one direction.',
          'A swift liquidation flush clears the boat and resets healthy price discovery.',
        ],
        keyTakeaway:
          'Do not be the last person jumping onto an overcrowded side of the boat.',
        practiceSafeHint:
          'Watch for overcrowded leverage positioning right underneath resistance or above support.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Healthy Spot Breakout vs. Over-Leveraged Fakeout',
        summary:
          'Spot demand builds lasting trends; pure leverage chases snap back violently.',
        steps: [
          'Spot Breakout: Neutral funding, higher lows coiling, full-body close + held retest.',
          'Leveraged Fakeout: Spiking positive funding, long upper wick above resistance, instant liquidation dump back inside range.',
        ],
        keyTakeaway:
          'Combine candlestick confirmation with funding discipline to stay on the winning side.',
        practiceSafeHint:
          'Contrast full-body acceptance and held retests against sudden leveraged rejection wicks.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Fatal Crypto Trading Mistakes',
        summary:
          'Crypto volatility amplifies bad habits immediately—avoid all three.',
        steps: [
          'Mistake 1: Using 25x–50x leverage with your liquidation price acting as your "stop-loss."',
          'Mistake 2: Buying altcoin breakouts while BTC is breaking down and BTC.D is surging.',
          'Mistake 3: Chasing Sunday night thin-book spikes that completely reverse on Monday morning.',
        ],
        keyTakeaway:
          'Size by fixed 1R risk to a real stop-loss, respect BTC flow, and filter weekend chop.',
        practiceSafeHint:
          'Check whether risk is defined by structural invalidation rather than exchange liquidation.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-cry-1',
        lessonSlug: 'crypto-247-liquidity-playbook',
        conceptKey: 'crypto-247-liquidity-playbook',
        prompt:
          'Bitcoin is rallying strongly while Bitcoin Dominance (BTC.D) is also climbing steeply. What does this typically indicate about capital flow?',
        options: [
          { id: 'a', label: 'Liquidity is concentrating into Bitcoin first, so altcoins often lag until BTC stabilizes and BTC.D cools' },
          { id: 'b', label: 'Bitcoin is about to go to zero while altcoins double' },
          { id: 'c', label: 'Funding rates have been permanently turned off' },
          { id: 'd', label: 'Altcoins are completely decoupled from Bitcoin' },
        ],
        correctOptionId: 'a',
        hints: [
          'Remember what rising BTC.D means about Bitcoin’s share of total crypto market cap.',
        ],
        postSubmissionRationale:
          'Rising BTC price alongside rising BTC.D signals capital flowing primarily into Bitcoin. Altcoins typically outperform later when BTC consolidates and BTC.D turns down.',
        commonTrapNote:
          'Forcing altcoin longs while BTC.D rockets upward often leaves you stuck in sluggish charts.',
      },
      {
        id: 'pq-cry-2',
        lessonSlug: 'crypto-247-liquidity-playbook',
        conceptKey: 'crypto-247-liquidity-playbook',
        prompt:
          'BTC stalls right under major resistance while perpetual Funding Rates spike deeply positive. What risk is building?',
        options: [
          { id: 'a', label: 'Zero risk—positive funding guarantees endless upward price movement' },
          { id: 'b', label: 'Overcrowded leveraged longs increase the probability of a sharp downward liquidation flush' },
          { id: 'c', label: 'Weekend exchanges are closing' },
          { id: 'd', label: 'Short sellers are paying longs to stay open' },
        ],
        correctOptionId: 'b',
        hints: [
          'Recall the crowded-boat analogy: who is paying whom when funding is extremely positive?',
        ],
        postSubmissionRationale:
          'Deeply positive funding means leveraged longs are paying shorts to stay open—signaling crowded long positioning that frequently gets flushed in a sudden liquidation sweep.',
        commonTrapNote:
          'Chasing late longs at resistance into extreme positive funding puts you straight in the liquidation path.',
      },
      {
        id: 'pq-cry-3',
        lessonSlug: 'crypto-247-liquidity-playbook',
        conceptKey: 'crypto-247-liquidity-playbook',
        scenarioId: 'true-breakout-retest',
        prompt:
          'Why should crypto traders treat Saturday/Sunday breakouts with extra caution compared to weekday sessions?',
        options: [
          { id: 'a', label: 'Because crypto prices cannot move on weekends' },
          { id: 'b', label: 'Because thinner weekend order books make stop-run fakeouts more common before institutional liquidity returns Monday' },
          { id: 'c', label: 'Because candlesticks are unavailable on Sundays' },
          { id: 'd', label: 'Because spot markets close on Saturdays' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare institutional order-book depth on Sunday night versus Monday London/NY sessions.',
        ],
        postSubmissionRationale:
          'Lower weekend institutional depth allows relatively small volume to push price beyond range boundaries temporarily, only to reverse once full liquidity returns Monday.',
        commonTrapNote:
          'Waiting for Monday acceptance or clean retests prevents getting trapped in weekend fakeouts.',
      },
    ],
  },

  // =========================================================================
  // MODULE 13: Stocks Playbook: Pre-Market Gaps, RVOL & Opening Range
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000014',
    slug: 'stocks-gaps-rvol-playbook',
    title: 'Stocks Playbook: Pre-Market Gaps, RVOL & Opening Range',
    subtitle:
      'Build a focused pre-market equity watchlist using fresh catalysts, Relative Volume (RVOL), VWAP, and Opening Range Breakouts (ORB).',
    level: 'intermediate',
    marketCategory: 'stocks',
    learningStage: 'market_playbooks',
    moduleOrder: 13,
    conceptKey: 'stocks-gaps-rvol-playbook',
    estimatedMinutes: 18,
    learningObjectives: [
      'Filter thousands of equities down to 2–4 "Stocks in Play" using pre-market gaps, fresh catalysts, and Relative Volume (RVOL ≥ 2.0).',
      'Execute clean Opening Range Breakouts (ORB) using 2-minute or 5-minute opening highs/lows and volume confirmation.',
      'Use VWAP (Volume Weighted Average Price) alongside market structure to filter institutional trend bias.',
      'Avoid low-volume midday chop and wide-spread illiquid tickers that shred retail stops.',
    ],
    prerequisites: [
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
      'Liquidity Sweeps vs. True Breakouts',
    ],
    terminology: [
      {
        term: 'Relative Volume',
        shortCode: 'RVOL',
        definition:
          'Current trading volume compared to the stock’s historical average for the same time of day; RVOL ≥ 2.0 signals active institutional interest.',
        example:
          'A stock trading 3.5x its normal opening volume after beating quarterly earnings.',
      },
      {
        term: 'Pre-Market Gap',
        shortCode: 'Gap',
        definition:
          'The overnight price jump between yesterday’s closing bell and today’s pre-market price triggered by earnings, guidance, or sector news.',
        example:
          'NVDA gapping up +5.2% pre-market on strong revenue guidance with heavy volume.',
      },
      {
        term: 'Opening Range Breakout',
        shortCode: 'ORB',
        definition:
          'Marking the High and Low of the first 2, 5, or 15 minutes after 09:30 EST and trading a confirmed expansion + retest outside that range.',
        example:
          'Buying a confirmed break and hold above the 5-minute Opening Range High aligned with VWAP.',
      },
      {
        term: 'VWAP',
        shortCode: 'VWAP',
        definition:
          'Volume Weighted Average Price—the institutional execution benchmark dividing intraday bullish control (above VWAP) from bearish control (below VWAP).',
        example:
          'Pullback holding above rising VWAP and Opening Range High before launching to new highs of day.',
      },
    ],
    sections: [
      {
        id: 'stk-sec-1',
        heading: 'Stock Selection First: Finding "Stocks in Play"',
        body: 'In equities, WHAT you trade matters just as much as HOW you trade. Even a flawless Opening Range setup fails on a sleepy stock drifting on average volume—you need institutional participation.',
        bulletPoints: [
          'Fresh Catalyst: Earnings surprise, guidance upgrade/cut, FDA/product announcement, or strong sector momentum.',
          'Pre-Market Gap + Clean Float/Liquidity: Clear overnight gap (typically ≥ 2%–3% on liquid large/mid caps) with tight penny spreads.',
          'Relative Volume (RVOL ≥ 2.0): Proves institutional desks are actively repricing the stock today.',
        ],
        keyTakeaway:
          'Narrow your morning watchlist to 2–3 high-RVOL Stocks in Play instead of scanning 50 sluggish tickers.',
      },
      {
        id: 'stk-sec-2',
        heading: 'Mapping Your Pre-Market Plan & Opening Range (ORB)',
        body: 'Before 09:30 EST, mark Pre-Market High (PMH), Pre-Market Low (PML), and Previous Day Close (gap-fill target). Once the bell rings, let the opening battle print a crisp Opening Range.',
        bulletPoints: [
          'Opening Range (2m or 5m): Box the exact High and Low formed right after 09:30 EST.',
          'Bullish ORB Checklist: Stock trading above VWAP + strong volume break above Opening Range High + clean pullback/hold (not a rejection wick).',
          'Gap-and-Go vs. Gap-and-Crap: If a gap-up stock loses VWAP and breaks below the Opening Range Low with heavy volume, respect the failure—never average down.',
        ],
        keyTakeaway:
          'Let the Opening Range + VWAP reveal whether institutions are accumulating the gap or selling into retail hype.',
      },
      {
        id: 'stk-sec-3',
        heading: 'Alignment With Market Tide (SPY / QQQ) & Risk Hygiene',
        body: 'Individual stocks rarely swim upstream when the broader market index (SPY/QQQ) plunges hard. Checking index alignment and respecting halts/spreads keeps equity execution clean.',
        bulletPoints: [
          'Best long ORBs occur when SPY/QQQ is holding green or pulling back mildly while your stock shows Relative Strength.',
          'Place stops structurally (below VWAP, below the Opening Range midpoint, or below the pullback Higher Low)—never arbitrary $0.10 stops on volatile $200 stocks.',
          'Scale position size strictly in shares: Shares = Dollar Risk ÷ (Entry Price − Stop Price).',
        ],
        keyTakeaway:
          'Stock in Play (RVOL) + VWAP alignment + SPY/QQQ tailwind + exact share-sizing math = repeatable equity edge.',
      },
    ],
    diagramConfig: {
      kind: 'equal_highs_lows',
      title: 'Pre-Market Range & Opening Range Breakout Structure',
      subtitle: 'Mapping Pre-Market High/Low, Opening Range, and breakout acceptance vs. trap',
      caption:
        'Clean pre-market highs concentrate opening orders; require volume-backed full-body acceptance above the range rather than chasing thin wick spikes.',
      legend: [
        { label: 'Pre-Market / Opening Range High', colorToken: '#f59e0b' },
        { label: 'Failed Gap / Sweep Trap', colorToken: '#ef4444' },
        { label: 'Volume-Backed ORB Continuation', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'stk1', label: 'PMH / ORH', sublabel: 'Key Breakout Level', tone: 'liquidity' },
        { id: 'stk2', label: 'RVOL Surge', sublabel: 'Institutional Confirmation', tone: 'bullish' },
        { id: 'stk3', label: 'Failed Break', sublabel: 'Rejection Wick Under VWAP', tone: 'bearish' },
      ],
      walkthroughSteps: [
        'Screen pre-market for fresh catalysts and RVOL ≥ 2.0 to pick 2–3 Stocks in Play.',
        'Mark PMH, PML, Prior Close, and the 2m/5m Opening Range right after 09:30 EST.',
        'Trade confirmed volume-backed acceptance above VWAP/ORH with exact share sizing.',
      ],
    },
    chartScenarioIds: ['true-breakout-retest', 'ms-bullish-bos'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Only Trade Stocks Everyone Is Paying Attention to Today',
        summary:
          'Out of thousands of stocks, only a handful have big news and heavy trading volume on any given morning. Pick 2–3 of those active stocks, box the first 5 minutes after the opening bell, and trade with the winning side.',
        steps: [
          'Check pre-market movers for fresh news (like earnings) and heavy volume (RVOL 2x+).',
          'Wait 2–5 minutes after 09:30 EST and draw the Opening Range High and Low.',
          'Look for strong buying above VWAP and the Opening Range High—never buy stocks sinking below VWAP.',
        ],
        keyTakeaway:
          'Fresh catalyst + high RVOL + clean Opening Range beats guessing random quiet tickers.',
        practiceSafeHint:
          'Check whether volume (RVOL), VWAP position, and candle closes support genuine breakout acceptance.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '08:45–10:00 EST Equity Trader Blueprint',
        summary:
          'Follow this exact pre-market to opening-hour sequence every morning.',
        steps: [
          '08:45 EST: Scan for liquid stocks gapping ≥ 2% on fresh news with strong pre-market volume.',
          '09:15 EST: Mark PMH, PML, and Yesterday’s Close on your top 3 tickers.',
          '09:30–09:35 EST: Box the Opening Range High/Low and watch VWAP + SPY/QQQ direction.',
          '09:35–10:15 EST: Execute confirmed ORB or VWAP pullback using Shares = Dollar Risk ÷ Stop Distance.',
        ],
        keyTakeaway:
          'A written pre-market plan eliminates frantic scanner-chasing after the bell rings.',
        practiceSafeHint:
          'Verify catalyst/RVOL selection first, then check full-body breakout acceptance and retest.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Full-Body Breakout & Retest Acceptance Model',
        summary:
          'Just like our true-breakout scenario, an A+ equity ORB coils tightly underneath the Opening Range High, breaks out with expanded volume and a full body, holds the broken level on retest, and trends cleanly.',
        steps: [
          'Tight higher lows form above VWAP right below the Opening Range High.',
          'High-volume expansion candle closes firmly above the range.',
          'Brief pullback holds former resistance as support before running to new High of Day.',
        ],
        keyTakeaway:
          'Real institutional ORBs hold their retest; fake gap spikes snap straight back below VWAP.',
        practiceSafeHint:
          'Distinguish full-body volume expansion + held retest from a fading wick spike.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Sailing Where the Wind Is Actually Blowing',
        summary:
          'Trading a low-RVOL stock is trying to sail on a glassy lake with zero wind. Relative Volume (RVOL ≥ 2.0) is a steady 20-knot breeze that actually fills your sails and carries price smoothly to target.',
        steps: [
          'News catalyst creates the weather system.',
          'RVOL measures the actual wind speed.',
          'Opening Range + VWAP shows which direction the wind is blowing.',
        ],
        keyTakeaway:
          'Never waste risk capital on windless low-RVOL tickers.',
        practiceSafeHint:
          'Ask whether RVOL proves active institutional wind behind the stock today.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Gap-and-Go (Hold Above VWAP) vs. Gap-and-Crap (Fade Below VWAP)',
        summary:
          'A big pre-market green gap does NOT automatically mean buy at the open.',
        steps: [
          'Gap-and-Go: Holds above VWAP, absorbs opening profit-taking, breaks Opening Range High on surging volume.',
          'Gap-and-Crap: Spikes at 09:30, immediately prints heavy red volume, loses VWAP and Opening Range Low—trapping late buyers.',
        ],
        keyTakeaway:
          'Let price action above or below VWAP confirm which gap scenario is playing out.',
        practiceSafeHint:
          'Watch whether the stock holds above VWAP and the Opening Range or rejects swiftly back underneath.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Beginner Equity Day-Trading Traps',
        summary:
          'Avoid these common stock-trading errors right at the open.',
        steps: [
          'Mistake 1: Buying a huge pre-market gap at 09:30:01 right as overnight holders take profits.',
          'Mistake 2: Buying fixed round share counts (like 100 shares of every stock) regardless of stop width.',
          'Mistake 3: Trading low-float, wide-spread penny stocks that slip past your stop-loss.',
        ],
        keyTakeaway:
          'Stick to liquid Stocks in Play, wait for ORB/VWAP confirmation, and compute exact share count every time.',
        practiceSafeHint:
          'Calculate share size from Dollar Risk ÷ Stop Distance and verify tight spreads.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-stk-1',
        lessonSlug: 'stocks-gaps-rvol-playbook',
        conceptKey: 'stocks-gaps-rvol-playbook',
        prompt:
          'Why do professional equity day traders screen for Relative Volume (RVOL) of 2.0 or higher before the open?',
        options: [
          { id: 'a', label: 'Because RVOL ≥ 2.0 confirms abnormal institutional participation and cleaner directional follow-through' },
          { id: 'b', label: 'Because stocks with RVOL below 2.0 cannot be bought legally' },
          { id: 'c', label: 'Because high RVOL guarantees a stock will only go up' },
          { id: 'd', label: 'Because RVOL eliminates the need for stop-losses' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think of the sailboat analogy: what does abnormal volume indicate about institutional interest?',
        ],
        postSubmissionRationale:
          'RVOL ≥ 2.0 proves institutional desks are actively repricing the stock on fresh information, supplying the momentum and liquidity needed for clean intraday moves.',
        commonTrapNote:
          'Trading low-RVOL stocks traps you in sluggish, mean-reverting chop.',
      },
      {
        id: 'pq-stk-2',
        lessonSlug: 'stocks-gaps-rvol-playbook',
        conceptKey: 'stocks-gaps-rvol-playbook',
        scenarioId: 'true-breakout-retest',
        prompt:
          'You plan a $150 maximum risk on a stock entering at $52.40 with a structural stop below VWAP at $51.80 ($0.60 risk per share). How many shares should you buy?',
        options: [
          { id: 'a', label: '100 shares' },
          { id: 'b', label: '250 shares ($150 ÷ $0.60 = 250 shares)' },
          { id: 'c', label: '500 shares' },
          { id: 'd', label: '1,000 shares' },
        ],
        correctOptionId: 'b',
        hints: [
          'Apply the equity share-sizing formula: Shares = Dollar Risk ÷ (Entry Price − Stop Price).',
        ],
        postSubmissionRationale:
          '$150 ÷ ($52.40 − $51.80) = $150 ÷ $0.60 = 250 shares. Exact share sizing guarantees your loss stays capped at exactly $150 (1R).',
        commonTrapNote:
          'Buying arbitrary 100- or 500-share blocks creates wild, inconsistent dollar swings across different stock prices.',
      },
      {
        id: 'pq-stk-3',
        lessonSlug: 'stocks-gaps-rvol-playbook',
        conceptKey: 'stocks-gaps-rvol-playbook',
        prompt:
          'A stock gaps up +6% pre-market, spikes for 60 seconds at 09:30, then slams below VWAP and closes below its 5-minute Opening Range Low on heavy red volume. How should a disciplined trader read this?',
        options: [
          { id: 'a', label: 'Automatic bargain—average down long aggressively' },
          { id: 'b', label: 'Failed gap ("Gap-and-Crap") showing institutional distribution; do not force longs below VWAP' },
          { id: 'c', label: 'Ignore VWAP because pre-market was green' },
          { id: 'd', label: 'Hold without a stop until next week' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare Gap-and-Go behavior against losing VWAP and the Opening Range Low.',
        ],
        postSubmissionRationale:
          'Losing both VWAP and the Opening Range Low on heavy selling volume signals early holders distributing into opening buyers; disciplined traders stand aside or follow bearish structure.',
        commonTrapNote:
          'Stubbornly buying green pre-market gappers after they lose VWAP is a classic retail trap.',
      },
    ],
  },

  // =========================================================================
  // MODULE 14: Building an A+ Setup Checklist & Execution Model
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000015',
    slug: 'confluence-a-plus-setups',
    title: 'Building an A+ Setup Checklist & Execution Model',
    subtitle:
      'Combine HTF bias, liquidity sweeps, displacement, FVG/OB entry, and asymmetric R-multiple into one repeatable, rule-based execution playbook.',
    level: 'advanced',
    marketCategory: 'general',
    learningStage: 'execution_edge',
    moduleOrder: 14,
    conceptKey: 'confluence-a-plus-setups',
    estimatedMinutes: 20,
    learningObjectives: [
      'Assemble a concise 5-point A+ Setup Checklist uniting Narrative, Liquidity, Timing, Trigger, and Risk.',
      'Grade setups objectively into A+, B, and C tiers—and eliminate C-grade boredom trades completely.',
      'Build a repeatable mechanical trigger so you stop hesitating on good setups and stop chasing bad ones.',
      'Recognize when a market condition is "No Trade" and protect mental capital by sitting on your hands.',
    ],
    prerequisites: [
      'Order Blocks, CHoCH & Institutional Displacement',
      'Multi-Timeframe Analysis (HTF Bias to LTF Entry)',
    ],
    terminology: [
      {
        term: 'Confluence',
        shortCode: 'CONF',
        definition:
          'Multiple independent technical factors aligning at the exact same price and time (e.g., HTF bias + Killzone + Liquidity Sweep + FVG).',
        example:
          '4H Bullish Bias + NY Open + SSL Sweep + 5m CHoCH + unmitigated FVG + 1:3 target.',
      },
      {
        term: 'Execution Model',
        shortCode: 'Model',
        definition:
          'A fixed, written step-by-step sequence defining exactly what must print on the chart before an order is permitted.',
        example:
          'Sweep external liquidity → Displacement CHoCH → Limit entry at 50% FVG → Stop beyond sweep wick → Target opposing pool.',
      },
      {
        term: 'Setup Grading (A+ / B / C)',
        shortCode: 'Grade',
        definition:
          'Scoring every candidate setup against your checklist before entry so only high-expectancy setups receive full risk.',
        example:
          '5/5 criteria = A+ (full 1R); 4/5 = B (0.5R or skip); ≤3/5 = C (mandatory pass).',
      },
      {
        term: 'Sitting on Hands',
        shortCode: 'No-Trade',
        definition:
          'Actively choosing not to trade when price sits mid-range or lacks confluence—treating cash as a valid position.',
        example:
          'Closing the terminal with 0 trades on a choppy pre-FOMC morning.',
      },
    ],
    sections: [
      {
        id: 'ap-sec-1',
        heading: 'The 5-Point Institutional A+ Setup Checklist',
        body: 'Scattered traders know 20 concepts and execute none consistently. Consolidate everything you have learned into one crystal-clear 5-point checklist that takes 20 seconds to score before every click.',
        bulletPoints: [
          '1. HTF Narrative & Draw: Clear Daily/4H/1H directional bias with an untouched opposing liquidity target.',
          '2. Timing / Catalyst: Active session Killzone (Forex/Indices), RVOL ≥ 2.0 (Stocks), or aligned BTC flow (Crypto).',
          '3. Liquidity Event: Clean sweep of resting BSL/SSL (or confirmed full-body breakout acceptance).',
          '4. Displacement & Entry Zone: Energetic CHoCH/BOS leaving a fresh FVG or Order Block in Discount/Premium.',
          '5. Asymmetric Risk Math: Structural stop defined, minimum 1:2.5–1:3 reward to opposing liquidity, fixed ≤ 1% risk.',
        ],
        keyTakeaway:
          'If a trade cannot check all 5 boxes cleanly, you do not have an A+ setup—wait.',
      },
      {
        id: 'ap-sec-2',
        heading: 'Grading Setups: Cutting C-Grade Noise Transforms Your Equity Curve',
        body: 'Reviewing real trading journals reveals a stunning truth: most struggling traders already spot profitable A+ setups, then give all those profits back on bored, impulsive C-grade trades.',
        bulletPoints: [
          'A+ Setup (5/5 criteria): Execute decisively with standard 1R risk—zero hesitation.',
          'B Setup (4/5 criteria, e.g., slightly weaker R:R or secondary session): Either skip completely or cap at 0.5R.',
          'C Setup (≤ 3/5 criteria, FOMO chase, mid-range guess): Hard ban. Every C-grade trade you skip is an instant raise to your expectancy.',
        ],
        keyTakeaway:
          'You do not need more trades to earn more—you need fewer low-grade trades.',
      },
      {
        id: 'ap-sec-3',
        heading: 'One Model, 100 Repetitions (End Strategy Hopping)',
        body: 'Switching strategies every time you experience two losing trades prevents you from ever discovering your real statistical edge. Pick ONE execution model, specialize in 1–2 markets, and log 50–100 clean repetitions.',
        bulletPoints: [
          'Write down your exact entry trigger (e.g., FVG limit vs. rejection close) so you do not improvise live.',
          'Pre-define invalidation and target BEFORE clicking submit so emotions stay sidelined.',
          'Remember: No Trade is a winning decision on choppy, low-confluence days.',
        ],
        keyTakeaway:
          'Master one repeatable A+ playbook deeply instead of dabbling in ten half-tested ideas.',
      },
    ],
    diagramConfig: {
      kind: 'liquidity_sweep_vs_breakout',
      title: 'Complete A+ Execution Blueprint (Confluence Stacking)',
      subtitle: 'Uniting HTF narrative, liquidity sweep, displacement, FVG, and asymmetric risk',
      caption:
        'Each confluence layer filters out low-probability noise until only structured high-R setups remain executable.',
      legend: [
        { label: 'Liquidity Pool & HTF Narrative', colorToken: '#f59e0b' },
        { label: 'Sweep + Displacement + FVG Trigger', colorToken: '#ef4444' },
        { label: 'Accepted Breakout Alternative', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'ap1', label: '1. Narrative', sublabel: 'HTF Bias + Opposing Target', tone: 'liquidity' },
        { id: 'ap2', label: '2. Sweep', sublabel: 'External Liquidity Cleared', tone: 'bearish' },
        { id: 'ap3', label: '3. Shift + FVG', sublabel: 'Displacement Entry Zone', tone: 'bullish' },
        { id: 'ap4', label: '4. 1:3 Plan', sublabel: 'Structural Stop & Target', tone: 'neutral' },
      ],
      walkthroughSteps: [
        'Score Narrative + Session Timing first—if neither is present, close the chart.',
        'Wait for the Liquidity Event + Displacement Shift to print cleanly.',
        'Verify 1:2.5+ R:R to opposing liquidity, compute exact size, and execute without hesitation.',
      ],
    },
    chartScenarioIds: ['sweep-bsl-displacement', 'fvg-bullish-mitigation'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'A Pilot Never Takes Off Without Running the Checklist',
        summary:
          'Even veteran airline pilots run a short printed checklist before every takeoff. Your 5-point A+ checklist guarantees you only put real money on setups where trend, timing, liquidity, entry, and risk all agree.',
        steps: [
          'Write down 5 simple yes/no questions next to your screen.',
          'Only click buy or sell when all 5 answers are clearly YES.',
          'Celebrate walking away with zero trades on days the market gives you nothing clean.',
        ],
        keyTakeaway:
          'Discipline is simply refusing to take off when a checklist box is unchecked.',
        practiceSafeHint:
          'Check whether all confluence elements—structure, liquidity, displacement, and R:R—are actually aligned.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '20-Second Pre-Execution Checklist',
        summary:
          'Score 1 point per box before placing any live or backtest order.',
        steps: [
          '[1] HTF Bias & Draw on Liquidity clearly marked?',
          '[2] Inside active Killzone / High-RVOL / Aligned BTC window?',
          '[3] Clean Liquidity Sweep (or full-body breakout acceptance) printed?',
          '[4] Displacement CHoCH/BOS + fresh FVG/OB entry zone present?',
          '[5] Structural stop allows ≥ 1:2.5 R:R at ≤ 1% fixed risk?',
        ],
        keyTakeaway:
          '5/5 = Execute calmly. Anything below 4/5 = Mandatory Pass.',
        practiceSafeHint:
          'Verify every single link in the confluence chain before committing capital.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Stacking EUR/USD Sweep + FVG Into One A+ Trade',
        summary:
          'Combine our EUR/USD BSL sweep (1.0865 → 1.0882 wick → close at 1.0859 → BOS below 1.0846) with the pullback mitigation on candle 24: clear liquidity, displacement, entry zone, structural stop above 1.0882, and +3R target below 1.0810.',
        steps: [
          'Equal Highs at 1.0865 supply clear resting liquidity.',
          'Sweep wick + immediate bearish BOS below 1.0846 confirms institutional sellers.',
          'Retrace into 1.0847 offers tight stop above the sweep with open road to 1.0806.',
        ],
        keyTakeaway:
          'Every concept you learned in Modules 1–13 snaps together into one clean visual trade.',
        practiceSafeHint:
          'Trace how liquidity, sweep close, displacement, and mitigation work sequentially on the chart.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'A Sniper vs. a Machine Gunner',
        summary:
          'Machine gunners spray 50 bullets at every moving shadow and run out of ammo fast. A sniper waits calmly for wind, range, and target alignment—taking one clean shot with high precision.',
        steps: [
          'Your ammo is both your account capital and your daily mental focus.',
          'Skipping 10 mediocre setups preserves focus for the single A+ trade that makes your week.',
        ],
        keyTakeaway:
          'You get paid for trade quality, never for clicking frequency.',
        practiceSafeHint:
          'Ask whether this candidate setup is a true sniper A+ shot or an impatient spray.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Rule-Based Execution Model vs. Discretionary Guessing',
        summary:
          'Consistency is impossible if your entry rules change every Tuesday.',
        steps: [
          'Rule-Based Model: Same 5 checklist items, same timeframe stack, same risk % → reviewable data over 50 trades.',
          'Discretionary Guessing: Trades news Monday, random RSI Tuesday, counter-trend scalps Wednesday → zero repeatable data.',
        ],
        keyTakeaway:
          'A consistent checklist turns trading from stressful guessing into measurable execution.',
        practiceSafeHint:
          'Evaluate whether the trade follows a repeatable rule set or an improvised hunch.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Checklist Breakdowns Even Experienced Traders Face',
        summary:
          'Watch out for subtle ways ego sneaks past your execution model.',
        steps: [
          'Mistake 1: Twisting a 2/5 C-grade setup into "basically an A+" because you feel bored.',
          'Mistake 2: Hesitating on a textbook 5/5 A+ setup out of fear from yesterday’s normal loss.',
          'Mistake 3: Abandoning your execution model after 3 consecutive losses instead of evaluating 30+ trades.',
        ],
        keyTakeaway:
          'Trust the checklist both ways: skip the C-grades AND execute the A+ grades.',
        practiceSafeHint:
          'Grade setups honestly before entry and accept routine variance inside a valid model.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ap-1',
        lessonSlug: 'confluence-a-plus-setups',
        conceptKey: 'confluence-a-plus-setups',
        scenarioId: 'sweep-bsl-displacement',
        prompt:
          'A setup matches your HTF bias and prints inside Killzone, but price has NOT swept liquidity, printed NO displacement, and offers only 1:1.1 reward. How should you grade and handle it?',
        options: [
          { id: 'a', label: 'A+ Setup — enter full size immediately' },
          { id: 'b', label: 'C-Grade Setup (2/5 criteria) — mandatory pass; protect capital and wait' },
          { id: 'c', label: 'Double risk to compensate for the poor 1:1.1 reward' },
          { id: 'd', label: 'Enter now and hope displacement shows up later' },
        ],
        correctOptionId: 'b',
        hints: [
          'Count how many of the 5 A+ checklist boxes are actually met.',
        ],
        postSubmissionRationale:
          'With only 2 of 5 criteria present and poor 1:1.1 reward, this is a C-grade trade. Passing cleanly protects both equity and psychological focus for real A+ opportunities.',
        commonTrapNote:
          'Taking C-grade trades out of impatience is the #1 reason profitable A+ traders stay stuck at breakeven.',
      },
      {
        id: 'pq-ap-2',
        lessonSlug: 'confluence-a-plus-setups',
        conceptKey: 'confluence-a-plus-setups',
        prompt:
          'Why is specializing in ONE written execution model across 50–100 trades superior to switching strategies every week?',
        options: [
          { id: 'a', label: 'Because one model never experiences losing trades' },
          { id: 'b', label: 'Because consistent execution builds statistically meaningful data you can measure, trust, and refine' },
          { id: 'c', label: 'Because markets forbid changing indicators' },
          { id: 'd', label: 'Because strategy hopping costs extra exchange fees' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how you can measure expectancy if your entry rules change every few days.',
        ],
        postSubmissionRationale:
          'Edge only emerges over a large sample of uniform executions. Strategy hopping resets your learning curve after every normal losing streak and produces unusable data.',
        commonTrapNote:
          'Two or three losses in a row are normal variance—not proof that a tested execution model is broken.',
      },
      {
        id: 'pq-ap-3',
        lessonSlug: 'confluence-a-plus-setups',
        conceptKey: 'confluence-a-plus-setups',
        prompt:
          'Which sequence represents complete institutional A+ confluence for a bullish reversal?',
        options: [
          { id: 'a', label: 'Random 1m green candle inside dead afternoon chop' },
          { id: 'b', label: 'HTF bullish narrative + Killzone timing + SSL sweep + displacement CHoCH/FVG + ≥ 1:2.5 R:R' },
          { id: 'c', label: 'Buying straight into untouched 4H supply after 8 green candles' },
          { id: 'd', label: 'Entering on a rumor without checking market structure or stop distance' },
        ],
        correctOptionId: 'b',
        hints: [
          'Check which option stacks Narrative, Timing, Liquidity, Displacement, and Asymmetric Risk together.',
        ],
        postSubmissionRationale:
          'Combining HTF alignment, active session volume, a sell-side liquidity raid, bullish displacement/FVG, and asymmetric R-multiple stacks every edge factor in your favor.',
        commonTrapNote:
          'Missing even one pillar—like chasing extended moves into HTF supply—erodes setup probability.',
      },
    ],
  },

  // =========================================================================
  // MODULE 15: Trade Management: Partials, Breakeven & Runners
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000016',
    slug: 'trade-management-partials-be',
    title: 'Trade Management: Partials, Breakeven & Runners',
    subtitle:
      'Manage live positions mechanically with pre-planned partial take-profits, structural breakeven rules, and trailing stops—so winners reach full potential.',
    level: 'advanced',
    marketCategory: 'general',
    learningStage: 'execution_edge',
    moduleOrder: 15,
    conceptKey: 'trade-management-partials-be',
    estimatedMinutes: 18,
    learningObjectives: [
      'Decide when to move your stop to Breakeven (BE) based on real structural breaks rather than premature panic at +0.5R.',
      'Structure systematic partial profit-taking (e.g., 50% at +2R, runner to opposing HTF liquidity) without gutting expectancy.',
      'Trail stops logically behind newly formed Higher Lows or Lower Highs to capture trend-day runners.',
      'Compare Fixed Full-TP management vs. Partial + Runner management using simple R-multiple math.',
    ],
    prerequisites: [
      'Building an A+ Setup Checklist & Execution Model',
      'Market Structure Basics (HH/HL, LH/LL & BOS)',
    ],
    terminology: [
      {
        term: 'Breakeven Stop',
        shortCode: 'BE',
        definition:
          'Shifting your protective stop-loss to your entry price (plus tiny commission buffer) once structure confirms progress, removing downside risk.',
        example:
          'Moving SL to 1.2660 entry ONLY after price prints a new structural BOS and reaches +1.5R to +2R.',
      },
      {
        term: 'Partial Take-Profit',
        shortCode: 'Partial',
        definition:
          'Closing a planned fraction of your position (e.g., 50%–70%) at an intermediate liquidity pool while leaving the remainder to run.',
        example:
          'Banking 50% at +2R (+1.0R locked) and letting the remaining 50% target +4R (+2.0R more).',
      },
      {
        term: 'Runner',
        shortCode: 'Runner',
        definition:
          'The remaining slice of a position trailed behind Higher-Timeframe swings to capture outsized trend-day expansions.',
        example:
          'Trailing 30% of a NY Open NAS100 position behind 15m Lower Highs for an extra +5R.',
      },
      {
        term: 'Premature BE Choke',
        shortCode: 'Choke',
        definition:
          'Moving a stop to breakeven too early (e.g., at +0.4R) so ordinary retest noise scratches you out right before price hits +3R.',
        example:
          'Getting tagged out at $0 profit on a normal FVG retest that immediately rallies to target.',
      },
    ],
    sections: [
      {
        id: 'tm-sec-1',
        heading: 'The Breakeven Trap: Move Stops on Structure, Not Fear',
        body: 'Moving your stop to breakeven feels emotionally comforting—which is exactly why beginners abuse it. Dragging your stop to entry after a tiny +0.5R bounce guarantees you get scratched out on routine pullbacks while still eating full -1R losses on losers.',
        bulletPoints: [
          'Only move to Breakeven AFTER price breaks an actual internal structural swing in your favor (typically ≥ +1.5R or +2R).',
          'Never move your stop to BE right before price retests your entry FVG/OB.',
          'Remember: turning ten winning +3R setups into $0 scratches silently destroys your mathematical expectancy.',
        ],
        keyTakeaway:
          'Earn breakeven through structural confirmation—never grant it out of nervous discomfort.',
      },
      {
        id: 'tm-sec-2',
        heading: 'Smart Partial Profit-Taking vs. Set-and-Forget',
        body: 'Both full take-profit ("set and forget") and structured scaling out work well—as long as your rules are written BEFORE entry and tested in your journal.',
        bulletPoints: [
          'Model A — Set & Forget: 100% off at fixed +2.5R or +3R opposing liquidity. Simplest psychologically and maximizes full-size R on clean hits.',
          'Model B — 50/50 Liquidity Scale: Take 50% off at the first internal liquidity pool (+1.5R to +2R), shift stop to BE, and hold 50% for the external HTF target (+3R to +5R).',
          'Avoid taking 80% off at +0.7R—tiny early partials cap your upside while leaving full -1R losses untouched.',
        ],
        keyTakeaway:
          'Pay yourself meaningfully at logical liquidity levels—never shave off profits out of boredom.',
      },
      {
        id: 'tm-sec-3',
        heading: 'Trailing Runners Behind Protected Swings',
        body: 'On strong trend days, trailing your remaining 25%–50% runner behind confirmed Higher Lows (longs) or Lower Highs (shorts) lets you capture massive +4R to +6R moves without guessing the exact top.',
        bulletPoints: [
          'Wait for a confirmed candle-body BOS before advancing your trailing stop to the newly protected swing.',
          'Leave a tiny buffer beyond the swing wick so liquidity sweeps do not prematurely end your runner.',
          'Always compare your actual managed R against untouched Set-and-Forget R in your journal every 20 trades.',
        ],
        keyTakeaway:
          'Let market structure—not P&L dollar fluctuations—decide when your runner is finished.',
      },
    ],
    diagramConfig: {
      kind: 'risk_reward_model',
      title: 'Structured Trade Management: +1R Hold, +2R Partial, +3R+ Runner',
      subtitle: 'Letting trades breathe through normal noise before locking in profits',
      caption:
        'Give the trade room to hold structural invalidation (-1R); take planned partials only after structural BOS at +2R while trailing runners toward +3R+.',
      legend: [
        { label: 'Partial (+2R) & Final Target (+3R)', colorToken: '#10b981' },
        { label: 'Entry & Earned BE Level', colorToken: '#38bdf8' },
        { label: 'Initial Structural Stop (-1R)', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'tm1', label: 'TP2 (+3R)', sublabel: 'External Liquidity Runner Target', tone: 'bullish' },
        { id: 'tm2', label: 'TP1 (+2R)', sublabel: '50% Partial + Move Stop to BE', tone: 'liquidity' },
        { id: 'tm3', label: 'Entry / -1R', sublabel: 'Hands Off Until Structure Shifts', tone: 'bearish' },
      ],
      walkthroughSteps: [
        'Leave your initial structural stop untouched while price is between -1R and +1R.',
        'At +2R (after confirmed BOS), bank your pre-planned partial and move the remaining stop to Breakeven.',
        'Trail the remaining runner behind confirmed protected swings until the external target hits.',
      ],
    },
    chartScenarioIds: ['risk-1to3-execution'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Give Your Winners Space to Grow Before Locking the Door',
        summary:
          'Moving your stop-loss to breakeven too quickly is like pulling a plant out of the soil every hour to check the roots. Let your trade prove itself with a real structure break first, then bank a partial and let the rest run stress-free.',
        steps: [
          'Hands off while the trade breathes inside its first +1R of movement.',
          'Once price clears a key milestone (like +2R), take half your profit and move your stop to entry.',
          'Let the second half aim calmly for the big target knowing you cannot lose on the trade anymore.',
        ],
        keyTakeaway:
          'Pre-planned partials calm your nerves while protecting your asymmetric reward.',
        practiceSafeHint:
          'Check whether a real structural break has occurred before shifting your stop to breakeven.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'Mechanical 3-Stage Position Management Plan',
        summary:
          'Eliminate mid-trade emotional tinkering by deciding all three stages before entry.',
        steps: [
          'Stage 1 (Entry to +1.5R): Zero changes—accept either structural stop (-1R) or progression.',
          'Stage 2 (First Liquidity Pool / +2R): Close 50% of position (+1.0R realized) and move remaining stop to BE.',
          'Stage 3 (Runner): Trail behind confirmed BOS protected swings until +3R/+4R external liquidity fills.',
        ],
        keyTakeaway:
          'Mechanical trade management frees you from staring at fluctuating P&L dollars.',
        practiceSafeHint:
          'Calculate the blended R-multiple of taking partials versus choking a trade early.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Managing GBP/USD 15m From 1.2660 Entry to 1.2720 (+3R)',
        summary:
          'On our GBP/USD 15m chart, price pauses near +1R (1.2680–1.2695) and pulls back slightly before driving to +2R (1.2700) and +3R (1.2720).',
        steps: [
          'Candle 16 dips 9 pips below entry—staying hands-off protects the trade.',
          'Candle 21 pauses at +1R—traders who panicked closed early; patient traders held.',
          'At +2R (1.2700), banking 50% (+1R) + BE stop lets the runner glide stress-free to 1.2720 (+1.5R more = +2.5R total).',
        ],
        keyTakeaway:
          'Notice how waiting for +2R before scaling kept you inside the winning leg.',
        practiceSafeHint:
          'Compare where the +1R pause occurred against the +2R partial and +3R final target.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Harvesting Half the Orchard Early, Letting the Rest Ripen',
        summary:
          'Taking a planned partial at +2R puts guaranteed cash in the barn, giving you the emotional peace to let the remaining fruit ripen all the way to +4R without panicking at every cloud.',
        steps: [
          'Too early (green fruit at +0.5R) ruins your harvest.',
          'Planned harvest at +2R + runner balances steady income and big asymmetric wins.',
        ],
        keyTakeaway:
          'Smart partials protect psychology without sacrificing the big winners that build accounts.',
        practiceSafeHint:
          'Balance securing realized profit with leaving meaningful size for full target expansion.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Set-and-Forget (+3R) vs. 50/50 Partial (+2R / +4R)',
        summary:
          'Compare the actual R math so you choose the management style that fits your data.',
        steps: [
          'Set & Forget: 100% off at +3R = +3.0R when target hits; 0R or -1R if it reverses from +2.4R.',
          '50/50 Partial: 50% at +2R (+1.0R) + 50% at BE = +1.0R even on reversals; +3.0R if runner hits +4R.',
        ],
        keyTakeaway:
          'Track BOTH numbers in your journal—data will tell you which management style nets higher R for your setup.',
        practiceSafeHint:
          'Compute blended R = (Partial % × TP1 R) + (Runner % × TP2 R).',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Live Trade Management Sabotages',
        summary:
          'Many traders have winning entries and losing trade management.',
        steps: [
          'Mistake 1: Closing 100% at +0.6R on a tiny red pullback candle out of fear of losing unrealized profit.',
          'Mistake 2: Slapping stop to BE at +0.4R and watching 4 straight winners stop you out at $0 before flying to +3R.',
          'Mistake 3: Changing your exit plan mid-trade every session so your journal data becomes meaningless.',
        ],
        keyTakeaway:
          'Hide your live dollar P&L column and manage strictly by price levels and structure.',
        practiceSafeHint:
          'Evaluate whether moving the stop or closing early is rule-based or purely emotional.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-tm-1',
        lessonSlug: 'trade-management-partials-be',
        conceptKey: 'trade-management-partials-be',
        scenarioId: 'risk-1to3-execution',
        prompt:
          'You enter a 1R trade, take 50% partial profit at +2R, move your stop to Breakeven, and your remaining 50% runner hits +4R. What is your total net R-multiple on the trade?',
        options: [
          { id: 'a', label: '+2.0R' },
          { id: 'b', label: '+3.0R (0.5 × 2R = +1.0R plus 0.5 × 4R = +2.0R)' },
          { id: 'c', label: '+6.0R' },
          { id: 'd', label: '+1.0R' },
        ],
        correctOptionId: 'b',
        hints: [
          'Multiply each slice’s percentage by its exit R-multiple, then add them together.',
        ],
        postSubmissionRationale:
          '50% closed at +2R yields +1.0R, and 50% closed at +4R yields +2.0R, for a blended net gain of +3.0R with risk eliminated halfway through.',
        commonTrapNote:
          'Never add raw R levels (+2R + +4R = +6R) without weighting each slice by its position percentage.',
      },
      {
        id: 'pq-tm-2',
        lessonSlug: 'trade-management-partials-be',
        conceptKey: 'trade-management-partials-be',
        prompt:
          'What is the main hidden cost of dragging your stop-loss to Breakeven as soon as a trade moves +0.4R in your favor?',
        options: [
          { id: 'a', label: 'There is no cost—early breakeven always increases total profits' },
          { id: 'b', label: 'Normal candle retests frequently tag you out at $0 right before winning setups run to +3R, eroding expectancy' },
          { id: 'c', label: 'Brokers double spreads whenever a stop is at breakeven' },
          { id: 'd', label: 'It prevents your original entry from filling' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how often price retests an entry zone before expanding to full target.',
        ],
        postSubmissionRationale:
          'Premature breakeven stops turn valid +3R winners into $0 scratches while your losing trades still cost -1R—silently destroying positive expectancy.',
        commonTrapNote:
          'Require a meaningful structural break (often ≥ +1.5R to +2R) before moving stops to breakeven.',
      },
      {
        id: 'pq-tm-3',
        lessonSlug: 'trade-management-partials-be',
        conceptKey: 'trade-management-partials-be',
        prompt:
          'When trailing a runner in an active uptrend, where should you advance your trailing stop-loss?',
        options: [
          { id: 'a', label: 'Just beneath each newly confirmed Higher Low after a body-close BOS prints' },
          { id: 'b', label: 'Two pips below the current live candle’s flickering price' },
          { id: 'c', label: 'Delete the stop completely once in profit' },
          { id: 'd', label: 'Move it lower whenever price pulls back' },
        ],
        correctOptionId: 'a',
        hints: [
          'Which swing point defines structural invalidation as a trend steps upward?',
        ],
        postSubmissionRationale:
          'Advancing the trailing stop beneath each newly confirmed Higher Low (with a small wick buffer) locks in growing profit while giving the trend natural breathing room.',
        commonTrapNote:
          'Chasing the live candle closely shakes you out on the first routine 2-candle pullback.',
      },
    ],
  },

  // =========================================================================
  // MODULE 17: Trading Journal, Backtest Data & Positive Expectancy
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000017',
    slug: 'trading-journal-expectancy',
    title: 'Trading Journal, Backtest Data & Positive Expectancy',
    subtitle:
      'Turn raw trades into objective feedback using R-multiple expectancy, Profit Factor, MAE/MFE tracking, and structured weekly reviews.',
    level: 'intermediate',
    marketCategory: 'general',
    learningStage: 'steady_profitability',
    moduleOrder: 17,
    conceptKey: 'trading-journal-expectancy',
    estimatedMinutes: 18,
    learningObjectives: [
      'Compute Expectancy, Win Rate, Average R, and Profit Factor across a statistically meaningful sample of 30+ trades.',
      'Explain why a 75% win rate can still lose money while a 40% win rate can compound steadily.',
      'Track the exact 6 journal fields that actually improve performance (and ignore vanity metrics).',
      'Run a 20-minute Sunday review using TradeLab’s Backtesting Lab and journal data to cut leaks systematically.',
    ],
    prerequisites: [
      'Risk Management, Position Sizing & Trading Psychology',
      'Building an A+ Setup Checklist & Execution Model',
    ],
    terminology: [
      {
        term: 'Mathematical Expectancy',
        shortCode: 'EV',
        definition:
          'Average R earned per trade over a large sample: (Win Rate × Avg Win R) − (Loss Rate × Avg Loss R).',
        example:
          '45% win rate at +2.5R avg win and -1.0R avg loss = (0.45 × 2.5) − (0.55 × 1.0) = +0.575R per trade.',
      },
      {
        term: 'Profit Factor',
        shortCode: 'PF',
        definition:
          'Gross winning R divided by gross losing R; above 1.5 indicates a solid edge, above 2.0 is institutional-grade.',
        example:
          '+36R total wins ÷ 18R total losses = 2.00 Profit Factor.',
      },
      {
        term: 'Rule-Adherence Score',
        shortCode: 'Process %',
        definition:
          'Percentage of trades that followed your written checklist, risk cap, and management rules—regardless of win or loss.',
        example:
          '19 out of 20 trades followed all rules = 95% Process Score.',
      },
      {
        term: 'MAE / MFE',
        shortCode: 'Excursion',
        definition:
          'Maximum Adverse Excursion (deepest drawdown inside a trade) and Maximum Favorable Excursion (furthest profit reached before exit).',
        example:
          'Seeing that 80% of your winners reach +2.5R MFE reveals you are cutting profits too early at +1.2R.',
      },
    ],
    sections: [
      {
        id: 'tj-sec-1',
        heading: 'Why a High Win Rate Can Still Bleed Your Account',
        body: 'Beginners worship 80% win rates, yet win rate alone is completely meaningless without payoff ratio. If you risk $300 to make $50, a single loss wipes out six wins and leaves you deeply negative.',
        bulletPoints: [
          'Trader A (75% win rate, +0.3R avg win, -1.5R avg loss): (0.75 × 0.3) − (0.25 × 1.5) = -0.15R per trade (LOSING system!).',
          'Trader B (42% win rate, +2.6R avg win, -1.0R avg loss): (0.42 × 2.6) − (0.58 × 1.0) = +0.51R per trade (WINNING system!).',
          'Steady profitability is simply positive Expectancy executed consistently across a large sample.',
        ],
        keyTakeaway:
          'Never judge a strategy by win rate alone—always pair Win Rate with Average Win R and Average Loss R.',
      },
      {
        id: 'tj-sec-2',
        heading: 'What to Log in Your Journal (And What to Ignore)',
        body: 'Overcomplicated 40-column spreadsheets get abandoned in a week. Track only the six high-leverage data points that immediately expose where money is being made or leaked.',
        bulletPoints: [
          '1. Setup Grade & Tag (A+ / B / C, plus market & session Killzone).',
          '2. Planned vs. Actual R-Multiple (catches premature exits and stop-widening instantly).',
          '3. Before & After Chart Screenshots (visual proof of structure and liquidity).',
          '4. Emotional State & Mistake Tag (Calm, FOMO, Revenge, Early Exit, Chased).',
          '5. Rule Adherence (Yes/No) — separates "good loss" (followed rules) from "bad win" (broke rules and got lucky).',
        ],
        keyTakeaway:
          'A lean 6-field journal you actually complete beats a 40-column sheet you abandon.',
      },
      {
        id: 'tj-sec-3',
        heading: 'The 20-Minute Weekly Review & Backtest Loop',
        body: 'Your journal is useless if you never read it. Every weekend, spend 20 minutes grouping your last 20–30 trades by Setup Grade, Session, and Mistake Tag—and backtest weak spots inside TradeLab’s Backtesting Lab.',
        bulletPoints: [
          'Calculate your "Clean Equity Curve": what would your R be if you simply deleted every Mistake-Tagged trade?',
          'Identify your single most expensive leak (e.g., NY lunch trades or premature BE stops) and make eliminating THAT ONE habit next week’s sole focus.',
          'Validate any rule tweak over 30+ replay backtest trades before ever changing live execution.',
        ],
        keyTakeaway:
          'Profitability grows fastest by deleting your top recurring mistake—not by hunting for a new indicator.',
      },
    ],
    diagramConfig: {
      kind: 'risk_reward_model',
      title: 'Expectancy & R-Multiple Performance Audit',
      subtitle: 'Tracking Planned R vs. Realized R to eliminate execution leaks',
      caption:
        'Comparing actual exit R against planned +3R structural targets exposes early-exit leaks and confirms true system expectancy.',
      legend: [
        { label: 'Realized Asymmetric Wins (+2R to +3R)', colorToken: '#10b981' },
        { label: 'Planned Entry & Process Check', colorToken: '#38bdf8' },
        { label: 'Capped Structural Losses (-1R)', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'tj1', label: 'MFE Audit', sublabel: 'Did Winners Reach Full +3R?', tone: 'bullish' },
        { id: 'tj2', label: 'Process %', sublabel: 'A+ Setup Rule Adherence', tone: 'neutral' },
        { id: 'tj3', label: 'Capped -1R', sublabel: 'Zero Rule-Breaking Losses', tone: 'bearish' },
      ],
      walkthroughSteps: [
        'Log every live and backtest trade immediately with Setup Grade, R-multiple, and Mistake Tag.',
        'Compute Expectancy and Profit Factor every 20–30 trades (never after 2 trades).',
        'Delete your #1 recurring leak first and validate improvements in Backtesting Lab.',
      ],
    },
    chartScenarioIds: ['risk-1to3-execution'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Your Trading Journal Is Your Personal Coach That Never Lies',
        summary:
          'Memory plays tricks on traders—we remember our big wins and forget our impulsive mistakes. Logging every trade takes two minutes and shows you in black and white which setups pay you and which habits drain you.',
        steps: [
          'Write down why you entered, whether you followed your rules, and your final R result.',
          'Snap a quick screenshot of the chart before and after.',
          'Review your last 20 trades every Sunday to spot your #1 leak.',
        ],
        keyTakeaway:
          'What gets measured gets improved; unjournaled traders repeat the same mistake for years.',
        practiceSafeHint:
          'Plug Win Rate, Average Win R, and Average Loss R into the Expectancy formula.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '20-Minute Sunday Journal Audit',
        summary:
          'Turn raw trade logs into concrete next-week improvements.',
        steps: [
          'Filter by Grade: Compare total R on A+ setups vs. B/C setups.',
          'Filter by Session: Check which time window delivers your highest Profit Factor.',
          'Filter by Mistakes: Sum total R lost to FOMO, Early Exits, or Revenge trades.',
          'Set ONE behavioral goal for next week to close your biggest leak.',
        ],
        keyTakeaway:
          'Simply removing your worst 20% of impulsive trades often flips an account profitable overnight.',
        practiceSafeHint:
          'Separate rule-following trades from rule-breaking trades when evaluating system performance.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Auditing Planned +3R vs. Emotional +1R Exit on GBP/USD',
        summary:
          'On our GBP/USD 15m scenario, Entry 1.2660 → SL 1.2640 → TP 1.2720 is a planned +3R trade. If a trader panics at Candle 21 (+1R) across 20 similar trades, MFE tracking immediately proves early exits cost +30R.',
        steps: [
          'Planned R = +3.0R; emotional early exit = +1.0R.',
          'Journal MFE column records +3.1R reached cleanly without threatening 1.2640.',
          'Objective data gives you the confidence to hold full targets next time.',
        ],
        keyTakeaway:
          'MFE data cures premature profit-taking faster than willpower ever could.',
        practiceSafeHint:
          'Compare actual exit R against the maximum favorable R price achieved before invalidation.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Game Film for Pro Athletes',
        summary:
          'No championship basketball team skips watching game film. Reviewing your journal on Sunday is your game film—it shows you the exact lazy habits costing points so you fix them before Monday’s tip-off.',
        steps: [
          'Live sessions are the game; TradeLab Backtesting Lab is practice.',
          'Your journal is the game film connecting practice to live consistency.',
        ],
        keyTakeaway:
          'Amateurs rely on memory; professionals review game film every single week.',
        practiceSafeHint:
          'Treat every logged trade as objective feedback data rather than an emotional verdict.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Good Loss vs. Bad Win (Process Over Outcome)',
        summary:
          'Your journal must reward discipline even when a single trade hits stop-loss.',
        steps: [
          'Good Loss: Followed A+ checklist, capped risk at -1R, accepted invalidation calmly → Keep doing this!',
          'Bad Win: Broke daily limit, doubled size, widened stop, got lucky for +$200 → Dangerous habit that will eventually blow your account.',
        ],
        keyTakeaway:
          'Grade yourself on Rule Adherence first; profits follow process over 30+ trades.',
        practiceSafeHint:
          'Distinguish a rule-compliant loss from a lucky rule-breaking win.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Journaling Mistakes That Hide Your Edge',
        summary:
          'Make sure your data actually reflects reality.',
        steps: [
          'Mistake 1: Only logging your winning trades and "forgetting" embarrassing revenge trades.',
          'Mistake 2: Judging an entire strategy after only 4 trades instead of a 30-trade sample.',
          'Mistake 3: Logging trades faithfully for months yet never doing a weekly review to spot patterns.',
        ],
        keyTakeaway:
          'Brutal honesty in logging + consistent weekly review unlocks compounding improvement.',
        practiceSafeHint:
          'Verify sample size (30+ trades) and complete mistake logging before changing rules.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-tj-1',
        lessonSlug: 'trading-journal-expectancy',
        conceptKey: 'trading-journal-expectancy',
        prompt:
          'Trader A wins 75% of trades averaging +0.4R per win, but averages -2.0R per loss because they widen stops. What is Trader A’s Expectancy per trade?',
        options: [
          { id: 'a', label: 'Positive (+0.30R per trade) because 75% is a high win rate' },
          { id: 'b', label: 'Negative (-0.20R per trade): (0.75 × 0.4) − (0.25 × 2.0) = 0.30 − 0.50 = -0.20R' },
          { id: 'c', label: 'Exactly breakeven (0.00R)' },
          { id: 'd', label: 'Positive (+1.60R per trade)' },
        ],
        correctOptionId: 'b',
        hints: [
          'Plug the numbers into Expectancy = (Win Rate × Avg Win R) − (Loss Rate × Avg Loss R).',
        ],
        postSubmissionRationale:
          '(0.75 × 0.4R) − (0.25 × 2.0R) = 0.30R − 0.50R = -0.20R per trade. Even a 75% win rate loses steadily when average losses dwarf average wins.',
        commonTrapNote:
          'High win-rate systems that widen stops hide ticking time bombs in their Expectancy math.',
      },
      {
        id: 'pq-tj-2',
        lessonSlug: 'trading-journal-expectancy',
        conceptKey: 'trading-journal-expectancy',
        prompt:
          'In your trading journal, what is a "Bad Win"?',
        options: [
          { id: 'a', label: 'Any winning trade smaller than +5R' },
          { id: 'b', label: 'A profitable trade where you broke your rules (e.g., widened your stop or revenge traded) and got lucky' },
          { id: 'c', label: 'A winning trade taken during London Killzone' },
          { id: 'd', label: 'A trade that hit your planned +3R take-profit' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how breaking rules and getting rewarded reinforces dangerous habits.',
        ],
        postSubmissionRationale:
          'A Bad Win rewards reckless rule-breaking with short-term profit, training your brain to repeat behaviors that eventually cause catastrophic drawdowns.',
        commonTrapNote:
          'Never celebrate lucky rule-breaking wins—flag them in your journal just like mistakes.',
      },
      {
        id: 'pq-tj-3',
        lessonSlug: 'trading-journal-expectancy',
        conceptKey: 'trading-journal-expectancy',
        scenarioId: 'risk-1to3-execution',
        prompt:
          'Your journal shows 80% of your winning setups reach +2.8R Maximum Favorable Excursion (MFE), yet your actual average realized win is only +1.1R. What is the clear diagnosis?',
        options: [
          { id: 'a', label: 'Your entry strategy is completely broken and must be replaced' },
          { id: 'b', label: 'Your entries are strong, but premature profit-taking / tight management is cutting winners far too early' },
          { id: 'c', label: 'You need to risk 5% per trade to make more money' },
          { id: 'd', label: 'You should stop logging MFE' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare how far price actually went in your favor (+2.8R) against where you exited (+1.1R).',
        ],
        postSubmissionRationale:
          'High MFE paired with low realized R pinpoints a trade-management leak (fearful early exits), proving you should refine exit discipline rather than abandoning strong entries.',
        commonTrapNote:
          'Without MFE data, traders often blame their entry strategy when the real leak is closing winners early.',
      },
    ],
  },

  // =========================================================================
  // MODULE 18: Handling Drawdowns, Avoiding Tilt & Scaling Steadily
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000018',
    slug: 'drawdown-scaling-consistency',
    title: 'Handling Drawdowns, Avoiding Tilt & Scaling Steadily',
    subtitle:
      'Master drawdown recovery math, dynamic risk throttling, anti-tilt circuit breakers, and milestone-based scaling for long-term profitability.',
    level: 'advanced',
    marketCategory: 'general',
    learningStage: 'steady_profitability',
    moduleOrder: 18,
    conceptKey: 'drawdown-scaling-consistency',
    estimatedMinutes: 20,
    learningObjectives: [
      'Understand the asymmetric math of drawdown recovery and why protecting capital always beats chasing fast returns.',
      'Implement a tiered Drawdown Protocol (automatically cutting risk in half at -4% / -5R to flatten losing streaks).',
      'Spot early physical and behavioral signs of emotional Tilt and activate immediate cooldown circuit breakers.',
      'Scale account size and risk gradually using objective sample milestones instead of premature over-leveraging.',
    ],
    prerequisites: [
      'Risk Management, Position Sizing & Trading Psychology',
      'Trading Journal, Backtest Data & Positive Expectancy',
    ],
    terminology: [
      {
        term: 'Drawdown',
        shortCode: 'DD',
        definition:
          'The peak-to-trough percentage decline in account equity during a normal losing streak or rough market regime.',
        example:
          'Equity moving from a $10,000 peak to $9,500 represents a 5% drawdown.',
      },
      {
        term: 'Recovery Asymmetry',
        shortCode: 'Math',
        definition:
          'The mathematical reality that larger drawdowns require disproportionately larger percentage gains just to return to breakeven.',
        example:
          'A -10% drawdown needs +11.1% to recover; a -50% drawdown needs a brutal +100% gain just to break even!',
      },
      {
        term: 'Risk Throttling',
        shortCode: 'Half-Risk',
        definition:
          'Automatically reducing risk per trade (e.g., from 1.0% down to 0.5% or 0.25%) once drawdown crosses a pre-set threshold until equity recovers.',
        example:
          'Dropping from 1% to 0.5% risk at -4% drawdown so even 4 more losses only add -2% instead of -4%.',
      },
      {
        term: 'Emotional Tilt',
        shortCode: 'Tilt',
        definition:
          'A hijacked fight-or-flight mental state after losses or missed moves that drives impulsive sizing, rule-breaking, and rapid account damage.',
        example:
          'Feeling heat in your chest and clicking unplanned 1-minute trades immediately after a stop-out.',
      },
    ],
    sections: [
      {
        id: 'dd-sec-1',
        heading: 'The Brutal Math of Drawdown Recovery',
        body: 'Every profitable system—even a 55% win-rate edge—will statistically hit a 5-to-7 trade losing streak over a year. How you handle those inevitable weeks separates career traders from blown accounts.',
        bulletPoints: [
          '-5% Drawdown requires +5.3% to recover (routine, stress-free).',
          '-10% Drawdown requires +11.1% to recover (manageable with calm execution).',
          '-25% Drawdown requires +33.3% to recover; -50% Drawdown requires +100% to recover (psychologically crippling).',
        ],
        keyTakeaway:
          'Keep drawdowns shallow (single digits) so recovery stays mathematically easy and emotionally calm.',
      },
      {
        id: 'dd-sec-2',
        heading: 'The 4-Step Professional Drawdown & Anti-Tilt Protocol',
        body: 'Never invent a drawdown plan WHILE you are already down 5%. Install a mechanical playbook in advance so your risk shrinks automatically when you are cold.',
        bulletPoints: [
          'Step 1 — Daily & Weekly Hard Caps: Stop for the day at -2R; stop for the week at -4R to prevent spiral days.',
          'Step 2 — Dynamic Risk Throttle: At -4% drawdown, cut risk per trade in HALF (1.0% → 0.5%) and restrict entries strictly to 5/5 A+ setups.',
          'Step 3 — Audit Process vs. Variance: Review the last 10 trades—did you follow rules (normal variance, keep executing calmly at half risk) or break rules (Tilt, take 48 hours off and replay in Backtesting Lab)?',
          'Step 4 — Step Back Up Gradually: Return to full 1% risk only after recovering half the drawdown with 90%+ rule adherence.',
        ],
        keyTakeaway:
          'Cut size when cold, never double size to "win it back faster."',
      },
      {
        id: 'dd-sec-3',
        heading: 'Scaling Capital Steadily for Lifetime Compounding',
        body: 'Once your journal proves positive expectancy over 50–100 live or funded trades, scale smoothly in small increments so larger dollar numbers never trigger emotional choking.',
        bulletPoints: [
          'Scale risk or capital in modest 25%–50% steps only after achieving new equity highs with ≥ 90% process adherence.',
          'Keep your chart screen displaying R-multiples or percentages instead of live dollar P&L so $500 risk feels identical to $50 risk.',
          'Think in quarters and years: compounding a disciplined +3% to +5% per month steadily outperforms erratic boom-and-bust gambling by miles.',
        ],
        keyTakeaway:
          'Steady, boring, rule-driven compounding is the real secret to professional trading longevity.',
      },
    ],
    diagramConfig: {
      kind: 'risk_reward_model',
      title: 'Drawdown Throttling & Steady Compounding Framework',
      subtitle: 'Capping downside risk during cold streaks so positive expectancy compounds safely',
      caption:
        'Strict -1R stops, -2R daily caps, and automatic half-risk throttling keep drawdowns shallow while asymmetric +3R wins drive steady equity highs.',
      legend: [
        { label: 'Asymmetric Recovery & New Equity Highs', colorToken: '#10b981' },
        { label: 'Half-Risk Throttle Zone', colorToken: '#38bdf8' },
        { label: 'Hard Daily/Weekly Loss Circuit Breaker', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'dd1', label: 'Scale Up', sublabel: 'Only After 30–50 Clean Trades', tone: 'bullish' },
        { id: 'dd2', label: '0.5x Throttle', sublabel: 'Auto Cut Size at -4% DD', tone: 'liquidity' },
        { id: 'dd3', label: 'Hard Stop', sublabel: '-2R Day / -4R Week Cap', tone: 'bearish' },
      ],
      walkthroughSteps: [
        'Enforce non-negotiable -2R daily and -4R weekly circuit breakers.',
        'Automatically cut position risk in half at -4% drawdown and trade strictly A+ setups.',
        'Scale capital in modest steps only after verified equity highs and high process scores.',
      ],
    },
    chartScenarioIds: ['risk-1to3-execution'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Slow Down in Rainstorms, Speed Up on Clear Highways',
        summary:
          'When you hit a losing streak (a drawdown), amateurs slam the gas pedal and double their bets—crashing the car. Pros ease off the gas by cutting their trade size in half until the storm passes, then steadily climb back to new highs.',
        steps: [
          'Set a hard daily stop (-2R) and weekly stop (-4R) before the week begins.',
          'If your account dips 4%, cut your risk per trade in half until you bounce back.',
          'Never jump from tiny trades to massive trades overnight—grow size gradually.',
        ],
        keyTakeaway:
          'Protecting your account during bad weeks is how you stay alive for the great weeks.',
        practiceSafeHint:
          'Remember how recovery percentage rises steeply as drawdown deepens, and why cutting size protects longevity.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Step Drawdown Recovery Playbook',
        summary:
          'Follow this exact protocol the next time a losing streak arrives.',
        steps: [
          'Trigger (-4% DD or -4R week): Pause live trading for 24 hours to reset adrenaline.',
          'Audit: Review all recent trades—separate normal rule-following losses from emotional Tilt mistakes.',
          'Throttle: Resume at 0.5x normal risk strictly on 5/5 A+ setups inside your best session.',
          'Restore: Return to 1.0x risk only after recovering at least half the drawdown cleanly.',
        ],
        keyTakeaway:
          'A written drawdown protocol removes panic before a losing streak ever happens.',
        practiceSafeHint:
          'Apply half-risk throttling and process auditing instead of increasing risk during a slump.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'How Two Clean +3R Setups Erase a Full -4R Slump',
        summary:
          'Even after four straight -1R losses (-4R), staying calm at half risk (0.5R) and executing clean +3R setups like our GBP/USD 15m plan (+1.5R each) restores +3R in just two winners with minimal stress.',
        steps: [
          'Capping losses strictly at -1R keeps the slump to a manageable -4%.',
          'Half-risk throttling ensures another loss only costs -0.5%.',
          'Two disciplined +3R executions rebuild confidence and equity smoothly.',
        ],
        keyTakeaway:
          'Asymmetric 1:3 setups make shallow drawdowns surprisingly fast to recover when you avoid Tilt.',
        practiceSafeHint:
          'Compare how quickly a -4% drawdown recovers versus a reckless -40% tilt drawdown.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Climbing a Mountain With Safety Anchors',
        summary:
          'Mountain climbers clip into safety anchors every few meters so a slip drops them 2 feet—not 2,000 feet down the cliff. Your daily loss limit and half-risk throttle are your safety anchors.',
        steps: [
          'Slips (losing trades) happen to every climber.',
          'Safety anchors turn scary slips into minor pauses so you keep climbing to the summit.',
        ],
        keyTakeaway:
          'You never fall off the mountain when your risk anchors stay clipped in.',
        practiceSafeHint:
          'Identify which rule acts as a protective safety anchor during a losing streak.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Pro Drawdown Response vs. Tilt Spiral',
        summary:
          'Two traders both start the week at -3R; watch where they finish Friday.',
        steps: [
          'Pro Response: Stops at -2R daily cap, cuts risk to 0.5%, takes one clean A+ +3R trade Thursday → finishes week at -1.5R, calm and ready.',
          'Tilt Spiral: Doubles size to recover fast, trades random off-session chop, ignores stop → finishes Friday at -18% and emotionally wrecked.',
        ],
        keyTakeaway:
          'The loss itself rarely ruins a trader—the emotional reaction to the loss does.',
        practiceSafeHint:
          'Contrast dynamic risk reduction against revenge-driven size escalation.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Drawdown & Scaling Traps That Reset Progress',
        summary:
          'Protect months of hard work by avoiding these three traps.',
        steps: [
          'Mistake 1: Doubling risk in a drawdown ("one big win gets me back to breakeven").',
          'Mistake 2: Jumping straight from $50 risk to $500 risk after one lucky hot week, causing nervous micromanagement.',
          'Mistake 3: Comparing your steady +4%/month curve against fake social media overnight jackpot screenshots.',
        ],
        keyTakeaway:
          'Scale slowly, throttle down automatically when cold, and run your own race.',
        practiceSafeHint:
          'Verify that scaling decisions rely on statistically valid samples and modest increments.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-dd-1',
        lessonSlug: 'drawdown-scaling-consistency',
        conceptKey: 'drawdown-scaling-consistency',
        prompt:
          'If an account suffers a -50% drawdown due to reckless over-leveraging, what percentage gain is required on the remaining balance just to get back to breakeven?',
        options: [
          { id: 'a', label: '+50%' },
          { id: 'b', label: '+100% (doubling the remaining capital just to reach $0 net profit)' },
          { id: 'c', label: '+25%' },
          { id: 'd', label: '+55%' },
        ],
        correctOptionId: 'b',
        hints: [
          'If $10,000 falls 50% to $5,000, how much percentage growth does $5,000 need to become $10,000 again?',
        ],
        postSubmissionRationale:
          'Dropping from $10,000 to $5,000 requires earning +$5,000 on a $5,000 base—a massive +100% gain just to break even. Keeping drawdowns shallow makes recovery effortless.',
        commonTrapNote:
          'Underestimating recovery asymmetry leads traders to tolerate huge drawdowns they can never climb out of.',
      },
      {
        id: 'pq-dd-2',
        lessonSlug: 'drawdown-scaling-consistency',
        conceptKey: 'drawdown-scaling-consistency',
        prompt:
          'Your account hits your pre-defined -4% drawdown threshold after a tough week. What is the disciplined Risk Throttling response?',
        options: [
          { id: 'a', label: 'Double risk from 1% to 2% so you recover twice as fast' },
          { id: 'b', label: 'Audit your journal, cut risk per trade in half (e.g., 1% → 0.5%), and take strictly 5/5 A+ setups until recovering' },
          { id: 'c', label: 'Abandon your strategy immediately and buy a random indicator' },
          { id: 'd', label: 'Trade 20 low-grade scalps per day to stay busy' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember the rainstorm analogy: do you slam the gas or ease off the throttle during rough conditions?',
        ],
        postSubmissionRationale:
          'Cutting risk in half flattens the drawdown curve, lowers emotional stress, and gives your positive expectancy room to recover cleanly on A+ setups.',
        commonTrapNote:
          'Increasing risk while already on Tilt is the fastest way to turn a small -4% dip into a blown account.',
      },
      {
        id: 'pq-dd-3',
        lessonSlug: 'drawdown-scaling-consistency',
        conceptKey: 'drawdown-scaling-consistency',
        scenarioId: 'risk-1to3-execution',
        prompt:
          'When is the right time to scale up your position risk or funded capital size?',
        options: [
          { id: 'a', label: 'Immediately after winning 2 trades in a row' },
          { id: 'b', label: 'In modest 25%–50% increments only after achieving new equity highs across 30–50+ trades with ≥ 90% rule adherence' },
          { id: 'c', label: 'Right in the middle of a -6% drawdown to win it back' },
          { id: 'd', label: 'Jump 10x in size overnight once you feel confident' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how gradual milestone scaling protects both your math and your emotional comfort zone.',
        ],
        postSubmissionRationale:
          'Modest 25%–50% scaling steps backed by a real 30–50+ trade sample and high rule adherence allow your nervous system to adapt smoothly to larger dollar figures.',
        commonTrapNote:
          'Leaping 5x–10x in dollar risk overnight triggers fear-driven early exits and rule-breaking.',
      },
    ],
  },
];
