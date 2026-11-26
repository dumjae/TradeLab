import { useCallback, useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Flame,
  Heart,
  Pin,
  Quote,
  RefreshCw,
  ShieldCheck,
  Sparkles,
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

  return (
    <section
      aria-labelledby="daily-wisdom-heading"
      className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-terminal-surface via-terminal-surface to-amber-500/5 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/35 bg-amber-500/15 text-amber-400">
            <Quote className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="daily-wisdom-heading"
              className="text-xs font-semibold uppercase tracking-wider text-amber-400"
            >
              Daily Trading Wisdom
            </h2>
            <p className="text-[11px] text-terminal-muted">
              Disciplined mindset before you read the charts
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                category === tab.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !quote ? (
        <div className="mt-4 h-24 animate-pulse rounded-xl bg-terminal-elevated/60" />
      ) : (
        <div className="mt-4 space-y-4">
          <blockquote className="text-base font-medium leading-relaxed text-terminal-text sm:text-lg">
            “{quote.quoteText}”
          </blockquote>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-terminal-text">{quote.author}</span>
              <span className="text-xs text-terminal-muted">· {quote.authorRole}</span>
              {quote.sourceType === 'verified_trader' ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Verified Trader
                </span>
              ) : quote.sourceType === 'tradelab_principle' ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  TradeLab Principle
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-400">
                  My Rule
                </span>
              )}
              {quote.language === 'taglish' && (
                <span className="rounded-full border border-terminal-border bg-terminal-elevated px-2 py-0.5 font-mono text-[10px] text-terminal-muted">
                  Taglish
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShuffle}
                aria-label="Shuffle trading quote"
                className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:border-amber-500/50 hover:text-amber-400"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Shuffle
              </button>
              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-label={quote.isFavorite ? 'Remove from favorites' : 'Favorite quote'}
                aria-pressed={quote.isFavorite}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                  quote.isFavorite
                    ? 'border-rose-500/40 bg-rose-500/15 text-rose-400'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-rose-400'
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
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                  quote.isPinned
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-400'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-amber-400'
                }`}
              >
                <Pin className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-terminal-border pt-3">
            <button
              type="button"
              onClick={() => setShowLessonNote((prev) => !prev)}
              aria-expanded={showLessonNote}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20"
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                Open Mindset Vault
              </button>
            )}
          </div>

          {showLessonNote && (
            <p className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-3.5 py-2.5 text-xs leading-relaxed text-terminal-text">
              {quote.tradingLessonNote}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
