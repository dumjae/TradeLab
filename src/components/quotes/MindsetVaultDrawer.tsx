import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Flame,
  Heart,
  Pin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  createCustomQuote,
  deleteCustomQuote,
  listQuotes,
  toggleFavoriteQuote,
  togglePinQuote,
  updateQuoteReflection,
} from '../../services/quotesService';
import type {
  QuoteCategory,
  QuoteLanguage,
  QuoteWithUserState,
} from '../../types/quotes';

export interface MindsetVaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_FILTERS: Array<{ id: QuoteCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'motivate', label: 'Motivate' },
  { id: 'teach', label: 'Teach' },
  { id: 'inspire', label: 'Inspire' },
];

const LANGUAGE_FILTERS: Array<{ id: QuoteLanguage | 'all'; label: string }> = [
  { id: 'all', label: 'All Languages' },
  { id: 'en', label: 'English' },
  { id: 'taglish', label: 'Taglish' },
];

export function MindsetVaultDrawer({ isOpen, onClose }: MindsetVaultDrawerProps) {
  const [quotes, setQuotes] = useState<QuoteWithUserState[]>([]);
  const [category, setCategory] = useState<QuoteCategory | 'all'>('all');
  const [language, setLanguage] = useState<QuoteLanguage | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [editingReflectionId, setEditingReflectionId] = useState<string | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState<string>('');

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newQuoteText, setNewQuoteText] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('My Trading Desk');
  const [newCategory, setNewCategory] = useState<QuoteCategory>('motivate');
  const [newLanguage, setNewLanguage] = useState<QuoteLanguage>('en');
  const [newLessonNote, setNewLessonNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const refreshQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const results = await listQuotes({
        category,
        language,
        favoritesOnly,
        searchQuery: searchQuery.trim() || undefined,
      });
      setQuotes(results);
    } finally {
      setLoading(false);
    }
  }, [category, language, favoritesOnly, searchQuery]);

  useEffect(() => {
    if (isOpen) {
      void refreshQuotes();
    }
  }, [isOpen, refreshQuotes]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleToggleFavorite = async (quoteId: string) => {
    await toggleFavoriteQuote(quoteId);
    await refreshQuotes();
  };

  const handleTogglePin = async (quoteId: string) => {
    await togglePinQuote(quoteId);
    await refreshQuotes();
  };

  const handleSaveReflection = async (quoteId: string) => {
    await updateQuoteReflection(quoteId, reflectionDraft.trim());
    setEditingReflectionId(null);
    await refreshQuotes();
  };

  const handleDeleteCustom = async (quoteId: string) => {
    await deleteCustomQuote(quoteId);
    await refreshQuotes();
  };

  const handleCreateCustom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newQuoteText.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await createCustomQuote({
        quoteText: newQuoteText.trim(),
        author: newAuthor.trim() || 'Personal Trading Rule',
        authorRole: 'Personal Mantra',
        category: newCategory,
        language: newLanguage,
        tradingLessonNote:
          newLessonNote.trim() || 'Personal trading discipline rule created inside TradeLab.',
      });
      setNewQuoteText('');
      setNewLessonNote('');
      setShowAddForm(false);
      await refreshQuotes();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mindset-vault-title"
    >
      <button
        type="button"
        aria-label="Close Mindset Vault backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/55"
      />

      <div className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-terminal-border bg-terminal-bg tl-drawer-enter">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-terminal-border bg-terminal-surface px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-caution/35 bg-caution/10 text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="mindset-vault-title"
                className="text-[15px] font-semibold tracking-tight text-terminal-text"
              >
                Trader Mindset &amp; Motivation Vault
              </h2>
              <p className="text-[11px] text-terminal-muted">
                Verified wisdom, TradeLab principles &amp; your personal rules (Shift+Q)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Mindset Vault"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text tl-press"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Filters & Add Rule CTA */}
        <div className="space-y-3 border-b border-terminal-border bg-terminal-surface/60 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-terminal-muted"
                aria-hidden="true"
              />
              <input
                id="mindset-vault-search"
                name="quoteSearch"
                aria-label="Search mindset quotes"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search quotes, authors, discipline, risk..."
                className="w-full rounded-md border border-terminal-border bg-terminal-bg py-2 pl-9 pr-3 text-xs text-terminal-text placeholder:text-terminal-muted/70 focus:border-brand focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand px-3 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 tl-press"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add My Rule
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1">
              {CATEGORY_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={category === item.id}
                  onClick={() => setCategory(item.id)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors tl-press ${
                    category === item.id
                      ? 'bg-brand font-semibold text-brand-fg'
                      : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <select
                id="mindset-vault-language-filter"
                name="quoteLanguageFilter"
                aria-label="Filter quote language"
                value={language}
                onChange={(event) => setLanguage(event.target.value as QuoteLanguage | 'all')}
                className="rounded-md border border-terminal-border bg-terminal-bg px-2.5 py-1 text-[11px] text-terminal-text focus:border-brand focus:outline-none"
              >
                {LANGUAGE_FILTERS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setFavoritesOnly((prev) => !prev)}
                aria-pressed={favoritesOnly}
                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors tl-press ${
                  favoritesOnly
                    ? 'border-brand/40 bg-brand-soft text-brand-text'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                }`}
              >
                <Heart className={`h-3 w-3 ${favoritesOnly ? 'fill-current' : ''}`} aria-hidden="true" />
                Favorites
              </button>
            </div>
          </div>

          {/* Add Personal Mantra / Trading Rule Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateCustom}
              className="space-y-3 rounded-lg border border-terminal-border bg-terminal-bg p-4"
            >
              <p className="text-xs font-semibold text-terminal-text">
                Add My Own Personal Mantra / Trading Rule
              </p>
              <textarea
                id="custom-quote-text"
                name="customQuoteText"
                aria-label="Personal trading mantra or quote text"
                rows={2}
                required
                value={newQuoteText}
                onChange={(event) => setNewQuoteText(event.target.value)}
                placeholder="e.g., No candle-body close, no entry. Protecting capital is my #1 job."
                className="w-full rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-xs text-terminal-text placeholder:text-terminal-muted/70 focus:border-brand focus:outline-none"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  id="custom-quote-author"
                  name="customQuoteAuthor"
                  aria-label="Quote author or personal label"
                  type="text"
                  value={newAuthor}
                  onChange={(event) => setNewAuthor(event.target.value)}
                  placeholder="Label / Author"
                  className="rounded-md border border-terminal-border bg-terminal-surface px-2.5 py-1.5 text-xs text-terminal-text focus:border-brand focus:outline-none"
                />
                <select
                  id="custom-quote-category"
                  name="customQuoteCategory"
                  aria-label="Personal rule category"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value as QuoteCategory)}
                  className="rounded-md border border-terminal-border bg-terminal-surface px-2.5 py-1.5 text-xs text-terminal-text focus:border-brand focus:outline-none"
                >
                  <option value="motivate">Motivate</option>
                  <option value="teach">Teach</option>
                  <option value="inspire">Inspire</option>
                </select>
                <select
                  id="custom-quote-language"
                  name="customQuoteLanguage"
                  aria-label="Personal rule language"
                  value={newLanguage}
                  onChange={(event) => setNewLanguage(event.target.value as QuoteLanguage)}
                  className="rounded-md border border-terminal-border bg-terminal-surface px-2.5 py-1.5 text-xs text-terminal-text focus:border-brand focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="taglish">Taglish</option>
                </select>
              </div>
              <input
                id="custom-quote-lesson-note"
                name="customQuoteLessonNote"
                aria-label="Trading lesson takeaway for personal rule"
                type="text"
                value={newLessonNote}
                onChange={(event) => setNewLessonNote(event.target.value)}
                placeholder="Why this rule matters when trading..."
                className="w-full rounded-md border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs text-terminal-text placeholder:text-terminal-muted/70 focus:border-brand focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-md border border-terminal-border px-3 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text tl-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 disabled:opacity-60 tl-press"
                >
                  {submitting ? 'Saving...' : 'Save Personal Rule'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quote List */}
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-lg border border-terminal-border bg-terminal-surface"
                />
              ))}
            </div>
          ) : quotes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-terminal-border bg-terminal-surface/50 p-8 text-center text-xs text-terminal-muted">
              No quotes match your current filters. Try clearing your search or adding your own
              personal trading rule above.
            </div>
          ) : (
            quotes.map((quote) => {
              const isEditing = editingReflectionId === quote.id;
              return (
                <article
                  key={quote.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    quote.isPinned
                      ? 'border-caution/45 bg-caution/5'
                      : 'border-terminal-border bg-terminal-surface'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.04em] text-terminal-muted">
                        {quote.category}
                      </span>
                      {quote.sourceType === 'verified_trader' ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-bull/35 bg-bull/10 px-2 py-0.5 font-mono text-[10px] text-bull">
                          <ShieldCheck className="h-2.5 w-2.5" aria-hidden="true" />
                          Verified
                        </span>
                      ) : quote.sourceType === 'tradelab_principle' ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-caution/35 bg-caution/10 px-2 py-0.5 font-mono text-[10px] text-amber-600 dark:text-amber-400">
                          <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                          TradeLab
                        </span>
                      ) : (
                        <span className="rounded-md border border-brand/30 bg-brand-soft px-2 py-0.5 font-mono text-[10px] text-brand-text">
                          Custom Rule
                        </span>
                      )}
                      {quote.language === 'taglish' && (
                        <span className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] text-terminal-muted">
                          Taglish
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => void handleToggleFavorite(quote.id)}
                        aria-label={`Favorite quote by ${quote.author}`}
                        className={`rounded-md p-1.5 transition-colors tl-press ${
                          quote.isFavorite
                            ? 'bg-brand-soft text-brand-text'
                            : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                        }`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${quote.isFavorite ? 'fill-current' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleTogglePin(quote.id)}
                        aria-label={`Pin quote by ${quote.author}`}
                        className={`rounded-md p-1.5 transition-colors tl-press ${
                          quote.isPinned
                            ? 'bg-caution/15 text-amber-600 dark:text-amber-400'
                            : 'text-terminal-muted hover:bg-terminal-elevated hover:text-amber-600 dark:hover:text-amber-400'
                        }`}
                      >
                        <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      {quote.sourceType === 'user_custom' && (
                        <button
                          type="button"
                          onClick={() => void handleDeleteCustom(quote.id)}
                          aria-label="Delete custom rule"
                          className="rounded-md p-1.5 text-terminal-muted transition-colors hover:bg-bear/10 hover:text-bear tl-press"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-2.5 text-sm font-medium leading-relaxed text-terminal-text">
                    “{quote.quoteText}”
                  </p>
                  <p className="mt-1.5 text-xs text-terminal-muted">
                    — <strong className="font-semibold text-terminal-text">{quote.author}</strong> ({quote.authorRole})
                  </p>
                  <p className="mt-2.5 rounded-md border-l-2 border-brand/50 bg-terminal-bg/80 px-3 py-2 text-[11px] leading-relaxed text-terminal-muted">
                    <strong className="font-semibold text-terminal-text">Lesson Note: </strong>
                    {quote.tradingLessonNote}
                  </p>

                  {/* Personal Reflection Editor */}
                  <div className="mt-3 border-t border-terminal-border pt-2.5">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          id={`reflection-draft-${quote.id}`}
                          name="personalReflection"
                          aria-label="Personal trading reflection"
                          rows={2}
                          value={reflectionDraft}
                          onChange={(event) => setReflectionDraft(event.target.value)}
                          placeholder="How will you apply this before your next trade?"
                          className="w-full rounded-md border border-terminal-border bg-terminal-bg px-2.5 py-2 text-xs text-terminal-text placeholder:text-terminal-muted/70 focus:border-brand focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingReflectionId(null)}
                            className="rounded-md border border-terminal-border px-2.5 py-1 text-[11px] font-medium text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text tl-press"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleSaveReflection(quote.id)}
                            className="rounded-md bg-brand px-2.5 py-1 text-[11px] font-semibold text-brand-fg transition-opacity hover:opacity-95 tl-press"
                          >
                            Save Reflection
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[11px] text-terminal-muted">
                          {quote.personalReflection ? (
                            <>
                              <strong className="font-semibold text-brand-text">My Reflection: </strong>
                              {quote.personalReflection}
                            </>
                          ) : (
                            'Add a personal reflection to internalize this mindset rule.'
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReflectionId(quote.id);
                            setReflectionDraft(quote.personalReflection);
                          }}
                          className="shrink-0 text-[11px] font-semibold text-brand-text underline-offset-4 hover:underline"
                        >
                          {quote.personalReflection ? 'Edit' : 'Reflect'}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
