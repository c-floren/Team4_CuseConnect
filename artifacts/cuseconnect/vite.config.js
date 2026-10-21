/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Components render into a DOM, so the default 'node' environment won't do.
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
