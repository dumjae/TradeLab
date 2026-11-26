import { Database, Shield, ShieldCheck } from 'lucide-react';
import { AdminResourceManager } from '../components/admin/AdminResourceManager';
import { getStorageMode } from '../lib/supabase';

export function AdminVisualLibraryPage() {
  const storageMode = getStorageMode();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-2xl border border-terminal-border bg-terminal-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Admin Curation Console
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                  storageMode === 'supabase'
                    ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400'
                    : 'border-sky-500/35 bg-sky-500/10 text-sky-400'
                }`}
              >
                <Database className="h-3 w-3" aria-hidden="true" />
                {storageMode === 'supabase' ? 'Supabase RLS Enforced' : 'Local Preview Sandbox'}
              </span>
            </div>

            <h1 className="text-xl font-bold text-terminal-text">
              Visual Learning Resource Governance &amp; Timestamp Verification
            </h1>
            <p className="max-w-3xl text-xs leading-relaxed text-terminal-muted">
              Curate verified YouTube and TradingView educational materials, inspect metadata,
              verify exact key timestamps, and control publication workflow.
            </p>
          </div>
        </div>

        {/* Governance Rules */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-terminal-border pt-4 md:grid-cols-3">
          <div className="rounded-xl border border-terminal-border bg-terminal-bg/80 p-3 text-xs">
            <p className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Zero Scraping &amp; Attribution Preserved
            </p>
            <p className="mt-1 text-[11px] text-terminal-muted">
              Only official YouTube privacy-enhanced embeds and attributed external links are
              allowed. Never mirror or re-host third-party media.
            </p>
          </div>
          <div className="rounded-xl border border-terminal-border bg-terminal-bg/80 p-3 text-xs">
            <p className="flex items-center gap-1.5 font-semibold text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Zero Fabricated Timestamps
            </p>
            <p className="mt-1 text-[11px] text-terminal-muted">
              Every published timestamp must originate from creator chapters, verified transcript
              alignment, or direct manual editorial review.
            </p>
          </div>
          <div className="rounded-xl border border-terminal-border bg-terminal-bg/80 p-3 text-xs">
            <p className="flex items-center gap-1.5 font-semibold text-sky-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Explicit Publish Approval
            </p>
            <p className="mt-1 text-[11px] text-terminal-muted">
              Only resources set to <span className="font-mono text-emerald-400">Published</span>{' '}
              appear in student Academy lessons and AI Mentor verified citations.
            </p>
          </div>
        </div>
      </header>

      <AdminResourceManager />
    </div>
  );
}
