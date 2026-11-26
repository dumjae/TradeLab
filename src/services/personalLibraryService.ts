import type { CurriculumLevel } from '../types/academy';
import type {
  CompletionStatus,
  UserLearningHistory,
  UserSavedResource,
} from '../types/visual-learning';
import { getLessonById, getLessonBySlug } from '../data/curriculum';
import {
  getActiveUserId,
  getAuthenticatedSupabaseUserId,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

const SAVED_RESOURCES_KEY = 'tradelab_saved_resources_v1';
const LEARNING_HISTORY_KEY = 'tradelab_learning_history_v1';

interface DbSavedResourceRow {
  id: string;
  user_id: string;
  resource_id: string;
  lesson_id: string | null;
  saved_timestamp_seconds: number | null;
  saved_segment_id: string | null;
  curriculum_level: CurriculumLevel;
  personal_notes: string;
  created_at: string;
  updated_at: string;
}

interface DbLearningHistoryRow {
  id: string;
  user_id: string;
  resource_id: string;
  lesson_id: string | null;
  last_position_seconds: number;
  completion_status: CompletionStatus;
  last_viewed_at: string;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readLocalList<T>(storageKey: string): T[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocalList<T>(storageKey: string, items: T[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Ignore quota errors in restricted browser storage modes
  }
}

function mapSavedRow(row: DbSavedResourceRow): UserSavedResource {
  const lesson = row.lesson_id ? getLessonById(row.lesson_id) : undefined;
  return {
    id: row.id,
    userId: row.user_id,
    resourceId: row.resource_id,
    lessonId: row.lesson_id,
    lessonSlug: lesson?.slug,
    savedTimestampSeconds: row.saved_timestamp_seconds,
    savedSegmentId: row.saved_segment_id,
    curriculumLevel: row.curriculum_level,
    personalNotes: row.personal_notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapHistoryRow(row: DbLearningHistoryRow): UserLearningHistory {
  const lesson = row.lesson_id ? getLessonById(row.lesson_id) : undefined;
  return {
    id: row.id,
    userId: row.user_id,
    resourceId: row.resource_id,
    lessonId: row.lesson_id,
    lessonSlug: lesson?.slug,
    lastPositionSeconds: row.last_position_seconds,
    completionStatus: row.completion_status,
    lastViewedAt: row.last_viewed_at,
  };
}

export async function listSavedResources(): Promise<UserSavedResource[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_saved_resources')
        .select('*')
        .eq('user_id', authUserId)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return (data as DbSavedResourceRow[]).map(mapSavedRow);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return readLocalList<UserSavedResource>(SAVED_RESOURCES_KEY).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function saveResourceBookmark(input: {
  resourceId: string;
  lessonId?: string | null;
  lessonSlug?: string;
  savedTimestampSeconds?: number | null;
  savedSegmentId?: string | null;
  curriculumLevel: CurriculumLevel;
  personalNotes?: string;
}): Promise<UserSavedResource> {
  const resolvedLesson = input.lessonId
    ? getLessonById(input.lessonId)
    : input.lessonSlug
      ? getLessonBySlug(input.lessonSlug)
      : undefined;

  const lessonId = input.lessonId ?? resolvedLesson?.id ?? null;
  const lessonSlug = input.lessonSlug ?? resolvedLesson?.slug;
  const safeTimestamp =
    typeof input.savedTimestampSeconds === 'number' &&
    Number.isFinite(input.savedTimestampSeconds) &&
    input.savedTimestampSeconds >= 0
      ? Math.floor(input.savedTimestampSeconds)
      : null;

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_saved_resources')
        .insert({
          user_id: authUserId,
          resource_id: input.resourceId,
          lesson_id: lessonId,
          saved_timestamp_seconds: safeTimestamp,
          saved_segment_id: input.savedSegmentId ?? null,
          curriculum_level: input.curriculumLevel,
          personal_notes: (input.personalNotes ?? '').trim(),
        })
        .select('*')
        .single<DbSavedResourceRow>();

      if (!error && data) {
        return mapSavedRow(data);
      }
    } catch {
      // Fall through to local preview persistence
    }
  }

  const userId = await getActiveUserId();
  const nowIso = new Date().toISOString();
  const existingList = readLocalList<UserSavedResource>(SAVED_RESOURCES_KEY);

  const duplicateIndex = existingList.findIndex(
    (item) =>
      item.resourceId === input.resourceId &&
      item.savedSegmentId === (input.savedSegmentId ?? null) &&
      item.savedTimestampSeconds === safeTimestamp,
  );

  if (duplicateIndex >= 0) {
    const updated: UserSavedResource = {
      ...existingList[duplicateIndex],
      lessonId,
      lessonSlug,
      curriculumLevel: input.curriculumLevel,
      personalNotes:
        input.personalNotes !== undefined
          ? input.personalNotes.trim()
          : existingList[duplicateIndex].personalNotes,
      updatedAt: nowIso,
    };
    existingList[duplicateIndex] = updated;
    writeLocalList(SAVED_RESOURCES_KEY, existingList);
    return updated;
  }

  const record: UserSavedResource = {
    id: generateId(),
    userId,
    resourceId: input.resourceId,
    lessonId,
    lessonSlug,
    savedTimestampSeconds: safeTimestamp,
    savedSegmentId: input.savedSegmentId ?? null,
    curriculumLevel: input.curriculumLevel,
    personalNotes: (input.personalNotes ?? '').trim(),
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  writeLocalList(SAVED_RESOURCES_KEY, [record, ...existingList]);
  return record;
}

export async function updateSavedResourceNotes(
  savedId: string,
  personalNotes: string,
): Promise<UserSavedResource | null> {
  const cleanedNotes = personalNotes.trim();
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_saved_resources')
        .update({ personal_notes: cleanedNotes })
        .eq('id', savedId)
        .eq('user_id', authUserId)
        .select('*')
        .maybeSingle<DbSavedResourceRow>();

      if (!error && data) {
        return mapSavedRow(data);
      }
    } catch {
      // Fallback to local
    }
  }

  const items = readLocalList<UserSavedResource>(SAVED_RESOURCES_KEY);
  const index = items.findIndex((item) => item.id === savedId);
  if (index === -1) {
    return null;
  }

  const updated: UserSavedResource = {
    ...items[index],
    personalNotes: cleanedNotes,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updated;
  writeLocalList(SAVED_RESOURCES_KEY, items);
  return updated;
}

export async function removeSavedResource(savedId: string): Promise<void> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase
        .from('user_saved_resources')
        .delete()
        .eq('id', savedId)
        .eq('user_id', authUserId);

      if (!error) {
        return;
      }
    } catch {
      // Fall through to local removal
    }
  }

  const items = readLocalList<UserSavedResource>(SAVED_RESOURCES_KEY);
  writeLocalList(
    SAVED_RESOURCES_KEY,
    items.filter((item) => item.id !== savedId),
  );
}

export async function listLearningHistory(): Promise<UserLearningHistory[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_learning_history')
        .select('*')
        .eq('user_id', authUserId)
        .order('last_viewed_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return (data as DbLearningHistoryRow[]).map(mapHistoryRow);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return readLocalList<UserLearningHistory>(LEARNING_HISTORY_KEY).sort((a, b) =>
    b.lastViewedAt.localeCompare(a.lastViewedAt),
  );
}

export async function recordLearningProgress(input: {
  resourceId: string;
  lessonId?: string | null;
  lessonSlug?: string;
  lastPositionSeconds: number;
  completionStatus: CompletionStatus;
}): Promise<UserLearningHistory> {
  const resolvedLesson = input.lessonId
    ? getLessonById(input.lessonId)
    : input.lessonSlug
      ? getLessonBySlug(input.lessonSlug)
      : undefined;

  const lessonId = input.lessonId ?? resolvedLesson?.id ?? null;
  const lessonSlug = input.lessonSlug ?? resolvedLesson?.slug;
  const safePosition =
    Number.isFinite(input.lastPositionSeconds) && input.lastPositionSeconds >= 0
      ? Math.floor(input.lastPositionSeconds)
      : 0;
  const nowIso = new Date().toISOString();

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_learning_history')
        .upsert(
          {
            user_id: authUserId,
            resource_id: input.resourceId,
            lesson_id: lessonId,
            last_position_seconds: safePosition,
            completion_status: input.completionStatus,
            last_viewed_at: nowIso,
          },
          { onConflict: 'user_id,resource_id' },
        )
        .select('*')
        .single<DbLearningHistoryRow>();

      if (!error && data) {
        return mapHistoryRow(data);
      }
    } catch {
      // Fallback to local storage
    }
  }

  const userId = await getActiveUserId();
  const items = readLocalList<UserLearningHistory>(LEARNING_HISTORY_KEY);
  const existingIndex = items.findIndex((item) => item.resourceId === input.resourceId);

  if (existingIndex >= 0) {
    const updated: UserLearningHistory = {
      ...items[existingIndex],
      lessonId,
      lessonSlug,
      lastPositionSeconds: safePosition,
      completionStatus: input.completionStatus,
      lastViewedAt: nowIso,
    };
    items[existingIndex] = updated;
    writeLocalList(LEARNING_HISTORY_KEY, items);
    return updated;
  }

  const created: UserLearningHistory = {
    id: generateId(),
    userId,
    resourceId: input.resourceId,
    lessonId,
    lessonSlug,
    lastPositionSeconds: safePosition,
    completionStatus: input.completionStatus,
    lastViewedAt: nowIso,
  };

  writeLocalList(LEARNING_HISTORY_KEY, [created, ...items]);
  return created;
}
