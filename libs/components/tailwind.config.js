const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
  content: [join(__dirname, './src/**/*.{ts,tsx,html}'), ...createGlobPatternsForDependencies(__dirname)],
  safelist: [
    {
      pattern: /./,
    },
  ],
  variants: {
    extend: {},
  },
  plugins: [],
};
