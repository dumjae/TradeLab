/**
 * Market-time helpers: New York (NY) market clock -> Philippine Time (PH).
 *
 * Daylight-saving behaviour (never hardcoded, always derived from IANA zones via Intl):
 *  - US standard time (early Nov - mid Mar): PH = NY + 13h  (NY 9:30 AM = 10:30 PM PH)
 *  - US daylight time (mid Mar - early Nov): PH = NY + 12h  (NY 9:30 AM = 9:30 PM PH)
 * The Philippines does not observe DST, so only the New York side moves.
 *
 * `localizeMarketTimes` text convention (output always ends the clock with "PH"):
 *  - Pure tags (ET, EST, EDT, "NY time", "New York time") are replaced by PH:
 *      "9:30 AM ET"                      -> "10:30 PM PH"
 *      "2:00 AM–5:00 AM New York time"   -> "3:00 PM–6:00 PM PH"   (both range ends converted)
 *  - Bare "NY" / "New York" markers are replaced by PH too:  "7 PM – 2 AM NY" -> "8:00 AM – 3:00 PM PH"
 *  - Descriptive markers keep their noun in parentheses:
 *      "9:30 AM NY Equity Open"          -> "10:30 PM PH (NY Equity Open)"
 *  - Only explicitly NY-tagged times are converted; untagged clock examples are untouched.
 *  - The function is idempotent: converted text contains "PH" and no NY marker after a time.
 */

export const PH_TIME_ZONE = 'Asia/Manila';
export const NY_TIME_ZONE = 'America/New_York';

const TOKYO_TIME_ZONE = 'Asia/Tokyo';
const LONDON_TIME_ZONE = 'Europe/London';

const MINUTES_PER_DAY = 24 * 60;

type ZoneParts = Record<string, string>;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  cacheKey: string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${cacheKey}|${timeZone}`;
  const cached = formatterCache.get(key);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat('en-US', { ...options, timeZone });
  formatterCache.set(key, created);
  return created;
}

function toPartsRecord(formatter: Intl.DateTimeFormat, date: Date): ZoneParts {
  const record: ZoneParts = {};
  for (const part of formatter.formatToParts(date)) {
    record[part.type] = part.value;
  }
  return record;
}

function getNumericParts(date: Date, timeZone: string): ZoneParts {
  const formatter = getFormatter('numeric', timeZone, {
    hourCycle: 'h23',
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return toPartsRecord(formatter, date);
}

/** Offset of `timeZone` from UTC in minutes at the given instant (derived via Intl). */
function getZoneOffsetMinutes(date: Date, timeZone: string): number {
  const p = getNumericParts(date, timeZone);
  const asUtc = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour) % 24,
    Number(p.minute),
    Number(p.second),
  );
  const truncatedInstant = Math.floor(date.getTime() / 1000) * 1000;
  return Math.round((asUtc - truncatedInstant) / 60000);
}

/** Hours to add to a New York clock time to get Philippine time: 13 (US standard) or 12 (US daylight). */
export function getNyToPhShiftHours(date: Date = new Date()): number {
  const phOffset = getZoneOffsetMinutes(date, PH_TIME_ZONE);
  const nyOffset = getZoneOffsetMinutes(date, NY_TIME_ZONE);
  return (phOffset - nyOffset) / 60;
}

export function convertNyClockToPh(
  hour24: number,
  minute: number,
  date: Date = new Date(),
): { hour24: number; minute: number; dayOffset: 0 | 1 } {
  const shiftMinutes = Math.round(getNyToPhShiftHours(date) * 60);
  const total = hour24 * 60 + minute + shiftMinutes;
  const wrapped = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return {
    hour24: Math.floor(wrapped / 60),
    minute: wrapped % 60,
    dayOffset: total >= MINUTES_PER_DAY ? 1 : 0,
  };
}

export function formatClock12(hour24: number, minute: number): string {
  const meridiem = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${meridiem}`;
}

function to24Hour(hour: number, meridiem: string | undefined): number | null {
  if (meridiem) {
    if (hour < 1 || hour > 12) return null;
    const isPm = meridiem.toUpperCase() === 'PM';
    return (hour % 12) + (isPm ? 12 : 0);
  }
  return hour >= 0 && hour <= 23 ? hour : null;
}

function isValidMinute(minute: number): boolean {
  return Number.isInteger(minute) && minute >= 0 && minute <= 59;
}

