import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { DiagramConfig, DiagramKind } from '../../types/academy';

export interface ConceptDiagramSvgProps {
  config: DiagramConfig;
}

const FONT_MONO = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';
const FONT_SANS = 'Inter, system-ui, -apple-system, sans-serif';

interface DiagramSubProps {
  activeStep: number;
}

function DiagramTopBanner({ text, accent = '#38bdf8' }: { text: string; accent?: string }) {
  return (
    <g>
      <rect
        x="18"
        y="10"
        width="644"
        height="22"
        rx="4"
        fill="#0f172a"
        stroke="#1e293b"
        strokeWidth="1"
      />
      <text
        x="340"
        y="24.5"
        textAnchor="middle"
        fill={accent}
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
        letterSpacing="0.4"
      >
        {text}
      </text>
    </g>
  );
}

function DiagramBottomNote({ text }: { text: string }) {
  return (
    <g>
      <rect
        x="18"
        y="270"
        width="644"
        height="28"
        rx="6"
        fill="#0f172a"
        stroke="#1e293b"
        strokeWidth="1"
      />
      <text
        x="340"
        y="288"
        textAnchor="middle"
        fill="#cbd5e1"
        fontSize="10"
        fontFamily={FONT_SANS}
        fontWeight="500"
      >
        {text}
      </text>
    </g>
  );
}

