import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyAuthenticatedUser } from '../../api/_lib/auth';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { PreTradeChecklistCard } from '../components/learning/PreTradeChecklistCard';
import {
  computeJournalAnalytics,
  createJournalEntry,
  deleteJournalEntry,
  listJournalEntries,
} from '../services/journalService';
import {
  computeStudyProgressSummary,
  getOnboardingPreferences,
  getRecommendedNextLesson,
  listLessonProgress,
  saveOnboardingPreferences,
  toggleLessonCompleted,
} from '../services/progressService';
import type { JournalEntry, LessonProgressRecord } from '../types/learning-loop';

function buildProgressRecord(
  overrides: Partial<LessonProgressRecord> & Pick<LessonProgressRecord, 'lessonSlug'>,
): LessonProgressRecord {
  const nowIso = '2026-05-10T12:00:00.000Z';
  return {
    id: `prog-${overrides.lessonSlug}`,
    userId: 'local-preview-user',
    lessonId: `lesson-${overrides.lessonSlug}`,
    completed: true,
    completedAt: nowIso,
    updatedAt: nowIso,
    ...overrides,
  };
}

function buildJournalEntry(
  overrides: Partial<JournalEntry> & Pick<JournalEntry, 'id' | 'pnlAmount' | 'emotion'>,
): JournalEntry {
  const outcome =
    overrides.outcome ??
    (overrides.pnlAmount > 0 ? 'win' : overrides.pnlAmount < 0 ? 'loss' : 'breakeven');

  return {
    userId: 'local-preview-user',
    tradedAt: '2026-05-10T10:00:00.000Z',
    symbol: 'EUR/USD',
    assetClass: 'forex',
    direction: 'long',
    setupTag: 'BOS Retest',
    entryPrice: 1.085,
    exitPrice: 1.09,
    rMultiple: overrides.pnlAmount > 0 ? 2 : overrides.pnlAmount < 0 ? -1 : 0,
    outcome,
    followedPlan: overrides.emotion === 'calm_disciplined',
    screenshotUrl: null,
    lessonLearned: 'Wait for candle close.',
    createdAt: '2026-05-10T10:05:00.000Z',
    ...overrides,
  };
}

function CrashingChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Simulated chart rendering failure');
  }
  return <div>Safe Child Tree</div>;
}

describe('progressService — lesson completion, UTC streaks & onboarding recommendations', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('marks a lesson complete, persists it in LocalStorage, and toggles back to incomplete', async () => {
    const completedRecord = await toggleLessonCompleted('market-structure');

    expect(completedRecord.lessonSlug).toBe('market-structure');
    expect(completedRecord.completed).toBe(true);
    expect(completedRecord.completedAt).not.toBeNull();

    const storedAfterComplete = window.localStorage.getItem('tradelab_lesson_progress_v1');
    expect(storedAfterComplete).not.toBeNull();
    const parsedComplete = JSON.parse(storedAfterComplete ?? '[]') as LessonProgressRecord[];
    expect(parsedComplete).toHaveLength(1);
    expect(parsedComplete[0].completed).toBe(true);

    const listedAfterComplete = await listLessonProgress();
    expect(listedAfterComplete).toHaveLength(1);
    expect(listedAfterComplete[0].completed).toBe(true);

    const incompleteRecord = await toggleLessonCompleted('market-structure');

    expect(incompleteRecord.completed).toBe(false);
    expect(incompleteRecord.completedAt).toBeNull();

    const listedAfterUndo = await listLessonProgress();
    expect(listedAfterUndo).toHaveLength(1);
    expect(listedAfterUndo[0].completed).toBe(false);
    expect(listedAfterUndo[0].completedAt).toBeNull();
  });

  it('computes completedCount, percentComplete, and consecutive UTC-day currentStreakDays (stopping on a gap)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-10T15:00:00.000Z'));

    // Today (May 10) + Yesterday (May 9) = 2-day consecutive UTC streak;
    // May 6 has a gap before May 9 so it must NOT extend the streak.
    const records: LessonProgressRecord[] = [
      buildProgressRecord({
        lessonSlug: 'market-structure',
        completed: true,
        completedAt: '2026-05-10T08:30:00.000Z',
      }),
      buildProgressRecord({
        lessonSlug: 'supply-demand',
        completed: true,
        completedAt: '2026-05-09T23:45:00.000Z',
      }),
      buildProgressRecord({
        lessonSlug: 'risk-management',
        completed: true,
        completedAt: '2026-05-06T11:00:00.000Z',
      }),
      buildProgressRecord({
        lessonSlug: 'liquidity-sweeps',
        completed: false,
        completedAt: null,
      }),
    ];

    const summary = computeStudyProgressSummary(records, 10);

    expect(summary.completedCount).toBe(3);
    expect(summary.totalLessons).toBe(10);
    expect(summary.percentComplete).toBe(30);
    expect(summary.currentStreakDays).toBe(2);
    expect(summary.lastStudyDate).toBe('2026-05-10');

    // Broken streak: only today + 3 days ago (yesterday missing) -> 1-day streak
    const gapSummary = computeStudyProgressSummary(
      [
        buildProgressRecord({
          lessonSlug: 'market-structure',
          completedAt: '2026-05-10T09:00:00.000Z',
        }),
        buildProgressRecord({
          lessonSlug: 'supply-demand',
          completedAt: '2026-05-07T09:00:00.000Z',
        }),
      ],
      4,
    );

    expect(gapSummary.completedCount).toBe(2);
    expect(gapSummary.percentComplete).toBe(50);
    expect(gapSummary.currentStreakDays).toBe(1);
  });

  it('saves onboarding preferences, recommends a crypto lesson for preferredMarket=crypto, and skips completed lessons', async () => {
    const saved = await saveOnboardingPreferences({
      experienceLevel: 'intermediate',
      preferredMarket: 'crypto',
    });

    expect(saved.preferredMarket).toBe('crypto');
    expect(saved.experienceLevel).toBe('intermediate');
    expect(saved.onboardingCompleted).toBe(true);

    const loadedPrefs = await getOnboardingPreferences();
    expect(loadedPrefs.preferredMarket).toBe('crypto');
    expect(loadedPrefs.experienceLevel).toBe('intermediate');

    const emptySummary = computeStudyProgressSummary([]);
    const firstRec = getRecommendedNextLesson(emptySummary, loadedPrefs);
    expect(firstRec.marketCategory).toBe('crypto');

    const afterCompletingFirst = computeStudyProgressSummary([
      buildProgressRecord({ lessonSlug: firstRec.slug }),
    ]);
    const secondRec = getRecommendedNextLesson(afterCompletingFirst, loadedPrefs);
    expect(secondRec.slug).not.toBe(firstRec.slug);
  });
});

