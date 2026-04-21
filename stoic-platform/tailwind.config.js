/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        agrandir: ['Agrandir', 'Inter', 'sans-serif'],
        sans: ['Agrandir', 'Inter', 'sans-serif'],
      },
      colors: {
        stoic: {
          black: '#0A0A0A',
          white: '#FAFAFA',
          navy: '#0A1628',
          gold: '#C9A84C',
          'gold-light': '#F0D98A',
          gray: '#F4F4F2',
          'gray-mid': '#8A8A8A',
          border: '#E8E8E4',
        },
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['4rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'body-xl': ['1.25rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
        'body-md': ['1rem', { lineHeight: '1.7' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'stoic': '0 4px 24px rgba(10,22,40,0.08)',
        'stoic-lg': '0 8px 48px rgba(10,22,40,0.12)',
        'stoic-xl': '0 16px 64px rgba(10,22,40,0.16)',
        'gold': '0 4px 24px rgba(201,168,76,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
