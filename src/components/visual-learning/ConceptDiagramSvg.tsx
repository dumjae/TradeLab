import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { DiagramConfig, DiagramKind } from '../../types/academy';

export interface ConceptDiagramSvgProps {
  config: DiagramConfig;
}

function renderDiagramGraphics(kind: DiagramKind, activeStep: number) {
  switch (kind) {
    case 'market_structure':
      return (
        <g>
          {/* Bullish trend swing path */}
          <polyline
            points="40,220 120,145 180,185 280,105 350,145 470,60 550,95 620,40"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* BOS horizontal lines */}
          <line
            x1="120"
            y1="145"
            x2="265"
            y2="145"
            stroke="#0ea5e9"
            strokeWidth="1.75"
            strokeDasharray="6 4"
            opacity={activeStep === 1 ? 1 : 0.65}
          />
          <line
            x1="280"
            y1="105"
            x2="445"
            y2="105"
            stroke="#0ea5e9"
            strokeWidth="1.75"
            strokeDasharray="6 4"
            opacity={activeStep === 2 ? 1 : 0.65}
          />
          {/* Protected Swing Low highlight */}
          <line
            x1="180"
            y1="185"
            x2="375"
            y2="185"
            stroke="#f59e0b"
            strokeWidth="1.75"
            strokeDasharray="4 4"
            opacity={activeStep === 3 ? 1 : 0.55}
          />

          {/* Swing nodes */}
          {[
            { x: 120, y: 145, label: 'HH 1', color: '#10b981', dy: -14 },
            { x: 180, y: 185, label: 'HL 1 (Protected)', color: '#f59e0b', dy: 22 },
            { x: 280, y: 105, label: 'HH 2', color: '#10b981', dy: -14 },
            { x: 350, y: 145, label: 'HL 2', color: '#10b981', dy: 22 },
            { x: 470, y: 60, label: 'HH 3', color: '#10b981', dy: -14 },
          ].map((node, index) => (
            <g key={node.label}>
              <circle
                cx={node.x}
                cy={node.y}
                r={activeStep === index ? 7 : 5}
                fill={node.color}
                stroke="#080c11"
                strokeWidth="2"
              />
              <text
                x={node.x}
                y={node.y + node.dy}
                textAnchor="middle"
                fill={node.color}
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                {node.label}
              </text>
            </g>
          ))}

          <rect x="200" y="122" width="66" height="18" rx="4" fill="#0ea5e9" fillOpacity="0.18" />
          <text
            x="233"
            y="135"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            BOS Close
          </text>
          <rect x="372" y="82" width="66" height="18" rx="4" fill="#0ea5e9" fillOpacity="0.18" />
          <text
            x="405"
            y="95"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            BOS Close
          </text>
        </g>
      );

    case 'liquidity_pools':
      return (
        <g>
          {/* Buy-side liquidity band */}
          <rect
            x="40"
            y="38"
            width="580"
            height="34"
            rx="6"
            fill="#f59e0b"
            fillOpacity={activeStep === 0 ? 0.24 : 0.13}
            stroke="#f59e0b"
            strokeDasharray="5 4"
          />
          <text
            x="330"
            y="59"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            BUY-SIDE LIQUIDITY (BSL) — Short Stop-Losses &amp; Breakout Buy Orders
          </text>

          {/* Range price path */}
          <polyline
            points="50,140 120,82 190,192 265,84 340,190 420,86 485,185 555,64 605,155"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Sweep marker above BSL */}
          <circle
            cx="555"
            cy="64"
            r={activeStep >= 2 ? 7 : 5}
            fill="#ef4444"
            stroke="#080c11"
            strokeWidth="2"
          />
          <text
            x="555"
            y="30"
            textAnchor="middle"
            fill="#f87171"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            Liquidity Tap
          </text>

          {/* Sell-side liquidity band */}
          <rect
            x="40"
            y="196"
            width="580"
            height="34"
            rx="6"
            fill="#0ea5e9"
            fillOpacity={activeStep === 1 ? 0.24 : 0.13}
            stroke="#0ea5e9"
            strokeDasharray="5 4"
          />
          <text
            x="330"
            y="217"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            SELL-SIDE LIQUIDITY (SSL) — Long Stop-Losses &amp; Breakdown Sell Orders
          </text>
        </g>
      );

    case 'equal_highs_lows':
      return (
        <g>
          {/* Equal Highs line */}
          <line
            x1="70"
            y1="72"
            x2="585"
            y2="72"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <text
            x="170"
            y="56"
            fill="#fbbf24"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            $$$ EQUAL HIGHS (EQH) — Resting Stop Cluster
          </text>

          {/* Price bouncing cleanly twice then sweeping */}
          <polyline
            points="50,185 130,74 210,160 300,74 385,152 455,44 505,120 595,215"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Rejection leg colored bearish */}
          <polyline
            points="455,44 505,120 595,215"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <circle cx="130" cy="74" r="5" fill="#f59e0b" />
          <circle cx="300" cy="74" r="5" fill="#f59e0b" />
          <circle
            cx="455"
            cy="44"
            r={activeStep >= 1 ? 8 : 6}
            fill="#ef4444"
            stroke="#080c11"
            strokeWidth="2"
          />
          <text
            x="455"
            y="28"
            textAnchor="middle"
            fill="#f87171"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            Stop Raid Wick
          </text>
          <text
            x="555"
            y="230"
            textAnchor="middle"
            fill="#ef4444"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            Reversal Displacement
          </text>
        </g>
      );

    case 'liquidity_sweep_vs_breakout':
      return (
        <g>
          {/* Divider */}
          <line x1="330" y1="20" x2="330" y2="240" stroke="#334155" strokeDasharray="4 4" />

          {/* Left side: Liquidity Sweep */}
          <text
            x="165"
            y="34"
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            LIQUIDITY SWEEP (TRAP)
          </text>
          <line x1="35" y1="100" x2="295" y2="100" stroke="#f59e0b" strokeDasharray="5 4" strokeWidth="1.75" />
          {/* Candles left */}
          <line x1="90" y1="125" x2="90" y2="175" stroke="#10b981" strokeWidth="2" />
          <rect x="81" y="135" width="18" height="32" fill="#10b981" rx="2" />
          {/* Sweep wick candle closing back BELOW line */}
          <line x1="155" y1="54" x2="155" y2="145" stroke="#ef4444" strokeWidth="2.5" />
          <rect
            x="145"
            y="108"
            width="20"
            height="28"
            fill="#ef4444"
            rx="2"
            stroke={activeStep === 0 ? '#fbbf24' : 'none'}
            strokeWidth="2"
          />
          <text x="155" y="48" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Wick Only!
          </text>
          {/* Displacement down */}
          <line x1="220" y1="122" x2="220" y2="210" stroke="#ef4444" strokeWidth="2" />
          <rect x="210" y="130" width="20" height="68" fill="#ef4444" rx="2" />
          <text x="165" y="232" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Closes back inside range → Reversal
          </text>

          {/* Right side: True Breakout */}
          <text
            x="495"
            y="34"
            textAnchor="middle"
            fill="#10b981"
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            TRUE BREAKOUT (ACCEPTANCE)
          </text>
          <line x1="365" y1="140" x2="625" y2="140" stroke="#0ea5e9" strokeDasharray="5 4" strokeWidth="1.75" />
          {/* Strong body close above line */}
          <line x1="420" y1="145" x2="420" y2="195" stroke="#10b981" strokeWidth="2" />
          <rect x="411" y="152" width="18" height="34" fill="#10b981" rx="2" />

          <line x1="485" y1="74" x2="485" y2="152" stroke="#10b981" strokeWidth="2.5" />
          <rect
            x="475"
            y="84"
            width="20"
            height="58"
            fill="#10b981"
            rx="2"
            stroke={activeStep >= 1 ? '#38bdf8' : 'none'}
            strokeWidth="2"
          />
          <text x="485" y="66" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Body Close Above
          </text>

          {/* Retest holds above */}
          <line x1="550" y1="62" x2="550" y2="138" stroke="#10b981" strokeWidth="2" />
          <rect x="541" y="72" width="18" height="44" fill="#10b981" rx="2" />
          <text x="495" y="232" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Holds above broken level → Continuation
          </text>
        </g>
      );

    case 'fair_value_gap':
      return (
        <g>
          {/* FVG Shaded Imbalance Zone between Candle 1 High (155) and Candle 3 Low (105) */}
          <rect
            x="160"
            y="105"
            width="430"
            height="50"
            rx="4"
            fill="#0ea5e9"
            fillOpacity={activeStep === 1 ? 0.28 : 0.16}
            stroke="#0ea5e9"
            strokeDasharray="5 3"
          />
          <text
            x="475"
            y="134"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            BULLISH FAIR VALUE GAP (FVG)
          </text>

          {/* Candle 1 */}
          <line x1="150" y1="155" x2="150" y2="225" stroke="#10b981" strokeWidth="2" />
          <rect x="136" y="170" width="28" height="44" fill="#10b981" rx="3" />
          <text x="150" y="242" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Candle 1
          </text>

          {/* Candle 2 (Displacement) */}
          <line x1="225" y1="62" x2="225" y2="188" stroke="#10b981" strokeWidth="2.5" />
          <rect x="209" y="76" width="32" height="96" fill="#10b981" rx="3" />
          <text x="225" y="242" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Candle 2 (Impulse)
          </text>

          {/* Candle 3 */}
          <line x1="300" y1="45" x2="300" y2="105" stroke="#10b981" strokeWidth="2" />
          <rect x="286" y="56" width="28" height="36" fill="#10b981" rx="3" />
          <text x="300" y="242" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Candle 3
          </text>

          {/* Mitigation retrace arrow */}
          <polyline
            points="335,72 405,126 510,55"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />
          <circle cx="405" cy="126" r="6" fill="#f59e0b" />
          <text x="405" y="96" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Mitigation Entry
          </text>
        </g>
      );

    case 'risk_reward_model':
      return (
        <g>
          {/* Reward Box (+3R) */}
          <rect
            x="220"
            y="38"
            width="360"
            height="120"
            rx="6"
            fill="#10b981"
            fillOpacity={activeStep >= 2 ? 0.22 : 0.14}
            stroke="#10b981"
            strokeWidth="1.5"
          />
          <text
            x="400"
            y="102"
            textAnchor="middle"
            fill="#10b981"
            fontSize="14"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            REWARD TARGET (+3R)
          </text>

          {/* Entry Line */}
          <line x1="80" y1="158" x2="580" y2="158" stroke="#0ea5e9" strokeWidth="2" />
          <text x="145" y="152" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600">
            PLANNED ENTRY
          </text>

          {/* Risk Box (-1R) */}
          <rect
            x="220"
            y="158"
            width="360"
            height="42"
            rx="6"
            fill="#ef4444"
            fillOpacity={activeStep === 0 ? 0.26 : 0.16}
            stroke="#ef4444"
            strokeWidth="1.5"
          />
          <text
            x="400"
            y="184"
            textAnchor="middle"
            fill="#f87171"
            fontSize="12"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            FIXED RISK (-1R / MAX 1% ACCOUNT)
          </text>

          {/* Simulated Price Path */}
          <polyline
            points="70,192 160,132 225,158 285,176 375,118 465,86 555,46"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="225" cy="158" r="5" fill="#0ea5e9" />
          <circle cx="555" cy="46" r="6" fill="#10b981" />

          <text
            x="330"
            y="232"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
          >
            Position Size = (Account × Risk %) ÷ Stop-Loss Distance
          </text>
        </g>
      );
  }
}

