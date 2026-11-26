import type {
  AppLearningContext,
  ExplanationStyle,
  Lesson,
  PracticeQuestion,
} from '../../src/types/academy';
import type {
  ExplainDifferentlyRequest,
  ExplainDifferentlyResponse,
  LessonResourceWithDetails,
  MentorCitation,
  SegmentVerificationMethod,
} from '../../src/types/visual-learning';
import { sanitizePlainText } from './urlSecurity';

export interface GroundedCatalogSegment {
  segmentId: string;
  startSeconds: number;
  endSeconds: number | null;
  segmentTitle: string;
  explanation: string;
  verificationMethod: SegmentVerificationMethod;
}

export interface GroundedCatalogResource {
  resourceId: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  segments: GroundedCatalogSegment[];
}

interface RawLlmCitationRef {
  resourceId?: unknown;
  segmentId?: unknown;
}

interface RawLlmPayload {
  headline?: unknown;
  explanation?: unknown;
  steps?: unknown;
  keyTakeaway?: unknown;
  citationRefs?: unknown;
}

const LLM_TIMEOUT_MS = 12_000;
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const FALLBACK_GEMINI_MODEL = 'gemini-2.0-flash';

export function isPracticeGuardActive(
  mode: AppLearningContext,
  hasSubmittedAnswer?: boolean,
): boolean {
  return mode === 'practice' && !hasSubmittedAnswer;
}

/**
 * Closed-world catalog builder: includes ONLY published educational resources
 * and their verified segments from the database/starter originals.
 */
export function buildAllowedCitationCatalog(
  resources: LessonResourceWithDetails[],
): GroundedCatalogResource[] {
  const catalog: GroundedCatalogResource[] = [];

  for (const item of resources) {
    if (item.resource.verificationStatus !== 'published') {
      continue;
    }

    catalog.push({
      resourceId: item.resource.id,
      title: item.resource.title,
      sourceName: item.resource.sourceName,
      sourceUrl: item.resource.sourceUrl,
      segments: item.segments.map((segment) => ({
        segmentId: segment.id,
        startSeconds: segment.startSeconds,
        endSeconds: segment.endSeconds,
        segmentTitle: segment.segmentTitle,
        explanation: segment.explanation,
        verificationMethod: segment.verificationMethod,
      })),
    });
  }

  return catalog;
}

/**
 * Strict closed-world citation hydration:
 * Accepts ONLY resourceId/segmentId pairs and hydrates real URLs, titles,
 * and verified timestamps strictly from the allowed catalog.
 * Unknown or hallucinated IDs are unconditionally stripped.
 */
export function hydrateVerifiedCitations(
  rawRefs: unknown,
  catalog: GroundedCatalogResource[],
): MentorCitation[] {
  if (!Array.isArray(rawRefs) || catalog.length === 0) {
    return [];
  }

  const resourceById = new Map<string, GroundedCatalogResource>(
    catalog.map((resource) => [resource.resourceId, resource]),
  );

  const hydrated: MentorCitation[] = [];
  const seenKeys = new Set<string>();

  for (const entry of rawRefs) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }

    const ref = entry as RawLlmCitationRef;
    if (typeof ref.resourceId !== 'string') {
      continue;
    }

    const resource = resourceById.get(ref.resourceId.trim());
    if (!resource) {
      continue;
    }

    let matchedSegment: GroundedCatalogSegment | undefined;
    if (typeof ref.segmentId === 'string' && ref.segmentId.trim()) {
      matchedSegment = resource.segments.find(
        (segment) => segment.segmentId === ref.segmentId?.toString().trim(),
      );
    }

    const dedupeKey = `${resource.resourceId}:${matchedSegment?.segmentId ?? ''}`;
    if (seenKeys.has(dedupeKey)) {
      continue;
    }
    seenKeys.add(dedupeKey);

    const citation: MentorCitation = {
      resourceId: resource.resourceId,
      title: resource.title,
      sourceName: resource.sourceName,
      sourceUrl: resource.sourceUrl,
    };

    if (matchedSegment) {
      citation.segmentId = matchedSegment.segmentId;
      citation.startSeconds = matchedSegment.startSeconds;
      citation.endSeconds = matchedSegment.endSeconds;
      citation.segmentTitle = matchedSegment.segmentTitle;
      citation.verificationMethod = matchedSegment.verificationMethod;
    }

    hydrated.push(citation);
  }

  return hydrated;
}

