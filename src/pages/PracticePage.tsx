import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
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
    <div className="mx-auto min-w-0 max-w-7xl space-y-6 tl-page-enter">
      {/* Unboxed Editorial Header & Market-Filtered Lesson Selector */}
      <header className="space-y-4 border-b border-terminal-border pb-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-terminal-muted">
              <span className="font-medium uppercase tracking-[0.06em]">Practice Mode</span>
              {activeMarketMeta && (
                <>
                  <span aria-hidden="true" className="opacity-40">
                    ·
                  </span>
                  <span>{activeMarketMeta.label}</span>
                </>
              )}
              {!hasSubmitted && (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-3 w-3" aria-hidden="true" />
                  Answer Protection Active
                </span>
              )}
            </div>
            <h1 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text text-balance sm:text-[1.75rem]">
              {lesson.title} — Applied Chart Drills
            </h1>
          </div>

          <Link
            to={`/academy/${lesson.slug}`}
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border border-terminal-border bg-terminal-surface px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:bg-terminal-elevated tl-press"
          >
            Review Lesson
          </Link>
        </div>

        {/* Market Category Filter Strip + Lesson Selector */}
        <div className="flex flex-col gap-3 pt-1 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filter practice drills by market category"
            className="no-scrollbar flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5"
          >
            <button
              type="button"
              onClick={() => handleSelectMarketFilter('all')}
              aria-pressed={marketFilter === 'all'}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1 text-xs transition-colors tl-press ${
                marketFilter === 'all'
                  ? 'border-brand bg-brand font-semibold text-brand-fg'
                  : 'border-terminal-border bg-transparent text-terminal-muted hover:border-brand/40 hover:bg-terminal-surface hover:text-terminal-text'
              }`}
            >
              <span>All</span>
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
                  onClick={() => handleSelectMarketFilter(category.id)}
                  aria-pressed={isActive}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1 text-xs transition-colors tl-press ${
                    isActive
                      ? 'border-brand bg-brand font-semibold text-brand-fg'
                      : 'border-terminal-border bg-transparent text-terminal-muted hover:border-brand/40 hover:bg-terminal-surface hover:text-terminal-text'
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

          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <label htmlFor="practice-lesson-select" className="sr-only">
              Select practice lesson
            </label>
            <select
              id="practice-lesson-select"
              name="practiceLesson"
              aria-label="Select practice lesson"
              value={lesson.slug}
              onChange={(event) => navigate(`/practice/${event.target.value}`)}
              className="w-full min-w-0 rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-xs font-medium text-terminal-text focus:border-brand focus:outline-none sm:w-auto sm:min-w-[260px]"
            >
              {filteredLessons.map((item) => (
                <option key={item.id} value={item.slug}>
                  {formatModuleOrder(item.moduleOrder)}. [
                  {marketMetaMap[item.marketCategory]?.shortCode ?? 'GEN'}] {item.title}
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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-bull/40 bg-bull/10 px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-bull" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-terminal-text">
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
            className="shrink-0 rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 tl-press"
          >
            Mark Concept Mastered
          </button>
        </div>
      )}

      {masteryConfirmed && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-md border border-bull/35 bg-bull/10 px-4 py-3 text-xs font-semibold text-bull"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Concept marked as Mastered in your Personal Library!
        </div>
      )}

      {/* Main Practice Workspace */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 space-y-6 xl:col-span-8">
          <section className="space-y-4 rounded-lg border border-terminal-border bg-terminal-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terminal-border pb-3">
              <span className="font-mono text-xs font-semibold text-brand-text tabular-nums">
                Question {questionIndex + 1} of {lesson.practiceQuestions.length}
              </span>
              <span className="font-mono text-[11px] text-terminal-muted">
                Concept: {activeQuestion.conceptKey}
              </span>
            </div>

            {scenario && (
              <div className="min-w-0">
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
              </div>
            )}

            <h2 className="max-w-[66ch] text-base font-semibold leading-snug text-terminal-text">
              {activeQuestion.prompt}
            </h2>

            {/* Options */}
            <div className="space-y-2.5" role="radiogroup" aria-label="Practice question choices">
              {activeQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isRightOption = option.id === activeQuestion.correctOptionId;

                let cardStyle =
                  'border-terminal-border bg-terminal-bg hover:border-brand/45 hover:bg-terminal-elevated/50';
                if (hasSubmitted) {
                  if (isRightOption) {
                    cardStyle = 'border-bull bg-bull/10';
                  } else if (isSelected && !isRightOption) {
                    cardStyle = 'border-bear bg-bear/10';
                  }
                } else if (isSelected) {
                  cardStyle = 'border-brand bg-brand-soft';
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={hasSubmitted}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default tl-press ${cardStyle}`}
                  >
                    <span className="text-terminal-text">{option.label}</span>
                    {hasSubmitted && isRightOption && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-bull" aria-hidden="true" />
                    )}
                    {hasSubmitted && isSelected && !isRightOption && (
                      <XCircle className="h-4 w-4 shrink-0 text-bear" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progressive Hints before submission */}
            {!hasSubmitted && activeQuestion.hints.length > 0 && (
              <div className="space-y-2 pt-1">
                {showHintIndex > 0 && (
                  <div className="space-y-1.5 border-l-2 border-amber-500/50 pl-3.5 text-xs text-terminal-text">
                    {activeQuestion.hints.slice(0, showHintIndex).map((hint, idx) => (
                      <p key={hint} className="leading-relaxed">
                        <strong className="font-mono text-amber-600 dark:text-amber-400">
                          Hint {idx + 1}:{' '}
                        </strong>
                        {hint}
                      </p>
                    ))}
                  </div>
                )}

                {showHintIndex < activeQuestion.hints.length && (
                  <button
                    type="button"
                    onClick={() => setShowHintIndex((prev) => prev + 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 transition-colors hover:underline dark:text-amber-400"
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
                  className="rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 tl-press"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 tl-press"
                >
                  Next Practice Question
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Post-Submission Rationale */}
            {hasSubmitted && (
              <div
                className={`space-y-2 rounded-md border p-4 ${
                  isCorrect
                    ? 'border-bull/35 bg-bull/10'
                    : 'border-bear/35 bg-bear/10'
                }`}
              >
                <p
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    isCorrect ? 'text-bull' : 'text-bear'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      Correct Read — Solid Execution Logic
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      Not Quite — Logged for Practice Review
                    </>
                  )}
                </p>
                <p className="max-w-[65ch] text-xs leading-relaxed text-terminal-text">
                  {activeQuestion.postSubmissionRationale}
                </p>
                <p className="border-l-2 border-amber-500/50 pl-3 text-xs leading-relaxed text-terminal-muted">
                  <strong className="font-semibold text-amber-600 dark:text-amber-400">
                    Common Trap:{' '}
                  </strong>
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

        <div className="min-w-0 xl:col-span-4">
          <div className="xl:sticky xl:top-20">
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
