import type { CandlePoint } from '@/types/academy';
import type { MarketSymbolOption, MarketTimeframe } from '@/types/backtest';

export const MARKET_TIMEFRAMES: Array<{ id: MarketTimeframe; label: string; seconds: number }> = [
  { id: '5m', label: '5m', seconds: 300 },
  { id: '15m', label: '15m', seconds: 900 },
  { id: '1h', label: '1H', seconds: 3600 },
  { id: '4h', label: '4H', seconds: 14400 },
  { id: '1d', label: '1D', seconds: 86400 },
];

export const MARKET_SYMBOLS: MarketSymbolOption[] = [
  // Crypto
  {
    symbol: 'BTCUSDT',
    displayName: 'Bitcoin / USDT',
    assetClass: 'crypto',
    binanceSymbol: 'BTCUSDT',
    twelveDataSymbol: 'BTC/USD',
    yahooSymbol: 'BTC-USD',
    basePrice: 86400,
    pipStep: 1,
    decimals: 2,
    volatilityPct: 0.0065,
  },
  {
    symbol: 'ETHUSDT',
    displayName: 'Ethereum / USDT',
    assetClass: 'crypto',
    binanceSymbol: 'ETHUSDT',
    twelveDataSymbol: 'ETH/USD',
    yahooSymbol: 'ETH-USD',
    basePrice: 2820,
    pipStep: 0.1,
    decimals: 2,
    volatilityPct: 0.0075,
  },
  {
    symbol: 'SOLUSDT',
    displayName: 'Solana / USDT',
    assetClass: 'crypto',
    binanceSymbol: 'SOLUSDT',
    twelveDataSymbol: 'SOL/USD',
    yahooSymbol: 'SOL-USD',
    basePrice: 178,
    pipStep: 0.01,
    decimals: 2,
    volatilityPct: 0.0095,
  },
  {
    symbol: 'XRPUSDT',
    displayName: 'XRP / USDT',
    assetClass: 'crypto',
    binanceSymbol: 'XRPUSDT',
    twelveDataSymbol: 'XRP/USD',
    yahooSymbol: 'XRP-USD',
    basePrice: 2.35,
    pipStep: 0.0001,
    decimals: 4,
    volatilityPct: 0.009,
  },
  {
    symbol: 'BNBUSDT',
    displayName: 'BNB / USDT',
    assetClass: 'crypto',
    binanceSymbol: 'BNBUSDT',
    twelveDataSymbol: 'BNB/USD',
    yahooSymbol: 'BNB-USD',
    basePrice: 645,
    pipStep: 0.05,
    decimals: 2,
    volatilityPct: 0.0068,
  },

  // Forex
  {
    symbol: 'EUR/USD',
    displayName: 'Euro / US Dollar',
    assetClass: 'forex',
    twelveDataSymbol: 'EUR/USD',
    yahooSymbol: 'EURUSD=X',
    basePrice: 1.0845,
    pipStep: 0.0001,
    decimals: 5,
    volatilityPct: 0.0016,
  },
  {
    symbol: 'GBP/USD',
    displayName: 'British Pound / US Dollar',
    assetClass: 'forex',
    twelveDataSymbol: 'GBP/USD',
    yahooSymbol: 'GBPUSD=X',
    basePrice: 1.2685,
    pipStep: 0.0001,
    decimals: 5,
    volatilityPct: 0.0019,
  },
  {
    symbol: 'USD/JPY',
    displayName: 'US Dollar / Japanese Yen',
    assetClass: 'forex',
    twelveDataSymbol: 'USD/JPY',
    yahooSymbol: 'USDJPY=X',
    basePrice: 151.45,
    pipStep: 0.01,
    decimals: 3,
    volatilityPct: 0.0021,
  },
  {
    symbol: 'AUD/USD',
    displayName: 'Australian Dollar / US Dollar',
    assetClass: 'forex',
    twelveDataSymbol: 'AUD/USD',
    yahooSymbol: 'AUDUSD=X',
    basePrice: 0.6545,
    pipStep: 0.0001,
    decimals: 5,
    volatilityPct: 0.002,
  },

  // Indices
  {
    symbol: 'NAS100',
    displayName: 'Nasdaq 100 Index',
    assetClass: 'indices',
    twelveDataSymbol: 'NDX',
    yahooSymbol: '^NDX',
    basePrice: 21250,
    pipStep: 0.25,
    decimals: 2,
    volatilityPct: 0.0038,
  },
  {
    symbol: 'US500',
    displayName: 'S&P 500 Index',
    assetClass: 'indices',
    twelveDataSymbol: 'SPX',
    yahooSymbol: '^GSPC',
    basePrice: 5940,
    pipStep: 0.25,
    decimals: 2,
    volatilityPct: 0.0028,
  },
  {
    symbol: 'US30',
    displayName: 'Dow Jones 30 Index',
    assetClass: 'indices',
    twelveDataSymbol: 'DJI',
    yahooSymbol: '^DJI',
    basePrice: 43650,
    pipStep: 1,
    decimals: 2,
    volatilityPct: 0.0026,
  },

  // Stocks
  {
    symbol: 'AAPL',
    displayName: 'Apple Inc.',
    assetClass: 'stocks',
    twelveDataSymbol: 'AAPL',
    yahooSymbol: 'AAPL',
    basePrice: 228.5,
    pipStep: 0.01,
    decimals: 2,
    volatilityPct: 0.0042,
  },
  {
    symbol: 'NVDA',
    displayName: 'NVIDIA Corp.',
    assetClass: 'stocks',
    twelveDataSymbol: 'NVDA',
    yahooSymbol: 'NVDA',
    basePrice: 138.4,
    pipStep: 0.01,
    decimals: 2,
    volatilityPct: 0.0072,
  },
  {
    symbol: 'TSLA',
    displayName: 'Tesla Inc.',
    assetClass: 'stocks',
    twelveDataSymbol: 'TSLA',
    yahooSymbol: 'TSLA',
    basePrice: 312.0,
    pipStep: 0.01,
    decimals: 2,
    volatilityPct: 0.0085,
  },
  {
    symbol: 'SPY',
    displayName: 'SPDR S&P 500 ETF',
    assetClass: 'stocks',
    twelveDataSymbol: 'SPY',
    yahooSymbol: 'SPY',
    basePrice: 592.4,
    pipStep: 0.01,
    decimals: 2,
    volatilityPct: 0.0027,
  },
  {
    symbol: 'QQQ',
    displayName: 'Invesco QQQ Trust',
    assetClass: 'stocks',
    twelveDataSymbol: 'QQQ',
    yahooSymbol: 'QQQ',
    basePrice: 514.2,
    pipStep: 0.01,
    decimals: 2,
    volatilityPct: 0.0036,
  },

  // Commodities
  {
    symbol: 'XAU/USD',
    displayName: 'Gold Spot (XAU/USD)',
    assetClass: 'commodities',
    twelveDataSymbol: 'XAU/USD',
    yahooSymbol: 'GC=F',
    basePrice: 2745.0,
    pipStep: 0.1,
    decimals: 2,
    volatilityPct: 0.0032,
  },
  {
    symbol: 'XAG/USD',
    displayName: 'Silver Spot (XAG/USD)',
    assetClass: 'commodities',
    twelveDataSymbol: 'XAG/USD',
    yahooSymbol: 'SI=F',
    basePrice: 32.45,
    pipStep: 0.005,
    decimals: 3,
    volatilityPct: 0.0054,
  },
];

