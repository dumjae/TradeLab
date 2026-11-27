import type { GlossaryTermEntry } from '../types/curriculum-tree';

export interface GlossaryCategoryMeta {
  id: 'all' | GlossaryTermEntry['category'];
  labelEn: string;
  labelTaglish: string;
}

export const GLOSSARY_CATEGORIES: GlossaryCategoryMeta[] = [
  { id: 'all', labelEn: 'All Terms', labelTaglish: 'Lahat ng Terms' },
  { id: 'fundamentals', labelEn: 'Fundamentals', labelTaglish: 'Fundamentals' },
  { id: 'charts', labelEn: 'Charts & TA', labelTaglish: 'Charts at TA' },
  { id: 'smc', labelEn: 'Market Structure & SMC', labelTaglish: 'Market Structure & SMC' },
  { id: 'risk', labelEn: 'Risk Management', labelTaglish: 'Risk Management' },
  { id: 'psychology', labelEn: 'Psychology', labelTaglish: 'Psychology' },
  { id: 'forex', labelEn: 'Forex', labelTaglish: 'Forex' },
  { id: 'indices', labelEn: 'Indices', labelTaglish: 'Indices' },
  { id: 'stocks', labelEn: 'Stocks', labelTaglish: 'Stocks' },
  { id: 'crypto', labelEn: 'Crypto', labelTaglish: 'Crypto' },
  { id: 'philippines', labelEn: 'Philippines (PSE)', labelTaglish: 'Pilipinas (PSE)' },
];

