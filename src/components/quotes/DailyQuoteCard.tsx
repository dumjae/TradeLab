import { useCallback, useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Flame,
  Heart,
  Pin,
  Quote,
  RefreshCw,
} from 'lucide-react';
import {
  getDailyQuote,
  listQuotes,
  toggleFavoriteQuote,
  togglePinQuote,
} from '../../services/quotesService';
import type { QuoteCategory, QuoteWithUserState } from '../../types/quotes';

export interface DailyQuoteCardProps {
  onOpenVault?: () => void;
  conceptKey?: string;
}

const CATEGORIES: Array<{ id: QuoteCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Daily' },
  { id: 'motivate', label: 'Motivate' },
  { id: 'teach', label: 'Teach' },
  { id: 'inspire', label: 'Inspire' },
];

export function DailyQuoteCard({ onOpenVault, conceptKey }: DailyQuoteCardProps) {
  const [quote, setQuote] = useState<QuoteWithUserState | null>(null);
  const [pool, setPool] = useState<QuoteWithUserState[]>([]);
  const [category, setCategory] = useState<QuoteCategory | 'all'>('all');
  const [showLessonNote, setShowLessonNote] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadQuotes = useCallback(
    async (selectedCategory: QuoteCategory | 'all') => {
      setLoading(true);
      try {
        if (selectedCategory === 'all') {
          const [daily, all] = await Promise.all([
            getDailyQuote(conceptKey),
            listQuotes({}),
          ]);
          setQuote(daily);
          setPool(all);
        } else {
          const filtered = await listQuotes({ category: selectedCategory });
          setPool(filtered);
          setQuote(filtered[0] ?? null);
        }
      } finally {
        setLoading(false);
      }
    },
    [conceptKey],
  );

  useEffect(() => {
    void loadQuotes(category);
  }, [category, loadQuotes]);

  const handleShuffle = () => {
    if (pool.length <= 1 || !quote) {
      return;
    }
    const candidates = pool.filter((item) => item.id !== quote.id);
    const next = candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
    setQuote(next);
  };

  const handleToggleFavorite = async () => {
    if (!quote) {
      return;
    }
    const nextFavorite = await toggleFavoriteQuote(quote.id);
    const updated: QuoteWithUserState = {
      ...quote,
      isFavorite: nextFavorite,
      isPinned: nextFavorite ? quote.isPinned : false,
    };
    setQuote(updated);
    setPool((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleTogglePin = async () => {
    if (!quote) {
      return;
    }
    const nextPinned = await togglePinQuote(quote.id);
    const updated: QuoteWithUserState = {
      ...quote,
      isPinned: nextPinned,
      isFavorite: nextPinned ? true : quote.isFavorite,
    };
    setQuote(updated);
    setPool((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const sourceLabel =
    quote?.sourceType === 'verified_trader'
      ? 'Verified Trader'
      : quote?.sourceType === 'tradelab_principle'
        ? 'TradeLab Principle'
        : 'Personal Rule';

  return (
    <section
      aria-labelledby="daily-wisdom-heading"
      className="rounded-3xl border border-amber-500/20 bg-terminal-surface p-6 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <Quote className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="daily-wisdom-heading"
              className="text-sm font-semibold text-terminal-text"
            >
              Daily Trading Wisdom
            </h2>
            <p className="text-xs text-terminal-muted">
              Steady mindset before reading the charts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === tab.id
                  ? 'bg-amber-500 font-semibold text-slate-950'
                  : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !quote ? (
        <div className="mt-5 h-24 animate-pulse rounded-2xl bg-terminal-elevated/60" />
      ) : (
        <div className="mt-5 space-y-5">
          <blockquote className="text-base font-medium leading-relaxed text-terminal-text sm:text-lg">
            “{quote.quoteText}”
          </blockquote>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="font-semibold text-terminal-text">{quote.author}</span>
              <span className="text-terminal-muted">· {quote.authorRole}</span>
              <span className="rounded-full bg-terminal-elevated px-2.5 py-0.5 text-[11px] font-medium text-terminal-muted">
                {sourceLabel}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShuffle}
                aria-label="Shuffle trading quote"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg px-3.5 text-xs font-medium text-terminal-muted transition-colors hover:border-amber-500/45 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Shuffle
              </button>
              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-label={quote.isFavorite ? 'Remove from favorites' : 'Favorite quote'}
                aria-pressed={quote.isFavorite}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  quote.isFavorite
                    ? 'border-rose-500/40 bg-rose-500/15 text-rose-500 dark:text-rose-400'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-rose-500 dark:hover:text-rose-400'
                }`}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${quote.isFavorite ? 'fill-current' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={handleTogglePin}
                aria-label={quote.isPinned ? 'Unpin quote' : 'Pin quote'}
                aria-pressed={quote.isPinned}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  quote.isPinned
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-amber-500 dark:hover:text-amber-400'
                }`}
              >
                <Pin className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-terminal-border/70 pt-4">
            <button
              type="button"
              onClick={() => setShowLessonNote((prev) => !prev)}
              aria-expanded={showLessonNote}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 transition-colors hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
            >
              {showLessonNote ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Trading Lesson Takeaway
            </button>

            {onOpenVault && (
              <button
                type="button"
                onClick={onOpenVault}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                Open Mindset Vault
              </button>
            )}
          </div>

          {showLessonNote && (
            <p className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs leading-relaxed text-terminal-text">
              {quote.tradingLessonNote}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
