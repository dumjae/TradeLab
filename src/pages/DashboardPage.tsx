import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CandlestickChart,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  LineChart,
  NotebookPen,
  SlidersHorizontal,
} from 'lucide-react';
import { OnboardingModal } from '../components/learning/OnboardingModal';
import { DifficultConceptsPanel } from '../components/library/DifficultConceptsPanel';
import { DailyQuoteCard } from '../components/quotes/DailyQuoteCard';
import { CHART_SCENARIOS } from '../data/chartScenarios';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
} from '../data/curriculum';
import {
  computeStudyProgressSummary,
  getOnboardingPreferences,
  getRecommendedNextLesson,
  listLessonProgress,
} from '../services/progressService';
import type { LessonMarketCategory } from '../types/academy';
import type { LessonProgressRecord, OnboardingPreferences } from '../types/learning-loop';

export interface DashboardPageProps {
  onOpenVault: () => void;
}

type MarketFilter = 'all' | LessonMarketCategory;

const DEFAULT_PREFERENCES: OnboardingPreferences = {
  experienceLevel: 'beginner',
  preferredMarket: 'all',
  onboardingCompleted: true,
  updatedAt: '',
};

const MARKET_BADGE_STYLES: Record<LessonMarketCategory, string> = {
  general: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  forex: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  indices: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  crypto: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  stocks: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

const MARKET_ACTIVE_PILL_STYLES: Record<MarketFilter, string> = {
  all: 'border-emerald-500 bg-emerald-500 text-slate-950 font-semibold shadow-sm',
  general: 'border-emerald-500 bg-emerald-500 text-slate-950 font-semibold shadow-sm',
  forex: 'border-sky-500 bg-sky-500 text-slate-950 font-semibold shadow-sm',
  indices: 'border-amber-500 bg-amber-500 text-slate-950 font-semibold shadow-sm',
  crypto: 'border-teal-500 bg-teal-500 text-slate-950 font-semibold shadow-sm',
  stocks: 'border-rose-500 bg-rose-500 text-slate-950 font-semibold shadow-sm',
};

function formatModuleOrder(order: number): string {
  return String(order).padStart(2, '0');
}

export function DashboardPage({ onOpenVault }: DashboardPageProps) {
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');
  const [progressRecords, setProgressRecords] = useState<LessonProgressRecord[]>([]);
  const [preferences, setPreferences] = useState<OnboardingPreferences>(DEFAULT_PREFERENCES);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const autoPromptHandledRef = useRef<boolean>(false);

  useEffect(() => {
    let active = true;
    void Promise.all([listLessonProgress(), getOnboardingPreferences()]).then(
      ([records, prefs]) => {
        if (!active) {
          return;
        }
        setProgressRecords(records);
        setPreferences(prefs);
        if (prefs.preferredMarket !== 'all') {
          setMarketFilter(prefs.preferredMarket);
        }
        if (!prefs.onboardingCompleted && !autoPromptHandledRef.current) {
          autoPromptHandledRef.current = true;
          setOnboardingOpen(true);
        }
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const progressSummary = useMemo(
    () => computeStudyProgressSummary(progressRecords, CURRICULUM_LESSONS.length),
    [progressRecords],
  );

  const completedSlugs = useMemo(
    () => new Set(progressSummary.completedSlugs),
    [progressSummary.completedSlugs],
  );

  const recommendedLesson = useMemo(
    () => getRecommendedNextLesson(progressSummary, preferences),
    [progressSummary, preferences],
  );

  const marketLabelMap = useMemo(
    () =>
      Object.fromEntries(
        LESSON_MARKET_CATEGORIES.map((category) => [category.id, category.label]),
      ) as Record<LessonMarketCategory, string>,
    [],
  );

  const marketCounts = useMemo(() => {
    const counts: Record<MarketFilter, number> = {
      all: CURRICULUM_LESSONS.length,
      general: 0,
      forex: 0,
      indices: 0,
      crypto: 0,
      stocks: 0,
    };
    for (const lesson of CURRICULUM_LESSONS) {
      counts[lesson.marketCategory] = (counts[lesson.marketCategory] ?? 0) + 1;
    }
    return counts;
  }, []);

  const filteredLessons = useMemo(() => {
    if (marketFilter === 'all') {
      return CURRICULUM_LESSONS;
    }
    return CURRICULUM_LESSONS.filter((lesson) => lesson.marketCategory === marketFilter);
  }, [marketFilter]);

  const handleOnboardingSaved = (savedPrefs: OnboardingPreferences) => {
    setPreferences(savedPrefs);
    setMarketFilter(savedPrefs.preferredMarket);
  };

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
                to={`/academy/${recommendedLesson.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:bg-emerald-400 active:scale-[0.98]"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Start Module {formatModuleOrder(recommendedLesson.moduleOrder)}
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
                to="/journal"
                className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-teal-500/45 hover:text-teal-600 dark:hover:text-teal-400"
              >
                <NotebookPen className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" aria-hidden="true" />
                Journal
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

        {/* Sleek Compact Progress & Streak Strip */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-terminal-border/80 bg-terminal-bg/75 p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-terminal-text tabular-nums">
                {progressSummary.completedCount} / {progressSummary.totalLessons} Lessons
              </span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 tabular-nums">
                {progressSummary.percentComplete}%
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                <Flame className="h-3 w-3" aria-hidden="true" />
                {progressSummary.currentStreakDays}-day streak
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Academy study progress"
              aria-valuenow={progressSummary.percentComplete}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 w-full overflow-hidden rounded-full bg-terminal-elevated"
            >
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressSummary.percentComplete}%` }}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              to={`/academy/${recommendedLesson.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/25 dark:text-emerald-300"
            >
              <span>Continue Recommended Lesson</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setOnboardingOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:border-emerald-500/40 hover:text-terminal-text"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Customize Track
            </button>
          </div>
        </div>
      </section>

      {/* Compact 4-Tile Quick Launchers */}
      <section aria-label="Quick workspace launchers" className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Link
          to="/academy"
          className="group flex items-center gap-3 rounded-2xl border border-terminal-border/90 bg-terminal-surface p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500/45"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-terminal-text">Academy</p>
            <p className="truncate text-[11px] text-terminal-muted">5-stage roadmap</p>
          </div>
        </Link>

        <Link
          to="/backtest"
          className="group flex items-center gap-3 rounded-2xl border border-terminal-border/90 bg-terminal-surface p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-500/45"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400">
            <LineChart className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-terminal-text">Backtester</p>
            <p className="truncate text-[11px] text-terminal-muted">Bar-by-bar replay</p>
          </div>
        </Link>

        <Link
          to="/journal"
          className="group flex items-center gap-3 rounded-2xl border border-terminal-border/90 bg-terminal-surface p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-500/45"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500 dark:text-teal-400">
            <NotebookPen className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-terminal-text">Trade Journal</p>
            <p className="truncate text-[11px] text-terminal-muted">Log &amp; emotion edge</p>
          </div>
        </Link>

        <Link
          to="/practice"
          className="group flex items-center gap-3 rounded-2xl border border-terminal-border/90 bg-terminal-surface p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-500/45"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-terminal-text">Practice</p>
            <p className="truncate text-[11px] text-terminal-muted">Active recall drills</p>
          </div>
        </Link>
      </section>

      {/* Daily Trading Wisdom */}
      <DailyQuoteCard onOpenVault={onOpenVault} />

      {/* Curriculum Roadmap */}
      <section aria-labelledby="curriculum-roadmap-heading" className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h2
            id="curriculum-roadmap-heading"
            className="text-base font-semibold tracking-tight text-terminal-text"
          >
            Curriculum
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/academy"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              View Full {CURRICULUM_LESSONS.length}-Lesson Roadmap →
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-sky-500/45 hover:text-sky-600 dark:hover:text-sky-400"
            >
              <GraduationCap className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" aria-hidden="true" />
              Practice
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Clean Market Filter Pills */}
        <div
          role="group"
          aria-label="Filter curriculum by market"
          className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-x-auto px-0.5 pb-1"
        >
          <button
            type="button"
            onClick={() => setMarketFilter('all')}
            aria-pressed={marketFilter === 'all'}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
              marketFilter === 'all'
                ? MARKET_ACTIVE_PILL_STYLES.all
                : 'border-terminal-border bg-terminal-surface text-terminal-muted hover:border-emerald-500/40 hover:text-terminal-text'
            }`}
          >
            <span>All</span>
            <span
              className={`font-mono text-[10px] tabular-nums ${
                marketFilter === 'all' ? 'text-slate-900/80' : 'opacity-70'
              }`}
            >
              {marketCounts.all}
            </span>
          </button>

          {LESSON_MARKET_CATEGORIES.map((category) => {
            const isActive = marketFilter === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setMarketFilter(category.id)}
                aria-pressed={isActive}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                  isActive
                    ? MARKET_ACTIVE_PILL_STYLES[category.id]
                    : 'border-terminal-border bg-terminal-surface text-terminal-muted hover:border-emerald-500/40 hover:text-terminal-text'
                }`}
              >
                <span>{category.label}</span>
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    isActive ? 'text-slate-900/80' : 'opacity-70'
                  }`}
                >
                  {marketCounts[category.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact 1-Line Lesson Cards */}
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {filteredLessons.map((lesson) => {
            const isDone = completedSlugs.has(lesson.slug);
            return (
              <Link
                key={lesson.id}
                to={`/academy/${lesson.slug}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-terminal-border/90 bg-terminal-surface px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/45"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {isDone ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400"
                      aria-label="Completed"
                    />
                  ) : (
                    <span className="shrink-0 font-mono text-xs font-semibold text-terminal-muted tabular-nums">
                      {formatModuleOrder(lesson.moduleOrder)}
                    </span>
                  )}
                  <h3 className="truncate text-sm font-semibold text-terminal-text transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {lesson.title}
                  </h3>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${MARKET_BADGE_STYLES[lesson.marketCategory]}`}
                  >
                    {marketLabelMap[lesson.marketCategory] ?? lesson.marketCategory}
                  </span>
                  <span className="hidden items-center gap-1 font-mono text-[11px] text-terminal-muted tabular-nums sm:inline-flex">
                    <Clock className="h-3 w-3 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                    {lesson.estimatedMinutes}m
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-terminal-muted transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:group-hover:text-emerald-400"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Difficult Concepts Summary */}
      <DifficultConceptsPanel compact />

      <OnboardingModal
        isOpen={onboardingOpen}
        initialPreferences={preferences}
        onClose={() => setOnboardingOpen(false)}
        onSaved={handleOnboardingSaved}
      />
    </div>
  );
}
