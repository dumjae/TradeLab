export type QuoteSourceType =
  | 'verified_trader'
  | 'tradelab_principle'
  | 'user_custom';

export type QuoteCategory = 'motivate' | 'teach' | 'inspire';

export type QuoteLanguage = 'en' | 'taglish';

export interface TradingQuote {
  id: string;
  quoteText: string;
  author: string;
  authorRole: string;
  sourceType: QuoteSourceType;
  category: QuoteCategory;
  language: QuoteLanguage;
  tradingLessonNote: string;
  relatedConcepts: string[];
  isPublic: boolean;
  userId: string | null;
  createdAt: string;
}

export interface UserFavoriteQuote {
  id: string;
  userId: string;
  quoteId: string;
  personalReflection: string;
  isPinned: boolean;
  createdAt: string;
}

export interface QuoteWithUserState extends TradingQuote {
  isFavorite: boolean;
  isPinned: boolean;
  personalReflection: string;
}

export interface CreateCustomQuoteInput {
  quoteText: string;
  author?: string;
  authorRole?: string;
  category: QuoteCategory;
  language?: QuoteLanguage;
  tradingLessonNote: string;
  relatedConcepts?: string[];
}

export interface QuoteFilterOptions {
  category?: QuoteCategory | 'all';
  sourceType?: QuoteSourceType | 'all';
  language?: QuoteLanguage | 'all';
  favoritesOnly?: boolean;
  searchQuery?: string;
  conceptKey?: string;
}
