/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        risk: {
          low: '#10b981',
          'low-bg': 'rgba(16, 185, 129, 0.12)',
          medium: '#f59e0b',
          'medium-bg': 'rgba(245, 158, 11, 0.12)',
          high: '#ef4444',
          'high-bg': 'rgba(239, 68, 68, 0.12)',
        },
        dark: {
          bg: '#0b0f19',
          card: '#1e293b',
          border: 'rgba(255, 255, 255, 0.1)',
          input: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '1rem',
        'xl': '1.25rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.2)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
