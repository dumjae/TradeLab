import type {
  CreateResourceInput,
  CreateSegmentInput,
  DiscoveryCandidate,
  EducationalResource,
  LessonResourceWithDetails,
  ResourceSegment,
  ResourceSourceType,
  UpdateResourceStatusInput,
  VerificationStatus,
} from '../types/visual-learning';
import { getLessonById, getLessonBySlug, STARTER_ORIGINAL_RESOURCES } from '../data/curriculum';
import {
  getActiveUserId,
  getAuthenticatedSupabaseUserId,
  getSupabaseAccessToken,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';
import {
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  isAllowedEducationalUrl,
} from '../lib/youtubeUtils';
import { LOCAL_ADMIN_RESOURCES_KEY } from './visualResourcesService';

export interface UrlMetadataResult {
  valid: boolean;
  sourceType: ResourceSourceType;
  normalizedUrl: string;
  externalVideoId: string | null;
  title: string;
  sourceName: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  embeddable: boolean;
  detectedChapters: Array<{
    startSeconds: number;
    endSeconds: number | null;
    segmentTitle: string;
  }>;
  attribution: string;
  note?: string;
  error?: string;
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

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `res-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function mapResourceRow(row: DbResourceRow): EducationalResource {
  return {
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
  };
}

function mapSegmentRow(row: DbSegmentRow): ResourceSegment {
  return {
    id: row.id,
    resourceId: row.resource_id,
    startSeconds: row.start_seconds,
    endSeconds: row.end_seconds,
    segmentTitle: row.segment_title,
    explanation: row.explanation,
    verificationMethod: row.verification_method,
    verifiedBy: row.verified_by,
    verifiedAt: row.verified_at,
  };
}

function readLocalAdminResources(): LessonResourceWithDetails[] {
  if (typeof window === 'undefined') {
    return [...STARTER_ORIGINAL_RESOURCES];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_ADMIN_RESOURCES_KEY);
    const stored: LessonResourceWithDetails[] = raw ? JSON.parse(raw) : [];
    const merged = new Map<string, LessonResourceWithDetails>();

    for (const starter of STARTER_ORIGINAL_RESOURCES) {
      merged.set(starter.resource.id, starter);
    }
    if (Array.isArray(stored)) {
      for (const item of stored) {
        merged.set(item.resource.id, item);
      }
    }
    return Array.from(merged.values());
  } catch {
    return [...STARTER_ORIGINAL_RESOURCES];
  }
}

function writeLocalAdminResources(items: LessonResourceWithDetails[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_ADMIN_RESOURCES_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

async function buildAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = await getSupabaseAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function deriveReadableTitleFromUrl(rawUrl: string, fallback: string): string {
  try {
    const parsed = new URL(rawUrl);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] ?? '';
    const cleaned = last.replace(/[-_]+/g, ' ').trim();
    if (cleaned.length >= 3) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1, 140);
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export async function listAdminResources(
  statusFilter: VerificationStatus | 'all' = 'all',
): Promise<LessonResourceWithDetails[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      let resQuery = supabase
        .from('educational_resources')
        .select('*')
        .order('updated_at', { ascending: false });

      if (statusFilter !== 'all') {
        resQuery = resQuery.eq('verification_status', statusFilter);
      }

      const { data: resData, error: resError } = await resQuery;
      if (!resError && Array.isArray(resData) && resData.length > 0) {
        const resources = (resData as DbResourceRow[]).map(mapResourceRow);
        const ids = resources.map((r) => r.id);

        const [{ data: mappingsData }, { data: segmentsData }] = await Promise.all([
          supabase.from('lesson_resources').select('*').in('resource_id', ids),
          supabase
            .from('resource_segments')
            .select('*')
            .in('resource_id', ids)
            .order('start_seconds', { ascending: true }),
        ]);

        const mappingByResource = new Map<string, DbMappingRow>();
        for (const row of (mappingsData ?? []) as DbMappingRow[]) {
          if (!mappingByResource.has(row.resource_id)) {
            mappingByResource.set(row.resource_id, row);
          }
        }

        const segmentsByResource = new Map<string, ResourceSegment[]>();
        for (const row of (segmentsData ?? []) as DbSegmentRow[]) {
          const mapped = mapSegmentRow(row);
          const list = segmentsByResource.get(mapped.resourceId) ?? [];
          list.push(mapped);
          segmentsByResource.set(mapped.resourceId, list);
        }

        return resources.map((resource) => {
          const mapping = mappingByResource.get(resource.id);
          const lesson = mapping ? getLessonById(mapping.lesson_id) : undefined;
          return {
            mapping: mapping
              ? {
                  id: mapping.id,
                  lessonId: mapping.lesson_id,
                  lessonSlug: lesson?.slug ?? '',
                  resourceId: mapping.resource_id,
                  relevanceScore: mapping.relevance_score,
                  displayOrder: mapping.display_order,
                  beforeWatchContext: mapping.before_watch_context,
                  afterWatchTakeaways: mapping.after_watch_takeaways ?? [],
                  editorialNotes: mapping.editorial_notes,
                }
              : {
                  id: `unmapped-${resource.id}`,
                  lessonId: '',
                  lessonSlug: '',
                  resourceId: resource.id,
                  relevanceScore: resource.qualityScore,
                  displayOrder: 99,
                  beforeWatchContext: '',
                  afterWatchTakeaways: [],
                  editorialNotes: '',
                },
            resource,
            segments: segmentsByResource.get(resource.id) ?? [],
          };
        });
      }
    } catch {
      // Fall through to local preview mode
    }
  }

  const allLocal = readLocalAdminResources();
  const filtered =
    statusFilter === 'all'
      ? allLocal
      : allLocal.filter((item) => item.resource.verificationStatus === statusFilter);

  return filtered.sort((a, b) => b.resource.updatedAt.localeCompare(a.resource.updatedAt));
}

export async function fetchUrlMetadata(url: string): Promise<UrlMetadataResult> {
  const urlCheck = isAllowedEducationalUrl(url);
  if (!urlCheck.valid || !urlCheck.sourceType || !urlCheck.normalizedUrl) {
    return {
      valid: false,
      sourceType: 'other_educator',
      normalizedUrl: url.trim(),
      externalVideoId: null,
      title: '',
      sourceName: '',
      thumbnailUrl: null,
      durationSeconds: null,
      embeddable: false,
      detectedChapters: [],
      attribution: '',
      error: urlCheck.reason ?? 'Please enter a valid HTTPS YouTube or TradingView URL.',
    };
  }

  // 1. Try server-side verified metadata endpoint first
  try {
    const headers = await buildAuthHeaders();
    const response = await fetch('/api/resources/metadata', {
      method: 'POST',
      headers,
      body: JSON.stringify({ url: urlCheck.normalizedUrl, includeChapters: true }),
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const payload = (await response.json()) as UrlMetadataResult;
      if (payload && typeof payload.valid === 'boolean') {
        return payload;
      }
    }
  } catch {
    // Gracefully fall back to Local Preview Mode metadata lookup below
  }

  // 2. Local Preview Mode client-safe fallback (never fabricates timestamps!)
  if (urlCheck.sourceType === 'youtube' && urlCheck.videoId) {
    const videoId = urlCheck.videoId;
    const watchUrl = buildYouTubeWatchUrl(videoId);
    const defaultThumb = buildYouTubeThumbnailUrl(videoId, 'hq');

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;
      const oembedRes = await fetch(oembedUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (oembedRes.ok) {
        const data = (await oembedRes.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };
        const sourceName = data.author_name?.trim() || 'YouTube Educator';
        return {
          valid: true,
          sourceType: 'youtube',
          normalizedUrl: watchUrl,
          externalVideoId: videoId,
          title: data.title?.trim() || `YouTube Video (${videoId})`,
          sourceName,
          thumbnailUrl: data.thumbnail_url?.trim() || defaultThumb,
          durationSeconds: null,
          embeddable: true,
          detectedChapters: [],
          attribution: `Video by ${sourceName} on YouTube. Embedded via official YouTube privacy-enhanced player.`,
          note: 'Local Preview Mode: metadata verified via public YouTube oEmbed. Add verified timestamps manually after watching.',
        };
      }
    } catch {
      // Offline or CORS-blocked oEmbed — fall through to clean manual template
    }

    return {
      valid: true,
      sourceType: 'youtube',
      normalizedUrl: watchUrl,
      externalVideoId: videoId,
      title: `YouTube Tutorial (${videoId})`,
      sourceName: 'YouTube Educator',
      thumbnailUrl: defaultThumb,
      durationSeconds: null,
      embeddable: true,
      detectedChapters: [],
      attribution:
        'YouTube educational video. Confirm creator name and attribution before publishing.',
      note: 'Local Preview Mode: enter verified title, creator attribution, and manual timestamps after inspecting the video.',
    };
  }

  if (urlCheck.sourceType === 'tradingview') {
    return {
      valid: true,
      sourceType: 'tradingview',
      normalizedUrl: urlCheck.normalizedUrl,
      externalVideoId: null,
      title: deriveReadableTitleFromUrl(urlCheck.normalizedUrl, 'TradingView Chart Idea'),
      sourceName: 'TradingView',
      thumbnailUrl: null,
      durationSeconds: null,
      embeddable: false,
      detectedChapters: [],
      attribution:
        'External TradingView chart idea. Opens externally on TradingView with explicit author attribution.',
      note: 'TradingView content is never scraped. Complete the verified title, creator attribution, and lesson takeaways manually.',
    };
  }

  const host = new URL(urlCheck.normalizedUrl).hostname;
  return {
    valid: true,
    sourceType: 'other_educator',
    normalizedUrl: urlCheck.normalizedUrl,
    externalVideoId: null,
    title: deriveReadableTitleFromUrl(urlCheck.normalizedUrl, `Educational Resource (${host})`),
    sourceName: host,
    thumbnailUrl: null,
    durationSeconds: null,
    embeddable: false,
    detectedChapters: [],
    attribution: `External educational resource hosted on ${host}.`,
    note: 'Local Preview Mode: verify educational license, attribution, and takeaways manually.',
  };
}

export async function runLessonDiscovery(
  lessonSlug: string,
  customQuery?: string,
): Promise<{
  cached: boolean;
  source: 'youtube_api' | 'fallback_unavailable';
  candidates: DiscoveryCandidate[];
  message?: string;
}> {
  const lesson = getLessonBySlug(lessonSlug);
  const queryText =
    customQuery?.trim() ||
    (lesson
      ? `${lesson.title} trading explained chart example`
      : `${lessonSlug.replace(/-/g, ' ')} trading tutorial`);

  try {
    const headers = await buildAuthHeaders();
    const response = await fetch('/api/resources/discover', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        lessonId: lesson?.id ?? lessonSlug,
        query: queryText,
        conceptKey: lesson?.conceptKey,
        maxResults: 5,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        cached?: boolean;
        source?: 'youtube_api' | 'fallback_unavailable';
        candidates?: DiscoveryCandidate[];
        message?: string;
      };
      return {
        cached: Boolean(data.cached),
        source: data.source === 'youtube_api' ? 'youtube_api' : 'fallback_unavailable',
        candidates: Array.isArray(data.candidates) ? data.candidates : [],
        message: data.message,
      };
    }
  } catch {
    // Gracefully fall back without inventing fake YouTube videos
  }

  return {
    cached: false,
    source: 'fallback_unavailable',
    candidates: [],
    message:
      'YouTube Data API discovery requires server configuration (YOUTUBE_API_KEY + Admin Supabase auth). Use Manual URL Curation below to paste verified YouTube or TradingView links directly.',
  };
}

export async function createAdminResource(
  input: CreateResourceInput,
  initialSegments: Array<Omit<CreateSegmentInput, 'resourceId'>> = [],
): Promise<LessonResourceWithDetails> {
  const resolvedLesson = getLessonById(input.lessonId) ?? getLessonBySlug(input.lessonSlug);
  const lessonId = resolvedLesson?.id ?? input.lessonId;
  const lessonSlug = resolvedLesson?.slug ?? input.lessonSlug;
  const nowIso = new Date().toISOString();
  const status: VerificationStatus = input.verificationStatus ?? 'pending_review';
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: resRow, error: resError } = await supabase
        .from('educational_resources')
        .insert({
          title: input.title.trim(),
          description: input.description.trim(),
          source_type: input.sourceType,
          source_name: input.sourceName.trim(),
          source_url: input.sourceUrl.trim(),
          external_video_id: input.externalVideoId ?? null,
          thumbnail_url: input.thumbnailUrl ?? null,
          duration_seconds: input.durationSeconds ?? null,
          content_type: input.contentType,
          license_status: input.licenseStatus ?? 'standard_embed_only',
          attribution: input.attribution.trim(),
          non_endorsement_notice: input.nonEndorsementNotice ?? input.sourceType !== 'tradelab_original',
          verification_status: status,
          quality_score: input.qualityScore ?? 85,
          embeddable: input.embeddable ?? input.sourceType === 'youtube',
          last_checked_at: nowIso,
          created_by: authUserId,
        })
        .select('*')
        .single<DbResourceRow>();

      if (!resError && resRow) {
        const { data: mappingRow } = await supabase
          .from('lesson_resources')
          .insert({
            lesson_id: lessonId,
            resource_id: resRow.id,
            relevance_score: input.qualityScore ?? 85,
            display_order: 5,
            before_watch_context: input.beforeWatchContext?.trim() ?? '',
            after_watch_takeaways: input.afterWatchTakeaways ?? [],
            editorial_notes: input.editorialNotes?.trim() ?? '',
          })
          .select('*')
          .single<DbMappingRow>();

        const insertedSegments: ResourceSegment[] = [];
        if (initialSegments.length > 0) {
          const { data: segRows } = await supabase
            .from('resource_segments')
            .insert(
              initialSegments.map((seg) => ({
                resource_id: resRow.id,
                start_seconds: Math.max(0, Math.floor(seg.startSeconds)),
                end_seconds:
                  seg.endSeconds !== null && seg.endSeconds > seg.startSeconds
                    ? Math.floor(seg.endSeconds)
                    : null,
                segment_title: seg.segmentTitle.trim(),
                explanation: seg.explanation.trim(),
                verification_method: seg.verificationMethod,
                verified_by: authUserId,
              })),
            )
            .select('*');

          for (const row of (segRows ?? []) as DbSegmentRow[]) {
            insertedSegments.push(mapSegmentRow(row));
          }
        }

        return {
          mapping: {
            id: mappingRow?.id ?? generateId(),
            lessonId,
            lessonSlug,
            resourceId: resRow.id,
            relevanceScore: mappingRow?.relevance_score ?? input.qualityScore ?? 85,
            displayOrder: mappingRow?.display_order ?? 5,
            beforeWatchContext: mappingRow?.before_watch_context ?? input.beforeWatchContext ?? '',
            afterWatchTakeaways:
              mappingRow?.after_watch_takeaways ?? input.afterWatchTakeaways ?? [],
            editorialNotes: mappingRow?.editorial_notes ?? input.editorialNotes ?? '',
          },
          resource: mapResourceRow(resRow),
          segments: insertedSegments.sort((a, b) => a.startSeconds - b.startSeconds),
        };
      }
    } catch {
      // Fall through to local preview persistence
    }
  }

  const userId = await getActiveUserId();
  const resourceId = generateId();
  const createdResource: EducationalResource = {
    id: resourceId,
    title: input.title.trim(),
    description: input.description.trim(),
    sourceType: input.sourceType,
    sourceName: input.sourceName.trim(),
    sourceUrl: input.sourceUrl.trim(),
    externalVideoId: input.externalVideoId ?? null,
    thumbnailUrl: input.thumbnailUrl ?? null,
    durationSeconds: input.durationSeconds ?? null,
    contentType: input.contentType,
    licenseStatus: input.licenseStatus ?? 'standard_embed_only',
    attribution: input.attribution.trim(),
    nonEndorsementNotice: input.nonEndorsementNotice ?? input.sourceType !== 'tradelab_original',
    verificationStatus: status,
    qualityScore: input.qualityScore ?? 85,
    embeddable: input.embeddable ?? input.sourceType === 'youtube',
    lastCheckedAt: nowIso,
    createdBy: userId,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const createdSegments: ResourceSegment[] = initialSegments
    .map((seg) => ({
      id: generateId(),
      resourceId,
      startSeconds: Math.max(0, Math.floor(seg.startSeconds)),
      endSeconds:
        seg.endSeconds !== null && seg.endSeconds > seg.startSeconds
          ? Math.floor(seg.endSeconds)
          : null,
      segmentTitle: seg.segmentTitle.trim(),
      explanation: seg.explanation.trim(),
      verificationMethod: seg.verificationMethod,
      verifiedBy: userId,
      verifiedAt: nowIso,
    }))
    .sort((a, b) => a.startSeconds - b.startSeconds);

  const createdBundle: LessonResourceWithDetails = {
    mapping: {
      id: generateId(),
      lessonId,
      lessonSlug,
      resourceId,
      relevanceScore: input.qualityScore ?? 85,
      displayOrder: 5,
      beforeWatchContext: input.beforeWatchContext?.trim() ?? '',
      afterWatchTakeaways: input.afterWatchTakeaways ?? [],
      editorialNotes: input.editorialNotes?.trim() ?? '',
    },
    resource: createdResource,
    segments: createdSegments,
  };

  const allLocal = readLocalAdminResources();
  writeLocalAdminResources([createdBundle, ...allLocal]);
  return createdBundle;
}

export async function addVerifiedSegment(input: CreateSegmentInput): Promise<ResourceSegment> {
  const safeStart = Math.max(0, Math.floor(input.startSeconds));
  const safeEnd =
    input.endSeconds !== null && input.endSeconds > safeStart
      ? Math.floor(input.endSeconds)
      : null;
  const nowIso = new Date().toISOString();
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('resource_segments')
        .insert({
          resource_id: input.resourceId,
          start_seconds: safeStart,
          end_seconds: safeEnd,
          segment_title: input.segmentTitle.trim(),
          explanation: input.explanation.trim(),
          verification_method: input.verificationMethod,
          verified_by: authUserId,
          verified_at: nowIso,
        })
        .select('*')
        .single<DbSegmentRow>();

      if (!error && data) {
        return mapSegmentRow(data);
      }
    } catch {
      // Fall through to local persistence
    }
  }

  const userId = await getActiveUserId();
  const segment: ResourceSegment = {
    id: generateId(),
    resourceId: input.resourceId,
    startSeconds: safeStart,
    endSeconds: safeEnd,
    segmentTitle: input.segmentTitle.trim(),
    explanation: input.explanation.trim(),
    verificationMethod: input.verificationMethod,
    verifiedBy: userId,
    verifiedAt: nowIso,
  };

  const allLocal = readLocalAdminResources().map((item) => {
    if (item.resource.id !== input.resourceId) {
      return item;
    }
    return {
      ...item,
      resource: { ...item.resource, updatedAt: nowIso },
      segments: [...item.segments, segment].sort((a, b) => a.startSeconds - b.startSeconds),
    };
  });
  writeLocalAdminResources(allLocal);
  return segment;
}

export async function deleteSegment(segmentId: string): Promise<void> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase.from('resource_segments').delete().eq('id', segmentId);
      if (!error) {
        return;
      }
    } catch {
      // Fall through to local removal
    }
  }

  const allLocal = readLocalAdminResources().map((item) => ({
    ...item,
    segments: item.segments.filter((segment) => segment.id !== segmentId),
  }));
  writeLocalAdminResources(allLocal);
}

export async function updateResourceStatus(
  input: UpdateResourceStatusInput,
): Promise<EducationalResource | null> {
  const nowIso = new Date().toISOString();
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const patch: Record<string, unknown> = {
        verification_status: input.verificationStatus,
        last_checked_at: nowIso,
      };
      if (typeof input.qualityScore === 'number') {
        patch.quality_score = Math.max(0, Math.min(100, Math.round(input.qualityScore)));
      }
      if (typeof input.embeddable === 'boolean') {
        patch.embeddable = input.embeddable;
      }

      const { data, error } = await supabase
        .from('educational_resources')
        .update(patch)
        .eq('id', input.resourceId)
        .select('*')
        .maybeSingle<DbResourceRow>();

      if (!error && data) {
        return mapResourceRow(data);
      }
    } catch {
      // Fall through to local persistence
    }
  }

  let updatedResource: EducationalResource | null = null;
  const allLocal = readLocalAdminResources().map((item) => {
    if (item.resource.id !== input.resourceId) {
      return item;
    }
    updatedResource = {
      ...item.resource,
      verificationStatus: input.verificationStatus,
      qualityScore:
        typeof input.qualityScore === 'number'
          ? Math.max(0, Math.min(100, Math.round(input.qualityScore)))
          : item.resource.qualityScore,
      embeddable:
        typeof input.embeddable === 'boolean' ? input.embeddable : item.resource.embeddable,
      lastCheckedAt: nowIso,
      updatedAt: nowIso,
    };
    return {
      ...item,
      resource: updatedResource,
    };
  });

  if (updatedResource) {
    writeLocalAdminResources(allLocal);
  }
  return updatedResource;
}

export async function runResourcesHealthCheck(): Promise<{
  checked: number;
  markedUnavailable: number;
  note: string;
}> {
  try {
    const headers = await buildAuthHeaders();
    const response = await fetch('/api/resources/check-health', {
      method: 'POST',
      headers,
      body: JSON.stringify({ limit: 25 }),
      signal: AbortSignal.timeout(15_000),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        checked?: number;
        markedUnavailable?: number;
        note?: string;
      };
      return {
        checked: data.checked ?? 0,
        markedUnavailable: data.markedUnavailable ?? 0,
        note: data.note ?? 'Server resource health check completed.',
      };
    }
  } catch {
    // Fall back to local YouTube oEmbed check
  }

  const allLocal = readLocalAdminResources();
  const youtubeItems = allLocal.filter(
    (item) =>
      item.resource.sourceType === 'youtube' &&
      Boolean(item.resource.externalVideoId) &&
      item.resource.verificationStatus !== 'archived',
  );

  if (youtubeItems.length === 0) {
    return {
      checked: 0,
      markedUnavailable: 0,
      note: 'Local Preview Mode: no external YouTube resources queued for health check.',
    };
  }

  let markedUnavailable = 0;
  const nowIso = new Date().toISOString();
  const unavailableIds = new Set<string>();

  for (const item of youtubeItems) {
    const videoId = item.resource.externalVideoId;
    if (!videoId) {
      continue;
    }

    try {
      const watchUrl = buildYouTubeWatchUrl(videoId);
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (res.status === 401 || res.status === 403 || res.status === 404) {
        markedUnavailable += 1;
        unavailableIds.add(item.resource.id);
      }
    } catch {
      // Network error is inconclusive — do not falsely mark unavailable
    }
  }

  const updated = allLocal.map((item) => {
    if (unavailableIds.has(item.resource.id)) {
      return {
        ...item,
        resource: {
          ...item.resource,
          verificationStatus: 'unavailable' as const,
          embeddable: false,
          lastCheckedAt: nowIso,
          updatedAt: nowIso,
        },
      };
    }
    if (item.resource.sourceType === 'youtube') {
      return {
        ...item,
        resource: {
          ...item.resource,
          lastCheckedAt: nowIso,
        },
      };
    }
    return item;
  });

  writeLocalAdminResources(updated);

  return {
    checked: youtubeItems.length,
    markedUnavailable,
    note: `Local Preview Mode: verified ${youtubeItems.length} YouTube resource(s) via oEmbed; marked ${markedUnavailable} unavailable.`,
  };
}
