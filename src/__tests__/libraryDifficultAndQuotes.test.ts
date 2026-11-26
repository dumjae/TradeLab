import { describe, expect, it } from 'vitest';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { STARTER_QUOTES } from '../data/starterQuotes';
import {
  addVerifiedSegment,
  createAdminResource,
  updateResourceStatus,
} from '../services/adminResourcesService';
import {
  listDifficultConcepts,
  markConceptMastered,
  recordConceptCorrectAttempt,
  recordConceptStruggle,
  reopenDifficultConcept,
} from '../services/difficultConceptsService';
import {
  listLearningHistory,
  listSavedResources,
  recordLearningProgress,
  removeSavedResource,
  saveResourceBookmark,
  updateSavedResourceNotes,
} from '../services/personalLibraryService';
import {
  createCustomQuote,
  deleteCustomQuote,
  getDailyQuote,
  listQuotes,
  toggleFavoriteQuote,
  togglePinQuote,
  updateQuoteReflection,
} from '../services/quotesService';
import { getPublishedLessonResources } from '../services/visualResourcesService';

const LESSON = CURRICULUM_LESSONS[0]; // market-structure

describe('personalLibraryService — bookmarks, notes & learning history', () => {
  it('saves a video bookmark with timestamp and notes, edits the note, tracks progress/resume, and removes it', async () => {
    const saved = await saveResourceBookmark({
      resourceId: 'res-yt-101',
      lessonId: LESSON.id,
      lessonSlug: LESSON.slug,
      savedTimestampSeconds: 142,
      savedSegmentId: 'seg-101',
      curriculumLevel: 'beginner',
      personalNotes: 'Wait for candle body close above prior swing high.',
    });

    expect(saved.savedTimestampSeconds).toBe(142);
    expect(saved.personalNotes).toBe('Wait for candle body close above prior swing high.');

    const listed = await listSavedResources();
    expect(listed).toHaveLength(1);
    expect(listed[0].id).toBe(saved.id);

    const edited = await updateSavedResourceNotes(
      saved.id,
      'Confirmed: never enter on wick-only sweep.',
    );
    expect(edited?.personalNotes).toBe('Confirmed: never enter on wick-only sweep.');

    // Record mid-video resume progress, then update to watched
    const inProgress = await recordLearningProgress({
      resourceId: 'res-yt-101',
      lessonId: LESSON.id,
      lessonSlug: LESSON.slug,
      lastPositionSeconds: 215,
      completionStatus: 'in_progress',
    });
    expect(inProgress.lastPositionSeconds).toBe(215);
    expect(inProgress.completionStatus).toBe('in_progress');

    let history = await listLearningHistory();
    expect(history).toHaveLength(1);
    expect(history[0].lastPositionSeconds).toBe(215);

    await recordLearningProgress({
      resourceId: 'res-yt-101',
      lessonId: LESSON.id,
      lessonSlug: LESSON.slug,
      lastPositionSeconds: 480,
      completionStatus: 'watched',
    });
    history = await listLearningHistory();
    expect(history).toHaveLength(1);
    expect(history[0].lastPositionSeconds).toBe(480);
    expect(history[0].completionStatus).toBe('watched');

    // Remove saved bookmark
    await removeSavedResource(saved.id);
    expect(await listSavedResources()).toHaveLength(0);
  });
});

