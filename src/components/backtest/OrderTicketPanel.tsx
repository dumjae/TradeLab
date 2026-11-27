import { useMemo, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, Crosshair, X } from 'lucide-react';
import { calculatePositionSize } from '../../lib/backtestEngine';
import type { BacktestDirection, BacktestPosition } from '../../types/backtest';

const SETUP_TAGS = [
  'Liquidity Sweep',
  'Fair Value Gap',
  'BOS Retest',
  'Equal Highs/Lows',
  'Custom',
];

const RISK_PRESETS = [0.5, 1, 2];
const RR_PRESETS = [2, 3];

export interface OrderTicketPanelProps {
  startingBalance: number;
  riskPercent: number;
  currentEquity: number;
  settingsLocked: boolean;
  lastPrice: number;
  decimals: number;
  openPositions: BacktestPosition[];
  onStartingBalanceChange: (value: number) => void;
  onRiskPercentChange: (value: number) => void;
  onExecute: (order: {
    direction: BacktestDirection;
    stopLoss: number;
    takeProfit: number | null;
    setupTag: string;
  }) => string | null;
  onBreakeven: (positionId: string) => void;
  onClose: (positionId: string) => void;
}

function toNumber(text: string): number | null {
  if (!text.trim()) {
    return null;
  }
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

export function OrderTicketPanel({
  startingBalance,
  riskPercent,
  currentEquity,
  settingsLocked,
  lastPrice,
  decimals,
  openPositions,
  onStartingBalanceChange,
  onRiskPercentChange,
  onExecute,
  onBreakeven,
  onClose,
}: OrderTicketPanelProps) {
  const [direction, setDirection] = useState<BacktestDirection>('long');
  const [slText, setSlText] = useState<string>('');
  const [tpText, setTpText] = useState<string>('');
  const [setupTag, setSetupTag] = useState<string>(SETUP_TAGS[0]);
  const [error, setError] = useState<string | null>(null);

  const stopLoss = toNumber(slText);
  const sizing = useMemo(
    () =>
      stopLoss === null
        ? null
        : calculatePositionSize(currentEquity, riskPercent, lastPrice, stopLoss),
    [stopLoss, currentEquity, riskPercent, lastPrice],
  );

  const applyRiskReward = (ratio: number) => {
    if (stopLoss === null) {
      setError('Enter a Stop Loss first to calculate a take profit target.');
      return;
    }
    const distance = Math.abs(lastPrice - stopLoss);
    const target = direction === 'long' ? lastPrice + distance * ratio : lastPrice - distance * ratio;
    setTpText(target.toFixed(decimals));
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stopLoss === null) {
      setError('Stop Loss is required for every order.');
      return;
    }
    const message = onExecute({
      direction,
      stopLoss,
      takeProfit: toNumber(tpText),
      setupTag,
    });
    setError(message);
    if (!message) {
      setSlText('');
      setTpText('');
    }
  };

  const formatPrice = (value: number) => value.toFixed(decimals);

  return (
    <div className="space-y-4 rounded-lg border border-terminal-border bg-terminal-surface p-4 sm:p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-terminal-text">
        <Crosshair className="h-4 w-4 text-brand-text" aria-hidden="true" />
        Order Ticket
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <label
            htmlFor="backtest-starting-balance"
            className="block text-[11px] font-medium text-terminal-muted"
          >
            Starting Balance ($)
          </label>
          <input
            id="backtest-starting-balance"
            name="startingBalance"
            aria-label="Starting balance in dollars"
            type="number"
            min={100}
            step={100}
            value={startingBalance}
            disabled={settingsLocked}
            onChange={(event) => onStartingBalanceChange(Number(event.target.value))}
            className="mt-1.5 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text focus:border-brand focus:outline-none disabled:opacity-60"
          />
        </div>
        <div className="min-w-0">
          <label
            htmlFor="backtest-risk-percent"
            className="block text-[11px] font-medium text-terminal-muted"
          >
            Risk per Trade (%)
          </label>
          <input
            id="backtest-risk-percent"
            name="riskPercent"
            aria-label="Risk per trade percent"
            type="number"
            min={0.1}
            max={25}
            step={0.1}
            value={riskPercent}
            onChange={(event) => onRiskPercentChange(Number(event.target.value))}
            className="mt-1.5 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text focus:border-brand focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-terminal-muted">Beginners: stick to 0.5%–1%</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {RISK_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onRiskPercentChange(preset)}
                className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium transition-colors ${
                  riskPercent === preset
                    ? 'border-brand bg-brand text-brand-fg'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 border-t border-terminal-border pt-4">
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Order direction">
          <button
            type="button"
            aria-pressed={direction === 'long'}
            onClick={() => setDirection('long')}
            className={`tl-press inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
              direction === 'long'
                ? 'border-bull bg-bull text-white'
                : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            Long
          </button>
          <button
            type="button"
            aria-pressed={direction === 'short'}
            onClick={() => setDirection('short')}
            className={`tl-press inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
              direction === 'short'
                ? 'border-bear bg-bear text-white'
                : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
            }`}
          >
            <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
            Short
          </button>
        </div>

        <p className="font-mono text-[11px] text-terminal-muted">
          Market entry at last close:{' '}
          <strong className="text-terminal-text tabular-nums">{formatPrice(lastPrice)}</strong>
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <label
              htmlFor="backtest-stop-loss"
              className="block text-[11px] font-medium text-terminal-muted"
            >
              Stop Loss
            </label>
            <input
              id="backtest-stop-loss"
              name="stopLoss"
              aria-label="Stop loss price"
              type="number"
              step="any"
              value={slText}
              onChange={(event) => setSlText(event.target.value)}
              placeholder={direction === 'long' ? 'Below entry' : 'Above entry'}
              className="mt-1.5 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text focus:border-bear focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-terminal-muted">
              Safety net — auto-exits to cap loss
            </p>
          </div>
          <div className="min-w-0">
            <label
              htmlFor="backtest-take-profit"
              className="block text-[11px] font-medium text-terminal-muted"
            >
              Take Profit (optional)
            </label>
            <input
              id="backtest-take-profit"
              name="takeProfit"
              aria-label="Take profit price"
              type="number"
              step="any"
              value={tpText}
              onChange={(event) => setTpText(event.target.value)}
              placeholder={direction === 'long' ? 'Above entry' : 'Below entry'}
              className="mt-1.5 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text focus:border-bull focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-terminal-muted">Target — auto-locks profit</p>
            <div className="mt-2 flex gap-1.5">
              {RR_PRESETS.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => applyRiskReward(ratio)}
                  className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[11px] text-terminal-muted transition-colors hover:text-terminal-text"
                >
                  1:{ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="backtest-setup-tag"
            className="block text-[11px] font-medium text-terminal-muted"
          >
            Setup Tag
          </label>
          <select
            id="backtest-setup-tag"
            name="setupTag"
            aria-label="Setup tag"
            value={setupTag}
            onChange={(event) => setSetupTag(event.target.value)}
            className="mt-1.5 w-full rounded-md border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-brand focus:outline-none"
          >
            {SETUP_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 border-y border-terminal-border py-2.5 font-mono text-[11px] tabular-nums">
          <span className="text-terminal-muted">
            Risk:{' '}
            <strong className="text-caution">
              ${sizing ? sizing.riskAmount.toFixed(2) : '—'}
            </strong>
          </span>
          <span className="text-terminal-muted">
            Units:{' '}
            <strong className="text-terminal-text">
              {sizing ? sizing.units.toFixed(4) : '—'}
            </strong>
          </span>
        </div>

        {error && (
          <p role="alert" className="text-xs text-bear">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="tl-press w-full rounded-md bg-brand px-4 py-2.5 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
        >
          Execute Market Order
        </button>
      </form>

      <div className="space-y-2.5 border-t border-terminal-border pt-4">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-terminal-muted">
          Open Positions ({openPositions.length})
        </h3>
        {openPositions.length === 0 ? (
          <p className="text-xs text-terminal-muted">No open positions.</p>
        ) : (
          <ul className="divide-y divide-terminal-border border-y border-terminal-border">
            {openPositions.map((position) => {
              const move =
                position.direction === 'long'
                  ? lastPrice - position.entryPrice
                  : position.entryPrice - lastPrice;
              const floating = move * position.units;
              return (
                <li
                  key={position.id}
                  className="space-y-2 py-2.5 text-[11px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-semibold uppercase ${
                        position.direction === 'long' ? 'text-bull' : 'text-bear'
                      }`}
                    >
                      {position.direction} · {position.setupTag || 'Untagged'}
                    </span>
                    <span
                      className={`font-mono font-semibold tabular-nums ${
                        floating >= 0 ? 'text-bull' : 'text-bear'
                      }`}
                    >
                      {floating >= 0 ? '+' : ''}${floating.toFixed(2)}
                    </span>
                  </div>
                  <p className="font-mono tabular-nums text-terminal-muted">
                    E {formatPrice(position.entryPrice)} · SL {formatPrice(position.stopLoss)} · TP{' '}
                    {position.takeProfit !== null ? formatPrice(position.takeProfit) : '—'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onBreakeven(position.id)}
                      disabled={position.movedToBreakeven}
                      className="rounded-md border border-caution/35 px-2.5 py-1 font-semibold text-caution transition-colors hover:bg-caution/10 disabled:opacity-50"
                    >
                      Move SL to Breakeven
                    </button>
                    <button
                      type="button"
                      onClick={() => onClose(position.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-terminal-border px-2.5 py-1 font-semibold text-terminal-text transition-colors hover:border-bear/50"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                      Close at Market
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
