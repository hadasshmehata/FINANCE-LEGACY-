/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          bg: '#061525',
          bgSecondary: '#0B1E32',
          card: '#10283D',
          cardHover: '#13334E',
          border: '#1E3A5F',
          borderLight: '#2B4E7A',
          primary: '#10B981',
          primaryHover: '#059669',
          accent: '#22D3EE',
          accentHover: '#06B6D4',
          text: '#F8FAFC',
          muted: '#94A3B8',
          warning: '#F59E0B',
          danger: '#EF4444',
          gold: '#EAB308',
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-cyan': '0 0 20px -3px rgba(34, 211, 238, 0.35)',
        'glow-gold': '0 0 20px -3px rgba(234, 179, 8, 0.35)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

