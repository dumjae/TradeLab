import { useState } from 'react';
import { History, Save, Trash2 } from 'lucide-react';
import type { BacktestMetrics, BacktestSession, BacktestTrade } from '../../types/backtest';

export interface BacktestMetricsPanelProps {
  metrics: BacktestMetrics;
  trades: BacktestTrade[];
  sessions: BacktestSession[];
  decimals: number;
  saving: boolean;
  saveMessage: string | null;
  onSave: (notes: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

function formatMoney(value: number): string {
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function EquityCurve({ metrics }: { metrics: BacktestMetrics }) {
  const points = metrics.equityCurve;
  if (points.length < 2) {
    return (
      <p className="rounded-lg border border-dashed border-terminal-border p-4 text-center text-[11px] text-terminal-muted">
        Equity curve appears after your first closed trade.
      </p>
    );
  }

  const width = 320;
  const height = 90;
  const values = points.map((point) => point.equity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1e-6);
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point.equity - min) / range) * (height - 8) - 4;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const positive = metrics.netPnlAmount >= 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-24 w-full rounded-lg border border-terminal-border bg-terminal-bg"
      role="img"
      aria-label="Equity curve"
      preserveAspectRatio="none"
    >
      <path d={path} fill="none" stroke={positive ? '#3ecf9a' : '#f2677a'} strokeWidth={2} />
    </svg>
  );
}

export function BacktestMetricsPanel({
  metrics,
  trades,
  sessions,
  decimals,
  saving,
  saveMessage,
  onSave,
  onDeleteSession,
}: BacktestMetricsPanelProps) {
  const [notes, setNotes] = useState<string>('');
  const pnlTone = metrics.netPnlAmount >= 0 ? 'text-emerald-400' : 'text-rose-400';

  const stats: Array<{ label: string; value: string; tone?: string }> = [
    {
      label: 'Net P&L',
      value: `${formatMoney(metrics.netPnlAmount)} (${metrics.netPnlPercent.toFixed(2)}%)`,
      tone: pnlTone,
    },
    { label: 'Equity', value: formatMoney(metrics.currentEquity) },
    { label: 'Win Rate', value: `${metrics.winRate.toFixed(1)}%` },
    { label: 'Profit Factor', value: metrics.profitFactor.toFixed(2) },
    { label: 'Avg R', value: `${metrics.avgRMultiple.toFixed(2)}R` },
    { label: 'Max Drawdown', value: `${metrics.maxDrawdownPct.toFixed(2)}%`, tone: 'text-amber-400' },
    { label: 'Trades', value: `${metrics.totalTrades} (${metrics.wins}W/${metrics.losses}L/${metrics.breakevens}BE)` },
  ];

  return (
    <div className="space-y-4 rounded-xl border border-terminal-border bg-terminal-surface p-4">
      <h2 className="text-sm font-semibold text-terminal-text">Performance Analytics</h2>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2"
          >
            <dt className="text-[10px] uppercase tracking-wider text-terminal-muted">{stat.label}</dt>
            <dd className={`mt-0.5 font-mono text-xs font-semibold tabular-nums ${stat.tone ?? 'text-terminal-text'}`}>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <EquityCurve metrics={metrics} />

      <div className="space-y-2">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-terminal-muted">
          Trade Journal
        </h3>
        {trades.length === 0 ? (
          <p className="text-[11px] text-terminal-muted">No closed trades yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] tabular-nums">
              <thead className="text-terminal-muted">
                <tr>
                  <th className="py-1 pr-3 font-medium">Side</th>
                  <th className="py-1 pr-3 font-medium">Entry</th>
                  <th className="py-1 pr-3 font-medium">Exit</th>
                  <th className="py-1 pr-3 font-medium">R</th>
                  <th className="py-1 pr-3 font-medium">P&amp;L</th>
                  <th className="py-1 pr-3 font-medium">Reason</th>
                  <th className="py-1 font-medium">Setup</th>
                </tr>
              </thead>
              <tbody>
                {[...trades].reverse().map((trade) => (
                  <tr key={trade.id} className="border-t border-terminal-border text-terminal-text">
                    <td
                      className={`py-1 pr-3 uppercase ${
                        trade.direction === 'long' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {trade.direction}
                    </td>
                    <td className="py-1 pr-3">{trade.entryPrice.toFixed(decimals)}</td>
                    <td className="py-1 pr-3">{trade.exitPrice.toFixed(decimals)}</td>
                    <td className="py-1 pr-3">{trade.rMultiple.toFixed(2)}</td>
                    <td
                      className={`py-1 pr-3 ${
                        trade.pnlAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatMoney(trade.pnlAmount)}
                    </td>
                    <td className="py-1 pr-3 text-terminal-muted">{trade.exitReason.replace('_', ' ')}</td>
                    <td className="py-1 text-terminal-muted">{trade.setupTag || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-terminal-border pt-3">
        <label htmlFor="backtest-notes" className="block text-[11px] font-medium text-terminal-muted">
          Session notes
        </label>
        <input
          id="backtest-notes"
          name="backtestNotes"
          aria-label="Session notes"
          type="text"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="What did you learn from this session?"
          className="w-full rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-text focus:border-emerald-500 focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onSave(notes)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg hover:brightness-110 disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            {saving ? 'Saving…' : 'Save Session'}
          </button>
          <span className="text-[11px] text-terminal-muted">
            Open positions are closed at the current price when saving.
          </span>
        </div>
        {saveMessage && (
          <p role="status" className="text-[11px] text-emerald-400">
            {saveMessage}
          </p>
        )}
      </div>

      <div className="space-y-2 border-t border-terminal-border pt-3">
        <h3 className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-terminal-muted">
          <History className="h-3.5 w-3.5" aria-hidden="true" />
          Saved Sessions ({sessions.length})
        </h3>
        {sessions.length === 0 ? (
          <p className="text-[11px] text-terminal-muted">No saved sessions yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2 text-[11px]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-terminal-text">
                    {session.symbol} · {session.timeframe}
                  </p>
                  <p className="font-mono tabular-nums text-terminal-muted">
                    {new Date(session.createdAt).toLocaleString()} · {session.metrics.totalTrades} trades ·{' '}
                    <span
                      className={
                        session.metrics.netPnlAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {formatMoney(session.metrics.netPnlAmount)}
                    </span>{' '}
                    · WR {session.metrics.winRate.toFixed(0)}%
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteSession(session.id)}
                  aria-label={`Delete saved session ${session.symbol}`}
                  className="rounded p-1 text-terminal-muted hover:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
