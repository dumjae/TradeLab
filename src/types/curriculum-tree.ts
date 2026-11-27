import type { DiagramKind } from './academy';

export type MasteryLevel = 1 | 2 | 3 | 4 | 5;
export type AcademyPillarId = 'foundations' | 'specializations' | 'advanced' | 'practical_lab' | 'evaluation';
export type AcademyPathId =
  | 'master_foundations'
  | 'advanced_price_action'
  | 'forex'
  | 'indices'
  | 'stocks'
  | 'crypto'
  | 'strategy_pro'
  | 'philippines_pse';
export type SupportedMarketTag = 'all' | 'forex' | 'indices' | 'stocks' | 'crypto' | 'pse';

export interface SyllabusQuizQuestion {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  rationale: string;
  commonTrap: string;
}

export interface DecoupledLessonNode {
  id: string;
  code: string;
  slug: string;
  title: string;
  overviewEn: string;
  overviewTaglish: string;
  objectives: string[];
  keyPoints: string[];
  limitationsNote?: string;
  practicalExample: string;
  level: MasteryLevel;
  pillar: AcademyPillarId;
  supportedMarkets: SupportedMarketTag[];
  prerequisiteCodes: string[];
  optional?: boolean;
  estimatedMinutes: number;
  linkedDeepLessonSlug?: string;
  diagramKind: DiagramKind;
  quiz: SyllabusQuizQuestion;
}

export interface AcademyModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  pathId: AcademyPathId;
  pillar: AcademyPillarId;
  level: MasteryLevel;
  optional?: boolean;
  disclaimer?: string;
  lessonCodes: string[];
}

export interface AcademyPathMeta {
  id: AcademyPathId;
  pillar: AcademyPillarId;
  title: string;
  subtitle: string;
  badge: string;
  levelRange: string;
  optional?: boolean;
  accentToken: 'brand' | 'bull' | 'amber' | 'info' | 'bear';
  moduleIds: string[];
}

export interface TopicProgressRecord {
  topicCode: string;
  readingCompleted: boolean;
  quizPassed: boolean;
  quizScorePct: number;
  practicalCompleted: boolean;
  completed: boolean;
  updatedAt: string;
}

export interface LevelAssessmentResult {
  level: MasteryLevel;
  scorePct: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  certificateCode: string | null;
  completedAt: string;
}

export interface GlossaryTermEntry {
  id: string;
  term: string;
  acronym?: string;
  category: 'fundamentals' | 'charts' | 'smc' | 'risk' | 'psychology' | 'forex' | 'indices' | 'stocks' | 'crypto' | 'philippines';
  definitionEn: string;
  definitionTaglish: string;
  example: string;
  relatedTopicCode?: string;
}
