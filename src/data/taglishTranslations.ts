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

export const LESSON_TAGLISH_SUMMARIES: Record<string, LessonTaglishSummary> = {
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
};

export const UI_COPY = {
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
      en: '18 bite-sized lessons from candlestick basics to steady profitability.',
      taglish: '18 maiikling lessons mula basics ng candlesticks hanggang steady profitability.',
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
} as const satisfies Record<string, Record<string, BilingualCopy>>;
