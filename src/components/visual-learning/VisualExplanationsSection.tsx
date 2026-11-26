import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Compass,
  Flag,
  Layers,
  LineChart,
  PlayCircle,
  Plus,
  Youtube,
} from 'lucide-react';
import { getChartScenariosByLessonSlug } from '../../data/chartScenarios';
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
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const scenarios = useMemo(
    () => getChartScenariosByLessonSlug(lesson.slug),
    [lesson.slug],
  );
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);

  const externalVideoResources = useMemo(
    () => resources.filter((item) => item.resource.sourceType !== 'tradelab_original'),
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
      const preferredVideo = externalVideoResources.find(
        (item) => item.resource.sourceType === 'youtube' || item.resource.contentType === 'video',
      );
      setSelectedResourceId((preferredVideo ?? externalVideoResources[0]).resource.id);
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
      className="space-y-3.5 rounded-2xl border border-terminal-border bg-terminal-surface/70 p-3.5 sm:p-4"
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

      {/* MODE 1: TEXT EXPLANATION */}
      {activeMode === 'text' && (
        <div className="space-y-3">
          {lesson.sections.map((section) => (
            <article
              key={section.id}
              className="rounded-xl border border-terminal-border bg-terminal-surface p-4"
            >
              <h3 className="text-sm font-semibold text-terminal-text">{section.heading}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-terminal-muted sm:text-sm">
                {section.body}
              </p>
              {section.bulletPoints.length > 0 && (
                <ul className="mt-2.5 space-y-1">
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
              <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Takeaway:{' '}
                </strong>
                {section.keyTakeaway}
              </div>
            </article>
          ))}
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
              {externalVideoResources.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {externalVideoResources.map((item) => {
                    const selected = item.resource.id === activeResourceBundle.resource.id;
                    return (
                      <button
                        key={item.resource.id}
                        type="button"
                        onClick={() => {
                          setSelectedResourceId(item.resource.id);
                          setActiveSegmentId(null);
                          setSeekSeconds(0);
                          setSeekEndSeconds(null);
                          setSeekTriggerKey(0);
                        }}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          selected
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                        }`}
                      >
                        {item.resource.title}
                      </button>
                    );
                  })}
                </div>
              )}

              <LazyVideoPlayer
                resource={activeResourceBundle.resource}
                startSeconds={seekSeconds}
                endSeconds={seekEndSeconds}
                seekTriggerKey={seekTriggerKey}
                onPlaybackActivated={handlePlaybackActivated}
              />

              {/* Compact Video Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <p className="min-w-0 truncate text-xs font-semibold text-terminal-text">
                  {activeResourceBundle.resource.title}
                </p>
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
