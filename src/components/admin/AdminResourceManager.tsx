import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Link2,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CURRICULUM_LESSONS } from '../../data/curriculum';
import {
  extractYouTubeTimestampFromUrl,
  formatTimestamp,
  parseTimestampToSeconds,
} from '../../lib/youtubeUtils';
import {
  addVerifiedSegment,
  createAdminResource,
  deleteSegment,
  fetchUrlMetadata,
  listAdminResources,
  runLessonDiscovery,
  runResourcesHealthCheck,
  updateResourceStatus,
  type UrlMetadataResult,
} from '../../services/adminResourcesService';
import type {
  CreateSegmentInput,
  DiscoveryCandidate,
  LessonResourceWithDetails,
  ResourceContentType,
  ResourceSourceType,
  VerificationStatus,
} from '../../types/visual-learning';
import { SegmentVerificationEditor } from './SegmentVerificationEditor';

const STATUS_OPTIONS: Array<{ id: VerificationStatus | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'verified', label: 'Verified' },
  { id: 'pending_review', label: 'Pending' },
  { id: 'unavailable', label: 'Unavailable' },
  { id: 'archived', label: 'Archived' },
];

const WORKFLOW_BUTTONS: Array<{ status: VerificationStatus; label: string; tone: string }> = [
  {
    status: 'published',
    label: 'Published',
    tone: 'border-emerald-500/35 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500/15',
  },
  {
    status: 'verified',
    label: 'Verified',
    tone: 'border-sky-500/35 text-sky-500 dark:text-sky-400 hover:bg-sky-500/15',
  },
  {
    status: 'pending_review',
    label: 'Pending',
    tone: 'border-amber-500/35 text-amber-500 dark:text-amber-400 hover:bg-amber-500/15',
  },
  {
    status: 'unavailable',
    label: 'Unavailable',
    tone: 'border-rose-500/35 text-rose-500 dark:text-rose-400 hover:bg-rose-500/15',
  },
  {
    status: 'archived',
    label: 'Archived',
    tone: 'border-terminal-border text-terminal-muted hover:bg-terminal-elevated',
  },
];

function parseFlexibleTimestampInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const mmss = parseTimestampToSeconds(trimmed);
  if (mmss !== null) {
    return mmss;
  }
  if (/^\d+s?$/i.test(trimmed)) {
    const numeric = Number.parseInt(trimmed.replace(/s$/i, ''), 10);
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
  }
  return null;
}

