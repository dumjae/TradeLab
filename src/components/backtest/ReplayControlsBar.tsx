import { ChevronsRight, Pause, Play, RotateCcw, StepForward } from 'lucide-react';

export type ReplaySpeed = 1 | 2 | 5;

const SPEEDS: ReplaySpeed[] = [1, 2, 5];

export interface ReplayControlsBarProps {
  totalBars: number;
  replayIndex: number;
  minStartIndex: number;
  maxStartIndex: number;
  startLocked: boolean;
  playing: boolean;
  speed: ReplaySpeed;
  atEnd: boolean;
  onStep: (bars: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: ReplaySpeed) => void;
  onStartIndexChange: (index: number) => void;
  onReset: () => void;
}

export function ReplayControlsBar({
  totalBars,
  replayIndex,
  minStartIndex,
  maxStartIndex,
  startLocked,
  playing,
  speed,
  atEnd,
  onStep,
  onTogglePlay,
  onSpeedChange,
  onStartIndexChange,
  onReset,
}: ReplayControlsBarProps) {
  const buttonBase =
    'tl-press inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="space-y-3 rounded-lg border border-terminal-border bg-terminal-surface p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={atEnd}
            aria-label={playing ? 'Pause replay' : 'Play replay'}
            className={`${buttonBase} border-brand/40 bg-brand-soft text-brand-text hover:bg-brand hover:text-brand-fg`}
          >
            {playing ? (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => onStep(1)}
            disabled={atEnd}
            className={`${buttonBase} border-terminal-border bg-terminal-bg text-terminal-text hover:border-brand/45`}
          >
            <StepForward className="h-3.5 w-3.5" aria-hidden="true" />
            Step +1 Bar
          </button>
          <button
            type="button"
            onClick={() => onStep(5)}
            disabled={atEnd}
            className={`${buttonBase} border-terminal-border bg-terminal-bg text-terminal-text hover:border-brand/45`}
          >
            <ChevronsRight className="h-3.5 w-3.5" aria-hidden="true" />
            Step +5 Bars
          </button>
          <button
            type="button"
            onClick={onReset}
            className={`${buttonBase} border-bear/35 bg-bear/10 text-bear hover:bg-bear/15`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Session
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="replay-speed" className="font-mono text-[11px] text-terminal-muted">
            Speed
          </label>
          <select
            id="replay-speed"
            name="replaySpeed"
            aria-label="Replay speed"
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value) as ReplaySpeed)}
            className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-1 font-mono text-xs text-terminal-text focus:border-brand focus:outline-none"
          >
            {SPEEDS.map((item) => (
              <option key={item} value={item}>
                {item}x
              </option>
            ))}
          </select>
          <span className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-1 font-mono text-[11px] tabular-nums text-terminal-text">
            Bar {replayIndex + 1} / {totalBars}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor="replay-start"
          className="shrink-0 font-mono text-[11px] text-terminal-muted"
        >
          Replay start
        </label>
        <input
          id="replay-start"
          name="replayStart"
          aria-label="Replay start bar"
          type="range"
          min={minStartIndex}
          max={Math.max(minStartIndex, maxStartIndex)}
          value={Math.min(Math.max(replayIndex, minStartIndex), Math.max(minStartIndex, maxStartIndex))}
          disabled={startLocked}
          onChange={(event) => onStartIndexChange(Number(event.target.value))}
          className="h-1.5 w-full accent-brand disabled:opacity-50"
        />
        <span className="shrink-0 font-mono text-[11px] text-terminal-muted">
          {startLocked ? 'Locked after first trade/step' : 'Future bars stay hidden'}
        </span>
      </div>
    </div>
  );
}
