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
      {/* Architectural Editorial Admin Top Bar */}
      <header className="sticky top-0 z-30 border-b border-terminal-border bg-terminal-surface">
        <div className="mx-auto flex h-[60px] max-w-[1360px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle admin navigation sidebar"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:text-terminal-text lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Link to="/admin" className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-caution/35 bg-caution/10 text-caution">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="truncate text-sm font-semibold tracking-tight text-terminal-text">
                TradeLab <span className="text-caution">Admin</span>
              </span>
            </Link>

            <nav aria-label="Admin Portal navigation" className="ml-4 hidden h-[60px] items-center gap-1 lg:flex">
              {ADMIN_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `relative inline-flex h-full items-center px-3 text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'font-semibold text-terminal-text after:absolute after:inset-x-2 after:bottom-0 after:h-[2px] after:bg-caution'
                        : 'text-terminal-muted hover:text-terminal-text'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="hidden items-center gap-1.5 font-mono text-[11px] text-terminal-muted md:inline-flex"
              title="Current persistence mode"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  storageMode === 'supabase' ? 'bg-bull' : 'bg-brand'
                }`}
              />
              {storageMode === 'supabase' ? 'Supabase RLS' : 'Local Preview'}
            </span>

            <Link
              to="/"
              className="tl-press inline-flex h-8 items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-bg px-3 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45 hover:text-brand-text"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Switch to Learner View</span>
              <span className="sm:hidden">Learner</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:text-terminal-text"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-caution" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-terminal-muted" aria-hidden="true" />
              )}
            </button>

            <UserAccountMenu inAdminPortal />
          </div>
        </div>
      </header>

      {/* Mobile Admin Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-terminal-border bg-terminal-surface p-5">
            <div className="flex items-center justify-between border-b border-terminal-border pb-4">
              <span className="text-sm font-semibold text-caution">Admin Portal</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close admin mobile menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:text-terminal-text"
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
                      `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-caution/15 text-caution'
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

            <div className="mt-6 space-y-2 border-t border-terminal-border pt-5">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-md border border-brand/35 bg-brand-soft px-3 py-2 text-xs font-semibold text-brand-text"
              >
                <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                Switch to Learner View
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-md border border-bear/30 bg-bear/10 px-3 py-2 text-xs font-semibold text-bear"
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
            className="flex-1 bg-black/65"
          />
        </div>
      )}

      {/* Admin Workspace Content */}
      <main
        id="admin-main-content"
        className="tl-page-enter mx-auto min-w-0 max-w-[1360px] px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-12"
      >
        {children}
      </main>

      {/* Mobile Admin Bottom Navigation Bar */}
      <nav
        aria-label="Admin mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-terminal-border bg-terminal-surface px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 lg:hidden"
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
                  `flex flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'bg-caution/15 text-caution'
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
            className="flex flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[10px] font-medium text-brand-text transition-colors hover:bg-brand-soft"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">Learner View</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
