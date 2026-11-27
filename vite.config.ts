import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');

          if (normalized.includes('/node_modules/')) {
            if (
              normalized.includes('/node_modules/react/') ||
              normalized.includes('/node_modules/react-dom/') ||
              normalized.includes('/node_modules/react-router-dom/') ||
              normalized.includes('/node_modules/react-router/') ||
              normalized.includes('/node_modules/scheduler/')
            ) {
              return 'vendor-react';
            }

            if (
              normalized.includes('/node_modules/lightweight-charts/') ||
              normalized.includes('/node_modules/fancy-canvas/')
            ) {
              return 'vendor-charts';
            }

            if (normalized.includes('/node_modules/@supabase/')) {
              return 'vendor-supabase';
            }

            if (normalized.includes('/node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
          }

          if (normalized.includes('/src/data/chartScenarios')) {
            return 'data-charts';
          }

          if (normalized.includes('/src/data/verifiedVideos')) {
            return 'data-videos';
          }

          if (
            normalized.includes('/src/data/curriculum') ||
            normalized.includes('/src/data/expandedLessons') ||
            normalized.includes('/src/data/marketTrackLessons')
          ) {
            return 'data-curriculum';
          }

          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
