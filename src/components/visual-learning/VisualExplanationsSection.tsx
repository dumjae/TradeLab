import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Compass,
  ExternalLink,
  Flag,
  HelpCircle,
  Layers,
  Lightbulb,
  LineChart,
  Play,
  PlayCircle,
  Plus,
  TrendingDown,
  TrendingUp,
  Youtube,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getChartScenariosForLesson } from '../../data/chartScenarios';
import { LESSON_TAGLISH_SUMMARIES, UI_COPY } from '../../data/taglishTranslations';
import { expandAcronyms } from '../../lib/acronymHelper';
import { localizeMarketTimes } from '../../lib/marketTime';
import {
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  formatTimestamp,
  isValidYouTubeVideoId,
} from '../../lib/youtubeUtils';
import { recordConceptStruggle } from '../../services/difficultConceptsService';
import {
  recordLearningProgress,
  saveResourceBookmark,
} from '../../services/personalLibraryService';
import type {
  CurriculumLevel,
  DiagramKind,
  LearningViewMode,
  Lesson,
} from '../../types/academy';
import type {
  LessonResourceWithDetails,
  ResourceSegment,
} from '../../types/visual-learning';
import { BeforeAfterChartViewer } from '../charts/BeforeAfterChartViewer';
import { BookmarkNotesDialog } from './BookmarkNotesDialog';
import { ConceptDiagramSvg } from './ConceptDiagramSvg';
import { LazyVideoPlayer } from './LazyVideoPlayer';
import { TimestampNavigator } from './TimestampNavigator';

export interface VisualExplanationsSectionProps {
  lesson: Lesson;
  resources: LessonResourceWithDetails[];
  tutorialMode?: boolean;
  isAdmin?: boolean;
  initialMode?: LearningViewMode;
  initialResourceId?: string | null;
  initialTimestampSeconds?: number | null;
  onSelectCitationTarget?: (resourceId: string, startSeconds?: number) => void;
}

const MODE_TABS: Array<{
  id: LearningViewMode;
  label: string;
  shortEn: string;
  shortTaglish: string;
  icon: typeof BookOpen;
}> = [
  {
    id: 'text',
    label: 'Text Explanation',
    shortEn: 'Text',
    shortTaglish: 'Paliwanag',
    icon: BookOpen,
  },
  {
    id: 'diagram',
    label: 'Diagram Explanation',
    shortEn: 'Diagram',
    shortTaglish: 'Diagram',
    icon: Layers,
  },
  {
    id: 'video',
    label: 'Video Explanation',
    shortEn: 'Video',
    shortTaglish: 'Video',
    icon: PlayCircle,
  },
  {
    id: 'chart',
    label: 'Historical Chart Example',
    shortEn: 'Historical Chart',
    shortTaglish: 'Chart',
    icon: LineChart,
  },
];

const TUTORIAL_STEPS: Record<
  LearningViewMode,
  { step: number; en: string; taglish: string; nextMode?: LearningViewMode }
> = {
  text: {
    step: 1,
    en: 'Read the short summary and key rule first.',
    taglish: 'Basahin muna ang maikling buod at pinaka-tandaan.',
    nextMode: 'diagram',
  },
  diagram: {
    step: 2,
    en: 'Tap each step to see the visual pattern.',
    taglish: 'I-tap bawat hakbang para makita ang malinaw na pattern.',
    nextMode: 'video',
  },
  video: {
    step: 3,
    en: 'Jump straight to key YouTube timestamps.',
    taglish: 'Diretso na sa mga mahahalagang timestamp sa YouTube.',
    nextMode: 'chart',
  },
  chart: {
    step: 4,
    en: 'Step through Before → Trigger → After.',
    taglish: 'Sundan ang Before → Trigger → After sa totoong chart.',
  },
};

interface CheatCardDirectionCopy {
  bullishSignEn: string;
  bullishSignTaglish: string;
  bullishRuleEn: string;
  bullishRuleTaglish: string;
  bearishSignEn: string;
  bearishSignTaglish: string;
  bearishRuleEn: string;
  bearishRuleTaglish: string;
}

