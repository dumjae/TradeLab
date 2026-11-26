import { createHash } from 'node:crypto';
import type { DiscoveryCandidate } from '../../src/types/visual-learning';
import {
  buildYouTubeOEmbedUrl,
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  isValidYouTubeVideoId,
  parseYouTubeChaptersFromDescription,
  safeServerFetch,
  sanitizePlainText,
} from './urlSecurity';

export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

export interface ApiResponse {
  status(code: number): { json(payload: unknown): void };
  setHeader(name: string, value: string): void;
}

export interface YouTubeOEmbedResult {
  ok: boolean;
  status: number;
  title: string;
  authorName: string;
  authorUrl: string | null;
  thumbnailUrl: string;
  embeddable: boolean;
}

export interface YouTubeVideoDetails {
  videoId: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnailUrl: string;
  durationSeconds: number | null;
  embeddable: boolean;
  privacyStatus: string;
  detectedChapters: Array<{
    startSeconds: number;
    endSeconds: number | null;
    segmentTitle: string;
  }>;
}

interface RawOEmbedPayload {
  title?: unknown;
  author_name?: unknown;
  author_url?: unknown;
  thumbnail_url?: unknown;
}

interface RawYouTubeVideosResponse {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      channelTitle?: string;
      description?: string;
      thumbnails?: {
        maxres?: { url?: string };
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
    contentDetails?: {
      duration?: string;
    };
    status?: {
      embeddable?: boolean;
      privacyStatus?: string;
    };
  }>;
}

interface RawYouTubeSearchResponse {
  items?: Array<{
    id?: {
      videoId?: string;
    };
  }>;
}

const ISO8601_DURATION_PATTERN = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

const EDUCATIONAL_KEYWORDS = [
  'liquidity',
  'market structure',
  'order flow',
  'fair value gap',
  'fvg',
  'break of structure',
  'bos',
  'equal highs',
  'equal lows',
  'sweep',
  'breakout',
  'risk management',
  'price action',
  'trading psychology',
  'explained',
  'tutorial',
  'guide',
  'lesson',
  'chart',
];

const CLICKBAIT_PENALTY_TERMS = [
  '100% win',
  '99% win',
  'never lose',
  'guaranteed profit',
  'get rich quick',
  'lamborghini',
  'millionaire overnight',
  'secret indicator',
  'free money',
];

