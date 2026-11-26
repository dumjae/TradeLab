import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  listDifficultConcepts,
  markConceptMastered,
  reopenDifficultConcept,
} from '../../services/difficultConceptsService';
import type {
  DifficultConceptTrigger,
  UserDifficultConcept,
} from '../../types/visual-learning';

export interface DifficultConceptsPanelProps {
  compact?: boolean;
  includeMasteredToggle?: boolean;
}

const TRIGGER_LABELS: Record<DifficultConceptTrigger, string> = {
  manual_bookmark: 'Marked Difficult',
  explain_differently: 'Used Explain Differently',
  practice_mistake: 'Repeated Practice Mistakes',
};

export function DifficultConceptsPanel({
  compact = false,
  includeMasteredToggle = true,
}: DifficultConceptsPanelProps) {
  const [concepts, setConcepts] = useState<UserDifficultConcept[]>([]);
  const [showMastered, setShowMastered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listDifficultConcepts(showMastered);
      setConcepts(list);
    } finally {
      setLoading(false);
    }
  }, [showMastered]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleMarkMastered = async (id: string) => {
    await markConceptMastered(id);
    await load();
  };

  const handleReopen = async (id: string) => {
    await reopenDifficultConcept(id);
    await load();
  };

  const displayed = compact ? concepts.slice(0, 3) : concepts;

  return (
    <section
      aria-labelledby="difficult-concepts-heading"
      className="rounded-2xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" aria-hidden="true" />
          <h2
            id="difficult-concepts-heading"
            className="font-mono text-xs font-bold uppercase tracking-wider text-terminal-text"
          >
            My Difficult Concepts
          </h2>
          <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-400 tabular-nums">
            {concepts.filter((c) => !c.isMastered).length} active
          </span>
        </div>

        {includeMasteredToggle && (
          <button
            type="button"
            onClick={() => setShowMastered((prev) => !prev)}
            className="text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            {showMastered ? 'Hide Mastered' : 'Show Mastered'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-3 h-20 animate-pulse rounded-xl bg-terminal-elevated/60" />
      ) : displayed.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-terminal-border bg-terminal-bg/60 p-4 text-xs text-terminal-muted">
          <p className="font-medium text-terminal-text">No active difficult concepts queued.</p>
          <p className="mt-1">
            Whenever you click “Mark Concept Difficult”, use “Explain Differently”, or miss a
            practice concept twice, TradeLab builds a focused Review Bundle here.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-2.5">
          {displayed.map((concept) => (
            <article
              key={concept.id}
              className={`rounded-xl border p-3.5 ${
                concept.isMastered
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-terminal-border bg-terminal-bg'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-terminal-text">
                      {concept.conceptLabel}
                    </h3>
                    {concept.isMastered && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        Mastered
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {concept.triggerSources.map((trigger) => (
                      <span
                        key={trigger}
                        className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-400"
                      >
                        {TRIGGER_LABELS[trigger]}
                      </span>
                    ))}
                    {concept.mistakeCount > 0 && (
                      <span className="rounded border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] text-rose-400 tabular-nums">
                        {concept.mistakeCount} mistake{concept.mistakeCount === 1 ? '' : 's'}
                      </span>
                    )}
                    {concept.consecutiveCorrect > 0 && !concept.isMastered && (
                      <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 tabular-nums">
                        {concept.consecutiveCorrect}/3 mastery streak
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/academy/${concept.lessonSlug}?mode=diagram`}
                    className="inline-flex items-center gap-1 rounded-lg border border-sky-500/35 bg-sky-500/10 px-2.5 py-1.5 text-xs font-semibold text-sky-400 transition-colors hover:bg-sky-500 hover:text-slate-950"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Review Bundle
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>

                  {concept.isMastered ? (
                    <button
                      type="button"
                      onClick={() => void handleReopen(concept.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-elevated px-2.5 py-1.5 text-xs font-medium text-terminal-muted hover:text-terminal-text"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Reopen
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleMarkMastered(concept.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-slate-950"
                    >
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Mark as Mastered
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
