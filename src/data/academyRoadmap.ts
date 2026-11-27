import { deepLocalizeMarketTimes } from '../lib/marketTime';
import type {
  AcademyModule,
  AcademyPathId,
  AcademyPathMeta,
  AcademyPillarId,
  DecoupledLessonNode,
  MasteryLevel,
  SyllabusQuizQuestion,
} from '../types/curriculum-tree';
import { ADVANCED_LESSONS, ADVANCED_MODULES } from './syllabus/advancedSyllabus';
import { CRYPTO_LESSONS, CRYPTO_MODULES } from './syllabus/cryptoSyllabus';
import { FOREX_LESSONS, FOREX_MODULES } from './syllabus/forexSyllabus';
import { FOUNDATIONS_LESSONS, FOUNDATIONS_MODULES } from './syllabus/foundationsSyllabus';
import { INDICES_LESSONS, INDICES_MODULES } from './syllabus/indicesSyllabus';
import { STOCKS_LESSONS, STOCKS_MODULES } from './syllabus/stocksSyllabus';
import {
  STRATEGY_PRO_PH_LESSONS,
  STRATEGY_PRO_PH_MODULES,
} from './syllabus/strategyProPhSyllabus';

export interface AcademyPillarMeta {
  id: AcademyPillarId;
  step: string;
  titleEn: string;
  titleTaglish: string;
  subtitleEn: string;
  subtitleTaglish: string;
  route: string;
  levelRange: string;
  accentToken: 'brand' | 'bull' | 'amber' | 'info' | 'bear';
}

export interface MasteryLevelMeta {
  level: MasteryLevel;
  labelEn: string;
  labelTaglish: string;
  badge: string;
  goalEn: string;
  goalTaglish: string;
  focusTags: string[];
  passingScorePct: number;
}

export interface LevelAssessmentQuestionItem {
  topicCode: string;
  topicTitle: string;
  quiz: SyllabusQuizQuestion;
}

const LOCALIZE_OPTIONS = {
  skipKeys: [
    'code',
    'lessonCodes',
    'prerequisiteCodes',
    'diagramKind',
    'pillar',
    'pathId',
    'supportedMarkets',
    'accentToken',
    'route',
  ],
} as const;

export const ACADEMY_PILLARS: AcademyPillarMeta[] = [
  {
    id: 'foundations',
    step: '01',
    titleEn: '01. Trading Foundations',
    titleTaglish: '01. Pundasyon sa Trading',
    subtitleEn:
      'Universal trading mechanics, financial markets, chart reading, core technical analysis, risk control, and trading psychology.',
    subtitleTaglish:
      'Mga pangunahing mekanismo ng trading, merkado, pagbabasa ng chart, technical analysis, risk management, at tamang disiplina.',
    route: '/academy?pillar=foundations',
    levelRange: 'Level 1',
    accentToken: 'brand',
  },
  {
    id: 'specializations',
    step: '02',
    titleEn: '02. Market Specializations',
    titleTaglish: '02. Espesyalisasyon sa Merkado',
    subtitleEn:
      'Dedicated multi-module playbooks for Forex, Stock Indices, Global Equities, Crypto, plus the optional Philippine (PSE/BSP/SEC) track.',
    subtitleTaglish:
      'Kumpletong tracks para sa Forex, Indices, Stocks, Crypto, at opsyonal na Philippine Market (PSE/BSP/SEC) track.',
    route: '/academy?pillar=specializations',
    levelRange: 'Levels 2–4',
    accentToken: 'info',
  },
  {
    id: 'advanced',
    step: '03',
    titleEn: '03. Advanced Trading',
    titleTaglish: '03. Abanseng Trading',
    subtitleEn:
      'Multi-timeframe Market Structure, Smart Money Concepts (as analytical frameworks), systematic strategy design, and institutional portfolio governance.',
    subtitleTaglish:
      'Multi-timeframe Market Structure, Smart Money Concepts bilang analytical framework, paggawa ng strategy, at propesyonal na portfolio management.',
    route: '/academy?pillar=advanced',
    levelRange: 'Levels 3–5',
    accentToken: 'bull',
  },
  {
    id: 'practical_lab',
    step: '04',
    titleEn: '04. Practical Trading Lab',
    titleTaglish: '04. Praktikal na Trading Lab',
    subtitleEn:
      'Apply every lesson risk-free across interactive OHLCV chart scenarios, historical Backtester, Paper Trading simulator, and Trade Journal.',
    subtitleTaglish:
      'Sanayin ang bawat aralin nang walang panganib sa real money gamit ang interactive charts, Backtester, Paper Trading, at Trade Journal.',
    route: '/paper-trading',
    levelRange: 'All Levels',
    accentToken: 'amber',
  },
  {
    id: 'evaluation',
    step: '05',
    titleEn: '05. Trader Evaluation',
    titleTaglish: '05. Ebalwasyon ng Trader',
    subtitleEn:
      'Validate mastery across Levels 1–5 with structured assessments, risk readiness checks, and verifiable completion certificates.',
    subtitleTaglish:
      'Patunayan ang galing mula Level 1 hanggang Level 5 gamit ang mga pagsusulit, risk readiness check, at completion certificates.',
    route: '/evaluation',
    levelRange: 'Levels 1–5',
    accentToken: 'bear',
  },
];

