import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Columns2 } from 'lucide-react';
import { BeforeAfterChartViewer } from '../components/charts/BeforeAfterChartViewer';
import { CHART_SCENARIOS } from '../data/chartScenarios';
import { getLessonBySlug } from '../data/curriculum';

export function TradingLabPage() {
  const [selectedId, setSelectedId] = useState<string>(CHART_SCENARIOS[0]?.id ?? '');

  const activeScenario = useMemo(
    () => CHART_SCENARIOS.find((s) => s.id === selectedId) ?? CHART_SCENARIOS[0],
    [selectedId],
  );

  const sweepScenario = useMemo(
    () => CHART_SCENARIOS.find((s) => s.category === 'liquidity_sweep'),
    [],
  );
  const breakoutScenario = useMemo(
    () => CHART_SCENARIOS.find((s) => s.category === 'true_breakout'),
    [],
  );

  const comparisonScenario = useMemo(() => {
    if (!activeScenario) {
      return undefined;
    }
    if (activeScenario.category === 'liquidity_sweep' && breakoutScenario) {
      return breakoutScenario;
    }
    if (activeScenario.category === 'true_breakout' && sweepScenario) {
      return sweepScenario;
    }
    return CHART_SCENARIOS.find((s) => s.id !== activeScenario.id);
  }, [activeScenario, breakoutScenario, sweepScenario]);

  const linkedLesson = activeScenario ? getLessonBySlug(activeScenario.lessonSlug) : undefined;

  if (!activeScenario) {
    return null;
  }

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-6 tl-page-enter">
      {/* Unboxed Editorial Masthead */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-terminal-border pb-5">
        <div className="min-w-0 space-y-1.5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-terminal-muted">
            Interactive Historical Chart Lab
          </p>
          <h1 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text text-balance sm:text-[1.75rem]">
            Trading Lab — Replay Setups &amp; Compare Sweeps vs. Breakouts
          </h1>
          <p className="max-w-[66ch] text-sm leading-relaxed text-terminal-muted">
            Step through candlestick progressions with structural levels and side-by-side
            comparison mode.
          </p>
        </div>

        {sweepScenario && breakoutScenario && (
          <button
            type="button"
            onClick={() => setSelectedId(sweepScenario.id)}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-terminal-border bg-terminal-surface px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:bg-terminal-elevated tl-press"
          >
            <Columns2 className="h-3.5 w-3.5 text-brand-text" aria-hidden="true" />
            Load Sweep vs. Breakout Pair
          </button>
        )}
      </header>

      {/* Scenario Selector Strip */}
      <section aria-label="Historical chart scenarios" className="min-w-0">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {CHART_SCENARIOS.map((scenario) => {
            const active = scenario.id === activeScenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(scenario.id)}
                className={`min-w-0 rounded-md border p-3.5 text-left transition-colors tl-press ${
                  active
                    ? 'border-brand bg-brand-soft'
                    : 'border-terminal-border bg-terminal-surface hover:border-brand/45 hover:bg-terminal-elevated/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold text-brand-text tabular-nums">
                    {scenario.symbol}
                  </span>
                  <span className="rounded-sm border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] text-terminal-muted tabular-nums">
                    {scenario.timeframe}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs font-semibold leading-snug text-terminal-text">
                  {scenario.title}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Before/Trigger/After Viewer */}
      <div className="min-w-0">
        <BeforeAfterChartViewer
          key={activeScenario.id}
          scenario={activeScenario}
          comparisonScenario={comparisonScenario}
          height={400}
        />
      </div>

      {/* Connected Academy Module Strip */}
      {linkedLesson && (
        <section
          aria-label="Connected academy lesson"
          className="flex flex-wrap items-center justify-between gap-4 border-t border-terminal-border pt-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <BookOpen className="h-4 w-4 shrink-0 text-brand-text" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs text-terminal-muted">Connected Academy Module</p>
              <h2 className="truncate text-sm font-semibold text-terminal-text">
                {linkedLesson.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/academy/${linkedLesson.slug}?mode=diagram`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-terminal-border bg-terminal-surface px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:bg-terminal-elevated tl-press"
            >
              Open Lesson
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to={`/practice/${linkedLesson.slug}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 tl-press"
            >
              Practice This Setup
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
