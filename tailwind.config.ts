import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: 'var(--tl-bg)',
          surface: 'var(--tl-surface)',
          elevated: 'var(--tl-elevated)',
          border: 'var(--tl-border)',
          text: 'var(--tl-text)',
          muted: 'var(--tl-muted)',
        },
        brand: {
          DEFAULT: 'var(--tl-brand)',
          soft: 'var(--tl-brand-soft)',
          fg: 'var(--tl-brand-fg)',
        },
        bull: '#2E9E75',
        bear: '#D85A52',
        amber: {
          wisdom: '#D69B38',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
