import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Bookmark, Flame, Heart, Pin } from 'lucide-react';
import { DifficultConceptsPanel } from '../components/library/DifficultConceptsPanel';
import { PersonalVisualLibrary } from '../components/library/PersonalVisualLibrary';
import { ContextualQuoteStrip } from '../components/quotes/ContextualQuoteStrip';
import {
  listQuotes,
  toggleFavoriteQuote,
  togglePinQuote,
} from '../services/quotesService';
import type { QuoteWithUserState } from '../types/quotes';

export interface LibraryPageProps {
  onOpenVault: () => void;
}

type LibraryTab = 'saved' | 'difficult' | 'quotes';

export function LibraryPage({ onOpenVault }: LibraryPageProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>('saved');
  const [favoriteQuotes, setFavoriteQuotes] = useState<QuoteWithUserState[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState<boolean>(false);

  const loadFavoriteQuotes = useCallback(async () => {
    setLoadingQuotes(true);
    try {
      const favorites = await listQuotes({ favoritesOnly: true });
      setFavoriteQuotes(favorites);
    } finally {
      setLoadingQuotes(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'quotes') {
      void loadFavoriteQuotes();
    }
  }, [activeTab, loadFavoriteQuotes]);

  const handleToggleFavorite = async (quoteId: string) => {
    await toggleFavoriteQuote(quoteId);
    await loadFavoriteQuotes();
  };

  const handleTogglePin = async (quoteId: string) => {
    await togglePinQuote(quoteId);
    await loadFavoriteQuotes();
  };

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-6 tl-page-enter">
      {/* Unboxed Editorial Masthead */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-terminal-border pb-5">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text sm:text-[1.75rem]">
            Personal Visual Learning Library
          </h1>
          <p className="max-w-[65ch] text-sm leading-relaxed text-terminal-muted">
            Your bookmarked videos, timestamp notes, difficult concept review bundles, and favorite
            mindset rules.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-terminal-border bg-terminal-surface px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:bg-terminal-elevated tl-press"
        >
          <Flame className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
          Open Mindset Vault
        </button>
      </header>

      {/* Architectural Underline Tabs */}
      <div
        role="tablist"
        aria-label="Personal Library sections"
        className="no-scrollbar flex flex-nowrap items-center gap-5 overflow-x-auto border-b border-terminal-border sm:gap-7"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
          className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 pb-3 text-xs transition-colors ${
            activeTab === 'saved'
              ? 'border-brand font-semibold text-terminal-text'
              : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          Saved Videos &amp; History
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'difficult'}
          onClick={() => setActiveTab('difficult')}
          className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 pb-3 text-xs transition-colors ${
            activeTab === 'difficult'
              ? 'border-brand font-semibold text-terminal-text'
              : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          My Difficult Concepts
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'quotes'}
          onClick={() => setActiveTab('quotes')}
          className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 pb-3 text-xs transition-colors ${
            activeTab === 'quotes'
              ? 'border-brand font-semibold text-terminal-text'
              : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <Heart className="h-3.5 w-3.5" aria-hidden="true" />
          Favorite Quotes
        </button>
      </div>

      {activeTab === 'saved' && (
        <div className="min-w-0">
          <PersonalVisualLibrary />
        </div>
      )}

      {activeTab === 'difficult' && (
        <div className="min-w-0 space-y-5">
          <ContextualQuoteStrip category="teach" label="Deliberate Review Mindset" />
          <DifficultConceptsPanel includeMasteredToggle />
        </div>
      )}

      {activeTab === 'quotes' && (
        <section aria-label="Favorite mindset quotes" className="min-w-0 space-y-4">
          {loadingQuotes ? (
            <div className="h-28 animate-pulse rounded-lg border border-terminal-border bg-terminal-surface" />
          ) : favoriteQuotes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-terminal-border bg-terminal-surface/50 px-6 py-10 text-center">
              <h2 className="text-sm font-semibold text-terminal-text">
                No favorite mindset quotes saved yet
              </h2>
              <p className="mx-auto mt-1.5 max-w-[54ch] text-xs leading-relaxed text-terminal-muted">
                Open the Mindset Vault anytime (Shift+Q) to favorite verified trader wisdom or write
                your own personal trading rules.
              </p>
              <button
                type="button"
                onClick={onOpenVault}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 tl-press"
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                Browse Mindset Vault
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {favoriteQuotes.map((quote) => (
                <article
                  key={quote.id}
                  className="flex min-w-0 flex-col justify-between gap-3 border-t border-terminal-border py-5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.04em] text-terminal-muted">
                        {quote.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void handleTogglePin(quote.id)}
                          aria-label="Toggle pin quote"
                          className={`rounded-md p-1.5 transition-colors tl-press ${
                            quote.isPinned
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                          }`}
                        >
                          <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleToggleFavorite(quote.id)}
                          aria-label="Remove favorite quote"
                          className="rounded-md bg-bear/10 p-1.5 text-bear transition-colors hover:bg-bear/20 tl-press"
                        >
                          <Heart className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <p className="max-w-[60ch] text-sm font-medium leading-relaxed text-terminal-text">
                      “{quote.quoteText}”
                    </p>
                    <p className="text-xs text-terminal-muted">
                      — <strong className="font-semibold text-terminal-text">{quote.author}</strong>{' '}
                      ({quote.authorRole})
                    </p>
                    {quote.personalReflection && (
                      <p className="border-l-2 border-brand/50 pl-3 text-xs leading-relaxed text-terminal-muted">
                        <strong className="font-semibold text-terminal-text">My Reflection: </strong>
                        {quote.personalReflection}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
