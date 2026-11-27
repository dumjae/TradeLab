import type { AcademyModule, DecoupledLessonNode } from '../../types/curriculum-tree';

export const STRATEGY_PRO_PH_MODULES: AcademyModule[] = [
  {
    id: 'mod-st7',
    code: 'ST7',
    title: 'Strategy Development and Execution',
    subtitle: 'Designing objective entry/exit rules, confluence, trading plans, backtesting, forward testing, journaling, expectancy, and safe optimization.',
    pathId: 'strategy_pro',
    pillar: 'advanced',
    level: 4,
    disclaimer:
      'Honest Trading Reality: Every genuine trading strategy experiences losing streaks and drawdown periods—no system is guaranteed. Edge only appears over large sample sizes with strict risk discipline.',
    lessonCodes: [
      'ST7.1', 'ST7.2', 'ST7.3', 'ST7.4', 'ST7.5', 'ST7.6', 'ST7.7', 'ST7.8',
      'ST7.9', 'ST7.10', 'ST7.11', 'ST7.12', 'ST7.13', 'ST7.14', 'ST7.15',
    ],
  },
  {
    id: 'mod-pro8',
    code: 'PRO8',
    title: 'Professional Trading and Portfolio Management',
    subtitle: 'Institutional-grade daily routines, pre/post-market workflows, journal diagnostics, diversification, correlation control, scaling capital, and career sustainability.',
    pathId: 'strategy_pro',
    pillar: 'advanced',
    level: 5,
    disclaimer:
      'Professional consistency is earned through documented multi-quarter performance, conservative drawdown governance, and emotional stability—never through reckless leverage.',
    lessonCodes: [
      'PRO8.1', 'PRO8.2', 'PRO8.3', 'PRO8.4', 'PRO8.5',
      'PRO8.6', 'PRO8.7', 'PRO8.8', 'PRO8.9', 'PRO8.10',
    ],
  },
  {
    id: 'mod-ph1',
    code: 'PH1',
    title: 'Philippine Market Education (Optional)',
    subtitle: 'PSE & PSEi fundamentals, PH brokers & board lots, 9:30 AM–3:00 PM PH session hours, PHP investments (REITs, Bonds, MP2), local taxes/fees, and BSP/SEC scam protection.',
    pathId: 'philippines_pse',
    pillar: 'specializations',
    level: 2,
    optional: true,
    disclaimer:
      'Optional Regional Track (Philippines): Educational overview of PSE, PHP instruments, local fees/tax rules, and BSP/SEC investor protection. Always verify latest fee and tax schedules with your licensed PH broker and BIR.',
    lessonCodes: ['PH1.1', 'PH1.2', 'PH1.3', 'PH1.4', 'PH1.5', 'PH1.6'],
  },
];

