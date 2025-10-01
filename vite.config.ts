/// <reference types="vitest" />
import importMetaEnv from '@import-meta-env/unplugin';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import zlib from 'zlib';

import { insertTranslationsVersion } from './src/i18n/utils';

const copyFiles = {
  targets: [
    {
      src: path.resolve(__dirname, './public/locales'),
      dest: './', // 2️⃣
    },
    {
      src: path.resolve(__dirname, './public/images'),
      dest: './', // 2️⃣
    },
    {
      src: path.resolve(__dirname, './public/browserconfig.xml'),
      dest: './', // 2️⃣
    },
    {
      src: path.resolve(__dirname, './public/manifest.json'),
      dest: './', // 2️⃣
    },
    {
      src: path.resolve(__dirname, './public/robots.txt'),
      dest: './', // 2️⃣
    },
  ],
};

// used for local development on safari
const shouldMockSsl = process.env.NODE_ENV === 'development' && process.env.HTTPS;

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true,
    hmr: { clientPort: 3000, port: 3000 },
    fs: {
      allow: ['..', '../node_modules/@matrix-org/matrix-sdk-crypto-wasm/pkg/matrix_sdk_crypto_wasm_bg.wasm'],
    },
  },
  resolve: {
    alias: {
      '@shared/constants': path.resolve('libs/constants/src/index.ts'),
    },
    dedupe: ['matrix-js-sdk'],
  },
  build: {
    target: 'es2015',
    sourcemap: true,
    outDir: 'dist',
    copyPublicDir: false,
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  plugins: [
    insertTranslationsVersion(),
    viteStaticCopy(copyFiles),
    svgr(),
    react(),
    tsconfigPaths(),
    viteCompression({
      filter: /\.(js|css|html|svg)$/,
      threshold: 10240,
      deleteOriginFile: false,
      algorithm: 'brotliCompress',
      compressionOptions: {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
      },
    }),
    pluginRewriteAll(),
    process.env.NODE_ENV !== 'test' &&
      importMetaEnv.vite({
        example: path.resolve(__dirname, 'deployment.env'),
      }),
    shouldMockSsl ? basicSsl() : null,
  ],
  optimizeDeps: {
    exclude: ['@matrix-org/matrix-sdk-crypto-wasm'],
  },
});