export function buildDefaultCitations(
  catalog: GroundedCatalogResource[],
  limit = 2,
): MentorCitation[] {
  const citations: MentorCitation[] = [];

  for (const resource of catalog) {
    if (citations.length >= limit) {
      break;
    }

    const firstSegment = resource.segments[0];
    if (firstSegment) {
      citations.push({
        resourceId: resource.resourceId,
        segmentId: firstSegment.segmentId,
        title: resource.title,
        sourceName: resource.sourceName,
        sourceUrl: resource.sourceUrl,
        startSeconds: firstSegment.startSeconds,
        endSeconds: firstSegment.endSeconds,
        segmentTitle: firstSegment.segmentTitle,
        verificationMethod: firstSegment.verificationMethod,
      });
    } else {
      citations.push({
        resourceId: resource.resourceId,
        title: resource.title,
        sourceName: resource.sourceName,
        sourceUrl: resource.sourceUrl,
      });
    }
  }

  return citations;
}

function findActiveQuestion(
  lesson: Lesson,
  activeQuestionId?: string,
): PracticeQuestion | undefined {
  if (!activeQuestionId) {
    return undefined;
  }
  return lesson.practiceQuestions.find((question) => question.id === activeQuestionId);
}

function buildSocraticGuidingQuestion(lesson: Lesson, activeQuestion?: PracticeQuestion): string {
  if (activeQuestion && activeQuestion.hints.length > 0) {
    return `Guiding check: ${activeQuestion.hints[0]} Which chart evidence supports your decision before locking in your answer?`;
  }
  return `Guiding check: Looking at ${lesson.title}, what objective candle close or structural level proves your thesis before you commit?`;
}

export function buildDeterministicExplanation(
  req: ExplainDifferentlyRequest,
  lesson: Lesson,
  catalog: GroundedCatalogResource[],
): ExplainDifferentlyResponse {
  const guardActive = isPracticeGuardActive(req.mode, req.hasSubmittedAnswer);
  const curated = lesson.fallbackExplanations[req.style];
  const activeQuestion = findActiveQuestion(lesson, req.activeQuestionId);
  const citations = buildDefaultCitations(catalog, 2);

  if (guardActive) {
    const guidingSteps: string[] = [
      curated.practiceSafeHint,
      ...(activeQuestion?.hints.slice(0, 2) ?? curated.steps.slice(0, 2)),
      buildSocraticGuidingQuestion(lesson, activeQuestion),
    ];

    return {
      style: req.style,
      headline: `${curated.headline} (Practice Mode — Guided Hint)`,
      explanation:
        'Practice Mode answer protection is active: I will guide your chart analysis without revealing the answer choice. ' +
        curated.practiceSafeHint,
      steps: guidingSteps,
      keyTakeaway: curated.keyTakeaway,
      sourceType: 'deterministic_fallback',
      isPracticeGuardActive: true,
      citations,
    };
  }

  const questionPrefix = req.userQuestion
    ? `Focused on your question ("${sanitizePlainText(req.userQuestion, 140)}"): `
    : '';

  return {
    style: req.style,
    headline: curated.headline,
    explanation: `${questionPrefix}${curated.summary}`,
    steps: curated.steps,
    keyTakeaway: curated.keyTakeaway,
    sourceType: 'deterministic_fallback',
    isPracticeGuardActive: false,
    citations,
  };
}

