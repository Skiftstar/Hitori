/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'bg-color': '#201e2b',
        'secondary-color': '#4c4a57',
        'highlight-color': '#41A4C4',
        'text-color': 'rgb(189, 168, 168)',
      }
    },
  },
  plugins: [],
}
