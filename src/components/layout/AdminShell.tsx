import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  Database,
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
  { to: '/admin', label: 'Admin Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/visual-library', label: 'Visual Library Curation', icon: Library, end: false },
  { to: '/admin/quotes', label: 'Quotes Manager', icon: Quote, end: false },
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
      {/* Top Governance Header */}
      <header className="sticky top-0 z-30 border-b border-amber-500/30 bg-terminal-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle admin navigation sidebar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-terminal-border bg-terminal-bg text-terminal-muted lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Link to="/admin" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/45 bg-amber-500/15 text-amber-400">
                <Shield className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <span className="block text-sm font-bold tracking-tight text-terminal-text">
                  TradeLab <span className="text-amber-400">Admin Portal</span>
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-widest text-terminal-muted sm:block">
                  Governance &amp; Curriculum Curation
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] md:inline-flex ${
                storageMode === 'supabase'
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400'
                  : 'border-sky-500/35 bg-sky-500/10 text-sky-400'
              }`}
              title="Current persistence mode"
            >
              <Database className="h-3 w-3" aria-hidden="true" />
              {storageMode === 'supabase' ? 'Supabase RLS Live' : 'Local Preview'}
            </span>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Switch to Learner View</span>
              <span className="sm:hidden">Learner</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-amber-500/40 hover:text-terminal-text"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" aria-hidden="true" />
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
          className="hidden w-64 shrink-0 border-r border-terminal-border bg-terminal-surface/60 lg:block"
        >
          <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col justify-between p-3.5">
            <div className="space-y-5 overflow-y-auto">
              <div>
                <p className="px-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                  Admin Workspace
                </p>
                <nav className="mt-2 space-y-1">
                  {ADMIN_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                            isActive
                              ? 'border border-amber-500/35 bg-amber-500/15 text-amber-400'
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
              </div>

              <div className="border-t border-terminal-border pt-4">
                <p className="px-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-terminal-muted">
                  Workspace Switch
                </p>
                <div className="mt-2 space-y-1.5">
                  <Link
                    to="/"
                    className="flex items-center gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/15"
                  >
                    <ArrowLeftRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Switch to Learner View
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 text-xs font-semibold text-rose-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-[11px] text-terminal-muted">
              <p className="font-semibold text-amber-400">Role-Isolated Governance</p>
              <p className="mt-0.5 leading-relaxed">
                Standard learner accounts cannot view or enter Admin Portal routes.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Admin Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="w-72 overflow-y-auto border-r border-terminal-border bg-terminal-surface p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-terminal-border pb-3">
                <span className="text-sm font-bold text-amber-400">Admin Portal</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close admin mobile menu"
                  className="rounded-lg p-1 text-terminal-muted"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <nav className="mt-3 space-y-1">
                {ADMIN_NAV_ITEMS.map((item) => {
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
                            ? 'bg-amber-500/15 text-amber-400'
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

              <div className="mt-5 space-y-2 border-t border-terminal-border pt-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400"
                >
                  <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                  Switch to Learner View
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400"
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
              className="flex-1 bg-slate-950/60"
            />
          </div>
        )}

        {/* Admin Workspace Content */}
        <main id="admin-main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
