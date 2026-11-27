import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  GraduationCap,
  HelpCircle,
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
  LessonMarketCategory,
  PracticeQuestion,
} from '../types/academy';
import type { SyllabusQuizQuestion } from '../types/curriculum-tree';
import type { LessonResourceWithDetails, MentorCitation } from '../types/visual-learning';

type MobileWorkspaceTab = 'study' | 'explain' | 'mentor';
type DesktopSideTab = 'mentor' | 'explain';

const MARKET_BADGE_STYLES: Record<LessonMarketCategory, string> = {
  general: 'border-brand/35 bg-brand-soft text-brand-text',
  forex: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  indices: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  crypto: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  stocks: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

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
  const [mobileTab, setMobileTab] = useState<MobileWorkspaceTab>('study');
  const [desktopSideTab, setDesktopSideTab] = useState<DesktopSideTab>('mentor');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [togglingComplete, setTogglingComplete] = useState<boolean>(false);

  const initialMode = parseModeParam(searchParams.get('mode'));
  const initialResourceId = searchParams.get('resource');
  const rawTimestamp = searchParams.get('t');
  const initialTimestampSeconds =
    rawTimestamp && /^\d+$/.test(rawTimestamp) ? Number.parseInt(rawTimestamp, 10) : null;

  useEffect(() => {
    setObjectivesOpen(false);
    setMobileTab('study');
  }, [lesson.slug]);

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
    setMobileTab('study');
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
    <div className="mx-auto max-w-7xl space-y-3.5">
      {/* Crisp TradingView Lesson Header */}
      <header className="rounded-xl border border-terminal-border bg-terminal-surface px-3.5 py-3 sm:px-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                to="/academy"
                aria-label="Back to Trading Academy catalog"
                className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md border border-terminal-border bg-terminal-bg px-2 text-[11px] font-medium text-terminal-muted transition-colors hover:border-brand/45 hover:bg-terminal-elevated hover:text-terminal-text"
              >
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {t(UI_COPY.lesson.backToAcademy.en, UI_COPY.lesson.backToAcademy.taglish)}
                </span>
              </Link>

              <span className="shrink-0 rounded border border-brand/35 bg-brand-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-text tabular-nums">
                {formatModuleOrder(lesson.moduleOrder)}
              </span>

              <span
                className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold ${MARKET_BADGE_STYLES[lesson.marketCategory]}`}
              >
                {marketMeta.label}
              </span>

              {stageMeta && (
                <span className="hidden shrink-0 items-center rounded border border-terminal-border bg-terminal-bg px-2 py-0.5 text-[10px] font-medium text-terminal-muted md:inline-flex">
                  Stage {stageMeta.step}
                </span>
              )}

              <span className="inline-flex items-center gap-1 rounded border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] text-terminal-muted tabular-nums">
                <Clock className="h-2.5 w-2.5 text-sky-400" aria-hidden="true" />
                {lesson.estimatedMinutes}m
              </span>
            </div>

            <h1 className="text-sm font-bold leading-snug tracking-tight text-terminal-text sm:text-base">
              {expandedTitle}
            </h1>

            {compactSubtitle && (
              <p className="line-clamp-1 text-xs text-terminal-muted">
                {compactSubtitle}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            {lesson.learningObjectives.length > 0 && (
              <button
                type="button"
                onClick={() => setObjectivesOpen((prev) => !prev)}
                aria-expanded={objectivesOpen}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  objectivesOpen
                    ? 'border-brand/45 bg-brand-soft text-brand-text'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                }`}
              >
                <span>{t('Goals', 'Layunin')}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${objectivesOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            )}

            <button
              type="button"
              onClick={() => setTutorialMode((prev) => !prev)}
              aria-pressed={tutorialMode}
              title={t('Step-by-step guided study bar', 'Step-by-step na gabay sa pag-aaral')}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                tutorialMode
                  ? 'border-sky-500 bg-sky-500 font-semibold text-slate-950'
                  : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-sky-500/40 hover:bg-terminal-elevated hover:text-sky-500 dark:hover:text-sky-400'
              }`}
            >
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {tutorialMode
                  ? t('Guided: ON', 'Gabay: ON')
                  : t('Guided Steps', 'Gabay')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => void handleToggleComplete()}
              disabled={togglingComplete}
              aria-pressed={isCompleted}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                isCompleted
                  ? 'border-bull/45 bg-bull/15 text-bull'
                  : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-bull/45 hover:bg-terminal-elevated hover:text-bull'
              }`}
            >
              {isCompleted ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('Completed ✓', 'Tapos Na ✓')}</span>
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

            <Link
              to={`/practice/${lesson.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              {t('Practice', 'Mag-Quiz')}
            </Link>
          </div>
        </div>

        {/* Collapsible Objectives Drawer (collapsed by default) */}
        {objectivesOpen && lesson.learningObjectives.length > 0 && (
          <div className="mt-2.5 grid grid-cols-1 gap-1.5 border-t border-terminal-border pt-2.5 sm:grid-cols-2">
            {lesson.learningObjectives.map((objective) => (
              <div key={objective} className="flex items-start gap-2 text-xs text-terminal-text">
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bull"
                  aria-hidden="true"
                />
                <span>{expandAcronyms(objective)}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Mobile / Tablet Workspace Tab Switcher */}
      <div
        role="tablist"
        aria-label="Lesson workspace views"
        className="grid grid-cols-3 gap-1 rounded-lg border border-terminal-border bg-terminal-surface p-1 xl:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'study'}
          onClick={() => setMobileTab('study')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-colors ${
            mobileTab === 'study'
              ? 'bg-brand text-brand-fg'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          {t('Study', 'Mag-Aral')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'explain'}
          onClick={() => setMobileTab('explain')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-colors ${
            mobileTab === 'explain'
              ? 'bg-brand text-brand-fg'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {t('Explain', 'Paliwanag')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'mentor'}
          onClick={() => setMobileTab('mentor')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-colors ${
            mobileTab === 'mentor'
              ? 'bg-brand text-brand-fg'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
          {t('AI Mentor', 'AI Mentor')}
        </button>
      </div>

      {/* Main 2-Column App Layout */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div
          className={`${mobileTab === 'study' ? 'block' : 'hidden'} space-y-4 xl:col-span-8 xl:block`}
        >
          <VisualExplanationsSection
            lesson={lesson}
            resources={resources}
            tutorialMode={tutorialMode}
            isAdmin={user?.role === 'admin'}
            initialMode={initialMode}
            initialResourceId={initialResourceId}
            initialTimestampSeconds={initialTimestampSeconds}
          />

          {/* 5. Inline Knowledge Check */}
          {inlineQuizQuestion && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-0.5">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-brand/35 bg-brand-soft font-mono text-[10px] font-bold text-brand-text tabular-nums">
                  5
                </span>
                <h2 className="text-xs font-bold tracking-tight text-terminal-text sm:text-sm">
                  {t('5. Knowledge Check', '5. Pagsusulit sa Aralin')}
                </h2>
              </div>
              <LessonKnowledgeCheck question={inlineQuizQuestion} compact />
            </div>
          )}

          {/* Linked Master Syllabus Topics */}
          {linkedSyllabusTopics.length > 0 && (
            <section
              aria-label={t('Linked Master Syllabus Topics', 'Kaugnay na Master Syllabus Topics')}
              className="rounded-xl border border-terminal-border bg-terminal-surface p-3.5 sm:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-brand-text" aria-hidden="true" />
                  <p className="text-xs font-bold text-terminal-text">
                    {t(
                      'Master Syllabus Topics Linked to This Deep Lesson',
                      'Mga Master Syllabus Topic na Nakakonekta Dito',
                    )}
                  </p>
                </div>
                <span className="rounded border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] font-semibold text-terminal-muted tabular-nums">
                  {linkedSyllabusTopics.length}{' '}
                  {t(
                    linkedSyllabusTopics.length === 1 ? 'topic' : 'topics',
                    'paksa',
                  )}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {linkedSyllabusTopics.map((topic) => (
                  <Link
                    key={topic.code}
                    to={`/academy/topic/${topic.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-[11px] font-medium text-terminal-text transition-colors hover:border-brand/50 hover:bg-terminal-elevated hover:text-brand-text"
                  >
                    <span className="font-mono font-bold text-brand-text">{topic.code}</span>
                    <span className="max-w-[240px] truncate">{topic.title}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 opacity-70" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="xl:col-span-4">
          <div className="space-y-3 xl:sticky xl:top-16">
            {/* Desktop Right-Pane Tab Switcher (AI Mentor | Explain) */}
            <div
              role="tablist"
              aria-label="Assistant panel view"
              className="hidden grid-cols-2 gap-1 rounded-lg border border-terminal-border bg-terminal-surface p-1 xl:grid"
            >
              <button
                type="button"
                role="tab"
                aria-selected={desktopSideTab === 'mentor'}
                onClick={() => setDesktopSideTab('mentor')}
                className={`inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-colors ${
                  desktopSideTab === 'mentor'
                    ? 'bg-brand text-brand-fg'
                    : 'text-terminal-muted hover:bg-terminal-elevated/70 hover:text-terminal-text'
                }`}
              >
                <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                {t('AI Mentor', 'AI Mentor')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={desktopSideTab === 'explain'}
                onClick={() => setDesktopSideTab('explain')}
                className={`inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-colors ${
                  desktopSideTab === 'explain'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-terminal-muted hover:bg-terminal-elevated/70 hover:text-terminal-text'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {t('Explain Simpler', 'Iba Pang Paliwanag')}
              </button>
            </div>

            <div
              className={`${mobileTab === 'mentor' ? 'block' : 'hidden'} ${
                desktopSideTab === 'mentor' ? 'xl:block' : 'xl:hidden'
              }`}
            >
              <AIMentorPanel
                lesson={lesson}
                mode={tutorialMode ? 'tutorial' : 'lesson'}
                onSelectCitation={handleSelectCitation}
              />
            </div>

            <div
              className={`${mobileTab === 'explain' ? 'block' : 'hidden'} ${
                desktopSideTab === 'explain' ? 'xl:block' : 'xl:hidden'
              }`}
            >
              <ExplainDifferentlyPanel
                lesson={lesson}
                mode={tutorialMode ? 'tutorial' : 'lesson'}
                onJumpToCitation={jumpToVideoResource}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Compact Prev / Next Module Navigation */}
      <nav
        aria-label="Lesson module pagination"
        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-terminal-border bg-terminal-surface px-3.5 py-2.5"
      >
        {prevLesson ? (
          <Link
            to={`/academy/${prevLesson.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/50 hover:bg-terminal-elevated hover:text-brand-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {t('Prev:', 'Bago:')} {formatModuleOrder(prevLesson.moduleOrder)}.{' '}
              {expandAcronyms(prevLesson.title.split('(')[0].trim())}
            </span>
          </Link>
        ) : (
          <Link
            to="/academy"
            className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-1.5 text-xs font-semibold text-terminal-muted transition-colors hover:border-brand/50 hover:bg-terminal-elevated hover:text-terminal-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('All Lessons', 'Lahat ng Aralin')}</span>
          </Link>
        )}

        {nextLesson ? (
          <Link
            to={`/academy/${nextLesson.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
          >
            <span>
              {t('Next:', 'Sunod:')} {formatModuleOrder(nextLesson.moduleOrder)}.{' '}
              {expandAcronyms(nextLesson.title.split('(')[0].trim())}
            </span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : (
          <Link
            to="/practice"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
          >
            {t('Practice Drills', 'Mag-Practice')}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  );
}
