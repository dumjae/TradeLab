import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { LESSON_TAGLISH_SUMMARIES } from '../data/taglishTranslations';
import { expandAcronyms, formatAcronym } from '../lib/acronymHelper';
import {
  calculateOrderPreview,
  closePaperPositionCalculation,
  computePaperPortfolioMetrics,
  evaluatePositionAgainstBar,
} from '../lib/paperTradingEngine';
import { PaperTradingPage } from '../pages/PaperTradingPage';
import { listJournalEntries } from '../services/journalService';
import {
  closePositionAtMarket,
  createPaperAccount,
  deletePaperAccount,
  listPaperAccounts,
  listPaperPositions,
  listPaperTrades,
  movePositionToBreakeven,
  placePaperOrder,
  syncPaperTradeToJournal,
} from '../services/paperTradingService';
import type { PaperAccount, PaperPosition, PaperTrade } from '../types/paper-trading';

function makeAccount(overrides: Partial<PaperAccount> = {}): PaperAccount {
  return {
    id: 'wallet-test-1',
    userId: 'local-user',
    accountName: 'Crypto Demo',
    marketFocus: 'crypto',
    startingBalance: 10000,
    cashBalance: 10000,
    dailyLossLimitPct: 3,
    maxRiskPerTradePct: 1,
    simulateFeesSpread: true,
    feeRateBps: 5,
    spreadBps: 2,
    resetCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makePosition(overrides: Partial<PaperPosition> = {}): PaperPosition {
  return {
    id: 'pos-test-1',
    accountId: 'wallet-test-1',
    userId: 'local-user',
    symbol: 'BTCUSDT',
    assetClass: 'crypto',
    direction: 'long',
    orderType: 'market',
    status: 'open',
    entryPrice: 100.01,
    rawQuotePrice: 100,
    stopLoss: 95,
    takeProfit: 110,
    units: 20,
    riskAmount: 100,
    entryFee: 1,
    entrySpreadCost: 0.2,
    setupTag: 'BOS Pullback',
    movedToBreakeven: false,
    openedAt: '2026-01-02T10:00:00.000Z',
    createdAt: '2026-01-02T10:00:00.000Z',
    updatedAt: '2026-01-02T10:00:00.000Z',
    ...overrides,
  };
}

function makeTrade(overrides: Partial<PaperTrade> = {}): PaperTrade {
  return {
    id: 'trade-test-1',
    accountId: 'wallet-test-1',
    userId: 'local-user',
    symbol: 'BTCUSDT',
    assetClass: 'crypto',
    direction: 'long',
    entryPrice: 100,
    exitPrice: 95,
    stopLoss: 95,
    takeProfit: 110,
    units: 20,
    riskAmount: 100,
    grossPnl: -100,
    feeAmount: 0,
    spreadCost: 0,
    pnlAmount: -100,
    rMultiple: -1,
    outcome: 'loss',
    exitReason: 'stop_loss',
    setupTag: 'FVG Entry',
    syncedToJournal: false,
    openedAt: '2026-01-02T10:00:00.000Z',
    closedAt: '2026-01-02T11:00:00.000Z',
    ...overrides,
  };
}

describe('acronymHelper', () => {
  it('expands BOS, CHoCH, FVG, SL, TP, RR, and P&L on first occurrence', () => {
    const input =
      'Wait for BOS or CHoCH into an FVG, set SL and TP for 1:2 RR, then check P&L.';
    const expanded = expandAcronyms(input);

    expect(expanded).toContain('BOS (Break of Structure)');
    expect(expanded).toContain('CHoCH (Change of Character)');
    expect(expanded).toContain('FVG (Fair Value Gap)');
    expect(expanded).toContain('SL (Stop Loss)');
    expect(expanded).toContain('TP (Take Profit)');
    expect(expanded).toContain('RR (Risk-to-Reward Ratio)');
    expect(expanded).toContain('P&L (Profit & Loss)');
    expect(formatAcronym('BOS')).toBe('BOS (Break of Structure)');
  });

  it('does not double-expand already expanded acronyms or repeated codes', () => {
    const alreadyExpanded = 'Look for BOS (Break of Structure) and then another BOS setup.';
    expect(expandAcronyms(alreadyExpanded)).toBe(alreadyExpanded);

    const reversedExpanded = 'Watch for Break of Structure (BOS) before entry.';
    expect(expandAcronyms(reversedExpanded)).toBe(reversedExpanded);

    const repeated = 'Set SL below the swing low and move SL to breakeven.';
    expect(expandAcronyms(repeated)).toBe(
      'Set SL (Stop Loss) below the swing low and move SL to breakeven.',
    );
  });

  it('does not mangle market tickers or URLs', () => {
    const text =
      'Chart BTCUSDT, EURUSD, NAS100, and read https://tradelab.academy/guides/BOS/FVG/SL?tp=TP&rr=RR now.';
    expect(expandAcronyms(text)).toBe(text);
  });
});

describe('paperTradingEngine', () => {
  it('calculates realistic fees & spread on entry and exit with grossPnl - feeAmount - spreadCost === pnlAmount', () => {
    const account = makeAccount({
      startingBalance: 10000,
      cashBalance: 10000,
      simulateFeesSpread: true,
      feeRateBps: 5,
      spreadBps: 2,
    });

    const preview = calculateOrderPreview(account, {
      symbol: 'BTCUSDT',
      assetClass: 'crypto',
      direction: 'long',
      orderType: 'market',
      currentMarketPrice: 50000,
      stopLoss: 49000,
      takeProfit: 52000,
      riskPercent: 1,
    });

    expect(preview.valid).toBe(true);
    expect(preview.entryPrice).toBeGreaterThan(50000);
    expect(preview.entryFee).toBeGreaterThan(0);
    expect(preview.entrySpreadCost).toBeGreaterThan(0);

    const openPosition = makePosition({
      entryPrice: preview.entryPrice,
      rawQuotePrice: preview.rawQuotePrice,
      stopLoss: 49000,
      takeProfit: 52000,
      units: preview.units,
      riskAmount: preview.riskAmount,
      entryFee: preview.entryFee,
      entrySpreadCost: preview.entrySpreadCost,
    });

    const closed = closePaperPositionCalculation(
      openPosition,
      52000,
      'take_profit',
      account,
      '2026-01-02T12:00:00.000Z',
    );

    expect(closed.feeAmount).toBeGreaterThan(preview.entryFee);
    expect(closed.spreadCost).toBeGreaterThan(preview.entrySpreadCost);
    expect(closed.exitPrice).toBeLessThan(52000);
    expect(
      Number((closed.grossPnl - closed.feeAmount - closed.spreadCost).toFixed(2)),
    ).toBe(closed.pnlAmount);
  });

  it('produces clean $0 fee and $0 spread when simulateFeesSpread is false', () => {
    const cleanAccount = makeAccount({
      simulateFeesSpread: false,
      feeRateBps: 5,
      spreadBps: 2,
    });

    const preview = calculateOrderPreview(cleanAccount, {
      symbol: 'BTCUSDT',
      assetClass: 'crypto',
      direction: 'long',
      orderType: 'market',
      currentMarketPrice: 50000,
      stopLoss: 49000,
      takeProfit: 52000,
      riskPercent: 1,
    });

    expect(preview.valid).toBe(true);
    expect(preview.entryPrice).toBe(50000);
    expect(preview.entryFee).toBe(0);
    expect(preview.estimatedTotalFees).toBe(0);
    expect(preview.entrySpreadCost).toBe(0);
    expect(preview.estimatedSpreadCost).toBe(0);

    const position = makePosition({
      entryPrice: preview.entryPrice,
      rawQuotePrice: preview.rawQuotePrice,
      stopLoss: 49000,
      takeProfit: 52000,
      units: preview.units,
      riskAmount: preview.riskAmount,
      entryFee: preview.entryFee,
      entrySpreadCost: preview.entrySpreadCost,
    });

    const closed = closePaperPositionCalculation(
      position,
      52000,
      'take_profit',
      cleanAccount,
      '2026-01-02T12:00:00.000Z',
    );

    expect(closed.feeAmount).toBe(0);
    expect(closed.spreadCost).toBe(0);
    expect(closed.exitPrice).toBe(52000);
    expect(closed.pnlAmount).toBe(closed.grossPnl);
  });

  it('applies conservative SL-first tie-breaking when an OHLC bar touches both SL and TP', () => {
    const account = makeAccount({ simulateFeesSpread: false });

    const longPos = makePosition({
      direction: 'long',
      entryPrice: 100,
      rawQuotePrice: 100,
      stopLoss: 95,
      takeProfit: 110,
      entryFee: 0,
      entrySpreadCost: 0,
    });
    const longResult = evaluatePositionAgainstBar(
      longPos,
      { high: 115, low: 90, close: 108 },
      account,
    );
    expect(longResult.action).toBe('closed');
    expect(longResult.closedTrade?.exitReason).toBe('stop_loss');
    expect(longResult.closedTrade?.exitPrice).toBe(95);

    const shortPos = makePosition({
      direction: 'short',
      entryPrice: 100,
      rawQuotePrice: 100,
      stopLoss: 105,
      takeProfit: 90,
      entryFee: 0,
      entrySpreadCost: 0,
    });
    const shortResult = evaluatePositionAgainstBar(
      shortPos,
      { high: 106, low: 88, close: 91 },
      account,
    );
    expect(shortResult.action).toBe('closed');
    expect(shortResult.closedTrade?.exitReason).toBe('stop_loss');
    expect(shortResult.closedTrade?.exitPrice).toBe(105);
  });

  it('fills a pending Limit order only when the bar crosses the limit price', () => {
    const account = makeAccount({ simulateFeesSpread: false });
    const pendingLimit = makePosition({
      orderType: 'limit',
      status: 'pending',
      entryPrice: 98,
      rawQuotePrice: 98,
      stopLoss: 94,
      takeProfit: 106,
    });

    const missed = evaluatePositionAgainstBar(
      pendingLimit,
      { high: 104, low: 99, close: 102 },
      account,
    );
    expect(missed.action).toBe('none');

    const filled = evaluatePositionAgainstBar(
      pendingLimit,
      { high: 101, low: 97.5, close: 99.5 },
      account,
    );
    expect(filled.action).toBe('filled');
    expect(filled.updatedPosition?.status).toBe('open');
  });

  it('detects when the daily loss limit has been reached', () => {
    const account = makeAccount({
      startingBalance: 10000,
      cashBalance: 9650,
      dailyLossLimitPct: 3,
      simulateFeesSpread: false,
    });

    const todayTrades: PaperTrade[] = [
      makeTrade({ id: 't-1', pnlAmount: -200, closedAt: '2026-04-10T09:00:00.000Z' }),
      makeTrade({ id: 't-2', pnlAmount: -150, closedAt: '2026-04-10T11:30:00.000Z' }),
    ];

    const breached = computePaperPortfolioMetrics(
      account,
      [],
      todayTrades,
      {},
      '2026-04-10T15:00:00.000Z',
    );
    expect(breached.todayRealizedPnl).toBe(-350);
    expect(breached.todayLossPct).toBe(3.5);
    expect(breached.dailyLossLimitReached).toBe(true);

    const nextDay = computePaperPortfolioMetrics(
      account,
      [],
      todayTrades,
      {},
      '2026-04-11T09:00:00.000Z',
    );
    expect(nextDay.todayRealizedPnl).toBe(0);
    expect(nextDay.todayLossPct).toBe(0);
    expect(nextDay.dailyLossLimitReached).toBe(false);
  });
});

describe('paperTradingService (LocalStorage mode)', () => {
  it('auto-seeds 2 separate wallets (Crypto Demo + Forex Demo) on first listPaperAccounts()', async () => {
    const accounts = await listPaperAccounts();

    expect(accounts).toHaveLength(2);
    expect(accounts.map((a) => a.accountName)).toEqual(['Crypto Demo', 'Forex Demo']);
    expect(accounts[0].marketFocus).toBe('crypto');
    expect(accounts[1].marketFocus).toBe('forex');
    expect(accounts[0].id).not.toBe(accounts[1].id);
  });

  it('supports creating a custom wallet, opening a trade, moving SL to BE, closing, and 1-click Journal sync', async () => {
    await listPaperAccounts();

    const indicesWallet = await createPaperAccount({
      accountName: 'Indices Demo',
      marketFocus: 'indices',
      startingBalance: 25000,
      dailyLossLimitPct: 3,
      maxRiskPerTradePct: 1,
      simulateFeesSpread: true,
    });

    expect(indicesWallet.accountName).toBe('Indices Demo');
    expect(indicesWallet.marketFocus).toBe('indices');
    expect(indicesWallet.cashBalance).toBe(25000);

    const opened = await placePaperOrder({
      accountId: indicesWallet.id,
      symbol: 'NAS100',
      assetClass: 'indices',
      direction: 'long',
      orderType: 'market',
      currentMarketPrice: 20000,
      stopLoss: 19900,
      takeProfit: 20250,
      riskPercent: 1,
      setupTag: 'NY Open Sweep',
    });

    expect(opened.status).toBe('open');
    expect(opened.movedToBreakeven).toBe(false);

    const movedToBe = await movePositionToBreakeven(opened.id);
    expect(movedToBe.movedToBreakeven).toBe(true);
    expect(movedToBe.stopLoss).toBe(opened.entryPrice);

    const { trade, account: updatedWallet } = await closePositionAtMarket(
      opened.id,
      20200,
      'manual_close',
    );
    expect(trade.pnlAmount).toBeGreaterThan(0);
    expect(trade.syncedToJournal).toBe(false);
    expect(
      Number((trade.grossPnl - trade.feeAmount - trade.spreadCost).toFixed(2)),
    ).toBe(trade.pnlAmount);
    expect(updatedWallet.cashBalance).toBe(Number((25000 + trade.pnlAmount).toFixed(2)));
    expect(await listPaperPositions(indicesWallet.id)).toHaveLength(0);

    const syncedTrade = await syncPaperTradeToJournal(trade.id);
    expect(syncedTrade.syncedToJournal).toBe(true);

    const journalEntries = await listJournalEntries();
    expect(journalEntries).toHaveLength(1);
    expect(journalEntries[0].symbol).toBe('NAS100');
    expect(journalEntries[0].pnlAmount).toBe(trade.pnlAmount);
    expect(journalEntries[0].setupTag).toBe('NY Open Sweep');

    // Syncing again is idempotent and does not duplicate the journal entry
    await syncPaperTradeToJournal(trade.id);
    expect(await listJournalEntries()).toHaveLength(1);
  });

  it('deletes a wallet along with its positions/trades and never auto-reseeds when all wallets are deleted', async () => {
    const initial = await listPaperAccounts();
    expect(initial).toHaveLength(2);
    const [cryptoWallet, forexWallet] = initial;

    const pos = await placePaperOrder({
      accountId: cryptoWallet.id,
      symbol: 'BTCUSDT',
      assetClass: 'crypto',
      direction: 'long',
      orderType: 'market',
      currentMarketPrice: 60000,
      stopLoss: 59000,
      takeProfit: 62000,
      riskPercent: 1,
    });
    await closePositionAtMarket(pos.id, 61000, 'manual_close');

    // Add an open position too so both positions and trades exist on cryptoWallet
    await placePaperOrder({
      accountId: cryptoWallet.id,
      symbol: 'ETHUSDT',
      assetClass: 'crypto',
      direction: 'long',
      orderType: 'market',
      currentMarketPrice: 3000,
      stopLoss: 2950,
      takeProfit: 3100,
      riskPercent: 1,
    });

    expect(await listPaperPositions(cryptoWallet.id)).toHaveLength(1);
    expect(await listPaperTrades(cryptoWallet.id)).toHaveLength(1);

    await deletePaperAccount(cryptoWallet.id);

    const afterFirstDelete = await listPaperAccounts();
    expect(afterFirstDelete).toHaveLength(1);
    expect(afterFirstDelete[0].id).toBe(forexWallet.id);
    expect(await listPaperPositions(cryptoWallet.id)).toHaveLength(0);
    expect(await listPaperTrades(cryptoWallet.id)).toHaveLength(0);

    await deletePaperAccount(forexWallet.id);

    const afterDeleteAll = await listPaperAccounts();
    expect(afterDeleteAll).toEqual([]);
  });
});

describe('LanguageContext & taglishTranslations', () => {
  function LanguageProbe() {
    const { lang, isTaglish, toggleLang, t } = useLanguage();
    return (
      <div>
        <span data-testid="lang">{lang}</span>
        <span data-testid="is-taglish">{String(isTaglish)}</span>
        <span data-testid="translated">{t('Dashboard', 'Home')}</span>
        <button type="button" onClick={toggleLang}>
          Toggle Language
        </button>
      </div>
    );
  }

  it('persists language toggle to tradelab_lang_v1 and switches t() copy', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('is-taglish')).toHaveTextContent('false');
    expect(screen.getByTestId('translated')).toHaveTextContent('Dashboard');

    await user.click(screen.getByRole('button', { name: 'Toggle Language' }));

    expect(screen.getByTestId('lang')).toHaveTextContent('taglish');
    expect(screen.getByTestId('is-taglish')).toHaveTextContent('true');
    expect(screen.getByTestId('translated')).toHaveTextContent('Home');
    expect(window.localStorage.getItem('tradelab_lang_v1')).toBe('taglish');

    unmount();

    // Fresh provider restores persisted Taglish preference
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('taglish');
    expect(screen.getByTestId('translated')).toHaveTextContent('Home');
  });

  it('provides LESSON_TAGLISH_SUMMARIES for all 27 curriculum slugs', () => {
    expect(CURRICULUM_LESSONS).toHaveLength(27);
    const missingSlugs: string[] = [];

    for (const lesson of CURRICULUM_LESSONS) {
      const summary = LESSON_TAGLISH_SUMMARIES[lesson.slug];
      if (!summary || !summary.plainSummary.trim() || !summary.quickTakeaway.trim()) {
        missingSlugs.push(lesson.slug);
      }
    }

    expect(missingSlugs).toEqual([]);
  });
});