function scrubPracticeAnswerLeak(
  text: string,
  activeQuestion?: PracticeQuestion,
): string {
  let safeText = text.replace(
    /\b(?:the\s+)?correct\s+(?:answer|option|choice)\s+is\s+["']?[a-dA-D]["']?/gi,
    'focus on the chart evidence first',
  );

  if (activeQuestion) {
    const correctOption = activeQuestion.options.find(
      (opt) => opt.id === activeQuestion.correctOptionId,
    );
    if (correctOption) {
      const escapedLabel = correctOption.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      safeText = safeText.replace(
        new RegExp(escapedLabel, 'gi'),
        '[check the option that matches this structural evidence]',
      );
    }
  }

  return safeText;
}

function extractJsonObject(rawText: string): RawLlmPayload | null {
  const trimmed = rawText.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;

  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  try {
    const parsed = JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
    return parsed && typeof parsed === 'object' ? (parsed as RawLlmPayload) : null;
  } catch {
    return null;
  }
}

export function parseAndGuardLlmResponse(
  rawText: string,
  req: ExplainDifferentlyRequest,
  lesson: Lesson,
  catalog: GroundedCatalogResource[],
): ExplainDifferentlyResponse {
  const parsed = extractJsonObject(rawText);
  if (!parsed) {
    return buildDeterministicExplanation(req, lesson, catalog);
  }

  const guardActive = isPracticeGuardActive(req.mode, req.hasSubmittedAnswer);
  const activeQuestion = findActiveQuestion(lesson, req.activeQuestionId);
  const fallback = lesson.fallbackExplanations[req.style];

  const rawHeadline =
    typeof parsed.headline === 'string' && parsed.headline.trim()
      ? sanitizePlainText(parsed.headline, 160)
      : fallback.headline;

  const rawExplanation =
    typeof parsed.explanation === 'string' && parsed.explanation.trim()
      ? sanitizePlainText(parsed.explanation, 1200)
      : fallback.summary;

  const rawSteps = Array.isArray(parsed.steps)
    ? parsed.steps
        .filter((step): step is string => typeof step === 'string' && step.trim().length > 0)
        .map((step) => sanitizePlainText(step, 320))
        .slice(0, 6)
    : fallback.steps;

  const rawTakeaway =
    typeof parsed.keyTakeaway === 'string' && parsed.keyTakeaway.trim()
      ? sanitizePlainText(parsed.keyTakeaway, 320)
      : fallback.keyTakeaway;

  // Closed-world hydration: only IDs present in catalog survive!
  let citations = hydrateVerifiedCitations(parsed.citationRefs, catalog);
  if (citations.length === 0) {
    citations = buildDefaultCitations(catalog, 2);
  }

  if (guardActive) {
    const safeSteps = rawSteps.map((step) => scrubPracticeAnswerLeak(step, activeQuestion));
    safeSteps.push(buildSocraticGuidingQuestion(lesson, activeQuestion));

    return {
      style: req.style,
      headline: scrubPracticeAnswerLeak(rawHeadline, activeQuestion),
      explanation: scrubPracticeAnswerLeak(rawExplanation, activeQuestion),
      steps: safeSteps.slice(0, 6),
      keyTakeaway: scrubPracticeAnswerLeak(rawTakeaway, activeQuestion),
      sourceType: 'ai_mentor_explanation',
      isPracticeGuardActive: true,
      citations,
    };
  }

  return {
    style: req.style,
    headline: rawHeadline,
    explanation: rawExplanation,
    steps: rawSteps.length > 0 ? rawSteps : fallback.steps,
    keyTakeaway: rawTakeaway,
    sourceType: 'ai_mentor_explanation',
    isPracticeGuardActive: false,
    citations,
  };
}

function buildPrompts(
  req: ExplainDifferentlyRequest,
  lesson: Lesson,
  catalog: GroundedCatalogResource[],
): { systemPrompt: string; userPrompt: string } {
  const guardActive = isPracticeGuardActive(req.mode, req.hasSubmittedAnswer);
  const activeQuestion = findActiveQuestion(lesson, req.activeQuestionId);

  const allowedCatalogJson = JSON.stringify(
    catalog.map((resource) => ({
      resourceId: resource.resourceId,
      title: resource.title,
      sourceName: resource.sourceName,
      segments: resource.segments.map((segment) => ({
        segmentId: segment.segmentId,
        startSeconds: segment.startSeconds,
        segmentTitle: segment.segmentTitle,
      })),
    })),
  );

  const systemPrompt = [
    'You are TradeLab Academy AI Mentor, an educational trading concepts tutor.',
    'STRICT CLOSED-WORLD GROUNDING RULES:',
    '1. You may ONLY cite resources/segments from the ALLOWED_CATALOG JSON below by returning their exact resourceId and optional segmentId inside citationRefs.',
    '2. NEVER invent, guess, or mention any YouTube URL, external link, video ID, or timestamp not present in ALLOWED_CATALOG.',
    '3. Never give financial advice or trade signals; focus purely on educational chart mechanics and risk literacy.',
    guardActive
      ? '4. PRACTICE MODE ANSWER PROTECTION IS ACTIVE: The learner has NOT submitted their answer yet. NEVER reveal the correct option letter, answer choice, or direct classification. Provide conceptual guidance and end with a Socratic guiding question.'
      : '4. Give a crisp, structured educational explanation tailored to the requested explanation style.',
    '5. Respond ONLY with valid JSON matching: {"headline": string, "explanation": string, "steps": string[], "keyTakeaway": string, "citationRefs": [{"resourceId": string, "segmentId"?: string}]}.',
    `ALLOWED_CATALOG: ${allowedCatalogJson}`,
  ].join('\n');

  const userPromptParts = [
    `Lesson: ${lesson.title} (conceptKey: ${lesson.conceptKey}, level: ${lesson.level})`,
    `Requested Style: ${req.style}`,
    `Learning Context: ${req.mode}`,
    `Learning Objectives: ${lesson.learningObjectives.join(' | ')}`,
  ];

  if (req.userQuestion) {
    userPromptParts.push(`Learner Question: ${sanitizePlainText(req.userQuestion, 500)}`);
  }

  if (activeQuestion && guardActive) {
    userPromptParts.push(
      `Active Practice Prompt (DO NOT SOLVE OR REVEAL ANSWER): ${activeQuestion.prompt}`,
    );
  }

  return {
    systemPrompt,
    userPrompt: userPromptParts.join('\n'),
  };
}

async function requestGeminiModel(
  model: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.35,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function requestGeminiCompletion(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  const primaryModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const modelsToTry =
    primaryModel === FALLBACK_GEMINI_MODEL
      ? [primaryModel]
      : [primaryModel, FALLBACK_GEMINI_MODEL];

  for (const model of modelsToTry) {
    try {
      const output = await requestGeminiModel(model, apiKey, systemPrompt, userPrompt);
      if (output) {
        return output;
      }
    } catch {
      // Automatically fall back to next Gemini model
    }
  }

  return null;
}

async function requestOpenAiCompletion(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    redirect: 'error',
    signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.35,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: { content?: string };
    }>;
  };

  return data.choices?.[0]?.message?.content ?? null;
}

