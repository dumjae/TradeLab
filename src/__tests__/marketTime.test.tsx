import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketHoursPhCard } from '../components/dashboard/MarketHoursPhCard';
import { LanguageProvider } from '../context/LanguageContext';
import { CHART_SCENARIOS, getChartScenariosForLesson } from '../data/chartScenarios';
import { CURRICULUM_LESSONS, getLessonBySlug } from '../data/curriculum';
import {
  convertNyClockToPh,
  getMarketSessionsInPh,
  getNyToPhShiftHours,
  localizeMarketTimes,
  nyTimeToPhLabel,
} from '../lib/marketTime';

const EST_DATE = new Date('2026-11-27T12:00:00Z'); // US Standard Time (NY = UTC-5, PH = UTC+8 -> +13h)
const EDT_DATE = new Date('2026-07-15T12:00:00Z'); // US Daylight Time (NY = UTC-4, PH = UTC+8 -> +12h)

const RAW_NY_TIME_TAG_REGEX = /\d\s?(?:AM|PM)\s+(?:ET|EST|EDT|New York time)\b/i;

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, out);
    }
    return out;
  }
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) {
      collectStrings(child, out);
    }
  }
  return out;
}

describe('marketTime DST-aware PH conversion utilities', () => {
  it('computes getNyToPhShiftHours as 13 in US Standard Time and 12 in US Daylight Time', () => {
    expect(getNyToPhShiftHours(EST_DATE)).toBe(13);
    expect(getNyToPhShiftHours(EDT_DATE)).toBe(12);
  });

  it('converts NY clock times to PH time accurately across EST/EDT and midnight rollover', () => {
    expect(convertNyClockToPh(9, 30, EST_DATE)).toEqual({
      hour24: 22,
      minute: 30,
      dayOffset: 0,
    });
    expect(convertNyClockToPh(9, 30, EDT_DATE)).toEqual({
      hour24: 21,
      minute: 30,
      dayOffset: 0,
    });
    expect(convertNyClockToPh(16, 0, EST_DATE)).toEqual({
      hour24: 5,
      minute: 0,
      dayOffset: 1,
    });

    expect(nyTimeToPhLabel('9:30 AM', EST_DATE)).toBe('10:30 PM PH');
    expect(nyTimeToPhLabel('9:30 AM', EDT_DATE)).toBe('9:30 PM PH');
    expect(nyTimeToPhLabel('4:00 PM', EST_DATE)).toBe('5:00 AM PH');
  });

  it('localizes single NY tags, ranges, shared-meridiem ranges, and Taglish ranges', () => {
    // Single NY tags
    expect(localizeMarketTimes('US equities open at 9:30 AM ET.', EST_DATE)).toBe(
      'US equities open at 10:30 PM PH.',
    );
    expect(localizeMarketTimes('US equities open at 9:30 AM ET.', EDT_DATE)).toBe(
      'US equities open at 9:30 PM PH.',
    );
    expect(localizeMarketTimes('London killzone starts at 2:00 AM New York time.', EST_DATE)).toBe(
      'London killzone starts at 3:00 PM PH.',
    );

    // Explicit ranges & shared-meridiem ranges
    expect(localizeMarketTimes('London Killzone: 2:00 AM–5:00 AM New York time', EST_DATE)).toBe(
      'London Killzone: 3:00 PM–6:00 PM PH',
    );
    expect(localizeMarketTimes('NY Opening Drive: 9:30–11:00 AM ET', EST_DATE)).toBe(
      'NY Opening Drive: 10:30 PM–12:00 AM PH',
    );

    // Taglish ranges
    expect(localizeMarketTimes('Regular market: 9:30 AM hanggang 4:00 PM EST', EST_DATE)).toBe(
      'Regular market: 10:30 PM hanggang 5:00 AM PH',
    );
  });

  it('is idempotent and leaves untagged generic candle clock examples untouched', () => {
    const taggedSamples = [
      'US equities open at 9:30 AM ET and peak during 9:30–11:00 AM ET.',
      'London Killzone runs 2:00 AM–5:00 AM New York time.',
      'Regular trading hours: 9:30 AM hanggang 4:00 PM EST.',
    ];

    for (const sample of taggedSamples) {
      const once = localizeMarketTimes(sample, EST_DATE);
      const twice = localizeMarketTimes(once, EST_DATE);
      expect(twice).toBe(once);
    }

    const untaggedCandleExample =
      'a 15-minute candle opens at 9:00 AM and closes at 9:15 AM';
    expect(localizeMarketTimes(untaggedCandleExample, EST_DATE)).toBe(untaggedCandleExample);
    expect(localizeMarketTimes(untaggedCandleExample, EDT_DATE)).toBe(untaggedCandleExample);
  });

  it('returns all 4 PH market sessions with accurate weekday open and weekend closed states', () => {
    // Friday Nov 27, 2026 15:00 UTC -> 10:00 AM NY (EST), 3:00 PM London (GMT), 12:00 AM Sat Tokyo (JST)
    const fridayNyOpen = new Date('2026-11-27T15:00:00Z');
    const nyOpenSessions = getMarketSessionsInPh(fridayNyOpen);
    expect(nyOpenSessions.map((s) => s.id)).toEqual([
      'tokyo',
      'london',
      'new_york',
      'us_stocks',
    ]);

    const byId = Object.fromEntries(nyOpenSessions.map((s) => [s.id, s]));
    expect(byId.tokyo).toMatchObject({
      label: 'Tokyo',
      openPh: '8:00 AM',
      closePh: '5:00 PM',
      isOpenNow: false,
    });
    expect(byId.london).toMatchObject({
      label: 'London',
      openPh: '4:00 PM',
      closePh: '12:30 AM',
      isOpenNow: true,
    });
    expect(byId.new_york).toMatchObject({
      label: 'New York',
      openPh: '9:00 PM',
      closePh: '6:00 AM',
      isOpenNow: true,
    });
    expect(byId.us_stocks).toMatchObject({
      label: 'US Stocks',
      openPh: '10:30 PM',
      closePh: '5:00 AM',
      isOpenNow: true,
    });

    // Friday Nov 27, 2026 02:00 UTC -> 11:00 AM Tokyo (open), 10:00 AM PH
    const fridayTokyo = getMarketSessionsInPh(new Date('2026-11-27T02:00:00Z'));
    const tokyoSession = fridayTokyo.find((s) => s.id === 'tokyo');
    expect(tokyoSession?.isOpenNow).toBe(true);

    // Saturday Nov 28, 2026 15:00 UTC -> Saturday in London & NY, Sunday in Tokyo -> all closed
    const saturdaySessions = getMarketSessionsInPh(new Date('2026-11-28T15:00:00Z'));
    expect(saturdaySessions.every((s) => !s.isOpenNow)).toBe(true);

    // Sunday Nov 29, 2026 02:00 UTC -> Sunday in Tokyo & London, Saturday evening in NY -> all closed
    const sundaySessions = getMarketSessionsInPh(new Date('2026-11-29T02:00:00Z'));
    expect(sundaySessions.every((s) => !s.isOpenNow)).toBe(true);
  });
});

