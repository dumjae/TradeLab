import type { CandlePoint } from '@/types/academy';
import type {
  AssetClass,
  MarketCandlesResponse,
  MarketTimeframe,
} from '@/types/backtest';
import {
  generateOfflineMarketCandles,
  getMarketSymbol,
} from '@/data/marketCatalog';

const DEFAULT_CANDLE_LIMIT = 240;
const MIN_VALID_CANDLES = 30;
const MIN_VALID_RANGE_CANDLES = 2;
const REQUEST_TIMEOUT_MS = 9000;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface MarketFetchOptions {
  startDate?: string;
  endDate?: string;
  forceRefresh?: boolean;
}

function normalizeDateOption(value?: string): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return ISO_DATE_PATTERN.test(trimmed) ? trimmed : undefined;
}

function parseDateOptionToMs(dateStr: string | undefined, endOfDay: boolean): number | undefined {
  if (!dateStr) return undefined;
  const ms = Date.parse(`${dateStr}${endOfDay ? 'T23:59:59.999Z' : 'T00:00:00Z'}`);
  return Number.isFinite(ms) && ms > 0 ? ms : undefined;
}

function createTimeoutSignal(timeoutMs: number): { signal?: AbortSignal; cleanup: () => void } {
  if (typeof AbortController === 'undefined') {
    return { cleanup: () => {} };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer),
  };
}

function normalizeCandles(raw: CandlePoint[], limit: number): CandlePoint[] {
  const byTime = new Map<number, CandlePoint>();

  for (const bar of raw) {
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
    byTime.set(time, {
      time,
      open: bar.open,
      high,
      low,
      close: bar.close,
      volume: Number.isFinite(bar.volume) && bar.volume >= 0 ? bar.volume : 0,
    });
  }

  const sorted = Array.from(byTime.values()).sort((a, b) => a.time - b.time);
  return sorted.length > limit ? sorted.slice(sorted.length - limit) : sorted;
}

