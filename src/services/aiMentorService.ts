import type {
  AppLearningContext,
  ExplanationStyle,
  Lesson,
} from '../types/academy';
import type {
  ExplainDifferentlyRequest,
  ExplainDifferentlyResponse,
  LessonResourceWithDetails,
  MentorChatMessage,
  MentorCitation,
} from '../types/visual-learning';
import { getLessonByConceptKey, getLessonBySlug } from '../data/curriculum';
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

export async function requestAlternativeExplanation(
  req: ExplainDifferentlyRequest,
): Promise<ExplainDifferentlyResponse> {
  // 1. Try grounded serverless AI endpoint first
  try {
    const response = await fetch('/api/mentor/explain-differently', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  // 2. Deterministic closed-world local fallback
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

export async function askAIMentor(input: {
  lessonSlug: string;
  mode: AppLearningContext;
  userMessage: string;
  activeQuestionId?: string;
  hasSubmittedAnswer?: boolean;
  style?: ExplanationStyle;
}): Promise<MentorChatMessage> {
  const lesson = getLessonBySlug(input.lessonSlug);
  const conceptKey = lesson?.conceptKey ?? input.lessonSlug;
  const resolvedStyle = inferStyleFromMessage(input.userMessage, input.style);

  const response = await requestAlternativeExplanation({
    lessonSlug: input.lessonSlug,
    conceptKey,
    style: resolvedStyle,
    mode: input.mode,
    userQuestion: input.userMessage.trim(),
    activeQuestionId: input.activeQuestionId,
    hasSubmittedAnswer: input.hasSubmittedAnswer,
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
