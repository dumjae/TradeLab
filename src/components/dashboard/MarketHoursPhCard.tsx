import { useEffect, useMemo, useState } from 'react';
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
      className="border-y border-terminal-border py-3.5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 pb-3">
        <h2
          id="market-hours-ph-heading"
          className="text-xs font-semibold tracking-tight text-terminal-text sm:text-[13px]"
        >
          {t('Market Hours (PH Time)', 'Oras ng Merkado (PH Time)')}
        </h2>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tabular-nums text-terminal-muted">
          <span
            title={t(
              'Automatically adjusts when US Daylight Saving Time changes',
              'Kusang nag-aadjust kapag nagpalit ang US Daylight Saving Time',
            )}
          >
            PH = NY +{nyShiftHours}h
          </span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span>{t('Auto US DST', 'Auto US DST')}</span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span
            className="inline-flex items-center gap-1.5 font-medium text-terminal-text"
            title={t(
              'Current Philippine Time (Asia/Manila)',
              'Kasalukuyang Oras sa Pilipinas (Asia/Manila)',
            )}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-bull" />
            {phClockLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-terminal-border pt-3 sm:grid-cols-4 sm:divide-x sm:divide-terminal-border">
        {sessions.map((session, index) => (
          <div
            key={session.id}
            className={`min-w-0 py-1.5 sm:px-4 sm:py-0.5 sm:first:pl-0 sm:last:pr-0 ${
              index >= 2 ? 'mt-2 border-t border-terminal-border pt-3 sm:mt-0 sm:border-t-0 sm:pt-0.5' : ''
            } ${index % 2 === 1 ? 'pl-4 sm:pl-4' : 'pr-3 sm:pr-4'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-medium text-terminal-text">
                {session.label}
              </span>
              {session.isOpenNow ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-bull">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-bull" />
                  {t('Open', 'Bukas')}
                </span>
              ) : (
                <span className="shrink-0 text-[11px] text-terminal-muted">
                  {t('Closed', 'Sarado')}
                </span>
              )}
            </div>
            <p className="mt-1 font-mono text-xs tabular-nums text-terminal-muted">
              {session.openPh} – {session.closePh}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
