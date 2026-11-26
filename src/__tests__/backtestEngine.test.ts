import { describe, expect, it } from 'vitest';
import {
  calculatePositionSize,
  closePositionManually,
  computeBacktestMetrics,
  evaluateCandleAgainstPositions,
  movePositionToBreakeven,
  openBacktestPosition,
  parseOhlcvCsv,
} from '../lib/backtestEngine';
import { MARKET_SYMBOLS, generateOfflineMarketCandles } from '../data/marketCatalog';
import { MarketOhlcvQuerySchema, isAllowedServerFetchUrl } from '../../api/_lib/urlSecurity';
import type { CandlePoint } from '../types/academy';
import type { BacktestPosition } from '../types/backtest';

function candle(time: number, open: number, high: number, low: number, close: number): CandlePoint {
  return { time, open, high, low, close, volume: 1 };
}

function longPosition(overrides: Partial<BacktestPosition> = {}): BacktestPosition {
  const { position } = openBacktestPosition({
    direction: 'long',
    entryTime: 1000,
    entryPrice: 100,
    stopLoss: 99,
    takeProfit: 102,
    equity: 10000,
    riskPercent: 1,
    setupTag: 'Liquidity Sweep',
  });
  if (!position) throw new Error('fixture position failed');
  return { ...position, ...overrides };
}

describe('backtest engine — sizing and order validation', () => {
  it('sizes a position so the stop distance risks exactly 1R', () => {
    const sizing = calculatePositionSize(10000, 1, 100, 99);
    expect(sizing).toEqual({ riskAmount: 100, units: 100, stopDistance: 1 });
  });

  it('rejects zero stop distance and invalid equity', () => {
    expect(calculatePositionSize(10000, 1, 100, 100)).toBeNull();
    expect(calculatePositionSize(0, 1, 100, 99)).toBeNull();
  });

  it('rejects a long with the stop on the wrong side of entry', () => {
    const { position, error } = openBacktestPosition({
      direction: 'long',
      entryTime: 1,
      entryPrice: 100,
      stopLoss: 101,
      takeProfit: null,
      equity: 10000,
      riskPercent: 1,
    });
    expect(position).toBeNull();
    expect(error).toMatch(/below Entry/);
  });

  it('rejects a short with the target on the wrong side of entry', () => {
    const { position } = openBacktestPosition({
      direction: 'short',
      entryTime: 1,
      entryPrice: 100,
      stopLoss: 101,
      takeProfit: 102,
      equity: 10000,
      riskPercent: 1,
    });
    expect(position).toBeNull();
  });
});

describe('backtest engine — candle evaluation', () => {
  it('closes a long at take profit for +2R', () => {
    const { closedTrades, remainingPositions } = evaluateCandleAgainstPositions(
      candle(2000, 100, 102.5, 99.5, 102),
      [longPosition()],
    );
    expect(remainingPositions).toHaveLength(0);
    expect(closedTrades[0]).toMatchObject({
      exitReason: 'take_profit',
      outcome: 'win',
      rMultiple: 2,
      pnlAmount: 200,
    });
  });

  it('fills the stop first when SL and TP are both touched in one candle', () => {
    const { closedTrades } = evaluateCandleAgainstPositions(
      candle(2000, 100, 103, 98, 101),
      [longPosition()],
    );
    expect(closedTrades[0]).toMatchObject({ exitReason: 'stop_loss', outcome: 'loss', rMultiple: -1 });
  });

  it('keeps a position open when neither level is touched', () => {
    const { remainingPositions, closedTrades } = evaluateCandleAgainstPositions(
      candle(2000, 100, 101, 99.5, 100.5),
      [longPosition()],
    );
    expect(closedTrades).toHaveLength(0);
    expect(remainingPositions).toHaveLength(1);
  });

  it('treats a stop moved to breakeven as a breakeven exit', () => {
    const moved = movePositionToBreakeven(longPosition());
    const { closedTrades } = evaluateCandleAgainstPositions(candle(2000, 100, 101, 99.9, 100), [moved]);
    expect(closedTrades[0]).toMatchObject({ exitReason: 'breakeven', outcome: 'breakeven', rMultiple: 0 });
  });

  it('computes short profits when price falls to target', () => {
    const { position } = openBacktestPosition({
      direction: 'short',
      entryTime: 1000,
      entryPrice: 100,
      stopLoss: 101,
      takeProfit: 98,
      equity: 10000,
      riskPercent: 1,
    });
    const { closedTrades } = evaluateCandleAgainstPositions(
      candle(2000, 100, 100.5, 97.5, 98),
      [position as BacktestPosition],
    );
    expect(closedTrades[0]).toMatchObject({ outcome: 'win', rMultiple: 2 });
  });

  it('supports manual close at market', () => {
    const trade = closePositionManually(longPosition(), 100.5, 3000);
    expect(trade).toMatchObject({ exitReason: 'manual_close', outcome: 'win', rMultiple: 0.5 });
  });
});

