import { BookmarkPlus, CheckCircle2, Clock, ExternalLink, Play } from 'lucide-react';
import {
  buildYouTubeWatchUrl,
  formatTimestamp,
  isValidYouTubeVideoId,
} from '../../lib/youtubeUtils';
import type {
  ResourceSegment,
  SegmentVerificationMethod,
} from '../../types/visual-learning';

export interface TimestampNavigatorProps {
  segments: ResourceSegment[];
  activeSegmentId?: string | null;
  externalVideoId?: string | null;
  sourceUrl?: string;
  onSelectSegment: (segment: ResourceSegment) => void;
  onBookmarkSegment?: (segment: ResourceSegment) => void;
}

const METHOD_LABELS: Record<SegmentVerificationMethod, string> = {
  youtube_chapters: 'Creator Chapters',
  verified_transcript: 'Verified Transcript',
  manual_editorial: 'Editorial Verified',
};

function resolveSegmentExternalUrl(
  startSeconds: number,
  externalVideoId?: string | null,
  sourceUrl?: string,
): string | null {
  if (externalVideoId && isValidYouTubeVideoId(externalVideoId)) {
    return buildYouTubeWatchUrl(externalVideoId, startSeconds > 0 ? startSeconds : undefined);
  }
  if (sourceUrl && sourceUrl.startsWith('https://')) {
    return sourceUrl;
  }
  return null;
}

export function TimestampNavigator({
  segments,
  activeSegmentId,
  externalVideoId = null,
  sourceUrl,
  onSelectSegment,
  onBookmarkSegment,
}: TimestampNavigatorProps) {
  if (segments.length === 0) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-terminal-border bg-terminal-surface px-3.5 py-2.5 text-xs text-terminal-muted">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-terminal-muted" aria-hidden="true" />
          No timestamps saved yet — play from start or open on YouTube.
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-terminal-border bg-terminal-surface">
      <div className="flex items-center justify-between border-b border-terminal-border bg-terminal-elevated/40 px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-text">
            Key Timestamps
          </h4>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-500 dark:text-emerald-400 tabular-nums">
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
          {segments.length}
        </span>
      </div>

      <ul className="divide-y divide-terminal-border">
        {segments.map((segment) => {
          const isActive = activeSegmentId === segment.id;
          const timeRange =
            segment.endSeconds !== null
              ? `${formatTimestamp(segment.startSeconds)}–${formatTimestamp(segment.endSeconds)}`
              : formatTimestamp(segment.startSeconds);
          const externalUrl = resolveSegmentExternalUrl(
            segment.startSeconds,
            externalVideoId,
            sourceUrl,
          );

          return (
            <li
              key={segment.id}
              className={`flex items-center justify-between gap-2 px-3 py-2 transition-colors ${
                isActive ? 'bg-emerald-500/10' : 'hover:bg-terminal-elevated/40'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectSegment(segment)}
                className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                      : 'border-emerald-500/35 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  <Play className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                  {timeRange}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-medium text-terminal-text">
                      {segment.segmentTitle}
                    </span>
                    <span
                      title={METHOD_LABELS[segment.verificationMethod]}
                      className="sr-only"
                    >
                      {METHOD_LABELS[segment.verificationMethod]}
                    </span>
                  </div>
                  {segment.explanation && (
                    <p className="truncate text-[11px] text-terminal-muted">
                      {segment.explanation}
                    </p>
                  )}
                </div>
              </button>

              <div className="flex shrink-0 items-center gap-1.5">
                {externalUrl && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${segment.segmentTitle} on YouTube at ${formatTimestamp(segment.startSeconds)}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-sky-500/35 bg-sky-500/10 px-2 py-1 text-[11px] font-semibold text-sky-600 transition-colors hover:bg-sky-500 hover:text-slate-950 dark:text-sky-400"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}

                {onBookmarkSegment && (
                  <button
                    type="button"
                    onClick={() => onBookmarkSegment(segment)}
                    title="Bookmark this timestamp"
                    aria-label={`Bookmark timestamp ${formatTimestamp(segment.startSeconds)} ${segment.segmentTitle}`}
                    className="inline-flex items-center justify-center rounded-lg border border-terminal-border bg-terminal-elevated p-1.5 text-terminal-muted transition-colors hover:border-amber-500/50 hover:text-amber-400"
                  >
                    <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
