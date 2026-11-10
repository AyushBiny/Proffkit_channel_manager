/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../packages/shared-ui/tailwind.config.js')],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  plugins: []
};
