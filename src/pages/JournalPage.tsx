import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  NotebookPen,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { PreTradeChecklistCard } from '../components/learning/PreTradeChecklistCard';
import {
  JOURNAL_EMOTIONS,
  computeJournalAnalytics,
  createJournalEntry,
  deleteJournalEntry,
  listJournalEntries,
} from '../services/journalService';
import type { AssetClass, BacktestDirection } from '../types/backtest';
import type { JournalEmotion, JournalEntry } from '../types/learning-loop';

type JournalTab = 'entries' | 'insights' | 'checklist';
type JournalAssetClass = Exclude<AssetClass, 'custom_csv'>;

const ASSET_CLASS_OPTIONS: Array<{ id: JournalAssetClass; label: string }> = [
  { id: 'forex', label: 'Forex' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'commodities', label: 'Commodities' },
];

const EMOTION_BADGE_STYLES: Record<JournalEmotion, string> = {
  calm_disciplined: 'border-bull/35 bg-bull/10 text-bull',
  fomo: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  revenge: 'border-bear/35 bg-bear/10 text-bear',
  hesitant: 'border-terminal-border bg-terminal-elevated/60 text-terminal-muted',
  overconfident: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

function formatCurrency(value: number): string {
  const abs = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  if (value > 0) {
    return `+$${abs}`;
  }
  if (value < 0) {
    return `-$${abs}`;
  }
  return '$0';
}

function formatR(value: number): string {
  const formatted = Math.abs(value).toFixed(2).replace(/\.00$/, '');
  if (value > 0) {
    return `+${formatted}R`;
  }
  if (value < 0) {
    return `-${formatted}R`;
  }
  return '0R';
}

function formatShortDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<JournalTab>('entries');
  const [formOpen, setFormOpen] = useState<boolean>(false);

  // Form fields
  const [symbol, setSymbol] = useState<string>('');
  const [assetClass, setAssetClass] = useState<JournalAssetClass>('forex');
  const [direction, setDirection] = useState<BacktestDirection>('long');
  const [setupTag, setSetupTag] = useState<string>('');
  const [pnlInput, setPnlInput] = useState<string>('');
  const [rInput, setRInput] = useState<string>('');
  const [emotion, setEmotion] = useState<JournalEmotion>('calm_disciplined');
  const [followedPlan, setFollowedPlan] = useState<boolean>(true);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [lessonLearned, setLessonLearned] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void listJournalEntries().then((data) => {
      if (active) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const analytics = useMemo(() => computeJournalAnalytics(entries), [entries]);

  const emotionLabelMap = useMemo(
    () =>
      Object.fromEntries(JOURNAL_EMOTIONS.map((item) => [item.id, item.label])) as Record<
        JournalEmotion,
        string
      >,
    [],
  );

  const resetForm = () => {
    setSymbol('');
    setAssetClass('forex');
    setDirection('long');
    setSetupTag('');
    setPnlInput('');
    setRInput('');
    setEmotion('calm_disciplined');
    setFollowedPlan(true);
    setScreenshotUrl('');
    setLessonLearned('');
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsedPnl = Number.parseFloat(pnlInput);
    if (!Number.isFinite(parsedPnl)) {
      setFormError('Enter a valid numeric P&L amount (e.g. 240 or -100).');
      return;
    }

    const parsedR = rInput.trim() === '' ? 0 : Number.parseFloat(rInput);
    if (!Number.isFinite(parsedR)) {
      setFormError('Enter a valid numeric R-multiple (e.g. 2.1 or -1).');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createJournalEntry({
        symbol,
        assetClass,
        direction,
        setupTag,
        pnlAmount: parsedPnl,
        rMultiple: parsedR,
        emotion,
        followedPlan,
        screenshotUrl: screenshotUrl.trim() || null,
        lessonLearned,
      });

      setEntries((prev) => [created, ...prev]);
      resetForm();
      setFormOpen(false);
      setActiveTab('entries');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save trade entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    await deleteJournalEntry(entryId);
    setEntries((prev) => prev.filter((item) => item.id !== entryId));
  };

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-7 tl-page-enter">
      {/* Unboxed Editorial Masthead */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-terminal-border pb-5">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text sm:text-[1.75rem]">
            Trade Journal
          </h1>
          <p className="max-w-[62ch] text-sm leading-relaxed text-terminal-muted">
            Track execution quality, mindset tags, and rule adherence across real or simulated
            trades.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormOpen((prev) => !prev);
            setFormError(null);
          }}
          aria-expanded={formOpen}
          className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-xs font-semibold transition-colors tl-press ${
            formOpen
              ? 'border border-terminal-border bg-terminal-surface text-terminal-text hover:border-bear/45 hover:bg-terminal-elevated'
              : 'bg-brand text-brand-fg hover:opacity-95'
          }`}
        >
          {formOpen ? (
            <>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Close Form
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              + Log Trade
            </>
          )}
        </button>
      </header>

      {/* Hairline-Divided Tabular Summary Strip */}
      <section
        aria-label="Trade journal performance summary"
        className="grid grid-cols-2 gap-x-5 gap-y-4 border-b border-terminal-border pb-6 sm:grid-cols-3 lg:grid-cols-5"
      >
        <div className="min-w-0">
          <p className="text-xs font-medium text-terminal-muted">Total Trades</p>
          <p className="mt-1 font-mono text-xl font-semibold text-terminal-text tabular-nums">
            {analytics.totalTrades}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-terminal-muted tabular-nums">
            {analytics.wins}W · {analytics.losses}L · {analytics.breakevens}BE
          </p>
        </div>

        <div className="min-w-0 lg:border-l lg:border-terminal-border lg:pl-5">
          <p className="text-xs font-medium text-terminal-muted">Win Rate</p>
          <p className="mt-1 font-mono text-xl font-semibold text-terminal-text tabular-nums">
            {analytics.winRate}%
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-terminal-muted tabular-nums">
            Avg {formatR(analytics.avgRMultiple)}
          </p>
        </div>

        <div className="min-w-0 lg:border-l lg:border-terminal-border lg:pl-5">
          <p className="text-xs font-medium text-terminal-muted">Net P&amp;L</p>
          <p
            className={`mt-1 font-mono text-xl font-semibold tabular-nums ${
              analytics.netPnl > 0
                ? 'text-bull'
                : analytics.netPnl < 0
                  ? 'text-bear'
                  : 'text-terminal-text'
            }`}
          >
            {formatCurrency(analytics.netPnl)}
          </p>
          <p className="mt-0.5 text-[11px] text-terminal-muted">Realized total</p>
        </div>

        <div className="min-w-0 lg:border-l lg:border-terminal-border lg:pl-5">
          <p className="text-xs font-medium text-terminal-muted">Rule Adherence</p>
          <p className="mt-1 font-mono text-xl font-semibold text-terminal-text tabular-nums">
            {analytics.ruleAdherencePct}%
          </p>
          <p className="mt-0.5 text-[11px] text-terminal-muted">Followed plan</p>
        </div>

        <div className="col-span-2 min-w-0 border-t border-terminal-border pt-4 sm:col-span-1 sm:border-t-0 sm:pt-0 lg:border-l lg:border-terminal-border lg:pl-5">
          <p className="text-xs font-medium text-terminal-muted">Calm vs. Emotional Leak</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-1.5 font-mono text-base font-semibold tabular-nums">
            <span className={analytics.calmNetPnl >= 0 ? 'text-bull' : 'text-bear'}>
              {formatCurrency(analytics.calmNetPnl)}
            </span>
            <span className="text-[11px] font-normal text-terminal-muted">vs</span>
            <span
              className={
                analytics.emotionalLeakPnl < 0
                  ? 'text-bear'
                  : 'text-amber-600 dark:text-amber-400'
              }
            >
              {formatCurrency(analytics.emotionalLeakPnl)}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-terminal-muted">
            Disciplined vs. FOMO / Revenge P&amp;L
          </p>
        </div>
      </section>

      {/* Toggleable Log Trade Form */}
      {formOpen && (
        <section
          aria-labelledby="log-trade-heading"
          className="rounded-lg border border-terminal-border bg-terminal-surface p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-2 border-b border-terminal-border pb-3">
            <h2 id="log-trade-heading" className="text-sm font-semibold text-terminal-text">
              Log Real or Demo Trade
            </h2>
            <span className="font-mono text-[11px] text-terminal-muted">Quick entry</span>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="min-w-0">
                <label
                  htmlFor="journal-symbol"
                  className="mb-1.5 block text-xs font-medium text-terminal-muted"
                >
                  Symbol *
                </label>
                <input
                  id="journal-symbol"
                  name="symbol"
                  aria-label="Trading symbol"
                  type="text"
                  required
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value)}
                  placeholder="EUR/USD, BTC/USDT"
                  className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="journal-asset-class"
                  className="mb-1.5 block text-xs font-medium text-terminal-muted"
                >
                  Asset Class
                </label>
                <select
                  id="journal-asset-class"
                  name="assetClass"
                  aria-label="Asset class"
                  value={assetClass}
                  onChange={(event) => setAssetClass(event.target.value as JournalAssetClass)}
                  className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-brand focus:outline-none"
                >
                  {ASSET_CLASS_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <span className="mb-1.5 block text-xs font-medium text-terminal-muted">
                  Direction
                </span>
                <div
                  role="group"
                  aria-label="Trade direction"
                  className="grid grid-cols-2 gap-1 rounded-md border border-terminal-border bg-terminal-bg p-1"
                >
                  <button
                    type="button"
                    aria-pressed={direction === 'long'}
                    onClick={() => setDirection('long')}
                    className={`rounded-sm py-1.5 text-xs font-semibold transition-colors tl-press ${
                      direction === 'long'
                        ? 'bg-bull text-white'
                        : 'text-terminal-muted hover:text-terminal-text'
                    }`}
                  >
                    Long
                  </button>
                  <button
                    type="button"
                    aria-pressed={direction === 'short'}
                    onClick={() => setDirection('short')}
                    className={`rounded-sm py-1.5 text-xs font-semibold transition-colors tl-press ${
                      direction === 'short'
                        ? 'bg-bear text-white'
                        : 'text-terminal-muted hover:text-terminal-text'
                    }`}
                  >
                    Short
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="journal-setup-tag"
                  className="mb-1.5 block text-xs font-medium text-terminal-muted"
                >
                  Setup Tag
                </label>
                <input
                  id="journal-setup-tag"
                  name="setupTag"
                  aria-label="Setup tag"
                  type="text"
                  value={setupTag}
                  onChange={(event) => setSetupTag(event.target.value)}
                  placeholder="Liquidity Sweep + FVG"
                  className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="min-w-0">
                <label
                  htmlFor="journal-pnl"
                  className="mb-1.5 block text-xs font-medium text-terminal-muted"
                >
                  P&amp;L ($) *
                </label>
                <input
                  id="journal-pnl"
                  name="pnlAmount"
                  aria-label="Profit or loss in USD"
                  type="number"
                  step="any"
                  required
                  value={pnlInput}
                  onChange={(event) => setPnlInput(event.target.value)}
                  placeholder="250 or -100"
                  className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="journal-r-multiple"
                  className="mb-1.5 block text-xs font-medium text-terminal-muted"
                >
                  R-Multiple
                </label>
                <input
                  id="journal-r-multiple"
                  name="rMultiple"
                  aria-label="R-multiple"
                  type="number"
                  step="any"
                  value={rInput}
                  onChange={(event) => setRInput(event.target.value)}
                  placeholder="2.5 or -1"
                  className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-terminal-muted">
                  Reward ÷ Risk (e.g. +2R = won 2× initial risk)
                </p>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="journal-screenshot-url"
                  className="mb-1.5 block text-xs font-medium text-terminal-muted"
                >
                  Chart Screenshot URL (HTTPS)
                </label>
                <input
                  id="journal-screenshot-url"
                  name="screenshotUrl"
                  aria-label="Optional HTTPS chart screenshot URL"
                  type="url"
                  value={screenshotUrl}
                  onChange={(event) => setScreenshotUrl(event.target.value)}
                  placeholder="https://www.tradingview.com/x/..."
                  className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            {/* Emotion Selector Pills */}
            <div className="space-y-1.5">
              <span className="block text-xs font-medium text-terminal-muted">
                Execution Mindset
              </span>
              <div
                role="group"
                aria-label="Select execution emotion"
                className="flex flex-wrap items-center gap-2"
              >
                {JOURNAL_EMOTIONS.map((item) => {
                  const selected = emotion === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setEmotion(item.id)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors tl-press ${
                        selected
                          ? item.isDisciplined
                            ? 'border-brand bg-brand font-semibold text-brand-fg'
                            : 'border-amber-500/60 bg-amber-500/15 font-semibold text-amber-600 dark:text-amber-400'
                          : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
              <div className="min-w-0 sm:col-span-8">
                <label
                  htmlFor="journal-lesson-learned"
                  className="mb-1.5 block text-xs font-medium text-terminal-muted"
                >
                  Short Lesson Learned
                </label>
                <textarea
                  id="journal-lesson-learned"
                  name="lessonLearned"
                  aria-label="Short lesson learned"
                  rows={2}
                  value={lessonLearned}
                  onChange={(event) => setLessonLearned(event.target.value)}
                  placeholder="Waited for candle-body displacement after sweep..."
                  className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
                />
              </div>

              <div className="min-w-0 sm:col-span-4">
                <label
                  htmlFor="journal-followed-plan"
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-xs font-medium text-terminal-text"
                >
                  <span>Followed Plan</span>
                  <input
                    id="journal-followed-plan"
                    name="followedPlan"
                    aria-label="Followed trading plan"
                    type="checkbox"
                    checked={followedPlan}
                    onChange={(event) => setFollowedPlan(event.target.checked)}
                    className="h-4 w-4 rounded accent-brand"
                  />
                </label>
              </div>
            </div>

            {formError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-md border border-bear/35 bg-bear/10 px-3.5 py-2.5 text-xs text-bear"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-terminal-border pt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setFormOpen(false);
                }}
                className="rounded-md border border-terminal-border bg-terminal-bg px-4 py-2 text-xs font-medium text-terminal-muted transition-colors hover:text-terminal-text tl-press"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 disabled:opacity-60 tl-press"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {submitting ? 'Saving...' : 'Save Trade'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Architectural Underline View Switcher */}
      <div
        role="tablist"
        aria-label="Trade journal views"
        className="no-scrollbar flex flex-nowrap items-center gap-6 overflow-x-auto border-b border-terminal-border"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'entries'}
          onClick={() => setActiveTab('entries')}
          className={`-mb-px shrink-0 border-b-2 pb-3 text-xs transition-colors ${
            activeTab === 'entries'
              ? 'border-brand font-semibold text-terminal-text'
              : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
          }`}
        >
          Entries ({entries.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'insights'}
          onClick={() => setActiveTab('insights')}
          className={`-mb-px shrink-0 border-b-2 pb-3 text-xs transition-colors ${
            activeTab === 'insights'
              ? 'border-brand font-semibold text-terminal-text'
              : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
          }`}
        >
          Emotion Insights
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'checklist'}
          onClick={() => setActiveTab('checklist')}
          className={`-mb-px shrink-0 border-b-2 pb-3 text-xs transition-colors ${
            activeTab === 'checklist'
              ? 'border-brand font-semibold text-terminal-text'
              : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
          }`}
        >
          Pre-Trade Checklist
        </button>
      </div>

      {/* Tab Panel: Entries (Hairline-Separated Editorial Trade Ledger) */}
      {activeTab === 'entries' && (
        <section aria-label="Logged trades" className="min-w-0">
          {loading ? (
            <div className="h-32 animate-pulse rounded-lg border border-terminal-border bg-terminal-surface" />
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-terminal-border bg-terminal-surface/50 px-6 py-12 text-center">
              <NotebookPen className="h-7 w-7 text-terminal-muted" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-terminal-text">
                No trades logged yet
              </h2>
              <p className="mt-1 max-w-[46ch] text-xs leading-relaxed text-terminal-muted">
                Record real or demo executions to measure rule adherence and spot emotional leaks.
              </p>
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 tl-press"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Log First Trade
              </button>
            </div>
          ) : (
            <div className="divide-y divide-terminal-border border-b border-terminal-border">
              {entries.map((entry) => {
                const pnlColor =
                  entry.outcome === 'win'
                    ? 'text-bull'
                    : entry.outcome === 'loss'
                      ? 'text-bear'
                      : 'text-terminal-muted';

                return (
                  <article
                    key={entry.id}
                    className="tl-row-interactive flex flex-col gap-3 py-4 hover:bg-terminal-surface/50 sm:flex-row sm:items-start sm:justify-between sm:px-2"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-terminal-text">
                          {entry.symbol}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                            entry.direction === 'long'
                              ? 'bg-bull/10 text-bull'
                              : 'bg-bear/10 text-bear'
                          }`}
                        >
                          {entry.direction === 'long' ? (
                            <TrendingUp className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <TrendingDown className="h-3 w-3" aria-hidden="true" />
                          )}
                          {entry.direction}
                        </span>
                        <span className="rounded-md border border-terminal-border bg-terminal-surface px-2 py-0.5 text-[11px] font-medium capitalize text-terminal-muted">
                          {entry.assetClass}
                        </span>
                        {entry.setupTag && (
                          <span className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-0.5 text-[11px] font-medium text-terminal-text">
                            {entry.setupTag}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${EMOTION_BADGE_STYLES[entry.emotion]}`}
                        >
                          {emotionLabelMap[entry.emotion] ?? entry.emotion}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            entry.followedPlan
                              ? 'bg-bull/10 text-bull'
                              : 'bg-bear/10 text-bear'
                          }`}
                        >
                          {entry.followedPlan ? (
                            <>
                              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                              Plan Followed
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="h-3 w-3" aria-hidden="true" />
                              Rule Break
                            </>
                          )}
                        </span>
                      </div>

                      {entry.lessonLearned && (
                        <p className="max-w-[65ch] border-l-2 border-terminal-border pl-3 text-xs leading-relaxed text-terminal-muted">
                          {entry.lessonLearned}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-terminal-border/60 pt-2.5 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                      <div className="sm:text-right">
                        <p className={`font-mono text-base font-semibold tabular-nums ${pnlColor}`}>
                          {formatCurrency(entry.pnlAmount)}
                        </p>
                        <p className="font-mono text-[11px] text-terminal-muted tabular-nums">
                          {formatR(entry.rMultiple)} · {formatShortDate(entry.tradedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {entry.screenshotUrl && (
                          <a
                            href={entry.screenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand-text underline-offset-4 hover:underline"
                          >
                            Chart
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => void handleDelete(entry.id)}
                          aria-label={`Delete ${entry.symbol} trade entry`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-terminal-muted transition-colors hover:bg-bear/10 hover:text-bear tl-press"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Tab Panel: Emotion Insights */}
      {activeTab === 'insights' && (
        <section aria-labelledby="emotion-insights-heading" className="min-w-0 space-y-6">
          <div className="space-y-1">
            <h2
              id="emotion-insights-heading"
              className="text-base font-semibold tracking-tight text-terminal-text"
            >
              Disciplined vs. Emotional Leak Breakdown
            </h2>
            <p className="max-w-[65ch] text-xs leading-relaxed text-terminal-muted">
              Compare expectancy when following your written plan versus trading from FOMO, revenge,
              or hesitation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 border-y border-terminal-border py-5 sm:grid-cols-2 sm:gap-8">
            <div className="min-w-0">
              <p className="text-xs font-medium text-terminal-muted">
                Calm &amp; Disciplined Net P&amp;L
              </p>
              <p
                className={`mt-1.5 font-mono text-2xl font-semibold tabular-nums ${
                  analytics.calmNetPnl >= 0 ? 'text-bull' : 'text-bear'
                }`}
              >
                {formatCurrency(analytics.calmNetPnl)}
              </p>
              <p className="mt-1 text-xs text-terminal-muted">
                Executed on plan without impulsive entries
              </p>
            </div>

            <div className="min-w-0 border-t border-terminal-border pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <p className="text-xs font-medium text-terminal-muted">
                Emotional Leak Net P&amp;L (FOMO / Revenge / Fear)
              </p>
              <p
                className={`mt-1.5 font-mono text-2xl font-semibold tabular-nums ${
                  analytics.emotionalLeakPnl < 0
                    ? 'text-bear'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {formatCurrency(analytics.emotionalLeakPnl)}
              </p>
              <p className="mt-1 text-xs text-terminal-muted">
                Money lost from FOMO / Revenge instead of your plan
              </p>
            </div>
          </div>

          <div className="divide-y divide-terminal-border border-b border-terminal-border">
            {analytics.byEmotion.map((stat) => (
              <div
                key={stat.emotion}
                className="flex flex-col gap-2.5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${EMOTION_BADGE_STYLES[stat.emotion]}`}
                  >
                    {emotionLabelMap[stat.emotion]}
                  </span>
                  <span className="font-mono text-xs text-terminal-muted tabular-nums">
                    {stat.count} {stat.count === 1 ? 'trade' : 'trades'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-terminal-elevated">
                      <div
                        className="tl-progress-bar h-full rounded-full bg-brand"
                        style={{ width: `${Math.min(100, Math.max(0, stat.winRate))}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-terminal-muted tabular-nums">
                      {stat.winRate}% WR
                    </span>
                  </div>

                  <span
                    className={`min-w-[76px] text-right font-mono text-xs font-semibold tabular-nums ${
                      stat.netPnl > 0
                        ? 'text-bull'
                        : stat.netPnl < 0
                          ? 'text-bear'
                          : 'text-terminal-muted'
                    }`}
                  >
                    {formatCurrency(stat.netPnl)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab Panel: Pre-Trade Checklist */}
      {activeTab === 'checklist' && (
        <div className="min-w-0">
          <PreTradeChecklistCard />
        </div>
      )}
    </div>
  );
}
