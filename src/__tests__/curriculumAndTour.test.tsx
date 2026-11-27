import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import {
  APP_TOUR_STORAGE_KEY,
  AppWalkthroughModal,
} from '../components/learning/AppWalkthroughModal';
import { ConceptDiagramSvg } from '../components/visual-learning/ConceptDiagramSvg';
import { VisualExplanationsSection } from '../components/visual-learning/VisualExplanationsSection';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { CHART_SCENARIOS, getChartScenariosForLesson } from '../data/chartScenarios';
import { CURRICULUM_LESSONS, getLessonBySlug } from '../data/curriculum';
import { LESSON_TAGLISH_SUMMARIES } from '../data/taglishTranslations';
import { VERIFIED_YOUTUBE_RESOURCES } from '../data/verifiedVideos';
import { isValidYouTubeVideoId } from '../lib/youtubeUtils';
import { AcademyCatalogPage } from '../pages/AcademyCatalogPage';
import type { LessonMarketCategory } from '../types/academy';

describe('Balanced 27-lesson curriculum structure & 100% resource coverage', () => {
  it('contains 27 balanced lessons with Lesson 01 chart-reading-fundamentals before Lesson 02 candlestick-anatomy', () => {
    expect(CURRICULUM_LESSONS).toHaveLength(27);

    // Lesson 01 precedes Lesson 02
    expect(CURRICULUM_LESSONS[0].moduleOrder).toBe(1);
    expect(CURRICULUM_LESSONS[0].slug).toBe('chart-reading-fundamentals');
    expect(CURRICULUM_LESSONS[0].diagramConfig.kind).toBe('chart_fundamentals');

    expect(CURRICULUM_LESSONS[1].moduleOrder).toBe(2);
    expect(CURRICULUM_LESSONS[1].slug).toBe('candlestick-anatomy');

    // Exact market category balance: 15 universal + 3 per dedicated market track
    const countsByCategory: Record<LessonMarketCategory, number> = {
      general: 0,
      crypto: 0,
      forex: 0,
      stocks: 0,
      indices: 0,
    };

    const seenSlugs = new Set<string>();
    for (let i = 0; i < CURRICULUM_LESSONS.length; i += 1) {
      const lesson = CURRICULUM_LESSONS[i];
      expect(lesson.moduleOrder).toBe(i + 1);
      expect(seenSlugs.has(lesson.slug)).toBe(false);
      seenSlugs.add(lesson.slug);
      countsByCategory[lesson.marketCategory] += 1;
    }

    expect(countsByCategory).toEqual({
      general: 15,
      crypto: 3,
      forex: 3,
      stocks: 3,
      indices: 3,
    });
  });

  it('guarantees 100% coverage across all 27 lessons: >=2 unique YouTube videos (62 total), 30 historical charts, and 27 Taglish summaries', () => {
    expect(VERIFIED_YOUTUBE_RESOURCES).toHaveLength(62);
    expect(CHART_SCENARIOS).toHaveLength(30);

    const uniqueVideoIds = new Set<string>();
    const videosPerSlug = new Map<string, number>();

    for (const entry of VERIFIED_YOUTUBE_RESOURCES) {
      const videoId = entry.resource.externalVideoId ?? '';
      expect(isValidYouTubeVideoId(videoId), `Invalid YouTube ID: ${videoId}`).toBe(true);
      expect(uniqueVideoIds.has(videoId), `Duplicate YouTube ID: ${videoId}`).toBe(false);
      uniqueVideoIds.add(videoId);

      videosPerSlug.set(
        entry.mapping.lessonSlug,
        (videosPerSlug.get(entry.mapping.lessonSlug) ?? 0) + 1,
      );
    }

    expect(uniqueVideoIds.size).toBe(62);

    for (const lesson of CURRICULUM_LESSONS) {
      // 1. Verified YouTube videos (>= 2 per lesson)
      const videoCount = videosPerSlug.get(lesson.slug) ?? 0;
      expect(
        videoCount,
        `Expected >= 2 verified videos for "${lesson.slug}", got ${videoCount}`,
      ).toBeGreaterThanOrEqual(2);

      // 2. Dedicated historical chart scenario via getChartScenariosForLesson
      const scenarios = getChartScenariosForLesson(lesson);
      expect(
        scenarios.length,
        `Expected >= 1 chart scenario for "${lesson.slug}"`,
      ).toBeGreaterThanOrEqual(1);
      for (const scenario of scenarios) {
        expect(scenario.candles.length).toBeGreaterThan(0);
      }

      // 3. Taglish plain summary & quick takeaway
      const taglish = LESSON_TAGLISH_SUMMARIES[lesson.slug];
      expect(taglish, `Missing Taglish summary for "${lesson.slug}"`).toBeDefined();
      expect(taglish.plainSummary.trim().length).toBeGreaterThan(20);
      expect(taglish.quickTakeaway.trim().length).toBeGreaterThan(10);
    }
  });
});

