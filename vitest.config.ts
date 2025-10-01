import react from '@vitejs/plugin-react';
import path from 'path';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import { insertTranslationsVersion } from './src/i18n/utils';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true,
    hmr: { clientPort: 3000, port: 3000 },
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@shared/constants': path.resolve('libs/constants/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: { reportOnFailure: true },
  },
  plugins: [insertTranslationsVersion(), svgr(), react(), tsconfigPaths(), pluginRewriteAll()],
});
