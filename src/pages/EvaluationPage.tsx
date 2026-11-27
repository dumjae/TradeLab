import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Download,
  LineChart,
  NotebookPen,
  RotateCcw,
  ShieldCheck,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MASTERY_LEVELS,
  getAssessmentQuestionsForLevel,
  type LevelAssessmentQuestionItem,
  type MasteryLevelMeta,
} from '../data/academyRoadmap';
import {
  computeMasterySummary,
  listLevelAssessments,
  listTopicProgress,
  submitLevelAssessment,
} from '../services/academyProgressService';
import { computeJournalAnalytics, listJournalEntries } from '../services/journalService';
import { listPaperAccounts, listPaperTrades } from '../services/paperTradingService';
import type {
  LevelAssessmentResult,
  MasteryLevel,
  TopicProgressRecord,
} from '../types/curriculum-tree';
import type { JournalEntry } from '../types/learning-loop';
import type { PaperAccount, PaperTrade } from '../types/paper-trading';

interface AnswerReviewItem {
  topicCode: string;
  topicTitle: string;
  prompt: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function formatIssueDate(isoString: string): string {
  const parsed = Date.parse(isoString);
  if (Number.isNaN(parsed)) {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return new Date(parsed).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function buildCertificateSvgMarkup(params: {
  learnerName: string;
  levelMeta: MasteryLevelMeta;
  scorePct: number;
  correctCount: number;
  totalQuestions: number;
  certificateCode: string;
  issueDate: string;
}): string {
  const safeName = escapeXml(params.learnerName);
  const safeLevelTitle = escapeXml(
    `Level ${params.levelMeta.level} — ${params.levelMeta.labelEn}`,
  );
  const safeCode = escapeXml(params.certificateCode);
  const safeDate = escapeXml(params.issueDate);
  const safeScore = escapeXml(
    `${params.scorePct}% (${params.correctCount}/${params.totalQuestions})`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 560" width="920" height="560" role="img" aria-label="TradeLab Academy Level ${params.levelMeta.level} Completion Certificate">
  <rect width="920" height="560" rx="16" fill="#131722" />
  <rect x="20" y="20" width="880" height="520" rx="12" fill="#1e222d" stroke="#2a2e39" stroke-width="2" />
  <rect x="20" y="20" width="880" height="8" rx="4" fill="#2962ff" />
  <rect x="44" y="48" width="832" height="464" rx="8" fill="none" stroke="#2a2e39" stroke-width="1" stroke-dasharray="4 4" />

  <text x="72" y="96" fill="#5b9cf6" font-family="IBM Plex Mono, monospace" font-size="13" font-weight="700" letter-spacing="2.5">TRADELAB ACADEMY • VERIFIED MASTERY CREDENTIAL</text>
  <rect x="742" y="74" width="106" height="30" rx="6" fill="#089981" fill-opacity="0.16" stroke="#089981" stroke-width="1.2" />
  <text x="795" y="94" text-anchor="middle" fill="#089981" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700">PASSED ${params.scorePct}%</text>

  <text x="72" y="156" fill="#d1d4dc" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="34" font-weight="700">Certificate of Completion</text>
  <text x="72" y="186" fill="#8b909a" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="15">Awarded for demonstrating verified curriculum mastery and disciplined risk understanding</text>

  <line x1="72" y1="212" x2="848" y2="212" stroke="#2a2e39" stroke-width="1.5" />

  <text x="72" y="250" fill="#8b909a" font-family="IBM Plex Mono, monospace" font-size="12" letter-spacing="1.8">LEARNER</text>
  <text x="72" y="294" fill="#ffffff" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="36" font-weight="700">${safeName}</text>

  <text x="72" y="344" fill="#8b909a" font-family="IBM Plex Mono, monospace" font-size="12" letter-spacing="1.8">MASTERY TRACK COMPLETED</text>
  <text x="72" y="378" fill="#5b9cf6" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="24" font-weight="700">${safeLevelTitle}</text>

  <rect x="72" y="414" width="776" height="72" rx="10" fill="#131722" stroke="#2a2e39" stroke-width="1.2" />
  <text x="98" y="442" fill="#8b909a" font-family="IBM Plex Mono, monospace" font-size="11">ASSESSMENT SCORE</text>
  <text x="98" y="468" fill="#089981" font-family="IBM Plex Mono, monospace" font-size="16" font-weight="700">${safeScore}</text>

  <text x="352" y="442" fill="#8b909a" font-family="IBM Plex Mono, monospace" font-size="11">CERTIFICATE CODE</text>
  <text x="352" y="468" fill="#ff9800" font-family="IBM Plex Mono, monospace" font-size="16" font-weight="700">${safeCode}</text>

  <text x="652" y="442" fill="#8b909a" font-family="IBM Plex Mono, monospace" font-size="11">ISSUE DATE</text>
  <text x="652" y="468" fill="#d1d4dc" font-family="IBM Plex Mono, monospace" font-size="16" font-weight="700">${safeDate}</text>
</svg>`;
}

export function EvaluationPage() {
  const { user } = useAuth();
  const { isTaglish, t } = useLanguage();

  const [topicProgress, setTopicProgress] = useState<TopicProgressRecord[]>([]);
  const [assessments, setAssessments] = useState<LevelAssessmentResult[]>([]);
  const [paperAccounts, setPaperAccounts] = useState<PaperAccount[]>([]);
  const [paperTrades, setPaperTrades] = useState<PaperTrade[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Inline 10-question assessment runner state
  const [activeLevel, setActiveLevel] = useState<MasteryLevel | null>(null);
  const [runnerQuestions, setRunnerQuestions] = useState<LevelAssessmentQuestionItem[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [reviewItems, setReviewItems] = useState<AnswerReviewItem[]>([]);
  const [submittingResult, setSubmittingResult] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<LevelAssessmentResult | null>(null);

  useEffect(() => {
    let active = true;

    const loadAll = async () => {
      try {
        const [progressData, assessmentData, accountsData, journalData] = await Promise.all([
          listTopicProgress().catch(() => []),
          listLevelAssessments().catch(() => []),
          listPaperAccounts().catch(() => []),
          listJournalEntries().catch(() => []),
        ]);

        const tradeLists = await Promise.all(
          accountsData.map((account) => listPaperTrades(account.id).catch(() => [])),
        );
        const combinedTrades = tradeLists.flat();

        if (!active) {
          return;
        }

        setTopicProgress(progressData);
        setAssessments(assessmentData);
        setPaperAccounts(accountsData);
        setPaperTrades(combinedTrades);
        setJournalEntries(journalData);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadAll();
    return () => {
      active = false;
    };
  }, []);

  const masterySummary = useMemo(
    () => computeMasterySummary(topicProgress, assessments),
    [topicProgress, assessments],
  );

  const assessmentByLevel = useMemo(() => {
    const map = new Map<MasteryLevel, LevelAssessmentResult>();
    for (const item of assessments) {
      map.set(item.level, item);
    }
    return map;
  }, [assessments]);

  const journalAnalytics = useMemo(
    () => computeJournalAnalytics(journalEntries),
    [journalEntries],
  );

  const learnerDisplayName = user?.displayName?.trim() || 'TradeLab Learner';

  const passedAssessmentsCount = useMemo(
    () => assessments.filter((item) => item.passed).length,
    [assessments],
  );

  const earnedCertificates = useMemo(
    () =>
      assessments
        .filter((item) => item.passed && Boolean(item.certificateCode))
        .sort((a, b) => a.level - b.level),
    [assessments],
  );

  // Readiness Check metrics
  const primaryPaperWallet = paperAccounts[0] ?? null;
  const maxConfiguredRiskPct =
    paperAccounts.length > 0
      ? Math.max(...paperAccounts.map((wallet) => wallet.maxRiskPerTradePct))
      : null;
  const riskCapPassed =
    primaryPaperWallet !== null &&
    maxConfiguredRiskPct !== null &&
    maxConfiguredRiskPct <= 2;

  const totalSimulatedTrades = paperTrades.length;
  const simulatedTradesPassed = totalSimulatedTrades >= 10;

  const totalJournalReflections = journalEntries.length;
  const journalReflectionsPassed = totalJournalReflections >= 5;

  const calmBucket = journalAnalytics.byEmotion.find(
    (item) => item.emotion === 'calm_disciplined',
  );
  const calmTradeSharePct =
    journalAnalytics.totalTrades > 0
      ? Math.round(((calmBucket?.count ?? 0) / journalAnalytics.totalTrades) * 100)
      : 0;
  const disciplinedRatePassed =
    journalAnalytics.totalTrades > 0 &&
    calmTradeSharePct >= 70 &&
    journalAnalytics.ruleAdherencePct >= 70;

  const readinessPassedCount = [
    riskCapPassed,
    simulatedTradesPassed,
    journalReflectionsPassed,
    disciplinedRatePassed,
  ].filter(Boolean).length;

  const startAssessment = (level: MasteryLevel) => {
    const questions = getAssessmentQuestionsForLevel(level);
    setActiveLevel(level);
    setRunnerQuestions(questions);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setReviewItems([]);
    setFinalResult(null);
    setSubmittingResult(false);
  };

  const closeRunner = () => {
    setActiveLevel(null);
    setRunnerQuestions([]);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setReviewItems([]);
    setFinalResult(null);
    setSubmittingResult(false);
  };

  const currentQuestion = runnerQuestions[questionIndex] ?? null;

  const handleSubmitCurrentAnswer = () => {
    if (!currentQuestion || selectedOption === null || answerSubmitted) {
      return;
    }

    const isCorrect = selectedOption === currentQuestion.quiz.correctIndex;
    setReviewItems((prev) => [
      ...prev,
      {
        topicCode: currentQuestion.topicCode,
        topicTitle: currentQuestion.topicTitle,
        prompt: currentQuestion.quiz.prompt,
        selectedIndex: selectedOption,
        correctIndex: currentQuestion.quiz.correctIndex,
        isCorrect,
      },
    ]);
    setAnswerSubmitted(true);
  };

  const handleAdvanceQuestion = async () => {
    if (!activeLevel || !answerSubmitted) {
      return;
    }

    const isLastQuestion = questionIndex >= runnerQuestions.length - 1;
    if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerSubmitted(false);
      return;
    }

    setSubmittingResult(true);
    try {
      const correctCount = reviewItems.filter((item) => item.isCorrect).length;
      const totalQuestions = Math.max(1, runnerQuestions.length);
      const saved = await submitLevelAssessment(activeLevel, correctCount, totalQuestions);
      setFinalResult(saved);
      setAssessments((prev) => {
        const exists = prev.some((item) => item.level === saved.level);
        if (exists) {
          return prev
            .map((item) => (item.level === saved.level ? saved : item))
            .sort((a, b) => a.level - b.level);
        }
        return [...prev, saved].sort((a, b) => a.level - b.level);
      });
    } finally {
      setSubmittingResult(false);
    }
  };

  const handleDownloadCertificate = (assessment: LevelAssessmentResult) => {
    if (!assessment.certificateCode) {
      return;
    }
    const levelMeta = MASTERY_LEVELS.find((item) => item.level === assessment.level);
    if (!levelMeta) {
      return;
    }

    const svgMarkup = buildCertificateSvgMarkup({
      learnerName: learnerDisplayName,
      levelMeta,
      scorePct: assessment.scorePct,
      correctCount: assessment.correctCount,
      totalQuestions: assessment.totalQuestions,
      certificateCode: assessment.certificateCode,
      issueDate: formatIssueDate(assessment.completedAt),
    });

    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `tradelab-certificate-L${assessment.level}-${assessment.certificateCode}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  };

  const activeLevelMeta =
    activeLevel !== null
      ? MASTERY_LEVELS.find((meta) => meta.level === activeLevel) ?? null
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Page Header */}
      <section className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-brand/35 bg-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-text">
              <Award className="h-3 w-3" aria-hidden="true" />
              {t('Pillar 05 • Competency & Readiness', 'Pillar 05 • Pagsusulit at Kahandaan')}
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-terminal-text sm:text-xl">
              {t(
                '05. Trader Evaluation & Mastery Assessments',
                '05. Ebalwasyon ng Trader at Mastery Assessments',
              )}
            </h1>
            <p className="max-w-2xl text-xs text-terminal-muted">
              {t(
                'Test your understanding across Levels 1–5, verify simulated risk and journal discipline, and download verified completion certificates.',
                'Subukan ang iyong kaalaman mula Level 1 hanggang Level 5, tingnan ang kahandaan sa paper trading at journal, at mag-download ng completion certificates.',
              )}
            </p>
          </div>

          <div className="grid shrink-0 grid-cols-3 gap-2 lg:w-72">
            <div className="rounded-lg border border-terminal-border bg-terminal-bg p-2.5 text-center">
              <p className="font-mono text-base font-semibold text-brand-text tabular-nums">
                L{masterySummary.currentLevel}
              </p>
              <p className="text-[10px] font-medium text-terminal-muted">
                {t('Current Tier', 'Antas Ngayon')}
              </p>
            </div>
            <div className="rounded-lg border border-terminal-border bg-terminal-bg p-2.5 text-center">
              <p className="font-mono text-base font-semibold text-bull tabular-nums">
                {passedAssessmentsCount}/5
              </p>
              <p className="text-[10px] font-medium text-terminal-muted">
                {t('Passed', 'Pasado')}
              </p>
            </div>
            <div className="rounded-lg border border-terminal-border bg-terminal-bg p-2.5 text-center">
              <p className="font-mono text-base font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                {masterySummary.completedTopics}/{masterySummary.totalTopics}
              </p>
              <p className="text-[10px] font-medium text-terminal-muted">
                {t('Topics Done', 'Tapos na Topic')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — LEVEL 1-5 MASTERY ASSESSMENTS */}
      <section aria-labelledby="mastery-assessments-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2
              id="mastery-assessments-heading"
              className="text-sm font-semibold tracking-tight text-terminal-text sm:text-base"
            >
              {t('1. Level 1–5 Mastery Assessments', '1. Level 1–5 Mastery Assessments')}
            </h2>
            <p className="text-xs text-terminal-muted">
              {t(
                'Each level assessment tests 10 core questions drawn across that tier’s curriculum. Score 70% or higher to earn your level certificate.',
                'Bawat level assessment ay may 10 pangunahing tanong. Makakuha ng 70% o mas mataas para matanggap ang level certificate.',
              )}
            </p>
          </div>
          <Link
            to="/academy"
            className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45 hover:text-brand-text"
          >
            <span>{t('Review Master Roadmap', 'Tingnan ang Master Roadmap')}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {MASTERY_LEVELS.map((levelMeta) => {
            const levelProgress = masterySummary.byLevel[levelMeta.level];
            const result = assessmentByLevel.get(levelMeta.level);
            const isActive = activeLevel === levelMeta.level;

            return (
              <article
                key={levelMeta.level}
                className={`flex flex-col justify-between rounded-xl border bg-terminal-surface p-4 transition-colors ${
                  isActive
                    ? 'border-brand ring-1 ring-brand/40'
                    : result?.passed
                      ? 'border-bull/45'
                      : 'border-terminal-border hover:border-brand/40'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-md border border-brand/35 bg-brand-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-text">
                      {levelMeta.badge}
                    </span>
                    {result?.passed ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-bull/35 bg-bull/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-bull tabular-nums">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        {t(`Passed ${result.scorePct}%`, `Pasado ${result.scorePct}%`)}
                      </span>
                    ) : result ? (
                      <span className="rounded-md border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                        {result.scorePct}% • {levelMeta.passingScorePct}%{' '}
                        {t('to pass', 'pasa')}
                      </span>
                    ) : (
                      <span className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] font-medium text-terminal-muted tabular-nums">
                        {levelMeta.passingScorePct}% {t('to pass', 'para pumasa')}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-terminal-text">
                      Level {levelMeta.level}:{' '}
                      {isTaglish ? levelMeta.labelTaglish : levelMeta.labelEn}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-terminal-muted">
                      {isTaglish ? levelMeta.goalTaglish : levelMeta.goalEn}
                    </p>
                  </div>

                  {/* Topic completion bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between font-mono text-[10px] text-terminal-muted tabular-nums">
                      <span>{t('Topics Progress', 'Progreso ng Topics')}</span>
                      <span className="font-semibold text-terminal-text">
                        {levelProgress.percent}% ({levelProgress.completed}/{levelProgress.total})
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`Level ${levelMeta.level} syllabus progress`}
                      aria-valuenow={levelProgress.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-1.5 w-full overflow-hidden rounded-full bg-terminal-elevated"
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          result?.passed ? 'bg-bull' : 'bg-brand'
                        }`}
                        style={{ width: `${levelProgress.percent}%` }}
                      />
                    </div>
                  </div>

                  {result?.passed && result.certificateCode && (
                    <p className="rounded-md border border-terminal-border bg-terminal-bg px-2 py-1 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      {t('Cert:', 'Cert:')} {result.certificateCode}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => startAssessment(levelMeta.level)}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    result?.passed
                      ? 'border border-terminal-border bg-terminal-bg text-terminal-text hover:border-brand/45 hover:bg-terminal-elevated'
                      : 'bg-brand text-brand-fg hover:opacity-95'
                  }`}
                >
                  <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {result
                      ? t('Retake', 'Ulitin')
                      : t('Take Assessment', 'Simulan ang Quiz')}
                  </span>
                </button>
              </article>
            );
          })}
        </div>

        {/* INLINE INTERACTIVE 10-QUESTION ASSESSMENT RUNNER */}
        {activeLevel !== null && activeLevelMeta && (
          <div
            aria-label={`Level ${activeLevel} Assessment Runner`}
            className="rounded-xl border border-brand/45 bg-terminal-surface p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terminal-border pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-brand/35 bg-brand-soft px-2 py-0.5 font-mono text-xs font-semibold text-brand-text">
                  {activeLevelMeta.badge}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-terminal-text">
                    {t(
                      `Level ${activeLevel} Mastery Assessment — ${activeLevelMeta.labelEn}`,
                      `Level ${activeLevel} Mastery Assessment — ${activeLevelMeta.labelTaglish}`,
                    )}
                  </h3>
                  {!finalResult && runnerQuestions.length > 0 && (
                    <p className="font-mono text-[11px] text-terminal-muted tabular-nums">
                      {t(
                        `Question ${questionIndex + 1} of ${runnerQuestions.length}`,
                        `Tanong ${questionIndex + 1} sa ${runnerQuestions.length}`,
                      )}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={closeRunner}
                aria-label="Close assessment runner"
                className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:border-bear/45 hover:text-terminal-text"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('Close', 'Isara')}</span>
              </button>
            </div>

            {finalResult ? (
              /* FINAL SCORE BREAKDOWN */
              <div className="mt-4 space-y-4">
                <div
                  className={`rounded-xl border p-4 ${
                    finalResult.passed
                      ? 'border-bull/45 bg-bull/10'
                      : 'border-amber-500/40 bg-amber-500/10'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          finalResult.passed
                            ? 'text-bull'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {finalResult.passed
                          ? t('Assessment Passed • Certificate Unlocked', 'Pasado sa Assessment • May Certificate Ka Na')
                          : t('Score Below 70% Threshold • Keep Reviewing', 'Mababa sa 70% • Mag-review Muna at Subukan Ulit')}
                      </p>
                      <p className="font-mono text-2xl font-bold text-terminal-text tabular-nums">
                        {finalResult.scorePct}%{' '}
                        <span className="text-sm font-medium text-terminal-muted">
                          ({finalResult.correctCount} / {finalResult.totalQuestions}{' '}
                          {t('correct', 'tama')})
                        </span>
                      </p>
                      {finalResult.certificateCode && (
                        <p className="font-mono text-xs text-terminal-text">
                          {t('Certificate Code:', 'Certificate Code:')}{' '}
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {finalResult.certificateCode}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {finalResult.passed && finalResult.certificateCode && (
                        <button
                          type="button"
                          onClick={() => handleDownloadCertificate(finalResult)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-bull px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t('Download SVG Certificate', 'I-download ang Certificate')}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startAssessment(activeLevel)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-surface px-3.5 py-2 text-xs font-semibold text-terminal-text transition-colors hover:border-brand/45 hover:bg-terminal-elevated"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t('Retake', 'Ulitin')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question-by-question breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-terminal-muted">
                    {t('Answer Breakdown', 'Detalye ng mga Sagot')}
                  </h4>
                  <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {reviewItems.map((item, idx) => (
                      <li
                        key={`${item.topicCode}-${idx}`}
                        className="flex items-start gap-2.5 rounded-lg border border-terminal-border bg-terminal-bg px-3 py-2.5"
                      >
                        {item.isCorrect ? (
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-bull"
                            aria-label="Correct"
                          />
                        ) : (
                          <XCircle
                            className="mt-0.5 h-4 w-4 shrink-0 text-bear"
                            aria-label="Incorrect"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] font-semibold text-brand-text">
                            Q{idx + 1} • Topic {item.topicCode}: {item.topicTitle}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-terminal-text">
                            {item.prompt}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : currentQuestion ? (
              /* ACTIVE QUESTION RUNNER */
              <div className="mt-4 space-y-4">
                <div
                  role="progressbar"
                  aria-label="Assessment question progress"
                  aria-valuenow={Math.round(((questionIndex + 1) / runnerQuestions.length) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-terminal-elevated"
                >
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-300"
                    style={{
                      width: `${Math.round(((questionIndex + 1) / runnerQuestions.length) * 100)}%`,
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="inline-flex items-center rounded border border-terminal-border bg-terminal-bg px-2 py-0.5 font-mono text-[10px] font-semibold text-terminal-muted">
                    {t('Topic', 'Topic')} {currentQuestion.topicCode}: {currentQuestion.topicTitle}
                  </span>
                  <p className="text-sm font-semibold leading-snug text-terminal-text sm:text-base">
                    {currentQuestion.quiz.prompt}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {currentQuestion.quiz.options.map((optionText, optionIdx) => {
                    const isSelected = selectedOption === optionIdx;
                    const isCorrectOption = optionIdx === currentQuestion.quiz.correctIndex;

                    let optionStyle =
                      'border-terminal-border bg-terminal-bg text-terminal-text hover:border-brand/50 hover:bg-terminal-elevated';

                    if (answerSubmitted) {
                      if (isCorrectOption) {
                        optionStyle = 'border-bull bg-bull/15 text-terminal-text font-semibold';
                      } else if (isSelected && !isCorrectOption) {
                        optionStyle = 'border-bear bg-bear/15 text-terminal-text';
                      } else {
                        optionStyle = 'border-terminal-border bg-terminal-bg text-terminal-muted opacity-70';
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-brand bg-brand-soft text-terminal-text font-semibold';
                    }

                    return (
                      <button
                        key={`${currentQuestion.topicCode}-opt-${optionIdx}`}
                        type="button"
                        disabled={answerSubmitted}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedOption(optionIdx)}
                        className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-left text-xs transition-colors disabled:cursor-default ${optionStyle}`}
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-current/25 font-mono text-[10px] font-bold">
                          {OPTION_LETTERS[optionIdx]}
                        </span>
                        <span className="leading-relaxed">{optionText}</span>
                      </button>
                    );
                  })}
                </div>

                {answerSubmitted && (
                  <div className="space-y-2 rounded-lg border border-terminal-border bg-terminal-bg p-3.5">
                    <p
                      className={`text-xs font-semibold ${
                        selectedOption === currentQuestion.quiz.correctIndex
                          ? 'text-bull'
                          : 'text-bear'
                      }`}
                    >
                      {selectedOption === currentQuestion.quiz.correctIndex
                        ? t('Correct!', 'Tama!')
                        : t(
                            `Incorrect — Correct answer is ${OPTION_LETTERS[currentQuestion.quiz.correctIndex]}`,
                            `Mali — Ang tamang sagot ay ${OPTION_LETTERS[currentQuestion.quiz.correctIndex]}`,
                          )}
                    </p>
                    <p className="text-xs leading-relaxed text-terminal-text/90">
                      {currentQuestion.quiz.rationale}
                    </p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400">
                      <span className="font-semibold">
                        {t('Common Trap:', 'Karaniwang Mali:')}
                      </span>{' '}
                      {currentQuestion.quiz.commonTrap}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  {!answerSubmitted ? (
                    <button
                      type="button"
                      disabled={selectedOption === null}
                      onClick={handleSubmitCurrentAnswer}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <span>{t('Submit Answer', 'Ipasa ang Sagot')}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submittingResult}
                      onClick={() => void handleAdvanceQuestion()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95 disabled:opacity-60"
                    >
                      <span>
                        {questionIndex >= runnerQuestions.length - 1
                          ? submittingResult
                            ? t('Grading...', 'Tinatasa...')
                            : t('Finish & View Score', 'Tapusin at Tingnan ang Score')
                          : t('Next', 'Susunod')}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>

      {/* SECTION 2 — PRACTICAL RISK & EXECUTION READINESS CHECK */}
      <section
        aria-labelledby="readiness-check-heading"
        className="rounded-xl border border-terminal-border bg-terminal-surface p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 border-b border-terminal-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-bull" aria-hidden="true" />
              <h2
                id="readiness-check-heading"
                className="text-sm font-semibold tracking-tight text-terminal-text sm:text-base"
              >
                {t(
                  '2. Practical Risk & Execution Readiness Check',
                  '2. Practical Risk at Execution Readiness Check',
                )}
              </h2>
            </div>
            <p className="text-xs text-terminal-muted">
              {t(
                'Simulated habits audit pulled live from your Paper Trading wallets and Trade Journal. Build process consistency here before ever risking real capital.',
                'Live audit mula sa iyong Paper Trading wallets at Trade Journal. Buuin muna ang disiplina dito bago mag-isip ng totoong kapital.',
              )}
            </p>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold tabular-nums ${
              readinessPassedCount === 4
                ? 'border-bull/40 bg-bull/10 text-bull'
                : 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {readinessPassedCount} / 4 {t('Criteria Met', 'Pamantayan na Pasado')}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Criterion 1: Paper Trading Risk Cap <= 2% */}
          <div className="rounded-xl border border-terminal-border bg-terminal-bg p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-terminal-text">
                  {t('1. Paper Trading Risk Cap (≤ 2% / trade)', '1. Paper Trading Risk Cap (≤ 2% / trade)')}
                </p>
                <p className="text-[11px] text-terminal-muted">
                  {t(
                    'Active demo wallet max risk per trade kept at or below 2%.',
                    'Max risk per trade sa demo wallet ay hindi lalampas sa 2%.',
                  )}
                </p>
              </div>
              {riskCapPassed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-bull" aria-label="Met" />
              ) : (
                <AlertTriangle
                  className="h-4 w-4 shrink-0 text-amber-500"
                  aria-label="In progress"
                />
              )}
            </div>
            <p className="mt-2.5 font-mono text-xs font-semibold text-terminal-text tabular-nums">
              {loading
                ? t('Checking wallets...', 'Tinitingnan...')
                : maxConfiguredRiskPct !== null
                  ? `${maxConfiguredRiskPct}% ${t('max risk across', 'max risk sa')} ${paperAccounts.length} ${t('demo wallet(s)', 'demo wallet')}`
                  : t('No demo wallet configured yet', 'Wala pang demo wallet')}
            </p>
          </div>

          {/* Criterion 2: Simulated Trades Logged >= 10 */}
          <div className="rounded-xl border border-terminal-border bg-terminal-bg p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-terminal-text">
                  {t('2. Simulated Trades Logged (Target ≥ 10)', '2. Simulated Trades na Naka-log (Target ≥ 10)')}
                </p>
                <p className="text-[11px] text-terminal-muted">
                  {t(
                    'Closed paper trades demonstrating stop-loss & position sizing practice.',
                    'Mga natapos na paper trades na may tamang stop-loss at position sizing.',
                  )}
                </p>
              </div>
              {simulatedTradesPassed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-bull" aria-label="Met" />
              ) : (
                <AlertTriangle
                  className="h-4 w-4 shrink-0 text-amber-500"
                  aria-label="In progress"
                />
              )}
            </div>
            <p className="mt-2.5 font-mono text-xs font-semibold text-terminal-text tabular-nums">
              {totalSimulatedTrades} / 10 {t('closed paper trades', 'natapos na paper trades')}
            </p>
          </div>

          {/* Criterion 3: Trade Journal Reflections >= 5 */}
          <div className="rounded-xl border border-terminal-border bg-terminal-bg p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-terminal-text">
                  {t('3. Trade Journal Reflections (Target ≥ 5)', '3. Trade Journal Entries (Target ≥ 5)')}
                </p>
                <p className="text-[11px] text-terminal-muted">
                  {t(
                    'Documented trade setups, emotions, and post-trade lessons.',
                    'Naitalang setups, emosyon, at aral mula sa bawat trade.',
                  )}
                </p>
              </div>
              {journalReflectionsPassed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-bull" aria-label="Met" />
              ) : (
                <AlertTriangle
                  className="h-4 w-4 shrink-0 text-amber-500"
                  aria-label="In progress"
                />
              )}
            </div>
            <p className="mt-2.5 font-mono text-xs font-semibold text-terminal-text tabular-nums">
              {totalJournalReflections} / 5 {t('journal entries', 'journal entries')}
            </p>
          </div>

          {/* Criterion 4: Disciplined Execution Rate */}
          <div className="rounded-xl border border-terminal-border bg-terminal-bg p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-terminal-text">
                  {t('4. Disciplined Execution Rate (Target ≥ 70%)', '4. Disciplined Execution Rate (Target ≥ 70%)')}
                </p>
                <p className="text-[11px] text-terminal-muted">
                  {t(
                    'Calm & Disciplined process share and rule adherence from your Trade Journal.',
                    'Porsyento ng Calm & Disciplined trades at pagsunod sa plano sa Trade Journal.',
                  )}
                </p>
              </div>
              {disciplinedRatePassed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-bull" aria-label="Met" />
              ) : (
                <AlertTriangle
                  className="h-4 w-4 shrink-0 text-amber-500"
                  aria-label="In progress"
                />
              )}
            </div>
            <p className="mt-2.5 font-mono text-xs font-semibold text-terminal-text tabular-nums">
              {journalAnalytics.totalTrades > 0
                ? `${calmTradeSharePct}% ${t('Calm', 'Kalma')} • ${journalAnalytics.ruleAdherencePct}% ${t('Plan Adherence', 'Sunod sa Plano')} • ${calmBucket?.winRate ?? 0}% ${t('Calm Win Rate', 'Calm Win Rate')}`
                : t('Log journal trades to compute discipline metrics', 'Mag-log ng journal trades para makita ang rating')}
            </p>
          </div>
        </div>

        {/* Direct Lab Jump Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-terminal-border pt-4">
          <Link
            to="/paper-trading"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
          >
            <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('Open Paper Trading', 'Buksan ang Paper Trading')}</span>
          </Link>
          <Link
            to="/backtest"
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/35 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
          >
            <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('Open Market Backtester', 'Buksan ang Backtester')}</span>
          </Link>
          <Link
            to="/journal"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
          >
            <NotebookPen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('Open Trade Journal', 'Buksan ang Trade Journal')}</span>
          </Link>
        </div>
      </section>

      {/* SECTION 3 — EARNED COMPLETION CERTIFICATES */}
      <section aria-labelledby="certificates-heading" className="space-y-3">
        <div>
          <h2
            id="certificates-heading"
            className="text-sm font-semibold tracking-tight text-terminal-text sm:text-base"
          >
            {t('3. Earned Completion Certificates', '3. Nakuhang Completion Certificates')}
          </h2>
          <p className="text-xs text-terminal-muted">
            {t(
              'Pass any Level 1–5 Mastery Assessment at 70% or above to unlock a downloadable TradeLab Academy SVG certificate.',
              'Pumasa sa alinmang Level 1–5 Mastery Assessment (70% pataas) para makuha at ma-download ang iyong SVG certificate.',
            )}
          </p>
        </div>

        {earnedCertificates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-terminal-border bg-terminal-surface p-6 text-center">
            <Award className="mx-auto h-7 w-7 text-terminal-muted" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-terminal-text">
              {t('No certificates issued yet', 'Wala pang certificate sa ngayon')}
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs text-terminal-muted">
              {t(
                'Start with Level 1 Beginner Assessment above. Once you score 70%+, your verifiable certificate will appear here ready for SVG download.',
                'Simulan ang Level 1 Beginner Assessment sa itaas. Kapag nakakuha ka ng 70%+, lalabas dito ang iyong certificate na puwedeng i-download.',
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {earnedCertificates.map((cert) => {
              const levelMeta = MASTERY_LEVELS.find((item) => item.level === cert.level);
              if (!levelMeta || !cert.certificateCode) {
                return null;
              }
              const issueDateLabel = formatIssueDate(cert.completedAt);

              return (
                <article
                  key={`cert-level-${cert.level}`}
                  className="overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface"
                >
                  {/* Crisp TradingView-Dark Inline SVG Certificate Preview */}
                  <div className="border-b border-terminal-border bg-[#131722] p-3">
                    <svg
                      viewBox="0 0 920 560"
                      role="img"
                      aria-label={`TradeLab Academy Level ${cert.level} Completion Certificate for ${learnerDisplayName}`}
                      className="h-auto w-full rounded-lg"
                    >
                      <rect width="920" height="560" rx="16" fill="#131722" />
                      <rect
                        x="20"
                        y="20"
                        width="880"
                        height="520"
                        rx="12"
                        fill="#1e222d"
                        stroke="#2a2e39"
                        strokeWidth="2"
                      />
                      <rect x="20" y="20" width="880" height="8" rx="4" fill="#2962ff" />
                      <rect
                        x="44"
                        y="48"
                        width="832"
                        height="464"
                        rx="8"
                        fill="none"
                        stroke="#2a2e39"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />

                      <text
                        x="72"
                        y="96"
                        fill="#5b9cf6"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="13"
                        fontWeight="700"
                        letterSpacing="2.5"
                      >
                        TRADELAB ACADEMY • VERIFIED MASTERY CREDENTIAL
                      </text>
                      <rect
                        x="742"
                        y="74"
                        width="106"
                        height="30"
                        rx="6"
                        fill="#089981"
                        fillOpacity="0.16"
                        stroke="#089981"
                        strokeWidth="1.2"
                      />
                      <text
                        x="795"
                        y="94"
                        textAnchor="middle"
                        fill="#089981"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="12"
                        fontWeight="700"
                      >
                        PASSED {cert.scorePct}%
                      </text>

                      <text
                        x="72"
                        y="156"
                        fill="#d1d4dc"
                        fontFamily="Plus Jakarta Sans, Arial, sans-serif"
                        fontSize="34"
                        fontWeight="700"
                      >
                        Certificate of Completion
                      </text>
                      <text
                        x="72"
                        y="186"
                        fill="#8b909a"
                        fontFamily="Plus Jakarta Sans, Arial, sans-serif"
                        fontSize="15"
                      >
                        Awarded for demonstrating verified curriculum mastery and risk discipline
                      </text>

                      <line x1="72" y1="212" x2="848" y2="212" stroke="#2a2e39" strokeWidth="1.5" />

                      <text
                        x="72"
                        y="250"
                        fill="#8b909a"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="12"
                        letterSpacing="1.8"
                      >
                        LEARNER
                      </text>
                      <text
                        x="72"
                        y="294"
                        fill="#ffffff"
                        fontFamily="Plus Jakarta Sans, Arial, sans-serif"
                        fontSize="36"
                        fontWeight="700"
                      >
                        {learnerDisplayName}
                      </text>

                      <text
                        x="72"
                        y="344"
                        fill="#8b909a"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="12"
                        letterSpacing="1.8"
                      >
                        MASTERY TRACK COMPLETED
                      </text>
                      <text
                        x="72"
                        y="378"
                        fill="#5b9cf6"
                        fontFamily="Plus Jakarta Sans, Arial, sans-serif"
                        fontSize="24"
                        fontWeight="700"
                      >
                        Level {levelMeta.level} — {levelMeta.labelEn}
                      </text>

                      <rect
                        x="72"
                        y="414"
                        width="776"
                        height="72"
                        rx="10"
                        fill="#131722"
                        stroke="#2a2e39"
                        strokeWidth="1.2"
                      />
                      <text
                        x="98"
                        y="442"
                        fill="#8b909a"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="11"
                      >
                        ASSESSMENT SCORE
                      </text>
                      <text
                        x="98"
                        y="468"
                        fill="#089981"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="16"
                        fontWeight="700"
                      >
                        {cert.scorePct}% ({cert.correctCount}/{cert.totalQuestions})
                      </text>

                      <text
                        x="352"
                        y="442"
                        fill="#8b909a"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="11"
                      >
                        CERTIFICATE CODE
                      </text>
                      <text
                        x="352"
                        y="468"
                        fill="#ff9800"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="16"
                        fontWeight="700"
                      >
                        {cert.certificateCode}
                      </text>

                      <text
                        x="652"
                        y="442"
                        fill="#8b909a"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="11"
                      >
                        ISSUE DATE
                      </text>
                      <text
                        x="652"
                        y="468"
                        fill="#d1d4dc"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="16"
                        fontWeight="700"
                      >
                        {issueDateLabel}
                      </text>
                    </svg>
                  </div>

                  {/* Certificate Footer & Download Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-terminal-text">
                        Level {levelMeta.level} —{' '}
                        {isTaglish ? levelMeta.labelTaglish : levelMeta.labelEn}
                      </p>
                      <p className="font-mono text-[11px] text-terminal-muted tabular-nums">
                        {cert.certificateCode} • {cert.scorePct}% • {issueDateLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadCertificate(cert)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t('Download SVG Certificate', 'I-download ang SVG Certificate')}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
