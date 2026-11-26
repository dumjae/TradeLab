import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { LineChart } from 'lucide-react';
import { AssetSelectorBar, type SelectableAssetClass } from '../components/backtest/AssetSelectorBar';
import { BacktestChartCanvas } from '../components/backtest/BacktestChartCanvas';
import { BacktestMetricsPanel } from '../components/backtest/BacktestMetricsPanel';
import { OrderTicketPanel } from '../components/backtest/OrderTicketPanel';
import { ReplayControlsBar, type ReplaySpeed } from '../components/backtest/ReplayControlsBar';
import { MARKET_SYMBOLS, getMarketSymbol } from '../data/marketCatalog';
import {
  closePositionManually,
  computeBacktestMetrics,
  evaluateCandleAgainstPositions,
  movePositionToBreakeven,
  openBacktestPosition,
  parseOhlcvCsv,
} from '../lib/backtestEngine';
import {
  deleteBacktestSession,
  listBacktestSessions,
  saveBacktestSession,
} from '../services/backtestService';
import { fetchMarketCandles } from '../services/marketDataService';
import type { CandlePoint } from '../types/academy';
import type {
  BacktestDirection,
  BacktestPosition,
  BacktestSession,
  BacktestTrade,
  MarketCandlesResponse,
  MarketTimeframe,
} from '../types/backtest';

interface ReplayState {
  replayIndex: number;
  openPositions: BacktestPosition[];
  trades: BacktestTrade[];
  stepped: boolean;
}

type ReplayAction =
  | { type: 'reset'; startIndex: number }
  | { type: 'step'; bars: number; candles: CandlePoint[] }
  | { type: 'open'; position: BacktestPosition }
  | { type: 'breakeven'; id: string }
  | { type: 'close'; id: string; candle: CandlePoint }
  | { type: 'close_all'; candle: CandlePoint };

function replayReducer(state: ReplayState, action: ReplayAction): ReplayState {
  switch (action.type) {
    case 'reset':
      return { replayIndex: action.startIndex, openPositions: [], trades: [], stepped: false };
    case 'step': {
      let { replayIndex, openPositions } = state;
      const trades = [...state.trades];
      for (let i = 0; i < action.bars; i += 1) {
        if (replayIndex >= action.candles.length - 1) {
          break;
        }
        replayIndex += 1;
        const result = evaluateCandleAgainstPositions(action.candles[replayIndex], openPositions);
        openPositions = result.remainingPositions;
        trades.push(...result.closedTrades);
      }
      return { replayIndex, openPositions, trades, stepped: true };
    }
    case 'open':
      return { ...state, openPositions: [...state.openPositions, action.position] };
    case 'breakeven':
      return {
        ...state,
        openPositions: state.openPositions.map((position) =>
          position.id === action.id ? movePositionToBreakeven(position) : position,
        ),
      };
    case 'close': {
      const target = state.openPositions.find((position) => position.id === action.id);
      if (!target) {
        return state;
      }
      return {
        ...state,
        openPositions: state.openPositions.filter((position) => position.id !== action.id),
        trades: [
          ...state.trades,
          closePositionManually(target, action.candle.close, action.candle.time),
        ],
      };
    }
    case 'close_all':
      return {
        ...state,
        openPositions: [],
        trades: [
          ...state.trades,
          ...state.openPositions.map((position) =>
            closePositionManually(position, action.candle.close, action.candle.time, 'end_of_data'),
          ),
        ],
      };
    default:
      return state;
  }
}

function priceDecimals(price: number): number {
  if (price >= 1000) return 2;
  if (price >= 100) return 3;
  if (price >= 1) return 4;
  return 5;
}

function defaultStartIndex(length: number): number {
  return Math.max(0, Math.min(Math.max(40, Math.floor(length * 0.3)), length - 2));
}