export async function generateGroundedExplanation(
  req: ExplainDifferentlyRequest,
  lesson: Lesson,
  publishedResources: LessonResourceWithDetails[],
): Promise<ExplainDifferentlyResponse> {
  const catalog = buildAllowedCitationCatalog(publishedResources);
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  if (!geminiKey && !openAiKey) {
    return buildDeterministicExplanation(req, lesson, catalog);
  }

  const { systemPrompt, userPrompt } = buildPrompts(req, lesson, catalog);

  try {
    let rawOutput: string | null = null;
    if (geminiKey) {
      rawOutput = await requestGeminiCompletion(geminiKey, systemPrompt, userPrompt);
    } else if (openAiKey) {
      rawOutput = await requestOpenAiCompletion(openAiKey, systemPrompt, userPrompt);
    }

    if (!rawOutput) {
      return buildDeterministicExplanation(req, lesson, catalog);
    }

    return parseAndGuardLlmResponse(rawOutput, req, lesson, catalog);
  } catch {
    return buildDeterministicExplanation(req, lesson, catalog);
  }
}

export function inferExplanationStyleFromQuestion(
  question: string,
  explicitStyle?: ExplanationStyle,
): ExplanationStyle {
  if (explicitStyle) {
    return explicitStyle;
  }

  const lower = question.toLowerCase();
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
