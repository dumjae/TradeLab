import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CandlestickChart, Columns2 } from 'lucide-react';
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
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-terminal-border bg-terminal-surface p-5">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/35 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-sky-400">
            <CandlestickChart className="h-3.5 w-3.5" aria-hidden="true" />
            Interactive Historical Chart Lab
          </span>
          <h1 className="text-xl font-bold text-terminal-text">
            Trading Lab — Replay Setups &amp; Compare Sweeps vs. Breakouts
          </h1>
          <p className="text-xs text-terminal-muted">
            Step through realistic candlestick progressions with TradingView Lightweight Charts,
            structural levels, and side-by-side comparison mode.
          </p>
        </div>

        {sweepScenario && breakoutScenario && (
          <button
            type="button"
            onClick={() => setSelectedId(sweepScenario.id)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/35 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20"
          >
            <Columns2 className="h-4 w-4" aria-hidden="true" />
            Load Sweep vs. Breakout Pair
          </button>
        )}
      </header>

      {/* Scenario Selector Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {CHART_SCENARIOS.map((scenario) => {
          const active = scenario.id === activeScenario.id;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setSelectedId(scenario.id)}
              className={`rounded-xl border p-3.5 text-left transition-all ${
                active
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-terminal-border bg-terminal-surface hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold text-emerald-400">
                  {scenario.symbol}
                </span>
                <span className="rounded bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] text-terminal-muted">
                  {scenario.timeframe}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs font-semibold text-terminal-text">
                {scenario.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Before/Trigger/After Viewer */}
      <BeforeAfterChartViewer
        key={activeScenario.id}
        scenario={activeScenario}
        comparisonScenario={comparisonScenario}
        height={400}
      />

      {/* Linked Lesson Callout */}
      {linkedLesson && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-terminal-border bg-terminal-surface p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10 text-emerald-400">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs text-terminal-muted">Connected Academy Module</p>
              <p className="text-sm font-semibold text-terminal-text">{linkedLesson.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/academy/${linkedLesson.slug}?mode=diagram`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-text hover:border-emerald-500/50 hover:text-emerald-400"
            >
              Open Lesson
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to={`/practice/${linkedLesson.slug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg hover:brightness-110"
            >
              Practice This Setup
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
