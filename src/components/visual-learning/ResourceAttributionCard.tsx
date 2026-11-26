import { ExternalLink, ShieldCheck } from 'lucide-react';
import type { EducationalResource } from '../../types/visual-learning';

export interface ResourceAttributionCardProps {
  resource: EducationalResource;
}

export function ResourceAttributionCard({ resource }: ResourceAttributionCardProps) {
  const isOriginal = resource.sourceType === 'tradelab_original';

  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-400">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Verified Source
            </span>
            <span className="rounded-full border border-terminal-border bg-terminal-elevated px-2 py-0.5 font-mono text-[11px] text-terminal-muted">
              {resource.licenseStatus.replace(/_/g, ' ')}
            </span>
            <span className="font-mono text-[11px] text-terminal-muted tabular-nums">
              Quality {resource.qualityScore}/100
            </span>
          </div>

          <h4 className="text-sm font-semibold text-terminal-text">{resource.sourceName}</h4>
          <p className="text-xs leading-relaxed text-terminal-muted">{resource.attribution}</p>
        </div>

        {!isOriginal && (
          <a
            href={resource.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-elevated px-3 py-1.5 text-xs font-medium text-sky-400 transition-colors hover:border-sky-500/50 hover:bg-sky-500/10"
          >
            Original Video
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>

      {resource.nonEndorsementNotice && (
        <p className="mt-3 border-t border-terminal-border pt-2.5 text-[11px] text-terminal-muted">
          Curated for educational study inside TradeLab Academy. All rights remain with the
          original creator; inclusion does not imply creator endorsement or partnership.
        </p>
      )}
    </div>
  );
}
