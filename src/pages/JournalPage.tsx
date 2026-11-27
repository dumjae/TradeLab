import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  BarChart3,
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

const ASSET_BADGE_STYLES: Record<JournalAssetClass, string> = {
  forex: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  crypto: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  indices: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  stocks: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
  commodities: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

const EMOTION_BADGE_STYLES: Record<JournalEmotion, string> = {
  calm_disciplined: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  fomo: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  revenge: 'border-rose-500/35 bg-rose-500/10 text-rose-600 dark:text-rose-400',
  hesitant: 'border-sky-500/35 bg-sky-500/10 text-sky-600 dark:text-sky-400',
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
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Compact Header */}
      <header className="rounded-3xl border border-terminal-border/90 bg-terminal-surface p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <NotebookPen className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-terminal-text sm:text-2xl">
                Trade Journal
              </h1>
              <p className="text-xs text-terminal-muted">
                Track execution, emotion tags, and rule adherence.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormOpen((prev) => !prev);
              setFormError(null);
            }}
            aria-expanded={formOpen}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
              formOpen
                ? 'border border-terminal-border bg-terminal-bg text-terminal-text hover:border-rose-500/40'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-[0.98]'
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
        </div>

        {/* Compact Top Stats Row */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-terminal-border/80 bg-terminal-bg/80 p-3.5">
            <p className="text-[11px] font-medium text-terminal-muted">Total Trades</p>
            <p className="mt-1 font-mono text-lg font-bold text-terminal-text tabular-nums">
              {analytics.totalTrades}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-terminal-muted tabular-nums">
              {analytics.wins}W · {analytics.losses}L · {analytics.breakevens}BE
            </p>
          </div>

          <div className="rounded-2xl border border-terminal-border/80 bg-terminal-bg/80 p-3.5">
            <p className="text-[11px] font-medium text-terminal-muted">Win Rate</p>
            <p className="mt-1 font-mono text-lg font-bold text-sky-500 dark:text-sky-400 tabular-nums">
              {analytics.winRate}%
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-terminal-muted tabular-nums">
              Avg {formatR(analytics.avgRMultiple)}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-terminal-muted">
              Reward ÷ Risk, e.g. +2R = won 2× your risk
            </p>
          </div>

          <div className="rounded-2xl border border-terminal-border/80 bg-terminal-bg/80 p-3.5">
            <p className="text-[11px] font-medium text-terminal-muted">Net P&amp;L</p>
            <p
              className={`mt-1 font-mono text-lg font-bold tabular-nums ${
                analytics.netPnl > 0
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : analytics.netPnl < 0
                    ? 'text-rose-500 dark:text-rose-400'
                    : 'text-terminal-text'
              }`}
            >
              {formatCurrency(analytics.netPnl)}
            </p>
            <p className="mt-0.5 text-[10px] text-terminal-muted">Realized total</p>
          </div>

          <div className="rounded-2xl border border-terminal-border/80 bg-terminal-bg/80 p-3.5">
            <p className="text-[11px] font-medium text-terminal-muted">Rule Adherence</p>
            <p className="mt-1 font-mono text-lg font-bold text-emerald-500 dark:text-emerald-400 tabular-nums">
              {analytics.ruleAdherencePct}%
            </p>
            <p className="mt-0.5 text-[10px] text-terminal-muted">Followed plan</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3.5 sm:col-span-1">
            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
              Calm vs. Leak P&amp;L
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-2 font-mono text-sm font-bold tabular-nums">
              <span className="text-emerald-500 dark:text-emerald-400">
                {formatCurrency(analytics.calmNetPnl)}
              </span>
              <span className="text-[10px] font-normal text-terminal-muted">vs</span>
              <span
                className={
                  analytics.emotionalLeakPnl < 0
                    ? 'text-rose-500 dark:text-rose-400'
                    : 'text-amber-500 dark:text-amber-400'
                }
              >
                {formatCurrency(analytics.emotionalLeakPnl)}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] leading-snug text-terminal-muted">
              Money lost from FOMO / Revenge instead of your plan
            </p>
          </div>
        </div>
      </header>

      {/* Toggleable Log Trade Form */}
      {formOpen && (
        <section
          aria-labelledby="log-trade-heading"
          className="rounded-3xl border border-emerald-500/30 bg-terminal-surface p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="log-trade-heading" className="text-sm font-semibold text-terminal-text">
              Log Real or Demo Trade
            </h2>
            <span className="text-[11px] text-terminal-muted">Quick entry</span>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="journal-symbol"
                  className="mb-1 block text-[11px] font-medium text-terminal-muted"
                >
                  Symbol *
                </label>
                <input
                  type="text"
                  id="journal-symbol"
                  name="symbol"
                  aria-label="Trading symbol"
                  required
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value)}
                  placeholder="EUR/USD, BTC/USDT"
                  className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="journal-asset-class"
                  className="mb-1 block text-[11px] font-medium text-terminal-muted"
                >
                  Asset Class
                </label>
                <select
                  id="journal-asset-class"
                  name="assetClass"
                  aria-label="Asset class"
                  value={assetClass}
                  onChange={(event) => setAssetClass(event.target.value as JournalAssetClass)}
                  className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
                >
                  {ASSET_CLASS_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="mb-1 block text-[11px] font-medium text-terminal-muted">
                  Direction
                </span>
                <div
                  role="group"
                  aria-label="Trade direction"
                  className="grid grid-cols-2 gap-1.5 rounded-2xl border border-terminal-border bg-terminal-bg p-1"
                >
                  <button
                    type="button"
                    aria-pressed={direction === 'long'}
                    onClick={() => setDirection('long')}
                    className={`rounded-xl py-1.5 text-xs font-semibold transition-colors ${
                      direction === 'long'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-terminal-muted hover:text-terminal-text'
                    }`}
                  >
                    Long
                  </button>
                  <button
                    type="button"
                    aria-pressed={direction === 'short'}
                    onClick={() => setDirection('short')}
                    className={`rounded-xl py-1.5 text-xs font-semibold transition-colors ${
                      direction === 'short'
                        ? 'bg-rose-500 text-white'
                        : 'text-terminal-muted hover:text-terminal-text'
                    }`}
                  >
                    Short
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="journal-setup-tag"
                  className="mb-1 block text-[11px] font-medium text-terminal-muted"
                >
                  Setup Tag
                </label>
                <input
                  type="text"
                  id="journal-setup-tag"
                  name="setupTag"
                  aria-label="Setup tag"
                  value={setupTag}
                  onChange={(event) => setSetupTag(event.target.value)}
                  placeholder="Liquidity Sweep + FVG"
                  className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="journal-pnl"
                  className="mb-1 block text-[11px] font-medium text-terminal-muted"
                >
                  P&amp;L ($) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="journal-pnl"
                  name="pnlAmount"
                  aria-label="Profit or loss in USD"
                  required
                  value={pnlInput}
                  onChange={(event) => setPnlInput(event.target.value)}
                  placeholder="250 or -100"
                  className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2 font-mono text-xs text-terminal-text placeholder:text-terminal-muted focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="journal-r-multiple"
                  className="mb-1 block text-[11px] font-medium text-terminal-muted"
                >
                  R-Multiple
                </label>
                <input
                  type="number"
                  step="any"
                  id="journal-r-multiple"
                  name="rMultiple"
                  aria-label="R-multiple"
                  value={rInput}
                  onChange={(event) => setRInput(event.target.value)}
                  placeholder="2.5 or -1"
                  className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2 font-mono text-xs text-terminal-text placeholder:text-terminal-muted focus:border-emerald-500 focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-terminal-muted">
                  Reward ÷ Risk, e.g. +2R = won 2× your risk
                </p>
              </div>

              <div>
                <label
                  htmlFor="journal-screenshot-url"
                  className="mb-1 block text-[11px] font-medium text-terminal-muted"
                >
                  Chart Screenshot URL (HTTPS)
                </label>
                <input
                  type="url"
                  id="journal-screenshot-url"
                  name="screenshotUrl"
                  aria-label="Optional HTTPS chart screenshot URL"
                  value={screenshotUrl}
                  onChange={(event) => setScreenshotUrl(event.target.value)}
                  placeholder="https://www.tradingview.com/x/..."
                  className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Emotion Selector Pills */}
            <div className="space-y-1.5">
              <span className="block text-[11px] font-medium text-terminal-muted">
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
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selected
                          ? item.isDisciplined
                            ? 'border-emerald-500 bg-emerald-500 font-semibold text-slate-950'
                            : 'border-amber-500 bg-amber-500 font-semibold text-slate-950'
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
              <div className="sm:col-span-8">
                <label
                  htmlFor="journal-lesson-learned"
                  className="mb-1 block text-[11px] font-medium text-terminal-muted"
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
                  className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="journal-followed-plan"
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-3 text-xs font-medium text-terminal-text"
                >
                  <span>Followed Plan</span>
                  <input
                    type="checkbox"
                    id="journal-followed-plan"
                    name="followedPlan"
                    aria-label="Followed trading plan"
                    checked={followedPlan}
                    onChange={(event) => setFollowedPlan(event.target.checked)}
                    className="h-4 w-4 rounded accent-emerald-500"
                  />
                </label>
              </div>
            </div>

            {formError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-2xl border border-rose-500/35 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-500 dark:text-rose-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setFormOpen(false);
                }}
                className="rounded-full border border-terminal-border bg-terminal-bg px-4 py-2 text-xs font-medium text-terminal-muted hover:text-terminal-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {submitting ? 'Saving...' : 'Save Trade'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Clean 3-Pill View Switcher */}
      <div
        role="tablist"
        aria-label="Trade journal views"
        className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface p-1.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'entries'}
          onClick={() => setActiveTab('entries')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === 'entries'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          Entries ({entries.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'insights'}
          onClick={() => setActiveTab('insights')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === 'insights'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          Emotion Insights
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'checklist'}
          onClick={() => setActiveTab('checklist')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === 'checklist'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          Pre-Trade Checklist
        </button>
      </div>

      {/* Tab Panel: Entries */}
      {activeTab === 'entries' && (
        <section aria-label="Logged trades" className="space-y-3">
          {loading ? (
            <div className="h-32 animate-pulse rounded-3xl border border-terminal-border bg-terminal-surface" />
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-terminal-border bg-terminal-surface px-6 py-14 text-center">
              <NotebookPen className="h-8 w-8 text-terminal-muted" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-terminal-text">
                No trades logged yet
              </h2>
              <p className="mt-1 max-w-sm text-xs text-terminal-muted">
                Record real or demo executions to measure rule adherence and spot emotional leaks.
              </p>
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Log First Trade
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {entries.map((entry) => {
                const pnlColor =
                  entry.outcome === 'win'
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : entry.outcome === 'loss'
                      ? 'text-rose-500 dark:text-rose-400'
                      : 'text-terminal-muted';

                return (
                  <article
                    key={entry.id}
                    className="flex flex-col justify-between gap-3 rounded-3xl border border-terminal-border/90 bg-terminal-surface p-4 shadow-sm sm:p-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-terminal-text">
                            {entry.symbol}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              entry.direction === 'long'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {entry.direction === 'long' ? (
                              <TrendingUp className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <TrendingDown className="h-3 w-3" aria-hidden="true" />
                            )}
                            {entry.direction}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${ASSET_BADGE_STYLES[entry.assetClass]}`}
                          >
                            {entry.assetClass}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className={`font-mono text-base font-bold tabular-nums ${pnlColor}`}>
                            {formatCurrency(entry.pnlAmount)}
                          </p>
                          <p className="font-mono text-[11px] text-terminal-muted tabular-nums">
                            {formatR(entry.rMultiple)} · {formatShortDate(entry.tradedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {entry.setupTag && (
                          <span className="rounded-full border border-terminal-border bg-terminal-bg px-2.5 py-0.5 text-[11px] font-medium text-terminal-text">
                            {entry.setupTag}
                          </span>
                        )}

                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${EMOTION_BADGE_STYLES[entry.emotion]}`}
                        >
                          {emotionLabelMap[entry.emotion] ?? entry.emotion}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            entry.followedPlan
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
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
                        <p className="rounded-2xl border border-terminal-border/70 bg-terminal-bg/70 px-3.5 py-2.5 text-xs leading-relaxed text-terminal-text">
                          {entry.lessonLearned}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-terminal-border/60 pt-2.5">
                      {entry.screenshotUrl ? (
                        <a
                          href={entry.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
                        >
                          Chart Screenshot
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-terminal-muted">No screenshot</span>
                      )}

                      <button
                        type="button"
                        onClick={() => void handleDelete(entry.id)}
                        aria-label={`Delete ${entry.symbol} trade entry`}
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-terminal-muted transition-colors hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete
                      </button>
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
        <section
          aria-labelledby="emotion-insights-heading"
          className="space-y-4 rounded-3xl border border-terminal-border/90 bg-terminal-surface p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2
                  id="emotion-insights-heading"
                  className="text-sm font-semibold text-terminal-text sm:text-base"
                >
                  Disciplined vs. Emotional Leak Breakdown
                </h2>
                <p className="text-xs text-terminal-muted">
                  See how headspace impacts your expectancy
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Calm &amp; Disciplined Net P&amp;L
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatCurrency(analytics.calmNetPnl)}
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
                Emotional Leak Net P&amp;L (FOMO / Revenge / Fear)
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {formatCurrency(analytics.emotionalLeakPnl)}
              </p>
              <p className="mt-1 text-[11px] text-rose-700/80 dark:text-rose-300/80">
                Money lost from FOMO / Revenge instead of your plan
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analytics.byEmotion.map((stat) => (
              <div
                key={stat.emotion}
                className="flex flex-col gap-2 rounded-2xl border border-terminal-border bg-terminal-bg/75 p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${EMOTION_BADGE_STYLES[stat.emotion]}`}
                  >
                    {emotionLabelMap[stat.emotion]}
                  </span>
                  <span className="font-mono text-xs text-terminal-muted tabular-nums">
                    {stat.count} {stat.count === 1 ? 'trade' : 'trades'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-terminal-elevated">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(100, Math.max(0, stat.winRate))}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-terminal-muted tabular-nums">
                      {stat.winRate}% WR
                    </span>
                  </div>

                  <span
                    className={`min-w-[76px] text-right font-mono text-xs font-bold tabular-nums ${
                      stat.netPnl > 0
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : stat.netPnl < 0
                          ? 'text-rose-500 dark:text-rose-400'
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
      {activeTab === 'checklist' && <PreTradeChecklistCard />}
    </div>
  );
}
