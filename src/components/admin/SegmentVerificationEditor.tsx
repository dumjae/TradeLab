import { useState, type FormEvent } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { formatTimestamp, parseTimestampToSeconds } from '../../lib/youtubeUtils';
import type {
  CreateSegmentInput,
  ResourceSegment,
  SegmentVerificationMethod,
} from '../../types/visual-learning';

export interface SegmentVerificationEditorProps {
  resourceId: string;
  segments: ResourceSegment[];
  onAddSegment: (input: CreateSegmentInput) => Promise<void>;
  onDeleteSegment: (segmentId: string) => Promise<void>;
}

const VERIFICATION_METHODS: Array<{ id: SegmentVerificationMethod; label: string }> = [
  { id: 'manual_editorial', label: 'Manual Editorial Watch' },
  { id: 'youtube_chapters', label: 'YouTube Creator Chapters' },
  { id: 'verified_transcript', label: 'Verified Transcript Match' },
];

export function SegmentVerificationEditor({
  resourceId,
  segments,
  onAddSegment,
  onDeleteSegment,
}: SegmentVerificationEditorProps) {
  const [startText, setStartText] = useState<string>('');
  const [endText, setEndText] = useState<string>('');
  const [segmentTitle, setSegmentTitle] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [verificationMethod, setVerificationMethod] =
    useState<SegmentVerificationMethod>('manual_editorial');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const startSeconds = parseTimestampToSeconds(startText);
    if (startSeconds === null) {
      setError('Enter a valid start timestamp in MM:SS or H:MM:SS format (e.g., 02:15).');
      return;
    }

    let endSeconds: number | null = null;
    if (endText.trim()) {
      const parsedEnd = parseTimestampToSeconds(endText);
      if (parsedEnd === null || parsedEnd <= startSeconds) {
        setError('Optional end timestamp must be valid MM:SS and greater than start time.');
        return;
      }
      endSeconds = parsedEnd;
    }

    if (!segmentTitle.trim() || !explanation.trim()) {
      setError('Both a segment title and educational explanation are required.');
      return;
    }

    setSubmitting(true);
    try {
      await onAddSegment({
        resourceId,
        startSeconds,
        endSeconds,
        segmentTitle: segmentTitle.trim(),
        explanation: explanation.trim(),
        verificationMethod,
      });
      setStartText('');
      setEndText('');
      setSegmentTitle('');
      setExplanation('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-terminal-border bg-terminal-bg/80 p-3.5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Verified Segments ({segments.length})
        </span>
        <span className="text-[11px] text-terminal-muted">
          Zero guessed timestamps — verify before adding
        </span>
      </div>

      {segments.length > 0 && (
        <ul className="space-y-1.5">
          {segments.map((segment) => (
            <li
              key={segment.id}
              className="flex items-start justify-between gap-2 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-2"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                    {formatTimestamp(segment.startSeconds)}
                    {segment.endSeconds !== null
                      ? `–${formatTimestamp(segment.endSeconds)}`
                      : ''}
                  </span>
                  <span className="text-xs font-semibold text-terminal-text">
                    {segment.segmentTitle}
                  </span>
                  <span className="rounded border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] text-terminal-muted">
                    {segment.verificationMethod}
                  </span>
                </div>
                <p className="text-[11px] text-terminal-muted">{segment.explanation}</p>
              </div>
              <button
                type="button"
                onClick={() => void onDeleteSegment(segment.id)}
                aria-label={`Delete segment ${segment.segmentTitle}`}
                className="rounded p-1 text-terminal-muted transition-colors hover:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2 border-t border-terminal-border pt-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input
            id={`segment-start-${resourceId}`}
            name="segmentStart"
            type="text"
            value={startText}
            onChange={(event) => setStartText(event.target.value)}
            placeholder="Start (02:15)"
            aria-label="Segment start timestamp"
            className="rounded-lg border border-terminal-border bg-terminal-surface px-2.5 py-1.5 font-mono text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
          />
          <input
            id={`segment-end-${resourceId}`}
            name="segmentEnd"
            type="text"
            value={endText}
            onChange={(event) => setEndText(event.target.value)}
            placeholder="End (optional)"
            aria-label="Segment end timestamp"
            className="rounded-lg border border-terminal-border bg-terminal-surface px-2.5 py-1.5 font-mono text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
          />
          <select
            id={`segment-method-${resourceId}`}
            aria-label="Segment verification method"
            value={verificationMethod}
            onChange={(event) =>
              setVerificationMethod(event.target.value as SegmentVerificationMethod)
            }
            className="col-span-2 rounded-lg border border-terminal-border bg-terminal-surface px-2.5 py-1.5 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
          >
            {VERIFICATION_METHODS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            id={`segment-title-${resourceId}`}
            name="segmentTitle"
            type="text"
            value={segmentTitle}
            onChange={(event) => setSegmentTitle(event.target.value)}
            placeholder="Verified segment title"
            aria-label="Segment title"
            className="rounded-lg border border-terminal-border bg-terminal-surface px-2.5 py-1.5 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
          />
          <input
            id={`segment-explanation-${resourceId}`}
            name="segmentExplanation"
            type="text"
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            placeholder="What concept is visually shown here?"
            aria-label="Segment explanation"
            className="rounded-lg border border-terminal-border bg-terminal-surface px-2.5 py-1.5 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-[11px] text-rose-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-fg transition-colors hover:brightness-110 disabled:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {submitting ? 'Adding...' : 'Add Verified Timestamp'}
        </button>
      </form>
    </div>
  );
}
