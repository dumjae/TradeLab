import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Layers,
  LineChart,
  NotebookPen,
  Wallet,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { UI_COPY } from '../../data/taglishTranslations';

export const APP_TOUR_STORAGE_KEY = 'tradelab_app_tour_seen_v1';

export interface AppWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WalkthroughStepConfig {
  id: string;
  icon: typeof Compass;
  accentClass: string;
  titleEn: string;
  titleTaglish: string;
  descriptionEn: string;
  descriptionTaglish: string;
  tipsEn: [string, string];
  tipsTaglish: [string, string];
  routePath: string | null;
  tryLabelEn: string | null;
  tryLabelTaglish: string | null;
}

const WALKTHROUGH_STEPS: WalkthroughStepConfig[] = [
  {
    id: 'welcome-setup',
    icon: Compass,
    accentClass: 'border-brand/35 bg-brand-soft text-brand',
    titleEn: 'Welcome & Quick Setup',
    titleTaglish: 'Welcome at Mabilis na Setup',
    descriptionEn:
      'Switch EN | Taglish anytime in the top bar, toggle Warm Dark or Light mode, and train in a 100% VIRTUAL DEMO workspace.',
    descriptionTaglish:
      'Palitan ang EN | Taglish sa top bar, piliin ang Warm Dark o Light mode, at mag-practice sa 100% VIRTUAL DEMO nang walang risk.',
    tipsEn: [
      'Every lesson, diagram, and quiz updates instantly when you toggle EN | Taglish.',
      'All balances are virtual demo funds — $0 real money is ever at risk.',
    ],
    tipsTaglish: [
      'Agad nagbabago sa English o Taglish ang bawat lesson, diagram, at quiz.',
      'Puro virtual demo balance lang ang gamit dito — $0 totoong pera ang nakataya.',
    ],
    routePath: null,
    tryLabelEn: null,
    tryLabelTaglish: null,
  },
  {
    id: 'foundations-and-markets',
    icon: BookOpen,
    accentClass: 'border-bull/35 bg-bull/15 text-bull',
    titleEn: 'Start With Foundations -> Pick Your Market',
    titleTaglish: 'Unahin ang Foundations -> Piliin ang Market Mo',
    descriptionEn:
      'Begin with Lesson 01 (Chart Reading Fundamentals: 5m/15m/1H/1D timeframes & tools) -> Lesson 02 (Candlesticks) -> Universal Core, then choose Crypto, Forex, Stocks, or Indices.',
    descriptionTaglish:
      'Magsimula sa Lesson 01 (Chart Reading Fundamentals: 5m/15m/1H/1D timeframes at tools) -> Lesson 02 (Candlesticks) -> Universal Core, saka pumili ng Crypto, Forex, Stocks, o Indices track.',
    tipsEn: [
      'Universal Core (15 lessons) works on every chart across all platforms.',
      'Separate Market Tracks (3 lessons each) cover each market’s exact hours, fees, and sizing.',
    ],
    tipsTaglish: [
      'Ang Universal Core (15 lessons) ay magagamit sa lahat ng platform at chart.',
      'Hiwalay ang Crypto, Forex, Stocks, at Indices tracks (3 lessons bawat isa).',
    ],
    routePath: '/academy',
    tryLabelEn: 'Try It Now -> Academy',
    tryLabelTaglish: 'Subukan -> Academy',
  },
  {
    id: 'four-lesson-modes',
    icon: Layers,
    accentClass: 'border-sky-500/35 bg-sky-500/10 text-sky-600 dark:text-sky-400',
    titleEn: 'Learn Inside Every Lesson (4 Modes)',
    titleTaglish: 'Mag-aral sa Bawat Lesson (4 Modes)',
    descriptionEn:
      'Switch between Text (Quick Cheat-Card), Diagram (Bullish & Bearish Blueprints), Video (Verified Top Teachers), and Historical Chart (Before -> Trigger -> After) plus AI Mentor.',
    descriptionTaglish:
      'Gamitin ang Text (Mabilis na Buod), Diagram (Bullish at Bearish Blueprints), Video (Verified Top Teachers), at Historical Chart (Before -> Trigger -> After) kasama ang AI Mentor.',
    tipsEn: [
      'Toggle Bullish (Up) and Bearish (Down) views inside every visual diagram.',
      'Open the AI Mentor inside any lesson when you want a simpler explanation.',
    ],
    tipsTaglish: [
      'I-toggle ang Bullish (Pataas) at Bearish (Pababa) sa bawat visual diagram.',
      'Magtanong sa AI Mentor sa loob ng lesson kapag may terminong nakakalito.',
    ],
    routePath: '/academy/chart-reading-fundamentals',
    tryLabelEn: 'Try It Now -> Lesson 01',
    tryLabelTaglish: 'Subukan -> Lesson 01',
  },
  {
    id: 'backtester-replay',
    icon: LineChart,
    accentClass: 'border-teal-500/35 bg-teal-500/10 text-teal-600 dark:text-teal-400',
    titleEn: 'Replay & Test Fast in Backtester',
    titleTaglish: 'Mag-Replay nang Mabilis sa Backtester',
    descriptionEn:
      'Practice historical candles bar-by-bar at 1x–5x playback speed so you get weeks of screen time in minutes.',
    descriptionTaglish:
      'I-replay ang mga lumang candle bar-by-bar sa 1x–5x speed para masanay agad ang mata mo sa loob lang ng ilang minuto.',
    tipsEn: [
      'Step 1 candle at a time, set SL (Stop Loss) and TP (Take Profit), and test your plan.',
      'See instant win rate and R-multiple stats without waiting for live markets.',
    ],
    tipsTaglish: [
      'Mag-step ng 1 candle bawat click at maglagay ng malinaw na SL (Stop Loss) at TP (Take Profit).',
      'Makikita agad ang win rate at R-multiple nang hindi naghihintay ng buong araw.',
    ],
    routePath: '/backtest',
    tryLabelEn: 'Try It Now -> Backtester',
    tryLabelTaglish: 'Subukan -> Backtester',
  },
  {
    id: 'virtual-demo-wallets',
    icon: Wallet,
    accentClass: 'border-bull/35 bg-bull/15 text-bull',
    titleEn: 'Trade Live Virtual Demo Wallets',
    titleTaglish: 'Mag-Trade sa Virtual Demo Wallets',
    descriptionEn:
      'Run separate Crypto, Forex, or Custom demo wallets with realistic fees & spreads, 1% auto-risk sizing, and reset or delete control anytime.',
    descriptionTaglish:
      'Gumawa ng hiwalay na Crypto, Forex, o Custom demo wallets na may realistic fees at spread, 1% auto-risk sizing, at pwedeng i-reset o burahin kahit kailan.',
    tipsEn: [
      'Toggle Realistic Fees & Spread to see true Net P&L (Profit & Loss) after broker costs.',
      'Auto-risk sizing keeps every SL (Stop Loss) capped at 1% of your demo balance.',
    ],
    tipsTaglish: [
      'I-on ang Realistic Fees at Spread para makita ang totoong Net P&L (Profit & Loss).',
      'Automatic ang 1% risk sizing para protektado ang demo balance mo sa bawat trade.',
    ],
    routePath: '/paper-trading',
    tryLabelEn: 'Try It Now -> Paper Trading',
    tryLabelTaglish: 'Subukan -> Paper Trading',
  },
  {
    id: 'journal-mindset-vault',
    icon: NotebookPen,
    accentClass: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    titleEn: 'Journal & Build Consistency',
    titleTaglish: 'Mag-Journal at Magpatibay ng Disiplina',
    descriptionEn:
      'Log demo trades to your Journal in 1 click, and press Shift+Q anytime for the Mindset Vault to eliminate FOMO (Fear of Missing Out) and revenge leaks.',
    descriptionTaglish:
      'I-save sa Journal ang trades sa 1 click lang, at pindutin ang Shift+Q kahit kailan para buksan ang Mindset Vault laban sa FOMO (Fear of Missing Out) at revenge trading.',
    tipsEn: [
      'Review win rate, expectancy, and emotion tags to fix your biggest leaks fast.',
      'Press Shift+Q anywhere in TradeLab to reset your focus before entering a trade.',
    ],
    tipsTaglish: [
      'Makikita sa Journal ang win rate, expectancy, at kung anong emosyon ang nakakasira sa P&L.',
      'Pindutin ang Shift+Q kahit saan sa app para kumalma bago pumindot ng Buy o Sell.',
    ],
    routePath: '/journal',
    tryLabelEn: 'Try It Now -> Trade Journal',
    tryLabelTaglish: 'Subukan -> Trade Journal',
  },
];

