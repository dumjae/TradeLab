import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { MarketHoursPhCard } from '../components/dashboard/MarketHoursPhCard';
import { OnboardingModal } from '../components/learning/OnboardingModal';
import { DifficultConceptsPanel } from '../components/library/DifficultConceptsPanel';
import { DailyQuoteCard } from '../components/quotes/DailyQuoteCard';
import { useLanguage } from '../context/LanguageContext';
import { MASTERY_LEVELS, getTopicsForPath } from '../data/academyRoadmap';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
} from '../data/curriculum';
import { LESSON_TAGLISH_SUMMARIES } from '../data/taglishTranslations';
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

const FILTER_TAB_LABELS: Record<MarketFilter, { en: string; taglish: string }> = {
  all: { en: 'All', taglish: 'Lahat' },
  general: { en: 'Core', taglish: 'Core' },
  crypto: { en: 'Crypto', taglish: 'Crypto' },
  forex: { en: 'Forex', taglish: 'Forex' },
  stocks: { en: 'Stocks', taglish: 'Stocks' },
  indices: { en: 'Indices', taglish: 'Indices' },
};

const FILTER_TAB_ORDER: MarketFilter[] = [
  'all',
  'general',
  'crypto',
  'forex',
  'stocks',
  'indices',
];

interface DirectoryToolItem {
  to: string;
  titleEn: string;
  titleTaglish: string;
  descEn: string;
  descTaglish: string;
}

const PRACTICAL_TOOLS: DirectoryToolItem[] = [
  {
    to: '/paper-trading',
    titleEn: 'Paper Trading Demo Desk',
    titleTaglish: 'Paper Trading Demo Desk',
    descEn: 'Practice live prices with virtual wallets, realistic fees, spreads, SL, and TP.',
    descTaglish: 'Mag-practice sa live prices gamit ang demo wallets na may realistic fee, spread, SL, at TP.',
  },
  {
    to: '/backtest',
    titleEn: 'Bar-by-Bar Backtester',
    titleTaglish: 'Bar-by-Bar Backtester',
    descEn: 'Step through historical charts candle by candle before committing real risk.',
    descTaglish: 'I-replay ang historical charts candle by candle bago mag-trade ng totoong kapital.',
  },
  {
    to: '/journal',
    titleEn: 'Trade Journal',
    titleTaglish: 'Trade Journal',
    descEn: 'Record setups, measure win rate and expectancy, and spot recurring habits.',
    descTaglish: 'I-log ang mga setup, sukatin ang win rate at expectancy, at bantayan ang discipline.',
  },
  {
    to: '/practice',
    titleEn: 'Practice Drills',
    titleTaglish: 'Practice Drills',
    descEn: 'Reinforce structure, liquidity, and risk math with focused scenario quizzes.',
    descTaglish: 'Hasain ang pagbasa ng structure, liquidity, at risk math sa maiikling quiz.',
  },
];

interface MarketTrackRow {
  id: 'master_foundations' | 'forex' | 'indices' | 'stocks' | 'crypto';
  to: string;
  titleEn: string;
  titleTaglish: string;
  descEn: string;
  descTaglish: string;
  topicCount: number;
}

