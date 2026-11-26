import type { CandlePoint } from './academy';

export type AssetClass =
  | 'crypto'
  | 'forex'
  | 'indices'
  | 'stocks'
  | 'commodities'
  | 'custom_csv';

export type MarketTimeframe = '5m' | '15m' | '1h' | '4h' | '1d';

export type MarketDataSource =
  | 'live_binance'
  | 'live_twelvedata'
  | 'live_yahoo'
  | 'uploaded_csv'
  | 'offline_sample';

export interface MarketSymbolOption {
  symbol: string;
  displayName: string;
  assetClass: Exclude<AssetClass, 'custom_csv'>;
  binanceSymbol?: string;
  twelveDataSymbol?: string;
  yahooSymbol?: string;
  basePrice: number;
  pipStep: number;
  decimals: number;
  volatilityPct: number;
}

export type BacktestDirection = 'long' | 'short';

export type BacktestTradeOutcome = 'win' | 'loss' | 'breakeven';

export interface BacktestPosition {
  id: string;
  direction: BacktestDirection;
  entryTime: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number | null;
  riskAmount: number;
  units: number;
  setupTag: string;
  movedToBreakeven: boolean;
}

export interface BacktestTrade {
  id: string;
  direction: BacktestDirection;
  entryTime: number;
  exitTime: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number | null;
  exitPrice: number;
  riskAmount: number;
  pnlAmount: number;
  rMultiple: number;
  outcome: BacktestTradeOutcome;
  exitReason: 'take_profit' | 'stop_loss' | 'breakeven' | 'manual_close' | 'end_of_data';
  setupTag: string;
  notes: string;
}

export interface EquityPoint {
  time: number;
  equity: number;
}

export interface BacktestMetrics {
  startingBalance: number;
  currentEquity: number;
  netPnlAmount: number;
  netPnlPercent: number;
  totalTrades: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number;
  profitFactor: number;
  avgRMultiple: number;
  maxDrawdownPct: number;
  equityCurve: EquityPoint[];
}

export interface BacktestSession {
  id: string;
  userId: string;
  symbol: string;
  assetClass: AssetClass;
  timeframe: MarketTimeframe;
  dataSource: MarketDataSource;
  startingBalance: number;
  endingBalance: number;
  riskPercent: number;
  metrics: BacktestMetrics;
  trades: BacktestTrade[];
  notes: string;
  createdAt: string;
}

export interface MarketCandlesResponse {
  symbol: string;
  displayName: string;
  assetClass: AssetClass;
  timeframe: MarketTimeframe;
  dataSource: MarketDataSource;
  candles: CandlePoint[];
  fetchedAt: string;
  note?: string;
}
