import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookMarked,
  Building2,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Coins,
  FlaskConical,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Unlock,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  ACADEMY_MODULES,
  ACADEMY_PATHS,
  ACADEMY_PILLARS,
  ALL_SYLLABUS_LESSONS,
  MASTERY_LEVELS,
  getModulesForPath,
  getTopicsForModule,
} from '../data/academyRoadmap';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
  LESSON_STAGES,
} from '../data/curriculum';
import { LESSON_TAGLISH_SUMMARIES, UI_COPY } from '../data/taglishTranslations';
import { TRADING_ACRONYMS, expandAcronyms } from '../lib/acronymHelper';
import { localizeMarketTimes } from '../lib/marketTime';
import {
  computeMasterySummary,
  isFreeBrowseEnabled,
  isTopicUnlocked,
  listLevelAssessments,
  listTopicProgress,
  setFreeBrowseEnabled,
} from '../services/academyProgressService';
import { listLessonProgress } from '../services/progressService';
import type {
  CurriculumLevel,
  Lesson,
  LessonMarketCategory,
  LessonStage,
} from '../types/academy';
import type {
  AcademyPathId,
  AcademyPillarId,
  LevelAssessmentResult,
  TopicProgressRecord,
} from '../types/curriculum-tree';

type MarketFilter = 'all' | LessonMarketCategory;
type SpecificMarketId = Exclude<LessonMarketCategory, 'general'>;
type LevelFilter = 'all' | CurriculumLevel;

const LEVEL_LABELS: Record<CurriculumLevel, { en: string; taglish: string }> = {
  beginner: { en: 'Beginner', taglish: 'Baguhan' },
  intermediate: { en: 'Intermediate', taglish: 'Mid-Level' },
  advanced: { en: 'Advanced', taglish: 'Advanced' },
};

