import type { CurriculumLevel, LessonMarketCategory } from './academy';
import type { AssetClass, BacktestDirection } from './backtest';

export interface LessonProgressRecord {
  id: string;
  userId: string;
  lessonId: string;
  lessonSlug: string;
  completed: boolean;
  completedAt: string | null;
  updatedAt: string;
}

export interface StudyProgressSummary {
  completedSlugs: string[];
  completedCount: number;
  totalLessons: number;
  percentComplete: number;
  currentStreakDays: number;
  lastStudyDate: string | null;
}

export type JournalEmotion =
  | 'calm_disciplined'
  | 'fomo'
  | 'revenge'
  | 'hesitant'
  | 'overconfident';

export type JournalTradeOutcome = 'win' | 'loss' | 'breakeven';

export interface JournalEntry {
  id: string;
  userId: string;
  tradedAt: string;
  symbol: string;
  assetClass: Exclude<AssetClass, 'custom_csv'>;
  direction: BacktestDirection;
  setupTag: string;
  entryPrice: number | null;
  exitPrice: number | null;
  pnlAmount: number;
  rMultiple: number;
  outcome: JournalTradeOutcome;
  emotion: JournalEmotion;
  followedPlan: boolean;
  screenshotUrl: string | null;
  lessonLearned: string;
  createdAt: string;
}

export interface CreateJournalEntryInput {
  tradedAt?: string;
  symbol: string;
  assetClass: Exclude<AssetClass, 'custom_csv'>;
  direction: BacktestDirection;
  setupTag: string;
  entryPrice?: number | null;
  exitPrice?: number | null;
  pnlAmount: number;
  rMultiple: number;
  emotion: JournalEmotion;
  followedPlan: boolean;
  screenshotUrl?: string | null;
  lessonLearned: string;
}

export interface EmotionStat {
  emotion: JournalEmotion;
  count: number;
  netPnl: number;
  winRate: number;
}

export interface JournalAnalytics {
  totalTrades: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number;
  netPnl: number;
  avgRMultiple: number;
  ruleAdherencePct: number;
  calmNetPnl: number;
  emotionalLeakPnl: number;
  byEmotion: EmotionStat[];
}

export interface OnboardingPreferences {
  experienceLevel: CurriculumLevel;
  preferredMarket: LessonMarketCategory | 'all';
  onboardingCompleted: boolean;
  updatedAt: string;
}

export interface PreTradeCheckItem {
  id: string;
  label: string;
  hint: string;
}
