import type { AcademyModule, DecoupledLessonNode } from '../../types/curriculum-tree';

export const CRYPTO_MODULES: AcademyModule[] = [
  {
    id: 'mod-c1',
    code: 'C1',
    title: 'Cryptocurrency Fundamentals',
    subtitle: 'Blockchain mechanics, Bitcoin, Ethereum, altcoins, stablecoins, CEX vs. DEX, wallets, seed phrases, and gas fees.',
    pathId: 'crypto',
    pillar: 'specializations',
    level: 2,
    lessonCodes: [
      'C1.1', 'C1.2', 'C1.3', 'C1.4', 'C1.5', 'C1.6',
      'C1.7', 'C1.8', 'C1.9', 'C1.10', 'C1.11', 'C1.12',
    ],
  },
  {
    id: 'mod-c2',
    code: 'C2',
    title: 'Crypto Trading Mechanics',
    subtitle: 'Spot markets first, then perpetual futures, margin modes, liquidation price math, funding rates, open interest, and fees.',
    pathId: 'crypto',
    pillar: 'specializations',
    level: 2,
    disclaimer:
      'Master Spot Trading, Margin Modes, and Liquidation Price mechanics BEFORE ever touching leveraged perpetual contracts. High leverage accelerates account wipeouts.',
    lessonCodes: [
      'C2.1', 'C2.2', 'C2.3', 'C2.4', 'C2.5', 'C2.6',
      'C2.7', 'C2.8', 'C2.9', 'C2.10', 'C2.11', 'C2.12',
    ],
  },
  {
    id: 'mod-c3',
    code: 'C3',
    title: 'Crypto Market Analysis',
    subtitle: 'Bitcoin dominance, total market cap, altcoin rotation cycles, halvings, tokenomics, supply unlocks, and sentiment.',
    pathId: 'crypto',
    pillar: 'specializations',
    level: 2,
    lessonCodes: [
      'C3.1', 'C3.2', 'C3.3', 'C3.4', 'C3.5', 'C3.6',
      'C3.7', 'C3.8', 'C3.9', 'C3.10', 'C3.11',
    ],
  },
  {
    id: 'mod-c4',
    code: 'C4',
    title: 'On-Chain and Derivatives Analysis',
    subtitle: 'Exchange netflows, whale tracking, network usage, funding extremes, open interest, liquidation heatmaps, and order-book depth.',
    pathId: 'crypto',
    pillar: 'specializations',
    level: 3,
    disclaimer:
      'On-chain metrics and derivatives positioning are probabilistic context tools—not guaranteed standalone entry triggers.',
    lessonCodes: [
      'C4.1', 'C4.2', 'C4.3', 'C4.4', 'C4.5', 'C4.6',
      'C4.7', 'C4.8', 'C4.9', 'C4.10', 'C4.11',
    ],
  },
  {
    id: 'mod-c5',
    code: 'C5',
    title: 'Advanced Crypto Trading',
    subtitle: 'BTC leadership, altcoin rotation playbooks, spot vs. perp systems, liquidity sweeps, funding fades, and volatility sizing.',
    pathId: 'crypto',
    pillar: 'specializations',
    level: 4,
    disclaimer:
      '24/7 crypto markets experience violent weekend liquidity sweeps and cascade liquidations. Complete C2 margin/liquidation mechanics and C6 security before live execution.',
    lessonCodes: ['C5.1', 'C5.2', 'C5.3', 'C5.4', 'C5.5', 'C5.6', 'C5.7', 'C5.8', 'C5.9', 'C5.10'],
  },
  {
    id: 'mod-c6',
    code: 'C6',
    title: 'Crypto Security and Risk',
    subtitle: 'Exchange hardening, hardware wallets, phishing defense, rug pulls, pump-and-dumps, smart-contract, counterparty, and depeg risks.',
    pathId: 'crypto',
    pillar: 'specializations',
    level: 2,
    lessonCodes: ['C6.1', 'C6.2', 'C6.3', 'C6.4', 'C6.5', 'C6.6', 'C6.7', 'C6.8', 'C6.9', 'C6.10'],
  },
];

