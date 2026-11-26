import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { MindsetVaultDrawer } from '../components/quotes/MindsetVaultDrawer';
import { LazyVideoPlayer } from '../components/visual-learning/LazyVideoPlayer';
import { VisualExplanationsSection } from '../components/visual-learning/VisualExplanationsSection';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { AcademyCatalogPage } from '../pages/AcademyCatalogPage';
import type { EducationalResource, LessonResourceWithDetails } from '../types/visual-learning';

const VALID_YT_RESOURCE: EducationalResource = {
  id: 'yt-res-1',
  title: 'Market Structure & Confirmed BOS Walkthrough',
  description: 'Step-by-step explanation of swing points and confirmed breaks.',
  sourceType: 'youtube',
  sourceName: 'Verified Chart Educator',
  sourceUrl: 'https://www.youtube.com/watch?v=abcDEF_1234',
  externalVideoId: 'abcDEF_1234',
  thumbnailUrl: 'https://i.ytimg.com/vi/abcDEF_1234/hqdefault.jpg',
  durationSeconds: 420,
  contentType: 'video',
  licenseStatus: 'standard_embed_only',
  attribution: 'Video by Verified Chart Educator on YouTube.',
  nonEndorsementNotice: true,
  verificationStatus: 'published',
  qualityScore: 95,
  embeddable: true,
  lastCheckedAt: '2026-01-01T00:00:00.000Z',
  createdBy: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const MARKET_STRUCTURE_LESSON =
  CURRICULUM_LESSONS.find((item) => item.slug === 'market-structure') ?? CURRICULUM_LESSONS[0];

const LESSON_RESOURCE_BUNDLE: LessonResourceWithDetails = {
  mapping: {
    id: 'map-1',
    lessonId: MARKET_STRUCTURE_LESSON.id,
    lessonSlug: MARKET_STRUCTURE_LESSON.slug,
    resourceId: VALID_YT_RESOURCE.id,
    relevanceScore: 95,
    displayOrder: 1,
    beforeWatchContext: 'Watch closely for how the candle body closes beyond the prior swing high.',
    afterWatchTakeaways: ['Only body closes confirm a valid Break of Structure.'],
    editorialNotes: 'Verified video segment for Market Structure Basics.',
  },
  resource: VALID_YT_RESOURCE,
  segments: [
    {
      id: 'seg-1',
      resourceId: VALID_YT_RESOURCE.id,
      startSeconds: 60,
      endSeconds: 145,
      segmentTitle: 'Candle-Body BOS Example',
      explanation: 'Highlights the exact breakout close on EUR/USD 15m.',
      verificationMethod: 'youtube_chapters',
      verifiedBy: 'admin-1',
      verifiedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

describe('LazyVideoPlayer — zero-eager-iframe facade, no-cookie embed & graceful fallbacks', () => {
  it('mounts 0 iframes on initial render and loads a youtube-nocookie iframe without autoplay=1 on Play click', async () => {
    const user = userEvent.setup();
    const onActivated = vi.fn();

    const { container } = render(
      <LazyVideoPlayer resource={VALID_YT_RESOURCE} onPlaybackActivated={onActivated} />,
    );

    // Acceptance criterion: ZERO iframes before explicit user interaction
    expect(container.querySelectorAll('iframe')).toHaveLength(0);

    const playButton = screen.getByRole('button', {
      name: /Load and play video: Market Structure & Confirmed BOS Walkthrough/i,
    });
    await user.click(playButton);

    const iframes = container.querySelectorAll('iframe');
    expect(iframes).toHaveLength(1);
    const src = iframes[0].getAttribute('src') ?? '';
    expect(src).toContain('https://www.youtube-nocookie.com/embed/abcDEF_1234');
    expect(src).not.toContain('autoplay=1');
    expect(new URL(src).searchParams.get('autoplay')).toBeNull();
    expect(onActivated).toHaveBeenCalledWith(0);
  });

  it('shows graceful fallback UI and 0 iframes when verificationStatus is unavailable', () => {
    const unavailableResource: EducationalResource = {
      ...VALID_YT_RESOURCE,
      id: 'yt-res-unavailable',
      verificationStatus: 'unavailable',
    };

    const { container } = render(<LazyVideoPlayer resource={unavailableResource} />);

    expect(container.querySelectorAll('iframe')).toHaveLength(0);
    expect(screen.getByText(/Embedded Video Temporarily Unavailable/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Original Source/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=abcDEF_1234',
    );
  });

  it('shows graceful fallback UI and 0 iframes when embeddable is false', () => {
    const nonEmbeddableResource: EducationalResource = {
      ...VALID_YT_RESOURCE,
      id: 'yt-res-no-embed',
      embeddable: false,
    };

    const { container } = render(<LazyVideoPlayer resource={nonEmbeddableResource} />);

    expect(container.querySelectorAll('iframe')).toHaveLength(0);
    expect(screen.getByText(/External Resource Preview/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Original Source/i })).toBeInTheDocument();
  });
});

describe('VisualExplanationsSection — 4-mode switching inside MemoryRouter', () => {
  it('switches cleanly between Text, Diagram, Video, and Historical Chart modes', async () => {
    const user = userEvent.setup();
    const lesson = MARKET_STRUCTURE_LESSON;

    const { container } = render(
      <MemoryRouter>
        <VisualExplanationsSection lesson={lesson} resources={[LESSON_RESOURCE_BUNDLE]} />
      </MemoryRouter>,
    );

    // 1. Default Text Explanation mode
    expect(screen.getByRole('tab', { name: /Text Explanation/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(lesson.sections[0].heading)).toBeInTheDocument();

    // 2. Switch to Diagram Explanation
    await user.click(screen.getByRole('tab', { name: /Diagram Explanation/i }));
    expect(screen.getByRole('tab', { name: /Diagram Explanation/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(lesson.diagramConfig.title)).toBeInTheDocument();

    // 3. Switch to Video Explanation (still 0 iframes until user clicks Play)
    await user.click(screen.getByRole('tab', { name: /Video Explanation/i }));
    expect(screen.getByRole('tab', { name: /Video Explanation/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(/Before Watching — What to Look For/i)).toBeInTheDocument();
    expect(screen.getByText(/Candle-Body BOS Example/i)).toBeInTheDocument();
    expect(container.querySelectorAll('iframe')).toHaveLength(0);

    // 4. Switch to Historical Chart Example
    await user.click(screen.getByRole('tab', { name: /Historical Chart Example/i }));
    expect(screen.getByRole('tab', { name: /Historical Chart Example/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(/Structured OHLC Data Preview/i)).toBeInTheDocument();
  });
});

describe('MindsetVaultDrawer — filtering & custom personal trading rule creation', () => {
  it('filters by Teach and creates and displays a custom personal trading rule', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<MindsetVaultDrawer isOpen={true} onClose={onClose} />);

    // Wait for starter quotes to load
    await waitFor(() => {
      expect(screen.getByText(/Trader Mindset & Motivation Vault/i)).toBeInTheDocument();
      expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
    });

    // Filter by Teach
    await user.click(screen.getByRole('button', { name: 'Teach' }));
    await waitFor(() => {
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(13);
    });

    // Open Add My Rule form and create a custom Teach rule
    await user.click(screen.getByRole('button', { name: /Add My Rule/i }));

    const ruleTextarea = screen.getByPlaceholderText(
      /No candle-body close, no entry/i,
    );
    await user.type(
      ruleTextarea,
      'Always verify liquidity sweep + displacement before risking 0.5R.',
    );

    const categorySelect = screen.getByLabelText(/Personal rule category/i);
    await user.selectOptions(categorySelect, 'teach');

    const noteInput = screen.getByPlaceholderText(/Why this rule matters when trading/i);
    await user.type(noteInput, 'Prevents impulsive mid-range entries.');

    await user.click(screen.getByRole('button', { name: /Save Personal Rule/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Always verify liquidity sweep \+ displacement before risking 0\.5R\./i),
      ).toBeInTheDocument();
      expect(screen.getByText('Custom Rule')).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(14);
    });
  });
});

describe('AcademyCatalogPage — 18-lesson catalog & market category filtering', () => {
  it('renders all 18 lessons and narrows cleanly when filtering by Crypto and Forex', async () => {
    const user = userEvent.setup();
    const cryptoLessons = CURRICULUM_LESSONS.filter((lesson) => lesson.marketCategory === 'crypto');
    const forexLessons = CURRICULUM_LESSONS.filter((lesson) => lesson.marketCategory === 'forex');

    expect(CURRICULUM_LESSONS).toHaveLength(18);
    expect(cryptoLessons.length).toBeGreaterThanOrEqual(1);
    expect(forexLessons.length).toBeGreaterThanOrEqual(1);

    render(
      <MemoryRouter initialEntries={['/academy']}>
        <AcademyCatalogPage />
      </MemoryRouter>,
    );

    // All 18 lessons render initially
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(18);
    for (const lesson of CURRICULUM_LESSONS) {
      expect(screen.getByText(lesson.title)).toBeInTheDocument();
    }

    // Filter by Crypto market category
    const cryptoFilterButton = screen.getByRole('button', { name: /Crypto/i });
    await user.click(cryptoFilterButton);

    expect(cryptoFilterButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(cryptoLessons.length);
    for (const lesson of cryptoLessons) {
      expect(screen.getByText(lesson.title)).toBeInTheDocument();
    }
    for (const lesson of forexLessons) {
      expect(screen.queryByText(lesson.title)).not.toBeInTheDocument();
    }

    // Filter by Forex market category
    const forexFilterButton = screen.getByRole('button', { name: /Forex/i });
    await user.click(forexFilterButton);

    expect(forexFilterButton).toHaveAttribute('aria-pressed', 'true');
    expect(cryptoFilterButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(forexLessons.length);
    for (const lesson of forexLessons) {
      expect(screen.getByText(lesson.title)).toBeInTheDocument();
    }
    for (const lesson of cryptoLessons) {
      expect(screen.queryByText(lesson.title)).not.toBeInTheDocument();
    }
  });
});
