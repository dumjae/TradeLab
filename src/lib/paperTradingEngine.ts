import type { AssetClass } from '@/types/backtest';
import type {
  FeeSpreadProfile,
  PaperAccount,
  PaperDirection,
  PaperExitReason,
  PaperPortfolioMetrics,
  PaperPosition,
  PaperTrade,
  PaperTradeOutcome,
  PlacePaperOrderInput,
} from '@/types/paper-trading';

const GENERIC_DEFAULT_FEE_BPS = 5;
const GENERIC_DEFAULT_SPREAD_BPS = 2;

export const DEFAULT_FEE_SPREAD_BY_ASSET: Record<AssetClass, FeeSpreadProfile> = {
  crypto: { feeRateBps: 5, spreadBps: 2 },
  forex: { feeRateBps: 1, spreadBps: 1.5 },
  indices: { feeRateBps: 2, spreadBps: 2 },
  stocks: { feeRateBps: 1, spreadBps: 1.5 },
  commodities: { feeRateBps: 2, spreadBps: 2.5 },
  custom_csv: { feeRateBps: 2, spreadBps: 2 },
};

export interface OrderPreviewResult {
  valid: boolean;
  error?: string;
  rawQuotePrice: number;
  entryPrice: number;
  stopDistance: number;
  riskAmount: number;
  units: number;
  notionalValue: number;
  feeRateBps: number;
  spreadBps: number;
  entryFee: number;
  estimatedExitFee: number;
  estimatedTotalFees: number;
  entrySpreadCost: number;
  estimatedExitSpreadCost: number;
  estimatedSpreadCost: number;
  estimatedTotalCost: number;
  rewardAmount: number | null;
  rrRatio: number | null;
}

export interface UnrealizedPnlResult {
  grossPnl: number;
  estimatedCloseFee: number;
  estimatedCloseSpread: number;
  netPnl: number;
  rMultiple: number;
}

export interface BarEvaluationResult {
  action: 'none' | 'filled' | 'closed';
  updatedPosition?: PaperPosition;
  closedTrade?: Omit<PaperTrade, 'id' | 'syncedToJournal'>;
}