export const GLOSSARY_TERMS: GlossaryTermEntry[] = [
  // =========================================================================
  // FUNDAMENTALS (11 terms)
  // =========================================================================
  {
    id: 'fund-trading-vs-investing',
    term: 'Trading vs. Investing',
    category: 'fundamentals',
    definitionEn:
      'Trading targets shorter-term price swings using defined entries, stops, and exits, while investing builds wealth over years through compounding and business ownership.',
    definitionTaglish:
      'Ang trading ay nakatuon sa mas maikling galaw ng presyo na may malinaw na entry at stop loss, habang ang investing ay pangmatagalang pagpapalago ng kapital sa loob ng maraming taon.',
    example:
      'Holding a broad S&P 500 ETF for 10 years is investing; taking a 3-day swing position on EUR/USD with a 2R target is trading.',
    relatedTopicCode: '1.2',
  },
  {
    id: 'fund-supply-and-demand',
    term: 'Supply & Demand',
    category: 'fundamentals',
    definitionEn:
      'The core economic force behind price movement: when buying demand exceeds available selling supply, prices rise; when selling supply overwhelms demand, prices fall.',
    definitionTaglish:
      'Ang pangunahing puwersa sa likod ng galaw ng presyo: kapag mas marami ang buyers kaysa sellers, umaakyat ang presyo; kapag mas marami ang nagbebenta, bumababa ito.',
    example:
      'Strong earnings spark heavy buy orders above a stock’s supply zone, driving price rapidly higher until sellers step in.',
    relatedTopicCode: '1.5',
  },
  {
    id: 'fund-liquidity',
    term: 'Liquidity',
    category: 'fundamentals',
    definitionEn:
      'How easily an asset can be bought or sold without causing a sharp price jump, supported by deep order books and active market participants.',
    definitionTaglish:
      'Gaano kadaling makabili o makabenta ng asset nang hindi biglang tumatalon ang presyo dahil maraming active buyers at sellers sa order book.',
    example:
      'EUR/USD during the London–New York overlap has deep liquidity with tiny spreads, whereas a thinly traded penny stock can gap several percent on a small order.',
    relatedTopicCode: '2.5',
  },
  {
    id: 'fund-volatility',
    term: 'Volatility',
    category: 'fundamentals',
    definitionEn:
      'The speed and magnitude of an asset’s price fluctuations over a given period, reflecting both opportunity and the risk of wider stop-outs.',
    definitionTaglish:
      'Bilis at laki ng paggalaw ng presyo ng isang asset sa loob ng takdang oras—mas mataas ang volatility, mas malaki ang puwedeng galaw pero mas mataas din ang risk.',
    example:
      'US100 typically expands sharply in the first 30 minutes after the 9:30 PM PHT New York open compared to the quiet Asian afternoon.',
    relatedTopicCode: '2.6',
  },
  {
    id: 'fund-bid-ask-spread',
    term: 'Bid-Ask Spread',
    category: 'fundamentals',
    definitionEn:
      'The difference between the highest price a buyer will pay (Bid) and the lowest price a seller will accept (Ask), representing an immediate built-in transaction cost.',
    definitionTaglish:
      'Ang agwat sa pagitan ng Bid (pinakamataas na presyo ng buyer) at Ask (pinakamababang presyo ng seller), na agad mong binabayarang trading cost pagpasok ng order.',
    example:
      'If EUR/USD quotes 1.0850 Bid / 1.0851 Ask, the spread is 1.0 pip and a market buy immediately starts 1 pip below breakeven.',
    relatedTopicCode: '2.9',
  },
  {
    id: 'fund-slippage',
    term: 'Slippage',
    category: 'fundamentals',
    definitionEn:
      'The gap between your expected order price and the actual fill price, most common during high-impact news releases or thin liquidity.',
    definitionTaglish:
      'Pagkakaiba ng inaasahan mong entry o exit price kumpara sa aktwal na napunang presyo, lalo na kapag may malakas na news release o manipis ang liquidity.',
    example:
      'Placing a stop-loss at 1.0800 during US CPI data may fill at 1.0794 if price gaps straight through the level.',
    relatedTopicCode: '2.10',
  },
  {
    id: 'fund-market-order',
    term: 'Market Order',
    category: 'fundamentals',
    definitionEn:
      'An instruction to buy or sell immediately at the best available current market price, prioritizing speed of fill over exact price control.',
    definitionTaglish:
      'Utos na bumili o magbenta agad sa kasalukuyang pinakamagandang presyo sa merkado—mabilis ma-fill pero walang garantiya sa eksaktong presyo.',
    example:
      'Clicking Market Buy on BTC/USDT executes right away against the lowest resting Ask orders on the exchange.',
    relatedTopicCode: '2.8',
  },
  {
    id: 'fund-limit-order',
    term: 'Limit Order',
    category: 'fundamentals',
    definitionEn:
      'A pending order to buy at or below a specified price—or sell at or above it—giving strict price control with no guarantee the market will reach your level.',
    definitionTaglish:
      'Pending order para bumili sa eksaktong presyo o mas mababa, o magbenta sa eksaktong presyo o mas mataas—kontrolado ang presyo pero hindi garantisadong matatamaan.',
    example:
      'Setting a Buy Limit at ₱100.00 on a stock currently at ₱103.50 fills only if sellers push price down to ₱100.00 or lower.',
    relatedTopicCode: 'S2.3',
  },
  {
    id: 'fund-stop-order',
    term: 'Stop Order',
    category: 'fundamentals',
    definitionEn:
      'A conditional order that activates once price trades through a trigger level, commonly used to cap downside losses or enter confirmed breakouts.',
    definitionTaglish:
      'Conditional order na nag-a-activate kapag tinamaan ng presyo ang itinakdang trigger level, karaniwang ginagamit bilang stop loss o breakout entry.',
    example:
      'A Sell Stop at $195 below support triggers a market sell to exit a long stock position if support breaks.',
    relatedTopicCode: 'S2.4',
  },
  {
    id: 'fund-trading-session',
    term: 'Trading Session',
    category: 'fundamentals',
    definitionEn:
      'The scheduled operating hours of a regional exchange or global liquidity window, such as Tokyo, London, New York, or the Philippine Stock Exchange.',
    definitionTaglish:
      'Nakatakdang oras ng pagbubukas ng isang merkado o liquidity window gaya ng Tokyo, London, New York, o PSE, kung kailan iba-iba ang volume at volatility.',
    example:
      'The London–New York overlap (8:00 PM–12:00 AM PHT during US DST) typically delivers the highest daily volume for major forex pairs.',
    relatedTopicCode: '2.7',
  },
  {
    id: 'fund-bullish-vs-bearish',
    term: 'Bullish vs. Bearish',
    category: 'fundamentals',
    definitionEn:
      'Bullish describes an upward trend or expectation of rising prices, while bearish describes a downward trend or expectation of falling prices.',
    definitionTaglish:
      'Ang bullish ay tumutukoy sa pataas na trend o inaasahang pag-akyat ng presyo, habang ang bearish ay pababang trend o inaasahang pagbaba ng presyo.',
    example:
      'A stock printing higher highs and higher lows above its 200-day moving average is in a bullish trend.',
    relatedTopicCode: '1.6',
  },

  // =========================================================================
  // CHARTS & TECHNICAL ANALYSIS (12 terms)
  // =========================================================================
  {
    id: 'chart-candlestick-ohlc',
    term: 'Candlestick (OHLC)',
    acronym: 'OHLC',
    category: 'charts',
    definitionEn:
      'A price bar displaying four values for one time period—Open, High, Low, and Close—with a solid body between Open/Close and wicks marking the extremes.',
    definitionTaglish:
      'Price bar na nagpapakita ng Open, High, Low, at Close sa isang timeframe—ang body ay ang pagitan ng Open at Close, at ang wicks ang pinakamataas at pinakamababang naabot.',
    example:
      'A 1H candle with a long lower wick closing near its high shows buyers aggressively absorbed selling pressure below.',
    relatedTopicCode: '3.3',
  },
  {
    id: 'chart-timeframe',
    term: 'Timeframe (5m / 15m / 1H / 4H / 1D)',
    acronym: 'TF',
    category: 'charts',
    definitionEn:
      'The duration represented by each candlestick on a chart; higher timeframes filter noise and define macro bias, while lower timeframes refine entries.',
    definitionTaglish:
      'Haba ng oras na kinakatawan ng bawat candle sa chart—mas mataas na timeframe para sa pangunahing direksiyon, mas mababang timeframe para sa eksaktong entry.',
    example:
      'Mapping trend direction on the 1D and 4H charts before refining stop placement on the 15m chart.',
    relatedTopicCode: '1.8',
  },
  {
    id: 'chart-support-resistance',
    term: 'Support & Resistance',
    acronym: 'S/R',
    category: 'charts',
    definitionEn:
      'Historical price zones where buying interest repeatedly slowed declines (Support) or selling pressure repeatedly capped rallies (Resistance).',
    definitionTaglish:
      'Mga zone sa chart kung saan paulit-ulit na humihinto ang pagbaba ng presyo dahil sa buyers (Support) o nahihirapang umakyat dahil sa sellers (Resistance).',
    example:
      'Gold bouncing three times from $2,300 marks support; once $2,300 breaks cleanly, that same zone can flip into resistance.',
    relatedTopicCode: '4.1',
  },
  {
    id: 'chart-trendline',
    term: 'Trendline',
    category: 'charts',
    definitionEn:
      'A diagonal line connecting at least two ascending swing lows in an uptrend or two descending swing highs in a downtrend to visualize directional momentum.',
    definitionTaglish:
      'Pahilis na linyang nagdurugtong sa dalawa o higit pang tumataas na lows (uptrend) o bumababang highs (downtrend) para makita ang bilis at direksiyon ng trend.',
    example:
      'Drawing an ascending trendline beneath three consecutive higher lows on the 4H chart helps frame dynamic pullback areas.',
    relatedTopicCode: '4.2',
  },
  {
    id: 'chart-breakout-vs-fakeout',
    term: 'Breakout vs. Fakeout',
    category: 'charts',
    definitionEn:
      'A breakout occurs when price clears a key level and sustains beyond it with volume, while a fakeout briefly pierces the level before snapping back inside the range.',
    definitionTaglish:
      'Ang breakout ay tuloy-tuloy na paglampas ng presyo sa isang key level na may kumpirmasyon, habang ang fakeout ay mabilis na paglampas lang saka bumabalik agad sa loob ng range.',
    example:
      'Price pokes above resistance on a 15m wick and closes back inside the range, trapping breakout buyers in a fakeout.',
    relatedTopicCode: '4.5',
  },
  {
    id: 'chart-pullback',
    term: 'Pullback',
    category: 'charts',
    definitionEn:
      'A temporary counter-trend pause or retracement within an intact larger trend that often offers a cleaner risk-to-reward entry than chasing extended candles.',
    definitionTaglish:
      'Pansamantalang paghinga o pag-atras ng presyo laban sa pangunahing trend na kadalasang mas magandang pasukan kaysa maghabol sa tuktok o ilalim.',
    example:
      'After breaking above $50, a stock pulls back to retest $50 as support before resuming its upward move.',
    relatedTopicCode: '4.6',
  },
  {
    id: 'chart-moving-average',
    term: 'Moving Average (EMA / SMA)',
    acronym: 'EMA / SMA',
    category: 'charts',
    definitionEn:
      'A trend-smoothing indicator averaging past closing prices; Simple Moving Averages (SMA) weight all bars equally, while Exponential Moving Averages (EMA) weight recent candles more heavily.',
    definitionTaglish:
      'Indicator na nagpapakinis ng galaw ng presyo gamit ang average ng nakaraang candles; pantay ang bigat sa SMA habang mas mabilis mag-react ang EMA sa pinakabagong presyo.',
    example:
      'Swing traders often track the 20 EMA for short-term momentum and the 200 SMA to gauge the long-term daily trend.',
    relatedTopicCode: '4.7',
  },
  {
    id: 'chart-rsi',
    term: 'Relative Strength Index (RSI)',
    acronym: 'RSI',
    category: 'charts',
    definitionEn:
      'A 0–100 momentum oscillator measuring the speed of recent gains versus losses; readings above 70 or below 30 flag stretched momentum, not automatic reversals.',
    definitionTaglish:
      'Oscillator mula 0 hanggang 100 na sumusukat sa lakas ng momentum; ang lagpas 70 o babang 30 ay senyales ng malakas o banat na galaw, pero hindi awtomatikong reversal.',
    example:
      'In a strong uptrend, RSI can stay above 65 for days, so traders pair RSI divergence with structure breaks rather than shorting 70 blindly.',
    relatedTopicCode: '4.8',
  },
  {
    id: 'chart-macd',
    term: 'Moving Average Convergence Divergence (MACD)',
    acronym: 'MACD',
    category: 'charts',
    definitionEn:
      'A trend-following momentum indicator comparing a fast EMA (12) and slow EMA (26) alongside a 9-period signal line and histogram to show shifts in momentum.',
    definitionTaglish:
      'Indicator na nagkukumpara ng mabilis (12 EMA) at mabagal (26 EMA) na moving average kasama ang signal line at histogram para makita kung lumalakas o humihina ang trend.',
    example:
      'A shrinking MACD histogram as price makes a marginally higher high warns that bullish momentum is slowing down.',
    relatedTopicCode: '4.9',
  },
  {
    id: 'chart-fibonacci-retracement',
    term: 'Fibonacci Retracement',
    acronym: 'Fib',
    category: 'charts',
    definitionEn:
      'A technical overlay plotting percentage pullback ratios (such as 38.2%, 50%, and 61.8%) between a swing high and swing low to map potential reaction zones.',
    definitionTaglish:
      'Chart tool na nagmamarka ng mga porsiyento ng pag-atras (gaya ng 38.2%, 50%, at 61.8%) mula sa isang swing high at swing low upang tukuyin ang posibleng reaction zones.',
    example:
      'Measuring an impulsive rally from $100 to $120 puts the 61.8% Fibonacci retracement level near $107.64.',
    relatedTopicCode: '4.10',
  },
  {
    id: 'chart-volume',
    term: 'Volume',
    category: 'charts',
    definitionEn:
      'The total number of shares, contracts, or tokens traded during a specific candle, helping confirm whether a price move has broad participation behind it.',
    definitionTaglish:
      'Kabuuang dami ng shares, contracts, o coins na nai-trade sa loob ng isang candle—nakakatulong ito para makita kung may tunay na lakas ang isang breakout o galaw.',
    example:
      'A resistance breakout backed by 2.5x average daily volume is far more reliable than a breakout on quiet midday volume.',
    relatedTopicCode: '4.11',
  },
  {
    id: 'chart-multi-timeframe-analysis',
    term: 'Multi-Timeframe Analysis (MTF)',
    acronym: 'MTF',
    category: 'charts',
    definitionEn:
      'Analyzing the same market from higher to lower timeframes (e.g., Daily → 1H → 5m) so intraday executions align with the broader directional context.',
    definitionTaglish:
      'Pagsusuri ng parehong chart mula mataas pababa sa mababang timeframe (hal. Daily → 1H → 5m) para tugma ang entry mo sa mas malaking direksiyon ng merkado.',
    example:
      'Identifying a Daily uptrend and waiting for a 15m higher low at a 1H demand level instead of trading against the Daily trend.',
    relatedTopicCode: '3.7',
  },

  // =========================================================================
  // MARKET STRUCTURE & SMC — NEUTRAL ANALYTICAL CONCEPTS (17 terms)
  // =========================================================================
  {
    id: 'smc-market-structure',
    term: 'Market Structure',
    acronym: 'MS',
    category: 'smc',
    definitionEn:
      'An analytical framework for mapping the sequence of swing highs and swing lows to classify whether price is trending upward, trending downward, or ranging.',
    definitionTaglish:
      'Analytical framework sa pagbasa ng sunod-sunod na swing highs at swing lows upang matukoy kung pataas, pababa, o sideways ang galaw ng merkado.',
    example:
      'Consistent Higher Highs (HH) and Higher Lows (HL) on the 4H chart define bullish market structure until a key Higher Low breaks.',
    relatedTopicCode: '7.1',
  },
  {
    id: 'smc-bos',
    term: 'Break of Structure (BOS)',
    acronym: 'BOS',
    category: 'smc',
    definitionEn:
      'A price-action concept describing a candle close beyond a prior swing point in the direction of the existing trend, used as evidence of trend continuation.',
    definitionTaglish:
      'Konsepto sa price action kung saan nagsasara ang candle lampas sa dating swing point sa direksiyon ng kasalukuyang trend bilang senyales ng pagpapatuloy nito.',
    example:
      'In an uptrend, a decisive 1H candle body close above the previous swing high is labeled a bullish BOS.',
    relatedTopicCode: '7.3',
  },
  {
    id: 'smc-mss',
    term: 'Market Structure Shift (MSS)',
    acronym: 'MSS',
    category: 'smc',
    definitionEn:
      'An analytical signal in price-action frameworks where price breaks an opposing structural swing with strong momentum, suggesting a potential directional shift.',
    definitionTaglish:
      'Analytical signal kung saan mabilis na binabasag ng presyo ang mahalagang swing sa kabilang direksiyon, na nagpapahiwatig ng posibleng pagbabago ng bias.',
    example:
      'After sweeping a session high, a strong bearish candle closing below the prior 5m higher low is read as a bearish MSS.',
    relatedTopicCode: '7.4',
  },
  {
    id: 'smc-choch',
    term: 'Change of Character (CHoCH)',
    acronym: 'CHoCH',
    category: 'smc',
    definitionEn:
      'A chart-reading label for the first internal break against a prevailing trend, treated as an early warning of weakening momentum rather than a guaranteed reversal.',
    definitionTaglish:
      'Termino para sa unang pagkabasag ng internal structure laban sa kasalukuyang trend—maagang babala ito na humihina ang trend pero hindi garantisadong reversal.',
    example:
      'In a downtrend, price closing above the most recent lower high marks a bullish CHoCH that prompts caution on new shorts.',
    relatedTopicCode: '7.5',
  },
  {
    id: 'smc-bsl',
    term: 'Buy-Side Liquidity (BSL)',
    acronym: 'BSL',
    category: 'smc',
    definitionEn:
      'An analytical concept identifying zones above swing highs or equal highs where short-sellers’ buy-stop losses and breakout buy orders often cluster.',
    definitionTaglish:
      'Analytical zone sa itaas ng mga swing high o equal highs kung saan karaniwang naiipon ang stop loss ng mga short sellers at mga breakout buy orders.',
    example:
      'Clean equal highs from the previous day’s session are mapped as a Buy-Side Liquidity pool on the 1H chart.',
    relatedTopicCode: '8.4',
  },
  {
    id: 'smc-ssl',
    term: 'Sell-Side Liquidity (SSL)',
    acronym: 'SSL',
    category: 'smc',
    definitionEn:
      'An analytical concept identifying zones below swing lows or equal lows where long traders’ sell-stop losses and breakdown sell orders tend to rest.',
    definitionTaglish:
      'Analytical zone sa ibaba ng mga swing low o equal lows kung saan kadalasang nakalagay ang stop loss ng mga buyers at mga breakdown sell orders.',
    example:
      'Double bottoms sitting right above a round number are monitored as a Sell-Side Liquidity area where stops may cluster.',
    relatedTopicCode: '8.5',
  },
  {
    id: 'smc-liquidity-sweep',
    term: 'Liquidity Sweep',
    category: 'smc',
    definitionEn:
      'A price-action pattern where price briefly spikes past an obvious high or low to trigger resting stop orders before quickly rejecting back into the prior range.',
    definitionTaglish:
      'Galaw ng presyo kung saan mabilis itong sumisilip lampas sa halatang high o low para tamaan ang mga stop order, saka mabilis na bumabalik sa loob ng range.',
    example:
      'EUR/USD wicks 8 pips below the Asian session low and closes back inside the range, framing a potential bullish sweep setup.',
    relatedTopicCode: '8.6',
  },
  {
    id: 'smc-inducement',
    term: 'Inducement',
    acronym: 'IDM',
    category: 'smc',
    definitionEn:
      'In SMC chart analysis, a minor internal swing or obvious early pullback level that can attract premature entries before price reaches a deeper area of interest.',
    definitionTaglish:
      'Sa SMC analysis, ito ay maliit o maagang swing level na madalas pasukan agad ng mga nagmamadaling trader bago pa umabot ang presyo sa mas malalim na zone.',
    example:
      'Waiting for price to sweep a shallow 15m internal low (inducement) before looking for confirmation at the 1H demand zone below.',
    relatedTopicCode: '8.7',
  },
  {
    id: 'smc-order-block',
    term: 'Order Block (OB)',
    acronym: 'OB',
    category: 'smc',
    definitionEn:
      'A price-action reference zone marking the last opposing candle(s) immediately before a strong impulsive move that breaks structure, tested probabilistically as future S/R.',
    definitionTaglish:
      'Reference zone sa chart na tumutukoy sa huling kasalungat na candle bago ang malakas na impulsive move—ginagamit itong probabilistic zone, hindi garantisadong bounce.',
    example:
      'The last bearish 1H candle right before a sharp rally that broke prior highs is marked as a bullish Order Block for possible retests.',
    relatedTopicCode: '8.8',
  },
  {
    id: 'smc-breaker-block',
    term: 'Breaker Block',
    acronym: 'BB',
    category: 'smc',
    definitionEn:
      'A failed Order Block that price slices straight through with momentum, subsequently analyzed as a flipped support-turned-resistance (or resistance-turned-support) zone.',
    definitionTaglish:
      'Order Block na nabigo at nilampasan nang malakas ng presyo, kaya sinusuri na ito sa kabilang banda bilang support-turned-resistance o vice versa.',
    example:
      'When a bullish OB fails to hold and price closes decisively below it, traders watch a retest of that zone from underneath as a bearish Breaker Block.',
    relatedTopicCode: '8.9',
  },
  {
    id: 'smc-fvg',
    term: 'Fair Value Gap (FVG)',
    acronym: 'FVG',
    category: 'smc',
    definitionEn:
      'A three-candle price imbalance where the first and third candle wicks do not overlap around a strong middle candle, analyzed as a zone price may later revisit.',
    definitionTaglish:
      'Three-candle price imbalance kung saan hindi nagtatagpo ang wick ng una at ikatlong candle dahil sa malakas na gitnang candle; posibleng balikan ng presyo pero hindi laging napupuno.',
    example:
      'A rapid bullish 15m surge leaves an unfilled gap between Candle 1’s high and Candle 3’s low, mapped as a bullish FVG.',
    relatedTopicCode: '8.11',
  },
  {
    id: 'smc-ifvg',
    term: 'Inverse Fair Value Gap (IFVG)',
    acronym: 'IFVG',
    category: 'smc',
    definitionEn:
      'A Fair Value Gap that fails to hold as support or resistance after price closes completely through it, then treated analytically as a flipped reaction level.',
    definitionTaglish:
      'Fair Value Gap na hindi nakapigil sa presyo at tinagos nang buo ng candle close, kaya ginagamit na ito bilang baligtad na reaction zone sa bagong direksiyon.',
    example:
      'If a bearish 5m FVG is broken upward by a strong bullish close, analysts reclassify it as a bullish IFVG on pullbacks.',
    relatedTopicCode: '8.12',
  },
  {
    id: 'smc-premium-discount',
    term: 'Premium & Discount Zones',
    category: 'smc',
    definitionEn:
      'An analytical range framework dividing a dealing swing at its 50% midpoint: prices above 50% are termed Premium (favored for shorts in downtrends) and below 50% Discount (favored for longs in uptrends).',
    definitionTaglish:
      'Paghahati ng isang price swing sa 50% gitna: ang itaas ng 50% ay Premium (mas angkop suriin para sa shorts sa downtrend) at ang ibaba ay Discount (para sa longs sa uptrend).',
    example:
      'In a bullish dealing range from 1.0700 to 1.0900, waiting for price below the 1.0800 equilibrium keeps entries inside the Discount half.',
    relatedTopicCode: '8.13',
  },
  {
    id: 'smc-displacement',
    term: 'Displacement',
    category: 'smc',
    definitionEn:
      'A fast, energetic sequence of large-bodied candles showing strong directional conviction and often leaving Fair Value Gaps behind, distinguishing decisive moves from slow drift.',
    definitionTaglish:
      'Mabilis at malakas na sunod-sunod na malalaking candle bodies na nagpapakita ng matinding momentum at kadalasang nag-iiwan ng FVG—senyales ng malinaw na lakas ng isang panig.',
    example:
      'Three consecutive wide-bodied bearish 5m candles slicing through support show stronger displacement than a slow, choppy grind lower.',
    relatedTopicCode: '9.1',
  },
  {
    id: 'smc-power-of-three',
    term: 'Power of Three (AMD)',
    acronym: 'AMD',
    category: 'smc',
    definitionEn:
      'A conceptual session template dividing price action into Accumulation (consolidation), Manipulation (false break/sweep), and Distribution (directional expansion)—a heuristic, not a fixed rule.',
    definitionTaglish:
      'Konseptuwal na modelo ng session na nahahati sa Accumulation (sideways), Manipulation (false breakout), at Distribution (tunay na direksiyon)—gabay lang ito at hindi nangyayari araw-araw.',
    example:
      'An Asian range (Accumulation) followed by a brief London-open drop below the range (Manipulation) and an afternoon rally (Distribution).',
    relatedTopicCode: '9.7',
  },
  {
    id: 'smc-ote',
    term: 'Optimal Trade Entry (OTE)',
    acronym: 'OTE',
    category: 'smc',
    definitionEn:
      'A popular Fibonacci retracement pocket between 61.8% and 78.6% (centered near 70.5%) used within price-action frameworks to seek discounted entries inside a confirmed swing.',
    definitionTaglish:
      'Pocket sa Fibonacci retracement mula 61.8% hanggang 78.6% (sentro sa 70.5%) na ginagamit sa price-action frameworks para maghanap ng mas magandang risk-reward entry sa pullback.',
    example:
      'Combining a 70.5% OTE retracement with an overlapping 15m FVG adds confluence while keeping the stop loss below the swing low.',
    relatedTopicCode: '9.8',
  },
  {
    id: 'smc-smt-divergence',
    term: 'SMT Divergence',
    acronym: 'SMT',
    category: 'smc',
    definitionEn:
      'Smart Money Technique divergence: a relative-strength comparison where two closely correlated assets fail to confirm each other’s new swing high or swing low.',
    definitionTaglish:
      'Pagkukumpara ng dalawang magka-ugnay na merkado kung saan ang isa ay gumawa ng bagong high o low pero ang kapares nito ay hindi sumunod, na maaaring senyales ng paghina.',
    example:
      'US100 prints a fresh session high while US500 fails to break its prior high at the same timestamp, signaling short-term bullish divergence weakness.',
    relatedTopicCode: '9.5',
  },

  // =========================================================================
  // RISK MANAGEMENT (9 terms)
  // =========================================================================
  {
    id: 'risk-per-trade-1r',
    term: 'Risk Per Trade (1R)',
    acronym: '1R',
    category: 'risk',
    definitionEn:
      'The fixed maximum dollar or percentage amount you are willing to lose if a trade hits its stop loss—standardized as 1R (typically 0.5% to 2% of equity for beginners).',
    definitionTaglish:
      'Itinakdang pinakamalaking halaga o porsiyento ng account na handa mong matalo kapag tinamaan ang stop loss (tinatawag na 1R, karaniwang 0.5%–2% lang ng kapital).',
    example:
      'On a $5,000 account risking 1% per trade, 1R equals $50 regardless of whether your stop loss is 10 pips or 50 pips wide.',
    relatedTopicCode: '5.3',
  },
  {
    id: 'risk-reward-ratio',
    term: 'Risk-to-Reward Ratio (RR)',
    acronym: 'RR',
    category: 'risk',
    definitionEn:
      'The ratio comparing how much you risk to your stop loss versus how much you aim to gain at your take profit; higher RR allows profitability even below a 50% win rate.',
    definitionTaglish:
      'Paghahambing ng posibleng talo (risk) laban sa target na kita (reward)—kapag mas mataas ang RR, puwede ka pa ring kumita kahit hindi lagpas 50% ang win rate mo.',
    example:
      'Risking $50 (1R) to target $150 (3R) is a 1:3 RR setup, requiring only a 25%+ win rate before fees to break even.',
    relatedTopicCode: '5.4',
  },
  {
    id: 'risk-position-sizing',
    term: 'Position Sizing',
    category: 'risk',
    definitionEn:
      'Calculating the exact number of shares, lots, or contracts to trade based on your account risk (1R) divided by your stop-loss distance so every trade carries controlled risk.',
    definitionTaglish:
      'Pagkompyut ng eksaktong dami ng shares, lots, o contracts batay sa nakalaang risk (1R) at layo ng stop loss para hindi lumampas sa plano ang posibleng talo.',
    example:
      'With a $100 risk budget and a $2.00 stop distance on a stock, your calculated position size is exactly 50 shares.',
    relatedTopicCode: '5.5',
  },
  {
    id: 'risk-stop-loss',
    term: 'Stop Loss (SL)',
    acronym: 'SL',
    category: 'risk',
    definitionEn:
      'A pre-set exit order that automatically closes your position at a defined invalidation level to prevent a small loss from turning into an account-damaging drawdown.',
    definitionTaglish:
      'Naka-set na exit order na awtomatikong nagsasara ng trade kapag nabali ang setup mo upang mapigilan ang maliit na talo na lumaki nang sobra.',
    example:
      'Placing a hard Stop Loss just below the swing low that would invalidate a bullish pullback thesis before clicking Buy.',
    relatedTopicCode: '5.6',
  },
  {
    id: 'risk-take-profit',
    term: 'Take Profit (TP)',
    acronym: 'TP',
    category: 'risk',
    definitionEn:
      'A pre-set limit order that automatically locks in gains when price reaches your planned target level, preventing greed from turning winners back into losses.',
    definitionTaglish:
      'Naka-set na target order na awtomatikong nagsasara ng trade na may kita kapag umabot ang presyo sa plano mong level para hindi masayang ang tubo.',
    example:
      'Setting TP1 at +2R near prior resistance to bank partial profit and TP2 at +3R on a trend continuation.',
    relatedTopicCode: '5.6',
  },
  {
    id: 'risk-breakeven',
    term: 'Breakeven (BE)',
    acronym: 'BE',
    category: 'risk',
    definitionEn:
      'The price point where closing a trade yields zero net profit or loss after accounting for spreads and commissions; moving a stop to BE removes principal risk once a trade moves favorably.',
    definitionTaglish:
      'Presyo kung saan tabla ang trade pagkatapos ibawas ang spread at fees; ang pag-move ng stop loss sa BE ay nagpoprotekta ng kapital pero huwag gawin nang masyadong maaga.',
    example:
      'After price hits +1.5R and breaks an internal high, shifting the stop loss to entry plus commission locks in a breakeven floor.',
    relatedTopicCode: '5.10',
  },
  {
    id: 'risk-max-drawdown',
    term: 'Maximum Drawdown (MDD)',
    acronym: 'MDD',
    category: 'risk',
    definitionEn:
      'The largest peak-to-trough percentage drop an account experiences before recovering to a new equity high, measuring real-world downside stress.',
    definitionTaglish:
      'Pinakamalaking porsiyentong pagbagsak ng account mula sa pinakamataas na balance pababa sa pinakamababa bago ito makabawi—sukatan ng totoong sakit ng isang losing streak.',
    example:
      'If an account grows from $10,000 to $12,000 and then drops to $10,200, its drawdown from peak is 15%.',
    relatedTopicCode: '5.7',
  },
  {
    id: 'risk-expectancy',
    term: 'Expectancy',
    category: 'risk',
    definitionEn:
      'The average amount (in dollars or R-multiples) a trading strategy is expected to win or lose per trade over a large sample: (Win% × Avg Win) − (Loss% × Avg Loss).',
    definitionTaglish:
      'Average na kita o talo bawat trade sa mahabang sample ng isang strategy—positibong expectancy lang ang nakakapagpalago ng account sa katagalan.',
    example:
      'A 40% win rate averaging +2.5R winners and −1R losers has positive expectancy of (0.40 × 2.5) − (0.60 × 1) = +0.40R per trade.',
    relatedTopicCode: 'ST7.14',
  },
  {
    id: 'risk-of-ruin',
    term: 'Risk of Ruin',
    acronym: 'RoR',
    category: 'risk',
    definitionEn:
      'The statistical probability of losing enough capital that you can no longer continue trading—driven primarily by oversized risk per trade and poor win/RR math.',
    definitionTaglish:
      'Estadistikal na tsansa na maubos ang trading capital mo dahil sa sobrang laking risk bawat trade o walang edge na strategy.',
    example:
      'Risking 10% per trade puts you down 65% after 10 losses in a row, whereas risking 1% keeps drawdown under 10% over the same streak.',
    relatedTopicCode: '5.9',
  },

  // =========================================================================
  // TRADING PSYCHOLOGY (7 terms)
  // =========================================================================
  {
    id: 'psych-fomo',
    term: 'Fear of Missing Out (FOMO)',
    acronym: 'FOMO',
    category: 'psychology',
    definitionEn:
      'The emotional urge to chase a fast-moving candle without a valid setup because you fear being left behind, usually resulting in poor entry prices and wide stops.',
    definitionTaglish:
      'Pakiramdam na baka maiwan ka sa malakas na galaw kaya napapahabol ka ng entry kahit walang malinaw na setup, na madalas nauuwi sa tuktok na pagbili.',
    example:
      'Buying a crypto coin after a +15% vertical green candle instead of waiting for a planned pullback or skipping the move.',
    relatedTopicCode: '6.3',
  },
  {
    id: 'psych-revenge-trading',
    term: 'Revenge Trading',
    category: 'psychology',
    definitionEn:
      'Jumping immediately back into the market—often with double size—right after a loss in an emotional attempt to win the money back quickly.',
    definitionTaglish:
      'Agarang pagpasok ulit sa trade—madalas mas malaki pa ang lot size—pagkatapos matalo para makabawi agad, na lalong nagpapalala sa talo.',
    example:
      'Losing 1R on a valid setup and instantly opening a 3R impulse trade with no checklist confirmation.',
    relatedTopicCode: '6.4',
  },
  {
    id: 'psych-overtrading',
    term: 'Overtrading',
    category: 'psychology',
    definitionEn:
      'Taking too many low-quality trades out of boredom, impatience, or a need for constant action, which drains capital through fees and subpar setups.',
    definitionTaglish:
      'Sobra-sobrang pagpasok sa malalabong trade dahil sa inip o pagkainip sa kita, na umuubos ng account sa fees at maliliit na talo.',
    example:
      'Forcing 14 trades on a choppy holiday afternoon when your trading plan caps daily attempts at 2 A+ setups.',
    relatedTopicCode: '6.5',
  },
  {
    id: 'psych-confirmation-bias',
    term: 'Confirmation Bias',
    category: 'psychology',
    definitionEn:
      'The mental habit of seeking only charts, news, or opinions that agree with your open position while ignoring clear warning signs that your trade thesis is broken.',
    definitionTaglish:
      'Ugaling paghahanap lang ng balita o chart pattern na pabor sa open position mo habang binabalewala ang malinaw na senyales na mali na ang trade.',
    example:
      'Holding a losing long below broken daily support because one social media post still calls for a rally.',
    relatedTopicCode: '6.7',
  },
  {
    id: 'psych-tilt',
    term: 'Tilt',
    category: 'psychology',
    definitionEn:
      'A state of emotional frustration or mental overload where rational rule-following breaks down, leading to erratic sizing, moved stop losses, and compounding mistakes.',
    definitionTaglish:
      'Estado ng galit, pagkabigo, o mental overload kung saan nawawala na ang disiplina at sunod-sunod nang nilalabag ang trading rules.',
    example:
      'Triggering a hard 2R daily loss lock and stepping away from the screen for 24 hours prevents a normal red day from turning into full tilt.',
    relatedTopicCode: '6.8',
  },
  {
    id: 'psych-trading-journal',
    term: 'Trading Journal',
    category: 'psychology',
    definitionEn:
      'A structured log recording every trade’s setup, entry, stop, exit, R-multiple, screenshots, and emotional state so you can audit habits objectively.',
    definitionTaglish:
      'Organisadong talaan ng bawat trade—kasama ang setup, entry, stop loss, resulta, screenshot, at emosyon—para makita sa datos kung ano ang gumagana at dapat ayusin.',
    example:
      'Reviewing 40 journaled trades reveals that 80% of your losses happen after 11:00 PM PHT when you are fatigued.',
    relatedTopicCode: 'ST7.11',
  },
  {
    id: 'psych-trading-discipline',
    term: 'Trading Discipline',
    category: 'psychology',
    definitionEn:
      'The consistent ability to execute your written trading plan—taking valid setups, respecting stop losses, and sitting on your hands when conditions are unclear.',
    definitionTaglish:
      'Kakayahang sumunod nang paulit-ulit sa nakasulat mong trading plan—pasok lang kapag kumpleto ang rules at marunong maghintay kapag magulo ang merkado.',
    example:
      'Closing your platform with zero trades taken on a choppy FOMC afternoon because none of your setup criteria triggered.',
    relatedTopicCode: '6.6',
  },

  // =========================================================================
  // FOREX (9 terms)
  // =========================================================================
  {
    id: 'fx-currency-pair',
    term: 'Currency Pair (Base / Quote)',
    category: 'forex',
    definitionEn:
      'In forex, currencies trade in pairs where the first is the Base currency and the second is the Quote currency—showing how much Quote currency buys 1 unit of Base.',
    definitionTaglish:
      'Sa forex, laging pares ang tinetrade: ang una ay Base currency at ang pangalawa ay Quote currency—ipinapakita nito kung magkano ang Quote para makabili ng 1 Base.',
    example:
      'EUR/USD at 1.0900 means 1 Euro (Base) costs 1.0900 US Dollars (Quote); buying EUR/USD bets the Euro rises against the Dollar.',
    relatedTopicCode: 'F1.5',
  },
  {
    id: 'fx-pip-pipette',
    term: 'Pip & Pipette',
    acronym: 'Pip',
    category: 'forex',
    definitionEn:
      'A pip (Percentage in Point) is the standard fourth-decimal price increment on most forex pairs (0.0001, or 0.01 on JPY pairs), while a pipette is one-tenth of a pip.',
    definitionTaglish:
      'Ang pip ang karaniwang sukatan ng galaw sa forex (pang-apat na decimal, o pangalawa sa JPY pairs), habang ang pipette ay ikasampung bahagi ng isang pip.',
    example:
      'EUR/USD rising from 1.08500 to 1.08655 is a gain of 15.5 pips (15 pips and 5 pipettes).',
    relatedTopicCode: 'F1.6',
  },
  {
    id: 'fx-lot-size',
    term: 'Lot Size (Standard / Mini / Micro)',
    category: 'forex',
    definitionEn:
      'Standardized forex trade units: 1.00 Standard lot = 100,000 base units (~$10/pip on EUR/USD), 0.10 Mini lot = 10,000 (~$1/pip), and 0.01 Micro lot = 1,000 (~$0.10/pip).',
    definitionTaglish:
      'Standard na laki ng position sa forex: 1.00 Standard (~$10/pip), 0.10 Mini (~$1/pip), at 0.01 Micro (~$0.10/pip sa USD-quoted pairs).',
    example:
      'To risk $20 with a 20-pip stop loss on EUR/USD, you trade 0.10 lot (1 Mini lot at $1 per pip).',
    relatedTopicCode: 'F1.7',
  },
  {
    id: 'fx-leverage-margin',
    term: 'Leverage & Margin',
    category: 'forex',
    definitionEn:
      'Leverage lets you control a larger notional position using a smaller collateral deposit called Margin—magnifying both gains and losses at the exact same rate.',
    definitionTaglish:
      'Pinapayagan ka ng leverage na humawak ng mas malaking posisyon gamit lang ang mas maliit na collateral (Margin)—pero doble-talim ito dahil sabay lumalaki ang kita at talo.',
    example:
      'At 50:1 leverage, controlling a $10,000 mini lot requires $200 in margin, yet a 100-pip adverse move still loses $100.',
    relatedTopicCode: 'F2.5',
  },
  {
    id: 'fx-margin-call-stop-out',
    term: 'Margin Call / Stop-Out',
    category: 'forex',
    definitionEn:
      'A Margin Call warns that your account equity has fallen dangerously close to required margin, while Stop-Out is the broker’s automatic forced closure of open positions to prevent negative equity.',
    definitionTaglish:
      'Babala ang Margin Call na halos ubos na ang free margin mo, at ang Stop-Out naman ay awtomatikong pagsasara ng broker sa open trades mo para hindi mag-negatibo ang account.',
    example:
      'If a broker sets Stop-Out at 50% margin level and unrealized losses push equity below half of used margin, trades are closed automatically.',
    relatedTopicCode: 'F2.7',
  },
  {
    id: 'fx-overnight-swap',
    term: 'Overnight Swap',
    category: 'forex',
    definitionEn:
      'The daily rollover interest paid or earned for holding a leveraged forex position past the 5:00 PM New York daily cutoff (5:00 AM / 6:00 AM PHT), reflecting interest-rate differentials.',
    definitionTaglish:
      'Interest fee o credit kapag iniwang bukas ang leveraged forex trade lagpas sa daily rollover cutoff, depende sa diperensiya ng interest rate ng dalawang currency.',
    example:
      'Holding a leveraged position across Wednesday rollover typically incurs triple swap to cover weekend settlement days.',
    relatedTopicCode: 'F2.8',
  },
  {
    id: 'fx-cpi-nfp',
    term: 'CPI & NFP',
    acronym: 'CPI / NFP',
    category: 'forex',
    definitionEn:
      'Two premier US macroeconomic releases—Consumer Price Index (inflation) and Non-Farm Payrolls (jobs growth)—that heavily sway Federal Reserve rate expectations and USD volatility.',
    definitionTaglish:
      'Dalawang pinakamalaking US economic report—CPI (inflation) at NFP (trabaho)—na malakas magpagalaw sa USD, ginto, at stock indices dahil nakakaapekto ito sa Federal Reserve.',
    example:
      'Spreads on EUR/USD and XAU/USD can widen dramatically at 8:30 PM PHT (DST) when US CPI prints hotter than consensus.',
    relatedTopicCode: 'F4.5',
  },
  {
    id: 'fx-hawkish-vs-dovish',
    term: 'Hawkish vs. Dovish',
    category: 'forex',
    definitionEn:
      'Central-bank policy stances: Hawkish favors higher interest rates to cool inflation (typically supporting a currency), while Dovish favors lower rates to stimulate growth.',
    definitionTaglish:
      'Paninindigan ng central bank: ang Hawkish ay pabor sa mas mataas na interest rate kontra inflation (kadalasang pampalakas ng currency), habang ang Dovish ay pabor sa pagbaba ng rate.',
    example:
      'A surprisingly hawkish Federal Reserve press conference often lifts US Treasury yields and strengthens the US Dollar.',
    relatedTopicCode: 'F4.9',
  },
  {
    id: 'fx-kill-zones',
    term: 'Kill Zones',
    category: 'forex',
    definitionEn:
      'Specific high-liquidity intraday windows around the London and New York opens when institutional order flow and volatility typically peak for forex pairs.',
    definitionTaglish:
      'Mga piling oras sa London at New York open kung kailan pinakamalakas ang liquidity at pinakamalilinis ang galaw ng major forex pairs.',
    example:
      'Many forex traders focus exclusively on the London Open (2:00–5:00 PM PHT DST) or New York Open (7:00–10:00 PM PHT DST) instead of staring at screens all day.',
    relatedTopicCode: 'F3.9',
  },

  // =========================================================================
  // INDICES (8 terms)
  // =========================================================================
  {
    id: 'idx-stock-market-index',
    term: 'Stock Market Index',
    category: 'indices',
    definitionEn:
      'A weighted benchmark tracking the combined performance of a basket of leading stocks—such as the S&P 500 (US500), Nasdaq-100 (US100), or PSEi—to reflect overall market health.',
    definitionTaglish:
      'Sukatan na sumusubaybay sa pinagsamang galaw ng grupo ng malalaking kumpanya gaya ng S&P 500, Nasdaq-100, o PSEi para makita ang pangkalahatang takbo ng merkado.',
    example:
      'The S&P 500 measures 500 major US listed companies weighted by market capitalization rather than a single stock.',
    relatedTopicCode: 'I1.1',
  },
  {
    id: 'idx-futures-cfds-etfs',
    term: 'Index Futures vs. CFDs vs. ETFs',
    acronym: 'Futures / CFD / ETF',
    category: 'indices',
    definitionEn:
      'Three distinct ways to gain index exposure: Futures are regulated exchange contracts with expiration, CFDs are OTC broker derivatives, and ETFs are unleveraged funds traded like stocks.',
    definitionTaglish:
      'Tatlong magkaibang instrumento para sa indices: exchange-traded contracts ang Futures na may expiration, broker contract ang CFDs, at parang stock na fund naman ang ETFs.',
    example:
      'Long-term investors buy SPY or VOO (ETFs), while active intraday traders often use Micro E-mini futures (MES/MNQ) or regulated CFDs.',
    relatedTopicCode: 'I1.9',
  },
  {
    id: 'idx-point-tick-value',
    term: 'Point & Tick Value',
    category: 'indices',
    definitionEn:
      'A point is a 1.00 whole-number move in an index, while a tick is its smallest quoted price increment; knowing dollar value per point is essential before sizing any index trade.',
    definitionTaglish:
      'Ang point ay isang buong 1.00 galaw ng index at ang tick ay ang pinakamaliit nitong hakbang; kailangang alam mo ang halaga bawat point bago mag-compute ng risk.',
    example:
      'On Micro E-mini Nasdaq (MNQ) futures, 1 full point equals $2.00 (4 ticks × $0.50), so a 25-point stop risks $50 per contract.',
    relatedTopicCode: 'I2.2',
  },
  {
    id: 'idx-vix',
    term: 'Volatility Index (VIX)',
    acronym: 'VIX',
    category: 'indices',
    definitionEn:
      'The CBOE Volatility Index measuring expected 30-day S&P 500 volatility derived from options pricing—popularly called the market’s “fear gauge.”',
    definitionTaglish:
      'Sukatan ng inaasahang 30-day volatility ng S&P 500 mula sa presyo ng options—madalas tawaging "fear gauge" dahil tumataas ito kapag kinakabahan ang merkado.',
    example:
      'A VIX spiking above 30 signals elevated panic and wider intraday swings, prompting traders to cut position size and widen stops.',
    relatedTopicCode: 'I4.8',
  },
  {
    id: 'idx-dxy',
    term: 'US Dollar Index (DXY)',
    acronym: 'DXY',
    category: 'indices',
    definitionEn:
      'A benchmark measuring the US Dollar’s strength against a weighted basket of six major foreign currencies (heavily led by the Euro at ~57.6%).',
    definitionTaglish:
      'Index na sumusukat sa lakas ng US Dollar laban sa anim na pangunahing banyagang pera (pinakamalaki ang bahagi ng Euro).',
    example:
      'When DXY breaks sharply higher on rising bond yields, EUR/USD, gold, and risk-sensitive equities often face downward pressure.',
    relatedTopicCode: 'F4.12',
  },
  {
    id: 'idx-vwap',
    term: 'Volume Weighted Average Price (VWAP)',
    acronym: 'VWAP',
    category: 'indices',
    definitionEn:
      'An intraday benchmark calculating the average price weighted by traded volume since the session open, widely used by institutions to evaluate fair execution value.',
    definitionTaglish:
      'Intraday average na presyo na naka-base sa volume mula sa pagbubukas ng session—ginagamit ng maraming malalaking trader para makita kung mahal o mura ang kasalukuyang presyo.',
    example:
      'On a strong trend day in US500, pullbacks holding above session VWAP often indicate persistent buyer control.',
    relatedTopicCode: 'I5.5',
  },
  {
    id: 'idx-ib-orb',
    term: 'Initial Balance & Opening Range (ORB)',
    acronym: 'IB / ORB',
    category: 'indices',
    definitionEn:
      'Opening Range marks the high and low of the first 5–30 minutes after the cash open (used for ORB strategies), while Initial Balance covers the full first 60 minutes.',
    definitionTaglish:
      'Ang Opening Range ay ang high at low sa unang 5–30 minuto ng market open (basehan ng ORB), habang ang Initial Balance ay ang buong unang oras ng session.',
    example:
      'Marking the 15-minute Opening Range of US100 at 9:30–9:45 PM PHT (DST) and waiting for a clean retest before entering.',
    relatedTopicCode: 'I5.1',
  },
  {
    id: 'idx-risk-on-risk-off',
    term: 'Risk-On vs. Risk-Off',
    category: 'indices',
    definitionEn:
      'Broad cross-market sentiment regimes: in Risk-On environments capital flows into growth stocks, indices, and crypto; in Risk-Off shocks capital rotates toward cash, Treasuries, and safe havens.',
    definitionTaglish:
      'Pangkalahatang mood ng merkado: sa Risk-On, pumapasok ang pera sa stocks, indices, at crypto; sa Risk-Off, lumilipat ito sa mas ligtas na assets gaya ng cash o US Treasuries.',
    example:
      'During geopolitical shocks, Risk-Off flows can simultaneously pressure Nasdaq futures lower while lifting the US Dollar and Treasuries.',
    relatedTopicCode: 'I3.5',
  },

  // =========================================================================
  // STOCKS (10 terms)
  // =========================================================================
  {
    id: 'stk-ipo',
    term: 'Initial Public Offering (IPO)',
    acronym: 'IPO',
    category: 'stocks',
    definitionEn:
      'The process by which a private company offers shares to the public for the first time on a stock exchange to raise growth capital.',
    definitionTaglish:
      'Unang pagkakataon na nagbebenta ng shares sa publiko ang isang pribadong kumpanya sa stock exchange para makalikom ng dagdag na puhunan.',
    example:
      'Newly listed IPO stocks often experience sharp first-week volatility before establishing reliable chart history.',
    relatedTopicCode: 'S1.4',
  },
  {
    id: 'stk-market-cap',
    term: 'Market Capitalization',
    acronym: 'Market Cap',
    category: 'stocks',
    definitionEn:
      'A company’s total equity value calculated by multiplying its current share price by its total outstanding shares, classifying firms into large-, mid-, and small-cap tiers.',
    definitionTaglish:
      'Kabuuang halaga ng isang kumpanya sa merkado (share price × total shares)—dito nakikita kung large-cap, mid-cap, o small-cap ang isang stock.',
    example:
      'A company trading at $50 with 200 million shares outstanding has a $10 billion market cap—far larger than a $100 stock with 5 million shares.',
    relatedTopicCode: 'S1.6',
  },
  {
    id: 'stk-dividends-ex-date',
    term: 'Dividends & Ex-Dividend Date',
    acronym: 'Ex-Date',
    category: 'stocks',
    definitionEn:
      'Dividends are periodic profit distributions paid to shareholders; you must buy shares strictly before the Ex-Dividend Date to qualify for the upcoming payout.',
    definitionTaglish:
      'Bahagi ng kita ng kumpanya na ibinabalik sa shareholders; kailangan mong mabili ang stock bago ang Ex-Dividend Date para makasama sa payout.',
    example:
      'If a REIT’s ex-dividend date is May 15, buying on May 14 qualifies you for the cash dividend, while buying on May 15 does not.',
    relatedTopicCode: 'S6.9',
  },
  {
    id: 'stk-eps',
    term: 'Earnings Per Share (EPS)',
    acronym: 'EPS',
    category: 'stocks',
    definitionEn:
      'A profitability metric equal to a company’s net income (minus preferred dividends) divided by its weighted average diluted shares outstanding.',
    definitionTaglish:
      'Sukatan kung magkano ang netong kita ng kumpanya para sa bawat isang share ng stock—mahalagang batayan ng paglago ng negosyo.',
    example:
      'If a company earns $500M net profit across 100M diluted shares, its EPS is $5.00 per share.',
    relatedTopicCode: 'S3.6',
  },
  {
    id: 'stk-pe-ratio',
    term: 'Price-to-Earnings Ratio (P/E)',
    acronym: 'P/E',
    category: 'stocks',
    definitionEn:
      'A valuation ratio dividing current share price by Earnings Per Share (EPS), showing how many dollars investors pay for $1 of annual earnings.',
    definitionTaglish:
      'Valuation ratio (Share Price ÷ EPS) na nagpapakita kung ilang beses ng taunang kita ang binabayaran ng investors para sa isang stock.',
    example:
      'A stock at $90 with $4.50 EPS trades at a 20x P/E, which should always be compared against sector peers and growth rates.',
    relatedTopicCode: 'S3.7',
  },
  {
    id: 'stk-roe',
    term: 'Return on Equity (ROE)',
    acronym: 'ROE',
    category: 'stocks',
    definitionEn:
      'A capital-efficiency ratio dividing net income by shareholders’ equity, showing how effectively management turns shareholder capital into profit.',
    definitionTaglish:
      'Sukatan kung gaano kahusay ginagamit ng kumpanya ang kapital ng shareholders para kumita (Net Income ÷ Shareholders’ Equity).',
    example:
      'Consistent 18%–22% ROE with low debt typically signals a much stronger business quality than a 4% ROE utility.',
    relatedTopicCode: 'S3.9',
  },
  {
    id: 'stk-economic-moat',
    term: 'Economic Moat',
    category: 'stocks',
    definitionEn:
      'A durable competitive advantage—such as brand loyalty, network effects, high switching costs, or cost leadership—that protects a company’s profit margins from rivals.',
    definitionTaglish:
      'Matibay na lamang ng isang kumpanya (gaya ng malakas na brand, network effect, o mababang gastos) na nagpoprotekta sa kita nito laban sa kakumpitensiya.',
    example:
      'Enterprise software embedded across a company’s daily operations enjoys a high switching-cost moat.',
    relatedTopicCode: 'S4.4',
  },
  {
    id: 'stk-short-selling',
    term: 'Short Selling',
    category: 'stocks',
    definitionEn:
      'Borrowing shares from a broker to sell now with the goal of buying them back later at a lower price; unlike longs, unhedged short positions carry theoretically unlimited upside risk.',
    definitionTaglish:
      'Panghihiram ng shares sa broker para ibenta ngayon at bibilhin ulit nang mas mura kalaunan—mataas ang risk dahil walang kisame ang puwedeng pagtaas ng presyo.',
    example:
      'Shorting 100 shares at $80 and buying to cover at $68 yields $1,200 before borrow fees, but a sudden short squeeze can rapidly cause severe losses.',
    relatedTopicCode: 'S2.10',
  },
  {
    id: 'stk-etf-reit',
    term: 'ETF & REIT',
    acronym: 'ETF / REIT',
    category: 'stocks',
    definitionEn:
      'An ETF (Exchange-Traded Fund) holds a diversified basket of securities traded like a stock, while a REIT (Real Estate Investment Trust) owns income-producing properties and pays regular dividends.',
    definitionTaglish:
      'Ang ETF ay basket ng maraming stocks o bonds sa iisang ticker, habang ang REIT ay kumpanyang may-ari ng kumikitang real estate na nagbibigay ng regular na dividends.',
    example:
      'Buying a single S&P 500 ETF diversifies across 500 companies instantly, while Philippine REITs distribute at least 90% of distributable income.',
    relatedTopicCode: 'S6.1',
  },
  {
    id: 'stk-options-calls-puts',
    term: 'Call & Put Options (Optional)',
    category: 'stocks',
    definitionEn:
      'Derivative contracts giving the buyer the right (not obligation) to buy (Call) or sell (Put) shares at a set strike price before expiration—advanced tools that decay over time.',
    definitionTaglish:
      'Kontrata na nagbibigay ng karapatan (hindi obligasyon) na bumili (Call) o magbenta (Put) ng stock sa takdang presyo bago mag-expire—pang-advanced ito dahil nababawasan ang halaga sa oras.',
    example:
      'Buying a protective Put on 100 shares acts like temporary insurance against a sharp earnings drop, costing only the option premium.',
    relatedTopicCode: 'S6.4',
  },

  // =========================================================================
  // CRYPTO (11 terms)
  // =========================================================================
  {
    id: 'cry-blockchain',
    term: 'Blockchain',
    category: 'crypto',
    definitionEn:
      'A decentralized, cryptographically linked digital ledger distributed across thousands of independent nodes so transactions can be verified transparently without a central bank.',
    definitionTaglish:
      'Desentralisadong digital ledger na naka-link gamit ang cryptography sa libo-libong nodes upang ma-verify ang mga transaksiyon nang walang iisang bangkong kumokontrol.',
    example:
      'Anyone can audit a Bitcoin transaction’s timestamp, amount, and confirmation count publicly on a block explorer.',
    relatedTopicCode: 'C1.2',
  },
  {
    id: 'cry-spot-vs-perps',
    term: 'Spot vs. Perpetual Futures',
    acronym: 'Spot / Perps',
    category: 'crypto',
    definitionEn:
      'Spot trading means buying and directly owning the underlying cryptocurrency with zero liquidation risk, whereas Perpetual Futures are leveraged, non-expiring derivative contracts.',
    definitionTaglish:
      'Sa Spot, aktwal mong pag-aari ang coin at walang liquidation price; sa Perpetual Futures, leveraged contract ito na walang expiry pero puwedeng ma-liquidate.',
    example:
      'Beginners should build consistency in Spot BTC/ETH before ever touching leveraged Perpetual Futures.',
    relatedTopicCode: 'C2.3',
  },
  {
    id: 'cry-cross-vs-isolated',
    term: 'Cross vs. Isolated Margin',
    category: 'crypto',
    definitionEn:
      'Isolated Margin restricts potential liquidation loss to the collateral assigned to a single trade, while Cross Margin shares your entire futures wallet balance across open positions.',
    definitionTaglish:
      'Sa Isolated Margin, limitado lang sa inilaan mong collateral ang puwedeng mawala sa isang trade; sa Cross Margin, nakataya ang buong futures wallet balance mo.',
    example:
      'Using Isolated Margin with a hard stop loss keeps a sudden altcoin flash crash from draining your entire exchange futures wallet.',
    relatedTopicCode: 'C2.6',
  },
  {
    id: 'cry-liquidation-price',
    term: 'Liquidation Price',
    acronym: 'Liq Price',
    category: 'crypto',
    definitionEn:
      'The exact mark price at which an exchange forcefully closes your leveraged futures position because remaining margin falls below maintenance requirements.',
    definitionTaglish:
      'Eksaktong presyo kung saan sapilitang isasara ng exchange ang leveraged futures trade mo dahil hindi na sapat ang natitirang margin collateral.',
    example:
      'A 20x leveraged long gets liquidated on roughly a 4.5%–5% drop before fees—so a real stop loss must always sit well ahead of liquidation.',
    relatedTopicCode: 'C2.7',
  },
  {
    id: 'cry-funding-rate',
    term: 'Funding Rate',
    category: 'crypto',
    definitionEn:
      'Periodic peer-to-peer payments (typically every 8 hours) between long and short perpetual-futures holders to keep contract prices anchored close to the Spot price.',
    definitionTaglish:
      'Regular na bayaran (kadalasang kada 8 oras) sa pagitan ng long at short futures traders para manatiling malapit ang perpetual price sa Spot price.',
    example:
      'Strongly positive funding (+0.08% per 8h) means longs pay shorts, signaling crowded bullish leverage that can unwind sharply.',
    relatedTopicCode: 'C2.8',
  },
  {
    id: 'cry-open-interest',
    term: 'Open Interest (OI)',
    acronym: 'OI',
    category: 'crypto',
    definitionEn:
      'The total dollar or contract value of all active, unsettled futures positions currently open across derivatives exchanges—measuring incoming or exiting leverage.',
    definitionTaglish:
      'Kabuuang halaga ng lahat ng bukas at hindi pa nasasarang futures contracts sa merkado—ipinapakita nito kung nadadagdagan o nababawasan ang leverage.',
    example:
      'Price rising alongside surging Open Interest shows new leveraged positions entering, whereas rising price with falling OI points to short covering.',
    relatedTopicCode: 'C2.9',
  },
  {
    id: 'cry-btc-dominance',
    term: 'Bitcoin Dominance (BTC.D)',
    acronym: 'BTC.D',
    category: 'crypto',
    definitionEn:
      'Bitcoin’s market capitalization expressed as a percentage of the entire cryptocurrency market cap, used to track capital rotation between BTC and altcoins.',
    definitionTaglish:
      'Porsiyento ng market cap ng Bitcoin kumpara sa buong crypto market—ginagamit para makita kung pumapasok ang kapital sa BTC o lumilipat sa altcoins.',
    example:
      'Rising BTC.D during a Bitcoin rally often means altcoins are lagging BTC until dominance peaks and rotates.',
    relatedTopicCode: 'C3.1',
  },
  {
    id: 'cry-tokenomics',
    term: 'Tokenomics',
    category: 'crypto',
    definitionEn:
      'The economic design of a crypto token, including maximum supply, circulating supply, emission rate, vesting unlock schedules, utility, and fee-burn mechanics.',
    definitionTaglish:
      'Disenyong pang-ekonomiya ng isang crypto token—kasama ang kabuuang supply, circulating supply, unlock schedules, at gamit nito na nakakaapekto sa presyo.',
    example:
      'Checking a token’s unlock calendar reveals if 25% of locked investor supply is about to hit the market next month.',
    relatedTopicCode: 'C3.6',
  },
  {
    id: 'cry-on-chain-analysis',
    term: 'On-Chain Analysis',
    category: 'crypto',
    definitionEn:
      'Studying public blockchain ledger data—such as exchange inflows/outflows, active wallets, stablecoin reserves, and miner flows—to gauge investor behavior.',
    definitionTaglish:
      'Pagsusuri ng pampublikong datos sa blockchain gaya ng pagpasok o paglabas ng coins sa exchanges at galaw ng malalaking wallet.',
    example:
      'Sustained Bitcoin outflows from centralized exchanges into self-custody wallets are monitored as reduced immediate spot sell supply.',
    relatedTopicCode: 'C4.1',
  },
  {
    id: 'cry-seed-phrase',
    term: 'Seed Phrase / Private Key',
    category: 'crypto',
    definitionEn:
      'A secret cryptographic key or 12-to-24-word recovery phrase that proves complete ownership of a self-custody wallet—anyone who obtains it controls all funds permanently.',
    definitionTaglish:
      'Sikat na 12 hanggang 24 na salitang recovery phrase o private key na susi sa wallet mo—kapag nakuha ito ng iba, wala nang bawian ang pondo mo.',
    example:
      'Write your hardware wallet seed phrase offline on paper or metal—never screenshot it, upload it to cloud storage, or type it into a support form.',
    relatedTopicCode: 'C1.10',
  },
  {
    id: 'cry-rug-pull-depeg',
    term: 'Rug Pull & Stablecoin Depeg',
    category: 'crypto',
    definitionEn:
      'A Rug Pull occurs when malicious token creators drain liquidity or dump tokens on buyers, while a Stablecoin Depeg happens when a dollar-pegged token loses its $1.00 parity.',
    definitionTaglish:
      'Ang Rug Pull ay scam kung saan biglang tinatangay ng creators ang liquidity ng token, habang ang Stablecoin Depeg ay kapag nawala sa $1.00 ang halaga ng isang stablecoin.',
    example:
      'Auditing liquidity locks and avoiding unverified hype tokens helps defend against rug pulls, while diversifying top regulated stablecoins lowers depeg exposure.',
    relatedTopicCode: 'C6.4',
  },

  // =========================================================================
  // PHILIPPINES / PSE (6 terms)
  // =========================================================================
  {
    id: 'ph-pse-psei',
    term: 'PSE (Philippine Stock Exchange) & PSEi',
    acronym: 'PSE / PSEi',
    category: 'philippines',
    definitionEn:
      'The PSE is the Philippines’ national stock exchange, while the PSEi is its flagship benchmark index tracking the 30 largest, most liquid publicly listed Philippine companies.',
    definitionTaglish:
      'Ang PSE ang pambansang stock exchange ng Pilipinas, at ang PSEi naman ang pangunahing index ng 30 pinakamalaki at pinaka-aktibong kumpanyang nakalista rito.',
    example:
      'Blue-chip firms like SM, BDO, Ayala (AC), and Jollibee (JFC) are major components that move the PSEi benchmark.',
    relatedTopicCode: 'PH1.1',
  },
  {
    id: 'ph-board-lot',
    term: 'Board Lot (PSE)',
    category: 'philippines',
    definitionEn:
      'The minimum number of shares required to buy or sell a PSE-listed stock on the main board, determined by the stock’s price bracket alongside its minimum tick size.',
    definitionTaglish:
      'Pinakamaliit na bilang ng shares na puwedeng bilhin o ibenta sa main board ng PSE, na nakadepende sa presyo ng stock at nakatakdang tick size.',
    example:
      'A PSE stock priced between ₱50.00 and ₱99.95 requires a minimum board lot of 10 shares (with ₱0.05 ticks), while stocks at ₱1.00–₱4.99 use 1,000 shares.',
    relatedTopicCode: 'PH1.2',
  },
  {
    id: 'ph-pse-hours-t2',
    term: 'PSE Trading Hours (9:30 AM–3:00 PM PHT) & T+2 Settlement',
    acronym: 'T+2',
    category: 'philippines',
    definitionEn:
      'PSE operates Monday–Friday from 9:30 AM to 3:00 PM PHT (with a 12:00–1:30 PM midday recess), and executed stock sales clear for cash withdrawal after T+2 banking days.',
    definitionTaglish:
      'Bukas ang PSE Lunes hanggang Biyernes mula 9:30 AM hanggang 3:00 PM PHT (may 12:00–1:30 PM lunch recess), at T+2 banking days bago ma-withdraw sa bangko ang pinagbentahan.',
    example:
      'Selling ₱30,000 of a PSE stock on Tuesday clears your cash proceeds for bank withdrawal on Thursday (T+2 banking days).',
    relatedTopicCode: 'PH1.3',
  },
  {
    id: 'ph-stt',
    term: 'Stock Transaction Tax (STT)',
    acronym: 'STT',
    category: 'philippines',
    definitionEn:
      'A final tax automatically withheld by Philippine brokers on the gross selling price of listed PSE shares (reduced from 0.6% to 0.1% under RA 12214 / CMEPA effective July 1, 2025).',
    definitionTaglish:
      'Buwis na awtomatikong kinakaltas ng PH broker sa kabuuang benta ng PSE shares (ibinaba mula 0.6% tungo sa 0.1% sa ilalim ng CMEPA simula Hulyo 1, 2025).',
    example:
      'Including broker commission, 12% VAT on commission, PSE/SCCP fees, and 0.1% STT, an ₱8,000+ PSE round-trip trade needs roughly ~0.70% gain to break even.',
    relatedTopicCode: 'PH1.5',
  },
  {
    id: 'ph-bsp',
    term: 'Bangko Sentral ng Pilipinas (BSP)',
    acronym: 'BSP',
    category: 'philippines',
    definitionEn:
      'The central bank of the Philippines responsible for monetary policy, interest rates, inflation targeting, banking supervision, and licensing Virtual Asset Service Providers (VASPs).',
    definitionTaglish:
      'Ang central bank ng Pilipinas na nagtatakda ng interest rates, nagbabantay sa inflation at mga bangko, at naglilisensiya sa lokal na crypto platforms (VASPs).',
    example:
      'A BSP policy rate cut generally lowers local borrowing costs and often lifts rate-sensitive PSE property stocks and REITs.',
    relatedTopicCode: 'PH1.6',
  },
  {
    id: 'ph-sec-alerts',
    term: 'SEC Philippines Investor Alerts',
    acronym: 'SEC PH',
    category: 'philippines',
    definitionEn:
      'Official public advisories issued by the Securities and Exchange Commission (Philippines) warning Filipinos about unregistered investment schemes, unauthorized brokers, and guaranteed-return scams.',
    definitionTaglish:
      'Opisyal na babala ng SEC Philippines laban sa mga hindi rehistradong investment scheme, kolorum na broker, at scam na nangangako ng garantisadong kita.',
    example:
      'Before funding any platform or “copy-trade pool,” verify its Secondary License directly on the official SEC Philippines website and check recent advisories.',
    relatedTopicCode: 'PH1.6',
  },
];
