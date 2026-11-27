import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TradingViewDrawingRail } from '../components/charts/TradingViewDrawingRail';
import { TradingViewWatchlist } from '../components/paper-trading/TradingViewWatchlist';
import { LanguageProvider } from '../context/LanguageContext';
import {
  buildHorizontalPriceLine,
  computeQuickPositionSetup,
  computeSessionHighLowLines,
} from '../lib/drawingTools';
import { PaperTradingPage } from '../pages/PaperTradingPage';
import type { CandlePoint } from '../types/academy';

const SAMPLE_CANDLES: CandlePoint[] = [
  { time: 1700000000, open: 100.0, high: 104.5, low: 98.2, close: 102.0, volume: 1200 },
  { time: 1700000900, open: 102.0, high: 107.85, low: 100.5, close: 106.1, volume: 1450 },
  { time: 1700001800, open: 106.1, high: 106.9, low: 96.35, close: 99.4, volume: 1620 },
  { time: 1700002700, open: 99.4, high: 103.2, low: 98.8, close: 101.75, volume: 1310 },
];

describe('drawingTools', () => {
  it('buildHorizontalPriceLine outputs a #2962ff dashed support_resistance price line', () => {
    const line = buildHorizontalPriceLine(
      { id: 'hline-1', price: 86412.3456, label: '  Key Support  ' },
      2,
    );

    expect(line).toEqual({
      id: 'hline-1',
      price: 86412.35,
      title: 'Key Support',
      color: '#2962ff',
      lineStyle: 'dashed',
      role: 'support_resistance',
    });

    const fallback = buildHorizontalPriceLine(
      { id: 'hline-2', price: 1.084567, label: '   ' },
      5,
    );
    expect(fallback.title).toBe('H-Line');
    expect(fallback.price).toBe(1.08457);
  });

  it('computeSessionHighLowLines returns [] for empty candles and 2 dotted #ff9800 lines with exact extremes', () => {
    expect(computeSessionHighLowLines([], 2)).toEqual([]);

    const lines = computeSessionHighLowLines(SAMPLE_CANDLES, 2);
    expect(lines).toHaveLength(2);

    expect(lines[0]).toEqual({
      id: 'tv-session-high',
      price: 107.85,
      title: 'Session High',
      color: '#ff9800',
      lineStyle: 'dotted',
      role: 'buy_side_liquidity',
    });

    expect(lines[1]).toEqual({
      id: 'tv-session-low',
      price: 96.35,
      title: 'Session Low',
      color: '#ff9800',
      lineStyle: 'dotted',
      role: 'sell_side_liquidity',
    });
  });

  it('computeQuickPositionSetup produces valid Long and Short setups with exact 1:2 RR', () => {
    const longSetup = computeQuickPositionSetup('long', 100, SAMPLE_CANDLES, 2);
    expect(longSetup.direction).toBe('long');
    expect(longSetup.entryPrice).toBe(100);
    expect(longSetup.stopLoss).toBeLessThan(longSetup.entryPrice);
    expect(longSetup.entryPrice).toBeLessThan(longSetup.takeProfit);

    const longRisk = Number((longSetup.entryPrice - longSetup.stopLoss).toFixed(2));
    const longReward = Number((longSetup.takeProfit - longSetup.entryPrice).toFixed(2));
    expect(longRisk).toBeGreaterThan(0);
    expect(longReward).toBeCloseTo(longRisk * 2, 6);

    const shortSetup = computeQuickPositionSetup('short', 100, SAMPLE_CANDLES, 2);
    expect(shortSetup.direction).toBe('short');
    expect(shortSetup.entryPrice).toBe(100);
    expect(shortSetup.takeProfit).toBeLessThan(shortSetup.entryPrice);
    expect(shortSetup.entryPrice).toBeLessThan(shortSetup.stopLoss);

    const shortRisk = Number((shortSetup.stopLoss - shortSetup.entryPrice).toFixed(2));
    const shortReward = Number((shortSetup.entryPrice - shortSetup.takeProfit).toFixed(2));
    expect(shortRisk).toBeGreaterThan(0);
    expect(shortReward).toBeCloseTo(shortRisk * 2, 6);
  });
});

