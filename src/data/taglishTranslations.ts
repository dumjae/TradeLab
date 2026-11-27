import { deepLocalizeMarketTimes } from '../lib/marketTime';

export interface BilingualCopy {
  en: string;
  taglish: string;
}

export interface LessonTaglishSummary {
  plainSummary: string;
  quickTakeaway: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

const RAW_LESSON_TAGLISH_SUMMARIES: Record<string, LessonTaglishSummary> = {
  'candlestick-anatomy': {
    plainSummary:
      'Ang bawat candlestick ay parang mini-kwento ng laban ng buyers at sellers sa isang time period. Ipinapakita nito ang OHLC (Open, High, Low, Close) — ang makapal na body ang totoong panalo, habang ang manipis na wick ang rejection.',
    quickTakeaway:
      'Basahin muna ang laki ng body at haba ng wick bago mag-entry — malaking body = malakas na momentum, mahabang wick = malakas na rejection.',
    faqs: [
      {
        question: 'Ano ang pinaka-importanteng part ng candlestick para sa beginner?',
        answer:
          'Ang candle close. Kahit umangat nang mataas ang presyo habang gumagalaw pa, ang final close ang nagsasabi kung sino talaga ang nanalo.',
      },
      {
        question: 'Ano ang ibig sabihin ng mahabang wick sa ibaba?',
        answer:
          'Sinubukan ng sellers ibaba ang presyo, pero malakas na bumalik ang buyers — senyales ito ng buying pressure sa zone na iyon.',
      },
    ],
  },
  'market-structure': {
    plainSummary:
      'Isipin ang chart na parang hagdan. Kapag gumagawa ang presyo ng mas mataas na peak o HH (Higher High) at mas mataas na dip o HL (Higher Low), buyers ang may hawak ng trend. Ang BOS (Break of Structure) ay kumpirmadong candle body close lampas sa lumang peak o valley.',
    quickTakeaway:
      'Sumabay sa hagdan ng trend at maghintay ng full candle body close para sa totoong BOS (Break of Structure), hindi manipis na wick lang.',
    faqs: [
      {
        question: 'Bakit mas mahalaga ang candle body close kaysa wick sa BOS (Break of Structure)?',
        answer:
          'Ang wick ay mabilis na tusok lang na na-reject agad. Ang full body close ay pruweba na may totoong lakas ang buyers o sellers na manatili lampas sa level.',
      },
      {
        question: 'Paano ko malalaman kung sira na ang uptrend?',
        answer:
          'Kapag nag-close nang malinis ang pulang candle sa ilalim ng huling HL (Higher Low), senyales iyon na pwedeng magpalit na ng direksyon.',
      },
    ],
  },
  'support-resistance-supply-demand': {
    plainSummary:
      'Ang Support ay parang sahig kung saan madalas sumasalo ang buyers, at ang Resistance ay kisame kung saan madalas humihinto ang presyo. Ang Supply at Demand zones naman ay mas malawak na area kung saan nag-iwan ng malalaking orders ang malalaking institutions.',
    quickTakeaway:
      'Tratuhin ang Support, Resistance, at Supply/Demand bilang mga zone o area — hindi manipis na linya na eksakto hanggang huling sentimo.',
    faqs: [
      {
        question: 'Bakit hindi eksaktong guhit ang Support at Demand?',
        answer:
          'Malalaking orders ang nakapila sa isang price range, kaya natural na mag-overshoot nang kaunti ang presyo bago tumalbog.',
      },
      {
        question: 'Alin ang mas malakas — sariwang zone o ilang beses nang tinamaan?',
        answer:
          'Mas malakas ang fresh o unang beses pa lang na binabalikan na zone dahil marami pang natitirang orders doon.',
      },
    ],
  },
  'market-liquidity': {
    plainSummary:
      'Sa trading, ang Liquidity ay simpleng kumpol ng naghihintay na orders — lalo na ang SL (Stop Loss) ng karamihan. Ang BSL (Buy-Side Liquidity) ay nasa itaas ng obvious na highs, at ang SSL (Sell-Side Liquidity) ay nasa ibaba ng obvious na lows.',
    quickTakeaway:
      'Madalas munang daanan ng presyo ang BSL (Buy-Side Liquidity) o SSL (Sell-Side Liquidity) bago gumawa ng totoong malaking galaw.',
    faqs: [
      {
        question: 'Bakit laging tinatamaan ang SL (Stop Loss) ko bago pumunta sa direksyon ko?',
        answer:
          'Dahil nakalagay ito sa parehong obvious spot kung saan naglalagay ang libo-libong beginners. Doon pumupunta ang presyo para makahanap ng malaking volume.',
      },
      {
        question: 'Paano matatandaan agad ang BSL at SSL?',
        answer:
          'BSL (Buy-Side Liquidity) = nasa TAAS ng highs. SSL (Sell-Side Liquidity) = nasa BABA ng lows.',
      },
    ],
  },
  'equal-highs-lows': {
    plainSummary:
      'Kapag dalawang beses o higit pang tumama ang presyo sa halos parehong kisame — EQH (Equal Highs) — o sahig — EQL (Equal Lows) — nagiging magnet ito dahil doon nagkukumpulan ang mga SL (Stop Loss) ng mga traders.',
    quickTakeaway:
      'Huwag basta mag-assume na hindi mababasag ang double top o double bottom; madalas targetin ang EQH (Equal Highs) at EQL (Equal Lows) bilang TP (Take Profit) o sweep level.',
    faqs: [
      {
        question: 'Kailangan bang eksaktong pareho hanggang huling decimal ang EQH (Equal Highs)?',
        answer:
          'Hindi! Basta mukhang pantay tingnan sa chart, doon pa rin naglalagay ng SL (Stop Loss) ang karamihan ng retail traders.',
      },
      {
        question: 'Paano gamitin nang ligtas ang EQL (Equal Lows)?',
        answer:
          'Gamitin itong TP (Take Profit) target kung naka-short ka, o maghintay munang ma-sweep ito at bumalik sa loob bago mag-long.',
      },
    ],
  },
  'liquidity-sweeps': {
    plainSummary:
      'Ang Liquidity Sweep (o fakeout) ay kapag mabilis na lumagpas ang wick sa lumang high o low para kunin ang mga SL (Stop Loss), pero nag-close agad pabalik sa loob. Iba ito sa True Breakout kung saan buong candle body ang nag-close sa labas at tuloy-tuloy ang lakas.',
    quickTakeaway:
      'Laging hintayin ang candle close: wick rejection pabalik sa loob = Liquidity Sweep; malakas na body close sa labas = True Breakout.',
    faqs: [
      {
        question: 'Paano makaiwas na ma-trap sa fake breakout?',
        answer:
          'Huwag mag-chase habang gumagalaw pa ang candle. Hintayin ang close at tingnan kung may follow-through o kung bumalik agad sa range.',
      },
    ],
  },
  'fair-value-gaps': {
    plainSummary:
      'Ang FVG (Fair Value Gap) ay tatlong-candle pattern kung saan sobrang bilis ng galaw ng gitnang candle kaya nag-iwan ito ng bakanteng price imbalance sa pagitan ng Candle 1 at Candle 3. Madalas bumabalik ang presyo sa gap na ito bago magpatuloy.',
    quickTakeaway:
      'Gamitin ang FVG (Fair Value Gap) bilang mas malinis na pullback entry zone kapag sumasabay ka sa main trend.',
    faqs: [
      {
        question: 'Lahat ba ng FVG (Fair Value Gap) ay dapat i-trade?',
        answer:
          'Hindi. Piliin lang ang FVG (Fair Value Gap) na sumasabay sa trend at kasama ng malinaw na BOS (Break of Structure) o Liquidity Sweep.',
      },
    ],
  },
  'order-blocks-bos-choch': {
    plainSummary:
      'Sa SMC (Smart Money Concepts), ang OB (Order Block) ay ang huling opposite candle bago ang biglaang malakas na galaw (displacement). Ang CHoCH (Change of Character) ang unang senyales ng reversal, habang ang BOS (Break of Structure) ang kumpirmasyon na tuloy ang bagong trend.',
    quickTakeaway:
      'Unahin ang CHoCH (Change of Character) para sa shift, hintayin ang pullback sa valid OB (Order Block), at siguraduhing malinaw ang SL (Stop Loss).',
    faqs: [
      {
        question: 'Ano ang pinagkaiba ng CHoCH (Change of Character) at BOS (Break of Structure)?',
        answer:
          'CHoCH (Change of Character) ang unang pagbasag laban sa lumang trend (U-turn warning). BOS (Break of Structure) ang pagpapatuloy ng trend sa parehong direksyon.',
      },
    ],
  },
  'multi-timeframe-alignment': {
    plainSummary:
      'Gamitin ang HTF (Higher Timeframe) tulad ng 4H o 1D bilang malaking mapa para malaman ang main direction, at ang LTF (Lower Timeframe) tulad ng 15m o 5m para sa eksaktong entry at mas maliit na SL (Stop Loss).',
    quickTakeaway:
      'Kapag magkapareho ang direksyon ng HTF (Higher Timeframe) at LTF (Lower Timeframe), mas mataas ang tsansa ng malinis na trade.',
    faqs: [
      {
        question: 'Ilang timeframe ang kailangan ng beginner?',
        answer:
          'Sapat na ang dalawa hanggang tatlo: halimbawa 4H/1H para sa trend bias, at 15m o 5m para sa actual entry trigger.',
      },
    ],
  },
  'forex-sessions-killzones': {
    plainSummary:
      'Hindi lahat ng oras sa Forex ay maganda i-trade. Pinakamalakas at pinakamalinis ang galaw tuwing London Session at New York Session Killzones dahil sabay na bukas ang malalaking bangko.',
    quickTakeaway:
      'Mag-focus sa London at New York Killzones at iwasan ang mabagal na chop hours para mas kaunti ang fake signals.',
    faqs: [
      {
        question: 'Bakit nakakasira ang pag-trade sa labas ng busy sessions?',
        answer:
          'Mababa ang volume sa off-hours kaya madalas mas malapad ang spread at paulit-ulit lang na sideways ang presyo.',
      },
    ],
  },
  'indices-ny-open-playbook': {
    plainSummary:
      'Ang NAS100 at US30 ay mabilis gumalaw sa 9:30 AM New York Open. Madalas may mabilis na pa-sweep muna sa unang ilang minuto bago ilabas ang totoong trend ng session.',
    quickTakeaway:
      'Hintayin munang humupa ang unang 5–15 minutes ng New York Open volatility bago pumasok nang may malinaw na SL (Stop Loss).',
    faqs: [
      {
        question: 'Bakit delikado mag-market order sa mismong 9:30 AM open?',
        answer:
          'Sobrang bilis ng whipsaw at spread spike sa unang minuto; mas ligtas maghintay ng malinaw na sweep + structure confirmation.',
      },
    ],
  },
  'crypto-247-liquidity-playbook': {
    plainSummary:
      'Bukas ang Crypto 24/7 kaya hindi natutulog ang galaw ng BTC at altcoins. Malaki ang epekto ng Bitcoin dominance, funding rates, at weekend liquidity sweeps sa direksyon ng altcoins.',
    quickTakeaway:
      'Laging i-check muna ang BTC chart at tandaan na mas manipis ang liquidity tuwing weekend kaya mas madalas ang biglaang wick.',
    faqs: [
      {
        question: 'Bakit sumusunod ang altcoins kapag biglang bumagsak ang Bitcoin?',
        answer:
          'Dahil si Bitcoin ang main liquidity anchor ng buong crypto market; kapag nag-sweep si BTC, sabay-sabay na nadadamay ang karamihan ng altcoins.',
      },
    ],
  },
  'stocks-gaps-rvol-playbook': {
    plainSummary:
      'Sa Stocks, malaking clue ang Pre-Market Gap, RVOL (Relative Volume), Opening Range, at VWAP (Volume-Weighted Average Price). Kapag mataas ang RVOL at kumakapit ang presyo sa ibabaw ng VWAP, mas malakas ang institutional backing.',
    quickTakeaway:
      'Pumili ng stocks na may malinaw na RVOL (Relative Volume) at igalang ang VWAP (Volume-Weighted Average Price) bilang dynamic bias line.',
    faqs: [
      {
        question: 'Ano ang silbi ng VWAP (Volume-Weighted Average Price) para sa beginners?',
        answer:
          'Ipinapakita nito ang average na presyo ng araw base sa volume — kapag nasa itaas ng VWAP, buyers ang kontrolado; kapag nasa ibaba, sellers.',
      },
    ],
  },
  'confluence-a-plus-setups': {
    plainSummary:
      'Ang A+ Setup ay hindi hula — ito ay pagpapatong-patong ng 4 hanggang 5 malinaw na clues: HTF (Higher Timeframe) bias, busy session, Liquidity Sweep o BOS (Break of Structure), malinis na zone, at magandang RR (Risk-to-Reward Ratio).',
    quickTakeaway:
      'Kung kulang ang clues sa checklist mo, mag-pass! Ang hindi pag-trade ng pangit na setup ay isa ring panalo.',
    faqs: [
      {
        question: 'Ilang clues ang kailangan bago ako pumasok sa trade?',
        answer:
          'Mag-stick sa sariling 4–5 point checklist (Trend + Zone + Confirmation + Minimum 1:2 RR (Risk-to-Reward Ratio)). Kapag kulang, skip muna.',
      },
    ],
  },
  'trade-management-partials-be': {
    plainSummary:
      'Hindi sapat ang magandang entry — kailangan din ng malinaw na plano habang bukas ang trade. Mag-take ng partial profit sa key level, ilipat ang SL (Stop Loss) sa BE (Breakeven) sa tamang oras, at hayaang tumakbo ang natitira hanggang TP (Take Profit).',
    quickTakeaway:
      'Huwag agad mag-move sa BE (Breakeven) nang sobrang aga — bigyan muna ng konting hinga ang trade bago i-lock ang proteksyon.',
    faqs: [
      {
        question: 'Kailan magandang ilipat sa BE (Breakeven) ang SL (Stop Loss)?',
        answer:
          'Kapag nakagawa na ang presyo ng bagong BOS (Break of Structure) sa direksyon mo o umabot na sa +1R hanggang +2R na galaw.',
      },
    ],
  },
  'risk-psychology': {
    plainSummary:
      'Ang Risk Management ang shield ng account mo. Kapag 1% lang ng balance ang risk mo per trade at laging may SL (Stop Loss), hindi masisira ang account mo sa ilang talo at mas madaling labanan ang FOMO (Fear of Missing Out) at revenge trading.',
    quickTakeaway:
      'Laging i-compute muna ang position size bago pindutin ang Buy/Sell, at huwag lalampas sa 1%–2% risk per trade.',
    faqs: [
      {
        question: 'Bakit hindi pwedeng 10% o 20% ang risk per trade para mabilis yumaman?',
        answer:
          'Limang sunod na talo lang sa 20% risk ay ubos na halos ang account mo. Sa 1% risk, kayang-kaya mong makabawi nang kalmado.',
      },
    ],
  },
  'trading-journal-expectancy': {
    plainSummary:
      'Ang Trading Journal ang salamin ng performance mo. Dito mo makikita ang tunay mong win rate, average RR (Risk-to-Reward Ratio), at kung aling emosyon tulad ng FOMO (Fear of Missing Out) ang kumakain sa P&L (Profit & Loss) mo.',
    quickTakeaway:
      'I-log bawat trade — lalo na ang mga talo at rule breaks — dahil ang data ang magsasabi kung ano ang dapat baguhin.',
    faqs: [
      {
        question: 'Kailangan bang mataas sa 70% ang win rate para maging profitable?',
        answer:
          'Hindi! Kahit 45% lang ang win rate mo, profitable ka pa rin kung 1:2 o 1:3 ang average RR (Risk-to-Reward Ratio) mo.',
      },
    ],
  },
  'drawdown-scaling-consistency': {
    plainSummary:
      'Lahat ng pro traders ay nakakaranas ng losing streak (drawdown). Ang sekreto ng consistency ay ang daily loss limit, pagbawas ng risk sa kalahati habang nasa cold streak, at dahan-dahang pag-scale kapag stable na ang resulta.',
    quickTakeaway:
      'Maglagay ng malinaw na Daily Loss Limit — kapag naabot ito, isara muna ang chart at bumalik nang fresh kinabukasan.',
    faqs: [
      {
        question: 'Ano ang dapat gawin kapag nakatatlong sunod na talo na ako?',
        answer:
          'Huminto muna, i-review sa journal kung sinunod mo ba ang plano, at bawasan muna sa 0.5x ang risk hanggang makabalik ang rhythm.',
      },
    ],
  },
  'chart-reading-fundamentals': {
    plainSummary:
      'Ang trading chart ay may dalawang axis: ang X-Axis (oras sa ibaba) at Y-Axis (presyo sa kanan). Ang timeframe tulad ng 5m, 15m, 1H, 4H, at 1D ay nagsasabi kung gaano katagal nabubuo ang bawat candle, habang ang Volume sa ibaba ang nagpapakita kung gaano karaming buyers at sellers ang aktibo.',
    quickTakeaway:
      'Laging basahin nang sabay ang Timeframe, Price Level (Y-Axis), at Volume bago mag-drawing o mag-entry — mas mataas ang timeframe, mas malakas ang signal.',
    faqs: [
      {
        question: 'Anong timeframe ang pinaka-beginner friendly?',
        answer:
          'Magsimula sa 1H o 4H para malinaw ang trend at hindi nakakalito, tapos gamitin ang 15m para masilip ang mas malinis na entry at SL (Stop Loss).',
      },
      {
        question: 'Bakit kailangan pang tingnan ang Volume bars sa ibaba ng chart?',
        answer:
          'Ang malakas na Volume sa BOS (Break of Structure) ay patunay na totoong pera ang nagtutulak ng presyo — hindi lang manipis na fake move.',
      },
      {
        question: 'Kailangan ba ng maraming indicators sa simula?',
        answer:
          'Hindi! Sapat na ang malinis na candlesticks, horizontal levels, at Volume para hindi malito ang mata mo.',
      },
    ],
  },
  'crypto-spot-perps-orderbook': {
    plainSummary:
      'Sa Crypto, kapag bumili ka sa Spot, hawak mo mismo ang coin at hindi ka ma-li-liquidate kahit bumaba ang presyo. Sa Perpetual Futures (Perps), may leverage at Funding Rate — mabilis kumita pero isang mahabang wick lang pwedeng maubos ang posisyon kung walang maayos na SL (Stop Loss). Ang Order Book naman ang listahan ng naghihintay na Bid (buy) at Ask (sell) walls.',
    quickTakeaway:
      'Mag-master muna sa Spot o mababang leverage na may malinaw na SL (Stop Loss) — iwasan ang mataas na leverage sa Perps dahil paborito ng market ang stop-hunt wicks.',
    faqs: [
      {
        question: 'Ano ang pinaka-delikado sa Perpetual Futures para sa beginner?',
        answer:
          'Ang sobrang taas na leverage (tulad ng 20x–50x). Kahit 2%–3% normal pullback lang, automatic liquidation na agad bago pa umakyat ang coin.',
      },
      {
        question: 'Paano nakakatulong ang Order Book Bid at Ask walls?',
        answer:
          'Ipinapakita nito kung saan may malaking kumpol ng limit orders. Kapag naubos (na-absorb) ang Ask wall, madalas mabilis ang breakout pataas.',
      },
    ],
  },
  'crypto-volatility-altcoin-cycles': {
    plainSummary:
      'Mas malalaki ang galaw ng Altcoins (tulad ng SOL at ETH) kumpara sa Bitcoin, kaya kailangan ng mas maliit na position size para manatili sa 1% risk per trade. Ang Liquidation Heatmap ay nagpapakita kung saan nagkukumpulan ang ma-li-liquidate na traders — madalas itong i-sweep bago magsimula ang Altcoin rotation.',
    quickTakeaway:
      'Kapag mas malaki ang volatility ng altcoin, bawasan ang position size para pareho pa rin ang 1% risk mo kung tamaan ang SL (Stop Loss).',
    faqs: [
      {
        question: 'Bakit kailangang paliitin ang position size sa Altcoins?',
        answer:
          'Dahil pwedeng gumalaw ng 5%–10% ang altcoin sa isang araw. Kapag malapad ang SL (Stop Loss) distance mo, dapat mas maliit ang size para hindi masakit ang talo.',
      },
      {
        question: 'Paano gumagana ang Altcoin Cycle?',
        answer:
          'Karaniwang unang umaangat si Bitcoin, tapos kapag kumalma si BTC, lumilipat ang capital sa malalaking altcoins (ETH/SOL) at saka sa mas maliliit na coins.',
      },
    ],
  },
  'forex-pairs-pips-lots-spreads': {
    plainSummary:
      'Sa Forex, laging magkapares ang currencies tulad ng EUR/USD. Ang Pip ang sukatan ng galaw ng presyo, ang Lot Size (Micro, Mini, Standard) ang nagdidikta kung magkano bawat pip, at ang Spread ang maliit na agwat ng Buy at Sell price na kinikita ng broker.',
    quickTakeaway:
      'Laging i-compute ang tamang Lot Size base sa layo ng SL (Stop Loss) pips mo, at mag-trade sa major pairs na may manipis na spread para malinis ang 1:2 RR (Risk-to-Reward Ratio).',
    faqs: [
      {
        question: 'Paano ko malalaman kung anong Lot Size ang ligtas sa account ko?',
        answer:
          'Hatiin ang dollar risk mo (halimbawa 1% ng balance) sa bilang ng SL (Stop Loss) pips × pip value. Huwag manghula ng lot size!',
      },
      {
        question: 'Bakit lumalapad ang Spread tuwing gabi o major news?',
        answer:
          'Kumokonti ang liquidity ng mga bangko sa rollover hours o bago ang balita, kaya mas mahal pumasok at mas madaling tamaan ang masikip na SL (Stop Loss).',
      },
    ],
  },
  'forex-macro-news-rates': {
    plainSummary:
      'Ang Central Banks (tulad ng Federal Reserve) at Interest Rates ang totoong makina ng Forex trends. Ang malalaking balita tulad ng CPI (Consumer Price Index — inflation) at NFP (Non-Farm Payrolls — trabaho) ay pwedeng magpabago ng rate expectations at magdulot ng matinding whipsaw sa loob ng ilang segundo.',
    quickTakeaway:
      'Huwag mag-sugal sa mismong minuto ng CPI (Consumer Price Index) o NFP (Non-Farm Payrolls) — hintaying kumalma ang spike at pumasok sa malinis na post-news pullback.',
    faqs: [
      {
        question: 'Bakit lumalakas ang currency kapag tumaas ang inflation o interest rate?',
        answer:
          'Kapag mas mataas ang interest rate ng isang bansa, mas maraming malalaking investors ang nagpapalit ng pera papunta sa currency na iyon para sa mas mataas na yield.',
      },
      {
        question: 'Dapat ba akong may bukas na trade bago ang red-folder news?',
        answer:
          'Para sa beginners, mas ligtas isara muna o i-protect sa BE (Breakeven) bago ang CPI/NFP/FOMC dahil sa biglaang spread spike at slippage.',
      },
    ],
  },
  'stocks-market-hours-volume-order-types': {
    plainSummary:
      'Hindi 24/7 ang US Stocks — bukas ang Regular Market Hours mula 9:30 AM hanggang 4:00 PM EST, at may manipis na Pre-Market at After-Hours sessions. Ang Limit Order ang nagbibigay sa iyo ng eksaktong presyo, samantalang ang Market Order ay instant fill pero pwedeng magka-slippage kapag mabilis ang galaw.',
    quickTakeaway:
      'Markahan ang Pre-Market High/Low, hintayin ang malakas na 9:30 AM EST Volume, at gumamit ng Limit Order sa pullback imbes na mag-chase gamit ang Market Order.',
    faqs: [
      {
        question: 'Bakit delikado ang Market Order sa Pre-Market o unang minuto ng 9:30 AM?',
        answer:
          'Mabilis lumundag ang presyo at malapad ang spread kapag manipis ang orders, kaya pwedeng malayo sa inaasahan mo ang actual fill price.',
      },
      {
        question: 'Kailan pinakamalakas ang Volume sa US Stocks?',
        answer:
          'Sa unang 1–2 oras (9:30–11:30 AM EST) at sa huling oras bago mag-close (3:00–4:00 PM EST). Mas mabagal kadalasan ang tanghali (lunch chop).',
      },
    ],
  },
  'stocks-earnings-relative-strength': {
    plainSummary:
      'Bawat quarter ay naglalabas ng Earnings Report ang mga kumpanya na nagdudulot ng malalaking price gaps. Ang RS (Relative Strength) ay kapag matibay pa rin o pataas ang isang stock kahit bumababa o humihinto ang buong market index — senyales ito ng malakas na institutional buying.',
    quickTakeaway:
      'Iwasang manghula bago ang Earnings release; mas ligtas i-trade ang post-earnings gap hold ng stock na may malinaw na RS (Relative Strength) at malinis na SL (Stop Loss).',
    faqs: [
      {
        question: 'Bakit delikado mag-hold ng swing trade sa gabi ng Earnings report?',
        answer:
          'Pwedeng lumundag (gap) ng 10%–20% ang stock kinabukasan — lalampasan nito ang SL (Stop Loss) mo at mas malaki ang magiging talo kaysa plano.',
      },
      {
        question: 'Paano makikita agad ang RS (Relative Strength) sa chart?',
        answer:
          'Ikumpara ang stock sa SPX500 o NAS100: kung gumagawa ng Higher Lows ang stock habang pababa ang index, ibig sabihin may malalaking buyers na sumasalo rito.',
      },
    ],
  },
  'indices-nas100-spx500-basics': {
    plainSummary:
      'Ang Stock Indices ay parang basket ng pinakamalalaking kumpanya: SPX500 (500 top US companies), NAS100 (100 top tech companies), at US30 (30 blue-chip giants). Imbes na pips, gumagalaw ito sa Points — at bawat broker ay may nakatakdang dollar value per point.',
    quickTakeaway:
      'Alamin muna ang eksaktong dollar value bawat Point ng SPX500 o NAS100 bago pumasok, at magsimula sa mas kalmadong SPX500 habang nag-pa-practice ng risk math.',
    faqs: [
      {
        question: 'Alin ang mas mabilis at mas volatile — NAS100 o SPX500?',
        answer:
          'Mas mabilis at mas malaki ang galaw ng NAS100 dahil tech-heavy ito. Mas banayad ang SPX500 kaya madalas itong mas maganda para sa beginners.',
      },
      {
        question: 'Paano kino-compute ang risk sa Indices?',
        answer:
          'Multiply lang ang SL (Stop Loss) points sa dollar-per-point value ng contract mo. Halimbawa: 10 points × $10/pt = $100 risk, target 25 points = $250 (+2.5R).',
      },
    ],
  },
  'indices-risk-on-correlations': {
    plainSummary:
      'Ang galaw ng Indices tulad ng NAS100 ay konektado sa malalaking macro indicators: kapag tumataas ang 10-Year Yields, DXY (US Dollar Index), at VIX (Volatility Index — fear gauge), madalas "Risk-Off" o bumabagsak ang stocks. Kapag humupa at bumaba ang VIX at Yields, nagiging "Risk-On" at lumalakas ang pag-akyat ng indices.',
    quickTakeaway:
      'Silipin muna ang DXY (US Dollar Index), 10Y Yields, at VIX (Volatility Index) bago mag-trade ng NAS100 o SPX500 para hindi ka sumasalubong sa malakas na macro wave.',
    faqs: [
      {
        question: 'Ano ang ibig sabihin ng Risk-On at Risk-Off sa simpleng salita?',
        answer:
          'Risk-On = confident ang mga investors kaya bumibili sila ng stocks, indices, at crypto. Risk-Off = kinakabahan ang market kaya lumilipat sa cash/USD at bumababa ang indices.',
      },
      {
        question: 'Paano ginagamit ang VIX (Volatility Index) sa pang-araw-araw na trading?',
        answer:
          'Kapag biglang pumalo pataas ang VIX, asahan ang mas malalaking wicks at bawasan ang position size; kapag nagsimulang kumalma ang VIX mula sa peak, mas malinis ang bullish reversals.',
      },
    ],
  },
};

const RAW_UI_COPY = {
  nav: {
    dashboard: { en: 'Dashboard', taglish: 'Dashboard' },
    academy: { en: 'Academy', taglish: 'Academy (Aralin)' },
    paperTrading: { en: 'Paper Trading', taglish: 'Paper Trading (Demo)' },
    simulator: { en: 'Replay Simulator', taglish: 'Replay Simulator' },
    riskJournal: { en: 'Risk & Journal', taglish: 'Risk & Journal' },
    mentor: { en: 'AI Mentor', taglish: 'AI Mentor (Gabay)' },
    signOut: { en: 'Sign Out', taglish: 'Mag-Sign Out' },
    languageLabel: { en: 'Language', taglish: 'Wika' },
    enShort: { en: 'EN', taglish: 'EN' },
    taglishShort: { en: 'Taglish', taglish: 'Taglish' },
  },
  dashboard: {
    heroEyebrow: { en: 'Zero-Risk Trading Desk', taglish: 'Ligtas na Practice Desk' },
    heroTitle: { en: 'Learn, Practice & Track Without Risking Real Money', taglish: 'Mag-Aral, Mag-Practice at Mag-Track Nang Walang Talo sa Totoong Pera' },
    heroSubtitle: {
      en: 'Follow short visual lessons, test setups in separate demo wallets, and journal every trade.',
      taglish: 'Sundan ang maiikling visual lessons, mag-practice sa hiwalay na demo wallets, at i-log ang bawat trade.',
    },
    continueLesson: { en: 'Continue Lesson', taglish: 'Ituloy ang Lesson' },
    openPaperTrading: { en: 'Open Paper Trading', taglish: 'Buksan ang Paper Trading' },
    paperCardTitle: { en: 'Demo Paper Trading Wallets', taglish: 'Mga Demo Paper Trading Wallet' },
    paperCardSubtitle: {
      en: 'Practice live prices with realistic fees, spreads, SL (Stop Loss) & TP (Take Profit).',
      taglish: 'Mag-practice sa live prices na may makatotohanang fee, spread, SL (Stop Loss) at TP (Take Profit).',
    },
    progressLabel: { en: 'Curriculum Progress', taglish: 'Progreso sa Aralin' },
    streakLabel: { en: 'Study Streak', taglish: 'Araw na Tuloy-Tuloy' },
    dailyMindset: { en: 'Daily Trading Rule', taglish: 'Paalala Ngayong Araw' },
  },
  academy: {
    title: { en: 'Structured Trading Academy', taglish: 'Kumpletong Trading Academy' },
    subtitle: {
      en: '27 bite-sized lessons covering Universal Core fundamentals, dedicated market tracks, and steady profitability.',
      taglish: '27 maiikling lessons na may Universal Core basics, hiwalay na market tracks, at steady profitability.',
    },
    allMarkets: { en: 'All Markets', taglish: 'Lahat ng Markets' },
    completed: { en: 'Completed', taglish: 'Tapos Na' },
    startLesson: { en: 'Open Lesson', taglish: 'Buksan' },
    minutesShort: { en: 'min', taglish: 'min' },
  },
  lesson: {
    tabLearn: { en: 'Plain Guide', taglish: 'Simpleng Paliwanag' },
    tabDiagram: { en: 'Visual Map', taglish: 'Diagram' },
    tabChart: { en: 'Practice Chart', taglish: 'Chart Example' },
    tabVideo: { en: 'Video', taglish: 'Video' },
    tabQuiz: { en: 'Quick Quiz', taglish: 'Quiz' },
    plainSummaryTitle: { en: 'In Plain Words', taglish: 'Sa Simpleng Salita' },
    quickTakeawayTitle: { en: 'Remember This', taglish: 'Pinaka-Tandaan' },
    faqTitle: { en: 'Beginner Questions', taglish: 'Mga Tanong ng Beginner' },
    markComplete: { en: 'Mark Complete', taglish: 'Tapos Na Ako Dito' },
    completedBadge: { en: 'Lesson Completed', taglish: 'Tapos Na ang Lesson' },
    backToAcademy: { en: 'Back to Academy', taglish: 'Balik sa Academy' },
  },
  paperTrading: {
    pageTitle: { en: 'Paper Trading Demo Desk', taglish: 'Paper Trading Demo Desk' },
    pageSubtitle: {
      en: 'Practice with virtual funds, separate market wallets, and realistic fee & spread fills.',
      taglish: 'Mag-practice gamit ang virtual funds, hiwalay na wallets, at realistic na fee at spread.',
    },
    newWallet: { en: 'New Wallet', taglish: 'Bagong Wallet' },
    createWalletTitle: { en: 'Create Demo Wallet', taglish: 'Gumawa ng Demo Wallet' },
    resetWallet: { en: 'Reset Wallet', taglish: 'I-Reset ang Wallet' },
    deleteWallet: { en: 'Delete Wallet', taglish: 'Burahin ang Wallet' },
    deleteWalletConfirm: {
      en: 'Delete this demo wallet and all of its positions and trade history? This cannot be undone.',
      taglish: 'Sigurado ka bang buburahin ang demo wallet na ito pati ang lahat ng trades nito? Hindi na ito maibabalik.',
    },
    emptyWalletsTitle: { en: 'No Demo Wallets Yet', taglish: 'Wala Pang Demo Wallet' },
    emptyWalletsBody: {
      en: 'Create a Crypto, Forex, or All-Markets demo wallet to start practicing risk-free.',
      taglish: 'Gumawa ng Crypto, Forex, o All-Markets demo wallet para magsimulang mag-practice nang walang risk.',
    },
    createFirstWallet: { en: 'Create Demo Wallet', taglish: 'Gumawa ng Demo Wallet' },
    feesSpreadToggle: { en: 'Realistic Fees & Spread', taglish: 'Realistic na Fee at Spread' },
    feesSpreadOnNote: {
      en: 'Simulates real broker fees and bid/ask spread.',
      taglish: 'May kasamang makatotohanang broker fee at bid/ask spread.',
    },
    feesSpreadOffNote: {
      en: 'Clean zero-cost mode for basic chart practice.',
      taglish: 'Walang fee o spread — malinis na basic practice mode.',
    },
    marketOrder: { en: 'Market (Instant)', taglish: 'Market (Agad)' },
    limitOrder: { en: 'Limit (Pending)', taglish: 'Limit (Hintay)' },
    buyLong: { en: 'Buy / Long', taglish: 'Buy / Long (Paakyat)' },
    sellShort: { en: 'Sell / Short', taglish: 'Sell / Short (Pababa)' },
    stopLossLabel: { en: 'SL (Stop Loss)', taglish: 'SL (Stop Loss — Proteksyon)' },
    takeProfitLabel: { en: 'TP (Take Profit)', taglish: 'TP (Take Profit — Target)' },
    riskPercentLabel: { en: 'Risk % per Trade', taglish: 'Risk % Bawat Trade' },
    placeOrder: { en: 'Place Demo Order', taglish: 'Ilagay ang Demo Order' },
    grossPnl: { en: 'Gross P&L (Profit & Loss)', taglish: 'Gross P&L (Bago ang Gastos)' },
    feesLabel: { en: 'Est. Fees', taglish: 'Fee' },
    spreadLabel: { en: 'Spread Cost', taglish: 'Spread' },
    netPnl: { en: 'Net P&L (Profit & Loss)', taglish: 'Net P&L (Totoong Kita/Talo)' },
    openPositions: { en: 'Open Positions', taglish: 'Mga Bukas na Trade' },
    pendingOrders: { en: 'Pending Limits', taglish: 'Mga Naghihintay na Limit' },
    closedTrades: { en: 'Trade History', taglish: 'Mga Saradong Trade' },
    moveToBe: { en: 'Move SL to BE (Breakeven)', taglish: 'Ilipat SL sa BE (Breakeven)' },
    closeNow: { en: 'Close Now', taglish: 'Isara Ngayon' },
    cancelOrder: { en: 'Cancel', taglish: 'Kanselahin' },
    logToJournal: { en: 'Log to Journal', taglish: 'I-Save sa Journal' },
    loggedBadge: { en: 'Saved in Journal', taglish: 'Nasa Journal Na' },
    dailyLossWarning: {
      en: 'Daily Loss Limit reached — pause trading and review your trades before taking another setup.',
      taglish: 'Naabot na ang Daily Loss Limit — magpahinga muna at i-review ang trades bago pumasok ulit.',
    },
  },
  onboarding: {
    welcomeTitle: { en: 'Personalize Your Study Path', taglish: 'I-Customize ang Study Path Mo' },
    experiencePrompt: { en: 'What is your current trading experience?', taglish: 'Ano ang kasalukuyang level mo sa trading?' },
    marketPrompt: { en: 'Which market do you want to focus on first?', taglish: 'Anong market ang gusto mong unahin?' },
    startButton: { en: 'Start My Learning Path', taglish: 'Simulan ang Pag-Aral' },
  },
  diagrams: {
    both: { en: 'Both Views', taglish: 'Pareho (Up & Down)' },
    bullish: { en: 'Bullish (Up)', taglish: 'Bullish (Pataas)' },
    bearish: { en: 'Bearish (Down)', taglish: 'Bearish (Pababa)' },
    quickBlueprint: { en: 'Quick Cheat-Card', taglish: 'Mabilis na Buod' },
    openDiagramLab: {
      en: 'Open Bullish & Bearish Diagrams',
      taglish: 'Buksan ang Bullish at Bearish Diagrams',
    },
  },
  walkthrough: {
    tutorialTitle: { en: 'Step-by-Step Webapp Tutorial', taglish: 'Step-by-Step na Gabay sa App' },
    skip: { en: 'Skip Tour', taglish: 'Laktawan Muna' },
    back: { en: 'Back', taglish: 'Balik' },
    next: { en: 'Next Step', taglish: 'Susunod' },
    finish: { en: 'Start Learning', taglish: 'Simulan Na!' },
    replayTutorial: { en: 'App Walkthrough', taglish: 'Gabay sa App' },
    step1Title: {
      en: '1. Switch EN / Taglish Anytime',
      taglish: '1. Palitan ang EN / Taglish Kahit Kailan',
    },
    step1Body: {
      en: 'Use the top language pill to read every lesson, diagram cheat-card, and quiz in plain English or natural Taglish.',
      taglish: 'Gamitin ang language toggle sa itaas para mabasa ang bawat lesson, diagram, at quiz sa malinaw na English o Taglish.',
    },
    step1Cta: { en: 'Got It, Next', taglish: 'Gets, Susunod' },
    step2Title: {
      en: '2. Follow Universal Core & Market Tracks',
      taglish: '2. Sundan ang Universal Core at Market Tracks',
    },
    step2Body: {
      en: 'Learn chart reading, structure, liquidity, and risk math once in Universal Core, then pick your Crypto, Forex, Stocks, or Indices track.',
      taglish: 'Unahin ang Universal Core para sa basics ng chart at risk, tapos piliin ang gusto mong Crypto, Forex, Stocks, o Indices track.',
    },
    step2Cta: { en: 'Explore Academy', taglish: 'Tingnan ang Academy' },
    step3Title: {
      en: '3. Study Both Bullish & Bearish Diagrams',
      taglish: '3. Aralin ang Bullish at Bearish Diagrams',
    },
    step3Body: {
      en: 'Every lesson includes clean Up & Down visual blueprints with Quick Cheat-Cards so you recognize setups in both directions.',
      taglish: 'May malinis na pataas at pababa na visual blueprints at Mabilis na Buod bawat lesson para madaling tandaan ang setups.',
    },
    step3Cta: { en: 'Next: Practice Charts', taglish: 'Susunod: Practice Charts' },
    step4Title: {
      en: '4. Replay Real OHLCV Charts Step-by-Step',
      taglish: '4. I-Replay ang OHLCV Charts Step-by-Step',
    },
    step4Body: {
      en: 'Step through Before, Trigger, and After stages on 27 dedicated charts to train your eyes before risking a single cent.',
      taglish: 'I-click ang Before, Trigger, at After sa 27 dedicated charts para masanay ang mata mo bago mag-trade.',
    },
    step4Cta: { en: 'Next: Demo Wallets', taglish: 'Susunod: Demo Wallets' },
    step5Title: {
      en: '5. Practice Risk-Free in Paper Trading',
      taglish: '5. Mag-Practice Nang Ligtas sa Paper Trading',
    },
    step5Body: {
      en: 'Open separate Crypto, Forex, or All-Markets demo wallets with realistic spreads, fees, SL (Stop Loss), and TP (Take Profit).',
      taglish: 'Gumawa ng hiwalay na Crypto, Forex, o All-Markets demo wallets na may realistic spread, fee, SL (Stop Loss), at TP (Take Profit).',
    },
    step5Cta: { en: 'Next: Risk & Mentor', taglish: 'Susunod: Risk at Mentor' },
    step6Title: {
      en: '6. Size Trades, Journal & Ask AI Mentor',
      taglish: '6. I-Compute ang Risk, Mag-Journal at Magtanong sa AI Mentor',
    },
    step6Body: {
      en: 'Use the 1% Risk Calculator, log every demo trade in your Journal, and ask the AI Mentor whenever a concept feels unclear.',
      taglish: 'Gamitin ang 1% Risk Calculator, i-log ang demo trades sa Journal, at magtanong sa AI Mentor kapag may hindi malinaw.',
    },
    step6Cta: { en: 'Start My First Lesson', taglish: 'Simulan ang Unang Lesson' },
  },
  academyTracks: {
    universalCoreTitle: {
      en: 'Universal Core (All Markets)',
      taglish: 'Universal Core (Lahat ng Markets)',
    },
    universalCoreSubtitle: {
      en: 'Master chart fundamentals, price action, liquidity, and risk math once — apply them across every market.',
      taglish: 'Matutunan ang pagbasa ng chart, price action, liquidity, at risk math — magagamit sa lahat ng market.',
    },
    marketTracksTitle: {
      en: 'Separate Market Tracks (Crypto, Forex, Stocks, Indices)',
      taglish: 'Hiwalay na Market Tracks (Crypto, Forex, Stocks, Indices)',
    },
    marketTracksSubtitle: {
      en: 'Choose your preferred market track to master its exact trading hours, fees, sizing units, and news catalysts.',
      taglish: 'Piliin ang gusto mong market track para matutunan ang eksaktong trading hours, fees, sizing units, at catalysts nito.',
    },
    cryptoTrack: { en: 'Crypto Track', taglish: 'Crypto Track' },
    forexTrack: { en: 'Forex Track', taglish: 'Forex Track' },
    stocksTrack: { en: 'Stocks Track', taglish: 'Stocks Track' },
    indicesTrack: { en: 'Indices Track', taglish: 'Indices Track' },
  },
} as const satisfies Record<string, Record<string, BilingualCopy>>;

export const LESSON_TAGLISH_SUMMARIES: Record<string, LessonTaglishSummary> =
  deepLocalizeMarketTimes(RAW_LESSON_TAGLISH_SUMMARIES);

export const UI_COPY = deepLocalizeMarketTimes(RAW_UI_COPY);
