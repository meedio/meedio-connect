/// <reference types="vitest" />
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: { globals: true, environment: 'jsdom', css: true, setupFiles: './setupTests.ts' },
  plugins: [svgr(), tsconfigPaths()],
});
