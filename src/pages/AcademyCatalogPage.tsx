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
import { useLanguage } from '../context/LanguageContext';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
  LESSON_STAGES,
} from '../data/curriculum';
import { LESSON_TAGLISH_SUMMARIES, UI_COPY } from '../data/taglishTranslations';
import { TRADING_ACRONYMS, expandAcronyms } from '../lib/acronymHelper';
import { listLessonProgress } from '../services/progressService';
import type {
  CurriculumLevel,
  LessonMarketCategory,
  LessonStage,
} from '../types/academy';

type MarketFilter = 'all' | LessonMarketCategory;
type LevelFilter = 'all' | CurriculumLevel;

const MARKET_BADGE_STYLES: Record<LessonMarketCategory, string> = {
  general: 'border-brand/30 bg-brand-soft text-brand',
  forex: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  indices: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  crypto: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  stocks: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

const MARKET_ACTIVE_PILL_STYLES: Record<MarketFilter, string> = {
  all: 'border-brand bg-brand text-brand-fg font-semibold shadow-sm',
  general: 'border-brand bg-brand text-brand-fg font-semibold shadow-sm',
  forex: 'border-sky-500 bg-sky-500 text-slate-950 font-semibold shadow-sm',
  indices: 'border-amber-500 bg-amber-500 text-slate-950 font-semibold shadow-sm',
  crypto: 'border-teal-500 bg-teal-500 text-slate-950 font-semibold shadow-sm',
  stocks: 'border-rose-500 bg-rose-500 text-slate-950 font-semibold shadow-sm',
};

const LEVEL_BADGE_STYLES: Record<CurriculumLevel, string> = {
  beginner: 'bg-bull/15 text-bull',
  intermediate: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  advanced: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const LEVEL_LABELS: Record<CurriculumLevel, { en: string; taglish: string }> = {
  beginner: { en: 'Beginner', taglish: 'Baguhan' },
  intermediate: { en: 'Intermediate', taglish: 'Mid-Level' },
  advanced: { en: 'Advanced', taglish: 'Advanced' },
};

const STAGE_TAGLISH_COPY: Record<LessonStage, { label: string; tagline: string }> = {
  foundations: {
    label: 'Simula at Price Action Basics',
    tagline: 'Basahin ang candles, trend structure, at support/resistance nang malinaw.',
  },
  price_action_smc: {
    label: 'Liquidity at SMC (Smart Money Concepts)',
    tagline: 'Alamin kung saan nakatago ang stop losses, fakeouts, at FVG (Fair Value Gap).',
  },
  market_playbooks: {
    label: 'Playbooks Bawat Market',
    tagline: 'Tamang timing para sa Forex, Indices, Crypto, at Stocks.',
  },
  execution_edge: {
    label: 'Malinis na Entry at Trade Management',
    tagline: 'Pumili lang ng A+ setups at protektahan ang kita sa tamang exit.',
  },
  steady_profitability: {
    label: 'Risk Management at Consistency',
    tagline: 'Ingatan ang account gamit ang 1% risk rule, journal, at drawdown control.',
  },
};

const LEVEL_FILTERS: Array<{ id: LevelFilter; en: string; taglish: string }> = [
  { id: 'all', en: 'All Levels', taglish: 'Lahat' },
  { id: 'beginner', en: 'Beginner', taglish: 'Baguhan' },
  { id: 'intermediate', en: 'Intermediate', taglish: 'Mid-Level' },
  { id: 'advanced', en: 'Advanced', taglish: 'Advanced' },
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

function getTitleAcronymHint(title: string): string | null {
  const expanded = expandAcronyms(title);
  if (expanded === title) {
    return null;
  }
  const pairs: string[] = [];
  for (const [code, meaning] of Object.entries(TRADING_ACRONYMS)) {
    if (expanded.includes(`${code} (${meaning})`)) {
      pairs.push(`${code} (${meaning})`);
    }
  }
  return pairs.length > 0 ? pairs.slice(0, 3).join(' · ') : null;
}

export function AcademyCatalogPage() {
  const { isTaglish, t } = useLanguage();
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
        const expandedTitle = expandAcronyms(lesson.title);
        const haystack =
          `${lesson.title} ${expandedTitle} ${lesson.conceptKey} ${lesson.level} ${LEVEL_LABELS[lesson.level].en} ${marketLabel} ${formatModuleOrder(lesson.moduleOrder)}`.toLowerCase();
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
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Compact Catalog Header */}
      <header className="rounded-2xl border border-terminal-border/90 bg-terminal-surface p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft text-brand">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-terminal-text sm:text-xl">
                  {t(UI_COPY.academy.title.en, UI_COPY.academy.title.taglish)}
                </h1>
                <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-brand tabular-nums">
                  {CURRICULUM_LESSONS.length} {t('Lessons', 'Aralin')} · {LESSON_STAGES.length}{' '}
                  {t('Stages', 'Stage')}
                </span>
              </div>
              <p className="text-xs text-terminal-muted">
                {t(UI_COPY.academy.subtitle.en, UI_COPY.academy.subtitle.taglish)}
              </p>
            </div>
          </div>

          {/* Compact Search Input + Practice CTA */}
          <div className="flex w-full items-center gap-2 lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-terminal-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                id="academy-search"
                name="academySearch"
                aria-label="Search lessons"
                value={searchQuery}
                placeholder={t('Search lessons or terms...', 'Maghanap ng lesson o term...')}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-terminal-border bg-terminal-bg py-2 pl-9 pr-8 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear lesson search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-terminal-muted transition-colors hover:text-terminal-text"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <Link
              to="/practice"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/45 hover:text-brand"
            >
              <GraduationCap className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              <span className="hidden sm:inline">{t('Practice', 'Quiz')}</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar: Market Pills + Level Segmented Pills */}
        <div className="mt-4 flex flex-col gap-2.5 border-t border-terminal-border/70 pt-3.5 md:flex-row md:items-center md:justify-between">
          <div
            role="group"
            aria-label="Filter lessons by market category"
            className="no-scrollbar flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5"
          >
            <button
              type="button"
              onClick={() => handleSelectMarket('all')}
              aria-pressed={marketFilter === 'all'}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
                marketFilter === 'all'
                  ? MARKET_ACTIVE_PILL_STYLES.all
                  : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-brand/40 hover:text-terminal-text'
              }`}
            >
              <span>{t('All', 'Lahat')}</span>
              <span className="font-mono text-[10px] opacity-80 tabular-nums">
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
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
                    isActive
                      ? MARKET_ACTIVE_PILL_STYLES[category.id]
                      : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-brand/40 hover:text-terminal-text'
                  }`}
                >
                  <span>{category.label}</span>
                  <span className="font-mono text-[10px] opacity-80 tabular-nums">
                    {marketCounts[category.id]}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="group"
            aria-label="Filter lessons by difficulty level"
            className="no-scrollbar flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-terminal-border bg-terminal-bg p-0.5"
          >
            {LEVEL_FILTERS.map((level) => {
              const isActive = levelFilter === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setLevelFilter(level.id)}
                  aria-pressed={isActive}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-soft font-semibold text-brand'
                      : 'text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {t(level.en, level.taglish)}
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
            {t('Showing', 'Ipinapakita')}{' '}
            <strong className="text-terminal-text">{filteredLessons.length}</strong> /{' '}
            {CURRICULUM_LESSONS.length} {t('lessons', 'aralin')}
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-3 py-1 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45 hover:text-brand"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            {t('Reset filters', 'I-reset')}
          </button>
        </div>
      )}

      {/* 5-Stage Compact Roadmap */}
      {groupedStages.length === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-2xl border border-terminal-border bg-terminal-surface px-6 py-12 text-center">
          <Layers className="h-7 w-7 text-terminal-muted" aria-hidden="true" />
          <h2 className="mt-2.5 text-sm font-semibold text-terminal-text">
            {t('No lessons match those filters', 'Walang lesson na tugma sa filter')}
          </h2>
          <p className="mt-1 text-xs text-terminal-muted">
            {t(
              'Try switching markets or clearing your search.',
              'Subukang magpalit ng market o burahin ang search.',
            )}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t(`Show All ${CURRICULUM_LESSONS.length} Lessons`, `Ipakita Lahat (${CURRICULUM_LESSONS.length})`)}
          </button>
        </section>
      ) : (
        <div className="space-y-5">
          {groupedStages.map(({ stage, lessons }) => {
            const stageDoneCount = lessons.filter((lesson) =>
              completedSlugs.has(lesson.slug),
            ).length;
            const stageTaglish = STAGE_TAGLISH_COPY[stage.id];

            return (
              <section
                key={stage.id}
                aria-labelledby={`stage-heading-${stage.id}`}
                className="space-y-2.5"
              >
                {/* Compact Stage Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand-soft font-mono text-[11px] font-bold text-brand tabular-nums">
                      {stage.step}
                    </span>
                    <div className="min-w-0">
                      <h2
                        id={`stage-heading-${stage.id}`}
                        className="text-sm font-bold tracking-tight text-terminal-text"
                      >
                        Stage {stage.step}: {t(stage.label, stageTaglish.label)}
                      </h2>
                      <p className="line-clamp-1 text-[11px] text-terminal-muted">
                        {t(expandAcronyms(stage.tagline), stageTaglish.tagline)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums ${
                      stageDoneCount === lessons.length && lessons.length > 0
                        ? 'border-bull/40 bg-bull/15 text-bull'
                        : 'border-terminal-border bg-terminal-surface text-terminal-muted'
                    }`}
                  >
                    {stageDoneCount}/{lessons.length} {t('done', 'tapos')}
                  </span>
                </div>

                {/* Compact Scannable Lesson Cards */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {lessons.map((lesson) => {
                    const isCompleted = completedSlugs.has(lesson.slug);
                    const acronymHint = getTitleAcronymHint(lesson.title);
                    const summaryText = isTaglish
                      ? (LESSON_TAGLISH_SUMMARIES[lesson.slug]?.plainSummary ??
                        expandAcronyms(lesson.plainEnglishSummary ?? ''))
                      : expandAcronyms(lesson.plainEnglishSummary ?? '');

                    return (
                      <Link
                        key={lesson.id}
                        to={`/academy/${lesson.slug}`}
                        className={`group flex flex-col justify-between rounded-xl border bg-terminal-surface p-3.5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand/50 ${
                          isCompleted
                            ? 'border-bull/40'
                            : 'border-terminal-border/90'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] font-semibold text-terminal-muted tabular-nums">
                                {formatModuleOrder(lesson.moduleOrder)}
                              </span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${MARKET_BADGE_STYLES[lesson.marketCategory]}`}
                              >
                                {marketLabelMap[lesson.marketCategory] ?? lesson.marketCategory}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {isCompleted && (
                                <span
                                  aria-label="Lesson completed"
                                  className="inline-flex items-center gap-0.5 rounded-full border border-bull/40 bg-bull/15 px-1.5 py-0.5 text-[10px] font-semibold text-bull"
                                >
                                  <CheckCircle2 className="h-2.5 w-2.5" aria-hidden="true" />
                                  {t('Done', 'Tapos')}
                                </span>
                              )}
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${LEVEL_BADGE_STYLES[lesson.level]}`}
                              >
                                {t(LEVEL_LABELS[lesson.level].en, LEVEL_LABELS[lesson.level].taglish)}
                              </span>
                            </div>
                          </div>

                          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-terminal-text transition-colors group-hover:text-brand">
                            {lesson.title}
                          </h3>

                          {acronymHint && (
                            <p className="truncate font-mono text-[10px] text-brand/90">
                              {acronymHint}
                            </p>
                          )}

                          {summaryText && (
                            <p className="line-clamp-2 text-[11px] leading-relaxed text-terminal-muted">
                              {summaryText}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-terminal-border/60 pt-2 text-[11px] text-terminal-muted">
                          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                            <Clock className="h-3 w-3 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                            {lesson.estimatedMinutes} {UI_COPY.academy.minutesShort.en}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-brand">
                            {isCompleted
                              ? t('Review', 'Balikan')
                              : t(UI_COPY.academy.startLesson.en, UI_COPY.academy.startLesson.taglish)}
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
