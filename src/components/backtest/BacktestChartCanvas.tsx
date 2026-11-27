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
  extraPriceLines?: ChartPriceLine[];
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
  extraPriceLines = [],
}: BacktestChartCanvasProps) {
  const visibleCount = Math.min(replayIndex + 1, candles.length);

  const priceLines = useMemo<ChartPriceLine[]>(() => {
    const positionLines = openPositions.flatMap((position, index) => {
      const tag = `#${index + 1} ${position.direction === 'long' ? 'LONG' : 'SHORT'}`;
      const lines: ChartPriceLine[] = [
        {
          id: `${position.id}-entry`,
          price: roundPrice(position.entryPrice, decimals),
          title: `${tag} Entry`,
          color: '#2962ff',
          lineStyle: 'solid',
          role: 'entry',
        },
        {
          id: `${position.id}-sl`,
          price: roundPrice(position.stopLoss, decimals),
          title: `${tag} SL`,
          color: '#f23645',
          lineStyle: 'dashed',
          role: 'stop_loss',
        },
      ];
      if (position.takeProfit !== null) {
        lines.push({
          id: `${position.id}-tp`,
          price: roundPrice(position.takeProfit, decimals),
          title: `${tag} TP`,
          color: '#089981',
          lineStyle: 'dashed',
          role: 'take_profit',
        });
      }
      return lines;
    });

    return extraPriceLines.length > 0 ? [...positionLines, ...extraPriceLines] : positionLines;
  }, [openPositions, decimals, extraPriceLines]);

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
          color: isLong ? '#089981' : '#f23645',
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
          color: trade.outcome === 'win' ? '#089981' : trade.outcome === 'loss' ? '#f23645' : '#ff9800',
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
        color: isLong ? '#089981' : '#f23645',
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
