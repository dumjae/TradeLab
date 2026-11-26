import type {
  AssetClass,
  BacktestMetrics,
  BacktestSession,
  BacktestTrade,
  MarketDataSource,
  MarketTimeframe,
} from '@/types/backtest';
import { computeBacktestMetrics } from '@/lib/backtestEngine';
import {
  getActiveUserId,
  getAuthenticatedSupabaseUserId,
  isSupabaseConfigured,
  supabase,
} from '@/lib/supabase';

const LOCAL_BACKTEST_SESSIONS_KEY = 'tradelab_backtest_sessions_v1';
const MAX_STORED_SESSIONS = 50;

interface DbBacktestSessionRow {
  id: string;
  user_id: string;
  symbol: string;
  asset_class: AssetClass;
  timeframe: MarketTimeframe;
  data_source: MarketDataSource;
  starting_balance: number | string;
  ending_balance: number | string;
  risk_percent: number | string;
  total_trades: number;
  win_rate: number | string;
  profit_factor: number | string;
  avg_r_multiple: number | string;
  max_drawdown_pct: number | string;
  notes: string;
  created_at: string;
}

interface DbBacktestTradeRow {
  id: string;
  session_id: string;
  user_id: string;
  direction: BacktestTrade['direction'];
  entry_time: number | string;
  exit_time: number | string;
  entry_price: number | string;
  stop_loss: number | string;
  take_profit: number | string | null;
  exit_price: number | string;
  risk_amount: number | string;
  pnl_amount: number | string;
  r_multiple: number | string;
  outcome: BacktestTrade['outcome'];
  setup_tag: string;
  notes: string;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function readLocalSessions(): BacktestSession[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_BACKTEST_SESSIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BacktestSession[]) : [];
  } catch {
    return [];
  }
}

function writeLocalSessions(sessions: BacktestSession[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      LOCAL_BACKTEST_SESSIONS_KEY,
      JSON.stringify(sessions.slice(0, MAX_STORED_SESSIONS)),
    );
  } catch {
    // Ignore storage quota errors
  }
}

function inferExitReason(
  outcome: BacktestTrade['outcome'],
  exitPrice: number,
  stopLoss: number,
  takeProfit: number | null,
): BacktestTrade['exitReason'] {
  if (outcome === 'breakeven') {
    return 'breakeven';
  }
  const tpTolerance = takeProfit !== null ? Math.max(1e-5, Math.abs(takeProfit) * 1e-5) : 0;
  if (takeProfit !== null && Math.abs(exitPrice - takeProfit) <= tpTolerance) {
    return 'take_profit';
  }
  const slTolerance = Math.max(1e-5, Math.abs(stopLoss) * 1e-5);
  if (Math.abs(exitPrice - stopLoss) <= slTolerance) {
    return 'stop_loss';
  }
  return 'manual_close';
}

function mapDbTradeRow(row: DbBacktestTradeRow): BacktestTrade {
  const entryPrice = Number(row.entry_price);
  const stopLoss = Number(row.stop_loss);
  const takeProfit = row.take_profit !== null ? Number(row.take_profit) : null;
  const exitPrice = Number(row.exit_price);

  return {
    id: row.id,
    direction: row.direction,
    entryTime: Number(row.entry_time),
    exitTime: Number(row.exit_time),
    entryPrice,
    stopLoss,
    takeProfit,
    exitPrice,
    riskAmount: Number(row.risk_amount),
    pnlAmount: Number(row.pnl_amount),
    rMultiple: Number(row.r_multiple),
    outcome: row.outcome,
    exitReason: inferExitReason(row.outcome, exitPrice, stopLoss, takeProfit),
    setupTag: row.setup_tag ?? '',
    notes: row.notes ?? '',
  };
}

function mapDbSessionRow(
  row: DbBacktestSessionRow,
  trades: BacktestTrade[],
): BacktestSession {
  const startingBalance = Number(row.starting_balance);
  const endingBalance = Number(row.ending_balance);
  const computed = computeBacktestMetrics(startingBalance, trades);

  const metrics: BacktestMetrics =
    trades.length > 0
      ? computed
      : {
          startingBalance,
          currentEquity: endingBalance,
          netPnlAmount: round2(endingBalance - startingBalance),
          netPnlPercent:
            startingBalance > 0
              ? round2(((endingBalance - startingBalance) / startingBalance) * 100)
              : 0,
          totalTrades: Number(row.total_trades) || 0,
          wins: 0,
          losses: 0,
          breakevens: 0,
          winRate: Number(row.win_rate) || 0,
          profitFactor: Number(row.profit_factor) || 0,
          avgRMultiple: Number(row.avg_r_multiple) || 0,
          maxDrawdownPct: Number(row.max_drawdown_pct) || 0,
          equityCurve: [],
        };

  return {
    id: row.id,
    userId: row.user_id,
    symbol: row.symbol,
    assetClass: row.asset_class,
    timeframe: row.timeframe,
    dataSource: row.data_source,
    startingBalance,
    endingBalance,
    riskPercent: Number(row.risk_percent),
    metrics,
    trades,
    notes: row.notes ?? '',
    createdAt: row.created_at,
  };
}

