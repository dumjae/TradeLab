import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  Moon,
  Quote,
  Shield,
  Sun,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStorageMode } from '../../lib/supabase';
import { UserAccountMenu } from '../auth/UserAccountMenu';

export interface AdminShellProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'tradelab_theme_v1';

const ADMIN_NAV_ITEMS = [
  { to: '/admin', label: 'Admin Overview', shortLabel: 'Overview', icon: LayoutDashboard, end: true },
  {
    to: '/admin/visual-library',
    label: 'Visual Library Curation',
    shortLabel: 'Library',
    icon: Library,
    end: false,
  },
  { to: '/admin/quotes', label: 'Quotes Manager', shortLabel: 'Quotes', icon: Quote, end: false },
];

export function AdminShell({ children }: AdminShellProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });

  const storageMode = getStorageMode();

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* Minimalist Governance Header */}
      <header className="sticky top-0 z-30 border-b border-amber-500/25 bg-terminal-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle admin navigation sidebar"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-amber-500/40 hover:text-terminal-text lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Link to="/admin" className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-amber-500/35 bg-amber-500/15 text-amber-500 dark:text-amber-400">
                <Shield className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold tracking-tight text-terminal-text">
                  TradeLab <span className="text-amber-500 dark:text-amber-400">Admin Portal</span>
                </span>
                <span className="hidden text-[11px] text-terminal-muted sm:block">
                  Governance &amp; Curriculum Curation
                </span>
              </div>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="hidden items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-bg/80 px-3 py-1.5 text-[11px] font-medium text-terminal-muted md:inline-flex"
              title="Current persistence mode"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  storageMode === 'supabase' ? 'bg-emerald-400' : 'bg-sky-400'
                }`}
              />
              {storageMode === 'supabase' ? 'Supabase RLS' : 'Local Preview'}
            </span>

            <Link
              to="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Switch to Learner View</span>
              <span className="sm:hidden">Learner</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-amber-500/40 hover:text-terminal-text"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" aria-hidden="true" />
              )}
            </button>

            <UserAccountMenu inAdminPortal />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop Admin Sidebar */}
        <aside
          aria-label="Admin Portal navigation"
          className="hidden w-64 shrink-0 border-r border-terminal-border/70 bg-terminal-surface/40 lg:block"
        >
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-between p-4">
            <div className="space-y-6 overflow-y-auto pr-1">
              <div>
                <p className="px-3.5 text-[11px] font-medium uppercase tracking-wider text-amber-500 dark:text-amber-400">
                  Admin Workspace
                </p>
                <nav className="mt-2.5 space-y-1">
                  {ADMIN_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
                            isActive
                              ? 'bg-amber-500/15 text-amber-600 shadow-sm dark:text-amber-400'
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
              </div>

              <div className="border-t border-terminal-border/70 pt-5">
                <p className="px-3.5 text-[11px] font-medium uppercase tracking-wider text-terminal-muted/80">
                  Workspace
                </p>
                <div className="mt-2.5 space-y-1.5">
                  <Link
                    to="/"
                    className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/15 dark:text-emerald-400"
                  >
                    <ArrowLeftRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Switch to Learner View
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-2xl border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-xs font-semibold text-rose-500 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 dark:text-rose-400"
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs text-terminal-muted">
              <p className="font-semibold text-amber-600 dark:text-amber-400">
                Role-Isolated Governance
              </p>
              <p className="mt-1 leading-relaxed">
                Standard learner accounts cannot view or enter Admin Portal routes.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Admin Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="flex w-72 max-w-[82vw] flex-col overflow-y-auto rounded-r-3xl border-r border-terminal-border bg-terminal-surface p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-terminal-border/80 pb-4">
                <span className="text-sm font-semibold text-amber-500 dark:text-amber-400">
                  Admin Portal
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close admin mobile menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-terminal-elevated text-terminal-muted transition-colors hover:text-terminal-text"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {ADMIN_NAV_ITEMS.map((item) => {
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
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
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

              <div className="mt-6 space-y-2 border-t border-terminal-border/80 pt-5">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                  Switch to Learner View
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-semibold text-rose-500 dark:text-rose-400"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close admin navigation backdrop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 bg-slate-950/55 backdrop-blur-sm"
            />
          </div>
        )}

        {/* Admin Workspace Content */}
        <main
          id="admin-main-content"
          className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-10"
        >
          {children}
        </main>
      </div>

      {/* Mobile Admin Bottom Navigation Bar */}
      <nav
        aria-label="Admin mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-terminal-border/80 bg-terminal-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'text-terminal-muted hover:text-terminal-text'
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{item.shortLabel}</span>
              </NavLink>
            );
          })}
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-medium text-emerald-600 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">Learner View</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
