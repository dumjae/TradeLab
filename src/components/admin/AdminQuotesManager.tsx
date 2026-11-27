import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  createPublicAdminQuote,
  deleteAnyQuoteAdmin,
  listQuotes,
} from '../../services/quotesService';
import type { QuoteCategory, QuoteLanguage, QuoteWithUserState } from '../../types/quotes';

type CuratedSource = 'verified_trader' | 'tradelab_principle';

export function AdminQuotesManager() {
  const [quotes, setQuotes] = useState<QuoteWithUserState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [quoteText, setQuoteText] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [authorRole, setAuthorRole] = useState<string>('');
  const [lessonNote, setLessonNote] = useState<string>('');
  const [concepts, setConcepts] = useState<string>('');
  const [category, setCategory] = useState<QuoteCategory>('teach');
  const [language, setLanguage] = useState<QuoteLanguage>('en');
  const [sourceType, setSourceType] = useState<CuratedSource>('tradelab_principle');
  const [saving, setSaving] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await listQuotes();
      setQuotes(all.filter((quote) => quote.sourceType !== 'user_custom'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const report = (text: string, error: boolean) => {
    setMessage(text);
    setIsError(error);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createPublicAdminQuote({
        quoteText,
        author,
        authorRole,
        category,
        language,
        sourceType,
        tradingLessonNote: lessonNote,
        relatedConcepts: concepts.split(',').map((item) => item.trim()),
      });
      setQuoteText('');
      setAuthor('');
      setAuthorRole('');
      setLessonNote('');
      setConcepts('');
      report('Curated quote published.', false);
      await load();
    } catch (error) {
      report(error instanceof Error ? error.message : 'Failed to publish quote.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quoteId: string) => {
    try {
      await deleteAnyQuoteAdmin(quoteId);
      report('Quote deleted.', false);
      await load();
    } catch (error) {
      report(error instanceof Error ? error.message : 'Failed to delete quote.', true);
    }
  };

  const fieldClass =
    'mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none';
  const labelClass = 'block text-[11px] font-medium text-terminal-muted';

  return (
    <div className="space-y-6">
      {message && (
        <p
          role="status"
          className={`rounded-xl border px-4 py-2.5 text-xs ${
            isError
              ? 'border-rose-500/35 bg-rose-500/10 text-rose-300'
              : 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="space-y-3 rounded-2xl border border-terminal-border bg-terminal-surface p-5"
      >
        <h2 className="text-sm font-semibold text-terminal-text">Publish a curated quote</h2>
        <p className="text-[11px] text-terminal-muted">
          Only mark a quote as Verified Trader when the attribution is accurate and sourced.
        </p>

        <div>
          <label htmlFor="admin-quote-text" className={labelClass}>
            Quote text
          </label>
          <textarea
            id="admin-quote-text"
            name="quoteText"
            aria-label="Quote text"
            rows={2}
            required
            value={quoteText}
            onChange={(event) => setQuoteText(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-quote-author" className={labelClass}>
              Author
            </label>
            <input
              id="admin-quote-author"
              name="quoteAuthor"
              aria-label="Quote author"
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="TradeLab Academy"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="admin-quote-role" className={labelClass}>
              Author role
            </label>
            <input
              id="admin-quote-role"
              name="quoteAuthorRole"
              aria-label="Author role"
              type="text"
              value={authorRole}
              onChange={(event) => setAuthorRole(event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="admin-quote-source" className={labelClass}>
              Source type
            </label>
            <select
              id="admin-quote-source"
              name="quoteSourceType"
              aria-label="Source type"
              value={sourceType}
              onChange={(event) => setSourceType(event.target.value as CuratedSource)}
              className={fieldClass}
            >
              <option value="tradelab_principle">TradeLab Principle</option>
              <option value="verified_trader">Verified Trader</option>
            </select>
          </div>
          <div>
            <label htmlFor="admin-quote-category" className={labelClass}>
              Category
            </label>
            <select
              id="admin-quote-category"
              name="quoteCategory"
              aria-label="Quote category"
              value={category}
              onChange={(event) => setCategory(event.target.value as QuoteCategory)}
              className={fieldClass}
            >
              <option value="motivate">Motivate</option>
              <option value="teach">Teach</option>
              <option value="inspire">Inspire</option>
            </select>
          </div>
          <div>
            <label htmlFor="admin-quote-language" className={labelClass}>
              Language
            </label>
            <select
              id="admin-quote-language"
              name="quoteLanguage"
              aria-label="Quote language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as QuoteLanguage)}
              className={fieldClass}
            >
              <option value="en">English</option>
              <option value="taglish">Taglish</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="admin-quote-note" className={labelClass}>
            Trading lesson takeaway
          </label>
          <input
            id="admin-quote-note"
            name="quoteLessonNote"
            aria-label="Trading lesson takeaway"
            type="text"
            required
            value={lessonNote}
            onChange={(event) => setLessonNote(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="admin-quote-concepts" className={labelClass}>
            Related concepts (comma separated)
          </label>
          <input
            id="admin-quote-concepts"
            name="quoteConcepts"
            aria-label="Related concepts"
            type="text"
            value={concepts}
            onChange={(event) => setConcepts(event.target.value)}
            placeholder="risk_management, discipline"
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-brand-fg hover:brightness-110 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {saving ? 'Publishing…' : 'Publish Quote'}
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-terminal-text">
          Curated quotes ({quotes.length})
        </h2>
        {loading ? (
          <div className="h-24 animate-pulse rounded-2xl border border-terminal-border bg-terminal-surface" />
        ) : (
          <ul className="space-y-2">
            {quotes.map((quote) => (
              <li
                key={quote.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-terminal-border bg-terminal-surface p-3.5"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-terminal-text">“{quote.quoteText}”</p>
                  <p className="font-mono text-[11px] text-terminal-muted">
                    {quote.author} · {quote.sourceType.replace('_', ' ')} · {quote.category} ·{' '}
                    {quote.language}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(quote.id)}
                  aria-label={`Delete quote by ${quote.author}`}
                  className="shrink-0 rounded p-1.5 text-terminal-muted hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
