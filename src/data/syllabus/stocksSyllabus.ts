import type { AcademyModule, DecoupledLessonNode } from '../../types/curriculum-tree';

export const STOCKS_MODULES: AcademyModule[] = [
  {
    id: 'mod-s1',
    code: 'S1',
    title: 'Stock Market Fundamentals',
    subtitle: 'How equity ownership, stock exchanges, IPOs, market cap tiers, dividends, and indices work.',
    pathId: 'stocks',
    pillar: 'specializations',
    level: 2,
    lessonCodes: ['S1.1', 'S1.2', 'S1.3', 'S1.4', 'S1.5', 'S1.6', 'S1.7', 'S1.8', 'S1.9', 'S1.10'],
  },
  {
    id: 'mod-s2',
    code: 'S2',
    title: 'Stock Trading Mechanics',
    subtitle: 'Brokers, order execution types, spreads, volume, US/global session hours (PH time), settlement, and shorting.',
    pathId: 'stocks',
    pillar: 'specializations',
    level: 2,
    lessonCodes: ['S2.1', 'S2.2', 'S2.3', 'S2.4', 'S2.5', 'S2.6', 'S2.7', 'S2.8', 'S2.9', 'S2.10'],
  },
  {
    id: 'mod-s3',
    code: 'S3',
    title: 'Fundamental Stock Analysis',
    subtitle: 'Reading financial statements, valuation ratios (EPS, P/E, P/B, ROE), cash flow, and quarterly earnings.',
    pathId: 'stocks',
    pillar: 'specializations',
    level: 2,
    lessonCodes: [
      'S3.1', 'S3.2', 'S3.3', 'S3.4', 'S3.5', 'S3.6', 'S3.7',
      'S3.8', 'S3.9', 'S3.10', 'S3.11', 'S3.12', 'S3.13', 'S3.14',
    ],
  },
  {
    id: 'mod-s4',
    code: 'S4',
    title: 'Industry and Market Analysis',
    subtitle: 'Sector leadership, economic moats, institutional flows, earnings catalysts, and macro forces on equities.',
    pathId: 'stocks',
    pillar: 'specializations',
    level: 2,
    lessonCodes: ['S4.1', 'S4.2', 'S4.3', 'S4.4', 'S4.5', 'S4.6', 'S4.7', 'S4.8', 'S4.9', 'S4.10'],
  },
  {
    id: 'mod-s5',
    code: 'S5',
    title: 'Advanced Stock Trading',
    subtitle: 'Momentum, breakouts, swing vs. day trading, Gap and Go, earnings plays, volume confirmation, and portfolio rules.',
    pathId: 'stocks',
    pillar: 'specializations',
    level: 4,
    disclaimer:
      'Active equity strategies carry drawdowns, overnight gap risk, and slippage. Every setup is an analytical framework—never a guaranteed profit system.',
    lessonCodes: ['S5.1', 'S5.2', 'S5.3', 'S5.4', 'S5.5', 'S5.6', 'S5.7', 'S5.8', 'S5.9', 'S5.10'],
  },
  {
    id: 'mod-s6',
    code: 'S6',
    title: 'Additional Stock Market Instruments',
    subtitle: 'ETFs, REITs, optional equity options fundamentals, Greeks, hedging overlays, splits, and corporate actions.',
    pathId: 'stocks',
    pillar: 'specializations',
    level: 4,
    optional: true,
    disclaimer:
      'Optional Advanced Pathway: Options are an optional advanced instrument with time decay and leverage risks—NOT a prerequisite for ordinary stock investing or trading. Master spot equities and risk control first.',
    lessonCodes: ['S6.1', 'S6.2', 'S6.3', 'S6.4', 'S6.5', 'S6.6', 'S6.7', 'S6.8', 'S6.9', 'S6.10'],
  },
];

