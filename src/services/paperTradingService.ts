import type { AssetClass, MarketSymbolOption } from '@/types/backtest';
import type {
  CreatePaperAccountInput,
  LiveMarketQuote,
  PaperAccount,
  PaperExitReason,
  PaperPosition,
  PaperTrade,
  PaperWalletMarketFocus,
  PlacePaperOrderInput,
  UpdatePaperAccountInput,
} from '@/types/paper-trading';
import {
  DEFAULT_FEE_SPREAD_BY_ASSET,
  calculateOrderPreview,
  closePaperPositionCalculation,
  evaluatePositionAgainstBar,
} from '@/lib/paperTradingEngine';
import {
  getActiveUserId,
  getAuthenticatedSupabaseUserId,
  isSupabaseConfigured,
  supabase,
} from '@/lib/supabase';
import { createJournalEntry } from './journalService';
import { fetchMarketCandles } from './marketDataService';

const PAPER_ACCOUNTS_KEY = 'tradelab_paper_accounts_v1';
const PAPER_POSITIONS_KEY = 'tradelab_paper_positions_v1';
const PAPER_TRADES_KEY = 'tradelab_paper_trades_v1';
const PAPER_SEEDED_KEY = 'tradelab_paper_seeded_v1';

const BINANCE_TICKER_TIMEOUT_MS = 4500;

interface DbPaperAccountRow {
  id: string;
  user_id: string;
  account_name: string;
  market_focus: PaperWalletMarketFocus;
  starting_balance: number | string;
  cash_balance: number | string;
  daily_loss_limit_pct: number | string;
  max_risk_per_trade_pct: number | string;
  simulate_fees_spread: boolean;
  fee_rate_bps: number | string;
  spread_bps: number | string;
  reset_count: number | string;
  created_at: string;
  updated_at: string;
}

interface DbPaperPositionRow {
  id: string;
  account_id: string;
  user_id: string;
  symbol: string;
  asset_class: AssetClass;
  direction: PaperPosition['direction'];
  order_type: PaperPosition['orderType'];
  status: PaperPosition['status'];
  entry_price: number | string;
  raw_quote_price: number | string;
  stop_loss: number | string;
  take_profit: number | string | null;
  units: number | string;
  risk_amount: number | string;
  entry_fee: number | string;
  entry_spread_cost: number | string;
  setup_tag: string;
  moved_to_breakeven: boolean;
  opened_at: string;
  created_at: string;
  updated_at: string;
}

