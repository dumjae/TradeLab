import { useEffect, useState, type FormEvent } from 'react';
import { Bookmark, Clock, X } from 'lucide-react';
import { formatTimestamp } from '../../lib/youtubeUtils';
import type { CurriculumLevel } from '../../types/academy';
import type {
  EducationalResource,
  ResourceSegment,
} from '../../types/visual-learning';

export interface BookmarkNotesDialogProps {
  isOpen: boolean;
  resource: EducationalResource;
  segment?: ResourceSegment | null;
  defaultLevel: CurriculumLevel;
  defaultNotes?: string;
  onClose: () => void;
  onSave: (payload: {
    savedTimestampSeconds: number | null;
    savedSegmentId: string | null;
    curriculumLevel: CurriculumLevel;
    personalNotes: string;
  }) => Promise<void> | void;
}

const LEVELS: Array<{ id: CurriculumLevel; label: string }> = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export function BookmarkNotesDialog({
  isOpen,
  resource,
  segment = null,
  defaultLevel,
  defaultNotes = '',
  onClose,
  onSave,
}: BookmarkNotesDialogProps) {
  const [level, setLevel] = useState<CurriculumLevel>(defaultLevel);
  const [notes, setNotes] = useState<string>(defaultNotes);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLevel(defaultLevel);
      setNotes(defaultNotes);
    }
  }, [isOpen, defaultLevel, defaultNotes]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave({
        savedTimestampSeconds: segment ? segment.startSeconds : null,
        savedSegmentId: segment ? segment.id : null,
        curriculumLevel: level,
        personalNotes: notes.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookmark-dialog-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-terminal-border bg-terminal-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-terminal-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <h3 id="bookmark-dialog-title" className="text-sm font-semibold text-terminal-text">
              Save to Personal Visual Library
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bookmark dialog"
            className="rounded-lg p-1 text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="rounded-xl border border-terminal-border bg-terminal-elevated/50 p-3.5">
            <p className="text-xs font-semibold text-terminal-text">{resource.title}</p>
            <p className="mt-0.5 text-[11px] text-terminal-muted">{resource.sourceName}</p>
            {segment && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 font-mono text-xs text-emerald-400 tabular-nums">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {formatTimestamp(segment.startSeconds)} — {segment.segmentTitle}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="bookmark-level"
              className="block text-xs font-medium text-terminal-muted"
            >
              Curriculum Level Tag
            </label>
            <div id="bookmark-level" className="mt-1.5 grid grid-cols-3 gap-2">
              {LEVELS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLevel(item.id)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    level === item.id
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                      : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="bookmark-notes"
              className="block text-xs font-medium text-terminal-muted"
            >
              Personal Trading Notes
            </label>
            <textarea
              id="bookmark-notes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Write down what caught your eye, checklist rules, or why you want to review this setup..."
              className="mt-1.5 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2.5 text-sm text-terminal-text placeholder:text-terminal-muted/70 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-terminal-border bg-terminal-elevated px-4 py-2 text-xs font-medium text-terminal-muted transition-colors hover:text-terminal-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