describe('VisualExplanationsSection — distinct Text Cheat-Card vs. Diagram Bullish/Bearish Lab', () => {
  it('shows Quick Cheat-Card without duplicate diagram SVGs on Text tab, then opens BOTH Bullish & Bearish blueprints on Diagram tab', async () => {
    const user = userEvent.setup();
    const lesson = getLessonBySlug('chart-reading-fundamentals');
    expect(lesson).toBeDefined();

    render(
      <MemoryRouter>
        <VisualExplanationsSection lesson={lesson!} resources={[]} />
      </MemoryRouter>,
    );

    // Default Text tab: Quick Cheat-Card + CTA button, ZERO duplicate full diagram SVGs
    expect(screen.getByRole('tab', { name: /Text Explanation/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(/Quick Cheat-Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Bullish \(Up \/ Long\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Bearish \(Down \/ Short\)/i)).toBeInTheDocument();
    expect(screen.queryAllByRole('img', { name: /diagram:/i })).toHaveLength(0);

    // Clicking "Open Bullish & Bearish Diagrams" switches directly to Diagram tab
    const openDiagramsBtn = screen.getByRole('button', {
      name: /Open Bullish & Bearish Diagrams/i,
    });
    await user.click(openDiagramsBtn);

    expect(screen.getByRole('tab', { name: /Diagram Explanation/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(/BULLISH • UP \/ LONG/i)).toBeInTheDocument();
    expect(screen.getByText(/BEARISH • DOWN \/ SHORT/i)).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: /diagram:/i })).toHaveLength(2);
  });
});

describe('ConceptDiagramSvg — dual Bullish/Bearish toggle & chart_fundamentals blueprint', () => {
  it('renders BOTH Bullish and Bearish SVGs by default, switches to Bullish-only or Bearish-only, and renders chart_fundamentals cleanly', async () => {
    const user = userEvent.setup();
    const lesson = getLessonBySlug('chart-reading-fundamentals');
    expect(lesson).toBeDefined();

    render(<ConceptDiagramSvg config={lesson!.diagramConfig} />);

    const bothBtn = screen.getByRole('button', { name: /Both Views/i });
    const bullishBtn = screen.getByRole('button', { name: /Bullish \(Up\)/i });
    const bearishBtn = screen.getByRole('button', { name: /Bearish \(Down\)/i });

    // Default: Both Views active -> 2 diagram SVGs (Bullish + Bearish)
    expect(bothBtn).toHaveAttribute('aria-pressed', 'true');
    expect(bullishBtn).toHaveAttribute('aria-pressed', 'false');
    expect(bearishBtn).toHaveAttribute('aria-pressed', 'false');

    expect(screen.getAllByRole('img', { name: /diagram:/i })).toHaveLength(2);
    expect(screen.getByText(/BULLISH • UP \/ LONG/i)).toBeInTheDocument();
    expect(screen.getByText(/BEARISH • DOWN \/ SHORT/i)).toBeInTheDocument();

    // Verify chart_fundamentals SVG content renders cleanly on both panels
    expect(
      screen.getByText(/BULLISH CHART BASICS: UPTREND/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/BEARISH CHART BASICS: DOWNTREND/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/TIMEFRAME: 1H = 4×15m = 12×5m/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Y-AXIS \(PRICE\)/i)).toHaveLength(2);
    expect(screen.getAllByText(/X-AXIS \(TIME\)/i)).toHaveLength(2);

    // Switch to Bullish only
    await user.click(bullishBtn);
    expect(bullishBtn).toHaveAttribute('aria-pressed', 'true');
    expect(bothBtn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByRole('img', { name: /diagram:/i })).toHaveLength(1);
    expect(screen.getByText(/BULLISH • UP \/ LONG/i)).toBeInTheDocument();
    expect(screen.queryByText(/BEARISH • DOWN \/ SHORT/i)).not.toBeInTheDocument();

    // Switch to Bearish only
    await user.click(bearishBtn);
    expect(bearishBtn).toHaveAttribute('aria-pressed', 'true');
    expect(bullishBtn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByRole('img', { name: /diagram:/i })).toHaveLength(1);
    expect(screen.getByText(/BEARISH • DOWN \/ SHORT/i)).toBeInTheDocument();
    expect(screen.queryByText(/BULLISH • UP \/ LONG/i)).not.toBeInTheDocument();

    // Switch back to Both
    await user.click(bothBtn);
    expect(bothBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('img', { name: /diagram:/i })).toHaveLength(2);
  });
});

describe('AppWalkthroughModal — 6-step interactive tour, Taglish toggle & persistence', () => {
  function WalkthroughHarness({ onClose }: { onClose: () => void }) {
    const { toggleLang } = useLanguage();
    return (
      <>
        <button type="button" onClick={toggleLang}>
          Switch Language
        </button>
        <AppWalkthroughModal isOpen={true} onClose={onClose} />
      </>
    );
  }

  it('renders Step 1 of 6, navigates Next/Back through Step 6, supports Taglish toggle, and persists tradelab_app_tour_seen_v1 on Finish', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <LanguageProvider>
          <WalkthroughHarness onClose={onClose} />
        </LanguageProvider>
      </MemoryRouter>,
    );

    // Step 1 of 6 in English
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
    expect(screen.getByText('Welcome & Quick Setup')).toBeInTheDocument();

    // Toggle to Taglish and verify instant copy switch
    await user.click(screen.getByRole('button', { name: 'Switch Language' }));
    expect(screen.getByText('Hakbang 1 sa 6')).toBeInTheDocument();
    expect(screen.getByText('Welcome at Mabilis na Setup')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Susunod/i })).toBeInTheDocument();

    // Toggle back to English
    await user.click(screen.getByRole('button', { name: 'Switch Language' }));
    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();

    // Navigate Next through Steps 2 -> 6
    await user.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText('Step 2 of 6')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText('Step 3 of 6')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText('Step 4 of 6')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText('Step 5 of 6')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText('Step 6 of 6')).toBeInTheDocument();
    expect(screen.getByText('Journal & Build Consistency')).toBeInTheDocument();

    // Navigate Back from Step 6 -> Step 5, then forward to Step 6
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Step 5 of 6')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText('Step 6 of 6')).toBeInTheDocument();

    // Finish persists storage flag and closes modal
    expect(window.localStorage.getItem(APP_TOUR_STORAGE_KEY)).toBeNull();
    await user.click(screen.getByRole('button', { name: /Start Learning/i }));

    expect(window.localStorage.getItem(APP_TOUR_STORAGE_KEY)).toBe('true');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('persists tradelab_app_tour_seen_v1 and calls onClose when clicking Skip Tour', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <LanguageProvider>
          <AppWalkthroughModal isOpen={true} onClose={onClose} />
        </LanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
    expect(window.localStorage.getItem(APP_TOUR_STORAGE_KEY)).toBeNull();

    await user.click(screen.getByRole('button', { name: /Skip Tour/i }));

    expect(window.localStorage.getItem(APP_TOUR_STORAGE_KEY)).toBe('true');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('AcademyCatalogPage — Universal Core (15) & separate Crypto/Forex/Stocks/Indices (3 each) tracks', () => {
  it('displays Universal Core (15) and separate Crypto (3), Forex (3), Stocks (3), and Indices (3) tracks and filters cleanly', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/academy']}>
        <LanguageProvider>
          <AcademyCatalogPage />
        </LanguageProvider>
      </MemoryRouter>,
    );

    // Filter pills expose exact counts
    const allPill = screen.getByRole('button', { name: /All\s*\(27\)/i });
    const universalPill = screen.getByRole('button', { name: /Universal Core\s*\(15\)/i });
    const cryptoPill = screen.getByRole('button', { name: /Crypto\s*\(3\)/i });
    const forexPill = screen.getByRole('button', { name: /Forex\s*\(3\)/i });
    const stocksPill = screen.getByRole('button', { name: /Stocks\s*\(3\)/i });
    const indicesPill = screen.getByRole('button', { name: /Indices\s*\(3\)/i });

    expect(allPill).toHaveAttribute('aria-pressed', 'true');
    expect(universalPill).toBeInTheDocument();
    expect(cryptoPill).toBeInTheDocument();
    expect(forexPill).toBeInTheDocument();
    expect(stocksPill).toBeInTheDocument();
    expect(indicesPill).toBeInTheDocument();

    // Both Universal Core section and 4 separate Market Track headings appear in All view
    expect(
      screen.getByRole('heading', { level: 2, name: /Universal Core \(All Markets\)/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/15 Lessons/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Separate Market Tracks/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Crypto Track' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Forex Track' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Stocks Track' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Indices Track' })).toBeInTheDocument();

    // Focus Stocks track -> shows only the 3 Stocks lessons
    const stocksLessons = CURRICULUM_LESSONS.filter((l) => l.marketCategory === 'stocks');
    const indicesLessons = CURRICULUM_LESSONS.filter((l) => l.marketCategory === 'indices');

    await user.click(stocksPill);
    expect(stocksPill).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    for (const lesson of stocksLessons) {
      expect(screen.getByText(lesson.title)).toBeInTheDocument();
    }
    for (const lesson of indicesLessons) {
      expect(screen.queryByText(lesson.title)).not.toBeInTheDocument();
    }

    // Focus Indices track -> shows only the 3 Indices lessons
    await user.click(indicesPill);
    expect(indicesPill).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    for (const lesson of indicesLessons) {
      expect(screen.getByText(lesson.title)).toBeInTheDocument();
    }
    for (const lesson of stocksLessons) {
      expect(screen.queryByText(lesson.title)).not.toBeInTheDocument();
    }
  });
});
