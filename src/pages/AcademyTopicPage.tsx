import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert,
  Sparkles,
  Unlock,
} from 'lucide-react';
import { BeforeAfterChartViewer } from '../components/charts/BeforeAfterChartViewer';
import { LessonKnowledgeCheck } from '../components/learning/LessonKnowledgeCheck';
import { ConceptDiagramSvg } from '../components/visual-learning/ConceptDiagramSvg';
import { useLanguage } from '../context/LanguageContext';
import {
  ALL_SYLLABUS_LESSONS,
  MASTERY_LEVELS,
  getModuleForTopic,
  getPathById,
  getPrevNextTopics,
  getTopicByCode,
  getTopicBySlug,
} from '../data/academyRoadmap';
import { getChartScenariosForLesson } from '../data/chartScenarios';
import { getLessonBySlug } from '../data/curriculum';
import { expandAcronyms } from '../lib/acronymHelper';
import {
  isFreeBrowseEnabled,
  isTopicUnlocked,
  listTopicProgress,
  saveTopicProgress,
  setFreeBrowseEnabled,
} from '../services/academyProgressService';
import type { DiagramConfig } from '../types/academy';
import type {
  DecoupledLessonNode,
  SupportedMarketTag,
  TopicProgressRecord,
} from '../types/curriculum-tree';

const MARKET_TAG_LABELS: Record<
  SupportedMarketTag,
  { labelEn: string; labelTaglish: string }
> = {
  all: { labelEn: 'All Markets', labelTaglish: 'Lahat ng Market' },
  forex: { labelEn: 'Forex', labelTaglish: 'Forex' },
  indices: { labelEn: 'Indices', labelTaglish: 'Indices' },
  stocks: { labelEn: 'Stocks', labelTaglish: 'Stocks' },
  crypto: { labelEn: 'Crypto', labelTaglish: 'Crypto' },
  pse: { labelEn: 'PH / PSE', labelTaglish: 'PH / PSE' },
};

function buildTopicDiagramConfig(
  topic: DecoupledLessonNode,
  linkedLessonDiagram?: DiagramConfig,
): DiagramConfig {
  if (linkedLessonDiagram && linkedLessonDiagram.kind === topic.diagramKind) {
    return linkedLessonDiagram;
  }

  return {
    kind: topic.diagramKind,
    title: `${topic.code} · ${topic.title}`,
    subtitle: topic.overviewEn,
    caption: `Visual blueprint for Lesson ${topic.code} — compare both bullish (up) and bearish (down) contexts before executing.`,
    legend: [
      { label: 'Bullish Structure / Demand', colorToken: 'bull' },
      { label: 'Bearish Structure / Supply', colorToken: 'bear' },
      { label: 'Key Level / Liquidity', colorToken: 'amber' },
      { label: 'Execution Context', colorToken: 'brand' },
    ],
    annotations: topic.keyPoints.slice(0, 4).map((point, idx) => ({
      id: `${topic.code}-kp-${idx + 1}`,
      label: `Key Point ${idx + 1}`,
      sublabel: point,
      tone:
        idx === 0
          ? 'bullish'
          : idx === 1
            ? 'bearish'
            : idx === 2
              ? 'liquidity'
              : 'neutral',
    })),
    walkthroughSteps:
      topic.objectives.length > 0 ? topic.objectives : topic.keyPoints.slice(0, 4),
  };
}

