/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#090b10',
          900: '#0f141f',
          850: '#151b29',
          800: '#1b2336',
          700: '#25304a',
          600: '#344365',
          gold: '#e5b869',
          amber: '#f59e0b',
          crimson: '#e11d48'
        }
      }
    },
  },
  plugins: [],
}
