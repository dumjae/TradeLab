import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  Plus,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { UI_COPY } from '../../data/taglishTranslations';
import { DEFAULT_FEE_SPREAD_BY_ASSET } from '../../lib/paperTradingEngine';
import type {
  CreatePaperAccountInput,
  PaperAccount,
  PaperPortfolioMetrics,
  PaperWalletMarketFocus,
  UpdatePaperAccountInput,
} from '../../types/paper-trading';

const MARKET_FOCUS_OPTIONS: Array<{
  id: Exclude<PaperWalletMarketFocus, 'custom_csv'>;
  label: string;
  defaultName: string;
}> = [
  { id: 'crypto', label: 'Crypto', defaultName: 'Crypto Demo' },
  { id: 'forex', label: 'Forex', defaultName: 'Forex Demo' },
  { id: 'indices', label: 'Indices', defaultName: 'Indices Demo' },
  { id: 'stocks', label: 'Stocks', defaultName: 'Stocks Demo' },
  { id: 'commodities', label: 'Commodities', defaultName: 'Gold & Metals Demo' },
  { id: 'all', label: 'All Markets', defaultName: 'All-Markets Demo' },
];

const STARTING_BALANCE_PRESETS: Array<{ value: number; label: string }> = [
  { value: 1000, label: '$1k' },
  { value: 5000, label: '$5k' },
  { value: 10000, label: '$10k' },
  { value: 50000, label: '$50k' },
  { value: 100000, label: '$100k' },
];

function formatMoney(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const absFormatted = Math.abs(safe).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return safe < 0 ? `-$${absFormatted}` : `$${absFormatted}`;
}

function formatSignedMoney(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  if (safe > 0) {
    return `+${formatMoney(safe)}`;
  }
  return formatMoney(safe);
}

function formatMarketFocusLabel(focus: PaperWalletMarketFocus): string {
  const found = MARKET_FOCUS_OPTIONS.find((item) => item.id === focus);
  return found ? found.label : 'All Markets';
}

export interface CreateWalletModalProps {
  open: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (input: CreatePaperAccountInput) => Promise<void>;
}

