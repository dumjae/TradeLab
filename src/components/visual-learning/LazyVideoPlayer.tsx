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
    <div className="overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface">
      <div className="relative aspect-video w-full bg-slate-950">
        {isUnavailable || embedError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
              {resource.verificationStatus === 'unavailable' ? (
                <VideoOff className="h-6 w-6" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
            <div className="max-w-md space-y-1">
              <p className="text-sm font-semibold text-slate-100">
                {resource.sourceType === 'tradelab_original'
                  ? 'TradeLab Original Visual Resource'
                  : resource.verificationStatus === 'unavailable'
                    ? 'Embedded Video Temporarily Unavailable'
                    : 'External Resource Preview'}
              </p>
              <p className="text-xs leading-relaxed text-slate-400">
                {resource.sourceType === 'tradelab_original'
                  ? 'Explore the interactive Diagram Explanation and Historical Chart Example tabs for this TradeLab original study.'
                  : 'This educator resource cannot be embedded inline right now. Open the verified source directly in a new tab.'}
              </p>
            </div>
            {resource.sourceType !== 'tradelab_original' && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
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

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/30" />

            <div className="relative z-10 flex flex-col items-center gap-3 px-4 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/60 transition-transform duration-200 group-hover:scale-105">
                <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  {startSeconds > 0
                    ? `Load Video at ${formatTimestamp(startSeconds)}`
                    : 'Click to Load Video Player'}
                </p>
                <p className="text-xs text-slate-300">
                  Privacy-enhanced YouTube embed · Zero autoplay
                </p>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950/85 px-2.5 py-1 font-medium backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                {resource.sourceName}
              </span>
              {resource.durationSeconds !== null && (
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/85 px-2 py-1 font-mono text-[11px] tabular-nums backdrop-blur-sm">
                  <Clock className="h-3 w-3 text-sky-400" aria-hidden="true" />
                  {formatTimestamp(resource.durationSeconds)}
                </span>
              )}
            </div>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-terminal-border bg-terminal-elevated/50 px-3.5 py-2 text-xs text-terminal-muted">
        <span>{resource.attribution}</span>
        {resource.nonEndorsementNotice && (
          <span className="text-[11px] text-amber-400/90">
            Educational reference only · No affiliation or endorsement implied
          </span>
        )}
      </div>
    </div>
  );
}
