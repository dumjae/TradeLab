import type {
  EducationalResource,
  LessonResourceWithDetails,
  ResourceSegment,
} from '../types/visual-learning';
import { getLessonById, getLessonBySlug, STARTER_ORIGINAL_RESOURCES } from '../data/curriculum';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const LOCAL_ADMIN_RESOURCES_KEY = 'tradelab_admin_resources_v1';

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

function readLocalCuratedResources(): LessonResourceWithDetails[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_ADMIN_RESOURCES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LessonResourceWithDetails[]) : [];
  } catch {
    return [];
  }
}

function mergeWithStarterOriginals(
  primaryItems: LessonResourceWithDetails[],
): LessonResourceWithDetails[] {
  const byResourceId = new Map<string, LessonResourceWithDetails>();

  for (const starter of STARTER_ORIGINAL_RESOURCES) {
    byResourceId.set(starter.resource.id, starter);
  }

  for (const item of primaryItems) {
    byResourceId.set(item.resource.id, item);
  }

  return Array.from(byResourceId.values())
    .filter((item) => item.resource.verificationStatus === 'published')
    .sort((a, b) => a.mapping.displayOrder - b.mapping.displayOrder);
}

async function fetchPublishedFromSupabase(
  lessonId?: string,
): Promise<LessonResourceWithDetails[] | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    let mappingQuery = supabase
      .from('lesson_resources')
      .select(
        'id, lesson_id, resource_id, relevance_score, display_order, before_watch_context, after_watch_takeaways, editorial_notes',
      )
      .order('display_order', { ascending: true });

    if (lessonId) {
      mappingQuery = mappingQuery.eq('lesson_id', lessonId);
    }

    const { data: mappingsData, error: mapError } = await mappingQuery;
    if (mapError || !mappingsData || mappingsData.length === 0) {
      return [];
    }

    const mappings = mappingsData as DbMappingRow[];
    const resourceIds = Array.from(new Set(mappings.map((row) => row.resource_id)));

    const { data: resourcesData, error: resError } = await supabase
      .from('educational_resources')
      .select('*')
      .in('id', resourceIds)
      .eq('verification_status', 'published');

    if (resError || !resourcesData || resourcesData.length === 0) {
      return [];
    }

    const resources = (resourcesData as DbResourceRow[]).map(mapResourceRow);
    const publishedIds = resources.map((res) => res.id);

    const { data: segmentsData } = await supabase
      .from('resource_segments')
      .select('*')
      .in('resource_id', publishedIds)
      .order('start_seconds', { ascending: true });

    const segmentsByResource = new Map<string, ResourceSegment[]>();
    for (const segRow of (segmentsData ?? []) as DbSegmentRow[]) {
      const mapped = mapSegmentRow(segRow);
      const list = segmentsByResource.get(mapped.resourceId) ?? [];
      list.push(mapped);
      segmentsByResource.set(mapped.resourceId, list);
    }

    const resourceById = new Map<string, EducationalResource>(
      resources.map((resource) => [resource.id, resource]),
    );

    const combined: LessonResourceWithDetails[] = [];
    for (const mapping of mappings) {
      const resource = resourceById.get(mapping.resource_id);
      if (!resource) {
        continue;
      }

      const lesson = getLessonById(mapping.lesson_id);
      combined.push({
        mapping: {
          id: mapping.id,
          lessonId: mapping.lesson_id,
          lessonSlug: lesson?.slug ?? '',
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

    return combined;
  } catch {
    return null;
  }
}

export async function getPublishedLessonResources(
  lessonSlug: string,
): Promise<LessonResourceWithDetails[]> {
  const lesson = getLessonBySlug(lessonSlug);
  const remote = lesson ? await fetchPublishedFromSupabase(lesson.id) : null;

  if (remote && remote.length > 0) {
    return mergeWithStarterOriginals(remote).filter(
      (item) => item.mapping.lessonSlug === lessonSlug,
    );
  }

  const localItems = readLocalCuratedResources();
  return mergeWithStarterOriginals(localItems).filter(
    (item) => item.mapping.lessonSlug === lessonSlug,
  );
}

export async function getAllPublishedResources(): Promise<LessonResourceWithDetails[]> {
  const remote = await fetchPublishedFromSupabase();
  if (remote && remote.length > 0) {
    return mergeWithStarterOriginals(remote);
  }

  const localItems = readLocalCuratedResources();
  return mergeWithStarterOriginals(localItems);
}

export async function getResourceById(
  resourceId: string,
): Promise<{ resource: EducationalResource; segments: ResourceSegment[] } | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: resData, error: resError } = await supabase
        .from('educational_resources')
        .select('*')
        .eq('id', resourceId)
        .maybeSingle<DbResourceRow>();

      if (!resError && resData) {
        const { data: segData } = await supabase
          .from('resource_segments')
          .select('*')
          .eq('resource_id', resourceId)
          .order('start_seconds', { ascending: true });

        return {
          resource: mapResourceRow(resData),
          segments: ((segData ?? []) as DbSegmentRow[]).map(mapSegmentRow),
        };
      }
    } catch {
      // Fall through to local preview store
    }
  }

  const localMatch = readLocalCuratedResources().find((item) => item.resource.id === resourceId);
  if (localMatch) {
    return {
      resource: localMatch.resource,
      segments: localMatch.segments,
    };
  }

  const starterMatch = STARTER_ORIGINAL_RESOURCES.find((item) => item.resource.id === resourceId);
  if (starterMatch) {
    return {
      resource: starterMatch.resource,
      segments: starterMatch.segments,
    };
  }

  return null;
}
