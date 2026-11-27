import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  getDailyQuote,
  listQuotes,
  toggleFavoriteQuote,
  togglePinQuote,
} from '../../services/quotesService';
import type { QuoteWithUserState } from '../../types/quotes';

export interface DailyQuoteCardProps {
  onOpenVault?: () => void;
  conceptKey?: string;
}

export function DailyQuoteCard({ onOpenVault, conceptKey }: DailyQuoteCardProps) {
  const { t } = useLanguage();
  const [quote, setQuote] = useState<QuoteWithUserState | null>(null);
  const [pool, setPool] = useState<QuoteWithUserState[]>([]);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const [daily, all] = await Promise.all([
        getDailyQuote(conceptKey),
        listQuotes({}),
      ]);
      setQuote(daily);
      setPool(all);
    } finally {
      setLoading(false);
    }
  }, [conceptKey]);

  useEffect(() => {
    void loadQuotes();
  }, [loadQuotes]);

  const handleAnother = () => {
    if (pool.length <= 1 || !quote) {
      return;
    }
    const candidates = pool.filter((item) => item.id !== quote.id);
    const next = candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
    setQuote(next);
    setShowNote(false);
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
      className="border-l-2 border-brand py-1 pl-4"
    >
      <h2
        id="daily-wisdom-heading"
        className="text-xs font-semibold text-terminal-text"
      >
        {t('Discipline Note', 'Paalala sa Disiplina')}
      </h2>

      {loading || !quote ? (
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded-md bg-terminal-elevated/70" />
          <div className="h-4 w-4/5 animate-pulse rounded-md bg-terminal-elevated/70" />
          <div className="h-3 w-2/5 animate-pulse rounded-md bg-terminal-elevated/50" />
        </div>
      ) : (
        <div className="mt-2.5 space-y-3">
          <blockquote className="line-clamp-3 text-[15px] font-medium leading-relaxed text-terminal-text">
            “{quote.quoteText}”
          </blockquote>

          <p className="text-xs text-terminal-muted">
            <span className="font-medium text-terminal-text">{quote.author}</span>
            {quote.authorRole ? ` · ${quote.authorRole}` : ''}
          </p>

          {showNote && quote.tradingLessonNote && (
            <p className="border-t border-terminal-border pt-2.5 text-xs leading-relaxed text-terminal-muted">
              {quote.tradingLessonNote}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs">
            <button
              type="button"
              onClick={handleAnother}
              className="font-medium text-terminal-muted underline-offset-4 transition-colors hover:text-terminal-text hover:underline"
            >
              {t('Another', 'Iba pa')}
            </button>

            {quote.tradingLessonNote && (
              <button
                type="button"
                onClick={() => setShowNote((prev) => !prev)}
                aria-expanded={showNote}
                className="font-medium text-terminal-muted underline-offset-4 transition-colors hover:text-terminal-text hover:underline"
              >
                {showNote ? t('Hide note', 'Itago') : t('Reflection', 'Paliwanag')}
              </button>
            )}

            <button
              type="button"
              onClick={() => void handleToggleFavorite()}
              aria-pressed={quote.isFavorite}
              className={`font-medium underline-offset-4 transition-colors hover:underline ${
                quote.isFavorite ? 'text-brand-text' : 'text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {quote.isFavorite ? t('Saved', 'Naka-save') : t('Save', 'I-save')}
            </button>

            <button
              type="button"
              onClick={() => void handleTogglePin()}
              aria-pressed={quote.isPinned}
              className={`font-medium underline-offset-4 transition-colors hover:underline ${
                quote.isPinned
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {quote.isPinned ? t('Pinned', 'Naka-pin') : t('Pin', 'I-pin')}
            </button>

            {onOpenVault && (
              <button
                type="button"
                onClick={onOpenVault}
                className="font-medium text-brand-text underline-offset-4 hover:underline"
              >
                {t('Open Vault', 'Buksan Vault')}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
