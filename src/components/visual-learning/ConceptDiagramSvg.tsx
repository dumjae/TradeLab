import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { UI_COPY } from '../../data/taglishTranslations';
import { TRADING_ACRONYMS, expandAcronyms } from '../../lib/acronymHelper';
import { localizeMarketTimes, nyTimeToPhLabel } from '../../lib/marketTime';
import type { DiagramConfig, DiagramKind } from '../../types/academy';

export interface ConceptDiagramSvgProps {
  config: DiagramConfig;
}

export type DiagramBiasMode = 'both' | 'bullish' | 'bearish';
type DiagramSide = 'bullish' | 'bearish';

const FONT_MONO = 'IBM Plex Mono, ui-monospace, SFMono-Regular, monospace';
const FONT_SANS = 'Plus Jakarta Sans, system-ui, -apple-system, sans-serif';

const LEGEND_TOKEN_MAP: Record<string, string> = {
  emerald: '#089981',
  bull: '#089981',
  green: '#089981',
  rose: '#f23645',
  bear: '#f23645',
  red: '#f23645',
  amber: '#ff9800',
  gold: '#ff9800',
  copper: '#2962ff',
  brand: '#2962ff',
  blue: '#2962ff',
  orange: '#ff9800',
  cyan: '#2196f3',
  sky: '#2196f3',
  slate: '#8b909a',
};

function resolveLegendColor(token: string): string {
  const normalized = token.trim().toLowerCase();
  return LEGEND_TOKEN_MAP[normalized] ?? token;
}

function localizeText(text: string): string {
  return localizeMarketTimes(expandAcronyms(text));
}

function getTitleAcronymHint(title: string): string | null {
  const expanded = expandAcronyms(title);
  if (expanded === title) {
    return null;
  }
  const pairs: string[] = [];
  for (const [code, meaning] of Object.entries(TRADING_ACRONYMS)) {
    if (expanded.includes(`${code} (${meaning})`)) {
      pairs.push(`${code} (${meaning})`);
    }
  }
  return pairs.length > 0 ? pairs.join(' · ') : null;
}

interface DiagramSubProps {
  activeStep: number;
  side: DiagramSide;
}

function DiagramTopBanner({ text, accent = '#5b9cf6' }: { text: string; accent?: string }) {
  return (
    <g>
      <rect
        x="14"
        y="8"
        width="612"
        height="22"
        rx="4"
        fill="#1e222d"
        stroke="#363a45"
        strokeWidth="1"
      />
      <text
        x="320"
        y="22.5"
        textAnchor="middle"
        fill={accent}
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
        letterSpacing="0.35"
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
        x="14"
        y="246"
        width="612"
        height="26"
        rx="5"
        fill="#1e222d"
        stroke="#2a2e39"
        strokeWidth="1"
      />
      <text
        x="320"
        y="262.5"
        textAnchor="middle"
        fill="#b2b5be"
        fontSize="9.5"
        fontFamily={FONT_SANS}
        fontWeight="500"
      >
        {text}
      </text>
    </g>
  );
}

/* ==================== 1. CHART FUNDAMENTALS (NEW LESSON 01) ==================== */

function ChartFundamentalsSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const accent = isBull ? '#26a69a' : '#ff6b78';
  const mainColor = isBull ? '#089981' : '#f23645';

  const candles = isBull
    ? [
        { x: 64, o: 184, c: 170, h: 164, l: 192, bull: true, vol: 14 },
        { x: 112, o: 170, c: 176, h: 166, l: 184, bull: false, vol: 10 },
        { x: 160, o: 176, c: 152, h: 146, l: 180, bull: true, vol: 22 },
        { x: 208, o: 152, c: 160, h: 148, l: 166, bull: false, vol: 12 },
        { x: 256, o: 160, c: 132, h: 124, l: 164, bull: true, vol: 28 },
        { x: 304, o: 132, c: 140, h: 128, l: 146, bull: false, vol: 13 },
        { x: 352, o: 140, c: 106, h: 98, l: 144, bull: true, vol: 34 },
        { x: 400, o: 106, c: 114, h: 102, l: 120, bull: false, vol: 15 },
        { x: 448, o: 114, c: 82, h: 74, l: 118, bull: true, vol: 30 },
        { x: 496, o: 82, c: 68, h: 60, l: 88, bull: true, vol: 26 },
      ]
    : [
        { x: 64, o: 68, c: 84, h: 62, l: 92, bull: false, vol: 14 },
        { x: 112, o: 84, c: 78, h: 72, l: 88, bull: true, vol: 11 },
        { x: 160, o: 78, c: 106, h: 74, l: 112, bull: false, vol: 20 },
        { x: 208, o: 106, c: 96, h: 90, l: 110, bull: true, vol: 12 },
        { x: 256, o: 96, c: 128, h: 92, l: 134, bull: false, vol: 24 },
        { x: 304, o: 128, c: 118, h: 112, l: 132, bull: true, vol: 13 },
        { x: 352, o: 118, c: 158, h: 114, l: 166, bull: false, vol: 38 },
        { x: 400, o: 158, c: 148, h: 142, l: 162, bull: true, vol: 14 },
        { x: 448, o: 148, c: 176, h: 144, l: 184, bull: false, vol: 30 },
        { x: 496, o: 176, c: 192, h: 172, l: 198, bull: false, vol: 27 },
      ];

  const prices = isBull
    ? [
        { y: 66, label: '$108.00' },
        { y: 106, label: '$105.00' },
        { y: 146, label: '$102.00' },
        { y: 186, label: '$99.00' },
      ]
    : [
        { y: 66, label: '$108.00' },
        { y: 106, label: '$105.00' },
        { y: 146, label: '$102.00' },
        { y: 186, label: '$99.00' },
      ];

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH CHART BASICS: UPTREND · X-AXIS TIME · Y-AXIS PRICE · VOLUME'
            : 'BEARISH CHART BASICS: DOWNTREND · SELL VOLUME SPIKE · BID/ASK SPREAD'
        }
        accent={accent}
      />

      {/* Top-Left Timeframe Callout */}
      <rect
        x="22"
        y="36"
        width="214"
        height="34"
        rx="5"
        fill="#1e222d"
        stroke={activeStep === 0 ? '#ffb74d' : '#363a45'}
        strokeWidth={activeStep === 0 ? 1.75 : 1}
      />
      <text
        x="30"
        y="50"
        fill="#ffb74d"
        fontSize="8.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'TIMEFRAME: 1H = 4×15m = 12×5m' : 'HTF (1D) TREND vs LTF (5m) ENTRY'}
      </text>
      <text x="30" y="63" fill="#8b909a" fontSize="8" fontFamily={FONT_SANS}>
        {isBull ? 'Each candle = 1 full time period' : 'Higher Timeframe sets main bias'}
      </text>

      {/* Main Chart Plot Frame */}
      <line x1="22" y1="224" x2="544" y2="224" stroke="#434651" strokeWidth="1.25" />
      <line x1="544" y1="36" x2="544" y2="224" stroke="#434651" strokeWidth="1.25" />

      {/* Horizontal Price Guides + Right Y-Axis (Price) */}
      {prices.map((p) => (
        <g key={p.label}>
          <line
            x1="22"
            y1={p.y}
            x2="544"
            y2={p.y}
            stroke="#363a45"
            strokeWidth="0.9"
            strokeDasharray="3 4"
          />
          <text
            x="552"
            y={p.y + 3}
            fill={activeStep === 1 ? '#ffb74d' : '#8b909a'}
            fontSize="8.5"
            fontFamily={FONT_MONO}
            fontWeight={activeStep === 1 ? '700' : '500'}
          >
            {p.label}
          </text>
        </g>
      ))}

      {/* Y-Axis Label */}
      <text
        x="618"
        y="130"
        textAnchor="middle"
        fill="#5b9cf6"
        fontSize="8"
        fontFamily={FONT_MONO}
        fontWeight="700"
        transform="rotate(-90 618 130)"
      >
        Y-AXIS (PRICE)
      </text>

      {/* Live Price + Countdown Timer / Bid-Ask Spread Pill */}
      {isBull ? (
        <g>
          <line
            x1="496"
            y1="68"
            x2="544"
            y2="68"
            stroke="#089981"
            strokeWidth="1.25"
            strokeDasharray="3 2"
          />
          <rect
            x="546"
            y="54"
            width="78"
            height="30"
            rx="4"
            fill="#089981"
            stroke="#70d6c2"
            strokeWidth={activeStep === 0 ? 1.5 : 0.8}
          />
          <text
            x="585"
            y="66.5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8.5"
            fontFamily={FONT_MONO}
            fontWeight="800"
          >
            $107.85
          </text>
          <text
            x="585"
            y="78.5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            ⏱ 02:14
          </text>
        </g>
      ) : (
        <g>
          <line
            x1="496"
            y1="184"
            x2="544"
            y2="184"
            stroke="#f23645"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <line
            x1="496"
            y1="196"
            x2="544"
            y2="196"
            stroke="#2196f3"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <rect
            x="546"
            y="174"
            width="78"
            height="14"
            rx="3"
            fill="#f23645"
          />
          <text
            x="585"
            y="184"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="7.8"
            fontFamily={FONT_MONO}
            fontWeight="800"
          >
            ASK $99.18
          </text>
          <rect
            x="546"
            y="191"
            width="78"
            height="14"
            rx="3"
            fill="#2196f3"
          />
          <text
            x="585"
            y="201"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="7.8"
            fontFamily={FONT_MONO}
            fontWeight="800"
          >
            BID $99.12
          </text>
          <text
            x="585"
            y="216"
            textAnchor="middle"
            fill="#2196f3"
            fontSize="7.5"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            SPREAD: $0.06
          </text>
        </g>
      )}

      {/* Trend Direction Arrow Line */}
      <polyline
        points={isBull ? '52,190 256,144 496,64' : '52,64 256,118 496,192'}
        fill="none"
        stroke={mainColor}
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity="0.65"
      />
      <text
        x={isBull ? 328 : 340}
        y={isBull ? 66 : 64}
        textAnchor="middle"
        fill={accent}
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'UPTREND (Higher Highs & Higher Lows ▲)' : 'DOWNTREND (Lower Highs & Lower Lows ▼)'}
      </text>

      {/* Candlesticks + Bottom Volume Bars */}
      {candles.map((c, idx) => {
        const top = Math.min(c.o, c.c);
        const bodyH = Math.max(Math.abs(c.c - c.o), 5);
        const cColor = c.bull ? '#089981' : '#f23645';
        const isVolHighlight = activeStep >= 2 && idx === 6;
        return (
          <g key={c.x}>
            {/* Wick */}
            <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={cColor} strokeWidth="2" />
            {/* Body */}
            <rect x={c.x - 8} y={top} width="16" height={bodyH} rx="2" fill={cColor} />
            {/* Volume Bar */}
            <rect
              x={c.x - 7}
              y={224 - c.vol}
              width="14"
              height={c.vol}
              rx="1.5"
              fill={cColor}
              opacity={isVolHighlight ? 1 : 0.45}
              stroke={isVolHighlight ? '#ffb74d' : 'none'}
              strokeWidth="1.5"
            />
          </g>
        );
      })}

      {/* Volume Callout Pill */}
      <rect
        x={isBull ? 290 : 280}
        y="176"
        width={isBull ? 124 : 144}
        height="18"
        rx="4"
        fill="#131722"
        stroke={activeStep >= 2 ? '#ffb74d' : mainColor}
        strokeWidth="1.2"
      />
      <text
        x={isBull ? 352 : 352}
        y="188"
        textAnchor="middle"
        fill={activeStep >= 2 ? '#ffcc80' : accent}
        fontSize="8"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'BUY VOLUME SURGE ▲' : 'SELL VOLUME SPIKE ▼'}
      </text>

      {/* X-Axis (Time) Ticks */}
      <text x="64" y="237" textAnchor="middle" fill="#8b909a" fontSize="8" fontFamily={FONT_MONO}>
        09:00
      </text>
      <text x="160" y="237" textAnchor="middle" fill="#8b909a" fontSize="8" fontFamily={FONT_MONO}>
        10:00
      </text>
      <text x="256" y="237" textAnchor="middle" fill="#5b9cf6" fontSize="8" fontFamily={FONT_MONO} fontWeight="700">
        X-AXIS (TIME)
      </text>
      <text x="352" y="237" textAnchor="middle" fill="#8b909a" fontSize="8" fontFamily={FONT_MONO}>
        12:00
      </text>
      <text x="496" y="237" textAnchor="middle" fill="#8b909a" fontSize="8" fontFamily={FONT_MONO}>
        14:00
      </text>

      <DiagramBottomNote
        text={
          isBull
            ? 'Read left-to-right (Time), check Price on the right (Y-Axis), and confirm bullish trend pushes with rising Volume.'
            : 'In a downtrend, confirm breakdowns with a red Sell Volume spike and check Bid/Ask Spread before placing orders.'
        }
      />
    </g>
  );
}

