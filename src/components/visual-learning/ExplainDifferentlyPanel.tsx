import { useState } from 'react';
import {
  Bot,
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
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Verified Source
        </span>
      );
    case 'ai_mentor_explanation':
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/35 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-sky-400">
          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
          AI Mentor Explanation
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-400">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Curated Explanation
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

  const handleSelectStyle = async (style: ExplanationStyle) => {
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
      className="rounded-2xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <h3
              id="explain-differently-heading"
              className="text-sm font-semibold text-terminal-text"
            >
              Still Confused? Explain This Concept Differently
            </h3>
          </div>
          <p className="text-xs text-terminal-muted">
            Pick an explanation lens below. Using this tool automatically tracks the topic in{' '}
            <span className="font-medium text-amber-400">My Difficult Concepts</span> so you can
            review it later.
          </p>
        </div>

        {isPracticeGuarded && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-medium text-amber-400">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Practice Mode Guard Active
          </span>
        )}
      </div>

      {isPracticeGuarded && (
        <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
          Answer-protection is active until you submit your practice answer. Explanations will
          teach the underlying principle and give hints without revealing the correct choice.
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {EXPLANATION_STYLE_LIST.map((styleMeta) => {
          const active = selectedStyle === styleMeta.id;
          return (
            <button
              key={styleMeta.id}
              type="button"
              onClick={() => handleSelectStyle(styleMeta.id)}
              disabled={loading}
              className={`rounded-xl border p-3 text-left transition-all ${
                active
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-terminal-border bg-terminal-bg hover:border-emerald-500/40'
              }`}
            >
              <p
                className={`text-xs font-semibold ${
                  active ? 'text-emerald-400' : 'text-terminal-text'
                }`}
              >
                {styleMeta.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-terminal-muted">
                {styleMeta.description}
              </p>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-terminal-border bg-terminal-bg px-4 py-4 text-xs text-terminal-muted">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" aria-hidden="true" />
          Preparing tailored explanation...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-xs text-rose-300"
        >
          {error}
        </div>
      )}

      {!loading && response && (
        <div className="mt-4 space-y-3 rounded-xl border border-terminal-border bg-terminal-bg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-terminal-text">{response.headline}</h4>
            <div className="flex flex-wrap items-center gap-2">
              {renderSourceBadge(response.sourceType)}
              {response.isPracticeGuardActive && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400">
                  Hint-Only Mode
                </span>
              )}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-terminal-text">{response.explanation}</p>

          {response.steps.length > 0 && (
            <ol className="space-y-2 pt-1">
              {response.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-terminal-text"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-emerald-500/35 bg-emerald-500/10 font-mono text-[11px] font-semibold text-emerald-400 tabular-nums">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            <span>
              <strong className="text-emerald-400">Takeaway: </strong>
              {response.keyTakeaway}
            </span>
          </div>

          {response.citations.length > 0 && (
            <div className="space-y-2 border-t border-terminal-border pt-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Verified Video References
              </p>
              <div className="flex flex-wrap gap-2">
                {response.citations.map((citation) => (
                  <button
                    key={`${citation.resourceId}-${citation.segmentId ?? citation.startSeconds ?? 'base'}`}
                    type="button"
                    onClick={() =>
                      onJumpToCitation?.(citation.resourceId, citation.startSeconds)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    <span>{citation.segmentTitle ?? citation.title}</span>
                    {citation.startSeconds !== undefined && (
                      <span className="font-mono text-[11px] text-emerald-400 tabular-nums">
                        @{formatTimestamp(citation.startSeconds)}
                      </span>
                    )}
                    <ExternalLink className="h-3 w-3 opacity-75" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