async function fetchViaServerProxy(
  symbol: string,
  timeframe: MarketTimeframe,
  limit: number,
  options?: MarketFetchOptions,
): Promise<MarketCandlesResponse | null> {
  const params = new URLSearchParams({
    symbol,
    timeframe,
    limit: String(limit),
  });

  if (options?.startDate) {
    params.set('startDate', options.startDate);
  }
  if (options?.endDate) {
    params.set('endDate', options.endDate);
  }
  if (options?.forceRefresh) {
    params.set('refresh', '1');
  }

  const minCandles = options?.startDate || options?.endDate
    ? MIN_VALID_RANGE_CANDLES
    : MIN_VALID_CANDLES;

  const { signal, cleanup } = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`/api/market/ohlcv?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: options?.forceRefresh ? 'no-store' : 'default',
      signal,
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return null;
    }

    const payload = (await response.json()) as Partial<MarketCandlesResponse>;
    if (!Array.isArray(payload.candles) || payload.candles.length < minCandles) {
      return null;
    }

    const normalizedCandles = normalizeCandles(payload.candles as CandlePoint[], limit);
    if (normalizedCandles.length < minCandles) {
      return null;
    }

    return {
      symbol: typeof payload.symbol === 'string' && payload.symbol ? payload.symbol : symbol,
      displayName:
        typeof payload.displayName === 'string' && payload.displayName
          ? payload.displayName
          : symbol,
      assetClass: (payload.assetClass ?? 'crypto') as AssetClass,
      timeframe,
      dataSource: payload.dataSource ?? 'offline_sample',
      candles: normalizedCandles,
      fetchedAt:
        typeof payload.fetchedAt === 'string' && payload.fetchedAt
          ? payload.fetchedAt
          : new Date().toISOString(),
      ...(typeof payload.note === 'string' && payload.note ? { note: payload.note } : {}),
    };
  } catch {
    return null;
  } finally {
    cleanup();
  }
}

async function fetchDirectBinanceCandles(
  binanceSymbol: string,
  timeframe: MarketTimeframe,
  limit: number,
  options?: MarketFetchOptions,
): Promise<CandlePoint[] | null> {
  const params = new URLSearchParams({
    symbol: binanceSymbol,
    interval: timeframe,
    limit: String(limit),
  });

  const startTimeMs = parseDateOptionToMs(options?.startDate, false);
  const endTimeMs = parseDateOptionToMs(options?.endDate, true);

  if (startTimeMs !== undefined && endTimeMs !== undefined && startTimeMs > endTimeMs) {
    return null;
  }
  if (startTimeMs !== undefined) {
    params.set('startTime', String(startTimeMs));
  }
  if (endTimeMs !== undefined) {
    params.set('endTime', String(endTimeMs));
  }

  const minCandles = options?.startDate || options?.endDate
    ? MIN_VALID_RANGE_CANDLES
    : MIN_VALID_CANDLES;

  const { signal, cleanup } = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: options?.forceRefresh ? 'no-store' : 'default',
      signal,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) {
      return null;
    }

    const rawCandles: CandlePoint[] = [];
    for (const row of payload) {
      if (!Array.isArray(row) || row.length < 6) {
        continue;
      }
      rawCandles.push({
        time: Math.floor(Number(row[0]) / 1000),
        open: Number(row[1]),
        high: Number(row[2]),
        low: Number(row[3]),
        close: Number(row[4]),
        volume: Number(row[5]),
      });
    }

    const normalized = normalizeCandles(rawCandles, limit);
    return normalized.length >= minCandles ? normalized : null;
  } catch {
    return null;
  } finally {
    cleanup();
  }
}

export async function fetchMarketCandles(
  symbol: string,
  timeframe: MarketTimeframe,
  limit: number = DEFAULT_CANDLE_LIMIT,
  options?: MarketFetchOptions,
): Promise<MarketCandlesResponse> {
  const safeLimit = Math.max(50, Math.min(500, Math.floor(limit || DEFAULT_CANDLE_LIMIT)));
  const meta = getMarketSymbol(symbol);
  const resolvedSymbol = meta?.symbol ?? (symbol.trim().toUpperCase() || 'BTCUSDT');
  const displayName = meta?.displayName ?? resolvedSymbol;
  const assetClass: AssetClass = meta?.assetClass ?? 'crypto';

  const normalizedOptions: MarketFetchOptions = {
    startDate: normalizeDateOption(options?.startDate),
    endDate: normalizeDateOption(options?.endDate),
    forceRefresh: Boolean(options?.forceRefresh),
  };

  // 1. Primary path: Vercel serverless proxy (/api/market/ohlcv)
  const proxied = await fetchViaServerProxy(resolvedSymbol, timeframe, safeLimit, normalizedOptions);
  if (proxied) {
    return proxied;
  }

  // 2. Local Vite dev fallback for Crypto: direct public Binance klines API
  if (meta?.binanceSymbol) {
    const directCandles = await fetchDirectBinanceCandles(
      meta.binanceSymbol,
      timeframe,
      safeLimit,
      normalizedOptions,
    );
    if (directCandles) {
      return {
        symbol: resolvedSymbol,
        displayName,
        assetClass,
        timeframe,
        dataSource: 'live_binance',
        candles: directCandles,
        fetchedAt: new Date().toISOString(),
      };
    }
  }

  // 3. Honest offline fallback with deterministic historical sample bars
  const fallbackCandles = generateOfflineMarketCandles(resolvedSymbol, timeframe, safeLimit, {
    startDate: normalizedOptions.startDate,
    endDate: normalizedOptions.endDate,
  });
  const hasDateWindow = Boolean(normalizedOptions.startDate || normalizedOptions.endDate);
  return {
    symbol: resolvedSymbol,
    displayName,
    assetClass,
    timeframe,
    dataSource: 'offline_sample',
    candles: fallbackCandles,
    fetchedAt: new Date().toISOString(),
    note: hasDateWindow
      ? `Showing deterministic offline sample candles anchored to ${normalizedOptions.startDate ?? 'start'} – ${normalizedOptions.endDate ?? 'latest'}. Live feeds for Stocks, Forex, Indices, and Commodities activate automatically via /api/market/ohlcv on Vercel, or upload any TradingView CSV.`
      : 'Showing deterministic offline historical sample candles. Live market feeds for Stocks, Forex, Indices, and Commodities activate automatically via /api/market/ohlcv when deployed on Vercel, or upload any TradingView CSV.',
  };
}
