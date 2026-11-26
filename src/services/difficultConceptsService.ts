import type {
  DifficultConceptTrigger,
  UserDifficultConcept,
} from '../types/visual-learning';
import { getLessonById, getLessonBySlug } from '../data/curriculum';
import {
  getActiveUserId,
  getAuthenticatedSupabaseUserId,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

const DIFFICULT_CONCEPTS_KEY = 'tradelab_difficult_concepts_v1';
const PRACTICE_MISTAKE_THRESHOLD = 2;
const MASTERY_STREAK_THRESHOLD = 3;

interface DbDifficultConceptRow {
  id: string;
  user_id: string;
  lesson_id: string;
  concept_key: string;
  concept_label: string;
  trigger_sources: DifficultConceptTrigger[];
  mistake_count: number;
  consecutive_correct: number;
  is_mastered: boolean;
  mastered_at: string | null;
  updated_at: string;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readLocalConcepts(): UserDifficultConcept[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DIFFICULT_CONCEPTS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UserDifficultConcept[]) : [];
  } catch {
    return [];
  }
}

function writeLocalConcepts(items: UserDifficultConcept[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(DIFFICULT_CONCEPTS_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

function isQualifiedDifficultConcept(concept: UserDifficultConcept): boolean {
  return (
    concept.triggerSources.includes('manual_bookmark') ||
    concept.triggerSources.includes('explain_differently') ||
    concept.mistakeCount >= PRACTICE_MISTAKE_THRESHOLD
  );
}

function mapConceptRow(row: DbDifficultConceptRow): UserDifficultConcept {
  const lesson = getLessonById(row.lesson_id);
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    lessonSlug: lesson?.slug ?? row.concept_key,
    conceptKey: row.concept_key,
    conceptLabel: row.concept_label,
    triggerSources: Array.isArray(row.trigger_sources) ? row.trigger_sources : [],
    mistakeCount: row.mistake_count,
    consecutiveCorrect: row.consecutive_correct,
    isMastered: row.is_mastered,
    masteredAt: row.mastered_at,
    updatedAt: row.updated_at,
  };
}

export async function listDifficultConcepts(
  includeMastered = false,
): Promise<UserDifficultConcept[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();
  let allConcepts: UserDifficultConcept[] | null = null;

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_difficult_concepts')
        .select('*')
        .eq('user_id', authUserId)
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        allConcepts = (data as DbDifficultConceptRow[]).map(mapConceptRow);
      }
    } catch {
      allConcepts = null;
    }
  }

  const sourceList = allConcepts ?? readLocalConcepts();

  return sourceList
    .filter((concept) => isQualifiedDifficultConcept(concept))
    .filter((concept) => includeMastered || !concept.isMastered)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function recordConceptStruggle(input: {
  lessonId: string;
  lessonSlug: string;
  conceptKey: string;
  conceptLabel: string;
  trigger: DifficultConceptTrigger;
}): Promise<UserDifficultConcept | null> {
  const resolvedLesson = getLessonById(input.lessonId) ?? getLessonBySlug(input.lessonSlug);
  const lessonId = resolvedLesson?.id ?? input.lessonId;
  const lessonSlug = resolvedLesson?.slug ?? input.lessonSlug;
  const nowIso = new Date().toISOString();

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: existing } = await supabase
        .from('user_difficult_concepts')
        .select('*')
        .eq('user_id', authUserId)
        .eq('lesson_id', lessonId)
        .eq('concept_key', input.conceptKey)
        .maybeSingle<DbDifficultConceptRow>();

      const triggers = new Set<DifficultConceptTrigger>(existing?.trigger_sources ?? []);
      triggers.add(input.trigger);

      const nextMistakeCount =
        (existing?.mistake_count ?? 0) + (input.trigger === 'practice_mistake' ? 1 : 0);
      const nextTriggerList = Array.from(triggers);
      const qualifiesNow =
        nextTriggerList.includes('manual_bookmark') ||
        nextTriggerList.includes('explain_differently') ||
        nextMistakeCount >= PRACTICE_MISTAKE_THRESHOLD;

      const { data: saved, error } = await supabase
        .from('user_difficult_concepts')
        .upsert(
          {
            user_id: authUserId,
            lesson_id: lessonId,
            concept_key: input.conceptKey,
            concept_label: input.conceptLabel,
            trigger_sources: nextTriggerList,
            mistake_count: nextMistakeCount,
            consecutive_correct: 0,
            is_mastered: qualifiesNow ? false : (existing?.is_mastered ?? false),
            mastered_at: qualifiesNow ? null : (existing?.mastered_at ?? null),
          },
          { onConflict: 'user_id,lesson_id,concept_key' },
        )
        .select('*')
        .single<DbDifficultConceptRow>();

      if (!error && saved) {
        const mapped = mapConceptRow(saved);
        return isQualifiedDifficultConcept(mapped) ? mapped : null;
      }
    } catch {
      // Fall through to local persistence
    }
  }

  const userId = await getActiveUserId();
  const concepts = readLocalConcepts();
  const existingIndex = concepts.findIndex(
    (item) => item.lessonSlug === lessonSlug && item.conceptKey === input.conceptKey,
  );

  let updatedConcept: UserDifficultConcept;
  if (existingIndex >= 0) {
    const existing = concepts[existingIndex];
    const triggers = new Set<DifficultConceptTrigger>(existing.triggerSources);
    triggers.add(input.trigger);

    const nextMistakeCount =
      existing.mistakeCount + (input.trigger === 'practice_mistake' ? 1 : 0);
    const nextTriggerList = Array.from(triggers);
    const qualifiesNow =
      nextTriggerList.includes('manual_bookmark') ||
      nextTriggerList.includes('explain_differently') ||
      nextMistakeCount >= PRACTICE_MISTAKE_THRESHOLD;

    updatedConcept = {
      ...existing,
      lessonId,
      lessonSlug,
      conceptLabel: input.conceptLabel || existing.conceptLabel,
      triggerSources: nextTriggerList,
      mistakeCount: nextMistakeCount,
      consecutiveCorrect: 0,
      isMastered: qualifiesNow ? false : existing.isMastered,
      masteredAt: qualifiesNow ? null : existing.masteredAt,
      updatedAt: nowIso,
    };
    concepts[existingIndex] = updatedConcept;
  } else {
    updatedConcept = {
      id: generateId(),
      userId,
      lessonId,
      lessonSlug,
      conceptKey: input.conceptKey,
      conceptLabel: input.conceptLabel,
      triggerSources: [input.trigger],
      mistakeCount: input.trigger === 'practice_mistake' ? 1 : 0,
      consecutiveCorrect: 0,
      isMastered: false,
      masteredAt: null,
      updatedAt: nowIso,
    };
    concepts.unshift(updatedConcept);
  }

  writeLocalConcepts(concepts);
  return isQualifiedDifficultConcept(updatedConcept) ? updatedConcept : null;
}