interface DbPaperTradeRow {
  id: string;
  account_id: string;
  user_id: string;
  symbol: string;
  asset_class: AssetClass;
  direction: PaperTrade['direction'];
  entry_price: number | string;
  exit_price: number | string;
  stop_loss: number | string;
  take_profit: number | string | null;
  units: number | string;
  risk_amount: number | string;
  gross_pnl: number | string;
  fee_amount: number | string;
  spread_cost: number | string;
  pnl_amount: number | string;
  r_multiple: number | string;
  outcome: PaperTrade['outcome'];
  exit_reason: PaperExitReason;
  setup_tag: string;
  synced_to_journal: boolean;
  opened_at: string;
  closed_at: string;
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function round2(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeMarketFocus(focus: PaperWalletMarketFocus): Exclude<PaperWalletMarketFocus, 'custom_csv'> {
  if (focus === 'custom_csv') {
    return 'all';
  }
  return focus;
}

function normalizeAssetClassForDb(assetClass: AssetClass): Exclude<AssetClass, 'custom_csv'> {
  return assetClass === 'custom_csv' ? 'crypto' : assetClass;
}

function defaultFeeSpreadForFocus(focus: PaperWalletMarketFocus): { feeRateBps: number; spreadBps: number } {
  if (focus === 'all' || focus === 'custom_csv') {
    return { ...DEFAULT_FEE_SPREAD_BY_ASSET.crypto };
  }
  return { ...(DEFAULT_FEE_SPREAD_BY_ASSET[focus] ?? DEFAULT_FEE_SPREAD_BY_ASSET.crypto) };
}

function readJsonStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeJsonStorage<T>(key: string, value: T[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore browser storage quota errors
  }
}

function readSeededFlag(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.localStorage.getItem(PAPER_SEEDED_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSeededFlag(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(PAPER_SEEDED_KEY, '1');
  } catch {
    // Ignore browser storage errors
  }
}

function mapAccountRow(row: DbPaperAccountRow): PaperAccount {
  return {
    id: row.id,
    userId: row.user_id,
    accountName: row.account_name,
    marketFocus: row.market_focus,
    startingBalance: Number(row.starting_balance),
    cashBalance: Number(row.cash_balance),
    dailyLossLimitPct: Number(row.daily_loss_limit_pct),
    maxRiskPerTradePct: Number(row.max_risk_per_trade_pct),
    simulateFeesSpread: Boolean(row.simulate_fees_spread),
    feeRateBps: Number(row.fee_rate_bps),
    spreadBps: Number(row.spread_bps),
    resetCount: Number(row.reset_count),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPositionRow(row: DbPaperPositionRow): PaperPosition {
  return {
    id: row.id,
    accountId: row.account_id,
    userId: row.user_id,
    symbol: row.symbol,
    assetClass: row.asset_class,
    direction: row.direction,
    orderType: row.order_type,
    status: row.status,
    entryPrice: Number(row.entry_price),
    rawQuotePrice: Number(row.raw_quote_price),
    stopLoss: Number(row.stop_loss),
    takeProfit: row.take_profit !== null ? Number(row.take_profit) : null,
    units: Number(row.units),
    riskAmount: Number(row.risk_amount),
    entryFee: Number(row.entry_fee),
    entrySpreadCost: Number(row.entry_spread_cost),
    setupTag: row.setup_tag ?? '',
    movedToBreakeven: Boolean(row.moved_to_breakeven),
    openedAt: row.opened_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTradeRow(row: DbPaperTradeRow): PaperTrade {
  return {
    id: row.id,
    accountId: row.account_id,
    userId: row.user_id,
    symbol: row.symbol,
    assetClass: row.asset_class,
    direction: row.direction,
    entryPrice: Number(row.entry_price),
    exitPrice: Number(row.exit_price),
    stopLoss: Number(row.stop_loss),
    takeProfit: row.take_profit !== null ? Number(row.take_profit) : null,
    units: Number(row.units),
    riskAmount: Number(row.risk_amount),
    grossPnl: Number(row.gross_pnl),
    feeAmount: Number(row.fee_amount),
    spreadCost: Number(row.spread_cost),
    pnlAmount: Number(row.pnl_amount),
    rMultiple: Number(row.r_multiple),
    outcome: row.outcome,
    exitReason: row.exit_reason,
    setupTag: row.setup_tag ?? '',
    syncedToJournal: Boolean(row.synced_to_journal),
    openedAt: row.opened_at,
    closedAt: row.closed_at,
  };
}

function sortAccountsOldestFirst(accounts: PaperAccount[]): PaperAccount[] {
  return [...accounts].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function sortPositionsNewestFirst(positions: PaperPosition[]): PaperPosition[] {
  return [...positions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function sortTradesNewestFirst(trades: PaperTrade[]): PaperTrade[] {
  return [...trades].sort((a, b) => b.closedAt.localeCompare(a.closedAt));
}

const STARTER_WALLETS: CreatePaperAccountInput[] = [
  {
    accountName: 'Crypto Demo',
    marketFocus: 'crypto',
    startingBalance: 10000,
    dailyLossLimitPct: 3,
    maxRiskPerTradePct: 1,
    simulateFeesSpread: true,
    feeRateBps: 5,
    spreadBps: 2,
  },
  {
    accountName: 'Forex Demo',
    marketFocus: 'forex',
    startingBalance: 10000,
    dailyLossLimitPct: 3,
    maxRiskPerTradePct: 1,
    simulateFeesSpread: true,
    feeRateBps: 1,
    spreadBps: 1.5,
  },
];

async function findAccountById(accountId: string): Promise<PaperAccount | null> {
  const trimmedId = accountId.trim();
  if (!trimmedId) {
    return null;
  }

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_accounts')
        .select('*')
        .eq('id', trimmedId)
        .eq('user_id', authUserId)
        .maybeSingle<DbPaperAccountRow>();

      if (!error && data) {
        return mapAccountRow(data);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return readJsonStorage<PaperAccount>(PAPER_ACCOUNTS_KEY).find(
    (account) => account.id === trimmedId,
  ) ?? null;
}

async function findPositionById(positionId: string): Promise<PaperPosition | null> {
  const trimmedId = positionId.trim();
  if (!trimmedId) {
    return null;
  }

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_positions')
        .select('*')
        .eq('id', trimmedId)
        .eq('user_id', authUserId)
        .maybeSingle<DbPaperPositionRow>();

      if (!error && data) {
        return mapPositionRow(data);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY).find(
    (position) => position.id === trimmedId,
  ) ?? null;
}

async function findTradeById(tradeId: string): Promise<PaperTrade | null> {
  const trimmedId = tradeId.trim();
  if (!trimmedId) {
    return null;
  }

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_trades')
        .select('*')
        .eq('id', trimmedId)
        .eq('user_id', authUserId)
        .maybeSingle<DbPaperTradeRow>();

      if (!error && data) {
        return mapTradeRow(data);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return readJsonStorage<PaperTrade>(PAPER_TRADES_KEY).find(
    (trade) => trade.id === trimmedId,
  ) ?? null;
}

export async function createPaperAccount(
  input: CreatePaperAccountInput,
): Promise<PaperAccount> {
  const accountName = input.accountName.trim();
  if (!accountName) {
    throw new Error('Wallet name is required.');
  }

  if (!Number.isFinite(input.startingBalance) || input.startingBalance <= 0) {
    throw new Error('Starting balance must be greater than zero.');
  }

  const marketFocus = normalizeMarketFocus(input.marketFocus);
  const startingBalance = round2(input.startingBalance);
  const dailyLossLimitPct = round2(
    clamp(
      Number.isFinite(input.dailyLossLimitPct) ? Number(input.dailyLossLimitPct) : 3,
      0.5,
      25,
    ),
  );
  const maxRiskPerTradePct = round2(
    clamp(
      Number.isFinite(input.maxRiskPerTradePct) ? Number(input.maxRiskPerTradePct) : 1,
      0.1,
      10,
    ),
  );
  const simulateFeesSpread =
    input.simulateFeesSpread === undefined ? true : Boolean(input.simulateFeesSpread);

  const defaultProfile = defaultFeeSpreadForFocus(marketFocus);
  const feeRateBps = round2(
    clamp(
      Number.isFinite(input.feeRateBps) ? Number(input.feeRateBps) : defaultProfile.feeRateBps,
      0,
      100,
    ),
  );
  const spreadBps = round2(
    clamp(
      Number.isFinite(input.spreadBps) ? Number(input.spreadBps) : defaultProfile.spreadBps,
      0,
      100,
    ),
  );

  writeSeededFlag();

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_accounts')
        .insert({
          user_id: authUserId,
          account_name: accountName,
          market_focus: marketFocus,
          starting_balance: startingBalance,
          cash_balance: startingBalance,
          daily_loss_limit_pct: dailyLossLimitPct,
          max_risk_per_trade_pct: maxRiskPerTradePct,
          simulate_fees_spread: simulateFeesSpread,
          fee_rate_bps: feeRateBps,
          spread_bps: spreadBps,
          reset_count: 0,
        })
        .select('*')
        .single<DbPaperAccountRow>();

      if (!error && data) {
        return mapAccountRow(data);
      }
    } catch {
      // Fall through to local storage persistence
    }
  }

  const userId = await getActiveUserId();
  const nowIso = new Date().toISOString();
  const created: PaperAccount = {
    id: generateId('paper-wallet'),
    userId,
    accountName,
    marketFocus,
    startingBalance,
    cashBalance: startingBalance,
    dailyLossLimitPct,
    maxRiskPerTradePct,
    simulateFeesSpread,
    feeRateBps,
    spreadBps,
    resetCount: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const existing = readJsonStorage<PaperAccount>(PAPER_ACCOUNTS_KEY);
  writeJsonStorage(PAPER_ACCOUNTS_KEY, sortAccountsOldestFirst([...existing, created]));
  return created;
}

export async function listPaperAccounts(): Promise<PaperAccount[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_accounts')
        .select('*')
        .eq('user_id', authUserId)
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data)) {
        const mapped = (data as DbPaperAccountRow[]).map(mapAccountRow);
        if (mapped.length > 0) {
          writeSeededFlag();
          return mapped;
        }
        if (!readSeededFlag()) {
          writeSeededFlag();
          const seeded: PaperAccount[] = [];
          for (const starter of STARTER_WALLETS) {
            seeded.push(await createPaperAccount(starter));
          }
          return seeded;
        }
        return [];
      }
    } catch {
      // Fallback to local storage
    }
  }

  const localAccounts = readJsonStorage<PaperAccount>(PAPER_ACCOUNTS_KEY);
  if (localAccounts.length > 0) {
    writeSeededFlag();
    return sortAccountsOldestFirst(localAccounts);
  }

  if (!readSeededFlag()) {
    writeSeededFlag();
    const seeded: PaperAccount[] = [];
    for (const starter of STARTER_WALLETS) {
      seeded.push(await createPaperAccount(starter));
    }
    return sortAccountsOldestFirst(seeded);
  }

  return [];
}

export async function updatePaperAccount(
  accountId: string,
  patch: UpdatePaperAccountInput,
): Promise<PaperAccount> {
  const existing = await findAccountById(accountId);
  if (!existing) {
    throw new Error('Demo wallet not found.');
  }

  const nextAccountName =
    patch.accountName !== undefined ? patch.accountName.trim() : existing.accountName;
  if (!nextAccountName) {
    throw new Error('Wallet name cannot be empty.');
  }

  const nextMarketFocus =
    patch.marketFocus !== undefined
      ? normalizeMarketFocus(patch.marketFocus)
      : existing.marketFocus;
  const nextDailyLossLimitPct =
    patch.dailyLossLimitPct !== undefined && Number.isFinite(patch.dailyLossLimitPct)
      ? round2(clamp(patch.dailyLossLimitPct, 0.5, 25))
      : existing.dailyLossLimitPct;
  const nextMaxRiskPerTradePct =
    patch.maxRiskPerTradePct !== undefined && Number.isFinite(patch.maxRiskPerTradePct)
      ? round2(clamp(patch.maxRiskPerTradePct, 0.1, 10))
      : existing.maxRiskPerTradePct;
  const nextSimulateFeesSpread =
    patch.simulateFeesSpread !== undefined
      ? Boolean(patch.simulateFeesSpread)
      : existing.simulateFeesSpread;
  const nextFeeRateBps =
    patch.feeRateBps !== undefined && Number.isFinite(patch.feeRateBps)
      ? round2(clamp(patch.feeRateBps, 0, 100))
      : existing.feeRateBps;
  const nextSpreadBps =
    patch.spreadBps !== undefined && Number.isFinite(patch.spreadBps)
      ? round2(clamp(patch.spreadBps, 0, 100))
      : existing.spreadBps;

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_accounts')
        .update({
          account_name: nextAccountName,
          market_focus: nextMarketFocus,
          daily_loss_limit_pct: nextDailyLossLimitPct,
          max_risk_per_trade_pct: nextMaxRiskPerTradePct,
          simulate_fees_spread: nextSimulateFeesSpread,
          fee_rate_bps: nextFeeRateBps,
          spread_bps: nextSpreadBps,
        })
        .eq('id', existing.id)
        .eq('user_id', authUserId)
        .select('*')
        .single<DbPaperAccountRow>();

      if (!error && data) {
        return mapAccountRow(data);
      }
    } catch {
      // Fallback to local storage
    }
  }

  const updated: PaperAccount = {
    ...existing,
    accountName: nextAccountName,
    marketFocus: nextMarketFocus,
    dailyLossLimitPct: nextDailyLossLimitPct,
    maxRiskPerTradePct: nextMaxRiskPerTradePct,
    simulateFeesSpread: nextSimulateFeesSpread,
    feeRateBps: nextFeeRateBps,
    spreadBps: nextSpreadBps,
    updatedAt: new Date().toISOString(),
  };

  const accounts = readJsonStorage<PaperAccount>(PAPER_ACCOUNTS_KEY).map((item) =>
    item.id === existing.id ? updated : item,
  );
  writeJsonStorage(PAPER_ACCOUNTS_KEY, accounts);
  return updated;
}

export async function resetPaperAccount(
  accountId: string,
  newStartingBalance?: number,
): Promise<PaperAccount> {
  const existing = await findAccountById(accountId);
  if (!existing) {
    throw new Error('Demo wallet not found.');
  }

  let nextStartingBalance = existing.startingBalance;
  if (newStartingBalance !== undefined) {
    if (!Number.isFinite(newStartingBalance) || newStartingBalance <= 0) {
      throw new Error('Starting balance must be greater than zero.');
    }
    nextStartingBalance = round2(newStartingBalance);
  }

  const nextResetCount = existing.resetCount + 1;

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      await supabase
        .from('user_paper_positions')
        .delete()
        .eq('account_id', existing.id)
        .eq('user_id', authUserId);

      await supabase
        .from('user_paper_trades')
        .delete()
        .eq('account_id', existing.id)
        .eq('user_id', authUserId);

      const { data, error } = await supabase
        .from('user_paper_accounts')
        .update({
          starting_balance: nextStartingBalance,
          cash_balance: nextStartingBalance,
          reset_count: nextResetCount,
        })
        .eq('id', existing.id)
        .eq('user_id', authUserId)
        .select('*')
        .single<DbPaperAccountRow>();

      if (!error && data) {
        return mapAccountRow(data);
      }
    } catch {
      // Fallback to local storage
    }
  }

  const updated: PaperAccount = {
    ...existing,
    startingBalance: nextStartingBalance,
    cashBalance: nextStartingBalance,
    resetCount: nextResetCount,
    updatedAt: new Date().toISOString(),
  };

  const accounts = readJsonStorage<PaperAccount>(PAPER_ACCOUNTS_KEY).map((item) =>
    item.id === existing.id ? updated : item,
  );
  const positions = readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY).filter(
    (item) => item.accountId !== existing.id,
  );
  const trades = readJsonStorage<PaperTrade>(PAPER_TRADES_KEY).filter(
    (item) => item.accountId !== existing.id,
  );

  writeJsonStorage(PAPER_ACCOUNTS_KEY, accounts);
  writeJsonStorage(PAPER_POSITIONS_KEY, positions);
  writeJsonStorage(PAPER_TRADES_KEY, trades);

  return updated;
}

export async function deletePaperAccount(accountId: string): Promise<void> {
  const trimmedId = accountId.trim();
  if (!trimmedId) {
    return;
  }

  writeSeededFlag();

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase
        .from('user_paper_accounts')
        .delete()
        .eq('id', trimmedId)
        .eq('user_id', authUserId);

      if (!error) {
        return;
      }
    } catch {
      // Fallback to local storage
    }
  }

