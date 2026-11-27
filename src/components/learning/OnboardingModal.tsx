import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, X } from 'lucide-react';
import { saveOnboardingPreferences } from '../../services/progressService';
import type { CurriculumLevel, LessonMarketCategory } from '../../types/academy';
import type { OnboardingPreferences } from '../../types/learning-loop';

export interface OnboardingModalProps {
  isOpen: boolean;
  initialPreferences: OnboardingPreferences;
  onClose: () => void;
  onSaved: (preferences: OnboardingPreferences) => void;
}

const EXPERIENCE_OPTIONS: Array<{
  id: CurriculumLevel;
  label: string;
  tagline: string;
}> = [
  {
    id: 'beginner',
    label: 'Beginner',
    tagline: 'Building structure, risk, and candlestick basics.',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    tagline: 'Sharpening liquidity sweeps, FVGs, and playbooks.',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    tagline: 'Refining execution edge, journaling, and scaling.',
  },
];

const MARKET_OPTIONS: Array<{
  id: LessonMarketCategory | 'all';
  label: string;
  accent: string;
}> = [
  {
    id: 'all',
    label: 'All Markets',
    accent: 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'general',
    label: 'General',
    accent: 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'forex',
    label: 'Forex',
    accent: 'border-sky-500 bg-sky-500/15 text-sky-600 dark:text-sky-400',
  },
  {
    id: 'indices',
    label: 'Indices',
    accent: 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  {
    id: 'crypto',
    label: 'Crypto',
    accent: 'border-teal-500 bg-teal-500/15 text-teal-600 dark:text-teal-400',
  },
  {
    id: 'stocks',
    label: 'Stocks',
    accent: 'border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400',
  },
];

export function OnboardingModal({
  isOpen,
  initialPreferences,
  onClose,
  onSaved,
}: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [experienceLevel, setExperienceLevel] = useState<CurriculumLevel>(
    initialPreferences.experienceLevel,
  );
  const [preferredMarket, setPreferredMarket] = useState<LessonMarketCategory | 'all'>(
    initialPreferences.preferredMarket,
  );
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setExperienceLevel(initialPreferences.experienceLevel);
      setPreferredMarket(initialPreferences.preferredMarket);
    }
  }, [isOpen, initialPreferences]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await saveOnboardingPreferences({
        experienceLevel,
        preferredMarket,
        onboardingCompleted: true,
      });
      onSaved(saved);
      onClose();
    } catch {
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      const saved = await saveOnboardingPreferences({
        experienceLevel: initialPreferences.experienceLevel,
        preferredMarket: initialPreferences.preferredMarket,
        onboardingCompleted: true,
      });
      onSaved(saved);
    } catch {
      // Fall through and close cleanly
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close track setup dialog"
        onClick={() => void handleSkip()}
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-terminal-border bg-terminal-surface p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <Compass className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="onboarding-modal-title"
                className="text-base font-semibold tracking-tight text-terminal-text"
              >
                Customize Your Track
              </h2>
              <p className="text-xs text-terminal-muted">Step {step} of 2</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleSkip()}
            aria-label="Dismiss track setup"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-terminal-bg text-terminal-muted transition-colors hover:text-terminal-text"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mt-4 grid grid-cols-2 gap-2" aria-hidden="true">
          <div className="h-1.5 rounded-full bg-emerald-500" />
          <div
            className={`h-1.5 rounded-full transition-colors ${
              step === 2 ? 'bg-emerald-500' : 'bg-terminal-elevated'
            }`}
          />
        </div>

        {step === 1 ? (
          <div className="mt-5 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">
              Experience Level
            </p>
            <div className="space-y-2" role="radiogroup" aria-label="Experience level">
              {EXPERIENCE_OPTIONS.map((option) => {
                const selected = experienceLevel === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setExperienceLevel(option.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                      selected
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-terminal-border bg-terminal-bg/80 hover:border-emerald-500/40'
                    }`}
                  >
                    <div>
                      <span className="block text-sm font-semibold text-terminal-text">
                        {option.label}
                      </span>
                      <span className="block text-xs text-terminal-muted">{option.tagline}</span>
                    </div>
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                          : 'border-terminal-border text-transparent'
                      }`}
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">
              Primary Market
            </p>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Primary market"
            >
              {MARKET_OPTIONS.map((option) => {
                const selected = preferredMarket === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setPreferredMarket(option.id)}
                    className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 text-xs font-semibold transition-all ${
                      selected
                        ? option.accent
                        : 'border-terminal-border bg-terminal-bg/80 text-terminal-text hover:border-emerald-500/40'
                    }`}
                  >
                    <span>{option.label}</span>
                    {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-2 border-t border-terminal-border/70 pt-4">
          {step === 1 ? (
            <button
              type="button"
              onClick={() => void handleSkip()}
              disabled={saving}
              className="rounded-full px-3 py-2 text-xs font-medium text-terminal-muted transition-colors hover:text-terminal-text"
            >
              Skip
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-full border border-terminal-border bg-terminal-bg px-3.5 py-2 text-xs font-medium text-terminal-text transition-colors hover:border-emerald-500/40"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {saving ? 'Saving...' : 'Save Track'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
