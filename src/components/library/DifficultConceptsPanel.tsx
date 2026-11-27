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
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-caution" aria-hidden="true" />
          <h2
            id="difficult-concepts-heading"
            className="text-sm font-semibold tracking-tight text-terminal-text"
          >
            My Difficult Concepts
          </h2>
          <span className="font-mono text-[11px] font-medium text-terminal-muted tabular-nums">
            {concepts.filter((c) => !c.isMastered).length} active
          </span>
        </div>

        {includeMasteredToggle && (
          <button
            type="button"
            onClick={() => setShowMastered((prev) => !prev)}
            className="text-xs font-medium text-brand-text hover:underline"
          >
            {showMastered ? 'Hide Mastered' : 'Show Mastered'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-16 animate-pulse rounded-md bg-terminal-elevated/60" />
      ) : displayed.length === 0 ? (
        <div className="rounded-md border border-dashed border-terminal-border p-4 text-xs text-terminal-muted">
          <p className="font-medium text-terminal-text">No active difficult concepts queued.</p>
          <p className="mt-1 leading-relaxed">
            Whenever you click “Mark Concept Difficult”, use “Explain Differently”, or miss a
            practice concept twice, TradeLab builds a focused Review Bundle here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-terminal-border border-t border-terminal-border">
          {displayed.map((concept) => (
            <article
              key={concept.id}
              className="py-3.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-terminal-text">
                      {concept.conceptLabel}
                    </h3>
                    {concept.isMastered && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-bull/35 bg-bull/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-bull">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        Mastered
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {concept.triggerSources.map((trigger) => (
                      <span
                        key={trigger}
                        className="rounded border border-terminal-border bg-terminal-surface px-1.5 py-0.5 font-mono text-[10px] text-terminal-muted"
                      >
                        {TRIGGER_LABELS[trigger]}
                      </span>
                    ))}
                    {concept.mistakeCount > 0 && (
                      <span className="rounded border border-bear/30 bg-bear/10 px-1.5 py-0.5 font-mono text-[10px] text-bear tabular-nums">
                        {concept.mistakeCount} mistake{concept.mistakeCount === 1 ? '' : 's'}
                      </span>
                    )}
                    {concept.consecutiveCorrect > 0 && !concept.isMastered && (
                      <span className="rounded border border-bull/30 bg-bull/10 px-1.5 py-0.5 font-mono text-[10px] text-bull tabular-nums">
                        {concept.consecutiveCorrect}/3 mastery streak
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/academy/${concept.lessonSlug}?mode=diagram`}
                    className="tl-press inline-flex items-center gap-1 rounded-md border border-terminal-border bg-terminal-surface px-2.5 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45 hover:text-brand-text"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Review Bundle
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>

                  {concept.isMastered ? (
                    <button
                      type="button"
                      onClick={() => void handleReopen(concept.id)}
                      className="tl-press inline-flex items-center gap-1 rounded-md border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-xs font-medium text-terminal-muted hover:text-terminal-text"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Reopen
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleMarkMastered(concept.id)}
                      className="tl-press inline-flex items-center gap-1 rounded-md border border-brand/35 bg-brand-soft px-2.5 py-1.5 text-xs font-semibold text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
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
