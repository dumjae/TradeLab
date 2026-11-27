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
      'Start from absolute zero: learn where a candle starts, why and how it closes, why it turns green or red, and what the thick body and thin wicks actually show.',
    plainEnglishSummary:
      'A candlestick is simply a visual scorecard for one fixed slice of time — like 5 minutes, 15 minutes, 1 hour, or 1 day. Instead of forcing you to read a giant spreadsheet of prices, one little candle shows you four things at a glance: where the price started, the highest price it touched, the lowest price it touched, and where it finished when the clock ran out. Green means buyers pushed price up during that slice of time; red means sellers pushed price down.',
    beginnerFaq: [
      {
        question: 'Wait — why did the candle close? Did someone stop trading?',
        answer:
          'No! Nobody stopped trading. A candle closes simply because its chart timer reached 00:00 — just like a 15-minute quarter ending in basketball while the game keeps going. On a 15-minute chart, the 9:00 AM candle automatically locks its final price at 9:15 AM, and a brand-new candle starts right beside it at 9:15:00.',
      },
      {
        question: 'Where is the Open and Close on a Green candle vs. a Red candle?',
        answer:
          'On a GREEN (up) candle, price rose — so the Open (start) is at the BOTTOM edge of the thick colored box, and the Close (finish) is at the TOP edge. On a RED (down) candle, price fell — so the Open (start) is at the TOP edge of the box, and the Close (finish) is at the BOTTOM edge.',
      },
      {
        question: 'What if a candle has NO wick or a tiny flat line for a body?',
        answer:
          'If there is no wick on top or bottom, it simply means price finished right at its highest or lowest point with zero pullback. If the body is a flat horizontal line (often called a Doji), it means the Open and Close were the exact same price — buyers and sellers fought to a complete tie during that time period.',
      },
      {
        question: 'Which timeframe should a total beginner use first?',
        answer:
          'Start with 15-minute or 1-hour charts. On a 1-minute chart, candles open and close every 60 seconds, which moves way too fast and feels chaotic when you are still learning to read bodies and wicks cleanly.',
      },
      {
        question: 'Do I need to memorize 50 candlestick pattern names?',
        answer:
          'Not at all! You never need to memorize exotic names. Just ask two simple questions about every closed candle: (1) Who won the thick body — buyers (green) or sellers (red)? and (2) Did a long thin wick show price getting slapped back from a high or low?',
      },
    ],
    level: 'beginner',
    marketCategory: 'general',
    learningStage: 'foundations',
    moduleOrder: 2,
    conceptKey: 'candlestick-anatomy',
    estimatedMinutes: 15,
    learningObjectives: [
      'Understand exactly where a candle starts (Open), why and how its countdown clock ends (Close), and why it turns Green or Red.',
      'Identify the thick colored Body and thin Upper/Lower Wicks instantly on both green and red candles.',
      'Walk through a real dollar example ($100 Open to $104 Close) and picture the exact candle shape in your head.',
      'Explain why waiting for the candle countdown timer to hit 00:00 protects you from fake mid-candle moves.',
    ],
    prerequisites: ['Lesson 01: Chart Reading Fundamentals'],
    terminology: [
      {
        term: 'Open & Close (Start and Finish)',
        shortCode: 'O / C',
        definition:
          'Open is the exact price at the first second a candle timer begins. Close is the exact price locked in forever when that candle timer hits 00:00.',
        example:
          'On a 15-minute chart, a candle opens at 9:00 AM at $100 and closes at 9:15 AM at $104.',
      },
      {
        term: 'The Body (Thick Colored Rectangle)',
        shortCode: 'Body',
        definition:
          'The solid rectangle connecting the Open and Close prices. It shows how far price moved net from start to finish — green if it finished higher, red if it finished lower.',
        example:
          'A candle that starts at $100 and finishes at $104 has a $4 tall green body (Open at bottom $100, Close at top $104).',
      },
      {
        term: 'The Wicks / Shadows (Thin Lines)',
        shortCode: 'Wicks',
        definition:
          'The thin vertical lines poking out the top and bottom of the body. The Upper Wick tip marks the Highest price touched; the Lower Wick tip marks the Lowest price touched during that timer.',
        example:
          'If price dipped to $98 before climbing to $105 and closing at $104, the Lower Wick runs from $100 down to $98 and the Upper Wick runs from $104 up to $105.',
      },
      {
        term: 'Timeframe Clock (Why Candles Close)',
        shortCode: 'Timer',
        definition:
          'The fixed time window each candle represents (such as 5 minutes, 15 minutes, 1 hour, or 1 day). When the timer expires, that candle freezes and the next candle begins.',
        example:
          'On a 1-hour chart, 24 separate candles print in a full 24-hour day — one brand-new candle every 60 minutes.',
      },
    ],
    sections: [
      {
        id: 'ca-sec-1',
        heading: 'Where a Candle Starts, Why It Closes & Why It Turns Green or Red',
        body: 'Every price chart is divided into equal slices of time — you pick the clock (5 minutes, 15 minutes, 1 hour, or 1 day). Each candlestick is the mini-history of what price did during ONE of those slices of time.',
        bulletPoints: [
          'Where does it start? (Open): The very first traded price when the candle timer starts ticking (for example, $100.00 at exactly 9:00:00 AM on a 15-minute chart).',
          'Why and how does it close? (Close): Every candle runs on a fixed countdown clock. When that timer hits 00:00 (at 9:15:00 AM), whatever price the market is at locks in forever as the Close — nobody paused trading, the clock simply rolled over and opened a brand-new candle right next to it.',
          'Why is it GREEN? (Up / Bullish): Price finished HIGHER than where it started (Close > Open). That means buyers won that time period.',
          'Why is it RED? (Down / Bearish): Price finished LOWER than where it started (Close < Open). That means sellers won that time period.',
        ],
        keyTakeaway:
          'A candle opens when the timer starts, closes when the timer hits 00:00, turns GREEN if it finished higher than it started, and turns RED if it finished lower.',
      },
      {
        id: 'ca-sec-2',
        heading: 'What Is the Body & What Are the Wicks?',
        body: 'Every candle has just two visual parts: a thick colored box in the middle (the Body) and thin vertical sticks above or below it (the Wicks, also called Shadows). Once you know what each part measures, any chart instantly makes sense.',
        bulletPoints: [
          'The Body (Thick Colored Rectangle): Shows the distance between Open and Close. On a GREEN candle, Open is at the bottom edge of the box and Close is at the top edge. On a RED candle, Open is at the top edge and Close is at the bottom edge.',
          'Body Size Tells You Strength: A tall, wide body means one side dominated effortlessly. A tiny, flat body means buyers and sellers fought to a near tie.',
          'The Upper Wick (Thin Line on Top): While the timer was ticking, buyers pushed price up to a peak (the High), then sellers shoved it back down before the timer ended. A long upper wick = sellers rejected higher prices.',
          'The Lower Wick (Thin Line on Bottom): While the timer was ticking, sellers pushed price down to a floor (the Low), then buyers stepped in and shoved it back up before the timer ended. A long lower wick = buyers rejected lower prices.',
        ],
        keyTakeaway:
          'The thick body shows where price started and finished; the thin wicks show the furthest extremes price visited and then bounced away from.',
      },
      {
        id: 'ca-sec-3',
        heading: 'Reading a Candle Like a Story (Not Memorizing Patterns)',
        body: 'Walk through one everyday dollar example so you can picture how a candle gets drawn live. Imagine a 15-minute candle on a stock starting at 9:00 AM:',
        bulletPoints: [
          'Real Dollar Example: At 9:00 AM price starts at $100 (Open). At 9:04 AM sellers push it down to $98 (Low). Buyers jump in and drive it up to $105 (High) by 9:12 AM. At 9:15 AM the clock hits 00:00 at $104 (Close).',
          'What the Finished Candle Looks Like: Because $104 is higher than $100, the candle is GREEN! It has a $4 thick green body ($100 bottom to $104 top), a $2 thin lower wick ($100 down to $98), and a $1 thin upper wick ($104 up to $105).',
          'Wait for the Timer to Close: While the clock is still ticking, a candle is constantly changing shape and color. A big green candle with 2 minutes left can plunge and finish as a red candle in the final 10 seconds — always wait for 00:00 before trusting what a candle says!',
        ],
        keyTakeaway:
          'You never need to memorize 50 pattern names — just read the finished story after the timer hits 00:00: Who won the body, and did a long wick reject a price?',
      },
    ],
    diagramConfig: {
      kind: 'candlestick_anatomy',
      title: 'Visual Anatomy of a Green (Up) vs. Red (Down) Candlestick',
      subtitle: 'Exact positions of Open, High, Low, Close, Thick Body, and Thin Wicks side by side',
      caption:
        'Green candle: opens at the bottom of the body and closes at the top. Red candle: opens at the top of the body and closes at the bottom. Thin wicks mark the highest and lowest prices reached before the timer ended.',
      legend: [
        { label: 'Green Body (Buyers Won: Close > Open)', colorToken: '#10b981' },
        { label: 'Red Body (Sellers Won: Close < Open)', colorToken: '#ef4444' },
        { label: 'Upper & Lower Wicks (Highest / Lowest Touched)', colorToken: '#94a3b8' },
      ],
      annotations: [
        { id: 'ca1', label: 'Upper Wick Tip', sublabel: 'Highest Price Reached (High)', tone: 'neutral' },
        { id: 'ca2', label: 'Green Body', sublabel: 'Open at Bottom → Close at Top', tone: 'bullish' },
        { id: 'ca3', label: 'Red Body', sublabel: 'Open at Top → Close at Bottom', tone: 'bearish' },
        { id: 'ca4', label: 'Lower Wick Tip', sublabel: 'Lowest Price Reached (Low)', tone: 'liquidity' },
      ],
      walkthroughSteps: [
        'Check the color first: Green means price ended higher than it started; Red means it ended lower.',
        'Locate Open and Close on the edges of the thick box (Green = Open bottom / Close top; Red = Open top / Close bottom).',
        'Measure the thin wicks to see whether buyers or sellers pushed price back from an extreme before the timer hit 00:00.',
      ],
    },
    chartScenarioIds: ['ca-green-red-candles'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'A Candle Is Just a 4-Number Scorecard for One Slice of Time',
        summary:
          'Pick any timer — say 15 minutes. Every 15 minutes, the chart draws one rectangle showing where price started (Open), where it finished (Close), and two thin sticks showing the highest and lowest spots it visited along the way.',
        steps: [
          'Color of Close: Green = finished higher than start (buyers won). Red = finished lower than start (sellers won).',
          'Thick Box (Body): Connects Open and Close. Bigger box = stronger move.',
          'Thin Lines (Wicks): Show rejected trips up or down. Always wait until the countdown timer hits 00:00 so the candle is locked in.',
        ],
        keyTakeaway:
          'Green means Open at bottom / Close at top; Red means Open at top / Close at bottom.',
        practiceSafeHint:
          'Ask two things: Where did the candle finish relative to where it started, and what does the wick tell you about pushback?',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Second Beginner Candle Checklist',
        summary:
          'Read any closed candle cleanly in three quick steps without memorizing patterns.',
        steps: [
          'Step 1 — Check the Color & Body: Is it a big green box (strong buyers), big red box (strong sellers), or tiny flat box (a tie)?',
          'Step 2 — Check the Wicks: Is there a long bottom stick (buyers fought back from low prices) or long top stick (sellers slapped price down)?',
          'Step 3 — Check the Clock: Has the candle timer actually finished at 00:00, or is it still flickering live?',
        ],
        keyTakeaway:
          'Color, body size, wick length, and a finished clock tell you everything a candle has to say.',
        practiceSafeHint:
          'Compare how tall the thick body is versus how long the thin wicks are once the candle closes.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Walking Through Our $100 to $104 Green Candle Example',
        summary:
          'Suppose a 15-minute candle starts at 9:00 AM at $100, dips briefly to $98, rallies to $105, and finishes at 9:15 AM at $104.',
        steps: [
          'Open = $100 (bottom of the green box) and Close = $104 (top of the green box), giving a solid $4 green body.',
          'Low = $98 creates a $2 thin lower wick showing buyers stepped in quickly below $100.',
          'High = $105 creates a tiny $1 thin upper wick showing only mild hesitation near the top.',
        ],
        keyTakeaway:
          'Every single candlestick on a real chart is built from those exact same four prices: Open, High, Low, and Close.',
        practiceSafeHint:
          'Trace Open, Low, High, and Close in order to picture whether buyers or sellers finished in charge.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'One Quarter of a Basketball Game (With a Game Clock)',
        summary:
          'Think of a 15-minute candle like one quarter of basketball. Nobody stops playing the season when the buzzer sounds — the clock simply records the score for that quarter (the Close) and immediately starts the next quarter (the next candle).',
        steps: [
          'Where the team started the quarter is the Open; where the score stands at the buzzer is the Close.',
          'If your team led by 10 halfway through but lost the lead before the buzzer, that temporary lead is just a thin upper wick — only the buzzer score counts!',
        ],
        keyTakeaway:
          'Wait for the buzzer (00:00 candle close) to know who actually won that slice of time.',
        practiceSafeHint:
          'Focus on where price stands when the timer actually expires, not where it briefly flickered halfway through.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Green Candle vs. Red Candle — Spot the Flip Immediately',
        summary:
          'The #1 beginner mix-up is forgetting that Open and Close swap places depending on the candle color.',
        steps: [
          'GREEN Candle (Price Went Up): Open = BOTTOM of the thick body. Close = TOP of the thick body. Buyers won.',
          'RED Candle (Price Went Down): Open = TOP of the thick body. Close = BOTTOM of the thick body. Sellers won.',
          'Both Colors Share the Same Wicks: Highest price is ALWAYS the top tip of the upper wick; Lowest price is ALWAYS the bottom tip of the lower wick.',
        ],
        keyTakeaway:
          'High is always the top tip, Low is always the bottom tip — only Open and Close flip between Green and Red.',
        practiceSafeHint:
          'Check the candle color first so you know whether the top edge of the box is the Open or the Close.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: 'Top 3 Beginner Candlestick Mistakes',
        summary:
          'Avoid these three habits on Day 1 and you will instantly read charts clearer than most beginners.',
        steps: [
          'Mistake 1: Clicking buy on a big green candle with 8 minutes left on the timer, then watching it flip into a red candle before it closes.',
          'Mistake 2: Thinking a candle closing means the market shut down — it is just the timeframe clock rolling over to the next bar.',
          'Mistake 3: Trying to memorize 40 fancy Japanese pattern names instead of simply reading body strength and wick rejection.',
        ],
        keyTakeaway:
          'Wait for the timer to close and read the simple buyer-vs-seller story behind every body and wick.',
        practiceSafeHint:
          'Always verify that the candle has closed and look at where it closed inside its total high-to-low range.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ca-1',
        lessonSlug: 'candlestick-anatomy',
        conceptKey: 'candlestick-anatomy',
        scenarioId: 'ca-green-red-candles',
        prompt:
          'A 15-minute candle opens at $100, dips down to $96, then rallies back up and closes at $102 when the timer hits 00:00. What does this finished candle look like?',
        options: [
          { id: 'a', label: 'A red candle with a long upper wick' },
          { id: 'b', label: 'A green candle with a $2 body ($100 bottom to $102 top) and a long $4 lower wick showing buyers rejected lower prices' },
          { id: 'c', label: 'A flat line with no wicks at all' },
          { id: 'd', label: 'An invalid candle because price moved below its opening price' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare the $102 Close against the $100 Open to find the color, then check how far below $100 price dipped.',
        ],
        postSubmissionRationale:
          'Because the $102 Close is higher than the $100 Open, the candle is green with Open at the bottom ($100) and Close at the top ($102). The brief dip to $96 leaves a long $4 lower wick proving buyers stepped in aggressively.',
        commonTrapNote:
          'Remember: on a green candle, Open is at the bottom of the body and Close is at the top — and the lower wick extends down to the lowest price touched.',
      },
      {
        id: 'pq-ca-2',
        lessonSlug: 'candlestick-anatomy',
        conceptKey: 'candlestick-anatomy',
        prompt:
          'Why does a candle on a 15-minute chart close, and why should you wait for it to close before making a decision?',
        options: [
          { id: 'a', label: 'Because the stock exchange pauses every 15 minutes for a break' },
          { id: 'b', label: 'Because its 15-minute timer hits 00:00 and locks in the final price; before 00:00, a green candle can completely flip red' },
          { id: 'c', label: 'Because wicks only show up on daily charts' },
          { id: 'd', label: 'Because brokers forbid watching moving candles' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about the basketball quarter clock: does the game stop, or does the timer lock in the quarter score?',
        ],
        postSubmissionRationale:
          'A candle closes simply because its fixed timeframe clock expires and starts the next bar. Waiting for 00:00 prevents you from reacting to a temporary mid-candle spike that reverses before the close.',
        commonTrapNote:
          'Jumping into trades mid-candle is one of the fastest ways beginners get trapped by fake spikes.',
      },
      {
        id: 'pq-ca-3',
        lessonSlug: 'candlestick-anatomy',
        conceptKey: 'candlestick-anatomy',
        prompt:
          'On a RED (down) candlestick, where are the Open and Close prices located on the thick colored body?',
        options: [
          { id: 'a', label: 'Open is at the TOP of the body, and Close is at the BOTTOM of the body' },
          { id: 'b', label: 'Open is at the BOTTOM of the body, and Close is at the TOP of the body' },
          { id: 'c', label: 'Open is always at the tip of the upper wick' },
          { id: 'd', label: 'Red candles do not have an opening price' },
        ],
        correctOptionId: 'a',
        hints: [
          'For a candle to turn red, price had to move DOWN from where it started to where it finished.',
        ],
        postSubmissionRationale:
          'A red candle means sellers pushed price downward during that time slice — so price started higher (Open at the top edge of the box) and finished lower (Close at the bottom edge of the box).',
        commonTrapNote:
          'Always check the color first: Green = Open bottom / Close top; Red = Open top / Close bottom.',
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
      'Learn why price bounces off "floors" (Support & Demand) and hits "ceilings" (Resistance & Supply) — and why drawing soft zones beats razor-thin lines.',
    plainEnglishSummary:
      'Think of a price chart like a tennis ball bouncing inside a room. Support is the floor where eager buyers step in and push price back up, while Resistance is the ceiling where eager sellers step in and push price back down. Supply and Demand zones simply pinpoint the exact price areas where big banks and funds placed huge buy or sell orders that launched fast, dramatic moves.',
    beginnerFaq: [
      {
        question: 'Why should I draw a shaded Zone instead of a single thin line?',
        answer:
          'Because real markets are messy — big buyers do not all click buy at $100.00 flat. Some buy at $100.40, others at $99.80. Drawing a small zone (like $99.50–$100.50) prevents you from thinking a level "broke" just because price dipped 20 cents past a razor-thin line.',
      },
      {
        question: 'What is the real difference between Support/Resistance and Supply/Demand?',
        answer:
          'Support and Resistance are obvious floors and ceilings where price bounced multiple times in the past. Supply and Demand zones are the fresh launchpad areas where price exploded away super fast on the very first try — meaning big institutional orders were left behind waiting for a return visit.',
      },
      {
        question: 'If price hits Support 4 times, does that make the floor stronger or weaker?',
        answer:
          'Weaker! Every time price visits a floor, some of the waiting buy orders get used up. Like jumping on thin ice four times in the same spot, the 1st visit is the strongest bounce, and by the 4th visit the floor is much more likely to crack.',
      },
      {
        question: 'What happens AFTER a floor breaks downward?',
        answer:
          'An old broken floor often turns into a brand-new ceiling — traders call this a Role Reversal (or Polarity Flip). Buyers who bought at $100 are now losing money when price drops to $95, so when price climbs back up to $100 they sell just to get their money back, pushing price down again.',
      },
    ],
    level: 'beginner',
    marketCategory: 'general',
    learningStage: 'foundations',
    moduleOrder: 4,
    conceptKey: 'support-resistance-supply-demand',
    estimatedMinutes: 16,
    learningObjectives: [
      'Draw clean Support (floor) and Resistance (ceiling) zones instead of fragile 1-pixel lines.',
      'Spot fresh Demand (big-buyer launchpad) and Supply (big-seller launchpad) zones by looking for fast, forceful departures.',
      'Understand Role Reversal (Polarity Flip) — why a broken ceiling turns into a new floor and vice versa.',
      'Recognize why the FIRST return visit to a fresh zone is far stronger than a 4th or 5th retest.',
    ],
    prerequisites: [
      'Candlestick Anatomy & Reading Price Action',
      'Market Structure Basics (Higher Highs, Higher Lows & Breaks of Structure)',
    ],
    terminology: [
      {
        term: 'Support (Floor) & Resistance (Ceiling)',
        shortCode: 'Floor / Ceiling',
        definition:
          'Price areas where falling prices previously found eager buyers (Support floor) or rising prices hit eager sellers (Resistance ceiling).',
        example:
          'A stock that bounces up near $95–$96 twice has Support there; if it stalls twice near $110–$111, that is Resistance.',
      },
      {
        term: 'Demand Zone & Supply Zone',
        shortCode: 'S&D Zones',
        definition:
          'The small pause area right before price rockets upward (Demand = huge buying imbalance) or plunges downward (Supply = huge selling imbalance).',
        example:
          'A quiet 2-candle pause at $95–$96 right before price explodes to $108 in three big green candles creates a fresh Demand Zone.',
      },
      {
        term: 'Role Reversal (Polarity Flip)',
        shortCode: 'S/R Flip',
        definition:
          'When price breaks cleanly through an old ceiling (Resistance), then comes back to land on top of that exact same zone as a brand-new floor (Support).',
        example:
          'Price finally breaks above its $110 ceiling to $116, dips back to $110, and bounces upward because $110 flipped from ceiling to floor.',
      },
      {
        term: 'Fresh (Unmitigated) Zone',
        shortCode: 'Fresh Zone',
        definition:
          'A Demand or Supply zone that price has NOT revisited yet. Because the waiting institutional orders have not been used up, the very first return visit usually reacts the sharpest.',
        example:
          'Buying the 1st pullback into a brand-new $95–$96 Demand Zone is far higher probability than buying the 4th tap.',
      },
    ],
    sections: [
      {
        id: 'sr-sec-1',
        heading: 'Floors & Ceilings: Always Draw Zones, Not Razor-Thin Lines',
        body: 'Imagine a stock bouncing between $95 and $110. Beginners draw one razor-thin line at exactly $95.00 and panic if a wick pokes to $94.70. Big funds spread millions of dollars across a price neighborhood, so always think in shaded zones.',
        bulletPoints: [
          'Support (Floor): A price band where buyers previously stepped in strongly enough to stop a drop (for example, $94.80–$95.60).',
          'Resistance (Ceiling): A price band where sellers previously stepped in strongly enough to stop a rally (for example, $109.50–$110.50).',
          'Keep It Clean: Mark only the 2 or 3 most obvious major zones closest to current price — drawing 20 lines makes charts unreadable.',
        ],
        keyTakeaway:
          'Treat Support and Resistance like padded cushions (zones), not razor-thin glass walls.',
      },
      {
        id: 'sr-sec-2',
        heading: 'Demand & Supply Zones: Spotting Where Big Money Left Footprints',
        body: 'How can a beginner tell where big banks actually placed massive orders? Look for speed! When price pauses quietly for 1–3 candles and then rockets away with tall, solid candles that break a recent high or low (a Break of Structure), huge orders sat at that starting box.',
        bulletPoints: [
          'Demand Zone (Big Buyers): A tight small pause (say $95–$96) followed by explosive green candles blasting up to $108 and breaking a prior peak.',
          'Supply Zone (Big Sellers): A tight small pause (say $110–$111) followed by explosive red candles plunging down to $98 and breaking a prior floor.',
          'Why Price Reacts Later: Big institutions often cannot get all $50 million filled in one second before price shoots away, so they leave resting orders inside that box. When price returns, those waiting orders kick in!',
        ],
        keyTakeaway:
          'Fast, forceful departure away from a small pause is the #1 clue that big institutional money sat in that zone.',
      },
      {
        id: 'sr-sec-3',
        heading: 'Why Fresh Zones Hold, Old Zones Break & Ceilings Flip Into Floors',
        body: 'Think of buy orders at a Support floor like bottles of water on a grocery shelf. Every time price returns to the $95 floor, shoppers grab more bottles until the shelf is empty — and then price falls right through.',
        bulletPoints: [
          '1st Visit (Fresh / Unmitigated Zone): Full shelf of waiting orders — highest chance of a clean bounce.',
          '3rd or 4th Visit (Worn-Out Level): Most waiting orders are already gone, and tons of traders have placed stop-losses right underneath — making a breakdown much more likely.',
          'Role Reversal (Polarity Flip): Once a full candle body closes cleanly ABOVE a $110 ceiling (or BELOW a $95 floor), stop betting on the old bounce. Watch for price to retest the broken level from the other side!',
        ],
        keyTakeaway:
          'Favor the first visit to a fresh zone; when a zone breaks with a solid candle close, expect old ceilings to become new floors.',
      },
    ],
    diagramConfig: {
      kind: 'support_demand',
      title: 'Fresh Demand Floor, Supply Ceiling & Ceiling-to-Floor Flip',
      subtitle: 'How explosive launches create high-probability zones and how broken levels swap roles',
      caption:
        'Strong green candles launching out of a compact base create a fresh Demand Zone; breaking cleanly above Resistance flips that former ceiling into a new Support floor.',
      legend: [
        { label: 'Supply / Resistance Ceiling (Sellers)', colorToken: '#ef4444' },
        { label: 'Demand / Support Floor (Buyers)', colorToken: '#10b981' },
        { label: 'Role Reversal (Broken Ceiling → New Floor)', colorToken: '#38bdf8' },
      ],
      annotations: [
        { id: 'sr1', label: 'Demand Base', sublabel: 'Small Pause Before Fast Rally', tone: 'bullish' },
        { id: 'sr2', label: 'Fast Launch', sublabel: 'Tall Bodies Prove Big Buyers', tone: 'bullish' },
        { id: 'sr3', label: '1st Retest', sublabel: 'Fresh Zone Clean Bounce', tone: 'liquidity' },
        { id: 'sr4', label: 'Role Flip', sublabel: 'Old Ceiling Acts as New Floor', tone: 'neutral' },
      ],
      walkthroughSteps: [
        'Find the fast, tall-candle move first, then trace back to the small 1–3 candle base where it began.',
        'Check if the zone is fresh (untouched since launch) or already tapped 3–4 times.',
        'Wait patiently for price to return to the zone and print a confirming candle close instead of buying in the dead middle of a range.',
      ],
    },
    chartScenarioIds: ['sd-demand-bounce'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Buy Near the Floor, Sell Near the Ceiling — Never in the Middle',
        summary:
          'Demand is a floor where big buyers previously rushed in so fast that price shot away. Supply is a ceiling where big sellers pushed price down hard. Waiting for price to revisit a fresh floor or ceiling puts the odds on your side.',
        steps: [
          'Spot a fast, energetic jump away from a small pause of 1–3 candles.',
          'Draw a clean box around that starting pause — that is your Demand or Supply zone.',
          'Wait patiently for price to come back to your box for the very first time before taking action.',
        ],
        keyTakeaway:
          'Fast launches reveal big-money zones, and the very first return visit gives the cleanest bounce.',
        practiceSafeHint:
          'Check how fast price left the zone and whether this is the first visit or a worn-out fourth tap.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Step Beginner Zone Checklist',
        summary:
          'Use these four simple checks so your chart stays clean and uncluttered.',
        steps: [
          'Step 1: Spot a sharp move made of tall solid candles that breaks a recent swing high or low (Break of Structure).',
          'Step 2: Draw a box around the tiny 1–3 candle base right before that rocket launched.',
          'Step 3: Check freshness — make sure price has not already tapped and worn out that box three times.',
          'Step 4: Wait for price to return to the box and print a clear rejection wick or solid bounce candle.',
        ],
        keyTakeaway:
          'Fast departure + Break of Structure + Freshness = a high-quality Demand or Supply zone.',
        practiceSafeHint:
          'Trace where the strongest move actually started rather than drawing lines through random small wicks.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Fresh Demand Launchpad vs. Worn-Out Floor ($95–$110 Example)',
        summary:
          'Imagine price pauses quietly at $95–$96, then rockets straight up to $108 in three big green candles. When price drifts gently back down to $96 for the very first time, waiting buyers step right back in and push price above $110.',
        steps: [
          'The explosive launch from $95–$96 proves big buyers overwhelmed sellers there.',
          'On the first pullback into $96, shrinking red candles + a green rejection close confirm buyers are still defending the floor.',
          'Once a full green candle closes above $110, that old $110 ceiling flips into a brand-new floor on the next dip.',
        ],
        keyTakeaway:
          'Respect fresh launchpads and watch broken ceilings flip into new floors.',
        practiceSafeHint:
          'Look at both departure speed out of the zone and how many times the zone has already been touched.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Thick Ice vs. Cracked Ice (Why More Touches Make Floors Weaker)',
        summary:
          'A brand-new Support or Demand floor is thick ice that easily holds your weight on the first step. Jumping on the exact same spot four times cracks the ice until the next step falls straight through.',
        steps: [
          'First tap uses up some of the waiting buy orders (strong bounce).',
          'Each extra tap drains more orders until barely any buyers are left.',
          'When sellers finally break through the cracked floor, that old floor turns into a ceiling overhead.',
        ],
        keyTakeaway:
          'More touches do NOT make a level stronger — they gradually use up the waiting orders.',
        practiceSafeHint:
          'Ask whether the floor is fresh and untouched or already weakened by repeated bounces.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Classic Support/Resistance vs. Fresh Supply/Demand Zones',
        summary:
          'Both tools are helpful once you know what each one actually shows.',
        steps: [
          'Classic Support/Resistance: An obvious horizontal area touched 3+ times (great for seeing where everyone is watching, but increasingly likely to break).',
          'Fresh Supply/Demand Zone: The untouched origin box behind an explosive breakout move (fresh unfilled big-money orders waiting for a 1st retest).',
        ],
        keyTakeaway:
          'Use classic floors/ceilings to map the room, and fresh Supply/Demand zones to spot high-conviction bounces.',
        practiceSafeHint:
          'Compare a tired level hit 4 times against a fresh launchpad that exploded away with big bodies.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Zone Mistakes Almost Every Beginner Makes',
        summary:
          'Clean charts lead to calm decisions — avoid these three common errors.',
        steps: [
          'Mistake 1: Drawing 15 horizontal lines across the chart until price is "touching a line" every five minutes.',
          'Mistake 2: Buying a Support floor on its 4th or 5th bounce while each bounce gets smaller and weaker.',
          'Mistake 3: Selling at an old $110 ceiling even after a big green candle already closed cleanly above $110.',
        ],
        keyTakeaway:
          'Mark only 2–3 fresh, obvious zones — and never fight a level after a solid candle breaks through it.',
        practiceSafeHint:
          'Check whether the zone caused a real fast departure and whether it is still unbroken.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-sr-1',
        lessonSlug: 'support-resistance-supply-demand',
        conceptKey: 'support-resistance-supply-demand',
        scenarioId: 'sd-demand-bounce',
        prompt:
          'What is the clearest sign that a Demand Zone (big-buyer floor) actually holds strong institutional buy orders?',
        options: [
          { id: 'a', label: 'Price drifted lazily sideways out of the zone for 20 tiny candles' },
          { id: 'b', label: 'Tall, forceful green candles exploded away from the small base and broke a prior swing high' },
          { id: 'c', label: 'Price already bounced off the exact same spot six separate times' },
          { id: 'd', label: 'The line lands on an even dollar amount' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember how big-money footprints look when price leaves a starting base.',
        ],
        postSubmissionRationale:
          'An explosive departure with tall solid candles that breaks prior structure proves big buy orders vastly outweighed sellers at that zone, leaving strong interest on a first return visit.',
        commonTrapNote:
          'Slow, choppy departures show zero real imbalance and rarely hold on a pullback.',
      },
      {
        id: 'pq-sr-2',
        lessonSlug: 'support-resistance-supply-demand',
        conceptKey: 'support-resistance-supply-demand',
        prompt:
          'A stock has bounced off its $95 Support floor four times in a row, and each bounce is getting smaller. What is most likely happening?',
        options: [
          { id: 'a', label: 'The $95 floor is becoming permanently unbreakable' },
          { id: 'b', label: 'Waiting buy orders at $95 are getting used up, making the floor weaker and prone to breaking down' },
          { id: 'c', label: 'The stock exchange automatically doubles buyers after four touches' },
          { id: 'd', label: 'Support floors can never break during normal market hours' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think of the cracking-ice analogy: what happens to waiting buy orders on every repeat visit?',
        ],
        postSubmissionRationale:
          'Each retest fills and drains more resting buy orders while stacking nervous traders’ stop-losses directly below $95 — making repeated taps weaker, not stronger.',
        commonTrapNote:
          'Many beginners mistakenly think "more bounces = stronger floor" and buy right before the breakdown.',
      },
      {
        id: 'pq-sr-3',
        lessonSlug: 'support-resistance-supply-demand',
        conceptKey: 'support-resistance-supply-demand',
        prompt:
          'What is a Role Reversal (Polarity Flip) in price action?',
        options: [
          { id: 'a', label: 'Swapping your chart colors from green and red to black and white' },
          { id: 'b', label: 'When an old ceiling (Resistance) breaks cleanly upward and then acts as a new floor (Support) on the pullback' },
          { id: 'c', label: 'Opening a buy trade and a sell trade at the exact same second' },
          { id: 'd', label: 'Deleting your stop-loss whenever a level breaks' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how a broken ceiling behaves once price climbs above it and comes back to stand on top of it.',
        ],
        postSubmissionRationale:
          'Once buyers push cleanly above an old ceiling (like $110), former sellers exit and waiting buyers step in on the pullback — turning that old ceiling into a new floor.',
        commonTrapNote:
          'Continuing to sell an old ceiling after a solid candle closes above it fights the new buyer control.',
      },
    ],
  },

  // =========================================================================
  // MODULE 8: Order Blocks, CHoCH & Institutional Displacement
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000009',
    slug: 'order-blocks-bos-choch',
    title: 'Order Blocks, Change of Character & Institutional Displacement',
    subtitle:
      'Learn how to spot the exact launchpad candle behind big moves (Order Block) and recognize the very first U-turn signal (Change of Character) in plain English.',
    plainEnglishSummary:
      'An Order Block is simply the very last opposite-colored candle right before a huge, fast burst of buying or selling — like a sprinter pushing backward into the starting blocks before exploding forward. A Change of Character is the very first U-turn signal showing a downtrend may be flipping into an uptrend (or vice versa). Put together, they help you spot where big institutions actually stepped in instead of chasing moves late.',
    beginnerFaq: [
      {
        question: 'Does EVERY red candle before a green candle count as an Order Block?',
        answer:
          'No! That is the #1 mistake beginners make. A real Order Block must be followed immediately by a fast, powerful burst of candles (Displacement) that breaks a meaningful prior high or low. If price drifted slowly upward, that red candle is NOT an Order Block.',
      },
      {
        question: 'In simple words, what is the difference between Break of Structure and Change of Character?',
        answer:
          'Break of Structure means the CURRENT trend is continuing (like an uptrend making a brand-new higher peak). Change of Character is the VERY FIRST U-turn break in the OPPOSITE direction (like a falling market suddenly closing above its last bounce peak).',
      },
      {
        question: 'Why does price even come back to visit an Order Block later?',
        answer:
          'Because big banks move so much money (tens of millions of dollars) that they cannot fill every order at $98 before price rockets to $106. They leave leftover orders waiting near $98 — so when price pulls back there, those waiting orders kick in and push price upward again.',
      },
      {
        question: 'What is "Inducement" and why do beginners get trapped by it?',
        answer:
          'Inducement is a tempting-looking early floor or small Order Block sitting right ABOVE the real big-money zone. Impatient traders buy early there and put their stops just underneath — price dips slightly deeper to knock out those early stops, taps the REAL Order Block, and then rockets up without them.',
      },
    ],
    level: 'intermediate',
    marketCategory: 'general',
    learningStage: 'price_action_smc',
    moduleOrder: 9,
    conceptKey: 'order-blocks-bos-choch',
    estimatedMinutes: 20,
    learningObjectives: [
      'Spot a valid Bullish or Bearish Order Block (the last opposite candle before a fast, forceful move) using a simple 3-part filter.',
      'Tell the difference between a Change of Character (first U-turn signal) and a Break of Structure (trend continuing).',
      'Combine an Order Block with a Fair Value Gap (an empty price gap left by a super-fast move) for cleaner entries.',
      'Avoid early "Inducement" trap zones sitting right in front of the true extreme Order Block.',
    ],
    prerequisites: [
      'Market Structure Basics (Higher Highs, Higher Lows & Breaks of Structure)',
      'Liquidity Sweeps vs. True Breakouts',
      'Fair Value Gaps & Price Imbalances',
    ],
    terminology: [
      {
        term: 'Order Block (Launchpad Candle)',
        shortCode: 'OB',
        definition:
          'The very last opposite-colored candle right before a huge, fast burst of momentum — the final red candle before a massive green rally, or the final green candle before a sharp red drop.',
        example:
          'A final red candle dipping to $98 right before buyers blast price straight up to $106 and break a prior high.',
      },
      {
        term: 'Change of Character (First U-Turn Signal)',
        shortCode: 'CHoCH',
        definition:
          'The very first solid candle close breaking structure in the OPPOSITE direction of the current trend — your first clear warning that buyers or sellers just took over.',
        example:
          'After falling from $110 to $104 to $98, price suddenly closes a solid green candle above the last $104 bounce peak.',
      },
      {
        term: 'Displacement (Fast Institutional Burst)',
        shortCode: 'Displacement',
        definition:
          'Big, tall, energetic candles moving swiftly in one direction with almost no pause, often leaving an empty price gap (Fair Value Gap) behind them.',
        example:
          'Three tall green candles shooting from $98 to $106 in minutes, proving big money is aggressively buying.',
      },
      {
        term: 'Inducement (Early-Buyer Trap)',
        shortCode: 'Trap',
        definition:
          'A shallow, tempting-looking early zone sitting right in front of the true untouched Order Block that lures impatient traders in too soon before getting swept.',
        example:
          'Buyers jump in at $101 while the real untouched Order Block sits at $98; price dips to $98, stops them out, then rallies to $112.',
      },
    ],
    sections: [
      {
        id: 'ob-sec-1',
        heading: 'What Makes an Order Block Actually Real? (The 3-Box Test)',
        body: 'Imagine price drops to $98 on one final red candle, then suddenly explodes upward to $106 in three giant green candles. That final $98 red candle is a Bullish Order Block — but ONLY if it passes all three checks:',
        bulletPoints: [
          'Check 1 — Grabbed Stops First (Liquidity Sweep): That final red candle (or its wick) dipped below a recent low to grab resting stop orders or touched a major floor.',
          'Check 2 — Fast Explosive Launch (Displacement + Fair Value Gap): Price blasted away immediately with tall solid candles, leaving behind an empty price gap (Fair Value Gap) where buyers totally overwhelmed sellers.',
          'Check 3 — Broke a Real Level: That fast move closed a solid candle body beyond a prior swing peak (either a Change of Character U-turn or a Break of Structure continuation).',
        ],
        keyTakeaway:
          'No stop-grab + no fast launch + no broken level = NOT a valid Order Block. Skip it!',
      },
      {
        id: 'ob-sec-2',
        heading: 'Change of Character (First U-Turn) vs. Break of Structure (Continuing)',
        body: 'Beginners often confuse these two terms and flip their direction on every tiny wiggle. Keep this simple picture in your mind:',
        bulletPoints: [
          'Break of Structure (Continuing the Same Road): Price is already trending UP ($100 → $106 → $103 → closes above $106). That confirms buyers are STILL in control.',
          'Change of Character (First U-Turn Signal): Price was trending DOWN ($110 → $104 → $106 → $98), then suddenly blasts UP and closes cleanly above that last $106 bounce peak. That first opposite break warns sellers just lost control!',
          'Where to Trust a U-Turn: A Change of Character is far more reliable when it happens right after price dips into a major floor — never in random sideways chop.',
        ],
        keyTakeaway:
          'Change of Character is the FIRST U-turn signal; Break of Structure confirms the new trend is continuing.',
      },
      {
        id: 'ob-sec-3',
        heading: 'Pairing Order Block + Price Gap & Dodging Early-Buyer Traps',
        body: 'Once a fast launch from $98 to $106 creates a Change of Character, do NOT chase at $106! Wait for price to drift back down to visit the $98–$100 launchpad area so your risk stays tiny.',
        bulletPoints: [
          'Order Block + Fair Value Gap Combo: When an empty price gap sits right on top of a fresh Order Block (say $98–$101), price often dips through the gap and taps the top edge or 50% halfway point of the Order Block before launching again.',
          'Dodge Early Traps (Inducement): If there is a small messy pause at $102 AND a clean, untouched Order Block at $98 below it, be patient — price frequently sweeps through $102 to trigger impatient stops before bouncing at $98.',
          'Where Your Stop Goes: Place your safety stop-loss cleanly below the bottom wick of the Order Block (for example, $97.50). If a solid candle closes straight through the Order Block, the idea is wrong — exit cleanly.',
        ],
        keyTakeaway:
          'Wait for the U-turn (Change of Character), mark the untouched extreme Order Block at the bottom of the launch, and let price come back to you.',
      },
    ],
    diagramConfig: {
      kind: 'order_block_choch',
      title: 'Order Block Launchpad & Change of Character (U-Turn) Sequence',
      subtitle: 'Step-by-step path from downtrend sweep → U-turn break → pullback to Order Block → rally',
      caption:
        'After a final down candle sweeps lows (Order Block), fast green candles close above the last Lower High (Change of Character). Waiting for the gentle pullback into the Order Block gives a low-risk entry.',
      legend: [
        { label: 'Bullish Order Block (Last Red Launchpad Candle)', colorToken: '#10b981' },
        { label: 'Change of Character (First U-Turn Close)', colorToken: '#38bdf8' },
        { label: 'Stop-Grab Sweep Before Launch', colorToken: '#f59e0b' },
      ],
      annotations: [
        { id: 'ob1', label: 'Order Block', sublabel: 'Last Red Candle Sweeping Low', tone: 'bullish' },
        { id: 'ob2', label: 'Fast Burst', sublabel: 'Tall Candles + Price Gap', tone: 'bullish' },
        { id: 'ob3', label: 'U-Turn (CHoCH)', sublabel: 'Solid Close Above Prior Peak', tone: 'neutral' },
        { id: 'ob4', label: 'Calm Retest', sublabel: 'Buy Pullback Into OB Zone', tone: 'liquidity' },
      ],
      walkthroughSteps: [
        'Watch a downtrend dip into a key floor and grab resting stops below a recent low.',
        'Wait for tall, energetic green candles to close cleanly above the last bounce peak (Change of Character U-turn).',
        'Mark the last red candle at the bottom of that launch (the Order Block) and wait patiently for price to pull back into it.',
      ],
    },
    chartScenarioIds: ['ob-choch-reversal'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'The Launchpad Candle Right Before a Rocket Takes Off',
        summary:
          'Right before price rockets upward, big buyers often push price down for one last red candle to scoop up cheap shares. Once the rocket takes off and makes a U-turn (Change of Character), price often drifts back to that red launchpad candle one last time before climbing higher.',
        steps: [
          'Wait for a fast rocket move (tall solid candles) that closes above a recent peak (U-turn).',
          'Look down at the very last red candle right at the start of that rocket — that is your Order Block.',
          'Wait patiently for price to drift back down to that launchpad candle instead of chasing at the top.',
        ],
        keyTakeaway:
          'An Order Block only counts if a fast, structure-breaking rocket actually launched right out of it.',
        practiceSafeHint:
          'Check whether fast candles and a confirmed U-turn break actually followed that candle.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Box Filter for Spotting a Real Order Block',
        summary:
          'Check off all three boxes before trusting any Order Block on your screen.',
        steps: [
          'Box 1: Did the candle (or its wick) dip below a prior low to grab resting stops?',
          'Box 2: Did the very next candles shoot upward fast and leave an empty price gap (Fair Value Gap)?',
          'Box 3: Did that move close a solid candle body past a prior peak (Change of Character or Break of Structure)?',
        ],
        keyTakeaway:
          'If even one of those three boxes is missing, skip the candle and wait for a cleaner chart.',
        practiceSafeHint:
          'Verify stop-grab, fast displacement, and a confirmed body close past structure.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Walking Through a $98 Order Block & $104 U-Turn Example',
        summary:
          'Picture a stock sliding from $110 to $104 down to $98. At $98, one final red candle dips below prior lows, then three huge green candles blast up to $106 — closing cleanly above $104 for a bullish Change of Character.',
        steps: [
          'The final red candle at $98–$99.50 is the Bullish Order Block.',
          'Instead of chasing at $106, you wait for price to drift gently back down to $99 with a tight safety stop at $97.50 ($1.50 risk).',
          'Waiting buyers at the Order Block kick in and drive price to $108+ — earning $9 profit on $1.50 risk!',
        ],
        keyTakeaway:
          'Waiting for the pullback to the Order Block turns a risky chase into a calm, low-risk entry.',
        practiceSafeHint:
          'Locate the very last opposite candle sitting directly underneath the fast breakout leg.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'A Sprinter Pushing Back Against the Starting Blocks',
        summary:
          'Before sprinting forward at full speed, a track runner pushes backward firmly against the starting blocks to launch with power. That quick backward push is the last red Order Block candle right before price explodes upward.',
        steps: [
          'The quick push down grabs resting orders (filling big buyers).',
          'The explosive sprint forward creates the U-turn (Change of Character) and price gap.',
          'If price strolls back to those starting blocks later, the same buyers often defend it again.',
        ],
        keyTakeaway:
          'Opposite-colored candles immediately before explosive bursts mark where big money pushed off.',
        practiceSafeHint:
          'Look for the final opposite candle sitting directly at the base of the explosive move.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Change of Character (U-Turn) vs. Break of Structure (Continuing)',
        summary:
          'Never mix up a trend continuing with a trend flipping direction.',
        steps: [
          'Change of Character (U-Turn): Price was falling, sweeps a low, then closes cleanly ABOVE the last bounce high — first sign buyers took over.',
          'Break of Structure (Continuation): Price is ALREADY rising, pulls back, then closes cleanly ABOVE the previous high — confirming buyers are still in charge.',
        ],
        keyTakeaway:
          'Change of Character spots the turn; Break of Structure confirms the new trend is rolling.',
        practiceSafeHint:
          'Ask whether the broken level goes WITH the current trend or AGAINST it for the very first time.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Order Block Mistakes That Catch Beginners Off Guard',
        summary:
          'Most frustration with Order Blocks comes from marking too many weak candles.',
        steps: [
          'Mistake 1: Calling EVERY red candle an Order Block even when price barely moved afterward.',
          'Mistake 2: Buying a shallow middle-of-the-move block while an untouched extreme Order Block sits right below it (getting caught in an Inducement trap).',
          'Mistake 3: Buying an old Order Block that price already visited and used up twice earlier.',
        ],
        keyTakeaway:
          'Only trade fresh, untouched extreme Order Blocks backed by fast launches and real structural breaks.',
        practiceSafeHint:
          'Check whether the zone is fresh and whether an untouched deeper launchpad sits right underneath.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ob-1',
        lessonSlug: 'order-blocks-bos-choch',
        conceptKey: 'order-blocks-bos-choch',
        scenarioId: 'ob-choch-reversal',
        prompt:
          'Which combination passes the 3-box test for a valid Bullish Order Block?',
        options: [
          { id: 'a', label: 'Any random red candle followed by one tiny green pause candle' },
          { id: 'b', label: 'The last red candle that grabbed lows, followed immediately by tall fast green candles (with a price gap) closing above a prior peak' },
          { id: 'c', label: 'A green candle inside sideways chop that price already touched three times' },
          { id: 'd', label: 'A candle chosen purely because it landed on a round dollar number' },
        ],
        correctOptionId: 'b',
        hints: [
          'Check all three boxes: stop-grab, fast explosive burst, and a solid close breaking a prior peak.',
        ],
        postSubmissionRationale:
          'A valid Bullish Order Block grabs liquidity at lows, launches fast displacement (often leaving a Fair Value Gap), and closes decisively above prior structure.',
        commonTrapNote:
          'Marking random red candles with weak follow-through turns Order Blocks into pure guessing.',
      },
      {
        id: 'pq-ob-2',
        lessonSlug: 'order-blocks-bos-choch',
        conceptKey: 'order-blocks-bos-choch',
        prompt:
          'In plain English, how is a Change of Character different from a Break of Structure?',
        options: [
          { id: 'a', label: 'Change of Character is the FIRST U-turn break against the old trend; Break of Structure confirms the current trend is continuing' },
          { id: 'b', label: 'Break of Structure only works in Forex while Change of Character only works in Crypto' },
          { id: 'c', label: 'Change of Character ignores candle closes completely' },
          { id: 'd', label: 'They mean the exact same thing with zero difference' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about making a U-turn onto the opposite road versus continuing down the same highway.',
        ],
        postSubmissionRationale:
          'Change of Character is the very first solid close in the opposite direction warning that control shifted; Break of Structure confirms continuation in the already established direction.',
        commonTrapNote:
          'Only trust a Change of Character near a meaningful floor or ceiling — not in random mid-range noise.',
      },
      {
        id: 'pq-ob-3',
        lessonSlug: 'order-blocks-bos-choch',
        conceptKey: 'order-blocks-bos-choch',
        prompt:
          'Why do impatient traders often get stopped out when buying a shallow Order Block halfway up a big rally?',
        options: [
          { id: 'a', label: 'Because that shallow mid-leg block often acts as an early-buyer trap (Inducement) right before price dips to the deeper untouched Order Block' },
          { id: 'b', label: 'Because deeper Order Blocks never get reached by price' },
          { id: 'c', label: 'Because brokers cancel trades placed halfway up a move' },
          { id: 'd', label: 'Because Order Blocks only exist on weekly charts' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about what happens when impatient buyers stack stops right above the real untouched launchpad.',
        ],
        postSubmissionRationale:
          'Shallow mid-leg blocks attract early buyers whose stops rest directly above the true extreme Order Block; price frequently sweeps those early stops to tap the deeper fresh zone before rallying.',
        commonTrapNote:
          'Always scan below your candidate zone to see if a cleaner, untouched extreme Order Block sits right underneath.',
      },
    ],
  },

  // =========================================================================
  // MODULE 9: Multi-Timeframe Analysis (Big-Picture Map to Zoomed-In Entry)
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000010',
    slug: 'multi-timeframe-alignment',
    title: 'Multi-Timeframe Analysis (Big-Picture Map to Zoomed-In Entry)',
    subtitle:
      'Stop getting confused by conflicting charts: learn how to check the zoomed-out big picture first, then zoom in to time calm, low-risk entries.',
    plainEnglishSummary:
      'Reading multiple timeframes is just like using Google Maps: you zoom out to see which highway heads toward your city (the Higher Timeframe, like 4-hour or Daily), then you zoom in to street view only when you need to time your exact turn (the Lower Timeframe, like 5-minute or 15-minute). Most beginners stare only at a 5-minute chart and panic at tiny dips that are actually normal pit stops inside a huge uptrend.',
    beginnerFaq: [
      {
        question: 'How can the 4-hour chart be going UP while the 5-minute chart is going DOWN at the exact same moment?',
        answer:
          'Because price never moves in a straight vertical line! Suppose a stock climbs from $100 to $120 on the 4-hour chart, then takes a healthy rest back down to $108 before climbing to $130. During that healthy rest from $120 down to $108, zooming into a 5-minute chart looks like a mini downtrend — even though the big-picture trend is still strongly UP.',
      },
      {
        question: 'How many timeframes should a beginner use?',
        answer:
          'Stick to exactly THREE charts — no more! For day trading, use 4-Hour (big-picture direction) → 1-Hour or 15-Minute (key buy/sell zones) → 5-Minute (exact entry timing). Checking 8 or 9 charts just gives you a headache and mixed signals.',
      },
      {
        question: 'What does buying in "Discount" vs. "Premium" mean in plain English?',
        answer:
          'Imagine a stock just rallied from $100 to $120. The halfway price is $110. Anything BELOW $110 (say $105) is "on sale" (Discount) — a smart bargain price to buy in an uptrend. Anything ABOVE $110 (say $118) is "expensive" (Premium) — where chasing buys gets you caught in pullbacks.',
      },
      {
        question: 'When two timeframes disagree, which one wins?',
        answer:
          'The bigger timeframe (Higher Timeframe) wins almost every time! A 4-hour or Daily zone holds far more institutional money than a tiny 5-minute wiggle. Always wait for the small chart to turn back in the same direction as the big chart.',
      },
    ],
    level: 'intermediate',
    marketCategory: 'general',
    learningStage: 'price_action_smc',
    moduleOrder: 10,
    conceptKey: 'multi-timeframe-alignment',
    estimatedMinutes: 18,
    learningObjectives: [
      'Use a simple 3-chart top-down routine (Big Picture → Key Zone → Entry Trigger) without flipping across 9 confusing charts.',
      'Understand why a zoomed-in 5-minute downtrend is often just a healthy pullback inside a 4-hour uptrend.',
      'Use the 50% halfway rule (buying on sale in Discount, selling expensive in Premium) to stop chasing stretched moves.',
      'Shrink your risk distance by waiting for a zoomed-in 5-minute U-turn inside a pre-marked big-picture zone.',
    ],
    prerequisites: [
      'Market Structure Basics (Higher Highs, Higher Lows & Breaks of Structure)',
      'Order Blocks, Change of Character & Institutional Displacement',
    ],
    terminology: [
      {
        term: 'Top-Down Analysis (Zoom Out First)',
        shortCode: 'Top-Down',
        definition:
          'Always starting on the biggest timeframe first to see the overall direction, then stepping down step by step to find your zone and exact entry.',
        example:
          'Check 4-Hour first (uptrend) → mark a 1-Hour Demand floor at $105 → switch to 5-Minute ONLY when price reaches $105.',
      },
      {
        term: 'Higher Timeframe vs. Lower Timeframe',
        shortCode: 'HTF / LTF',
        definition:
          'Higher Timeframe (4-Hour, Daily) shows the big-picture direction and major targets. Lower Timeframe (5-Minute, 15-Minute) zooms in to fine-tune entry timing and keep your stop-loss small.',
        example:
          'The 4-Hour chart says "Buy toward $120"; the 5-Minute chart shows the exact candle to click buy at $105.',
      },
      {
        term: 'Point of Interest (Pre-Marked Zone)',
        shortCode: 'POI',
        definition:
          'A clean big-picture zone (such as a 1-Hour Demand floor, Order Block, or price gap) where you set an alert and wait for price to arrive before zooming in.',
        example:
          'Marking a 1-Hour Demand floor at $105–$106 and leaving the 5-Minute chart closed until your $106 price alert rings.',
      },
      {
        term: 'Discount (On Sale) vs. Premium (Expensive)',
        shortCode: '50% Rule',
        definition:
          'Splitting a big move right down the 50% middle line: in an uptrend, look to buy in the cheaper bottom half (Discount); in a downtrend, look to sell in the pricier top half (Premium).',
        example:
          'After a $100 to $120 rally, the halfway line is $110 — waiting to buy near $105–$108 gets you a bargain instead of chasing at $119.',
      },
    ],
    sections: [
      {
        id: 'mtf-sec-1',
        heading: 'The 3-Chart Stack: Big Map, Waiting Zone, Entry Trigger',
        body: 'Flipping back and forth across 1-minute, 3-minute, 5-minute, 15-minute, 30-minute, 1-hour, 4-hour, and Daily charts guarantees total confusion. Pick ONE simple 3-chart stack where each chart has one clear job:',
        bulletPoints: [
          'Chart 1 — The Big Map (4-Hour or Daily): Answers ONE question — "Are buyers or sellers in charge overall, and where is price headed next?"',
          'Chart 2 — The Waiting Zone (1-Hour or 15-Minute): Marks ONE clean "on-sale" Demand/Order Block floor (in an uptrend) or Supply ceiling (in a downtrend) and sets a price alert there.',
          'Chart 3 — The Entry Trigger (5-Minute): Stays CLOSED until price hits your waiting zone — then shows the exact zoomed-in U-turn (Change of Character) to enter cleanly.',
        ],
        keyTakeaway:
          'Big chart tells you WHICH direction and WHERE price wants to go; small chart tells you WHEN to enter with small risk.',
      },
      {
        id: 'mtf-sec-2',
        heading: 'Why Small Charts Look Opposite During Big-Picture Pullbacks',
        body: 'Picture a stock climbing on the 4-Hour chart from $100 up to $120. Healthy uptrends breathe — so price pulls back down from $120 to $106 before launching to $130. Understanding this single idea saves beginners hundreds of losing trades:',
        bulletPoints: [
          'During that $120 → $106 pullback, the 5-Minute chart prints falling red candles and lower peaks — looking like a scary downtrend if you never zoomed out!',
          'Unprepared beginners start selling on the 5-Minute chart right at $107 — slamming head-first into a massive 4-Hour Demand floor at $105–$106 and getting reversed immediately.',
          'Aligned traders smile, watch the 5-Minute pullback tap their 4-Hour/1-Hour $105 floor, wait for the 5-Minute chart to make a bullish U-turn (Change of Character), and ride the huge wave back to $120+!',
        ],
        keyTakeaway:
          'When the 5-minute chart fights the 4-hour chart, do not fight the giant — wait for the 5-minute chart to turn back in the 4-hour direction.',
      },
      {
        id: 'mtf-sec-3',
        heading: 'How Zooming In Shrinks Risk Without Chasing Tiny Noise',
        body: 'Why bother zooming into a 5-minute chart at all if the 4-hour chart already tells you the direction? Because zooming in lets you shrink your stop-loss dramatically — unlocking much bigger rewards for the exact same $100 risk!',
        bulletPoints: [
          'Real Dollar Comparison: On the 4-Hour chart, buying blindly at $106 might need a wide $6 stop down to $100 — so a climb to $120 ($14 gain) is about 2.3x your risk. Zooming into the 5-Minute U-turn at $105.50 might only need a $2 stop to $103.50 — turning that exact same move to $120 ($14.50 gain) into 7x your risk!',
          'Do NOT Over-Zoom: Stick to the 5-Minute (or 15-Minute for swing trades) — dropping to messy 1-minute charts makes you miss great trades waiting for impossible perfection.',
          'Hold for the Big Target: Since you entered at a big-picture floor, aim for the big-picture target ($120) instead of cashing out nervously after a tiny $1 wiggle.',
        ],
        keyTakeaway:
          'Big-picture target + zoomed-in 5-minute confirmation entry gives you small stops, big upside, and way less screen stress.',
      },
    ],
    diagramConfig: {
      kind: 'multi_timeframe',
      title: 'Top-Down Alignment: 4-Hour Big Picture + 5-Minute Entry Turn',
      subtitle: 'How a 5-minute pullback lands inside a 4-hour "On Sale" zone and flips back upward',
      caption:
        'Left panel: 4-Hour uptrend pulls back below the 50% halfway line into a fresh Demand floor. Right panel: Zooming into the 5-Minute chart inside that floor reveals the exact U-turn (Change of Character) for a tight-stop entry.',
      legend: [
        { label: '4-Hour Big-Picture Uptrend', colorToken: '#10b981' },
        { label: '5-Minute Pullback Into Discount Zone', colorToken: '#94a3b8' },
        { label: '5-Minute U-Turn Entry Trigger', colorToken: '#38bdf8' },
      ],
      annotations: [
        { id: 'mtf1', label: '4H Trend', sublabel: 'Overall Direction = UP', tone: 'bullish' },
        { id: 'mtf2', label: '50% Discount', sublabel: 'Wait for Price "On Sale"', tone: 'liquidity' },
        { id: 'mtf3', label: '5m U-Turn', sublabel: 'Small Chart Re-Aligns Up', tone: 'bullish' },
        { id: 'mtf4', label: '4H Target', sublabel: 'Ride Back to Big High', tone: 'neutral' },
      ],
      walkthroughSteps: [
        'Open your Higher Timeframe (4-Hour) first to confirm overall trend direction and mark the big target.',
        'Draw your 50% halfway line and highlight one fresh Demand or Order Block zone on sale in the bottom half.',
        'Set an alert and open your 5-Minute chart ONLY when price touches that zone — enter once the 5-Minute makes a clear U-turn back with the 4-Hour trend.',
      ],
    },
    chartScenarioIds: ['mtf-htf-ltf'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Zoom Out for the Highway Map, Zoom In Only for the Turn',
        summary:
          'Multi-timeframe trading works just like GPS: the zoomed-out map shows which highway leads to your city (4-Hour direction), while street view shows the exact safe moment to merge onto the road (5-Minute entry).',
        steps: [
          'Open the 4-Hour or 1-Hour chart first so you know whether buyers or sellers control the highway.',
          'Mark one clean zone where you want price to pull back "on sale" and wait.',
          'Open the 5-Minute chart only when price reaches your zone so you can enter cleanly with a small stop.',
        ],
        keyTakeaway:
          'Never drive by staring only at street view — always check the highway map first.',
        practiceSafeHint:
          'Check whether the small-chart move is riding WITH the big-chart trend or simply pulling back into a big-chart floor.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '5-Minute Morning Top-Down Routine',
        summary:
          'Run these three simple steps before placing a single order each day.',
        steps: [
          'Step 1 (4-Hour / Daily): Mark trend direction (Up or Down) and the big target price.',
          'Step 2 (1-Hour / 15-Minute): Mark one fresh buy zone below the 50% line (in an uptrend) or sell zone above 50% (in a downtrend) and set an alert.',
          'Step 3 (5-Minute): Once alerted inside your zone, wait for one clean U-turn candle close (Change of Character) back in the big-picture direction.',
        ],
        keyTakeaway:
          'When all three charts point the same way, trades feel calm and effortless.',
        practiceSafeHint:
          'Verify that big-picture direction, waiting zone, and entry trigger all agree.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Turning a $100 → $120 4-Hour Rally Into a Calm 5-Minute Entry',
        summary:
          'After a strong 4-Hour rally from $100 to $120, the 50% halfway line sits at $110. Price pulls back on the 5-Minute chart all the way to a fresh 1-Hour Demand floor at $105–$106.',
        steps: [
          'Instead of panicking at the 5-Minute red candles sliding from $120 to $106, you recognize a healthy pullback on sale.',
          'Inside the $105–$106 floor, the 5-Minute chart sweeps $105 and closes strongly above its last minor peak — a clear U-turn.',
          'Entering at $106 with a $2 stop ($104) while aiming back toward $120 ($14 target) gives a clean 7-to-1 reward-to-risk plan!',
        ],
        keyTakeaway:
          'Let the 5-minute chart tell you when the big-picture pullback has actually finished.',
        practiceSafeHint:
          'Identify which chart defines the overall trend and which chart refines your entry timing.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Surfing With the Ocean Wave Instead of Fighting Small Ripples',
        summary:
          'The 4-Hour trend is the giant ocean swell; 5-minute candles are small surface ripples. Smart surfers paddle WITH the main wave and only use small ripples to time the exact second they stand up on the board.',
        steps: [
          'Always check which way the giant swell is pushing first.',
          'Wait for the surface ripple to line up with the swell before popping up.',
        ],
        keyTakeaway:
          'Ride the giant wave — never try to stop it with a tiny ripple.',
        practiceSafeHint:
          'Check which timeframe carries the larger institutional wave.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Single-Timeframe Tunnel Vision vs. 3-Chart Top-Down Clarity',
        summary:
          'See why beginners staring only at one 5-minute chart feel whipsawed all day.',
        steps: [
          'Tunnel Vision (5-Minute Only): Sells a mini downtrend straight into a massive invisible 4-Hour floor → instant stop-out.',
          'Top-Down Clarity (4H → 1H → 5m): Sees the 4-Hour floor ahead, skips the risky short, waits for the 5-Minute U-turn, and rides the big bounce.',
        ],
        keyTakeaway:
          'Zooming out for 30 seconds prevents slamming head-first into hidden big-picture walls.',
        practiceSafeHint:
          'Always check if a major higher-timeframe floor or ceiling sits directly in front of your entry.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Multi-Timeframe Habits That Cause Confusion',
        summary:
          'Keep your routine simple by avoiding these three traps.',
        steps: [
          'Mistake 1: Checking 8 different timeframes until you find one that says "buy" just because you want to click a trade.',
          'Mistake 2: Fighting a strong 4-Hour uptrend just because two red candles printed on the 5-Minute chart.',
          'Mistake 3: Setting a 5-Minute stop-loss and then forgetting to aim for the bigger 1-Hour or 4-Hour target.',
        ],
        keyTakeaway:
          'Lock in 3 fixed timeframes, respect the biggest one, and keep your chart routine identical every single day.',
        practiceSafeHint:
          'Confirm that you are using a fixed 3-chart hierarchy rather than cherry-picking random timeframes.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-mtf-1',
        lessonSlug: 'multi-timeframe-alignment',
        conceptKey: 'multi-timeframe-alignment',
        scenarioId: 'mtf-htf-ltf',
        prompt:
          'The 4-Hour chart is in a strong uptrend and pulling back into a fresh 1-Hour Demand floor at $105, while the 5-Minute chart is currently stepping downward. What is really happening?',
        options: [
          { id: 'a', label: 'The 4-Hour uptrend is dead — sell aggressively straight into the $105 floor' },
          { id: 'b', label: 'The 5-Minute dip is simply the healthy pullback of the 4-Hour uptrend; wait for a 5-Minute bullish U-turn inside the $105 floor' },
          { id: 'c', label: 'Multi-timeframe analysis breaks whenever two charts point opposite ways' },
          { id: 'd', label: 'Close the 4-Hour chart forever and only trade 1-minute candles' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember how a big-picture pullback looks when you zoom into a 5-minute chart.',
        ],
        postSubmissionRationale:
          'Every healthy higher-timeframe pullback looks like a mini downtrend when zoomed in. Waiting for the 5-Minute chart to hit the 1-Hour floor and turn upward lines both charts up cleanly.',
        commonTrapNote:
          'Selling a 5-Minute dip straight into an untouched 4-Hour or 1-Hour floor is one of the most common beginner mistakes.',
      },
      {
        id: 'pq-mtf-2',
        lessonSlug: 'multi-timeframe-alignment',
        conceptKey: 'multi-timeframe-alignment',
        prompt:
          'In a clean 3-chart stack (4-Hour → 1-Hour → 5-Minute), what is the main job of the biggest chart (4-Hour)?',
        options: [
          { id: 'a', label: 'Setting a tiny 2-second scalp stop-loss' },
          { id: 'b', label: 'Showing overall trend direction and the major big-picture price target' },
          { id: 'c', label: 'Replacing position sizing math' },
          { id: 'd', label: 'Counting every single 1-minute tick' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think of the GPS highway map versus street view.',
        ],
        postSubmissionRationale:
          'The Highest Timeframe sets your big-picture direction and major target, the Middle Timeframe marks your waiting zone, and the Lower Timeframe times your exact entry.',
        commonTrapNote:
          'Trying to judge overall trend from a 5-Minute chart makes you flip from bullish to bearish ten times a day.',
      },
      {
        id: 'pq-mtf-3',
        lessonSlug: 'multi-timeframe-alignment',
        conceptKey: 'multi-timeframe-alignment',
        prompt:
          'Why should beginners stick to 3 fixed timeframes instead of checking 8 or 9 different charts before a trade?',
        options: [
          { id: 'a', label: 'Because charting websites crash if you click more than 3 buttons' },
          { id: 'b', label: 'Because jumping across 9 charts creates contradictory signals, analysis paralysis, and cherry-picking' },
          { id: 'c', label: 'Because candlesticks only exist on three timeframes' },
          { id: 'd', label: 'Because professional traders only ever look at a single chart' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about what happens when you flip across 9 charts hunting for an excuse to click buy.',
        ],
        postSubmissionRationale:
          'Checking too many timeframes floods your brain with conflicting tiny wiggles and tempts you to cherry-pick whichever chart matches your emotional hunch. Three structured charts keep decisions crystal clear.',
        commonTrapNote:
          'Write your 3-chart stack on a sticky note and use those exact same 3 charts every day.',
      },
    ],
  },

  // =========================================================================
  // MODULE 10: Forex Playbook: London & NY Killzones
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000011',
    slug: 'forex-sessions-killzones',
    title: 'Forex Playbook: London & New York Killzones',
    subtitle:
      'Learn why currency markets sleep for hours and then explode during London and New York bank hours — and how to trade the quiet overnight box cleanly.',
    plainEnglishSummary:
      'Forex (short for Foreign Exchange) is simply trading one country’s money against another — like Euros against US Dollars (EUR/USD). Even though Forex stays open 24 hours a day Monday through Friday, big banks do most of their real trading during two busy 3-hour "rush hours" called Killzones: when London opens and when New York opens. Showing up ONLY during one of those rush-hour windows gives you smooth, clean moves instead of boring sideways drift.',
    beginnerFaq: [
      {
        question: 'If Forex is open 24 hours a day, why can I not just trade whenever I feel bored?',
        answer:
          'Think of a shopping mall at 2:00 AM versus Saturday afternoon. During sleepy late-afternoon hours (like 3:00 PM New York time), big European and US banks have finished their main orders, trading fees (spreads) widen, and price drifts lazily sideways — chopping up traders who click buttons out of boredom.',
      },
      {
        question: 'What is a "Killzone" in simple everyday language?',
        answer:
          'A Killzone is simply the 2-to-3-hour rush hour when major global banks unlock their trading desks: London Killzone is 2:00 AM–5:00 AM New York time, and New York Killzone is 7:00 AM–10:00 AM New York time. You only need to pick ONE window that fits your daily schedule!',
      },
      {
        question: 'What is "Power of 3" (Accumulation, Manipulation, Distribution)?',
        answer:
          'It is a simple 3-step daily rhythm: (1) Quiet Box overnight during Asia (Accumulation), (2) a quick FAKE push outside the box when London or New York opens to trigger stops (Manipulation), and (3) the REAL trend move shooting the opposite way (Distribution).',
      },
      {
        question: 'Why shouldn’t I risk 1% on EUR/USD and 1% on GBP/USD at the exact same time?',
        answer:
          'Because both pairs are priced against the US Dollar, they usually move almost like identical twins! On a $10,000 account, risking $100 on EUR/USD AND $100 on GBP/USD at the same time means a single surprise US Dollar spike hits both trades at once for a $200 (2%) loss.',
      },
    ],
    level: 'intermediate',
    marketCategory: 'forex',
    learningStage: 'market_playbooks',
    moduleOrder: 20,
    conceptKey: 'forex-sessions-killzones',
    estimatedMinutes: 18,
    learningObjectives: [
      'Map the three daily Forex sessions in New York time: Asian Quiet Box, London Rush Hour, and New York Rush Hour.',
      'Spot the 3-step Power of 3 cycle (Quiet Box → Fake Move → Real Move) on major pairs like EUR/USD and GBP/USD.',
      'Check the US Dollar Index (DXY) and avoid accidentally doubling your risk across twin USD pairs.',
      'Stay safely out of sudden news spikes during major economic reports like Consumer Price Index (inflation) and Non-Farm Payrolls (jobs).',
    ],
    prerequisites: [
      'Liquidity Sweeps vs. True Breakouts',
      'Multi-Timeframe Analysis (Big-Picture Map to Zoomed-In Entry)',
    ],
    terminology: [
      {
        term: 'Killzone (Bank Rush Hour)',
        shortCode: 'Rush Hour',
        definition:
          'The 2-to-3-hour window when major bank desks flood the currency market with volume: London Open (2:00–5:00 AM New York time) and New York Open (7:00–10:00 AM New York time).',
        example:
          'GBP/USD staying sleepy all night, then making its biggest clean move of the day right at 3:15 AM New York time during London Killzone.',
      },
      {
        term: 'Asian Range (Overnight Box)',
        shortCode: 'Asian Box',
        definition:
          'The tight sideways price range formed overnight (roughly 8:00 PM–12:00 AM New York time) on European and US pairs, whose top and bottom collect waiting stop-losses.',
        example:
          'Drawing one box around EUR/USD’s quiet overnight high (1.0865) and low (1.0840) before London opens.',
      },
      {
        term: 'Power of 3 (Quiet Box → Fake Move → Real Move)',
        shortCode: 'AMD Cycle',
        definition:
          'A classic daily Forex pattern: Accumulation (quiet Asian box) → Manipulation (quick fake push past one side of the box) → Distribution (the real directional move).',
        example:
          'On a bullish day, price dips briefly below the Asian Box bottom at London Open (fake move), then rallies strongly all morning (real move).',
      },
      {
        term: 'US Dollar Index (DXY)',
        shortCode: 'DXY',
        definition:
          'A single scoreboard measuring how strong the US Dollar is against other major currencies. When DXY drops, pairs like EUR/USD and GBP/USD usually rise.',
        example:
          'Seeing DXY hit a ceiling and turn down gives you extra confidence to look for EUR/USD buy setups.',
      },
    ],
    sections: [
      {
        id: 'fx-sec-1',
        heading: 'Time + Price: Why Trading Only During Bank Rush Hours Changes Everything',
        body: 'Because Forex runs 24 hours a day from Sunday evening to Friday afternoon, beginners think they should watch charts all day. In reality, price moves cleanly only when major bank desks in London and New York are open.',
        bulletPoints: [
          'Asian Session (8:00 PM–12:00 AM New York time): Usually quiet and sideways on EUR/USD and GBP/USD — great for drawing your overnight box, poor for chasing big breakouts.',
          'London Killzone (2:00 AM–5:00 AM New York time): European banks open; price frequently pokes past the overnight Asian High or Low and starts the morning trend.',
          'New York Killzone (7:00 AM–10:00 AM New York time): US banks join London (the busiest overlap of the day!) — offering the tightest trading fees and fastest clean follow-through.',
        ],
        keyTakeaway:
          'Pick ONE 3-hour Killzone that fits your life, trade ONLY inside it, and close your charts the rest of the day.',
      },
      {
        id: 'fx-sec-2',
        heading: 'The Overnight Box & Power of 3 Playbook (Quiet → Fake → Real)',
        body: 'On trending days, EUR/USD and GBP/USD repeat a remarkably clear 3-step dance around the overnight Asian Box:',
        bulletPoints: [
          'Step 1 — Quiet Box (Accumulation): Before London or New York opens, draw a clean horizontal line on the highest and lowest price of the overnight Asian session.',
          'Step 2 — Fake Move (Manipulation): If your big-picture 4-Hour trend is UP, watch for London or early New York to dip briefly BELOW the Asian Box bottom — scaring early buyers out and filling big bank buy orders.',
          'Step 3 — Real Move (Distribution): Wait for a 5-minute candle to close cleanly back inside the box and shift upward (Change of Character), then aim for the opposite side of the Asian Box or yesterday’s high.',
        ],
        keyTakeaway:
          'Let the opening fake move happen first — then ride the real move back across the overnight box.',
      },
      {
        id: 'fx-sec-3',
        heading: 'Staying Safe Around Twin Pairs & Big Economic News',
        body: 'Two simple safety habits immediately protect a beginner’s $10,000 Forex account from nasty surprises:',
        bulletPoints: [
          'Check the US Dollar Index (DXY) & Avoid Twin Risk: EUR/USD and GBP/USD move almost in lockstep. Never risk 1% ($100) on BOTH at once — pick the cleaner chart (or split $50 each) so one Dollar move never costs you 2% ($200).',
          'Step Aside for Red-Folder News: Check a free economic calendar every morning for major US news like Consumer Price Index (inflation report), Non-Farm Payrolls (monthly jobs report), or Federal Reserve interest-rate announcements.',
          'Wait 10–15 Minutes After News: Right at 8:30 AM New York time on major news days, broker spreads can widen wildly and slip right past tight stops. Watch hands-off and trade calmly once spreads settle.',
        ],
        keyTakeaway:
          'Focus on 1 or 2 liquid pairs, never double up on twin USD trades, and never gamble right into an 8:30 AM major news spike.',
      },
    ],
    diagramConfig: {
      kind: 'market_sessions',
      title: 'Forex 24-Hour Clock: Asian Quiet Box → London / NY Rush Hour Sweep',
      subtitle: 'Mapping the three global sessions and Power of 3 (Quiet → Fake → Real) on one timeline',
      caption:
        'Asian session builds a tight overnight box; London or New York Killzone sweeps stops just outside one edge (Manipulation) before delivering a smooth directional move to the opposite edge.',
      legend: [
        { label: 'Asian Quiet Box (Accumulation)', colorToken: '#94a3b8' },
        { label: 'London / NY Fake Sweep (Manipulation)', colorToken: '#f59e0b' },
        { label: 'Real Rush-Hour Trend (Distribution)', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'fx1', label: 'Asian Box', sublabel: '8 PM–12 AM NY Quiet Range', tone: 'neutral' },
        { id: 'fx2', label: 'London Sweep', sublabel: '2 AM–5 AM NY Stop Grab', tone: 'liquidity' },
        { id: 'fx3', label: 'NY Overlap', sublabel: '7 AM–10 AM NY Peak Volume', tone: 'bullish' },
        { id: 'fx4', label: 'Dead Zone', sublabel: 'Afternoon Chop — Stay Out', tone: 'bearish' },
      ],
      walkthroughSteps: [
        'Box the quiet overnight Asian High and Asian Low before London Killzone opens.',
        'Check your 4-Hour trend and US Dollar Index (DXY) direction so you know which side is likely the fake move.',
        'Wait for a Killzone sweep outside the box + a 5-minute candle close back inside before entering toward the opposite side.',
      ],
    },
    chartScenarioIds: ['fx-london-sweep'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Only Go Fishing When the Big Bank Boats Are Out',
        summary:
          'Even though Forex stays open 24 hours, big banks do most of their heavy buying and selling during London Open (2–5 AM New York time) and New York Open (7–10 AM New York time). Trading inside one of those windows gives you clean moves and saves you from boring sideways traps.',
        steps: [
          'Draw a box around the quiet overnight Asian High and Asian Low.',
          'Wait for London or New York rush hour to poke outside one side and snap back inside.',
          'Aim for the opposite side of the box and close your laptop once rush hour ends.',
        ],
        keyTakeaway:
          'Pick ONE rush-hour Killzone that fits your schedule and ignore the chart outside that window.',
        practiceSafeHint:
          'Check whether the sweep happened during active London or New York bank hours.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Step Pre-Session Forex Checklist',
        summary:
          'Run this calm 5-minute checklist before London or New York Killzone begins.',
        steps: [
          'Step 1: Check the economic calendar for big red-folder news (inflation, jobs, central bank rates).',
          'Step 2: Draw the overnight Asian Box High/Low and Yesterday’s High/Low.',
          'Step 3: Glance at the US Dollar Index (DXY) to confirm whether the Dollar looks strong or weak.',
          'Step 4: Wait patiently inside the Killzone for a clear stop-grab sweep + 5-minute U-turn close.',
        ],
        keyTakeaway:
          'Time + Overnight Box + Confirmed U-Turn turns 24-hour noise into a calm 2-hour routine.',
        practiceSafeHint:
          'Verify both active session timing and a clean candle close back inside the overnight range.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'London Killzone Fake Dip Under Asian Low → Clean Morning Rally',
        summary:
          'Picture EUR/USD drifting quietly overnight between 1.0840 and 1.0865. Right after London opens at 3:00 AM New York time, price dips sharply to 1.0828 below the Asian Low, then snaps right back above 1.0840 with a tall green 5-minute candle.',
        steps: [
          'The brief dip to 1.0828 is the Manipulation (fake move) grabbing overnight stops.',
          'Closing back inside above 1.0840 + shifting upward confirms buyers took over.',
          'With a $100 risk (1% on a $10,000 account) and stop below 1.0825, riding the Distribution move across 1.0865 to 1.0890 nets $300 (+3R)!',
        ],
        keyTakeaway:
          'Waiting for the fake dip to finish lets you ride the real rush-hour wave with calm risk.',
        practiceSafeHint:
          'Trace how the sweep below the Asian Low reversed cleanly into morning upward momentum.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Rush-Hour Express Trains vs. Empty Midnight Stations',
        summary:
          'Trying to catch a smooth Forex trend at 4:00 PM New York time is like waiting for an express train at an empty station at 2:00 AM. London and New York Killzones are rush hour — trains are fast, spreads are cheap, and direction is clear.',
        steps: [
          'Overnight Asia fills the platforms with waiting passengers (resting stops above and below the box).',
          'London and New York rush hours launch the express directional move.',
        ],
        keyTakeaway:
          'Show up during rush hour and go live your life when the station empties out.',
        practiceSafeHint:
          'Match your trading hours to peak London and New York institutional volume.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Killzone Rush Hour vs. Sleepy Afternoon Overtrading',
        summary:
          'Same exact chart strategy — totally different results depending on the clock.',
        steps: [
          'Killzone Window (London / NY Open): Tiny trading fees (tight spreads), clear overnight box sweeps, fast follow-through to full profit targets.',
          'Sleepy Dead Zone (Late NY Afternoon): Wider trading fees, slow fake breakouts that stall immediately, exhausting sideways chop.',
        ],
        keyTakeaway:
          'Simply refusing to trade outside your Killzone immediately eliminates dozens of avoidable losses.',
        practiceSafeHint:
          'Ask whether real bank volume is active right now to carry price to your target.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Classic Beginner Forex Traps',
        summary:
          'Protect your account from day one by cutting these three habits.',
        steps: [
          'Mistake 1: Risking 1% ($100) long on EUR/USD AND 1% ($100) long on GBP/USD at the same time — secretly doubling your Dollar risk to $200.',
          'Mistake 2: Holding a tight stop straight through an 8:30 AM inflation (CPI) or jobs (NFP) announcement where spreads jump wildly.',
          'Mistake 3: Forcing random trades late in the afternoon because you missed the morning Killzone.',
        ],
        keyTakeaway:
          'Respect USD correlation, step aside for major news spikes, and trade strictly inside one Killzone.',
        practiceSafeHint:
          'Check for twin currency exposure and major news times before placing any order.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-fx-1',
        lessonSlug: 'forex-sessions-killzones',
        conceptKey: 'forex-sessions-killzones',
        scenarioId: 'fx-london-sweep',
        prompt:
          'In the Power of 3 Forex pattern on a day when your big-picture trend is UP, what happens during Step 2 (Manipulation)?',
        options: [
          { id: 'a', label: 'Price dips briefly below the overnight Asian Box low to grab waiting stops before snapping back up into the real rally' },
          { id: 'b', label: 'The currency market freezes flat for 12 hours' },
          { id: 'c', label: 'Trading fees drop to zero during major news reports' },
          { id: 'd', label: 'Price shoots straight up without ever dipping or pulling back' },
        ],
        correctOptionId: 'a',
        hints: [
          'Remember: Quiet Box → Fake Move in the opposite direction → Real Move.',
        ],
        postSubmissionRationale:
          'On a bullish day, Manipulation (the fake move) dips briefly under the Asian Low to clear stops and fill institutional buy orders before Distribution drives price higher.',
        commonTrapNote:
          'Panic-selling the first London dip below the Asian Low traps you directly inside the fake move.',
      },
      {
        id: 'pq-fx-2',
        lessonSlug: 'forex-sessions-killzones',
        conceptKey: 'forex-sessions-killzones',
        prompt:
          'On a $10,000 account, you risk 1% ($100) buying EUR/USD and at the exact same moment risk 1% ($100) buying GBP/USD. What is the hidden danger?',
        options: [
          { id: 'a', label: 'No danger at all — those two currencies have nothing in common' },
          { id: 'b', label: 'Both pairs move almost like twins against the US Dollar, so one USD spike can stop out BOTH trades for a $200 (2%) loss' },
          { id: 'c', label: 'GBP/USD cannot move during New York hours' },
          { id: 'd', label: 'Both trades automatically cancel out your risk to $0' },
        ],
        correctOptionId: 'b',
        hints: [
          'Look at the second currency in both EUR/USD and GBP/USD.',
        ],
        postSubmissionRationale:
          'Because EUR/USD and GBP/USD are both quoted against the US Dollar, they are heavily correlated. Putting full 1% risk on both simultaneously exposes you to ~2% loss on a single US Dollar move.',
        commonTrapNote:
          'Pick the single cleanest pair — or split your 1% risk into 0.5% ($50) each.',
      },
      {
        id: 'pq-fx-3',
        lessonSlug: 'forex-sessions-killzones',
        conceptKey: 'forex-sessions-killzones',
        prompt:
          'Why do experienced Forex traders focus on London Killzone (2–5 AM New York time) and New York Killzone (7–10 AM New York time)?',
        options: [
          { id: 'a', label: 'Because brokers shut off price charts during all other hours' },
          { id: 'b', label: 'Because peak bank volume delivers tight spreads, clear sweeps, and real follow-through instead of sleepy sideways chop' },
          { id: 'c', label: 'Because candles only print wicks during Killzones' },
          { id: 'd', label: 'Because losing trades are impossible during London and New York hours' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare trading during bank rush hour against sleepy late-afternoon hours.',
        ],
        postSubmissionRationale:
          'Active institutional bank order flow peaks during London and New York opens, producing lower spreads and clean directional waves that actually reach targets.',
        commonTrapNote:
          'Trading off-session dead zones drains patience and exposes you to wider spreads.',
      },
    ],
  },

  // =========================================================================
  // MODULE 11: Indices Playbook: NAS100 & US30 New York Open
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000012',
    slug: 'indices-ny-open-playbook',
    title: 'Indices Playbook: NAS100 & US30 New York Open',
    subtitle:
      'Survive the explosive 9:30 AM New York stock market bell on NAS100 and US30 by waiting 5 minutes for the dust to settle and sizing properly for fast swings.',
    plainEnglishSummary:
      'A stock market index is simply a giant basket tracking many top companies at once — NAS100 tracks 100 major US tech companies, and US30 tracks 30 giant American corporations. Every weekday at 9:30 AM New York time, the US stock market bell rings and billions of dollars hit the market at once, making NAS100 and US30 jump wildly for a few minutes. Waiting 5 to 15 minutes for that opening stampede to finish — and using smaller trade sizes — turns morning chaos into clean, repeatable trades.',
    beginnerFaq: [
      {
        question: 'Wait — what actually ARE NAS100, US30, and SPX500?',
        answer:
          'They are stock market scoreboards (indices)! Instead of picking one single company, NAS100 tracks the 100 largest non-financial companies on the NASDAQ (heavy in tech like Apple, Microsoft, Nvidia), SPX500 tracks 500 large US companies, and US30 tracks 30 iconic blue-chip US companies.',
      },
      {
        question: 'Why does price go crazy at exactly 9:30 AM New York time?',
        answer:
          'At 9:30 AM sharp, the New York Stock Exchange and NASDAQ open for live trading. Millions of overnight buy and sell orders all execute in the exact same first 60 seconds, causing wild up-and-down spikes that knock out impatient traders on BOTH sides.',
      },
      {
        question: 'What is "SMT Divergence" in simple English?',
        answer:
          'SMT stands for Smart Money Technique. Because NAS100 and SPX500/US30 are siblings tracking the same US economy, they usually hit new highs together. If NAS100 spikes to a brand-new high at 9:35 AM while SPX500 FAILS to break its high, that crack between siblings warns that big buyers are quietly stepping out!',
      },
      {
        question: 'Why do beginners blow accounts so fast on NAS100?',
        answer:
          'Because NAS100 moves much faster and wider than quiet currency pairs! A 30-point swing happens in minutes. If you do not shrink your contract/lot size to match wider stops, one normal 5-minute wiggle can wipe out 5% of your account instead of 1%.',
      },
    ],
    level: 'intermediate',
    marketCategory: 'indices',
    learningStage: 'market_playbooks',
    moduleOrder: 26,
    conceptKey: 'indices-ny-open-playbook',
    estimatedMinutes: 19,
    learningObjectives: [
      'Stay hands-off during the wild 9:30–9:35 AM New York opening bell stampede and wait for a clean 5-minute candle close.',
      'Mark Pre-Market High and Pre-Market Low (4:00 AM–9:30 AM extremes) as primary morning liquidity targets.',
      'Spot Smart Money Technique (SMT) Divergence when sibling US indices stop moving in lockstep at a major high or low.',
      'Shrink contract/lot size mathematically for wider index stops so your $10,000 account STILL risks strictly 1% ($100).',
    ],
    prerequisites: [
      'Equal Highs & Equal Lows (Resting Stop Clusters)',
      'Liquidity Sweeps vs. True Breakouts',
    ],
    terminology: [
      {
        term: '9:30 AM New York Opening Bell',
        shortCode: '9:30 AM NY',
        definition:
          'The exact minute US stock exchanges open for the day, releasing massive institutional volume that creates rapid stop-grabs and morning trends.',
        example:
          'NAS100 jumping 35 points above its morning high at 9:31 AM, then reversing 100 points downward by 10:00 AM.',
      },
      {
        term: 'Pre-Market High & Low',
        shortCode: 'PMH / PML',
        definition:
          'The highest and lowest prices printed between 4:00 AM and 9:30 AM New York time before the cash bell rings — prime magnets right after 9:30 AM.',
        example:
          'Drawing two clean lines on NAS100’s Pre-Market High and Pre-Market Low at 9:15 AM before the bell.',
      },
      {
        term: 'Smart Money Technique (SMT) Divergence',
        shortCode: 'SMT Crack',
        definition:
          'A warning clue when two sibling US indices disagree at a turning point — for example, NAS100 pokes to a new high while SPX500 or US30 makes a lower peak.',
        example:
          'At 9:35 AM, NAS100 pokes above its Pre-Market High while US30 fails to reach its own Pre-Market High — warning of a reversal down.',
      },
      {
        term: 'Average True Range (Candle Speed)',
        shortCode: 'ATR',
        definition:
          'The average height (from low to high) of recent candles, telling you how wide price is swinging today so you set realistic stops and safe trade size.',
        example:
          'If 5-minute NAS100 candles are 25 points tall right now, forcing a tiny 8-point stop guarantees an instant random stop-out.',
      },
    ],
    sections: [
      {
        id: 'idx-sec-1',
        heading: 'Surviving the 9:30 AM Opening Bell (Sit on Your Hands for 5 Minutes!)',
        body: 'Imagine Black Friday doors flying open at 9:30 AM sharp — everyone pushes blindly in the doorway for three minutes. Clicking buy or sell at 9:30:05 AM on NAS100 or US30 is pure coin-flip gambling. Pros wait calmly for the doorway stampede to clear.',
        bulletPoints: [
          '9:15 AM Prep: Mark Pre-Market High (PMH), Pre-Market Low (PML), and Yesterday’s High/Low so you know exactly where resting stops sit.',
          '9:30–9:35 AM Hands Off: Watch price spike toward Pre-Market High or Low WITHOUT clicking any button. Let the opening stop-run finish!',
          '9:35–10:30 AM Execution Window: Enter ONLY after a 5-minute candle closes cleanly — confirming either a sweep reversal back inside OR a solid full-body breakout holding strong.',
        ],
        keyTakeaway:
          'Waiting just 5 to 15 minutes after 9:30 AM New York time saves you from 80% of painful index whipsaws.',
      },
      {
        id: 'idx-sec-2',
        heading: 'Smart Money Technique (SMT) Divergence: Catching Cracks Between Sibling Indices',
        body: 'Keep NAS100 and SPX500 (or US30) side by side on your screen at 9:30 AM. Because they are closely related baskets of US stocks, watching when they STOP agreeing gives you a huge edge:',
        bulletPoints: [
          'Bearish Crack (Reversal Down Warning): NAS100 spikes to a fresh Higher High above Pre-Market High, while SPX500 or US30 stays weaker and prints a Lower High.',
          'Bullish Crack (Reversal Up Warning): US30 dips to a Lower Low under Pre-Market Low, while NAS100 refuses to drop as far and holds a Higher Low.',
          'Always Wait for Confirmation: Never enter blindly on divergence alone — wait for a 5-minute U-turn candle close (Change of Character) to prove the reversal started.',
        ],
        keyTakeaway:
          'When sibling US indices crack apart at a major high or low, big institutions are quietly shifting sides.',
      },
      {
        id: 'idx-sec-3',
        heading: 'Respecting Index Speed, Sizing Down & Skipping Lunch Chop',
        body: 'Beginners love NAS100 because it moves fast — until that exact same speed blows up their account. Here is how to keep risk tiny and boring:',
        bulletPoints: [
          'Real Dollar Math ($10,000 Account, 1% = $100 Max Risk): Suppose on a quiet day your stop is 10 points wide, so you trade $10 per point (10 × $10 = $100 risk). If today’s 9:30 AM candles are wild and your safe stop needs to be 40 points wide, simply cut your size to $2.50 per point (40 × $2.50 = STILL exactly $100 risk!).',
          'Never Shrink a Safe Stop to Trade Bigger: Putting an arbitrary 8-point stop inside 25-point candles is donating money to normal market noise.',
          'Close Charts Before Lunch (11:30 AM New York time): Between 12:00 PM and 1:30 PM New York time (lunch hour), volume drops and NAS100 turns into choppy sideways noise that eats morning profits.',
        ],
        keyTakeaway:
          'Wider index swings require SMALLER position sizes — never tighter stops — and a strict 11:30 AM morning cutoff.',
      },
    ],
    diagramConfig: {
      kind: 'market_sessions',
      title: 'US Indices Morning Timeline: Pre-Market → 9:30 AM Stampede → 10:00 AM Move',
      subtitle: 'Visualizing Pre-Market High/Low sweeps, 9:30 AM volatility, and the 12:00 PM lunch chop zone',
      caption:
        'Mark Pre-Market High/Low before 9:30 AM, stay hands-off during the opening 5-minute spike, trade the confirmed 9:35–11:00 AM trend or reversal, and step away during NY lunch chop.',
      legend: [
        { label: 'Pre-Market Range (4:00–9:30 AM NY)', colorToken: '#94a3b8' },
        { label: '9:30 AM Opening Sweep Spike', colorToken: '#f59e0b' },
        { label: '9:35–11:00 AM Real Morning Move', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'idx1', label: 'PMH / PML', sublabel: 'Pre-Market Stop Targets', tone: 'liquidity' },
        { id: 'idx2', label: '9:30 Bell', sublabel: 'Hands-Off Opening Stampede', tone: 'bearish' },
        { id: 'idx3', label: '9:40–10:30', sublabel: 'Prime Execution + SMT Check', tone: 'bullish' },
        { id: 'idx4', label: '12 PM Lunch', sublabel: 'Low-Volume Chop — Stop', tone: 'neutral' },
      ],
      walkthroughSteps: [
        'Draw Pre-Market High, Pre-Market Low, and Yesterday’s High/Low by 9:15 AM New York time.',
        'Keep hands off the mouse from 9:30–9:35 AM while opening orders sweep obvious stops.',
        'Check sibling indices (NAS100 vs. SPX500/US30) for SMT Divergence or unified breakout strength, then size down to keep risk strictly at 1%.',
      ],
    },
    chartScenarioIds: ['idx-nas100-ny-open'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Let the 9:30 AM Opening Bell Stampede Clear First',
        summary:
          'When the New York stock market bell rings at 9:30 AM, NAS100 and US30 bounce violently in both directions for a few minutes. Simply waiting 5 to 15 minutes lets the fake spike finish so you can step calmly onto the real morning wave.',
        steps: [
          'Mark Pre-Market High and Pre-Market Low before 9:30 AM.',
          'Do NOT click buy or sell during the chaotic first 3–5 minutes.',
          'Cut your trade size down so a wider, safe stop-loss still risks only 1% ($100 on a $10,000 account).',
        ],
        keyTakeaway:
          'Ten minutes of patience at 9:30 AM protects you from 80% of painful index whipsaws.',
        practiceSafeHint:
          'Check whether the 5-minute candle closed back inside the pre-market level or broke cleanly outside.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '9:15–11:30 AM New York Indices Routine',
        summary:
          'Follow this calm four-step morning clock for NAS100 and US30.',
        steps: [
          '9:15 AM: Mark Pre-Market High/Low and Yesterday’s High/Low on both NAS100 and SPX500/US30.',
          '9:30–9:35 AM: Hands off — watch which boundary gets swept first and check if sibling indices disagree (SMT).',
          '9:40–10:45 AM: Enter after a clean 5-minute close confirms a sweep reversal or accepted trend breakout.',
          '11:30 AM: Wrap up before sleepy New York lunch chop arrives at noon.',
        ],
        keyTakeaway:
          'One clean 9:45 AM setup earns more than ten frantic 9:31 AM guesses.',
        practiceSafeHint:
          'Observe both candle-close confirmation and sibling index alignment.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'NAS100 9:35 AM Pre-Market High Sweep & Reversal',
        summary:
          'Picture NAS100 clustering right under its 18,520 Pre-Market High. At 9:31 AM, a fast spike blasts to 18,546 — while US30 fails to break its own Pre-Market High (Bearish SMT crack) — and the 5-minute candle snaps closed back down at 18,511.',
        steps: [
          'Waiting until 9:35 AM saved you from getting trapped buying the 18,546 fake spike.',
          'Bearish SMT Divergence + closing back below 18,520 confirms sellers absorbed the opening rush.',
          'A clean short entry with a 35-point structural stop sized to exactly $100 risk rides smoothly down 100+ points (+3R = $300)!',
        ],
        keyTakeaway:
          'Waiting for the first 5-minute close after 9:30 AM turns opening chaos into clean clarity.',
        practiceSafeHint:
          'Compare the temporary opening spike wick against the finished 5-minute closing price.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Stepping Aside While Black Friday Store Doors Burst Open',
        summary:
          'At 9:30 AM New York time, store doors burst open and people shove wildly in the entrance for three minutes. Calm shoppers take two steps back, watch the doorway clear, and walk straight to the aisle they actually want.',
        steps: [
          'The doorway shoving match is the 9:30–9:35 AM stop-grab spike.',
          'Once the doorway clears, real institutional direction stands out clearly.',
        ],
        keyTakeaway:
          'Never jump into the middle of the 9:30 AM doorway before a candle actually closes.',
        practiceSafeHint:
          'Let the first volatility burst settle into confirmed structure.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Opening Sweep Reversal Day vs. Unstoppable Trend Day',
        summary:
          'Knowing when NOT to sell against a soaring market protects your account.',
        steps: [
          'Sweep Reversal Day: Spike above Pre-Market High + sibling index fails to break (SMT) + 5-minute candle snaps closed back below the level.',
          'Trend Day: Full solid green 5-minute candles closing above Pre-Market High on ALL three indices (NAS100, SPX500, US30) together — do NOT try to short it!',
        ],
        keyTakeaway:
          'When all three US indices break higher together with full bodies, respect the trend.',
        practiceSafeHint:
          'Check whether sibling indices show a crack (divergence) or unified full-body strength.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Account-Killer Mistakes on NAS100 & US30',
        summary:
          'Fast-moving indices punish sloppy risk habits immediately.',
        steps: [
          'Mistake 1: Using a giant lot size meant for slow markets on fast NAS100 candles.',
          'Mistake 2: Clicking market buy/sell at 9:30:10 AM before a single candle closes.',
          'Mistake 3: Continuing to trade during choppy New York lunch (12:00–1:30 PM) and giving back morning gains.',
        ],
        keyTakeaway:
          'Use smaller size for wider stops, wait past 9:35 AM, and stop before lunch chop.',
        practiceSafeHint:
          'Match position size to actual candle width so your dollar risk never balloons.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-idx-1',
        lessonSlug: 'indices-ny-open-playbook',
        conceptKey: 'indices-ny-open-playbook',
        scenarioId: 'idx-nas100-ny-open',
        prompt:
          'At 9:35 AM New York time, NAS100 spikes above its Pre-Market High, while its siblings SPX500 and US30 fail to break their Pre-Market Highs. What warning signal just appeared?',
        options: [
          { id: 'a', label: 'Bearish Smart Money Technique (SMT) Divergence — a crack between sibling indices warning of a possible reversal down' },
          { id: 'b', label: 'Guaranteed non-stop rally across every US stock all day' },
          { id: 'c', label: 'A charting bug that means you must buy immediately' },
          { id: 'd', label: 'Proof that NAS100 can never pull back below its Pre-Market High' },
        ],
        correctOptionId: 'a',
        hints: [
          'Remember what it means when tightly linked sibling indices stop agreeing at a key high.',
        ],
        postSubmissionRationale:
          'When NAS100 pokes to a higher high while SPX500/US30 print a lower high, Bearish SMT Divergence warns that institutional buying is not unified — watch for a confirmed close back inside.',
        commonTrapNote:
          'Still wait for a confirmed 5-minute candle close rather than selling blindly on divergence alone.',
      },
      {
        id: 'pq-idx-2',
        lessonSlug: 'indices-ny-open-playbook',
        conceptKey: 'indices-ny-open-playbook',
        prompt:
          'On a $10,000 account (max 1% = $100 risk), fast 5-minute NAS100 candles are 25 points tall and your safe structural stop needs to be 40 points wide. What should you do?',
        options: [
          { id: 'a', label: 'Force a tight 8-point stop anyway so you can trade huge contracts' },
          { id: 'b', label: 'Keep the safe 40-point stop and shrink your trade size to $2.50 per point so your total risk stays strictly $100 (1%)' },
          { id: 'c', label: 'Delete your stop-loss because indices always bounce back' },
          { id: 'd', label: 'Double your trade size to recover the wider stop faster' },
        ],
        correctOptionId: 'b',
        hints: [
          '40 points × $2.50 per point = $100. Should you shrink a safe stop or shrink your position size?',
        ],
        postSubmissionRationale:
          'Shrinking position size mathematically to match the 40-point stop keeps your dollar risk capped at $100 (1%) while giving your trade room to breathe through normal index volatility.',
        commonTrapNote:
          'Squeezing a tiny 8-point stop onto volatile NAS100 candles gets hit by ordinary 15-second wiggles.',
      },
      {
        id: 'pq-idx-3',
        lessonSlug: 'indices-ny-open-playbook',
        conceptKey: 'indices-ny-open-playbook',
        prompt:
          'Why do disciplined US index traders usually stop trading between 12:00 PM and 1:30 PM New York time?',
        options: [
          { id: 'a', label: 'Because US stock exchanges shut down for lunch' },
          { id: 'b', label: 'Because institutional volume drops during New York lunch, creating choppy fake moves that give back morning profits' },
          { id: 'c', label: 'Because indices can only move upward during noon' },
          { id: 'd', label: 'Because price candles freeze at lunchtime' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how active big Wall Street desks are during New York midday lunch.',
        ],
        postSubmissionRationale:
          'During New York lunch hours, institutional volume thins out and price often chops back and forth aimlessly — making it the easiest time to hand back profits earned between 9:35 and 11:30 AM.',
        commonTrapNote:
          'Knowing when to close your platform is just as profitable as knowing when to enter.',
      },
    ],
  },

  // =========================================================================
  // MODULE 12: Crypto Playbook: 24/7 Volatility, BTC Dominance & Funding
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000013',
    slug: 'crypto-247-liquidity-playbook',
    title: 'Crypto Playbook: 24/7 Volatility, Bitcoin Dominance & Funding',
    subtitle:
      'Navigate 24/7 crypto swings safely by watching Bitcoin’s lead, spotting crowded leverage via Funding Rates, and avoiding weekend fakeouts.',
    plainEnglishSummary:
      'Crypto markets trade 24 hours a day, 7 days a week — including Saturdays and Sundays — and move much faster than stocks or currencies. Almost every smaller coin (altcoin) follows Bitcoin’s lead, and crypto exchanges show a special clue called the Funding Rate that warns you when too many traders borrowed risky leverage on the exact same side of a trade. Keeping leverage low, watching Bitcoin first, and treating thin weekend breakouts with caution protects your money from sudden flash-crash wicks.',
    beginnerFaq: [
      {
        question: 'What is "Bitcoin Dominance" (BTC.D) in plain English?',
        answer:
          'Imagine the entire crypto market is a giant pizza. Bitcoin Dominance is simply Bitcoin’s percentage slice of that pizza (for example, 55%). When Bitcoin rallies AND its pizza slice grows bigger, money is flowing into Bitcoin first — so smaller altcoins often sit sluggish until Bitcoin calms down.',
      },
      {
        question: 'What is a "Perpetual Funding Rate" and why should a beginner care?',
        answer:
          'On crypto futures exchanges, when way too many people bet UP with borrowed money, buyers have to pay a small periodic fee (positive Funding Rate) to sellers every 8 hours. Extremely high positive funding right under a ceiling is like a crowded boat leaning way too far to one side — one small wave can trigger a sudden crash (a liquidation flush)!',
      },
      {
        question: 'What is a "Liquidation Cascade" (and how do I avoid getting liquidated)?',
        answer:
          'If someone puts $1,000 down with 20x borrowed leverage (controlling a $20,000 position), just a tiny 5% drop wipes their entire $1,000 to zero — the exchange forcibly closes their trade (liquidation). When thousands of over-leveraged traders get force-closed together, price crashes violently in seconds. Solution: ALWAYS use a real stop-loss risking just 1% ($100 on a $10,000 account) — never let liquidation be your stop!',
      },
      {
        question: 'Why are Saturday and Sunday crypto breakouts so tricky?',
        answer:
          'Big banks, Wall Street funds, and Bitcoin ETFs are closed on weekends. With fewer big players in the market, price is easier to push temporarily past a high or low on Sunday night — only to snap completely back inside on Monday morning when real volume returns.',
      },
    ],
    level: 'intermediate',
    marketCategory: 'crypto',
    learningStage: 'market_playbooks',
    moduleOrder: 17,
    conceptKey: 'crypto-247-liquidity-playbook',
    estimatedMinutes: 20,
    learningObjectives: [
      'Read Bitcoin (BTC) and Bitcoin Dominance (BTC.D) together to see whether money favors Bitcoin or smaller altcoins.',
      'Use Perpetual Funding Rates to spot overcrowded leveraged bets before sudden liquidation flushes hit.',
      'Handle 24/7 weekend thin-volume traps without getting caught in Sunday fakeouts.',
      'Size every crypto trade by a fixed 1% stop-loss ($100 on a $10,000 account) instead of reckless 20x–50x leverage gambling.',
    ],
    prerequisites: [
      'Understanding Market Liquidity (Buy-Side & Sell-Side)',
      'Liquidity Sweeps vs. True Breakouts',
    ],
    terminology: [
      {
        term: 'Bitcoin Dominance (Bitcoin’s Slice of the Pie)',
        shortCode: 'BTC.D',
        definition:
          'Bitcoin’s percentage share of all money in crypto — showing whether investors are piling into Bitcoin or rotating out into smaller altcoins.',
        example:
          'Bitcoin rises while Bitcoin Dominance climbs from 52% to 56% → money is concentrating in Bitcoin, so trade Bitcoin rather than chasing slow altcoins.',
      },
      {
        term: 'Funding Rate (Crowded-Trade Meter)',
        shortCode: 'Funding',
        definition:
          'A small fee paid every 8 hours between crypto futures buyers and sellers. Very high positive funding warns that way too many traders borrowed money betting UP.',
        example:
          'Funding spiking sharply positive while Bitcoin stalls under a $65,000 ceiling warns of a sudden downward flush.',
      },
      {
        term: 'Liquidation Cascade (Domino Wipeout)',
        shortCode: 'Flush',
        definition:
          'When a quick drop forces thousands of over-leveraged traders out of their positions at once, creating a giant sudden wick that clears stops in seconds.',
        example:
          'A 4% flash drop wiping out 20x leveraged buyers before Bitcoin bounces right back up minutes later.',
      },
      {
        term: 'Weekend Thin Liquidity',
        shortCode: 'Weekend Trap',
        definition:
          'Lighter trading volume on Saturdays and Sundays while big funds and Bitcoin ETFs are closed, making sudden fake breakouts much more common.',
        example:
          'A Sunday evening spike above $65,000 that traps late buyers and drops straight back below $64,500 on Monday morning.',
      },
    ],
    sections: [
      {
        id: 'cry-sec-1',
        heading: 'Bitcoin & Bitcoin Dominance: Follow Where the Money Flows First',
        body: 'Trading a small altcoin without checking Bitcoin first is like sailing a small rowboat without checking the ocean tide. Bitcoin moves the entire crypto market, and Bitcoin Dominance (BTC.D) shows where cash is going:',
        bulletPoints: [
          'Bitcoin UP + Bitcoin Dominance UP: Big money is pouring straight into Bitcoin first — focus on Bitcoin instead of fighting slow altcoins.',
          'Bitcoin Steady/Up + Bitcoin Dominance DOWN: Money is rotating out of Bitcoin into smaller coins — the healthiest environment for clean altcoin setups.',
          'Bitcoin Dropping Hard: Almost every altcoin drops even faster — NEVER buy "cheap" altcoin dips while Bitcoin is breaking floors downward!',
        ],
        keyTakeaway:
          'Always check Bitcoin’s chart and Bitcoin Dominance before touching any smaller cryptocurrency.',
      },
      {
        id: 'cry-sec-2',
        heading: 'Funding Rates & Liquidation Flushes: Don’t Jump on a Crowded Boat',
        body: 'Crypto offers a super useful transparency tool that stock and Forex traders do not have: Perpetual Futures Funding Rates. Think of Funding Rate as a crowded-boat alarm:',
        bulletPoints: [
          'Overcrowded Buyers (Very High Positive Funding): Everyone is using borrowed money betting price will soar right under a ceiling. One quick dip forces them all out at once (a Liquidation Cascade flush).',
          'Overcrowded Sellers (Deep Negative Funding): Everyone is aggressively betting down right at a major floor — setting up a violent bounce upward (Short Squeeze).',
          'Healthiest Breakouts: Real long-lasting crypto rallies happen when regular cash (spot) buyers push price up while Funding stays calm and neutral.',
        ],
        keyTakeaway:
          'Extreme positive funding right beneath resistance is a flashing yellow caution light — do NOT chase late buys!',
      },
      {
        id: 'cry-sec-3',
        heading: 'Surviving 24/7 Markets, Weekends & Leverage Without Blowing Up',
        body: 'Crypto never rings a closing bell, which tempts beginners into high leverage and sleep-deprived midnight trading. Three simple rules keep you safe:',
        bulletPoints: [
          'Never Treat Exchange Leverage as Risk: Whether an exchange offers 5x or 50x leverage, your risk is set strictly by your stop-loss! On a $10,000 account, risking 1% ($100) with a 2% stop distance means a $5,000 position (0.5x account size — zero liquidation danger!).',
          'Distrust Weekend Breakouts: Treat Saturday and Sunday breakouts with extra patience — wait for Monday London/New York volume to prove the move is real.',
          'Zoom Out From Noisy 1-Minute Wicks: Use 15-minute, 1-hour, and 4-hour charts so random 1-minute crypto scam wicks do not shake you out.',
        ],
        keyTakeaway:
          'Low effective leverage, a hard 1% stop-loss, and patience on weekends keep you calm and solvent in 24/7 crypto.',
      },
    ],
    diagramConfig: {
      kind: 'crypto_funding_dominance',
      title: 'Crypto Flow Matrix: Bitcoin Dominance + Funding Rate Flush vs. Spot Breakout',
      subtitle: 'Reading capital rotation alongside crowded leverage liquidation sweeps',
      caption:
        'Left: High positive funding at resistance signals overcrowded leveraged buyers vulnerable to a sharp liquidation flush wick. Right: Calm neutral funding with clean Bitcoin leadership fuels sustainable spot breakouts.',
      legend: [
        { label: 'Crowded Leverage / High Funding Zone', colorToken: '#f59e0b' },
        { label: 'Liquidation Flush Wick', colorToken: '#ef4444' },
        { label: 'Healthy Spot-Led Breakout & Hold', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'cry1', label: 'BTC + BTC.D', sublabel: 'Check Bitcoin Tide First', tone: 'neutral' },
        { id: 'cry2', label: 'High Funding', sublabel: 'Crowded Buyers Alarm', tone: 'liquidity' },
        { id: 'cry3', label: 'Flush Wick', sublabel: 'Clears 20x Leverage Fast', tone: 'bearish' },
        { id: 'cry4', label: 'Clean Reset', sublabel: 'Healthy Spot Continuation', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Check Bitcoin structure and Bitcoin Dominance (BTC.D) first to see where capital is flowing.',
        'Check Perpetual Funding Rates — avoid chasing buys when funding spikes sharply positive under resistance.',
        'Size strictly by 1% account risk to a real structural stop-loss (never a liquidation price) and filter thin weekend spikes.',
      ],
    },
    chartScenarioIds: ['cry-btc-funding-flush'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Watch Bitcoin First, Avoid Crowded Leverage, Rest on Weekends',
        summary:
          'Crypto moves fast and never sleeps. If you check Bitcoin’s direction first, check that Funding Rates aren’t wildly overheated, keep your stop-loss strictly at 1% risk, and skip sleepy Sunday fakeouts, you instantly dodge the traps that wipe out most beginners.',
        steps: [
          'Always open Bitcoin (BTC) before looking at any smaller coin.',
          'Think of high positive Funding Rates as a warning that too many people borrowed money on the buy side.',
          'Set a real stop-loss risking just $100 on a $10,000 account (1%) — never gamble with 20x–50x liquidation bets.',
        ],
        keyTakeaway:
          'Small steady risk beats wild high-leverage gambling every single time in crypto.',
        practiceSafeHint:
          'Check Bitcoin’s lead, Funding Rate crowding, and weekend liquidity before acting.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Step Crypto Safety & Setup Filter',
        summary:
          'Run these four quick checks before entering any crypto trade.',
        steps: [
          'Step 1 (Bitcoin Tide): Is Bitcoin trending cleanly or crashing into support?',
          'Step 2 (Dominance Check): Is money flowing into Bitcoin (BTC.D up) or rotating to altcoins (BTC.D down)?',
          'Step 3 (Funding Meter): Is Funding calm/neutral (healthy) or spiking wildly positive right at a ceiling (flush risk)?',
          'Step 4 (Real Stop Math): Position Size = $100 risk ÷ stop distance — keep liquidation miles away.',
        ],
        keyTakeaway:
          'Four 10-second checks shield you from 90% of crypto’s nastiest traps.',
        practiceSafeHint:
          'Verify whether funding is overcrowded and whether real weekday volume backs the breakout.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Bitcoin $65,000 Funding Flush vs. Clean Reset Breakout',
        summary:
          'Imagine Bitcoin stalling right under $65,400 while Funding Rates spike high as late traders pile in with 20x leverage. One sharp 3% flush wick plunges to $63,400, wiping out over-leveraged longs and resetting Funding back to neutral — then calm spot buyers push cleanly above $65,400 and hold the retest!',
        steps: [
          'High funding under $65,400 warned you NOT to chase buys before the flush.',
          'The sharp lower wick cleared crowded stops and cooled Funding back to healthy levels.',
          'Once a solid 1-hour candle closed above $65,400 and held the retest, a calm 1% risk trade rode cleanly higher.',
        ],
        keyTakeaway:
          'Let the crowded leverage flush clear the room — then ride the healthy spot-led breakout.',
        practiceSafeHint:
          'Notice the difference between a crowded leveraged spike and a calm breakout that holds its retest.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Everyone Standing on the Same Side of a Small Boat',
        summary:
          'When everyone rushes to stand on one edge of a small rowboat (extreme positive Funding + high borrowed leverage), even a tiny ripple tips the entire boat over (Liquidation Cascade) before the water calms down again.',
        steps: [
          'Spiking Funding Rates tell you the boat is dangerously tilted.',
          'A sharp flush dumps the reckless crowd overboard and steadies the boat for real buyers.',
        ],
        keyTakeaway:
          'Never be the last person climbing onto an already tilting side of the boat.',
        practiceSafeHint:
          'Watch for overcrowded leverage clustering right beneath a major ceiling.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Healthy Spot-Led Breakout vs. Over-Leveraged Fakeout',
        summary:
          'Real cash buyers build steady trends; borrowed-leverage chases snap back brutally.',
        steps: [
          'Healthy Breakout: Calm neutral Funding, rising lows coiling cleanly, solid candle close + held retest on weekday volume.',
          'Leveraged Fakeout: Spiking positive Funding, thin Sunday evening volume, long upper rejection wick followed by a fast liquidation dump.',
        ],
        keyTakeaway:
          'Pair clean candle closes with calm Funding Rates to stay on the winning side.',
        practiceSafeHint:
          'Contrast solid weekday acceptance against overcrowded leveraged spikes.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Fatal Beginner Crypto Mistakes',
        summary:
          'Crypto’s speed punishes these three habits almost immediately.',
        steps: [
          'Mistake 1: Using 25x–50x leverage and treating your forced liquidation price as your "stop-loss."',
          'Mistake 2: Buying smaller altcoins while Bitcoin is breaking down and Bitcoin Dominance is surging.',
          'Mistake 3: Chasing thin Sunday night breakouts that completely reverse Monday morning.',
        ],
        keyTakeaway:
          'Use a hard 1% stop-loss, respect Bitcoin’s lead, and wait for Monday liquidity to confirm weekend moves.',
        practiceSafeHint:
          'Verify that risk is capped by a structural stop-loss rather than an exchange liquidation point.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-cry-1',
        lessonSlug: 'crypto-247-liquidity-playbook',
        conceptKey: 'crypto-247-liquidity-playbook',
        prompt:
          'Bitcoin is climbing strongly while Bitcoin Dominance (BTC.D) is also rising steeply. What does this tell a beginner about where money is flowing?',
        options: [
          { id: 'a', label: 'Money is concentrating into Bitcoin first, so smaller altcoins often lag until Bitcoin stabilizes and BTC.D cools down' },
          { id: 'b', label: 'Bitcoin is about to go to zero while altcoins immediately double' },
          { id: 'c', label: 'Funding Rates have been permanently turned off' },
          { id: 'd', label: 'Altcoins never follow Bitcoin’s direction' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think of the pizza analogy: if Bitcoin’s slice of the total crypto pizza is getting bigger, where is the new money going?',
        ],
        postSubmissionRationale:
          'Rising Bitcoin price alongside rising Bitcoin Dominance shows capital piling primarily into Bitcoin. Altcoins typically perform much cleaner once Bitcoin steadies and Dominance rotates lower.',
        commonTrapNote:
          'Forcing altcoin buys while Bitcoin Dominance surges often leaves you stuck in sluggish charts.',
      },
      {
        id: 'pq-cry-2',
        lessonSlug: 'crypto-247-liquidity-playbook',
        conceptKey: 'crypto-247-liquidity-playbook',
        prompt:
          'Bitcoin stalls right beneath a major ceiling while Perpetual Funding Rates spike very high positive. What hidden danger is building?',
        options: [
          { id: 'a', label: 'Zero danger — high positive funding guarantees endless upward gains' },
          { id: 'b', label: 'Too many traders are using borrowed leverage betting UP, raising the risk of a sudden downward liquidation flush' },
          { id: 'c', label: 'Crypto exchanges are shutting down for the week' },
          { id: 'd', label: 'Short sellers are paying buyers to keep trades open' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember the tilted-boat analogy: what happens when way too many leveraged buyers lean on the same side?',
        ],
        postSubmissionRationale:
          'Very high positive funding means leveraged buyers are crowded and paying sellers to stay open — creating prime fuel for a rapid downward liquidation cascade.',
        commonTrapNote:
          'Chasing late buys into extreme positive funding puts you right in the path of a flush.',
      },
      {
        id: 'pq-cry-3',
        lessonSlug: 'crypto-247-liquidity-playbook',
        conceptKey: 'crypto-247-liquidity-playbook',
        scenarioId: 'cry-btc-funding-flush',
        prompt:
          'Why should crypto beginners be extra careful with Saturday or Sunday breakouts compared to weekday sessions?',
        options: [
          { id: 'a', label: 'Because crypto prices are frozen on weekends' },
          { id: 'b', label: 'Because lighter weekend volume makes fake stop-run breakouts much more common before big weekday funds return Monday' },
          { id: 'c', label: 'Because candlesticks cannot close on Sundays' },
          { id: 'd', label: 'Because Bitcoin stops trading on Saturdays' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how active big banks and Wall Street Bitcoin funds are on Sunday night versus Monday morning.',
        ],
        postSubmissionRationale:
          'Thinner weekend order books make it easier for smaller bursts of volume to shove price temporarily past a range edge, only to snap back inside once full institutional liquidity returns Monday.',
        commonTrapNote:
          'Waiting for Monday acceptance or clean retests saves you from weekend fakeout traps.',
      },
    ],
  },

  // =========================================================================
  // MODULE 13: Stocks Playbook: Pre-Market Gaps, RVOL & Opening Range
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000014',
    slug: 'stocks-gaps-rvol-playbook',
    title: 'Stocks Playbook: Pre-Market Gaps, Relative Volume & Opening Range',
    subtitle:
      'Filter thousands of stocks down to 2–3 active morning leaders using fresh news, Relative Volume, VWAP, and clean 5-minute Opening Range Breakouts.',
    plainEnglishSummary:
      'There are thousands of US stocks, and on any normal morning most of them drift lazily sideways. Stock day traders narrow that giant list down to just 2 or 3 "Stocks in Play" — companies with fresh breaking news (like earnings) and heavy Relative Volume (meaning far more people are trading that stock today than usual). Once the 9:30 AM New York bell rings, you simply box the first 5 minutes (the Opening Range) and trade with the winning side using exact share-count math.',
    beginnerFaq: [
      {
        question: 'What is "Relative Volume" (RVOL) in plain everyday English?',
        answer:
          'Relative Volume simply compares how busy a stock is right now against how busy it is on an ordinary day at the same time. RVOL of 1.0 = normal sleepy day. RVOL of 3.0 = three times busier than normal — proving big Wall Street funds are actively trading it today!',
      },
      {
        question: 'What is a "Pre-Market Gap" and does a big green gap mean I should buy right at 9:30 AM?',
        answer:
          'A Pre-Market Gap happens when news drops after yesterday’s 4:00 PM closing bell (say a $100 stock reports great earnings and jumps to $105 before 9:30 AM). NEVER blindly buy at 9:30:01 AM — many overnight holders immediately sell to lock in profit! Wait for the Opening Range and VWAP to confirm whether buyers or sellers actually take control.',
      },
      {
        question: 'What is "VWAP" (Volume Weighted Average Price) without complicated math?',
        answer:
          'VWAP is simply a smooth line on your chart showing the average price everyone has paid for the stock so far today (weighted by share volume). Trading ABOVE VWAP means today’s average buyer is in profit (bullish control); falling BELOW VWAP means today’s buyers are underwater (bearish control).',
      },
      {
        question: 'How do I know how many shares to buy so I never risk more than $100?',
        answer:
          'Use one easy formula: Shares = Dollar Risk ÷ (Entry Price − Stop Price). For example, on a $10,000 account risking 1% ($100), if you buy a stock at $50.50 with your stop-loss at $50.00 ($0.50 risk per share), you buy $100 ÷ $0.50 = exactly 200 shares!',
      },
    ],
    level: 'intermediate',
    marketCategory: 'stocks',
    learningStage: 'market_playbooks',
    moduleOrder: 23,
    conceptKey: 'stocks-gaps-rvol-playbook',
    estimatedMinutes: 18,
    learningObjectives: [
      'Filter thousands of stocks down to 2–3 "Stocks in Play" using fresh catalysts, pre-market gaps, and Relative Volume (RVOL ≥ 2.0).',
      'Draw the 5-minute Opening Range (9:30–9:35 AM New York time) and distinguish real Opening Range Breakouts from failing gaps.',
      'Use VWAP (the day’s volume-weighted average price) and the overall market tide (SPY/QQQ) to avoid fighting sellers.',
      'Calculate exact share counts every time with Shares = Dollar Risk ÷ Stop Distance per share.',
    ],
    prerequisites: [
      'Market Structure Basics (Higher Highs, Higher Lows & Breaks of Structure)',
      'Liquidity Sweeps vs. True Breakouts',
    ],
    terminology: [
      {
        term: 'Relative Volume (How Busy a Stock Is Today)',
        shortCode: 'RVOL',
        definition:
          'How much share volume is trading right now compared to that stock’s normal average for the same time of day; 2.0 or higher signals heavy institutional focus.',
        example:
          'Apple trading 3.5x its normal morning volume after releasing stronger-than-expected quarterly sales.',
      },
      {
        term: 'Pre-Market Gap (Overnight Jump)',
        shortCode: 'Gap',
        definition:
          'The price jump between yesterday’s 4:00 PM closing price and this morning’s pre-market trading after overnight news or earnings.',
        example:
          'A stock closing at $100 yesterday afternoon and opening at $105 this morning (+5% gap up) on big news.',
      },
      {
        term: 'Opening Range Breakout (First 5-Minute Box)',
        shortCode: 'ORB',
        definition:
          'Drawing a box around the highest and lowest price of the first 2 or 5 minutes after 9:30 AM New York time, then trading a confirmed volume breakout outside that box.',
        example:
          'Stock trades between $104.20 and $105.40 from 9:30–9:35 AM; a solid green candle closes above $105.40 on heavy volume and holds the retest.',
      },
      {
        term: 'VWAP (Volume Weighted Average Price)',
        shortCode: 'VWAP',
        definition:
          'The running average price paid across all shares traded today — big Wall Street algorithms watch it closely as the dividing line between buyer control (above) and seller control (below).',
        example:
          'Staying strictly on the buy side while a stock holds cleanly above rising VWAP.',
      },
    ],
    sections: [
      {
        id: 'stk-sec-1',
        heading: 'Picking the Right Stock First: Finding 2–3 "Stocks in Play"',
        body: 'In stock day trading, PICKING the right ticker is half the battle. Even a textbook chart pattern goes nowhere on a sleepy stock with normal volume. Before 9:15 AM New York time, look for three simple clues:',
        bulletPoints: [
          'Fresh News Catalyst: Quarterly earnings report, major product announcement, FDA approval, or Wall Street upgrade/downgrade.',
          'Clean Pre-Market Gap & Tight Spread: Moving at least 2%–3% pre-market on a liquid well-known stock where the gap between buy and sell price is only a penny or two.',
          'High Relative Volume (RVOL ≥ 2.0): At least double its usual morning trading activity — proving big funds are actively moving the stock today.',
        ],
        keyTakeaway:
          'Watch just 2 or 3 high-RVOL "Stocks in Play" instead of flipping desperately across 50 sleepy tickers.',
      },
      {
        id: 'stk-sec-2',
        heading: 'The 5-Minute Opening Range Breakout (ORB) & VWAP Filter',
        body: 'Before 9:30 AM New York time, mark Pre-Market High, Pre-Market Low, and Yesterday’s Closing Price. When the bell rings at 9:30 AM, stay calm for the first 5 minutes and draw a box around that opening battle:',
        bulletPoints: [
          'Box the Opening Range (9:30–9:35 AM): Mark the exact High and Low of that first 5-minute candle.',
          'Gap-and-Go (Healthy Buy Setup): Stock holds ABOVE VWAP (today’s average price), prints a strong solid green close above the Opening Range High on heavy volume, and holds a calm pullback.',
          'Gap-and-Crap (Failed Gap Warning): Stock gaps up +5% pre-market, spikes for 60 seconds, then slams BELOW VWAP and below the Opening Range Low on heavy red volume — NEVER buy falling knives below VWAP!',
        ],
        keyTakeaway:
          'Let the 5-minute Opening Range and VWAP prove whether big funds are buying the gap or cashing out into hype.',
      },
      {
        id: 'stk-sec-3',
        heading: 'Checking the Overall Market (SPY/QQQ) & Exact Share-Count Math',
        body: 'Even a great stock struggles to swim uphill if the entire US stock market (tracked by SPY for the S&P 500 and QQQ for tech stocks) is plunging. Pair market direction with crystal-clear share-sizing math:',
        bulletPoints: [
          'Check SPY & QQQ Alignment: Your cleanest stock buy setups happen when SPY/QQQ are steady or climbing — not crashing straight down.',
          'Exact Share Formula: Shares = Dollar Risk ÷ (Entry Price − Stop Price). Never buy random round numbers like "100 shares of everything" — 100 shares of a $20 stock and 100 shares of a $300 stock carry completely different dollar risk!',
          'Real $10,000 Account Example (1% = $100 Max Risk): Buying at $105.50 with your structural stop below VWAP at $104.50 ($1.00 risk per share) → $100 ÷ $1.00 = exactly 100 shares. If your stop is $0.50 wide → $100 ÷ $0.50 = exactly 200 shares!',
        ],
        keyTakeaway:
          'Stock in Play (RVOL ≥ 2) + Above VWAP + Confirmed Opening Range + Exact Share Math = calm, repeatable stock trading.',
      },
    ],
    diagramConfig: {
      kind: 'stocks_orb_gap',
      title: 'Stock Pre-Market Gap, 5-Minute Opening Range & VWAP Hold',
      subtitle: 'Mapping Overnight Gap → 9:30–9:35 AM Opening Range Box → Volume Breakout & Retest',
      caption:
        'A high-RVOL stock gaps up overnight, forms a crisp 5-minute Opening Range above rising VWAP, breaks out with expanded volume, and holds the Opening Range High as new support.',
      legend: [
        { label: 'Pre-Market Gap & Opening Range Box', colorToken: '#f59e0b' },
        { label: 'Rising VWAP (Buyer Control Line)', colorToken: '#38bdf8' },
        { label: 'Confirmed Volume Breakout & Retest', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'stk1', label: 'Overnight Gap', sublabel: 'Fresh News + RVOL ≥ 2.0', tone: 'neutral' },
        { id: 'stk2', label: '5m ORB Box', sublabel: '9:30–9:35 AM High & Low', tone: 'liquidity' },
        { id: 'stk3', label: 'VWAP Hold', sublabel: 'Price Stays Above Average', tone: 'bullish' },
        { id: 'stk4', label: 'ORB Retest', sublabel: 'Former High Flips to Floor', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Screen pre-market for 2–3 liquid stocks with fresh news and Relative Volume ≥ 2.0.',
        'Wait 5 minutes after 9:30 AM New York time to draw the Opening Range High and Low alongside VWAP.',
        'Trade confirmed volume breakouts holding above VWAP and compute exact shares from Dollar Risk ÷ Stop Distance.',
      ],
    },
    chartScenarioIds: ['stk-aapl-orb-gap'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Only Trade the 2 or 3 Stocks Everyone Is Watching Today',
        summary:
          'Skip the thousands of sleepy stocks doing nothing. Pick 2–3 stocks with big breaking news and heavy morning volume (RVOL 2x+), box the first 5 minutes after 9:30 AM, stay above VWAP for buys, and calculate your exact share count.',
        steps: [
          'Check pre-market gainers/losers for fresh news (like earnings) and at least double normal volume.',
          'Wait until 9:35 AM to box the first 5-minute Opening Range High and Low.',
          'Look for solid green closes above both VWAP and the Opening Range High — never buy stocks dropping below VWAP.',
        ],
        keyTakeaway:
          'Fresh news + heavy volume + clean 5-minute box beats guessing random quiet tickers.',
        practiceSafeHint:
          'Check Relative Volume, VWAP position, and exact share sizing before entering.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '8:45–10:15 AM Beginner Stock Trader Checklist',
        summary:
          'Follow this calm four-step morning routine every weekday.',
        steps: [
          '8:45 AM: Pick 2–3 liquid stocks gapping ≥ 2% on real news with Relative Volume ≥ 2.0.',
          '9:15 AM: Mark Pre-Market High, Pre-Market Low, and Yesterday’s Close.',
          '9:30–9:35 AM: Box the 5-minute Opening Range and check VWAP + overall market (SPY/QQQ).',
          '9:35–10:15 AM: Enter confirmed Opening Range Breakout or VWAP pullback using Shares = Dollar Risk ÷ Stop Distance.',
        ],
        keyTakeaway:
          'A calm morning shortlist stops you from frantically chasing random alerts after the bell.',
        practiceSafeHint:
          'Verify RVOL selection first, then check solid candle acceptance above VWAP and exact share math.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'AAPL +4% Earnings Gap → 5-Minute Opening Range Breakout',
        summary:
          'Suppose AAPL closes yesterday at $180, reports strong earnings, and opens at $187 with 3x normal volume (RVOL 3.0). From 9:30–9:35 AM it trades between $186.20 and $187.80 while holding above VWAP ($186.80).',
        steps: [
          'At 9:40 AM, a solid green candle closes above $187.80 on surging volume, then pulls back gently to retest $187.80 as new support.',
          'Entry at $188.00 with a structural stop below VWAP at $186.75 ($1.25 risk per share).',
          'Risking $100 (1% on a $10,000 account): $100 ÷ $1.25 = exactly 80 shares — riding cleanly to $191.75 (+3R = $300 profit)!',
        ],
        keyTakeaway:
          'Real institutional Opening Range Breakouts hold above VWAP and respect their retest.',
        practiceSafeHint:
          'Trace how volume expansion, VWAP support, and exact share math work together.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Sailing Only Where the Wind Is Actually Blowing',
        summary:
          'Trading a quiet low-volume stock is trying to sail a boat on a flat pond with zero wind. Relative Volume of 2.0 or higher is a strong steady breeze that fills your sails and actually carries price smoothly to your target.',
        steps: [
          'Fresh news creates the weather front.',
          'Relative Volume measures the actual wind speed.',
          'Opening Range + VWAP shows which direction the wind is blowing.',
        ],
        keyTakeaway:
          'Never waste risk capital on windless, low-volume stocks.',
        practiceSafeHint:
          'Check whether Relative Volume proves real institutional participation today.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Gap-and-Go (Holds Above VWAP) vs. Gap-and-Crap (Falls Below VWAP)',
        summary:
          'A bright green pre-market gap does NOT automatically mean "click buy at 9:30 AM."',
        steps: [
          'Gap-and-Go: Absorbs early profit-taking, stays above VWAP, and breaks above the 5-minute Opening Range High on big green volume.',
          'Gap-and-Crap: Pops for 60 seconds, then plunges below VWAP and below the Opening Range Low on heavy red selling — trapping eager opening buyers.',
        ],
        keyTakeaway:
          'Let VWAP and the 5-minute box tell you which story is unfolding before risking a dollar.',
        practiceSafeHint:
          'Watch whether price holds cleanly above VWAP or slams straight underneath it.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Classic Beginner Stock-Trading Traps',
        summary:
          'Dodge these three habits right from week one.',
        steps: [
          'Mistake 1: Buying a huge pre-market gap at 9:30:01 AM right as overnight owners take profits.',
          'Mistake 2: Buying a fixed "100 shares" on every stock regardless of whether your stop is $0.20 wide or $3.00 wide.',
          'Mistake 3: Trading tiny, wide-spread penny stocks that slip far past your stop-loss.',
        ],
        keyTakeaway:
          'Trade liquid Stocks in Play, wait for 5-minute + VWAP confirmation, and compute exact shares every single trade.',
        practiceSafeHint:
          'Always divide Dollar Risk by Stop Distance per share to calculate your exact share count.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-stk-1',
        lessonSlug: 'stocks-gaps-rvol-playbook',
        conceptKey: 'stocks-gaps-rvol-playbook',
        prompt:
          'Why do stock day traders look for Relative Volume (RVOL) of 2.0 or higher before the 9:30 AM bell?',
        options: [
          { id: 'a', label: 'Because RVOL ≥ 2.0 proves the stock is at least twice as busy as normal, showing active institutional money and cleaner moves' },
          { id: 'b', label: 'Because brokers legally block orders on stocks with RVOL below 2.0' },
          { id: 'c', label: 'Because high RVOL guarantees a stock can only go up' },
          { id: 'd', label: 'Because high RVOL means you do not need a stop-loss' },
        ],
        correctOptionId: 'a',
        hints: [
          'Remember the sailboat analogy: what does abnormal volume tell you about institutional wind behind the stock?',
        ],
        postSubmissionRationale:
          'Relative Volume ≥ 2.0 confirms big Wall Street funds are actively repricing the stock on fresh news, supplying the liquidity and energy needed for clean intraday trends.',
        commonTrapNote:
          'Trading quiet, average-volume stocks traps you in slow, choppy sideways drift.',
      },
      {
        id: 'pq-stk-2',
        lessonSlug: 'stocks-gaps-rvol-playbook',
        conceptKey: 'stocks-gaps-rvol-playbook',
        scenarioId: 'stk-aapl-orb-gap',
        prompt:
          'You plan a $150 maximum risk on a stock entering at $52.40 with your stop-loss below VWAP at $51.80 ($0.60 risk per share). Exactly how many shares should you buy?',
        options: [
          { id: 'a', label: '100 shares' },
          { id: 'b', label: '250 shares ($150 Dollar Risk ÷ $0.60 per share = 250 shares)' },
          { id: 'c', label: '500 shares' },
          { id: 'd', label: '1,000 shares' },
        ],
        correctOptionId: 'b',
        hints: [
          'Use the simple share formula: Shares = Dollar Risk ÷ (Entry Price − Stop Price).',
        ],
        postSubmissionRationale:
          '$150 ÷ ($52.40 − $51.80) = $150 ÷ $0.60 = 250 shares. Calculating exact shares ensures that if your stop hits, your loss is strictly $150 — never a random surprise.',
        commonTrapNote:
          'Buying arbitrary 100- or 500-share blocks creates wild, unpredictable dollar swings across different stocks.',
      },
      {
        id: 'pq-stk-3',
        lessonSlug: 'stocks-gaps-rvol-playbook',
        conceptKey: 'stocks-gaps-rvol-playbook',
        prompt:
          'A stock jumps +6% pre-market, pops briefly at 9:30 AM, then drops below VWAP and closes below its 5-minute Opening Range Low on heavy red volume. How should you read this?',
        options: [
          { id: 'a', label: 'Huge bargain — keep buying more shares all the way down' },
          { id: 'b', label: 'A failing gap ("Gap-and-Crap") showing big sellers taking over; do NOT force buys below VWAP' },
          { id: 'c', label: 'Ignore VWAP because pre-market was green' },
          { id: 'd', label: 'Remove your stop-loss and hold for a month' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare a healthy Gap-and-Go holding above VWAP against losing both VWAP and the Opening Range Low.',
        ],
        postSubmissionRationale:
          'Falling below both VWAP and the 5-minute Opening Range Low on heavy selling proves early holders are cashing out into opening buyers. Respect the signal and stay out of longs.',
        commonTrapNote:
          'Stubbornly buying green pre-market gappers after they fall below VWAP is one of the costliest beginner habits.',
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
      'Put everything together into one simple 5-question yes/no checklist so you only risk money on top-quality trades and skip boring traps.',
    plainEnglishSummary:
      'Even experienced airline pilots follow a short printed checklist before every takeoff so they never skip an important step. An A+ Setup Checklist does the exact same thing for your trading: instead of guessing on random candles, you check 5 simple clues — big-picture trend, active session timing, a clean stop-grab or breakout, a clear U-turn entry zone, and a smart profit-to-risk ratio — and ONLY place a trade when all 5 say YES.',
    beginnerFaq: [
      {
        question: 'What does "Confluence" actually mean in plain English?',
        answer:
          'Confluence simply means stacking multiple separate clues that all point in the exact same direction — like checking the weather forecast, seeing dark clouds, AND feeling cold wind before grabbing an umbrella. One clue alone is weak; 5 independent clues agreeing together creates an A+ setup.',
      },
      {
        question: 'What does "1R" and "1:3 Risk-to-Reward" mean in real dollars?',
        answer:
          '"1R" is simply your fixed dollar risk on one trade — for example, 1% of a $10,000 account = $100. So a "1:3 Risk-to-Reward" (+3R) trade simply means you risk losing $100 if you are wrong in order to make $300 if you are right!',
      },
      {
        question: 'What if I open my charts and NONE of my 5 checklist boxes line up today?',
        answer:
          'Then you take ZERO trades and celebrate! Sitting on your hands and protecting your $10,000 account on a messy, choppy day is one of the highest-paid skills in trading. Cash is a winning position when the chart offers nothing clean.',
      },
      {
        question: 'Why shouldn’t I switch strategies after 2 or 3 losing trades in a row?',
        answer:
          'Because even a great coin weighted 60% in your favor will land on tails 3 times in a row sometimes! You need at least 30 to 50 consistent trades following ONE written recipe to see your true statistical edge.',
      },
    ],
    level: 'advanced',
    marketCategory: 'general',
    learningStage: 'execution_edge',
    moduleOrder: 11,
    conceptKey: 'confluence-a-plus-setups',
    estimatedMinutes: 20,
    learningObjectives: [
      'Build a simple 5-question A+ Setup Checklist covering Trend, Timing, Liquidity Event, Entry Trigger, and Risk Math.',
      'Grade every possible trade honestly as A+ (5/5), B (4/5), or C (3/5 or less) — and ban C-grade boredom trades completely.',
      'Write down ONE fixed Execution Model so you stop hesitating on clean trades and stop chasing messy ones.',
      'Treat "No Trade" as a disciplined winning decision on choppy, low-clarity days.',
    ],
    prerequisites: [
      'Order Blocks, Change of Character & Institutional Displacement',
      'Multi-Timeframe Analysis (Big-Picture Map to Zoomed-In Entry)',
    ],
    terminology: [
      {
        term: 'Confluence (Stacking Clues Together)',
        shortCode: 'Confluence',
        definition:
          'Several independent chart clues all lining up at the exact same time and price (for example: big-picture uptrend + busy session + stop-grab sweep + fresh Demand zone + 1:3 reward).',
        example:
          'Waiting until 4-Hour trend, London/NY session, stop sweep, 5-minute U-turn, and 1:3 reward all say YES together.',
      },
      {
        term: 'Execution Model (Your Written Recipe)',
        shortCode: 'Playbook',
        definition:
          'A clear, fixed step-by-step recipe written BEFORE the market opens that spells out exactly what must happen before you click buy or sell.',
        example:
          'Step 1: Sweep a low → Step 2: 5-minute U-turn close → Step 3: Buy pullback into Order Block → Step 4: Stop below wick, aim for +3R.',
      },
      {
        term: 'Setup Grading (A+ / B / C)',
        shortCode: 'Grade',
        definition:
          'Scoring every trade idea out of 5 points BEFORE entering so only top-grade trades get full risk.',
        example:
          'On a $10,000 account: A+ (5/5) = full $100 risk (1R); B (4/5) = $50 risk or skip; C (≤ 3/5) = $0 risked (hard pass).',
      },
      {
        term: 'Sitting on Hands (Cash Is a Position)',
        shortCode: 'No-Trade',
        definition:
          'Deliberately taking zero trades when the market is choppy or missing checklist boxes so you preserve money and focus for real opportunities.',
        example:
          'Closing your trading app with 0 trades on a quiet, choppy morning before a major Federal Reserve announcement.',
      },
    ],
    sections: [
      {
        id: 'ap-sec-1',
        heading: 'The Simple 5-Point A+ Setup Checklist (Takes 20 Seconds)',
        body: 'Scattered traders know 20 fancy concepts and execute none of them consistently. Boil everything you learned in Modules 1–13 down to 5 clear YES/NO questions sitting right beside your screen:',
        bulletPoints: [
          '1. Big-Picture Direction (Higher Timeframe): Is the 4-Hour/1-Hour trend crystal clear with an open target ahead?',
          '2. Active Window / Catalyst: Are we inside a busy session (London/NY Killzone for Forex/Indices, high Relative Volume ≥ 2.0 for Stocks, or aligned Bitcoin flow for Crypto)?',
          '3. Clear Liquidity Event: Did price just grab resting stops with a clean sweep — or print a solid full-body breakout and hold?',
          '4. Fast Shift & Entry Zone: Did tall displacement candles print a U-turn (Change of Character) or continuation break leaving a fresh Order Block or price gap (Fair Value Gap)?',
          '5. Smart Dollar Math (Risk-to-Reward): Is your structural stop clearly defined, offering at least $2.50–$3.00 reward for every $1.00 risked (1:2.5 to 1:3) at strictly 1% max risk ($100 on a $10,000 account)?',
        ],
        keyTakeaway:
          'If you cannot answer a clear YES to all 5 questions in 20 seconds, it is NOT an A+ setup — wait!',
      },
      {
        id: 'ap-sec-2',
        heading: 'Grading Trades Honestly: Banning C-Grade Trades Changes Everything',
        body: 'Here is a surprising secret from studying thousands of real trading journals: most struggling traders ALREADY spot profitable A+ setups — they just hand back all those profits taking bored, impatient C-grade trades in between!',
        bulletPoints: [
          'A+ Setup (5 out of 5 YES): Enter calmly with full 1% risk ($100 on $10,000) — zero hesitation.',
          'B Setup (4 out of 5 YES — for instance, slightly smaller reward or quieter hour): Either skip it completely or cut risk in half to 0.5% ($50).',
          'C Setup (3 or fewer YES — chasing late, guessing in the middle of a range, bored clicking): Strictly BANNED ($0 risked). Skipping C-grade trades gives your account an instant raise!',
        ],
        keyTakeaway:
          'You do not need more trades to make steady money — you just need to cut out the messy low-grade ones.',
      },
      {
        id: 'ap-sec-3',
        heading: 'One Written Recipe, 50 Repetitions (Stop Strategy Hopping)',
        body: 'Switching to a brand-new strategy every time two normal trades lose is like digging 10 shallow holes and never reaching water. Pick ONE simple execution recipe, focus on 1 or 2 markets, and practice it 50 times in a row:',
        bulletPoints: [
          'Write Your Exact Entry Trigger: Decide ahead of time whether you enter on a pullback limit order or after a rejection candle closes — never improvise live.',
          'Set Stop-Loss and Take-Profit Before Clicking: Lock in your exact exit prices before entering so fear and greed cannot hijack your mouse.',
          'Celebrate 0-Trade Days: Walking away with $0 lost on an ugly choppy chart proves real discipline.',
        ],
        keyTakeaway:
          'Master ONE simple, repeatable A+ checklist deeply instead of chasing ten half-learned strategies.',
      },
    ],
    diagramConfig: {
      kind: 'liquidity_sweep_vs_breakout',
      title: 'Complete A+ Setup Blueprint (All 5 Clues Stacked Together)',
      subtitle: 'Combining Big-Picture Trend, Busy Session, Clean Sweep/Breakout, U-Turn Entry & 1:3 Math',
      caption:
        'Only click buy or sell when all five checklist layers agree — Left shows the confirmed Stop-Sweep + U-Turn A+ reversal; Right shows the confirmed Full-Body Breakout + Retest A+ continuation.',
      legend: [
        { label: 'Key Level & Big-Picture Direction', colorToken: '#f59e0b' },
        { label: 'A+ Sweep + U-Turn Reversal Model', colorToken: '#ef4444' },
        { label: 'A+ Breakout + Retest Continuation Model', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'ap1', label: '1. Big Map', sublabel: 'Clear 4H/1H Trend + Target', tone: 'liquidity' },
        { id: 'ap2', label: '2. Sweep / Break', sublabel: 'Clean Liquidity Event', tone: 'bearish' },
        { id: 'ap3', label: '3. Shift + Zone', sublabel: 'Fast Candles + Fresh Zone', tone: 'bullish' },
        { id: 'ap4', label: '4. 1:3 Math', sublabel: 'Risk $100 to Make $300', tone: 'neutral' },
      ],
      walkthroughSteps: [
        'Score Big-Picture Direction and Active Session Timing first — if either is NO, close the chart.',
        'Wait patiently for a clean Stop-Grab Sweep (or full-body breakout) followed by fast confirming candles.',
        'Verify at least 1:2.5 to 1:3 reward-to-risk at strictly 1% account risk, then execute calmly without second-guessing.',
      ],
    },
    chartScenarioIds: ['exec-aplus-confluence'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'A Pilot Never Takes Off Without Running the 5-Point Checklist',
        summary:
          'Even veteran airline pilots check a short printed list before every flight. Your 5-point A+ checklist makes sure you only risk your hard-earned money when trend, timing, liquidity, entry zone, and 1:3 reward math all agree.',
        steps: [
          'Keep 5 simple YES/NO questions written next to your screen.',
          'Only click buy or sell when all 5 answers are a clear YES.',
          'Feel proud walking away with zero trades on days the chart gives you nothing clean.',
        ],
        keyTakeaway:
          'Trading discipline is simply refusing to take off when a checklist box is unchecked.',
        practiceSafeHint:
          'Count how many of the 5 checklist pillars — trend, timing, sweep/breakout, entry zone, and reward-to-risk — are actually present.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '20-Second Pre-Trade Scoreboard',
        summary:
          'Give every setup 1 point per YES before risking a single dollar.',
        steps: [
          '[1] Big-Picture Trend & open target clearly marked?',
          '[2] Inside active session / high-volume window?',
          '[3] Clean stop-grab sweep (or full-body breakout) finished?',
          '[4] Fast shift candles + fresh Order Block / price gap entry zone?',
          '[5] Clear stop-loss with at least 1:2.5 to 1:3 reward at ≤ 1% risk?',
        ],
        keyTakeaway:
          '5 out of 5 = A+ Execute calmly. 3 or less = C-Grade Mandatory Pass.',
        practiceSafeHint:
          'Check every single item honestly instead of stretching weak clues into a YES.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Scoring a Full 5/5 A+ Trade ($100 Risk → $300 Target)',
        summary:
          'Picture a 4-Hour uptrend pulling back during New York morning rush hour into a fresh $100 Demand floor. Price dips briefly to $99.20 (grabbing stops), snaps back with tall green candles closing above $101 (U-turn), and pulls back to $100.20.',
        steps: [
          'Big Trend (YES) + Busy Session (YES) + Clean Sweep (YES) + Fast U-Turn & Fresh Zone (YES) = 4/5 so far.',
          'Entry at $100.20 with stop below the sweep at $99.00 ($1.20 risk) and target at $103.80 ($3.60 gain) = exact 1:3 Risk-to-Reward (5/5 A+!).',
          'Risking $100 (1% on $10,000) means you risk $100 calmly for a $300 payout.',
        ],
        keyTakeaway:
          'Every concept from Lesson 1 onward snaps together into one crystal-clear 5-point setup.',
        practiceSafeHint:
          'Verify all five elements in order before deciding whether a setup earns an A+ grade.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'A Patient Photographer vs. Random Button Mashing',
        summary:
          'A wildlife photographer does not snap 500 blurry photos of empty bushes. They wait calmly for lighting, focus, and framing to line up — then press the shutter once for a masterpiece. Your A+ checklist is your camera viewfinder.',
        steps: [
          'Your cash and daily focus are your limited camera battery.',
          'Skipping 10 blurry C-grade setups keeps you sharp for the single A+ shot that pays for the whole week.',
        ],
        keyTakeaway:
          'Markets reward trade quality, never clicking frequency.',
        practiceSafeHint:
          'Ask whether this trade is a crystal-clear A+ snapshot or an impatient blurry guess.',
      },
      comparison: {
        style: 'comparison',
        headline: 'One Repeatable Checklist vs. Making Up Rules Every Day',
        summary:
          'You can only improve a recipe if you actually follow the same recipe.',
        steps: [
          'Repeatable A+ Checklist: Same 5 questions, same 3 timeframes, same 1% risk → clean trackable results across 50 trades.',
          'Random Improvising: Buys news Monday, chases random green candles Tuesday, sells mid-range Wednesday → pure chaos with nothing to learn from.',
        ],
        keyTakeaway:
          'Consistency begins the day you follow ONE written checklist across 50 trades.',
        practiceSafeHint:
          'Check whether the setup follows a repeatable written rule set or a spur-of-the-moment hunch.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Checklist Mistakes Even Smart Beginners Make',
        summary:
          'Watch out for these three sneaky ways impatience slips past your rules.',
        steps: [
          'Mistake 1: Calling a sloppy 2/5 setup "close enough to A+" simply because you sat at the computer for an hour and want action.',
          'Mistake 2: Freezing up and skipping a textbook 5/5 A+ setup because yesterday’s normal trade lost.',
          'Mistake 3: Throwing away your entire checklist after 3 normal losses in a row instead of testing 30–50 trades.',
        ],
        keyTakeaway:
          'Trust your checklist both ways: strictly skip the C-grades AND calmly take the A+ grades.',
        practiceSafeHint:
          'Grade setups honestly before entering and accept normal win/loss streaks inside a proven process.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ap-1',
        lessonSlug: 'confluence-a-plus-setups',
        conceptKey: 'confluence-a-plus-setups',
        scenarioId: 'exec-aplus-confluence',
        prompt:
          'A trade matches your big-picture direction and happens during active session hours, but there is NO stop sweep, NO fast U-turn, and only a 1:1.1 reward ($110 reward for $100 risk). How should you grade and handle it?',
        options: [
          { id: 'a', label: 'A+ Setup — enter full 1% risk immediately' },
          { id: 'b', label: 'C-Grade Setup (only 2 out of 5 boxes checked) — mandatory PASS; protect your cash and wait' },
          { id: 'c', label: 'Double your risk to $200 to make up for the tiny reward' },
          { id: 'd', label: 'Click buy now and hope confirmation shows up afterward' },
        ],
        correctOptionId: 'b',
        hints: [
          'Count how many of the 5 A+ checklist boxes actually say YES here.',
        ],
        postSubmissionRationale:
          'With only 2 of 5 checklist items checked and a poor 1:1.1 reward ratio, this is a C-grade trade. Passing cleanly saves both your capital and mental energy for real 5/5 setups.',
        commonTrapNote:
          'Taking bored C-grade trades is the #1 leak that keeps otherwise good traders stuck at breakeven.',
      },
      {
        id: 'pq-ap-2',
        lessonSlug: 'confluence-a-plus-setups',
        conceptKey: 'confluence-a-plus-setups',
        prompt:
          'Why is sticking to ONE written execution checklist across 50 trades much smarter than switching strategies every week?',
        options: [
          { id: 'a', label: 'Because one checklist never loses a single trade' },
          { id: 'b', label: 'Because repeating one consistent rule set builds reliable data so you can measure and trust your real edge' },
          { id: 'c', label: 'Because brokers charge a fine if you change strategies' },
          { id: 'd', label: 'Because charts only allow one indicator per month' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how you could ever know what works if your rules change every Tuesday.',
        ],
        postSubmissionRationale:
          'A real trading edge only becomes visible over a steady sample of 30–50+ uniform trades. Hopping strategies after 2 losses resets your learning curve back to zero every week.',
        commonTrapNote:
          'Two or three losses in a row are normal probability — not proof that a solid checklist is broken.',
      },
      {
        id: 'pq-ap-3',
        lessonSlug: 'confluence-a-plus-setups',
        conceptKey: 'confluence-a-plus-setups',
        prompt:
          'Which combination represents a true 5-out-of-5 A+ bullish trade setup?',
        options: [
          { id: 'a', label: 'One random green 1-minute candle during a sleepy afternoon' },
          { id: 'b', label: 'Big-picture uptrend + active session + clean low sweep + fast U-turn / fresh Demand zone + at least 1:2.5 to 1:3 reward at 1% risk' },
          { id: 'c', label: 'Buying right into a giant 4-Hour ceiling after 8 straight green candles' },
          { id: 'd', label: 'Buying based on a social media rumor with no stop-loss' },
        ],
        correctOptionId: 'b',
        hints: [
          'Check which option stacks Trend, Timing, Liquidity Sweep, Fast Confirmation Zone, and Asymmetric Reward together.',
        ],
        postSubmissionRationale:
          'Aligning higher-timeframe trend, busy session volume, a stop-grab sweep, fast confirmation into a fresh zone, and 1:2.5+ reward puts all five edges in your corner at once.',
        commonTrapNote:
          'Skipping even one pillar — like buying straight into an untouched ceiling — dramatically lowers odds.',
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
      'Learn exactly what to do AFTER you enter a trade — when to safely move your stop to Breakeven, how to cash out partial profits, and how to let winners run.',
    plainEnglishSummary:
      'Many beginners learn how to enter good trades, then panic the second their profit blinks green — closing way too early or sliding their stop-loss to zero too soon and getting knocked out right before a huge rally. Good trade management means deciding your exact exit steps BEFORE you enter: giving the trade breathing room early, safely locking in half your profit at a clear milestone (a Partial), moving your safety stop to your entry price (Breakeven), and letting the rest ride (a Runner).',
    beginnerFaq: [
      {
        question: 'What does "moving my stop to Breakeven" mean, and why can doing it TOO EARLY hurt me?',
        answer:
          'Moving your stop to Breakeven means sliding your protective exit up to your exact entry price so the trade can no longer lose money ($0 worst-case outcome). Doing it TOO EARLY (say when you are barely up +$40 on a $100 risk) is a classic trap: price normally wiggles back to retest your entry before flying up +$300, knocking you out at $0 while all your losing trades still cost -$100!',
      },
      {
        question: 'What is a "Partial Take-Profit" and how does the dollar math work?',
        answer:
          'Taking a Partial simply means cashing out HALF (50%) of your trade at an earlier target to lock in real profit, while keeping the other 50% open for a bigger move. Example on $100 risk: when the trade hits +$200 (+2R), closing 50% banks +$100 cash right into your account. If the remaining 50% hits +$400 (+4R), that adds another +$200 — for +$300 (+3R) total profit with zero stress!',
      },
      {
        question: 'Should a beginner use "Set-and-Forget" (all out at one target) or "Partials + Runner"?',
        answer:
          'Both work great! Set-and-Forget (100% exit at +2.5R or +3R) is super simple and easy to track when you are brand new. Taking 50% off at +2R + moving stop to Breakeven feels calmer emotionally once you trade larger sizes. Just pick ONE rule before entering and stick to it!',
      },
      {
        question: 'Where should I move a "Trailing Stop" so I do not choke a big winning trend?',
        answer:
          'Never drag your trailing stop two inches below the live flickering candle! Instead, wait for the trend to make a brand-new confirmed higher peak, then step your stop neatly underneath the most recent Higher Low floor so the trend has room to breathe.',
      },
    ],
    level: 'advanced',
    marketCategory: 'general',
    learningStage: 'execution_edge',
    moduleOrder: 12,
    conceptKey: 'trade-management-partials-be',
    estimatedMinutes: 18,
    learningObjectives: [
      'Move your stop-loss to Breakeven ONLY after a real structural milestone (like +1.5R to +2R) — never out of early panic at +0.4R.',
      'Calculate exact blended dollar and R-multiple profits when cashing out 50% Partials and holding a 50% Runner.',
      'Trail stops cleanly behind newly confirmed Higher Lows (or Lower Highs) to capture trend-day runners.',
      'Stop watching flickering live dollar P&L numbers so fear stops forcing early exits.',
    ],
    prerequisites: [
      'Building an A+ Setup Checklist & Execution Model',
      'Market Structure Basics (Higher Highs, Higher Lows & Breaks of Structure)',
    ],
    terminology: [
      {
        term: 'Breakeven Stop (Zero-Loss Safety Lock)',
        shortCode: 'BE',
        definition:
          'Moving your protective stop-loss to your entry price (plus tiny commission buffer) AFTER price proves real progress — removing all remaining downside risk.',
        example:
          'Entering at $100 with stop at $98; after price rallies past $104 (+2R), sliding your stop up to $100.05 so you cannot lose money.',
      },
      {
        term: 'Partial Take-Profit (Banking Half Early)',
        shortCode: 'Partial',
        definition:
          'Closing a planned portion of your trade (such as 50%) at your first target to put guaranteed profit in your pocket while keeping the rest open.',
        example:
          'Buying 100 shares at $100, selling 50 shares at $104 to lock in profit, and keeping 50 shares aimed at $108.',
      },
      {
        term: 'Runner (Letting the Rest Ride)',
        shortCode: 'Runner',
        definition:
          'The remaining slice of your trade left open after taking a partial, designed to ride big trend-day moves for extra upside.',
        example:
          'Holding your remaining 50 shares as price climbs from $104 to $108 and trailing your stop under each new floor.',
      },
      {
        term: 'Premature Breakeven Choke',
        shortCode: 'Early BE',
        definition:
          'Sliding your stop to entry way too soon (like +0.4R), getting knocked out for $0 on an ordinary pullback right before price rockets to +3R.',
        example:
          'Moving stop to $100 when price barely reached $100.80, getting tapped out at $100 on a routine dip, then watching it soar to $106.',
      },
    ],
    sections: [
      {
        id: 'tm-sec-1',
        heading: 'The Breakeven Trap: Earn Breakeven Through Structure, Never Panic',
        body: 'Sliding your stop-loss to your entry price feels comforting — which is exactly why beginners do it way too soon! Suppose you risk $100 (1R) buying at $100 with a safe stop at $98 and target at $106 (+$300 / +3R):',
        bulletPoints: [
          'The Early-BE Trap: Price nudges to $100.80 (+$40) and you nervously drag your stop to $100.00. Two minutes later, price makes a totally normal retest dip to $99.90, knocks you out for $0, and immediately rockets to $106 without you!',
          'The Math Damage: If you turn half your +$300 winners into $0 scratches while your losers still cost -$100, a profitable system turns into a losing system!',
          'The Simple Rule: Wait until price breaks an actual swing high/low and reaches at least +1.5R to +2R (+$150 to +$200) BEFORE moving your stop to Breakeven.',
        ],
        keyTakeaway:
          'Give every trade room to breathe early — earn Breakeven through a real structural milestone, never out of nerves.',
      },
      {
        id: 'tm-sec-2',
        heading: 'Partial Profits & Runners: Simple Dollar Math Anyone Can Follow',
        body: 'Once price reaches your first major milestone (+2R), you have two clean, professional ways to finish the trade — just pick ONE in advance:',
        bulletPoints: [
          'Option A — Set-and-Forget (Simplest for Beginners): Leave 100% of your trade untouched until it hits either your -$100 stop or your +$300 (+3R) target. Zero mid-trade stress or tinkering!',
          'Option B — 50/50 Partial + Runner: At +2R (+$200 open profit), close 50% of your shares (instantly locking +$100 cash into your balance!) and move your stop to Breakeven. Even if price reverses now, you STILL walk away +$100 ahead! If your remaining 50% runner reaches +4R, it earns another +$200 = +$300 (+3R) total!',
          'Hide Live Dollar Flickering: Switch your trading screen to show price levels or R-multiples instead of blinking "+$142... +$118... +$160" — staring at live dollars triggers panic clicks.',
        ],
        keyTakeaway:
          'Pre-planned partials lock in calm profit while keeping real upside open — never invent exit decisions mid-trade.',
      },
      {
        id: 'tm-sec-3',
        heading: 'Trailing a Runner Behind New Floors Without Getting Shaken Out',
        body: 'When a market catches a strong trend day, a trailing stop lets your remaining Runner capture huge gains while steadily locking in more profit:',
        bulletPoints: [
          'Step 1 (Wait for a New Confirmed High): In an uptrend, wait for price to pull back, form a clear new Higher Low floor, and close a solid candle ABOVE the previous high.',
          'Step 2 (Advance Your Trailing Stop): Slide your stop neatly just underneath that newly confirmed Higher Low floor (never right underneath the live flickering candle!).',
          'Step 3 (Repeat Calmly): Keep stepping your stop behind each new floor until either your big target fills or the trend finally bends and closes you out with locked-in profit.',
        ],
        keyTakeaway:
          'Trail stops behind confirmed swing floors — giving healthy trends natural room to keep climbing.',
      },
    ],
    diagramConfig: {
      kind: 'trade_management_journal',
      title: '3-Stage Mechanical Trade Management: Entry → +2R Partial & BE → +4R Runner',
      subtitle: 'Hands-off early breathing room, banking 50% at +2R, and trailing behind new swing floors',
      caption:
        'Stage 1 stays hands-off through normal pullbacks; Stage 2 banks 50% profit at +2R (+1.0R locked) and shifts stop to Breakeven; Stage 3 trails the remaining 50% behind Higher Lows to +4R (+3.0R total).',
      legend: [
        { label: 'Stage 1: Hands-Off Breathing Room (-1R Stop)', colorToken: '#ef4444' },
        { label: 'Stage 2: +2R Partial (50% Banked) + Breakeven', colorToken: '#38bdf8' },
        { label: 'Stage 3: Trailing Runner to +4R Target', colorToken: '#10b981' },
      ],
      annotations: [
        { id: 'tm1', label: 'Hands Off', sublabel: 'Let Normal Retest Breathe', tone: 'neutral' },
        { id: 'tm2', label: '+2R Partial', sublabel: 'Cash Out 50% + Move to BE', tone: 'liquidity' },
        { id: 'tm3', label: 'Trail Floor', sublabel: 'Step Stop Under New HL', tone: 'bullish' },
        { id: 'tm4', label: '+4R Runner', sublabel: 'Blended Net = +3.0R!', tone: 'bullish' },
      ],
      walkthroughSteps: [
        'Keep hands completely off your stop between entry and +1.5R so normal wiggles do not choke the trade.',
        'At your planned +2R milestone, close 50% (+1.0R locked) and slide your remaining stop to Breakeven.',
        'Trail the leftover 50% Runner cleanly beneath each newly confirmed swing floor until your final target fills.',
      ],
    },
    chartScenarioIds: ['mgmt-partials-be'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Lock Half In at Milestone #1, Let the Rest Ride Stress-Free',
        summary:
          'Deciding your exit steps BEFORE you click buy stops panic from hijacking your trade. Leave the trade alone early so normal dips don’t knock you out, bank half your profit at +2R and move your stop to entry, then calmly watch the second half aim for the big prize.',
        steps: [
          'Do NOT touch your stop-loss when you are barely up +$30 or +$50 — give the trade breathing room.',
          'Once price reaches a real milestone (+2R = +$200 on $100 risk), cash out 50% (+$100 locked!) and move your stop to Breakeven.',
          'Let the other 50% run calmly toward +3R or +4R knowing you literally cannot lose money on the trade anymore.',
        ],
        keyTakeaway:
          'Pre-planned partials calm your nerves while protecting big winning payouts.',
        practiceSafeHint:
          'Check whether price reached a real structural milestone before moving your stop to Breakeven.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Stage Hands-Off Trade Management Plan',
        summary:
          'Write all three stages down before clicking submit so emotions stay out.',
        steps: [
          'Stage 1 (Entry to +1.5R): Hands off! Accept either your planned -$100 stop or progression.',
          'Stage 2 (Milestone +2R): Close 50% (+1.0R banked) and move remaining stop to Breakeven.',
          'Stage 3 (Runner): Trail behind confirmed Higher Low floors until +3R/+4R final target hits.',
        ],
        keyTakeaway:
          'A mechanical exit plan frees you from babysitting blinking dollar numbers.',
        practiceSafeHint:
          'Weight each slice by its percentage when computing blended total profit.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Managing a $100 Risk Trade From Entry to +$300 (+3R) Net Profit',
        summary:
          'Suppose you buy 100 shares at $100 with a $99 stop ($100 risk = 1R). Price dips to $99.60 right after entry, pauses briefly at $101 (+1R), then surges to $102 (+2R) and $104 (+4R).',
        steps: [
          'Because you stayed hands-off during the normal $99.60 dip and $101 pause, you stayed inside the winning move.',
          'At $102 (+2R), selling 50 shares locks +$100 (+1.0R) cash and moves your stop on the other 50 shares to $100 (Breakeven).',
          'Your remaining 50 shares ride smoothly to $104 (+$200 = +2.0R more) — netting +$300 (+3.0R total) without a single second of panic!',
        ],
        keyTakeaway:
          'Patience through +1R and banking 50% at +2R turns tense trades into calm payouts.',
        practiceSafeHint:
          'Multiply each partial’s percentage by its exit R-multiple, then add them up.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Picking Half the Apples When Ripe, Letting the Top Branches Grow Huge',
        summary:
          'Banking 50% at +2R puts guaranteed food in the barn, giving you total peace of mind to let the remaining half grow all the way to +4R instead of panicking at the first passing cloud.',
        steps: [
          'Picking everything unripe at +0.5R ruins your whole harvest.',
          'Planned harvest at +2R + a calm Runner balances steady cash flow and big home-run wins.',
        ],
        keyTakeaway:
          'Smart partials protect your peace of mind without giving up big asymmetric winners.',
        practiceSafeHint:
          'Balance securing profit at a real milestone with leaving meaningful size for the full move.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Set-and-Forget (+3R) vs. 50/50 Partial (+2R / +4R)',
        summary:
          'Compare both styles side by side using $100 risk (1R):',
        steps: [
          'Set-and-Forget (100% at +3R): Earns +$300 (+3.0R) if target hits; earns $0 or -$100 if price reverses after +$240.',
          '50/50 Partial (+2R & +4R): Locks +$100 (+1.0R) even if price reverses after +$200; earns +$300 (+3.0R) if the runner hits +$400 (+4R).',
        ],
        keyTakeaway:
          'Track BOTH styles in your journal — real numbers will show which one fits your strategy and personality best.',
        practiceSafeHint:
          'Use Blended R = (Partial % × TP1 R) + (Runner % × TP2 R).',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Live Trade-Management Mistakes That Drain Good Entries',
        summary:
          'Many traders pick winning entries and then sabotage them while the trade is open.',
        steps: [
          'Mistake 1: Closing 100% at +$60 (+0.6R) on the first tiny red pullback candle out of fear of losing green numbers.',
          'Mistake 2: Slapping stop to Breakeven at +$40 (+0.4R) and watching four winning setups tag you out at $0 right before flying to +$300.',
          'Mistake 3: Changing your exit rules every single trade so you never know what actually works.',
        ],
        keyTakeaway:
          'Hide your live blinking dollar P&L and follow your pre-written price levels mechanically.',
        practiceSafeHint:
          'Check whether an exit adjustment follows a pre-written rule or an emotional impulse.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-tm-1',
        lessonSlug: 'trade-management-partials-be',
        conceptKey: 'trade-management-partials-be',
        scenarioId: 'mgmt-partials-be',
        prompt:
          'On a trade risking $100 (1R), you cash out 50% partial profit at +2R, move your stop to Breakeven, and your remaining 50% runner hits +4R. What is your total blended R-multiple (and dollar profit)?',
        options: [
          { id: 'a', label: '+2.0R (+$200)' },
          { id: 'b', label: '+3.0R (+$300): half at +2R = +1.0R ($100) plus half at +4R = +2.0R ($200)' },
          { id: 'c', label: '+6.0R (+$600)' },
          { id: 'd', label: '+1.0R (+$100)' },
        ],
        correctOptionId: 'b',
        hints: [
          'Multiply each half (0.50) by its R-multiple (+2R and +4R), then add both halves together.',
        ],
        postSubmissionRationale:
          '50% closed at +2R banks +1.0R ($100), and 50% closed at +4R adds +2.0R ($200), giving a blended net profit of +3.0R ($300) with risk eliminated halfway through.',
        commonTrapNote:
          'Never add +2R and +4R directly to get +6R — you must weight each slice by the percentage of the trade it represents.',
      },
      {
        id: 'pq-tm-2',
        lessonSlug: 'trade-management-partials-be',
        conceptKey: 'trade-management-partials-be',
        prompt:
          'What is the hidden cost of sliding your stop-loss to Breakeven the instant a trade moves +0.4R (+$40 on $100 risk) in your favor?',
        options: [
          { id: 'a', label: 'Zero cost — early Breakeven always boosts profits' },
          { id: 'b', label: 'Ordinary pullback retests constantly knock you out at $0 right before winning trades reach +3R, destroying your long-term edge' },
          { id: 'c', label: 'Brokers double commissions whenever stops sit at entry' },
          { id: 'd', label: 'It cancels your initial order retroactively' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how often price retests an entry zone normally before taking off to full target.',
        ],
        postSubmissionRationale:
          'Choking trades at +0.4R turns valid +$300 winners into $0 scratches while your losses still cost -$100 — quietly wrecking your overall Expectancy.',
        commonTrapNote:
          'Wait for a real structural break (typically +1.5R to +2R) before moving your stop to Breakeven.',
      },
      {
        id: 'pq-tm-3',
        lessonSlug: 'trade-management-partials-be',
        conceptKey: 'trade-management-partials-be',
        prompt:
          'When trailing your protective stop on a Runner during a strong uptrend, where is the smartest place to move it?',
        options: [
          { id: 'a', label: 'Neatly underneath each newly confirmed Higher Low floor after a solid candle closes above the prior high' },
          { id: 'b', label: 'One penny underneath the live flickering candle price' },
          { id: 'c', label: 'Delete the stop-loss completely once the trade turns green' },
          { id: 'd', label: 'Widen the stop lower whenever price dips' },
        ],
        correctOptionId: 'a',
        hints: [
          'Which swing point defines the structural floor of a climbing staircase trend?',
        ],
        postSubmissionRationale:
          'Stepping your trailing stop beneath each newly confirmed Higher Low locks in steadily larger profit while giving the trend natural breathing room.',
        commonTrapNote:
          'Putting a trailing stop right underneath the live candle shakes you out on the very first 2-candle breather.',
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
      'Turn your trade history into a simple personal coach — learn why Win Rate alone can fool you and how 6 simple journal notes expose your biggest profit leaks.',
    plainEnglishSummary:
      'Human memory is terrible at trading — we vividly remember our awesome wins and conveniently forget our impulsive losses. A trading journal takes just 2 minutes per trade and shows you the honest math called Expectancy (your average dollar profit or loss per trade over 100 trades). By tracking just 6 simple facts and reviewing them for 20 minutes every Sunday, you quickly spot and delete the one or two habits draining your account.',
    beginnerFaq: [
      {
        question: 'Wait — how can someone win 75% of their trades and STILL lose money?!',
        answer:
          'Easy! Imagine Trader A wins 75 out of 100 trades making just $30 each (+$2,250), but gets stubborn on losses and loses $150 each on the other 25 trades (-$3,750). Total result after 100 trades = -$1,500 LOSS despite a 75% win rate! Meanwhile Trader B wins only 42% of trades making $260 each (+$10,920) and caps losses strictly at $100 (-$5,800) = +$5,120 PROFIT!',
      },
      {
        question: 'What is "Expectancy" in plain everyday language?',
        answer:
          'Expectancy is simply the average amount of money (or R-multiple) you expect to earn every single time you click a valid trade over a large sample like 100 trades. If your Expectancy is +0.50R on $100 risk, every A+ trade you take is mathematically worth +$50 on average — even though individual trades win or lose randomly!',
      },
      {
        question: 'What is a "Good Loss" vs. a "Bad Win"?',
        answer:
          'A Good Loss is when you followed all 5 checklist rules, capped your loss cleanly at -$100, and accepted it calmly — celebrate that discipline! A Bad Win is when you broke your rules, widened your stop, got lucky, and made +$200 — that lucky win is dangerous because it trains reckless habits that eventually wipe out accounts.',
      },
      {
        question: 'What do MAE and MFE mean without confusing jargon?',
        answer:
          'Maximum Adverse Excursion (MAE) is simply the farthest a trade dipped AGAINST you while open. Maximum Favorable Excursion (MFE) is the farthest a trade went IN YOUR FAVOR before you closed it. If your MFE log shows winners regularly hit +$300 while you keep cashing out at +$110, you instantly know you are closing winners way too early!',
      },
    ],
    level: 'intermediate',
    marketCategory: 'general',
    learningStage: 'steady_profitability',
    moduleOrder: 14,
    conceptKey: 'trading-journal-expectancy',
    estimatedMinutes: 18,
    learningObjectives: [
      'Calculate Expectancy (average profit per trade over 100 trades) and Profit Factor using simple everyday dollar numbers.',
      'Understand why a 75% win rate with huge losses bleeds money while a 42% win rate with 1:2.6 wins builds steady wealth.',
      'Track just 6 simple journal fields that take 2 minutes per trade (skipping bloated 40-column spreadsheets).',
      'Run a 20-minute Sunday review to find and fix your #1 most expensive recurring mistake.',
    ],
    prerequisites: [
      'Risk Management, Position Sizing & Trading Psychology',
      'Building an A+ Setup Checklist & Execution Model',
    ],
    terminology: [
      {
        term: 'Expectancy (Average Profit Per Trade)',
        shortCode: 'Expectancy',
        definition:
          'Your average dollar or R result per trade across a large sample: (Win Rate × Average Win) − (Loss Rate × Average Loss).',
        example:
          'Winning 45% for +$250 and losing 55% for -$100: (0.45 × $250) − (0.55 × $100) = $112.50 − $55 = +$57.50 average profit per trade!',
      },
      {
        term: 'Profit Factor (Total Won ÷ Total Lost)',
        shortCode: 'PF',
        definition:
          'All your winning dollars added together divided by all your losing dollars added together. Above 1.5 is healthy; above 2.0 is awesome.',
        example:
          'Winning $3,600 total across winners and losing $1,800 total across losers = 2.00 Profit Factor ($2 earned for every $1 lost).',
      },
      {
        term: 'Rule-Adherence Score (Process %)',
        shortCode: 'Process %',
        definition:
          'The percentage of trades where you faithfully followed your checklist, risk cap, and exit plan — regardless of whether the trade won or lost.',
        example:
          'Following every written rule on 19 out of 20 trades = 95% Process Score.',
      },
      {
        term: 'Maximum Favorable / Adverse Excursion',
        shortCode: 'MFE / MAE',
        definition:
          'How far price moved IN YOUR FAVOR (MFE) versus AGAINST YOU (MAE) before you closed the trade — exposes early exits and oversized stops.',
        example:
          'Seeing 80% of winners reach +$280 MFE while you keep exiting at +$110 proves you are closing winners too soon.',
      },
    ],
    sections: [
      {
        id: 'tj-sec-1',
        heading: 'Why Win Rate Alone Lies — Expectancy Is What Pays You',
        body: 'Beginners obsess over winning 80% or 90% of trades, yet win rate by itself tells you NOTHING unless you also know how big your wins and losses are. Look at two traders on $10,000 accounts risking $100 (1R):',
        bulletPoints: [
          'Trader A (75% Win Rate — LOSES Money!): Wins 75% of trades for tiny +$30 (+0.3R) gains, but moves stops and loses -$150 (-1.5R) on the other 25%. Expectancy = (0.75 × $30) − (0.25 × $150) = $22.50 − $37.50 = -$15 LOST per trade (-$1,500 after 100 trades)!',
          'Trader B (42% Win Rate — MAKES Steady Money!): Wins only 42% of trades for +$260 (+2.6R) gains and caps every loss strictly at -$100 (-1.0R). Expectancy = (0.42 × $260) − (0.58 × $100) = $109.20 − $58.00 = +$51.20 EARNED per trade (+$5,120 after 100 trades)!',
          'The Takeaway: Steady profitability is simply positive Expectancy repeated calmly across 50 to 100 trades.',
        ],
        keyTakeaway:
          'Never judge any strategy by Win Rate alone — always pair Win Rate with Average Win size and Average Loss size.',
      },
      {
        id: 'tj-sec-2',
        heading: 'The Simple 6-Field Journal (Takes 2 Minutes, Never Feels Like Homework)',
        body: 'Monster 40-column spreadsheets get abandoned after four days. Log ONLY the 6 simple details that immediately reveal where money is earned and where it leaks:',
        bulletPoints: [
          '1. Market, Session & Setup Grade (A+ / B / C — e.g., BTC/USDT, AAPL, EUR/USD, or SPX500 — A+).',
          '2. Planned Result vs. Actual Result (e.g., Planned +$300 / +3R; Actual +$120 / +1.2R — catches early panic exits immediately!).',
          '3. Before & After Chart Screenshots (visual proof you can review on Sunday).',
          '4. Emotion & Mistake Tag (Calm, Chased Late, Fearful Early Exit, Bored C-Trade, Revenge).',
          '5. Followed All Rules? (YES or NO — separates proud Good Losses from dangerous Bad Wins).',
          '6. Farthest Profit Reached (MFE) — shows whether your targets are realistic or if you cut winners short.',
        ],
        keyTakeaway:
          'A lean 6-field journal you actually fill out every trade beats a giant spreadsheet you quit after a week.',
      },
      {
        id: 'tj-sec-3',
        heading: 'The 20-Minute Sunday Game-Film Review',
        body: 'No championship sports team skips watching game film — and a journal you never read cannot help you. Every Sunday, spend 20 quiet minutes grouping your last 20–30 trades:',
        bulletPoints: [
          'Check Your "Clean Equity Curve": Add up your profit if you simply deleted every trade tagged with a Mistake (like Chased or Bored C-Trade). Most traders are stunned to see they are ALREADY profitable on their clean A+ trades!',
          'Fix ONE Leak at a Time: Pick your single costliest habit (for instance, closing winners at +1R or trading lunch chop) and make fixing THAT ONE habit next week’s sole focus.',
          'Practice Changes First: Before tweaking a live rule, test the change across 30+ historical trades inside TradeLab’s Backtesting Lab.',
        ],
        keyTakeaway:
          'Your profits grow fastest by deleting your #1 recurring mistake — not by hunting for a secret magic indicator.',
      },
    ],
    diagramConfig: {
      kind: 'trade_management_journal',
      title: 'Trading Journal Audit: Expectancy Math & Clean vs. Mistake Equity Curve',
      subtitle: 'Comparing Planned +3R setups against Mistake-Tagged leaks over a 30-trade sample',
      caption:
        'Logging Planned R vs. Actual R, Rule Adherence, and Mistake Tags reveals how removing just your worst C-grade habits lifts Expectancy into steady positive territory.',
      legend: [
        { label: 'Clean A+ Rule-Following Curve (+Expectancy)', colorToken: '#10b981' },
        { label: 'Planned vs. MFE Target Benchmark', colorToken: '#38bdf8' },
        { label: 'Mistake-Tagged Leak Trades (Cut These!)', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'tj1', label: 'Win % + Payoff', sublabel: '42% × 2.6R = +0.51R EV', tone: 'bullish' },
        { id: 'tj2', label: 'MFE Audit', sublabel: 'Spot Early Exits Instantly', tone: 'liquidity' },
        { id: 'tj3', label: 'Process %', sublabel: 'Reward Good Losses Too', tone: 'neutral' },
        { id: 'tj4', label: 'Cut #1 Leak', sublabel: 'Delete C-Grade / FOMO', tone: 'bearish' },
      ],
      walkthroughSteps: [
        'Log all 6 simple fields right after every trade — including embarrassing mistakes so your data stays honest.',
        'Compute Expectancy and Profit Factor every 20–30 trades (never after 2 random trades).',
        'Run a 20-minute Sunday review to delete your #1 costliest recurring mistake first.',
      ],
    },
    chartScenarioIds: ['jrn-expectancy-review'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Your Trading Journal Is a Free Personal Coach That Never Lies',
        summary:
          'Our brains love remembering lucky wins and forgetting impulsive mistakes. Spending 2 minutes writing down 6 simple notes per trade shows you in black and white which trades pay you and which habits are silently stealing your profits.',
        steps: [
          'Write down your Setup Grade, Planned vs. Actual result, whether you followed rules, and how you felt.',
          'Save a quick screenshot of the chart before and after.',
          'Review your last 20 trades every Sunday for 20 minutes to eliminate your #1 leak.',
        ],
        keyTakeaway:
          'What gets measured gets improved — unjournaled traders repeat the exact same mistake for years.',
        practiceSafeHint:
          'Plug Win Rate, Average Win, and Average Loss into Expectancy = (Win% × Avg Win) − (Loss% × Avg Loss).',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '20-Minute Sunday Journal Review Blueprint',
        summary:
          'Turn raw trade logs into immediate profit improvements every weekend.',
        steps: [
          'Step 1 (By Grade): Compare total profit on A+ setups versus B and C setups.',
          'Step 2 (By Session): Check which market window produces your cleanest Profit Factor.',
          'Step 3 (By Mistake): Total up all dollars lost to Chasing, Early Exits, or Revenge trades.',
          'Step 4 (One Goal): Write ONE rule on a sticky note for next week to close your biggest leak.',
        ],
        keyTakeaway:
          'Simply cutting out your worst 20% of impulsive trades often flips a losing account profitable immediately.',
        practiceSafeHint:
          'Separate rule-following trades from rule-breaking trades before judging your strategy.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Spotting a $2,000 Early-Exit Leak Using MFE Data',
        summary:
          'Suppose over 20 winning trades (risking $100 each), your Planned Target was +$300 (+3R), and your journal’s MFE column shows price actually hit +$290 on 16 of them — yet you got nervous and closed early around +$110 (+1.1R) every time!',
        steps: [
          'Your entry skill is clearly awesome — price went almost +3R in your favor 80% of the time!',
          'Your journal proves the real problem is NOT your strategy — it is fearful early exits costing ~$180 per win.',
          'Switching to a simple hands-off exit plan immediately unlocks thousands in missed profits without changing a single entry rule.',
        ],
        keyTakeaway:
          'Objective MFE data cures fearful early exits far faster than willpower ever could.',
        practiceSafeHint:
          'Compare how far price moved in your favor (MFE) against where you actually exited.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Sunday Game Film for Pro Athletes',
        summary:
          'No championship basketball team skips watching game film. Reviewing your trading journal on Sunday is your game film — it exposes the exact sloppy turnovers costing points so you fix them before Monday’s opening bell.',
        steps: [
          'Live market hours are the game; TradeLab’s Backtesting Lab is team practice.',
          'Your journal is the game film connecting practice to steady live performance.',
        ],
        keyTakeaway:
          'Amateurs guess from memory; pros review game film every Sunday.',
        practiceSafeHint:
          'Treat every logged trade as neutral performance data rather than a personal verdict.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Good Loss vs. Bad Win (Rewarding Process Over Luck)',
        summary:
          'Your journal must praise good discipline even on days a trade hits your stop-loss.',
        steps: [
          'Good Loss: Followed all 5 A+ boxes, capped risk cleanly at -$100 (-1R), accepted it calmly → 100% WIN on discipline!',
          'Bad Win: Broke daily limit, doubled size, widened stop, got lucky for +$200 → DANGEROUS habit that leads straight to a blown account.',
        ],
        keyTakeaway:
          'Grade yourself on Rule Adherence first — steady dollars follow clean process over 30–50 trades.',
        practiceSafeHint:
          'Distinguish a calm rule-following loss from a lucky rule-breaking win.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Journaling Traps That Hide Your Real Edge',
        summary:
          'Make sure your numbers tell the whole truth.',
        steps: [
          'Mistake 1: Logging only your pretty winning trades and "forgetting" embarrassing revenge losses.',
          'Mistake 2: Calling a strategy "broken" after just 4 trades instead of evaluating 30+ trades.',
          'Mistake 3: Writing down trades diligently for months yet never doing a Sunday review to act on what you found.',
        ],
        keyTakeaway:
          'Brutal honesty in logging + a 20-minute Sunday review turns average traders into steady pros.',
        practiceSafeHint:
          'Verify complete logging (including mistakes) and a 30+ trade sample before changing rules.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-tj-1',
        lessonSlug: 'trading-journal-expectancy',
        conceptKey: 'trading-journal-expectancy',
        prompt:
          'Trader A wins 75% of trades averaging +$40 (+0.4R) per win, but widens stops and averages -$200 (-2.0R) per loss. What is Trader A’s Expectancy per trade?',
        options: [
          { id: 'a', label: 'Positive (+$30 / +0.30R per trade) because 75% is a high win rate' },
          { id: 'b', label: 'Negative (-$20 / -0.20R per trade): (0.75 × $40) − (0.25 × $200) = $30 − $50 = -$20 lost per trade' },
          { id: 'c', label: 'Exactly breakeven ($0)' },
          { id: 'd', label: 'Positive (+$160 / +1.60R per trade)' },
        ],
        correctOptionId: 'b',
        hints: [
          'Plug the numbers into Expectancy = (Win Rate × Avg Win) − (Loss Rate × Avg Loss).',
        ],
        postSubmissionRationale:
          '(0.75 × $40) − (0.25 × $200) = $30 − $50 = -$20 (-0.20R) lost per trade on average! Even a 75% win rate steadily drains an account when losses are 5x bigger than wins.',
        commonTrapNote:
          'High win-rate systems that widen stop-losses hide ticking time bombs inside their Expectancy math.',
      },
      {
        id: 'pq-tj-2',
        lessonSlug: 'trading-journal-expectancy',
        conceptKey: 'trading-journal-expectancy',
        prompt:
          'In your trading journal, what exactly is a "Bad Win"?',
        options: [
          { id: 'a', label: 'Any winning trade smaller than +$500' },
          { id: 'b', label: 'A trade that happened to make money even though you broke your written rules (like widening your stop or revenge trading)' },
          { id: 'c', label: 'A clean winning trade taken during London Killzone' },
          { id: 'd', label: 'A trade that hit your planned +3R take-profit cleanly' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about what happens to your brain when breaking rules accidentally gets rewarded with cash.',
        ],
        postSubmissionRationale:
          'A Bad Win rewards reckless rule-breaking with short-term lucky cash, training bad habits that eventually trigger a massive loss.',
        commonTrapNote:
          'Never celebrate lucky rule-breaking wins — tag them honestly as mistakes in your journal.',
      },
      {
        id: 'pq-tj-3',
        lessonSlug: 'trading-journal-expectancy',
        conceptKey: 'trading-journal-expectancy',
        scenarioId: 'jrn-expectancy-review',
        prompt:
          'Your journal shows 80% of your winning setups reach +2.8R Maximum Favorable Excursion (+$280 on $100 risk), yet you actually close them at an average of just +1.1R (+$110). What does this prove?',
        options: [
          { id: 'a', label: 'Your entry strategy is totally broken and needs to be thrown away' },
          { id: 'b', label: 'Your entries are great, but nervous early exits are cutting your winners way too short' },
          { id: 'c', label: 'You should risk 5% ($500) per trade to compensate' },
          { id: 'd', label: 'You should stop tracking Maximum Favorable Excursion' },
        ],
        correctOptionId: 'b',
        hints: [
          'Compare how far price actually ran in your favor (+$280) against where you cashed out (+$110).',
        ],
        postSubmissionRationale:
          'High Maximum Favorable Excursion paired with small realized profits pinpoints an exit-discipline leak — keep your strong entries and stop closing winners early out of fear!',
        commonTrapNote:
          'Without MFE data, beginners blame their entry strategy when the real leak is panicking out of winners early.',
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
      'Learn why protecting your account during cold streaks is the real secret to long-term trading success — using simple loss limits, half-risk throttling, and calm scaling.',
    plainEnglishSummary:
      'Every single winning trader on Earth hits cold streaks — called Drawdowns — where 4 or 5 good setups lose in a row. Beginners panic during a cold streak, double their bet size trying to win it back fast (called Emotional Tilt), and blow up their account. Professionals do the exact opposite: they set hard daily/weekly stop limits, automatically cut their risk in HALF when down 4%, climb smoothly back to new highs, and only grow trade size in small, calm steps.',
    beginnerFaq: [
      {
        question: 'What is a "Drawdown" and why is a -50% loss way worse than it sounds?',
        answer:
          'Drawdown is simply how far your account has dipped below its highest balance. Here is the brutal math: if your $10,000 account drops 10% to $9,000, you only need an +11.1% gain to get back to $10,000. But if reckless betting drops your $10,000 account 50% down to $5,000, you now need a massive +100% gain (doubling your money!) just to get back to $0 profit!',
      },
      {
        question: 'What does "Risk Throttling" (Half-Risk) mean in real dollars?',
        answer:
          'Imagine you normally risk 1% ($100) per trade on a $10,000 account. If a tough week puts you down -4% ($9,600), Risk Throttling automatically cuts your bet size in HALF to 0.5% ($50 per trade) until you bounce back. Even if you lose 4 more times in a row, you only dip another -2% instead of crashing!',
      },
      {
        question: 'What is "Emotional Tilt" and how do I catch myself BEFORE I wreck my account?',
        answer:
          'Tilt is that hot, frustrated fight-or-flight feeling right after a painful loss or missed trade when your brain whispers "Just one big trade to get my money back!" Physical clues include tight shoulders, fast breathing, and clicking 1-minute charts impulsively. The instant you feel it, close the app and walk away for 24 hours!',
      },
      {
        question: 'When is it actually safe to increase my risk or account size?',
        answer:
          'Wait until your journal proves at least 30 to 50 consistent trades with 90%+ rule-following AND a brand-new account high — then step up gently by 25%–50% (for example, from $100 risk to $125 or $150, NEVER jumping overnight from $100 to $1,000!).',
      },
    ],
    level: 'advanced',
    marketCategory: 'general',
    learningStage: 'steady_profitability',
    moduleOrder: 15,
    conceptKey: 'drawdown-scaling-consistency',
    estimatedMinutes: 20,
    learningObjectives: [
      'Understand Drawdown Recovery Asymmetry (why a -50% hole takes a brutal +100% climb just to break even).',
      'Install automatic safety limits: -2R daily cap, -4R weekly cap, and Half-Risk Throttling at -4% drawdown.',
      'Catch early physical signs of Emotional Tilt and trigger an automatic cooldown break before revenge trading starts.',
      'Scale trade risk and capital slowly in 25%–50% steps backed by 30–50+ disciplined trades.',
    ],
    prerequisites: [
      'Risk Management, Position Sizing & Trading Psychology',
      'Trading Journal, Backtest Data & Positive Expectancy',
    ],
    terminology: [
      {
        term: 'Drawdown (Peak-to-Dip Decline)',
        shortCode: 'Drawdown',
        definition:
          'How far your account balance has dropped from its highest recent peak during a normal losing streak.',
        example:
          'A $10,000 account dipping to $9,600 is in a manageable 4% ($400) drawdown.',
      },
      {
        term: 'Recovery Asymmetry (Why Deep Holes Hurt)',
        shortCode: 'Recovery Math',
        definition:
          'The mathematical fact that deeper percentage losses require MUCH larger percentage gains just to return to breakeven.',
        example:
          'Losing 5% needs just +5.3% to recover; losing 50% ($10,000 → $5,000) needs a brutal +100% gain just to get back to $10,000!',
      },
      {
        term: 'Risk Throttling (Automatic Half-Risk)',
        shortCode: 'Half-Risk',
        definition:
          'Automatically shrinking your risk per trade in half (for example, from 1% / $100 down to 0.5% / $50) whenever drawdown hits -4% until equity recovers.',
        example:
          'Dropping from $100 risk to $50 risk at $9,600 turns a scary losing streak into a mild speed bump.',
      },
      {
        term: 'Emotional Tilt (Revenge-Trading Spiral)',
        shortCode: 'Tilt',
        definition:
          'An angry or panicked mental state after losses that hijacks logic and pushes you to double bet sizes and break every written rule.',
        example:
          'Feeling heat in your chest after two stops and firing off five random 1-minute trades trying to erase the red day.',
      },
    ],
    sections: [
      {
        id: 'dd-sec-1',
        heading: 'The Brutal Math of Deep Holes (Keep Drawdowns Shallow!)',
        body: 'Even a strong profitable strategy will inevitably run into 4 or 5 normal losses in a row a few times every year. Look at what happens on a $10,000 account depending on how big you let a drawdown grow:',
        bulletPoints: [
          '-5% Drawdown ($10,000 → $9,500): Needs only +5.3% to recover — calm, routine, zero stress.',
          '-10% Drawdown ($10,000 → $9,000): Needs +11.1% to recover — totally manageable with steady rules.',
          '-25% Drawdown ($10,000 → $7,500): Needs +33.3% to recover — starts weighing heavily on emotions.',
          '-50% Drawdown ($10,000 → $5,000): Needs a crushing +100% gain (doubling the entire account!) just to break even!',
        ],
        keyTakeaway:
          'Protect your downside fiercely so every cold streak stays small, calm, and easy to climb out of.',
      },
      {
        id: 'dd-sec-2',
        heading: 'The 4-Step Anti-Tilt & Drawdown Protection Protocol',
        body: 'Never wait until you are angry and down $500 to invent a safety plan. Bolt these four automatic guardrails onto your $10,000 account TODAY:',
        bulletPoints: [
          'Guardrail 1 — Hard Daily & Weekly Stops: Stop trading for the day at -2R (-$200); stop for the week at -4R (-$400). One bad morning can NEVER wreck your whole month!',
          'Guardrail 2 — Automatic Half-Risk Throttle: At -4% drawdown ($9,600), automatically cut risk in HALF from 1% ($100) to 0.5% ($50) and take ONLY 5/5 A+ setups.',
          'Guardrail 3 — Audit Process vs. Luck: Check your last 10 journal entries. Did you follow all rules (normal bad luck — keep trading calmly at half risk) or did you break rules on Tilt (close live trading for 48 hours and reset inside TradeLab’s Backtesting Lab)?',
          'Guardrail 4 — Step Back Up Calmly: Return to full 1% ($100) risk ONLY after climbing at least halfway out of the drawdown with 90%+ rule adherence.',
        ],
        keyTakeaway:
          'Pros SHRINK bet size during cold streaks — amateurs DOUBLE bet size and blow up.',
      },
      {
        id: 'dd-sec-3',
        heading: 'Scaling Up Smoothly for Lifetime Compounding',
        body: 'Once your journal proves steady positive Expectancy across 50+ disciplined trades, grow your risk gently so bigger dollar numbers never spook you into nervous mistakes:',
        bulletPoints: [
          'Grow in Modest 25%–50% Steps: Only increase risk (say from $100 to $125 or $150) AFTER reaching a brand-new account peak with 90%+ Rule Adherence across 30–50+ trades.',
          'Think in Percentages & R-Multiples, Not Dollars: When you view trades as "Risk 1R to make +3R" instead of staring at big dollar swings, trading $500 risk feels just as calm as $50 risk.',
          'Respect Boring Compounding: Earning a calm, repeatable +3% to +5% per month without giant drawdowns quietly builds life-changing skill and capital — ignore fake social media overnight lottery tickets!',
        ],
        keyTakeaway:
          'Steady, boring, rule-driven compounding beats flashy boom-and-bust gambling every single decade.',
      },
    ],
    diagramConfig: {
      kind: 'trade_management_journal',
      title: 'Drawdown Safety Curve: Half-Risk Throttling vs. Revenge-Trading Spiral',
      subtitle: 'How automatic -2R/-4R caps and 0.5x risk throttling turn cold streaks into smooth recoveries',
      caption:
        'Left/Top curve: Cutting risk in half at -4% drawdown flattens the dip so just two clean +3R winners recover equity calmly. Bottom dashed curve: Doubling risk on Tilt triggers deep unrecoverable holes.',
      legend: [
        { label: 'Disciplined Curve (0.5x Throttle + Steady Scaling)', colorToken: '#10b981' },
        { label: 'Half-Risk Protection Zone (-4% Trigger)', colorToken: '#38bdf8' },
        { label: 'Revenge-Tilt Spiral (Doubling Risk)', colorToken: '#ef4444' },
      ],
      annotations: [
        { id: 'dd1', label: '-2R / -4R Caps', sublabel: 'Stop Spiral Days Cold', tone: 'bearish' },
        { id: 'dd2', label: '0.5x Throttle', sublabel: 'Cut $100 → $50 at -4%', tone: 'liquidity' },
        { id: 'dd3', label: 'Calm Recovery', sublabel: 'Two +3R Wins Rebuild', tone: 'bullish' },
        { id: 'dd4', label: '25%–50% Scale', sublabel: 'Grow Only at New Highs', tone: 'neutral' },
      ],
      walkthroughSteps: [
        'Lock in hard -2R daily and -4R weekly loss limits before the trading week begins.',
        'At -4% drawdown, automatically cut trade risk in half (1% → 0.5%) and restrict yourself strictly to 5/5 A+ setups.',
        'Scale risk upward in small 25%–50% increments ONLY after 30–50+ clean trades and new equity highs.',
      ],
    },
    chartScenarioIds: ['dd-recovery-curve'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Slow Down in a Rainstorm, Speed Up Only on Clear Highways',
        summary:
          'When you hit a losing streak (a Drawdown), amateurs slam the gas pedal and double their bets — crashing the car. Pros ease off the gas by cutting their trade size in half until the storm clears, then climb calmly back to brand-new highs.',
        steps: [
          'Set hard stops before Monday: max -2R (-$200) per day, max -4R (-$400) per week on $10,000.',
          'If your balance dips -4% ($9,600), cut risk per trade in half ($100 → $50) until you bounce back.',
          'Grow trade size gradually in small 25%–50% steps — never 10x overnight!',
        ],
        keyTakeaway:
          'Protecting your balance during rough weeks is how you stay alive for the amazing weeks.',
        practiceSafeHint:
          'Remember how steeply recovery percentage climbs as drawdowns get deeper — and why cutting size flattens the dip.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Step Cold-Streak Recovery Plan',
        summary:
          'Follow these exact four steps the next time a normal losing streak arrives.',
        steps: [
          'Step 1 (Hit -4% or -4R): Close live trading for 24 hours to let frustration fade.',
          'Step 2 (Journal Audit): Check whether losses were calm rule-following trades or emotional Tilt mistakes.',
          'Step 3 (Half-Risk Mode): Resume at 0.5% ($50) risk strictly on 5/5 A+ setups.',
          'Step 4 (Restore Full Size): Return to 1% ($100) only after recovering half the dip cleanly.',
        ],
        keyTakeaway:
          'Having a written drawdown plan removes panic before a cold streak ever shows up.',
        practiceSafeHint:
          'Apply half-risk throttling and honest auditing instead of increasing risk during a slump.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'How Two Clean +3R Trades Erase a -4% Cold Streak Calmly',
        summary:
          'Suppose a rough week puts your $10,000 account down -4% to $9,600 (-$400). You switch to Half-Risk ($50 per trade) and take ONLY textbook 5/5 A+ setups offering 1:3 reward (+$150 each).',
        steps: [
          'At $50 risk, even another normal loss only moves you from $9,600 to $9,550 — zero panic!',
          'Just two calm +3R winners add +$150 + +$150 = +$300, lifting you straight back to $9,900 with total confidence.',
          'Compare that calm climb against someone who doubled risk to $200–$400 on Tilt and fell to $7,000.',
        ],
        keyTakeaway:
          'Asymmetric 1:3 setups make shallow drawdowns surprisingly easy to erase when you stay off Tilt.',
        practiceSafeHint:
          'Compare how fast a -4% dip recovers versus a reckless -40% tilt hole.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'Mountain Climbers Clipping Into Safety Anchors',
        summary:
          'Rock climbers clip into safety ropes every few feet so a slip drops them 2 feet — not 2,000 feet down the cliff. Your -2R daily cap and Half-Risk throttle are your climbing anchors.',
        steps: [
          'Slips (losing trades) happen to every single climber.',
          'Safety anchors turn scary slips into tiny pauses so you keep climbing steadily to the summit.',
        ],
        keyTakeaway:
          'You never fall off the mountain when your risk anchors stay clipped in.',
        practiceSafeHint:
          'Identify which rule acts as a protective anchor during a losing streak.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Calm Pro Response vs. Emotional Tilt Spiral',
        summary:
          'Two traders both start the week down -$300 (-3R) on $10,000 — watch where they finish Friday:',
        steps: [
          'Pro Response: Respects -$200 daily stop, drops to $50 Half-Risk, catches one clean +3R (+$150) trade Thursday → finishes week down just -$150, calm and sharp.',
          'Tilt Spiral: Doubles size to $200–$400 trying to "make it back today," clicks random lunch trades → finishes Friday at -$1,800 (-18%) and exhausted.',
        ],
        keyTakeaway:
          'A normal losing trade almost never ruins a trader — the emotional reaction right after it does.',
        practiceSafeHint:
          'Contrast automatic risk reduction against revenge-driven size increases.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Drawdown & Scaling Mistakes That Reset Months of Progress',
        summary:
          'Protect your hard work by dodging these three traps.',
        steps: [
          'Mistake 1: Doubling bet size during a cold streak thinking "one big win gets me right back to even."',
          'Mistake 2: Jumping from $50 risk to $500 risk after one lucky hot week, causing nervous panic exits.',
          'Mistake 3: Comparing your steady +4%/month growth against fake social media jackpot screenshots.',
        ],
        keyTakeaway:
          'Throttle down automatically when cold, scale slowly when proven, and run your own calm race.',
        practiceSafeHint:
          'Ensure scaling decisions wait for 30–50+ clean trades and modest 25%–50% increments.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-dd-1',
        lessonSlug: 'drawdown-scaling-consistency',
        conceptKey: 'drawdown-scaling-consistency',
        prompt:
          'If reckless over-betting drops a $10,000 account by -50% down to $5,000, what percentage gain is needed on the remaining $5,000 just to get back to $10,000 (breakeven)?',
        options: [
          { id: 'a', label: '+50%' },
          { id: 'b', label: '+100% (you must double the remaining $5,000 just to get back to $0 net profit!)' },
          { id: 'c', label: '+25%' },
          { id: 'd', label: '+55%' },
        ],
        correctOptionId: 'b',
        hints: [
          'You have $5,000 left and need to earn another +$5,000 to reach $10,000 again — what percent of $5,000 is $5,000?',
        ],
        postSubmissionRationale:
          'Earning +$5,000 on a $5,000 remaining balance is a brutal +100% return just to break even. Keeping drawdowns small (-4% to -6%) makes bouncing back calm and effortless.',
        commonTrapNote:
          'Forgetting recovery math leads beginners to tolerate giant drawdowns that are nearly impossible to climb out of.',
      },
      {
        id: 'pq-dd-2',
        lessonSlug: 'drawdown-scaling-consistency',
        conceptKey: 'drawdown-scaling-consistency',
        prompt:
          'Your $10,000 account dips -4% ($9,600) during a rough week. What is the disciplined Risk Throttling response?',
        options: [
          { id: 'a', label: 'Double risk from $100 (1%) to $200 (2%) so you recover twice as fast' },
          { id: 'b', label: 'Audit your journal, cut risk per trade in HALF ($100 → $50), and trade strictly 5/5 A+ setups until recovering' },
          { id: 'c', label: 'Delete your whole playbook and buy a random paid indicator' },
          { id: 'd', label: 'Take 20 tiny random scalps a day to stay busy' },
        ],
        correctOptionId: 'b',
        hints: [
          'Remember the rainstorm analogy: do you slam the gas or ease off the throttle during rough weather?',
        ],
        postSubmissionRationale:
          'Cutting risk in half flattens the losing streak, keeps stress low, and gives your positive Expectancy plenty of breathing room to recover cleanly on A+ trades.',
        commonTrapNote:
          'Increasing size while frustrated on Tilt turns a tiny -4% dip into a catastrophic blown account.',
      },
      {
        id: 'pq-dd-3',
        lessonSlug: 'drawdown-scaling-consistency',
        conceptKey: 'drawdown-scaling-consistency',
        scenarioId: 'dd-recovery-curve',
        prompt:
          'When is the safest, smartest time to scale up your trade risk or funded account size?',
        options: [
          { id: 'a', label: 'Immediately after winning 2 lucky trades in a row' },
          { id: 'b', label: 'In modest 25%–50% steps ONLY after hitting new account highs across 30–50+ trades with 90%+ rule adherence' },
          { id: 'c', label: 'Right in the middle of a -6% drawdown to win it back faster' },
          { id: 'd', label: 'Jump 10x in size overnight as soon as you feel excited' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how small, milestone-based increases let your comfort zone grow smoothly alongside your math.',
        ],
        postSubmissionRationale:
          'Modest 25%–50% scaling steps earned through 30–50+ disciplined trades and new account highs allow your nervous system to adjust calmly to larger dollar amounts.',
        commonTrapNote:
          'Leaping 5x–10x in dollar risk overnight triggers fear-driven early exits and rule-breaking.',
      },
    ],
  },
];
