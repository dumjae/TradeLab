import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
  type IChartApi,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { BarChart3, Layers } from 'lucide-react';
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

  const visibleCandles = useMemo(() => {
    if (visibleCount !== undefined && visibleCount > 0) {
      return candles.slice(0, Math.min(visibleCount, candles.length));
    }
    return candles;
  }, [candles, visibleCount]);

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
  const firstCandle = visibleCandles[0];
  const priceDelta =
    latestCandle && firstCandle ? latestCandle.close - firstCandle.open : 0;
  const isPositive = priceDelta >= 0;

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
      const bg = isDark ? '#0b1018' : '#ffffff';
      const textColor = isDark ? '#94a3b8' : '#475569';
      const gridColor = isDark ? 'rgba(35, 48, 68, 0.55)' : 'rgba(226, 232, 240, 0.85)';
      const borderColor = isDark ? '#233044' : '#cbd5e1';

      chart = createChart(container, {
        width: Math.max(container.clientWidth || 640, 280),
        height,
        layout: {
          background: { type: ColorType.Solid, color: bg },
          textColor,
          fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
          fontSize: 11,
        },
        grid: {
          vertLines: { color: gridColor },
          horzLines: { color: gridColor },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: isDark ? '#475569' : '#64748b',
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: isDark ? '#1e293b' : '#0f172a',
          },
          horzLine: {
            color: isDark ? '#475569' : '#64748b',
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: isDark ? '#1e293b' : '#0f172a',
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
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
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
  }, [visibleCandles, priceLines, visibleMarkers, height, isDark, chartFailed]);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terminal-border bg-terminal-elevated/60 px-3.5 py-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wide text-terminal-text">
            <BarChart3 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            {symbol}
          </span>
          <span className="rounded bg-terminal-bg px-1.5 py-0.5 font-mono text-[11px] font-medium text-terminal-muted border border-terminal-border">
            {timeframe}
          </span>
          <span className="font-mono text-[11px] text-terminal-muted tabular-nums">
            {visibleCandles.length} bars
          </span>
        </div>

        {latestCandle && (
          <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
            <span className="text-terminal-muted">
              O <strong className="text-terminal-text">{latestCandle.open}</strong>
            </span>
            <span className="text-terminal-muted">
              H <strong className="text-emerald-400">{latestCandle.high}</strong>
            </span>
            <span className="text-terminal-muted">
              L <strong className="text-rose-400">{latestCandle.low}</strong>
            </span>
            <span className="text-terminal-muted">
              C{' '}
              <strong className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                {latestCandle.close}
              </strong>
            </span>
          </div>
        )}
      </div>

      {chartFailed ? (
        <div
          style={{ minHeight: `${height}px` }}
          className="flex flex-col justify-between bg-terminal-bg/60 p-4"
          role="img"
          aria-label={`${symbol} ${timeframe} candlestick scenario preview`}
        >
          <div className="flex items-center justify-between text-xs text-terminal-muted">
            <span className="inline-flex items-center gap-1.5 font-medium text-terminal-text">
              <Layers className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              Structured OHLC Data Preview ({symbol} · {timeframe})
            </span>
            <span className="font-mono tabular-nums">{visibleCandles.length} candles</span>
          </div>

          <div className="my-4 grid grid-cols-12 items-end gap-1 rounded-lg border border-terminal-border bg-terminal-surface/80 p-3 h-40">
            {visibleCandles.slice(-12).map((bar) => {
              const bullish = bar.close >= bar.open;
              const range = Math.max(bar.high - bar.low, 0.0001);
              const bodyRatio = Math.max(Math.abs(bar.close - bar.open) / range, 0.15);
              return (
                <div key={bar.time} className="flex h-full flex-col items-center justify-end gap-1">
                  <div
                    className={`w-2.5 rounded-sm ${bullish ? 'bg-emerald-500' : 'bg-rose-500'}`}
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-terminal-border bg-terminal-elevated/40 px-3.5 py-2">
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