function markWalkthroughSeen() {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(APP_TOUR_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage quota errors in restricted browsers
  }
}

export function AppWalkthroughModal({ isOpen, onClose }: AppWalkthroughModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    markWalkthroughSeen();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  const totalSteps = WALKTHROUGH_STEPS.length;
  const activeStep = WALKTHROUGH_STEPS[stepIndex] ?? WALKTHROUGH_STEPS[0];
  const StepIcon = activeStep.icon;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  const handleTryItNow = () => {
    if (!activeStep.routePath) {
      return;
    }
    markWalkthroughSeen();
    onClose();
    navigate(activeStep.routePath);
  };

  const handleNextOrFinish = () => {
    if (isLastStep) {
      handleClose();
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-walkthrough-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5"
    >
      {/* Accessible semantic backdrop button */}
      <button
        type="button"
        aria-label="Close walkthrough modal"
        onClick={handleClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-terminal-border bg-terminal-surface shadow-2xl">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between gap-3 border-b border-terminal-border/80 bg-terminal-bg/60 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold text-brand tabular-nums">
              {t(`Step ${stepIndex + 1} of ${totalSteps}`, `Hakbang ${stepIndex + 1} sa ${totalSteps}`)}
            </span>
            <span className="text-xs font-medium text-terminal-muted">
              {t(UI_COPY.walkthrough.tutorialTitle.en, UI_COPY.walkthrough.tutorialTitle.taglish)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close tutorial"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-terminal-border bg-terminal-surface text-terminal-muted transition-colors hover:border-brand/45 hover:text-terminal-text"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Main Step Body */}
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${activeStep.accentClass}`}
            >
              <StepIcon className="h-5 w-5" aria-hidden="true" />
            </span>

            <div className="min-w-0 space-y-1">
              <h2
                id="app-walkthrough-title"
                className="text-base font-bold tracking-tight text-terminal-text"
              >
                {t(activeStep.titleEn, activeStep.titleTaglish)}
              </h2>
              <p className="text-xs leading-relaxed text-terminal-muted sm:text-[13px]">
                {t(activeStep.descriptionEn, activeStep.descriptionTaglish)}
              </p>
            </div>
          </div>

          {/* Two Crisp Actionable Tips */}
          <ul className="space-y-2 rounded-xl border border-terminal-border/80 bg-terminal-bg/70 p-3">
            {[0, 1].map((tipIdx) => (
              <li
                key={`${activeStep.id}-tip-${tipIdx}`}
                className="flex items-start gap-2 text-xs leading-snug text-terminal-text/90"
              >
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <span>{t(activeStep.tipsEn[tipIdx], activeStep.tipsTaglish[tipIdx])}</span>
              </li>
            ))}
          </ul>

          {/* Optional Direct Jump Button for Steps 2-6 */}
          {activeStep.routePath && activeStep.tryLabelEn && activeStep.tryLabelTaglish ? (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-brand/25 bg-brand-soft/40 px-3 py-2">
              <span className="text-[11px] font-medium text-terminal-muted">
                {t('Want to jump straight in?', 'Gusto mo na bang subukan agad?')}
              </span>
              <button
                type="button"
                onClick={handleTryItNow}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-brand-fg shadow-sm transition-opacity hover:opacity-95"
              >
                <span>{t(activeStep.tryLabelEn, activeStep.tryLabelTaglish)}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-terminal-border/70 bg-terminal-bg/50 px-3 py-2">
              <span className="text-[11px] text-terminal-muted">
                {t(
                  'Take 45 seconds to preview the full study -> replay -> demo workflow.',
                  '45 seconds lang ito para malaman ang buong study -> replay -> demo flow.',
                )}
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 text-[11px] font-semibold text-terminal-muted underline-offset-2 hover:text-terminal-text hover:underline"
              >
                {t('Stay Here', 'Dito Muna')}
              </button>
            </div>
          )}

          {/* Clickable Step Progress Dots */}
          <div className="flex items-center justify-center gap-2 pt-0.5">
            {WALKTHROUGH_STEPS.map((step, idx) => {
              const isCurrent = idx === stepIndex;
              const isVisited = idx < stepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setStepIndex(idx)}
                  aria-label={`Go to step ${idx + 1} of ${totalSteps}: ${step.titleEn}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`h-2 rounded-full transition-all ${
                    isCurrent
                      ? 'w-7 bg-brand'
                      : isVisited
                        ? 'w-2 bg-brand/55 hover:bg-brand'
                        : 'w-2 bg-terminal-border hover:bg-terminal-muted'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between gap-2 border-t border-terminal-border/80 bg-terminal-bg/60 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            {!isFirstStep ? (
              <button
                type="button"
                onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                className="inline-flex items-center gap-1 rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45 hover:text-brand"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                {t(UI_COPY.walkthrough.back.en, UI_COPY.walkthrough.back.taglish)}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full px-2.5 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:text-terminal-text"
              >
                {t(UI_COPY.walkthrough.skip.en, UI_COPY.walkthrough.skip.taglish)}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextOrFinish}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-brand-fg shadow-sm transition-all hover:opacity-95 active:scale-[0.98]"
          >
            <span>
              {isLastStep
                ? t(UI_COPY.walkthrough.finish.en, UI_COPY.walkthrough.finish.taglish)
                : t(UI_COPY.walkthrough.next.en, UI_COPY.walkthrough.next.taglish)}
            </span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
