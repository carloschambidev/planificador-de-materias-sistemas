/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Estado colors
        bloqueada: {
          DEFAULT: '#374151',
          light: '#4B5563',
          text: '#9CA3AF',
        },
        'no-iniciada': {
          DEFAULT: '#1F2937',
          light: '#374151',
          text: '#6B7280',
        },
        cursando: {
          DEFAULT: '#1D4ED8',
          light: '#2563EB',
          glow: '#3B82F6',
          text: '#93C5FD',
        },
        regularizada: {
          DEFAULT: '#B45309',
          light: '#D97706',
          glow: '#F59E0B',
          text: '#FCD34D',
        },
        'debe-final': {
          DEFAULT: '#C2410C',
          light: '#EA580C',
          glow: '#F97316',
          text: '#FDBA74',
        },
        aprobada: {
          DEFAULT: '#15803D',
          light: '#16A34A',
          glow: '#22C55E',
          text: '#86EFAC',
        },
        promocionada: {
          DEFAULT: '#047857',
          light: '#059669',
          glow: '#10B981',
          text: '#6EE7B7',
        },
        // UI colors
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          800: '#1E293B',
          850: '#172033',
          900: '#0F172A',
          950: '#080D1A',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-yellow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