  const remainingAccounts = readJsonStorage<PaperAccount>(PAPER_ACCOUNTS_KEY).filter(
    (item) => item.id !== trimmedId,
  );
  const remainingPositions = readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY).filter(
    (item) => item.accountId !== trimmedId,
  );
  const remainingTrades = readJsonStorage<PaperTrade>(PAPER_TRADES_KEY).filter(
    (item) => item.accountId !== trimmedId,
  );

  writeJsonStorage(PAPER_ACCOUNTS_KEY, remainingAccounts);
  writeJsonStorage(PAPER_POSITIONS_KEY, remainingPositions);
  writeJsonStorage(PAPER_TRADES_KEY, remainingTrades);
}

export async function listPaperPositions(accountId: string): Promise<PaperPosition[]> {
  const trimmedId = accountId.trim();
  if (!trimmedId) {
    return [];
  }

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_positions')
        .select('*')
        .eq('account_id', trimmedId)
        .eq('user_id', authUserId)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return (data as DbPaperPositionRow[]).map(mapPositionRow);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return sortPositionsNewestFirst(
    readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY).filter(
      (item) => item.accountId === trimmedId,
    ),
  );
}

export async function listPaperTrades(accountId: string): Promise<PaperTrade[]> {
  const trimmedId = accountId.trim();
  if (!trimmedId) {
    return [];
  }

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_trades')
        .select('*')
        .eq('account_id', trimmedId)
        .eq('user_id', authUserId)
        .order('closed_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return (data as DbPaperTradeRow[]).map(mapTradeRow);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return sortTradesNewestFirst(
    readJsonStorage<PaperTrade>(PAPER_TRADES_KEY).filter(
      (item) => item.accountId === trimmedId,
    ),
  );
}

