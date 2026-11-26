import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  Play,
  ShieldCheck,
  VideoOff,
} from 'lucide-react';
import {
  buildNoCookieEmbedUrl,
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  formatTimestamp,
  isValidYouTubeVideoId,
} from '../../lib/youtubeUtils';
import type { EducationalResource } from '../../types/visual-learning';

export interface LazyVideoPlayerProps {
  resource: EducationalResource;
  startSeconds?: number;
  endSeconds?: number | null;
  seekTriggerKey?: number;
  onPlaybackActivated?: (startSeconds: number) => void;
}

export function LazyVideoPlayer({
  resource,
  startSeconds = 0,
  endSeconds = null,
  seekTriggerKey = 0,
  onPlaybackActivated,
}: LazyVideoPlayerProps) {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [embedError, setEmbedError] = useState<boolean>(false);
  const [thumbFailed, setThumbFailed] = useState<boolean>(false);

  const videoId =
    resource.externalVideoId && isValidYouTubeVideoId(resource.externalVideoId)
      ? resource.externalVideoId
      : null;

  const isUnavailable =
    resource.verificationStatus === 'unavailable' ||
    !resource.embeddable ||
    resource.sourceType !== 'youtube' ||
    !videoId;

  // Activate player only when user explicitly clicks a verified timestamp (seekTriggerKey > 0)
  useEffect(() => {
    if (seekTriggerKey > 0 && !isUnavailable) {
      setEmbedError(false);
      setIsActivated(true);
      onPlaybackActivated?.(startSeconds);
    }
  }, [seekTriggerKey, isUnavailable, startSeconds, onPlaybackActivated]);

  // Reset facade when switching to a different resource
  useEffect(() => {
    setIsActivated(false);
    setEmbedError(false);
    setThumbFailed(false);
  }, [resource.id]);

  const watchUrl = videoId
    ? buildYouTubeWatchUrl(videoId, startSeconds > 0 ? startSeconds : undefined)
    : resource.sourceUrl;

  const youtubeJumpLabel =
    startSeconds > 0
      ? `Watch on YouTube at ${formatTimestamp(startSeconds)}`
      : 'Open on YouTube';

  const thumbnailSrc =
    resource.thumbnailUrl ??
    (videoId ? buildYouTubeThumbnailUrl(videoId, 'hq') : null);

  const embedUrl =
    isActivated && !isUnavailable && !embedError && videoId
      ? buildNoCookieEmbedUrl(
          videoId,
          startSeconds > 0 ? startSeconds : undefined,
          endSeconds ?? undefined,
        )
      : null;

  const handleActivate = () => {
    if (isUnavailable) {
      return;
    }
    setEmbedError(false);
    setIsActivated(true);
    onPlaybackActivated?.(startSeconds);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-terminal-border bg-terminal-surface">
      <div className="relative aspect-video w-full bg-slate-950">
        {isUnavailable || embedError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-5 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
              {resource.verificationStatus === 'unavailable' ? (
                <VideoOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <div className="max-w-sm space-y-1">
              <p className="text-sm font-semibold text-slate-100">
                {resource.sourceType === 'tradelab_original'
                  ? 'TradeLab Original Visual Resource'
                  : resource.verificationStatus === 'unavailable'
                    ? 'Embedded Video Temporarily Unavailable'
                    : 'External Resource Preview'}
              </p>
              <p className="text-xs text-slate-400">
                {resource.sourceType === 'tradelab_original'
                  ? 'Use the Diagram or Historical Chart tabs for this interactive study.'
                  : 'Open this verified link directly in a new tab.'}
              </p>
            </div>
            {resource.sourceType !== 'tradelab_original' && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                Open Original Source
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        ) : embedUrl ? (
          <iframe
            key={`${videoId}-${startSeconds}-${endSeconds ?? 'end'}-${seekTriggerKey}`}
            src={embedUrl}
            title={resource.title}
            className="h-full w-full border-0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => setEmbedError(true)}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={handleActivate}
              aria-label={`Load and play video: ${resource.title}`}
              className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {thumbnailSrc && !thumbFailed ? (
                <img
                  src={thumbnailSrc}
                  alt={`Video thumbnail for ${resource.title}`}
                  loading="lazy"
                  onError={() => setThumbFailed(true)}
                  className="h-full w-full object-cover opacity-75 transition-transform duration-300 group-hover:scale-[1.02] group-hover:opacity-85"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/25" />

              <div className="relative z-10 flex flex-col items-center gap-2.5 px-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/60 transition-transform duration-200 group-hover:scale-105">
                  <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {startSeconds > 0
                    ? `Play at ${formatTimestamp(startSeconds)}`
                    : 'Play Inline'}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-slate-200">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  {resource.sourceName}
                </span>
                {resource.durationSeconds !== null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 font-mono text-[11px] tabular-nums backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-sky-400" aria-hidden="true" />
                    {formatTimestamp(resource.durationSeconds)}
                  </span>
                )}
              </div>
            </button>

            {videoId && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-slate-950/85 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 backdrop-blur-sm transition-colors hover:bg-emerald-500 hover:text-slate-950"
              >
                <span>{youtubeJumpLabel}</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-terminal-border bg-terminal-elevated/40 px-3.5 py-2 text-xs text-terminal-muted">
        <span className="min-w-0 truncate text-[11px]" title={resource.attribution}>
          {resource.sourceName}
          {resource.nonEndorsementNotice ? ' · Educational reference' : ''}
        </span>

        {videoId && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-slate-950 dark:text-emerald-400"
          >
            <span>{youtubeJumpLabel}</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
