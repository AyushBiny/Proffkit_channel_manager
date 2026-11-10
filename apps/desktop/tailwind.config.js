/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../packages/shared-ui/tailwind.config.js')],
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx,html}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  plugins: []
};
