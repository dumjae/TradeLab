import { useState } from 'react';
import {
  CheckCircle2,
  Columns2,
  FastForward,
  Layers,
  Play,
  RotateCcw,
} from 'lucide-react';
import type { ChartReplayStage, ChartScenario } from '../../types/academy';
import { InteractiveCandleChart } from './InteractiveCandleChart';

export interface BeforeAfterChartViewerProps {
  scenario: ChartScenario;
  comparisonScenario?: ChartScenario;
  height?: number;
}

const STAGES: Array<{ id: ChartReplayStage; label: string; shortLabel: string }> = [
  { id: 'before', label: '1. Before Setup', shortLabel: 'Before' },
  { id: 'trigger', label: '2. Sweep / Trigger', shortLabel: 'Trigger' },
  { id: 'after', label: '3. After Outcome', shortLabel: 'After' },
];

function getVisibleCountForStage(
  scenario: ChartScenario,
  stage: ChartReplayStage,
): number {
  switch (stage) {
    case 'before':
      return scenario.replay.beforeEndIndex + 1;
    case 'trigger':
      return scenario.replay.triggerEndIndex + 1;
    case 'after':
      return scenario.replay.afterEndIndex + 1;
  }
}

function getStageSummary(scenario: ChartScenario, stage: ChartReplayStage): string {
  switch (stage) {
    case 'before':
      return scenario.replay.beforeSummary;
    case 'trigger':
      return scenario.replay.triggerSummary;
    case 'after':
      return scenario.replay.afterSummary;
  }
}

export function BeforeAfterChartViewer({
  scenario,
  comparisonScenario,
  height = 350,
}: BeforeAfterChartViewerProps) {
  const [stage, setStage] = useState<ChartReplayStage>('before');
  const [sideBySide, setSideBySide] = useState<boolean>(false);

  const stageIndex = STAGES.findIndex((item) => item.id === stage);

  const handleAdvance = () => {
    const nextIndex = (stageIndex + 1) % STAGES.length;
    setStage(STAGES[nextIndex].id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-terminal-border bg-terminal-surface p-3.5">
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-terminal-text">{scenario.title}</h4>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-400">
              {scenario.symbol} · {scenario.timeframe}
            </span>
          </div>
          <p className="text-xs text-terminal-muted">{scenario.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded-lg border border-terminal-border bg-terminal-bg p-0.5"
            role="tablist"
            aria-label="Chart replay stage"
          >
            {STAGES.map((item) => {
              const active = stage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStage(item.id)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-brand text-brand-fg font-semibold'
                      : 'text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAdvance}
            className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-elevated px-2.5 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
          >
            {stage === 'after' ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Replay
              </>
            ) : (
              <>
                <FastForward className="h-3.5 w-3.5" aria-hidden="true" />
                Next Stage
              </>
            )}
          </button>

          {comparisonScenario && (
            <button
              type="button"
              onClick={() => setSideBySide((prev) => !prev)}
              aria-pressed={sideBySide}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                sideBySide
                  ? 'border-sky-500/50 bg-sky-500/15 text-sky-400'
                  : 'border-terminal-border bg-terminal-elevated text-terminal-muted hover:text-terminal-text'
              }`}
            >
              <Columns2 className="h-3.5 w-3.5" aria-hidden="true" />
              {sideBySide ? 'Single View' : 'Side-by-Side Compare'}
            </button>
          )}
        </div>
      </div>

      {sideBySide && comparisonScenario ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                {scenario.title}
              </span>
              <span className="font-mono text-[11px] uppercase text-terminal-muted">
                Stage: {stage}
              </span>
            </div>
            <InteractiveCandleChart
              candles={scenario.candles}
              priceLines={scenario.priceLines}
              markers={scenario.markers}
              symbol={scenario.symbol}
              timeframe={scenario.timeframe}
              height={Math.max(height - 30, 280)}
              visibleCount={getVisibleCountForStage(scenario, stage)}
              activeStage={stage}
            />
            <p className="rounded-lg border border-terminal-border bg-terminal-elevated/50 px-3 py-2 text-xs text-terminal-text">
              {getStageSummary(scenario, stage)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                {comparisonScenario.title}
              </span>
              <span className="font-mono text-[11px] uppercase text-terminal-muted">
                Stage: {stage}
              </span>
            </div>
            <InteractiveCandleChart
              candles={comparisonScenario.candles}
              priceLines={comparisonScenario.priceLines}
              markers={comparisonScenario.markers}
              symbol={comparisonScenario.symbol}
              timeframe={comparisonScenario.timeframe}
              height={Math.max(height - 30, 280)}
              visibleCount={getVisibleCountForStage(comparisonScenario, stage)}
              activeStage={stage}
            />
            <p className="rounded-lg border border-terminal-border bg-terminal-elevated/50 px-3 py-2 text-xs text-terminal-text">
              {getStageSummary(comparisonScenario, stage)}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <InteractiveCandleChart
            candles={scenario.candles}
            priceLines={scenario.priceLines}
            markers={scenario.markers}
            symbol={scenario.symbol}
            timeframe={scenario.timeframe}
            height={height}
            visibleCount={getVisibleCountForStage(scenario, stage)}
            activeStage={stage}
          />

          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              {STAGES[stageIndex]?.label} Analysis
            </p>
            <p className="mt-1 text-sm leading-relaxed text-terminal-text">
              {getStageSummary(scenario, stage)}
            </p>
          </div>
        </div>
      )}

      {scenario.teachingTakeaways.length > 0 && (
        <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Chart Study Takeaways
          </h5>
          <ul className="mt-2.5 space-y-2">
            {scenario.teachingTakeaways.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-terminal-text">
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