export function AcademyTopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isTaglish, t } = useLanguage();

  const topic = useMemo(
    () => (slug ? getTopicBySlug(slug) : undefined),
    [slug],
  );

  const [progressMap, setProgressMap] = useState<Record<string, TopicProgressRecord>>({});
  const [freeBrowse, setFreeBrowse] = useState<boolean>(() => isFreeBrowseEnabled());
  const [savingFlag, setSavingFlag] = useState<boolean>(false);
  const [showInlineChart, setShowInlineChart] = useState<boolean>(false);

  useEffect(() => {
    setShowInlineChart(false);
  }, [slug]);

  useEffect(() => {
    let active = true;
    setFreeBrowse(isFreeBrowseEnabled());
    void listTopicProgress().then((records) => {
      if (!active) {
        return;
      }
      const nextMap: Record<string, TopicProgressRecord> = {};
      for (const rec of records) {
        nextMap[rec.topicCode] = rec;
      }
      setProgressMap(nextMap);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const moduleMeta = useMemo(
    () => (topic ? getModuleForTopic(topic.code) : undefined),
    [topic],
  );

  const pathMeta = useMemo(
    () => (moduleMeta ? getPathById(moduleMeta.pathId) : undefined),
    [moduleMeta],
  );

  const levelMeta = useMemo(
    () => (topic ? MASTERY_LEVELS.find((lvl) => lvl.level === topic.level) : undefined),
    [topic],
  );

  const prevNext = useMemo(
    () => (topic ? getPrevNextTopics(topic.code) : { prev: null, next: null }),
    [topic],
  );

  const linkedDeepLesson = useMemo(
    () =>
      topic?.linkedDeepLessonSlug
        ? getLessonBySlug(topic.linkedDeepLessonSlug)
        : undefined,
    [topic],
  );

  const chartScenarios = useMemo(
    () => (linkedDeepLesson ? getChartScenariosForLesson(linkedDeepLesson) : []),
    [linkedDeepLesson],
  );

  const diagramConfig = useMemo(() => {
    if (!topic) {
      return null;
    }
    return buildTopicDiagramConfig(topic, linkedDeepLesson?.diagramConfig);
  }, [topic, linkedDeepLesson]);

  if (!topic) {
    const starterTopic = ALL_SYLLABUS_LESSONS[0];
    return (
      <div className="tl-page-enter mx-auto max-w-3xl py-12 text-center">
        <BookOpen className="mx-auto h-8 w-8 text-terminal-muted" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-terminal-text">
          {t('Academy Topic Not Found', 'Hindi Nakita ang Aralin')}
        </h1>
        <p className="mx-auto mt-2 max-w-[52ch] text-sm leading-relaxed text-terminal-muted">
          {t(
            'The requested syllabus topic does not exist or may have moved. Browse the full Master Academy roadmap instead.',
            'Hindi mahanap ang hinahanap na aralin. Bumalik sa kumpletong Master Academy roadmap.',
          )}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/academy"
            className="tl-press inline-flex items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-surface px-4 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:text-brand-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t('Back to Academy', 'Bumalik sa Academy')}
          </Link>
          {starterTopic && (
            <Link
              to={`/academy/topic/${starterTopic.slug}`}
              className="tl-press inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
            >
              <span>
                {t(`Start Lesson ${starterTopic.code}`, `Simulan ang Lesson ${starterTopic.code}`)}
              </span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  const currentProgress = progressMap[topic.code];
  const unlockStatus = isTopicUnlocked(topic, progressMap, freeBrowse);
  const missingPrereqs = unlockStatus.missingPrerequisiteCodes
    .map((code) => getTopicByCode(code))
    .filter((item): item is DecoupledLessonNode => Boolean(item));

  const disclaimerText = topic.limitationsNote ?? moduleMeta?.disclaimer ?? null;
  const overviewText = isTaglish ? topic.overviewTaglish : topic.overviewEn;

  const handleUnlockFreeBrowse = () => {
    setFreeBrowseEnabled(true);
    setFreeBrowse(true);
  };

  const applyProgressPatch = async (
    patch: Partial<
      Pick<
        TopicProgressRecord,
        'readingCompleted' | 'quizPassed' | 'quizScorePct' | 'practicalCompleted' | 'completed'
      >
    >,
  ) => {
    if (savingFlag) {
      return;
    }
    setSavingFlag(true);
    try {
      const updated = await saveTopicProgress(topic.code, patch);
      setProgressMap((prev) => ({
        ...prev,
        [updated.topicCode]: updated,
      }));
    } finally {
      setSavingFlag(false);
    }
  };

  const handleQuizResult = (passed: boolean, scorePct: number) => {
    void applyProgressPatch({
      quizPassed: passed || Boolean(currentProgress?.quizPassed),
      quizScorePct: Math.max(scorePct, currentProgress?.quizScorePct ?? 0),
    });
  };

  const readingDone = Boolean(currentProgress?.readingCompleted);
  const quizPassed = Boolean(currentProgress?.quizPassed);
  const practicalDone = Boolean(currentProgress?.practicalCompleted);
  const topicCompleted = Boolean(currentProgress?.completed);

  const marketsLabel = topic.supportedMarkets
    .map((tag) => {
      const meta = MARKET_TAG_LABELS[tag];
      return t(meta.labelEn, meta.labelTaglish);
    })
    .join(', ');

  return (
    <div className="tl-page-enter mx-auto max-w-4xl space-y-8">
      {/* Unboxed Editorial Masthead */}
      <header className="space-y-3 border-b border-terminal-border pb-6">
        <nav
          aria-label="Topic breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-terminal-muted"
        >
          <Link
            to="/academy"
            className="inline-flex items-center gap-1 font-medium text-terminal-muted transition-colors hover:text-terminal-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('Academy', 'Academy')}</span>
          </Link>
          {pathMeta && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
              <span>{pathMeta.title}</span>
            </>
          )}
          {moduleMeta && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
              <span className="font-mono text-[11px] font-medium text-terminal-text">
                {moduleMeta.code}: {moduleMeta.title}
              </span>
            </>
          )}
        </nav>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-terminal-muted tabular-nums">
          <span className="font-semibold text-brand-text">Lesson {topic.code}</span>
          <span>
            · Level {topic.level}
            {levelMeta ? ` (${t(levelMeta.labelEn, levelMeta.labelTaglish)})` : ''}
          </span>
          {marketsLabel && <span>· {marketsLabel}</span>}
          <span>· ~{topic.estimatedMinutes} min</span>
          {topic.optional && (
            <span className="text-amber-600 dark:text-amber-400">
              · {t('Optional', 'Opsyonal')}
            </span>
          )}
          {topicCompleted && (
            <span className="inline-flex items-center gap-1 font-semibold text-bull">
              · <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              {t('Completed', 'Tapos Na')}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text text-balance sm:text-3xl">
          {expandAcronyms(topic.title)}
        </h1>
      </header>

      {/* Calm Hairline Prerequisite Recommended Banner (Guided Mode) */}
      {!unlockStatus.unlocked && (
        <section
          aria-label={t('Prerequisite Recommended', 'Inirerekomendang Prerequisite')}
          className="rounded-r-md border-l-2 border-l-amber-500 bg-amber-500/5 px-4 py-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-2.5">
              <Lock
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 sm:text-sm">
                  {t(
                    'Prerequisite Recommended (Guided Progression)',
                    'Inirerekomendang Prerequisite (Guided Progression)',
                  )}
                </p>
                <p className="max-w-[65ch] text-xs leading-relaxed text-terminal-text sm:text-[13px]">
                  {t(
                    'Complete the foundational topic(s) below first so this concept makes full sense — or switch to Free Browse to study in any order.',
                    'Tapusin muna ang mga naunang aralin sa ibaba para mas madaling maunawaan ito — o buksan ang Free Browse kung gusto mong mag-aral kahit anong order.',
                  )}
                </p>
                {missingPrereqs.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {missingPrereqs.map((prereq) => (
                      <Link
                        key={prereq.code}
                        to={`/academy/topic/${prereq.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-surface px-2.5 py-1 text-xs font-medium text-terminal-text transition-colors hover:border-brand hover:text-brand-text"
                      >
                        <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          {prereq.code}
                        </span>
                        <span>{prereq.title}</span>
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleUnlockFreeBrowse}
              className="tl-press inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
              {t('Unlock Free Browse', 'Buksan ang Free Browse')}
            </button>
          </div>
        </section>
      )}

      {/* Calm Hairline Analytical / Risk Disclaimer */}
      {disclaimerText && (
        <aside
          aria-label={t('Analytical framework & risk note', 'Paalala sa analytical framework at risk')}
          className="flex items-start gap-2.5 border-l-2 border-amber-500/70 pl-4 py-1 text-xs leading-relaxed text-terminal-muted sm:text-[13px]"
        >
          <ShieldAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <p className="max-w-[68ch]">
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {t('Analytical & Risk Note: ', 'Paalala sa Risk at Framework: ')}
            </span>
            <span className="text-terminal-text">{expandAcronyms(disclaimerText)}</span>
          </p>
        </aside>
      )}

      {/* 1. Lesson Overview */}
      <section aria-labelledby="topic-section-1" className="space-y-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-xs font-medium text-terminal-muted tabular-nums">
            01
          </span>
          <h2 id="topic-section-1" className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg">
            {t('Lesson Overview', 'Pangkalahatang-ideya ng Aralin')}
          </h2>
        </div>
        <p className="max-w-[68ch] text-sm leading-relaxed text-terminal-text sm:text-[15px]">
          {expandAcronyms(overviewText)}
        </p>
      </section>

      {/* 2. Learning Objectives */}
      <section
        aria-labelledby="topic-section-2"
        className="space-y-4 border-t border-terminal-border pt-7"
      >
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-xs font-medium text-terminal-muted tabular-nums">
            02
          </span>
          <h2 id="topic-section-2" className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg">
            {t('Learning Objectives', 'Mga Layunin sa Pag-aaral')}
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {topic.objectives.map((objective, idx) => (
            <li
              key={`${topic.code}-obj-${idx}`}
              className="flex items-start gap-3 border-t border-terminal-border/70 pt-3 text-xs leading-relaxed text-terminal-text sm:text-sm"
            >
              <span className="mt-0.5 shrink-0 font-mono text-[11px] font-semibold text-bull tabular-nums">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="max-w-[64ch]">{expandAcronyms(objective)}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 3. Lesson Content & Visual Blueprint */}
      <section
        aria-labelledby="topic-section-3"
        className="space-y-6 border-t border-terminal-border pt-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xs font-medium text-terminal-muted tabular-nums">
              03
            </span>
            <h2 id="topic-section-3" className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg">
              {t('Lesson Content & Visual Blueprint', 'Nilalaman ng Aralin at Visual Blueprint')}
            </h2>
          </div>

          {topic.linkedDeepLessonSlug && (
            <Link
              to={`/academy/${topic.linkedDeepLessonSlug}`}
              className="tl-press inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {t(
                  'Open Deep Lesson (Verified Videos & AI Mentor) →',
                  'Buksan ang Deep Lesson (Verified Videos at AI Mentor) →',
                )}
              </span>
            </Link>
          )}
        </div>

        {/* Scannable Key Points (Unboxed Editorial Grid) */}
        <ul className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {topic.keyPoints.map((point, idx) => (
            <li
              key={`${topic.code}-point-${idx}`}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-terminal-text"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                aria-hidden="true"
              />
              <span className="max-w-[64ch]">{expandAcronyms(point)}</span>
            </li>
          ))}
        </ul>

        {/* Full-Column Dual Bullish & Bearish Interactive Blueprint */}
        {diagramConfig && (
          <div className="pt-1">
            <ConceptDiagramSvg config={diagramConfig} />
          </div>
        )}
      </section>

      {/* 4. Practical Examples */}
      <section
        aria-labelledby="topic-section-4"
        className="space-y-4 border-t border-terminal-border pt-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xs font-medium text-terminal-muted tabular-nums">
              04
            </span>
            <h2 id="topic-section-4" className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg">
              {t('Practical Examples', 'Mga Praktikal na Halimbawa')}
            </h2>
          </div>

          {chartScenarios.length > 0 && (
            <button
              type="button"
              onClick={() => setShowInlineChart((prev) => !prev)}
              aria-expanded={showInlineChart}
              className="tl-press inline-flex items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {showInlineChart ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-terminal-muted" aria-hidden="true" />
                  {t('Hide Chart Replay', 'Itago ang Chart Replay')}
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-bull" aria-hidden="true" />
                  {t('Inspect Interactive Chart Replay', 'Buksan ang Interactive Chart Replay')}
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-1.5 border-l-2 border-bull pl-4 py-0.5">
          <p className="font-mono text-xs font-semibold text-bull">
            {t('Real-World Execution Scenario', 'Praktikal na Sitwasyon sa Market')}
          </p>
          <p className="max-w-[68ch] text-sm leading-relaxed text-terminal-text">
            {expandAcronyms(topic.practicalExample)}
          </p>
        </div>

        {chartScenarios.length > 0 && showInlineChart && (
          <div className="pt-2">
            <BeforeAfterChartViewer
              scenario={chartScenarios[0]}
              comparisonScenario={chartScenarios[1]}
              height={320}
            />
          </div>
        )}
      </section>

      {/* 5. Knowledge Check */}
      <section
        aria-labelledby="topic-section-5"
        className="space-y-4 border-t border-terminal-border pt-7"
      >
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-xs font-medium text-terminal-muted tabular-nums">
            05
          </span>
          <h2 id="topic-section-5" className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg">
            {t('Knowledge Check', 'Pagsusulit sa Kaalaman')}
          </h2>
        </div>
        <LessonKnowledgeCheck
          question={topic.quiz}
          initialPassed={quizPassed}
          onResult={handleQuizResult}
        />
      </section>

      {/* 6. Lesson Completion & Next Topic */}
      <section
        aria-labelledby="topic-section-6"
        className="space-y-5 border-t border-terminal-border pt-7"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xs font-medium text-terminal-muted tabular-nums">
              06
            </span>
            <h2 id="topic-section-6" className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg">
              {t('Lesson Completion & Next Topic', 'Pagkumpleto ng Aralin at Susunod na Paksa')}
            </h2>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium ${
              topicCompleted ? 'text-bull' : 'text-terminal-muted'
            }`}
          >
            {topicCompleted ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t('Topic Complete', 'Kumpleto Na')}
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                {t('Complete reading + quiz to mark done', 'Tapusin ang pagbasa at quiz')}
              </>
            )}
          </span>
        </div>

        {/* 3-Slot Hairline Completion Strip */}
        <div className="grid grid-cols-1 divide-y divide-terminal-border overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <button
            type="button"
            disabled={savingFlag}
            aria-pressed={readingDone}
            onClick={() => void applyProgressPatch({ readingCompleted: !readingDone })}
            className={`tl-row-interactive flex items-center justify-between gap-2 px-4 py-3 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand disabled:opacity-60 ${
              readingDone
                ? 'bg-bull/10 text-bull'
                : 'text-terminal-text hover:bg-terminal-elevated/60 hover:text-bull'
            }`}
          >
            <span>{t('1. Reading Done', '1. Tapos Basahin')}</span>
            {readingDone ? (
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <span className="font-mono text-[10px] font-normal text-terminal-muted">
                {t('Click to mark', 'I-mark')}
              </span>
            )}
          </button>

          <div
            className={`flex items-center justify-between gap-2 px-4 py-3 text-xs font-semibold ${
              quizPassed ? 'bg-bull/10 text-bull' : 'text-terminal-muted'
            }`}
          >
            <span>{t('2. Quiz Passed', '2. Pasado sa Quiz')}</span>
            {quizPassed ? (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {currentProgress?.quizScorePct ?? 100}%
              </span>
            ) : (
              <span className="font-mono text-[10px] font-normal">
                {t('Answer Step 5', 'Sagutan ang #5')}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={savingFlag}
            aria-pressed={practicalDone}
            onClick={() => void applyProgressPatch({ practicalCompleted: !practicalDone })}
            className={`tl-row-interactive flex items-center justify-between gap-2 px-4 py-3 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand disabled:opacity-60 ${
              practicalDone
                ? 'bg-bull/10 text-bull'
                : 'text-terminal-text hover:bg-terminal-elevated/60 hover:text-bull'
            }`}
          >
            <span>{t('3. Practical Checked', '3. Praktikal OK')}</span>
            {practicalDone ? (
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <span className="font-mono text-[10px] font-normal text-terminal-muted">
                {t('Optional check', 'I-check')}
              </span>
            )}
          </button>
        </div>

        {/* Publication-Style Prev / Next Topic Footer */}
        <nav
          aria-label="Syllabus topic pagination"
          className="grid grid-cols-1 gap-4 border-t border-terminal-border pt-6 sm:grid-cols-2"
        >
          <div>
            {prevNext.prev ? (
              <Link
                to={`/academy/topic/${prevNext.prev.slug}`}
                className="tl-row-interactive group flex flex-col gap-1 py-1 text-left"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
                  <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                  <span>
                    {t('Previous', 'Nakaraan')} · {prevNext.prev.code}
                  </span>
                </span>
                <span className="text-sm font-semibold text-terminal-text transition-colors group-hover:text-brand-text">
                  {prevNext.prev.title}
                </span>
              </Link>
            ) : (
              <Link
                to="/academy"
                className="tl-row-interactive group flex flex-col gap-1 py-1 text-left"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
                  <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                  <span>{t('Roadmap', 'Roadmap')}</span>
                </span>
                <span className="text-sm font-semibold text-terminal-text transition-colors group-hover:text-brand-text">
                  {t('Back to Master Roadmap', 'Bumalik sa Master Roadmap')}
                </span>
              </Link>
            )}
          </div>

          <div className="sm:text-right">
            {prevNext.next ? (
              <Link
                to={`/academy/topic/${prevNext.next.slug}`}
                className="tl-row-interactive group flex flex-col gap-1 py-1 sm:items-end"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
                  <span>
                    {t('Next', 'Susunod')} · {prevNext.next.code}
                  </span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-brand-text transition-opacity group-hover:opacity-85">
                  {prevNext.next.title}
                </span>
              </Link>
            ) : (
              <Link
                to="/evaluation"
                className="tl-row-interactive group flex flex-col gap-1 py-1 sm:items-end"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
                  <span>{t('Evaluation', 'Pagsusulit')}</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-bull">
                  {t('Take Level Evaluation', 'Kunin ang Level Evaluation')}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </section>
    </div>
  );
}
