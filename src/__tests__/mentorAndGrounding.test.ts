import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildAllowedCitationCatalog,
  generateGroundedExplanation,
  hydrateVerifiedCitations,
  parseAndGuardLlmResponse,
} from '../../api/_lib/mentorGrounding';
import { CURRICULUM_LESSONS, EXPLANATION_STYLE_LIST } from '../data/curriculum';
import {
  askAIMentor,
  findOfflineTerminologyMatch,
  requestAlternativeExplanation,
} from '../services/aiMentorService';
import type { LessonResourceWithDetails } from '../types/visual-learning';

const SAMPLE_LESSON = CURRICULUM_LESSONS[0]; // market-structure
const SAMPLE_QUESTION = SAMPLE_LESSON.practiceQuestions[0];

const VERIFIED_PUBLISHED_RESOURCE: LessonResourceWithDetails = {
  mapping: {
    id: 'map-verified-1',
    lessonId: SAMPLE_LESSON.id,
    lessonSlug: SAMPLE_LESSON.slug,
    resourceId: 'res-verified-1',
    relevanceScore: 96,
    displayOrder: 1,
    beforeWatchContext: 'Watch for decisive candle-body closes beyond prior swing highs.',
    afterWatchTakeaways: ['Confirm BOS with a body close, not a wick.'],
    editorialNotes: 'Verified for market-structure lesson.',
  },
  resource: {
    id: 'res-verified-1',
    title: 'Market Structure & BOS Explained',
    description: 'Step-by-step guide to HH/HL, LH/LL, and Break of Structure.',
    sourceType: 'youtube',
    sourceName: 'Verified Trading Educator',
    sourceUrl: 'https://www.youtube.com/watch?v=abcDEF_1234',
    externalVideoId: 'abcDEF_1234',
    thumbnailUrl: 'https://i.ytimg.com/vi/abcDEF_1234/hqdefault.jpg',
    durationSeconds: 480,
    contentType: 'video',
    licenseStatus: 'standard_embed_only',
    attribution: 'Video by Verified Trading Educator on YouTube.',
    nonEndorsementNotice: true,
    verificationStatus: 'published',
    qualityScore: 95,
    embeddable: true,
    lastCheckedAt: '2026-01-10T00:00:00.000Z',
    createdBy: null,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  segments: [
    {
      id: 'seg-verified-1',
      resourceId: 'res-verified-1',
      startSeconds: 95,
      endSeconds: 180,
      segmentTitle: 'Confirmed Candle-Body BOS',
      explanation: 'Shows the exact close above the previous swing high.',
      verificationMethod: 'youtube_chapters',
      verifiedBy: 'admin-1',
      verifiedAt: '2026-01-10T00:00:00.000Z',
    },
  ],
};

const PENDING_UNPUBLISHED_RESOURCE: LessonResourceWithDetails = {
  ...VERIFIED_PUBLISHED_RESOURCE,
  mapping: {
    ...VERIFIED_PUBLISHED_RESOURCE.mapping,
    id: 'map-pending-2',
    resourceId: 'res-pending-2',
  },
  resource: {
    ...VERIFIED_PUBLISHED_RESOURCE.resource,
    id: 'res-pending-2',
    title: 'Pending Unverified Draft',
    verificationStatus: 'pending_review',
  },
  segments: [],
};

describe('api/_lib/mentorGrounding — closed-world citations & Practice Mode guard', () => {
  const originalGeminiKey = process.env.GEMINI_API_KEY;
  const originalOpenAiKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;
  });

  afterEach(() => {
    if (originalGeminiKey !== undefined) {
      process.env.GEMINI_API_KEY = originalGeminiKey;
    } else {
      delete process.env.GEMINI_API_KEY;
    }
    if (originalOpenAiKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    } else {
      delete process.env.OPENAI_API_KEY;
    }
    vi.restoreAllMocks();
  });

  it('builds a closed-world catalog containing only published resources and strips hallucinated citations', () => {
    const catalog = buildAllowedCitationCatalog([
      VERIFIED_PUBLISHED_RESOURCE,
      PENDING_UNPUBLISHED_RESOURCE,
    ]);

    expect(catalog).toHaveLength(1);
    expect(catalog[0].resourceId).toBe('res-verified-1');

    const hydrated = hydrateVerifiedCitations(
      [
        { resourceId: 'hallucinated-id-999', segmentId: 'fake-seg' },
        { resourceId: 'res-pending-2' },
        { resourceId: 'res-verified-1', segmentId: 'seg-verified-1' },
        { resourceId: 'res-verified-1', segmentId: 'seg-verified-1' }, // duplicate
      ],
      catalog,
    );

    expect(hydrated).toHaveLength(1);
    expect(hydrated[0]).toEqual({
      resourceId: 'res-verified-1',
      segmentId: 'seg-verified-1',
      title: 'Market Structure & BOS Explained',
      sourceName: 'Verified Trading Educator',
      sourceUrl: 'https://www.youtube.com/watch?v=abcDEF_1234',
      startSeconds: 95,
      endSeconds: 180,
      segmentTitle: 'Confirmed Candle-Body BOS',
      verificationMethod: 'youtube_chapters',
    });
  });

  it('strips hallucinated resourceIds from LLM output and scrubs leaked answers in Practice Mode', () => {
    const catalog = buildAllowedCitationCatalog([VERIFIED_PUBLISHED_RESOURCE]);
    const correctOption = SAMPLE_QUESTION.options.find(
      (opt) => opt.id === SAMPLE_QUESTION.correctOptionId,
    )!;

    const rawLlmJson = JSON.stringify({
      headline: 'Check the BOS Candle Close',
      explanation: `The correct answer is B and specifically ${correctOption.label}.`,
      steps: ['Look at the last swing high.', 'Check whether the candle body closed above it.'],
      keyTakeaway: 'Wait for a confirmed body close.',
      citationRefs: [
        { resourceId: 'fake-youtube-999', segmentId: 'fake-seg-1' },
        { resourceId: 'res-verified-1', segmentId: 'seg-verified-1' },
      ],
    });

    const guarded = parseAndGuardLlmResponse(
      rawLlmJson,
      {
        lessonSlug: SAMPLE_LESSON.slug,
        conceptKey: SAMPLE_LESSON.conceptKey,
        style: 'step_by_step_visual',
        mode: 'practice',
        activeQuestionId: SAMPLE_QUESTION.id,
        hasSubmittedAnswer: false,
      },
      SAMPLE_LESSON,
      catalog,
    );

    expect(guarded.isPracticeGuardActive).toBe(true);
    expect(guarded.explanation).not.toMatch(/the correct answer is B/i);
    expect(guarded.explanation).not.toContain(correctOption.label);
    expect(guarded.citations).toHaveLength(1);
    expect(guarded.citations[0].resourceId).toBe('res-verified-1');
    expect(guarded.citations[0].startSeconds).toBe(95);
  });

  it('generates grounded deterministic explanations when no LLM API keys are configured', async () => {
    const response = await generateGroundedExplanation(
      {
        lessonSlug: SAMPLE_LESSON.slug,
        conceptKey: SAMPLE_LESSON.conceptKey,
        style: 'beginner_friendly',
        mode: 'lesson',
      },
      SAMPLE_LESSON,
      [VERIFIED_PUBLISHED_RESOURCE, PENDING_UNPUBLISHED_RESOURCE],
    );

    expect(response.sourceType).toBe('deterministic_fallback');
    expect(response.isPracticeGuardActive).toBe(false);
    expect(response.citations).toHaveLength(1);
    expect(response.citations[0].resourceId).toBe('res-verified-1');
  });
});

