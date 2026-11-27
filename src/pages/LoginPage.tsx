import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Loader2,
  Mail,
  Moon,
  Shield,
  Sun,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const THEME_STORAGE_KEY = 'tradelab_theme_v1';
const ADMIN_SQL_SNIPPET =
  "UPDATE public.profiles SET role = 'admin' WHERE email = 'your-gmail@gmail.com';";

function GoogleLogoSvg() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.65Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29A7.18 7.18 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.39l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.61 4.59 1.79l3.44-3.44C17.94 1.19 15.23 0 12 0A12 12 0 0 0 1.29 6.61l4 3.1C6.23 6.87 8.88 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function LoginPage() {
  const {
    isConfigured,
    error: authError,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInLocalPreview,
  } = useAuth();
  const navigate = useNavigate();

  const [emailOpen, setEmailOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  });

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
      // Ignore storage errors
    }
  }, [theme]);

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setConfirmationNotice(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Unable to start Google sign-in.');
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setConfirmationNotice(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        const result = await signUpWithEmail(
          email,
          password,
          displayName.trim() || email.split('@')[0],
        );
        if (result.needsConfirmation) {
          setConfirmationNotice(
            'Account created. Check your inbox to confirm your email before signing in.',
          );
          setMode('signin');
        }
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreviewEnter = (role: 'learner' | 'admin') => {
    setLocalError(null);
    try {
      signInLocalPreview(role);
      navigate(role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Local preview login is unavailable.');
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_SQL_SNIPPET);
      setCopiedSql(true);
      window.setTimeout(() => setCopiedSql(false), 2000);
    } catch {
      // Fallback if clipboard is unavailable
    }
  };

  const activeError = localError || authError;
  const showEmailForm = emailOpen || Boolean(confirmationNotice);

  return (
    <div className="min-h-[100dvh] bg-terminal-bg text-terminal-text">
      {/* Quiet Minimalist Top Bar */}
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <img
            src="/favicon.svg"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 rounded-xl shadow-sm"
          />
          <span className="text-sm font-semibold tracking-tight text-terminal-text">
            TradeLab <span className="text-emerald-500 dark:text-emerald-400">Academy</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-3 py-1 text-[11px] font-medium text-terminal-muted sm:inline-flex">
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                isConfigured ? 'bg-emerald-400' : 'bg-sky-400'
              }`}
            />
            {isConfigured ? 'Cloud Auth Active' : 'Local Preview'}
          </span>

          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-terminal-border bg-terminal-surface text-terminal-muted transition-colors hover:border-emerald-500/40 hover:text-terminal-text"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Centered Single-Focus Auth Canvas */}
      <main
        id="main-content"
        className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md flex-col justify-center px-4 pb-12 pt-4 sm:px-6"
      >
        <div className="space-y-5">
          {/* Primary Auth Card */}
          <section className="rounded-3xl border border-terminal-border/90 bg-terminal-surface p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center text-center">
              <img
                src="/favicon.svg"
                alt="TradeLab Academy mark"
                className="h-12 w-12 rounded-2xl shadow-sm"
              />
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-terminal-text">
                Welcome to TradeLab
              </h1>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-terminal-muted">
                Visual price action academy, bar-by-bar backtester, and disciplined mindset vault.
              </p>
            </div>

            {/* Alerts */}
            {activeError && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-xs text-rose-500 dark:text-rose-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{activeError}</span>
              </div>
            )}

            {confirmationNotice && (
              <div
                role="status"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{confirmationNotice}</span>
              </div>
            )}

            {/* Primary Google OAuth Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!isConfigured || googleLoading}
                title={
                  isConfigured
                    ? 'Sign in with Google OAuth'
                    : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live Google login'
                }
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-terminal-border bg-terminal-bg px-4 py-3.5 text-sm font-semibold text-terminal-text shadow-sm transition-all hover:border-emerald-500/45 hover:bg-terminal-elevated active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" aria-hidden="true" />
                ) : (
                  <GoogleLogoSvg />
                )}
                <span>Continue with Google (Gmail)</span>
              </button>

              {!isConfigured && (
                <p className="mt-2.5 text-center text-xs leading-relaxed text-terminal-muted">
                  Supabase keys aren&apos;t set yet — use Local Preview below to explore immediately.
                </p>
              )}
            </div>

            {/* Subtle Expandable Email & Password Trigger */}
            <div className="mt-5 border-t border-terminal-border/70 pt-4">
              <button
                type="button"
                onClick={() => setEmailOpen((prev) => !prev)}
                aria-expanded={showEmailForm}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:text-terminal-text"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{showEmailForm ? 'Hide email sign-in' : 'Continue with email & password'}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${showEmailForm ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {showEmailForm && (
                <div className="mt-4 space-y-4">
                  {/* Mode Segmented Control */}
                  <div
                    role="tablist"
                    aria-label="Email authentication mode"
                    className="grid grid-cols-2 gap-1 rounded-2xl border border-terminal-border bg-terminal-bg p-1"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === 'signin'}
                      onClick={() => {
                        setMode('signin');
                        setLocalError(null);
                      }}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                        mode === 'signin'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'text-terminal-muted hover:text-terminal-text'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === 'signup'}
                      onClick={() => {
                        setMode('signup');
                        setLocalError(null);
                      }}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                        mode === 'signup'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'text-terminal-muted hover:text-terminal-text'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                    {mode === 'signup' && (
                      <div>
                        <label
                          htmlFor="auth-display-name"
                          className="mb-1.5 block text-xs font-medium text-terminal-muted"
                        >
                          Display Name
                        </label>
                        <input
                          id="auth-display-name"
                          name="displayName"
                          aria-label="Display name"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Alex Rivera"
                          autoComplete="name"
                          disabled={!isConfigured || submitting}
                          className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-4 py-2.5 text-sm text-terminal-text placeholder:text-terminal-muted/60 focus:border-emerald-500/60 focus:outline-none disabled:opacity-55"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="auth-email"
                        className="mb-1.5 block text-xs font-medium text-terminal-muted"
                      >
                        Email Address
                      </label>
                      <input
                        id="auth-email"
                        name="email"
                        aria-label="Email address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@gmail.com"
                        autoComplete="email"
                        disabled={!isConfigured || submitting}
                        className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-4 py-2.5 text-sm text-terminal-text placeholder:text-terminal-muted/60 focus:border-emerald-500/60 focus:outline-none disabled:opacity-55"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="auth-password"
                        className="mb-1.5 block text-xs font-medium text-terminal-muted"
                      >
                        Password
                      </label>
                      <input
                        id="auth-password"
                        name="password"
                        aria-label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                        disabled={!isConfigured || submitting}
                        className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-4 py-2.5 text-sm text-terminal-text placeholder:text-terminal-muted/60 focus:border-emerald-500/60 focus:outline-none disabled:opacity-55"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!isConfigured || submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-brand-fg transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Mail className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span>
                        {mode === 'signin' ? 'Sign In with Email' : 'Create Learner Account'}
                      </span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>

          {/* Local Preview Mode Switcher — ONLY rendered when Supabase is not configured */}
          {!isConfigured && (
            <section className="rounded-3xl border border-sky-500/25 bg-terminal-surface p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-terminal-text">Local Preview Access</h2>
                <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                  Instant Demo
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-terminal-muted">
                Preview separated Learner and Admin workspaces locally before connecting Supabase.
              </p>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handlePreviewEnter('learner')}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 text-xs font-semibold text-brand-fg transition-all hover:brightness-110 active:scale-[0.99]"
                >
                  <UserCheck className="h-4 w-4" aria-hidden="true" />
                  Enter as Learner (Normal View)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreviewEnter('admin')}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-600 transition-all hover:bg-amber-500/20 active:scale-[0.99] dark:text-amber-400"
                >
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  Enter as Admin (Admin Portal)
                </button>
              </div>
            </section>
          )}

          {/* Clean Collapsible Supabase Setup Guide */}
          <div className="rounded-2xl border border-terminal-border/80 bg-terminal-surface/70">
            <button
              type="button"
              onClick={() => setGuideOpen((prev) => !prev)}
              aria-expanded={guideOpen}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-xs font-medium text-terminal-muted transition-colors hover:text-terminal-text"
            >
              <span className="inline-flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
                Supabase Gmail &amp; Admin setup guide
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${guideOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {guideOpen && (
              <div className="space-y-3 border-t border-terminal-border/70 px-4 py-4 text-xs text-terminal-muted">
                <ol className="list-decimal space-y-1.5 pl-4 leading-relaxed">
                  <li>
                    Enable Google in{' '}
                    <strong className="text-terminal-text">
                      Supabase → Auth → Providers → Google
                    </strong>
                    .
                  </li>
                  <li>
                    Add{' '}
                    <code className="break-all rounded-md bg-terminal-bg px-1.5 py-0.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      {window.location.origin}/auth/callback
                    </code>{' '}
                    to Redirect URLs.
                  </li>
                  <li>
                    Set{' '}
                    <code className="rounded-md bg-terminal-bg px-1.5 py-0.5 font-mono text-[11px] text-sky-600 dark:text-sky-400">
                      VITE_SUPABASE_URL
                    </code>{' '}
                    and{' '}
                    <code className="rounded-md bg-terminal-bg px-1.5 py-0.5 font-mono text-[11px] text-sky-600 dark:text-sky-400">
                      VITE_SUPABASE_ANON_KEY
                    </code>{' '}
                    and run migrations 001–003.
                  </li>
                  <li>Sign in with Gmail, then promote your account in SQL Editor:</li>
                </ol>

                <div className="flex items-center justify-between gap-2 rounded-xl border border-terminal-border bg-terminal-bg p-3">
                  <code className="overflow-x-auto font-mono text-[11px] text-amber-600 dark:text-amber-400">
                    {ADMIN_SQL_SNIPPET}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    aria-label="Copy Supabase admin promotion SQL"
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-terminal-border bg-terminal-surface px-2.5 py-1.5 font-mono text-[10px] font-semibold text-terminal-text transition-colors hover:border-emerald-500/40"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" aria-hidden="true" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