export function AdminResourceManager() {
  const [searchParams] = useSearchParams();
  const requestedLessonSlug = searchParams.get('lesson');
  const matchedInitialSlug =
    CURRICULUM_LESSONS.find((lesson) => lesson.slug === requestedLessonSlug)?.slug ??
    CURRICULUM_LESSONS[0]?.slug ??
    'market-structure';

  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [resources, setResources] = useState<LessonResourceWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Manual URL Curation state
  const [rawUrl, setRawUrl] = useState<string>('');
  const [startTimestamp, setStartTimestamp] = useState<string>('');
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);
  const [metadataResult, setMetadataResult] = useState<UrlMetadataResult | null>(null);

  const [lessonSlug, setLessonSlug] = useState<string>(matchedInitialSlug);
  const [title, setTitle] = useState<string>('');
  const [sourceName, setSourceName] = useState<string>('');
  const [sourceType, setSourceType] = useState<ResourceSourceType>('youtube');
  const [contentType, setContentType] = useState<ResourceContentType>('video');
  const [description, setDescription] = useState<string>('');
  const [attribution, setAttribution] = useState<string>('');
  const [beforeWatchContext, setBeforeWatchContext] = useState<string>('');
  const [takeawaysText, setTakeawaysText] = useState<string>('');
  const [initialStatus, setInitialStatus] = useState<VerificationStatus>('published');
  const [savingResource, setSavingResource] = useState<boolean>(false);

  // Discovery Runner state
  const [discoveryLessonSlug, setDiscoveryLessonSlug] = useState<string>(matchedInitialSlug);
  const [discoveryQuery, setDiscoveryQuery] = useState<string>('');
  const [discoveryLoading, setDiscoveryLoading] = useState<boolean>(false);
  const [discoveryCandidates, setDiscoveryCandidates] = useState<DiscoveryCandidate[]>([]);
  const [discoveryNote, setDiscoveryNote] = useState<string | null>(null);

  // Health Check & segment editor state
  const [healthLoading, setHealthLoading] = useState<boolean>(false);
  const [expandedSegmentsId, setExpandedSegmentsId] = useState<string | null>(null);

  useEffect(() => {
    if (
      requestedLessonSlug &&
      CURRICULUM_LESSONS.some((lesson) => lesson.slug === requestedLessonSlug)
    ) {
      setLessonSlug(requestedLessonSlug);
      setDiscoveryLessonSlug(requestedLessonSlug);
    }
  }, [requestedLessonSlug]);

  const loadResources = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listAdminResources(statusFilter);
      setResources(items);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void loadResources();
  }, [loadResources]);

  const handleUrlInputChange = (nextUrl: string) => {
    setRawUrl(nextUrl);
    const extractedSeconds = extractYouTubeTimestampFromUrl(nextUrl);
    if (extractedSeconds !== null && extractedSeconds > 0) {
      setStartTimestamp(formatTimestamp(extractedSeconds));
    }
  };

  const handleLookupMetadata = async () => {
    if (!rawUrl.trim()) {
      return;
    }
    setLookupLoading(true);
    setBannerMessage(null);
    try {
      const extractedSeconds = extractYouTubeTimestampFromUrl(rawUrl.trim());
      if (extractedSeconds !== null && extractedSeconds > 0 && !startTimestamp.trim()) {
        setStartTimestamp(formatTimestamp(extractedSeconds));
      }

      const result = await fetchUrlMetadata(rawUrl.trim());
      setMetadataResult(result);
      if (result.valid) {
        setTitle(result.title);
        setSourceName(result.sourceName);
        setSourceType(result.sourceType);
        setContentType(result.sourceType === 'youtube' ? 'video' : 'chart_example');
        setAttribution(result.attribution);
        if (!description.trim()) {
          setDescription(`Curated visual clip from ${result.sourceName}.`);
        }
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCreateResource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const targetLesson =
      CURRICULUM_LESSONS.find((l) => l.slug === lessonSlug) ?? CURRICULUM_LESSONS[0];
    if (!targetLesson || !rawUrl.trim() || !title.trim() || !sourceName.trim()) {
      setBannerMessage('Provide a valid URL, title, and creator name.');
      return;
    }

    setSavingResource(true);
    try {
      const detectedSegments: Array<Omit<CreateSegmentInput, 'resourceId'>> =
        metadataResult?.detectedChapters.map((chapter) => ({
          startSeconds: chapter.startSeconds,
          endSeconds: chapter.endSeconds,
          segmentTitle: chapter.segmentTitle,
          explanation: `Creator chapter · ${sourceName.trim()}`,
          verificationMethod: 'youtube_chapters' as const,
        })) ?? [];

      const parsedStartSeconds =
        parseFlexibleTimestampInput(startTimestamp) ??
        extractYouTubeTimestampFromUrl(rawUrl.trim());

      if (
        parsedStartSeconds !== null &&
        parsedStartSeconds >= 0 &&
        !detectedSegments.some((seg) => seg.startSeconds === parsedStartSeconds)
      ) {
        detectedSegments.unshift({
          startSeconds: parsedStartSeconds,
          endSeconds: null,
          segmentTitle: `${targetLesson.title.split('(')[0].trim()} Timestamp`,
          explanation:
            beforeWatchContext.trim() || `Jump straight to ${formatTimestamp(parsedStartSeconds)}.`,
          verificationMethod: 'manual_editorial',
        });
      }

      const afterWatchTakeaways = takeawaysText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      await createAdminResource(
        {
          lessonId: targetLesson.id,
          lessonSlug: targetLesson.slug,
          title: title.trim(),
          description: description.trim() || `Visual guide for ${targetLesson.title}.`,
          sourceType,
          sourceName: sourceName.trim(),
          sourceUrl: metadataResult?.normalizedUrl || rawUrl.trim(),
          externalVideoId: metadataResult?.externalVideoId ?? null,
          thumbnailUrl: metadataResult?.thumbnailUrl ?? null,
          durationSeconds: metadataResult?.durationSeconds ?? null,
          contentType,
          attribution:
            attribution.trim() || `Video by ${sourceName.trim()} on YouTube.`,
          nonEndorsementNotice: sourceType !== 'tradelab_original',
          verificationStatus: initialStatus,
          embeddable: metadataResult?.embeddable ?? sourceType === 'youtube',
          beforeWatchContext: beforeWatchContext.trim(),
          afterWatchTakeaways,
        },
        detectedSegments,
      );

      setRawUrl('');
      setStartTimestamp('');
      setTitle('');
      setSourceName('');
      setDescription('');
      setAttribution('');
      setBeforeWatchContext('');
      setTakeawaysText('');
      setMetadataResult(null);
      setBannerMessage(`Saved "${title.trim()}" (${initialStatus}) to /${targetLesson.slug}.`);
      await loadResources();
    } finally {
      setSavingResource(false);
    }
  };

  const handleRunDiscovery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDiscoveryLoading(true);
    setDiscoveryNote(null);
    try {
      const result = await runLessonDiscovery(discoveryLessonSlug, discoveryQuery);
      setDiscoveryCandidates(result.candidates);
      setDiscoveryNote(
        result.message ??
          `${result.candidates.length} candidate(s) loaded (${result.cached ? 'cached' : 'fresh'}).`,
      );
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const handleImportCandidate = (candidate: DiscoveryCandidate) => {
    setRawUrl(candidate.sourceUrl);
    setLessonSlug(discoveryLessonSlug);
    setTitle(candidate.title);
    setSourceName(candidate.channelTitle);
    setSourceType('youtube');
    setContentType('video');
    setDescription(candidate.description.slice(0, 220));
    setAttribution(`Video by ${candidate.channelTitle} on YouTube.`);
    const extractedSeconds = extractYouTubeTimestampFromUrl(candidate.sourceUrl);
    if (extractedSeconds !== null && extractedSeconds > 0) {
      setStartTimestamp(formatTimestamp(extractedSeconds));
    }
    setMetadataResult({
      valid: true,
      sourceType: 'youtube',
      normalizedUrl: candidate.sourceUrl,
      externalVideoId: candidate.externalVideoId,
      title: candidate.title,
      sourceName: candidate.channelTitle,
      thumbnailUrl: candidate.thumbnailUrl,
      durationSeconds: candidate.durationSeconds,
      embeddable: candidate.embeddable,
      detectedChapters: candidate.detectedChapters,
      attribution: `Video by ${candidate.channelTitle} on YouTube.`,
    });
    setBannerMessage('Candidate loaded above. Set timestamp and save to publish.');
  };

  const handleHealthCheck = async () => {
    setHealthLoading(true);
    try {
      const report = await runResourcesHealthCheck();
      setBannerMessage(
        `${report.note} (Checked: ${report.checked}, Unavailable: ${report.markedUnavailable})`,
      );
      await loadResources();
    } finally {
      setHealthLoading(false);
    }
  };

  const handleStatusChange = async (resourceId: string, nextStatus: VerificationStatus) => {
    await updateResourceStatus({ resourceId, verificationStatus: nextStatus });
    setBannerMessage(`Status updated to "${nextStatus}".`);
    await loadResources();
  };

  const handleAddSegment = async (input: CreateSegmentInput) => {
    await addVerifiedSegment(input);
    await loadResources();
  };

  const handleDeleteSegment = async (segmentId: string) => {
    await deleteSegment(segmentId);
    await loadResources();
  };

  return (
    <div className="space-y-5">
      {bannerMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Paste YouTube Link & Timestamp Form */}
      <section className="rounded-2xl border border-terminal-border bg-terminal-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-terminal-text">
              <Link2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              Paste YouTube Link
            </h2>
            <p className="mt-0.5 text-xs text-terminal-muted">
              Link directly to YouTube timestamps — zero downloads.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleHealthCheck()}
            disabled={healthLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/35 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400 disabled:opacity-60"
          >
            {healthLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Health Check
          </button>
        </div>

        <form onSubmit={handleCreateResource} className="mt-4 space-y-3.5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="admin-resource-url"
              name="resourceUrl"
              aria-label="Educational resource URL"
              type="url"
              required
              value={rawUrl}
              onChange={(event) => handleUrlInputChange(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=...&t=2m15s"
              className="flex-1 rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void handleLookupMetadata()}
              disabled={lookupLoading || !rawUrl.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-slate-950 dark:text-emerald-400 disabled:opacity-50"
            >
              {lookupLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Auto-Fill
            </button>
          </div>

          {metadataResult && (
            <div
              className={`rounded-xl border px-3 py-2 text-xs ${
                metadataResult.valid
                  ? 'border-sky-500/35 bg-sky-500/5 text-sky-600 dark:text-sky-300'
                  : 'border-rose-500/35 bg-rose-500/10 text-rose-500 dark:text-rose-300'
              }`}
            >
              {metadataResult.valid
                ? metadataResult.note ??
                  `Verified ${metadataResult.sourceType} (${metadataResult.detectedChapters.length} chapters).`
                : metadataResult.error ?? 'URL failed validation.'}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="admin-target-lesson"
                className="block text-[11px] font-medium text-terminal-muted"
              >
                Target Lesson
              </label>
              <select
                id="admin-target-lesson"
                name="targetLesson"
                aria-label="Target Lesson"
                value={lessonSlug}
                onChange={(event) => setLessonSlug(event.target.value)}
                className="mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
              >
                {CURRICULUM_LESSONS.map((lesson) => (
                  <option key={lesson.id} value={lesson.slug}>
                    0{lesson.moduleOrder}. {lesson.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="admin-start-timestamp"
                className="flex items-center gap-1 text-[11px] font-medium text-terminal-muted"
              >
                <Clock className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                Lesson Timestamp (MM:SS)
              </label>
              <input
                id="admin-start-timestamp"
                name="startTimestamp"
                aria-label="Lesson start timestamp"
                type="text"
                value={startTimestamp}
                onChange={(event) => setStartTimestamp(event.target.value)}
                placeholder="02:15 (optional)"
                className="mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-resource-title"
                className="block text-[11px] font-medium text-terminal-muted"
              >
                Video Title
              </label>
              <input
                id="admin-resource-title"
                name="resourceTitle"
                aria-label="Resource Title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Video title"
                className="mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-creator-source"
                className="block text-[11px] font-medium text-terminal-muted"
              >
                Channel / Creator
              </label>
              <input
                id="admin-creator-source"
                name="sourceName"
                aria-label="Creator or Channel Attribution"
                type="text"
                required
                value={sourceName}
                onChange={(event) => setSourceName(event.target.value)}
                placeholder="Channel name"
                className="mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label
                htmlFor="admin-initial-status"
                className="block text-[11px] font-medium text-terminal-muted"
              >
                Status
              </label>
              <select
                id="admin-initial-status"
                name="initialStatus"
                aria-label="Initial Workflow Status"
                value={initialStatus}
                onChange={(event) =>
                  setInitialStatus(event.target.value as VerificationStatus)
                }
                className="mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
              >
                <option value="published">Published (Live Now)</option>
                <option value="verified">Verified</option>
                <option value="pending_review">Pending Review</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="admin-before-watch"
                className="block text-[11px] font-medium text-terminal-muted"
              >
                Timestamp Note (optional)
              </label>
              <input
                id="admin-before-watch"
                name="beforeWatchContext"
                aria-label="Before Watching Focus Prompt"
                type="text"
                value={beforeWatchContext}
                onChange={(event) => setBeforeWatchContext(event.target.value)}
                placeholder="Quick note on what to watch for at this timestamp…"
                className="mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <details className="group rounded-xl border border-terminal-border bg-terminal-bg/50">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2 text-xs font-medium text-terminal-muted hover:text-terminal-text">
              <span>Optional Study Notes &amp; Takeaways</span>
              <ChevronDown
                className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid grid-cols-1 gap-3 border-t border-terminal-border p-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="admin-resource-description"
                  className="block text-[11px] font-medium text-terminal-muted"
                >
                  Description
                </label>
                <textarea
                  id="admin-resource-description"
                  name="description"
                  aria-label="Description and attribution note"
                  rows={2}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short description…"
                  className="mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-resource-takeaways"
                  className="block text-[11px] font-medium text-terminal-muted"
                >
                  Takeaways (one per line)
                </label>
                <textarea
                  id="admin-resource-takeaways"
                  name="afterWatchTakeaways"
                  aria-label="After watching takeaways"
                  rows={2}
                  value={takeawaysText}
                  onChange={(event) => setTakeawaysText(event.target.value)}
                  placeholder="Wait for body close beyond swing high"
                  className="mt-1 w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </details>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingResource}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {savingResource ? 'Saving…' : 'Save & Attach Link'}
            </button>
          </div>
        </form>
      </section>

      {/* Collapsible YouTube Discovery Runner */}
      <details className="group rounded-2xl border border-terminal-border bg-terminal-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-sm font-semibold text-terminal-text sm:px-5">
          <span className="inline-flex items-center gap-2">
            <Search className="h-4 w-4 text-sky-400" aria-hidden="true" />
            YouTube API Discovery
          </span>
          <ChevronDown
            className="h-4 w-4 text-terminal-muted transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>

        <div className="border-t border-terminal-border p-4 sm:p-5">
          <form onSubmit={handleRunDiscovery} className="flex flex-col gap-2 sm:flex-row">
            <select
              id="admin-discovery-lesson"
              name="discoveryLesson"
              aria-label="Lesson for video discovery"
              value={discoveryLessonSlug}
              onChange={(event) => setDiscoveryLessonSlug(event.target.value)}
              className="rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-sky-500 focus:outline-none"
            >
              {CURRICULUM_LESSONS.map((lesson) => (
                <option key={lesson.id} value={lesson.slug}>
                  0{lesson.moduleOrder}. {lesson.title}
                </option>
              ))}
            </select>

            <input
              id="admin-discovery-query"
              name="discoveryQuery"
              aria-label="Custom discovery search query"
              type="text"
              value={discoveryQuery}
              onChange={(event) => setDiscoveryQuery(event.target.value)}
              placeholder="Optional search query…"
              className="flex-1 rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs text-terminal-text focus:border-sky-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={discoveryLoading}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60"
            >
              {discoveryLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Discover
            </button>
          </form>

          {discoveryNote && (
            <p className="mt-3 rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-muted">
              {discoveryNote}
            </p>
          )}

          {discoveryCandidates.length > 0 && (
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              {discoveryCandidates.map((candidate) => (
                <div
                  key={candidate.externalVideoId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-terminal-border bg-terminal-bg p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-terminal-text">
                      {candidate.title}
                    </p>
                    <p className="text-[11px] text-terminal-muted">
                      {candidate.channelTitle}
                      {candidate.durationSeconds
                        ? ` · ${formatTimestamp(candidate.durationSeconds)}`
                        : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImportCandidate(candidate)}
                    className="shrink-0 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500 hover:bg-emerald-500 hover:text-slate-950 dark:text-emerald-400"
                  >
                    Use Link
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </details>

      {/* Moderation Queue & Workflow Controls */}
      <section className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-terminal-text">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Linked Resources ({resources.length})
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setStatusFilter(option.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === option.id
                    ? 'bg-emerald-500 font-semibold text-slate-950'
                    : 'border border-terminal-border bg-terminal-surface text-terminal-muted hover:text-terminal-text'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-28 animate-pulse rounded-2xl border border-terminal-border bg-terminal-surface" />
        ) : resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-terminal-border bg-terminal-surface/50 p-6 text-center text-xs text-terminal-muted">
            No resources in this filter.
          </div>
        ) : (
          <div className="space-y-2.5">
            {resources.map((item) => {
              const isExpanded = expandedSegmentsId === item.resource.id;
              return (
                <article
                  key={item.resource.id}
                  className="space-y-2.5 rounded-2xl border border-terminal-border bg-terminal-surface p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-500 dark:text-emerald-400">
                          {item.resource.verificationStatus.replace('_', ' ')}
                        </span>
                        {item.mapping.lessonSlug && (
                          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] text-sky-600 dark:text-sky-400">
                            /{item.mapping.lessonSlug}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-terminal-text">
                        {item.resource.title}
                      </h3>
                      <p className="text-xs text-terminal-muted">
                        {item.resource.sourceName} · {item.segments.length} timestamp(s)
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.resource.sourceType !== 'tradelab_original' && (
                        <a
                          href={item.resource.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1 text-xs font-medium text-sky-500 hover:border-sky-500/50 dark:text-sky-400"
                        >
                          Open
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSegmentsId((prev) =>
                            prev === item.resource.id ? null : item.resource.id,
                          )
                        }
                        className="rounded-lg border border-terminal-border bg-terminal-elevated px-2.5 py-1 text-xs font-medium text-terminal-text hover:border-emerald-500/50"
                      >
                        {isExpanded ? 'Hide Timestamps' : 'Timestamps'}
                      </button>
                    </div>
                  </div>

                  {/* Status workflow pills */}
                  <div className="flex flex-wrap items-center gap-1.5 border-t border-terminal-border pt-2.5">
                    {WORKFLOW_BUTTONS.map((btn) => {
                      const active = item.resource.verificationStatus === btn.status;
                      return (
                        <button
                          key={btn.status}
                          type="button"
                          onClick={() => void handleStatusChange(item.resource.id, btn.status)}
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                            active
                              ? 'border-emerald-500 bg-emerald-500 font-semibold text-slate-950'
                              : btn.tone
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>

                  {isExpanded && (
                    <SegmentVerificationEditor
                      resourceId={item.resource.id}
                      segments={item.segments}
                      onAddSegment={handleAddSegment}
                      onDeleteSegment={handleDeleteSegment}
                    />
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