const MARKET_TRACK_ROWS: MarketTrackRow[] = [
  {
    id: 'master_foundations',
    to: '/academy?market=general&pillar=foundations',
    titleEn: 'Universal Foundations',
    titleTaglish: 'Universal Foundations',
    descEn: 'Chart reading, market structure, liquidity mechanics, risk math, and discipline.',
    descTaglish: 'Pagbasa ng chart, market structure, liquidity, risk math, at tamang disiplina.',
    topicCount: getTopicsForPath('master_foundations').length,
  },
  {
    id: 'forex',
    to: '/academy?market=forex&pillar=specializations',
    titleEn: 'Forex',
    titleTaglish: 'Forex',
    descEn: 'Major currency pairs, pip and lot sizing, PH session windows, and rate drivers.',
    descTaglish: 'Currency pairs, tamang pip at lot size, PH trading sessions, at central bank news.',
    topicCount: getTopicsForPath('forex').length,
  },
  {
    id: 'indices',
    to: '/academy?market=indices&pillar=specializations',
    titleEn: 'Indices',
    titleTaglish: 'Indices',
    descEn: 'NAS100, SPX500, and US30 point math, futures vs. CFDs, and NY Open playbooks.',
    descTaglish: 'NAS100, SPX500, at US30 point math, futures vs. CFDs, at NY Open playbooks.',
    topicCount: getTopicsForPath('indices').length,
  },
  {
    id: 'stocks',
    to: '/academy?market=stocks&pillar=specializations',
    titleEn: 'Stocks',
    titleTaglish: 'Stocks',
    descEn: 'Market hours, volume confirmation, earnings gaps, valuation, and relative strength.',
    descTaglish: 'Oras ng merkado, volume confirmation, earnings gaps, at relative strength.',
    topicCount: getTopicsForPath('stocks').length,
  },
  {
    id: 'crypto',
    to: '/academy?market=crypto&pillar=specializations',
    titleEn: 'Crypto',
    titleTaglish: 'Crypto',
    descEn: 'Spot vs. perpetual futures, order books, funding rates, and 24/7 altcoin cycles.',
    descTaglish: 'Spot vs. perpetuals, order books, funding rates, at 24/7 na galaw ng altcoins.',
    topicCount: getTopicsForPath('crypto').length,
  },
];

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

  const shortCodeMap = useMemo(
    () =>
      Object.fromEntries(
        LESSON_MARKET_CATEGORIES.map((category) => [category.id, category.shortCode]),
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

  const isFreshBeginner = progressSummary.completedCount === 0;
  const heroHeading = isFreshBeginner
    ? t('Start with Chart Fundamentals', 'Magsimula sa Chart Fundamentals')
    : expandAcronyms(recommendedLesson.title);

  const heroDescription = isFreshBeginner
    ? t(
        'Read timeframes, price axes, and volume cleanly before risking a single cent in the simulator.',
        'Matutong magbasa ng timeframes, presyo, at volume bago mag-practice sa paper simulator.',
      )
    : isTaglish
      ? (LESSON_TAGLISH_SUMMARIES[recommendedLesson.slug]?.plainSummary ??
        expandAcronyms(recommendedLesson.plainEnglishSummary ?? recommendedLesson.subtitle))
      : expandAcronyms(recommendedLesson.plainEnglishSummary ?? recommendedLesson.subtitle);

  const handleOnboardingSaved = (savedPrefs: OnboardingPreferences) => {
    setPreferences(savedPrefs);
    setMarketFilter(savedPrefs.preferredMarket);
  };

  return (
    <div className="space-y-10">
      {/* Band 1: Asymmetric Editorial Study Focus (Unboxed on Canvas) */}
      <section
        aria-labelledby="dashboard-focus-heading"
        className="grid items-end gap-8 border-b border-terminal-border pb-8 lg:grid-cols-[1.35fr_0.65fr]"
      >
        <div className="space-y-4 tl-stagger">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-terminal-muted">
            {isFreshBeginner
              ? t('Study Desk · Lesson 01', 'Study Desk · Lesson 01')
              : t(
                  `Up Next · Lesson ${formatModuleOrder(recommendedLesson.moduleOrder)}`,
                  `Susunod · Lesson ${formatModuleOrder(recommendedLesson.moduleOrder)}`,
                )}
          </p>

          <h1
            id="dashboard-focus-heading"
            className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text text-balance sm:text-3xl lg:text-[2rem]"
          >
            {heroHeading}
          </h1>

          <p className="line-clamp-2 max-w-[58ch] text-sm leading-relaxed text-terminal-muted">
            {heroDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to={`/academy/${recommendedLesson.slug}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition-opacity hover:opacity-95 tl-press"
            >
              <span>
                {isFreshBeginner
                  ? t('Start Lesson 01', 'Simulan Lesson 01')
                  : t(
                      `Continue Lesson ${formatModuleOrder(recommendedLesson.moduleOrder)}`,
                      `Ituloy Lesson ${formatModuleOrder(recommendedLesson.moduleOrder)}`,
                    )}
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              to="/paper-trading"
              className="inline-flex items-center whitespace-nowrap rounded-md border border-terminal-border px-3.5 py-2.5 text-sm font-medium text-terminal-text transition-colors hover:bg-terminal-elevated tl-press"
            >
              {t('Open Paper Simulator', 'Buksan Paper Simulator')}
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-1">
              {onOpenTour && (
                <button
                  type="button"
                  onClick={onOpenTour}
                  className="text-xs font-medium text-terminal-muted underline-offset-4 transition-colors hover:text-terminal-text hover:underline"
                >
                  {t('1-Min App Tour', '1-Min App Tour')}
                </button>
              )}
              <button
                type="button"
                onClick={() => setOnboardingOpen(true)}
                className="text-xs font-medium text-terminal-muted underline-offset-4 transition-colors hover:text-terminal-text hover:underline"
              >
                {t('Personalize Track', 'Ayusin ang Track')}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Unboxed Tabular Mastery Status Readout */}
        <div
          style={{ '--stagger': 1 } as CSSProperties}
          className="space-y-3 lg:border-l lg:border-terminal-border lg:pl-8 tl-stagger"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-terminal-text">
              {t(
                `Level ${masterySummary.currentLevel} · ${currentMasteryMeta.labelEn}`,
                `Level ${masterySummary.currentLevel} · ${currentMasteryMeta.labelTaglish}`,
              )}
            </span>
            <span className="font-mono text-xs tabular-nums text-terminal-muted">
              {masterySummary.completedTopics} / {masterySummary.totalTopics}{' '}
              {t('topics', 'topics')}
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Master Academy syllabus completion"
            aria-valuenow={masterySummary.overallPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1 w-full overflow-hidden rounded-full bg-terminal-elevated"
          >
            <div
              className="tl-progress-bar h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${masterySummary.overallPercent}%` }}
            />
          </div>

          <p className="font-mono text-xs tabular-nums text-terminal-muted">
            {progressSummary.completedCount}/{progressSummary.totalLessons}{' '}
            {t('Deep Lessons', 'Deep Lessons')} · {progressSummary.currentStreakDays}d{' '}
            {t('Streak', 'Streak')}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs font-medium">
            <Link
              to="/academy"
              className="inline-flex items-center gap-1 text-brand-text underline-offset-4 hover:underline"
            >
              <span>{t('Master Roadmap', 'Master Roadmap')}</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
            <Link
              to="/glossary"
              className="text-terminal-muted underline-offset-4 transition-colors hover:text-terminal-text hover:underline"
            >
              {t('Glossary', 'Glossary')}
            </Link>
            <Link
              to="/evaluation"
              className="text-terminal-muted underline-offset-4 transition-colors hover:text-terminal-text hover:underline"
            >
              {t('Evaluation', 'Ebalwasyon')}
            </Link>
          </div>
        </div>
      </section>

      {/* Band 2: Live PH Market Sessions Strip */}
      <MarketHoursPhCard />

      {/* Band 3: Workspace & Market Tracks Directory (Unboxed Hairline Lists) */}
      <section
        aria-label={t('Trading workspace and market tracks', 'Workspace at mga market tracks')}
        className="grid gap-10 lg:grid-cols-2"
      >
        <div>
          <h2 className="text-base font-semibold tracking-tight text-terminal-text">
            {t('Practical Trading Tools', 'Mga Gamit sa Practice')}
          </h2>

          <div className="mt-3 divide-y divide-terminal-border border-t border-terminal-border">
            {PRACTICAL_TOOLS.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group tl-row-interactive flex items-center justify-between gap-4 py-3.5 transition-colors"
              >
                <div className="min-w-0">
                  <span className="block text-sm font-medium text-terminal-text transition-colors group-hover:text-brand-text">
                    {t(tool.titleEn, tool.titleTaglish)}
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-xs text-terminal-muted">
                    {t(tool.descEn, tool.descTaglish)}
                  </span>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-terminal-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand-text"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold tracking-tight text-terminal-text">
              {t('Market Specializations', 'Mga Espesyalisasyon sa Merkado')}
            </h2>
            <Link
              to="/academy?pillar=specializations"
              className="text-xs font-medium text-terminal-muted underline-offset-4 transition-colors hover:text-brand-text hover:underline"
            >
              {t('Philippine Market (PSE)', 'Philippine Market (PSE)')}
            </Link>
          </div>

          <div className="mt-3 divide-y divide-terminal-border border-t border-terminal-border">
            {MARKET_TRACK_ROWS.map((track) => (
              <Link
                key={track.id}
                to={track.to}
                className="group tl-row-interactive flex items-center justify-between gap-4 py-3.5 transition-colors"
              >
                <div className="min-w-0">
                  <span className="block text-sm font-medium text-terminal-text transition-colors group-hover:text-brand-text">
                    {t(track.titleEn, track.titleTaglish)}
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-xs text-terminal-muted">
                    {t(track.descEn, track.descTaglish)}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden font-mono text-xs tabular-nums text-terminal-muted sm:inline">
                    {track.topicCount} {t('topics', 'topics')}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-terminal-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand-text"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Band 4: Deep Visual Lessons Index + Editorial Discipline Column */}
      <section
        aria-labelledby="deep-lessons-heading"
        className="grid items-start gap-10 border-t border-terminal-border pt-8 lg:grid-cols-[1.45fr_0.75fr]"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="deep-lessons-heading"
              className="text-base font-semibold tracking-tight text-terminal-text"
            >
              {t('Deep Visual Lessons', 'Mga Deep Visual Lessons')}
            </h2>
            <Link
              to="/academy"
              className="text-xs font-medium text-brand-text underline-offset-4 hover:underline"
            >
              {t(
                `Browse all ${CURRICULUM_LESSONS.length} lessons`,
                `Tingnan lahat (${CURRICULUM_LESSONS.length} aralin)`,
              )}
            </Link>
          </div>

          {/* Crisp Underline Market Filter Tabs */}
          <div
            role="group"
            aria-label="Filter curriculum by market"
            className="no-scrollbar mt-4 flex items-center gap-5 overflow-x-auto border-b border-terminal-border"
          >
            {FILTER_TAB_ORDER.map((tabId) => {
              const isActive = marketFilter === tabId;
              const label = FILTER_TAB_LABELS[tabId];
              return (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => setMarketFilter(tabId)}
                  aria-pressed={isActive}
                  className={`-mb-px shrink-0 border-b-2 pb-2.5 text-xs transition-colors ${
                    isActive
                      ? 'border-brand font-semibold text-terminal-text'
                      : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  <span>{t(label.en, label.taglish)}</span>
                  <span className="ml-1.5 font-mono text-[11px] tabular-nums opacity-65">
                    {marketCounts[tabId]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Numbered Interactive Lesson Rows */}
          <div className="divide-y divide-terminal-border">
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
                  className="group tl-row-interactive flex items-center justify-between gap-4 py-3 transition-colors"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {isDone ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-bull"
                        aria-label="Completed"
                      />
                    ) : (
                      <span className="mt-0.5 w-6 shrink-0 font-mono text-xs font-medium tabular-nums text-terminal-muted">
                        {formatModuleOrder(lesson.moduleOrder)}
                      </span>
                    )}

                    <div className="min-w-0">
                      <span className="block truncate text-sm font-medium text-terminal-text transition-colors group-hover:text-brand-text">
                        {displayTitle}
                      </span>
                      {shortSummary && (
                        <span className="mt-0.5 block line-clamp-1 text-xs text-terminal-muted">
                          {shortSummary}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden font-mono text-[11px] text-terminal-muted sm:inline">
                      {shortCodeMap[lesson.marketCategory] ?? 'CORE'}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-terminal-muted">
                      {lesson.estimatedMinutes}m
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 text-terminal-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand-text"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Editorial Discipline Column */}
        <aside
          aria-label={t('Discipline and difficult concepts', 'Disiplina at mga mahirap na konsepto')}
          className="space-y-8 lg:sticky lg:top-[84px]"
        >
          <DailyQuoteCard onOpenVault={onOpenVault} />

          <div className="border-t border-terminal-border pt-6">
            <DifficultConceptsPanel compact />
          </div>
        </aside>
      </section>

      <OnboardingModal
        isOpen={onboardingOpen}
        initialPreferences={preferences}
        onClose={() => setOnboardingOpen(false)}
        onSaved={handleOnboardingSaved}
      />
    </div>
  );
}
