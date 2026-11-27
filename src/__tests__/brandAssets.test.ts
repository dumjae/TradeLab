import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

const FORBIDDEN_PURPLE_PATTERN =
  /purple|violet|indigo|fuchsia|#(7c3aed|8b5cf6|9333ea|a855f7|6366f1|4f46e5|c084fc|d946ef|6d28d9|5b21b6)\b/i;
const PNG_MAGIC_BYTES = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;
const PNG_IHDR_BYTES = [0x49, 0x48, 0x44, 0x52] as const;
const ICO_MAGIC_BYTES = [0x00, 0x00, 0x01, 0x00] as const;

interface PngExpectation {
  fileName: string;
  width: number;
  height: number;
}

const EXPECTED_PNG_ASSETS: readonly PngExpectation[] = [
  { fileName: 'favicon-32x32.png', width: 32, height: 32 },
  { fileName: 'icon-192.png', width: 192, height: 192 },
  { fileName: 'icon-512.png', width: 512, height: 512 },
  { fileName: 'apple-touch-icon.png', width: 180, height: 180 },
  { fileName: 'og-image.png', width: 1200, height: 630 },
];

const EXPECTED_INDEX_HTML_ASSETS = [
  '/favicon.svg',
  '/favicon-32x32.png',
  '/icon-192.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/manifest.webmanifest',
] as const;

interface WebManifest {
  name?: string;
  short_name?: string;
  background_color?: string;
  theme_color?: string;
  icons?: Array<{ src?: string; sizes?: string; type?: string }>;
}

function readPublicText(fileName: string): string {
  return fs.readFileSync(path.join(PUBLIC_DIR, fileName), 'utf8');
}

function readPublicBytes(fileName: string): Uint8Array {
  return fs.readFileSync(path.join(PUBLIC_DIR, fileName));
}

function readPngDimensions(bytes: Uint8Array): { width: number; height: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    width: view.getUint32(16, false),
    height: view.getUint32(20, false),
  };
}

describe('Editorial Fintech Brand Assets & Web Manifest', () => {
  it('verifies public/favicon.svg uses Editorial Fintech palette tokens and zero purple keywords or hexes', () => {
    const svgPath = path.join(PUBLIC_DIR, 'favicon.svg');
    expect(fs.existsSync(svgPath)).toBe(true);

    const svg = readPublicText('favicon.svg');
    expect(svg).toContain('viewBox="0 0 64 64"');
    expect(svg).toContain('#0f131a');
    expect(svg).toContain('#089981');
    expect(svg).toContain('#2962ff');
    expect(svg).not.toMatch(FORBIDDEN_PURPLE_PATTERN);
  });

  it('verifies public/manifest.webmanifest parses cleanly with #0f131a theme tokens and existing icon files', () => {
    const manifestPath = path.join(PUBLIC_DIR, 'manifest.webmanifest');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const raw = readPublicText('manifest.webmanifest');
    expect(raw).not.toMatch(FORBIDDEN_PURPLE_PATTERN);

    const manifest = JSON.parse(raw) as WebManifest;
    expect(manifest.background_color).toBe('#0f131a');
    expect(manifest.theme_color).toBe('#0f131a');
    expect(Array.isArray(manifest.icons)).toBe(true);

    const iconSrcs = (manifest.icons ?? []).map((icon) => icon.src);
    expect(iconSrcs).toContain('/icon-192.png');
    expect(iconSrcs).toContain('/icon-512.png');

    for (const src of iconSrcs) {
      expect(typeof src).toBe('string');
      const relativeName = (src as string).replace(/^\/+/, '');
      expect(fs.existsSync(path.join(PUBLIC_DIR, relativeName))).toBe(true);
    }
  });

  it('verifies index.html references all brand assets and manifest with #0f131a theme-color', () => {
    const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8');

    expect(indexHtml).toContain('name="theme-color" content="#0f131a"');
    expect(indexHtml).not.toMatch(FORBIDDEN_PURPLE_PATTERN);

    for (const assetHref of EXPECTED_INDEX_HTML_ASSETS) {
      expect(indexHtml).toContain(assetHref);
      const assetPath = path.join(PUBLIC_DIR, assetHref.replace(/^\/+/, ''));
      expect(fs.existsSync(assetPath)).toBe(true);
    }
  });

  it.each(EXPECTED_PNG_ASSETS)(
    'verifies $fileName has valid PNG magic header and exact $width × $height IHDR dimensions',
    ({ fileName, width, height }) => {
      const filePath = path.join(PUBLIC_DIR, fileName);
      expect(fs.existsSync(filePath)).toBe(true);

      const bytes = readPublicBytes(fileName);
      expect(bytes.length).toBeGreaterThanOrEqual(24);
      expect(Array.from(bytes.subarray(0, 8))).toEqual([...PNG_MAGIC_BYTES]);
      expect(Array.from(bytes.subarray(12, 16))).toEqual([...PNG_IHDR_BYTES]);

      const dimensions = readPngDimensions(bytes);
      expect(dimensions).toEqual({ width, height });
    },
  );

  it('verifies public/favicon.ico exists and has valid ICO magic header bytes (00 00 01 00)', () => {
    const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
    expect(fs.existsSync(icoPath)).toBe(true);

    const bytes = readPublicBytes('favicon.ico');
    expect(bytes.length).toBeGreaterThanOrEqual(6);
    expect(Array.from(bytes.subarray(0, 4))).toEqual([...ICO_MAGIC_BYTES]);

    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    expect(view.getUint16(4, true)).toBeGreaterThanOrEqual(1);
  });

  it('verifies AppShell and LoginPage reference /favicon.svg without forbidden purple tokens', () => {
    const appShellSource = fs.readFileSync(
      path.join(PROJECT_ROOT, 'src/components/layout/AppShell.tsx'),
      'utf8',
    );
    const loginPageSource = fs.readFileSync(
      path.join(PROJECT_ROOT, 'src/pages/LoginPage.tsx'),
      'utf8',
    );

    expect(appShellSource).toContain('src="/favicon.svg"');
    expect(loginPageSource).toContain('src="/favicon.svg"');
    expect(appShellSource).not.toMatch(FORBIDDEN_PURPLE_PATTERN);
    expect(loginPageSource).not.toMatch(FORBIDDEN_PURPLE_PATTERN);
  });
});
