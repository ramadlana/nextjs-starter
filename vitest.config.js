import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    setupFiles: './vitest.setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        'coverage/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/jest.setup.js',
        '**/vitest.setup.js',
      ],
    },
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './components'),
      '@/pages': path.resolve(__dirname, './pages'),
      '@/lib': path.resolve(__dirname, './lib'),
    },
  },
});