describe('aiMentorService — 6 explanation styles & Practice Mode guard', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Offline test mode'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('supports all 6 explanation styles in offline deterministic mode with grounded citations', async () => {
    expect(EXPLANATION_STYLE_LIST).toHaveLength(6);

    for (const styleMeta of EXPLANATION_STYLE_LIST) {
      const result = await requestAlternativeExplanation({
        lessonSlug: SAMPLE_LESSON.slug,
        conceptKey: SAMPLE_LESSON.conceptKey,
        style: styleMeta.id,
        mode: 'lesson',
      });

      expect(result.style).toBe(styleMeta.id);
      expect(result.sourceType).toBe('deterministic_fallback');
      expect(result.isPracticeGuardActive).toBe(false);
      expect(result.headline.length).toBeGreaterThan(5);
      expect(result.explanation.length).toBeGreaterThan(20);
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.keyTakeaway.length).toBeGreaterThan(5);
      expect(Array.isArray(result.citations)).toBe(true);
      expect(result.citations.length).toBeGreaterThan(0);
    }
  });

  it('enforces Practice Mode answer guard before submission and unlocks full rationale after submission', async () => {
    const correctOption = SAMPLE_QUESTION.options.find(
      (opt) => opt.id === SAMPLE_QUESTION.correctOptionId,
    )!;

    // Pre-submission: guard MUST be active and NOT reveal the answer
    const preSubmit = await requestAlternativeExplanation({
      lessonSlug: SAMPLE_LESSON.slug,
      conceptKey: SAMPLE_LESSON.conceptKey,
      style: 'beginner_friendly',
      mode: 'practice',
      activeQuestionId: SAMPLE_QUESTION.id,
      hasSubmittedAnswer: false,
    });

    expect(preSubmit.isPracticeGuardActive).toBe(true);
    expect(preSubmit.explanation.toLowerCase()).toContain('practice mode');
    expect(preSubmit.explanation).not.toContain(correctOption.label);
    expect(preSubmit.steps.join(' ')).not.toContain(correctOption.label);
    expect(preSubmit.steps.some((step) => step.toLowerCase().includes('guiding check'))).toBe(true);

    // Post-submission: guard unlocks and returns full lesson rationale
    const postSubmit = await requestAlternativeExplanation({
      lessonSlug: SAMPLE_LESSON.slug,
      conceptKey: SAMPLE_LESSON.conceptKey,
      style: 'beginner_friendly',
      mode: 'practice',
      activeQuestionId: SAMPLE_QUESTION.id,
      hasSubmittedAnswer: true,
    });

    expect(postSubmit.isPracticeGuardActive).toBe(false);
    expect(postSubmit.headline).toBe(SAMPLE_LESSON.fallbackExplanations.beginner_friendly.headline);
    expect(postSubmit.explanation).toBe(SAMPLE_LESSON.fallbackExplanations.beginner_friendly.summary);
  });

  it('routes askAIMentor questions to the matching style and honors Practice Mode guard', async () => {
    const preSubmitMsg = await askAIMentor({
      lessonSlug: SAMPLE_LESSON.slug,
      mode: 'practice',
      userMessage: 'What common mistakes or fakeout traps should I avoid here?',
      activeQuestionId: SAMPLE_QUESTION.id,
      hasSubmittedAnswer: false,
    });

    expect(preSubmitMsg.role).toBe('assistant');
    expect(preSubmitMsg.style).toBe('common_mistakes');
    expect(preSubmitMsg.isPracticeGuardActive).toBe(true);
    expect(preSubmitMsg.content).toContain('Key Takeaway:');

    const postSubmitMsg = await askAIMentor({
      lessonSlug: SAMPLE_LESSON.slug,
      mode: 'practice',
      userMessage: 'Can you compare this setup versus a simple range?',
      activeQuestionId: SAMPLE_QUESTION.id,
      hasSubmittedAnswer: true,
    });

    expect(postSubmitMsg.style).toBe('comparison');
    expect(postSubmitMsg.isPracticeGuardActive).toBe(false);
  });
});

