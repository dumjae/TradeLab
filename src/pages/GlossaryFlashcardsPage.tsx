import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  Layers,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTopicByCode } from '../data/academyRoadmap';
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_TERMS,
  type GlossaryCategoryMeta,
} from '../data/glossaryTerms';
import type { GlossaryTermEntry } from '../types/curriculum-tree';

type ViewMode = 'glossary' | 'flashcards';
type CategoryFilter = GlossaryCategoryMeta['id'];

const MASTERED_STORAGE_KEY = 'tradelab_glossary_mastered_v1';

const CATEGORY_BADGE_STYLES: Record<GlossaryTermEntry['category'], string> = {
  fundamentals: 'border-brand/35 bg-brand-soft text-brand-text',
  charts: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  smc: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  risk: 'border-bull/35 bg-bull/10 text-bull',
  psychology: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  forex: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  indices: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  stocks: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
  crypto: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  philippines: 'border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400',
};

function readMasteredIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(MASTERED_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

function writeMasteredIds(ids: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(MASTERED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore browser storage quota errors
  }
}

function shuffleItems<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export function GlossaryFlashcardsPage() {
  const { isTaglish, t } = useLanguage();
  const [mode, setMode] = useState<ViewMode>('glossary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [masteredIds, setMasteredIds] = useState<string[]>(() => readMasteredIds());
  const [deckIds, setDeckIds] = useState<string[]>([]);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const masteredSet = useMemo(() => new Set(masteredIds), [masteredIds]);

  const categoryLabelMap = useMemo(() => {
    const map = new Map<GlossaryTermEntry['category'], { en: string; taglish: string }>();
    for (const cat of GLOSSARY_CATEGORIES) {
      if (cat.id !== 'all') {
        map.set(cat.id, { en: cat.labelEn, taglish: cat.labelTaglish });
      }
    }
    return map;
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      all: GLOSSARY_TERMS.length,
      fundamentals: 0,
      charts: 0,
      smc: 0,
      risk: 0,
      psychology: 0,
      forex: 0,
      indices: 0,
      stocks: 0,
      crypto: 0,
      philippines: 0,
    };
    for (const term of GLOSSARY_TERMS) {
      counts[term.category] = (counts[term.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const termById = useMemo(
    () => new Map(GLOSSARY_TERMS.map((item) => [item.id, item])),
    [],
  );

  const filteredTerms = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((entry) => {
      if (categoryFilter !== 'all' && entry.category !== categoryFilter) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return (
        entry.term.toLowerCase().includes(normalized) ||
        (entry.acronym ? entry.acronym.toLowerCase().includes(normalized) : false) ||
        entry.definitionEn.toLowerCase().includes(normalized) ||
        entry.definitionTaglish.toLowerCase().includes(normalized) ||
        entry.example.toLowerCase().includes(normalized)
      );
    });
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    setDeckIds(filteredTerms.map((entry) => entry.id));
    setCardIndex(0);
    setIsFlipped(false);
  }, [filteredTerms]);

  const activeDeck = useMemo(
    () =>
      deckIds
        .map((id) => termById.get(id))
        .filter((item): item is GlossaryTermEntry => Boolean(item)),
    [deckIds, termById],
  );

  const safeCardIndex = activeDeck.length > 0 ? Math.min(cardIndex, activeDeck.length - 1) : 0;
  const activeCard = activeDeck[safeCardIndex] ?? null;

  const masteredInDeckCount = useMemo(
    () => activeDeck.filter((entry) => masteredSet.has(entry.id)).length,
    [activeDeck, masteredSet],
  );

  const masteredDeckPct =
    activeDeck.length > 0 ? Math.round((masteredInDeckCount / activeDeck.length) * 100) : 0;

  const updateMastered = (nextIds: string[]) => {
    setMasteredIds(nextIds);
    writeMasteredIds(nextIds);
  };

  const handleMarkKnowIt = () => {
    if (!activeCard) {
      return;
    }
    if (!masteredSet.has(activeCard.id)) {
      updateMastered([...masteredIds, activeCard.id]);
    }
    setIsFlipped(false);
    if (activeDeck.length > 1) {
      setCardIndex((prev) => (prev + 1) % activeDeck.length);
    }
  };

  const handleReviewAgain = () => {
    if (!activeCard) {
      return;
    }
    if (masteredSet.has(activeCard.id)) {
      updateMastered(masteredIds.filter((id) => id !== activeCard.id));
    }
    setIsFlipped(false);
    if (activeDeck.length > 1) {
      setCardIndex((prev) => (prev + 1) % activeDeck.length);
    }
  };

  const handleShuffle = () => {
    if (activeDeck.length <= 1) {
      return;
    }
    setDeckIds(shuffleItems(activeDeck.map((entry) => entry.id)));
    setCardIndex(0);
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    if (activeDeck.length <= 1) {
      return;
    }
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  };

  const handleNextCard = () => {
    if (activeDeck.length <= 1) {
      return;
    }
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % activeDeck.length);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
  };

  const activeCardTopic = activeCard?.relatedTopicCode
    ? getTopicByCode(activeCard.relatedTopicCode)
    : undefined;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      {/* Header & Mode Switcher */}
      <section className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-brand/35 bg-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-text">
              <BookMarked className="h-3 w-3" aria-hidden="true" />
              {t('Trading Lexicon & Active Recall', 'Talasalitaan ng Trader at Flashcards')}
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-terminal-text sm:text-xl">
              {t('Glossary & Flashcards', 'Glossary at Flashcards')}
            </h1>
            <p className="max-w-2xl text-xs text-terminal-muted">
              {t(
                'Search 100 institutional trading terms across Forex, Indices, Stocks, Crypto, SMC, Risk, and Philippine PSE—then drill them with flip flashcards.',
                'Maghanap sa 100 trading terms mula Forex, Indices, Stocks, Crypto, SMC, Risk, hanggang Philippine PSE—at i-practice gamit ang flashcards.',
              )}
            </p>
          </div>

          {/* 2-Mode Switcher */}
          <div
            role="tablist"
            aria-label={t('Glossary view mode', 'Mode ng Glossary')}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'glossary'}
              onClick={() => setMode('glossary')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'glossary'
                  ? 'bg-brand text-brand-fg shadow-sm'
                  : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {t(`Glossary (${GLOSSARY_TERMS.length})`, `Glossary (${GLOSSARY_TERMS.length})`)}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'flashcards'}
              onClick={() => setMode('flashcards')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'flashcards'
                  ? 'bg-brand text-brand-fg shadow-sm'
                  : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
              }`}
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('Flashcards', 'Flashcards')}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-4 space-y-3 border-t border-terminal-border pt-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-terminal-muted"
                aria-hidden="true"
              />
              <input
                id="glossary-search"
                name="glossarySearch"
                aria-label="Search trading glossary"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t(
                  'Search term, acronym (e.g. FVG, PSEi, ATR, R-Multiple)...',
                  'Maghanap ng term o acronym (hal. FVG, PSEi, ATR, Stop Loss)...',
                )}
                className="w-full rounded-lg border border-terminal-border bg-terminal-bg py-2 pl-9 pr-9 text-xs text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear glossary search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-terminal-muted tabular-nums">
              <span>
                {filteredTerms.length} / {GLOSSARY_TERMS.length} {t('terms', 'terms')}
              </span>
              <span aria-hidden="true" className="opacity-40">
                •
              </span>
              <span className="text-bull">
                {masteredIds.length} {t('mastered', 'mastered')}
              </span>
            </div>
          </div>

          {/* Horizontal Category Filter Pills */}
          <div
            role="group"
            aria-label={t('Filter glossary by category', 'I-filter ayon sa kategorya')}
            className="no-scrollbar flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1"
          >
            {GLOSSARY_CATEGORIES.map((category) => {
              const isActive = categoryFilter === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryFilter(category.id)}
                  aria-pressed={isActive}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1 text-xs transition-colors ${
                    isActive
                      ? 'border-brand bg-brand font-semibold text-brand-fg shadow-sm'
                      : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-brand/40 hover:bg-terminal-elevated hover:text-terminal-text'
                  }`}
                >
                  <span>{isTaglish ? category.labelTaglish : category.labelEn}</span>
                  <span className="font-mono text-[10px] opacity-80 tabular-nums">
                    {categoryCounts[category.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Empty Search Result State */}
      {filteredTerms.length === 0 ? (
        <section className="rounded-xl border border-terminal-border bg-terminal-surface p-8 text-center">
          <p className="text-sm font-semibold text-terminal-text">
            {t('No matching trading terms found', 'Walang nahanap na katugmang trading term')}
          </p>
          <p className="mt-1 text-xs text-terminal-muted">
            {t(
              'Try clearing your search or switching back to All Terms.',
              'Subukang burahin ang search o bumalik sa Lahat ng Terms.',
            )}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('Reset Filters', 'I-reset ang Filter')}
          </button>
        </section>
      ) : mode === 'glossary' ? (
        /* GLOSSARY GRID MODE */
        <section aria-label={t('Trading glossary cards', 'Mga card ng glossary')}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredTerms.map((entry) => {
              const linkedTopic = entry.relatedTopicCode
                ? getTopicByCode(entry.relatedTopicCode)
                : undefined;
              const catMeta = categoryLabelMap.get(entry.category);
              const isMastered = masteredSet.has(entry.id);

              return (
                <article
                  key={entry.id}
                  className="flex flex-col justify-between rounded-xl border border-terminal-border bg-terminal-surface p-4 transition-colors hover:border-brand/45"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h2 className="text-sm font-semibold tracking-tight text-terminal-text">
                          {entry.term}
                        </h2>
                        {entry.acronym && (
                          <span className="rounded border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand-text">
                            {entry.acronym}
                          </span>
                        )}
                      </div>

                      {isMastered && (
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-bull"
                          aria-label={t('Mastered in flashcards', 'Kabisado sa flashcards')}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_BADGE_STYLES[entry.category]}`}
                      >
                        {catMeta ? (isTaglish ? catMeta.taglish : catMeta.en) : entry.category}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-terminal-text/90">
                      {isTaglish ? entry.definitionTaglish : entry.definitionEn}
                    </p>

                    <div className="rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {t('Example', 'Halimbawa')}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-terminal-muted">
                        {entry.example}
                      </p>
                    </div>
                  </div>

                  {linkedTopic && (
                    <div className="mt-3 border-t border-terminal-border pt-2.5">
                      <Link
                        to={`/academy/topic/${linkedTopic.slug}`}
                        className="group inline-flex w-full items-center justify-between gap-2 rounded-lg border border-brand/25 bg-brand-soft/60 px-2.5 py-1.5 text-[11px] font-medium text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
                      >
                        <span className="truncate">
                          <span className="mr-1.5 font-mono font-semibold tabular-nums">
                            {linkedTopic.code}
                          </span>
                          {linkedTopic.title}
                        </span>
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        /* FLASHCARDS ACTIVE RECALL MODE */
        <section
          aria-label={t('Interactive flashcards trainer', 'Interactive flashcards')}
          className="mx-auto max-w-3xl space-y-4"
        >
          {/* Progress & Deck Controls Strip */}
          <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-mono text-xs font-semibold text-terminal-text tabular-nums">
                  {masteredInDeckCount} / {activeDeck.length}{' '}
                  {t('mastered', 'mastered')} ({masteredDeckPct}%)
                </p>
                <p className="text-[11px] text-terminal-muted">
                  {t(
                    `Card ${safeCardIndex + 1} of ${activeDeck.length} • Click card to flip Front ↔ Back`,
                    `Card ${safeCardIndex + 1} sa ${activeDeck.length} • I-click ang card para baliktarin`,
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/45 hover:bg-terminal-elevated"
                >
                  <Shuffle className="h-3.5 w-3.5 text-brand-text" aria-hidden="true" />
                  <span>{t('Shuffle', 'I-shuffle')}</span>
                </button>
                {masteredInDeckCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const deckIdSet = new Set(activeDeck.map((entry) => entry.id));
                      updateMastered(masteredIds.filter((id) => !deckIdSet.has(id)));
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:border-bear/45 hover:text-bear"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t('Reset Deck', 'I-reset')}</span>
                  </button>
                )}
              </div>
            </div>

            <div
              role="progressbar"
              aria-label={t('Flashcards mastery progress', 'Progreso sa flashcards')}
              aria-valuenow={masteredDeckPct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-terminal-elevated"
            >
              <div
                className="h-full rounded-full bg-bull transition-all duration-300"
                style={{ width: `${masteredDeckPct}%` }}
              />
            </div>
          </div>

          {/* Interactive Flip Card Button */}
          {activeCard && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                aria-pressed={isFlipped}
                aria-label={
                  isFlipped
                    ? `Flashcard back for ${activeCard.term}. Click to show front.`
                    : `Flashcard front for ${activeCard.term}. Click to reveal definition.`
                }
                className={`group flex min-h-[270px] w-full flex-col justify-between rounded-xl border p-6 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand ${
                  isFlipped
                    ? 'border-brand/55 bg-terminal-surface shadow-sm'
                    : 'border-terminal-border bg-terminal-surface hover:border-brand/45'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_BADGE_STYLES[activeCard.category]}`}
                    >
                      {categoryLabelMap.get(activeCard.category)
                        ? isTaglish
                          ? categoryLabelMap.get(activeCard.category)?.taglish
                          : categoryLabelMap.get(activeCard.category)?.en
                        : activeCard.category}
                    </span>
                    {activeCard.acronym && (
                      <span className="rounded border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] font-semibold text-brand-text">
                        {activeCard.acronym}
                      </span>
                    )}
                    {masteredSet.has(activeCard.id) && (
                      <span className="inline-flex items-center gap-1 rounded border border-bull/35 bg-bull/10 px-2 py-0.5 text-[10px] font-semibold text-bull">
                        <Check className="h-3 w-3" aria-hidden="true" />
                        {t('Mastered', 'Kabisado')}
                      </span>
                    )}
                  </div>

                  <span className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-terminal-muted">
                    {isFlipped ? t('Back • Answer', 'Likod • Sagot') : t('Front • Term', 'Harap • Term')}
                  </span>
                </div>

                {!isFlipped ? (
                  <div className="my-8 flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-semibold tracking-tight text-terminal-text sm:text-3xl">
                      {activeCard.term}
                    </h2>
                    {activeCard.acronym && (
                      <p className="mt-2 font-mono text-sm font-semibold text-brand-text">
                        ({activeCard.acronym})
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="my-4 w-full space-y-3">
                    <h2 className="text-base font-semibold text-terminal-text">
                      {activeCard.term}
                    </h2>
                    <p className="text-sm leading-relaxed text-terminal-text/95">
                      {isTaglish ? activeCard.definitionTaglish : activeCard.definitionEn}
                    </p>
                    <div className="rounded-lg border border-terminal-border bg-terminal-bg p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {t('Market Example', 'Halimbawa sa Market')}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-terminal-muted">
                        {activeCard.example}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex w-full items-center justify-between border-t border-terminal-border pt-3 text-[11px] text-terminal-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-text" aria-hidden="true" />
                    {isFlipped
                      ? t('Click card to flip back to term', 'I-click para bumalik sa harap')
                      : t('Click card to reveal definition & example', 'I-click para makita ang kahulugan at halimbawa')}
                  </span>
                  <span className="font-mono tabular-nums">
                    {safeCardIndex + 1} / {activeDeck.length}
                  </span>
                </div>
              </button>

              {/* Linked Syllabus Topic (placed outside flip button for clean accessible HTML) */}
              {activeCardTopic && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-terminal-border bg-terminal-surface px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-terminal-muted">
                      {t('Related Academy Topic', 'Kaugnay na Aralin sa Academy')}
                    </p>
                    <p className="truncate text-xs font-semibold text-terminal-text">
                      <span className="mr-1.5 font-mono text-brand-text tabular-nums">
                        {activeCardTopic.code}
                      </span>
                      {activeCardTopic.title}
                    </p>
                  </div>
                  <Link
                    to={`/academy/topic/${activeCardTopic.slug}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand/35 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-text transition-colors hover:bg-brand hover:text-brand-fg"
                  >
                    <span>{t('Open Topic', 'Buksan')}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              )}

              {/* Flashcard Action Controls */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  disabled={activeDeck.length <= 1}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-2.5 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/45 hover:bg-terminal-elevated disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('Prev', 'Nakaraan')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReviewAgain}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('Review Again', 'Balikan Muli')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleMarkKnowIt}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-bull px-3 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('Know It ✓', 'Alam Ko Na ✓')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextCard}
                  disabled={activeDeck.length <= 1}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-2.5 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/45 hover:bg-terminal-elevated disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span>{t('Next', 'Susunod')}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