export async function placePaperOrder(
  input: PlacePaperOrderInput,
): Promise<PaperPosition> {
  const account = await findAccountById(input.accountId);
  if (!account) {
    throw new Error('Selected demo wallet was not found.');
  }

  const symbol = input.symbol.trim().toUpperCase();
  if (!symbol) {
    throw new Error('Trading symbol is required.');
  }

  const preview = calculateOrderPreview(account, {
    symbol,
    assetClass: input.assetClass,
    direction: input.direction,
    orderType: input.orderType,
    currentMarketPrice: input.currentMarketPrice,
    limitPrice: input.limitPrice,
    stopLoss: input.stopLoss,
    takeProfit: input.takeProfit,
    riskPercent: input.riskPercent,
    setupTag: input.setupTag,
  });

  if (!preview.valid) {
    throw new Error(preview.error ?? 'Order validation failed.');
  }

  const status: PaperPosition['status'] =
    input.orderType === 'limit' ? 'pending' : 'open';
  const setupTag = (input.setupTag ?? '').trim();
  const dbAssetClass = normalizeAssetClassForDb(input.assetClass);
  const nowIso = new Date().toISOString();

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_positions')
        .insert({
          account_id: account.id,
          user_id: authUserId,
          symbol,
          asset_class: dbAssetClass,
          direction: input.direction,
          order_type: input.orderType,
          status,
          entry_price: preview.entryPrice,
          raw_quote_price: preview.rawQuotePrice,
          stop_loss: input.stopLoss,
          take_profit: input.takeProfit,
          units: preview.units,
          risk_amount: preview.riskAmount,
          entry_fee: preview.entryFee,
          entry_spread_cost: preview.entrySpreadCost,
          setup_tag: setupTag,
          moved_to_breakeven: false,
          opened_at: nowIso,
        })
        .select('*')
        .single<DbPaperPositionRow>();

      if (!error && data) {
        return mapPositionRow(data);
      }
    } catch {
      // Fallback to local storage
    }
  }

  const userId = await getActiveUserId();
  const created: PaperPosition = {
    id: generateId('paper-pos'),
    accountId: account.id,
    userId,
    symbol,
    assetClass: dbAssetClass,
    direction: input.direction,
    orderType: input.orderType,
    status,
    entryPrice: preview.entryPrice,
    rawQuotePrice: preview.rawQuotePrice,
    stopLoss: input.stopLoss,
    takeProfit: input.takeProfit,
    units: preview.units,
    riskAmount: preview.riskAmount,
    entryFee: preview.entryFee,
    entrySpreadCost: preview.entrySpreadCost,
    setupTag,
    movedToBreakeven: false,
    openedAt: nowIso,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const positions = readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY);
  writeJsonStorage(PAPER_POSITIONS_KEY, sortPositionsNewestFirst([created, ...positions]));
  return created;
}

