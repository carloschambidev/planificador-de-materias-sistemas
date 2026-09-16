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
      backgroundColor: {
        background: 'var(--color-bg-main)',
        'bg-secondary': 'var(--color-bg-secondary)',
        surface: {
          DEFAULT: 'var(--color-surface-main)',
          elevated: 'var(--color-surface-elevated)',
          hover: 'var(--color-surface-hover)',
          active: 'var(--color-surface-active)',
        },
        brand: {
          DEFAULT: 'var(--color-brand-utn)',
          hover: 'var(--color-brand-hover)',
          soft: 'var(--color-brand-soft)',
        },
        status: {
          locked: {
            DEFAULT: 'var(--color-status-locked)',
            soft: 'var(--color-badge-locked-bg)',
          },
          'not-started': {
            DEFAULT: 'var(--color-status-not-started)',
            soft: 'var(--color-badge-not-started-bg)',
          },
          current: {
            DEFAULT: 'var(--color-status-current)',
            soft: 'var(--color-badge-current-bg)',
          },
          regularized: {
            DEFAULT: 'var(--color-status-regularized)',
            soft: 'var(--color-badge-regularized-bg)',
          },
          approved: {
            DEFAULT: 'var(--color-status-approved)',
            soft: 'var(--color-badge-approved-bg)',
          },
          promoted: {
            DEFAULT: 'var(--color-status-promoted)',
            soft: 'var(--color-badge-promoted-bg)',
          },
        }
      },
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        brand: {
          DEFAULT: 'var(--color-brand-utn)',
          hover: 'var(--color-brand-hover)',
        },
        status: {
          locked: 'var(--color-badge-locked-text)',
          'not-started': 'var(--color-badge-not-started-text)',
          current: 'var(--color-badge-current-text)',
          regularized: 'var(--color-badge-regularized-text)',
          approved: 'var(--color-badge-approved-text)',
          promoted: 'var(--color-badge-promoted-text)',
        }
      },
      borderColor: {
        DEFAULT: 'var(--color-border-main)',
        border: 'var(--color-border-main)',
        sutil: 'var(--color-border-sutil)',
        brand: 'var(--color-brand-utn)',
        status: {
          locked: 'var(--color-badge-locked-border)',
          'not-started': 'var(--color-badge-not-started-border)',
          current: 'var(--color-badge-current-border)',
          regularized: 'var(--color-badge-regularized-border)',
          approved: 'var(--color-badge-approved-border)',
          promoted: 'var(--color-badge-promoted-border)',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.1)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.1)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.1)',
        'glow-yellow': '0 0 20px rgba(245, 158, 11, 0.1)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.1)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.18)',
        'elevated-light': '0 4px 16px rgba(15, 23, 42, 0.05)',
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
