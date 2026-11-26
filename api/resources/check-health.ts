import { createServerSupabaseClient, verifyCronOrAdmin } from '../_lib/auth';
import { HealthCheckRequestSchema } from '../_lib/urlSecurity';
import {
  type ApiRequest,
  type ApiResponse,
  fetchYouTubeOEmbed,
  fetchYouTubeVideosBatch,
  parseJsonBody,
} from '../_lib/youtube';

interface ResourceHealthRow {
  id: string;
  external_video_id: string | null;
  verification_status: string;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
    return;
  }

  const auth = await verifyCronOrAdmin(req);
  if (!auth.authorized) {
    res.status(auth.statusCode).json({ error: auth.error ?? 'Unauthorized' });
    return;
  }

  const rawBody = req.method === 'POST' ? parseJsonBody(req) : {};
  if (rawBody === null) {
    res.status(400).json({ error: 'Invalid JSON request body.' });
    return;
  }

  const parsed = HealthCheckRequestSchema.safeParse(rawBody);
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

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    res.status(503).json({
      error: 'Database is not configured on the server (missing Supabase service credentials).',
    });
    return;
  }

  const { resourceIds, limit, includeUnavailable } = parsed.data;
  let query = supabase
    .from('educational_resources')
    .select('id, external_video_id, verification_status')
    .eq('source_type', 'youtube')
    .not('external_video_id', 'is', null)
    .order('last_checked_at', { ascending: true, nullsFirst: true })
    .limit(limit);

  if (resourceIds && resourceIds.length > 0) {
    query = query.in('id', resourceIds);
  } else if (!includeUnavailable) {
    query = query.in('verification_status', ['published', 'verified', 'pending_review']);
  }

  const { data: rows, error: queryError } = await query;
  if (queryError) {
    res.status(500).json({ error: 'Failed to load YouTube resources for health check.' });
    return;
  }

  const resources = (rows ?? []) as ResourceHealthRow[];
  if (resources.length === 0) {
    res.status(200).json({
      checked: 0,
      markedUnavailable: 0,
      note: 'No YouTube resources queued for health check.',
    });
    return;
  }

  const nowIso = new Date().toISOString();
  const youtubeApiKey = process.env.YOUTUBE_API_KEY?.trim();
  let markedUnavailable = 0;
  let method: 'youtube_videos_api' | 'youtube_oembed' = 'youtube_oembed';

  if (youtubeApiKey) {
    try {
      const videoIds = resources
        .map((row) => row.external_video_id)
        .filter((id): id is string => typeof id === 'string');
      const detailsMap = await fetchYouTubeVideosBatch(videoIds, youtubeApiKey);
      method = 'youtube_videos_api';

      for (const row of resources) {
        const videoId = row.external_video_id;
        const details = videoId ? detailsMap.get(videoId) : undefined;
        const isHealthy = Boolean(
          details && details.privacyStatus === 'public' && details.embeddable,
        );

        if (!isHealthy) {
          markedUnavailable += 1;
          await supabase
            .from('educational_resources')
            .update({
              verification_status: 'unavailable',
              embeddable: false,
              last_checked_at: nowIso,
            })
            .eq('id', row.id);
        } else {
          await supabase
            .from('educational_resources')
            .update({
              embeddable: true,
              last_checked_at: nowIso,
            })
            .eq('id', row.id);
        }
      }
    } catch {
      method = 'youtube_oembed';
    }
  }

  if (method === 'youtube_oembed') {
    for (const row of resources) {
      const videoId = row.external_video_id;
      if (!videoId) {
        continue;
      }

      const oembed = await fetchYouTubeOEmbed(videoId);
      const isDefinitivelyUnavailable =
        !oembed.ok && (oembed.status === 401 || oembed.status === 403 || oembed.status === 404);

      if (isDefinitivelyUnavailable) {
        markedUnavailable += 1;
        await supabase
          .from('educational_resources')
          .update({
            verification_status: 'unavailable',
            embeddable: false,
            last_checked_at: nowIso,
          })
          .eq('id', row.id);
      } else if (oembed.ok) {
        await supabase
          .from('educational_resources')
          .update({
            embeddable: true,
            last_checked_at: nowIso,
          })
          .eq('id', row.id);
      }
    }
  }

  res.status(200).json({
    checked: resources.length,
    markedUnavailable,
    note: `Checked ${resources.length} YouTube resource(s) via ${
      method === 'youtube_videos_api' ? 'YouTube Data API v3 batch' : 'YouTube oEmbed fallback'
    }; marked ${markedUnavailable} unavailable.`,
  });
}