export async function cancelPendingOrder(positionId: string): Promise<void> {
  const trimmedId = positionId.trim();
  if (!trimmedId) {
    return;
  }

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase
        .from('user_paper_positions')
        .delete()
        .eq('id', trimmedId)
        .eq('user_id', authUserId)
        .eq('status', 'pending');

      if (!error) {
        return;
      }
    } catch {
      // Fallback to local storage
    }
  }

  const remaining = readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY).filter(
    (item) => !(item.id === trimmedId && item.status === 'pending'),
  );
  writeJsonStorage(PAPER_POSITIONS_KEY, remaining);
}

export async function movePositionToBreakeven(
  positionId: string,
): Promise<PaperPosition> {
  const existing = await findPositionById(positionId);
  if (!existing) {
    throw new Error('Open position not found.');
  }
  if (existing.status !== 'open') {
    throw new Error('Only open positions can be moved to breakeven.');
  }

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_positions')
        .update({
          stop_loss: existing.entryPrice,
          moved_to_breakeven: true,
        })
        .eq('id', existing.id)
        .eq('user_id', authUserId)
        .select('*')
        .single<DbPaperPositionRow>();

      if (!error && data) {
        return mapPositionRow(data);
      }
    } catch {
      // Fallback to local storage
    }
  }

  const updated: PaperPosition = {
    ...existing,
    stopLoss: existing.entryPrice,
    movedToBreakeven: true,
    updatedAt: new Date().toISOString(),
  };

  const positions = readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY).map((item) =>
    item.id === existing.id ? updated : item,
  );
  writeJsonStorage(PAPER_POSITIONS_KEY, positions);
  return updated;
}

