import {
  ACADEMY_PATHS,
  ALL_SYLLABUS_LESSONS,
  getTopicByCode,
  getTopicsByLevel,
  getTopicsForPath,
} from '../data/academyRoadmap';
import {
  getAuthenticatedSupabaseUserId,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';
import type {
  AcademyPathId,
  DecoupledLessonNode,
  LevelAssessmentResult,
  MasteryLevel,
  TopicProgressRecord,
} from '../types/curriculum-tree';

const TOPIC_PROGRESS_STORAGE_KEY = 'tradelab_topic_progress_v1';
const LEVEL_ASSESSMENTS_STORAGE_KEY = 'tradelab_level_assessments_v1';
const FREE_BROWSE_STORAGE_KEY = 'tradelab_free_browse_v1';

const PASSING_ASSESSMENT_SCORE_PCT = 70;
const MASTERY_LEVEL_ORDER: readonly MasteryLevel[] = [1, 2, 3, 4, 5];

interface DbTopicProgressRow {
  topic_code: string;
  reading_completed: boolean;
  quiz_passed: boolean;
  quiz_score_pct: number;
  practical_completed: boolean;
  completed: boolean;
  updated_at: string;
}

interface DbLevelAssessmentRow {
  level: number;
  score_pct: number;
  correct_count: number;
  total_questions: number;
  passed: boolean;
  certificate_code: string | null;
  completed_at: string;
}

export interface TopicUnlockStatus {
  unlocked: boolean;
  missingPrerequisiteCodes: string[];
}

export interface LevelMasteryProgress {
  total: number;
  completed: number;
  percent: number;
  passedAssessment: boolean;
}

export interface PathMasteryProgress {
  total: number;
  completed: number;
  percent: number;
}

export interface MasterySummary {
  totalTopics: number;
  completedTopics: number;
  overallPercent: number;
  byLevel: Record<MasteryLevel, LevelMasteryProgress>;
  byPath: Record<AcademyPathId, PathMasteryProgress>;
  currentLevel: MasteryLevel;
  nextRecommendedTopic: DecoupledLessonNode;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

function isMasteryLevel(value: unknown): value is MasteryLevel {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
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

function mapTopicProgressRow(row: DbTopicProgressRow): TopicProgressRecord {
  return {
    topicCode: row.topic_code,
    readingCompleted: Boolean(row.reading_completed),
    quizPassed: Boolean(row.quiz_passed),
    quizScorePct: clampPercent(row.quiz_score_pct),
    practicalCompleted: Boolean(row.practical_completed),
    completed: Boolean(row.completed),
    updatedAt: row.updated_at,
  };
}

function mapLevelAssessmentRow(row: DbLevelAssessmentRow): LevelAssessmentResult | null {
  if (!isMasteryLevel(row.level)) {
    return null;
  }

  return {
    level: row.level,
    scorePct: clampPercent(row.score_pct),
    correctCount: Math.max(0, Math.floor(row.correct_count)),
    totalQuestions: Math.max(1, Math.floor(row.total_questions)),
    passed: Boolean(row.passed),
    certificateCode:
      typeof row.certificate_code === 'string' && row.certificate_code.trim().length > 0
        ? row.certificate_code.trim()
        : null,
    completedAt: row.completed_at,
  };
}

function generateCertificateCode(level: MasteryLevel): string {
  const year = new Date().getUTCFullYear();
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      suffix += alphabet[byte % alphabet.length];
    }
  } else {
    for (let i = 0; i < 4; i += 1) {
      suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }

  return `TL-L${level}-${year}-${suffix}`;
}

export async function listTopicProgress(): Promise<TopicProgressRecord[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_topic_progress')
        .select(
          'topic_code, reading_completed, quiz_passed, quiz_score_pct, practical_completed, completed, updated_at',
        )
        .eq('user_id', authUserId)
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return (data as DbTopicProgressRow[]).map(mapTopicProgressRow);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return readLocalList<TopicProgressRecord>(TOPIC_PROGRESS_STORAGE_KEY).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export async function saveTopicProgress(
  topicCode: string,
  patch: Partial<
    Pick<
      TopicProgressRecord,
      'readingCompleted' | 'quizPassed' | 'quizScorePct' | 'practicalCompleted' | 'completed'
    >
  >,
): Promise<TopicProgressRecord> {
  const normalizedCode = topicCode.trim();
  if (!normalizedCode) {
    throw new Error('Topic code is required.');
  }

  const nowIso = new Date().toISOString();
  const authUserId = await getAuthenticatedSupabaseUserId();

  const mergeRecord = (existing?: TopicProgressRecord): TopicProgressRecord => {
    const readingCompleted = patch.readingCompleted ?? existing?.readingCompleted ?? false;
    const quizPassed = patch.quizPassed ?? existing?.quizPassed ?? false;
    const quizScorePct =
      typeof patch.quizScorePct === 'number'
        ? clampPercent(patch.quizScorePct)
        : (existing?.quizScorePct ?? 0);
    const practicalCompleted = patch.practicalCompleted ?? existing?.practicalCompleted ?? false;
    const completed =
      patch.completed === true
        ? true
        : patch.completed === false
          ? false
          : Boolean(existing?.completed || (readingCompleted && quizPassed));

    return {
      topicCode: normalizedCode,
      readingCompleted,
      quizPassed,
      quizScorePct,
      practicalCompleted,
      completed,
      updatedAt: nowIso,
    };
  };

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: existingRow } = await supabase
        .from('user_topic_progress')
        .select(
          'topic_code, reading_completed, quiz_passed, quiz_score_pct, practical_completed, completed, updated_at',
        )
        .eq('user_id', authUserId)
        .eq('topic_code', normalizedCode)
        .maybeSingle<DbTopicProgressRow>();

      const merged = mergeRecord(existingRow ? mapTopicProgressRow(existingRow) : undefined);

      const { data: saved, error } = await supabase
        .from('user_topic_progress')
        .upsert(
          {
            user_id: authUserId,
            topic_code: merged.topicCode,
            reading_completed: merged.readingCompleted,
            quiz_passed: merged.quizPassed,
            quiz_score_pct: merged.quizScorePct,
            practical_completed: merged.practicalCompleted,
            completed: merged.completed,
            updated_at: merged.updatedAt,
          },
          { onConflict: 'user_id,topic_code' },
        )
        .select(
          'topic_code, reading_completed, quiz_passed, quiz_score_pct, practical_completed, completed, updated_at',
        )
        .single<DbTopicProgressRow>();

      if (!error && saved) {
        return mapTopicProgressRow(saved);
      }
    } catch {
      // Fall through to local persistence
    }
  }

  const existingList = readLocalList<TopicProgressRecord>(TOPIC_PROGRESS_STORAGE_KEY);
  const existingIndex = existingList.findIndex((item) => item.topicCode === normalizedCode);
  const existingRecord = existingIndex >= 0 ? existingList[existingIndex] : undefined;
  const updatedRecord = mergeRecord(existingRecord);

  const nextList =
    existingIndex >= 0
      ? existingList.map((item, idx) => (idx === existingIndex ? updatedRecord : item))
      : [updatedRecord, ...existingList];

  writeLocalJson(TOPIC_PROGRESS_STORAGE_KEY, nextList);
  return updatedRecord;
}

