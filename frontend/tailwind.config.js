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
        obsidian: {
          950: '#030305',
          900: '#07070a',
          850: '#0d0e14',
          800: '#13151f',
          750: '#1a1d2b',
          700: '#23273a',
          600: '#323752',
        },
        cinema: {
          950: '#050609',
          900: '#090b11',
          850: '#0f121c',
          800: '#161a29',
          750: '#1d2337',
          700: '#262e49',
          600: '#354167',
          gold: '#f59e0b',
          amber: '#fbbf24',
          crimson: '#f43f5e',
          neonCyan: '#06b6d4',
          neonPurple: '#a855f7',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Space Grotesk"', 'monospace']
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.98)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      boxShadow: {
        'glow-gold': '0 0 35px -5px rgba(245, 158, 11, 0.3)',
        'glow-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 35px -5px rgba(168, 85, 247, 0.3)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