describe('Assembled curriculum & chart scenarios PH time localization', () => {
  it('localizes session/hours lessons to PH time with zero leftover raw NY tags', () => {
    const targetSlugs = [
      'forex-sessions-killzones',
      'indices-ny-open-playbook',
      'stocks-market-hours-volume-order-types',
    ];

    for (const slug of targetSlugs) {
      const lesson = getLessonBySlug(slug);
      expect(lesson, `Expected lesson "${slug}" to exist`).toBeDefined();

      const lessonStrings = collectStrings(lesson);
      const joinedLesson = lessonStrings.join('\n');
      expect(joinedLesson, `Expected PH time labels in lesson "${slug}"`).toMatch(
        /\d{1,2}:\d{2}\s+(?:AM|PM)\s+PH/,
      );
      expect(
        joinedLesson,
        `Found leftover raw NY time tag in lesson "${slug}"`,
      ).not.toMatch(RAW_NY_TIME_TAG_REGEX);

      const scenarios = getChartScenariosForLesson(lesson!);
      expect(scenarios.length).toBeGreaterThanOrEqual(1);
      const scenarioStrings = collectStrings(scenarios);
      expect(
        scenarioStrings.join('\n'),
        `Found leftover raw NY time tag in scenarios for "${slug}"`,
      ).not.toMatch(RAW_NY_TIME_TAG_REGEX);
    }

    // Verify full curriculum & all chart scenarios contain zero leftover raw NY time tags
    for (const lesson of CURRICULUM_LESSONS) {
      const joined = collectStrings(lesson).join('\n');
      expect(
        joined,
        `Found leftover raw NY time tag in curriculum lesson "${lesson.slug}"`,
      ).not.toMatch(RAW_NY_TIME_TAG_REGEX);
    }

    for (const scenario of CHART_SCENARIOS) {
      const joined = collectStrings(scenario).join('\n');
      expect(
        joined,
        `Found leftover raw NY time tag in chart scenario "${scenario.id}"`,
      ).not.toMatch(RAW_NY_TIME_TAG_REGEX);
    }
  });
});

describe('MarketHoursPhCard component', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Tokyo, London, New York, US Stocks, live PH clock badge, and dynamic Auto US DST indicator', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-27T15:00:00Z'));

    render(
      <LanguageProvider>
        <MarketHoursPhCard />
      </LanguageProvider>,
    );

    expect(screen.getByRole('heading', { name: /Market Hours \(PH Time\)/i })).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('US Stocks')).toBeInTheDocument();

    // Live PH clock badge (15:00 UTC = 11:00 PM PH)
    expect(screen.getByText(/11:00\s*PM\s*PH/i)).toBeInTheDocument();

    // Dynamic DST shift indicator
    expect(screen.getByText('PH = NY +13h')).toBeInTheDocument();
    expect(screen.getByText('Auto US DST')).toBeInTheDocument();
  });

  it('switches the DST indicator to PH = NY +12h during US Daylight Time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T15:00:00Z'));

    render(
      <LanguageProvider>
        <MarketHoursPhCard />
      </LanguageProvider>,
    );

    expect(screen.getByText('PH = NY +12h')).toBeInTheDocument();
    expect(screen.getByText('Auto US DST')).toBeInTheDocument();
  });
});
