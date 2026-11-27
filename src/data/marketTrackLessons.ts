import type { Lesson } from '../types/academy';

/**
 * Balanced curriculum additions:
 * - Lesson 01: Chart Reading Fundamentals (Universal Core start-from-zero lesson)
 * - Dedicated beginner & intermediate lessons for Crypto, Forex, Stocks, and Indices
 *   so every market track has exactly 3 focused modules alongside the 15-lesson Universal Core.
 */
export const MARKET_TRACK_LESSONS: Lesson[] = [
  // =========================================================================
  // MODULE 01: Chart Reading Fundamentals (Universal Core)
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000019',
    slug: 'chart-reading-fundamentals',
    title: 'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
    subtitle:
      'Start from absolute zero: learn what 5m, 15m, 1H, 4H, and 1D timeframes mean, read Time vs. Price axes, and master the core tools on every trading platform.',
    plainEnglishSummary:
      'Before reading candlesticks or placing a single trade on Crypto, Stocks, Forex, or Indices, you need to understand the screen in front of you. Every chart is a simple map: the bottom edge (X-axis) shows Time moving left to right, and the right edge (Y-axis) shows Price moving up and down. Switching timeframes like 5m, 15m, 1H, 4H, or 1D simply changes how much time fits inside one single candle.',
    beginnerFaq: [
      {
        question: 'What do 5m, 15m, 1H, 4H, and 1D actually mean on a chart?',
        answer:
          'They tell you the exact amount of time inside ONE single candle. On a 5m (5-minute) chart, each candle shows 5 minutes of trading. On a 15m chart, each candle shows 15 minutes. On a 1H (1-hour) chart, each candle shows 1 full hour — which is equal to twelve 5m candles or four 15m candles combined. On 4H each candle is 4 hours, and on 1D each candle is 1 full trading day.',
      },
      {
        question: 'What is the difference between the X-axis and the Y-axis?',
        answer:
          'The X-axis runs horizontally along the bottom and shows Time (minutes, hours, days, or dates). The Y-axis runs vertically along the right edge and shows Price (for example, $68,500 on BTC, $210.50 on AAPL, 1.0850 on EUR/USD, or 5,450 on SPX500).',
      },
      {
        question: 'Why does the Candle Countdown Timer matter so much?',
        answer:
          'The countdown timer beside the current price tells you how many minutes and seconds remain before the live candle locks in forever. A candle can jump up and down wildly while it is still open — waiting for the timer to reach 00:00 stops you from reacting to fake moves.',
      },
      {
        question: 'Do these chart controls work the same on Crypto, Stocks, Forex, and Indices?',
        answer:
          'Yes! Whether you open TradingView, a stock broker, a crypto exchange, or a Forex/Indices platform, the Timeframe Switcher, X/Y Axes, Volume Bars, Bid/Ask price line, Crosshair, Watchlist, and Drawing Tools work the exact same way.',
      },
    ],
    level: 'beginner',
    marketCategory: 'general',
    learningStage: 'foundations',
    moduleOrder: 1,
    conceptKey: 'chart-reading-fundamentals',
    estimatedMinutes: 14,
    learningObjectives: [
      'Read the X-axis (Bottom = Time) and Y-axis (Right = Price) effortlessly on any asset chart.',
      'Explain exactly what 1m, 5m, 15m, 1H, 4H, 1D, and 1W timeframes mean and how smaller candles combine into bigger ones.',
      'Check essential chart tools before trading: Timeframe Switcher, Candle Countdown Timer, Volume Bars, and Bid/Ask Spread Line.',
      'Use the Crosshair, Zoom, Watchlist, and 3 core drawing tools (Horizontal Line, Ruler, Long/Short Position Tool) cleanly.',
    ],
    prerequisites: ['Zero prior trading experience required — start right here.'],
    terminology: [
      {
        term: 'X-Axis (Time) & Y-Axis (Price)',
        shortCode: 'X / Y Axes',
        definition:
          'The two borders of every chart: the horizontal bottom X-axis tracks Time from past (left) to present (right), and the vertical right Y-axis tracks Price from low (bottom) to high (top).',
        example:
          'Hovering over a candle shows 10:30 AM on the bottom X-axis and $214.80 on the right Y-axis.',
      },
      {
        term: 'Timeframe (Candle Duration)',
        shortCode: 'TF (5m / 15m / 1H / 4H / 1D)',
        definition:
          'The fixed length of time represented by one single candle. Higher timeframes (1H, 4H, 1D, 1W) show the big picture; lower timeframes (1m, 5m, 15m) zoom into fine details.',
        example:
          'Twelve 5m candles equal one 1H candle; four 15m candles equal one 1H candle; six 4H candles equal one 24-hour Crypto 1D candle.',
      },
      {
        term: 'Candle Countdown Timer & Volume Bars',
        shortCode: 'Timer / Vol',
        definition:
          'The timer shows how long until the active candle closes; the vertical Volume bars at the bottom measure how many shares, coins, or contracts traded during that exact candle.',
        example:
          'A breakout candle with 00:00 left and a tall volume spike shows real participation, not a thin mid-candle blip.',
      },
      {
        term: 'Bid / Ask Spread & Position Tool',
        shortCode: 'Spread / R:R Tool',
        definition:
          'Bid is the highest price buyers will pay right now, Ask is the lowest price sellers will accept, and the gap between them is the Spread. The Long/Short Position Tool plots your Entry, SL (Stop Loss), and TP (Take Profit) before you click buy or sell.',
        example:
          'Before buying AAPL at $200.00, you drag the Long Position Tool to set SL (Stop Loss) at $198.00 and TP (Take Profit) at $206.00 (1:3 reward-to-risk).',
      },
    ],
    sections: [
      {
        id: 'crf-axes-and-price',
        heading: '1. Reading the Chart Map: X-Axis (Time) vs. Y-Axis (Price)',
        body: 'A trading chart is simply a live graph of what buyers and sellers agreed to pay over time. Read it left to right like a book — the far right edge is always "right now."',
        bulletPoints: [
          'Bottom X-Axis = Time: Moving left shows older history; the newest candle always prints on the far right.',
          'Right Y-Axis = Price: Higher on the screen means a higher price; lower means a cheaper price. Works identically for BTC, AAPL, EUR/USD, and SPX500.',
          'Current Price & Bid/Ask Line: The highlighted tag on the right edge shows the live price, plus the thin Bid/Ask spread gap you pay when entering a market order.',
          'Crosshair & Zoom: Move your mouse to align any candle with its exact time and price, and scroll or pinch to zoom out so you see 50–100 candles at once.',
        ],
        keyTakeaway:
          'Always zoom out enough to see clear context — never stare at 10 giant candles zoomed all the way in.',
      },
      {
        id: 'crf-timeframes-explained',
        heading: '2. Understanding Timeframes: 1m, 5m, 15m, 1H, 4H, 1D & 1W',
        body: 'The Timeframe Switcher (top toolbar on almost every platform) does not change the asset or its price — it only changes how much time is packed into each single candle.',
        bulletPoints: [
          '1m & 5m (Fast Intraday): 1 candle = 1 minute or 5 minutes. Very fast and noisy — best used only after you learn higher timeframes.',
          '15m (Beginner Sweet Spot for Intraday): 1 candle = 15 minutes. Four 15m candles build one 1H candle.',
          '1H & 4H (Swing & Direction Maps): 1 candle = 1 hour or 4 hours. Twelve 5m candles fit inside one 1H candle — clean trend visibility with far less noise.',
          '1D & 1W (Big Picture): 1 candle = 1 full day or 1 full week. Institutions plan major levels here first.',
        ],
        keyTakeaway:
          'Higher timeframes (1D, 4H, 1H) show the main road; lower timeframes (15m, 5m) zoom in on the street corners.',
      },
      {
        id: 'crf-essential-tools',
        heading: '3. Essential Chart Tools to Check Before Any Trade',
        body: 'You do not need 20 glowing indicators cluttering your screen. Professionals check a tiny handful of clean native chart tools every session.',
        bulletPoints: [
          'Candle Countdown Timer: Wait for the clock to hit 00:00 before trusting a breakout or reversal candle.',
          'Volume Bars (Bottom Pane): Tall bars confirm heavy buying or selling conviction; flat tiny bars warn of sleepy, choppy markets.',
          'Watchlist (Right Sidebar): Keep 3–6 liquid instruments organized by market (e.g., BTC/USDT, AAPL, EUR/USD, SPX500) so you never chase random tickers.',
          '3 Core Drawing Tools: Horizontal Line (mark obvious highs/lows), Ruler / Measure Tool (check % or point distance), and Long/Short Position Tool (visualize Entry, SL (Stop Loss), and TP (Take Profit)).',
        ],
        keyTakeaway:
          'Clean charts beat cluttered charts: Timeframe, Timer, Volume, Bid/Ask Spread, and 3 basic drawing tools cover 95% of your needs.',
      },
    ],
    diagramConfig: {
      kind: 'chart_fundamentals',
      title: 'Chart Workspace Blueprint: Timeframes, Axes & Core Tools',
      subtitle: 'Step-by-step tour of the exact controls you check before taking any trade',
      caption:
        'Every market platform shares the same layout: Timeframe toolbar on top, Price on the right Y-axis, Time on the bottom X-axis, Volume underneath, and Watchlist + Drawing Tools on the sides.',
      legend: [
        { label: 'Timeframe & Timer', colorToken: 'emerald' },
        { label: 'X-Axis Time / Y-Axis Price', colorToken: 'amber' },
        { label: 'Volume & Bid/Ask Spread', colorToken: 'cyan' },
        { label: 'Drawing & Risk Tools', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'crf-a1',
          label: 'Timeframe Switcher',
          sublabel: '5m · 15m · 1H · 4H · 1D',
          tone: 'bullish',
        },
        {
          id: 'crf-a2',
          label: 'Y-Axis Price & Timer',
          sublabel: 'Live Price + Bid/Ask + 00:00 Clock',
          tone: 'liquidity',
        },
        {
          id: 'crf-a3',
          label: 'X-Axis Time & Volume',
          sublabel: 'Left = Past, Right = Now + Vol Bars',
          tone: 'neutral',
        },
        {
          id: 'crf-a4',
          label: 'Watchlist & 3 Tools',
          sublabel: 'H-Line · Ruler · SL/TP Position Box',
          tone: 'bearish',
        },
      ],
      walkthroughSteps: [
        'Top Bar (Timeframe Switcher): Pick 1H or 4H for big-picture direction, then 15m or 5m to zoom in — each candle equals that exact time slice.',
        'Right Edge (Y-Axis Price + Countdown Timer): Track the live price tag, Bid/Ask spread gap, and countdown clock before trusting any candle.',
        'Bottom Edge (X-Axis Time + Volume Bars): Read time moving left to right and check tall Volume bars for genuine buyer or seller energy.',
        'Left & Right Panels (Drawing Tools + Watchlist): Use Horizontal Line, Ruler, and the Long/Short Position Tool across your Crypto, Stock, Forex, and Index watchlist.',
      ],
    },
    chartScenarioIds: ['ca-green-red-candles'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Your Chart Is Just a Simple Google Map for Price',
        summary:
          'Bottom shows When (Time), right side shows How Much (Price), and Timeframes (5m, 15m, 1H, 4H, 1D) are just your zoom buttons.',
        steps: [
          'Check the Timeframe button first so you know whether each candle is 5 minutes, 15 minutes, 1 hour, or 1 day.',
          'Read the bottom X-axis for Time and the right Y-axis for Price.',
          'Watch the Candle Countdown Timer and Volume bars before deciding anything.',
        ],
        keyTakeaway:
          'Master the chart controls first — then every lesson on candles, trends, and entries becomes 10× easier.',
        practiceSafeHint:
          'Always check which timeframe is active before judging how big a price move looks.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '60-Second Pre-Chart Inspection Routine',
        summary:
          'Run these four quick visual checks every time you open any market chart.',
        steps: [
          '1. Pick your asset from the Watchlist (BTC, AAPL, EUR/USD, or SPX500).',
          '2. Set the Timeframe Switcher (start on 1D or 1H, then step down to 15m or 5m).',
          '3. Check the right Y-axis for the live Bid/Ask spread and Candle Countdown Timer.',
          '4. Glance at the bottom Volume bars and draw key levels with a clean Horizontal Line.',
        ],
        keyTakeaway:
          'A consistent 4-step chart scan removes beginner overwhelm on day one.',
        practiceSafeHint:
          'Notice how 12 candles on a 5m chart combine into a single 1H candle.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'How 5m, 15m, and 1H Candles Tell the Same Story on BTC/USD',
        summary:
          'Between 9:00 AM and 10:00 AM, Bitcoin moves from $64,000 to $64,600. Every timeframe shows that exact same move at different zoom levels.',
        steps: [
          'On 1H: You see 1 single green candle representing the entire hour.',
          'On 15m: You see 4 separate candles (9:00, 9:15, 9:30, 9:45).',
          'On 5m: You see 12 separate candles showing every mini pullback along the way.',
        ],
        keyTakeaway:
          'Changing timeframes never changes the market — it only zooms your camera in or out.',
        practiceSafeHint:
          'Count how many 5m or 15m candles make up one full 1H candle.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Drone Camera Zoom Analogy',
        summary:
          'A 1D chart is a drone flying high over the whole city; a 1H chart hovers over the neighborhood; a 5m chart hovers right over one intersection.',
        steps: [
          'If you only stare at the 5m intersection, you miss the traffic jam one block away on the 1H map.',
          'Volume bars are the sound level of the crowd — loud volume means real action.',
          'The Ruler and Position Tool are your tape measure before stepping into the road.',
        ],
        keyTakeaway:
          'Always check the higher-altitude map (1H/4H/1D) before zooming into 5m or 15m.',
        practiceSafeHint:
          'Think about how zooming out reveals levels invisible on a 1-minute view.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Lower Timeframes (1m / 5m / 15m) vs. Higher Timeframes (1H / 4H / 1D)',
        summary:
          'Choosing the right timeframe prevents stress and false signals.',
        steps: [
          'Lower Timeframes (1m–15m): Fast updates, tighter stops, but lots of noisy wiggles.',
          'Higher Timeframes (1H–1D): Slower candles, clearer trends, and stronger institutional levels.',
          'Best beginner combo: Check 1H or 4H for direction, and practice reading candles on 15m.',
        ],
        keyTakeaway:
          'Slow down your timeframe when learning — 15m and 1H beat frantic 1m charts.',
        practiceSafeHint:
          'Compare how calm a 1H trend looks compared to dozens of back-and-forth 1m candles.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Classic Beginner Chart Setup Mistakes',
        summary:
          'Avoid these common early traps when opening a charting platform.',
        steps: [
          'Mistake 1: Living on the 1-minute chart and getting whipsawed by random noise.',
          'Mistake 2: Ignoring the Bid/Ask spread and entering when spreads are abnormally wide.',
          'Mistake 3: Stacking 10 colorful indicators on top of price until you can barely see the candles.',
        ],
        keyTakeaway:
          'Keep your screen clean: price candles, volume, and clear levels always come first.',
        practiceSafeHint:
          'Check the countdown timer and spread before assuming a breakout has finished.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-crf-1',
        lessonSlug: 'chart-reading-fundamentals',
        conceptKey: 'chart-reading-fundamentals',
        scenarioId: 'ca-green-red-candles',
        prompt:
          'How many 5-minute (5m) candles combine to form exactly one 1-hour (1H) candle?',
        options: [
          { id: 'a', label: '4 candles' },
          { id: 'b', label: '12 candles (60 minutes ÷ 5 minutes)' },
          { id: 'c', label: '24 candles' },
          { id: 'd', label: '60 candles' },
        ],
        correctOptionId: 'b',
        hints: [
          'There are 60 minutes in 1 hour — divide 60 by 5 minutes per candle.',
        ],
        postSubmissionRationale:
          'One hour contains 60 minutes, so twelve 5m candles (12 × 5 = 60) combine into one 1H candle. Similarly, four 15m candles (4 × 15 = 60) form one 1H candle.',
        commonTrapNote:
          'Confusing timeframe math makes beginners misread how fast a candle actually closes.',
      },
      {
        id: 'pq-crf-2',
        lessonSlug: 'chart-reading-fundamentals',
        conceptKey: 'chart-reading-fundamentals',
        prompt:
          'On any standard trading chart (Crypto, Stocks, Forex, or Indices), what do the bottom X-axis and right Y-axis display?',
        options: [
          { id: 'a', label: 'X-axis (Bottom) = Price; Y-axis (Right) = Time' },
          { id: 'b', label: 'X-axis (Bottom) = Time; Y-axis (Right) = Price' },
          { id: 'c', label: 'X-axis (Bottom) = Volume; Y-axis (Right) = Profit' },
          { id: 'd', label: 'Both axes change depending on whether you trade Crypto or Stocks' },
        ],
        correctOptionId: 'b',
        hints: [
          'Think about how time moves left to right across the bottom while prices climb up and down on the right.',
        ],
        postSubmissionRationale:
          'Every standard financial chart puts Time along the horizontal bottom X-axis (past on the left, live now on the right) and Price along the vertical right Y-axis.',
        commonTrapNote:
          'Always verify both the time stamp and exact price level with your crosshair before drawing levels.',
      },
    ],
  },

  // =========================================================================
  // MODULE 16: Crypto Track 1 — Spot vs. Perpetual Futures & Order Books
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000020',
    slug: 'crypto-spot-perps-orderbook',
    title: 'Crypto Foundations: Spot vs. Perpetual Futures, Leverage & Order Books',
    subtitle:
      'Learn how Crypto exchanges work from scratch: owning real coins (Spot) vs. trading Perpetual Futures, how Maker/Taker fees add up, and how to avoid liquidation.',
    plainEnglishSummary:
      'In Crypto, you can trade two completely different ways. Spot trading means buying and owning the actual coin (like real BTC or ETH) with zero forced liquidation risk. Perpetual Futures ("Perps") let you trade up or down with borrowed money (leverage) and never expire — but if you use high leverage without a strict SL (Stop Loss), one fast wick can wipe out your margin completely.',
    beginnerFaq: [
      {
        question: 'Should a beginner start with Crypto Spot or Perpetual Futures?',
        answer:
          'Start with Spot (or tiny 1x–2x demo Perps) until you can follow your risk rules cleanly. Spot lets you learn 24/7 charts without worrying about liquidation prices or funding fees.',
      },
      {
        question: 'What is the difference between Isolated Margin and Cross Margin?',
        answer:
          'Isolated Margin caps your worst-case loss to only the exact money assigned to that one trade. Cross Margin risks your ENTIRE futures wallet to keep one losing position alive — beginners should strongly prefer Isolated Margin plus a hard SL (Stop Loss).',
      },
      {
        question: 'What are Maker and Taker fees on a Crypto order book?',
        answer:
          'A Limit order that rests on the order book waiting to be filled is a "Maker" order and usually pays lower fees. A Market order that immediately buys or sells against resting orders is a "Taker" order and pays higher fees plus slippage.',
      },
    ],
    level: 'beginner',
    marketCategory: 'crypto',
    learningStage: 'market_playbooks',
    moduleOrder: 16,
    conceptKey: 'crypto-spot-perps',
    estimatedMinutes: 16,
    learningObjectives: [
      'Distinguish Spot ownership from Perpetual Futures contracts and know when each tool fits.',
      'Read a live Crypto Order Book (Bids, Asks, Spread, and Depth) and understand Maker vs. Taker fees.',
      'Explain Isolated vs. Cross Margin and why high leverage shrinks your liquidation distance dangerously close.',
      'Size every Crypto trade by fixed account risk % and hard SL (Stop Loss) — never by random 20x–50x leverage sliders.',
    ],
    prerequisites: [
      'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
      'Risk Management, Position Sizing & Trading Psychology',
    ],
    terminology: [
      {
        term: 'Spot Market',
        shortCode: 'Spot',
        definition:
          'Buying or selling the actual underlying cryptocurrency (such as BTC or SOL) for immediate ownership with no leverage or expiration.',
        example:
          'Buying $500 of BTC on Spot means you own the coins directly and cannot be forcibly liquidated by a wick.',
      },
      {
        term: 'Perpetual Futures Contract',
        shortCode: 'Perps',
        definition:
          'A derivative contract that tracks a coin’s price with no expiry date, allowing both Long (buy) and Short (sell) trades using margin collateral.',
        example:
          'Opening a BTC/USDT Perp Short lets you profit if Bitcoin drops, while paying or receiving Funding every 8 hours.',
      },
      {
        term: 'Order Book (Bids, Asks, Maker & Taker)',
        shortCode: 'Order Book',
        definition:
          'The live list of waiting Buy Limit orders (Bids) and Sell Limit orders (Asks). Adding resting liquidity = Maker (lower fee); taking instant fills = Taker (higher fee).',
        example:
          'Placing a Limit buy at $63,500 makes you a Maker; clicking Market Buy immediately makes you a Taker.',
      },
      {
        term: 'Liquidation Price & Isolated Margin',
        shortCode: 'Liq / Isolated',
        definition:
          'The exact price where the exchange forcefully closes a leveraged position to cover losses. Isolated Margin limits that risk strictly to one trade’s allocated margin.',
        example:
          'At 20x leverage, just a ~5% move against you hits Liquidation — whereas a planned SL (Stop Loss) exits safely long before liquidation.',
      },
    ],
    sections: [
      {
        id: 'csp-spot-vs-perps',
        heading: '1. Spot Ownership vs. Perpetual Futures ("Perps")',
        body: 'Knowing which product you are clicking is the #1 safety habit on any Crypto exchange.',
        bulletPoints: [
          'Spot Trading: You own real coins, pay zero funding fees, and face zero liquidation risk. Ideal for swing buys and learning.',
          'Perpetual Futures: Contracts with no expiration date that allow Short selling and leverage — kept pegged to Spot price via Funding Rates.',
          'Rule of Thumb: Use Leverage only as a capital-efficiency tool, never to oversize risk beyond your 0.5%–1% SL (Stop Loss) limit.',
        ],
        keyTakeaway:
          'Your SL (Stop Loss) must ALWAYS sit far closer than your Liquidation Price — never let an exchange liquidate you.',
      },
      {
        id: 'csp-orderbook-fees',
        heading: '2. Reading the Order Book & Saving on Maker/Taker Fees',
        body: 'In fast Crypto markets, invisible fees and slippage quietly drain overactive accounts.',
        bulletPoints: [
          'Bids (Green) sit below current price waiting to buy; Asks (Red) sit above current price waiting to sell.',
          'Limit Orders (Maker) control your exact fill price and cut exchange fees meaningfully over 100 trades.',
          'Market Orders (Taker) guarantee instant fills during fast moves but pay higher fees and suffer slippage in thin altcoin books.',
        ],
        keyTakeaway:
          'Trade deep, liquid pairs (like BTC/USDT and ETH/USDT) and use Limit orders when entries are not urgent.',
      },
      {
        id: 'csp-margin-safety',
        heading: '3. Isolated Margin & Safe Crypto Position Sizing',
        body: 'High leverage sliders (25x, 50x, 100x) are marketing traps designed to liquidate impatient traders.',
        bulletPoints: [
          'Always select Isolated Margin when learning Perps so one mistake can never wipe your whole wallet.',
          'Calculate Position Size from your Stop Distance first: Position Value = Risk $ ÷ Stop Loss %.',
          'Example: Risking $100 with a 2% SL (Stop Loss) equals a $5,000 position — identical risk whether your slider says 2x or 5x, as long as your hard SL triggers first.',
        ],
        keyTakeaway:
          'Position size and Stop Loss distance decide your real risk — not the leverage multiplier alone.',
      },
    ],
    diagramConfig: {
      kind: 'crypto_funding_dominance',
      title: 'Crypto Exchange Mechanics: Spot, Perps & Order Book Liquidity',
      subtitle: 'How resting Bids/Asks, Margin safety, and leverage clusters drive Crypto wicks',
      caption:
        'Over-leveraged Perpetual Futures traders stack predictable liquidation levels just outside obvious ranges, creating sharp wicks that Spot holders survive effortlessly.',
      legend: [
        { label: 'Spot / Maker Liquidity', colorToken: 'emerald' },
        { label: 'Leveraged Liquidation Cluster', colorToken: 'amber' },
        { label: 'Forced Flush / Margin Call', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'csp-a1',
          label: 'Spot Ownership',
          sublabel: 'Zero Liquidation · Real Asset',
          tone: 'bullish',
        },
        {
          id: 'csp-a2',
          label: 'Order Book Depth',
          sublabel: 'Maker Limit vs. Taker Market',
          tone: 'neutral',
        },
        {
          id: 'csp-a3',
          label: 'Hard SL Before Liq',
          sublabel: 'Isolated Margin Protection',
          tone: 'liquidity',
        },
      ],
      walkthroughSteps: [
        'Choose the right vehicle first: Spot for clean unleveraged buys, or Isolated Perps with strict risk limits.',
        'Check Order Book depth and spread before entering — avoid thin illiquid coins with wide gaps.',
        'Place a hard SL (Stop Loss) strictly inside structural invalidation so you exit safely long before Liquidation Price.',
        'Keep leverage conservative so normal Crypto volatility never forces an emotional panic exit.',
      ],
    },
    chartScenarioIds: ['cry-btc-funding-flush'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Spot = Buying a Car Cash; Perps = Racing With Borrowed Margin',
        summary:
          'Spot lets you own real Crypto safely with zero liquidation. Perps add leverage and shorting, which demands strict SL (Stop Loss) discipline.',
        steps: [
          'Use Spot while learning charts and risk habits.',
          'If using Perps, pick Isolated Margin and keep effective leverage low.',
          'Always set a hard SL (Stop Loss) immediately upon entry.',
        ],
        keyTakeaway:
          'Never trade Perpetual Futures without a Stop Loss — liquidation fees are completely avoidable.',
        practiceSafeHint:
          'Check whether your planned stop triggers well before any liquidation threshold.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Step Safe Crypto Order Ticket Checklist',
        summary:
          'Verify four toggles on your exchange screen before clicking Buy or Sell.',
        steps: [
          '1. Confirm Spot vs. Perps tab.',
          '2. If on Perps, confirm Isolated Margin mode.',
          '3. Size position via Risk $ ÷ Stop % (e.g., $100 ÷ 0.02 = $5,000 notional).',
          '4. Attach both SL (Stop Loss) and TP (Take Profit) before submitting.',
        ],
        keyTakeaway:
          'Checking those four settings takes 5 seconds and prevents 99% of catastrophic exchange errors.',
        practiceSafeHint:
          'Compare Maker Limit entry fees against Market Taker fees on high-frequency setups.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'BTC/USDT 2% Stop Distance Position Math',
        summary:
          'On a $10,000 account risking 1% ($100), buying BTC at $64,000 with SL at $62,720 (2% away) equals a $5,000 position (0.078 BTC).',
        steps: [
          'Stop distance: ($64,000 − $62,720) ÷ $64,000 = 2.0%.',
          'Position size: $100 risk ÷ 0.02 = $5,000 position value.',
          'Target at +6% ($67,840) delivers +$300 (+3R) without needing reckless leverage.',
        ],
        keyTakeaway:
          'Clean 1:3 R-multiple math works on Crypto with 1x–3x leverage — 50x is completely unnecessary.',
        practiceSafeHint:
          'Divide your dollar risk by stop percentage to get exact position value every time.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Seatbelt vs. Ejector Seat Analogy',
        summary:
          'A hard SL (Stop Loss) is a seatbelt that keeps losses small and planned; a Liquidation Price is an ejector seat that blasts you out at the worst possible price with extra penalty fees.',
        steps: [
          'Isolated Margin locks each risk inside its own safety compartment.',
          'Maker Limit orders let you pick your seat calmly instead of paying surge pricing.',
          'Low leverage keeps every normal bump comfortable.',
        ],
        keyTakeaway:
          'Buckle your SL (Stop Loss) on every single position so the exchange never touches your account.',
        practiceSafeHint:
          'Ask: "If price drops 3% suddenly, does my planned SL exit me calmly?"',
      },
      comparison: {
        style: 'comparison',
        headline: 'Crypto Spot vs. Perpetual Futures',
        summary:
          'Pick the contract that matches your goal and skill level.',
        steps: [
          'Spot: Own real asset · No funding rate · No liquidation · Long-only.',
          'Perpetual Futures: Long or Short · Margin & leverage · Funding payments · Requires hard SL.',
          'Beginner path: Master Spot & demo Perps before risking real margin.',
        ],
        keyTakeaway:
          'Leverage magnifies mistakes just as fast as profits — earn the right to use it.',
        practiceSafeHint:
          'Check if a setup even needs Perps, or if clean Spot execution is safer.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: 'Top 3 Beginner Crypto Exchange Mistakes',
        summary:
          'Simple platform errors destroy more Crypto accounts than bad chart reads.',
        steps: [
          'Mistake 1: Leaving Cross Margin enabled and watching one bad altcoin trade drain the whole wallet.',
          'Mistake 2: Cranking leverage to 25x–50x so normal 2% BTC noise triggers instant liquidation.',
          'Mistake 3: Spamming Market orders on thin small-cap coins and losing 1% instantly to spread + fees.',
        ],
        keyTakeaway:
          'Isolated Margin + hard SL + liquid majors (BTC/ETH/SOL) eliminate all three errors.',
        practiceSafeHint:
          'Verify your exchange mode before confirming any futures ticket.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-csp-1',
        lessonSlug: 'crypto-spot-perps-orderbook',
        conceptKey: 'crypto-spot-perps',
        scenarioId: 'cry-btc-funding-flush',
        prompt:
          'Why should beginners prefer Isolated Margin (plus a hard SL) over Cross Margin when learning Crypto Perpetual Futures?',
        options: [
          { id: 'a', label: 'Isolated Margin caps worst-case margin risk to that single trade instead of exposing your entire futures wallet' },
          { id: 'b', label: 'Isolated Margin guarantees every trade closes in profit' },
          { id: 'c', label: 'Cross Margin cannot be used on Bitcoin' },
          { id: 'd', label: 'Isolated Margin removes all trading fees forever' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about what happens to the rest of your account balance if one trade gaps hard against you.',
        ],
        postSubmissionRationale:
          'Isolated Margin walls off only the margin assigned to that single position, protecting the rest of your wallet alongside your hard SL (Stop Loss).',
        commonTrapNote:
          'Leaving Cross Margin on without a stop loss can liquidate your entire account from one bad altcoin spike.',
      },
      {
        id: 'pq-csp-2',
        lessonSlug: 'crypto-spot-perps-orderbook',
        conceptKey: 'crypto-spot-perps',
        prompt:
          'On a $10,000 Crypto account risking 1% ($100) with a 2% Stop Loss distance on BTC/USDT, what is your correct position value?',
        options: [
          { id: 'a', label: '$2,000 position value' },
          { id: 'b', label: '$5,000 position value ($100 ÷ 0.02)' },
          { id: 'c', label: '$50,000 position value' },
          { id: 'd', label: '$100 position value' },
        ],
        correctOptionId: 'b',
        hints: [
          'Use the universal risk formula: Position Value = Risk Dollars ÷ Stop Loss Percentage (as a decimal).',
        ],
        postSubmissionRationale:
          '$100 risk ÷ 0.02 (2% stop distance) = $5,000 total position value. If BTC drops 2% to your SL, you lose exactly $100 (1R).',
        commonTrapNote:
          'Picking a random leverage slider instead of sizing from Stop Loss distance leads to unpredictable losses.',
      },
    ],
  },

  // =========================================================================
  // MODULE 18: Crypto Track 3 — Volatility, Altcoin Cycles & Liquidation Heatmaps
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000021',
    slug: 'crypto-volatility-altcoin-cycles',
    title: 'Crypto Cycles: BTC Dominance, Altcoin Rotation & Liquidation Heatmaps',
    subtitle:
      'Time when capital rotates from Bitcoin into Altcoins using BTC.D (Bitcoin Dominance), read Liquidation Heatmaps, and size down for high-beta volatility.',
    plainEnglishSummary:
      'In Crypto, Bitcoin is the tide that lifts or sinks almost every other coin. Watching BTC.D (Bitcoin Dominance — Bitcoin’s share of the total Crypto market) tells you whether big money is hiding in BTC or rotating into faster-moving Altcoins (ETH, SOL, and mid-caps). Combining BTC.D with Liquidation Heatmaps helps you spot where crowded traders are about to get squeezed.',
    beginnerFaq: [
      {
        question: 'What is BTC.D (Bitcoin Dominance) in simple words?',
        answer:
          'BTC.D is the percentage of the entire Crypto market cap held inside Bitcoin. When BTC.D rises sharply, money favors Bitcoin and most Altcoins lag or bleed. When Bitcoin stabilizes or climbs calmly while BTC.D drops, money rotates into Altcoins.',
      },
      {
        question: 'What does a Liquidation Heatmap actually show?',
        answer:
          'It estimates price zones where large clusters of leveraged Long or Short traders will be forcefully liquidated. Just like Equal Highs and Equal Lows, bright yellow/green liquidation bands act like magnets that price frequently sweeps before reversing.',
      },
      {
        question: 'Why do Altcoins drop 2x–3x harder when Bitcoin dips 3%?',
        answer:
          'Altcoins have thinner order books and higher "beta" (volatility sensitivity). When Bitcoin drops fast, traders rush to exit risky Altcoins first — which is why you must widen stops proportionally and cut position size on Altcoins.',
      },
    ],
    level: 'intermediate',
    marketCategory: 'crypto',
    learningStage: 'market_playbooks',
    moduleOrder: 18,
    conceptKey: 'crypto-altcoin-cycles',
    estimatedMinutes: 18,
    learningObjectives: [
      'Read the 4-step Crypto Capital Rotation Matrix combining BTC price direction and BTC.D (Bitcoin Dominance).',
      'Use Liquidation Heatmaps alongside Market Structure to avoid chasing late entries into crowded leverage.',
      'Adapt stop distance and position sizing for high-volatility Altcoins vs. Bitcoin.',
      'Spot when an "Alt Season" rotation is genuinely healthy vs. a risky late-stage blow-off top.',
    ],
    prerequisites: [
      'Crypto Playbook: 24/7 Volatility, BTC Dominance & Funding',
      'Equal Highs & Equal Lows (Resting Stop Clusters)',
    ],
    terminology: [
      {
        term: 'Bitcoin Dominance',
        shortCode: 'BTC.D',
        definition:
          'Bitcoin’s market capitalization divided by the total cryptocurrency market cap — the primary gauge of Bitcoin vs. Altcoin strength.',
        example:
          'When BTC trends sideways near highs and BTC.D breaks down cleanly, liquid Altcoins like ETH and SOL often lead breakouts.',
      },
      {
        term: 'Liquidation Heatmap',
        shortCode: 'Liq Map',
        definition:
          'A visual chart estimating where leveraged Futures positions will be forcibly closed, highlighting dense pockets of stop-hunt fuel.',
        example:
          'A bright liquidation cluster sitting just below a 4H Equal Low often gets swept before BTC rebounds strongly.',
      },
      {
        term: 'High-Beta Altcoin Volatility',
        shortCode: 'Beta',
        definition:
          'A coin’s tendency to swing larger percentage moves than Bitcoin — amplifying both gains and drawdowns.',
        example:
          'If BTC moves 2%, a high-beta Altcoin can easily swing 6%–8%, requiring smaller position sizing to keep risk capped at 1R.',
      },
      {
        term: 'Altcoin Rotation Cycle',
        shortCode: 'Rotation',
        definition:
          'The repeating liquidity flow across Crypto bull phases: Bitcoin leads → Large-Cap Altcoins (ETH/SOL) follow → Mid/Small-Cap Altcoins catch up last.',
        example:
          'Chasing small-cap meme coins after a 300% spike usually happens at the very end of the rotation cycle.',
      },
    ],
    sections: [
      {
        id: 'cac-btcd-matrix',
        heading: '1. The BTC + BTC.D (Bitcoin Dominance) Rotation Matrix',
        body: 'Before buying any Altcoin, spend 10 seconds checking two charts: BTC/USDT and BTC.D.',
        bulletPoints: [
          'BTC Up + BTC.D Up = Bitcoin Season: Focus your Longs on BTC; Altcoins usually lag behind.',
          'BTC Sideways/Up + BTC.D Down = Altcoin Rotation: Ideal window for high-liquidity Altcoin breakouts (ETH, SOL, major leaders).',
          'BTC Down + BTC.D Up = Risk-Off Drain: Altcoins bleed heavily — stay in cash/stablecoins or look only for disciplined shorts.',
          'BTC Down + BTC.D Down = Panic Selloff: Everything drops together; protect capital and wait for structure to stabilize.',
        ],
        keyTakeaway:
          'Never buy an Altcoin breakout blindly while Bitcoin is dumping into resistance.',
      },
      {
        id: 'cac-liq-heatmaps',
        heading: '2. Reading Liquidation Heatmaps Like a Liquidity Map',
        body: 'Liquidation Heatmaps visualize the exact concept of Buy-Side and Sell-Side Liquidity in leveraged Crypto futures.',
        bulletPoints: [
          'Bright bands above current price represent trapped Short liquidations (fuel for short squeezes).',
          'Bright bands below current price represent crowded Long liquidations (fuel for long flushes).',
          'Use Heatmaps as a confluent map with 1H/4H structure — wait for the sweep + BOS (Break of Structure) rather than blindly catching falling knives.',
        ],
        keyTakeaway:
          'Heatmaps show WHERE fuel is parked; candlestick close and market structure show WHEN to act.',
      },
      {
        id: 'cac-altcoin-risk',
        heading: '3. Sizing Down for High-Beta Altcoin Volatility',
        body: 'A 1% stop loss might fit a calm Forex pair, but on an Altcoin it gets wicked out in 3 minutes.',
        bulletPoints: [
          'Measure recent candle swings with the Ruler tool before placing your SL (Stop Loss).',
          'If an Altcoin needs a 4% stop instead of BTC’s 2% stop, cut your dollar position size in HALF so your max loss stays locked at 1R.',
          'Stick to high-volume leaders first and avoid overlapping 4 correlated Altcoin Longs at once (that turns 1% risk into 4% simultaneous BTC risk!).',
        ],
        keyTakeaway:
          'Opening 4 Altcoin Longs at the same time is really ONE giant leveraged Bitcoin trade in disguise.',
      },
    ],
    diagramConfig: {
      kind: 'crypto_funding_dominance',
      title: 'Crypto Rotation & Liquidation Sweep Map',
      subtitle: 'Aligning BTC.D direction with Liquidation Heatmap flushes before Altcoin entries',
      caption:
        'Capital rotates cleanly when Bitcoin stabilizes, BTC.D rolls over, and over-leveraged late longs are flushed out at obvious Equal Lows.',
      legend: [
        { label: 'BTC Stability / Rotation', colorToken: 'emerald' },
        { label: 'Liquidation Heatmap Cluster', colorToken: 'amber' },
        { label: 'Over-Leveraged Cascade', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'cac-a1',
          label: 'BTC + BTC.D Filter',
          sublabel: 'Check Regime Before Alts',
          tone: 'bullish',
        },
        {
          id: 'cac-a2',
          label: 'Liq Heatmap Magnet',
          sublabel: 'Crowded Stops Cleared First',
          tone: 'liquidity',
        },
        {
          id: 'cac-a3',
          label: 'Correlation Cap',
          sublabel: 'Size Down High-Beta Alts',
          tone: 'bearish',
        },
      ],
      walkthroughSteps: [
        'Check BTC/USDT trend and BTC.D (Bitcoin Dominance) to verify whether capital favors BTC or Altcoins.',
        'Scan Liquidation Heatmaps near 4H swing highs and lows to see where crowded leveraged stops sit.',
        'Wait for price to sweep the liquidation pocket and print a decisive reclaim or BOS (Break of Structure).',
        'Size down proportionally for Altcoin volatility and cap correlated exposure across coins.',
      ],
    },
    chartScenarioIds: ['cry-btc-funding-flush'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Bitcoin Is the Sun; Altcoins Are the Planets',
        summary:
          'Check Bitcoin and BTC.D (Bitcoin Dominance) before touching any Altcoin — and cut your trade size when coins move twice as wildly.',
        steps: [
          'Check if Bitcoin is calm or trending up.',
          'Check if BTC.D is tilting down (money flowing into Altcoins).',
          'Wait for crowded leverage to get flushed, then risk no more than 1% total across correlated coins.',
        ],
        keyTakeaway:
          'Respect Bitcoin’s gravity and correlation — it saves Altcoin traders from sudden portfolio drawdowns.',
        practiceSafeHint:
          'Notice how a sudden Bitcoin flush immediately sweeps Altcoin lows too.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Chart Altcoin Green-Light Checklist',
        summary:
          'Confirm alignment across three charts before entering an Altcoin setup.',
        steps: [
          'Chart 1 (BTC/USDT 4H): Not rejecting major HTF resistance.',
          'Chart 2 (BTC.D 4H): Flat or trending downward.',
          'Chart 3 (Target Altcoin 15m/1H): Clean liquidity sweep + BOS (Break of Structure) with proper 1R sizing.',
        ],
        keyTakeaway:
          'When all three charts align, Altcoin setups deliver crisp asymmetric runners.',
        practiceSafeHint:
          'Check whether BTC is sitting right under major supply before buying an Altcoin breakout.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Avoiding the 4-Altcoin Correlation Trap',
        summary:
          'Taking 1% risk each on SOL, AVAX, LINK, and ARB simultaneously exposes you to 4% downside if Bitcoin drops 3% in ten minutes.',
        steps: [
          'Instead of 4 correlated Longs at 1% each, pick the single strongest relative-strength leader.',
          'Or split your total 1% risk into two 0.5% positions.',
          'Result: One sudden BTC liquidation wick only costs 1R instead of 4R.',
        ],
        keyTakeaway:
          'Treat correlated Altcoin trades as one combined risk bucket.',
        practiceSafeHint:
          'Add up the total risk % across all open Crypto positions before adding another coin.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Ocean Tide & Speedboats Analogy',
        summary:
          'Bitcoin is the ocean tide and Altcoins are speedboats. Speedboats go much faster than big ships — but only when the tide is rising, not crashing out to sea.',
        steps: [
          'BTC.D tells you whether passengers are boarding the big ship (BTC) or speedboats (Alts).',
          'Liquidation Heatmaps show big waves waiting to flip careless boaters.',
          'Smaller sizing is your life jacket in choppy water.',
        ],
        keyTakeaway:
          'Wait for a friendly tide before launching high-beta speedboats.',
        practiceSafeHint:
          'Ask which way the Bitcoin tide is pulling right now.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Trading BTC/ETH Majors vs. High-Beta Altcoins',
        summary:
          'Each group plays a distinct role in a Crypto playbook.',
        steps: [
          'BTC / ETH: Deep order books, cleaner structure, tighter stops, lower slippage.',
          'Mid-Cap Altcoins: Larger % swings during falling BTC.D, but wider stops and higher correlation risk.',
          'Rule: Master BTC structure first; add 1–2 liquid Altcoins only during clear rotation windows.',
        ],
        keyTakeaway:
          'Liquidity and clean structure beat chasing random low-cap tickers.',
        practiceSafeHint:
          'Compare spread and candle cleanliness between BTC/USDT and a small-cap coin.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Costly Altcoin Cycle Mistakes',
        summary:
          'Protect your gains during fast Crypto rotations.',
        steps: [
          'Mistake 1: Holding 5–6 Altcoin Longs at once and getting wiped by a single BTC dip.',
          'Mistake 2: Buying a coin AFTER it already pumped +40% in one day right into a short-squeeze peak.',
          'Mistake 3: Trading Heatmap levels blindly without waiting for a candle close confirmation.',
        ],
        keyTakeaway:
          'Patience for the sweep + strict correlation caps keeps your Crypto equity curve smooth.',
        practiceSafeHint:
          'Check if a coin is already extended far above its 4H structure before chasing.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-cac-1',
        lessonSlug: 'crypto-volatility-altcoin-cycles',
        conceptKey: 'crypto-altcoin-cycles',
        scenarioId: 'cry-btc-funding-flush',
        prompt:
          'Which market regime historically gives the cleanest tailwind for liquid Altcoin Long setups?',
        options: [
          { id: 'a', label: 'Bitcoin dumping sharply while BTC.D spikes upward' },
          { id: 'b', label: 'Bitcoin holding steady or climbing calmly while BTC.D (Bitcoin Dominance) trends downward' },
          { id: 'c', label: 'Thin Sunday midnight volume with zero trend' },
          { id: 'd', label: 'When funding rates are at extreme positive highs right below resistance' },
        ],
        correctOptionId: 'b',
        hints: [
          'When BTC is stable and its percentage share of the total Crypto market falls, where is capital rotating?',
        ],
        postSubmissionRationale:
          'A calm or bullish Bitcoin paired with falling BTC.D signals capital rotating into Altcoins without Bitcoin dragging the broader market down.',
        commonTrapNote:
          'Buying Altcoin breakouts while Bitcoin dumps and BTC.D climbs fights the primary capital flow.',
      },
      {
        id: 'pq-cac-2',
        lessonSlug: 'crypto-volatility-altcoin-cycles',
        conceptKey: 'crypto-altcoin-cycles',
        prompt:
          'If you open four separate Altcoin Long positions at 1% risk each at the exact same time, what is your true correlated downside risk if Bitcoin suddenly drops 4%?',
        options: [
          { id: 'a', label: 'Still only 1% because they have different ticker names' },
          { id: 'b', label: 'Up to 4% combined risk because Altcoins move heavily in sync during sudden BTC drops' },
          { id: 'c', label: '0% because Altcoins never correlate with Bitcoin' },
          { id: 'd', label: 'Exactly 0.25%' },
        ],
        correctOptionId: 'b',
        hints: [
          'What happens to almost every Altcoin at the exact second Bitcoin flushes downward?',
        ],
        postSubmissionRationale:
          'Most Altcoins correlate tightly with Bitcoin during sharp flushes, so four 1% Altcoin Longs behave like a single 4% risk bet.',
        commonTrapNote:
          'Different ticker symbols do NOT mean diversification when every coin follows Bitcoin.',
      },
    ],
  },

  // =========================================================================
  // MODULE 19: Forex Track 1 — Currency Pairs, Pips, Lots & Spreads
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000022',
    slug: 'forex-pairs-pips-lots-spreads',
    title: 'Forex Foundations: Currency Pairs, Pips, Lots & Spreads Explained',
    subtitle:
      'Master the building blocks of Forex (FX) trading: Base vs. Quote currencies, how Pips work, Standard/Mini/Micro Lot math, and hidden Spread costs.',
    plainEnglishSummary:
      'Forex (Foreign Exchange) simply trades one country’s currency against another — like EUR/USD (Euro vs. US Dollar). Because currencies move in tiny decimal steps, Forex traders measure distance in Pips, measure trade size in Lots (Micro 0.01, Mini 0.10, Standard 1.00), and pay a small Bid/Ask Spread every time they enter a position.',
    beginnerFaq: [
      {
        question: 'In EUR/USD, what am I actually buying when I click Buy (Long)?',
        answer:
          'You are buying the first currency (Base = EUR) and simultaneously selling the second currency (Quote = USD). If the Euro gets stronger than the Dollar, EUR/USD goes up. If the Dollar gets stronger, EUR/USD goes down.',
      },
      {
        question: 'What is a Pip in plain English?',
        answer:
          'A Pip ("Percentage in Point") is the standard tiny unit of price movement in Forex. On most pairs like EUR/USD (1.0850 → 1.0851), 1 pip is the 4th decimal place (0.0001). On Japanese Yen pairs like USD/JPY (154.20 → 154.21), 1 pip is the 2nd decimal place (0.01).',
      },
      {
        question: 'How much money is 1 pip worth on Micro, Mini, and Standard Lots?',
        answer:
          'On USD-quoted pairs like EUR/USD or GBP/USD: 0.01 Micro Lot ≈ $0.10 per pip, 0.10 Mini Lot ≈ $1.00 per pip, and 1.00 Standard Lot ≈ $10.00 per pip. Always match your lot size to your exact SL (Stop Loss) pip distance!',
      },
    ],
    level: 'beginner',
    marketCategory: 'forex',
    learningStage: 'market_playbooks',
    moduleOrder: 19,
    conceptKey: 'forex-pips-lots',
    estimatedMinutes: 16,
    learningObjectives: [
      'Read any Forex pair instantly by separating the Base currency (left) and Quote currency (right).',
      'Measure Pip distance cleanly on both 4-decimal majors (EUR/USD) and 2-decimal Yen pairs (USD/JPY).',
      'Calculate exact Lot Size (Micro 0.01, Mini 0.10, Standard 1.00) from your Risk $ and SL (Stop Loss) pips.',
      'Factor Bid/Ask Spread and 5:00 PM NY rollover spread widening into every stop loss and entry.',
    ],
    prerequisites: [
      'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
      'Risk Management, Position Sizing & Trading Psychology',
    ],
    terminology: [
      {
        term: 'Base & Quote Currency',
        shortCode: 'BASE / QUOTE',
        definition:
          'Every Forex ticker compares two currencies: the Base (first) is what you buy or sell, priced in units of the Quote (second).',
        example:
          'EUR/USD = 1.0850 means 1 Euro costs 1.0850 US Dollars.',
      },
      {
        term: 'Pip (Percentage in Point)',
        shortCode: 'Pip',
        definition:
          'The standard unit for measuring Forex price distance: 0.0001 on most pairs (EUR/USD, GBP/USD) and 0.01 on JPY pairs (USD/JPY).',
        example:
          'EUR/USD climbing from 1.0850 to 1.0875 is a +25 pip move.',
      },
      {
        term: 'Lot Size (Standard, Mini & Micro)',
        shortCode: '1.00 / 0.10 / 0.01',
        definition:
          'Standardized Forex position sizes: 1.00 Standard Lot = 100,000 units (~$10/pip), 0.10 Mini = 10,000 units (~$1/pip), 0.01 Micro = 1,000 units (~$0.10/pip).',
        example:
          'Risking $50 with a 25-pip stop on EUR/USD requires $2/pip = 0.20 lots.',
      },
      {
        term: 'Bid / Ask Spread & Majors vs. Exotics',
        shortCode: 'Spread',
        definition:
          'The pip gap between Buy (Ask) and Sell (Bid) prices. Major pairs (EUR/USD, GBP/USD, USD/JPY) have tiny 0.1–1.5 pip spreads; Exotic pairs can have costly 10–30 pip spreads.',
        example:
          'If EUR/USD Bid is 1.0850 and Ask is 1.0851, the Spread is 1.0 pip.',
      },
    ],
    sections: [
      {
        id: 'fpl-pairs-and-pips',
        heading: '1. Majors, Crosses & Measuring Pips Cleanly',
        body: 'Beginners get faster results by focusing on 2–3 tight-spread Major pairs instead of 28 random tickers.',
        bulletPoints: [
          'Majors (paired with USD): EUR/USD, GBP/USD, USD/JPY, AUD/USD — highest liquidity and lowest trading costs.',
          'Standard Pip: 4th decimal place (1.0850 → 1.0860 = 10 pips). A 5th tiny digit (1.08505) is a 0.1-pip "pipette."',
          'JPY Pip Exception: 2nd decimal place (154.20 → 154.50 = 30 pips).',
        ],
        keyTakeaway:
          'Stick to Major pairs (EUR/USD, GBP/USD, USD/JPY) while building consistency — tight spreads protect your R-multiples.',
      },
      {
        id: 'fpl-lot-sizing',
        heading: '2. The 10-Second Forex Lot Size Formula',
        body: 'Never guess "0.50 lots" or "1.00 lot" by feel — compute exact lot size before every entry.',
        bulletPoints: [
          'Formula (USD-quoted pairs): Lot Size = Risk $ ÷ (Stop Loss Pips × $10).',
          'Example: $5,000 account × 1% risk = $50 max loss. With a 20-pip SL (Stop Loss): $50 ÷ (20 × $10) = 0.25 lots ($2.50/pip).',
          'Small accounts ($500–$1,000) use Micro Lots (0.01–0.05) so every loss stays calm and strictly capped at 1%.',
        ],
        keyTakeaway:
          'Lot size should change whenever your SL (Stop Loss) pip width changes so your dollar risk stays 100% constant.',
      },
      {
        id: 'fpl-spreads-rollover',
        heading: '3. Spread Traps & the 5:00 PM New York Rollover Window',
        body: 'Even a great chart setup can lose if wide broker spreads clip your stop loss unnecessarily.',
        bulletPoints: [
          'Short positions close at the ASK price — add spread buffer above structural highs so a wide spread never triggers your SL prematurely.',
          'Daily Rollover (5:00 PM–6:00 PM New York / 21:00–22:00 UTC): Liquidity thins dramatically and spreads can spike 5×–10× wider.',
          'Avoid opening fresh tight-stop scalps during daily rollover or seconds before major economic releases.',
        ],
        keyTakeaway:
          'Always factor Bid/Ask spread into your SL (Stop Loss) and stay out during the 5:00 PM NY rollover hour.',
      },
    ],
    diagramConfig: {
      kind: 'market_sessions',
      title: 'Forex Mechanics: Major Pairs, Pip Math & Spread Windows',
      subtitle: 'Trade tight-spread liquid sessions and size every lot strictly from Stop Loss pips',
      caption:
        'Spreads tighten to their lowest cost during London and New York liquidity windows and widen sharply during the daily 5:00 PM NY rollover.',
      legend: [
        { label: 'Tight Spread Liquidity', colorToken: 'emerald' },
        { label: 'Wide Spread Rollover', colorToken: 'amber' },
        { label: 'Stop Loss + Spread Buffer', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'fpl-a1',
          label: 'Base / Quote Pair',
          sublabel: 'Majors = Lowest Spread',
          tone: 'bullish',
        },
        {
          id: 'fpl-a2',
          label: 'Lot Math',
          sublabel: 'Risk $ ÷ (SL Pips × $10)',
          tone: 'liquidity',
        },
        {
          id: 'fpl-a3',
          label: '5 PM NY Rollover',
          sublabel: 'Avoid Wide Spread Spikes',
          tone: 'bearish',
        },
      ],
      walkthroughSteps: [
        'Select a high-liquidity Major pair (such as EUR/USD or GBP/USD) with tight Bid/Ask spread.',
        'Measure structural SL (Stop Loss) distance in pips using the Ruler tool plus a small spread buffer.',
        'Compute exact Lot Size = Risk $ ÷ (SL Pips × $10) so every trade risks strictly 0.5%–1%.',
        'Avoid placing tight-stop trades right before the 5:00 PM New York rollover spread spike.',
      ],
    },
    chartScenarioIds: ['fx-london-sweep'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Forex Pips & Lots Made Simple in 30 Seconds',
        summary:
          'Think of Pips as inches on a ruler and Lots as how many dollars each inch is worth.',
        steps: [
          '0.01 Micro Lot ≈ $0.10 per pip (great for starting small).',
          '0.10 Mini Lot ≈ $1.00 per pip.',
          '1.00 Standard Lot ≈ $10.00 per pip.',
        ],
        keyTakeaway:
          'Always adjust your lot size to fit your stop distance — never risk more than 1% per trade.',
        practiceSafeHint:
          'Check the 4th decimal digit on EUR/USD (or 2nd decimal digit on USD/JPY) to count pips.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'Exact Lot Size Calculation Walkthrough',
        summary:
          'Follow three steps before submitting any Forex ticket.',
        steps: [
          '1. Pick Risk $ (e.g., 1% of $10,000 = $100).',
          '2. Measure SL (Stop Loss) distance (e.g., 25 pips).',
          '3. Divide: $100 ÷ (25 × $10) = 0.40 lots ($4/pip × 25 pips = $100).',
        ],
        keyTakeaway:
          'A 10-second calculation guarantees you never accidentally over-leverage.',
        practiceSafeHint:
          'Verify whether your pair ends in JPY (0.01 per pip) or USD (0.0001 per pip).',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'EUR/USD 15-Pip Stop vs. 30-Pip Stop',
        summary:
          'Both trades risk exactly $100 on a $10,000 account — only the lot size changes.',
        steps: [
          'Setup A (15-pip SL): $100 ÷ 150 = 0.66 lots (~$6.60/pip).',
          'Setup B (30-pip SL): $100 ÷ 300 = 0.33 lots (~$3.30/pip).',
          'Both setups lose exactly -$100 (-1R) if wrong and pay +$300 (+3R) at 1:3 TP.',
        ],
        keyTakeaway:
          'Consistent dollar risk keeps your emotions steady regardless of volatility.',
        practiceSafeHint:
          'Notice how doubling the stop distance cuts the lot size in half.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Airport Currency Exchange Analogy',
        summary:
          'When you exchange Dollars for Euros at an airport booth, the buy price is slightly higher than the sell price — that small gap is the exact same Bid/Ask Spread you see in Forex.',
        steps: [
          'Busy currency booths (EUR/USD) have tiny spreads.',
          'Rare currencies (Exotics) have huge spreads.',
          'Late-night booth rollover (5 PM NY) temporarily widens the spread.',
        ],
        keyTakeaway:
          'Trade the busiest currencies during active hours to keep spread costs tiny.',
        practiceSafeHint:
          'Check live spread in pips before entering any short-timeframe setup.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Major Pairs vs. Exotic Pairs',
        summary:
          'Why professionals spend 90% of their time on a handful of Major pairs.',
        steps: [
          'Majors (EUR/USD, GBP/USD, USD/JPY): Tight 0.2–1.2 pip spreads, smooth liquidity, clean structure.',
          'Exotics (USD/TRY, USD/ZAR): Wide 10–30+ pip spreads, erratic gaps, higher overnight swap fees.',
          'Rule: Start exclusively with 1–2 Majors until profitable.',
        ],
        keyTakeaway:
          'Lower spreads mean you start every trade much closer to breakeven.',
        practiceSafeHint:
          'Compare how many pips of spread a 10-pip stop loses on a Major vs. an Exotic.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Classic Beginner Forex Mechanics Mistakes',
        summary:
          'Fix these basic calculation habits right away.',
        steps: [
          'Mistake 1: Using the same fixed lot size (like 1.00 lot) on every trade regardless of stop width.',
          'Mistake 2: Forgetting that a Short trade’s SL (Stop Loss) triggers on the Ask price (Bid + Spread).',
          'Mistake 3: Holding a tight 8-pip stop through the 5:00 PM New York rollover spike.',
        ],
        keyTakeaway:
          'Clean lot math + spread awareness protects good setups from preventable stop-outs.',
        practiceSafeHint:
          'Always add a small spread cushion when setting stops above highs on Short trades.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-fpl-1',
        lessonSlug: 'forex-pairs-pips-lots-spreads',
        conceptKey: 'forex-pips-lots',
        scenarioId: 'fx-london-sweep',
        prompt:
          'You have a $5,000 Forex account and risk strictly 1% ($50) on a EUR/USD setup with a 25-pip SL (Stop Loss). What lot size should you trade?',
        options: [
          { id: 'a', label: '0.20 lots ($2/pip × 25 pips = $50)' },
          { id: 'b', label: '1.00 standard lot ($10/pip × 25 pips = $250)' },
          { id: 'c', label: '0.02 micro lots ($0.20/pip × 25 pips = $5)' },
          { id: 'd', label: '2.50 lots' },
        ],
        correctOptionId: 'a',
        hints: [
          'Divide $50 max risk by 25 pips to get $/pip, then divide by $10/pip per standard lot.',
        ],
        postSubmissionRationale:
          '$50 ÷ 25 pips = $2 per pip. Since 0.10 Mini Lot equals ~$1/pip on EUR/USD, 0.20 lots risks exactly $50 (1%).',
        commonTrapNote:
          'Trading a fixed 1.00 standard lot on a $5,000 account risks 5% on a single 25-pip stop.',
      },
      {
        id: 'pq-fpl-2',
        lessonSlug: 'forex-pairs-pips-lots-spreads',
        conceptKey: 'forex-pips-lots',
        prompt:
          'Why do disciplined Forex traders avoid placing tight-stop entries right around 5:00 PM New York time?',
        options: [
          { id: 'a', label: 'Because daily bank rollover thins liquidity and can temporarily widen Bid/Ask spreads sharply' },
          { id: 'b', label: 'Because candlesticks freeze for 12 hours' },
          { id: 'c', label: 'Because pips become worth $0' },
          { id: 'd', label: 'Because Major pairs only trade on weekends' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about what happens to broker spreads during the daily bank settlement rollover.',
        ],
        postSubmissionRationale:
          'Around 5:00 PM NY rollover, liquidity drops while swap rates settle, causing spreads to widen dramatically and clip tight stops.',
        commonTrapNote:
          'Getting stopped out by a rollover spread spike feels like a chart failure when it is actually a timing error.',
      },
    ],
  },

  // =========================================================================
  // MODULE 21: Forex Track 3 — Central Banks, Interest Rates & High-Impact News
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000023',
    slug: 'forex-macro-news-rates',
    title: 'Forex Macro: Central Banks, Interest Rates & High-Impact News (CPI / NFP)',
    subtitle:
      'Understand why interest rates steer multi-week currency trends, how to read an economic calendar, and how to stay safe around CPI, NFP, and FOMC releases.',
    plainEnglishSummary:
      'Price action shows you WHEN to enter, while Central Banks and interest rates explain WHY a currency trends for weeks at a time. When a central bank raises interest rates (or signals higher rates ahead), global capital flows into that currency to earn better yield. On the short term, red-folder news drops like CPI (inflation) and NFP (US jobs) cause massive two-way liquidity spikes — so beginners should wait for the dust to settle first.',
    beginnerFaq: [
      {
        question: 'Why do Central Bank interest rates move Forex currencies so strongly?',
        answer:
          'Big global funds love earning higher safe interest. If the US Federal Reserve raises rates while another central bank cuts rates, big money flows into the US Dollar — driving steady multi-week trends.',
      },
      {
        question: 'What do "Hawkish" and "Dovish" mean in plain English?',
        answer:
          'Hawkish = tough on inflation, favoring higher interest rates (usually bullish for that currency). Dovish = focused on supporting growth/jobs, favoring lower interest rates (usually bearish for that currency).',
      },
      {
        question: 'Should beginners trade the exact second CPI or NFP comes out?',
        answer:
          'No! In the first 1–5 minutes after red-folder news, spreads explode and huge whipsaw wicks often trigger BOTH Long and Short stops. Wait 15–30 minutes for spreads to normalize and real market structure to print.',
      },
    ],
    level: 'intermediate',
    marketCategory: 'forex',
    learningStage: 'market_playbooks',
    moduleOrder: 21,
    conceptKey: 'forex-macro-news',
    estimatedMinutes: 18,
    learningObjectives: [
      'Explain how Interest Rate Differentials and Central Bank tone (Hawkish vs. Dovish) drive HTF (Higher Timeframe) Forex trends.',
      'Use an Economic Calendar every morning before trading to flag red-folder news (CPI, NFP, FOMC, ECB, BOE, BOJ).',
      'Protect open trades from news slippage and two-way whipsaw spikes.',
      'Trade cleanly AFTER high-impact news by waiting for post-release sweeps and confirmed BOS (Break of Structure).',
    ],
    prerequisites: [
      'Forex Foundations: Currency Pairs, Pips, Lots & Spreads Explained',
      'Forex Playbook: Session Liquidity & London/NY Killzones',
    ],
    terminology: [
      {
        term: 'Hawkish vs. Dovish Central Bank',
        shortCode: 'Hawk / Dove',
        definition:
          'Hawkish policymakers favor tighter policy and higher interest rates to fight inflation (currency bullish). Dovish policymakers favor rate cuts to boost growth (currency bearish).',
        example:
          'A surprise Hawkish Federal Reserve press conference typically pushes USD pairs sharply in the Dollar’s favor.',
      },
      {
        term: 'CPI (Consumer Price Index)',
        shortCode: 'CPI',
        definition:
          'The headline monthly inflation report. Hotter-than-expected CPI makes rate hikes (or delayed cuts) more likely, often strengthening the currency.',
        example:
          'US CPI coming in above forecast at 8:30 AM NY frequently triggers an instant 60–100 pip USD impulse.',
      },
      {
        term: 'NFP (Non-Farm Payrolls)',
        shortCode: 'NFP',
        definition:
          'The monthly US jobs report released on the first Friday of each month at 8:30 AM NY — one of the highest-volatility Forex events.',
        example:
          'Before NFP at 8:30 AM NY, spreads widen and price often whipsaws both sides of the London range.',
      },
      {
        term: 'Actual vs. Forecast Surprise',
        shortCode: 'Surprise',
        definition:
          'Markets price in the expected Forecast ahead of time; the biggest moves happen when the Actual number surprises far above or below expectations.',
        example:
          'A "good" number that still misses a sky-high Forecast can actually weaken the currency.',
      },
    ],
    sections: [
      {
        id: 'fmn-rates-and-cb',
        heading: '1. Interest Rate Differentials: The Engine Behind Big Forex Trends',
        body: 'Major central banks — the Federal Reserve (USD), ECB (EUR), Bank of England (GBP), and Bank of Japan (JPY) — set the macro tide.',
        bulletPoints: [
          'Money flows toward currencies offering higher (or rising) interest rates and away from currencies cutting rates.',
          'Pairing a strong Hawkish currency against a weak Dovish currency creates the cleanest multi-week directional trends.',
          'You do not need an economics degree — simply know which central banks are raising, holding, or cutting rates.',
        ],
        keyTakeaway:
          'When fundamental rate bias and 4H/1D market structure point the same direction, trend pullbacks work far better.',
      },
      {
        id: 'fmn-economic-calendar',
        heading: '2. The 60-Second Morning Economic Calendar Check',
        body: 'Never enter a Forex trade without checking the day’s red-folder economic schedule first.',
        bulletPoints: [
          'Top High-Impact Releases: Central Bank Rate Decisions (FOMC/ECB/BOE/BOJ), CPI (Inflation), NFP (US Jobs), and GDP/PMI surprises.',
          'Pre-News Chop: In the 2–4 hours before FOMC or NFP, price frequently stalls inside tight fakeout ranges.',
          'Risk Rule: Avoid opening brand-new intraday trades 15 minutes before red-folder news — slippage can blow right past your SL (Stop Loss).',
        ],
        keyTakeaway:
          'Checking the economic calendar takes one minute and saves you from gambling inside news roulette.',
      },
      {
        id: 'fmn-post-news-execution',
        heading: '3. Trading Safely AFTER High-Impact News Releases',
        body: 'You do not need to guess the news headline — let the news reveal institutional intent, then trade the clean aftermath.',
        bulletPoints: [
          'Step 1: Watch the first 15 minutes hands-off while spreads normalize and initial whipsaw liquidity clears.',
          'Step 2: Look for a classic post-news sweep of the pre-news high/low followed by clean 5m/15m displacement and BOS (Break of Structure).',
          'Step 3: Enter on the structured pullback (FVG / Order Block) with a normal, predictable SL (Stop Loss).',
        ],
        keyTakeaway:
          'Professionals rarely gamble on the news spike itself — they trade the clean trend continuation or reversal right after it.',
      },
    ],
    diagramConfig: {
      kind: 'market_sessions',
      title: 'High-Impact News Playbook: Pre-News Chop → Spike → Clean Post-News Entry',
      subtitle: 'Skip the chaotic 8:30 AM NY whipsaw and execute only after structure confirms',
      caption:
        'Red-folder news releases like CPI and NFP often sweep both sides of the pre-news range before launching the true directional move.',
      legend: [
        { label: 'Post-News Clean Trend', colorToken: 'emerald' },
        { label: 'Pre-News Range / Whipsaw', colorToken: 'amber' },
        { label: 'News Slippage Danger Zone', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'fmn-a1',
          label: 'Calendar Check',
          sublabel: 'Flag CPI · NFP · FOMC First',
          tone: 'neutral',
        },
        {
          id: 'fmn-a2',
          label: '15m Cooldown',
          sublabel: 'Let Whipsaw & Spreads Settle',
          tone: 'bearish',
        },
        {
          id: 'fmn-a3',
          label: 'Post-News Pullback',
          sublabel: 'Normal Spread + Clean BOS',
          tone: 'bullish',
        },
      ],
      walkthroughSteps: [
        'Check the Economic Calendar before your session and mark exact red-folder times (like 8:30 AM NY CPI/NFP).',
        'Stay flat 15 minutes before the release so wide spreads and slippage cannot jump over your SL (Stop Loss).',
        'Watch the initial spike clear resting pre-news liquidity and wait 15–30 minutes for spreads to tighten.',
        'Trade the clean post-news structure pullback aligned with the fresh macro momentum.',
      ],
    },
    chartScenarioIds: ['fx-london-sweep'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Let the News Storm Pass Before Stepping Outside',
        summary:
          'Interest rates steer the big weekly direction; red-folder news (CPI, NFP, FOMC) creates 15-minute storms you should watch safely from the sidelines.',
        steps: [
          'Check the economic calendar before placing any Forex trade.',
          'Stay out right before major red-folder announcements.',
          'Wait 15–30 minutes for the wild wicks to calm down, then trade clean structure.',
        ],
        keyTakeaway:
          'You never get paid extra for gambling on the exact second of a news release.',
        practiceSafeHint:
          'Look for how price often pokes one direction on news and then immediately reverses.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: 'Post-CPI / Post-NFP Execution Routine',
        summary:
          'Turn chaotic news days into calm, rule-based setups.',
        steps: [
          '1. Mark the pre-news high and low 15 minutes before release.',
          '2. Do NOT click buy or sell during the first 15 minutes.',
          '3. Wait for spreads to return to normal and a clear 15m candle close + BOS.',
          '4. Enter on the structured pullback with your standard 1R risk.',
        ],
        keyTakeaway:
          'Post-news pullbacks offer big volatility WITH controlled stops.',
        practiceSafeHint:
          'Verify whether the first news spike was simply a liquidity sweep of the pre-news range.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: '8:30 AM NY CPI Double-Sweep Pattern on EUR/USD',
        summary:
          'At 8:30 AM, EUR/USD spikes 30 pips up in 8 seconds (stopping early shorts), then slams 75 pips down cleanly after hot US inflation data.',
        steps: [
          'Gamblers who shorted at 8:29 AM got stopped out by the initial 30-pip upward whipsaw.',
          'Patient traders waited until 8:45 AM, saw clean bearish displacement, and shorted the pullback smoothly.',
        ],
        keyTakeaway:
          'Waiting 15 minutes protects you from the two-way news whip while still catching the real move.',
        practiceSafeHint:
          'Check if a sharp news wick cleared obvious stops right before reversing.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Airport Runway After a Thunderstorm Analogy',
        summary:
          'Pilots do not land in the middle of a lightning burst — they circle calmly for 15 minutes and land smoothly once the runway clears.',
        steps: [
          'Economic Calendar = your weather radar.',
          'The 8:30 AM spike = the lightning burst.',
          'Post-news pullback = the clear runway.',
        ],
        keyTakeaway:
          'Always check your weather radar before takeoff.',
        practiceSafeHint:
          'Ask whether a red-folder release is scheduled within the next 30 minutes.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Gambling the News Spike vs. Trading the Post-News Structure',
        summary:
          'Compare risk control across both approaches.',
        steps: [
          'News Spike Gambling: Huge spreads, unpredictable slippage past SL, 50/50 whipsaw coin flip.',
          'Post-News Structure: Normal spreads, clear institutional direction, clean SL invalidation.',
          'Verdict: Only trade post-news confirmation.',
        ],
        keyTakeaway:
          'Predictable risk beats adrenaline every single time.',
        practiceSafeHint:
          'Compare spread width at 8:30:02 AM vs. 8:45:00 AM.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 News-Day Traps That Blow Forex Accounts',
        summary:
          'Avoid these avoidable calendar mistakes.',
        steps: [
          'Mistake 1: Not checking the economic calendar and getting blindsided mid-trade by CPI or FOMC.',
          'Mistake 2: Assuming a "green" news number guarantees a straight line up without a whipsaw.',
          'Mistake 3: Forcing trades during dead pre-FOMC morning chop.',
        ],
        keyTakeaway:
          'Know the calendar every morning — staying flat before big news is a winning decision.',
        practiceSafeHint:
          'Pause new entries whenever a red-folder release for your currency is under 15 minutes away.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-fmn-1',
        lessonSlug: 'forex-macro-news-rates',
        conceptKey: 'forex-macro-news',
        scenarioId: 'fx-london-sweep',
        prompt:
          'If a Central Bank turns unexpectedly "Hawkish" (signaling higher interest rates to fight inflation), what is the typical macro effect on its currency?',
        options: [
          { id: 'a', label: 'Generally bullish, as higher yields attract global capital into that currency' },
          { id: 'b', label: 'Always causes the currency to fall to zero' },
          { id: 'c', label: 'Has zero impact on Forex markets' },
          { id: 'd', label: 'Closes the Forex market for one week' },
        ],
        correctOptionId: 'a',
        hints: [
          'Global capital gravitates toward currencies paying higher safe interest yields.',
        ],
        postSubmissionRationale:
          'A Hawkish shift raises interest-rate expectations, attracting institutional yield demand and typically strengthening that currency.',
        commonTrapNote:
          'Confusing Hawkish (higher rates / inflation-fighting) with Dovish (lower rates / stimulus) flips your macro bias backward.',
      },
      {
        id: 'pq-fmn-2',
        lessonSlug: 'forex-macro-news-rates',
        conceptKey: 'forex-macro-news',
        prompt:
          'What is the safest, highest-discipline approach for beginners on major red-folder news releases like US CPI or NFP?',
        options: [
          { id: 'a', label: 'Enter 10 seconds before the announcement with maximum leverage' },
          { id: 'b', label: 'Remove your SL (Stop Loss) so whipsaws cannot stop you out' },
          { id: 'c', label: 'Stay flat during the initial release, wait 15–30 minutes for spreads to normalize, and trade clean post-news structure' },
          { id: 'd', label: 'Buy and sell at the exact same second blindly' },
        ],
        correctOptionId: 'c',
        hints: [
          'Think about how spreads and slippage behave in the first few seconds after CPI or NFP.',
        ],
        postSubmissionRationale:
          'Waiting 15–30 minutes lets extreme spread widening and two-way stop-hunts settle so you can execute a clean, controlled risk setup.',
        commonTrapNote:
          'Slippage during red-folder news can fill your stop loss far worse than your planned -1R.',
      },
    ],
  },

  // =========================================================================
  // MODULE 22: Stocks Track 1 — Market Hours, Volume & Order Types
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000024',
    slug: 'stocks-market-hours-volume-order-types',
    title: 'Stocks Foundations: Market Hours, Share Sizing & Order Types',
    subtitle:
      'Learn how US Stock exchanges work: Pre-Market vs. Regular Hours (9:30 AM–4:00 PM ET), Market/Limit/Stop orders, Share Sizing math, and Liquidity checks.',
    plainEnglishSummary:
      'Unlike 24/7 Crypto, US Stocks (like AAPL, NVDA, MSFT, TSLA) trade their deepest volume during Regular Market Hours: 9:30 AM to 4:00 PM New York time (ET). Knowing which order type to click — Market, Limit, or Stop-Limit — and calculating exact Share Count from your SL (Stop Loss) keeps you safe from bad fills and wide pre-market spreads.',
    beginnerFaq: [
      {
        question: 'When are US Stock Market hours, and should beginners trade Pre-Market?',
        answer:
          'Regular hours run 9:30 AM–4:00 PM ET (Monday–Friday). Pre-Market (4:00 AM–9:30 AM ET) and After-Hours (4:00 PM–8:00 PM ET) have much thinner volume and wider spreads — beginners should use Pre-Market only to map levels and wait for 9:30 AM Regular Hours to trade.',
      },
      {
        question: 'When should I use a Limit Order vs. a Market Order on Stocks?',
        answer:
          'Use a Limit Order to control the exact maximum price you will pay (or minimum price you will sell for). Only use a Market Order on ultra-liquid mega-cap stocks (like AAPL, SPY, NVDA) during Regular Hours when speed matters more than 1–2 cents.',
      },
      {
        question: 'How do I calculate exact Share Size for any Stock trade?',
        answer:
          'Simple formula: Shares = Risk $ ÷ (Entry Price − Stop Loss Price). Example: Risking $100 on AAPL entering at $200 with SL (Stop Loss) at $198 ($2 stop) = $100 ÷ $2 = 50 shares.',
      },
    ],
    level: 'beginner',
    marketCategory: 'stocks',
    learningStage: 'market_playbooks',
    moduleOrder: 22,
    conceptKey: 'stocks-hours-orders',
    estimatedMinutes: 16,
    learningObjectives: [
      'Navigate Pre-Market, Regular Trading Hours (9:30 AM–4:00 PM ET), Power Hour, and After-Hours liquidity.',
      'Choose the right order type — Market, Limit, Stop-Loss, and Stop-Limit — without accidental slippage.',
      'Calculate exact Share Count cleanly using Shares = Risk $ ÷ Stop Distance ($).',
      'Filter out illiquid penny stocks by requiring healthy daily volume and tight Bid/Ask spreads.',
    ],
    prerequisites: [
      'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
      'Risk Management, Position Sizing & Trading Psychology',
    ],
    terminology: [
      {
        term: 'Regular Trading Hours vs. Extended Hours',
        shortCode: 'RTH (9:30–4:00 ET)',
        definition:
          'Regular Trading Hours (9:30 AM–4:00 PM ET) hold peak institutional volume and tightest spreads. Pre-Market and After-Hours have thinner order books and wider spreads.',
        example:
          'Map overnight Pre-Market High/Low at 9:15 AM ET, then execute during active RTH volume after 9:30 AM.',
      },
      {
        term: 'Market Order vs. Limit Order',
        shortCode: 'MKT / LMT',
        definition:
          'A Market Order fills immediately at whatever price is available; a Limit Order only fills at your exact chosen price or better.',
        example:
          'Setting a Buy Limit at $185.00 guarantees you never pay $185.40 during a quick spike.',
      },
      {
        term: 'Stop Order (Stop Loss) & Stop-Limit',
        shortCode: 'STP / SL',
        definition:
          'A Stop Order triggers a Market exit once price hits your invalidation level to guarantee getting out; a Stop-Limit caps exit price but risks staying unfilled in a fast gap.',
        example:
          'On liquid stocks like AAPL or NVDA, a standard Stop Loss order ensures you actually exit when invalidated.',
      },
      {
        term: 'Share Sizing & Float / Average Volume',
        shortCode: 'Shares / Avg Vol',
        definition:
          'Shares = Risk $ ÷ ($ per share stop risk). Checking Average Daily Volume (ideally 2M+ shares/day) ensures tight spreads and smooth fills.',
        example:
          'Risking $100 with a $2.50 stop on NVDA = $100 ÷ $2.50 = 40 shares.',
      },
    ],
    sections: [
      {
        id: 'sho-market-clock',
        heading: '1. The Stock Market Clock: When Volume Actually Shows Up',
        body: 'Stock liquidity follows a predictable U-shaped rhythm every weekday.',
        bulletPoints: [
          'Pre-Market (4:00–9:30 AM ET): News gaps form here — mark Pre-Market High/Low, but avoid sloppy thin fills.',
          'Opening Drive (9:30–11:00 AM ET): Peak daily volume, cleanest breakouts, and highest institutional movement.',
          'Midday Lull (11:30 AM–2:00 PM ET): Volume dries up and choppy fakeouts rise — protect profits and trade less.',
          'Power Hour (3:00–4:00 PM ET): Institutions rebalance into the closing bell, creating a second clean volume wave.',
        ],
        keyTakeaway:
          'Focus your Stock screen time on the Opening Drive (9:30–11:00 AM ET) and Power Hour (3:00–4:00 PM ET).',
      },
      {
        id: 'sho-order-types',
        heading: '2. Mastering Market, Limit & Stop Orders Safely',
        body: 'Clicking the wrong order type on a fast stock can cost you 0.5R before the trade even starts.',
        bulletPoints: [
          'Limit Order: Your default tool for planned entries and TP (Take Profit) targets — zero surprise fill prices.',
          'Stop Loss (Stop Market): Your default safety net on liquid stocks so you exit reliably if price hits invalidation.',
          'Market Order: Use sparingly and ONLY on ultra-liquid stocks with 1–2 cent Bid/Ask spreads.',
          'Note: Standard Stop orders do NOT trigger in Pre-Market/After-Hours on most brokers — be careful holding intraday positions overnight.',
        ],
        keyTakeaway:
          'Limit to enter cleanly, Stop to protect your downside, and never use Market orders in thin Pre-Market books.',
      },
      {
        id: 'sho-share-math',
        heading: '3. Exact Share Sizing & Liquid Stock Selection',
        body: 'Every stock trades at a different dollar price ($20 vs. $500), so share count must always come from your stop distance.',
        bulletPoints: [
          'Formula: Shares = Risk $ ÷ |Entry Price − SL (Stop Loss) Price|.',
          'Example: $10,000 account, 1% risk ($100). Entry $150.00, SL $148.00 ($2.00 risk/share) → Buy 50 shares.',
          'Liquidity Filter: Stick to stocks averaging 2M+ daily shares with tight spreads (≤ $0.05) — skip low-volume penny stocks.',
        ],
        keyTakeaway:
          '50 shares of a $200 stock with a $2 stop has the EXACT same $100 risk as 200 shares of a $40 stock with a $0.50 stop.',
      },
    ],
    diagramConfig: {
      kind: 'stocks_orb_gap',
      title: 'US Stock Trading Day & Order Execution Blueprint',
      subtitle: 'Map Pre-Market levels, execute during 9:30 AM RTH volume, and size exact shares',
      caption:
        'Peak equity volume clusters at the 9:30 AM ET open and 3:00 PM ET close, giving Limit and Stop orders tight spreads and reliable fills.',
      legend: [
        { label: '9:30 AM RTH Volume Drive', colorToken: 'emerald' },
        { label: 'Pre-Market / Midday Thinness', colorToken: 'amber' },
        { label: 'Hard SL & Share Math', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'sho-a1',
          label: 'Pre-Market Map',
          sublabel: 'Mark Levels · Avoid Thin Fills',
          tone: 'neutral',
        },
        {
          id: 'sho-a2',
          label: '9:30–11:00 AM ET',
          sublabel: 'Peak Liquidity & Tight Spreads',
          tone: 'bullish',
        },
        {
          id: 'sho-a3',
          label: 'Share Formula',
          sublabel: 'Risk $ ÷ ($ Entry − $ SL)',
          tone: 'liquidity',
        },
      ],
      walkthroughSteps: [
        'Use Pre-Market (before 9:30 AM ET) strictly to identify liquid stocks (2M+ avg volume) and mark key highs/lows.',
        'Wait for Regular Trading Hours (9:30 AM ET) when spreads tighten and real institutional volume appears.',
        'Compute exact share count via Shares = Risk $ ÷ Stop Distance ($).',
        'Use Limit orders for clean entries and hard Stop Loss orders to cap every loss at -1R.',
      ],
    },
    chartScenarioIds: ['stk-aapl-orb-gap'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Trade Stocks When the Store Is Actually Open and Busy',
        summary:
          '9:30 AM–11:00 AM ET is prime time for US Stocks. Use Limit orders to pick your price and divide your risk dollars by stop dollars to get exact shares.',
        steps: [
          'Check Pre-Market levels, but wait for 9:30 AM ET to trade.',
          'Calculate Shares = Risk $ ÷ Stop Distance ($).',
          'Stick to well-known liquid stocks with tight 1–5 cent spreads.',
        ],
        keyTakeaway:
          'Liquid stocks + Limit entries + exact share sizing make Stock trading calm and predictable.',
        practiceSafeHint:
          'Check the volume bars at 9:30 AM compared to 1:00 PM midday.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Step Stock Order Ticket Formula',
        summary:
          'Calculate your ticket cleanly before clicking Submit.',
        steps: [
          '1. Pick Entry ($210.00) and Structural SL ($208.00) → Stop Distance = $2.00.',
          '2. Divide Risk $ ($100) ÷ $2.00 = 50 shares.',
          '3. Submit Limit Buy for 50 shares with Stop Loss at $208.00 and TP at $216.00 (+3R).',
        ],
        keyTakeaway:
          'Pre-calculating shares removes all guesswork from equity sizing.',
        practiceSafeHint:
          'Confirm your Bid/Ask spread is only a few cents before submitting.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'AAPL Opening Drive Share Math',
        summary:
          'AAPL breaks above its 9:35 AM opening range at $212.00 with structural invalidation at $210.50 ($1.50 stop).',
        steps: [
          'With $150 max risk (1% of $15,000): $150 ÷ $1.50 = 100 shares.',
          'Target at +$4.50 ($216.50) yields +$450 (+3R) cleanly before midday lull.',
        ],
        keyTakeaway:
          'Clean dollar-per-share math works on every single stock ticker.',
        practiceSafeHint:
          'Notice how AAPL’s tight $0.01 spread makes entries and stops crisp.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Price-Tag Limit Order Analogy',
        summary:
          'A Limit Order is walking into a shop and saying "I will only buy this jacket if it costs $100 or less." A Market Order is handing over your card and saying "Charge me whatever the sticker says right now!"',
        steps: [
          'In a busy store (Regular Hours), Market prices are fair.',
          'In an empty late-night store (Pre-Market), a Market Order can overcharge you badly.',
        ],
        keyTakeaway:
          'Use Limit orders whenever spreads are wide or volatility is spiking.',
        practiceSafeHint:
          'Check whether a Limit order protects you from sudden open-bell slippage.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Market Order vs. Limit Order vs. Stop Order',
        summary:
          'Each order type solves one specific job.',
        steps: [
          'Market Order: Guarantees speed, NOT price.',
          'Limit Order: Guarantees price (or better), NOT immediate fill.',
          'Stop Order: Waits quietly until your SL price hits, then exits to protect capital.',
        ],
        keyTakeaway:
          'Match the order tool to the job — Limit for entry/TP, Stop for SL protection.',
        practiceSafeHint:
          'Ask whether you need price precision (Limit) or guaranteed exit (Stop).',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Beginner Stock Execution Errors',
        summary:
          'Steer clear of these common equity rookie mistakes.',
        steps: [
          'Mistake 1: Clicking Market Buy on a thin Pre-Market stock and getting filled $0.80 worse than expected.',
          'Mistake 2: Always buying "100 shares" regardless of whether the stop is $0.50 or $5.00 wide.',
          'Mistake 3: Overtrading dead 12:30 PM midday chop after a great morning.',
        ],
        keyTakeaway:
          'Trade the active windows, size by stop distance, and respect spreads.',
        practiceSafeHint:
          'Check average daily volume before putting any ticker on your watchlist.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-sho-1',
        lessonSlug: 'stocks-market-hours-volume-order-types',
        conceptKey: 'stocks-hours-orders',
        scenarioId: 'stk-aapl-orb-gap',
        prompt:
          'You plan to buy a stock at $120.00 with a structural SL (Stop Loss) at $117.50 ($2.50 risk per share). If your maximum trade risk is $100, how many shares should you buy?',
        options: [
          { id: 'a', label: '100 shares' },
          { id: 'b', label: '40 shares ($100 ÷ $2.50)' },
          { id: 'c', label: '25 shares' },
          { id: 'd', label: '250 shares' },
        ],
        correctOptionId: 'b',
        hints: [
          'Divide your total Risk $ ($100) by your per-share stop distance ($2.50).',
        ],
        postSubmissionRationale:
          'Shares = $100 ÷ $2.50 = 40 shares. If the stock drops $2.50 to $117.50, your loss is capped at exactly $100 (-1R).',
        commonTrapNote:
          'Buying a fixed round number like 100 shares here would accidentally risk $250 (2.5× your plan).',
      },
      {
        id: 'pq-sho-2',
        lessonSlug: 'stocks-market-hours-volume-order-types',
        conceptKey: 'stocks-hours-orders',
        prompt:
          'Which order type guarantees your maximum buy price (or better), protecting you from sudden slippage in fast or thin stock markets?',
        options: [
          { id: 'a', label: 'Market Order' },
          { id: 'b', label: 'Limit Order' },
          { id: 'c', label: 'Overnight Hold' },
          { id: 'd', label: 'Random Lot Order' },
        ],
        correctOptionId: 'b',
        hints: [
          'One order prioritizes instant fill at any price; the other puts a strict ceiling on what you pay.',
        ],
        postSubmissionRationale:
          'A Buy Limit order only executes at your specified price or lower, shielding you from unexpected spread or spike slippage.',
        commonTrapNote:
          'Using Market orders on thin Pre-Market or small-cap tickers frequently results in painful instant slippage.',
      },
    ],
  },

  // =========================================================================
  // MODULE 24: Stocks Track 3 — Earnings Catalysts & Relative Strength
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000025',
    slug: 'stocks-earnings-relative-strength',
    title: 'Stocks Edge: Earnings Catalysts, Sector Leaders & Relative Strength',
    subtitle:
      'Trade institutional "Stocks in Play" after quarterly earnings using Relative Strength vs. SPY/QQQ so you back market leaders instead of laggards.',
    plainEnglishSummary:
      'Every quarter, public companies announce their Earnings (revenue, profits, and future guidance). Big institutions cannot buy or sell millions of shares in one second — so a strong earnings surprise often triggers multi-day directional trends. By comparing a stock’s chart against the S&P 500 (SPY), you immediately spot Relative Strength leaders that climb effortlessly while the broader market rests.',
    beginnerFaq: [
      {
        question: 'Should I buy a stock BEFORE Earnings hoping it jumps overnight?',
        answer:
          'No — holding a short-term trade through an overnight Earnings announcement is a pure coin-flip gamble where an adverse -15% gap jumps straight past your SL (Stop Loss). Professionals wait for Earnings to come out FIRST, then trade the clean high-volume trend afterward.',
      },
      {
        question: 'What is Relative Strength (RS) in Stock trading?',
        answer:
          'Relative Strength compares how a single stock performs against the overall market (like SPY). If SPY drops to a new low of the day while NVDA holds firmly near its highs, NVDA has strong Relative Strength — meaning institutions are actively accumulating it.',
      },
      {
        question: 'Why does Sector alignment matter for Stock traders?',
        answer:
          'Stocks move in packs! When Technology or Semiconductors are leading the day, buying the #1 strongest stock in that leading sector puts both stock-specific buyers and sector-ETF flows behind your trade.',
      },
    ],
    level: 'intermediate',
    marketCategory: 'stocks',
    learningStage: 'market_playbooks',
    moduleOrder: 24,
    conceptKey: 'stocks-earnings-rs',
    estimatedMinutes: 18,
    learningObjectives: [
      'Explain why trading AFTER an Earnings surprise beats gambling on overnight binary gaps.',
      'Spot institutional Relative Strength (RS) and Relative Weakness (RW) by comparing a stock directly against SPY/QQQ.',
      'Combine fresh Catalyst + RVOL (Relative Volume ≥ 2.0) + Leading Sector to pick top equity setups.',
      'Execute disciplined multi-day or intraday pullbacks on post-earnings "Stocks in Play."',
    ],
    prerequisites: [
      'Stocks Foundations: Market Hours, Share Sizing & Order Types',
      'Stocks Playbook: Pre-Market Gaps, RVOL & Opening Range',
    ],
    terminology: [
      {
        term: 'Earnings Catalyst & Guidance',
        shortCode: 'Earnings',
        definition:
          'Quarterly company financial results plus forward outlook (Guidance). Guidance surprises often matter even more than past-quarter earnings.',
        example:
          'A company beating revenue AND raising full-year Guidance attracts multi-day institutional buying.',
      },
      {
        term: 'Relative Strength (vs. SPY)',
        shortCode: 'RS',
        definition:
          'A stock holding higher lows or breaking higher while the broad S&P 500 (SPY) pulls back — proving real institutional demand.',
        example:
          'SPY dips -0.4% at 10:15 AM while MSFT barely pulls back and breaks its morning high.',
      },
      {
        term: 'Relative Weakness (vs. SPY)',
        shortCode: 'RW',
        definition:
          'A stock dropping to fresh lows while the broad market bounces — signaling heavy institutional distribution.',
        example:
          'SPY rallies back to VWAP while a weak post-earnings ticker keeps making Lower Lows.',
      },
      {
        term: 'Post-Earnings Drift (Day 1 / Day 2 Play)',
        shortCode: 'Day 2',
        definition:
          'Multi-day institutional accumulation or distribution that continues on Day 2 and Day 3 after a major earnings shock.',
        example:
          'After an explosive Day 1 earnings breakout on 4× RVOL, Day 2 offers a calm pullback above Day 1’s midpoint.',
      },
    ],
    sections: [
      {
        id: 'ser-post-earnings',
        heading: '1. Never Gamble Earnings Overnight — Trade the Post-Earnings Trend',
        body: 'The #1 edge of institutional prop-desk stock traders is reacting to fresh Earnings surprises AFTER the numbers are public.',
        bulletPoints: [
          'Always check your ticker’s next Earnings date — never get surprised by an overnight gap that jumps past your SL (Stop Loss).',
          'Focus on genuine surprises: strong Earnings + raised Guidance + massive RVOL (Relative Volume ≥ 2.0–3.0).',
          'Let the first 5–15 minutes of open-bell volatility settle, then trade clean structure (ORB, VWAP hold, or Higher Low BOS).',
        ],
        keyTakeaway:
          'Big funds take days to build positions after a huge earnings beat — you do not need to guess the headline in advance.',
      },
      {
        id: 'ser-relative-strength',
        heading: '2. Spotting True Relative Strength (RS) Against SPY',
        body: 'Keep SPY (S&P 500 ETF) visible in a corner chart whenever you trade individual Stocks.',
        bulletPoints: [
          'Bullish RS Signal: SPY makes a Lower Low pullback, while your stock holds a Higher Low and stays above VWAP.',
          'The Instant SPY turns up even slightly, the Relative Strength leader explodes cleanly to fresh highs.',
          'Mirror Rule for Shorts: Look for Relative Weakness (RW) stocks making new lows while SPY attempts to bounce.',
        ],
        keyTakeaway:
          'Buy the stock that refuses to fall when SPY dips — that is institutional footprints in plain sight.',
      },
      {
        id: 'ser-sector-leaders',
        heading: '3. Backing the #1 Leader in the Strongest Sector',
        body: 'Do not buy the cheap "sympathy laggard" hoping it catches up — back the clear leader.',
        bulletPoints: [
          'Check which sector is leading today (Tech, Semiconductors, Financials, Energy, Healthcare).',
          'Choose the liquid leader printing the cleanest HH/HL structure and highest RVOL.',
          'Trail stops cleanly below structural Higher Lows on Day 1 and Day 2 runners so big post-earnings trends pay multiples of R.',
        ],
        keyTakeaway:
          'Fresh Catalyst + Leading Sector + Relative Strength vs. SPY = an A+ institutional Stock setup.',
      },
    ],
    diagramConfig: {
      kind: 'stocks_orb_gap',
      title: 'Post-Earnings Relative Strength Playbook',
      subtitle: 'Skip overnight binary risk — buy Relative Strength leaders holding firm while SPY dips',
      caption:
        'When a post-earnings Stock in Play refuses to drop during a broad market pullback, institutional accumulation fuels crisp continuation breakouts.',
      legend: [
        { label: 'RS Leader Breakout', colorToken: 'emerald' },
        { label: 'SPY Broad Pullback', colorToken: 'amber' },
        { label: 'Structural SL Below HL', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'ser-a1',
          label: 'Fresh Earnings + RVOL',
          sublabel: 'Real Institutional Catalyst',
          tone: 'bullish',
        },
        {
          id: 'ser-a2',
          label: 'RS vs. SPY Check',
          sublabel: 'Holds HL While SPY Dips',
          tone: 'liquidity',
        },
        {
          id: 'ser-a3',
          label: 'Zero Overnight Gamble',
          sublabel: 'Trade Clean Day 1 / Day 2',
          tone: 'neutral',
        },
      ],
      walkthroughSteps: [
        'Check the Earnings calendar first so you never accidentally hold a short-term trade through an overnight binary gap.',
        'Build your morning watchlist around fresh post-earnings surprises showing RVOL ≥ 2.0 and clean gaps.',
        'Compare your stock directly to SPY — favor leaders holding Higher Lows while SPY pulls back.',
        'Enter on confirmed structure break or pullback with a clear SL (Stop Loss) and let Day 1/Day 2 institutional flow carry the runner.',
      ],
    },
    chartScenarioIds: ['stk-aapl-orb-gap'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Back the Strongest Runner in the Race',
        summary:
          'Wait until Earnings are announced, then buy the stock that stays strong even when the S&P 500 (SPY) takes a dip.',
        steps: [
          'Never hold a short-term trade blindly through an overnight Earnings report.',
          'Watch which post-earnings stock refuses to drop when SPY pulls back.',
          'Buy the clean pullback on that Relative Strength leader with a clear SL.',
        ],
        keyTakeaway:
          'Relative Strength tells you exactly which stock big funds are quietly buying today.',
        practiceSafeHint:
          'Compare your stock’s pullback depth side-by-side against SPY’s pullback.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '4-Point Post-Earnings RS Checklist',
        summary:
          'Filter for institutional-grade equity setups in two minutes.',
        steps: [
          '1. Fresh Earnings beat + positive Guidance.',
          '2. RVOL (Relative Volume) ≥ 2.0 on the morning drive.',
          '3. Clear Relative Strength (holding above VWAP/HL while SPY dips).',
          '4. Defined structural SL (Stop Loss) with at least 1:2.5 reward-to-risk.',
        ],
        keyTakeaway:
          'Four clear boxes separate A+ institutional trends from sleepy sideways stocks.',
        practiceSafeHint:
          'Check whether volume expands cleanly as price breaks above consolidation.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'SPY Pullback vs. Post-Earnings Leader Breakout',
        summary:
          'At 10:10 AM ET, SPY drops 0.35% below its opening range, while post-earnings NVDA holds flat above VWAP with tiny red volume.',
        steps: [
          'At 10:20 AM, SPY simply stabilizes — NVDA immediately erupts +2.5% to new highs of the day.',
          'Traders who spotted RS got a clean low-risk entry right before the expansion.',
        ],
        keyTakeaway:
          'A beach ball held underwater shoots up the fastest the moment broad selling pauses.',
        practiceSafeHint:
          'Look for tight, shallow pullbacks on low volume right above VWAP.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Beach Ball Underwater Analogy',
        summary:
          'A Relative Strength stock during a market dip is like a beach ball pushed underwater — the second the broad market stops pressing down, it pops straight to the surface.',
        steps: [
          'Earnings surprise = pumping extra air into the ball.',
          'SPY dip = temporarily pushing down.',
          'SPY bounce = releasing the ball for a fast breakout.',
        ],
        keyTakeaway:
          'Trade beach balls (RS leaders), never heavy rocks (laggards).',
        practiceSafeHint:
          'Ask which stock on your watchlist is resisting broad market selling the best.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Gambling Pre-Earnings vs. Trading Post-Earnings Continuation',
        summary:
          'Professional risk control vs. casino guessing.',
        steps: [
          'Pre-Earnings Hold: Binary overnight gap can blow 5× past your SL (Stop Loss).',
          'Post-Earnings Trend: Catalyst is already known, volume is real, and SL executes cleanly.',
          'Rule: Trade the institutional reaction, never the blind guess.',
        ],
        keyTakeaway:
          'Knowing the news first lets you manage risk mathematically.',
        practiceSafeHint:
          'Always verify the upcoming Earnings date before holding any swing trade overnight.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Earnings & Relative Strength Pitfalls',
        summary:
          'Avoid these classic Stock trader mistakes.',
        steps: [
          'Mistake 1: Forgetting a company reports Earnings after the bell and waking up to a -18% gap.',
          'Mistake 2: Buying a weak stock "because it looks cheap" while its sector leader breaks out.',
          'Mistake 3: Chasing the very first 9:30 AM candle spike instead of waiting for a structured pullback.',
        ],
        keyTakeaway:
          'Patience for structure + RS alignment keeps equity trading sharp and repeatable.',
        practiceSafeHint:
          'Check if the stock is leading or lagging SPY before clicking buy.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ser-1',
        lessonSlug: 'stocks-earnings-relative-strength',
        conceptKey: 'stocks-earnings-rs',
        scenarioId: 'stk-aapl-orb-gap',
        prompt:
          'While the S&P 500 (SPY) pulls back to a fresh intraday low, Stock A holds firmly above VWAP and prints Higher Lows on strong RVOL. What does this signal?',
        options: [
          { id: 'a', label: 'Strong Relative Strength (RS) — institutions are actively supporting Stock A' },
          { id: 'b', label: 'Stock A is broken and should be shorted immediately' },
          { id: 'c', label: 'Volume does not matter for Stock A' },
          { id: 'd', label: 'Stock A is guaranteed never to pull back' },
        ],
        correctOptionId: 'a',
        hints: [
          'When a stock refuses to fall while the broad market sells off, who is absorbing all the selling?',
        ],
        postSubmissionRationale:
          'Holding Higher Lows and staying above VWAP while SPY drops is textbook institutional Relative Strength, priming the stock to lead once SPY stabilizes.',
        commonTrapNote:
          'Shorting Relative Strength leaders "because they look high" puts you directly in front of institutional buying.',
      },
      {
        id: 'pq-ser-2',
        lessonSlug: 'stocks-earnings-relative-strength',
        conceptKey: 'stocks-earnings-rs',
        prompt:
          'Why do disciplined short-term Stock traders avoid holding positions blindly through an overnight Earnings announcement?',
        options: [
          { id: 'a', label: 'Because stock brokers charge 50% commission on Earnings days' },
          { id: 'b', label: 'Because a sudden overnight price gap can open far past your SL (Stop Loss), turning a planned -1R trade into a massive loss' },
          { id: 'c', label: 'Because stocks never move after Earnings' },
          { id: 'd', label: 'Because Earnings only affect Forex pairs' },
        ],
        correctOptionId: 'b',
        hints: [
          'Can a normal Stop Loss protect you if a stock closes at $100 and opens the next morning at $82?',
        ],
        postSubmissionRationale:
          'Standard Stop Loss orders cannot execute inside an overnight gap — if a stock gaps down -18%, your exit fills at the much lower open price, shattering your 1R risk cap.',
        commonTrapNote:
          'Waiting until AFTER earnings lets you trade big volatility with a working, predictable Stop Loss.',
      },
    ],
  },

  // =========================================================================
  // MODULE 25: Indices Track 1 — NAS100, SPX500 & US30 Basics
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000026',
    slug: 'indices-nas100-spx500-basics',
    title: 'Indices Foundations: NAS100, SPX500 & US30 Points, Contracts & Volatility',
    subtitle:
      'Understand what a Stock Index actually is, compare NAS100 vs. SPX500 vs. US30 personality, and size index Points and Contracts without over-leveraging.',
    plainEnglishSummary:
      'A Stock Index is a weighted basket of top companies bundled into ONE single chart — so you do not have to guess which single stock will win. SPX500 tracks 500 major US companies (smooth, balanced), NAS100 tracks 100 top tech/growth giants (fast, explosive), and US30 tracks 30 blue-chip giants. Because Indices move in Points rather than Forex pips, checking your broker’s Dollar-per-Point value is essential before placing your first trade.',
    beginnerFaq: [
      {
        question: 'What is the real difference between NAS100, SPX500, and US30?',
        answer:
          'SPX500 (S&P 500 / ES / MES) is the broadest, smoothest US benchmark of 500 companies — ideal for beginners. NAS100 (Nasdaq 100 / NQ / MNQ) is heavily weighted in mega-cap tech (AAPL, MSFT, NVDA) and moves much faster with sharper wicks. US30 (Dow Jones / YM) tracks 30 major industrial/financial/blue-chip leaders.',
      },
      {
        question: 'Why does the same "1.00 lot" or "1 contract" risk totally different money on Indices vs. Forex?',
        answer:
          'Every broker and futures exchange sets its own Point Value (for example, Micro E-mini S&P MES = $5/point, Micro Nasdaq MNQ = $2/point, while CFD brokers vary from $0.10 to $10/point). Always verify Dollar-per-Point on a demo ticket before trading live!',
      },
      {
        question: 'Which Index should a beginner start practicing on first?',
        answer:
          'Start with SPX500 (S&P 500). It trends cleanly, respects liquidity levels smoothly, and has calmer wicks than hyper-volatile NAS100.',
      },
    ],
    level: 'beginner',
    marketCategory: 'indices',
    learningStage: 'market_playbooks',
    moduleOrder: 25,
    conceptKey: 'indices-basics',
    estimatedMinutes: 15,
    learningObjectives: [
      'Compare the composition, speed, and personality of SPX500 (S&P 500), NAS100 (Nasdaq 100), and US30 (Dow Jones).',
      'Distinguish Futures (ES/MES, NQ/MNQ) vs. Index CFDs and always verify Dollar-per-Point contract specs.',
      'Calculate exact Index contract/lot size from Risk $, Stop Distance (Points), and Dollar-per-Point.',
      'Explain why Indices carry natural long-term upward drift and concentrate peak action at the 9:30 AM NY Equity Open.',
    ],
    prerequisites: [
      'Chart Reading Fundamentals: Timeframes, Axes & Essential Tools',
      'Risk Management, Position Sizing & Trading Psychology',
    ],
    terminology: [
      {
        term: 'SPX500 (S&P 500 / ES / MES)',
        shortCode: 'SPX500',
        definition:
          'Market-cap-weighted basket of 500 leading US companies — the global institutional benchmark with smooth, balanced liquidity.',
        example:
          'Micro E-mini S&P 500 (MES) pays $5 per full point (1.00 move = $5).',
      },
      {
        term: 'NAS100 (Nasdaq 100 / NQ / MNQ)',
        shortCode: 'NAS100',
        definition:
          'Tech-heavy index of 100 major non-financial Nasdaq companies — famous for fast momentum, wide ranges, and sharp liquidity sweeps.',
        example:
          'Micro E-mini Nasdaq (MNQ) pays $2 per full point — a 50-point move equals $100 per Micro contract.',
      },
      {
        term: 'Point Value (Dollars per Point)',
        shortCode: '$/Point',
        definition:
          'How much money your trade gains or loses for every 1.0 full point move on the index chart. Varies by Futures contract vs. CFD broker.',
        example:
          'Risking $100 with a 25-point stop requires $4/point total (e.g., 2 MNQ contracts at $2/point).',
      },
      {
        term: 'Cash Equity Open (9:30 AM ET)',
        shortCode: '9:30 AM Open',
        definition:
          'The exact minute all 500 underlying US stocks open simultaneously on NYSE/Nasdaq, unleashing the biggest volume wave of the day.',
        example:
          'Overnight Globex/London index ranges are frequently swept within 10 minutes of 9:30 AM ET.',
      },
    ],
    sections: [
      {
        id: 'ib-three-indices',
        heading: '1. Meet the Big Three US Indices: SPX500, NAS100 & US30',
        body: 'Trading an Index lets you express a clean view on the US economy without single-company earnings surprise risk.',
        bulletPoints: [
          'SPX500 (S&P 500): Broadest 500-company benchmark — cleanest structure and best beginner starting point.',
          'NAS100 (Nasdaq 100): Heavily driven by mega-cap tech (AAPL, MSFT, NVDA, AMZN, META) — biggest daily point ranges and sharpest stop-hunts.',
          'US30 (Dow Jones): 30 large blue-chip companies — often rotates differently when money shifts from Tech into Industrials/Value.',
        ],
        keyTakeaway:
          'Start on SPX500 to master index rhythm before graduating to faster NAS100 volatility.',
      },
      {
        id: 'ib-points-and-sizing',
        heading: '2. Checking Point Value & Sizing Index Contracts Safely',
        body: 'The #1 beginner mistake on Indices is typing a Forex lot size into a NAS100 ticket and accidentally risking 10× too much.',
        bulletPoints: [
          'Formula: Contracts / Units = Risk $ ÷ (Stop Distance in Points × $ per Point).',
          'Futures Micro Example: On MNQ ($2/point), a 25-point SL (Stop Loss) risks $50 per contract — so a $100 risk cap allows 2 MNQ contracts.',
          'CFD Warning: Different brokers define "1.00 lot" on NAS100 as $1/point, $10/point, or $20/point — ALWAYS test 0.01 on demo first to verify exact $/point!',
        ],
        keyTakeaway:
          'Never place a live Index trade until you have verified your broker’s exact Dollar-per-Point multiplier.',
      },
      {
        id: 'ib-index-personality',
        heading: '3. Index Personality: Upward Bias & Active NY Windows',
        body: 'Indices behave differently from Forex pairs because economies grow over time and companies are replaced when they shrink.',
        bulletPoints: [
          'Respect the long-term upward structural bias — shorting blind tops during strong bull trends is a classic trap.',
          'Peak Liquidity Window: 9:30 AM–11:30 AM New York time delivers the cleanest swings; Asia and midday sessions are often slow.',
          'Because NAS100 moves 150–300+ points daily, widen your stop to real structural swings and scale contract count down.',
        ],
        keyTakeaway:
          'Trade Indices during active New York hours with contract size scaled strictly to Point distance.',
      },
    ],
    diagramConfig: {
      kind: 'market_sessions',
      title: 'US Indices Overview: SPX500 vs. NAS100 & Point Sizing',
      subtitle: 'Verify Dollar-per-Point contract specs and focus on peak 9:30 AM NY liquidity',
      caption:
        'SPX500 delivers balanced institutional flow while NAS100 amplifies daily point ranges — sizing strictly by Point Value keeps risk identical.',
      legend: [
        { label: '9:30 AM NY Peak Liquidity', colorToken: 'emerald' },
        { label: 'Overnight Range Levels', colorToken: 'amber' },
        { label: 'Point-Based SL Math', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'ib-a1',
          label: 'SPX500 vs. NAS100',
          sublabel: 'Smooth Benchmark vs. Fast Tech',
          tone: 'bullish',
        },
        {
          id: 'ib-a2',
          label: 'Check $/Point First',
          sublabel: 'MES $5/pt · MNQ $2/pt · Verify CFD',
          tone: 'liquidity',
        },
        {
          id: 'ib-a3',
          label: '9:30 AM ET Open',
          sublabel: 'Underlying Stocks Ignite Flow',
          tone: 'neutral',
        },
      ],
      walkthroughSteps: [
        'Choose your focus index: SPX500 for smooth beginner pace, or NAS100 once comfortable with faster swings.',
        'Verify exact Dollar-per-Point on your platform before risking a single dollar.',
        'Measure structural SL (Stop Loss) in Points and size contracts via Risk $ ÷ (Points × $/Point).',
        'Focus execution around the 9:30 AM–11:30 AM New York equity liquidity window.',
      ],
    },
    chartScenarioIds: ['idx-nas100-ny-open'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'An Index Is One Simple Chart for Hundreds of Top Companies',
        summary:
          'SPX500 is the smooth family sedan; NAS100 is the sports car. Check how many dollars 1 point equals on your platform before taking any trade.',
        steps: [
          'Start practicing on SPX500 before moving to faster NAS100.',
          'Check your platform’s exact $/point value on demo first.',
          'Size contracts using Risk $ ÷ (SL Points × $/Point).',
        ],
        keyTakeaway:
          'Know your Point Value first — then Index trading follows the exact same structure and liquidity rules.',
        practiceSafeHint:
          'Measure your stop distance in full points before opening the order ticket.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Step Index Contract Sizing Check',
        summary:
          'Keep every Index stop loss strictly capped at -1R.',
        steps: [
          '1. Confirm contract spec (e.g., MNQ = $2 per point).',
          '2. Measure structural SL distance (e.g., 25 points = $50 risk per contract).',
          '3. Divide $100 max risk ÷ $50/contract = 2 MNQ contracts.',
        ],
        keyTakeaway:
          'Micro futures and micro CFD sizing let small accounts trade Indices with precision.',
        practiceSafeHint:
          'Double-check whether your broker quotes $1, $2, $5, or $10 per point.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: 'Same $100 Risk on SPX500 vs. NAS100',
        summary:
          'SPX500 needs a 10-point stop (at $5/pt MES = $50/contract → 2 MES = $100 risk). NAS100 needs a 25-point stop (at $2/pt MNQ = $50/contract → 2 MNQ = $100 risk).',
        steps: [
          'Notice NAS100’s stop is 2.5× wider in points, yet total dollar risk stays identical at $100.',
        ],
        keyTakeaway:
          'Adjust contract size to each index’s volatility so both stay calm and controlled.',
        practiceSafeHint:
          'Compare average 5m candle height in points on SPX500 vs. NAS100.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Whole Fruit Basket vs. One Apple Analogy',
        summary:
          'Buying one stock is betting on a single apple; trading SPX500 is trading the entire fruit basket — no surprise bad earnings from one company can ruin your chart overnight.',
        steps: [
          'SPX500 = 500-company balanced basket.',
          'NAS100 = high-octane tech basket.',
          'Point Value = the price tag on each step the basket moves.',
        ],
        keyTakeaway:
          'Indices give you massive liquidity without single-stock earnings roulette.',
        practiceSafeHint:
          'Notice how cleanly major US Indices track broad market sentiment.',
      },
      comparison: {
        style: 'comparison',
        headline: 'SPX500 vs. NAS100 vs. US30',
        summary:
          'Choose the index that fits your temperament.',
        steps: [
          'SPX500: Balanced, smoother pullbacks, best beginner foundation.',
          'NAS100: Tech-heavy, explosive trends, sharper sweeps and wider stops.',
          'US30: 30 blue-chips, responds strongly to industrial/financial rotation.',
        ],
        keyTakeaway:
          'Master one index cleanly instead of flipping back and forth between all three.',
        practiceSafeHint:
          'Pick SPX500 or NAS100 and study its 9:30 AM behavior for 30 sessions straight.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Beginner Index Trading Traps',
        summary:
          'Prevent costly sizing and timing mistakes on Indices.',
        steps: [
          'Mistake 1: Assuming "1 lot" on a NAS100 CFD has the same dollar value across different brokers.',
          'Mistake 2: Using a tiny 5-point stop on NAS100 where one single 1-minute candle moves 15 points.',
          'Mistake 3: Trading NAS100 during dead 2:00 AM Asian chop and getting chewed up by spreads.',
        ],
        keyTakeaway:
          'Verify $/point, respect structural width, and trade the NY liquidity window.',
        practiceSafeHint:
          'Check your demo order fill P&L for a 1-point move to verify exact contract value.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-ib-1',
        lessonSlug: 'indices-nas100-spx500-basics',
        conceptKey: 'indices-basics',
        scenarioId: 'idx-nas100-ny-open',
        prompt:
          'On Micro E-mini Nasdaq (MNQ = $2 per point), your structural SL (Stop Loss) is 25 points away and your maximum risk is $100. How many MNQ contracts should you trade?',
        options: [
          { id: 'a', label: '1 contract ($50 risk)' },
          { id: 'b', label: '2 contracts (25 pts × $2/pt × 2 = $100)' },
          { id: 'c', label: '5 contracts ($250 risk)' },
          { id: 'd', label: '10 contracts ($500 risk)' },
        ],
        correctOptionId: 'b',
        hints: [
          'First calculate risk per 1 contract: 25 points × $2 per point = $50. Then divide $100 by $50.',
        ],
        postSubmissionRationale:
          'Each MNQ contract risks 25 × $2 = $50. Dividing your $100 max risk by $50 gives exactly 2 MNQ contracts.',
        commonTrapNote:
          'Guessing contract counts without multiplying Stop Points × $/Point leads to massive oversizing on NAS100.',
      },
      {
        id: 'pq-ib-2',
        lessonSlug: 'indices-nas100-spx500-basics',
        conceptKey: 'indices-basics',
        prompt:
          'Why is verifying your broker’s exact Dollar-per-Point specification mandatory before trading an Index CFD or Futures contract live?',
        options: [
          { id: 'a', label: 'Because contract multipliers vary widely between brokers and futures exchanges, directly controlling how much you lose per point' },
          { id: 'b', label: 'Because Indices only move 1 point per week' },
          { id: 'c', label: 'Because Dollar-per-Point determines what color candles appear' },
          { id: 'd', label: 'It is optional as long as you trade NAS100' },
        ],
        correctOptionId: 'a',
        hints: [
          'Think about what happens if you expect $1/point but your broker actually charges $10/point.',
        ],
        postSubmissionRationale:
          'Broker CFD specifications and Futures multipliers differ dramatically ($1/pt vs. $2/pt vs. $5/pt vs. $20/pt); verifying $/point prevents accidental 10× over-risking.',
        commonTrapNote:
          'Never carry Forex lot intuition blindly onto an Index order ticket.',
      },
    ],
  },

  // =========================================================================
  // MODULE 27: Indices Track 3 — VIX, DXY & Risk-On / Risk-Off Correlations
  // =========================================================================
  {
    id: '20000000-0000-4000-8000-000000000027',
    slug: 'indices-risk-on-correlations',
    title: 'Indices Edge: VIX (Fear Index), DXY & Risk-On / Risk-Off Correlations',
    subtitle:
      'Use VIX volatility regimes, US Dollar Index (DXY), Treasury yields, and SMT (Smart Money Divergence) between SPX500 and NAS100 to filter A+ Index setups.',
    plainEnglishSummary:
      'Stock Indices never move in a vacuum. Watching two simple confirmation gauges — VIX (the market’s "Fear Index") and DXY (the US Dollar Index) — tells you instantly whether big money is in a calm Risk-On mood (buying equities) or a nervous Risk-Off mood (selling equities). Adding SMT (Smart Money Divergence) between SPX500 and NAS100 gives you one of the sharpest reversal clues in institutional index trading.',
    beginnerFaq: [
      {
        question: 'What is the VIX ("Fear Index") and how do Index traders use it?',
        answer:
          'VIX measures expected 30-day volatility on the S&P 500. When VIX is low and falling (e.g., under 15–18), markets tend to grind smoothly higher (Risk-On). When VIX spikes sharply upward (above 20–25+), fear is rising, daily swings get much wider, and you must cut contract size to survive bigger stops.',
      },
      {
        question: 'How does DXY (US Dollar Index) correlate with NAS100 and SPX500?',
        answer:
          'Often inversely (opposite directions). When DXY and US 10-Year Treasury Yields surge strongly upward, tech stocks and NAS100 often face selling pressure. When DXY rolls over downward, Risk-On assets (Indices and Crypto) frequently rally.',
      },
      {
        question: 'What is SMT (Smart Money Divergence) between SPX500 and NAS100?',
        answer:
          'SPX500 and NAS100 almost always make highs and lows together. If SPX500 sweeps below an obvious low while NAS100 refuses to break its matching low (holding a Higher Low), that hidden crack in correlation is bullish SMT — a high-probability institutional reversal clue!',
      },
    ],
    level: 'intermediate',
    marketCategory: 'indices',
    learningStage: 'market_playbooks',
    moduleOrder: 27,
    conceptKey: 'indices-correlations',
    estimatedMinutes: 18,
    learningObjectives: [
      'Read VIX volatility regimes to adapt stop distance, profit targets, and position size dynamically.',
      'Check DXY (US Dollar Index) and Treasury Yields as macro tailwinds or headwinds for Risk-On vs. Risk-Off sessions.',
      'Spot bullish and bearish SMT (Smart Money Divergence) between correlated indices (SPX500 vs. NAS100).',
      'Combine macro correlation filters with 9:30 AM NY structure so you never trade blind against a Risk-Off wave.',
    ],
    prerequisites: [
      'Indices Foundations: NAS100, SPX500 & US30 Points, Contracts & Volatility',
      'Indices Playbook: NY Open Manipulation & Opening Range Sweeps',
    ],
    terminology: [
      {
        term: 'VIX (CBOE Volatility / Fear Index)',
        shortCode: 'VIX',
        definition:
          'Measures market-implied volatility on S&P 500 options. Rising VIX signals fear and wider price swings; falling VIX signals calm Risk-On grinding.',
        example:
          'When VIX jumps from 14 to 24, intraday SPX500 candles double in height — requiring smaller contract size.',
      },
      {
        term: 'DXY (US Dollar Index)',
        shortCode: 'DXY',
        definition:
          'Tracks the US Dollar against a basket of six major foreign currencies — often moving inversely to Risk-On Stock Indices.',
        example:
          'DXY rejecting a 4H resistance zone often aligns cleanly with a bullish NY Open rally on NAS100.',
      },
      {
        term: 'Risk-On vs. Risk-Off Regime',
        shortCode: 'Risk-On / Off',
        definition:
          'Risk-On: Capital buys growth assets (NAS100, SPX500, Crypto) while VIX/DXY cool off. Risk-Off: Capital flees to cash/USD/safety while VIX spikes and equities sell off.',
        example:
          'Spotting a clear Risk-Off morning stops you from stubbornly buying dips all the way down.',
      },
      {
        term: 'SMT (Smart Money Divergence)',
        shortCode: 'SMT',
        definition:
          'A correlation split where one index (e.g., SPX500) sweeps a prior high/low while its sister index (NAS100) fails to make that same extreme — revealing institutional accumulation or distribution.',
        example:
          'At 9:45 AM NY, SPX500 sweeps its London low while NAS100 holds a Higher Low, then both rip upward together.',
      },
    ],
    sections: [
      {
        id: 'irc-vix-regimes',
        heading: '1. Reading VIX Regimes to Adapt Your Volatility Playbook',
        body: 'Checking VIX for 5 seconds every morning tells you what kind of weather awaits at the 9:30 AM open.',
        bulletPoints: [
          'Calm Regime (VIX < 16): Smaller daily ranges, slower trends — take cleaner modest targets and avoid expecting 400-point NAS100 days.',
          'Active Sweet Spot (VIX 16–22): Crisp directional swings and smooth liquidity sweeps.',
          'High-Volatility / Fear Regime (VIX > 24): Huge fast candles in both directions — widen structural stops and cut contract size proportionally so risk stays capped at 1R.',
        ],
        keyTakeaway:
          'VIX is not a buy/sell trigger by itself — it is your volatility speedometer for sizing and target expectations.',
      },
      {
        id: 'irc-dxy-risk-on',
        heading: '2. DXY (US Dollar Index) & Risk-On / Risk-Off Alignment',
        body: 'Big funds allocate across Dollars, Bonds, and Equities together — watching DXY adds instant macro clarity.',
        bulletPoints: [
          'Bullish Index Tailwind: DXY breaking lower + VIX cooling off = classic Risk-On buying support for SPX500 and NAS100.',
          'Bearish Index Headwind: DXY spiking aggressively upward + VIX surging = Risk-Off pressure on tech and equities.',
          'Use DXY as a confluence filter, never as an excuse to ignore your actual Index price structure.',
        ],
        keyTakeaway:
          'When NAS100 structure is bullish AND DXY is rejecting resistance, you have institutional cross-market wind at your back.',
      },
      {
        id: 'irc-smt-divergence',
        heading: '3. SMT (Smart Money Divergence): SPX500 vs. NAS100',
        body: 'Because SPX500 and NAS100 share massive tech overlap, any momentary disagreement at a key swing level is a huge clue.',
        bulletPoints: [
          'Bullish SMT: At a major 1H/4H support or session low, SPX500 sweeps slightly lower while NAS100 refuses to break its low (stronger hands absorbing NAS100).',
          'Bearish SMT: At a major high, NAS100 pokes slightly higher while SPX500 prints a Lower High — signaling distribution.',
          'Execution Rule: Always pair SMT with a confirmed LTF (Lower Timeframe) candle-close BOS (Break of Structure) before entering.',
        ],
        keyTakeaway:
          'SMT at a key liquidity pool + confirmed BOS is one of the highest-clarity Index reversal signals.',
      },
    ],
    diagramConfig: {
      kind: 'multi_timeframe',
      title: 'Cross-Market Index Filter: VIX, DXY & SPX500/NAS100 SMT',
      subtitle: 'Confirm Risk-On/Risk-Off alignment and SMT correlation cracks before executing',
      caption:
        'Combining VIX volatility sizing, DXY macro alignment, and SPX500 vs. NAS100 SMT sharpens Index entry timing dramatically.',
      legend: [
        { label: 'Risk-On / Bullish SMT', colorToken: 'emerald' },
        { label: 'DXY / VIX Correlation Check', colorToken: 'amber' },
        { label: 'Risk-Off Headwind', colorToken: 'rose' },
      ],
      annotations: [
        {
          id: 'irc-a1',
          label: 'VIX Speedometer',
          sublabel: 'Adjust Stop Width & Size',
          tone: 'neutral',
        },
        {
          id: 'irc-a2',
          label: 'DXY Inverse Filter',
          sublabel: 'Cooling USD = Risk-On Help',
          tone: 'liquidity',
        },
        {
          id: 'irc-a3',
          label: 'SPX / NAS SMT',
          sublabel: 'One Sweeps · One Holds HL',
          tone: 'bullish',
        },
      ],
      walkthroughSteps: [
        'Check VIX before 9:30 AM NY to gauge expected candle speed and adjust contract size accordingly.',
        'Check DXY (US Dollar Index) to see whether macro flows lean Risk-On (cooling DXY) or Risk-Off (surging DXY).',
        'Compare SPX500 and NAS100 side-by-side at key session highs and lows to spot SMT (Smart Money Divergence).',
        'Wait for a confirmed candle-close BOS (Break of Structure) on your execution chart before entering.',
      ],
    },
    chartScenarioIds: ['idx-nas100-ny-open'],
    fallbackExplanations: {
      beginner_friendly: {
        style: 'beginner_friendly',
        headline: 'Check the Weather (VIX) and Wind (DXY) Before Trading Indices',
        summary:
          'VIX tells you how wild the waves are; DXY shows which way macro money is blowing; SMT between SPX500 and NAS100 spots sneaky turns.',
        steps: [
          'Glance at VIX: higher VIX = faster candles = smaller contract size.',
          'Glance at DXY: falling DXY often helps Indices climb; surging DXY often pressures them.',
          'Watch SPX500 and NAS100 side-by-side at key highs/lows for SMT clues.',
        ],
        keyTakeaway:
          'Two 5-second correlation checks keep you aligned with big institutional flows.',
        practiceSafeHint:
          'Always wait for your main Index chart’s candle close to confirm any correlation clue.',
      },
      step_by_step_visual: {
        style: 'step_by_step_visual',
        headline: '3-Gauge Pre-Open Index Correlation Scan',
        summary:
          'Run this 30-second scan at 9:15 AM New York time.',
        steps: [
          '1. VIX Level: Calm (<16), Normal (16–22), or Elevated (>24 → size down).',
          '2. DXY 1H Trend: Pushing into resistance (Risk-On clue) or breaking higher (Risk-Off caution).',
          '3. SPX500 vs. NAS100 Split: Mark matching London/Overnight highs and lows to watch for SMT.',
        ],
        keyTakeaway:
          'Preparation before 9:30 AM keeps you calm when the opening bell explodes.',
        practiceSafeHint:
          'Look for one index sweeping a prior low while the sister index holds firm.',
      },
      real_chart_example: {
        style: 'real_chart_example',
        headline: '9:45 AM Bullish SMT Between SPX500 & NAS100',
        summary:
          'SPX500 pokes 4 points below its London low while NAS100 holds 15 points ABOVE its London low, right as DXY stalls at 1H resistance.',
        steps: [
          'Within 5 minutes, NAS100 prints a decisive bullish 5m BOS (Break of Structure).',
          'Both indices rally cleanly into the 11:00 AM window, rewarding patient Longs with +3R.',
        ],
        keyTakeaway:
          'When SMT, DXY resistance, and 5m BOS line up together, conviction is crystal clear.',
        practiceSafeHint:
          'Never enter on SMT alone — wait for the BOS candle close to confirm buyers stepped in.',
      },
      analogy_based: {
        style: 'analogy_based',
        headline: 'The Car Dashboard Gauges Analogy',
        summary:
          'Your Index chart is the road ahead through the windshield; VIX is your speedometer, and DXY is the wind gauge. You still steer by the road, but the gauges stop you from speeding into a storm.',
        steps: [
          'High VIX = wet road → slow down your position size.',
          'SMT = seeing one wheel grip firmly while the other briefly taps the curb.',
        ],
        keyTakeaway:
          'Price structure is always the windshield; correlations are your dashboard gauges.',
        practiceSafeHint:
          'Keep VIX and DXY on your Watchlist for effortless 5-second glances.',
      },
      comparison: {
        style: 'comparison',
        headline: 'Low-VIX Grinding Days vs. High-VIX Volatile Days',
        summary:
          'Matching your expectations to the current VIX regime prevents frustration.',
        steps: [
          'Low VIX (<15): Tighter ranges, slower breakouts, smaller targets.',
          'High VIX (>24): Rapid 100-point swings, wider required stops, smaller contract size.',
          'Rule: Never use a Low-VIX tight stop on a High-VIX panic day.',
        ],
        keyTakeaway:
          'Adapting stop width and contract size to VIX keeps your risk steady in any regime.',
        practiceSafeHint:
          'Check whether today’s VIX is above or below 20 before choosing target expectations.',
      },
      common_mistakes: {
        style: 'common_mistakes',
        headline: '3 Index Correlation Misconceptions',
        summary:
          'Use correlations as smart filters, not rigid guarantees.',
        steps: [
          'Mistake 1: Treating DXY inverse correlation as a 100% law — sometimes both USD and Stocks rally together.',
          'Mistake 2: Buying SMT immediately before any candle close or BOS confirms reversal.',
          'Mistake 3: Trading the exact same big contract size when VIX spikes from 14 to 28.',
        ],
        keyTakeaway:
          'Correlations add edge only when paired with clean price structure and dynamic sizing.',
        practiceSafeHint:
          'Always verify that your traded Index chart itself prints a valid trigger.',
      },
    },
    practiceQuestions: [
      {
        id: 'pq-irc-1',
        lessonSlug: 'indices-risk-on-correlations',
        conceptKey: 'indices-correlations',
        scenarioId: 'idx-nas100-ny-open',
        prompt:
          'When the VIX ("Fear Index") spikes from 14 up to 26, how should a disciplined Index trader adjust?',
        options: [
          { id: 'a', label: 'Double contract size and tighten stops to 2 points' },
          { id: 'b', label: 'Respect wider candle swings by placing stops at true structural levels and scaling contract count DOWN to keep max risk at 1R' },
          { id: 'c', label: 'Ignore VIX completely because candle sizes never change' },
          { id: 'd', label: 'Remove all stop losses until VIX drops' },
        ],
        correctOptionId: 'b',
        hints: [
          'Higher VIX means larger point swings per candle — what must happen to contract count if your stop is wider?',
        ],
        postSubmissionRationale:
          'Elevated VIX produces much wider price swings. Respecting wider structural stops while reducing contract size keeps your dollar risk steady at 1R.',
        commonTrapNote:
          'Keeping Low-VIX contract size on High-VIX panic days causes sudden oversized drawdowns.',
      },
      {
        id: 'pq-irc-2',
        lessonSlug: 'indices-risk-on-correlations',
        conceptKey: 'indices-correlations',
        prompt:
          'At a major 9:45 AM New York low, SPX500 briefly sweeps below its prior session low while NAS100 refuses to break its matching low (holding a Higher Low). What is this clue called?',
        options: [
          { id: 'a', label: 'Bullish SMT (Smart Money Divergence) — a strong clue to watch for a confirmed bullish BOS' },
          { id: 'b', label: 'A guaranteed 100% signal to buy immediately without a stop loss' },
          { id: 'c', label: 'A broker data error that means the market is closed' },
          { id: 'd', label: 'A bearish breakdown confirmation' },
        ],
        correctOptionId: 'a',
        hints: [
          'When two tightly correlated indices split at a major liquidity level, what institutional divergence pattern is forming?',
        ],
        postSubmissionRationale:
          'One index sweeping liquidity while its correlated twin holds a Higher Low is Bullish SMT — a high-value clue when confirmed by a candle-close BOS (Break of Structure).',
        commonTrapNote:
          'Always wait for candle-close structural confirmation rather than entering blindly on SMT alone.',
      },
    ],
  },
];
