import { useRef, type ChangeEvent } from 'react';
import { Database, FileUp, Loader2 } from 'lucide-react';
import { MARKET_SYMBOLS, MARKET_TIMEFRAMES } from '../../data/marketCatalog';
import type { AssetClass, MarketDataSource, MarketTimeframe } from '../../types/backtest';

export type SelectableAssetClass = Exclude<AssetClass, 'custom_csv'>;

const ASSET_TABS: Array<{ id: SelectableAssetClass; label: string }> = [
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'commodities', label: 'Commodities' },
];

const SOURCE_LABELS: Record<MarketDataSource, { label: string; tone: string }> = {
  live_binance: {
    label: 'Live Binance',
    tone: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400',
  },
  live_twelvedata: {
    label: 'Live Twelve Data',
    tone: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400',
  },
  live_yahoo: {
    label: 'Live Yahoo Finance',
    tone: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400',
  },
  uploaded_csv: {
    label: 'Uploaded CSV',
    tone: 'border-sky-500/35 bg-sky-500/10 text-sky-400',
  },
  offline_sample: {
    label: 'Offline Historical Sample',
    tone: 'border-amber-500/35 bg-amber-500/10 text-amber-400',
  },
};

export interface AssetSelectorBarProps {
  assetClass: SelectableAssetClass;
  symbol: string;
  timeframe: MarketTimeframe;
  dataSource: MarketDataSource | null;
  dataNote?: string;
  loading: boolean;
  csvError: string | null;
  onAssetClassChange: (assetClass: SelectableAssetClass) => void;
  onSymbolChange: (symbol: string) => void;
  onTimeframeChange: (timeframe: MarketTimeframe) => void;
  onCsvFile: (file: File) => void;
}

export function AssetSelectorBar({
  assetClass,
  symbol,
  timeframe,
  dataSource,
  dataNote,
  loading,
  csvError,
  onAssetClassChange,
  onSymbolChange,
  onTimeframeChange,
  onCsvFile,
}: AssetSelectorBarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const symbols = MARKET_SYMBOLS.filter((item) => item.assetClass === assetClass);
  const sourceMeta = dataSource ? SOURCE_LABELS[dataSource] : null;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCsvFile(file);
    }
    event.target.value = '';
  };

  return (
    <div className="space-y-3 rounded-xl border border-terminal-border bg-terminal-surface p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="Asset class" className="flex flex-wrap gap-1">
          {ASSET_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={assetClass === tab.id}
              onClick={() => onAssetClassChange(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                assetClass === tab.id
                  ? 'bg-emerald-500 text-slate-950'
                  : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <span
              role="status"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" aria-hidden="true" />
              Loading candles…
            </span>
          )}
          {sourceMeta && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${sourceMeta.tone}`}
            >
              <Database className="h-3 w-3" aria-hidden="true" />
              {sourceMeta.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
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
            className="mt-1 min-w-[180px] rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
          >
            {symbols.map((item) => (
              <option key={item.symbol} value={item.symbol}>
                {item.symbol} — {item.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-[11px] font-medium text-terminal-muted">Timeframe</span>
          <div role="group" aria-label="Timeframe" className="mt-1 flex gap-1">
            {MARKET_TIMEFRAMES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={timeframe === item.id}
                onClick={() => onTimeframeChange(item.id)}
                className={`rounded-lg px-2.5 py-2 font-mono text-xs font-semibold transition-colors ${
                  timeframe === item.id
                    ? 'bg-sky-500 text-slate-950'
                    : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-400 transition-colors hover:bg-sky-500/20"
          >
            <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
            Upload TradingView CSV
          </button>
        </div>
      </div>

      {dataNote && (
        <p className="rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-[11px] leading-relaxed text-terminal-muted">
          {dataNote}
        </p>
      )}
      {csvError && (
        <p role="alert" className="text-[11px] text-rose-400">
          {csvError}
        </p>
      )}
    </div>
  );
}
