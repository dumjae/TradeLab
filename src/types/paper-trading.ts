import type { AssetClass } from './backtest';

export type PaperWalletMarketFocus = 'all' | AssetClass;

export type PaperDirection = 'long' | 'short';

export type PaperOrderType = 'market' | 'limit';

export type PaperPositionStatus = 'pending' | 'open';

export type PaperTradeOutcome = 'win' | 'loss' | 'breakeven';

export type PaperExitReason = 'take_profit' | 'stop_loss' | 'breakeven' | 'manual_close';

export interface FeeSpreadProfile {
  feeRateBps: number;
  spreadBps: number;
}

export interface PaperAccount {
  id: string;
  userId: string;
  accountName: string;
  marketFocus: PaperWalletMarketFocus;
  startingBalance: number;
  cashBalance: number;
  dailyLossLimitPct: number;
  maxRiskPerTradePct: number;
  simulateFeesSpread: boolean;
  feeRateBps: number;
  spreadBps: number;
  resetCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaperAccountInput {
  accountName: string;
  marketFocus: PaperWalletMarketFocus;
  startingBalance: number;
  dailyLossLimitPct?: number;
  maxRiskPerTradePct?: number;
  simulateFeesSpread?: boolean;
  feeRateBps?: number;
  spreadBps?: number;
}

export interface UpdatePaperAccountInput {
  accountName?: string;
  marketFocus?: PaperWalletMarketFocus;
  dailyLossLimitPct?: number;
  maxRiskPerTradePct?: number;
  simulateFeesSpread?: boolean;
  feeRateBps?: number;
  spreadBps?: number;
}

export interface PaperPosition {
  id: string;
  accountId: string;
  userId: string;
  symbol: string;
  assetClass: AssetClass;
  direction: PaperDirection;
  orderType: PaperOrderType;
  status: PaperPositionStatus;
  entryPrice: number;
  rawQuotePrice: number;
  stopLoss: number;
  takeProfit: number | null;
  units: number;
  riskAmount: number;
  entryFee: number;
  entrySpreadCost: number;
  setupTag: string;
  movedToBreakeven: boolean;
  openedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaperTrade {
  id: string;
  accountId: string;
  userId: string;
  symbol: string;
  assetClass: AssetClass;
  direction: PaperDirection;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number | null;
  units: number;
  riskAmount: number;
  grossPnl: number;
  feeAmount: number;
  spreadCost: number;
  pnlAmount: number;
  rMultiple: number;
  outcome: PaperTradeOutcome;
  exitReason: PaperExitReason;
  setupTag: string;
  syncedToJournal: boolean;
  openedAt: string;
  closedAt: string;
}

export interface PlacePaperOrderInput {
  accountId: string;
  symbol: string;
  assetClass: AssetClass;
  direction: PaperDirection;
  orderType: PaperOrderType;
  currentMarketPrice: number;
  limitPrice?: number;
  stopLoss: number;
  takeProfit: number | null;
  riskPercent: number;
  setupTag?: string;
}

export interface PaperPortfolioMetrics {
  equity: number;
  cashBalance: number;
  unrealizedPnl: number;
  realizedPnl: number;
  totalReturnPct: number;
  todayRealizedPnl: number;
  todayLossPct: number;
  dailyLossLimitReached: boolean;
  totalTrades: number;
  winRatePct: number;
  totalFeesPaid: number;
  totalSpreadPaid: number;
}

export interface LiveMarketQuote {
  symbol: string;
  price: number;
  source: 'binance_live' | 'market_api_live' | 'offline_practice';
  fetchedAt: string;
}
