import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Activity,
  BookOpen,
  Bookmark,
  CandlestickChart,
  Database,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Menu,
  Moon,
  Shield,
  Sun,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CURRICULUM_LESSONS } from '../../data/curriculum';
import { getStorageMode } from '../../lib/supabase';
import { UserAccountMenu } from '../auth/UserAccountMenu';
import { MindsetVaultDrawer } from '../quotes/MindsetVaultDrawer';

export interface AppShellProps {
  children: ReactNode;
  vaultOpen: boolean;
  onOpenVault: () => void;
  onCloseVault: () => void;
}

const THEME_STORAGE_KEY = 'tradelab_theme_v1';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  {
    to: `/academy/${CURRICULUM_LESSONS[0]?.slug ?? 'market-structure'}`,
    label: 'Trading Academy',
    icon: BookOpen,
    end: false,
  },
  { to: '/practice', label: 'Practice Exercises', icon: GraduationCap, end: false },
  { to: '/backtest', label: 'Market Backtester', icon: LineChart, end: false },
  { to: '/lab', label: 'Trading Lab', icon: CandlestickChart, end: false },
  { to: '/library', label: 'My Library', icon: Bookmark, end: false },
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
}: AppShellProps) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });

  const storageMode = getStorageMode();
  const isAdmin = user?.role === 'admin';

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
      {/* Top Institutional Header */}
      <header className="sticky top-0 z-30 border-b border-terminal-border bg-terminal-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation sidebar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-terminal-border bg-terminal-bg text-terminal-muted lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-400">
                <Activity className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <span className="block text-sm font-bold tracking-tight text-terminal-text">
                  TradeLab <span className="text-emerald-400">Academy</span>
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-widest text-terminal-muted sm:block">
                  Visual Learning Terminal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Subtle Return to Admin Portal pill — rendered ONLY for authenticated admin accounts */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400 transition-colors hover:bg-amber-500/20 sm:inline-flex"
              >
                <Shield className="h-3 w-3" aria-hidden="true" />
                Return to Admin Portal
              </Link>
            )}

            {/* Storage Mode Badge */}
            <span
              className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] xl:inline-flex ${
                storageMode === 'supabase'
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400'
                  : 'border-sky-500/35 bg-sky-500/10 text-sky-400'
              }`}
              title="Current persistence mode"
            >
              <Database className="h-3 w-3" aria-hidden="true" />
              {storageMode === 'supabase' ? 'Supabase Live' : 'Local Preview'}
            </span>

            {/* Always-accessible Mindset Vault Trigger */}
            <button
              type="button"
              onClick={onOpenVault}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20"
            >
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Mindset Vault</span>
              <kbd className="hidden rounded border border-amber-500/35 bg-terminal-bg px-1 py-0.5 font-mono text-[10px] text-amber-300 md:inline">
                Shift+Q
              </kbd>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-emerald-500/40 hover:text-terminal-text"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" aria-hidden="true" />
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
          className="hidden w-60 shrink-0 border-r border-terminal-border bg-terminal-surface/50 lg:block"
        >
          <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col justify-between p-3.5">
            <div className="space-y-5 overflow-y-auto">
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                          isActive
                            ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                            : 'border border-transparent text-terminal-muted hover:bg-terminal-elevated/70 hover:text-terminal-text'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-terminal-border pt-4">
                <p className="px-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-terminal-muted">
                  Curriculum Modules
                </p>
                <ul className="mt-2 space-y-1">
                  {CURRICULUM_LESSONS.map((lesson) => (
                    <li key={lesson.id}>
                      <NavLink
                        to={`/academy/${lesson.slug}`}
                        className={({ isActive }) =>
                          `flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                            isActive
                              ? 'bg-terminal-elevated font-semibold text-emerald-400'
                              : 'text-terminal-muted hover:bg-terminal-elevated/50 hover:text-terminal-text'
                          }`
                        }
                      >
                        <span className="truncate">
                          <span className="mr-1.5 font-mono text-[10px] opacity-70 tabular-nums">
                            0{lesson.moduleOrder}
                          </span>
                          {lesson.title.split('(')[0].trim()}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-terminal-border bg-terminal-bg/80 p-3 text-[11px] text-terminal-muted">
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
            <div className="w-72 overflow-y-auto border-r border-terminal-border bg-terminal-surface p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-terminal-border pb-3">
                <span className="text-sm font-bold text-terminal-text">Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="rounded-lg p-1 text-terminal-muted"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 flex items-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400"
                >
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  Return to Admin Portal
                </Link>
              )}

              <nav className="mt-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400'
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

              <div className="mt-5 border-t border-terminal-border pt-4">
                <p className="px-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-terminal-muted">
                  Curriculum
                </p>
                <ul className="mt-2 space-y-1">
                  {CURRICULUM_LESSONS.map((lesson) => (
                    <li key={lesson.id}>
                      <NavLink
                        to={`/academy/${lesson.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-2.5 py-1.5 text-xs text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text"
                      >
                        0{lesson.moduleOrder}. {lesson.title}
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
              className="flex-1 bg-slate-950/60"
            />
          </div>
        )}

        {/* Main Workspace */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <MindsetVaultDrawer isOpen={vaultOpen} onClose={onCloseVault} />
    </div>
  );
}
