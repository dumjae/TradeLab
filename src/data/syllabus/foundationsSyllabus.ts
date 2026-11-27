import type { DiagramKind } from '../../types/academy';
import type {
  AcademyModule,
  DecoupledLessonNode,
  SyllabusQuizQuestion,
} from '../../types/curriculum-tree';

interface FoundationSeed {
  code: string;
  slug: string;
  title: string;
  overviewEn: string;
  overviewTaglish: string;
  objectives: [string, string, string];
  keyPoints: [string, string, string];
  limitationsNote?: string;
  practicalExample: string;
  prerequisiteCodes: string[];
  estimatedMinutes: number;
  linkedDeepLessonSlug?: string;
  diagramKind: DiagramKind;
  quiz: SyllabusQuizQuestion;
}

function buildFoundationNode(seed: FoundationSeed): DecoupledLessonNode {
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
    level: 1,
    pillar: 'foundations',
    supportedMarkets: ['all'],
    prerequisiteCodes: seed.prerequisiteCodes,
    estimatedMinutes: seed.estimatedMinutes,
    linkedDeepLessonSlug: seed.linkedDeepLessonSlug,
    diagramKind: seed.diagramKind,
    quiz: seed.quiz,
  };
}

export const FOUNDATIONS_MODULES: AcademyModule[] = [
  {
    id: 'mod-1',
    code: 'M1',
    title: 'Module 1 – Introduction to Trading',
    subtitle: 'Core trading mechanics, trading vs. investing, market participants, styles, timeframes, and myths.',
    pathId: 'master_foundations',
    pillar: 'foundations',
    level: 1,
    lessonCodes: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10'],
  },
  {
    id: 'mod-2',
    code: 'M2',
    title: 'Module 2 – Understanding Financial Markets',
    subtitle: 'Exchanges, brokers, liquidity, volatility, sessions in PHT (UTC+8), orders, spreads, and slippage.',
    pathId: 'master_foundations',
    pillar: 'foundations',
    level: 1,
    lessonCodes: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10'],
  },
  {
    id: 'mod-3',
    code: 'M3',
    title: 'Module 3 – Chart Reading and Candlesticks',
    subtitle: 'Chart types, candlestick anatomy, formations, trends, multiple timeframes, and charting tools.',
    pathId: 'master_foundations',
    pillar: 'foundations',
    level: 1,
    lessonCodes: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10'],
  },
  {
    id: 'mod-4',
    code: 'M4',
    title: 'Module 4 – Technical Analysis Fundamentals',
    subtitle: 'Support and resistance, structure swings, breakouts, pullbacks, indicators, Fibonacci, and volume.',
    pathId: 'master_foundations',
    pillar: 'foundations',
    level: 1,
    lessonCodes: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12'],
  },
  {
    id: 'mod-5',
    code: 'M5',
    title: 'Module 5 – Risk Management',
    subtitle: 'Capital preservation, risk per trade, RR (Risk-to-Reward Ratio), sizing, drawdown, and risk of ruin.',
    pathId: 'master_foundations',
    pillar: 'foundations',
    level: 1,
    lessonCodes: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10'],
  },
  {
    id: 'mod-6',
    code: 'M6',
    title: 'Module 6 – Trading Psychology',
    subtitle: 'Fear, greed, FOMO (Fear of Missing Out), revenge trading, discipline, and sustainable mindset.',
    pathId: 'master_foundations',
    pillar: 'foundations',
    level: 1,
    lessonCodes: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9', '6.10'],
  },
];

