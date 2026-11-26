import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Compass,
  Eye,
  Flag,
  Layers,
  LineChart,
  PlayCircle,
  Sparkles,
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
import { ResourceAttributionCard } from './ResourceAttributionCard';
import { TimestampNavigator } from './TimestampNavigator';

export interface VisualExplanationsSectionProps {
  lesson: Lesson;
  resources: LessonResourceWithDetails[];
  tutorialMode?: boolean;
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

const TUTORIAL_STEPS: Record<LearningViewMode, { step: number; guidance: string; nextMode?: LearningViewMode }> = {
  text: {
    step: 1,
    guidance:
      'Read the core market mechanics and terminology first so you know exactly what to look for visually.',
    nextMode: 'diagram',
  },
  diagram: {
    step: 2,
    guidance:
      'Step through the clean visual blueprint to lock in the geometric pattern before seeing real market noise.',
    nextMode: 'video',
  },
  video: {
    step: 3,
    guidance:
      'Watch the verified educator clip or jump directly to a verified key timestamp, then bookmark key takeaways.',
    nextMode: 'chart',
  },
  chart: {
    step: 4,
    guidance:
      'Replay the historical candlestick scenario from Before → Trigger → After to test your eye in live-like conditions.',
  },
};

export function VisualExplanationsSection({
  lesson,
  resources,
  tutorialMode = false,
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
    if (initialResourceId && resources.some((item) => item.resource.id === initialResourceId)) {
      setSelectedResourceId(initialResourceId);
    } else if (resources.length > 0) {
      const preferredVideo = resources.find((item) => item.resource.contentType === 'video');
      setSelectedResourceId((preferredVideo ?? resources[0]).resource.id);
    } else {
      setSelectedResourceId(null);
    }
  }, [resources, initialResourceId]);

  useEffect(() => {
    if (initialTimestampSeconds !== null && initialTimestampSeconds > 0) {
      setSeekSeconds(initialTimestampSeconds);
    } else {
      setSeekSeconds(0);
    }
  }, [initialTimestampSeconds, lesson.slug]);

  const activeResourceBundle = useMemo(() => {
    if (resources.length === 0) {
      return null;
    }
    return (
      resources.find((item) => item.resource.id === selectedResourceId) ?? resources[0]
    );
  }, [resources, selectedResourceId]);

