import type {
  EducationalResource,
  LessonResourceWithDetails,
  ResourceSegment,
} from '../../src/types/visual-learning';
import {
  getLessonByConceptKey,
  getLessonBySlug,
  STARTER_ORIGINAL_RESOURCES,
} from '../../src/data/curriculum';
import { createServerSupabaseClient, verifyAuthenticatedUser } from '../_lib/auth';
import { generateGroundedExplanation } from '../_lib/mentorGrounding';
import { ExplainDifferentlyRequestSchema } from '../_lib/urlSecurity';
import { type ApiRequest, type ApiResponse, parseJsonBody } from '../_lib/youtube';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitBuckets = new Map<string, RateLimitBucket>();

function extractClientIp(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

function checkRateLimit(clientKey: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = rateLimitBuckets.get(clientKey);

  if (!existing || now >= existing.resetAt) {
    rateLimitBuckets.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

interface DbResourceRow {
  id: string;
  title: string;
  description: string;
  source_type: EducationalResource['sourceType'];
  source_name: string;
  source_url: string;
  external_video_id: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  content_type: EducationalResource['contentType'];
  license_status: string;
  attribution: string;
  non_endorsement_notice: boolean;
  verification_status: EducationalResource['verificationStatus'];
  quality_score: number;
  embeddable: boolean;
  last_checked_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface DbSegmentRow {
  id: string;
  resource_id: string;
  start_seconds: number;
  end_seconds: number | null;
  segment_title: string;
  explanation: string;
  verification_method: ResourceSegment['verificationMethod'];
  verified_by: string | null;
  verified_at: string;
}

interface DbMappingRow {
  id: string;
  lesson_id: string;
  resource_id: string;
  relevance_score: number;
  display_order: number;
  before_watch_context: string;
  after_watch_takeaways: string[];
  editorial_notes: string;
}

async function loadPublishedLessonResources(
  lessonId: string,
  lessonSlug: string,
): Promise<LessonResourceWithDetails[]> {
  const starterForLesson = STARTER_ORIGINAL_RESOURCES.filter(
    (item) =>
      item.mapping.lessonSlug === lessonSlug && item.resource.verificationStatus === 'published',
  );

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return starterForLesson;
  }

  try {
    const { data: mappingsData, error: mapError } = await supabase
      .from('lesson_resources')
      .select(
        'id, lesson_id, resource_id, relevance_score, display_order, before_watch_context, after_watch_takeaways, editorial_notes',
      )
      .eq('lesson_id', lessonId)
      .order('display_order', { ascending: true });

    if (mapError || !mappingsData || mappingsData.length === 0) {
      return starterForLesson;
    }

    const mappings = mappingsData as DbMappingRow[];
    const resourceIds = mappings.map((row) => row.resource_id);

    const { data: resourcesData, error: resError } = await supabase
      .from('educational_resources')
      .select('*')
      .in('id', resourceIds)
      .eq('verification_status', 'published');

    if (resError || !resourcesData || resourcesData.length === 0) {
      return starterForLesson;
    }

    const publishedResources = resourcesData as DbResourceRow[];
    const publishedIds = publishedResources.map((row) => row.id);

    const { data: segmentsData } = await supabase
      .from('resource_segments')
      .select('*')
      .in('resource_id', publishedIds)
      .order('start_seconds', { ascending: true });

    const segmentsByResource = new Map<string, ResourceSegment[]>();
    for (const seg of (segmentsData ?? []) as DbSegmentRow[]) {
      const list = segmentsByResource.get(seg.resource_id) ?? [];
      list.push({
        id: seg.id,
        resourceId: seg.resource_id,
        startSeconds: seg.start_seconds,
        endSeconds: seg.end_seconds,
        segmentTitle: seg.segment_title,
        explanation: seg.explanation,
        verificationMethod: seg.verification_method,
        verifiedBy: seg.verified_by,
        verifiedAt: seg.verified_at,
      });
      segmentsByResource.set(seg.resource_id, list);
    }

    const resourceById = new Map<string, EducationalResource>(
      publishedResources.map((row) => [
        row.id,
        {
          id: row.id,
          title: row.title,
          description: row.description,
          sourceType: row.source_type,
          sourceName: row.source_name,
          sourceUrl: row.source_url,
          externalVideoId: row.external_video_id,
          thumbnailUrl: row.thumbnail_url,
          durationSeconds: row.duration_seconds,
          contentType: row.content_type,
          licenseStatus: row.license_status,
          attribution: row.attribution,
          nonEndorsementNotice: row.non_endorsement_notice,
          verificationStatus: row.verification_status,
          qualityScore: row.quality_score,
          embeddable: row.embeddable,
          lastCheckedAt: row.last_checked_at,
          createdBy: row.created_by,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
      ]),
    );

    const hydrated: LessonResourceWithDetails[] = [];
    const seenIds = new Set<string>();

    for (const mapping of mappings) {
      const resource = resourceById.get(mapping.resource_id);
      if (!resource) {
        continue;
      }
      seenIds.add(resource.id);
      hydrated.push({
        mapping: {
          id: mapping.id,
          lessonId: mapping.lesson_id,
          lessonSlug,
          resourceId: mapping.resource_id,
          relevanceScore: mapping.relevance_score,
          displayOrder: mapping.display_order,
          beforeWatchContext: mapping.before_watch_context,
          afterWatchTakeaways: mapping.after_watch_takeaways ?? [],
          editorialNotes: mapping.editorial_notes,
        },
        resource,
        segments: segmentsByResource.get(resource.id) ?? [],
      });
    }

    for (const starter of starterForLesson) {
      if (!seenIds.has(starter.resource.id)) {
        hydrated.push(starter);
      }
    }

    return hydrated;
  } catch {
    return starterForLesson;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const rateLimit = checkRateLimit(extractClientIp(req));
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    res.status(429).json({
      error: 'Too many AI Mentor requests. Please pause briefly before asking again.',
    });
    return;
  }

  const auth = await verifyAuthenticatedUser(req);
  if (!auth.authorized) {
    res
      .status(auth.statusCode)
      .json({ error: auth.error ?? 'Authentication required to access live AI Mentor.' });
    return;
  }

  const rawBody = parseJsonBody(req);
  if (rawBody === null) {
    res.status(400).json({ error: 'Invalid JSON request body.' });
    return;
  }

  const parsed = ExplainDifferentlyRequestSchema.safeParse(rawBody);
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

  const lesson =
    getLessonBySlug(parsed.data.lessonSlug) ?? getLessonByConceptKey(parsed.data.conceptKey);

  if (!lesson) {
    res.status(404).json({ error: 'Requested curriculum lesson was not found.' });
    return;
  }

  const publishedResources = await loadPublishedLessonResources(lesson.id, lesson.slug);
  const response = await generateGroundedExplanation(parsed.data, lesson, publishedResources);
  res.status(200).json(response);
}