export const STRATEGY_PRO_PH_LESSONS: DecoupledLessonNode[] = [
  // =========================================================================
  // MODULE ST7 — Strategy Development and Execution (ST7.1 – ST7.15)
  // =========================================================================
  {
    id: 'topic-st7-1',
    code: 'ST7.1',
    slug: 'strategy-st7-1-what-makes-a-trading-strategy',
    title: 'What Makes a Trading Strategy?',
    overviewEn:
      'A real trading strategy is a repeatable, testable rulebook specifying exact market conditions, entry triggers, stop-loss invalidation, profit-taking logic, and position sizing—never vague gut feelings or social media tips.',
    overviewTaglish:
      'Ang tunay na trading strategy ay malinaw at nasusubukang rulebook: anong market condition, kailan papasok, saan ang stop-loss, paano mag-take profit, at gaano kalaki ang position size—hindi hula-hula.',
    objectives: [
      'List the five non-negotiable components of any valid strategy: Market/Regime, Setup, Entry Trigger, Exit/Stop Logic, and Risk Sizing.',
      'Explain why an objective edge still produces random short-term wins and losses (probabilistic outcomes).',
      'Reject "guaranteed profit" claims—every real strategy has losing streaks and periods where its market regime pauses.',
    ],
    keyPoints: [
      'If two traders following your written strategy cannot agree whether a chart qualifies, the rules are still too vague.',
      'Every strategy fits specific conditions (e.g., trending vs. ranging); knowing when NOT to trade is half the edge.',
      'Strategies never guarantee wins—they seek positive mathematical expectancy across 50–100+ disciplined executions.',
    ],
    limitationsNote: 'Every strategy experiences losing streaks and drawdowns—never judge a valid rulebook by 2 or 3 isolated outcomes.',
    practicalExample:
      'Instead of "buy when RSI looks oversold," a real strategy defines: "In a Daily uptrend (price > 50 EMA), buy a 4H pullback into prior demand after a bullish engulfing close, stop below swing low, 1% risk, 2.5R target."',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: [],
    estimatedMinutes: 9,
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Which set of elements is REQUIRED to turn a loose chart idea into a real, testable trading strategy?',
      options: [
        'A colorful indicator and a social-media sentiment poll',
        'Objective market-regime filter, exact entry trigger, structural stop-loss, profit exit rules, and fixed position sizing',
        'A promise of a 95% win rate with zero drawdowns',
        'Changing rules every time one trade hits stop-loss',
      ],
      correctIndex: 1,
      rationale: 'Without explicit entry, exit, invalidation, and sizing rules, a concept cannot be backtested or executed consistently.',
      commonTrap: 'Strategy-hopping after 4 normal losing trades instead of testing one clear rulebook across a proper sample size.',
    },
  },
  {
    id: 'topic-st7-2',
    code: 'ST7.2',
    slug: 'strategy-st7-2-defining-entry-conditions',
    title: 'Defining Entry Conditions',
    overviewEn:
      'Entry conditions translate your market thesis into binary pass/fail criteria—combining higher-timeframe bias, location at a key zone, and a concrete trigger so you never enter impulsively out of FOMO.',
    overviewTaglish:
      'Ginagawa ng entry conditions na malinaw na pass/fail checklist ang trade thesis mo—pinagsasama ang higher-timeframe trend, tamang presyo/zone, at malinaw na trigger para iwas FOMO.',
    objectives: [
      'Separate context conditions (trend, session, liquidity) from the exact execution trigger (limit at zone vs. candle-close confirmation).',
      'Limit entry criteria to 3–5 non-redundant factors to avoid analysis paralysis.',
      'Write clear "No-Trade Disqualifiers" (e.g., major red-folder news in 15 minutes, spread > 2x normal, extended away from structure).',
    ],
    keyPoints: [
      'Using 5 similar oscillators (RSI + Stoch + CCI + Williams %R + MACD) is multicollinearity, not independent confirmation.',
      'Strong entry rules automatically define a tight, logical invalidation level.',
      'Missing a move that broke your rules is a disciplined win—never chase late entries with ruined risk-to-reward.',
    ],
    practicalExample:
      'Entry checklist: (1) Daily trend bullish, (2) Price pulls back to 4H demand/previous breakout level, (3) 15m structure shift confirms buyer response, (4) At least 2.0R room to opposing resistance.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.1'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'confluence-a-plus-setups',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'Why is stacking five momentum oscillators (RSI, Stochastic, CCI, MACD, Williams %R) a weak way to design entry conditions?',
      options: [
        'Because charting platforms crash when you add five indicators',
        'Because they all measure essentially the same price-momentum data (redundancy), creating false confidence instead of independent confluence',
        'Because momentum indicators never work on daily charts',
        'Because brokers ban using more than two indicators',
      ],
      correctIndex: 1,
      rationale: 'True confluence combines independent dimensions—such as higher-timeframe trend, key structural location, liquidity/volume, and risk-to-reward room.',
      commonTrap: 'Adding a new indicator after every single losing trade until your chart becomes unreadable.',
    },
  },
  {
    id: 'topic-st7-3',
    code: 'ST7.3',
    slug: 'strategy-st7-3-defining-exit-conditions',
    title: 'Defining Exit Conditions',
    overviewEn:
      'Exit conditions—where you cut losses (stop-loss), secure gains (targets/partials), or exit dead trades (time stop)—govern your actual P&L far more than entry perfection.',
    overviewTaglish:
      'Ang exit conditions—stop-loss, take-profit/partials, at time stop—ang totoong nagtatakda kung kikita o malulugi ang isang strategy, mas mahalaga pa kaysa sa perpektong entry.',
    objectives: [
      'Set stop-losses strictly at structural invalidation (where the trade idea is objectively wrong), never arbitrary fixed pip/dollar guesses.',
      'Compare fixed R-multiple targets, structural liquidity targets, partial profit-taking, and trailing stops.',
      'Use a "Time Stop" to exit stagnant setups that fail to move after your expected window.',
    ],
    keyPoints: [
      'A mediocre entry with disciplined stops and 2.5R exits beats a sniper entry with sloppy exits every time.',
      'Moving stops to breakeven too early (e.g., at +0.4R) turns many eventual winners into frustrating scratch trades.',
      'Every exit rule must be decided BEFORE clicking buy or sell—never improvised mid-candle.',
    ],
    practicalExample:
      'Trade plan: Stop below 4H swing low (−1R); take 50% partial at opposing liquidity (+2R), move stop to breakeven only after a new 1H higher low forms, and trail remainder behind 1H swing lows.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.2'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'trade-management-partials-be',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'What is the primary danger of shifting your stop-loss to breakeven the moment a trade floats +0.3R in profit?',
      options: [
        'It doubles your risk exposure',
        'Normal market noise repeatedly tags your premature breakeven stop, turning high-expectancy winners into $0 scratches',
        'Brokers reject breakeven orders automatically',
        'It converts a long trade into a short trade',
      ],
      correctIndex: 1,
      rationale: 'Price naturally retests entry zones; moving stops to breakeven only after a structural milestone (e.g., +1R or new BOS) preserves full payoff.',
      commonTrap: 'Widening your stop-loss while in drawdown out of fear of realizing a loss, while cutting winners early out of fear of giving back profit.',
    },
  },
  {
    id: 'topic-st7-4',
    code: 'ST7.4',
    slug: 'strategy-st7-4-entry-confirmation',
    title: 'Entry Confirmation',
    overviewEn:
      'Entry confirmation waits for observable price or volume proof—such as a candle close, liquidity sweep reclaim, or lower-timeframe structure shift—balancing higher win-rate certainty against slightly wider entry price.',
    overviewTaglish:
      'Hinihintay ng entry confirmation ang malinaw na pruweba sa presyo o volume—tulad ng candle close o structure shift—para bawasan ang fakeouts kapalit ng bahagyang mas huling entry price.',
    objectives: [
      'Compare Aggressive Limit entries (best R:R, lower win rate, catches falling knives if wrong) vs. Confirmation entries (higher accuracy, occasional missed V-reversals).',
      'Require closed candles on your chosen trigger timeframe rather than reacting to unclosed mid-candle wicks.',
      'Standardize one confirmation trigger per setup so backtest data stays apples-to-apples.',
    ],
    keyPoints: [
      'A candle is NOT a breakout or rejection until the candle actually closes.',
      'Confirmation reduces false entries during strong counter-trend momentum.',
      'Accept that waiting for confirmation means occasionally missing ultra-fast V-shaped moves—that is a healthy trade-off.',
    ],
    practicalExample:
      'Instead of blindly placing a buy limit at daily support while price crashes on heavy volume, you wait for a 15-minute sweep below support followed by a decisive bullish close back above it.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.3'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'confluence-a-plus-setups',
    diagramKind: 'liquidity_sweep_vs_breakout',
    quiz: {
      prompt: 'What is the fundamental trade-off between Aggressive Limit entries at a zone versus Confirmation entries after a candle close / structure shift?',
      options: [
        'Confirmation entries have zero losses',
        'Aggressive limits offer tighter stops and better price when right, while confirmation filters falling knives at the cost of a slightly less favorable entry price or occasional missed moves',
        'Aggressive limits cannot use stop-losses',
        'Confirmation entries only work on 1-minute charts',
      ],
      correctIndex: 1,
      rationale: 'Both approaches are valid when tested consistently; confirmation prioritizes avoiding steamroller trends over catching exact wick bottoms.',
      commonTrap: 'Jumping in mid-candle on a huge green bar, only to watch it close as a massive bearish rejection wick 3 minutes later.',
    },
  },
  {
    id: 'topic-st7-5',
    code: 'ST7.5',
    slug: 'strategy-st7-5-confluence-and-probability',
    title: 'Confluence and Probability',
    overviewEn:
      'Confluence occurs when multiple independent technical, liquidity, session, or catalyst factors align at the same price area—shifting odds modestly in your favor without ever creating 100% certainty.',
    overviewTaglish:
      'Nangyayari ang confluence kapag nagsabay-sabay ang magkakaibang independent signals (trend, support/demand, liquidity sweep, session volume) sa iisang zone—pinapataas nito ang probabilidad pero hindi kailanman 100% sigurado.',
    objectives: [
      'Score setups by independent confluence pillars: (1) HTF Trend, (2) Key Level/Zone, (3) Liquidity/Volume Catalyst, (4) Session Timing, (5) Clean R:R Room.',
      'Think in probabilities ("A+ setups still lose 35%–45% of the time") so a single loss never breaks discipline.',
      'Filter out B/C-grade boredom trades that drain edge between A+ opportunities.',
    ],
    keyPoints: [
      'Confluence stacks independent odds—like aligning higher-timeframe trend + broken resistance turned support + active session volume.',
      'Even a 5-star A+ setup can still hit your stop-loss—NEVER oversize an "unmissable" trade.',
      'Patience waiting for high-confluence setups dramatically lowers fee drag and emotional fatigue.',
    ],
    limitationsNote: 'High confluence improves probabilities over a series of trades; it NEVER eliminates single-trade uncertainty.',
    practicalExample:
      'A stock pulls back to a prior breakout level that coincides with the rising 20 EMA, 50% retracement, and leading sector strength—4 independent factors converging at one clean invalidation point.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.4'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'confluence-a-plus-setups',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'Why should you NEVER risk 10% of your account on a single "perfect 5-confluence A+ setup"?',
      options: [
        'Because brokers reject orders with high confluence',
        'Because trading is strictly probabilistic—even an A+ setup can fail unexpectedly due to sudden news or institutional order flow',
        'Because confluence lowers your profit target',
        'Because A+ setups only occur once per decade',
      ],
      correctIndex: 1,
      rationale: 'Any single trade has an uncertain outcome; fixed conservative risk ensures an unexpected A+ stop-out is merely routine business expense.',
      commonTrap: 'Going "all-in" after spotting multiple aligned signals and blowing weeks of disciplined work on one unexpected stop-out.',
    },
  },
  {
    id: 'topic-st7-6',
    code: 'ST7.6',
    slug: 'strategy-st7-6-building-a-trading-setup',
    title: 'Building a Trading Setup',
    overviewEn:
      'Building a signature "playbook setup" means documenting one clear repeatable market pattern—complete with ideal chart screenshots, invalidation examples, and exact execution rules—until you know it cold.',
    overviewTaglish:
      'Ang pagbuo ng signature trading setup ay paggawa ng isang malinaw na playbook—kumpleto sa ideal chart examples, failed examples, at eksaktong entry/stop rules—hanggang kabisado mo na ito.',
    objectives: [
      'Master ONE core playbook setup (e.g., Trend Pullback, Opening Range Breakout, or Range Sweep Reclaim) before adding a second.',
      'Create a visual Playbook Folder with 20+ annotated winning AND losing historical examples of your setup.',
      'Grade each live execution A / B / C by rule adherence—not by whether it happened to win or lose.',
    ],
    keyPoints: [
      'Specializing in 1–2 setups builds pattern recognition faster than dabbling in 10 contradictory strategies.',
      'Always collect failed examples of your setup so you recognize subtle invalidation clues early.',
      'A winning trade that broke your rules is a BAD trade ("bad process, lucky outcome"); a losing trade that followed every rule is a GOOD trade.',
    ],
    practicalExample:
      'A trader builds a "4H Pullback Continuation" playbook slide: Market Filter (Daily HH/HL), Zone (Prior BOS + 20 EMA), Trigger (1H bullish engulfing), Stop (below 4H swing), Target (2.5R), Max Risk (0.75%).',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.5'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'confluence-a-plus-setups',
    diagramKind: 'order_block_choch',
    quiz: {
      prompt: 'How should a disciplined trader grade a trade that broke two entry rules, ignored the stop-loss, and still accidentally closed in profit?',
      options: [
        'Grade A+ because it made money',
        'Grade F / Rule Violation—lucky outcomes from broken process reinforce deadly habits that eventually blow up accounts',
        'Increase position size immediately on the next trade',
        'Delete it from the trading journal',
      ],
      correctIndex: 1,
      rationale: 'Process discipline drives long-term expectancy; rewarding lucky rule-breaking trains catastrophic behavior.',
      commonTrap: 'Trying to memorize 8 different complex setups simultaneously as a developing trader and mixing their rules together live.',
    },
  },
  {
    id: 'topic-st7-7',
    code: 'ST7.7',
    slug: 'strategy-st7-7-trading-plan-development',
    title: 'Trading Plan Development',
    overviewEn:
      'A written Trading Plan is your business operating manual—defining your traded markets, personal schedule, playbook setups, per-trade/daily/weekly risk limits, and exact rules for stepping away during drawdowns.',
    overviewTaglish:
      'Ang nakasulat na Trading Plan ang business manual mo sa merkado—nakasaad dito ang piling markets, oras ng pag-trade, setups, daily/weekly loss limits, at patakaran kapag nasa drawdown.',
    objectives: [
      'Draft a concise 1–2 page Trading Plan covering Markets, Sessions, Setups, Risk Limits, Drawdown Protocol, and Review Cadence.',
      'Include hard emotional circuit breakers (e.g., max 2 losses/day or −3R/week = mandatory platform lock).',
      'Commit to revising the plan ONLY during scheduled monthly/quarterly reviews—never mid-session.',
    ],
    keyPoints: [
      'If your trading plan exists "only in your head," emotions will rewrite it during every losing streak.',
      'Drawdown protocol example: at −5% account drawdown, cut per-trade risk in half (0.5%) until equity recovers.',
      'Keep the plan short enough to read in 2 minutes before every trading session.',
    ],
    practicalExample:
      'Before NY open, a trader checks their printed 1-page plan: Instruments (SPY, NVDA, BTC), Risk (0.75%/trade), Max Trades (2/day), Daily Stop (−1.5R), No trading 15m before/after CPI/FOMC.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.6'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'trade-management-partials-be',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'When is the ONLY appropriate time to modify the rules inside your written Trading Plan?',
      options: [
        'Immediately after taking two consecutive stop-losses during a live session',
        'During a scheduled calm review (e.g., after 30–50 logged trades) backed by objective journal data',
        'Whenever a live trade is approaching your stop-loss',
        'Every time you see a new indicator on social media',
      ],
      correctIndex: 1,
      rationale: 'Editing rules mid-session turns a structured plan into emotional rationalization; data-backed review updates preserve statistical integrity.',
      commonTrap: 'Writing a 20-page textbook plan you never actually read instead of a crisp 1-page checklist you execute daily.',
    },
  },
  {
    id: 'topic-st7-8',
    code: 'ST7.8',
    slug: 'strategy-st7-8-backtesting-strategies',
    title: 'Backtesting Strategies',
    overviewEn:
      'Backtesting applies your exact strategy rules candle-by-candle across historical market data—including trending, ranging, and volatile regimes—to measure realistic win rate, payoff, and maximum drawdown BEFORE risking real money.',
    overviewTaglish:
      'Sinusubukan ng backtesting ang eksaktong rules ng strategy mo sa historical chart data (candle-by-candle) sa iba’t ibang market conditions para masukat ang totoong win rate, R:R, at max drawdown BAGO magtaya ng totoong pera.',
    objectives: [
      'Execute clean bar-by-bar replay backtesting without look-ahead bias (never peeking at future candles).',
      'Include realistic spreads, commissions, slippage, and funding fees in every simulated trade result.',
      'Collect a statistically meaningful sample (at least 50–100 trades across multiple market regimes) and record max losing streak.',
    ],
    keyPoints: [
      'Seeing a 6-trade losing streak in backtesting prepares you psychologically so you do not panic when it happens live.',
      'Testing ONLY during a massive bull market creates survivorship illusion—always test choppy and bearish periods too.',
      'Backtesting proves a concept is worth forward testing; it does NOT guarantee identical future returns.',
    ],
    limitationsNote: 'Historical backtests always look cleaner than live execution because real fills involve slippage, fatigue, and live emotions.',
    practicalExample:
      'A trader replays 12 months of 4H EUR/USD and BTC data across 80 rule-compliant setups, logging +0.35R expectancy after 0.08% estimated fee/slippage friction and a 6-trade max losing streak.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.7'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is "look-ahead bias" (hindsight bias) during manual chart backtesting?',
      options: [
        'Accounting for broker commissions and spread costs',
        'Scrolling past historical charts where future candles are already visible, subconsciously cherry-picking winning trades and skipping losers',
        'Testing a strategy across both bull and bear years',
        'Logging losing streaks inside a spreadsheet',
      ],
      correctIndex: 1,
      rationale: 'Viewing future bars ruins objectivity; bar-by-bar replay hides upcoming price so decisions reflect real-time uncertainty.',
      commonTrap: 'Backtesting 8 cherry-picked trades from one trending week and immediately going live with full capital.',
    },
  },
  {
    id: 'topic-st7-9',
    code: 'ST7.9',
    slug: 'strategy-st7-9-forward-testing',
    title: 'Forward Testing',
    overviewEn:
      'Forward testing runs your backtested strategy in live, unfolding real-time markets (via paper trading or micro live size) to verify real spreads, execution timing, schedule fit, and emotional discipline without hindsight.',
    overviewTaglish:
      'Sinusubukan ng forward testing ang strategy mo sa totoong live market na gumagalaw ngayon (gamit ang paper trading o maliit na size) para masubok ang totoong spread, execution timing, at emosyon mo.',
    objectives: [
      'Bridge the gap between clean historical backtests and messy live markets over 30–50 real-time trades.',
      'Compare forward-test metrics (win rate, average R, slippage, missed setups) against backtest expectations.',
      'Verify that your strategy genuinely fits your real-life Philippine work/sleep schedule.',
    ],
    keyPoints: [
      'Many strategies look brilliant in backtesting but fail in forward testing because entries occur at 3:00 AM PHT or require unrealistically fast fills.',
      'Forward testing exposes execution leaks: hesitating on valid triggers, exiting early, or widening stops.',
      'Do NOT scale to meaningful real capital until forward testing confirms stable positive expectancy and rule adherence.',
    ],
    practicalExample:
      'A trader forward-tests their US stocks pullback plan for 6 weeks live on paper/micro size (35 trades) and discovers that 80% of missed setups happened after 11:30 PM PHT—adjusting to focus solely on Daily/Opening setups.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.8'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What critical weakness does live Forward Testing uncover that historical Backtesting often hides?',
      options: [
        'Historical candle timestamps from five years ago',
        'Real-time slippage, schedule conflicts, hesitation on live triggers, and emotional execution errors',
        'How to remove all market drawdowns forever',
        'Which stock split occurred in 2015',
      ],
      correctIndex: 1,
      rationale: 'Live forward testing subjects your rulebook to real-time uncertainty, live spreads, and your actual human psychology.',
      commonTrap: 'Skipping forward testing completely after a promising backtest and jumping straight into full-sized live risk.',
    },
  },
  {
    id: 'topic-st7-10',
    code: 'ST7.10',
    slug: 'strategy-st7-10-demo-trading',
    title: 'Demo Trading',
    overviewEn:
      'Demo (paper) trading lets you master order types, platform hotkeys, position sizing math, and setup execution with zero financial loss—provided you treat the simulated balance realistically and graduate carefully to tiny real risk.',
    overviewTaglish:
      'Sa demo o paper trading, nakakapag-ensayo ka ng order types, position sizing, at setup execution nang walang mawawalang totoong pera—basta ituring itong parang totoong account bago lumipat sa maliit na live risk.',
    objectives: [
      'Set your demo account starting balance equal to the REAL capital you plan to trade (e.g., $1,000—never fake $1,000,000).',
      'Use demo trading to eliminate platform fat-finger mistakes (wrong quantity, missing stop-loss, wrong Reduce-Only setting).',
      'Recognize demo’s psychological limit: real money triggers fear and greed—transition via micro live size first.',
    ],
    keyPoints: [
      'Paper trading with $100,000 when you will trade $500 live builds distorted habits and ignores minimum lot/fee realities.',
      'Graduate from Demo → Micro Live Size (e.g., $2–$5 risk/trade) → Normal Live Size only after proven consistency.',
      'Return briefly to Demo whenever testing a brand-new market, broker platform, or strategy revision.',
    ],
    practicalExample:
      'A learner practices 40 paper trades on TradeLab Paper Trading with a realistic $2,000 balance and 1% risk, confirms zero order-entry errors and clean journal discipline, then moves to $5/trade micro live risk.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.9'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'trade-management-partials-be',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is the smartest way to transition from Demo (Paper) Trading to real live capital?',
      options: [
        'Practice with a fake $500,000 demo account for two days, then deposit all your savings live',
        'Trade a realistic demo balance matching your real capital, verify consistent rule adherence, then start live with tiny micro risk before scaling',
        'Skip demo trading completely because real losses teach faster',
        'Stay on demo forever without ever journaling trades',
      ],
      correctIndex: 1,
      rationale: 'Matching realistic demo size and stepping up through micro live risk lets your nervous system adapt to real emotions safely.',
      commonTrap: 'Taking wild zero-stop gambles in demo because "it is fake money," accidentally reinforcing terrible live habits.',
    },
  },
  {
    id: 'topic-st7-11',
    code: 'ST7.11',
    slug: 'strategy-st7-11-trading-journals',
    title: 'Trading Journals',
    overviewEn:
      'A trading journal is your personal performance database—logging screenshots, setup tags, planned vs. actual R-multiples, fees, and emotional state on every trade so objective data exposes hidden leaks and true strengths.',
    overviewTaglish:
      'Ang trading journal ang personal performance database mo—nakatala rito ang chart screenshots, setup tag, plano laban sa aktwal na R-multiple, fees, at emosyon sa bawat trade para makita ang totoong leaks at edge mo.',
    objectives: [
      'Log essential quantitative fields: Date/Session, Ticker, Setup Tag, Entry/Stop/Exit, Planned R vs. Actual R, Fees, and MFE/MAE.',
      'Log essential qualitative fields: Before/After chart screenshots, Rule Adherence (Yes/No), and Emotional Tag (Calm, FOMO, Revenge, Tired).',
      'Tag "Cost of Mistakes" separately from valid strategy losses to quantify how much indiscipline costs you.',
    ],
    keyPoints: [
      'Most struggling traders are shocked to discover their core strategy is profitable—it is their rule-breaking FOMO/revenge trades causing the net loss.',
      'Log trades the same day while decision reasoning is fresh—not two weeks later from faded memory.',
      'Tracking Maximum Favorable Excursion (MFE) and Maximum Adverse Excursion (MAE) helps refine stops and profit targets objectively.',
    ],
    practicalExample:
      'After journaling 60 trades, a trader filters by Rule Adherence: "Rule-Compliant Trades = +14.5R; Impulsive/Revenge Trades = −19.0R." Fixing just emotional entries flips the entire account profitable.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.10'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why is logging "Rule Adherence" and "Emotional State" just as important as logging Entry Price and Profit/Loss in your trading journal?',
      options: [
        'Because tax authorities require emotion tags',
        'Because separating valid strategy losses from impulsive rule-breaking mistakes shows whether your system lacks edge or your execution lacks discipline',
        'Because emotional tags automatically improve broker execution speed',
        'Because entry and exit prices do not matter',
      ],
      correctIndex: 1,
      rationale: 'Without separating disciplined trades from tilt/FOMO trades, you might discard a profitable strategy when the real leak was behavioral.',
      commonTrap: 'Only journaling big winning trades and skipping embarrassing losing trades—hiding your most valuable lessons.',
    },
  },
  {
    id: 'topic-st7-12',
    code: 'ST7.12',
    slug: 'strategy-st7-12-performance-metrics',
    title: 'Performance Metrics',
    overviewEn:
      'Professional traders evaluate strategies using a balanced dashboard of performance metrics—Profit Factor, Maximum Drawdown, Average Win/Loss (Payoff Ratio), R-Multiple distribution, and Recovery Factor—never total return alone.',
    overviewTaglish:
      'Sinusukat ng pro traders ang performance gamit ang balanseng metrics—Profit Factor, Max Drawdown, Average Win/Loss, at R-multiple—hindi lang ang kabuuang kita na puwedeng galing sa delikadong tsamba.',
    objectives: [
      'Compute Profit Factor = Gross Profit ÷ Gross Loss (healthy sustainable systems typically sit around 1.4–2.5+).',
      'Measure Maximum Peak-to-Trough Drawdown (%) and Recovery Factor (Net Profit ÷ Max Drawdown).',
      'Spot fragile equity curves that make steady tiny wins but suffer occasional catastrophic −10R tail losses.',
    ],
    keyPoints: [
      'A strategy returning +40% with a −45% max drawdown is far more fragile than one returning +22% with a −6% max drawdown.',
      'Profit Factor below 1.0 loses money; Profit Factor above 4.0 over a tiny sample of 12 trades is usually unsustainable luck.',
      'Always evaluate metrics net of commissions, spreads, and funding costs.',
    ],
    practicalExample:
      'System A made $6,000 Gross Profit and $3,500 Gross Loss (Profit Factor 1.71, Max Drawdown −7%). System B made $10,000 Profit and $9,200 Loss (Profit Factor 1.09, Max Drawdown −34%). System A is far superior.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.11'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Over 60 trades, a trading system generates $9,000 in total winning trades and $5,000 in total losing trades (net of fees). What is its Profit Factor?',
      options: ['0.55', '1.80', '4.00', '1.40'],
      correctIndex: 1,
      rationale: 'Profit Factor = Gross Profit ($9,000) ÷ Gross Loss ($5,000) = 1.80.',
      commonTrap: 'Judging a strategy purely by total percentage gain without checking how close its Maximum Drawdown came to wiping out the account.',
    },
  },
  {
    id: 'topic-st7-13',
    code: 'ST7.13',
    slug: 'strategy-st7-13-win-rate-vs-profitability',
    title: 'Win Rate vs. Profitability',
    overviewEn:
      'Win rate alone says NOTHING about profitability: a 90% win-rate strategy that risks $10 to make $1 loses money, while a 40% win-rate strategy that wins 3R and loses 1R compounds strongly over time.',
    overviewTaglish:
      'Ang win rate lang ay HINDI garantiya ng kita: puwedeng malugi ang 90% win-rate kung malaki ang talo bawat mali, habang malakas kumita ang 40% win-rate kung 3R ang panalo at 1R lang ang talo.',
    objectives: [
      'Compute the Breakeven Win Rate for any Risk-to-Reward ratio: Breakeven WR = 1 ÷ (1 + Reward/Risk).',
      'Recognize the psychological trap of "high win-rate martingale/no-stop" systems that collect pennies until one crash wipes everything.',
      'Match your personal psychology to a sustainable Win Rate / R:R balance (e.g., 45%–55% WR at 2R vs. 35% WR at 3.5R).',
    ],
    keyPoints: [
      'At 1:1 R:R, you need >50% WR (plus fees) to profit; at 1:2 R:R, >33.4% WR breaks even; at 1:3 R:R, >25.1% WR breaks even.',
      'Ultra-high win-rate systems (>85%) often hide huge stop-losses or averaging down—beware marketing pitches bragging about "95% win rate!"',
      'Lower win-rate trend systems require emotional resilience to endure 6–8 losses in a row without quitting.',
    ],
    practicalExample:
      'Trader A has an 80% win rate (+$100 avg win, −$500 avg loss → 8×$100 − 2×$500 = −$200 NET LOSS). Trader B has a 40% win rate (+$300 avg win, −$100 avg loss → 4×$300 − 6×$100 = +$600 NET PROFIT).',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.12'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Ignoring fees, what is the breakeven Win Rate for a strategy whose average winning trade is +2.0R and average losing trade is −1.0R?',
      options: ['50.0%', '33.3%', '20.0%', '66.7%'],
      correctIndex: 1,
      rationale: 'Breakeven Win Rate = 1 ÷ (1 + 2) = 1/3 ≈ 33.3%. Any win rate meaningfully above 33.3% (after fees) produces positive expectancy.',
      commonTrap: 'Chasing "90% win-rate" signal groups that use massive stop-losses or average into losers until one bad week wipes out a full year of small wins.',
    },
  },
  {
    id: 'topic-st7-14',
    code: 'ST7.14',
    slug: 'strategy-st7-14-expectancy',
    title: 'Expectancy',
    overviewEn:
      'Expectancy measures the average amount (in R-multiples or dollars) you expect to win or lose per trade over a large sample—the single master equation uniting Win Rate, Average Win, Average Loss, and Transaction Costs.',
    overviewTaglish:
      'Sinusukat ng Expectancy ang average na kita o lugi bawat trade sa malaking bilang ng trades—ito ang master formula na pinagsasama ang Win Rate, Average Win, Average Loss, at trading fees.',
    objectives: [
      'Calculate Expectancy in R-multiples: E = (Win% × Avg Win R) − (Loss% × Avg Loss R) − Avg Cost R.',
      'Project sample outcomes honestly: positive expectancy (+0.25R to +0.50R) compounds powerfully across 100 trades, yet still contains random losing clusters.',
      'Use Expectancy × Trade Frequency ("Opportunity Factor") to compare strategies fairly.',
    ],
    keyPoints: [
      'If Expectancy is negative, NO amount of leverage, psychology hacks, or position sizing can make the system profitable.',
      'A realistic +0.30R net expectancy across 100 trades produces +30R—roughly +20% to +30% net return at conservative 0.75%–1.0% risk.',
      'Always compute expectancy AFTER deducting commissions, spread, slippage, and funding fees.',
    ],
    limitationsNote: 'Positive historical expectancy is never a guarantee that the next 10 trades will be positive—variance and regime shifts always exist.',
    practicalExample:
      'Win Rate = 45% (0.45), Avg Win = 2.2R, Loss Rate = 55% (0.55), Avg Loss = 1.0R, Avg Fee = 0.05R. Net Expectancy = (0.45 × 2.2) − (0.55 × 1.0) − 0.05 = 0.99 − 0.55 − 0.05 = +0.39R per trade.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.13'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'A strategy has a 50% Win Rate, +2.0R Average Win, and −1.0R Average Loss (ignoring fees). What is its mathematical Expectancy per trade?',
      options: ['+0.25R', '+0.50R', '+1.00R', '0.00R'],
      correctIndex: 1,
      rationale: 'Expectancy = (0.50 × 2.0R) − (0.50 × 1.0R) = 1.00R − 0.50R = +0.50R per trade.',
      commonTrap: 'Ignoring trading fees and slippage in high-frequency scalping where 0.15R average friction turns a +0.10R paper edge into a −0.05R losing system.',
    },
  },
  {
    id: 'topic-st7-15',
    code: 'ST7.15',
    slug: 'strategy-st7-15-strategy-optimization',
    title: 'Strategy Optimization',
    overviewEn:
      'Strategy optimization refines weak links—such as eliminating worst-performing trading hours or adjusting stop placement—using out-of-sample validation while strictly avoiding curve-fitting (over-optimizing to past noise).',
    overviewTaglish:
      'Pinapaganda ng strategy optimization ang mahihinang bahagi (gaya ng pagtanggal ng taluning oras o setup) gamit ang out-of-sample testing—pero mahigpit na iniiwasan ang curve-fitting sa nakaraang noise.',
    objectives: [
      'Distinguish robust improvement (fewer parameters, logical market rationale, holds up out-of-sample) from curve-fitting (hyper-tweaked parameters failing live).',
      'Apply Walk-Forward / Out-of-Sample validation: optimize on Dataset A, verify on unseen Dataset B.',
      'Make ONE controlled change at a time and test across at least 30–50 trades before evaluating impact.',
    ],
    keyPoints: [
      'If changing a moving average from 20 to 21 collapses your backtest, the strategy is curve-fit junk—robust edges work across a wide band (e.g., 15–30).',
      'Often the highest-ROI optimization is SUBTRACTION: cutting your worst session, worst asset, or worst low-grade setup.',
      'Simpler strategies with 2–3 core rules adapt far better to changing live markets than 12-rule hyper-tuned models.',
    ],
    limitationsNote: 'Over-optimization creates stunning backtest charts that immediately break down in live markets.',
    practicalExample:
      'Journal analysis reveals 100% of a trader’s net losses came from Friday afternoon trades and counter-trend shorts. Simply cutting those two leaks lifts net expectancy from +0.12R to +0.34R without touching core entry rules.',
    level: 4,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.14'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is the clearest warning sign that a backtested trading strategy has been dangerously "curve-fit" (over-optimized)?',
      options: [
        'It uses only two simple rules based on market structure and trend',
        'It produces amazing profits ONLY with bizarre hyper-specific inputs (e.g., 13.7 EMA + 17-minute RSI at 63.4) and falls apart on slightly different settings or unseen data',
        'It experiences occasional 4-trade losing streaks in backtesting',
        'It works similarly across 2021, 2022, 2023, and 2024',
      ],
      correctIndex: 1,
      rationale: 'Curve-fitting memorizes past random noise rather than real market behavior; fragile hyper-tuned parameters collapse immediately out-of-sample.',
      commonTrap: 'Tweaking indicator numbers endlessly until a historical backtest shows zero losing months, then watching it lose money from week one live.',
    },
  },

  // =========================================================================
  // MODULE PRO8 — Professional Trading and Portfolio Management (PRO8.1 – PRO8.10)
  // =========================================================================
  {
    id: 'topic-pro8-1',
    code: 'PRO8.1',
    slug: 'pro-pro8-1-building-a-trading-routine',
    title: 'Building a Trading Routine',
    overviewEn:
      'Consistent trading performance is built on a repeatable daily and weekly routine—separating calm analytical preparation, focused execution windows, post-session review, and complete mental recovery away from screens.',
    overviewTaglish:
      'Ang consistent na performance ay nakatayo sa malinaw na daily at weekly routine—hiwalay ang kalmadong paghahanda, takdang execution window, post-market review, at kumpletong pahinga malayo sa charts.',
    objectives: [
      'Structure a sustainable routine around your real sleep, family, and work schedule (protecting decision quality).',
      'Separate Analysis Time (when markets are closed or calm) from Execution Time (executing pre-defined alerts, not improvising).',
      'Set mandatory screen-off cutoffs so staring at charts for 10 hours never degrades willpower into boredom trades.',
    ],
    keyPoints: [
      'Decision fatigue is real: traders make their worst mistakes late at night or after staring aimlessly at lower timeframes for hours.',
      'Use price alerts at key levels instead of watching every single tick print.',
      'Physical basics—sleep, hydration, exercise, and stepping away after a daily max loss—directly protect your equity curve.',
    ],
    practicalExample:
      'A disciplined part-time trader runs a 20-minute morning/evening prep checklist, sets 4 price alerts on key levels, executes strictly during a 90-minute focus window, journals in 10 minutes, and closes the platform.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['ST7.15'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why do professional traders separate "Chart Analysis Time" from "Live Execution Time"?',
      options: [
        'Because brokers block charting tools while orders are open',
        'Because planning calmly before the session prevents emotional improvisation, FOMO chasing, and decision fatigue during live candles',
        'Because analysis is only allowed on Sundays',
        'Because live execution does not require stop-losses',
      ],
      correctIndex: 1,
      rationale: 'Pre-planned scenarios and price alerts turn live trading into calm execution of an already-vetted plan.',
      commonTrap: 'Gluing yourself to 1-minute charts for 8 straight hours thinking more screen time equals more profit—it usually breeds overtrading.',
    },
  },
  {
    id: 'topic-pro8-2',
    code: 'PRO8.2',
    slug: 'pro-pro8-2-pre-market-preparation',
    title: 'Pre-Market Preparation',
    overviewEn:
      'Pre-market preparation maps the day’s economic calendar, higher-timeframe key levels, top 2–4 focus instruments, exact "If-Then" trade scenarios, and your personal daily risk limit BEFORE volatility starts.',
    overviewTaglish:
      'Sa pre-market preparation, inihahanda muna ang economic calendar, higher-timeframe key levels, 2–4 focus tickers, malinaw na "If-Then" scenarios, at daily loss limit BAGO magbukas ang matinding galaw.',
    objectives: [
      'Check high-impact economic and earnings calendars in local PH time (CPI, FOMC, NFP, PSE/US corporate earnings).',
      'Mark clean Daily/4H levels (PDH/PDL, weekly highs/lows, key S/R & liquidity) and narrow watchlist to top 2–4 A+ candidates.',
      'Write concrete "If-Then" scenarios ("If price sweeps PDL and reclaims 15m, look for long; if it accepts below, stand aside").',
    ],
    keyPoints: [
      'Checking your mental readiness ("am I rested, calm, and focused?") is part of pre-market prep—sitting out on high-stress days saves capital.',
      'A focused 3-ticker watchlist beats scanning 50 random charts mid-session.',
      'Know your exact max dollar loss for the session before placing trade #1.',
    ],
    practicalExample:
      'At 8:45 PM PHT (45 min before US open), a trader checks CPI/FOMC calendar (clear), marks SPY/NVDA/BTC key levels, sets 3 alerts, confirms max daily risk = −1.5R ($150), and waits patiently.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.1'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'confluence-a-plus-setups',
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'What is the main benefit of writing "If-Then" scenarios during Pre-Market Preparation?',
      options: [
        'It guarantees the market will follow Scenario A every day',
        'It prepares objective conditional responses ahead of time so you react calmly to what price actually does instead of predicting blindly',
        'It removes the need to check the economic calendar',
        'It automatically executes trades on your behalf',
      ],
      correctIndex: 1,
      rationale: 'If-Then planning keeps you flexible and objective—avoiding stubborn bias when price invalidates your primary hypothesis.',
      commonTrap: 'Starting a session without checking red-folder macro news times and getting whipsawed immediately on an 8:30 AM ET / 8:30 PM PHT data release.',
    },
  },
  {
    id: 'topic-pro8-3',
    code: 'PRO8.3',
    slug: 'pro-pro8-3-post-market-review',
    title: 'Post-Market Review',
    overviewEn:
      'Post-market review closes the daily feedback loop in 10–15 minutes—capturing annotated chart screenshots, grading rule adherence, noting missed A+ setups, and emotionally resetting before tomorrow.',
    overviewTaglish:
      'Sinasara ng post-market review ang daily learning loop sa loob ng 10–15 minuto—naka-save ang chart screenshots, score sa pagsunod sa rules, missed A+ setups, at mental reset bago ang susunod na araw.',
    objectives: [
      'Archive entry and exit screenshots with clear labels for Setup Grade, Execution Grade, and Emotional State.',
      'Compare actual fills against planned levels to spot chronic slippage, early exits, or hesitation patterns.',
      'Identify one concrete behavior to repeat tomorrow and one specific leak to eliminate.',
    ],
    keyPoints: [
      'A 10-minute honest review after the close accelerates learning 5x faster than taking 100 unreviewed trades.',
      'Review winning trades just as critically as losers—did you win because of discipline or get bailed out by luck?',
      'Write a short closing reflection ("session complete") to detach emotionally from today’s P&L.',
    ],
    practicalExample:
      'In post-market review, a trader logs: "2 trades taken (+1.8R, −1.0R = +0.8R net). Followed plan 100% on both; stayed disciplined by skipping a late FOMO candle at 10:40 PM PHT. Execution Grade: A."',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.2'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why should your Post-Market Review audit WINNING trades just as thoroughly as losing trades?',
      options: [
        'To brag about your wins on social media',
        'To verify whether wins came from repeatable rule-compliant execution rather than lucky rule-breaking or oversized risk',
        'Because losing trades do not need to be logged',
        'Because brokers erase winning trades after 24 hours',
      ],
      correctIndex: 1,
      rationale: 'Undetected bad habits hidden inside lucky wins silently plant the seeds for future blowups.',
      commonTrap: 'Skipping post-market review on red days out of frustration—precisely when reviewing mistakes matters most.',
    },
  },
  {
    id: 'topic-pro8-4',
    code: 'PRO8.4',
    slug: 'pro-pro8-4-trading-journal-analysis',
    title: 'Trading Journal Analysis',
    overviewEn:
      'Monthly and quarterly trading journal analysis turns raw trade logs into actionable edge intelligence—slicing your results by setup tag, session hour, market, holding time, and mistake category.',
    overviewTaglish:
      'Ginagawa ng monthly/quarterly journal analysis ang raw trade logs na konkretong datos—hinahati ang resulta bawat setup, oras, market, at klase ng pagkakamali para mapalaki ang tunay na edge.',
    objectives: [
      'Segment your 50+ trade dataset by Setup Type, Asset Class, Time of Day, Day of Week, and Long vs. Short.',
      'Run the "Top 20% / Bottom 20% Audit": double down on highest-expectancy setups and cut chronic negative-expectancy leaks.',
      'Calculate MFE/MAE averages to verify whether your stop placement is too tight or profit targets are consistently left on the table.',
    ],
    keyPoints: [
      'Numbers never lie: you may feel great about scalping 5-minute charts while your journal proves 90% of profits come from 4H swings.',
      'Wait for at least 20–30 trades per tag before drawing statistical conclusions.',
      'Quantify your "Behavioral Tax" (total R lost strictly from rule violations) each month and aim to drive it toward zero.',
    ],
    practicalExample:
      'Quarterly audit across 90 trades shows: Trend Pullback (+18.4R, 54% WR), Opening Breakout (+6.2R, 46% WR), Counter-Trend Reversal (−11.5R, 28% WR). Eliminating counter-trend trades instantly transforms performance.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.3'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is typically the fastest, highest-probability way to boost net profitability discovered during quarterly Trading Journal Analysis?',
      options: [
        'Doubling leverage across every trade immediately',
        'Cutting chronic negative-expectancy leaks (worst setup tag, worst trading session, and rule-breaking mistake trades) while focusing capital on proven A+ setups',
        'Adding five brand-new untested markets at once',
        'Removing stop-losses from losing trades',
      ],
      correctIndex: 1,
      rationale: 'Eliminating documented leaks improves net expectancy immediately without needing to invent a brand-new strategy.',
      commonTrap: 'Collecting 100 journal entries dutifully yet never actually running monthly tag-by-tag analytics on them.',
    },
  },
  {
    id: 'topic-pro8-5',
    code: 'PRO8.5',
    slug: 'pro-pro8-5-portfolio-diversification',
    title: 'Portfolio Diversification',
    overviewEn:
      'Portfolio diversification allocates capital across genuinely distinct return drivers, asset classes, and time horizons (e.g., long-term passive investments, cash reserves, and active trading capital) to smooth overall wealth growth.',
    overviewTaglish:
      'Ipinamamahagi ng portfolio diversification ang kapital sa magkakaibang asset classes at time horizons (gaya ng pangmatagalang investment, cash reserve, at active trading fund) para mas matatag ang paglago ng yaman.',
    objectives: [
      'Separate overall net worth cleanly into buckets: Emergency Cash, Core Long-Term Investing (Index ETFs/Bonds/MP2), and Active Trading Risk Capital.',
      'Distinguish true cross-asset diversification (equities, fixed income, FX, commodities, crypto) from "diworsification" (holding 15 identical high-beta tech stocks).',
      'Rebalance allocations periodically so one booming volatile asset does not silently dominate 80% of your net worth.',
    ],
    keyPoints: [
      'Never fund an active trading account with emergency reserves, tuition, or short-term living expenses.',
      'Combining uncorrelated strategies (e.g., trend-following swing + passive dividend/index core) lowers total portfolio volatility.',
      'True diversification protects against single-market, single-broker, and single-currency shocks.',
    ],
    practicalExample:
      'A Filipino professional structures net worth as: 6 months emergency fund in liquid bank/money-market PHP, 60% long-term diversified ETFs/REITs/MP2, and 20% dedicated strictly to active trading with capped 1% trade risk.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.4'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Why is separating "Core Long-Term Investments" and "Emergency Cash" from "Active Trading Capital" a foundational professional rule?',
      options: [
        'Because brokers forbid owning index ETFs',
        'Because financial security outside your trading account eliminates survival pressure, preventing desperate emotional decisions during normal trading drawdowns',
        'Because active trading always outperforms passive investing every month',
        'Because emergency cash should be invested in 20x crypto futures',
      ],
      correctIndex: 1,
      rationale: 'Trading with scared rent money forces premature exits and tilt; walled-off risk capital allows calm, objective execution.',
      commonTrap: 'Holding 10 correlated tech stocks or 10 correlated altcoins and believing you have a diversified portfolio.',
    },
  },
  {
    id: 'topic-pro8-6',
    code: 'PRO8.6',
    slug: 'pro-pro8-6-correlation-and-exposure',
    title: 'Correlation and Exposure',
    overviewEn:
      'Managing correlation and total portfolio exposure prevents hidden risk stacking—measuring how simultaneously open positions move together (especially during market panics when risk-asset correlations converge toward +1.0).',
    overviewTaglish:
      'Pinipigilan ng correlation at exposure control ang nakatagong dobleng risk—sinusuri nito kung sabay-sabay gumagalaw ang mga bukas mong trades, lalo na tuwing panic kung kailan halos sabay-sabay bumabagsak ang risk assets.',
    objectives: [
      'Recognize major cross-market correlations: USD/DXY vs. EUR/USD & Gold, NAS100 vs. Tech Stocks & Bitcoin, BTC vs. Altcoins.',
      'Calculate Total Portfolio Heat (sum of all open stop-loss risks) and Clustered Correlated Risk.',
      'Split risk across correlated trades (e.g., 0.5% on NAS100 + 0.5% on BTC = 1.0% combined risk-on bet, NOT 1% + 1%).',
    ],
    keyPoints: [
      'Long EUR/USD + Long GBP/USD + Short USD/CHF = effectively 3x SHORT US DOLLAR exposure on one macro headline!',
      'Correlations are dynamic: during sharp risk-off shocks (CPI spike, geopolitical crisis), stocks, indices, and crypto frequently sell off in lockstep.',
      'Cap total open portfolio heat (e.g., max 3%–5% across all open trades combined).',
    ],
    practicalExample:
      'A trader wants to long both NVDA and NAS100 while already long BTC. Recognizing all three share high US risk-on tech beta, they split 1.2% total theme risk into 0.4% each instead of stacking 3% correlated exposure.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.5'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'A trader simultaneously opens 1% risk longs on EUR/USD, GBP/USD, and AUD/USD, plus a 1% risk short on USD/CHF. What hidden exposure risk did they just create?',
      options: [
        'Four completely independent, uncorrelated trades',
        'A concentrated ~4% directional bet AGAINST the US Dollar that can stop out all four positions simultaneously on one strong US economic print',
        'A perfectly hedged zero-risk portfolio',
        'Guaranteed protection against NFP volatility',
      ],
      correctIndex: 1,
      rationale: 'All four positions lose simultaneously if the US Dollar strengthens abruptly—stacking 4x intended single-theme risk.',
      commonTrap: 'Opening multiple correlated trades across Forex, Indices, and Crypto without summing total theme risk.',
    },
  },
  {
    id: 'topic-pro8-7',
    code: 'PRO8.7',
    slug: 'pro-pro8-7-managing-multiple-markets',
    title: 'Managing Multiple Markets',
    overviewEn:
      'Managing multiple markets lets experienced traders follow clean opportunity when one asset class goes dead—without spreading attention thin across too many tickers or mixing incompatible market mechanics.',
    overviewTaglish:
      'Pinapayagan ng multi-market management ang bihasang trader na lumipat kung saan malinaw ang trend kapag matamlay ang isang merkado—pero piling-pili lang ang assets at iginagalang ang kakaibang mechanics ng bawat market.',
    objectives: [
      'Master ONE primary market thoroughly before adding a secondary uncorrelated market (e.g., Forex + Gold, or US Stocks + BTC).',
      'Respect each market’s distinct mechanics: sessions, pip/tick/share sizing formulas, overnight swap/funding costs, and news catalysts.',
      'Maintain one unified risk unit (1R in account currency) across all traded markets.',
    ],
    keyPoints: [
      'Keep your active daily focus tight (typically 2–6 core instruments total) even if you understand all four asset classes.',
      'Multi-market literacy helps you read macro drivers (e.g., US Treasury yields & DXY moving Forex, Indices, Stocks, and Crypto together).',
      'Never transfer 24/7 crypto habits blindly into fixed-session PSE stocks or high-leverage forex without adjusting sizing and fees.',
    ],
    practicalExample:
      'When US stocks enter a choppy August summer range, an experienced multi-market trader shrinks stock activity to 1 A+ ticker and allocates normal 0.75% R setups to clean Gold and BTC weekly breakouts.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.6'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'What is the disciplined prerequisite before expanding from one market (e.g., Stocks) into actively trading multiple markets simultaneously?',
      options: [
        'Watching two YouTube videos on each new asset class',
        'Achieving consistent journaled execution in one primary market first, then adapting sizing, fees, and session rules cleanly per added market',
        'Opening 15 charts on one monitor from day one',
        'Using identical share/lot numbers across Forex, Crypto, and Stocks',
      ],
      correctIndex: 1,
      rationale: 'Spreading focus across four markets prematurely slows mastery; build repeatable process in one arena first, then expand selectively.',
      commonTrap: 'Jumping into a brand-new asset class right after a losing week in your primary market hoping for quick revenge profits.',
    },
  },
  {
    id: 'topic-pro8-8',
    code: 'PRO8.8',
    slug: 'pro-pro8-8-scaling-trading-capital',
    title: 'Scaling Trading Capital',
    overviewEn:
      'Scaling trading capital increases dollar risk gradually in structured milestones ONLY after verified profitable samples—and intentionally steps risk DOWN during drawdowns so psychology and liquidity adapt smoothly.',
    overviewTaglish:
      'Ang pagpapalaki ng trading capital ay paunti-unti at may malinaw na milestone MATAPOS lang ang napatunayang consistent performance—at kusang binabawasan ang size kapag nasa drawdown para manatiling kalmado.',
    objectives: [
      'Apply milestone scaling rules (e.g., increase base risk by +25%–50% only after 2–3 consecutive profitable months or +10R net equity high).',
      'Apply symmetric drawdown de-risking (e.g., cut risk per trade in half at −6% drawdown, return to full size only after recovering half the drawdown).',
      'Adapt psychologically to larger dollar P&L swings by framing trades strictly in R-multiples rather than grocery/rent equivalents.',
    ],
    keyPoints: [
      'Jumping instantly from $50 risk/trade to $500 risk/trade triggers intense emotional hesitation even with the exact same strategy.',
      'As capital scales higher, check order-book liquidity and slippage—tiny small-cap stocks or thin altcoins stop scaling cleanly.',
      'Withdraw a planned slice of profits periodically to build real-world wealth and reduce account concentration risk.',
    ],
    limitationsNote: 'Rapidly scaling up right at the top of a lucky hot streak guarantees taking your biggest dollar losses on the inevitable next drawdown.',
    practicalExample:
      'A trader proves consistent +14R over 60 trades risking $50/trade (0.75%). They step up gradually to $75/trade for the next 40-trade block—never jumping straight to $300/trade.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.7'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'What is the smartest risk adjustment when your trading account enters a −8% drawdown?',
      options: [
        'Double your risk per trade so one big winner recovers everything faster',
        'Step down your risk per trade (e.g., cut from 1.0% to 0.5%), audit your journal for mistakes vs. regime shift, and restore full size only after stabilizing',
        'Remove stop-losses until the account returns to breakeven',
        'Switch immediately to 50x leveraged altcoins',
      ],
      correctIndex: 1,
      rationale: 'Anti-martingale de-risking flattens drawdown curves, protects mental clarity, and keeps your account alive for the next favorable regime.',
      commonTrap: 'Going on "make-it-back" tilt by doubling position size during a cold streak—the #1 cause of sudden account blowups.',
    },
  },
  {
    id: 'topic-pro8-9',
    code: 'PRO8.9',
    slug: 'pro-pro8-9-evaluating-trading-performance',
    title: 'Evaluating Trading Performance',
    overviewEn:
      'Evaluating trading performance at a professional level examines risk-adjusted returns (Sharpe/Sortino intuition, Calmar/Recovery ratio), consistency across regimes, benchmark comparison, and tax/fee-adjusted net results.',
    overviewTaglish:
      'Sa professional performance evaluation, tinitingnan ang risk-adjusted return (kita kumpara sa drawdown), katatagan sa iba’t ibang market regime, paghahambing sa passive benchmark, at netong kita matapos ang fees at buwis.',
    objectives: [
      'Compare active trading net return AND drawdown against simple passive index benchmarks (e.g., S&P 500 or BTC buy-and-hold) honestly.',
      'Inspect equity-curve smoothness, Calmar/Recovery ratio (Annualized Return ÷ Max Drawdown), and longest underwater recovery time.',
      'Evaluate execution discipline metrics (Rule Adherence %, Missed A+ Rate, Average Slippage) alongside financial P&L.',
    ],
    keyPoints: [
      'Making +15% with a smooth −4% max drawdown demonstrates far stronger risk-adjusted skill than making +25% while enduring a terrifying −35% drawdown.',
      'Always evaluate over rolling 3-, 6-, and 12-month windows—one great week or one red month proves almost nothing.',
      'If active trading underperforms a low-cost index ETF after fees and hours spent, refine your edge or let passive indexing do the heavy lifting.',
    ],
    practicalExample:
      'At year-end review, a trader evaluates: +24% net return after all fees/funding, −6.5% max drawdown (Recovery Ratio 3.7x), 94% rule adherence across 142 trades—confirming a genuine, scalable risk-adjusted edge.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.8'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why do institutional portfolio allocators care deeply about Risk-Adjusted Return (Return relative to Maximum Drawdown) rather than raw headline gain alone?',
      options: [
        'Because high returns are penalized by exchanges',
        'Because huge raw gains accompanied by massive −40% drawdowns signal fragile over-risking that can easily end in total blowup',
        'Because drawdown does not affect compounding math',
        'Because only strategies with 0% drawdown exist in institutional finance',
      ],
      correctIndex: 1,
      rationale: 'Controlled drawdowns prove genuine risk discipline and allow safe compounding, whereas reckless volatility eventually destroys capital.',
      commonTrap: 'Measuring success by your single biggest winning month while ignoring three quiet months of fee bleed and deep drawdowns.',
    },
  },
  {
    id: 'topic-pro8-10',
    code: 'PRO8.10',
    slug: 'pro-pro8-10-developing-long-term-trading-career',
    title: 'Developing a Long-Term Trading Career',
    overviewEn:
      'Building a sustainable long-term trading career requires treating trading like a serious multi-year business—keeping stable outside income while developing, prioritizing longevity over flashy shortcuts, adapting to changing markets, and staying humble.',
    overviewTaglish:
      'Ang pangmatagalang trading career ay itinuturing na seryosong negosyo—may matatag na ibang pinagkakakitaan habang nagpapakahusay, inuuna ang longevity kaysa mabilisang yaman, at laging mapagpakumbaba sa merkado.',
    objectives: [
      'Never quit a stable job or business prematurely—maintain 12–24 months living expenses plus at least 1–2 full years of audited profitable track record first.',
      'Build resilience against burnout: hobbies outside markets, honest peer accountability, and continuous adaptation as market regimes evolve.',
      'Maintain lifelong tax compliance, legal record-keeping, and ethical capital stewardship.',
    ],
    keyPoints: [
      'Trying to pay monthly rent solely from a small trading account creates unbearable psychological pressure that ruins decision-making.',
      'Part-time swing trading paired with strong career/business income is one of the highest-success wealth formulas in the real world.',
      'Markets evolve constantly—humility, continuous learning, and ironclad risk management keep you profitable across decades.',
    ],
    practicalExample:
      'Instead of quitting their engineering career after 3 lucky months, a trader builds a 2-year audited track record part-time, compounds savings into both passive investments and trading capital, and trades completely pressure-free.',
    level: 5,
    pillar: 'advanced',
    supportedMarkets: ['all'],
    prerequisiteCodes: ['PRO8.9'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is the wisest career milestone BEFORE anyone should even consider relying on active trading for full-time living income?',
      options: [
        'Having two consecutive winning weeks on a demo account',
        'Building at least 1–2 full years of audited live consistency across different market regimes plus 12–24 months of separate living-expense reserves',
        'Borrowing a large personal loan to start with bigger capital',
        'Following a social-media guru promising instant financial freedom',
      ],
      correctIndex: 1,
      rationale: 'Separate living reserves and a multi-regime live track record remove survival anxiety so you are never forced to manufacture trades to pay bills.',
      commonTrap: 'Quitting a stable income stream after a single bull-market hot streak, only to panic when the market enters a 6-month choppy drawdown.',
    },
  },

  // =========================================================================
  // MODULE PH1 — Philippine Market Education (Optional: PH1.1 – PH1.6)
  // =========================================================================
  {
    id: 'topic-ph1-1',
    code: 'PH1.1',
    slug: 'ph-ph1-1-pse-psei-overview',
    title: 'Philippine Stock Exchange (PSE) & PSEi Overview',
    overviewEn:
      'The Philippine Stock Exchange (PSE) is the national regulated equity exchange of the Philippines, and the PSEi (PSE Composite Index) tracks 30 of the largest, most liquid Filipino corporations across conglomerates, banks, property, telecoms, and consumer sectors.',
    overviewTaglish:
      'Ang Philippine Stock Exchange (PSE) ang opisyal na stock exchange ng Pilipinas, at ang PSEi ang benchmark index na sumusubaybay sa 30 pinakamalalaki at pinaka-liquid na kumpanya sa bansa tulad ng mga bangko, conglomerates, at property firms.',
    objectives: [
      'Understand the structure of the PSE and its six major sector indices (Financials, Industrials, Holding Firms, Property, Services, Mining & Oil).',
      'Explain PSEi eligibility criteria (free-float market capitalization, liquidity, and semi-annual rebalancing).',
      'Recognize PSE-specific liquidity dynamics: blue-chip PSEi stocks trade cleanly while thin second/third-liner stocks carry wide spreads and manipulation risk.',
    ],
    keyPoints: [
      'PSEi constituents represent major pillars of the Philippine economy (e.g., SM, BDO, BPI, ALI, SMPH, AC, ICT, TEL, JFC).',
      'Official company disclosures, earnings, dividends, and corporate actions are published free on PSE EDGE (edge.pse.com.ph).',
      'Because PSE daily turnover is smaller than US markets, liquidity filtering and patience matter tremendously.',
    ],
    practicalExample:
      'A Filipino investor checks PSE EDGE for a PSEi bank’s latest quarterly 17-Q earnings filing and monitors whether PSEi itself is trending above or below its 200-day moving average before deploying PHP capital.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['pse', 'stocks'],
    prerequisiteCodes: [],
    optional: true,
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What does the PSEi (Philippine Stock Exchange Composite Index) represent?',
      options: [
        'Every single registered small business in the Philippines',
        'A curated benchmark basket of 30 of the largest and most liquid publicly listed companies on the Philippine Stock Exchange',
        'The official PHP-to-USD bank exchange rate',
        'A government savings bond with fixed 10% interest',
      ],
      correctIndex: 1,
      rationale: 'The PSEi tracks 30 top free-float, high-liquidity Philippine listed companies and serves as the main barometer of local equity sentiment.',
      commonTrap: 'Jumping straight into illiquid third-liner PSE penny stocks ("basura stocks") driven by chatroom hype instead of liquid PSEi blue chips.',
    },
  },
  {
    id: 'topic-ph1-2',
    code: 'PH1.2',
    slug: 'ph-ph1-2-ph-brokers-platforms-board-lots',
    title: 'Philippine Brokers, Trading Platforms & Board Lots',
    overviewEn:
      'Trading on the PSE requires an SEC-licensed and PSE-accredited stockbroker (such as COL Financial, FirstMetroSec, BDO Securities, BPI Trade, DragonFi, or AAA Equities) and following the PSE Board Lot Table, which sets minimum share quantities and price tick sizes per price tier.',
    overviewTaglish:
      'Para makapag-trade sa PSE, kailangan ng SEC-licensed at PSE-accredited broker at kailangang sundin ang PSE Board Lot Table na nagtatakda ng minimum na bilang ng shares at tamang tick size bawat presyo.',
    objectives: [
      'Verify broker accreditation directly on the official PSE and SEC Philippines directories before funding.',
      'Read the PSE Board Lot Table (minimum lot size + tick increment) so orders never get rejected and position sizing stays accurate.',
      'Understand the Odd Lot market (buying/selling fewer shares than 1 board lot) and why its liquidity and pricing are weaker.',
    ],
    keyPoints: [
      'Unlike US brokers allowing 1 share (or fractional shares), regular PSE Main Board orders must be exact multiples of the stock’s Board Lot (e.g., 10 shares for ₱100+ stocks, 100 shares for ₱5–₱49.95 stocks, 1,000 shares for ₱0.50–₱4.99 stocks).',
      'To avoid heavy minimum-commission drag (₱20 minimum broker commission per order), keep single PSE orders around ₱8,000+ when practical.',
      'Always verify broker PDIC/SIPC-equivalent protections: PSE brokers are covered by the Securities Investors Protection Fund (SIPF) against broker insolvency (not market losses).',
    ],
    practicalExample:
      'A stock priced at ₱32.00 falls in the 100-share board-lot tier (₱0.05 tick size), so 1 minimum board lot costs ₱3,200—buying 3 board lots (300 shares = ₱9,600) cleanly clears the ₱20 minimum commission threshold.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['pse', 'stocks'],
    prerequisiteCodes: ['PH1.1'],
    optional: true,
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why is buying a tiny ₱1,000 stock order on the Philippine Stock Exchange generally inefficient in terms of transaction fees?',
      options: [
        'Because the PSE blocks orders under ₱10,000',
        'Because most PH brokers charge a ₱20 minimum commission per order (plus VAT/fees), turning a ₱1,000 trade into a ~2%+ one-way commission hit instead of 0.25%',
        'Because ₱1,000 orders do not qualify for dividends',
        'Because board lots only apply to orders over ₱1,000,000',
      ],
      correctIndex: 1,
      rationale: 'Since ₱20 ÷ 0.0025 = ₱8,000, orders below ~₱8,000 pay a disproportionately higher effective commission percentage.',
      commonTrap: 'Submitting a limit price that does not match the PSE tick-size table and wondering why the order was immediately rejected.',
    },
  },
  {
    id: 'topic-ph1-3',
    code: 'PH1.3',
    slug: 'ph-ph1-3-pse-trading-hours-settlement',
    title: 'PSE Trading Hours (9:30 AM–3:00 PM PH) & Settlement Cycle',
    overviewEn:
      'The Philippine Stock Exchange operates Monday through Friday (excluding Philippine holidays) from 9:30 AM to 3:00 PM Philippine Time—including Pre-Open, Continuous Trading, Midday Recess, Market Close/Run-Off, and a T+2 settlement cycle.',
    overviewTaglish:
      'Bukas ang PSE mula Lunes hanggang Biyernes (maliban sa PH holidays) simula 9:30 AM hanggang 3:00 PM Philippine Time—may Pre-Open, Recess sa tanghali, Market-on-Close, at T+2 settlement cycle.',
    objectives: [
      'Map the complete PSE trading day schedule in Philippine Time (UTC+8): Pre-Open (9:00–9:30 AM), Morning Session (9:30 AM–12:00 PM), Recess (12:00–1:30 PM), Afternoon Session (1:30–2:45 PM), Pre-Close & Run-Off (2:45–3:00 PM).',
      'Understand PSE static price-band thresholds (ceiling +50% / floor −30% from previous close) and Pre-Close institutional auction spikes.',
      'Plan cash withdrawals around PSE’s T+2 settlement cycle (Trade Date plus 2 banking days via SCCP).',
    ],
    keyPoints: [
      'Avoid placing blind Market orders during the 9:00–9:30 AM Pre-Open or 2:45–2:50 PM Pre-Close auction auctions—use controlled Limit orders.',
      'Heavy foreign/institutional MSCI and FTSE rebalancing often prints big volume bursts at the 2:50 PM Market-on-Close (MOC) auction.',
      'Sale proceeds become buying power right away on most PH brokers, but bank cash withdrawals settle after T+2 banking days.',
    ],
    practicalExample:
      'You sell ₱50,000 of Ayala Land (ALI) on Wednesday afternoon; your cash proceeds officially clear for bank withdrawal on Friday (T+2 banking days), assuming Thursday and Friday are regular banking days.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['pse', 'stocks'],
    prerequisiteCodes: ['PH1.2'],
    optional: true,
    estimatedMinutes: 8,
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'During which exact continuous window (Philippine Time) does the Philippine Stock Exchange (PSE) conduct its daily main trading sessions?',
      options: [
        '9:30 PM – 4:00 AM PHT (overnight)',
        '9:30 AM – 12:00 PM PHT (Morning) and 1:30 PM – 2:45 PM PHT (Afternoon), followed by Pre-Close/Run-Off until 3:00 PM PHT',
        '24 hours a day including weekends',
        '8:00 AM – 5:00 PM PHT continuously with no midday recess',
      ],
      correctIndex: 1,
      rationale: 'PSE runs from 9:30 AM to 3:00 PM PHT with a 12:00 PM–1:30 PM lunch recess and 2:45–3:00 PM Pre-Close/Run-Off phases.',
      commonTrap: 'Trying to withdraw stock-sale proceeds to your Philippine bank account the same afternoon without accounting for the T+2 settlement cycle.',
    },
  },
  {
    id: 'topic-ph1-4',
    code: 'PH1.4',
    slug: 'ph-ph1-4-php-denominated-investments',
    title: 'Philippine Peso (PHP) Denominated Investments (Stocks, REITs, Bonds, MP2)',
    overviewEn:
      'Filipino savers and traders can build a balanced Philippine Peso (PHP) foundation combining PSE stocks, dividend-paying Philippine REITs, Retail Treasury Bonds (RTBs), high-yield digital time deposits, and Pag-IBIG MP2—matching each vehicle to time horizon and risk tolerance.',
    overviewTaglish:
      'Puwedeng pagtagpi-tagpiin ng Filipino investors ang matibay na PHP portfolio gamit ang PSE stocks, Philippine REITs, Retail Treasury Bonds (RTBs), at tax-free Pag-IBIG MP2—ayon sa layunin, oras, at kayang tanggaping risk.',
    objectives: [
      'Compare risk, liquidity, and typical return profiles across PSE Stocks, PH REITs (e.g., AREIT, RCR, MREIT, CREIT), Government Bonds/RTBs, and Pag-IBIG MP2.',
      'Understand Pag-IBIG MP2’s core features: government-guaranteed principal, 5-year maturity, variable annual dividends, and tax-free earnings for active Pag-IBIG members.',
      'Explain why holding low-risk PHP fixed income/MP2 alongside active trading removes pressure to force risky trades.',
    ],
    keyPoints: [
      'PH REITs must distribute at least 90% of distributable income as dividends (quarterly cash flow), though share prices fluctuate with BSP interest rates.',
      'Retail Treasury Bonds (RTBs) issued by the Bureau of the Treasury pay fixed quarterly interest (subject to 20% final withholding tax) and start as low as ₱5,000.',
      'Pag-IBIG MP2 dividends are historically attractive and tax-exempt, but funds are meant for a 5-year lock-in (early withdrawal forfeits part of dividends).',
    ],
    practicalExample:
      'A young Filipino earner builds an emergency fund in a PDIC-insured bank first, channels medium-term 5-year goals into Pag-IBIG MP2 and RTBs, builds quarterly income with PH REITs, and allocates only a dedicated risk budget to active stock/global trading.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['pse', 'stocks'],
    prerequisiteCodes: ['PH1.3'],
    optional: true,
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which key feature distinguishes Pag-IBIG MP2 from PSE Stocks and Philippine REITs?',
      options: [
        'MP2 trades intraday every minute on the Philippine Stock Exchange',
        'MP2 is a voluntary 5-year government-backed savings program with tax-free variable annual dividends and capital preservation, rather than fluctuating exchange-traded shares',
        'MP2 charges a 20% dividend tax and broker commission every month',
        'MP2 guarantees a fixed 30% monthly return',
      ],
      correctIndex: 1,
      rationale: 'Pag-IBIG MP2 preserves principal with tax-exempt variable dividends over a 5-year term, complementing—not replacing—liquid emergency cash or growth equities.',
      commonTrap: 'Putting short-term emergency money into 5-year MP2 or volatile PSE stocks and being forced to exit early at a loss.',
    },
  },
  {
    id: 'topic-ph1-5',
    code: 'PH1.5',
    slug: 'ph-ph1-5-local-taxation-stt-broker-fees',
    title: 'Local Taxation, Stock Transaction Tax & Broker Fees',
    overviewEn:
      'Every PSE trade incurs automatic broker-deducted fees—commission (up to 0.25% or ₱20 min), 12% VAT on commission, PSE & SCCP clearing fees, and the Stock Transaction Tax (STT) on sales—making fee math essential for breakeven planning.',
    overviewTaglish:
      'Bawat buy at sell sa PSE ay awtomatikong may bawas na broker commission (hanggang 0.25% o ₱20 min), 12% VAT sa commission, PSE/SCCP fees, at Stock Transaction Tax (STT) kapag nagbenta—kaya mahalagang alamin ang eksaktong breakeven price.',
    objectives: [
      'Break down exact Buy-side fees (Broker Commission + 12% VAT on commission + PSE 0.005% + SCCP 0.01%) vs. Sell-side fees (same + Stock Transaction Tax).',
      'Recognize the 2025 Capital Markets Efficiency Promotion Act (CMEPA / RA 12214) reform that lowered PSE Stock Transaction Tax from 0.6% to 0.1% effective July 1, 2025, dramatically improving PSE trader breakeven costs.',
      'Account for 10% final withholding tax on Philippine cash dividends for resident individual investors (deducted automatically at payout).',
    ],
    keyPoints: [
      'With STT reduced to 0.1% (under CMEPA), round-trip PSE breakeven cost on ₱8,000+ orders dropped from ~1.19% down to roughly ~0.69% (always confirm your specific broker’s fee table).',
      'Stock Transaction Tax on listed PSE shares replaces regular Capital Gains Tax—brokers withhold and remit it automatically on every sale.',
      'Even with lower STT, hyper-scalping tiny 0.5% ticks on PSE still loses money to round-trip commissions and spreads.',
    ],
    limitationsNote: 'Tax laws and broker fee schedules evolve—always verify latest rates on official BIR advisories and your licensed broker’s fee page.',
    practicalExample:
      'Buying ₱20,000 of a PSE stock incurs ~₱59 in buy fees (~0.295%); selling ₱20,000 incurs ~₱79 in sell fees (~0.395% including 0.1% STT)—requiring roughly a +0.70% gain just to clear round-trip fees.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['pse', 'stocks'],
    prerequisiteCodes: ['PH1.4'],
    optional: true,
    estimatedMinutes: 9,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'How are Stock Transaction Tax (STT) and Philippine cash dividend withholding tax typically handled for ordinary retail PSE investors?',
      options: [
        'Investors must personally line up at BIR every afternoon after each stock sale',
        'Licensed PSE brokers and issuers automatically withhold and remit STT on stock sales and 10% final tax on cash dividends directly upon settlement/payout',
        'PSE stocks and dividends have zero fees or taxes of any kind',
        'Taxes are only charged if you lose money on a trade',
      ],
      correctIndex: 1,
      rationale: 'Both PSE Stock Transaction Tax (sales) and the 10% final withholding tax on cash dividends are automatically withheld at source by brokers/issuers.',
      commonTrap: 'Forgetting round-trip PSE fees and thinking a +0.4% bounce is a winning trade when fees still leave you net negative.',
    },
  },
  {
    id: 'topic-ph1-6',
    code: 'PH1.6',
    slug: 'ph-ph1-6-bsp-sec-ph-investor-protection-scams',
    title: 'BSP & SEC Philippines Investor Protection & Scam Avoidance',
    overviewEn:
      'Philippine financial protection is anchored by the Securities and Exchange Commission (SEC Philippines) for investments/securities/brokers and the Bangko Sentral ng Pilipinas (BSP) for banks, e-wallets, and licensed Virtual Asset Service Providers (VASPs)—your essential shield against Ponzi and fake-trading scams.',
    overviewTaglish:
      'Ang SEC Philippines (para sa investments at brokers) at Bangko Sentral ng Pilipinas / BSP (para sa mga bangko, e-wallets, at licensed VASPs) ang opisyal na tagapagbantay laban sa investment scams at pekeng trading schemes sa Pilipinas.',
    objectives: [
      'Distinguish SEC Primary Registration (merely existing as a business corporation) from an SEC Secondary License (actual legal authority to solicit investments from the public).',
      'Verify entities directly via SEC Advisories (sec.gov.ph), PSE Accredited Brokers list, and BSP Supervised Financial Institutions / VASP lists before sending a single peso.',
      'Spot classic Philippine scam patterns: "double your money in 15 days," recruitment-funded payouts (Ponzi/pyramiding), unregulated offshore forex/crypto "paluwagan" fund managers, and spoofed GCash/Maya/bank OTP phishing.',
    ],
    keyPoints: [
      'A DTI permit or SEC Certificate of Incorporation does NOT legally authorize any company or "coach" to collect public investment money—demand a Secondary License!',
      'Any promise of "guaranteed 10%–30% monthly passive trading returns" with zero risk is mathematically a Ponzi scam.',
      'Never share your bank/e-wallet OTP, MPIN, broker login, or crypto seed phrase with ANY caller, group admin, or "account manager."',
    ],
    practicalExample:
      'An online group invites a Filipino worker to invest ₱50,000 in an "AI Forex/Crypto Bot" guaranteeing 25% monthly profit and shows an SEC Incorporation PDF. Checking sec.gov.ph reveals NO Secondary License and an active SEC Cease-and-Desist Advisory—saving their hard-earned savings.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['pse', 'stocks'],
    prerequisiteCodes: ['PH1.5'],
    optional: true,
    estimatedMinutes: 10,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'An online investment group shows you its "SEC Certificate of Incorporation" and promises guaranteed 20% monthly returns from forex/crypto trading. What is the critical legal fact every Filipino investor MUST know?',
      options: [
        'A Certificate of Incorporation automatically guarantees your deposit against loss',
        'A Primary SEC Certificate of Incorporation only registers a corporate entity—it does NOT grant a Secondary License to solicit public investments, and guaranteed 20%/month returns are a classic Ponzi red flag',
        'BSP insures all Facebook investment groups up to ₱500,000',
        'Guaranteed 20% monthly returns are standard for licensed PSE brokers',
      ],
      correctIndex: 1,
      rationale: 'Scammers routinely wave basic SEC corporate registration papers to fool victims; legally soliciting investments requires an explicit SEC Secondary License, and legitimate trading NEVER guarantees fixed high monthly returns.',
      commonTrap: 'Trusting an unlicensed "fund manager" or flashy luxury-car social media mentor just because early friends received initial payouts funded by newer recruits.',
    },
  },
];