describe('journalService — validation, outcome derivation, deletion & emotional analytics', () => {
  it('validates non-empty symbol, rejects non-HTTPS screenshotUrl, derives win/loss/breakeven, and deletes entries', async () => {
    await expect(
      createJournalEntry({
        symbol: '   ',
        assetClass: 'forex',
        direction: 'long',
        setupTag: 'Sweep',
        pnlAmount: 100,
        rMultiple: 2,
        emotion: 'calm_disciplined',
        followedPlan: true,
        lessonLearned: 'Empty symbol should fail.',
      }),
    ).rejects.toThrow(/symbol is required/i);

    await expect(
      createJournalEntry({
        symbol: 'EUR/USD',
        assetClass: 'forex',
        direction: 'long',
        setupTag: 'Sweep',
        pnlAmount: 100,
        rMultiple: 2,
        emotion: 'calm_disciplined',
        followedPlan: true,
        screenshotUrl: 'http://insecure.example.com/chart.png',
        lessonLearned: 'HTTP screenshot should fail.',
      }),
    ).rejects.toThrow(/https/i);

    await expect(
      createJournalEntry({
        symbol: 'EUR/USD',
        assetClass: 'forex',
        direction: 'long',
        setupTag: 'Sweep',
        pnlAmount: 100,
        rMultiple: 2,
        emotion: 'calm_disciplined',
        followedPlan: true,
        screenshotUrl: 'javascript:alert(1)',
        lessonLearned: 'JS protocol screenshot should fail.',
      }),
    ).rejects.toThrow(/https/i);

    const winEntry = await createJournalEntry({
      symbol: '  btc/usdt ',
      assetClass: 'crypto',
      direction: 'long',
      setupTag: 'Liquidity Sweep',
      pnlAmount: 250,
      rMultiple: 2.5,
      emotion: 'calm_disciplined',
      followedPlan: true,
      screenshotUrl: 'https://charts.example.com/btc-sweep.png',
      lessonLearned: 'Clean execution.',
    });
    const lossEntry = await createJournalEntry({
      symbol: 'NAS100',
      assetClass: 'indices',
      direction: 'short',
      setupTag: 'FVG Rejection',
      pnlAmount: -120,
      rMultiple: -1,
      emotion: 'fomo',
      followedPlan: false,
      lessonLearned: 'Chased midpoint.',
    });
    const breakevenEntry = await createJournalEntry({
      symbol: 'AAPL',
      assetClass: 'stocks',
      direction: 'long',
      setupTag: 'ORB Retest',
      pnlAmount: 0,
      rMultiple: 0,
      emotion: 'calm_disciplined',
      followedPlan: true,
      lessonLearned: 'Moved stop to BE at 1R.',
    });

    expect(winEntry.symbol).toBe('BTC/USDT');
    expect(winEntry.outcome).toBe('win');
    expect(winEntry.screenshotUrl).toBe('https://charts.example.com/btc-sweep.png');
    expect(lossEntry.outcome).toBe('loss');
    expect(breakevenEntry.outcome).toBe('breakeven');

    const beforeDelete = await listJournalEntries();
    expect(beforeDelete).toHaveLength(3);

    await deleteJournalEntry(lossEntry.id);

    const afterDelete = await listJournalEntries();
    expect(afterDelete).toHaveLength(2);
    expect(afterDelete.some((entry) => entry.id === lossEntry.id)).toBe(false);
  });

  it('computes winRate, netPnl, ruleAdherencePct, calmNetPnl, and emotionalLeakPnl accurately', () => {
    const entries: JournalEntry[] = [
      buildJournalEntry({
        id: 'j-1',
        pnlAmount: 200,
        rMultiple: 2,
        emotion: 'calm_disciplined',
        followedPlan: true,
      }),
      buildJournalEntry({
        id: 'j-2',
        pnlAmount: 100,
        rMultiple: 1,
        emotion: 'calm_disciplined',
        followedPlan: true,
      }),
      buildJournalEntry({
        id: 'j-3',
        pnlAmount: -90,
        rMultiple: -0.9,
        emotion: 'fomo',
        followedPlan: false,
      }),
      buildJournalEntry({
        id: 'j-4',
        pnlAmount: -60,
        rMultiple: -0.6,
        emotion: 'revenge',
        followedPlan: false,
      }),
    ];

    const analytics = computeJournalAnalytics(entries);

    expect(analytics.totalTrades).toBe(4);
    expect(analytics.wins).toBe(2);
    expect(analytics.losses).toBe(2);
    expect(analytics.winRate).toBe(50);
    expect(analytics.netPnl).toBe(150);
    expect(analytics.ruleAdherencePct).toBe(50);
    expect(analytics.calmNetPnl).toBe(300);
    expect(analytics.emotionalLeakPnl).toBe(-150);
  });
});

