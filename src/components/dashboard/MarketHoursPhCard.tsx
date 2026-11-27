import { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  PH_TIME_ZONE,
  getMarketSessionsInPh,
  getNyToPhShiftHours,
} from '../../lib/marketTime';

const PH_CLOCK_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  timeZone: PH_TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

function formatPhNow(date: Date): string {
  return `${PH_CLOCK_FORMATTER.format(date).toUpperCase()} PH`;
}

export function MarketHoursPhCard() {
  const { t } = useLanguage();
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const phClockLabel = useMemo(() => formatPhNow(now), [now]);
  const nyShiftHours = useMemo(() => getNyToPhShiftHours(now), [now]);
  const sessions = useMemo(() => getMarketSessionsInPh(now), [now]);

  return (
    <section
      aria-labelledby="market-hours-ph-heading"
      className="rounded-2xl border border-terminal-border/90 bg-terminal-surface p-3.5 shadow-sm sm:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-terminal-border/80 bg-terminal-bg text-brand">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <h2
            id="market-hours-ph-heading"
            className="text-xs font-semibold tracking-tight text-terminal-text sm:text-sm"
          >
            {t('Market Hours (PH Time)', 'Oras ng Merkado (PH Time)')}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg px-2.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-terminal-text"
            title={t('Current Philippine Time (Asia/Manila)', 'Kasalukuyang Oras sa Pilipinas (Asia/Manila)')}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-bull" />
            {phClockLabel}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border border-terminal-border/80 bg-terminal-bg/75 px-2 py-0.5 font-mono text-[10px] font-medium tabular-nums text-terminal-muted"
            title={t(
              'Automatically adjusts when US Daylight Saving Time changes',
              'Kusang nag-aadjust kapag nagpalit ang US Daylight Saving Time',
            )}
          >
            <span>PH = NY +{nyShiftHours}h</span>
            <span aria-hidden="true" className="opacity-45">
              ·
            </span>
            <span className="font-sans">
              {t('Auto US DST', 'Auto-adjust sa US DST')}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`rounded-xl border px-3 py-2 transition-colors ${
              session.isOpenNow
                ? 'border-bull/45 bg-bull/10'
                : 'border-terminal-border/80 bg-terminal-bg/75'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="truncate text-xs font-semibold text-terminal-text">
                {session.label}
              </span>
              {session.isOpenNow ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-bull/15 px-1.5 py-0.5 text-[10px] font-semibold text-bull">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-bull" />
                  {t('Open now', 'Bukas')}
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-terminal-muted">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-terminal-muted/45"
                  />
                  {t('Closed', 'Sarado')}
                </span>
              )}
            </div>
            <p className="mt-1 font-mono text-[11px] font-medium tabular-nums text-terminal-muted">
              {session.openPh} – {session.closePh}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
