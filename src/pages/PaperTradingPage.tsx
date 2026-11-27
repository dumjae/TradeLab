import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  List,
  Loader2,
  Plus,
  Radio,
  RefreshCw,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import {
  AssetSelectorBar,
  type DateRangePreset,
  type SelectableAssetClass,
} from '../components/backtest/AssetSelectorBar';
import { InteractiveCandleChart } from '../components/charts/InteractiveCandleChart';
import { TradingViewDrawingRail } from '../components/charts/TradingViewDrawingRail';
import {
  CreateWalletModal,
  DemoAccountHeader,
} from '../components/paper-trading/DemoAccountHeader';
import { PaperOrderTicket } from '../components/paper-trading/PaperOrderTicket';
import { PaperPositionsPanel } from '../components/paper-trading/PaperPositionsPanel';
import { TradingViewWatchlist } from '../components/paper-trading/TradingViewWatchlist';
import { useLanguage } from '../context/LanguageContext';
import { MARKET_SYMBOLS, getMarketSymbol } from '../data/marketCatalog';
import { UI_COPY } from '../data/taglishTranslations';
import {
  buildHorizontalPriceLine,
  computeQuickPositionSetup,
  computeSessionHighLowLines,
  roundChartPrice,
  type DrawingToolMode,
  type QuickPositionSetup,
  type UserHorizontalLine,
} from '../lib/drawingTools';
import { computePaperPortfolioMetrics } from '../lib/paperTradingEngine';
import { fetchMarketCandles } from '../services/marketDataService';
import {
  cancelPendingOrder,
  closePositionAtMarket,
  createPaperAccount,
  deletePaperAccount,
  evaluateAccountPositions,
  fetchLiveMarketQuote,
  listPaperAccounts,
  listPaperPositions,
  listPaperTrades,
  movePositionToBreakeven,
  placePaperOrder,
  resetPaperAccount,
  syncPaperTradeToJournal,
  updatePaperAccount,
} from '../services/paperTradingService';
import type { CandlePoint, ChartPriceLine } from '../types/academy';
import type {
  MarketDataSource,
  MarketSymbolOption,
  MarketTimeframe,
} from '../types/backtest';
import type {
  CreatePaperAccountInput,
  LiveMarketQuote,
  PaperAccount,
  PaperPosition,
  PaperTrade,
  PaperWalletMarketFocus,
  PlacePaperOrderInput,
  UpdatePaperAccountInput,
} from '../types/paper-trading';

interface ToastMessage {
  id: string;
  tone: 'bull' | 'bear' | 'info';
  text: string;
}

const CRYPTO_POLL_MS = 5000;
const TRADITIONAL_POLL_MS = 15000;

function getDefaultAssetClassForFocus(focus: PaperWalletMarketFocus): SelectableAssetClass {
  if (focus === 'all' || focus === 'custom_csv') {
    return 'crypto';
  }
  return focus;
}

function getFirstSymbolForAssetClass(assetClass: SelectableAssetClass): MarketSymbolOption {
  return (
    MARKET_SYMBOLS.find((item) => item.assetClass === assetClass) ?? MARKET_SYMBOLS[0]
  );
}

function computePresetDateWindow(preset: DateRangePreset): {
  startDate: string;
  endDate: string;
} {
  if (preset === 'latest') {
    return { startDate: '', endDate: '' };
  }
  const now = new Date();
  const daysBack =
    preset === '7d' ? 7 : preset === '30d' ? 30 : preset === '90d' ? 90 : 365;
  const start = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const toIso = (date: Date) => date.toISOString().slice(0, 10);
  return { startDate: toIso(start), endDate: toIso(now) };
}