/* ==================== 2. CANDLESTICK ANATOMY ==================== */

function CandlestickAnatomySvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const isOpenStep = activeStep === 0;
  const isBodyStep = activeStep === 1;
  const isWickStep = activeStep >= 2;

  const mainFill = isBull ? '#089981' : '#f23645';
  const mainStroke = isBull ? '#26a69a' : '#ff6b78';
  const mainTint = isBull ? '#70d6c2' : '#ff9aa3';
  const innerText = isBull ? '#ffffff' : '#ffffff';

  return (
    <g>
      <rect
        x="14"
        y="8"
        width="612"
        height="22"
        rx="4"
        fill={mainFill}
        fillOpacity="0.16"
        stroke={mainFill}
        strokeOpacity="0.55"
      />
      <text
        x="320"
        y="22.5"
        textAnchor="middle"
        fill={mainStroke}
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull
          ? 'GREEN CANDLE — Price Went UP (Buyers Won)'
          : 'RED CANDLE — Price Went DOWN (Sellers Won)'}
      </text>

      {/* Upper Wick */}
      <line
        x1="150"
        y1="44"
        x2="150"
        y2="88"
        stroke={isWickStep ? '#ffb74d' : mainFill}
        strokeWidth={isWickStep ? 4.5 : 3.5}
        strokeLinecap="round"
      />
      {/* Lower Wick */}
      <line
        x1="150"
        y1="176"
        x2="150"
        y2="220"
        stroke={isWickStep ? '#ffb74d' : mainFill}
        strokeWidth={isWickStep ? 4.5 : 3.5}
        strokeLinecap="round"
      />

      {isBodyStep && (
        <rect
          x="118"
          y="83"
          width="64"
          height="98"
          rx="6"
          fill="none"
          stroke={mainTint}
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      )}

      {/* Candle Body */}
      <rect
        x="124"
        y="88"
        width="52"
        height="88"
        rx="3"
        fill={mainFill}
        stroke={mainStroke}
        strokeWidth="1.5"
      />
      <text
        x="150"
        y="128"
        textAnchor="middle"
        fill={innerText}
        fontSize="13"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        {isBull ? '▲' : '▼'}
      </text>
      <text
        x="150"
        y="144"
        textAnchor="middle"
        fill={innerText}
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        {isBull ? 'UP' : 'DOWN'}
      </text>

      {/* Callout 1: HIGH */}
      <circle cx="150" cy="44" r={isWickStep ? 4.5 : 3.5} fill={isWickStep ? '#ffb74d' : mainStroke} />
      <line
        x1="156"
        y1="44"
        x2="214"
        y2="44"
        stroke={isWickStep ? '#ffb74d' : '#434651'}
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <text x="220" y="47" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill={mainStroke} fontFamily={FONT_MONO} fontWeight="700">
          HIGH
        </tspan>
        <tspan fill="#b2b5be"> — Highest price reached in this period</tspan>
      </text>

      {/* Callout 2: UPPER WICK */}
      <line
        x1="154"
        y1="66"
        x2="214"
        y2="66"
        stroke={isWickStep ? '#ffb74d' : '#434651'}
        strokeWidth={isWickStep ? 1.8 : 1.25}
        strokeDasharray="3 3"
      />
      <text x="220" y="69" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#ffb74d" fontFamily={FONT_MONO} fontWeight="700">
          UPPER WICK
        </tspan>
        <tspan fill="#8b909a">
          {isBull ? ' — Buyers pushed higher, sellers pushed back' : ' — Brief rally rejected by sellers'}
        </tspan>
      </text>

      {/* Callout 3: TOP OF BODY (CLOSE for Bullish, OPEN for Bearish) */}
      <line
        x1="120"
        y1="88"
        x2="214"
        y2="88"
        stroke={isBull ? (isBodyStep ? '#70d6c2' : '#26a69a') : isOpenStep ? '#5b9cf6' : '#2962ff'}
        strokeWidth={isBull ? (isBodyStep ? 2.2 : 1.4) : isOpenStep ? 2.2 : 1.4}
        strokeDasharray="3 3"
      />
      <circle
        cx="176"
        cy="88"
        r={isBull ? (isBodyStep ? 4.5 : 3.5) : isOpenStep ? 4.5 : 3.5}
        fill={isBull ? '#26a69a' : '#5b9cf6'}
      />
      <text x="220" y="91" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill={isBull ? '#26a69a' : '#5b9cf6'} fontFamily={FONT_MONO} fontWeight="700">
          {isBull ? 'CLOSE' : 'OPEN'}
        </tspan>
        <tspan fill={isBull ? '#70d6c2' : '#90bff9'}>
          {isBull
            ? ' (Top of green body — ended HIGHER)'
            : ' (Top of red body — started HIGHER)'}
        </tspan>
      </text>

      {/* Callout 4: BODY */}
      <line
        x1="178"
        y1="132"
        x2="214"
        y2="132"
        stroke={isBodyStep ? '#d1d4dc' : '#5d606b'}
        strokeWidth="1.5"
      />
      <text x="220" y="135" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#d1d4dc" fontFamily={FONT_MONO} fontWeight="700">
          BODY
        </tspan>
        <tspan fill="#b2b5be">
          {isBull
            ? ' — Net upward gain from Open to Close'
            : ' — Net downward drop from Open to Close'}
        </tspan>
      </text>

      {/* Callout 5: BOTTOM OF BODY (OPEN for Bullish, CLOSE for Bearish) */}
      <line
        x1="120"
        y1="176"
        x2="214"
        y2="176"
        stroke={isBull ? (isOpenStep ? '#5b9cf6' : '#2962ff') : isBodyStep ? '#ff9aa3' : '#f23645'}
        strokeWidth={isBull ? (isOpenStep ? 2.2 : 1.4) : isBodyStep ? 2.2 : 1.4}
        strokeDasharray="3 3"
      />
      <circle
        cx="176"
        cy="176"
        r={isBull ? (isOpenStep ? 4.5 : 3.5) : isBodyStep ? 4.5 : 3.5}
        fill={isBull ? '#5b9cf6' : '#ff6b78'}
      />
      <text x="220" y="179" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill={isBull ? '#5b9cf6' : '#ff6b78'} fontFamily={FONT_MONO} fontWeight="700">
          {isBull ? 'OPEN' : 'CLOSE'}
        </tspan>
        <tspan fill={isBull ? '#90bff9' : '#ff9aa3'}>
          {isBull
            ? ' (Bottom of green body — started LOWER)'
            : ' (Bottom of red body — ended LOWER)'}
        </tspan>
      </text>

      {/* Callout 6: LOWER WICK */}
      <line
        x1="154"
        y1="198"
        x2="214"
        y2="198"
        stroke={isWickStep ? '#ffb74d' : '#434651'}
        strokeWidth={isWickStep ? 1.8 : 1.25}
        strokeDasharray="3 3"
      />
      <text x="220" y="201" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill="#ffb74d" fontFamily={FONT_MONO} fontWeight="700">
          LOWER WICK
        </tspan>
        <tspan fill="#8b909a">
          {isBull ? ' — Dipped down, buyers snapped price back up' : ' — Dipped lower, slight bounce before close'}
        </tspan>
      </text>

      {/* Callout 7: LOW */}
      <circle cx="150" cy="220" r={isWickStep ? 4.5 : 3.5} fill={isWickStep ? '#ffb74d' : mainStroke} />
      <line
        x1="156"
        y1="220"
        x2="214"
        y2="220"
        stroke={isWickStep ? '#ffb74d' : '#434651'}
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <text x="220" y="223" fontSize="9.5" fontFamily={FONT_SANS}>
        <tspan fill={mainStroke} fontFamily={FONT_MONO} fontWeight="700">
          LOW
        </tspan>
        <tspan fill="#b2b5be"> — Lowest price reached in this period</tspan>
      </text>

      {/* Bottom 3-step bar */}
      <rect x="14" y="242" width="612" height="30" rx="6" fill="#1e222d" stroke="#2a2e39" />
      <text
        x="116"
        y="260.5"
        textAnchor="middle"
        fill={isOpenStep ? '#90bff9' : '#8b909a'}
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        1. Timer Opens ({isBull ? 'Bottom' : 'Top'})
      </text>
      <text x="218" y="261" textAnchor="middle" fill="#5d606b" fontSize="11">
        →
      </text>
      <text
        x="320"
        y="260.5"
        textAnchor="middle"
        fill={isWickStep ? '#ffcc80' : '#8b909a'}
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        2. Wicks Record Rejections
      </text>
      <text x="424" y="261" textAnchor="middle" fill="#5d606b" fontSize="11">
        →
      </text>
      <text
        x="526"
        y="260.5"
        textAnchor="middle"
        fill={isBodyStep ? mainTint : mainStroke}
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        3. Closes {isBull ? 'Higher (GREEN)' : 'Lower (RED)'}
      </text>
    </g>
  );
}

/* ==================== 3. MARKET STRUCTURE ==================== */

function MarketStructureSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const mainColor = isBull ? '#089981' : '#f23645';
  const lightColor = isBull ? '#26a69a' : '#ff6b78';

  const points = isBull
    ? '42,216 122,148 182,184 282,108 350,144 466,68 538,100 604,50'
    : '42,52 122,120 182,84 282,160 350,124 466,200 538,168 604,218';

  const nodes = isBull
    ? [
        { x: 122, y: 148, label: 'HH 1', color: '#26a69a', dy: -12 },
        { x: 182, y: 184, label: 'HL 1 (Floor)', color: '#ffb74d', dy: 18 },
        { x: 282, y: 108, label: 'HH 2', color: '#26a69a', dy: -12 },
        { x: 350, y: 144, label: 'HL 2', color: '#26a69a', dy: 18 },
        { x: 466, y: 68, label: 'HH 3', color: '#26a69a', dy: -12 },
      ]
    : [
        { x: 122, y: 120, label: 'LL 1', color: '#ff6b78', dy: 18 },
        { x: 182, y: 84, label: 'LH 1 (Ceiling)', color: '#ffb74d', dy: -12 },
        { x: 282, y: 160, label: 'LL 2', color: '#ff6b78', dy: 18 },
        { x: 350, y: 124, label: 'LH 2', color: '#ff6b78', dy: -12 },
        { x: 466, y: 200, label: 'LL 3', color: '#ff6b78', dy: 18 },
      ];

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH STRUCTURE: HIGHER HIGHS (HH), HIGHER LOWS (HL) & BOS UP'
            : 'BEARISH STRUCTURE: LOWER HIGHS (LH), LOWER LOWS (LL) & BOS DOWN'
        }
        accent={lightColor}
      />

      <polyline
        points={points}
        fill="none"
        stroke={mainColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* BOS horizontal levels */}
      <line
        x1="122"
        y1={isBull ? 148 : 120}
        x2="268"
        y2={isBull ? 148 : 120}
        stroke="#2962ff"
        strokeWidth="1.75"
        strokeDasharray="6 4"
        opacity={activeStep === 1 ? 1 : 0.7}
      />
      <line
        x1="282"
        y1={isBull ? 108 : 160}
        x2="448"
        y2={isBull ? 108 : 160}
        stroke="#2962ff"
        strokeWidth="1.75"
        strokeDasharray="6 4"
        opacity={activeStep === 2 ? 1 : 0.7}
      />

      {/* Protected Swing Level */}
      <line
        x1="182"
        y1={isBull ? 184 : 84}
        x2="388"
        y2={isBull ? 184 : 84}
        stroke="#ff9800"
        strokeWidth="1.6"
        strokeDasharray="4 4"
        opacity={activeStep >= 3 ? 1 : 0.6}
      />

      {nodes.map((node, index) => (
        <g key={node.label}>
          <circle
            cx={node.x}
            cy={node.y}
            r={activeStep === index ? 7 : 5}
            fill={node.color}
            stroke="#131722"
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y + node.dy}
            textAnchor="middle"
            fill={node.color}
            fontSize="9.5"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* BOS Pill 1 */}
      <rect x="190" y={isBull ? 126 : 124} width="94" height="18" rx="4" fill="#2962ff" fillOpacity="0.22" />
      <text
        x="237"
        y={isBull ? 138 : 136}
        textAnchor="middle"
        fill="#90bff9"
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'BOS Up ▲' : 'BOS Down ▼'}
      </text>

      {/* BOS Pill 2 */}
      <rect x="358" y={isBull ? 86 : 164} width="94" height="18" rx="4" fill="#2962ff" fillOpacity="0.22" />
      <text
        x="405"
        y={isBull ? 98 : 176}
        textAnchor="middle"
        fill="#90bff9"
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'BOS Up ▲' : 'BOS Down ▼'}
      </text>

      <DiagramBottomNote
        text={
          isBull
            ? 'HH (Higher High) + HL (Higher Low) + full candle close above prior high = valid Bullish BOS (Break of Structure).'
            : 'LH (Lower High) + LL (Lower Low) + full candle close below prior low = valid Bearish BOS (Break of Structure).'
        }
      />
    </g>
  );
}

