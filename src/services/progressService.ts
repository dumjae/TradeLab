import type { CurriculumLevel, Lesson, LessonMarketCategory } from '../types/academy';
import type {
  LessonProgressRecord,
  OnboardingPreferences,
  StudyProgressSummary,
} from '../types/learning-loop';
import { CURRICULUM_LESSONS, getLessonBySlug } from '../data/curriculum';
import {
  getActiveUserId,
  getAuthenticatedSupabaseUserId,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

const LESSON_PROGRESS_KEY = 'tradelab_lesson_progress_v1';
const ONBOARDING_PREFS_KEY = 'tradelab_onboarding_v1';

const VALID_CURRICULUM_LEVELS: ReadonlySet<CurriculumLevel> = new Set([
  'beginner',
  'intermediate',
  'advanced',
]);

const VALID_PREFERRED_MARKETS: ReadonlySet<LessonMarketCategory | 'all'> = new Set([
  'all',
  'general',
  'forex',
  'indices',
  'crypto',
  'stocks',
]);

interface DbLessonProgressRow {
  id: string;
  user_id: string;
  lesson_id: string;
  lesson_slug: string;
  completed: boolean;
  completed_at: string | null;
  updated_at: string;
}

interface DbProfileOnboardingRow {
  experience_level: string | null;
  preferred_market: string | null;
  onboarding_completed: boolean | null;
  updated_at: string | null;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `prog-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isValidCurriculumLevel(value: unknown): value is CurriculumLevel {
  return typeof value === 'string' && VALID_CURRICULUM_LEVELS.has(value as CurriculumLevel);
}

function isValidPreferredMarket(value: unknown): value is LessonMarketCategory | 'all' {
  return (
    typeof value === 'string' &&
    VALID_PREFERRED_MARKETS.has(value as LessonMarketCategory | 'all')
  );
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
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocalJson(storageKey: string, value: unknown): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Ignore quota errors in restricted browser storage modes
  }
}

function toUtcDateKey(input: string | Date): string | null {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().slice(0, 10);
}

function createDefaultOnboardingPreferences(): OnboardingPreferences {
  return {
    experienceLevel: 'beginner',
    preferredMarket: 'all',
    onboardingCompleted: false,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeOnboardingPreferences(raw: Partial<OnboardingPreferences>): OnboardingPreferences {
  return {
    experienceLevel: isValidCurriculumLevel(raw.experienceLevel)
      ? raw.experienceLevel
      : 'beginner',
    preferredMarket: isValidPreferredMarket(raw.preferredMarket)
      ? raw.preferredMarket
      : 'all',
    onboardingCompleted: Boolean(raw.onboardingCompleted),
    updatedAt:
      typeof raw.updatedAt === 'string' && !Number.isNaN(Date.parse(raw.updatedAt))
        ? raw.updatedAt
        : new Date().toISOString(),
  };
}

function mapProgressRow(row: DbLessonProgressRow): LessonProgressRecord {
  const lesson = getLessonBySlug(row.lesson_slug);
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id || lesson?.id || row.lesson_slug,
    lessonSlug: row.lesson_slug,
    completed: Boolean(row.completed),
    completedAt: row.completed_at ?? null,
    updatedAt: row.updated_at,
  };
}

export async function listLessonProgress(): Promise<LessonProgressRecord[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', authUserId)
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return (data as DbLessonProgressRow[]).map(mapProgressRow);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return readLocalList<LessonProgressRecord>(LESSON_PROGRESS_KEY).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export async function toggleLessonCompleted(
  lessonSlug: string,
  completed?: boolean,
): Promise<LessonProgressRecord> {
  const normalizedSlug = lessonSlug.trim();
  if (!normalizedSlug) {
    throw new Error('Lesson slug is required.');
  }

  const lesson = getLessonBySlug(normalizedSlug);
  const nowIso = new Date().toISOString();
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId && lesson) {
    try {
      const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', authUserId)
        .eq('lesson_slug', normalizedSlug)
        .maybeSingle<DbLessonProgressRow>();

      const nextCompleted =
        typeof completed === 'boolean' ? completed : !(existing?.completed ?? false);
      const nextCompletedAt = nextCompleted
        ? existing?.completed && existing.completed_at
          ? existing.completed_at
          : nowIso
        : null;

      const { data: saved, error } = await supabase
        .from('user_lesson_progress')
        .upsert(
          {
            user_id: authUserId,
            lesson_id: lesson.id,
            lesson_slug: normalizedSlug,
            completed: nextCompleted,
            completed_at: nextCompletedAt,
            updated_at: nowIso,
          },
          { onConflict: 'user_id,lesson_slug' },
        )
        .select('*')
        .single<DbLessonProgressRow>();

      if (!error && saved) {
        return mapProgressRow(saved);
      }
    } catch {
      // Fall through to local preview persistence
    }
  }

  const userId = await getActiveUserId();
  const existingList = readLocalList<LessonProgressRecord>(LESSON_PROGRESS_KEY);
  const existingIndex = existingList.findIndex((item) => item.lessonSlug === normalizedSlug);
  const existingRecord = existingIndex >= 0 ? existingList[existingIndex] : undefined;

  const nextCompleted =
    typeof completed === 'boolean' ? completed : !(existingRecord?.completed ?? false);
  const nextCompletedAt = nextCompleted
    ? existingRecord?.completed && existingRecord.completedAt
      ? existingRecord.completedAt
      : nowIso
    : null;

  const updatedRecord: LessonProgressRecord = existingRecord
    ? {
        ...existingRecord,
        lessonId: lesson?.id ?? existingRecord.lessonId,
        completed: nextCompleted,
        completedAt: nextCompletedAt,
        updatedAt: nowIso,
      }
    : {
        id: generateId(),
        userId,
        lessonId: lesson?.id ?? normalizedSlug,
        lessonSlug: normalizedSlug,
        completed: nextCompleted,
        completedAt: nextCompletedAt,
        updatedAt: nowIso,
      };

  const nextList =
    existingIndex >= 0
      ? existingList.map((item, idx) => (idx === existingIndex ? updatedRecord : item))
      : [updatedRecord, ...existingList];

  writeLocalJson(LESSON_PROGRESS_KEY, nextList);
  return updatedRecord;
}

export function computeStudyProgressSummary(
  records: LessonProgressRecord[],
  totalLessons?: number,
): StudyProgressSummary {
  const safeTotal =
    typeof totalLessons === 'number' && Number.isFinite(totalLessons) && totalLessons >= 0
      ? Math.floor(totalLessons)
      : CURRICULUM_LESSONS.length;

  const completedSlugSet = new Set<string>();
  const completionDateSet = new Set<string>();

  for (const record of records) {
    if (!record.completed) {
      continue;
    }

    if (record.lessonSlug) {
      completedSlugSet.add(record.lessonSlug);
    }

    if (record.completedAt) {
      const dateKey = toUtcDateKey(record.completedAt);
      if (dateKey) {
        completionDateSet.add(dateKey);
      }
    }
  }

  const completedSlugs = Array.from(completedSlugSet);
  const completedCount = completedSlugs.length;
  const percentComplete =
    safeTotal > 0 ? Math.min(100, Math.round((completedCount / safeTotal) * 100)) : 0;

  const sortedDateKeys = Array.from(completionDateSet).sort();
  const lastStudyDate =
    sortedDateKeys.length > 0 ? sortedDateKeys[sortedDateKeys.length - 1] : null;

  let currentStreakDays = 0;
  if (completionDateSet.size > 0) {
    const now = new Date();
    const todayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const yesterdayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
    );

    const todayKey = toUtcDateKey(todayUtc);
    const yesterdayKey = toUtcDateKey(yesterdayUtc);

    let cursor: Date | null = null;
    if (todayKey && completionDateSet.has(todayKey)) {
      cursor = todayUtc;
    } else if (yesterdayKey && completionDateSet.has(yesterdayKey)) {
      cursor = yesterdayUtc;
    }

    while (cursor) {
      const key = toUtcDateKey(cursor);
      if (!key || !completionDateSet.has(key)) {
        break;
      }
      currentStreakDays += 1;
      cursor = new Date(
        Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate() - 1),
      );
    }
  }

  return {
    completedSlugs,
    completedCount,
    totalLessons: safeTotal,
    percentComplete,
    currentStreakDays,
    lastStudyDate,
  };
}

export async function getOnboardingPreferences(): Promise<OnboardingPreferences> {
  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('experience_level, preferred_market, onboarding_completed, updated_at')
        .eq('id', authUserId)
        .maybeSingle<DbProfileOnboardingRow>();

      if (!error && data) {
        return normalizeOnboardingPreferences({
          experienceLevel: isValidCurriculumLevel(data.experience_level)
            ? data.experience_level
            : 'beginner',
          preferredMarket: isValidPreferredMarket(data.preferred_market)
            ? data.preferred_market
            : 'all',
          onboardingCompleted: Boolean(data.onboarding_completed),
          updatedAt: data.updated_at ?? new Date().toISOString(),
        });
      }
    } catch {
      // Fallback to local storage
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(ONBOARDING_PREFS_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return normalizeOnboardingPreferences(parsed as Partial<OnboardingPreferences>);
        }
      }
    } catch {
      // Fall through to default preferences
    }
  }

  return createDefaultOnboardingPreferences();
}

export async function saveOnboardingPreferences(input: {
  experienceLevel: CurriculumLevel;
  preferredMarket: LessonMarketCategory | 'all';
  onboardingCompleted?: boolean;
}): Promise<OnboardingPreferences> {
  const nowIso = new Date().toISOString();
  const normalized: OnboardingPreferences = {
    experienceLevel: isValidCurriculumLevel(input.experienceLevel)
      ? input.experienceLevel
      : 'beginner',
    preferredMarket: isValidPreferredMarket(input.preferredMarket)
      ? input.preferredMarket
      : 'all',
    onboardingCompleted: input.onboardingCompleted ?? true,
    updatedAt: nowIso,
  };

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          experience_level: normalized.experienceLevel,
          preferred_market: normalized.preferredMarket,
          onboarding_completed: normalized.onboardingCompleted,
          updated_at: nowIso,
        })
        .eq('id', authUserId)
        .select('experience_level, preferred_market, onboarding_completed, updated_at')
        .maybeSingle<DbProfileOnboardingRow>();

      if (!error && data) {
        return normalizeOnboardingPreferences({
          experienceLevel: isValidCurriculumLevel(data.experience_level)
            ? data.experience_level
            : normalized.experienceLevel,
          preferredMarket: isValidPreferredMarket(data.preferred_market)
            ? data.preferred_market
            : normalized.preferredMarket,
          onboardingCompleted:
            typeof data.onboarding_completed === 'boolean'
              ? data.onboarding_completed
              : normalized.onboardingCompleted,
          updatedAt: data.updated_at ?? nowIso,
        });
      }
    } catch {
      // Fall through to local preview persistence
    }
  }

  writeLocalJson(ONBOARDING_PREFS_KEY, normalized);
  return normalized;
}

export function getRecommendedNextLesson(
  summary: StudyProgressSummary,
  prefs: OnboardingPreferences,
): Lesson {
  const completedSet = new Set(summary.completedSlugs);
  const incompleteLessons = CURRICULUM_LESSONS.filter(
    (lesson) => !completedSet.has(lesson.slug),
  );

  if (incompleteLessons.length === 0) {
    return CURRICULUM_LESSONS[0];
  }

  if (prefs.preferredMarket !== 'all') {
    const marketMatch = incompleteLessons.find(
      (lesson) => lesson.marketCategory === prefs.preferredMarket,
    );
    if (marketMatch) {
      return marketMatch;
    }
  } else {
    const foundationMatch = incompleteLessons.find(
      (lesson) => lesson.level === 'beginner' || lesson.learningStage === 'foundations',
    );
    if (foundationMatch) {
      return foundationMatch;
    }
  }

  return incompleteLessons[0] ?? CURRICULUM_LESSONS[0];
}
