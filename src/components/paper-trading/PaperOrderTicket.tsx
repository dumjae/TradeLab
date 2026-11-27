import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { UI_COPY } from '../../data/taglishTranslations';
import { expandAcronyms } from '../../lib/acronymHelper';
import { calculateOrderPreview } from '../../lib/paperTradingEngine';
import type { MarketSymbolOption } from '../../types/backtest';
import type {
  PaperAccount,
  PaperDirection,
  PaperOrderType,
  PlacePaperOrderInput,
} from '../../types/paper-trading';

const RISK_PRESETS = [0.5, 1, 2];
const SL_PCT_PRESETS = [0.5, 1, 2];

const SETUP_TAG_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'Optional Setup Tag' },
  { value: 'BOS (Break of Structure) Pullback', label: 'BOS (Break of Structure) Pullback' },
  { value: 'Liquidity Sweep', label: 'Liquidity Sweep' },
  { value: 'FVG (Fair Value Gap) Entry', label: 'FVG (Fair Value Gap) Entry' },
  { value: 'Support/Resistance Bounce', label: 'Support/Resistance Bounce' },
  { value: 'Breakout', label: 'Breakout' },
];

const PRE_TRADE_RULES: Array<{ id: string; en: string; taglish: string }> = [
  {
    id: 'htf-trend',
    en: 'Aligned with HTF (Higher Timeframe) trend',
    taglish: 'Sumasabay sa HTF (Higher Timeframe) trend',
  },
  {
    id: 'key-zone',
    en: 'Entry at key zone or FVG (Fair Value Gap)',
    taglish: 'Entry sa malinaw na zone o FVG (Fair Value Gap)',
  },
  {
    id: 'sl-invalidation',
    en: 'SL (Stop Loss) placed at clear invalidation',
    taglish: 'May malinaw na SL (Stop Loss) invalidation',
  },
  {
    id: 'min-rr',
    en: 'At least 1:2 RR (Risk-to-Reward Ratio)',
    taglish: 'Minimum 1:2 RR (Risk-to-Reward Ratio)',
  },
  {
    id: 'calm-mindset',
    en: 'Calm mindset — no FOMO (Fear of Missing Out)',
    taglish: 'Kalmado — walang FOMO (Fear of Missing Out)',
  },
];

function formatPriceValue(value: number, decimals: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return '';
  }
  return value.toFixed(decimals);
}

function formatMoney(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const abs = Math.abs(safe).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return safe < 0 ? `-$${abs}` : `$${abs}`;
}