/* ==================== 4. SUPPORT / RESISTANCE & SUPPLY / DEMAND ==================== */

function SupportDemandSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH DEMAND / SUPPORT FLOOR: BUYERS DEFEND ZONE & LAUNCH UP'
            : 'BEARISH SUPPLY / RESISTANCE CEILING: SELLERS DEFEND ZONE & DROP'
        }
        accent={accent}
      />

      {/* Top Supply / Resistance Zone */}
      <rect
        x="28"
        y="40"
        width="584"
        height="40"
        rx="5"
        fill="#f23645"
        fillOpacity={!isBull || activeStep === 1 ? 0.25 : 0.1}
        stroke="#f23645"
        strokeWidth={!isBull ? 1.8 : 1.1}
        strokeDasharray="6 4"
      />
      <text
        x="320"
        y="57"
        textAnchor="middle"
        fill="#ff9aa3"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        RESISTANCE / SUPPLY ZONE (CEILING)
      </text>
      <text x="320" y="71" textAnchor="middle" fill="#b2b5be" fontSize="8.8" fontFamily={FONT_SANS}>
        {isBull ? 'Target area above — watch for seller reactions' : 'Institutions sell here and push price DOWN ▼'}
      </text>

      {/* Bottom Demand / Support Zone */}
      <rect
        x="28"
        y="194"
        width="584"
        height="40"
        rx="5"
        fill="#089981"
        fillOpacity={isBull || activeStep === 0 ? 0.25 : 0.1}
        stroke="#089981"
        strokeWidth={isBull ? 1.8 : 1.1}
        strokeDasharray="6 4"
      />
      <text
        x="320"
        y="211"
        textAnchor="middle"
        fill="#70d6c2"
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        SUPPORT / DEMAND ZONE (FLOOR)
      </text>
      <text x="320" y="225" textAnchor="middle" fill="#b2b5be" fontSize="8.8" fontFamily={FONT_SANS}>
        {isBull ? 'Institutions buy here and bounce price UP ▲' : 'Target area below — take profit before buyers step in'}
      </text>

      {/* Price Path */}
      <polyline
        points={
          isBull
            ? '44,126 128,196 220,124 318,196 426,112 508,196 594,86'
            : '44,154 128,80 220,152 318,80 426,162 508,80 594,190'
        }
        fill="none"
        stroke="#d1d4dc"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Highlighted reaction points */}
      {(isBull
        ? [
            { x: 128, y: 196, label: '▲ Demand #1' },
            { x: 318, y: 196, label: '▲ Demand #2' },
            { x: 508, y: 196, label: '▲ Long Entry' },
          ]
        : [
            { x: 128, y: 80, label: '▼ Supply #1' },
            { x: 318, y: 80, label: '▼ Supply #2' },
            { x: 508, y: 80, label: '▼ Short Entry' },
          ]
      ).map((pt, i) => (
        <g key={pt.label}>
          <circle
            cx={pt.x}
            cy={pt.y}
            r={activeStep === i ? 7 : 5.5}
            fill={isBull ? '#089981' : '#f23645'}
            stroke="#131722"
            strokeWidth="2"
          />
          <text
            x={pt.x}
            y={isBull ? pt.y - 12 : pt.y + 18}
            textAnchor="middle"
            fill={accent}
            fontSize="9"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            {pt.label}
          </text>
        </g>
      ))}

      {/* Final Impulse Label */}
      <circle cx="594" cy={isBull ? 86 : 190} r="5.5" fill={isBull ? '#089981' : '#f23645'} />
      <text
        x="568"
        y={isBull ? 105 : 178}
        textAnchor="middle"
        fill={accent}
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'Rally UP ▲' : 'Drop DOWN ▼'}
      </text>

      <DiagramBottomNote
        text={
          isBull
            ? 'Bullish Rule: Wait for price to revisit a Demand Floor + bullish close before buying — never chase into Supply.'
            : 'Bearish Rule: Wait for price to revisit a Supply Ceiling + bearish rejection before shorting toward Support.'
        }
      />
    </g>
  );
}

/* ==================== 5. LIQUIDITY POOLS (BSL & SSL) ==================== */

function LiquidityPoolsSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH LIQUIDITY PLAY: SWEEP SSL (BELOW LOWS) → REVERSAL TO BSL ▲'
            : 'BEARISH LIQUIDITY PLAY: SWEEP BSL (ABOVE HIGHS) → REVERSAL TO SSL ▼'
        }
        accent={accent}
      />

      {/* BSL Band */}
      <rect
        x="28"
        y="42"
        width="584"
        height="36"
        rx="5"
        fill="#ff9800"
        fillOpacity={!isBull && activeStep === 0 ? 0.28 : 0.14}
        stroke="#ff9800"
        strokeDasharray="5 4"
      />
      <text x="320" y="58" textAnchor="middle" fill="#ffb74d" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        BSL = BUY-SIDE LIQUIDITY (Stop-Losses Above Highs)
      </text>
      <text x="320" y="71" textAnchor="middle" fill="#b2b5be" fontSize="8.5" fontFamily={FONT_SANS}>
        {isBull ? 'Take Profit target magnet for Bullish Longs ▲' : 'Institutions raid these stops before selling DOWN ▼'}
      </text>

      {/* SSL Band */}
      <rect
        x="28"
        y="198"
        width="584"
        height="36"
        rx="5"
        fill="#2962ff"
        fillOpacity={isBull && activeStep === 0 ? 0.28 : 0.14}
        stroke="#2962ff"
        strokeDasharray="5 4"
      />
      <text x="320" y="214" textAnchor="middle" fill="#90bff9" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
        SSL = SELL-SIDE LIQUIDITY (Stop-Losses Below Lows)
      </text>
      <text x="320" y="227" textAnchor="middle" fill="#b2b5be" fontSize="8.5" fontFamily={FONT_SANS}>
        {isBull ? 'Institutions raid these stops before rallying UP ▲' : 'Take Profit target magnet for Bearish Shorts ▼'}
      </text>

      {/* Range + Sweep + Expansion */}
      <polyline
        points={
          isBull
            ? '48,136 124,84 202,190 286,88 370,190 444,218 516,136 592,64'
            : '48,142 124,192 202,86 286,188 370,86 444,58 516,142 592,212'
        }
        fill="none"
        stroke="#8b909a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polyline
        points={isBull ? '444,218 516,136 592,64' : '444,58 516,142 592,212'}
        fill="none"
        stroke={isBull ? '#089981' : '#f23645'}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sweep Node */}
      <circle
        cx="444"
        cy={isBull ? 218 : 58}
        r={activeStep >= 1 ? 7.5 : 5.5}
        fill={isBull ? '#089981' : '#f23645'}
        stroke="#131722"
        strokeWidth="2"
      />
      <text
        x="444"
        y={isBull ? 186 : 96}
        textAnchor="middle"
        fill={accent}
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? '1. SSL Swept!' : '1. BSL Swept!'}
      </text>

      {/* Target Node */}
      <circle
        cx="592"
        cy={isBull ? 64 : 212}
        r={activeStep >= 2 ? 7 : 5}
        fill="#ffb74d"
        stroke="#131722"
        strokeWidth="2"
      />
      <text
        x="558"
        y={isBull ? 92 : 188}
        textAnchor="middle"
        fill="#ffcc80"
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? '2. Target BSL ▲' : '2. Target SSL ▼'}
      </text>

      <DiagramBottomNote
        text={
          isBull
            ? 'Bullish Liquidity Cycle: Price raids SSL (Sell-Side Liquidity) below lows, traps sellers, then drives toward BSL.'
            : 'Bearish Liquidity Cycle: Price raids BSL (Buy-Side Liquidity) above highs, traps buyers, then drops toward SSL.'
        }
      />
    </g>
  );
}

/* ==================== 6. EQUAL HIGHS (EQH) & EQUAL LOWS (EQL) ==================== */

function EqualHighsLowsSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const mainColor = isBull ? '#089981' : '#f23645';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH EQUAL LOWS (EQL): STOP RAID BELOW DOUBLE BOTTOM → RALLY UP'
            : 'BEARISH EQUAL HIGHS (EQH): STOP RAID ABOVE DOUBLE TOP → DROP DOWN'
        }
        accent={accent}
      />

      {/* EQL / EQH dashed level */}
      <line
        x1="46"
        y1={isBull ? 192 : 84}
        x2="594"
        y2={isBull ? 192 : 84}
        stroke="#ff9800"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <text
        x="224"
        y={isBull ? 210 : 72}
        textAnchor="middle"
        fill="#ffb74d"
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull
          ? '$$$ EQUAL LOWS (EQL) — Buyers’ Stop Cluster'
          : '$$$ EQUAL HIGHS (EQH) — Sellers’ Stop Cluster'}
      </text>

      {/* Price Action */}
      <polyline
        points={
          isBull
            ? '48,80 132,190 212,114 300,190 380,124 446,222 496,150 584,54'
            : '48,196 132,86 212,162 300,86 380,152 446,54 496,126 584,222'
        }
        fill="none"
        stroke="#8b909a"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <polyline
        points={isBull ? '446,222 496,150 584,54' : '446,54 496,126 584,222'}
        fill="none"
        stroke={mainColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Equal touches */}
      <circle cx="132" cy={isBull ? 190 : 86} r="5" fill="#ff9800" />
      <circle cx="300" cy={isBull ? 190 : 86} r="5" fill="#ff9800" />
      {/* Sweep Wick Node */}
      <circle
        cx="446"
        cy={isBull ? 222 : 54}
        r={activeStep >= 1 ? 7.5 : 5.5}
        fill={mainColor}
        stroke="#131722"
        strokeWidth="2"
      />
      <text
        x="458"
        y={isBull ? 236 : 46}
        textAnchor="middle"
        fill={accent}
        fontSize="9.2"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        Stop Raid Wick (Trap!)
      </text>

      <text
        x="554"
        y={isBull ? 48 : 235}
        textAnchor="middle"
        fill={accent}
        fontSize="9.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'Fast Reversal UP ▲' : 'Fast Reversal DOWN ▼'}
      </text>

      <DiagramBottomNote
        text={
          isBull
            ? 'Two matching lows (EQL) invite retail Stop Losses right below — wait for the raid & reclaim before going Long.'
            : 'Two matching highs (EQH) invite retail Stop Losses right above — wait for the raid & rejection before Shorting.'
        }
      />
    </g>
  );
}

/* ==================== 7. LIQUIDITY SWEEP VS TRUE BREAKOUT ==================== */

function LiquiditySweepVsBreakoutSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH: SSL SWEEP REVERSAL UP (LEFT) vs. TRUE BREAKOUT UP (RIGHT)'
            : 'BEARISH: BSL SWEEP REVERSAL DOWN (LEFT) vs. TRUE BREAKDOWN DOWN (RIGHT)'
        }
        accent={accent}
      />

      <line x1="320" y1="36" x2="320" y2="238" stroke="#363a45" strokeDasharray="4 4" />

      {isBull ? (
        <>
          {/* LEFT: BULLISH SWEEP BELOW FLOOR -> REVERSAL UP */}
          <text x="166" y="52" textAnchor="middle" fill="#ffb74d" fontSize="10" fontFamily={FONT_MONO} fontWeight="700">
            BULLISH SWEEP (FAKE BREAKDOWN)
          </text>
          <line x1="32" y1="168" x2="298" y2="168" stroke="#ff9800" strokeDasharray="5 4" strokeWidth="1.6" />
          {/* Approach red */}
          <line x1="88" y1="108" x2="88" y2="162" stroke="#f23645" strokeWidth="2" />
          <rect x="79" y="116" width="18" height="36" fill="#f23645" rx="2" />
          {/* Sweep green candle wicking below floor, closing above */}
          <line x1="158" y1="126" x2="158" y2="218" stroke="#089981" strokeWidth="2.5" />
          <rect
            x="148"
            y="134"
            width="20"
            height="28"
            fill="#089981"
            rx="2"
            stroke={activeStep === 0 ? '#ffb74d' : 'none'}
            strokeWidth="2"
          />
          <text x="158" y="232" textAnchor="middle" fill="#ffb74d" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            Wick Below, Body Closes ABOVE!
          </text>
          {/* Rally green */}
          <line x1="228" y1="74" x2="228" y2="146" stroke="#089981" strokeWidth="2.2" />
          <rect x="218" y="82" width="20" height="54" fill="#089981" rx="2" />

          {/* RIGHT: BULLISH TRUE BREAKOUT ABOVE RESISTANCE */}
          <text x="478" y="52" textAnchor="middle" fill="#26a69a" fontSize="10" fontFamily={FONT_MONO} fontWeight="700">
            TRUE BULLISH BREAKOUT ▲
          </text>
          <line x1="342" y1="146" x2="608" y2="146" stroke="#2962ff" strokeDasharray="5 4" strokeWidth="1.6" />
          <line x1="398" y1="152" x2="398" y2="204" stroke="#089981" strokeWidth="2" />
          <rect x="389" y="158" width="18" height="34" fill="#089981" rx="2" />
          <line x1="468" y1="84" x2="468" y2="162" stroke="#089981" strokeWidth="2.5" />
          <rect
            x="458"
            y="92"
            width="20"
            height="56"
            fill="#089981"
            rx="2"
            stroke={activeStep >= 1 ? '#5b9cf6' : 'none'}
            strokeWidth="2"
          />
          <text x="468" y="76" textAnchor="middle" fill="#26a69a" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            Full Body Closes ABOVE
          </text>
          <line x1="538" y1="68" x2="538" y2="136" stroke="#089981" strokeWidth="2.2" />
          <rect x="528" y="76" width="20" height="44" fill="#089981" rx="2" />
          <text x="478" y="232" textAnchor="middle" fill="#b2b5be" fontSize="8.8" fontFamily={FONT_SANS}>
            Holds above broken resistance → Continuation
          </text>
        </>
      ) : (
        <>
          {/* LEFT: BEARISH SWEEP ABOVE CEILING -> REVERSAL DOWN */}
          <text x="166" y="52" textAnchor="middle" fill="#ffb74d" fontSize="10" fontFamily={FONT_MONO} fontWeight="700">
            BEARISH SWEEP (FAKE BREAKOUT)
          </text>
          <line x1="32" y1="112" x2="298" y2="112" stroke="#ff9800" strokeDasharray="5 4" strokeWidth="1.6" />
          <line x1="88" y1="126" x2="88" y2="180" stroke="#089981" strokeWidth="2" />
          <rect x="79" y="134" width="18" height="34" fill="#089981" rx="2" />
          <line x1="158" y1="68" x2="158" y2="156" stroke="#f23645" strokeWidth="2.5" />
          <rect
            x="148"
            y="120"
            width="20"
            height="28"
            fill="#f23645"
            rx="2"
            stroke={activeStep === 0 ? '#ffb74d' : 'none'}
            strokeWidth="2"
          />
          <text x="158" y="64" textAnchor="middle" fill="#ffb74d" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            Wick Above, Body Closes BELOW!
          </text>
          <line x1="228" y1="136" x2="228" y2="216" stroke="#f23645" strokeWidth="2.2" />
          <rect x="218" y="144" width="20" height="58" fill="#f23645" rx="2" />
          <text x="166" y="232" textAnchor="middle" fill="#b2b5be" fontSize="8.8" fontFamily={FONT_SANS}>
            Body closes back inside → Bearish Reversal
          </text>

          {/* RIGHT: BEARISH TRUE BREAKDOWN BELOW SUPPORT */}
          <text x="478" y="52" textAnchor="middle" fill="#ff6b78" fontSize="10" fontFamily={FONT_MONO} fontWeight="700">
            TRUE BEARISH BREAKDOWN ▼
          </text>
          <line x1="342" y1="134" x2="608" y2="134" stroke="#2962ff" strokeDasharray="5 4" strokeWidth="1.6" />
          <line x1="398" y1="78" x2="398" y2="128" stroke="#f23645" strokeWidth="2" />
          <rect x="389" y="86" width="18" height="34" fill="#f23645" rx="2" />
          <line x1="468" y1="118" x2="468" y2="198" stroke="#f23645" strokeWidth="2.5" />
          <rect
            x="458"
            y="132"
            width="20"
            height="56"
            fill="#f23645"
            rx="2"
            stroke={activeStep >= 1 ? '#5b9cf6' : 'none'}
            strokeWidth="2"
          />
          <text x="468" y="212" textAnchor="middle" fill="#ff6b78" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            Full Body Closes BELOW
          </text>
          <line x1="538" y1="154" x2="538" y2="224" stroke="#f23645" strokeWidth="2.2" />
          <rect x="528" y="164" width="20" height="46" fill="#f23645" rx="2" />
          <text x="478" y="232" textAnchor="middle" fill="#b2b5be" fontSize="8.8" fontFamily={FONT_SANS}>
            Holds below broken support → Continuation
          </text>
        </>
      )}

      <DiagramBottomNote
        text={
          isBull
            ? 'Always wait for the candle close: wick below support = Bullish Sweep; full green close above resistance = True Breakout.'
            : 'Always wait for the candle close: wick above resistance = Bearish Sweep; full red close below support = True Breakdown.'
        }
      />
    </g>
  );
}

/* ==================== 8. FAIR VALUE GAP (FVG) ==================== */

function FairValueGapSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const mainColor = isBull ? '#089981' : '#f23645';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH FAIR VALUE GAP (FVG): 3-CANDLE UPWARD IMBALANCE → LONG RETEST'
            : 'BEARISH FAIR VALUE GAP (FVG): 3-CANDLE DOWNWARD IMBALANCE → SHORT RETEST'
        }
        accent={accent}
      />

      {/* Shaded FVG Zone */}
      <rect
        x="140"
        y="114"
        width="454"
        height="46"
        rx="4"
        fill={isBull ? '#089981' : '#f23645'}
        fillOpacity={activeStep === 1 ? 0.28 : 0.16}
        stroke={isBull ? '#089981' : '#f23645'}
        strokeDasharray="5 3"
      />
      <text
        x="484"
        y="134"
        textAnchor="middle"
        fill={accent}
        fontSize="10"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'BULLISH FVG (FAIR VALUE GAP)' : 'BEARISH FVG (FAIR VALUE GAP)'}
      </text>
      <text x="484" y="149" textAnchor="middle" fill="#b2b5be" fontSize="8.5" fontFamily={FONT_SANS}>
        {isBull ? 'Empty gap: Candle 1 High → Candle 3 Low' : 'Empty gap: Candle 1 Low → Candle 3 High'}
      </text>

      {isBull ? (
        <>
          {/* Candle 1 */}
          <line x1="126" y1="160" x2="126" y2="222" stroke="#089981" strokeWidth="2" />
          <rect x="113" y="172" width="26" height="40" fill="#089981" rx="3" />
          {/* Candle 2 (Fast Up) */}
          <line x1="202" y1="74" x2="202" y2="188" stroke="#089981" strokeWidth="2.5" />
          <rect x="187" y="86" width="30" height="88" fill="#089981" rx="3" />
          {/* Candle 3 */}
          <line x1="278" y1="56" x2="278" y2="114" stroke="#089981" strokeWidth="2" />
          <rect x="265" y="64" width="26" height="36" fill="#089981" rx="3" />
        </>
      ) : (
        <>
          {/* Candle 1 */}
          <line x1="126" y1="52" x2="126" y2="114" stroke="#f23645" strokeWidth="2" />
          <rect x="113" y="62" width="26" height="40" fill="#f23645" rx="3" />
          {/* Candle 2 (Fast Down) */}
          <line x1="202" y1="88" x2="202" y2="202" stroke="#f23645" strokeWidth="2.5" />
          <rect x="187" y="100" width="30" height="88" fill="#f23645" rx="3" />
          {/* Candle 3 */}
          <line x1="278" y1="160" x2="278" y2="222" stroke="#f23645" strokeWidth="2" />
          <rect x="265" y="174" width="26" height="36" fill="#f23645" rx="3" />
        </>
      )}

      <text x="126" y="236" textAnchor="middle" fill="#8b909a" fontSize="8.8" fontFamily={FONT_MONO}>
        Candle 1
      </text>
      <text x="202" y="236" textAnchor="middle" fill={accent} fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
        Candle 2 (Impulse)
      </text>
      <text x="278" y="236" textAnchor="middle" fill="#8b909a" fontSize="8.8" fontFamily={FONT_MONO}>
        Candle 3
      </text>

      {/* Retrace & Continuation Path */}
      <polyline
        points={isBull ? '312,80 384,138 510,58' : '312,196 384,136 510,218'}
        fill="none"
        stroke="#ff9800"
        strokeWidth="2.6"
        strokeDasharray="6 3"
      />
      <circle cx="384" cy="137" r={activeStep >= 2 ? 7 : 5.5} fill="#ff9800" stroke="#131722" strokeWidth="2" />
      <text
        x="384"
        y={isBull ? 104 : 180}
        textAnchor="middle"
        fill="#ffcc80"
        fontSize="9"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'Long Entry (Fills Gap ▲)' : 'Short Entry (Fills Gap ▼)'}
      </text>
      <circle cx="510" cy={isBull ? 58 : 218} r="5" fill={mainColor} />

      <DiagramBottomNote
        text={
          isBull
            ? 'Bullish FVG: Fast upward jump leaves an unfilled gap — enter Long on the calm pullback into the FVG.'
            : 'Bearish FVG: Fast downward drop leaves an unfilled gap — enter Short on the calm rally back into the FVG.'
        }
      />
    </g>
  );
}

/* ==================== 9. ORDER BLOCK & CHoCH ==================== */

function OrderBlockChochSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH REVERSAL: CHoCH UP → BULLISH ORDER BLOCK (OB) RETEST → RALLY'
            : 'BEARISH REVERSAL: CHoCH DOWN → BEARISH ORDER BLOCK (OB) RETEST → DROP'
        }
        accent={accent}
      />

      {/* CHoCH Horizontal Line */}
      <line
        x1="140"
        y1={isBull ? 116 : 158}
        x2="358"
        y2={isBull ? 116 : 158}
        stroke="#5b9cf6"
        strokeWidth={activeStep === 1 ? 2.2 : 1.4}
        strokeDasharray="6 4"
      />
      <rect
        x="248"
        y={isBull ? 92 : 164}
        width="142"
        height="19"
        rx="4"
        fill="#2962ff"
        fillOpacity={activeStep === 1 ? 0.3 : 0.16}
        stroke="#5b9cf6"
      />
      <text
        x="319"
        y={isBull ? 105 : 177}
        textAnchor="middle"
        fill="#90bff9"
        fontSize="8.8"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? '2. CHoCH (Break UP!)' : '2. CHoCH (Break DOWN!)'}
      </text>

      {/* Order Block Zone */}
      <rect
        x="198"
        y={isBull ? 174 : 58}
        width="292"
        height="38"
        rx="5"
        fill="#ff9800"
        fillOpacity={activeStep === 2 ? 0.28 : 0.14}
        stroke="#ff9800"
        strokeWidth={activeStep === 2 ? 2 : 1.25}
        strokeDasharray="5 3"
      />
      <text
        x="344"
        y={isBull ? 226 : 51}
        textAnchor="middle"
        fill="#ffb74d"
        fontSize="8.8"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull
          ? '3. BULLISH OB (Last Red Candle Before Rally)'
          : '3. BEARISH OB (Last Green Candle Before Drop)'}
      </text>

      {/* Prior Trend Leg */}
      <polyline
        points={isBull ? '38,60 98,134 140,116 212,204' : '38,214 98,140 140,158 212,70'}
        fill="none"
        stroke={isBull ? '#f23645' : '#089981'}
        strokeWidth={activeStep === 0 ? 3.2 : 2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="76"
        y={isBull ? 52 : 226}
        textAnchor="middle"
        fill={isBull ? '#ff6b78' : '#26a69a'}
        fontSize="8.8"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? '1. Downtrend' : '1. Uptrend'}
      </text>

      {/* Order Block Candle */}
      <line
        x1="212"
        y1={isBull ? 168 : 54}
        x2="212"
        y2={isBull ? 218 : 104}
        stroke={isBull ? '#f23645' : '#089981'}
        strokeWidth="2"
      />
      <rect
        x="202"
        y={isBull ? 176 : 62}
        width="20"
        height="34"
        rx="2"
        fill={isBull ? '#f23645' : '#089981'}
        stroke="#ffb74d"
        strokeWidth="1.5"
      />

      {/* CHoCH Impulse Leg */}
      <polyline
        points={isBull ? '222,192 276,116 336,68' : '222,82 276,158 336,206'}
        fill="none"
        stroke={isBull ? '#089981' : '#f23645'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="276" cy={isBull ? 116 : 158} r={activeStep === 1 ? 6 : 4.5} fill="#5b9cf6" />

      {/* Pullback to OB */}
      <polyline
        points={isBull ? '336,68 400,140 444,192' : '336,206 400,134 444,82'}
        fill="none"
        stroke="#8b909a"
        strokeWidth="2.2"
        strokeDasharray="5 4"
      />
      <circle
        cx="444"
        cy={isBull ? 192 : 82}
        r={activeStep === 2 ? 7 : 5.5}
        fill="#ff9800"
        stroke="#131722"
        strokeWidth="2"
      />
      <text
        x="444"
        y={isBull ? 166 : 114}
        textAnchor="middle"
        fill="#ffcc80"
        fontSize="8.8"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        4. OB Entry
      </text>

      {/* Expansion Leg */}
      <polyline
        points={isBull ? '444,192 518,112 590,52' : '444,82 518,162 590,222'}
        fill="none"
        stroke={isBull ? '#089981' : '#f23645'}
        strokeWidth={activeStep >= 3 ? 3.8 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="590" cy={isBull ? 52 : 222} r="5.5" fill={isBull ? '#089981' : '#f23645'} />
      <text
        x="560"
        y={isBull ? 46 : 235}
        textAnchor="middle"
        fill={accent}
        fontSize="9.2"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? '5. Rally UP ▲' : '5. Drop DOWN ▼'}
      </text>

      <DiagramBottomNote
        text={
          isBull
            ? 'Wait for Bullish CHoCH (Change of Character), then buy the calm pullback into the Bullish OB (Order Block).'
            : 'Wait for Bearish CHoCH (Change of Character), then short the calm retest into the Bearish OB (Order Block).'
        }
      />
    </g>
  );
}

/* ==================== 10. MULTI-TIMEFRAME ALIGNMENT ==================== */

function MultiTimeframeSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const mainColor = isBull ? '#089981' : '#f23645';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      {/* Left Header */}
      <rect
        x="16"
        y="8"
        width="216"
        height="22"
        rx="4"
        fill={mainColor}
        fillOpacity="0.16"
        stroke={mainColor}
        strokeOpacity="0.5"
      />
      <text x="124" y="22.5" textAnchor="middle" fill={accent} fontSize="9.2" fontFamily={FONT_MONO} fontWeight="700">
        {isBull ? 'HTF: 1H BULLISH CANDLE' : 'HTF: 1H BEARISH CANDLE'}
      </text>

      {/* Right Header */}
      <rect
        x="294"
        y="8"
        width="330"
        height="22"
        rx="4"
        fill="#2962ff"
        fillOpacity="0.16"
        stroke="#2962ff"
        strokeOpacity="0.5"
      />
      <text x="459" y="22.5" textAnchor="middle" fill="#5b9cf6" fontSize="9.2" fontFamily={FONT_MONO} fontWeight="700">
        LTF: FOUR 15m CANDLES INSIDE IT
      </text>

      {/* Panel Frames */}
      <rect
        x="16"
        y="38"
        width="216"
        height="198"
        rx="6"
        fill="#1e222d"
        stroke={activeStep === 0 ? mainColor : '#2a2e39'}
        strokeWidth={activeStep === 0 ? 1.7 : 1}
      />
      <rect
        x="294"
        y="38"
        width="330"
        height="198"
        rx="6"
        fill="#1e222d"
        stroke={activeStep >= 2 ? '#5b9cf6' : '#2a2e39'}
        strokeWidth={activeStep >= 2 ? 1.7 : 1}
      />

      {/* Horizontal OHLC alignment guides */}
      {[
        { y: 58, label: 'HIGH', color: accent },
        { y: 86, label: isBull ? 'CLOSE' : 'OPEN', color: isBull ? '#26a69a' : '#5b9cf6' },
        { y: 178, label: isBull ? 'OPEN' : 'CLOSE', color: isBull ? '#5b9cf6' : '#ff6b78' },
        { y: 208, label: 'LOW', color: '#ffb74d' },
      ].map((lvl) => (
        <g key={lvl.label}>
          <line
            x1="112"
            y1={lvl.y}
            x2="610"
            y2={lvl.y}
            stroke={lvl.color}
            strokeWidth={activeStep === 1 ? 1.3 : 0.85}
            strokeDasharray="4 4"
            opacity={activeStep === 1 ? 0.85 : 0.35}
          />
          <text x="30" y={lvl.y + 3} fill={lvl.color} fontSize="8" fontFamily={FONT_MONO} fontWeight="700">
            {lvl.label}
          </text>
        </g>
      ))}

      {/* Left 1H Candle */}
      <line x1="130" y1="58" x2="130" y2="208" stroke={mainColor} strokeWidth="3.8" strokeLinecap="round" />
      <rect x="104" y="86" width="52" height="92" rx="4" fill={mainColor} stroke={accent} strokeWidth="1.4" />
      <text
        x="130"
        y="137"
        textAnchor="middle"
        fill={isBull ? '#ffffff' : '#ffffff'}
        fontSize="11.5"
        fontFamily={FONT_MONO}
        fontWeight="800"
      >
        1H
      </text>

      {/* Center = 4x 15m connector */}
      <path d="M 242 58 L 254 58 L 254 208 L 242 208" fill="none" stroke="#ffb74d" strokeWidth="1.8" />
      <line x1="254" y1="133" x2="286" y2="133" stroke="#ffb74d" strokeWidth="1.8" />
      <rect x="238" y="118" width="48" height="28" rx="4" fill="#131722" stroke="#ffb74d" />
      <text x="262" y="131" textAnchor="middle" fill="#ffb74d" fontSize="9" fontFamily={FONT_MONO} fontWeight="800">
        = 4×
      </text>
      <text x="262" y="142" textAnchor="middle" fill="#ffe0b2" fontSize="7.8" fontFamily={FONT_MONO}>
        15m
      </text>

      {/* Right 4x 15m candles */}
      {isBull ? (
        <>
          <line x1="340" y1="172" x2="340" y2="208" stroke="#f23645" strokeWidth="2.2" />
          <rect x="328" y="178" width="24" height="20" rx="2" fill="#f23645" />

          <line x1="418" y1="132" x2="418" y2="202" stroke="#089981" strokeWidth="2.2" />
          <rect
            x="406"
            y="140"
            width="24"
            height="58"
            rx="2"
            fill="#089981"
            stroke={activeStep >= 2 ? '#ffb74d' : 'none'}
            strokeWidth="2"
          />

          <line x1="496" y1="58" x2="496" y2="148" stroke="#089981" strokeWidth="2.2" />
          <rect x="484" y="72" width="24" height="68" rx="2" fill="#089981" />

          <line x1="574" y1="68" x2="574" y2="98" stroke="#f23645" strokeWidth="2.2" />
          <rect x="562" y="74" width="24" height="12" rx="2" fill="#f23645" />

          <text x="418" y="122" textAnchor="middle" fill="#ffb74d" fontSize="8.2" fontFamily={FONT_MONO} fontWeight="700">
            Long Dip Entry!
          </text>
        </>
      ) : (
        <>
          <line x1="340" y1="58" x2="340" y2="96" stroke="#089981" strokeWidth="2.2" />
          <rect x="328" y="68" width="24" height="18" rx="2" fill="#089981" />

          <line x1="418" y1="66" x2="418" y2="138" stroke="#f23645" strokeWidth="2.2" />
          <rect
            x="406"
            y="72"
            width="24"
            height="58"
            rx="2"
            fill="#f23645"
            stroke={activeStep >= 2 ? '#ffb74d' : 'none'}
            strokeWidth="2"
          />

          <line x1="496" y1="120" x2="496" y2="208" stroke="#f23645" strokeWidth="2.2" />
          <rect x="484" y="128" width="24" height="66" rx="2" fill="#f23645" />

          <line x1="574" y1="168" x2="574" y2="198" stroke="#089981" strokeWidth="2.2" />
          <rect x="562" y="178" width="24" height="14" rx="2" fill="#089981" />

          <text x="418" y="152" textAnchor="middle" fill="#ffb74d" fontSize="8.2" fontFamily={FONT_MONO} fontWeight="700">
            Short Pop Entry!
          </text>
        </>
      )}

      {['0–15m', '15–30m', '30–45m', '45–60m'].map((tLabel, idx) => (
        <text
          key={tLabel}
          x={340 + idx * 78}
          y="226"
          textAnchor="middle"
          fill="#8b909a"
          fontSize="8"
          fontFamily={FONT_MONO}
        >
          {tLabel}
        </text>
      ))}

      <DiagramBottomNote
        text={
          isBull
            ? 'Bullish Alignment: HTF (Higher Timeframe 1H/4H) points UP → zoom into LTF (15m) to buy the dip with a tight SL.'
            : 'Bearish Alignment: HTF (Higher Timeframe 1H/4H) points DOWN → zoom into LTF (15m) to short the bounce with a tight SL.'
        }
      />
    </g>
  );
}

/* ==================== 11. MARKET SESSIONS & KILLZONES ==================== */