export const MASTERY_LEVELS: MasteryLevelMeta[] = [
  {
    level: 1,
    labelEn: 'Beginner',
    labelTaglish: 'Baguhan',
    badge: 'L1',
    goalEn:
      'Build rock-solid fundamentals in market mechanics, candlestick reading, core technical structure, position sizing, and emotional control.',
    goalTaglish:
      'Bumuo ng matibay na pundasyon sa market mechanics, pagbabasa ng candlesticks, risk management, at tamang disiplina.',
    focusTags: ['Market Basics', 'Candlesticks', 'Support & Resistance', 'Risk Math', 'Psychology'],
    passingScorePct: 70,
  },
  {
    level: 2,
    labelEn: 'Elementary',
    labelTaglish: 'Pundasyon sa Merkado',
    badge: 'L2',
    goalEn:
      'Master asset-specific mechanics, session timings in PH time, fundamental drivers, and security rules across your chosen market specialization.',
    goalTaglish:
      'Kabisaduhin ang eksaktong mechanics, oras ng session sa PH time, fundamentals, at seguridad ng napiling merkado.',
    focusTags: ['Forex', 'Indices', 'Stocks', 'Crypto', 'PSE (Optional)'],
    passingScorePct: 70,
  },
  {
    level: 3,
    labelEn: 'Intermediate',
    labelTaglish: 'Gitnang Antas',
    badge: 'L3',
    goalEn:
      'Read multi-timeframe market structure, structural shifts, and derivatives/on-chain positioning with strict objective invalidation.',
    goalTaglish:
      'Magbasa ng multi-timeframe market structure, structural shifts, at derivatives/on-chain context nang may malinaw na invalidation.',
    focusTags: ['Market Structure', 'BOS / CHoCH', 'MTF Alignment', 'On-Chain & Derivatives'],
    passingScorePct: 70,
  },
  {
    level: 4,
    labelEn: 'Advanced',
    labelTaglish: 'Abanseng Antas',
    badge: 'L4',
    goalEn:
      'Synthesize Smart Money Concepts as analytical frameworks, execute market-specific playbooks, and build backtested rule-based strategies.',
    goalTaglish:
      'Gamitin ang Smart Money Concepts bilang analytical framework, aralin ang advanced playbooks, at bumuo ng nasubukang strategy.',
    focusTags: ['SMC Frameworks', 'Liquidity & FVG', 'Playbooks', 'Backtesting', 'Expectancy'],
    passingScorePct: 70,
  },
  {
    level: 5,
    labelEn: 'Professional',
    labelTaglish: 'Propesyonal',
    badge: 'L5',
    goalEn:
      'Operate with institutional-grade routines, journal diagnostics, portfolio correlation control, drawdown governance, and sustainable scaling.',
    goalTaglish:
      'Mag-trade na parang propesyonal gamit ang daily routines, journal review, correlation control, at disiplinadong pagpapalaki ng kapital.',
    focusTags: ['Daily Routines', 'Journal Audits', 'Portfolio Risk', 'Drawdown Control', 'Scaling'],
    passingScorePct: 70,
  },
];

