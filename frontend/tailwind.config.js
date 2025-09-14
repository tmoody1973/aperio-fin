/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'aperio-primary': '#1a1a1a',
        'aperio-secondary': '#2c2c2c',
        'aperio-accent': '#d4af37',
        'aperio-blue': '#0f4c75',
        'aperio-navy': '#003366',
      },
      fontFamily: {
        'serif': ['Charter', 'Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'Helvetica Neue', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}