/** "9:30 AM" -> "10:30 PM PH" (accepts "9:30 AM", "7 PM", "09:30"). Unparseable input is returned unchanged. */
export function nyTimeToPhLabel(nyTime: string, date: Date = new Date()): string {
  const parsed = nyTime.trim().match(/^(\d{1,2})(?::(\d{2}))?\s?([AaPp][Mm])?$/);
  if (!parsed) return nyTime;
  const [, hourText, minuteText, meridiem] = parsed;
  if (!meridiem && minuteText === undefined) return nyTime;
  const minute = minuteText === undefined ? 0 : Number(minuteText);
  const hour24 = to24Hour(Number(hourText), meridiem);
  if (hour24 === null || !isValidMinute(minute)) return nyTime;
  const ph = convertNyClockToPh(hour24, minute, date);
  return `${formatClock12(ph.hour24, ph.minute)} PH`;
}

const CLOCK = '(\\d{1,2})(?::(\\d{2}))?';
const MERIDIEM = '\\s?([AaPp][Mm])';
const RANGE_SEPARATOR = '(\\s?[–—-]\\s?|\\s+(?:to|hanggang|until)\\s+)';
const DESCRIPTOR_WORDS = 'Equity|Stock|Cash|Open|Opening|Peak|Liquidity|Session|Close|Bell';
const NY_MARKER =
  '((?:New York|NY) time|ET|EST|EDT|(?:New York|NY)(?:\\s(?:' + DESCRIPTOR_WORDS + '))*)';

const NY_TAGGED_TIME_PATTERN = new RegExp(
  `(^|[^\\w:.$])${CLOCK}(?:${MERIDIEM})?(?:${RANGE_SEPARATOR}${CLOCK}(?:${MERIDIEM})?)?\\s+${NY_MARKER}(?![\\w-])`,
  'g',
);

const BARE_TAG_PATTERN = /^(?:(?:New York|NY) time|ET|EST|EDT|New York|NY)$/;

interface ClockToken {
  hour: number;
  minute: number;
  meridiem: string | undefined;
  hasColon: boolean;
}

function buildToken(
  hourText: string,
  minuteText: string | undefined,
  meridiem: string | undefined,
): ClockToken {
  return {
    hour: Number(hourText),
    minute: minuteText === undefined ? 0 : Number(minuteText),
    meridiem,
    hasColon: minuteText !== undefined,
  };
}

function isConvertibleToken(token: ClockToken): boolean {
  if (!isValidMinute(token.minute)) return false;
  if (!token.meridiem && !token.hasColon) return false;
  return to24Hour(token.hour, token.meridiem) !== null;
}

function tokenMinutes(token: ClockToken, meridiem: string | undefined): number {
  return (to24Hour(token.hour, meridiem) ?? 0) * 60 + token.minute;
}

function convertToken(token: ClockToken, meridiem: string | undefined, date: Date): string {
  const hour24 = to24Hour(token.hour, meridiem) ?? 0;
  const ph = convertNyClockToPh(hour24, token.minute, date);
  return formatClock12(ph.hour24, ph.minute);
}

/**
 * Converts every explicitly NY-tagged clock time (and range) in `text` to PH time.
 * See the file header for the exact output convention.
 */
export function localizeMarketTimes(text: string, date: Date = new Date()): string {
  return text.replace(
    NY_TAGGED_TIME_PATTERN,
    (
      match: string,
      prefix: string,
      h1: string,
      m1: string | undefined,
      mer1: string | undefined,
      separator: string | undefined,
      h2: string | undefined,
      m2: string | undefined,
      mer2: string | undefined,
      marker: string,
    ): string => {
      const start = buildToken(h1, m1, mer1);
      const end = h2 === undefined ? undefined : buildToken(h2, m2, mer2);

      let startMeridiem = start.meridiem;
      if (end && !startMeridiem && end.meridiem) {
        startMeridiem = end.meridiem;
        if (tokenMinutes(start, startMeridiem) > tokenMinutes(end, end.meridiem)) {
          startMeridiem = end.meridiem.toUpperCase() === 'PM' ? 'AM' : 'PM';
        }
      }

      if (!isConvertibleToken({ ...start, meridiem: startMeridiem })) return match;
      if (end && !isConvertibleToken(end)) return match;

      const startLabel = convertToken(start, startMeridiem, date);
      const clock =
        end && separator !== undefined
          ? `${startLabel}${separator}${convertToken(end, end.meridiem, date)}`
          : startLabel;

      const tag = BARE_TAG_PATTERN.test(marker) ? 'PH' : `PH (${marker})`;
      return `${prefix}${clock} ${tag}`;
    },
  );
}

export interface MarketSessionPh {
  id: 'tokyo' | 'london' | 'new_york' | 'us_stocks';
  label: string;
  openPh: string;
  closePh: string;
  isOpenNow: boolean;
}

