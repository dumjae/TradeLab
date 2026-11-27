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
  Clock,
  Eye,
  EyeOff,
  Layers,
  LineChart,
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

const MARKET_TAG_META: Record<
  SupportedMarketTag,
  { labelEn: string; labelTaglish: string; badgeClass: string }
> = {
  all: {
    labelEn: 'All Markets',
    labelTaglish: 'Lahat ng Market',
    badgeClass: 'border-brand/35 bg-brand-soft text-brand-text',
  },
  forex: {
    labelEn: 'Forex',
    labelTaglish: 'Forex',
    badgeClass: 'border-sky-500/35 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  indices: {
    labelEn: 'Indices',
    labelTaglish: 'Indices',
    badgeClass: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  stocks: {
    labelEn: 'Stocks',
    labelTaglish: 'Stocks',
    badgeClass: 'border-rose-500/35 bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
  crypto: {
    labelEn: 'Crypto',
    labelTaglish: 'Crypto',
    badgeClass: 'border-teal-500/35 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  },
  pse: {
    labelEn: 'PH / PSE',
    labelTaglish: 'PH / PSE',
    badgeClass: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
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
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="rounded-xl border border-terminal-border bg-terminal-surface p-6 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-terminal-muted" aria-hidden="true" />
          <h1 className="mt-3 text-lg font-bold text-terminal-text">
            {t('Academy Topic Not Found', 'Hindi Nakita ang Aralin')}
          </h1>
          <p className="mt-1 text-xs text-terminal-muted">
            {t(
              'The requested syllabus topic does not exist or may have moved. Browse the full Master Academy roadmap instead.',
              'Hindi mahanap ang hinahanap na aralin. Bumalik sa kumpletong Master Academy roadmap.',
            )}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/academy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:text-brand-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {t('Back to Academy', 'Bumalik sa Academy')}
            </Link>
            {starterTopic && (
              <Link
                to={`/academy/topic/${starterTopic.slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
              >
                <span>
                  {t(`Start Lesson ${starterTopic.code}`, `Simulan ang Lesson ${starterTopic.code}`)}
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </section>
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

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Header & Breadcrumb */}
      <header className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5">
        <nav
          aria-label="Topic breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-[11px] text-terminal-muted"
        >
          <Link
            to="/academy"
            className="inline-flex items-center gap-1 rounded-md border border-terminal-border bg-terminal-bg px-2 py-0.5 font-medium text-terminal-muted transition-colors hover:border-brand/45 hover:text-terminal-text"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            {t('Academy', 'Academy')}
          </Link>
          {pathMeta && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
              <span className="font-medium text-terminal-muted">{pathMeta.title}</span>
            </>
          )}
          {moduleMeta && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
              <span className="font-mono font-semibold text-terminal-text">
                {moduleMeta.code}: {moduleMeta.title}
              </span>
            </>
          )}
        </nav>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded border border-brand/35 bg-brand-soft px-2 py-0.5 font-mono text-[11px] font-bold text-brand-text tabular-nums">
            Lesson {topic.code}
          </span>
          <span className="rounded border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-terminal-text tabular-nums">
            Level {topic.level}
            {levelMeta ? ` · ${t(levelMeta.labelEn, levelMeta.labelTaglish)}` : ''}
          </span>
          {topic.optional && (
            <span className="rounded border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              {t('Optional', 'Opsyonal')}
            </span>
          )}
          {topic.supportedMarkets.map((marketTag) => {
            const meta = MARKET_TAG_META[marketTag];
            return (
              <span
                key={marketTag}
                className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${meta.badgeClass}`}
              >
                {t(meta.labelEn, meta.labelTaglish)}
              </span>
            );
          })}
          <span className="inline-flex items-center gap-1 rounded border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] text-terminal-muted tabular-nums">
            <Clock className="h-2.5 w-2.5 text-sky-500 dark:text-sky-400" aria-hidden="true" />~
            {topic.estimatedMinutes} min
          </span>
          {topicCompleted && (
            <span className="inline-flex items-center gap-1 rounded border border-bull/40 bg-bull/15 px-2 py-0.5 text-[10px] font-semibold text-bull">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              {t('Completed', 'Tapos Na')}
            </span>
          )}
        </div>

        <h1 className="mt-2.5 text-lg font-bold tracking-tight text-terminal-text sm:text-xl">
          {expandAcronyms(topic.title)}
        </h1>
      </header>

      {/* Prerequisite Recommended Banner (Guided Mode) */}
      {!unlockStatus.unlocked && (
        <section
          aria-label={t('Prerequisite Recommended', 'Inirerekomendang Prerequisite')}
          className="rounded-xl border border-amber-500/45 bg-amber-500/10 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-2.5">
              <Lock
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 sm:text-sm">
                  {t(
                    'Prerequisite Recommended (Guided Progression)',
                    'Inirerekomendang Prerequisite (Guided Progression)',
                  )}
                </p>
                <p className="text-xs leading-relaxed text-terminal-text">
                  {t(
                    'Complete the foundational topic(s) below first so this concept makes full sense — or switch to Free Browse to study in any order.',
                    'Tapusin muna ang mga naunang aralin sa ibaba para mas madaling maunawaan ito — o buksan ang Free Browse kung gusto mong mag-aral kahit anong order.',
                  )}
                </p>
                {missingPrereqs.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {missingPrereqs.map((prereq) => (
                      <Link
                        key={prereq.code}
                        to={`/academy/topic/${prereq.slug}`}
                        className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-terminal-surface px-2.5 py-1 text-[11px] font-semibold text-terminal-text transition-colors hover:border-brand hover:text-brand-text"
                      >
                        <span className="font-mono text-amber-600 dark:text-amber-400">
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
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
              {t('Unlock Free Browse', 'Buksan ang Free Browse')}
            </button>
          </div>
        </section>
      )}

      {/* Analytical / Risk Disclaimer */}
      {disclaimerText && (
        <aside
          aria-label={t('Analytical framework & risk note', 'Paalala sa analytical framework at risk')}
          className="flex items-start gap-2.5 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-terminal-text"
        >
          <ShieldAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <div>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {t('Analytical & Risk Note: ', 'Paalala sa Risk at Framework: ')}
            </span>
            <span>{expandAcronyms(disclaimerText)}</span>
          </div>
        </aside>
      )}

      {/* 1. Lesson Overview */}
      <section
        aria-labelledby="topic-section-1"
        className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/35 bg-brand-soft font-mono text-[11px] font-bold text-brand-text tabular-nums">
            1
          </span>
          <h2 id="topic-section-1" className="text-sm font-bold text-terminal-text sm:text-base">
            {t('Lesson Overview', 'Pangkalahatang-ideya ng Aralin')}
          </h2>
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-terminal-text sm:text-sm">
          {expandAcronyms(overviewText)}
        </p>
      </section>

      {/* 2. Learning Objectives */}
      <section
        aria-labelledby="topic-section-2"
        className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/35 bg-brand-soft font-mono text-[11px] font-bold text-brand-text tabular-nums">
            2
          </span>
          <h2 id="topic-section-2" className="text-sm font-bold text-terminal-text sm:text-base">
            {t('Learning Objectives', 'Mga Layunin sa Pag-aaral')}
          </h2>
        </div>
        <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {topic.objectives.map((objective, idx) => (
            <li
              key={`${topic.code}-obj-${idx}`}
              className="flex items-start gap-2.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2.5 text-xs leading-relaxed text-terminal-text"
            >
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-bull/40 bg-bull/15 font-mono text-[10px] font-bold text-bull tabular-nums">
                {idx + 1}
              </span>
              <span>{expandAcronyms(objective)}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 3. Lesson Content & Visual Blueprint */}
      <section
        aria-labelledby="topic-section-3"
        className="space-y-4 rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/35 bg-brand-soft font-mono text-[11px] font-bold text-brand-text tabular-nums">
              3
            </span>
            <h2 id="topic-section-3" className="text-sm font-bold text-terminal-text sm:text-base">
              {t('Lesson Content & Visual Blueprint', 'Nilalaman ng Aralin at Visual Blueprint')}
            </h2>
          </div>

          {topic.linkedDeepLessonSlug && (
            <Link
              to={`/academy/${topic.linkedDeepLessonSlug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
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

        {/* Scannable Key Points */}
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {topic.keyPoints.map((point, idx) => (
            <li
              key={`${topic.code}-point-${idx}`}
              className="flex items-start gap-2.5 rounded-lg border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-xs leading-relaxed text-terminal-text"
            >
              <Layers
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-text"
                aria-hidden="true"
              />
              <span>{expandAcronyms(point)}</span>
            </li>
          ))}
        </ul>

        {/* Dual Bullish & Bearish Interactive Blueprint */}
        {diagramConfig && (
          <div className="pt-1">
            <ConceptDiagramSvg config={diagramConfig} />
          </div>
        )}
      </section>

      {/* 4. Practical Examples */}
      <section
        aria-labelledby="topic-section-4"
        className="space-y-3.5 rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/35 bg-brand-soft font-mono text-[11px] font-bold text-brand-text tabular-nums">
              4
            </span>
            <h2 id="topic-section-4" className="text-sm font-bold text-terminal-text sm:text-base">
              {t('Practical Examples', 'Mga Praktikal na Halimbawa')}
            </h2>
          </div>

          {chartScenarios.length > 0 && (
            <button
              type="button"
              onClick={() => setShowInlineChart((prev) => !prev)}
              aria-expanded={showInlineChart}
              className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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

        <div className="rounded-lg border border-terminal-border bg-terminal-bg p-3.5 text-xs leading-relaxed text-terminal-text sm:text-[13px]">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-bull">
            <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
            {t('Real-World Execution Scenario', 'Praktikal na Sitwasyon sa Market')}
          </div>
          <p>{expandAcronyms(topic.practicalExample)}</p>
        </div>

        {chartScenarios.length > 0 && showInlineChart && (
          <div className="pt-1">
            <BeforeAfterChartViewer
              scenario={chartScenarios[0]}
              comparisonScenario={chartScenarios[1]}
              height={320}
            />
          </div>
        )}
      </section>

      {/* 5. Knowledge Check */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/35 bg-brand-soft font-mono text-[11px] font-bold text-brand-text tabular-nums">
            5
          </span>
          <h2 className="text-sm font-bold text-terminal-text sm:text-base">
            {t('Knowledge Check', 'Pagsusulit sa Kaalaman')}
          </h2>
        </div>
        <LessonKnowledgeCheck
          question={topic.quiz}
          initialPassed={quizPassed}
          onResult={handleQuizResult}
        />
      </div>

      {/* 6. Lesson Completion & Next Topic */}
      <section
        aria-labelledby="topic-section-6"
        className="space-y-4 rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/35 bg-brand-soft font-mono text-[11px] font-bold text-brand-text tabular-nums">
              6
            </span>
            <h2 id="topic-section-6" className="text-sm font-bold text-terminal-text sm:text-base">
              {t('Lesson Completion & Next Topic', 'Pagkumpleto ng Aralin at Susunod na Paksa')}
            </h2>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
              topicCompleted
                ? 'border-bull/40 bg-bull/15 text-bull'
                : 'border-terminal-border bg-terminal-bg text-terminal-muted'
            }`}
          >
            {topicCompleted ? (
              <>
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                {t('Topic Complete', 'Kumpleto Na')}
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 text-amber-500" aria-hidden="true" />
                {t('Complete reading + quiz to mark done', 'Tapusin ang pagbasa at quiz')}
              </>
            )}
          </span>
        </div>

        {/* 3-Pill Completion Tracker */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            disabled={savingFlag}
            aria-pressed={readingDone}
            onClick={() => void applyProgressPatch({ readingCompleted: !readingDone })}
            className={`flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 ${
              readingDone
                ? 'border-bull/45 bg-bull/15 text-bull'
                : 'border-terminal-border bg-terminal-bg text-terminal-text hover:border-bull/40 hover:text-bull'
            }`}
          >
            <span>{t('1. Reading Done', '1. Tapos Basahin')}</span>
            {readingDone ? (
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <span className="font-mono text-[10px] text-terminal-muted">
                {t('Click to mark', 'I-mark')}
              </span>
            )}
          </button>

          <div
            className={`flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${
              quizPassed
                ? 'border-bull/45 bg-bull/15 text-bull'
                : 'border-terminal-border bg-terminal-bg text-terminal-muted'
            }`}
          >
            <span>{t('2. Quiz Passed', '2. Pasado sa Quiz')}</span>
            {quizPassed ? (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {currentProgress?.quizScorePct ?? 100}%
              </span>
            ) : (
              <span className="font-mono text-[10px]">
                {t('Answer Step 5', 'Sagutan ang #5')}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={savingFlag}
            aria-pressed={practicalDone}
            onClick={() => void applyProgressPatch({ practicalCompleted: !practicalDone })}
            className={`flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 ${
              practicalDone
                ? 'border-bull/45 bg-bull/15 text-bull'
                : 'border-terminal-border bg-terminal-bg text-terminal-text hover:border-bull/40 hover:text-bull'
            }`}
          >
            <span>{t('3. Practical Checked', '3. Praktikal OK')}</span>
            {practicalDone ? (
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <span className="font-mono text-[10px] text-terminal-muted">
                {t('Optional check', 'I-check')}
              </span>
            )}
          </button>
        </div>

        {/* Prev / Next Topic Pagination */}
        <nav
          aria-label="Syllabus topic pagination"
          className="flex flex-wrap items-center justify-between gap-2 border-t border-terminal-border pt-3.5"
        >
          {prevNext.prev ? (
            <Link
              to={`/academy/topic/${prevNext.prev.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:bg-terminal-elevated hover:text-brand-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {t('Prev:', 'Bago:')} {prevNext.prev.code} · {prevNext.prev.title}
              </span>
            </Link>
          ) : (
            <Link
              to="/academy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs font-semibold text-terminal-muted transition-colors hover:border-brand/50 hover:text-terminal-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {t('Back to Master Roadmap', 'Bumalik sa Master Roadmap')}
            </Link>
          )}

          {prevNext.next ? (
            <Link
              to={`/academy/topic/${prevNext.next.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
            >
              <span>
                {t('Next:', 'Sunod:')} {prevNext.next.code} · {prevNext.next.title}
              </span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              to="/evaluation"
              className="inline-flex items-center gap-1.5 rounded-lg bg-bull px-3.5 py-2 text-xs font-semibold text-slate-950 transition-opacity hover:opacity-95"
            >
              <span>{t('Take Level Evaluation', 'Kunin ang Level Evaluation')}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </section>
    </div>
  );
}
