import { BookmarkPlus, CheckCircle2, Clock, Play } from 'lucide-react';
import { formatTimestamp } from '../../lib/youtubeUtils';
import type {
  ResourceSegment,
  SegmentVerificationMethod,
} from '../../types/visual-learning';

export interface TimestampNavigatorProps {
  segments: ResourceSegment[];
  activeSegmentId?: string | null;
  onSelectSegment: (segment: ResourceSegment) => void;
  onBookmarkSegment?: (segment: ResourceSegment) => void;
}

const METHOD_LABELS: Record<SegmentVerificationMethod, string> = {
  youtube_chapters: 'Creator Chapters',
  verified_transcript: 'Verified Transcript',
  manual_editorial: 'Editorial Verified',
};

export function TimestampNavigator({
  segments,
  activeSegmentId,
  onSelectSegment,
  onBookmarkSegment,
}: TimestampNavigatorProps) {
  if (segments.length === 0) {
    return (
      <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4 text-xs text-terminal-muted">
        <p className="font-medium text-terminal-text">No verified timestamps published yet</p>
        <p className="mt-1">
          TradeLab never generates guessed timestamps. Watch the full verified resource or check
          back after editorial chapter verification.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-surface">
      <div className="flex items-center justify-between border-b border-terminal-border bg-terminal-elevated/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-terminal-text">
            Verified Key Timestamps
          </h4>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 tabular-nums">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          {segments.length} verified
        </span>
      </div>

      <ul className="divide-y divide-terminal-border">
        {segments.map((segment) => {
          const isActive = activeSegmentId === segment.id;
          const timeRange =
            segment.endSeconds !== null
              ? `${formatTimestamp(segment.startSeconds)} – ${formatTimestamp(segment.endSeconds)}`
              : formatTimestamp(segment.startSeconds);

          return (
            <li
              key={segment.id}
              className={`flex items-start justify-between gap-3 px-4 py-3 transition-colors ${
                isActive ? 'bg-emerald-500/10' : 'hover:bg-terminal-elevated/40'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectSegment(segment)}
                className="flex flex-1 items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md"
              >
                <span
                  className={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 font-mono text-xs font-semibold tabular-nums ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                      : 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                  {timeRange}
                </span>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-terminal-text">
                      {segment.segmentTitle}
                    </span>
                    <span className="rounded border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] text-terminal-muted">
                      {METHOD_LABELS[segment.verificationMethod]}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-terminal-muted">
                    {segment.explanation}
                  </p>
                </div>
              </button>

              {onBookmarkSegment && (
                <button
                  type="button"
                  onClick={() => onBookmarkSegment(segment)}
                  title="Bookmark this timestamp"
                  aria-label={`Bookmark timestamp ${formatTimestamp(segment.startSeconds)} ${segment.segmentTitle}`}
                  className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg border border-terminal-border bg-terminal-elevated px-2.5 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:border-amber-500/50 hover:text-amber-400"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
