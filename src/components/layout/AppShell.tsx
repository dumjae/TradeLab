import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  CandlestickChart,
  Flame,
  GraduationCap,
  Home,
  LayoutDashboard,
  LineChart,
  Menu,
  Moon,
  Shield,
  Sun,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  CURRICULUM_LESSONS,
  LESSON_MARKET_CATEGORIES,
} from '../../data/curriculum';
import { getStorageMode } from '../../lib/supabase';
import type { LessonMarketCategory } from '../../types/academy';
import { UserAccountMenu } from '../auth/UserAccountMenu';
import { MindsetVaultDrawer } from '../quotes/MindsetVaultDrawer';

export interface AppShellProps {
  children: ReactNode;
  vaultOpen: boolean;
  onOpenVault: () => void;
  onCloseVault: () => void;
}

type SidebarMarketFilter = 'all' | LessonMarketCategory;

const THEME_STORAGE_KEY = 'tradelab_theme_v1';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/academy', label: 'Trading Academy', icon: BookOpen, end: false },
  { to: '/practice', label: 'Practice Exercises', icon: GraduationCap, end: false },
  { to: '/backtest', label: 'Market Backtester', icon: LineChart, end: false },
  { to: '/lab', label: 'Trading Lab', icon: CandlestickChart, end: false },
  { to: '/library', label: 'My Library', icon: Bookmark, end: false },
];

const MOBILE_BOTTOM_NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/academy', label: 'Academy', icon: BookOpen, end: false },
  { to: '/backtest', label: 'Backtest', icon: LineChart, end: false },
  { to: '/practice', label: 'Practice', icon: GraduationCap, end: false },
  { to: '/library', label: 'Library', icon: Bookmark, end: false },
];