export function isFreeBrowseEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(FREE_BROWSE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setFreeBrowseEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(FREE_BROWSE_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore storage errors in restricted browser modes
  }
}

export function isTopicUnlocked(
  topic: DecoupledLessonNode,
  progressMap: Record<string, TopicProgressRecord>,
  freeBrowse: boolean,
): TopicUnlockStatus {
  const missingPrerequisiteCodes = topic.prerequisiteCodes.filter(
    (code) => !progressMap[code]?.completed,
  );

  if (freeBrowse || missingPrerequisiteCodes.length === 0) {
    return {
      unlocked: true,
      missingPrerequisiteCodes,
    };
  }

  return {
    unlocked: false,
    missingPrerequisiteCodes,
  };
}

export async function listLevelAssessments(): Promise<LevelAssessmentResult[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_level_assessments')
        .select(
          'level, score_pct, correct_count, total_questions, passed, certificate_code, completed_at',
        )
        .eq('user_id', authUserId)
        .order('level', { ascending: true });

      if (!error && Array.isArray(data)) {
        return (data as DbLevelAssessmentRow[])
          .map(mapLevelAssessmentRow)
          .filter((item): item is LevelAssessmentResult => item !== null);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return readLocalList<LevelAssessmentResult>(LEVEL_ASSESSMENTS_STORAGE_KEY)
    .filter((item) => isMasteryLevel(item.level))
    .sort((a, b) => a.level - b.level);
}

export async function submitLevelAssessment(
  level: MasteryLevel,
  correctCount: number,
  totalQuestions: number,
): Promise<LevelAssessmentResult> {
  const safeTotal = Math.max(1, Math.floor(Number.isFinite(totalQuestions) ? totalQuestions : 1));
  const safeCorrect = Math.min(
    safeTotal,
    Math.max(0, Math.floor(Number.isFinite(correctCount) ? correctCount : 0)),
  );
  const scorePct = clampPercent((safeCorrect / safeTotal) * 100);
  const attemptPassed = scorePct >= PASSING_ASSESSMENT_SCORE_PCT;
  const nowIso = new Date().toISOString();

  const buildResult = (existing?: LevelAssessmentResult | null): LevelAssessmentResult => {
    const existingCert = existing?.certificateCode ?? null;
    const passed = Boolean(existing?.passed || attemptPassed);
    const certificateCode = existingCert ?? (attemptPassed ? generateCertificateCode(level) : null);

    return {
      level,
      scorePct,
      correctCount: safeCorrect,
      totalQuestions: safeTotal,
      passed,
      certificateCode,
      completedAt: nowIso,
    };
  };

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: existingRow } = await supabase
        .from('user_level_assessments')
        .select(
          'level, score_pct, correct_count, total_questions, passed, certificate_code, completed_at',
        )
        .eq('user_id', authUserId)
        .eq('level', level)
        .maybeSingle<DbLevelAssessmentRow>();

      const existing = existingRow ? mapLevelAssessmentRow(existingRow) : null;
      const nextResult = buildResult(existing);

      const { data: saved, error } = await supabase
        .from('user_level_assessments')
        .upsert(
          {
            user_id: authUserId,
            level: nextResult.level,
            score_pct: nextResult.scorePct,
            correct_count: nextResult.correctCount,
            total_questions: nextResult.totalQuestions,
            passed: nextResult.passed,
            certificate_code: nextResult.certificateCode,
            completed_at: nextResult.completedAt,
          },
          { onConflict: 'user_id,level' },
        )
        .select(
          'level, score_pct, correct_count, total_questions, passed, certificate_code, completed_at',
        )
        .single<DbLevelAssessmentRow>();

      if (!error && saved) {
        const mapped = mapLevelAssessmentRow(saved);
        if (mapped) {
          return mapped;
        }
      }
    } catch {
      // Fall through to local persistence
    }
  }

  const existingList = readLocalList<LevelAssessmentResult>(LEVEL_ASSESSMENTS_STORAGE_KEY);
  const existingIndex = existingList.findIndex((item) => item.level === level);
  const existingRecord = existingIndex >= 0 ? existingList[existingIndex] : null;
  const updatedResult = buildResult(existingRecord);

  const nextList =
    existingIndex >= 0
      ? existingList.map((item, idx) => (idx === existingIndex ? updatedResult : item))
      : [...existingList, updatedResult].sort((a, b) => a.level - b.level);

  writeLocalJson(LEVEL_ASSESSMENTS_STORAGE_KEY, nextList);
  return updatedResult;
}