function MarketSessionsSvg({ activeStep, side }: DiagramSubProps) {
  const { t } = useLanguage();
  const isBull = side === 'bullish';
  const asiaTime = localizeMarketTimes('7:00 PM–2:00 AM NY');
  const londonTime = localizeMarketTimes('2:00 AM–5:00 AM NY');
  const overlapTime = localizeMarketTimes('8:00 AM–11:00 AM NY');
  const mainColor = isBull ? '#089981' : '#f23645';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH SESSION CYCLE: ASIA RANGE → LONDON SWEEP LOW → NEW YORK RALLY UP'
            : 'BEARISH SESSION CYCLE: ASIA RANGE → LONDON SWEEP HIGH → NEW YORK DROP DOWN'
        }
        accent={accent}
      />

      {/* 3 Session Columns */}
      <rect
        x="22"
        y="38"
        width="172"
        height="198"
        rx="6"
        fill="#ff9800"
        fillOpacity={activeStep === 0 ? 0.16 : 0.08}
        stroke="#ff9800"
        strokeWidth={activeStep === 0 ? 1.8 : 1}
      />
      <text x="108" y="54" textAnchor="middle" fill="#ffcc80" fontSize="9.2" fontFamily={FONT_MONO} fontWeight="700">
        1. ASIA SESSION
      </text>
      <text x="108" y="66" textAnchor="middle" fill="#8b909a" fontSize="8" fontFamily={FONT_MONO}>
        {asiaTime} (Range)
      </text>
      <text x="108" y="78" textAnchor="middle" fill="#2196f3" fontSize="7.5" fontFamily={FONT_MONO}>
        {t('All times in PH time', 'Lahat ng oras ay PH time')}
      </text>

      <rect
        x="202"
        y="38"
        width="192"
        height="198"
        rx="6"
        fill="#2962ff"
        fillOpacity={activeStep === 1 ? 0.18 : 0.08}
        stroke="#2962ff"
        strokeWidth={activeStep === 1 ? 1.8 : 1}
      />
      <text x="298" y="54" textAnchor="middle" fill="#90bff9" fontSize="9.2" fontFamily={FONT_MONO} fontWeight="700">
        2. LONDON KILLZONE
      </text>
      <text x="298" y="66" textAnchor="middle" fill="#8b909a" fontSize="8" fontFamily={FONT_MONO}>
        {londonTime} (Sweep)
      </text>

      <rect
        x="402"
        y="38"
        width="216"
        height="198"
        rx="6"
        fill={mainColor}
        fillOpacity={activeStep >= 2 ? 0.18 : 0.08}
        stroke={mainColor}
        strokeWidth={activeStep >= 2 ? 1.8 : 1}
      />
      <text x="510" y="54" textAnchor="middle" fill={accent} fontSize="9.2" fontFamily={FONT_MONO} fontWeight="700">
        3. NEW YORK OVERLAP ★ PEAK
      </text>
      <text x="510" y="66" textAnchor="middle" fill="#8b909a" fontSize="8" fontFamily={FONT_MONO}>
        {overlapTime} (Trend)
      </text>

      {/* Asia Range High & Low Box */}
      <rect x="34" y="114" width="148" height="58" rx="4" fill="#ff9800" fillOpacity="0.14" stroke="#ff9800" strokeDasharray="4 3" />
      <line x1="182" y1={isBull ? 172 : 114} x2="386" y2={isBull ? 172 : 114} stroke="#ff9800" strokeDasharray="5 4" strokeWidth="1.25" />

      {/* Session Price Trajectory */}
      <polyline
        points={
          isBull
            ? '40,142 74,120 108,166 142,122 176,162 248,198 304,146 376,130 460,104 596,74'
            : '40,142 74,166 108,120 142,164 176,124 248,84 304,138 376,154 460,182 596,214'
        }
        fill="none"
        stroke="#d1d4dc"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={isBull ? '248,198 304,146 460,104 596,74' : '248,84 304,138 460,182 596,214'}
        fill="none"
        stroke={mainColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="248" cy={isBull ? 198 : 84} r="5.5" fill="#5b9cf6" stroke="#131722" strokeWidth="2" />
      <text
        x="294"
        y={isBull ? 216 : 94}
        textAnchor="middle"
        fill="#90bff9"
        fontSize="8.5"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'Sweeps Asia Low' : 'Sweeps Asia High'}
      </text>

      <circle cx="596" cy={isBull ? 74 : 214} r="5.5" fill={mainColor} />
      <text
        x="522"
        y={isBull ? 126 : 162}
        textAnchor="middle"
        fill={accent}
        fontSize="9.2"
        fontFamily={FONT_MONO}
        fontWeight="700"
      >
        {isBull ? 'Bullish Expansion ▲' : 'Bearish Expansion ▼'}
      </text>

      <DiagramBottomNote
        text={
          isBull
            ? 'Power of 3 (Bullish): Asia accumulates range → London sweeps Asia Low → New York Overlap drives the Bullish trend.'
            : 'Power of 3 (Bearish): Asia accumulates range → London sweeps Asia High → New York Overlap drives the Bearish trend.'
        }
      />
    </g>
  );
}

/* ==================== 12. CRYPTO FUNDING & DOMINANCE ==================== */

function CryptoFundingDominanceSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  const cards = isBull
    ? [
        {
          x: 18,
          title: '1. SPOT DEMAND',
          sub: 'BTC Spot Bids Load',
          metric: 'BTC.D ▲ · Funding 0.01%',
          points: '34,154 64,142 94,146 128,122 168,108',
          lineColor: '#089981',
          note: 'Healthy low-leverage rise',
          border: '#089981',
          active: activeStep === 0,
        },
        {
          x: 224,
          title: '2. CROWDED SHORTS',
          sub: 'Negative Funding Trap',
          metric: 'Funding: -0.05% (Crowded)',
          points: '240,126 274,132 308,144 342,140 374,132',
          lineColor: '#ff9800',
          note: 'Late bears over-leveraged',
          border: '#ff9800',
          active: activeStep === 1,
        },
        {
          x: 430,
          title: '3. SHORT SQUEEZE ▲',
          sub: 'Liq. Sweep & Breakout',
          metric: 'Shorts Liquidated ▲',
          points: '446,154 476,158 504,126 538,108 584,96',
          lineColor: '#089981',
          note: 'Clean rally & Alt rotation',
          border: '#089981',
          active: activeStep >= 2,
        },
      ]
    : [
        {
          x: 18,
          title: '1. EUPHORIA LONGS',
          sub: 'Overheated Perps Funding',
          metric: 'Funding: +0.09% (Extreme)',
          points: '34,154 66,136 98,120 132,112 168,106',
          lineColor: '#ff9800',
          note: '20x–50x Longs packed',
          border: '#ff9800',
          active: activeStep === 0,
        },
        {
          x: 224,
          title: '2. ASK WALL ABSORB',
          sub: 'Order Book Resistance',
          metric: 'Heavy Ask Wall Blocks UP',
          points: '240,116 274,108 308,118 342,110 374,128',
          lineColor: '#2962ff',
          note: 'Buyers fail to break wall',
          border: '#2962ff',
          active: activeStep === 1,
        },
        {
          x: 430,
          title: '3. LONG FLUSH ▼',
          sub: 'Liquidation Cascade',
          metric: '50x Longs Wiped ▼',
          points: '446,104 476,112 508,156 542,146 584,166',
          lineColor: '#f23645',
          note: 'Sharp red wick resets OI',
          border: '#f23645',
          active: activeStep >= 2,
        },
      ];

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH CRYPTO FLOW: SPOT DEMAND → NEGATIVE FUNDING → SHORT SQUEEZE ▲'
            : 'BEARISH CRYPTO FLOW: OVERHEATED FUNDING → ASK WALL → LONG LIQUIDATION FLUSH ▼'
        }
        accent={accent}
      />

      {cards.map((card, i) => (
        <g key={card.title}>
          <rect
            x={card.x}
            y="40"
            width="192"
            height="196"
            rx="7"
            fill={card.border}
            fillOpacity={card.active ? 0.18 : 0.08}
            stroke={card.border}
            strokeWidth={card.active ? 1.8 : 1}
          />
          <text
            x={card.x + 96}
            y="60"
            textAnchor="middle"
            fill={card.border === '#089981' ? '#26a69a' : card.border === '#f23645' ? '#ff6b78' : '#ffcc80'}
            fontSize="9.5"
            fontFamily={FONT_MONO}
            fontWeight="700"
          >
            {card.title}
          </text>
          <text x={card.x + 96} y="75" textAnchor="middle" fill="#d1d4dc" fontSize="8.8" fontFamily={FONT_SANS}>
            {card.sub}
          </text>

          {/* Mini chart screen */}
          <rect x={card.x + 12} y="86" width="168" height="90" rx="5" fill="#131722" stroke="#2a2e39" />
          <text x={card.x + 20} y="102" fill="#ffb74d" fontSize="8" fontFamily={FONT_MONO} fontWeight="700">
            {card.metric}
          </text>
          <polyline
            points={card.points}
            fill="none"
            stroke={card.lineColor}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x={card.x + 96} y="202" textAnchor="middle" fill="#b2b5be" fontSize="8.8" fontFamily={FONT_SANS}>
            {card.note}
          </text>

          {i < 2 && (
            <text x={card.x + 199} y="140" textAnchor="middle" fill="#ffb74d" fontSize="14" fontWeight="700">
              →
            </text>
          )}
        </g>
      ))}

      <DiagramBottomNote
        text={
          isBull
            ? 'Bullish Crypto Edge: Spot buying + negative Perpetuals Funding fuels clean Short Squeezes without chasing.'
            : 'Bearish Crypto Warning: Extreme positive Funding + high leverage invites a violent Long Liquidation Flush.'
        }
      />
    </g>
  );
}

/* ==================== 13. STOCKS GAP & OPENING RANGE (ORB) ==================== */

function StocksOrbGapSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const openLabel = nyTimeToPhLabel('9:30 AM');
  const mainColor = isBull ? '#089981' : '#f23645';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH STOCKS ORB: OVERNIGHT GAP UP → 5m ORB BOX → HIGH-VOLUME BREAKOUT ▲'
            : 'BEARISH STOCKS ORB: OVERNIGHT GAP DOWN → 5m ORB BOX → HIGH-VOLUME BREAKDOWN ▼'
        }
        accent={accent}
      />

      {/* Cash-market open vertical line (label shown in PH time) */}
      <line x1="234" y1="38" x2="234" y2="236" stroke="#5b9cf6" strokeWidth="1.4" strokeDasharray="5 4" />
      <text x="234" y="49" textAnchor="middle" fill="#5b9cf6" fontSize="8.5" fontFamily={FONT_MONO} fontWeight="700">
        {openLabel} OPEN
      </text>

      {/* Yesterday Close Line */}
      <line
        x1="22"
        y1={isBull ? 174 : 74}
        x2="228"
        y2={isBull ? 174 : 74}
        stroke="#5d606b"
        strokeWidth="1.4"
        strokeDasharray="4 4"
      />
      <text
        x="78"
        y={isBull ? 190 : 66}
        textAnchor="middle"
        fill="#8b909a"
        fontSize="8.5"
        fontFamily={FONT_MONO}
      >
        Prior Close ($100)
      </text>

      {/* Overnight Gap Band */}
      <rect
        x="130"
        y={isBull ? 118 : 78}
        width="96"
        height="54"
        rx="4"
        fill={isBull ? '#089981' : '#f23645'}
        fillOpacity={activeStep === 0 ? 0.25 : 0.12}
        stroke={mainColor}
        strokeDasharray="4 3"
      />
      <text x="178" y={isBull ? 142 : 102} textAnchor="middle" fill={accent} fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
        {isBull ? 'GAP UP +4%' : 'GAP DOWN -4%'}
      </text>
      <text x="178" y={isBull ? 156 : 116} textAnchor="middle" fill="#b2b5be" fontSize="8" fontFamily={FONT_SANS}>
        Earnings / Catalyst
      </text>

      {/* 5-Min Opening Range Box (ORB) */}
      <rect
        x="244"
        y={isBull ? 96 : 104}
        width="116"
        height="52"
        rx="4"
        fill="#ff9800"
        fillOpacity={activeStep === 1 ? 0.28 : 0.14}
        stroke="#ff9800"
        strokeWidth={activeStep === 1 ? 1.8 : 1.2}
      />
      <line
        x1="244"
        y1={isBull ? 96 : 156}
        x2="612"
        y2={isBull ? 96 : 156}
        stroke="#ff9800"
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />
      <text x="302" y={isBull ? 86 : 96} textAnchor="middle" fill="#ffb74d" fontSize="8.5" fontFamily={FONT_MONO} fontWeight="700">
        5m ORB BOX
      </text>
      {/* 2 candles inside ORB */}
      <line x1="278" y1="104" x2="278" y2="146" stroke="#089981" strokeWidth="2" />
      <rect x="270" y="114" width="16" height="22" rx="1.5" fill="#089981" />
      <line x1="326" y1="108" x2="326" y2="144" stroke="#f23645" strokeWidth="2" />
      <rect x="318" y="118" width="16" height="18" rx="1.5" fill="#f23645" />

      {/* Breakout / Breakdown Candles */}
      {isBull ? (
        <>
          <line x1="398" y1="62" x2="398" y2="122" stroke="#089981" strokeWidth="2.4" />
          <rect x="388" y="70" width="20" height="44" rx="2" fill="#089981" stroke={activeStep >= 2 ? '#70d6c2' : 'none'} strokeWidth="2" />
          <line x1="454" y1="68" x2="454" y2="100" stroke="#f23645" strokeWidth="2" />
          <rect x="446" y="76" width="16" height="16" rx="2" fill="#f23645" />
          <line x1="510" y1="48" x2="510" y2="90" stroke="#089981" strokeWidth="2.2" />
          <rect x="501" y="54" width="18" height="30" rx="2" fill="#089981" />
          <line x1="564" y1="40" x2="564" y2="70" stroke="#089981" strokeWidth="2.2" />
          <rect x="555" y="44" width="18" height="22" rx="2" fill="#089981" />
          <text x="486" y="46" textAnchor="middle" fill="#26a69a" fontSize="9" fontFamily={FONT_MONO} fontWeight="700">
            RVOL BREAKOUT ABOVE VWAP ▲
          </text>
        </>
      ) : (
        <>
          <line x1="398" y1="138" x2="398" y2="196" stroke="#f23645" strokeWidth="2.4" />
          <rect x="388" y="144" width="20" height="44" rx="2" fill="#f23645" stroke={activeStep >= 2 ? '#ff9aa3' : 'none'} strokeWidth="2" />
          <line x1="454" y1="154" x2="454" y2="186" stroke="#089981" strokeWidth="2" />
          <rect x="446" y="162" width="16" height="16" rx="2" fill="#089981" />
          <line x1="510" y1="164" x2="510" y2="206" stroke="#f23645" strokeWidth="2.2" />
          <rect x="501" y="170" width="18" height="30" rx="2" fill="#f23645" />
          <line x1="564" y1="178" x2="564" y2="212" stroke="#f23645" strokeWidth="2.2" />
          <rect x="555" y="182" width="18" height="22" rx="2" fill="#f23645" />
          <text x="486" y="148" textAnchor="middle" fill="#ff6b78" fontSize="9" fontFamily={FONT_MONO} fontWeight="700">
            RVOL BREAKDOWN BELOW VWAP ▼
          </text>
        </>
      )}

      {/* Volume Bars at bottom */}
      <line x1="22" y1="236" x2="616" y2="236" stroke="#363a45" strokeWidth="1" />
      <text x="26" y="230" fill="#5d606b" fontSize="8" fontFamily={FONT_MONO}>
        VOL:
      </text>
      {[
        { x: 271, h: 20, c: '#ff9800' },
        { x: 319, h: 16, c: '#ff9800' },
        { x: 389, h: 42, c: mainColor },
        { x: 447, h: 16, c: '#5d606b' },
        { x: 502, h: 28, c: mainColor },
        { x: 556, h: 24, c: mainColor },
      ].map((b) => (
        <rect key={b.x} x={b.x} y={236 - b.h} width="16" height={b.h} rx="1.5" fill={b.c} opacity={b.x === 389 ? 1 : 0.65} />
      ))}

      <DiagramBottomNote
        text={
          isBull
            ? 'Bullish ORB: Gap Up + strong Relative Volume (RVOL) breakout above 5m Opening Range & VWAP.'
            : 'Bearish ORB: Gap Down + strong Relative Volume (RVOL) breakdown below 5m Opening Range & VWAP.'
        }
      />
    </g>
  );
}

