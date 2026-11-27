import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Award,
  BookMarked,
  BookOpen,
  Bookmark,
  CandlestickChart,
  Clock,
  Flame,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  LineChart,
  Menu,
  Moon,
  NotebookPen,
  Shield,
  Sun,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
} from '../../data/curriculum';
import { UI_COPY } from '../../data/taglishTranslations';
import { expandAcronyms } from '../../lib/acronymHelper';
import { PH_TIME_ZONE } from '../../lib/marketTime';
import { getStorageMode } from '../../lib/supabase';
import type { LessonMarketCategory } from '../../types/academy';
import { UserAccountMenu } from '../auth/UserAccountMenu';
import { AppWalkthroughModal } from '../learning/AppWalkthroughModal';
import { MindsetVaultDrawer } from '../quotes/MindsetVaultDrawer';

export interface AppShellProps {
  children: ReactNode;
  vaultOpen: boolean;
  onOpenVault: () => void;
  onCloseVault: () => void;
  tourOpen?: boolean;
  onOpenTour?: () => void;
  onCloseTour?: () => void;
}

type SidebarMarketFilter = 'all' | LessonMarketCategory;

const THEME_STORAGE_KEY = 'tradelab_theme_v1';

const PH_TOPBAR_CLOCK_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  timeZone: PH_TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

function formatPhTopBarClock(date: Date): string {
  return `${PH_TOPBAR_CLOCK_FORMATTER.format(date).toUpperCase()} PH`;
}

interface NavItemConfig {
  to: string;
  en: string;
  taglish: string;
  icon: typeof LayoutDashboard;
  end: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    to: '/',
    en: UI_COPY.nav.dashboard.en,
    taglish: UI_COPY.nav.dashboard.taglish,
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/academy',
    en: 'Trading Academy',
    taglish: UI_COPY.nav.academy.taglish,
    icon: BookOpen,
    end: false,
  },
  {
    to: '/glossary',
    en: 'Glossary & Cards',
    taglish: 'Glossary at Cards',
    icon: BookMarked,
    end: false,
  },
  {
    to: '/evaluation',
    en: 'Evaluation',
    taglish: 'Ebalwasyon',
    icon: Award,
    end: false,
  },
  {
    to: '/practice',
    en: 'Practice Exercises',
    taglish: 'Practice (Quiz)',
    icon: GraduationCap,
    end: false,
  },
  {
    to: '/backtest',
    en: 'Market Backtester',
    taglish: 'Market Backtester',
    icon: LineChart,
    end: false,
  },
  {
    to: '/paper-trading',
    en: UI_COPY.nav.paperTrading.en,
    taglish: UI_COPY.nav.paperTrading.taglish,
    icon: Wallet,
    end: false,
  },
  {
    to: '/journal',
    en: 'Trade Journal',
    taglish: UI_COPY.nav.riskJournal.taglish,
    icon: NotebookPen,
    end: false,
  },
  {
    to: '/lab',
    en: 'Trading Lab',
    taglish: 'Trading Lab',
    icon: CandlestickChart,
    end: false,
  },
  {
    to: '/library',
    en: 'My Library',
    taglish: 'My Library',
    icon: Bookmark,
    end: false,
  },
];

const MOBILE_BOTTOM_NAV: NavItemConfig[] = [
  { to: '/', en: 'Home', taglish: 'Home', icon: Home, end: true },
  { to: '/academy', en: 'Academy', taglish: 'Aralin', icon: BookOpen, end: false },
  { to: '/paper-trading', en: 'Paper', taglish: 'Demo', icon: Wallet, end: false },
  { to: '/backtest', en: 'Backtest', taglish: 'Replay', icon: LineChart, end: false },
  { to: '/journal', en: 'Journal', taglish: 'Journal', icon: NotebookPen, end: false },
];

