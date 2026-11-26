import { useState, type FormEvent } from 'react';
import {
  Bot,
  Loader2,
  Play,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { formatTimestamp } from '../../lib/youtubeUtils';
import { askAIMentor } from '../../services/aiMentorService';
import type { AppLearningContext, Lesson } from '../../types/academy';
import type { MentorChatMessage, MentorCitation } from '../../types/visual-learning';

export interface AIMentorPanelProps {
  lesson: Lesson;
  mode: AppLearningContext;
  activeQuestionId?: string;
  hasSubmittedAnswer?: boolean;
  onSelectCitation?: (citation: MentorCitation) => void;
}

const QUICK_PROMPTS = [
  'What is the single clearest confirmation rule to look for first?',
  'Show me a verified video timestamp for this concept.',
  'What mistake do beginners make most often here?',
  'Explain how this connects to stop-loss placement and risk.',
];

export function AIMentorPanel({
  lesson,
  mode,
  activeQuestionId,
  hasSubmittedAnswer = false,
  onSelectCitation,
}: AIMentorPanelProps) {
  const [messages, setMessages] = useState<MentorChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isPracticeGuarded = mode === 'practice' && !hasSubmittedAnswer;

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) {
      return;
    }

    const userMessage: MentorChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      sourceType: 'ai_mentor_explanation',
      citations: [],
      isPracticeGuardActive: isPracticeGuarded,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const reply = await askAIMentor({
        lessonSlug: lesson.slug,
        mode,
        userMessage: trimmed,
        activeQuestionId,
        hasSubmittedAnswer,
      });
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach AI Mentor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendPrompt(input);
  };

  return (
    <section
      aria-labelledby="ai-mentor-heading"
      className="flex flex-col rounded-2xl border border-terminal-border bg-terminal-surface overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terminal-border bg-terminal-elevated/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-500/35 bg-sky-500/15 text-sky-400">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 id="ai-mentor-heading" className="text-sm font-semibold text-terminal-text">
              TradeLab AI Mentor
            </h3>
            <p className="text-[11px] text-terminal-muted">
              Context-aware for {lesson.title}
            </p>
          </div>
        </div>

        {isPracticeGuarded ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-amber-400">
            <ShieldAlert className="h-3 w-3" aria-hidden="true" />
            Practice Guard: Hints Only
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-emerald-400">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Full Coaching Mode
          </span>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 border-b border-terminal-border bg-terminal-bg/50 px-4 py-2.5">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => void sendPrompt(prompt)}
            className="rounded-lg border border-terminal-border bg-terminal-surface px-2.5 py-1 text-[11px] font-medium text-terminal-muted transition-colors hover:border-sky-500/50 hover:text-sky-400 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Conversation History */}
      <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-terminal-border bg-terminal-bg/50 p-4 text-xs leading-relaxed text-terminal-muted">
            <p className="font-medium text-terminal-text">
              Ask a question about <span className="text-emerald-400">{lesson.title}</span>.
            </p>
            <p className="mt-1">
              Every response clearly distinguishes between{' '}
              <span className="font-mono text-emerald-400">[Verified Source]</span> citations from
              our curated library and{' '}
              <span className="font-mono text-sky-400">[AI Mentor Explanation]</span> coaching.
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex flex-col gap-2 rounded-xl border p-3.5 ${
                isUser
                  ? 'ml-6 border-terminal-border bg-terminal-elevated/70'
                  : 'mr-2 border-terminal-border bg-terminal-bg'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-terminal-text">
                  {isUser ? (
                    <>
                      <User className="h-3.5 w-3.5 text-terminal-muted" aria-hidden="true" />
                      You
                    </>
                  ) : (
                    <>
                      <Bot className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                      AI Mentor
                    </>
                  )}
                </span>

                {!isUser && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {message.sourceType === 'verified_source' ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        Verified Source
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-400">
                        <Bot className="h-3 w-3" aria-hidden="true" />
                        AI Mentor Explanation
                      </span>
                    )}
                    {message.isPracticeGuardActive && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400">
                        No-Spoiler Guard
                      </span>
                    )}
                  </div>
                )}
              </div>

              <p className="whitespace-pre-line text-xs leading-relaxed text-terminal-text">
                {message.content}
              </p>

              {!isUser && message.citations.length > 0 && (
                <div className="space-y-1.5 border-t border-terminal-border pt-2.5">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    Verified Source Citations
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {message.citations.map((citation) => (
                      <button
                        key={`${citation.resourceId}-${citation.segmentId ?? citation.startSeconds ?? 'top'}`}
                        type="button"
                        onClick={() => onSelectCitation?.(citation)}
                        className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-left transition-colors hover:bg-emerald-500/15"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-emerald-300">
                            {citation.segmentTitle ?? citation.title}
                          </p>
                          <p className="truncate text-[11px] text-terminal-muted">
                            {citation.sourceName}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 tabular-nums">
                          <Play className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                          {citation.startSeconds !== undefined
                            ? formatTimestamp(citation.startSeconds)
                            : 'Watch'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-terminal-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" aria-hidden="true" />
            Analyzing curriculum context &amp; verified references...
          </div>
        )}

        {error && (
          <p role="alert" className="text-xs text-rose-400">
            {error}
          </p>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-terminal-border bg-terminal-elevated/40 p-3"
      >
        <label htmlFor="ai-mentor-input" className="sr-only">
          Ask TradeLab AI Mentor
        </label>
        <input
          id="ai-mentor-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            isPracticeGuarded
              ? 'Ask for a concept hint (answers stay protected)...'
              : 'Ask about entries, liquidity, invalidation, or verified timestamps...'
          }
          className="flex-1 rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs text-terminal-text placeholder:text-terminal-muted/70 focus:border-sky-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message to AI Mentor"
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-400 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          Send
        </button>
      </form>
    </section>
  );
}