/* ==================== 14. RISK-TO-REWARD MODEL (1:3 RR) ==================== */

function RiskRewardModelSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH LONG 1:3 RR (RISK-TO-REWARD): RISK $1 BELOW → TARGET $3 ABOVE'
            : 'BEARISH SHORT 1:3 RR (RISK-TO-REWARD): RISK $1 ABOVE → TARGET $3 BELOW'
        }
        accent={accent}
      />

      {isBull ? (
        <>
          {/* Reward Box (+3R) ABOVE Entry */}
          <rect
            x="200"
            y="42"
            width="392"
            height="112"
            rx="6"
            fill="#089981"
            fillOpacity={activeStep >= 2 ? 0.25 : 0.14}
            stroke="#089981"
            strokeWidth="1.5"
          />
          <text x="396" y="96" textAnchor="middle" fill="#26a69a" fontSize="12" fontFamily={FONT_MONO} fontWeight="700">
            TAKE PROFIT (+3R REWARD ▲)
          </text>
          <text x="396" y="114" textAnchor="middle" fill="#b2b5be" fontSize="9" fontFamily={FONT_SANS}>
            3× larger than Stop Loss box
          </text>

          {/* Entry Line */}
          <line x1="48" y1="154" x2="592" y2="154" stroke="#2962ff" strokeWidth="2" />
          <text x="122" y="147" textAnchor="middle" fill="#5b9cf6" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
            LONG ENTRY
          </text>

          {/* Risk Box (-1R) BELOW Entry */}
          <rect
            x="200"
            y="154"
            width="392"
            height="42"
            rx="6"
            fill="#f23645"
            fillOpacity={activeStep === 0 ? 0.28 : 0.16}
            stroke="#f23645"
            strokeWidth="1.5"
          />
          <text x="396" y="179" textAnchor="middle" fill="#ff9aa3" fontSize="10" fontFamily={FONT_MONO} fontWeight="700">
            STOP LOSS (-1R / MAX 1% RISK)
          </text>

          {/* Price Path */}
          <polyline
            points="52,188 144,132 208,154 276,172 368,116 462,84 556,48"
            fill="none"
            stroke="#d1d4dc"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <circle cx="208" cy="154" r="5" fill="#2962ff" />
          <circle cx="556" cy="48" r="6" fill="#089981" />
        </>
      ) : (
        <>
          {/* Risk Box (-1R) ABOVE Entry */}
          <rect
            x="200"
            y="42"
            width="392"
            height="42"
            rx="6"
            fill="#f23645"
            fillOpacity={activeStep === 0 ? 0.28 : 0.16}
            stroke="#f23645"
            strokeWidth="1.5"
          />
          <text x="396" y="67" textAnchor="middle" fill="#ff9aa3" fontSize="10" fontFamily={FONT_MONO} fontWeight="700">
            STOP LOSS (-1R / MAX 1% RISK)
          </text>

          {/* Entry Line */}
          <line x1="48" y1="84" x2="592" y2="84" stroke="#2962ff" strokeWidth="2" />
          <text x="122" y="77" textAnchor="middle" fill="#5b9cf6" fontSize="9.5" fontFamily={FONT_MONO} fontWeight="700">
            SHORT ENTRY
          </text>

          {/* Reward Box (+3R) BELOW Entry */}
          <rect
            x="200"
            y="84"
            width="392"
            height="112"
            rx="6"
            fill="#089981"
            fillOpacity={activeStep >= 2 ? 0.25 : 0.14}
            stroke="#089981"
            strokeWidth="1.5"
          />
          <text x="396" y="140" textAnchor="middle" fill="#26a69a" fontSize="12" fontFamily={FONT_MONO} fontWeight="700">
            TAKE PROFIT (+3R REWARD ▼)
          </text>
          <text x="396" y="158" textAnchor="middle" fill="#b2b5be" fontSize="9" fontFamily={FONT_SANS}>
            Short profits when price drops 3× your Stop distance
          </text>

          {/* Price Path */}
          <polyline
            points="52,50 144,106 208,84 276,66 368,122 462,156 556,190"
            fill="none"
            stroke="#d1d4dc"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <circle cx="208" cy="84" r="5" fill="#2962ff" />
          <circle cx="556" cy="190" r="6" fill="#089981" />
        </>
      )}

      <text x="320" y="224" textAnchor="middle" fill="#8b909a" fontSize="9" fontFamily={FONT_MONO}>
        Position Size = (Account × 1% Risk) ÷ Stop-Loss Distance
      </text>

      <DiagramBottomNote
        text={
          isBull
            ? 'Long Math: Stop Loss sits below Entry; Take Profit sits 3× higher. One +3R winner pays for three -1R losses.'
            : 'Short Math: Stop Loss sits above Entry; Take Profit sits 3× lower. Same strict 1% risk cap applies to Shorts.'
        }
      />
    </g>
  );
}

/* ==================== 15. TRADE MANAGEMENT & JOURNAL ==================== */

function TradeManagementJournalSvg({ activeStep, side }: DiagramSubProps) {
  const isBull = side === 'bullish';
  const accent = isBull ? '#26a69a' : '#ff6b78';

  return (
    <g>
      <DiagramTopBanner
        text={
          isBull
            ? 'BULLISH LONG MANAGEMENT: PARTIAL AT +1R → MOVE SL UP TO BE → +3R TARGET'
            : 'BEARISH SHORT MANAGEMENT: PARTIAL AT +1R → MOVE SL DOWN TO BE → +3R TARGET'
        }
        accent={accent}
      />

      {isBull ? (
        <>
          {/* Final TP +3R */}
          <line x1="32" y1="52" x2="608" y2="52" stroke="#089981" strokeWidth="1.6" strokeDasharray="6 4" />
          <rect x="444" y="38" width="164" height="19" rx="4" fill="#089981" fillOpacity="0.2" stroke="#089981" />
          <text x="526" y="51" textAnchor="middle" fill="#70d6c2" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            5. FINAL TP 1:3 (+3R)
          </text>

          {/* Partial +1R */}
          <line x1="32" y1="124" x2="608" y2="124" stroke="#ff9800" strokeWidth="1.4" strokeDasharray="5 4" />
          <rect x="200" y="100" width="168" height="19" rx="4" fill="#ff9800" fillOpacity={activeStep === 1 ? 0.3 : 0.16} stroke="#ff9800" />
          <text x="284" y="113" textAnchor="middle" fill="#ffcc80" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            3. PARTIAL AT 1:1 (+1R)
          </text>

          {/* Initial Risk Box */}
          <rect x="76" y="168" width="190" height="42" rx="4" fill="#f23645" fillOpacity={activeStep === 0 ? 0.28 : 0.14} stroke="#f23645" />
          <text x="171" y="224" textAnchor="middle" fill="#ff6b78" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            2. INITIAL SL (-1R)
          </text>

          {/* Entry / Breakeven Line */}
          <line x1="32" y1="168" x2="278" y2="168" stroke="#2962ff" strokeWidth="2" />
          <line x1="278" y1="168" x2="608" y2="168" stroke="#089981" strokeWidth="2" strokeDasharray="6 3" />

          {/* Arrow moving SL UP to Entry */}
          <line x1="286" y1="208" x2="286" y2="176" stroke="#5b9cf6" strokeWidth="2.4" />
          <polygon points="286,169 280,179 292,179" fill="#5b9cf6" />
          <rect x="304" y="178" width="244" height="30" rx="5" fill="#2962ff" fillOpacity="0.16" stroke="#5b9cf6" />
          <text x="426" y="196.5" textAnchor="middle" fill="#90bff9" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            4. MOVE SL UP TO BE (ZERO RISK!)
          </text>

          {/* Price Path */}
          <polyline
            points="36,198 96,168 156,188 278,124 352,142 448,90 538,52"
            fill="none"
            stroke="#d1d4dc"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="96" cy="168" r="5.5" fill="#2962ff" stroke="#131722" strokeWidth="2" />
          <text x="86" y="158" textAnchor="middle" fill="#5b9cf6" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            1. ENTRY
          </text>
          <circle cx="278" cy="124" r="5.5" fill="#ff9800" stroke="#131722" strokeWidth="2" />
          <circle cx="538" cy="52" r="6" fill="#089981" stroke="#131722" strokeWidth="2" />
        </>
      ) : (
        <>
          {/* Initial Risk Box ABOVE Short Entry */}
          <rect x="76" y="54" width="190" height="42" rx="4" fill="#f23645" fillOpacity={activeStep === 0 ? 0.28 : 0.14} stroke="#f23645" />
          <text x="171" y="48" textAnchor="middle" fill="#ff6b78" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            2. INITIAL SL ABOVE (-1R)
          </text>

          {/* Short Entry / Breakeven Line */}
          <line x1="32" y1="96" x2="278" y2="96" stroke="#2962ff" strokeWidth="2" />
          <line x1="278" y1="96" x2="608" y2="96" stroke="#089981" strokeWidth="2" strokeDasharray="6 3" />

          {/* Arrow moving SL DOWN to Entry */}
          <line x1="286" y1="56" x2="286" y2="88" stroke="#5b9cf6" strokeWidth="2.4" />
          <polygon points="286,95 280,85 292,85" fill="#5b9cf6" />
          <rect x="304" y="56" width="256" height="30" rx="5" fill="#2962ff" fillOpacity="0.16" stroke="#5b9cf6" />
          <text x="432" y="74.5" textAnchor="middle" fill="#90bff9" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            4. MOVE SL DOWN TO BE (ZERO RISK!)
          </text>

          {/* Partial +1R */}
          <line x1="32" y1="142" x2="608" y2="142" stroke="#ff9800" strokeWidth="1.4" strokeDasharray="5 4" />
          <rect x="200" y="148" width="168" height="19" rx="4" fill="#ff9800" fillOpacity={activeStep === 1 ? 0.3 : 0.16} stroke="#ff9800" />
          <text x="284" y="161" textAnchor="middle" fill="#ffcc80" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            3. PARTIAL AT 1:1 (+1R)
          </text>

          {/* Final TP +3R BELOW */}
          <line x1="32" y1="214" x2="608" y2="214" stroke="#089981" strokeWidth="1.6" strokeDasharray="6 4" />
          <rect x="444" y="219" width="164" height="19" rx="4" fill="#089981" fillOpacity="0.2" stroke="#089981" />
          <text x="526" y="232" textAnchor="middle" fill="#70d6c2" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            5. FINAL TP 1:3 (+3R)
          </text>

          {/* Short Price Path */}
          <polyline
            points="36,68 96,96 156,78 278,142 352,124 448,176 538,214"
            fill="none"
            stroke="#d1d4dc"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="96" cy="96" r="5.5" fill="#2962ff" stroke="#131722" strokeWidth="2" />
          <text x="86" y="114" textAnchor="middle" fill="#5b9cf6" fontSize="8.8" fontFamily={FONT_MONO} fontWeight="700">
            1. SHORT
          </text>
          <circle cx="278" cy="142" r="5.5" fill="#ff9800" stroke="#131722" strokeWidth="2" />
          <circle cx="538" cy="214" r="6" fill="#089981" stroke="#131722" strokeWidth="2" />
        </>
      )}

      <DiagramBottomNote
        text={
          isBull
            ? 'Long Journal Habit: Bank partial at +1R, shift SL (Stop Loss) up to BE (Breakeven), let runner reach +3R.'
            : 'Short Journal Habit: Bank partial at +1R, shift SL (Stop Loss) down to BE (Breakeven), let runner drop to +3R.'
        }
      />
    </g>
  );
}

