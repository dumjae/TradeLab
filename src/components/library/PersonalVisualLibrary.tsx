import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Edit3,
  History,
  Play,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { getLessonById, getLessonBySlug } from '../../data/curriculum';
import { formatTimestamp } from '../../lib/youtubeUtils';
import {
  listLearningHistory,
  listSavedResources,
  removeSavedResource,
  updateSavedResourceNotes,
} from '../../services/personalLibraryService';
import { getAllPublishedResources } from '../../services/visualResourcesService';
import type { CurriculumLevel } from '../../types/academy';
import type {
  LessonResourceWithDetails,
  UserLearningHistory,
  UserSavedResource,
} from '../../types/visual-learning';

const LEVEL_FILTERS: Array<{ id: CurriculumLevel | 'all'; label: string }> = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export function PersonalVisualLibrary() {
  const [savedItems, setSavedItems] = useState<UserSavedResource[]>([]);
  const [historyItems, setHistoryItems] = useState<UserLearningHistory[]>([]);
  const [resourceMap, setResourceMap] = useState<Record<string, LessonResourceWithDetails>>({});
  const [levelFilter, setLevelFilter] = useState<CurriculumLevel | 'all'>('all');
  const [loading, setLoading] = useState<boolean>(true);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [saved, history, published] = await Promise.all([
        listSavedResources(),
        listLearningHistory(),
        getAllPublishedResources(),
      ]);
      const nextMap: Record<string, LessonResourceWithDetails> = {};
      for (const item of published) {
        nextMap[item.resource.id] = item;
      }
      setSavedItems(saved);
      setHistoryItems(history);
      setResourceMap(nextMap);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredSaved = useMemo(() => {
    if (levelFilter === 'all') {
      return savedItems;
    }
    return savedItems.filter((item) => item.curriculumLevel === levelFilter);
  }, [savedItems, levelFilter]);

  const handleSaveNotes = async (savedId: string) => {
    await updateSavedResourceNotes(savedId, noteDraft.trim());
    setEditingNoteId(null);
    await loadData();
  };

  const handleRemove = async (savedId: string) => {
    await removeSavedResource(savedId);
    await loadData();
  };

  const buildJumpUrl = (
    resourceId: string,
    lessonSlug?: string,
    lessonId?: string | null,
    timestampSeconds?: number | null,
  ): string => {
    const resolvedLesson =
      (lessonSlug ? getLessonBySlug(lessonSlug) : undefined) ??
      (lessonId ? getLessonById(lessonId) : undefined);
    const slug =
      resolvedLesson?.slug ??
      resourceMap[resourceId]?.mapping.lessonSlug ??
      'market-structure';

    const params = new URLSearchParams({
      mode: 'video',
      resource: resourceId,
    });
    if (timestampSeconds && timestampSeconds > 0) {
      params.set('t', String(Math.floor(timestampSeconds)));
    }
    return `/academy/${slug}?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="h-24 animate-pulse rounded-2xl border border-terminal-border bg-terminal-surface"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saved Bookmarks & Timestamps */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-terminal-text">
              Saved Videos &amp; Bookmarked Timestamps
            </h2>
            <span className="rounded-full border border-terminal-border bg-terminal-elevated px-2 py-0.5 font-mono text-[11px] text-terminal-muted tabular-nums">
              {filteredSaved.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {LEVEL_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLevelFilter(item.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  levelFilter === item.id
                    ? 'bg-brand text-brand-fg font-semibold'
                    : 'border border-terminal-border bg-terminal-surface text-terminal-muted hover:text-terminal-text'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {filteredSaved.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-terminal-border bg-terminal-surface/50 p-8 text-center">
            <p className="text-sm font-semibold text-terminal-text">
              No saved visual bookmarks yet
            </p>
            <p className="mt-1 text-xs text-terminal-muted">
              Open any lesson in the Trading Academy and bookmark a video or verified timestamp
              with your personal notes.
            </p>
            <Link
              to="/academy/market-structure"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg hover:brightness-110"
            >
              Browse Trading Academy
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {filteredSaved.map((saved) => {
              const bundle = resourceMap[saved.resourceId];
              const segment = saved.savedSegmentId
                ? bundle?.segments.find((s) => s.id === saved.savedSegmentId)
                : undefined;
              const jumpUrl = buildJumpUrl(
                saved.resourceId,
                saved.lessonSlug,
                saved.lessonId,
                saved.savedTimestampSeconds,
              );
              const isEditing = editingNoteId === saved.id;

              return (
                <article
                  key={saved.id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-terminal-border bg-terminal-surface p-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-400">
                        {saved.curriculumLevel}
                      </span>
                      {saved.savedTimestampSeconds !== null && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-400 tabular-nums">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {formatTimestamp(saved.savedTimestampSeconds)}
                          {segment ? ` · ${segment.segmentTitle}` : ''}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-terminal-text">
                        {bundle?.resource.title ?? 'Saved Educational Resource'}
                      </h3>
                      <p className="text-xs text-terminal-muted">
                        {bundle?.resource.sourceName ?? 'TradeLab Academy Library'}
                      </p>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          rows={3}
                          value={noteDraft}
                          onChange={(event) => setNoteDraft(event.target.value)}
                          className="w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="inline-flex items-center gap-1 rounded-md border border-terminal-border px-2.5 py-1 text-xs text-terminal-muted"
                          >
                            <X className="h-3 w-3" aria-hidden="true" />
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleSaveNotes(saved.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-brand px-2.5 py-1 text-xs font-semibold text-brand-fg"
                          >
                            <Save className="h-3 w-3" aria-hidden="true" />
                            Save Notes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="rounded-lg border border-terminal-border bg-terminal-bg/60 px-3 py-2 text-xs leading-relaxed text-terminal-muted">
                        {saved.personalNotes ? (
                          <span className="text-terminal-text">{saved.personalNotes}</span>
                        ) : (
                          'No personal notes added yet.'
                        )}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-terminal-border pt-3">
                    <Link
                      to={jumpUrl}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand/15 border border-brand/35 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-fg"
                    >
                      <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                      {saved.savedTimestampSeconds !== null
                        ? `Jump to ${formatTimestamp(saved.savedTimestampSeconds)}`
                        : 'Open in Lesson'}
                    </Link>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(saved.id);
                          setNoteDraft(saved.personalNotes);
                        }}
                        aria-label="Edit personal notes"
                        className="rounded-lg border border-terminal-border bg-terminal-bg p-1.5 text-terminal-muted transition-colors hover:text-sky-400"
                      >
                        <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleRemove(saved.id)}
                        aria-label="Remove bookmark"
                        className="rounded-lg border border-terminal-border bg-terminal-bg p-1.5 text-terminal-muted transition-colors hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Learning History & Resume Progress */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-sky-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-terminal-text">
            Recent Learning History &amp; Watch Status
          </h2>
        </div>

        {historyItems.length === 0 ? (
          <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 text-xs text-terminal-muted">
            Start watching any verified video or click a key timestamp to track your watch progress
            and resume right where you left off.
          </div>
        ) : (
          <div className="divide-y divide-terminal-border rounded-2xl border border-terminal-border bg-terminal-surface overflow-hidden">
            {historyItems.map((entry) => {
              const bundle = resourceMap[entry.resourceId];
              const resumeUrl = buildJumpUrl(
                entry.resourceId,
                entry.lessonSlug,
                entry.lessonId,
                entry.lastPositionSeconds,
              );
              const isWatched = entry.completionStatus === 'watched';

              return (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-terminal-text">
                        {bundle?.resource.title ?? 'Lesson Visual Resource'}
                      </span>
                      {isWatched ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          Watched
                        </span>
                      ) : (
                        <span className="rounded-full border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-400">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-terminal-muted tabular-nums">
                      Last position: {formatTimestamp(entry.lastPositionSeconds)}
                    </p>
                  </div>

                  <Link
                    to={resumeUrl}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-elevated px-3 py-1.5 font-mono text-xs font-semibold text-sky-400 transition-colors hover:border-sky-500/50 hover:bg-sky-500/10 tabular-nums"
                  >
                    <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                    Resume at {formatTimestamp(entry.lastPositionSeconds)}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
