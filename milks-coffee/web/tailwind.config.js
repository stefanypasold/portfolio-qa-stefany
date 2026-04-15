/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'milks-green': '#064e3b',
        'milks-white': '#f9fafb',
      },
    },
  },
  plugins: [],
}