/* ==================== RENDER DISPATCHER ==================== */

function renderDiagramGraphics(kind: DiagramKind, activeStep: number, side: DiagramSide) {
  switch (kind) {
    case 'chart_fundamentals':
      return <ChartFundamentalsSvg activeStep={activeStep} side={side} />;
    case 'candlestick_anatomy':
      return <CandlestickAnatomySvg activeStep={activeStep} side={side} />;
    case 'support_demand':
      return <SupportDemandSvg activeStep={activeStep} side={side} />;
    case 'order_block_choch':
      return <OrderBlockChochSvg activeStep={activeStep} side={side} />;
    case 'multi_timeframe':
      return <MultiTimeframeSvg activeStep={activeStep} side={side} />;
    case 'market_sessions':
      return <MarketSessionsSvg activeStep={activeStep} side={side} />;
    case 'crypto_funding_dominance':
      return <CryptoFundingDominanceSvg activeStep={activeStep} side={side} />;
    case 'stocks_orb_gap':
      return <StocksOrbGapSvg activeStep={activeStep} side={side} />;
    case 'trade_management_journal':
      return <TradeManagementJournalSvg activeStep={activeStep} side={side} />;
    case 'market_structure':
      return <MarketStructureSvg activeStep={activeStep} side={side} />;
    case 'liquidity_pools':
      return <LiquidityPoolsSvg activeStep={activeStep} side={side} />;
    case 'equal_highs_lows':
      return <EqualHighsLowsSvg activeStep={activeStep} side={side} />;
    case 'liquidity_sweep_vs_breakout':
      return <LiquiditySweepVsBreakoutSvg activeStep={activeStep} side={side} />;
    case 'fair_value_gap':
      return <FairValueGapSvg activeStep={activeStep} side={side} />;
    case 'risk_reward_model':
      return <RiskRewardModelSvg activeStep={activeStep} side={side} />;
  }
}

export function ConceptDiagramSvg({ config }: ConceptDiagramSvgProps) {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [biasMode, setBiasMode] = useState<DiagramBiasMode>('both');
  const totalSteps = Math.max(config.walkthroughSteps.length, 1);

  useEffect(() => {
    setActiveStep(0);
    setBiasMode('both');
  }, [config.kind, config.title]);

  const safeStep = activeStep >= totalSteps ? 0 : activeStep;
  const titleAcronymHint = getTitleAcronymHint(config.title);

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % totalSteps);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const visibleSides: DiagramSide[] =
    biasMode === 'both' ? ['bullish', 'bearish'] : [biasMode];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface">
        {/* Header + Bias Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-terminal-border bg-terminal-elevated/50 px-3.5 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs font-semibold text-terminal-text sm:text-sm">
                {localizeMarketTimes(config.title)}
              </h4>
              <span className="inline-flex shrink-0 items-center gap-1 rounded border border-brand/35 bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-brand-text">
                <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                {t('Bullish & Bearish Blueprint', 'Bullish at Bearish Diagram')}
              </span>
            </div>
            {titleAcronymHint && (
              <p className="mt-0.5 font-mono text-[10px] text-brand-text">{titleAcronymHint}</p>
            )}
            <p className="text-[11px] text-terminal-muted">{localizeText(config.subtitle)}</p>
          </div>

          {/* Accessible 3-Way Bias Toggle */}
          <div
            role="group"
            aria-label={t('Select diagram direction view', 'Piliin ang direksyon ng diagram')}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg p-1"
          >
            <button
              type="button"
              aria-pressed={biasMode === 'both'}
              onClick={() => setBiasMode('both')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                biasMode === 'both'
                  ? 'bg-brand text-brand-fg shadow-sm'
                  : 'text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {t(UI_COPY.diagrams.both.en, UI_COPY.diagrams.both.taglish)}
            </button>
            <button
              type="button"
              aria-pressed={biasMode === 'bullish'}
              onClick={() => setBiasMode('bullish')}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                biasMode === 'bullish'
                  ? 'bg-bull/20 text-bull ring-1 ring-bull/50'
                  : 'text-terminal-muted hover:text-bull'
              }`}
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              <span>{t(UI_COPY.diagrams.bullish.en, UI_COPY.diagrams.bullish.taglish)}</span>
            </button>
            <button
              type="button"
              aria-pressed={biasMode === 'bearish'}
              onClick={() => setBiasMode('bearish')}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                biasMode === 'bearish'
                  ? 'bg-bear/20 text-bear ring-1 ring-bear/50'
                  : 'text-terminal-muted hover:text-bear'
              }`}
            >
              <TrendingDown className="h-3 w-3" aria-hidden="true" />
              <span>{t(UI_COPY.diagrams.bearish.en, UI_COPY.diagrams.bearish.taglish)}</span>
            </button>
          </div>
        </div>

        {/* Dual Bullish & Bearish SVG Grid (or Zoomed Single View) */}
        <div className="bg-[#131722] p-2.5 sm:p-3.5">
          <div
            className={
              biasMode === 'both'
                ? 'grid grid-cols-1 gap-3 xl:grid-cols-2'
                : 'mx-auto max-w-3xl'
            }
          >
            {visibleSides.map((side) => {
              const isBull = side === 'bullish';
              const patternId = `grid-${config.kind}-${side}`;
              return (
                <div
                  key={side}
                  className={`overflow-hidden rounded-lg border bg-[#1e222d] ${
                    isBull ? 'border-[#089981]/45' : 'border-[#f23645]/45'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between gap-2 border-b px-3 py-1.5 ${
                      isBull
                        ? 'border-[#089981]/25 bg-[#089981]/10'
                        : 'border-[#f23645]/25 bg-[#f23645]/10'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                        isBull ? 'text-[#26a69a]' : 'text-[#ff6b78]'
                      }`}
                    >
                      {isBull ? (
                        <TrendingUp className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="h-3 w-3" aria-hidden="true" />
                      )}
                      {isBull
                        ? t('BULLISH • UP / LONG', 'BULLISH • PATAAS / BUY')
                        : t('BEARISH • DOWN / SHORT', 'BEARISH • PABABA / SELL')}
                    </span>
                    <span className="font-mono text-[9.5px] text-[#8b909a]">
                      {isBull
                        ? t('Buyers in Control', 'Buyers ang Lamang')
                        : t('Sellers in Control', 'Sellers ang Lamang')}
                    </span>
                  </div>

                  <div className="p-2">
                    <svg
                      viewBox="0 0 640 280"
                      className="h-auto w-full select-none"
                      role="img"
                      aria-label={`${isBull ? 'Bullish' : 'Bearish'} diagram: ${localizeText(config.title)}`}
                    >
                      <defs>
                        <pattern
                          id={patternId}
                          width="40"
                          height="40"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="#363a45"
                            strokeWidth="0.75"
                            opacity="0.55"
                          />
                        </pattern>
                      </defs>
                      <rect width="640" height="280" fill={`url(#${patternId})`} rx="6" />
                      {renderDiagramGraphics(config.kind, safeStep, side)}
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend & Caption */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-terminal-border bg-terminal-elevated/40 px-3.5 py-2">
          <div className="flex flex-wrap items-center gap-2.5">
            {config.legend.map((entry) => (
              <span
                key={entry.label}
                className="inline-flex items-center gap-1.5 text-[11px] text-terminal-muted"
              >
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ backgroundColor: resolveLegendColor(entry.colorToken) }}
                  aria-hidden="true"
                />
                {localizeText(entry.label)}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-terminal-muted">{localizeText(config.caption)}</p>
        </div>
      </div>

      {/* Compact Interactive Step Walkthrough */}
      {config.walkthroughSteps.length > 0 && (
        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-text tabular-nums">
              {t(`Step ${safeStep + 1} of ${totalSteps}`, `Hakbang ${safeStep + 1} sa ${totalSteps}`)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous diagram step"
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-terminal-border bg-terminal-elevated px-2 text-[11px] font-medium text-terminal-text transition-colors hover:border-brand/50 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t('Prev', 'Balik')}</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next diagram step"
                className="inline-flex h-7 items-center gap-1 rounded-lg bg-brand px-2.5 text-[11px] font-semibold text-brand-fg transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span>{t('Next', 'Susunod')}</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {safeStep > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset diagram step"
                  className="inline-flex h-7 items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2 text-[11px] font-medium text-terminal-muted transition-colors hover:border-brand/40 hover:text-terminal-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span className="hidden sm:inline">{t('Reset', 'Ulitin')}</span>
                </button>
              )}
            </div>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-terminal-text sm:text-[13px]">
            {localizeText(config.walkthroughSteps[safeStep])}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1">
            {config.walkthroughSteps.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(index)}
                aria-pressed={index === safeStep}
                className={`rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  index === safeStep
                    ? 'bg-brand font-semibold text-brand-fg'
                    : 'bg-terminal-elevated text-terminal-muted hover:text-terminal-text'
                }`}
              >
                {t(`Step ${index + 1}`, `Hakbang ${index + 1}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Annotations Grid */}
      {config.annotations.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {config.annotations.map((annotation) => {
            const toneStyles =
              annotation.tone === 'bullish'
                ? 'border-bull/35 bg-bull/10 text-bull'
                : annotation.tone === 'bearish'
                  ? 'border-bear/35 bg-bear/10 text-bear'
                  : annotation.tone === 'liquidity'
                    ? 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-brand/35 bg-brand-soft/60 text-brand-text';

            return (
              <div
                key={annotation.id}
                className={`rounded-lg border px-3 py-2 ${toneStyles}`}
              >
                <p className="font-mono text-[11px] font-semibold">
                  {localizeText(annotation.label)}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-terminal-muted">
                  {localizeText(annotation.sublabel)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