export function CreateWalletModal({
  open,
  submitting = false,
  onClose,
  onSubmit,
}: CreateWalletModalProps) {
  const { t } = useLanguage();
  const copy = UI_COPY.paperTrading;

  const [marketFocus, setMarketFocus] =
    useState<Exclude<PaperWalletMarketFocus, 'custom_csv'>>('crypto');
  const [accountName, setAccountName] = useState('Crypto Demo');
  const [nameTouched, setNameTouched] = useState(false);
  const [startingBalance, setStartingBalance] = useState('10000');
  const [maxRiskPct, setMaxRiskPct] = useState('1');
  const [dailyLossLimitPct, setDailyLossLimitPct] = useState('3');
  const [simulateFeesSpread, setSimulateFeesSpread] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, submitting, onClose]);

  if (!open) {
    return null;
  }

  const handleFocusSelect = (nextFocus: Exclude<PaperWalletMarketFocus, 'custom_csv'>) => {
    setMarketFocus(nextFocus);
    if (!nameTouched) {
      const preset = MARKET_FOCUS_OPTIONS.find((item) => item.id === nextFocus);
      if (preset) {
        setAccountName(preset.defaultName);
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedName = accountName.trim();
    const balanceNum = Number(startingBalance);
    const riskNum = Number(maxRiskPct);
    const dailyLimitNum = Number(dailyLossLimitPct);

    if (!trimmedName) {
      setError(t('Please enter a wallet name.', 'Maglagay ng pangalan ng wallet.'));
      return;
    }
    if (!Number.isFinite(balanceNum) || balanceNum <= 0) {
      setError(
        t(
          'Starting balance must be greater than $0.',
          'Dapat mas mataas sa $0 ang starting balance.',
        ),
      );
      return;
    }

    const defaultProfile =
      marketFocus === 'all'
        ? DEFAULT_FEE_SPREAD_BY_ASSET.crypto
        : DEFAULT_FEE_SPREAD_BY_ASSET[marketFocus];

    try {
      await onSubmit({
        accountName: trimmedName,
        marketFocus,
        startingBalance: balanceNum,
        maxRiskPerTradePct: Number.isFinite(riskNum) && riskNum > 0 ? riskNum : 1,
        dailyLossLimitPct:
          Number.isFinite(dailyLimitNum) && dailyLimitNum > 0 ? dailyLimitNum : 3,
        simulateFeesSpread,
        feeRateBps: defaultProfile.feeRateBps,
        spreadBps: defaultProfile.spreadBps,
      });
      setNameTouched(false);
      setAccountName('Crypto Demo');
      setMarketFocus('crypto');
      setStartingBalance('10000');
      setMaxRiskPct('1');
      setDailyLossLimitPct('3');
      setSimulateFeesSpread(true);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create demo wallet.');
    }
  };

  const parsedBalance = Number(startingBalance);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-wallet-modal-title"
    >
      <button
        type="button"
        aria-label="Close create wallet dialog"
        disabled={submitting}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-terminal-border bg-terminal-surface p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="create-wallet-modal-title"
              className="text-base font-semibold text-terminal-text"
            >
              {t(copy.createWalletTitle.en, copy.createWalletTitle.taglish)}
            </h2>
            <p className="mt-0.5 text-xs text-terminal-muted">
              {t(
                'Keep separate virtual balances for each market you practice.',
                'Hiwalay na virtual balance para sa bawat market na pina-practice mo.',
              )}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close create wallet modal"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-text"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label
              htmlFor="new-wallet-name"
              className="block text-xs font-medium text-terminal-text"
            >
              {t('Wallet Name', 'Pangalan ng Wallet')}
            </label>
            <input
              id="new-wallet-name"
              name="walletName"
              aria-label="Demo wallet name"
              type="text"
              maxLength={40}
              value={accountName}
              onChange={(event) => {
                setAccountName(event.target.value);
                setNameTouched(true);
              }}
              placeholder="e.g., Crypto Scalping Demo"
              className="mt-1 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 text-sm text-terminal-text placeholder:text-terminal-muted focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <span className="block text-xs font-medium text-terminal-text">
              {t('Market Focus', 'Piling Market')}
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {MARKET_FOCUS_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleFocusSelect(option.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    marketFocus === option.id
                      ? 'bg-brand text-brand-fg shadow-sm'
                      : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="new-wallet-balance"
              className="block text-xs font-medium text-terminal-text"
            >
              {t('Starting Virtual Balance (USD)', 'Panimulang Virtual Balance (USD)')}
            </label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {STARTING_BALANCE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setStartingBalance(String(preset.value))}
                  className={`rounded-full px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                    parsedBalance === preset.value
                      ? 'border border-brand bg-brand-soft text-brand'
                      : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              id="new-wallet-balance"
              name="startingBalance"
              aria-label="Starting virtual balance"
              type="number"
              min="100"
              step="100"
              value={startingBalance}
              onChange={(event) => setStartingBalance(event.target.value)}
              className="mt-2 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-terminal-text tabular-nums focus:border-brand focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-wallet-risk"
                className="block text-xs font-medium text-terminal-text"
              >
                {t('Default Risk %', 'Default Risk %')}
              </label>
              <input
                id="new-wallet-risk"
                name="maxRiskPerTradePct"
                aria-label="Default risk percent per trade"
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={maxRiskPct}
                onChange={(event) => setMaxRiskPct(event.target.value)}
                className="mt-1 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-terminal-text tabular-nums focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="new-wallet-daily-limit"
                className="block text-xs font-medium text-terminal-text"
              >
                {t('Daily Loss Limit %', 'Daily Loss Limit %')}
              </label>
              <input
                id="new-wallet-daily-limit"
                name="dailyLossLimitPct"
                aria-label="Daily loss limit percent"
                type="number"
                min="0.5"
                max="25"
                step="0.5"
                value={dailyLossLimitPct}
                onChange={(event) => setDailyLossLimitPct(event.target.value)}
                className="mt-1 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-terminal-text tabular-nums focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-terminal-border bg-terminal-bg/80 px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-terminal-text">
                {t(copy.feesSpreadToggle.en, copy.feesSpreadToggle.taglish)}
              </p>
              <p className="text-[11px] text-terminal-muted">
                {simulateFeesSpread
                  ? t(copy.feesSpreadOnNote.en, copy.feesSpreadOnNote.taglish)
                  : t(copy.feesSpreadOffNote.en, copy.feesSpreadOffNote.taglish)}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={simulateFeesSpread}
              aria-label="Toggle realistic fees and spread simulation"
              onClick={() => setSimulateFeesSpread((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                simulateFeesSpread ? 'bg-bull' : 'bg-terminal-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  simulateFeesSpread ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {error && (
            <p role="alert" className="text-xs font-medium text-bear">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-muted transition-colors hover:text-terminal-text"
            >
              {t('Cancel', 'Kanselahin')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-brand-fg shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              {submitting
                ? t('Creating…', 'Ginagawa…')
                : t(copy.createFirstWallet.en, copy.createFirstWallet.taglish)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export interface DemoAccountHeaderProps {
  accounts: PaperAccount[];
  activeAccount: PaperAccount;
  accountEquityMap: Record<string, number>;
  metrics: PaperPortfolioMetrics;
  busy?: boolean;
  onSelectAccount: (accountId: string) => void;
  onCreateAccount: (input: CreatePaperAccountInput) => Promise<void>;
  onUpdateAccount: (accountId: string, patch: UpdatePaperAccountInput) => Promise<void>;
  onResetAccount: (accountId: string) => Promise<void>;
  onDeleteAccount: (accountId: string) => Promise<void>;
}

export function DemoAccountHeader({
  accounts,
  activeAccount,
  accountEquityMap,
  metrics,
  busy = false,
  onSelectAccount,
  onCreateAccount,
  onUpdateAccount,
  onResetAccount,
  onDeleteAccount,
}: DemoAccountHeaderProps) {
  const { t } = useLanguage();
  const copy = UI_COPY.paperTrading;

  const [createOpen, setCreateOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    if (!resetConfirmOpen && !deleteConfirmOpen) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !actionBusy) {
        setResetConfirmOpen(false);
        setDeleteConfirmOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetConfirmOpen, deleteConfirmOpen, actionBusy]);

  const dailyLimitProgress =
    activeAccount.dailyLossLimitPct > 0
      ? Math.min(100, Math.round((metrics.todayLossPct / activeAccount.dailyLossLimitPct) * 100))
      : 0;

  const handleToggleFees = async () => {
    if (busy || actionBusy) return;
    setActionBusy(true);
    try {
      await onUpdateAccount(activeAccount.id, {
        simulateFeesSpread: !activeAccount.simulateFeesSpread,
      });
    } finally {
      setActionBusy(false);
    }
  };

  const handleConfirmReset = async () => {
    setActionBusy(true);
    try {
      await onResetAccount(activeAccount.id);
      setResetConfirmOpen(false);
    } finally {
      setActionBusy(false);
    }
  };

  const handleConfirmDelete = async () => {
    setActionBusy(true);
    try {
      await onDeleteAccount(activeAccount.id);
      setDeleteConfirmOpen(false);
    } finally {
      setActionBusy(false);
    }
  };

  const isDisabled = busy || actionBusy;

  return (
    <section
      aria-label="Demo wallets and account overview"
      className="space-y-3.5 rounded-xl border border-terminal-border bg-terminal-surface p-4"
    >
      {/* Top Row: Virtual Demo Pill + Wallet Controls */}
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-wisdom/40 bg-amber-wisdom/10 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-amber-700 dark:text-amber-300">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-wisdom" aria-hidden="true" />
            VIRTUAL DEMO — NOT REAL MONEY
          </span>
          <h1 className="text-base font-bold tracking-tight text-terminal-text sm:text-lg">
            {t(copy.pageTitle.en, copy.pageTitle.taglish)}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleToggleFees}
            aria-pressed={activeAccount.simulateFeesSpread}
            title={
              activeAccount.simulateFeesSpread
                ? t(copy.feesSpreadOnNote.en, copy.feesSpreadOnNote.taglish)
                : t(copy.feesSpreadOffNote.en, copy.feesSpreadOffNote.taglish)
            }
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
              activeAccount.simulateFeesSpread
                ? 'border-bull/40 bg-bull/10 text-bull'
                : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {t('Fees & Spread', 'Fee & Spread')}:{' '}
              {activeAccount.simulateFeesSpread ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            disabled={isDisabled}
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-xs font-semibold text-terminal-muted transition-colors hover:border-brand/50 hover:text-terminal-text disabled:opacity-60"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t(copy.resetWallet.en, copy.resetWallet.taglish)}
          </button>

          <button
            type="button"
            disabled={isDisabled}
            onClick={() => setDeleteConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-bear/35 bg-bear/10 px-2.5 py-1.5 text-xs font-semibold text-bear transition-colors hover:bg-bear/15 disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            {t(copy.deleteWallet.en, copy.deleteWallet.taglish)}
          </button>
        </div>
      </div>

      {/* Separate Demo Wallet Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <div
          role="tablist"
          aria-label="Demo wallets"
          className="flex items-center gap-1.5"
        >
          {accounts.map((wallet) => {
            const isActive = wallet.id === activeAccount.id;
            const liveEquity = accountEquityMap[wallet.id] ?? wallet.cashBalance;
            return (
              <button
                key={wallet.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectAccount(wallet.id)}
                className={`group inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-left transition-colors ${
                  isActive
                    ? 'border-brand bg-brand-soft text-terminal-text'
                    : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-brand/40 hover:text-terminal-text'
                }`}
              >
                <Wallet
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isActive ? 'text-brand-text' : 'text-terminal-muted'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold">{wallet.accountName}</span>
                <span className="rounded border border-terminal-border bg-terminal-surface px-1.5 py-0.5 text-[10px] font-medium text-terminal-muted">
                  {formatMarketFocusLabel(wallet.marketFocus)}
                </span>
                <span className="font-mono text-xs font-semibold text-terminal-text tabular-nums">
                  {formatMoney(liveEquity)}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          disabled={isDisabled}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-dashed border-brand/50 bg-terminal-bg px-3 py-1.5 text-xs font-semibold text-brand-text transition-colors hover:bg-brand-soft disabled:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {t(copy.newWallet.en, copy.newWallet.taglish)}
        </button>
      </div>

      {/* Compact 4-Tile KPI Strip */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <div className="rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2.5">
          <p className="text-[11px] font-medium text-terminal-muted">
            {t('Equity', 'Kabuuang Equity')}
          </p>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <span className="font-mono text-base font-bold text-terminal-text tabular-nums">
              {formatMoney(metrics.equity)}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${
                metrics.totalReturnPct >= 0
                  ? 'bg-bull/15 text-bull'
                  : 'bg-bear/15 text-bear'
              }`}
            >
              {metrics.totalReturnPct >= 0 ? '+' : ''}
              {metrics.totalReturnPct.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2.5">
          <p className="text-[11px] font-medium text-terminal-muted">
            {t('Cash Balance', 'Cash Balance')}
          </p>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <span className="font-mono text-base font-bold text-terminal-text tabular-nums">
              {formatMoney(metrics.cashBalance)}
            </span>
            <span className="font-mono text-[11px] text-terminal-muted tabular-nums">
              {metrics.totalTrades} {t('trades', 'trades')}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2.5">
          <p className="text-[11px] font-medium text-terminal-muted">
            {t('Floating P&L (Profit & Loss)', 'Floating P&L (Profit & Loss)')}
          </p>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <span
              className={`font-mono text-base font-bold tabular-nums ${
                metrics.unrealizedPnl > 0
                  ? 'text-bull'
                  : metrics.unrealizedPnl < 0
                    ? 'text-bear'
                    : 'text-terminal-text'
              }`}
            >
              {formatSignedMoney(metrics.unrealizedPnl)}
            </span>
            <span className="text-[10px] text-terminal-muted">
              {activeAccount.simulateFeesSpread
                ? t('Net of fees', 'May fee/spread')
                : t('Clean mode', 'Walang fee')}
            </span>
          </div>
        </div>

        <div
          className={`rounded-lg border px-3 py-2.5 ${
            metrics.dailyLossLimitReached
              ? 'border-amber-wisdom/45 bg-amber-wisdom/10'
              : 'border-terminal-border bg-terminal-bg'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium text-terminal-muted">
              {t('Daily Loss Limit', 'Daily Loss Limit')}
            </p>
            <span
              className={`font-mono text-[11px] font-semibold tabular-nums ${
                metrics.dailyLossLimitReached
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-terminal-text'
              }`}
            >
              {metrics.todayLossPct.toFixed(1)}% / {activeAccount.dailyLossLimitPct}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-terminal-border">
            <div
              className={`h-full rounded-full transition-all ${
                metrics.dailyLossLimitReached
                  ? 'bg-amber-wisdom'
                  : dailyLimitProgress >= 65
                    ? 'bg-amber-wisdom'
                    : 'bg-bull'
              }`}
              style={{ width: `${dailyLimitProgress}%` }}
            />
          </div>
        </div>
      </div>

      {metrics.dailyLossLimitReached && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-amber-wisdom/40 bg-amber-wisdom/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-wisdom" aria-hidden="true" />
          <span>{t(copy.dailyLossWarning.en, copy.dailyLossWarning.taglish)}</span>
        </div>
      )}

      {/* Create New Wallet Modal */}
      <CreateWalletModal
        open={createOpen}
        submitting={actionBusy}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (input) => {
          setActionBusy(true);
          try {
            await onCreateAccount(input);
          } finally {
            setActionBusy(false);
          }
        }}
      />

      {/* Reset Wallet Confirmation Modal */}
      {resetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-wallet-title"
        >
          <button
            type="button"
            aria-label="Close reset wallet dialog"
            disabled={actionBusy}
            onClick={() => setResetConfirmOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-terminal-border bg-terminal-surface p-5 shadow-xl">
            <h2 id="reset-wallet-title" className="text-base font-semibold text-terminal-text">
              {t(`Reset ${activeAccount.accountName}?`, `I-reset ang ${activeAccount.accountName}?`)}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-terminal-muted">
              {t(
                `Restores cash balance to ${formatMoney(activeAccount.startingBalance)} and clears open positions and trade history in this wallet.`,
                `Ibabalik ang balance sa ${formatMoney(activeAccount.startingBalance)} at buburahin ang open positions at history ng wallet na ito.`,
              )}
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={actionBusy}
                onClick={() => setResetConfirmOpen(false)}
                className="rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-muted hover:text-terminal-text"
              >
                {t('Cancel', 'Kanselahin')}
              </button>
              <button
                type="button"
                disabled={actionBusy}
                onClick={handleConfirmReset}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg hover:opacity-90 disabled:opacity-60"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {actionBusy
                  ? t('Resetting…', 'Nire-reset…')
                  : t(copy.resetWallet.en, copy.resetWallet.taglish)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Wallet Confirmation Modal */}
      {deleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-wallet-title"
        >
          <button
            type="button"
            aria-label="Close delete wallet dialog"
            disabled={actionBusy}
            onClick={() => setDeleteConfirmOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-bear/35 bg-terminal-surface p-5 shadow-xl">
            <h2 id="delete-wallet-title" className="text-base font-semibold text-terminal-text">
              {t(
                `Delete ${activeAccount.accountName}?`,
                `Burahin ang ${activeAccount.accountName}?`,
              )}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-terminal-muted">
              {t(
                `Delete ${activeAccount.accountName}? This removes its balance, open positions, and trade history.`,
                `Burahin ang ${activeAccount.accountName}? Mawawala ang balance, open positions, at trade history nito.`,
              )}
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={actionBusy}
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-xl border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-semibold text-terminal-muted hover:text-terminal-text"
              >
                {t('Cancel', 'Kanselahin')}
              </button>
              <button
                type="button"
                disabled={actionBusy}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-bear px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {actionBusy
                  ? t('Deleting…', 'Binubura…')
                  : t(copy.deleteWallet.en, copy.deleteWallet.taglish)}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