describe('difficultConceptsService — triggers, mistake threshold & mastery workflow', () => {
  it('immediately adds concepts triggered by explain_differently or manual_bookmark', async () => {
    const explainTrigger = await recordConceptStruggle({
      lessonId: LESSON.id,
      lessonSlug: LESSON.slug,
      conceptKey: 'market-structure',
      conceptLabel: 'Market Structure Basics',
      trigger: 'explain_differently',
    });
    expect(explainTrigger).not.toBeNull();
    expect(explainTrigger?.triggerSources).toContain('explain_differently');

    const bookmarkTrigger = await recordConceptStruggle({
      lessonId: CURRICULUM_LESSONS[1].id,
      lessonSlug: CURRICULUM_LESSONS[1].slug,
      conceptKey: CURRICULUM_LESSONS[1].conceptKey,
      conceptLabel: CURRICULUM_LESSONS[1].title,
      trigger: 'manual_bookmark',
    });
    expect(bookmarkTrigger).not.toBeNull();
    expect(bookmarkTrigger?.triggerSources).toContain('manual_bookmark');

    const active = await listDifficultConcepts();
    expect(active).toHaveLength(2);
  });

  it('requires >= 2 practice_mistake events, suggests mastery at 3 consecutive correct answers, and supports manual mastery', async () => {
    const targetLesson = CURRICULUM_LESSONS[2]; // liquidity-sweeps

    // Mistake #1: tracked internally but NOT yet qualified
    const firstMistake = await recordConceptStruggle({
      lessonId: targetLesson.id,
      lessonSlug: targetLesson.slug,
      conceptKey: targetLesson.conceptKey,
      conceptLabel: targetLesson.title,
      trigger: 'practice_mistake',
    });
    expect(firstMistake).toBeNull();
    expect(await listDifficultConcepts()).toHaveLength(0);

    // Mistake #2: crosses threshold (>= 2) -> qualified!
    const secondMistake = await recordConceptStruggle({
      lessonId: targetLesson.id,
      lessonSlug: targetLesson.slug,
      conceptKey: targetLesson.conceptKey,
      conceptLabel: targetLesson.title,
      trigger: 'practice_mistake',
    });
    expect(secondMistake).not.toBeNull();
    expect(secondMistake?.mistakeCount).toBe(2);

    const active = await listDifficultConcepts();
    expect(active).toHaveLength(1);

    // 3 consecutive correct attempts -> suggest mastery only on attempt 3
    const streak1 = await recordConceptCorrectAttempt(targetLesson.slug, targetLesson.conceptKey);
    expect(streak1.suggestMastery).toBe(false);
    expect(streak1.concept?.consecutiveCorrect).toBe(1);

    const streak2 = await recordConceptCorrectAttempt(targetLesson.slug, targetLesson.conceptKey);
    expect(streak2.suggestMastery).toBe(false);
    expect(streak2.concept?.consecutiveCorrect).toBe(2);

    const streak3 = await recordConceptCorrectAttempt(targetLesson.slug, targetLesson.conceptKey);
    expect(streak3.suggestMastery).toBe(true);
    expect(streak3.concept?.consecutiveCorrect).toBe(3);
    expect(streak3.concept?.isMastered).toBe(false);

    // Manual mastery marks concept mastered and hides it from active list
    await markConceptMastered(secondMistake!.id);
    expect(await listDifficultConcepts(false)).toHaveLength(0);

    const withMastered = await listDifficultConcepts(true);
    expect(withMastered).toHaveLength(1);
    expect(withMastered[0].isMastered).toBe(true);
    expect(withMastered[0].masteredAt).not.toBeNull();

    // Reopen brings it back into active list
    await reopenDifficultConcept(secondMistake!.id);
    const reopened = await listDifficultConcepts(false);
    expect(reopened).toHaveLength(1);
    expect(reopened[0].isMastered).toBe(false);
    expect(reopened[0].consecutiveCorrect).toBe(0);
  });
});

describe('adminResourcesService + visualResourcesService — verification & publish workflow', () => {
  it('hides pending_review resources from learners until admin adds verified segment and publishes', async () => {
    const created = await createAdminResource({
      lessonId: LESSON.id,
      lessonSlug: LESSON.slug,
      title: 'Curated YouTube BOS Walkthrough',
      description: 'Clean explanation of swing highs, swing lows, and confirmed candle-body BOS.',
      sourceType: 'youtube',
      sourceName: 'Verified Market Educator',
      sourceUrl: 'https://www.youtube.com/watch?v=abcDEF_1234',
      externalVideoId: 'abcDEF_1234',
      thumbnailUrl: 'https://i.ytimg.com/vi/abcDEF_1234/hqdefault.jpg',
      durationSeconds: 520,
      contentType: 'video',
      attribution: 'Video by Verified Market Educator on YouTube.',
      verificationStatus: 'pending_review',
      embeddable: true,
    });

    expect(created.resource.verificationStatus).toBe('pending_review');

    // Must NOT appear in published learner query while pending_review
    const beforePublish = await getPublishedLessonResources(LESSON.slug);
    expect(beforePublish.some((item) => item.resource.id === created.resource.id)).toBe(false);

    // Admin adds a verified timestamp segment
    const addedSegment = await addVerifiedSegment({
      resourceId: created.resource.id,
      startSeconds: 110,
      endSeconds: 205,
      segmentTitle: 'Body Close vs Wick Sweep',
      explanation: 'Demonstrates why a candle body close confirms BOS.',
      verificationMethod: 'manual_editorial',
    });
    expect(addedSegment.startSeconds).toBe(110);
    expect(addedSegment.endSeconds).toBe(205);

    // Still unpublished before status flip
    const stillUnpublished = await getPublishedLessonResources(LESSON.slug);
    expect(stillUnpublished.some((item) => item.resource.id === created.resource.id)).toBe(false);

    // Admin publishes resource
    const publishedResource = await updateResourceStatus({
      resourceId: created.resource.id,
      verificationStatus: 'published',
      qualityScore: 94,
    });
    expect(publishedResource?.verificationStatus).toBe('published');

    // Now visible to learners WITH the verified segment attached
    const afterPublish = await getPublishedLessonResources(LESSON.slug);
    const match = afterPublish.find((item) => item.resource.id === created.resource.id);
    expect(match).toBeDefined();
    expect(match?.segments).toHaveLength(1);
    expect(match?.segments[0].segmentTitle).toBe('Body Close vs Wick Sweep');
    expect(match?.segments[0].startSeconds).toBe(110);
    expect(match?.segments[0].verificationMethod).toBe('manual_editorial');
  });
});

