import type { CandlePoint } from '@/types/academy';
import type {
  BacktestDirection,
  BacktestMetrics,
  BacktestPosition,
  BacktestTrade,
  BacktestTradeOutcome,
  EquityPoint,
} from '@/types/backtest';

let positionSequence = 0;

function round2(value: number): number {
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function generatePositionId(entryTime: number, direction: BacktestDirection): string {
  positionSequence += 1;
  return `bt-${direction}-${entryTime}-${positionSequence}`;
}

function buildClosedTrade(
  position: BacktestPosition,
  exitPrice: number,
  exitTime: number,
  exitReason: BacktestTrade['exitReason'],
  notes = '',
): BacktestTrade {
  const priceDelta =
    position.direction === 'long'
      ? exitPrice - position.entryPrice
      : position.entryPrice - exitPrice;

  const rawPnl = priceDelta * position.units;
  const pnlAmount = round2(rawPnl);
  const rMultiple =
    position.riskAmount > 0
      ? round2(Math.round((pnlAmount / position.riskAmount) * 100) / 100)
      : 0;

  let outcome: BacktestTradeOutcome;
  if (exitReason === 'breakeven' || pnlAmount === 0) {
    outcome = 'breakeven';
  } else if (pnlAmount > 0) {
    outcome = 'win';
  } else {
    outcome = 'loss';
  }

  return {
    id: position.id,
    direction: position.direction,
    entryTime: position.entryTime,
    exitTime: Math.max(position.entryTime, exitTime),
    entryPrice: position.entryPrice,
    stopLoss: position.stopLoss,
    takeProfit: position.takeProfit,
    exitPrice,
    riskAmount: position.riskAmount,
    pnlAmount,
    rMultiple,
    outcome,
    exitReason,
    setupTag: position.setupTag,
    notes: notes.trim(),
  };
}

export function calculatePositionSize(
  equity: number,
  riskPercent: number,
  entryPrice: number,
  stopLoss: number,
): { riskAmount: number; units: number; stopDistance: number } | null {
  if (
    !Number.isFinite(equity) ||
    !Number.isFinite(riskPercent) ||
    !Number.isFinite(entryPrice) ||
    !Number.isFinite(stopLoss) ||
    equity <= 0 ||
    riskPercent <= 0 ||
    riskPercent > 100 ||
    entryPrice <= 0 ||
    stopLoss <= 0
  ) {
    return null;
  }

  const stopDistance = Math.abs(entryPrice - stopLoss);
  if (!Number.isFinite(stopDistance) || stopDistance <= 1e-10) {
    return null;
  }

  const riskAmount = round2(equity * (riskPercent / 100));
  if (riskAmount <= 0) {
    return null;
  }

  const units = riskAmount / stopDistance;
  if (!Number.isFinite(units) || units <= 0) {
    return null;
  }

  return {
    riskAmount,
    units,
    stopDistance,
  };
}

export function openBacktestPosition(input: {
  direction: BacktestDirection;
  entryTime: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number | null;
  equity: number;
  riskPercent: number;
  setupTag?: string;
}): { position: BacktestPosition | null; error?: string } {
  const { direction, entryTime, entryPrice, stopLoss, takeProfit, equity, riskPercent } = input;

  if (!Number.isFinite(entryTime) || entryTime <= 0) {
    return { position: null, error: 'Entry timestamp must be a valid positive time.' };
  }

  if (!Number.isFinite(entryPrice) || entryPrice <= 0) {
    return { position: null, error: 'Entry price must be a positive number.' };
  }

  if (!Number.isFinite(stopLoss) || stopLoss <= 0) {
    return { position: null, error: 'Stop Loss must be a positive number.' };
  }

  if (direction === 'long') {
    if (stopLoss >= entryPrice) {
      return {
        position: null,
        error: 'For a Long position, Stop Loss must be strictly below Entry Price.',
      };
    }
    if (takeProfit !== null && (!Number.isFinite(takeProfit) || takeProfit <= entryPrice)) {
      return {
        position: null,
        error: 'For a Long position, Take Profit must be strictly above Entry Price.',
      };
    }
  } else {
    if (stopLoss <= entryPrice) {
      return {
        position: null,
        error: 'For a Short position, Stop Loss must be strictly above Entry Price.',
      };
    }
    if (takeProfit !== null && (!Number.isFinite(takeProfit) || takeProfit >= entryPrice)) {
      return {
        position: null,
        error: 'For a Short position, Take Profit must be strictly below Entry Price.',
      };
    }
  }

  const sizing = calculatePositionSize(equity, riskPercent, entryPrice, stopLoss);
  if (!sizing) {
    return {
      position: null,
      error: 'Unable to calculate valid position size from equity, risk %, and Stop Loss distance.',
    };
  }

  const position: BacktestPosition = {
    id: generatePositionId(entryTime, direction),
    direction,
    entryTime,
    entryPrice,
    stopLoss,
    takeProfit,
    riskAmount: sizing.riskAmount,
    units: sizing.units,
    setupTag: (input.setupTag ?? '').trim(),
    movedToBreakeven: false,
  };

  return { position };
}

export function movePositionToBreakeven(position: BacktestPosition): BacktestPosition {
  return {
    ...position,
    stopLoss: position.entryPrice,
    movedToBreakeven: true,
  };
}

export function evaluateCandleAgainstPositions(
  candle: CandlePoint,
  openPositions: BacktestPosition[],
): { remainingPositions: BacktestPosition[]; closedTrades: BacktestTrade[] } {
  const remainingPositions: BacktestPosition[] = [];
  const closedTrades: BacktestTrade[] = [];

  for (const position of openPositions) {
    const isLong = position.direction === 'long';
    const slHit = isLong ? candle.low <= position.stopLoss : candle.high >= position.stopLoss;
    const tpHit =
      position.takeProfit !== null &&
      (isLong ? candle.high >= position.takeProfit : candle.low <= position.takeProfit);

    // Conservative tie-break: if both SL and TP are touched in the same candle, SL fills first
    if (slHit) {
      const isBreakevenStop =
        position.movedToBreakeven && Math.abs(position.stopLoss - position.entryPrice) <= 1e-9;
      closedTrades.push(
        buildClosedTrade(
          position,
          position.stopLoss,
          candle.time,
          isBreakevenStop ? 'breakeven' : 'stop_loss',
        ),
      );
      continue;
    }

    if (tpHit && position.takeProfit !== null) {
      closedTrades.push(
        buildClosedTrade(position, position.takeProfit, candle.time, 'take_profit'),
      );
      continue;
    }

    remainingPositions.push(position);
  }

  return { remainingPositions, closedTrades };
}

export function closePositionManually(
  position: BacktestPosition,
  exitPrice: number,
  exitTime: number,
  reason: 'manual_close' | 'end_of_data' = 'manual_close',
  notes = '',
): BacktestTrade {
  return buildClosedTrade(position, exitPrice, exitTime, reason, notes);
}

export function computeBacktestMetrics(
  startingBalance: number,
  trades: BacktestTrade[],
): BacktestMetrics {
  const safeStart = Number.isFinite(startingBalance) && startingBalance > 0 ? round2(startingBalance) : 0;
  const sortedTrades = [...trades].sort((a, b) => a.exitTime - b.exitTime);

  let equity = safeStart;
  let peakEquity = safeStart;
  let maxDrawdownPct = 0;
  let wins = 0;
  let losses = 0;
  let breakevens = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let rSum = 0;

  const equityCurve: EquityPoint[] = [];

  if (sortedTrades.length > 0) {
    const firstEntryTime = sortedTrades[0].entryTime;
    const firstExitTime = sortedTrades[0].exitTime;
    const initialTime = firstEntryTime < firstExitTime ? firstEntryTime : Math.max(1, firstExitTime - 1);
    equityCurve.push({ time: initialTime, equity: safeStart });
  }

  for (const trade of sortedTrades) {
    equity = round2(equity + trade.pnlAmount);

    if (equity > peakEquity) {
      peakEquity = equity;
    }

    if (peakEquity > 0) {
      const ddPct = ((peakEquity - equity) / peakEquity) * 100;
      if (ddPct > maxDrawdownPct) {
        maxDrawdownPct = ddPct;
      }
    }

    if (trade.outcome === 'win') {
      wins += 1;
    } else if (trade.outcome === 'loss') {
      losses += 1;
    } else {
      breakevens += 1;
    }

    if (trade.pnlAmount > 0) {
      grossProfit += trade.pnlAmount;
    } else if (trade.pnlAmount < 0) {
      grossLoss += Math.abs(trade.pnlAmount);
    }

    rSum += trade.rMultiple;

    const prevTime = equityCurve.length > 0 ? equityCurve[equityCurve.length - 1].time : 0;
    const pointTime = trade.exitTime > prevTime ? trade.exitTime : prevTime + 1;
    equityCurve.push({ time: pointTime, equity });
  }

  const totalTrades = sortedTrades.length;
  const netPnlAmount = round2(equity - safeStart);
  const netPnlPercent = safeStart > 0 ? round2((netPnlAmount / safeStart) * 100) : 0;
  const winRate = totalTrades > 0 ? round2((wins / totalTrades) * 100) : 0;
  const profitFactor =
    grossLoss > 0
      ? Math.min(999.99, round2(grossProfit / grossLoss))
      : grossProfit > 0
        ? 99.99
        : 0;
  const avgRMultiple = totalTrades > 0 ? round2(rSum / totalTrades) : 0;

  return {
    startingBalance: safeStart,
    currentEquity: equity,
    netPnlAmount,
    netPnlPercent,
    totalTrades,
    wins,
    losses,
    breakevens,
    winRate,
    profitFactor,
    avgRMultiple,
    maxDrawdownPct: round2(Math.max(0, maxDrawdownPct)),
    equityCurve,
  };
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  cells.push(current.trim());
  return cells;
}

function detectDelimiter(headerLine: string): string {
  const commaCount = (headerLine.match(/,/g) ?? []).length;
  const semiCount = (headerLine.match(/;/g) ?? []).length;
  const tabCount = (headerLine.match(/\t/g) ?? []).length;

  if (tabCount > commaCount && tabCount >= semiCount) {
    return '\t';
  }
  if (semiCount > commaCount) {
    return ';';
  }
  return ',';
}

function parseCsvTimestamp(rawValue: string): number | null {
  const trimmed = rawValue.replace(/^["']|["']$/g, '').trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const numeric = Number(trimmed);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return null;
    }
    // Unix milliseconds (> 1e12) vs Unix seconds
    return numeric > 1e12 ? Math.floor(numeric / 1000) : Math.floor(numeric);
  }

  const normalizedIso =
    trimmed.includes(' ') && !trimmed.includes('T') && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(trimmed)
      ? `${trimmed.replace(' ', 'T')}Z`
      : trimmed;

  const parsedMs = Date.parse(normalizedIso);
  if (!Number.isFinite(parsedMs) || parsedMs <= 0) {
    return null;
  }

  return Math.floor(parsedMs / 1000);
}

export function parseOhlcvCsv(csvText: string): { candles: CandlePoint[]; error?: string } {
  if (typeof csvText !== 'string' || !csvText.trim()) {
    return { candles: [], error: 'CSV input is empty.' };
  }

  const cleanedText = csvText.replace(/^\uFEFF/, '');
  const lines = cleanedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return {
      candles: [],
      error: 'CSV must include a header row and at least one OHLCV data row.',
    };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitCsvLine(lines[0], delimiter).map((col) =>
    col.replace(/^["']|["']$/g, '').trim().toLowerCase(),
  );

  const findColumn = (aliases: string[]): number =>
    headers.findIndex((h) => aliases.includes(h));

  const timeIdx = findColumn(['time', 'timestamp', 'date', 'datetime', 'unix']);
  const openIdx = findColumn(['open', 'o']);
  const highIdx = findColumn(['high', 'h']);
  const lowIdx = findColumn(['low', 'l']);
  const closeIdx = findColumn(['close', 'c']);
  const volumeIdx = findColumn(['volume', 'vol', 'v']);

  if (timeIdx < 0 || openIdx < 0 || highIdx < 0 || lowIdx < 0 || closeIdx < 0) {
    return {
      candles: [],
      error: 'CSV header must contain time, open, high, low, and close columns.',
    };
  }

  const byTime = new Map<number, CandlePoint>();
  let invalidOhlcCount = 0;

  for (let i = 1; i < lines.length; i += 1) {
    const cells = splitCsvLine(lines[i], delimiter);
    const time = parseCsvTimestamp(cells[timeIdx] ?? '');
    const open = Number(cells[openIdx]);
    const high = Number(cells[highIdx]);
    const low = Number(cells[lowIdx]);
    const close = Number(cells[closeIdx]);
    const rawVolume = volumeIdx >= 0 ? Number(cells[volumeIdx]) : 0;

    if (
      time === null ||
      !Number.isFinite(open) ||
      !Number.isFinite(high) ||
      !Number.isFinite(low) ||
      !Number.isFinite(close) ||
      open <= 0 ||
      high <= 0 ||
      low <= 0 ||
      close <= 0
    ) {
      invalidOhlcCount += 1;
      continue;
    }

    // Strict OHLC invariant validation
    if (high < low || high < Math.max(open, close) || low > Math.min(open, close)) {
      invalidOhlcCount += 1;
      continue;
    }

    byTime.set(time, {
      time,
      open,
      high,
      low,
      close,
      volume: Number.isFinite(rawVolume) && rawVolume >= 0 ? rawVolume : 0,
    });
  }

  const candles = Array.from(byTime.values()).sort((a, b) => a.time - b.time);

  if (candles.length === 0) {
    return {
      candles: [],
      error:
        invalidOhlcCount > 0
          ? 'No valid OHLCV candles found. Verify timestamps and ensure High >= Open/Close >= Low.'
          : 'No valid OHLCV rows were parsed from the CSV file.',
    };
  }

  return { candles };
}
