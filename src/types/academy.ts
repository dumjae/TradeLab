export type CurriculumLevel = 'beginner' | 'intermediate' | 'advanced';

export type LessonMarketCategory = 'general' | 'forex' | 'indices' | 'crypto' | 'stocks';

export type LessonStage =
  | 'foundations'
  | 'price_action_smc'
  | 'market_playbooks'
  | 'execution_edge'
  | 'steady_profitability';

export type LearningViewMode = 'text' | 'diagram' | 'video' | 'chart';

export type AppLearningContext =
  | 'lesson'
  | 'tutorial'
  | 'practice'
  | 'trading_lab'
  | 'library';

export type ExplanationStyle =
  | 'beginner_friendly'
  | 'step_by_step_visual'
  | 'real_chart_example'
  | 'analogy_based'
  | 'comparison'
  | 'common_mistakes';

export interface ExplanationStyleMeta {
  id: ExplanationStyle;
  label: string;
  shortLabel: string;
  description: string;
}

export interface ExplanationStyleContent {
  style: ExplanationStyle;
  headline: string;
  summary: string;
  steps: string[];
  keyTakeaway: string;
  practiceSafeHint: string;
}

export interface TerminologyEntry {
  term: string;
  shortCode?: string;
  definition: string;
  example: string;
}

export interface LessonSection {
  id: string;
  heading: string;
  body: string;
  bulletPoints: string[];
  keyTakeaway: string;
}

export type DiagramKind =
  | 'chart_fundamentals'
  | 'candlestick_anatomy'
  | 'market_structure'
  | 'support_demand'
  | 'liquidity_pools'
  | 'equal_highs_lows'
  | 'liquidity_sweep_vs_breakout'
  | 'fair_value_gap'
  | 'order_block_choch'
  | 'multi_timeframe'
  | 'market_sessions'
  | 'crypto_funding_dominance'
  | 'stocks_orb_gap'
  | 'risk_reward_model'
  | 'trade_management_journal';

export interface BeginnerFaqItem {
  question: string;
  answer: string;
}

export interface DiagramAnnotation {
  id: string;
  label: string;
  sublabel: string;
  tone: 'bullish' | 'bearish' | 'liquidity' | 'neutral';
}

export interface DiagramConfig {
  kind: DiagramKind;
  title: string;
  subtitle: string;
  caption: string;
  legend: Array<{ label: string; colorToken: string }>;
  annotations: DiagramAnnotation[];
  walkthroughSteps: string[];
}

export interface PracticeQuestionOption {
  id: string;
  label: string;
}

export interface PracticeQuestion {
  id: string;
  lessonSlug: string;
  conceptKey: string;
  prompt: string;
  scenarioId?: string;
  options: PracticeQuestionOption[];
  correctOptionId: string;
  hints: string[];
  postSubmissionRationale: string;
  commonTrapNote: string;
}

export interface CandlePoint {
  /** Unix timestamp in seconds (UTCTimestamp compatible with lightweight-charts) */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ChartPriceLineRole =
  | 'buy_side_liquidity'
  | 'sell_side_liquidity'
  | 'bos'
  | 'fvg_high'
  | 'fvg_low'
  | 'entry'
  | 'stop_loss'
  | 'take_profit'
  | 'support_resistance';

export interface ChartPriceLine {
  id: string;
  price: number;
  title: string;
  color: string;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  role: ChartPriceLineRole;
}

export type ChartReplayStage = 'before' | 'trigger' | 'after';

export interface ChartMarkerSpec {
  id: string;
  time: number;
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: string;
  shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
  text: string;
  stage: ChartReplayStage;
}

export interface ChartReplayStages {
  beforeEndIndex: number;
  triggerEndIndex: number;
  afterEndIndex: number;
  beforeSummary: string;
  triggerSummary: string;
  afterSummary: string;
}

export type ChartScenarioCategory =
  | 'market_structure'
  | 'liquidity_pool'
  | 'equal_highs_lows'
  | 'liquidity_sweep'
  | 'true_breakout'
  | 'fair_value_gap'
  | 'risk_setup';

export type ChartScenarioClassification =
  | 'liquidity_sweep'
  | 'true_breakout'
  | 'bullish_bos'
  | 'bearish_bos'
  | 'bullish_fvg'
  | 'bearish_fvg'
  | 'valid_rr_setup';

export interface ChartScenario {
  id: string;
  lessonSlug: string;
  title: string;
  symbol: string;
  timeframe: string;
  category: ChartScenarioCategory;
  description: string;
  isPracticeEligible: boolean;
  isSweep?: boolean;
  correctClassification: ChartScenarioClassification;
  candles: CandlePoint[];
  priceLines: ChartPriceLine[];
  markers: ChartMarkerSpec[];
  replay: ChartReplayStages;
  teachingTakeaways: string[];
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  plainEnglishSummary?: string;
  beginnerFaq?: BeginnerFaqItem[];
  level: CurriculumLevel;
  marketCategory: LessonMarketCategory;
  learningStage: LessonStage;
  moduleOrder: number;
  conceptKey: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  prerequisites: string[];
  terminology: TerminologyEntry[];
  sections: LessonSection[];
  diagramConfig: DiagramConfig;
  chartScenarioIds: string[];
  fallbackExplanations: Record<ExplanationStyle, ExplanationStyleContent>;
  practiceQuestions: PracticeQuestion[];
}
