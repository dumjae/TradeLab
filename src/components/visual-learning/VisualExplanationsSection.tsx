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
import { useLanguage } from '../../context/LanguageContext';
import { getChartScenariosForLesson } from '../../data/chartScenarios';
import { LESSON_TAGLISH_SUMMARIES, UI_COPY } from '../../data/taglishTranslations';
import { expandAcronyms } from '../../lib/acronymHelper';
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
  shortEn: string;
  shortTaglish: string;
  icon: typeof BookOpen;
}> = [
  {
    id: 'text',
    label: 'Text Explanation',
    shortEn: 'Text',
    shortTaglish: 'Paliwanag',
    icon: BookOpen,
  },
  {
    id: 'diagram',
    label: 'Diagram Explanation',
    shortEn: 'Diagram',
    shortTaglish: 'Diagram',
    icon: Layers,
  },
  {
    id: 'video',
    label: 'Video Explanation',
    shortEn: 'Video',
    shortTaglish: 'Video',
    icon: PlayCircle,
  },
  {
    id: 'chart',
    label: 'Historical Chart Example',
    shortEn: 'Historical Chart',
    shortTaglish: 'Chart',
    icon: LineChart,
  },
];

const TUTORIAL_STEPS: Record<
  LearningViewMode,
  { step: number; en: string; taglish: string; nextMode?: LearningViewMode }
