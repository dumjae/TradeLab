import type {
  AppLearningContext,
  CurriculumLevel,
  ExplanationStyle,
} from './academy';

export type ResourceSourceType =
  | 'youtube'
  | 'tradingview'
  | 'tradelab_original'
  | 'other_educator';

export type ResourceContentType =
  | 'video'
  | 'chart_example'
  | 'diagram'
  | 'walkthrough';

export type VerificationStatus =
  | 'pending_review'
  | 'verified'
  | 'published'
  | 'unavailable'
  | 'archived';

export type SegmentVerificationMethod =
  | 'youtube_chapters'
  | 'verified_transcript'
  | 'manual_editorial';

export type CompletionStatus = 'not_started' | 'in_progress' | 'watched';

export type DifficultConceptTrigger =
  | 'manual_bookmark'
  | 'explain_differently'
  | 'practice_mistake';

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  sourceType: ResourceSourceType;
  sourceName: string;
  sourceUrl: string;
  externalVideoId: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  contentType: ResourceContentType;
  licenseStatus: string;
  attribution: string;
  nonEndorsementNotice: boolean;
  verificationStatus: VerificationStatus;
  qualityScore: number;
  embeddable: boolean;
  lastCheckedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceSegment {
  id: string;
  resourceId: string;
  startSeconds: number;
  endSeconds: number | null;
  segmentTitle: string;
  explanation: string;
  verificationMethod: SegmentVerificationMethod;
  verifiedBy: string | null;
  verifiedAt: string;
}

export interface LessonResourceMapping {
  id: string;
  lessonId: string;
  lessonSlug: string;
  resourceId: string;
  relevanceScore: number;
  displayOrder: number;
  beforeWatchContext: string;
  afterWatchTakeaways: string[];
  editorialNotes: string;
}

export interface LessonResourceWithDetails {
  mapping: LessonResourceMapping;
  resource: EducationalResource;
  segments: ResourceSegment[];
}

export interface UserSavedResource {
  id: string;
  userId: string;
  resourceId: string;
  lessonId: string | null;
  lessonSlug?: string;
  savedTimestampSeconds: number | null;
  savedSegmentId: string | null;
  curriculumLevel: CurriculumLevel;
  personalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLearningHistory {
  id: string;
  userId: string;
  resourceId: string;
  lessonId: string | null;
  lessonSlug?: string;
  lastPositionSeconds: number;
  completionStatus: CompletionStatus;
  lastViewedAt: string;
}

export interface UserDifficultConcept {
  id: string;
  userId: string;
  lessonId: string;
  lessonSlug: string;
  conceptKey: string;
  conceptLabel: string;
  triggerSources: DifficultConceptTrigger[];
  mistakeCount: number;
  consecutiveCorrect: number;
  isMastered: boolean;
  masteredAt: string | null;
  updatedAt: string;
}

export interface DiscoveryCandidate {
  externalVideoId: string;
  title: string;
  channelTitle: string;
  description: string;
  sourceUrl: string;
  thumbnailUrl: string;
  durationSeconds: number | null;
  embeddable: boolean;
  relevanceScore: number;
  detectedChapters: Array<{
    startSeconds: number;
    endSeconds: number | null;
    segmentTitle: string;
  }>;
}

export interface ResourceDiscoveryCacheRecord {
  id: string;
  queryHash: string;
  lessonId: string | null;
  provider: 'youtube_data_api' | 'tradingview_manual' | 'other';
  queryText: string;
  results: DiscoveryCandidate[];
  expiresAt: string;
  createdAt: string;
}

export interface MentorCitation {
  resourceId: string;
  segmentId?: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  startSeconds?: number;
  endSeconds?: number | null;
  segmentTitle?: string;
  verificationMethod?: SegmentVerificationMethod;
}

export type MentorMessageRole = 'user' | 'assistant';

export type MentorResponseSourceType =
  | 'verified_source'
  | 'ai_mentor_explanation'
  | 'deterministic_fallback';

export interface MentorChatMessage {
  id: string;
  role: MentorMessageRole;
  content: string;
  sourceType: MentorResponseSourceType;
  style?: ExplanationStyle;
  citations: MentorCitation[];
  isPracticeGuardActive: boolean;
  createdAt: string;
}

export interface ExplainDifferentlyRequest {
  lessonSlug: string;
  conceptKey: string;
  style: ExplanationStyle;
  mode: AppLearningContext;
  userQuestion?: string;
  activeQuestionId?: string;
  hasSubmittedAnswer?: boolean;
}

export interface ExplainDifferentlyResponse {
  style: ExplanationStyle;
  headline: string;
  explanation: string;
  steps: string[];
  keyTakeaway: string;
  sourceType: MentorResponseSourceType;
  isPracticeGuardActive: boolean;
  citations: MentorCitation[];
}

export interface CreateResourceInput {
  lessonId: string;
  lessonSlug: string;
  title: string;
  description: string;
  sourceType: ResourceSourceType;
  sourceName: string;
  sourceUrl: string;
  externalVideoId?: string | null;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  contentType: ResourceContentType;
  licenseStatus?: string;
  attribution: string;
  nonEndorsementNotice?: boolean;
  verificationStatus?: VerificationStatus;
  qualityScore?: number;
  embeddable?: boolean;
  beforeWatchContext?: string;
  afterWatchTakeaways?: string[];
  editorialNotes?: string;
}

export interface CreateSegmentInput {
  resourceId: string;
  startSeconds: number;
  endSeconds: number | null;
  segmentTitle: string;
  explanation: string;
  verificationMethod: SegmentVerificationMethod;
}

export interface UpdateResourceStatusInput {
  resourceId: string;
  verificationStatus: VerificationStatus;
  qualityScore?: number;
  embeddable?: boolean;
}
