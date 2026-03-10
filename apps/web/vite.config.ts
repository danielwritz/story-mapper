// @ts-nocheck
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import type { PluginOption } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()] as PluginOption[],
  server: { port: 5173 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    css: true,
  },
});
