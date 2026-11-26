import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Database,
  LineChart,
  Loader2,
  Lock,
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
            'Account created! Check your inbox to confirm your email before signing in.',
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

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* Top Bar */}
      <header className="border-b border-terminal-border bg-terminal-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-400">
              <Activity className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-terminal-text">
                TradeLab <span className="text-emerald-400">Academy</span>
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-terminal-muted">
                Institutional Visual Terminal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                isConfigured
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400'
                  : 'border-sky-500/35 bg-sky-500/10 text-sky-400'
              }`}
            >
              <Database className="h-3 w-3" aria-hidden="true" />
              {isConfigured ? 'Supabase Auth Active' : 'Local Preview Mode'}
            </span>

            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-terminal-border bg-terminal-bg text-terminal-muted transition-colors hover:border-emerald-500/40 hover:text-terminal-text"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Split Institutional Layout */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:py-12">
        {/* Left Brand & Terminal Value Prop */}
        <section className="space-y-6 lg:col-span-6 lg:pt-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Role-Separated Access · RLS Protected
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-terminal-text sm:text-4xl">
              Study Market Structure, Backtest Real Charts, and Execute With{' '}
              <span className="text-emerald-400">1R Discipline</span>.
            </h1>
            <p className="text-sm leading-relaxed text-terminal-muted">
              Sign in with your Google (Gmail) account or email to access your personalized visual
              curriculum, multi-asset bar-by-bar backtester, and saved trading mindset vault.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/35 bg-emerald-500/10 text-emerald-400">
                <LineChart className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-sm font-semibold text-terminal-text">
                Multi-Asset Market Backtester
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-terminal-muted">
                Replay Crypto, Forex, Indices, Stocks, Gold, or custom TradingView CSVs bar-by-bar
                with strict hidden future candles and 1R position sizing.
              </p>
            </div>

            <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/35 bg-sky-500/10 text-sky-400">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-sm font-semibold text-terminal-text">
                Visual Trading Academy
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-terminal-muted">
                Interactive SVG blueprints, verified YouTube timestamp jumps, practice drills, and
                an answer-protected AI Mentor.
              </p>
            </div>

            <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:col-span-2">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/35 bg-amber-500/10 text-amber-400">
                  <Shield className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-terminal-text">
                    Strict Admin Portal vs. Learner Workspace Separation
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-terminal-muted">
                    Standard learner accounts enter the distraction-free Trading Academy &amp;
                    Backtester with zero admin tools. Promoted administrator accounts land in the
                    dedicated Governance Portal with a one-click Learner View toggle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Auth Panel */}
        <section className="space-y-4 lg:col-span-6">
          <div className="rounded-2xl border border-terminal-border bg-terminal-surface p-6 shadow-xl sm:p-7">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-terminal-text">Sign in to TradeLab Academy</h2>
              <p className="text-xs text-terminal-muted">
                Use your Google (Gmail) account for instant cloud sync across devices.
              </p>
            </div>

            {/* Primary Google OAuth Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!isConfigured || googleLoading}
                title={
                  isConfigured
                    ? 'Sign in with Google OAuth'
                    : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live Google login'
                }
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-terminal-border bg-terminal-bg px-4 py-3 text-sm font-semibold text-terminal-text transition-colors hover:border-emerald-500/50 hover:bg-terminal-elevated disabled:cursor-not-allowed disabled:opacity-55"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" aria-hidden="true" />
                ) : (
                  <GoogleLogoSvg />
                )}
                <span>Continue with Google (Gmail)</span>
              </button>

              {!isConfigured && (
                <p className="mt-2 text-[11px] text-sky-400">
                  Supabase environment keys are not configured yet — use Local Preview Mode below
                  to inspect both Learner and Admin views immediately.
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-terminal-border" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-terminal-muted">
                or email &amp; password
              </span>
              <div className="h-px flex-1 bg-terminal-border" />
            </div>

            {/* Mode Tabs */}
            <div
              role="tablist"
              aria-label="Email authentication mode"
              className="grid grid-cols-2 gap-1 rounded-xl border border-terminal-border bg-terminal-bg p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                onClick={() => {
                  setMode('signin');
                  setLocalError(null);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  mode === 'signin'
                    ? 'bg-emerald-500/15 text-emerald-400'
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
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  mode === 'signup'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error / Success Alerts */}
            {activeError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{activeError}</span>
              </div>
            )}

            {confirmationNotice && (
              <div
                role="status"
                className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-400"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{confirmationNotice}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="mt-4 space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="auth-display-name"
                    className="mb-1 block text-xs font-medium text-terminal-muted"
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
                    className="w-full rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-xs text-terminal-text placeholder:text-terminal-muted/60 focus:border-emerald-500/60 focus:outline-none disabled:opacity-55"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-1 block text-xs font-medium text-terminal-muted"
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
                  className="w-full rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-xs text-terminal-text placeholder:text-terminal-muted/60 focus:border-emerald-500/60 focus:outline-none disabled:opacity-55"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-1 block text-xs font-medium text-terminal-muted"
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
                  className="w-full rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-xs text-terminal-text placeholder:text-terminal-muted/60 focus:border-emerald-500/60 focus:outline-none disabled:opacity-55"
                />
              </div>

              <button
                type="submit"
                disabled={!isConfigured || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Mail className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{mode === 'signin' ? 'Sign In with Email' : 'Create Learner Account'}</span>
              </button>
            </form>
          </div>

          {/* Local Preview Mode Switcher — ONLY rendered when Supabase is not configured */}
          {!isConfigured && (
            <div className="rounded-2xl border border-sky-500/35 bg-sky-500/5 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/35 bg-sky-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-400">
                    Local Preview Mode
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-terminal-text">
                    Test Separated Learner &amp; Admin Views Locally
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-terminal-muted">
                    Simulated roles are available only before Supabase `.env` keys are added. Once
                    configured, real Google/Email auth and database RLS roles are strictly enforced.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handlePreviewEnter('learner')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25"
                >
                  <UserCheck className="h-4 w-4" aria-hidden="true" />
                  Enter as Learner (Normal View)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreviewEnter('admin')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/25"
                >
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  Enter as Admin (Admin Portal)
                </button>
              </div>
            </div>
          )}

          {/* Collapsible Supabase Setup Guide */}
          <div className="rounded-2xl border border-terminal-border bg-terminal-surface/80">
            <button
              type="button"
              onClick={() => setGuideOpen((prev) => !prev)}
              aria-expanded={guideOpen}
              className="flex w-full items-center justify-between gap-2 px-5 py-3.5 text-left text-xs font-semibold text-terminal-text"
            >
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-400" aria-hidden="true" />
                How to enable Gmail Login &amp; Admin Role in Supabase
              </span>
              <ChevronDown
                className={`h-4 w-4 text-terminal-muted transition-transform ${
                  guideOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {guideOpen && (
              <div className="space-y-3 border-t border-terminal-border px-5 py-4 text-xs text-terminal-muted">
                <ol className="list-decimal space-y-1.5 pl-4 leading-relaxed">
                  <li>
                    In <strong className="text-terminal-text">Supabase Dashboard → Auth → Providers → Google</strong>, enable Google and add your OAuth Client ID &amp; Secret.
                  </li>
                  <li>
                    Add <code className="rounded bg-terminal-bg px-1.5 py-0.5 font-mono text-[11px] text-emerald-400">{window.location.origin}/auth/callback</code> to <strong className="text-terminal-text">URL Configuration → Redirect URLs</strong>.
                  </li>
                  <li>
                    Set <code className="rounded bg-terminal-bg px-1.5 py-0.5 font-mono text-[11px] text-sky-400">VITE_SUPABASE_URL</code> and <code className="rounded bg-terminal-bg px-1.5 py-0.5 font-mono text-[11px] text-sky-400">VITE_SUPABASE_ANON_KEY</code> in your environment and run migrations <span className="font-mono">001–003</span>.
                  </li>
                  <li>
                    Sign in once with your Gmail account, then promote yourself to Admin in Supabase SQL Editor:
                  </li>
                </ol>

                <div className="flex items-center justify-between gap-2 rounded-xl border border-terminal-border bg-terminal-bg p-3">
                  <code className="overflow-x-auto font-mono text-[11px] text-amber-400">
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
                        <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
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
        </section>
      </main>
    </div>
  );
}
