import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
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

interface SpecimenCandle {
  x: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

const SPECIMEN_CANDLES: SpecimenCandle[] = [
  { x: 34, high: 142, open: 166, close: 148, low: 172 },
  { x: 58, high: 120, open: 148, close: 126, low: 152 },
  { x: 82, high: 96, open: 126, close: 104, low: 130 },
  { x: 106, high: 82, open: 104, close: 90, low: 108 },
  { x: 130, high: 88, open: 90, close: 112, low: 116 },
  { x: 154, high: 108, open: 112, close: 130, low: 136 },
  { x: 178, high: 126, open: 130, close: 136, low: 144 },
  { x: 202, high: 114, open: 134, close: 118, low: 138 },
  { x: 226, high: 92, open: 118, close: 96, low: 121 },
  { x: 250, high: 64, open: 96, close: 69, low: 99 },
  { x: 274, high: 68, open: 71, close: 84, low: 91 },
  { x: 298, high: 62, open: 84, close: 66, low: 89 },
  { x: 322, high: 42, open: 66, close: 46, low: 69 },
  { x: 346, high: 28, open: 46, close: 32, low: 50 },
];

const PROOF_METRICS = [
  { value: '358', label: 'Structured Topics' },
  { value: '4 + PH', label: 'Market Specializations' },
  { value: '$0 Risk', label: 'Virtual Demo Desk' },
] as const;

function staggerStyle(step: number): CSSProperties {
  return { '--stagger': step } as CSSProperties;
}

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

function MarketStructureSpecimen() {
  return (
    <figure className="mt-8 rounded-lg border border-terminal-border bg-terminal-surface">
      <figcaption className="flex items-center justify-between gap-4 border-b border-terminal-border px-4 py-2.5 font-mono text-[11px] text-terminal-muted">
        <span>FIG. 01 · MARKET STRUCTURE</span>
        <span className="tabular-nums text-terminal-text">
          BOS <span className="text-terminal-muted">·</span>{' '}
          <span className="text-bull">1:2.5 RR</span>
        </span>
      </figcaption>

      <div className="p-3 sm:p-4">
        <svg
          viewBox="0 0 520 192"
          className="h-auto w-full"
          role="img"
          aria-label="Market structure candlestick diagram illustrating a swing high, break of structure, retest entry, and 1 to 2.5 risk-to-reward target"
        >
          {/* Horizontal 1px architectural reference lines */}
          <line x1="16" y1="32" x2="452" y2="32" stroke="var(--tl-border)" strokeWidth="1" />
          <line x1="16" y1="82" x2="452" y2="82" stroke="var(--tl-border)" strokeWidth="1" />
          <line x1="16" y1="132" x2="452" y2="132" stroke="var(--tl-border)" strokeWidth="1" />
          <line x1="16" y1="168" x2="452" y2="168" stroke="var(--tl-border)" strokeWidth="1" />

          {/* Price scale divider */}
          <line x1="452" y1="16" x2="452" y2="176" stroke="var(--tl-border)" strokeWidth="1" />

          {/* 1:2.5 Risk-to-Reward projection zones (50px reward / 20px risk) */}
          <rect x="298" y="32" width="144" height="50" fill="rgba(8, 153, 129, 0.11)" />
          <line x1="298" y1="32" x2="442" y2="32" stroke="#089981" strokeWidth="1" />

          <rect x="298" y="82" width="144" height="20" fill="rgba(242, 54, 69, 0.11)" />
          <line x1="298" y1="102" x2="442" y2="102" stroke="#f23645" strokeWidth="1" />

          <line x1="298" y1="82" x2="442" y2="82" stroke="var(--tl-brand-text)" strokeWidth="1" />

          {/* Break of Structure (BOS) dashed level from Swing High */}
          <line
            x1="106"
            y1="82"
            x2="298"
            y2="82"
            stroke="#2962ff"
            strokeWidth="1.25"
            strokeDasharray="3 3"
          />
          <circle cx="106" cy="82" r="2.5" fill="var(--tl-brand-text)" />

          {/* Candlesticks */}
          {SPECIMEN_CANDLES.map((candle) => {
            const isBull = candle.close < candle.open;
            const color = isBull ? '#089981' : '#f23645';
            const bodyTop = Math.min(candle.open, candle.close);
            const bodyHeight = Math.max(Math.abs(candle.close - candle.open), 2);
            return (
              <g key={candle.x}>
                <line
                  x1={candle.x}
                  y1={candle.high}
                  x2={candle.x}
                  y2={candle.low}
                  stroke={color}
                  strokeWidth="1.25"
                />
                <rect
                  x={candle.x - 5}
                  y={bodyTop}
                  width="10"
                  height={bodyHeight}
                  rx="1"
                  fill={color}
                />
              </g>
            );
          })}

          {/* Structure annotations */}
          <text
            x="106"
            y="72"
            textAnchor="middle"
            fill="var(--tl-muted)"
            fontSize="9.5"
            fontFamily="IBM Plex Mono, monospace"
          >
            SH
          </text>
          <text
            x="178"
            y="158"
            textAnchor="middle"
            fill="var(--tl-muted)"
            fontSize="9.5"
            fontFamily="IBM Plex Mono, monospace"
          >
            HL
          </text>
          <text
            x="202"
            y="74"
            textAnchor="middle"
            fill="var(--tl-brand-text)"
            fontSize="10"
            fontWeight="600"
            fontFamily="IBM Plex Mono, monospace"
          >
            BOS
          </text>

          {/* RR Labels */}
          <text
            x="436"
            y="46"
            textAnchor="end"
            fill="#089981"
            fontSize="9.5"
            fontWeight="600"
            fontFamily="IBM Plex Mono, monospace"
          >
            TP · +2.5R
          </text>
          <text
            x="436"
            y="77"
            textAnchor="end"
            fill="var(--tl-brand-text)"
            fontSize="9"
            fontFamily="IBM Plex Mono, monospace"
          >
            RETEST
          </text>
          <text
            x="436"
            y="96"
            textAnchor="end"
            fill="#f23645"
            fontSize="9.5"
            fontWeight="600"
            fontFamily="IBM Plex Mono, monospace"
          >
            SL · -1.0R
          </text>

          {/* Price Scale Ticks */}
          <text
            x="460"
            y="35"
            fill="var(--tl-muted)"
            fontSize="9.5"
            fontFamily="IBM Plex Mono, monospace"
          >
            1.0920
          </text>
          <text
            x="460"
            y="85"
            fill="var(--tl-brand-text)"
            fontSize="9.5"
            fontWeight="500"
            fontFamily="IBM Plex Mono, monospace"
          >
            1.0870
          </text>
          <text
            x="460"
            y="135"
            fill="var(--tl-muted)"
            fontSize="9.5"
            fontFamily="IBM Plex Mono, monospace"
          >
            1.0820
          </text>
          <text
            x="460"
            y="171"
            fill="var(--tl-muted)"
            fontSize="9.5"
            fontFamily="IBM Plex Mono, monospace"
          >
            1.0785
          </text>
        </svg>
      </div>
    </figure>
  );
}

interface BrandBarProps {
  isConfigured: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  className?: string;
}

function BrandBar({ isConfigured, theme, onToggleTheme, className = '' }: BrandBarProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          className="h-7 w-7 rounded-md border border-terminal-border"
        />
        <span className="text-sm font-semibold tracking-tight text-terminal-text">
          TradeLab <span className="font-normal text-terminal-muted">Academy</span>
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${isConfigured ? 'bg-bull' : 'bg-brand'}`}
          />
          {isConfigured ? 'Cloud Auth' : 'Local Preview'}
        </span>

        <button
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={onToggleTheme}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-terminal-border bg-terminal-surface text-terminal-muted hover:border-brand/50 hover:text-terminal-text tl-press"
        >
          {theme === 'dark' ? (
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
      {/* Compact Mobile Brand Header (keeps Sign In immediately visible in first viewport on mobile) */}
      <header className="border-b border-terminal-border bg-terminal-bg px-5 py-3.5 lg:hidden">
        <BrandBar isConfigured={isConfigured} theme={theme} onToggleTheme={toggleTheme} />
      </header>

      <div className="grid min-h-[calc(100dvh-57px)] grid-cols-1 lg:min-h-[100dvh] lg:grid-cols-[1.18fr_0.82fr]">
        {/* Left Editorial Folio (Desktop left column; flows cleanly below auth on mobile) */}
        <section
          aria-label="TradeLab Academy overview"
          className="order-2 relative flex flex-col justify-between border-t border-terminal-border px-6 py-8 sm:px-10 lg:order-1 lg:border-t-0 lg:px-14 lg:py-12 tl-hairline-grid"
        >
          <header className="hidden lg:block">
            <BrandBar isConfigured={isConfigured} theme={theme} onToggleTheme={toggleTheme} />
          </header>

          <div className="my-auto max-w-xl py-4 lg:py-8">
            <h1
              style={staggerStyle(0)}
              className="text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-balance text-terminal-text sm:text-4xl lg:text-[2.75rem] tl-stagger"
            >
              Read market structure with discipline, not noise.
            </h1>

            <p
              style={staggerStyle(1)}
              className="mt-4 max-w-[48ch] text-sm leading-relaxed text-terminal-muted sm:text-base tl-stagger"
            >
              A structured financial academy pairing visual price-action lessons, historical replay,
              and risk-first demo trading.
            </p>

            <div style={staggerStyle(2)} className="tl-stagger">
              <MarketStructureSpecimen />
            </div>
          </div>

          {/* Unboxed Proof Ledger */}
          <dl
            style={staggerStyle(3)}
            className="grid grid-cols-3 gap-4 border-t border-terminal-border pt-6 sm:gap-6 tl-stagger"
          >
            {PROOF_METRICS.map((metric) => (
              <div key={metric.label}>
                <dt className="font-mono text-base font-semibold tracking-tight text-terminal-text tabular-nums sm:text-xl">
                  {metric.value}
                </dt>
                <dd className="mt-0.5 text-xs text-terminal-muted">{metric.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Right Auth Column */}
        <main
          id="main-content"
          className="order-1 flex flex-col justify-center bg-terminal-surface px-5 py-8 sm:px-10 lg:order-2 lg:border-l lg:border-terminal-border lg:px-14 lg:py-12"
        >
          <div className="mx-auto w-full max-w-[360px] space-y-6 tl-page-enter">
            <div>
              <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-terminal-text">
                Sign in to your desk
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-terminal-muted">
                Continue your structured lessons, replay sessions, and journal.
              </p>
            </div>

            {activeError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-md border border-bear/40 bg-bear/10 px-3.5 py-3 text-xs leading-relaxed text-terminal-text"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-bear" aria-hidden="true" />
                <span>{activeError}</span>
              </div>
            )}

            {confirmationNotice && (
              <div
                role="status"
                className="flex items-start gap-2.5 rounded-md border border-bull/40 bg-bull/10 px-3.5 py-3 text-xs leading-relaxed text-terminal-text"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bull" aria-hidden="true" />
                <span>{confirmationNotice}</span>
              </div>
            )}

            {/* Primary Google OAuth Action */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!isConfigured || googleLoading}
                title={
                  isConfigured
                    ? 'Sign in with Google OAuth'
                    : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live Google login'
                }
                className="flex w-full items-center justify-center gap-2.5 rounded-md border border-terminal-border bg-terminal-bg px-4 py-3 text-sm font-semibold text-terminal-text hover:border-brand/50 hover:bg-terminal-elevated disabled:cursor-not-allowed disabled:opacity-55 tl-press"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-text" aria-hidden="true" />
                ) : (
                  <GoogleLogoSvg />
                )}
                <span>Continue with Google (Gmail)</span>
              </button>

              {!isConfigured && (
                <p className="mt-2.5 text-xs leading-relaxed text-terminal-muted">
                  Supabase keys aren&apos;t set yet — use Local Preview below to explore immediately.
                </p>
              )}
            </div>

            {/* Expandable Email & Password Authentication */}
            <div className="border-t border-terminal-border pt-5">
              <button
                type="button"
                aria-expanded={showEmailForm}
                onClick={() => setEmailOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-2 rounded-md py-1 text-xs font-medium text-terminal-muted transition-colors hover:text-terminal-text"
              >
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {showEmailForm ? 'Hide email sign-in' : 'Continue with email & password'}
                  </span>
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${showEmailForm ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {showEmailForm && (
                <div className="mt-4 space-y-4">
                  {/* Underline Mode Switcher */}
                  <div
                    role="tablist"
                    aria-label="Email authentication mode"
                    className="grid grid-cols-2 border-b border-terminal-border"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === 'signin'}
                      onClick={() => {
                        setMode('signin');
                        setLocalError(null);
                      }}
                      className={`-mb-px border-b-2 pb-2.5 text-xs font-semibold transition-colors ${
                        mode === 'signin'
                          ? 'border-brand text-terminal-text'
                          : 'border-transparent text-terminal-muted hover:text-terminal-text'
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
                      className={`-mb-px border-b-2 pb-2.5 text-xs font-semibold transition-colors ${
                        mode === 'signup'
                          ? 'border-brand text-terminal-text'
                          : 'border-transparent text-terminal-muted hover:text-terminal-text'
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
                          className="mb-1.5 block text-xs font-medium text-terminal-text"
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
                          placeholder="Alex Rivera"
                          autoComplete="name"
                          disabled={!isConfigured || submitting}
                          className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-sm text-terminal-text placeholder:text-terminal-muted/65 transition-colors focus:border-brand focus:outline-none disabled:opacity-55"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="auth-email"
                        className="mb-1.5 block text-xs font-medium text-terminal-text"
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
                        className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-sm text-terminal-text placeholder:text-terminal-muted/65 transition-colors focus:border-brand focus:outline-none disabled:opacity-55"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="auth-password"
                        className="mb-1.5 block text-xs font-medium text-terminal-text"
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
                        className="w-full rounded-md border border-terminal-border bg-terminal-bg px-3.5 py-2.5 text-sm text-terminal-text placeholder:text-terminal-muted/65 transition-colors focus:border-brand focus:outline-none disabled:opacity-55"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!isConfigured || submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 tl-press"
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

            {/* Local Preview Mode Switcher — ONLY rendered when Supabase is not configured */}
            {!isConfigured && (
              <section className="space-y-3 border-t border-terminal-border pt-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold text-terminal-text">Local Preview Access</h3>
                  <span className="font-mono text-[11px] text-brand-text">Instant Demo</span>
                </div>
                <p className="text-xs leading-relaxed text-terminal-muted">
                  Preview separated Learner and Admin workspaces locally before connecting Supabase.
                </p>

                <div className="space-y-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handlePreviewEnter('learner')}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-xs font-semibold text-brand-fg hover:brightness-110 tl-press"
                  >
                    <UserCheck className="h-4 w-4" aria-hidden="true" />
                    Enter as Learner (Normal View)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreviewEnter('admin')}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-terminal-border bg-terminal-bg px-4 py-2.5 text-xs font-semibold text-terminal-text hover:border-brand/50 hover:bg-terminal-elevated tl-press"
                  >
                    <Shield className="h-4 w-4 text-terminal-muted" aria-hidden="true" />
                    Enter as Admin (Admin Portal)
                  </button>
                </div>
              </section>
            )}

            {/* Quiet Collapsible Supabase Setup Guide */}
            <div className="border-t border-terminal-border pt-4">
              <button
                type="button"
                aria-expanded={guideOpen}
                onClick={() => setGuideOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-2 py-1 text-left text-xs text-terminal-muted transition-colors hover:text-terminal-text"
              >
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                  Supabase Gmail &amp; Admin setup guide
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${guideOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {guideOpen && (
                <div className="mt-3 space-y-3 rounded-md border border-terminal-border bg-terminal-bg p-3.5 text-xs text-terminal-muted">
                  <ol className="list-decimal space-y-1.5 pl-4 leading-relaxed">
                    <li>
                      Enable Google in{' '}
                      <strong className="font-medium text-terminal-text">
                        Supabase → Auth → Providers → Google
                      </strong>
                      .
                    </li>
                    <li>
                      Add{' '}
                      <code className="break-all rounded-sm bg-terminal-surface px-1.5 py-0.5 font-mono text-[11px] text-brand-text">
                        {window.location.origin}/auth/callback
                      </code>{' '}
                      to Redirect URLs.
                    </li>
                    <li>
                      Set{' '}
                      <code className="rounded-sm bg-terminal-surface px-1.5 py-0.5 font-mono text-[11px] text-terminal-text">
                        VITE_SUPABASE_URL
                      </code>{' '}
                      and{' '}
                      <code className="rounded-sm bg-terminal-surface px-1.5 py-0.5 font-mono text-[11px] text-terminal-text">
                        VITE_SUPABASE_ANON_KEY
                      </code>{' '}
                      and run migrations 001–003.
                    </li>
                    <li>Sign in with Gmail, then promote your account in SQL Editor:</li>
                  </ol>

                  <div className="flex items-center justify-between gap-2 rounded-md border border-terminal-border bg-terminal-surface p-2.5">
                    <code className="overflow-x-auto font-mono text-[11px] text-terminal-text">
                      {ADMIN_SQL_SNIPPET}
                    </code>
                    <button
                      type="button"
                      aria-label="Copy Supabase admin promotion SQL"
                      onClick={handleCopySql}
                      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-terminal-border bg-terminal-bg px-2.5 py-1.5 font-mono text-[10px] font-medium text-terminal-text hover:border-brand/50 tl-press"
                    >
                      {copiedSql ? (
                        <>
                          <Check className="h-3 w-3 text-bull" aria-hidden="true" />
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
    </div>
  );
}