async function persistClosedPosition(
  position: PaperPosition,
  account: PaperAccount,
  tradeData: Omit<PaperTrade, 'id' | 'syncedToJournal'>,
): Promise<{ trade: PaperTrade; account: PaperAccount }> {
  const nextCashBalance = round2(account.cashBalance + tradeData.pnlAmount);
  const dbAssetClass = normalizeAssetClassForDb(tradeData.assetClass);
  const nowIso = new Date().toISOString();

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: insertedTrade, error: tradeError } = await supabase
        .from('user_paper_trades')
        .insert({
          account_id: account.id,
          user_id: authUserId,
          symbol: tradeData.symbol,
          asset_class: dbAssetClass,
          direction: tradeData.direction,
          entry_price: tradeData.entryPrice,
          exit_price: tradeData.exitPrice,
          stop_loss: tradeData.stopLoss,
          take_profit: tradeData.takeProfit,
          units: tradeData.units,
          risk_amount: tradeData.riskAmount,
          gross_pnl: tradeData.grossPnl,
          fee_amount: tradeData.feeAmount,
          spread_cost: tradeData.spreadCost,
          pnl_amount: tradeData.pnlAmount,
          r_multiple: tradeData.rMultiple,
          outcome: tradeData.outcome,
          exit_reason: tradeData.exitReason,
          setup_tag: tradeData.setupTag,
          synced_to_journal: false,
          opened_at: tradeData.openedAt,
          closed_at: tradeData.closedAt,
        })
        .select('*')
        .single<DbPaperTradeRow>();

      if (!tradeError && insertedTrade) {
        await supabase
          .from('user_paper_positions')
          .delete()
          .eq('id', position.id)
          .eq('user_id', authUserId);

        const { data: updatedAccountRow } = await supabase
          .from('user_paper_accounts')
          .update({ cash_balance: nextCashBalance })
          .eq('id', account.id)
          .eq('user_id', authUserId)
          .select('*')
          .single<DbPaperAccountRow>();

        return {
          trade: mapTradeRow(insertedTrade),
          account: updatedAccountRow
            ? mapAccountRow(updatedAccountRow)
            : { ...account, cashBalance: nextCashBalance, updatedAt: nowIso },
        };
      }
    } catch {
      // Fallback to local storage
    }
  }

  const createdTrade: PaperTrade = {
    ...tradeData,
    assetClass: dbAssetClass,
    id: generateId('paper-trade'),
    syncedToJournal: false,
  };

  const updatedAccount: PaperAccount = {
    ...account,
    cashBalance: nextCashBalance,
    updatedAt: nowIso,
  };

  const remainingPositions = readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY).filter(
    (item) => item.id !== position.id,
  );
  const existingTrades = readJsonStorage<PaperTrade>(PAPER_TRADES_KEY);
  const updatedAccounts = readJsonStorage<PaperAccount>(PAPER_ACCOUNTS_KEY).map((item) =>
    item.id === account.id ? updatedAccount : item,
  );

  writeJsonStorage(PAPER_POSITIONS_KEY, remainingPositions);
  writeJsonStorage(PAPER_TRADES_KEY, sortTradesNewestFirst([createdTrade, ...existingTrades]));
  writeJsonStorage(PAPER_ACCOUNTS_KEY, updatedAccounts);

  return { trade: createdTrade, account: updatedAccount };
}