  const primaryScenario = scenarios[selectedScenarioIndex] ?? scenarios[0];
  const comparisonScenario = scenarios.length > 1 ? scenarios[(selectedScenarioIndex + 1) % scenarios.length] : undefined;

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
    notify('Marked as watched in your Learning History.');
  };

  const handleFlagDifficult = async () => {
    await recordConceptStruggle({
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      conceptKey: lesson.conceptKey,
      conceptLabel: lesson.title,
      trigger: 'manual_bookmark',
    });
    notify('Added to My Difficult Concepts for focused review.');
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
    notify('Saved to your Personal Visual Library.');
  };

  const tutorialStep = TUTORIAL_STEPS[activeMode];

  return (
    <section
      aria-labelledby="visual-explanations-heading"
      className="space-y-4 rounded-2xl border border-terminal-border bg-terminal-surface/60 p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              <Eye className="h-3 w-3" aria-hidden="true" />
              Visual Explanations
            </span>
            <span className="font-mono text-[11px] text-terminal-muted tabular-nums">
              4 Learning Modes
            </span>
          </div>
          <h2
            id="visual-explanations-heading"
            className="text-base font-semibold text-terminal-text"
          >
            See {lesson.title} Across Text, Diagrams, Verified Video &amp; Real Charts
          </h2>
        </div>

        <button
          type="button"
          onClick={handleFlagDifficult}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          Mark Concept Difficult
        </button>
      </div>

      {tutorialMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-500/35 bg-sky-500/10 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Compass className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400 tabular-nums">
                Tutorial Mode · Step {tutorialStep.step} of 4
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-terminal-text">
                {tutorialStep.guidance}
              </p>
            </div>
          </div>
          {tutorialStep.nextMode && (
            <button
              type="button"
              onClick={() => setActiveMode(tutorialStep.nextMode!)}
              className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-400"
            >
              Next: {MODE_TABS.find((t) => t.id === tutorialStep.nextMode)?.shortLabel}
            </button>
          )}
        </div>
      )}

      {statusFeedback && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-400"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* 4-Mode Switcher */}
      <div
        role="tablist"
        aria-label="Visual explanation modes"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
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
              onClick={() => setActiveMode(tab.id)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                active
                  ? 'border-emerald-500 bg-emerald-500 text-slate-950 shadow-sm'
                  : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-emerald-500/40 hover:text-terminal-text'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: TEXT EXPLANATION */}
      {activeMode === 'text' && (
        <div className="space-y-4">
          {lesson.sections.map((section) => (
            <article
              key={section.id}
              className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
            >
              <h3 className="text-sm font-semibold text-terminal-text">{section.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-terminal-muted">
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
              <div className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
                <strong className="font-semibold text-emerald-400">Key Takeaway: </strong>
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
        <div className="space-y-4">
          {!activeResourceBundle ? (
            <div className="rounded-xl border border-terminal-border bg-terminal-surface p-6 text-center">
              <AlertCircle className="mx-auto h-6 w-6 text-amber-400" aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold text-terminal-text">
                No Verified Video Published for This Lesson Yet
              </p>
              <p className="mt-1 text-xs text-terminal-muted">
                Use the Diagram Explanation and Historical Chart Example tabs, or curate a
                verified YouTube video inside the Admin Console.
              </p>
            </div>
          ) : (
            <>
              {resources.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  {resources.map((item) => {
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
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          selected
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                            : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                        }`}
                      >
                        {item.resource.title}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Before Watching Focus */}
              {activeResourceBundle.mapping.beforeWatchContext && (
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 px-4 py-3">
                  <p className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Before Watching — What to Look For
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-terminal-text">
                    {activeResourceBundle.mapping.beforeWatchContext}
                  </p>
                </div>
              )}

              <LazyVideoPlayer
                resource={activeResourceBundle.resource}
                startSeconds={seekSeconds}
                endSeconds={seekEndSeconds}
                seekTriggerKey={seekTriggerKey}
                onPlaybackActivated={handlePlaybackActivated}
              />

              {/* Video Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-terminal-border bg-terminal-surface px-4 py-3">
                <div className="text-xs text-terminal-muted">
                  <strong className="text-terminal-text">
                    {activeResourceBundle.resource.title}
                  </strong>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookmarkTargetSegment(null);
                      setBookmarkDialogOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-elevated px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-amber-500/50 hover:text-amber-400"
                  >
                    <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                    Save to Library
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkWatched}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      watchedIds[activeResourceBundle.resource.id]
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                        : 'border-emerald-500/40 bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {watchedIds[activeResourceBundle.resource.id] ? 'Watched' : 'Mark as Watched'}
                  </button>
                </div>
              </div>

              <TimestampNavigator
                segments={activeResourceBundle.segments}
                activeSegmentId={activeSegmentId}
                onSelectSegment={handleSelectSegment}
                onBookmarkSegment={(segment) => {
                  setBookmarkTargetSegment(segment);
                  setBookmarkDialogOpen(true);
                }}
              />

              {/* After Watching Takeaways */}
              {activeResourceBundle.mapping.afterWatchTakeaways.length > 0 && (
                <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4">
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    After Watching — Key Takeaways
                  </h4>
                  <ul className="mt-2.5 space-y-1.5">
                    {activeResourceBundle.mapping.afterWatchTakeaways.map((takeaway) => (
                      <li
                        key={takeaway}
                        className="flex items-start gap-2 text-xs leading-relaxed text-terminal-text"
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

              <ResourceAttributionCard resource={activeResourceBundle.resource} />

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
        <div className="space-y-4">
          {scenarios.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              {scenarios.map((scenario, index) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenarioIndex(index)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    index === selectedScenarioIndex
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
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
            <div className="rounded-xl border border-terminal-border bg-terminal-surface p-6 text-center text-xs text-terminal-muted">
              No historical candlestick scenarios linked to this lesson yet.
            </div>
          )}
        </div>
      )}

      {/* Related Terminology Strip */}
      {lesson.terminology.length > 0 && (
        <div className="border-t border-terminal-border pt-4">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-terminal-muted">
            Related Terminology
          </h3>
          <div className="mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
            {lesson.terminology.map((entry) => (
              <div
                key={entry.term}
                className="rounded-xl border border-terminal-border bg-terminal-bg/80 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-terminal-text">{entry.term}</span>
                  {entry.shortCode && (
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                      {entry.shortCode}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-terminal-muted">
                  {entry.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
