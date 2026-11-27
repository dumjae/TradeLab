import { useEffect, useState } from 'react';
import { Check, CheckCircle2, Quote, RotateCcw, ShieldCheck } from 'lucide-react';
import { getContextualQuote } from '../../services/quotesService';
import type { PreTradeCheckItem } from '../../types/learning-loop';
import type { QuoteWithUserState } from '../../types/quotes';

const PRE_TRADE_CHECKLIST_ITEMS: PreTradeCheckItem[] = [
  {
    id: 'htf-bias',
    label: 'HTF Bias & Liquidity Marked',
    hint: 'Key 4H/Daily structure and untouched pools mapped.',
  },
  {
    id: 'news-check',
    label: 'High-Impact News Checked',
    hint: 'No surprise red-folder macro releases inside the window.',
  },
  {
    id: 'risk-cap',
    label: 'Risk Capped <= 1%',
    hint: 'Stop-loss and position size calculated before entry.',
  },
  {
    id: 'playbook-match',
    label: 'Setup Matches Playbook',
    hint: 'A+ confluence confirmed — zero boredom clicks.',
  },
  {
    id: 'calm-headspace',
    label: 'Calm Headspace — Zero Revenge/FOMO',
    hint: 'Ready to accept 1R loss calmly without chasing.',
  },
];

export function PreTradeChecklistCard() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [quote, setQuote] = useState<QuoteWithUserState | null>(null);

  useEffect(() => {
    let active = true;
    void getContextualQuote('risk-management', 'teach').then((result) => {
      if (active) {
        setQuote(result);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleReset = () => {
    setCheckedIds([]);
  };

  const totalCount = PRE_TRADE_CHECKLIST_ITEMS.length;
  const completedCount = checkedIds.length;
  const isReady = completedCount === totalCount;

  return (
    <section
      aria-labelledby="pre-trade-checklist-heading"
      className="rounded-lg border border-terminal-border bg-terminal-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors ${
              isReady
                ? 'border-bull/35 bg-bull/10 text-bull'
                : 'border-brand/30 bg-brand-soft text-brand-text'
            }`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="pre-trade-checklist-heading"
              className="text-sm font-semibold tracking-tight text-terminal-text sm:text-[15px]"
            >
              Pre-Trade Discipline Check
            </h2>
            <p className="text-xs text-terminal-muted">
              Confirm all 5 rules before risking capital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums ${
              isReady
                ? 'border-bull/35 bg-bull/10 text-bull'
                : 'border-terminal-border bg-terminal-bg text-terminal-muted'
            }`}
          >
            {completedCount}/{totalCount}
          </span>

          <button
            type="button"
            onClick={handleReset}
            disabled={completedCount === 0}
            className="inline-flex items-center gap-1 rounded-md border border-terminal-border bg-terminal-bg px-2.5 py-1 text-xs font-medium text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text disabled:cursor-not-allowed disabled:opacity-45 tl-press"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* Contextual Wisdom Strip */}
      <div className="mt-4 flex items-center gap-2.5 rounded-md border border-terminal-border border-l-2 border-l-caution bg-terminal-bg px-3.5 py-2.5 text-xs">
        <Quote className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        <p className="min-w-0 truncate text-terminal-text">
          “{quote?.quoteText ?? 'Protect downside first; A+ setups always return.'}”{' '}
          <span className="text-terminal-muted">
            — {quote?.author ?? 'TradeLab Principle'}
          </span>
        </p>
      </div>

      {/* 5 Interactive Discipline Checks */}
      <div className="mt-4 space-y-2" role="group" aria-label="Pre-trade discipline checklist">
        {PRE_TRADE_CHECKLIST_ITEMS.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              onClick={() => toggleItem(item.id)}
              className={`flex w-full items-center gap-3 rounded-md border px-3.5 py-3 text-left transition-colors tl-press ${
                isChecked
                  ? 'border-bull/35 bg-bull/10'
                  : 'border-terminal-border bg-terminal-bg hover:border-brand/40 hover:bg-terminal-elevated/40'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  isChecked
                    ? 'border-bull bg-bull text-white'
                    : 'border-terminal-border bg-terminal-surface text-transparent'
                }`}
              >
                <Check className="h-3 w-3 stroke-[3]" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-terminal-text sm:text-sm">
                  {item.label}
                </span>
                <span className="block text-[11px] text-terminal-muted">{item.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Semantic Confirmation Banner when 5/5 Checked */}
      {isReady && (
        <div
          role="status"
          className="mt-4 flex items-center justify-between gap-3 rounded-md border border-bull/35 bg-bull/10 px-4 py-3 text-bull"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold sm:text-sm">Ready to Execute</span>
          </div>
          <span className="font-mono text-[11px] font-semibold tabular-nums">5/5 Verified</span>
        </div>
      )}
    </section>
  );
}