export function parseJsonBody(req: ApiRequest): unknown {
  if (typeof req.body === 'string') {
    if (!req.body.trim()) {
      return {};
    }
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return req.body ?? {};
}

export function buildQueryHash(lessonId: string, query: string): string {
  const normalized = `${lessonId.trim().toLowerCase()}::${query.trim().toLowerCase().replace(/\s+/g, ' ')}`;
  return createHash('sha256').update(normalized, 'utf8').digest('hex');
}

export function parseIso8601Duration(isoDuration: string | undefined | null): number | null {
  if (typeof isoDuration !== 'string' || !isoDuration.trim()) {
    return null;
  }

  const match = isoDuration.trim().match(ISO8601_DURATION_PATTERN);
  if (!match) {
    return null;
  }

  const days = match[1] ? Number.parseInt(match[1], 10) : 0;
  const hours = match[2] ? Number.parseInt(match[2], 10) : 0;
  const minutes = match[3] ? Number.parseInt(match[3], 10) : 0;
  const seconds = match[4] ? Number.parseInt(match[4], 10) : 0;

  if (!match[1] && !match[2] && !match[3] && !match[4]) {
    return null;
  }

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

export async function fetchYouTubeOEmbed(videoId: string): Promise<YouTubeOEmbedResult> {
  if (!isValidYouTubeVideoId(videoId)) {
    return {
      ok: false,
      status: 400,
      title: '',
      authorName: '',
      authorUrl: null,
      thumbnailUrl: '',
      embeddable: false,
    };
  }

  const oembedUrl = buildYouTubeOEmbedUrl(videoId);
  const fallbackThumb = buildYouTubeThumbnailUrl(videoId, 'hq');

  try {
    const response = await safeServerFetch(oembedUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      timeoutMs: 6000,
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        title: '',
        authorName: '',
        authorUrl: null,
        thumbnailUrl: fallbackThumb,
        embeddable: false,
      };
    }

    const payload = (await response.json()) as RawOEmbedPayload;
    const title = typeof payload.title === 'string' ? sanitizePlainText(payload.title, 200) : '';
    const authorName =
      typeof payload.author_name === 'string' ? sanitizePlainText(payload.author_name, 120) : '';
    const authorUrl =
      typeof payload.author_url === 'string' && payload.author_url.startsWith('https://')
        ? payload.author_url
        : null;
    const thumbnailUrl =
      typeof payload.thumbnail_url === 'string' && payload.thumbnail_url.startsWith('https://')
        ? payload.thumbnail_url
        : fallbackThumb;

    return {
      ok: true,
      status: response.status,
      title,
      authorName,
      authorUrl,
      thumbnailUrl,
      embeddable: true,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      title: '',
      authorName: '',
      authorUrl: null,
      thumbnailUrl: fallbackThumb,
      embeddable: false,
    };
  }
}

export async function fetchYouTubeVideosBatch(
  videoIds: string[],
  apiKey: string,
): Promise<Map<string, YouTubeVideoDetails>> {
  const resultMap = new Map<string, YouTubeVideoDetails>();
  const validIds = Array.from(new Set(videoIds.filter((id) => isValidYouTubeVideoId(id))));

  if (validIds.length === 0 || !apiKey.trim()) {
    return resultMap;
  }

  const BATCH_SIZE = 50;
  for (let offset = 0; offset < validIds.length; offset += BATCH_SIZE) {
    const batch = validIds.slice(offset, offset + BATCH_SIZE);
    const endpoint = new URL('https://www.googleapis.com/youtube/v3/videos');
    endpoint.searchParams.set('part', 'snippet,contentDetails,status');
    endpoint.searchParams.set('id', batch.join(','));
    endpoint.searchParams.set('key', apiKey.trim());

    const response = await safeServerFetch(endpoint.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      timeoutMs: 8000,
    });

    if (!response.ok) {
      throw new Error(`YouTube videos.list failed with status ${response.status}`);
    }

    const payload = (await response.json()) as RawYouTubeVideosResponse;
    for (const item of payload.items ?? []) {
      const id = item.id;
      if (!id || !isValidYouTubeVideoId(id)) {
        continue;
      }

      const rawDescription = item.snippet?.description ?? '';
      const durationSeconds = parseIso8601Duration(item.contentDetails?.duration);
      const parsedChapters = parseYouTubeChaptersFromDescription(
        rawDescription,
        durationSeconds ?? undefined,
      );

      const thumbnailUrl =
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        buildYouTubeThumbnailUrl(id, 'hq');

      resultMap.set(id, {
        videoId: id,
        title: sanitizePlainText(item.snippet?.title ?? '', 200),
        channelTitle: sanitizePlainText(item.snippet?.channelTitle ?? '', 120),
        description: sanitizePlainText(rawDescription, 1200),
        thumbnailUrl,
        durationSeconds,
        embeddable: item.status?.embeddable !== false,
        privacyStatus: item.status?.privacyStatus ?? 'unknown',
        detectedChapters: parsedChapters.map((chapter) => ({
          startSeconds: chapter.startSeconds,
          endSeconds: chapter.endSeconds ?? null,
          segmentTitle: chapter.title,
        })),
      });
    }
  }

  return resultMap;
}

