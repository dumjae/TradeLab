import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Compass,
  ExternalLink,
  Flag,
  HelpCircle,
  Layers,
  Lightbulb,
  LineChart,
  Play,
  PlayCircle,
  Plus,
  Youtube,
} from 'lucide-react';
import { getChartScenariosForLesson } from '../../data/chartScenarios';
import {
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  formatTimestamp,
  isValidYouTubeVideoId,
} from '../../lib/youtubeUtils';
import { recordConceptStruggle } from '../../services/difficultConceptsService';
import {
  recordLearningProgress,
  saveResourceBookmark,
} from '../../services/personalLibraryService';
import type {
  CurriculumLevel,
  LearningViewMode,
  Lesson,
} from '../../types/academy';
import type {
  LessonResourceWithDetails,
  ResourceSegment,
} from '../../types/visual-learning';
import { BeforeAfterChartViewer } from '../charts/BeforeAfterChartViewer';
import { BookmarkNotesDialog } from './BookmarkNotesDialog';
import { ConceptDiagramSvg } from './ConceptDiagramSvg';
import { LazyVideoPlayer } from './LazyVideoPlayer';
import { TimestampNavigator } from './TimestampNavigator';

export interface VisualExplanationsSectionProps {
  lesson: Lesson;
  resources: LessonResourceWithDetails[];
  tutorialMode?: boolean;
  isAdmin?: boolean;
  initialMode?: LearningViewMode;
  initialResourceId?: string | null;
  initialTimestampSeconds?: number | null;
  onSelectCitationTarget?: (resourceId: string, startSeconds?: number) => void;
}

const MODE_TABS: Array<{
  id: LearningViewMode;
  label: string;
  shortLabel: string;
  icon: typeof BookOpen;
}> = [
  { id: 'text', label: 'Text Explanation', shortLabel: 'Text', icon: BookOpen },
  { id: 'diagram', label: 'Diagram Explanation', shortLabel: 'Diagram', icon: Layers },
  { id: 'video', label: 'Video Explanation', shortLabel: 'Video', icon: PlayCircle },
  {
    id: 'chart',
    label: 'Historical Chart Example',
    shortLabel: 'Historical Chart',
    icon: LineChart,
  },
];

const TUTORIAL_STEPS: Record<
  LearningViewMode,
  { step: number; guidance: string; nextMode?: LearningViewMode }
> = {
  text: {
    step: 1,
    guidance: 'Scan the core rule and takeaway first.',
    nextMode: 'diagram',
  },
  diagram: {
    step: 2,
    guidance: 'Lock in the clean visual structure.',
    nextMode: 'video',
  },
  video: {
    step: 3,
    guidance: 'Jump straight to key YouTube timestamps.',
    nextMode: 'chart',
  },
  chart: {
    step: 4,
    guidance: 'Step through Before → Trigger → After.',
  },
};

function getVideoSourcePriority(item: LessonResourceWithDetails): number {
  if (item.resource.sourceType === 'youtube') {
    return 0;
  }
  if (item.resource.contentType === 'video') {
    return 1;
  }
  return 2;
}

function resolveVideoThumbnailUrl(item: LessonResourceWithDetails): string | null {
  if (item.resource.thumbnailUrl) {
    return item.resource.thumbnailUrl;
  }
  const videoId = item.resource.externalVideoId;
  if (videoId && isValidYouTubeVideoId(videoId)) {
    return buildYouTubeThumbnailUrl(videoId, 'mq');
  }
  return null;
}

function resolveVideoExternalUrl(item: LessonResourceWithDetails): string | null {
  const videoId = item.resource.externalVideoId;
  if (videoId && isValidYouTubeVideoId(videoId)) {
    return buildYouTubeWatchUrl(videoId);
  }
  if (item.resource.sourceUrl.startsWith('https://')) {
    return item.resource.sourceUrl;
  }
  return null;
}