describe('aiMentorService — offline terminology lookup & hybrid AI routing', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('matches direct lesson terminology definitions offline and ignores complex analytical questions', () => {
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, 'Break of Structure')?.shortCode).toBe('BOS');
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, 'BOS')?.term).toBe('Break of Structure');
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, 'What is BOS?')?.term).toBe(
      'Break of Structure',
    );
    expect(
      findOfflineTerminologyMatch(SAMPLE_LESSON, 'What does Protected Swing mean in this lesson?')
        ?.term,
    ).toBe('Protected Swing');
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, 'Define HH')?.shortCode).toBe('HH / HL');
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, 'Higher High')?.shortCode).toBe('HH / HL');

    // Complex/open-ended analytical questions must NOT match offline glossary
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, 'BOS vs liquidity sweep')).toBeNull();
    expect(
      findOfflineTerminologyMatch(SAMPLE_LESSON, 'How do I plan an entry on Break of Structure?'),
    ).toBeNull();
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, 'What mistake causes BOS traps?')).toBeNull();
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, 'What is an unknown term?')).toBeNull();
    expect(findOfflineTerminologyMatch(SAMPLE_LESSON, '')).toBeNull();
  });

  it('resolves preset explanation styles offline without calling fetch when preferOnlineAi is unset', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await requestAlternativeExplanation({
      lessonSlug: SAMPLE_LESSON.slug,
      conceptKey: SAMPLE_LESSON.conceptKey,
      style: 'analogy_based',
      mode: 'lesson',
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.sourceType).toBe('deterministic_fallback');
    expect(result.style).toBe('analogy_based');
    expect(result.headline).toBe(SAMPLE_LESSON.fallbackExplanations.analogy_based.headline);
    expect(result.citations.length).toBeGreaterThan(0);
  });

  it('resolves simple glossary lookups in askAIMentor offline without calling fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const reply = await askAIMentor({
      lessonSlug: SAMPLE_LESSON.slug,
      mode: 'lesson',
      userMessage: 'What is BOS?',
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(reply.sourceType).toBe('deterministic_fallback');
    expect(reply.content).toContain('Break of Structure (BOS) — Quick Lesson Glossary');
    expect(reply.citations.length).toBeGreaterThan(0);
  });

  it('calls /api/mentor/explain-differently for custom open-ended questions and falls back cleanly offline when unreachable', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('Network unreachable'));

    const reply = await askAIMentor({
      lessonSlug: SAMPLE_LESSON.slug,
      mode: 'lesson',
      userMessage: 'Why did price sweep the prior high before forming a valid BOS?',
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0]?.[0]).toBe('/api/mentor/explain-differently');
    expect(reply.sourceType).toBe('deterministic_fallback');
    expect(reply.isPracticeGuardActive).toBe(false);
    expect(reply.content).toContain('Key Takeaway:');
    expect(reply.citations.length).toBeGreaterThan(0);
  });

  it('uses the online Gemini mentor response when preferOnlineAi is true and /api/mentor/explain-differently succeeds', async () => {
    const onlinePayload = {
      style: 'step_by_step_visual' as const,
      headline: 'Live Gemini BOS Walkthrough',
      explanation: 'Wait for a full candle body close above the structural swing high.',
      steps: ['Mark the last swing high.', 'Confirm the candle closes cleanly above it.'],
      keyTakeaway: 'Candle closes confirm structure; wicks sweep liquidity.',
      sourceType: 'llm_grounded' as const,
      isPracticeGuardActive: false,
      citations: [],
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(onlinePayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await requestAlternativeExplanation({
      lessonSlug: SAMPLE_LESSON.slug,
      conceptKey: SAMPLE_LESSON.conceptKey,
      style: 'step_by_step_visual',
      mode: 'lesson',
      preferOnlineAi: true,
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0]?.[0]).toBe('/api/mentor/explain-differently');
    expect(result).toEqual(onlinePayload);
  });
});
