import {
  ArrowUpDown,
  Crosshair,
  Minus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { DrawingToolMode } from '../../lib/drawingTools';

export interface TradingViewDrawingRailProps {
  activeTool: DrawingToolMode;
  onSelectTool: (tool: DrawingToolMode) => void;
  onAddHorizontalLine: () => void;
  showSessionHL: boolean;
  onToggleSessionHL: () => void;
  drawingCount: number;
  onClearDrawings: () => void;
  onApplyQuickSetup?: (direction: 'long' | 'short') => void;
  disabled?: boolean;
}

export function TradingViewDrawingRail({
  activeTool,
  onSelectTool,
  onAddHorizontalLine,
  showSessionHL,
  onToggleSessionHL,
  drawingCount,
  onClearDrawings,
  onApplyQuickSetup,
  disabled = false,
}: TradingViewDrawingRailProps) {
  const { t } = useLanguage();

  const clearDisabled = disabled || (drawingCount === 0 && !showSessionHL);

  const baseButtonClass =
    'relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40';

  const crosshairLabel = t(
    'Crosshair — inspect prices',
    'Crosshair — tingnan ang presyo',
  );
  const hlineLabel = t(
    'Horizontal Line (H-Line) — drop Support/Resistance at current price',
    'Horizontal Line (H-Line) — maglagay ng Support/Resistance line',
  );
  const sessionHLLabel = t(
    'Session High / Low — toggle reference range lines',
    'Session High / Low — ipakita ang mataas at mababang presyo',
  );
  const longSetupLabel = t(
    'Long Position 1:2 RR — pre-fill Buy setup in Order Ticket',
    'Long Position 1:2 RR — i-fill ang Buy setup sa Order Ticket',
  );
  const shortSetupLabel = t(
    'Short Position 1:2 RR — pre-fill Sell setup in Order Ticket',
    'Short Position 1:2 RR — i-fill ang Sell setup sa Order Ticket',
  );
  const clearLabel = t(
    'Clear all drawn lines',
    'Burahin lahat ng linya sa chart',
  );

  return (
    <div
      role="toolbar"
      aria-label={t('Chart drawing tools', 'Mga drawing tool sa chart')}
      className="flex w-full shrink-0 flex-row items-center justify-between gap-1 rounded-lg border border-terminal-border bg-terminal-surface p-1 lg:w-11 lg:flex-col lg:justify-start"
    >
      <div className="flex flex-row items-center gap-1 lg:flex-col">
        {/* Crosshair */}
        <button
          type="button"
          disabled={disabled}
          aria-label={crosshairLabel}
          aria-pressed={activeTool === 'crosshair'}
          title={crosshairLabel}
          onClick={() => onSelectTool('crosshair')}
          className={`${baseButtonClass} ${
            activeTool === 'crosshair'
              ? 'border-brand/40 bg-brand-soft text-brand-text'
              : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
          }`}
        >
          <Crosshair className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Horizontal Line */}
        <button
          type="button"
          disabled={disabled}
          aria-label={hlineLabel}
          title={hlineLabel}
          onClick={onAddHorizontalLine}
          className={`${baseButtonClass} ${
            activeTool === 'hline'
              ? 'border-brand/40 bg-brand-soft text-brand-text'
              : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
          }`}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
          {drawingCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 font-mono text-[9px] font-bold leading-none text-brand-fg tabular-nums"
            >
              {drawingCount}
            </span>
          )}
        </button>

        {/* Session High / Low */}
        <button
          type="button"
          disabled={disabled}
          aria-label={sessionHLLabel}
          aria-pressed={showSessionHL}
          title={sessionHLLabel}
          onClick={onToggleSessionHL}
          className={`${baseButtonClass} ${
            showSessionHL
              ? 'border-amber-wisdom/45 bg-amber-wisdom/15 text-amber-wisdom'
              : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
          }`}
        >
          <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Optional Long & Short 1:2 RR Quick Setup Tools */}
        {onApplyQuickSetup && (
          <>
            <span
              aria-hidden="true"
              className="mx-0.5 h-5 w-px bg-terminal-border lg:mx-0 lg:my-0.5 lg:h-px lg:w-6"
            />

            <button
              type="button"
              disabled={disabled}
              aria-label={longSetupLabel}
              aria-pressed={activeTool === 'long_tool'}
              title={longSetupLabel}
              onClick={() => onApplyQuickSetup('long')}
              className={`${baseButtonClass} ${
                activeTool === 'long_tool'
                  ? 'border-bull/45 bg-bull/15 text-bull'
                  : 'text-terminal-muted hover:bg-bull/10 hover:text-bull'
              }`}
            >
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              disabled={disabled}
              aria-label={shortSetupLabel}
              aria-pressed={activeTool === 'short_tool'}
              title={shortSetupLabel}
              onClick={() => onApplyQuickSetup('short')}
              className={`${baseButtonClass} ${
                activeTool === 'short_tool'
                  ? 'border-bear/45 bg-bear/15 text-bear'
                  : 'text-terminal-muted hover:bg-bear/10 hover:text-bear'
              }`}
            >
              <TrendingDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Clear All Drawings */}
      <div className="flex flex-row items-center gap-1 lg:mt-auto lg:flex-col lg:border-t lg:border-terminal-border lg:pt-1">
        <button
          type="button"
          disabled={clearDisabled}
          aria-label={clearLabel}
          title={clearLabel}
          onClick={onClearDrawings}
          className={`${baseButtonClass} text-terminal-muted hover:bg-bear/10 hover:text-bear`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
