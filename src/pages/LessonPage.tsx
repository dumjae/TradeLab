import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  GraduationCap,
  HelpCircle,
  X,
} from 'lucide-react';
import { LessonKnowledgeCheck } from '../components/learning/LessonKnowledgeCheck';
import { AIMentorPanel } from '../components/mentor/AIMentorPanel';
import { ExplainDifferentlyPanel } from '../components/visual-learning/ExplainDifferentlyPanel';
import { VisualExplanationsSection } from '../components/visual-learning/VisualExplanationsSection';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTopicsLinkedToDeepLesson } from '../data/academyRoadmap';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
  LESSON_STAGES,
  getLessonBySlug,
} from '../data/curriculum';
import { LESSON_TAGLISH_SUMMARIES, UI_COPY } from '../data/taglishTranslations';
import { expandAcronyms } from '../lib/acronymHelper';
import {
  listLessonProgress,
  toggleLessonCompleted,
} from '../services/progressService';
import { getPublishedLessonResources } from '../services/visualResourcesService';
import type {
  LearningViewMode,
  PracticeQuestion,
} from '../types/academy';
import type { SyllabusQuizQuestion } from '../types/curriculum-tree';
import type { LessonResourceWithDetails, MentorCitation } from '../types/visual-learning';

type CompanionTab = 'mentor' | 'explain';

function formatModuleOrder(order: number): string {
  return String(order).padStart(2, '0');
}

function parseModeParam(raw: string | null): LearningViewMode {
  if (raw === 'text' || raw === 'diagram' || raw === 'video' || raw === 'chart') {
    return raw;
  }
  return 'text';
}

