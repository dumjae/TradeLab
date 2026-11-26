import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { AIMentorPanel } from '../components/mentor/AIMentorPanel';
import { ExplainDifferentlyPanel } from '../components/visual-learning/ExplainDifferentlyPanel';
import { VisualExplanationsSection } from '../components/visual-learning/VisualExplanationsSection';
import { CURRICULUM_LESSONS, getLessonBySlug } from '../data/curriculum';
import { getPublishedLessonResources } from '../services/visualResourcesService';
import type { LearningViewMode } from '../types/academy';
import type { LessonResourceWithDetails, MentorCitation } from '../types/visual-learning';

function parseModeParam(raw: string | null): LearningViewMode {
  if (raw === 'text' || raw === 'diagram' || raw === 'video' || raw === 'chart') {
    return raw;
  }
  return 'text';
}

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const lesson = useMemo(
    () => (slug ? getLessonBySlug(slug) : undefined) ?? CURRICULUM_LESSONS[0],
    [slug],
  );

  const [resources, setResources] = useState<LessonResourceWithDetails[]>([]);
  const [tutorialMode, setTutorialMode] = useState<boolean>(false);

  const initialMode = parseModeParam(searchParams.get('mode'));
  const initialResourceId = searchParams.get('resource');
  const rawTimestamp = searchParams.get('t');
  const initialTimestampSeconds =
    rawTimestamp && /^\d+$/.test(rawTimestamp) ? Number.parseInt(rawTimestamp, 10) : null;

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCitation = (citation: MentorCitation) => {
    jumpToVideoResource(citation.resourceId, citation.startSeconds);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Lesson Header */}
      <header className="rounded-2xl border border-terminal-border bg-terminal-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 tabular-nums">
                MODULE 0{lesson.moduleOrder}
              </span>
              <span className="rounded-full border border-terminal-border bg-terminal-bg px-2.5 py-0.5 font-mono text-[11px] uppercase text-terminal-muted">
                {lesson.level}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-terminal-muted tabular-nums">
                <Clock className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                {lesson.estimatedMinutes} min study
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-terminal-text sm:text-2xl">
              {lesson.title}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-terminal-muted">
              {lesson.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTutorialMode((prev) => !prev)}
              aria-pressed={tutorialMode}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                tutorialMode
                  ? 'border-sky-500 bg-sky-500 text-slate-950'
                  : 'border-sky-500/35 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20'
              }`}
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              {tutorialMode ? 'Tutorial Mode: ON' : 'Enable Tutorial Mode'}
            </button>

            <Link
              to={`/practice/${lesson.slug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Practice This Lesson
            </Link>
          </div>
        </div>

        {/* Learning Objectives */}
        {lesson.learningObjectives.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2 border-t border-terminal-border pt-4 sm:grid-cols-2">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <VisualExplanationsSection
            lesson={lesson}
            resources={resources}
            tutorialMode={tutorialMode}
            initialMode={initialMode}
            initialResourceId={initialResourceId}
            initialTimestampSeconds={initialTimestampSeconds}
          />

          <ExplainDifferentlyPanel
            lesson={lesson}
            mode={tutorialMode ? 'tutorial' : 'lesson'}
            onJumpToCitation={jumpToVideoResource}
          />
        </div>

        <div className="xl:col-span-4">
          <div className="sticky top-20">
            <AIMentorPanel
              lesson={lesson}
              mode={tutorialMode ? 'tutorial' : 'lesson'}
              onSelectCitation={handleSelectCitation}
            />
          </div>
        </div>
      </div>

      {/* Previous / Next Module Navigation */}
      <nav
        aria-label="Lesson module pagination"
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-terminal-border bg-terminal-surface p-4"
      >
        {prevLesson ? (
          <Link
            to={`/academy/${prevLesson.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-terminal-border bg-terminal-bg px-4 py-2.5 text-xs font-semibold text-terminal-text transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>
              Prev: 0{prevLesson.moduleOrder}. {prevLesson.title.split('(')[0].trim()}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {nextLesson ? (
          <Link
            to={`/academy/${nextLesson.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            <span>
              Next: 0{nextLesson.moduleOrder}. {nextLesson.title.split('(')[0].trim()}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <Link
            to="/practice"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Go to Practice Exercises
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  );
}