describe('TradingViewDrawingRail', () => {
  it('triggers callbacks for H-Line, Session H/L, Long 1:2, Short 1:2, and Clear and toggles Clear disabled state', async () => {
    const user = userEvent.setup();
    const onSelectTool = vi.fn();
    const onAddHorizontalLine = vi.fn();
    const onToggleSessionHL = vi.fn();
    const onClearDrawings = vi.fn();
    const onApplyQuickSetup = vi.fn();

    const { rerender } = render(
      <LanguageProvider>
        <TradingViewDrawingRail
          activeTool="crosshair"
          onSelectTool={onSelectTool}
          onAddHorizontalLine={onAddHorizontalLine}
          showSessionHL={false}
          onToggleSessionHL={onToggleSessionHL}
          drawingCount={0}
          onClearDrawings={onClearDrawings}
          onApplyQuickSetup={onApplyQuickSetup}
        />
      </LanguageProvider>,
    );

    const clearBtn = screen.getByRole('button', { name: /Clear all drawn lines/i });
    expect(clearBtn).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /Horizontal Line \(H-Line\)/i }));
    expect(onAddHorizontalLine).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Session High \/ Low/i }));
    expect(onToggleSessionHL).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Long Position 1:2 RR/i }));
    expect(onApplyQuickSetup).toHaveBeenNthCalledWith(1, 'long');

    await user.click(screen.getByRole('button', { name: /Short Position 1:2 RR/i }));
    expect(onApplyQuickSetup).toHaveBeenNthCalledWith(2, 'short');

    // Clear becomes enabled when drawingCount > 0
    rerender(
      <LanguageProvider>
        <TradingViewDrawingRail
          activeTool="hline"
          onSelectTool={onSelectTool}
          onAddHorizontalLine={onAddHorizontalLine}
          showSessionHL={false}
          onToggleSessionHL={onToggleSessionHL}
          drawingCount={1}
          onClearDrawings={onClearDrawings}
          onApplyQuickSetup={onApplyQuickSetup}
        />
      </LanguageProvider>,
    );

    expect(clearBtn).toBeEnabled();
    await user.click(clearBtn);
    expect(onClearDrawings).toHaveBeenCalledTimes(1);

    // Clear is also enabled when showSessionHL is active even with 0 H-lines
    rerender(
      <LanguageProvider>
        <TradingViewDrawingRail
          activeTool="session_hl"
          onSelectTool={onSelectTool}
          onAddHorizontalLine={onAddHorizontalLine}
          showSessionHL={true}
          onToggleSessionHL={onToggleSessionHL}
          drawingCount={0}
          onClearDrawings={onClearDrawings}
          onApplyQuickSetup={onApplyQuickSetup}
        />
      </LanguageProvider>,
    );
    expect(clearBtn).toBeEnabled();
  });
});

describe('TradingViewWatchlist', () => {
  it('filters symbols by Crypto, Forex, Stocks, and Gold and calls onSelectSymbol on click', async () => {
    const user = userEvent.setup();
    const onSelectSymbol = vi.fn();

    render(
      <LanguageProvider>
        <TradingViewWatchlist
          activeSymbol="BTCUSDT"
          priceMap={{ BTCUSDT: 86500, 'XAU/USD': 2750.25 }}
          onSelectSymbol={onSelectSymbol}
        />
      </LanguageProvider>,
    );

    // Crypto filter
    await user.click(screen.getByRole('button', { name: /^Crypto$/i }));
    expect(screen.getByRole('button', { name: /BTCUSDT/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /EUR\/USD/i })).not.toBeInTheDocument();

    // Forex filter
    await user.click(screen.getByRole('button', { name: /^Forex$/i }));
    expect(screen.getByRole('button', { name: /EUR\/USD/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /BTCUSDT/i })).not.toBeInTheDocument();

    // Stocks filter
    await user.click(screen.getByRole('button', { name: /^Stocks$/i }));
    expect(screen.getByRole('button', { name: /AAPL/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /EUR\/USD/i })).not.toBeInTheDocument();

    // Gold (commodities) filter + row selection
    await user.click(screen.getByRole('button', { name: /^Gold$/i }));
    const goldRow = screen.getByRole('button', { name: /XAU\/USD/i });
    expect(goldRow).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /AAPL/i })).not.toBeInTheDocument();

    await user.click(goldRow);
    expect(onSelectSymbol).toHaveBeenCalledTimes(1);
    expect(onSelectSymbol.mock.calls[0][0]).toMatchObject({
      symbol: 'XAU/USD',
      assetClass: 'commodities',
    });
  });
});

describe('PaperTradingPage TradingView elements integration', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders SELL/BUY bid-ask buttons, toggles Watchlist open cleanly, and lets user click H-Line and Long 1:2 without errors', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <PaperTradingPage />
      </LanguageProvider>,
    );

    expect(
      await screen.findByText('VIRTUAL DEMO — NOT REAL MONEY'),
    ).toBeInTheDocument();

    // TradingView Classic SELL / BUY bid-ask direction buttons
    const directionGroup = screen.getByRole('group', {
      name: /Trade direction — Sell Bid or Buy Ask/i,
    });
    const sellButton = within(directionGroup).getByRole('button', { name: /SELL/i });
    const buyButton = within(directionGroup).getByRole('button', { name: /BUY/i });
    expect(sellButton).toBeInTheDocument();
    expect(buyButton).toBeInTheDocument();
    expect(buyButton).toHaveAttribute('aria-pressed', 'true');

    // Toggle Watchlist panel open
    const watchlistToggle = screen.getByRole('button', { name: /^Watchlist$/i });
    expect(screen.queryByRole('complementary', { name: /Market Watchlist/i })).not.toBeInTheDocument();
    await user.click(watchlistToggle);
    const watchlistAside = await screen.findByRole('complementary', {
      name: /Market Watchlist/i,
    });
    expect(watchlistAside).toBeInTheDocument();
    expect(within(watchlistAside).getByRole('button', { name: /BTCUSDT/i })).toBeInTheDocument();

    // Wait for candles to finish loading so drawing rail buttons are enabled
    const hLineButton = screen.getByRole('button', {
      name: /Horizontal Line \(H-Line\)/i,
    });
    await waitFor(() => {
      expect(hLineButton).toBeEnabled();
    });

    await user.click(hLineButton);
    expect(await screen.findByText(/Added H-Line at/i)).toBeInTheDocument();

    const longSetupButton = screen.getByRole('button', {
      name: /Long Position 1:2 RR/i,
    });
    await user.click(longSetupButton);
    expect(await screen.findByText(/Pre-filled Long 1:2 RR setup/i)).toBeInTheDocument();
  }, 15000);
});
