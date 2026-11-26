import type { CandlePoint } from '../../src/types/academy';
import type {
  AssetClass,
  MarketCandlesResponse,
  MarketDataSource,
  MarketTimeframe,
} from '../../src/types/backtest';
import {
  generateOfflineMarketCandles,
  getMarketSymbol,
} from '../../src/data/marketCatalog';
import {
  MarketOhlcvQuerySchema,
  safeServerFetch,
} from '../_lib/urlSecurity';
import type { ApiRequest, ApiResponse } from '../_lib/youtube';

interface CacheEntry {
  expiresAt: number;
  payload: MarketCandlesResponse;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 120;
const MIN_VALID_CANDLES = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 90;

const ohlcvCache = new Map<string, CacheEntry>();
const rateLimitBuckets = new Map<string, RateLimitBucket>();

const TWELVE_DATA_INTERVALS: Record<MarketTimeframe, string> = {
  '5m': '5min',
  '15m': '15min',
  '1h': '1h',
  '4h': '4h',
  '1d': '1day',
};

const YAHOO_CONFIG: Record<MarketTimeframe, { interval: string; range: string; aggregate4h?: boolean }> = {
  '5m': { interval: '5m', range: '5d' },
  '15m': { interval: '15m', range: '1mo' },
  '1h': { interval: '60m', range: '3mo' },
  '4h': { interval: '60m', range: '6mo', aggregate4h: true },
  '1d': { interval: '1d', range: '2y' },
};

function getSingleQueryParam(
  query: Record<string, string | string[] | undefined> | undefined,
  key: string,
): string | undefined {
  const raw = query?.[key];
  if (typeof raw === 'string') {
    return raw;
  }
  if (Array.isArray(raw) && typeof raw[0] === 'string') {
    return raw[0];
  }
  return undefined;
}

function extractClientIp(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

function checkRateLimit(clientKey: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = rateLimitBuckets.get(clientKey);

  if (!existing || now >= existing.resetAt) {
    rateLimitBuckets.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function getCachedResponse(cacheKey: string): MarketCandlesResponse | null {
  const entry = ohlcvCache.get(cacheKey);
  if (!entry) {
    return null;
  }
  if (Date.now() >= entry.expiresAt) {
    ohlcvCache.delete(cacheKey);
    return null;
  }
  return entry.payload;
}

function setCachedResponse(cacheKey: string, payload: MarketCandlesResponse): void {
  if (ohlcvCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = ohlcvCache.keys().next().value;
    if (oldestKey) {
      ohlcvCache.delete(oldestKey);
    }
  }
  ohlcvCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  });
}

function normalizeAndSortCandles(rawCandles: CandlePoint[], limit: number): CandlePoint[] {
  const byTime = new Map<number, CandlePoint>();

  for (const bar of rawCandles) {
    if (
      !Number.isFinite(bar.time) ||
      bar.time <= 0 ||
      !Number.isFinite(bar.open) ||
      !Number.isFinite(bar.high) ||
      !Number.isFinite(bar.low) ||
      !Number.isFinite(bar.close) ||
      bar.open <= 0 ||
      bar.high <= 0 ||
      bar.low <= 0 ||
      bar.close <= 0
    ) {
      continue;
    }

    const high = Math.max(bar.high, bar.open, bar.close);
    const low = Math.min(bar.low, bar.open, bar.close);
    if (high < low || low <= 0) {
      continue;
    }

    const time = Math.floor(bar.time);
    const volume = Number.isFinite(bar.volume) && bar.volume >= 0 ? bar.volume : 0;

    byTime.set(time, {
      time,
      open: bar.open,
      high,
      low,
      close: bar.close,
      volume,
    });
  }

  const sorted = Array.from(byTime.values()).sort((a, b) => a.time - b.time);
  return sorted.length > limit ? sorted.slice(sorted.length - limit) : sorted;
}

function aggregateCandlesTo4h(hourlyCandles: CandlePoint[], limit: number): CandlePoint[] {
  const bucketSeconds = 14400;
  const buckets = new Map<number, CandlePoint>();

  for (const bar of hourlyCandles) {
    const bucketTime = Math.floor(bar.time / bucketSeconds) * bucketSeconds;
    const existing = buckets.get(bucketTime);
    if (!existing) {
      buckets.set(bucketTime, {
        time: bucketTime,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
        volume: bar.volume,
      });
    } else {
      existing.high = Math.max(existing.high, bar.high);
      existing.low = Math.min(existing.low, bar.low);
      existing.close = bar.close;
      existing.volume += bar.volume;
    }
  }

  return normalizeAndSortCandles(Array.from(buckets.values()), limit);
}

async function fetchBinanceCandles(
  binanceSymbol: string,
  timeframe: MarketTimeframe,
  limit: number,
): Promise<CandlePoint[]> {
  const url = new URL('https://api.binance.com/api/v3/klines');
  url.searchParams.set('symbol', binanceSymbol);
  url.searchParams.set('interval', timeframe);
  url.searchParams.set('limit', String(limit));

  const response = await safeServerFetch(url.toString(), {
    headers: { Accept: 'application/json' },
    timeoutMs: 7000,
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    return [];
  }

  const candles: CandlePoint[] = [];
  for (const row of payload) {
    if (!Array.isArray(row) || row.length < 6) {
      continue;
    }
    const openTimeMs = Number(row[0]);
    const open = Number(row[1]);
    const high = Number(row[2]);
    const low = Number(row[3]);
    const close = Number(row[4]);
    const volume = Number(row[5]);

    candles.push({
      time: Math.floor(openTimeMs / 1000),
      open,
      high,
      low,
      close,
      volume: Number.isFinite(volume) ? volume : 0,
    });
  }

  return normalizeAndSortCandles(candles, limit);
}

interface TwelveDataValueRow {
  datetime?: unknown;
  open?: unknown;
  high?: unknown;
  low?: unknown;
  close?: unknown;
  volume?: unknown;
}

interface TwelveDataPayload {
  status?: unknown;
  values?: TwelveDataValueRow[];
}

function parseUtcDatetimeSeconds(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.includes('T')
    ? trimmed
    : trimmed.includes(' ')
      ? `${trimmed.replace(' ', 'T')}Z`
      : `${trimmed}T00:00:00Z`;

  const parsedMs = Date.parse(normalized);
  if (!Number.isFinite(parsedMs) || parsedMs <= 0) {
    return null;
  }
  return Math.floor(parsedMs / 1000);
}

async function fetchTwelveDataCandles(
  twelveDataSymbol: string,
  timeframe: MarketTimeframe,
  limit: number,
  apiKey: string,
): Promise<CandlePoint[]> {
  const url = new URL('https://api.twelvedata.com/time_series');
  url.searchParams.set('symbol', twelveDataSymbol);
  url.searchParams.set('interval', TWELVE_DATA_INTERVALS[timeframe]);
  url.searchParams.set('outputsize', String(limit));
  url.searchParams.set('timezone', 'UTC');
  url.searchParams.set('apikey', apiKey);

  const response = await safeServerFetch(url.toString(), {
    headers: { Accept: 'application/json' },
    timeoutMs: 8000,
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as TwelveDataPayload;
  if (payload.status === 'error' || !Array.isArray(payload.values)) {
    return [];
  }

  const candles: CandlePoint[] = [];
  for (const row of payload.values) {
    if (typeof row.datetime !== 'string') {
      continue;
    }
    const time = parseUtcDatetimeSeconds(row.datetime);
    if (time === null) {
      continue;
    }
    candles.push({
      time,
      open: Number(row.open),
      high: Number(row.high),
      low: Number(row.low),
      close: Number(row.close),
      volume: Number(row.volume ?? 0),
    });
  }

  return normalizeAndSortCandles(candles, limit);
}

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      timestamp?: Array<number | null>;
      indicators?: {
        quote?: Array<{
          open?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          close?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }>;
  };
}

async function fetchYahooCandles(
  yahooSymbol: string,
  timeframe: MarketTimeframe,
  limit: number,
): Promise<CandlePoint[]> {
  const config = YAHOO_CONFIG[timeframe];
  const encodedSymbol = encodeURIComponent(yahooSymbol);
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}`);
  url.searchParams.set('interval', config.interval);
  url.searchParams.set('range', config.range);
  url.searchParams.set('includePrePost', 'false');

  const response = await safeServerFetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; TradeLabAcademy/1.0)',
    },
    timeoutMs: 8000,
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as YahooChartResponse;
  const result = payload.chart?.result?.[0];
  const timestamps = result?.timestamp;
  const quote = result?.indicators?.quote?.[0];

  if (!Array.isArray(timestamps) || !quote) {
    return [];
  }

  const opens = quote.open ?? [];
  const highs = quote.high ?? [];
  const lows = quote.low ?? [];
  const closes = quote.close ?? [];
  const volumes = quote.volume ?? [];

  const rawCandles: CandlePoint[] = [];
  for (let i = 0; i < timestamps.length; i += 1) {
    const time = timestamps[i];
    const open = opens[i];
    const high = highs[i];
    const low = lows[i];
    const close = closes[i];
    const volume = volumes[i];

    if (
      typeof time !== 'number' ||
      typeof open !== 'number' ||
      typeof high !== 'number' ||
      typeof low !== 'number' ||
      typeof close !== 'number'
    ) {
      continue;
    }

    rawCandles.push({
      time,
      open,
      high,
      low,
      close,
      volume: typeof volume === 'number' && Number.isFinite(volume) ? volume : 0,
    });
  }

  if (config.aggregate4h) {
    const normalizedHourly = normalizeAndSortCandles(rawCandles, Math.max(limit * 4, 400));
    return aggregateCandlesTo4h(normalizedHourly, limit);
  }

  return normalizeAndSortCandles(rawCandles, limit);
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.setHeader('Cache-Control', 'no-store');
    res.status(405).json({ error: 'Method not allowed. Use GET.' });
    return;
  }

  const rate = checkRateLimit(extractClientIp(req));
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    res.setHeader('Cache-Control', 'no-store');
    res.status(429).json({
      error: 'Too many market data requests. Please retry shortly.',
    });
    return;
  }

  const parsed = MarketOhlcvQuerySchema.safeParse({
    symbol: getSingleQueryParam(req.query, 'symbol'),
    timeframe: getSingleQueryParam(req.query, 'timeframe'),
    limit: getSingleQueryParam(req.query, 'limit'),
  });

  if (!parsed.success) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(400).json({
      error: parsed.error.issues[0]?.message ?? 'Invalid market OHLCV query parameters.',
    });
    return;
  }

  const { symbol: rawSymbol, timeframe, limit } = parsed.data;
  const meta = getMarketSymbol(rawSymbol);
  const resolvedSymbol = meta?.symbol ?? rawSymbol.toUpperCase();
  const displayName = meta?.displayName ?? resolvedSymbol;
  const assetClass: AssetClass = meta?.assetClass ?? 'crypto';

  const cacheKey = `${resolvedSymbol}:${timeframe}:${limit}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    res.status(200).json(cached);
    return;
  }

  let candles: CandlePoint[] = [];
  let dataSource: MarketDataSource = 'offline_sample';
  let note: string | undefined;

  try {
    if (meta?.binanceSymbol) {
      const binanceCandles = await fetchBinanceCandles(meta.binanceSymbol, timeframe, limit);
      if (binanceCandles.length >= MIN_VALID_CANDLES) {
        candles = binanceCandles;
        dataSource = 'live_binance';
      }
    } else {
      const twelveDataApiKey = process.env.TWELVEDATA_API_KEY?.trim();
      if (twelveDataApiKey && meta?.twelveDataSymbol) {
        const tdCandles = await fetchTwelveDataCandles(
          meta.twelveDataSymbol,
          timeframe,
          limit,
          twelveDataApiKey,
        );
        if (tdCandles.length >= MIN_VALID_CANDLES) {
          candles = tdCandles;
          dataSource = 'live_twelvedata';
        }
      }

      if (candles.length < MIN_VALID_CANDLES) {
        const yahooTarget = meta?.yahooSymbol ?? resolvedSymbol;
        const yahooCandles = await fetchYahooCandles(yahooTarget, timeframe, limit);
        if (yahooCandles.length >= MIN_VALID_CANDLES) {
          candles = yahooCandles;
          dataSource = 'live_yahoo';
        }
      }
    }
  } catch {
    candles = [];
  }

  if (candles.length < MIN_VALID_CANDLES) {
    candles = generateOfflineMarketCandles(resolvedSymbol, timeframe, limit);
    dataSource = 'offline_sample';
    note =
      'Live market feed was temporarily unavailable or returned fewer than 30 bars. Serving deterministic offline historical sample candles for replay.';
  }

  const payload: MarketCandlesResponse = {
    symbol: resolvedSymbol,
    displayName,
    assetClass,
    timeframe,
    dataSource,
    candles,
    fetchedAt: new Date().toISOString(),
    ...(note ? { note } : {}),
  };

  setCachedResponse(cacheKey, payload);
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  res.status(200).json(payload);
}
