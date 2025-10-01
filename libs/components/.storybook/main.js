/* eslint-disable @typescript-eslint/no-var-requires */
const { mergeConfig } = require('vite');
const viteTsconfig = require('vite-tsconfig-paths');
const tsconfigPaths = viteTsconfig.default;

module.exports = {
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: './libs/components/vite.config.ts',
      },
    },
  },
  stories: ['../src/lib/**/*.stories.mdx', '../src/lib/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@nx/react/plugins/storybook'],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()],
    });
  },
};
