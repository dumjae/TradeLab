import { z } from 'zod';
import {
  buildNoCookieEmbedUrl,
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  extractYouTubeVideoId,
  isAllowedEducationalUrl,
  isValidYouTubeVideoId,
  parseYouTubeChaptersFromDescription,
} from '../../src/lib/youtubeUtils';

export {
  buildNoCookieEmbedUrl,
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  extractYouTubeVideoId,
  isAllowedEducationalUrl,
  isValidYouTubeVideoId,
  parseYouTubeChaptersFromDescription,
};

export type AllowedServerFetchHost =
  | 'www.youtube.com'
  | 'www.googleapis.com'
  | 'www.tradingview.com'
  | 'api.binance.com'
  | 'api.twelvedata.com'
  | 'query1.finance.yahoo.com';

export interface ServerFetchUrlCheck {
  allowed: boolean;
  url?: string;
  host?: AllowedServerFetchHost;
  reason?: string;
}

export class UrlSecurityError extends Error {
  public readonly statusCode = 400;
  public readonly code: string;

  constructor(message: string, code = 'DISALLOWED_URL') {
    super(message);
    this.name = 'UrlSecurityError';
    this.code = code;
  }
}

const ALLOWED_SERVER_FETCH_HOSTS = new Set<AllowedServerFetchHost>([
  'www.youtube.com',
  'www.googleapis.com',
  'www.tradingview.com',
  'api.binance.com',
  'api.twelvedata.com',
  'query1.finance.yahoo.com',
]);

const DEFAULT_FETCH_TIMEOUT_MS = 8000;
const SAFE_IDENTIFIER_PATTERN = /^[a-zA-Z0-9_-]{1,120}$/;

export function sanitizePlainText(input: string, maxLength = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  const normalized = input.replace(/\r\n?/g, '\n');
  let cleaned = '';

  for (let i = 0; i < normalized.length; i += 1) {
    const code = normalized.charCodeAt(i);
    const isAllowedWhitespace = code === 0x09 || code === 0x0a;
    const isAsciiControl = (code < 0x20 && !isAllowedWhitespace) || code === 0x7f;
    const isBidiOrBom =
      (code >= 0x202a && code <= 0x202e) ||
      (code >= 0x2066 && code <= 0x2069) ||
      code === 0xfeff;

    if (!isAsciiControl && !isBidiOrBom) {
      cleaned += normalized[i];
    }
  }

  const trimmed = cleaned.trim();
  const limit = Number.isFinite(maxLength) && maxLength > 0 ? Math.floor(maxLength) : 500;
  return trimmed.slice(0, limit);
}

function isAllowedServerHostPath(host: AllowedServerFetchHost, pathname: string): boolean {
  if (pathname.includes('..') || pathname.includes('\\')) {
    return false;
  }

  let decodedPathname: string;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  if (decodedPathname.includes('..') || decodedPathname.includes('\\')) {
    return false;
  }

  if (host === 'www.youtube.com') {
    return pathname === '/oembed';
  }

  if (host === 'www.googleapis.com') {
    return pathname.startsWith('/youtube/v3/');
  }

  if (host === 'www.tradingview.com') {
    return pathname.startsWith('/');
  }

  if (host === 'api.binance.com') {
    return pathname === '/api/v3/klines';
  }

  if (host === 'api.twelvedata.com') {
    return pathname === '/time_series';
  }

  if (host === 'query1.finance.yahoo.com') {
    return pathname.startsWith('/v8/finance/chart/');
  }

  return false;
}

export function isAllowedServerFetchUrl(rawUrl: string): ServerFetchUrlCheck {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return { allowed: false, reason: 'Fetch URL must be a non-empty string' };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > 2048) {
    return { allowed: false, reason: 'Fetch URL exceeds maximum allowed length' };
  }

  if (trimmed.includes('..') || trimmed.includes('\\')) {
    return { allowed: false, reason: 'Path traversal segments are not permitted' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { allowed: false, reason: 'Malformed server fetch URL' };
  }

  if (parsed.protocol !== 'https:') {
    return { allowed: false, reason: 'Server fetches must use HTTPS' };
  }

  if (parsed.username || parsed.password) {
    return { allowed: false, reason: 'Server fetch URLs must not contain credentials' };
  }

  if (parsed.port !== '' && parsed.port !== '443') {
    return { allowed: false, reason: 'Server fetches may only use port 443' };
  }

  const host = parsed.hostname.toLowerCase() as AllowedServerFetchHost;
  if (!ALLOWED_SERVER_FETCH_HOSTS.has(host)) {
    return {
      allowed: false,
      reason: `Host "${parsed.hostname}" is not on the server-side allowlist`,
    };
  }

  if (!isAllowedServerHostPath(host, parsed.pathname)) {
    return {
      allowed: false,
      reason: `Path "${parsed.pathname}" is not permitted for host "${host}"`,
    };
  }

  return {
    allowed: true,
    url: parsed.toString(),
    host,
  };
}