const DEFAULT_OFFLINE_CANDLE_COUNT = 260;
const ANCHOR_END_UNIX_SECONDS = 1740787200; // 2025-03-01T00:00:00Z

type MarketRegime = 'accumulation' | 'bull_trend' | 'pullback_down' | 'bear_trend' | 'pullback_up';

interface RegimeSpec {
  kind: MarketRegime;
  driftFactor: number;
  volatilityScale: number;
}

const REGIME_CYCLE: RegimeSpec[] = [
  { kind: 'accumulation', driftFactor: 0.02, volatilityScale: 0.72 },
  { kind: 'bull_trend', driftFactor: 0.34, volatilityScale: 1.08 },
  { kind: 'pullback_down', driftFactor: -0.22, volatilityScale: 0.92 },
  { kind: 'bull_trend', driftFactor: 0.28, volatilityScale: 1.05 },
  { kind: 'accumulation', driftFactor: -0.03, volatilityScale: 0.76 },
  { kind: 'bear_trend', driftFactor: -0.32, volatilityScale: 1.12 },
  { kind: 'pullback_up', driftFactor: 0.21, volatilityScale: 0.9 },
  { kind: 'bear_trend', driftFactor: -0.24, volatilityScale: 1.02 },
];

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createMulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundPrice(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getTimeframeSeconds(timeframe: MarketTimeframe): number {
  return MARKET_TIMEFRAMES.find((tf) => tf.id === timeframe)?.seconds ?? 3600;
}

export function getMarketSymbol(symbol: string): MarketSymbolOption | undefined {
  const normalized = symbol.trim().toUpperCase();
  if (!normalized) return undefined;

  return MARKET_SYMBOLS.find(
    (item) =>
      item.symbol.toUpperCase() === normalized ||
      item.binanceSymbol?.toUpperCase() === normalized ||
      item.twelveDataSymbol?.toUpperCase() === normalized ||
      item.yahooSymbol?.toUpperCase() === normalized,
  );
}

function parseIsoDateToUnixSeconds(dateStr: string | undefined, endOfDay: boolean): number | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;

  const baseMs = Date.parse(`${trimmed}T00:00:00Z`);
  if (!Number.isFinite(baseMs) || baseMs <= 0) return null;
  if (new Date(baseMs).toISOString().slice(0, 10) !== trimmed) return null;

  const targetMs = endOfDay ? Date.parse(`${trimmed}T23:59:59Z`) : baseMs;
  return Math.floor(targetMs / 1000);
}