export function VisualExplanationsSection({
  lesson,
  resources,
  tutorialMode = false,
  isAdmin = false,
  initialMode = 'text',
  initialResourceId = null,
  initialTimestampSeconds = null,
}: VisualExplanationsSectionProps) {
  const [activeMode, setActiveMode] = useState<LearningViewMode>(initialMode);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    initialResourceId,
  );
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [seekSeconds, setSeekSeconds] = useState<number>(initialTimestampSeconds ?? 0);
  const [seekEndSeconds, setSeekEndSeconds] = useState<number | null>(null);
  const [seekTriggerKey, setSeekTriggerKey] = useState<number>(0);

  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState<boolean>(false);
  const [bookmarkTargetSegment, setBookmarkTargetSegment] =
    useState<ResourceSegment | null>(null);
  const [watchedIds, setWatchedIds] = useState<Record<string, boolean>>({});
  const [failedThumbIds, setFailedThumbIds] = useState<Record<string, boolean>>({});
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const scenarios = useMemo(
    () => getChartScenariosForLesson(lesson),
    [lesson],
  );
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);

  const externalVideoResources = useMemo(
    () =>
      resources
        .filter((item) => item.resource.sourceType !== 'tradelab_original')
        .slice()
        .sort((a, b) => {
          const priorityDiff = getVideoSourcePriority(a) - getVideoSourcePriority(b);
          if (priorityDiff !== 0) {
            return priorityDiff;
          }
          return a.mapping.displayOrder - b.mapping.displayOrder;
        }),
    [resources],
  );

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode, lesson.slug]);

  useEffect(() => {
    setSelectedScenarioIndex(0);
    setActiveSegmentId(null);
    setSeekEndSeconds(null);
    setSeekTriggerKey(0);
    setStatusFeedback(null);
  }, [lesson.slug]);

  useEffect(() => {
    if (
      initialResourceId &&
      externalVideoResources.some((item) => item.resource.id === initialResourceId)
    ) {
      setSelectedResourceId(initialResourceId);
    } else if (externalVideoResources.length > 0) {
      setSelectedResourceId(externalVideoResources[0].resource.id);
    } else {
      setSelectedResourceId(null);
    }
  }, [externalVideoResources, initialResourceId]);

  useEffect(() => {
    if (initialTimestampSeconds !== null && initialTimestampSeconds > 0) {
      setSeekSeconds(initialTimestampSeconds);
    } else {
      setSeekSeconds(0);
    }
  }, [initialTimestampSeconds, lesson.slug]);

  const activeResourceBundle = useMemo(() => {
    if (externalVideoResources.length === 0) {
      return null;
    }
    return (
      externalVideoResources.find((item) => item.resource.id === selectedResourceId) ??
      externalVideoResources[0]
    );
  }, [externalVideoResources, selectedResourceId]);

  const handleSelectVideoResource = useCallback((resourceId: string) => {
    setSelectedResourceId(resourceId);
    setActiveSegmentId(null);
    setSeekSeconds(0);
    setSeekEndSeconds(null);
    setSeekTriggerKey(0);
  }, []);

  const primaryScenario = scenarios[selectedScenarioIndex] ?? scenarios[0];
  const comparisonScenario =
    scenarios.length > 1
      ? scenarios[(selectedScenarioIndex + 1) % scenarios.length]
      : undefined;

  const notify = (message: string) => {
    setStatusFeedback(message);
    window.setTimeout(() => {
      setStatusFeedback((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  const handleSelectSegment = useCallback(
    (segment: ResourceSegment) => {
      setActiveSegmentId(segment.id);
      setSeekSeconds(segment.startSeconds);
      setSeekEndSeconds(segment.endSeconds);
      setSeekTriggerKey((prev) => prev + 1);
      if (activeResourceBundle) {
        void recordLearningProgress({
          resourceId: activeResourceBundle.resource.id,
          lessonId: lesson.id,
          lessonSlug: lesson.slug,
          lastPositionSeconds: segment.startSeconds,
          completionStatus: 'in_progress',
        });
      }
    },
    [activeResourceBundle, lesson.id, lesson.slug],
  );

  const handlePlaybackActivated = useCallback(
    (startedAt: number) => {
      if (!activeResourceBundle) {
        return;
      }
      void recordLearningProgress({
        resourceId: activeResourceBundle.resource.id,
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        lastPositionSeconds: startedAt,
        completionStatus: 'in_progress',
      });
    },
    [activeResourceBundle, lesson.id, lesson.slug],
  );

  const handleMarkWatched = async () => {
    if (!activeResourceBundle) {
      return;
    }
    await recordLearningProgress({
      resourceId: activeResourceBundle.resource.id,
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      lastPositionSeconds: activeResourceBundle.resource.durationSeconds ?? seekSeconds,
      completionStatus: 'watched',
    });
    setWatchedIds((prev) => ({ ...prev, [activeResourceBundle.resource.id]: true }));
    notify('Marked watched.');
  };

  const handleFlagDifficult = async () => {
    await recordConceptStruggle({
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      conceptKey: lesson.conceptKey,
      conceptLabel: lesson.title,
      trigger: 'manual_bookmark',
    });
    notify('Added to Difficult Concepts.');
  };

  const handleSaveBookmark = async (payload: {
    savedTimestampSeconds: number | null;
    savedSegmentId: string | null;
    curriculumLevel: CurriculumLevel;
    personalNotes: string;
  }) => {
    if (!activeResourceBundle) {
      return;
    }
    await saveResourceBookmark({
      resourceId: activeResourceBundle.resource.id,
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      savedTimestampSeconds: payload.savedTimestampSeconds,
      savedSegmentId: payload.savedSegmentId,
      curriculumLevel: payload.curriculumLevel,
      personalNotes: payload.personalNotes,
    });
    notify('Saved to My Library.');
  };

  const tutorialStep = TUTORIAL_STEPS[activeMode];

  const hasStudyNotes = Boolean(
    activeResourceBundle &&
      (activeResourceBundle.mapping.beforeWatchContext ||
        activeResourceBundle.mapping.afterWatchTakeaways.length > 0),
  );

  return (
    <section
      aria-label={`Visual explanations for ${lesson.title}`}
      className="space-y-4 rounded-3xl border border-terminal-border bg-terminal-surface/70 p-3.5 sm:p-5"
    >
      {/* Compact App-Like Top Bar: 4-Mode Pill Switcher + Flag Difficult */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="Visual explanation modes"
          className="inline-flex flex-1 flex-wrap items-center gap-1 rounded-xl border border-terminal-border bg-terminal-bg p-1 sm:flex-none"
        >
          {MODE_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={tab.label}
                onClick={() => setActiveMode(tab.id)}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:flex-none ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleFlagDifficult}
          title="Mark this concept as difficult for later review"
          className="inline-flex items-center gap-1.5 rounded-xl border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:border-amber-500/40 hover:text-amber-500 dark:hover:text-amber-400"
        >
          <Flag className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
          <span className="hidden sm:inline">Flag Difficult</span>
        </button>
      </div>

      {tutorialMode && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sky-500/35 bg-sky-500/10 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 text-terminal-text">
            <Compass className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden="true" />
            <span className="font-mono font-semibold text-sky-500 dark:text-sky-400 tabular-nums">
              {tutorialStep.step}/4
            </span>
            <span>{tutorialStep.guidance}</span>
          </div>
          {tutorialStep.nextMode && (
            <button
              type="button"
              onClick={() => setActiveMode(tutorialStep.nextMode!)}
              className="rounded-lg bg-sky-500 px-2.5 py-1 text-[11px] font-semibold text-slate-950 transition-colors hover:bg-sky-400"
            >
              Next: {MODE_TABS.find((t) => t.id === tutorialStep.nextMode)?.shortLabel}
            </button>
          )}
        </div>
      )}

      {statusFeedback && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* MODE 1: TEXT EXPLANATION (VISUAL-FIRST TOTAL-BEGINNER LEARN VIEW) */}
      {activeMode === 'text' && (
        <div className="space-y-4">
          {/* 1. Calm "In Plain English" Summary Card */}
          {lesson.plainEnglishSummary && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  In Plain English
                </p>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-terminal-text sm:text-sm">
                {lesson.plainEnglishSummary}
              </p>
            </div>
          )}

          {/* 2. Visual Concept Diagram immediately inside Learn View */}
          <ConceptDiagramSvg config={lesson.diagramConfig} />

          {/* 3. Clear Numbered Plain-English Lesson Sections */}
          <div className="space-y-3">
            {lesson.sections.map((section, index) => (
              <article
                key={section.id}
                className="rounded-2xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold leading-snug text-terminal-text sm:text-base">
                    {section.heading}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-terminal-muted sm:text-sm">
                  {section.body}
                </p>
                {section.bulletPoints.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {section.bulletPoints.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-xs leading-relaxed text-terminal-text"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Takeaway:{' '}
                  </strong>
                  {section.keyTakeaway}
                </div>
              </article>
            ))}
          </div>

          {/* 4. Collapsible Common Beginner Questions (FAQ) */}
          {lesson.beginnerFaq && lesson.beginnerFaq.length > 0 && (
            <div className="space-y-2.5 rounded-2xl border border-terminal-border bg-terminal-bg/60 p-4">
              <div className="flex items-center gap-2">
                <HelpCircle
                  className="h-4 w-4 shrink-0 text-sky-500 dark:text-sky-400"
                  aria-hidden="true"
                />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-terminal-text">
                  Common Beginner Questions (FAQ)
                </h3>
              </div>
              <div className="space-y-2">
                {lesson.beginnerFaq.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-terminal-border/80 bg-terminal-surface"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 text-xs font-medium text-terminal-text">
                      <span>{item.question}</span>
                      <ChevronDown
                        className="h-3.5 w-3.5 shrink-0 text-terminal-muted transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="border-t border-terminal-border/70 px-3.5 py-2.5 text-xs leading-relaxed text-terminal-muted">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* 5. Guided Next-Step Row */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-terminal-border bg-terminal-bg/75 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-terminal-muted">
              Ready to see this on real price action?
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMode('chart')}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:bg-emerald-400 active:scale-[0.98]"
              >
                <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Step 2: Try the Real Historical Chart</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('video')}
                className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-4 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-sky-500/45 hover:text-sky-600 dark:hover:text-sky-400"
              >
                <PlayCircle className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                <span>Step 3: Watch Video Walkthrough</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DIAGRAM EXPLANATION */}
      {activeMode === 'diagram' && <ConceptDiagramSvg config={lesson.diagramConfig} />}

      {/* MODE 3: VIDEO EXPLANATION */}
      {activeMode === 'video' && (
        <div className="space-y-3">
          {!activeResourceBundle ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-terminal-border bg-terminal-bg/60 px-5 py-8 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-400">
                <Youtube className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="max-w-sm space-y-1">
                <p className="text-sm font-semibold text-terminal-text">
                  No YouTube link added yet
                </p>
                <p className="text-xs text-terminal-muted">
                  {isAdmin
                    ? 'Paste a YouTube URL with a lesson timestamp — zero downloads, instant redirect.'
                    : 'Curated YouTube links with lesson timestamps will appear here once published.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {isAdmin && (
                  <Link
                    to={`/admin/visual-library?lesson=${lesson.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Paste YouTube Link
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setActiveMode('diagram')}
                  className="rounded-full border border-terminal-border bg-terminal-surface px-3.5 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-emerald-500/40"
                >
                  Open Diagram
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('chart')}
                  className="rounded-full border border-terminal-border bg-terminal-surface px-3.5 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-emerald-500/40"
                >
                  Open Chart
                </button>
              </div>
            </div>
          ) : (
            <>
              <LazyVideoPlayer
                resource={activeResourceBundle.resource}
                startSeconds={seekSeconds}
                endSeconds={seekEndSeconds}
                seekTriggerKey={seekTriggerKey}
                onPlaybackActivated={handlePlaybackActivated}
              />

              {/* Compact Video Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <p className="min-w-0 truncate text-xs font-semibold text-terminal-text">
                    {activeResourceBundle.resource.title}
                  </p>
                  <span className="hidden shrink-0 items-center rounded-full border border-terminal-border bg-terminal-bg px-2 py-0.5 text-[10px] font-medium text-terminal-muted sm:inline-flex">
                    {activeResourceBundle.resource.sourceName}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {isAdmin && (
                    <Link
                      to={`/admin/visual-library?lesson=${lesson.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1 text-[11px] font-medium text-terminal-muted transition-colors hover:border-emerald-500/40 hover:text-emerald-500 dark:hover:text-emerald-400"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                      Add Link
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setBookmarkTargetSegment(null);
                      setBookmarkDialogOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1 text-[11px] font-medium text-terminal-text transition-colors hover:border-amber-500/50 hover:text-amber-500 dark:hover:text-amber-400"
                  >
                    <Bookmark className="h-3 w-3" aria-hidden="true" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkWatched}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      watchedIds[activeResourceBundle.resource.id]
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'border-emerald-500/40 bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {watchedIds[activeResourceBundle.resource.id] ? 'Watched' : 'Mark Watched'}
                  </button>
                </div>
              </div>

              {/* Compact Multi-Video Switcher */}
              {externalVideoResources.length > 1 && (
                <div className="overflow-hidden rounded-2xl border border-terminal-border bg-terminal-surface">
                  <div className="flex items-center justify-between border-b border-terminal-border bg-terminal-elevated/40 px-3.5 py-2">
                    <div className="flex items-center gap-1.5">
                      <PlayCircle
                        className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-text">
                        More Videos for This Lesson
                      </h4>
                    </div>
                    <span className="font-mono text-[11px] text-terminal-muted tabular-nums">
                      {externalVideoResources.length} videos
                    </span>
                  </div>

                  <ul className="divide-y divide-terminal-border">
                    {externalVideoResources.map((item) => {
                      const isSelected = item.resource.id === activeResourceBundle.resource.id;
                      const thumbSrc = resolveVideoThumbnailUrl(item);
                      const showThumb = Boolean(thumbSrc && !failedThumbIds[item.resource.id]);
                      const externalUrl = resolveVideoExternalUrl(item);

                      return (
                        <li
                          key={item.resource.id}
                          className={`flex items-center justify-between gap-2.5 px-3 py-2 transition-colors ${
                            isSelected
                              ? 'bg-emerald-500/10'
                              : 'hover:bg-terminal-elevated/40'
                          }`}
                        >
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => handleSelectVideoResource(item.resource.id)}
                            className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          >
                            <div
                              className={`relative aspect-video w-20 shrink-0 overflow-hidden rounded-lg border bg-slate-950 sm:w-24 ${
                                isSelected
                                  ? 'border-emerald-500/70'
                                  : 'border-terminal-border group-hover:border-emerald-500/40'
                              }`}
                            >
                              {showThumb && thumbSrc ? (
                                <img
                                  src={thumbSrc}
                                  alt={`Thumbnail for ${item.resource.title}`}
                                  loading="lazy"
                                  onError={() =>
                                    setFailedThumbIds((prev) => ({
                                      ...prev,
                                      [item.resource.id]: true,
                                    }))
                                  }
                                  className="h-full w-full object-cover opacity-85 transition-transform duration-200 group-hover:scale-105 group-hover:opacity-100"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-400">
                                  <Youtube className="h-4 w-4" aria-hidden="true" />
                                </div>
                              )}

                              <span
                                className={`absolute inset-0 flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-slate-950/15'
                                    : 'bg-slate-950/25 group-hover:bg-slate-950/10'
                                }`}
                                aria-hidden="true"
                              >
                                <span
                                  className={`flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-105 ${
                                    isSelected
                                      ? 'bg-emerald-500 text-slate-950'
                                      : 'bg-slate-950/80 text-white'
                                  }`}
                                >
                                  <Play className="ml-0.5 h-3 w-3 fill-current" />
                                </span>
                              </span>

                              {item.resource.durationSeconds !== null && (
                                <span className="absolute bottom-1 right-1 rounded bg-slate-950/85 px-1 py-0.5 font-mono text-[9px] font-medium leading-none text-slate-100 tabular-nums">
                                  {formatTimestamp(item.resource.durationSeconds)}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <p
                                className={`truncate text-xs font-semibold transition-colors ${
                                  isSelected
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-terminal-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                                }`}
                              >
                                {item.resource.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex max-w-[160px] items-center truncate rounded-full border border-terminal-border bg-terminal-bg px-2 py-0.5 text-[10px] font-medium text-terminal-muted">
                                  {item.resource.sourceName}
                                </span>
                                {isSelected && (
                                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    Selected
                                  </span>
                                )}
                                {watchedIds[item.resource.id] && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                    Watched
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>

                          {externalUrl && (
                            <a
                              href={externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${item.resource.title} on YouTube in a new tab`}
                              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-sky-500/35 bg-sky-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-sky-600 transition-colors hover:bg-sky-500 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:text-sky-400 dark:hover:text-slate-950"
                            >
                              <span>YouTube</span>
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <TimestampNavigator
                segments={activeResourceBundle.segments}
                activeSegmentId={activeSegmentId}
                externalVideoId={activeResourceBundle.resource.externalVideoId}
                sourceUrl={activeResourceBundle.resource.sourceUrl}
                onSelectSegment={handleSelectSegment}
                onBookmarkSegment={(segment) => {
                  setBookmarkTargetSegment(segment);
                  setBookmarkDialogOpen(true);
                }}
              />

              {/* Collapsible Before/After Study Notes */}
              {hasStudyNotes && (
                <details className="group rounded-xl border border-terminal-border bg-terminal-bg/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-medium text-terminal-text">
                    <span>Study Notes (Before &amp; After Watching)</span>
                    <ChevronDown
                      className="h-3.5 w-3.5 text-terminal-muted transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="space-y-3 border-t border-terminal-border px-3.5 py-3 text-xs">
                    {activeResourceBundle.mapping.beforeWatchContext && (
                      <div>
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-500 dark:text-sky-400">
                          Before Watching — What to Look For
                        </p>
                        <p className="mt-1 leading-relaxed text-terminal-muted">
                          {activeResourceBundle.mapping.beforeWatchContext}
                        </p>
                      </div>
                    )}
                    {activeResourceBundle.mapping.afterWatchTakeaways.length > 0 && (
                      <div>
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
                          After Watching — Key Takeaways
                        </p>
                        <ul className="mt-1.5 space-y-1">
                          {activeResourceBundle.mapping.afterWatchTakeaways.map((takeaway) => (
                            <li
                              key={takeaway}
                              className="flex items-start gap-2 leading-relaxed text-terminal-text"
                            >
                              <CheckCircle2
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                                aria-hidden="true"
                              />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <BookmarkNotesDialog
                isOpen={bookmarkDialogOpen}
                resource={activeResourceBundle.resource}
                segment={bookmarkTargetSegment}
                defaultLevel={lesson.level}
                onClose={() => setBookmarkDialogOpen(false)}
                onSave={handleSaveBookmark}
              />
            </>
          )}
        </div>
      )}

      {/* MODE 4: HISTORICAL CHART EXAMPLE */}
      {activeMode === 'chart' && (
        <div className="space-y-3">
          {scenarios.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {scenarios.map((scenario, index) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenarioIndex(index)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    index === selectedScenarioIndex
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {scenario.title}
                </button>
              ))}
            </div>
          )}

          {primaryScenario ? (
            <BeforeAfterChartViewer
              scenario={primaryScenario}
              comparisonScenario={comparisonScenario}
            />
          ) : (
            <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 text-center text-xs text-terminal-muted">
              No historical candlestick scenarios linked to this lesson yet.
            </div>
          )}
        </div>
      )}

      {/* Collapsible Key Terminology */}
      {lesson.terminology.length > 0 && (
        <details className="group rounded-xl border border-terminal-border bg-terminal-bg/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-medium text-terminal-text">
            <span>Key Terminology ({lesson.terminology.length})</span>
            <ChevronDown
              className="h-3.5 w-3.5 text-terminal-muted transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="grid grid-cols-1 gap-2 border-t border-terminal-border p-3 md:grid-cols-3">
            {lesson.terminology.map((entry) => (
              <div
                key={entry.term}
                className="rounded-lg border border-terminal-border bg-terminal-surface p-2.5"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-semibold text-terminal-text">{entry.term}</span>
                  {entry.shortCode && (
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {entry.shortCode}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-terminal-muted">
                  {entry.definition}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
