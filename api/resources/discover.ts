import type { DiscoveryCandidate } from '../../src/types/visual-learning';
import { getLessonById, getLessonBySlug } from '../../src/data/curriculum';
import { createServerSupabaseClient, verifyAdminRequest } from '../_lib/auth';
import { DiscoverRequestSchema } from '../_lib/urlSecurity';
import {
  type ApiRequest,
  type ApiResponse,
  buildQueryHash,
  filterDuplicateCandidates,
  parseJsonBody,
  searchYouTubeEducationalVideos,
} from '../_lib/youtube';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheRow {
  results_json: DiscoveryCandidate[] | null;
  expires_at: string;
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

  const parsed = DiscoverRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Validation failed.',
      details: parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  const { lessonId, query, maxResults, forceRefresh } = parsed.data;
  const lesson = getLessonById(lessonId) ?? getLessonBySlug(lessonId);
  const resolvedLessonId = lesson?.id ?? lessonId;
  const queryHash = buildQueryHash(resolvedLessonId, query);
  const supabase = createServerSupabaseClient();

  if (supabase && !forceRefresh) {
    const { data: cachedRow } = await supabase
      .from('resource_discovery_cache')
      .select('results_json, expires_at')
      .eq('query_hash', queryHash)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle<CacheRow>();

    if (cachedRow && Array.isArray(cachedRow.results_json)) {
      res.status(200).json({
        cached: true,
        source: 'youtube_api',
        candidates: cachedRow.results_json,
        message: 'Served from 24-hour discovery cache to conserve YouTube API quota.',
      });
      return;
    }
  }

  const youtubeApiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!youtubeApiKey) {
    res.status(200).json({
      cached: false,
      source: 'fallback_unavailable',
      candidates: [],
      message:
        'YOUTUBE_API_KEY is not configured on the server. Use Manual URL Curation to add verified YouTube or TradingView resources via oEmbed.',
    });
    return;
  }

  try {
    const rawCandidates = await searchYouTubeEducationalVideos(query, youtubeApiKey, maxResults);

    const existingVideoIds = new Set<string>();
    if (supabase && rawCandidates.length > 0) {
      const candidateIds = rawCandidates.map((candidate) => candidate.externalVideoId);
      const { data: existingRows } = await supabase
        .from('educational_resources')
        .select('external_video_id')
        .in('external_video_id', candidateIds);

      for (const row of existingRows ?? []) {
        if (typeof row.external_video_id === 'string') {
          existingVideoIds.add(row.external_video_id);
        }
      }
    }

    const candidates = filterDuplicateCandidates(rawCandidates, existingVideoIds);

    let stagedCount = 0;
    if (supabase && candidates.length > 0) {
      const stagedPayloads = candidates.map((candidate) => ({
        title: candidate.title,
        description: candidate.description,
        source_type: 'youtube',
        source_name: candidate.channelTitle,
        source_url: candidate.sourceUrl,
        external_video_id: candidate.externalVideoId,
        thumbnail_url: candidate.thumbnailUrl,
        duration_seconds: candidate.durationSeconds,
        content_type: 'video',
        license_status: 'standard_embed_only',
        attribution: `Video by ${candidate.channelTitle} on YouTube. Embedded via official YouTube privacy-enhanced player.`,
        non_endorsement_notice: true,
        // NEVER auto-publish discovered candidates — strict editorial approval required
        verification_status: 'pending_review',
        quality_score: candidate.relevanceScore,
        embeddable: candidate.embeddable,
        last_checked_at: new Date().toISOString(),
        created_by: auth.userId ?? null,
      }));

      const { data: insertedRows, error: insertError } = await supabase
        .from('educational_resources')
        .upsert(stagedPayloads, {
          onConflict: 'external_video_id',
          ignoreDuplicates: true,
        })
        .select('id, external_video_id');

      if (!insertError && Array.isArray(insertedRows)) {
        stagedCount = insertedRows.length;

        if (lesson) {
          const mappingPayloads = insertedRows.map((row, idx) => ({
            lesson_id: lesson.id,
            resource_id: row.id as string,
            relevance_score:
              candidates.find((c) => c.externalVideoId === row.external_video_id)
                ?.relevanceScore ?? 75,
            display_order: 10 + idx,
            before_watch_context: `Pending editorial review for ${lesson.title}.`,
            after_watch_takeaways: [],
            editorial_notes: 'Staged from YouTube Data API discovery. Review before publishing.',
          }));

          await supabase.from('lesson_resources').upsert(mappingPayloads, {
            onConflict: 'lesson_id,resource_id',
            ignoreDuplicates: true,
          });
        }
      }

      const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString();
      await supabase.from('resource_discovery_cache').upsert(
        {
          query_hash: queryHash,
          lesson_id: lesson?.id ?? null,
          provider: 'youtube_data_api',
          query_text: query,
          results_json: candidates,
          expires_at: expiresAt,
        },
        { onConflict: 'query_hash' },
      );
    }

    res.status(200).json({
      cached: false,
      source: 'youtube_api',
      candidates,
      stagedCount,
      message:
        candidates.length > 0
          ? `Discovered ${candidates.length} candidate(s) and staged ${stagedCount} for editorial review.`
          : 'No new uncurated embeddable videos matched this query.',
    });
  } catch {
    res.status(502).json({
      cached: false,
      source: 'fallback_unavailable',
      candidates: [],
      error: 'Upstream YouTube discovery request failed. Try Manual URL Curation or retry later.',
    });
  }
}