describe('verifyAuthenticatedUser — server auth guard', () => {
  const originalSupabaseUrl = process.env.SUPABASE_URL;
  const originalServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  afterEach(() => {
    if (originalSupabaseUrl === undefined) {
      delete process.env.SUPABASE_URL;
    } else {
      process.env.SUPABASE_URL = originalSupabaseUrl;
    }

    if (originalServiceKey === undefined) {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceKey;
    }
  });

  it('returns authorized=true with mode=unconfigured when Supabase server env vars are unset', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const result = await verifyAuthenticatedUser({ headers: {} });

    expect(result).toEqual({
      authorized: true,
      mode: 'unconfigured',
      statusCode: 200,
    });
  });

  it('rejects requests missing a Bearer token with 401 when Supabase server env vars are configured', async () => {
    process.env.SUPABASE_URL = 'https://example-project.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

    const result = await verifyAuthenticatedUser({ headers: {} });

    expect(result.authorized).toBe(false);
    expect(result.mode).toBe('supabase');
    expect(result.statusCode).toBe(401);
  });
});

describe('Learning Loop UI integration — PreTradeChecklistCard & ErrorBoundary', () => {
  it('displays "Ready to Execute" after checking all 5 PreTradeChecklistCard items and clears cleanly on Reset', async () => {
    const user = userEvent.setup();
    render(<PreTradeChecklistCard />);

    // Wait for initial contextual quote effect to settle cleanly
    await waitFor(() => {
      expect(screen.getByText('Pre-Trade Discipline Check')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(5);
    expect(screen.queryByText('Ready to Execute')).not.toBeInTheDocument();

    const resetButton = screen.getByRole('button', { name: /Reset/i });
    expect(resetButton).toBeDisabled();

    for (const checkbox of checkboxes) {
      await user.click(checkbox);
    }

    expect(screen.getByText('Ready to Execute')).toBeInTheDocument();
    expect(screen.getByText('5/5')).toBeInTheDocument();
    expect(resetButton).toBeEnabled();

    await user.click(resetButton);

    expect(screen.queryByText('Ready to Execute')).not.toBeInTheDocument();
    expect(screen.getByText('0/5')).toBeInTheDocument();
    expect(resetButton).toBeDisabled();
    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    }
  });

  it('catches a thrown child error inside ErrorBoundary and renders the recovery UI', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      render(
        <ErrorBoundary>
          <CrashingChild shouldThrow />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Simulated chart rendering failure')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reload/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Go to Dashboard/i })).toBeInTheDocument();
      expect(screen.queryByText('Safe Child Tree')).not.toBeInTheDocument();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
