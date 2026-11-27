import type { CandlePoint, ChartPriceLine } from '../types/academy';

export type DrawingToolMode =
  | 'crosshair'
  | 'hline'
  | 'session_hl'
  | 'long_tool'
  | 'short_tool';

export interface UserHorizontalLine {
  id: string;
  price: number;
  label: string;
}

export interface QuickPositionSetup {
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
}

const TV_BLUE_HEX = '#2962ff';
const TV_AMBER_HEX = '#ff9800';
const DEFAULT_STOP_PCT = 0.012;
const MIN_STOP_PCT = 0.004;
const MAX_STOP_PCT = 0.025;
const ATR_LOOKBACK = 14;
const ATR_MULTIPLIER = 1.5;
const REWARD_TO_RISK_RATIO = 2;

function clampDecimals(decimals: number): number {
  if (!Number.isFinite(decimals)) {
    return 2;
  }
  return Math.max(0, Math.min(8, Math.trunc(decimals)));
}

export function roundChartPrice(price: number, decimals: number): number {
  if (!Number.isFinite(price)) {
    return 0;
  }
  const safeDecimals = clampDecimals(decimals);
  const factor = 10 ** safeDecimals;
  return Math.round(price * factor) / factor;
}

export function buildHorizontalPriceLine(
  line: UserHorizontalLine,
  decimals: number,
): ChartPriceLine {
  const safeLabel = line.label.trim() || 'H-Line';
  return {
    id: line.id,
    price: roundChartPrice(line.price, decimals),
    title: safeLabel,
    color: TV_BLUE_HEX,
    lineStyle: 'dashed',
    role: 'support_resistance',
  };
}

export function computeSessionHighLowLines(
  candles: CandlePoint[],
  decimals: number,
  lookback = 48,
): ChartPriceLine[] {
  if (candles.length === 0) {
    return [];
  }

  const safeLookback = Math.max(1, Math.trunc(lookback));
  const slice = candles.slice(-safeLookback);

  let sessionHigh = slice[0].high;
  let sessionLow = slice[0].low;

  for (let index = 1; index < slice.length; index += 1) {
    const candle = slice[index];
    if (candle.high > sessionHigh) {
      sessionHigh = candle.high;
    }
    if (candle.low < sessionLow) {
      sessionLow = candle.low;
    }
  }

  return [
    {
      id: 'tv-session-high',
      price: roundChartPrice(sessionHigh, decimals),
      title: 'Session High',
      color: TV_AMBER_HEX,
      lineStyle: 'dotted',
      role: 'buy_side_liquidity',
    },
    {
      id: 'tv-session-low',
      price: roundChartPrice(sessionLow, decimals),
      title: 'Session Low',
      color: TV_AMBER_HEX,
      lineStyle: 'dotted',
      role: 'sell_side_liquidity',
    },
  ];
}

function estimateAtrStopDistance(currentPrice: number, candles: CandlePoint[]): number {
  if (candles.length === 0) {
    return currentPrice * DEFAULT_STOP_PCT;
  }

  const recent = candles.slice(-ATR_LOOKBACK);
  let totalRange = 0;
  for (const candle of recent) {
    totalRange += Math.max(0, candle.high - candle.low);
  }

  const avgRange = totalRange / recent.length;
  if (avgRange <= 0) {
    return currentPrice * DEFAULT_STOP_PCT;
  }

  return avgRange * ATR_MULTIPLIER;
}

export function computeQuickPositionSetup(
  direction: 'long' | 'short',
  currentPrice: number,
  candles: CandlePoint[],
  decimals: number,
): QuickPositionSetup {
  const safeDecimals = clampDecimals(decimals);
  const entryPrice = roundChartPrice(currentPrice, safeDecimals);

  if (entryPrice <= 0) {
    return {
      direction,
      entryPrice: 0,
      stopLoss: 0,
      takeProfit: 0,
    };
  }

  const rawDistance = estimateAtrStopDistance(entryPrice, candles);
  const minDistance = entryPrice * MIN_STOP_PCT;
  const maxDistance = entryPrice * MAX_STOP_PCT;
  const clampedDistance = Math.min(maxDistance, Math.max(minDistance, rawDistance));

  const minTick = 10 ** -safeDecimals;
  const stopDistance = Math.max(roundChartPrice(clampedDistance, safeDecimals), minTick);

  if (direction === 'long') {
    const stopLoss = roundChartPrice(Math.max(minTick, entryPrice - stopDistance), safeDecimals);
    const actualRisk = Math.abs(entryPrice - stopLoss);
    const takeProfit = roundChartPrice(entryPrice + actualRisk * REWARD_TO_RISK_RATIO, safeDecimals);
    return {
      direction,
      entryPrice,
      stopLoss,
      takeProfit,
    };
  }

  const stopLoss = roundChartPrice(entryPrice + stopDistance, safeDecimals);
  const actualRisk = Math.abs(stopLoss - entryPrice);
  const takeProfit = roundChartPrice(
    Math.max(minTick, entryPrice - actualRisk * REWARD_TO_RISK_RATIO),
    safeDecimals,
  );

  return {
    direction,
    entryPrice,
    stopLoss,
    takeProfit,
  };
}
