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
import type {
  MentorChatMessage,
  MentorCitation,
  MentorResponseSourceType,
} from '../../types/visual-learning';

export interface AIMentorPanelProps {
  lesson: Lesson;
  mode: AppLearningContext;
  activeQuestionId?: string;
  hasSubmittedAnswer?: boolean;
  onSelectCitation?: (citation: MentorCitation) => void;
}

const QUICK_PROMPTS = [
  'Clear confirmation rule?',
  'Common beginner trap?',
  'Stop-loss & risk link?',
];

function renderSourcePill(sourceType: MentorResponseSourceType) {
  if (sourceType === 'ai_mentor_explanation') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-600 dark:text-sky-400">
        <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
        Gemini AI
      </span>
    );
  }
  if (sourceType === 'verified_source') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-bull/35 bg-bull/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-bull">
        <ShieldCheck className="h-2.5 w-2.5" aria-hidden="true" />
        Verified Source
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400">
      Offline Guide
    </span>
  );
}

export function AIMentorPanel({
  lesson,
  mode,
  activeQuestionId,
  hasSubmittedAnswer = false,
  onSelectCitation,
}: AIMentorPanelProps) {
  const [messages, setMessages] = useState<MentorChatMessage[]>([]);
  const [lastUserPromptByReplyId, setLastUserPromptByReplyId] = useState<Record<string, string>>(
    {},
  );
  const [input, setInput] = useState<string>('');
  const [preferLiveGemini, setPreferLiveGemini] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isPracticeGuarded = mode === 'practice' && !hasSubmittedAnswer;

  const sendPrompt = async (promptText: string, forceOnline?: boolean) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) {
      return;
    }

    const useLiveGemini = forceOnline ?? preferLiveGemini;

    if (!forceOnline) {
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
    }

    setLoading(true);
    setError(null);

    try {
      const reply = await askAIMentor({
        lessonSlug: lesson.slug,
        mode,
        userMessage: trimmed,
        activeQuestionId,
        hasSubmittedAnswer,
        preferOnlineAi: useLiveGemini,
      });
      setMessages((prev) => [...prev, reply]);
      setLastUserPromptByReplyId((prev) => ({ ...prev, [reply.id]: trimmed }));
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
      className="flex flex-col overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface"
    >
      {/* Compact 1-Line App Header */}
      <div className="flex items-center justify-between gap-2 border-b border-terminal-border bg-terminal-elevated/50 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/15 text-sky-500 dark:text-sky-400">
            <Bot className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <h3 id="ai-mentor-heading" className="text-xs font-semibold text-terminal-text">
            AI Mentor
          </h3>
          {isPracticeGuarded && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-500 dark:text-amber-400">
              <ShieldAlert className="h-2.5 w-2.5" aria-hidden="true" />
              Hints Only
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setPreferLiveGemini((prev) => !prev)}
          aria-pressed={preferLiveGemini}
          title="Ask Live Gemini online instead of offline quick glossary"
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-colors ${
            preferLiveGemini
              ? 'border-sky-500 bg-sky-500 text-slate-950'
              : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400'
          }`}
        >
          <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
          {preferLiveGemini ? 'Gemini AI: ON' : 'Ask Live Gemini'}
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-1.5 border-b border-terminal-border bg-terminal-bg/40 px-3 py-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => void sendPrompt(prompt)}
            className="rounded-full border border-terminal-border bg-terminal-surface px-2.5 py-1 text-[11px] font-medium text-terminal-muted transition-colors hover:border-sky-500/50 hover:text-sky-500 dark:hover:text-sky-400 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Conversation Stream */}
      <div className="max-h-[380px] space-y-2.5 overflow-y-auto p-3.5">
        {messages.length === 0 && (
          <p className="py-6 text-center text-xs text-terminal-muted">
            Ask anything about{' '}
            <span className="font-medium text-terminal-text">
              {lesson.title.split('(')[0].trim()}
            </span>
            . Instant offline guide + Gemini AI fallback.
          </p>
        )}

        {messages.map((message) => {
          const isUser = message.role === 'user';
          const linkedPrompt = lastUserPromptByReplyId[message.id];

          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1.5 rounded-xl border p-3 ${
                isUser
                  ? 'ml-6 border-terminal-border bg-terminal-elevated/70'
                  : 'mr-1 border-terminal-border bg-terminal-bg'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-terminal-text">
                  {isUser ? (
                    <>
                      <User className="h-3 w-3 text-terminal-muted" aria-hidden="true" />
                      You
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3 text-sky-400" aria-hidden="true" />
                      Mentor
                    </>
                  )}
                </span>

                {!isUser && (
                  <div className="flex items-center gap-1.5">
                    {renderSourcePill(message.sourceType)}
                    {message.sourceType === 'deterministic_fallback' && linkedPrompt && (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => void sendPrompt(linkedPrompt, true)}
                        className="inline-flex items-center gap-1 rounded-full border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-600 transition-colors hover:bg-sky-500 hover:text-slate-950 dark:text-sky-400 disabled:opacity-50"
                      >
                        <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                        Ask Live Gemini
                      </button>
                    )}
                  </div>
                )}
              </div>

              <p className="whitespace-pre-line text-xs leading-relaxed text-terminal-text">
                {message.content}
              </p>

              {!isUser && message.citations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-t border-terminal-border pt-2">
                  {message.citations.map((citation) => (
                    <button
                      key={`${citation.resourceId}-${citation.segmentId ?? citation.startSeconds ?? 'top'}`}
                      type="button"
                      onClick={() => onSelectCitation?.(citation)}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-brand/30 bg-brand-soft px-2.5 py-1 text-left text-[11px] font-medium text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
                    >
                      <Play className="h-2.5 w-2.5 shrink-0 fill-current" aria-hidden="true" />
                      <span className="truncate">{citation.segmentTitle ?? citation.title}</span>
                      {citation.startSeconds !== undefined && (
                        <span className="shrink-0 font-mono text-[10px] opacity-85 tabular-nums">
                          {formatTimestamp(citation.startSeconds)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 px-1 text-xs text-terminal-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" aria-hidden="true" />
            <span>Thinking…</span>
          </div>
        )}

        {error && (
          <p role="alert" className="text-xs text-rose-400">
            {error}
          </p>
        )}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-terminal-border bg-terminal-elevated/40 p-2.5"
      >
        <input
          id="ai-mentor-input"
          name="mentorPrompt"
          aria-label="Ask TradeLab AI Mentor"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={isPracticeGuarded ? 'Ask for a hint…' : 'Ask a question…'}
          className="flex-1 rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text placeholder:text-terminal-muted/70 focus:border-sky-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message to AI Mentor"
          className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-400 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