function formatFeedBadge(source: LiveMarketQuote['source'] | null): {
  label: string;
  dotClass: string;
  pillClass: string;
} {
  if (source === 'binance_live') {
    return {
      label: 'Live Binance',
      dotClass: 'bg-bull',
      pillClass: 'border-bull/35 bg-bull/10 text-bull',
    };
  }
  if (source === 'market_api_live') {
    return {
      label: 'Live Feed',
      dotClass: 'bg-bull',
      pillClass: 'border-bull/35 bg-bull/10 text-bull',
    };
  }
  return {
    label: 'Practice Feed',
    dotClass: 'bg-amber-500',
    pillClass:
      'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  };
}

function formatSignedMoney(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const abs = Math.abs(safe).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return safe > 0 ? `+$${abs}` : safe < 0 ? `-$${abs}` : '$0.00';
}

export function PaperTradingPage() {
  const { t } = useLanguage();
  const copy = UI_COPY.paperTrading;

  // Wallets & active portfolio state
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accounts, setAccounts] = useState<PaperAccount[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string>('');
  const [positions, setPositions] = useState<PaperPosition[]>([]);
  const [trades, setTrades] = useState<PaperTrade[]>([]);
  const [walletBusy, setWalletBusy] = useState(false);
  const [emptyCreateModalOpen, setEmptyCreateModalOpen] = useState(false);

  // Market & chart state
  const [assetClass, setAssetClass] = useState<SelectableAssetClass>('crypto');
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [timeframe, setTimeframe] = useState<MarketTimeframe>('15m');
  const [datePreset, setDatePreset] = useState<DateRangePreset | null>('latest');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [csvNote, setCsvNote] = useState<string | null>(null);
  const [candles, setCandles] = useState<CandlePoint[]>([]);
  const [dataSource, setDataSource] = useState<MarketDataSource | null>(null);
  const [dataNote, setDataNote] = useState<string | undefined>(undefined);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loadingChart, setLoadingChart] = useState<boolean>(false);
  const [refreshNonce, setRefreshNonce] = useState<number>(0);

  // Live quote & price map
  const [liveQuote, setLiveQuote] = useState<LiveMarketQuote | null>(null);
  const [refreshingQuote, setRefreshingQuote] = useState<boolean>(false);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  // Action busy states & toast
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [busyPositionId, setBusyPositionId] = useState<string | null>(null);
  const [syncingTradeId, setSyncingTradeId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // TradingView Drawing Rail & Watchlist state (per symbol)
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingToolMode>('crosshair');
  const [userLinesBySymbol, setUserLinesBySymbol] = useState<
    Record<string, UserHorizontalLine[]>
  >({});
  const [showSessionHLBySymbol, setShowSessionHLBySymbol] = useState<
    Record<string, boolean>
  >({});
  const [quickSetup, setQuickSetup] = useState<QuickPositionSetup | null>(null);
  const [quickSetupNonce, setQuickSetupNonce] = useState<number>(0);
  const [watchlistOpen, setWatchlistOpen] = useState<boolean>(false);

  const lastFocusedAccountIdRef = useRef<string>('');
  const latestCandleCloseRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((tone: ToastMessage['tone'], text: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({
      id: `${Date.now()}`,
      tone,
      text,
    });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const activeAccount = useMemo(
    () => accounts.find((item) => item.id === activeAccountId) ?? accounts[0] ?? null,
    [accounts, activeAccountId],
  );
  const resolvedAccountId = activeAccount?.id ?? '';

  const symbolOption: MarketSymbolOption = useMemo(
    () => getMarketSymbol(symbol) ?? getFirstSymbolForAssetClass(assetClass),
    [symbol, assetClass],
  );

  // Initial load of demo wallets
  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      setLoadingAccounts(true);
      try {
        const loaded = await listPaperAccounts();
        if (cancelled) return;
        setAccounts(loaded);
        if (loaded.length > 0) {
          setActiveAccountId(loaded[0].id);
        } else {
          setActiveAccountId('');
        }
      } finally {
        if (!cancelled) {
          setLoadingAccounts(false);
        }
      }
    };

    void loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load positions & trades whenever active account changes
  const reloadAccountData = useCallback(async (accountId: string) => {
    if (!accountId) {
      setPositions([]);
      setTrades([]);
      return;
    }
    const [nextPositions, nextTrades] = await Promise.all([
      listPaperPositions(accountId),
      listPaperTrades(accountId),
    ]);
    setPositions(nextPositions);
    setTrades(nextTrades);
  }, []);

  useEffect(() => {
    if (!resolvedAccountId) {
      setPositions([]);
      setTrades([]);
      return;
    }
    void reloadAccountData(resolvedAccountId);
  }, [resolvedAccountId, reloadAccountData]);

  // Default selected symbol to match active wallet's marketFocus when switching wallets
  useEffect(() => {
    if (!activeAccount) return;
    if (lastFocusedAccountIdRef.current === activeAccount.id) return;
    lastFocusedAccountIdRef.current = activeAccount.id;

    if (activeAccount.marketFocus === 'all' || activeAccount.marketFocus === 'custom_csv') {
      return;
    }

    const focusAsset = getDefaultAssetClassForFocus(activeAccount.marketFocus);
    const currentMeta = getMarketSymbol(symbol);
    if (!currentMeta || currentMeta.assetClass !== focusAsset) {
      const nextDefault = getFirstSymbolForAssetClass(focusAsset);
      setAssetClass(focusAsset);
      setSymbol(nextDefault.symbol);
    }
  }, [activeAccount, symbol]);

  // Fetch market candles when symbol / timeframe / date window changes
  useEffect(() => {
    if (!resolvedAccountId) return;
    let cancelled = false;

    const loadCandles = async () => {
      setLoadingChart(true);
      try {
        const response = await fetchMarketCandles(symbolOption.symbol, timeframe, 160, {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          forceRefresh: refreshNonce > 0,
        });
        if (cancelled) return;

        setCandles(response.candles);
        setDataSource(response.dataSource);
        setDataNote(response.note);
        setFetchedAt(response.fetchedAt);

        const lastBar = response.candles[response.candles.length - 1];
        latestCandleCloseRef.current =
          lastBar && Number.isFinite(lastBar.close) && lastBar.close > 0
            ? lastBar.close
            : null;
        if (lastBar && Number.isFinite(lastBar.close) && lastBar.close > 0) {
          setPriceMap((prev) => ({
            ...prev,
            [symbolOption.symbol]: prev[symbolOption.symbol] ?? lastBar.close,
          }));
        }
      } finally {
        if (!cancelled) {
          setLoadingChart(false);
        }
      }
    };

    void loadCandles();
    return () => {
      cancelled = true;
    };
  }, [resolvedAccountId, symbolOption.symbol, timeframe, startDate, endDate, refreshNonce]);

  // Evaluate active positions against latest price bar
  const runPositionEvaluation = useCallback(
    async (accountId: string, evalSymbol: string, bar: { high: number; low: number; close: number }) => {
      const result = await evaluateAccountPositions(accountId, evalSymbol, bar);
      if (result.filledIds.length === 0 && result.closedTrades.length === 0) {
        return;
      }

      if (result.account) {
        setAccounts((prev) =>
          prev.map((item) => (item.id === result.account?.id ? result.account : item)),
        );
      }
      await reloadAccountData(accountId);

      if (result.closedTrades.length > 0) {
        const latest = result.closedTrades[0];
        const reasonLabel =
          latest.exitReason === 'take_profit'
            ? 'TP (Take Profit)'
            : latest.exitReason === 'breakeven'
              ? 'BE (Breakeven)'
              : 'SL (Stop Loss)';
        showToast(
          latest.pnlAmount >= 0 ? 'bull' : 'bear',
          `${latest.symbol} closed at ${reasonLabel}: ${formatSignedMoney(latest.pnlAmount)}`,
        );
      } else if (result.filledIds.length > 0) {
        showToast(
          'info',
          t(
            `${evalSymbol} pending limit order filled!`,
            `Na-fill na ang pending limit order sa ${evalSymbol}!`,
          ),
        );
      }
    },
    [reloadAccountData, showToast, t],
  );

  // Live quote polling (5s for Crypto, 15s for Forex/Indices/Stocks/Commodities)
  const pollLiveQuote = useCallback(
    async (manual = false) => {
      if (!resolvedAccountId) return;
      if (manual) {
        setRefreshingQuote(true);
      }
      try {
        const quote = await fetchLiveMarketQuote(symbolOption);
        setLiveQuote(quote);
        setPriceMap((prev) => ({
          ...prev,
          [symbolOption.symbol]: quote.price,
        }));

        const prevClose = latestCandleCloseRef.current;
        const barHigh = prevClose !== null ? Math.max(prevClose, quote.price) : quote.price;
        const barLow = prevClose !== null ? Math.min(prevClose, quote.price) : quote.price;

        await runPositionEvaluation(resolvedAccountId, symbolOption.symbol, {
          high: barHigh,
          low: barLow,
          close: quote.price,
        });
      } finally {
        if (manual) {
          setRefreshingQuote(false);
        }
      }
    },
    [resolvedAccountId, symbolOption, runPositionEvaluation],
  );

  useEffect(() => {
    if (!resolvedAccountId) return;
    let active = true;

    const tick = async () => {
      if (!active) return;
      await pollLiveQuote(false);
    };

    void tick();
    const intervalMs =
      symbolOption.assetClass === 'crypto' ? CRYPTO_POLL_MS : TRADITIONAL_POLL_MS;
    const timer = window.setInterval(() => {
      void tick();
    }, intervalMs);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [resolvedAccountId, symbolOption.symbol, symbolOption.assetClass, pollLiveQuote]);

  // Sync live quote into the latest candle for smooth chart display
  const liveCandles = useMemo(() => {
    if (candles.length === 0) {
      return [];
    }
    const quotePrice =
      liveQuote && liveQuote.symbol === symbolOption.symbol ? liveQuote.price : null;
    if (!quotePrice || !Number.isFinite(quotePrice) || quotePrice <= 0) {
      return candles;
    }
    const next = [...candles];
    const last = next[next.length - 1];
    next[next.length - 1] = {
      ...last,
      close: quotePrice,
      high: Math.max(last.high, quotePrice),
      low: Math.min(last.low, quotePrice),
    };
    return next;
  }, [candles, liveQuote, symbolOption.symbol]);

  const currentMarketPrice = useMemo(() => {
    if (liveQuote && liveQuote.symbol === symbolOption.symbol && liveQuote.price > 0) {
      return liveQuote.price;
    }
    const last = liveCandles[liveCandles.length - 1];
    if (last && last.close > 0) {
      return last.close;
    }
    return symbolOption.basePrice;
  }, [liveQuote, symbolOption.symbol, symbolOption.basePrice, liveCandles]);

  // Portfolio metrics for active account
  const metrics = useMemo(() => {
    if (!activeAccount) {
      return {
        equity: 0,
        cashBalance: 0,
        unrealizedPnl: 0,
        realizedPnl: 0,
        totalReturnPct: 0,
        todayRealizedPnl: 0,
        todayLossPct: 0,
        dailyLossLimitReached: false,
        totalTrades: 0,
        winRatePct: 0,
        totalFeesPaid: 0,
        totalSpreadPaid: 0,
      };
    }
    return computePaperPortfolioMetrics(activeAccount, positions, trades, priceMap);
  }, [activeAccount, positions, trades, priceMap]);

  const accountEquityMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const wallet of accounts) {
      map[wallet.id] =
        activeAccount && wallet.id === activeAccount.id
          ? metrics.equity
          : wallet.cashBalance;
    }
    return map;
  }, [accounts, activeAccount, metrics.equity]);

  const currentUserLines = useMemo(
    () => userLinesBySymbol[symbolOption.symbol] ?? [],
    [userLinesBySymbol, symbolOption.symbol],
  );
  const showSessionHL = Boolean(showSessionHLBySymbol[symbolOption.symbol]);

  // Horizontal price lines for positions, user H-lines & optional Session H/L
  const chartPriceLines = useMemo<ChartPriceLine[]>(() => {
    const lines: ChartPriceLine[] = [];
    const matching = positions.filter((pos) => pos.symbol === symbolOption.symbol);

    for (const pos of matching) {
      const prefix = pos.status === 'pending' ? 'Limit ' : '';
      lines.push({
        id: `${pos.id}-entry`,
        price: pos.entryPrice,
        title: `${prefix}Entry (${pos.direction === 'long' ? 'Long' : 'Short'})`,
        color: '#2962ff',
        lineStyle: pos.status === 'pending' ? 'dotted' : 'solid',
        role: 'entry',
      });
      lines.push({
        id: `${pos.id}-sl`,
        price: pos.stopLoss,
        title: pos.movedToBreakeven ? 'BE (Breakeven)' : 'SL (Stop Loss)',
        color: '#f23645',
        lineStyle: 'dashed',
        role: 'stop_loss',
      });
      if (pos.takeProfit !== null) {
        lines.push({
          id: `${pos.id}-tp`,
          price: pos.takeProfit,
          title: 'TP (Take Profit)',
          color: '#089981',
          lineStyle: 'dashed',
          role: 'take_profit',
        });
      }
    }

    for (const userLine of currentUserLines) {
      lines.push(buildHorizontalPriceLine(userLine, symbolOption.decimals));
    }

    if (showSessionHL && liveCandles.length > 0) {
      lines.push(...computeSessionHighLowLines(liveCandles, symbolOption.decimals));
    }

    return lines;
  }, [
    positions,
    symbolOption.symbol,
    symbolOption.decimals,
    currentUserLines,
    showSessionHL,
    liveCandles,
  ]);

  // Wallet CRUD handlers
  const handleCreateWallet = async (input: CreatePaperAccountInput) => {
    setWalletBusy(true);
    try {
      const created = await createPaperAccount(input);
      setAccounts((prev) => [...prev, created]);
      setActiveAccountId(created.id);
      lastFocusedAccountIdRef.current = '';
      showToast(
        'bull',
        t(
          `Created "${created.accountName}" demo wallet.`,
          `Nagawa na ang "${created.accountName}" demo wallet.`,
        ),
      );
    } finally {
      setWalletBusy(false);
    }
  };

  const handleUpdateWallet = async (
    accountId: string,
    patch: UpdatePaperAccountInput,
  ) => {
    setWalletBusy(true);
    try {
      const updated = await updatePaperAccount(accountId, patch);
      setAccounts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      if (patch.simulateFeesSpread !== undefined) {
        showToast(
          'info',
          patch.simulateFeesSpread
            ? t(
                'Realistic Fees & Spread enabled for this wallet.',
                'Naka-ON na ang Realistic Fee at Spread para sa wallet na ito.',
              )
            : t(
                'Clean Zero-Cost mode enabled for this wallet.',
                'Naka-OFF na ang Fee at Spread (Clean Mode).',
              ),
        );
      }
    } finally {
      setWalletBusy(false);
    }
  };

  const handleResetWallet = async (accountId: string) => {
    setWalletBusy(true);
    try {
      const reset = await resetPaperAccount(accountId);
      setAccounts((prev) => prev.map((item) => (item.id === reset.id ? reset : item)));
      setPositions([]);
      setTrades([]);
      showToast(
        'info',
        t(
          `Reset "${reset.accountName}" to starting balance.`,
          `Na-reset na ang "${reset.accountName}" sa starting balance.`,
        ),
      );
    } finally {
      setWalletBusy(false);
    }
  };

  const handleDeleteWallet = async (accountId: string) => {
    const target = accounts.find((item) => item.id === accountId);
    setWalletBusy(true);
    try {
      await deletePaperAccount(accountId);
      const remaining = accounts.filter((item) => item.id !== accountId);
      setAccounts(remaining);
      if (remaining.length > 0) {
        setActiveAccountId(remaining[0].id);
        lastFocusedAccountIdRef.current = '';
      } else {
        setActiveAccountId('');
        setPositions([]);
        setTrades([]);
      }
      showToast(
        'info',
        t(
          `Deleted "${target?.accountName ?? 'demo wallet'}".`,
          `Nabura na ang "${target?.accountName ?? 'demo wallet'}".`,
        ),
      );
    } finally {
      setWalletBusy(false);
    }
  };

  // Order & position handlers
  const handlePlaceOrder = async (
    orderInput: Omit<PlacePaperOrderInput, 'accountId'>,
  ) => {
    if (!activeAccount) return;
    setOrderSubmitting(true);
    try {
      const created = await placePaperOrder({
        ...orderInput,
        accountId: activeAccount.id,
      });
      setPositions((prev) => [created, ...prev]);
      showToast(
        'bull',
        created.status === 'pending'
          ? t(
              `Pending limit placed on ${created.symbol}.`,
              `Nailagay na ang pending limit order sa ${created.symbol}.`,
            )
          : t(
              `${created.direction === 'long' ? 'Long' : 'Short'} opened on ${created.symbol}.`,
              `Bukas na ang ${created.direction === 'long' ? 'Long' : 'Short'} trade sa ${created.symbol}.`,
            ),
      );
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleMoveToBreakeven = async (positionId: string) => {
    setBusyPositionId(positionId);
    try {
      const updated = await movePositionToBreakeven(positionId);
      setPositions((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      showToast(
        'info',
        t(
          `${updated.symbol} SL (Stop Loss) moved to BE (Breakeven).`,
          `Nailipat na ang SL (Stop Loss) ng ${updated.symbol} sa BE (Breakeven).`,
        ),
      );
    } finally {
      setBusyPositionId(null);
    }
  };

  const handleClosePosition = async (positionId: string, markPrice: number) => {
    setBusyPositionId(positionId);
    try {
      const result = await closePositionAtMarket(positionId, markPrice, 'manual_close');
      setPositions((prev) => prev.filter((item) => item.id !== positionId));
      setTrades((prev) => [result.trade, ...prev]);
      setAccounts((prev) =>
        prev.map((item) => (item.id === result.account.id ? result.account : item)),
      );
      showToast(
        result.trade.pnlAmount >= 0 ? 'bull' : 'bear',
        `${result.trade.symbol} closed: ${formatSignedMoney(result.trade.pnlAmount)}`,
      );
    } finally {
      setBusyPositionId(null);
    }
  };

  const handleCancelPending = async (positionId: string) => {
    setBusyPositionId(positionId);
    try {
      await cancelPendingOrder(positionId);
      setPositions((prev) => prev.filter((item) => item.id !== positionId));
      showToast('info', t('Pending limit order cancelled.', 'Nakansela na ang limit order.'));
    } finally {
      setBusyPositionId(null);
    }
  };

  const handleSyncToJournal = async (tradeId: string) => {
    setSyncingTradeId(tradeId);
    try {
      const updated = await syncPaperTradeToJournal(tradeId);
      setTrades((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      showToast(
        'bull',
        t(
          'Trade logged to your Risk & Journal desk.',
          'Naka-save na ang trade sa Risk & Journal mo.',
        ),
      );
    } finally {
      setSyncingTradeId(null);
    }
  };

  // AssetSelectorBar handlers
  const handleAssetClassChange = (nextClass: SelectableAssetClass) => {
    setAssetClass(nextClass);
    const first = getFirstSymbolForAssetClass(nextClass);
    setSymbol(first.symbol);
    setCsvNote(null);
  };

  const handleDatePresetChange = (preset: DateRangePreset) => {
    setDatePreset(preset);
    const windowRange = computePresetDateWindow(preset);
    setStartDate(windowRange.startDate);
    setEndDate(windowRange.endDate);
  };

  const handleManualRefresh = () => {
    setRefreshNonce((prev) => prev + 1);
    void pollLiveQuote(true);
  };

  // TradingView Drawing Rail handlers
  const handleAddHorizontalLine = () => {
    if (!Number.isFinite(currentMarketPrice) || currentMarketPrice <= 0) {
      return;
    }
    const sym = symbolOption.symbol;
    const roundedPrice = roundChartPrice(currentMarketPrice, symbolOption.decimals);
    setUserLinesBySymbol((prev) => {
      const existing = prev[sym] ?? [];
      const nextLine: UserHorizontalLine = {
        id: `hline-${sym}-${Date.now()}-${existing.length + 1}`,
        price: roundedPrice,
        label: `H-Line ${existing.length + 1}`,
      };
      return {
        ...prev,
        [sym]: [...existing, nextLine],
      };
    });
    setActiveDrawingTool('hline');
    showToast(
      'info',
      t(
        `Added H-Line at ${roundedPrice.toFixed(symbolOption.decimals)} on ${sym}.`,
        `Naglagay ng H-Line sa ${roundedPrice.toFixed(symbolOption.decimals)} sa ${sym}.`,
      ),
    );
  };

  const handleToggleSessionHL = () => {
    const sym = symbolOption.symbol;
    const nextEnabled = !showSessionHL;
    setShowSessionHLBySymbol((prev) => ({
      ...prev,
      [sym]: nextEnabled,
    }));
    setActiveDrawingTool(nextEnabled ? 'session_hl' : 'crosshair');
  };

  const handleApplyQuickSetup = (direction: 'long' | 'short') => {
    if (!Number.isFinite(currentMarketPrice) || currentMarketPrice <= 0) {
      return;
    }
    const setup = computeQuickPositionSetup(
      direction,
      currentMarketPrice,
      liveCandles,
      symbolOption.decimals,
    );
    setQuickSetup(setup);
    setQuickSetupNonce((prev) => prev + 1);
    setActiveDrawingTool(direction === 'long' ? 'long_tool' : 'short_tool');
    showToast(
      direction === 'long' ? 'bull' : 'bear',
      t(
        `Pre-filled ${direction === 'long' ? 'Long' : 'Short'} 1:2 RR setup (SL ${setup.stopLoss.toFixed(symbolOption.decimals)} / TP ${setup.takeProfit.toFixed(symbolOption.decimals)}).`,
        `Na-fill na ang ${direction === 'long' ? 'Long' : 'Short'} 1:2 RR setup sa Order Ticket.`,
      ),
    );
  };

  const handleClearDrawings = () => {
    const sym = symbolOption.symbol;
    setUserLinesBySymbol((prev) => {
      const next = { ...prev };
      delete next[sym];
      return next;
    });
    setShowSessionHLBySymbol((prev) => ({
      ...prev,
      [sym]: false,
    }));
    setActiveDrawingTool('crosshair');
    showToast(
      'info',
      t(`Cleared drawings on ${sym}.`, `Nabura na ang mga linya sa ${sym}.`),
    );
  };

  const handleWatchlistSelect = (nextOption: MarketSymbolOption) => {
    setAssetClass(nextOption.assetClass);
    setSymbol(nextOption.symbol);
    setCsvNote(null);
  };

  const feedMeta = formatFeedBadge(liveQuote?.source ?? null);

  // Loading state
  if (loadingAccounts) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center py-6 tl-page-enter">
        <div className="inline-flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-surface px-4 py-3 text-xs font-medium text-terminal-muted">
          <Loader2 className="h-4 w-4 animate-spin text-brand" aria-hidden="true" />
          {t('Loading your demo wallets…', 'Binubuksan ang mga demo wallet mo…')}
        </div>
      </div>
    );
  }

  // Empty State when all wallets have been deleted
  if (!activeAccount) {
    return (
      <div className="mx-auto max-w-3xl py-8 tl-page-enter">
        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-6 text-center sm:p-8">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-md border border-amber-500/35 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            VIRTUAL DEMO — NOT REAL MONEY
          </div>

          <div className="mx-auto mt-5 flex h-11 w-11 items-center justify-center rounded-md border border-terminal-border bg-terminal-bg text-brand-text">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </div>

          <h1 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-terminal-text sm:text-2xl">
            {t(copy.emptyWalletsTitle.en, copy.emptyWalletsTitle.taglish)}
          </h1>
          <p className="mx-auto mt-2 max-w-[54ch] text-xs leading-relaxed text-terminal-muted sm:text-sm">
            {t(copy.emptyWalletsBody.en, copy.emptyWalletsBody.taglish)}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              disabled={walletBusy}
              onClick={() =>
                void handleCreateWallet({
                  accountName: 'Crypto Demo',
                  marketFocus: 'crypto',
                  startingBalance: 10000,
                  dailyLossLimitPct: 3,
                  maxRiskPerTradePct: 1,
                  simulateFeesSpread: true,
                })
              }
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 disabled:opacity-60 tl-press"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Crypto Demo ($10,000)
            </button>

            <button
              type="button"
              disabled={walletBusy}
              onClick={() =>
                void handleCreateWallet({
                  accountName: 'Forex Demo',
                  marketFocus: 'forex',
                  startingBalance: 10000,
                  dailyLossLimitPct: 3,
                  maxRiskPerTradePct: 1,
                  simulateFeesSpread: true,
                })
              }
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-terminal-border bg-terminal-bg px-4 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:text-brand-text disabled:opacity-60 tl-press"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Forex Demo ($10,000)
            </button>

            <button
              type="button"
              disabled={walletBusy}
              onClick={() => setEmptyCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-dashed border-brand/50 bg-terminal-bg px-4 py-2 text-xs font-semibold text-brand-text transition-colors hover:bg-brand-soft disabled:opacity-60 tl-press"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              {t('Custom Wallet', 'Custom na Wallet')}
            </button>
          </div>
        </div>

        <CreateWalletModal
          open={emptyCreateModalOpen}
          submitting={walletBusy}
          onClose={() => setEmptyCreateModalOpen(false)}
          onSubmit={handleCreateWallet}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-[1400px] space-y-4 tl-page-enter">
      {/* Unboxed Editorial Workstation Title Row */}
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-terminal-border pb-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text sm:text-2xl">
            {t('Paper Trading Simulator', 'Paper Trading Simulator')}
          </h1>
          <p className="max-w-[65ch] text-xs leading-relaxed text-terminal-muted sm:text-sm">
            {t(
              'Practice live market execution with virtual demo wallets, position sizing, and realistic fees.',
              'Mag-practice ng live market execution gamit ang virtual demo wallets, tamang position sizing, at realistic fees.',
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 font-mono text-xs tabular-nums text-terminal-muted">
          <span className="font-semibold text-terminal-text">{symbolOption.symbol}</span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span>{timeframe.toUpperCase()}</span>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 text-xs font-semibold ${
            toast.tone === 'bull'
              ? 'border-bull/40 bg-bull/10 text-bull'
              : toast.tone === 'bear'
                ? 'border-bear/40 bg-bear/10 text-bear'
                : 'border-brand/35 bg-brand-soft text-terminal-text'
          }`}
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="break-words">{toast.text}</span>
          </span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
            className="shrink-0 rounded-md p-0.5 opacity-75 transition-opacity hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* 1. Demo Wallets & Account KPI Header */}
      <DemoAccountHeader
        accounts={accounts}
        activeAccount={activeAccount}
        accountEquityMap={accountEquityMap}
        metrics={metrics}
        busy={walletBusy}
        onSelectAccount={(nextId) => {
          setActiveAccountId(nextId);
        }}
        onCreateAccount={handleCreateWallet}
        onUpdateAccount={handleUpdateWallet}
        onResetAccount={handleResetWallet}
        onDeleteAccount={handleDeleteWallet}
      />

      {/* 2. Reusable Market / Asset Selector Bar */}
      <AssetSelectorBar
        assetClass={assetClass}
        symbol={symbolOption.symbol}
        timeframe={timeframe}
        dataSource={dataSource}
        dataNote={dataNote}
        fetchedAt={fetchedAt}
        loading={loadingChart}
        csvError={csvNote}
        startDate={startDate}
        endDate={endDate}
        datePreset={datePreset}
        onAssetClassChange={handleAssetClassChange}
        onSymbolChange={(nextSym) => {
          setSymbol(nextSym);
          setCsvNote(null);
        }}
        onTimeframeChange={setTimeframe}
        onStartDateChange={(val) => {
          setStartDate(val);
          setDatePreset(null);
        }}
        onEndDateChange={(val) => {
          setEndDate(val);
          setDatePreset(null);
        }}
        onDatePresetChange={handleDatePresetChange}
        onRefresh={handleManualRefresh}
        onCsvFile={() => {
          setCsvNote(
            t(
              'Custom CSV upload is used in the Replay Simulator. Paper Trading uses live & practice market feeds.',
              'Para sa Replay Simulator ang CSV upload. Live at practice feed ang gamit sa Paper Trading.',
            ),
          );
        }}
      />

      {/* 3. Main Desk Grid: Chart + Drawing Rail + Optional Watchlist (left) + Order Ticket (right) */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <div className="min-w-0 space-y-2.5 lg:col-span-8">
          {/* Compact Live Feed Ticker Strip + Watchlist Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${feedMeta.pillClass}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${feedMeta.dotClass}`}
                  aria-hidden="true"
                />
                {feedMeta.label}
              </span>
              <span className="font-mono text-xs font-semibold text-terminal-text tabular-nums">
                {symbolOption.symbol} · {currentMarketPrice.toFixed(symbolOption.decimals)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-terminal-muted">
                <Radio className="h-3 w-3 text-brand-text" aria-hidden="true" />
                {symbolOption.assetClass === 'crypto' ? '5s auto-sync' : '15s auto-sync'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-pressed={watchlistOpen}
                onClick={() => setWatchlistOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors tl-press ${
                  watchlistOpen
                    ? 'border-brand bg-brand-soft text-brand-text'
                    : 'border-terminal-border bg-terminal-bg text-terminal-text hover:border-brand/50 hover:text-brand-text'
                }`}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
                {t('Watchlist', 'Watchlist')}
              </button>

              <button
                type="button"
                disabled={refreshingQuote}
                onClick={handleManualRefresh}
                className="inline-flex items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-bg px-2.5 py-1 text-[11px] font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:text-brand-text disabled:opacity-60 tl-press"
              >
                <RefreshCw
                  className={`h-3 w-3 ${refreshingQuote ? 'animate-spin text-brand' : ''}`}
                  aria-hidden="true"
                />
                {t('Refresh', 'I-Refresh')}
              </button>
            </div>
          </div>

          {/* Chart Workspace: Left Drawing Rail + Interactive Chart + Collapsible Watchlist */}
          <div
            className={
              watchlistOpen
                ? 'grid min-w-0 grid-cols-1 items-start gap-2.5 xl:grid-cols-[minmax(0,1fr)_235px]'
                : 'min-w-0'
            }
          >
            <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-stretch">
              <TradingViewDrawingRail
                activeTool={activeDrawingTool}
                onSelectTool={setActiveDrawingTool}
                onAddHorizontalLine={handleAddHorizontalLine}
                showSessionHL={showSessionHL}
                onToggleSessionHL={handleToggleSessionHL}
                drawingCount={currentUserLines.length}
                onClearDrawings={handleClearDrawings}
                onApplyQuickSetup={handleApplyQuickSetup}
                disabled={loadingChart || liveCandles.length === 0}
              />

              <div className="min-w-0 flex-1">
                <InteractiveCandleChart
                  candles={liveCandles}
                  priceLines={chartPriceLines}
                  symbol={symbolOption.symbol}
                  timeframe={timeframe.toUpperCase()}
                  height={380}
                />
              </div>
            </div>

            {watchlistOpen && (
              <TradingViewWatchlist
                activeSymbol={symbolOption.symbol}
                priceMap={priceMap}
                onSelectSymbol={handleWatchlistSelect}
                onClose={() => setWatchlistOpen(false)}
              />
            )}
          </div>
        </div>

        <div className="min-w-0 lg:col-span-4">
          <PaperOrderTicket
            account={activeAccount}
            symbolOption={symbolOption}
            currentPrice={currentMarketPrice}
            dailyLossLimitReached={metrics.dailyLossLimitReached}
            submitting={orderSubmitting}
            quickSetup={quickSetup}
            quickSetupNonce={quickSetupNonce}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>

      {/* 4. Open Positions, Pending Limits & Closed History */}
      <PaperPositionsPanel
        account={activeAccount}
        positions={positions}
        trades={trades}
        priceMap={priceMap}
        busyPositionId={busyPositionId}
        syncingTradeId={syncingTradeId}
        onMoveToBreakeven={handleMoveToBreakeven}
        onClosePosition={handleClosePosition}
        onCancelPending={handleCancelPending}
        onSyncToJournal={handleSyncToJournal}
      />
    </div>
  );
}
