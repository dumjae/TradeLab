import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { MARKET_SYMBOLS } from '../../data/marketCatalog';
import type { AssetClass, MarketSymbolOption } from '../../types/backtest';

type WatchlistFilter = 'all' | Exclude<AssetClass, 'custom_csv'>;

const FILTER_TABS: Array<{ id: WatchlistFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'commodities', label: 'Gold' },
];

function getShortAssetTag(assetClass: AssetClass): string {
  switch (assetClass) {
    case 'crypto':
      return 'CRYPTO';
    case 'forex':
      return 'FX';
    case 'indices':
      return 'INDEX';
    case 'stocks':
      return 'STOCK';
    case 'commodities':
      return 'METAL';
    default:
      return 'CSV';
  }
}

function formatWatchlistPrice(price: number, decimals: number): string {
  if (!Number.isFinite(price)) {
    return '—';
  }
  return price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export interface TradingViewWatchlistProps {
  activeSymbol: string;
  priceMap: Record<string, number>;
  onSelectSymbol: (symbolOption: MarketSymbolOption) => void;
  onClose?: () => void;
}

export function TradingViewWatchlist({
  activeSymbol,
  priceMap,
  onSelectSymbol,
  onClose,
}: TradingViewWatchlistProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<WatchlistFilter>('all');

  const filteredSymbols = useMemo(() => {
    if (filter === 'all') {
      return MARKET_SYMBOLS;
    }
    return MARKET_SYMBOLS.filter((item) => item.assetClass === filter);
  }, [filter]);

  return (
    <aside
      aria-label={t('Market Watchlist', 'Watchlist ng mga Market')}
      className="flex flex-col overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-terminal-border px-3 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold tracking-wide text-terminal-text">
            {t('Watchlist', 'Watchlist')}
          </h2>
          <span className="rounded bg-terminal-elevated px-1.5 py-0.5 font-mono text-[10px] font-semibold text-terminal-muted tabular-nums">
            {filteredSymbols.length}
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            aria-label={t('Close watchlist', 'Isara ang watchlist')}
            onClick={onClose}
            className="rounded-md p-1 text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Category Filter Strip */}
      <div
        role="group"
        aria-label={t('Filter watchlist by market', 'I-filter ang watchlist')}
        className="flex items-center gap-1 overflow-x-auto border-b border-terminal-border px-2 py-1.5 no-scrollbar"
      >
        {FILTER_TABS.map((tab) => {
          const isSelected = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setFilter(tab.id)}
              className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                isSelected
                  ? 'bg-brand text-brand-fg'
                  : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-terminal-border bg-terminal-bg/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-terminal-muted">
        <span>{t('Symbol', 'Simbolo')}</span>
        <span className="text-right">{t('Last', 'Presyo')}</span>
      </div>

      {/* Compact Tabular Rows */}
      <div className="max-h-[312px] divide-y divide-terminal-border/60 overflow-y-auto">
        {filteredSymbols.map((item) => {
          const isActive = item.symbol === activeSymbol;
          const livePrice = priceMap[item.symbol];
          const hasLiveQuote =
            typeof livePrice === 'number' && Number.isFinite(livePrice) && livePrice > 0;
          const displayPrice = hasLiveQuote ? livePrice : item.basePrice;

          return (
            <button
              key={item.symbol}
              type="button"
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelectSymbol(item)}
              className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-l-2 px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${
                isActive
                  ? 'border-brand bg-brand-soft'
                  : 'border-transparent hover:bg-terminal-elevated/70'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`truncate font-mono text-xs font-semibold ${
                      isActive ? 'text-brand-text' : 'text-terminal-text'
                    }`}
                  >
                    {item.symbol}
                  </span>
                  <span className="shrink-0 rounded border border-terminal-border/80 bg-terminal-bg px-1 py-px font-mono text-[9px] font-medium text-terminal-muted">
                    {getShortAssetTag(item.assetClass)}
                  </span>
                </div>
                <p className="truncate text-[10px] text-terminal-muted">
                  {item.displayName}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-right">
                {hasLiveQuote && (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-bull"
                  />
                )}
                <span className="font-mono text-xs font-semibold text-terminal-text tabular-nums">
                  {formatWatchlistPrice(displayPrice, item.decimals)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