const MARKET_TAG_STYLES: Record<LessonMarketCategory, string> = {
  general: 'border-brand/35 bg-brand-soft text-brand-text',
  forex: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  indices: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  crypto: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  stocks: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

const SIDEBAR_PILL_ACTIVE: Record<SidebarMarketFilter, string> = {
  all: 'bg-brand text-brand-fg font-semibold',
  general: 'bg-brand text-brand-fg font-semibold',
  forex: 'bg-sky-500 text-slate-950 font-semibold',
  indices: 'bg-amber-500 text-slate-950 font-semibold',
  crypto: 'bg-teal-500 text-slate-950 font-semibold',
  stocks: 'bg-rose-500 text-slate-950 font-semibold',
};

function formatModuleOrder(order: number): string {
  return String(order).padStart(2, '0');
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tagName = target.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable
  );
}

export function AppShell({
  children,
  vaultOpen,
  onOpenVault,
  onCloseVault,
  tourOpen,
  onOpenTour,
  onCloseTour,
}: AppShellProps) {
  const { user } = useAuth();
  const { isTaglish, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [internalTourOpen, setInternalTourOpen] = useState<boolean>(false);
  const [sidebarMarketFilter, setSidebarMarketFilter] = useState<SidebarMarketFilter>('all');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });
  const [phClockLabel, setPhClockLabel] = useState<string>(() =>
    formatPhTopBarClock(new Date()),
  );

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setPhClockLabel(formatPhTopBarClock(new Date()));
    }, 60_000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const resolvedTourOpen = tourOpen ?? internalTourOpen;
  const handleOpenTour = () => {
    if (onOpenTour) {
      onOpenTour();
    } else {
      setInternalTourOpen(true);
    }
  };
  const handleCloseTour = () => {
    if (onCloseTour) {
      onCloseTour();
    } else {
      setInternalTourOpen(false);
    }
  };

  const storageMode = getStorageMode();
  const isAdmin = user?.role === 'admin';

  const marketShortCodeMap = useMemo(
    () =>
      Object.fromEntries(
        LESSON_MARKET_CATEGORIES.map((category) => [category.id, category.shortCode]),
      ) as Record<LessonMarketCategory, string>,
    [],
  );

  const sidebarLessons = useMemo(() => {
    if (sidebarMarketFilter === 'all') {
      return CURRICULUM_LESSONS;
    }
    return CURRICULUM_LESSONS.filter((lesson) => lesson.marketCategory === sidebarMarketFilter);
  }, [sidebarMarketFilter]);

  const universalSidebarLessons = useMemo(
    () => CURRICULUM_LESSONS.filter((lesson) => lesson.marketCategory === 'general'),
    [],
  );

  const marketTrackSidebarLessons = useMemo(
    () => CURRICULUM_LESSONS.filter((lesson) => lesson.marketCategory !== 'general'),
    [],
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage quota errors in restricted browsers
    }
  }, [theme]);

  // Global Shift+Q shortcut for Mindset Vault
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.shiftKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        event.key.toLowerCase() === 'q' &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        if (vaultOpen) {
          onCloseVault();
        } else {
          onOpenVault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vaultOpen, onOpenVault, onCloseVault]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* Crisp TradingView Supercharts Top Toolbar */}
      <header className="sticky top-0 z-30 border-b border-terminal-border bg-terminal-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-2.5 px-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation sidebar"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-brand/45 hover:bg-terminal-elevated hover:text-terminal-text lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Link to="/" className="flex min-w-0 items-center gap-2">
              <img
                src="/favicon.svg"
                alt=""
                aria-hidden="true"
                className="h-7 w-7 shrink-0 rounded-lg shadow-sm"
              />
              <div className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold tracking-tight text-terminal-text">
                  TradeLab <span className="text-brand-text">Academy</span>
                </span>
                <span className="hidden text-[10px] text-terminal-muted sm:block">
                  {t('Visual Trading Desk', 'Visual na Pag-aaral')}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Return to Admin Portal pill — rendered ONLY for authenticated admin accounts */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400 sm:inline-flex"
              >
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Return to Admin Portal
              </Link>
            )}

            {/* Quiet live PH clock badge on tablet+ screens */}
            <span
              className="hidden h-8 items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 font-mono text-[10px] font-medium tabular-nums text-terminal-muted md:inline-flex"
              title="Philippine Time (Asia/Manila)"
            >
              <Clock className="h-3 w-3 text-brand-text" aria-hidden="true" />
              {phClockLabel}
            </span>

            {/* Quiet persistence indicator on wide screens */}
            <span
              className="hidden h-8 items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 text-[10px] font-medium text-terminal-muted xl:inline-flex"
              title="Current persistence mode"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  storageMode === 'supabase' ? 'bg-bull' : 'bg-sky-400'
                }`}
              />
              {storageMode === 'supabase' ? 'Cloud Sync' : 'Local Preview'}
            </span>

            {/* Sleek Compact EN | Taglish Language Toggle */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Switch language between English and Taglish"
              aria-pressed={isTaglish}
              className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors ${
                isTaglish
                  ? 'border-brand/45 bg-brand-soft text-brand-text'
                  : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-brand/40 hover:bg-terminal-elevated hover:text-terminal-text'
              }`}
            >
              <span className={!isTaglish ? 'text-terminal-text' : 'opacity-65'}>
                {UI_COPY.nav.enShort.en}
              </span>
              <span aria-hidden="true" className="opacity-35">
                |
              </span>
              <span className={isTaglish ? 'text-brand-text' : 'opacity-70'}>
                {UI_COPY.nav.taglishShort.taglish}
              </span>
            </button>

            {/* Always-accessible How to Use App Walkthrough Trigger */}
            <button
              type="button"
              onClick={handleOpenTour}
              aria-label="Open step-by-step app tutorial"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 text-[11px] font-medium text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden md:inline">{t('How to Use', 'Paano Gamitin')}</span>
            </button>

            {/* Always-accessible Mindset Vault Trigger */}
            <button
              type="button"
              onClick={onOpenVault}
              aria-label="Open Mindset Vault"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 text-[11px] font-medium text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
            >
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t('Mindset', 'Mindset')}</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-brand/45 hover:bg-terminal-elevated hover:text-terminal-text"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-terminal-muted" aria-hidden="true" />
              )}
            </button>

            {/* User Account Menu */}
            <UserAccountMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop Learner Sidebar (Zero Admin links) */}
        <aside
          aria-label="Primary navigation"
          className="hidden w-60 shrink-0 border-r border-terminal-border bg-terminal-surface/70 lg:block"
        >
          <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col justify-between p-3">
            <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden">
              <nav className="shrink-0 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-2 text-[13px] font-medium transition-all ${
                          isActive
                            ? 'border-brand bg-brand-soft font-semibold text-brand-text'
                            : 'border-transparent text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{t(item.en, item.taglish)}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="flex min-h-0 flex-1 flex-col border-t border-terminal-border pt-3">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-terminal-muted/85">
                    {t('Lessons', 'Mga Aralin')}
                  </p>
                  <Link
                    to="/academy"
                    className="font-mono text-[10px] font-semibold text-brand-text hover:underline tabular-nums"
                  >
                    {sidebarLessons.length}/{CURRICULUM_LESSONS.length}
                  </Link>
                </div>

                {/* Tiny Compact Market Filter */}
                <div
                  role="group"
                  aria-label="Filter sidebar curriculum by market"
                  className="no-scrollbar mt-1.5 flex flex-nowrap items-center gap-1 overflow-x-auto px-1 pb-1"
                >
                  <button
                    type="button"
                    onClick={() => setSidebarMarketFilter('all')}
                    aria-pressed={sidebarMarketFilter === 'all'}
                    className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors ${
                      sidebarMarketFilter === 'all'
                        ? SIDEBAR_PILL_ACTIVE.all
                        : 'bg-terminal-bg text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                    }`}
                  >
                    ALL
                  </button>
                  {LESSON_MARKET_CATEGORIES.map((category) => {
                    const isActive = sidebarMarketFilter === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSidebarMarketFilter(category.id)}
                        aria-pressed={isActive}
                        title={category.label}
                        className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors ${
                          isActive
                            ? SIDEBAR_PILL_ACTIVE[category.id]
                            : 'bg-terminal-bg text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                        }`}
                      >
                        {category.shortCode}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-1.5 flex-1 overflow-y-auto pr-1">
                  {sidebarMarketFilter === 'all' ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between px-2 pb-1">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-brand-text">
                            {t('Universal Core (All Markets)', 'Universal Core (Lahat)')}
                          </p>
                          <span className="font-mono text-[9px] text-terminal-muted tabular-nums">
                            01–{formatModuleOrder(universalSidebarLessons.length)}
                          </span>
                        </div>
                        <ul className="space-y-0.5">
                          {universalSidebarLessons.map((lesson) => {
                            const cleanShortTitle = expandAcronyms(lesson.title.split('(')[0].trim());
                            return (
                              <li key={lesson.id}>
                                <NavLink
                                  to={`/academy/${lesson.slug}`}
                                  title={expandAcronyms(lesson.title)}
                                  className={({ isActive }) =>
                                    `flex items-center justify-between gap-1.5 rounded-lg border-l-2 px-2 py-1.5 text-xs transition-colors ${
                                      isActive
                                        ? 'border-brand bg-brand-soft font-semibold text-brand-text'
                                        : 'border-transparent text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                                    }`
                                  }
                                >
                                  <span className="truncate">
                                    <span className="mr-1.5 font-mono text-[10px] opacity-65 tabular-nums">
                                      {formatModuleOrder(lesson.moduleOrder)}
                                    </span>
                                    {cleanShortTitle}
                                  </span>
                                  <span
                                    className={`shrink-0 rounded border px-1 py-0.5 font-mono text-[9px] font-semibold leading-none ${MARKET_TAG_STYLES[lesson.marketCategory]}`}
                                  >
                                    {marketShortCodeMap[lesson.marketCategory] ?? 'CORE'}
                                  </span>
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="border-t border-terminal-border pt-2">
                        <div className="flex items-center justify-between px-2 pb-1">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                            {t('Market Tracks', 'Hiwalay na Markets')}
                          </p>
                          <span className="font-mono text-[9px] text-terminal-muted tabular-nums">
                            {formatModuleOrder(universalSidebarLessons.length + 1)}–
                            {formatModuleOrder(CURRICULUM_LESSONS.length)}
                          </span>
                        </div>
                        <ul className="space-y-0.5">
                          {marketTrackSidebarLessons.map((lesson) => {
                            const cleanShortTitle = expandAcronyms(lesson.title.split('(')[0].trim());
                            return (
                              <li key={lesson.id}>
                                <NavLink
                                  to={`/academy/${lesson.slug}`}
                                  title={expandAcronyms(lesson.title)}
                                  className={({ isActive }) =>
                                    `flex items-center justify-between gap-1.5 rounded-lg border-l-2 px-2 py-1.5 text-xs transition-colors ${
                                      isActive
                                        ? 'border-brand bg-brand-soft font-semibold text-brand-text'
                                        : 'border-transparent text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                                    }`
                                  }
                                >
                                  <span className="truncate">
                                    <span className="mr-1.5 font-mono text-[10px] opacity-65 tabular-nums">
                                      {formatModuleOrder(lesson.moduleOrder)}
                                    </span>
                                    {cleanShortTitle}
                                  </span>
                                  <span
                                    className={`shrink-0 rounded border px-1 py-0.5 font-mono text-[9px] font-semibold leading-none ${MARKET_TAG_STYLES[lesson.marketCategory]}`}
                                  >
                                    {marketShortCodeMap[lesson.marketCategory] ?? 'CORE'}
                                  </span>
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-0.5">
                      {sidebarLessons.map((lesson) => {
                        const cleanShortTitle = expandAcronyms(lesson.title.split('(')[0].trim());
                        return (
                          <li key={lesson.id}>
                            <NavLink
                              to={`/academy/${lesson.slug}`}
                              title={expandAcronyms(lesson.title)}
                              className={({ isActive }) =>
                                `flex items-center justify-between gap-1.5 rounded-lg border-l-2 px-2 py-1.5 text-xs transition-colors ${
                                  isActive
                                    ? 'border-brand bg-brand-soft font-semibold text-brand-text'
                                    : 'border-transparent text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                                }`
                              }
                            >
                              <span className="truncate">
                                <span className="mr-1.5 font-mono text-[10px] opacity-65 tabular-nums">
                                  {formatModuleOrder(lesson.moduleOrder)}
                                </span>
                                {cleanShortTitle}
                              </span>
                              <span
                                className={`shrink-0 rounded border px-1 py-0.5 font-mono text-[9px] font-semibold leading-none ${MARKET_TAG_STYLES[lesson.marketCategory]}`}
                              >
                                {marketShortCodeMap[lesson.marketCategory] ?? 'CORE'}
                              </span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2.5 shrink-0 rounded-lg border border-terminal-border bg-terminal-bg/80 px-3 py-2.5 text-[11px] text-terminal-muted">
              <p className="font-semibold text-terminal-text">
                {t('Process Over Impulse', 'Plano Bago Click')}
              </p>
              <p className="mt-0.5 leading-snug">
                {t(
                  'Check trend, liquidity, and 1% risk before every trade.',
                  'I-check muna ang trend, liquidity, at 1% risk bago mag-entry.',
                )}
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="flex w-72 max-w-[82vw] flex-col overflow-y-auto rounded-r-xl border-r border-terminal-border bg-terminal-surface p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-terminal-border pb-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/favicon.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-7 rounded-lg"
                  />
                  <span className="text-sm font-semibold text-terminal-text">
                    TradeLab <span className="text-brand-text">Academy</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-terminal-elevated text-terminal-muted transition-colors hover:text-terminal-text"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400"
                >
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  Return to Admin Portal
                </Link>
              )}

              <nav className="mt-3 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'border-brand bg-brand-soft font-semibold text-brand-text'
                            : 'border-transparent text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {t(item.en, item.taglish)}
                    </NavLink>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenTour();
                }}
                className="mt-3 flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
              >
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                {t('How to Use App (6-Step Tour)', 'Paano Gamitin ang App (Gabay)')}
              </button>

              <div className="mt-5 border-t border-terminal-border pt-4">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-terminal-muted">
                    {t('Lessons', 'Mga Aralin')}
                  </p>
                  <Link
                    to="/academy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-semibold text-brand-text"
                  >
                    {t(`All ${CURRICULUM_LESSONS.length} →`, `Lahat (${CURRICULUM_LESSONS.length}) →`)}
                  </Link>
                </div>
                <ul className="mt-2 space-y-0.5">
                  {CURRICULUM_LESSONS.map((lesson) => (
                    <li key={lesson.id}>
                      <NavLink
                        to={`/academy/${lesson.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
                      >
                        <span className="truncate">
                          <span className="mr-1.5 font-mono text-[10px] opacity-65 tabular-nums">
                            {formatModuleOrder(lesson.moduleOrder)}
                          </span>
                          {expandAcronyms(lesson.title.split('(')[0].trim())}
                        </span>
                        <span
                          className={`shrink-0 rounded border px-1 py-0.5 font-mono text-[9px] font-semibold leading-none ${MARKET_TAG_STYLES[lesson.marketCategory]}`}
                        >
                          {marketShortCodeMap[lesson.marketCategory] ?? 'GEN'}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close navigation backdrop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 bg-black/55 backdrop-blur-sm"
            />
          </div>
        )}

        {/* Main Workspace */}
        <main
          id="main-content"
          className="min-w-0 flex-1 px-3.5 py-4 pb-24 sm:px-5 lg:px-7 lg:py-6 lg:pb-10"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (5 clean slots: Home, Academy, Paper, Backtest, Journal) */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-terminal-border bg-terminal-surface/95 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {MOBILE_BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-soft font-semibold text-brand-text'
                      : 'text-terminal-muted hover:text-terminal-text'
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{t(item.en, item.taglish)}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <MindsetVaultDrawer isOpen={vaultOpen} onClose={onCloseVault} />
      <AppWalkthroughModal isOpen={resolvedTourOpen} onClose={handleCloseTour} />
    </div>
  );
}