export function BacktestPage() {
  const [assetClass, setAssetClass] = useState<SelectableAssetClass>('crypto');
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [timeframe, setTimeframe] = useState<MarketTimeframe>('15m');
  const [market, setMarket] = useState<MarketCandlesResponse | null>(null);
  const [csvMarket, setCsvMarket] = useState<MarketCandlesResponse | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startingBalance, setStartingBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [playing, setPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<ReplaySpeed>(1);
  const [sessions, setSessions] = useState<BacktestSession[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [state, dispatch] = useReducer(replayReducer, {
    replayIndex: 0,
    openPositions: [],
    trades: [],
    stepped: false,
  });

  const active = csvMarket ?? market;
  const candles = useMemo(() => active?.candles ?? [], [active]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMarketCandles(symbol, timeframe)
      .then((response) => {
        if (!cancelled) setMarket(response);
      })
      .catch(() => {
        if (!cancelled) setMarket(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [symbol, timeframe]);

  useEffect(() => {
    setPlaying(false);
    dispatch({ type: 'reset', startIndex: defaultStartIndex(candles.length) });
  }, [candles]);

  useEffect(() => {
    void listBacktestSessions().then(setSessions);
  }, []);

  const atEnd = candles.length === 0 || state.replayIndex >= candles.length - 1;

  useEffect(() => {
    if (atEnd) setPlaying(false);
  }, [atEnd]);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(
      () => dispatch({ type: 'step', bars: 1, candles }),
      Math.round(1000 / speed),
    );
    return () => window.clearInterval(timer);
  }, [playing, speed, candles]);

  const metrics = useMemo(
    () => computeBacktestMetrics(startingBalance, state.trades),
    [startingBalance, state.trades],
  );

  const currentCandle = candles[state.replayIndex];
  const lastPrice = currentCandle?.close ?? 0;
  const meta = active ? getMarketSymbol(active.symbol) : undefined;
  const decimals = meta?.decimals ?? priceDecimals(lastPrice);
  const settingsLocked =
    state.stepped || state.openPositions.length > 0 || state.trades.length > 0;

  const handleAssetClass = (next: SelectableAssetClass) => {
    const first = MARKET_SYMBOLS.find((item) => item.assetClass === next);
    setCsvMarket(null);
    setCsvError(null);
    setAssetClass(next);
    if (first) setSymbol(first.symbol);
  };

  const handleSymbol = (next: string) => {
    setCsvMarket(null);
    setCsvError(null);
    setSymbol(next);
  };

  const handleTimeframe = (next: MarketTimeframe) => {
    setCsvMarket(null);
    setCsvError(null);
    setTimeframe(next);
  };

  const handleCsvFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseOhlcvCsv(text);
    if (parsed.error || parsed.candles.length < 30) {
      setCsvError(parsed.error ?? 'CSV needs at least 30 valid candles to backtest.');
      return;
    }
    setCsvError(null);
    const label =
      file.name
        .replace(/\.[^.]+$/, '')
        .toUpperCase()
        .replace(/[^A-Z0-9._-]/g, '')
        .slice(0, 20) || 'CUSTOM';
    setCsvMarket({
      symbol: label,
      displayName: file.name,
      assetClass: 'custom_csv',
      timeframe,
      dataSource: 'uploaded_csv',
      candles: parsed.candles,
      fetchedAt: new Date().toISOString(),
      note: `Loaded ${parsed.candles.length} candles from ${file.name}. Pick a symbol or timeframe to return to market data.`,
    });
  };

  const handleExecute = (order: {
    direction: BacktestDirection;
    stopLoss: number;
    takeProfit: number | null;
    setupTag: string;
  }): string | null => {
    if (!currentCandle) return 'No candle data loaded yet.';
    const { position, error } = openBacktestPosition({
      direction: order.direction,
      entryTime: currentCandle.time,
      entryPrice: currentCandle.close,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      equity: metrics.currentEquity,
      riskPercent,
      setupTag: order.setupTag,
    });
    if (!position) return error ?? 'Unable to open position.';
    dispatch({ type: 'open', position });
    return null;
  };

  const handleSave = useCallback(
    async (notes: string) => {
      if (!active || !currentCandle) return;
      const finalTrades = [
        ...state.trades,
        ...state.openPositions.map((position) =>
          closePositionManually(position, currentCandle.close, currentCandle.time, 'end_of_data'),
        ),
      ];
      if (finalTrades.length === 0) {
        setSaveMessage('Place at least one trade before saving a session.');
        return;
      }
      setSaving(true);
      try {
        dispatch({ type: 'close_all', candle: currentCandle });
        await saveBacktestSession({
          symbol: active.symbol,
          assetClass: active.assetClass,
          timeframe,
          dataSource: active.dataSource,
          startingBalance,
          riskPercent,
          metrics: computeBacktestMetrics(startingBalance, finalTrades),
          trades: finalTrades,
          notes,
        });
        setSessions(await listBacktestSessions());
        setSaveMessage('Session saved.');
      } catch (error) {
        setSaveMessage(error instanceof Error ? error.message : 'Failed to save session.');
      } finally {
        setSaving(false);
      }
    },
    [active, currentCandle, state, timeframe, startingBalance, riskPercent],
  );

  const handleDeleteSession = async (sessionId: string) => {
    await deleteBacktestSession(sessionId);
    setSessions(await listBacktestSessions());
  };

  const maxStart = Math.max(1, Math.floor(candles.length * 0.8));

  return (
    <div className="mx-auto max-w-[1400px] space-y-4">
      <header className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400">
          <LineChart className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-lg font-bold text-terminal-text">Market Backtester</h1>
          <p className="text-xs text-terminal-muted">
            Replay Crypto, Forex, Indices, Stocks and Commodities bar by bar. Future candles stay
            hidden; SL fills first if SL and TP touch in one candle.
          </p>
        </div>
      </header>

      <AssetSelectorBar
        assetClass={assetClass}
        symbol={symbol}
        timeframe={timeframe}
        dataSource={active?.dataSource ?? null}
        dataNote={active?.note}
        loading={loading}
        csvError={csvError}
        onAssetClassChange={handleAssetClass}
        onSymbolChange={handleSymbol}
        onTimeframeChange={handleTimeframe}
        onCsvFile={(file) => void handleCsvFile(file)}
      />

      {candles.length === 0 ? (
        <div
          role="status"
          className="rounded-xl border border-dashed border-terminal-border bg-terminal-surface p-10 text-center text-xs text-terminal-muted"
        >
          {loading ? 'Loading market candles…' : 'No candles available. Try another symbol or upload a CSV.'}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4">
            <BacktestChartCanvas
              candles={candles}
              replayIndex={state.replayIndex}
              symbol={active?.symbol ?? symbol}
              timeframe={timeframe}
              openPositions={state.openPositions}
              trades={state.trades}
              decimals={decimals}
            />
            <ReplayControlsBar
              totalBars={candles.length}
              replayIndex={state.replayIndex}
              minStartIndex={Math.min(20, candles.length - 2)}
              maxStartIndex={maxStart}
              startLocked={settingsLocked}
              playing={playing}
              speed={speed}
              atEnd={atEnd}
              onStep={(bars) => dispatch({ type: 'step', bars, candles })}
              onTogglePlay={() => setPlaying((prev) => !prev)}
              onSpeedChange={setSpeed}
              onStartIndexChange={(index) => dispatch({ type: 'reset', startIndex: index })}
              onReset={() => {
                setPlaying(false);
                dispatch({ type: 'reset', startIndex: defaultStartIndex(candles.length) });
              }}
            />
            <BacktestMetricsPanel
              metrics={metrics}
              trades={state.trades}
              sessions={sessions}
              decimals={decimals}
              saving={saving}
              saveMessage={saveMessage}
              onSave={(notes) => void handleSave(notes)}
              onDeleteSession={(id) => void handleDeleteSession(id)}
            />
          </div>

          <aside className="min-w-0">
            <OrderTicketPanel
              startingBalance={startingBalance}
              riskPercent={riskPercent}
              currentEquity={metrics.currentEquity}
              settingsLocked={settingsLocked}
              lastPrice={lastPrice}
              decimals={decimals}
              openPositions={state.openPositions}
              onStartingBalanceChange={setStartingBalance}
              onRiskPercentChange={setRiskPercent}
              onExecute={handleExecute}
              onBreakeven={(id) => dispatch({ type: 'breakeven', id })}
              onClose={(id) =>
                currentCandle && dispatch({ type: 'close', id, candle: currentCandle })
              }
            />
          </aside>
        </div>
      )}
    </div>
  );
}