export const STOCKS_LESSONS: DecoupledLessonNode[] = [
  // =========================================================================
  // MODULE S1 — Stock Market Fundamentals (S1.1 – S1.10)
  // =========================================================================
  {
    id: 'topic-s1-1',
    code: 'S1.1',
    slug: 'stocks-s1-1-intro-stock-market',
    title: 'Introduction to the Stock Market',
    overviewEn:
      'The stock market is a regulated marketplace where companies raise long-term capital by selling ownership stakes and investors buy or sell those stakes based on expected future business performance.',
    overviewTaglish:
      'Ang stock market ay regulated na merkado kung saan nakakakuha ng kapital ang mga kumpanya kapalit ng ownership shares, at puwedeng bumili o magbenta ang investors base sa inaasahang performance ng negosyo.',
    objectives: [
      'Explain the dual purpose of equity markets: capital raising for firms and liquidity for investors.',
      'Distinguish primary market issuance from secondary market day-to-day trading.',
      'Identify why stock prices fluctuate continuously around expectations of earnings and risk.',
    ],
    keyPoints: [
      'Companies receive cash directly in the primary market; secondary trading happens between investors.',
      'Stock prices reflect forward expectations of profits, cash flow, and interest rates—not just past results.',
      'Regulated exchanges enforce listing disclosures, transparent pricing, and settlement rules.',
    ],
    practicalExample:
      'When a retail trader buys 10 shares of Apple (AAPL) on NASDAQ, the money goes to another seller—not Apple—while the share price reflects what the market expects Apple to earn over the coming years.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: [],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'When you buy shares of a publicly listed company on the open market, who receives your purchase money?',
      options: [
        'The company treasury directly as new operating cash',
        'Another investor or market maker selling those existing shares',
        'The stock exchange as a permanent listing deposit',
        'The central bank to back the share certificate',
      ],
      correctIndex: 1,
      rationale: 'Day-to-day stock trading occurs on the secondary market where buyers transact with existing shareholders or liquidity providers.',
      commonTrap: 'Beginners often assume every stock purchase sends fresh cash directly to the company.',
    },
  },
  {
    id: 'topic-s1-2',
    code: 'S1.2',
    slug: 'stocks-s1-2-what-are-stocks-and-shares',
    title: 'What are Stocks and Shares?',
    overviewEn:
      'A stock represents equity ownership in a corporation, while shares are the standardized fractional units that measure how much of that corporation you own.',
    overviewTaglish:
      'Ang stock ay kumakatawan sa equity ownership sa isang kumpanya, samantalang ang shares ay ang maliliit na unit na nagsasabi kung gaano kalaki ang parte mo sa negosyo.',
    objectives: [
      'Differentiate the general term stock from individual share units.',
      'Calculate proportional ownership from shares held divided by shares outstanding.',
      'Understand residual claim: shareholders profit after creditors are paid and carry downside risk.',
    ],
    keyPoints: [
      'Owning 1 share makes you a fractional part-owner with exposure to upside appreciation and dividends.',
      'Share price alone does not show if a company is cheap or expensive without share count.',
      'In bankruptcy, bondholders and creditors are repaid before common shareholders.',
    ],
    practicalExample:
      'Company A has 1,000,000 shares at $20 ($20M value), while Company B has 100,000 shares at $100 ($10M value). Company A is twice as large despite the lower share price.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.1'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why is a $15 stock NOT automatically cheaper than a $150 stock?',
      options: [
        'Because cheaper stocks always have higher broker commissions',
        'Because total company value depends on share price multiplied by total shares outstanding',
        'Because exchanges set arbitrary floor prices per industry',
        'Because $15 stocks cannot pay dividends',
      ],
      correctIndex: 1,
      rationale: 'Price per share is meaningless in isolation; valuation requires comparing total market capitalization against earnings and assets.',
      commonTrap: 'Unit-bias trap: buying low-dollar penny stocks thinking they have more room to grow than higher-priced quality businesses.',
    },
  },
  {
    id: 'topic-s1-3',
    code: 'S1.3',
    slug: 'stocks-s1-3-how-stock-exchanges-work',
    title: 'How Stock Exchanges Work',
    overviewEn:
      'Stock exchanges such as the New York Stock Exchange (NYSE), NASDAQ, and Philippine Stock Exchange (PSE) operate electronic matching engines that pair buy bids and sell asks by price-time priority.',
    overviewTaglish:
      'Ang stock exchanges tulad ng NYSE, NASDAQ, at PSE ay gumagamit ng electronic matching engine na nagtutugma ng buy bids at sell asks base sa pinakamagandang presyo at oras ng order.',
    objectives: [
      'Describe how a central limit order book matches buyers and sellers.',
      'Explain the role of designated market makers in maintaining continuous two-way quotes.',
      'Recognize exchange listing standards and circuit breakers during extreme volatility.',
    ],
    keyPoints: [
      'Highest bid and lowest ask form the National Best Bid and Offer (NBBO) on US exchanges.',
      'Market makers earn the bid-ask spread in exchange for supplying continuous liquidity.',
      'Exchange circuit breakers temporarily halt trading during extreme market drops to prevent panic disorder.',
    ],
    practicalExample:
      'If the highest buyer bids $50.10 and the lowest seller asks $50.12, a market buy order executes immediately at $50.12 through the matching engine.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.2'],
    estimatedMinutes: 9,
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'In an electronic stock exchange order book, which order gets priority when two buyers submit the same limit price?',
      options: [
        'The order placed earlier in time (price-time priority)',
        'The order coming from the newest brokerage account',
        'The order with the higher broker commission',
        'Orders are matched strictly in alphabetical order of ticker',
      ],
      correctIndex: 0,
      rationale: 'Exchanges prioritize best price first, and at equal price levels they fill orders on a first-in, first-out (time priority) basis.',
      commonTrap: 'Assuming your limit order fills the instant price touches your level even if thousands of shares sit ahead of you in the queue.',
    },
  },
  {
    id: 'topic-s1-4',
    code: 'S1.4',
    slug: 'stocks-s1-4-ipos-and-public-companies',
    title: 'IPOs and Public Companies',
    overviewEn:
      'An Initial Public Offering (IPO) is the process through which a private company first sells shares to the public, becoming subject to ongoing financial reporting and regulatory oversight.',
    overviewTaglish:
      'Ang Initial Public Offering (IPO) ay ang unang pagbebenta ng shares ng isang pribadong kumpanya sa publiko, kung saan obligado na itong maglabas ng regular at transparent na financial reports.',
    objectives: [
      'Outline the IPO process: investment bank underwriting, prospectus filing, roadshow, and listing day.',
      'Identify post-IPO volatility risks including lock-up period expirations.',
      'Compare traditional IPOs with direct listings.',
    ],
    keyPoints: [
      'The prospectus (S-1 in the US) discloses business risks, revenue trends, and how IPO funds will be used.',
      'Early insiders and venture backers are usually restricted from selling for 90–180 days (lock-up period).',
      'Opening-day hype frequently causes sharp spikes followed by steep pullbacks once early momentum fades.',
    ],
    limitationsNote: 'Freshly listed IPOs lack multi-year public chart history, making technical levels less reliable in the first weeks.',
    practicalExample:
      'A tech company prices its IPO at $28 for institutional clients, opens on the exchange at $41 due to retail hype, and drops to $29 two months later after lock-up selling pressure emerges.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.3'],
    estimatedMinutes: 9,
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'What commonly creates fresh selling pressure 90 to 180 days after a company’s IPO?',
      options: [
        'Mandatory delisting review by the exchange',
        'Expiration of the insider lock-up period allowing early investors to sell shares',
        'Automatic conversion of all shares into corporate bonds',
        'Removal of the stock from all brokerage apps',
      ],
      correctIndex: 1,
      rationale: 'Once lock-up restrictions expire, founders, employees, and venture investors can legally sell large blocks of shares on the open market.',
      commonTrap: 'Chasing day-one IPO market orders without knowing the valuation or upcoming lock-up supply.',
    },
  },
  {
    id: 'topic-s1-5',
    code: 'S1.5',
    slug: 'stocks-s1-5-common-vs-preferred-shares',
    title: 'Common vs. Preferred Shares',
    overviewEn:
      'Corporations may issue common shares—which carry voting rights and full growth upside—and preferred shares, which behave like equity-bond hybrids with priority fixed dividends.',
    overviewTaglish:
      'May dalawang pangunahing klase ng shares: common shares na may voting rights at full growth upside, at preferred shares na mas parang bond dahil may priority fixed dividend.',
    objectives: [
      'Compare voting rights, dividend priority, and liquidation rank between common and preferred shares.',
      'Recognize why active stock traders almost always trade common shares.',
      'Understand interest-rate sensitivity in fixed-dividend preferred stocks.',
    ],
    keyPoints: [
      'Common shares offer uncapped price appreciation potential and voting power on corporate governance.',
      'Preferred shares pay fixed dividends ahead of common shares but typically lack voting rights and big upside.',
      'Preferred shares are often callable, meaning the issuer can redeem them at par value.',
    ],
    practicalExample:
      'During a downturn, a utility company suspends common stock dividends to preserve cash while continuing to pay its 6% preferred share dividend first.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.4'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which statement accurately describes preferred shares compared with common shares?',
      options: [
        'Preferred shareholders always have 10x more voting power than common shareholders',
        'Preferred shares have dividend priority and higher liquidation rank, but usually no voting rights and limited upside',
        'Preferred shares cannot lose market value when interest rates rise',
        'Preferred shares are guaranteed by the government against default',
      ],
      correctIndex: 1,
      rationale: 'Preferred equity trades upside participation and voting rights for priority fixed dividends and seniority over common stock.',
      commonTrap: 'Treating preferred shares as risk-free savings accounts; their market price still falls if rates jump or the issuer weakens.',
    },
  },
  {
    id: 'topic-s1-6',
    code: 'S1.6',
    slug: 'stocks-s1-6-market-capitalization',
    title: 'Market Capitalization',
    overviewEn:
      'Market capitalization (market cap) measures a public company’s total equity market value by multiplying its current share price by total shares outstanding.',
    overviewTaglish:
      'Ang market capitalization (market cap) ay kabuuang halaga ng equity ng isang kumpanya: kasalukuyang presyo ng share i-multiply sa dami ng shares outstanding.',
    objectives: [
      'Compute market capitalization and classify mega-, large-, mid-, small-, and micro-cap stocks.',
      'Relate market cap size to liquidity, bid-ask spread width, and typical price volatility.',
      'Avoid judging company size by nominal share price.',
    ],
    keyPoints: [
      'Large-cap stocks ($10B+ in US markets) typically offer deep liquidity and narrower spreads.',
      'Small-cap ($300M–$2B) and micro-cap stocks move faster but carry sharper liquidity and dilution risk.',
      'Free-float market cap excludes locked insider shares to reflect tradable supply.',
    ],
    practicalExample:
      'A mid-cap software firm with 80 million shares trading at $50 has a $4 billion market cap—much more volatile than a $500 billion large-cap leader.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.5'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'A company has 50 million shares outstanding trading at $24 per share. What is its market capitalization?',
      options: ['$74 million', '$1.2 billion', '$2.4 billion', '$500 million'],
      correctIndex: 1,
      rationale: 'Market Cap = Share Price ($24) × Shares Outstanding (50,000,000) = $1,200,000,000 ($1.2 billion).',
      commonTrap: 'Confusing small-cap volatility with easy profits while ignoring wide spreads and heavy slippage.',
    },
  },
  {
    id: 'topic-s1-7',
    code: 'S1.7',
    slug: 'stocks-s1-7-blue-chip-growth-value-stocks',
    title: 'Blue-Chip, Growth, and Value Stocks',
    overviewEn:
      'Stocks are commonly grouped by business maturity and pricing profile into blue-chip leaders, high-expansion growth companies, and discounted value stocks.',
    overviewTaglish:
      'Karaniwang hinahati ang mga stocks sa blue-chip (matatag at kilala), growth stocks (mabilis lumaki ang kita), at value stocks (mas mababa ang presyo kumpara sa intrinsic value).',
    objectives: [
      'Define core traits of blue-chip, growth, and value equities.',
      'Understand how interest-rate shifts affect high-multiple growth stocks versus cash-rich value firms.',
      'Recognize value traps where cheap ratios reflect a structurally declining business.',
    ],
    keyPoints: [
      'Blue-chip stocks have durable brands, strong balance sheets, and consistent earnings history.',
      'Growth stocks reinvest cash into expansion and trade at higher multiples; they react sharply to rate hikes.',
      'Value stocks trade below peers on earnings or book value, aiming for re-rating once fundamentals stabilize.',
    ],
    practicalExample:
      'When interest rates rose sharply in 2022, unprofitable high-multiple growth tech stocks fell steeply while cash-generating energy and consumer staples held up far better.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.6'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What is a classic "value trap" in equity analysis?',
      options: [
        'A blue-chip stock that pays steady quarterly dividends',
        'A stock that looks statistically cheap because its underlying business and earnings are steadily deteriorating',
        'A growth stock that splits its shares 4-for-1',
        'An index fund with a very low expense ratio',
      ],
      correctIndex: 1,
      rationale: 'A low valuation multiple is not a bargain if revenues and margins are shrinking structurally.',
      commonTrap: 'Buying a falling stock solely because its P/E ratio looks lower than last year without checking if earnings are collapsing.',
    },
  },
  {
    id: 'topic-s1-8',
    code: 'S1.8',
    slug: 'stocks-s1-8-dividends',
    title: 'Dividends',
    overviewEn:
      'Dividends are periodic distributions of a company’s profits paid to shareholders in cash or additional shares, providing an income stream alongside price changes.',
    overviewTaglish:
      'Ang dividends ay parte ng kita ng kumpanya na ibinabalik sa shareholders bilang cash o dagdag na shares, na nagbibigay ng income bukod pa sa galaw ng presyo.',
    objectives: [
      'Calculate dividend yield and dividend payout ratio.',
      'Explain why an abnormally high dividend yield can warn of an upcoming dividend cut.',
      'Understand total return as price appreciation plus reinvested dividends.',
    ],
    keyPoints: [
      'Dividend Yield = Annual Dividend per Share ÷ Current Share Price.',
      'Payout Ratio = Dividends Paid ÷ Net Income; very high ratios above 90% may signal sustainability strain.',
      'Companies are never legally forced to maintain common dividends and may cut them during downturns.',
    ],
    practicalExample:
      'A bank paying $2.00 annually per share at a $50 stock price yields 4.0%. If the share price halves to $25 due to bad loans, the yield spikes to 8.0%—a warning sign, not free money.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.7'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why should an investor investigate carefully before buying a stock with a sudden 14% dividend yield?',
      options: [
        'Exchanges ban dividends above 10%',
        'The high yield often results from a plunging share price and may precede a dividend cut',
        'Dividends are automatically deducted from the investor’s bank account',
        'High-yield stocks cannot be sold for one full year',
      ],
      correctIndex: 1,
      rationale: 'Because yield equals dividend divided by share price, a collapsing stock price artificially inflates trailing yield right before management cuts the payout.',
      commonTrap: 'Chasing the highest dividend yield on a screener without inspecting free cash flow and payout ratio.',
    },
  },
  {
    id: 'topic-s1-9',
    code: 'S1.9',
    slug: 'stocks-s1-9-stock-market-indices',
    title: 'Stock Market Indices',
    overviewEn:
      'Stock market indices track a curated basket of stocks—such as the S&P 500, NASDAQ 100, Dow Jones, or PSEi—to benchmark broad market health and sector trends.',
    overviewTaglish:
      'Ang stock market indices tulad ng S&P 500, NASDAQ 100, at PSEi ay sumusukat sa kabuuang galaw ng piniling grupo ng stocks para makita kung bullish o bearish ang malawak na merkado.',
    objectives: [
      'Differentiate market-cap-weighted indices (S&P 500, PSEi) from price-weighted indices (Dow Jones).',
      'Use broad index trend and breadth to contextualize individual stock setups.',
      'Understand index rebalancing and why additions or removals affect stock demand.',
    ],
    keyPoints: [
      'In market-cap-weighted indices, the largest companies have the biggest impact on index movement.',
      'Most individual stocks follow the broad index direction—fighting a falling market index lowers setup odds.',
      'Indices themselves cannot be bought directly; investors gain exposure via ETFs, index funds, or index futures.',
    ],
    practicalExample:
      'Even if a tech stock breaks out on its own chart, if the S&P 500 and NASDAQ 100 are selling off sharply below key support, breakout failure rates rise significantly.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.8'],
    estimatedMinutes: 8,
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'In a market-capitalization-weighted index like the S&P 500, which stocks move the index the most?',
      options: [
        'Stocks with the highest nominal dollar share price regardless of company size',
        'The largest companies by total market capitalization',
        'The stocks with the highest daily percentage volume',
        'Every constituent carries an identical fixed weight every day',
      ],
      correctIndex: 1,
      rationale: 'Market-cap weighting assigns larger index weights to companies with larger float-adjusted market capitalization.',
      commonTrap: 'Assuming the S&P 500 being green means every single stock in the market is healthy—narrow mega-cap leadership can mask weak breadth.',
    },
  },
  {
    id: 'topic-s1-10',
    code: 'S1.10',
    slug: 'stocks-s1-10-stock-market-participants',
    title: 'Stock Market Participants',
    overviewEn:
      'Equity markets are shaped by institutional funds, pension managers, market makers, algorithmic desks, corporate buybacks, and retail traders—each operating on different time horizons and constraints.',
    overviewTaglish:
      'Binubuo ang stock market ng institutional funds, pension managers, market makers, algorithmic desks, at retail traders—bawat isa ay may magkakaibang laki ng kapital at time horizon.',
    objectives: [
      'Distinguish institutional volume footprints from retail order flow.',
      'Explain why large funds accumulate or distribute positions across days rather than one candle.',
      'Recognize retail traders’ real edge: agility and the freedom to sit in cash.',
    ],
    keyPoints: [
      'Institutions drive sustained multi-week trends because large orders cannot fill instantaneously without moving price.',
      'Market makers hedge inventory and earn spreads rather than betting on multi-month direction.',
      'Retail traders cannot move mega-caps, but they can enter and exit cleanly and stay in cash during choppy markets.',
    ],
    practicalExample:
      'A mutual fund buying $200M of a mid-cap stock spreads orders over two weeks using VWAP algorithms, creating steady higher lows and above-average daily volume.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.9'],
    estimatedMinutes: 8,
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'What structural advantage does a disciplined retail stock trader actually hold over a multi-billion-dollar mutual fund?',
      options: [
        'Faster fiber-optic execution directly inside the exchange server',
        'Agility to enter/exit without moving price and freedom to stay 100% in cash when setups are poor',
        'Legal access to non-public quarterly earnings before release',
        'Exemption from bid-ask spreads and commissions',
      ],
      correctIndex: 1,
      rationale: 'Many mutual funds are mandated to stay nearly fully invested and suffer market impact when moving large blocks; retail traders can stay selective and nimble.',
      commonTrap: 'Trying to out-speed high-frequency algorithms on 1-second charts instead of trading clear multi-hour or daily structure.',
    },
  },

  // =========================================================================
  // MODULE S2 — Stock Trading Mechanics (S2.1 – S2.10)
  // =========================================================================
  {
    id: 'topic-s2-1',
    code: 'S2.1',
    slug: 'stocks-s2-1-how-to-buy-and-sell-stocks',
    title: 'How to Buy and Sell Stocks',
    overviewEn:
      'Executing a stock trade involves funding a regulated brokerage account, verifying the exact ticker symbol, calculating position size from stop-loss distance, choosing an order type, and confirming fill status.',
    overviewTaglish:
      'Sa pagbili o pagbenta ng stock, kailangan ng regulated brokerage account, tamang ticker symbol, tamang position size base sa stop-loss, tamang order type, at kumpirmasyon ng fill.',
    objectives: [
      'Follow a repeatable pre-trade checklist before clicking buy or sell.',
      'Verify ticker symbols, share quantity, order type, and time-in-force (DAY vs. GTC).',
      'Calculate share size from fixed dollar risk divided by entry-to-stop distance.',
    ],
    keyPoints: [
      'Shares to Buy = Max Risk ($) ÷ (Entry Price − Stop-Loss Price).',
      'Always double-check ticker spelling and exchange listing to avoid buying the wrong company.',
      'Order routing goes from broker platform to exchange or market maker and returns an execution confirmation.',
    ],
    practicalExample:
      'With a $5,000 account and 1% max risk ($50), entering at $40.00 with a stop at $38.00 ($2.00 risk/share) yields exactly 25 shares ($1,000 position value).',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.10'],
    estimatedMinutes: 9,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'You risk a maximum of $100 on a stock trade. Your entry is $52.00 and your stop-loss is $50.00. How many shares should you buy?',
      options: ['25 shares', '50 shares', '100 shares', '2 shares'],
      correctIndex: 1,
      rationale: 'Risk per share is $52.00 − $50.00 = $2.00. Dividing $100 max risk by $2.00 equals 50 shares.',
      commonTrap: 'Buying a random round number like 100 shares without checking whether the stop-loss loss exceeds your risk limit.',
    },
  },
  {
    id: 'topic-s2-2',
    code: 'S2.2',
    slug: 'stocks-s2-2-choosing-a-stock-broker',
    title: 'Choosing a Stock Broker',
    overviewEn:
      'Selecting a stock broker requires checking regulatory licensing, investor asset protection, fee structure, execution quality, supported markets, and funding/withdrawal reliability.',
    overviewTaglish:
      'Sa pagpili ng stock broker, unahin ang regulatory license (hal. SEC/FINRA o PSE-accredited), kaligtasan ng pondo, transparent na fees, maayos na execution, at madaling deposit/withdrawal.',
    objectives: [
      'Verify broker regulation (e.g., SEC/FINRA/SIPC in the US, SEC/PSE accreditation in the Philippines).',
      'Compare total trading costs: commissions, FX conversion spreads, custody fees, and market data fees.',
      'Differentiate Cash accounts from Margin accounts.',
    ],
    keyPoints: [
      'Zero-commission headlines can still hide wide FX conversion markups or poor order fill quality.',
      'Regulated brokers segregate client assets from operating funds and carry statutory investor protection.',
      'Start with a Cash account until you have mastered risk sizing and settlement rules.',
    ],
    practicalExample:
      'A trader compares two brokers: Broker A charges $0 commission but 1.5% FX conversion on PHP-to-USD deposits; Broker B charges $1/trade and 0.2% FX spread—Broker B is far cheaper overall.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.1'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What is the FIRST non-negotiable check before depositing money with any stock broker?',
      options: [
        'Whether the broker offers the highest leverage bonus',
        'Whether the broker is officially licensed and regulated by a recognized securities regulator',
        'Whether social media influencers promote its mobile UI',
        'Whether it promises guaranteed monthly dividends',
      ],
      correctIndex: 1,
      rationale: 'Regulatory oversight and client-asset segregation protect you from fraud and unregulated bucket shops.',
      commonTrap: 'Signing up with an offshore unregulated CFD app thinking you are buying real exchange-listed stocks.',
    },
  },
  {
    id: 'topic-s2-3',
    code: 'S2.3',
    slug: 'stocks-s2-3-market-and-limit-orders',
    title: 'Market and Limit Orders',
    overviewEn:
      'Market orders prioritize immediate execution at whatever price is available now, while limit orders prioritize exact price control at the risk of remaining unfilled.',
    overviewTaglish:
      'Ang market order ay nagbibigay ng mabilis na fill sa anumang available na presyo, samantalang ang limit order ay nagbibigay ng kontrol sa presyo kahit may tsansang hindi agad ma-fill.',
    objectives: [
      'Contrast execution certainty (market order) against price certainty (limit order).',
      'Identify when market orders cause painful slippage during fast news spikes or thin books.',
      'Use marketable limit orders to combine fast fills with a strict price ceiling.',
    ],
    keyPoints: [
      'A buy limit executes at your limit price or lower; a sell limit executes at your limit price or higher.',
      'Avoid market orders in illiquid stocks, at the first seconds of market open, or during extended hours.',
      'Limit orders protect you from sudden spread widening and bad fills.',
    ],
    practicalExample:
      'A stock is quoted $20.00 bid / $20.15 ask. Placing a buy limit at $20.05 prevents paying $20.40 if a sudden spike clears the thin ask book.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.2'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'stocks-market-hours-volume-order-types',
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'Which order type guarantees that you will NOT pay more than $45.50 per share when buying?',
      options: [
        'Buy Market Order',
        'Buy Limit Order at $45.50',
        'Sell Stop Order at $45.50',
        'Market-on-Open Order',
      ],
      correctIndex: 1,
      rationale: 'A buy limit order sets a hard ceiling—your broker can only fill you at $45.50 or better (lower).',
      commonTrap: 'Using market orders on low-volume stocks and getting filled 3% above the last traded price.',
    },
  },
  {
    id: 'topic-s2-4',
    code: 'S2.4',
    slug: 'stocks-s2-4-stop-and-stop-limit-orders',
    title: 'Stop Orders and Stop-Limit Orders',
    overviewEn:
      'Stop orders trigger a market order once price reaches your stop level to exit a losing trade or enter a breakout, whereas stop-limit orders trigger a limit order that can go unfilled during sharp gaps.',
    overviewTaglish:
      'Ang stop order ay nagiging market order kapag natamaan ang stop price para siguradong makalabas sa talo, habang ang stop-limit order ay nagiging limit order na puwedeng maiwan kung biglang nag-gap ang presyo.',
    objectives: [
      'Compare stop-market orders versus stop-limit orders for protective stop-losses.',
      'Explain why overnight gaps can jump completely past a stop-limit price.',
      'Place stop levels beyond structural invalidation rather than arbitrary tight pennies.',
    ],
    keyPoints: [
      'Stop-market prioritizes getting out of a bad trade, accepting minor slippage if price gaps.',
      'Stop-limit controls exit price, but if a stock gaps below your limit, you remain trapped in a falling position.',
      'Trailing stops automatically adjust upward as price moves in your favor, locking in gains.',
    ],
    practicalExample:
      'You hold a stock at $50 with a sell stop-limit at $48 stop / $47.80 limit. Bad overnight news opens the stock at $44—your stop-limit never fills, leaving you exposed as it drops further to $39.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.3'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'stocks-market-hours-volume-order-types',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'What is the main danger of using a tight Stop-Limit order as your protective stop-loss on a stock held overnight?',
      options: [
        'It doubles your brokerage commission automatically',
        'If the stock gaps below your limit price, the order may stay unfilled while losses deepen',
        'It converts your shares into options contracts',
        'Exchanges cancel all stop-limit orders at noon',
      ],
      correctIndex: 1,
      rationale: 'A stop-limit cannot execute below its limit price, so a gap down leaves you holding an unprotected losing position.',
      commonTrap: 'Using stop-limit for emergency exits to save a few cents and accidentally riding a huge gap down.',
    },
  },
  {
    id: 'topic-s2-5',
    code: 'S2.5',
    slug: 'stocks-s2-5-bid-ask-spread',
    title: 'Bid-Ask Spread',
    overviewEn:
      'The bid-ask spread is the gap between the highest price buyers will pay (bid) and the lowest price sellers will accept (ask), representing an immediate hidden transaction cost.',
    overviewTaglish:
      'Ang bid-ask spread ay ang agwat sa pagitan ng pinakamataas na bid ng buyers at pinakamababang ask ng sellers—isa itong direktang hidden cost sa bawat trade.',
    objectives: [
      'Measure spread in both dollar terms and percentage of share price.',
      'Identify why spreads widen during market opens, pre-market, news releases, and low-volume stocks.',
      'Factor spread cost into scalping and intraday risk-to-reward calculations.',
    ],
    keyPoints: [
      'Liquid large-caps often trade with a $0.01 spread (<0.02%); thin stocks can have 1%–3% spreads.',
      'Crossing a wide spread with market orders immediately puts your trade deep in the red.',
      'Using patient limit orders inside or near the bid/ask reduces spread drag over hundreds of trades.',
    ],
    practicalExample:
      'Buying a $10.00 stock quoted $9.90 bid / $10.10 ask via market order starts your trade at an instant −2.0% drawdown before price even moves.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.4'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'stocks-market-hours-volume-order-types',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'A stock is quoted at $25.00 Bid / $25.50 Ask. If you buy at market and immediately sell at market, what happens before fees?',
      options: [
        'You break even at $25.25',
        'You immediately lose $0.50 per share (2% spread cost)',
        'You gain $0.50 per share from the market maker',
        'The exchange refunds the difference at market close',
      ],
      correctIndex: 1,
      rationale: 'Market buys fill at the ask ($25.50) and market sells fill at the bid ($25.00), costing the full $0.50 spread.',
      commonTrap: 'Ignoring percentage spread on low-priced stocks where a $0.10 spread on a $2 stock equals a massive 5% hurdle.',
    },
  },
  {
    id: 'topic-s2-6',
    code: 'S2.6',
    slug: 'stocks-s2-6-trading-volume-and-liquidity',
    title: 'Trading Volume and Liquidity',
    overviewEn:
      'Volume counts the number of shares traded in a period, while liquidity measures how easily you can enter or exit a meaningful position without distorting the stock’s price.',
    overviewTaglish:
      'Ang volume ay bilang ng shares na nagpalit-kamay sa isang takdang oras, habang ang liquidity ay nagsasabi kung gaano kadaling pumasok at lumabas nang hindi masyadong nagpapagalaw ng presyo.',
    objectives: [
      'Distinguish share volume from dollar volume (Price × Volume).',
      'Use Relative Volume (RVOL) to spot stocks genuinely "in play" with institutional participation.',
      'Set minimum liquidity filters to avoid getting trapped in illiquid tickers.',
    ],
    keyPoints: [
      'Dollar volume (e.g., >$20M daily for active US trading) is a better liquidity gauge than raw share count.',
      'RVOL above 2.0 signals unusually strong participation validating catalysts and breakouts.',
      'Low-liquidity stocks suffer erratic wicks, wide spreads, and unreliable technical patterns.',
    ],
    practicalExample:
      'A $1 stock trading 1,000,000 shares has only $1M in dollar volume, whereas a $200 stock trading 500,000 shares has $100M in dollar volume—far more liquid.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.5'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'stocks-market-hours-volume-order-types',
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'Why is Relative Volume (RVOL) of 3.0x valuable when evaluating a stock breakout?',
      options: [
        'It guarantees the stock will triple in price that week',
        'It shows current participation is 3x normal average, signaling real institutional interest',
        'It means the company just completed a 3-for-1 stock split',
        'It automatically tightens your stop-loss on the broker platform',
      ],
      correctIndex: 1,
      rationale: 'Elevated RVOL confirms that big players are actively repricing the stock rather than a quiet, easily faded low-volume drift.',
      commonTrap: 'Trading breakouts on dead-volume days where price quickly snaps back inside the range.',
    },
  },
  {
    id: 'topic-s2-7',
    code: 'S2.7',
    slug: 'stocks-s2-7-market-hours-and-sessions',
    title: 'Market Hours and Trading Sessions',
    overviewEn:
      'Stock exchanges operate on fixed local trading sessions with distinct intraday volume rhythms: an explosive open, a quieter midday lull, and an active institutional close.',
    overviewTaglish:
      'May takdang oras ang bawat stock exchange at malinaw na ritmo ang volume: malakas sa market open, mas tahimik sa tanghali, at aktibo ulit bago mag-close.',
    objectives: [
      'Convert major US equity session hours accurately into Philippine Time (PHT / UTC+8).',
      'Map the U-shaped intraday volume curve: Opening Drive, Midday Chop, and Power Hour.',
      'Align trading windows with your personal schedule so you never trade fatigued.',
    ],
    keyPoints: [
      'US Regular Market Hours (9:30 AM–4:00 PM ET) equal 9:30 PM–4:00 AM PHT (Daylight Saving) or 10:30 PM–5:00 AM PHT (Standard Time).',
      'The first 60–90 minutes and final 60 minutes concentrate the highest institutional volume and cleanest trends.',
      'Midday sessions often produce fake breakouts and mean-reverting chop.',
    ],
    practicalExample:
      'A Philippine-based trader trading US equities focuses solely on the first 90 minutes (9:30 PM–11:00 PM PHT in DST) instead of staying awake until 4:00 AM and making tired mistakes.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.6'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'stocks-market-hours-volume-order-types',
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'During US Daylight Saving Time, when does the US stock market regular open (9:30 AM ET) occur in Philippine Time (PHT)?',
      options: ['9:30 AM PHT', '5:30 PM PHT', '9:30 PM PHT', '1:30 AM PHT'],
      correctIndex: 2,
      rationale: 'Eastern Daylight Time (UTC-4) is 12 hours behind PHT (UTC+8), so 9:30 AM EDT is 9:30 PM PHT (and 10:30 PM PHT during US Standard Time).',
      commonTrap: 'Forgetting US Daylight Saving Time shifts in March and November and missing the market open by one hour.',
    },
  },
  {
    id: 'topic-s2-8',
    code: 'S2.8',
    slug: 'stocks-s2-8-pre-market-and-after-hours',
    title: 'Pre-Market and After-Hours Trading',
    overviewEn:
      'Extended-hours sessions allow trading before the opening bell and after the closing bell—mainly for reacting to earnings or news—but come with thinner liquidity, wider spreads, and limit-order-only rules.',
    overviewTaglish:
      'Sa pre-market at after-hours sessions, puwedeng mag-react sa earnings o balita, pero manipis ang liquidity, malapad ang spread, at limit orders lang ang karaniwang pinapayagan.',
    objectives: [
      'Identify typical US pre-market (4:00 AM–9:30 AM ET) and after-hours (4:00 PM–8:00 PM ET) windows.',
      'Explain why stop-market orders generally do not trigger during extended hours.',
      'Use pre-market highs, lows, and volume to build a regular-session game plan without chasing thin prints.',
    ],
    keyPoints: [
      'Most brokers require Limit orders with Extended-Hours routing enabled; standard market orders are blocked.',
      'Thin order books mean a modest order can spike price sharply and reverse once regular liquidity arrives at 9:30 AM ET.',
      'Often the smarter move is letting extended-hours volatility settle and trading confirmed regular-session structure.',
    ],
    limitationsNote: 'Pre-market spikes frequently reverse within minutes of the opening bell as overnight profit-taking hits.',
    practicalExample:
      'A stock jumps +12% in after-hours on earnings with thin volume, then fades back to +4% once full institutional liquidity opens at 9:30 AM ET.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.7'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'stocks-market-hours-volume-order-types',
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'Which execution risk is most characteristic of pre-market and after-hours stock trading?',
      options: [
        'Trading is restricted exclusively to government bonds',
        'Thinner liquidity, wider bid-ask spreads, and standard stop-loss orders not triggering',
        'Share prices are legally frozen at the closing price',
        'Commissions are always zero with guaranteed zero slippage',
      ],
      correctIndex: 1,
      rationale: 'Extended hours have far fewer participants, causing erratic spreads and unexecuted standard stops.',
      commonTrap: 'Assuming your regular-hours stop-loss will protect you during an after-hours earnings plunge.',
    },
  },
  {
    id: 'topic-s2-9',
    code: 'S2.9',
    slug: 'stocks-s2-9-settlement-and-clearing',
    title: 'Settlement and Clearing',
    overviewEn:
      'Clearing and settlement are the back-office processes that legally transfer shares and cash between buyer and seller—now T+1 (trade date plus one business day) in US markets.',
    overviewTaglish:
      'Ang clearing at settlement ay ang opisyal na paglipat ng shares at cash sa pagitan ng buyer at seller—karaniwang T+1 sa US stocks at T+2 sa PSE.',
    objectives: [
      'Define Trade Date (T) versus Settlement Date (T+1 in US equities, T+2 in PSE).',
      'Prevent Cash Account Good Faith Violations (GFV) caused by trading with unsettled proceeds.',
      'Explain how central clearinghouses reduce counterparty default risk.',
    ],
    keyPoints: [
      'In a Cash account, buying with unsettled sale funds and selling again before settlement triggers a Good Faith Violation.',
      'Margin accounts waive settlement waits for buying power but introduce borrowing interest and Pattern Day Trader (PDT) rules in US brokers.',
      'Central clearinghouses (like DTCC/NSCC) guarantee trade completion even if one broker fails.',
    ],
    practicalExample:
      'On Monday (T) you sell $2,000 of Stock A in a US Cash account. Those cash funds officially settle on Tuesday (T+1); buying and selling Stock B on Monday before settlement risks a Good Faith Violation.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.8'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Under US T+1 settlement, if you sell a stock on Tuesday (with no market holidays), when do the cash proceeds officially settle?',
      options: ['Immediately within 1 minute', 'Wednesday (next business day)', 'Friday (T+3)', 'The following Monday'],
      correctIndex: 1,
      rationale: 'T+1 means Trade Date plus one business day—Tuesday’s trade settles on Wednesday.',
      commonTrap: 'Flipping full Cash-account buying power multiple times a day and getting restricted for Good Faith Violations.',
    },
  },
  {
    id: 'topic-s2-10',
    code: 'S2.10',
    slug: 'stocks-s2-10-short-selling',
    title: 'Short Selling',
    overviewEn:
      'Short selling means borrowing shares from a broker to sell high now and hoping to buy them back lower later—introducing borrowing fees, margin calls, and theoretically unlimited upside loss.',
    overviewTaglish:
      'Ang short selling ay paghiram ng shares sa broker para ibenta nang mataas ngayon at bilhin ulit nang mas mababa—pero may borrow fee, margin call, at walang kisame ang posibleng lugi kapag biglang lumipad ang presyo.',
    objectives: [
      'Walk through the mechanics of borrowing shares, selling short, and buying to cover.',
      'Explain why shorting carries asymmetric risk (max gain 100%, theoretically uncapped loss).',
      'Recognize short squeezes, high short interest, and hard-to-borrow locate fees.',
    ],
    keyPoints: [
      'Short sellers must pay borrow fees and reimburse any dividends declared while the short is open.',
      'A short squeeze happens when rising prices force short sellers to buy back shares aggressively, fueling vertical spikes.',
      'Shorting requires a Margin account and strict hard stop-losses—never average into a losing short.',
    ],
    limitationsNote: 'Short selling is an advanced risk mechanism; beginners should build consistency on long-only trades first.',
    practicalExample:
      'Shorting 100 shares at $20 risks far more than $2,000 if a buyout or meme squeeze gaps the stock to $60 overnight—a $4,000 loss (200% of initial position).',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.9'],
    estimatedMinutes: 10,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Why is short selling structurally riskier than buying a stock with cash?',
      options: [
        'Short trades are taxed at 90% automatically',
        'A stock can only drop to $0 (100% max gain for shorts), but its price can rise indefinitely, creating uncapped loss risk',
        'Short sellers cannot place limit orders',
        'Short selling is only allowed during pre-market hours',
      ],
      correctIndex: 1,
      rationale: 'Long cash positions have capped downside (to $0), while short positions face theoretically unlimited losses and forced buy-ins during squeezes.',
      commonTrap: 'Shorting heavily shorted small-cap runners purely because "it went up too much," right into a violent short squeeze.',
    },
  },

  // =========================================================================
  // MODULE S3 — Fundamental Stock Analysis (S3.1 – S3.14)
  // =========================================================================
  {
    id: 'topic-s3-1',
    code: 'S3.1',
    slug: 'stocks-s3-1-intro-fundamental-analysis',
    title: 'Introduction to Fundamental Analysis',
    overviewEn:
      'Fundamental analysis evaluates a company’s underlying business health—revenue growth, profitability, debt strength, and competitive position—to judge what the business is worth over time.',
    overviewTaglish:
      'Sinusuri ng fundamental analysis ang tunay na kalusugan ng negosyo—sales, kita, utang, at kalamangan sa kompetisyon—para matantya kung sulit ang presyo ng stock.',
    objectives: [
      'Compare fundamental analysis ("what to buy") with technical analysis ("when to enter and manage risk").',
      'Distinguish quantitative metrics (financial statements) from qualitative drivers (brand, leadership).',
      'Recognize that undervalued stocks can stay cheap longer than impatient traders expect.',
    ],
    keyPoints: [
      'Over multi-year horizons, stock prices tend to follow earnings and free cash flow growth.',
      'Combining strong fundamentals with technical timing avoids buying great businesses during active downtrends.',
      'Always analyze metrics relative to industry peers and historical trends, never in a vacuum.',
    ],
    practicalExample:
      'A swing trader screens for companies growing revenue over 20% with healthy profit margins (fundamentals), then waits for a clean pullback to support before entering (technicals).',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S1.10'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'How do fundamental analysis and technical analysis best complement each other for stock traders?',
      options: [
        'Fundamentals guarantee zero drawdowns while technicals guarantee daily wins',
        'Fundamentals help filter strong businesses ("what"), while technicals help time entries, stops, and exits ("when")',
        'Technical analysis replaces the need to check earnings dates',
        'Fundamental analysis only applies to cryptocurrencies',
      ],
      correctIndex: 1,
      rationale: 'Fundamentals identify business quality and catalysts; technical structure governs execution timing and invalidation.',
      commonTrap: 'Assuming a fundamentally great company cannot drop 40% during a bear market or valuation reset.',
    },
  },
  {
    id: 'topic-s3-2',
    code: 'S3.2',
    slug: 'stocks-s3-2-understanding-financial-statements',
    title: 'Understanding Financial Statements',
    overviewEn:
      'Public companies report financial health through three linked statements—the Income Statement, Balance Sheet, and Cash Flow Statement—filed quarterly (10-Q) and annually (10-K).',
    overviewTaglish:
      'Ipinapakita ng mga pampublikong kumpanya ang lagay ng kanilang pera sa tatlong magkakaugnay na ulat: Income Statement, Balance Sheet, at Cash Flow Statement kada quarter at kada taon.',
    objectives: [
      'Explain the distinct question each of the three financial statements answers.',
      'Understand how net income links the income statement to retained earnings and operating cash flow.',
      'Locate official audited filings (SEC EDGAR in the US, PSE EDGE in the Philippines).',
    ],
    keyPoints: [
      'Income Statement shows profitability over a period; Balance Sheet is a snapshot of assets vs. debt on one date.',
      'Cash Flow Statement tracks actual cash moving in and out—harder to dress up than accounting profit.',
      'Comparing at least 3–5 years of trends reveals far more than reading one isolated quarter.',
    ],
    practicalExample:
      'A company reports rising accounting profit on the Income Statement, yet its Cash Flow Statement shows shrinking cash because customers are not paying invoices on time.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.1'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why must an analyst read all three financial statements together instead of only checking Net Income?',
      options: [
        'Because exchanges hide revenue on the Balance Sheet',
        'Because accounting profit can look healthy even while debt swells on the Balance Sheet or actual cash drains on the Cash Flow Statement',
        'Because Net Income is only reported once every five years',
        'Because Balance Sheets predict next-day candlestick patterns',
      ],
      correctIndex: 1,
      rationale: 'Accrual accounting allows reported profits to diverge from cash reality and solvency risks.',
      commonTrap: 'Looking only at headline revenue growth while missing massive debt maturities on the balance sheet.',
    },
  },
  {
    id: 'topic-s3-3',
    code: 'S3.3',
    slug: 'stocks-s3-3-income-statements',
    title: 'Income Statements',
    overviewEn:
      'The Income Statement (Profit & Loss) tracks revenue at the top line, deducts cost of goods sold and operating expenses, and arrives at net income at the bottom line.',
    overviewTaglish:
      'Ipinapakita ng Income Statement ang kabuuang benta (revenue) sa itaas, ibinabawas ang gastos sa produkto at operasyon, hanggang makuha ang net income sa ibaba.',
    objectives: [
      'Trace top-line revenue down to gross profit, operating income (EBIT), and net income.',
      'Calculate gross margin and operating margin to spot pricing power and cost discipline.',
      'Spot one-time gains or losses that distort recurring core earnings.',
    ],
    keyPoints: [
      'Gross Margin = (Revenue − Cost of Goods Sold) ÷ Revenue; expanding margins often signal pricing power.',
      'Operating Income shows core business profitability before financing and tax distortions.',
      'Compare year-over-year (YoY) figures to remove seasonal distortions (e.g., holiday retail spikes).',
    ],
    practicalExample:
      'A software firm grows revenue 25% YoY while keeping gross margins at 78% and expanding operating margin from 12% to 18%—showing strong operating leverage.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.2'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why do analysts prefer Year-over-Year (YoY) comparisons over Quarter-over-Quarter (QoQ) for a retail store’s Income Statement?',
      options: [
        'YoY numbers are always larger',
        'YoY removes seasonal swings like Q4 holiday shopping spikes versus quieter Q1 sales',
        'QoQ reporting is illegal for retail corporations',
        'YoY ignores cost of goods sold',
      ],
      correctIndex: 1,
      rationale: 'Comparing Q1 against Q4 makes almost every retailer look like it is shrinking; comparing Q1 this year against Q1 last year gives an apples-to-apples view.',
      commonTrap: 'Being misled by a one-time asset sale boosting Net Income while core operating profit actually declined.',
    },
  },
  {
    id: 'topic-s3-4',
    code: 'S3.4',
    slug: 'stocks-s3-4-balance-sheets',
    title: 'Balance Sheets',
    overviewEn:
      'The Balance Sheet is a snapshot of what a company owns (Assets), what it owes (Liabilities), and the residual value belonging to owners (Shareholders’ Equity) at a specific reporting date.',
    overviewTaglish:
      'Ang Balance Sheet ay litrato ng pinansyal na lagay ng kumpanya sa isang petsa: ang pag-aari nito (Assets), mga utang (Liabilities), at natitirang halaga para sa shareholders (Equity).',
    objectives: [
      'Apply the accounting identity: Assets = Liabilities + Shareholders’ Equity.',
      'Evaluate short-term liquidity using the Current Ratio (Current Assets ÷ Current Liabilities).',
      'Spot balance-sheet red flags such as surging debt, bloated inventory, or ballooning goodwill.',
    ],
    keyPoints: [
      'Strong cash reserves versus low short-term debt help a company survive recessions without diluting shareholders.',
      'A Current Ratio consistently below 1.0 can signal near-term bill-paying stress outside certain subscription businesses.',
      'Check debt maturity schedules—refinancing debt at higher interest rates squeezes profits.',
    ],
    practicalExample:
      'Company X holds $5B cash and $1B total debt, whereas rival Company Y holds $400M cash and $6B debt due next year. During a credit crunch, Company X survives and gains market share.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.3'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which fundamental accounting equation must every Balance Sheet satisfy?',
      options: [
        'Revenue − Expenses = Assets',
        'Assets = Liabilities + Shareholders’ Equity',
        'Cash Flow = Share Price × Debt',
        'Liabilities = Assets + Net Income',
      ],
      correctIndex: 1,
      rationale: 'Every asset a company controls is financed either by borrowing (liabilities) or by owners’ capital and retained profits (equity).',
      commonTrap: 'Ignoring mounting short-term debt until the company announces an emergency dilutive share offering.',
    },
  },
  {
    id: 'topic-s3-5',
    code: 'S3.5',
    slug: 'stocks-s3-5-cash-flow-statements',
    title: 'Cash Flow Statements',
    overviewEn:
      'The Cash Flow Statement reconciles accounting profit with real cash generated or spent across three buckets: Operating, Investing, and Financing activities.',
    overviewTaglish:
      'Ipinapakita ng Cash Flow Statement ang totoong pasok at labas ng cash ng kumpanya sa tatlong kategorya: Operating, Investing, at Financing activities.',
    objectives: [
      'Distinguish Operating Cash Flow (OCF), Investing Cash Flow, and Financing Cash Flow.',
      'Explain why consistent positive Operating Cash Flow validates reported Net Income.',
      'Detect cash-burning firms that survive only by issuing new debt or diluting stock.',
    ],
    keyPoints: [
      'Operating Cash Flow measures cash produced by core business operations.',
      'Investing Cash Flow captures Capital Expenditures (CapEx), acquisitions, and asset sales.',
      'Financing Cash Flow shows debt issuance/repayment, dividends, share buybacks, and stock dilution.',
    ],
    practicalExample:
      'A fast-growing firm posts $50M Net Income but −$30M Operating Cash Flow because unpaid receivables jumped $80M—a clear sign to scrutinize revenue quality.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.4'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which section of the Cash Flow Statement tells you whether a company’s core day-to-day business is actually generating cash?',
      options: [
        'Financing Cash Flow',
        'Operating Cash Flow',
        'Goodwill Amortization Schedule',
        'Dividend Reinvestment Footnote',
      ],
      correctIndex: 1,
      rationale: 'Operating Cash Flow isolates real cash inflows and outflows from selling products and paying operating bills.',
      commonTrap: 'Confusing a rising cash balance funded by fresh stock dilution (Financing Cash Flow) with a profitable self-sustaining business.',
    },
  },
  {
    id: 'topic-s3-6',
    code: 'S3.6',
    slug: 'stocks-s3-6-earnings-per-share-eps',
    title: 'Earnings Per Share (EPS)',
    overviewEn:
      'Earnings Per Share (EPS) divides a company’s net profit attributable to common shareholders by its weighted average share count, tracking profit growth on a per-share basis.',
    overviewTaglish:
      'Ang Earnings Per Share (EPS) ay ang net profit ng kumpanya na hinati sa kabuuang shares, para makita kung magkano ang kinikita ng bawat isang share.',
    objectives: [
      'Differentiate Basic EPS from Diluted EPS (which includes stock options and convertible securities).',
      'Track quarterly and annual EPS acceleration as a core driver of institutional stock demand.',
      'Recognize how share buybacks can lift EPS even when total net income is flat.',
    ],
    keyPoints: [
      'Always focus on Diluted EPS to account for potential share issuance from employee options and warrants.',
      'Compare GAAP EPS (standard accounting) with Non-GAAP EPS (adjusted for stock-based compensation or one-offs).',
      'Accelerating EPS paired with growing revenue is stronger than EPS boosted solely by cost-cutting.',
    ],
    practicalExample:
      'A company earns $200M with 100M diluted shares ($2.00 EPS). Next year it earns $260M with 100M shares ($2.60 EPS, +30% YoY), attracting institutional growth buyers.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.5'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why do professional analysts rely on Diluted EPS rather than Basic EPS?',
      options: [
        'Diluted EPS excludes corporate taxes',
        'Diluted EPS reflects the conservative per-share profit if all options, warrants, and convertibles become shares',
        'Basic EPS is only published for private companies',
        'Diluted EPS is always higher than Basic EPS',
      ],
      correctIndex: 1,
      rationale: 'Diluted EPS accounts for future share count expansion so you do not overestimate your claim on profits.',
      commonTrap: 'Celebrating rising Non-GAAP EPS without noticing massive recurring stock-based compensation excluded by management.',
    },
  },
  {
    id: 'topic-s3-7',
    code: 'S3.7',
    slug: 'stocks-s3-7-price-to-earnings-ratio-pe',
    title: 'Price-to-Earnings Ratio (P/E)',
    overviewEn:
      'The Price-to-Earnings (P/E) ratio divides a stock’s share price by its Earnings Per Share, showing how many dollars investors are currently willing to pay for $1 of annual earnings.',
    overviewTaglish:
      'Ang Price-to-Earnings (P/E) ratio ay presyo ng stock hinati sa EPS—ipinapakita nito kung ilang dolyar o piso ang handang bayaran ng merkado para sa bawat 1 unit ng taunang kita.',
    objectives: [
      'Compare Trailing P/E (past 12 months) against Forward P/E (analyst consensus next 12 months).',
      'Contextualize P/E against industry peers, growth rate (PEG ratio), and interest rates.',
      'Understand why cyclical companies look deceptively cheap (low P/E) right at earnings peaks.',
    ],
    keyPoints: [
      'P/E = Share Price ÷ EPS. A $60 stock with $3.00 EPS trades at a 20x P/E.',
      'High-growth software firms naturally trade at higher P/E multiples than mature banks or utilities.',
      'P/E is meaningless for unprofitable companies (negative EPS); use Price-to-Sales or EV/Revenue carefully instead.',
    ],
    limitationsNote: 'P/E alone cannot time entries—expensive stocks can stay expensive during bull runs, and cheap P/E stocks can fall further if earnings drop.',
    practicalExample:
      'A commodity miner trades at a 4x P/E at the peak of a boom because the market expects next year’s profits to collapse by 70%—not because it is an easy bargain.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.6'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why can a cyclical company (like an airline or steel maker) have a very LOW P/E ratio right near a market top?',
      options: [
        'Because low P/E always guarantees immediate upward breakouts',
        'Because peak-cycle earnings are temporarily inflated while the market anticipates lower profits ahead',
        'Because exchanges cap cyclical P/E ratios at 5x',
        'Because cyclical companies never report EPS',
      ],
      correctIndex: 1,
      rationale: 'Trailing earnings peak at the top of an economic cycle; investors price the stock lower in anticipation of the coming earnings contraction.',
      commonTrap: 'Comparing a tech company’s 35x P/E directly against a utility’s 12x P/E without adjusting for growth and sector norms.',
    },
  },
  {
    id: 'topic-s3-8',
    code: 'S3.8',
    slug: 'stocks-s3-8-price-to-book-ratio-pb',
    title: 'Price-to-Book Ratio (P/B)',
    overviewEn:
      'The Price-to-Book (P/B) ratio compares a stock’s market price to its accounting book value (net assets) per share, making it especially useful for banks, insurers, and asset-heavy businesses.',
    overviewTaglish:
      'Inihahambing ng Price-to-Book (P/B) ratio ang presyo ng stock sa net asset value (book value) bawat share—pinakakapaki-pakinabang ito sa mga bangko, insurance, at property stocks.',
    objectives: [
      'Compute Book Value per Share = (Total Assets − Total Liabilities) ÷ Shares Outstanding.',
      'Identify sectors where P/B is meaningful (banks, REITs, industrials) versus less relevant (asset-light SaaS).',
      'Connect P/B with Return on Equity (ROE) to judge whether a discount to book is justified.',
    ],
    keyPoints: [
      'A P/B below 1.0 means the market values the business below its accounting net asset value.',
      'Asset-light tech firms hold value in code and brands not captured on the balance sheet, so high P/B is normal.',
      'For banks, a chronically low P/B often signals poor ROE or hidden loan-loss concerns.',
    ],
    practicalExample:
      'A regional bank with $20 book value per share trades at $16 (0.8x P/B) because investors worry about commercial real estate loan write-downs.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.7'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'For which type of business is the Price-to-Book (P/B) ratio MOST informative?',
      options: [
        'An early-stage cloud software company with mostly intangible code',
        'Banks, insurers, and real estate firms whose balance sheets reflect tangible financial or property assets',
        'Pre-revenue biotech startups',
        'Social media influencers',
      ],
      correctIndex: 1,
      rationale: 'Financial and asset-heavy firms carry mark-to-market or tangible assets where book value closely anchors liquidation and earning capacity.',
      commonTrap: 'Rejecting a high-ROE software leader just because its P/B ratio is 15x.',
    },
  },
  {
    id: 'topic-s3-9',
    code: 'S3.9',
    slug: 'stocks-s3-9-return-on-equity-roe',
    title: 'Return on Equity (ROE)',
    overviewEn:
      'Return on Equity (ROE) measures how efficiently management generates net profit from shareholders’ equity capital, serving as a key gauge of business quality.',
    overviewTaglish:
      'Sinusukat ng Return on Equity (ROE) kung gaano kahusay magpalago ng kita ang kumpanya gamit ang puhunan ng shareholders—isa itong mahalagang sukatan ng kalidad ng negosyo.',
    objectives: [
      'Calculate ROE = Net Income ÷ Average Shareholders’ Equity.',
      'Decompose ROE using DuPont logic: profit margin, asset efficiency, and financial leverage.',
      'Detect artificially inflated ROE caused by excessive debt or aggressive buybacks.',
    ],
    keyPoints: [
      'Sustained ROE above 15% with modest debt often signals a durable competitive advantage.',
      'High ROE driven by heavy borrowing increases bankruptcy risk during recessions.',
      'Pair ROE with Return on Invested Capital (ROIC) to evaluate both debt and equity capital fairly.',
    ],
    practicalExample:
      'Firm A achieves 22% ROE with zero debt and 25% profit margins; Firm B achieves 22% ROE with thin 4% margins and massive debt. Firm A is dramatically higher quality.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.8'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why should you always inspect debt levels alongside a very high Return on Equity (ROE)?',
      options: [
        'Because ROE ignores net income completely',
        'Because heavy financial leverage shrinks the equity base and can artificially inflate ROE while raising solvency risk',
        'Because companies with high ROE cannot pay dividends',
        'Because debt is counted as revenue',
      ],
      correctIndex: 1,
      rationale: 'Since Equity = Assets − Liabilities, piling on debt shrinks the denominator and boosts ROE superficially.',
      commonTrap: 'Screening for the top ROE stocks without checking Debt-to-Equity and landing in over-leveraged balance sheets.',
    },
  },
  {
    id: 'topic-s3-10',
    code: 'S3.10',
    slug: 'stocks-s3-10-debt-to-equity-ratio',
    title: 'Debt-to-Equity Ratio',
    overviewEn:
      'The Debt-to-Equity (D/E) ratio compares total financial debt to shareholders’ equity, revealing how aggressively a company uses borrowed money to finance operations.',
    overviewTaglish:
      'Ipinapakita ng Debt-to-Equity (D/E) ratio kung gaano kalaki ang utang ng kumpanya kumpara sa sarili nitong kapital—malaking tulong ito para masukat ang solvency risk.',
    objectives: [
      'Calculate Debt-to-Equity = Total Debt ÷ Shareholders’ Equity.',
      'Compare D/E strictly within the same industry (utilities and telecoms naturally carry more debt than tech).',
      'Check Interest Coverage Ratio (Operating Income ÷ Interest Expense) to verify debt serviceability.',
    ],
    keyPoints: [
      'Moderate debt can amplify returns when borrowing rates are below business returns; excessive debt kills during downturns.',
      'Interest Coverage below 2x signals thin safety margin if revenue dips or borrowing rates reset higher.',
      'Always examine Net Debt (Total Debt − Cash) to see true leverage burden.',
    ],
    practicalExample:
      'A telecom with 1.6 D/E and stable recurring subscriber cash flow may be manageable, whereas a cyclical restaurant chain with 2.5 D/E faces severe strain during a consumer slowdown.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.9'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Which companion metric best shows whether a company can comfortably pay the interest on its existing debt?',
      options: [
        'Price-to-Sales Ratio',
        'Interest Coverage Ratio (Operating Income ÷ Interest Expense)',
        'Daily Relative Volume',
        'Stock Split Ratio',
      ],
      correctIndex: 1,
      rationale: 'Interest Coverage measures how many times core operating profits cover annual interest obligations.',
      commonTrap: 'Assuming a 1.5 Debt-to-Equity ratio is automatically bad across every sector without comparing industry cash-flow stability.',
    },
  },
  {
    id: 'topic-s3-11',
    code: 'S3.11',
    slug: 'stocks-s3-11-free-cash-flow',
    title: 'Free Cash Flow',
    overviewEn:
      'Free Cash Flow (FCF) is the cash left over after a company pays operating bills and maintains or expands its physical assets (Capital Expenditures)—the true cash engine available for growth, buybacks, or dividends.',
    overviewTaglish:
      'Ang Free Cash Flow (FCF) ay ang natitirang totoong cash pagkatapos bayaran ang operasyon at Capital Expenditures (CapEx)—ito ang tunay na cash na puwedeng gamitin sa pagpapalaki, pagbabayad ng utang, o dividends.',
    objectives: [
      'Calculate Free Cash Flow = Operating Cash Flow − Capital Expenditures (CapEx).',
      'Compute Free Cash Flow Yield (FCF ÷ Market Cap) to gauge cash valuation.',
      'Distinguish temporary growth CapEx investments from chronic cash-burning operations.',
    ],
    keyPoints: [
      'FCF is harder to manipulate than Net Income because real cash cannot be conjured by accounting estimates.',
      'Growing FCF per share over several years is one of the strongest indicators of durable equity compounding.',
      'Watch out for companies reporting positive FCF only because they pay employees heavily in dilutive stock.',
    ],
    practicalExample:
      'A business generates $1.2B in Operating Cash Flow and spends $300M on equipment CapEx, leaving $900M in Free Cash Flow to retire debt and fund dividends.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.10'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'How is Free Cash Flow (FCF) calculated from the Cash Flow Statement?',
      options: [
        'Net Income + Total Debt',
        'Operating Cash Flow − Capital Expenditures (CapEx)',
        'Gross Revenue − Marketing Expense',
        'Cash on Hand ÷ Shares Outstanding',
      ],
      correctIndex: 1,
      rationale: 'Free Cash Flow deducts capital spending required to run and expand assets from cash generated by operations.',
      commonTrap: 'Treating Operating Cash Flow as completely free to spend while ignoring massive recurring factory or server CapEx.',
    },
  },
  {
    id: 'topic-s3-12',
    code: 'S3.12',
    slug: 'stocks-s3-12-company-valuation',
    title: 'Company Valuation',
    overviewEn:
      'Company valuation estimates a reasonable price range for a business using relative peer multiples (P/E, EV/EBITDA, P/S) and intrinsic cash-flow frameworks like Discounted Cash Flow (DCF).',
    overviewTaglish:
      'Ang company valuation ay pagtantya ng makatwirang presyo ng isang negosyo gamit ang peer multiples (P/E, EV/EBITDA) at intrinsic models tulad ng Discounted Cash Flow (DCF).',
    objectives: [
      'Compare relative valuation (peer multiples) with intrinsic valuation (DCF).',
      'Explain Enterprise Value (EV = Market Cap + Debt − Cash) and why it beats Market Cap for comparing indebted peers.',
      'Apply a margin of safety because valuation models depend heavily on uncertain future assumptions.',
    ],
    keyPoints: [
      'Valuation produces a sensible range, never a single magical exact dollar figure.',
      'Small changes in DCF growth or discount-rate assumptions shift estimated fair value dramatically.',
      'Enterprise Value reflects the true takeover cost of a business including its net debt.',
    ],
    limitationsNote: 'Valuation models are analytical frameworks—market sentiment can keep a stock above or below estimated fair value for long periods.',
    practicalExample:
      'Two peers both have $10B market cap, but Peer B also carries $5B net debt (EV $15B). Comparing EV/EBITDA immediately reveals Peer B is 50% pricier on an enterprise basis.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.11'],
    estimatedMinutes: 10,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why is Enterprise Value (EV) often more accurate than Market Cap when comparing two companies with very different debt levels?',
      options: [
        'EV ignores the current stock price',
        'EV includes total debt and subtracts cash, reflecting the full capital structure needed to buy the business',
        'EV is regulated by the stock exchange daily',
        'EV always produces a lower valuation multiple',
      ],
      correctIndex: 1,
      rationale: 'Market Cap measures only equity, whereas Enterprise Value accounts for debt obligations assumed and cash acquired.',
      commonTrap: 'Treating a DCF spreadsheet output ($142.37) as an exact future price target rather than a sensitive estimate.',
    },
  },
  {
    id: 'topic-s3-13',
    code: 'S3.13',
    slug: 'stocks-s3-13-earnings-reports',
    title: 'Earnings Reports',
    overviewEn:
      'Quarterly earnings reports reveal actual EPS, revenue, margins, and forward management guidance—frequently triggering the largest single-session gaps and trend starts in stocks.',
    overviewTaglish:
      'Ang quarterly earnings report ay naglalabas ng aktwal na EPS, revenue, at forward guidance ng management—madalas itong pinagmumulan ng malalaking gap at bagong trend sa stocks.',
    objectives: [
      'Explain why forward guidance often moves a stock more than backward-looking EPS beats.',
      'Understand "priced-in expectations" and why a stock can fall after beating consensus estimates.',
      'Always verify upcoming earnings dates before opening a swing trade to avoid blind binary gap risk.',
    ],
    keyPoints: [
      'Markets trade expectations: beating EPS by 2% while lowering next-quarter guidance usually causes a sell-off.',
      'Earnings reactions often spark multi-week Post-Earnings Announcement Drift (PEAD) in the gap direction.',
      'Holding oversized swing positions blindly through earnings is effectively a coin-flip volatility gamble.',
    ],
    practicalExample:
      'A semiconductor company beats Q3 EPS by 5%, yet shares drop −11% after-hours because management guides Q4 revenue below Wall Street expectations.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.12'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'stocks-earnings-relative-strength',
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'Why can a stock drop −10% immediately after reporting better-than-expected quarterly EPS?',
      options: [
        'Because exchanges penalize profitable companies',
        'Because management issued weaker forward guidance or expectations were already priced in',
        'Because positive EPS triggers automatic short-selling bans',
        'Because dividends are cancelled on earnings day',
      ],
      correctIndex: 1,
      rationale: 'Equity prices discount future cash flows; softer forward guidance or decelerating growth outweighs a backward-looking beat.',
      commonTrap: 'Entering a swing trade two days before earnings without checking the earnings calendar and taking an unplanned −15% overnight gap.',
    },
  },
  {
    id: 'topic-s3-14',
    code: 'S3.14',
    slug: 'stocks-s3-14-evaluating-company-management',
    title: 'Evaluating Company Management',
    overviewEn:
      'Evaluating management means checking capital allocation skill, execution credibility against past guidance, insider alignment, and corporate governance integrity.',
    overviewTaglish:
      'Sa pagsusuri sa management, tinitingnan ang tamang paggamit ng kapital, kung natutupad nila ang mga pangako sa guidance, insider alignment, at malinis na corporate governance.',
    objectives: [
      'Assess capital allocation choices: reinvestment, smart acquisitions, debt paydown, buybacks, and dividends.',
      'Compare management’s prior-year promises against delivered financial outcomes.',
      'Spot governance red flags such as frequent CFO turnover, related-party deals, or constant dilution.',
    ],
    keyPoints: [
      'Great management allocates capital to high-return projects rather than empire-building overpriced acquisitions.',
      'Consistent under-promising and over-delivering builds institutional trust and valuation stability.',
      'High insider ownership aligns executives with long-term shareholders, though watch dual-class voting control.',
    ],
    practicalExample:
      'A CEO repeatedly buys back shares at peak valuations using borrowed debt while missing revenue targets three quarters straight—warning signs of poor capital discipline.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.13'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which signal is a serious governance red flag when evaluating company management?',
      options: [
        'Returning excess cash via steady dividends when reinvestment opportunities are modest',
        'Frequent unexplained CFO resignations, restatements, and repeated missed guidance',
        'Holding quarterly earnings conference calls with Q&A',
        'Publishing clear long-term capital allocation priorities',
      ],
      correctIndex: 1,
      rationale: 'Sudden finance leadership turnover and accounting restatements often warn of deeper operational or reporting problems.',
      commonTrap: 'Falling for charismatic CEO interviews while ignoring repeated share dilution and missed targets.',
    },
  },

  // =========================================================================
  // MODULE S4 — Industry and Market Analysis (S4.1 – S4.10)
  // =========================================================================
  {
    id: 'topic-s4-1',
    code: 'S4.1',
    slug: 'stocks-s4-1-sector-analysis',
    title: 'Sector Analysis',
    overviewEn:
      'Sector analysis classifies equities into 11 standardized GICS sectors—such as Technology, Financials, Healthcare, Energy, and Consumer Staples—so traders focus capital where institutional tailwinds are strongest.',
    overviewTaglish:
      'Hinahati ng sector analysis ang mga stocks sa 11 pangunahing GICS sectors tulad ng Technology, Financials, at Energy para mailagay ang focus sa mga sektor na malakas ang institutional demand.',
    objectives: [
      'Differentiate cyclical sectors (Technology, Industrials, Consumer Discretionary) from defensive sectors (Utilities, Staples, Healthcare).',
      'Compare sector ETF performance (e.g., XLK, XLF, XLE) against the broad S&P 500 to spot leadership.',
      'Align individual stock longs with leading sectors and avoid weak lagging groups.',
    ],
    keyPoints: [
      'Roughly half of a stock’s directional move is tied to its broader sector and industry group.',
      'Leading stocks in leading sectors offer cleaner trend continuation than isolated laggards.',
      'Defensive sectors often outperform when economic growth slows or recession fears rise.',
    ],
    practicalExample:
      'When Semiconductors (SMH) outperform the S&P 500 by +12% over a month, breakouts in top chip leaders carry much higher follow-through than breakouts in lagging Utilities.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S3.14'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'stocks-earnings-relative-strength',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'Why do experienced equity traders check sector relative strength before buying an individual stock breakout?',
      options: [
        'Because exchanges forbid buying stocks in lagging sectors',
        'Because stocks heavily correlate with their sector—institutional inflows into a leading sector create a strong tailwind',
        'Because sector ETFs eliminate all stop-loss risk',
        'Because lagging sectors never experience volatility',
      ],
      correctIndex: 1,
      rationale: 'Institutional funds allocate by sector first; trading the strongest names inside leading sectors aligns you with capital flows.',
      commonTrap: 'Buying the weakest "cheap" stock in a hot sector thinking it will catch up, when institutions are actually concentrating in the top leader.',
    },
  },
  {
    id: 'topic-s4-2',
    code: 'S4.2',
    slug: 'stocks-s4-2-industry-trends',
    title: 'Industry Trends',
    overviewEn:
      'Within each broad sector sit specific industries driven by multi-year secular shifts (like cloud computing or grid modernization) and cyclical supply-demand waves.',
    overviewTaglish:
      'Sa loob ng bawat sektor ay may mas tiyak na industriya na hinihila ng pangmatagalang secular trends o paulit-ulit na cyclical supply-demand cycles.',
    objectives: [
      'Distinguish secular multi-year industry growth from short-term cyclical booms.',
      'Identify supply-chain beneficiaries ("picks and shovels") alongside headline brands.',
      'Recognize industry saturation and margin compression when competition floods in.',
    ],
    keyPoints: [
      'Secular trends compound across economic cycles; cyclical industries boom and bust with commodity or credit cycles.',
      'Tracking industry-wide capacity, pricing, and regulation warns of turning points early.',
      'Watch when multiple competitors simultaneously raise or cut revenue forecasts—that signals an industry-wide shift.',
    ],
    practicalExample:
      'When three major logistics carriers all cite rising freight volumes and firmer shipping rates in the same month, it signals an industry-wide demand inflection rather than a one-company fluke.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.1'],
    estimatedMinutes: 8,
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'What separates a secular industry trend from a cyclical industry trend?',
      options: [
        'Secular trends only last two trading sessions',
        'Secular trends reflect structural multi-year adoption shifts, while cyclical trends rise and fall with economic or commodity cycles',
        'Cyclical industries never experience recessions',
        'Secular trends occur only outside the United States',
      ],
      correctIndex: 1,
      rationale: 'Secular shifts transform long-term demand patterns, whereas cyclical industries oscillate with macro expansion and contraction.',
      commonTrap: 'Extrapolating peak cyclical margins (e.g., shipping or memory chips) forever as if they were permanent secular growth.',
    },
  },
  {
    id: 'topic-s4-3',
    code: 'S4.3',
    slug: 'stocks-s4-3-competitive-advantages',
    title: 'Competitive Advantages',
    overviewEn:
      'A competitive advantage allows a company to consistently earn higher returns on capital than rivals through superior cost structure, differentiated technology, brand trust, or distribution scale.',
    overviewTaglish:
      'Ang competitive advantage ay ang kalamangan ng kumpanya laban sa mga kakumpitensya—gaya ng mas mababang gastos, mas matibay na brand, o mas malawak na distribution—na nagpapanatili ng mataas na kita.',
    objectives: [
      'Identify verifiable financial evidence of competitive advantage: high gross margins and stable market share.',
      'Contrast temporary first-mover hype with sustainable operational advantages.',
      'Spot signs of eroding advantage: heavy discounting, rising customer churn, or shrinking margins.',
    ],
    keyPoints: [
      'True competitive advantage shows up in pricing power—the ability to raise prices without losing customers.',
      'Fast growth without differentiation invites competitors to copy the model and crush margins.',
      'Check competitor earnings calls to hear whether rivals are gaining or losing ground.',
    ],
    practicalExample:
      'A payment network processes transactions at minimal incremental cost while competitors struggle to match its merchant acceptance, sustaining >50% operating margins for decades.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.2'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which financial pattern is the strongest proof that a company holds a real competitive advantage?',
      options: [
        'Frequent press releases announcing new slogans',
        'Sustained high margins and Return on Equity/ROIC above industry peers over multiple years',
        'A low share price under $5',
        'Constantly issuing new shares to pay operating bills',
      ],
      correctIndex: 1,
      rationale: 'Durable competitive advantages protect profitability from rivals, showing up numerically in superior margins and returns on capital.',
      commonTrap: 'Mistaking temporary viral product popularity for a permanent competitive advantage.',
    },
  },
  {
    id: 'topic-s4-4',
    code: 'S4.4',
    slug: 'stocks-s4-4-economic-moats',
    title: 'Economic Moats',
    overviewEn:
      'An economic moat is a structural barrier—such as network effects, high switching costs, proprietary patents, or scale economies—that shields a company’s profits from competition over the long run.',
    overviewTaglish:
      'Ang economic moat ay malalim na proteksyon ng negosyo—tulad ng network effects, mataas na switching cost, patents, o scale—na pumipigil sa mga kakumpitensya na agawin ang kita nito.',
    objectives: [
      'Classify the five classic moat sources: network effects, switching costs, intangible assets, cost advantage, and efficient scale.',
      'Distinguish wide-moat compounders from no-moat commodity producers.',
      'Monitor technological disruption that can unexpectedly breach once-wide moats.',
    ],
    keyPoints: [
      'Network effects make a platform more valuable as each new user joins (e.g., card networks, exchanges).',
      'High switching costs keep enterprise customers locked into mission-critical software even during price increases.',
      'No moat lasts forever—even former giants can erode if they fail to adapt to technological shifts.',
    ],
    practicalExample:
      'Hospital networks rarely rip out core electronic health record software because retraining thousands of staff and migrating data carries massive switching costs and operational risk.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.3'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which example best illustrates a "switching cost" economic moat?',
      options: [
        'A corner coffee shop offering a one-week discount coupon',
        'Enterprise accounting software deeply integrated into a corporation’s payroll, compliance, and workflows',
        'A gold mining company selling bullion at global spot prices',
        'An airline launching a seasonal holiday route',
      ],
      correctIndex: 1,
      rationale: 'Replacing deeply embedded enterprise software is costly, risky, and time-consuming, allowing the vendor to retain clients and defend margins.',
      commonTrap: 'Assuming a big brand name automatically equals a wide moat even when customers can switch in one click for free.',
    },
  },
  {
    id: 'topic-s4-5',
    code: 'S4.5',
    slug: 'stocks-s4-5-institutional-ownership',
    title: 'Institutional Ownership',
    overviewEn:
      'Institutional ownership tracks the percentage of a stock’s shares held by mutual funds, pension funds, hedge funds, and ETFs—revealing where large, sticky pools of capital are positioned.',
    overviewTaglish:
      'Sinusukat ng institutional ownership ang porsyento ng shares na hawak ng malalaking mutual funds, pension funds, at ETFs—ipinapakita nito kung saan nakapwesto ang malalaking kapital.',
    objectives: [
      'Interpret institutional ownership trends across quarterly 13F filings.',
      'Understand why rising fund sponsorship supports multi-quarter uptrends, while crowded ownership risks sharp exits.',
      'Recognize that 13F filings are delayed by up to 45 days after quarter-end.',
    ],
    keyPoints: [
      'Steady increases in the number of quality funds owning a stock confirm institutional accumulation.',
      'Stocks with extremely low institutional interest (<5%) often lack sustained sponsorship to trend smoothly.',
      'Because 13F data is lagging, combine it with live price-volume accumulation footprints on weekly charts.',
    ],
    limitationsNote: '13F disclosures report quarter-end long positions up to 45 days late—a fund may already have trimmed by the time the filing becomes public.',
    practicalExample:
      'A mid-cap industrial stock grows from 180 to 310 institutional fund holders over four quarters while forming higher weekly lows on strong volume.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.4'],
    estimatedMinutes: 8,
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'What is a key limitation of copying famous hedge fund trades solely from quarterly SEC 13F filings?',
      options: [
        '13F filings are completely fake marketing documents',
        '13F filings are delayed up to 45 days after quarter-end and omit short positions and exit prices',
        '13F filings only cover cryptocurrency tokens',
        'Hedge funds are prohibited from owning publicly traded stocks',
      ],
      correctIndex: 1,
      rationale: 'By the time a 13F is released, the fund may have bought months earlier at far lower prices or already exited.',
      commonTrap: 'Blindly buying a stock because a famous billionaire’s 13F showed a stake, without checking current price structure or stop-loss risk.',
    },
  },
  {
    id: 'topic-s4-6',
    code: 'S4.6',
    slug: 'stocks-s4-6-insider-transactions',
    title: 'Insider Transactions',
    overviewEn:
      'Insider transactions track legal open-market share purchases and sales by executives, board directors, and 10%+ owners—disclosed publicly via filings such as SEC Form 4.',
    overviewTaglish:
      'Ang insider transactions ay legal na pagbili o pagbenta ng shares ng executives at board directors ng kumpanya—kailangang i-disclose ito sa publiko gaya ng SEC Form 4.',
    objectives: [
      'Explain why open-market cluster buying by multiple insiders is generally more informative than routine insider selling.',
      'Differentiate discretionary open-market buys from automatic 10b5-1 scheduled sales and stock option grants.',
      'Avoid treating insider buys as an immediate price-bottom guarantee.',
    ],
    keyPoints: [
      'Insiders sell stock for many benign reasons (taxes, diversification, tuition), but open-market cash buying usually happens for one reason: belief the shares are undervalued.',
      'Cluster buying—several officers buying with personal cash around similar prices—carries stronger weight than a single tiny trade.',
      'Insiders can still be early; always align entries with price stabilization and defined risk.',
    ],
    practicalExample:
      'After a 35% stock pullback, the CEO, CFO, and two directors purchase $2.5M combined on the open market—prompting traders to place the ticker on their bottoming-base watchlist.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.5'],
    estimatedMinutes: 8,
    diagramKind: 'support_demand',
    quiz: {
      prompt: 'Why is an open-market stock purchase by a company’s CEO and CFO generally more meaningful than a scheduled executive sale?',
      options: [
        'Because executive sales are illegal',
        'Because executives sell routinely for taxes and diversification, whereas spending personal cash on the open market signals strong internal confidence',
        'Because insider buying guarantees the stock cannot drop again',
        'Because scheduled sales automatically cancel dividends',
      ],
      correctIndex: 1,
      rationale: 'Discretionary open-market purchases put executives’ own money at risk, while scheduled 10b5-1 sales are often routine compensation liquidation.',
      commonTrap: 'Panicking over a routine pre-scheduled 10b5-1 CEO sale that represents only 2% of their total holdings.',
    },
  },
  {
    id: 'topic-s4-7',
    code: 'S4.7',
    slug: 'stocks-s4-7-analyst-ratings',
    title: 'Analyst Ratings',
    overviewEn:
      'Sell-side Wall Street and brokerage analysts publish Buy/Hold/Sell ratings, earnings estimates, and 12-month price targets that move short-term stock sentiment—yet carry structural biases and lag major turns.',
    overviewTaglish:
      'Naglalabas ang brokerage analysts ng Buy/Hold/Sell ratings at price targets na nakakapagpagalaw ng presyo sa maikling panahon, ngunit madalas may bias at huli na sa malalaking pagliko.',
    objectives: [
      'Use analyst estimate revisions (upward/downward EPS changes) rather than static Buy/Sell labels.',
      'Recognize conflicts of interest and herd behavior in sell-side ratings.',
      'Treat upgrades and downgrades as volatility catalysts rather than blind trade signals.',
    ],
    keyPoints: [
      'Sell-side ratings skew heavily toward "Buy" because investment banks seek corporate advisory relationships.',
      'Upward earnings estimate revisions across multiple analysts often matter more than a single price target.',
      'Price targets frequently chase price upward after rallies and cut targets only after steep declines.',
    ],
    limitationsNote: 'Never buy or sell solely because of a single brokerage upgrade or price target—always verify fundamentals and chart risk.',
    practicalExample:
      'A stock gaps +5% pre-market on a major bank upgrade, hits overhead daily resistance at the open, and fades back to flat as institutions use the retail liquidity to trim.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.6'],
    estimatedMinutes: 8,
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'What is generally the MOST useful piece of data inside Wall Street analyst reports?',
      options: [
        'A single bold 12-month target price headline',
        'The direction of broad consensus earnings estimate revisions and underlying business assumptions',
        'The color of the report cover page',
        'Assuming every "Buy" rating guarantees zero downside',
      ],
      correctIndex: 1,
      rationale: 'Consensus EPS and revenue estimate revisions track whether institutional expectations are steadily improving or deteriorating.',
      commonTrap: 'Chasing an opening gap after a flashy upgrade right into heavy institutional profit-taking.',
    },
  },
  {
    id: 'topic-s4-8',
    code: 'S4.8',
    slug: 'stocks-s4-8-earnings-season',
    title: 'Earnings Season',
    overviewEn:
      'Earnings season occurs four times a year (typically starting mid-January, mid-April, mid-July, and mid-October) when most public corporations report quarterly results, driving peak market dispersion and catalysts.',
    overviewTaglish:
      'Ang earnings season ay nangyayari apat na beses bawat taon kapag sabay-sabay na naglalabas ng quarterly results ang mga kumpanya—dito lumalabas ang pinakamalalaking catalyst at galaw ng stocks.',
    objectives: [
      'Map the four annual US earnings seasons and how big banks kick off each reporting cycle.',
      'Watch sympathy moves—how a leader’s earnings ripple across peers and suppliers.',
      'Tighten portfolio exposure or avoid holding oversized swing positions into binary report dates.',
    ],
    keyPoints: [
      'Earnings season creates genuine fundamental catalysts that power multi-week institutional repricing.',
      'Sympathy reactions occur when Company A’s blowout results lift or sink competitor Company B before B reports.',
      'Track earnings dates on your watchlist daily so no surprise after-hours release catches you off guard.',
    ],
    practicalExample:
      'When a major cloud hyperscaler reports surging AI server spending, semiconductor and cooling-hardware suppliers rally in sympathy on elevated RVOL.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.7'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'stocks-earnings-relative-strength',
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'What is a "sympathy move" during earnings season?',
      options: [
        'A broker waiving commissions for losing traders',
        'A related peer or supplier stock moving sharply in response to a sector leader’s earnings release',
        'A stock halting trading for one full month',
        'An automatic dividend bonus paid to shareholders',
      ],
      correctIndex: 1,
      rationale: 'Because sector leaders reveal industry-wide demand trends, peers and suppliers often reprice immediately on that information.',
      commonTrap: 'Assuming a sympathy spike will hold permanently even if the peer later reports weak individual results.',
    },
  },
  {
    id: 'topic-s4-9',
    code: 'S4.9',
    slug: 'stocks-s4-9-news-and-corporate-events',
    title: 'News and Corporate Events',
    overviewEn:
      'Scheduled and unscheduled corporate events—mergers and acquisitions (M&A), FDA approvals, secondary share offerings, buybacks, and product launches—can reprice a stock instantly.',
    overviewTaglish:
      'Ang mga corporate events tulad ng mergers & acquisitions (M&A), FDA approvals, share offerings, at buybacks ay puwedeng biglang magpabago ng presyo ng stock sa loob lang ng ilang minuto.',
    objectives: [
      'Classify bullish catalysts (buybacks, contract wins, regulatory approvals) versus bearish shocks (dilutive offerings, SEC probes, guidance cuts).',
      'Explain why secondary share offerings usually trigger immediate selling pressure via dilution.',
      'Recognize "buy the rumor, sell the news" exhaustion around widely anticipated events.',
    ],
    keyPoints: [
      'In an acquisition, the target company usually jumps toward the buyout price while the acquirer often dips if paying heavily.',
      'Secondary offerings increase share count at a discount, frequently crushing retail chasers in small-cap runners.',
      'Always read the primary press release or filing—not just a sensationalized social media headline.',
    ],
    practicalExample:
      'A small-cap biotech rallies +60% on positive trial news, then announces a discounted secondary share offering after the close to raise cash—gapping down −30% the next morning.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.8'],
    estimatedMinutes: 9,
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'Why does a sudden discounted "secondary share offering" usually push a stock’s price sharply lower?',
      options: [
        'It reduces the number of shares on the exchange',
        'It dilutes existing shareholders by adding new supply of shares below recent market prices',
        'It forces the company to go private immediately',
        'It doubles the annual dividend rate',
      ],
      correctIndex: 1,
      rationale: 'Issuing fresh shares below market price expands supply and reduces each existing share’s claim on future earnings.',
      commonTrap: 'Holding parabolic low-float small-cap runners overnight without realizing cash-strapped companies routinely issue dilutive offerings into spikes.',
    },
  },
  {
    id: 'topic-s4-10',
    code: 'S4.10',
    slug: 'stocks-s4-10-macroeconomic-impact-on-stocks',
    title: 'Macroeconomic Impact on Stocks',
    overviewEn:
      'Macroeconomic forces—central bank interest rates, inflation (CPI), GDP growth, employment data, and bond yields—set the valuation backdrop and liquidity tide for the entire stock market.',
    overviewTaglish:
      'Ang macroeconomic forces tulad ng interest rates ng central bank, inflation (CPI), employment data, at bond yields ang nagtatakda ng pangkalahatang klima at valuation ng buong stock market.',
    objectives: [
      'Explain why rising interest rates and Treasury yields pressure high-multiple growth stock valuations.',
      'Track high-impact US macro releases (FOMC rate decisions, CPI, Non-Farm Payrolls) in PH time.',
      'Adapt aggressiveness to the macro regime—tighter risk during tightening cycles, wider trend focus during easing cycles.',
    ],
    keyPoints: [
      'Higher risk-free bond yields compete with equities for capital and lower the present value of distant future profits.',
      'Inflation surprises shift central bank rate expectations instantly, moving index futures and stocks across all sectors.',
      'You do not need to predict macro numbers—respect scheduled release times and observe how indices react.',
    ],
    practicalExample:
      'A hotter-than-expected US CPI release at 8:30 AM ET (8:30 PM PHT in DST) sends 10-year Treasury yields jumping 15 bps and triggers broad selling across NASDAQ tech stocks.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S4.9'],
    estimatedMinutes: 9,
    diagramKind: 'market_sessions',
    quiz: {
      prompt: 'Why do long-duration growth stocks tend to sell off when central banks hike interest rates aggressively?',
      options: [
        'Because higher rates outlaw technology IPOs',
        'Because higher discount rates reduce the present value of distant future earnings and make safe bonds more competitive',
        'Because growth stocks are priced in gold',
        'Because interest rates only affect dividend stocks',
      ],
      correctIndex: 1,
      rationale: 'Growth companies derive much of their valuation from profits expected years ahead; higher interest rates discount those future cash flows more heavily.',
      commonTrap: 'Holding high-beta intraday stock trades blindly right through an FOMC rate announcement or CPI release.',
    },
  },

  // =========================================================================
  // MODULE S5 — Advanced Stock Trading (S5.1 – S5.10)
  // =========================================================================
  {
    id: 'topic-s5-1',
    code: 'S5.1',
    slug: 'stocks-s5-1-growth-vs-value-trading',
    title: 'Growth vs. Value Trading',
    overviewEn:
      'Active equity traders choose between trading high-velocity growth leaders breaking to new highs and mean-reverting or turnaround value stocks re-rating from depressed multiples—matching style to market regime.',
    overviewTaglish:
      'Pumipili ang active equity traders sa pagitan ng mabilis gumalaw na growth leaders o value turnaround stocks—at mahalagang iayon ang estilo sa kasalukuyang market regime.',
    objectives: [
      'Contrast trade mechanics: momentum/breakout entries in growth versus base-reclaim/catalyst entries in value.',
      'Recognize why growth leadership thrives in low-rate liquidity expansions while value often shines in inflationary recoveries.',
      'Avoid mixing conflicting rules (e.g., holding a busted momentum growth trade as a "long-term value investment").',
    ],
    keyPoints: [
      'Growth trading demands strict stop-losses because high-multiple leaders can drop 30%–50% fast when growth slows.',
      'Value trading requires a clear catalyst or technical shift so dead capital does not sit stagnant for years.',
      'Never convert a failed short-term trade into an unplanned long-term investment.',
    ],
    limitationsNote: 'Both growth and value styles experience multi-quarter underperformance cycles; neither wins in every macro environment.',
    practicalExample:
      'A trader takes a growth breakout above a 6-week base with a −5% stop; when price slices below the stop, they exit cleanly instead of rationalizing it as a long-term value hold.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.10', 'S4.10'],
    estimatedMinutes: 10,
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'What is one of the most destructive behavioral errors when trading growth stocks?',
      options: [
        'Checking earnings dates before entering',
        'Refusing to take a planned stop-loss and turning a failed growth trade into an accidental "long-term hold"',
        'Sizing positions based on stop distance',
        'Reviewing weekly sector leadership',
      ],
      correctIndex: 1,
      rationale: 'Changing your time horizon mid-loss removes risk control and exposes your account to deep structural drawdowns.',
      commonTrap: 'Averaging down repeatedly into a broken high-multiple growth stock whose fundamentals just deteriorated.',
    },
  },
  {
    id: 'topic-s5-2',
    code: 'S5.2',
    slug: 'stocks-s5-2-momentum-trading',
    title: 'Momentum Trading',
    overviewEn:
      'Momentum trading focuses on stocks already demonstrating strong institutional demand and relative strength—buying structured pullbacks or tight consolidations in the direction of established leadership.',
    overviewTaglish:
      'Nakatuon ang momentum trading sa mga stocks na may malakas nang institutional demand at relative strength—pumapasok sa malinis na pullback o tight consolidation kasabay ng trend.',
    objectives: [
      'Identify true momentum leaders using Relative Strength (RS) lines, moving-average alignment, and volume expansion.',
      'Enter on controlled pullbacks (e.g., 10/20 EMA or tight flag) instead of chasing vertical extended candles.',
      'Trail stops behind higher lows or key moving averages to capture asymmetric trend legs.',
    ],
    keyPoints: [
      'Momentum works because institutional funds take weeks to build positions and herding reinforces trends.',
      'Buying extended 3+ day vertical runs invites immediate mean-reversion stops.',
      'Momentum reverses violently during market corrections—trim into strength and protect open profits.',
    ],
    limitationsNote: 'Momentum strategies suffer whipsaws in choppy, sideways, or rapidly rotating markets.',
    practicalExample:
      'A leading tech stock climbs +18% on high volume, then drifts sideways for 4 days on shrinking volume onto its rising 10-day EMA—offering a defined-risk continuation entry.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.1'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'stocks-earnings-relative-strength',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'Where does a disciplined momentum trader prefer to enter a strong leading stock?',
      options: [
        'At the peak of a vertical 4th consecutive green candle far above moving averages',
        'On a low-volume orderly pullback or tight consolidation near key support/moving averages',
        'Only after the stock breaks below its 200-day moving average',
        'Randomly during midday chop with no stop-loss',
      ],
      correctIndex: 1,
      rationale: 'Controlled pullbacks and tight pauses compress stop distance and improve risk-to-reward while keeping trend alignment intact.',
      commonTrap: 'Confusing momentum trading with FOMO chasing after a move is already overextended.',
    },
  },
  {
    id: 'topic-s5-3',
    code: 'S5.3',
    slug: 'stocks-s5-3-breakout-trading',
    title: 'Breakout Trading',
    overviewEn:
      'Breakout trading captures the transition from tight volatility contraction (consolidation base) into directional expansion as price clears well-defined resistance on surging volume.',
    overviewTaglish:
      'Sinusunggaban ng breakout trading ang paglabas ng presyo mula sa masikip na consolidation base patungo sa malakas na expansion—kailangang may kumpirmadong volume at malinaw na stop.',
    objectives: [
      'Spot high-quality bases: Volatility Contraction Patterns (VCP), flat bases, and ascending triangles with drying-up pullbacks.',
      'Require volume expansion (RVOL > 1.5x–2.0x) and broad market alignment to filter fakeouts.',
      'Plan invalidation cleanly: if price falls back deeply inside the base ("squat/failure"), cut loss swiftly.',
    ],
    keyPoints: [
      'Tight price action and drying volume before the pivot show overhead supply is getting absorbed.',
      'In weak/bear markets, breakouts fail at high rates—always check S&P 500/NASDAQ trend health first.',
      'Buying within 1%–3% of the pivot (or on the first clean retest) keeps risk tight.',
    ],
    limitationsNote: 'Breakouts naturally have modest win rates (often 40%–55%); profitability depends on cutting failed breakouts fast and letting real leaders run.',
    practicalExample:
      'A stock tightens from a 12% pullback to a 5% pullback to a 2% tight range below $80.00 resistance, then breaks $80.10 on 2.4x normal daily volume with a stop below the tight pivot low at $77.80.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.2'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'stocks-gaps-rvol-playbook',
    diagramKind: 'liquidity_sweep_vs_breakout',
    quiz: {
      prompt: 'Which pre-breakout clue increases the odds that a stock breakout is genuine rather than a false breakout?',
      options: [
        'Erratic wide swings with falling broad market indices',
        'Tightening price contractions with drying volume ahead of the pivot, followed by surging volume on the break',
        'Zero volume on the breakout candle',
        'An earnings report scheduled 2 hours after entry',
      ],
      correctIndex: 1,
      rationale: 'Volatility contraction on low volume signals exhausted selling; volume expansion through resistance confirms institutional demand.',
      commonTrap: 'Holding onto a failed breakout after it slams back inside the base hoping it will recover.',
    },
  },
  {
    id: 'topic-s5-4',
    code: 'S5.4',
    slug: 'stocks-s5-4-swing-trading-stocks',
    title: 'Swing Trading Stocks',
    overviewEn:
      'Swing trading holds stock positions for several days to a few weeks to capture a single multi-day trend wave, making it practical for traders with day jobs who review charts outside market hours.',
    overviewTaglish:
      'Sa swing trading, hawak ang posisyon nang ilang araw hanggang ilang linggo para makuha ang isang buong trend leg—angkop ito sa mga traders na may regular na trabaho o negosyo.',
    objectives: [
      'Build an end-of-day scanning workflow using Daily and Weekly charts without screen-watching all night.',
      'Size positions to absorb overnight gap risk (typically 0.5%–1.0% risk per trade, checking earnings calendars).',
      'Scale partial profits into strength (2R–3R) and trail a runner with structural stops.',
    ],
    keyPoints: [
      'Daily and Weekly timeframes filter out intraday noise and reduce commission/spread friction.',
      'Overnight gap risk means a stop-loss can slip past your level—never over-concentrate in one ticker.',
      'Swing trading rewards patience: a few clean A+ setups per month beat forcing daily trades.',
    ],
    practicalExample:
      'A Philippine professional scans US stocks after dinner, sets a buy-stop limit entry on a daily pullback setup with a hard stop and 2.5R target, and reviews execution once per evening.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.3'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'stocks-earnings-relative-strength',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'What unique risk must every stock swing trader account for that pure intraday traders avoid?',
      options: [
        'Inability to use daily candlestick charts',
        'Overnight and weekend gap risk where price opens far beyond your stop-loss level',
        'Higher intraday bid-ask spreads than 1-minute scalping',
        'Exchanges closing positions automatically at 4:00 PM ET',
      ],
      correctIndex: 1,
      rationale: 'News, earnings, and macro events outside regular hours can gap a stock straight past stop orders at the next morning’s open.',
      commonTrap: 'Putting 50% of your account into a single swing stock right before a surprise news or earnings event.',
    },
  },
  {
    id: 'topic-s5-5',
    code: 'S5.5',
    slug: 'stocks-s5-5-day-trading-stocks',
    title: 'Day Trading Stocks',
    overviewEn:
      'Day trading stocks opens and closes all positions within the same trading session to eliminate overnight gap risk—requiring strict stock-in-play selection, fast execution, and ironclad daily loss limits.',
    overviewTaglish:
      'Sa day trading ng stocks, lahat ng trades ay binubuksan at sinasara sa parehong araw para walang overnight gap risk—kailangan dito ng stocks-in-play, mabilis na execution, at mahigpit na daily loss limit.',
    objectives: [
      'Select true "Stocks in Play" with fresh catalysts, high RVOL (>2x), and clean intraday liquidity.',
      'Apply Opening Range Breakout (ORB) and VWAP pullback frameworks during the high-volume opening window.',
      'Enforce a hard daily max loss (e.g., 2R–3R) and respect US Pattern Day Trader (PDT) margin rules ($25,000 threshold on US margin accounts).',
    ],
    keyPoints: [
      'Flat by the closing bell removes overnight gap exposure completely.',
      'Most intraday edge concentrates in the first 90 minutes; overtrading midday chop erodes profits fast.',
      'Track slippage, spreads, and fees closely because high trade frequency magnifies transaction costs.',
    ],
    limitationsNote: 'Day trading has high failure rates for undisciplined traders; prove profitability in simulation and tiny size first.',
    practicalExample:
      'A stock gaps +8% on earnings guidance with 4x pre-market volume. After forming a clean 5-minute Opening Range high, it breaks upward above VWAP, giving a 2.5R intraday move before midday.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.4'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'stocks-gaps-rvol-playbook',
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'What defines a true "Stock in Play" for intraday equity traders?',
      options: [
        'Any stock that has traded flat with tiny volume for six months',
        'A liquid stock driven by a fresh fundamental catalyst, elevated Relative Volume, and clean intraday range',
        'The cheapest penny stock under $0.20',
        'Any stock whose name starts with the letter A',
      ],
      correctIndex: 1,
      rationale: 'Fresh catalysts and high RVOL attract institutional order flow, creating cleaner directional intraday moves than random quiet tickers.',
      commonTrap: 'Forcing 15 intraday trades during the quiet midday lull after missing the morning move.',
    },
  },
  {
    id: 'topic-s5-6',
    code: 'S5.6',
    slug: 'stocks-s5-6-gap-and-go-strategy',
    title: 'Gap and Go Strategy',
    overviewEn:
      'The Gap and Go framework targets stocks gapping up on meaningful news or earnings catalysts with strong pre-market volume, entering only after opening volatility confirms buyer control above key levels.',
    overviewTaglish:
      'Ang Gap and Go ay nakatuon sa mga stocks na nag-gap up dahil sa malakas na balita o earnings at mataas na pre-market volume—pumapasok lang kapag kumpirmadong hawak ng buyers ang presyo pagbukas ng merkado.',
    objectives: [
      'Filter quality gaps: catalyst strength, gap size (typically 4%–15% for liquid stocks), high pre-market volume, and clear daily room overhead.',
      'Wait for opening confirmation (e.g., 1-min/5-min Opening Range Breakout or pullback hold above VWAP/pre-market high) instead of blind market buys at 9:30:01.',
      'Manage gap-fill failure swiftly using the opening-range low or VWAP as objective invalidation.',
    ],
    keyPoints: [
      'Not every gap goes—exhaustion gaps into major daily resistance frequently fade and fill the gap.',
      'Letting the first 1–5 minutes print filters chaotic opening-bell market-order whipsaws.',
      'Take partials into momentum extensions because early profit-takers regularly create sharp pullbacks.',
    ],
    limitationsNote: 'Gap and Go carries intense volatility and slippage—always use defined share sizing and avoid blindly chasing 40%+ parabolic extensions.',
    practicalExample:
      'Ticker XYZ gaps from $42 to $46 (+9.5%) on raised annual guidance with 3x normal volume. It dips briefly to $45.50 VWAP in minute 3, holds, and breaks the $46.40 opening high for a clean push to $49.00.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.5'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'stocks-gaps-rvol-playbook',
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'Why should a Gap and Go trader avoid firing a blind market buy order at the exact first second of the market open?',
      options: [
        'Because brokers disable buy buttons until 10:00 AM',
        'Because opening-bell spreads and overnight profit-taking cause violent whipsaws before true direction confirms',
        'Because gaps can never continue higher after 9:31 AM',
        'Because market orders do not work on gapping stocks',
      ],
      correctIndex: 1,
      rationale: 'Waiting for the initial opening-range structure and VWAP reaction lets you define an objective stop and avoid instant gap-fade traps.',
      commonTrap: 'Buying an exhaustion gap that opens directly into heavy multi-month daily resistance and reverses immediately.',
    },
  },
  {
    id: 'topic-s5-7',
    code: 'S5.7',
    slug: 'stocks-s5-7-earnings-breakout-strategy',
    title: 'Earnings Breakout Strategy',
    overviewEn:
      'The Earnings Breakout (Episodic Pivot) strategy trades stocks gapping out of multi-week bases on surprise earnings beats and raised guidance, aiming to ride multi-week institutional re-rating.',
    overviewTaglish:
      'Ang Earnings Breakout strategy ay sumasakay sa stocks na biglang lumabas sa malawak na consolidation dahil sa malakas na earnings surprise at tinaasang guidance—madalas itong sinusundan ng multi-week institutional buying.',
    objectives: [
      'Identify high-conviction earnings catalysts: double beat (EPS + Revenue), raised guidance, and massive volume (3x–10x average).',
      'Compare day-one Opening Range entries versus day 2–5 consolidation pullback entries.',
      'Place structural stops at the earnings-day low (or tight intraday pivot) and respect invalidation if the gap fills.',
    ],
    keyPoints: [
      'Major funds need days or weeks to build full positions after a fundamental thesis shift (Post-Earnings Announcement Drift).',
      'Best setups gap out of neglected multi-month bases rather than already-extended vertical charts.',
      'If price closes below the earnings-day low on heavy volume, the institutional thesis failed—exit immediately.',
    ],
    practicalExample:
      'After 5 months of sideways range around $30, a company beats EPS by 40%, raises full-year guidance, and gaps to $35 on 8x volume. Entering above the first 15-minute high with stop at the day’s low ($33.60) captures a 3-week move to $44.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.6'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'stocks-earnings-relative-strength',
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'What is the clearest objective invalidation signal on an Earnings Breakout trade?',
      options: [
        'Price pauses sideways for two days on light volume',
        'Price slices and closes back below the earnings-day low on heavy volume, filling the gap',
        'An analyst writes a neutral comment',
        'The stock rises 3% on day two',
      ],
      correctIndex: 1,
      rationale: 'Losing the earnings-day low shows institutions are selling into the news rather than defending and accumulating higher.',
      commonTrap: 'Gambling BEFORE the earnings release instead of waiting to trade the confirmed post-earnings institutional reaction.',
    },
  },
  {
    id: 'topic-s5-8',
    code: 'S5.8',
    slug: 'stocks-s5-8-volume-based-analysis',
    title: 'Volume-Based Analysis',
    overviewEn:
      'Volume-based analysis reads the interplay between price movement and trading volume—using volume bars, VWAP, and Volume Profile—to distinguish institutional accumulation from distribution and weak fakeouts.',
    overviewTaglish:
      'Sinusuri ng volume-based analysis ang ugnayan ng galaw ng presyo at dami ng shares na nag-trade—gamit ang volume bars, VWAP, at Volume Profile—para makita kung totoong institutional buying o distribution ang nangyayari.',
    objectives: [
      'Interpret core volume-price relationships: high-volume breakouts, low-volume pullbacks, and high-volume churning/climax bars.',
      'Use Volume-Weighted Average Price (VWAP) as an institutional intraday benchmark.',
      'Spot "pocket pivots" and accumulation days (price up on heavier volume than prior down days).',
    ],
    keyPoints: [
      'Healthy uptrends show expanding volume on up-days and contracting volume on pullbacks.',
      'Repeated heavy-volume red days near highs signal institutional distribution—tighten stops.',
      'VWAP acts as dynamic fair value intraday; institutions benchmark execution quality against it.',
    ],
    practicalExample:
      'A stock rallies +4% on 3x average volume, pulls back −1.5% over two days on half normal volume, and bounces cleanly off VWAP—classic accumulation footprint.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.7'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'stocks-gaps-rvol-playbook',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'In an established uptrend, what volume pattern indicates a healthy, orderly pullback rather than aggressive institutional selling?',
      options: [
        'Record-breaking volume spikes on large red engulfing candles',
        'Gradually shrinking volume on small-range pullback candles',
        'Zero trades occurring for three straight days',
        'Doubling volume every hour as support breaks',
      ],
      correctIndex: 1,
      rationale: 'Declining volume on pullbacks shows light profit-taking and lack of aggressive institutional liquidation.',
      commonTrap: 'Ignoring a cluster of heavy-volume distribution days near the top just because price has not broken down yet.',
    },
  },
  {
    id: 'topic-s5-9',
    code: 'S5.9',
    slug: 'stocks-s5-9-sector-rotation',
    title: 'Sector Rotation',
    overviewEn:
      'Sector rotation tracks how institutional capital shifts across equity sectors throughout the economic cycle—moving from defensive staples during downturns into cyclicals, financials, tech, and energy as growth evolves.',
    overviewTaglish:
      'Sinusubaybayan ng sector rotation ang paglipat ng malalaking pondo sa iba’t ibang sektor habang nagbabago ang siklo ng ekonomiya—mula defensive sectors patungong cyclicals, tech, o energy.',
    objectives: [
      'Map typical rotation tendencies across early recovery, mid-cycle expansion, late-cycle inflation, and contraction.',
      'Track relative-strength charts (Sector ETF ÷ SPY) weekly to detect money rotating BEFORE headlines announce it.',
      'Rebalance watchlists dynamically instead of staying married to last year’s favorite sector.',
    ],
    keyPoints: [
      'Money rarely leaves equities completely—it rotates from expensive crowded themes into emerging leadership.',
      'Watch ratio charts (e.g., XLE/SPY or XLK/SPY) breaking above key moving averages to spot rotation early.',
      'Economic cycles are never textbook-identical—follow actual relative-strength price action, not rigid theory.',
    ],
    practicalExample:
      'When inflation re-accelerates and tech multiples stall, XLE/SPY (Energy vs. S&P 500) breaks a 6-month downtrend, guiding a swing trader to shift watchlist focus to energy leaders.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.8'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'stocks-earnings-relative-strength',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'What is the most objective way to detect institutional sector rotation early on your charts?',
      options: [
        'Reading social media polls once a month',
        'Monitoring relative-strength ratio charts of Sector ETFs divided by the broad index (e.g., XLF/SPY)',
        'Only trading the single sector that performed best three years ago',
        'Buying every sector equally at random intraday peaks',
      ],
      correctIndex: 1,
      rationale: 'Relative-strength ratio charts immediately reveal which sectors are gaining or losing institutional flows versus the benchmark.',
      commonTrap: 'Staying stubbornly committed to last year’s winning theme long after institutions have rotated elsewhere.',
    },
  },
  {
    id: 'topic-s5-10',
    code: 'S5.10',
    slug: 'stocks-s5-10-building-stock-trading-portfolio',
    title: 'Building a Stock Trading Portfolio',
    overviewEn:
      'Building a stock trading portfolio balances position sizing, sector correlation limits, total open portfolio heat, and cash management so no single market shock can wipe out months of progress.',
    overviewTaglish:
      'Ang pagbuo ng stock trading portfolio ay tamang balanse ng position sizing, limitasyon sa magkakaparehong sektor, kabuuang portfolio risk (heat), at cash reserve para ligtas ang account kahit may biglaang bagsak.',
    objectives: [
      'Cap single-position risk (0.5%–1.0%) and total open portfolio heat (e.g., max 4%–6% combined stop-out risk).',
      'Control hidden correlation—holding five semiconductor stocks behaves like one giant concentrated bet.',
      'Scale exposure dynamically ("progressive exposure"): increase size only when your recent trades are working.',
    ],
    keyPoints: [
      'Cash is a valid active position when broad indices are trending down or breakouts are failing.',
      'Cap single-stock allocation (e.g., 15%–25% max equity per position) to survive unexpected overnight gaps.',
      'Keep long-term passive index investments strictly separated from your active trading account.',
    ],
    practicalExample:
      'A $20,000 trading portfolio risks 0.75% ($150) per trade across at most 4 uncorrelated sectors—limiting worst-case simultaneous stop-out risk to 3% ($600) while keeping flexibility in cash.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S5.9'],
    estimatedMinutes: 10,
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why is holding 5 different AI semiconductor stocks at 1% risk each NOT truly diversified?',
      options: [
        'Because semiconductor stocks cannot have stop-losses',
        'Because high sector correlation means one bad industry headline can gap and stop out all 5 positions simultaneously (~5%+ sudden loss)',
        'Because brokers ban holding more than 3 stocks',
        'Because correlated stocks pay lower dividends',
      ],
      correctIndex: 1,
      rationale: 'True risk diversification limits correlated exposure so a single macro or sector shock cannot trigger simultaneous multi-position gap losses.',
      commonTrap: 'Going 100% invested right at the start of a choppy market instead of earning the right to add exposure via progressive traction.',
    },
  },

  // =========================================================================
  // MODULE S6 — Additional Stock Market Instruments (S6.1 – S6.10, OPTIONAL)
  // =========================================================================
  {
    id: 'topic-s6-1',
    code: 'S6.1',
    slug: 'stocks-s6-1-etfs',
    title: 'Exchange-Traded Funds (ETFs)',
    overviewEn:
      'An Exchange-Traded Fund (ETF) holds a diversified basket of stocks, bonds, or commodities and trades intraday on stock exchanges like a single share—offering low-cost diversification without single-company earnings blowup risk.',
    overviewTaglish:
      'Ang Exchange-Traded Fund (ETF) ay basket ng maraming stocks o assets na puwedeng bilhin at ibenta sa stock exchange gaya ng ordinaryong share—nagbibigay ito ng instant diversification at mas mababang single-stock risk.',
    objectives: [
      'Compare broad index ETFs (SPY, QQQ, VOO), sector ETFs (XLK, XLE), and thematic/leveraged ETFs.',
      'Evaluate ETF expense ratios, tracking error, liquidity, and top-10 concentration.',
      'Explain why daily-reset leveraged ETFs (2x/3x) suffer volatility decay if held long term.',
    ],
    keyPoints: [
      'Broad low-cost index ETFs remove single-company bankruptcy and earnings-gap surprises.',
      'Check the underlying holdings—some thematic ETFs hold 40% in just three stocks.',
      'Leveraged (3x) and inverse ETFs reset daily and are meant strictly for short-term tactical trading, never buy-and-hold.',
    ],
    practicalExample:
      'Instead of gambling on one semiconductor stock ahead of earnings, a trader buys SMH (Semiconductor ETF) to capture sector trend exposure with dramatically lower single-ticker gap risk.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.10'],
    optional: true,
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why are 3x leveraged daily-reset ETFs generally unsuitable for multi-year buy-and-hold investing?',
      options: [
        'They cannot be traded during regular market hours',
        'Daily compounding in volatile choppy markets causes math-driven volatility decay (beta slippage) alongside high fees',
        'They automatically convert into bonds after 30 days',
        'They have zero downside risk',
      ],
      correctIndex: 1,
      rationale: 'Because leveraged ETFs rebalance to 3x daily returns every close, choppy up-and-down swings erode long-term value even if the underlying index finishes flat.',
      commonTrap: 'Buying a 3x leveraged ETF assuming it will return exactly 3x the index over a full year.',
    },
  },
  {
    id: 'topic-s6-2',
    code: 'S6.2',
    slug: 'stocks-s6-2-reits',
    title: 'REITs',
    overviewEn:
      'Real Estate Investment Trusts (REITs) own or finance income-producing properties—offices, malls, warehouses, data centers, or cell towers—and are legally required to distribute most taxable income (typically 90%+) as dividends.',
    overviewTaglish:
      'Ang Real Estate Investment Trusts (REITs) ay mga kumpanyang nagmamay-ari ng mga paupahang ari-arian (malls, opisina, data centers) at obligado sa batas na ipamahagi ang malaking bahagi ng kita (karaniwang 90%+) bilang dividends.',
    objectives: [
      'Explain why REITs use Funds From Operations (FFO) rather than standard GAAP Net Income to evaluate cash earnings.',
      'Assess REIT occupancy rates, Weighted Average Lease Expiry (WALE), debt cost, and property sub-sector health.',
      'Understand why rising interest rates pressure REIT prices by raising borrowing costs and competing yields.',
    ],
    keyPoints: [
      'REITs let retail investors earn real estate rental income with high stock-exchange liquidity and small capital.',
      'Standard P/E ratios distort REITs because non-cash property depreciation depresses GAAP net income—use Price/FFO instead.',
      'Both US REITs and Philippine PSE REITs (e.g., AREIT, RCR, MREIT) are sensitive to central bank interest-rate cycles.',
    ],
    practicalExample:
      'An industrial logistics REIT maintains 97% occupancy, a 6-year WALE, and steadily rising FFO per share, supporting a sustainable 5.5% dividend yield.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S6.1'],
    optional: true,
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which earnings metric is preferred over standard Net Income when evaluating a REIT’s ability to sustain its dividend?',
      options: [
        'Price-to-Sales Ratio',
        'Funds From Operations (FFO) / Adjusted FFO (AFFO)',
        'Daily Relative Volume',
        'Short Interest Ratio',
      ],
      correctIndex: 1,
      rationale: 'GAAP Net Income deducts large non-cash real estate depreciation; FFO adds depreciation back to reflect actual rental cash flow.',
      commonTrap: 'Buying a struggling office REIT purely for an 11% yield while ignoring falling occupancy and looming debt refinancing.',
    },
  },
  {
    id: 'topic-s6-3',
    code: 'S6.3',
    slug: 'stocks-s6-3-options-fundamentals',
    title: 'Options Fundamentals',
    overviewEn:
      'Stock options are optional derivative contracts giving the buyer the right—but not the obligation—to buy or sell 100 shares of an underlying stock at a fixed strike price before a set expiration date.',
    overviewTaglish:
      'Ang stock options ay optional na derivative contracts na nagbibigay ng karapatan—pero hindi obligasyon—na bumili o magbenta ng 100 shares sa itinakdang strike price bago ang expiration date.',
    objectives: [
      'Distinguish option buyers (defined premium risk, fights time decay) from option sellers (collects premium, assumes assignment obligation).',
      'Calculate total contract cost using the standard 100-share equity option multiplier.',
      'Recognize why options are strictly an OPTIONAL advanced pathway and NOT required to succeed in stock trading.',
    ],
    keyPoints: [
      'One standard US equity option contract controls 100 shares—a $2.50 quoted premium actually costs $250.',
      'Unlike shares, options expire on a fixed date and can lose 100% of their value if wrong on direction OR timing.',
      'Options can hedge stock portfolios or generate income, but leveraged short-dated speculation destroys unprepared accounts fast.',
    ],
    limitationsNote: 'Optional Advanced Topic: Never trade options until you have mastered spot equity risk management. Options are NOT a prerequisite for ordinary stock trading.',
    practicalExample:
      'Buying 1 call option quoted at $3.20 costs $320 (100 × $3.20) to control 100 shares of a $100 stock until expiration—much less cash upfront, yet the entire $320 expires worthless if the stock stays below the strike.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S2.10', 'S6.1'],
    optional: true,
    estimatedMinutes: 10,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'If a standard US equity option contract is quoted at a premium of $1.85, how much cash does it cost to buy 1 contract (before commissions)?',
      options: ['$1.85', '$18.50', '$185.00', '$1,850.00'],
      correctIndex: 2,
      rationale: 'Each standard US equity option contract represents 100 underlying shares, so $1.85 × 100 = $185.00.',
      commonTrap: 'Buying cheap-looking out-of-the-money weekly options ("lottery tickets") that routinely expire at $0.',
    },
  },
  {
    id: 'topic-s6-4',
    code: 'S6.4',
    slug: 'stocks-s6-4-calls-and-puts',
    title: 'Calls and Puts',
    overviewEn:
      'Call options grant the right to buy shares at the strike price (benefiting when the stock rises), while Put options grant the right to sell shares at the strike price (benefiting when the stock falls or hedging downside).',
    overviewTaglish:
      'Ang Call option ay nagbibigay ng karapatang bumili sa strike price (kumikita kapag tumaas ang stock), habang ang Put option ay karapatang magbenta sa strike price (kumikita kapag bumaba o pang-hedge sa bagsak).',
    objectives: [
      'Calculate expiration breakeven prices for long calls (Strike + Premium) and long puts (Strike − Premium).',
      'Compare buying a call/put against selling (writing) a call/put in terms of payoff and obligation.',
      'Understand why being right on direction still loses money if the stock fails to clear the breakeven before expiry.',
    ],
    keyPoints: [
      'Long Call: max loss = premium paid; bullish directional payoff above Strike + Premium.',
      'Long Put: max loss = premium paid; bearish payoff or portfolio insurance below Strike − Premium.',
      'Naked (uncovered) short calls carry theoretically unlimited risk—strictly avoid as a developing trader.',
    ],
    limitationsNote: 'Options require being right on direction, magnitude, AND timing—far harder than owning spot shares.',
    practicalExample:
      'You buy a $50 strike Call for $2.00 premium ($200). At expiration, the stock must finish above $52.00 just to break even; at $51.00 you still lose $100 even though the stock went up.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S6.3'],
    optional: true,
    estimatedMinutes: 10,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'You buy a $100 strike Put option for a $4.00 premium. At expiration, what stock price is your breakeven point (ignoring fees)?',
      options: ['$104.00', '$100.00', '$96.00', '$92.00'],
      correctIndex: 2,
      rationale: 'Long Put breakeven = Strike Price ($100) − Premium Paid ($4) = $96.00.',
      commonTrap: 'Assuming a long call automatically profits the instant the underlying stock rises above the strike price, forgetting the premium paid.',
    },
  },
  {
    id: 'topic-s6-5',
    code: 'S6.5',
    slug: 'stocks-s6-5-strike-prices-and-expiration',
    title: 'Options Strike Prices and Expiration',
    overviewEn:
      'Strike selection determines whether an option is In-the-Money (ITM), At-the-Money (ATM), or Out-of-the-Money (OTM), while expiration determines how much time value remains before the contract ceases to exist.',
    overviewTaglish:
      'Ang strike price ang nagtatakda kung In-the-Money (ITM), At-the-Money (ATM), o Out-of-the-Money (OTM) ang option, habang ang expiration date ang nagtatakda kung gaano karaming time value ang natitira.',
    objectives: [
      'Split any option’s premium into Intrinsic Value + Extrinsic (Time/Volatility) Value.',
      'Contrast ITM, ATM, and OTM contracts in cost, probability of finishing profitable, and sensitivity.',
      'Understand expiration acceleration: time value decays fastest in the final 30 days before expiry.',
    ],
    keyPoints: [
      'Option Premium = Intrinsic Value + Extrinsic Value; OTM options consist 100% of decaying extrinsic value.',
      'Short-dated weekly options (0DTE–7DTE) experience rapid time decay and extreme percentage swings.',
      'Never hold expiring ITM options into the closing bell unknowingly—auto-exercise can assign 100 shares per contract.',
    ],
    limitationsNote: 'Ultra-short expiration (0DTE) options behave like high-speed leverage traps for beginners; avoid them.',
    practicalExample:
      'With a stock at $55, a $50 Call priced at $6.50 holds $5.00 of intrinsic value and $1.50 of extrinsic time value. A $60 Call priced at $1.10 holds $0 intrinsic value and $1.10 pure extrinsic value.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S6.4'],
    optional: true,
    estimatedMinutes: 10,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'A stock trades at $80. A $85 strike Call option trades for $2.20. How much of that $2.20 premium is Intrinsic Value?',
      options: ['$5.00', '$2.20', '$0.00 (it is Out-of-the-Money and 100% extrinsic value)', '$80.00'],
      correctIndex: 2,
      rationale: 'An $85 Call has no intrinsic value while the stock is at $80—its entire $2.20 price is extrinsic time and volatility value.',
      commonTrap: 'Leaving ITM options open through Friday expiration and waking up Monday to an unexpected 100-share margin call.',
    },
  },
  {
    id: 'topic-s6-6',
    code: 'S6.6',
    slug: 'stocks-s6-6-options-greeks',
    title: 'Options Greeks',
    overviewEn:
      'The Options Greeks—Delta, Gamma, Theta, and Vega—measure how an option’s price reacts to stock movement, acceleration, passing time, and changes in Implied Volatility (IV).',
    overviewTaglish:
      'Sinusukat ng Options Greeks—Delta, Gamma, Theta, at Vega—kung paano gumagalaw ang presyo ng option base sa presyo ng stock, bilis ng pagbabago, lumilipas na oras, at Implied Volatility (IV).',
    objectives: [
      'Define Delta (directional sensitivity), Gamma (rate of Delta change), Theta (daily time decay), and Vega (IV sensitivity).',
      'Explain "IV Crush": how a sharp drop in Implied Volatility after earnings can cause options to lose value even if the stock moves your way.',
      'Use Greeks to inspect hidden risk before opening any optional derivative position.',
    ],
    keyPoints: [
      'Delta (~0 to 1 for calls, 0 to −1 for puts) estimates option price change per $1 move in the stock.',
      'Theta works against option buyers every single day and accelerates sharply near expiration.',
      'Vega rises ahead of binary events like earnings and collapses immediately afterward (IV Crush).',
    ],
    limitationsNote: 'Greeks change dynamically as price and time move—they are instantaneous sensitivities, not fixed constants.',
    practicalExample:
      'Before earnings, Implied Volatility spikes to 110%. You buy a call; the stock rises +3% after the report, yet IV crashes to 45% (Vega loss), causing your call option to drop −35%.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S6.5'],
    optional: true,
    estimatedMinutes: 10,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Why can an option buyer LOSE money right after an earnings report even when the stock moves slightly in their predicted direction?',
      options: [
        'Because Theta turns positive for buyers after earnings',
        'Because Implied Volatility collapses once uncertainty clears ("IV Crush"), draining extrinsic value via Vega',
        'Because exchanges cancel Delta after earnings',
        'Because brokers double the strike price overnight',
      ],
      correctIndex: 1,
      rationale: 'Pre-earnings options carry inflated Implied Volatility; once results are public, IV drops sharply and shrinks option premiums.',
      commonTrap: 'Buying expensive high-IV options the afternoon before earnings without calculating the expected move.',
    },
  },
  {
    id: 'topic-s6-7',
    code: 'S6.7',
    slug: 'stocks-s6-7-covered-calls-and-protective-puts',
    title: 'Covered Calls and Protective Puts',
    overviewEn:
      'Covered calls and protective puts are two foundational portfolio-overlay strategies used on existing 100-share stock holdings: covered calls generate modest income by capping upside, while protective puts act like temporary downside insurance.',
    overviewTaglish:
      'Ang covered call at protective put ay dalawang pangunahing overlay para sa may hawak nang 100 shares: ang covered call ay kumikita ng premium kapalit ng ceiling sa upside, habang ang protective put ay parang pansamantalang insurance laban sa malaking bagsak.',
    objectives: [
      'Explain the mechanics and trade-offs of selling 1 OTM Call against 100 owned shares (Covered Call).',
      'Explain how buying 1 Put against 100 owned shares creates a hard price floor until expiration (Protective Put).',
      'Identify the key misconception: covered calls do NOT protect against severe stock crashes.',
    ],
    keyPoints: [
      'Covered Call: keeps premium if stock stays below strike; forced to sell shares at strike if stock rallies sharply—still exposed to downside minus small premium.',
      'Protective Put: caps downside at Strike − Stock Cost − Premium, but paying insurance repeatedly drags long-term returns.',
      'Both strategies require multiples of 100 shares per option contract.',
    ],
    limitationsNote: 'Optional Advanced Pathway: Only consider overlays after thoroughly understanding spot share ownership and option assignment.',
    practicalExample:
      'You own 100 shares of a stock at $50 and sell a 30-day $55 Covered Call for $1.20 ($120). If the stock stays at $53, you keep the $120; if it surges to $65, your shares are called away at $55.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S6.6'],
    optional: true,
    estimatedMinutes: 10,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'What is the main trade-off when writing a Covered Call against 100 shares you already own?',
      options: [
        'It completely eliminates all downside risk if the stock plunges 50%',
        'You collect upfront premium income, but cap your upside gain at the strike price while keeping most downside risk',
        'It doubles your dividend payments automatically',
        'It requires borrowing shares on margin',
      ],
      correctIndex: 1,
      rationale: 'A covered call exchanges upside above the strike price for modest premium income; the premium only cushions a small drop.',
      commonTrap: 'Selling covered calls below your cost basis after a drop and getting forced to lock in a permanent loss on a rebound.',
    },
  },
  {
    id: 'topic-s6-8',
    code: 'S6.8',
    slug: 'stocks-s6-8-understanding-stock-splits',
    title: 'Understanding Stock Splits',
    overviewEn:
      'A stock split multiplies or consolidates a company’s share count while adjusting the share price proportionally—changing accessibility and psychology without altering total company value.',
    overviewTaglish:
      'Binabago ng stock split ang dami ng shares at proporsyonal na presyo nito—hindi nagbabago ang kabuuang halaga ng kumpanya, pero nakakaapekto ito sa liquidity at retail accessibility.',
    objectives: [
      'Distinguish forward stock splits (e.g., 4-for-1) from reverse stock splits (e.g., 1-for-10).',
      'Verify mathematically that total position value and ownership percentage stay unchanged at the split.',
      'Recognize why reverse splits are often warning signs of distressed stocks trying to avoid exchange delisting.',
    ],
    keyPoints: [
      'Forward split: cutting one $400 pizza into four $100 slices does not create extra pizza—total value is identical.',
      'Forward splits can improve retail affordability and options liquidity; reverse splits frequently signal financial weakness.',
      'Historical charts automatically split-adjust past prices so long-term technical levels remain continuous.',
    ],
    practicalExample:
      'Owning 10 shares at $400 ($4,000) before a 4-for-1 split becomes 40 shares at $100 ($4,000) after the split—same ownership percentage, same total value.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S6.2'],
    optional: true,
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'You own 20 shares of a stock trading at $150 ($3,000 total). The company executes a 3-for-1 forward stock split. What do you hold immediately after the split?',
      options: [
        '60 shares at $150 ($9,000 total)',
        '60 shares at $50 ($3,000 total)',
        '20 shares at $50 ($1,000 total)',
        '60 shares at $450 ($27,000 total)',
      ],
      correctIndex: 1,
      rationale: 'Share count triples (20 × 3 = 60) while price divides by 3 ($150 ÷ 3 = $50), keeping total value identical at $3,000.',
      commonTrap: 'Thinking a stock became 75% "cheaper" fundamentally after a 4-for-1 split, or buying troubled penny stocks executing repeated reverse splits.',
    },
  },
  {
    id: 'topic-s6-9',
    code: 'S6.9',
    slug: 'stocks-s6-9-dividends-and-ex-dividend-dates',
    title: 'Dividends and Ex-Dividend Dates',
    overviewEn:
      'To receive an upcoming dividend, you must own the shares BEFORE the Ex-Dividend Date—and on that morning the exchange adjusts the opening reference price downward by the dividend amount.',
    overviewTaglish:
      'Para makatanggap ng dividend, kailangang hawak mo na ang shares BAGO ang Ex-Dividend Date—at sa mismong umagang iyon, natural na bumababa ang opening reference price katumbas ng halaga ng dividend.',
    objectives: [
      'Sequence the four dividend dates: Declaration Date, Ex-Dividend Date, Record Date, and Payment Date.',
      'Explain why "free dividend capture" buying the day before ex-date does not create free money.',
      'Factor withholding taxes on dividends (e.g., US non-resident dividend tax vs. PH 10% cash dividend tax) into net returns.',
    ],
    keyPoints: [
      'Buying ON or AFTER the Ex-Dividend Date means the seller—not you—receives that payout.',
      'A $50 stock going ex-dividend for $1.00 opens with an adjusted reference price of $49.00, reflecting cash leaving the company.',
      'Short sellers open through the ex-dividend date must pay the dividend out of pocket.',
    ],
    practicalExample:
      'A stock closes at $40.00 the day before a $0.80 ex-dividend date. Next morning it opens around $39.20—your $0.80 cash dividend is offset by the −$0.80 share adjustment (minus dividend tax).',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S6.8'],
    optional: true,
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'When must you purchase a stock in order to qualify for its upcoming cash dividend?',
      options: [
        'On the Payment Date',
        'Strictly BEFORE the Ex-Dividend Date (at least one trading day prior)',
        'On the afternoon of the Ex-Dividend Date',
        'One week after the Record Date',
      ],
      correctIndex: 1,
      rationale: 'Shares begin trading without ("ex") the dividend on the Ex-Dividend Date, so buyers must hold the stock before that date.',
      commonTrap: 'Attempting "dividend capture" right before ex-date expecting free money while overlooking the automatic ex-date price drop and dividend tax.',
    },
  },
  {
    id: 'topic-s6-10',
    code: 'S6.10',
    slug: 'stocks-s6-10-corporate-actions',
    title: 'Corporate Actions',
    overviewEn:
      'Corporate actions—such as mergers, tender offers, spin-offs, rights offerings, ticker changes, and special dividends—directly change share ownership, cost basis, or open orders.',
    overviewTaglish:
      'Ang corporate actions tulad ng mergers, spin-offs, stock rights offerings (SRO), at ticker changes ay direktang nakakaapekto sa hawak mong shares, cost basis, at active broker orders.',
    objectives: [
      'Recognize mandatory actions (splits, name changes, spin-offs) versus voluntary elections (tender offers, stock rights offerings).',
      'Understand how stock rights offerings (common in PSE and global equities) dilute shareholders who ignore election deadlines.',
      'Check broker notices whenever corporate actions cancel Good-Til-Canceled (GTC) stop or limit orders.',
    ],
    keyPoints: [
      'Many brokers automatically cancel GTC open orders during splits, special dividends, or ticker changes—always re-verify your stops.',
      'In a spin-off, a parent company distributes shares of a subsidiary to existing shareholders, often creating temporary forced selling.',
      'Voluntary actions like tender offers or stock rights offerings carry strict broker cutoff dates.',
    ],
    practicalExample:
      'A conglomerate announces a 1-for-5 Stock Rights Offering at a 20% discount. Shareholders who miss the election deadline see their ownership diluted without receiving discounted shares.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['stocks'],
    prerequisiteCodes: ['S6.9'],
    optional: true,
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What operational detail should an active stock trader always double-check after a stock split, spin-off, or special dividend?',
      options: [
        'Whether the company switched to cryptocurrency',
        'Whether existing Good-Til-Canceled (GTC) stop-loss and limit orders were automatically cancelled or adjusted by the broker',
        'Whether past profits were erased from bank statements',
        'Whether the stock exchange changed its opening hour',
      ],
      correctIndex: 1,
      rationale: 'Corporate actions routinely cancel or reset open GTC orders; forgetting to re-enter protective stops can leave positions unprotected.',
      commonTrap: 'Ignoring broker corporate-action emails and missing a voluntary tender or stock rights offering deadline.',
    },
  },
];