const DIAGRAM_CHEAT_CARDS: Record<DiagramKind, CheatCardDirectionCopy> = {
  chart_fundamentals: {
    bullishSignEn: 'Rising green candles with HH/HL + expanding green Volume on the right Y-axis.',
    bullishSignTaglish: 'Umaangat na green candles (HH/HL) na may malakas na green Volume sa ibaba.',
    bullishRuleEn: 'Confirm the HTF (1H/4H/1D) trend first, then read the countdown timer before candle close.',
    bullishRuleTaglish: 'Silipin muna ang HTF (1H/4H/1D) trend at hintayin ang candle close bago pumasok.',
    bearishSignEn: 'Falling red candles with LH/LL + heavy red Sell Volume spike & wide Bid/Ask spread.',
    bearishSignTaglish: 'Bumababang red candles (LH/LL) na may malakas na red Sell Volume at malapad na Spread.',
    bearishRuleEn: 'Avoid buying into heavy sell volume; check Bid/Ask spread before placing Short orders.',
    bearishRuleTaglish: 'Huwag salubungin ang malakas na sell volume; i-check ang Bid/Ask spread bago mag-Short.',
  },
  candlestick_anatomy: {
    bullishSignEn: 'Green candle: OPEN at bottom, CLOSE at top — strong body & long lower wick show buyers won.',
    bullishSignTaglish: 'Green candle: OPEN sa ibaba, CLOSE sa itaas — makapal na body at mahabang lower wick = panalo buyers.',
    bullishRuleEn: 'Wait for the candle timer to lock GREEN before confirming bullish momentum.',
    bullishRuleTaglish: 'Hintaying mag-close nang GREEN ang candle bago sabihing malakas ang buyers.',
    bearishSignEn: 'Red candle: OPEN at top, CLOSE at bottom — long upper wick shows sellers rejected higher prices.',
    bearishSignTaglish: 'Red candle: OPEN sa itaas, CLOSE sa ibaba — mahabang upper wick = na-reject ng sellers.',
    bearishRuleEn: 'Never ignore a strong red body close below support — it invalidates weak Long entries.',
    bearishRuleTaglish: 'Huwag balewalain ang malakas na red close sa ilalim ng support — babala ito sa Long.',
  },
  market_structure: {
    bullishSignEn: 'Ascending staircase of HH (Higher Highs) and HL (Higher Lows) with body-close BOS Up.',
    bullishSignTaglish: 'Paakyat na hagdan ng HH (Higher Highs) at HL (Higher Lows) na may body-close BOS pataas.',
    bullishRuleEn: 'Buy pullbacks above the protected HL; only a full close below HL breaks the uptrend.',
    bullishRuleTaglish: 'Bumili sa pullback sa itaas ng HL; masisira lang ang uptrend kapag nag-close sa ilalim nito.',
    bearishSignEn: 'Descending staircase of LH (Lower Highs) and LL (Lower Lows) with body-close BOS Down.',
    bearishSignTaglish: 'Pababang hagdan ng LH (Lower Highs) at LL (Lower Lows) na may body-close BOS pababa.',
    bearishRuleEn: 'Short rallies below the protected LH; invalidation happens if price closes above LH.',
    bearishRuleTaglish: 'Mag-Short sa bounce sa ilalim ng LH; invalid ang setup kapag nag-close sa itaas ng LH.',
  },
  support_demand: {
    bullishSignEn: 'Price taps a fresh Support / Demand Floor and prints strong bullish rejection wicks.',
    bullishSignTaglish: 'Tumama ang presyo sa sariwang Support / Demand Floor at mabilis na tumalbog pataas.',
    bullishRuleEn: 'Enter near the Demand zone with SL safely below the zone — never buy right into Supply.',
    bullishRuleTaglish: 'Pumasok malapit sa Demand na may SL sa ilalim — huwag bumili mismo sa kisame (Supply).',
    bearishSignEn: 'Price rallies into a fresh Resistance / Supply Ceiling and rejects sharply downward.',
    bearishSignTaglish: 'Umakyat ang presyo sa sariwang Resistance / Supply Ceiling at tinulak pababa ng sellers.',
    bearishRuleEn: 'Short from Supply with SL above the ceiling; take profit before reaching major Demand.',
    bearishRuleTaglish: 'Mag-Short mula sa Supply na may SL sa itaas; mag-TP bago umabot sa malakas na Demand.',
  },
  liquidity_pools: {
    bullishSignEn: 'Price sweeps SSL (Sell-Side Liquidity) below lows, then quickly reclaims the range.',
    bullishSignTaglish: 'Na-sweep ang SSL (Sell-Side Liquidity) sa ilalim ng lows tapos mabilis bumalik sa loob.',
    bullishRuleEn: 'After SSL is raided and reclaimed, target resting BSL (Buy-Side Liquidity) above highs.',
    bullishRuleTaglish: 'Kapag na-raid at nabawi ang SSL, gawing target ang BSL (Buy-Side Liquidity) sa itaas.',
    bearishSignEn: 'Price sweeps BSL (Buy-Side Liquidity) above highs, traps late buyers, and closes back inside.',
    bearishSignTaglish: 'Na-sweep ang BSL (Buy-Side Liquidity) sa itaas ng highs, na-trap ang buyers at bumagsak.',
    bearishRuleEn: 'After BSL is swept and rejected, target resting SSL (Sell-Side Liquidity) below lows.',
    bearishRuleTaglish: 'Kapag na-sweep at na-reject ang BSL, gawing target ang SSL (Sell-Side Liquidity) sa ibaba.',
  },
  equal_highs_lows: {
    bullishSignEn: 'Matching EQL (Equal Lows) attract stops below — wait for the raid wick & reclaim UP.',
    bullishSignTaglish: 'Pantay na EQL (Equal Lows) ang magnet ng stops — hintayin ang raid wick at bawi pataas.',
    bullishRuleEn: 'Avoid placing tight SL right under obvious EQL; enter Long after the sweep completes.',
    bullishRuleTaglish: 'Huwag ilagay ang SL mismo sa ilalim ng EQL; mag-Long pagkatapos ma-sweep at mabawi.',
    bearishSignEn: 'Matching EQH (Equal Highs) attract stops above — wait for the raid wick & rejection DOWN.',
    bearishSignTaglish: 'Pantay na EQH (Equal Highs) ang magnet ng stops — hintayin ang raid wick at bagsak pababa.',
    bearishRuleEn: 'Never blindly short a double top before the stop raid; confirm rejection close below EQH.',
    bearishRuleTaglish: 'Huwag basta mag-Short sa double top bago ang raid; kumpirmahin muna ang close sa ilalim ng EQH.',
  },
  liquidity_sweep_vs_breakout: {
    bullishSignEn: 'Wick below floor + body close above = Bullish Sweep; full green body above resistance = True Breakout.',
    bullishSignTaglish: 'Wick sa ilalim + close sa itaas = Bullish Sweep; buong green close sa labas = True Breakout.',
    bullishRuleEn: 'Let the candle finish closing so you know whether to fade a sweep or ride a breakout.',
    bullishRuleTaglish: 'Laging hintayin ang candle close para malaman kung fakeout sweep o totoong breakout.',
    bearishSignEn: 'Wick above ceiling + body close below = Bearish Sweep; full red body below support = True Breakdown.',
    bearishSignTaglish: 'Wick sa itaas + close sa ilalim = Bearish Sweep; buong red close sa labas = True Breakdown.',
    bearishRuleEn: 'Do not buy weak wicks above resistance; a red close back inside signals sellers took over.',
    bearishRuleTaglish: 'Huwag habulin ang wick sa itaas ng resistance; ang red close pabalik sa loob ay trap.',
  },
  fair_value_gap: {
    bullishSignEn: '3-candle upward displacement leaves an unfilled Bullish FVG between Candle 1 High & Candle 3 Low.',
    bullishSignTaglish: '3-candle na mabilis na akyat na may bakanteng Bullish FVG sa pagitan ng C1 High at C3 Low.',
    bullishRuleEn: 'Wait for a calm pullback into the Bullish FVG in an uptrend instead of chasing green candles.',
    bullishRuleTaglish: 'Hintayin ang kalmadong pullback papasok sa Bullish FVG sa halip na habulin ang pump.',
    bearishSignEn: '3-candle downward displacement leaves an unfilled Bearish FVG between Candle 1 Low & Candle 3 High.',
    bearishSignTaglish: '3-candle na mabilis na bagsak na may bakanteng Bearish FVG sa pagitan ng C1 Low at C3 High.',
    bearishRuleEn: 'Wait for a calm rally back into the Bearish FVG in a downtrend; invalid if price closes above it.',
    bearishRuleTaglish: 'Hintayin ang rally pabalik sa Bearish FVG; invalid ito kapag nag-close ang candle sa itaas.',
  },
  order_block_choch: {
    bullishSignEn: 'Downtrend breaks upward (Bullish CHoCH), leaving a Bullish OB (last red candle before rally).',
    bullishSignTaglish: 'Binasag pataas ang downtrend (Bullish CHoCH) na may Bullish OB (huling red candle bago umakyat).',
    bullishRuleEn: 'Wait for CHoCH first, then enter Long on the retest of the Bullish OB with SL below the low.',
    bullishRuleTaglish: 'Unahin ang CHoCH, tapos mag-Long sa retest ng Bullish OB na may SL sa ilalim.',
    bearishSignEn: 'Uptrend breaks downward (Bearish CHoCH), leaving a Bearish OB (last green candle before drop).',
    bearishSignTaglish: 'Binasag pababa ang uptrend (Bearish CHoCH) na may Bearish OB (huling green candle bago bumagsak).',
    bearishRuleEn: 'Wait for CHoCH down first, then enter Short on the retest of the Bearish OB with SL above the high.',
    bearishRuleTaglish: 'Unahin ang CHoCH pababa, tapos mag-Short sa retest ng Bearish OB na may SL sa itaas.',
  },
  multi_timeframe: {
    bullishSignEn: 'HTF (1H/4H) prints bullish bias + LTF (15m/5m) forms a higher low dip inside the 1H candle.',
    bullishSignTaglish: 'Pataas ang HTF (1H/4H) at gumagawa ng mas malinis na dip entry sa LTF (15m/5m).',
    bullishRuleEn: 'Align HTF direction with LTF entry for tighter Stop Loss and higher RR (Risk-to-Reward).',
    bullishRuleTaglish: 'Pagtugmain ang HTF trend at LTF entry para mas maliit ang SL at mas malaki ang RR.',
    bearishSignEn: 'HTF (1H/4H) prints bearish bias + LTF (15m/5m) rallies into resistance and rejects down.',
    bearishSignTaglish: 'Pababa ang HTF (1H/4H) at nag-reject pababa ang bounce sa LTF (15m/5m).',
    bearishRuleEn: 'Avoid fighting a bearish HTF candle just because a 5m candle turns green briefly.',
    bearishRuleTaglish: 'Huwag labanan ang bearish HTF trend dahil lang sa maikling green bounce sa 5m.',
  },
  market_sessions: {
    bullishSignEn: 'Asia builds range → London sweeps Asia Low → New York Overlap launches clean Bullish trend.',
    bullishSignTaglish: 'Range sa Asia → sweep ng Asia Low sa London → malinis na Bullish rally sa New York Overlap.',
    bullishRuleEn: 'Trade during London Open (2:00 AM–5:00 AM NY) or New York Overlap (8:00 AM–11:00 AM NY) when spreads are tightest.',
    bullishRuleTaglish: 'Mag-trade sa London Open (2:00 AM–5:00 AM NY) o New York Overlap (8:00 AM–11:00 AM NY) kung kailan malakas ang volume at manipis ang spread.',
    bearishSignEn: 'Asia builds range → London sweeps Asia High → New York Overlap drives clean Bearish selloff.',
    bearishSignTaglish: 'Range sa Asia → sweep ng Asia High sa London → malinis na Bearish drop sa New York Overlap.',
    bearishRuleEn: 'Skip slow off-hours chop and avoid chasing the very first minute of news spikes.',
    bearishRuleTaglish: 'Iwasan ang mabagal na chop hours at huwag habulin ang unang minuto ng news spike.',
  },
  crypto_funding_dominance: {
    bullishSignEn: 'Strong BTC Spot bids + negative Perps Funding create fuel for a clean Bullish Short Squeeze.',
    bullishSignTaglish: 'Malakas na BTC Spot buying + negative Funding = gasolina para sa Bullish Short Squeeze.',
    bullishRuleEn: 'Check BTC direction first and use Spot or low leverage with a defined SL.',
    bullishRuleTaglish: 'I-check muna ang BTC chart at gumamit ng Spot o mababang leverage na may malinaw na SL.',
    bearishSignEn: 'Extreme positive Funding (+0.08%) + stacked Ask Wall often triggers a Bearish Long Flush.',
    bearishSignTaglish: 'Sobrang taas na positive Funding + makapal na Ask Wall = banta ng Bearish Long Flush.',
    bearishRuleEn: 'Never chase leveraged pumps when Funding is overheated — wait for the flush & reset.',
    bearishRuleTaglish: 'Huwag humabol sa pump kapag mainit ang Funding — hintayin ang liquidation flush.',
  },
  stocks_orb_gap: {
    bullishSignEn: 'Overnight Gap UP + strong RVOL breakout above 5m ORB High while holding above VWAP.',
    bullishSignTaglish: 'Overnight Gap UP + malakas na RVOL breakout sa itaas ng 5m ORB High at VWAP.',
    bullishRuleEn: 'Wait for the first 5 minutes to frame ORB, then use Limit orders on clean pullbacks.',
    bullishRuleTaglish: 'Hintayin ang unang 5 minutes para sa ORB box at gumamit ng Limit order sa pullback.',
    bearishSignEn: 'Overnight Gap DOWN + heavy RVOL breakdown below 5m ORB Low while staying under VWAP.',
    bearishSignTaglish: 'Overnight Gap DOWN + malakas na RVOL breakdown sa ilalim ng 5m ORB Low at VWAP.',
    bearishRuleEn: 'Avoid holding blindly through Earnings gaps and never buy stocks trapped under VWAP.',
    bearishRuleTaglish: 'Iwasang mag-hold sa Earnings gap at huwag bumili ng stock na nasa ilalim ng VWAP.',
  },
  risk_reward_model: {
    bullishSignEn: 'Bullish Long 1:3 RR: fixed -1R Stop Loss below Entry, +3R Take Profit target 3× above.',
    bullishSignTaglish: 'Bullish Long 1:3 RR: naka-fix na -1R SL sa ilalim ng Entry, +3R TP 3× mas mataas.',
    bullishRuleEn: 'Risk max 1% per trade: Position Size = (Account × 1%) ÷ Stop-Loss Distance.',
    bullishRuleTaglish: 'Max 1% risk lang bawat trade: i-compute muna ang Position Size bago pumasok.',
    bearishSignEn: 'Bearish Short 1:3 RR: fixed -1R Stop Loss above Entry, +3R Take Profit target 3× below.',
    bearishSignTaglish: 'Bearish Short 1:3 RR: naka-fix na -1R SL sa itaas ng Entry, +3R TP 3× mas mababa.',
    bearishRuleEn: 'Never widen your Stop Loss on a losing Short — honor the 1% cap and daily loss limit.',
    bearishRuleTaglish: 'Huwag kailanman palaparin ang SL kapag natatalo — sundin ang 1% risk at daily loss limit.',
  },
  trade_management_journal: {
    bullishSignEn: 'Long Plan: bank partial at +1R, shift SL UP to BE (Breakeven), ride runner to +3R.',
    bullishSignTaglish: 'Long Plan: mag-partial sa +1R, ilipat ang SL pataas sa BE (Breakeven), itakbo hanggang +3R.',
    bullishRuleEn: 'Log Entry, SL, emotion, and rule adherence in your Journal right after closing.',
    bullishRuleTaglish: 'I-log ang Entry, SL, emosyon, at pagsunod sa plano sa Journal pagkatapos ng trade.',
    bearishSignEn: 'Short Plan: bank partial at +1R, shift SL DOWN to BE (Breakeven), ride drop to +3R.',
    bearishSignTaglish: 'Short Plan: mag-partial sa +1R, ilipat ang SL pababa sa BE (Breakeven), itakbo hanggang +3R.',
    bearishRuleEn: 'Do not move SL to BE too early before structure breaks; cut risk in half during drawdowns.',
    bearishRuleTaglish: 'Huwag sobrang agang mag-BE bago mabasag ang structure; bawasan ang risk kapag drawdown.',
  },
};

