/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito:  ['Nunito', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          600: '#3b5bdb',
          700: '#1a3db5',
          900: '#1a1f6e',
        },
        danger: {
          500: '#e53935',
          700: '#c62828',
        },
      },
      keyframes: {
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%':   { opacity: '0', transform: 'scale(0.97) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%':      { transform: 'translateY(-20px) scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.5s ease both',
        fadeIn:  'fadeIn 0.4s ease both',
        popIn:   'popIn 0.28s ease both',
        float1:  'float 8s ease-in-out infinite',
        float2:  'float 8s ease-in-out 3s infinite',
        float3:  'float 8s ease-in-out 5s infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}