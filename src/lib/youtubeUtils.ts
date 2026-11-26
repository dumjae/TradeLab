export type YouTubeThumbnailQuality = 'hq' | 'mq' | 'maxres';

export type EducationalSourceType = 'youtube' | 'tradingview' | 'other_educator';

export interface ParsedYouTubeChapter {
  startSeconds: number;
  endSeconds?: number;
  title: string;
}

export interface AllowedEducationalUrlResult {
  valid: boolean;
  sourceType: EducationalSourceType | null;
  normalizedUrl?: string;
  videoId?: string;
  reason?: string;
}

export const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const MAX_URL_LENGTH = 2048;
const MAX_DESCRIPTION_LENGTH = 50_000;
const MAX_CHAPTER_TITLE_LENGTH = 160;

const YOUTUBE_WATCH_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
]);

const YOUTUBE_SHORT_HOSTS = new Set(['youtu.be', 'www.youtu.be']);

const YOUTUBE_NOCOOKIE_HOSTS = new Set([
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

const THUMBNAIL_FILENAMES: Record<YouTubeThumbnailQuality, string> = {
  hq: 'hqdefault.jpg',
  mq: 'mqdefault.jpg',
  maxres: 'maxresdefault.jpg',
};

const RESERVED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata',
  'instance-data',
]);

const RESERVED_TLD_SUFFIXES = [
  '.localhost',
  '.local',
  '.internal',
  '.home.arpa',
  '.arpa',
];

const IPV4_PATTERN = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const TRADINGVIEW_SUBDOMAIN_PATTERN = /^[a-z0-9-]+\.tradingview\.com$/;
const TIMESTAMP_HHMMSS_PATTERN = /^(\d{1,2}):([0-5]\d):([0-5]\d)$/;
const TIMESTAMP_MMSS_PATTERN = /^([0-5]?\d):([0-5]\d)$/;
const YOUTUBE_TIME_SECONDS_PATTERN = /^(\d{1,7})s?$/i;
const YOUTUBE_TIME_HMS_PATTERN = /^(?:(\d{1,4})h)?(?:(\d{1,5})m)?(?:(\d{1,6})s)?$/i;
const CHAPTER_LINE_PATTERN =
  /^\s*(?:[-*•]\s+)?(?:\[((?:\d{1,2}:)?[0-5]?\d:[0-5]\d)\]|\(((?:\d{1,2}:)?[0-5]?\d:[0-5]\d)\)|((?:\d{1,2}:)?[0-5]?\d:[0-5]\d))(?:\s*[-–—|]\s*|\s*:\s+|\s+)(.+?)\s*$/;

export function isValidYouTubeVideoId(videoId: string): boolean {
  return typeof videoId === 'string' && YOUTUBE_VIDEO_ID_PATTERN.test(videoId);
}

function stripControlCharacters(value: string): string {
  let result = '';
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    const isAsciiControl = code < 0x20 || code === 0x7f;
    const isBidiOverride =
      (code >= 0x202a && code <= 0x202e) ||
      (code >= 0x2066 && code <= 0x2069) ||
      code === 0xfeff;
    if (!isAsciiControl && !isBidiOverride) {
      result += value[i];
    }
  }
  return result;
}

function parseStrictHttpsUrl(rawUrl: string): { url: URL | null; reason?: string } {
  if (typeof rawUrl !== 'string') {
    return { url: null, reason: 'URL must be a string' };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { url: null, reason: 'URL cannot be empty' };
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    return { url: null, reason: 'URL exceeds maximum allowed length' };
  }

  if (stripControlCharacters(trimmed) !== trimmed) {
    return { url: null, reason: 'URL contains disallowed control characters' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { url: null, reason: 'Malformed URL' };
  }

  if (parsed.protocol !== 'https:') {
    return { url: null, reason: 'Only HTTPS URLs are permitted' };
  }

  if (parsed.username || parsed.password) {
    return { url: null, reason: 'URLs with embedded credentials are not permitted' };
  }

  if (parsed.port !== '' && parsed.port !== '443') {
    return { url: null, reason: 'Non-standard ports are not permitted' };
  }

  return { url: parsed };
}

function isIpLiteralOrPrivateHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  if (!lower || !lower.includes('.') || lower.endsWith('.')) {
    return true;
  }

  if (RESERVED_HOSTNAMES.has(lower)) {
    return true;
  }

  if (RESERVED_TLD_SUFFIXES.some((suffix) => lower.endsWith(suffix))) {
    return true;
  }

  // Reject IPv6 literals (bracketed in WHATWG URL.hostname) or colon-containing hosts
  if (lower.startsWith('[') || lower.includes(':')) {
    return true;
  }

  // Reject all IPv4 literals (including private, loopback, link-local, metadata, public IPs)
  if (IPV4_PATTERN.test(lower)) {
    return true;
  }

  // Reject integer/hex/octal encoded IP hostnames
  if (/^(?:0x[0-9a-f]+|\d+)$/i.test(lower)) {
    return true;
  }

  return false;
}

