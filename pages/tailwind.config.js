/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(124, 58, 237, 0.35)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3.2s ease-in-out infinite',
        drift: 'drift 18s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        drift: {
          '0%': { transform: 'translateX(-8%) translateY(0%) rotate(0deg)' },
          '100%': { transform: 'translateX(8%) translateY(2%) rotate(10deg)' },
        },
      },
    },
  },
  plugins: [],
}

