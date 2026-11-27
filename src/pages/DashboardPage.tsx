import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  CandlestickChart,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  GraduationCap,
  HelpCircle,
  LineChart,
  NotebookPen,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react';
import { MarketHoursPhCard } from '../components/dashboard/MarketHoursPhCard';
import { OnboardingModal } from '../components/learning/OnboardingModal';
import { DifficultConceptsPanel } from '../components/library/DifficultConceptsPanel';
import { DailyQuoteCard } from '../components/quotes/DailyQuoteCard';
import { useLanguage } from '../context/LanguageContext';
import { MASTERY_LEVELS } from '../data/academyRoadmap';
import { CHART_SCENARIOS } from '../data/chartScenarios';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
} from '../data/curriculum';
import { LESSON_TAGLISH_SUMMARIES, UI_COPY } from '../data/taglishTranslations';
import { expandAcronyms } from '../lib/acronymHelper';
import {
  computeMasterySummary,
  listLevelAssessments,
  listTopicProgress,
} from '../services/academyProgressService';
import {
  computeStudyProgressSummary,
  getOnboardingPreferences,
  getRecommendedNextLesson,
  listLessonProgress,
} from '../services/progressService';
import type { LessonMarketCategory } from '../types/academy';
import type { LevelAssessmentResult, TopicProgressRecord } from '../types/curriculum-tree';
import type { LessonProgressRecord, OnboardingPreferences } from '../types/learning-loop';

export interface DashboardPageProps {
  onOpenVault: () => void;
  onOpenTour?: () => void;
}

type MarketFilter = 'all' | LessonMarketCategory;

const DEFAULT_PREFERENCES: OnboardingPreferences = {
  experienceLevel: 'beginner',
  preferredMarket: 'all',
  onboardingCompleted: true,
  updatedAt: '',
};

