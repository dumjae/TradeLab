import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BookMarked,
  Check,
  Clock,
  Shield,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getMarketSymbol } from '../../data/marketCatalog';
import { UI_COPY } from '../../data/taglishTranslations';
import { calculateUnrealizedPnl } from '../../lib/paperTradingEngine';
import type {
  PaperAccount,
  PaperExitReason,
  PaperPosition,
  PaperTrade,
} from '../../types/paper-trading';

type PositionsTab = 'open' | 'pending' | 'closed';

function formatPrice(symbol: string, value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }
  const decimals = getMarketSymbol(symbol)?.decimals ?? 2;
  return value.toFixed(decimals);
}

function formatMoney(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const abs = Math.abs(safe).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return safe < 0 ? `-$${abs}` : `$${abs}`;
}

function formatSignedMoney(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  if (safe > 0) {
    return `+${formatMoney(safe)}`;
  }
  return formatMoney(safe);
}

function formatR(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe >= 0 ? '+' : ''}${safe.toFixed(2)}R`;
}

function formatExitReason(reason: PaperExitReason): string {
  switch (reason) {
    case 'take_profit':
      return 'TP (Take Profit)';
    case 'stop_loss':
      return 'SL (Stop Loss)';
    case 'breakeven':
      return 'BE (Breakeven)';
    case 'manual_close':
      return 'Manual Close';
  }
}

export interface PaperPositionsPanelProps {
  account: PaperAccount;
  positions: PaperPosition[];
  trades: PaperTrade[];
  priceMap: Record<string, number>;
  busyPositionId: string | null;
  syncingTradeId: string | null;
  onMoveToBreakeven: (positionId: string) => Promise<void>;
  onClosePosition: (positionId: string, markPrice: number) => Promise<void>;
  onCancelPending: (positionId: string) => Promise<void>;
  onSyncToJournal: (tradeId: string) => Promise<void>;
}

export function PaperPositionsPanel({
  account,
  positions,
  trades,
  priceMap,
  busyPositionId,
  syncingTradeId,
  onMoveToBreakeven,
  onClosePosition,
  onCancelPending,
  onSyncToJournal,
}: PaperPositionsPanelProps) {
  const { t } = useLanguage();
  const copy = UI_COPY.paperTrading;
  const [activeTab, setActiveTab] = useState<PositionsTab>('open');

  const openPositions = useMemo(
    () => positions.filter((pos) => pos.status === 'open'),
    [positions],
  );
  const pendingOrders = useMemo(
    () => positions.filter((pos) => pos.status === 'pending'),
    [positions],
  );

  const historySummary = useMemo(() => {
    const total = trades.length;
    const wins = trades.filter((item) => item.outcome === 'win').length;
    const netPnl = trades.reduce((sum, item) => sum + item.pnlAmount, 0);
    const totalCost = trades.reduce((sum, item) => sum + item.feeAmount + item.spreadCost, 0);
    return {
      total,
      winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
      netPnl,
      totalCost,
    };
  }, [trades]);

  return (
    <section
      aria-label="Positions and closed trade history"
      className="rounded-xl border border-terminal-border bg-terminal-surface p-4"
    >
      {/* 3-Tab Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terminal-border pb-3">
        <div role="tablist" aria-label="Position views" className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'open'}
            onClick={() => setActiveTab('open')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'open'
                ? 'bg-brand text-brand-fg'
                : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
            }`}
          >
            {t('Open', copy.openPositions.taglish)} ({openPositions.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-brand text-brand-fg'
                : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
            }`}
          >
            {t(copy.pendingOrders.en, copy.pendingOrders.taglish)} ({pendingOrders.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'closed'}
            onClick={() => setActiveTab('closed')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'closed'
                ? 'bg-brand text-brand-fg'
                : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
            }`}
          >
            {t('Closed History', copy.closedTrades.taglish)} ({trades.length})
          </button>
        </div>

        {activeTab === 'closed' && historySummary.total > 0 && (
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-terminal-muted tabular-nums">
            <span>
              {t('Win Rate', 'Win Rate')}:{' '}
              <strong className="text-terminal-text">{historySummary.winRate}%</strong>
            </span>
            <span>
              {t('Net P&L (Profit & Loss)', 'Net P&L')}:{' '}
              <strong
                className={`rounded px-1.5 py-0.5 ${
                  historySummary.netPnl >= 0
                    ? 'bg-bull/15 text-bull'
                    : 'bg-bear/15 text-bear'
                }`}
              >
                {formatSignedMoney(historySummary.netPnl)}
              </strong>
            </span>
            <span>
              {t('Fees + Spread', 'Fee + Spread')}:{' '}
              <strong className="text-amber-700 dark:text-amber-300">
                -{formatMoney(historySummary.totalCost)}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Tab 1: Open Positions */}
      {activeTab === 'open' && (
        <div className="mt-3 space-y-2">
          {openPositions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-terminal-border bg-terminal-bg px-4 py-6 text-center text-xs text-terminal-muted">
              {t(
                'No open positions in this demo wallet yet. Place a Market or Limit order on the right.',
                'Wala pang bukas na trade sa demo wallet na ito. Maglagay ng Market o Limit order sa kanan.',
              )}
            </p>
          ) : (
            openPositions.map((position) => {
              const markPrice = priceMap[position.symbol] ?? position.entryPrice;
              const floating = calculateUnrealizedPnl(position, markPrice, account);
              const isLong = position.direction === 'long';
              const isBusy = busyPositionId === position.id;

              return (
                <div
                  key={position.id}
                  className="flex flex-col gap-3 rounded-lg border border-terminal-border bg-terminal-bg p-3 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-terminal-text">
                        {position.symbol}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold ${
                          isLong ? 'bg-bull/15 text-bull' : 'bg-bear/15 text-bear'
                        }`}
                      >
                        {isLong ? (
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
                        )}
                        {isLong ? 'Long' : 'Short'}
                      </span>
                      {position.movedToBreakeven && (
                        <span className="rounded border border-info/35 bg-info/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-info">
                          BE (Breakeven)
                        </span>
                      )}
                      {position.setupTag && (
                        <span className="rounded border border-terminal-border bg-terminal-surface px-2 py-0.5 text-[10px] text-terminal-muted">
                          {position.setupTag}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-terminal-muted tabular-nums">
                      <span>
                        Entry:{' '}
                        <strong className="text-terminal-text">
                          {formatPrice(position.symbol, position.entryPrice)}
                        </strong>
                      </span>
                      <span>
                        Mark:{' '}
                        <strong className="text-terminal-text">
                          {formatPrice(position.symbol, markPrice)}
                        </strong>
                      </span>
                      <span>
                        SL (Stop Loss):{' '}
                        <strong className="text-bear">
                          {formatPrice(position.symbol, position.stopLoss)}
                        </strong>
                      </span>
                      <span>
                        TP (Take Profit):{' '}
                        <strong className="text-bull">
                          {formatPrice(position.symbol, position.takeProfit)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-medium text-terminal-muted">
                        {t('Floating P&L (Profit & Loss)', 'Floating P&L')}
                      </p>
                      <p
                        className={`font-mono text-sm font-bold tabular-nums ${
                          floating.netPnl > 0
                            ? 'text-bull'
                            : floating.netPnl < 0
                              ? 'text-bear'
                              : 'text-terminal-text'
                        }`}
                      >
                        {formatSignedMoney(floating.netPnl)}{' '}
                        <span className="text-xs font-semibold">
                          ({formatR(floating.rMultiple)})
                        </span>
                      </p>
                      {account.simulateFeesSpread && (
                        <p className="font-mono text-[10px] text-terminal-muted tabular-nums">
                          Gross {formatSignedMoney(floating.grossPnl)} · Cost -
                          {formatMoney(
                            position.entryFee +
                              position.entrySpreadCost +
                              floating.estimatedCloseFee +
                              floating.estimatedCloseSpread,
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isBusy || position.movedToBreakeven}
                        onClick={() => onMoveToBreakeven(position.id)}
                        title={t(copy.moveToBe.en, copy.moveToBe.taglish)}
                        className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-surface px-2.5 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-info/50 hover:text-info disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                        BE (Breakeven)
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onClosePosition(position.id, markPrice)}
                        className="inline-flex items-center gap-1 rounded-lg border border-bear/35 bg-bear/10 px-2.5 py-1.5 text-xs font-semibold text-bear transition-colors hover:bg-bear hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        {t(copy.closeNow.en, copy.closeNow.taglish)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Pending Limit Orders */}
      {activeTab === 'pending' && (
        <div className="mt-3 space-y-2">
          {pendingOrders.length === 0 ? (
            <p className="rounded-lg border border-dashed border-terminal-border bg-terminal-bg px-4 py-6 text-center text-xs text-terminal-muted">
              {t(
                'No pending limit orders waiting for price.',
                'Walang naghihintay na limit order sa ngayon.',
              )}
            </p>
          ) : (
            pendingOrders.map((order) => {
              const isLong = order.direction === 'long';
              const isBusy = busyPositionId === order.id;

              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-2.5 rounded-lg border border-terminal-border bg-terminal-bg p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-amber-wisdom" aria-hidden="true" />
                      <span className="font-mono text-sm font-bold text-terminal-text">
                        {order.symbol}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                          isLong ? 'bg-bull/15 text-bull' : 'bg-bear/15 text-bear'
                        }`}
                      >
                        {isLong ? 'Buy Limit' : 'Sell Limit'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-terminal-muted tabular-nums">
                      <span>
                        Target Entry:{' '}
                        <strong className="text-terminal-text">
                          {formatPrice(order.symbol, order.entryPrice)}
                        </strong>
                      </span>
                      <span>
                        SL (Stop Loss):{' '}
                        <strong className="text-bear">
                          {formatPrice(order.symbol, order.stopLoss)}
                        </strong>
                      </span>
                      <span>
                        TP (Take Profit):{' '}
                        <strong className="text-bull">
                          {formatPrice(order.symbol, order.takeProfit)}
                        </strong>
                      </span>
                      <span>
                        Risk:{' '}
                        <strong className="text-terminal-text">
                          {formatMoney(order.riskAmount)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onCancelPending(order.id)}
                    className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-semibold text-terminal-muted transition-colors hover:border-bear/50 hover:text-bear disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {t(copy.cancelOrder.en, copy.cancelOrder.taglish)}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Closed History */}
      {activeTab === 'closed' && (
        <div className="mt-3 space-y-2">
          {trades.length === 0 ? (
            <p className="rounded-lg border border-dashed border-terminal-border bg-terminal-bg px-4 py-6 text-center text-xs text-terminal-muted">
              {t(
                'No closed demo trades yet. Closed trades appear here with Gross P&L, Fee + Spread, and 1-click Journal logging.',
                'Wala pang saradong demo trade. Lalabas dito ang Gross P&L, Fee + Spread, at 1-click Journal save.',
              )}
            </p>
          ) : (
            trades.map((trade) => {
              const isLong = trade.direction === 'long';
              const totalCost = trade.feeAmount + trade.spreadCost;
              const isSyncing = syncingTradeId === trade.id;

              return (
                <div
                  key={trade.id}
                  className="flex flex-col gap-3 rounded-lg border border-terminal-border bg-terminal-bg p-3 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-terminal-text">
                        {trade.symbol}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                          isLong ? 'bg-bull/15 text-bull' : 'bg-bear/15 text-bear'
                        }`}
                      >
                        {isLong ? 'Long' : 'Short'}
                      </span>
                      <span className="rounded border border-terminal-border bg-terminal-surface px-2 py-0.5 font-mono text-[10px] font-medium text-terminal-muted">
                        {formatExitReason(trade.exitReason)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-terminal-muted tabular-nums">
                      <span>
                        {formatPrice(trade.symbol, trade.entryPrice)} →{' '}
                        <strong className="text-terminal-text">
                          {formatPrice(trade.symbol, trade.exitPrice)}
                        </strong>
                      </span>
                      <span>
                        Gross P&L:{' '}
                        <strong className="text-terminal-text">
                          {formatSignedMoney(trade.grossPnl)}
                        </strong>
                      </span>
                      <span>
                        Fee + Spread:{' '}
                        <strong className="text-amber-700 dark:text-amber-300">
                          -{formatMoney(totalCost)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-medium text-terminal-muted">
                        {t('Net P&L (Profit & Loss)', 'Net P&L')}
                      </p>
                      <p
                        className={`inline-flex items-baseline gap-1 rounded px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums ${
                          trade.pnlAmount > 0
                            ? 'bg-bull/10 text-bull'
                            : trade.pnlAmount < 0
                              ? 'bg-bear/10 text-bear'
                              : 'text-terminal-text'
                        }`}
                      >
                        {formatSignedMoney(trade.pnlAmount)}
                        <span className="text-xs font-semibold">
                          ({formatR(trade.rMultiple)})
                        </span>
                      </p>
                    </div>

                    {trade.syncedToJournal ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-bull/35 bg-bull/10 px-3 py-1.5 text-xs font-semibold text-bull">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('Logged', copy.loggedBadge.taglish)}
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isSyncing}
                        onClick={() => onSyncToJournal(trade.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-brand/40 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-text transition-colors hover:bg-brand hover:text-brand-fg disabled:opacity-50"
                      >
                        <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
                        {isSyncing
                          ? t('Saving…', 'Sine-save…')
                          : t(copy.logToJournal.en, copy.logToJournal.taglish)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