export function ConceptDiagramSvg({ config }: ConceptDiagramSvgProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const totalSteps = Math.max(config.walkthroughSteps.length, 1);

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % totalSteps);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terminal-border bg-terminal-elevated/60 px-4 py-3">
          <div>
            <h4 className="text-sm font-semibold text-terminal-text">{config.title}</h4>
            <p className="text-xs text-terminal-muted">{config.subtitle}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-emerald-400">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Interactive Blueprint
          </span>
        </div>

        <div className="bg-slate-950 p-4">
          <svg
            viewBox="0 0 660 255"
            className="h-auto w-full max-h-[320px]"
            role="img"
            aria-label={config.title}
          >
            {/* Subtle institutional grid */}
            <defs>
              <pattern id={`grid-${config.kind}`} width="44" height="44" patternUnits="userSpaceOnUse">
                <path
                  d="M 44 0 L 0 0 0 44"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="0.75"
                  opacity="0.6"
                />
              </pattern>
            </defs>
            <rect width="660" height="255" fill={`url(#grid-${config.kind})`} rx="8" />
            {renderDiagramGraphics(config.kind, activeStep)}
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-terminal-border bg-terminal-elevated/40 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-3">
            {config.legend.map((entry) => (
              <span
                key={entry.label}
                className="inline-flex items-center gap-1.5 text-xs text-terminal-muted"
              >
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: entry.colorToken }}
                  aria-hidden="true"
                />
                {entry.label}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-terminal-muted">{config.caption}</p>
        </div>
      </div>

      {/* Interactive step walkthrough */}
      {config.walkthroughSteps.length > 0 && (
        <div className="rounded-xl border border-terminal-border bg-terminal-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400 tabular-nums">
              Visual Step {activeStep + 1} of {totalSteps}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous diagram step"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-terminal-border bg-terminal-elevated text-terminal-text transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next diagram step"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-terminal-border bg-terminal-elevated text-terminal-text transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-terminal-text">
            {config.walkthroughSteps[activeStep]}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {config.walkthroughSteps.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors tabular-nums ${
                  index === activeStep
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-terminal-elevated text-terminal-muted hover:text-terminal-text'
                }`}
              >
                Step {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Annotations grid */}
      {config.annotations.length > 0 && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {config.annotations.map((annotation) => {
            const toneStyles =
              annotation.tone === 'bullish'
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                : annotation.tone === 'bearish'
                  ? 'border-rose-500/30 bg-rose-500/5 text-rose-400'
                  : annotation.tone === 'liquidity'
                    ? 'border-amber-500/30 bg-amber-500/5 text-amber-400'
                    : 'border-sky-500/30 bg-sky-500/5 text-sky-400';

            return (
              <div
                key={annotation.id}
                className={`rounded-lg border px-3 py-2.5 ${toneStyles}`}
              >
                <p className="font-mono text-xs font-semibold">{annotation.label}</p>
                <p className="mt-0.5 text-xs text-terminal-muted">{annotation.sublabel}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
