import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CandlestickChart,
  Clock,
  GraduationCap,
  LineChart,
} from 'lucide-react';
import { DifficultConceptsPanel } from '../components/library/DifficultConceptsPanel';
import { DailyQuoteCard } from '../components/quotes/DailyQuoteCard';
import { CHART_SCENARIOS } from '../data/chartScenarios';
import { CURRICULUM_LESSONS } from '../data/curriculum';

export interface DashboardPageProps {
  onOpenVault: () => void;
}

const LEVEL_STYLES = {
  beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  intermediate: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  advanced: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
} as const;

export function DashboardPage({ onOpenVault }: DashboardPageProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Compact App Hero Surface */}
      <section className="rounded-3xl border border-terminal-border/90 bg-terminal-surface p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-3">
            <h1 className="text-xl font-semibold tracking-tight text-terminal-text sm:text-2xl">
              Master Price Action Visually
            </h1>
            <p className="text-xs text-terminal-muted sm:text-sm">
              Structured lessons, verified YouTube timestamps, and live bar-by-bar replay.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                to={`/academy/${CURRICULUM_LESSONS[0]?.slug ?? 'market-structure'}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:bg-emerald-400 active:scale-[0.98]"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Start Module 01
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                to="/backtest"
                className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-emerald-500/45 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <LineChart className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
                Backtester
              </Link>
              <Link
                to="/lab"
                className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-sky-500/45 hover:text-sky-600 dark:hover:text-sky-400"
              >
                <CandlestickChart className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                Trading Lab
              </Link>
              <Link
                to="/library"
                className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-amber-500/45 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <Bookmark className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
                Library
              </Link>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-3 gap-2.5 lg:w-64">
            <div className="rounded-2xl border border-terminal-border/80 bg-terminal-bg/80 p-3 text-center">
              <p className="font-mono text-xl font-semibold text-emerald-500 dark:text-emerald-400 tabular-nums">
                {CURRICULUM_LESSONS.length}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-terminal-muted">Modules</p>
            </div>
            <div className="rounded-2xl border border-terminal-border/80 bg-terminal-bg/80 p-3 text-center">
              <p className="font-mono text-xl font-semibold text-sky-500 dark:text-sky-400 tabular-nums">
                {CHART_SCENARIOS.length}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-terminal-muted">Replays</p>
            </div>
            <div className="rounded-2xl border border-terminal-border/80 bg-terminal-bg/80 p-3 text-center">
              <p className="font-mono text-xl font-semibold text-amber-500 dark:text-amber-400 tabular-nums">
                4
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-terminal-muted">Modes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Trading Wisdom */}
      <DailyQuoteCard onOpenVault={onOpenVault} />

      {/* Curriculum Roadmap */}
      <section aria-labelledby="curriculum-roadmap-heading" className="space-y-3.5">
        <div className="flex items-center justify-between gap-3 px-1">
          <h2
            id="curriculum-roadmap-heading"
            className="text-base font-semibold tracking-tight text-terminal-text"
          >
            Curriculum
          </h2>
          <Link
            to="/practice"
            className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-sky-500/45 hover:text-sky-600 dark:hover:text-sky-400"
          >
            <GraduationCap className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" aria-hidden="true" />
            Practice
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
          {CURRICULUM_LESSONS.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/academy/${lesson.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-terminal-border/90 bg-terminal-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/45"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-terminal-muted tabular-nums">
                    0{lesson.moduleOrder}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${LEVEL_STYLES[lesson.level]}`}
                  >
                    {lesson.level}
                  </span>
                </div>

                <h3 className="text-sm font-semibold leading-snug text-terminal-text transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {lesson.title}
                </h3>
                <p className="line-clamp-1 text-xs text-terminal-muted">{lesson.subtitle}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-terminal-border/60 pt-3 text-xs text-terminal-muted">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
                  <Clock className="h-3 w-3 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                  {lesson.estimatedMinutes}m
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Open
                  <ArrowRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Difficult Concepts Summary */}
      <DifficultConceptsPanel compact />
    </div>
  );
}
