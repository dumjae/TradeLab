import { useMemo } from 'react';
import type { CandlePoint, ChartMarkerSpec, ChartPriceLine } from '../../types/academy';
import type { BacktestPosition, BacktestTrade } from '../../types/backtest';
import { InteractiveCandleChart } from '../charts/InteractiveCandleChart';

export interface BacktestChartCanvasProps {
  candles: CandlePoint[];
  replayIndex: number;
  symbol: string;
  timeframe: string;
  openPositions: BacktestPosition[];
  trades: BacktestTrade[];
  decimals: number;
}

function roundPrice(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function BacktestChartCanvas({
  candles,
  replayIndex,
  symbol,
  timeframe,
  openPositions,
  trades,
  decimals,
}: BacktestChartCanvasProps) {
  const visibleCount = Math.min(replayIndex + 1, candles.length);

  const priceLines = useMemo<ChartPriceLine[]>(
    () =>
      openPositions.flatMap((position, index) => {
        const tag = `#${index + 1} ${position.direction === 'long' ? 'LONG' : 'SHORT'}`;
        const lines: ChartPriceLine[] = [
          {
            id: `${position.id}-entry`,
            price: roundPrice(position.entryPrice, decimals),
            title: `${tag} Entry`,
            color: '#38bdf8',
            lineStyle: 'solid',
            role: 'entry',
          },
          {
            id: `${position.id}-sl`,
            price: roundPrice(position.stopLoss, decimals),
            title: `${tag} SL`,
            color: '#ef4444',
            lineStyle: 'dashed',
            role: 'stop_loss',
          },
        ];
        if (position.takeProfit !== null) {
          lines.push({
            id: `${position.id}-tp`,
            price: roundPrice(position.takeProfit, decimals),
            title: `${tag} TP`,
            color: '#10b981',
            lineStyle: 'dashed',
            role: 'take_profit',
          });
        }
        return lines;
      }),
    [openPositions, decimals],
  );

  const markers = useMemo<ChartMarkerSpec[]>(() => {
    const maxTime = candles[visibleCount - 1]?.time ?? 0;
    const result: ChartMarkerSpec[] = [];

    for (const trade of trades) {
      const isLong = trade.direction === 'long';
      if (trade.entryTime <= maxTime) {
        result.push({
          id: `${trade.id}-in`,
          time: trade.entryTime,
          position: isLong ? 'belowBar' : 'aboveBar',
          color: isLong ? '#10b981' : '#ef4444',
          shape: isLong ? 'arrowUp' : 'arrowDown',
          text: isLong ? 'Long' : 'Short',
          stage: 'before',
        });
      }
      if (trade.exitTime <= maxTime) {
        result.push({
          id: `${trade.id}-out`,
          time: trade.exitTime,
          position: isLong ? 'aboveBar' : 'belowBar',
          color: trade.outcome === 'win' ? '#10b981' : trade.outcome === 'loss' ? '#ef4444' : '#f59e0b',
          shape: 'circle',
          text: `${trade.rMultiple >= 0 ? '+' : ''}${trade.rMultiple}R`,
          stage: 'before',
        });
      }
    }

    for (const position of openPositions) {
      const isLong = position.direction === 'long';
      result.push({
        id: `${position.id}-open`,
        time: position.entryTime,
        position: isLong ? 'belowBar' : 'aboveBar',
        color: isLong ? '#10b981' : '#ef4444',
        shape: isLong ? 'arrowUp' : 'arrowDown',
        text: isLong ? 'Long' : 'Short',
        stage: 'before',
      });
    }

    return result;
  }, [trades, openPositions, candles, visibleCount]);

  return (
    <InteractiveCandleChart
      candles={candles}
      visibleCount={visibleCount}
      priceLines={priceLines}
      markers={markers}
      symbol={symbol}
      timeframe={timeframe}
      height={420}
    />
  );
}