const FOUNDATION_SEEDS: FoundationSeed[] = [
  // =========================================================================
  // MODULE 1 – Introduction to Trading (1.1 – 1.10)
  // =========================================================================
  {
    code: '1.1',
    slug: 'what-is-trading',
    title: 'What is Trading?',
    overviewEn:
      'Trading is the structured buying and selling of financial instruments—such as currencies, stocks, indices, or cryptocurrencies—to capture price movement while strictly capping downside risk.',
    overviewTaglish:
      'Ang trading ay ang planadong pagbili at pagbenta ng financial assets (tulad ng Forex, stocks, o crypto) para kumita sa galaw ng presyo habang kontrolado ang posibleng talo.',
    objectives: [
      'Define active financial trading as a risk-managed probability business rather than gambling.',
      'Explain how traders profit from rising markets (going long) and falling markets (going short).',
      'Identify the four core pillars of trading: analysis, execution, risk management, and review.',
    ],
    keyPoints: [
      'Every trade is a hypothesis with a predefined entry, invalidation point (SL — Stop Loss), and target (TP — Take Profit).',
      'Consistency comes from repeatable risk rules across dozens of trades, never from predicting one candle.',
      'Trading requires capital protection first because losing capital shrinks your ability to compound.',
    ],
    practicalExample:
      'A trader buys EUR/USD at 1.0850 with a predefined SL (Stop Loss) at 1.0830 (20 pips risk) and TP (Take Profit) at 1.0890 (40 pips reward), risking 1% of a $1,000 demo account ($10).',
    prerequisiteCodes: [],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'chart-reading-fundamentals',
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What best distinguishes disciplined trading from gambling?',
      options: [
        'Trading guarantees a win on every single position you open.',
        'Trading applies predefined risk limits, tested rules, and measurable expectancy over many trades.',
        'Trading avoids using Stop Losses so trades never close in the red.',
        'Trading relies on social media alerts instead of charts.',
      ],
      correctIndex: 1,
      rationale: 'Disciplined trading treats every setup as a probabilistic event governed by strict risk per trade and repeatable execution.',
      commonTrap: 'Beginners often assume good traders predict the future with 90%+ accuracy rather than managing risk and reward.',
    },
  },
  {
    code: '1.2',
    slug: 'trading-vs-investing',
    title: 'Trading vs. Investing',
    overviewEn:
      'Short-term speculation, swing trading, and long-term investing differ sharply in holding period, decision drivers, transaction frequency, and risk management mechanics.',
    overviewTaglish:
      'Malaki ang pagkakaiba ng short-term speculation, swing trading, at long-term investing sa haba ng pag-hold, rason ng entry, at paraan ng pag-control ng risk.',
    objectives: [
      'Distinguish short-term speculation (scalping/day trading), swing trading, and long-term investing.',
      'Compare how technical price action vs. fundamental business value drives each approach.',
      'Match capital allocation and personal schedule to the right time horizon without mixing rules.',
    ],
    keyPoints: [
      'Short-term speculation (minutes to a day) targets intraday price swings using tight SL (Stop Loss) levels and incurs higher fee sensitivity.',
      'Swing trading (days to weeks) captures multi-day structural waves using Higher Timeframe (HTF) charts and moderate trade frequency.',
      'Long-term investing (years to decades) focuses on compounding earnings, dividends, and broad economic growth rather than daily chart noise.',
    ],
    limitationsNote:
      'Never turn a losing short-term trade into an unplanned "long-term investment" just to avoid accepting a Stop Loss.',
    practicalExample:
      'An investor dollar-cost averages into an S&P 500 index fund for 15 years, while a swing trader buys AAPL on a Daily pullback for a 10-day move with a strict -1% SL (Stop Loss).',
    prerequisiteCodes: ['1.1'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which comparison accurately separates short-term speculation, swing trading, and long-term investing?',
      options: [
        'All three hold positions for the exact same timeframe and use identical stop-loss widths.',
        'Short-term speculation targets intraday moves, swing trading holds for days to weeks, and long-term investing compounds fundamental value over years.',
        'Long-term investing requires closing every position before the daily market close.',
        'Swing trading ignores charts completely and only buys dividend stocks.',
      ],
      correctIndex: 1,
      rationale: 'Each approach has its own time horizon, edge source, and risk management protocol—mixing them leads to undisciplined decisions.',
      commonTrap: 'Holding a failed intraday trade overnight and calling it an "investment" destroys risk discipline.',
    },
  },
  {
    code: '1.3',
    slug: 'how-financial-markets-work',
    title: 'How Financial Markets Work',
    overviewEn:
      'Financial markets are organized venues where buyers and sellers discover fair prices by matching orders continuously through order books or dealer networks.',
    overviewTaglish:
      'Ang financial markets ay mga sistema kung saan nagtatagpo ang buyers at sellers para malaman ang patas na presyo sa pamamagitan ng pagtutugma ng mga order.',
    objectives: [
      'Explain price discovery as a continuous auction between bids and asks.',
      'Describe the role of an order book in matching resting limit orders with aggressive market orders.',
      'Understand why prices move only when aggressive orders consume available liquidity at a level.',
    ],
    keyPoints: [
      'A price quote reflects the last matched transaction between a willing buyer and a willing seller.',
      'Limit orders add liquidity to the order book; market orders consume liquidity to get filled immediately.',
      'When aggressive buying exhausts all resting sell orders at one price, the market ticks upward to the next offer.',
    ],
    practicalExample:
      'If 500 shares are offered at $100.00 and an aggressive buyer submits a market buy for 800 shares, 500 fill at $100.00 and the remaining 300 move price up to $100.05.',
    prerequisiteCodes: ['1.2'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-liquidity',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'What directly causes an asset price to move higher in an order-driven market?',
      options: [
        'Aggressive buy orders consuming available sell orders at the current price level.',
        'The exchange manually raising prices every hour.',
        'More people watching the chart without placing orders.',
        'Having fewer indicators drawn on the screen.',
      ],
      correctIndex: 0,
      rationale: 'Prices only tick up when aggressive buyers clear resting sell liquidity and must pay the next higher ask price.',
      commonTrap: 'Thinking "more buyers than sellers" moves price—every trade has one buyer and one seller; urgency (aggressiveness) moves price.',
    },
  },
  {
    code: '1.4',
    slug: 'buyers-sellers-market-participants',
    title: 'Buyers, Sellers, and Market Participants',
    overviewEn:
      'Every market tick reflects interactions among retail traders, commercial hedgers, market makers, funds, and central banks—each operating with different mandates and horizons.',
    overviewTaglish:
      'Bawat galaw ng presyo ay bunga ng kilos ng iba-ibang kalahok tulad ng retail traders, hedgers, market makers, at malalaking institusyon na may kanya-kanyang layunin.',
    objectives: [
      'Categorize the main groups participating in global markets.',
      'Differentiate speculative motives from commercial hedging and liquidity provision.',
      'Recognize why retail traders benefit from agility while institutions move large volume.',
    ],
    keyPoints: [
      'Market makers quote continuous buy and sell prices to earn the bid-ask spread while managing inventory risk.',
      'Commercial hedgers (such as airlines or exporters) trade to lock in business costs, not necessarily to predict short-term charts.',
      'Retail traders cannot move major markets, so their primary advantage is flexibility and selective risk control.',
    ],
    practicalExample:
      'A Japanese automaker sells USD/JPY to hedge export revenue, while a retail swing trader participates alongside the resulting trend with a tiny, nimble position.',
    prerequisiteCodes: ['1.3'],
    estimatedMinutes: 7,
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'What is the primary operational advantage a retail trader holds over a multi-billion-dollar institution?',
      options: [
        'Retail traders can push the price of EUR/USD at will.',
        'Retail traders can enter and exit quickly without moving the market and can stay in cash during poor conditions.',
        'Retail traders never pay spreads or commissions.',
        'Retail traders receive private central bank rate decisions early.',
      ],
      correctIndex: 1,
      rationale: 'Small size lets retail traders enter cleanly and sit patiently on the sidelines whenever market conditions lack clarity.',
      commonTrap: 'Assuming retail traders must trade every day; institutions have deployment mandates, whereas retail traders can wait.',
    },
  },
  {
    code: '1.5',
    slug: 'understanding-supply-and-demand',
    title: 'Understanding Supply and Demand',
    overviewEn:
      'Supply represents willing selling pressure and demand represents willing buying interest; persistent imbalances between the two create directional price trends.',
    overviewTaglish:
      'Ang supply ay dami ng gustong magbenta at ang demand ay dami ng gustong bumili; kapag hindi pantay ang dalawa, doon nabubuo ang malakas na galaw ng presyo.',
    objectives: [
      'Connect basic supply-and-demand economics directly to chart price reactions.',
      'Recognize zones where rapid price departure signals strong order imbalance.',
      'Explain why repeated retests gradually weaken a supply or demand zone.',
    ],
    keyPoints: [
      'Excess demand over supply forces price upward until higher prices attract enough sellers to restore balance.',
      'Excess supply over demand pushes price downward until discounted prices attract committed buyers.',
      'Fresh zones with sharp departures often hold more unfilled interest than zones already tested four or five times.',
    ],
    practicalExample:
      'After stalling at $50, a stock rallies abruptly to $56 on strong volume; when price revisits $50.50 later, remaining buy orders often react first.',
    prerequisiteCodes: ['1.4'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'support-resistance-supply-demand',
    diagramKind: 'support_demand',
    quiz: {
      prompt: 'Why does a demand zone typically become weaker after price tests it four or five times?',
      options: [
        'Candlesticks automatically lose color after four touches.',
        'Each revisit absorbs part of the resting buy orders until sellers can eventually break through.',
        'Brokers disable buy orders at heavily tested levels.',
        'Demand zones get permanently stronger with every single touch without limit.',
      ],
      correctIndex: 1,
      rationale: 'Resting orders are finite; each touch fills more of them, leaving less buying support to stop future selling pressure.',
      commonTrap: 'Blindly buying the fifth touch of a support zone without checking whether momentum is already compressing downward.',
    },
  },
  {
    code: '1.6',
    slug: 'bullish-bearish-sideways-markets',
    title: 'Bullish, Bearish, and Sideways Markets',
    overviewEn:
      'Markets cycle through three primary regimes: bullish uptrends, bearish downtrends, and sideways consolidations—each demanding a different playbook.',
    overviewTaglish:
      'Umiikot ang merkado sa tatlong kondisyon: bullish (paakyat), bearish (pababa), at sideways (naka-range lang)—bawat isa ay may sariling tamang estratehiya.',
    objectives: [
      'Identify bullish, bearish, and sideways regimes objectively on any chart.',
      'Explain why trend-following setups struggle inside tight sideways ranges.',
      'Adapt trade selection to the prevailing market regime before placing orders.',
    ],
    keyPoints: [
      'Bullish markets advance through Higher Highs (HH) and Higher Lows (HL), favoring pullback longs.',
      'Bearish markets decline through Lower Highs (LH) and Lower Lows (LL), favoring rally-rejection shorts.',
      'Sideways (ranging) markets oscillate between clear boundaries, where chasing breakouts often triggers losses.',
    ],
    practicalExample:
      'When BTC/USDT trades repeatedly between $60,000 and $64,000 for two weeks, trend breakout entries suffer whipsaws until a decisive close exits the range.',
    prerequisiteCodes: ['1.5'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'Which market condition most frequently causes trend-following breakout traders to take consecutive fakeout losses?',
      options: [
        'A clean bullish uptrend with steady Higher Lows.',
        'A clean bearish downtrend with steady Lower Highs.',
        'A choppy sideways range where price repeatedly snaps back inside boundaries.',
        'A high-volume breakout that holds above resistance.',
      ],
      correctIndex: 2,
      rationale: 'Breakout strategies expect follow-through, which is scarce in sideways ranges where mean reversion dominates.',
      commonTrap: 'Forcing trend setups during flat consolidations instead of waiting for regime transition or trading range extremes.',
    },
  },
  {
    code: '1.7',
    slug: 'different-trading-styles',
    title: 'Different Trading Styles',
    overviewEn:
      'Scalping, day trading, swing trading, and position trading vary by speed, screen time, stress profile, and transaction cost impact.',
    overviewTaglish:
      'Ang scalping, day trading, swing trading, at position trading ay nagkakaiba sa bilis ng trades, oras sa harap ng screen, at epekto ng trading fees.',
    objectives: [
      'Compare scalping, day trading, swing trading, and position trading across holding durations.',
      'Evaluate how spreads and commissions disproportionately impact ultra-short-term scalping.',
      'Select a trading style that realistically fits work, study, and sleep schedules.',
    ],
    keyPoints: [
      'Scalpers hold trades for seconds to minutes and require ultra-low spreads plus fast execution.',
      'Day traders open and close positions within the same trading session to avoid overnight gap risk.',
      'Swing traders hold for days to weeks, making this style well suited for working professionals and students.',
    ],
    practicalExample:
      'A full-time employee in Manila chooses swing trading on 4H and Daily charts, reviewing setups for 20 minutes each evening rather than scalping 1-minute charts during work.',
    prerequisiteCodes: ['1.6'],
    estimatedMinutes: 8,
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'Which trading style generally fits a beginner with a full-time daytime job best?',
      options: [
        '15-second news scalping during work meetings.',
        'Swing trading on 4-Hour and Daily charts with pre-planned orders.',
        'Opening 40 random intraday trades from a phone.',
        'High-frequency algorithmic arbitrage.',
      ],
      correctIndex: 1,
      rationale: 'Swing trading gives enough time for calm analysis, lower fee drag, and disciplined planning outside work hours.',
      commonTrap: 'Choosing scalping because it looks exciting online, only to suffer high spread costs and emotional burnout.',
    },
  },
  {
    code: '1.8',
    slug: 'trading-timeframes',
    title: 'Trading Timeframes',
    overviewEn:
      'A chart timeframe determines how much time each candlestick represents—from 1-minute bursts to Monthly macro cycles—and directly shapes signal reliability.',
    overviewTaglish:
      'Tinutukoy ng timeframe kung gaano katagal ang bawat kandila—mula 1-minute hanggang Monthly—at direktang nakakaapekto ito sa linaw at tibay ng signal.',
    objectives: [
      'Explain how Higher Timeframes (HTF) filter out noise compared to Lower Timeframes (LTF).',
      'Pair an analysis timeframe with an execution timeframe cleanly.',
      'Recognize why an LTF downtrend can simply be a healthy pullback inside an HTF uptrend.',
    ],
    keyPoints: [
      'Higher Timeframes (Daily, Weekly, 4H) carry more traded volume per candle and produce more reliable structural levels.',
      'Lower Timeframes (1m, 5m, 15m) provide tighter entry precision but contain significantly more random noise.',
      'Keep timeframe pairing simple—such as Daily for bias and 1H for entries—to avoid analysis paralysis.',
    ],
    practicalExample:
      'A 15-minute chart looks bearish for three hours, yet zooming out to the Daily chart shows price is merely pulling back into a major Higher Low.',
    prerequisiteCodes: ['1.7'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'multi-timeframe-alignment',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'Why do Higher Timeframe (HTF) levels usually carry more weight than 1-minute levels?',
      options: [
        'Higher Timeframes include more order flow and broader market participation per candle.',
        '1-minute charts use fake prices.',
        'Higher Timeframes never have losing trades.',
        'Brokers widen spreads on Daily charts.',
      ],
      correctIndex: 0,
      rationale: 'More market participants watch and execute around Daily and 4H levels, filtering out short-term random fluctuations.',
      commonTrap: 'Staring exclusively at 1-minute charts and getting chopped up against an obvious Daily resistance zone.',
    },
  },
  {
    code: '1.9',
    slug: 'trading-terminologies',
    title: 'Trading Terminologies',
    overviewEn:
      'Mastering core vocabulary—Long, Short, Bid, Ask, Spread, Pip, Lot, Leverage, Margin, SL (Stop Loss), TP (Take Profit), and RR (Risk-to-Reward Ratio)—prevents costly execution errors.',
    overviewTaglish:
      'Ang pag-unawa sa mga pangunahing salita tulad ng Long, Short, Bid, Ask, Spread, Margin, SL (Stop Loss), at TP (Take Profit) ay pumipigil sa mamahaling pagkakamali sa pag-order.',
    objectives: [
      'Define essential order, position, and risk terms accurately without guessing acronyms.',
      'Distinguish leverage (borrowing power) from margin (collateral locked to hold a position).',
      'Read an order ticket confidently before ever risking real or demo capital.',
    ],
    keyPoints: [
      'Going Long means buying to profit from rising prices; going Short means selling first to profit from falling prices.',
      'SL (Stop Loss) caps maximum loss if your idea is wrong; TP (Take Profit) locks in gains at your target.',
      'Leverage magnifies both gains and losses equally—high available leverage does not force you to take large risk.',
    ],
    practicalExample:
      'Before clicking Submit on a demo ticket, a trader checks Side (Long), Size (0.10 lots), SL (Stop Loss = $15 risk), TP (Take Profit = $30 reward), and RR (Risk-to-Reward Ratio = 1:2).',
    prerequisiteCodes: ['1.8'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What does a Stop Loss (SL) order do in a live or demo position?',
      options: [
        'Guarantees a profitable exit no matter where price moves.',
        'Automatically closes the trade near a predefined invalidation price to limit downside loss.',
        'Doubles your position size whenever a trade goes against you.',
        'Eliminates broker commissions on the trade.',
      ],
      correctIndex: 1,
      rationale: 'An SL (Stop Loss) enforces your maximum planned risk when price invalidates your trade thesis.',
      commonTrap: 'Confusing leverage with risk—risk is controlled by position size and Stop Loss distance, not the broker maximum leverage number.',
    },
  },
  {
    code: '1.10',
    slug: 'common-trading-myths',
    title: 'Common Trading Myths and Misconceptions',
    overviewEn:
      'Separating social-media myths—like "95% win rate," "easy passive income," or "secret indicators"—from statistical reality protects new traders from scams and blown accounts.',
    overviewTaglish:
      'Ang pagkilala sa mga maling akala sa social media tulad ng "siguradong kita" o "secret indicator" ay nagpoprotekta sa mga baguhan laban sa scam at pagkaubos ng puhunan.',
    objectives: [
      'Debunk unrealistic myths about win rates, get-rich-quick flipping, and magic indicators.',
      'Explain why profitable traders still experience regular losing trades and drawdowns.',
      'Adopt realistic milestones centered on skill acquisition and demo consistency first.',
    ],
    keyPoints: [
      'No indicator, chart pattern, or signal group predicts the market with 100% accuracy.',
      'A 45% win rate with an average 1:2.5 RR (Risk-to-Reward Ratio) is mathematically profitable over time.',
      'Sustainable trading skill typically takes months of journaling, simulation, and disciplined review.',
    ],
    limitationsNote:
      'Educational reminder: past performance in backtests or demos never guarantees future live returns.',
    practicalExample:
      'A trader wins 4 out of 10 trades (+2.5R each = +10R) and loses 6 trades (-1R each = -6R), finishing net +4R despite losing more often than winning.',
    prerequisiteCodes: ['1.9'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'risk-psychology',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Can a trader be net profitable over 100 trades with a 40% win rate?',
      options: [
        'No—you must win at least 80% of your trades to make money.',
        'Yes—if average winning trades are sufficiently larger than average losing trades after fees.',
        'Only if the trader removes Stop Losses completely.',
        'Only in cryptocurrency markets, never in stocks or Forex.',
      ],
      correctIndex: 1,
      rationale: 'Positive expectancy depends on both win rate and average win-to-loss size (RR), not win rate alone.',
      commonTrap: 'Chasing "90% win rate" systems that take tiny profits and huge unmanaged losses.',
    },
  },

  // =========================================================================
  // MODULE 2 – Understanding Financial Markets (2.1 – 2.10)
  // =========================================================================
  {
    code: '2.1',
    slug: 'what-are-financial-markets',
    title: 'What are Financial Markets?',
    overviewEn:
      'Financial markets channel capital across asset classes—Foreign Exchange (Forex), Equities (Stocks), Market Indices, Commodities, Bonds, and Digital Assets (Crypto).',
    overviewTaglish:
      'Pinagdudugtong ng financial markets ang kapital sa iba-ibang asset class tulad ng Forex, Stocks, Indices, Commodities, Bonds, at Crypto.',
    objectives: [
      'List the major global asset classes and what each represents economically.',
      'Compare liquidity, trading hours, and volatility drivers across asset classes.',
      'Understand why core chart reading and risk management transfer across every market.',
    ],
    keyPoints: [
      'Forex trades national currency pairs; stocks represent partial ownership in companies; indices track baskets of stocks.',
      'Commodities (like gold and oil) respond heavily to physical supply chains and inflation expectations.',
      'Crypto trades 24/7 globally with higher volatility and distinct weekend liquidity dynamics.',
    ],
    practicalExample:
      'When U.S. inflation rises unexpectedly, bond yields climb, the U.S. Dollar strengthens in Forex, and tech-heavy equity indices often pull back simultaneously.',
    prerequisiteCodes: ['1.10'],
    estimatedMinutes: 7,
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'Which asset class represents fractional ownership in a publicly listed business?',
      options: [
        'Foreign Exchange (Forex) currency pairs.',
        'Equities (Stocks).',
        'Spot crude oil futures.',
        'Stablecoins.',
      ],
      correctIndex: 1,
      rationale: 'Shares of stock represent equity ownership in a corporation and its future earnings.',
      commonTrap: 'Confusing a stock index (a basket like the S&P 500) with an individual company stock.',
    },
  },
  {
    code: '2.2',
    slug: 'centralized-vs-decentralized-markets',
    title: 'Centralized vs. Decentralized Markets',
    overviewEn:
      'Centralized exchanges route all orders through one official matching engine (such as NYSE or PSE), while decentralized Over-the-Counter (OTC) and on-chain markets distribute liquidity across multiple venues.',
    overviewTaglish:
      'Sa centralized exchange (tulad ng NYSE o PSE), iisa ang opisyal na matching engine; sa decentralized o OTC markets (tulad ng Forex o DeFi), kalat ang liquidity sa maraming venues.',
    objectives: [
      'Contrast centralized exchange order books with Over-the-Counter (OTC) dealer networks.',
      'Explain why official consolidated volume exists in stocks/futures but varies across Forex brokers.',
      'Identify custody and counterparty trade-offs in centralized vs. decentralized crypto venues.',
    ],
    keyPoints: [
      'Centralized exchanges (NYSE, NASDAQ, PSE, CME) enforce standardized clearing and unified trade tape volume.',
      'Spot Forex is a decentralized OTC network of banks and liquidity providers, so broker feeds show tick volume rather than total global volume.',
      'In crypto, Centralized Exchanges (CEX) hold custody while Decentralized Exchanges (DEX) settle via smart contracts from self-custody wallets.',
    ],
    practicalExample:
      'Two traders viewing EUR/USD on different brokers may see a 0.3-pip wick difference because Forex is OTC, whereas two traders viewing AAPL see identical NYSE official prints.',
    prerequisiteCodes: ['2.1'],
    estimatedMinutes: 8,
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'Why can two retail Forex brokers display slightly different candle highs or lows on EUR/USD?',
      options: [
        'Because spot Forex is a decentralized OTC market where each broker aggregates slightly different liquidity feeds.',
        'Because Forex charts do not use candlesticks.',
        'Because one broker is always displaying yesterday’s date.',
        'Because EUR/USD only trades on the New York Stock Exchange.',
      ],
      correctIndex: 0,
      rationale: 'Without a single central exchange, OTC dealers quote from their own liquidity pools, causing minor price-feed variances.',
      commonTrap: 'Using micro-pip stops so tight that tiny broker feed differences trigger avoidable stop-outs.',
    },
  },
  {
    code: '2.3',
    slug: 'exchanges-and-brokers',
    title: 'Exchanges and Brokers',
    overviewEn:
      'An exchange hosts the marketplace where assets trade, while a broker is the regulated intermediary providing your account, platform access, order routing, and margin rules.',
    overviewTaglish:
      'Ang exchange ang mismong palengke kung saan nagpapalitan ng asset, samantalang ang broker ang lisensyadong tagapamagitan na nagbibigay ng account at platform para makapag-trade ka.',
    objectives: [
      'Differentiate the role of a financial exchange from a retail broker.',
      'Explain why regulatory oversight (e.g., SEC, CFTC, FCA, ASIC) protects client funds.',
      'Compare broker revenue models: commissions, spreads, and financing swaps.',
    ],
    keyPoints: [
      'Always verify a broker’s regulatory license directly on the regulator’s official registry before depositing money.',
      'Reputable brokers segregate client funds from operating capital and publish transparent fee schedules.',
      'Free demo accounts let you evaluate platform execution, spreads, and order tools with zero capital risk.',
    ],
    practicalExample:
      'To buy Jollibee (JFC) shares on the Philippine Stock Exchange (PSE), a retail trader opens an account with a PSE-accredited, SEC-registered broker.',
    prerequisiteCodes: ['2.2'],
    estimatedMinutes: 7,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What is the safest first check before funding an account with any online broker?',
      options: [
        'Confirming they promise a 100% deposit bonus.',
        'Independently verifying their active license on the official financial regulator’s website.',
        'Checking how many luxury cars appear in their advertisements.',
        'Asking an anonymous group chat if withdrawals work.',
      ],
      correctIndex: 1,
      rationale: 'Direct regulator verification confirms legal oversight, segregated fund rules, and dispute recourse.',
      commonTrap: 'Trusting fake license screenshots or unregulated offshore brokers offering unrealistic deposit bonuses.',
    },
  },
  {
    code: '2.4',
    slug: 'market-participants-and-institutions',
    title: 'Market Participants and Institutions',
    overviewEn:
      'Central banks, commercial banks, pension funds, hedge funds, and proprietary trading firms drive the bulk of global order flow and macro trends.',
    overviewTaglish:
      'Ang mga central banks, commercial banks, pension funds, at hedge funds ang nagpapagalaw ng pinakamalaking bahagi ng volume at macro trend sa buong mundo.',
    objectives: [
      'Describe how central banks influence currencies, equities, and yields through interest rates.',
      'Understand why large funds split orders over time instead of buying everything in one candle.',
      'Avoid oversimplified myths that treat "institutions" as a single coordinated entity.',
    ],
    keyPoints: [
      'Institutions often compete against each other—one fund may be buying while another rebalances and sells.',
      'Large allocations create multi-day footprints because filling huge size without severe slippage takes time.',
      'Central bank policy decisions (Fed, ECB, BOJ, BSP) set the macro backdrop for capital flows.',
    ],
    limitationsNote:
      'Retail price charts do not show who is behind an order—only price and volume outcomes are directly observable.',
    practicalExample:
      'When the Federal Reserve signals slower interest-rate cuts, global bond desks reprice yields immediately, triggering sustained USD demand across multiple sessions.',
    prerequisiteCodes: ['2.3'],
    estimatedMinutes: 8,
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'Which statement best reflects how institutional participants actually behave in financial markets?',
      options: [
        'All banks act as one single mind targeting individual retail Stop Losses.',
        'Different institutions have competing mandates, time horizons, and hedging needs, creating diverse order flow.',
        'Institutions only trade on 1-minute charts using RSI.',
        'Central banks publish their exact intraday entry signals for retail traders.',
      ],
      correctIndex: 1,
      rationale: 'Institutional capital is fragmented across pensions, banks, hedgers, and funds with distinct goals and horizons.',
      commonTrap: 'Blaming every losing trade on "manipulation" instead of evaluating liquidity, volatility, and stop placement.',
    },
  },
  {
    code: '2.5',
    slug: 'market-liquidity-basics',
    title: 'Market Liquidity',
    overviewEn:
      'Liquidity measures how easily an asset can be bought or sold near its current price without causing large price distortion or wide spreads.',
    overviewTaglish:
      'Sinusukat ng liquidity kung gaano kadali makabili o makabenta ng asset malapit sa kasalukuyang presyo nang hindi biglang lumilipad ang presyo o lumalapad ang spread.',
    objectives: [
      'Define market liquidity in terms of order-book depth and tight bid-ask spreads.',
      'Compare high-liquidity instruments (e.g., EUR/USD, SPY, BTC) with thin, illiquid assets.',
      'Identify times when liquidity drops sharply—such as rollover, holidays, and major news.',
    ],
    keyPoints: [
      'High liquidity means tighter spreads, smoother fills, and cleaner technical price behavior.',
      'Low liquidity leads to erratic gaps, wide spreads, and heavy slippage during stop-loss execution.',
      'Always check both the instrument’s average volume and the current session before opening a position.',
    ],
    practicalExample:
      'Trading EUR/USD during the London–New York overlap often costs under 1 pip in spread, whereas trading an exotic pair during thin rollover can jump to 8+ pips.',
    prerequisiteCodes: ['2.4'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-liquidity',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'What typically happens when you place a market order in a thinly traded, illiquid asset?',
      options: [
        'You receive zero spread and an instant guaranteed fill at the exact mid-price.',
        'You face wider bid-ask spreads and greater risk of slippage away from your expected price.',
        'The exchange reimburses your transaction cost.',
        'Volatility permanently drops to zero.',
      ],
      correctIndex: 1,
      rationale: 'Thin order books have sparse resting orders, forcing market orders to fill across worse price levels.',
      commonTrap: 'Entering thin small-cap stocks or low-cap altcoins with market orders and losing several percent immediately to spread and slippage.',
    },
  },
  {
    code: '2.6',
    slug: 'volatility',
    title: 'Volatility',
    overviewEn:
      'Volatility measures the speed and magnitude of price fluctuations over a given period—creating both opportunity and heightened stop-out danger if position size is not adjusted.',
    overviewTaglish:
      'Sinusukat ng volatility kung gaano kabilis at kalaki gumalaw ang presyo—nagbibigay ito ng oportunidad pero mabilis ding makasira ng account kung hindi ia-adjust ang position size.',
    objectives: [
      'Distinguish volatility (size of swings) from direction (uptrend vs. downtrend).',
      'Use tools like ATR (Average True Range) to adapt Stop Loss distance to current market conditions.',
      'Explain why fixed lot sizes become dangerous when volatility doubles during news events.',
    ],
    keyPoints: [
      'High volatility is neither bullish nor bearish by itself—it simply means wider candles in either direction.',
      'When volatility expands, you must widen your SL (Stop Loss) and reduce your position size proportionally to keep dollar risk constant.',
      'Periods of abnormally tight volatility often precede sharp expansion moves.',
    ],
    practicalExample:
      'If Gold (XAU/USD) normally moves $12/day but jumps to $35/day during a macro shock, cutting position size to one-third keeps your 1% account risk intact.',
    prerequisiteCodes: ['2.5'],
    estimatedMinutes: 7,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'If an instrument’s daily volatility doubles, how should a disciplined trader keep dollar risk per trade unchanged?',
      options: [
        'Double the position size to finish faster.',
        'Widen the Stop Loss to fit normal noise and proportionally reduce position size.',
        'Remove the Stop Loss until volatility cools down.',
        'Keep the exact same tight stop and same large lot size.',
      ],
      correctIndex: 1,
      rationale: 'Dollar risk equals stop distance multiplied by position size; widening the stop requires shrinking size to preserve constant risk.',
      commonTrap: 'Keeping a fixed 10-pip stop during a 60-pip news spike and getting stopped out by normal noise.',
    },
  },
  {
    code: '2.7',
    slug: 'market-hours-and-trading-sessions',
    title: 'Market Hours and Trading Sessions',
    overviewEn:
      'Global markets follow predictable daily liquidity cycles—Asia, London, and New York sessions—plus fixed exchange hours for stocks like PSE and NYSE, all easily mapped to PHT (UTC+8).',
    overviewTaglish:
      'May malinaw na ritmo ang global sessions—Asia, London, at New York—pati ang oras ng stock exchanges tulad ng PSE at NYSE, na mahalagang i-track sa Philippine Time (PHT, UTC+8).',
    objectives: [
      'Map Asian, London, and New York session windows to PHT (UTC+8).',
      'Identify why the London–New York overlap produces peak global Forex and index liquidity.',
      'Compare 24/5 Forex, fixed-hour stock exchanges, and 24/7 cryptocurrency markets.',
    ],
    keyPoints: [
      'In PHT (UTC+8): Asia is active roughly 7:00 AM–4:00 PM, London opens around 3:00–4:00 PM (seasonal DST), and New York opens around 8:00–9:30 PM.',
      'The London–New York overlap (roughly 8:00 PM–12:00 AM PHT) typically brings the tightest spreads and strongest intraday trends.',
      'PSE stocks trade regular hours 9:30 AM–2:50 PM PHT (with noon recess), while crypto trades 24/7 with thinner liquidity often seen on weekends.',
    ],
    practicalExample:
      'A Manila-based Forex trader focuses on 8:00 PM–11:00 PM PHT for EUR/USD setups rather than forcing trades during the quiet 5:00 AM PHT rollover hour.',
    prerequisiteCodes: ['2.6'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'forex-sessions-killzones',
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'Which window generally offers the highest liquidity and tightest spreads for major USD and EUR currency pairs in Philippine Time (PHT)?',
      options: [
        'Daily rollover around 5:00 AM PHT.',
        'The London–New York overlap (roughly 8:00 PM to 12:00 AM PHT).',
        'Saturday afternoon PHT.',
        '15 minutes before the Friday weekly close.',
      ],
      correctIndex: 1,
      rationale: 'Both European and North American banks are active simultaneously during the London–New York overlap, maximizing depth.',
      commonTrap: 'Trading wide-spread rollover hours (around 5:00 AM PHT) and getting stopped out by spread widening alone.',
    },
  },
  {
    code: '2.8',
    slug: 'market-orders-and-execution',
    title: 'Market Orders and Execution',
    overviewEn:
      'Order types—Market, Limit, and Stop orders—control whether you prioritize immediate execution or exact price control when entering and exiting trades.',
    overviewTaglish:
      'Ang mga order type tulad ng Market, Limit, at Stop order ang nagtatakda kung uunahin mo ang mabilis na fill o eksaktong presyo sa pagpasok at paglabas.',
    objectives: [
      'Differentiate Market, Limit, and Stop orders and when to use each.',
      'Explain the trade-off between guaranteed fills (Market) and guaranteed price (Limit).',
      'Set protective Stop Loss and Take Profit orders cleanly upon entry.',
    ],
    keyPoints: [
      'A Market order executes immediately at the best available price—fast fill, no price guarantee.',
      'A Limit order executes only at your specified price or better—exact price control, no fill guarantee if price misses by a tick.',
      'A Stop order triggers into a market execution once price reaches your threshold, commonly used for SL (Stop Loss) or breakout entries.',
    ],
    practicalExample:
      'To buy a pullback cleanly at $100.00 without paying spread slippage, a trader places a Buy Limit at $100.00 with an attached Stop Loss at $98.00.',
    prerequisiteCodes: ['2.7'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'stocks-market-hours-volume-order-types',
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which order type guarantees your execution price (or better) but does NOT guarantee that your order will be filled?',
      options: [
        'Market order.',
        'Limit order.',
        'Stop-market order.',
        'Trailing market close.',
      ],
      correctIndex: 1,
      rationale: 'A Limit order protects your entry or exit price strictly, but remains unfilled if the market never trades through your limit.',
      commonTrap: 'Using a Buy Limit above current market price expecting a breakout trigger—it fills immediately at market instead of waiting (a Buy Stop is required).',
    },
  },
  {
    code: '2.9',
    slug: 'bid-ask-and-spread',
    title: 'Bid, Ask, and Spread',
    overviewEn:
      'Every tradable market shows two prices: the Bid (what buyers pay if you sell) and the Ask (what sellers charge if you buy); the gap between them is the Spread.',
    overviewTaglish:
      'Laging may dalawang presyo sa merkado: Bid (presyo kung magbebenta ka) at Ask (presyo kung bibili ka); ang pagitan nila ay tinatawag na Spread.',
    objectives: [
      'Read Bid and Ask quotes accurately for both Long and Short trades.',
      'Calculate how the spread acts as an immediate upfront cost on every position.',
      'Account for the Ask line when setting Stop Losses and Take Profits on Short positions.',
    ],
    keyPoints: [
      'You buy at the Ask and sell at the Bid, which is why every new trade opens slightly negative by the spread.',
      'Spreads are tightest on liquid majors during active sessions and widen dramatically during news or rollover.',
      'On Short trades, your SL (Stop Loss) triggers on the Ask price—so a chart showing only Bid prices can stop you out before the candle visually touches your line.',
    ],
    practicalExample:
      'EUR/USD quotes Bid 1.0900 / Ask 1.0902 (2-pip spread). A Short with SL at 1.0910 gets stopped out when Bid reaches 1.0908 because Ask hits 1.0910.',
    prerequisiteCodes: ['2.8'],
    estimatedMinutes: 7,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why did a trader’s Short Stop Loss trigger even though the Bid-price chart candle stopped 2 pips short of the Stop Loss line?',
      options: [
        'Short positions close by buying back at the Ask price, which is higher than the Bid by the spread.',
        'Charts randomly delete Short positions.',
        'Stop Losses only work on Long positions.',
        'The Take Profit accidentally turned into a Stop Loss.',
      ],
      correctIndex: 0,
      rationale: 'Closing a Short requires buying back at the Ask; adding a spread buffer to Short Stop Losses prevents surprise exits.',
      commonTrap: 'Ignoring the Ask line when placing razor-thin stops just above a swing high on Short setups.',
    },
  },
  {
    code: '2.10',
    slug: 'slippage-and-transaction-costs',
    title: 'Slippage and Transaction Costs',
    overviewEn:
      'Real trading returns are net of spreads, commissions, overnight swaps/funding, and slippage—the difference between expected and actual fill prices during fast moves.',
    overviewTaglish:
      'Ang tunay na kita sa trading ay bawas na ng spread, commission, overnight swap/funding, at slippage—ang agwat ng inaasahang presyo at totoong fill kapag mabilis ang galaw.',
    objectives: [
      'Identify all four recurring execution costs: spread, commission, financing/funding, and slippage.',
      'Explain why slippage occurs during news spikes, weekend gaps, and thin liquidity.',
      'Factor total friction costs into backtests and live strategy expectancy.',
    ],
    keyPoints: [
      'High-frequency strategies can look profitable before costs yet lose money once spreads and commissions are deducted.',
      'Overnight financing (Forex swaps, margin interest, or crypto perpetual funding) adds up on multi-week leveraged holds.',
      'Using limit entries during calm liquid sessions reduces slippage compared to chasing news spikes with market orders.',
    ],
    practicalExample:
      'A scalper targets 5 pips per trade, but 1.5 pips of spread + commission consumes 30% of every winning move and widens every loss by 30%.',
    prerequisiteCodes: ['2.9'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'What is slippage in trade execution?',
      options: [
        'A bonus rebate credited to active accounts.',
        'The difference between your requested order price and the actual price at which the order fills.',
        'The chart zooming out automatically.',
        'A guaranteed profit on limit orders.',
      ],
      correctIndex: 1,
      rationale: 'When price moves faster than resting liquidity at your exact quote, market and stop orders fill at the next available price.',
      commonTrap: 'Evaluating a strategy on zero-fee, zero-spread backtests and wondering why live results underperform.',
    },
  },

  // =========================================================================
  // MODULE 3 – Chart Reading and Candlesticks (3.1 – 3.10)
  // =========================================================================
  {
    code: '3.1',
    slug: 'introduction-to-trading-charts',
    title: 'Introduction to Trading Charts',
    overviewEn:
      'A trading chart plots time on the horizontal X-axis and price on the vertical Y-axis, translating raw market transactions into visual structure you can analyze objectively.',
    overviewTaglish:
      'Ipinapakita ng trading chart ang oras sa pahalang na X-axis at presyo sa patayong Y-axis, kaya nagiging malinaw na larawan ang bawat transaksyon sa merkado.',
    objectives: [
      'Read price axes, time axes, volume histograms, and current price markers fluently.',
      'Understand linear vs. logarithmic price scaling for long-term percentage comparisons.',
      'Keep chart layouts clean so price action remains the primary focus.',
    ],
    keyPoints: [
      'Every bar or candle summarizes thousands of matched trades inside one time slice.',
      'Logarithmic scale displays equal percentage moves at equal vertical height—essential on multi-year stock or crypto charts.',
      'Cluttered charts with ten overlapping indicators hide the actual price structure.',
    ],
    practicalExample:
      'Switching a 5-year Bitcoin chart to logarithmic scale reveals that a move from $10,000 to $20,000 (+100%) has the same percentage importance as $30,000 to $60,000 (+100%).',
    prerequisiteCodes: ['2.10'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'chart-reading-fundamentals',
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'When is logarithmic (log) price scaling most useful on a trading chart?',
      options: [
        'When analyzing multi-year charts where an asset has risen or fallen by hundreds of percent.',
        'Only on 5-second scalping charts.',
        'When you want to hide losing candles.',
        'Log scale changes the actual execution prices of your broker.',
      ],
      correctIndex: 0,
      rationale: 'Logarithmic scaling spaces vertical price intervals by percentage change rather than raw dollar distance.',
      commonTrap: 'Drawing long-term trendlines on linear scale over a 10x multi-year move, which visually distorts early price action.',
    },
  },
  {
    code: '3.2',
    slug: 'line-bar-candlestick-charts',
    title: 'Line, Bar, and Candlestick Charts',
    overviewEn:
      'Line charts connect closing prices for simplicity, while OHLC (Open, High, Low, Close) bar and candlestick charts reveal full intrabar pressure and rejection.',
    overviewTaglish:
      'Pinagdurugtong ng line chart ang mga closing price para malinis tingnan, habang ipinapakita ng bar at candlestick charts ang buong laban ng Open, High, Low, at Close.',
    objectives: [
      'Compare the information density of Line, OHLC Bar, and Japanese Candlestick charts.',
      'Explain why closing prices on a Line chart help spot clean major support and resistance.',
      'Choose candlesticks as the default view for reading momentum and wick rejection.',
    ],
    keyPoints: [
      'Line charts strip away intrabar wicks, making big-picture trends and clean closes easy to spot.',
      'Bar charts and candlesticks display identical OHLC data; candlesticks use color-filled bodies for faster visual scanning.',
      'Switching briefly to a Line chart is a practical trick for checking whether a level held on candle closes.',
    ],
    practicalExample:
      'A trader checks a Line chart on the Daily timeframe to mark major closing support, then switches back to candlesticks to evaluate rejection wicks at that zone.',
    prerequisiteCodes: ['3.1'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'chart-reading-fundamentals',
    diagramKind: 'candlestick_anatomy',
    quiz: {
      prompt: 'What key information do OHLC bar and candlestick charts show that a standard Line chart omits?',
      options: [
        'The company’s quarterly tax rate.',
        'The Open, High, and Low prices reached inside each time period.',
        'Only the Closing price.',
        'The broker’s commission rate.',
      ],
      correctIndex: 1,
      rationale: 'Standard line charts plot only closing prices, hiding intrabar highs, lows, and rejection wicks.',
      commonTrap: 'Assuming bar charts and candlesticks use different price data—they display the exact same OHLC values visually differently.',
    },
  },
  {
    code: '3.3',
    slug: 'anatomy-of-a-candlestick',
    title: 'Anatomy of a Candlestick',
    overviewEn:
      'Each candlestick consists of a real body (Open to Close) and upper/lower wicks (High and Low extremes), summarizing the tug-of-war between buyers and sellers.',
    overviewTaglish:
      'Binubuo ang bawat kandila ng real body (Open hanggang Close) at mga wick (High at Low), na nagkukuwento kung sino ang nanalo sa laban ng buyers at sellers.',
    objectives: [
      'Identify the Open, High, Low, Close, real body, and upper/lower wicks instantly.',
      'Interpret body size as conviction and long wicks as price rejection.',
      'Wait for candle close before treating a wick or body shape as confirmed.',
    ],
    keyPoints: [
      'A large real body with small wicks signals decisive directional control during that period.',
      'A long lower wick shows sellers pushed price down, but buyers stepped in forcefully before the close.',
      'Mid-candle shapes can reverse completely before the timer ends—never judge an unclosed candle as final.',
    ],
    practicalExample:
      'On a 1H candle that opens at $100, drops to $96, and closes at $101, the $4 lower wick reveals strong buying absorption below $100.',
    prerequisiteCodes: ['3.2'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'candlestick-anatomy',
    diagramKind: 'candlestick_anatomy',
    quiz: {
      prompt: 'What does a long upper wick paired with a small body near the candle’s low typically indicate?',
      options: [
        'Buyers maintained full control into the close.',
        'Buyers pushed price higher intrabar, but sellers rejected those higher prices before the close.',
        'Zero trades occurred during the candle.',
        'The next candle is guaranteed to rise.',
      ],
      correctIndex: 1,
      rationale: 'An extended upper wick records failed upward exploration rejected back down by selling pressure before the close.',
      commonTrap: 'Entering immediately while a candle still has 40 minutes left to close, only for the wick to turn into a full-bodied continuation candle.',
    },
  },
  {
    code: '3.4',
    slug: 'bullish-and-bearish-candles',
    title: 'Bullish and Bearish Candles',
    overviewEn:
      'Bullish candles close above their open (net buying control) while bearish candles close below their open (net selling control), revealing momentum shifts across consecutive bars.',
    overviewTaglish:
      'Ang bullish candle ay nagsasara nang mas mataas sa open nito (lamang ang buyers), habang ang bearish candle ay mas mababa sa open (lamang ang sellers).',
    objectives: [
      'Read sequences of bullish and bearish candles to gauge momentum expansion vs. exhaustion.',
      'Compare candle body proportion relative to recent average candle range.',
      'Spot how shrinking consecutive bodies warn of slowing momentum near key zones.',
    ],
    keyPoints: [
      'Color alone is not enough—compare body size, close location (near high vs. mid-range), and surrounding context.',
      'A strong close in the top 25% of a bullish candle reflects firmer buyer follow-through than a close near the midpoint.',
      'Context matters: one strong bearish candle inside a powerful uptrend is often just a routine pullback.',
    ],
    practicalExample:
      'Three consecutive expanding green candles closing near their highs break above resistance, followed by two tiny red candles on low volume—showing healthy buyer dominance.',
    prerequisiteCodes: ['3.3'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'candlestick-anatomy',
    diagramKind: 'candlestick_anatomy',
    quiz: {
      prompt: 'Which bullish candle typically communicates the strongest buying conviction into the close?',
      options: [
        'A tiny green body with an enormous upper wick.',
        'A wide green body closing right near its session high with minimal upper wick.',
        'A candle that opens and closes at the exact same price.',
        'An unclosed candle 2 minutes into a 4-hour bar.',
      ],
      correctIndex: 1,
      rationale: 'Closing near the high with a broad body shows buyers absorbed selling pressure all the way through the bar close.',
      commonTrap: 'Treating every single green candle as a buy signal without checking where it sits relative to major resistance.',
    },
  },
  {
    code: '3.5',
    slug: 'candlestick-patterns',
    title: 'Candlestick Patterns',
    overviewEn:
      'Single-candle and multi-candle patterns—like Pin Bars, Engulfing candles, Dojis, and Inside Bars—are shorthand descriptions of order-flow shifts, NOT standalone buy/sell buttons.',
    overviewTaglish:
      'Ang mga candlestick pattern tulad ng Pin Bar, Engulfing, Doji, at Inside Bar ay mabilis na paglalarawan ng pagbabago ng momentum—hindi ito automatic na buy o sell signal nang mag-isa.',
    objectives: [
      'Recognize Hammer/Pin Bar, Bullish/Bearish Engulfing, Doji, and Inside Bar structures.',
      'Explain the underlying buyer-seller story behind each pattern instead of memorizing names blindly.',
      'Require key location and trend context before acting on any candlestick pattern.',
    ],
    keyPoints: [
      'A Bullish Engulfing shows buyers completely erasing the prior bearish body and reclaiming control.',
      'A Doji signals temporary equilibrium/indecision—only meaningful when appearing at a major structural level.',
      'Inside Bars reflect volatility compression that often precedes a directional breakout.',
    ],
    limitationsNote:
      'Candlestick patterns have low edge in the middle of choppy ranges; location and structure carry far more weight than pattern shape alone.',
    practicalExample:
      'A Bullish Pin Bar rejecting a Daily demand zone during an uptrend carries much higher probability than the exact same Pin Bar floating mid-range.',
    prerequisiteCodes: ['3.4'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'candlestick-anatomy',
    diagramKind: 'candlestick_anatomy',
    quiz: {
      prompt: 'What turns an ordinary Pin Bar or Engulfing candle into a meaningful trading clue?',
      options: [
        'Memorizing its traditional Japanese name.',
        'Its location at a significant support, resistance, or trend pullback zone aligned with structure.',
        'Changing the candle color to neon blue.',
        'Finding it on a 5-second chart during thin rollover.',
      ],
      correctIndex: 1,
      rationale: 'Location and structural context explain why order flow reacted; isolated candle shapes in random mid-range noise fail frequently.',
      commonTrap: 'Trading every Hammer or Doji anywhere on the chart without checking trend direction or nearby obstacles.',
    },
  },
  {
    code: '3.6',
    slug: 'japanese-candlestick-formations',
    title: 'Japanese Candlestick Formations',
    overviewEn:
      'Classic three-candle Japanese formations—Morning Star, Evening Star, Three White Soldiers, and Three Black Crows—capture multi-bar transitions from exhaustion to reversal or continuation.',
    overviewTaglish:
      'Ipinapakita ng classic three-candle formations tulad ng Morning Star, Evening Star, at Three White Soldiers ang unti-unting paglipat ng kontrol mula sa isang panig papunta sa kabila.',
    objectives: [
      'Decode three-candle reversal formations (Morning Star, Evening Star) by reading momentum progression.',
      'Recognize momentum-continuation formations (Three White Soldiers, Three Black Crows) and overextension risk.',
      'Combine multi-candle formations into a single Higher Timeframe (HTF) candle mentally.',
    ],
    keyPoints: [
      'A Morning Star (strong drop → small indecision bar → strong bullish close) simply blends into one bullish Hammer on a Higher Timeframe.',
      'Three consecutive massive candles (Soldiers/Crows) confirm momentum, yet chasing the third extended bar often offers poor RR (Risk-to-Reward Ratio).',
      'Always evaluate whether a formation closes cleanly beyond the prior swing pivot before acting.',
    ],
    limitationsNote:
      'Multi-candle formations are descriptive visual frameworks, not guaranteed reversal predictors.',
    practicalExample:
      'At Daily support on SPX500, a heavy red bar is followed by a narrow Doji and then a strong green close above the midpoint—forming a Morning Star that invites a pullback entry.',
    prerequisiteCodes: ['3.5'],
    estimatedMinutes: 8,
    diagramKind: 'candlestick_anatomy',
    quiz: {
      prompt: 'When you mentally blend the three candles of a textbook Morning Star into one Higher Timeframe candle, what shape does it usually resemble?',
      options: [
        'A Bearish Shooting Star.',
        'A Bullish Hammer / Pin Bar with a long lower rejection wick.',
        'A flat horizontal line.',
        'A wide red Marubozu.',
      ],
      correctIndex: 1,
      rationale: 'The initial drop forms the lower wick, the middle pause marks the low, and the strong third green candle forms the bullish close.',
      commonTrap: 'Chasing the close of Three White Soldiers directly into major overhead resistance with a huge Stop Loss.',
    },
  },
  {
    code: '3.7',
    slug: 'multiple-timeframe-analysis',
    title: 'Multiple Timeframe Analysis',
    overviewEn:
      'Multiple Timeframe Analysis (MTFA) aligns Higher Timeframe (HTF) direction with Lower Timeframe (LTF) timing so you trade with the primary tide while keeping stops tight.',
    overviewTaglish:
      'Pinagsasama ng Multiple Timeframe Analysis (MTFA) ang direksyon ng Higher Timeframe (HTF) at eksaktong timing ng Lower Timeframe (LTF) para hindi ka kumokontra sa malaking agos.',
    objectives: [
      'Build a clean top-down workflow using 2–3 related timeframes (e.g., Daily → 4H → 1H).',
      'Use the HTF for directional bias and key zones, and the LTF only for entry refinement.',
      'Avoid conflicting biases caused by checking six unrelated timeframes at once.',
    ],
    keyPoints: [
      'Follow roughly a 4x–6x step between timeframes (such as Daily → 4H → 1H, or 4H → 1H → 15m).',
      'When HTF and LTF disagree, defer to the Higher Timeframe structure until the LTF realigns.',
      'Refining entries on LTF improves RR (Risk-to-Reward Ratio) only when anchored to a valid HTF location.',
    ],
    practicalExample:
      'Daily EUR/USD is trending up into a demand zone; the trader drops to 1H and waits for a bullish shift before entering instead of guessing blindly on Daily.',
    prerequisiteCodes: ['3.6'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'multi-timeframe-alignment',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'In top-down Multiple Timeframe Analysis, what is the primary job of the Higher Timeframe (HTF)?',
      options: [
        'To place 1-pip micro-scalp Stop Losses.',
        'To define the overarching trend bias and major key zones before zooming in for execution.',
        'To contradict the Lower Timeframe so you never take trades.',
        'To replace risk management.',
      ],
      correctIndex: 1,
      rationale: 'HTF sets the strategic map and key battlegrounds; LTF provides tactical entry timing inside those zones.',
      commonTrap: 'Shorting a 5-minute breakdown straight into a massive Daily support zone without zooming out first.',
    },
  },
  {
    code: '3.8',
    slug: 'identifying-trends',
    title: 'Identifying Trends',
    overviewEn:
      'An objective trend is defined by the sequence of swing highs and swing lows—not by gut feeling or a single colorful indicator.',
    overviewTaglish:
      'Ang tunay na trend ay nakikita sa sunod-sunod na swing highs at swing lows—hindi sa hula o sa iisang makulay na indicator lang.',
    objectives: [
      'Define uptrends (HH/HL), downtrends (LH/LL), and transitions using raw price swings.',
      'Measure trend health by comparing impulsive leg speed against corrective pullback depth.',
      'Recognize early warning signs of trend fatigue before a full reversal occurs.',
    ],
    keyPoints: [
      'Healthy trends show wide, fast impulsive legs in the trend direction and slower, overlapping corrective pullbacks.',
      'A trend remains intact until a key structural swing fails—not merely because price feels "too high."',
      'Trading in the direction of the dominant trend tilts probability and follow-through in your favor.',
    ],
    practicalExample:
      'On NAS100, price rallies 250 points in three candles, drifts down 80 points over eight small candles, and rallies another 280 points—classic impulsive strength.',
    prerequisiteCodes: ['3.7'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'Which price behavior best characterizes a healthy, strong uptrend?',
      options: [
        'Fast, expansive upward legs paired with slower, shallower pullbacks forming Higher Lows.',
        'Massive downward crashes followed by tiny weak bounces.',
        'Price bouncing endlessly between the same exact high and low.',
        'RSI staying above 70 for one hour.',
      ],
      correctIndex: 0,
      rationale: 'Strong trends expand forcefully in the trend direction and retrace orderly without breaking prior structural lows.',
      commonTrap: 'Shorting a strong uptrend simply because "it has gone up too much already."',
    },
  },
  {
    code: '3.9',
    slug: 'reading-price-movement',
    title: 'Reading Price Movement',
    overviewEn:
      'Reading raw price action means observing momentum, candle overlap, rejection at levels, and space to the next obstacle—turning a chart into a readable narrative.',
    overviewTaglish:
      'Ang pagbabasa ng price movement ay pagtingin sa bilis ng galaw, overlap ng kandila, rejection sa levels, at espasyo patungo sa susunod na harang.',
    objectives: [
      'Distinguish impulsive expansion candles from overlapping corrective drift.',
      'Evaluate "clean traffic" (open space) vs. nearby heavy resistance before entering.',
      'Read how price reacts upon arriving at a key level (stall, sweep, or smash through).',
    ],
    keyPoints: [
      'Overlapping candles with alternating colors indicate balanced, indecisive flow.',
      'Non-overlapping wide candles signal urgency and temporary one-sided dominance.',
      'Always check what sits directly in front of your entry—buying 2 points below major resistance limits upside.',
    ],
    practicalExample:
      'Instead of entering immediately when price approaches resistance at $150, a trader observes price compressing into tiny overlapping bars below $150 and waits for a decisive break or rejection.',
    prerequisiteCodes: ['3.8'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'chart-reading-fundamentals',
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What does a cluster of small, heavily overlapping red and green candles usually reveal about current order flow?',
      options: [
        'Strong one-sided directional momentum.',
        'Temporary balance and indecision between buyers and sellers.',
        'A confirmed breakout.',
        'Broker server disconnection.',
      ],
      correctIndex: 1,
      rationale: 'Heavy overlap means neither side is clearing liquidity decisively; waiting for resolution prevents choppy stop-outs.',
      commonTrap: 'Entering breakout trades inside tight overlapping chop before price actually commits.',
    },
  },
  {
    code: '3.10',
    slug: 'charting-platforms-and-tools',
    title: 'Charting Platforms and Tools',
    overviewEn:
      'Modern charting platforms (like TradingView Supercharts and TradeLab) offer horizontal levels, rulers, risk-reward boxes, alerts, and bar replay—use only the tools that sharpen decisions.',
    overviewTaglish:
      'May mga gamit ang charting platforms tulad ng horizontal levels, ruler, risk-reward tool, alerts, at bar replay—gamitin lang ang mga nakakatulong sa malinaw na desisyon.',
    objectives: [
      'Use essential drawing tools cleanly: horizontal rays, rectangles, ruler, and Long/Short position tools.',
      'Set price alerts at key levels instead of staring anxiously at every tick.',
      'Use chart replay and watchlists to organize daily preparation efficiently.',
    ],
    keyPoints: [
      'The Long/Short Risk-Reward tool lets you visualize exact Stop Loss, Take Profit, and RR (Risk-to-Reward Ratio) before ordering.',
      'Price alerts protect your psychology by notifying you only when price reaches your planned zone.',
      'Maintain a focused watchlist of 3–6 instruments so you learn their unique rhythm deeply.',
    ],
    practicalExample:
      'A trader marks two Daily zones on EUR/USD and XAU/USD, sets alerts 10 pips ahead of each zone, and closes the chart until an alert triggers.',
    prerequisiteCodes: ['3.9'],
    estimatedMinutes: 7,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'How do price alerts improve a beginner trader’s discipline?',
      options: [
        'They automatically execute winning trades without risk limits.',
        'They keep you from staring at noisy candles and forcing impulsive mid-range trades.',
        'They eliminate broker spreads.',
        'They predict central bank announcements.',
      ],
      correctIndex: 1,
      rationale: 'Alerts anchor your attention strictly to pre-planned price levels, drastically reducing boredom overtrading.',
      commonTrap: 'Watching 25 charts simultaneously with 12 indicators and reacting impulsively to every green or red flash.',
    },
  },

  // =========================================================================
  // MODULE 4 – Technical Analysis Fundamentals (4.1 – 4.12)
  // =========================================================================
  {
    code: '4.1',
    slug: 'support-and-resistance',
    title: 'Support and Resistance',
    overviewEn:
      'Support is a price zone where buying interest has historically halted declines, while Resistance is a zone where selling pressure has halted advances—and broken levels often flip roles.',
    overviewTaglish:
      'Ang Support ay lugar kung saan madalas sumasalo ang buyers, habang ang Resistance ay kung saan madalas humihinto ang pag-akyat—at kapag nabasag ang isa, madalas itong nagpapalit ng papel.',
    objectives: [
      'Draw Support and Resistance as practical price zones rather than razor-thin lines.',
      'Explain role reversal (polarity flip): broken resistance becoming new support and vice versa.',
      'Prioritize fresh Higher Timeframe (HTF) zones over cluttered minor lines.',
    ],
    keyPoints: [
      'Treat levels as zones (spanning wick to body close) because markets rarely reverse to the exact cent.',
      'Role reversal occurs when trapped traders and sidelined buyers re-engage around a broken barrier.',
      'Too many horizontal lines paralyze execution—keep only the 2–3 nearest major zones.',
    ],
    practicalExample:
      'AAPL stalls twice at $190, finally closes strongly above $190 on heavy volume, then pulls back to $189.50–$190.50 where old resistance acts as new support.',
    prerequisiteCodes: ['3.10'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'support-resistance-supply-demand',
    diagramKind: 'support_demand',
    quiz: {
      prompt: 'Why is it generally better to mark Support and Resistance as a zone rather than a single exact price line?',
      options: [
        'Because market orders and spread variations cause reactions across a narrow price area rather than one exact tick.',
        'Because charts cannot draw thin horizontal lines.',
        'Because zones guarantee price can never break through.',
        'So you never need to place a Stop Loss.',
      ],
      correctIndex: 0,
      rationale: 'Order flow clusters across a price range; drawing zones avoids missing entries or misreading minor overshoots.',
      commonTrap: 'Placing 20 lines on a single chart until every candle is touching some line.',
    },
  },
  {
    code: '4.2',
    slug: 'trendlines-and-channels',
    title: 'Trendlines and Channels',
    overviewEn:
      'Trendlines connect ascending swing lows or descending swing highs to visualize trend slope, while parallel channels frame dynamic upper and lower boundaries.',
    overviewTaglish:
      'Pinagdurugtong ng trendline ang pataas na lows o pababang highs para makita ang bilis ng trend, at ang parallel channel naman ang nagsisilbing kisame at sahig ng galaw.',
    objectives: [
      'Draw objective trendlines connecting at least two confirmed swings without slicing through candle bodies.',
      'Use parallel channels to gauge overextension near upper resistance or lower support.',
      'Combine diagonal trendlines with horizontal structure instead of trading diagonals in isolation.',
    ],
    keyPoints: [
      'Two swing points establish a tentative trendline; a third clean reaction confirms it.',
      'Very steep trendlines break quickly and often signal unsustainable parabolic pace.',
      'Diagonal breaks can mean either a full reversal or simply a shift into a flatter, slower trend.',
    ],
    limitationsNote:
      'Trendlines are subjective visual guides—two traders may draw slightly different angles, so anchor decisions primarily to horizontal swing structure.',
    practicalExample:
      'An ascending channel on SPY aligns its lower boundary with a horizontal prior resistance-turned-support zone, creating a high-confluence pullback area.',
    prerequisiteCodes: ['4.1'],
    estimatedMinutes: 8,
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'What is the most reliable way to use a diagonal trendline in technical analysis?',
      options: [
        'Redraw it after every single candle so it never looks broken.',
        'Use it as a visual slope guide combined with horizontal Support/Resistance and swing structure.',
        'Enter 100% of your account every time price touches any diagonal line.',
        'Draw it through the middle of candle bodies to force four touches.',
      ],
      correctIndex: 1,
      rationale: 'Horizontal levels are universally observed by market orders; diagonals work best as supporting confluence.',
      commonTrap: 'Assuming every steep trendline break immediately guarantees a full trend reversal.',
    },
  },
  {
    code: '4.3',
    slug: 'higher-highs-and-higher-lows',
    title: 'Higher Highs and Higher Lows',
    overviewEn:
      'A sequence of Higher Highs (HH) and Higher Lows (HL) is the core structural definition of an uptrend, showing buyers willing to defend progressively higher prices.',
    overviewTaglish:
      'Ang sunod-sunod na Higher Highs (HH) at Higher Lows (HL) ang opisyal na patunay ng uptrend—ibig sabihin, handang sumalo ang buyers sa mas matataas na presyo.',
    objectives: [
      'Label confirmed Higher Highs (HH) and Higher Lows (HL) accurately on any timeframe.',
      'Identify the protected Higher Low that holds an uptrend intact.',
      'Plan bullish pullback entries between a new HL and the prior HH rather than chasing extremes.',
    ],
    keyPoints: [
      'A Higher Low is only confirmed once price rallies and breaks above the preceding Higher High.',
      'As long as Higher Lows hold, bullish continuation setups align with the path of least resistance.',
      'Stop Losses for uptrend continuations logically sit beyond the protected Higher Low, not randomly in mid-air.',
    ],
    practicalExample:
      'Price rallies from $100 to $110 (HH), pulls back to $105 (HL), then breaks to $116 (new HH)—confirming $105 as the structural Higher Low.',
    prerequisiteCodes: ['4.2'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'When is a pullback low officially confirmed as a structural Higher Low (HL) in an uptrend?',
      options: [
        'Immediately on the first green 1-minute candle.',
        'Once price expands upward and breaks above the previous Higher High (HH).',
        'Whenever RSI touches 50.',
        'Only at the end of the calendar month.',
      ],
      correctIndex: 1,
      rationale: 'Until price surpasses the prior high, a bounce could still roll over into a lower high and break down.',
      commonTrap: 'Buying directly at the peak of a fresh Higher High instead of waiting for the Higher Low pullback.',
    },
  },
  {
    code: '4.4',
    slug: 'lower-highs-and-lower-lows',
    title: 'Lower Highs and Lower Lows',
    overviewEn:
      'A sequence of Lower Highs (LH) and Lower Lows (LL) defines a bearish downtrend, revealing sellers consistently stepping in at progressively cheaper rallies.',
    overviewTaglish:
      'Ang sunod-sunod na Lower Highs (LH) at Lower Lows (LL) ang patunay ng downtrend—kung saan laging mas mababa ang tugatog ng bawat bounce bago muling bumagsak.',
    objectives: [
      'Map Lower Highs (LH) and Lower Lows (LL) objectively across downward price swings.',
      'Avoid "catching falling knives" by recognizing intact bearish structure.',
      'Place logical Short invalidation above the structural Lower High.',
    ],
    keyPoints: [
      'In a downtrend, sharp relief rallies often look bullish on Lower Timeframes before failing at a Lower High.',
      'A Lower High is confirmed when selling pressure pushes price beneath the preceding Lower Low.',
      'Wait for bearish structure to break before assuming a beaten-down asset has truly bottomed.',
    ],
    practicalExample:
      'An altcoin drops from $20 to $14 (LL), bounces to $17 (LH), then breaks to $11 (new LL)—showing sellers remain firmly in control below $17.',
    prerequisiteCodes: ['4.3'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'market-structure',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'Why is buying a sharp bounce inside an unbroken sequence of Lower Highs and Lower Lows risky?',
      options: [
        'Because rallies in a downtrend frequently stall at a new Lower High and resume falling.',
        'Because brokers prohibit buying during downtrends.',
        'Because Lower Lows always bounce 100% back to the peak.',
        'Because downtrends cannot exist on Daily charts.',
      ],
      correctIndex: 0,
      rationale: 'Counter-trend bounces often represent temporary short-covering or profit-taking before dominant selling resumes.',
      commonTrap: 'Buying solely because an asset is "down 40% so it must be cheap" while LH/LL structure stays intact.',
    },
  },
  {
    code: '4.5',
    slug: 'breakouts-and-fakeouts',
    title: 'Breakouts and Fakeouts',
    overviewEn:
      'A true breakout sustains acceptance beyond a key level with displacement and volume, whereas a fakeout briefly pierces the boundary before snapping back inside and trapping late traders.',
    overviewTaglish:
      'Ang totoong breakout ay may malakas na close at follow-through lampas sa level, samantalang ang fakeout ay mabilis na sumisilip lang tapos bumabalik sa loob para i-trap ang nagmadali.',
    objectives: [
      'Compare true breakout signatures against liquidity-driven fakeouts.',
      'Use candle closes, retests, and volume expansion to filter weak breaks.',
      'Protect capital when an expected breakout fails back inside the range.',
    ],
    keyPoints: [
      'True breakouts usually close firmly beyond the level with strong body range and supportive volume.',
      'Fakeouts often leave long rejection wicks and immediately close back inside the prior range.',
      'Waiting for a retest of the broken level sacrifices occasional fast runners but eliminates many fakeout traps.',
    ],
    practicalExample:
      'Price spikes 15 pips above a 3-day range high on a news headline, leaves a long upper wick, and closes back inside the range—a classic bullish fakeout.',
    prerequisiteCodes: ['4.4'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'liquidity-sweeps',
    diagramKind: 'liquidity_sweep_vs_breakout',
    quiz: {
      prompt: 'Which clue most strongly warns that a breakout above resistance may be a fakeout?',
      options: [
        'A wide bullish body closing far above resistance on rising volume.',
        'A quick spike above resistance that immediately rejects and closes back inside the prior range with a long upper wick.',
        'A clean retest of the broken resistance that holds as support.',
        'Higher Timeframe trend alignment in the breakout direction.',
      ],
      correctIndex: 1,
      rationale: 'Failure to hold closes outside the range indicates trapped buyers and lack of sustained demand above the level.',
      commonTrap: 'Placing market buys mid-candle the second price ticks 1 cent above resistance.',
    },
  },
  {
    code: '4.6',
    slug: 'pullbacks-and-retracements',
    title: 'Pullbacks and Retracements',
    overviewEn:
      'Pullbacks (retracements) are temporary counter-trend pauses inside an ongoing trend that allow disciplined traders to enter at better prices with tighter Stop Losses.',
    overviewTaglish:
      'Ang pullback o retracement ay pansamantalang paghinga o pagbaba ng presyo sa loob ng trend, na nagbibigay ng mas magandang entry at mas maikling Stop Loss.',
    objectives: [
      'Distinguish a healthy temporary pullback from a structural trend reversal.',
      'Identify high-probability pullback zones: broken resistance, moving averages, and prior swing bases.',
      'Wait for signs of buyer/seller re-entry before stepping into a falling pullback.',
    ],
    keyPoints: [
      'Entering on pullbacks rather than chasing extended candles dramatically improves RR (Risk-to-Reward Ratio).',
      'Healthy pullbacks typically unfold with smaller candles and lighter volume than the preceding impulse.',
      'If a pullback slices forcefully past the last protected swing low on heavy volume, reassess trend health.',
    ],
    practicalExample:
      'After breaking above $50 to $55, a stock pulls back gently over four small bars to $50.50 (old resistance), offering a $4.50 target vs. $1.50 risk (1:3 RR).',
    prerequisiteCodes: ['4.5'],
    estimatedMinutes: 8,
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'What is the primary risk-management benefit of entering on a pullback instead of chasing an extended impulse candle?',
      options: [
        'Pullbacks guarantee 100% winning trades.',
        'You enter closer to structural invalidation, allowing a tighter Stop Loss and stronger Risk-to-Reward Ratio.',
        'Pullbacks remove all trading commissions.',
        'Pullbacks never fail into reversals.',
      ],
      correctIndex: 1,
      rationale: 'Entering closer to the invalidation level shrinks risk distance while preserving full room toward the next target.',
      commonTrap: 'Buying blindly while a pullback is crashing straight down with giant red candles instead of waiting for stabilization.',
    },
  },
  {
    code: '4.7',
    slug: 'moving-averages',
    title: 'Moving Averages',
    overviewEn:
      'Moving Averages—SMA (Simple Moving Average) and EMA (Exponential Moving Average)—smooth historical closing prices to clarify trend direction and dynamic pullback zones.',
    overviewTaglish:
      'Pinapakalma ng Moving Averages tulad ng SMA at EMA ang galaw ng presyo para mas madaling makita ang direksyon ng trend at mga dynamic pullback zone.',
    objectives: [
      'Contrast SMA (equal weight) with EMA (greater weight on recent candles).',
      'Use common benchmarks like the 20 EMA, 50 SMA, and 200 SMA as trend filters.',
      'Recognize why moving average crossovers lag and whipsaw in sideways ranges.',
    ],
    keyPoints: [
      'EMAs react faster to fresh momentum shifts; SMAs (especially 50 and 200) are widely watched institutional benchmarks.',
      'When price sits above a rising 200 SMA, long-term bias leans bullish; below a falling 200 SMA leans bearish.',
      'All moving averages are lagging derivatives of past price—they confirm trends rather than predicting exact tops or bottoms.',
    ],
    limitationsNote:
      'Moving average crossover signals frequently generate repeated false entries during flat, sideways consolidations.',
    practicalExample:
      'In a trending market, SPY pulls back cleanly toward its rising 20 EMA three times before resuming higher; during a sideways summer chop, price slices through the 20 EMA daily.',
    prerequisiteCodes: ['4.6'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What is the main structural limitation of Moving Average crossover strategies?',
      options: [
        'They cannot be plotted on candlestick charts.',
        'Because they lag past prices, they suffer repeated whipsaw losses in sideways markets.',
        'They only work on 1-minute charts.',
        'They hide the closing price of candles.',
      ],
      correctIndex: 1,
      rationale: 'Moving averages smooth historical closes, so in range-bound markets crossovers trigger near range extremes right before price reverses.',
      commonTrap: 'Stacking five moving averages and assuming a crossover overrides nearby major horizontal resistance.',
    },
  },
  {
    code: '4.8',
    slug: 'rsi-and-momentum-indicators',
    title: 'RSI and Momentum Indicators',
    overviewEn:
      'RSI (Relative Strength Index) measures the speed and magnitude of recent price gains versus losses on a 0–100 scale to assess momentum strength and divergence.',
    overviewTaglish:
      'Sinusukat ng RSI (Relative Strength Index) sa sukat na 0–100 ang bilis ng pagtaas kumpara sa pagbaba ng presyo para makita ang lakas ng momentum o posibleng paghina nito.',
    objectives: [
      'Interpret RSI levels (above 50 bullish momentum, below 50 bearish momentum) accurately.',
      'Correct the classic myth that RSI above 70 ("overbought") is an automatic short signal.',
      'Spot bullish and bearish RSI divergence as a secondary warning—not a standalone trigger.',
    ],
    keyPoints: [
      'In powerful uptrends, RSI can remain above 70 for days or weeks while price keeps climbing.',
      'Bearish divergence (price makes a higher high while RSI prints a lower high) signals fading momentum, not immediate reversal.',
      'Pair RSI with key horizontal levels and market structure before executing any decision.',
    ],
    limitationsNote:
      'Oscillators like RSI can stay "overbought" or "oversold" far longer than a counter-trend account can stay solvent.',
    practicalExample:
      'BTC rallies strongly with RSI at 78; instead of shorting blindly, a trader waits until price hits Weekly resistance AND breaks 1H structure with bearish RSI divergence.',
    prerequisiteCodes: ['4.7'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What is the most common beginner mistake when using RSI (Relative Strength Index)?',
      options: [
        'Using RSI alongside Higher Timeframe support and resistance.',
        'Automatically shorting the moment RSI crosses above 70 during a strong uptrend.',
        'Checking RSI on the 4-Hour chart.',
        'Waiting for structure confirmation alongside RSI divergence.',
      ],
      correctIndex: 1,
      rationale: 'High RSI readings during strong trends confirm strong upward momentum rather than an imminent top.',
      commonTrap: 'Fighting runaway trends by selling every time RSI reads 70 or buying every time it hits 30.',
    },
  },
  {
    code: '4.9',
    slug: 'macd-indicator',
    title: 'MACD',
    overviewEn:
      'MACD (Moving Average Convergence Divergence) tracks the relationship between two EMAs (typically 12 and 26) plus a 9-period signal line and histogram to visualize momentum shifts.',
    overviewTaglish:
      'Ipinapakita ng MACD ang agwat ng dalawang EMA (karaniwang 12 at 26) kasama ang signal line at histogram para makita kung lumalakas o humihina ang momentum ng trend.',
    objectives: [
      'Read the three components of MACD: MACD line, Signal line, and Histogram.',
      'Distinguish zero-line crossovers (trend shift) from signal-line crossovers (short-term momentum shift).',
      'Avoid relying on MACD crossovers inside narrow, choppy ranges.',
    ],
    keyPoints: [
      'When the MACD line sits above zero, the faster 12 EMA is above the slower 26 EMA (bullish bias).',
      'Shrinking histogram bars highlight decelerating momentum before a crossover actually occurs.',
      'MACD works best as a momentum confirmation tool alongside price structure, not as a solo entry robot.',
    ],
    limitationsNote:
      'Because MACD is built from moving averages, its crossovers lag sudden V-shaped price reversals.',
    practicalExample:
      'After a pullback to Daily support, the MACD histogram shrinks from deep red toward zero as bullish candles form, confirming buyers are regaining momentum.',
    prerequisiteCodes: ['4.8'],
    estimatedMinutes: 7,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What does it mean mathematically when the MACD line crosses above the zero line?',
      options: [
        'The faster EMA (e.g., 12-period) has crossed above the slower EMA (e.g., 26-period).',
        'Volume has dropped to zero.',
        'The asset has hit its all-time high.',
        'Risk-to-Reward Ratio is automatically 1:3.',
      ],
      correctIndex: 0,
      rationale: 'The MACD line equals Fast EMA minus Slow EMA, so crossing above zero means the fast average exceeds the slow average.',
      commonTrap: 'Entering every MACD signal crossover in a tight range and taking rapid consecutive small losses.',
    },
  },
  {
    code: '4.10',
    slug: 'fibonacci-retracement',
    title: 'Fibonacci Retracement',
    overviewEn:
      'Fibonacci Retracement projects proportional pullback zones (38.2%, 50%, 61.8%, 78.6%) across a completed price impulse to identify potential areas of renewed interest.',
    overviewTaglish:
      'Ginagamit ang Fibonacci Retracement para sukatin ang mga karaniwang lalim ng pullback (38.2%, 50%, 61.8%) sa isang malakas na galaw ng presyo.',
    objectives: [
      'Anchor Fibonacci retracements consistently from swing low to swing high (uptrend) or high to low (downtrend).',
      'Use the 50%–61.8% retracement zone as a confluence filter with horizontal structure.',
      'Understand why Fibonacci levels work through market convention and confluence, not magic math.',
    ],
    keyPoints: [
      'Shallow trends often bounce near 38.2%; deeper healthy pullbacks frequently test the 50%–61.8% pocket.',
      'A Fibonacci line floating in empty space is weak; a 61.8% level overlapping prior support/resistance is far stronger.',
      'Always anchor from clean, obvious swing points visible to most market participants.',
    ],
    limitationsNote:
      'Fibonacci levels are visual measurement tools—price is never obligated to reverse at 61.8%, so always wait for confirmation and use a Stop Loss.',
    practicalExample:
      'EUR/USD impulses from 1.0700 to 1.0900; the 61.8% retracement at 1.0776 overlaps a prior broken resistance zone, creating a clear confluence area to watch.',
    prerequisiteCodes: ['4.9'],
    estimatedMinutes: 8,
    diagramKind: 'support_demand',
    quiz: {
      prompt: 'When is a 61.8% Fibonacci retracement level most useful for trade planning?',
      options: [
        'When drawn across random 1-minute noise candles.',
        'When it aligns directly with a clear horizontal Support/Resistance or Demand zone inside a confirmed trend.',
        'When used without any Stop Loss because 61.8% always holds.',
        'Only during weekends when markets are closed.',
      ],
      correctIndex: 1,
      rationale: 'Confluence between proportional pullback depth and horizontal structural levels concentrates attention at one clear zone.',
      commonTrap: 'Forcing Fibonacci swings until a line happens to touch current price (confirmation bias).',
    },
  },
  {
    code: '4.11',
    slug: 'volume-analysis',
    title: 'Volume Analysis',
    overviewEn:
      'Volume measures how many shares, contracts, or tokens changed hands during each candle, helping verify whether a breakout or reversal carries genuine market participation.',
    overviewTaglish:
      'Sinusukat ng volume kung gaano karaming shares o kontrata ang nagpalitan sa bawat kandila, kaya nakikita mo kung totoo at suportado ang isang breakout o pag-ikot.',
    objectives: [
      'Compare rising-volume breakouts against low-volume fakeouts.',
      'Recognize volume climaxes that can signal temporary exhaustion after extended moves.',
      'Distinguish true centralized exchange volume (stocks/futures) from broker tick volume (spot Forex).',
    ],
    keyPoints: [
      'Strong breakouts accompanied by well-above-average volume reflect broad participation and conviction.',
      'Healthy pullbacks typically occur on declining volume, showing a lack of aggressive counter-trend selling.',
      'In spot Forex, tick volume counts price updates rather than exact global dollar turnover, though it still tracks session activity well.',
    ],
    practicalExample:
      'A stock breaks out above 3-month resistance on 2.8x its 20-day average volume—confirming strong institutional participation compared to a 0.6x volume drift.',
    prerequisiteCodes: ['4.10'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'stocks-market-hours-volume-order-types',
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'What volume pattern typically supports a healthy breakout followed by a constructive pullback?',
      options: [
        'Low volume on the breakout and massive panic volume on the pullback.',
        'Expanding above-average volume on the breakout, followed by lighter declining volume during the pullback.',
        'Zero volume on every candle.',
        'Identical volume on every bar regardless of session.',
      ],
      correctIndex: 1,
      rationale: 'Heavy volume confirms commitment on expansion, while lighter volume on pullback signals profit-taking rather than heavy distribution.',
      commonTrap: 'Treating spot Forex broker tick volume as exact global central bank dollar volume.',
    },
  },
  {
    code: '4.12',
    slug: 'combining-technical-indicators',
    title: 'Combining Technical Indicators',
    overviewEn:
      'Effective technical frameworks pair price structure with at most 1–2 non-redundant tools (e.g., one trend filter + one volatility or momentum gauge) instead of stacking duplicate oscillators.',
    overviewTaglish:
      'Ang maayos na setup ay gumagamit ng price structure at isa o dalawang magkaibang indicator lang—hindi limang magkakaparehong oscillator na nagbibigay ng parehong signal.',
    objectives: [
      'Avoid indicator multicollinearity (stacking RSI, Stochastic, and CCI that all measure momentum).',
      'Combine distinct information categories: price structure + trend + volatility/volume.',
      'Keep chart decisions fast, objective, and testable in a rules checklist.',
    ],
    keyPoints: [
      'Three momentum indicators agreeing does NOT give triple confirmation—it counts the same data three times.',
      'Price structure and key levels always lead; indicators serve only as secondary filters.',
      'Every tool on your screen must earn its place by having a clear, written rule in your trading plan.',
    ],
    limitationsNote:
      'Adding more indicators never eliminates losses—it usually introduces conflicting signals and delayed entries.',
    practicalExample:
      'A clean swing checklist uses Daily market structure (trend), horizontal S/R (location), 20 EMA (pullback slope), and ATR (Stop Loss sizing)—four distinct roles, zero overlap.',
    prerequisiteCodes: ['4.11'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why is stacking RSI, Stochastic, and Williams %R on the same chart generally ineffective?',
      options: [
        'They are all momentum oscillators derived from similar price math, causing redundant false confidence.',
        'Charting platforms ban using more than two indicators.',
        'Indicators cannot work together with candlesticks.',
        'Momentum indicators only work on bonds.',
      ],
      correctIndex: 0,
      rationale: 'Combining redundant indicators duplicates the same signal instead of adding independent information like volume or volatility.',
      commonTrap: 'Adding another indicator after every losing trade until the candles are barely visible.',
    },
  },

  // =========================================================================
  // MODULE 5 – Risk Management (5.1 – 5.10)
  // =========================================================================
  {
    code: '5.1',
    slug: 'understanding-trading-risk',
    title: 'Understanding Trading Risk',
    overviewEn:
      'Trading risk spans market risk, leverage risk, gap/overnight risk, liquidity risk, and behavioral risk—managing survival comes before chasing profit.',
    overviewTaglish:
      'Kasama sa trading risk ang market risk, leverage risk, gap risk, liquidity risk, at emosyonal na risk—laging unahin ang proteksyon ng kapital bago ang kita.',
    objectives: [
      'Catalog the main sources of capital loss beyond simply picking the wrong direction.',
      'Understand asymmetric loss recovery math (a 50% loss requires a 100% gain just to break even).',
      'Accept predefined risk calmly before opening any trade.',
    ],
    keyPoints: [
      'Losses are mathematically asymmetric: -10% needs +11.1% to recover, while -50% needs +100%.',
      'Never trade money required for rent, tuition, bills, or emergency savings.',
      'Risk is the one variable in trading that you control 100% before clicking buy or sell.',
    ],
    practicalExample:
      'If a $1,000 account drops 50% to $500 from oversized bets, doubling the remaining $500 (+100%) only brings the trader back to $1,000.',
    prerequisiteCodes: ['4.12'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'risk-psychology',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'If a trading account loses 50% of its balance, what percentage gain is required just to return to breakeven?',
      options: [
        '50%',
        '75%',
        '100%',
        '25%',
      ],
      correctIndex: 2,
      rationale: 'Falling from $1,000 to $500 is -50%, and climbing from $500 back to $1,000 requires gaining $500 on $500 (+100%).',
      commonTrap: 'Assuming a 50% drawdown only takes a 50% win to recover, leading to reckless sizing.',
    },
  },
  {
    code: '5.2',
    slug: 'capital-management',
    title: 'Capital Management',
    overviewEn:
      'Capital management separates trading risk capital from living expenses, caps total open portfolio exposure, and scales account size only after proven consistency.',
    overviewTaglish:
      'Inihihiwalay ng capital management ang trading capital sa panggastos sa buhay, nililimitahan ang sabay-sabay na exposure, at unti-unting nagpapalaki lang kapag subok na ang sistema.',
    objectives: [
      'Separate risk capital from personal emergency funds and essential obligations.',
      'Control correlated exposure so three similar pairs do not triple your true risk.',
      'Establish clear rules for funding, scaling up, and withdrawing profits.',
    ],
    keyPoints: [
      'Opening 1% risk each on EUR/USD, GBP/USD, and AUD/USD longs is effectively a ~3% bet against the U.S. Dollar.',
      'Start on demo, then transition to small live risk capital where a loss does not distort decision-making.',
      'Cap total simultaneous portfolio risk (for example, max 2%–3% open risk across all positions).',
    ],
    practicalExample:
      'A trader caps open correlated risk at 2%: if already long EUR/USD at 1% risk and gold at 1% risk, they pass on a third USD-short setup until one trade is closed or risk-free.',
    prerequisiteCodes: ['5.1'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'A trader risks 1% each on simultaneous Long trades in EUR/USD, GBP/USD, and NZD/USD. What hidden capital risk did they create?',
      options: [
        'Zero risk because the three pairs have different names.',
        'Concentrated correlated exposure—essentially risking ~3% on a single U.S. Dollar move.',
        'Guaranteed hedging protection.',
        'Lower margin requirements.',
      ],
      correctIndex: 1,
      rationale: 'Highly correlated instruments often move together on USD news, turning separate 1% trades into one oversized 3% risk event.',
      commonTrap: 'Counting correlated trades as independent bets and taking triple losses on a single macro release.',
    },
  },
  {
    code: '5.3',
    slug: 'risk-per-trade',
    title: 'Risk Per Trade',
    overviewEn:
      'Risk per trade is the fixed percentage of account equity you are willing to lose if a single trade hits its Stop Loss—typically 0.5% to 1% for disciplined traders.',
    overviewTaglish:
      'Ang risk per trade ay ang nakatakdang porsyento ng account na handa mong ipatalo kung tumama ang Stop Loss—karaniwang 0.5% hanggang 1% lang bawat trade.',
    objectives: [
      'Calculate exact dollar risk per trade from account equity and risk percentage.',
      'Explain why risking 0.5%–1% lets a trader survive normal losing streaks without panic.',
      'Keep risk per trade consistent instead of betting bigger after wins or losses.',
    ],
    keyPoints: [
      'At 1% risk per trade, five consecutive losses leave ~95.1% of your capital intact and emotionally manageable.',
      'At 10% risk per trade, five consecutive losses wipe out ~41% of your account and trigger emotional tilt.',
      'Beginners should start at 0.25%–0.5% on early live accounts while validating execution habits.',
    ],
    practicalExample:
      'On a $2,000 account with a 1% risk rule, maximum planned loss per setup is strictly $20—regardless of whether the Stop Loss is 10 pips or 40 pips away.',
    prerequisiteCodes: ['5.2'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'risk-psychology',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'On a $5,000 account using a strict 1% risk-per-trade rule, what is the maximum planned dollar loss on one trade?',
      options: [
        '$5',
        '$50',
        '$500',
        '$100',
      ],
      correctIndex: 1,
      rationale: '1% of $5,000 equals $50; position size must be calculated so hitting the Stop Loss loses no more than $50.',
      commonTrap: 'Thinking "1% risk" means buying $50 worth of an asset instead of capping the loss at $50 at the Stop Loss.',
    },
  },
  {
    code: '5.4',
    slug: 'risk-to-reward-ratio',
    title: 'Risk-to-Reward Ratio',
    overviewEn:
      'RR (Risk-to-Reward Ratio) compares your planned risk distance (Entry to SL — Stop Loss) against your target distance (Entry to TP — Take Profit), defining the win rate required to break even.',
    overviewTaglish:
      'Ikinukumpara ng RR (Risk-to-Reward Ratio) ang laki ng risk mo papuntang Stop Loss sa laki ng target mo papuntang Take Profit, para malaman kung sulit ang trade.',
    objectives: [
      'Compute RR (Risk-to-Reward Ratio) and R-multiples accurately for Long and Short setups.',
      'Calculate the breakeven win rate for 1:1 (50%), 1:2 (33.3%), and 1:3 (25%) profiles.',
      'Balance realistic targets with clean RR instead of setting unreachable 1:15 targets.',
    ],
    keyPoints: [
      'Breakeven Win Rate = 1 / (1 + Reward-to-Risk). A 1:2 RR needs just above 33.3% wins (before fees) to profit.',
      'R-multiples normalize performance: losing your planned risk is -1R; hitting a 1:2.5 target is +2.5R.',
      'Higher RR targets usually come with lower hit rates—place Take Profit logically before major obstacles.',
    ],
    practicalExample:
      'Buying at $100 with SL (Stop Loss) at $98 ($2 risk) and TP (Take Profit) at $105 ($5 reward) produces a 1:2.5 RR (Risk-to-Reward Ratio).',
    prerequisiteCodes: ['5.3'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'risk-psychology',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Before fees, what approximate win rate is needed to break even when every trade has a fixed 1:2 Risk-to-Reward Ratio (RR)?',
      options: [
        '66.7%',
        '50.0%',
        '33.3%',
        '15.0%',
      ],
      correctIndex: 2,
      rationale: 'With +2R wins and -1R losses, winning 1 out of 3 trades (+2R - 1R - 1R = 0R) breaks even at 33.3%.',
      commonTrap: 'Forcing unrealistic 1:10 targets straight through major Higher Timeframe resistance so winning trades constantly reverse back to Stop Loss.',
    },
  },
  {
    code: '5.5',
    slug: 'position-sizing',
    title: 'Position Sizing',
    overviewEn:
      'Position sizing translates your fixed dollar risk and Stop Loss distance into the exact number of shares, contracts, or lots—ensuring every trade carries identical financial risk.',
    overviewTaglish:
      'Kinukuwenta ng position sizing ang eksaktong dami ng shares, contracts, o lots base sa dollar risk at layo ng Stop Loss para pantay ang risk ng bawat trade.',
    objectives: [
      'Apply the universal sizing formula: Position Size = Dollar Risk ÷ Stop Distance per Unit.',
      'Verify why wider Stop Losses always require smaller position sizes.',
      'Compute position size BEFORE entering—never by guessing a random lot size.',
    ],
    keyPoints: [
      'Formula: Units = (Account Equity × Risk %) ÷ |Entry Price − Stop Loss Price|.',
      'Always round down to the nearest tradable lot/share increment so you never accidentally exceed your risk cap.',
      'Consistent position sizing prevents one random trade from wiping out five disciplined winners.',
    ],
    practicalExample:
      'Account = $2,000, Risk = 1% ($20). Buying a stock at $50 with SL at $48 ($2 risk/share) → Position Size = $20 ÷ $2 = 10 shares.',
    prerequisiteCodes: ['5.4'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'risk-psychology',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Your account is $1,000 and you risk 1% ($10). You buy a stock at $25.00 with a Stop Loss at $24.50 ($0.50 risk per share). How many shares should you buy?',
      options: [
        '5 shares',
        '20 shares',
        '40 shares',
        '100 shares',
      ],
      correctIndex: 1,
      rationale: '$10 max dollar risk ÷ $0.50 risk per share = 20 shares.',
      commonTrap: 'Trading the exact same fixed lot size on both a 10-pip stop and a 50-pip stop, secretly risking 5x more on the wider setup.',
    },
  },
  {
    code: '5.6',
    slug: 'stop-loss-and-take-profit',
    title: 'Stop Loss and Take Profit',
    overviewEn:
      'Structural SL (Stop Loss) placement sits where your trade thesis is objectively invalidated, while TP (Take Profit) locks in gains near logical opposing liquidity or structure.',
    overviewTaglish:
      'Inilalagay ang Stop Loss (SL) sa lugar kung saan mali na ang analysis mo, at ang Take Profit (TP) naman sa makatwirang target bago ang malakas na harang.',
    objectives: [
      'Place Stop Losses based on market structure and volatility rather than arbitrary round dollar guesses.',
      'Define clear Take Profit rules—fixed target, structural obstacle, or partial scaling.',
      'Commit to never widening a Stop Loss once a trade is live.',
    ],
    keyPoints: [
      'Never widen your SL (Stop Loss) hoping price will turn around—if your invalidation hits, take the planned -1R loss.',
      'Place stops slightly beyond obvious swing lows/highs with a small spread/ATR buffer to avoid routine wick sweeps.',
      'Moving SL to breakeven too early chokes normal pullbacks; wait until structure actually shifts in your favor.',
    ],
    practicalExample:
      'On a bullish pullback off $100 support (swing low $99.20), the trader sets SL at $98.90 (below structure + buffer) and TP at $103.50 just ahead of $104 resistance.',
    prerequisiteCodes: ['5.5'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'trade-management-partials-be',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is the single most destructive Stop Loss habit among struggling traders?',
      options: [
        'Setting the Stop Loss before opening the trade.',
        'Moving the Stop Loss further away when price approaches it, hoping the trade will recover.',
        'Adding a small spread buffer beyond a swing high on Short trades.',
        'Calculating position size from the Stop Loss distance.',
      ],
      correctIndex: 1,
      rationale: 'Widening a Stop Loss turns a controlled -1R loss into an unplanned account-damaging drawdown.',
      commonTrap: 'Using "mental stops" that you freeze and fail to click when price drops quickly.',
    },
  },
  {
    code: '5.7',
    slug: 'maximum-drawdown',
    title: 'Maximum Drawdown',
    overviewEn:
      'Maximum Drawdown measures the largest peak-to-trough percentage decline in account equity, serving as a vital health metric and circuit-breaker trigger.',
    overviewTaglish:
      'Sinusukat ng Maximum Drawdown ang pinakamalaking pagbaba ng account mula sa pinakamataas nitong balanse—isang mahalagang sukatan ng kaligtasan ng sistema.',
    objectives: [
      'Calculate peak-to-trough drawdown accurately on any equity curve.',
      'Set daily, weekly, and monthly drawdown limits (circuit breakers) to halt emotional spirals.',
      'Step down risk per trade automatically during deep drawdowns until form returns.',
    ],
    keyPoints: [
      'Example circuit breakers: stop trading for the day at -2% daily loss, pause for review at -5% weekly loss.',
      'A strategy with +40% annual return but -45% maximum drawdown is psychologically brutal to trade live.',
      'Cutting risk from 1% to 0.5% during a -6% drawdown slows bleeding and restores calm execution.',
    ],
    practicalExample:
      'An account grows from $10,000 to $12,000, then falls to $10,800 before making new highs: drawdown is ($12,000 − $10,800) ÷ $12,000 = 10%.',
    prerequisiteCodes: ['5.6'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'An equity curve rises from $1,000 to $1,250, then drops to $1,000. What is the peak-to-trough drawdown?',
      options: [
        '0% because you are back at your starting balance.',
        '20% from the $1,250 equity peak.',
        '25% from the $1,000 start.',
        '10% average.',
      ],
      correctIndex: 1,
      rationale: 'Drawdown is always measured from the highest equity peak: ($1,250 − $1,000) ÷ $1,250 = 20%.',
      commonTrap: 'Increasing lot size during a drawdown to "win it all back in one trade."',
    },
  },
  {
    code: '5.8',
    slug: 'consecutive-losses',
    title: 'Consecutive Losses',
    overviewEn:
      'Even a profitable 50% win-rate system statistically encounters streaks of 5 to 8 consecutive losses over a large sample—preparing mathematically prevents panic.',
    overviewTaglish:
      'Kahit ang kumikitang sistema na may 50% win rate ay natural na makakaranas ng 5 hanggang 8 sunod-sunod na talo—kaya kailangang handa ang math at isip mo.',
    objectives: [
      'Understand why clusters of losses happen naturally in independent probabilistic trials.',
      'Simulate how a 6-trade losing streak impacts equity at 0.5%, 1%, and 5% risk per trade.',
      'Follow a structured losing-streak review protocol instead of abandoning a valid edge prematurely.',
    ],
    keyPoints: [
      'Flipping a fair 50/50 coin 100 times has a high probability of producing at least one streak of 6+ tails in a row.',
      'At 1% risk, 6 consecutive losses equal roughly -5.85%—easily survivable; at 5% risk, it hits -26.5%.',
      'Check your trade journal during a streak: were they valid rule-following losses or emotional rule breaks?',
    ],
    practicalExample:
      'After 4 straight losses totaling -4%, a trader reviews screenshots, confirms 3 were A+ setups and 1 was FOMO, reduces risk to 0.5% for 3 days, and stabilizes cleanly.',
    prerequisiteCodes: ['5.7'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'If a tested strategy with a 50% win rate experiences 5 losses in a row, what is the smartest immediate action?',
      options: [
        'Double position size on trade #6 because a win is "overdue."',
        'Review the journal to verify rule adherence, respect drawdown caps, and avoid revenge sizing.',
        'Delete the strategy immediately and buy a random signal group.',
        'Remove Stop Losses on the next three trades.',
      ],
      correctIndex: 1,
      rationale: 'Streaks are statistically normal; checking execution quality while protecting equity preserves both capital and edge.',
      commonTrap: 'Gambler’s fallacy—believing that five losses in a row makes trade #6 guaranteed to win.',
    },
  },
  {
    code: '5.9',
    slug: 'risk-of-ruin',
    title: 'Risk of Ruin',
    overviewEn:
      'Risk of Ruin is the mathematical probability of depleting your account to an unrecoverable threshold—driven primarily by excessive risk per trade, poor win rate, and negative expectancy.',
    overviewTaglish:
      'Ang Risk of Ruin ay ang matematikal na tsansa na maubos ang account mo—na mabilis lumalaki kapag sobrang laki ng risk per trade o negatibo ang expectancy ng sistema.',
    objectives: [
      'Identify the three drivers of Risk of Ruin: risk per trade, win rate, and average RR (Risk-to-Reward Ratio).',
      'Explain why keeping risk per trade small (≤ 1%) drives Risk of Ruin near zero for a positive-edge system.',
      'Reject Martingale (doubling down after losses) because it guarantees eventual ruin.',
    ],
    keyPoints: [
      'A strategy with negative expectancy (losing edge after fees) has a 100% long-run Risk of Ruin at any size.',
      'Even a strong positive-edge strategy can blow up if you risk 10%–20% per trade during a normal cold streak.',
      'Martingale doubling works briefly until one inevitable streak hits margin call and wipes out the entire account.',
    ],
    practicalExample:
      'A trader with a positive +0.3R expectancy risks 0.5%–1% per trade (near-0% Risk of Ruin), whereas another trader with the exact same entries risks 15% per trade and blows up within two months.',
    prerequisiteCodes: ['5.8'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Why does a Martingale strategy (doubling position size after every loss) carry extreme Risk of Ruin?',
      options: [
        'Because brokers reject even lot sizes.',
        'Because exponential bet growth during an inevitable losing streak quickly exhausts account margin.',
        'Because it requires trading on Daily charts.',
        'Because it uses small Stop Losses.',
      ],
      correctIndex: 1,
      rationale: 'Doubling 8 times in a row requires 256x your initial size—one ordinary losing streak destroys the entire account.',
      commonTrap: 'Adding blindly to losing trades ("averaging down without a stop") to force a quick breakeven.',
    },
  },
  {
    code: '5.10',
    slug: 'building-a-risk-management-plan',
    title: 'Building a Risk Management Plan',
    overviewEn:
      'A written Risk Management Plan turns abstract rules into an enforceable pre-trade contract covering risk per trade, max open exposure, daily/weekly loss stops, and scaling triggers.',
    overviewTaglish:
      'Ginagawang malinaw na kontrata ng Risk Management Plan ang mga batas mo sa risk per trade, max exposure, daily loss limit, at kailan lang pwedeng magpalaki ng size.',
    objectives: [
      'Draft a concise one-page Risk Management Plan with numeric limits.',
      'Define automatic scaling-down rules for drawdowns and scaling-up rules after consistent samples.',
      'Audit every trade in a journal against your written risk contract.',
    ],
    keyPoints: [
      'Core 5 rules: 0.5%–1% max risk per trade, max 2%–3% correlated exposure, 2% daily loss stop, 5% weekly pause, mandatory hard SL (Stop Loss).',
      'Never modify your risk rules mid-session while a trade is open.',
      'Review compliance weekly—measure "process score" alongside PnL (Profit and Loss).',
    ],
    practicalExample:
      'Before every session, a trader checks a 4-box card: 1% max risk? Hard SL set? Daily loss limit untouched? Correlated exposure ≤ 2%? If any box fails, no trade is placed.',
    prerequisiteCodes: ['5.9'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'When is the ONLY appropriate time to revise your written Risk Management Plan?',
      options: [
        'Right after a painful Stop Loss while feeling angry.',
        'Calmly outside market hours during a scheduled weekly or monthly journal review.',
        'Mid-trade while price is 2 pips away from hitting your Stop Loss.',
        'Whenever someone on social media posts a huge gain.',
      ],
      correctIndex: 1,
      rationale: 'Rules changed mid-session are emotional rationalizations; objective review happens strictly when flat and calm.',
      commonTrap: 'Writing a great risk plan once, saving it in a folder, and never checking compliance before entering trades.',
    },
  },

  // =========================================================================
  // MODULE 6 – Trading Psychology (6.1 – 6.10)
  // =========================================================================
  {
    code: '6.1',
    slug: 'psychology-behind-trading',
    title: 'Psychology Behind Trading',
    overviewEn:
      'Human brains evolved to seek certainty and avoid immediate pain—instincts that collide directly with the uncertain, probabilistic environment of financial markets.',
    overviewTaglish:
      'Likas sa isip ng tao ang maghanap ng katiyakan at umiwas sa sakit—mga ugaling direktang bumabangga sa mundo ng trading na puno ng probabilidad at kawalang-katiyakan.',
    objectives: [
      'Explain why smart people still make irrational decisions once real money is on the line.',
      'Connect cognitive biases (loss aversion, recency bias, confirmation bias) to common chart errors.',
      'Shift identity from "being right on this trade" to "executing a repeatable process."',
    ],
    keyPoints: [
      'Loss aversion makes a $50 loss hurt roughly twice as much psychologically as a $50 win feels good.',
      'Confirmation bias tricks traders into seeing only bullish clues after they are already Long.',
      'Structured checklists offload decisions from emotional impulses to objective pre-planned rules.',
    ],
    practicalExample:
      'A trader cuts a winning trade at +0.5R out of anxiety while letting a loser run to -2R hoping it recovers—a textbook loss-aversion flip.',
    prerequisiteCodes: ['5.10'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'risk-psychology',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'How does cognitive "loss aversion" typically sabotage trade management?',
      options: [
        'It makes traders take planned small losses instantly.',
        'It tempts traders to take tiny profits early out of fear while holding losers too long to avoid realizing pain.',
        'It improves Risk-to-Reward Ratio automatically.',
        'It prevents traders from opening demo accounts.',
      ],
      correctIndex: 1,
      rationale: 'Because realized losses hurt disproportionately, traders prematurely lock small gains yet refuse to close losers.',
      commonTrap: 'Believing you can "outsmart" psychology through willpower instead of building mechanical risk rules and checklists.',
    },
  },
  {
    code: '6.2',
    slug: 'fear-and-greed',
    title: 'Fear and Greed',
    overviewEn:
      'Fear causes hesitation, premature exits, and missed valid setups; greed causes oversized lots, moving Take Profits endlessly, and holding past logical targets.',
    overviewTaglish:
      'Ang takot ay nagdudulot ng pag-aalinlangan at maagang paglabas sa panalong trade, habang ang kasakiman ay nagtutulak ng sobrang laki ng lot size at paghahabol ng sobrang kita.',
    objectives: [
      'Spot behavioral symptoms of fear vs. greed during active market sessions.',
      'Use small, comfortable risk sizing to lower physiological fight-or-flight responses.',
      'Pre-commit entry, SL (Stop Loss), and TP (Take Profit) before emotion peaks.',
    ],
    keyPoints: [
      'If your heart races every time a candle ticks, your position size is too large for your current comfort level.',
      'Greed often peaks right after a winning streak—producing overconfidence and oversized "victory lap" losses.',
      'Set-and-manage rules neutralize both extremes by deciding exit criteria before entering.',
    ],
    practicalExample:
      'After three straight +2R winners, a trader feels invincible and triples lot size on trade #4—one normal stop-out erases the entire week’s profits.',
    prerequisiteCodes: ['6.1'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'risk-psychology',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is the most practical immediate fix if you feel intense anxiety watching an open position fluctuate?',
      options: [
        'Stare closer at the 5-second chart.',
        'Reduce your risk per trade to a size that allows calm, objective rule execution.',
        'Double your leverage to finish the trade faster.',
        'Delete your Stop Loss so you cannot get stopped out.',
      ],
      correctIndex: 1,
      rationale: 'Excessive emotional intensity is almost always a direct signal that dollar risk exceeds your current psychological tolerance.',
      commonTrap: 'Blaming weak willpower when the real root cause is oversized risk per trade.',
    },
  },
  {
    code: '6.3',
    slug: 'fomo-in-trading',
    title: 'FOMO',
    overviewEn:
      'FOMO (Fear of Missing Out) pushes traders to chase fast-moving candles far from logical Stop Loss zones right before price snaps back.',
    overviewTaglish:
      'Ang FOMO (Fear of Missing Out) ang nagtutulak sa mga trader na habulin ang mabilis na kandila kahit malayo na sa tamang entry—madalas sa mismong tuktok bago ito bumalik.',
    objectives: [
      'Recognize FOMO triggers: big sudden candles, missed watchlist alerts, and social-media PnL screenshots.',
      'Quantify how chasing wrecks RR (Risk-to-Reward Ratio) by stretching Stop Loss distance.',
      'Apply an "if missed, let it go" rule grounded in market abundance.',
    ],
    keyPoints: [
      'Markets generate thousands of fresh setups every year—missing one candle costs $0, whereas chasing can cost -1R or more.',
      'If price already ran 70% of the way to your target without you, the remaining reward no longer justifies the risk.',
      'Unfollow hype channels that post hindsight profits without verifiable entries or risk rules.',
    ],
    practicalExample:
      'Gold spikes $18 in three minutes after a headline; instead of chasing the top, the trader notes "Missed—wait for pullback or next session" and avoids the immediate $12 snapback.',
    prerequisiteCodes: ['6.2'],
    estimatedMinutes: 7,
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'You planned to buy at $100 with SL at $98 and TP at $106, but you stepped away and price is now $104. What is the disciplined move?',
      options: [
        'Buy immediately at $104 with SL still at $98 (risking $6 to make $2).',
        'Pass on the missed entry and wait for a fresh planned setup with valid Risk-to-Reward.',
        'Short it out of frustration.',
        'Remove the Stop Loss and chase with double size.',
      ],
      correctIndex: 1,
      rationale: 'Chasing at $104 flips a 1:3 RR trade into a terrible 3:1 negative risk profile.',
      commonTrap: 'Treating a missed opportunity as a financial loss, which fuels impulsive chasing.',
    },
  },
  {
    code: '6.4',
    slug: 'revenge-trading',
    title: 'Revenge Trading',
    overviewEn:
      'Revenge trading is the impulsive urge to re-enter immediately—often with larger size—right after a loss in order to erase discomfort and "get back" at the market.',
    overviewTaglish:
      'Ang revenge trading ay ang padalos-dalos na pagpasok ulit—madalas mas malaki pa ang taya—pagkatapos matalo para lang mabawi agad ang pera at mawala ang inis.',
    objectives: [
      'Identify the emotional loop behind revenge trading: loss → ego wound → urgency → bigger loss.',
      'Install mandatory cooldown timers (e.g., 30 minutes or session shutoff) after any Stop Loss.',
      'Remind yourself that the market is impersonal and owes nobody a quick recovery.',
    ],
    keyPoints: [
      'The market does not know you exist—trying to "win it back today" turns one small loss into a blown week.',
      'Hard daily loss limits (e.g., max 2 losses or -2% per day) mechanically break the revenge loop.',
      'Log your emotional state before every entry; if anger or urgency is present, step away from the screen.',
    ],
    practicalExample:
      'After taking two valid -1R Stop Losses during the New York open, the trader’s -2% daily rule activates, locking the platform until tomorrow’s review.',
    prerequisiteCodes: ['6.3'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'risk-psychology',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is the most effective safeguard against revenge trading after a frustrating Stop Loss?',
      options: [
        'Immediately switching to a 1-minute chart to scalp back the loss.',
        'Enforcing a mandatory cooldown period and a hard daily loss limit that shuts down trading for the day.',
        'Doubling position size on the very next candle.',
        'Blaming the broker and opening a second account.',
      ],
      correctIndex: 1,
      rationale: 'Physical separation from the execution button gives emotional adrenaline time to fade before capital is harmed.',
      commonTrap: 'Convincing yourself that an impulsive re-entry 90 seconds after a stop-out is a "fresh A+ setup."',
    },
  },
  {
    code: '6.5',
    slug: 'overtrading',
    title: 'Overtrading',
    overviewEn:
      'Overtrading happens when you take low-quality, B- or C-grade setups out of boredom, screen addiction, or arbitrary daily income goals—bleeding capital through fees and chop.',
    overviewTaglish:
      'Ang overtrading ay ang pagkuha ng malalabong setup dahil lang sa pagkabagot, sobrang tutok sa screen, o pilit na daily quota—na umuubos sa puhunan dahil sa talo at fees.',
    objectives: [
      'Distinguish active engagement (patience & preparation) from excessive clicking.',
      'Replace daily profit quotas with quality-driven trade caps (e.g., max 1–3 setups per session).',
      'Measure how cutting your worst 50% of trades often transforms net journal results.',
    ],
    keyPoints: [
      'Setting a "must make $100 every single day" target forces trades on dead, choppy days when no edge exists.',
      'More trades mean more spreads, more commissions, and greater decision fatigue.',
      'Being flat (in cash) is an active, protective position whenever your checklist is not met.',
    ],
    practicalExample:
      'Reviewing 40 journaled trades shows the trader’s first setup of the day averages +0.6R, while trades #4 and #5 of the same day average -0.8R—capping daily trades at 2 immediately lifts performance.',
    prerequisiteCodes: ['6.4'],
    estimatedMinutes: 7,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why do strict "daily income quotas" (e.g., forcing yourself to make $50 every single day) commonly hurt beginners?',
      options: [
        'Markets do not offer high-probability setups every single day, so quotas pressure traders into forcing low-quality trades.',
        'Brokers ban accounts that profit daily.',
        'Daily quotas make Stop Losses too tight.',
        'Markets are only open once a week.',
      ],
      correctIndex: 0,
      rationale: 'Market opportunity fluctuates by regime; forcing daily profits leads directly to overtrading poor conditions.',
      commonTrap: 'Equating hours spent clicking buttons with productivity, when selective restraint is what protects equity.',
    },
  },
  {
    code: '6.6',
    slug: 'trading-discipline',
    title: 'Trading Discipline',
    overviewEn:
      'Trading discipline is executing your pre-written plan consistently—entering when criteria align, passing when they do not, and honoring every Stop Loss without exception.',
    overviewTaglish:
      'Ang disiplina sa trading ay ang tapat na pagsunod sa nakasulat mong plano—papasok lang kapag kumpleto ang kondisyon, iiwas kapag kulang, at igagalang ang bawat Stop Loss.',
    objectives: [
      'Build a repeatable pre-market, execution, and post-market routine.',
      'Grade trades on rule compliance (A/B/C execution) separately from dollar outcome.',
      'Understand why breaking rules and getting lucky ("bad-habit reward") is dangerous long term.',
    ],
    keyPoints: [
      'A losing trade that followed every rule is a GOOD trade; a winning trade that broke risk rules is a DANGEROUS habit.',
      'Simple checklists beat vague intentions—write 4–5 concrete criteria required before clicking Submit.',
      'Track a "Rule Compliance %" metric in your journal every week and aim for 90%+.',
    ],
    practicalExample:
      'A trader skips a tempting breakout because Volume and HTF bias failed the checklist; even though it later rallied, they mark a "+1 Discipline Win" in their journal.',
    prerequisiteCodes: ['6.5'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Which outcome represents a "good trade" from a professional process perspective?',
      options: [
        'Breaking your Stop Loss rule and getting lucky with a small profit.',
        'Following your tested setup checklist and 1% risk cap cleanly, even if that individual trade hits Stop Loss.',
        'Copying a stranger’s alert with 10% risk and winning.',
        'Entering without a plan and closing quickly.',
      ],
      correctIndex: 1,
      rationale: 'Process discipline drives long-term expectancy; lucky rule-breaks reinforce habits that eventually blow up accounts.',
      commonTrap: 'Judging decision quality purely by whether the last single trade turned green or red.',
    },
  },
  {
    code: '6.7',
    slug: 'emotional-control',
    title: 'Emotional Control',
    overviewEn:
      'Emotional control does not mean feeling zero emotions—it means noticing stress signals early and preventing feelings from overriding your written execution rules.',
    overviewTaglish:
      'Ang emotional control ay hindi kawalan ng emosyon—ito ay ang maagang pagpansin sa stress o excitement para hindi nito mapalitan ang nakasulat mong trading rules.',
    objectives: [
      'Recognize physical tilt cues: shallow breathing, clenched jaw, rapid chart switching, and urgency.',
      'Use a 60-second pause and HALT check (Hungry, Angry, Lonely/Exhausted, Tilted) before ordering.',
      'Protect sleep, health, and calm environment as part of trading performance.',
    ],
    keyPoints: [
      'Decision quality drops sharply when fatigued, stressed from personal life, or trading late at night.',
      'Tagging your emotional state (Calm, FOMO, Anxious, Revenge) in your journal exposes expensive patterns fast.',
      'Stepping away for a walk when tilted is one of the highest-ROI actions a trader can take.',
    ],
    practicalExample:
      'After a stressful day at work, a trader runs their pre-session HALT check, notices high irritability, and chooses chart replay practice instead of live execution.',
    prerequisiteCodes: ['6.6'],
    estimatedMinutes: 7,
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'What is the most realistic goal of emotional control in trading?',
      options: [
        'Never feeling any emotion ever again.',
        'Detecting emotional shifts early and keeping them from altering your predefined risk and execution rules.',
        'Trading faster whenever you feel excited.',
        'Hiding losing trades so you do not feel bad.',
      ],
      correctIndex: 1,
      rationale: 'Emotions are natural biological signals; professionalism means acknowledging them without letting them steer orders.',
      commonTrap: 'Trading while sleep-deprived or emotionally drained and assuming your chart judgment is unaffected.',
    },
  },
  {
    code: '6.8',
    slug: 'handling-losing-streaks',
    title: 'Handling Losing Streaks',
    overviewEn:
      'Losing streaks test every trader’s conviction—responding with reduced size, objective journal audits, and calm rest preserves capital until favorable conditions return.',
    overviewTaglish:
      'Sinusubok ng losing streak ang tibay ng bawat trader—ang tamang tugon ay pagpapaliit ng risk, pag-audit ng journal, at pahinga hanggang bumalik ang malinaw na kondisyon.',
    objectives: [
      'Diagnose whether a losing streak stems from normal variance, regime shift, or self-inflicted rule breaks.',
      'Apply a structured "half-risk recovery protocol" until confidence and execution align.',
      'Avoid "strategy hopping" every time a tested method hits a normal cold patch.',
    ],
    keyPoints: [
      'Strategy hopping guarantees perpetual beginner losses because you abandon methods right at the bottom of their variance cycle.',
      'Audit screenshots first: if 4 of 5 losses broke your own rules, the fix is discipline—not a new indicator.',
      'Dropping temporarily to demo or half-risk stops financial damage while rebuilding calm rhythm.',
    ],
    practicalExample:
      'During a 5-trade cold streak (-4.5%), a trader pauses live orders for 48 hours, audits all 5 charts, cuts risk from 1% to 0.5%, and recovers steadily over the next three weeks.',
    prerequisiteCodes: ['6.7'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'drawdown-scaling-consistency',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why does constant "strategy hopping" during every losing streak prevent long-term progress?',
      options: [
        'Because every legitimate strategy has normal drawdown periods, and constantly switching prevents mastering any edge.',
        'Because brokers charge a fee whenever you switch strategies.',
        'Because only one trading strategy exists in the world.',
        'Because backtesting cannot measure losing streaks.',
      ],
      correctIndex: 0,
      rationale: 'Every probabilistic method experiences cold stretches; abandoning a tested edge prematurely locks in losses without capturing recovery.',
      commonTrap: 'Changing your entire trading system after just three losses instead of checking execution compliance.',
    },
  },
  {
    code: '6.9',
    slug: 'developing-patience',
    title: 'Developing Patience',
    overviewEn:
      'Patience is required twice on every trade: waiting for price to reach your planned zone before entering, and letting winning trades play out cleanly toward your target.',
    overviewTaglish:
      'Dalawang beses kailangan ang pasensya sa bawat trade: sa paghihintay na umabot ang presyo sa plano mong zone, at sa paghihintay na makarating ang panalong trade sa target.',
    objectives: [
      'Practice "stalking" pre-marked zones instead of forcing action mid-range.',
      'Resist micromanaging winning trades on 1-minute noise once entered on a Higher Timeframe.',
      'Reframe waiting in cash as active capital defense.',
    ],
    keyPoints: [
      'Most of trading is waiting—only a small fraction of time is spent clicking buy or sell.',
      'Use alerts at key levels and walk away so boredom cannot lure you into premature entries.',
      'Manage trades on the same timeframe you used to plan them; zooming into 1m after entering a 4H setup triggers panic exits.',
    ],
    practicalExample:
      'A swing trader plans a 4H entry with a 2-day target, places alerts at entry and target, and reviews the chart only at 4H candle closes instead of watching every tick.',
    prerequisiteCodes: ['6.8'],
    estimatedMinutes: 7,
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'After entering a swing trade planned on the 4-Hour chart, what habit most frequently causes premature panic exits?',
      options: [
        'Checking the trade calmly at each 4-Hour candle close.',
        'Zooming down to the 1-minute chart and reacting emotionally to every tiny red candle.',
        'Leaving the predefined Stop Loss and Take Profit in place.',
        'Writing the entry rationale in a journal.',
      ],
      correctIndex: 1,
      rationale: 'Lower-timeframe noise looks frightening even during completely normal Higher Timeframe movement.',
      commonTrap: 'Closing a valid 1:3 RR winner at +0.4R because of a minor 1-minute pullback.',
    },
  },
  {
    code: '6.10',
    slug: 'building-a-traders-mindset',
    title: 'Building a Trader\'s Mindset',
    overviewEn:
      'A sustainable trader thinks in large samples (20–50 trades), takes full ownership of every decision, treats journaling as a feedback loop, and prioritizes longevity over quick thrills.',
    overviewTaglish:
      'Ang matibay na mindset ng trader ay nag-iisip nang pangmatagalan (20–50 trades), umaako ng responsibilidad sa bawat desisyon, at ginagamit ang journal para tuloy-tuloy na gumaling.',
    objectives: [
      'Adopt probabilistic, sample-size thinking rather than attaching ego to individual outcomes.',
      'Take 100% personal accountability—zero blaming news, brokers, or indicators.',
      'Integrate continuous review (Journal → Metrics → Refinement) as your lifelong academy habit.',
    ],
    keyPoints: [
      'Measure success over blocks of 20–30 disciplined trades, never over a single afternoon.',
      'Protect your confidence by starting small, proving consistency in simulation, and scaling gradually.',
      'Completing Level 1 Foundations equips you to specialize responsibly without skipping risk and psychology.',
    ],
    practicalExample:
      'Every Sunday, a trader reviews their 20-trade block metrics—Win Rate, Average R, Rule Compliance %, and top recurring mistake—setting one clear focus goal for the coming week.',
    prerequisiteCodes: ['6.9'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'trading-journal-expectancy',
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'How does a mature trader evaluate whether their trading process is actually working?',
      options: [
        'By the profit or loss of the very last single trade.',
        'By reviewing rule compliance, expectancy, and drawdown across a meaningful sample of 20–50+ journaled trades.',
        'By comparing screenshots with influencers online.',
        'By how exciting their trading session felt.',
      ],
      correctIndex: 1,
      rationale: 'Individual trade outcomes are random noise; true edge and execution quality only appear across structured multi-trade samples.',
      commonTrap: 'Feeling like a genius after two lucky wins and like a failure after two normal losses.',
    },
  },
];

export const FOUNDATIONS_LESSONS: DecoupledLessonNode[] =
  FOUNDATION_SEEDS.map(buildFoundationNode);
