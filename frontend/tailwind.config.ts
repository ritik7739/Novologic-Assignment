import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',
        surface: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        accent: '#0EA5E9',
        success: '#10B981',
        error: '#F43F5E',
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out',
        'slide-up': 'slide-up 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-soft': 'pulse-soft 1.8s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.68' },
        },
      },
      boxShadow: {
        'soft-sm': '0 1px 2px rgb(15 23 42 / 0.06), 0 8px 24px rgb(15 23 42 / 0.04)',
        soft: '0 1px 2px rgb(15 23 42 / 0.06), 0 18px 54px rgb(15 23 42 / 0.08)',
      },
    },
  },
  plugins: [typography],
};

export default config;