describe('quotesService — 39 starter quotes, attribution separation, filters & custom mantras', () => {
  it('ships 39 starter quotes split across motivate/teach/inspire with clean verified vs tradelab_principle separation', async () => {
    expect(STARTER_QUOTES).toHaveLength(39);

    const allQuotes = await listQuotes();
    expect(allQuotes).toHaveLength(39);

    const motivate = await listQuotes({ category: 'motivate' });
    const teach = await listQuotes({ category: 'teach' });
    const inspire = await listQuotes({ category: 'inspire' });

    expect(motivate).toHaveLength(13);
    expect(teach).toHaveLength(13);
    expect(inspire).toHaveLength(13);

    const verified = await listQuotes({ sourceType: 'verified_trader' });
    const principles = await listQuotes({ sourceType: 'tradelab_principle' });

    expect(verified.length).toBeGreaterThan(0);
    expect(principles.length).toBeGreaterThan(0);
    expect(verified.length + principles.length).toBe(39);
    expect(verified.every((q) => q.author !== 'TradeLab Academy')).toBe(true);
    expect(principles.every((q) => q.author === 'TradeLab Academy')).toBe(true);

    // Language filtering
    const englishQuotes = await listQuotes({ language: 'en' });
    const taglishQuotes = await listQuotes({ language: 'taglish' });
    expect(englishQuotes.length).toBeGreaterThan(0);
    expect(taglishQuotes.length).toBeGreaterThan(0);
    expect(englishQuotes.length + taglishQuotes.length).toBe(39);
  });

  it('supports favorite/pin toggles, reflections, and custom user mantra creation & deletion', async () => {
    const targetQuote = STARTER_QUOTES[0];

    const isFav = await toggleFavoriteQuote(targetQuote.id);
    expect(isFav).toBe(true);

    const favOnly = await listQuotes({ favoritesOnly: true });
    expect(favOnly.some((q) => q.id === targetQuote.id)).toBe(true);

    const isPinned = await togglePinQuote(targetQuote.id);
    expect(isPinned).toBe(true);

    // Pinned quote surfaces first in daily quote
    const daily = await getDailyQuote();
    expect(daily.id).toBe(targetQuote.id);

    await updateQuoteReflection(targetQuote.id, 'Always size at 0.5% risk during London open.');
    const refreshed = await listQuotes({ favoritesOnly: true });
    expect(refreshed.find((q) => q.id === targetQuote.id)?.personalReflection).toBe(
      'Always size at 0.5% risk during London open.',
    );

    // Create custom user mantra
    const custom = await createCustomQuote({
      quoteText: 'No confirmed displacement after the sweep, no entry.',
      author: 'My Desk Rule',
      category: 'teach',
      language: 'en',
      tradingLessonNote: 'Keeps me out of premature counter-trend entries.',
      relatedConcepts: ['liquidity-sweeps'],
    });

    expect(custom.sourceType).toBe('user_custom');
    expect(custom.isPublic).toBe(false);

    const afterCreate = await listQuotes({ category: 'teach' });
    expect(afterCreate.some((q) => q.id === custom.id)).toBe(true);

    // Delete custom mantra
    await deleteCustomQuote(custom.id);
    const afterDelete = await listQuotes({ category: 'teach' });
    expect(afterDelete.some((q) => q.id === custom.id)).toBe(false);
    expect(afterDelete).toHaveLength(13);
  });
});
