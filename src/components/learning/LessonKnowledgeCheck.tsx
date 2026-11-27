import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { expandAcronyms } from '../../lib/acronymHelper';
import type { SyllabusQuizQuestion } from '../../types/curriculum-tree';

export interface LessonKnowledgeCheckProps {
  question: SyllabusQuizQuestion;
  initialPassed?: boolean;
  onResult?: (passed: boolean, scorePct: number) => void;
  compact?: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function LessonKnowledgeCheck({
  question,
  initialPassed = false,
  onResult,
  compact = false,
}: LessonKnowledgeCheckProps) {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hasPassed, setHasPassed] = useState<boolean>(initialPassed);

  useEffect(() => {
    setSelectedIndex(null);
    setSubmitted(false);
    setHasPassed(initialPassed);
  }, [question.prompt, initialPassed]);

  const isCorrect = submitted && selectedIndex === question.correctIndex;

  const handleCheckAnswer = () => {
    if (selectedIndex === null) {
      return;
    }
    const passedNow = selectedIndex === question.correctIndex;
    setSubmitted(true);
    if (passedNow) {
      setHasPassed(true);
    }
    onResult?.(passedNow, passedNow ? 100 : 0);
  };

  const handleTryAgain = () => {
    setSelectedIndex(null);
    setSubmitted(false);
  };

  return (
    <section
      aria-label={t('Lesson Knowledge Check', 'Pagsusulit sa Aralin')}
      className={`rounded-xl border border-terminal-border bg-terminal-surface ${
        compact ? 'p-3.5 sm:p-4' : 'p-4 sm:p-5'
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand/35 bg-brand-soft text-brand-text">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-tight text-terminal-text sm:text-sm">
              {t('Knowledge Check', 'Pagsusulit sa Aralin')}
            </p>
            <p className="text-[11px] text-terminal-muted">
              {t(
                'Select the best answer to confirm your understanding.',
                'Piliin ang tamang sagot upang masigurong naiintindihan ang aralin.',
              )}
            </p>
          </div>
        </div>

        {hasPassed && (
          <span className="inline-flex items-center gap-1 rounded border border-bull/40 bg-bull/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-bull tabular-nums">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            {t('Passed · 100%', 'Pasado · 100%')}
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <p
        className={`mt-3 font-semibold leading-snug text-terminal-text ${
          compact ? 'text-xs sm:text-[13px]' : 'text-sm'
        }`}
      >
        {expandAcronyms(question.prompt)}
      </p>

      {/* 4 Options */}
      <div
        role="group"
        aria-label={t('Quiz answer options', 'Mga pagpipilian sa pagsusulit')}
        className="mt-3 grid grid-cols-1 gap-2"
      >
        {question.options.map((optionText, index) => {
          const letter = OPTION_LETTERS[index] ?? String(index + 1);
          const isSelected = selectedIndex === index;
          const isOptionCorrect = index === question.correctIndex;

          let optionClass =
            'border-terminal-border bg-terminal-bg text-terminal-text hover:border-brand/45 hover:bg-terminal-elevated/70';
          let letterClass =
            'border-terminal-border bg-terminal-surface text-terminal-muted';

          if (!submitted && isSelected) {
            optionClass = 'border-brand bg-brand-soft/60 text-terminal-text';
            letterClass = 'border-brand bg-brand text-brand-fg';
          } else if (submitted && isOptionCorrect) {
            optionClass = 'border-bull bg-bull/15 text-terminal-text';
            letterClass = 'border-bull bg-bull text-slate-950';
          } else if (submitted && isSelected && !isOptionCorrect) {
            optionClass = 'border-bear bg-bear/15 text-terminal-text';
            letterClass = 'border-bear bg-bear text-white';
          }

          return (
            <button
              key={`${letter}-${optionText}`}
              type="button"
              disabled={submitted}
              aria-pressed={isSelected}
              onClick={() => setSelectedIndex(index)}
              className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default sm:text-[13px] ${optionClass}`}
            >
              <span
                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-[11px] font-bold ${letterClass}`}
              >
                {letter}
              </span>
              <span className="flex-1 leading-relaxed">
                {expandAcronyms(optionText)}
              </span>
              {submitted && isOptionCorrect && (
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-bull"
                  aria-hidden="true"
                />
              )}
              {submitted && isSelected && !isOptionCorrect && (
                <XCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-bear"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Bar (before submit) */}
      {!submitted && (
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-terminal-muted">
            {selectedIndex === null
              ? t('Choose one option (A–D) above.', 'Pumili ng isang sagot (A–D) sa itaas.')
              : t(
                  `Selected option ${OPTION_LETTERS[selectedIndex]}. Ready to check.`,
                  `Napili ang ${OPTION_LETTERS[selectedIndex]}. Handa nang i-check.`,
                )}
          </span>
          <button
            type="button"
            disabled={selectedIndex === null}
            onClick={handleCheckAnswer}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-45"
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            {t('Check Answer', 'I-check ang Sagot')}
          </button>
        </div>
      )}

      {/* Result Banner (after submit) */}
      {submitted && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-3.5 space-y-2.5 rounded-lg border p-3.5 ${
            isCorrect
              ? 'border-bull/45 bg-bull/10'
              : 'border-bear/45 bg-bear/10'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-bull" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-bear" aria-hidden="true" />
              )}
              <p
                className={`text-xs font-bold sm:text-[13px] ${
                  isCorrect ? 'text-bull' : 'text-bear'
                }`}
              >
                {isCorrect
                  ? t('Correct! Concept verified.', 'Tama! Naiintindihan mo ang konsepto.')
                  : t(
                      'Not quite right — review the rationale below and try again.',
                      'Mali pa — basahin ang paliwanag sa ibaba at subukan ulit.',
                    )}
              </p>
            </div>

            {!isCorrect && (
              <button
                type="button"
                onClick={handleTryAgain}
                className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                {t('Try Again', 'Subukan Ulit')}
              </button>
            )}
          </div>

          <p className="text-xs leading-relaxed text-terminal-text">
            {expandAcronyms(question.rationale)}
          </p>

          {question.commonTrap && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/35 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-terminal-text">
              <ShieldAlert
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <div>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {t('Common Trap: ', 'Karaniwang Pagkakamali: ')}
                </span>
                <span>{expandAcronyms(question.commonTrap)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
