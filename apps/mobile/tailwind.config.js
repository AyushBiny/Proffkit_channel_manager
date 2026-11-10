/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('nativewind/preset'),
    require('../../packages/shared-ui/tailwind.config.js')
  ],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/shared-ui/src/**/*.{js,jsx,ts,tsx}'
  ],
  plugins: []
};
