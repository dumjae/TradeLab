import { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { EXPLANATION_STYLE_LIST } from '../../data/curriculum';
import { formatTimestamp } from '../../lib/youtubeUtils';
import { requestAlternativeExplanation } from '../../services/aiMentorService';
import { recordConceptStruggle } from '../../services/difficultConceptsService';
import type {
  AppLearningContext,
  ExplanationStyle,
  Lesson,
} from '../../types/academy';
import type {
  ExplainDifferentlyResponse,
  MentorResponseSourceType,
} from '../../types/visual-learning';

export interface ExplainDifferentlyPanelProps {
  lesson: Lesson;
  mode: AppLearningContext;
  activeQuestionId?: string;
  hasSubmittedAnswer?: boolean;
  onJumpToCitation?: (resourceId: string, startSeconds?: number) => void;
}

function renderSourceBadge(sourceType: MentorResponseSourceType) {
  switch (sourceType) {
    case 'verified_source':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-bull/35 bg-bull/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-bull">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Verified Source
        </span>
      );
    case 'ai_mentor_explanation':
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-600 dark:text-sky-400">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Gemini AI
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400">
          Offline Guide
        </span>
      );
  }
}

export function ExplainDifferentlyPanel({
  lesson,
  mode,
  activeQuestionId,
  hasSubmittedAnswer = false,
  onJumpToCitation,
}: ExplainDifferentlyPanelProps) {
  const [selectedStyle, setSelectedStyle] = useState<ExplanationStyle | null>(null);
  const [response, setResponse] = useState<ExplainDifferentlyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedStruggle, setLoggedStruggle] = useState<boolean>(false);

  const isPracticeGuarded = mode === 'practice' && !hasSubmittedAnswer;

  const handleSelectStyle = async (style: ExplanationStyle, preferOnlineAi = false) => {
    setSelectedStyle(style);
    setLoading(true);
    setError(null);
    try {
      const result = await requestAlternativeExplanation({
        lessonSlug: lesson.slug,
        conceptKey: lesson.conceptKey,
        style,
        mode,
        activeQuestionId,
        hasSubmittedAnswer,
        preferOnlineAi,
      });
      setResponse(result);

      if (!loggedStruggle) {
        await recordConceptStruggle({
          lessonId: lesson.id,
          lessonSlug: lesson.slug,
          conceptKey: lesson.conceptKey,
          conceptLabel: lesson.title,
          trigger: 'explain_differently',
        });
        setLoggedStruggle(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load alternative explanation right now.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="explain-differently-heading"
      className="rounded-lg border border-terminal-border bg-terminal-surface p-3.5 sm:p-4"
    >
      {/* Compact 1-Line Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-brand-text" aria-hidden="true" />
          <h3
            id="explain-differently-heading"
            className="text-xs font-semibold text-terminal-text"
          >
            Explain Differently
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {isPracticeGuarded && (
            <span className="inline-flex items-center gap-1 rounded-md border border-caution/35 bg-caution/10 px-2 py-0.5 font-mono text-[10px] font-medium text-caution">
              <ShieldAlert className="h-3 w-3" aria-hidden="true" />
              Hints Only
            </span>
          )}
          {selectedStyle && (
            <button
              type="button"
              disabled={loading}
              onClick={() => void handleSelectStyle(selectedStyle, true)}
              className="tl-press inline-flex items-center gap-1 rounded-md border border-brand/35 bg-brand-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold text-brand-text transition-colors hover:bg-brand hover:text-brand-fg disabled:opacity-50"
            >
              <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
              Ask Live Gemini
            </button>
          )}
        </div>
      </div>

      {/* Compact Lens Pills */}
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {EXPLANATION_STYLE_LIST.map((styleMeta) => {
          const active = selectedStyle === styleMeta.id;
          return (
            <button
              key={styleMeta.id}
              type="button"
              title={styleMeta.description}
              onClick={() => void handleSelectStyle(styleMeta.id, false)}
              disabled={loading}
              className={`tl-press rounded-md border px-3 py-2 text-left text-xs font-medium transition-all ${
                active
                  ? 'border-brand bg-brand-soft text-brand-text'
                  : 'border-terminal-border bg-terminal-bg text-terminal-text hover:border-brand/45'
              }`}
            >
              {styleMeta.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-terminal-border bg-terminal-bg px-3.5 py-3 text-xs text-terminal-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-text" aria-hidden="true" />
          Preparing explanation…
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-3 rounded-md border border-bear/35 bg-bear/10 px-3.5 py-2.5 text-xs text-bear"
        >
          {error}
        </div>
      )}

      {!loading && response && (
        <div className="mt-3 space-y-2.5 rounded-md border border-terminal-border bg-terminal-bg p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold text-terminal-text">{response.headline}</h4>
            <div className="flex flex-wrap items-center gap-1.5">
              {renderSourceBadge(response.sourceType)}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-terminal-text">{response.explanation}</p>

          {response.steps.length > 0 && (
            <ol className="space-y-1.5 pt-0.5">
              {response.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-2 text-xs leading-relaxed text-terminal-text"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-brand/35 bg-brand-soft font-mono text-[10px] font-semibold text-brand-text tabular-nums">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="flex items-start gap-2 rounded-md border-l-2 border-bull bg-bull/10 px-2.5 py-2 text-xs text-terminal-text">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bull" aria-hidden="true" />
            <span>{response.keyTakeaway}</span>
          </div>

          {response.citations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-terminal-border pt-2">
              {response.citations.map((citation) => (
                <button
                  key={`${citation.resourceId}-${citation.segmentId ?? citation.startSeconds ?? 'base'}`}
                  type="button"
                  onClick={() =>
                    onJumpToCitation?.(citation.resourceId, citation.startSeconds)
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-brand/30 bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
                >
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  <span className="truncate">{citation.segmentTitle ?? citation.title}</span>
                  {citation.startSeconds !== undefined && (
                    <span className="font-mono text-[10px] opacity-85 tabular-nums">
                      @{formatTimestamp(citation.startSeconds)}
                    </span>
                  )}
                  <ExternalLink className="h-2.5 w-2.5 opacity-75" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