export async function closePositionAtMarket(
  positionId: string,
  currentPrice: number,
  exitReason: PaperExitReason = 'manual_close',
): Promise<{ trade: PaperTrade; account: PaperAccount }> {
  const position = await findPositionById(positionId);
  if (!position) {
    throw new Error('Position not found.');
  }
  if (position.status !== 'open') {
    throw new Error('Pending limit orders must be cancelled, not closed at market.');
  }
  if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
    throw new Error('Exit price must be a positive number.');
  }

  const account = await findAccountById(position.accountId);
  if (!account) {
    throw new Error('Parent demo wallet was not found.');
  }

  const tradeData = closePaperPositionCalculation(
    position,
    currentPrice,
    exitReason,
    account,
  );

  return persistClosedPosition(position, account, tradeData);
}

export async function evaluateAccountPositions(
  accountId: string,
  symbol: string,
  bar: { high: number; low: number; close: number },
): Promise<{
  filledIds: string[];
  closedTrades: PaperTrade[];
  account: PaperAccount | null;
}> {
  let currentAccount = await findAccountById(accountId);
  if (!currentAccount) {
    return { filledIds: [], closedTrades: [], account: null };
  }

  const normalizedSymbol = symbol.trim().toUpperCase();
  const positions = await listPaperPositions(accountId);
  const matchingPositions = positions.filter(
    (pos) => pos.symbol.trim().toUpperCase() === normalizedSymbol,
  );

  const filledIds: string[] = [];
  const closedTrades: PaperTrade[] = [];

  for (const position of matchingPositions) {
    const evaluation = evaluatePositionAgainstBar(position, bar, currentAccount);

    if (evaluation.action === 'filled' && evaluation.updatedPosition) {
      const filledPos = evaluation.updatedPosition;
      const authUserId = await getAuthenticatedSupabaseUserId();
      if (isSupabaseConfigured && supabase && authUserId) {
        try {
          await supabase
            .from('user_paper_positions')
            .update({
              status: 'open',
              opened_at: filledPos.openedAt,
            })
            .eq('id', filledPos.id)
            .eq('user_id', authUserId);
        } catch {
          // Local update below handles offline state
        }
      }

      const localPositions = readJsonStorage<PaperPosition>(PAPER_POSITIONS_KEY);
      if (localPositions.some((item) => item.id === filledPos.id)) {
        writeJsonStorage(
          PAPER_POSITIONS_KEY,
          localPositions.map((item) => (item.id === filledPos.id ? filledPos : item)),
        );
      }

      filledIds.push(filledPos.id);
      continue;
    }

    if (evaluation.action === 'closed' && evaluation.closedTrade) {
      const result = await persistClosedPosition(
        position,
        currentAccount,
        evaluation.closedTrade,
      );
      closedTrades.push(result.trade);
      currentAccount = result.account;
    }
  }

  return {
    filledIds,
    closedTrades,
    account: currentAccount,
  };
}