describe('PaperTradingPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders VIRTUAL DEMO badge, wallet switcher tabs, and Delete Wallet flow cleanly', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <PaperTradingPage />
      </LanguageProvider>,
    );

    expect(
      await screen.findByText('VIRTUAL DEMO — NOT REAL MONEY'),
    ).toBeInTheDocument();

    const cryptoTab = screen.getByRole('tab', { name: /Crypto Demo/i });
    const forexTab = screen.getByRole('tab', { name: /Forex Demo/i });
    expect(cryptoTab).toHaveAttribute('aria-selected', 'true');
    expect(forexTab).toHaveAttribute('aria-selected', 'false');

    // Switch to Forex Demo and verify selection updates
    await user.click(forexTab);
    expect(forexTab).toHaveAttribute('aria-selected', 'true');
    expect(cryptoTab).toHaveAttribute('aria-selected', 'false');

    // Delete Forex Demo via confirmation modal
    await user.click(screen.getByRole('button', { name: /Delete Wallet/i }));
    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /Delete Forex Demo\?/i }),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /^Delete Wallet$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('tab', { name: /Forex Demo/i })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('tab', { name: /Crypto Demo/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Delete the remaining Crypto Demo wallet and confirm clean empty state
    await user.click(screen.getByRole('button', { name: /Delete Wallet/i }));
    const secondDialog = await screen.findByRole('dialog');
    await user.click(within(secondDialog).getByRole('button', { name: /^Delete Wallet$/i }));

    expect(await screen.findByText('No Demo Wallets Yet')).toBeInTheDocument();
    expect(screen.getByText('VIRTUAL DEMO — NOT REAL MONEY')).toBeInTheDocument();
  }, 15000);
});