export function generateOfflineMarketCandles(
  symbol: string,
  timeframe: MarketTimeframe,
  count: number = DEFAULT_OFFLINE_CANDLE_COUNT,
  dateRange?: { startDate?: string; endDate?: string },
): CandlePoint[] {
  const safeCount = Math.max(1, Math.min(2000, Math.floor(count)));
  const meta = getMarketSymbol(symbol) ?? {
    symbol: symbol.trim().toUpperCase() || 'BTCUSDT',
    displayName: symbol.trim().toUpperCase() || 'Custom Asset',
    assetClass: 'crypto' as const,
    basePrice: 100,
    pipStep: 0.01,
    decimals: 2,
    volatilityPct: 0.005,
  };

  const tfSeconds = getTimeframeSeconds(timeframe);
  const startTimeSec = parseIsoDateToUnixSeconds(dateRange?.startDate, false);
  const endTimeSec = parseIsoDateToUnixSeconds(dateRange?.endDate, true);

  let startTime: number;
  let barCount = safeCount;

  if (startTimeSec !== null && endTimeSec !== null && startTimeSec <= endTimeSec) {
    const alignedEnd = Math.floor(endTimeSec / tfSeconds) * tfSeconds;
    const availableBars = Math.floor((alignedEnd - startTimeSec) / tfSeconds) + 1;
    if (availableBars <= safeCount) {
      barCount = Math.max(1, availableBars);
      startTime = startTimeSec;
    } else {
      startTime = alignedEnd - (safeCount - 1) * tfSeconds;
    }
  } else if (endTimeSec !== null) {
    const alignedEnd = Math.floor(endTimeSec / tfSeconds) * tfSeconds;
    startTime = alignedEnd - (safeCount - 1) * tfSeconds;
  } else if (startTimeSec !== null) {
    startTime = startTimeSec;
  } else {
    startTime = ANCHOR_END_UNIX_SECONDS - (safeCount - 1) * tfSeconds;
  }

  const seedSuffix =
    startTimeSec !== null || endTimeSec !== null
      ? `:${dateRange?.startDate?.trim() ?? ''}:${dateRange?.endDate?.trim() ?? ''}`
      : '';
  const rand = createMulberry32(hashSeed(`${meta.symbol}:${timeframe}${seedSuffix}`));

  // Scale volatility modestly across timeframes while preserving natural candle ranges
  const tfVolScale = Math.min(2.4, Math.max(0.45, Math.sqrt(tfSeconds / 3600)));
  const baseStepVol = meta.volatilityPct * tfVolScale;
  const minPrice = Math.max(meta.pipStep * 20, meta.basePrice * 0.25);

  const candles: CandlePoint[] = [];
  let prevClose = meta.basePrice;
  let regimeIndex = Math.floor(rand() * REGIME_CYCLE.length);
  let barsInRegime = 0;
  let regimeLength = 22 + Math.floor(rand() * 20);
  let sweepCooldown = 14;

  const baseVolume = meta.assetClass === 'crypto'
    ? 1850
    : meta.assetClass === 'stocks'
      ? 420000
      : meta.assetClass === 'indices'
        ? 38000
        : meta.assetClass === 'commodities'
          ? 12500
          : 6400;

  for (let i = 0; i < barCount; i += 1) {
    if (barsInRegime >= regimeLength) {
      regimeIndex = (regimeIndex + 1) % REGIME_CYCLE.length;
      barsInRegime = 0;
      regimeLength = 20 + Math.floor(rand() * 22);
    }

    const regime = REGIME_CYCLE[regimeIndex];
    const barVol = prevClose * baseStepVol * regime.volatilityScale;
    const open = prevClose;

    // Approximate bell-curve shock via sum of three uniform draws
    const noise = (rand() + rand() + rand() - 1.5) * 1.15;
    let delta = barVol * (regime.driftFactor + noise);

    // Gentle mean reversion guardrail so prices stay within realistic distance of basePrice
    const deviationRatio = (open - meta.basePrice) / meta.basePrice;
    if (Math.abs(deviationRatio) > 0.22) {
      delta -= Math.sign(deviationRatio) * barVol * 0.45;
    }

    const isLiquiditySweep = sweepCooldown <= 0 && i >= 12 && i < barCount - 2 && rand() < 0.16;
    let upperWick = barVol * (0.2 + rand() * 0.65);
    let lowerWick = barVol * (0.2 + rand() * 0.65);
    let volumeMultiplier = 0.75 + rand() * 0.7;

    if (isLiquiditySweep) {
      const sweepHigh = regime.driftFactor >= 0 ? rand() < 0.65 : rand() < 0.35;
      const sweepWickSize = barVol * (1.75 + rand() * 1.1);

      if (sweepHigh) {
        // Buy-side liquidity sweep above recent highs, closing back down
        upperWick = sweepWickSize;
        delta = -Math.abs(barVol * (0.45 + rand() * 0.65));
      } else {
        // Sell-side liquidity sweep below recent lows, closing back up
        lowerWick = sweepWickSize;
        delta = Math.abs(barVol * (0.45 + rand() * 0.65));
      }
      volumeMultiplier = 1.85 + rand() * 0.95;
      sweepCooldown = 16 + Math.floor(rand() * 14);
    } else {
      sweepCooldown -= 1;
    }

    const rawClose = Math.max(minPrice, open + delta);
    const bodyHigh = Math.max(open, rawClose);
    const bodyLow = Math.min(open, rawClose);

    const roundedOpen = roundPrice(open, meta.decimals);
    const roundedClose = roundPrice(rawClose, meta.decimals);
    const roundedHigh = Math.max(
      roundedOpen,
      roundedClose,
      roundPrice(bodyHigh + upperWick, meta.decimals),
    );
    const roundedLow = Math.min(
      roundedOpen,
      roundedClose,
      Math.max(meta.pipStep, roundPrice(bodyLow - lowerWick, meta.decimals)),
    );

    const rangeRatio = (roundedHigh - roundedLow) / Math.max(barVol, meta.pipStep);
    const volume = Math.max(
      1,
      Math.round(baseVolume * volumeMultiplier * (0.7 + Math.min(2.2, rangeRatio * 0.45))),
    );

    candles.push({
      time: startTime + i * tfSeconds,
      open: roundedOpen,
      high: roundedHigh,
      low: roundedLow,
      close: roundedClose,
      volume,
    });

    prevClose = roundedClose;
    barsInRegime += 1;
  }

  return candles;
}