function toSyllabusQuizQuestion(question: PracticeQuestion): SyllabusQuizQuestion {
  const optionLabels = question.options.map((opt) => opt.label);
  const paddedOptions: [string, string, string, string] = [
    optionLabels[0] ?? 'Option A',
    optionLabels[1] ?? 'Option B',
    optionLabels[2] ?? 'Option C',
    optionLabels[3] ?? 'Option D',
  ];
  const foundIdx = question.options.findIndex((opt) => opt.id === question.correctOptionId);
  const correctIndex = (foundIdx >= 0 && foundIdx <= 3 ? foundIdx : 0) as 0 | 1 | 2 | 3;

  return {
    prompt: question.prompt,
    options: paddedOptions,
    correctIndex,
    rationale: question.postSubmissionRationale,
    commonTrap: question.commonTrapNote,
  };
}

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { isTaglish, t } = useLanguage();

  const lesson = useMemo(
    () => (slug ? getLessonBySlug(slug) : undefined) ?? CURRICULUM_LESSONS[0],
    [slug],
  );

  const marketMeta = useMemo(
    () =>
      LESSON_MARKET_CATEGORIES.find((item) => item.id === lesson.marketCategory) ?? {
        id: lesson.marketCategory,
        label: lesson.marketCategory,
        shortCode: lesson.marketCategory.toUpperCase(),
      },
    [lesson.marketCategory],
  );

  const stageMeta = useMemo(
    () => LESSON_STAGES.find((stage) => stage.id === lesson.learningStage),
    [lesson.learningStage],
  );

  const [resources, setResources] = useState<LessonResourceWithDetails[]>([]);
  const [tutorialMode, setTutorialMode] = useState<boolean>(false);
  const [objectivesOpen, setObjectivesOpen] = useState<boolean>(false);
  const [companionOpen, setCompanionOpen] = useState<boolean>(false);
  const [companionTab, setCompanionTab] = useState<CompanionTab>('mentor');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [togglingComplete, setTogglingComplete] = useState<boolean>(false);

  const initialMode = parseModeParam(searchParams.get('mode'));
  const initialResourceId = searchParams.get('resource');
  const rawTimestamp = searchParams.get('t');
  const initialTimestampSeconds =
    rawTimestamp && /^\d+$/.test(rawTimestamp) ? Number.parseInt(rawTimestamp, 10) : null;

  useEffect(() => {
    setObjectivesOpen(false);
    setCompanionOpen(false);
  }, [lesson.slug]);

  useEffect(() => {
    if (!companionOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCompanionOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [companionOpen]);

  useEffect(() => {
    let active = true;
    const loadResources = async () => {
      const [published, progressRecords] = await Promise.all([
        getPublishedLessonResources(lesson.slug),
        listLessonProgress(),
      ]);
      if (active) {
        setResources(published);
        const match = progressRecords.find((record) => record.lessonSlug === lesson.slug);
        setIsCompleted(Boolean(match?.completed));
      }
    };
    void loadResources();
    return () => {
      active = false;
    };
  }, [lesson.slug]);

  const handleToggleComplete = async () => {
    if (togglingComplete) {
      return;
    }
    setTogglingComplete(true);
    try {
      const updated = await toggleLessonCompleted(lesson.slug, !isCompleted);
      setIsCompleted(updated.completed);
    } finally {
      setTogglingComplete(false);
    }
  };

  const currentIndex = CURRICULUM_LESSONS.findIndex((item) => item.slug === lesson.slug);
  const prevLesson = currentIndex > 0 ? CURRICULUM_LESSONS[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < CURRICULUM_LESSONS.length - 1
      ? CURRICULUM_LESSONS[currentIndex + 1]
      : null;

  const jumpToVideoResource = (resourceId: string, startSeconds?: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('mode', 'video');
    next.set('resource', resourceId);
    if (startSeconds !== undefined && startSeconds > 0) {
      next.set('t', String(Math.floor(startSeconds)));
    } else {
      next.delete('t');
    }
    setSearchParams(next, { replace: true });
    setCompanionOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCitation = (citation: MentorCitation) => {
    jumpToVideoResource(citation.resourceId, citation.startSeconds);
  };

  const expandedTitle = expandAcronyms(lesson.title);
  const compactSubtitle = isTaglish
    ? (LESSON_TAGLISH_SUMMARIES[lesson.slug]?.quickTakeaway ??
      LESSON_TAGLISH_SUMMARIES[lesson.slug]?.plainSummary ??
      expandAcronyms(lesson.plainEnglishSummary ?? ''))
    : expandAcronyms(lesson.plainEnglishSummary ?? '');

  const inlineQuizQuestion = useMemo(
    () =>
      lesson.practiceQuestions.length > 0
        ? toSyllabusQuizQuestion(lesson.practiceQuestions[0])
        : null,
    [lesson.practiceQuestions],
  );

  const linkedSyllabusTopics = useMemo(
    () => getTopicsLinkedToDeepLesson(lesson.slug),
    [lesson.slug],
  );

  return (
    <div className="tl-page-enter mx-auto max-w-4xl space-y-8">
      {/* Unboxed Editorial Lesson Masthead */}
      <header className="space-y-4 border-b border-terminal-border pb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-terminal-muted">
          <Link
            to="/academy"
            aria-label="Back to Trading Academy catalog"
            className="inline-flex items-center gap-1.5 font-medium text-terminal-muted transition-colors hover:text-terminal-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {t(UI_COPY.lesson.backToAcademy.en, UI_COPY.lesson.backToAcademy.taglish)}
            </span>
          </Link>

          <span className="text-terminal-border" aria-hidden="true">
            /
          </span>

          <span className="font-mono text-[11px] tabular-nums text-terminal-muted">
            Module {formatModuleOrder(lesson.moduleOrder)} · {marketMeta.label}
            {stageMeta ? ` · Stage ${stageMeta.step}` : ''} · {lesson.estimatedMinutes}m
          </span>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-bull">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              {t('Completed', 'Tapos Na')}
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          <h1 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-terminal-text text-balance sm:text-3xl">
            {expandedTitle}
          </h1>

          {compactSubtitle && (
            <p className="max-w-[65ch] text-sm leading-relaxed text-terminal-muted sm:text-[15px]">
              {compactSubtitle}
            </p>
          )}
        </div>

        {/* Crisp Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setCompanionTab('mentor');
              setCompanionOpen(true);
            }}
            className="tl-press inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
          >
            <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('Study Companion (AI Mentor)', 'Study Companion (AI Mentor)')}</span>
          </button>

          <button
            type="button"
            onClick={() => void handleToggleComplete()}
            disabled={togglingComplete}
            aria-pressed={isCompleted}
            className={`tl-press inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-60 ${
              isCompleted
                ? 'border-bull/45 bg-bull/10 font-semibold text-bull'
                : 'border-terminal-border bg-terminal-surface text-terminal-text hover:border-bull/45 hover:text-bull'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('Completed', 'Tapos Na')}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {t(UI_COPY.lesson.markComplete.en, UI_COPY.lesson.markComplete.taglish)}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTutorialMode((prev) => !prev)}
            aria-pressed={tutorialMode}
            title={t('Step-by-step guided study bar', 'Step-by-step na gabay sa pag-aaral')}
            className={`tl-press inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
              tutorialMode
                ? 'border-sky-500/50 bg-sky-500/10 font-semibold text-sky-600 dark:text-sky-400'
                : 'border-terminal-border bg-terminal-surface text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
            }`}
          >
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {tutorialMode
                ? t('Guided: ON', 'Gabay: ON')
                : t('Guided Steps', 'Gabay')}
            </span>
          </button>

          <Link
            to={`/practice/${lesson.slug}`}
            className="tl-press inline-flex items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45 hover:text-brand-text"
          >
            <GraduationCap className="h-3.5 w-3.5 text-brand-text" aria-hidden="true" />
            <span>{t('Practice', 'Mag-Quiz')}</span>
          </Link>
        </div>
      </header>

      {/* Clean Collapsible Learning Objectives */}
      {lesson.learningObjectives.length > 0 && (
        <section
          aria-label={t('Learning Objectives', 'Mga Layunin sa Pag-aaral')}
          className="border-b border-terminal-border pb-4"
        >
          <button
            type="button"
            onClick={() => setObjectivesOpen((prev) => !prev)}
            aria-expanded={objectivesOpen}
            className="flex w-full items-center justify-between gap-3 py-1 text-left text-xs font-semibold text-terminal-text transition-colors hover:text-brand-text sm:text-sm"
          >
            <span>
              {t('Learning Objectives', 'Mga Layunin sa Pag-aaral')}{' '}
              <span className="font-mono text-xs font-normal text-terminal-muted tabular-nums">
                ({lesson.learningObjectives.length})
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-terminal-muted transition-transform ${
                objectivesOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {objectivesOpen && (
            <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2.5 pt-2 sm:grid-cols-2">
              {lesson.learningObjectives.map((objective, idx) => (
                <li
                  key={objective}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-terminal-text sm:text-sm"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-[11px] font-semibold text-bull tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="max-w-[68ch]">{expandAcronyms(objective)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Focused Single-Column Visual Explanations */}
      <VisualExplanationsSection
        lesson={lesson}
        resources={resources}
        tutorialMode={tutorialMode}
        isAdmin={user?.role === 'admin'}
        initialMode={initialMode}
        initialResourceId={initialResourceId}
        initialTimestampSeconds={initialTimestampSeconds}
      />

      {/* 5. Unboxed Knowledge Check Section */}
      {inlineQuizQuestion && (
        <section
          aria-labelledby="lesson-knowledge-check-heading"
          className="space-y-4 border-t border-terminal-border pt-8"
        >
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xs font-medium text-terminal-muted tabular-nums">
              05
            </span>
            <h2
              id="lesson-knowledge-check-heading"
              className="text-base font-semibold tracking-tight text-terminal-text sm:text-lg"
            >
              {t('5. Knowledge Check', '5. Pagsusulit sa Aralin')}
            </h2>
          </div>
          <LessonKnowledgeCheck question={inlineQuizQuestion} />
        </section>
      )}

      {/* Compact Linked Master Syllabus Topics Strip */}
      {linkedSyllabusTopics.length > 0 && (
        <section
          aria-label={t('Linked Master Syllabus Topics', 'Kaugnay na Master Syllabus Topics')}
          className="space-y-3 border-t border-terminal-border pt-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-terminal-text">
              {t(
                'Linked Syllabus Topics',
                'Mga Kaugnay na Syllabus Topics',
              )}
            </h2>
            <span className="font-mono text-xs text-terminal-muted tabular-nums">
              {linkedSyllabusTopics.length}{' '}
              {t(linkedSyllabusTopics.length === 1 ? 'topic' : 'topics', 'paksa')}
            </span>
          </div>

          <ul className="divide-y divide-terminal-border border-y border-terminal-border">
            {linkedSyllabusTopics.map((topic) => (
              <li key={topic.code}>
                <Link
                  to={`/academy/topic/${topic.slug}`}
                  className="tl-row-interactive group flex items-center justify-between gap-3 py-2.5 text-xs hover:text-brand-text sm:text-sm"
                >
                  <div className="flex min-w-0 items-baseline gap-3">
                    <span className="shrink-0 font-mono text-xs font-semibold text-brand-text tabular-nums">
                      {topic.code}
                    </span>
                    <span className="truncate font-medium text-terminal-text group-hover:text-brand-text">
                      {topic.title}
                    </span>
                  </div>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 text-terminal-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-text"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Publication-Style Previous / Next Lesson Footer */}
      <nav
        aria-label="Lesson module pagination"
        className="grid grid-cols-1 gap-4 border-t border-terminal-border pt-6 sm:grid-cols-2"
      >
        <div>
          {prevLesson ? (
            <Link
              to={`/academy/${prevLesson.slug}`}
              className="tl-row-interactive group flex flex-col gap-1 rounded-md py-1.5 text-left"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
                <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                <span>
                  {t('Previous', 'Nakaraan')} · {formatModuleOrder(prevLesson.moduleOrder)}
                </span>
              </span>
              <span className="text-sm font-semibold text-terminal-text transition-colors group-hover:text-brand-text">
                {expandAcronyms(prevLesson.title.split('(')[0].trim())}
              </span>
            </Link>
          ) : (
            <Link
              to="/academy"
              className="tl-row-interactive group flex flex-col gap-1 rounded-md py-1.5 text-left"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
                <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                <span>{t('Catalog', 'Katalogo')}</span>
              </span>
              <span className="text-sm font-semibold text-terminal-text transition-colors group-hover:text-brand-text">
                {t('All Academy Lessons', 'Lahat ng Aralin')}
              </span>
            </Link>
          )}
        </div>

        <div className="sm:text-right">
          {nextLesson ? (
            <Link
              to={`/academy/${nextLesson.slug}`}
              className="tl-row-interactive group flex flex-col gap-1 rounded-md py-1.5 sm:items-end"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
                <span>
                  {t('Next', 'Susunod')} · {formatModuleOrder(nextLesson.moduleOrder)}
                </span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-brand-text transition-opacity group-hover:opacity-85">
                {expandAcronyms(nextLesson.title.split('(')[0].trim())}
              </span>
            </Link>
          ) : (
            <Link
              to="/practice"
              className="tl-row-interactive group flex flex-col gap-1 rounded-md py-1.5 sm:items-end"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
                <span>{t('Continue', 'Magpatuloy')}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-brand-text">
                {t('Practice Drills', 'Mag-Practice')}
              </span>
            </Link>
          )}
        </div>
      </nav>

      {/* On-Demand Slide-Over Study Companion Drawer */}
      {companionOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Dismiss study companion backdrop"
            onClick={() => setCompanionOpen(false)}
            className="fixed inset-0 bg-black/50 transition-opacity"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label={t('Study Companion', 'Study Companion')}
            className="tl-drawer-enter relative z-10 flex h-full w-full max-w-md flex-col border-l border-terminal-border bg-terminal-surface shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-3 border-b border-terminal-border px-5 py-4">
              <div className="min-w-0 space-y-0.5">
                <h2 className="text-sm font-semibold tracking-tight text-terminal-text">
                  {t('Study Companion', 'Study Companion')}
                </h2>
                <p className="truncate font-mono text-[11px] text-terminal-muted">
                  Module {formatModuleOrder(lesson.moduleOrder)} · {lesson.title}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close study companion"
                onClick={() => setCompanionOpen(false)}
                className="tl-press inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Clean Underline Companion Tabs */}
            <div
              role="tablist"
              aria-label="Study companion mode"
              className="flex items-center gap-6 border-b border-terminal-border px-5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={companionTab === 'mentor'}
                onClick={() => setCompanionTab('mentor')}
                className={`-mb-px inline-flex items-center gap-1.5 border-b-2 py-3 text-xs transition-colors ${
                  companionTab === 'mentor'
                    ? 'border-brand font-semibold text-terminal-text'
                    : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('AI Mentor', 'AI Mentor')}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={companionTab === 'explain'}
                onClick={() => setCompanionTab('explain')}
                className={`-mb-px inline-flex items-center gap-1.5 border-b-2 py-3 text-xs transition-colors ${
                  companionTab === 'explain'
                    ? 'border-brand font-semibold text-terminal-text'
                    : 'border-transparent font-medium text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('Explain Differently', 'Iba Pang Paliwanag')}</span>
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className={companionTab === 'mentor' ? 'block' : 'hidden'}>
                <AIMentorPanel
                  lesson={lesson}
                  mode={tutorialMode ? 'tutorial' : 'lesson'}
                  onSelectCitation={handleSelectCitation}
                />
              </div>
              <div className={companionTab === 'explain' ? 'block' : 'hidden'}>
                <ExplainDifferentlyPanel
                  lesson={lesson}
                  mode={tutorialMode ? 'tutorial' : 'lesson'}
                  onJumpToCitation={jumpToVideoResource}
                />
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