function formatUnits(units: number): string {
  if (!Number.isFinite(units) || units <= 0) return '0';
  if (units >= 1000) {
    return units.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (units >= 1) {
    return units.toLocaleString('en-US', { maximumFractionDigits: 4 });
  }
  return units.toFixed(6);
}

export interface PaperOrderTicketProps {
  account: PaperAccount;
  symbolOption: MarketSymbolOption;
  currentPrice: number;
  dailyLossLimitReached: boolean;
  submitting: boolean;
  onPlaceOrder: (input: Omit<PlacePaperOrderInput, 'accountId'>) => Promise<void>;
}

export function PaperOrderTicket({
  account,
  symbolOption,
  currentPrice,
  dailyLossLimitReached,
  submitting,
  onPlaceOrder,
}: PaperOrderTicketProps) {
  const { t } = useLanguage();
  const copy = UI_COPY.paperTrading;
  const decimals = symbolOption.decimals;

  const [orderType, setOrderType] = useState<PaperOrderType>('market');
  const [direction, setDirection] = useState<PaperDirection>('long');
  const [limitPriceInput, setLimitPriceInput] = useState('');
  const [stopLossInput, setStopLossInput] = useState('');
  const [takeProfitInput, setTakeProfitInput] = useState('');
  const [riskPctInput, setRiskPctInput] = useState(() =>
    String(account.maxRiskPerTradePct || 1),
  );
  const [setupTag, setSetupTag] = useState('');
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>({});
  const [dailyLimitAcknowledged, setDailyLimitAcknowledged] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const lastSeedKeyRef = useRef<string>('');

  // Keep risk % synced when switching demo wallets
  useEffect(() => {
    setRiskPctInput(String(account.maxRiskPerTradePct || 1));
    setDailyLimitAcknowledged(false);
  }, [account.id, account.maxRiskPerTradePct]);

  // Seed clean default SL (1%) & TP (2x RR) whenever symbol or direction changes
  useEffect(() => {
    if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
      return;
    }
    const seedKey = `${symbolOption.symbol}:${direction}`;
    if (lastSeedKeyRef.current === seedKey) {
      return;
    }
    lastSeedKeyRef.current = seedKey;

    const slFactor = direction === 'long' ? 0.99 : 1.01;
    const tpFactor = direction === 'long' ? 1.02 : 0.98;
    const limitFactor = direction === 'long' ? 0.995 : 1.005;

    setLimitPriceInput(formatPriceValue(currentPrice * limitFactor, decimals));
    setStopLossInput(formatPriceValue(currentPrice * slFactor, decimals));
    setTakeProfitInput(formatPriceValue(currentPrice * tpFactor, decimals));
    setSubmitError(null);
  }, [symbolOption.symbol, direction, currentPrice, decimals]);

  const referenceEntryPrice = useMemo(() => {
    if (orderType === 'limit') {
      const parsed = Number(limitPriceInput);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : currentPrice;
    }
    return currentPrice;
  }, [orderType, limitPriceInput, currentPrice]);

  const parsedLimit = Number(limitPriceInput);
  const parsedSl = Number(stopLossInput);
  const parsedTp = takeProfitInput.trim() === '' ? null : Number(takeProfitInput);
  const parsedRisk = Number(riskPctInput);

  const preview = useMemo(
    () =>
      calculateOrderPreview(account, {
        symbol: symbolOption.symbol,
        assetClass: symbolOption.assetClass,
        direction,
        orderType,
        currentMarketPrice: currentPrice,
        limitPrice: orderType === 'limit' ? parsedLimit : undefined,
        stopLoss: parsedSl,
        takeProfit: parsedTp !== null && Number.isFinite(parsedTp) ? parsedTp : null,
        riskPercent: parsedRisk,
        setupTag,
      }),
    [
      account,
      symbolOption.symbol,
      symbolOption.assetClass,
      direction,
      orderType,
      currentPrice,
      parsedLimit,
      parsedSl,
      parsedTp,
      parsedRisk,
      setupTag,
    ],
  );

  const applyStopLossPercent = (pct: number) => {
    if (!Number.isFinite(referenceEntryPrice) || referenceEntryPrice <= 0) return;
    const ratio = pct / 100;
    const nextSl =
      direction === 'long'
        ? referenceEntryPrice * (1 - ratio)
        : referenceEntryPrice * (1 + ratio);
    setStopLossInput(formatPriceValue(nextSl, decimals));
  };

  const applyRewardRatio = (rrMultiplier: number) => {
    if (!Number.isFinite(referenceEntryPrice) || referenceEntryPrice <= 0) return;
    if (!Number.isFinite(parsedSl) || parsedSl <= 0) return;
    const stopDist = Math.abs(referenceEntryPrice - parsedSl);
    if (stopDist <= 0) return;
    const nextTp =
      direction === 'long'
        ? referenceEntryPrice + stopDist * rrMultiplier
        : Math.max(symbolOption.pipStep, referenceEntryPrice - stopDist * rrMultiplier);
    setTakeProfitInput(formatPriceValue(nextTp, decimals));
  };

  const checkedCount = PRE_TRADE_RULES.filter((rule) => checkedRules[rule.id]).length;
  const blockedByDailyLimit = dailyLossLimitReached && !dailyLimitAcknowledged;
  const canSubmit = preview.valid && !submitting && !blockedByDailyLimit;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!preview.valid) {
      setSubmitError(expandAcronyms(preview.error ?? 'Check your order prices.'));
      return;
    }
    if (blockedByDailyLimit) {
      setSubmitError(t(copy.dailyLossWarning.en, copy.dailyLossWarning.taglish));
      return;
    }

    try {
      await onPlaceOrder({
        symbol: symbolOption.symbol,
        assetClass: symbolOption.assetClass,
        direction,
        orderType,
        currentMarketPrice: currentPrice,
        limitPrice: orderType === 'limit' ? parsedLimit : undefined,
        stopLoss: parsedSl,
        takeProfit: parsedTp !== null && Number.isFinite(parsedTp) ? parsedTp : null,
        riskPercent: parsedRisk,
        setupTag,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? expandAcronyms(err.message) : 'Unable to place demo order.',
      );
    }
  };

  return (
    <aside
      aria-label="Paper trading order ticket"
      className="rounded-2xl border border-terminal-border bg-terminal-surface p-4 shadow-sm"
    >
      {/* Header + Live Price Badge */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-terminal-border/80">
        <div>
          <h2 className="text-sm font-bold text-terminal-text">
            {t('Order Ticket', 'Demo Order Ticket')}
          </h2>
          <p className="text-[11px] text-terminal-muted">{symbolOption.symbol}</p>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-bg px-2.5 py-1 text-right">
          <span className="block text-[10px] font-medium uppercase tracking-wide text-terminal-muted">
            {t('Live Price', 'Presyo Ngayon')}
          </span>
          <span className="font-mono text-sm font-bold text-terminal-text tabular-nums">
            {currentPrice > 0 ? formatPriceValue(currentPrice, decimals) : '—'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        {/* Market vs Limit Segmented Toggle */}
        <div
          role="group"
          aria-label="Order execution type"
          className="grid grid-cols-2 gap-1 rounded-xl border border-terminal-border bg-terminal-bg p-1"
        >
          <button
            type="button"
            aria-pressed={orderType === 'market'}
            onClick={() => setOrderType('market')}
            className={`rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              orderType === 'market'
                ? 'bg-terminal-surface text-terminal-text shadow-sm'
                : 'text-terminal-muted hover:text-terminal-text'
            }`}
          >
            {t('Market (Now)', copy.marketOrder.taglish)}
          </button>
          <button
            type="button"
            aria-pressed={orderType === 'limit'}
            onClick={() => setOrderType('limit')}
            className={`rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              orderType === 'limit'
                ? 'bg-terminal-surface text-terminal-text shadow-sm'
                : 'text-terminal-muted hover:text-terminal-text'
            }`}
          >
            {t('Limit (Wait)', copy.limitOrder.taglish)}
          </button>
        </div>

        {/* Buy / Long vs Sell / Short Toggle */}
        <div role="group" aria-label="Trade direction" className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={direction === 'long'}
            onClick={() => setDirection('long')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-colors ${
              direction === 'long'
                ? 'border-bull bg-bull text-white shadow-sm'
                : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-bull/50 hover:text-bull'
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            {t(copy.buyLong.en, copy.buyLong.taglish)}
          </button>

          <button
            type="button"
            aria-pressed={direction === 'short'}
            onClick={() => setDirection('short')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-colors ${
              direction === 'short'
                ? 'border-bear bg-bear text-white shadow-sm'
                : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:border-bear/50 hover:text-bear'
            }`}
          >
            <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
            {t(copy.sellShort.en, copy.sellShort.taglish)}
          </button>
        </div>

        {/* Limit Entry Input (only when Limit order) */}
        {orderType === 'limit' && (
          <div>
            <label
              htmlFor="order-limit-price"
              className="block text-[11px] font-semibold text-terminal-text"
            >
              {t('Limit Entry Price', 'Target na Limit Entry')}
            </label>
            <input
              id="order-limit-price"
              name="limitPrice"
              aria-label="Limit entry price"
              type="number"
              step="any"
              value={limitPriceInput}
              onChange={(event) => setLimitPriceInput(event.target.value)}
              className="mt-1 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text tabular-nums focus:border-brand focus:outline-none"
            />
          </div>
        )}

        {/* SL (Stop Loss — Safety Net) */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="order-stop-loss"
              className="text-[11px] font-semibold text-terminal-text"
            >
              {t('SL (Stop Loss — Safety Net)', copy.stopLossLabel.taglish)}
            </label>
            <div className="flex items-center gap-1">
              {SL_PCT_PRESETS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyStopLossPercent(pct)}
                  className="rounded-md border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold text-terminal-muted transition-colors hover:border-bear/50 hover:text-bear"
                >
                  {direction === 'long' ? '-' : '+'}
                  {pct}%
                </button>
              ))}
            </div>
          </div>
          <input
            id="order-stop-loss"
            name="stopLoss"
            aria-label="Stop Loss price"
            type="number"
            step="any"
            required
            value={stopLossInput}
            onChange={(event) => setStopLossInput(event.target.value)}
            className="mt-1 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text tabular-nums focus:border-bear focus:outline-none"
          />
        </div>

        {/* TP (Take Profit — Target) */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="order-take-profit"
              className="text-[11px] font-semibold text-terminal-text"
            >
              {t('TP (Take Profit — Target)', copy.takeProfitLabel.taglish)}
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyRewardRatio(2)}
                title="Set TP to 1:2 RR (Risk-to-Reward Ratio)"
                className="rounded-md border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold text-bull transition-colors hover:border-bull/60 hover:bg-bull/10"
              >
                1:2 RR
              </button>
              <button
                type="button"
                onClick={() => applyRewardRatio(3)}
                title="Set TP to 1:3 RR (Risk-to-Reward Ratio)"
                className="rounded-md border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold text-bull transition-colors hover:border-bull/60 hover:bg-bull/10"
              >
                1:3 RR
              </button>
            </div>
          </div>
          <input
            id="order-take-profit"
            name="takeProfit"
            aria-label="Take Profit price"
            type="number"
            step="any"
            value={takeProfitInput}
            onChange={(event) => setTakeProfitInput(event.target.value)}
            placeholder={t('Optional target price', 'Opsyonal na target')}
            className="mt-1 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-text tabular-nums placeholder:text-terminal-muted focus:border-bull focus:outline-none"
          />
        </div>

        {/* Risk % + Setup Tag */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between gap-1">
              <label
                htmlFor="order-risk-pct"
                className="text-[11px] font-semibold text-terminal-text"
              >
                {t('Risk %', 'Risk %')}
              </label>
              <div className="flex items-center gap-1">
                {RISK_PRESETS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setRiskPctInput(String(pct))}
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold transition-colors ${
                      parsedRisk === pct
                        ? 'bg-brand text-brand-fg'
                        : 'border border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
            <input
              id="order-risk-pct"
              name="riskPercent"
              aria-label="Risk percent per trade"
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={riskPctInput}
              onChange={(event) => setRiskPctInput(event.target.value)}
              className="mt-1 w-full rounded-xl border border-terminal-border bg-terminal-bg px-3 py-1.5 font-mono text-xs text-terminal-text tabular-nums focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="order-setup-tag"
              className="block text-[11px] font-semibold text-terminal-text"
            >
              {t('Setup Tag', 'Setup Tag')}
            </label>
            <select
              id="order-setup-tag"
              name="setupTag"
              aria-label="Setup tag"
              value={setupTag}
              onChange={(event) => setSetupTag(event.target.value)}
              className="mt-1 w-full rounded-xl border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-xs text-terminal-text focus:border-brand focus:outline-none"
            >
              {SETUP_TAG_OPTIONS.map((option) => (
                <option key={option.value || 'none'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compact Live Preview Box */}
        <div className="rounded-xl border border-terminal-border bg-terminal-bg/85 p-3">
          {preview.valid ? (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-terminal-muted">
                  {t('Position Size (Units)', 'Laki ng Posisyon (Units)')}
                </span>
                <span className="font-mono font-semibold text-terminal-text tabular-nums">
                  {formatUnits(preview.units)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-terminal-muted">
                  {t('Risk Amount (SL)', 'Risk sa SL (Stop Loss)')}
                </span>
                <span className="font-mono font-semibold text-bear tabular-nums">
                  -{formatMoney(preview.riskAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-terminal-muted">
                  {t('Potential Reward (RR)', 'Target na Kita (RR)')}
                </span>
                <span className="font-mono font-semibold text-bull tabular-nums">
                  {preview.rewardAmount !== null && preview.rrRatio !== null
                    ? `+${formatMoney(preview.rewardAmount)} (${preview.rrRatio.toFixed(2)}R)`
                    : t('No TP (Take Profit) set', 'Walang TP (Take Profit)')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-terminal-border/70 pt-1.5">
                <span className="inline-flex items-center gap-1 text-terminal-muted">
                  <Info className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {t('Est. Fee & Spread', 'Fee at Spread')}
                </span>
                {account.simulateFeesSpread ? (
                  <span className="text-right font-mono text-[11px] font-medium text-amber-700 tabular-nums dark:text-amber-300">
                    -{formatMoney(preview.estimatedTotalCost)}
                    <span className="block text-[10px] font-normal text-terminal-muted">
                      Fee {formatMoney(preview.estimatedTotalFees)} + Spread{' '}
                      {formatMoney(preview.estimatedSpreadCost)}
                    </span>
                  </span>
                ) : (
                  <span className="font-mono text-[11px] font-medium text-terminal-muted">
                    $0 (Clean Mode)
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p role="status" className="flex items-start gap-1.5 text-xs text-bear">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{expandAcronyms(preview.error ?? 'Check your order prices.')}</span>
            </p>
          )}
        </div>

        {/* Collapsible 5-Rule Pre-Trade Check (collapsed by default) */}
        <div className="rounded-xl border border-terminal-border/80 bg-terminal-bg/60">
          <button
            type="button"
            aria-expanded={checklistOpen}
            onClick={() => setChecklistOpen((prev) => !prev)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-terminal-text transition-colors hover:text-brand"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              {t('5-Rule Pre-Trade Check', '5-Rule Checklist Bago Pumasok')} ({checkedCount}/5)
            </span>
            {checklistOpen ? (
              <ChevronUp className="h-3.5 w-3.5 text-terminal-muted" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-terminal-muted" aria-hidden="true" />
            )}
          </button>

          {checklistOpen && (
            <div className="space-y-1.5 border-t border-terminal-border/70 px-3 py-2.5">
              {PRE_TRADE_RULES.map((rule) => (
                <label
                  key={rule.id}
                  htmlFor={`precheck-${rule.id}`}
                  className="flex cursor-pointer items-start gap-2 text-[11px] text-terminal-muted hover:text-terminal-text"
                >
                  <input
                    id={`precheck-${rule.id}`}
                    name={`precheck_${rule.id}`}
                    aria-label={rule.en}
                    type="checkbox"
                    checked={Boolean(checkedRules[rule.id])}
                    onChange={(event) =>
                      setCheckedRules((prev) => ({
                        ...prev,
                        [rule.id]: event.target.checked,
                      }))
                    }
                    className="mt-0.5 h-3.5 w-3.5 rounded border-terminal-border accent-brand"
                  />
                  <span>{t(rule.en, rule.taglish)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Calm Amber Daily Loss Limit Guardrail */}
        {dailyLossLimitReached && (
          <div className="space-y-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <span>{t(copy.dailyLossWarning.en, copy.dailyLossWarning.taglish)}</span>
            </div>
            <label
              htmlFor="ack-daily-loss-limit"
              className="flex cursor-pointer items-center gap-2 text-[11px] font-medium"
            >
              <input
                id="ack-daily-loss-limit"
                name="acknowledgeDailyLossLimit"
                aria-label="Acknowledge daily loss limit to continue practicing"
                type="checkbox"
                checked={dailyLimitAcknowledged}
                onChange={(event) => setDailyLimitAcknowledged(event.target.checked)}
                className="h-3.5 w-3.5 rounded border-amber-500/50 accent-brand"
              />
              <span>
                {t(
                  'I reviewed my trades and want to keep practicing.',
                  'Na-review ko na ang trades ko at gusto kong magpatuloy.',
                )}
              </span>
            </label>
          </div>
        )}

        {submitError && (
          <p role="alert" className="text-xs font-medium text-bear">
            {submitError}
          </p>
        )}

        {/* Primary Submit CTA */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
            direction === 'long' ? 'bg-bull' : 'bg-bear'
          }`}
        >
          {submitting
            ? t('Placing Virtual Order…', 'Inilalagay ang Order…')
            : direction === 'long'
              ? t('Place Virtual Buy / Long', 'Ilagay ang Virtual Buy / Long')
              : t('Place Virtual Sell / Short', 'Ilagay ang Virtual Sell / Short')}
        </button>

        {blockedByDailyLimit && (
          <p className="text-center text-[11px] text-amber-700 dark:text-amber-300">
            {t(
              'Paused by your Daily Loss Limit guardrail.',
              'Naka-pause dahil sa Daily Loss Limit mo.',
            )}
          </p>
        )}
      </form>
    </aside>
  );
}