function createAbortTimeout(timeoutMs: number): {
  signal?: AbortSignal;
  cleanup: () => void;
} {
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

export async function fetchLiveMarketQuote(
  symbolOption: MarketSymbolOption,
): Promise<LiveMarketQuote> {
  if (symbolOption.binanceSymbol) {
    const { signal, cleanup } = createAbortTimeout(BINANCE_TICKER_TIMEOUT_MS);
    try {
      const url = `https://api.binance.com/api/v3/ticker/price?symbol=${encodeURIComponent(
        symbolOption.binanceSymbol,
      )}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal,
      });

      if (response.ok) {
        const payload = (await response.json()) as { price?: string };
        const parsedPrice = Number(payload.price);
        if (Number.isFinite(parsedPrice) && parsedPrice > 0) {
          return {
            symbol: symbolOption.symbol,
            price: parsedPrice,
            source: 'binance_live',
            fetchedAt: new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fall through to market candle API or offline practice quote
    } finally {
      cleanup();
    }
  }

  try {
    const candlesResponse = await fetchMarketCandles(symbolOption.symbol, '5m', 50, {
      forceRefresh: true,
    });
    const latestCandle = candlesResponse.candles[candlesResponse.candles.length - 1];
    if (
      candlesResponse.dataSource !== 'offline_sample' &&
      latestCandle &&
      Number.isFinite(latestCandle.close) &&
      latestCandle.close > 0
    ) {
      return {
        symbol: symbolOption.symbol,
        price: latestCandle.close,
        source:
          candlesResponse.dataSource === 'live_binance'
            ? 'binance_live'
            : 'market_api_live',
        fetchedAt: candlesResponse.fetchedAt,
      };
    }
  } catch {
    // Fall through to deterministic practice base price
  }

  return {
    symbol: symbolOption.symbol,
    price: symbolOption.basePrice,
    source: 'offline_practice',
    fetchedAt: new Date().toISOString(),
  };
}

function formatExitReasonLabel(reason: PaperExitReason): string {
  switch (reason) {
    case 'take_profit':
      return 'Take Profit (TP)';
    case 'stop_loss':
      return 'Stop Loss (SL)';
    case 'breakeven':
      return 'Breakeven (BE)';
    case 'manual_close':
      return 'Manual Close';
  }
}

export async function syncPaperTradeToJournal(tradeId: string): Promise<PaperTrade> {
  const existing = await findTradeById(tradeId);
  if (!existing) {
    throw new Error('Paper trade not found.');
  }

  if (existing.syncedToJournal) {
    return existing;
  }

  const lessonLearned = [
    `Paper Demo Trade closed via ${formatExitReasonLabel(existing.exitReason)}.`,
    `Gross P&L (Profit & Loss): $${existing.grossPnl.toFixed(2)}`,
    `Fees: -$${existing.feeAmount.toFixed(2)}`,
    `Spread: -$${existing.spreadCost.toFixed(2)}`,
    `Net P&L: $${existing.pnlAmount.toFixed(2)} (${existing.rMultiple >= 0 ? '+' : ''}${existing.rMultiple.toFixed(2)}R).`,
  ].join(' ');

  await createJournalEntry({
    tradedAt: existing.closedAt,
    symbol: existing.symbol,
    assetClass: normalizeAssetClassForDb(existing.assetClass),
    direction: existing.direction,
    setupTag: existing.setupTag || 'Paper Demo Trade',
    entryPrice: existing.entryPrice,
    exitPrice: existing.exitPrice,
    pnlAmount: existing.pnlAmount,
    rMultiple: existing.rMultiple,
    emotion: 'calm_disciplined',
    followedPlan: true,
    lessonLearned,
  });

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_paper_trades')
        .update({ synced_to_journal: true })
        .eq('id', existing.id)
        .eq('user_id', authUserId)
        .select('*')
        .single<DbPaperTradeRow>();

      if (!error && data) {
        return mapTradeRow(data);
      }
    } catch {
      // Fallback to local storage update
    }
  }

  const updated: PaperTrade = {
    ...existing,
    syncedToJournal: true,
  };

  const trades = readJsonStorage<PaperTrade>(PAPER_TRADES_KEY).map((item) =>
    item.id === existing.id ? updated : item,
  );
  writeJsonStorage(PAPER_TRADES_KEY, trades);

  return updated;
}