interface SessionDefinition {
  id: MarketSessionPh['id'];
  label: string;
  timeZone: string;
  open: readonly [hour: number, minute: number];
  close: readonly [hour: number, minute: number];
}

const SESSION_DEFINITIONS: readonly SessionDefinition[] = [
  { id: 'tokyo', label: 'Tokyo', timeZone: TOKYO_TIME_ZONE, open: [9, 0], close: [18, 0] },
  { id: 'london', label: 'London', timeZone: LONDON_TIME_ZONE, open: [8, 0], close: [16, 30] },
  { id: 'new_york', label: 'New York', timeZone: NY_TIME_ZONE, open: [8, 0], close: [17, 0] },
  { id: 'us_stocks', label: 'US Stocks', timeZone: NY_TIME_ZONE, open: [9, 30], close: [16, 0] },
];

/** UTC epoch ms for a wall-clock time in an IANA zone (DST-aware, two-pass offset resolution). */
function zonedWallClockToUtcMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): number {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  const firstOffset = getZoneOffsetMinutes(new Date(naive), timeZone);
  const firstGuess = naive - firstOffset * 60000;
  const secondOffset = getZoneOffsetMinutes(new Date(firstGuess), timeZone);
  return secondOffset === firstOffset ? firstGuess : naive - secondOffset * 60000;
}

function formatInstantClockInPh(epochMs: number): string {
  const p = getNumericParts(new Date(epochMs), PH_TIME_ZONE);
  return formatClock12(Number(p.hour) % 24, Number(p.minute));
}

export function getMarketSessionsInPh(date: Date = new Date()): MarketSessionPh[] {
  const nowMs = date.getTime();
  return SESSION_DEFINITIONS.map((session) => {
    const local = getNumericParts(date, session.timeZone);
    const year = Number(local.year);
    const month = Number(local.month);
    const day = Number(local.day);
    const openMs = zonedWallClockToUtcMs(year, month, day, session.open[0], session.open[1], session.timeZone);
    const closeMs = zonedWallClockToUtcMs(year, month, day, session.close[0], session.close[1], session.timeZone);
    const isWeekday = local.weekday !== 'Sat' && local.weekday !== 'Sun';
    return {
      id: session.id,
      label: session.label,
      openPh: formatInstantClockInPh(openMs),
      closePh: formatInstantClockInPh(closeMs),
      isOpenNow: isWeekday && nowMs >= openMs && nowMs < closeMs,
    };
  });
}

/** Chart axis/crosshair label in Philippine time, e.g. "Mon 14 May, 4:00 PM". */
export function formatPhTimestamp(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  const formatter = getFormatter('label', PH_TIME_ZONE, {
    hourCycle: 'h23',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const p = toPartsRecord(formatter, date);
  return `${p.weekday} ${p.day} ${p.month}, ${formatClock12(Number(p.hour) % 24, Number(p.minute))}`;
}

export interface DeepLocalizeOptions {
  /** Reference date used for the NY -> PH shift. Defaults to now. */
  date?: Date;
  /** Extra object keys whose values must never be touched. */
  skipKeys?: readonly string[];
}

const PROTECTED_KEY_PATTERN = /^(?:id|slug|key|url|href)$|(?:Id|Ids|Slug|Key|Url|Href)$/;
const URL_LIKE_PATTERN = /^(?:https?:\/\/|\/)/;

function isPlainObject(value: object): value is Record<string, unknown> {
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function localizeNode(
  value: unknown,
  protectedKey: boolean,
  date: Date,
  skipKeys: ReadonlySet<string>,
): unknown {
  if (typeof value === 'string') {
    return protectedKey || URL_LIKE_PATTERN.test(value) ? value : localizeMarketTimes(value, date);
  }
  if (Array.isArray(value)) {
    return value.map((item: unknown) => localizeNode(item, protectedKey, date, skipKeys));
  }
  if (typeof value === 'object' && value !== null && isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      result[key] = skipKeys.has(key)
        ? child
        : localizeNode(child, PROTECTED_KEY_PATTERN.test(key), date, skipKeys);
    }
    return result;
  }
  return value;
}

/**
 * Returns a copy of `value` with every string run through `localizeMarketTimes`.
 * Does not mutate the input; numbers, booleans and ids/slugs/keys/urls are left untouched.
 */
export function deepLocalizeMarketTimes<T>(value: T, options: DeepLocalizeOptions = {}): T {
  const date = options.date ?? new Date();
  const skipKeys = new Set(options.skipKeys ?? []);
  return localizeNode(value, false, date, skipKeys) as T;
}
