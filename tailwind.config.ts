import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          600: '#0F766E',
          700: '#115E59',
          900: '#134E4A',
        },
        surface: '#F5F7FA',
        ink: '#101828',
      },
      borderRadius: {
        app: '8px',
      },
      boxShadow: {
        soft: '0 10px 30px rgb(15 23 42 / 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
