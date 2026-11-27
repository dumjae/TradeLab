import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Activity, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function AuthLoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-terminal-bg px-4 text-terminal-text"
    >
      <div className="flex flex-col items-center gap-3 rounded-lg border border-terminal-border bg-terminal-surface px-8 py-7">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-brand/35 bg-brand-soft text-brand-text">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex items-center gap-2 text-xs font-medium text-terminal-muted">
          <Loader2 className="h-4 w-4 animate-spin text-brand-text" aria-hidden="true" />
          <span>Verifying TradeLab Terminal session…</span>
        </div>
      </div>
    </div>
  );
}

interface GuardProps {
  children?: ReactNode;
}

export function RequireAuth({ children }: GuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export function LearnerRoute({ children }: GuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export function AdminRoute({ children }: GuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export function PublicOnlyRoute({ children }: GuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
