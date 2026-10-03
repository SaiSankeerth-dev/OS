/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        os: {
          bg: 'var(--bg-app)',
          surface: 'var(--bg-surface)',
          'surface-elevated': 'var(--bg-surface-elevated)',
          'surface-active': 'var(--bg-surface-active)',
          border: 'var(--border-subtle)',
          'border-glass': 'var(--border-glass)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent-primary)',
          cyan: 'var(--accent-secondary)',
          warning: 'var(--accent-warning)',
          danger: 'var(--accent-danger)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'glass-sm': '8px',
        'glass-md': '14px',
        'glass-lg': '20px',
        'glass-xl': '28px',
      },
      boxShadow: {
        'glass-glow': '0 0 30px -5px rgba(52, 211, 153, 0.15)',
        'glass-glow-cyan': '0 0 30px -5px rgba(56, 189, 248, 0.2)',
        'glass-glow-amber': '0 0 30px -5px rgba(245, 158, 11, 0.2)',
        'glass-glow-danger': '0 0 30px -5px rgba(239, 68, 68, 0.2)',
        'elevation-dark': '0 12px 36px -8px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3)',
        'elevation-light': '0 12px 32px -6px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
