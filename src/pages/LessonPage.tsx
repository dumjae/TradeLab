import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import { AIMentorPanel } from '../components/mentor/AIMentorPanel';
import { ExplainDifferentlyPanel } from '../components/visual-learning/ExplainDifferentlyPanel';
import { VisualExplanationsSection } from '../components/visual-learning/VisualExplanationsSection';
import { useAuth } from '../context/AuthContext';
import { CURRICULUM_LESSONS, getLessonBySlug } from '../data/curriculum';
import { getPublishedLessonResources } from '../services/visualResourcesService';
import type { LearningViewMode } from '../types/academy';
import type { LessonResourceWithDetails, MentorCitation } from '../types/visual-learning';

type MobileWorkspaceTab = 'study' | 'explain' | 'mentor';
type DesktopSideTab = 'mentor' | 'explain';

function parseModeParam(raw: string | null): LearningViewMode {
  if (raw === 'text' || raw === 'diagram' || raw === 'video' || raw === 'chart') {
    return raw;
  }
  return 'text';
}

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const lesson = useMemo(
    () => (slug ? getLessonBySlug(slug) : undefined) ?? CURRICULUM_LESSONS[0],
    [slug],
  );

  const [resources, setResources] = useState<LessonResourceWithDetails[]>([]);
  const [tutorialMode, setTutorialMode] = useState<boolean>(false);
  const [objectivesOpen, setObjectivesOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<MobileWorkspaceTab>('study');
  const [desktopSideTab, setDesktopSideTab] = useState<DesktopSideTab>('mentor');

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
      const published = await getPublishedLessonResources(lesson.slug);
      if (active) {
        setResources(published);
      }
    };
    void loadResources();
    return () => {
      active = false;
    };
  }, [lesson.slug]);

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

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Ultra-Clean Single-Row App Header */}
      <header className="rounded-2xl border border-terminal-border bg-terminal-surface px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="shrink-0 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              0{lesson.moduleOrder}
            </span>
            <h1 className="truncate text-base font-bold tracking-tight text-terminal-text sm:text-lg">
              {lesson.title}
            </h1>
            <span className="hidden items-center gap-1 rounded-full border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[11px] text-terminal-muted tabular-nums sm:inline-flex">
              <Clock className="h-3 w-3 text-sky-400" aria-hidden="true" />
              {lesson.estimatedMinutes}m
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {lesson.learningObjectives.length > 0 && (
              <button
                type="button"
                onClick={() => setObjectivesOpen((prev) => !prev)}
                aria-expanded={objectivesOpen}
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                  objectivesOpen
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <span>Objectives</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${objectivesOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            )}

            <button
              type="button"
              onClick={() => setTutorialMode((prev) => !prev)}
              aria-pressed={tutorialMode}
              title="Step-by-step guided study bar"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                tutorialMode
                  ? 'border-sky-500 bg-sky-500 text-slate-950 font-semibold'
                  : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400'
              }`}
            >
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{tutorialMode ? 'Guide: ON' : 'Guide'}</span>
            </button>

            <Link
              to={`/practice/${lesson.slug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              Practice
            </Link>
          </div>
        </div>

        {/* Collapsible Objectives Drawer (collapsed by default) */}
        {objectivesOpen && lesson.learningObjectives.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-1.5 border-t border-terminal-border pt-3 sm:grid-cols-2">
            {lesson.learningObjectives.map((objective) => (
              <div key={objective} className="flex items-start gap-2 text-xs text-terminal-text">
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                  aria-hidden="true"
                />
                <span>{objective}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Mobile / Tablet Workspace Tab Switcher */}
      <div
        role="tablist"
        aria-label="Lesson workspace views"
        className="grid grid-cols-3 gap-1 rounded-xl border border-terminal-border bg-terminal-surface p-1 xl:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'study'}
          onClick={() => setMobileTab('study')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
            mobileTab === 'study'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          Study
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'explain'}
          onClick={() => setMobileTab('explain')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
            mobileTab === 'explain'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Explain
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'mentor'}
          onClick={() => setMobileTab('mentor')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
            mobileTab === 'mentor'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
          AI Mentor
        </button>
      </div>

      {/* Main 2-Column App Layout */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div
          className={`${mobileTab === 'study' ? 'block' : 'hidden'} xl:col-span-8 xl:block`}
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
        </div>

        <aside className="xl:col-span-4">
          <div className="space-y-3 xl:sticky xl:top-20">
            {/* Desktop Right-Pane Tab Switcher (AI Mentor | Explain) */}
            <div
              role="tablist"
              aria-label="Assistant panel view"
              className="hidden grid-cols-2 gap-1 rounded-xl border border-terminal-border bg-terminal-surface p-1 xl:grid"
            >
              <button
                type="button"
                role="tab"
                aria-selected={desktopSideTab === 'mentor'}
                onClick={() => setDesktopSideTab('mentor')}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                  desktopSideTab === 'mentor'
                    ? 'bg-sky-500 text-slate-950'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                AI Mentor
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={desktopSideTab === 'explain'}
                onClick={() => setDesktopSideTab('explain')}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                  desktopSideTab === 'explain'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Explain
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
        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-terminal-border bg-terminal-surface px-4 py-3"
      >
        {prevLesson ? (
          <Link
            to={`/academy/${prevLesson.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              0{prevLesson.moduleOrder}. {prevLesson.title.split('(')[0].trim()}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {nextLesson ? (
          <Link
            to={`/academy/${nextLesson.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            <span>
              0{nextLesson.moduleOrder}. {nextLesson.title.split('(')[0].trim()}
            </span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : (
          <Link
            to="/practice"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Practice Drills
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  );
}