function isAllowedYouTubeHost(hostname: string): boolean {
  return (
    YOUTUBE_WATCH_HOSTS.has(hostname) ||
    YOUTUBE_SHORT_HOSTS.has(hostname) ||
    YOUTUBE_NOCOOKIE_HOSTS.has(hostname)
  );
}

function isAllowedTradingViewHost(hostname: string): boolean {
  return hostname === 'tradingview.com' || TRADINGVIEW_SUBDOMAIN_PATTERN.test(hostname);
}

export function extractYouTubeVideoId(url: string): string | null {
  const { url: parsed } = parseStrictHttpsUrl(url);
  if (!parsed) {
    return null;
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!isAllowedYouTubeHost(hostname)) {
    return null;
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  let candidate: string | null = null;

  if (YOUTUBE_SHORT_HOSTS.has(hostname)) {
    if (segments.length === 1) {
      candidate = segments[0];
    }
  } else if (YOUTUBE_NOCOOKIE_HOSTS.has(hostname)) {
    if (segments.length === 2 && segments[0] === 'embed') {
      candidate = segments[1];
    }
  } else if (YOUTUBE_WATCH_HOSTS.has(hostname)) {
    if (parsed.pathname === '/watch') {
      candidate = parsed.searchParams.get('v');
    } else if (
      segments.length === 2 &&
      (segments[0] === 'embed' || segments[0] === 'shorts' || segments[0] === 'live')
    ) {
      candidate = segments[1];
    }
  }

  if (!candidate || !isValidYouTubeVideoId(candidate)) {
    return null;
  }

  return candidate;
}

function parseYouTubeTimeParam(rawValue: string): number | null {
  const trimmed = rawValue.trim();
  if (!trimmed || trimmed.length > 32) {
    return null;
  }

  const secondsMatch = trimmed.match(YOUTUBE_TIME_SECONDS_PATTERN);
  if (secondsMatch) {
    const seconds = Number.parseInt(secondsMatch[1], 10);
    return Number.isSafeInteger(seconds) && seconds >= 0 ? seconds : null;
  }

  const hmsMatch = trimmed.match(YOUTUBE_TIME_HMS_PATTERN);
  if (hmsMatch && (hmsMatch[1] || hmsMatch[2] || hmsMatch[3])) {
    const hours = hmsMatch[1] ? Number.parseInt(hmsMatch[1], 10) : 0;
    const minutes = hmsMatch[2] ? Number.parseInt(hmsMatch[2], 10) : 0;
    const seconds = hmsMatch[3] ? Number.parseInt(hmsMatch[3], 10) : 0;
    const total = hours * 3600 + minutes * 60 + seconds;
    return Number.isSafeInteger(total) && total >= 0 ? total : null;
  }

  return parseTimestampToSeconds(trimmed);
}

export function extractYouTubeTimestampFromUrl(rawUrl: string): number | null {
  const { url: parsed } = parseStrictHttpsUrl(rawUrl);
  if (!parsed || !extractYouTubeVideoId(rawUrl)) {
    return null;
  }

  const candidates = [parsed.searchParams.get('t'), parsed.searchParams.get('start')];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') {
      continue;
    }
    const parsedSeconds = parseYouTubeTimeParam(candidate);
    if (parsedSeconds !== null) {
      return parsedSeconds;
    }
  }

  return null;
}

export function buildNoCookieEmbedUrl(
  videoId: string,
  startSeconds?: number,
  endSeconds?: number,
): string {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new Error('Invalid YouTube video ID');
  }

  const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  embedUrl.searchParams.set('rel', '0');
  embedUrl.searchParams.set('modestbranding', '1');
  embedUrl.searchParams.set('enablejsapi', '1');

  const safeStart =
    startSeconds !== undefined && Number.isFinite(startSeconds) && startSeconds > 0
      ? Math.floor(startSeconds)
      : undefined;

  if (safeStart !== undefined) {
    embedUrl.searchParams.set('start', String(safeStart));
  }

  if (endSeconds !== undefined && Number.isFinite(endSeconds) && endSeconds > 0) {
    const safeEnd = Math.floor(endSeconds);
    if (safeStart === undefined || safeEnd > safeStart) {
      embedUrl.searchParams.set('end', String(safeEnd));
    }
  }

  return embedUrl.toString();
}

export function buildYouTubeWatchUrl(videoId: string, startSeconds?: number): string {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new Error('Invalid YouTube video ID');
  }

  const watchUrl = new URL('https://www.youtube.com/watch');
  watchUrl.searchParams.set('v', videoId);

  if (startSeconds !== undefined && Number.isFinite(startSeconds) && startSeconds > 0) {
    watchUrl.searchParams.set('t', `${Math.floor(startSeconds)}s`);
  }

  return watchUrl.toString();
}