const PH_MODULES = STRATEGY_PRO_PH_MODULES.filter((mod) => mod.pathId === 'philippines_pse');
const STRATEGY_PRO_ONLY_MODULES = STRATEGY_PRO_PH_MODULES.filter(
  (mod) => mod.pathId === 'strategy_pro',
);

const PH_LESSONS = STRATEGY_PRO_PH_LESSONS.filter((lesson) => lesson.code.startsWith('PH'));
const STRATEGY_PRO_ONLY_LESSONS = STRATEGY_PRO_PH_LESSONS.filter(
  (lesson) => !lesson.code.startsWith('PH'),
);

const RAW_ACADEMY_MODULES: AcademyModule[] = [
  ...FOUNDATIONS_MODULES,
  ...FOREX_MODULES,
  ...INDICES_MODULES,
  ...STOCKS_MODULES,
  ...CRYPTO_MODULES,
  ...PH_MODULES,
  ...ADVANCED_MODULES,
  ...STRATEGY_PRO_ONLY_MODULES,
];

const RAW_SYLLABUS_LESSONS: DecoupledLessonNode[] = [
  ...FOUNDATIONS_LESSONS,
  ...FOREX_LESSONS,
  ...INDICES_LESSONS,
  ...STOCKS_LESSONS,
  ...CRYPTO_LESSONS,
  ...PH_LESSONS,
  ...ADVANCED_LESSONS,
  ...STRATEGY_PRO_ONLY_LESSONS,
];

export const ACADEMY_MODULES: AcademyModule[] = deepLocalizeMarketTimes(
  RAW_ACADEMY_MODULES,
  LOCALIZE_OPTIONS,
);

export const ALL_SYLLABUS_LESSONS: DecoupledLessonNode[] = deepLocalizeMarketTimes(
  RAW_SYLLABUS_LESSONS,
  LOCALIZE_OPTIONS,
);

function getModuleIdsForPath(pathId: AcademyPathId): string[] {
  return ACADEMY_MODULES.filter((mod) => mod.pathId === pathId).map((mod) => mod.id);
}

export const ACADEMY_PATHS: AcademyPathMeta[] = [
  {
    id: 'master_foundations',
    pillar: 'foundations',
    title: 'Master Trading Foundations',
    subtitle:
      'Universal 6-module core required across every market: intro, markets, charts, technical analysis, risk math, and psychology.',
    badge: 'Core Track',
    levelRange: 'Level 1',
    accentToken: 'brand',
    moduleIds: getModuleIdsForPath('master_foundations'),
  },
  {
    id: 'forex',
    pillar: 'specializations',
    title: 'Forex Specialization',
    subtitle:
      'Currency pairs, pips/lots, margin mechanics, global sessions in PH time, central bank fundamentals, and structured FX playbooks.',
    badge: 'FX Track',
    levelRange: 'Levels 2–4',
    accentToken: 'info',
    moduleIds: getModuleIdsForPath('forex'),
  },
  {
    id: 'indices',
    pillar: 'specializations',
    title: 'Stock Indices Specialization',
    subtitle:
      'US100/US500/US30 benchmarks, futures vs. CFDs vs. ETFs, tick math, volatility behavior, macro yields, and NY open playbooks.',
    badge: 'Indices Track',
    levelRange: 'Levels 2–4',
    accentToken: 'amber',
    moduleIds: getModuleIdsForPath('indices'),
  },
  {
    id: 'stocks',
    pillar: 'specializations',
    title: 'Global Stocks Specialization',
    subtitle:
      'Equity ownership, execution mechanics, financial statements & valuation, sector rotation, active playbooks, and optional ETFs/options.',
    badge: 'Equities Track',
    levelRange: 'Levels 2–4',
    accentToken: 'bull',
    moduleIds: getModuleIdsForPath('stocks'),
  },
  {
    id: 'crypto',
    pillar: 'specializations',
    title: 'Cryptocurrency Specialization',
    subtitle:
      'Blockchain & wallet security, spot vs. perpetuals & liquidation math, BTC dominance cycles, on-chain derivatives, and 24/7 playbooks.',
    badge: 'Crypto Track',
    levelRange: 'Levels 2–4',
    accentToken: 'bear',
    moduleIds: getModuleIdsForPath('crypto'),
  },
  {
    id: 'philippines_pse',
    pillar: 'specializations',
    title: 'Philippine Market & PSE Track',
    subtitle:
      'Optional local curriculum covering PSE & PSEi, board lots, 9:30 AM–3:00 PM PH hours, REITs/MP2/Bonds, local fees/taxes, and BSP/SEC safety.',
    badge: 'PH Optional',
    levelRange: 'Level 2',
    optional: true,
    accentToken: 'amber',
    moduleIds: getModuleIdsForPath('philippines_pse'),
  },
  {
    id: 'advanced_price_action',
    pillar: 'advanced',
    title: 'Market Structure & SMC Frameworks',
    subtitle:
      'Advanced price-action frameworks covering BOS/CHoCH, liquidity sweeps, Order Blocks, FVGs, SMT Divergence, and Power of Three.',
    badge: 'Price Action',
    levelRange: 'Levels 3–4',
    accentToken: 'brand',
    moduleIds: getModuleIdsForPath('advanced_price_action'),
  },
  {
    id: 'strategy_pro',
    pillar: 'advanced',
    title: 'Strategy Development & Pro Portfolio',
    subtitle:
      'Objective rulebook design, backtesting, forward testing, expectancy, institutional daily routines, correlation risk, and capital scaling.',
    badge: 'Pro Track',
    levelRange: 'Levels 4–5',
    accentToken: 'bull',
    moduleIds: getModuleIdsForPath('strategy_pro'),
  },
];

