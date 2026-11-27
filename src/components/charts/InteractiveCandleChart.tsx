import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ColorType,
  CrosshairMode,
  LineStyle,
  TickMarkType,
  createChart,
  type CandlestickData,
  type IChartApi,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { Clock, Layers } from 'lucide-react';
import { PH_TIME_ZONE, formatPhTimestamp } from '../../lib/marketTime';
import type {
  CandlePoint,
  ChartMarkerSpec,
  ChartPriceLine,
  ChartReplayStage,
} from '../../types/academy';

export interface InteractiveCandleChartProps {
  candles: CandlePoint[];
  priceLines?: ChartPriceLine[];
  markers?: ChartMarkerSpec[];
  symbol: string;
  timeframe: string;
  height?: number;
  visibleCount?: number;
  activeStage?: ChartReplayStage;
  showLegend?: boolean;
  className?: string;
}

const STAGE_ORDER: Record<ChartReplayStage, number> = {
  before: 0,
  trigger: 1,
  after: 2,
};

const PH_TICK_YEAR = new Intl.DateTimeFormat('en-US', {
  timeZone: PH_TIME_ZONE,
  year: 'numeric',
});
const PH_TICK_MONTH = new Intl.DateTimeFormat('en-US', {
  timeZone: PH_TIME_ZONE,
  month: 'short',
  year: '2-digit',
});
const PH_TICK_DAY = new Intl.DateTimeFormat('en-US', {
  timeZone: PH_TIME_ZONE,
  day: 'numeric',
  month: 'short',
});
const PH_TICK_TIME = new Intl.DateTimeFormat('en-US', {
  timeZone: PH_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const PH_TICK_TIME_SEC = new Intl.DateTimeFormat('en-US', {
  timeZone: PH_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function formatPhTickMark(time: Time, tickMarkType: TickMarkType): string {
  if (typeof time !== 'number') {
    return String(time);
  }
  const date = new Date(time * 1000);
  switch (tickMarkType) {
    case TickMarkType.Year:
      return PH_TICK_YEAR.format(date);
    case TickMarkType.Month:
      return PH_TICK_MONTH.format(date);
    case TickMarkType.DayOfMonth:
      return PH_TICK_DAY.format(date);
    case TickMarkType.TimeWithSeconds:
      return PH_TICK_TIME_SEC.format(date);
    case TickMarkType.Time:
    default:
      return PH_TICK_TIME.format(date);
  }
}

function mapLineStyle(style: ChartPriceLine['lineStyle']): LineStyle {
  switch (style) {
    case 'dashed':
      return LineStyle.Dashed;
    case 'dotted':
      return LineStyle.Dotted;
    default:
      return LineStyle.Solid;
  }
}

function detectDarkMode(): boolean {
  if (typeof document === 'undefined') {
    return true;
  }
  return document.documentElement.classList.contains('dark');
}

function canRenderCanvasChart(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (typeof ResizeObserver === 'undefined') {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    return typeof canvas.getContext === 'function' && canvas.getContext('2d') !== null;
  } catch {
    return false;
  }
}

export function InteractiveCandleChart({
  candles,
  priceLines = [],
  markers = [],
  symbol,
  timeframe,
  height = 360,
  visibleCount,
  activeStage,
  showLegend = true,
  className = '',
}: InteractiveCandleChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDark, setIsDark] = useState<boolean>(detectDarkMode);
  const [chartFailed, setChartFailed] = useState<boolean>(() => !canRenderCanvasChart());
  const [hoveredState, setHoveredState] = useState<{
    seriesKey: string;
    ohlc: Pick<CandlePoint, 'open' | 'high' | 'low' | 'close'>;
  } | null>(null);

  const visibleCandles = useMemo(() => {
    if (visibleCount !== undefined && visibleCount > 0) {
      return candles.slice(0, Math.min(visibleCount, candles.length));
    }
    return candles;
  }, [candles, visibleCount]);

  const seriesKey = `${symbol}|${timeframe}|${visibleCandles.length}`;

  const visibleMarkers = useMemo(() => {
    if (visibleCandles.length === 0) {
      return [];
    }
    const maxTime = visibleCandles[visibleCandles.length - 1].time;
    return markers.filter((marker) => {
      if (marker.time > maxTime) {
        return false;
      }
      if (activeStage) {
        return STAGE_ORDER[marker.stage] <= STAGE_ORDER[activeStage];
      }
      return true;
    });
  }, [markers, visibleCandles, activeStage]);

  const latestCandle = visibleCandles[visibleCandles.length - 1];
  const displayCandle =
    hoveredState && hoveredState.seriesKey === seriesKey ? hoveredState.ohlc : latestCandle;
  const isCandleBull = displayCandle ? displayCandle.close >= displayCandle.open : true;
  const pctChange =
    displayCandle && displayCandle.open > 0
      ? ((displayCandle.close - displayCandle.open) / displayCandle.open) * 100
      : 0;
  const ohlcTone = isCandleBull ? 'text-bull' : 'text-bear';

  useEffect(() => {
    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const observer = new MutationObserver(() => {
      setIsDark(detectDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || chartFailed || visibleCandles.length === 0) {
      return undefined;
    }

    let chart: IChartApi | null = null;
    let resizeObserver: ResizeObserver | null = null;

    try {
      const bg = isDark ? '#0f131a' : '#ffffff';
      const textColor = isDark ? '#8c94a4' : '#555e6f';
      const gridColor = isDark ? 'rgba(38, 46, 61, 0.55)' : 'rgba(223, 228, 236, 0.75)';
      const borderColor = isDark ? '#262e3d' : '#dfe4ec';
      const bullCandle = '#089981';
      const bearCandle = '#f23645';
      const crosshairColor = isDark ? '#758696' : '#787b86';
      const crosshairLabelBg = isDark ? '#1e2531' : '#111621';

      chart = createChart(container, {
        width: Math.max(container.clientWidth || 640, 280),
        height,
        layout: {
          background: { type: ColorType.Solid, color: bg },
          textColor,
          fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
          fontSize: 11,
        },
        localization: {
          timeFormatter: (time: Time) =>
            typeof time === 'number' ? formatPhTimestamp(time) : String(time),
        },
        grid: {
          vertLines: { color: gridColor },
          horzLines: { color: gridColor },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: crosshairColor,
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: crosshairLabelBg,
          },
          horzLine: {
            color: crosshairColor,
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: crosshairLabelBg,
          },
        },
        rightPriceScale: {
          borderColor,
          scaleMargins: { top: 0.14, bottom: 0.14 },
        },
        timeScale: {
          borderColor,
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 4,
          tickMarkFormatter: formatPhTickMark,
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: bullCandle,
        downColor: bearCandle,
        borderUpColor: bullCandle,
        borderDownColor: bearCandle,
        wickUpColor: bullCandle,
        wickDownColor: bearCandle,
      });

      candleSeries.setData(
        visibleCandles.map((candle) => ({
          time: candle.time as UTCTimestamp,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        })),
      );

      for (const line of priceLines) {
        candleSeries.createPriceLine({
          price: line.price,
          color: line.color,
          lineWidth: 2,
          lineStyle: mapLineStyle(line.lineStyle),
          axisLabelVisible: true,
          title: line.title,
        });
      }

      if (visibleMarkers.length > 0) {
        const formattedMarkers: SeriesMarker<Time>[] = [...visibleMarkers]
          .sort((a, b) => a.time - b.time)
          .map((marker) => ({
            time: marker.time as UTCTimestamp,
            position: marker.position,
            color: marker.color,
            shape: marker.shape,
            text: marker.text,
          }));
        candleSeries.setMarkers(formattedMarkers);
      }

      chart.subscribeCrosshairMove((param) => {
        if (!param.time) {
          setHoveredState(null);
          return;
        }
        const point = param.seriesData.get(candleSeries) as CandlestickData<Time> | undefined;
        if (point && typeof point.open === 'number') {
          setHoveredState({
            seriesKey,
            ohlc: {
              open: point.open,
              high: point.high,
              low: point.low,
              close: point.close,
            },
          });
        } else {
          setHoveredState(null);
        }
      });

      chart.timeScale().fitContent();

      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry && chart) {
          const nextWidth = Math.floor(entry.contentRect.width);
          if (nextWidth > 0) {
            chart.applyOptions({ width: nextWidth });
          }
        }
      });
      resizeObserver.observe(container);
    } catch {
      setChartFailed(true);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (chart) {
        chart.remove();
      }
    };
  }, [visibleCandles, priceLines, visibleMarkers, height, isDark, chartFailed, seriesKey]);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface ${className}`}
    >
      {/* TradingView Supercharts OHLC Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-terminal-border bg-terminal-surface px-3 py-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-xs font-bold tracking-tight text-terminal-text">
              {symbol}
            </span>
            <span className="text-xs text-terminal-muted" aria-hidden="true">
              ·
            </span>
            <span className="rounded border border-terminal-border bg-terminal-elevated px-1.5 py-0.5 font-mono text-[11px] font-semibold text-terminal-text">
              {timeframe}
            </span>
            <span
              className="ml-0.5 inline-flex h-2 w-2 rounded-full bg-bull"
              title="Chart feed active"
              aria-hidden="true"
            />
          </div>

          {displayCandle && (
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[11px] tabular-nums">
              <span className="text-terminal-muted">
                O <strong className={`font-semibold ${ohlcTone}`}>{displayCandle.open}</strong>
              </span>
              <span className="text-terminal-muted">
                H <strong className={`font-semibold ${ohlcTone}`}>{displayCandle.high}</strong>
              </span>
              <span className="text-terminal-muted">
                L <strong className={`font-semibold ${ohlcTone}`}>{displayCandle.low}</strong>
              </span>
              <span className="text-terminal-muted">
                C <strong className={`font-semibold ${ohlcTone}`}>{displayCandle.close}</strong>
              </span>
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums ${
                  isCandleBull ? 'bg-bull/15 text-bull' : 'bg-bear/15 text-bear'
                }`}
              >
                {pctChange >= 0 ? '+' : ''}
                {pctChange.toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-terminal-muted tabular-nums">
            {visibleCandles.length} bars
          </span>
          <span
            className="inline-flex items-center gap-1 rounded border border-terminal-border bg-terminal-elevated px-2 py-0.5 font-mono text-[10px] font-medium text-terminal-muted"
            title="Philippine Time (Asia/Manila, UTC+8)"
          >
            <Clock className="h-3 w-3 text-brand-text" aria-hidden="true" />
            PH Time
          </span>
        </div>
      </div>

      {chartFailed ? (
        <div
          style={{ minHeight: `${height}px` }}
          className="flex flex-col justify-between bg-terminal-bg p-4"
          role="img"
          aria-label={`${symbol} ${timeframe} candlestick scenario preview`}
        >
          <div className="flex items-center justify-between text-xs text-terminal-muted">
            <span className="inline-flex items-center gap-1.5 font-medium text-terminal-text">
              <Layers className="h-3.5 w-3.5 text-brand-text" aria-hidden="true" />
              Structured OHLC Data Preview ({symbol} · {timeframe})
            </span>
            <span className="font-mono tabular-nums">{visibleCandles.length} candles</span>
          </div>

          <div className="my-4 grid h-40 grid-cols-12 items-end gap-1 rounded-lg border border-terminal-border bg-terminal-surface p-3">
            {visibleCandles.slice(-12).map((bar) => {
              const bullish = bar.close >= bar.open;
              const range = Math.max(bar.high - bar.low, 0.0001);
              const bodyRatio = Math.max(Math.abs(bar.close - bar.open) / range, 0.15);
              return (
                <div key={bar.time} className="flex h-full flex-col items-center justify-end gap-1">
                  <div
                    className={`w-2.5 rounded-sm ${bullish ? 'bg-bull' : 'bg-bear'}`}
                    style={{ height: `${Math.round(bodyRatio * 100)}%` }}
                    title={`O:${bar.open} H:${bar.high} L:${bar.low} C:${bar.close}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {visibleMarkers.map((marker) => (
              <span
                key={marker.id}
                className="inline-flex items-center gap-1.5 rounded border border-terminal-border bg-terminal-surface px-2 py-0.5 font-mono text-[11px] text-terminal-text"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: marker.color }}
                />
                {marker.text}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{ height: `${height}px` }}
          className="w-full"
          aria-label={`Interactive candlestick chart for ${symbol} ${timeframe}`}
        />
      )}

      {showLegend && priceLines.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-terminal-border bg-terminal-elevated/60 px-3 py-2">
          {priceLines.map((line) => (
            <div
              key={line.id}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-terminal-muted tabular-nums"
            >
              <span
                className="h-0.5 w-3.5 rounded-full"
                style={{ backgroundColor: line.color }}
                aria-hidden="true"
              />
              <span className="text-terminal-text">{line.title}</span>
              <span>{line.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