export function assertSafeServerFetchUrl(rawUrl: string): URL {
  const check = isAllowedServerFetchUrl(rawUrl);
  if (!check.allowed || !check.url) {
    throw new UrlSecurityError(check.reason ?? 'Disallowed server fetch URL');
  }
  return new URL(check.url);
}

export function buildYouTubeOEmbedUrl(videoId: string): string {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new UrlSecurityError('Invalid YouTube video ID', 'INVALID_VIDEO_ID');
  }

  const targetWatchUrl = buildYouTubeWatchUrl(videoId);
  const oembedUrl = new URL('https://www.youtube.com/oembed');
  oembedUrl.searchParams.set('url', targetWatchUrl);
  oembedUrl.searchParams.set('format', 'json');
  return oembedUrl.toString();
}

export async function safeServerFetch(
  rawUrl: string,
  options: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const validatedUrl = assertSafeServerFetchUrl(rawUrl);
  const { timeoutMs = DEFAULT_FETCH_TIMEOUT_MS, signal, ...fetchInit } = options;

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  return fetch(validatedUrl.toString(), {
    ...fetchInit,
    redirect: 'error',
    signal: combinedSignal,
  });
}

export const ExplanationStyleSchema = z.enum([
  'beginner_friendly',
  'step_by_step_visual',
  'real_chart_example',
  'analogy_based',
  'comparison',
  'common_mistakes',
]);

export const LearningModeSchema = z.enum([
  'lesson',
  'tutorial',
  'practice',
  'trading_lab',
  'library',
]);

export const DiscoverRequestSchema = z.object({
  lessonId: z.string().trim().regex(SAFE_IDENTIFIER_PATTERN, 'Invalid lesson ID'),
  query: z
    .string()
    .trim()
    .min(2, 'Search query must be at least 2 characters')
    .max(160, 'Search query must be 160 characters or fewer')
    .transform((val) => sanitizePlainText(val, 160))
    .refine((val) => val.length >= 2, 'Search query must contain valid text'),
  conceptKey: z.string().trim().regex(SAFE_IDENTIFIER_PATTERN, 'Invalid concept key').optional(),
  maxResults: z.number().int().min(1).max(10).default(5),
  forceRefresh: z.boolean().default(false),
});

export const MetadataRequestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'URL is required')
    .max(2048, 'URL exceeds maximum length')
    .superRefine((val, ctx) => {
      const check = isAllowedEducationalUrl(val);
      if (!check.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: check.reason ?? 'Invalid or disallowed educational URL',
        });
      }
    }),
  includeChapters: z.boolean().default(true),
});

export const HealthCheckRequestSchema = z.object({
  resourceIds: z
    .array(z.string().trim().regex(SAFE_IDENTIFIER_PATTERN, 'Invalid resource ID'))
    .max(50, 'At most 50 resources can be checked per batch')
    .optional(),
  limit: z.number().int().min(1).max(50).default(25),
  includeUnavailable: z.boolean().default(false),
});

export const ExplainDifferentlyRequestSchema = z.object({
  lessonSlug: z.string().trim().regex(SAFE_IDENTIFIER_PATTERN, 'Invalid lesson slug'),
  conceptKey: z.string().trim().regex(SAFE_IDENTIFIER_PATTERN, 'Invalid concept key'),
  style: ExplanationStyleSchema,
  mode: LearningModeSchema.default('lesson'),
  userQuestion: z
    .string()
    .trim()
    .max(500, 'Question must be 500 characters or fewer')
    .transform((val) => sanitizePlainText(val, 500))
    .optional(),
  activeQuestionId: z
    .string()
    .trim()
    .regex(SAFE_IDENTIFIER_PATTERN, 'Invalid exercise ID')
    .optional(),
  hasSubmittedAnswer: z.boolean().default(false),
});

export const MarketTimeframeSchema = z.enum(['5m', '15m', '1h', '4h', '1d']);

function isValidIsoCalendarDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

const IsoDateParamSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
  .refine(isValidIsoCalendarDate, 'Invalid calendar date');

export const MarketOhlcvQuerySchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(24)
    .regex(/^[A-Za-z0-9/^._=-]{1,24}$/, 'Invalid market symbol')
    .refine((val) => !val.includes('..'), 'Invalid market symbol'),
  timeframe: MarketTimeframeSchema.default('15m'),
  limit: z.coerce.number().int().min(50).max(500).default(240),
  startDate: IsoDateParamSchema.optional(),
  endDate: IsoDateParamSchema.optional(),
  refresh: z.enum(['0', '1', 'true', 'false']).optional(),
});

export type MarketTimeframe = z.infer<typeof MarketTimeframeSchema>;
export type MarketOhlcvQuery = z.infer<typeof MarketOhlcvQuerySchema>;
export type ExplanationStyle = z.infer<typeof ExplanationStyleSchema>;
export type LearningMode = z.infer<typeof LearningModeSchema>;
export type DiscoverRequest = z.infer<typeof DiscoverRequestSchema>;
export type MetadataRequest = z.infer<typeof MetadataRequestSchema>;
export type HealthCheckRequest = z.infer<typeof HealthCheckRequestSchema>;
export type ExplainDifferentlyRequest = z.infer<typeof ExplainDifferentlyRequestSchema>;
