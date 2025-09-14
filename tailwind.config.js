/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aperio-blue': '#1E40AF',
        'deep-navy': '#1E293B',
        'accent-gold': '#F59E0B',
        'success-green': '#10B981',
        'warning-red': '#EF4444',
        'info-blue': '#3B82F6',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Crimson Text', 'serif'],
      }
    },
  },
  plugins: [],
}