function round2(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function round6(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function deriveTradeOutcome(pnlAmount: number): PaperTradeOutcome {
  if (pnlAmount > 0) {
    return 'win';
  }
  if (pnlAmount < 0) {
    return 'loss';
  }
  return 'breakeven';
}

export function getEffectiveFeeSpread(
  account: PaperAccount,
  assetClass: AssetClass,
): FeeSpreadProfile {
  if (!account.simulateFeesSpread) {
    return { feeRateBps: 0, spreadBps: 0 };
  }

  const assetDefault =
    DEFAULT_FEE_SPREAD_BY_ASSET[assetClass] ?? DEFAULT_FEE_SPREAD_BY_ASSET.crypto;

  const hasValidWalletFee =
    Number.isFinite(account.feeRateBps) && account.feeRateBps >= 0;
  const hasValidWalletSpread =
    Number.isFinite(account.spreadBps) && account.spreadBps >= 0;

  if (!hasValidWalletFee || !hasValidWalletSpread) {
    return { ...assetDefault };
  }

  const matchesGenericDefault =
    account.feeRateBps === GENERIC_DEFAULT_FEE_BPS &&
    account.spreadBps === GENERIC_DEFAULT_SPREAD_BPS;

  if (account.marketFocus === 'all' && matchesGenericDefault) {
    return { ...assetDefault };
  }

  return {
    feeRateBps: account.feeRateBps,
    spreadBps: account.spreadBps,
  };
}

export function applyEntrySpread(
  rawPrice: number,
  direction: PaperDirection,
  spreadBps: number,
): { fillPrice: number; halfSpreadPerUnit: number } {
  const safePrice = Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0;
  const safeSpreadBps =
    Number.isFinite(spreadBps) && spreadBps > 0 ? spreadBps : 0;
  const halfSpreadPerUnit = safePrice * (safeSpreadBps / 20_000);

  if (direction === 'long') {
    return {
      fillPrice: round6(safePrice + halfSpreadPerUnit),
      halfSpreadPerUnit,
    };
  }

  return {
    fillPrice: round6(Math.max(1e-6, safePrice - halfSpreadPerUnit)),
    halfSpreadPerUnit,
  };
}

export function applyExitSpread(
  rawPrice: number,
  direction: PaperDirection,
  spreadBps: number,
): { exitPrice: number; halfSpreadPerUnit: number } {
  const safePrice = Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0;
  const safeSpreadBps =
    Number.isFinite(spreadBps) && spreadBps > 0 ? spreadBps : 0;
  const halfSpreadPerUnit = safePrice * (safeSpreadBps / 20_000);

  if (direction === 'long') {
    return {
      exitPrice: round6(Math.max(1e-6, safePrice - halfSpreadPerUnit)),
      halfSpreadPerUnit,
    };
  }

  return {
    exitPrice: round6(safePrice + halfSpreadPerUnit),
    halfSpreadPerUnit,
  };
}

function emptyInvalidPreview(error: string): OrderPreviewResult {
  return {
    valid: false,
    error,
    rawQuotePrice: 0,
    entryPrice: 0,
    stopDistance: 0,
    riskAmount: 0,
    units: 0,
    notionalValue: 0,
    feeRateBps: 0,
    spreadBps: 0,
    entryFee: 0,
    estimatedExitFee: 0,
    estimatedTotalFees: 0,
    entrySpreadCost: 0,
    estimatedExitSpreadCost: 0,
    estimatedSpreadCost: 0,
    estimatedTotalCost: 0,
    rewardAmount: null,
    rrRatio: null,
  };
}

export function calculateOrderPreview(
  account: PaperAccount,
  input: Omit<PlacePaperOrderInput, 'accountId'>,
): OrderPreviewResult {
  if (!Number.isFinite(account.cashBalance) || account.cashBalance <= 0) {
    return emptyInvalidPreview('Demo wallet cash balance must be greater than zero.');
  }

  if (
    !Number.isFinite(input.riskPercent) ||
    input.riskPercent <= 0 ||
    input.riskPercent > 100
  ) {
    return emptyInvalidPreview('Risk percent must be between 0.01% and 100%.');
  }

  const rawQuotePrice =
    input.orderType === 'limit' ? input.limitPrice : input.currentMarketPrice;

  if (
    rawQuotePrice === undefined ||
    !Number.isFinite(rawQuotePrice) ||
    rawQuotePrice <= 0
  ) {
    return emptyInvalidPreview(
      input.orderType === 'limit'
        ? 'Limit entry price must be a positive number.'
        : 'Current market price must be a positive number.',
    );
  }

  if (!Number.isFinite(input.stopLoss) || input.stopLoss <= 0) {
    return emptyInvalidPreview('Stop Loss (SL) must be a positive price.');
  }

  const profile = getEffectiveFeeSpread(account, input.assetClass);
  const { fillPrice: entryPrice, halfSpreadPerUnit: entryHalfSpread } =
    applyEntrySpread(rawQuotePrice, input.direction, profile.spreadBps);

  if (input.direction === 'long') {
    if (input.stopLoss >= entryPrice || input.stopLoss >= rawQuotePrice) {
      return emptyInvalidPreview(
        'For a Long trade, Stop Loss (SL) must be below Entry Price.',
      );
    }
    if (
      input.takeProfit !== null &&
      (!Number.isFinite(input.takeProfit) || input.takeProfit <= entryPrice)
    ) {
      return emptyInvalidPreview(
        'For a Long trade, Take Profit (TP) must be above Entry Price.',
      );
    }
  } else {
    if (input.stopLoss <= entryPrice || input.stopLoss <= rawQuotePrice) {
      return emptyInvalidPreview(
        'For a Short trade, Stop Loss (SL) must be above Entry Price.',
      );
    }
    if (
      input.takeProfit !== null &&
      (!Number.isFinite(input.takeProfit) || input.takeProfit >= entryPrice)
    ) {
      return emptyInvalidPreview(
        'For a Short trade, Take Profit (TP) must be below Entry Price.',
      );
    }
  }

  const stopDistance = Math.abs(entryPrice - input.stopLoss);
  if (!Number.isFinite(stopDistance) || stopDistance <= 1e-10) {
    return emptyInvalidPreview('Stop Loss distance is too small to calculate position size.');
  }

  const riskAmount = round2(account.cashBalance * (input.riskPercent / 100));
  if (riskAmount <= 0) {
    return emptyInvalidPreview('Risk amount must be greater than $0.00.');
  }

  const units = round6(riskAmount / stopDistance);
  if (!Number.isFinite(units) || units <= 0) {
    return emptyInvalidPreview('Calculated position size is invalid.');
  }

  const notionalValue = round2(entryPrice * units);
  const feeRate = profile.feeRateBps / 10_000;
  const entryFee = round2(notionalValue * feeRate);

  const exitQuoteRef =
    input.takeProfit !== null ? input.takeProfit : rawQuotePrice;
  const { exitPrice: estimatedExitPrice, halfSpreadPerUnit: exitHalfSpread } =
    applyExitSpread(exitQuoteRef, input.direction, profile.spreadBps);

  const estimatedExitFee = round2(estimatedExitPrice * units * feeRate);
  const estimatedTotalFees = round2(entryFee + estimatedExitFee);
  const entrySpreadCost = round2(entryHalfSpread * units);
  const estimatedExitSpreadCost = round2(exitHalfSpread * units);
  const estimatedSpreadCost = round2(entrySpreadCost + estimatedExitSpreadCost);
  const estimatedTotalCost = round2(estimatedTotalFees + estimatedSpreadCost);

  let rewardAmount: number | null = null;
  let rrRatio: number | null = null;
  if (input.takeProfit !== null) {
    const rewardDistance = Math.abs(input.takeProfit - entryPrice);
    rewardAmount = round2(rewardDistance * units);
    rrRatio = stopDistance > 0 ? round2(rewardDistance / stopDistance) : null;
  }

  return {
    valid: true,
    rawQuotePrice: round6(rawQuotePrice),
    entryPrice,
    stopDistance: round6(stopDistance),
    riskAmount,
    units,
    notionalValue,
    feeRateBps: profile.feeRateBps,
    spreadBps: profile.spreadBps,
    entryFee,
    estimatedExitFee,
    estimatedTotalFees,
    entrySpreadCost,
    estimatedExitSpreadCost,
    estimatedSpreadCost,
    estimatedTotalCost,
    rewardAmount,
    rrRatio,
  };
}

export function calculateUnrealizedPnl(
  position: PaperPosition,
  currentPrice: number,
  account: PaperAccount,
): UnrealizedPnlResult {
  if (
    position.status !== 'open' ||
    !Number.isFinite(currentPrice) ||
    currentPrice <= 0
  ) {
    return {
      grossPnl: 0,
      estimatedCloseFee: 0,
      estimatedCloseSpread: 0,
      netPnl: 0,
      rMultiple: 0,
    };
  }

  const directionSign = position.direction === 'long' ? 1 : -1;
  const rawEntryQuote =
    position.rawQuotePrice > 0 ? position.rawQuotePrice : position.entryPrice;
  const profile = getEffectiveFeeSpread(account, position.assetClass);
  const { exitPrice, halfSpreadPerUnit } = applyExitSpread(
    currentPrice,
    position.direction,
    profile.spreadBps,
  );

  const grossPnl = round2(
    directionSign * (currentPrice - rawEntryQuote) * position.units,
  );
  const estimatedCloseFee = round2(
    exitPrice * position.units * (profile.feeRateBps / 10_000),
  );
  const estimatedCloseSpread = round2(halfSpreadPerUnit * position.units);

  const totalFees = round2(Math.max(0, position.entryFee) + estimatedCloseFee);
  const totalSpread = round2(
    Math.max(0, position.entrySpreadCost) + estimatedCloseSpread,
  );
  const netPnl = round2(grossPnl - totalFees - totalSpread);
  const rMultiple =
    position.riskAmount > 0 ? round2(netPnl / position.riskAmount) : 0;

  return {
    grossPnl,
    estimatedCloseFee,
    estimatedCloseSpread,
    netPnl,
    rMultiple,
  };
}

export function closePaperPositionCalculation(
  position: PaperPosition,
  exitQuotePrice: number,
  exitReason: PaperExitReason,
  account: PaperAccount,
  closedAt?: string,
): Omit<PaperTrade, 'id' | 'syncedToJournal'> {
  const safeExitQuote =
    Number.isFinite(exitQuotePrice) && exitQuotePrice > 0
      ? exitQuotePrice
      : position.entryPrice;
  const directionSign = position.direction === 'long' ? 1 : -1;
  const rawEntryQuote =
    position.rawQuotePrice > 0 ? position.rawQuotePrice : position.entryPrice;

  const profile = getEffectiveFeeSpread(account, position.assetClass);
  const { exitPrice, halfSpreadPerUnit: exitHalfSpread } = applyExitSpread(
    safeExitQuote,
    position.direction,
    profile.spreadBps,
  );

  const entryFee = round2(Math.max(0, position.entryFee));
  const exitFee = round2(
    exitPrice * position.units * (profile.feeRateBps / 10_000),
  );
  const feeAmount = round2(entryFee + exitFee);

  const entrySpreadCost = round2(Math.max(0, position.entrySpreadCost));
  const exitSpreadCost = round2(exitHalfSpread * position.units);
  const spreadCost = round2(entrySpreadCost + exitSpreadCost);

  const grossPnl = round2(
    directionSign * (safeExitQuote - rawEntryQuote) * position.units,
  );
  const pnlAmount = round2(grossPnl - feeAmount - spreadCost);
  const rMultiple =
    position.riskAmount > 0 ? round2(pnlAmount / position.riskAmount) : 0;
  const outcome = deriveTradeOutcome(pnlAmount);

  return {
    accountId: position.accountId,
    userId: position.userId,
    symbol: position.symbol,
    assetClass: position.assetClass,
    direction: position.direction,
    entryPrice: position.entryPrice,
    exitPrice,
    stopLoss: position.stopLoss,
    takeProfit: position.takeProfit,
    units: position.units,
    riskAmount: position.riskAmount,
    grossPnl,
    feeAmount,
    spreadCost,
    pnlAmount,
    rMultiple,
    outcome,
    exitReason,
    setupTag: position.setupTag,
    openedAt: position.openedAt,
    closedAt: closedAt ?? new Date().toISOString(),
  };
}

export function evaluatePositionAgainstBar(
  position: PaperPosition,
  bar: { high: number; low: number; close: number },
  account: PaperAccount,
): BarEvaluationResult {
  if (
    !Number.isFinite(bar.high) ||
    !Number.isFinite(bar.low) ||
    !Number.isFinite(bar.close) ||
    bar.high <= 0 ||
    bar.low <= 0 ||
    bar.close <= 0
  ) {
    return { action: 'none' };
  }

  const barHigh = Math.max(bar.high, bar.low, bar.close);
  const barLow = Math.min(bar.high, bar.low, bar.close);
  const nowIso = new Date().toISOString();

  if (position.status === 'pending') {
    const limitTouched =
      barLow <= position.entryPrice && position.entryPrice <= barHigh;
    if (!limitTouched) {
      return { action: 'none' };
    }

    const filledPosition: PaperPosition = {
      ...position,
      status: 'open',
      openedAt: nowIso,
      updatedAt: nowIso,
    };

    return {
      action: 'filled',
      updatedPosition: filledPosition,
    };
  }

  const isLong = position.direction === 'long';
  const slHit = isLong
    ? barLow <= position.stopLoss
    : barHigh >= position.stopLoss;
  const tpHit =
    position.takeProfit !== null &&
    (isLong ? barHigh >= position.takeProfit : barLow <= position.takeProfit);

  // Conservative tie-break: if both SL and TP are hit inside one bar, SL fills first
  if (slHit) {
    const isBreakevenStop =
      position.movedToBreakeven &&
      Math.abs(position.stopLoss - position.entryPrice) <= 1e-6;
    const closedTrade = closePaperPositionCalculation(
      position,
      position.stopLoss,
      isBreakevenStop ? 'breakeven' : 'stop_loss',
      account,
      nowIso,
    );
    return { action: 'closed', closedTrade };
  }

  if (tpHit && position.takeProfit !== null) {
    const closedTrade = closePaperPositionCalculation(
      position,
      position.takeProfit,
      'take_profit',
      account,
      nowIso,
    );
    return { action: 'closed', closedTrade };
  }

  return { action: 'none' };
}

export function computePaperPortfolioMetrics(
  account: PaperAccount,
  openPositions: PaperPosition[],
  trades: PaperTrade[],
  priceMap: Record<string, number>,
  nowIso?: string,
): PaperPortfolioMetrics {
  const cashBalance = round2(account.cashBalance);

  let unrealizedPnl = 0;
  for (const position of openPositions) {
    if (position.status !== 'open') {
      continue;
    }
    const markPrice = priceMap[position.symbol] ?? position.entryPrice;
    const floating = calculateUnrealizedPnl(position, markPrice, account);
    unrealizedPnl += floating.netPnl;
  }
  unrealizedPnl = round2(unrealizedPnl);

  const equity = round2(cashBalance + unrealizedPnl);
  const realizedPnl = round2(
    trades.reduce((sum, trade) => sum + (Number.isFinite(trade.pnlAmount) ? trade.pnlAmount : 0), 0),
  );
  const totalReturnPct =
    account.startingBalance > 0
      ? round2(((equity - account.startingBalance) / account.startingBalance) * 100)
      : 0;

  const todayKey = (nowIso ?? new Date().toISOString()).slice(0, 10);
  const todayRealizedPnl = round2(
    trades
      .filter((trade) => trade.closedAt.slice(0, 10) === todayKey)
      .reduce((sum, trade) => sum + (Number.isFinite(trade.pnlAmount) ? trade.pnlAmount : 0), 0),
  );

  const startOfDayEquity = cashBalance - todayRealizedPnl;
  const dailyLossBase =
    startOfDayEquity > 0 ? startOfDayEquity : account.startingBalance;
  const todayLossPct =
    todayRealizedPnl < 0 && dailyLossBase > 0
      ? round2((Math.abs(todayRealizedPnl) / dailyLossBase) * 100)
      : 0;
  const dailyLossLimitReached =
    account.dailyLossLimitPct > 0 && todayLossPct >= account.dailyLossLimitPct;

  const totalTrades = trades.length;
  const wins = trades.filter((trade) => trade.outcome === 'win').length;
  const winRatePct = totalTrades > 0 ? round2((wins / totalTrades) * 100) : 0;
  const totalFeesPaid = round2(
    trades.reduce((sum, trade) => sum + (Number.isFinite(trade.feeAmount) ? trade.feeAmount : 0), 0),
  );
  const totalSpreadPaid = round2(
    trades.reduce((sum, trade) => sum + (Number.isFinite(trade.spreadCost) ? trade.spreadCost : 0), 0),
  );

  return {
    equity,
    cashBalance,
    unrealizedPnl,
    realizedPnl,
    totalReturnPct,
    todayRealizedPnl,
    todayLossPct,
    dailyLossLimitReached,
    totalTrades,
    winRatePct,
    totalFeesPaid,
    totalSpreadPaid,
  };
}
