import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Award,
  BookMarked,
  BookOpen,
  Bookmark,
  CandlestickChart,
  ChevronDown,
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
import { PH_TIME_ZONE } from '../../lib/marketTime';
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

interface TopNavItem {
  to: string;
  en: string;
  taglish: string;
  srLabel?: string;
  end: boolean;
}

interface DrawerNavItem {
  to: string;
  en: string;
  taglish: string;
  icon: typeof LayoutDashboard;
  end: boolean;
}

const PRIMARY_TOP_NAV: TopNavItem[] = [
  { to: '/', en: 'Overview', taglish: 'Overview', end: true },
  { to: '/academy', en: 'Academy', taglish: 'Academy', end: false },
  { to: '/paper-trading', en: 'Simulator', taglish: 'Simulator', end: false },
  {
    to: '/backtest',
    en: 'Backtest',
    taglish: 'Backtest',
    srLabel: 'Market Backtester',
    end: false,
  },
  { to: '/journal', en: 'Journal', taglish: 'Journal', end: false },
];

const MORE_NAV_ITEMS: DrawerNavItem[] = [
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
    taglish: 'Practice Exercises',
    icon: GraduationCap,
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

const DRAWER_LEARN_ITEMS: DrawerNavItem[] = [
  { to: '/', en: 'Overview', taglish: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/academy', en: 'Academy', taglish: 'Academy', icon: BookOpen, end: false },
  {
    to: '/glossary',
    en: 'Glossary & Cards',
    taglish: 'Glossary at Cards',
    icon: BookMarked,
    end: false,
  },
  { to: '/evaluation', en: 'Evaluation', taglish: 'Ebalwasyon', icon: Award, end: false },
  { to: '/library', en: 'My Library', taglish: 'My Library', icon: Bookmark, end: false },
];

const DRAWER_PRACTICE_ITEMS: DrawerNavItem[] = [
  {
    to: '/paper-trading',
    en: 'Paper Simulator',
    taglish: 'Paper Simulator',
    icon: Wallet,
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
    to: '/journal',
    en: 'Trade Journal',
    taglish: 'Trade Journal',
    icon: NotebookPen,
    end: false,
  },
  {
    to: '/practice',
    en: 'Practice Exercises',
    taglish: 'Practice Exercises',
    icon: GraduationCap,
    end: false,
  },
  {
    to: '/lab',
    en: 'Trading Lab',
    taglish: 'Trading Lab',
    icon: CandlestickChart,
    end: false,
  },
];

const MOBILE_BOTTOM_NAV: DrawerNavItem[] = [
  { to: '/', en: 'Home', taglish: 'Home', icon: Home, end: true },
  { to: '/academy', en: 'Academy', taglish: 'Aralin', icon: BookOpen, end: false },
  { to: '/paper-trading', en: 'Paper', taglish: 'Demo', icon: Wallet, end: false },
  { to: '/backtest', en: 'Backtest', taglish: 'Replay', icon: LineChart, end: false },
  { to: '/journal', en: 'Journal', taglish: 'Journal', icon: NotebookPen, end: false },
];

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
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
  const [internalTourOpen, setInternalTourOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setMoreMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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

  const isAdmin = user?.role === 'admin';
  const isMoreRouteActive = MORE_NAV_ITEMS.some((item) =>
    location.pathname.startsWith(item.to),
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
      {/* Architectural 60px Sticky Editorial Top Bar */}
      <header className="sticky top-0 z-30 h-[60px] border-b border-terminal-border bg-terminal-surface/95">
        <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile drawer button + Brand wordmark */}
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text lg:hidden tl-press"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Link
              to="/"
              className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              <img
                src="/favicon.svg"
                alt=""
                aria-hidden="true"
                className="h-6 w-6 shrink-0 rounded-md"
              />
              <span className="truncate text-[15px] font-semibold tracking-tight text-terminal-text">
                TradeLab
              </span>
            </Link>
          </div>

          {/* Center: Single-line text-first primary navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden h-full items-center gap-1 lg:flex"
          >
            {PRIMARY_TOP_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative inline-flex h-full items-center whitespace-nowrap px-3 text-[13px] transition-colors ${
                    isActive
                      ? 'font-semibold text-terminal-text after:absolute after:inset-x-2 after:bottom-0 after:h-[2px] after:bg-brand'
                      : 'font-medium text-terminal-muted hover:text-terminal-text'
                  }`
                }
              >
                {item.srLabel ? (
                  <>
                    <span aria-hidden="true">{t(item.en, item.taglish)}</span>
                    <span className="sr-only">{item.srLabel}</span>
                  </>
                ) : (
                  <span>{t(item.en, item.taglish)}</span>
                )}
              </NavLink>
            ))}

            {/* More Dropdown */}
            <div ref={moreMenuRef} className="relative flex h-full items-center">
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                aria-expanded={moreMenuOpen}
                aria-haspopup="menu"
                className={`relative inline-flex h-full items-center gap-1 whitespace-nowrap px-3 text-[13px] transition-colors ${
                  isMoreRouteActive || moreMenuOpen
                    ? 'font-semibold text-terminal-text after:absolute after:inset-x-2 after:bottom-0 after:h-[2px] after:bg-brand'
                    : 'font-medium text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <span>{t('More', 'Iba Pa')}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${
                    moreMenuOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {moreMenuOpen && (
                <div
                  role="menu"
                  aria-label="Additional tools and resources"
                  className="absolute left-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface p-1.5 shadow-lg"
                >
                  {MORE_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        role="menuitem"
                        onClick={() => setMoreMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition-colors ${
                            isActive
                              ? 'bg-brand-soft font-semibold text-brand-text'
                              : 'font-medium text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                          }`
                        }
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{t(item.en, item.taglish)}</span>
                      </NavLink>
                    );
                  })}

                  <div className="my-1.5 border-t border-terminal-border" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      handleOpenTour();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs font-medium text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
                  >
                    <HelpCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{t('How to Use (App Tour)', 'Paano Gamitin (App Tour)')}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Quiet utility controls */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <span
              className="hidden pr-1.5 font-mono text-xs tabular-nums text-terminal-muted xl:inline"
              title="Philippine Time (Asia/Manila)"
            >
              {phClockLabel}
            </span>

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 whitespace-nowrap rounded-md border border-amber-500/35 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/15 dark:text-amber-400 sm:inline-flex"
              >
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Return to Admin Portal</span>
              </Link>
            )}

            <button
              type="button"
              onClick={toggleLang}
              aria-label="Switch language between English and Taglish"
              aria-pressed={isTaglish}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text tl-press"
            >
              <span className={!isTaglish ? 'font-semibold text-terminal-text' : 'opacity-60'}>
                EN
              </span>
              <span aria-hidden="true" className="opacity-35">
                /
              </span>
              <span className={isTaglish ? 'font-semibold text-brand-text' : 'opacity-60'}>
                TL
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenVault}
              aria-label="Open Mindset Vault"
              title="Mindset Vault (Shift+Q)"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-amber-500 dark:hover:text-amber-400 tl-press"
            >
              <Flame className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleOpenTour}
              aria-label="Open step-by-step app tutorial"
              title={t('How to Use (App Tour)', 'Paano Gamitin (Gabay)')}
              className="hidden h-8 w-8 items-center justify-center rounded-md text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text sm:inline-flex tl-press"
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text tl-press"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <UserAccountMenu />
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
          className="fixed inset-0 z-40 flex lg:hidden"
        >
          <div className="flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-terminal-border bg-terminal-surface p-4">
            <div className="flex items-center justify-between border-b border-terminal-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <img
                  src="/favicon.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6 rounded-md"
                />
                <div className="leading-tight">
                  <span className="block text-[15px] font-semibold tracking-tight text-terminal-text">
                    TradeLab
                  </span>
                  <span className="block font-mono text-[11px] tabular-nums text-terminal-muted">
                    {phClockLabel}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 flex items-center gap-2 rounded-md border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400"
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Return to Admin Portal</span>
              </Link>
            )}

            <nav aria-label="Learn routes" className="mt-4">
              <p className="px-2.5 pb-1.5 text-xs font-medium text-terminal-muted">
                {t('Learn', 'Pag-aaral')}
              </p>
              <div className="space-y-0.5">
                {DRAWER_LEARN_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-brand-soft font-semibold text-brand-text'
                            : 'font-medium text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{t(item.en, item.taglish)}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            <nav
              aria-label="Practice and tools routes"
              className="mt-5 border-t border-terminal-border pt-4"
            >
              <p className="px-2.5 pb-1.5 text-xs font-medium text-terminal-muted">
                {t('Practice & Tools', 'Practice at Tools')}
              </p>
              <div className="space-y-0.5">
                {DRAWER_PRACTICE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-brand-soft font-semibold text-brand-text'
                            : 'font-medium text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{t(item.en, item.taglish)}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            <div className="mt-auto border-t border-terminal-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenTour();
                }}
                className="flex w-full items-center gap-2.5 rounded-md border border-terminal-border px-3 py-2 text-xs font-medium text-terminal-text transition-colors hover:bg-terminal-elevated"
              >
                <HelpCircle className="h-4 w-4 text-terminal-muted" aria-hidden="true" />
                <span>{t('How to Use (App Tour)', 'Paano Gamitin (App Tour)')}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close navigation backdrop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex-1 bg-black/50"
          />
        </div>
      )}

      {/* Main Content Area */}
      <main
        id="main-content"
        className="mx-auto min-w-0 max-w-[1360px] px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-9 lg:pb-14 tl-page-enter"
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (5 clean touch-friendly tabs) */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-terminal-border bg-terminal-surface/95 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <div className="mx-auto grid h-14 max-w-md grid-cols-5">
          {MOBILE_BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[10px] transition-colors ${
                    isActive
                      ? 'font-semibold text-brand-text after:absolute after:inset-x-3 after:top-0 after:h-[2px] after:bg-brand'
                      : 'font-medium text-terminal-muted hover:text-terminal-text'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="max-w-full truncate">{t(item.en, item.taglish)}</span>
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
