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
        bull: '#10b981',
        bear: '#ef4444',
        amber: {
          wisdom: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
