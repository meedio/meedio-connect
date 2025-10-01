module.exports = {
  presets: [require('./tailwind-workspace-preset.js')],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx,html}',
    './libs/**/*.{ts,tsx,js,jsx,html}',
  ],
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class',
};