export function scoreEducationalCandidate(
  details: YouTubeVideoDetails,
  queryText: string,
): number {
  let score = 45;

  if (details.embeddable && details.privacyStatus === 'public') {
    score += 15;
  } else {
    score -= 35;
  }

  if (details.durationSeconds !== null) {
    if (details.durationSeconds >= 180 && details.durationSeconds <= 2100) {
      score += 15;
    } else if (details.durationSeconds >= 60 && details.durationSeconds <= 3600) {
      score += 6;
    } else {
      score -= 10;
    }
  }

  if (details.detectedChapters.length >= 2) {
    score += 12;
  }

  const combinedLower = `${details.title} ${details.description}`.toLowerCase();
  const queryTokens = queryText
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length >= 3);

  const matchedQueryTokens = queryTokens.filter((token) => combinedLower.includes(token)).length;
  score += Math.min(12, matchedQueryTokens * 3);

  const matchedEducationalTerms = EDUCATIONAL_KEYWORDS.filter((term) =>
    combinedLower.includes(term),
  ).length;
  score += Math.min(10, matchedEducationalTerms * 2);

  const hasClickbait = CLICKBAIT_PENALTY_TERMS.some((term) => combinedLower.includes(term));
  if (hasClickbait) {
    score -= 25;
  }

  // Penalize shouting ALL CAPS titles
  const alphaChars = details.title.replace(/[^a-zA-Z]/g, '');
  if (alphaChars.length >= 12) {
    const upperRatio = alphaChars.replace(/[^A-Z]/g, '').length / alphaChars.length;
    if (upperRatio > 0.78) {
      score -= 10;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function filterDuplicateCandidates(
  candidates: DiscoveryCandidate[],
  existingVideoIds: Set<string>,
): DiscoveryCandidate[] {
  const seen = new Set<string>(existingVideoIds);
  const filtered: DiscoveryCandidate[] = [];

  for (const candidate of candidates) {
    if (!isValidYouTubeVideoId(candidate.externalVideoId)) {
      continue;
    }
    if (seen.has(candidate.externalVideoId)) {
      continue;
    }
    seen.add(candidate.externalVideoId);
    filtered.push(candidate);
  }

  return filtered;
}

export async function searchYouTubeEducationalVideos(
  query: string,
  apiKey: string,
  maxResults = 5,
): Promise<DiscoveryCandidate[]> {
  const clampedMax = Math.max(1, Math.min(10, Math.floor(maxResults)));
  const searchEndpoint = new URL('https://www.googleapis.com/youtube/v3/search');
  searchEndpoint.searchParams.set('part', 'snippet');
  searchEndpoint.searchParams.set('type', 'video');
  searchEndpoint.searchParams.set('videoEmbeddable', 'true');
  searchEndpoint.searchParams.set('safeSearch', 'strict');
  searchEndpoint.searchParams.set('relevanceLanguage', 'en');
  searchEndpoint.searchParams.set('maxResults', String(clampedMax));
  searchEndpoint.searchParams.set('q', query);
  searchEndpoint.searchParams.set('key', apiKey.trim());

  const searchRes = await safeServerFetch(searchEndpoint.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    timeoutMs: 8000,
  });

  if (!searchRes.ok) {
    throw new Error(`YouTube search.list failed with status ${searchRes.status}`);
  }

  const searchData = (await searchRes.json()) as RawYouTubeSearchResponse;
  const videoIds = (searchData.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((id): id is string => typeof id === 'string' && isValidYouTubeVideoId(id));

  if (videoIds.length === 0) {
    return [];
  }

  const detailsMap = await fetchYouTubeVideosBatch(videoIds, apiKey);
  const candidates: DiscoveryCandidate[] = [];

  for (const videoId of videoIds) {
    const details = detailsMap.get(videoId);
    if (!details || details.privacyStatus !== 'public') {
      continue;
    }

    candidates.push({
      externalVideoId: details.videoId,
      title: details.title || 'Untitled Educational Video',
      channelTitle: details.channelTitle || 'YouTube Educator',
      description: details.description,
      sourceUrl: buildYouTubeWatchUrl(details.videoId),
      thumbnailUrl: details.thumbnailUrl,
      durationSeconds: details.durationSeconds,
      embeddable: details.embeddable,
      relevanceScore: scoreEducationalCandidate(details, query),
      detectedChapters: details.detectedChapters,
    });
  }

  return candidates.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
