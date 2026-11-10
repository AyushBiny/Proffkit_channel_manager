/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../apps/mobile/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/desktop/src/renderer/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/website/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mmt: "#E23744",
        booking: "#003580",
        airbnb: "#FF385C",
        agoda: "#5E2E91",
        direct: "#10B981",
        premise: "#64748B"
      }
    }
  },
  plugins: []
};
