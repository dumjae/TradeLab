import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Library, Quote, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listAdminResources } from '../services/adminResourcesService';
import { listQuotes } from '../services/quotesService';

interface AdminCounts {
  total: number;
  pending: number;
  published: number;
  unavailable: number;
  quotes: number;
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<AdminCounts | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([listAdminResources('all'), listQuotes()]).then(([resources, quotes]) => {
      if (cancelled) return;
      const status = (value: string) =>
        resources.filter((item) => item.resource.verificationStatus === value).length;
      setCounts({
        total: resources.length,
        pending: status('pending_review'),
        published: status('published'),
        unavailable: status('unavailable'),
        quotes: quotes.filter((quote) => quote.sourceType !== 'user_custom').length,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats: Array<{ label: string; value: number | null; tone: string }> = [
    { label: 'Total Resources', value: counts?.total ?? null, tone: 'text-terminal-text' },
    { label: 'Pending Review', value: counts?.pending ?? null, tone: 'text-amber-400' },
    { label: 'Published', value: counts?.published ?? null, tone: 'text-emerald-400' },
    { label: 'Unavailable', value: counts?.unavailable ?? null, tone: 'text-rose-400' },
    { label: 'Curated Quotes', value: counts?.quotes ?? null, tone: 'text-sky-400' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl border border-terminal-border bg-terminal-surface p-5 sm:p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Admin Portal
        </span>
        <h1 className="mt-2 text-xl font-bold text-terminal-text">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}
        </h1>
        <p className="mt-1 text-xs text-terminal-muted">
          Govern educational content here. Learners never see this portal; use “Switch to Learner
          View” to study and backtest with the same account.
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-terminal-border bg-terminal-surface px-4 py-3"
          >
            <dt className="text-[10px] uppercase tracking-wider text-terminal-muted">{stat.label}</dt>
            <dd className={`mt-1 font-mono text-xl font-bold tabular-nums ${stat.tone}`}>
              {stat.value ?? '—'}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-3 md:grid-cols-2">
        <Link
          to="/admin/visual-library"
          className="group flex items-center justify-between rounded-2xl border border-terminal-border bg-terminal-surface p-5 transition-colors hover:border-emerald-500/50"
        >
          <span className="flex items-center gap-3">
            <Library className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold text-terminal-text">
                Visual Library Curation
              </span>
              <span className="text-[11px] text-terminal-muted">
                Add videos, verify timestamps, publish.
              </span>
            </span>
          </span>
          <ArrowRight className="h-4 w-4 text-terminal-muted group-hover:text-emerald-400" aria-hidden="true" />
        </Link>
        <Link
          to="/admin/quotes"
          className="group flex items-center justify-between rounded-2xl border border-terminal-border bg-terminal-surface p-5 transition-colors hover:border-amber-500/50"
        >
          <span className="flex items-center gap-3">
            <Quote className="h-5 w-5 text-amber-400" aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold text-terminal-text">Quotes Manager</span>
              <span className="text-[11px] text-terminal-muted">
                Curate the public Mindset Vault.
              </span>
            </span>
          </span>
          <ArrowRight className="h-4 w-4 text-terminal-muted group-hover:text-amber-400" aria-hidden="true" />
        </Link>
      </div>

      <section className="rounded-2xl border border-terminal-border bg-terminal-surface p-5">
        <h2 className="text-sm font-semibold text-terminal-text">Promote an admin in Supabase</h2>
        <p className="mt-1 text-[11px] text-terminal-muted">
          After signing in once with Gmail, run this in the Supabase SQL Editor:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-bg p-3 font-mono text-[11px] text-emerald-300">
          UPDATE public.profiles SET role = 'admin' WHERE email = 'your-gmail@gmail.com';
        </pre>
      </section>
    </div>
  );
}
