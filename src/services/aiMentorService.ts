import type {
  AppLearningContext,
  ExplanationStyle,
  Lesson,
  TerminologyEntry,
} from '../types/academy';
import type {
  ExplainDifferentlyRequest,
  ExplainDifferentlyResponse,
  LessonResourceWithDetails,
  MentorChatMessage,
  MentorCitation,
} from '../types/visual-learning';
import { getLessonByConceptKey, getLessonBySlug } from '../data/curriculum';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { getPublishedLessonResources } from './visualResourcesService';

function generateMessageId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `mentor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildVerifiedCitationsFromPublished(
  resources: LessonResourceWithDetails[],
  limit = 2,
): MentorCitation[] {
  const citations: MentorCitation[] = [];

  for (const item of resources) {
    if (item.resource.verificationStatus !== 'published') {
      continue;
    }
    if (citations.length >= limit) {
      break;
    }

    const firstSegment = item.segments[0];
    if (firstSegment) {
      citations.push({
        resourceId: item.resource.id,
        segmentId: firstSegment.id,
        title: item.resource.title,
        sourceName: item.resource.sourceName,
        sourceUrl: item.resource.sourceUrl,
        startSeconds: firstSegment.startSeconds,
        endSeconds: firstSegment.endSeconds,
        segmentTitle: firstSegment.segmentTitle,
        verificationMethod: firstSegment.verificationMethod,
      });
    } else {
      citations.push({
        resourceId: item.resource.id,
        title: item.resource.title,
        sourceName: item.resource.sourceName,
        sourceUrl: item.resource.sourceUrl,
      });
    }
  }

  return citations;
}

function inferStyleFromMessage(
  userMessage: string,
  explicitStyle?: ExplanationStyle,
): ExplanationStyle {
  if (explicitStyle) {
    return explicitStyle;
  }

  const lower = userMessage.toLowerCase();
  if (/\b(mistake|trap|wrong|avoid|fail|fakeout)\b/.test(lower)) {
    return 'common_mistakes';
  }
  if (/\b(compare|versus|vs\.?|difference|between)\b/.test(lower)) {
    return 'comparison';
  }
  if (/\b(analogy|metaphor|like|real life|everyday)\b/.test(lower)) {
    return 'analogy_based';
  }
  if (/\b(chart|example|candle|price|scenario|live)\b/.test(lower)) {
    return 'real_chart_example';
  }
  if (/\b(step|how to|checklist|process|spot|identify)\b/.test(lower)) {
    return 'step_by_step_visual';
  }
  return 'beginner_friendly';
}

function buildLocalGroundedFallback(
  req: ExplainDifferentlyRequest,
  lesson: Lesson,
  publishedResources: LessonResourceWithDetails[],
): ExplainDifferentlyResponse {
  const practiceGuardActive = req.mode === 'practice' && !req.hasSubmittedAnswer;
  const curated = lesson.fallbackExplanations[req.style];
  const citations = buildVerifiedCitationsFromPublished(publishedResources, 2);

  if (practiceGuardActive) {
    const activeQuestion = req.activeQuestionId
      ? lesson.practiceQuestions.find((q) => q.id === req.activeQuestionId)
      : undefined;

    const guidingSteps: string[] = [
      curated.practiceSafeHint,
      ...(activeQuestion?.hints.slice(0, 2) ?? curated.steps.slice(0, 2)),
      `Guiding check: Before selecting your answer, what candle-close or structural evidence in ${lesson.title} confirms your thesis?`,
    ];

    return {
      style: req.style,
      headline: `${curated.headline} (Practice Mode — Guided Hint)`,
      explanation:
        'Practice Mode answer protection is active: I will guide your reasoning without giving away the answer. ' +
        curated.practiceSafeHint,
      steps: guidingSteps,
      keyTakeaway: curated.keyTakeaway,
      sourceType: 'deterministic_fallback',
      isPracticeGuardActive: true,
      citations,
    };
  }

  const trimmedQuestion = req.userQuestion?.trim();
  const explanation = trimmedQuestion
    ? `Focused on "${trimmedQuestion.slice(0, 140)}": ${curated.summary}`
    : curated.summary;

  return {
    style: req.style,
    headline: curated.headline,
    explanation,
    steps: curated.steps,
    keyTakeaway: curated.keyTakeaway,
    sourceType: 'deterministic_fallback',
    isPracticeGuardActive: false,
    citations,
  };
}

const COMPLEX_QUESTION_MODIFIERS =
  /\b(vs|versus|compare|difference|between|strategy|entry|exit|stop\s+loss|setup|why\s+did|how\s+do\s+i|when\s+should|mistake|trap|fakeout)\b/i;

const DEFINITION_PREFIX_PATTERN =
  /^(?:what(?:\s+is|\s+are|\s+does|\s*s)\s+|define\s+|explain\s+|meaning\s+of\s+|definition\s+of\s+|tell\s+me\s+what\s+)(?:(?:a|an|the)\s+)?/i;

const DEFINITION_SUFFIX_PATTERN =
  /\s+(?:mean|means|stand\s+for|stands\s+for|definition|in\s+trading|in\s+this\s+lesson|here)$/i;

function normalizeTerminologyText(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]s\b/g, ' s')
    .replace(/[^a-z0-9%]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildTerminologyCandidateKeys(entry: TerminologyEntry): string[] {
  const keys = new Set<string>();
  const addVariant = (raw?: string) => {
    if (!raw) {
      return;
    }
    const normalized = normalizeTerminologyText(raw);
    if (normalized) {
      keys.add(normalized);
    }
    if (raw.includes('/')) {
      for (const part of raw.split('/')) {
        const normalizedPart = normalizeTerminologyText(part);
        if (normalizedPart) {
          keys.add(normalizedPart);
        }
      }
    }
  };

  addVariant(entry.term);
  addVariant(entry.shortCode);
  return Array.from(keys);
}

export function findOfflineTerminologyMatch(
  lesson: Lesson,
  question: string,
): TerminologyEntry | null {
  const trimmed = question.trim();
  if (!trimmed || trimmed.length > 120 || lesson.terminology.length === 0) {
    return null;
  }

  if (COMPLEX_QUESTION_MODIFIERS.test(trimmed)) {
    return null;
  }

  const normalizedQuestion = normalizeTerminologyText(trimmed);
  if (!normalizedQuestion) {
    return null;
  }

  const strippedPrefix = normalizedQuestion.replace(DEFINITION_PREFIX_PATTERN, '').trim();
  let subject = strippedPrefix;
  while (DEFINITION_SUFFIX_PATTERN.test(subject)) {
    subject = subject.replace(DEFINITION_SUFFIX_PATTERN, '').trim();
  }

  const hasDefinitionIntent = subject !== normalizedQuestion;
  const lookupTarget = hasDefinitionIntent ? subject : normalizedQuestion;
  if (!lookupTarget) {
    return null;
  }

  for (const entry of lesson.terminology) {
    const candidates = buildTerminologyCandidateKeys(entry);
    if (candidates.includes(lookupTarget)) {
      return entry;
    }
  }

  return null;
}

async function resolveLocalGroundedFallback(
  req: ExplainDifferentlyRequest,
): Promise<ExplainDifferentlyResponse> {
  const lesson =
    getLessonBySlug(req.lessonSlug) ?? getLessonByConceptKey(req.conceptKey);

  if (!lesson) {
    const guardActive = req.mode === 'practice' && !req.hasSubmittedAnswer;
    return {
      style: req.style,
      headline: 'TradeLab Concept Guide',
      explanation: guardActive
        ? 'Practice Mode answer protection is active: examine the candle close, structural swing levels, and risk invalidation before committing to an option.'
        : 'Review the core lesson diagram, chart scenario replay, and verified resources to strengthen your read of this market concept.',
      steps: [
        'Identify the prevailing swing structure (HH/HL or LH/LL).',
        'Mark obvious resting liquidity pools before judging a breakout.',
        'Confirm intent with candle body closes rather than mid-candle wicks.',
      ],
      keyTakeaway: 'Objective candle closes and defined invalidation beat guesswork.',
      sourceType: 'deterministic_fallback',
      isPracticeGuardActive: guardActive,
      citations: [],
    };
  }

  const publishedResources = await getPublishedLessonResources(lesson.slug);
  return buildLocalGroundedFallback(req, lesson, publishedResources);
}

export async function requestAlternativeExplanation(
  req: ExplainDifferentlyRequest,
): Promise<ExplainDifferentlyResponse> {
  const hasUserQuestion = Boolean(req.userQuestion?.trim());
  const shouldUseOnlineAi = hasUserQuestion || Boolean(req.preferOnlineAi);

  // 1. Offline-first fast path for preset explanation styles (instant, zero quota)
  if (!shouldUseOnlineAi) {
    return resolveLocalGroundedFallback(req);
  }

  // 2. Try grounded serverless Gemini endpoint when learner asks a question or requests live AI
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        const accessToken = data.session?.access_token;
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch {
        // Proceed without auth header; server or local fallback handles unauthenticated requests
      }
    }

    const response = await fetch('/api/mentor/explain-differently', {
      method: 'POST',
      headers,
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(12_000),
    });

    if (response.ok) {
      const data = (await response.json()) as ExplainDifferentlyResponse;
      if (data && typeof data.explanation === 'string' && Array.isArray(data.citations)) {
        return data;
      }
    }
  } catch {
    // Gracefully fall back to curated lesson explanation + verified published citations
  }

  // 3. Deterministic closed-world local fallback
  return resolveLocalGroundedFallback(req);
}

export async function askAIMentor(input: {
  lessonSlug: string;
  mode: AppLearningContext;
  userMessage: string;
  activeQuestionId?: string;
  hasSubmittedAnswer?: boolean;
  style?: ExplanationStyle;
  preferOnlineAi?: boolean;
}): Promise<MentorChatMessage> {
  const lesson = getLessonBySlug(input.lessonSlug);
  const conceptKey = lesson?.conceptKey ?? input.lessonSlug;
  const resolvedStyle = inferStyleFromMessage(input.userMessage, input.style);
  const practiceGuardActive = input.mode === 'practice' && !input.hasSubmittedAnswer;
  const trimmedQuestion = input.userMessage.trim();

  // Offline-first direct terminology lookup (instant, zero quota) when not in Practice Mode or live-AI override
  if (!input.preferOnlineAi && !practiceGuardActive && lesson) {
    const matchedTerm = findOfflineTerminologyMatch(lesson, trimmedQuestion);
    if (matchedTerm) {
      const publishedResources = await getPublishedLessonResources(lesson.slug);
      const citations = buildVerifiedCitationsFromPublished(publishedResources, 2);
      const termTitle = matchedTerm.shortCode
        ? `${matchedTerm.term} (${matchedTerm.shortCode})`
        : matchedTerm.term;

      const content = [
        `${termTitle} — Quick Lesson Glossary`,
        '',
        matchedTerm.definition,
        '',
        `Chart Example: ${matchedTerm.example}`,
        '',
        `Key Takeaway: ${lesson.fallbackExplanations[resolvedStyle].keyTakeaway}`,
      ].join('\n');

      return {
        id: generateMessageId(),
        role: 'assistant',
        content,
        sourceType: 'deterministic_fallback',
        style: resolvedStyle,
        citations,
        isPracticeGuardActive: false,
        createdAt: new Date().toISOString(),
      };
    }
  }

  const response = await requestAlternativeExplanation({
    lessonSlug: input.lessonSlug,
    conceptKey,
    style: resolvedStyle,
    mode: input.mode,
    userQuestion: trimmedQuestion,
    activeQuestionId: input.activeQuestionId,
    hasSubmittedAnswer: input.hasSubmittedAnswer,
    preferOnlineAi: true,
  });

  const formattedSteps =
    response.steps.length > 0
      ? `\n\n${response.steps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}`
      : '';

  const content = `${response.headline}\n\n${response.explanation}${formattedSteps}\n\nKey Takeaway: ${response.keyTakeaway}`;

  return {
    id: generateMessageId(),
    role: 'assistant',
    content,
    sourceType: response.sourceType,
    style: response.style,
    citations: response.citations,
    isPracticeGuardActive: response.isPracticeGuardActive,
    createdAt: new Date().toISOString(),
  };
}
