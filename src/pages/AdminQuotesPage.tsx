import { AdminQuotesManager } from '../components/admin/AdminQuotesManager';

export function AdminQuotesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-2xl border border-terminal-border bg-terminal-surface p-5 sm:p-6">
        <h1 className="text-xl font-bold text-terminal-text">Quotes &amp; Wisdom Manager</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-terminal-muted">
          Curate the public Mindset Vault. Verified Trader quotes must carry accurate attribution;
          original TradeLab principles are labelled separately for learners.
        </p>
      </header>
      <AdminQuotesManager />
    </div>
  );
}