const STAGE_TAGLISH_COPY: Record<LessonStage, { label: string; tagline: string }> = {
  foundations: {
    label: 'Simula at Pagbasa ng Chart',
    tagline: 'Timeframes, axes, chart tools, candlesticks, structure, at support/resistance.',
  },
  price_action_smc: {
    label: 'Liquidity at SMC (Smart Money Concepts)',
    tagline: 'Alamin kung saan nakatago ang stop losses, fakeouts, at FVG (Fair Value Gap).',
  },
  market_playbooks: {
    label: 'Hiwalay na Market Tracks',
    tagline: 'Tamang rules para sa Crypto, Forex, Stocks, at Indices.',
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

const CATALOG_FILTER_TABS: Array<{
  id: MarketFilter;
  en: string;
  taglish: string;
}> = [
  { id: 'all', en: 'All', taglish: 'Lahat' },
  { id: 'general', en: 'Universal Core', taglish: 'Universal Core' },
  { id: 'crypto', en: 'Crypto', taglish: 'Crypto' },
  { id: 'forex', en: 'Forex', taglish: 'Forex' },
  { id: 'stocks', en: 'Stocks', taglish: 'Stocks' },
  { id: 'indices', en: 'Indices', taglish: 'Indices' },
];

interface MarketTrackMeta {
  id: SpecificMarketId;
  titleEn: string;
  titleTaglish: string;
  taglineEn: string;
  taglineTaglish: string;
  icon: typeof Coins;
}

const DEDICATED_MARKET_TRACKS: MarketTrackMeta[] = [
  {
    id: 'crypto',
    titleEn: UI_COPY.academyTracks.cryptoTrack.en,
    titleTaglish: UI_COPY.academyTracks.cryptoTrack.taglish,
    taglineEn: 'Spot vs. Perps, 24/7 liquidity sweeps, funding rates & altcoin sizing.',
    taglineTaglish: 'Spot vs. Perps, 24/7 liquidity sweeps, funding rates at altcoin sizing.',
    icon: Coins,
  },
  {
    id: 'forex',
    titleEn: UI_COPY.academyTracks.forexTrack.en,
    titleTaglish: UI_COPY.academyTracks.forexTrack.taglish,
    taglineEn: 'Currency pairs, pips/lots, London & NY Killzones, CPI & NFP rates.',
    taglineTaglish: 'Currency pairs, pips/lots, London & NY Killzones, CPI at NFP rates.',
    icon: Globe,
  },
  {
    id: 'stocks',
    titleEn: UI_COPY.academyTracks.stocksTrack.en,
    titleTaglish: UI_COPY.academyTracks.stocksTrack.taglish,
    taglineEn: 'Market hours, Limit vs. Market orders, pre-market gaps, VWAP & earnings.',
    taglineTaglish: 'Market hours, Limit vs. Market orders, pre-market gaps, VWAP at earnings.',
    icon: Building2,
  },
  {
    id: 'indices',
    titleEn: UI_COPY.academyTracks.indicesTrack.en,
    titleTaglish: UI_COPY.academyTracks.indicesTrack.taglish,
    taglineEn: localizeMarketTimes(
      'NAS100 & SPX500 point math, 9:30 AM NY Open sweeps & VIX/DXY correlations.',
    ),
    taglineTaglish: localizeMarketTimes(
      'NAS100 at SPX500 point math, 9:30 AM NY Open sweeps at VIX/DXY.',
    ),
    icon: BarChart3,
  },
];

const LEVEL_FILTERS: Array<{ id: LevelFilter; en: string; taglish: string }> = [
  { id: 'all', en: 'All Levels', taglish: 'Lahat' },
  { id: 'beginner', en: 'Beginner', taglish: 'Baguhan' },
  { id: 'intermediate', en: 'Intermediate', taglish: 'Mid-Level' },
  { id: 'advanced', en: 'Advanced', taglish: 'Advanced' },
];

const SYLLABUS_PATH_TABS: Array<{
  id: AcademyPathId;
  labelEn: string;
  labelTaglish: string;
}> = [
  { id: 'master_foundations', labelEn: 'Foundations (M1–M6)', labelTaglish: 'Foundations (M1–M6)' },
  { id: 'forex', labelEn: 'Forex (F1–F5)', labelTaglish: 'Forex (F1–F5)' },
  { id: 'indices', labelEn: 'Indices (I1–I5)', labelTaglish: 'Indices (I1–I5)' },
  { id: 'stocks', labelEn: 'Stocks (S1–S6)', labelTaglish: 'Stocks (S1–S6)' },
  { id: 'crypto', labelEn: 'Crypto (C1–C6)', labelTaglish: 'Crypto (C1–C6)' },
  {
    id: 'advanced_price_action',
    labelEn: 'Advanced & SMC (M7–M9)',
    labelTaglish: 'Advanced & SMC (M7–M9)',
  },
  { id: 'strategy_pro', labelEn: 'Strategy & Pro (7–8)', labelTaglish: 'Strategy & Pro (7–8)' },
  { id: 'philippines_pse', labelEn: 'PH / PSE (Optional)', labelTaglish: 'PH / PSE (Opsyonal)' },
];

function parseInitialPathFromPillar(pillarParam: string | null): AcademyPathId {
  if (pillarParam === 'specializations') {
    return 'forex';
  }
  if (pillarParam === 'advanced') {
    return 'advanced_price_action';
  }
  return 'master_foundations';
}

function getDefaultExpandedModules(pathId: AcademyPathId): Set<string> {
  const mods = getModulesForPath(pathId);
  return mods.length > 0 ? new Set([mods[0].id]) : new Set();
}

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
  const [topicProgressList, setTopicProgressList] = useState<TopicProgressRecord[]>([]);
  const [levelAssessments, setLevelAssessments] = useState<LevelAssessmentResult[]>([]);
  const [freeBrowse, setFreeBrowse] = useState<boolean>(() => isFreeBrowseEnabled());
  const [activePath, setActivePath] = useState<AcademyPathId>(() =>
    parseInitialPathFromPillar(searchParams.get('pillar')),
  );
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(() =>
    getDefaultExpandedModules(parseInitialPathFromPillar(searchParams.get('pillar'))),
  );

  useEffect(() => {
    let active = true;
    setFreeBrowse(isFreeBrowseEnabled());
    void Promise.all([
      listLessonProgress(),
      listTopicProgress(),
      listLevelAssessments(),
    ]).then(([lessonRecords, topicRecords, assessmentRecords]) => {
      if (!active) {
        return;
      }
      const next = new Set<string>();
      for (const record of lessonRecords) {
        if (record.completed && record.lessonSlug) {
          next.add(record.lessonSlug);
        }
      }
      setCompletedSlugs(next);
      setTopicProgressList(topicRecords);
      setLevelAssessments(assessmentRecords);
    });
    return () => {
      active = false;
    };
  }, []);

  const topicProgressMap = useMemo(() => {
    const map: Record<string, TopicProgressRecord> = {};
    for (const record of topicProgressList) {
      map[record.topicCode] = record;
    }
    return map;
  }, [topicProgressList]);

  const masterySummary = useMemo(
    () => computeMasterySummary(topicProgressList, levelAssessments),
    [topicProgressList, levelAssessments],
  );

  const activePathMeta = useMemo(
    () => ACADEMY_PATHS.find((p) => p.id === activePath) ?? ACADEMY_PATHS[0],
    [activePath],
  );

  const activePathModules = useMemo(() => getModulesForPath(activePath), [activePath]);

  const handleToggleFreeBrowse = () => {
    const nextValue = !freeBrowse;
    setFreeBrowseEnabled(nextValue);
    setFreeBrowse(nextValue);
  };

  const handleSelectSyllabusPath = (nextPath: AcademyPathId) => {
    setActivePath(nextPath);
    setExpandedModuleIds(getDefaultExpandedModules(nextPath));
  };

  const handlePillarJump = (pillarId: AcademyPillarId) => {
    if (pillarId === 'foundations') {
      handleSelectSyllabusPath('master_foundations');
    } else if (pillarId === 'specializations') {
      handleSelectSyllabusPath('forex');
    } else if (pillarId === 'advanced') {
      handleSelectSyllabusPath('advanced_price_action');
    }
    if (typeof document !== 'undefined') {
      document
        .getElementById('master-syllabus-explorer')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleModuleAccordion = (moduleId: string) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

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
        const taglishSummary = LESSON_TAGLISH_SUMMARIES[lesson.slug]?.plainSummary ?? '';
        const haystack =
          `${lesson.title} ${expandedTitle} ${lesson.plainEnglishSummary ?? ''} ${taglishSummary} ${lesson.conceptKey} ${lesson.level} ${LEVEL_LABELS[lesson.level].en} ${marketLabel} ${formatModuleOrder(lesson.moduleOrder)}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }
      return true;
    });
  }, [marketFilter, levelFilter, normalizedQuery, marketLabelMap]);

  const universalCoreLessons = useMemo(
    () => filteredLessons.filter((lesson) => lesson.marketCategory === 'general'),
    [filteredLessons],
  );

  const universalCoreStages = useMemo(() => {
    return LESSON_STAGES.filter((stage) => stage.id !== 'market_playbooks')
      .map((stage) => ({
        stage,
        lessons: universalCoreLessons.filter((lesson) => lesson.learningStage === stage.id),
      }))
      .filter((group) => group.lessons.length > 0);
  }, [universalCoreLessons]);

  const marketTrackGroups = useMemo(() => {
    return DEDICATED_MARKET_TRACKS.map((track) => ({
      track,
      lessons: filteredLessons.filter((lesson) => lesson.marketCategory === track.id),
    })).filter((group) => group.lessons.length > 0);
  }, [filteredLessons]);

  const showUniversalSection =
    (marketFilter === 'all' || marketFilter === 'general') && universalCoreStages.length > 0;

  const showMarketTracksSection =
    marketFilter !== 'general' && marketTrackGroups.length > 0;

  const activeSpecificTrackGroup =
    marketFilter !== 'all' && marketFilter !== 'general'
      ? marketTrackGroups.find((group) => group.track.id === marketFilter) ?? null
      : null;

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

  const renderLessonItem = (lesson: Lesson, trackIndex?: number) => {
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
        className="tl-row-interactive group flex flex-col justify-between border-b border-terminal-border py-4 transition-colors hover:bg-terminal-surface/50 sm:px-2 sm:-mx-2 sm:rounded-md"
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 font-mono text-[11px] tabular-nums text-terminal-muted">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brand-text">
                {trackIndex !== undefined
                  ? `0${trackIndex + 1}`
                  : formatModuleOrder(lesson.moduleOrder)}
              </span>
              <span>
                ·{' '}
                {lesson.marketCategory === 'general'
                  ? t('Universal', 'Universal')
                  : (marketLabelMap[lesson.marketCategory] ?? lesson.marketCategory)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isCompleted && (
                <span
                  aria-label="Lesson completed"
                  className="inline-flex items-center gap-1 font-semibold text-bull"
                >
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  {t('Done', 'Tapos')}
                </span>
              )}
              <span>
                {t(LEVEL_LABELS[lesson.level].en, LEVEL_LABELS[lesson.level].taglish)}
              </span>
            </div>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-terminal-text transition-colors group-hover:text-brand-text">
            {lesson.title}
          </h3>

          {acronymHint && (
            <p className="truncate font-mono text-[11px] text-brand-text">{acronymHint}</p>
          )}

          {summaryText && (
            <p className="line-clamp-2 text-xs leading-relaxed text-terminal-muted">
              {summaryText}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-terminal-muted">
          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
            <Clock className="h-3 w-3 text-terminal-muted" aria-hidden="true" />
            {lesson.estimatedMinutes} {UI_COPY.academy.minutesShort.en}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand-text">
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
  };

  return (
    <div className="tl-page-enter mx-auto max-w-6xl space-y-10">
      {/* Band 1: Unboxed Editorial Masthead */}
      <header className="space-y-6 border-b border-terminal-border pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-terminal-muted">
              {t(
                `Master Syllabus · ${ACADEMY_MODULES.length} Modules · ${ALL_SYLLABUS_LESSONS.length} Topics`,
                `Master Syllabus · ${ACADEMY_MODULES.length} Module · ${ALL_SYLLABUS_LESSONS.length} Paksa`,
              )}
            </p>
            <h1 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text text-balance sm:text-3xl">
              {t(UI_COPY.academy.title.en, UI_COPY.academy.title.taglish)}
            </h1>
            <p className="max-w-[62ch] text-sm leading-relaxed text-terminal-muted">
              {t(UI_COPY.academy.subtitle.en, UI_COPY.academy.subtitle.taglish)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium">
            <Link
              to="/glossary"
              className="inline-flex items-center gap-1.5 text-terminal-muted underline-offset-4 transition-colors hover:text-terminal-text hover:underline"
            >
              <BookMarked className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
              <span>{t('Glossary & Flashcards', 'Glossary at Flashcards')}</span>
            </Link>
            <Link
              to="/evaluation"
              className="inline-flex items-center gap-1.5 text-bull underline-offset-4 transition-opacity hover:opacity-85 hover:underline"
            >
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('Level Evaluation', 'Level Evaluation')}</span>
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center gap-1.5 text-brand-text underline-offset-4 transition-opacity hover:opacity-85 hover:underline"
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('Practice Drills', 'Mag-Quiz')}</span>
            </Link>
          </div>
        </div>

        {/* Live Mastery Hairline + Progression Mode + Search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1 space-y-2 lg:max-w-md">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <span className="font-mono font-medium tabular-nums text-terminal-text">
                {masterySummary.completedTopics}/{masterySummary.totalTopics}{' '}
                {t('topics', 'paksa')} ({masterySummary.overallPercent}%)
              </span>
              {masterySummary.nextRecommendedTopic && (
                <Link
                  to={`/academy/topic/${masterySummary.nextRecommendedTopic.slug}`}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-bull underline-offset-4 hover:underline"
                >
                  <span>
                    {t('Next:', 'Sunod:')} {masterySummary.nextRecommendedTopic.code}
                  </span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              )}
            </div>
            <div
              role="progressbar"
              aria-label="Master Academy overall syllabus completion"
              aria-valuenow={masterySummary.overallPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1 w-full overflow-hidden rounded-full bg-terminal-elevated"
            >
              <div
                className="tl-progress-bar h-full rounded-full bg-brand"
                style={{ width: `${masterySummary.overallPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleToggleFreeBrowse}
              aria-pressed={freeBrowse}
              className={`tl-press inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                freeBrowse
                  ? 'border-amber-500/45 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-terminal-border bg-terminal-surface text-terminal-text hover:border-brand/45'
              }`}
            >
              {freeBrowse ? (
                <>
                  <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {t('Free Browse (All Unlocked)', 'Free Browse (Bukas Lahat)')}
                  </span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 text-brand-text" aria-hidden="true" />
                  <span>
                    {t('Guided Progression', 'Guided Progression')}
                  </span>
                </>
              )}
            </button>

            <div className="relative flex-1 sm:w-64">
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
                className="w-full rounded-md border border-terminal-border bg-terminal-bg py-2 pl-9 pr-8 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear lesson search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Band 2: 5-Pillar Horizontal Unboxed Index */}
      <section aria-labelledby="five-pillar-heading" className="space-y-3">
        <h2 id="five-pillar-heading" className="sr-only">
          {t('5-Pillar Master Trading Academy', '5-Pillar Master Trading Academy')}
        </h2>

        <div className="grid grid-cols-2 divide-y divide-terminal-border border-b border-terminal-border md:grid-cols-5 md:divide-x md:divide-y-0">
          {ACADEMY_PILLARS.map((pillar, idx) => {
            const isSyllabusPillar =
              pillar.id === 'foundations' ||
              pillar.id === 'specializations' ||
              pillar.id === 'advanced';
            const spanClass = idx === ACADEMY_PILLARS.length - 1 ? 'col-span-2 md:col-span-1' : '';
            const paddingClass =
              idx === 0
                ? 'pb-5 pr-4 md:pr-5'
                : idx === ACADEMY_PILLARS.length - 1
                  ? 'pt-4 pb-5 md:pt-0 md:pl-5'
                  : 'py-4 md:py-0 md:pb-5 md:px-5 even:pl-4 odd:pr-4 md:even:pl-5 md:odd:pr-5';

            if (isSyllabusPillar) {
              return (
                <div
                  key={pillar.id}
                  className={`flex flex-col justify-between gap-3 ${spanClass} ${paddingClass}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] tabular-nums">
                      <span className="font-semibold text-brand-text">{pillar.step}</span>
                      <span className="text-terminal-muted">{pillar.levelRange}</span>
                    </div>
                    <p className="text-xs font-semibold leading-snug text-terminal-text sm:text-[13px]">
                      {t(pillar.titleEn, pillar.titleTaglish)}
                    </p>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-terminal-muted">
                      {t(pillar.subtitleEn, pillar.subtitleTaglish)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePillarJump(pillar.id)}
                    className="inline-flex w-fit items-center gap-1 text-[11px] font-semibold text-brand-text underline-offset-4 hover:underline"
                  >
                    <span>{t('Explore Syllabus', 'Tingnan ang Syllabus')}</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              );
            }

            if (pillar.id === 'practical_lab') {
              return (
                <div
                  key={pillar.id}
                  className={`flex flex-col justify-between gap-3 ${spanClass} ${paddingClass}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] tabular-nums">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {pillar.step}
                      </span>
                      <FlaskConical className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-semibold leading-snug text-terminal-text sm:text-[13px]">
                      {t(pillar.titleEn, pillar.titleTaglish)}
                    </p>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-terminal-muted">
                      {t(pillar.subtitleEn, pillar.subtitleTaglish)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold">
                    <Link
                      to="/paper-trading"
                      className="text-brand-text underline-offset-4 hover:underline"
                    >
                      {t('Paper Lab', 'Paper Lab')}
                    </Link>
                    <Link
                      to="/backtest"
                      className="text-terminal-muted underline-offset-4 hover:text-terminal-text hover:underline"
                    >
                      {t('Backtester', 'Backtester')}
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={pillar.id}
                className={`flex flex-col justify-between gap-3 ${spanClass} ${paddingClass}`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px] tabular-nums">
                    <span className="font-semibold text-bull">{pillar.step}</span>
                    <Award className="h-3.5 w-3.5 text-bull" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-semibold leading-snug text-terminal-text sm:text-[13px]">
                    {t(pillar.titleEn, pillar.titleTaglish)}
                  </p>
                  <p className="line-clamp-2 text-[11px] leading-relaxed text-terminal-muted">
                    {t(pillar.subtitleEn, pillar.subtitleTaglish)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold">
                  <Link
                    to="/evaluation"
                    className="text-bull underline-offset-4 hover:underline"
                  >
                    {t('Assessments', 'Pagsusulit')}
                  </Link>
                  <Link
                    to="/glossary"
                    className="text-terminal-muted underline-offset-4 hover:text-terminal-text hover:underline"
                  >
                    {t('Glossary', 'Glossary')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Band 3: Split Master Syllabus Workspace (University Course Syllabus) */}
      <section
        id="master-syllabus-explorer"
        aria-labelledby="master-syllabus-heading"
        className="space-y-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="space-y-1">
            <h2
              id="master-syllabus-heading"
              className="text-lg font-semibold tracking-tight text-terminal-text sm:text-xl"
            >
              {t('Master Syllabus Explorer', 'Master Syllabus Explorer')}
            </h2>
            <p className="text-xs text-terminal-muted">{activePathMeta.subtitle}</p>
          </div>
          <span className="font-mono text-xs text-terminal-muted tabular-nums">
            {masterySummary.byPath[activePath]?.completed ?? 0}/
            {masterySummary.byPath[activePath]?.total ?? 0}{' '}
            {t('completed in track', 'tapos sa track')}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-2 lg:grid-cols-[240px_1fr]">
          {/* Left Sticky Path & Mastery Index */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <div
              role="tablist"
              aria-label="Select Master Syllabus curriculum path"
              className="no-scrollbar flex flex-nowrap gap-4 overflow-x-auto border-b border-terminal-border lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-l lg:border-terminal-border"
            >
              {SYLLABUS_PATH_TABS.map((tab) => {
                const isSelected = activePath === tab.id;
                const pathStats = masterySummary.byPath[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectSyllabusPath(tab.id)}
                    className={`-mb-px flex shrink-0 items-center justify-between gap-3 border-b-2 pb-2.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:mb-0 lg:-ml-px lg:w-full lg:border-b-0 lg:border-l-2 lg:py-2 lg:pl-3.5 lg:pr-2 ${
                      isSelected
                        ? 'border-brand font-semibold text-terminal-text lg:bg-brand-soft/35'
                        : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
                    }`}
                  >
                    <span className="whitespace-nowrap lg:truncate">
                      {t(tab.labelEn, tab.labelTaglish)}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums opacity-75">
                      {pathStats?.total ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Compact 5-Level Mastery Completion Bars */}
            <div className="space-y-3 border-t border-terminal-border pt-4">
              <p className="text-xs font-semibold text-terminal-text">
                {t('5-Level Mastery', '5-Level Mastery')}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-5 lg:grid-cols-1 lg:gap-y-2.5">
                {MASTERY_LEVELS.map((lvl) => {
                  const stats = masterySummary.byLevel[lvl.level];
                  const isCurrent = masterySummary.currentLevel === lvl.level;
                  return (
                    <div key={lvl.level} className="space-y-1">
                      <div className="flex items-baseline justify-between gap-2 text-[11px]">
                        <span
                          className={`truncate ${
                            isCurrent
                              ? 'font-semibold text-terminal-text'
                              : 'text-terminal-muted'
                          }`}
                        >
                          <span className="font-mono text-[10px] text-brand-text">
                            L{lvl.level}
                          </span>{' '}
                          {t(lvl.labelEn, lvl.labelTaglish)}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-terminal-muted tabular-nums">
                          {stats.passedAssessment ? (
                            <span className="font-semibold text-bull">Cert</span>
                          ) : (
                            `${stats.percent}%`
                          )}
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-terminal-elevated">
                        <div
                          className={`tl-progress-bar h-full rounded-full ${
                            stats.passedAssessment ? 'bg-bull' : 'bg-brand'
                          }`}
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Unboxed Module & Topic Ledger */}
          <div
            role="tabpanel"
            aria-label={activePathMeta.title}
            className="divide-y divide-terminal-border border-y border-terminal-border"
          >
            {activePathModules.map((mod) => {
              const topics = getTopicsForModule(mod.id);
              const isExpanded = expandedModuleIds.has(mod.id);
              const doneInModule = topics.filter(
                (topic) => topicProgressMap[topic.code]?.completed,
              ).length;

              return (
                <div key={mod.id}>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => handleToggleModuleAccordion(mod.id)}
                    className="tl-row-interactive flex w-full items-center justify-between gap-3 py-3.5 text-left transition-colors hover:bg-terminal-surface/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:px-2"
                  >
                    <div className="flex min-w-0 items-baseline gap-3">
                      <span className="shrink-0 font-mono text-xs font-semibold text-brand-text tabular-nums">
                        {mod.code}
                      </span>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-semibold text-terminal-text">
                            {mod.title}
                          </span>
                          <span className="font-mono text-[10px] text-terminal-muted">
                            L{mod.level}
                          </span>
                          {mod.optional && (
                            <span className="font-mono text-[10px] font-medium text-amber-600 dark:text-amber-400">
                              · {t('Optional', 'Opsyonal')}
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-1 text-xs text-terminal-muted">
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`font-mono text-xs tabular-nums ${
                          doneInModule === topics.length && topics.length > 0
                            ? 'font-semibold text-bull'
                            : 'text-terminal-muted'
                        }`}
                      >
                        {doneInModule}/{topics.length}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-terminal-muted transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="pb-4 pl-2 sm:pl-9">
                      {mod.disclaimer && (
                        <div className="mb-3 flex items-start gap-2 border-l-2 border-amber-500/70 pl-3 py-1 text-xs leading-relaxed text-terminal-muted">
                          <ShieldAlert
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500"
                            aria-hidden="true"
                          />
                          <span>{mod.disclaimer}</span>
                        </div>
                      )}

                      <ul className="divide-y divide-terminal-border/70 border-t border-terminal-border/70">
                        {topics.map((topic) => {
                          const isDone = Boolean(topicProgressMap[topic.code]?.completed);
                          const unlockInfo = isTopicUnlocked(
                            topic,
                            topicProgressMap,
                            freeBrowse,
                          );
                          const isLocked = !unlockInfo.unlocked;

                          return (
                            <li key={topic.id}>
                              <Link
                                to={`/academy/topic/${topic.slug}`}
                                className="tl-row-interactive group flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-terminal-surface/60 sm:px-2 sm:-mx-2 sm:rounded-md"
                              >
                                <div className="flex min-w-0 items-center gap-2.5">
                                  {isDone ? (
                                    <CheckCircle2
                                      className="h-3.5 w-3.5 shrink-0 text-bull"
                                      aria-label="Completed"
                                    />
                                  ) : isLocked ? (
                                    <Lock
                                      className="h-3.5 w-3.5 shrink-0 text-amber-500"
                                      aria-label="Prerequisite recommended"
                                    />
                                  ) : (
                                    <Circle
                                      className="h-3.5 w-3.5 shrink-0 text-terminal-muted/70"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <span className="w-10 shrink-0 font-mono text-xs font-semibold text-brand-text tabular-nums">
                                    {topic.code}
                                  </span>
                                  <span className="truncate text-xs font-medium text-terminal-text transition-colors group-hover:text-brand-text sm:text-[13px]">
                                    {topic.title}
                                  </span>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                  {topic.linkedDeepLessonSlug && (
                                    <span
                                      title={t(
                                        'Includes Deep Video & Chart Lab',
                                        'May Deep Video at Chart Lab',
                                      )}
                                      className="inline-flex items-center gap-1 font-mono text-[10px] text-sky-600 dark:text-sky-400"
                                    >
                                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                                      <span className="hidden sm:inline">Lab</span>
                                    </span>
                                  )}
                                  <span className="font-mono text-[10px] text-terminal-muted tabular-nums">
                                    L{topic.level}
                                  </span>
                                  <ArrowRight
                                    className="h-3.5 w-3.5 text-terminal-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-text"
                                    aria-hidden="true"
                                  />
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Band 4: Deep Visual Lessons Section (27 Interactive Video & Chart Labs) */}
      <section
        aria-label={t('Deep Visual Lessons', 'Deep Visual Lessons')}
        className="space-y-6 border-t border-terminal-border pt-10"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-terminal-text sm:text-xl">
              {t('Deep Visual Lessons', 'Deep Visual Lessons')}
            </h2>
            <p className="font-mono text-xs text-terminal-muted tabular-nums">
              {marketCounts.general} {t('Universal', 'Universal')} +{' '}
              {CURRICULUM_LESSONS.length - marketCounts.general}{' '}
              {t('Market Tracks', 'Market Tracks')} ·{' '}
              {t(
                'Interactive SVG blueprints, curated YouTube timestamps & OHLC replays',
                'Interactive SVG blueprints, curated YouTube timestamps at OHLC replays',
              )}
            </p>
          </div>
        </div>

        {/* Underline Market Filter Bar + Quiet Level Controls */}
        <div className="flex flex-col gap-3 border-b border-terminal-border md:flex-row md:items-end md:justify-between">
          <div
            role="group"
            aria-label="Filter lessons by market track"
            className="no-scrollbar -mb-px flex flex-nowrap items-center gap-5 overflow-x-auto"
          >
            {CATALOG_FILTER_TABS.map((tab) => {
              const isActive = marketFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectMarket(tab.id)}
                  aria-pressed={isActive}
                  className={`inline-flex shrink-0 items-baseline gap-1.5 border-b-2 pb-2.5 text-xs transition-colors sm:text-[13px] ${
                    isActive
                      ? 'border-brand font-semibold text-terminal-text'
                      : 'border-transparent font-medium text-terminal-muted hover:border-terminal-border hover:text-terminal-text'
                  }`}
                >
                  <span>{t(tab.en, tab.taglish)}</span>
                  <span className="font-mono text-[11px] tabular-nums opacity-75">
                    ({marketCounts[tab.id]})
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="group"
            aria-label="Filter lessons by difficulty level"
            className="no-scrollbar flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto pb-2"
          >
            {LEVEL_FILTERS.map((level) => {
              const isActive = levelFilter === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setLevelFilter(level.id)}
                  aria-pressed={isActive}
                  className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-soft font-semibold text-brand-text'
                      : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                  }`}
                >
                  {t(level.en, level.taglish)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Status Strip */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-terminal-muted">
            <span className="font-mono tabular-nums">
              {t('Showing', 'Ipinapakita')}{' '}
              <strong className="text-terminal-text">{filteredLessons.length}</strong> /{' '}
              {CURRICULUM_LESSONS.length} {t('lessons', 'aralin')}
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="tl-press inline-flex items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-surface px-3 py-1 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45 hover:text-brand-text"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              {t('Reset filters', 'I-reset')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!showUniversalSection && !showMarketTracksSection ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Layers className="h-7 w-7 text-terminal-muted" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-terminal-text">
              {t('No lessons match those filters', 'Walang lesson na tugma sa filter')}
            </p>
            <p className="mt-1 text-xs text-terminal-muted">
              {t(
                'Try switching markets or clearing your search.',
                'Subukang magpalit ng market o burahin ang search.',
              )}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="tl-press mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              {t(
                `Show All ${CURRICULUM_LESSONS.length} Lessons`,
                `Ipakita Lahat (${CURRICULUM_LESSONS.length})`,
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* SECTION 1: UNIVERSAL CORE TRACK (ALL MARKETS) */}
            {showUniversalSection && (
              <section aria-labelledby="universal-core-section-heading" className="space-y-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h2
                        id="universal-core-section-heading"
                        className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg"
                      >
                        {t(
                          UI_COPY.academyTracks.universalCoreTitle.en,
                          UI_COPY.academyTracks.universalCoreTitle.taglish,
                        )}
                      </h2>
                      <span className="font-mono text-xs font-medium text-brand-text tabular-nums">
                        {universalCoreLessons.length} {t('Lessons', 'Aralin')}
                      </span>
                    </div>
                    <p className="max-w-[65ch] text-xs text-terminal-muted">
                      {t(
                        UI_COPY.academyTracks.universalCoreSubtitle.en,
                        UI_COPY.academyTracks.universalCoreSubtitle.taglish,
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  {universalCoreStages.map(({ stage, lessons }, idx) => {
                    const stageDoneCount = lessons.filter((lesson) =>
                      completedSlugs.has(lesson.slug),
                    ).length;
                    const stageTaglish = STAGE_TAGLISH_COPY[stage.id];
                    const displayStepNumber = idx + 1;

                    return (
                      <div key={stage.id} className="space-y-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div className="min-w-0 space-y-0.5">
                            <p className="text-xs font-semibold text-terminal-text sm:text-sm">
                              <span className="mr-2 font-mono text-xs text-brand-text tabular-nums">
                                0{displayStepNumber}
                              </span>
                              {t(`Part ${displayStepNumber}:`, `Bahagi ${displayStepNumber}:`)}{' '}
                              {t(stage.label, stageTaglish.label)}
                            </p>
                            <p className="line-clamp-1 text-xs text-terminal-muted">
                              {t(expandAcronyms(stage.tagline), stageTaglish.tagline)}
                            </p>
                          </div>

                          <span
                            className={`font-mono text-[11px] tabular-nums ${
                              stageDoneCount === lessons.length && lessons.length > 0
                                ? 'font-semibold text-bull'
                                : 'text-terminal-muted'
                            }`}
                          >
                            {stageDoneCount}/{lessons.length} {t('done', 'tapos')}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-x-8 border-t border-terminal-border sm:grid-cols-2 lg:grid-cols-3">
                          {lessons.map((lesson) => renderLessonItem(lesson))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECTION 2: DEDICATED MARKET TRACKS (SEPARATE LISTS PER MARKET) */}
            {showMarketTracksSection && (
              <section
                aria-labelledby="market-tracks-section-heading"
                className="space-y-6 border-t border-terminal-border pt-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h2
                        id="market-tracks-section-heading"
                        className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg"
                      >
                        {activeSpecificTrackGroup
                          ? t(
                              activeSpecificTrackGroup.track.titleEn,
                              activeSpecificTrackGroup.track.titleTaglish,
                            )
                          : t(
                              UI_COPY.academyTracks.marketTracksTitle.en,
                              UI_COPY.academyTracks.marketTracksTitle.taglish,
                            )}
                      </h2>
                      <span className="font-mono text-xs text-terminal-muted tabular-nums">
                        {activeSpecificTrackGroup
                          ? `${activeSpecificTrackGroup.lessons.length} ${t('Lessons', 'Aralin')}`
                          : t('4 Markets · 3 Lessons Each', '4 Markets · 3 Aralin Bawat Isa')}
                      </span>
                    </div>
                    <p className="max-w-[65ch] text-xs text-terminal-muted">
                      {activeSpecificTrackGroup
                        ? localizeMarketTimes(
                            t(
                              activeSpecificTrackGroup.track.taglineEn,
                              activeSpecificTrackGroup.track.taglineTaglish,
                            ),
                          )
                        : t(
                            UI_COPY.academyTracks.marketTracksSubtitle.en,
                            UI_COPY.academyTracks.marketTracksSubtitle.taglish,
                          )}
                    </p>
                  </div>

                  {activeSpecificTrackGroup && (
                    <button
                      type="button"
                      onClick={() => handleSelectMarket('all')}
                      className="tl-press inline-flex shrink-0 items-center gap-1 rounded-md border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45 hover:text-brand-text"
                    >
                      {t('View All 4 Market Tracks', 'Tingnan Lahat ng 4 Markets')}
                    </button>
                  )}
                </div>

                {activeSpecificTrackGroup ? (
                  <div className="grid grid-cols-1 gap-x-8 border-t border-terminal-border sm:grid-cols-2 lg:grid-cols-3">
                    {activeSpecificTrackGroup.lessons.map((lesson, idx) =>
                      renderLessonItem(lesson, idx),
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                    {marketTrackGroups.map(({ track, lessons }) => {
                      const TrackIcon = track.icon;
                      const doneCount = lessons.filter((lesson) =>
                        completedSlugs.has(lesson.slug),
                      ).length;

                      return (
                        <div key={track.id} className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <TrackIcon
                                  className="h-4 w-4 shrink-0 text-brand-text"
                                  aria-hidden="true"
                                />
                                <h3 className="text-sm font-semibold tracking-tight text-terminal-text sm:text-[15px]">
                                  {t(track.titleEn, track.titleTaglish)}
                                </h3>
                                <span
                                  className={`font-mono text-[11px] tabular-nums ${
                                    doneCount === lessons.length && lessons.length > 0
                                      ? 'font-semibold text-bull'
                                      : 'text-terminal-muted'
                                  }`}
                                >
                                  {doneCount}/{lessons.length} {t('done', 'tapos')}
                                </span>
                              </div>
                              <p className="line-clamp-1 text-xs text-terminal-muted">
                                {localizeMarketTimes(t(track.taglineEn, track.taglineTaglish))}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSelectMarket(track.id)}
                              className="shrink-0 text-xs font-medium text-brand-text underline-offset-4 hover:underline"
                            >
                              {t('Focus', 'Buksan')}
                            </button>
                          </div>

                          <ol className="divide-y divide-terminal-border border-y border-terminal-border">
                            {lessons.map((lesson, lessonIdx) => {
                              const isCompleted = completedSlugs.has(lesson.slug);
                              const summaryText = isTaglish
                                ? (LESSON_TAGLISH_SUMMARIES[lesson.slug]?.plainSummary ??
                                  expandAcronyms(lesson.plainEnglishSummary ?? ''))
                                : expandAcronyms(lesson.plainEnglishSummary ?? '');

                              return (
                                <li key={lesson.id}>
                                  <Link
                                    to={`/academy/${lesson.slug}`}
                                    className="tl-row-interactive group flex items-start justify-between gap-3 py-3 transition-colors hover:bg-terminal-surface/50 sm:px-2 sm:-mx-2 sm:rounded-md"
                                  >
                                    <div className="flex min-w-0 items-start gap-2.5">
                                      {isCompleted ? (
                                        <CheckCircle2
                                          className="mt-0.5 h-4 w-4 shrink-0 text-bull"
                                          aria-label="Lesson completed"
                                        />
                                      ) : (
                                        <span className="mt-0.5 w-5 shrink-0 font-mono text-xs font-semibold text-brand-text tabular-nums">
                                          0{lessonIdx + 1}
                                        </span>
                                      )}

                                      <div className="min-w-0 space-y-0.5">
                                        <p className="line-clamp-1 text-xs font-semibold text-terminal-text transition-colors group-hover:text-brand-text sm:text-[13px]">
                                          {lesson.title}
                                        </p>
                                        {summaryText && (
                                          <p className="line-clamp-1 text-[11px] text-terminal-muted">
                                            {summaryText}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 pt-0.5">
                                      <span className="hidden font-mono text-[10px] text-terminal-muted sm:inline">
                                        {t(
                                          LEVEL_LABELS[lesson.level].en,
                                          LEVEL_LABELS[lesson.level].taglish,
                                        )}
                                      </span>
                                      <ArrowRight
                                        className="h-3.5 w-3.5 text-terminal-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-text"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
