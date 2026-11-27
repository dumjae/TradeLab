import { useRef, type ChangeEvent } from 'react';
import { Calendar, Database, FileUp, Loader2, RefreshCw } from 'lucide-react';
import { MARKET_SYMBOLS, MARKET_TIMEFRAMES } from '../../data/marketCatalog';
import type { AssetClass, MarketDataSource, MarketTimeframe } from '../../types/backtest';

export type SelectableAssetClass = Exclude<AssetClass, 'custom_csv'>;
export type DateRangePreset = 'latest' | '7d' | '30d' | '90d' | '1y';

const ASSET_TABS: Array<{ id: SelectableAssetClass; label: string }> = [
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'commodities', label: 'Commodities' },
];

const DATE_PRESETS: Array<{ id: DateRangePreset; label: string }> = [
  { id: 'latest', label: 'Latest' },
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
  { id: '1y', label: '1Y' },
];

const SOURCE_LABELS: Record<MarketDataSource, { label: string; tone: string }> = {
  live_binance: {
    label: 'Live Binance',
    tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  live_twelvedata: {
    label: 'Live Twelve Data',
    tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  live_yahoo: {
    label: 'Live Yahoo Finance',
    tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  uploaded_csv: {
    label: 'Uploaded CSV',
    tone: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  offline_sample: {
    label: 'Offline Historical Sample',
    tone: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
};

function formatUpdatedTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface AssetSelectorBarProps {
  assetClass: SelectableAssetClass;
  symbol: string;
  timeframe: MarketTimeframe;
  dataSource: MarketDataSource | null;
  dataNote?: string;
  fetchedAt?: string | null;
  loading: boolean;
  csvError: string | null;
  startDate: string;
  endDate: string;
  datePreset: DateRangePreset | null;
  dateError?: string | null;
  onAssetClassChange: (assetClass: SelectableAssetClass) => void;
  onSymbolChange: (symbol: string) => void;
  onTimeframeChange: (timeframe: MarketTimeframe) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onDatePresetChange: (preset: DateRangePreset) => void;
  onRefresh: () => void;
  onCsvFile: (file: File) => void;
}

export function AssetSelectorBar({
  assetClass,
  symbol,
  timeframe,
  dataSource,
  dataNote,
  fetchedAt,
  loading,
  csvError,
  startDate,
  endDate,
  datePreset,
  dateError,
  onAssetClassChange,
  onSymbolChange,
  onTimeframeChange,
  onStartDateChange,
  onEndDateChange,
  onDatePresetChange,
  onRefresh,
  onCsvFile,
}: AssetSelectorBarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const symbols = MARKET_SYMBOLS.filter((item) => item.assetClass === assetClass);
  const sourceMeta = dataSource ? SOURCE_LABELS[dataSource] : null;
  const updatedTime = formatUpdatedTime(fetchedAt);
  const todayIso = getTodayIso();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCsvFile(file);
    }
    event.target.value = '';
  };

  return (
    <div className="space-y-4 rounded-3xl border border-terminal-border/90 bg-terminal-surface p-4 shadow-sm sm:p-5">
      {/* Asset Class Tabs + Data Source & Refresh */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Asset class"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
        >
          {ASSET_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={assetClass === tab.id}
              onClick={() => onAssetClassChange(tab.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                assetClass === tab.id
                  ? 'bg-brand text-brand-fg shadow-sm'
                  : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {loading && (
            <span
              role="status"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" aria-hidden="true" />
              Loading…
            </span>
          )}

          {sourceMeta && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium ${sourceMeta.tone}`}
            >
              <Database className="h-3 w-3 shrink-0" aria-hidden="true" />
              {sourceMeta.label}
            </span>
          )}

          {updatedTime && (
            <span className="font-mono text-[11px] text-terminal-muted tabular-nums">
              Updated {updatedTime}
            </span>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg px-3 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-emerald-500/45 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-emerald-400"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`}
              aria-hidden="true"
            />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Symbol, Timeframe & CSV Upload */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
        <div className="min-w-0 lg:min-w-[220px]">
          <label
            htmlFor="backtest-symbol"
            className="block text-[11px] font-medium text-terminal-muted"
          >
            Symbol
          </label>
          <select
            id="backtest-symbol"
            name="backtestSymbol"
            aria-label="Market symbol"
            value={symbols.some((item) => item.symbol === symbol) ? symbol : ''}
            onChange={(event) => onSymbolChange(event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-xs font-medium text-terminal-text focus:border-emerald-500 focus:outline-none"
          >
            {symbols.map((item) => (
              <option key={item.symbol} value={item.symbol}>
                {item.symbol} — {item.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <span className="block text-[11px] font-medium text-terminal-muted">Timeframe</span>
          <div
            role="group"
            aria-label="Timeframe"
            className="mt-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
          >
            {MARKET_TIMEFRAMES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={timeframe === item.id}
                onClick={() => onTimeframeChange(item.id)}
                className={`shrink-0 rounded-full px-3 py-2 font-mono text-xs font-semibold transition-colors ${
                  timeframe === item.id
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 lg:ml-auto">
          <input
            id="backtest-csv-upload"
            name="backtestCsvUpload"
            aria-label="Upload TradingView CSV file"
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-sky-500/35 bg-sky-500/10 px-4 py-2.5 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400 lg:w-auto"
          >
            <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
            Upload TradingView CSV
          </button>
        </div>
      </div>

      {/* Date Range Presets & Custom Date Inputs */}
      <div className="space-y-3 border-t border-terminal-border/70 pt-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-terminal-muted">
              <Calendar className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
              Date Window
            </span>
            <div
              role="group"
              aria-label="Date range presets"
              className="mt-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
            >
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={datePreset === preset.id}
                  onClick={() => onDatePresetChange(preset.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    datePreset === preset.id
                      ? 'bg-emerald-500/15 text-emerald-600 ring-1 ring-inset ring-emerald-500/35 dark:text-emerald-400'
                      : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:items-end">
            <div className="min-w-0">
              <label
                htmlFor="backtest-start-date"
                className="block text-[11px] font-medium text-terminal-muted"
              >
                From
              </label>
              <input
                id="backtest-start-date"
                name="startDate"
                aria-label="Start date"
                type="date"
                max={endDate || todayIso}
                value={startDate}
                onChange={(event) => onStartDateChange(event.target.value)}
                className="mt-1 w-full min-w-0 rounded-2xl border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="backtest-end-date"
                className="block text-[11px] font-medium text-terminal-muted"
              >
                To
              </label>
              <input
                id="backtest-end-date"
                name="endDate"
                aria-label="End date"
                type="date"
                min={startDate || undefined}
                max={todayIso}
                value={endDate}
                onChange={(event) => onEndDateChange(event.target.value)}
                className="mt-1 w-full min-w-0 rounded-2xl border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {dateError && (
          <p role="alert" className="text-xs text-rose-500 dark:text-rose-400">
            {dateError}
          </p>
        )}
      </div>

      {dataNote && (
        <p className="rounded-2xl border border-terminal-border/70 bg-terminal-bg/80 px-4 py-2.5 text-xs leading-relaxed text-terminal-muted">
          {dataNote}
        </p>
      )}
      {csvError && (
        <p role="alert" className="text-xs text-rose-500 dark:text-rose-400">
          {csvError}
        </p>
      )}
    </div>
  );
}
