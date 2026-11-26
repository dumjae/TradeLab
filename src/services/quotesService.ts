import type {
  CreateCustomQuoteInput,
  QuoteCategory,
  QuoteFilterOptions,
  QuoteWithUserState,
  TradingQuote,
} from '../types/quotes';
import { STARTER_QUOTES } from '../data/starterQuotes';
import {
  getActiveUserId,
  getAuthenticatedSupabaseUserId,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

const CUSTOM_QUOTES_KEY = 'tradelab_custom_quotes_v1';
const FAVORITE_QUOTES_KEY = 'tradelab_quote_favorites_v1';
const HIDDEN_STARTER_QUOTES_KEY = 'tradelab_hidden_starter_quotes_v1';

interface LocalFavoriteState {
  quoteId: string;
  isFavorite: boolean;
  isPinned: boolean;
  personalReflection: string;
  updatedAt: string;
}

interface DbQuoteRow {
  id: string;
  quote_text: string;
  author: string;
  author_role: string;
  source_type: TradingQuote['sourceType'];
  category: TradingQuote['category'];
  language: TradingQuote['language'];
  trading_lesson_note: string;
  related_concepts: string[];
  is_public: boolean;
  user_id: string | null;
  created_at: string;
}

interface DbFavoriteQuoteRow {
  quote_id: string;
  personal_reflection: string;
  is_pinned: boolean;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `quote-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readLocalCustomQuotes(): TradingQuote[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CUSTOM_QUOTES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TradingQuote[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCustomQuotes(quotes: TradingQuote[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CUSTOM_QUOTES_KEY, JSON.stringify(quotes));
  } catch {
    // Ignore storage quota errors
  }
}

function readLocalFavoriteMap(): Record<string, LocalFavoriteState> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(FAVORITE_QUOTES_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, LocalFavoriteState>)
      : {};
  } catch {
    return {};
  }
}

function writeLocalFavoriteMap(map: Record<string, LocalFavoriteState>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(FAVORITE_QUOTES_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

function readHiddenStarterQuoteIds(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const raw = window.localStorage.getItem(HIDDEN_STARTER_QUOTES_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? new Set(parsed.filter((item): item is string => typeof item === 'string'))
      : new Set();
  } catch {
    return new Set();
  }
}

function writeHiddenStarterQuoteIds(ids: Set<string>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(HIDDEN_STARTER_QUOTES_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Ignore storage quota errors
  }
}

function mapQuoteRow(row: DbQuoteRow): TradingQuote {
  return {
    id: row.id,
    quoteText: row.quote_text,
    author: row.author,
    authorRole: row.author_role,
    sourceType: row.source_type,
    category: row.category,
    language: row.language,
    tradingLessonNote: row.trading_lesson_note,
    relatedConcepts: Array.isArray(row.related_concepts) ? row.related_concepts : [],
    isPublic: row.is_public,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function getTodayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function loadAllQuotesWithState(): Promise<QuoteWithUserState[]> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: quoteRows, error: quoteError } = await supabase
        .from('trading_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!quoteError && Array.isArray(quoteRows) && quoteRows.length > 0) {
        const favoriteById = new Map<string, DbFavoriteQuoteRow>();

        if (authUserId) {
          const { data: favRows } = await supabase
            .from('user_favorite_quotes')
            .select('quote_id, personal_reflection, is_pinned')
            .eq('user_id', authUserId);

          for (const fav of (favRows ?? []) as DbFavoriteQuoteRow[]) {
            favoriteById.set(fav.quote_id, fav);
          }
        }

        const localFavs = authUserId ? {} : readLocalFavoriteMap();
        return (quoteRows as DbQuoteRow[]).map((row) => {
          const quote = mapQuoteRow(row);
          if (authUserId) {
            const fav = favoriteById.get(quote.id);
            return {
              ...quote,
              isFavorite: Boolean(fav),
              isPinned: Boolean(fav?.is_pinned),
              personalReflection: fav?.personal_reflection ?? '',
            };
          }

          const localFav = localFavs[quote.id];
          return {
            ...quote,
            isFavorite: Boolean(localFav?.isFavorite),
            isPinned: Boolean(localFav?.isPinned),
            personalReflection: localFav?.personalReflection ?? '',
          };
        });
      }
    } catch {
      // Fall through to local curated starter quotes + local custom quotes
    }
  }

  const customQuotes = readLocalCustomQuotes();
  const favMap = readLocalFavoriteMap();
  const hiddenStarterIds = readHiddenStarterQuoteIds();
  const visibleStarterQuotes =
    hiddenStarterIds.size > 0
      ? STARTER_QUOTES.filter((quote) => !hiddenStarterIds.has(quote.id))
      : STARTER_QUOTES;
  const merged = [...customQuotes, ...visibleStarterQuotes];

  return merged.map((quote) => {
    const state = favMap[quote.id];
    return {
      ...quote,
      isFavorite: Boolean(state?.isFavorite),
      isPinned: Boolean(state?.isPinned),
      personalReflection: state?.personalReflection ?? '',
    };
  });
}

export async function listQuotes(
  filters?: QuoteFilterOptions,
): Promise<QuoteWithUserState[]> {
  const allQuotes = await loadAllQuotesWithState();

  const filtered = allQuotes.filter((quote) => {
    if (filters?.category && filters.category !== 'all' && quote.category !== filters.category) {
      return false;
    }

    if (
      filters?.sourceType &&
      filters.sourceType !== 'all' &&
      quote.sourceType !== filters.sourceType
    ) {
      return false;
    }

    if (filters?.language && filters.language !== 'all' && quote.language !== filters.language) {
      return false;
    }

    if (filters?.favoritesOnly && !quote.isFavorite && !quote.isPinned) {
      return false;
    }

    if (
      filters?.conceptKey &&
      !quote.relatedConcepts.includes(filters.conceptKey)
    ) {
      return false;
    }

    if (filters?.searchQuery?.trim()) {
      const needle = filters.searchQuery.trim().toLowerCase();
      const haystack =
        `${quote.quoteText} ${quote.author} ${quote.authorRole} ${quote.tradingLessonNote} ${quote.personalReflection}`.toLowerCase();
      if (!haystack.includes(needle)) {
        return false;
      }
    }

    return true;
  });

  // Pinned quotes surface first, then custom/favorite quotes, preserving stable order
  return filtered.sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    if (a.sourceType === 'user_custom' && b.sourceType !== 'user_custom') {
      return -1;
    }
    if (a.sourceType !== 'user_custom' && b.sourceType === 'user_custom') {
      return 1;
    }
    return 0;
  });
}

export async function getDailyQuote(conceptKey?: string): Promise<QuoteWithUserState> {
  const allQuotes = await loadAllQuotesWithState();
  const conceptPool = conceptKey
    ? allQuotes.filter((quote) => quote.relatedConcepts.includes(conceptKey))
    : allQuotes;
  const pool = conceptPool.length > 0 ? conceptPool : allQuotes;

  const pinned = pool.find((quote) => quote.isPinned);
  if (pinned) {
    return pinned;
  }

  const seed = `${getTodayDateKey()}::${conceptKey ?? 'global'}`;
  const index = hashSeed(seed) % pool.length;
  return pool[index];
}

export async function getContextualQuote(
  conceptKey?: string,
  category?: QuoteCategory,
): Promise<QuoteWithUserState> {
  const allQuotes = await loadAllQuotesWithState();

  const exactPool = allQuotes.filter((quote) => {
    const matchesConcept = !conceptKey || quote.relatedConcepts.includes(conceptKey);
    const matchesCategory = !category || quote.category === category;
    return matchesConcept && matchesCategory;
  });

  const conceptOnlyPool =
    exactPool.length > 0 || !conceptKey
      ? exactPool
      : allQuotes.filter((quote) => quote.relatedConcepts.includes(conceptKey));

  const categoryOnlyPool =
    conceptOnlyPool.length > 0 || !category
      ? conceptOnlyPool
      : allQuotes.filter((quote) => quote.category === category);

  const pool = categoryOnlyPool.length > 0 ? categoryOnlyPool : allQuotes;
  const pinnedOrFav = pool.find((quote) => quote.isPinned) ?? pool.find((quote) => quote.isFavorite);
  if (pinnedOrFav) {
    return pinnedOrFav;
  }

  const seed = `${getTodayDateKey()}::${conceptKey ?? 'any'}::${category ?? 'any'}`;
  const index = hashSeed(seed) % pool.length;
  return pool[index];
}

export async function toggleFavoriteQuote(quoteId: string): Promise<boolean> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: existing } = await supabase
        .from('user_favorite_quotes')
        .select('id, is_pinned')
        .eq('user_id', authUserId)
        .eq('quote_id', quoteId)
        .maybeSingle<{ id: string; is_pinned: boolean }>();

      if (existing) {
        const { error } = await supabase
          .from('user_favorite_quotes')
          .delete()
          .eq('id', existing.id)
          .eq('user_id', authUserId);
        if (!error) {
          return false;
        }
      } else {
        const { error } = await supabase.from('user_favorite_quotes').insert({
          user_id: authUserId,
          quote_id: quoteId,
          personal_reflection: '',
          is_pinned: false,
        });
        if (!error) {
          return true;
        }
      }
    } catch {
      // Fallback to local state
    }
  }

  const favMap = readLocalFavoriteMap();
  const current = favMap[quoteId];
  const nextFavorite = !(current?.isFavorite ?? false);

  favMap[quoteId] = {
    quoteId,
    isFavorite: nextFavorite,
    isPinned: nextFavorite ? (current?.isPinned ?? false) : false,
    personalReflection: current?.personalReflection ?? '',
    updatedAt: new Date().toISOString(),
  };
  writeLocalFavoriteMap(favMap);
  return nextFavorite;
}

export async function togglePinQuote(quoteId: string): Promise<boolean> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data: existing } = await supabase
        .from('user_favorite_quotes')
        .select('id, is_pinned')
        .eq('user_id', authUserId)
        .eq('quote_id', quoteId)
        .maybeSingle<{ id: string; is_pinned: boolean }>();

      const nextPinned = !(existing?.is_pinned ?? false);
      const { error } = await supabase.from('user_favorite_quotes').upsert(
        {
          user_id: authUserId,
          quote_id: quoteId,
          is_pinned: nextPinned,
        },
        { onConflict: 'user_id,quote_id' },
      );

      if (!error) {
        return nextPinned;
      }
    } catch {
      // Fallback to local state
    }
  }

  const favMap = readLocalFavoriteMap();
  const current = favMap[quoteId];
  const nextPinned = !(current?.isPinned ?? false);

  favMap[quoteId] = {
    quoteId,
    isFavorite: nextPinned ? true : (current?.isFavorite ?? false),
    isPinned: nextPinned,
    personalReflection: current?.personalReflection ?? '',
    updatedAt: new Date().toISOString(),
  };
  writeLocalFavoriteMap(favMap);
  return nextPinned;
}

export async function updateQuoteReflection(
  quoteId: string,
  personalReflection: string,
): Promise<void> {
  const cleaned = personalReflection.trim();
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase.from('user_favorite_quotes').upsert(
        {
          user_id: authUserId,
          quote_id: quoteId,
          personal_reflection: cleaned,
        },
        { onConflict: 'user_id,quote_id' },
      );

      if (!error) {
        return;
      }
    } catch {
      // Fallback to local state
    }
  }

  const favMap = readLocalFavoriteMap();
  const current = favMap[quoteId];
  favMap[quoteId] = {
    quoteId,
    isFavorite: current?.isFavorite ?? true,
    isPinned: current?.isPinned ?? false,
    personalReflection: cleaned,
    updatedAt: new Date().toISOString(),
  };
  writeLocalFavoriteMap(favMap);
}

export async function createCustomQuote(
  input: CreateCustomQuoteInput,
): Promise<QuoteWithUserState> {
  const quoteText = input.quoteText.trim();
  const author = input.author?.trim() || 'My Trading Principle';
  const authorRole = input.authorRole?.trim() || 'Personal Journal Note';
  const language = input.language ?? 'en';
  const tradingLessonNote = input.tradingLessonNote.trim();
  const relatedConcepts = Array.isArray(input.relatedConcepts)
    ? input.relatedConcepts.filter((key) => key.trim().length > 0)
    : [];
  const nowIso = new Date().toISOString();

  const authUserId = await getAuthenticatedSupabaseUserId();
  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { data, error } = await supabase
        .from('trading_quotes')
        .insert({
          quote_text: quoteText,
          author,
          author_role: authorRole,
          source_type: 'user_custom',
          category: input.category,
          language,
          trading_lesson_note: tradingLessonNote,
          related_concepts: relatedConcepts,
          is_public: false,
          user_id: authUserId,
        })
        .select('*')
        .single<DbQuoteRow>();

      if (!error && data) {
        return {
          ...mapQuoteRow(data),
          isFavorite: true,
          isPinned: false,
          personalReflection: '',
        };
      }
    } catch {
      // Fall through to local persistence
    }
  }

  const userId = await getActiveUserId();
  const customQuote: TradingQuote = {
    id: generateId(),
    quoteText,
    author,
    authorRole,
    sourceType: 'user_custom',
    category: input.category,
    language,
    tradingLessonNote,
    relatedConcepts,
    isPublic: false,
    userId,
    createdAt: nowIso,
  };

  const existing = readLocalCustomQuotes();
  writeLocalCustomQuotes([customQuote, ...existing]);

  const favMap = readLocalFavoriteMap();
  favMap[customQuote.id] = {
    quoteId: customQuote.id,
    isFavorite: true,
    isPinned: false,
    personalReflection: '',
    updatedAt: nowIso,
  };
  writeLocalFavoriteMap(favMap);

  return {
    ...customQuote,
    isFavorite: true,
    isPinned: false,
    personalReflection: '',
  };
}

export async function deleteCustomQuote(quoteId: string): Promise<void> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    try {
      const { error } = await supabase
        .from('trading_quotes')
        .delete()
        .eq('id', quoteId)
        .eq('source_type', 'user_custom')
        .eq('user_id', authUserId);

      if (!error) {
        return;
      }
    } catch {
      // Fall through to local removal
    }
  }

  const existing = readLocalCustomQuotes();
  const filtered = existing.filter(
    (quote) => !(quote.id === quoteId && quote.sourceType === 'user_custom'),
  );
  writeLocalCustomQuotes(filtered);

  const favMap = readLocalFavoriteMap();
  if (favMap[quoteId]) {
    delete favMap[quoteId];
    writeLocalFavoriteMap(favMap);
  }
}

export async function createPublicAdminQuote(
  input: CreateCustomQuoteInput & { sourceType?: 'verified_trader' | 'tradelab_principle' },
): Promise<QuoteWithUserState> {
  const quoteText = input.quoteText.trim();
  const sourceType = input.sourceType ?? 'tradelab_principle';
  const author = input.author?.trim() || 'TradeLab Academy';
  const authorRole =
    input.authorRole?.trim() ||
    (sourceType === 'verified_trader' ? 'Verified Trader' : 'TradeLab Execution Principle');
  const language = input.language ?? 'en';
  const tradingLessonNote = input.tradingLessonNote.trim();
  const relatedConcepts = Array.isArray(input.relatedConcepts)
    ? input.relatedConcepts.filter((key) => key.trim().length > 0)
    : [];

  if (quoteText.length < 5) {
    throw new Error('Quote text must be at least 5 characters.');
  }
  if (author.length < 2) {
    throw new Error('Author name must be at least 2 characters.');
  }
  if (tradingLessonNote.length < 10) {
    throw new Error('Trading lesson note must be at least 10 characters.');
  }

  const nowIso = new Date().toISOString();
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    const { data, error } = await supabase
      .from('trading_quotes')
      .insert({
        quote_text: quoteText,
        author,
        author_role: authorRole,
        source_type: sourceType,
        category: input.category,
        language,
        trading_lesson_note: tradingLessonNote,
        related_concepts: relatedConcepts,
        is_public: true,
        user_id: null,
      })
      .select('*')
      .single<DbQuoteRow>();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to publish curated quote (admin role required).');
    }

    return {
      ...mapQuoteRow(data),
      isFavorite: false,
      isPinned: false,
      personalReflection: '',
    };
  }

  const publicQuote: TradingQuote = {
    id: generateId(),
    quoteText,
    author,
    authorRole,
    sourceType,
    category: input.category,
    language,
    tradingLessonNote,
    relatedConcepts,
    isPublic: true,
    userId: null,
    createdAt: nowIso,
  };

  const existing = readLocalCustomQuotes();
  writeLocalCustomQuotes([publicQuote, ...existing]);

  return {
    ...publicQuote,
    isFavorite: false,
    isPinned: false,
    personalReflection: '',
  };
}

export async function deleteAnyQuoteAdmin(quoteId: string): Promise<void> {
  const authUserId = await getAuthenticatedSupabaseUserId();

  if (isSupabaseConfigured && supabase && authUserId) {
    const { error } = await supabase
      .from('trading_quotes')
      .delete()
      .eq('id', quoteId);

    if (error) {
      throw new Error(error.message || 'Failed to delete quote (admin role required).');
    }
    return;
  }

  const existing = readLocalCustomQuotes();
  const filtered = existing.filter((quote) => quote.id !== quoteId);
  writeLocalCustomQuotes(filtered);

  if (STARTER_QUOTES.some((quote) => quote.id === quoteId)) {
    const hidden = readHiddenStarterQuoteIds();
    hidden.add(quoteId);
    writeHiddenStarterQuoteIds(hidden);
  }

  const favMap = readLocalFavoriteMap();
  if (favMap[quoteId]) {
    delete favMap[quoteId];
    writeLocalFavoriteMap(favMap);
  }
}