function CandlestickAnatomySvg({ activeStep }: DiagramSubProps) {
  const isOpenStep = activeStep === 0;
  const isBodyStep = activeStep === 1;
  const isWickStep = activeStep >= 2;

  return (
    <g>
      {/* Center divider */}
      <line
        x1="340"
        y1="10"
        x2="340"
        y2="256"
        stroke="#334155"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* LEFT HEADER: GREEN CANDLE */}
      <rect
        x="16"
        y="8"
        width="310"
        height="24"
        rx="5"
        fill="#10b981"
        fillOpacity="0.14"
        stroke="#10b981"
        strokeOpacity="0.55"
      />
      <text
        x="171"
        y="23.5"
        textAnchor="middle"
        fill="#34d399"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        GREEN CANDLE — Price Went UP (Buyers Won)
      </text>

      {/* RIGHT HEADER: RED CANDLE */}
      <rect
        x="354"
        y="8"
        width="310"
        height="24"
        rx="5"
        fill="#ef4444"
        fillOpacity="0.14"
        stroke="#ef4444"
        strokeOpacity="0.55"
      />
      <text
        x="509"
        y="23.5"
        textAnchor="middle"
        fill="#f87171"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        RED CANDLE — Price Went DOWN (Sellers Won)
      </text>

      {/* ================= LEFT: GREEN CANDLE ================= */}
      {/* Upper wick */}
      <line
        x1="76"
        y1="48"
        x2="76"
        y2="98"
        stroke={isWickStep ? '#fbbf24' : '#10b981'}
        strokeWidth={isWickStep ? 4.5 : 3.5}
        strokeLinecap="round"
      />
      {/* Lower wick */}
      <line
        x1="76"
        y1="194"
        x2="76"
        y2="244"
        stroke={isWickStep ? '#fbbf24' : '#10b981'}
        strokeWidth={isWickStep ? 4.5 : 3.5}
        strokeLinecap="round"
      />
      {/* Body glow when Body/Close step active */}
      {isBodyStep && (
        <rect
          x="48"
          y="93"
          width="56"
          height="106"
          rx="6"
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      )}
      {/* Green Body */}
      <rect
        x="53"
        y="98"
        width="46"
        height="96"
        rx="3"
        fill="#10b981"
        stroke="#34d399"
        strokeWidth="1.5"
      />
      {/* Direction cue inside green body */}
      <text
        x="76"
        y="141"
        textAnchor="middle"
        fill="#022c22"
        fontSize="12"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        ▲
      </text>
      <text
        x="76"
        y="156"
        textAnchor="middle"
        fill="#022c22"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        UP
      </text>

      {/* Left Callout 1: HIGH */}
      <circle cx="76" cy="48" r={isWickStep ? 4.5 : 3.5} fill={isWickStep ? '#fbbf24' : '#34d399'} />
      <line
        x1="82"
        y1="48"
        x2="112"
        y2="48"
        stroke={isWickStep ? '#fbbf24' : '#475569'}
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <text x="116" y="51" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#34d399" fontFamily={FONT_MONO} fontWeight="700">
          HIGH
        </tspan>
        <tspan fill="#cbd5e1"> (Highest price reached)</tspan>
      </text>

      {/* Left Callout 2: UPPER WICK */}
      <line
        x1="80"
        y1="72"
        x2="112"
        y2="72"
        stroke={isWickStep ? '#fbbf24' : '#475569'}
        strokeWidth={isWickStep ? 1.75 : 1.25}
        strokeDasharray="3 3"
      />
      <text x="116" y="70" fill="#fbbf24" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        UPPER WICK
      </text>
      <text x="116" y="81" fill="#94a3b8" fontSize="8.5" fontFamily={FONT_SANS}>
        Buyers pushed up, sellers pushed back
      </text>

      {/* Left Callout 3: CLOSE (top of green body) */}
      <line
        x1="50"
        y1="98"
        x2="112"
        y2="98"
        stroke={isBodyStep ? '#6ee7b7' : '#34d399'}
        strokeWidth={isBodyStep ? 2 : 1.3}
        strokeDasharray="3 3"
      />
      <circle cx="99" cy="98" r={isBodyStep ? 4.5 : 3.5} fill="#34d399" />
      <text x="116" y="101" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#34d399" fontFamily={FONT_MONO} fontWeight="700">
          CLOSE
        </tspan>
        <tspan fill="#6ee7b7"> (Top of green box)</tspan>
      </text>
      <text x="116" y="112" fill="#cbd5e1" fontSize="8.5" fontFamily={FONT_SANS}>
        Timer ended HIGHER → turns GREEN
      </text>

      {/* Left Callout 4: BODY */}
      <line
        x1="101"
        y1="146"
        x2="112"
        y2="146"
        stroke={isBodyStep ? '#f8fafc' : '#64748b'}
        strokeWidth="1.5"
      />
      <text x="116" y="144" fill="#f8fafc" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        BODY
      </text>
      <text x="116" y="155" fill="#cbd5e1" fontSize="8.5" fontFamily={FONT_SANS}>
        Distance from Open to Close
      </text>

      {/* Left Callout 5: OPEN (bottom of green body) */}
      <line
        x1="50"
        y1="194"
        x2="112"
        y2="194"
        stroke={isOpenStep ? '#38bdf8' : '#0ea5e9'}
        strokeWidth={isOpenStep ? 2.2 : 1.3}
        strokeDasharray="3 3"
      />
      <circle cx="99" cy="194" r={isOpenStep ? 5 : 3.5} fill="#38bdf8" />
      <text x="116" y="191" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#38bdf8" fontFamily={FONT_MONO} fontWeight="700">
          OPEN
        </tspan>
        <tspan fill="#7dd3fc"> (Bottom of green box)</tspan>
      </text>
      <text x="116" y="202" fill="#cbd5e1" fontSize="8.5" fontFamily={FONT_SANS}>
        Where the timer started
      </text>

      {/* Left Callout 6: LOWER WICK */}
      <line
        x1="80"
        y1="219"
        x2="112"
        y2="219"
        stroke={isWickStep ? '#fbbf24' : '#475569'}
        strokeWidth={isWickStep ? 1.75 : 1.25}
        strokeDasharray="3 3"
      />
      <text x="116" y="218" fill="#fbbf24" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        LOWER WICK
      </text>
      <text x="116" y="229" fill="#94a3b8" fontSize="8.5" fontFamily={FONT_SANS}>
        Price dipped, buyers pushed back up
      </text>

      {/* Left Callout 7: LOW */}
      <circle cx="76" cy="244" r={isWickStep ? 4.5 : 3.5} fill={isWickStep ? '#fbbf24' : '#34d399'} />
      <line
        x1="82"
        y1="244"
        x2="112"
        y2="244"
        stroke={isWickStep ? '#fbbf24' : '#475569'}
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <text x="116" y="247" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#34d399" fontFamily={FONT_MONO} fontWeight="700">
          LOW
        </tspan>
        <tspan fill="#cbd5e1"> (Lowest price reached)</tspan>
      </text>

      {/* ================= RIGHT: RED CANDLE ================= */}
      {/* Upper wick */}
      <line
        x1="404"
        y1="48"
        x2="404"
        y2="98"
        stroke={isWickStep ? '#fbbf24' : '#ef4444'}
        strokeWidth={isWickStep ? 4.5 : 3.5}
        strokeLinecap="round"
      />
      {/* Lower wick */}
      <line
        x1="404"
        y1="194"
        x2="404"
        y2="244"
        stroke={isWickStep ? '#fbbf24' : '#ef4444'}
        strokeWidth={isWickStep ? 4.5 : 3.5}
        strokeLinecap="round"
      />
      {/* Body glow when Body/Close step active */}
      {isBodyStep && (
        <rect
          x="376"
          y="93"
          width="56"
          height="106"
          rx="6"
          fill="none"
          stroke="#fca5a5"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      )}
      {/* Red Body */}
      <rect
        x="381"
        y="98"
        width="46"
        height="96"
        rx="3"
        fill="#ef4444"
        stroke="#f87171"
        strokeWidth="1.5"
      />
      {/* Direction cue inside red body */}
      <text
        x="404"
        y="141"
        textAnchor="middle"
        fill="#450a0a"
        fontSize="12"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        ▼
      </text>
      <text
        x="404"
        y="156"
        textAnchor="middle"
        fill="#450a0a"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        DOWN
      </text>

      {/* Right Callout 1: HIGH */}
      <circle cx="404" cy="48" r={isWickStep ? 4.5 : 3.5} fill={isWickStep ? '#fbbf24' : '#f87171'} />
      <line
        x1="410"
        y1="48"
        x2="440"
        y2="48"
        stroke={isWickStep ? '#fbbf24' : '#475569'}
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <text x="444" y="51" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#f87171" fontFamily={FONT_MONO} fontWeight="700">
          HIGH
        </tspan>
        <tspan fill="#cbd5e1"> (Highest price reached)</tspan>
      </text>

      {/* Right Callout 2: UPPER WICK */}
      <line
        x1="408"
        y1="72"
        x2="440"
        y2="72"
        stroke={isWickStep ? '#fbbf24' : '#475569'}
        strokeWidth={isWickStep ? 1.75 : 1.25}
        strokeDasharray="3 3"
      />
      <text x="444" y="70" fill="#fbbf24" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        UPPER WICK
      </text>
      <text x="444" y="81" fill="#94a3b8" fontSize="8.5" fontFamily={FONT_SANS}>
        Brief rally rejected by sellers
      </text>

      {/* Right Callout 3: OPEN (TOP of red body!) */}
      <line
        x1="378"
        y1="98"
        x2="440"
        y2="98"
        stroke={isOpenStep ? '#38bdf8' : '#0ea5e9'}
        strokeWidth={isOpenStep ? 2.2 : 1.3}
        strokeDasharray="3 3"
      />
      <circle cx="427" cy="98" r={isOpenStep ? 5 : 3.5} fill="#38bdf8" />
      <text x="444" y="101" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#38bdf8" fontFamily={FONT_MONO} fontWeight="700">
          OPEN
        </tspan>
        <tspan fill="#7dd3fc"> (Started HIGHER — TOP!)</tspan>
      </text>
      <text x="444" y="112" fill="#cbd5e1" fontSize="8.5" fontFamily={FONT_SANS}>
        Mirror of green: Open sits at TOP
      </text>

      {/* Right Callout 4: BODY */}
      <line
        x1="429"
        y1="146"
        x2="440"
        y2="146"
        stroke={isBodyStep ? '#f8fafc' : '#64748b'}
        strokeWidth="1.5"
      />
      <text x="444" y="144" fill="#f8fafc" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        BODY
      </text>
      <text x="444" y="155" fill="#cbd5e1" fontSize="8.5" fontFamily={FONT_SANS}>
        Price dropped from Open to Close
      </text>

      {/* Right Callout 5: CLOSE (BOTTOM of red body!) */}
      <line
        x1="378"
        y1="194"
        x2="440"
        y2="194"
        stroke={isBodyStep ? '#fca5a5' : '#ef4444'}
        strokeWidth={isBodyStep ? 2 : 1.3}
        strokeDasharray="3 3"
      />
      <circle cx="427" cy="194" r={isBodyStep ? 4.5 : 3.5} fill="#f87171" />
      <text x="444" y="191" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#f87171" fontFamily={FONT_MONO} fontWeight="700">
          CLOSE
        </tspan>
        <tspan fill="#fca5a5"> (Ended LOWER → RED)</tspan>
      </text>
      <text x="444" y="202" fill="#cbd5e1" fontSize="8.5" fontFamily={FONT_SANS}>
        Closed below Open → locks RED
      </text>

      {/* Right Callout 6: LOWER WICK */}
      <line
        x1="408"
        y1="219"
        x2="440"
        y2="219"
        stroke={isWickStep ? '#fbbf24' : '#475569'}
        strokeWidth={isWickStep ? 1.75 : 1.25}
        strokeDasharray="3 3"
      />
      <text x="444" y="218" fill="#fbbf24" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        LOWER WICK
      </text>
      <text x="444" y="229" fill="#94a3b8" fontSize="8.5" fontFamily={FONT_SANS}>
        Dipped lower, then bounced back
      </text>

      {/* Right Callout 7: LOW */}
      <circle cx="404" cy="244" r={isWickStep ? 4.5 : 3.5} fill={isWickStep ? '#fbbf24' : '#f87171'} />
      <line
        x1="410"
        y1="244"
        x2="440"
        y2="244"
        stroke={isWickStep ? '#fbbf24' : '#475569'}
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <text x="444" y="247" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#f87171" fontFamily={FONT_MONO} fontWeight="700">
          LOW
        </tspan>
        <tspan fill="#cbd5e1"> (Lowest price reached)</tspan>
      </text>

      {/* ================= BOTTOM TIMELINE BAR ================= */}
      <rect
        x="16"
        y="262"
        width="648"
        height="40"
        rx="7"
        fill="#0f172a"
        stroke="#1e293b"
        strokeWidth="1"
      />
      {/* Step Pill 1: Timer Starts (Open) */}
      <rect
        x="24"
        y="269"
        width="188"
        height="26"
        rx="5"
        fill={isOpenStep ? '#0ea5e9' : '#1e293b'}
        fillOpacity={isOpenStep ? 0.25 : 0.7}
        stroke={isOpenStep ? '#38bdf8' : '#334155'}
        strokeWidth={isOpenStep ? 1.5 : 1}
      />
      <text
        x="118"
        y="285.5"
        textAnchor="middle"
        fill={isOpenStep ? '#7dd3fc' : '#cbd5e1'}
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        1. Timer Starts (Open)
      </text>

      <text x="225" y="286" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="700">
        →
      </text>

      {/* Step Pill 2: Price Moves Up/Down (Wicks) */}
      <rect
        x="238"
        y="269"
        width="202"
        height="26"
        rx="5"
        fill={isWickStep ? '#f59e0b' : '#1e293b'}
        fillOpacity={isWickStep ? 0.25 : 0.7}
        stroke={isWickStep ? '#fbbf24' : '#334155'}
        strokeWidth={isWickStep ? 1.5 : 1}
      />
      <text
        x="339"
        y="285.5"
        textAnchor="middle"
        fill={isWickStep ? '#fcd34d' : '#cbd5e1'}
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        2. Price Moves (Wicks)
      </text>

      <text x="453" y="286" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="700">
        →
      </text>

      {/* Step Pill 3: Timer Ends (Close & Color Locks) */}
      <rect
        x="466"
        y="269"
        width="190"
        height="26"
        rx="5"
        fill={isBodyStep ? '#10b981' : '#1e293b'}
        fillOpacity={isBodyStep ? 0.25 : 0.7}
        stroke={isBodyStep ? '#34d399' : '#334155'}
        strokeWidth={isBodyStep ? 1.5 : 1}
      />
      <text
        x="561"
        y="285.5"
        textAnchor="middle"
        fill={isBodyStep ? '#6ee7b7' : '#cbd5e1'}
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        3. Timer Ends (Color Locks)
      </text>
    </g>
  );
}

function SupportDemandSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="FLOOR (SUPPORT / DEMAND) VS. CEILING (RESISTANCE / SUPPLY)"
        accent="#34d399"
      />

      {/* Ceiling / Resistance / Supply Zone */}
      <rect
        x="34"
        y="42"
        width="612"
        height="46"
        rx="6"
        fill="#ef4444"
        fillOpacity={activeStep === 1 ? 0.28 : 0.14}
        stroke="#ef4444"
        strokeWidth={activeStep === 1 ? 2 : 1.25}
        strokeDasharray="6 4"
      />
      <text
        x="340"
        y="61"
        textAnchor="middle"
        fill="#fca5a5"
        fontSize="11"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        CEILING = RESISTANCE / SUPPLY ZONE
      </text>
      <text
        x="340"
        y="77"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="9.5"
        fontFamily={FONT_SANS}
      >
        Sellers step in here and push price back DOWN ▼
      </text>

      {/* Floor / Support / Demand Zone */}
      <rect
        x="34"
        y="212"
        width="612"
        height="46"
        rx="6"
        fill="#10b981"
        fillOpacity={activeStep === 0 ? 0.28 : 0.14}
        stroke="#10b981"
        strokeWidth={activeStep === 0 ? 2 : 1.25}
        strokeDasharray="6 4"
      />
      <text
        x="340"
        y="231"
        textAnchor="middle"
        fill="#6ee7b7"
        fontSize="11"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        FLOOR = SUPPORT / DEMAND ZONE
      </text>
      <text
        x="340"
        y="247"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="9.5"
        fontFamily={FONT_SANS}
      >
        Buyers step in here and bounce price back UP ▲
      </text>

      {/* Bouncing Price Path */}
      <polyline
        points="54,158 136,212 240,88 344,212 448,88 538,212 626,118"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Buyer bounce nodes on Floor */}
      {[
        { x: 136, label: 'Bounce #1' },
        { x: 344, label: 'Bounce #2' },
        { x: 538, label: 'Bounce #3' },
      ].map((pt) => (
        <g key={pt.label}>
          <circle
            cx={pt.x}
            cy={212}
            r={activeStep === 0 ? 7.5 : 5.5}
            fill="#10b981"
            stroke="#020617"
            strokeWidth="2"
          />
          <text
            x={pt.x}
            y={199}
            textAnchor="middle"
            fill="#34d399"
            fontSize="9.5"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            ▲ {pt.label}
          </text>
        </g>
      ))}

      {/* Seller rejection nodes on Ceiling */}
      {[
        { x: 240, label: 'Rejected #1' },
        { x: 448, label: 'Rejected #2' },
      ].map((pt) => (
        <g key={pt.label}>
          <circle
            cx={pt.x}
            cy={88}
            r={activeStep === 1 ? 7.5 : 5.5}
            fill="#ef4444"
            stroke="#020617"
            strokeWidth="2"
          />
          <text
            x={pt.x}
            y={107}
            textAnchor="middle"
            fill="#f87171"
            fontSize="9.5"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            ▼ {pt.label}
          </text>
        </g>
      ))}

      {/* Breakout hint pill on step 2+ */}
      {activeStep >= 2 && (
        <g>
          <rect
            x="554"
            y="100"
            width="92"
            height="22"
            rx="4"
            fill="#0ea5e9"
            fillOpacity="0.22"
            stroke="#38bdf8"
          />
          <text
            x="600"
            y="114.5"
            textAnchor="middle"
            fill="#7dd3fc"
            fontSize="9"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            Watch Reaction
          </text>
        </g>
      )}

      <DiagramBottomNote text="Simple Rule: Buy near the Floor (Demand) when buyers show up — never chase right into the Ceiling (Supply)." />
    </g>
  );
}

function OrderBlockChochSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="DOWNTREND → U-TURN BREAK (CHoCH) → ORDER BLOCK PULLBACK → RALLY UP"
        accent="#fbbf24"
      />

      {/* Last Lower High horizontal line for CHoCH */}
      <line
        x1="150"
        y1="126"
        x2="380"
        y2="126"
        stroke="#38bdf8"
        strokeWidth={activeStep === 1 ? 2.25 : 1.5}
        strokeDasharray="6 4"
      />
      <rect
        x="266"
        y="102"
        width="136"
        height="20"
        rx="4"
        fill="#0ea5e9"
        fillOpacity={activeStep === 1 ? 0.3 : 0.16}
        stroke="#38bdf8"
      />
      <text
        x="334"
        y="115.5"
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        2. CHoCH (U-Turn Break!)
      </text>

      {/* Order Block Shaded Zone extending from Last Red Candle */}
      <rect
        x="212"
        y="188"
        width="302"
        height="42"
        rx="5"
        fill="#f59e0b"
        fillOpacity={activeStep === 2 ? 0.28 : 0.14}
        stroke="#f59e0b"
        strokeWidth={activeStep === 2 ? 2 : 1.25}
        strokeDasharray="5 3"
      />
      <text
        x="356"
        y="246"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        3. ORDER BLOCK = Last Red Candle Before Big Rally
      </text>

      {/* Stage 1: Downtrend price line */}
      <polyline
        points="42,66 106,144 150,126 226,222"
        fill="none"
        stroke="#ef4444"
        strokeWidth={activeStep === 0 ? 3.5 : 2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="86"
        y="58"
        textAnchor="middle"
        fill="#f87171"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        1. Downtrend
      </text>
      <circle cx="150" cy="126" r="4.5" fill="#f87171" />
      <text
        x="150"
        y="116"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="8.5"
        fontFamily={FONT_MONO}
      >
        Last High
      </text>

      {/* Last Red Candle (Order Block visual) */}
      <line x1="226" y1="180" x2="226" y2="236" stroke="#ef4444" strokeWidth="2" />
      <rect
        x="215"
        y="190"
        width="22"
        height="36"
        rx="2"
        fill="#ef4444"
        stroke="#fbbf24"
        strokeWidth="1.5"
      />

      {/* Stage 2: Strong Green Impulse Breaking CHoCH */}
      <polyline
        points="238,208 292,126 356,74"
        fill="none"
        stroke="#10b981"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="292" cy="126" r={activeStep === 1 ? 6.5 : 4.5} fill="#38bdf8" />

      {/* Stage 3: Calm Pullback to Order Block */}
      <polyline
        points="356,74 422,148 468,206"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.25"
        strokeDasharray="5 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="468"
        cy="206"
        r={activeStep === 2 ? 7.5 : 5.5}
        fill="#f59e0b"
        stroke="#020617"
        strokeWidth="2"
      />
      <text
        x="468"
        y="181"
        textAnchor="middle"
        fill="#fcd34d"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        4. Pullback Entry
      </text>

      {/* Stage 4: Rally Up */}
      <polyline
        points="468,206 544,120 624,54"
        fill="none"
        stroke="#10b981"
        strokeWidth={activeStep >= 3 ? 4 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="624"
        cy="54"
        r={activeStep >= 3 ? 7 : 5}
        fill="#10b981"
        stroke="#020617"
        strokeWidth="2"
      />
      <text
        x="592"
        y="48"
        textAnchor="middle"
        fill="#34d399"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        5. Rally Up ▲
      </text>

      <DiagramBottomNote text="Plain English: Never catch a falling knife. Wait for the U-Turn (CHoCH), then buy the calm pullback to the Order Block." />
    </g>
  );
}

function MultiTimeframeSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      {/* Top Split Headers */}
      <rect
        x="18"
        y="10"
        width="234"
        height="24"
        rx="5"
        fill="#10b981"
        fillOpacity="0.15"
        stroke="#10b981"
        strokeOpacity="0.5"
      />
      <text
        x="135"
        y="25.5"
        textAnchor="middle"
        fill="#34d399"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        ZOOM OUT: 1-HOUR CANDLE
      </text>

      <rect
        x="312"
        y="10"
        width="350"
        height="24"
        rx="5"
        fill="#0ea5e9"
        fillOpacity="0.15"
        stroke="#0ea5e9"
        strokeOpacity="0.5"
      />
      <text
        x="487"
        y="25.5"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        ZOOM IN: FOUR 15-MINUTE CANDLES INSIDE IT
      </text>

      {/* Left Panel Frame */}
      <rect
        x="18"
        y="42"
        width="234"
        height="218"
        rx="7"
        fill="#0f172a"
        fillOpacity={activeStep === 0 ? 0.9 : 0.55}
        stroke={activeStep === 0 ? '#10b981' : '#1e293b'}
        strokeWidth={activeStep === 0 ? 1.75 : 1}
      />

      {/* Right Panel Frame */}
      <rect
        x="312"
        y="42"
        width="350"
        height="218"
        rx="7"
        fill="#0f172a"
        fillOpacity={activeStep >= 2 ? 0.9 : 0.55}
        stroke={activeStep >= 2 ? '#38bdf8' : '#1e293b'}
        strokeWidth={activeStep >= 2 ? 1.75 : 1}
      />

      {/* Horizontal OHLC alignment guides across both panels */}
      {[
        { y: 64, label: 'HIGH', color: '#34d399' },
        { y: 94, label: 'CLOSE', color: '#34d399' },
        { y: 196, label: 'OPEN', color: '#38bdf8' },
        { y: 230, label: 'LOW', color: '#fbbf24' },
      ].map((lvl) => (
        <g key={lvl.label}>
          <line
            x1="126"
            y1={lvl.y}
            x2="648"
            y2={lvl.y}
            stroke={lvl.color}
            strokeWidth={activeStep === 1 ? 1.4 : 0.9}
            strokeDasharray="4 4"
            opacity={activeStep === 1 ? 0.85 : 0.35}
          />
          <text
            x="40"
            y={lvl.y + 3.5}
            fill={lvl.color}
            fontSize="8.5"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            {lvl.label}
          </text>
        </g>
      ))}

      {/* LEFT: 1 Big 1-Hour Green Candle */}
      <line x1="142" y1="64" x2="142" y2="230" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
      <rect
        x="114"
        y="94"
        width="56"
        height="102"
        rx="4"
        fill="#10b981"
        stroke="#34d399"
        strokeWidth="1.5"
      />
      <text
        x="142"
        y="150"
        textAnchor="middle"
        fill="#022c22"
        fontSize="12"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        1H
      </text>
      <text
        x="135"
        y="251"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="9"
        fontFamily={FONT_MONO}
      >
        1 Candle = 60 Minutes
      </text>

      {/* Center Bracket showing 1H = 4 x 15m */}
      <path
        d="M 262 64 L 274 64 L 274 230 L 262 230"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2"
      />
      <line x1="274" y1="147" x2="306" y2="147" stroke="#fbbf24" strokeWidth="2" />
      <rect x="256" y="132" width="52" height="30" rx="5" fill="#020617" stroke="#fbbf24" />
      <text
        x="282"
        y="145"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        = 4×
      </text>
      <text
        x="282"
        y="157"
        textAnchor="middle"
        fill="#fde68a"
        fontSize="8"
        fontFamily={FONT_MONO}
      >
        15m
      </text>

      {/* RIGHT: 4 exact 15-minute candles building the 1H candle */}
      {/* Candle 1 (0-15m): Red Dip creating 1H Open & 1H Low */}
      <line x1="362" y1="190" x2="362" y2="230" stroke="#ef4444" strokeWidth="2.5" />
      <rect x="348" y="196" width="28" height="22" rx="2" fill="#ef4444" />
      <text x="362" y="250" textAnchor="middle" fill="#cbd5e1" fontSize="8.5" fontFamily={FONT_MONO}>
        0–15m
      </text>

      {/* Candle 2 (15-30m): Green Turnaround */}
      <line x1="444" y1="142" x2="444" y2="224" stroke="#10b981" strokeWidth="2.5" />
      <rect
        x="430"
        y="152"
        width="28"
        height="66"
        rx="2"
        fill="#10b981"
        stroke={activeStep >= 2 ? '#fbbf24' : 'none'}
        strokeWidth="2"
      />
      <text x="444" y="250" textAnchor="middle" fill="#34d399" fontSize="8.5" fontFamily={FONT_MONO}>
        15–30m
      </text>

      {/* Candle 3 (30-45m): Big Green Surge creating 1H High */}
      <line x1="526" y1="64" x2="526" y2="160" stroke="#10b981" strokeWidth="2.5" />
      <rect x="512" y="80" width="28" height="72" rx="2" fill="#10b981" />
      <text x="526" y="250" textAnchor="middle" fill="#34d399" fontSize="8.5" fontFamily={FONT_MONO}>
        30–45m
      </text>

      {/* Candle 4 (45-60m): Small Red Pullback landing at 1H Close */}
      <line x1="608" y1="74" x2="608" y2="108" stroke="#ef4444" strokeWidth="2.5" />
      <rect x="594" y="80" width="28" height="14" rx="2" fill="#ef4444" />
      <text x="608" y="250" textAnchor="middle" fill="#cbd5e1" fontSize="8.5" fontFamily={FONT_MONO}>
        45–60m
      </text>

      {/* Callout inside right panel */}
      <text
        x="444"
        y="128"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="8.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        Cleaner Entry!
      </text>

      <DiagramBottomNote text="Pro Secret: Zoom Out (1H/4H) to see the main trend, then Zoom In (15m) to catch the dip before it rallies." />
    </g>
  );
}

function MarketSessionsSvg({ activeStep }: DiagramSubProps) {
  const sessions = [
    {
      id: 'asia',
      x: 24,
      w: 180,
      title: 'ASIA SESSION',
      time: '7:00 PM – 2:00 AM NY',
      badge: 'Quiet Range',
      note: 'Sideways, builds highs/lows',
      color: '#f59e0b',
      textLight: '#fcd34d',
      active: activeStep === 0,
    },
    {
      id: 'london',
      x: 210,
      w: 146,
      title: 'LONDON OPEN',
      time: '2:00 AM – 8:00 AM NY',
      badge: 'Big Move',
      note: 'Sweeps Asia & launches trend',
      color: '#0ea5e9',
      textLight: '#7dd3fc',
      active: activeStep === 1,
    },
    {
      id: 'ny_overlap',
      x: 362,
      w: 162,
      title: 'NY OVERLAP ★',
      time: '8:00 AM – 12:00 PM NY',
      badge: 'Peak Volume',
      note: 'Fastest, cleanest moves',
      color: '#10b981',
      textLight: '#6ee7b7',
      active: activeStep >= 2,
    },
    {
      id: 'ny_late',
      x: 530,
      w: 126,
      title: 'NY LATE DAY',
      time: '12:00 PM – 5:00 PM',
      badge: 'Slowdown',
      note: 'Lower volume / chop',
      color: '#64748b',
      textLight: '#cbd5e1',
      active: false,
    },
  ];

  return (
    <g>
      <DiagramTopBanner
        text="24-HOUR MARKET SESSIONS (ALL TIMES IN NEW YORK / EST)"
        accent="#38bdf8"
      />

      {/* Volume / Activity Curve Area */}
      <text x="28" y="54" fill="#94a3b8" fontSize="9" fontFamily={FONT_MONO} fontWeight="600">
        TRADING VOLUME &amp; SPEED
      </text>
      <path
        d="M 24 148 L 24 134 Q 70 128, 114 136 Q 160 142, 204 132 L 244 92 Q 285 72, 356 88 Q 405 46, 445 50 Q 490 54, 524 100 Q 580 132, 656 140 L 656 148 Z"
        fill="#10b981"
        fillOpacity="0.14"
      />
      <path
        d="M 24 134 Q 70 128, 114 136 Q 160 142, 204 132 L 244 92 Q 285 72, 356 88 Q 405 46, 445 50 Q 490 54, 524 100 Q 580 132, 656 140"
        fill="none"
        stroke="#34d399"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* Peak callout dot */}
      <circle cx="442" cy="50" r="5.5" fill="#10b981" stroke="#020617" strokeWidth="2" />
      <text
        x="442"
        y="43"
        textAnchor="middle"
        fill="#6ee7b7"
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        PEAK ACTIVITY (LONDON + NY)
      </text>

      {/* Baseline */}
      <line x1="24" y1="148" x2="656" y2="148" stroke="#334155" strokeWidth="1" />

      {/* 4 Horizontal Session Blocks */}
      {sessions.map((s) => (
        <g key={s.id}>
          <rect
            x={s.x}
            y="160"
            width={s.w}
            height="84"
            rx="6"
            fill={s.color}
            fillOpacity={s.active ? 0.24 : 0.1}
            stroke={s.color}
            strokeWidth={s.active ? 2 : 1.1}
          />
          <text
            x={s.x + s.w / 2}
            y="178"
            textAnchor="middle"
            fill={s.textLight}
            fontSize="10"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            {s.title}
          </text>
          <text
            x={s.x + s.w / 2}
            y="194"
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="8.5"
            fontFamily={FONT_MONO}
          >
            {s.time}
          </text>
          <rect
            x={s.x + 12}
            y="202"
            width={s.w - 24}
            height="17"
            rx="4"
            fill={s.color}
            fillOpacity="0.22"
          />
          <text
            x={s.x + s.w / 2}
            y="214"
            textAnchor="middle"
            fill={s.textLight}
            fontSize="8.5"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            {s.badge}
          </text>
          <text
            x={s.x + s.w / 2}
            y="235"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="8.2"
            fontFamily={FONT_SANS}
          >
            {s.note}
          </text>
        </g>
      ))}

      {/* Time axis ticks */}
      <text x="24" y="259" fill="#64748b" fontSize="8.5" fontFamily={FONT_MONO}>
        7 PM
      </text>
      <text x="210" y="259" fill="#38bdf8" fontSize="8.5" fontFamily={FONT_MONO} fontWeight="700">
        2 AM (London)
      </text>
      <text x="362" y="259" fill="#34d399" fontSize="8.5" fontFamily={FONT_MONO} fontWeight="700">
        8 AM (NY Open)
      </text>
      <text x="530" y="259" fill="#94a3b8" fontSize="8.5" fontFamily={FONT_MONO}>
        12 PM
      </text>
      <text x="656" y="259" textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily={FONT_MONO}>
        5 PM NY
      </text>

      <DiagramBottomNote text="Beginner Tip: Focus on London Open (2–5 AM NY) or NY Overlap (8–11 AM NY) — skip slow, choppy hours." />
    </g>
  );
}

function CryptoFundingDominanceSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="CRYPTO 3-STAGE CYCLE: BTC LEADS → CROWDED LEVERAGE → LIQUIDATION FLUSH"
        accent="#fbbf24"
      />

      {/* STAGE 1 CARD */}
      <rect
        x="20"
        y="44"
        width="196"
        height="212"
        rx="8"
        fill="#10b981"
        fillOpacity={activeStep === 0 ? 0.16 : 0.07}
        stroke="#10b981"
        strokeWidth={activeStep === 0 ? 2 : 1.1}
      />
      <text
        x="118"
        y="66"
        textAnchor="middle"
        fill="#34d399"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        STAGE 1: BTC LEADS
      </text>
      <text x="118" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="9.5" fontFamily={FONT_SANS}>
        Money enters Bitcoin first
      </text>
      {/* Mini BTC dominance visual */}
      <rect x="34" y="96" width="168" height="82" rx="5" fill="#020617" stroke="#1e293b" />
      <text x="44" y="113" fill="#34d399" fontSize="9" fontFamily={FONT_MONO} fontWeight="700">
        BTC Dominance ▲
      </text>
      <polyline
        points="44,164 78,150 110,154 146,128 188,112"
        fill="none"
        stroke="#10b981"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="188" cy="112" r="4" fill="#34d399" />
      <text x="44" y="172" fill="#64748b" fontSize="8" fontFamily={FONT_MONO}>
        Funding: 0.01% (Healthy)
      </text>
      <text x="118" y="200" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily={FONT_SANS}>
        • Big spot buyers load BTC
      </text>
      <text x="118" y="217" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily={FONT_SANS}>
        • Low leverage, steady rise
      </text>
      <text x="118" y="234" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily={FONT_SANS}>
        • Altcoins wait their turn
      </text>

      {/* Arrow 1 -> 2 */}
      <text x="229" y="154" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="700">
        →
      </text>

      {/* STAGE 2 CARD */}
      <rect
        x="242"
        y="44"
        width="196"
        height="212"
        rx="8"
        fill="#f59e0b"
        fillOpacity={activeStep === 1 ? 0.18 : 0.07}
        stroke="#f59e0b"
        strokeWidth={activeStep === 1 ? 2 : 1.1}
      />
      <text
        x="340"
        y="66"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        STAGE 2: OVERCROWDED
      </text>
      <text x="340" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="9.5" fontFamily={FONT_SANS}>
        Crowded Leveraged Longs
      </text>
      {/* Mini Funding Gauge visual */}
      <rect x="256" y="96" width="168" height="82" rx="5" fill="#020617" stroke="#1e293b" />
      <text x="266" y="113" fill="#fbbf24" fontSize="9" fontFamily={FONT_MONO} fontWeight="700">
        HIGH FUNDING: +0.08%
      </text>
      {/* Meter track */}
      <rect x="266" y="124" width="148" height="14" rx="4" fill="#1e293b" />
      <rect x="266" y="124" width="130" height="14" rx="4" fill="#f59e0b" />
      <rect x="366" y="124" width="30" height="14" rx="4" fill="#ef4444" />
      <text x="266" y="156" fill="#fca5a5" fontSize="8.5" fontFamily={FONT_MONO} fontWeight="700">
        20x / 50x LONGS PACKED
      </text>
      <text x="266" y="170" fill="#94a3b8" fontSize="8" fontFamily={FONT_SANS}>
        Late buyers borrow heavily
      </text>
      <text x="340" y="200" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily={FONT_SANS}>
        • Everyone bets UP on margin
      </text>
      <text x="340" y="217" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily={FONT_SANS}>
        • Longs pay steep funding fees
      </text>
      <text x="340" y="234" textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily={FONT_SANS}>
        • Fragile — ripe for a flush!
      </text>

      {/* Arrow 2 -> 3 */}
      <text x="451" y="154" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="700">
        →
      </text>

      {/* STAGE 3 CARD */}
      <rect
        x="464"
        y="44"
        width="196"
        height="212"
        rx="8"
        fill="#ef4444"
        fillOpacity={activeStep >= 2 ? 0.18 : 0.07}
        stroke="#ef4444"
        strokeWidth={activeStep >= 2 ? 2 : 1.1}
      />
      <text
        x="562"
        y="66"
        textAnchor="middle"
        fill="#f87171"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        STAGE 3: FLUSH &amp; RESET
      </text>
      <text x="562" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="9.5" fontFamily={FONT_SANS}>
        Liquidation Sweep &amp; Reset
      </text>
      {/* Mini Liquidation Wick visual */}
      <rect x="478" y="96" width="168" height="82" rx="5" fill="#020617" stroke="#1e293b" />
      <polyline
        points="488,118 524,114 548,166 574,126 634,106"
        fill="none"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="548,166 574,126 634,106"
        fill="none"
        stroke="#10b981"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="548" cy="166" r="4.5" fill="#ef4444" />
      <text x="588" y="168" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily={FONT_MONO}>
        Liq. Wipeout
      </text>
      <text x="598" y="109" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily={FONT_MONO}>
        Clean Reset ✓
      </text>
      <text x="562" y="200" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily={FONT_SANS}>
        • Sharp wick wipes 50x longs
      </text>
      <text x="562" y="217" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily={FONT_SANS}>
        • Funding drops back to ~0%
      </text>
      <text x="562" y="234" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily={FONT_SANS}>
        • Real uptrend can resume
      </text>

      <DiagramBottomNote text="Simple Rule: Never chase pumps when Crypto Funding is overheated — wait for the liquidation flush & reset." />
    </g>
  );
}

function StocksOrbGapSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="STOCKS PLAYBOOK: OVERNIGHT GAP UP → 5-MIN OPENING RANGE BOX → VOLUME BREAKOUT"
        accent="#34d399"
      />

      {/* Vertical 9:30 AM Market Open divider */}
      <line
        x1="252"
        y1="42"
        x2="252"
        y2="256"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text
        x="252"
        y="54"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        9:30 AM OPEN
      </text>

      {/* 1. Yesterday Close section */}
      <line x1="26" y1="186" x2="246" y2="186" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="86" y="202" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily={FONT_MONO}>
        Yesterday Close ($100)
      </text>
      {/* Calm yesterday candles */}
      <line x1="56" y1="168" x2="56" y2="196" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="49" y="176" width="14" height="14" rx="1.5" fill="#64748b" />
      <line x1="88" y1="170" x2="88" y2="194" stroke="#10b981" strokeWidth="1.5" />
      <rect x="81" y="176" width="14" height="12" rx="1.5" fill="#10b981" />
      <line x1="120" y1="174" x2="120" y2="194" stroke="#10b981" strokeWidth="1.5" />
      <rect x="113" y="178" width="14" height="10" rx="1.5" fill="#10b981" />

      {/* 2. Overnight Gap Up band */}
      <rect
        x="146"
        y="126"
        width="98"
        height="60"
        rx="5"
        fill="#0ea5e9"
        fillOpacity={activeStep === 0 ? 0.25 : 0.12}
        stroke="#38bdf8"
        strokeDasharray="4 3"
      />
      <line
        x1="195"
        y1="182"
        x2="195"
        y2="132"
        stroke="#38bdf8"
        strokeWidth="2.25"
        strokeDasharray="4 2"
      />
      <polygon points="195,128 189,138 201,138" fill="#38bdf8" />
      <text
        x="195"
        y="108"
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        OVERNIGHT GAP UP
      </text>
      <text x="195" y="120" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily={FONT_SANS}>
        (+4% on Earnings/News)
      </text>

      {/* 3. 5-Min Opening Range Box (ORB) */}
      <rect
        x="260"
        y="100"
        width="126"
        height="56"
        rx="4"
        fill="#f59e0b"
        fillOpacity={activeStep === 1 ? 0.28 : 0.14}
        stroke="#f59e0b"
        strokeWidth={activeStep === 1 ? 2 : 1.3}
      />
      <line x1="260" y1="100" x2="646" y2="100" stroke="#f59e0b" strokeWidth="1.25" strokeDasharray="5 4" />
      <text
        x="323"
        y="80"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        5-MIN OPENING RANGE
      </text>
      <text x="323" y="93" textAnchor="middle" fill="#fcd34d" fontSize="8.5" fontFamily={FONT_MONO}>
        ORB HIGH ($105.20)
      </text>
      <text x="323" y="170" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily={FONT_MONO}>
        ORB LOW ($103.80)
      </text>
      {/* First 5m candle inside ORB */}
      <line x1="296" y1="102" x2="296" y2="154" stroke="#10b981" strokeWidth="2" />
      <rect x="287" y="114" width="18" height="28" rx="2" fill="#10b981" />
      <line x1="346" y1="106" x2="346" y2="150" stroke="#ef4444" strokeWidth="2" />
      <rect x="337" y="118" width="18" height="20" rx="2" fill="#ef4444" />

      {/* 4. High-Volume Breakout Candles */}
      {/* Breakout candle */}
      <line x1="422" y1="68" x2="422" y2="128" stroke="#10b981" strokeWidth="2.5" />
      <rect
        x="411"
        y="76"
        width="22"
        height="46"
        rx="2"
        fill="#10b981"
        stroke={activeStep >= 2 ? '#6ee7b7' : 'none'}
        strokeWidth="2"
      />
      {/* Retest */}
      <line x1="478" y1="74" x2="478" y2="104" stroke="#ef4444" strokeWidth="2" />
      <rect x="469" y="80" width="18" height="16" rx="2" fill="#ef4444" />
      {/* Continuation rally */}
      <line x1="534" y1="54" x2="534" y2="96" stroke="#10b981" strokeWidth="2.25" />
      <rect x="524" y="60" width="20" height="32" rx="2" fill="#10b981" />
      <line x1="590" y1="44" x2="590" y2="76" stroke="#10b981" strokeWidth="2.25" />
      <rect x="580" y="48" width="20" height="24" rx="2" fill="#10b981" />

      <text
        x="512"
        y="52"
        textAnchor="middle"
        fill="#34d399"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        HIGH-VOLUME BREAKOUT ▲
      </text>

      {/* Bottom Volume Bars Strip */}
      <line x1="26" y1="256" x2="652" y2="256" stroke="#334155" strokeWidth="1" />
      <text x="30" y="248" fill="#64748b" fontSize="8.5" fontFamily={FONT_MONO}>
        VOLUME:
      </text>
      {[
        { x: 82, h: 14, color: '#475569' },
        { x: 114, h: 12, color: '#475569' },
        { x: 288, h: 28, color: '#f59e0b' },
        { x: 338, h: 22, color: '#f59e0b' },
        { x: 412, h: 52, color: '#10b981' },
        { x: 470, h: 20, color: '#64748b' },
        { x: 525, h: 38, color: '#10b981' },
        { x: 581, h: 32, color: '#10b981' },
      ].map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={256 - bar.h}
          width="18"
          height={bar.h}
          rx="2"
          fill={bar.color}
          opacity={bar.x === 412 ? 1 : 0.7}
        />
      ))}
      <text
        x="422"
        y="198"
        textAnchor="middle"
        fill="#34d399"
        fontSize="8.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        VOL SPIKE ✓
      </text>

      <DiagramBottomNote text="Simple Rule: Let the first 5 minutes draw the Opening Range box, then only trade a breakout backed by heavy Volume." />
    </g>
  );
}

function TradeManagementJournalSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="TRADE MANAGEMENT: SAFETY NET → PARTIAL AT 1:1 → MOVE STOP TO ZERO RISK → 1:3 TARGET"
        accent="#38bdf8"
      />

      {/* Final Target 1:3 Line */}
      <line x1="40" y1="58" x2="640" y2="58" stroke="#10b981" strokeWidth="1.75" strokeDasharray="6 4" />
      <rect x="466" y="42" width="174" height="20" rx="4" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
      <text
        x="553"
        y="55.5"
        textAnchor="middle"
        fill="#6ee7b7"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        5. FINAL TARGET 1:3 (+3R)
      </text>

      {/* Partial Profit 1:1 Line */}
      <line x1="40" y1="138" x2="640" y2="138" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 4" />
      <rect
        x="210"
        y="112"
        width="182"
        height="20"
        rx="4"
        fill="#f59e0b"
        fillOpacity={activeStep === 1 ? 0.3 : 0.16}
        stroke="#f59e0b"
      />
      <text
        x="301"
        y="125.5"
        textAnchor="middle"
        fill="#fcd34d"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        3. PARTIAL PROFIT AT 1:1 (+1R)
      </text>

      {/* Initial Risk Box (-1R) from Entry down to Stop Loss */}
      <rect
        x="86"
        y="184"
        width="198"
        height="46"
        rx="4"
        fill="#ef4444"
        fillOpacity={activeStep === 0 ? 0.28 : 0.14}
        stroke="#ef4444"
        strokeWidth="1.25"
      />
      <text
        x="185"
        y="246"
        textAnchor="middle"
        fill="#f87171"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        2. STOP LOSS (Safety Net -1R)
      </text>

      {/* Entry / Breakeven Line */}
      <line x1="40" y1="184" x2="292" y2="184" stroke="#0ea5e9" strokeWidth="2" />
      {/* Zero-Risk Line after Stop moved to Entry */}
      <line
        x1="292"
        y1="184"
        x2="640"
        y2="184"
        stroke="#10b981"
        strokeWidth={activeStep === 1 ? 2.75 : 2}
        strokeDasharray="6 3"
      />

      {/* Curved/Vertical Arrow showing Stop Loss moved up to Entry */}
      <line x1="302" y1="228" x2="302" y2="192" stroke="#38bdf8" strokeWidth="2.5" />
      <polygon points="302,185 296,195 308,195" fill="#38bdf8" />
      <rect
        x="320"
        y="196"
        width="254"
        height="34"
        rx="5"
        fill="#0ea5e9"
        fillOpacity={activeStep === 1 ? 0.28 : 0.14}
        stroke="#38bdf8"
        strokeWidth={activeStep === 1 ? 1.75 : 1}
      />
      <text
        x="447"
        y="211"
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        4. MOVE STOP TO ENTRY (ZERO RISK!)
      </text>
      <text
        x="447"
        y="224"
        textAnchor="middle"
        fill="#cbd5e1"
        fontSize="8.5"
        fontFamily={FONT_SANS}
      >
        Worst case now = breakeven + banked partial profit
      </text>

      {/* Price Path */}
      <polyline
        points="42,216 106,184 166,204 294,138 368,158 468,100 562,58"
        fill="none"
        stroke="#f8fafc"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Milestone 1: Entry */}
      <circle
        cx="106"
        cy="184"
        r={activeStep === 0 ? 7 : 5.5}
        fill="#0ea5e9"
        stroke="#020617"
        strokeWidth="2"
      />
      <text
        x="96"
        y="172"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        1. ENTRY
      </text>

      {/* Milestone 3: Partial 1:1 */}
      <circle
        cx="294"
        cy="138"
        r={activeStep === 1 ? 7 : 5.5}
        fill="#f59e0b"
        stroke="#020617"
        strokeWidth="2"
      />

      {/* Milestone 5: Target 1:3 */}
      <circle
        cx="562"
        cy="58"
        r={activeStep >= 2 ? 7.5 : 5.5}
        fill="#10b981"
        stroke="#020617"
        strokeWidth="2"
      />

      <DiagramBottomNote text="Journal Habit: Record Entry, Stop, Partial, & Result on every trade so discipline compounds your edge." />
    </g>
  );
}

/* ==================== EXISTING 6 DIAGRAMS (UPGRADED WITH PLAIN-ENGLISH HELPERS) ==================== */

function MarketStructureSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="UPTREND STAIRCASE: HIGHER HIGHS (HH), HIGHER LOWS (HL) & BREAK OF STRUCTURE (BOS)"
        accent="#34d399"
      />

      {/* Bullish trend swing path */}
      <polyline
        points="48,236 132,162 194,202 296,120 368,160 490,74 568,110 634,56"
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* BOS horizontal lines */}
      <line
        x1="132"
        y1="162"
        x2="282"
        y2="162"
        stroke="#0ea5e9"
        strokeWidth="1.75"
        strokeDasharray="6 4"
        opacity={activeStep === 1 ? 1 : 0.65}
      />
      <line
        x1="296"
        y1="120"
        x2="466"
        y2="120"
        stroke="#0ea5e9"
        strokeWidth="1.75"
        strokeDasharray="6 4"
        opacity={activeStep === 2 ? 1 : 0.65}
      />

      {/* Protected Swing Low highlight */}
      <line
        x1="194"
        y1="202"
        x2="404"
        y2="202"
        stroke="#f59e0b"
        strokeWidth="1.75"
        strokeDasharray="4 4"
        opacity={activeStep === 3 ? 1 : 0.6}
      />

      {/* Swing nodes */}
      {[
        { x: 132, y: 162, label: 'HH 1 (Peak)', color: '#10b981', dy: -14 },
        { x: 194, y: 202, label: 'HL 1 (Protected Floor)', color: '#f59e0b', dy: 22 },
        { x: 296, y: 120, label: 'HH 2 (Higher Peak)', color: '#10b981', dy: -14 },
        { x: 368, y: 160, label: 'HL 2 (Higher Floor)', color: '#10b981', dy: 22 },
        { x: 490, y: 74, label: 'HH 3', color: '#10b981', dy: -14 },
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
            fontSize="10"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            {node.label}
          </text>
        </g>
      ))}

      <rect x="200" y="138" width="96" height="19" rx="4" fill="#0ea5e9" fillOpacity="0.2" />
      <text
        x="248"
        y="151"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        BOS (Break Up)
      </text>

      <rect x="374" y="96" width="96" height="19" rx="4" fill="#0ea5e9" fillOpacity="0.2" />
      <text
        x="422"
        y="109"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        BOS (Break Up)
      </text>

      <DiagramBottomNote text="Glossary: HH = Higher High (new peak) • HL = Higher Low (higher floor) • BOS = Break of Structure (uptrend continues)." />
    </g>
  );
}

function LiquidityPoolsSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="LIQUIDITY POOLS: WHERE STOP-LOSSES CLUSTER ABOVE HIGHS (BSL) & BELOW LOWS (SSL)"
        accent="#fbbf24"
      />

      {/* Buy-side liquidity band */}
      <rect
        x="38"
        y="50"
        width="604"
        height="38"
        rx="6"
        fill="#f59e0b"
        fillOpacity={activeStep === 0 ? 0.25 : 0.13}
        stroke="#f59e0b"
        strokeDasharray="5 4"
      />
      <text
        x="340"
        y="67"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        BSL = BUY-SIDE LIQUIDITY (Stop-Losses Stacked Above Highs)
      </text>
      <text x="340" y="81" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily={FONT_SANS}>
        Sellers&apos; stop-losses &amp; breakout buy orders sit waiting here
      </text>

      {/* Range price path */}
      <polyline
        points="54,154 126,96 202,208 278,98 354,206 432,100 498,200 568,74 622,170"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.75"
        strokeLinejoin="round"
      />

      {/* Sweep marker above BSL */}
      <circle
        cx="568"
        cy="74"
        r={activeStep >= 2 ? 7.5 : 5.5}
        fill="#ef4444"
        stroke="#080c11"
        strokeWidth="2"
      />
      <text
        x="568"
        y="46"
        textAnchor="middle"
        fill="#f87171"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        Stop Hunt / Tap
      </text>

      {/* Sell-side liquidity band */}
      <rect
        x="38"
        y="214"
        width="604"
        height="38"
        rx="6"
        fill="#0ea5e9"
        fillOpacity={activeStep === 1 ? 0.25 : 0.13}
        stroke="#0ea5e9"
        strokeDasharray="5 4"
      />
      <text
        x="340"
        y="231"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        SSL = SELL-SIDE LIQUIDITY (Stop-Losses Stacked Below Lows)
      </text>
      <text x="340" y="245" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily={FONT_SANS}>
        Buyers&apos; stop-losses &amp; breakdown sell orders sit waiting here
      </text>

      <DiagramBottomNote text="Plain English: Big institutions need huge order pools to fill trades — they often sweep BSL or SSL before reversing." />
    </g>
  );
}

function EqualHighsLowsSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="EQUAL HIGHS (EQH): WHY 'DOUBLE TOPS' ATTRACT STOP RAIDS BEFORE DROPPING"
        accent="#fbbf24"
      />

      {/* Equal Highs line */}
      <line
        x1="64"
        y1="88"
        x2="616"
        y2="88"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <text
        x="236"
        y="74"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        $$$ EQUAL HIGHS (EQH) — Matching Peaks = Stop Cluster
      </text>

      {/* Price bouncing cleanly twice then sweeping */}
      <polyline
        points="54,204 138,90 218,178 310,90 398,170 468,58 518,136 610,236"
        fill="none"
        stroke="#10b981"
        strokeWidth="2.75"
        strokeLinejoin="round"
      />
      {/* Rejection leg colored bearish */}
      <polyline
        points="468,58 518,136 610,236"
        fill="none"
        stroke="#ef4444"
        strokeWidth="3.25"
        strokeLinejoin="round"
      />

      <circle cx="138" cy="90" r="5" fill="#f59e0b" />
      <circle cx="310" cy="90" r="5" fill="#f59e0b" />
      <circle
        cx="468"
        cy="58"
        r={activeStep >= 1 ? 8 : 6}
        fill="#ef4444"
        stroke="#080c11"
        strokeWidth="2"
      />
      <text
        x="484"
        y="48"
        textAnchor="middle"
        fill="#f87171"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        Stop Raid Wick (Trap!)
      </text>
      <text
        x="568"
        y="252"
        textAnchor="middle"
        fill="#f87171"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        Fast Reversal Down ▼
      </text>

      <DiagramBottomNote text="Plain English: Two matching peaks (EQH) tempt traders to put stops right above — price often spikes above to trigger them, then drops." />
    </g>
  );
}

function LiquiditySweepVsBreakoutSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="FAKEOUT TRAP (SWEEP) VS. REAL BREAKOUT — WATCH WHERE THE CANDLE BODY CLOSES!"
        accent="#38bdf8"
      />

      {/* Divider */}
      <line x1="340" y1="38" x2="340" y2="260" stroke="#334155" strokeDasharray="4 4" />

      {/* Left side: Liquidity Sweep */}
      <text
        x="170"
        y="56"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="11.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        LIQUIDITY SWEEP (FAKEOUT TRAP)
      </text>
      <line x1="38" y1="120" x2="306" y2="120" stroke="#f59e0b" strokeDasharray="5 4" strokeWidth="1.75" />
      <line x1="96" y1="146" x2="96" y2="196" stroke="#10b981" strokeWidth="2" />
      <rect x="87" y="156" width="18" height="32" fill="#10b981" rx="2" />
      <line x1="164" y1="74" x2="164" y2="166" stroke="#ef4444" strokeWidth="2.5" />
      <rect
        x="154"
        y="128"
        width="20"
        height="28"
        fill="#ef4444"
        rx="2"
        stroke={activeStep === 0 ? '#fbbf24' : 'none'}
        strokeWidth="2"
      />
      <text x="164" y="68" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        Wick Only Above Line!
      </text>
      <line x1="232" y1="142" x2="232" y2="230" stroke="#ef4444" strokeWidth="2" />
      <rect x="222" y="150" width="20" height="68" fill="#ef4444" rx="2" />
      <text x="170" y="252" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontFamily={FONT_SANS}>
        Body closes back BELOW line → Reversal
      </text>

      {/* Right side: True Breakout */}
      <text
        x="510"
        y="56"
        textAnchor="middle"
        fill="#34d399"
        fontSize="11.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        TRUE BREAKOUT (REAL STRENGTH)
      </text>
      <line x1="374" y1="160" x2="642" y2="160" stroke="#0ea5e9" strokeDasharray="5 4" strokeWidth="1.75" />
      <line x1="432" y1="166" x2="432" y2="216" stroke="#10b981" strokeWidth="2" />
      <rect x="423" y="172" width="18" height="34" fill="#10b981" rx="2" />
      <line x1="498" y1="94" x2="498" y2="172" stroke="#10b981" strokeWidth="2.5" />
      <rect
        x="488"
        y="104"
        width="20"
        height="58"
        fill="#10b981"
        rx="2"
        stroke={activeStep >= 1 ? '#38bdf8' : 'none'}
        strokeWidth="2"
      />
      <text x="498" y="86" textAnchor="middle" fill="#34d399" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        Full Body Closes Above
      </text>
      <line x1="564" y1="82" x2="564" y2="158" stroke="#10b981" strokeWidth="2" />
      <rect x="555" y="92" width="18" height="44" fill="#10b981" rx="2" />
      <text x="510" y="252" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontFamily={FONT_SANS}>
        Holds above broken level → Continuation
      </text>

      <DiagramBottomNote text="Golden Rule: A Wick poking past resistance is often a trap. Wait for a full Candle Body Close to confirm a breakout." />
    </g>
  );
}

function FairValueGapSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="FAIR VALUE GAP (FVG): A 3-CANDLE PRICE GAP THAT ACTS LIKE A PULLBACK MAGNET"
        accent="#38bdf8"
      />

      {/* FVG Shaded Imbalance Zone between Candle 1 High (172) and Candle 3 Low (122) */}
      <rect
        x="156"
        y="122"
        width="454"
        height="50"
        rx="4"
        fill="#0ea5e9"
        fillOpacity={activeStep === 1 ? 0.28 : 0.16}
        stroke="#0ea5e9"
        strokeDasharray="5 3"
      />
      <text
        x="492"
        y="144"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        FAIR VALUE GAP (FVG)
      </text>
      <text x="492" y="159" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily={FONT_SANS}>
        Empty gap between C1 High &amp; C3 Low
      </text>

      {/* Candle 1 */}
      <line x1="146" y1="172" x2="146" y2="240" stroke="#10b981" strokeWidth="2" />
      <rect x="132" y="186" width="28" height="44" fill="#10b981" rx="3" />
      <text x="146" y="256" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily={FONT_MONO}>
        Candle 1
      </text>

      {/* Candle 2 (Displacement) */}
      <line x1="224" y1="78" x2="224" y2="204" stroke="#10b981" strokeWidth="2.5" />
      <rect x="208" y="92" width="32" height="96" fill="#10b981" rx="3" />
      <text x="224" y="256" textAnchor="middle" fill="#34d399" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        Candle 2 (Fast Jump)
      </text>

      {/* Candle 3 */}
      <line x1="302" y1="62" x2="302" y2="122" stroke="#10b981" strokeWidth="2" />
      <rect x="288" y="72" width="28" height="36" fill="#10b981" rx="3" />
      <text x="302" y="256" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily={FONT_MONO}>
        Candle 3
      </text>

      {/* Mitigation retrace arrow */}
      <polyline
        points="338,88 410,144 524,70"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2.5"
        strokeDasharray="6 3"
      />
      <circle cx="410" cy="144" r="6" fill="#f59e0b" />
      <text x="410" y="112" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        Pullback Entry (Fills Gap)
      </text>

      <DiagramBottomNote text="Plain English: When Candle 2 shoots up so fast that Candle 1 and Candle 3 wicks don't overlap, price often returns to fill the gap." />
    </g>
  );
}

function RiskRewardModelSvg({ activeStep }: DiagramSubProps) {
  return (
    <g>
      <DiagramTopBanner
        text="1:3 RISK-TO-REWARD: RISK $1 TO MAKE $3 (WIN JUST 40% AND STILL GROW)"
        accent="#34d399"
      />

      {/* Reward Box (+3R) */}
      <rect
        x="220"
        y="46"
        width="380"
        height="122"
        rx="6"
        fill="#10b981"
        fillOpacity={activeStep >= 2 ? 0.24 : 0.14}
        stroke="#10b981"
        strokeWidth="1.5"
      />
      <text
        x="410"
        y="104"
        textAnchor="middle"
        fill="#34d399"
        fontSize="13.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        REWARD TARGET (+3R)
      </text>
      <text x="410" y="122" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontFamily={FONT_SANS}>
        Make $3 for every $1 risked (3× larger than Stop box)
      </text>

      {/* Entry Line */}
      <line x1="70" y1="168" x2="600" y2="168" stroke="#0ea5e9" strokeWidth="2" />
      <text
        x="140"
        y="161"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="10.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        PLANNED ENTRY
      </text>

      {/* Risk Box (-1R) */}
      <rect
        x="220"
        y="168"
        width="380"
        height="44"
        rx="6"
        fill="#ef4444"
        fillOpacity={activeStep === 0 ? 0.28 : 0.16}
        stroke="#ef4444"
        strokeWidth="1.5"
      />
      <text
        x="410"
        y="194"
        textAnchor="middle"
        fill="#fca5a5"
        fontSize="11.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        FIXED RISK (-1R / MAX 1% ACCOUNT)
      </text>

      {/* Simulated Price Path */}
      <polyline
        points="68,204 160,144 226,168 286,188 378,128 474,94 568,54"
        fill="none"
        stroke="#f8fafc"
        strokeWidth="2.75"
        strokeLinejoin="round"
      />
      <circle cx="226" cy="168" r="5" fill="#0ea5e9" />
      <circle cx="568" cy="54" r="6" fill="#10b981" />

      <text
        x="340"
        y="246"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="10"
        fontFamily={FONT_MONO}
      >
        Position Size = (Account × Risk %) ÷ Stop-Loss Distance
      </text>

      <DiagramBottomNote text="Math Made Simple: One +3R winner pays for three -1R losses. Never risk more than 1% of your account on one trade." />
    </g>
  );
}

function renderDiagramGraphics(kind: DiagramKind, activeStep: number) {
  switch (kind) {
    case 'candlestick_anatomy':
      return <CandlestickAnatomySvg activeStep={activeStep} />;
    case 'support_demand':
      return <SupportDemandSvg activeStep={activeStep} />;
    case 'order_block_choch':
      return <OrderBlockChochSvg activeStep={activeStep} />;
    case 'multi_timeframe':
      return <MultiTimeframeSvg activeStep={activeStep} />;
    case 'market_sessions':
      return <MarketSessionsSvg activeStep={activeStep} />;
    case 'crypto_funding_dominance':
      return <CryptoFundingDominanceSvg activeStep={activeStep} />;
    case 'stocks_orb_gap':
      return <StocksOrbGapSvg activeStep={activeStep} />;
    case 'trade_management_journal':
      return <TradeManagementJournalSvg activeStep={activeStep} />;
    case 'market_structure':
      return <MarketStructureSvg activeStep={activeStep} />;
    case 'liquidity_pools':
      return <LiquidityPoolsSvg activeStep={activeStep} />;
    case 'equal_highs_lows':
      return <EqualHighsLowsSvg activeStep={activeStep} />;
    case 'liquidity_sweep_vs_breakout':
      return <LiquiditySweepVsBreakoutSvg activeStep={activeStep} />;
    case 'fair_value_gap':
      return <FairValueGapSvg activeStep={activeStep} />;
    case 'risk_reward_model':
      return <RiskRewardModelSvg activeStep={activeStep} />;
  }
}

export function ConceptDiagramSvg({ config }: ConceptDiagramSvgProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const totalSteps = Math.max(config.walkthroughSteps.length, 1);

  useEffect(() => {
    setActiveStep(0);
  }, [config.kind, config.title]);

  const safeStep = activeStep >= totalSteps ? 0 : activeStep;

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % totalSteps);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terminal-border bg-terminal-elevated/60 px-4 py-3">
          <div>
            <h4 className="text-sm font-semibold text-terminal-text">{config.title}</h4>
            <p className="text-xs text-terminal-muted">{config.subtitle}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-emerald-500 dark:text-emerald-400">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Interactive Blueprint
          </span>
        </div>

        <div className="bg-slate-950 p-3 sm:p-4">
          <svg
            viewBox="0 0 680 310"
            className="h-auto w-full max-h-[420px] select-none"
            role="img"
            aria-label={config.title}
          >
            {/* Subtle institutional grid */}
            <defs>
              <pattern
                id={`grid-${config.kind}`}
                width="44"
                height="44"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 44 0 L 0 0 0 44"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="0.75"
                  opacity="0.55"
                />
              </pattern>
            </defs>
            <rect width="680" height="310" fill={`url(#grid-${config.kind})`} rx="8" />
            {renderDiagramGraphics(config.kind, safeStep)}
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
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 tabular-nums">
              Step {safeStep + 1} of {totalSteps}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous diagram step"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-terminal-border bg-terminal-elevated text-terminal-text transition-colors hover:border-emerald-500/50 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next diagram step"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-terminal-border bg-terminal-elevated text-terminal-text transition-colors hover:border-emerald-500/50 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-terminal-text">
            {config.walkthroughSteps[safeStep]}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {config.walkthroughSteps.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(index)}
                aria-pressed={index === safeStep}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  index === safeStep
                    ? 'bg-emerald-500 font-semibold text-slate-950'
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
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                : annotation.tone === 'bearish'
                  ? 'border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400'
                  : annotation.tone === 'liquidity'
                    ? 'border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400'
                    : 'border-sky-500/30 bg-sky-500/5 text-sky-600 dark:text-sky-400';

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
