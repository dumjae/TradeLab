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
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-terminal-border bg-terminal-surface p-5">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-terminal-text">Personal Visual Learning Library</h1>
          <p className="text-xs text-terminal-muted">
            Your bookmarked videos, timestamp notes, difficult concept review bundles, and favorite
            mindset rules.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/35 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          Open Mindset Vault
        </button>
      </header>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Personal Library sections"
        className="flex flex-wrap gap-2 border-b border-terminal-border pb-3"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'saved'
              ? 'bg-emerald-500 text-slate-950'
              : 'border border-terminal-border bg-terminal-surface text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          Saved Videos &amp; History
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'difficult'}
          onClick={() => setActiveTab('difficult')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'difficult'
              ? 'bg-amber-500 text-slate-950'
              : 'border border-terminal-border bg-terminal-surface text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          My Difficult Concepts
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'quotes'}
          onClick={() => setActiveTab('quotes')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'quotes'
              ? 'bg-sky-500 text-slate-950'
              : 'border border-terminal-border bg-terminal-surface text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          Favorite Quotes
        </button>
      </div>

      {activeTab === 'saved' && <PersonalVisualLibrary />}

      {activeTab === 'difficult' && (
        <div className="space-y-4">
          <ContextualQuoteStrip
            category="teach"
            label="Deliberate Review Mindset"
          />
          <DifficultConceptsPanel includeMasteredToggle />
        </div>
      )}

      {activeTab === 'quotes' && (
        <section className="space-y-4">
          {loadingQuotes ? (
            <div className="h-28 animate-pulse rounded-2xl border border-terminal-border bg-terminal-surface" />
          ) : favoriteQuotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-terminal-border bg-terminal-surface/50 p-8 text-center">
              <p className="text-sm font-semibold text-terminal-text">
                No favorite mindset quotes saved yet
              </p>
              <p className="mt-1 text-xs text-terminal-muted">
                Open the Mindset Vault anytime (Shift+Q) to favorite verified trader wisdom or write
                your own personal trading rules.
              </p>
              <button
                type="button"
                onClick={onOpenVault}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                Browse Mindset Vault
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {favoriteQuotes.map((quote) => (
                <article
                  key={quote.id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-terminal-border bg-terminal-surface p-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase text-amber-400">
                        {quote.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void handleTogglePin(quote.id)}
                          aria-label="Toggle pin quote"
                          className={`rounded-md p-1.5 ${
                            quote.isPinned
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'text-terminal-muted hover:text-amber-400'
                          }`}
                        >
                          <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleToggleFavorite(quote.id)}
                          aria-label="Remove favorite quote"
                          className="rounded-md bg-rose-500/10 p-1.5 text-rose-400"
                        >
                          <Heart className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-medium leading-relaxed text-terminal-text">
                      “{quote.quoteText}”
                    </p>
                    <p className="text-xs text-terminal-muted">
                      — <strong className="text-terminal-text">{quote.author}</strong> (
                      {quote.authorRole})
                    </p>
                    {quote.personalReflection && (
                      <p className="rounded-lg border border-sky-500/25 bg-sky-500/5 px-3 py-2 text-xs text-sky-300">
                        <strong>My Reflection: </strong>
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
