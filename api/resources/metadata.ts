import { verifyAdminRequest } from '../_lib/auth';
import {
  buildYouTubeThumbnailUrl,
  isAllowedEducationalUrl,
  MetadataRequestSchema,
  sanitizePlainText,
} from '../_lib/urlSecurity';
import {
  type ApiRequest,
  type ApiResponse,
  fetchYouTubeOEmbed,
  fetchYouTubeVideosBatch,
  parseJsonBody,
} from '../_lib/youtube';

function deriveTitleFromUrlPath(rawUrl: string, fallbackTitle: string): string {
  try {
    const parsed = new URL(rawUrl);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] ?? '';
    const cleaned = lastSegment
      .replace(/[-_]+/g, ' ')
      .replace(/\.[a-z0-9]{1,5}$/i, '')
      .trim();
    const sanitized = sanitizePlainText(cleaned, 140);
    if (sanitized.length >= 3) {
      return sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
    }
    return fallbackTitle;
  } catch {
    return fallbackTitle;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    res.status(auth.statusCode).json({ error: auth.error ?? 'Unauthorized' });
    return;
  }

  const rawBody = parseJsonBody(req);
  if (rawBody === null) {
    res.status(400).json({ error: 'Invalid JSON request body.' });
    return;
  }

  const parsed = MetadataRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    res.status(400).json({
      valid: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid educational URL.',
    });
    return;
  }

  const { url, includeChapters } = parsed.data;
  const urlCheck = isAllowedEducationalUrl(url);
  if (!urlCheck.valid || !urlCheck.sourceType || !urlCheck.normalizedUrl) {
    res.status(400).json({
      valid: false,
      error: urlCheck.reason ?? 'Disallowed URL.',
    });
    return;
  }

  if (urlCheck.sourceType === 'youtube' && urlCheck.videoId) {
    const videoId = urlCheck.videoId;
    const oembed = await fetchYouTubeOEmbed(videoId);
    const youtubeApiKey = process.env.YOUTUBE_API_KEY?.trim();

    let title = oembed.title;
    let sourceName = oembed.authorName || 'YouTube Educator';
    let thumbnailUrl: string | null = oembed.thumbnailUrl || buildYouTubeThumbnailUrl(videoId, 'hq');
    let durationSeconds: number | null = null;
    let embeddable = oembed.embeddable;
    let detectedChapters: Array<{
      startSeconds: number;
      endSeconds: number | null;
      segmentTitle: string;
    }> = [];
    let note = oembed.ok
      ? 'Metadata verified via YouTube oEmbed (zero API quota).'
      : 'Video could not be verified via YouTube oEmbed; confirm the video is public and embeddable before publishing.';

    if (youtubeApiKey) {
      try {
        const detailsMap = await fetchYouTubeVideosBatch([videoId], youtubeApiKey);
        const details = detailsMap.get(videoId);
        if (details) {
          title = details.title || title;
          sourceName = details.channelTitle || sourceName;
          thumbnailUrl = details.thumbnailUrl || thumbnailUrl;
          durationSeconds = details.durationSeconds;
          embeddable = details.embeddable && details.privacyStatus === 'public';
          if (includeChapters) {
            detectedChapters = details.detectedChapters;
          }
          note =
            detectedChapters.length > 0
              ? `Verified via YouTube Data API v3 with ${detectedChapters.length} official creator chapter(s).`
              : 'Verified via YouTube Data API v3. No creator chapters found in description — add timestamps manually after verifying.';
        } else {
          embeddable = false;
          note = 'Video ID was not returned by YouTube Data API v3 (may be private or deleted).';
        }
      } catch {
        note =
          'Metadata fetched via YouTube oEmbed (YouTube Data API enrichment temporarily unavailable).';
      }
    }

    res.status(200).json({
      valid: true,
      sourceType: 'youtube',
      normalizedUrl: urlCheck.normalizedUrl,
      externalVideoId: videoId,
      title: title || `YouTube Video (${videoId})`,
      sourceName,
      thumbnailUrl,
      durationSeconds,
      embeddable,
      detectedChapters,
      attribution: `Video by ${sourceName} on YouTube. Embedded via YouTube privacy-enhanced player; TradeLab Academy is not affiliated with this creator.`,
      note,
    });
    return;
  }

  if (urlCheck.sourceType === 'tradingview') {
    // TradingView links are handled safely without scraping protected chart pages.
    const titleHint = deriveTitleFromUrlPath(urlCheck.normalizedUrl, 'TradingView Chart Study');
    res.status(200).json({
      valid: true,
      sourceType: 'tradingview',
      normalizedUrl: urlCheck.normalizedUrl,
      externalVideoId: null,
      title: titleHint,
      sourceName: 'TradingView',
      thumbnailUrl: null,
      durationSeconds: null,
      embeddable: false,
      detectedChapters: [],
      attribution:
        'External chart idea on TradingView. Opens on TradingView with explicit creator attribution.',
      note: 'TradingView protected content is never scraped. Review and complete title, author attribution, and educational takeaways manually.',
    });
    return;
  }

  const parsedHost = new URL(urlCheck.normalizedUrl).hostname;
  res.status(200).json({
    valid: true,
    sourceType: 'other_educator',
    normalizedUrl: urlCheck.normalizedUrl,
    externalVideoId: null,
    title: deriveTitleFromUrlPath(urlCheck.normalizedUrl, `Educational Guide (${parsedHost})`),
    sourceName: parsedHost,
    thumbnailUrl: null,
    durationSeconds: null,
    embeddable: false,
    detectedChapters: [],
    attribution: `External educational resource hosted on ${parsedHost}.`,
    note: 'External educator links are not scraped by the server. Verify license, attribution, and educational quality manually.',
  });
}