function getVideoSourcePriority(item: LessonResourceWithDetails): number {
  if (item.resource.sourceType === 'youtube') {
    return 0;
  }
  if (item.resource.contentType === 'video') {
    return 1;
  }
  return 2;
}

function resolveVideoThumbnailUrl(item: LessonResourceWithDetails): string | null {
  if (item.resource.thumbnailUrl) {
    return item.resource.thumbnailUrl;
  }
  const videoId = item.resource.externalVideoId;
  if (videoId && isValidYouTubeVideoId(videoId)) {
    return buildYouTubeThumbnailUrl(videoId, 'mq');
  }
  return null;
}

function resolveVideoExternalUrl(item: LessonResourceWithDetails): string | null {
  const videoId = item.resource.externalVideoId;
  if (videoId && isValidYouTubeVideoId(videoId)) {
    return buildYouTubeWatchUrl(videoId);
  }
  if (item.resource.sourceUrl.startsWith('https://')) {
    return item.resource.sourceUrl;
  }
  return null;
}

export function VisualExplanationsSection({
  lesson,
  resources,
  tutorialMode = false,
  isAdmin = false,
  initialMode = 'text',
  initialResourceId = null,
  initialTimestampSeconds = null,
}: VisualExplanationsSectionProps) {
  const { isTaglish, t } = useLanguage();
  const [activeMode, setActiveMode] = useState<LearningViewMode>(initialMode);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    initialResourceId,
  );
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [seekSeconds, setSeekSeconds] = useState<number>(initialTimestampSeconds ?? 0);
  const [seekEndSeconds, setSeekEndSeconds] = useState<number | null>(null);
  const [seekTriggerKey, setSeekTriggerKey] = useState<number>(0);

  const [expandAllSections, setExpandAllSections] = useState<boolean>(false);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState<boolean>(false);
  const [bookmarkTargetSegment, setBookmarkTargetSegment] =
    useState<ResourceSegment | null>(null);
  const [watchedIds, setWatchedIds] = useState<Record<string, boolean>>({});
  const [failedThumbIds, setFailedThumbIds] = useState<Record<string, boolean>>({});
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const taglishEntry = LESSON_TAGLISH_SUMMARIES[lesson.slug];

  const scenarios = useMemo(
    () => getChartScenariosForLesson(lesson),
    [lesson],
  );
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);

  const externalVideoResources = useMemo(
    () =>
      resources
        .filter((item) => item.resource.sourceType !== 'tradelab_original')
        .slice()
        .sort((a, b) => {
          const priorityDiff = getVideoSourcePriority(a) - getVideoSourcePriority(b);
          if (priorityDiff !== 0) {
            return priorityDiff;
          }
          return a.mapping.displayOrder - b.mapping.displayOrder;
        }),
    [resources],
  );

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode, lesson.slug]);

  useEffect(() => {
    setSelectedScenarioIndex(0);
    setActiveSegmentId(null);
    setSeekEndSeconds(null);
    setSeekTriggerKey(0);
    setStatusFeedback(null);
    setExpandAllSections(false);
  }, [lesson.slug]);

  useEffect(() => {
    if (
      initialResourceId &&
      externalVideoResources.some((item) => item.resource.id === initialResourceId)
    ) {
      setSelectedResourceId(initialResourceId);
    } else if (externalVideoResources.length > 0) {
      setSelectedResourceId(externalVideoResources[0].resource.id);
    } else {
      setSelectedResourceId(null);
    }
  }, [externalVideoResources, initialResourceId]);

  useEffect(() => {
    if (initialTimestampSeconds !== null && initialTimestampSeconds > 0) {
      setSeekSeconds(initialTimestampSeconds);
    } else {
      setSeekSeconds(0);
    }
  }, [initialTimestampSeconds, lesson.slug]);

  const activeResourceBundle = useMemo(() => {
    if (externalVideoResources.length === 0) {
      return null;
    }
    return (
      externalVideoResources.find((item) => item.resource.id === selectedResourceId) ??
      externalVideoResources[0]
    );
  }, [externalVideoResources, selectedResourceId]);

  const handleSelectVideoResource = useCallback((resourceId: string) => {
    setSelectedResourceId(resourceId);
    setActiveSegmentId(null);
    setSeekSeconds(0);
    setSeekEndSeconds(null);
    setSeekTriggerKey(0);
  }, []);

  const primaryScenario = scenarios[selectedScenarioIndex] ?? scenarios[0];
  const comparisonScenario =
    scenarios.length > 1
      ? scenarios[(selectedScenarioIndex + 1) % scenarios.length]
      : undefined;

  const notify = (message: string) => {
    setStatusFeedback(message);
    window.setTimeout(() => {
      setStatusFeedback((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  const handleSelectSegment = useCallback(
    (segment: ResourceSegment) => {
      setActiveSegmentId(segment.id);
      setSeekSeconds(segment.startSeconds);
      setSeekEndSeconds(segment.endSeconds);
      setSeekTriggerKey((prev) => prev + 1);
      if (activeResourceBundle) {
        void recordLearningProgress({
          resourceId: activeResourceBundle.resource.id,
          lessonId: lesson.id,
          lessonSlug: lesson.slug,
          lastPositionSeconds: segment.startSeconds,
          completionStatus: 'in_progress',
        });
      }
    },
    [activeResourceBundle, lesson.id, lesson.slug],
  );

  const handlePlaybackActivated = useCallback(
    (startedAt: number) => {
      if (!activeResourceBundle) {
        return;
      }
      void recordLearningProgress({
        resourceId: activeResourceBundle.resource.id,
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        lastPositionSeconds: startedAt,
        completionStatus: 'in_progress',
      });
    },
    [activeResourceBundle, lesson.id, lesson.slug],
  );

  const handleMarkWatched = async () => {
    if (!activeResourceBundle) {
      return;
    }
    await recordLearningProgress({
      resourceId: activeResourceBundle.resource.id,
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      lastPositionSeconds: activeResourceBundle.resource.durationSeconds ?? seekSeconds,
      completionStatus: 'watched',
    });
    setWatchedIds((prev) => ({ ...prev, [activeResourceBundle.resource.id]: true }));
    notify(t('Marked watched.', 'Minarkahang napanood na.'));
  };

  const handleFlagDifficult = async () => {
    await recordConceptStruggle({
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      conceptKey: lesson.conceptKey,
      conceptLabel: lesson.title,
      trigger: 'manual_bookmark',
    });
    notify(t('Added to Difficult Concepts.', 'Naidagdag sa Difficult Concepts.'));
  };

  const handleSaveBookmark = async (payload: {
    savedTimestampSeconds: number | null;
    savedSegmentId: string | null;
    curriculumLevel: CurriculumLevel;
    personalNotes: string;
  }) => {
    if (!activeResourceBundle) {
      return;
    }
    await saveResourceBookmark({
      resourceId: activeResourceBundle.resource.id,
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      savedTimestampSeconds: payload.savedTimestampSeconds,
      savedSegmentId: payload.savedSegmentId,
      curriculumLevel: payload.curriculumLevel,
      personalNotes: payload.personalNotes,
    });
    notify(t('Saved to My Library.', 'Na-save sa My Library.'));
  };

  const tutorialStep = TUTORIAL_STEPS[activeMode];

  const hasStudyNotes = Boolean(
    activeResourceBundle &&
      (activeResourceBundle.mapping.beforeWatchContext ||
        activeResourceBundle.mapping.afterWatchTakeaways.length > 0),
  );

  const plainSummaryDisplay = isTaglish
    ? (taglishEntry?.plainSummary ?? expandAcronyms(lesson.plainEnglishSummary ?? ''))
    : expandAcronyms(lesson.plainEnglishSummary ?? '');

  const activeFaqItems = useMemo(() => {
    if (isTaglish && taglishEntry?.faqs && taglishEntry.faqs.length > 0) {
      return taglishEntry.faqs;
    }
    return (lesson.beginnerFaq ?? []).map((item) => ({
      question: expandAcronyms(item.question),
      answer: expandAcronyms(item.answer),
    }));
  }, [isTaglish, taglishEntry, lesson.beginnerFaq]);

  const quickCheatCard = useMemo(() => {
    const base = DIAGRAM_CHEAT_CARDS[lesson.diagramConfig.kind];
    const bullishAnnotation = lesson.diagramConfig.annotations.find(
      (item) => item.tone === 'bullish',
    );
    const bearishAnnotation = lesson.diagramConfig.annotations.find(
      (item) => item.tone === 'bearish',
    );

    const bullishCue = isTaglish
      ? base.bullishSignTaglish
      : bullishAnnotation
        ? `${expandAcronyms(bullishAnnotation.label)} — ${expandAcronyms(bullishAnnotation.sublabel)}`
        : expandAcronyms(base.bullishSignEn);

    const bullishTakeaway = isTaglish
      ? base.bullishRuleTaglish
      : expandAcronyms(base.bullishRuleEn);

    const phTimeNote =
      lesson.diagramConfig.kind === 'market_sessions'
        ? ` (${isTaglish ? 'Lahat ng oras ay PH time' : 'All times in PH time'})`
        : '';

    const bearishCue = isTaglish
      ? base.bearishSignTaglish
      : bearishAnnotation
        ? `${expandAcronyms(bearishAnnotation.label)} — ${expandAcronyms(bearishAnnotation.sublabel)}`
        : expandAcronyms(base.bearishSignEn);

    const bearishCaution = isTaglish
      ? base.bearishRuleTaglish
      : expandAcronyms(base.bearishRuleEn);

    return {
      bullishCue: localizeMarketTimes(bullishCue),
      bullishTakeaway: localizeMarketTimes(bullishTakeaway) + phTimeNote,
      bearishCue: localizeMarketTimes(bearishCue),
      bearishCaution: localizeMarketTimes(bearishCaution),
    };
  }, [isTaglish, lesson.diagramConfig.annotations, lesson.diagramConfig.kind]);

  return (
    <section
      aria-label={`Visual explanations for ${lesson.title}`}
      className="space-y-3.5 rounded-2xl border border-terminal-border bg-terminal-surface/75 p-3 sm:p-4"
    >
      {/* Compact Top Bar: 4-Mode Pill Switcher + Flag Difficult */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="Visual explanation modes"
          className="inline-flex flex-1 flex-wrap items-center gap-1 rounded-xl border border-terminal-border bg-terminal-bg p-1 sm:flex-none"
        >
          {MODE_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={tab.label}
                onClick={() => setActiveMode(tab.id)}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:flex-none ${
                  active
                    ? 'bg-brand text-brand-fg shadow-sm'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{t(tab.shortEn, tab.shortTaglish)}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleFlagDifficult}
          title={t('Mark this concept as difficult for later review', 'I-mark para balikan mamaya')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-xs font-medium text-terminal-muted transition-colors hover:border-amber-500/40 hover:text-amber-500 dark:hover:text-amber-400"
        >
          <Flag className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
          <span className="hidden sm:inline">
            {t('Flag Difficult', 'I-Review Mamaya')}
          </span>
        </button>
      </div>

      {tutorialMode && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sky-500/35 bg-sky-500/10 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 text-terminal-text">
            <Compass className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden="true" />
            <span className="font-mono font-semibold text-sky-500 dark:text-sky-400 tabular-nums">
              {tutorialStep.step}/4
            </span>
            <span>{t(tutorialStep.en, tutorialStep.taglish)}</span>
          </div>
          {tutorialStep.nextMode && (
            <button
              type="button"
              onClick={() => setActiveMode(tutorialStep.nextMode!)}
              className="rounded-lg bg-sky-500 px-2.5 py-1 text-[11px] font-semibold text-slate-950 transition-colors hover:bg-sky-400"
            >
              {t('Next:', 'Sunod:')}{' '}
              {(() => {
                const nextTab = MODE_TABS.find((item) => item.id === tutorialStep.nextMode);
                return nextTab ? t(nextTab.shortEn, nextTab.shortTaglish) : '';
              })()}
            </button>
          )}
        </div>
      )}

      {statusFeedback && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-bull/35 bg-bull/10 px-3 py-1.5 text-xs font-medium text-bull"
        >
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* MODE 1: TEXT EXPLANATION (COMPACT, VISUAL-FIRST, ZERO WALL OF TEXT) */}
      {activeMode === 'text' && (
        <div className="space-y-3.5">
          {/* 1. Compact "In Plain English / Sa Simpleng Salita" Card */}
          {plainSummaryDisplay && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {t('In Plain English', UI_COPY.lesson.plainSummaryTitle.taglish)}
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-terminal-text sm:text-[13px]">
                {plainSummaryDisplay}
              </p>
              {isTaglish && taglishEntry?.quickTakeaway && (
                <div className="mt-2.5 rounded-lg border border-brand/25 bg-brand-soft/60 px-3 py-2 text-xs text-terminal-text">
                  <strong className="font-semibold text-brand">
                    {UI_COPY.lesson.quickTakeawayTitle.taglish}:{' '}
                  </strong>
                  {taglishEntry.quickTakeaway}
                </div>
              )}
            </div>
          )}

          {/* 2. Distinct Quick Cheat-Card (Written Rules — separate from Interactive Diagrams tab) */}
          <div className="space-y-3 rounded-xl border border-terminal-border bg-terminal-surface p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand-soft text-brand">
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-text">
                    {t(
                      UI_COPY.diagrams.quickBlueprint.en,
                      UI_COPY.diagrams.quickBlueprint.taglish,
                    )}
                  </h3>
                  <p className="text-[11px] text-terminal-muted">
                    {t(
                      'Written Bullish vs. Bearish rules at a glance — open Diagram tab for visual blueprints.',
                      'Mabilis na Bullish vs. Bearish rules — buksan ang Diagram tab para sa visual drawings.',
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveMode('diagram')}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-brand-fg shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.98]"
              >
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {t(
                    UI_COPY.diagrams.openDiagramLab.en,
                    UI_COPY.diagrams.openDiagramLab.taglish,
                  )}
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* 2-Column Bullish vs. Bearish At-a-Glance Card */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {/* Bullish Column */}
              <div className="rounded-xl border border-bull/35 bg-bull/5 p-3">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-bull">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{t('Bullish (Up / Long)', 'Bullish (Pataas / Buy)')}</span>
                </div>
                <p className="mt-1.5 text-xs font-medium leading-snug text-terminal-text">
                  {quickCheatCard.bullishCue}
                </p>
                <p className="mt-1.5 border-t border-bull/20 pt-1.5 text-[11px] leading-snug text-terminal-muted">
                  <strong className="font-semibold text-bull">
                    {t('Key Takeaway:', 'Tandaan:')}{' '}
                  </strong>
                  {quickCheatCard.bullishTakeaway}
                </p>
              </div>

              {/* Bearish Column */}
              <div className="rounded-xl border border-bear/35 bg-bear/5 p-3">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-bear">
                  <TrendingDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{t('Bearish (Down / Short)', 'Bearish (Pababa / Sell)')}</span>
                </div>
                <p className="mt-1.5 text-xs font-medium leading-snug text-terminal-text">
                  {quickCheatCard.bearishCue}
                </p>
                <p className="mt-1.5 border-t border-bear/20 pt-1.5 text-[11px] leading-snug text-terminal-muted">
                  <strong className="font-semibold text-bear">
                    {t('Caution / Invalidation:', 'Babala / Invalidation:')}{' '}
                  </strong>
                  {quickCheatCard.bearishCaution}
                </p>
              </div>
            </div>

            {/* Concise Terminology Chips (Expanded Acronyms) */}
            {lesson.terminology.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {lesson.terminology.slice(0, 4).map((entry) => (
                  <span
                    key={entry.term}
                    className="inline-flex items-center gap-1 rounded-full border border-terminal-border bg-terminal-bg px-2.5 py-0.5 text-[11px] text-terminal-muted"
                  >
                    {entry.shortCode && (
                      <strong className="font-mono font-semibold text-brand">
                        {entry.shortCode}
                      </strong>
                    )}
                    <span className="text-terminal-text">{expandAcronyms(entry.term)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 3. Scannable Collapsible Lesson Breakdown (reduces text fatigue) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-muted">
                {t('Read Full Breakdown', 'Basahin ang Buong Detalye')} ({lesson.sections.length})
              </h3>
              {lesson.sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => setExpandAllSections((prev) => !prev)}
                  className="text-[11px] font-semibold text-brand hover:underline"
                >
                  {expandAllSections
                    ? t('Collapse', 'Isara')
                    : t('Expand All', 'Buksan Lahat')}
                </button>
              )}
            </div>

            {lesson.sections.map((section, index) => (
              <details
                key={section.id}
                open={expandAllSections || index === 0}
                className="group rounded-xl border border-terminal-border bg-terminal-surface"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 px-3.5 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-brand/30 bg-brand-soft font-mono text-[10px] font-bold text-brand tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold leading-snug text-terminal-text sm:text-[13px]">
                      {section.heading}
                    </span>
                  </div>
                  <ChevronDown
                    className="h-3.5 w-3.5 shrink-0 text-terminal-muted transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="space-y-2.5 border-t border-terminal-border/70 px-3.5 py-3">
                  <p className="text-xs leading-relaxed text-terminal-muted">
                    {expandAcronyms(section.body)}
                  </p>

                  {section.bulletPoints.length > 0 && (
                    <ul className="space-y-1">
                      {section.bulletPoints.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2 text-xs leading-snug text-terminal-text"
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                            aria-hidden="true"
                          />
                          <span>{expandAcronyms(bullet)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="rounded-lg border border-bull/25 bg-bull/10 px-3 py-2 text-xs text-terminal-text">
                    <strong className="font-semibold text-bull">
                      {t('Key Rule:', 'Tandaan:')}{' '}
                    </strong>
                    {expandAcronyms(section.keyTakeaway)}
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* 4. Compact Collapsible Common Beginner Questions (FAQ) */}
          {activeFaqItems.length > 0 && (
            <div className="space-y-2 rounded-xl border border-terminal-border bg-terminal-bg/60 p-3.5">
              <div className="flex items-center gap-2">
                <HelpCircle
                  className="h-3.5 w-3.5 shrink-0 text-sky-500 dark:text-sky-400"
                  aria-hidden="true"
                />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-text">
                  {t('Common Beginner Questions (FAQ)', 'Mga Tanong ng Beginner (FAQ)')}
                </h3>
              </div>
              <div className="space-y-1.5">
                {activeFaqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-lg border border-terminal-border/80 bg-terminal-surface"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 px-3 py-2 text-xs font-medium text-terminal-text">
                      <span>{item.question}</span>
                      <ChevronDown
                        className="h-3.5 w-3.5 shrink-0 text-terminal-muted transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="border-t border-terminal-border/70 px-3 py-2 text-xs leading-relaxed text-terminal-muted">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* 5. Compact Next-Step Row */}
          <div className="flex flex-col gap-2 rounded-xl border border-terminal-border bg-terminal-bg/75 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-terminal-muted">
              {t('See this on a real chart next:', 'Tingnan naman ito sa totoong chart:')}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMode('chart')}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-fg shadow-sm transition-opacity hover:opacity-95 active:scale-[0.98]"
              >
                <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('Open Chart Example', 'Buksan ang Chart')}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('video')}
                className="inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-surface px-3.5 py-1.5 text-xs font-semibold text-terminal-text transition-colors hover:border-sky-500/45 hover:text-sky-600 dark:hover:text-sky-400"
              >
                <PlayCircle className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                <span>{t('Watch Video', 'Panoorin ang Video')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DIAGRAM EXPLANATION */}
      {activeMode === 'diagram' && <ConceptDiagramSvg config={lesson.diagramConfig} />}

      {/* MODE 3: VIDEO EXPLANATION */}
      {activeMode === 'video' && (
        <div className="space-y-3">
          {!activeResourceBundle ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-terminal-border bg-terminal-bg/60 px-5 py-7 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-400">
                <Youtube className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="max-w-sm space-y-1">
                <p className="text-sm font-semibold text-terminal-text">
                  {t('No YouTube link added yet', 'Wala pang naka-link na YouTube video')}
                </p>
                <p className="text-xs text-terminal-muted">
                  {isAdmin
                    ? 'Paste a YouTube URL with a lesson timestamp — zero downloads, instant redirect.'
                    : t(
                        'Curated YouTube links with timestamps will appear here once published.',
                        'Lalabas dito ang mga napiling YouTube videos na may timestamp.',
                      )}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {isAdmin && (
                  <Link
                    to={`/admin/visual-library?lesson=${lesson.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-fg transition-opacity hover:opacity-95"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Paste YouTube Link
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setActiveMode('diagram')}
                  className="rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45"
                >
                  {t('Open Diagram', 'Buksan ang Diagram')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('chart')}
                  className="rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 text-xs font-medium text-terminal-text transition-colors hover:border-brand/45"
                >
                  {t('Open Chart', 'Buksan ang Chart')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <LazyVideoPlayer
                resource={activeResourceBundle.resource}
                startSeconds={seekSeconds}
                endSeconds={seekEndSeconds}
                seekTriggerKey={seekTriggerKey}
                onPlaybackActivated={handlePlaybackActivated}
              />

              {/* Compact Video Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <p className="min-w-0 truncate text-xs font-semibold text-terminal-text">
                    {activeResourceBundle.resource.title}
                  </p>
                  <span className="hidden shrink-0 items-center rounded-full border border-terminal-border bg-terminal-bg px-2 py-0.5 text-[10px] font-medium text-terminal-muted sm:inline-flex">
                    {activeResourceBundle.resource.sourceName}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {isAdmin && (
                    <Link
                      to={`/admin/visual-library?lesson=${lesson.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1 text-[11px] font-medium text-terminal-muted transition-colors hover:border-brand/45 hover:text-brand"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                      Add Link
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setBookmarkTargetSegment(null);
                      setBookmarkDialogOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1 text-[11px] font-medium text-terminal-text transition-colors hover:border-amber-500/50 hover:text-amber-500 dark:hover:text-amber-400"
                  >
                    <Bookmark className="h-3 w-3" aria-hidden="true" />
                    {t('Save', 'I-Save')}
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkWatched}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      watchedIds[activeResourceBundle.resource.id]
                        ? 'border-bull bg-bull/15 text-bull'
                        : 'border-brand/40 bg-brand text-brand-fg hover:opacity-95'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {watchedIds[activeResourceBundle.resource.id]
                      ? t('Watched', 'Napanood')
                      : t('Mark Watched', 'Tapos Panoorin')}
                  </button>
                </div>
              </div>

              {/* Compact Multi-Video Switcher */}
              {externalVideoResources.length > 1 && (
                <div className="overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface">
                  <div className="flex items-center justify-between border-b border-terminal-border bg-terminal-elevated/40 px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <PlayCircle
                        className="h-3.5 w-3.5 text-brand"
                        aria-hidden="true"
                      />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-terminal-text">
                        {t('More Videos', 'Iba Pang Video')}
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] text-terminal-muted tabular-nums">
                      {externalVideoResources.length} videos
                    </span>
                  </div>

                  <ul className="divide-y divide-terminal-border">
                    {externalVideoResources.map((item) => {
                      const isSelected = item.resource.id === activeResourceBundle.resource.id;
                      const thumbSrc = resolveVideoThumbnailUrl(item);
                      const showThumb = Boolean(thumbSrc && !failedThumbIds[item.resource.id]);
                      const externalUrl = resolveVideoExternalUrl(item);

                      return (
                        <li
                          key={item.resource.id}
                          className={`flex items-center justify-between gap-2.5 px-3 py-2 transition-colors ${
                            isSelected
                              ? 'bg-brand-soft/60'
                              : 'hover:bg-terminal-elevated/40'
                          }`}
                        >
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => handleSelectVideoResource(item.resource.id)}
                            className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-lg text-left transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            <div
                              className={`relative aspect-video w-20 shrink-0 overflow-hidden rounded-lg border bg-[#0d1a1c] ${
                                isSelected
                                  ? 'border-brand/70'
                                  : 'border-terminal-border group-hover:border-brand/40'
                              }`}
                            >
                              {showThumb && thumbSrc ? (
                                <img
                                  src={thumbSrc}
                                  alt={`Thumbnail for ${item.resource.title}`}
                                  loading="lazy"
                                  onError={() =>
                                    setFailedThumbIds((prev) => ({
                                      ...prev,
                                      [item.resource.id]: true,
                                    }))
                                  }
                                  className="h-full w-full object-cover opacity-85 transition-transform duration-200 group-hover:scale-105 group-hover:opacity-100"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-terminal-elevated text-terminal-muted">
                                  <Youtube className="h-4 w-4" aria-hidden="true" />
                                </div>
                              )}

                              <span
                                className="absolute inset-0 flex items-center justify-center bg-black/25"
                                aria-hidden="true"
                              >
                                <span
                                  className={`flex h-5 w-5 items-center justify-center rounded-full shadow-sm ${
                                    isSelected
                                      ? 'bg-brand text-brand-fg'
                                      : 'bg-black/80 text-white'
                                  }`}
                                >
                                  <Play className="ml-0.5 h-2.5 w-2.5 fill-current" />
                                </span>
                              </span>

                              {item.resource.durationSeconds !== null && (
                                <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 font-mono text-[9px] font-medium leading-none text-white tabular-nums">
                                  {formatTimestamp(item.resource.durationSeconds)}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p
                                className={`truncate text-xs font-semibold transition-colors ${
                                  isSelected
                                    ? 'text-brand'
                                    : 'text-terminal-text group-hover:text-brand'
                                }`}
                              >
                                {item.resource.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex max-w-[160px] items-center truncate rounded-full border border-terminal-border bg-terminal-bg px-2 py-0.5 text-[10px] font-medium text-terminal-muted">
                                  {item.resource.sourceName}
                                </span>
                                {isSelected && (
                                  <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-brand">
                                    {t('Selected', 'Napili')}
                                  </span>
                                )}
                                {watchedIds[item.resource.id] && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-bull">
                                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                    {t('Watched', 'Napanood')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>

                          {externalUrl && (
                            <a
                              href={externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${item.resource.title} on YouTube in a new tab`}
                              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-sky-500/35 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-600 transition-colors hover:bg-sky-500 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:text-sky-400 dark:hover:text-slate-950"
                            >
                              <span>YouTube</span>
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <TimestampNavigator
                segments={activeResourceBundle.segments}
                activeSegmentId={activeSegmentId}
                externalVideoId={activeResourceBundle.resource.externalVideoId}
                sourceUrl={activeResourceBundle.resource.sourceUrl}
                onSelectSegment={handleSelectSegment}
                onBookmarkSegment={(segment) => {
                  setBookmarkTargetSegment(segment);
                  setBookmarkDialogOpen(true);
                }}
              />

              {/* Collapsible Before/After Study Notes */}
              {hasStudyNotes && (
                <details className="group rounded-xl border border-terminal-border bg-terminal-bg/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-terminal-text">
                    <span>
                      {t('Study Notes (Before & After Watching)', 'Gabay Bago at Pagkatapos Manood')}
                    </span>
                    <ChevronDown
                      className="h-3.5 w-3.5 text-terminal-muted transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="space-y-2.5 border-t border-terminal-border px-3 py-2.5 text-xs">
                    {activeResourceBundle.mapping.beforeWatchContext && (
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-500 dark:text-sky-400">
                          Before Watching — What to Look For
                        </p>
                        <p className="mt-1 leading-relaxed text-terminal-muted">
                          {expandAcronyms(activeResourceBundle.mapping.beforeWatchContext)}
                        </p>
                      </div>
                    )}
                    {activeResourceBundle.mapping.afterWatchTakeaways.length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-bull">
                          {t('After Watching — Key Takeaways', 'Pagkatapos Manood — Tandaan')}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {activeResourceBundle.mapping.afterWatchTakeaways.map((takeaway) => (
                            <li
                              key={takeaway}
                              className="flex items-start gap-2 leading-relaxed text-terminal-text"
                            >
                              <CheckCircle2
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bull"
                                aria-hidden="true"
                              />
                              <span>{expandAcronyms(takeaway)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <BookmarkNotesDialog
                isOpen={bookmarkDialogOpen}
                resource={activeResourceBundle.resource}
                segment={bookmarkTargetSegment}
                defaultLevel={lesson.level}
                onClose={() => setBookmarkDialogOpen(false)}
                onSave={handleSaveBookmark}
              />
            </>
          )}
        </div>
      )}

      {/* MODE 4: HISTORICAL CHART EXAMPLE */}
      {activeMode === 'chart' && (
        <div className="space-y-2.5">
          {scenarios.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {scenarios.map((scenario, index) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenarioIndex(index)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    index === selectedScenarioIndex
                      ? 'border-brand bg-brand-soft font-semibold text-brand'
                      : 'border-terminal-border bg-terminal-bg text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {expandAcronyms(scenario.title)}
                </button>
              ))}
            </div>
          )}

          {primaryScenario ? (
            <BeforeAfterChartViewer
              scenario={primaryScenario}
              comparisonScenario={comparisonScenario}
            />
          ) : (
            <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 text-center text-xs text-terminal-muted">
              {t(
                'No historical candlestick scenarios linked to this lesson yet.',
                'Wala pang naka-link na historical chart para sa lesson na ito.',
              )}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Key Terminology (Acronym Glossary) */}
      {lesson.terminology.length > 0 && (
        <details className="group rounded-xl border border-terminal-border bg-terminal-bg/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2 text-xs font-medium text-terminal-text">
            <span>
              {t(
                `Key Terms & Acronyms (${lesson.terminology.length})`,
                `Mga Term at Acronym (${lesson.terminology.length})`,
              )}
            </span>
            <ChevronDown
              className="h-3.5 w-3.5 text-terminal-muted transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="grid grid-cols-1 gap-2 border-t border-terminal-border p-3 md:grid-cols-3">
            {lesson.terminology.map((entry) => (
              <div
                key={entry.term}
                className="rounded-lg border border-terminal-border bg-terminal-surface p-2.5"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-semibold text-terminal-text">{entry.term}</span>
                  {entry.shortCode && (
                    <span className="rounded bg-brand-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand">
                      {entry.shortCode}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-terminal-muted">
                  {expandAcronyms(entry.definition)}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
