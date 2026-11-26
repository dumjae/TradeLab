import { useEffect, useState } from 'react';
import { Quote, RefreshCw, X } from 'lucide-react';
import { getContextualQuote, listQuotes } from '../../services/quotesService';
import type { QuoteCategory, QuoteWithUserState } from '../../types/quotes';

export interface ContextualQuoteStripProps {
  conceptKey?: string;
  category?: QuoteCategory;
  label?: string;
}

export function ContextualQuoteStrip({
  conceptKey,
  category,
  label = 'Trader Mindset Check',
}: ContextualQuoteStripProps) {
  const [quote, setQuote] = useState<QuoteWithUserState | null>(null);
  const [pool, setPool] = useState<QuoteWithUserState[]>([]);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setDismissed(false);
    const load = async () => {
      const [contextual, candidates] = await Promise.all([
        getContextualQuote(conceptKey, category),
        listQuotes({ category: category ?? 'all' }),
      ]);
      if (active) {
        setQuote(contextual);
        setPool(candidates);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [conceptKey, category]);

  const handleShuffle = () => {
    if (pool.length <= 1 || !quote) {
      return;
    }
    const others = pool.filter((item) => item.id !== quote.id);
    const next = others[Math.floor(Math.random() * others.length)] ?? pool[0];
    setQuote(next);
  };

  if (dismissed || !quote) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3">
      <div className="flex items-start gap-2.5">
        <Quote className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
        <div className="space-y-0.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            {label}
          </p>
          <p className="text-xs leading-relaxed text-terminal-text">
            “{quote.quoteText}”{' '}
            <span className="text-terminal-muted">— {quote.author}</span>
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleShuffle}
          aria-label="Show another mindset quote"
          className="rounded-md p-1 text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-amber-400"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss mindset quote strip"
          className="rounded-md p-1 text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