export async function recordConceptCorrectAttempt(
  lessonSlug: string,
  conceptKey: string,
): Promise<{ concept: UserDifficultConcept | null; suggestMastery: boolean }> {
  const lesson = getLessonBySlug(lessonSlug);
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId && lesson) {
    try {
      const { data: existing } = await supabase
        .from('user_difficult_concepts')
        .select('*')
        .eq('user_id', authUserId)
        .eq('lesson_id', lesson.id)
        .eq('concept_key', conceptKey)
        .maybeSingle<DbDifficultConceptRow>();

      if (existing) {
        const nextStreak = existing.consecutive_correct + 1;
        const { data: updated, error } = await supabase
          .from('user_difficult_concepts')
          .update({ consecutive_correct: nextStreak })
          .eq('id', existing.id)
          .eq('user_id', authUserId)
          .select('*')
          .single<DbDifficultConceptRow>();

        if (!error && updated) {
          const mapped = mapConceptRow(updated);
          const qualified = isQualifiedDifficultConcept(mapped);
          return {
            concept: qualified ? mapped : null,
            suggestMastery:
              qualified && !mapped.isMastered && mapped.consecutiveCorrect >= MASTERY_STREAK_THRESHOLD,
          };
        }
      }
      return { concept: null, suggestMastery: false };
    } catch {
      // Fall through to local persistence
    }
  }

  const concepts = readLocalConcepts();
  const index = concepts.findIndex(
    (item) => item.lessonSlug === lessonSlug && item.conceptKey === conceptKey,
  );
  if (index === -1) {
    return { concept: null, suggestMastery: false };
  }

  const updated: UserDifficultConcept = {
    ...concepts[index],
    consecutiveCorrect: concepts[index].consecutiveCorrect + 1,
    updatedAt: new Date().toISOString(),
  };
  concepts[index] = updated;
  writeLocalConcepts(concepts);

  const qualified = isQualifiedDifficultConcept(updated);
  return {
    concept: qualified ? updated : null,
    suggestMastery:
      qualified && !updated.isMastered && updated.consecutiveCorrect >= MASTERY_STREAK_THRESHOLD,
  };
}

export async function markConceptMastered(conceptId: string): Promise<void> {
  const nowIso = new Date().toISOString();
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase
        .from('user_difficult_concepts')
        .update({
          is_mastered: true,
          mastered_at: nowIso,
        })
        .eq('id', conceptId)
        .eq('user_id', authUserId);

      if (!error) {
        return;
      }
    } catch {
      // Fallback to local
    }
  }

  const concepts = readLocalConcepts();
  const updated = concepts.map((item) =>
    item.id === conceptId
      ? {
          ...item,
          isMastered: true,
          masteredAt: nowIso,
          updatedAt: nowIso,
        }
      : item,
  );
  writeLocalConcepts(updated);
}

export async function reopenDifficultConcept(conceptId: string): Promise<void> {
  const nowIso = new Date().toISOString();
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase
        .from('user_difficult_concepts')
        .update({
          is_mastered: false,
          mastered_at: null,
          consecutive_correct: 0,
        })
        .eq('id', conceptId)
        .eq('user_id', authUserId);

      if (!error) {
        return;
      }
    } catch {
      // Fallback to local
    }
  }

  const concepts = readLocalConcepts();
  const updated = concepts.map((item) =>
    item.id === conceptId
      ? {
          ...item,
          isMastered: false,
          masteredAt: null,
          consecutiveCorrect: 0,
          updatedAt: nowIso,
        }
      : item,
  );
  writeLocalConcepts(updated);
}
