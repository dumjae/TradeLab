import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function readHashError(): string | null {
  if (typeof window === 'undefined' || !window.location.hash) {
    return null;
  }
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return hashParams.get('error_description') || hashParams.get('error');
}

export function AuthCallbackPage() {
  const { user, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [exchanging, setExchanging] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const completeAuth = async () => {
      const errorParam =
        searchParams.get('error_description') ||
        searchParams.get('error') ||
        readHashError();
      if (errorParam) {
        if (active) {
          setCallbackError(errorParam);
          setExchanging(false);
        }
        return;
      }

      if (!isSupabaseConfigured || !supabase) {
        if (active) {
          setExchanging(false);
        }
        return;
      }

      try {
        // Give Supabase detectSessionInUrl a brief moment to complete automatic PKCE handshake
        let { data: existing } = await supabase.auth.getSession();

        if (!existing.session) {
          await new Promise((resolve) => window.setTimeout(resolve, 350));
          ({ data: existing } = await supabase.auth.getSession());
        }

        const code = searchParams.get('code');
        if (code && !existing.session) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            // Re-check session in case detectSessionInUrl finished concurrently
            const { data: rechecked } = await supabase.auth.getSession();
            if (!rechecked.session) {
              if (active) {
                setCallbackError(exchangeError.message);
                setExchanging(false);
              }
              return;
            }
          }
        }

        await refreshProfile();
      } catch (err) {
        if (active) {
          setCallbackError(
            err instanceof Error ? err.message : 'Unable to complete OAuth sign-in callback.',
          );
        }
      } finally {
        if (active) {
          setExchanging(false);
        }
      }
    };

    void completeAuth();
    return () => {
      active = false;
    };
  }, [searchParams, refreshProfile]);

  useEffect(() => {
    if (!exchanging && !loading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [exchanging, loading, user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-terminal-bg px-4 text-terminal-text">
      <div className="w-full max-w-md rounded-3xl border border-terminal-border bg-terminal-surface p-7 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-terminal-text">
              Signing you in
            </h1>
            <p className="text-xs text-terminal-muted">Verifying your TradeLab account</p>
          </div>
        </div>

        {callbackError ? (
          <div className="mt-6 space-y-4">
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
              <div>
                <p className="font-semibold text-rose-200">Authentication could not be completed</p>
                <p className="mt-1 leading-relaxed text-rose-300/90">{callbackError}</p>
              </div>
            </div>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-terminal-border bg-terminal-bg px-4 py-3 text-xs font-semibold text-terminal-text transition-colors hover:border-emerald-500/40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Return to Sign In
            </Link>
          </div>
        ) : !exchanging && !loading && !user ? (
          <div className="mt-6 space-y-4">
            <p className="text-xs leading-relaxed text-terminal-muted">
              No active OAuth session was found. Start sign-in again from the login page.
            </p>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 text-xs font-semibold text-brand-fg transition-colors hover:brightness-110"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Go to Sign In
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-terminal-border bg-terminal-bg px-4 py-3.5 text-xs text-terminal-muted">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" aria-hidden="true" />
            <span>Completing sign-in and loading your workspace…</span>
          </div>
        )}
      </div>
    </div>
  );
}
