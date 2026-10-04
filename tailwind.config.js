/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        datclam: {
          red: '#c81e2b',     // Official Client Red
          redDark: '#991b1b',
          green: '#459b1b',   // Official Client Green
          greenDark: '#2e6b12',
          yellow: '#f59e0b',  // Client Accent Yellow/Orange
          cream: '#fffbeb',   // Client Frame Cream
          dark: '#0f172a',
        },
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#c81e2b',
          600: '#b91c1c',
          700: '#991b1b',
        }
      },
      fontFamily: {
        chunky: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