> = {
  text: {
    step: 1,
    en: 'Read the short summary and key rule first.',
    taglish: 'Basahin muna ang maikling buod at pinaka-tandaan.',
    nextMode: 'diagram',
  },
  diagram: {
    step: 2,
    en: 'Tap each step to see the visual pattern.',
    taglish: 'I-tap bawat hakbang para makita ang malinaw na pattern.',
    nextMode: 'video',
  },
  video: {
    step: 3,
    en: 'Jump straight to key YouTube timestamps.',
    taglish: 'Diretso na sa mga mahahalagang timestamp sa YouTube.',
    nextMode: 'chart',
  },
  chart: {
    step: 4,
    en: 'Step through Before → Trigger → After.',
    taglish: 'Sundan ang Before → Trigger → After sa totoong chart.',
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
  const { isTaglish, t } = useLanguage();
  const [activeMode, setActiveMode] = useState<LearningViewMode>(initialMode);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    initialResourceId,
  );
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [seekSeconds, setSeekSeconds] = useState<number>(initialTimestampSeconds ?? 0);
  const [seekEndSeconds, setSeekEndSeconds] = useState<number | null>(null);
  const [seekTriggerKey, setSeekTriggerKey] = useState<number>(0);

  const [expandAllSections, setExpandAllSections] = useState<boolean>(false);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState<boolean>(false);
  const [bookmarkTargetSegment, setBookmarkTargetSegment] =
    useState<ResourceSegment | null>(null);
  const [watchedIds, setWatchedIds] = useState<Record<string, boolean>>({});
  const [failedThumbIds, setFailedThumbIds] = useState<Record<string, boolean>>({});
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const taglishEntry = LESSON_TAGLISH_SUMMARIES[lesson.slug];

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
    setExpandAllSections(false);
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
    notify(t('Marked watched.', 'Minarkahang napanood na.'));
  };

  const handleFlagDifficult = async () => {
    await recordConceptStruggle({
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      conceptKey: lesson.conceptKey,
      conceptLabel: lesson.title,
      trigger: 'manual_bookmark',
    });
    notify(t('Added to Difficult Concepts.', 'Naidagdag sa Difficult Concepts.'));
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
    notify(t('Saved to My Library.', 'Na-save sa My Library.'));
  };

  const tutorialStep = TUTORIAL_STEPS[activeMode];

  const hasStudyNotes = Boolean(
    activeResourceBundle &&
      (activeResourceBundle.mapping.beforeWatchContext ||
        activeResourceBundle.mapping.afterWatchTakeaways.length > 0),
  );

  const plainSummaryDisplay = isTaglish
    ? (taglishEntry?.plainSummary ?? expandAcronyms(lesson.plainEnglishSummary ?? ''))
    : expandAcronyms(lesson.plainEnglishSummary ?? '');

  const activeFaqItems = useMemo(() => {
    if (isTaglish && taglishEntry?.faqs && taglishEntry.faqs.length > 0) {
      return taglishEntry.faqs;
    }
    return (lesson.beginnerFaq ?? []).map((item) => ({
      question: expandAcronyms(item.question),
      answer: expandAcronyms(item.answer),
    }));
  }, [isTaglish, taglishEntry, lesson.beginnerFaq]);

  return (
    <section
      aria-label={`Visual explanations for ${lesson.title}`}
      className="space-y-3.5 rounded-2xl border border-terminal-border bg-terminal-surface/75 p-3 sm:p-4"
    >
      {/* Compact Top Bar: 4-Mode Pill Switcher + Flag Difficult */}
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
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:flex-none ${
                  active
                    ? 'bg-brand text-brand-fg shadow-sm'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{t(tab.shortEn, tab.shortTaglish)}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleFlagDifficult}
          title={t('Mark this concept as difficult for later review', 'I-mark para balikan mamaya')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:border-amber-500/40 hover:text-amber-500 dark:hover:text-amber-400"
        >
          <Flag className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
          <span className="hidden sm:inline">
            {t('Flag Difficult', 'I-Review Mamaya')}
          </span>
        </button>
      </div>

      {tutorialMode && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sky-500/35 bg-sky-500/10 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 text-terminal-text">
            <Compass className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden="true" />
            <span className="font-mono font-semibold text-sky-500 dark:text-sky-400 tabular-nums">
              {tutorialStep.step}/4
            </span>
            <span>{t(tutorialStep.en, tutorialStep.taglish)}</span>
          </div>
          {tutorialStep.nextMode && (
            <button
              type="button"
              onClick={() => setActiveMode(tutorialStep.nextMode!)}
              className="rounded-lg bg-sky-500 px-2.5 py-1 text-[11px] font-semibold text-slate-950 transition-colors hover:bg-sky-400"
            >
              {t('Next:', 'Sunod:')}{' '}
              {(() => {
                const nextTab = MODE_TABS.find((item) => item.id === tutorialStep.nextMode);
                return nextTab ? t(nextTab.shortEn, nextTab.shortTaglish) : '';
              })()}
            </button>
          )}
        </div>
      )}

      {statusFeedback && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-bull/35 bg-bull/10 px-3 py-1.5 text-xs font-medium text-bull"
        >
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* MODE 1: TEXT EXPLANATION (COMPACT, VISUAL-FIRST, ZERO WALL OF TEXT) */}
      {activeMode === 'text' && (
        <div className="space-y-3.5">
          {/* 1. Compact "In Plain English / Sa Simpleng Salita" Card */}
          {plainSummaryDisplay && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {t('In Plain English', UI_COPY.lesson.plainSummaryTitle.taglish)}
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-terminal-text sm:text-[13px]">
                {plainSummaryDisplay}
              </p>
              {isTaglish && taglishEntry?.quickTakeaway && (
                <div className="mt-2.5 rounded-lg border border-brand/25 bg-brand-soft/60 px-3 py-2 text-xs text-terminal-text">
                  <strong className="font-semibold text-brand">
                    {UI_COPY.lesson.quickTakeawayTitle.taglish}:{' '}
                  </strong>
                  {taglishEntry.quickTakeaway}
                </div>
              )}
            </div>
          )}

          {/* 2. Compact Interactive Visual Diagram */}
          <ConceptDiagramSvg config={lesson.diagramConfig} />

          {/* 3. Scannable Collapsible Lesson Breakdown (reduces text fatigue) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-muted">
                {t('Read Full Breakdown', 'Basahin ang Buong Detalye')} ({lesson.sections.length})
              </h3>
              {lesson.sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => setExpandAllSections((prev) => !prev)}
                  className="text-[11px] font-semibold text-brand hover:underline"
                >
                  {expandAllSections
                    ? t('Collapse', 'Isara')
                    : t('Expand All', 'Buksan Lahat')}
                </button>
              )}
            </div>

            {lesson.sections.map((section, index) => (
              <details
                key={section.id}
                open={expandAllSections || index === 0}
                className="group rounded-xl border border-terminal-border bg-terminal-surface"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 px-3.5 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-brand/30 bg-brand-soft font-mono text-[10px] font-bold text-brand tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold leading-snug text-terminal-text sm:text-[13px]">
                      {section.heading}
                    </span>
                  </div>
                  <ChevronDown
                    className="h-3.5 w-3.5 shrink-0 text-terminal-muted transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="space-y-2.5 border-t border-terminal-border/70 px-3.5 py-3">
                  <p className="text-xs leading-relaxed text-terminal-muted">
                    {expandAcronyms(section.body)}
                  </p>

                  {section.bulletPoints.length > 0 && (
                    <ul className="space-y-1">
                      {section.bulletPoints.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2 text-xs leading-snug text-terminal-text"
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                            aria-hidden="true"
                          />
                          <span>{expandAcronyms(bullet)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="rounded-lg border border-bull/25 bg-bull/10 px-3 py-2 text-xs text-terminal-text">
                    <strong className="font-semibold text-bull">
                      {t('Key Rule:', 'Tandaan:')}{' '}
                    </strong>
                    {expandAcronyms(section.keyTakeaway)}
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* 4. Compact Collapsible Common Beginner Questions (FAQ) */}
          {activeFaqItems.length > 0 && (
            <div className="space-y-2 rounded-xl border border-terminal-border bg-terminal-bg/60 p-3.5">
              <div className="flex items-center gap-2">
                <HelpCircle
                  className="h-3.5 w-3.5 shrink-0 text-sky-500 dark:text-sky-400"
                  aria-hidden="true"
                />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-text">
                  {t('Common Beginner Questions (FAQ)', 'Mga Tanong ng Beginner (FAQ)')}
                </h3>
              </div>
              <div className="space-y-1.5">
                {activeFaqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-lg border border-terminal-border/80 bg-terminal-surface"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 px-3 py-2 text-xs font-medium text-terminal-text">
                      <span>{item.question}</span>
                      <ChevronDown
                        className="h-3.5 w-3.5 shrink-0 text-terminal-muted transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="border-t border-terminal-border/70 px-3 py-2 text-xs leading-relaxed text-terminal-muted">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* 5. Compact Next-Step Row */}
          <div className="flex flex-col gap-2 rounded-xl border border-terminal-border bg-terminal-bg/75 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-terminal-muted">
              {t('See this on a real chart next:', 'Tingnan naman ito sa totoong chart:')}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMode('chart')}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-fg shadow-sm transition-opacity hover:opacity-95 active:scale-[0.98]"
              >
                <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('Open Chart Example', 'Buksan ang Chart')}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('video')}
                className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-3.5 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-sky-500/45 hover:text-sky-600 dark:hover:text-sky-400"
              >
                <PlayCircle className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                <span>{t('Watch Video', 'Panoorin ang Video')}</span>
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
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-terminal-border bg-terminal-bg/60 px-5 py-7 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-400">
                <Youtube className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="max-w-sm space-y-1">
                <p className="text-sm font-semibold text-terminal-text">
                  {t('No YouTube link added yet', 'Wala pang naka-link na YouTube video')}
                </p>
                <p className="text-xs text-terminal-muted">
                  {isAdmin
                    ? 'Paste a YouTube URL with a lesson timestamp — zero downloads, instant redirect.'
                    : t(
                        'Curated YouTube links with timestamps will appear here once published.',
                        'Lalabas dito ang mga napiling YouTube videos na may timestamp.',
                      )}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {isAdmin && (
                  <Link
                    to={`/admin/visual-library?lesson=${lesson.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Paste YouTube Link
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setActiveMode('diagram')}
                  className="rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45"
                >
                  {t('Open Diagram', 'Buksan ang Diagram')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('chart')}
                  className="rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45"
                >
                  {t('Open Chart', 'Buksan ang Chart')}
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
              <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
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
                      className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1 text-[11px] font-medium text-terminal-muted transition-colors hover:border-brand/45 hover:text-brand"
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
                    {t('Save', 'I-Save')}
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkWatched}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      watchedIds[activeResourceBundle.resource.id]
                        ? 'border-bull bg-bull/15 text-bull'
                        : 'border-brand/40 bg-brand text-brand-fg hover:opacity-95'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {watchedIds[activeResourceBundle.resource.id]
                      ? t('Watched', 'Napanood')
                      : t('Mark Watched', 'Tapos Panoorin')}
                  </button>
                </div>
              </div>

              {/* Compact Multi-Video Switcher */}
              {externalVideoResources.length > 1 && (
                <div className="overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface">
                  <div className="flex items-center justify-between border-b border-terminal-border bg-terminal-elevated/40 px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <PlayCircle
                        className="h-3.5 w-3.5 text-brand"
                        aria-hidden="true"
                      />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-text">
                        {t('More Videos', 'Iba Pang Video')}
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] text-terminal-muted tabular-nums">
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
                              ? 'bg-brand-soft/60'
                              : 'hover:bg-terminal-elevated/40'
                          }`}
                        >
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => handleSelectVideoResource(item.resource.id)}
                            className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-lg text-left transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            <div
                              className={`relative aspect-video w-20 shrink-0 overflow-hidden rounded-lg border bg-[#131110] ${
                                isSelected
                                  ? 'border-brand/70'
                                  : 'border-terminal-border group-hover:border-brand/40'
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
                                <div className="flex h-full w-full items-center justify-center bg-terminal-elevated text-terminal-muted">
                                  <Youtube className="h-4 w-4" aria-hidden="true" />
                                </div>
                              )}

                              <span
                                className="absolute inset-0 flex items-center justify-center bg-black/25"
                                aria-hidden="true"
                              >
                                <span
                                  className={`flex h-5 w-5 items-center justify-center rounded-full shadow-sm ${
                                    isSelected
                                      ? 'bg-brand text-brand-fg'
                                      : 'bg-black/80 text-white'
                                  }`}
                                >
                                  <Play className="ml-0.5 h-2.5 w-2.5 fill-current" />
                                </span>
                              </span>

                              {item.resource.durationSeconds !== null && (
                                <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 font-mono text-[9px] font-medium leading-none text-white tabular-nums">
                                  {formatTimestamp(item.resource.durationSeconds)}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p
                                className={`truncate text-xs font-semibold transition-colors ${
                                  isSelected
                                    ? 'text-brand'
                                    : 'text-terminal-text group-hover:text-brand'
                                }`}
                              >
                                {item.resource.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex max-w-[160px] items-center truncate rounded-full border border-terminal-border bg-terminal-bg px-2 py-0.5 text-[10px] font-medium text-terminal-muted">
                                  {item.resource.sourceName}
                                </span>
                                {isSelected && (
                                  <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-brand">
                                    {t('Selected', 'Napili')}
                                  </span>
                                )}
                                {watchedIds[item.resource.id] && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-bull">
                                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                    {t('Watched', 'Napanood')}
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
                              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-sky-500/35 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-600 transition-colors hover:bg-sky-500 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:text-sky-400 dark:hover:text-slate-950"
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
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-terminal-text">
                    <span>
                      {t('Study Notes (Before & After Watching)', 'Gabay Bago at Pagkatapos Manood')}
                    </span>
                    <ChevronDown
                      className="h-3.5 w-3.5 text-terminal-muted transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="space-y-2.5 border-t border-terminal-border px-3 py-2.5 text-xs">
                    {activeResourceBundle.mapping.beforeWatchContext && (
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-500 dark:text-sky-400">
                          Before Watching — What to Look For
                        </p>
                        <p className="mt-1 leading-relaxed text-terminal-muted">
                          {expandAcronyms(activeResourceBundle.mapping.beforeWatchContext)}
                        </p>
                      </div>
                    )}
                    {activeResourceBundle.mapping.afterWatchTakeaways.length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-bull">
                          {t('After Watching — Key Takeaways', 'Pagkatapos Manood — Tandaan')}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {activeResourceBundle.mapping.afterWatchTakeaways.map((takeaway) => (
                            <li
                              key={takeaway}
                              className="flex items-start gap-2 leading-relaxed text-terminal-text"
                            >
                              <CheckCircle2
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bull"
                                aria-hidden="true"
                              />
                              <span>{expandAcronyms(takeaway)}</span>
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
        <div className="space-y-2.5">
          {scenarios.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {scenarios.map((scenario, index) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenarioIndex(index)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    index === selectedScenarioIndex
                      ? 'border-brand bg-brand-soft font-semibold text-brand'
                      : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {expandAcronyms(scenario.title)}
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
              {t(
                'No historical candlestick scenarios linked to this lesson yet.',
                'Wala pang naka-link na historical chart para sa lesson na ito.',
              )}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Key Terminology (Acronym Glossary) */}
      {lesson.terminology.length > 0 && (
        <details className="group rounded-xl border border-terminal-border bg-terminal-bg/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2 text-xs font-medium text-terminal-text">
            <span>
              {t(
                `Key Terms & Acronyms (${lesson.terminology.length})`,
                `Mga Term at Acronym (${lesson.terminology.length})`,
              )}
            </span>
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
                    <span className="rounded bg-brand-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand">
                      {entry.shortCode}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-terminal-muted">
                  {expandAcronyms(entry.definition)}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