export const CRYPTO_LESSONS: DecoupledLessonNode[] = [
  // =========================================================================
  // MODULE C1 — Cryptocurrency Fundamentals (C1.1 – C1.12)
  // =========================================================================
  {
    id: 'topic-c1-1',
    code: 'C1.1',
    slug: 'crypto-c1-1-intro-cryptocurrency',
    title: 'Introduction to Cryptocurrency',
    overviewEn:
      'Cryptocurrencies are digital assets secured by cryptography and recorded on distributed networks that operate 24/7 globally without requiring a central bank or single clearinghouse.',
    overviewTaglish:
      'Ang cryptocurrency ay digital asset na protektado ng cryptography at nakatala sa distributed network na bukas 24/7 sa buong mundo nang hindi nakadepende sa iisang central bank.',
    objectives: [
      'Explain how digital scarcity and peer-to-peer verification solve the double-spending problem.',
      'Compare 24/7 crypto market structure with traditional fixed-hour stock and forex markets.',
      'Recognize crypto’s core trade-off: high liquidity/accessibility paired with severe volatility and self-custody responsibility.',
    ],
    keyPoints: [
      'Crypto trades 24 hours a day, 365 days a year—major moves frequently happen during weekends or late PH hours.',
      'Transactions are irreversible once finalized on-chain; there is no bank hotline to reverse mistakes.',
      'Crypto spans multiple categories: store-of-value networks (BTC), smart-contract platforms (ETH, SOL), and fiat-pegged stablecoins.',
    ],
    practicalExample:
      'Unlike NYSE stocks that close on Friday afternoon, Bitcoin can swing ±8% on Sunday morning PH time when macro headlines hit thinner weekend order books.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: [],
    estimatedMinutes: 8,
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'Which structural difference directly shapes how traders manage risk in crypto versus stocks?',
      options: [
        'Crypto exchanges close every weekend at 5:00 PM',
        'Crypto trades 24/7 globally with irreversible on-chain transfers and higher intraday volatility',
        'Cryptocurrencies have government deposit insurance by default',
        'Crypto prices can only move 5% per day due to exchange limits',
      ],
      correctIndex: 1,
      rationale: 'Continuous 24/7 trading removes closing bells, meaning stops and alerts must account for overnight and weekend swings.',
      commonTrap: 'Leaving unmonitored leveraged positions open over thin-liquidity weekends expecting price to stay quiet until Monday.',
    },
  },
  {
    id: 'topic-c1-2',
    code: 'C1.2',
    slug: 'crypto-c1-2-what-is-blockchain',
    title: 'What is Blockchain?',
    overviewEn:
      'A blockchain is a shared, append-only digital ledger where batches of verified transactions ("blocks") are cryptographically chained in chronological order across thousands of independent nodes.',
    overviewTaglish:
      'Ang blockchain ay pampublikong digital ledger kung saan ang bawat grupo ng verified na transaksyon (block) ay nakakabit gamit ang cryptographic hash sa libu-libong independent nodes.',
    objectives: [
      'Explain how cryptographic hashing links blocks so altering past history breaks the chain.',
      'Contrast decentralized public blockchains with centralized private corporate databases.',
      'Understand the Blockchain Trilemma: balancing decentralization, security, and scalability.',
    ],
    keyPoints: [
      'Each block stores transaction records, a timestamp, and the cryptographic hash of the previous block.',
      'Public blockchains like Bitcoin and Ethereum let anyone audit transactions via block explorers (e.g., Mempool.space, Etherscan).',
      'Faster, cheaper blockchains often trade off some degree of decentralization or validator diversity.',
    ],
    practicalExample:
      'When you withdraw USDT or ETH from an exchange, you can paste the Transaction Hash (TxID) into Etherscan to independently confirm block finality.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.1'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why is it practically impossible for a single bad actor to secretly rewrite confirmed history on a large decentralized blockchain?',
      options: [
        'Because customer support locks the spreadsheet every midnight',
        'Because each block cryptographically hashes the previous block and thousands of independent nodes reject tampered ledgers',
        'Because blockchains delete transaction history every 24 hours',
        'Because only one central server holds the master copy',
      ],
      correctIndex: 1,
      rationale: 'Changing an older block alters every subsequent hash and is immediately rejected by honest nodes enforcing consensus rules.',
      commonTrap: 'Assuming "on the blockchain" automatically means a token project is legitimate or safe from scams.',
    },
  },
  {
    id: 'topic-c1-3',
    code: 'C1.3',
    slug: 'crypto-c1-3-how-cryptocurrencies-work',
    title: 'How Cryptocurrencies Work',
    overviewEn:
      'Cryptocurrencies combine public-key cryptography (wallet addresses and digital signatures) with consensus mechanisms such as Proof of Work (PoW) and Proof of Stake (PoS) to validate transfers without intermediaries.',
    overviewTaglish:
      'Pinagsasama ng cryptocurrencies ang public-key cryptography (wallet address at digital signature) at consensus mechanisms tulad ng Proof of Work (PoW) at Proof of Stake (PoS) para i-verify ang bawat transaksyon.',
    objectives: [
      'Distinguish public keys (shareable deposit address) from private keys (secret signing authority).',
      'Compare Proof of Work mining (Bitcoin) with Proof of Stake validators (Ethereum, Solana).',
      'Track a transaction lifecycle: signing → mempool broadcast → block inclusion → confirmations.',
    ],
    keyPoints: [
      'Your wallet does not physically "store coins"—it stores private keys that prove signing authority over balances on the ledger.',
      'PoW secures networks with computational energy; PoS secures networks with staked economic collateral subject to slashing.',
      'Exchanges require multiple block confirmations before crediting deposits to prevent chain-reorganization exploits.',
    ],
    practicalExample:
      'Sending BTC creates a digitally signed message broadcasted to the mempool; miners pick higher-fee transactions first and include them in the next ~10-minute block.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.2'],
    estimatedMinutes: 9,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What does a crypto wallet actually hold under the hood?',
      options: [
        'Physical encrypted coin files stored on your phone screen',
        'Cryptographic private keys that sign transactions authorizing movement of balances recorded on the blockchain',
        'A bank certificate insured by your local government',
        'Direct ownership shares of a stock exchange',
      ],
      correctIndex: 1,
      rationale: 'Balances live on the distributed blockchain ledger; your wallet manages the private keys that prove ownership and authorize transfers.',
      commonTrap: 'Deleting a wallet app without backing up the seed phrase and thinking your email login can recover the funds.',
    },
  },
  {
    id: 'topic-c1-4',
    code: 'C1.4',
    slug: 'crypto-c1-4-bitcoin-fundamentals',
    title: 'Bitcoin Fundamentals',
    overviewEn:
      'Bitcoin (BTC) is the original decentralized cryptocurrency, engineered with a hard-capped maximum supply of 21 million coins, Proof-of-Work security, and predictable issuance halvings every 210,000 blocks.',
    overviewTaglish:
      'Ang Bitcoin (BTC) ang pinakaunang decentralized cryptocurrency—may permanenteng hard cap na 21 milyong coins, Proof-of-Work security, at nakatakdang supply halving kada ~4 na taon.',
    objectives: [
      'Identify Bitcoin’s core monetary properties: 21M hard cap, divisibility into 100M satoshis, and permissionless settlement.',
      'Explain why BTC acts as the macro liquidity anchor and benchmark risk asset for the entire crypto ecosystem.',
      'Understand spot Bitcoin ETFs and institutional custody as modern demand channels.',
    ],
    keyPoints: [
      '1 BTC = 100,000,000 satoshis (sats)—you never need to buy a whole coin to trade or accumulate BTC.',
      'Bitcoin’s predictable supply schedule contrasts with fiat currency expansion, making it highly sensitive to global liquidity cycles.',
      'Almost every crypto trader tracks BTC trend first because altcoins rarely sustain uptrends when BTC dumps.',
    ],
    practicalExample:
      'With $200, a beginner buys a fraction of BTC (e.g., 0.0025 BTC = 250,000 satoshis) on spot without needing $80,000 for one whole coin.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.3'],
    estimatedMinutes: 9,
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'What enforces Bitcoin’s maximum supply cap of 21 million coins?',
      options: [
        'An annual vote by centralized exchange CEOs',
        'Open-source protocol consensus rules independently enforced by thousands of Bitcoin nodes worldwide',
        'A decree from the International Monetary Fund',
        'A smart contract controlled by one marketing team',
      ],
      correctIndex: 1,
      rationale: 'Bitcoin nodes reject any block violating the 21-million issuance schedule, making supply policy transparent and tamper-resistant.',
      commonTrap: 'Skipping Bitcoin to buy cheap $0.0001 altcoins because of unit bias ("I want to own millions of tokens").',
    },
  },
  {
    id: 'topic-c1-5',
    code: 'C1.5',
    slug: 'crypto-c1-5-ethereum-fundamentals',
    title: 'Ethereum Fundamentals',
    overviewEn:
      'Ethereum (ETH) is the leading programmable smart-contract blockchain powering decentralized finance (DeFi), stablecoins, tokenization, and Layer-2 scaling ecosystems, with ETH serving as its native gas and staking asset.',
    overviewTaglish:
      'Ang Ethereum (ETH) ang pangunahing programmable smart-contract blockchain na nagpapagana ng DeFi, stablecoins, at Layer-2 networks—at ETH ang ginagamit na gas at staking asset nito.',
    objectives: [
      'Explain smart contracts as self-executing on-chain code powering lending, swaps, and stablecoins.',
      'Understand EIP-1559 fee burning, Proof-of-Stake staking yield, and how network demand affects ETH issuance.',
      'Distinguish Ethereum Mainnet (Layer 1) from rollups like Arbitrum, Optimism, and Base (Layer 2).',
    ],
    keyPoints: [
      'Every transaction or smart-contract call on Ethereum requires gas paid in ETH.',
      'Layer-2 networks bundle transactions cheaply off mainnet and inherit Ethereum Layer-1 security.',
      'Tracking the ETH/BTC ratio chart helps gauge market appetite for altcoins versus Bitcoin safety.',
    ],
    practicalExample:
      'When DeFi and Layer-2 activity surges, more ETH base fees are burned under EIP-1559 and ETH/BTC often turns higher—frequently signaling broader altcoin risk-on rotation.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.4'],
    estimatedMinutes: 9,
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'What is the primary role of Layer-2 networks (such as Arbitrum, Optimism, and Base) built on top of Ethereum?',
      options: [
        'To replace Bitcoin’s 21-million supply cap',
        'To process transactions faster and at much lower fees while anchoring security back to Ethereum Layer 1',
        'To guarantee fixed 20% monthly trading profits',
        'To eliminate the need for private keys',
      ],
      correctIndex: 1,
      rationale: 'Layer-2 rollups execute transactions off the congested mainnet and post compressed proofs back to Ethereum L1.',
      commonTrap: 'Sending ETH or USDC over the Arbitrum network to an exchange address that only accepts Ethereum Mainnet without verifying supported networks.',
    },
  },
  {
    id: 'topic-c1-6',
    code: 'C1.6',
    slug: 'crypto-c1-6-altcoins-and-tokens',
    title: 'Altcoins and Tokens',
    overviewEn:
      'Altcoins refer to all cryptocurrencies other than Bitcoin, ranging from alternative Layer-1 coins with their own blockchains to application tokens issued on top of existing smart-contract networks.',
    overviewTaglish:
      'Ang altcoins ay lahat ng crypto bukod sa Bitcoin—kasama rito ang coins na may sariling blockchain (gaya ng SOL, AVAX) at tokens na nakatayo sa ibabaw ng existing network gaya ng ERC-20 tokens.',
    objectives: [
      'Differentiate native Coins (own Layer-1 blockchain) from Tokens (smart contracts like ERC-20 or SPL).',
      'Categorize altcoin sectors: Layer 1s, Layer 2s, DeFi, Infrastructure/Oracles, Gaming, and high-risk Memecoins.',
      'Understand survivor bias: most altcoins lose 80%–99% against Bitcoin across full bear markets.',
    ],
    keyPoints: [
      'Altcoins carry higher beta—they outperform BTC aggressively during bull risk-on phases and bleed far harder during downturns.',
      'Many tokens have weak utility or heavy insider unlocks; always check tokenomics before swing holding.',
      'Memecoins trade purely on attention and liquidity—never confuse narrative momentum with fundamental durability.',
    ],
    limitationsNote: 'Hundreds of past top-50 altcoins never regained prior all-time highs—always manage altcoin risk tightly.',
    practicalExample:
      'SOL is a native coin powering the Solana blockchain, whereas LINK or UNI are ERC-20 tokens running as smart contracts on Ethereum.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.5'],
    estimatedMinutes: 8,
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'What is the technical difference between a native crypto "coin" and a "token"?',
      options: [
        'Coins are always priced above $100 and tokens are always below $1',
        'A coin operates on its own independent blockchain (e.g., BTC, ETH, SOL), while a token is created via smart contract on an existing blockchain (e.g., ERC-20)',
        'Tokens cannot be traded on centralized exchanges',
        'Coins are backed by physical gold',
      ],
      correctIndex: 1,
      rationale: 'Native coins pay network consensus and gas on their own Layer 1; tokens inherit the host blockchain’s infrastructure.',
      commonTrap: 'Holding high-beta small-cap altcoins passively through a bear market assuming they will always bounce back like Bitcoin.',
    },
  },
  {
    id: 'topic-c1-7',
    code: 'C1.7',
    slug: 'crypto-c1-7-stablecoins',
    title: 'Stablecoins',
    overviewEn:
      'Stablecoins are cryptocurrencies designed to maintain a steady 1:1 peg to a reference asset—most commonly the US Dollar (USDT, USDC)—serving as the primary quote currency, margin collateral, and safe-harbor parking asset in crypto.',
    overviewTaglish:
      'Ang stablecoins tulad ng USDT at USDC ay cryptocurrencies na naka-peg 1:1 sa US Dollar—ginagamit ito bilang pangunahing quote currency, margin collateral, at pansamantalang safe-harbor sa crypto trading.',
    objectives: [
      'Compare fiat-backed centralized stablecoins (USDC, USDT), crypto-collateralized stablecoins (DAI/USDS), and fragile algorithmic designs.',
      'Explain why most crypto trading pairs (e.g., BTC/USDT) quote in stablecoins for fast capital rotation.',
      'Recognize reserve transparency, issuer freeze capability, and depeg risks.',
    ],
    keyPoints: [
      'Fiat-backed stablecoins hold cash and short-term Treasury bills as reserves, but rely on issuer solvency and banking rails.',
      'Purely unbacked algorithmic stablecoins (like historic UST) carry fatal death-spiral depeg risks.',
      'Diversifying large idle balances across regulated fiat and audited stablecoins reduces single-issuer risk.',
    ],
    practicalExample:
      'When a crypto trader exits a Bitcoin swing trade to sit in cash during uncertainty, they sell BTC into USDC or USDT rather than wiring back to a bank every day.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.6'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Which category of stablecoin carries the highest historical risk of a sudden "death-spiral" collapse?',
      options: [
        'Short-term US Treasury-backed audited stablecoins',
        'Unbacked or reflexively collateralized algorithmic stablecoins relying on a volatile sister token',
        'Over-collateralized multi-asset stablecoins with conservative liquidation ratios',
        'Cash balances held directly in a regulated bank',
      ],
      correctIndex: 1,
      rationale: 'Algorithmic stablecoins that depend on market confidence in a volatile sibling token can unravel rapidly once redemptions accelerate.',
      commonTrap: 'Assuming every asset labeled "stablecoin" is 100% risk-free and parking life savings in high-yield obscure stablecoins.',
    },
  },
  {
    id: 'topic-c1-8',
    code: 'C1.8',
    slug: 'crypto-c1-8-cex-vs-dex',
    title: 'Centralized vs. Decentralized Exchanges',
    overviewEn:
      'Centralized Exchanges (CEXs) like Binance, Coinbase, or Kraken match trades via custodial order books with fiat on-ramps, while Decentralized Exchanges (DEXs) like Uniswap let users swap directly from self-custody wallets via smart contracts.',
    overviewTaglish:
      'Ang Centralized Exchange (CEX) ay may order book at custodial account na mabilis at may fiat on-ramp, habang ang Decentralized Exchange (DEX) ay direktang wallet-to-wallet swap gamit ang smart contracts.',
    objectives: [
      'Compare CEXs and DEXs across custody, KYC requirements, liquidity depth, fees, and counterparty risk.',
      'Explain how Automated Market Makers (AMMs) price swaps via liquidity pools and cause price impact on thin pools.',
      'Use each venue appropriately: CEX for deep execution and fiat ramps, self-custody/DEX for verified on-chain ownership.',
    ],
    keyPoints: [
      'CEX pros: deep order books, fast execution, advanced stop orders; cons: exchange insolvency or account freeze risk.',
      'DEX pros: self-custody ("your keys, your coins") and permissionless access; cons: gas fees, MEV/slippage, and scam-token exposure.',
      'Never leave long-term investment holdings sitting unnecessarily on a centralized exchange.',
    ],
    practicalExample:
      'A trader executes active BTC/USDT limit orders on a high-liquidity CEX with tight 0.01% spreads, then withdraws long-term spot BTC savings to a hardware wallet.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.7'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'What is the biggest structural risk of holding all your long-term crypto funds on a Centralized Exchange (CEX)?',
      options: [
        'You cannot place limit orders on a CEX',
        'Counterparty custody risk—if the exchange goes bankrupt, gets hacked, or freezes withdrawals, you do not control the private keys',
        'CEXs do not support Bitcoin',
        'CEX trades require paying Ethereum mainnet gas on every single fill',
      ],
      correctIndex: 1,
      rationale: 'On a CEX you hold an IOU entry in the company’s database rather than direct cryptographic control of the coins.',
      commonTrap: 'Buying an unverified fake copycat token on a DEX without checking the official smart-contract address.',
    },
  },
  {
    id: 'topic-c1-9',
    code: 'C1.9',
    slug: 'crypto-c1-9-crypto-wallets',
    title: 'Crypto Wallets',
    overviewEn:
      'Crypto wallets manage your public addresses and private signing keys—falling into custodial exchange accounts, internet-connected "hot" software wallets, and offline "cold" hardware wallets.',
    overviewTaglish:
      'Ang crypto wallet ang nagtatago ng iyong private keys at address—nahahati ito sa custodial exchange wallets, internet-connected na hot wallets (MetaMask, Phantom), at offline na cold hardware wallets.',
    objectives: [
      'Compare hot wallets (convenient for active DeFi, exposed to malware/phishing) with cold hardware wallets (keys stay offline).',
      'Separate wallets by function: a "vault" cold wallet for long-term storage and a small "burner/hot" wallet for daily dApp interactions.',
      'Verify receiving addresses character-by-character and send a small test transfer before moving large amounts.',
    ],
    keyPoints: [
      'Hardware wallets sign transactions inside an isolated security chip so private keys never touch your PC browser.',
      'Never connect your main cold-storage vault directly to random websites or unverified airdrops.',
      'Always purchase hardware wallets directly from the official manufacturer—never secondhand.',
    ],
    practicalExample:
      'Before moving $5,000 in USDC to a new wallet, a disciplined user sends a $10 test transfer, verifies receipt on-chain, and only then sends the remaining balance.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.8'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What is the safest operational habit when using self-custody wallets alongside Web3 apps?',
      options: [
        'Connect your primary life-savings wallet to every new airdrop site',
        'Keep long-term holdings in an isolated offline hardware vault and use a separate small hot wallet for daily dApps',
        'Screenshot your wallet keys and store them in public cloud albums',
        'Buy pre-initialized hardware wallets from discount resellers',
      ],
      correctIndex: 1,
      rationale: 'Compartmentalizing funds ensures that even if a hot wallet approves a malicious contract, your main savings vault remains untouched.',
      commonTrap: 'Falling for address-poisoning attacks by copying a lookalike address from transaction history instead of verifying every character.',
    },
  },
  {
    id: 'topic-c1-10',
    code: 'C1.10',
    slug: 'crypto-c1-10-private-keys-and-seed-phrases',
    title: 'Private Keys and Seed Phrases',
    overviewEn:
      'A seed phrase (12 or 24 recovery words) mathematically generates all private keys inside a self-custody wallet—anyone who sees those words gains instant, permanent control of every coin inside.',
    overviewTaglish:
      'Ang seed phrase (12 o 24 recovery words) ang master key na bumubuo sa lahat ng private keys ng wallet mo—sinumang makakita nito ay puwedeng kunin agad ang lahat ng laman ng wallet mo.',
    objectives: [
      'Apply non-negotiable seed-phrase storage hygiene: offline pen-and-paper or stamped metal, never screenshots or cloud notes.',
      'Recognize that legitimate support staff, moderators, or websites will NEVER ask for your seed phrase.',
      'Plan secure physical backup redundancy against fire, flooding, or accidental loss.',
    ],
    keyPoints: [
      'Never type your seed phrase into any browser form, Telegram bot, Google Doc, or "wallet validation" website.',
      'No recovery phrase + broken phone = permanent, irreversible loss of funds.',
      'Optional BIP-39 passphrases add a "25th word" layer for advanced physical security when documented carefully.',
    ],
    practicalExample:
      'A user’s laptop breaks completely; because they stored their 24-word seed phrase offline in a fireproof metal backup, they restore their entire wallet safely on a new hardware device in 5 minutes.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.9'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'A Discord moderator claiming to be "Official Wallet Support" asks you to enter your 12-word seed phrase into a sync link to fix a stuck transaction. What should you do?',
      options: [
        'Enter only the first 6 words to verify trust',
        'Immediately block and ignore them—real support will NEVER ask for your seed phrase',
        'Send a screenshot of the seed phrase privately',
        'Transfer more ETH into the wallet first',
      ],
      correctIndex: 1,
      rationale: 'Asking for a seed phrase is 100% guaranteed to be a theft scam; your seed phrase never needs to be typed online to resolve any transaction issue.',
      commonTrap: 'Saving a photo of your recovery phrase in phone gallery or cloud drive, which malware and breached accounts sweep instantly.',
    },
  },
  {
    id: 'topic-c1-11',
    code: 'C1.11',
    slug: 'crypto-c1-11-gas-fees-and-network-fees',
    title: 'Gas Fees and Network Fees',
    overviewEn:
      'Gas fees (or network transaction fees) compensate validators and miners for computing and securing on-chain transactions—fluctuating dynamically with blockspace congestion.',
    overviewTaglish:
      'Ang gas fees o network fees ang binabayaran sa validators o miners para maproseso ang on-chain transaction—tumataas ito kapag siksikan ang network at bumababa kapag maluwag.',
    objectives: [
      'Understand gas calculation on EVM chains (Gas Units × Gas Price in Gwei) and why swaps cost more than simple transfers.',
      'Keep a small native gas token buffer (ETH, SOL, MATIC/POL, BNB) in self-custody wallets so tokens never get stranded.',
      'Reduce costs by batching transfers during low-congestion hours or using low-fee Layer-2 networks.',
    ],
    keyPoints: [
      'You cannot move ERC-20 tokens like USDT out of an Ethereum wallet unless you hold ETH for gas.',
      'Failed smart-contract transactions still consume gas fees because validators expended computation verifying them.',
      'Check live gas trackers before executing small on-chain swaps so fees do not consume 20% of your capital.',
    ],
    practicalExample:
      'A user sends $50 of USDT on Ethereum Mainnet during peak congestion and pays $14 in gas (28% fee)—using Arbitrum, Base, or Tron/Solana (when supported on both ends) reduces the fee to pennies.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.10'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'You have 500 USDT (ERC-20) in your Ethereum self-custody wallet, but 0 ETH. What happens when you try to send that USDT back to an exchange?',
      options: [
        'The network automatically deducts 1 USDT as gas',
        'You cannot broadcast the transfer until you deposit a small amount of ETH to pay the network gas fee',
        'The transaction processes for free after 24 hours',
        'The USDT converts into Bitcoin automatically',
      ],
      correctIndex: 1,
      rationale: 'Ethereum requires its native coin (ETH) to pay gas for all ERC-20 token transfers and smart-contract calls.',
      commonTrap: 'Withdrawing $30 of an altcoin onto Ethereum Mainnet only to discover gas costs nearly as much as the position itself.',
    },
  },
  {
    id: 'topic-c1-12',
    code: 'C1.12',
    slug: 'crypto-c1-12-understanding-blockchain-networks',
    title: 'Understanding Blockchain Networks',
    overviewEn:
      'Modern crypto operates across multiple distinct blockchain networks—Bitcoin, Ethereum, Layer-2 rollups, Solana, BNB Chain, and Tron—requiring exact network matching whenever transferring assets.',
    overviewTaglish:
      'Maraming magkakaibang blockchain networks sa crypto (Bitcoin, Ethereum, Arbitrum, Solana, Tron)—kailangang laging eksaktong magkatugma ang pinagpadalhan at tatanggap na network para hindi mawala ang pondo.',
    objectives: [
      'Match sending and receiving blockchain networks identically before every deposit or withdrawal.',
      'Recognize cross-chain bridge risks (smart-contract exploits, wrapped token depegs) versus direct exchange routing.',
      'Include required Memos/Destination Tags when depositing networks like XRP, XLM, ATOM, or TON to centralized exchanges.',
    ],
    keyPoints: [
      'Sending USDT via TRC-20 to an ERC-20 deposit address can permanently lose funds or incur costly recovery fees.',
      'EVM chains (Ethereum, Arbitrum, Base, Polygon, BNB) share `0x...` address formats—always double-check the selected network.',
      'Always verify whether a Memo/Tag is required when sending to pooled exchange deposit addresses.',
    ],
    practicalExample:
      'When withdrawing USDC from Exchange A to Exchange B, you verify both platforms support USDC on Arbitrum One, run a $5 test transfer, then move the full balance safely.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.11'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What is the MOST critical rule when withdrawing USDT from one exchange to another?',
      options: [
        'Always pick the most expensive network option',
        'Ensure the exact same blockchain network (e.g., Arbitrum to Arbitrum, or ERC-20 to ERC-20) is selected on both withdrawal and deposit screens',
        'Skip checking memos or destination tags to save time',
        'Send the entire balance in one shot without testing',
      ],
      correctIndex: 1,
      rationale: 'Mismatched blockchain networks are one of the leading causes of avoidable fund loss in crypto operations.',
      commonTrap: 'Assuming that because two EVM networks share an `0x` wallet address format, every centralized exchange supports both networks automatically.',
    },
  },

  // =========================================================================
  // MODULE C2 — Crypto Trading Mechanics (C2.1 – C2.12)
  // Spot, Margin, & Liquidation Mechanics BEFORE Leveraged Strategies!
  // =========================================================================
  {
    id: 'topic-c2-1',
    code: 'C2.1',
    slug: 'crypto-c2-1-spot-trading',
    title: 'Spot Trading',
    overviewEn:
      'Spot trading means buying and selling actual cryptocurrencies for immediate delivery with 1x cash—carrying zero liquidation price, zero funding fees, and the cleanest training ground for every crypto trader.',
    overviewTaglish:
      'Ang spot trading ay direktang pagbili at pagbenta ng aktwal na crypto gamit ang sariling cash (1x)—walang liquidation price, walang funding fee, at pinakaligtas na simula para matutong mag-trade.',
    objectives: [
      'Execute spot trades using limit, market, and stop-limit orders while verifying base vs. quote currencies (e.g., BTC/USDT).',
      'Explain why spot ownership eliminates forced liquidation even during violent −20% flash wicks.',
      'Build consistent chart reading and risk sizing on Spot BEFORE ever enabling derivatives or margin.',
    ],
    keyPoints: [
      'In BTC/USDT, BTC is the base asset you buy/sell and USDT is the quote currency used to price it.',
      'Spot trades have no expiration, no ongoing funding-rate drag, and zero liquidation risk.',
      'You can still lose money on spot if you skip stop-losses—position sizing and invalidation still apply.',
    ],
    practicalExample:
      'Buying $1,000 of spot ETH at $3,000 survives a temporary −15% flash wick down to $2,550 without forced liquidation, whereas a 10x leveraged long gets wiped to zero immediately.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.12'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'Why should every developing crypto trader master Spot trading before touching perpetual futures?',
      options: [
        'Because spot markets only go up and never experience drawdowns',
        'Because spot trading removes liquidation mechanics, funding drag, and leverage blowup while building real execution skill',
        'Because perpetual futures cannot use stop-loss orders',
        'Because spot trades are exempt from exchange fees',
      ],
      correctIndex: 1,
      rationale: 'Spot isolates directional and risk-management skill without leveraged margin calls magnifying beginner mistakes.',
      commonTrap: 'Skipping Spot on day one and blowing up a fresh account on 20x perpetual futures.',
    },
  },
  {
    id: 'topic-c2-2',
    code: 'C2.2',
    slug: 'crypto-c2-2-crypto-futures-trading',
    title: 'Crypto Futures Trading',
    overviewEn:
      'Crypto futures are derivative agreements to buy or sell an underlying cryptocurrency at a predetermined price—enabling both shorting and capital-efficient hedging, while introducing margin requirements and liquidation risk.',
    overviewTaglish:
      'Ang crypto futures ay derivative contracts na nagpapahintulot mag-long, mag-short, o mag-hedge gamit ang margin—pero hindi ka nagmamay-ari ng aktwal na coin at may panganib ng liquidation.',
    objectives: [
      'Differentiate quarterly expiring futures (fixed delivery/settlement date) from non-expiring perpetual futures.',
      'Contrast Linear (USDT/USDC-margined) contracts against Inverse (coin-margined) contracts.',
      'Understand futures "basis" (futures price minus spot price) as a gauge of bullish or bearish market demand.',
    ],
    keyPoints: [
      'Linear USDT-margined futures keep margin value stable in dollars; Coin-margined (inverse) futures double risk when collateral drops alongside price.',
      'Quarterly futures converge to spot price at expiration and charge no periodic funding rate.',
      'Futures are tools for defined-risk hedging and advanced execution—not shortcuts to get rich fast.',
    ],
    limitationsNote: 'Derivatives amplify both losses and fees; master C2.5–C2.10 margin and liquidation math completely before trading live.',
    practicalExample:
      'A miner holding 2 BTC sells a 2-BTC quarterly short future to lock in current dollar revenue against a sudden market drop without selling spot coins immediately.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.1'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'Why is a Coin-Margined (Inverse) BTC long position riskier during a sell-off than a USDT-Margined (Linear) long position?',
      options: [
        'Because USDT-margined futures have no stop-losses',
        'Because as BTC drops, both your trade PnL AND the dollar value of your BTC collateral fall simultaneously, accelerating liquidation',
        'Because Coin-Margined futures only trade on Mondays',
        'Because Linear futures never have liquidation prices',
      ],
      correctIndex: 1,
      rationale: 'With coin-margined longs, falling BTC shrinks collateral value at the exact moment losses grow, pulling liquidation closer nonlinearly.',
      commonTrap: 'Opening coin-margined leveraged longs without realizing collateral depreciation speeds up liquidation.',
    },
  },
  {
    id: 'topic-c2-3',
    code: 'C2.3',
    slug: 'crypto-c2-3-perpetual-contracts',
    title: 'Perpetual Contracts',
    overviewEn:
      'Perpetual contracts ("perps") are crypto’s most heavily traded derivative—futures with NO expiration date that stay anchored to spot prices via periodic funding-rate payments between longs and shorts.',
    overviewTaglish:
      'Ang perpetual contracts ("perps") ang pinaka-aktibong derivative sa crypto—futures ito na WALANG expiration date at pinapanatiling malapit sa spot price sa pamamagitan ng regular na funding payments.',
    objectives: [
      'Explain how perpetual contracts stay tethered to the underlying spot index price without expiring.',
      'Compare perp trading volume and liquidity with spot order books.',
      'Account for ongoing funding costs whenever holding a perpetual position across multiple 8-hour intervals.',
    ],
    keyPoints: [
      'No expiry date means you can hold a perp indefinitely—as long as margin stays above maintenance requirements.',
      'When perps trade above spot (bullish crowding), longs pay shorts; when below spot, shorts pay longs.',
      'Because perps dominate crypto volume, sudden leveraged flushes often drive short-term price wicks.',
    ],
    practicalExample:
      'Holding a $10,000 BTC perpetual long for 10 days during a euphoric bull run at +0.05% funding every 8 hours costs $150 (1.5%) in funding fees alone—even if price moves sideways.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.2'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'What mechanism keeps a Perpetual Contract’s price anchored closely to the underlying Spot market price despite having no expiration date?',
      options: [
        'Daily manual resets by exchange support',
        'Periodic funding-rate payments exchanged between long and short traders',
        'Automatic position closure every midnight UTC',
        'Hard daily price-freeze limits',
      ],
      correctIndex: 1,
      rationale: 'Funding payments incentivize traders to take the opposite side whenever perp price drifts too far above or below the spot index.',
      commonTrap: 'Holding a crowded perpetual long for weeks during high positive funding instead of simply buying fee-free spot.',
    },
  },
  {
    id: 'topic-c2-4',
    code: 'C2.4',
    slug: 'crypto-c2-4-long-and-short-positions',
    title: 'Long and Short Positions',
    overviewEn:
      'Going Long profits when price rises and loses when price falls; going Short profits when price falls and loses when price rises—requiring exact notional sizing and directional invalidation either way.',
    overviewTaglish:
      'Sa Long position, kumikita kapag tumaas ang presyo; sa Short position, kumikita kapag bumaba ang presyo—pareho itong nangangailangan ng eksaktong position sizing at mahigpit na stop-loss.',
    objectives: [
      'Calculate linear PnL for both long and short positions from entry price, exit price, and contract quantity.',
      'Recognize why shorting in crypto faces violent short squeezes during strong bull trends.',
      'Use Reduce-Only flags on take-profit and stop-loss orders so exits never accidentally flip you into an opposite position.',
    ],
    keyPoints: [
      'Long PnL = (Exit − Entry) × Qty; Short PnL = (Entry − Exit) × Qty (minus fees and funding).',
      'Always enable "Reduce-Only" on exit limit/stop orders so partial fills do not open an unintended reverse trade.',
      'Shorting strong uptrends just because RSI looks high is one of the fastest ways to get squeezed.',
    ],
    practicalExample:
      'You short 1 ETH perpetual at $3,200 with a Reduce-Only stop-loss at $3,280 (−$80 risk) and Reduce-Only take-profit at $3,040 (+$160 reward, 2R).',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.3'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Why should you always check the "Reduce-Only" option on Take-Profit and Stop-Loss orders in crypto futures?',
      options: [
        'It cuts your exchange maker fees in half',
        'It guarantees the order can only shrink or close your open position and will never accidentally open a reverse trade',
        'It automatically adds extra margin to prevent liquidation',
        'It hides your order from the exchange matching engine',
      ],
      correctIndex: 1,
      rationale: 'Without Reduce-Only, if your position closes manually or via another stop, a leftover limit order could trigger and open an unwanted opposite trade.',
      commonTrap: 'Closing a trade manually and forgetting to cancel old non-reduce-only limit orders, then waking up in an unplanned position.',
    },
  },
  {
    id: 'topic-c2-5',
    code: 'C2.5',
    slug: 'crypto-c2-5-leverage-and-margin',
    title: 'Leverage and Margin',
    overviewEn:
      'Leverage lets you control a larger notional position using smaller margin collateral—meaning risk is ALWAYS determined by Position Size × Stop Distance, NEVER by the leverage slider alone, while high leverage dangerously shrinks liquidation buffer.',
    overviewTaglish:
      'Pinapalaki ng leverage ang hawak mong posisyon gamit ang mas maliit na margin—tandaan: ang tunay na risk ay nakabase sa Position Size × Stop Distance, at ang sobrang taas na leverage ay nagpapalapit agad sa liquidation.',
    objectives: [
      'Distinguish Initial Margin (required to open), Maintenance Margin (minimum to avoid liquidation), and Notional Position Value.',
      'Verify mathematically that 20x leverage magnifies exchange fees and shrinks liquidation distance to <5%.',
      'Size every trade by fixed account risk (e.g., 1%) first, keeping effective leverage conservative (typically 1x–3x max for beginners).',
    ],
    keyPoints: [
      'Notional Value = Margin × Leverage. A $500 margin at 10x controls $5,000 notional—exchange fees are charged on the full $5,000!',
      'At 20x leverage, a routine 4.5% crypto wiggle triggers total margin wipeout (liquidation).',
      'Leverage does NOT create edge—it only magnifies both losses and trading fees if your strategy is unproven.',
    ],
    limitationsNote: 'High leverage (20x–100x) is mathematically engineered to harvest retail accounts via noise wicks and fees—avoid it completely.',
    practicalExample:
      'With a $2,000 account and 1% max risk ($20), entering BTC at $80,000 with a 2% stop ($78,400) dictates a $1,000 notional position—just 0.5x effective account leverage, zero liquidation danger.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.4'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'If you open a crypto perpetual trade with $200 margin at 25x leverage ($5,000 notional), on what amount does the exchange charge trading fees?',
      options: [
        'Only on the $200 margin',
        'On the full $5,000 notional position value (on both entry and exit)',
        'Only if the trade finishes in profit',
        'Fees are fixed at $0.01 regardless of leverage',
      ],
      correctIndex: 1,
      rationale: 'Exchange fees apply to total notional size; at 25x leverage, a 0.05% round-trip fee on $5,000 ($5.00) instantly eats 2.5% of your $200 margin.',
      commonTrap: 'Cranking leverage to 50x thinking "I only put $100 in" while paying massive notional fees and getting liquidated on a 1.5% normal wick.',
    },
  },
  {
    id: 'topic-c2-6',
    code: 'C2.6',
    slug: 'crypto-c2-6-cross-vs-isolated-margin',
    title: 'Cross vs. Isolated Margin',
    overviewEn:
      'Isolated Margin restricts a position’s maximum loss strictly to the dedicated collateral assigned to that single trade, whereas Cross Margin pools your entire futures wallet balance to defend open trades—risking a full account wipeout if left unprotected.',
    overviewTaglish:
      'Sa Isolated Margin, hanggang sa nakalaang margin lang ng isang trade ang puwedeng mawala; sa Cross Margin, buong futures wallet balance mo ang nakataya kapag walang mahigpit na stop-loss.',
    objectives: [
      'Compare Isolated Margin (strict per-trade firewall) against Cross Margin (shared wallet buffer for hedged portfolios).',
      'Identify why beginners should default to Isolated Margin alongside hard stop-losses placed well before liquidation.',
      'Recognize the deadly mistake of repeatedly clicking "Add Margin" to an isolated losing trade.',
    ],
    keyPoints: [
      'Isolated Margin prevents one runaway volatile altcoin trade from draining your entire futures wallet.',
      'Cross Margin lowers liquidation price on paper, but without a hard stop-loss it can liquidate 100% of your futures account in one flash crash.',
      'Your stop-loss should ALWAYS trigger far earlier than your liquidation price—liquidation is a last-resort failure, never a stop-loss.',
    ],
    practicalExample:
      'A trader with $1,000 in futures puts $100 Isolated Margin on an altcoin trade with a $10 hard stop. Even in an extreme outage or flash crash, worst-case loss is strictly capped at $100—never the full $1,000.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.5'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Why is Isolated Margin generally recommended over Cross Margin for developing crypto futures traders?',
      options: [
        'Isolated Margin eliminates all trading fees',
        'Isolated Margin walls off risk to the specific margin allocated to that trade so one mistake cannot wipe the entire futures wallet',
        'Cross Margin does not allow taking profit',
        'Isolated Margin guarantees you can never be stopped out',
      ],
      correctIndex: 1,
      rationale: 'Isolated Margin acts as a hard circuit breaker protecting the rest of your futures balance during sudden volatility spikes.',
      commonTrap: 'Using Cross Margin with no stop-loss thinking "my liquidation price is far away," only to lose the whole wallet during a sudden −30% crypto cascade.',
    },
  },
  {
    id: 'topic-c2-7',
    code: 'C2.7',
    slug: 'crypto-c2-7-liquidation-price',
    title: 'Liquidation Price',
    overviewEn:
      'Liquidation occurs when unrealized losses erode your margin down to the exchange’s Maintenance Margin level, triggering forced closure of your position plus extra liquidation penalty fees.',
    overviewTaglish:
      'Nangyayari ang liquidation kapag naubos na ng unrealized loss ang margin mo hanggang sa Maintenance Margin—sapilitang isasara ng exchange ang posisyon mo at may dagdag pang liquidation fee.',
    objectives: [
      'Estimate approximate liquidation distance (~100% ÷ Leverage minus maintenance margin buffer and fees).',
      'Explain why liquidation occurs BEFORE your margin hits exact 0% (maintenance margin + insurance fund fee).',
      'Design every trade so your structural stop-loss triggers long before the liquidation engine ever activates.',
    ],
    keyPoints: [
      'Approximate isolated liquidation move: 5x ≈ ~19%, 10x ≈ ~9.5%, 20x ≈ ~4.5%, 50x ≈ ~1.5% against you.',
      'Getting liquidated costs far more than taking a planned stop-loss because exchanges charge liquidation clearance fees.',
      'Cascading liquidations happen when forced market orders push price into the next cluster of liquidation levels.',
    ],
    limitationsNote: 'Never treat your liquidation price as your stop-loss—if you are regularly getting liquidated, your leverage and sizing are dangerously broken.',
    practicalExample:
      'On a 10x isolated long from $100, maintenance margin (~0.5%) triggers forced liquidation near $90.50 rather than $90.00—wiping nearly 100% of allocated margin plus penalty fees.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.6'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Roughly how small of an adverse price move will trigger liquidation on an isolated 20x leveraged long position?',
      options: ['About 50%', 'About 20%', 'Less than 5% (typically ~4.5% after maintenance margin)', 'Exactly 100%'],
      correctIndex: 2,
      rationale: '100% ÷ 20 = 5%, and deducting maintenance margin (~0.4%–0.5%) triggers forced liquidation at roughly a 4.5% adverse move—a routine single-hour crypto swing.',
      commonTrap: 'Using high leverage and letting the liquidation engine serve as an expensive "stop-loss."',
    },
  },
  {
    id: 'topic-c2-8',
    code: 'C2.8',
    slug: 'crypto-c2-8-funding-rates',
    title: 'Funding Rates',
    overviewEn:
      'Funding rates are periodic peer-to-peer payments (typically every 8 hours: 00:00, 08:00, and 16:00 UTC — 8:00 AM, 4:00 PM, and 12:00 AM PHT) between perpetual longs and shorts to keep perp prices aligned with spot.',
    overviewTaglish:
      'Ang funding rate ay regular na bayaran (karaniwang kada 8 oras: 8:00 AM, 4:00 PM, at 12:00 AM PHT) sa pagitan ng perp longs at shorts para manatiling dikit ang perp price sa spot.',
    objectives: [
      'Read funding rate signs correctly: positive (+) means Longs pay Shorts; negative (−) means Shorts pay Longs.',
      'Calculate dollar funding cost = Position Notional Value × Funding Rate at the timestamp snapshot.',
      'Recognize extreme funding (+0.05% to +0.15% per 8h) as a warning of crowded, fragile leverage.',
    ],
    keyPoints: [
      'Baseline neutral funding on major exchanges is typically +0.01% per 8 hours (~10.95% annualized).',
      'Funding applies to full Notional Position Value—not just your initial margin.',
      'Exchanges do not pocket funding directly; it transfers strictly between opposing traders open at the settlement second.',
    ],
    practicalExample:
      'If funding is +0.08% per 8h on a $25,000 notional long, you pay $20 every 8 hours ($60/day) just to keep the trade open—warning that bullish leverage is heavily crowded.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.7'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'If a perpetual contract shows a POSITIVE funding rate of +0.06% per 8 hours, who pays whom at the funding timestamp?',
      options: [
        'Short holders pay Long holders',
        'Long holders pay Short holders (calculated on full notional position size)',
        'The exchange pays all traders a 0.06% bonus',
        'Only spot holders pay the funding fee',
      ],
      correctIndex: 1,
      rationale: 'Positive funding occurs when perp price trades above spot due to aggressive long demand, so longs pay shorts to pull price back toward spot.',
      commonTrap: 'Opening a leveraged long right before an extreme positive funding flush without checking holding cost or crowding risk.',
    },
  },
  {
    id: 'topic-c2-9',
    code: 'C2.9',
    slug: 'crypto-c2-9-open-interest',
    title: 'Open Interest',
    overviewEn:
      'Open Interest (OI) measures the total value or number of currently active, unclosed futures and perpetual contracts—showing how much fresh leverage is entering or exiting the market.',
    overviewTaglish:
      'Sinusukat ng Open Interest (OI) ang kabuuang halaga ng mga aktibo at bukas pang futures/perp contracts—ipinapakita nito kung may bagong leverage na pumapasok o lumalabas sa merkado.',
    objectives: [
      'Differentiate Open Interest (active open contracts) from Trading Volume (total contracts traded during a period).',
      'Interpret basic Price + OI combinations: rising price + rising OI (new longs entering) vs. rising price + falling OI (short covering).',
      'Spot fragile over-leveraged squeezes when OI spikes vertically while price stalls.',
    ],
    keyPoints: [
      'OI rises when a new buyer and new seller open fresh contracts; OI falls when existing positions close or get liquidated.',
      'A sharp flush in Open Interest clears crowded leverage ("OI reset"), often creating healthier footing for the next trend.',
      'Compare OI denominated in coins (BTC) vs. USD—USD OI rises automatically when price rises even if contract count stays flat.',
    ],
    practicalExample:
      'BTC chops sideways for 3 days while Open Interest surges +$2.5B and funding jumps positive—signaling crowded leveraged bets primed for a sharp liquidation sweep.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.8'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'When a cryptocurrency’s price rallies sharply while Open Interest DROPS steeply, what is primarily driving that rally?',
      options: [
        'Fresh long leverage aggressively opening new contracts',
        'Existing short sellers closing or getting liquidated (short covering / short squeeze)',
        'Exchange servers turning off futures matching',
        'Spot investors withdrawing coins to hardware wallets',
      ],
      correctIndex: 1,
      rationale: 'Falling Open Interest means active contracts are being closed out; paired with rising price, that indicates shorts buying back to exit.',
      commonTrap: 'Mistaking high trading volume for high Open Interest—day traders flipping contracts back and forth raise volume without increasing OI.',
    },
  },
  {
    id: 'topic-c2-10',
    code: 'C2.10',
    slug: 'crypto-c2-10-mark-price-vs-last-price',
    title: 'Mark Price vs. Last Price',
    overviewEn:
      'Last Price is the most recent trade printed on that single exchange’s order book, whereas Mark Price is a composite fair-value benchmark anchored to multi-exchange spot indices used to trigger liquidations and stop orders fairly.',
    overviewTaglish:
      'Ang Last Price ay ang pinakahuling trade sa isang exchange lang, samantalang ang Mark Price ay fair-value average mula sa maraming spot exchanges na ginagamit para iwasan ang unfair wick liquidations.',
    objectives: [
      'Explain why exchanges trigger liquidations and calculate unrealized PnL using Mark Price rather than Last Price.',
      'Choose the appropriate trigger type (Mark Price vs. Last Price) when setting stop-loss orders.',
      'Understand why a brief single-exchange "scam wick" may not liquidate a position if Mark Price stays calm.',
    ],
    keyPoints: [
      'Mark Price blends spot prices from multiple major exchanges plus decaying funding basis to resist local order-book manipulation.',
      'Setting stop-losses on Mark Price helps avoid single-exchange thin-book wicks, though fills still execute on the local book.',
      'Realized PnL always settles at your actual fill price (Last/execution price), not the Mark Price.',
    ],
    practicalExample:
      'A whale dumps a huge market order on one thin exchange, momentarily flashing Last Price down −6%, while multi-exchange Mark Price dips only −0.8%—protecting disciplined traders from unjust liquidation.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.9'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'Why do reputable crypto derivatives exchanges use Mark Price instead of Last Price to trigger liquidations?',
      options: [
        'To force more liquidations during quiet hours',
        'To prevent thin-order-book manipulation or single-exchange flash wicks from unfairly liquidating traders',
        'Because exchanges cannot calculate Last Price in real time',
        'Because Mark Price only updates once per week',
      ],
      correctIndex: 1,
      rationale: 'Anchoring liquidations to a multi-exchange spot index protects traders from localized order-book anomalies.',
      commonTrap: 'Wondering why your chart candle touched your stop-loss visually (Last Price) without triggering when your stop was configured to Mark Price.',
    },
  },
  {
    id: 'topic-c2-11',
    code: 'C2.11',
    slug: 'crypto-c2-11-realized-and-unrealized-pnl',
    title: 'Realized and Unrealized PnL',
    overviewEn:
      'Unrealized Profit and Loss (PnL) fluctuates on paper while a trade remains open, whereas Realized PnL is the final net dollar gain or loss locked into your account balance after closing—including fees and funding.',
    overviewTaglish:
      'Ang Unrealized PnL ay papel na kita o lugi habang bukas pa ang posisyon, samantalang ang Realized PnL ang pinal at totoong kita o lugi matapos isara ang trade kasama ang fees at funding.',
    objectives: [
      'Distinguish paper gains (Unrealized PnL) from settled equity (Realized PnL).',
      'Track Net Realized PnL after subtracting entry/exit commissions, slippage, and cumulative funding.',
      'Avoid judging performance by "ROE %" screenshots inflated by high leverage.',
    ],
    keyPoints: [
      'A "+200% ROE" screenshot on 50x leverage is just a +4% move—always measure performance in account R-multiples and net dollars.',
      'Unrealized gains are never yours until protected via trailing stops or booked via partial/full exits.',
      'Check funding history alongside realized PnL so hidden holding costs do not distort your journal.',
    ],
    practicalExample:
      'A trader celebrates +$400 Unrealized PnL on an open altcoin trade, refuses to take partials or move stops, and watches a Sunday dump flip the trade into −$150 Realized PnL.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.10'],
    estimatedMinutes: 8,
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why can a social-media screenshot showing "+300% ROE" on a crypto futures trade be deeply misleading?',
      options: [
        'Because exchanges fake the green text color',
        'Because ROE % is divided by tiny leveraged margin rather than total account risk—50x leverage turns a routine 6% move into "+300% ROE"',
        'Because ROE % already subtracts income taxes',
        'Because spot trades cannot show percentage gains',
      ],
      correctIndex: 1,
      rationale: 'High leverage inflates Return on Margin (ROE%) dramatically even on tiny dollar positions; true skill is measured in net R-multiples and drawdown control.',
      commonTrap: 'Obsessing over ROE% instead of actual dollar risk, fee drag, and account equity curve.',
    },
  },
  {
    id: 'topic-c2-12',
    code: 'C2.12',
    slug: 'crypto-c2-12-exchange-fees',
    title: 'Exchange Fees',
    overviewEn:
      'Crypto exchanges charge Maker fees (lower, for limit orders adding liquidity to the book) and Taker fees (higher, for market orders removing liquidity)—a critical cost factor that compounds quickly for active traders.',
    overviewTaglish:
      'Naniningil ang crypto exchanges ng Maker fee (mas mababa para sa limit orders na nagdadagdag ng liquidity) at Taker fee (mas mataas para sa market orders)—malaking epekto ito kapag madalas kang mag-trade.',
    objectives: [
      'Contrast Maker orders (Post-Only limit orders resting on the book) versus Taker orders (crossing the spread immediately).',
      'Calculate round-trip fee drag on leveraged notional positions.',
      'Avoid overtrading low-R scalps where taker fees and spread erase positive expectancy.',
    ],
    keyPoints: [
      'Typical baseline perp fees are ~0.02% Maker vs. ~0.05% Taker (0.10% round-trip taker on full notional).',
      'On 10x leverage, a 0.10% round-trip taker fee equals 1.0% of your margin on EVERY trade before price moves.',
      'Use Post-Only limit orders for planned entries and take-profits, reserving market/taker orders mainly for protective stop-losses.',
    ],
    practicalExample:
      'A high-frequency scalper executing 100 market-order trades per month at $10,000 notional pays $1,000/month in taker fees—switching entries and targets to Maker limit orders cuts that cost by 60%.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.11'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'How does placing a "Post-Only" Limit Order affect your crypto exchange trading fee?',
      options: [
        'It charges double the Taker fee for priority speed',
        'It ensures your order rests on the order book as a Maker order (paying the lower Maker fee) or cancels instead of crossing as a Taker',
        'It converts your trade into a Spot withdrawal',
        'It disables stop-loss protection on the account',
      ],
      correctIndex: 1,
      rationale: 'Post-Only prevents accidental spread-crossing so you consistently capture lower Maker fee tiers.',
      commonTrap: 'Scalping tiny 0.2% moves with Market orders on leverage and slowly bleeding the account out purely to taker fees.',
    },
  },

  // =========================================================================
  // MODULE C3 — Crypto Market Analysis (C3.1 – C3.11)
  // =========================================================================
  {
    id: 'topic-c3-1',
    code: 'C3.1',
    slug: 'crypto-c3-1-bitcoin-dominance',
    title: 'Bitcoin Dominance',
    overviewEn:
      'Bitcoin Dominance (BTC.D) measures Bitcoin’s share of total cryptocurrency market capitalization—helping traders read whether capital is rotating defensively into BTC or aggressively out into altcoins.',
    overviewTaglish:
      'Sinusukat ng Bitcoin Dominance (BTC.D) ang porsyento ng BTC sa kabuuang market cap ng crypto—gabay ito kung pumapasok ang pera sa mas ligtas na BTC o umiikot na papunta sa altcoins.',
    objectives: [
      'Read the 4-quadrant matrix combining BTC price direction with BTC.D direction.',
      'Identify the classic altcoin tailwind: BTC rising steadily or consolidating high while BTC.D breaks downward.',
      'Avoid buying altcoins when BTC is dumping AND BTC.D is spiking upward.',
    ],
    keyPoints: [
      'BTC Up + BTC.D Up = Bitcoin-led rally (altcoins often lag or bleed on BTC pairs).',
      'BTC Stable/Up + BTC.D Down = prime altcoin expansion phase ("altseason" rotation).',
      'BTC Down + BTC.D Up = severe altcoin capitulation as capital flees risky alts back to BTC or stables.',
    ],
    practicalExample:
      'When BTC consolidates calmly near highs while BTC.D rejects 58% resistance and trends down toward 53%, strong Layer-1 and DeFi altcoins break out cleanly.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.12'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'Which combination of Bitcoin price and Bitcoin Dominance (BTC.D) historically creates the strongest tailwind for altcoin longs?',
      options: [
        'BTC plunging sharply while BTC.D spikes upward',
        'BTC trending upward or consolidating calmly near highs while BTC.D trends downward',
        'BTC crashing while total market cap halves',
        'BTC.D hitting all-time highs during a panic sell-off',
      ],
      correctIndex: 1,
      rationale: 'Stable or rising BTC paired with falling BTC.D signals risk-on capital flowing out of BTC and fresh stables into altcoins.',
      commonTrap: 'Assuming falling BTC.D is automatically bullish for alts—if BTC is crashing hard, alts can still fall in USD even if BTC.D dips temporarily.',
    },
  },
  {
    id: 'topic-c3-2',
    code: 'C3.2',
    slug: 'crypto-c3-2-total-crypto-market-cap',
    title: 'Total Crypto Market Capitalization',
    overviewEn:
      'Total crypto market-cap indices—TOTAL (all crypto), TOTAL2 (excluding BTC), TOTAL3 (excluding BTC & ETH), and USDT.D—reveal macro capital inflows and whether altcoin liquidity is expanding or shrinking.',
    overviewTaglish:
      'Ang TOTAL, TOTAL2 (walang BTC), TOTAL3 (walang BTC at ETH), at USDT.D charts ay nagpapakita kung may bagong kapital bang pumapasok sa buong crypto market o lumilipat pabalik sa stablecoins.',
    objectives: [
      'Use TOTAL, TOTAL2, and TOTAL3 charts alongside individual coin setups for top-down alignment.',
      'Interpret Stablecoin Dominance (USDT.D + USDC.D) as an inverse risk-appetite gauge.',
      'Spot broad divergence when BTC makes new highs while TOTAL3 stalls below resistance.',
    ],
    keyPoints: [
      'Rising USDT.D means traders are selling crypto into dollar stables (risk-off); falling USDT.D means cash is deploying into crypto.',
      'TOTAL3 breaking multi-month resistance confirms genuine broad altcoin demand.',
      'Top-down checks (TOTAL → BTC → BTC.D → Altcoin) filter low-probability trades quickly.',
    ],
    practicalExample:
      'Before entering an altcoin breakout, a trader checks TOTAL3 and sees it slamming directly into major weekly resistance while USDT.D bounces off support—deciding to cut size or wait.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.1'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'What does a sharp UPWARD breakout on the USDT Dominance (USDT.D) chart generally signal?',
      options: [
        'Aggressive risk-on capital pouring into small-cap altcoins',
        'Risk-off capital exiting Bitcoin and altcoins back into stablecoins',
        'Tether losing its $1.00 dollar peg permanently',
        'Guaranteed immediate Bitcoin all-time highs',
      ],
      correctIndex: 1,
      rationale: 'When crypto market cap drops while USDT supply stays steady, USDT’s share of total crypto cap (USDT.D) rises—reflecting defensive flight to stables.',
      commonTrap: 'Trading individual altcoin charts in isolation while ignoring a breakdown on TOTAL and TOTAL3.',
    },
  },
  {
    id: 'topic-c3-3',
    code: 'C3.3',
    slug: 'crypto-c3-3-altcoin-market-cycles',
    title: 'Altcoin Market Cycles',
    overviewEn:
      'Crypto capital historically rotates in waves—starting in Bitcoin, flowing into major large-caps like Ethereum and Solana, then spilling into mid-caps and speculative small-caps before abruptly reversing.',
    overviewTaglish:
      'Karaniwang umiikot ang kapital sa crypto nang pa-alon: una sa Bitcoin, sunod sa malalaking altcoins (ETH, SOL), saka sa mid-caps at speculative small-caps—bago biglang bumaligtad kapag ubos na ang bagong buyers.',
    objectives: [
      'Map the classic four-phase liquidity rotation: BTC → Large-Cap Alts → Mid-Cap Narratives → Speculative Blow-Off.',
      'Recognize late-cycle warning signs: vertical meme mania, extreme funding, and retail euphoria.',
      'Take structured profits back into BTC or stables during altcoin euphoria instead of round-tripping gains.',
    ],
    keyPoints: [
      'Altseasons are intense and brief—gains built over weeks can evaporate in days when rotation ends.',
      'Evaluate altcoins against BOTH USD and BTC pairs (e.g., SOL/BTC) to confirm real outperformance.',
      'Rotation is a tendency, not a guaranteed script—modern cycles feature selective narrative winners rather than every coin pumping.',
    ],
    limitationsNote: 'Thousands of newly launched tokens dilute liquidity in modern cycles—not every altcoin participates in every rally.',
    practicalExample:
      'During late-stage euphoria when low-quality memecoins jump 100% daily while BTC stalls, an experienced trader scales 70% of altcoin profits back into USDC and BTC.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.2'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'Why should an altcoin trader inspect an altcoin’s BTC pair (e.g., ETH/BTC or SOL/BTC) in addition to its USDT chart?',
      options: [
        'Because USDT charts are delayed by 24 hours',
        'To see whether the altcoin is genuinely outperforming Bitcoin or merely being dragged up more slowly while carrying higher risk',
        'Because BTC pairs have zero volatility',
        'Because exchanges only execute stop-losses on BTC pairs',
      ],
      correctIndex: 1,
      rationale: 'If an altcoin is bleeding on its BTC pair, you are taking far more risk for less return than simply holding Bitcoin.',
      commonTrap: 'Holding altcoin profits all the way back down −80% after the rotation wave ends because of greed for "one more 2x."',
    },
  },
  {
    id: 'topic-c3-4',
    code: 'C3.4',
    slug: 'crypto-c3-4-bull-and-bear-market-cycles',
    title: 'Bull and Bear Market Cycles',
    overviewEn:
      'Crypto experiences pronounced multi-year boom-and-bust cycles driven by global liquidity, macro interest rates, adoption waves, and leveraged speculation—requiring radically different playbooks in bull versus bear regimes.',
    overviewTaglish:
      'May malinaw na multi-year bull at bear cycles ang crypto na hinihila ng global liquidity, interest rates, at leverage—kailangan ng magkaibang estratehiya sa bawat market regime.',
    objectives: [
      'Identify structural traits of accumulation, bull markup, distribution, and bear markdown phases.',
      'Adapt playbook by regime: buy structural dips in confirmed bull trends; protect capital, hold stables, and shrink size in bear markets.',
      'Survive bear-market drawdowns (historically −70% to −85% in BTC and −90%+ in alts) without permanent capital ruin.',
    ],
    keyPoints: [
      'In bull markets, buying pullbacks to higher-timeframe demand works well; in bear markets, every dip often leads to a deeper low.',
      'Bear-market relief rallies ("dead-cat bounces") routinely surge +30%–50% before rolling over to fresh lows.',
      'Capital preservation during bear markets gives you dry powder for generational accumulation bottoms.',
    ],
    practicalExample:
      'After BTC breaks below its 200-day moving average and prints lower weekly highs, a trader cuts position size by 60%, stops holding speculative altcoins, and shifts focus to capital preservation.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.3'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'What is the #1 strategic priority for a crypto trader once higher-timeframe structure confirms a macro bear market?',
      options: [
        'Increase leverage to 20x to recover earlier losses quickly',
        'Preserve capital, reduce exposure to fragile altcoins, stay heavily in cash/stables, and tighten risk',
        'Buy every single −10% dip blindly with no stop-loss',
        'Stop keeping a trading journal until prices hit new highs',
      ],
      correctIndex: 1,
      rationale: 'Bear markets punish over-exposure and altcoin holding; protecting capital ensures you survive to compound in the next bull cycle.',
      commonTrap: 'Keeping bull-market "buy every dip" habits intact while the macro regime has shifted into a multi-month downtrend.',
    },
  },
  {
    id: 'topic-c3-5',
    code: 'C3.5',
    slug: 'crypto-c3-5-halving-events',
    title: 'Halving Events',
    overviewEn:
      'Every 210,000 blocks (~4 years), Bitcoin’s protocol cuts the new BTC block subsidy paid to miners by 50%—reducing new programmatic supply issuance and historically shaping multi-year market narratives.',
    overviewTaglish:
      'Tuwing 210,000 blocks (~4 na taon), hinahati sa dalawa ng Bitcoin protocol ang bagong BTC reward ng miners—binabawasan nito ang bagong supply at isa sa mga pangunahing tinitingnan sa 4-year cycle.',
    objectives: [
      'Trace Bitcoin’s halving progression (50 → 25 → 12.5 → 6.25 → 3.125 BTC per block).',
      'Explain why halving supply shocks work alongside—not instead of—global macro liquidity and ETF demand.',
      'Avoid expecting an instant green candle on halving day ("sell-the-news" volatility is common).',
    ],
    keyPoints: [
      'Each successive halving reduces absolute new supply by a smaller percentage of existing circulating BTC, moderating its standalone impact over time.',
      'Short-term pre-halving hype frequently leads to sideways chop or pullbacks right around the event date.',
      'Never bet blind leverage on calendar dates—confirm macro liquidity and price structure.',
    ],
    limitationsNote: 'Past 4-year halving patterns are based on a tiny historical sample size (4 cycles) and are never a guaranteed schedule.',
    practicalExample:
      'Instead of going all-in on the exact halving date, a trader treats halving as long-term supply backdrop while managing entries strictly off weekly market structure and risk limits.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.4'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'What actually happens on the Bitcoin network at a Halving event?',
      options: [
        'Half of everyone’s existing Bitcoin wallet balance is deleted',
        'The new BTC block reward paid to miners for each mined block is cut by 50%, reducing new supply issuance',
        'Bitcoin’s price automatically doubles on the exact block timestamp',
        'Transaction speeds become twice as slow',
      ],
      correctIndex: 1,
      rationale: 'Halving reduces newly minted supply per block (e.g., from 6.25 BTC to 3.125 BTC in 2024); existing holdings are completely untouched.',
      commonTrap: 'Assuming halving guarantees an immediate vertical pump on day one regardless of global interest rates or macro liquidity.',
    },
  },
  {
    id: 'topic-c3-6',
    code: 'C3.6',
    slug: 'crypto-c3-6-tokenomics',
    title: 'Tokenomics',
    overviewEn:
      'Tokenomics ("token economics") studies how a cryptocurrency’s supply schedule, emissions, fee burns, staking incentives, and utility drive long-term buying demand versus ongoing selling pressure.',
    overviewTaglish:
      'Ang tokenomics ay pag-aaral sa supply schedule, emissions, fee burns, at gamit ng isang token—para makita kung may totoong rason para tumaas ang demand o kung nilulunod lang ito ng bagong supply.',
    objectives: [
      'Evaluate supply-side mechanics: inflation rate, staking emissions, fee burning, and max cap.',
      'Evaluate demand-side mechanics: real protocol fee accrual, gas utility, or empty governance-only tokens.',
      'Distinguish sustainable protocol revenue from unsustainable "ponzinomics" paying 500% APY in freshly printed tokens.',
    ],
    keyPoints: [
      'High staking APY paid from newly minted tokens is inflation—not real yield—and constantly creates sell pressure.',
      'Strong tokenomics link real user fees or network demand to value capture without endless dilution.',
      'A popular project can still have a terrible token if the token has no economic link to the protocol’s revenue.',
    ],
    practicalExample:
      'A DeFi farm advertises 300% APY paid in its own inflationary reward token; farmers dump rewards daily, driving the token price down −90% despite high headline yield.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.5'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why do ultra-high staking rewards (e.g., 250% APY paid in newly printed tokens) frequently lead to a collapsing token price?',
      options: [
        'Because exchanges freeze high-APY tokens automatically',
        'Because newly printed reward tokens relentlessly inflate circulating supply and get sold into the market faster than new buyers arrive',
        'Because high APY turns the token into a stablecoin',
        'Because staking removes tokens from block explorers',
      ],
      correctIndex: 1,
      rationale: 'Inflationary emissions dilute holders unless real external demand grows faster than new token printing.',
      commonTrap: 'Chasing triple-digit APY farming yields while losing 80% on the underlying token’s market price.',
    },
  },
  {
    id: 'topic-c3-7',
    code: 'C3.7',
    slug: 'crypto-c3-7-token-supply-and-distribution',
    title: 'Token Supply and Distribution',
    overviewEn:
      'Token distribution examines who received initial tokens—team, venture capital (VC) investors, treasury, and community—revealing insider concentration and who stands ready to sell into retail rallies.',
    overviewTaglish:
      'Sinusuri ng token distribution kung sino ang may hawak ng malaking bahagi ng supply—team, VCs, treasury, o komunidad—para makita ang panganib ng insider dumping kapag bumili ang retail.',
    objectives: [
      'Inspect initial allocation pie charts and top-holder wallet concentration on block explorers.',
      'Recognize predatory "low float / high FDV" launches where insiders hold 70%–85% of future supply.',
      'Contrast fair-launch distributions with heavily VC-backed token structures.',
    ],
    keyPoints: [
      'When 5 non-exchange wallets hold 60% of a small-cap token, a single insider can crash price −70% instantaneously.',
      'Early VC investors often bought private rounds at 10x–50x lower prices than public exchange listings.',
      'Always verify whether top wallets are exchange cold wallets, staking contracts, or concentrated private insiders.',
    ],
    practicalExample:
      'A hyped token lists at $2.00 after private investors bought at $0.05 (40x profit); even if the token drops to $0.50, insiders are still up 10x and eager to sell every bounce.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.6'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What is a major risk when a newly listed altcoin allocates 65% of total supply to early private investors and insiders at tiny private-round prices?',
      options: [
        'The blockchain cannot process transactions',
        'Heavy structural overhang—insiders remain deeply in profit even after steep price drops and supply continuous selling pressure as locks expire',
        'The token automatically becomes a stablecoin',
        'Retail traders receive free bonus tokens',
      ],
      correctIndex: 1,
      rationale: 'Massive cost-basis disparity incentivizes early private holders to distribute tokens into retail buying liquidity.',
      commonTrap: 'Buying newly listed exchange hype launches on day one without checking insider allocation and private round valuations.',
    },
  },
  {
    id: 'topic-c3-8',
    code: 'C3.8',
    slug: 'crypto-c3-8-circulating-vs-total-supply',
    title: 'Circulating vs. Total Supply',
    overviewEn:
      'Circulating Supply counts tokens actively tradable today (determining Market Cap), whereas Total/Max Supply counts all tokens that will exist (determining Fully Diluted Valuation, FDV)—exposing hidden future dilution.',
    overviewTaglish:
      'Ang Circulating Supply ay ang tokens na umiikot na sa merkado ngayon (basehan ng Market Cap), habang ang Total/Max Supply ang basehan ng Fully Diluted Valuation (FDV) na nagpapakita ng paparating na dilution.',
    objectives: [
      'Compute Market Cap (Price × Circulating Supply) versus Fully Diluted Valuation (Price × Max/Total Supply).',
      'Calculate the Float Ratio (Circulating ÷ Total Supply) to spot low-float traps.',
      'Explain why a "$100M Market Cap" coin with only 10% circulating actually carries a massive $1B FDV.',
    ],
    keyPoints: [
      'Low float (<20% circulating) + high FDV means up to 80% of supply has yet to hit the open market.',
      'Comparing Market Cap alone hides huge upcoming dilution—always compare FDV across peers too.',
      'Tokens with >80% already circulating face far less surprise supply dilution over multi-month holds.',
    ],
    practicalExample:
      'Token A has $200M Market Cap with 90% circulating ($222M FDV). Token B has $200M Market Cap with 10% circulating ($2.0B FDV). Token B faces 9x supply expansion ahead.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.7'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'A token trades at $2.00 with 50 million tokens circulating and 500 million max supply. What are its Market Cap and Fully Diluted Valuation (FDV)?',
      options: [
        '$50M Market Cap and $500M FDV',
        '$100M Market Cap and $1.0 Billion FDV',
        '$1.0 Billion Market Cap and $100M FDV',
        '$200M Market Cap and $200M FDV',
      ],
      correctIndex: 1,
      rationale: 'Market Cap = $2 × 50M = $100M; FDV = $2 × 500M = $1.0B—meaning 90% of supply is still locked.',
      commonTrap: 'Calling a token a "low-cap gem" by looking only at its $50M Market Cap while overlooking a $2B FDV.',
    },
  },
  {
    id: 'topic-c3-9',
    code: 'C3.9',
    slug: 'crypto-c3-9-unlock-schedules',
    title: 'Unlock Schedules',
    overviewEn:
      'Token unlock schedules publish the exact dates and quantities when locked team, VC, and ecosystem tokens become transferable—serving as major scheduled supply catalysts on altcoin charts.',
    overviewTaglish:
      'Ipinapakita ng token unlock schedule kung kailan at gaano karaming nakakandadong tokens ng team at VCs ang magbubukas—madalas itong nagdudulot ng selling pressure o volatility sa altcoins.',
    objectives: [
      'Differentiate "cliff unlocks" (large one-time supply releases) from "linear unlocks" (steady daily/monthly streams).',
      'Measure unlock size as a percentage of Circulating Supply and average daily trading volume.',
      'Check unlock calendars (e.g., Tokenomist / CryptoRank) before entering any multi-week altcoin swing trade.',
    ],
    keyPoints: [
      'A cliff unlock exceeding 5%–15% of current circulating supply often creates heavy front-running sell pressure weeks beforehand.',
      'Not every unlock dumps on the exact day—sometimes VCs hedge via short perps early, causing a short squeeze right after the unlock.',
      'Treat major unlocks like corporate stock earnings or share offerings: know the date before risking capital.',
    ],
    practicalExample:
      'An altcoin with 100M circulating tokens has a 25M-token (+25% supply) VC cliff unlock in 10 days—swing traders step aside instead of buying right into looming supply.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.8'],
    estimatedMinutes: 8,
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'Which type of scheduled token unlock typically poses the sharpest sudden supply shock to an altcoin’s price?',
      options: [
        'A tiny 0.05% linear monthly community grant',
        'A large "cliff unlock" releasing 10%–25% of current circulating supply to early VC/team wallets at once',
        'Burning 5% of treasury tokens permanently',
        'A scheduled blockchain software maintenance patch',
      ],
      correctIndex: 1,
      rationale: 'A large cliff unlock dumps a huge wave of new sellable supply relative to existing float and daily liquidity.',
      commonTrap: 'Holding a swing long blindly into a massive 20% cliff unlock without checking the token unlock calendar.',
    },
  },
  {
    id: 'topic-c3-10',
    code: 'C3.10',
    slug: 'crypto-c3-10-crypto-market-sentiment',
    title: 'Crypto Market Sentiment',
    overviewEn:
      'Crypto market sentiment gauges crowd fear and greed using composite indicators (Fear & Greed Index, funding rates, social volume, and retail app rankings) to spot emotional extremes where risk-to-reward flips.',
    overviewTaglish:
      'Sinusukat ng crypto market sentiment ang takot at kasakiman ng merkado (Fear & Greed Index, funding, social hype) para matukoy ang mga emotional extremes kung saan nagbabago ang risk-to-reward.',
    objectives: [
      'Interpret extreme Greed (crowded longs, euphoric headlines) and extreme Fear (capitulation, apathy) as contrarian context.',
      'Understand why sentiment stays "Extreme Greed" for weeks during strong bull runs—never short solely on a sentiment score.',
      'Combine sentiment extremes with higher-timeframe structure and risk invalidation.',
    ],
    keyPoints: [
      'Sentiment is a thermometer for crowding, not a standalone timing button.',
      'Extreme Fear near major higher-timeframe support often produces high-asymmetry accumulation zones.',
      'Extreme Greed signals time to tighten trailing stops and book partials—not to add maximum leverage.',
    ],
    practicalExample:
      'During a parabolic rally, Fear & Greed hits 88 and funding spikes to +0.09%—instead of blindly shorting, a disciplined trader trims 50% of longs and stops chasing fresh breakouts.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.9'],
    estimatedMinutes: 8,
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'How should a disciplined crypto trader use an "Extreme Greed" reading (e.g., 85/100) on the Crypto Fear & Greed Index?',
      options: [
        'Immediately short with 20x leverage and no stop-loss',
        'Use it as crowding context to avoid FOMO chasing, scale partial profits, and tighten risk—waiting for structure confirmation before reversing',
        'Increase leverage because greed guarantees higher highs forever',
        'Ignore risk management completely',
      ],
      correctIndex: 1,
      rationale: 'Strong bull trends can stay in Extreme Greed for weeks; sentiment warns you to protect gains and avoid chasing, while structure handles timing.',
      commonTrap: 'Shorting every time Fear & Greed crosses 75 during a roaring bull market and getting repeatedly run over.',
    },
  },
  {
    id: 'topic-c3-11',
    code: 'C3.11',
    slug: 'crypto-c3-11-btc-altcoin-correlation',
    title: 'Correlation Between BTC and Altcoins',
    overviewEn:
      'Altcoins exhibit high positive correlation with Bitcoin—especially during sudden downside shocks when correlations jump toward 1.0—making BTC structure the non-negotiable weather check for every altcoin trade.',
    overviewTaglish:
      'Mataas ang correlation ng mga altcoins sa Bitcoin—lalo na kapag biglang bumagsak ang BTC kung saan sabay-sabay bumabagsak halos lahat ng alts—kaya laging tingnan muna ang BTC chart bago mag-trade ng altcoin.',
    objectives: [
      'Check Bitcoin’s 1H/4H/Daily structure and key liquidity levels BEFORE placing any altcoin entry.',
      'Spot genuine Relative Strength when an altcoin holds steady or makes higher lows while BTC dips.',
      'Prevent hidden portfolio over-exposure: holding 6 altcoin longs simultaneously equals one massive high-beta BTC bet.',
    ],
    keyPoints: [
      'When BTC drops −3% rapidly, mid-cap altcoins routinely drop −7% to −15% immediately.',
      'Altcoins showing strong relative strength during a BTC pullback are often the fastest runners once BTC bounces.',
      'Cap total combined altcoin risk because BTC flash wicks stop out correlated alt positions at the exact same second.',
    ],
    practicalExample:
      'BTC pulls back −4% to 4H support. Altcoin A drops −11% (weak), while Altcoin B dips only −1.5% and holds above prior breakout resistance (strong relative strength)—Altcoin B becomes the top long candidate once BTC stabilizes.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C3.10'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'You open 5 separate altcoin long positions, each risking 1% of your account. Why is your true effective risk often much closer to 5% on a single event?',
      options: [
        'Because exchanges combine all altcoins into one ticker',
        'Because altcoins correlate tightly with Bitcoin—a sudden −5% BTC drop can stop out all 5 altcoin longs simultaneously',
        'Because altcoins have negative correlation with BTC',
        'Because stop-losses do not execute on altcoins',
      ],
      correctIndex: 1,
      rationale: 'During crypto risk-off shocks, cross-altcoin correlations spike toward 1.0, turning multiple "separate" alt trades into one concentrated bet.',
      commonTrap: 'Entering a textbook altcoin breakout right as Bitcoin slams straight into major weekly resistance.',
    },
  },

  // =========================================================================
  // MODULE C4 — On-Chain and Derivatives Analysis (C4.1 – C4.11)
  // =========================================================================
  {
    id: 'topic-c4-1',
    code: 'C4.1',
    slug: 'crypto-c4-1-intro-on-chain-analysis',
    title: 'Introduction to On-Chain Analysis',
    overviewEn:
      'On-chain analysis extracts transparent behavioral data directly from public blockchain ledgers—wallet flows, holder profitability, and network usage—to add higher-timeframe context alongside technical price action.',
    overviewTaglish:
      'Kinukuha ng on-chain analysis ang direktang data mula sa pampublikong blockchain ledger—gaya ng wallet flows at network usage—bilang dagdag na konteksto kasama ng chart analysis.',
    objectives: [
      'Understand what on-chain data sees (native coin flows, UTXO age, smart-contract volume) versus what it misses (off-chain CEX order books).',
      'Use on-chain metrics for macro swing/cycle context rather than 5-minute intraday scalping.',
      'Combine on-chain metrics (e.g., MVRV, SOPR, exchange netflows) with technical structure and risk management.',
    ],
    keyPoints: [
      'Because most active spot and perp trading happens off-chain inside CEX databases, on-chain data is best for multi-week macro context.',
      'Wallet labeling can be imprecise—internal exchange cold-wallet shuffles often look scary if misread.',
      'Never override a clear chart stop-loss just because an on-chain metric looks bullish.',
    ],
    limitationsNote: 'On-chain indicators are probabilistic context tools, not exact intraday timing triggers.',
    practicalExample:
      'During a bear-market bottom, on-chain MVRV dips below 1.0 (average holder underwater) while weekly price forms a clean higher low—building multi-month accumulation confluence.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.12', 'C3.11'],
    estimatedMinutes: 9,
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'For which trading horizon is On-Chain Analysis generally MOST effective?',
      options: [
        '15-second scalping inside a centralized exchange order book',
        'Multi-week swing context and macro cycle positioning alongside price structure',
        'Predicting exact next-minute candlestick wicks',
        'Replacing stop-loss orders on 20x leveraged trades',
      ],
      correctIndex: 1,
      rationale: 'On-chain settlement flows evolve slowly relative to off-chain exchange matching engines, making them strongest for higher-timeframe conviction.',
      commonTrap: 'Panicking over a single whale alert tweet that turns out to be an internal exchange wallet reshuffle.',
    },
  },
  {
    id: 'topic-c4-2',
    code: 'C4.2',
    slug: 'crypto-c4-2-exchange-inflows-and-outflows',
    title: 'Exchange Inflows and Outflows',
    overviewEn:
      'Exchange netflows track net coins moving onto centralized exchanges (potential sell-side supply or derivatives collateral) versus moving off exchanges into cold wallets (potential longer-term holding).',
    overviewTaglish:
      'Sinusubaybayan ng exchange netflows ang pagpasok ng coins sa exchanges (posibleng ibebenta o gagawing collateral) kumpara sa paglabas nito papuntang cold wallets (pangmatagalang pag-iipon).',
    objectives: [
      'Interpret sustained BTC/ETH outflows alongside rising stablecoin inflows as constructive accumulation context.',
      'Interpret large sudden coin inflows onto spot exchanges as elevated potential sell-pressure warning.',
      'Distinguish real user inflows from routine internal exchange cold-to-hot wallet maintenance.',
    ],
    keyPoints: [
      'Stablecoin inflows to exchanges represent dry powder preparing to buy; coin inflows can signal readiness to sell OR post collateral.',
      'Persistent multi-week exchange reserve declines shrink immediately available spot sell liquidity.',
      'Always verify whether an alert comes from a verified analytics provider filtering internal exchange wallets.',
    ],
    practicalExample:
      'Over 30 days, exchange BTC reserves drop by 45,000 BTC while stablecoin exchange reserves climb +$3B—supporting bullish breakout continuation once daily resistance breaks.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.1'],
    estimatedMinutes: 8,
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'What does a sustained surge in STABLECOIN (USDT/USDC) inflows onto major spot exchanges typically signify?',
      options: [
        'Guaranteed immediate crash of all cryptocurrencies',
        'Fresh dollar-denominated buying power ("dry powder") positioning onto exchanges',
        'Exchanges permanently shutting down withdrawals',
        'Stablecoins losing their blockchain compatibility',
      ],
      correctIndex: 1,
      rationale: 'Traders move stablecoins onto exchanges primarily to deploy capital into spot purchases or margin collateral.',
      commonTrap: 'Automatically shorting every large BTC inflow tweet without checking if it was an internal exchange custody transfer or ETF settlement.',
    },
  },
  {
    id: 'topic-c4-3',
    code: 'C4.3',
    slug: 'crypto-c4-3-whale-activity',
    title: 'Whale Activity',
    overviewEn:
      'Whale tracking monitors very large wallets (e.g., 1,000+ BTC or top token holders) accumulating during fear, distributing into retail euphoria, or moving large OTC blocks.',
    overviewTaglish:
      'Sinusubaybayan ng whale activity ang galaw ng malalaking wallets na nag-iipon sa panahon ng takot o nagbebenta kapag sobrang euphoric na ang retail.',
    objectives: [
      'Distinguish cohort accumulation trends (1,000+ BTC wallet balance trends) from noisy single-wallet alerts.',
      'Understand why large institutions prefer Over-the-Counter (OTC) desks to avoid moving public order books.',
      'Avoid blindly copy-trading single "smart money" wallets that may be hedging via off-chain CEX shorts.',
    ],
    keyPoints: [
      'A whale buying $5M on-chain on a DEX might simultaneously be short $5M on a centralized exchange as a delta-neutral hedge!',
      'Aggregate cohort behavior (are large holders net adding over 30 days?) is far more reliable than tracking one wallet.',
      'Whales can also be wrong or get liquidated—never copy any wallet blindly without independent risk sizing.',
    ],
    limitationsNote: 'Public wallet trackers cannot see a whale’s offsetting off-chain CEX futures hedges.',
    practicalExample:
      'Retail traders blindly copy a famous wallet buying a mid-cap token on-chain, unaware the wallet is simultaneously shorting the same token on a CEX to farm funding yield.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.2'],
    estimatedMinutes: 8,
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'Why is blindly copying a single large on-chain "whale wallet" buying a token on a DEX a risky habit?',
      options: [
        'Because DEX transactions are never recorded on block explorers',
        'Because the whale could be market-making, hedging an off-chain CEX short, or using retail copy-traders as exit liquidity',
        'Because whales are banned from selling tokens for 1 year',
        'Because copy-trading automatically disables exchange fees',
      ],
      correctIndex: 1,
      rationale: 'On-chain visibility shows only one leg of a sophisticated trader’s full portfolio; aggregate trends plus chart structure are far safer.',
      commonTrap: 'Treating a single Telegram whale-alert notification as a blind market-buy signal.',
    },
  },
  {
    id: 'topic-c4-4',
    code: 'C4.4',
    slug: 'crypto-c4-4-active-addresses',
    title: 'Active Addresses',
    overviewEn:
      'Active addresses count distinct blockchain addresses sending or receiving transactions over a given window (daily/weekly), serving as a baseline gauge of real user adoption versus speculative hype.',
    overviewTaglish:
      'Binibilang ng active addresses ang mga natatanging wallet addresses na gumagawa ng transaksyon sa network—gabay ito kung totoong lumalawak ang paggamit o puro hype lang.',
    objectives: [
      'Compare 30-day moving averages of active addresses against price trends to spot organic growth or divergence.',
      'Recognize distortion sources: airdrop farmers spinning up thousands of Sybil wallets and automated spam bots.',
      'Combine active addresses with fee revenue to distinguish genuine economic usage from empty bot traffic.',
    ],
    keyPoints: [
      'Rising price backed by expanding active users and real fees is healthier than price rising on ghost-chain volume.',
      'One person can control 100 addresses, so active addresses approximate—not strictly equal—unique human users.',
      'Check if a sudden spike coincides with an incentivized airdrop campaign that disappears the next month.',
    ],
    practicalExample:
      'A new Layer-2 boasts 500,000 daily active addresses before its token airdrop; one week after rewards distribute, active addresses plunge −80%, exposing temporary farming activity.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.3'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'What commonly creates misleading spikes in "Daily Active Addresses" on newer smart-contract blockchains?',
      options: [
        'Bitcoin halving events',
        'Short-term airdrop farming ("Sybil" bots) generating thousands of tiny wallets that vanish once incentives end',
        'Hardware wallet firmware updates',
        'Exchange maintenance windows',
      ],
      correctIndex: 1,
      rationale: 'Low-fee chains make it cheap for automated scripts to farm airdrops across thousands of disposable addresses.',
      commonTrap: 'Assuming high raw address counts automatically mean sticky organic demand without checking real fee revenue and retention.',
    },
  },
  {
    id: 'topic-c4-5',
    code: 'C4.5',
    slug: 'crypto-c4-5-network-activity',
    title: 'Network Activity',
    overviewEn:
      'Network activity evaluates holistic blockchain health through real transaction fees paid, Total Value Locked (TVL), DEX volume, stablecoin supply on-chain, and validator/hashrate security.',
    overviewTaglish:
      'Sinusuri ng network activity ang tunay na sigla ng isang blockchain gamit ang totoong fees na binabayaran ng users, Total Value Locked (TVL), DEX volume, at stablecoin supply sa network.',
    objectives: [
      'Evaluate Protocol Fees and Real Economic Value (what users actually pay to use the chain) alongside TVL.',
      'Spot "circular TVL" where double-counted re-staking or native token price appreciation inflates USD TVL.',
      'Track stablecoin supply growth on a chain as concrete proof of fresh capital inflow.',
    ],
    keyPoints: [
      'If a chain’s native coin doubles in USD, its USD TVL doubles automatically even if zero new tokens were deposited—always check TVL in native token terms too.',
      'Growing native stablecoin supply + rising organic fees signal real ecosystem traction.',
      'Hashrate (PoW) and staked ratio (PoS) measure underlying network security commitment.',
    ],
    practicalExample:
      'Before trading a Layer-1 ecosystem breakout, a trader verifies that on-chain USDC/USDT supply and weekly DEX volume on that chain have both expanded steadily for 6 consecutive weeks.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.4'],
    estimatedMinutes: 8,
    diagramKind: 'chart_fundamentals',
    quiz: {
      prompt: 'Why should you check Total Value Locked (TVL) denominated in native coins (e.g., ETH or SOL) alongside USD TVL?',
      options: [
        'Because USD TVL is illegal to publish',
        'Because rising coin prices inflate USD TVL automatically even if no new capital actually entered the protocols',
        'Because native-coin TVL always rises every week',
        'Because TVL measures Bitcoin mining difficulty',
      ],
      correctIndex: 1,
      rationale: 'Measuring TVL in native tokens strips out price appreciation to reveal whether users are truly depositing more assets.',
      commonTrap: 'Equating subsidized mercenary TVL with sustainable protocol adoption.',
    },
  },
  {
    id: 'topic-c4-6',
    code: 'C4.6',
    slug: 'crypto-c4-6-funding-rate-analysis',
    title: 'Funding Rate Analysis',
    overviewEn:
      'Funding rate analysis reads aggregate OI-weighted perpetual funding across major exchanges to diagnose crowded positioning, squeeze fuel, and healthier post-flush resets.',
    overviewTaglish:
      'Ginagamit ng funding rate analysis ang pinagsamang funding sa malalaking exchanges para makita kung sobrang siksikan na ang leveraged longs o shorts at kung malapit na ang squeeze o reset.',
    objectives: [
      'Use OI-Weighted Funding Rate across exchanges rather than relying on one minor exchange.',
      'Identify healthy bull trends (price rising with calm/neutral +0.01% funding—spot-led!) versus fragile rallies (extreme +0.08%+ funding).',
      'Spot bullish contrarian setups when price holds support while funding turns deeply negative (trapped late shorts).',
    ],
    keyPoints: [
      'Spot-driven rallies with neutral or slightly negative funding are the cleanest, most durable trends.',
      'Extreme positive funding warns of long-liquidation flush risk, NOT an automatic blind short without structure break.',
      'Deeply negative funding after a support sweep provides rocket fuel for a short squeeze.',
    ],
    practicalExample:
      'BTC sweeps weekly range lows, reclaims support, and OI-weighted funding flips negative (−0.02%) as retail shorts pile in late—fueling a sharp short squeeze back to range highs.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.5'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'Which funding-rate backdrop signals the HEALTHIEST, most sustainable crypto uptrend?',
      options: [
        'Price stalling at resistance while funding explodes to +0.15% every 8 hours',
        'Price trending steadily higher on strong spot demand while perpetual funding remains calm near baseline (~0.01% or slightly negative)',
        'Funding remaining stuck at +0.20% for two straight weeks',
        'Open interest tripling while spot volume drops to zero',
      ],
      correctIndex: 1,
      rationale: 'Calm or slightly negative funding during an uptrend proves spot buyers are leading and over-leveraged longs have not yet crowded the boat.',
      commonTrap: 'Shorting immediately just because funding turned +0.04% during a fresh breakout—strong trends can stay elevated before flushing.',
    },
  },
  {
    id: 'topic-c4-7',
    code: 'C4.7',
    slug: 'crypto-c4-7-open-interest-analysis',
    title: 'Open Interest Analysis',
    overviewEn:
      'Open Interest analysis combines OI changes with price direction and funding to decode whether moves are driven by aggressive new leverage, short covering, or healthy capitulation flushes.',
    overviewTaglish:
      'Pinagsasama ng Open Interest analysis ang galaw ng OI, presyo, at funding para malaman kung bagong leverage, short covering, o leverage flush ang nagpapagalaw sa chart.',
    objectives: [
      'Apply the 4-state Price × OI matrix (Up/Up, Up/Down, Down/Up, Down/Down) accurately.',
      'Identify high-probability "OI Flush" resets where a sharp wick wipes out 10%–20% of Open Interest cleanly.',
      'Spot overcrowded ranges where OI climbs rapidly inside a tight box before violent expansion.',
    ],
    keyPoints: [
      'Price Down + OI Up + Negative Funding = aggressive new shorts piling in (squeeze risk if support holds).',
      'Price Down + OI Down sharply = long liquidations flushing out weak leverage (potential cleaner reset).',
      'Always evaluate OI changes alongside Spot CVD (Cumulative Volume Delta) to verify who is driving price.',
    ],
    practicalExample:
      'During an uptrend pullback, BTC drops −4% in 15 minutes while Open Interest drops −$1.8B and funding resets to 0.005%—clearing excess leverage and setting up a clean higher-low bounce.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.6'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'During an uptrend pullback, price wicks down into 4H demand while Open Interest plunges sharply and elevated positive funding resets back to neutral. What just occurred?',
      options: [
        'A permanent blockchain failure',
        'A healthy leverage flush that cleared out over-leveraged late longs without breaking higher-timeframe demand',
        'Aggressive new short sellers doubling Open Interest',
        'Exchange fees dropping to zero',
      ],
      correctIndex: 1,
      rationale: 'Sharp OI contraction + funding reset at key support clears crowded long leverage, often creating a cleaner foundation for continuation.',
      commonTrap: 'Treating rising Open Interest automatically as "bullish"—rising OI during a breakdown means aggressive shorts are pressing price down.',
    },
  },
  {
    id: 'topic-c4-8',
    code: 'C4.8',
    slug: 'crypto-c4-8-long-short-ratio',
    title: 'Long/Short Ratio',
    overviewEn:
      'The Long/Short Ratio compares the proportion of net-long versus net-short accounts (or top-trader positions) on an exchange—useful mainly for reading retail account crowding as contrarian context.',
    overviewTaglish:
      'Inihahambing ng Long/Short Ratio ang dami ng accounts na naka-long laban sa naka-short—madalas itong ginagamit bilang contrarian clue kapag sobrang daming retail accounts ang nakapwesto sa iisang panig.',
    objectives: [
      'Distinguish Global Account Long/Short Ratio (counts each account equally, skewed toward small retail) from Top Trader Position Ratio (weighted by position size).',
      'Recognize why every perpetual contract has equal total long and short dollar value—the ratio reflects account distribution, not unmatched contracts.',
      'Use extreme retail crowding (>75% retail accounts long in a downtrend) as caution against catching falling knives.',
    ],
    keyPoints: [
      'In derivatives, every $1 long is matched by $1 short; when 78% of accounts are long, it means many small retail accounts are long against fewer, larger whale/institutional shorts.',
      'Retail accounts routinely get stubbornly long during downtrends ("buying the dip" all the way down) and short too early in bull breakouts.',
      'Never trade Long/Short Ratio in isolation—pair with structure, funding, and OI.',
    ],
    practicalExample:
      'During a steady downtrend, 79% of retail accounts remain long trying to call the bottom while Top Trader Position Ratio leans short—warning disciplined traders not to catch the knife.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.7'],
    estimatedMinutes: 8,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'If every futures contract requires both a buyer and a seller, what does a "75% Long / 25% Short" Account Ratio actually mean?',
      options: [
        'There are 3x more dollars long than short on the exchange',
        'Many smaller accounts are crowded on the long side, while fewer larger accounts hold the opposing short side',
        'The exchange printed extra long contracts without counterparties',
        'Price is guaranteed to go up by 75%',
      ],
      correctIndex: 1,
      rationale: 'Account ratios count trader accounts equally; heavy skew means small retail accounts are concentrated on one side opposite larger players.',
      commonTrap: 'Assuming "80% of accounts are long" means bullish strength when it frequently signals crowded retail longs trapped in a drop.',
    },
  },
  {
    id: 'topic-c4-9',
    code: 'C4.9',
    slug: 'crypto-c4-9-liquidation-heatmaps',
    title: 'Liquidation Heatmaps',
    overviewEn:
      'Liquidation heatmaps estimate price clusters where leveraged long and short positions are likely to be forcibly liquidated—highlighting liquidity magnets that price often sweeps before reversing or expanding.',
    overviewTaglish:
      'Tinatantya ng liquidation heatmaps ang mga presyong maraming naka-abang na leveraged liquidation—madalas itong nagsisilbing liquidity magnet na hinuhuli muna ng presyo bago umikot.',
    objectives: [
      'Understand that liquidation heatmaps are modeled estimates based on Open Interest, price history, and common leverage tiers (10x, 25x, 50x)—not private exchange databases.',
      'Align liquidation clusters with technical Swing Highs, Equal Highs/Lows, and Range Boundaries.',
      'Wait for the sweep AND reclaim confirmation instead of placing blind limit orders inside a liquidation cascade.',
    ],
    keyPoints: [
      'Liquidation cascades generate forced market orders, creating deep liquidity for large players to fill opposite positions.',
      'Heatmaps are approximations—never assume price must stop at an exact pixel on a heatmap.',
      'If a cluster gets swept AND price fails to reclaim, momentum can keep cascading into the next deeper cluster.',
    ],
    limitationsNote: 'Liquidation maps are probabilistic models—use them as liquidity confluence alongside market structure, never blind reversal calls.',
    practicalExample:
      'A dense short-liquidation cluster sits just above equal highs at $68,200. Price spikes to $68,450, clears forced short buy-backs, then prints a sharp bearish engulfing close back below $68,100.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.8'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'How should a disciplined crypto trader use a Liquidation Heatmap responsibly?',
      options: [
        'Place blind high-leverage limit orders right inside a cluster without a stop-loss',
        'Combine liquidation clusters with structural highs/lows to anticipate liquidity sweeps, then wait for confirmation/reclaim before entering',
        'Treat heatmap colors as exact private exchange data that never fails',
        'Ignore higher-timeframe trend direction completely',
      ],
      correctIndex: 1,
      rationale: 'Clusters show where forced orders likely rest, but strong trends can blow straight through multiple clusters—always wait for structural confirmation.',
      commonTrap: 'Fading a strong breakout purely because a liquidation cluster above price got hit, getting run over by spot-driven continuation.',
    },
  },
  {
    id: 'topic-c4-10',
    code: 'C4.10',
    slug: 'crypto-c4-10-spot-vs-futures-volume',
    title: 'Spot vs. Futures Volume',
    overviewEn:
      'Comparing Spot volume/CVD against Perpetual Futures volume/CVD shows whether real cash buyers are driving a move (durable) or speculative leverage alone is pushing price (fragile and prone to sharp retrace).',
    overviewTaglish:
      'Ipinapakita ng paghahambing ng Spot volume laban sa Futures volume kung totoong cash buyers ang humihila ng presyo (mas matibay) o puro leveraged perp speculators lang (madaling bumalik).',
    objectives: [
      'Identify spot-led rallies (Spot CVD rising, Coinbase/spot premium positive, calm funding) versus perp-led pumps.',
      'Read the Coinbase Premium Index as an indicator of US institutional/spot BTC demand.',
      'Be extra cautious chasing breakouts where perp volume surges while spot volume stays flat or sells into strength.',
    ],
    keyPoints: [
      'Spot-led demand absorbs supply permanently; perp-led demand must eventually close or get liquidated.',
      'Spot premium (Spot price > Perp price) during dips often shows real cash buyers absorbing leveraged panic selling.',
      'Perp-only pumps during quiet weekend hours frequently retrace 100% by Monday US open.',
    ],
    practicalExample:
      'BTC breaks $70,000 on Sunday with surging perp volume and high positive funding while spot CVD slopes downward—by Monday NY open, the perp pump fully retraces back to $67,800.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.9'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'Why is a Spot-led crypto rally generally more durable than a rally driven purely by Perpetual Futures leverage?',
      options: [
        'Because spot traders cannot sell for 30 days',
        'Because spot purchases commit real unleveraged cash with no liquidation or funding pressure, whereas perp-only pumps unwind violently once leverage stalls',
        'Because perpetual futures have no order books',
        'Because spot volume is always 10x larger than futures volume',
      ],
      correctIndex: 1,
      rationale: 'Real cash accumulation removes circulating supply without forced liquidation triggers, creating sturdier structural support.',
      commonTrap: 'Chasing thin weekend perpetual breakouts with zero spot participation.',
    },
  },
  {
    id: 'topic-c4-11',
    code: 'C4.11',
    slug: 'crypto-c4-11-order-book-and-market-depth',
    title: 'Order Book and Market Depth',
    overviewEn:
      'Order book depth charts display resting buy limit bids and sell limit asks across price levels—helping traders assess slippage, genuine liquidity walls, and deceptive spoofing orders.',
    overviewTaglish:
      'Ipinapakita ng order book at market depth ang nakapilang limit buy bids at sell asks sa bawat presyo—tulong ito sa pagtantya ng slippage, liquidity walls, at pag-iwas sa pekeng spoofing walls.',
    objectives: [
      'Read Depth-of-Market (DOM) liquidity at ±1% and ±2% from mid-price to measure execution quality.',
      'Recognize spoofing (large limit walls placed to bait retail and pulled right before price touches them) versus genuine absorption.',
      'Verify liquidity depth on small-cap altcoins before placing sizable market stop-losses.',
    ],
    keyPoints: [
      'Resting limit orders are intentions—not completed trades—and can vanish in milliseconds before execution.',
      'Genuine absorption shows large market sells repeatedly hitting a bid level without price breaking lower.',
      'Thin ±2% order-book depth on small altcoins warns of massive stop-loss slippage during fast moves.',
    ],
    practicalExample:
      'A $10M bid wall appears $200 below BTC price on one exchange; as price approaches within $30, the wall vanishes instantly (spoofing) and price slices straight through.',
    level: 3,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C4.10'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'liquidity_pools',
    quiz: {
      prompt: 'What is "spoofing" on a cryptocurrency order book?',
      options: [
        'Withdrawing coins to a cold hardware wallet',
        'Placing large visible limit buy or sell walls to influence trader sentiment and cancelling them right before they get filled',
        'Paying Maker fees on a Post-Only limit order',
        'Matching spot orders across two blockchains',
      ],
      correctIndex: 1,
      rationale: 'Resting orders are cancellable at any millisecond; traders should look for actual executed absorption rather than blindly trusting flashing order-book walls.',
      commonTrap: 'Placing tight trades purely in front of a giant order-book wall that disappears the moment price gets close.',
    },
  },

  // =========================================================================
  // MODULE C5 — Advanced Crypto Trading (C5.1 – C5.10)
  // Requires C2.7 (Liquidation), C2.12 (Fees), C4.11 (Depth) FIRST!
  // =========================================================================
  {
    id: 'topic-c5-1',
    code: 'C5.1',
    slug: 'crypto-c5-1-btc-as-market-leader',
    title: 'BTC as a Market Leader',
    overviewEn:
      'Bitcoin sets the directional tempo, liquidity regime, and volatility ceiling for the entire crypto market—making a daily top-down BTC roadmap the mandatory starting point before touching any altcoin.',
    overviewTaglish:
      'Ang Bitcoin ang nagtatakda ng pangkalahatang direksyon at liquidity regime ng buong crypto market—kaya mandatory ang BTC roadmap check bago pumasok sa kahit anong altcoin.',
    objectives: [
      'Build a 3-minute daily BTC bias map: Daily/4H trend, major liquidity highs/lows, BTC.D, and US session macro calendar.',
      'Classify BTC state into Trend Up, Range High, Range Low, or Trend Down—and match altcoin aggression accordingly.',
      'Stand down on altcoin breakouts whenever BTC sits directly at major resistance or ahead of FOMC/CPI volatility.',
    ],
    keyPoints: [
      'When BTC trends violently (up OR down), it sucks liquidity out of altcoins temporarily; altcoins thrive best when BTC trends calmly or ranges near highs.',
      'A clean BTC liquidity sweep at 4H support often marks the exact turning point for strong altcoins simultaneously.',
      'Even pure altcoin specialists keep BTC/USDT open on their primary monitor at all times.',
    ],
    practicalExample:
      'A trader spots a clean SOL breakout setup, glances at BTC, notices BTC is hitting heavy weekly resistance with elevated funding, and waits—saving a full −1R stop-out when BTC rejects −3%.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C2.7', 'C2.12', 'C4.11'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'multi_timeframe',
    quiz: {
      prompt: 'Which Bitcoin market condition typically provides the CLEANEST environment for swing trading altcoin longs?',
      options: [
        'BTC crashing −8% in two hours while BTC.D spikes',
        'BTC trending steadily higher or consolidating calmly above support while BTC.D trends sideways to lower',
        'BTC slicing below its 200-day moving average on heavy spot selling',
        'Five minutes before a surprise emergency central bank decision',
      ],
      correctIndex: 1,
      rationale: 'Calm bullish BTC structure encourages risk-on capital to rotate smoothly into leading altcoins without sudden correlation dumps.',
      commonTrap: 'Scanning 50 altcoin charts without once checking where Bitcoin sits relative to key daily levels.',
    },
  },
  {
    id: 'topic-c5-2',
    code: 'C5.2',
    slug: 'crypto-c5-2-altcoin-trading-strategies',
    title: 'Altcoin Trading Strategies',
    overviewEn:
      'Altcoin trading focuses on liquid narrative leaders displaying clear relative strength versus BTC—entering structured pullbacks or range breakouts, taking aggressive partial profits, and never marrying bags.',
    overviewTaglish:
      'Sa altcoin trading, piliin lang ang liquid narrative leaders na may malakas na relative strength laban sa BTC—pumasok sa malinis na pullback o breakout, mag-take profit nang paunti-unti, at huwag main-love sa token.',
    objectives: [
      'Filter tradable altcoins: high daily volume, tight spreads, strong ALT/BTC ratio, and clean unlock calendar.',
      'Trade leaders rather than laggards: strongest coins during a BTC dip usually lead the rebound.',
      'Scale profits systematically (e.g., 50% at 2R, trail remainder) because altcoin pumps retrace brutally fast.',
    ],
    keyPoints: [
      'Focus on 3–6 leading liquid altcoins rather than chasing 40 random low-cap coins on social media.',
      'Use Spot or very low leverage (1x–2x max) on volatile altcoins whose normal daily ATR is 8%–15%.',
      'Always honor stop-losses—altcoins regularly drop −60% to −90% when a narrative cools.',
    ],
    limitationsNote: 'Altcoins carry severe tail risk and slippage; never allocate core life savings to speculative altcoin trades.',
    practicalExample:
      'During a BTC −4% dip, a top Layer-1 altcoin dips only −1.5% and holds 4H demand while its ALT/BTC pair prints higher lows. Once BTC bounces, the leader rallies +22% in three days.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.1'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'When selecting altcoins to long after a healthy Bitcoin pullback, which characteristic points to the highest-quality candidate?',
      options: [
        'The altcoin that crashed the hardest (−35%) and is making new yearly lows',
        'A high-liquidity narrative leader that held higher lows during the BTC dip and shows a strong rising ALT/BTC pair',
        'An illiquid micro-cap with a 30% VC token unlock tomorrow',
        'A random ticker trending only in paid Telegram groups',
      ],
      correctIndex: 1,
      rationale: 'Relative strength during market weakness reveals where institutional and large-trader demand is actively absorbing supply.',
      commonTrap: 'Buying "laggard" weak altcoins expecting them to magically catch up while real capital stays concentrated in leaders.',
    },
  },
  {
    id: 'topic-c5-3',
    code: 'C5.3',
    slug: 'crypto-c5-3-spot-vs-futures-strategy',
    title: 'Spot vs. Futures Strategy',
    overviewEn:
      'Matching the right instrument to the right trade horizon saves huge amounts of money: Spot excels for multi-week swing holds and accumulation without funding bleed, while Futures/Perps fit tactical short-term trades, shorting, and portfolio hedging.',
    overviewTaglish:
      'Malaki ang matitipid kapag tugma ang instrument sa plano: Spot ang ideal sa multi-week swing at accumulation (walang funding fee at liquidation), habang Futures/Perps ay para sa short-term tactical trades, shorting, o hedging.',
    objectives: [
      'Choose Spot over Perps whenever holding longs across multiple weeks or high-funding bull markets.',
      'Reserve Perpetual Futures for tactical intraday/short-swing setups, defined-risk shorts, or hedging spot inventory.',
      'Calculate holding cost comparison (Spot = 0 funding vs. Perps = 3 funding intervals per day).',
    ],
    keyPoints: [
      'You do NOT need futures to make strong returns in crypto—spot altcoins already move 10%–30% weekly without leverage.',
      'During high positive funding (+0.05%+ per 8h), perp longs bleed 4%–6% per month just to sit open.',
      'Keep separate wallets or sub-accounts for Long-Term Spot Investing versus Active Trading so you never panic-sell long-term holdings to cover margin.',
    ],
    practicalExample:
      'A swing trader holds core BTC and ETH bullish swings on Spot (zero funding, zero liquidation) and uses a small isolated Perp sub-account strictly for tactical 2-day setups or hedges.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.2'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-spot-perps-orderbook',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'When you want to hold a bullish Bitcoin or altcoin position for 4 to 8 weeks during a bull market with elevated positive funding, which instrument is usually superior?',
      options: [
        '25x Cross-Margin Perpetual Futures',
        '1x Spot holding (zero ongoing funding drain and zero forced liquidation risk)',
        '100x isolated weekly futures',
        'Borrowing high-interest credit card cash for margin',
      ],
      correctIndex: 1,
      rationale: 'Spot eliminates compounding 8-hour funding drag and sudden wick liquidations over multi-week swings.',
      commonTrap: 'Using leveraged perpetuals for multi-week bullish holds and watching funding fees + one flash wick erase a winning thesis.',
    },
  },
  {
    id: 'topic-c5-4',
    code: 'C5.4',
    slug: 'crypto-c5-4-trend-following',
    title: 'Trend Following',
    overviewEn:
      'Crypto exhibits some of the strongest momentum trends of any global asset class—trend-following frameworks align with higher-timeframe structure (Daily/4H), enter clean pullbacks or breakouts, and trail stops to capture fat-tail runs.',
    overviewTaglish:
      'Isa ang crypto sa pinakamalakas mag-trend sa lahat ng merkado—sumasabay ang trend following sa Daily/4H structure, pumapasok sa malinis na pullback o breakout, at gumagamit ng trailing stop para makuha ang malaking galaw.',
    objectives: [
      'Define trend objectively using Higher Highs/Higher Lows and dynamic trend filters (e.g., 20/50 EMA or 200 SMA).',
      'Accept lower win rates during choppy sideways transitions in exchange for large asymmetric 3R–6R trend winners.',
      'Trail stops behind confirmed 4H/Daily swing lows rather than capping winners prematurely out of fear.',
    ],
    keyPoints: [
      'Crypto trends tend to overshoot further than traditional markets—cutting winners too early destroys trend-following expectancy.',
      'Inchoppy multi-week ranges, reduce trade frequency instead of getting chopped repeatedly by trend signals.',
      'Never fight an established high-timeframe crypto trend by trying to call exact tops.',
    ],
    limitationsNote: 'Trend following always incurs clusters of small losses during sideways consolidations; strict risk sizing keeps drawdowns survivable.',
    practicalExample:
      'BTC breaks above its 50-day EMA with rising spot volume. Entering the first 4H higher-low pullback with 1% risk and trailing beneath each new Daily swing low captures a +4.5R multi-week leg.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.3'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'market_structure',
    quiz: {
      prompt: 'What is the core mathematical strength of a disciplined trend-following system in crypto?',
      options: [
        'A guaranteed 95% win rate on every single trade',
        'Accepting small controlled losses in sideways chop so occasional large 3R–6R directional trends drive strong net expectancy',
        'Never needing to use stop-losses',
        'Doubling position size after every losing trade',
      ],
      correctIndex: 1,
      rationale: 'Trend systems rely on positive payoff asymmetry (big winners, small capped losers) rather than ultra-high win rate.',
      commonTrap: 'Taking profit hastily at +0.8R out of anxiety while still taking full −1R stops, destroying system expectancy.',
    },
  },
  {
    id: 'topic-c5-5',
    code: 'C5.5',
    slug: 'crypto-c5-5-range-trading',
    title: 'Range Trading',
    overviewEn:
      'Because crypto spends a large share of time consolidating horizontally between major moves, range trading buys confirmed sweeps/reclaims at Range Low and trims or shorts confirmed rejections at Range High—avoiding the noisy midpoint.',
    overviewTaglish:
      'Dahil madalas mag-sideways ang crypto bago ang malalaking galaw, nakatuon ang range trading sa malinaw na Range Low at Range High deviations/reclaims—at iniiwasan ang magulong gitna (EQ).',
    objectives: [
      'Map clear horizontal Range High, Range Low, and Equilibrium (50% midpoint) on 4H/Daily charts.',
      'Trade deviations (sweep outside range followed by decisive close back inside) with stops just beyond the sweep extreme.',
      'Exit cleanly if price accepts and consolidates outside the range (signaling true breakout transition).',
    ],
    keyPoints: [
      'Mid-range (equilibrium) offers the worst 1:1 coin-flip risk-to-reward—patience at the edges is the edge.',
      'Take primary targets at equilibrium (50%) and opposite range boundary.',
      'Never keep fading a range edge after strong volume acceptance breaks outside—switch mindset to breakout/trend.',
    ],
    practicalExample:
      'ETH ranges between $3,100 and $3,500 for three weeks. Price wicks below $3,100 to $3,040, sweeps stops, and closes a 4H candle back at $3,140—offering a defined-risk long targeting $3,300 (EQ) and $3,480.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.4'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'equal_highs_lows',
    quiz: {
      prompt: 'Where is the WORST risk-to-reward area to open a new trade inside a well-defined horizontal crypto range?',
      options: [
        'Right after a confirmed sweep and reclaim of Range Low',
        'Right in the dead center (50% equilibrium midpoint) with unclear direction and wide stops to either edge',
        'Right after a confirmed deviation and rejection back below Range High',
        'At a confluence of Range Low and higher-timeframe demand',
      ],
      correctIndex: 1,
      rationale: 'Entering at the midpoint forces wide stops with poor reward to either boundary and exposes you to random chop.',
      commonTrap: 'Stubbornly shorting Range High a fourth time even after price breaks out and holds firmly above it on surging spot volume.',
    },
  },
  {
    id: 'topic-c5-6',
    code: 'C5.6',
    slug: 'crypto-c5-6-liquidity-hunting',
    title: 'Liquidity Hunting',
    overviewEn:
      'In crypto’s 24/7 derivatives-heavy markets, price routinely spikes through obvious equal highs, equal lows, and weekend extremes to trigger clustered stops and liquidations before reversing—a framework best traded AFTER confirmation, never guessed blindly.',
    overviewTaglish:
      'Sa 24/7 crypto markets, madalas munang tamaan ng presyo ang halatang equal highs/lows at stop clusters bago bumalik—ang tamang pag-trade nito ay paghihintay ng sweep AT malinaw na reclaim confirmation.',
    objectives: [
      'Identify high-density liquidity zones: Previous Day/Week Highs & Lows, Equal Highs/Lows, and liquidation clusters.',
      'Require two-step confirmation: (1) sweep beyond the level + (2) strong candle close back inside + lower-timeframe structure shift.',
      'Recognize when a move is a genuine high-volume expansion breakout rather than a sweep—respect your stop immediately.',
    ],
    keyPoints: [
      'Liquidity hunting is an analytical framework describing order-flow dynamics—not a guaranteed conspiracy or 100% reversal pattern.',
      'Session transitions (especially NY stock-market open 9:30 AM ET / 9:30 PM PHT DST) frequently trigger crypto stop runs.',
      'If price sweeps a high and stays accepted above it with rising spot volume, do NOT fade it.',
    ],
    limitationsNote: 'Sweeps are analytical frameworks—in strong trends, price sweeps highs and keeps accelerating without reversing.',
    practicalExample:
      'At the NY open, BTC spikes $300 below Previous Day Low, wipes over-leveraged intraday longs (OI drops sharply), then prints a strong 15m close back above the low with bullish CHoCH for a 2.5R rebound.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.5'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'liquidity_sweep_vs_breakout',
    quiz: {
      prompt: 'What separates a disciplined liquidity-sweep setup from reckless "guessing the top or bottom"?',
      options: [
        'Entering a limit order before price even reaches the high',
        'Waiting for price to sweep the level AND confirm with a decisive close back inside structure plus defined invalidation above/below the sweep wick',
        'Removing your stop-loss so you cannot be wicked out',
        'Using 50x leverage on every equal high',
      ],
      correctIndex: 1,
      rationale: 'Waiting for reclaim confirmation distinguishes genuine trapped-breakout reversals from runaway trend breakouts.',
      commonTrap: 'Shorting the exact instant price breaks a high without waiting for rejection, getting swept straight into a vertical breakout.',
    },
  },
  {
    id: 'topic-c5-7',
    code: 'C5.7',
    slug: 'crypto-c5-7-funding-rate-strategies',
    title: 'Funding Rate Strategies',
    overviewEn:
      'Funding rate strategies range from directional contrarian squeeze setups (buying negative-funding support reclaims) to institutional delta-neutral Cash-and-Carry arbitrage (long spot + equal short perp to harvest elevated positive funding).',
    overviewTaglish:
      'Kasama sa funding rate strategies ang contrarian squeeze trades kapag sobrang negatibo ang funding sa support, at ang delta-neutral Cash-and-Carry (long spot + pantay na short perp) para kumita sa mataas na positive funding.',
    objectives: [
      'Explain Cash-and-Carry (basis/funding) trade mechanics: Buy 1x Spot + Short 1x Perp = price-neutral exposure collecting positive funding.',
      'Identify hidden risks in Cash-and-Carry: exchange counterparty risk, sudden funding flip negative, execution fee breakeven, and perp margin calls during vertical spikes.',
      'Apply funding extremes directionally ONLY when paired with structural sweep/reclaim confirmation.',
    ],
    keyPoints: [
      'Cash-and-Carry earns steady yield during euphoric bull markets (+0.04% to +0.10% per 8h), but requires active margin monitoring if price rockets upward.',
      'Round-trip entry/exit fees (~0.10%–0.20%) mean Cash-and-Carry only pays off if elevated funding persists long enough to clear fees.',
      'Directionally, deeply negative funding at major support is a potent short-squeeze filter.',
    ],
    limitationsNote: 'Even "delta-neutral" funding trades carry exchange insolvency, auto-deleveraging (ADL), and margin-liquidation operational risks.',
    practicalExample:
      'During bull euphoria, BTC funding averages +0.05% per 8h (~55% annualized). A trader buys $5,000 Spot BTC and shorts $5,000 1x Perp BTC—neutral to BTC price swings while collecting $7.50/day until funding cools near 0.01%.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.6'],
    estimatedMinutes: 10,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'In a delta-neutral Cash-and-Carry funding trade (Long 1 BTC Spot + Short 1 BTC Perpetual), what operational risk must you still actively manage if BTC suddenly doubles in price?',
      options: [
        'Your Spot BTC vanishes automatically',
        'Your Short Perpetual leg loses USD value and can get liquidated unless you keep ample margin buffer or rebalance collateral',
        'Funding rates become illegal when BTC doubles',
        'There is zero operational risk of any kind',
      ],
      correctIndex: 1,
      rationale: 'Even though spot gains offset perp losses overall, the perp margin wallet alone can still get liquidated if under-collateralized during a sharp rally.',
      commonTrap: 'Entering a Cash-and-Carry trade with 5x leverage on the short leg and getting liquidated on a rapid +22% spike.',
    },
  },
  {
    id: 'topic-c5-8',
    code: 'C5.8',
    slug: 'crypto-c5-8-oi-and-price-divergence',
    title: 'Open Interest and Price Divergence',
    overviewEn:
      'Open Interest and price divergence occurs when price pushes to a new extreme while OI fails to confirm—or when OI explodes vertically without price progress—signaling exhaustion, absorption, or an imminent volatility expansion.',
    overviewTaglish:
      'Nangyayari ang Open Interest at price divergence kapag gumagawa ng bagong high/low ang presyo pero bumabagsak ang OI (ubos na ang bagong leverage), o biglang lumolobo ang OI nang hindi gumagalaw ang presyo.',
    objectives: [
      'Diagnose exhaustion rallies: price prints a marginal higher high while Open Interest drops (short-covering exhaustion with no fresh buyers).',
      'Diagnose absorption traps: OI surges sharply at resistance while price stalls and prints rejection wicks (trapped breakout longs).',
      'Require a clear chart structure break before trading any OI divergence.',
    ],
    keyPoints: [
      'Price Higher High + Falling OI + Negative Spot CVD warns that buyers are exhausted and a pullback is likely.',
      'Flat price + Surging OI signals heavy battle between aggressive leverage and passive absorption—expect a violent directional break soon.',
      'Combine OI divergence with key higher-timeframe liquidity zones for crisp risk placement.',
    ],
    practicalExample:
      'An altcoin spikes +6% above resistance while Open Interest surges +30% in one hour and funding jumps to +0.08%, yet the 1H candle closes right back below resistance—trapping aggressive breakout longs and sparking a rapid flush.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.7'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-247-liquidity-playbook',
    diagramKind: 'crypto_funding_dominance',
    quiz: {
      prompt: 'Price breaks briefly above resistance while Open Interest jumps +25% rapidly, then price slams and closes back BELOW resistance. Who is now trapped?',
      options: [
        'Long-term hardware wallet holders',
        'Late leveraged breakout longs whose stop-losses and liquidations now sit right below price as fuel for a drop',
        'Bitcoin miners',
        'Spot stablecoin issuers',
      ],
      correctIndex: 1,
      rationale: 'Surging OI at a failed breakout means fresh leveraged longs piled in right at the top and are now underwater, prone to forced selling.',
      commonTrap: 'Trading minor 1-minute OI wiggles instead of meaningful 1H/4H shifts at major structural levels.',
    },
  },
  {
    id: 'topic-c5-9',
    code: 'C5.9',
    slug: 'crypto-c5-9-volatility-based-position-sizing',
    title: 'Volatility-Based Position Sizing',
    overviewEn:
      'Because Bitcoin might move 3% daily while a mid-cap altcoin swings 12% daily, volatility-based position sizing adjusts your notional size dynamically using Average True Range (ATR) and stop distance so every trade risks the exact same account percentage.',
    overviewTaglish:
      'Dahil magkaiba ang lakas ng galaw ng BTC (hal. 3%/day) at altcoins (hal. 12%/day), binabawasan ng volatility-based sizing ang position size sa mas malikot na coins gamit ang ATR at stop distance para pantay pa rin ang 1% risk.',
    objectives: [
      'Compute position size dynamically: Notional Size = Max Dollar Risk ÷ Stop-Loss Percentage Distance.',
      'Use 14-period ATR to set realistic stop buffers outside routine crypto noise wicks.',
      'Avoid using identical dollar position sizes on BTC and volatile mid-cap altcoins.',
    ],
    keyPoints: [
      'Wider stop distance (higher volatility) automatically means SMALLER notional position size—keeping dollar risk identical.',
      'Putting a tight 1% stop on a coin with a 10% daily ATR practically guarantees getting stopped out by normal noise.',
      'Volatility regimes expand during major news and bull peaks—shrink sizes whenever ATR doubles.',
    ],
    practicalExample:
      'Account: $5,000, Max Risk: 1% ($50). On BTC with a 2% stop, Notional = $50 ÷ 0.02 = $2,500. On a volatile altcoin requiring an 8% stop, Notional = $50 ÷ 0.08 = $625—identical $50 risk on both.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.8'],
    estimatedMinutes: 9,
    linkedDeepLessonSlug: 'crypto-volatility-altcoin-cycles',
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'With a $4,000 account and a strict 1% ($40) risk limit per trade, what notional position size should you take on a volatile altcoin that requires a 5% stop-loss distance?',
      options: ['$4,000', '$2,000', '$800', '$200'],
      correctIndex: 2,
      rationale: 'Notional Position Size = Max Dollar Risk ($40) ÷ Stop Distance (0.05) = $800.',
      commonTrap: 'Putting the same $2,000 size on both BTC and a hyper-volatile memecoin, accidentally taking 4x more real risk on the memecoin.',
    },
  },
  {
    id: 'topic-c5-10',
    code: 'C5.10',
    slug: 'crypto-c5-10-building-crypto-trading-system',
    title: 'Building a Crypto Trading System',
    overviewEn:
      'A complete crypto trading system combines market-regime filtering (BTC + BTC.D + TOTAL), objective setup triggers, volatility-adjusted sizing, exchange/security rules, and strict post-trade journaling across 50+ sample trades.',
    overviewTaglish:
      'Pinagsasama ng kumpletong crypto trading system ang market-regime filter (BTC + BTC.D + TOTAL), malinaw na entry/exit rules, volatility sizing, security hygiene, at regular na trade journaling.',
    objectives: [
      'Write a 1-page rulebook covering allowed assets, session focus (avoiding exhausted 3 AM PH revenge trades), risk caps, and daily/weekly drawdown circuit breakers.',
      'Test rules on historical replay and paper/tiny Spot size before scaling capital.',
      'Review performance weekly by setup tag, asset class (BTC vs. Alts), and fee/funding drag.',
    ],
    keyPoints: [
      'Because crypto never closes, YOUR personal trading hours and max-trades-per-day cap must replace the closing bell.',
      'Track net R-multiple after fees and funding—never judge a system by 3 lucky trades.',
      'Every real system hits losing streaks; predetermined weekly drawdown limits (e.g., −4% pause) prevent tilt blowups.',
    ],
    limitationsNote: 'No crypto system avoids drawdowns; long-term survival depends on discipline, low leverage, and strict operational security.',
    practicalExample:
      'A trader defines a 4-rule system: (1) BTC/ETH + top 5 liquid alts only, (2) 0.75% risk per trade, max 2 concurrent trades, (3) trading window 8:00 AM–10:00 PM PHT only, (4) mandatory −3R weekly stop-trading rule.',
    level: 4,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C5.9'],
    estimatedMinutes: 10,
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why is defining personal "active trading hours" and a weekly drawdown circuit breaker uniquely critical in crypto?',
      options: [
        'Because crypto exchanges forbid trading more than twice a week',
        'Because 24/7 markets never close, making fatigued late-night overtrading and emotional tilt spirals far easier without self-imposed boundaries',
        'Because Bitcoin only trends on Tuesdays',
        'Because stop-losses automatically turn off on weekends',
      ],
      correctIndex: 1,
      rationale: 'Without a stock-market closing bell, structured personal hours and hard loss limits protect mental clarity and capital.',
      commonTrap: 'Checking 5-minute charts in bed at 2:00 AM PHT and revenge-trading away a whole month of disciplined gains.',
    },
  },

  // =========================================================================
  // MODULE C6 — Crypto Security and Risk (C6.1 – C6.10)
  // =========================================================================
  {
    id: 'topic-c6-1',
    code: 'C6.1',
    slug: 'crypto-c6-1-exchange-security',
    title: 'Exchange Security',
    overviewEn:
      'Hardening your centralized exchange account with hardware security keys or authenticator-app 2FA (never SMS), withdrawal address whitelisting, anti-phishing codes, and a dedicated email dramatically cuts account takeover risk.',
    overviewTaglish:
      'Ang pagpapalakas ng security ng exchange account gamit ang Authenticator/YubiKey 2FA (huwag SMS), withdrawal address whitelist, anti-phishing code, at dedicated email ay malaking proteksyon laban sa hacking.',
    objectives: [
      'Replace vulnerable SMS 2FA with an offline Authenticator App or FIDO2 hardware key (e.g., YubiKey) to stop SIM-swap attacks.',
      'Enable Withdrawal Address Whitelisting (with a 24h lock delay) and Anti-Phishing Email Codes.',
      'Use a unique password manager entry and never grant withdrawal permissions on third-party trading API keys.',
    ],
    keyPoints: [
      'SIM-swapping allows attackers to hijack SMS codes in minutes—never rely on SMS 2FA for crypto exchanges.',
      'Anti-phishing codes print your personal secret phrase on every real exchange email so fake emails stand out instantly.',
      'Bookmark official exchange URLs directly instead of clicking sponsored search-engine ads.',
    ],
    practicalExample:
      'An attacker steals a user’s password via a fake ad, but fails to drain the account because Authenticator 2FA + Withdrawal Whitelist + 24-hour address lock halt the unauthorized transfer.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C1.10'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Why should you replace SMS text-message 2FA with an Authenticator App or hardware security key on all crypto exchanges?',
      options: [
        'SMS 2FA charges $5 per login',
        'Attackers can hijack phone numbers through SIM-swap social engineering to intercept SMS verification codes',
        'Exchanges disable withdrawals for Authenticator users',
        'SMS 2FA does not work during weekends',
      ],
      correctIndex: 1,
      rationale: 'SIM-swap attacks bypass SMS verification completely; app-based TOTP or hardware FIDO2 keys stay tied to your physical device.',
      commonTrap: 'Reusing your regular social-media email and password on your crypto exchange account.',
    },
  },
  {
    id: 'topic-c6-2',
    code: 'C6.2',
    slug: 'crypto-c6-2-wallet-security',
    title: 'Wallet Security',
    overviewEn:
      'Self-custody wallet security protects your private keys and on-chain permissions—requiring hardware signing, careful review of token spending approvals, regular approval revocations, and zero blind signing.',
    overviewTaglish:
      'Pinoprotektahan ng wallet security ang iyong private keys at on-chain token approvals—kailangan dito ng hardware wallet signing, pag-iwas sa blind signing, at regular na pag-revoke ng lumang smart-contract permissions.',
    objectives: [
      'Inspect every transaction simulation and contract approval ("SetApprovalForAll" / unlimited spend) before clicking Sign.',
      'Revoke old or unnecessary token approvals periodically using reputable tools like Revoke.cash.',
      'Verify full destination addresses on the hardware wallet screen itself—not just the PC monitor (defeating clipboard malware).',
    ],
    keyPoints: [
      'Signing a malicious unlimited token approval lets a drainer empty your USDT/ETH even WITHOUT knowing your seed phrase!',
      'Clipboard hijacker malware silently swaps copied wallet addresses when you press Ctrl+V—always verify start, middle, and end characters.',
      'Keep your trading/wallet computer clean: never install pirated software, cracked indicators, or unknown browser extensions.',
    ],
    practicalExample:
      'A user installs a "free cracked charting tool" that contains clipboard malware; verifying the address on their hardware wallet display catches the swapped hacker address before signing.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.1'],
    estimatedMinutes: 9,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'Can a scammer drain ERC-20 tokens from your self-custody wallet even WITHOUT ever seeing your 12-word seed phrase?',
      options: [
        'No, funds can only move if someone physically holds your seed phrase',
        'Yes—if you accidentally sign a malicious smart-contract token approval ("Permit" / unlimited spend) on a drainer site',
        'Only if your wallet is offline in a safe',
        'Only during Bitcoin halving weeks',
      ],
      correctIndex: 1,
      rationale: 'Malicious wallet drainers trick users into signing token-spend approvals or Permit signatures that legally authorize transferring tokens out.',
      commonTrap: 'Clicking "Sign" rapidly on Web3 popups without reading what permissions the contract requests.',
    },
  },
  {
    id: 'topic-c6-3',
    code: 'C6.3',
    slug: 'crypto-c6-3-phishing-and-scams',
    title: 'Phishing and Scams',
    overviewEn:
      'Crypto phishing and social-engineering scams—fake airdrop links, spoofed exchange search ads, impersonated Discord/Telegram admins, and "pig-butchering" romance/investment platforms—account for billions in preventable retail losses.',
    overviewTaglish:
      'Ang phishing at social-engineering scams tulad ng pekeng airdrop links, pekeng ads sa search engine, nagpapanggap na Telegram/Discord admins, at pekeng trading platforms ang pinakamalaking sanhi ng pagkawala ng pera ng beginners.',
    objectives: [
      'Spot classic scam red flags: urgency ("claim in 10 minutes"), guaranteed daily returns, unsolicited DMs, and paying "release taxes" to withdraw profits.',
      'Verify domain URLs character-by-character against official bookmarks (watch homograph lookalikes like `binarnce.com`).',
      'Recognize romance/mentor "pig-butchering" apps that display fake dashboard profits until you try to withdraw.',
    ],
    keyPoints: [
      'No legitimate trading platform asks you to deposit extra crypto as "tax" or "verification fee" before unlocking a withdrawal.',
      'Turn off unsolicited DMs on Discord/Telegram and assume every uninvited "helper" or "account manager" is a scammer.',
      'Even verified blue-check social accounts get hacked and post fake airdrop drainers—never click hastily.',
    ],
    practicalExample:
      'A stranger on messaging apps guides a victim to a slick clone trading site showing $40,000 in fake profits, then demands a $6,000 "withdrawal tax deposit"—a classic advance-fee pig-butchering scam.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.2'],
    estimatedMinutes: 9,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'An online trading app shows your $1,000 deposit grew to $18,000 in two weeks, and support says you must wire $2,500 in "tax clearance" first before withdrawing. What is this?',
      options: [
        'Standard international stock clearing procedure',
        'A classic advance-fee / "pig-butchering" crypto scam—never send another peso or dollar',
        'Normal Ethereum mainnet gas calculation',
        'Required SEC Philippines brokerage registration',
      ],
      correctIndex: 1,
      rationale: 'Legitimate exchanges never hold withdrawals hostage for upfront external tax deposits; the displayed profit screen is fabricated.',
      commonTrap: 'Sending "just one more fee" hoping to rescue the original deposit—sunk-cost trap that deepens losses.',
    },
  },
  {
    id: 'topic-c6-4',
    code: 'C6.4',
    slug: 'crypto-c6-4-rug-pulls',
    title: 'Rug Pulls',
    overviewEn:
      'A rug pull happens when malicious token creators drain a DEX liquidity pool, activate hidden honeypot code blocking retail sells, or mint unlimited tokens to dump price to near zero in seconds.',
    overviewTaglish:
      'Ang rug pull ay nangyayari kapag biglang tinanggal ng scam creators ang DEX liquidity pool, naglagay ng honeypot code na pumipigil magbenta, o nag-mint ng bilyun-bilyong tokens para ubusin ang pera ng buyers.',
    objectives: [
      'Inspect on-chain safety basics before touching any small DEX token: Liquidity Lock/Burn status, Mint Authority revoked, and Honeypot sell-simulation check.',
      'Identify anonymous teams with concentrated deployer wallets controlling >20%–50% of supply.',
      'Recognize "soft rugs" where founders slowly abandon development while steadily selling treasury tokens into hype.',
    ],
    keyPoints: [
      'Honeypot contracts let anyone buy freely (creating a fake green chart) while blocking sell transactions for non-whitelisted wallets.',
      'Unlocked DEX liquidity allows the creator to withdraw 100% of pooled ETH/SOL/USDT in a single transaction.',
      'Stick to established, deeply liquid, audited assets while learning—new unverified DEX launches are minefields.',
    ],
    practicalExample:
      'A fresh meme token rallies +400% in 20 minutes with zero red candles; checking a contract scanner reveals a 99% sell tax (honeypot)—trapping every FOMO buyer.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.3'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'What is a "honeypot" token scam on a Decentralized Exchange (DEX)?',
      options: [
        'A regulated high-yield savings token',
        'A malicious smart contract that lets retail traders buy easily while blocking or charging a 99% tax when they try to sell',
        'A liquidity pool locked for 10 years',
        'A hardware wallet backup phrase',
      ],
      correctIndex: 1,
      rationale: 'Honeypots create vertical all-green buy charts to lure FOMO buyers who discover too late that they cannot sell.',
      commonTrap: 'Jumping into brand-new viral DEX tickers from social media without running basic contract and liquidity checks.',
    },
  },
  {
    id: 'topic-c6-5',
    code: 'C6.5',
    slug: 'crypto-c6-5-pump-and-dump-schemes',
    title: 'Pump and Dump Schemes',
    overviewEn:
      'Pump and dump schemes coordinate paid influencers or VIP signal groups to accumulate a thin, low-cap token quietly, broadcast an urgent "buy now!" alert to followers, and immediately sell into the retail rush.',
    overviewTaglish:
      'Sa pump and dump, tahimik munang bumibili ang mga organizer o paid promoters ng manipis na low-cap coin, saka magpapa-alert ng "buy now!" sa followers para ibenta agad sa kanila sa tuktok.',
    objectives: [
      'Recognize the anatomy of a pump-and-dump: silent pre-accumulation → sudden coordinated hype blast → vertical spike → instant −70% collapse.',
      'Understand why retail group members are NEVER early—organizers and inner circles always buy before the public alert posts.',
      'Avoid "free VIP pump signal" Telegram/Discord channels completely.',
    ],
    keyPoints: [
      'If a group advertises a scheduled "Mega Pump at 9:00 PM UTC," the organizers already bought at 8:00 PM and YOU are their exit liquidity.',
      'Low-cap illiquid order books allow small insiders to spike price +150% in seconds and dump just as fast.',
      'Coordinated market manipulation is illegal in regulated jurisdictions and mathematically stacked against followers.',
    ],
    practicalExample:
      'A Telegram pump channel posts a coin ticker at 9:00:00 PM; within 8 seconds price spikes +90% as organizers sell into followers’ market buys, and by 9:03 PM price crashes −65% below the starting level.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.4'],
    estimatedMinutes: 8,
    diagramKind: 'stocks_orb_gap',
    quiz: {
      prompt: 'In a public Telegram "Scheduled Crypto Pump Group," who almost always loses money?',
      options: [
        'The group organizers who accumulated the illiquid coin beforehand',
        'The regular group members buying market orders after the ticker announcement, serving as exit liquidity for insiders',
        'The exchange collecting trading commissions',
        'Nobody—everyone profits equally',
      ],
      correctIndex: 1,
      rationale: 'By the second the public ticker drops, insiders already hold cheap inventory and dump directly into followers’ FOMO buys.',
      commonTrap: 'Thinking "I am fast enough to click buy and sell before the dump"—insiders and bots always beat manual clicks.',
    },
  },
  {
    id: 'topic-c6-6',
    code: 'C6.6',
    slug: 'crypto-c6-6-smart-contract-risks',
    title: 'Smart Contract Risks',
    overviewEn:
      'Smart contract risk is the danger that coding bugs, flash-loan exploits, oracle manipulation, or malicious admin upgrade keys drain funds deposited into DeFi protocols, bridges, or yield vaults.',
    overviewTaglish:
      'Ang smart contract risk ay panganib na maubos ang pondo sa DeFi protocols, bridges, o yield vaults dahil sa bugs sa code, flash-loan exploits, oracle manipulation, o admin backdoors.',
    objectives: [
      'Understand why "audited" does NOT mean "100% hack-proof"—even audited protocols have suffered multi-million-dollar exploits.',
      'Identify high-risk DeFi surfaces: brand-new unaudited forks, cross-chain bridges, and single-signature upgradeable admin keys.',
      'Apply DeFi capital limits: prefer battle-tested Lindy protocols and never lock your whole net worth into one contract.',
    ],
    keyPoints: [
      'Cross-chain bridges hold huge concentrated honey-pots and have historically accounted for the largest crypto hacks.',
      'Check if a protocol uses a time-locked multi-signature (multisig) treasury rather than one anonymous developer wallet.',
      'Extra DeFi yield always compensates for extra technical risk—never treat 15% DeFi yield like a risk-free bank deposit.',
    ],
    practicalExample:
      'A newly launched fork offers 40% yield on USDC; two weeks later an attacker exploits a price-oracle flaw via a flash loan and drains the entire vault.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.5'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'If a DeFi protocol displays a "Smart Contract Audited" badge on its website, what does that realistically mean?',
      options: [
        'The protocol is 100% immune to hacks and government-insured',
        'Independent security reviewers checked the code at a point in time, reducing—but NEVER eliminating—exploit or admin risks',
        'The protocol guarantees minimum 25% annual returns',
        'Lost funds are automatically refunded by the blockchain',
      ],
      correctIndex: 1,
      rationale: 'Audits catch many bugs, yet complex economic exploits, new code upgrades, and admin-key compromises still occur.',
      commonTrap: 'Depositing 100% of your trading capital into a 2-week-old yield farm because it offers 3x higher APY.',
    },
  },
  {
    id: 'topic-c6-7',
    code: 'C6.7',
    slug: 'crypto-c6-7-exchange-counterparty-risk',
    title: 'Exchange Counterparty Risk',
    overviewEn:
      'Exchange counterparty risk is the danger that a centralized exchange or crypto lender becomes insolvent, misuses customer deposits, suffers a catastrophic hack, or gets frozen by regulators—locking out your funds.',
    overviewTaglish:
      'Ang exchange counterparty risk ay panganib na malugi, ma-hack, o ma-freeze ang isang centralized exchange o lending platform—na puwedeng magresulta sa pagkawala o pagka-lock ng pondo mo.',
    objectives: [
      'Apply the core custody rule: keep ONLY active trading margin on exchanges; move long-term holdings to self-custody.',
      'Recognize early insolvency warning signs: delayed withdrawals, sudden removal of Proof-of-Reserves transparency, or unsustainably high "earn" yields.',
      'Spread larger active trading capital across more than one tier-1 regulated venue rather than a single exchange.',
    ],
    keyPoints: [
      'History (Mt. Gox, FTX, Celsius, BlockFi) proved even top-ranked celebrity-endorsed platforms can collapse overnight.',
      'Proof of Reserves without Proof of Liabilities is incomplete—still never blindly trust any single custodian.',
      'When an exchange pauses withdrawals citing "routine maintenance" during market stress, treat it as an urgent warning sign.',
    ],
    practicalExample:
      'A trader with $10,000 in crypto keeps $8,000 long-term BTC/ETH on a hardware wallet and only $2,000 active margin on a reputable exchange—limiting counterparty loss even in a worst-case venue collapse.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.6'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'What is the single most effective way to limit Exchange Counterparty Risk while remaining an active crypto trader?',
      options: [
        'Keep 100% of your net worth in an exchange "High-Yield Earn" program',
        'Keep only the active working margin you need on tier-1 exchanges and withdraw long-term savings to self-custody hardware wallets',
        'Trust whichever exchange sponsors the most sports teams',
        'Disable 2FA so you can withdraw faster',
      ],
      correctIndex: 1,
      rationale: 'Minimizing idle balances left on custodial platforms dramatically caps potential damage from any exchange insolvency or freeze.',
      commonTrap: 'Chasing an extra 6% yield by locking spot BTC on an opaque custodial lender and risking 100% principal loss.',
    },
  },
  {
    id: 'topic-c6-8',
    code: 'C6.8',
    slug: 'crypto-c6-8-stablecoin-depeg-risks',
    title: 'Stablecoin Depeg Risks',
    overviewEn:
      'A stablecoin depeg occurs when a dollar-pegged token drops significantly below $1.00 due to banking partner failure, questionable reserve backing, liquidity crunches, or algorithmic collapse.',
    overviewTaglish:
      'Nangyayari ang stablecoin depeg kapag bumaba nang malaki sa $1.00 ang presyo ng stablecoin dahil sa problema sa bangko, kulang na reserve, liquidity panic, o pagbagsak ng algorithmic model.',
    objectives: [
      'Differentiate temporary liquidity/banking depegs (e.g., USDC’s brief March 2023 dip to ~$0.88 during SVB) from permanent structural collapses (UST to $0).',
      'Mitigate depeg risk by diversifying idle cash across regulated bank fiat and top audited stablecoins (USDC/USDT).',
      'Avoid panic-selling an audited, T-bill-backed stablecoin at a steep discount before inspecting actual reserve facts—while exiting algorithmic depegs immediately.',
    ],
    keyPoints: [
      'Never assume any single stablecoin is 100% equivalent to FDIC-insured cash in a bank.',
      'High-yield obscure stablecoins almost always carry hidden collateral or credit risk.',
      'Check reserve attestations and avoid concentrating 100% of idle dry powder in one single issuer.',
    ],
    practicalExample:
      'During a regional banking shock, USDC briefly dips to $0.88 over a weekend. A trader holding reserves split across bank PHP/USD, USDC, and USDT stays calm without forced panic swaps.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.7'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'How can a crypto trader best reduce exposure to a sudden single-stablecoin depeg event?',
      options: [
        'Hold 100% of cash reserves inside an unaudited algorithmic stablecoin paying 20% APY',
        'Avoid unbacked algorithmic stables and diversify idle reserves across regulated fiat banking and major transparent stablecoins',
        'Keep 100% of capital permanently in 10x leveraged altcoins',
        'Ignore reserve audits completely',
      ],
      correctIndex: 1,
      rationale: 'Diversifying across regulated fiat and vetted major stablecoins prevents any single issuer or banking headline from immobilizing your capital.',
      commonTrap: 'Treating obscure high-APY "synthetic dollars" as identical in safety to short-term US Treasury-backed stablecoins.',
    },
  },
  {
    id: 'topic-c6-9',
    code: 'C6.9',
    slug: 'crypto-c6-9-protecting-digital-assets',
    title: 'Protecting Digital Assets',
    overviewEn:
      'Protecting digital assets uses a layered "defense-in-depth" security plan: hardware wallets, offline metal seed backups, separated hot/cold tiers, operational privacy (OpSec), and clear family/inheritance recovery instructions.',
    overviewTaglish:
      'Ang pagprotekta sa digital assets ay gumagamit ng defense-in-depth: hardware wallet, offline backup, magkahiwalay na hot/cold wallets, privacy (OpSec), at malinaw na emergency plan para hindi mawala ang pondo.',
    objectives: [
      'Build a 3-tier asset storage layout: Cold Vault (long-term), Warm Exchange (active margin), and Burner Hot Wallet (dApps).',
      'Practice Operational Security (OpSec): never publicly brag about exact wallet balances or personal holdings online.',
      'Document a non-digital inheritance/recovery guide (without exposing live seed words digitally) so assets are not lost forever in an emergency.',
    ],
    keyPoints: [
      'Security is only as strong as your weakest habit—one careless phishing click or bragging post undermines great tools.',
      'Keep OS, browser, and hardware wallet firmware updated only from official vendor releases.',
      'Regularly audit active exchange sessions, API keys, and wallet token approvals once a month.',
    ],
    practicalExample:
      'A disciplined crypto holder keeps 75% in an offline hardware vault with steel backup, 20% across two exchanges for active trading, 5% in a hot wallet, and performs a 10-minute monthly security check.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.8'],
    estimatedMinutes: 8,
    diagramKind: 'risk_reward_model',
    quiz: {
      prompt: 'What is "Operational Security (OpSec)" for cryptocurrency holders?',
      options: [
        'Posting daily screenshots of your full wallet balance and home address online',
        'Maintaining privacy about your holdings, separating hot/cold wallets, using dedicated devices/emails, and auditing permissions regularly',
        'Sharing your seed phrase with three online trading groups',
        'Keeping all passwords stored in an unencrypted desktop text file',
      ],
      correctIndex: 1,
      rationale: 'Good OpSec makes you a low-visibility, hard target against both digital phishing and real-world physical coercion.',
      commonTrap: 'Setting up a great hardware wallet once, then ruining privacy by flexing account screenshots with identifiable details online.',
    },
  },
  {
    id: 'topic-c6-10',
    code: 'C6.10',
    slug: 'crypto-c6-10-crypto-risk-management',
    title: 'Crypto Risk Management',
    overviewEn:
      'Crypto risk management unifies financial risk (0.5%–1% risk per trade, volatility-adjusted sizing, correlation caps, and drawdown limits) with crypto-specific operational risk (custody, leverage, and 24/7 fatigue defense).',
    overviewTaglish:
      'Pinagsasama ng crypto risk management ang tamang financial risk (0.5%–1% per trade, correlation cap, drawdown stop) at operational risk control (custody, low leverage, at pahinga mula sa 24/7 market).',
    objectives: [
      'Enforce strict risk ceilings: ≤1% per trade, ≤3%–4% correlated portfolio heat, and automatic size-cut during −6% to −10% drawdowns.',
      'Never risk essential living funds, emergency savings, or borrowed debt in cryptocurrency markets.',
      'Treat surviving extreme volatility ("staying in the game") as the prerequisite for long-term compounding.',
    ],
    keyPoints: [
      'A 50% account loss requires a +100% gain just to get back to breakeven—protecting downside beats chasing home runs.',
      'Always enter trades with a hard stop-loss placed on the exchange (never "mental stops" in a 24/7 market).',
      'Take periodic profit withdrawals into real-world fiat/safe assets so bull-market wins actually improve your life.',
    ],
    practicalExample:
      'After a strong 2-month crypto run grows a $3,000 trading account to $4,500, the trader withdraws $750 into bank savings, locks in tangible progress, and continues risking strictly 1% per trade.',
    level: 2,
    pillar: 'specializations',
    supportedMarkets: ['crypto'],
    prerequisiteCodes: ['C6.9'],
    estimatedMinutes: 10,
    diagramKind: 'trade_management_journal',
    quiz: {
      prompt: 'Why are "mental stop-losses" (not placing an actual stop order on the exchange) especially dangerous in crypto trading?',
      options: [
        'Because exchanges charge extra fees for mental stops',
        'Because 24/7 markets can flash-crash −15% while you sleep, lose internet, or freeze emotionally—turning a small −1R loss into catastrophic ruin',
        'Because hard stop orders never trigger on Bitcoin',
        'Because mental stops automatically double your leverage',
      ],
      correctIndex: 1,
      rationale: 'Exchange-side hard stop orders execute automatically while you sleep or disconnect, eliminating hesitation during fast cascades.',
      commonTrap: 'Moving your stop-loss further away when price approaches it ("just giving it a little more room") until a small trade wrecks the entire account.',
    },
  },
];
