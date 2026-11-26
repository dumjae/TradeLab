import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { InteractiveCandleChart } from '../components/charts/InteractiveCandleChart';
import { AIMentorPanel } from '../components/mentor/AIMentorPanel';
import { ContextualQuoteStrip } from '../components/quotes/ContextualQuoteStrip';
import { ExplainDifferentlyPanel } from '../components/visual-learning/ExplainDifferentlyPanel';
import { getChartScenarioById } from '../data/chartScenarios';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
  getLessonBySlug,
} from '../data/curriculum';
import {
  markConceptMastered,
  recordConceptCorrectAttempt,
  recordConceptStruggle,
} from '../services/difficultConceptsService';
import type { LessonMarketCategory } from '../types/academy';
import type { UserDifficultConcept } from '../types/visual-learning';

type MarketFilter = 'all' | LessonMarketCategory;

const MARKET_BADGE_STYLES: Record<LessonMarketCategory, string> = {
  general: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  forex: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  indices: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  crypto: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  stocks: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

const MARKET_ACTIVE_PILL_STYLES: Record<MarketFilter, string> = {
  all: 'border-emerald-500 bg-emerald-500 text-slate-950 font-semibold',
  general: 'border-emerald-500 bg-emerald-500 text-slate-950 font-semibold',
  forex: 'border-sky-500 bg-sky-500 text-slate-950 font-semibold',
  indices: 'border-amber-500 bg-amber-500 text-slate-950 font-semibold',
  crypto: 'border-teal-500 bg-teal-500 text-slate-950 font-semibold',
  stocks: 'border-rose-500 bg-rose-500 text-slate-950 font-semibold',
};

function formatModuleOrder(order: number): string {
  return String(order).padStart(2, '0');
}

export function PracticePage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const lesson = useMemo(
    () => (slug ? getLessonBySlug(slug) : undefined) ?? CURRICULUM_LESSONS[0],
    [slug],
  );

  const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(0);
  const [masteryPromptConcept, setMasteryPromptConcept] =
    useState<UserDifficultConcept | null>(null);
  const [masteryConfirmed, setMasteryConfirmed] = useState<boolean>(false);

  const marketMetaMap = useMemo(
    () =>
      Object.fromEntries(
        LESSON_MARKET_CATEGORIES.map((category) => [category.id, category]),
      ) as Record<LessonMarketCategory, { id: LessonMarketCategory; label: string; shortCode: string }>,
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
    for (const item of CURRICULUM_LESSONS) {
      counts[item.marketCategory] = (counts[item.marketCategory] ?? 0) + 1;
    }
    return counts;
  }, []);

  const filteredLessons = useMemo(() => {
    if (marketFilter === 'all') {
      return CURRICULUM_LESSONS;
    }
    return CURRICULUM_LESSONS.filter((item) => item.marketCategory === marketFilter);
  }, [marketFilter]);

  useEffect(() => {
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setShowHintIndex(0);
    setMasteryPromptConcept(null);
    setMasteryConfirmed(false);
  }, [lesson.slug]);

  const handleSelectMarketFilter = (nextMarket: MarketFilter) => {
    setMarketFilter(nextMarket);
    if (nextMarket !== 'all' && lesson.marketCategory !== nextMarket) {
      const firstMatching = CURRICULUM_LESSONS.find((item) => item.marketCategory === nextMarket);
      if (firstMatching) {
        navigate(`/practice/${firstMatching.slug}`);
      }
    }
  };

  const activeQuestion = lesson.practiceQuestions[questionIndex] ?? lesson.practiceQuestions[0];
  const scenario = activeQuestion?.scenarioId
    ? getChartScenarioById(activeQuestion.scenarioId)
    : undefined;

  const isCorrect =
    hasSubmitted && selectedOptionId !== null && selectedOptionId === activeQuestion?.correctOptionId;

  const handleSubmit = async () => {
    if (!activeQuestion || !selectedOptionId || hasSubmitted) {
      return;
    }
    setHasSubmitted(true);

    if (selectedOptionId === activeQuestion.correctOptionId) {
      const result = await recordConceptCorrectAttempt(lesson.slug, activeQuestion.conceptKey);
      if (result.suggestMastery && result.concept) {
        setMasteryPromptConcept(result.concept);
      }
    } else {
      await recordConceptStruggle({
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        conceptKey: activeQuestion.conceptKey,
        conceptLabel: lesson.title,
        trigger: 'practice_mistake',
      });
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = (questionIndex + 1) % lesson.practiceQuestions.length;
    setQuestionIndex(nextIdx);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setShowHintIndex(0);
  };

  const handleConfirmMastery = async () => {
    if (!masteryPromptConcept) {
      return;
    }
    await markConceptMastered(masteryPromptConcept.id);
    setMasteryConfirmed(true);
    setMasteryPromptConcept(null);
  };

  if (!activeQuestion) {
    return null;
  }

  const activeMarketMeta = marketMetaMap[lesson.marketCategory];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header & Market-Filtered Lesson Selector */}
      <header className="space-y-4 rounded-2xl border border-terminal-border bg-terminal-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                Practice Mode
              </span>
              {activeMarketMeta && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${MARKET_BADGE_STYLES[lesson.marketCategory]}`}
                >
                  {activeMarketMeta.label}
                </span>
              )}
              {!hasSubmitted && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  Answer Protection Active
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-terminal-text">
              {lesson.title} — Applied Chart Drills
            </h1>
          </div>

          <Link
            to={`/academy/${lesson.slug}`}
            className="rounded-xl border border-terminal-border bg-terminal-elevated px-3.5 py-2 text-xs font-semibold text-sky-600 hover:border-sky-500/50 dark:text-sky-400"
          >
            Review Lesson
          </Link>
        </div>

        {/* Market Category Filter Pills + Lesson Selector */}
        <div className="flex flex-col gap-3 border-t border-terminal-border/70 pt-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filter practice drills by market category"
            className="no-scrollbar flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5"
          >
            <button
              type="button"
              onClick={() => handleSelectMarketFilter('all')}
              aria-pressed={marketFilter === 'all'}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
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
                  onClick={() => handleSelectMarketFilter(category.id)}
                  aria-pressed={isActive}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
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

          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="practice-lesson-select" className="sr-only">
              Select practice lesson
            </label>
            <select
              id="practice-lesson-select"
              name="practiceLesson"
              aria-label="Select practice lesson"
              value={lesson.slug}
              onChange={(event) => navigate(`/practice/${event.target.value}`)}
              className="w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 text-xs font-medium text-terminal-text focus:border-emerald-500 focus:outline-none sm:w-auto sm:min-w-[260px]"
            >
              {filteredLessons.map((item) => (
                <option key={item.id} value={item.slug}>
                  {formatModuleOrder(item.moduleOrder)}. [{marketMetaMap[item.marketCategory]?.shortCode ?? 'GEN'}]{' '}
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Contextual Motivational Quote Strip */}
      <ContextualQuoteStrip
        conceptKey={lesson.conceptKey}
        category="motivate"
        label="Practice Mindset Reminder"
      />

      {/* Mastery Suggestion Banner */}
      {masteryPromptConcept && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4">
          <div className="flex items-start gap-3">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                3 Consecutive Correct Answers on {masteryPromptConcept.conceptLabel}!
              </p>
              <p className="text-xs text-terminal-muted">
                Ready to graduate this topic out of My Difficult Concepts?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleConfirmMastery()}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Mark Concept Mastered
          </button>
        </div>
      )}

      {masteryConfirmed && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-400"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Concept marked as Mastered in your Personal Library!
        </div>
      )}

      {/* Main Practice Workspace */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <section className="space-y-4 rounded-2xl border border-terminal-border bg-terminal-surface p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400 tabular-nums">
                Question {questionIndex + 1} of {lesson.practiceQuestions.length}
              </span>
              <span className="font-mono text-[11px] text-terminal-muted">
                Concept: {activeQuestion.conceptKey}
              </span>
            </div>

            {scenario && (
              <InteractiveCandleChart
                candles={scenario.candles}
                priceLines={scenario.priceLines}
                markers={hasSubmitted ? scenario.markers : []}
                symbol={scenario.symbol}
                timeframe={scenario.timeframe}
                height={300}
                visibleCount={
                  hasSubmitted
                    ? scenario.replay.afterEndIndex + 1
                    : scenario.replay.triggerEndIndex + 1
                }
              />
            )}

            <h2 className="text-base font-semibold leading-snug text-terminal-text">
              {activeQuestion.prompt}
            </h2>

            {/* Options */}
            <div className="space-y-2.5" role="radiogroup" aria-label="Practice question choices">
              {activeQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isRightOption = option.id === activeQuestion.correctOptionId;

                let cardStyle =
                  'border-terminal-border bg-terminal-bg hover:border-emerald-500/40';
                if (hasSubmitted) {
                  if (isRightOption) {
                    cardStyle = 'border-emerald-500 bg-emerald-500/10';
                  } else if (isSelected && !isRightOption) {
                    cardStyle = 'border-rose-500 bg-rose-500/10';
                  }
                } else if (isSelected) {
                  cardStyle = 'border-sky-500 bg-sky-500/10';
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={hasSubmitted}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${cardStyle}`}
                  >
                    <span className="text-terminal-text">{option.label}</span>
                    {hasSubmitted && isRightOption && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    )}
                    {hasSubmitted && isSelected && !isRightOption && (
                      <XCircle className="h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progressive Hints before submission */}
            {!hasSubmitted && activeQuestion.hints.length > 0 && (
              <div className="space-y-2 pt-1">
                {showHintIndex > 0 && (
                  <div className="space-y-1.5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs text-amber-200">
                    {activeQuestion.hints.slice(0, showHintIndex).map((hint, idx) => (
                      <p key={hint}>
                        <strong className="font-mono text-amber-400">Hint {idx + 1}: </strong>
                        {hint}
                      </p>
                    ))}
                  </div>
                )}

                {showHintIndex < activeQuestion.hints.length && (
                  <button
                    type="button"
                    onClick={() => setShowHintIndex((prev) => prev + 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                  >
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Show Hint ({showHintIndex}/{activeQuestion.hints.length})
                  </button>
                )}
              </div>
            )}

            {/* Submit / Next Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-terminal-border pt-4">
              {!hasSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={() => void handleSubmit()}
                  className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:opacity-50"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-400"
                >
                  Next Practice Question
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Post-Submission Rationale */}
            {hasSubmitted && (
              <div
                className={`space-y-2 rounded-xl border p-4 ${
                  isCorrect
                    ? 'border-emerald-500/35 bg-emerald-500/10'
                    : 'border-rose-500/35 bg-rose-500/10'
                }`}
              >
                <p
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    isCorrect ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Correct Read — Solid Execution Logic
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      Not Quite — Logged for Practice Review
                    </>
                  )}
                </p>
                <p className="text-xs leading-relaxed text-terminal-text">
                  {activeQuestion.postSubmissionRationale}
                </p>
                <p className="rounded-lg bg-terminal-bg/80 px-3 py-2 text-xs text-amber-300">
                  <strong className="text-amber-400">Common Trap: </strong>
                  {activeQuestion.commonTrapNote}
                </p>
              </div>
            )}
          </section>

          <ExplainDifferentlyPanel
            lesson={lesson}
            mode="practice"
            activeQuestionId={activeQuestion.id}
            hasSubmittedAnswer={hasSubmitted}
          />
        </div>

        <div className="xl:col-span-4">
          <div className="sticky top-20">
            <AIMentorPanel
              lesson={lesson}
              mode="practice"
              activeQuestionId={activeQuestion.id}
              hasSubmittedAnswer={hasSubmitted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