export function computeMasterySummary(
  progressRecords: TopicProgressRecord[],
  assessments: LevelAssessmentResult[],
): MasterySummary {
  const progressMap: Record<string, TopicProgressRecord> = {};
  const completedCodeSet = new Set<string>();

  for (const record of progressRecords) {
    progressMap[record.topicCode] = record;
    if (record.completed && getTopicByCode(record.topicCode)) {
      completedCodeSet.add(record.topicCode);
    }
  }

  const passedLevelSet = new Set<MasteryLevel>();
  for (const assessment of assessments) {
    if (assessment.passed && isMasteryLevel(assessment.level)) {
      passedLevelSet.add(assessment.level);
    }
  }

  const totalTopics = ALL_SYLLABUS_LESSONS.length;
  const completedTopics = completedCodeSet.size;
  const overallPercent =
    totalTopics > 0 ? Math.min(100, Math.round((completedTopics / totalTopics) * 100)) : 0;

  const byLevel = {} as Record<MasteryLevel, LevelMasteryProgress>;
  for (const level of MASTERY_LEVEL_ORDER) {
    const topics = getTopicsByLevel(level);
    const completed = topics.filter((topic) => completedCodeSet.has(topic.code)).length;
    byLevel[level] = {
      total: topics.length,
      completed,
      percent: topics.length > 0 ? Math.min(100, Math.round((completed / topics.length) * 100)) : 0,
      passedAssessment: passedLevelSet.has(level),
    };
  }

  const byPath = {} as Record<AcademyPathId, PathMasteryProgress>;
  for (const pathMeta of ACADEMY_PATHS) {
    const topics = getTopicsForPath(pathMeta.id);
    const completed = topics.filter((topic) => completedCodeSet.has(topic.code)).length;
    byPath[pathMeta.id] = {
      total: topics.length,
      completed,
      percent: topics.length > 0 ? Math.min(100, Math.round((completed / topics.length) * 100)) : 0,
    };
  }

  let currentLevel: MasteryLevel = 1;
  for (const level of [1, 2, 3, 4] as const) {
    const levelStats = byLevel[level];
    if (levelStats.passedAssessment || levelStats.percent >= 80) {
      currentLevel = (level + 1) as MasteryLevel;
    } else {
      break;
    }
  }

  const currentLevelTopics = getTopicsByLevel(currentLevel);
  const nextRecommendedTopic =
    currentLevelTopics.find(
      (topic) =>
        !completedCodeSet.has(topic.code) && isTopicUnlocked(topic, progressMap, false).unlocked,
    ) ??
    ALL_SYLLABUS_LESSONS.find(
      (topic) =>
        !completedCodeSet.has(topic.code) && isTopicUnlocked(topic, progressMap, false).unlocked,
    ) ??
    ALL_SYLLABUS_LESSONS.find((topic) => !completedCodeSet.has(topic.code)) ??
    ALL_SYLLABUS_LESSONS[0];

  return {
    totalTopics,
    completedTopics,
    overallPercent,
    byLevel,
    byPath,
    currentLevel,
    nextRecommendedTopic,
  };
}
