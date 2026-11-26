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
import { CURRICULUM_LESSONS, getLessonBySlug } from '../data/curriculum';
import {
  markConceptMastered,
  recordConceptCorrectAttempt,
  recordConceptStruggle,
} from '../services/difficultConceptsService';
import type { UserDifficultConcept } from '../types/visual-learning';

export function PracticePage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const lesson = useMemo(
    () => (slug ? getLessonBySlug(slug) : undefined) ?? CURRICULUM_LESSONS[0],
    [slug],
  );

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(0);
  const [masteryPromptConcept, setMasteryPromptConcept] =
    useState<UserDifficultConcept | null>(null);
  const [masteryConfirmed, setMasteryConfirmed] = useState<boolean>(false);

  useEffect(() => {
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setShowHintIndex(0);
    setMasteryPromptConcept(null);
    setMasteryConfirmed(false);
  }, [lesson.slug]);

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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header & Lesson Selector */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-terminal-border bg-terminal-surface p-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              Practice Mode
            </span>
            {!hasSubmitted && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-amber-400">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                Answer Protection Active
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-terminal-text">
            {lesson.title} — Applied Chart Drills
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="practice-lesson-select" className="sr-only">
            Select practice lesson
          </label>
          <select
            id="practice-lesson-select"
            value={lesson.slug}
            onChange={(event) => navigate(`/practice/${event.target.value}`)}
            className="rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 text-xs font-medium text-terminal-text focus:border-emerald-500 focus:outline-none"
          >
            {CURRICULUM_LESSONS.map((item) => (
              <option key={item.id} value={item.slug}>
                0{item.moduleOrder}. {item.title}
              </option>
            ))}
          </select>

          <Link
            to={`/academy/${lesson.slug}`}
            className="rounded-xl border border-terminal-border bg-terminal-elevated px-3.5 py-2 text-xs font-semibold text-sky-400 hover:border-sky-500/50"
          >
            Review Lesson
          </Link>
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
