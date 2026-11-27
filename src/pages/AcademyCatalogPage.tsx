import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
  LESSON_STAGES,
} from '../data/curriculum';
import { listLessonProgress } from '../services/progressService';
import type {
  CurriculumLevel,
  LessonMarketCategory,
} from '../types/academy';

type MarketFilter = 'all' | LessonMarketCategory;
type LevelFilter = 'all' | CurriculumLevel;

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

const LEVEL_BADGE_STYLES: Record<CurriculumLevel, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  intermediate: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  advanced: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const LEVEL_LABELS: Record<CurriculumLevel, string> = {
  beginner: 'Total Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const LEVEL_FILTERS: Array<{ id: LevelFilter; label: string }> = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Total Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

function formatModuleOrder(order: number): string {
  return String(order).padStart(2, '0');
}

function parseInitialMarket(raw: string | null): MarketFilter {
  if (
    raw === 'general' ||
    raw === 'forex' ||
    raw === 'indices' ||
    raw === 'crypto' ||
    raw === 'stocks'
  ) {
    return raw;
  }
  return 'all';
}

export function AcademyCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [marketFilter, setMarketFilter] = useState<MarketFilter>(() =>
    parseInitialMarket(searchParams.get('market')),
  );
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let active = true;
    void listLessonProgress().then((records) => {
      if (!active) {
        return;
      }
      const next = new Set<string>();
      for (const record of records) {
        if (record.completed && record.lessonSlug) {
          next.add(record.lessonSlug);
        }
      }
      setCompletedSlugs(next);
    });
    return () => {
      active = false;
    };
  }, []);

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

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredLessons = useMemo(() => {
    return CURRICULUM_LESSONS.filter((lesson) => {
      if (marketFilter !== 'all' && lesson.marketCategory !== marketFilter) {
        return false;
      }
      if (levelFilter !== 'all' && lesson.level !== levelFilter) {
        return false;
      }
      if (normalizedQuery.length > 0) {
        const marketLabel = (marketLabelMap[lesson.marketCategory] ?? '').toLowerCase();
        const haystack =
          `${lesson.title} ${lesson.conceptKey} ${lesson.level} ${LEVEL_LABELS[lesson.level]} ${marketLabel} ${formatModuleOrder(lesson.moduleOrder)}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }
      return true;
    });
  }, [marketFilter, levelFilter, normalizedQuery, marketLabelMap]);

  const groupedStages = useMemo(() => {
    return LESSON_STAGES.map((stage) => ({
      stage,
      lessons: filteredLessons.filter((lesson) => lesson.learningStage === stage.id),
    })).filter((group) => group.lessons.length > 0);
  }, [filteredLessons]);

  const handleSelectMarket = (nextMarket: MarketFilter) => {
    setMarketFilter(nextMarket);
    const nextParams = new URLSearchParams(searchParams);
    if (nextMarket === 'all') {
      nextParams.delete('market');
    } else {
      nextParams.set('market', nextMarket);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const hasActiveFilters =
    marketFilter !== 'all' || levelFilter !== 'all' || normalizedQuery.length > 0;

  const resetFilters = () => {
    handleSelectMarket('all');
    setLevelFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Compact Catalog Header */}
      <header className="rounded-3xl border border-terminal-border/90 bg-terminal-surface p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-terminal-text sm:text-2xl">
                  Trading Academy
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {CURRICULUM_LESSONS.length} Lessons · {LESSON_STAGES.length} Stages
                </span>
              </div>
              <p className="text-xs text-terminal-muted">
                Filter by market playbook or follow the 5-stage path from foundation to steady execution.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex w-full items-center gap-2 lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-terminal-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                id="academy-search"
                name="academySearch"
                aria-label="Search lessons"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search 18 lessons..."
                className="w-full rounded-2xl border border-terminal-border bg-terminal-bg py-2.5 pl-10 pr-9 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-emerald-500 focus:outline-none"
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear lesson search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-terminal-muted transition-colors hover:text-terminal-text"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <Link
              to="/practice"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-xs font-semibold text-terminal-text transition-colors hover:border-sky-500/45 hover:text-sky-600 dark:hover:text-sky-400"
            >
              <GraduationCap className="h-4 w-4 text-sky-500 dark:text-sky-400" aria-hidden="true" />
              <span className="hidden sm:inline">Practice</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar: Market Pills + Level Segmented Pills */}
        <div className="mt-5 flex flex-col gap-3 border-t border-terminal-border/70 pt-4 md:flex-row md:items-center md:justify-between">
          {/* Horizontal Scrollable Market Category Filter Pills */}
          <div
            role="group"
            aria-label="Filter lessons by market category"
            className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5"
          >
            <button
              type="button"
              onClick={() => handleSelectMarket('all')}
              aria-pressed={marketFilter === 'all'}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                marketFilter === 'all'
                  ? MARKET_ACTIVE_PILL_STYLES.all
                  : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-emerald-500/40 hover:text-terminal-text'
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
                  onClick={() => handleSelectMarket(category.id)}
                  aria-pressed={isActive}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                    isActive
                      ? MARKET_ACTIVE_PILL_STYLES[category.id]
                      : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-emerald-500/40 hover:text-terminal-text'
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

          {/* Optional Level Filter */}
          <div
            role="group"
            aria-label="Filter lessons by difficulty level"
            className="no-scrollbar flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-terminal-border bg-terminal-bg p-1"
          >
            {LEVEL_FILTERS.map((level) => {
              const isActive = levelFilter === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setLevelFilter(level.id)}
                  aria-pressed={isActive}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                    isActive
                      ? 'bg-terminal-surface font-semibold text-terminal-text shadow-sm'
                      : 'text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Active Filter Status Strip */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-terminal-muted">
          <span className="font-mono tabular-nums">
            Showing <strong className="text-terminal-text">{filteredLessons.length}</strong> of{' '}
            {CURRICULUM_LESSONS.length} lessons
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-3 py-1 text-xs font-medium text-terminal-text transition-colors hover:border-emerald-500/45 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset filters
          </button>
        </div>
      )}

      {/* 5-Stage Roadmap */}
      {groupedStages.length === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-terminal-border bg-terminal-surface px-6 py-14 text-center">
          <Layers className="h-8 w-8 text-terminal-muted" aria-hidden="true" />
          <h2 className="mt-3 text-sm font-semibold text-terminal-text">
            No lessons match those filters
          </h2>
          <p className="mt-1 text-xs text-terminal-muted">
            Try switching markets, clearing your search query, or viewing all levels.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Show All {CURRICULUM_LESSONS.length} Lessons
          </button>
        </section>
      ) : (
        <div className="space-y-6">
          {groupedStages.map(({ stage, lessons }) => {
            const stageDoneCount = lessons.filter((lesson) =>
              completedSlugs.has(lesson.slug),
            ).length;
            return (
              <section
                key={stage.id}
                aria-labelledby={`stage-heading-${stage.id}`}
                className="space-y-3"
              >
                {/* Compact Stage Header */}
                <div className="flex flex-col gap-2 px-1 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {stage.step}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <h2
                        id={`stage-heading-${stage.id}`}
                        className="text-sm font-bold tracking-tight text-terminal-text sm:text-base"
                      >
                        Stage {stage.step}: {stage.label}
                      </h2>
                      <p className="text-xs leading-relaxed text-terminal-muted">{stage.tagline}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 sm:pt-0.5">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${
                        stageDoneCount === lessons.length && lessons.length > 0
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'border-terminal-border bg-terminal-surface text-terminal-muted'
                      }`}
                    >
                      {stageDoneCount}/{lessons.length} done
                    </span>
                    <span className="rounded-full border border-terminal-border bg-terminal-surface px-2.5 py-0.5 font-mono text-[11px] text-terminal-muted tabular-nums">
                      {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </div>
                </div>

                {/* Compact Tappable Lesson Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {lessons.map((lesson) => {
                    const isCompleted = completedSlugs.has(lesson.slug);
                    return (
                      <Link
                        key={lesson.id}
                        to={`/academy/${lesson.slug}`}
                        className={`group flex flex-col justify-between rounded-2xl border bg-terminal-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/45 ${
                          isCompleted
                            ? 'border-emerald-500/35'
                            : 'border-terminal-border/90'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-terminal-muted tabular-nums">
                                {formatModuleOrder(lesson.moduleOrder)}
                              </span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${MARKET_BADGE_STYLES[lesson.marketCategory]}`}
                              >
                                {marketLabelMap[lesson.marketCategory] ?? lesson.marketCategory}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isCompleted && (
                                <span
                                  aria-label="Lesson completed"
                                  className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                                >
                                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                  Done
                                </span>
                              )}
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${LEVEL_BADGE_STYLES[lesson.level]}`}
                              >
                                {LEVEL_LABELS[lesson.level]}
                              </span>
                            </div>
                          </div>

                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-terminal-text transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {lesson.title}
                          </h3>
                        </div>

                        <div className="mt-3.5 flex items-center justify-between border-t border-terminal-border/60 pt-2.5 text-xs text-terminal-muted">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
                            <Clock className="h-3 w-3 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                            {lesson.estimatedMinutes}m
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {isCompleted ? 'Review' : 'Study'}
                            <ArrowRight
                              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