const MARKET_TAG_STYLES: Record<LessonMarketCategory, string> = {
  general: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  forex: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  indices: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  crypto: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  stocks: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

const SIDEBAR_PILL_ACTIVE: Record<SidebarMarketFilter, string> = {
  all: 'bg-emerald-500 text-slate-950 font-semibold',
  general: 'bg-emerald-500 text-slate-950 font-semibold',
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
}: AppShellProps) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarMarketFilter, setSidebarMarketFilter] = useState<SidebarMarketFilter>('all');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });

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
      {/* Minimalist Top Bar */}
      <header className="sticky top-0 z-30 border-b border-terminal-border/80 bg-terminal-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation sidebar"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-emerald-500/40 hover:text-terminal-text lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              <img
                src="/favicon.svg"
                alt=""
                aria-hidden="true"
                className="h-8 w-8 shrink-0 rounded-xl shadow-sm"
              />
              <div className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold tracking-tight text-terminal-text">
                  TradeLab <span className="text-emerald-500 dark:text-emerald-400">Academy</span>
                </span>
                <span className="hidden text-[11px] text-terminal-muted sm:block">
                  Visual Learning Terminal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Return to Admin Portal pill — rendered ONLY for authenticated admin accounts */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400 sm:inline-flex"
              >
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Return to Admin Portal
              </Link>
            )}

            {/* Quiet persistence indicator on wide screens */}
            <span
              className="hidden items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg/80 px-3 py-1.5 text-[11px] font-medium text-terminal-muted xl:inline-flex"
              title="Current persistence mode"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  storageMode === 'supabase' ? 'bg-emerald-400' : 'bg-sky-400'
                }`}
              />
              {storageMode === 'supabase' ? 'Cloud Sync' : 'Local Preview'}
            </span>

            {/* Always-accessible Mindset Vault Trigger */}
            <button
              type="button"
              onClick={onOpenVault}
              aria-label="Open Mindset Vault"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
            >
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Mindset</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-emerald-500/40 hover:text-terminal-text"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" aria-hidden="true" />
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
          className="hidden w-64 shrink-0 border-r border-terminal-border/70 bg-terminal-surface/40 lg:block"
        >
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-between p-4">
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
              <nav className="shrink-0 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-600 shadow-sm dark:text-emerald-400'
                            : 'text-terminal-muted hover:bg-terminal-elevated/70 hover:text-terminal-text'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="flex min-h-0 flex-1 flex-col border-t border-terminal-border/70 pt-4">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-terminal-muted/80">
                    Curriculum Modules
                  </p>
                  <Link
                    to="/academy"
                    className="font-mono text-[10px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400 tabular-nums"
                  >
                    {sidebarLessons.length}/{CURRICULUM_LESSONS.length}
                  </Link>
                </div>

                {/* Tiny Compact Market Filter */}
                <div
                  role="group"
                  aria-label="Filter sidebar curriculum by market"
                  className="no-scrollbar mt-2 flex flex-nowrap items-center gap-1 overflow-x-auto px-1 pb-1"
                >
                  <button
                    type="button"
                    onClick={() => setSidebarMarketFilter('all')}
                    aria-pressed={sidebarMarketFilter === 'all'}
                    className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors ${
                      sidebarMarketFilter === 'all'
                        ? SIDEBAR_PILL_ACTIVE.all
                        : 'bg-terminal-bg text-terminal-muted hover:text-terminal-text'
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
                        className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors ${
                          isActive
                            ? SIDEBAR_PILL_ACTIVE[category.id]
                            : 'bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                        }`}
                      >
                        {category.shortCode}
                      </button>
                    );
                  })}
                </div>

                <ul className="mt-2 flex-1 space-y-0.5 overflow-y-auto pr-1">
                  {sidebarLessons.map((lesson) => (
                    <li key={lesson.id}>
                      <NavLink
                        to={`/academy/${lesson.slug}`}
                        className={({ isActive }) =>
                          `flex items-center justify-between gap-1.5 rounded-xl px-2.5 py-1.5 text-xs transition-colors ${
                            isActive
                              ? 'bg-terminal-elevated font-semibold text-emerald-600 dark:text-emerald-400'
                              : 'text-terminal-muted hover:bg-terminal-elevated/50 hover:text-terminal-text'
                          }`
                        }
                      >
                        <span className="truncate">
                          <span className="mr-1.5 font-mono text-[10px] opacity-65 tabular-nums">
                            {formatModuleOrder(lesson.moduleOrder)}
                          </span>
                          {lesson.title.split('(')[0].trim()}
                        </span>
                        <span
                          className={`shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-semibold leading-none ${MARKET_TAG_STYLES[lesson.marketCategory]}`}
                        >
                          {marketShortCodeMap[lesson.marketCategory] ?? 'GEN'}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 shrink-0 rounded-2xl border border-terminal-border/70 bg-terminal-bg/70 p-3.5 text-xs text-terminal-muted">
              <p className="font-semibold text-terminal-text">Process Over Impulse</p>
              <p className="mt-0.5 leading-relaxed">
                Verify structure, liquidity, and 1R risk before every execution.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="flex w-72 max-w-[82vw] flex-col overflow-y-auto rounded-r-3xl border-r border-terminal-border bg-terminal-surface p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-terminal-border/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/favicon.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-7 rounded-lg"
                  />
                  <span className="text-sm font-semibold text-terminal-text">TradeLab</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-terminal-elevated text-terminal-muted transition-colors hover:text-terminal-text"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-500/35 bg-amber-500/10 px-3.5 py-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
                >
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  Return to Admin Portal
                </Link>
              )}

              <nav className="mt-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="mt-6 border-t border-terminal-border/80 pt-5">
                <div className="flex items-center justify-between px-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-terminal-muted">
                    Curriculum Modules
                  </p>
                  <Link
                    to="/academy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                  >
                    All {CURRICULUM_LESSONS.length} →
                  </Link>
                </div>
                <ul className="mt-2.5 space-y-1">
                  {CURRICULUM_LESSONS.map((lesson) => (
                    <li key={lesson.id}>
                      <NavLink
                        to={`/academy/${lesson.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
                      >
                        <span className="truncate">
                          <span className="mr-1.5 font-mono text-[10px] opacity-65 tabular-nums">
                            {formatModuleOrder(lesson.moduleOrder)}
                          </span>
                          {lesson.title.split('(')[0].trim()}
                        </span>
                        <span
                          className={`shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-semibold leading-none ${MARKET_TAG_STYLES[lesson.marketCategory]}`}
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
              className="flex-1 bg-slate-950/55 backdrop-blur-sm"
            />
          </div>
        )}

        {/* Main Workspace */}
        <main
          id="main-content"
          className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-10"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-terminal-border/80 bg-terminal-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md lg:hidden"
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
                  `flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'text-terminal-muted hover:text-terminal-text'
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <MindsetVaultDrawer isOpen={vaultOpen} onClose={onCloseVault} />
    </div>
  );
}