export async function listBacktestSessions(): Promise<BacktestSession[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: sessionRows, error: sessionError } = await supabase
        .from('user_backtest_sessions')
        .select('*')
        .eq('user_id', authUserId)
        .order('created_at', { ascending: false })
        .limit(MAX_STORED_SESSIONS);

      if (!sessionError && Array.isArray(sessionRows)) {
        const typedSessions = sessionRows as DbBacktestSessionRow[];
        if (typedSessions.length === 0) {
          return [];
        }

        const sessionIds = typedSessions.map((row) => row.id);
        const tradesBySession = new Map<string, BacktestTrade[]>();

        const { data: tradeRows, error: tradeError } = await supabase
          .from('user_backtest_trades')
          .select('*')
          .eq('user_id', authUserId)
          .in('session_id', sessionIds)
          .order('entry_time', { ascending: true });

        if (!tradeError && Array.isArray(tradeRows)) {
          for (const rawTrade of tradeRows as DbBacktestTradeRow[]) {
            const list = tradesBySession.get(rawTrade.session_id) ?? [];
            list.push(mapDbTradeRow(rawTrade));
            tradesBySession.set(rawTrade.session_id, list);
          }
        }

        return typedSessions.map((row) =>
          mapDbSessionRow(row, tradesBySession.get(row.id) ?? []),
        );
      }
    } catch {
      // Fall through to LocalStorage fallback
    }
  }

  return readLocalSessions();
}

export async function saveBacktestSession(input: {
  symbol: string;
  assetClass: AssetClass;
  timeframe: MarketTimeframe;
  dataSource: MarketDataSource;
  startingBalance: number;
  riskPercent: number;
  metrics: BacktestMetrics;
  trades: BacktestTrade[];
  notes?: string;
}): Promise<BacktestSession> {
  const cleanSymbol = input.symbol.trim().toUpperCase() || 'BTCUSDT';
  const safeStartingBalance = Math.max(1, round2(input.startingBalance));
  const safeRiskPercent = clamp(round2(input.riskPercent), 0.01, 25);
  const cleanNotes = (input.notes ?? '').trim();
  const normalizedMetrics =
    input.trades.length > 0
      ? computeBacktestMetrics(safeStartingBalance, input.trades)
      : input.metrics;
  const endingBalance = round2(normalizedMetrics.currentEquity);

  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: insertedSession, error: sessionError } = await supabase
        .from('user_backtest_sessions')
        .insert({
          user_id: authUserId,
          symbol: cleanSymbol,
          asset_class: input.assetClass,
          timeframe: input.timeframe,
          data_source: input.dataSource,
          starting_balance: safeStartingBalance,
          ending_balance: endingBalance,
          risk_percent: safeRiskPercent,
          total_trades: Math.max(0, Math.floor(normalizedMetrics.totalTrades)),
          win_rate: clamp(round2(normalizedMetrics.winRate), 0, 100),
          profit_factor: clamp(round2(normalizedMetrics.profitFactor), 0, 999999.99),
          avg_r_multiple: clamp(round2(normalizedMetrics.avgRMultiple), -999999, 999999),
          max_drawdown_pct: clamp(round2(normalizedMetrics.maxDrawdownPct), 0, 9999.99),
          notes: cleanNotes,
        })
        .select('*')
        .single<DbBacktestSessionRow>();

      if (!sessionError && insertedSession) {
        let persistedTrades: BacktestTrade[] = [];

        if (input.trades.length > 0) {
          const tradePayloads = input.trades.map((trade) => ({
            session_id: insertedSession.id,
            user_id: authUserId,
            direction: trade.direction,
            entry_time: Math.max(1, Math.floor(trade.entryTime)),
            exit_time: Math.max(Math.max(1, Math.floor(trade.entryTime)), Math.floor(trade.exitTime)),
            entry_price: trade.entryPrice,
            stop_loss: trade.stopLoss,
            take_profit: trade.takeProfit,
            exit_price: trade.exitPrice,
            risk_amount: Math.max(0.01, round2(trade.riskAmount)),
            pnl_amount: round2(trade.pnlAmount),
            r_multiple: round2(trade.rMultiple),
            outcome: trade.outcome,
            setup_tag: trade.setupTag.trim(),
            notes: trade.notes.trim(),
          }));

          const { data: insertedTrades, error: tradesError } = await supabase
            .from('user_backtest_trades')
            .insert(tradePayloads)
            .select('*');

          if (!tradesError && Array.isArray(insertedTrades)) {
            persistedTrades = (insertedTrades as DbBacktestTradeRow[]).map(mapDbTradeRow);
          } else {
            persistedTrades = input.trades;
          }
        }

        return mapDbSessionRow(insertedSession, persistedTrades);
      }
    } catch {
      // Fall through to LocalStorage persistence
    }
  }

  const userId = await getActiveUserId();
  const localSession: BacktestSession = {
    id: generateId(),
    userId,
    symbol: cleanSymbol,
    assetClass: input.assetClass,
    timeframe: input.timeframe,
    dataSource: input.dataSource,
    startingBalance: safeStartingBalance,
    endingBalance,
    riskPercent: safeRiskPercent,
    metrics: normalizedMetrics,
    trades: input.trades,
    notes: cleanNotes,
    createdAt: new Date().toISOString(),
  };

  const existing = readLocalSessions();
  writeLocalSessions([localSession, ...existing]);
  return localSession;
}

export async function deleteBacktestSession(sessionId: string): Promise<void> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase
        .from('user_backtest_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', authUserId);

      if (!error) {
        return;
      }
    } catch {
      // Fall through to local removal
    }
  }

  const existing = readLocalSessions();
  const filtered = existing.filter((session) => session.id !== sessionId);
  writeLocalSessions(filtered);
}
