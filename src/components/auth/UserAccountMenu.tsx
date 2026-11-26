import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  ChevronDown,
  LogOut,
  Shield,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface UserAccountMenuProps {
  inAdminPortal?: boolean;
}

function getInitials(displayName: string, email: string): string {
  const source = displayName.trim() || email.trim() || 'TL';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function getProviderLabel(provider: 'google' | 'email' | 'local_preview'): string {
  switch (provider) {
    case 'google':
      return 'Google (Gmail)';
    case 'email':
      return 'Email Account';
    default:
      return 'Local Preview';
  }
}

export function UserAccountMenu({ inAdminPortal = false }: UserAccountMenuProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.avatarUrl]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'admin';
  const initials = getInitials(user.displayName, user.email);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.displayName}`}
        className="inline-flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-bg px-2 py-1 text-left transition-colors hover:border-emerald-500/40"
      >
        {user.avatarUrl && !avatarFailed ? (
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            onError={() => setAvatarFailed(true)}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-terminal-border"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
              isAdmin
                ? 'border border-amber-500/40 bg-amber-500/15 text-amber-400'
                : 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
            }`}
          >
            {initials}
          </span>
        )}

        <div className="hidden max-w-[130px] leading-tight md:block">
          <span className="block truncate text-xs font-semibold text-terminal-text">
            {user.displayName}
          </span>
          <span
            className={`block font-mono text-[10px] uppercase tracking-wider ${
              isAdmin ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {isAdmin ? 'Admin' : 'Learner'}
          </span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-terminal-muted transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="User account actions"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface shadow-2xl"
        >
          <div className="border-b border-terminal-border bg-terminal-elevated/50 px-3.5 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-semibold text-terminal-text">
                {user.displayName}
              </p>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                  isAdmin
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-400'
                    : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                }`}
              >
                {isAdmin ? (
                  <Shield className="h-2.5 w-2.5" aria-hidden="true" />
                ) : (
                  <UserCheck className="h-2.5 w-2.5" aria-hidden="true" />
                )}
                {user.role}
              </span>
            </div>
            <p className="mt-0.5 truncate font-mono text-[11px] text-terminal-muted">
              {user.email}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-sky-400">
              {getProviderLabel(user.authProvider)}
            </p>
          </div>

          <div className="p-1.5 space-y-1">
            {isAdmin && !inAdminPortal && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/10"
              >
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Return to Admin Portal
              </Link>
            )}

            {isAdmin && inAdminPortal && (
              <Link
                to="/"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
                Switch to Learner View
              </Link>
            )}

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/10"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
