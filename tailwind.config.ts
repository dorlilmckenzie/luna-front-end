import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Calm, feminine-but-not-childish palette. Muted rose + plum + warm neutrals.
        cream: '#FBF7F4',
        rose: {
          50: '#FDF2F3',
          100: '#FBE4E7',
          200: '#F5C6CD',
          300: '#ECA2AF',
          400: '#DE7A8D',
          500: '#C85A72',
          600: '#A8455C',
          700: '#853547',
        },
        plum: {
          50: '#F5F1F7',
          100: '#E9DFEE',
          200: '#D2BEDD',
          400: '#9B74AE',
          600: '#6E4A84',
          700: '#553866',
        },
        ink: {
          DEFAULT: '#3A2F35',
          soft: '#6B5C63',
          faint: '#9C8E94',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(58, 47, 53, 0.06), 0 8px 24px rgba(58, 47, 53, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
