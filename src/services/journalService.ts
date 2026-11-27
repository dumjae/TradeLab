import type {
  CreateJournalEntryInput,
  EmotionStat,
  JournalAnalytics,
  JournalEmotion,
  JournalEntry,
  JournalTradeOutcome,
} from '../types/learning-loop';
import {
  getActiveUserId,
  getAuthenticatedSupabaseUserId,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

const JOURNAL_ENTRIES_KEY = 'tradelab_journal_entries_v1';

export const JOURNAL_EMOTIONS: Array<{
  id: JournalEmotion;
  label: string;
  isDisciplined: boolean;
}> = [
  { id: 'calm_disciplined', label: 'Calm & Disciplined', isDisciplined: true },
  { id: 'fomo', label: 'FOMO (Chasing)', isDisciplined: false },
  { id: 'revenge', label: 'Revenge Trading', isDisciplined: false },
  { id: 'hesitant', label: 'Hesitant / Fearful', isDisciplined: false },
  { id: 'overconfident', label: 'Overconfident / Euphoric', isDisciplined: false },
];

const VALID_EMOTIONS: ReadonlySet<JournalEmotion> = new Set(
  JOURNAL_EMOTIONS.map((item) => item.id),
);

interface DbJournalEntryRow {
  id: string;
  user_id: string;
  traded_at: string;
  symbol: string;
  asset_class: JournalEntry['assetClass'];
  direction: JournalEntry['direction'];
  setup_tag: string;
  entry_price: number | string | null;
  exit_price: number | string | null;
  pnl_amount: number | string;
  r_multiple: number | string;
  outcome: JournalTradeOutcome;
  emotion: JournalEmotion;
  followed_plan: boolean;
  screenshot_url: string | null;
  lesson_learned: string;
  created_at: string;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `journal-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function round2(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function deriveOutcome(pnlAmount: number): JournalTradeOutcome {
  if (pnlAmount > 0) {
    return 'win';
  }
  if (pnlAmount < 0) {
    return 'loss';
  }
  return 'breakeven';
}

function validateScreenshotUrl(raw?: string | null): string | null {
  if (raw === undefined || raw === null) {
    return null;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Screenshot URL must be a valid HTTPS URL.');
  }

  if (parsed.protocol !== 'https:' || !parsed.hostname) {
    throw new Error('Screenshot URL must use HTTPS.');
  }

  return trimmed;
}

function parseOptionalPrice(value: number | null | undefined, fieldLabel: string): number | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(`${fieldLabel} must be a valid non-negative number.`);
  }
  return value;
}

function readLocalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(JOURNAL_ENTRIES_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function writeLocalEntries(entries: JournalEntry[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // Ignore storage quota errors
  }
}

function sortNewestFirst(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => {
    const timeDiff = Date.parse(b.tradedAt) - Date.parse(a.tradedAt);
    if (Number.isFinite(timeDiff) && timeDiff !== 0) {
      return timeDiff;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
}

function mapJournalRow(row: DbJournalEntryRow): JournalEntry {
  return {
    id: row.id,
    userId: row.user_id,
    tradedAt: row.traded_at,
    symbol: row.symbol,
    assetClass: row.asset_class,
    direction: row.direction,
    setupTag: row.setup_tag ?? '',
    entryPrice: row.entry_price !== null ? Number(row.entry_price) : null,
    exitPrice: row.exit_price !== null ? Number(row.exit_price) : null,
    pnlAmount: Number(row.pnl_amount),
    rMultiple: Number(row.r_multiple),
    outcome: row.outcome,
    emotion: row.emotion,
    followedPlan: Boolean(row.followed_plan),
    screenshotUrl: row.screenshot_url ?? null,
    lessonLearned: row.lesson_learned ?? '',
    createdAt: row.created_at,
  };
}

export async function listJournalEntries(): Promise<JournalEntry[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_journal_entries')
        .select('*')
        .eq('user_id', authUserId)
        .order('traded_at', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return (data as DbJournalEntryRow[]).map(mapJournalRow);
      }
    } catch {
      // Fallback to local storage
    }
  }

  return sortNewestFirst(readLocalEntries());
}

export async function createJournalEntry(
  input: CreateJournalEntryInput,
): Promise<JournalEntry> {
  const symbol = input.symbol.trim().toUpperCase();
  if (!symbol) {
    throw new Error('Symbol is required.');
  }

  if (typeof input.pnlAmount !== 'number' || !Number.isFinite(input.pnlAmount)) {
    throw new Error('PnL amount must be a finite number.');
  }

  if (typeof input.rMultiple !== 'number' || !Number.isFinite(input.rMultiple)) {
    throw new Error('R-multiple must be a finite number.');
  }

  if (!VALID_EMOTIONS.has(input.emotion)) {
    throw new Error('Invalid emotion tag.');
  }

  const entryPrice = parseOptionalPrice(input.entryPrice, 'Entry price');
  const exitPrice = parseOptionalPrice(input.exitPrice, 'Exit price');
  const screenshotUrl = validateScreenshotUrl(input.screenshotUrl);

  const nowIso = new Date().toISOString();
  let tradedAt = nowIso;
  if (input.tradedAt && input.tradedAt.trim()) {
    const parsedTime = Date.parse(input.tradedAt);
    if (Number.isNaN(parsedTime)) {
      throw new Error('Invalid trade timestamp.');
    }
    tradedAt = new Date(parsedTime).toISOString();
  }

  const pnlAmount = round2(input.pnlAmount);
  const rMultiple = round2(input.rMultiple);
  const outcome = deriveOutcome(pnlAmount);
  const setupTag = (input.setupTag ?? '').trim();
  const lessonLearned = (input.lessonLearned ?? '').trim();
  const followedPlan = Boolean(input.followedPlan);

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_journal_entries')
        .insert({
          user_id: authUserId,
          traded_at: tradedAt,
          symbol,
          asset_class: input.assetClass,
          direction: input.direction,
          setup_tag: setupTag,
          entry_price: entryPrice,
          exit_price: exitPrice,
          pnl_amount: pnlAmount,
          r_multiple: rMultiple,
          outcome,
          emotion: input.emotion,
          followed_plan: followedPlan,
          screenshot_url: screenshotUrl,
          lesson_learned: lessonLearned,
        })
        .select('*')
        .single<DbJournalEntryRow>();

      if (!error && data) {
        return mapJournalRow(data);
      }
    } catch {
      // Fall through to local preview persistence
    }
  }

  const userId = await getActiveUserId();
  const created: JournalEntry = {
    id: generateId(),
    userId,
    tradedAt,
    symbol,
    assetClass: input.assetClass,
    direction: input.direction,
    setupTag,
    entryPrice,
    exitPrice,
    pnlAmount,
    rMultiple,
    outcome,
    emotion: input.emotion,
    followedPlan,
    screenshotUrl,
    lessonLearned,
    createdAt: nowIso,
  };

  const nextList = sortNewestFirst([created, ...readLocalEntries()]);
  writeLocalEntries(nextList);
  return created;
}

export async function deleteJournalEntry(entryId: string): Promise<void> {
  const trimmedId = entryId.trim();
  if (!trimmedId) {
    return;
  }

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase
        .from('user_journal_entries')
        .delete()
        .eq('id', trimmedId)
        .eq('user_id', authUserId);

      if (!error) {
        return;
      }
    } catch {
      // Fallback to local storage
    }
  }

  const filtered = readLocalEntries().filter((entry) => entry.id !== trimmedId);
  writeLocalEntries(filtered);
}

export function computeJournalAnalytics(entries: JournalEntry[]): JournalAnalytics {
  const totalTrades = entries.length;
  let wins = 0;
  let losses = 0;
  let breakevens = 0;
  let netPnl = 0;
  let rSum = 0;
  let followedPlanCount = 0;
  let calmNetPnl = 0;
  let emotionalLeakPnl = 0;

  const emotionBuckets = new Map<
    JournalEmotion,
    { count: number; wins: number; netPnl: number }
  >(
    JOURNAL_EMOTIONS.map((item) => [item.id, { count: 0, wins: 0, netPnl: 0 }]),
  );

  for (const entry of entries) {
    if (entry.outcome === 'win') {
      wins += 1;
    } else if (entry.outcome === 'loss') {
      losses += 1;
    } else {
      breakevens += 1;
    }

    const pnl = Number.isFinite(entry.pnlAmount) ? entry.pnlAmount : 0;
    const rVal = Number.isFinite(entry.rMultiple) ? entry.rMultiple : 0;

    netPnl += pnl;
    rSum += rVal;

    if (entry.followedPlan) {
      followedPlanCount += 1;
    }

    if (entry.emotion === 'calm_disciplined') {
      calmNetPnl += pnl;
    } else {
      emotionalLeakPnl += pnl;
    }

    const bucket = emotionBuckets.get(entry.emotion);
    if (bucket) {
      bucket.count += 1;
      bucket.netPnl += pnl;
      if (entry.outcome === 'win') {
        bucket.wins += 1;
      }
    }
  }

  const byEmotion: EmotionStat[] = JOURNAL_EMOTIONS.map((item) => {
    const bucket = emotionBuckets.get(item.id) ?? { count: 0, wins: 0, netPnl: 0 };
    return {
      emotion: item.id,
      count: bucket.count,
      netPnl: round2(bucket.netPnl),
      winRate: bucket.count > 0 ? round2((bucket.wins / bucket.count) * 100) : 0,
    };
  });

  return {
    totalTrades,
    wins,
    losses,
    breakevens,
    winRate: totalTrades > 0 ? round2((wins / totalTrades) * 100) : 0,
    netPnl: round2(netPnl),
    avgRMultiple: totalTrades > 0 ? round2(rSum / totalTrades) : 0,
    ruleAdherencePct:
      totalTrades > 0 ? round2((followedPlanCount / totalTrades) * 100) : 0,
    calmNetPnl: round2(calmNetPnl),
    emotionalLeakPnl: round2(emotionalLeakPnl),
    byEmotion,
  };
}