// Fast O(1) lookup indexes built once at module load
const TOPIC_BY_SLUG_MAP = new Map<string, DecoupledLessonNode>();
const TOPIC_BY_CODE_MAP = new Map<string, DecoupledLessonNode>();
const MODULE_BY_ID_MAP = new Map<string, AcademyModule>();
const MODULE_BY_TOPIC_CODE_MAP = new Map<string, AcademyModule>();
const PATH_BY_ID_MAP = new Map<AcademyPathId, AcademyPathMeta>();
const TOPICS_BY_LEVEL_MAP = new Map<MasteryLevel, DecoupledLessonNode[]>([
  [1, []],
  [2, []],
  [3, []],
  [4, []],
  [5, []],
]);
const TOPICS_BY_DEEP_SLUG_MAP = new Map<string, DecoupledLessonNode[]>();

for (const topic of ALL_SYLLABUS_LESSONS) {
  TOPIC_BY_SLUG_MAP.set(topic.slug, topic);
  TOPIC_BY_CODE_MAP.set(topic.code, topic);

  const levelBucket = TOPICS_BY_LEVEL_MAP.get(topic.level);
  if (levelBucket) {
    levelBucket.push(topic);
  }

  if (topic.linkedDeepLessonSlug) {
    const existing = TOPICS_BY_DEEP_SLUG_MAP.get(topic.linkedDeepLessonSlug) ?? [];
    existing.push(topic);
    TOPICS_BY_DEEP_SLUG_MAP.set(topic.linkedDeepLessonSlug, existing);
  }
}

for (const mod of ACADEMY_MODULES) {
  MODULE_BY_ID_MAP.set(mod.id, mod);
  for (const lessonCode of mod.lessonCodes) {
    MODULE_BY_TOPIC_CODE_MAP.set(lessonCode, mod);
  }
}

for (const pathMeta of ACADEMY_PATHS) {
  PATH_BY_ID_MAP.set(pathMeta.id, pathMeta);
}

const MODULES_BY_PATH_MAP = new Map<AcademyPathId, AcademyModule[]>();
const TOPICS_BY_PATH_MAP = new Map<AcademyPathId, DecoupledLessonNode[]>();

