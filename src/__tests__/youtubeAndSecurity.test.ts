import { describe, expect, it } from 'vitest';
import {
  buildNoCookieEmbedUrl,
  extractYouTubeTimestampFromUrl,
  extractYouTubeVideoId,
  formatTimestamp,
  isAllowedEducationalUrl,
  parseTimestampToSeconds,
  parseYouTubeChaptersFromDescription,
} from '../lib/youtubeUtils';
import { isAllowedServerFetchUrl, sanitizePlainText } from '../../api/_lib/urlSecurity';

describe('youtubeUtils — video ID extraction, embed URLs, timestamps & chapters', () => {
  it('extracts 11-character YouTube video IDs from supported HTTPS URL formats', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://youtu.be/abcDEF_1234?t=90')).toBe('abcDEF_1234');
    expect(extractYouTubeVideoId('https://www.youtube-nocookie.com/embed/abcDEF-1234')).toBe(
      'abcDEF-1234',
    );
    expect(extractYouTubeVideoId('https://m.youtube.com/shorts/ZyXwVuTsRq9')).toBe('ZyXwVuTsRq9');
    expect(extractYouTubeVideoId('https://www.youtube.com/live/1234567890a')).toBe('1234567890a');
  });

  it('rejects non-HTTPS, spoofed domains, javascript: URLs, and malformed video IDs', () => {
    expect(extractYouTubeVideoId('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(extractYouTubeVideoId('https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(extractYouTubeVideoId('javascript:alert(1)')).toBeNull();
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=short')).toBeNull();
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=too_long_video_id_123')).toBeNull();
  });

  it('validates allowed educational URLs and blocks private/SSRF/unsafe URLs', () => {
    const yt = isAllowedEducationalUrl('https://youtu.be/abcDEF_1234');
    expect(yt.valid).toBe(true);
    expect(yt.sourceType).toBe('youtube');
    expect(yt.videoId).toBe('abcDEF_1234');
    expect(yt.normalizedUrl).toBe('https://www.youtube.com/watch?v=abcDEF_1234');

    const tv = isAllowedEducationalUrl('https://www.tradingview.com/chart/EURUSD/sample-idea/');
    expect(tv.valid).toBe(true);
    expect(tv.sourceType).toBe('tradingview');

    const other = isAllowedEducationalUrl('https://school.babypips.com/learn/forex');
    expect(other.valid).toBe(true);
    expect(other.sourceType).toBe('other_educator');

    const unsafeUrls = [
      'javascript:alert(1)',
      'http://www.youtube.com/watch?v=abcDEF_1234',
      'https://localhost/admin',
      'https://127.0.0.1/secret',
      'https://169.254.169.254/latest/meta-data/',
      'https://[::1]/internal',
      'https://user:pass@www.youtube.com/watch?v=abcDEF_1234',
      'https://www.youtube.com:8443/watch?v=abcDEF_1234',
      'https://www.youtube.com/watch?v=invalid',
    ];

    for (const badUrl of unsafeUrls) {
      expect(isAllowedEducationalUrl(badUrl).valid).toBe(false);
    }
  });

  it('builds privacy-enhanced youtube-nocookie.com embed URLs and NEVER includes autoplay=1', () => {
    const basic = buildNoCookieEmbedUrl('abcDEF_1234');
    expect(basic).toContain('https://www.youtube-nocookie.com/embed/abcDEF_1234');
    expect(basic).toContain('rel=0');
    expect(basic).toContain('modestbranding=1');
    expect(basic).not.toContain('autoplay=1');
    expect(new URL(basic).searchParams.has('autoplay')).toBe(false);

    const timed = buildNoCookieEmbedUrl('abcDEF_1234', 75, 190);
    const parsedTimed = new URL(timed);
    expect(parsedTimed.hostname).toBe('www.youtube-nocookie.com');
    expect(parsedTimed.searchParams.get('start')).toBe('75');
    expect(parsedTimed.searchParams.get('end')).toBe('190');
    expect(parsedTimed.searchParams.get('autoplay')).toBeNull();
    expect(timed).not.toContain('autoplay=1');

    // End time <= start time is omitted
    const invalidEnd = new URL(buildNoCookieEmbedUrl('abcDEF_1234', 120, 90));
    expect(invalidEnd.searchParams.get('start')).toBe('120');
    expect(invalidEnd.searchParams.get('end')).toBeNull();

    expect(() => buildNoCookieEmbedUrl('bad-id')).toThrow('Invalid YouTube video ID');
  });

  it('formats and parses timestamps accurately', () => {
    expect(formatTimestamp(0)).toBe('00:00');
    expect(formatTimestamp(65)).toBe('01:05');
    expect(formatTimestamp(3661)).toBe('1:01:01');
    expect(formatTimestamp(-10)).toBe('00:00');
    expect(formatTimestamp(Number.NaN)).toBe('00:00');

    expect(parseTimestampToSeconds('00:00')).toBe(0);
    expect(parseTimestampToSeconds('02:15')).toBe(135);
    expect(parseTimestampToSeconds('1:02:03')).toBe(3723);
    expect(parseTimestampToSeconds('invalid')).toBeNull();
    expect(parseTimestampToSeconds('02:75')).toBeNull();
    expect(parseTimestampToSeconds('')).toBeNull();
  });

  it('extracts YouTube timestamps from ?t=, &t=, and ?start= URLs and rejects invalid/spoofed URLs', () => {
    expect(extractYouTubeTimestampFromUrl('https://youtu.be/abcDEF_1234?t=135')).toBe(135);
    expect(extractYouTubeTimestampFromUrl('https://www.youtube.com/watch?v=abcDEF_1234&t=135s')).toBe(
      135,
    );
    expect(extractYouTubeTimestampFromUrl('https://www.youtube.com/watch?v=abcDEF_1234&t=2m15s')).toBe(
      135,
    );
    expect(
      extractYouTubeTimestampFromUrl('https://www.youtube.com/watch?v=abcDEF_1234&t=1h2m10s'),
    ).toBe(3730);
    expect(
      extractYouTubeTimestampFromUrl('https://www.youtube-nocookie.com/embed/abcDEF_1234?start=90'),
    ).toBe(90);
    expect(extractYouTubeTimestampFromUrl('https://youtu.be/abcDEF_1234?start=90')).toBe(90);

    // No timestamp or invalid timestamp param
    expect(extractYouTubeTimestampFromUrl('https://www.youtube.com/watch?v=abcDEF_1234')).toBeNull();
    expect(
      extractYouTubeTimestampFromUrl('https://www.youtube.com/watch?v=abcDEF_1234&t=invalid'),
    ).toBeNull();
    expect(
      extractYouTubeTimestampFromUrl('https://www.youtube.com/watch?v=abcDEF_1234&t=-15'),
    ).toBeNull();

    // Non-HTTPS, spoofed, non-YouTube, or malformed video ID URLs -> null
    expect(
      extractYouTubeTimestampFromUrl('http://www.youtube.com/watch?v=abcDEF_1234&t=135'),
    ).toBeNull();
    expect(
      extractYouTubeTimestampFromUrl('https://youtube.com.evil.com/watch?v=abcDEF_1234&t=135'),
    ).toBeNull();
    expect(extractYouTubeTimestampFromUrl('javascript:alert(1)')).toBeNull();
    expect(extractYouTubeTimestampFromUrl('https://www.youtube.com/watch?v=short&t=135')).toBeNull();
    expect(
      extractYouTubeTimestampFromUrl('https://www.tradingview.com/chart/EURUSD/?t=135'),
    ).toBeNull();
  });

  it('parses verified chronological YouTube chapters from descriptions and rejects invalid lists', () => {
    const description = [
      'Learn institutional market structure step by step:',
      '00:00 Intro & Market Context',
      '01:30 - Identifying Swing Highs and Swing Lows',
      '[04:15] Confirmed Break of Structure (BOS)',
      '(07:45) Common Liquidity Trap Mistakes',
    ].join('\n');

    const chapters = parseYouTubeChaptersFromDescription(description, 600);
    expect(chapters).toHaveLength(4);
    expect(chapters[0]).toEqual({
      startSeconds: 0,
      endSeconds: 90,
      title: 'Intro & Market Context',
    });
    expect(chapters[1]).toEqual({
      startSeconds: 90,
      endSeconds: 255,
      title: 'Identifying Swing Highs and Swing Lows',
    });
    expect(chapters[2]).toEqual({
      startSeconds: 255,
      endSeconds: 465,
      title: 'Confirmed Break of Structure (BOS)',
    });
    expect(chapters[3]).toEqual({
      startSeconds: 465,
      endSeconds: 600,
      title: 'Common Liquidity Trap Mistakes',
    });

    // Rejects single timestamp (< 2 chapters)
    expect(parseYouTubeChaptersFromDescription('00:00 Only One Marker')).toEqual([]);

    // Rejects non-chronological timestamps
    const outOfOrder = '00:00 Start\n05:00 Middle\n03:00 Backwards';
    expect(parseYouTubeChaptersFromDescription(outOfOrder)).toEqual([]);
  });
});

describe('api/_lib/urlSecurity — SSRF allowlist & text sanitization', () => {
  it('allows only strict HTTPS allowlisted server fetch hosts and paths', () => {
    expect(
      isAllowedServerFetchUrl(
        'https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DabcDEF_1234&format=json',
      ),
    ).toMatchObject({ allowed: true, host: 'www.youtube.com' });

    expect(
      isAllowedServerFetchUrl('https://www.googleapis.com/youtube/v3/videos?id=abcDEF_1234'),
    ).toMatchObject({ allowed: true, host: 'www.googleapis.com' });

    expect(
      isAllowedServerFetchUrl('https://www.tradingview.com/chart/EURUSD/abc/'),
    ).toMatchObject({ allowed: true, host: 'www.tradingview.com' });
  });

  it('rejects javascript:, http://, localhost, metadata IP, loopback, and spoofed hosts', () => {
    const blockedUrls = [
      'javascript:alert(1)',
      'http://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=abcDEF_1234',
      'https://localhost/oembed',
      'https://169.254.169.254/latest/meta-data/',
      'https://127.0.0.1/youtube/v3/videos',
      'https://youtube.com.evil.com/oembed',
      'https://www.youtube.com/watch?v=abcDEF_1234', // disallowed path on www.youtube.com
      'https://www.googleapis.com/oauth2/v3/certs', // disallowed path on www.googleapis.com
      'https://www.youtube.com:8080/oembed',
      'https://user:pass@www.youtube.com/oembed',
      'https://www.googleapis.com/youtube/v3/../../secret', // path traversal out of /youtube/v3/
      'https://www.tradingview.com/chart/..foo/secret', // literal '..' segment
    ];

    for (const url of blockedUrls) {
      const result = isAllowedServerFetchUrl(url);
      expect(result.allowed, `Expected "${url}" to be rejected`).toBe(false);
    }
  });

  it('sanitizes control characters, bidi overrides, BOM, and enforces maxLength', () => {
    const dirty = '  \uFEFFHello\u0000 \u202EWorld\u0007\r\nLine 2\tOK  ';
    expect(sanitizePlainText(dirty, 100)).toBe('Hello World\nLine 2\tOK');
    expect(sanitizePlainText('A'.repeat(50), 12)).toBe('A'.repeat(12));
  });
});
