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
          DEFAULT: 'rgb(var(--tl-brand-rgb) / <alpha-value>)',
          text: 'var(--tl-brand-text)',
          soft: 'var(--tl-brand-soft)',
          fg: 'var(--tl-brand-fg)',
        },
        bull: '#089981',
        bear: '#f23645',
        caution: '#e59400',
        info: '#2196f3',
        amber: {
          wisdom: '#e59400',
        },
      },
      spacing: {
        15: '3.75rem',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
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
