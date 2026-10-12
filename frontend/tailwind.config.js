/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        campus: {
          darkest: '#070D1E',
          navy: '#0B132B',
          surface: '#141E38',
          card: '#1C2541',
          border: '#2A3B66',
          blue: '#3A86FF',
          teal: '#00F5D4',
          accent: '#4361EE',
          muted: '#8D99AE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