const MARKET_BADGE_STYLES: Record<LessonMarketCategory, string> = {
  general: 'border-brand/35 bg-brand-soft text-brand-text',
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

function formatModuleOrder(order: number): string {
  return String(order).padStart(2, '0');
}

export function DashboardPage({ onOpenVault, onOpenTour }: DashboardPageProps) {
  const { isTaglish, t } = useLanguage();
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');
  const [progressRecords, setProgressRecords] = useState<LessonProgressRecord[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgressRecord[]>([]);
  const [levelAssessments, setLevelAssessments] = useState<LevelAssessmentResult[]>([]);
  const [preferences, setPreferences] = useState<OnboardingPreferences>(DEFAULT_PREFERENCES);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const autoPromptHandledRef = useRef<boolean>(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      listLessonProgress(),
      getOnboardingPreferences(),
      listTopicProgress().catch(() => []),
      listLevelAssessments().catch(() => []),
    ]).then(([records, prefs, topics, assessments]) => {
      if (!active) {
        return;
      }
      setProgressRecords(records);
      setPreferences(prefs);
      setTopicProgress(topics);
      setLevelAssessments(assessments);
      if (prefs.preferredMarket !== 'all') {
        setMarketFilter(prefs.preferredMarket);
      }
      if (!prefs.onboardingCompleted && !autoPromptHandledRef.current) {
        autoPromptHandledRef.current = true;
        setOnboardingOpen(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const progressSummary = useMemo(
    () => computeStudyProgressSummary(progressRecords, CURRICULUM_LESSONS.length),
    [progressRecords],
  );

  const masterySummary = useMemo(
    () => computeMasterySummary(topicProgress, levelAssessments),
    [topicProgress, levelAssessments],
  );

  const currentMasteryMeta = useMemo(
    () =>
      MASTERY_LEVELS.find((item) => item.level === masterySummary.currentLevel) ??
      MASTERY_LEVELS[0],
    [masterySummary.currentLevel],
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
    <div className="mx-auto max-w-6xl space-y-4">
      {/* Crisp TradingView Supercharts Desk Hero */}
      <section className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-2">
            <span className="inline-flex items-center rounded-md border border-brand/35 bg-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-text">
              {t(UI_COPY.dashboard.heroEyebrow.en, UI_COPY.dashboard.heroEyebrow.taglish)}
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-terminal-text sm:text-xl">
              {t(UI_COPY.dashboard.heroTitle.en, UI_COPY.dashboard.heroTitle.taglish)}
            </h1>
            <p className="text-xs text-terminal-muted">
              {t(UI_COPY.dashboard.heroSubtitle.en, UI_COPY.dashboard.heroSubtitle.taglish)}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                to={`/academy/${recommendedLesson.slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-brand-fg shadow-sm transition-all hover:opacity-95 active:scale-[0.98]"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {t(UI_COPY.dashboard.continueLesson.en, UI_COPY.dashboard.continueLesson.taglish)}{' '}
                  {formatModuleOrder(recommendedLesson.moduleOrder)}
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>

              <Link
                to="/paper-trading"
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand/35 bg-brand-soft px-3.5 py-2 text-xs font-semibold text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
              >
                <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {t(UI_COPY.dashboard.openPaperTrading.en, UI_COPY.dashboard.openPaperTrading.taglish)}
                </span>
              </Link>

              {onOpenTour && (
                <button
                  type="button"
                  onClick={onOpenTour}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/35 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
                >
                  <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {t('How to Use App (1-Min Tour)', 'Paano Gamitin ang App (1-Min Tour)')}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-3 gap-2 lg:w-60">
            <div className="rounded-lg border border-terminal-border bg-terminal-bg p-2.5 text-center">
              <p className="font-mono text-lg font-semibold text-brand-text tabular-nums">
                {CURRICULUM_LESSONS.length}
              </p>
              <p className="text-[10px] font-medium text-terminal-muted">
                {t('Lessons', 'Aralin')}
              </p>
            </div>
            <div className="rounded-lg border border-terminal-border bg-terminal-bg p-2.5 text-center">
              <p className="font-mono text-lg font-semibold text-sky-500 dark:text-sky-400 tabular-nums">
                {CHART_SCENARIOS.length}
              </p>
              <p className="text-[10px] font-medium text-terminal-muted">
                {t('Replays', 'Charts')}
              </p>
            </div>
            <div className="rounded-lg border border-terminal-border bg-terminal-bg p-2.5 text-center">
              <p className="font-mono text-lg font-semibold text-bull tabular-nums">
                $0
              </p>
              <p className="text-[10px] font-medium text-terminal-muted">
                {t('Real Risk', 'Totoong Risk')}
              </p>
            </div>
          </div>
        </div>

        {/* Compact Progress & Streak Strip */}
        <div className="mt-4 flex flex-col gap-2.5 rounded-lg border border-terminal-border bg-terminal-bg px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-terminal-text tabular-nums">
                {progressSummary.completedCount} / {progressSummary.totalLessons}{' '}
                {t('Lessons', 'Aralin')}
              </span>
              <span className="font-mono text-[11px] font-semibold text-brand-text tabular-nums">
                {progressSummary.percentComplete}%
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                <Flame className="h-3 w-3" aria-hidden="true" />
                {progressSummary.currentStreakDays}-{t('day streak', 'araw sunod')}
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Academy study progress"
              aria-valuenow={progressSummary.percentComplete}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1.5 w-full overflow-hidden rounded-full bg-terminal-elevated"
            >
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${progressSummary.percentComplete}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOnboardingOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-1.5 text-[11px] font-medium text-terminal-muted transition-colors hover:border-brand/45 hover:bg-terminal-elevated hover:text-terminal-text"
          >
            <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
            {t('Customize Path', 'Ayusin ang Path')}
          </button>
        </div>
      </section>

      {/* Master Academy Progress & Tools Strip */}
      <section
        aria-label={t('Master Academy Progress and Tools', 'Progreso at Tools ng Master Academy')}
        className="flex flex-col gap-3 rounded-xl border border-terminal-border bg-terminal-surface px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/35 bg-brand-soft font-mono text-xs font-bold text-brand-text">
            {currentMasteryMeta.badge}
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-terminal-text">
                {t(
                  `Level ${masterySummary.currentLevel} • ${currentMasteryMeta.labelEn}`,
                  `Level ${masterySummary.currentLevel} • ${currentMasteryMeta.labelTaglish}`,
                )}
              </span>
              <span className="font-mono text-[11px] font-semibold text-brand-text tabular-nums">
                {masterySummary.completedTopics} / {masterySummary.totalTopics}{' '}
                {t('Syllabus Topics', 'Syllabus Topics')} ({masterySummary.overallPercent}%)
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Master Academy syllabus completion"
              aria-valuenow={masterySummary.overallPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-terminal-elevated"
            >
              <div
                className="h-full rounded-full bg-bull transition-all duration-300"
                style={{ width: `${masterySummary.overallPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            to="/academy"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand/35 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
          >
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('Master Roadmap', 'Master Roadmap')}</span>
          </Link>
          <Link
            to="/glossary"
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/35 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
          >
            <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('Glossary & Flashcards', 'Glossary at Flashcards')}</span>
          </Link>
          <Link
            to="/evaluation"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
          >
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('Level Evaluation', 'Level Evaluation')}</span>
          </Link>
        </div>
      </section>

      {/* Friendly Beginner Callout (shown when 0 lessons done) */}
      {progressSummary.completedCount === 0 && (
        <section
          aria-labelledby="beginner-start-heading"
          className="rounded-xl border border-brand/35 bg-brand-soft/45 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand-soft text-brand-text">
                <CandlestickChart className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="space-y-0.5">
                <h2
                  id="beginner-start-heading"
                  className="text-sm font-semibold tracking-tight text-terminal-text"
                >
                  {t(
                    'Brand New to Trading? Start Lesson 01',
                    'Baguhan sa Trading? Simulan sa Lesson 01',
                  )}
                </h2>
                <p className="text-xs text-terminal-muted">
                  {t(
                    'Lesson 01: Chart Reading Fundamentals — 5m, 15m, 1H, 1D timeframes, price axes, volume & chart tools before reading candles.',
                    'Lesson 01: Chart Reading Fundamentals — 5m, 15m, 1H, 1D timeframes, presyo, volume at chart tools bago magbasa ng candlesticks.',
                  )}
                </p>
              </div>
            </div>

            <Link
              to="/academy/chart-reading-fundamentals"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-brand-fg shadow-sm transition-all hover:opacity-95 active:scale-[0.98]"
            >
              <span>{t('Start Lesson 01', 'Simulan Lesson 01')}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* Live Market Hours in Philippine Time (Auto US DST) */}
      <MarketHoursPhCard />

      {/* Compact 4-Tile Quick Launchers (Featuring Paper Trading Demo Wallets) */}
      <section aria-label="Quick workspace launchers" className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Link
          to="/paper-trading"
          className="group flex items-center gap-2.5 rounded-xl border border-brand/35 bg-terminal-surface p-3 transition-all hover:-translate-y-0.5 hover:border-brand"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-text">
            <Wallet className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-terminal-text">
              {t('Paper Trading', 'Paper Trading')}
            </p>
            <p className="truncate text-[11px] text-terminal-muted">
              {t('Demo wallets & live prices', 'Demo wallets, walang risk')}
            </p>
          </div>
        </Link>

        <Link
          to="/academy"
          className="group flex items-center gap-2.5 rounded-xl border border-terminal-border bg-terminal-surface p-3 transition-all hover:-translate-y-0.5 hover:border-brand/45"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bull/15 text-bull">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-terminal-text">
              {t('Academy', 'Academy')}
            </p>
            <p className="truncate text-[11px] text-terminal-muted">
              {t(
                `${CURRICULUM_LESSONS.length} bite-sized lessons`,
                `${CURRICULUM_LESSONS.length} maiikling aralin`,
              )}
            </p>
          </div>
        </Link>

        <Link
          to="/backtest"
          className="group flex items-center gap-2.5 rounded-xl border border-terminal-border bg-terminal-surface p-3 transition-all hover:-translate-y-0.5 hover:border-sky-500/45"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400">
            <LineChart className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-terminal-text">
              {t('Backtester', 'Backtester')}
            </p>
            <p className="truncate text-[11px] text-terminal-muted">
              {t('Replay past charts', 'Mag-practice sa replay')}
            </p>
          </div>
        </Link>

        <Link
          to="/journal"
          className="group flex items-center gap-2.5 rounded-xl border border-terminal-border bg-terminal-surface p-3 transition-all hover:-translate-y-0.5 hover:border-amber-500/45"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <NotebookPen className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-terminal-text">
              {t('Trade Journal', 'Trade Journal')}
            </p>
            <p className="truncate text-[11px] text-terminal-muted">
              {t('Track wins & habits', 'I-log ang trades mo')}
            </p>
          </div>
        </Link>
      </section>

      {/* Featured Paper Trading Demo Desk Card */}
      <section className="flex flex-col gap-3 rounded-xl border border-terminal-border bg-terminal-surface px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-text">
            <Wallet className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-0.5">
            <h2 className="text-xs font-semibold text-terminal-text sm:text-sm">
              {t(UI_COPY.dashboard.paperCardTitle.en, UI_COPY.dashboard.paperCardTitle.taglish)}
            </h2>
            <p className="text-[11px] text-terminal-muted sm:text-xs">
              {t(UI_COPY.dashboard.paperCardSubtitle.en, UI_COPY.dashboard.paperCardSubtitle.taglish)}
            </p>
          </div>
        </div>
        <Link
          to="/paper-trading"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand/40 bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
        >
          <span>{t('Launch Demo Desk', 'Buksan ang Demo')}</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </section>

      {/* Daily Trading Wisdom */}
      <DailyQuoteCard onOpenVault={onOpenVault} />

      {/* Curriculum Roadmap */}
      <section aria-labelledby="curriculum-roadmap-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
          <h2
            id="curriculum-roadmap-heading"
            className="text-sm font-semibold tracking-tight text-terminal-text sm:text-base"
          >
            {t('Study Roadmap', 'Mga Aralin')}
          </h2>

          <div className="flex flex-wrap items-center gap-1.5">
            <Link
              to="/academy"
              className="inline-flex items-center gap-1 rounded-lg border border-brand/35 bg-brand-soft px-3 py-1 text-[11px] font-semibold text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
            >
              {t(
                `All ${CURRICULUM_LESSONS.length} Lessons →`,
                `Lahat (${CURRICULUM_LESSONS.length} Aralin) →`,
              )}
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-1 text-[11px] font-medium text-terminal-text transition-colors hover:border-sky-500/45 hover:text-sky-600 dark:hover:text-sky-400"
            >
              <GraduationCap className="h-3 w-3 text-sky-500 dark:text-sky-400" aria-hidden="true" />
              {t('Quizzes', 'Quiz')}
            </Link>
          </div>
        </div>

        {/* Clean Market Filter Pills */}
        <div
          role="group"
          aria-label="Filter curriculum by market"
          className="no-scrollbar flex flex-nowrap items-center gap-1.5 overflow-x-auto px-0.5 pb-1"
        >
          <button
            type="button"
            onClick={() => setMarketFilter('all')}
            aria-pressed={marketFilter === 'all'}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1 text-xs transition-all ${
              marketFilter === 'all'
                ? MARKET_ACTIVE_PILL_STYLES.all
                : 'border-terminal-border bg-terminal-surface text-terminal-muted hover:border-brand/40 hover:bg-terminal-elevated hover:text-terminal-text'
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
                onClick={() => setMarketFilter(category.id)}
                aria-pressed={isActive}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1 text-xs transition-all ${
                  isActive
                    ? MARKET_ACTIVE_PILL_STYLES[category.id]
                    : 'border-terminal-border bg-terminal-surface text-terminal-muted hover:border-brand/40 hover:bg-terminal-elevated hover:text-terminal-text'
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

        {/* Compact Lesson Cards with Expanded Acronyms & 1-line Summary */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {filteredLessons.map((lesson) => {
            const isDone = completedSlugs.has(lesson.slug);
            const displayTitle = expandAcronyms(lesson.title);
            const shortSummary = isTaglish
              ? (LESSON_TAGLISH_SUMMARIES[lesson.slug]?.plainSummary ??
                expandAcronyms(lesson.plainEnglishSummary ?? ''))
              : expandAcronyms(lesson.plainEnglishSummary ?? '');

            return (
              <Link
                key={lesson.id}
                to={`/academy/${lesson.slug}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-terminal-border bg-terminal-surface px-3.5 py-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand/50"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  {isDone ? (
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-bull"
                      aria-label="Completed"
                    />
                  ) : (
                    <span className="mt-0.5 shrink-0 font-mono text-[11px] font-semibold text-terminal-muted tabular-nums">
                      {formatModuleOrder(lesson.moduleOrder)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-semibold text-terminal-text transition-colors group-hover:text-brand-text sm:text-[13px]">
                      {displayTitle}
                    </h3>
                    {shortSummary && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-terminal-muted">
                        {shortSummary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${MARKET_BADGE_STYLES[lesson.marketCategory]}`}
                  >
                    {marketLabelMap[lesson.marketCategory] ?? lesson.marketCategory}
                  </span>
                  <span className="hidden items-center gap-1 font-mono text-[10px] text-terminal-muted tabular-nums sm:inline-flex">
                    <Clock className="h-3 w-3 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                    {lesson.estimatedMinutes}m
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-terminal-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-text"
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