describe('backtest engine — metrics', () => {
  it('aggregates win rate, profit factor, R and drawdown', () => {
    const win = evaluateCandleAgainstPositions(candle(2000, 100, 102.5, 99.5, 102), [longPosition()])
      .closedTrades[0];
    const loss = evaluateCandleAgainstPositions(candle(3000, 100, 100.2, 98.5, 99), [
      longPosition({ id: 'p2', entryTime: 2500 }),
    ]).closedTrades[0];

    const metrics = computeBacktestMetrics(10000, [win, loss]);
    expect(metrics.totalTrades).toBe(2);
    expect(metrics.wins).toBe(1);
    expect(metrics.losses).toBe(1);
    expect(metrics.winRate).toBe(50);
    expect(metrics.netPnlAmount).toBe(100);
    expect(metrics.profitFactor).toBe(2);
    expect(metrics.avgRMultiple).toBe(0.5);
    expect(metrics.maxDrawdownPct).toBeGreaterThan(0);
    expect(metrics.currentEquity).toBe(10100);
  });

  it('returns a flat equity state with no trades', () => {
    const metrics = computeBacktestMetrics(10000, []);
    expect(metrics.currentEquity).toBe(10000);
    expect(metrics.totalTrades).toBe(0);
  });
});

describe('CSV import', () => {
  it('parses a TradingView-style CSV with unix timestamps and sorts ascending', () => {
    const csv = [
      'time,open,high,low,close,volume',
      '1700000900,10,12,9,11,100',
      '1700000000,9,11,8,10,50',
    ].join('\n');
    const { candles, error } = parseOhlcvCsv(csv);
    expect(error).toBeUndefined();
    expect(candles.map((item) => item.time)).toEqual([1700000000, 1700000900]);
  });

  it('rejects rows that violate OHLC invariants', () => {
    const csv = ['time,open,high,low,close', '1700000000,10,9,8,10'].join('\n');
    const { candles, error } = parseOhlcvCsv(csv);
    expect(candles).toHaveLength(0);
    expect(error).toBeTruthy();
  });

  it('rejects CSV missing required columns', () => {
    expect(parseOhlcvCsv('a,b\n1,2').error).toMatch(/header/i);
  });
});

describe('market catalog and market proxy security', () => {
  it('covers every asset class', () => {
    const classes = new Set(MARKET_SYMBOLS.map((item) => item.assetClass));
    expect([...classes].sort()).toEqual(['commodities', 'crypto', 'forex', 'indices', 'stocks']);
  });

  it('generates deterministic, valid offline candles', () => {
    const first = generateOfflineMarketCandles('EUR/USD', '15m', 120);
    const second = generateOfflineMarketCandles('EUR/USD', '15m', 120);
    expect(first).toEqual(second);
    for (let i = 0; i < first.length; i += 1) {
      const bar = first[i];
      expect(bar.high).toBeGreaterThanOrEqual(Math.max(bar.open, bar.close));
      expect(bar.low).toBeLessThanOrEqual(Math.min(bar.open, bar.close));
      if (i > 0) expect(bar.time).toBeGreaterThan(first[i - 1].time);
    }
  });

  it('allows only the exact market data endpoints server-side', () => {
    expect(
      isAllowedServerFetchUrl('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=15m').allowed,
    ).toBe(true);
    expect(isAllowedServerFetchUrl('https://api.binance.com/api/v3/account').allowed).toBe(false);
    expect(isAllowedServerFetchUrl('https://api.twelvedata.com/time_series?symbol=AAPL').allowed).toBe(true);
    expect(isAllowedServerFetchUrl('https://api.twelvedata.com/api_usage').allowed).toBe(false);
    expect(isAllowedServerFetchUrl('https://query1.finance.yahoo.com/v8/finance/chart/AAPL').allowed).toBe(true);
    expect(isAllowedServerFetchUrl('https://query1.finance.yahoo.com/v7/finance/quote').allowed).toBe(false);
    expect(isAllowedServerFetchUrl('http://api.binance.com/api/v3/klines').allowed).toBe(false);
  });

  it('validates market query parameters', () => {
    expect(MarketOhlcvQuerySchema.safeParse({ symbol: 'BTCUSDT', timeframe: '1h' }).success).toBe(true);
    expect(
      MarketOhlcvQuerySchema.safeParse({
        symbol: 'BTCUSDT',
        timeframe: '1d',
        startDate: '2026-01-01',
        endDate: '2026-03-01',
        refresh: '1',
      }).success,
    ).toBe(true);
    expect(
      MarketOhlcvQuerySchema.safeParse({ symbol: 'BTCUSDT', startDate: '01-01-2026' }).success,
    ).toBe(false);
    expect(MarketOhlcvQuerySchema.safeParse({ symbol: '../etc', timeframe: '1h' }).success).toBe(false);
    expect(MarketOhlcvQuerySchema.safeParse({ symbol: 'AAPL', timeframe: '2m' }).success).toBe(false);
    expect(MarketOhlcvQuerySchema.safeParse({ symbol: 'AAPL', limit: 5000 }).success).toBe(false);
  });

  it('anchors offline candles to requested startDate and endDate', () => {
    const ranged = generateOfflineMarketCandles('BTCUSDT', '1d', 60, {
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });
    expect(ranged.length).toBeGreaterThanOrEqual(2);
    const startSec = Date.UTC(2026, 0, 1, 0, 0, 0) / 1000;
    const endSec = Date.UTC(2026, 0, 31, 23, 59, 59) / 1000;
    expect(ranged[0].time).toBeGreaterThanOrEqual(startSec);
    expect(ranged[ranged.length - 1].time).toBeLessThanOrEqual(endSec);
  });
});