export function buildYouTubeThumbnailUrl(
  videoId: string,
  quality: YouTubeThumbnailQuality = 'hq',
): string {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new Error('Invalid YouTube video ID');
  }

  const filename = THUMBNAIL_FILENAMES[quality];
  return `https://i.ytimg.com/vi/${videoId}/${filename}`;
}

export function formatTimestamp(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00';
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedMinutes}:${paddedSeconds}`;
}

export function parseTimestampToSeconds(input: string): number | null {
  if (typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 16) {
    return null;
  }

  const hhmmssMatch = trimmed.match(TIMESTAMP_HHMMSS_PATTERN);
  if (hhmmssMatch) {
    const hours = Number.parseInt(hhmmssMatch[1], 10);
    const minutes = Number.parseInt(hhmmssMatch[2], 10);
    const seconds = Number.parseInt(hhmmssMatch[3], 10);
    return hours * 3600 + minutes * 60 + seconds;
  }

  const mmssMatch = trimmed.match(TIMESTAMP_MMSS_PATTERN);
  if (mmssMatch) {
    const minutes = Number.parseInt(mmssMatch[1], 10);
    const seconds = Number.parseInt(mmssMatch[2], 10);
    return minutes * 60 + seconds;
  }

  return null;
}

export function parseYouTubeChaptersFromDescription(
  description: string,
  maxDurationSeconds?: number,
): ParsedYouTubeChapter[] {
  if (typeof description !== 'string' || !description.trim()) {
    return [];
  }

  const safeDescription =
    description.length > MAX_DESCRIPTION_LENGTH
      ? description.slice(0, MAX_DESCRIPTION_LENGTH)
      : description;

  const hasDurationBound =
    maxDurationSeconds !== undefined &&
    Number.isFinite(maxDurationSeconds) &&
    maxDurationSeconds > 0;
  const maxDuration = hasDurationBound ? Math.floor(maxDurationSeconds) : undefined;

  const lines = safeDescription.split(/\r?\n/);
  const rawChapters: Array<{ startSeconds: number; title: string }> = [];

  for (const line of lines) {
    const match = line.match(CHAPTER_LINE_PATTERN);
    if (!match) {
      continue;
    }

    const rawTimestamp = match[1] ?? match[2] ?? match[3];
    const startSeconds = parseTimestampToSeconds(rawTimestamp);
    if (startSeconds === null) {
      continue;
    }

    if (maxDuration !== undefined && startSeconds >= maxDuration) {
      continue;
    }

    const cleanedTitle = stripControlCharacters(match[4])
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_CHAPTER_TITLE_LENGTH);

    if (!cleanedTitle) {
      continue;
    }

    rawChapters.push({ startSeconds, title: cleanedTitle });
  }

  if (rawChapters.length < 2) {
    return [];
  }

  // Enforce strict chronological ordering (official YouTube chapter requirement)
  for (let i = 1; i < rawChapters.length; i += 1) {
    if (rawChapters[i].startSeconds <= rawChapters[i - 1].startSeconds) {
      return [];
    }
  }

  return rawChapters.map((chapter, index) => {
    const nextChapter = rawChapters[index + 1];
    if (nextChapter) {
      return {
        startSeconds: chapter.startSeconds,
        endSeconds: nextChapter.startSeconds,
        title: chapter.title,
      };
    }

    if (maxDuration !== undefined && maxDuration > chapter.startSeconds) {
      return {
        startSeconds: chapter.startSeconds,
        endSeconds: maxDuration,
        title: chapter.title,
      };
    }

    return {
      startSeconds: chapter.startSeconds,
      title: chapter.title,
    };
  });
}

export function isAllowedEducationalUrl(rawUrl: string): AllowedEducationalUrlResult {
  const { url: parsed, reason } = parseStrictHttpsUrl(rawUrl);
  if (!parsed) {
    return { valid: false, sourceType: null, reason };
  }

  const hostname = parsed.hostname.toLowerCase();

  if (isIpLiteralOrPrivateHost(hostname)) {
    return {
      valid: false,
      sourceType: null,
      reason: 'Private, loopback, link-local, or IP-literal hosts are not permitted',
    };
  }

  if (isAllowedYouTubeHost(hostname)) {
    const videoId = extractYouTubeVideoId(rawUrl);
    if (!videoId) {
      return {
        valid: false,
        sourceType: null,
        reason: 'YouTube URL must reference a valid 11-character video ID',
      };
    }

    return {
      valid: true,
      sourceType: 'youtube',
      normalizedUrl: buildYouTubeWatchUrl(videoId),
      videoId,
    };
  }

  if (isAllowedTradingViewHost(hostname)) {
    return {
      valid: true,
      sourceType: 'tradingview',
      normalizedUrl: parsed.toString(),
    };
  }

  return {
    valid: true,
    sourceType: 'other_educator',
    normalizedUrl: parsed.toString(),
  };
}