for (const pathMeta of ACADEMY_PATHS) {
  const mods = pathMeta.moduleIds
    .map((id) => MODULE_BY_ID_MAP.get(id))
    .filter((mod): mod is AcademyModule => Boolean(mod));
  MODULES_BY_PATH_MAP.set(pathMeta.id, mods);

  const pathTopics: DecoupledLessonNode[] = [];
  for (const mod of mods) {
    for (const code of mod.lessonCodes) {
      const topic = TOPIC_BY_CODE_MAP.get(code);
      if (topic) {
        pathTopics.push(topic);
      }
    }
  }
  TOPICS_BY_PATH_MAP.set(pathMeta.id, pathTopics);
}

export function getTopicBySlug(slug: string): DecoupledLessonNode | undefined {
  return TOPIC_BY_SLUG_MAP.get(slug.trim());
}

export function getTopicByCode(code: string): DecoupledLessonNode | undefined {
  return TOPIC_BY_CODE_MAP.get(code.trim());
}

export function getModuleById(id: string): AcademyModule | undefined {
  return MODULE_BY_ID_MAP.get(id.trim());
}

export function getPathById(pathId: AcademyPathId): AcademyPathMeta | undefined {
  return PATH_BY_ID_MAP.get(pathId);
}

export function getModuleForTopic(code: string): AcademyModule | undefined {
  return MODULE_BY_TOPIC_CODE_MAP.get(code.trim());
}

export function getTopicsForModule(moduleId: string): DecoupledLessonNode[] {
  const mod = MODULE_BY_ID_MAP.get(moduleId.trim());
  if (!mod) {
    return [];
  }

  const topics: DecoupledLessonNode[] = [];
  for (const code of mod.lessonCodes) {
    const topic = TOPIC_BY_CODE_MAP.get(code);
    if (topic) {
      topics.push(topic);
    }
  }
  return topics;
}

export function getModulesForPath(pathId: AcademyPathId): AcademyModule[] {
  return [...(MODULES_BY_PATH_MAP.get(pathId) ?? [])];
}

export function getTopicsForPath(pathId: AcademyPathId): DecoupledLessonNode[] {
  return [...(TOPICS_BY_PATH_MAP.get(pathId) ?? [])];
}

export function getPrevNextTopics(code: string): {
  prev: DecoupledLessonNode | null;
  next: DecoupledLessonNode | null;
} {
  const normalizedCode = code.trim();
  const mod = MODULE_BY_TOPIC_CODE_MAP.get(normalizedCode);

  const orderedTopics = mod
    ? TOPICS_BY_PATH_MAP.get(mod.pathId) ?? getTopicsForModule(mod.id)
    : ALL_SYLLABUS_LESSONS;

  const index = orderedTopics.findIndex((topic) => topic.code === normalizedCode);
  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? orderedTopics[index - 1] : null,
    next: index < orderedTopics.length - 1 ? orderedTopics[index + 1] : null,
  };
}

export function getTopicsByLevel(level: MasteryLevel): DecoupledLessonNode[] {
  return [...(TOPICS_BY_LEVEL_MAP.get(level) ?? [])];
}

export function getTopicsLinkedToDeepLesson(deepSlug: string): DecoupledLessonNode[] {
  return [...(TOPICS_BY_DEEP_SLUG_MAP.get(deepSlug.trim()) ?? [])];
}

export function getAssessmentQuestionsForLevel(
  level: MasteryLevel,
): LevelAssessmentQuestionItem[] {
  const TARGET_QUESTION_COUNT = 10;
  const levelTopics = TOPICS_BY_LEVEL_MAP.get(level) ?? [];

  if (levelTopics.length === 0) {
    return [];
  }

  if (levelTopics.length <= TARGET_QUESTION_COUNT) {
    return levelTopics.map((topic) => ({
      topicCode: topic.code,
      topicTitle: topic.title,
      quiz: topic.quiz,
    }));
  }

  const selected: LevelAssessmentQuestionItem[] = [];
  const usedIndices = new Set<number>();

  for (let slot = 0; slot < TARGET_QUESTION_COUNT; slot += 1) {
    const index = Math.floor((slot * levelTopics.length) / TARGET_QUESTION_COUNT);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      const topic = levelTopics[index];
      selected.push({
        topicCode: topic.code,
        topicTitle: topic.title,
        quiz: topic.quiz,
      });
    }
  }

  return selected;
}
