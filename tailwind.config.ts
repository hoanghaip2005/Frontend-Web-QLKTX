import type { Config } from 'tailwindcss';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
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
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 10px 30px rgb(15 23 42 / 0.08)',
      },
      ringWidth: {
        3: '3px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [animate, containerQueries],
} satisfies Config;
