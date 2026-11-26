import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CandlestickChart,
  Clock,
  GraduationCap,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { DifficultConceptsPanel } from '../components/library/DifficultConceptsPanel';
import { DailyQuoteCard } from '../components/quotes/DailyQuoteCard';
import { CHART_SCENARIOS } from '../data/chartScenarios';
import { CURRICULUM_LESSONS } from '../data/curriculum';

export interface DashboardPageProps {
  onOpenVault: () => void;
}

const LEVEL_STYLES = {
  beginner: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400',
  intermediate: 'border-sky-500/35 bg-sky-500/10 text-sky-400',
  advanced: 'border-amber-500/35 bg-amber-500/10 text-amber-400',
} as const;

export function DashboardPage({ onOpenVault }: DashboardPageProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero Overview */}
      <section className="relative overflow-hidden rounded-2xl border border-terminal-border bg-terminal-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Institutional Visual Learning Terminal
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-terminal-text sm:text-3xl">
              Master Price Action Visually — From Structure &amp; Liquidity to Disciplined Execution
            </h1>
            <p className="text-sm leading-relaxed text-terminal-muted">
              Every lesson combines clear text, interactive blueprints, verified educator video
              timestamps, TradingView candlestick replays, an answer-protected AI Mentor, and
              grounded trader psychology.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                to={`/academy/${CURRICULUM_LESSONS[0]?.slug ?? 'market-structure'}`}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Start Module 01
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 rounded-xl border border-terminal-border bg-terminal-bg px-4 py-2.5 text-xs font-semibold text-terminal-text transition-colors hover:border-sky-500/50 hover:text-sky-400"
              >
                <CandlestickChart className="h-4 w-4 text-sky-400" aria-hidden="true" />
                Open Trading Lab
              </Link>
              <Link
                to="/library"
                className="inline-flex items-center gap-2 rounded-xl border border-terminal-border bg-terminal-bg px-4 py-2.5 text-xs font-semibold text-terminal-text transition-colors hover:border-amber-500/50 hover:text-amber-400"
              >
                <Bookmark className="h-4 w-4 text-amber-400" aria-hidden="true" />
                My Visual Library
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:w-80">
            <div className="rounded-xl border border-terminal-border bg-terminal-bg p-3.5">
              <p className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
                {CURRICULUM_LESSONS.length}
              </p>
              <p className="mt-1 text-[11px] font-medium text-terminal-muted">Core Modules</p>
            </div>
            <div className="rounded-xl border border-terminal-border bg-terminal-bg p-3.5">
              <p className="font-mono text-2xl font-bold text-sky-400 tabular-nums">
                {CHART_SCENARIOS.length}
              </p>
              <p className="mt-1 text-[11px] font-medium text-terminal-muted">Chart Replays</p>
            </div>
            <div className="rounded-xl border border-terminal-border bg-terminal-bg p-3.5">
              <p className="font-mono text-2xl font-bold text-amber-400 tabular-nums">4</p>
              <p className="mt-1 text-[11px] font-medium text-terminal-muted">Visual Modes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Trading Wisdom */}
      <DailyQuoteCard onOpenVault={onOpenVault} />

      {/* Curriculum Roadmap */}
      <section aria-labelledby="curriculum-roadmap-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2
              id="curriculum-roadmap-heading"
              className="flex items-center gap-2 text-base font-semibold text-terminal-text"
            >
              <Layers className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              Trading Academy Curriculum Roadmap
            </h2>
            <p className="text-xs text-terminal-muted">
              Structured progression from market structure fundamentals to risk-controlled execution
            </p>
          </div>
          <Link
            to="/practice"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Practice Drills
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CURRICULUM_LESSONS.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/academy/${lesson.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-terminal-border bg-terminal-surface p-5 transition-all hover:border-emerald-500/50 hover:bg-terminal-elevated/40"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                    MODULE 0{lesson.moduleOrder}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${LEVEL_STYLES[lesson.level]}`}
                  >
                    {lesson.level}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-terminal-text group-hover:text-emerald-400 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs leading-relaxed text-terminal-muted">{lesson.subtitle}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-terminal-border pt-3 text-[11px] text-terminal-muted">
                <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                  <Clock className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                  {lesson.estimatedMinutes} min
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  Open Lesson
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
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
